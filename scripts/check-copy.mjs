// check-copy.mjs — mechanical guardrail for visible German copy.
//
// The site is German (de-AT). Display text must use "KI", not "AI", for the
// engineering/human terms. This catches the AI↔KI drift that a reviewer has to
// catch by eye otherwise.
//
// Deliberately ALLOWED (not copy, not flagged):
//   - URLs / slugs           (/ai-engineering/, href="/ai-engineering/")
//   - Code comments          (// ... , <!-- ... -->)
//   - Proper nouns           (Z AI, OpenAI, artificialanalysis.ai)
//   - file paths             (ai-engineering.astro)
//
// Usage: node scripts/check-copy.mjs [--fix]
//   --fix   auto-replace the flagged terms in place. Default is report-only.

import { readFileSync, writeFileSync } from 'node:fs';
import { globSync } from 'node:fs';

// Terms that must not appear as visible copy. Each maps to its replacement.
const FORBIDDEN = [
  ['AI Engineering', 'KI Engineering'],
  ['AI-Coding', 'KI-Coding'],
  ['AI-Agent', 'KI-Agent'],
  ['AI Engineer', 'KI Engineer'],
  ['AI-Engineering', 'KI-Engineering'],
];

// File globs that can carry visible copy.
const GLOBS = [
  'src/**/*.astro',
  'src/**/*.md',
  'src/**/*.mdx',
  'src/data/*.js',
  'public/*.txt',
  'public/*.webmanifest',
  'src/assets/seo/*.svg',
];

// Mask the parts of a line that are NOT visible copy, so the remaining text is
// what we actually check. We mask (not skip) so a line can still carry visible
// text next to a URL, e.g. `<a href="/ai-engineering/">AI Engineering</a>`.
function maskNonCopy(line) {
  let out = line;
  // Code comments (JS/HTML) — mask so `// ai-engineering` isn't flagged.
  out = out.replace(/(\/\/.*|\/\*[\s\S]*?\*\/|<!--[\s\S]*?-->)/g, (m) => ' '.repeat(m.length));
  // URL paths / slugs: /ai-engineering/ and href="/ai-engineering/"
  out = out.replace(/\/ai-engineering\//g, ' '.repeat('/ai-engineering/'.length));
  // href/src attribute values that point at the route.
  out = out.replace(/(href|src)=["'][^"']*\/ai-engineering\/[^"']*["']/g, (m) => ' '.repeat(m.length));
  // file paths ending in .astro / .js referencing the route.
  out = out.replace(/ai-engineering\.astro/g, ' '.repeat('ai-engineering.astro'.length));
  // Proper nouns that legitimately end in "AI".
  out = out.replace(/\bZ AI\b/g, ' '.repeat('Z AI'.length));
  out = out.replace(/\bOpenAI\b/g, ' '.repeat('OpenAI'.length));
  out = out.replace(/artificialanalysis\.ai/g, ' '.repeat('artificialanalysis.ai'.length));
  return out;
}

// A line is "copy" if, after masking non-copy contexts, it still contains a
// forbidden term as visible text.
function isCopyLine(line) {
  return maskNonCopy(line);
}

let violations = 0;
let fixed = 0;

for (const glob of GLOBS) {
  const files = globSync(glob, { nodir: true });
  for (const file of files) {
    const original = readFileSync(file, 'utf8');
    const lines = original.split('\n');
    let changed = false;
    const report = [];
    const newLines = lines.map((line) => {
      const masked = maskNonCopy(line);
      let out = line;
      let lineChanged = false;
      for (const [from, to] of FORBIDDEN) {
        if (masked.includes(from)) {
          lineChanged = true;
          out = out.split(from).join(to);
        }
      }
      if (lineChanged) {
        changed = true;
        report.push(line.trim());
      }
      return out;
    });
    if (changed) {
      violations++;
      const newContent = newLines.join('\n');
      if (process.argv.includes('--fix')) {
        writeFileSync(file, newContent);
        fixed++;
        console.log(`✎ fixed ${file}`);
      } else {
        console.log(`✗ ${file}`);
        report.forEach((l) => console.log(`    ${l}`));
      }
    }
  }
}

if (violations === 0) {
  console.log('✓ copy check: kein AI↔KI-Drift in sichtbarem Text');
} else if (process.argv.includes('--fix')) {
  console.log(`✓ fixed ${fixed} file(s); ${violations - fixed} remaining`);
  process.exit(violations - fixed > 0 ? 1 : 0);
} else {
  console.log(`✗ ${violations} file(s) mit AI↔KI-Drift (--fix zum automatischen Ersetzen)`);
  process.exit(1);
}
