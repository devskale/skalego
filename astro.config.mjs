// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';

// Keystatic admin UI is dev-only: included in `astro dev` so you can write posts
// visually at localhost:4321/keystatic (local storage → writes .md files).
// Excluded from `astro build`, so the production site stays pure static / zero-JS.
const isDev = process.env.NODE_ENV !== 'production';

// https://astro.build/config
export default defineConfig({
  site: 'https://skale.dev',
  integrations: [isDev ? react() : null, mdx(), sitemap(), isDev ? keystatic() : null].filter(
    Boolean
  ),
  build: {
    format: 'directory',
    inlineStylesheets: 'auto',
  },
});
