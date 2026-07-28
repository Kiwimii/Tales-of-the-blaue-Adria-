import { describe, expect, it } from 'vitest';
import type { GameSnapshot } from '../../game/types';
import { INTRO_BEATS } from './narrative';
import { CAMPAIGN_CHARACTERS, MINIGAME_INTERACTIONS, STORY_INTERACTIONS } from './content';
import { createBattle, resolveBattleTurn } from './battleEngine';

const snapshot: GameSnapshot = {
  version: 3,
  mode: 'world',
  profile: {
    name: 'Test', skinTone: '#d9a67e', hair: '#4a3224', shirt: '#e5ad43', shorts: '#294954',
    hairStyle: 'kurz', bodyType: 'normal', accessory: 'keins', trait: 'charmant',
  },
  prologue: { introSeen: true, shoppingComplete: true, spent: 20 },
  day: 1,
  minutes: 480,
  money: 5,
  needs: { energy: 90, hunger: 10, thirst: 12, bladder: 8, alcohol: 0, highness: 0, hangover: 0, courage: 30 },
  metrics: { dignity: 60, chaos: 0, reputation: 0, momentum: 0 },
  inventory: {},
  team: [],
  relationships: {},
  quests: {},
  activeQuest: 'entry',
  flags: {},
  encounter: null,
  chronicle: [],
  worldPosition: { x: 900, y: 1600 },
  currentInterior: null,
  activityResults: {},
  clockLabel: '08:00',
  phaseLabel: 'Morgen',
  conditionLabel: 'Stabil',
  currentObjective: 'Ankommen',
};

describe('LPC campaign systems', () => {
  it('contains a complete, paced black-humour intro', () => {
    expect(INTRO_BEATS.length).toBeGreaterThanOrEqual(8);
    expect(INTRO_BEATS.every((beat) => beat.lines.length >= 2 && beat.duration >= 6000)).toBe(true);
    expect(INTRO_BEATS.some((beat) => beat.lines.join(' ').includes('Hecke'))).toBe(true);
  });

  it('maps all central campaign characters and requested minigames', () => {
    const ids = new Set(CAMPAIGN_CHARACTERS.map((character) => character.id));
    for (const id of ['gundula', 'uli', 'andre', 'rene', 'lars', 'danny', 'manni', 'ronny', 'susi', 'jule', 'kira']) expect(ids.has(id)).toBe(true);
    const minigames = new Set(MINIGAME_INTERACTIONS.map((entry) => entry.id));
    for (const id of ['flipCup', 'beerPong', 'flunkyball', 'maslHole', 'ronnyBattle']) expect(minigames.has(id)).toBe(true);
    expect(STORY_INTERACTIONS.find((entry) => entry.id === 'trunk')).toMatchObject({ x: 900, y: 1600 });
  });

  it('resolves stateful frustration battle turns with deterministic rolls', () => {
    const initial = createBattle('entry-authority');
    const result = resolveBattleTurn(initial, 'classic-high-five', snapshot, 1, () => 0);
    expect(result.hit).toBe(true);
    expect(result.critical).toBe(true);
    expect(result.playerDamage).toBeGreaterThan(20);
    expect(result.state.enemy.frustration).toBe(result.playerDamage);
    expect(result.state.round).toBe(2);
    expect(result.state.enemy.statuses.some((status) => status.id === 'ueberrumpelt')).toBe(false);
  });

  it('makes a synchronized cheer stronger with a larger active team', () => {
    const solo = resolveBattleTurn(createBattle('ronny'), 'synchronised-cheer', snapshot, 1, () => 0.2);
    const team = resolveBattleTurn(createBattle('ronny'), 'synchronised-cheer', snapshot, 4, () => 0.2);
    expect(team.playerDamage).toBeGreaterThan(solo.playerDamage);
  });
});
