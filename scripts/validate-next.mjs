import { readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const output = resolve(root, 'docs/next');
const html = readFileSync(resolve(output, 'index.html'), 'utf8');
const manifest = JSON.parse(readFileSync(resolve(output, 'manifest.webmanifest'), 'utf8'));
const worker = readFileSync(resolve(output, 'sw.js'), 'utf8');

const linkedAssets = [...html.matchAll(/(?:src|href)="([^"]+)"/g)]
  .map((match) => match[1])
  .filter((path) => path.startsWith('/Tales-of-the-blaue-Adria-/next/'));

assert(linkedAssets.length >= 4, 'Next index does not reference the built assets and PWA files.');
for (const path of linkedAssets) {
  const relative = path.replace('/Tales-of-the-blaue-Adria-/next/', '');
  assert(statSync(resolve(output, relative)).isFile(), `Missing Next asset: ${relative}`);
}

const assetFiles = readdirSync(resolve(output, 'assets'));
const javascript = assetFiles.filter((file) => file.endsWith('.js'));
assert(javascript.length === 2, `Expected an initial and lazy game chunk, found ${javascript.length}.`);
const sizes = javascript.map((file) => ({ file, bytes: statSync(resolve(output, 'assets', file)).size }));
const initial = sizes.find(({ file }) => file.startsWith('index-'));
const game = sizes.find(({ file }) => file.startsWith('createGame-'));
assert(initial && initial.bytes < 300_000, 'Initial UI bundle must stay below 300 kB.');
assert(game && game.bytes > initial.bytes, 'Phaser must remain in the lazy game chunk.');
assert(!assetFiles.some((file) => file.endsWith('.map')), 'Production source maps must not be published.');

const stylesheet = assetFiles
  .filter((file) => file.endsWith('.css'))
  .map((file) => readFileSync(resolve(output, 'assets', file), 'utf8'))
  .join('\n');
assert(stylesheet.includes('.mobile-action-ready'), 'Sprint 85 mobile action feedback is missing from the production CSS.');
assert(stylesheet.includes('.game-menu-title-block'), 'Sprint 85 menu hierarchy is missing from the production CSS.');
assert(stylesheet.includes('.encounter-option-chance'), 'Sprint 85 encounter risk display is missing from the production CSS.');
assert(stylesheet.includes('.mobile-interaction-picker'), 'Sprint 86 interaction picker is missing from the production CSS.');
assert(stylesheet.includes('.graphics-options-panel'), 'Sprint 87 graphics options are missing from the production CSS.');
assert(stylesheet.includes('.quest-tracking-panel'), 'Sprint 88 selectable quest list is missing from the production CSS.');
assert(stylesheet.includes('.quest-hud-destination'), 'Sprint 88 tracked destination feedback is missing from the production CSS.');
assert(stylesheet.includes('.mobile-action-zone') && stylesheet.includes('width:50%'), 'Sprint 89 invisible right-side action surface is missing from production CSS.');
const transparentActionSurface = (stylesheet.includes('background-color:transparent') || stylesheet.includes('background-color:#0000'))
  && stylesheet.includes('background-image:none');
assert(transparentActionSurface, 'Sprint 89 mobile action surface must remain visually transparent.');

const gameBundle = javascript
  .map((file) => readFileSync(resolve(output, 'assets', file), 'utf8'))
  .join('\n');
assert(gameBundle.includes('hedge-pee'), 'Sprint 86 hedge minigame is missing from the production game bundle.');
assert(gameBundle.includes('tales:cycle-interaction'), 'Sprint 86 interaction cycling is missing from the production game bundle.');
assert(gameBundle.includes('tales-adria-graphics-mode'), 'Sprint 87 persisted graphics selection is missing from the production bundle.');
assert(gameBundle.includes('Mobil optimiert') && gameBundle.includes('PC optimiert'), 'Sprint 87 graphics profile labels are missing from the production bundle.');
assert(gameBundle.includes('tales:tracked-quest-changed'), 'Sprint 88 tracked quest event is missing from the production bundle.');
assert(gameBundle.includes('Kofferraum') && gameBundle.includes('Stromkasten'), 'Sprint 88 dynamic arrival navigation targets are missing from the game bundle.');
assert(gameBundle.includes('BLAUE ADRIA') && gameBundle.includes('FESTWIESE'), 'Sprint 88 visible campground feature groups are missing from the game bundle.');
assert(gameBundle.includes('Nächstes Ankunftsziel') && gameBundle.includes('Nächste fehlende Person'), 'Sprint 88 quest selection labels are missing from the UI bundle.');
assert(gameBundle.includes('tent-circle-west-entry') && gameBundle.includes('tent-circle-east-service'), 'Sprint 89 tent-circle access routes are missing from the production bundle.');
assert(gameBundle.includes('spiky-white') && gameBundle.includes('tank-top') && gameBundle.includes('bald'), 'Sprint 89 authority silhouettes are missing from the production bundle.');
assert(gameBundle.includes('TAUCHERPLATZ · ZELTKREIS') && gameBundle.includes('AUSLADEN · STROM · VORRÄTE'), 'Sprint 89 camp layout identity is missing from the production bundle.');
assert(gameBundle.includes('KABELTROMMEL') && gameBundle.includes('GETRÄNKE'), 'Sprint 89 supply placement labels are missing from the production bundle.');

assert(manifest.start_url === './' && manifest.scope === './', 'Next PWA scope is invalid.');
assert(worker.includes('tales-adria-next-s89'), 'Next service worker cache version is stale.');
assert(worker.includes("destination === 'script'"), 'Game bundles must use the network-first mobile update path.');

console.log(`Next validation passed: ${linkedAssets.length} linked files, ${Math.round(initial.bytes / 1024)} kB initial UI, lazy Phaser chunk.`);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
