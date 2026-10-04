# skale.dev

The website for **skale** — a German-language consultancy / agentic-coding site.
Live at **[skale.dev](https://skale.dev)**, built with **Astro 7** (pure static
output) deployed to whatever host `deploy.config` points at (currently the
OCI VM `amd2` — nginx serving `dist/` statically).

> This README is the quick-start. For the full project bible — routing rules,
> skills system, SEO wiring, deploy flow, boundaries, footguns — read
> **[`AGENTS.md`](./AGENTS.md)**. It is authoritative whenever this file and
> `AGENTS.md` disagree.

## Stack

- **Astro 7** — static output to `dist/`, file-based routing from `src/pages/`.
  No framework runtime in production; ships plain HTML + one small client script
  (`src/scripts/site.js`).
- **pnpm** for everything (lockfile is v9; locally pnpm 11 also works).
- **Deployment target** — defined in `deploy.config` (gitignored): SSH host,
  webroot, dist dir. Currently the OCI VM (`amd2`), nginx serving `/var/www/skale.dev`.
  Deploy = `./scripts/deploy-skale.sh --build` (astro build → rsync → smoke check).
  Git push is NOT a deploy — see AGENTS.md. Retired Vercel-era artifacts live in
  [`deprecated/`](deprecated/) (kept as backup; `/s/<slug>` is static files generated
  at build time).
- **Content Collections** (`src/content.config.ts` → `blog`) drive the blog and the
  skills registry.
- **Keystatic** (dev-only) at `/keystatic` for visually editing blog posts —
  excluded from `astro build`, so production stays zero-JS.

## Quick start

```bash
pnpm install
pnpm dev        # http://localhost:4321  (HMR on src/ + public/ changes)
```

> Don't launch a second dev server — it will fight for port 4321. After adding an
> integration or content collection, **restart** the dev pane so new routes resolve.

## Commands

```bash
pnpm dev            # dev server with HMR
pnpm run build      # regenerates the skills registry, then astro build → dist/
pnpm run preview    # serve the production build locally
```

`pnpm run build` is what `./scripts/deploy-skale.sh --build` runs: `astro build`.

## Project layout

```
astro.config.mjs        static output, site https://skale.dev, directory URLs
src/
  pages/                one .astro per route (index, apps, agent-coding, blog/, skills/, + legal pages)
  content/blog/         blog posts — one folder per post, index.md(x)
  content.config.ts     blog collection (Zod schema) + optional skills[] frontmatter
  layouts/              BaseLayout.astro (head/SEO/nav/footer + slot="head"), LegalLayout.astro
  components/           Nav, Footer, and sections/ (Hero, Clients, Services, Process, CaseStudies, Models, FAQ, Contact)
  lib/                  authors.ts, schema.ts (BlogPosting JSON-LD helpers)
  styles/global.css     design system: tokens → base → components → layout
  scripts/site.js       the ONE client script (hero canvas, scroll-reveal, nav, mobile menu)
  data/site.js          single source of truth: org info, FAQs, models (drives JSON-LD too)
deprecated/             retired artifacts (Vercel/Hugo era) — kept as backup, never deployed
public/                 served at root verbatim (robots, sitemap, manifest, fonts, OG image, firmenindex/ sub-app)
```

Import aliases (`tsconfig.json`): `@components/*`, `@layouts/*`, `@data/*`, `@styles/*`.

## Adding a page or blog post

- **Page:** create `src/pages/<name>.astro` (using `BaseLayout` or `LegalLayout`).
  It routes automatically — nothing to register.
- **Blog post:** create `src/content/blog/<slug>/index.md(x)` with validated
  frontmatter. It routes to `/blog/<slug>/`.

## Skills system

A single blog entry — `src/content/blog/recommended-skills/index.mdx` — is the
source of truth. Its frontmatter `skills[]` array becomes both the
`/skills/` listing page and per-skill install endpoints at `/s/<slug>`

```
curl -fsSL https://skale.dev/s/<slug> | bash
```

Edit that one entry, push to `main`, and everything updates. See `AGENTS.md`
for install formats (`pi-skill`, `pi-skillset:a,b,c`, `command:…`) and internals.

## Deployment

**Deploy = `./scripts/deploy-skale.sh --build`** — never git push alone.

- builds `dist/`, rsyncs to the host/webroot from `deploy.config` (currently `amd2`),
  then smoke-checks the live site (md5 diff, exit 1 on mismatch)
- git push is **not** a deploy: commit → run the script → verify

After deploying, verify with `curl -sI https://skale.dev/<file>` (200 = live).

## Conventions

- **German** content; **English** code and comments.
- Single red accent (`--red: #e53935`), dark theme. Fonts (Inter / JetBrains Mono)
  are **self-hosted** in `public/fonts/` — no third-party CDN (DSGVO).
- CSS custom properties live at the top of `src/styles/global.css`.
- Zero client JS by default; all motion is CSS-driven and honors
  `prefers-reduced-motion`.

## Related docs

- [`AGENTS.md`](./AGENTS.md) — the authoritative project bible (read this for anything non-trivial)
- [`APPS.md`](./APPS.md) — the `public/firmenindex/` sub-app and other apps
- [`DESIGN.md`](./DESIGN.md), [`PRODUCT.md`](./PRODUCT.md), [`relaunch.md`](./relaunch.md) — design & product context
