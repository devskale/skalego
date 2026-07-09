---
title: "Die Modell-Landschaft im Juli 2026: Intelligenz gegen Preis"
description: "Proprietäre Modelle dominieren die Spitze, aber die Open-Source-Front holt auf. Ein Blick auf Intelligenz, Preis und das wahre Preis-Leistungs-Verhältnis."
date: 2026-06-28
author: johann
tags: ['Modelle', 'Benchmark', 'Open Source', 'Kosten']
draft: false
---

Modelle sind austauschbar. Was zählt, ist das System darüber — aber die Modellwahl entscheidet dennoch über Intelligenz, Latenz und Kosten. Ein aktueller Blick auf die Landschaft.

## Die Spitze bleibt proprietär

Die intelligentesten Modelle kommen weiterhin von Anthropic, OpenAI und Google. Sie sind aber nicht selbst hostbar und nur über die Cloud-API nutzbar. Wer maximale Qualität braucht, kommt an ihnen nicht vorbei.

## Die Open-Source-Front

Gleichzeitig hat sich eine starke Open-Weight-Front gebildet: **DeepSeek, GLM, Qwen, Kimi**. Diese Modelle sind deutlich günstiger — teilweise um Faktoren — und lassen sich auf eigener Hardware betreiben. Für viele Use Cases reicht ihre Intelligenz völlig aus.

## Preis-Leistungs-Verhältnis

Der Output-Preis pro Million Tokens ist der teuerste Bestandteil. Aber das **Blended**-Maß (gemittelt aus Cache-, Input- und Output-Preisen) zeigt das wahre Bild: Ein gutes Open-Source-Modell kostet einen Bruchteil eines Flaggschiffs, bei allerdings geringerer Intelligenz.

## Was das für Ihr Projekt heißt

Die Modellwahl ist eine engineering-Entscheidung, kein Glaubensbekenntnis:

- **Proprietär**, wenn Sie maximale Intelligenz brauchen und Cloud in Ordnung ist.
- **Open-Source self-hosted**, wenn Daten im Haus bleiben sollen oder die Abfragemenge hoch ist.
- **Hybrid**, wenn beides zusammenpasst: ein kleines lokales Modell für die Masse, ein großes Cloud-Modell für die harten Fälle.

Wir hosten Open-Weight-Modelle wie Llama, Qwen, DeepSeek und GLM auf eigener Hardware — ohne Cloud-Abhängigkeit und ohne pro Token zu zahlen. Die Hardwarekosten stehen fest, die Abrechnung wird berechenbar.
