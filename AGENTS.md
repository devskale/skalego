# AGENTS.md — skalego / skale.dev

Relaunch branch: **relaunch2606**  ·  Live: **skale.io**

## Stack

- **Vite 8** (`pnpm run build` → output: `dist/`) — primary build system for the main site
- **Hugo** (theme: `skalego_theme`, git submodule) — legacy; still renders ToS/legal via `config.toml`
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
index.html              ← Vite entry point (NOT a framework index.html — it's the real page)
src/main.js             ← JS entry: imports styles + feature modules, boots them
src/style.css           ← CSS entry: @imports the modules below in cascade order
src/styles/             ← CSS modules: tokens.css, base.css, components.css, layout.css
src/lib/                ← JS feature modules: env, hero-canvas, reveals, nav, menu
src/sections/           ← (reserved) section-scoped JS, currently empty
src/assets/             ← (reserved) bundled static assets
api/                    ← Vercel serverless functions (firmenindex-api, credgoo, uniinfer)
public/firmenindex/     ← Firmensuche sub-app (standalone HTML/JS, query-param routing)
themes/skalego_theme/   ← Git submodule (github.com/devskale/skalego_theme) — Hugo layouts
static/                 ← Hugo static assets; also holds .txt files for API endpoint docs
data/                   ← Hugo data files (homepage.yml, tos.yml)
dist/                   ← Gitignored — Vite build output
```

## Conventions

- **CSS**: Custom properties (`var(--red)`, `--mono`, etc.) live in `src/styles/tokens.css`. Split across `tokens/base/components/layout`. Fonts: Inter + JetBrains Mono (Google Fonts).
- **JS imports**: Uses `https://esm.sh/` CDN imports (anime.js). No local node_modules deps at runtime.
- **German content**: All user-facing text is German. Code comments and variable names in English.
- **Base URL**: `config.toml` sets `baseURL = "https://skale.io"` with `relativeURLs = "True"`. The live `index.html` uses root-relative paths (`/src/main.js`, `/logos/...`).
- **Legal pages**: `impressum.html`, `datenschutz.html`, `tos.html` are static HTML at repo root (not Hugo-rendered for the relaunch path).

## Deployment (Vercel)

- `vercel.json` sets `"framework": null` so Vercel doesn't auto-detect; respects our buildCommand/outputDirectory.
- **Rewrites** map clean URLs to `api/` functions: `/firmenindex/api` → `/api/firmenindex-api`, `/credgoo` → `/api/credgoo`, `/uniinfer` → `/api/uniinfer`.
- **Redirect**: `/meet` → Google Meet link.

## Boundaries

- **Never modify**: `themes/skalego_theme/` (submodule — changes go in the theme repo), `node_modules/`, `dist/`
- **Never commit**: secrets, API keys, tokens
- **Ask before**: changing `baseURL`, adding new API endpoints, modifying `vercel.json` rewrites/redirects
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

- **Dual build systems**: Hugo (`config.toml` + `themes/`) and Vite (`index.html` + `src/`) coexist. Changing one doesn't affect the other. The relaunch uses Vite as primary; Hugo is legacy/toys only.
- **Submodule**: `themes/skalego_theme` is a git submodule. If it's missing, run `git submodule update --init --recursive`.
- **JS modules**: `src/main.js` is a thin entry that imports feature modules from `src/lib/`. Each module exports an `init*`/`reveal*` function. No anime.js / esm.sh dependency anymore; all motion is CSS-driven (scroll-reveal via IntersectionObserver in `src/lib/reveals.js`).
- **German legal requirements**: Impressum (§ 5 TMG), Datenschutzerklärung (DSGVO), and AGB (tos.html) must remain accurate and accessible. Don't remove or gut these pages.
