// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
// Static output → dist/. API routes + rewrites handled by Vercel
// (api/ folder auto-detected; vercel.json keeps rewrites/redirects).
export default defineConfig({
  site: 'https://skale.dev',
  integrations: [mdx(), sitemap()],
  build: {
    // /apps/ instead of /apps.html; small CSS inlined for speed
    format: 'directory',
    inlineStylesheets: 'auto',
  },
});
