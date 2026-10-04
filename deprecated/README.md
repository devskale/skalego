# deprecated/

Retired things, kept as backup/reference — **never extend, never deploy, never
point users at these**. The current site is a pure static Astro build deployed
per `deploy.config` (see [`deploy.oci.md`](../deploy.oci.md) and AGENTS.md).

| What | Era | Why retired |
|------|-----|-------------|
| `deploy.vercel.md` | until 2026-09-10 | skale.dev migrated off Vercel to the OCI VM; endpoints documented there are dead |
| `vercel.json` | until 2026-09-10 | Vercel rewrites/functions config — ignored by the current host; redirects now live in nginx on the target |
| `netlify.toml` | Hugo era | from before the Astro migration (`command = "hugo"`); the current host never reads it |
| `api/` | Vercel era | serverless functions (skills installer, credgoo, firmenindex-api, uniinfer) — no runtime backend on the current host; `/s/<slug>` is static files generated at build time (astro.config.mjs `skillsStatic` integration) |
| `scripts/gen-skills-json.mjs` | Vercel era | only emitted `api/skills.registry.js` for the deprecated `api/skills.js` function; removed from the build (`package.json` build is now plain `astro build`) |

Rule of thumb: when something is retired from active duty but documents how a
previous setup worked, move it here instead of deleting — the git history stays
anyway, but a file here is *findable* without archaeology.
