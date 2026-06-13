/* lib/menu.js - mobile nav toggle
 * Off-canvas menu, aria-expanded synced, closes on link click. */

export function initMobileMenu() {
  const toggle = document.querySelector('.nav-toggle')
  const links = document.querySelector('.nav-links')
  if (!toggle || !links) return

  const setOpen = (open) => {
    links.classList.toggle('open', open)
    toggle.setAttribute('aria-expanded', String(open))
  }

  toggle.addEventListener('click', () => {
    setOpen(links.classList.contains('open') ? false : true)
  })
  links.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => setOpen(false)),
  )
}
