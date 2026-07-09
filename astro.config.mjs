// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
// Static output (default) → dist/. API routes + rewrites handled by Vercel
// (api/ folder is auto-detected; vercel.json keeps rewrites/redirects).
export default defineConfig({
  site: 'https://skale.dev',
  build: {
    // /apps/ instead of /apps.html; small CSS inlined for speed
    format: 'directory',
    inlineStylesheets: 'auto',
  },
});
