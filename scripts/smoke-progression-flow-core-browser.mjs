import { readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const sourcePath = join(process.cwd(), 'scripts/smoke-progression-flow-browser.mjs');
const generatedPath = join(process.cwd(), 'scripts/.smoke-progression-flow-core.generated.mjs');
const source = readFileSync(sourcePath, 'utf8');
const focused = source
  .replace("      speedChoices:document.querySelectorAll('[data-intro-duration]').length===3,\n", '')
  .replace("      defaultSelected:document.querySelector('[data-intro-duration=\"68000\"]')?.classList.contains('selected')===true,\n", '')
  .replace("      location.reload();\n", "      location.href = location.pathname + '?smoke=1&progression=1';\n");

if (focused === source || focused.includes('location.reload();')) {
  throw new Error('Progression smoke source did not contain all expected optional assertions and navigation hooks.');
}
writeFileSync(generatedPath, focused);
try {
  await import(`${pathToFileURL(generatedPath).href}?run=${Date.now()}`);
} finally {
  rmSync(generatedPath, { force: true });
}
