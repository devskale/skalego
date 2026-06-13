import anime from 'https://esm.sh/animejs@3.2.2'
import './style.css'

/* ============================================
   skale.dev — Hero Animation + Interactions
   ============================================ */

const hero = document.getElementById('hero')
if (!hero) throw new Error('No #hero found')

// ---- PARTICLE CANVAS ----
const canvas = document.getElementById('hero-canvas')
if (canvas) {
  const ctx = canvas.getContext('2d')
  let w, h, particles, mouse = { x: -999, y: -999 }
  const PARTICLE_COUNT = 80
  const CONNECTION_DIST = 150

  function resize() {
    w = canvas.width = innerWidth
    h = canvas.height = innerHeight
  }
  resize()
  addEventListener('resize', resize)
  addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY })

  class P {
    constructor() { this.reset() }
    reset() {
      this.x = Math.random() * w
      this.y = Math.random() * h
      this.vx = (Math.random() - 0.5) * 0.4
      this.vy = (Math.random() - 0.5) * 0.4
      this.r = Math.random() * 1.8 + 0.5
      this.alpha = Math.random() * 0.4 + 0.1
    }
    step() {
      this.x += this.vx; this.y += this.vy
      const dx = mouse.x - this.x, dy = mouse.y - this.y
      const dist = Math.sqrt(dx*dx + dy*dy)
      if (dist < 200) { this.vx += dx * 0.00008; this.vy += dy * 0.00008 }
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

  particles = Array.from({ length: PARTICLE_COUNT }, () => new P())

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x
        const dy = particles[i].y - particles[j].y
        const d = Math.sqrt(dx*dx + dy*dy)
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

  function loop() {
    ctx.clearRect(0, 0, w, h)
    particles.forEach(p => { p.step(); p.draw() })
    drawLines()
    requestAnimationFrame(loop)
  }
  loop()
}

// ---- HERO TEXT ANIMATION ----
function runHeroAnimation() {
  anime.timeline({ easing: 'easeOutExpo' })
    .add({ targets: '.hero-badge', opacity: [0, 1], translateY: [20, 0], duration: 800 })
    .add({ targets: '.hero-title', opacity: [0, 1], translateY: [30, 0], duration: 800 }, '-=400')
    .add({ targets: ['.hero-sub', '.hero-actions'], opacity: [0, 1], translateY: [15, 0], duration: 700, delay: anime.stagger(120) }, '-=300')
}

// ---- STAT COUNTERS ----
function initCounters() {
  const counters = document.querySelectorAll('.stat-num')
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.dataset.target)
        anime({ targets: entry.target, innerHTML: [0, target], round: 1, duration: 1500, easing: 'easeOutExpo' })
        observer.unobserve(entry.target)
      }
    })
  }, { threshold: 0.5 })
  counters.forEach(c => observer.observe(c))
}

// ---- NAV SCROLL BEHAVIOR ----
function initNav() {
  const nav = document.getElementById('nav')
  addEventListener('scroll', () => {
    nav.style.background = scrollY > 60 ? 'rgba(10,10,12,0.95)' : 'rgba(10,10,12,0.85)'
  }, { passive: true })
}

// ---- MOBILE MENU TOGGLE ----
function initMobileMenu() {
  const toggle = document.querySelector('.nav-toggle')
  const links = document.querySelector('.nav-links')
  if (!toggle || !links) return
  toggle.addEventListener('click', () => {
    const open = links.style.display === 'flex'
    links.style.display = open ? '' : 'flex'
    links.style.position = open ? '' : 'absolute'
    links.style.top = '68px'
    links.style.left = '0'
    links.style.right = '0'
    links.style.flexDirection = 'column'
    links.style.background = 'rgba(10,10,12,0.98)'
    links.style.padding = '16px 24px'
    links.style.gap = '12px'
    links.style.borderBottom = '1px solid rgba(255,255,255,0.06)'
  })
}

// ---- GO ----
function init() {
  runHeroAnimation()
  initCounters()
  initNav()
  initMobileMenu()
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}
