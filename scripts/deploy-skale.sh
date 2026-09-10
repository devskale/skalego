#!/usr/bin/env bash
# deploy-skale.sh — one-shot deploy of the skale.dev Astro build to amd2.
#
#   ./scripts/deploy-skale.sh [--build] [--host amd2]
#
# Builds locally (optional), then rsyncs dist/ over the live webroot on amd2.
#
# IMPORTANT: this is an OVERLAY sync — it copies the fresh build over the live
# site but NEVER deletes anything (no --delete). Alt-lasten im live-root sterben
# dadurch nicht automatisch — stale-ordner (z.b. dist/firmenindex) werden im
# build-schritt aktiv entfernt (siehe unten).
#
# SEIT DER TRENNUNG 2026-09-10 gilt: die firmenindex-app wohnt in
# /var/www/firmenindex (eigenes verzeichnis + nginx location ^~ /firmenindex/ +
# eigener deploy aus dem firmenbuch_AT-repo). DIESER deploy darf NIEMALS
# firmenindex-dateien enthalten: public/firmenindex wurde deshalb aus dem repo
# entfernt (c0651f8) und der script bricht ab, wenn dist/firmenindex auftaucht
# (stale-dist-bewacher unten).
#
# Host: amd2 (see ~/.ssh/config → amd2.skale.dev, user ubuntu, key ~/.ssh/oci)
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CONFIG_FILE="$ROOT/deploy.config"

# --- defaults (overridden by deploy.config, then by CLI args) ---
HOST="amd2"
REMOTE_DIR="/var/www/skale.dev"
DIST="$ROOT/dist"
BUILD=0

# --- load deploy.config if present ---
if [ -f "$CONFIG_FILE" ]; then
  # shellcheck disable=SC1090
  . "$CONFIG_FILE"
  # resolve relative DIST against repo root
  case "$DEPLOY_DIST" in
    /*) DIST="$DEPLOY_DIST" ;;
    *)  DIST="$ROOT/$DEPLOY_DIST" ;;
  esac
  HOST="${DEPLOY_HOST:-$HOST}"
  REMOTE_DIR="${DEPLOY_REMOTE_DIR:-$REMOTE_DIR}"
fi

# --- CLI args override config ---
while [ "$#" -gt 0 ]; do
  case "$1" in
    --build) BUILD=1 ;;
    --host=*) HOST="${1#--host=}" ;;
    --host) shift; [ "$#" -ge 1 ] && HOST="$1" || { echo "--host needs a value" >&2; exit 1; } ;;
    --remote-dir=*) REMOTE_DIR="${1#--remote-dir=}" ;;
    -h|--help)
      echo "Usage: $0 [--build] [--host HOST] [--remote-dir DIR]"
      echo "  Config source: $CONFIG_FILE (DEPLOY_HOST, DEPLOY_REMOTE_DIR, DEPLOY_DIST)"
      exit 0 ;;
    *) echo "unknown arg: $1" >&2; exit 1 ;;
  esac
  shift
done

echo "▶ Using host=$HOST remote=$REMOTE_DIR dist=$DIST"
[ -n "$HOST" ] || { echo "✗ no host configured" >&2; exit 1; }

# ── guard 1: dirty-tree → laut abbruch (stale/wild-mix-verhinderung) ──
if [ -d "$ROOT/.git" ]; then
  if ! git -C "$ROOT" diff --quiet || ! git -C "$ROOT" diff --cached --quiet; then
    echo "✗ ABBRUCH: uncommittete Änderungen im skalego-repo — erst committen (oder --force)." >&2
    git -C "$ROOT" status --short | head -5 >&2
    exit 1
  fi
fi

if [ "$BUILD" = "1" ]; then
  echo "▶ Building (astro build)…"
  rm -rf "$DIST"                       # stale-artefakte tot (kein misch-build)
  ( cd "$ROOT" && node_modules/.bin/astro build )
fi

[ -d "$DIST" ] || { echo "✗ no dist/ — run with --build first" >&2; exit 1; }

# ── guard 2: stale-dist-bewacher — die firmenindex-app-kopie darf NIE
# wieder in den build (sie überschrieb die live-app, vorfall 2026-09-10)
if [ -d "$DIST/firmenindex" ]; then
  echo "✗ ABBRUCH: dist/firmenindex existiert — stale app-kopie im build!"
  echo "   rm -rf dist/firmenindex (und public/firmenindex im repo prüfen)." >&2
  exit 1
fi

# ── guard 3: stale-dist-warnung — dist älter als die neueste source? ──
if [ "$BUILD" != "1" ]; then
  NEWEST_SRC=$(find "$ROOT/src" "$ROOT/public" "$ROOT/astro.config.mjs" -type f -newer "$DIST/index.html" 2>/dev/null | head -3)
  if [ -n "$NEWEST_SRC" ]; then
    echo "✗ ABBRUCH: dist/ ist STALE (source jünger als der build):" >&2
    echo "$NEWEST_SRC" >&2
    echo "   → ./scripts/deploy-skale.sh --build" >&2
    exit 1
  fi
fi

# ── post-deploy-smoke: serviert skale.dev den eben deployten index? ──
# (diff gegen die lokale dist/index.html — der „immer aktuellste version
#  on“-beweis, analog frontendsmoke im firmenbuch-repo)

echo "▶ Verifying remote dir exists…"
ssh "$HOST" "[ -d '$REMOTE_DIR' ] || { echo '✗ remote dir missing'; exit 1; }"

echo "▶ Syncing $DIST → $HOST:$REMOTE_DIR (overlay, no --delete)…"
rsync -az --stats \
  -e "ssh -o ConnectTimeout=15" \
  "$DIST"/ "$HOST:$REMOTE_DIR/"

sleep 1
SMOKE_REMOTE="$(curl -s -m 15 https://skale.dev/ | md5 -q 2>/dev/null || echo curlfail)"
SMOKE_LOCAL="$(md5 -q "$DIST/index.html")"
if [ "$SMOKE_REMOTE" != "$SMOKE_LOCAL" ]; then
  echo "✗ POST-DEPLOY-SMOKE GESCHEITERT: skale.dev/ liefert NICHT den eben deployten index.html"
  echo "   (remote=$SMOKE_REMOTE local=$SMOKE_LOCAL) — konkurrierender deploy oder nginx-cache?" >&2
  exit 1
fi
echo "✓ post-deploy-smoke: skale.dev/ serviert den neuen build"

echo "▶ Done. Verify with: curl -sI https://skale.dev/tos/"
