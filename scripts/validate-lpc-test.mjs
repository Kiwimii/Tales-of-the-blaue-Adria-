import { readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const output = resolve(root, 'docs/lpc-test');
const html = readFileSync(resolve(output, 'index.html'), 'utf8');
const assetDirectory = resolve(output, 'assets');
const files = readdirSync(assetDirectory);
const scripts = files.filter((file) => file.endsWith('.js'));
const styles = files.filter((file) => file.endsWith('.css'));

assert(scripts.length === 1, `Expected one LPC test script bundle, found ${scripts.length}.`);
assert(styles.length === 1, `Expected one LPC test stylesheet, found ${styles.length}.`);
assert(!files.some((file) => file.endsWith('.map')), 'LPC test must not publish source maps.');
assert(html.includes('LPC CHARACTER TEST'), 'LPC build identity is missing.');
assert(html.includes('/Tales-of-the-blaue-Adria-/lpc-test/assets/'), 'LPC build uses the wrong public base path.');
assert(html.includes('../next/') && html.includes('../redesign/'), 'LPC build comparison links are missing.');

const javascript = scripts.map((file) => readFileSync(resolve(assetDirectory, file), 'utf8')).join('\n');
const stylesheet = styles.map((file) => readFileSync(resolve(assetDirectory, file), 'utf8')).join('\n');

for (const marker of ['tales-adria-lpc-test-v1', 'spiky-white', 'strict-jacket', 'tank-top', 'clipboard', 'LPC CHARACTER CAMP']) {
  assert(javascript.includes(marker), `Missing LPC runtime marker: ${marker}`);
}
assert(javascript.includes('raw.githubusercontent.com/LiberatedPixelCup'), 'Revision-pinned LPC source URLs are missing from the bundle.');
assert(stylesheet.includes('.character-roster') && stylesheet.includes('.profile-panel'), 'Character comparison UI is missing.');
assert(stylesheet.includes('image-rendering:pixelated') || stylesheet.includes('image-rendering: pixelated'), 'Pixel rendering rule is missing.');

const scriptSize = statSync(resolve(assetDirectory, scripts[0])).size;
assert(scriptSize < 2_200_000, `LPC test bundle is unexpectedly large: ${Math.round(scriptSize / 1024)} kB.`);

console.log(`LPC test validation passed: ${Math.round(scriptSize / 1024)} kB script bundle.`);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
