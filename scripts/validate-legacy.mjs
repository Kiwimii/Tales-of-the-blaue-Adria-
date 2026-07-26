import { readFileSync, statSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const docsRoot = resolve(repositoryRoot, 'docs');
const html = readFileSync(resolve(docsRoot, 'index.html'), 'utf8');
const manifest = JSON.parse(readFileSync(resolve(docsRoot, 'manifest.webmanifest'), 'utf8'));

const expectedScripts = [
  'content-v13.js',
  'map-v13.js',
  'prelude-v13.js',
  'engine-v13.js',
  'bridge-v13.js',
  'world-v13.js',
  'activities-v13.js',
  'hotfix-v13.js',
  'ux-v15.js',
  'ux-runtime-v15.js',
  'design-core-v23.js',
  'design-world-v23.js',
  'design-characters-v23.js',
  'design-battle-v23.js',
  'design-minigames-v23.js',
  'design-atmosphere-v23.js',
  'design-runtime-v23.js',
  'expansion-v25.js',
  'expansion-v28.js',
  'popup-policy-v29.js',
];
const actualScripts = [...html.matchAll(/<script\s+src="\.\/([^"?]+)\?v=29"><\/script>/g)].map((match) => match[1]);
assert(
  JSON.stringify(actualScripts) === JSON.stringify(expectedScripts),
  `Script order differs.\nExpected: ${expectedScripts.join(', ')}\nActual: ${actualScripts.join(', ')}`,
);

const requiredIds = [
  'boot-screen',
  'boot-status',
  'boot-progress',
  'app',
  'game-canvas',
  'game-stage',
  'needs-strip',
  'touch-controls',
  'virtual-stick',
  'stick-knob',
  'action-button',
  'scene-actions',
  'toast-stack',
  'objective-banner',
  'creator-screen',
  'shop-screen',
  'dialogue-layer',
  'drawer-layer',
  'fatal-error',
];
for (const id of requiredIds) assert(html.includes(`id="${id}"`), `Missing required element #${id}`);

const localAssets = [...html.matchAll(/(?:src|href)="\.\/([^"#?]+)(?:\?v=29)?"/g)].map((match) => match[1]);
for (const asset of localAssets) {
  assert(statSync(resolve(docsRoot, asset)).isFile(), `Referenced asset does not exist: ${asset}`);
}

for (const script of [...expectedScripts, 'sw.js']) {
  const result = spawnSync(process.execPath, ['--check', resolve(docsRoot, script)], { encoding: 'utf8' });
  assert(result.status === 0, `Syntax check failed for ${script}:\n${result.stderr}`);
}

const content = readFileSync(resolve(docsRoot, 'content-v13.js'), 'utf8');
const serviceWorker = readFileSync(resolve(docsRoot, 'sw.js'), 'utf8');
assert(content.includes("version:'1.8.0-sprint28'"), 'Published game version is stale');
assert(content.includes("build:'Sprint 28 · v1.8.0 · Build v29'"), 'Published build label is stale');
assert(manifest.start_url === './?v=29', 'Manifest start_url is not pinned to build v29');
assert(manifest.icons?.some((icon) => icon.src === './icon.svg'), 'Manifest has no installable icon');
assert(html.includes("serviceWorker.register('./sw.js?v=29')"), 'Service worker is not registered');
for (const script of expectedScripts) {
  assert(serviceWorker.includes(`./${script}?v=29`), `Service worker does not cache ${script}`);
}
assert(!html.includes('?v=14'), 'Forbidden stale cache reference ?v=14');
assert(!html.includes('game.js?v=8'), 'Forbidden stale game.js?v=8 reference');
assert(!html.includes('content.js?v=8'), 'Forbidden stale content.js?v=8 reference');

console.log(`Legacy validation passed: ${expectedScripts.length} runtime modules, ${localAssets.length} linked assets, PWA cache v29.`);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
