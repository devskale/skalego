/* ═══════════════════════════════════════════════════════════════
   Firmenindex Österreich — unified app (Firma + Branche)
   Vanilla JS, no build step. Shared across both modes.
   ═══════════════════════════════════════════════════════════════ */
'use strict';

// ── DOM helpers ──
const $ = (id) => document.getElementById(id);
const esc = (s) => { if (s == null) return ''; const d = document.createElement('div'); d.textContent = String(s); return d.innerHTML; };
const trunc = (s, n) => (s && s.length > n) ? s.slice(0, n) + '…' : (s || '');
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const isFN = (s) => /^[a-z]?\d+[a-z]$/i.test((s || '').trim());

// ── API layer ──
const IS_PROXY = (typeof API_BASE !== 'undefined') && API_BASE.includes('?');

function buildApiUrl(path) {
  // path = "endpoint?param=val"
  const [endpoint, qs] = path.replace(/^\//, '').split('?');
  if (IS_PROXY) {
    let url = API_BASE + encodeURIComponent(endpoint);
    if (qs) url += '&' + qs;
    return url;
  }
  let url = API_BASE.replace(/\/$/, '') + '/' + endpoint;
  if (qs) url += '?' + qs;
  return url;
}

const ERROR_HINTS = {
  400: { label: 'Ungültige Anfrage', icon: '⚠️' },
  401: { label: 'Authentifizierung fehlgeschlagen', icon: '🔒', hint: 'Bearer-Token in config.js prüfen.' },
  403: { label: 'Zugriff verweigert', icon: '🚫', hint: 'Token ungültig oder abgelaufen.' },
  404: { label: 'Nicht gefunden', icon: '🔍' },
  429: { label: 'Zu viele Anfragen', icon: '⏳', hint: 'Rate Limit: max. 30 Anfragen/Minute. Bitte kurz warten.' },
  502: { label: 'Upstream-Fehler', icon: '🔌', hint: 'evi.gv.at oder HVD-Server antwortet nicht. Bitte später erneut versuchen.' },
  503: { label: 'Service nicht verfügbar', icon: '🔧', hint: 'HVD-Token fehlt oder Modul nicht geladen.' },
  504: { label: 'Gateway Timeout', icon: '⏱️', hint: 'Der HVD-Server hat zu lange geantwortet (504). Bitte später erneut versuchen.' },
};

function formatError(status, body) {
  const info = ERROR_HINTS[status] || { label: 'Fehler', icon: '❌' };
  let detail = '';
  if (body && body.error) {
    detail = body.error.message || '';
    if (body.error.hint) detail += (detail ? ' ' : '') + body.error.hint;
  } else if (body && body.detail) {
    detail = typeof body.detail === 'string' ? body.detail : JSON.stringify(body.detail);
  }
  const hint = info.hint || '';
  return `${info.icon} ${info.label} (HTTP ${status})${detail ? ': ' + detail : ''}${hint ? '<br><small>' + hint + '</small>' : ''}`;
}

async function apiFetch(path) {
  const url = buildApiUrl(path);
  const response = await fetch(url);
  if (!response.ok) {
    let body = null;
    try { body = await response.json(); } catch (_) {}
    const err = (body && body.error) || (body && body.detail && body.detail.error);
    // 404 from search = "no results", not a real error
    if (response.status === 404 && ((err && err.type === 'not_found') || !body)) {
      return { results: [] };
    }
    throw { status: response.status, message: formatError(response.status, body) };
  }
  return response.json();
}

// ── Toast ──
function toast(msg) {
  const t = $('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 1800);
}

// ── Badges ──
function statusBadge(status) {
  const s = (status || '').toLowerCase();
  if (s === 'aktiv' || s === 'eingetragen') return `<span class="badge badge-green">${esc(status)}</span>`;
  if (s.includes('lösch') || s === 'gelöscht') return `<span class="badge badge-red">${esc(status)}</span>`;
  if (status) return `<span class="badge badge-orange">${esc(status)}</span>`;
  return '';
}

// ═══════════════════════════════════════════════════════════════
//  STATE & ROUTER
// ═══════════════════════════════════════════════════════════════
let MODE = 'firma';           // 'firma' | 'branchen'
let currentDetail = null;
let currentFN = null;
let fullLoaded = false;
let directFN = false;
const app = $('app');

function updateURL(params) {
  const url = new URL(window.location);
  Object.entries(params).forEach(([k, v]) => {
    if (v == null || v === '') url.searchParams.delete(k);
    else url.searchParams.set(k, v);
  });
  history.pushState(params, '', url);
}
function clearURL() {
  const url = new URL(window.location);
  url.search = '';
  history.pushState({}, '', url);
}

// Show/hide the search panel: detail view takes over the viewport.
function setView(view) {
  document.body.classList.toggle('detail-view', view === 'detail');
}

// ── Mode tabs ──
function switchMode(mode) {
  MODE = 'firma';
  document.querySelectorAll('.tabs').forEach(t => t.style.display = 'none');
  $('firma-panel') && ($('firma-panel').style.display = '');
  $('branchen-panel') && ($('branchen-panel').style.display = 'none');
  // clear results when switching
  app.innerHTML = '';
  const inp = $('searchInput');
  if (inp) inp.focus();
  // update URL mode (without triggering a search)
  const url = new URL(window.location);
  url.searchParams.set('mode', mode);
  history.replaceState(history.state, '', url);
}

// ═══════════════════════════════════════════════════════════════
//  FILTRATION HELPERS (read filter inputs)
// ═══════════════════════════════════════════════════════════════
function readFirmaFilters() {
  const rail = $('firma-filters');
  const open = rail && rail.classList.contains('open');
  if (!open) return { active: false };
  return {
    active: true,
    gericht: ($('f-gericht') || {}).value?.trim() || '',
    rechtsform: ($('f-rechtsform') || {}).value?.trim() || '',
    exakt: !!(($('f-exakt') || {}).checked),
  };
}
function activeFilterCount() {
  const f = readFirmaFilters();
  if (!f.active) return 0;
  return ['gericht', 'rechtsform'].filter(k => f[k]).length + (f.exakt ? 1 : 0);
}
function toggleFilters() {
  const rail = $('firma-filters');
  const btn = $('filter-toggle');
  const open = !rail.classList.contains('open');
  rail.classList.toggle('open', open);
  btn.classList.toggle('open', open);
  $('filter-count').textContent = activeFilterCount() || '';
  $('filter-count').style.display = activeFilterCount() ? '' : 'none';
}

// ═══════════════════════════════════════════════════════════════
//  FIRMA SEARCH
// ═══════════════════════════════════════════════════════════════
// Read the DB advanced-filter fields (PLZ, Ort, Straße, Person, Rechtsform, ÖNACE).
function readAdvFilters() {
  const ids = ['f-plz', 'f-seat', 'f-strasse', 'f-person', 'f-rechtsform-db', 'f-oenace'];
  const out = {};
  for (const id of ids) {
    const el = $(id);
    if (el && el.value.trim()) out[id] = el.value.trim();
  }
  return out;
}
function advFilterActive() { return Object.keys(readAdvFilters()).length > 0; }

let advTimer = null;
// Called on input in any DB filter field — debounced search via /crawl/search.
function onAdvFilter() {
  clearTimeout(advTimer);
  advTimer = setTimeout(doSearch, 300);
}

async function doSearch() {
  const input = $('searchInput');
  const q = input.value.trim();
  const adv = readAdvFilters();

  // DB advanced search (any of PLZ/Ort/Straße/Person/Rechtsform/ÖNACE set)
  if (Object.keys(adv).length > 0) {
    return doAdvSearch(q, adv);
  }

  if (!q) return;

  // FN → straight to detail
  if (isFN(q)) { showDetail(q); return; }

  const f = readFirmaFilters();
  // If filters active, prefer HVD suche-firma (it honours them)
  const useHvd = f.active && (f.gericht || f.rechtsform || f.exakt);

  app.innerHTML = skeletonResultsHtml(null, 5);
  updateURL({ q, mode: MODE });

  try {
    let merged = [];
    if (useHvd) {
      const params = new URLSearchParams({ query: q });
      if (f.exakt) params.set('exakt', 'true');
      if (f.gericht) params.set('gericht', f.gericht);
      if (f.rechtsform) params.set('rechtsform', f.rechtsform);
      const hvd = await apiFetch('/hvd/suche-firma?' + params.toString());
      merged = (hvd.results || []).map(r => ({
        fn: (r.fnr || '').replace(/\s+/g, ''),
        name: (r.name_lines || []).join(' '),
        seat: r.sitz,
        _src: 'hvd',
      }));
    } else {
      // evi first
      const evi = await apiFetch('/search/rich?query=' + encodeURIComponent(q));
      const eviRes = (evi.results || []).map(r => ({ ...r, _src: 'evi' }));
      // HVD phonetic as supplement when evi is thin
      const doHvd = eviRes.length < 3;
      let hvdRes = [];
      if (doHvd) {
        try {
          const hvd = await apiFetch('/hvd/suche-firma?query=' + encodeURIComponent(q));
          hvdRes = (hvd.results || []).map(r => ({
            fn: (r.fnr || '').replace(/\s+/g, ''),
            name: (r.name_lines || []).join(' '),
            seat: r.sitz,
            _src: 'hvd',
          }));
        } catch (_) { /* HVD unavailable — ignore */ }
      }
      const seen = new Set(eviRes.map(r => r.fn));
      merged = [...eviRes];
      for (const r of hvdRes) { if (!seen.has(r.fn)) { seen.add(r.fn); merged.push(r); } }
    }

    if (merged.length === 0) {
      const hasStar = q.includes('*');
      let hint = '';
      if (!hasStar) {
        hint = `<div style="margin-top:1rem"><button class="btn btn-primary btn-sm" onclick="doWildcardSearch('${esc(q)}')">🔍 Teilwort-Suche: „*${esc(q)}*"</button>`
          + `<div style="margin-top:.5rem;font-size:.8em;color:var(--text3)">HVD-Suche mit Wildcard — findet Firmen die den Begriff als Teil des Namens enthalten</div></div>`;
      } else {
        hint = `<div style="margin-top:.5rem;font-size:.8em;color:var(--text3)">Tipp: Anderer Suchbegriff oder eine FN (z.B. 475207i)</div>`;
      }
      app.innerHTML = `<div class="results"><div class="empty">Keine Ergebnisse für „${esc(q)}"${hint}</div></div>`;
      return;
    }

    renderResults(merged, { query: q });
  } catch (e) {
    app.innerHTML = `<div class="results"><div class="empty" style="color:var(--red)">Fehler: ${e.message}</div></div>`;
  }
}

// DB advanced search via /crawl/search. Renders result cards in the same
// format as the live evi search, clickable → detail (cache-aware).
// State for the advanced (DB) search — persists across page clicks.
let advState = { q: '', params: '', page: 1, pages: 1, total: 0 };

async function doAdvSearch(q, adv, page) {
  setView('list');
  page = page || 1;
  if (page === 1) app.innerHTML = skeletonResultsHtml('Erweiterte Suche…', 5);
  else app.innerHTML = skeletonResultsHtml('Seite ' + page + ' …', 5);

  // build the query string (only on page 1; reuse for pagination)
  if (page === 1) {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (adv['f-plz']) params.set('plz', adv['f-plz']);
    if (adv['f-seat']) params.set('seat', adv['f-seat']);
    if (adv['f-strasse']) params.set('street', adv['f-strasse']);
    if (adv['f-person']) params.set('person', adv['f-person']);
    if (adv['f-rechtsform-db']) params.set('legal', adv['f-rechtsform-db']);
    if (adv['f-oenace']) params.set('oenace', adv['f-oenace']);
    params.set('size', '40');
    params.set('sort', 'name'); params.set('dir', 'asc');
    advState.q = q; advState.params = params.toString();
  }

  // fetch the requested page
  const p = new URLSearchParams(advState.params);
  p.set('page', page);
  try {
    const d = await apiFetch('/crawl/search?' + p.toString());
    advState.page = d.page; advState.pages = d.pages; advState.total = d.total;
    const rows = (d.companies || []).map(c => ({
      fn: c.fn, name: c.name, seat: c.seat,
      legal_form: (c.merged_data || c).legal_form, plz: c.plz, _src: 'db',
    }));
    if (!rows.length && page === 1) {
      app.innerHTML = `<div class="results"><div class="empty">Keine Treffer im Cache (${d.total} insgesamt).<br><small>Der Cache wächst — probiere es später erneut.</small></div></div>`;
      return;
    }
    // header + results
    let html = `<div class="results"><div class="results-header"><span>📚 ${d.total} Firma(en) im Cache — Seite ${d.page}/${d.pages}</span></div>`;
    html += '<div>';
    rows.forEach((r, i) => { html += resultCardHtml(r, i); });
    html += '</div>';
    // pager
    html += '<div class="adv-pager">';
    if (d.page > 1) html += `<button class="btn btn-sm" onclick="doAdvSearch(advState.q, null, ${d.page - 1})">‹ zurück</button>`;
    html += `<span class="pager-info">Seite ${d.page} / ${d.pages}</span>`;
    if (d.page < d.pages) html += `<button class="btn btn-sm" onclick="doAdvSearch(advState.q, null, ${d.page + 1})">weiter ›</button>`;
    html += '</div>';
    html += '</div>';
    app.innerHTML = html;
    // scroll to top of results for new page
    if (page > 1) document.querySelector('.search-wrap').scrollIntoView({ behavior: 'smooth' });
  } catch (e) {
    app.innerHTML = `<div class="results"><div class="empty" style="color:var(--red)">Fehler: ${e.message}</div></div>`;
  }
}

async function doWildcardSearch(term) {
  app.innerHTML = skeletonResultsHtml(`HVD Teilwort-Suche „*${esc(term)}*"…`, 4);
  updateURL({ q: '*' + term + '*', mode: MODE });
  try {
    const hvd = await apiFetch('/hvd/suche-firma?query=' + encodeURIComponent('*' + term + '*'));
    const results = (hvd.results || []).map(r => ({
      fn: (r.fnr || '').replace(/\s+/g, ''),
      name: (r.name_lines || []).join(' '),
      seat: r.sitz,
      _src: 'hvd',
    }));
    if (results.length === 0) {
      app.innerHTML = `<div class="results"><div class="empty">Auch mit Teilwort-Suche keine Ergebnisse für „${esc(term)}"</div></div>`;
      return;
    }
    renderResults(results, { query: '*' + term + '*', wildcard: true });
  } catch (e) {
    app.innerHTML = `<div class="results"><div class="empty" style="color:var(--red)">Fehler: ${e.message}</div></div>`;
  }
}

// ═══════════════════════════════════════════════════════════════
//  UNIFIED RESULT CARDS
// ═══════════════════════════════════════════════════════════════
function renderResults(rows, meta) {
  let header = `<div class="results-header"><span>${rows.length} Ergebnis${rows.length !== 1 ? 'se' : ''}${meta.wildcard ? ' (HVD Teilwort)' : ''}</span>`;
  if (meta.applied && meta.applied.length) {
    header += `<span class="applied">${meta.applied.map(a => `<span>${esc(a)}</span>`).join('')}</span>`;
  }
  header += `</div>`;
  let html = `<div class="results">${header}`;
  rows.forEach((r, i) => { html += resultCardHtml(r, i); });
  html += `</div>`;
  app.innerHTML = html;
}

function resultCardHtml(r, i) {
  const srcTag = r._src === 'hvd' ? `<span class="src-tag">HVD</span>` : (r._src === 'cache' ? `<span class="src-tag">CACHE</span>` : '');
  const delay = (typeof i === 'number') ? ` style="--i:${Math.min(i, 12)}"` : '';
  return `<div class="result-card"${delay} onclick="showDetail('${esc(r.fn)}')">
    <div class="rc-main">
      <div class="rc-line1">
        <span class="fn">${esc(r.fn)}</span>
        <span class="name">${esc(r.name || '—')}</span>
      </div>
      <div class="rc-line2">
        ${r.seat ? `<span class="seat">📍 ${esc(r.seat)}</span>` : ''}
        ${r.legal_form ? `<span class="lf-pill">${esc(r.legal_form)}</span>` : ''}
        ${r.oenace_code ? `<span>🏷️ ${esc(r.oenace_code)}</span>` : ''}
        ${srcTag}
      </div>
    </div>
  </div>`;
}


// ═══════════════════════════════════════════════════════════════
//  BRANCHE (ÖNACE) SEARCH
// ═══════════════════════════════════════════════════════════════
let oenaceTree = [];
let selectedCode = null;
const LVL = { 1: 'Abschn', 2: 'Abteil', 3: 'Gruppe', 4: 'Klasse', 5: 'Unterkl' };

function initOenaceAutocomplete() {
  const $codeInput = $('f-oenace') || $('code-input');
  const $dropdown = $('ac-dropdown');
  if (!$codeInput) return;

  $codeInput.addEventListener('focus', () => { if (oenaceTree.length && !$codeInput.value) renderAC(''); });
  $codeInput.addEventListener('blur', () => setTimeout(closeAC, 180));
  $codeInput.addEventListener('input', () => {
    selectedCode = null;
    $('chip-row').innerHTML = '';
    renderAC($codeInput.value);
  });
  $codeInput.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); moveAC(1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); moveAC(-1); }
    else if (e.key === 'Enter') { e.preventDefault(); pickAC(acFocusIdx); }
    else if (e.key === 'Escape') { closeAC(); $codeInput.blur(); }
  });

  $('f-oenace') && $('f-oenace').addEventListener('keydown', (e) => { if (e.key === 'Enter') doSearch(); });

  document.addEventListener('click', (e) => {
    const wrap = $('ac-wrap');
    if (wrap && !wrap.contains(e.target)) $dropdown.classList.remove('open');
  });
}

let acItems = [];
let acFocusIdx = -1;

function renderAC(q) {
  const $dropdown = $('ac-dropdown');
  const ql = q.toLowerCase().trim();
  let items;
  if (ql) {
    items = oenaceTree
      .map((c) => {
        const label = (c.label_de || '').toLowerCase();
        const code = (c.code_display || '').toLowerCase();
        const numCode = c.numeric_code || '';
        let score = 0;
        if (label.startsWith(ql)) score += 100;
        else if (label.includes(' ' + ql)) score += 70;
        else if (label.includes(ql)) score += 30;
        if (code.startsWith(ql)) score += 90;
        else if (code.includes(ql)) score += 40;
        if (numCode.startsWith(ql)) score += 80;
        else if (numCode.includes(ql)) score += 30;
        return { ...c, _score: score };
      })
      .filter((c) => c._score > 0)
      .sort((a, b) => b._score - a._score)
      .slice(0, 50)
      .map(({ _score, ...rest }) => rest);
  } else {
    items = oenaceTree.slice(0, 80);
  }
  acItems = items;
  acFocusIdx = -1;

  if (!acItems.length) {
    $dropdown.innerHTML = '<div style="padding:.8rem 1rem;color:var(--text3);font-size:.82rem">Keine Übereinstimmung</div>';
    $dropdown.classList.add('open');
    return;
  }
  $dropdown.innerHTML = acItems.map((c, i) =>
    `<div class="ac-item${i === acFocusIdx ? ' focused' : ''}" data-i="${i}">
      <span class="ac-code">${esc(c.code_display || c.edv_code)}</span>
      <span class="ac-label">${esc(c.label_de)}</span>
      <span class="ac-level">${LVL[c.level] || ''}</span>
    </div>`
  ).join('');
  $dropdown.classList.add('open');
  $dropdown.querySelectorAll('.ac-item').forEach((el) => {
    el.addEventListener('click', () => pickAC(+el.dataset.i));
  });
}

function moveAC(d) {
  const n = acItems.length; if (!n) return;
  acFocusIdx = Math.max(-1, Math.min(n - 1, acFocusIdx + d));
  $('ac-dropdown').querySelectorAll('.ac-item').forEach((el, i) => el.classList.toggle('focused', i === acFocusIdx));
  if (acFocusIdx >= 0) $('ac-dropdown').children[acFocusIdx].scrollIntoView({ block: 'nearest' });
}

function pickAC(idx) {
  if (idx < 0 || idx >= acItems.length) return;
  let c = acItems[idx];
  // For high-level codes (section/abteilung) without a numeric search code, descend
  if (c.level <= 2 && !/\d{3,}/.test(c.numeric_code || '')) {
    const child = oenaceTree.find((x) =>
      x.section === c.section && x.level >= 3 && /\d{3,}/.test(x.numeric_code || '') &&
      (x.label_de || '').toLowerCase().includes((c.label_de || '').toLowerCase().split(/\s+/)[0] || '')
    ) || oenaceTree.find((x) => x.section === c.section && x.level >= 3 && /\d{3,}/.test(x.numeric_code || ''));
    if (child) c = { ...c, _searchCode: child.numeric_code || child.edv_code };
  }
  selectedCode = c;
  const $codeInput = $('f-oenace') || $('code-input');
  if ($codeInput) $codeInput.value = c.numeric_code || c.edv_code || c.label_de || c.code_display;
  closeAC();
  showChip(c);
}

function showChip(c) {
  $('chip-row').innerHTML =
    `<div class="code-chip">
      <span class="chip-code">${esc(c.code_display || c.edv_code)}</span>
      <span class="chip-label">${esc(trunc(c.label_de, 30))}</span>
      <span class="chip-x" onclick="clearCode(event)">✕</span>
    </div>
    <span class="chip-hint">↩ Tippe um zu ändern</span>`;
}

function clearCode(e) {
  if (e) e.stopPropagation();
  selectedCode = null;
  $('code-input').value = '';
  $('chip-row').innerHTML = '';
  $('code-input').focus();
}

function closeAC() {
  const d = $('ac-dropdown');
  d.classList.add('open');
  setTimeout(() => d.classList.remove('open'), 5);
}

async function doBranchenSearch() {
  if (!selectedCode) {
    app.innerHTML = `<div class="results"><div class="empty"><div class="icon">📋</div>Bitte zuerst eine Branche (ÖNACE) auswählen.</div></div>`;
    $('code-input').focus();
    return;
  }
  const numCode = selectedCode._searchCode || selectedCode.numeric_code || selectedCode.edv_code;
  const city = ($('city-input').value || '').trim();
  const name = ($('name-input').value || '').trim().toLowerCase();

  updateURL({ mode: 'branchen', code: numCode, city, name: name || '' });

  const btn = $('btn-go');
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> Suche…';
  app.innerHTML = skeletonResultsHtml('Firmen werden geladen…', 6);

  try {
    // Server-side seat filter when a city is given; otherwise just code lookup.
    const params = new URLSearchParams({ code: numCode, limit: 40 });
    if (city) params.set('seat', city);
    const data = await apiFetch('/oenace/companies?' + params.toString());
    let companies = data.companies || [];
    const unverified = data.count_unverified || 0;

    // Client-side name filter (works without cache)
    if (name) companies = companies.filter((c) => (c.fn || '').toLowerCase().includes(name) || (c.name || '').toLowerCase().includes(name));

    // Build applied-filter chips for the header
    const applied = [`🏷️ ${selectedCode.code_display || selectedCode.edv_code}`];
    if (city) applied.push(`📍 ${city}`);
    if (name) applied.push(`🔤 „${trunc(name, 18)}"`);

    const filtering = !!city;
    const total = companies.length;
    const firmaWord = (n) => n !== 1 ? 'Firmen' : 'Firma';

    // Count header — honest about what the city filter covers.
    let countLabel;
    if (filtering) {
      countLabel = total
        ? `${total.toLocaleString('de-AT')} ${firmaWord(total)} mit Sitz in „${esc(city)}"`
        : `Keine Firmen mit Sitz in „${esc(city)}" im Cache`;
    } else {
      countLabel = `${total.toLocaleString('de-AT')} ${firmaWord(total)}${total > 40 ? ' (zeige ' + total + ' von mehr)' : ''}`;
    }
    let header = `<div class="results-header">
      <span data-count>${countLabel}</span>
      <span class="applied">${applied.map((a) => `<span>${esc(a)}</span>`).join('')}</span>
    </div>`;

    // Unverified banner when city-filtering: companies we couldn't check.
    let banner = '';
    if (filtering && unverified > 0) {
      banner = `<div class="unverified-banner">
        <span>📍 ${unverified.toLocaleString('de-AT')} ${firmaWord(unverified)} ohne bekannten Sitz — könnten in „${esc(city)}" sein.</span>
        <button class="btn btn-ghost btn-sm" id="warm-btn" onclick="warmAndRefresh()">Sitzdaten ermitteln</button>
      </div>`;
    }

    if (!total && !(filtering && unverified > 0)) {
      btn.disabled = false; btn.innerHTML = 'Firmen suchen';
      app.innerHTML = `<div class="results"><div class="empty"><div class="icon">🔍</div>Für <strong>${esc(selectedCode.label_de)}</strong> keine Firmen gefunden.</div></div>`;
      return;
    }

    app.innerHTML = `<div class="results">${header}${banner}${companies.map((c, i) => cardFromCompany(c, i)).join('')}</div>`;

    // No city filter → backfill uncached cards client-side (enrich for display).
    // With a city filter, the server already returned only cached matches, so
    // every card is complete — no backfill needed.
    if (!filtering) {
      const needName = companies.filter((c) => !c.name);
      if (needName.length) backfillNames(needName, '');
    }

    btn.disabled = false;
    btn.innerHTML = 'Firmen suchen';
  } catch (e) {
    btn.disabled = false; btn.innerHTML = 'Firmen suchen';
    app.innerHTML = `<div class="results"><div class="empty" style="color:var(--red)">Fehler: ${e.message || e.status}</div></div>`;
  }
}

// Card that prefers already-cached fields, falls back to loading placeholder.
// Loading cards are CLICKABLE immediately (inline onclick) so they work
// before/without the async name backfill.
function cardFromCompany(c, i) {
  if (c.name) {
    return resultCardHtml({
      fn: c.fn, name: c.name, seat: c.seat, legal_form: c.legal_form, oenace_code: c.oenace_code, _src: 'cache',
    }, i);
  }
  const delay = (typeof i === 'number') ? ` style="--i:${Math.min(i, 12)}"` : '';
  return `<div class="result-card loading" data-fn="${esc(c.fn)}"${delay} onclick="showDetail('${esc(c.fn)}')">`
    + `<div class="rc-main"><div class="rc-line1">`
    + `<span class="fn">${esc(c.fn)}</span><span class="name" data-name>…</span>`
    + `</div><div class="rc-line2" data-meta>${c.oenace_code ? `<span>🏷️ ${esc(c.oenace_code)}</span>` : ''}</div></div></div>`;
}

// Parallel name/seat enrichment for uncached cards (no-city case only).
// Cards are already clickable (inline onclick); this only fills in display data.
// City filtering is now server-side, so this never hides cards.
async function backfillNames(companies) {
  const LIMIT = 6;
  const queue = [...companies];
  async function worker() {
    while (queue.length) {
      const c = queue.shift();
      const card = app.querySelector(`.result-card[data-fn="${cssEscape(c.fn)}"]`);
      if (!card) continue;
      const nameEl = card.querySelector('[data-name]');
      const metaEl = card.querySelector('[data-meta]');
      const oenaceMeta = c.oenace_code ? `<span>🏷️ ${esc(c.oenace_code)}</span>` : '';
      // "evi has no data for this FN" — keep clickable, do NOT repeat the FN.
      const noName = () => {
        if (nameEl) { nameEl.classList.add('name-muted'); nameEl.textContent = 'kein evi-Eintrag'; }
        if (metaEl) metaEl.innerHTML = `${oenaceMeta}<span style="color:var(--text3)">Details beim Öffnen</span>`;
      };
      try {
        const d = await apiFetch('/search/rich?query=' + encodeURIComponent(c.fn));
        const m = (d.results || []).find((r) => r.fn === c.fn);
        card.classList.remove('loading');
        if (m && m.name) {
          if (nameEl) { nameEl.classList.remove('name-muted'); nameEl.textContent = m.name; }
          if (metaEl) metaEl.innerHTML = `${oenaceMeta}${m.seat ? `<span class="seat">📍 ${esc(m.seat)}</span>` : ''}`;
        } else {
          noName();
        }
      } catch (_) {
        card.classList.remove('loading');
        noName();
      }
    }
  }
  await Promise.all(Array.from({ length: LIMIT }, worker));
}

// minimal CSS.escape polyfill for FN strings
function cssEscape(s) { return String(s).replace(/[^a-zA-Z0-9_-]/g, (m) => '\\' + m); }

// Warm the cache for the current code's unverified FNs, then re-search.
// Fetches the full company list (no seat filter), batch-looks-up each FN
// via /lookup (evi — fast, populates the cache seat), then re-runs the search
// so the server-side seat filter finds more matches.
async function warmAndRefresh() {
  if (!selectedCode) return;
  const numCode = selectedCode._searchCode || selectedCode.numeric_code || selectedCode.edv_code;
  const city = ($('city-input').value || '').trim();
  const btn = $('warm-btn');
  if (btn) { btn.disabled = true; }

  try {
    const data = await apiFetch('/oenace/companies?' + new URLSearchParams({ code: numCode, limit: 200 }).toString());
    const all = data.companies || [];
    // Only warm FNs we don't already have a seat for.
    const need = all.filter((c) => !c.seat);
    let done = 0;
    const LIMIT = 6;
    const queue = [...need];
    const updateProgress = () => {
      const pct = need.length ? Math.round((done / need.length) * 100) : 100;
      if (btn) btn.innerHTML = `<span class="spinner"></span> ${pct}% (${done}/${need.length})`;
      const span = app.querySelector('.unverified-banner > span');
      if (span) span.textContent = `📍 Sitzdaten ermitteln… ${done}/${need.length}`;
    };
    updateProgress();
    async function worker() {
      while (queue.length) {
        const c = queue.shift();
        try {
          await apiFetch('/lookup?fn=' + encodeURIComponent(c.fn));  // server writes back to cache
        } catch (_) { /* evi may have no data — fine */ }
        done++;
        if (done % 5 === 0 || done === need.length) updateProgress();
      }
    }
    await Promise.all(Array.from({ length: LIMIT }, worker));
  } catch (_) { /* ignore */ }
  // Re-run the search — server-side filter now covers the warmed companies.
  doBranchenSearch();
}

// ═══════════════════════════════════════════════════════════════
//  DETAIL VIEW
// ═══════════════════════════════════════════════════════════════
async function showDetail(fn) {
  currentFN = fn;
  fullLoaded = true; // we go straight to merged
  setView('detail');
  app.innerHTML = spinnerHtml('Laden…');
  updateURL({ fn });
  try {
    // Direct to /lookup/merged — cache-aware: returns DB cache if fresh,
    // else fetches evi+HVD live and caches for next time.
    const merged = await apiFetch('/lookup/merged?fn=' + encodeURIComponent(fn));
    const oenace = await apiFetch('/oenace?fn=' + encodeURIComponent(fn)).catch(() => null);
    currentDetail = merged;
    renderDetail(merged, oenace);
    // Load ownership edges (shareholders + beteiligungen) asynchronously
    loadOwnership(fn);
  } catch (e) {
    app.innerHTML = `<div class="detail"><div class="detail-card"><div class="detail-body"><div class="empty" style="color:var(--red)">Fehler: ${e.message}</div></div></div></div>`;
  }
}

// Load ownership edges (Eigentümer + Beteiligungen) and append to detail view.
async function loadOwnership(fn) {
  try {
    const [sh, inv] = await Promise.all([
      apiFetch('/crawl/shareholders/' + encodeURIComponent(fn)).catch(() => null),
      apiFetch('/crawl/beteiligungen/' + encodeURIComponent(fn)).catch(() => null),
    ]);
    const box = $('ownership');
    if (!box) return;
    const shareholders = (sh && sh.shareholders) || [];
    const investments = (inv && inv.beteiligungen) || [];
    let html = '';
    // Eigentümer (forward: who owns this)
    if (shareholders.length) {
      html += '<div class="relbox owners"><div class="rel-head">↓ Eigentümer (' + shareholders.length + ')</div>';
      html += shareholders.map(s => '<div class="edge owners"><span class="dir">↓</span><div class="body">' +
        '<div class="who">' + esc(s.name) + (s.resolved_fn ? ' <span class="tagfn resolved">FN ' + esc(s.resolved_fn) + '</span>' : '') + '</div>' +
        '<div class="meta">' + esc(s.role || '') + (s.since ? ' · seit ' + esc(s.since) : '') + '</div></div></div>').join('');
      html += '</div>';
    }
    // Beteiligungen (reverse: what this owns)
    if (investments.length) {
      html += '<div class="relbox beteiligungen"><div class="rel-head">↑ Beteiligungen (' + investments.length + ')</div>';
      html += investments.map(i => '<div class="edge beteiligungen"><span class="dir">↑</span><div class="body">' +
        '<div class="who"><span class="tagfn resolved">FN ' + esc(i.parent_fn) + '</span> ' + esc(i.shareholder) + '</div>' +
        '<div class="meta">' + esc(i.role || '') + '</div></div></div>').join('');
      html += '</div>';
    }
    if (!html) html = '<div style="color:var(--text3);font-size:.85em;padding:.5rem 0">Keine Gesellschafter/Beteiligungen im Cache.</div>';
    box.innerHTML = html;
  } catch (_) { /* ownership is best-effort */ }
}

async function loadFull() {
  if (!currentDetail) return;
  const btn = $('fullBtn');
  if (btn) { btn.disabled = true; btn.innerHTML = '<span class="spinner"></span> Laden…'; }
  try {
    const merged = await apiFetch('/lookup/merged?fn=' + encodeURIComponent(currentFN));
    fullLoaded = true;
    currentDetail = merged;
    renderDetail(merged, merged.oenace || null);
    toast('Vollständige Daten geladen');
  } catch (e) {
    toast('Fehler: ' + e.message);
    if (btn) { btn.disabled = false; btn.innerHTML = 'Vollständige Daten'; }
  }
}

function goBack() {
  setView('list');
  if (($('searchInput').value || '').trim()) {
    if (MODE === 'branchen') doBranchenSearch(); else doSearch();
  } else app.innerHTML = '';
}

function renderDetail(data, oenace) {
  const fn = data.fn || '';
  const name = data.name || '';
  const status = data.status || '';
  const addr = data.address || {};
  let addrDisplay = '';
  if (typeof addr === 'object' && addr.strasse) {
    addrDisplay = `${addr.strasse} ${addr.hausnummer || ''}, ${addr.plz || ''} ${addr.ort || ''}`.trim();
  } else if (typeof addr === 'string') addrDisplay = addr;
  if (typeof data.address === 'string') addrDisplay = data.address;
  if (data.address_text) addrDisplay = data.address_text;

  let persons = data.persons || [];
  if (data.persons_with_functions && data.persons_with_functions.length) {
    persons = data.persons_with_functions.map((p) => ({
      name: p.name || `${p.vorname || ''} ${p.nachname || ''}`.trim(),
      role: (p.functions || [{}]).map((f) => f.fkentext || p.role || '').filter(Boolean).join(', '),
      since: p.since || ((p.functions || [{}])[0] || {}).representation?.[0]?.since || '',
      source: p.source || 'hvd',
      representation: p.representation,
      birthdate: p.birthdate,
      until: p.until,
    }));
  }

  const vollzug = data.vollzug || [];
  const pubs = data.publications || [];
  const sources = data._sources || {};
  const sourceTags = Object.entries(sources)
    .filter(([k]) => k !== 'oenace')
    .map(([k, v]) => `<span class="badge badge-blue">${esc(k)}: ${esc(v)}</span>`).join(' ');

  const src = (field) => (!fullLoaded || !sources[field]) ? '' : `<span class="src">[${esc(sources[field])}]</span>`;
  const fullBtnHtml = fullLoaded
    ? '<span class="badge badge-green">✓ Vollständig</span>'
    : '<button class="btn btn-primary btn-sm" id="fullBtn" onclick="loadFull()">Vollständige Daten</button>';

  // Cache-hit indicator (when the cache backend is deployed)
  const cacheHitHtml = data._cached
    ? `<span class="cache-hit">⚡ aus Cache</span>`
    : '';

  let oenaceHtml = '';
  if (oenace && oenace.oenace_code) {
    oenaceHtml = `<div class="info-grid">
      <span class="label">ÖNACE</span><span class="value">${esc(oenace.oenace_code)} — ${esc(oenace.subclass || oenace.division || '')}</span>
      <span class="label">Sektion</span><span class="value">${esc(oenace.section || '')}</span>
      ${oenace.source ? `<span class="label">Quelle</span><span class="value">${esc(oenace.source)}</span>` : ''}
    </div>`;
  }

  const euids = data.euids || [];
  const euidHtml = euids.length ? `<div class="info-grid"><span class="label">EUID</span><span class="value">${esc(euids[0].euid || '')}</span></div>` : '';
  const branchOffices = data.branch_offices || [];
  const legalProc = data.legal_proceedings || [];

  let html = `<div class="detail"><div class="detail-card">`;
  html += `<div class="detail-header">
    <div>
      <h2>${esc(name)}</h2>
      <div style="margin-top:.4rem;display:flex;gap:.4rem;flex-wrap:wrap;align-items:center">
        <span class="fn" style="font-family:var(--mono);font-size:.74rem;color:var(--accent);background:transparent;border:1px solid var(--border);padding:2px 7px;border-radius:3px">${esc(fn)}</span>
        ${statusBadge(status)}
        ${data.legal_form ? `<span class="badge badge-purple">${esc(typeof data.legal_form === 'object' ? data.legal_form.text : data.legal_form)}</span>` : ''}
      </div>
    </div>
    <div class="meta">
      <button class="btn btn-ghost btn-sm" onclick="goBack()" title="Zurück">←</button>
      <button class="btn btn-ghost btn-sm" onclick="copyMarkdown()" title="Markdown kopieren">📋</button>
    </div>
  </div>`;

  html += `<div class="detail-actions">${fullBtnHtml}${sourceTags}${cacheHitHtml}</div>`;
  html += `<div class="detail-body">`;

  html += `<div class="info-grid">`;
  if (addrDisplay) html += `<span class="label">Adresse${src('address')}</span><span class="value">${esc(addrDisplay)}</span>`;
  if (data.seat) html += `<span class="label">Sitz${src('seat')}</span><span class="value">${esc(data.seat)}</span>`;
  if (data.registered) html += `<span class="label">Eintragung${src('registered')}</span><span class="value">${esc(data.registered)}</span>`;
  if (data.share_capital) html += `<span class="label">Grundkapital${src('share_capital')}</span><span class="value">${esc(typeof data.share_capital === 'object' ? JSON.stringify(data.share_capital) : data.share_capital)}</span>`;
  if (data.fiscal_year_end) html += `<span class="label">Geschäftsjahr${src('fiscal_year_end')}</span><span class="value">${esc(data.fiscal_year_end)}</span>`;
  if (data.purpose) html += `<span class="label">Firmenzweck${src('purpose')}</span><span class="value">${esc(data.purpose)}</span>`;
  if (data.representation) html += `<span class="label">Vertretung${src('representation')}</span><span class="value">${esc(data.representation)}</span>`;
  if (data.homepage && data.homepage.length) html += `<span class="label">Homepage${src('homepage')}</span><span class="value">${data.homepage.map((h) => '<a href="' + esc(h) + '" target="_blank">' + esc(h) + '</a>').join(', ')}</span>`;
  html += `</div>`;

  if (euidHtml) html += `<div class="new-section">${euidHtml}${fullLoaded ? '<span class="dot-new"></span>' : ''}</div>`;
  if (fullLoaded && (euids.length || vollzug.length || branchOffices.length || legalProc.length)) {
    html += `<div class="legend"><span class="dot-new"></span> Daten aus HVD-Vollzug (zusätzlich zu evi)</div>`;
  }
  if (oenaceHtml) html += `<div class="section"><div class="section-title">ÖNACE Klassifikation${src('oenace')}</div>${oenaceHtml}</div>`;

  if (persons.length) {
    html += `<div class="section"><div class="section-title">Personen & Funktionen${src('persons')}</div><table class="ptable"><thead><tr><th>Name</th><th>Rolle</th><th>Vertretung</th><th>Geb.-Datum</th><th>Seit</th><th>Bis</th><th>Quelle</th></tr></thead><tbody>`;
    persons.forEach((p) => {
      let repHtml = '';
      if (p.representation && p.representation.length) {
        const r = p.representation[0];
        const parts = [];
        if (r.type_text) parts.push(esc(r.type_text));
        if (r.text) parts.push(esc(r.text.join(', ')));
        repHtml = parts.join('<br>') + (fullLoaded ? ' <span class="dot-new"></span>' : '');
      }
      html += `<tr>
        <td class="col-name">${esc(p.name)}</td>
        <td class="col-role">${esc(p.role)}</td>
        <td class="col-rep">${repHtml}</td>
        <td class="col-birth">${p.birthdate ? esc(p.birthdate) + (fullLoaded ? ' <span class="dot-new"></span>' : '') : ''}</td>
        <td class="col-since">${esc(p.since)}</td>
        <td class="col-since">${p.until ? esc(p.until) : ''}</td>
        <td class="col-src">${esc(p.source || '')}</td>
      </tr>`;
    });
    html += '</tbody></table></div>';
  }

  if (branchOffices.length) {
    html += `<div class="section new-section"><div class="section-title">Zweigniederlassungen${src('branch_offices')}${fullLoaded ? '<span class="dot-new"></span>' : ''}</div><table class="ptable"><thead><tr><th>ZNR</th><th>Name</th><th>Adresse</th><th>Sitz</th></tr></thead><tbody>`;
    branchOffices.forEach((b) => {
      const bName = (b.name || []).join(' / ');
      const bAddr = b.address || {};
      const bAddrStr = [bAddr.strasse, bAddr.hausnummer, bAddr.plz, bAddr.ort].filter(Boolean).join(' ');
      html += `<tr><td class="col-since">${esc(b.znr || '')}</td><td class="col-name">${esc(bName)}</td><td class="col-role">${esc(bAddrStr)}</td><td class="col-role">${esc(b.seat || '')}</td></tr>`;
    });
    html += '</tbody></table></div>';
  }

  if (legalProc.length) {
    html += `<div class="section new-section"><div class="section-title">Rechtstatsachen${src('legal_proceedings')}${fullLoaded ? '<span class="dot-new"></span>' : ''}</div><ul class="vollzug-list">`;
    legalProc.forEach((lp) => {
      html += `<li><span class="vollzug-date">${esc(lp.datum_vom || '')}</span> <span class="vollzug-az">${esc(lp.code || '')}</span>${lp.zeichen ? ' · ' + esc(lp.zeichen) : ''}<div class="vollzug-text">${esc((lp.text || []).join(' · '))}</div></li>`;
    });
    html += '</ul></div>';
  }

  if (vollzug.length) {
    html += `<div class="section new-section"><div class="section-title">Firmenbuchvollzug${src('vollzug')}${fullLoaded ? '<span class="dot-new"></span>' : ''}</div><ul class="vollzug-list">`;
    vollzug.forEach((v) => {
      const court = v.court ? ` · ${esc(v.court.text || v.court.code || '')}` : '';
      html += `<li><span class="vollzug-date">${esc(v.vollzugsdatum)}</span> <span class="vollzug-az">${esc(v.az || '')}</span>${court}<div class="vollzug-text">${esc((v.antragstext || []).join(' · '))}</div></li>`;
    });
    html += '</ul></div>';
  }

  if (pubs.length) {
    html += `<div class="section"><div class="section-title">Veröffentlichungen</div><ul class="pub-list">`;
    pubs.forEach((p) => {
      html += `<li><span class="pdate">${esc(p.date)}</span><span class="ptype">${esc(p.type)}</span><span class="pdetails">${esc((p.details || []).join(', '))}</span></li>`;
    });
    html += '</ul></div>';
  }

  // Ownership edges (Eigentümer + Beteiligungen) — loaded async by loadOwnership()
  html += '<div id="ownership" style="margin-top:1rem"><span class="spinner"></span> Eigentümer/Beteiligungen werden geladen…</div>';

  html += '</div></div></div>';
  app.innerHTML = html;
}

function spinnerHtml(label, large) {
  return `<div class="results"><div class="empty"><span class="spinner${large ? ' lg' : ''}"></span><br><br>${esc(label)}</div></div>`;
}

// Skeleton shimmer placeholder for result-list loading states
function skeletonResultsHtml(label, n) {
  let html = `<div class="results">`;
  if (label) html += `<div class="results-header"><span>${esc(label)}</span></div>`;
  for (let i = 0; i < (n || 5); i++) {
    html += `<div class="skeleton-card">
      <div class="skel-line" style="width:${30 + (i % 3) * 15}%"></div>
      <div class="skel-line" style="width:${45 + (i % 2) * 20}%"></div>
    </div>`;
  }
  html += `</div>`;
  return html;
}

// ═══════════════════════════════════════════════════════════════
//  MARKDOWN EXPORT
// ═══════════════════════════════════════════════════════════════
function generateMarkdown(data) {
  if (!data) return '';
  const fn = data.fn || '';
  const name = data.name || '';
  const status = data.status || '';
  let addrDisplay = '';
  const addr = data.address || {};
  if (typeof addr === 'object' && addr.strasse) {
    addrDisplay = `${addr.strasse} ${addr.hausnummer || ''}, ${addr.plz || ''} ${addr.ort || ''}`.trim();
  } else if (typeof addr === 'string') addrDisplay = addr;
  if (typeof data.address === 'string') addrDisplay = data.address;
  if (data.address_text) addrDisplay = data.address_text;

  const lf = typeof data.legal_form === 'object' ? data.legal_form.text : (data.legal_form || '');
  let md = `# ${name} (${fn})\n\n| Feld | Wert |\n|------|------|\n`;
  md += `| Status | ${status} |\n`;
  if (lf) md += `| Rechtsform | ${lf} |\n`;
  if (addrDisplay) md += `| Adresse | ${addrDisplay} |\n`;
  if (data.seat) md += `| Sitz | ${data.seat} |\n`;
  if (data.registered) md += `| Eintragung | ${data.registered} |\n`;
  if (data.share_capital) md += `| Grundkapital | ${typeof data.share_capital === 'object' ? JSON.stringify(data.share_capital) : data.share_capital} |\n`;
  if (data.fiscal_year_end) md += `| Geschäftsjahr | ${data.fiscal_year_end} |\n`;
  if (data.purpose) md += `| Firmenzweck | ${data.purpose} |\n`;
  if (data.representation) md += `| Vertretung | ${data.representation} |\n`;

  const euids = data.euids || [];
  if (euids.length) md += `| EUID | ${euids[0].euid || ''} |\n`;
  const oenace = data.oenace || {};
  if (oenace.oenace_code) md += `| ÖNACE | ${oenace.oenace_code} — ${oenace.subclass || oenace.division || ''} |\n`;

  const persons = data.persons || [];
  if (persons.length) {
    md += '\n## Personen & Funktionen\n\n| Name | Rolle | Geb.-Datum | Seit | Bis | Quelle |\n|------|-------|-----------|------|-----|--------|\n';
    persons.forEach((p) => { md += `| ${p.name || ''} | ${p.role || ''} | ${p.birthdate || ''} | ${p.since || ''} | ${p.until || ''} | ${p.source || ''} |\n`; });
  }
  const bo = data.branch_offices || [];
  if (bo.length) {
    md += '\n## Zweigniederlassungen\n\n| ZNR | Name | Adresse | Sitz |\n|-----|------|--------|------|\n';
    bo.forEach((b) => {
      const bAddr = b.address || {};
      md += `| ${b.znr || ''} | ${(b.name || []).join(' / ')} | ${[bAddr.strasse, bAddr.hausnummer, bAddr.plz, bAddr.ort].filter(Boolean).join(' ')} | ${b.seat || ''} |\n`;
    });
  }
  if (data.homepage && data.homepage.length) md += `| Homepage | ${data.homepage.join(', ')} |\n`;
  const vollzug = data.vollzug || [];
  if (vollzug.length) {
    md += '\n## Firmenbuchvollzug\n\n| Datum | Aktenzeichen | Antragstext |\n|-------|-------------|-------------|\n';
    vollzug.forEach((v) => { md += `| ${v.vollzugsdatum || ''} | ${v.az || ''} | ${(v.antragstext || []).join('; ')} |\n`; });
  }
  const pubs = data.publications || [];
  if (pubs.length) {
    md += '\n## Veröffentlichungen\n\n| Datum | Typ | Details |\n|-------|-----|--------|\n';
    pubs.forEach((p) => { md += `| ${p.date || ''} | ${p.type || ''} | ${(p.details || []).join(', ')} |\n`; });
  }
  md += '\n---\n_Quelle: Firmenbuch API_';
  return md;
}

function copyMarkdown() {
  const md = generateMarkdown(currentDetail);
  if (!md) return;
  navigator.clipboard.writeText(md).then(() => toast('Markdown kopiert!')).catch(() => {
    const ta = document.createElement('textarea');
    ta.value = md; document.body.appendChild(ta); ta.select();
    document.execCommand('copy'); document.body.removeChild(ta);
    toast('Markdown kopiert!');
  });
}

// ═══════════════════════════════════════════════════════════════
//  INIT & DEEP-LINKING
// ═══════════════════════════════════════════════════════════════
window.addEventListener('popstate', (e) => {
  const fn = e.state && e.state.fn;
  const q = fn || (e.state && e.state.q);
  if (q) {
    if (MODE === 'firma') $('searchInput').value = q;
    if (fn || isFN(q)) { directFN = !!fn; setView('detail'); showDetail(q); }
    else { setView('list'); if (MODE === 'firma') doSearch(); }
  } else {
    setView('list');
    if (MODE === 'firma') $('searchInput').value = '';
    app.innerHTML = '';
  }
});

document.addEventListener('DOMContentLoaded', () => {
  initOenaceAutocomplete();
  // load ÖNACE tree for autocomplete
  apiFetch('/oenace/tree').then((d) => { oenaceTree = d.codes || []; }).catch(() => {});

  const input = $('searchInput');
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') doSearch(); });

  // Deep-link from URL
  const params = new URLSearchParams(window.location.search);
  const mode = params.get('mode');
  const fn = (params.get('fn') || '').trim();
  const q = (params.get('q') || '').trim();
  const code = params.get('code');

  if (mode === 'branchen' || code) {
    switchMode('branchen');
    if (code) {
      // restore code selection from tree (async) — best-effort
      const restore = () => {
        const c = oenaceTree.find((x) => (x.numeric_code || x.edv_code) === code);
        if (c) { selectedCode = c; $('code-input').value = c.label_de || c.code_display; showChip(c); }
      };
      if (oenaceTree.length) restore();
      else apiFetch('/oenace/tree').then((d) => { oenaceTree = d.codes || []; restore(); }).catch(() => {});
      const city = params.get('city') || '';
      const name = params.get('name') || '';
      if (city) $('city-input').value = city;
      if (name) $('name-input').value = name;
      if (city || name || code) doBranchenSearch();
    }
  } else {
    switchMode('firma');
    if (fn) { input.value = fn; directFN = true; setView('detail'); showDetail(fn); }
    else if (q) { input.value = q; doSearch(); }
    else input.focus();
  }
});

// expose for inline onclick handlers
Object.assign(window, {
  doSearch, doWildcardSearch, doBranchenSearch, showDetail, loadFull,
  goBack, copyMarkdown, switchMode, toggleFilters, clearCode, pickAC,
  warmAndRefresh, onAdvFilter,
});
