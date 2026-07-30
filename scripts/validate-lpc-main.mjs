import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const output = resolve(root, 'docs/lpc-main');
const html = readFileSync(resolve(output, 'index.html'), 'utf8');
const assetDirectory = resolve(output, 'assets');
const files = readdirSync(assetDirectory);
const scripts = files.filter((file) => file.endsWith('.js'));
const styles = files.filter((file) => file.endsWith('.css'));

assert(scripts.length >= 1 && scripts.length <= 8, `Expected one to eight LPC campaign script chunks, found ${scripts.length}.`);
assert(styles.length === 1, `Expected one LPC campaign stylesheet, found ${styles.length}.`);
assert(!files.some((file) => file.endsWith('.map')), 'LPC campaign build must not publish source maps.');
assert(html.includes('LPC CAMPAIGN BUILD'), 'LPC campaign build identity is missing.');
assert(html.includes('lpc-weekend-arc-v1'), 'Connected weekend arc release marker is missing.');
assert(html.includes('/Tales-of-the-blaue-Adria-/lpc-main/assets/'), 'LPC campaign build uses the wrong base path.');
assert(html.includes('../next/') && html.includes('../lpc-test/'), 'Comparison links are missing.');
assert(existsSync(resolve(root, 'THIRD_PARTY_ASSETS.md')), 'Third-party CC0 asset documentation is missing.');

const javascript = scripts.map((file) => readFileSync(resolve(assetDirectory, file), 'utf8')).join('\n');
const stylesheet = styles.map((file) => readFileSync(resolve(assetDirectory, file), 'utf8')).join('\n');

for (const marker of [
  'tales-blaue-adria-lpc-main-v1',
  'tales-blaue-adria-lpc-campaign-meta-v2',
  'entry-authority',
  'ronnyBattle',
  'flipCup',
  'beerPong',
  'flunkyball',
  'hedgePee',
  'maslHole',
  'cup-eye-contact',
  'classic-high-five',
  'raw.githubusercontent.com/LiberatedPixelCup',
  'Calinou/kenney-particle-pack',
  'Kenney CC0 Particle Pack',
  'Wurfart gilt bis zur Landung',
  'lpc-campaign-minigame-closed',
  'lpc-campaign-world-input-restored',
  'lpc-campaign-start-minigame',
  'lpc-campaign-minigame-outcome',
  'Kumpel-Nackenklatscher',
  'Beer-Pong-Zwangsduell',
  'Schranken-Gockelmodus',
  'authority-drinking-bond',
  'authority-nacken-calibrated',
  'SCHWACHSTELLE: EGO/KUMPELRITUAL',
  'SPIEL-CODEX · LIVE AUS DEN SYSTEMDATEN',
  'Alles durchsuchen',
  'Exakt programmierte Regeln',
  'Wochenendwert',
  'Manipulierbare Platzleitung',
  'Wochenendbogen',
  'FREITAG · TRINKSPIEL-OLYMPIADE',
  'SAMSTAG · 08:00 UHR',
  'FAUSTRECHT AN DER SCHRANKE',
  'SECRET MILLIONÄR · RUNDE',
  'Goodbye Adria - nicht!',
  'Masl unsere letzte Chance',
  'earlyEvictionEnding',
  'fridayOlympiadComplete',
  'secretMillionaireComplete',
  'src/lpc-main/campaign/minigamesV2.ts',
]) assert(javascript.includes(marker), `Missing LPC campaign runtime marker: ${marker}`);

for (const marker of [
  '.intro-page',
  '.shop-items',
  '.battle-moves',
  '.romance-list',
  '.mobile-controls',
  '.minigame-stage',
  '.minigame-vfx-canvas',
  '.minigame-vfx-badge',
  '.codex-modal',
  '.codex-tabs',
  '.codex-entry-list',
  '.codex-detail',
  '.codex-table-wrap',
  '.weekend-arc-modal',
  '.olympiad-discipline',
  '.song-lyrics',
  '.brawl-arena',
  '.secret-roster',
]) assert(stylesheet.includes(marker), `Missing LPC campaign stylesheet marker: ${marker}`);

assert(stylesheet.includes('image-rendering:pixelated') || stylesheet.includes('image-rendering: pixelated'), 'Pixel rendering rule is missing.');

const totalSize = scripts.reduce((sum, file) => sum + statSync(resolve(assetDirectory, file)).size, 0);
assert(totalSize < 4_900_000, `LPC campaign JavaScript is unexpectedly large: ${Math.round(totalSize / 1024)} kB.`);
console.log(`LPC campaign validation passed: ${Math.round(totalSize / 1024)} kB across ${scripts.length} script chunk(s), including Friday Olympics, persistent night noise, Saturday eviction/brawl, both full André songs, Secret Millionaire, the searchable codex, hardened minigames and CC0/fallback VFX.`);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
