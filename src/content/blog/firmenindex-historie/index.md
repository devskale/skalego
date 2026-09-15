---
title: "Firmenindex: 333.000 Firmen mit Zeitreise-Historie"
description: 333.000 Firmen, verifizierte Personen, Eigentümer-Graph und Zeitreise zu jedem Stichtag — unser Firmenindex für Österreich. Kostenlos, ohne Login, mit offener API.
date: 2026-09-15
author: johann
tags: [firmenindex, firmenbuch, daten, österreich]
draft: false
---

Österreichs Firmenbuch ist öffentlich — aber schwer durchsuchbar. Wer wissen
will, wer hinter einer Gesellschaft steht, wer 2019 Geschäftsführer war oder
welche Töchter zu einem Konzern gehören, springt zwischen evi.gv.at,
Insolvenz-Edikten und Branchenverzeichnissen hin und her. Genau das haben wir
mit dem **[Firmenindex](https://skale.dev/firmenindex/)** zusammengeführt.

## Was der Firmenindex kann

Der [Firmenindex](https://skale.dev/firmenindex/) verschmilzt fünf Quellen zu
einem Datensatz pro Firma: das Firmenbuch (evi.gv.at + HVD), GISA-
Gewerbeberechtigungen, WKO-Einträge und die ÖNACE-Branchenreferenz der
Statistik Austria. Das ergibt **333.000+ Firmen** — inklusive der nicht im
Firmenbuch eingetragenen Gewerbe (e.U.).

Drei Dinge heben ihn von firmenabc & Co. ab:

**1. Verifizierte Personen-Identität.** Geschäftsführer, Prokuristen und
Gesellschafter werden über das Geburtsdatum identifiziert — Namensvetter
fallen weg, Rollen über Firmen hinweg werden einer echten Person zugeordnet.

**2. Eigentümer-Verbund.** Beteiligungen sind als Graph aufgelöst: von der
Konzernmutter bis zur Enkelin, inklusive Körperschafts-Eigentümern wie
Gemeinden oder dem Bund.

**3. Zeitreise.** Der Kern-Differenzierer: jede Firma als Unternehmensphasen
erlebbar. Wer war wann Geschäftsführer? Wie hieß die Firma 2015? Ein Cursor
im Phasenband, und der Registerzustand steht zu jedem historischen
Stichtag — als Auszug im Stil des amtlichen Firmenbuchs.

## Kostenlos, ohne Login — und mit offener API

Keine Registrierung, keine Paywall. Und: alle Daten sind per JSON abrufbar —
**ohne Auth**, schema-generiert, per curl lesbar:

```bash
curl "https://skale.dev/firmenindex/api?e=search%2Frich&query=brantner"
curl "https://skale.dev/firmenindex/api?e=lookup%2Fmerged&fn=475207i"
```

Die vollständige [API-Referenz](https://skale.dev/firmenindex/agents.html)
wird aus dem laufenden Code generiert und kann nicht veralten. Damit ist der
Firmenindex auch für Agenten, Skripte und Recherchewerkzeuge nutzbar —
ein Datenbestand, der sonst hinter Login-Wällen liegt.

## Wer braucht das?

- **Journalist:innen & Recherche:** Eigentümerstrukturen nachvollziehen,
  Insolvenz-Edikte je Firma, Historie statt Nur-Heute-Sicht
- **Lieferanten & KMU:** Bonitäts-Recherche, Vertretungsbefugnisse
  (Prokura?), Ansprechpartner-Geschichte
- **Entscheider:innen am Land:** welche Gewerbe gibt es im Bezirk wirklich
  (GISA + WKO, nicht nur Firmenbuch)
- **Entwickler:innen:** Firmenbuchdaten ohne Scraping-Akrobatik — eine
  stabile, höfliche API

## Ausblick

Der Bestand wächst täglich (Registerticker: „Neu im Firmenbuch"), und wir
arbeiten an systematischen Branchenseiten — von der Abfallwirtschaft bis
zum Zahnarzt. Ideen, Fehlermeldungen, Datenwünsche: einfach melden.

→ **[Jetzt suchen: skale.dev/firmenindex](https://skale.dev/firmenindex/)**
· [Firmen A–Z](https://skale.dev/firmenindex/firmen/) ·
[Branchen (ÖNACE)](https://skale.dev/firmenindex/oenace.html)
