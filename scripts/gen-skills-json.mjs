// Prebuild: read the `skills` array from the "recommended-skills" blog entry's
// frontmatter and emit api/skills.generated.json — the machine-readable registry
// the /s/<slug> function reads at runtime. The blog entry (markdown) is the ONE
// source of truth; this file is a generated artifact (gitignored).
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
const OUT = 'api/skills.registry.js';
const DEFAULT_SOURCE = 'devskale/skale-skills';

function readFrontmatter(fp) {
  const raw = fs.readFileSync(fp, 'utf8');
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return m ? yaml.load(m[1]) : null;
}

let skills = null;
for (const dir of fs.readdirSync(BLOG_DIR)) {
  for (const f of ['index.mdx', 'index.md']) {
    const fp = path.join(BLOG_DIR, dir, f);
    if (!fs.existsSync(fp)) continue;
    const fm = readFrontmatter(fp);
    if (fm && Array.isArray(fm.skills) && fm.skills.length) { skills = fm.skills; break; }
  }
  if (skills) break;
}
if (!skills) {
  console.error('[gen-skills-json] no blog entry with a `skills` array found in', BLOG_DIR);
  process.exit(1);
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
  return entry;
}

const registry = {};
for (const s of skills) registry[s.slug] = expand(s);

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, 'export default ' + JSON.stringify({ skills: registry }, null, 2) + ';\n');
console.log(`[gen-skills-json] wrote ${Object.keys(registry).length} skills → ${OUT} (${Object.keys(registry).join(', ')})`);
