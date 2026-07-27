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

const javascript = readdirSync(resolve(output, 'assets')).filter((file) => file.endsWith('.js'));
assert(javascript.length === 2, `Expected an initial and lazy game chunk, found ${javascript.length}.`);
const sizes = javascript.map((file) => ({ file, bytes: statSync(resolve(output, 'assets', file)).size }));
const initial = sizes.find(({ file }) => file.startsWith('index-'));
const game = sizes.find(({ file }) => file.startsWith('createGame-'));
assert(initial && initial.bytes < 300_000, 'Initial UI bundle must stay below 300 kB.');
assert(game && game.bytes > initial.bytes, 'Phaser must remain in the lazy game chunk.');
assert(!readdirSync(resolve(output, 'assets')).some((file) => file.endsWith('.map')), 'Production source maps must not be published.');
assert(manifest.start_url === './' && manifest.scope === './', 'Next PWA scope is invalid.');
assert(worker.includes('tales-adria-next-s77'), 'Next service worker cache version is stale.');

console.log(`Next validation passed: ${linkedAssets.length} linked files, ${Math.round(initial.bytes / 1024)} kB initial UI, lazy Phaser chunk.`);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
