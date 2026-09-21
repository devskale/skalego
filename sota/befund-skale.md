# Befundung — skale.dev vs. SOTA-Webdesign (2026)

Stand: Sep 2026 · Basis: `sota/visual-patterns.md` (verifizierte Tokens) + `sota/storylines.md`
Gegenstand: `src/styles/global.css`, `src/components/sections/*`, `src/scripts/site.js`

---

## 1. Fazit vorweg

**skale.dev ist bereits nah am SOTA-Benchmark** (dunkel, ein Accent, Inter + JetBrains Mono,
Radii 8/12 — das deckt sich mit Linear/Raycast). Es gibt **keine Design-Revolution nötig**, sondern
gezielte Upgrades. Die größte Lücke ist konzeptionell: Der Hero zeigt ein **abstraktes Particle-Canvas**,
während die 2026-SOTA (Linear, Vercel, Mercury) das **echte Produkt live** zeigt — mit Agent-Actions
und realen Status-Events. Genau das fehlt skale.dev, und es passt perfekt zu einer AI-Engineering-Agentur.

---

## 2. Ist-Zustand (verifiziert aus Code)

| Dimension | skale.dev | SOTA-Vergleich |
|---|---|---|
| Theme | dark `--bg: #08080a` | ✅ Linear `rgb(8,9,10)`, Raycast `rgb(7,8,10)` |
| Accent | 1× rot `--red: #e53935` | ✅ "ein Accent, nie ein Regenbogen" |
| Fonts | Inter + Inter Tight + JetBrains Mono | ⚠️ Inter ok (Linear/Raycast), aber **kein Custom-Display-Font** |
| Radii | 8 / 12 / pill | ✅ cluster 6–16px |
| Hero | Particle-Canvas (abstrakt) | ❌ **SOTA zeigt echtes Produkt live** |
| Storyline | "Wir machen KI produktiv" | ⚠️ noch **nicht agent-native** ("teams and agents") |
| Motion | CSS-Reveal + Canvas, reduced-motion respektiert | ✅ |
| Performance | statisch, ein Client-Script | ✅ |

**Stärken (nicht anfassen):**
- Single-Accent-Disziplin, dunkle Fläche, Radii-System — das ist der harte Kern.
- `prefers-reduced-motion` wird sauber respektiert (WCAG).
- Ein einziges gebündeltes Client-Script, statischer Build — Performance ist SOTA.
- Bento, Stepper, Case-Cards mit Mono-Kickern — konsistente, typografisch saubere Sprache.

---

## 3. Lücken → Maßnahmen (priorisiert)

### 🔴 P1 — Hero zeigt kein "echtes Produkt" (größter Hebel)
**Befund:** `Hero.astro` = Badge + Headline + Sub + 2 Buttons über einem abstrakten Partikel-Canvas.
Linear/Vercel/Mercury beweisen 2026: der Hero IST das Produkt — Live-Activity-Feed mit echten
Status-Events und Agent-Actions ("Linear erstellt Issue via Slack… Triage Intelligence added labels…").

**Maßnahme:** Unter dem Sub einen **Live-Activity-Feed** ergänzen — eine kompakte Karte, die Agent-/System-
Events rotiert: *"Agent analysiert Dokumente… RAG-Index aktualisiert… Agent deployed…"*. Das ist das
Linear-Pattern, übersetzt auf AI Engineering. Reines HTML/CSS + kleines JS (rotierender Feed), kein neues
Framework. Passt perfekt zur Storyline "Wir machen KI produktiv" → konkret "unsere Agenten arbeiten live".

**Risiko:** gering. Kein Layout-Bruch (unter dem Sub, vor den Buttons oder daneben), reduced-motion → statisch.

### 🟠 P2 — Storyline nicht agent-native
**Befund:** Subtext ist gut ("lokal und on-premise, Daten bleiben wo sie sind") — das ist ein starkes
Anti-Category-Merkmal (Mercury-Pattern). Aber die Agent-Story fehlt, obwohl die Firma Agenten baut
(`/agent-coding/`, Skills-System).

**Maßnahme:** Agent-Native-Sprache an 1–2 Stellen einweben (z. B. Hero-Sub oder ein Feed-Event), ohne die
bestehende Positionierung zu verwässern. Nicht umschreiben, nur schärfen.

### 🟡 P3 — Kein Custom-Display-Font (optional, größerer Eingriff)
**Befund:** Inter Tight als Display ist solide, aber 5/7 SOTA-Sites haben eine eigene Typeface
(Mercury "arcadia", Stripe "sohne", Vercel "Geist", Anthropic "Anthropic Serif", Notion "Lyon Text").
Ein Custom-Font ist ein starkes SOTA-Signal.

**Maßnahme:** Optional — einen Display-Font ergänzen (z. B. eine selbst-gehostete Groteske für H1/H2).
**Achtung DSGVO:** muss self-hosted sein (wie die bestehenden Fonts). Größerer Eingriff, separat entscheiden.

### 🟢 P4 — Mikro-Polish (niedrig, sofort machbar)
- **Announcement-Strip** (Vercel-Pattern): dünner zentrierter Strip über dem Hero für News/Events —
  z. B. "Neue Agent-Skills verfügbar →". Low-friction, kein Modal.
- **Dark Contrast Anchor** (Vercel): eine einzelne dunkle Karte als Kontrastpunkt — der Feed in P1 kann
  genau das sein (eine `#0a0a0a`-Karte im dunklen Hero).

---

## 4. Bewertung je SOTA-Pattern (aus visual-patterns.md)

| Pattern | Status skale.dev | Aktion |
|---|---|---|
| 1. Real-Product Hero (Linear) | ❌ abstrakt | **P1 — Activity-Feed einbauen** |
| 2. Swiss/Minimal monochrom | ✅ | nichts |
| 3. Dark Contrast Anchor (Vercel) | ⚠️ fehlt als Einzelkarte | P1-Feed als Anchor nutzen |
| 4. Asymmetric Hero (Vercel) | ❌ zentriert | optional, nicht nötig |
| 5. Announcement Strip | ❌ fehlt | P4 (optional) |
| 6. Product-as-Design-System (Notion) | ⚠️ teils (Mono-Kicker) | ok |
| 7. Uniform-Card-Density (Raycast) | ✅ Bento/Stepper | nichts |
| 8. Full-bleed Cinematic (Arc) | ❌ | nicht passend für B2B-Agentur |
| 9. Custom Illustration (Stripe) | ❌ | nicht nötig (dunkel+typografisch) |
| 10. Paper/Academic (Anthropic) | ❌ | nicht passend (dunkles Theme) |

---

## 5. Empfohlene Reihenfolge

1. **P1** — Live-Activity-Feed im Hero (größter SOTA-Sprung, geringes Risiko) ✅ empfohlen
2. **P2** — Agent-native Storyline schärfen (1–2 Zeilen)
3. **P4** — Announcement-Strip (optional, schnell)
4. **P3** — Custom-Font (separat, größerer Eingriff — erst entscheiden)

Jeder Schritt baut sauber auf dem Bestehenden auf und verletzt keine der harten Grenzen
(Single-Accent, reduced-motion, statischer Build, self-hosted Fonts, de-AT-Inhalt).
