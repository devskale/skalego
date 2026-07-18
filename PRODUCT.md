# Product

## Register

brand

## Platform

web

## Users

Technical decision-makers at AT/DE organizations — founders, CTOs, ops leads, engineering managers — who are actively considering adding AI to their business. They are technically literate (they read code, understand infra, can tell a real pipeline from a demo) and they have something to protect: sensitive data, regulated processes, hard-won institutional knowledge. They arrive skeptical of hype and short on time. Their job on the site is to decide quickly whether this outfit is technically credible and whether a first conversation is worth 30 minutes.

## Product Purpose

skale.dev is the marketing surface for an AI-engineering consultancy (DI Johann Waldherr, Neusiedl am See, Österreich). The site does two jobs, in order:

1. **Positioning** — establish that this is engineering, not AI theater. Concrete case studies, real model data, an honest process, and copy that qualifies *out* the wrong fits. The visitor should leave knowing exactly what skale.dev does and does not do.
2. **Erstgespräche** — convert the qualified visitor into a 30-minute first conversation. Every section funnels toward the contact CTA.

Success = the right technical people book the call, and the wrong people (chasing a generic chatbot, a cloud-only API wrapper, "AI as magic") self-select out before they waste anyone's time.

## Brand Personality

Straight-talking, engineering-credible, sovereignty-minded. Three words: **precise, honest, sovereign.**

- **Precise** — concrete over abstract. Named models, real numbers, specific tech stacks, two actual case studies. No "unlock your potential" filler.
- **Honest** — says openly when KI is *not* the right tool, when a simpler solution is smarter, when cloud beats on-premise. The honesty is the sales pitch.
- **Sovereign** — your data stays in-house, your learning stays in-house, your infrastructure stays yours. On-premise is a stance, not a tier.

Voice: confident but quiet. German content, English code. An engineer talking to an engineer, not a vendor talking to a lead.

## Anti-references

- **Generic chatbot marketing** — "transform your business with AI", hero shots of a glowing chat bubble, "AI-powered" as a prefix. The site must never read as a chatbot wrapper.
- **SaaS-hype landing pages** — the hero-metric template (big number + small label + gradient), identical icon-card grids, the cream/sand warm-neutral AI default, gradient text, glassmorphism decoration, tiny uppercase tracked eyebrows above every section.
- **Cloud-dependency framing** — anything that implies AI *requires* a cloud provider, per-token billing, or handing data to a third party. On-premise is a first-class option, not a footnote.
- **"AI as magic"** — vague promises, no architecture, no model names, no process. If a claim can't be backed by a concrete implementation, it doesn't go on the page.
- **Vendor voice** — salesy urgency, fake scarcity, "book now before spots fill". The Erstgespräch is framed as a mutual qualification call, not a close.

## Design Principles

1. **Practice what you preach.** The site is itself an engineering artifact — built with agentic coding, static and fast, zero-JS by default, one inlined script. The craft of the build is part of the credibility claim. Don't ship a heavy, JS-laden, slow page to sell lean engineering.

2. **Show, don't tell.** Credibility comes from specifics: real case studies with named tech stacks, a live model-landscape table with sourced numbers, a named four-step process. Every claim should be backed by something concrete the visitor can inspect. Replace adjectives with artifacts.

3. **Qualify out, on purpose.** The copy is allowed to repel. "Keine generischen Chatbots", "ob KI das Problem wirklich löst", "wenn KI nicht das richtige Werkzeug ist, sagen wir das offen" — these are features, not hedging. The site should make the wrong visitor leave, not lure them in.

4. **Sovereignty as a stance.** Data, learning, and infrastructure belong to the client. This is a positioning axis against cloud-dependent competitors, and it should be felt in the design (on-premise as first-class, not buried), not just stated in copy.

5. **Engineering credibility over polish.** This reads as a developer-tooling surface (dark, mono accents, real data tables, terminal-style install blocks) — not a polished agency portfolio. The lane is Linear / Vercel / Anthropic-adjacent: technical, restrained, confident. Resist the urge to "soften" it into a warmer, friendlier, more agency-like register.

## Accessibility & Inclusion

Best-effort, no formal WCAG level mandated. Concretely: honor `prefers-reduced-motion` (hero canvas + reveals + belt all gate on it), keep keyboard navigation and visible focus rings working, and hold body-text contrast at ≥4.5:1 against the dark background. No stated AT-Barrierefreiheits-Gesetz / WCAG 2.2 AA obligation today, but the existing patterns (skip-link, aria on nav/toggle, focus-visible) should be preserved and not regressed.
