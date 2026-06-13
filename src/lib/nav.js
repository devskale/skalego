/* lib/nav.js - sticky nav background state
 * Toggles .nav-scrolled via a sentinel element + IntersectionObserver.
 * No window scroll listener. */

export function initNav() {
  const nav = document.getElementById('nav')
  const sentinel = document.querySelector('.nav-sentinel')
  if (!nav || !sentinel || !('IntersectionObserver' in window)) return
  new IntersectionObserver(([entry]) => {
    nav.classList.toggle('nav-scrolled', !entry.isIntersecting)
  }, { threshold: 0, rootMargin: '-1px 0px 0px 0px' }).observe(sentinel)
}
