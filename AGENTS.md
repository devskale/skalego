# AGENTS.md — skalego / skale.dev

Production branch: **`main`** (Vercel deploys from this) · `astro` = Astro conversion branch · Live: **skale.dev**

## Stack

- **Astro 7** (static output → `dist/`) — primary build system. File-based routing from `src/pages/`, **no framework runtime** (ships plain HTML + one small client script).
- **Astro reference**: [`astro_guide.md`](./astro_guide.md) — indexed map of all canonical doc pages on `docs.astro.build`. Best-practices guide (project structure, content collections, SEO, TS): [`../gwen.at/astro_guide.md`](../gwen.at/astro_guide.md).
- **Hugo** (`config.toml` + `data/`) — legacy only; not part of the live build. The `themes/skalego_theme` submodule was **removed**.
- **pnpm** lockfile present; all commands use `pnpm` (not npm).
- **Serverless**: Vercel auto-detects `api/` (firmenindex-api, credgoo, uniinfer, **skills**) alongside the static Astro build.
- **Language**: German (de) content; English code/comments.

## Commands

```bash
# Dev server (Astro + HMR) — runs in its own pane at http://localhost:4321
pnpm dev
# Auto-reloads on any change to src/ or public/. Do NOT launch a second dev server (port conflict).

# Production build → dist/  (this is what Vercel runs; also regenerates the skills registry from the blog entry)
pnpm run build

# Preview the production build locally
pnpm run preview

# Keystatic (dev-only): write/edit blog posts visually at http://localhost:4321/keystatic
# (excluded from `astro build` → production stays pure static / zero-JS). Edits write
# .md files into src/content/blog/ via local storage.
```

## Project Structure

```
astro.config.mjs        ← static output, site https://skale.dev, format: directory
src/
  pages/                ← FILE-BASED ROUTING — one .astro per page (index, apps, agent-coding,
                          impressum, datenschutz, tos) + blog/ (index + [...slug]) → /apps/, /blog/<post>/
  content.config.ts     ← blog collection (Zod schema): title/description/date/author/tags/draft/image + optional `skills[]` (drives /skills + /s/<slug>)
  content/blog/         ← one folder per post, index.md(x) — frontmatter validated by the collection
  layouts/
    BaseLayout.astro    ← <head>/SEO/fonts + Nav + Footer + global init script + <slot name="head">
    LegalLayout.astro   ← wraps BaseLayout with legal-page styles + back-link
  components/
    Nav.astro, Footer.astro   ← shared chrome; Nav has an **Agents ▾** dropdown (→ Agentic Coding + Skills)
    sections/            ← Hero, Clients, Services, Process, CaseStudies, Models, FAQ, Contact
  lib/authors.ts, lib/schema.ts   ← blog byline + BlogPosting JSON-LD helpers
  styles/global.css     ← design system: tokens → base → components → layout (merged)
  scripts/site.js       ← the ONE client script: hero canvas + reveals + nav + mobile menu
  data/site.js          ← single source of truth: organization, faqs, models (drives JSON-LD too)
  assets/seo/           ← SVG sources for OG image + PWA icons (rendered to PNG in public/)
api/                    ← Vercel serverless functions (firmenindex-api, credgoo, uniinfer)
public/firmenindex/     ← Firmensuche sub-app (standalone HTML/JS, copied verbatim)
public/                 ← served at site root: robots.txt, sitemap.xml, llms.txt, site.webmanifest,
                          og-image.png, logos/, screenshots, client PNGs — copied verbatim to dist/
static/, data/, content/, archetypes/  ← Hugo legacy (not built)
```

### Import aliases (`tsconfig.json`)

`@components/*`, `@layouts/*`, `@data/*`, `@styles/*` — prefer these over deep relative paths (`../../…`).

## Conventions

- **CSS**: custom properties (`var(--red)`, `--mono`, …) live at the top of `src/styles/global.css`. Single red accent (`--red: #e53935`), dark theme. Fonts: Inter / Inter Tight + JetBrains Mono — **self-hosted** (woff2, latin subset, `font-display: swap`) in `public/fonts/`, declared via `@font-face` at the top of `global.css`; preloads for the two above-fold weights in `BaseLayout`. No third-party font CDN (DSGVO).
- **Per-page styles**: scoped `<style is:global>` block in the page (legal-page, apps-page, ac-page). Global classes live in `global.css`.
- **Content stays in sync with schema**: list-driven content (FAQs, models) lives in `src/data/site.js` and is imported by BOTH the visible components AND the JSON-LD, so they can never drift.
- **JS**: zero by default. The only client JS is `src/scripts/site.js` (imported once from BaseLayout, bundled+inlined by Astro). All motion is CSS-driven (IntersectionObserver reveal); honors `prefers-reduced-motion`.
- **German content**; English code/comments.
- **Base URL**: `skale.dev`. Astro `site: 'https://skale.dev'` in `astro.config.mjs`; canonicals computed from `Astro.site`.

## Build — routing (file-based, no footgun)

Astro emits a route per file in `src/pages/`. `format: 'directory'` → `/apps/index.html`, served as `/apps/`.

> **When adding a page:** create `src/pages/<name>.astro` (using BaseLayout or LegalLayout). It routes automatically — nothing to register. Then `pnpm run build` and confirm it appears in `dist/` before pushing. (This replaces the old Vite `rollupOptions.input` footgun, which is gone.)

## Skills system — `skale.dev/s/<slug>` installs

One blog entry is the single source of truth; a prebuild step + a Vercel function turn it into per-skill install endpoints + a listing page. **Edit one entry → push → everything updates.**

**The registry = one blog post:** `src/content/blog/recommended-skills/index.mdx`
- frontmatter `skills[]` array: `{ slug, desc, install, hidden? }` — edit this (Keystatic at `/keystatic` in dev, or the markdown) to add/remove/reorder a skill. Nothing else changes.
- `install` formats: `pi-skill` (enable one skill from `devskale/skale-skills` via the pi package whitelist) · `pi-skillset:a,b,c` (several at once) · `command:<cmd>` (arbitrary, e.g. `npx impeccable install`, or a multi-skill `npx skills add … --skill a b c -a codex -y`).
- `hidden: true` → off the `/skills/` page AND the 404 "available" list, but still installable via `/s/<slug>` (used for the `gakefay` test skill).

**Data flow:**
```
recommended-skills.mdx  (frontmatter skills[])
   ├── pnpm build → scripts/gen-skills-json.mjs → api/skills.registry.js  (gitignored ESM module)
   │                └── api/skills.js  (Vercel fn) reads it → GET /s/<slug>  returns the bash install script
   └── pnpm build → getCollection('blog') → src/pages/skills/index.astro  (the /skills/ list page)
```
- `vercel.json` rewrite: `/s/:slug` → `/api/skills?slug=:slug`.
- `package.json` `build` = `node scripts/gen-skills-json.mjs && astro build`, so the registry is regenerated every build; `api/skills.registry.js` is **gitignored** (generated artifact).
- **Add a skill:** edit the blog entry's `skills[]` → `git push origin main` → Vercel rebuilds → live on `/skills/` + `/s/<slug>`.
- **Install UX:** `curl -fsSL https://skale.dev/s/<slug> | bash`. Each card on `/skills/` has a copy-on-click icon (code scrolls internally; icon stays pinned).
- `pi-skill`/`pi-skillset` installs edit `~/.pi/agent/settings.json` (idempotent whitelist-add); `command` runs whatever you specify. `npx skills`-style bundles install into `.agents/skills/` (use `-a codex` to keep it to `.agents/` only — no per-agent symlinks).

## SEO (keep consistent)

- **Canonical domain: `skale.dev`** (Vercel). Every canonical/OG/JSON-LD URL uses this. Do **not** use `skale.io` (decommissioned).
- **Static SEO files** in `public/` served at root: `robots.txt`, `llms.txt`, `site.webmanifest`, `og-image.png`, PWA icons. **`sitemap-index.xml` is auto-generated by `@astrojs/sitemap`** (includes every page + blog post) — there is no manual sitemap to edit.
- **Structured data** is wired via `<Fragment slot="head">` per page: `index.astro` → ProfessionalService + WebSite + FAQPage (FAQ sourced from `src/data/site.js`); `apps.astro` & `agent-coding.astro` → BreadcrumbList + CollectionPage/SoftwareApplication; `blog/index.astro` → Blog; each blog post → BlogPosting (via `src/lib/schema.ts`). Legal pages carry no JSON-LD.
- **Every page head** (BaseLayout) carries: canonical, Open Graph, Twitter card, theme-color, robots.
- **JSON-LD must stay valid.** Validate after building:
  ```bash
  pnpm run build && python3 -c "import re,json,glob;[json.loads(b) for f in glob.glob('dist/**/*.html',recursive=True) for b in re.findall(r'<script type=\"application/ld\+json\">(.*?)</script>',open(f).read(),re.S)] and print('JSON-LD OK')"
  ```

## Deployment (Vercel)

- **Git push IS the deploy — never use the `vercel` CLI.** Vercel is wired to this repo and auto-builds on every push: `main` → production (skale.dev), any other branch (e.g. `astro`) → an auto-generated **preview** URL. No `vercel deploy` / CLI step is needed or wanted (the local CLI is outdated anyway).
- **Production branch is `main`.** To go live: commit → `git push origin main`, allow ~30-60s, verify with `curl -sI https://skale.dev/<file>` (200 = live).
- **Preview a branch**: `git push origin astro`, then grab the preview URL from the Vercel dashboard / GitHub check. It does NOT touch skale.dev.
- `vercel.json` sets `"framework": "astro"` (Vercel runs our `pnpm run build` → `dist/` and auto-detects `api/` functions). `buildCommand` = `pnpm run build`, `outputDirectory` = `dist`.
- **Rewrites** (clean URLs → handlers): `/firmenindex/api` → `/api/firmenindex-api`; `/credgoo` → `/api/credgoo`; `/uniinfer` → `/api/uniinfer`; **`/s/:slug` → `/api/skills?slug=:slug`** (skill install endpoints).
- **Proxy rewrites** (external Vercel apps under skale.dev): `/chopdok(/.*)` → `https://chopdok.vercel.app/chopdok$1`; `/pdf-editor(/.*)` → `https://pdf-editor-rouge-psi.vercel.app/$1`. Keep deployment URLs in sync with the real Vercel project URLs.
- **Redirect**: `/meet` → Google Meet; `/agentsmd`, `/agentskills`, `/piextensions` → GitHub guides.

## Boundaries

- **Never modify**: `node_modules/`, `dist/`, `.astro/`
- **Never commit**: secrets, API keys, tokens
- **Ask before**: changing canonical domain, adding API endpoints, modifying `vercel.json` rewrites/redirects
- **Safe without asking**: CSS tweaks, content copy edits, adding sections/pages, JS animation changes

## E2E Validation (rodney)

Use **rodney** (headless Chrome) for visual checks and smoke tests against the dev server:

```bash
rodney start
rodney open http://localhost:4321
rodney waitstable
rodney screenshot research/screenshot-<feature>.png
rodney stop   # ALWAYS stop when done
```

Screenshots go in `./research/` (gitignored). Rodney skill: `~/.pi/agent/skills/rodney/SKILL.md`.

## Known Footguns

- **Production deploys from `main`, not `astro`/`relaunch`.** Pushing to the wrong branch = preview or no-deploy. The branch in the header is authoritative.
- **Static Astro + `api/` functions coexist.** Astro builds `dist/`; Vercel still serves `api/*.js` as serverless functions and applies `vercel.json` rewrites. Don't add the Vercel SSR adapter — we want pure static.
- **No `pnpm-workspace.yaml`.** Vercel resolves **pnpm@9.x** from the v9 lockfile; pnpm 9 errors (`packages field missing or empty`) on a workspace file that lacks a `packages:` field. The pnpm-10+ `allowBuilds` syntax is incompatible. pnpm 9 doesn't gate build scripts, so no workspace/approval file is needed on Vercel. (Locally pnpm 11 will print an "ignored build scripts" warning on fresh install — harmless, esbuild/sharp aren't invoked at build since we don't use `astro:assets`.)
- **`public/firmenindex/` is a standalone sub-app** (own HTML/JS, query-param routing) copied verbatim. It is NOT an Astro page — edit its files directly under `public/`.
- **Hugo legacy** (`config.toml`, `data/`, `static/`, `content/`) coexists but is never built. Changing it does nothing to the live site.
- **The single client script is `src/scripts/site.js`** (hero particle canvas + scroll-reveal + nav + mobile menu). Astro inlines small scripts; check `dist/` if a feature seems missing.
- **Blog = Astro Content Collections** (`src/content.config.ts` → `blog`). Add a post by creating `src/content/blog/<slug>/index.md(x)` with validated frontmatter; it auto-routes to `/blog/<slug>/`. **After adding an integration or a content collection, restart the dev server** (`pnpm dev`) — a running dev pane won't pick up new integrations (MDX/sitemap) or collections until restarted, so new routes 404 in dev while still building fine.
- **German legal requirements**: Impressum (§ 5 TMG), Datenschutzerklärung (DSGVO), AGB (`tos.astro`) must stay accurate and accessible — all real Astro routes (`/impressum/`, `/datenschutz/`, `/tos/`).
- **`research/`, `updateplan.md`, `skills-lock.json`, `tests/`, `screenshots/`, `api/skills.registry.js` are gitignored** — don't commit them. (`skills.registry.js` is generated by the prebuild from the blog entry.)
