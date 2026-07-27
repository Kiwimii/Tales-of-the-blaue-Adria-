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
  x: 930,
  y: 1040,
  width: 155,
  height: 120,
  label: 'DEIN ZELT',
  color: 0x6c8fc9,
  solid: true,
};

let applied = false;

export function applyArrivalLayout(): void {
  if (applied) return;
  Object.assign(TAUCHER_TENT, { x: 930, y: 1040, width: 155, height: 120 });
  applied = true;
}

export function validateArrivalLayout(): string[] {
  applyArrivalLayout();
  const errors: string[] = [];
  const friendTentIds = ['tent-andre', 'tent-rene', 'tent-lars', 'tent-danny'];
  const friendTents = friendTentIds.map((id) => OBJECT_PLACEMENTS[id]);

  if (!insidePitch(TAUCHER_TENT.x, TAUCHER_TENT.y, TAUCHER_TENT.width, TAUCHER_TENT.height)) {
    errors.push('Player tent is outside the Taucherplatz pitch.');
  }

  for (const [index, tent] of friendTents.entries()) {
    if (!tent) {
      errors.push(`Missing friend tent placement: ${friendTentIds[index]}`);
      continue;
    }
    const width = tent.width ?? 140;
    const height = tent.height ?? 110;
    if (!insidePitch(tent.x, tent.y, width, height)) errors.push(`Friend tent outside Taucherplatz: ${friendTentIds[index]}`);
    if (rectanglesOverlap(TAUCHER_TENT, { x: tent.x, y: tent.y, width, height })) {
      errors.push(`Friend tent overlaps player tent: ${friendTentIds[index]}`);
    }
  }

  const sorted = friendTents.filter(Boolean).map((tent) => tent.x).sort((a, b) => a - b);
  for (let index = 1; index < sorted.length; index += 1) {
    const gap = sorted[index] - sorted[index - 1];
    if (gap < 125) errors.push('Friend tents overlap.');
    if (gap > 180) errors.push('Friend tents are no longer a coherent group.');
  }

  const homeDoor = ENTRANCE_PLACEMENTS['home-door'];
  if (!homeDoor || !insidePitch(homeDoor.x, homeDoor.y, 1, 1)) errors.push('Home entrance is not on the Taucherplatz.');

  for (const id of ['andre', 'rene', 'lars', 'danny']) {
    const npc = NPC_PLACEMENTS[id];
    if (!npc || !insidePitch(npc.x, npc.y, 1, 1)) errors.push(`Friend is not positioned at the Taucherplatz: ${id}`);
  }

  return errors;
}

function insidePitch(x: number, y: number, width: number, height: number): boolean {
  return x >= TAUCHER_PITCH_BOUNDS.x
    && y >= TAUCHER_PITCH_BOUNDS.y
    && x + width <= TAUCHER_PITCH_BOUNDS.x + TAUCHER_PITCH_BOUNDS.width
    && y + height <= TAUCHER_PITCH_BOUNDS.y + TAUCHER_PITCH_BOUNDS.height;
}

function rectanglesOverlap(
  a: { x: number; y: number; width: number; height: number },
  b: { x: number; y: number; width: number; height: number },
): boolean {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}
