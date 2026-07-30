import { describe, expect, it } from 'vitest';
import {
  brawlSetup,
  calculateNightNoise,
  debateOpeningPressure,
  defaultWeekendArcState,
  olympiadPoints,
  secretMillionaireId,
  secretRivalScore,
  secretRoundPoints,
} from './weekendArcModel';

describe('connected Friday and Saturday weekend arc', () => {
  it('scores the drinking-game Olympics by result quality', () => {
    expect(olympiadPoints(false, 'failed')).toBe(0);
    expect(olympiadPoints(true, 'messy')).toBe(2);
    expect(olympiadPoints(true, 'solid')).toBe(3);
    expect(olympiadPoints(true, 'perfect')).toBe(5);
  });

  it('makes the full afterparty materially louder than going to sleep', () => {
    const quiet = calculateNightNoise({ olympiadPoints: 9, afterparty: 'quiet', alcohol: 35, chaos: 28, lateActivities: 0, quietRest: true });
    const full = calculateNightNoise({ olympiadPoints: 9, afterparty: 'full-send', alcohol: 72, chaos: 70, lateActivities: 2 });
    expect(quiet).toBeLessThan(45);
    expect(full).toBeGreaterThan(80);
    expect(full - quiet).toBeGreaterThan(40);
  });

  it('turns prior Gundula and Uli manipulation into lower eviction pressure', () => {
    const raw = debateOpeningPressure(75, {});
    const prepared = debateOpeningPressure(75, {
      'authority-goodwill': true,
      'authority-drinking-bond': true,
      'authority-ego-hook': true,
    });
    expect(raw).toBeGreaterThan(prepared);
    expect(raw - prepared).toBe(16);
  });

  it('carries debate, Masl mood and night noise into the brawl setup', () => {
    const prepared = brawlSetup({ pressure: 22, crowd: 35, wakeMood: 82, relationshipMasl: 35, nightNoise: 35 });
    const disastrous = brawlSetup({ pressure: 86, crowd: -10, wakeMood: 18, relationshipMasl: -10, nightNoise: 92 });
    expect(prepared.maslHp).toBeGreaterThan(disastrous.maslHp);
    expect(prepared.maslPower).toBeGreaterThan(disastrous.maslPower);
    expect(prepared.gundulaHp).toBeLessThan(disastrous.gundulaHp);
    expect(prepared.uliHp).toBeLessThan(disastrous.uliHp);
    expect(prepared.enemyPower).toBeLessThan(disastrous.enemyPower);
  });

  it('uses deterministic hidden roles and increasing secret votes', () => {
    expect(secretMillionaireId(1234)).toBe(secretMillionaireId(1234));
    expect(secretMillionaireId(1234)).not.toBe('');
    expect([1, 2, 3, 4].map(secretRoundPoints)).toEqual([1, 2, 3, 4]);
    expect(secretRivalScore(1234)).toBeGreaterThanOrEqual(3);
    expect(secretRivalScore(1234)).toBeLessThanOrEqual(7);
  });

  it('starts with all new subquests dormant and save-compatible defaults', () => {
    const state = defaultWeekendArcState();
    expect(state.version).toBe(1);
    expect(state.nightNoise).toBe(0);
    expect(state.olympiad.points).toBe(0);
    expect(Object.values(state.olympiad.disciplines).every((entry) => !entry.attempted)).toBe(true);
    expect(state.saturday.step).toBe('dormant');
    expect(state.secretMillionaire.round).toBe(0);
    expect(state.secretMillionaire.eliminated).toEqual([]);
  });
});
