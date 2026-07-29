import { describe, expect, it } from 'vitest';
import type { GameSnapshot } from '../../game/types';
import { COMBAT_MOVES, COMBAT_OPPONENTS } from '../../game/combatMoves';
import { CHARACTER_VOICES } from './characterVoices';
import {
  applyAuthorityDialogueResolution,
  authorityCounterMultiplier,
  authorityManipulationScore,
  authorityOpeningFrustration,
  authorityPlayerPowerMultiplier,
  installAuthorityOverhaul,
} from './authorityOverhaul';
import { opponentPhase } from './progression';

installAuthorityOverhaul();

const snapshot: GameSnapshot = {
  version: 3,
  mode: 'world',
  profile: {
    name: 'Test', skinTone: '#d9a67e', hair: '#4a3224', shirt: '#e5ad43', shorts: '#294954',
    hairStyle: 'kurz', bodyType: 'normal', accessory: 'keins', trait: 'direkt',
  },
  prologue: { introSeen: true, shoppingComplete: true, spent: 22 },
  day: 2,
  minutes: 1180,
  money: 3,
  needs: { energy: 72, hunger: 18, thirst: 24, bladder: 20, alcohol: 34, highness: 0, hangover: 0, courage: 46 },
  metrics: { dignity: 52, chaos: 18, reputation: 20, momentum: 8 },
  inventory: { bier: 2, wasser: 1 },
  team: [],
  relationships: { gundula: 8, uli: 7 },
  quests: {},
  activeQuest: 'entry',
  flags: {},
  encounter: null,
  chronicle: [],
  worldPosition: { x: 900, y: 1600 },
  currentInterior: null,
  activityResults: {},
  clockLabel: '19:40',
  phaseLabel: 'Abend',
  conditionLabel: 'Angeschickert',
  currentObjective: 'Schranke öffnen',
};

describe('grim and manipulable authority overhaul', () => {
  it('gives Gundula and Uli harsher, more personal voices', () => {
    expect(CHARACTER_VOICES.gundula.role).toMatch(/Platzkönigin|angeschickert/i);
    expect(CHARACTER_VOICES.gundula.choices.some((entry) => entry.label.includes('Beer-Pong'))).toBe(true);
    expect(CHARACTER_VOICES.uli.role).toMatch(/Schranken-Rambo|Macho/i);
    expect(CHARACTER_VOICES.uli.choices.some((entry) => entry.label.includes('Nackenklatscher'))).toBe(true);
  });

  it('replaces generic moves with absurd campsite-specific attacks without changing save IDs', () => {
    expect(COMBAT_MOVES['classic-high-five'].label).toContain('Nackenklatscher');
    expect(COMBAT_MOVES['cup-eye-contact'].label).toContain('Beer-Pong');
    expect(COMBAT_MOVES['logical-argument'].label).toContain('Bierdeckel');
    expect(COMBAT_MOVES['total-exaggeration'].label).toContain('Legenden');
  });

  it('makes the authority stronger at first but vulnerable to ego and drinking rituals', () => {
    expect(COMBAT_OPPONENTS['entry-authority'].baseCounterFrustration).toBeGreaterThan(14);
    expect(COMBAT_OPPONENTS['entry-authority'].traits).toContain('leicht am Ego zu packen');
    expect(COMBAT_OPPONENTS['entry-authority'].moveMultipliers['beer-offer']).toBeGreaterThan(1.5);
    expect(COMBAT_OPPONENTS['entry-authority'].moveMultipliers['logical-argument']).toBeLessThan(.6);
  });

  it('turns successful Wegbier diplomacy into persistent manipulation state', () => {
    const result = applyAuthorityDialogueResolution(
      'gundula',
      { type: 'character', choiceId: 'gundula-form' },
      { text: 'Basisreaktion.', relationship: 4, minutes: 6, success: true, flags: {}, needs: {}, metrics: {} },
    );
    expect(result.flags?.['authority-drinking-bond']).toBe(true);
    expect(result.flags?.['authority-goodwill']).toBe(true);
    expect(result.learnedAttack).toBe('beer-offer');
    expect(result.needs?.alcohol).toBeGreaterThan(0);
    expect(result.relationship).toBeGreaterThan(6);
  });

  it('converts learned social weaknesses into combat advantage', () => {
    const flags = {
      'authority-ego-hook': true,
      'authority-drinking-bond': true,
      'authority-pong-challenge': true,
      'authority-goodwill': true,
    };
    expect(authorityManipulationScore(flags)).toBe(4);
    expect(authorityOpeningFrustration('entry-authority', flags)).toBeGreaterThanOrEqual(20);
    expect(authorityCounterMultiplier('entry-authority', snapshot, flags)).toBeLessThan(.7);
    expect(authorityPlayerPowerMultiplier('entry-authority', 'beer-offer', 'drink', snapshot, flags)).toBeGreaterThan(1.7);
    expect(authorityPlayerPowerMultiplier('entry-authority', 'cup-eye-contact', 'charm', snapshot, flags)).toBeGreaterThan(1.7);
  });

  it('uses personality-driven combat phases instead of generic bureaucracy', () => {
    expect(opponentPhase('entry-authority', .1).label).toBe('Schranken-Gockelmodus');
    expect(opponentPhase('entry-authority', .5).label).toBe('Angeschickerte Stichelei');
    expect(opponentPhase('entry-authority', .9).label).toBe('Gekränkte Platzherrschaft');
  });
});
