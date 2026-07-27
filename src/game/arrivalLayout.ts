import {
  ENTRANCE_PLACEMENTS,
  NPC_PLACEMENTS,
  OBJECT_PLACEMENTS,
  TAUCHER_PITCH_BOUNDS,
} from './aerialCampgroundPlan';
import type { ExpandedWorldObject } from './worldV2';

export const TAUCHER_TENT: ExpandedWorldObject = {
  id: 'arrival-home-tent',
  kind: 'tent',
  regionId: 'central',
  x: OBJECT_PLACEMENTS['home-tent'].x,
  y: OBJECT_PLACEMENTS['home-tent'].y,
  width: OBJECT_PLACEMENTS['home-tent'].width ?? 145,
  height: OBJECT_PLACEMENTS['home-tent'].height ?? 120,
  label: 'DEIN ZELT',
  color: 0x6c8fc9,
  solid: true,
};

let applied = false;

export function applyArrivalLayout(): void {
  if (applied) return;
  const placement = OBJECT_PLACEMENTS['home-tent'];
  Object.assign(TAUCHER_TENT, {
    x: placement.x,
    y: placement.y,
    width: placement.width ?? 145,
    height: placement.height ?? 120,
  });
  applied = true;
}

export function validateArrivalLayout(): string[] {
  applyArrivalLayout();
  const errors: string[] = [];
  const tentIds = ['home-tent', 'tent-andre', 'tent-rene', 'tent-lars', 'tent-danny'];
  const tents = tentIds.map((id) => ({ id, placement: OBJECT_PLACEMENTS[id] }));

  for (const tent of tents) {
    if (!tent.placement) {
      errors.push(`Missing tent placement: ${tent.id}`);
      continue;
    }
    const width = tent.placement.width ?? 135;
    const height = tent.placement.height ?? 110;
    if (!insidePitch(tent.placement.x, tent.placement.y, width, height)) errors.push(`Tent outside Taucherplatz: ${tent.id}`);
  }

  const valid = tents.filter((tent) => Boolean(tent.placement));
  const rowY = valid[0]?.placement.y;
  if (valid.some((tent) => Math.abs(tent.placement.y - rowY) > 4)) errors.push('Tents are not aligned in one coherent row.');

  for (let index = 0; index < valid.length; index += 1) {
    const first = valid[index];
    const firstBounds = bounds(first.placement);
    for (const second of valid.slice(index + 1)) {
      if (rectanglesOverlap(firstBounds, bounds(second.placement))) errors.push(`Tents overlap: ${first.id} / ${second.id}`);
    }
    if (index === 0) continue;
    const previous = valid[index - 1];
    const previousEnd = previous.placement.x + (previous.placement.width ?? 135);
    const gap = first.placement.x - previousEnd;
    if (gap < 8) errors.push(`Tent gap is too narrow before ${first.id}.`);
    if (gap > 25) errors.push(`Tent row breaks apart before ${first.id}.`);
  }

  const homeDoor = ENTRANCE_PLACEMENTS['home-door'];
  const home = OBJECT_PLACEMENTS['home-tent'];
  if (!homeDoor || !insidePitch(homeDoor.x, homeDoor.y, 1, 1)) errors.push('Home entrance is not on the Taucherplatz.');
  if (homeDoor && home) {
    const horizontal = homeDoor.x >= home.x && homeDoor.x <= home.x + (home.width ?? 145);
    const inFront = homeDoor.y >= home.y + (home.height ?? 120) - 10 && homeDoor.y <= home.y + (home.height ?? 120) + 35;
    if (!horizontal || !inFront) errors.push('Home entrance is not positioned in front of the player tent.');
  }

  const friendIds = ['andre', 'rene', 'lars', 'danny'];
  friendIds.forEach((id) => {
    const npc = NPC_PLACEMENTS[id];
    const tent = OBJECT_PLACEMENTS[`tent-${id}`];
    if (!npc || !insidePitch(npc.x, npc.y, 1, 1)) errors.push(`Friend is not positioned at the Taucherplatz: ${id}`);
    if (npc && tent) {
      const center = tent.x + (tent.width ?? 135) / 2;
      const inFront = npc.y >= tent.y + (tent.height ?? 105) && npc.y <= tent.y + (tent.height ?? 105) + 85;
      if (Math.abs(npc.x - center) > 45 || !inFront) errors.push(`${id} is not standing in front of their own tent.`);
    }
  });

  return errors;
}

function insidePitch(x: number, y: number, width: number, height: number): boolean {
  return x >= TAUCHER_PITCH_BOUNDS.x
    && y >= TAUCHER_PITCH_BOUNDS.y
    && x + width <= TAUCHER_PITCH_BOUNDS.x + TAUCHER_PITCH_BOUNDS.width
    && y + height <= TAUCHER_PITCH_BOUNDS.y + TAUCHER_PITCH_BOUNDS.height;
}

function bounds(placement: { x: number; y: number; width?: number; height?: number }): { x: number; y: number; width: number; height: number } {
  return { x: placement.x, y: placement.y, width: placement.width ?? 135, height: placement.height ?? 110 };
}

function rectanglesOverlap(
  a: { x: number; y: number; width: number; height: number },
  b: { x: number; y: number; width: number; height: number },
): boolean {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}
