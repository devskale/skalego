---
target: index
total_score: 27
p0_count: 2
p1_count: 3
timestamp: 2026-07-09T16-11-55Z
slug: src-pages-index-astro
---
Method: dual-agent (A: pi-subprocess design review · B: pi-subprocess detector + contrast evidence)

# Critique: skale.dev homepage (`src/pages/index.astro`)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | No scrollspy / active-section state on an 8-section anchored page; only `.nav-scrolled` exists. User never knows which anchor they're in. |
| 2 | Match System / Real World | 3 | German copy, real model names, audience-appropriate terms (on-premise, DSGVO, Erstgespräch). Solid. |
| 3 | User Control & Freedom | 2 | Client belt marquee pauses on hover only — keyboard/touch can't pause it; mailto is the only contact channel; no back-to-top. |
| 4 | Consistency & Standards | 3 | System holds; docked for nav label "Projekte" vs heading "Aus der Praxis." vs `id="case-study"`, and 3 funnel-exit links (Agentic/Apps/Blog) at equal weight to conversion sections. |
| 5 | Error Prevention | 3 | No form, little to break; mailto `subject` pre-encoded. Near-N/A. |
| 6 | Recognition Rather Than Recall | 3 | Native `<details>`, standard table, familiar labels — but without an active state the 8-link nav demands recall. |
| 7 | Flexibility & Efficiency | 2 | No search; mobile needs 2 taps to any section; table-scroll hint is the one nice efficiency touch. |
| 8 | Aesthetic & Minimalist Design | 3 | Disciplined palette/type/elevation; docked for particle-canvas decoration, nav clutter (9 items), page length. |
| 9 | Error Recovery | 3 | Static, few failures; raw `dev@skale.dev` under the CTA is a real mailto-failure fallback. |
| 10 | Help & Documentation | 3 | FAQ + `.table-notes` glossary function as inline help; no dedicated support surface. |

**Total: 27/40 — Good band (address weak areas, solid foundation).** The visual system is excellent; the *information architecture serving conversion* is where it leaks.

## Anti-Patterns Verdict

**Does this look AI-generated?** No.

**LLM assessment:** This is one of the more disciplined AI-consultancy pages — and the discipline is the point. It actively refuses the named clichés: no hero-metric template, no identical icon-card grid (the `.bento` uses a genuine full-width lead cell, not a 3-up), no gradient text (the hero accent is a solid `#ff5a4d` italic span, not `background-clip: text`), no glassmorphism on cards (only the nav's `backdrop-filter` is structural), no per-section uppercase tracked eyebrows — the mono kickers are a single named system, exactly as DESIGN.md permits. The `--red`-only accent lock holds; tonal layering does the depth work; the `.models-table` with sourced, dated, mono tabular-nums data is a genuine "show, don't tell" artifact no chatbot-wrapper site ships. The qualify-out copy reads as committed voice, not hedging. The one faint template smell is the `#hero-canvas` particle network — "red nodes connecting on black" is still the AI/tech-background cliché, just better-dressed; a technical skeptic's eye may slide off it as decoration.

**Verdict: PASS.**

**Deterministic scan:** The bundled detector ran clean across `index.astro`, all section components, Nav, and Footer — **0 findings, exit 0**. No gradient text, no ghost-card (border + wide shadow) pairings, no over-rounded cards, no side-stripe borders, no decorative grid/stripe backgrounds. Structurally the site passes the anti-slop rules. No false positives to filter (nothing flagged).

**Where the detector caught what the LLM review missed — contrast.** The LLM review focused on IA and conversion and did not surface color contrast. The deterministic contrast pass caught two real failures that the design system's *own* Do ("hold body text at ≥4.5:1") is violating:

| token | hex | on `--bg` | ratio | meets 4.5 (body)? |
|---|---|---|---|---|
| `--text` (body) | `#d4d4d8` | `#08080a` | 13.54 | ✅ |
| `--text-bright` | `#fafafa` | `#08080a` | 19.17 | ✅ |
| `--text-dim` | `#71717a` | `#08080a` | **4.14** | ❌ marginal miss |
| `--text-faint` | `#52525b` | `#08080a` | **2.59** | ❌ fails both |
| `--red` | `#e53935` | `#08080a` | 4.73 | ✅ |

`--text-dim` (4.14:1) drives the nav links, footer links, contact link, `hero-sub`, and `section-sub` — the most-read secondary copy on the page. `--text-faint` (2.59:1) drives the clients-belt label, table units, model-creator, footer headers, and the source note. Both are under the project's own stated target. (`--red-dark #b71c1c` is defined but never referenced — dead token.)

**Visual overlays:** not injected. Browser visualization was skipped in the isolated detector sub-agent (no browser tool / dev server in that context); the parent confirmed the live page renders correctly via rodney but did not run the detector overlay.

## Overall Impression

A genuinely well-built, on-brand system that practices what it preaches on the visual side — and then undercuts its own thesis in three specific places: a load-bearing credibility artifact with unverifiable model names, a Google-Fonts payload that contradicts the DSGVO/lean claims, and a nav that leaks the single conversion funnel it exists to serve. The biggest opportunity: make the "show, don't tell" principle true end-to-end — verify the table, ship a real result in the case studies, and put a named principal behind the "wir."

## What's Working

1. **The `.models-table` as credibility artifact.** Sourced (`Quelle: artificialanalysis.ai, Stand Juni 2026`), mono `tabular-nums`, disclosed formula, license tags carrying the red "Open" signal, sticky first column + `↔ wischen zum Scrollen` hint on mobile. The page's thesis made literal — the single most differentiation-positive element.
2. **Qualify-out copy as voice.** "Keine generischen Chatbots", "Wir prüfen, ob KI das Problem wirklich löst", "Wenn KI nicht das richtige Werkzeug ist, sagen wir das offen." The copy does the PRODUCT.md job of repelling wrong fits without softening into agency warmth.
3. **Design-system discipline actually obeyed in CSS.** One accent enforced, zero-chroma neutrals, no ghost-card shadows, earned mono, locked 8/12/100 radii, full `prefers-reduced-motion` gating (canvas + belt hidden, `.reveal` forced visible). DESIGN.md is obeyed, not aspirational — rare.

## Priority Issues

- **[P0] Non-verifiable model names in the credibility artifact.**
  - Why it matters: The "engineering not theater" thesis rests on this table being checkable by a technical buyer. `Claude Fable 5`, `GPT-5.5 xhigh`, `Gemini 3.1 Pro`, `Kimi K2.5` — "Fable" is not a known Anthropic tier (Opus/Sonnet/Haiku), and the names read as future-dated/fabricated. A CTO who cross-references artificialanalysis.ai and finds a mismatch loses *all* trust — specifically at the one element designed to earn it. The show-don't-tell artifact becomes the tell.
  - Fix: Treat the table as load-bearing. Verify every `name`/`creator`/`idx`/`price` row against the cited source, date-stamp the pull ("Zuletzt geprüft: YYYY-MM-DD"), and remove any name that can't be verified.
  - Suggested command: **audit**

- **[P0] Nav dilutes the only conversion funnel that matters.**
  - Why it matters: PRODUCT.md defines one success metric — Erstgespräche. The persistent nav offers 9 options, 3 of which (Agentic, Apps, Blog) route *off* the homepage funnel at equal weight to the conversion sections. Every scroll position leaks qualified attention.
  - Fix: Collapse nav to the conversion spine — Services, Prozess, Projekte, Modelle, FAQ + the Kontakt CTA (6 items). Demote Agentic/Apps/Blog to a secondary "Mehr ▾" or footer-only.
  - Suggested command: **distill**

- **[P1] 11 webfont weights from Google Fonts undercut both the "lean" and the "DSGVO" claims.**
  - Why it matters: `BaseLayout.astro` loads Inter Tight `500;600;700;800` + Inter `400;500;600;700` + JetBrains Mono `400;500;700` = 11 font files from `fonts.googleapis.com/gstatic.com`. PRODUCT.md/DESIGN.md preach "static, fast, zero-JS by default" and sell DSGVO sovereignty — Google Fonts is the textbook third-party IP leak flagged by EU courts. A privacy-conscious AT/DE evaluator will catch the irony.
  - Fix: Self-host (woff2 subset, `font-display: swap`), drop unused weights (Inter Tight 500 *and* 800? Inter 700?). The lean-engineering claim then becomes true.
  - Suggested command: **optimize**

- **[P1] Body-text contrast under the project's own 4.5:1 target.**
  - Why it matters: `--text-dim` (4.14:1) carries nav links, footer links, the contact link, `hero-sub`, and `section-sub` — the most-read secondary copy. `--text-faint` (2.59:1) carries labels and metadata. Both fail the ≥4.5:1 the DESIGN.md Do explicitly sets. The "best-effort a11y" stance in PRODUCT.md doesn't excuse missing the project's own stated bar on its most-read text.
  - Fix: Bump `--text-dim` toward `#7e7e88` (~5:1) and `--text-faint` toward `#6a6a73` (~3.5:1, or restrict it to genuinely tertiary metadata and never body-adjacent copy). Re-verify all label/link uses after the change.
  - Suggested command: **audit**

- **[P1] No active-section state on a long anchored page.**
  - Why it matters: Eight `/#hash` nav links, no scrollspy. After the first scroll the user has zero "you are here" signal and must recall which link maps to which section — a visibility-of-status failure that compounds the nav-overload failure.
  - Fix: You already use `IntersectionObserver` for the sentinel and reveals. Add one observer on `section[id]` toggling `.is-active` on the matching nav link. Pure-CSS color lift to `--text-bright`.
  - Suggested command: **clarify**

- **[P2] Contact is mailto-only — a measurable B2B conversion leak.**
  - Why it matters: A `mailto:` can't validate input, silently fails on devices with no configured mail client, produces zero conversion analytics, and is higher friction than a 2-field form for a 30-min-meeting decision.
  - Fix: Add a minimal form (Name, 1-line Use-Case, Kontaktweg) → backend/mailto; keep the raw email as fallback. Closes the silent-fail and analytics gaps.
  - Suggested command: **harden**

## Persona Red Flags

**Jordan (confused first-timer):** Hero is clear, red CTA obvious in <5s. But by Services Jordan hits "Modell-Serving", "SLAs"; by CaseStudies "Vision-Layout-Erkennung", "HTR", "Semantische Extraktion"; by Models "Index v4", "Blended $/1M Tokens", "Open-Weight-Modelle." Only the `.table-notes` glossary exists — no glossary for body-copy jargon. (Intended qualify-out per PRODUCT.md — Jordan is being expelled, not served. Worth naming explicitly.)

**Riley (deliberate stress tester):** Hero `clamp(2.6rem, 6vw, 4.6rem)` at ≤360px: "Individuelle" (13 chars, Inter Tight 700) is borderline horizontal clip against ~280px content width; `text-wrap: balance` + the inline `.accent` span may not save it. Test on iPhone SE width. `.case-tech li` chip "Handschriftenerkennung (HTR)" (28 chars, mono) is wider than a 320px viewport and wraps awkwardly. The `↔ wischen zum Scrollen` table hint always renders on mobile, even after scrolling — minor noise. The client belt can't be paused by keyboard/touch (hover-only).

**Casey (distracted mobile):** 11 font files + a perpetual `requestAnimationFrame` canvas loop on first paint. Canvas is IO-gated and reduced-motion-gated (good), but the font payload isn't — slow 3G first paint shows fallback metrics reflowing. Tap targets are correct (`.nav-links a` 44px, `.btn` 48px, `.nav-toggle` 44px) ✅. `#hero { min-height: 92vh }` on landscape phones can push the CTA below the fold (the `min-height: auto` override fires at ≤760px *width*, not landscape height). `meduni.png` is ~140KB as PNG — WebP/AVIF would cut ~70%.

**Der technische Evaluator (CTO/engineering lead — project-specific):** The models table is make-or-break: if names verify → instant credibility; if "Claude Fable 5" et al. don't → instant disqualification (see P0). CaseStudies are capability descriptions, not results — no client names, no accuracy %, no time/ROI; next to the concrete models table they read tell-adjacent. No named principal in the body — the page speaks as an unnamed "wir" while the consultancy is a solo founder (DI Johann Waldherr appears only in footer + JSON-LD). A one-line signed presence near Contact would close the trust loop the sovereignty copy opens.

## Minor Observations

- `section { padding: 132px 0 }` × 8 ≈ very tall page; on mobile (84px) still a long scroll. Consider tightening mid-page sections.
- Nav label "Projekte" → `#case-study` whose heading is "Aus der Praxis." — three names for one destination. Pick one.
- `.belt-logo-dark { filter: invert(1) }` is applied per-logo via a hardcoded `dark: true` flag in `Clients.astro` — brittle if logos change.
- The FAQ answer to "Was kostet ein KI-Projekt?" slips into vendor-vague "Das hängt vom Umfang ab" — the one beat where the honest-engineer voice falters, and a skeptic will notice it's the one question that didn't get a concrete answer.
- `--red-dark #b71c1c` is a dead token (defined, never referenced).
- JSON-LD is thorough (ProfessionalService + WebSite + FAQPage) and FAQ answers are sourced from the same `faqs` array as the visible copy — they can't drift. Good.
- No 404 / broken-anchor handling for stale `#hash` links.

## Questions to Consider

1. If a CTO opened the models table in a second tab and searched artificialanalysis.ai for "Claude Fable 5," would they find it? If not, what is the single most credibility-destructive element doing on the page?
2. You sell DSGVO sovereignty and lean engineering, then ship 11 Google-Fonts weights from a third-party CDN that logs visitor IPs. Which of the two product claims is the lie?
3. The site speaks as "wir" but the consultancy is one named engineer who appears nowhere in the body. Why hide your strongest trust asset behind a plural pronoun?
4. The case studies describe what you *can* build; the models table shows what you *know*. Where does a skeptical buyer see what you have *already shipped, for whom, with what result* — and if it isn't there, is "show, don't tell" actually being practiced?
