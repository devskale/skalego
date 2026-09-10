#!/usr/bin/env bash
# vercel-skalego.sh — agentic READ-ONLY access to the skalego Vercel project.
#
# Auth: a team-scoped token in ../skalego.token (gitignored). Because the token
# is team-scoped, the Vercel CLI fails its personal /v2/user check ("User not
# found"); this script talks to the REST API directly with ?slug=<team> instead.
#
# Deploys themselves stay `git push origin main` (per AGENTS.md). This tool only
# observes: deployments, inspect, build logs, env vars, project info.
set -euo pipefail

# --- resolve repo root (this script lives in scripts/) ---
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TOKEN_FILE="$ROOT/skalego.token"

# --- project metadata (not secret; mirrors ../vercel.project.md) ---
PROJECT_ID="prj_ie7zXXvL2qQxM6W6BhtnNWWmyEDO"
TEAM_SLUG="skaleios-projects"
TEAM_ID="team_XjFOjFg9jUySdTXHOc9Gdj3S"
BASE="https://api.vercel.com"

die() { echo "✗ $*" >&2; exit 1; }

# --- load token ---
[ -f "$TOKEN_FILE" ] || die "token file not found: $TOKEN_FILE (create it from https://vercel.com/account/tokens)"
TOKEN="$(tr -d '[:space:]' < "$TOKEN_FILE")"
[ "${#TOKEN}" -ge 20 ] || die "token in $TOKEN_FILE looks empty/invalid"
AUTH=("Authorization: Bearer $TOKEN")

# GET a team-scoped endpoint; $1=path, $2=extra query (key=val&key=val)
api_get() {
  local path="$1" extra="${2:-}"
  local url="$BASE$path?slug=$TEAM_SLUG${extra:+&$extra}"
  local tmp; tmp="$(mktemp)"
  local code; code="$(curl -sSL -o "$tmp" -w "%{http_code}" -H "${AUTH[0]}" "$url" || echo "000")"
  if [ "${code:0:1}" != "2" ]; then
    echo "✗ HTTP $code on GET $path" >&2
    head -c 500 "$tmp" >&2; echo >&2
    rm -f "$tmp"; return 1
  fi
  cat "$tmp"; rm -f "$tmp"
}

# pipe JSON through a python formatter, unless VERCEL_SKALEGO_JSON=1
show() {
  if [ "${VERCEL_SKALEGO_JSON:-0}" = "1" ]; then cat; else python3 -c "$1"; fi
}

usage() {
  cat <<EOF
vercel-skalego — read-only Vercel access for the skalego project

Usage: $(basename "$0") <command> [args]

Commands:
  deployments [N]     list N most recent deployments (default 10)
  inspect <dpl_id>    details of one deployment
  logs <dpl_id>       build log events for a deployment
  env                 project env vars (names + targets, NOT values)
  project             project info (framework, targets, aliases)
  whoami              confirm the token reaches skalego

Env:
  VERCEL_SKALEGO_JSON=1   emit raw JSON instead of pretty tables
EOF
}

cmd_deployments() {
  local n="${1:-10}"
  api_get "/v6/deployments" "projectId=$PROJECT_ID&limit=$n" | show '
import sys,json,time
d=json.load(sys.stdin)
deps=d.get("deployments") or []
if not deps: print("(no deployments)"); sys.exit()
print("STATE    CREATED             BRANCH      DEPLOYMENT ID                  MESSAGE")
for dep in deps:
    st=(dep.get("state") or "?").ljust(8)
    ts=(dep.get("createdAt") or 0)/1000.0
    when=time.strftime("%Y-%m-%d %H:%M",time.gmtime(ts)) if ts else "-"
    when=when.ljust(19)
    meta=dep.get("meta") or {}
    branch=((meta.get("githubCommitRef") or "-").ljust(10))[:10]
    uid=(dep.get("uid") or "").ljust(30)
    msg=(meta.get("githubCommitMessage") or "").replace(chr(10)," ")[:46]
    print(st+" "+when+" "+branch+" "+uid+" "+msg)
'
}

cmd_inspect() {
  local id="$1"
  api_get "/v13/deployments/$id" | show '
import sys,json,time
d=json.load(sys.stdin)
meta=d.get("meta") or {}
ts=(d.get("createdAt") or 0)/1000.0
when=time.strftime("%Y-%m-%d %H:%M:%S UTC",time.gmtime(ts)) if ts else "-"
print("uid      :",d.get("uid"))
print("url      :",d.get("url"))
print("state    :",d.get("readyState") or d.get("state"))
print("target   :",d.get("target"))
print("created  :",when)
print("branch   :",meta.get("githubCommitRef"))
sha=(meta.get("githubCommitSha") or "")[:12]
print("commit   :",sha,(meta.get("githubCommitMessage") or "").replace(chr(10)," "))
print("alias    :",", ".join(d.get("alias") or []))
'
}

cmd_logs() {
  local id="$1"
  api_get "/v3/deployments/$id/events" "limit=500" | show '
import sys,json
raw=sys.stdin.read()
try: d=json.loads(raw)
except Exception: print(raw[:3000]); sys.exit()
evs=d.get("events") if isinstance(d,dict) else d
if not isinstance(evs,list):
    print(json.dumps(d,indent=2)[:3000]); sys.exit()
n=0
for ev in evs:
    if not isinstance(ev,dict): continue
    p=ev.get("payload") if isinstance(ev.get("payload"),dict) else {}
    txt=p.get("text") or ev.get("text") or ev.get("message")
    if txt:
        t=ev.get("type") or ""
        print(("["+t+"] " if t and t!="line" else "")+str(txt).rstrip())
        n+=1
if n==0: print("(no text events; set VERCEL_SKALEGO_JSON=1 to see raw)")
'
}

cmd_env() {
  api_get "/v9/projects/$PROJECT_ID/env" | show '
import sys,json
d=json.load(sys.stdin)
envs=d.get("envs") or []
if not envs: print("(no env vars)"); sys.exit()
print("KEY                              TYPE      TARGETS")
for e in envs:
    key=((e.get("key") or "?").ljust(32))[:32]
    t=((e.get("type") or "?").ljust(8))[:8]
    targets=",".join(e.get("target") or [])
    print(key+" "+t+" "+targets)
'
}

cmd_project() {
  api_get "/v9/projects/$PROJECT_ID" | show '
import sys,json
d=json.load(sys.stdin)
tg=d.get("targets") or {}
prod=tg.get("production") or {}
print("name      :",d.get("name"))
print("id        :",d.get("id"))
print("framework :",d.get("framework"))
print("node ver  :",d.get("nodeVersion"))
print("targets   :",", ".join(list(tg.keys())))
print("prod alias:",", ".join(prod.get("alias") or []))
print("install   :",d.get("installCommand"))
print("build     :",d.get("buildCommand"))
print("output    :",d.get("outputDirectory"))
'
}

cmd_whoami() {
  api_get "/v9/projects/$PROJECT_ID" | show '
import sys,json
d=json.load(sys.stdin)
print("token OK")
print("  project :",d.get("name"),"/",d.get("id"))
print("  team    :",d.get("accountId"))
'
}

case "${1:-}" in
  deployments|deps|ls) shift; cmd_deployments "${1:-10}" ;;
  inspect|i) shift; [ "${1:-}" ] || die "usage: inspect <dpl_id>"; cmd_inspect "$1" ;;
  logs) shift; [ "${1:-}" ] || die "usage: logs <dpl_id>"; cmd_logs "$1" ;;
  env|envs) cmd_env ;;
  project|info) cmd_project ;;
  whoami|check) cmd_whoami ;;
  ""|-h|--help|help) usage ;;
  *) die "unknown command: $1"; echo >&2; usage >&2; exit 1 ;;
esac
