/* ============================================================
   site.js — skale.dev client init
   Bundled by Astro (module script, deferred → DOM is ready).
   Combines the original Vite modules: hero-canvas, reveals,
   nav (sentinel scroll state) and mobile off-canvas menu.
   ============================================================ */

const prefersReducedMotion =
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- hero particle field (texture only) ---------- */
function initHeroCanvas() {
  if (prefersReducedMotion) return;

  const canvas = document.getElementById('hero-canvas');
  const hero = document.getElementById('hero');
  if (!canvas || !hero) return;

  const ctx = canvas.getContext('2d');
  let w = 0;
  let h = 0;
  let particles = [];
  const mouse = { x: -9999, y: -9999 };
  const CONNECTION_DIST = 150;
  const COUNT = Math.min(80, Math.floor(window.innerWidth / 16));

  function resize() {
    const rect = hero.getBoundingClientRect();
    w = canvas.width = rect.width;
    h = canvas.height = rect.height;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  class P {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.vx = (Math.random() - 0.5) * 0.35;
      this.vy = (Math.random() - 0.5) * 0.35;
      this.r = Math.random() * 1.6 + 0.4;
      this.alpha = Math.random() * 0.4 + 0.1;
    }
    step() {
      this.x += this.vx;
      this.y += this.vy;
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 200) {
        this.vx += dx * 0.00007;
        this.vy += dy * 0.00007;
      }
      if (this.x < -50) this.x = w + 50;
      if (this.x > w + 50) this.x = -50;
      if (this.y < -50) this.y = h + 50;
      if (this.y > h + 50) this.y = -50;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(229,57,53,${this.alpha})`;
      ctx.fill();
    }
  }

  particles = Array.from({ length: COUNT }, () => new P());

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < CONNECTION_DIST) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(229,57,53,${0.06 * (1 - d / CONNECTION_DIST)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  // pause rendering when hero scrolls out of view (perf)
  let visible = true;
  new IntersectionObserver(
    ([e]) => {
      visible = e.isIntersecting;
    },
    { threshold: 0 }
  ).observe(hero);

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  hero.addEventListener('mouseleave', () => {
    mouse.x = -9999;
    mouse.y = -9999;
  });

  function loop() {
    if (visible) {
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p) => {
        p.step();
        p.draw();
      });
      drawLines();
    }
    requestAnimationFrame(loop);
  }
  loop();
}

/* ---------- hero activity feed: live agent stream ---------- */
function initHeroFeed() {
  const list = document.getElementById('hero-feed');
  if (!list) return;

  // real, ticking clock — grounds the "live" claim
  const clock = document.getElementById('feed-clock');
  if (clock) {
    const tick = () => {
      clock.textContent = new Date().toLocaleTimeString('de-AT', {
        hour: '2-digit', minute: '2-digit', second: '2-digit',
      });
    };
    tick();
    setInterval(tick, 1000);
  }

  const track = list.querySelector('.feed-track');
  if (!track || prefersReducedMotion) return; // keep the static seed rows

  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = (arr) => arr[rnd(0, arr.length - 1)];

  // lucide-static v1.47.0 (ISC), inlined
  const I = {
    fileSearch:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"/><path d="M14 2v5a1 1 0 0 0 1 1h5"/><circle cx="11.5" cy="14.5" r="2.5"/><path d="M13.3 16.3 15 18"/></svg>',
    rocket:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.4 22.4 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>',
    layers:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"/><path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"/><path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"/></svg>',
    gitPR:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M13 6h3a2 2 0 0 1 2 2v7"/><path d="M6 9v12"/></svg>',
    users:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><path d="M16 3.128a4 4 0 0 1 0 7.744"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><circle cx="9" cy="7" r="4"/></svg>',
    check:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m16 9-5.5 5.5L8 12"/></svg>',
    globe:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>',
  };

  // never-repeating event generators (random params per emission)
  const gens = [
    { icon: I.fileSearch, actor: 'RAG-Agent', text: () => `analysiert ${rnd(4, 42)} ${pick(['Verträge', 'Handbücher', 'Tickets', 'Specs', 'Protokolle'])}` },
    { icon: I.rocket, actor: 'Deploy-Agent', text: () => `veröffentlicht ${pick([`v2.${rnd(0, 9)}.${rnd(0, 9)}`, 'Hotfix', 'Preview'])} auf ${pick(['Production', 'Staging', 'Edge'])}` },
    { icon: I.layers, actor: 'Embedding-Job', text: () => `Index aktualisiert · ${rnd(140, 4800).toLocaleString('de-DE')} neue Chunks` },
    { icon: I.gitPR, actor: 'Review-Agent', text: () => `prüft MR !${rnd(120, 980)} · ${rnd(1, 6)} Kommentare` },
    { icon: I.users, actor: 'Agent-Team', text: () => `Ticket #${rnd(4100, 9900)} gelöst · ${rnd(6, 84)} s` },
    { icon: I.check, actor: 'Test-Agent', text: () => `${rnd(48, 312)} Tests bestanden · 0 Fehler` },
    { icon: I.globe, actor: 'Recherche', text: () => `${rnd(3, 11)} Quellen geprüft · Antwort synthetisiert` },
  ];

  const ROW_H = 26, VIEW_H = 78, MAX_ROWS = 7;

  function buildRow(g) {
    const row = document.createElement('div');
    row.className = 'feed-item';
    row.dataset.t = String(Date.now());
    const icon = document.createElement('span');
    icon.className = 'feed-icon';
    icon.innerHTML = g.icon;
    const actor = document.createElement('span');
    actor.className = 'feed-actor';
    actor.textContent = g.actor;
    const action = document.createElement('span');
    action.className = 'feed-action';
    const time = document.createElement('span');
    time.className = 'feed-time';
    time.textContent = 'jetzt';
    row.append(icon, actor, action, time);
    return { row, action, time };
  }

  // scroll viewport down by one row: animate, then trim the top instantly
  function scrollAndTrim() {
    const target = track.children.length * ROW_H - VIEW_H;
    track.style.transform = `translateY(-${target}px)`;
    setTimeout(() => {
      while (track.children.length > MAX_ROWS) {
        track.removeChild(track.firstChild);
        const t = track.children.length * ROW_H - VIEW_H;
        track.style.transition = 'none';
        track.style.transform = `translateY(-${t}px)`;
        void track.offsetHeight; // reflow so the next transition re-engages
        track.style.transition = '';
      }
    }, 600);
  }

  function addEvent() {
    const g = pick(gens);
    const { row, action } = buildRow(g);
    const words = g.text().split(' ');
    const cursor = document.createElement('span');
    cursor.className = 'feed-cursor';
    cursor.textContent = '▍';
    row.insertBefore(cursor, row.querySelector('.feed-time'));
    track.appendChild(row);
    scrollAndTrim();

    // token-stream the action text, word by word
    let i = 0;
    (function step() {
      if (i >= words.length) {
        cursor.remove();
        setTimeout(addEvent, rnd(900, 2600)); // irregular, like real work
        return;
      }
      action.textContent += (i === 0 ? '' : ' ') + words[i++];
      setTimeout(step, rnd(55, 130));
    })();
  }

  // seed with already-completed rows so the stream never starts empty
  track.innerHTML = '';
  for (let k = 0; k < 3; k++) {
    const g = pick(gens);
    const { row, action, time } = buildRow(g);
    action.textContent = g.text();
    const age = rnd(6, 55) + k * 18;
    row.dataset.t = String(Date.now() - age * 1000);
    time.textContent = `vor ${age} s`;
    track.appendChild(row);
  }
  setTimeout(addEvent, rnd(700, 1500));

  // age the timestamps so rows read like a running log
  setInterval(() => {
    track.querySelectorAll('.feed-item').forEach((r) => {
      const el = r.querySelector('.feed-time');
      if (!el) return;
      const sec = Math.max(0, Math.round((Date.now() - Number(r.dataset.t)) / 1000));
      el.textContent = sec < 5 ? 'jetzt' : sec < 60 ? `vor ${sec} s` : `vor ${Math.floor(sec / 60)} min`;
    });
  }, 2000);
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
initHeroFeed();
initHeroCanvas();
revealHero();
initScrollReveals();
initNav();
initScrollSpy();
initMobileMenu();
