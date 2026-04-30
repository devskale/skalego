import anime from 'https://esm.sh/animejs@3.2.2'

/* ============================================
   skale.dev — Hero Animation
   s → [S] → [skale] logo reveal + particles
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
      // gentle attraction to mouse
      const dx = mouse.x - this.x, dy = mouse.y - this.y
      const dist = Math.sqrt(dx*dx + dy*dy)
      if (dist < 200) { this.vx += dx * 0.00008; this.vy += dy * 0.00008 }
      // bounds wrap
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

// ---- HERO TEXT ANIMATION: s → [S] → [skale] ----

function runHeroAnimation() {
  const tl = anime.timeline({
    easing: 'easeOutExpo',
    duration: 1000,
  })

  // Phase 1: Badge fades in
  tl.add({
    targets: '.hero-badge',
    opacity: [0, 1],
    translateY: [20, 0],
    duration: 800,
  })

  // Phase 2: Title line slides in
  tl.add({
    targets: '.hero-line-1',
    opacity: [0, 1],
    translateY: [30, 0],
    duration: 800,
  }, '-=400')

  // Phase 3: KI — the red letters pop in
  tl.add({
    targets: '.hero-k',
    scale: [0, 1.5, 1],
    opacity: [0, 1],
    duration: 900,
  }, '-=300')
  tl.add({
    targets: '.hero-i',
    scale: [0, 1.5, 1],
    opacity: [0, 1],
    duration: 900,
  }, '-=700')

  // Phase 5: Subtitle + CTA buttons fade in
  tl.add({
    targets: ['.hero-sub', '.hero-actions'],
    opacity: [0, 1],
    translateY: [15, 0],
    duration: 700,
    delay: anime.stagger(120),
  }, '-=300')

  // Phase 6: Scroll hint pulses
  tl.add({
    targets: '.hero-scroll-hint',
    opacity: [0, 0.5],
    translateY: [-10, 0],
    duration: 600,
  }, '-=200')
}

// ---- SCROLL REVEAL ----
function initScrollReveal() {
  const reveals = document.querySelectorAll(
    '.service-card, .project-card, .app-card, .about-grid, .testimonial, .cta-box, .section-header'
  )
  reveals.forEach(el => el.classList.add('reveal'))

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible')
        observer.unobserve(entry.target)
      }
    })
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' })

  reveals.forEach(el => observer.observe(el))
}

// ---- STAT COUNTERS ----
function initCounters() {
  const counters = document.querySelectorAll('.stat-num')
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.dataset.target)
        anime({
          targets: entry.target,
          innerHTML: [0, target],
          round: 1,
          duration: 1500,
          easing: 'easeOutExpo',
        })
        observer.unobserve(entry.target)
      }
    })
  }, { threshold: 0.5 })

  counters.forEach(c => observer.observe(c))
}

// ---- NAV SCROLL BEHAVIOR ----
function initNav() {
  let lastY = 0
  const nav = document.getElementById('nav')
  addEventListener('scroll', () => {
    const y = scrollY
    nav.style.background = y > 60
      ? 'rgba(10,10,12,0.95)'
      : 'rgba(10,10,12,0.85)'
    lastY = y
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
    links.style.position = 'absolute'
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

/* ---- TEXT SCRAMBLE (hover effect) ---- */
function scrambleText(el) {
  const original = el.textContent
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&'
  let frame = 0
  const totalFrames = 20
  return new Promise(resolve => {
    const interval = setInterval(() => {
      frame++
      let result = ''
      for (let i = 0; i < original.length; i++) {
        if (original[i] === ' ') { result += ' '; continue }
        if (frame > totalFrames - (i * 0.5)) { result += original[i] }
        else { result += chars[Math.floor(Math.random() * chars.length)] }
      }
      el.textContent = result
      if (frame >= totalFrames + original.length * 0.5) {
        clearInterval(interval)
        el.textContent = original
        resolve()
      }
    }, 25)
  })
}

/* ---- LLM CURSOR REVEAL (cinematic) ---- */
function initLLMReveal() {
  const section = document.getElementById('services')
  if (!section) return
  let triggered = false
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !triggered) {
      triggered = true
      runLLMAnimation()
      observer.disconnect()
    }
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' })
  observer.observe(section)
}

function runLLMAnimation() {
  const rows = document.querySelectorAll('.llm-row')
  const refs = document.querySelectorAll('.ref-item')
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*'
  
  rows.forEach((row, i) => {
    const baseDelay = i * 600
    const cursor = row.querySelector('.llm-cursor')
    const body = row.querySelector('.llm-body')
    const originalText = body.textContent
    
    // Show row (text always visible — animation is decorative)
    anime({ targets: row, opacity: [0.15, 1], duration: 400, delay: baseDelay, easing: 'easeOutCubic' })
    
    // Phase 1: cursor drops in from top
    anime.timeline({ delay: baseDelay })
      .add({
        targets: cursor,
        height: ['0', '100%'],
        boxShadow: [
          '0 0 4px rgba(229,57,53,0)',
          '0 0 16px rgba(229,57,53,0.8), 0 0 40px rgba(229,57,53,0.3)',
          '0 0 8px rgba(229,57,53,0.5), 0 0 20px rgba(229,57,53,0.2)',
        ],
        duration: 280,
        easing: 'easeOutExpo',
      })
      // Phase 2: cursor sweeps across while text scrambles in
      .add({
        targets: cursor,
        left: ['0%', '105%'],
        duration: 700,
        easing: 'easeInOutCubic',
        begin: () => {
          row.classList.add('active')
          // Scramble text reveal
          let frame = 0
          const totalFrames = 25
          const scrambleInterval = setInterval(() => {
            frame++
            let result = ''
            for (let c = 0; c < originalText.length; c++) {
              if (originalText[c] === ' ') { result += ' '; continue }
              const progress = frame / (totalFrames + c * 0.6)
              if (progress > 0.85) { result += originalText[c] }
              else { result += chars[Math.floor(Math.random() * chars.length)] }
            }
            body.textContent = result
            if (frame >= totalFrames + originalText.length * 0.6) {
              clearInterval(scrambleInterval)
              body.textContent = originalText
              row.classList.add('revealed')
              row.classList.remove('active')
            }
          }, 18)
        },
      }, '-=30')
      // Phase 3: cursor shrinks out
      .add({
        targets: cursor,
        height: ['100%', '0'],
        opacity: [1, 0],
        duration: 180,
        easing: 'easeInExpo',
      }, '-=80')
  })
  
  // References — staggered pop-in with red flash
  refs.forEach((ref, i) => {
    const delay = rows.length * 600 + 400 + i * 140
    anime.timeline({ delay })
      .add({
        targets: ref,
        opacity: [0, 1],
        scale: [0.8, 1],
        translateX: [-20, 0],
        duration: 550,
        easing: 'easeOutBack',
      })
      .add({
        targets: ref.querySelector('.ref-name'),
        color: ['#fff', '#E53935'],
        duration: 300,
        easing: 'easeOutQuad',
      }, '-=350')
  })
}

/* ---- CLICK TO RE-ANIMATE ROW ---- */
function initRowClick() {
  const rows = document.querySelectorAll('.llm-row')
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*'
  let openRow = null
  let animating = false

  rows.forEach(row => {
    row.style.cursor = 'pointer'
    
    const descText = row.dataset.desc || ''
    if (descText && !row.querySelector('.llm-desc')) {
      const descEl = document.createElement('div')
      descEl.className = 'llm-desc'
      descEl.textContent = descText
      row.appendChild(descEl)
    }

    row.addEventListener('click', () => {
      if (animating) return
      
      if (openRow && openRow !== row) {
        const prevDesc = openRow.querySelector('.llm-desc')
        if (prevDesc) {
          anime({ targets: prevDesc, maxHeight: [prevDesc.scrollHeight + 'px', '0'], opacity: [1, 0], paddingTop: [12, 0], paddingBottom: [12, 0], duration: 300, easing: 'easeInCubic' })
        }
        openRow.classList.remove('open')
      }

      const descEl = row.querySelector('.llm-desc')
      const isOpen = row.classList.contains('open')

      if (isOpen) {
        animating = true
        anime({ targets: descEl, maxHeight: [descEl.scrollHeight + 'px', '0'], opacity: [1, 0], paddingTop: [12, 0], paddingBottom: [12, 0], duration: 350, easing: 'easeInCubic', complete: () => { row.classList.remove('open'); openRow = null; animating = false } })
      } else {
        animating = true
        row.classList.add('open')
        openRow = row
        const cursor = row.querySelector('.llm-cursor')
        cursor.style.left = '0%'; cursor.style.top = '100%'; cursor.style.height = '0'; cursor.style.opacity = '1'
        descEl.style.maxHeight = '200px'; descEl.style.opacity = '0'; descEl.style.paddingTop = '12px'; descEl.style.paddingBottom = '12px'
        const originalDesc = descText
        descEl.textContent = ''

        anime.timeline({ complete: () => { animating = false } })
          .add({ targets: cursor, height: ['0', '40px'], boxShadow: ['0 0 4px rgba(229,57,53,0)', '0 0 20px rgba(229,57,53,1), 0 0 50px rgba(229,57,53,0.5)'], duration: 200, easing: 'easeOutExpo' })
          .add({ targets: cursor, left: ['0%', '105%'], duration: 1200, easing: 'easeInOutCubic', begin: () => {
            descEl.style.opacity = '1'
            let charIndex = 0
            const interval = setInterval(() => {
              if (charIndex < originalDesc.length) {
                // LLM-like: variable chunk size (1-5 chars), variable delay (10-45ms)
                const chunk = Math.floor(Math.random() * 4) + 1
                descEl.textContent = originalDesc.slice(0, Math.min(charIndex + chunk, originalDesc.length))
                charIndex += chunk
              } else {
                clearInterval(interval)
              }
            }, 18 + Math.random() * 28)
          }})
          .add({ targets: cursor, height: ['40px', '0'], opacity: [1, 0], duration: 180, easing: 'easeInExpo' }, '-=80')
      }
    })
  })
}

// ---- GO ----
function init() {
  runHeroAnimation()
  initScrollReveal()
  initCounters()
  initNav()
  initMobileMenu()
  initLLMReveal()
  initRowClick()
}

// Handle both normal load and Vite HMR
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}
