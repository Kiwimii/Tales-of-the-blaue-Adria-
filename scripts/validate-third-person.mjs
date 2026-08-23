import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const output = resolve(root, 'docs/third-person');
const htmlPath = resolve(output, 'index.html');
assert(existsSync(htmlPath), 'Third-person production build is missing.');
const html = readFileSync(htmlPath, 'utf8');
const assetDirectory = resolve(output, 'assets');
const files = readdirSync(assetDirectory);
const scripts = files.filter((file) => file.endsWith('.js'));
const styles = files.filter((file) => file.endsWith('.css'));

assert(scripts.length >= 1 && scripts.length <= 4, `Expected one to four third-person script chunks, found ${scripts.length}.`);
assert(styles.length === 1, `Expected one third-person stylesheet, found ${styles.length}.`);
assert(!files.some((file) => file.endsWith('.map')), 'Third-person build must not publish source maps.');
assert(html.includes('third-person-v1'), 'Third-person release marker is missing.');
assert(html.includes('/Tales-of-the-blaue-Adria-/third-person/assets/'), 'Third-person build uses the wrong GitHub Pages base path.');

const javascript = scripts.map((file) => readFileSync(resolve(assetDirectory, file), 'utf8')).join('\n');
const stylesheet = styles.map((file) => readFileSync(resolve(assetDirectory, file), 'utf8')).join('\n');
for (const marker of [
  'tales-blaue-adria-third-person-progress-v1',
  'tales-blaue-adria-third-person-state-v1',
  '3D THIRD PERSON',
  'Kofferraum öffnen',
  'Die Schranke hat zwei Namen',
  'RUNDE STARTEN',
  'mobile-joystick',
  'WIEDERSEHEN',
]) assert(javascript.includes(marker), `Missing third-person runtime marker: ${marker}`);

for (const marker of ['.third-person-shell', '.objective-card', '.mobile-controls', '.timing-track', '@media (prefers-reduced-motion:reduce)']) {
  assert(stylesheet.replaceAll(' ', '').includes(marker.replaceAll(' ', '')), `Missing third-person style marker: ${marker}`);
}
for (const marker of ['raw.githubusercontent.com', 'cdn.jsdelivr.net', 'unpkg.com', 'fetch("http', "fetch('http"]) {
  assert(!javascript.includes(marker), `Third-person runtime unexpectedly depends on an external asset: ${marker}`);
}
const totalSize = scripts.reduce((sum, file) => sum + statSync(resolve(assetDirectory, file)).size, 0);
assert(totalSize < 1_600_000, `Third-person JavaScript is unexpectedly large: ${Math.round(totalSize / 1024)} kB.`);
console.log(`Third-person validation passed: ${Math.round(totalSize / 1024)} kB JavaScript, canonical world data, separate save keys, responsive controls and no external runtime assets.`);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
