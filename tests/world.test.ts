import { describe, expect, it } from 'vitest';
import { FRIEND_IDS, RELATIONSHIP_CHARACTERS } from '../src/game/content';
import { INTERIORS, WORLD_ENTRANCES, WORLD_NPCS, WORLD_OBJECTS } from '../src/game/world';

describe('data-driven campsite world', () => {
  it('keeps every world object and entrance uniquely addressable', () => {
    const ids = [...WORLD_OBJECTS.map((entry) => entry.id), ...WORLD_ENTRANCES.map((entry) => entry.id)];
    expect(new Set(ids).size).toBe(ids.length);
    expect(WORLD_OBJECTS.filter((entry) => entry.solid !== false).length).toBeGreaterThan(20);
  });

  it('has a real interior behind every mapped entrance', () => {
    for (const entrance of WORLD_ENTRANCES) {
      expect(INTERIORS[entrance.interiorId]).toBeDefined();
    }
    expect(new Set(WORLD_ENTRANCES.map((entry) => entry.interiorId)).size).toBe(4);
  });

  it('places the complete friend group and every placed NPC has relationship content', () => {
    const placed = new Set(WORLD_NPCS.map((entry) => entry.id));
    const content = new Set(RELATIONSHIP_CHARACTERS.map((entry) => entry.id));
    FRIEND_IDS.forEach((id) => expect(placed.has(id)).toBe(true));
    WORLD_NPCS.forEach((npc) => expect(content.has(npc.id)).toBe(true));
    expect(FRIEND_IDS).toHaveLength(9);
  });
});
