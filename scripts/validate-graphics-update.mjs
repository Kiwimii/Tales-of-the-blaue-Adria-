import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  GRAPHICS_UPDATE_VERSION,
  brawlSupportTeam,
  crowdSize,
  minigameCast,
  patrolActors,
  reactionForCombatLog,
  sceneLabel,
  uniqueCharacterIds,
} from '../src/lpc-main/campaign/graphicsUpdateV3Model.js';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

assert(GRAPHICS_UPDATE_VERSION === '3.0.0', 'Graphics update version changed unexpectedly.');
assert(JSON.stringify(uniqueCharacterIds(['Felix', 'felix', '', 'Danny'])) === JSON.stringify(['felix', 'danny']), 'Character IDs must be normalized and deduplicated.');
assert(JSON.stringify(brawlSupportTeam(['masl', 'felix', 'danny', 'gundula', 'felix', 'rene'])) === JSON.stringify(['felix', 'danny', 'rene']), 'Core fighters must not be duplicated in the support row.');

for (const game of ['flipCup', 'beerPong', 'flunkyball', 'hedgePee', 'maslHole']) {
  const cast = minigameCast(game, ['felix', 'danny', 'felix'], 8);
  assert(cast.length >= 2 && cast.length <= 8, `${game} cast size is invalid.`);
  assert(new Set(cast).size === cast.length, `${game} cast contains duplicates.`);
  assert(Boolean(sceneLabel(game)), `${game} scene label is missing.`);
}

const patrols = patrolActors();
assert(patrols.length === 2, 'Hedge patrol must contain exactly Gundula and Uli.');
assert(patrols.some((entry) => entry.id === 'gundula') && patrols.some((entry) => entry.id === 'uli'), 'Hedge patrol actors are incomplete.');
assert(patrols.every((entry) => entry.duration > 5 && entry.cone >= 180), 'Patrol timing or vision cones are invalid.');

assert(reactionForCombatLog('PERFEKTER NACKENKLATSCHER') === 'cheer', 'Perfect hit reaction must cheer.');
assert(reactionForCombatLog('Campingstuhl-Deckung aufgebaut') === 'guard', 'Block reaction must guard.');
assert(reactionForCombatLog('Uli trifft dich') === 'panic', 'Enemy hit reaction must panic.');
assert(crowdSize(-100, 0) === 3 && crowdSize(100, 20) === 14, 'Crowd size must stay bounded.');

const root = resolve(process.cwd());
const runtimePath = resolve(root, 'src/lpc-main/campaign/graphicsUpdateV3.js');
const cssPath = resolve(root, 'src/lpc-main/campaign/graphicsUpdateV3.css');
const htmlPath = resolve(root, 'lpc-main/index.html');
for (const path of [runtimePath, cssPath, htmlPath]) assert(existsSync(path), `Graphics update file is missing: ${path}`);
const runtime = readFileSync(runtimePath, 'utf8');
const css = readFileSync(cssPath, 'utf8');
const html = readFileSync(htmlPath, 'utf8');
for (const marker of ['graphics-v3-support-row', 'graphics-v3-patrol-zone', '__talesGraphicsUpdateV3', 'lpc-campaign-minigame-outcome']) assert(runtime.includes(marker), `Runtime marker is missing: ${marker}`);
for (const marker of ['.graphics-v3-brawl', '.graphics-v3-patrol', '.graphics-v3-vision-cone', '.graphics-v3-scene-flipCup', '.graphics-v3-scene-beerPong', '.graphics-v3-scene-flunkyball']) assert(css.includes(marker), `CSS marker is missing: ${marker}`);
assert(html.includes('lpc-graphics-update-v3') && html.includes('graphicsUpdateV3.js'), 'Graphics update is not wired into the LPC entrypoint.');

console.log('Graphics Update V3 validation passed: dynamic brawl teams, character reactions, five upgraded minigame scenes and Gundula/Uli hedge patrols are structurally complete.');
