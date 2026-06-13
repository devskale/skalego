/* ============================================================
   main.js - entry point
   Imports styles + feature modules and boots them in order.
   ============================================================ */

import './style.css'

import { ready } from './lib/env.js'
import { initHeroCanvas } from './lib/hero-canvas.js'
import { revealHero, initScrollReveals } from './lib/reveals.js'
import { initNav } from './lib/nav.js'
import { initMobileMenu } from './lib/menu.js'

function init() {
  initHeroCanvas()
  revealHero()
  initScrollReveals()
  initNav()
  initMobileMenu()
}

ready(init)
