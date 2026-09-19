---
title: "On-Premise-LLM selbst hosten: Llama, Qwen & Co."
description: "Open-Source-LLMs wie Llama, Qwen und DeepSeek auf eigener Hardware betreiben: Hardware-Bedarf, GPU-Kosten, Datenschutz-Vorteile und ehrliche Grenzen."
date: 2026-09-19
author: johann
tags: [ki, on-premise, llm, datenschutz, self-hosting]
draft: false
---

Immer wieder kommt im Erstgespräch dieselbe Frage: „Können wir so ein
Sprachmodell auch bei uns im Haus betreiben?" Die kurze Antwort lautet: Ja —
aber nicht für jeden Anwendungsfall ist es die kluge Wahl. Die lange Antwort
steht hier.

## Was „on-premise" konkret bedeutet

Ein on-premise-LLM läuft auf Ihrer eigenen Hardware — im Serverraum, im
Rechenzentrum Ihres Vertrauens oder auf einer dedizierten Maschine in der
Cloud Ihrer Wahl, die nur Ihnen gehört. Der entscheidende Punkt: Prompts,
Dokumente und Antworten verlassen Ihr Unternehmen nicht. Kein API-Anbieter,
kein Drittland, kein pro Token bezahlter Meter.

Für alles, was mit sensiblen Daten zu tun hat — Kundenakten, Gesundheitsdaten,
interne Dokumente, alles, was unter DSGVO oder brancheneigene Regeln fällt —
ist das oft der einzige Weg, der ohne langwierige Ausnahmenfreigaben funktioniert.

## Was heute realistisch ist

Die Open-Weight-Modelle sind gut geworden. Wir betreiben regelmäßig:

- **Llama** (Meta) — breit aufgestellt, starke Multilingual-Fähigkeiten
- **Qwen** (Alibaba) — aktuell eine der stärksten offenen Familien, von klein
  bis groß
- **DeepSeek** — beeindruckende Reasoning-Qualität zu niedrigen
  Betriebskosten
- **GLM** (Z AI) — solide Allrounder mit gutem Preis-Leistungs-Profil
- dazu spezialisierte Vision-Modelle für Dokumente und Screenshots

Für klassische Unternehmensaufgaben — Dokumente zusammenfassen und
auswerten, Texte entwerfen, interne Fragen beantworten, Tickets vorqualifizieren,
Extraktion mit strukturierter Ausgabe — sind diese Modelle längst gut genug.
Ein 7–8-Milliarden-Parameter-Modell, quantisiert auf einer einzelnen
Grafikkarte, erledigt viele Alltagsaufgaben erstaunlich souverän. Größere
Modelle (30B und aufwärts) bringen spürbar mehr Weltwissen und besseres
Reasoning, brauchen aber entsprechend mehr Hardware.

## Die Hardware-Realitäten

Die ehrliche Rechnung dreht sich fast immer um VRAM — den Speicher der
Grafikkarte. Große Größenordnungen:

| Modellklasse | Typischer VRAM-Bedarf (quantisiert) | Beispiel-Hardware |
|---|---|---|
| Klein (3–8B) | ~6–12 GB | eine Consumer-/Profi-GPU |
| Mittel (14–32B) | ~16–48 GB | eine große GPU (z. B. 48 GB) |
| Groß (70B+) | ~2× 48 GB und mehr | Multi-GPU-Server |

Dazu: genug RAM, schnelle NVMe-Speicher für die Dokumentenpipeline, und je
nach Anwendungsfall ein Vektorindex für RAG (Retrieval-Augmented Generation),
damit das Modell Ihr Wissen statt des Internets zitiert.

Die einmalige Investition für einen soliden Einstiegs-Server liegt
typischerweise im niedrigen bis mittleren fünfstelligen Bereich — je nachdem,
welche Antwortqualität und Durchsatzrate Sie brauchen. Verglichen mit
API-Kosten bei hohen Abfragemengen amortisiert sich das oft schneller, als
man denkt. Bei fünf Anfragen pro Tag tut sie es nie — Ehrlichkeit gehört dazu.

## Die Rechnung, die jeder anstellen sollte

Drei Fragen entscheiden:

1. **Wie sensibel sind die Daten?** Wenn nichts raus darf, ist on-premise
   kein Optionsthema, sondern die Anforderung.
2. **Wie hoch ist das Abfragevolumen?** Hohe, stabile Mengen sprechen für
   eigene Hardware; niedrige oder stark schwankende für die Cloud.
3. **Wer betreibt das Ganze?** Ein LLM-Server ist ein System: Updates,
   Monitoring, Backup, Sicherheit. Ohne jemanden, der das trägt (intern oder
   als Dienstleistung), wird aus dem schönen Server ein Schrankkandidat.

## Die ehrlichen Grenzen

On-premise heißt nicht, dass Sie das beste Modell der Welt bekommen. Die
absoluten Spitzenmodelle sind proprietär und laufen nur in den großen Rechenzentren
ihrer Betreiber. Ein gutes lokales Modell beantwortet Ihre internen Fragen
zuverlässig — aber bei sehr komplexen Reasoning-Aufgaben oder extrem
langem Kontext liegen die Cloud-Spitzenmodelle vorn.

Auch kein Selbstläufer: Betrieb bedeutet Update-Zyklen, Sicherheitspatches,
Kapazitätsplanung. Wer das unterschätzt, zahlt später doppelt.

## Unser Ansatz: hybrid, ehrlich, produktionsreif

Wir betreiben Open-Weight-Modelle auf Kunden-Hardware, wo es passt — und sagen
es offen, wenn die Cloud für einen Anwendungsfall die schlauere Wahl ist. Oft
landen wir auf einer Mischform: on-premise für das Daten-nahe Tagesgeschäft,
Cloud-API (mit datenschutzgerechter Auftragsverarbeitung) für gelegentliche
Spitzenlasten.

Wenn Sie wissen wollen, was für Ihr Unternehmen drin ist: Das
[Erstgespräch](/#contact) kostet 30 Minuten und eine ehrliche Einschätzung
bekommen Sie danach sowieso — auch wenn die Antwort lautet, dass Sie (noch)
keine KI brauchen.
