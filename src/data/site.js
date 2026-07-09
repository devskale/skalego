// Single source of truth for list-driven content.
// Used by both the visible components AND the JSON-LD on the homepage,
// so schema and on-page copy can never drift apart.

export const organization = {
  name: 'skale.dev',
  alternateName: 'skale tech',
  description:
    'Individuelle KI-Systeme für Unternehmen – AI Engineering, on-premise und DSGVO-konform.',
  email: 'dev@skale.dev',
  url: 'https://skale.dev/',
  logo: 'https://skale.dev/logos/skale-logo.png',
  image: 'https://skale.dev/og-image.png',
  priceRange: '€€€',
  address: {
    streetAddress: 'Esterhazystrasse 1',
    addressLocality: 'Neusiedl am See',
    postalCode: '7100',
    addressCountry: 'AT',
  },
  geo: { latitude: 47.949, longitude: 16.838 },
  areaServed: [
    { '@type': 'Country', name: 'Österreich' },
    { '@type': 'Country', name: 'Deutschland' },
  ],
  founder: { '@type': 'Person', name: 'DI Johann Waldherr', jobTitle: 'AI Engineer' },
  sameAs: ['https://github.com/devskale'],
  knowsAbout: [
    'AI Engineering',
    'On-Premise KI',
    'Large Language Models',
    'Retrieval-Augmented Generation',
    'Dokumentenanalyse',
    'DSGVO-konforme KI',
  ],
};

export const faqs = [
  {
    q: 'Wie läuft das erste Gespräch ab?',
    a: 'Unverbindlich, etwa 30 Minuten. Wir klären, ob Ihr Use Case KI-tauglich ist und was es für eine Umsetzung braucht. Danach erhalten Sie eine ehrliche Einschätzung.',
  },
  {
    q: 'Bleiben meine Daten bei mir?',
    a: 'Ja. Wir realisieren on-premise oder lokal. Daten verlassen Ihr Unternehmen nur dann, wenn Sie es ausdrücklich wollen.',
  },
  {
    q: 'Brauche ich eine Cloud-Infrastruktur?',
    a: 'Nein. Wir betreiben KI auch auf eigener Hardware vor Ort. Cloud ist eine Option, kein Muss.',
  },
  {
    q: 'Welche Modelle setzen Sie ein?',
    a: 'Vorwiegend Open-Source-Modelle wie Qwen, Llama und spezialisierte Vision-Modelle. Die Auswahl hängt vom Use Case und Ihren Anforderungen ab.',
  },
  {
    q: 'Was kostet ein KI-Projekt?',
    a: 'Das hängt vom Umfang ab. Nach dem Erstgespräch erhalten Sie eine klare Einschätzung von Aufwand und Kosten, bevor Sie sich entscheiden.',
  },
  {
    q: 'On-premise oder Cloud — was passt zu uns?',
    a: 'Bei sensiblen Daten, regulatorischen Anforderungen oder hohen Abfragemengen lohnt sich on-premise: Die KI läuft auf eigener Hardware, Daten verlassen das Unternehmen nicht. Für maximale Intelligenz oder seltene Abfragen ist die Cloud die einfachere Wahl. Wir beraten ehrlich, was für Ihren Fall besser ist.',
  },
  {
    q: 'Lohnt sich KI für mein Unternehmen überhaupt?',
    a: 'Nicht für jedes Problem. Im Erstgespräch prüfen wir, ob Ihr Use Case tatsächlich von KI profitiert — oder ob eine einfachere Lösung schlauer ist. Wenn KI nicht das richtige Werkzeug ist, sagen wir das offen.',
  },
  {
    q: 'Können Sie Open-Source-Modelle wie Llama oder Qwen selbst hosten?',
    a: 'Ja. Wir hosten Open-Weight-Modelle wie Llama, Qwen, DeepSeek und GLM auf eigener Hardware — ohne Cloud-Abhängigkeit und ohne pro Token zu zahlen. Die Hardwarekosten stehen fest, die Abrechnung wird berechenbar.',
  },
];

export const models = [
  { name: 'Claude Fable 5', creator: 'Anthropic', idx: '64.9', price: '50.00', blended: '7.70', lic: 'Proprietär', open: false },
  { name: 'Claude Opus 4.8', creator: 'Anthropic', idx: '61.4', price: '25.00', blended: '3.85', lic: 'Proprietär', open: false },
  { name: 'GPT-5.5 xhigh', creator: 'OpenAI', idx: '60.2', price: '30.00', blended: '4.35', lic: 'Proprietär', open: false },
  { name: 'Gemini 3.1 Pro', creator: 'Google', idx: '57.2', price: '12.00', blended: '1.74', lic: 'Proprietär', open: false },
  { name: 'Kimi K2.5 Reasoning', creator: 'Kimi', idx: '46.8', price: '3.00', blended: '0.56', lic: 'Open', open: true },
  { name: 'DeepSeek V4 Flash', creator: 'DeepSeek', idx: '46.5', price: '0.28', blended: '0.06', lic: 'Open', open: true },
  { name: 'GLM-4.7 Reasoning', creator: 'Z AI', idx: '42.1', price: '2.20', blended: '0.71', lic: 'Open', open: true },
  { name: 'DeepSeek V3.2 Reasoning', creator: 'DeepSeek', idx: '41.7', price: '0.45', blended: '0.20', lic: 'Open', open: true },
  { name: 'GLM-4.7 Flash', creator: 'Z AI', idx: '30.1', price: '0.40', blended: '0.10', lic: 'Open', open: true },
];
