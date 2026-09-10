#!/usr/bin/env bash
# deploy-skale.sh — one-shot deploy of the skale.dev Astro build to amd2.
#
#   ./scripts/deploy-skale.sh [--build] [--host amd2]
#
# Builds locally (optional), then rsyncs dist/ over the live webroot on amd2.
#
# IMPORTANT: this is an OVERLAY sync — it copies the fresh build over the live
# site but NEVER deletes anything (no --delete). The live /var/www/skale.dev
# contains server-only files that are NOT part of the Astro build, most notably
# the firmenindex/ backend (api.php, search.js, router.js, detail-*.js, ...).
# A --delete would wipe those, so it is deliberately omitted.
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

if [ "$BUILD" = "1" ]; then
  echo "▶ Building (astro build)…"
  ( cd "$ROOT" && node_modules/.bin/astro build )
fi

[ -d "$DIST" ] || { echo "✗ no dist/ — run with --build first" >&2; exit 1; }

echo "▶ Verifying remote dir exists…"
ssh "$HOST" "[ -d '$REMOTE_DIR' ] || { echo '✗ remote dir missing'; exit 1; }"

echo "▶ Syncing $DIST → $HOST:$REMOTE_DIR (overlay, no --delete)…"
rsync -az --stats \
  -e "ssh -o ConnectTimeout=15" \
  "$DIST"/ "$HOST:$REMOTE_DIR/"

echo "▶ Done. Verify with: curl -sI https://skale.dev/tos/"
