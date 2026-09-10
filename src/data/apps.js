// Single source of truth for the skale.dev apps & tools.
// Used by /apps/ (cards + JSON-LD) and the home-page apps section,
// so links, copy and schema can never drift apart.
// Order = display order: the two most mature tools first.

export const apps = [
  {
    name: 'Firmenindex Österreich',
    href: '/firmenindex/',
    shot: '/logos/screenshot-firmenindex.png',
    alt: 'Screenshot: Firmenindex Österreich',
    short: 'Über 40.000 Unternehmen, Suche in Echtzeit',
    desc: 'Firmensuche für Österreich mit über 40.000 Unternehmen. Suche nach Firma, Firmenbuchnummer (FN), Person oder Branche.',
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
    href: '/pdf-editor',
    shot: '/logos/screenshot-pdfeditor.png',
    alt: 'Screenshot: PDF Annotator',
    short: 'Annotieren und bearbeiten, komplett im Browser',
    desc: 'PDF-Dokumente direkt im Browser annotieren und bearbeiten. Komplett client-seitig, ohne Server-Upload.',
  },
  {
    name: 'ChopDok',
    href: '/chopdok',
    shot: '/logos/screenshot-chopdok.png',
    alt: 'Screenshot: ChopDok',
    short: 'PDF-Seiten aufteilen und neu anordnen',
    desc: 'PDF-Seiten aufteilen, extrahieren und neu anordnen. Kostenlos, werbefrei, ohne Datenerfassung.',
  },
];
