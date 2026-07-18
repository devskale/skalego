---
name: skale.dev
description: AI Engineering consultancy — dark, mono-annotated, single Signal Red accent.
colors:
  signal-red: "#e53935"
  signal-red-bright: "#ff5a4d"
  signal-red-dark: "#b71c1c"
  signal-red-glow: "#e539351f"
  signal-red-soft: "#e539350f"
  workshop-black: "#08080a"
  workshop-black-alt: "#0d0d10"
  surface-card: "#ffffff06"
  surface-card-hover: "#ffffff0b"
  bright-ink: "#fafafa"
  ink: "#d4d4d8"
  ink-dim: "#8a8a94"
  ink-faint: "#7a7a82"
  hairline: "#ffffff12"
  hairline-strong: "#ffffff1f"
typography:
  display:
    fontFamily: "Inter Tight, Inter, -apple-system, sans-serif"
    fontSize: "clamp(2.6rem, 6vw, 4.6rem)"
    fontWeight: 700
    lineHeight: 1.04
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Inter Tight, Inter, -apple-system, sans-serif"
    fontSize: "clamp(1.9rem, 4vw, 2.8rem)"
    fontWeight: 700
    lineHeight: 1.12
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Inter Tight, Inter, -apple-system, sans-serif"
    fontSize: "1.22rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "JetBrains Mono, Fira Code, monospace"
    fontSize: "0.74rem"
    fontWeight: 500
    letterSpacing: "0.05em"
rounded:
  sm: "8px"
  md: "12px"
  pill: "100px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "32px"
  xl: "56px"
  section: "132px"
components:
  button-primary:
    backgroundColor: "{colors.signal-red}"
    textColor: "#ffffff"
    rounded: "{rounded.sm}"
    padding: "11px 22px"
  button-primary-hover:
    backgroundColor: "{colors.signal-red-bright}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "11px 22px"
  button-nav-cta:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "8px 16px"
  button-lg:
    padding: "15px 30px"
  tag:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink-dim}"
    rounded: "{rounded.sm}"
    padding: "4px 10px"
    typography: "{typography.label}"
---

# Design System: skale.dev

## 1. Overview

**Creative North Star: "The Workshop Floor"**

This is a working engineer's bench, not a showroom. Dark surfaces, mono annotations that read like part numbers and status codes, tabular data laid out for inspection, and exactly one red tag reserved for what actually matters — the call to action, the open state, the live signal. Everything else stays quiet so the red carries weight when it appears. The visitor is a technical person sizing up whether this outfit can build real systems; the page should look like something built by people who build real systems.

The system is restrained on purpose. Depth comes from tonal layering (Workshop Black → its alt → white-transparency card surfaces) and hairline borders, never from decorative shadows or glass. Motion is a single exponential ease, used for state transitions and one orchestrated hero entrance — never choreography for its own sake, and never gated so hard that content ships blank on a paused tab. Type pairs a tight grotesque display (Inter Tight) with its humanist sibling (Inter) for body, and a monospace (JetBrains Mono) carries every label, kicker, number, and code block. The mono is earned: this is a site that shows install commands, model indices, and tech stacks. It is not costume.

What this system explicitly rejects (from PRODUCT.md): generic chatbot marketing, SaaS-hype landing-page clichés (the hero-metric template, identical icon-card grids, gradient text, glassmorphism decoration, tiny uppercase tracked eyebrows above every section), cloud-dependency framing, "AI as magic" vagueness, and vendor-voice urgency. The build itself is part of the credibility claim — static, fast, zero-JS by default — so the design must never ship heavy decoration to sell lean engineering.

**Key Characteristics:**
- Dark-first; one accent (Signal Red) used sparingly as state, not as theme.
- Tonal layering + hairlines for depth; flat by default, shadows only as state response.
- Three-family type system: Inter Tight (display) + Inter (body) + JetBrains Mono (labels/data/code).
- Mono labels are functional annotations (part numbers, status, units), never decorative kickers above every section.
- Fluid `clamp()` headings with tight (but never touching) letter-spacing; `text-wrap: balance` on headings.
- Locked radii: 8px / 12px / 100px. No over-rounding.
- One easing curve everywhere; reduced-motion is non-optional and fully gated.

## 2. Colors

A near-black working surface with a single saturated red kept in reserve. The red is a signal, not a theme — it appears on CTAs, active/open states, focus rings, and the occasional callout tag, and its rarity is what makes it land. Neutrals are true-grayscale (zero chroma), not warm-tinted; this is an engineering surface, not paper.

### Primary
- **Signal Red** (`#e53935` / `--red`): The one accent. Primary CTA background, focus rings, active/open accordion marker, link color on legal pages, the "Open" license tag, hover color on interactive text. Used on ≤10% of any given screen.
- **Signal Red Bright** (`#ff5a4d` / `--red-bright`): Hover/active state of the red — primary button hover, link hover, accordion summary hover. The "lit" version of the signal.
- **Signal Red Dark** (`#b71c1c` / `--red-dark`): Deep end of the red ramp; reserved for pressed/darker accents.
- **Signal Red Glow** (`#e539351f`, rgba 0.12 / `--red-glow`): Tinted background fill for red callouts (hero badge, case-study label, the ac-note box). Carries the red into a surface without saturating it.
- **Signal Red Soft** (`#e539350f`, rgba 0.06 / `--red-soft`): Lighter red tint for hover washes and the nav-cta hover background.

### Neutral
- **Workshop Black** (`#08080a` / `--bg`): The body surface. Near-black, zero chroma. Sets `color-scheme: dark` and the `theme-color` meta.
- **Workshop Black Alt** (`#0d0d10` / `--bg-alt`): One step up — table headers, the install/code block background, the footer band. The tonal layer that separates structure without a border.
- **Surface Card** (`#ffffff06`, white 0.025 / `--bg-card`): Card and hover-row fills. A faint white lift, never a solid panel.
- **Surface Card Hover** (`#ffffff0b`, white 0.045 / `--bg-card-hover`): The hover step of the card surface.
- **Bright Ink** (`#fafafa` / `--text-bright`): Headings, model names, the brightest text. The "ink" end of the text ramp.
- **Ink** (`#d4d4d8` / `--text`): Default body text. Held at ≥4.5:1 against Workshop Black.
- **Ink Dim** (`#8a8a94` / `--text-dim`): Subheads, secondary copy, nav links, footer body. The workhorse muted tone — 5.85:1 on Workshop Black, clears the 4.5 body target.
- **Ink Faint** (`#7a7a82` / `--text-faint`): Metadata, source notes, table units, the dimmest labels. 4.70:1 on Workshop Black — clears 4.5 even at small mono sizes. Reserve for genuinely secondary information; never body copy.
- **Hairline** (`#ffffff12`, white 0.07 / `--border`): Default 1px dividers, card outlines, table rows.
- **Hairline Strong** (`#ffffff1f`, white 0.12 / `--border-strong`): Outline-button borders, the stepper connector, stronger dividers.

### Named Rules
**The One Signal Rule.** Signal Red is used on ≤10% of any given screen. Its rarity is the point. If two red elements compete on one fold, one is in the wrong place. Never introduce a second accent color — there is no blue/green/purple in the brand palette. (The colored app icons on `/apps/` and `/agent-coding/` are the documented exception: they differentiate distinct external tools, and use desaturated red/blue/green/amber tints only inside 36px icon chips, never as accents elsewhere.)

**The Zero-Chroma Neutral Rule.** Neutrals are true grayscale. Do not tint Workshop Black or the ink ramp toward warm or cool "because the brand feels that way." Warmth is carried by the red accent and the copy, not by the surface.

## 3. Typography

**Display Font:** Inter Tight (with Inter, -apple-system fallback)
**Body Font:** Inter (with -apple-system, BlinkMacSystemFont fallback)
**Label/Mono Font:** JetBrains Mono (with Fira Code fallback)

**Character:** A tight grotesque display paired with its humanist sibling for body, plus a monospace that does real work — it carries every label, kicker, table number, install command, and code block. The mono is functional, not decorative: this site shows model indices, tech stacks, and `pi install` commands, so monospace annotations read as part numbers and status codes on a workshop bench, not as "technical" costume.

### Hierarchy
- **Display** (Inter Tight 700, `clamp(2.6rem, 6vw, 4.6rem)`, line-height 1.04, letter-spacing -0.035em): The hero H1 only. `text-wrap: balance`. The italic red accent span inside it is weight 600.
- **Headline** (Inter Tight 700, `clamp(1.9rem, 4vw, 2.8rem)`, line-height 1.12, letter-spacing -0.03em): Section titles (`## section-title`). `text-wrap: balance`.
- **Title** (Inter Tight 600, 1.1–1.5rem, line-height 1.2–1.3, letter-spacing -0.01 to -0.02em): Card and step headings, blog post titles, the bento wide cell. Scales within the range by importance.
- **Body** (Inter 400, 15px, line-height 1.65): Default paragraph copy. Cap line length at 62–75ch (FAQ answers cap at 62ch; section subs at 54ch). `text-wrap: pretty` on long prose.
- **Label** (JetBrains Mono 500, 0.64–0.78rem, letter-spacing 0.04–0.16em, frequently uppercase): Kickers, tags, table headers/units, the hero badge, footer column headers, the nav logo box. Uppercase + wide tracking (0.08–0.16em) is reserved for short metadata labels — never body copy.

### Named Rules
**The Letter-Spacing Floor Rule.** Display and headline letter-spacing never goes below -0.04em. The hero sits at -0.035em, section titles at -0.03em. Anything tighter and the letters touch; cramped is not "designed."

**The Earned Mono Rule.** JetBrains Mono is used where monospace carries information — numbers, code, units, part-number-style labels, status tags. It is never used as a decorative "technical" font for body copy or headings. If a mono label doesn't annotate real data, it doesn't belong.

**The One Kicker Rule.** A mono uppercase tracked label is a deliberate brand element when it appears as a single named system (the hero badge "AI Engineering", the clients-belt label "Im Einsatz bei", the bento kicker "01/02/03" on a genuine three-part sequence). Repeating a tiny uppercase tracked eyebrow above every section heading is prohibited scaffolding, not voice.

## 4. Elevation

This system is flat by default. Depth is conveyed by tonal layering — Workshop Black → Workshop Black Alt → white-transparency card surfaces — and by hairline borders, not by shadows. There is no ambient drop-shadow vocabulary on cards or surfaces at rest. The single shadow in the system is a state response: a red glow that appears under the primary button only on hover. Everything else stays flat and lets the tonal steps do the separating.

### Shadow Vocabulary
- **Primary Button Hover Glow** (`box-shadow: 0 8px 28px rgba(229,57,53,0.28)`): The only shadow in the system. Appears on `.btn-primary:hover` only — a red glow under the filled CTA. Never paired with a border (the button is `border: none`); never applied to cards.
- **Inset Highlight** (`box-shadow: 0 1px 0 rgba(255,255,255,0.15) inset`): A 1px top-edge highlight on the primary button at rest, giving the solid red a subtle physical edge. Inset only.

### Named Rules
**The Flat-By-Default Rule.** Surfaces are flat at rest. Shadows appear only as a response to state (the primary-button hover glow). Never pair a 1px border with a soft wide drop shadow on the same element — that is the ghost-card pattern and it is prohibited. Pick a border OR a defined shadow (≤8px blur), never both as decoration.

**The Tonal-Step Rule.** When two surfaces need to separate, step the tonal layer (bg → bg-alt → surface-card) before reaching for a border, and reach for a border before reaching for a shadow.

## 5. Components

### Buttons
- **Shape:** Slightly rounded (8px, `--radius-sm`). Never pill-shaped, never over-rounded.
- **Primary:** Solid Signal Red (`--red`) fill, white text, 11px 22px padding, Inter 600 0.92rem, `border: none`, a 1px inset white highlight at rest. This is the Erstgespräch CTA — the most important affordance on the page.
- **Hover / Focus:** Background lifts to Signal Red Bright (`--red-bright`), translates up 1px, and gains the red hover glow shadow. `:active` scales to 0.98. `:focus-visible` gets a 2px Signal Red outline at 3px offset. Hover blur is 28px — but on a filled borderless button, not a ghost card.
- **Outline / Ghost:** Transparent background, Ink text, 1px Hairline Strong border, 8px radius. Hover lifts border to Ink Dim and fills with Surface Card. The nav CTA is the ghost variant at 8px 16px padding.
- **Large:** `.btn-lg` bumps to 15px 30px / 1rem for hero and final CTA. On mobile (≤760px) all buttons hit a 48px min-height tap target.

### Chips / Tags
- **Style:** JetBrains Mono, 0.68–0.73rem, 4px 10px padding, 5–8px radius, Surface Card background, 1px Hairline border, Ink Dim text. Used for tech stacks (case-tech), app/guide tags, and table license tags.
- **License Tag (state variant):** `lic-open` uses Signal Red Bright text on Signal Red Soft fill with a red-tinted border (the "live/open" signal); `lic-prop` stays Ink Faint on transparent. The red tag is the open-source signal — consistent with red = live/active.

### Cards / Containers
- **Corner Style:** 12px (`--radius`). Cards top out here; never 24px+.
- **Background:** Surface Card (white 0.025) at rest, Surface Card Hover (white 0.045) on hover.
- **Border:** 1px Hairline. On hover, border lifts to a red tint (`rgba(229,57,53,0.35)`) and the card translates up 2px. No shadow.
- **Internal Padding:** 22–32px depending on density (case cards 32px 30px; guide/app cards 22px 24px).
- **Bento (services):** A 2-column grid with 1px Hairline gutters (the grid background shows through as dividers), cells on Workshop Black, the first cell spanning full width. No card borders — the grid IS the structure.

### Inputs / Fields
- No form inputs in the current build (contact is a mailto). When inputs are added: Workshop Black Alt background, 1px Hairline border, 8px radius, Ink text, focus = 2px Signal Red outline. Placeholder text must hit ≥4.5:1 — do not use Ink Faint for placeholders.

### Navigation
- **Style:** Fixed top bar, 68px tall, Workshop Black at 60% opacity with a 16px backdrop blur + saturate, lifting to 82% opacity + Hairline bottom border once scrolled past the sentinel. Logo is the mono "skale" red box + ".dev" dim extension. Links are Ink Dim → Ink Bright on hover, 0.88rem, 30px gap.
- **Mobile (≤760px):** Collapses to an off-canvas dropdown — full-width links at 1rem, 44px min-height tap targets, backdrop-blurred Workshop Black at 97% opacity. Hamburger animates to an X.

### Signature Components
- **Models Table:** The credibility artifact. Full-width, `border-collapse`, 1px Hairline row dividers, Workshop Black Alt header band, mono tabular-nums on all numeric columns, sticky first column + horizontal scroll with a "wischen zum Scrollen" hint on mobile (≤760px). License tags carry the red open-source signal. This is the "show, don't tell" principle made literal — real model data, sourced and dated.
- **FAQ Accordion:** Native `<details>`/`<summary>`, no JS. Hairline dividers between items, a mono plus icon that rotates to a red minus on open. Summary in Inter Tight 500; answer capped at 62ch. The red-on-open state is the one signal.
- **Client Belt:** A CSS-only marquee (48s linear infinite) of grayscale customer logos, edge-masked with a linear-gradient, paused on hover. The "Im Einsatz bei" mono label sits above it. Gated off entirely on reduced motion.
- **Hero Canvas:** A particle-field canvas (≤80 nodes, mouse-attracted, 0.32 opacity) behind the hero — the one piece of ambient motion. Hidden on reduced motion and on the noscript fallback. It is texture, not content; the headline must read fully without it.
- **Terminal Install Block:** A Workshop Black Alt panel with a Hairline border, a faux title bar, and mono code with comment/promt color tokens (comments in Ink Faint, the `pi` prompt in Signal Red). The "practice what you preach" principle made literal — the install command is shown, not hidden behind a button.

## 6. Do's and Don'ts

### Do:
- **Do** use Signal Red (`#e53935`) as the single accent, reserved for CTAs, active/open states, focus rings, and the occasional callout tag — and keep it under ~10% of any screen.
- **Do** convey depth with tonal steps (bg → bg-alt → surface-card) and 1px hairlines before reaching for any shadow.
- **Do** hold body text (Ink `#d4d4d8`) at ≥4.5:1 against Workshop Black; if a muted tone is too close, bump it toward Bright Ink, not toward "elegance."
- **Do** keep display letter-spacing at -0.03 to -0.035em (floor -0.04em) and use `text-wrap: balance` on h1–h3.
- **Do** use JetBrains Mono only where it annotates real data — numbers, code, units, part-number labels, status tags.
- **Do** gate every animation on `prefers-reduced-motion`: hide the hero canvas and belt, and force `.reveal` to visible. Reveals must enhance an already-visible default, never gate content visibility on a class trigger.
- **Do** keep radii to 8px / 12px / 100px (pill). Cards cap at 12px.
- **Do** back every claim with a concrete artifact — real model data in the table, named tech stacks on case studies, a shown install command. This is the "show, don't tell" principle.

### Don't:
- **Don't** introduce a second accent color. There is no blue/green/purple in the brand palette (the colored app/guide icon chips are the documented exception for differentiating external tools only).
- **Don't** tint the neutrals warm or cool. Workshop Black and the ink ramp are zero-chroma gray. The cream/sand/beige warm-neutral body background is explicitly prohibited — this is an engineering surface, not paper.
- **Don't** pair a 1px border with a soft wide (≥16px blur) drop shadow on the same element — the ghost-card pattern. Pick a border OR a defined shadow, never both as decoration.
- **Don't** use gradient text (`background-clip: text` + gradient). Emphasis is via weight, size, or the single solid Signal Red — never a gradient.
- **Don't** use glassmorphism / decorative blurs as the default card treatment. The nav's backdrop-blur is a structural necessity (fixed bar over content), not a card style.
- **Don't** ship the hero-metric template (big number + small label + gradient accent) or identical icon-card grids repeated endlessly — these are the SaaS-hype clichés PRODUCT.md rejects.
- **Don't** repeat a tiny uppercase tracked eyebrow above every section heading. One named kicker system is voice; an eyebrow on every section is AI scaffolding.
- **Don't** use mono as decorative "technical" costume for body copy or headings. If a mono label doesn't annotate real data, it doesn't belong.
- **Don't** frame AI as magic, imply cloud-dependency, or use vendor-voice urgency. Copy qualifies the wrong visitor out on purpose — don't soften it into agency warmth.
- **Don't** ship heavy, JS-laden decoration to sell lean engineering. The build itself is a credibility claim — keep it static, fast, zero-JS by default.
- **Don't** over-round cards (24px+). No brand wants "insanely rounded."
