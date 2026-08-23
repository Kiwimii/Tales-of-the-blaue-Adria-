import { describe, expect, it } from 'vitest';
import {
  flipTimingScore,
  flunkyThrowScore,
  isRommeMeld,
  pongAimScore,
  resolveFrustMove,
  type FrustFightState,
} from '../src/third-person/activity3d';

describe('third-person 3D activity mechanics', () => {
  it('rewards a centered Flip Cup landing and rejects a badly mistimed one', () => {
    expect(flipTimingScore(0.5, 0.56)).toBeGreaterThanOrEqual(95);
    expect(flipTimingScore(0.02, 0.78)).toBeLessThan(58);
  });

  it('scores Beer Pong aim, wind and bounce risk deterministically', () => {
    expect(pongAimScore({ x: 0.5, y: 0.23 }, { x: 0.5, y: 0.23 }, 0, false)).toBe(100);
    expect(pongAimScore({ x: 0.68, y: 0.23 }, { x: 0.5, y: 0.23 }, 0, false)).toBeLessThan(58);
    expect(pongAimScore({ x: 0.5, y: 0.23 }, { x: 0.5, y: 0.23 }, 0.08, true)).toBeLessThan(100);
  });

  it('requires both usable power and aim in Flunkyball', () => {
    expect(flunkyThrowScore(0.72, 0.5)).toBe(100);
    expect(flunkyThrowScore(0.15, 0.88)).toBeLessThan(58);
  });

  it('recognises real Rommé sets and same-suit runs', () => {
    expect(isRommeMeld([
      { rank: 11, suit: 'pik' }, { rank: 11, suit: 'herz' }, { rank: 11, suit: 'karo' },
    ])).toBe(true);
    expect(isRommeMeld([
      { rank: 7, suit: 'herz' }, { rank: 8, suit: 'herz' }, { rank: 9, suit: 'herz' },
    ])).toBe(true);
    expect(isRommeMeld([
      { rank: 7, suit: 'herz' }, { rank: 8, suit: 'pik' }, { rank: 9, suit: 'herz' },
    ])).toBe(false);
  });

  it('makes repeated Frustkampf moves less effective', () => {
    const initial: FrustFightState = {
      playerFrustration: 0, enemyFrustration: 0, round: 1, lastMove: null, repetition: 0, finished: false, won: false,
    };
    const first = resolveFrustMove(initial, 'counter', () => 0);
    const second = resolveFrustMove(first.state, 'counter', () => 0);
    expect(first.hit).toBe(true);
    expect(second.playerDamage).toBeLessThan(first.playerDamage);
  });

  it('ends the Frustkampf when Ronny reaches 110 frustration', () => {
    const state: FrustFightState = {
      playerFrustration: 35, enemyFrustration: 100, round: 5, lastMove: null, repetition: 0, finished: false, won: false,
    };
    const result = resolveFrustMove(state, 'logic', () => 0);
    expect(result.state.finished).toBe(true);
    expect(result.state.won).toBe(true);
    expect(result.state.enemyFrustration).toBe(110);
    expect(result.counterDamage).toBe(0);
  });
});
