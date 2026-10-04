/* ============================================================
   skale-matrix.js — parametrisierbare Puls-Matrix für skale.dev
   createSkaleMatrix(svgEl, options) → { update, get, start,
                                        stop, onCharChange, destroy }

   Seriell: EIN Zeichen von `word` ist gleichzeitig im Fokus, pulst
   hoch (raus → halten → rein) und wechselt dann smooth (Cross-Fade)
   zum nächsten. Palette ist auf die skale-Brand abgestimmt (dunkel +
   Signal-Rot). Die Kamera wird automatisch auf den viewBox gefittet.
   ============================================================ */

/* 5x7 pixel font (MSB = left column) */
const FONT = {
  s: ["01110", "10001", "10000", "01110", "00001", "10001", "01110"],
  k: ["10000", "10010", "10100", "11000", "10100", "10010", "10001"],
  a: ["00000", "01110", "10001", "11111", "10001", "10001", "00000"],
  l: ["10000", "10000", "10000", "10000", "10000", "10000", "11111"],
  e: ["00000", "01110", "10001", "11111", "10000", "01110", "00000"],
  ".": ["00000", "00000", "00000", "00000", "00000", "01100", "01100"],
  d: ["00001", "00001", "00001", "01111", "10001", "10001", "01111"],
  v: ["00000", "10001", "10001", "10001", "10001", "01010", "00100"],
};
const DEFAULT_GLYPH = "s"; // fallback for unknown chars

/* default options — every knob lives here */
const DEFAULTS = {
  word: "skale.dev",
  // timing (pulse: out → hold → in)
  bumpMs: 830, // raus: time to spring up
  holdMs: 0, // time held at the top
  inMs: 430, // rein: time to sink back down
  // smooth char switch
  fadeMs: 120, // overlap: next char rises while current sinks
  staggerMs: 40, // per-cell delay so the letter grows with a ripple
  // spring shape
  overshoot: 0.5, // wobble frequency (x PI) — 0 = no wobble
  ease: 1.3, // ease exponent — higher = more aggressive
  // geometry
  cell: 24,
  foot: 18,
  low: 6,
  high: 96,
  // palette — skale-brand: visible slate resting, Signal-Red active
  lowTop: "#4a4a56",
  lowLeft: "#2e2e38",
  lowRight: "#3a3a44",
  lowEdge: "#5a5a66",
  hiTop: "#ff5a4d",
  hiLeft: "#8a1f18",
  hiRight: "#b3271f",
  hiEdge: "#ff5a4d",
  // behavior
  reducedMotion: "auto", // "auto" | "reduce" | "allow"
};

const NS = "http://www.w3.org/2000/svg";
const mk = (t, a, p) => {
  const e = document.createElementNS(NS, t);
  for (const k in a) e.setAttribute(k, a[k]);
  p.appendChild(e);
  return e;
};

/* hex → rgb array */
function hexRgb(h) {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function lerpColor(a, b, t) {
  if (t <= 0) return a;
  if (t >= 1) return b;
  const A = hexRgb(a), B = hexRgb(b);
  const r = Math.round(A[0] + (B[0] - A[0]) * t);
  const g = Math.round(A[1] + (B[1] - A[1]) * t);
  const bl = Math.round(A[2] + (B[2] - A[2]) * t);
  return `rgb(${r},${g},${bl})`;
}

export function createSkaleMatrix(svgEl, options = {}) {
  const cfg = { ...DEFAULTS, ...options };
  const state = { curIdx: 0, curStart: performance.now(), raf: 0, running: false };

  let g, cols = [], glyphCache = new Map();
  let reduce = false;

  /* ---- build a 5x7 grid of low pillars; the char's cells bump tall ---- */
  function build() {
    svgEl.replaceChildren();
    g = mk("g", {}, svgEl);
    cols = [];
    const ROWS = 7, GLYPH = 5;
    const W = GLYPH * cfg.cell, H = ROWS * cfg.cell;
    const X0 = -W / 2, Y0 = -H / 2;
    for (let r = 0; r < ROWS; r++)
      for (let cc = 0; cc < GLYPH; cc++) {
        const x0 = X0 + cc * cfg.cell + (cfg.cell - cfg.foot) / 2;
        const y0 = Y0 + r * cfg.cell + (cfg.cell - cfg.foot) / 2;
        const grp = mk("g", {}, g);
        const faceL = mk("path", { "stroke-width": 0.5 }, grp);
        const faceR = mk("path", { "stroke-width": 0.5 }, grp);
        const lid = mk("path", { "stroke-width": 0.7 }, grp);
        cols.push({ r, cc, x0, y0, grp, faceL, faceR, lid });
      }
    cols.sort((a, b) => (a.x0 + a.y0) - (b.x0 + b.y0));
    fitCamera(W, H);
  }

  /* ---- auto-fit the isometric camera to the viewBox ---- */
  const VB_W = 400, VB_H = 320;
  function fitCamera(gridW, gridH) {
    const AZ = (45 * Math.PI) / 180, K = 0.5, ZF = Math.sqrt(1 - K * K);
    const c = Math.cos(AZ), s = Math.sin(AZ);
    const X0 = -gridW / 2, Y0 = -gridH / 2;
    const xs = [X0, X0 + gridW], ys = [Y0, Y0 + gridH];
    let Xmin = Infinity, Xmax = -Infinity, Vmin = Infinity, Vmax = -Infinity;
    for (const x of xs)
      for (const y of ys) {
        const X = x * c - y * s;
        const Y = x * s + y * c;
        Xmin = Math.min(Xmin, X);
        Xmax = Math.max(Xmax, X);
        Vmin = Math.min(Vmin, Y * K - cfg.high * ZF);
        Vmax = Math.max(Vmax, Y * K);
      }
    const M = 26; // margin
    const availW = VB_W - 2 * M, availH = VB_H - 2 * M;
    const S = Math.min(availW / (Xmax - Xmin), availH / (Vmax - Vmin));
    cfg.scale = S;
    cfg.ox = VB_W / 2 - S * (Xmin + Xmax) / 2;
    cfg.oy = VB_H / 2 - S * (Vmin + Vmax) / 2;
  }

  /* ---- camera ---- */
  const AZ = (45 * Math.PI) / 180, K = 0.5, ZF = Math.sqrt(1 - K * K);
  const c = Math.cos(AZ), s = Math.sin(AZ);
  const P = (x, y, z) => {
    const X = x * c - y * s, Y = x * s + y * c;
    return [cfg.ox + cfg.scale * X, cfg.oy + cfg.scale * (Y * K - z * ZF)];
  };

  /* draw one cell; b = brightness/height factor 0..1 (lerps low→hi palette) */
  function drawCell(col, h, b) {
    const A = [col.x0, col.y0], B = [col.x0 + cfg.foot, col.y0];
    const C = [col.x0 + cfg.foot, col.y0 + cfg.foot], D = [col.x0, col.y0 + cfg.foot];
    const a = P(...A, h), b2 = P(...B, h), cc = P(...C, h), dd = P(...D, h);
    const ga = P(...A, 0), gb = P(...B, 0), gc = P(...C, 0), gd = P(...D, 0);
    col.faceL.setAttribute("d", `M${dd}L${gd}L${gc}L${cc}Z`);
    col.faceR.setAttribute("d", `M${cc}L${gc}L${gb}L${b2}Z`);
    col.faceL.setAttribute("fill", lerpColor(cfg.lowLeft, cfg.hiLeft, b));
    col.faceR.setAttribute("fill", lerpColor(cfg.lowRight, cfg.hiRight, b));
    col.faceL.setAttribute("stroke", lerpColor(cfg.lowEdge, cfg.hiEdge, b));
    col.faceR.setAttribute("stroke", lerpColor(cfg.lowEdge, cfg.hiEdge, b));
    col.lid.setAttribute("fill", lerpColor(cfg.lowTop, cfg.hiTop, b));
    col.lid.setAttribute("stroke", lerpColor(cfg.lowEdge, cfg.hiEdge, b));
    col.lid.setAttribute("d", `M${a}L${b2}L${cc}L${dd}Z`);
  }

  function glyphFor(ch) {
    if (glyphCache.has(ch)) return glyphCache.get(ch);
    const g = FONT[ch] || FONT[DEFAULT_GLYPH];
    glyphCache.set(ch, g);
    return g;
  }

  /* spring rise (ease-out + wobble) */
  function spring(p, ease, overshoot) {
    return 1 - Math.pow(1 - p, ease) * Math.cos(p * Math.PI * overshoot);
  }
  /* the pulse envelope at local age a (ms): out → hold → in */
  function env(a) {
    const { bumpMs, holdMs, inMs, ease, overshoot } = cfg;
    if (a <= 0) return 0;
    if (a < bumpMs) return spring(a / bumpMs, ease, overshoot);
    if (a < bumpMs + holdMs) return 1;
    const sink = inMs > 0 ? Math.min(1, (a - bumpMs - holdMs) / inMs) : 1;
    return 1 - Math.pow(sink, ease);
  }

  let onChange = null;
  function onCharChange(fn) {
    onChange = fn;
    return api;
  }

  function tick(t) {
    const len = cfg.word.length;
    if (!len) return;
    const W = cfg.bumpMs + cfg.holdMs + cfg.inMs;
    const fade = cfg.fadeMs, stagger = cfg.staggerMs;
    const curAge = t - state.curStart;
    const nextStart = state.curStart + W - fade;
    const nextAge = t - nextStart;
    const curGlyph = glyphFor(cfg.word[state.curIdx]);
    const nextIdx = (state.curIdx + 1) % len;
    const nextGlyph = glyphFor(cfg.word[nextIdx]);

    for (const col of cols) {
      const delay = stagger * ((col.r + col.cc) / 12);
      const inCur = curGlyph[col.r][col.cc] === "1";
      const inNext = nextGlyph[col.r][col.cc] === "1";
      const eCur = inCur ? env(curAge - delay) : 0;
      const eNext = inNext ? env(nextAge - delay) : 0;
      const b = Math.max(eCur, eNext);
      const h = cfg.low + (cfg.high - cfg.low) * b;
      drawCell(col, h, b);
    }

    if (reduce) return; // freeze on first frame
    if (curAge >= W) {
      state.curIdx = nextIdx;
      state.curStart += W - fade;
      if (onChange) onChange(state.curIdx, cfg.word[state.curIdx]);
    }
    state.raf = requestAnimationFrame(tick);
  }

  function start() {
    if (state.running) return;
    state.running = true;
    state.curStart = performance.now();
    state.raf = requestAnimationFrame(tick);
  }
  function stop() {
    state.running = false;
    cancelAnimationFrame(state.raf);
  }

  const api = {
    update(next) {
      const prev = { ...cfg };
      Object.assign(cfg, next);
      if (next.cell != null || next.foot != null || next.high != null || next.word != null) {
        build();
      }
      if (next.reducedMotion != null) {
        reduce =
          next.reducedMotion === "reduce" ||
          (next.reducedMotion === "auto" && matchMedia("(prefers-reduced-motion: reduce)").matches);
      }
      if (next.word != null && next.word !== prev.word) {
        state.curIdx = 0;
        state.curStart = performance.now();
        if (onChange) onChange(state.curIdx, cfg.word[state.curIdx] || "");
      }
      if (state.running) {
        cancelAnimationFrame(state.raf);
        state.raf = requestAnimationFrame(tick);
      }
      return api;
    },
    get() {
      return { ...cfg };
    },
    start,
    stop,
    onCharChange,
    destroy() {
      stop();
      svgEl.replaceChildren();
    },
  };

  reduce =
    cfg.reducedMotion === "reduce" ||
    (cfg.reducedMotion === "auto" && matchMedia("(prefers-reduced-motion: reduce)").matches);
  build();
  if (onChange) onChange(state.curIdx, cfg.word[state.curIdx] || "");
  start();
  return api;
}
