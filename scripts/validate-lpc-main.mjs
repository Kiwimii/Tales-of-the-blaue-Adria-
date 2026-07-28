import { readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const output = resolve(root, 'docs/lpc-main');
const html = readFileSync(resolve(output, 'index.html'), 'utf8');
const assetDirectory = resolve(output, 'assets');
const files = readdirSync(assetDirectory);
const scripts = files.filter((file) => file.endsWith('.js'));
const styles = files.filter((file) => file.endsWith('.css'));

assert(scripts.length >= 1 && scripts.length <= 4, `Expected one to four LPC main script chunks, found ${scripts.length}.`);
assert(styles.length === 1, `Expected one LPC main stylesheet, found ${styles.length}.`);
assert(!files.some((file) => file.endsWith('.map')), 'LPC main build must not publish source maps.');
assert(html.includes('LPC CONCEPT BUILD'), 'LPC main build identity is missing.');
assert(html.includes('/Tales-of-the-blaue-Adria-/lpc-main/assets/'), 'LPC main build uses the wrong base path.');
assert(html.includes('../next/') && html.includes('../lpc-test/'), 'Comparison links are missing.');

const javascript = scripts.map((file) => readFileSync(resolve(assetDirectory, file), 'utf8')).join('\n');
const stylesheet = styles.map((file) => readFileSync(resolve(assetDirectory, file), 'utf8')).join('\n');

for (const marker of [
  'tales-blaue-adria-lpc-main-v1',
  'gundula-entry',
  'manni-paper',
  'flipCup',
  'beerPong',
  'flunkyball',
  'stagger',
  'carry',
  'phone',
  'raw.githubusercontent.com/LiberatedPixelCup',
]) assert(javascript.includes(marker), `Missing LPC main runtime marker: ${marker}`);

assert(stylesheet.includes('.animation-buttons') && stylesheet.includes('.relationship-list'), 'LPC main system UI is missing.');
assert(stylesheet.includes('image-rendering: pixelated') || stylesheet.includes('image-rendering:pixelated'), 'Pixel rendering rule is missing.');

const totalSize = scripts.reduce((sum, file) => sum + statSync(resolve(assetDirectory, file)).size, 0);
assert(totalSize < 2_800_000, `LPC main JavaScript is unexpectedly large: ${Math.round(totalSize / 1024)} kB.`);
console.log(`LPC main validation passed: ${Math.round(totalSize / 1024)} kB across ${scripts.length} script chunk(s).`);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
