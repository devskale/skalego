// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import fs from 'node:fs';
import path from 'node:path';
import { buildRegistry, bashScript, notFoundText } from './scripts/skills-lib.mjs';

// skillsStatic — write one static install-script file per skill into dist/s/<slug>
// at build done. Serves `curl -fsSL https://skale.dev/s/<slug> | bash` from plain
// nginx (try_files) since the amd2 migration — no serverless runtime needed.
// Hidden skills stay installable via /s/<slug>, matching the retired Vercel fn.
function skillsStatic() {
  return {
    name: 'skills-static',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const registry = buildRegistry();
        const sDir = path.join(dir.pathname, 's');
        fs.mkdirSync(sDir, { recursive: true });
        for (const [slug, skill] of Object.entries(registry)) {
          fs.writeFileSync(path.join(sDir, slug), bashScript(skill, slug));
        }
        fs.writeFileSync(path.join(sDir, 'available'), notFoundText(registry));
        logger.info(
          `skills-static: wrote ${Object.keys(registry).length} install scripts → dist/s/ (${Object.keys(registry).join(', ')})`
        );
      },
    },
  };
}

// Keystatic admin UI is dev-only: included in `astro dev` so you can write posts
// visually at localhost:4321/keystatic (local storage → writes .md files).
// Excluded from `astro build`, so the production site stays pure static / zero-JS.
const isDev = process.env.NODE_ENV !== 'production';

// https://astro.build/config
export default defineConfig({
  site: 'https://skale.dev',
  integrations: [isDev ? react() : null, mdx(), sitemap(), isDev ? keystatic() : null, skillsStatic()].filter(
    Boolean
  ),
  build: {
    format: 'directory',
    inlineStylesheets: 'auto',
  },
});
