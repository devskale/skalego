#!/usr/bin/env bash
# Bundle-install the mattpocock architecture family (6 skills) into .agents/skills/
# via `npx skills experimental_install` — WITHOUT touching the user's project
# skills-lock.json. Hashes are computed at runtime from the current SKILL.md files,
# so this never goes stale when upstream updates.
#
# Invoked by: curl -fsSL https://skale.dev/s/improve-architecture | bash
# (which fetches this file from raw.githubusercontent.com and runs it)
set -euo pipefail
ORIG="$PWD"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

python3 - "$TMP/skills-lock.json" <<'PY'
import json, urllib.request, hashlib, sys
paths = {
  "improve-codebase-architecture": "skills/engineering/improve-codebase-architecture/SKILL.md",
  "codebase-design":               "skills/engineering/codebase-design/SKILL.md",
  "domain-modeling":               "skills/engineering/domain-modeling/SKILL.md",
  "grill-with-docs":               "skills/engineering/grill-with-docs/SKILL.md",
  "grilling":                      "skills/productivity/grilling/SKILL.md",
  "grill-me":                      "skills/productivity/grill-me/SKILL.md",
}
lock = {"version": 1, "skills": {}}
for name, p in paths.items():
    raw = urllib.request.urlopen("https://raw.githubusercontent.com/mattpocock/skills/main/" + p).read()
    lock["skills"][name] = {"source": "mattpocock/skills", "sourceType": "github",
                            "skillPath": p, "computedHash": hashlib.sha256(raw).hexdigest()}
open(sys.argv[1], "w").write(json.dumps(lock, indent=2))
print("  lockfile: %d skills (hashes computed live)" % len(lock["skills"]), file=sys.stderr)
PY

# Run the native bundle installer in a temp dir so the user's own skills-lock.json
# is never touched; then copy the result into their project's .agents/skills/.
( cd "$TMP" && npx -y skills@latest experimental_install -y ) || true   # CLI exits 1 even on success (telemetry); don't let set -e abort before the copy-back

mkdir -p "$ORIG/.agents/skills"
if [ -d "$TMP/.agents/skills" ]; then
  cp -R "$TMP/.agents/skills/." "$ORIG/.agents/skills/"
fi
echo "✓ architecture family (6 skills) installed → $ORIG/.agents/skills/"
ls -1 "$ORIG/.agents/skills" 2>/dev/null | sed 's/^/  • /'
