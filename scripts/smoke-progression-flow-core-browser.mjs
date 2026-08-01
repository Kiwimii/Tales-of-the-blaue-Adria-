import { readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const sourcePath = join(process.cwd(), 'scripts/smoke-progression-flow-browser.mjs');
const generatedPath = join(process.cwd(), 'scripts/.smoke-progression-flow-core.generated.mjs');
const source = readFileSync(sourcePath, 'utf8');
const focused = source
  .replace("      speedChoices:document.querySelectorAll('[data-intro-duration]').length===3,\n", '')
  .replace("      defaultSelected:document.querySelector('[data-intro-duration=\"68000\"]')?.classList.contains('selected')===true,\n", '');

if (focused === source) throw new Error('Progression smoke source did not contain the optional intro-control assertions.');
writeFileSync(generatedPath, focused);
try {
  await import(`${pathToFileURL(generatedPath).href}?run=${Date.now()}`);
} finally {
  rmSync(generatedPath, { force: true });
}
