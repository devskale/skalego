# Adding an app at `skale.dev/<name>`

Apps live in **their own Vercel projects** (each on its own `*.vercel.app` domain
and git repo) but are served **transparently** at `skale.dev/<name>` via
`vercel.json` **rewrites** in this (skalego) project. The visitor's address bar
stays on `skale.dev/<name>`; Vercel reverse-proxies to the app.

There are two flavors depending on framework — **the difference matters**.

| Framework | App config | Where files live | skalego rewrite |
|---|---|---|---|
| **Vite** (e.g. pdf-editor) | `base: '/<name>/'` | root (`/assets/...`) | **strip** the prefix |
| **Next.js** (e.g. chopdok) | `basePath: '/<name>'` | under `/<name>/` (`/<name>/_next/...`) | **keep** the prefix |

Why the difference: Vite's `base` only rewrites URLs in `index.html` (files stay
at the project root), so the proxy must strip `/<name>` to hit `/assets/...`.
Next.js's `basePath` physically mounts the whole app under `/<name>/`, so the
proxy must keep `/<name>` to hit `/<name>/_next/...`.

---

## Step 1 — make the app subpath-aware

### Vite (`vite.config.ts`)
```ts
export default defineConfig({
  base: '/<name>/',
  // ...
});
```
All asset / worker / lazy-chunk URLs are then prefixed `/<name>/...`.

### Next.js (`next.config.mjs`)
```js
const nextConfig = {
  basePath: '/<name>',
  async redirects() {
    // keep the app's own *.vercel.app/ working (bare root → the app)
    return [{ source: '/', destination: '/<name>', permanent: false, basePath: false }];
  },
  // ...
};
```
`next/link`, `next/router`, and `next/image` (remote) auto-apply `basePath`.

---

## Step 2 — keep the app's own domain working

- **Vite:** add a `vercel.json` in the app repo so its `*.vercel.app` previews
  still resolve the `/<name>/...` references:
  ```json
  { "rewrites": [ { "source": "/<name>/:path*", "destination": "/:path*" } ] }
  ```
- **Next.js:** the `redirects()` above handles bare-root. (Routes are already
  under `/<name>/` via `basePath`.)

---

## Step 3 — fix references that DON'T auto-apply the base/basePath

These are the 404 traps (verified the hard way):

- **`next/image` with a static public `src`** does **not** auto-prefix
  `basePath`. Write the prefix explicitly: `src="/<name>/icon.png"`.
- **`metadata.icons`** (`app/layout.tsx` / page `metadata`) does **not**
  auto-prefix either: `icon: "/<name>/icon.png"`.
- **Plain `<img src="/...">`**, **`fetch('/api/...')`**, **hardcoded redirects**
  — none auto-prefix. Audit and prefix them (or use `next/image` / `next/link`).
- **Next.js route folders:** if the route was `app/<name>/page.tsx`, move it to
  `app/page.tsx` so `basePath: '/<name>'` doesn't double-prefix to
  `/<name>/<name>`. Update internal `next/link` hrefs accordingly
  (`/<name>/foo` → `/foo`).

---

## Step 4 — add the rewrite in `skalego/vercel.json`

### Vite app (strip prefix — files live at the app root)
```jsonc
"rewrites": [
  // ...existing rules...
  { "source": "/<name>",       "destination": "https://<app>.vercel.app/" },
  { "source": "/<name>/:path*", "destination": "https://<app>.vercel.app/:path*" }
]
```

### Next.js app (keep prefix — app is mounted under /<name>)
```jsonc
"rewrites": [
  { "source": "/<name>",       "destination": "https://<app>.vercel.app/<name>" },
  { "source": "/<name>/:path*", "destination": "https://<app>.vercel.app/<name>/:path*" }
]
```

Rules:
- Use the **named-param** `/:path*`, never the regex `/<name>(/.*)` — the regex
  form fails to match the **no-slash** URL `/<name>` (→ NOT_FOUND), which is what
  `apps.html` links to.
- Match the **exact** `/<name>` too (the first rule).
- **No trailing slash** on the destination if the app strips trailing slashes
  (e.g. Next.js normalized `/chopdok/` → 308 → `/chopdok`). Point at the
  no-slash form.

### Redirect instead of proxy?
If keeping the app untouched matters more than the vanity URL, use a `redirect`
(the browser leaves `skale.dev`). Only `rewrite` gives a transparent proxy.
```jsonc
{ "source": "/<name>", "destination": "https://<app>.vercel.app/", "permanent": false }
```

---

## Step 5 — add the card in `apps.html`

Add an `<a class="app-card" href="/<name>">` block (see the pdf-editor / chopdok
cards). Drop a screenshot at `public/logos/screenshot-<name>.png`.

---

## Step 6 — deploy & verify

Both repos auto-deploy on `git push` (Vercel git integration). Push the app
first, wait for it to go Ready, then push skalego.

Verify (URL must **stay** `skale.dev/<name>` — that's what makes it a proxy, not
a redirect):
```bash
# page proxies (200, not 307)
curl -sI https://www.skale.dev/<name> | grep -iE 'HTTP|location'

# an asset proxies through and returns the right content-type
asset=$(curl -s https://www.skale.dev/<name> | grep -oE '/<name>/[^"]*\.(js|mjs|css)' | head -1)
curl -sI "https://www.skale.dev${asset}" | grep -iE 'HTTP|content-type'

# the app's own domain still works
curl -sI https://<app>.vercel.app/
```

---

## Current apps

| Path | App repo | Framework | Pattern |
|---|---|---|---|
| `/pdf-editor` | `devskale/pdf-editor` | Vite | `base:'/pdf-editor/'` + self-rewrite; skalego **strips** prefix |
| `/chopdok` | `devskale/chopdok` | Next.js | `basePath:'/chopdok'` + bare-root redirect; skalego **keeps** prefix |
| `/firmenindex` | (internal) | skalego API | same-project rewrite → `/api/firmenindex-api` |

## TL;DR gotchas
- App **must** be built with `base`/`basePath` = `/<name>` or assets 404.
- Use `/:path*`, match the exact `/<name>`, mind trailing slashes.
- `next/image` static `src` and `metadata.icons` need a **manual** `/<name>/` prefix.
- Deploy the app before flipping skalego's rewrite.
