import { describe, expect, it } from 'vitest';
import { advanceHedgePee, hedgeDangerAt, hedgePeeResult } from '../src/game/hedgePeeMechanics';

describe('hedge relief stealth mechanics', () => {
  it('builds relief with little suspicion in a safe window', () => {
    const next = advanceHedgePee({ progress: 0, suspicion: 0 }, 1000, true, 0.08, 80);
    expect(next.progress).toBeGreaterThan(10);
    expect(next.suspicion).toBeLessThan(3);
    expect(hedgePeeResult(next)).toBe('running');
  });

  it('raises suspicion quickly while a guard is looking', () => {
    const safe = advanceHedgePee({ progress: 20, suspicion: 10 }, 1200, true, 0.1, 75);
    const exposed = advanceHedgePee({ progress: 20, suspicion: 10 }, 1200, true, 0.95, 75);
    expect(exposed.suspicion).toBeGreaterThan(safe.suspicion + 20);
  });

  it('lets the player reduce suspicion by stopping', () => {
    const next = advanceHedgePee({ progress: 55, suspicion: 62 }, 2000, false, 1, 90);
    expect(next.progress).toBe(55);
    expect(next.suspicion).toBeLessThan(40);
  });

  it('recognises success and being caught', () => {
    expect(hedgePeeResult({ progress: 100, suspicion: 72 })).toBe('success');
    expect(hedgePeeResult({ progress: 84, suspicion: 100 })).toBe('caught');
  });

  it('creates recurring safe and dangerous guard windows', () => {
    const values = Array.from({ length: 120 }, (_, index) => hedgeDangerAt(index * 250));
    expect(Math.min(...values)).toBeLessThan(0.2);
    expect(Math.max(...values)).toBeGreaterThan(0.8);
  });
});
