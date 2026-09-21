# Visual Patterns (2026)

Concrete, stealable visual patterns from the SOTA sites. Each has a name, the sites that use it,
what it looks like, and when to reach for it.

## 1. The Real-Product Hero (Linear)
**What:** The hero is not a mockup — it's the actual product running, live. Activity feed with real
timestamps, real issue cards, real statuses, real agent actions ("Linear created the issue via Slack… 2min ago").
**Sites:** Linear (canonical), Loom (demo-first, "Get Loom Free" not "Request a Demo"), Mercury (live dashboard demo).
**When:** You have a real product and the audience is technical. The specificity is the trust signal.
**Steal:** animate a believable live feed in the hero — real-looking entities, real-time deltas, agent actions.

## 2. Swiss Minimalism / Monochrome (Vercel)
**What:** Pure black `#000` / white `#FFF` / gray scale only. No accent colors anywhere. Hairline `1px` borders
(`#EAEAEA`), near-white cards (`#FAFAFA`), large radius (16–24px). Grotesque type (Geist), regular/medium weight
(~400–500, not bold), tight letter-spacing (~-0.03em), huge H1 (72–80px).
**Sites:** Vercel (canonical), Mercury (mono, sharply typeset).
**When:** Developer audience, "spec sheet" positioning. The absence of color IS the confidence.
**Steal:** one dark `#0A0A0A` card as a contrast anchor in an otherwise white page. Mono type for terminal/API snippets.

## 3. The Dark Contrast Anchor (Vercel, Linear)
**What:** One single black/dark card sitting inside an otherwise light page — a terminal snippet, a "Passport"
card, a dark product screenshot. Creates a focal point without breaking the monochrome system.
**When:** You want one high-contrast moment without adding color.
**Steal:** a dark card with white mono text + a small white logomark. Keep everything else light.

## 4. Asymmetric Left/Center/Right Hero (Vercel)
**What:** Three-part asymmetric row — headline + CTAs left, giant logomark center, micro-copy right ("For coding
agents / To ship apps and agents / Automated by agents"). Vertically centered. Not a centered-column hero.
**When:** You have a strong logomark and a short supporting line. Feels more designed than a centered hero.
**Steal:** put the brand mark as the visual anchor, flank it with headline and a one-line positioning column.

## 5. The Announcement Strip + Hairline Rule
**What:** A thin centered strip above the hero ("Ship 26 is coming to SF — Get your ticket →") with a dashed/
dotted hairline rule beneath. Signals momentum/community without a modal.
**When:** Events, launches, community news. Low-friction attention.
**Steal:** a single centered line + a subtle dashed rule. No background color, no button — restraint.

## 6. Product-As-Design-System (Notion)
**What:** The site's visual language IS the product's (blocks, drag handles, pastel chips). Illustrations support
the message, don't decorate it. Scrolling the homepage teaches you the product metaphor.
**When:** The product has a distinctive visual identity worth borrowing.
**Steal:** reuse the product's own UI vocabulary (cursor, drag handle, block) in the marketing site's illustrations.

## 7. Uniform-Card Density (Raycast)
**What:** Dozens of features shown without crowding — uniform card components, generous consistent spacing,
single-color illustration system. Looks like a dashboard because the product is one.
**When:** Feature-rich product where "it's a lot but it's coherent" is the message.
**Steal:** one card component, one illustration color, one spacing rhythm. Boredom is the point.

## 8. Full-Bleed Cinematic Hero (Arc)
**What:** Enormous full-bleed video hero, cinematic pacing, emotional copy. Treated like a movie trailer.
**When:** Fighting incumbent mindshare — Chrome vs Arc. You need a movement, not an update.
**Steal:** full-bleed motion + emotional headline. Only works when the product/positioning can carry the drama.

## 9. The Custom Illustration System (Stripe)
**What:** Consistent, custom illustration language across every product page. Not stock. The component system
is what keeps the enterprise sprawl coherent.
**When:** Large multi-product surface that needs one recognizable visual identity.
**Steal:** define ONE illustration style (palette + line weight + texture) and reuse it everywhere.

## 10. The Paper / Academic Aesthetic (Anthropic)
**What:** Cream backgrounds, careful serif/sans typography, restrained illustrations. Quiet and academic in a
category full of flashy gradients.
**When:** Positioning on rigor/safety/trust where flash would read as unserious.
**Steal:** warm off-white background, generous margins, minimal color, no gradients.

---

## Verified design tokens (extracted live from each site, Sep 2026)

Real computed CSS values pulled from the live DOM via `rodney js` (see `extract-tokens.js`).
Use these as concrete starting points — not just vibes.

| Site | Theme | Body bg | Body text | Fonts | Accent | Radii | H1 size |
|---|---|---|---|---|---|---|---|
| **Linear** | dark | `rgb(8,9,10)` | `rgb(247,248,248)` | Inter Variable + **Berkeley Mono** | green `rgba(0,255,5,.1)` tint | 6–12px | 64px |
| **Vercel** | light | `rgb(250,250,250)` | `rgb(23,23,23)` | **Geist Sans** + Geist Mono | blue `rgb(0,114,245)` | 6–12px | 64px |
| **Mercury** | dark | transparent→`rgb(23,23,33)` cards | `rgb(0,0,0)` | custom **arcadia** + arcadiaDisplay | pink `rgb(252,146,180)` | 8–40px | 45px |
| **Raycast** | dark | `rgb(7,8,10)` | `rgb(255,255,255)` | Inter + GeistMono/JetBrains Mono | (white-dominant) | 16px | 64px |
| **Anthropic** | light | `rgb(250,249,245)` warm cream | `rgb(20,20,19)` | custom **Anthropic Serif/Sans/Mono** | warm gray `rgb(135,134,127)` | — | — |
| **Stripe** | light | `rgb(255,255,255)` | `rgb(0,0,0)` | **sohne-var** (custom) | purple `rgb(83,58,253)` | 4–16px | 48px |
| **Notion** | light | `rgb(255,255,255)` | `rgba(0,0,0,.95)` | NotionInter + **Lyon Text** serif | blue `rgb(0,117,222)` | 4–16px | 96px |

**Patterns visible in the data:**
- **Custom fonts are the norm** — Mercury (arcadia), Anthropic (Anthropic Serif/Sans), Stripe (sohne), Vercel (Geist), Notion (Lyon Text). Only Linear/Raycast lean on Inter. A bespoke typeface is a strong SOTA signal.
- **Dark theme is common** among the dev-tool tier (Linear, Mercury, Raycast) — but Stripe/Anthropic/Notion/Vercel are light. Not a rule, a choice.
- **Accent colors are minimal & singular** — one accent (green/blue/purple/pink), never a rainbow. Restraint everywhere.
- **Radii cluster at 6–16px** — soft but not pill-heavy. Linear/Vercel 6–12, Raycast 16, Mercury up to 40.

## 2026 cross-cutting trend
Award sites (Awwwards SOTY/SOTD, CSS Design Awards) moved from *looking* impressive to *feeling*
interactive — "beauty at 60fps is the whole discipline" (WebGL + GSAP motion-led). Preview in `screenshots/`
is static; the live sites are scroll-driven motion. For the marketing/benchmark tier above, the pattern is
the opposite: *restraint* — real product, real type, no decoration.
