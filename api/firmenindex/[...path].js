const UPSTREAM = 'https://amd1.mooo.com/api/firmenbuch';

const ALLOWED = new Set([
  'search', 'search/rich', 'lookup', 'lookup/merged', 'oenace',
  'hvd/token-check', 'hvd/suche-firma', 'hvd/suche-urkunde',
  'hvd/auszug', 'hvd/veraenderungen-firma', 'hvd/veraenderungen-urkunde',
]);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // req.url is "/api/firmenindex/search/rich?query=..."
  const path = req.url.replace(/^\/api\/firmenindex\//, '');
  const [endpoint, qs] = path.split('?');

  // Whitelist
  if (!ALLOWED.has(endpoint)) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const token = process.env.HVD_API_TOKEN;
  if (!token) {
    return res.status(500).json({ error: 'API token not configured' });
  }

  const url = `${UPSTREAM}/${endpoint}${qs ? '?' + qs : ''}`;

  try {
    const upstream = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Host': 'amd1.mooo.com',
        'Accept': 'application/json',
      },
    });

    const body = await upstream.text();
    res.status(upstream.status).setHeader('Content-Type', 'application/json').send(body);
  } catch (err) {
    res.status(502).json({ error: 'Upstream request failed', detail: err.message });
  }
}
