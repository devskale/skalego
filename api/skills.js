// api/skills.js — Vercel function. Serves the install script for a skill.
// Route: /s/:slug  (via vercel.json rewrite)  →  /api/skills?slug=:slug
// Usage:  curl -fsSL https://skale.dev/s/<slug> | bash
//
// Data source: api/skills.generated.json (generated at build time by
// scripts/gen-skills-json.mjs from the "recommended-skills" blog entry's
// frontmatter). That blog entry is the single source of truth.
// Data source: api/skills.registry.js — a generated ESM module (built by
// scripts/gen-skills-json.mjs from the "recommended-skills" blog entry's
// frontmatter). Static import so Vercel bundles it with the function. The blog
// entry is the single source of truth; this file is a generated artifact (gitignored).
import registry from './skills.registry.js';
const skills = registry.skills || {};

// Build the bash install script for a registry entry.
function bashScript(skill, slug) {
  const head = `#!/usr/bin/env bash
# ${slug} — ${skill.desc}
set -euo pipefail
`;

  if (skill.type === "command") {
    return head + skill.install + "\n";
  }

  if (skill.type === "pi-skill" || skill.type === "pi-skillset") {
    const names = skill.type === "pi-skill" ? [skill.title || slug] : skill.names;
    const namesJson = JSON.stringify(names);
    // Ensure the pi package is installed, then idempotently add the skill name(s)
    // to that package's `skills` whitelist in settings.json. (pi-native enable;
    // avoids the loose-symlink vs package co-load conflict.)
    return head + `
SOURCE="${skill.source}"
PKG="git:github.com/\${SOURCE}"
SETTINGS="\$HOME/.pi/agent/settings.json"
command -v pi >/dev/null 2>&1 || { echo "✗ pi not found — install it first: https://pi.farm" >&2; exit 1; }
grep -q "\${SOURCE}" "\${SETTINGS}" 2>/dev/null || pi install "\${PKG}"
python3 - '${namesJson}' "\${SOURCE}" <<'PY'
import json, sys, pathlib
names = json.loads(sys.argv[1]); src = sys.argv[2]
p = pathlib.Path.home() / ".pi/agent/settings.json"
s = json.loads(p.read_text())
pkg = next((x for x in s.get("packages", []) if isinstance(x, dict) and src in x.get("source", "")), None)
if pkg is None:
    raise SystemExit("package %s not found in %s — run: pi install git:github.com/%s" % (src, p, src))
arr = pkg.setdefault("skills", [])
for n in names:
    if n not in arr:
        arr.append(n)
p.write_text(json.dumps(s, indent=2) + "\\n")
print("✓ enabled " + ", ".join(names) + " — restart pi to load")
PY
`;
  }

  return head + `echo "✗ unsupported skill type: ${skill.type}" >&2; exit 1\n`;
}

export default function handler(req, res) {
  // slug may arrive as ?slug= (from /s/:slug rewrite) and may carry a trailing .sh
  const raw = (req.query.slug || "").trim();
  const slug = raw.replace(/\.sh$/i, "").replace(/^\/+/, "");
  const skill = skills[slug];

  if (!skill) {
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    const visible = Object.keys(skills).filter((k) => !skills[k].hidden);
    res.send(
      (visible.length
        ? `available: ${visible.join(", ")}\n`
        : `(registry not generated — run: node scripts/gen-skills-json.mjs)\n`) +
        `browse: https://skale.dev/skills\n`
    );
    return;
  }

  res.statusCode = 200;
  res.setHeader("Content-Type", "text/x-shellscript; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=60, must-revalidate");
  res.send(bashScript(skill, slug));
}
