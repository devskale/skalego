---
title: "On-premise KI: Wenn sich das Self-Hosting von LLMs wirklich rechnet"
description: "Cloud-APIs sind einfach, aber pro Token wird es teuer. Wann sich on-premise Hosting von Open-Weight-Modellen wie Llama, Qwen oder DeepSeek rechnet — und wann nicht."
date: 2026-07-04
author: johann
tags: ['On-Premise', 'LLM', 'Kosten', 'DSGVO']
draft: false
---

Cloud-LLMs sind verlockend: ein API-Key, ein Request, eine Antwort. Doch wer intensiv inferiert, zahlt pro Token — und die Abrechnung wird mit jedem Use Case unberechenbarer. Spätestens bei sensiblen Daten, regulatorischen Anforderungen oder hohen Abfragemengen stellt sich die Frage: **Lohnt sich eine eigene Infrastruktur?**

## Die Grundrechnung

Beim Cloud-Modell zahlen Sie pro Token. Beim Self-Hosting zahlen Sie einmalig für Hardware und danach im Wesentlichen Strom. Der Break-Even hängt von drei Größen ab:

- **Abfragemenge** — wie viele Tokens verarbeiten Sie pro Monat?
- **Modellgröße** — ein 7B-Modell läuft auf einer Karte, ein 70B-Modell will mehrere.
- **Auslastung** — eine GPU, die 80 % der Zeit idle steht, ist teures Spielzeug.

## Wann on-premise klar gewinnt

On-premise wird attraktiv, wenn **einer** dieser Punkte zutrifft:

1. **Hohe, vorhersehbare Abfragemengen** — Wer täglich hunderttausende Dokumente verarbeitet, zahlt in der Cloud schnell fünfstellige Summen pro Monat.
2. **Datensouveränität** — Patientendaten, Kundendaten, Betriebsgeheimnisse. Was das Haus nicht verlassen darf, kann nicht über eine fremde API laufen.
3. **Berechenbarkeit** — Hardwarekosten stehen fest. Es gibt keine Überraschungen am Monatsende.

## Wann die Cloud die bessere Wahl ist

Für **maximale Intelligenz** oder seltene Abfragen bleibt die Cloud einfacher. Die stärksten proprietären Modelle sind nicht selbst hostbar, und wer nur gelegentlich fragt, finanziert keine eigene GPU mit.

## Die ehrliche Antwort

On-premise ist kein Dogma, sondern eine Kosten-Nutzen-Rechnung. Im Erstgespräch prüfen wir zuerst, ob Ihr Use Case KI-tauglich ist — und dann, ob er on-premise, in der Cloud oder hybrid am besten läuft. Manchmal ist die einfachere Lösung die schlauere.

> Was Ihre Leute und Prozesse lernen, fließt in Ihre eigenen Systeme zurück — nicht in das Modell eines Drittanbieters.
