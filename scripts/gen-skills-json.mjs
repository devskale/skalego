// Prebuild: read the `skills` array from the "recommended-skills" blog entry's
// frontmatter and emit api/skills.registry.js — legacy Vercel-function artifact.
// The live install endpoints are STATIC since the amd2 migration: the Astro
// integration in astro.config.mjs (skillsStatic) writes dist/s/<slug> on every
// `astro build`. This script only remains for Vercel-era compat / tooling.
// The blog entry (markdown) is the ONE source of truth; this file is a
// generated artifact (gitignored).
import fs from 'node:fs';
import path from 'node:path';
import { buildRegistry } from './skills-lib.mjs';

const OUT = 'api/skills.registry.js';

const registry = buildRegistry();

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, 'export default ' + JSON.stringify({ skills: registry }, null, 2) + ';\n');
console.log(`[gen-skills-json] wrote ${Object.keys(registry).length} skills → ${OUT} (${Object.keys(registry).join(', ')})`);
