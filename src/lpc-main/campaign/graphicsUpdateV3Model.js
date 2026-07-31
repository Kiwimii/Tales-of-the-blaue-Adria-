export const GRAPHICS_UPDATE_VERSION = '3.0.0';

const CORE_FIGHTERS = new Set(['andre', 'player', 'masl', 'gundula', 'uli']);
const DEFAULT_CAST = {
  flipCup: ['rene', 'lars', 'danny', 'felix', 'susi', 'jule'],
  beerPong: ['susi', 'jule', 'gregor', 'schima', 'ronny', 'felix'],
  flunkyball: ['lars', 'danny', 'gregor', 'manni', 'jule', 'schubert'],
  hedgePee: ['gundula', 'uli', 'danny', 'felix'],
  maslHole: ['masl', 'andre', 'rene', 'lars', 'danny', 'gregor'],
};

export function uniqueCharacterIds(values = []) {
  const result = [];
  const seen = new Set();
  for (const value of Array.isArray(values) ? values : []) {
    const id = String(value ?? '').trim().toLocaleLowerCase('de');
    if (!id || seen.has(id)) continue;
    seen.add(id);
    result.push(id);
  }
  return result;
}

export function brawlSupportTeam(activeTeam = [], limit = 8) {
  return uniqueCharacterIds(activeTeam)
    .filter((id) => !CORE_FIGHTERS.has(id))
    .slice(0, Math.max(0, Number(limit) || 0));
}

export function minigameCast(game, activeTeam = [], limit = 8) {
  const defaults = DEFAULT_CAST[game] ?? DEFAULT_CAST.flipCup;
  return uniqueCharacterIds([...activeTeam, ...defaults])
    .filter((id) => id !== 'gundula' && id !== 'uli')
    .slice(0, Math.max(2, Number(limit) || 8));
}

export function reactionForCombatLog(text = '') {
  const upper = String(text).toLocaleUpperCase('de');
  if (/MASL-TUNNEL|PERFEKT|GEWINN|TRIFFT BEIDE|STUN/.test(upper)) return 'cheer';
  if (/BLOCK|DECKUNG|AUSGEWICHEN/.test(upper)) return 'guard';
  if (/TRIFFT DICH|TRIFFT MASL|VERLIERT|NIEDERLAGE/.test(upper)) return 'panic';
  if (/SCHLAG|HAKEN|KLATSCHER|RAMME|SCHELLE|HIT/.test(upper)) return 'hit';
  return 'idle';
}

export function crowdSize(debateCrowd = 0, activeTeamSize = 0) {
  const value = Math.round(3 + Number(activeTeamSize || 0) * 0.7 + Math.max(-10, Math.min(60, Number(debateCrowd || 0))) / 8);
  return Math.max(3, Math.min(14, value));
}

export function patrolActors() {
  return [
    { id: 'gundula', lane: 'upper', duration: 7.4, delay: -1.2, direction: 1, cone: 190 },
    { id: 'uli', lane: 'lower', duration: 9.1, delay: -4.6, direction: -1, cone: 225 },
  ];
}

export function sceneLabel(game) {
  return ({
    flipCup: 'Zeltkreis-Arena',
    beerPong: 'Festwiesen-Tisch',
    flunkyball: 'Strand-Laufbahn',
    hedgePee: 'Patrouille Gundula & Uli',
    maslHole: 'Masls Lochkommando',
  })[game] ?? 'Camping-Minispiel';
}
