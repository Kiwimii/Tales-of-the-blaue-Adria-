import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  ARRIVAL_STORY_PLACEMENTS,
  FRIEND_CAMP_CENTER,
  FRIEND_TENT_IDS,
  OBJECT_PLACEMENTS,
  TAUCHER_CAR_POSITION,
} from '../src/game/aerialCampgroundPlan';
import { validateArrivalLayout } from '../src/game/arrivalLayout';
import { AUTHORITY_APPEARANCE } from '../src/game/authorityAppearance';
import { RELATIONSHIP_CHARACTERS } from '../src/game/content';
import { INTERACTION_ACCESS_PATHS } from '../src/game/interactionAccessPlan';
import { applySprint89CampPlan } from '../src/game/sprint89CampPlan';

applySprint89CampPlan();
const root = resolve(fileURLToPath(new URL('..', import.meta.url)));

describe('Sprint 89 experience', () => {
  it('keeps the right mobile half invisible but pointer-active', () => {
    const css = readFileSync(resolve(root, 'src/mobileInvisibleAction.css'), 'utf8');
    expect(css).toContain('.mobile-action-zone');
    expect(css).toMatch(/\.mobile-action-zone\s*\{[\s\S]*?width:\s*50%/);
    expect(css).toMatch(/\.mobile-action-zone\s*\{[\s\S]*?height:\s*100%/);
    expect(css).toMatch(/\.mobile-action-zone\s*\{[\s\S]*?background-color:\s*transparent/);
    expect(css).toMatch(/\.mobile-action-zone\s*\{[\s\S]*?background-image:\s*none/);
    expect(css).not.toContain('pointer-events: none');
    expect(css).toContain('.mobile-action-zone > *');
  });

  it('gives Gundula and Uli their requested grim silhouettes', () => {
    expect(AUTHORITY_APPEARANCE.gundula).toMatchObject({
      hairStyle: 'spiky-white', accessory: 'brille', outfit: 'strict-jacket', expression: 'grim',
    });
    expect(AUTHORITY_APPEARANCE.uli).toMatchObject({
      hairStyle: 'bald', accessory: 'keins', outfit: 'tank-top', expression: 'grim', bodyType: 'breit',
    });
    expect(RELATIONSHIP_CHARACTERS.find((character) => character.id === 'gundula')?.line).toContain('Klemmbrett');
    expect(RELATIONSHIP_CHARACTERS.find((character) => character.id === 'uli')?.line).toContain('Nein');

    const source = readFileSync(resolve(root, 'src/game/scenes/BootScene.ts'), 'utf8');
    expect(source).toContain("hairStyle === 'spiky-white'");
    expect(source).toContain("hairStyle === 'bald'");
    expect(source).toContain("outfit === 'tank-top'");
    expect(source).toContain("expression === 'grim'");
  });

  it('forms a walkable five-tent ring around the shared centre', () => {
    expect(validateArrivalLayout()).toEqual([]);
    const rectangles = FRIEND_TENT_IDS.map((id) => ({ id, ...bounds(OBJECT_PLACEMENTS[id]) }));
    for (let index = 0; index < rectangles.length; index += 1) {
      for (const other of rectangles.slice(index + 1)) {
        expect(rectangleDistance(rectangles[index], other), `${rectangles[index].id}/${other.id}`).toBeGreaterThanOrEqual(42);
      }
    }
    const centreClearance = Math.min(...rectangles.map((rectangle) => pointToBoundsDistance(FRIEND_CAMP_CENTER, rectangle)));
    expect(centreClearance).toBeGreaterThanOrEqual(72);
  });

  it('provides horizontal and vertical routes through the tent circle', () => {
    const horizontal = INTERACTION_ACCESS_PATHS.filter((path) => path.from.y === path.to.y);
    const vertical = INTERACTION_ACCESS_PATHS.filter((path) => path.from.x === path.to.x);
    expect(horizontal.some((path) => path.id === 'tent-circle-west-entry')).toBe(true);
    expect(horizontal.some((path) => path.id === 'tent-circle-east-service')).toBe(true);
    expect(vertical.some((path) => path.id === 'tent-circle-south-gap')).toBe(true);
    expect(INTERACTION_ACCESS_PATHS.every((path) => path.width >= 32)).toBe(true);
  });

  it('places unloading supplies in a logical car-to-power chain', () => {
    const { powerBox, drinks, tents, cable, firstBeer } = ARRIVAL_STORY_PLACEMENTS;
    expect(distance(TAUCHER_CAR_POSITION, drinks)).toBeLessThanOrEqual(145);
    expect(distance(TAUCHER_CAR_POSITION, cable)).toBeLessThanOrEqual(120);
    expect(distance(cable, powerBox)).toBeLessThanOrEqual(105);
    expect(distance(TAUCHER_CAR_POSITION, tents)).toBeLessThanOrEqual(210);
    expect(distance(drinks, firstBeer)).toBeLessThanOrEqual(90);
    expect(cable.x).toBeGreaterThan(drinks.x);
    expect(powerBox.x).toBeGreaterThan(cable.x);
  });
});

function bounds(placement: { x: number; y: number; width?: number; height?: number }) {
  return { x: placement.x, y: placement.y, width: placement.width ?? 1, height: placement.height ?? 1 };
}

function rectangleDistance(a: ReturnType<typeof bounds>, b: ReturnType<typeof bounds>): number {
  const dx = Math.max(b.x - (a.x + a.width), a.x - (b.x + b.width), 0);
  const dy = Math.max(b.y - (a.y + a.height), a.y - (b.y + b.height), 0);
  return Math.hypot(dx, dy);
}

function pointToBoundsDistance(point: { x: number; y: number }, rectangle: ReturnType<typeof bounds>): number {
  const dx = Math.max(rectangle.x - point.x, 0, point.x - (rectangle.x + rectangle.width));
  const dy = Math.max(rectangle.y - point.y, 0, point.y - (rectangle.y + rectangle.height));
  return Math.hypot(dx, dy);
}

function distance(a: { x: number; y: number }, b: { x: number; y: number }): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}
