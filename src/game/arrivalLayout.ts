import {
  ENTRANCE_PLACEMENTS,
  FRIEND_CAMP_CENTER,
  FRIEND_TENT_ENTRY_POINTS,
  FRIEND_TENT_IDS,
  NPC_PLACEMENTS,
  OBJECT_PLACEMENTS,
  TAUCHER_PITCH_BOUNDS,
  type Placement,
  type PlanPoint,
} from './aerialCampgroundPlan';
import { applySprint89CampPlan } from './sprint89CampPlan';
import type { ExpandedWorldObject } from './worldV2';

applySprint89CampPlan();

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
  applySprint89CampPlan();
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
  const tents = FRIEND_TENT_IDS.map((id) => ({ id, placement: OBJECT_PLACEMENTS[id] }));

  for (const tent of tents) {
    if (!tent.placement) {
      errors.push(`Missing tent placement: ${tent.id}`);
      continue;
    }
    const width = tent.placement.width ?? 135;
    const height = tent.placement.height ?? 110;
    if (!insidePitch(tent.placement.x, tent.placement.y, width, height)) errors.push(`Tent outside Taucherplatz: ${tent.id}`);
  }

  for (let index = 0; index < tents.length; index += 1) {
    const first = tents[index];
    const firstBounds = bounds(first.placement);
    const firstCenter = center(first.placement);
    const radius = distance(firstCenter, FRIEND_CAMP_CENTER);
    if (radius < 150 || radius > 360) errors.push(`Tent is not placed on the shared circle: ${first.id}.`);

    for (const second of tents.slice(index + 1)) {
      const secondBounds = bounds(second.placement);
      if (rectanglesOverlap(firstBounds, secondBounds)) errors.push(`Tents overlap: ${first.id} / ${second.id}`);
      const clearance = rectangleDistance(firstBounds, secondBounds);
      if (clearance < 42) errors.push(`Walking gap is too narrow between ${first.id} and ${second.id}: ${clearance.toFixed(1)} px.`);
    }
  }

  const sortedAngles = tents
    .map(({ id, placement }) => ({ id, angle: Math.atan2(center(placement).y - FRIEND_CAMP_CENTER.y, center(placement).x - FRIEND_CAMP_CENTER.x) }))
    .sort((left, right) => left.angle - right.angle);
  for (let index = 0; index < sortedAngles.length; index += 1) {
    const current = sortedAngles[index];
    const following = sortedAngles[(index + 1) % sortedAngles.length];
    const angularGap = index === sortedAngles.length - 1 ? following.angle + Math.PI * 2 - current.angle : following.angle - current.angle;
    if (angularGap < 0.5) errors.push(`Tent circle is cramped after ${current.id}.`);
  }

  const centerClearance = Math.min(...tents.map(({ placement }) => pointToBoundsDistance(FRIEND_CAMP_CENTER, bounds(placement))));
  if (centerClearance < 72) errors.push(`The shared centre leaves only ${centerClearance.toFixed(1)} px of free space.`);

  const homeDoor = ENTRANCE_PLACEMENTS['home-door'];
  if (!homeDoor || !insidePitch(homeDoor.x, homeDoor.y, 1, 1)) errors.push('Home entrance is not on the Taucherplatz.');
  if (homeDoor && distance(homeDoor, FRIEND_TENT_ENTRY_POINTS['home-tent']) > 4) errors.push('Home entrance is detached from the inward-facing player tent entry.');

  const friendByTent = {
    'tent-andre': 'andre',
    'tent-rene': 'rene',
    'tent-lars': 'lars',
    'tent-danny': 'danny',
  } as const;
  for (const [tentId, friendId] of Object.entries(friendByTent)) {
    const npc = NPC_PLACEMENTS[friendId];
    const entry = FRIEND_TENT_ENTRY_POINTS[tentId as keyof typeof FRIEND_TENT_ENTRY_POINTS];
    if (!npc || !insidePitch(npc.x, npc.y, 1, 1)) errors.push(`Friend is not positioned at the Taucherplatz: ${friendId}`);
    if (npc && distance(npc, entry) > 36) errors.push(`${friendId} is not standing at the inward entrance of their own tent.`);
  }

  return errors;
}

function insidePitch(x: number, y: number, width: number, height: number): boolean {
  return x >= TAUCHER_PITCH_BOUNDS.x
    && y >= TAUCHER_PITCH_BOUNDS.y
    && x + width <= TAUCHER_PITCH_BOUNDS.x + TAUCHER_PITCH_BOUNDS.width
    && y + height <= TAUCHER_PITCH_BOUNDS.y + TAUCHER_PITCH_BOUNDS.height;
}

function bounds(placement: Placement): { x: number; y: number; width: number; height: number } {
  return { x: placement.x, y: placement.y, width: placement.width ?? 135, height: placement.height ?? 110 };
}

function center(placement: Placement): PlanPoint {
  return { x: placement.x + (placement.width ?? 135) / 2, y: placement.y + (placement.height ?? 110) / 2 };
}

function rectanglesOverlap(
  a: { x: number; y: number; width: number; height: number },
  b: { x: number; y: number; width: number; height: number },
): boolean {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}

function rectangleDistance(
  a: { x: number; y: number; width: number; height: number },
  b: { x: number; y: number; width: number; height: number },
): number {
  const dx = Math.max(b.x - (a.x + a.width), a.x - (b.x + b.width), 0);
  const dy = Math.max(b.y - (a.y + a.height), a.y - (b.y + b.height), 0);
  return Math.hypot(dx, dy);
}

function pointToBoundsDistance(point: PlanPoint, rectangle: { x: number; y: number; width: number; height: number }): number {
  const dx = Math.max(rectangle.x - point.x, 0, point.x - (rectangle.x + rectangle.width));
  const dy = Math.max(rectangle.y - point.y, 0, point.y - (rectangle.y + rectangle.height));
  return Math.hypot(dx, dy);
}

function distance(a: PlanPoint, b: PlanPoint): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}
