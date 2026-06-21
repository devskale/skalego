<?php
/**
 * Server-side reverse proxy for Firmenbuch API.
 *
 * The browser only talks to skale.dev (same origin).
 * The upstream API URL and token are never exposed to the client.
 *
 * Usage:  api.php?endpoint=search/rich&query=brantner
 *         api.php?endpoint=lookup&fn=475207i
 */

// ── Configuration ──
$UPSTREAM  = 'https://amd1.mooo.com/api/firmenbuch';
$TOKEN     = 'Bearer <TOKEN>';  // set on server, never commit real token
$TIMEOUT   = 30;

// Allowed endpoints (whitelist — no leading slash)
$ALLOWED = [
    'search'                     => true,
    'search/rich'                => true,
    'lookup'                     => true,
    'lookup/merged'              => true,
    'oenace'                     => true,
    'oenace/tree'                 => true,
    'oenace/status'               => true,
    'crawl/recent'                => true,
    'crawl/search'                 => true,
    'crawl/sections'                 => true,
    'crawl/beteiligungen'           => true,
    'crawl/shareholders'           => true,
    'crawl/enabled'                => true,
    'crawl/refresh'                => true,
    'crawl/resolve'                => true,
    'cache/status'                => true,
    'hvd/token-check'            => true,
    'hvd/suche-firma'            => true,
    'hvd/suche-urkunde'          => true,
    'hvd/auszug'                 => true,
    'hvd/veraenderungen-firma'   => true,
    'hvd/veraenderungen-urkunde' => true,
];

// ── Parse endpoint from query string ──
$endpoint = $_GET['endpoint'] ?? '';

// Also support PATH_INFO for clean URLs
if (!$endpoint && isset($_SERVER['PATH_INFO'])) {
    $endpoint = trim(parse_url($_SERVER['PATH_INFO'], PHP_URL_PATH), '/');
}

// Allow both exact matches AND path-param matches: 'crawl/shareholders/475207i'
// matches the whitelisted key 'crawl/shareholders'.
$allowed = false;
if (isset($ALLOWED[$endpoint])) {
    $allowed = true;
} else {
    foreach ($ALLOWED as $key => $v) {
        if (strpos($endpoint, $key . '/') === 0) { $allowed = true; break; }
    }
}
if (!$endpoint || !$allowed) {
    http_response_code(403);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['error' => ['message' => 'Endpoint not allowed']]);
    exit;
}

// Build upstream URL: copy all query params EXCEPT "endpoint"
$queryParts = [];
foreach ($_GET as $k => $v) {
    if ($k !== 'endpoint') {
        $queryParts[] = urlencode($k) . '=' . urlencode($v);
    }
}
$queryString = implode('&', $queryParts);
$url = $UPSTREAM . '/' . $endpoint . ($queryString ? '?' . $queryString : '');

// ── Forward request via cURL ──
$ch = curl_init($url);
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER    => true,
    CURLOPT_HTTPHEADER        => [
        'Authorization: ' . $TOKEN,
        'Accept: application/json',
        'User-Agent: skale.dev/firmenindex',
    ],
    CURLOPT_TIMEOUT           => $TIMEOUT,
    CURLOPT_CONNECTTIMEOUT    => 10,
    CURLOPT_SSL_VERIFYPEER    => false,
    CURLOPT_SSL_VERIFYHOST    => 0,
    CURLOPT_FOLLOWLOCATION    => false,
    CURLOPT_ENCODING          => '',
]);

$response    = curl_exec($ch);
$httpCode    = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$contentType = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
$error       = curl_error($ch);
curl_close($ch);

// ── Handle upstream errors ──
if ($error) {
    http_response_code(502);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['error' => ['message' => 'Upstream error', 'detail' => $error]]);
    exit;
}

// ── Return upstream response ──
http_response_code($httpCode);
if ($contentType) {
    header('Content-Type: ' . $contentType);
}
header('Cache-Control: max-age=60, s-maxage=60');
echo $response;
