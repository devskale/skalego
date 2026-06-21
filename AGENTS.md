# AGENTS.md — skalego / skale.dev

Production branch: **`main`** (Vercel deploys from this)  ·  Dev branch: `relaunch`  ·  Live: **skale.dev**

## Stack

- **Vite 8** (`pnpm run build` → output: `dist/`) — primary build system for the main site. **Multi-page** (see Build section below).
- **Hugo** (`config.toml` + `data/`) — legacy only; not part of the live build. The `themes/skalego_theme` submodule was **removed**.
- **pnpm** lockfile present; all commands use `pnpm` (not npm)
- **No framework** — vanilla HTML/CSS/JS (index.html is the entry, not an SPA router)
- **Deployment**: Vercel (`vercel.json`) + Netlify legacy (Hugo-only)
- **Language**: German (de) content; English code/comments

## Commands

```bash
# Dev server (Vite + HMR) — runs in herdr pane (alias: **devserver**)
pnpm dev                # → http://localhost:5173
# Auto-reloads on any file change to src/, index.html, or vite.config.js.
# The dev server pane is long-running; use `herdr read devserver` to check output.
# Do NOT launch a second dev server — it will port-conflict.

# Production build
pnpm run build          # → dist/

# Hugo preview (legacy path, rarely needed)
hugo                    # → public/
```

## Project Structure (non-obvious bits)

```
index.html              ← Vite entry point (the real landing page)
apps.html               ← Apps & Tools page (Firmenindex, PDF Annotator, ChopDok)
impressum.html          ← Legal page (Impressum) — Vite entry, see Build section
datenschutz.html       ← Legal page (Datenschutz) — Vite entry
tos.html                ← Legal page (AGB) — Vite entry
src/main.js             ← JS entry: imports styles + feature modules, boots them
src/style.css           ← CSS entry: @imports the modules below in cascade order
src/styles/             ← CSS modules: tokens.css, base.css, components.css, layout.css
src/lib/                ← JS feature modules: env, hero-canvas, reveals, nav, menu
src/assets/seo/         ← SVG sources for OG image + PWA icons (rendered to PNG in public/)
api/                    ← Vercel serverless functions (firmenindex-api, credgoo, uniinfer)
public/firmenindex/     ← Firmensuche sub-app (standalone HTML/JS, query-param routing)
public/                 ← Static files served at site root (robots.txt, sitemap.xml, llms.txt,
                          site.webmanifest, og-image.png, logos/, screenshots) — copied verbatim to dist/
static/                 ← Hugo static assets (legacy); holds .txt files for API endpoint docs
data/                   ← Hugo data files (homepage.yml, tos.yml) — legacy
dist/                   ← Gitignored — Vite build output (served by Vercel)
```

## Conventions

- **CSS**: Custom properties (`var(--red)`, `--mono`, etc.) live in `src/styles/tokens.css`. Split across `tokens/base/components/layout`. Fonts: Inter + JetBrains Mono (Google Fonts).
- **JS imports**: All motion is CSS-driven; no `esm.sh`/anime.js runtime deps anymore.
- **German content**: All user-facing text is German. Code comments and variable names in English.
- **Base URL**: `config.toml` sets `baseURL = "https://skale.dev"` with `relativeURLs = "True"`. The live `index.html` uses root-relative paths (`/src/main.js`, `/logos/...`).
- **Legal pages**: `impressum.html`, `datenschutz.html`, `tos.html` are static HTML at repo root (not Hugo-rendered for the relaunch path).

## Build — Multi-page (CRITICAL)

Vite only emits `index.html` by default. **Every root-level `.html` file must be listed in `rollupOptions.input`** in `vite.config.js`, or it silently 404s in production (works fine in `vite dev`, breaks in `dist/`).

Currently registered: `main` (index.html), `apps`, `impressum`, `datenschutz`, `tos`.

> **When adding a new HTML page at repo root:** add it to `rollupOptions.input` in `vite.config.js`, then `pnpm run build` and confirm the file appears in `dist/` before pushing. This was a silent bug from relaunch that left all legal pages 404 until fixed.

## SEO (already set up — keep consistent)

- **Canonical domain: `skale.dev`** (hosted on Vercel). Every canonical/OG/JSON-LD URL uses this. Do **not** use `skale.io` (legacy, decommissioned — all refs removed).
- **Static SEO files** live in `public/` and are served at site root: `robots.txt`, `sitemap.xml`, `llms.txt` (AI/LLM SEO), `site.webmanifest`, `og-image.png`, PWA icons in `public/logos/`. Update `sitemap.xml` when adding/removing pages.
- **Structured data**: `index.html` has `@graph` of ProfessionalService + WebSite + FAQPage (keep the FAQ schema in sync with the visible `<details>` questions). `apps.html` has BreadcrumbList + CollectionPage/SoftwareApplication.
- **Every page head** carries: canonical, Open Graph, Twitter card, theme-color, robots. The legal pages (`impressum/datenschutz/tos.html`) are full Vite entries — their favicon path is `/logos/skalelogo_red_trans.png`.
- **JSON-LD must stay valid.** Validate with the Python snippet in the footer before pushing:
  ```bash
  python3 -c "import re,json;[json.loads(b) for f in ['index.html','apps.html'] for b in re.findall(r'<script type=\"application/ld\+json\">(.*?)</script>',open(f).read(),re.S)]"
  ```

## Deployment (Vercel)

- **Production branch is `main`.** Vercel auto-builds on push to `main`. Pushing to `relaunch` does NOT deploy. To go live: commit → `git push origin main`.
- `vercel.json` sets `"framework": null` so Vercel doesn't auto-detect; respects our buildCommand/outputDirectory.
- **Rewrites** (clean URLs → handlers): `/firmenindex/api` → `/api/firmenindex-api`; `/credgoo` → `/api/credgoo`; `/uniinfer` → `/api/uniinfer`.
- **Proxy rewrites** (external Vercel apps under skale.dev): `/chopdok(/.*)` → `https://chopdok.vercel.app/chopdok$1`; `/pdf-editor(/.*)` → `https://pdf-editor-rouge-psi.vercel.app/$1`. Keep the deployment URLs here in sync with the real Vercel project URLs.
- **Redirect**: `/meet` → Google Meet link.
- After pushing to `main`, allow ~30-60s for the Vercel build, then verify with `curl -sI https://skale.dev/<file>` (200 = live).

## Boundaries

- **Never modify**: `node_modules/`, `dist/`
- **Never commit**: secrets, API keys, tokens
- **Ask before**: changing `baseURL`/canonical domain, adding new API endpoints, modifying `vercel.json` rewrites/redirects
- **Safe without asking**: CSS tweaks, content copy edits, adding sections to `index.html`, JS animation changes

## E2E Validation (rodney)

Use **rodney** (headless Chrome) for visual checks and smoke tests against the running dev server:

```bash
rodney start
rodney open http://localhost:5173
rodney waitstable
rodney screenshot research/screenshot-<feature>.png
# assert elements, text, layout...
rodney stop   # ALWAYS stop when done
```

Screenshots go in `./research/` for design decisions and regression tracking.
Rodney skill is at `~/.pi/agent/skills/rodney/SKILL.md`.

## Known Footguns

- **Production deploys from `main`, not `relaunch`.** Pushing to the wrong branch = silent no-deploy. The branch in the header is authoritative.
- **Vite only builds `index.html` by default.** New root HTML pages must be added to `rollupOptions.input` (vite.config.js) or they 404 in production. See the Build section. (The dev server hides this bug — always check `dist/`.)
- **Dual build systems**: Hugo (`config.toml` + `data/`) and Vite (`index.html` + `src/`) coexist. Changing one doesn't affect the other. The relaunch uses Vite as primary; Hugo is legacy only. The `themes/skalego_theme` submodule was removed — don't try to restore it.
- **JS modules**: `src/main.js` is a thin entry that imports feature modules from `src/lib/`. Each module exports an `init*`/`reveal*` function. No anime.js / esm.sh dependency anymore; all motion is CSS-driven (scroll-reveal via IntersectionObserver in `src/lib/reveals.js`).
- **German legal requirements**: Impressum (§ 5 TMG), Datenschutzerklärung (DSGVO), and AGB (tos.html) must remain accurate and accessible. These are full Vite entries — don't remove them from `rollupOptions.input`.
- **`research/` is gitignored** (local screenshots/scratch) along with `updateplan.md`, `skills-lock.json`, `tests/`. Don't commit them.
