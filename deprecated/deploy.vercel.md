# deploy.vercel.md — Vercel (RETIRED)

**Status: RETIRED.** skale.dev migrated off Vercel to the OCI VM (~2026-09-10,
commits around `49627bb`/`c0651f8`). Active target: see [`deploy.oci.md`](./deploy.oci.md).

**Do not deploy here. `git push` is repo backup only.**

## What used to run here

- Static Astro build (`dist/`) + **serverless functions** from `api/`:
  `firmenindex-api`, `credgoo`, `uniinfer`, `skills`.
- `vercel.json`: `framework: astro`, rewrites `/s/:slug` → `/api/skills?slug=:slug`,
  `/credgoo`, `/uniinfer`, `/firmenindex/api`; redirects `/meet`, `/agentsmd`, `/aiui`, …
- `git push origin main` = production deploy; other branches = preview URLs.

## What is DEAD since the migration

- **`/credgoo`, `/uniinfer`**: no runtime on the OCI host — these endpoints 404.
  Don't point users at them (or revive them as static/proxied services first).
- `api/skills.js` replaced by static `dist/s/<slug>` files (identical output).
- `vercel.json` is ignored by the current host — kept only as history/reference.

## Repo leftovers (legacy, don't extend)

- `api/` — old function sources; only `/firmenindex/api` still has a live backend
  (nginx proxy → `127.0.0.1:8099` on the OCI VM, app in the firmenbuch_AT repo).
- `scripts/gen-skills-json.mjs` → `api/skills.registry.js` (gitignored) — legacy
  registry emit, kept for tooling compat; the live `/s/` files come from the
  `skillsStatic` integration instead.
- `vercel.json` — historical.
