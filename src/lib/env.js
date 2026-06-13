/* lib/env.js - environment helpers shared across modules */

export const prefersReducedMotion =
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Run fn on DOMContentLoaded, or immediately if DOM is already ready. */
export function ready(fn) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fn, { once: true })
  } else {
    fn()
  }
}
