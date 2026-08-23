import { describe, expect, it } from 'vitest';
import { createGateCollider, createStaticColliders, planToWorld, worldToPlan } from '../src/third-person/worldModel';

describe('third-person world model', () => {
  it('maps the canonical plan to 3D and back without drift', () => {
    const source = { x: 900, y: 1400 };
    const world = planToWorld(source);
    expect(worldToPlan(world)).toEqual(source);
  });

  it('derives solid objects, fences and water from canonical map data', () => {
    const colliders = createStaticColliders();
    expect(colliders.some((entry) => entry.id === 'object:reception')).toBe(true);
    expect(colliders.some((entry) => entry.id === 'object:home-tent')).toBe(true);
    expect(colliders.some((entry) => entry.id.startsWith('fence:'))).toBe(true);
    expect(colliders.some((entry) => entry.id === 'water:main-lake')).toBe(true);
    expect(colliders.some((entry) => entry.id === 'car:arrival')).toBe(true);
    expect(new Set(colliders.map((entry) => entry.id)).size).toBe(colliders.length);
  });

  it('keeps the arrival barrier separate so quest progression can open it', () => {
    const staticIds = createStaticColliders().map((entry) => entry.id);
    expect(staticIds).not.toContain('story:arrival-gate');
    expect(createGateCollider().id).toBe('story:arrival-gate');
  });
});
