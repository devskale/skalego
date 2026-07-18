// api/aiui/[...path].js — streaming reverse proxy to the aiui instance on lubu.
//
// skale.dev/aiui/<path>  →  (vercel.json rewrite)  →  /api/aiui/<path>  →  this
// Edge function  →  https://neusiedl.duckdns.org:8001/aiui/<path>
//
// Runs on the Edge Runtime so the response body is PIPED to the client
// (Vercel buffers plain external rewrites, which kills aiui's SSE stream;
// an edge function streams it through). Subject to Vercel's function
// duration cap — a long-lived SSE may reset; EventSource reconnects on its own.

export const runtime = 'edge'
export const maxDuration = 300
export const dynamic = 'force-dynamic'

const UPSTREAM = 'https://neusiedl.duckdns.org:8001/aiui'

export default async function handler(req) {
  const u = new URL(req.url)
  // path after /api/aiui → forward verbatim under the upstream /aiui
  let rest = u.pathname.replace(/^\/api\/aiui/, '')
  if (!rest.startsWith('/')) rest = '/' + rest
  const target = `${UPSTREAM}${rest}${u.search}`

  // Forward request headers (cookie, content-type, …) but drop hop-by-hop /
  // host so the upstream sees a clean request.
  const headers = new Headers()
  for (const [k, v] of req.headers) {
    const lk = k.toLowerCase()
    if (lk === 'host' || lk === 'connection' || lk === 'content-length') continue
    headers.set(k, v)
  }

  const init = { method: req.method, headers, redirect: 'manual', duplex: 'half' }
  if (req.method !== 'GET' && req.method !== 'HEAD') init.body = req.body

  try {
    const upstream = await fetch(target, init)
    // Pipe the body straight through (streaming) + pass status/headers
    // (incl. Set-Cookie for login, content-type for SSE).
    return new Response(upstream.body, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers: upstream.headers,
    })
  } catch (err) {
    return new Response(`aiui proxy error: ${err.message}`, { status: 502 })
  }
}
