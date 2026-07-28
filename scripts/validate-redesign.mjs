import { readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const output = resolve(root, 'docs/redesign');
const html = readFileSync(resolve(output, 'index.html'), 'utf8');
const assetsDir = resolve(output, 'assets');
const assets = readdirSync(assetsDir);

assert(html.includes('Tales of the Blaue Adria · Redesign'), 'Redesign title is missing.');
assert(html.includes('/Tales-of-the-blaue-Adria-/redesign/assets/'), 'Redesign HTML does not use the isolated public base.');
assert(html.includes('redesign-game'), 'Redesign game mount is missing.');

const javascript = assets.filter((file) => file.endsWith('.js'));
const stylesheets = assets.filter((file) => file.endsWith('.css'));
assert(javascript.length === 1, `Expected one self-contained redesign JS bundle, found ${javascript.length}.`);
assert(stylesheets.length === 1, `Expected one redesign stylesheet, found ${stylesheets.length}.`);
assert(!assets.some((file) => file.endsWith('.map')), 'Redesign source maps must not be published.');

const bundle = readFileSync(resolve(assetsDir, javascript[0]), 'utf8');
const css = readFileSync(resolve(assetsDir, stylesheets[0]), 'utf8');
const bundleSize = statSync(resolve(assetsDir, javascript[0])).size;

assert(bundle.includes('adria-redesign-v1'), 'Redesign build identity is missing.');
assert(bundle.includes('TAUCHERPLATZ') && bundle.includes('SERVICEHOF') && bundle.includes('Blaue Adria'), 'Core redesigned areas are missing.');
assert(bundle.includes('Kabeltrommel') && bundle.includes('Zeltsäcke'), 'Redesign quest supplies are missing.');
assert(bundle.includes('Lagerfeuer entzünden') && bundle.includes('Wasser prüfen'), 'Redesign quest conclusion is missing.');
assert(bundle.includes('6ac78232d5aedcc85ce5f27d060ea92366f7c24a'), 'External CC0 asset revision is not pinned in production.');
assert(bundleSize > 900_000, 'Phaser and the standalone world should be bundled in the redesign build.');
assert(bundleSize < 2_500_000, `Redesign bundle is unexpectedly large: ${Math.round(bundleSize / 1024)} kB.`);
assert(css.includes('.intro-panel') && css.includes('.mobile-controls') && css.includes('.dialog'), 'Redesign interface layers are incomplete.');
assert(css.includes('image-rendering:pixelated') || css.includes('image-rendering: pixelated'), 'Pixel rendering rule is missing.');

console.log(`Redesign validation passed: ${Math.round(bundleSize / 1024)} kB JS, ${Math.round(statSync(resolve(assetsDir, stylesheets[0])).size / 1024)} kB CSS.`);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
