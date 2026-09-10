// skills-lib.mjs — shared skills-registry logic.
// Single source of truth: the `skills[]` array in the "recommended-skills"
// blog entry's frontmatter. Used by:
//   - scripts/gen-skills-json.mjs   (legacy Vercel registry, api/skills.registry.js)
//   - astro.config.mjs              (static /s/<slug> files in dist/, amd2)
//
// Compact install format (in frontmatter) → expanded registry entry:
//   pi-skill                → { type: pi-skill, source: devskale/skale-skills }
//   pi-skillset:a,b,c       → { type: pi-skillset, names:[a,b,c], source: … }
//   command:<cmd>           → { type: command, install: <cmd> }
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const yaml = createRequire(import.meta.url)('js-yaml');

const BLOG_DIR = 'src/content/blog';
const DEFAULT_SOURCE = 'devskale/skale-skills';

function readFrontmatter(fp) {
  const raw = fs.readFileSync(fp, 'utf8');
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return m ? yaml.load(m[1]) : null;
}

// Find the one blog entry carrying the `skills[]` registry array.
export function findSkillsEntry(blogDir = BLOG_DIR) {
  for (const dir of fs.readdirSync(blogDir)) {
    for (const f of ['index.mdx', 'index.md']) {
      const fp = path.join(blogDir, dir, f);
      if (!fs.existsSync(fp)) continue;
      const fm = readFrontmatter(fp);
      if (fm && Array.isArray(fm.skills) && fm.skills.length) return fm.skills;
    }
  }
  return null;
}

function expand(s) {
  const entry = { title: s.slug, desc: s.desc || '' };
  const inst = String(s.install || '').trim();
  if (inst === 'pi-skill') {
    entry.type = 'pi-skill';
    entry.source = DEFAULT_SOURCE;
  } else if (inst.startsWith('pi-skillset:')) {
    entry.type = 'pi-skillset';
    entry.names = inst.slice('pi-skillset:'.length).split(',').map((x) => x.trim()).filter(Boolean);
    entry.source = DEFAULT_SOURCE;
  } else if (inst.startsWith('command:')) {
    entry.type = 'command';
    entry.install = inst.slice('command:'.length);
  } else {
    entry.type = 'command';
    entry.install = inst;
  }
  entry.hidden = !!s.hidden;
  return entry;
}

// Full expanded registry keyed by slug (hidden entries included).
export function buildRegistry() {
  const skills = findSkillsEntry();
  if (!skills) {
    console.error('[skills-lib] no blog entry with a `skills` array found in', BLOG_DIR);
    process.exit(1);
  }
  const registry = {};
  for (const s of skills) registry[s.slug] = expand(s);
  return registry;
}

// The bash install script for a registry entry — byte-identical to what the
// retired Vercel function (api/skills.js) served at /s/<slug>.
export function bashScript(skill, slug) {
  const head = `#!/usr/bin/env bash
# ${slug} — ${skill.desc}
set -euo pipefail
`;

  if (skill.type === 'command') {
    return head + skill.install + '\n';
  }

  if (skill.type === 'pi-skill' || skill.type === 'pi-skillset') {
    const names = skill.type === 'pi-skill' ? [skill.title || slug] : skill.names;
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

// Body served for unknown slugs (the retired function's 404 text).
export function notFoundText(registry) {
  const visible = Object.keys(registry).filter((k) => !registry[k].hidden);
  return (
    (visible.length
      ? `available: ${visible.join(', ')}\n`
      : `(registry not generated — run: node scripts/gen-skills-json.mjs)\n`) +
    `browse: https://skale.dev/skills\n`
  );
}
