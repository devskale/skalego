/* lib/hero-canvas.js - ambient particle field (hero texture only)
 * Pauses when the hero is offscreen. Honors prefers-reduced-motion. */

import { prefersReducedMotion } from './env.js'

export function initHeroCanvas() {
  if (prefersReducedMotion) return

  const canvas = document.getElementById('hero-canvas')
  const hero = document.getElementById('hero')
  if (!canvas || !hero) return

  const ctx = canvas.getContext('2d')
  let w = 0
  let h = 0
  let particles = []
  const mouse = { x: -9999, y: -9999 }
  const CONNECTION_DIST = 150
  const COUNT = Math.min(80, Math.floor(window.innerWidth / 16))

  function resize() {
    const rect = hero.getBoundingClientRect()
    w = canvas.width = rect.width
    h = canvas.height = rect.height
  }
  resize()
  window.addEventListener('resize', resize, { passive: true })

  class P {
    constructor() { this.reset() }
    reset() {
      this.x = Math.random() * w
      this.y = Math.random() * h
      this.vx = (Math.random() - 0.5) * 0.35
      this.vy = (Math.random() - 0.5) * 0.35
      this.r = Math.random() * 1.6 + 0.4
      this.alpha = Math.random() * 0.4 + 0.1
    }
    step() {
      this.x += this.vx
      this.y += this.vy
      const dx = mouse.x - this.x
      const dy = mouse.y - this.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < 200) { this.vx += dx * 0.00007; this.vy += dy * 0.00007 }
      if (this.x < -50) this.x = w + 50
      if (this.x > w + 50) this.x = -50
      if (this.y < -50) this.y = h + 50
      if (this.y > h + 50) this.y = -50
    }
    draw() {
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(229,57,53,${this.alpha})`
      ctx.fill()
    }
  }

  particles = Array.from({ length: COUNT }, () => new P())

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x
        const dy = particles[i].y - particles[j].y
        const d = Math.sqrt(dx * dx + dy * dy)
        if (d < CONNECTION_DIST) {
          ctx.beginPath()
          ctx.moveTo(particles[i].x, particles[i].y)
          ctx.lineTo(particles[j].x, particles[j].y)
          ctx.strokeStyle = `rgba(229,57,53,${0.06 * (1 - d / CONNECTION_DIST)})`
          ctx.lineWidth = 0.5
          ctx.stroke()
        }
      }
    }
  }

  // pause rendering when hero scrolls out of view (perf)
  let visible = true
  new IntersectionObserver(([e]) => { visible = e.isIntersecting }, { threshold: 0 }).observe(hero)

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect()
    mouse.x = e.clientX - rect.left
    mouse.y = e.clientY - rect.top
  })
  hero.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999 })

  function loop() {
    if (visible) {
      ctx.clearRect(0, 0, w, h)
      particles.forEach((p) => { p.step(); p.draw() })
      drawLines()
    }
    requestAnimationFrame(loop)
  }
  loop()
}
