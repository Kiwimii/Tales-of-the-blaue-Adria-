import { describe, expect, it } from 'vitest';
import { CHARACTER_DESIGNS, LPC_LAYERS, LPC_REVISION, validateLpcTestContent } from './content';

describe('LPC character test content', () => {
  it('contains six strongly differentiated characters', () => {
    expect(CHARACTER_DESIGNS).toHaveLength(6);
    expect(new Set(CHARACTER_DESIGNS.map((character) => character.hairStyle)).size).toBe(6);
    expect(new Set(CHARACTER_DESIGNS.map((character) => character.outfit)).size).toBe(6);
    expect(validateLpcTestContent()).toEqual([]);
  });

  it('pins every external LPC layer to one source revision', () => {
    expect(LPC_REVISION).toMatch(/^[0-9a-f]{40}$/);
    for (const url of Object.values(LPC_LAYERS)) {
      expect(url).toContain(LPC_REVISION);
      expect(url).toMatch(/^https:\/\/raw\.githubusercontent\.com\//);
    }
  });
});
