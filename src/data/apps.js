// Single source of truth for the skale.dev apps & tools.
// Used by /apps/ (cards + JSON-LD) and the home-page apps section,
// so links, copy and schema can never drift apart.
// Order = display order: the two most mature tools first.
//
// `page` (optional) = eigene Landing-Page unter /apps/<slug>/ —
// SEO-Content für Apps, deren Tool-URL selbst nur eine dünne JS-App ist.

export const apps = [
  {
    name: 'Firmenindex Österreich',
    href: '/firmenindex/',
    shot: '/logos/screenshot-firmenindex.png',
    alt: 'Screenshot: Firmenindex Österreich',
    short: 'Über 330.000 Unternehmen, Suche in Echtzeit',
    desc: 'Firmensuche für Österreich mit über 330.000 Unternehmen. Suche nach Firma, Firmenbuchnummer (FN), Person oder Branche.',
  },
  {
    name: 'throway',
    href: '/throway/',
    shot: '/logos/screenshot-throway.png',
    alt: 'Screenshot: throway',
    short: 'Datei hochladen, kurze URL, läuft automatisch ab',
    desc: 'Wegwerf-Dateispeicher für Agenten und Programme. Datei hochladen, kurze URL bekommen, alles läuft nach 4 Stunden automatisch ab.',
  },
  {
    name: 'PDF Annotator',
    href: '/pdf-editor/',
    shot: '/logos/screenshot-pdfeditor.png',
    alt: 'Screenshot: PDF Annotator',
    short: 'Annotieren und bearbeiten, komplett im Browser',
    desc: 'PDF-Dokumente direkt im Browser annotieren und bearbeiten. Komplett client-seitig, ohne Server-Upload.',
    page: {
      slug: 'pdf-annotator',
      title: 'PDF annotieren im Browser — ohne Upload, kostenlos | skale.dev',
      h1: 'PDF Annotator — PDFs direkt im Browser bearbeiten',
      intro: 'Text, Markierungen und Zeichnungen direkt ins PDF setzen — komplett lokal im Browser. Kein Upload: Ihre Dateien verlassen Ihr Gerät nicht.',
      features: [
        { name: 'Text & Notizen', desc: 'Textfelder und Notizen direkt im Dokument platzieren.' },
        { name: 'Markieren', desc: 'Passagen hervorheben und Durchstreichungen setzen.' },
        { name: 'Zeichnen', desc: 'Freihand-Annotationen, Formen und Signaturen.' },
        { name: '100 % lokal', desc: 'Die Verarbeitung läuft im Browser — es gibt keinen Server-Upload.' },
      ],
      faqs: [
        { q: 'Werden meine PDF-Dateien hochgeladen?', a: 'Nein. Der PDF Annotator verarbeitet alles direkt im Browser (client-seitig). Die Datei wird nicht an einen Server übertragen und nach dem Schließen des Tabs nicht gespeichert.' },
        { q: 'Ist der PDF Annotator kostenlos?', a: 'Ja — kostenlos, ohne Anmeldung und werbefrei. Ein Projekt von skale.dev.' },
        { q: 'Warum ist "ohne Upload" wichtig?', a: 'Vertrauliche Dokumente (Verträge, Befunde, Rechnungen) verlassen Ihr Gerät nicht. Das macht das Tool DSGVO-freundlich für sensible Unterlagen.' },
      ],
    },
  },
  {
    name: 'ChopDok',
    href: '/chopdok',
    shot: '/logos/screenshot-chopdok.png',
    alt: 'Screenshot: ChopDok',
    short: 'PDF-Seiten aufteilen und neu anordnen',
    desc: 'PDF-Seiten aufteilen, extrahieren und neu anordnen. Kostenlos, werbefrei, ohne Datenerfassung.',
    page: {
      slug: 'chopdok',
      title: 'PDF-Seiten trennen, zusammenfügen & sortieren — ohne Upload | ChopDok',
      h1: 'ChopDok — PDF-Seiten aufteilen und neu anordnen',
      intro: 'PDFs und Bilder zusammenfügen, Seiten trennen, neu sortieren und als neues PDF exportieren — alles lokal im Browser. Kostenlos, werbefrei, ohne Datenerfassung.',
      features: [
        { name: 'Seiten trennen', desc: 'Ein PDF in einzelne Seiten oder Bereiche aufsplitten.' },
        { name: 'Dokumente mergen', desc: 'Mehrere PDFs und Bilder zu einem Dokument zusammenfügen.' },
        { name: 'Sortieren & löschen', desc: 'Seiten per Drag-and-Drop neu anordnen oder entfernen.' },
        { name: 'Export als PDF', desc: 'Ergebnis direkt als neue PDF-Datei speichern.' },
      ],
      faqs: [
        { q: 'Werden meine Dokumente auf einem Server gespeichert?', a: 'Nein. ChopDok läuft vollständig im Browser. Es gibt keinen Upload und keine Datenerfassung — die Dokumente bleiben auf Ihrem Gerät.' },
        { q: 'Kann ich Bilder in ein PDF umwandeln?', a: 'Ja. JPG- und PNG-Dateien lassen sich zusammen mit PDF-Seiten mischen und als ein PDF exportieren.' },
        { q: 'Ist ChopDok kostenlos?', a: 'Ja — kostenlos, ohne Anmeldung, werbefrei. Ein Projekt von skale.dev.' },
      ],
    },
  },
];
