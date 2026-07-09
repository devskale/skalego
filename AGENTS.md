# AGENTS.md — skalego / skale.dev

Production branch: **`main`** (Vercel deploys from this) · `astro` = Astro conversion branch · Live: **skale.dev**

## Stack

- **Astro 7** (static output → `dist/`) — primary build system. File-based routing from `src/pages/`, **no framework runtime** (ships plain HTML + one small client script).
- **Astro reference**: [`astro_guide.md`](./astro_guide.md) — indexed map of all canonical doc pages on `docs.astro.build`. Best-practices guide (project structure, content collections, SEO, TS): [`../gwen.at/astro_guide.md`](../gwen.at/astro_guide.md).
- **Hugo** (`config.toml` + `data/`) — legacy only; not part of the live build. The `themes/skalego_theme` submodule was **removed**.
- **pnpm** lockfile present; all commands use `pnpm` (not npm).
- **Serverless**: Vercel auto-detects `api/` (firmenindex-api, credgoo, uniinfer) alongside the static Astro build.
- **Language**: German (de) content; English code/comments.

## Commands

```bash
# Dev server (Astro + HMR) — runs in its own pane at http://localhost:4321
pnpm dev
# Auto-reloads on any change to src/ or public/. Do NOT launch a second dev server (port conflict).

# Production build → dist/  (this is what Vercel runs)
pnpm run build

# Preview the production build locally
pnpm run preview
```

## Project Structure

```
astro.config.mjs        ← static output, site https://skale.dev, format: directory
src/
  pages/                ← FILE-BASED ROUTING — one .astro per page (index, apps, agent-coding,
                          impressum, datenschutz, tos) → /apps/, /impressum/, … (no .html)
  layouts/
    BaseLayout.astro    ← <head>/SEO/fonts + Nav + Footer + global init script + <slot name="head">
    LegalLayout.astro   ← wraps BaseLayout with legal-page styles + back-link
  components/
    Nav.astro, Footer.astro   ← shared chrome (one canonical link set)
    sections/            ← Hero, Clients, Services, Process, CaseStudies, Models, FAQ, Contact
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

- **CSS**: custom properties (`var(--red)`, `--mono`, …) live at the top of `src/styles/global.css`. Single red accent (`--red: #e53935`), dark theme. Fonts: Inter / Inter Tight + JetBrains Mono (Google Fonts via `<link>`).
- **Per-page styles**: scoped `<style is:global>` block in the page (legal-page, apps-page, ac-page). Global classes live in `global.css`.
- **Content stays in sync with schema**: list-driven content (FAQs, models) lives in `src/data/site.js` and is imported by BOTH the visible components AND the JSON-LD, so they can never drift.
- **JS**: zero by default. The only client JS is `src/scripts/site.js` (imported once from BaseLayout, bundled+inlined by Astro). All motion is CSS-driven (IntersectionObserver reveal); honors `prefers-reduced-motion`.
- **German content**; English code/comments.
- **Base URL**: `skale.dev`. Astro `site: 'https://skale.dev'` in `astro.config.mjs`; canonicals computed from `Astro.site`.

## Build — routing (file-based, no footgun)

Astro emits a route per file in `src/pages/`. `format: 'directory'` → `/apps/index.html`, served as `/apps/`.

> **When adding a page:** create `src/pages/<name>.astro` (using BaseLayout or LegalLayout). It routes automatically — nothing to register. Then `pnpm run build` and confirm it appears in `dist/` before pushing. (This replaces the old Vite `rollupOptions.input` footgun, which is gone.)

## SEO (keep consistent)

- **Canonical domain: `skale.dev`** (Vercel). Every canonical/OG/JSON-LD URL uses this. Do **not** use `skale.io` (decommissioned).
- **Static SEO files** in `public/` served at root: `robots.txt`, `sitemap.xml`, `llms.txt`, `site.webmanifest`, `og-image.png`, PWA icons. **Update `public/sitemap.xml` when adding/removing pages.**
- **Structured data** is wired via `<Fragment slot="head">` per page: `index.astro` → ProfessionalService + WebSite + FAQPage (FAQ sourced from `src/data/site.js`); `apps.astro` & `agent-coding.astro` → BreadcrumbList + CollectionPage/SoftwareApplication. Legal pages carry no JSON-LD.
- **Every page head** (BaseLayout) carries: canonical, Open Graph, Twitter card, theme-color, robots.
- **JSON-LD must stay valid.** Validate after building:
  ```bash
  pnpm run build && python3 -c "import re,json,glob;[json.loads(b) for f in glob.glob('dist/**/*.html',recursive=True) for b in re.findall(r'<script type=\"application/ld\+json\">(.*?)</script>',open(f).read(),re.S)] and print('JSON-LD OK')"
  ```

## Deployment (Vercel)

- **Git push IS the deploy — never use the `vercel` CLI.** Vercel is wired to this repo and auto-builds on every push: `main` → production (skale.dev), any other branch (e.g. `astro`) → an auto-generated **preview** URL. No `vercel deploy` / CLI step is needed or wanted (the local CLI is outdated anyway).
- **Production branch is `main`.** To go live: commit → `git push origin main`, allow ~30-60s, verify with `curl -sI https://skale.dev/<file>` (200 = live).
- **Preview a branch**: `git push origin astro`, then grab the preview URL from the Vercel dashboard / GitHub check. It does NOT touch skale.dev.
- `vercel.json` sets `"framework": null` (Vercel runs our `pnpm run build` → `dist/` and still auto-detects `api/` functions). `buildCommand` = `pnpm run build`, `outputDirectory` = `dist`.
- **Rewrites** (clean URLs → handlers): `/firmenindex/api` → `/api/firmenindex-api`; `/credgoo` → `/api/credgoo`; `/uniinfer` → `/api/uniinfer`.
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
- **`public/firmenindex/` is a standalone sub-app** (own HTML/JS, query-param routing) copied verbatim. It is NOT an Astro page — edit its files directly under `public/`.
- **Hugo legacy** (`config.toml`, `data/`, `static/`, `content/`) coexists but is never built. Changing it does nothing to the live site.
- **The single client script is `src/scripts/site.js`** (hero particle canvas + scroll-reveal + nav + mobile menu). Astro inlines small scripts; check `dist/` if a feature seems missing.
- **German legal requirements**: Impressum (§ 5 TMG), Datenschutzerklärung (DSGVO), AGB (`tos.astro`) must stay accurate and accessible — all real Astro routes (`/impressum/`, `/datenschutz/`, `/tos/`).
- **`research/`, `updateplan.md`, `skills-lock.json`, `tests/`, `screenshots/` are gitignored** — don't commit them.
