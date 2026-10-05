/* ============================================================
   site.js — skale.dev client init
   Bundled by Astro (module script, deferred → DOM is ready).
   Combines the original Vite modules: hero skale-matrix, reveals,
   nav (sentinel scroll state) and mobile off-canvas menu.
   ============================================================ */

import { createSkaleMatrix } from './skale-matrix.js';

const prefersReducedMotion =
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- hero skale-matrix: serial bumping word ---------- */
function initSkaleMatrix() {
  const el = document.getElementById('skale-matrix');
  if (!el) return;
  const matrix = createSkaleMatrix(el, {
    word: 'skale.dev',
    // hero backdrop: a large, legible serial char.
    // resting pillars are near-invisible; the active char pops bright red.
    // (matches the approved standalone look)
    high: 140,
    low: 2,
    foot: 20,
    cell: 26,
    lowTop: '#0f0f14',
    lowLeft: '#0a0a0d',
    lowRight: '#0c0c10',
    lowEdge: '#1e1e26',
    hiTop: '#ff5a4d',
    hiLeft: '#8a1f18',
    hiRight: '#b3271f',
    hiEdge: '#ff5a4d',
    reducedMotion: prefersReducedMotion ? 'reduce' : 'auto',
  });
  return matrix;
}

/* ---------- scroll reveal ---------- */
const IO_OPTIONS = { threshold: 0.12, rootMargin: '0px 0px -8% 0px' };

function revealHero() {
  document
    .querySelectorAll('#hero .reveal')
    .forEach((el) => el.classList.add('is-visible'));
}

function initScrollReveals() {
  const els = document.querySelectorAll('.reveal');
  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  // CSS scroll-driven animations (global.css) übernehmen die Sektion-Reveals,
  // wo unterstützt — Observer nur als Fallback laufen lassen.
  const cssReveals =
    typeof CSS !== 'undefined' && CSS.supports('animation-timeline: view()');
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    },
    IO_OPTIONS
  );
  els.forEach((el) => {
    if (el.closest('#hero')) return; // hero handled by revealHero()
    if (cssReveals) return; // CSS übernimmt (animation überschreibt opacity/transform)
    obs.observe(el);
  });
}

/* ---------- sticky nav background state (sentinel, no scroll listener) ---------- */
function initNav() {
  const nav = document.getElementById('nav');
  const sentinel = document.querySelector('.nav-sentinel');
  if (!nav || !sentinel || !('IntersectionObserver' in window)) return;
  new IntersectionObserver(
    ([entry]) => {
      nav.classList.toggle('nav-scrolled', !entry.isIntersecting);
    },
    { threshold: 0, rootMargin: '-1px 0px 0px 0px' }
  ).observe(sentinel);
}

/* ---------- mobile off-canvas menu ---------- */
function initMobileMenu() {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (!toggle || !links) return;

  const setOpen = (open, { returnFocus = false } = {}) => {
    links.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    if (!open && returnFocus) toggle.focus();
  };

  toggle.addEventListener('click', () => {
    setOpen(links.classList.contains('open') ? false : true);
  });
  links.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => setOpen(false))
  );
  // BFSG/WCAG 2.1.2: Escape schließt das Menü, Fokus kehrt zum Toggle zurück
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && links.classList.contains('open')) {
      setOpen(false, { returnFocus: true });
    }
  });
}

/* ---------- scrollspy: mark the nav link of the section in view ---------- */
function initScrollSpy() {
  const links = Array.from(document.querySelectorAll('.nav-links a:not(.btn)'));
  if (!links.length || !('IntersectionObserver' in window)) return;
  const byId = new Map();
  links.forEach((a) => {
    const id = (a.getAttribute('href') || '').split('#')[1];
    if (id) byId.set(id, a);
  });
  const sections = Array.from(document.querySelectorAll('section[id]')).filter((s) => byId.has(s.id));
  if (!sections.length) return;
  let current = '';
  const setActive = (id) => {
    if (id === current) return;
    current = id;
    links.forEach((a) => {
      const aid = (a.getAttribute('href') || '').split('#')[1];
      a.classList.toggle('is-active', aid === id);
    });
  };
  // center-line root: a section is active when it spans the viewport's vertical middle
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) setActive(e.target.id);
      });
    },
    { rootMargin: '-50% 0px -50% 0px', threshold: 0 }
  );
  sections.forEach((s) => spy.observe(s));
}

/* ---------- boot ---------- */
initSkaleMatrix();
revealHero();
initScrollReveals();
initNav();
initScrollSpy();
initMobileMenu();
