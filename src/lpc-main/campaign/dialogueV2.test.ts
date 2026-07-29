import { describe, expect, it } from 'vitest';
import type { GameSnapshot } from '../../game/types';
import type { CampaignMetaState } from './metaStore';
import { characterOpening, resolveCharacterChoice } from './characterVoices';
import { dialogueChoices, resolveDialogueAction } from './dialogueV2';

const snapshot: GameSnapshot = {
  version: 3,
  mode: 'world',
  profile: {
    name: 'Test', skinTone: '#d9a67e', hair: '#4a3224', shirt: '#e5ad43', shorts: '#294954',
    hairStyle: 'kurz', bodyType: 'normal', accessory: 'keins', trait: 'hilfsbereit',
  },
  prologue: { introSeen: true, shoppingComplete: true, spent: 20 },
  day: 2,
  minutes: 900,
  money: 5,
  needs: { energy: 82, hunger: 18, thirst: 20, bladder: 25, alcohol: 8, highness: 0, hangover: 0, courage: 38 },
  metrics: { dignity: 60, chaos: 9, reputation: 14, momentum: 4 },
  inventory: { wasser: 2, bier: 1, kaffee: 1 },
  team: [],
  relationships: { rene: 14, jule: 18, kira: 6, gundula: 8, gregor: 10 },
  quests: {},
  activeQuest: 'entry',
  flags: {},
  encounter: null,
  chronicle: [],
  worldPosition: { x: 900, y: 1600 },
  currentInterior: null,
  activityResults: {},
  clockLabel: '15:00',
  phaseLabel: 'Nachmittag',
  conditionLabel: 'Stabil',
  currentObjective: 'Freies Wochenende',
};

const meta: CampaignMetaState = {
  version: 3,
  introSeen: true,
  introReplays: 0,
  questStage: 'free-weekend',
  reservationSolved: true,
  authorityBattleWon: true,
  finalBattleWon: false,
  powerConnected: true,
  unloading: { drinks: true, tents: true, cable: true },
  firstBeerOpened: true,
  relationshipBonus: {},
  romance: {
    susi: { interest: 0, attempts: 0, successes: 0, boundaryStrikes: 0, lastLine: '' },
    jule: { interest: 8, attempts: 1, successes: 1, boundaryStrikes: 0, lastLine: '' },
    kira: { interest: 0, attempts: 0, successes: 0, boundaryStrikes: 0, lastLine: '' },
  },
  conversationCounts: {},
  learnedAttacks: ['classic-high-five'],
  equippedAttacks: ['classic-high-five'],
  attackMastery: { 'classic-high-five': { uses: 0, successes: 0, level: 1 } },
  unlockedAnecdotes: [],
  equippedAnecdotes: [],
  activeTeam: [],
  miniResults: {},
  flags: {},
  suspicion: 0,
  reliefCount: 0,
  weekendScore: 42,
  weekendRank: 'tolerated',
  lastEvent: '',
};

describe('character-driven LPC dialogue', () => {
  it('gives René choices that sound like René rather than generic topics', () => {
    const choices = dialogueChoices('rene', snapshot, meta);
    expect(choices.some((entry) => entry.label.includes('WIE HEISST DER HUND'))).toBe(true);
    expect(choices.some((entry) => entry.label.includes('Aufbaukommandeur'))).toBe(true);
    expect(choices.every((entry) => !entry.label.includes('Etwas Persönliches riskieren'))).toBe(true);
  });

  it('keeps character cadence visible in openings', () => {
    expect(characterOpening('gregor', snapshot, meta)).toMatch(/Problem|Zustand|Fehler/);
    expect(characterOpening('danny', snapshot, meta)).toMatch(/früh|Flucht|kurz/i);
    expect(characterOpening('gundula', snapshot, meta)).toMatch(/Klemmbrett|Sprechen|Stellplatz/);
  });

  it('turns a fitting Jule help choice into a concrete Flunkyball assist', () => {
    const result = resolveCharacterChoice('jule', 'jule-help', snapshot, meta, () => 0);
    expect(result.success).toBe(true);
    expect(result.relationship).toBeGreaterThan(4);
    expect(result.flags?.['partner-jule-flunky']).toBe(true);
    expect(result.metrics?.reputation).toBeGreaterThan(0);
  });

  it('punishes a character-inappropriate Kira pose demand', () => {
    const result = resolveCharacterChoice('kira', 'kira-pose', snapshot, meta, () => .99);
    expect(result.success).toBe(false);
    expect(result.relationship).toBeLessThan(0);
    expect(result.text).toMatch(/Pose|nein|Gespräch/i);
  });

  it('does not consume a clearly rejected gift', () => {
    const result = resolveDialogueAction('jule', { type: 'gift', itemId: 'bier' }, snapshot, meta, () => 0);
    expect(result.success).toBe(false);
    expect(result.consumeItem).toBeUndefined();
    expect(result.flags?.['gift-missed-jule']).toBe(true);
  });

  it('makes successful conversations change more than relationship alone', () => {
    const result = resolveDialogueAction(
      'gundula',
      { type: 'character', choiceId: 'gundula-proof', topic: 'plan', approach: 'help' },
      snapshot,
      meta,
      () => 0,
    );
    expect(result.success).toBe(true);
    expect(result.flags?.['authority-goodwill']).toBe(true);
    expect(result.ripples).toContainEqual({ id: 'uli', delta: 2 });
    expect(result.metrics?.reputation).toBeGreaterThan(0);
  });
});
