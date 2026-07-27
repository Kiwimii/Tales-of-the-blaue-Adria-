import { describe, expect, it } from 'vitest';
import { WORLD_RECOVERY_DELAYS_MS, encounterJustClosed } from '../src/game/worldControlRecovery';

describe('world control recovery', () => {
  it('runs only when an encounter overlay actually closes', () => {
    expect(encounterJustClosed('gundula-entry', null)).toBe(true);
    expect(encounterJustClosed('gundula-entry', 'gundula-entry')).toBe(false);
    expect(encounterJustClosed(null, 'gundula-entry')).toBe(false);
    expect(encounterJustClosed(null, null)).toBe(false);
  });

  it('repeats recovery after the React overlay and pointer cycle have settled', () => {
    expect(WORLD_RECOVERY_DELAYS_MS).toEqual([60, 180]);
    expect(WORLD_RECOVERY_DELAYS_MS[1]).toBeGreaterThan(WORLD_RECOVERY_DELAYS_MS[0]);
  });
});
