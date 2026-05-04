const UPSTREAM = 'https://amd1.mooo.com/api/firmenbuch';

const ALLOWED = new Set([
  'search', 'search/rich', 'lookup', 'lookup/merged', 'oenace',
  'hvd/token-check', 'hvd/suche-firma', 'hvd/suche-urkunde',
  'hvd/auszug', 'hvd/veraenderungen-firma', 'hvd/veraenderungen-urkunde',
]);

// Max execution time (hobby plan caps at 10s regardless)
export const maxDuration = 30;

export default async function handler(req, res) {
  if (req.method !== 'GET')
    return res.status(405).json({ error: 'Method not allowed' });

  const url = new URL(req.url, 'http://localhost');
  const endpoint = url.searchParams.get('e');
  if (!endpoint || !ALLOWED.has(endpoint))
    return res.status(403).json({ error: 'Forbidden' });

  const token = process.env.HVD_API_TOKEN;
  if (!token)
    return res.status(500).json({ error: 'API token not configured' });

  const upstreamParams = new URLSearchParams(url.search);
  upstreamParams.delete('e');
  const upstreamUrl = `${UPSTREAM}/${endpoint}?${upstreamParams.toString()}`;

  // Abort after 25s (leave margin before maxDuration)
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 25000);

  try {
    const upstream = await fetch(upstreamUrl, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Host': 'amd1.mooo.com',
        'Accept': 'application/json',
      },
      signal: controller.signal,
    });
    clearTimeout(timer);
    const body = await upstream.text();
    res.status(upstream.status)
       .setHeader('Content-Type', 'application/json')
       .send(body);
  } catch (err) {
    clearTimeout(timer);
    if (err.name === 'AbortError') {
      res.status(504).json({
        error: { type: 'timeout', message: 'Zeitüberschreitung bei der Suche.', hint: 'Die Abfrage beim Firmenbuch dauert zu lange. Bitte später erneut versuchen oder einen kürzeren Suchbegriff verwenden.' }
      });
    } else {
      res.status(502).json({ error: 'Upstream request failed' });
    }
  }
}
