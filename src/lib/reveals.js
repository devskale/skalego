/* lib/reveals.js - scroll-reveal observer + hero entrance
 * CSS-driven (.is-visible triggers the transition defined in base.css).
 * Hero items reveal immediately on load; the rest reveal on scroll. */

import { prefersReducedMotion } from './env.js'

const IO_OPTIONS = { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }

/** Reveal hero items right away (staggered via CSS nth-child delays). */
export function revealHero() {
  document.querySelectorAll('#hero .reveal')
    .forEach((el) => el.classList.add('is-visible'))
}

/** Observe every non-hero .reveal and fade it in as it enters the viewport. */
export function initScrollReveals() {
  const els = document.querySelectorAll('.reveal')
  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('is-visible'))
    return
  }
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible')
        obs.unobserve(entry.target)
      }
    })
  }, IO_OPTIONS)
  els.forEach((el) => {
    if (el.closest('#hero')) return // hero handled by revealHero()
    obs.observe(el)
  })
}
