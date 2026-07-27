import { describe, expect, it } from 'vitest';
import { encounterJustClosed } from '../src/game/worldControlRecovery';

describe('world control recovery', () => {
  it('runs only when an encounter overlay actually closes', () => {
    expect(encounterJustClosed('gundula-entry', null)).toBe(true);
    expect(encounterJustClosed('gundula-entry', 'gundula-entry')).toBe(false);
    expect(encounterJustClosed(null, 'gundula-entry')).toBe(false);
    expect(encounterJustClosed(null, null)).toBe(false);
  });
});
