# The Perfect AI Engineering Website — Research Synthesis

**Datum:** 13. Juni 2026
**Quellen:** 25+ AI-Unternehmen, 5 DACH-Agenturen, Linear Design System, Awwwards

---

## Die Goldstandards (Wer macht es am besten?)

### Tier 1 — Das absolute Spitzenfeld

| Seite | Warum sie funktioniert | Key Pattern |
|-------|----------------------|-------------|
| **[cursor.com](https://cursor.com)** | Produkt-Demo im Hero, keine Abstraktion | "Show, don't tell" |
| **[linear.app](https://linear.app)** | Typografie als Design-System, radikale Reduktion | Bold type, max whitespace |
| **[anthropic.com](https://www.anthropic.com)** | Akademisch + modern, Trust-first | Minimal, seriös |
| **[cartesia.ai](https://cartesia.ai)** | Dynamische Gradients, lebendig | Motion + bold typography |
| **[composio.dev](https://composio.dev)** | Dark + motion-driven, startup energy | Fluid transitions |

### Tier 2 — Starke DACH-Agenturen (aus german-ki-agencies.md)

| Agentur | Stärke |
|---------|--------|
| **Ziya** (ziya.de) | "Made in Germany" USP, Gov trust logos |
| **neuland.ai** | Metriken ("95% weniger Aufwand"), Case Studies mit Zahlen |
| **appliedAI** (appliedai.de) | 25+ Partner logos (BMW, Siemens, SAP), DAX-Kunden |
| **AI Pirates** (ai-pirates.com) | "50+ AI-Systeme", Metrics-first, Team-Fotos |
| **Ki-Leute** (ki-leute.de) | Prozess-Sektion (5 Schritte), KMU-fokussiert |

---

## Das perfekte AI Engineering Landing Page — Anatomie

### 1. HERO (Die ersten 500ms entscheiden)

**Was die Besten tun:**

```
┌─────────────────────────────────────────┐
│                                         │
│     [Nav: Logo]  Services  Über uns  CTA │
│                                         │
│          AI ENGINEERING                  │  ← Badge/Pill (optional)
│                                         │
│    KI für Unternehmen                   │  ← 3–4rem, weight 800
│    Oder: "Von der Idee zur Produktion"   │     letter-spacing: -0.02em
│                                         │
│  Maßgeschneiderte KI-Lösungen,         │  ← 1rem, dim, max-width 460px
│  die im Unternehmen funktionieren.       │     line-height: 1.6
│                                         │
│   [Projektanfrage →]  [Services ↓]      │  ← 1 Primary + 1 Secondary
│                                         │
│  ┌──────────┐  ┌──────────┐             │  ← Optional: Produkt-Screenshot
│  │ Screenshot │  │ oder Demo │             │     (Cursor-style)
│  │ / Demo    │  │ Interface │             │
│  └──────────┘  └──────────┘             │
└─────────────────────────────────────────┘
```

**Regeln:**
- Headline **unter 8 Wörter**, benefit-driven
- Keine abstrakten Illustrationen → **echtes Produkt/UI-Bild** oder gar nichts
- Max **1 Eyebrow** (Badge) — nicht mehrere
- **Ein Primary CTA** prominent, ein Secondary optional
- Background: dark (`#0a0a0c`), Particles/Gradient subtil (opacity < 0.3)

**Beste Headlines (real):**
- Cursor: *"The agent-native way to build ambitious software"*
- AI Pirates: *"KI Agentur. Made in Germany."*
- Linear: *"The product development system for teams and agents"*
- Für skale.dev: *"AI Engineering: KI in der Praxis"* ✓ (haben wir)

---

### 2. TRUST BAR (Sofort Glaubwürdigkeit)

**Was die Besten tun:**

| Element | Quelle | Implementierung |
|---------|--------|----------------|
| Logo-Marquee | Alle | ✅ Bereits vorhanden |
| **Metrik neben Logos** | neuland.ai, AI Pirates | ⬜ Noch fehlend |
| **Stats-Zeile** | AI Pirates: "50+ Systeme, 6 Branchen" | ⬜ Noch fehlend |

**Empfohlenes Upgrade für skale.dev:**
```
[sylents] [Stadt Wien] [MedUni Wien] [gwen] [Vectacore]
              14 Kunden · 10 Projekte · 5 Jahre Erfahrung
```
Oder als eigene Section unter dem Marquee:
```
┌─────────────────────────────────────────────┐
│   14+   Kunden    ·    10+   Projekte    ·    5    Jahre   │
└─────────────────────────────────────────────┘
```

---

### 3. WAS WIR TUN / VALUE SECTION (Das Herzstück)

**Linear-Muster:** Card-Grid, aber nicht "bento" im überladenen Sinn.

**Was skale.dev jetzt hat (gut):**
- 5 Value-Items in 2×3 Grid
- Roter left-border als Akzent
- Technische Beschreibung + Kundennutzen pro Item
- Keine Icons (sauber)

**Verbesserungspotenzial (von den Besten gestohlen):**

| Verbesserung | Von wem | Was es bringt |
|-------------|---------|---------------|
| **Prozess-Schritte** (01→02→03→04) | Ki-Leute | Zeigt Methodik, baut Vertrauen |
| **Nummerierung** (SVC_01, SVC_02...) | AI Pirates | Struktur, Professionalität |
| **Subtile Hover-State** (border glow) | Linear | Interaktivität ohne Ablenkung |

**Optimale Struktur für skale.dev:**

```
AI Engineering: KI in der Praxis
KI-Methoden produktionsreif integriert.

┌─────────────────────┐  ┌─────────────────────┐
│ 01                 │  │ 02                 │
│ Systemarchitektur   │  │ Integration        │
│ KI-Pipelines mit   │  │ LLMs und ML an    │
│ Modell-Serving...  │  │ bestehende Systeme │
└─────────────────────┘  └─────────────────────┘
┌─────────────────────┐  ┌─────────────────────┐
│ 03                 │  │ 04                 │
│ Workflow-Auto.     │  │ Embeddings & RAG   │
│ Agenten-Systeme... │  │ Vektorisierung...  │
└─────────────────────┘  └─────────────────────┘
┌─────────────────────┐
│ 05                 │
│ Sicherheit         │
│ On-Premise, DSGVO..│
└─────────────────────┘
```

---

### 4. ANWENDUNGSBEISPIELE (Social Proof mit Substanz)

**Was die Besten tun:**

| Muster | Beispiel | Wirkung |
|--------|----------|--------|
| **Label + Titel + Metrik** | neuland.ai: "95% reduzierter Aufwand" | Konkreter Nutzen |
| **Tech-Tags** | skale.dev hat das schon ✅ | Glaubwürdigkeit |
| **Screenshot des Produkts** | Cursor, Linear | "Das ist echt" |
| **Vorher/Nachher** | AI Pirates: "10× Mehr Output" | Messbarer Impact |

**Was skale.dev jetzt hat (gut):**
- 2 Case Cards (Rechnungserkennung + Schwierige Dokumente)
- Tech-Tags (Qwen 3.6 35B, Vision-Modell, etc.)
- Red Label-Badges

**Noch fehlend (High-Impact):**
- Vorher/Nachher Metrik ("X% weniger manueller Aufwand")
- Optional: Screenshot eines Dashboards/Interfaces

---

### 5. PROZESS-SECTION (Wie wir arbeiten)

**Nur Ki-Leute unter den DACH-Agenturen hat das — und es ist ein starker Differentiator.**

```
So arbeiten wir

01  Analyse        Wir verstehen Ihre Prozesse,
                    Use Cases und Datenlandschaft.

02  Strategie       Roadmap, Modell-Auswahl,
                    Architektur-Entwurf.

03  Prototyp        MVP mit echten Daten,
                    schnelles Feedback.

04  Implementierung  Produktionseinsatz,
                    Integration, Monitoring.

05  Support         Schulung, Wartung,
                    kontinuierliche Optimierung.
```

**Warum das wichtig ist:**
- Zeigt Methodik (nur "was" ist nicht genug)
- Beruhigt Enterprise-Kunden ("die wissen was sie tun")
- Setzt skale.ab von "Freelancer der zufällig auch KI kann" ab

---

### 6. TESTIMONIALS (Menschen, nicht nur Text)

**Was die Besten tun:**

| Format | Wer | Beispiel |
|--------|-----|----------|
| **Foto + Name + Firma + Zitat** | Ziya, appliedAI, neuland.ai | "skale.dev hat als Komplettanbieter..." |
| **Foto + Rolle + Zitat** | AI Pirates | CEO/CTO Level |
| **Video-Testimonial** | Selten, aber High-Impact | — |

**Für skale.dev empfohlen:**
- Hilmar Unterrainer (sylents e-jets) — bereits vorhanden, aber entfernt
- Zurückholen mit Foto (falls verfügbar)
- 2–3 Testimonials, nicht mehr

---

### 7. FAQ (Einwände vorwegnehmen)

**Alle 5 DACH-Agenturen haben FAQ.** Die häufigsten Fragen:

1. Wie läuft der erste Schritt ab?
2. Wie lange dauert ein typisches Projekt?
3. Was kostet ein KI-Projekt?
4. Bleiben meine Daten sicher? (On-Premise, DSGVO)
5. Brauche ich Vorkenntnisse?
6. Welche Modelle setzt ihr ein?
7. Was passiert nach dem Go-Live?

**Format:** Accordion/Collapsible — nicht alles aufklappen.

---

### 8. CTA (Der Abschluss)

**Beste Patterns:**

| Copy | Wer | Stil |
|------|-----|------|
| *"Erstgespräch vereinbaren"* | appliedAI | Aktiv, konkret |
| *"Kostenloser Check"* | AI Pirates | Low-friction |
| *"Let's Talk"* | Direkt | Casual, confident |
| *"dev@skale.dev"* | skale.dev aktuell | Funktioniert, aber passiv |

**Empfehlung für skale.dev:**
- Primär: **"Erstgespräch vereinbaren"** (Link zu dev@skale.dev oder Form)
- Sekundär: **Newsletter / KI-Readiness-Checklist** (Lead Magnet)

---

## Design-System (Linear DNA)

### Typografie

| Element | Linear-Standard | skale.dev aktuell | Gap |
|---------|----------------|-------------------|-----|
| H1 (Hero) | 3.5–4.8rem / 800 | 2.8–4.8rem / 800 | ✅ |
| H2 (Section) | 2–3rem / 700 | 2–3rem / 800 | ✅ |
| Body | 15px / 400 | 15px / 400 | ✅ |
| Small | 13px / 400 | 14px / 400 | Fast |
| Mono (Tags) | JetBrains Mono | JetBrains Mono | ✅ |
| Tracking (Headlines) | -0.02em | -0.01em | Noch enger |
| Line-height (Body) | 1.65–1.7 | 1.65–1.7 | ✅ |

### Farben

```
Background:     #0a0a0c  (near-black, NOT pure #000)
Surface/Card:   rgba(255,255,255,0.03)  (kaum sichtbar!)
Border:        rgba(255,255,255,0.06)     (subtil)
Text primary:  #fafafa                   (near-white)
Text secondary:#71717a                   (nicht zu grau)
Accent:        #e53935                   (ONE accent only)
```

### Spacing

| Element | Linear | skale.dev | Soll |
|---------|--------|-----------|------|
| Section padding | 140–160px | 140px | ✅ |
| Container max-width | 880px | 880px | ✅ |
| Grid gap | 16–24px | 16px | ✅ |
| Card padding | 24–32px | 28px | ✅ |
| Nav height | 64px | 64px | ✅ |

### Cards / Containers

```
background:  rgba(255,255,255,0.03)   ← kaum sichtbar
border:      1px solid rgba(255,255,255,0.06)
border-radius: 8px (nicht 12-20px!)
padding:     24-28px
hover:       border-color: accent ODER background: rgba(accent, 0.03)
```

### Motion (Subtil, nicht aufdringlich)

```css
transition: all 0.15s ease;        /* Schnell, nicht träge */
/* Scroll reveals: opacity 0→1, translateY 20px→0 */
/* KEINE bounce, KEINE elastic, KEIN parallax */
```

---

## Was skale.dev JETZT hat vs. Perfekt

| Feature | Status | Priority |
|---------|--------|----------|
| Hero mit Bold Typography | ✅ Done | — |
| Logo-Marquee (nahtlos) | ✅ Done | — |
| Value-Section (5 Items) | ✅ Done | — |
| Anwendungsbeispiele (2 Cases) | ✅ Done | — |
| Linear Spacing/Typography | ✅ Done | — |
| CTA (dev@skale.dev) | ✅ Done | — |
| **Metriken/Stats** | ⬜ Fehlt | 🟡 Hoch |
| **Prozess-Section (5 Schritte)** | ⬜ Fehlt | 🟡 Hoch |
| **Testimonials (mit Fotos)** | ⬜ Entfernt | 🟡 Mittel |
| **FAQ (5-7 Fragen)** | ⬜ Fehlt | 🟡 Mittel |
| **Produkt-Screenshots/Demos** | ⬜ Fehlt | 🟢 Nice-to-have |
| **Scroll-triggered Reveals** | ⬜ Fehlt | 🟢 Nice-to-have |
| **Lead Magnet (Checklist/Guide)** | ⬜ Fehlt | 🟢 Nice-to-have |
| **Deploy amd2 (nginx)** | ⬜ Geplant | 🔵 Infrastruktur |

---

## Nächste Schritte (Priorisiert)

1. **🔴 Metriken** — Stats-Zeile unter Marquee oder in eigener Section
2. **🔴 Prozess** — 5-Schritte Section zwischen Value und Cases
3. **🟡 Testimonials** — Zurückholen (Hilmar/sylents), ggf. Foto ergänzen
4. **🟡 FAQ** — 5-7 Fragen als Accordion vor CTA
5. **🟢 Screenshots** — Wenn Assets da sind: Dashboard/App Demo
6. **🔵 Deploy** — nginx auf amd2, deploy.sh Script

---

## Quellen

- [cursor.com](https://cursor.com) — Product-first hero, interactive demo
- [linear.app](https://linear.app) — Design system gold standard
- [anthropic.com](https://www.anthropic.com) — Trust-focused minimalism
- [cartesia.ai](https://cartesia.ai) — Bold typography + gradients
- [composio.dev](https://composio.dev) — Motion-driven dark UI
- [ziya.de](https://ziya.de) — DACH reference: gov trust, made-in
- [neuland.ai](https://neuland.ai) — DACH reference: metrics in case studies
- [appliedai.de](https://appliedai.de) — DACH reference: enterprise logos
- [ai-pirates.com](https://ai-pirates.com) — DACH reference: metrics + team
- [ki-leute.de](https://ki-leute.de) — DACH reference: process section
- [sitebuilderreport.com/inspiration/ai-company-websites](https://www.sitebuilderreport.com/inspiration/ai-company-websites) — 25+ AI sites analyzed
