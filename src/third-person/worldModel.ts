import {
  AERIAL_FENCE_SEGMENTS,
  AERIAL_WATER_POLYGONS,
  ARRIVAL_CAR_POSITION,
  BEACH_GATE,
  OBJECT_PLACEMENTS,
  TAUCHER_CAR_POSITION,
  type Placement,
  type PlanPoint,
} from '../game/aerialCampgroundPlan';
import { colliderFromCenter, type AabbCollider, type MovementBounds } from './collision';

export const WORLD_SCALE = 0.012;
export const PLAN_CENTER = { x: 1300, y: 900 } as const;
export const WORLD_BOUNDS: MovementBounds = {
  minX: (0 - PLAN_CENTER.x) * WORLD_SCALE,
  maxX: (2600 - PLAN_CENTER.x) * WORLD_SCALE,
  minZ: (0 - PLAN_CENTER.y) * WORLD_SCALE,
  maxZ: (1800 - PLAN_CENTER.y) * WORLD_SCALE,
};

export function planToWorld(point: PlanPoint): { x: number; z: number } {
  return {
    x: (point.x - PLAN_CENTER.x) * WORLD_SCALE,
    z: (point.y - PLAN_CENTER.y) * WORLD_SCALE,
  };
}

export function worldToPlan(point: { x: number; z: number }): PlanPoint {
  return {
    x: point.x / WORLD_SCALE + PLAN_CENTER.x,
    y: point.z / WORLD_SCALE + PLAN_CENTER.y,
  };
}

export function createStaticColliders(): AabbCollider[] {
  const objects = Object.entries(OBJECT_PLACEMENTS).flatMap(([id, placement]) => {
    if (!placement.width || !placement.height || isDecorative(id)) return [];
    const footprint = objectFootprint(id, placement);
    const center = planToWorld({
      x: placement.x + placement.width / 2,
      y: placement.y + placement.height / 2,
    });
    return [colliderFromCenter(
      `object:${id}`,
      center.x,
      center.z,
      footprint.width * WORLD_SCALE,
      footprint.depth * WORLD_SCALE,
      footprint.height,
      footprint.height > 0.8,
    )];
  });

  const fences = AERIAL_FENCE_SEGMENTS.map((fence) => {
    const center = planToWorld({ x: fence.x + fence.width / 2, y: fence.y + fence.height / 2 });
    return colliderFromCenter(
      `fence:${fence.id}`,
      center.x,
      center.z,
      fence.width * WORLD_SCALE,
      fence.height * WORLD_SCALE,
      1.15,
    );
  });

  const water = AERIAL_WATER_POLYGONS.map((polygon) => {
    const xs = polygon.points.map((point) => point.x);
    const ys = polygon.points.map((point) => point.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const center = planToWorld({ x: (minX + maxX) / 2, y: (minY + maxY) / 2 });
    return colliderFromCenter(
      `water:${polygon.id}`,
      center.x,
      center.z,
      (maxX - minX) * WORLD_SCALE,
      (maxY - minY) * WORLD_SCALE,
      0,
      false,
    );
  });

  const cars = [
    ['arrival', ARRIVAL_CAR_POSITION, 1.85, 0.92],
    ['taucher', TAUCHER_CAR_POSITION, 0.92, 1.85],
  ] as const;
  const carColliders = cars.map(([id, point, width, depth]) => {
    const center = planToWorld(point);
    return colliderFromCenter(`car:${id}`, center.x, center.z, width, depth, 1.25);
  });

  return [...objects, ...fences, ...water, ...carColliders];
}

export function createGateCollider(): AabbCollider {
  const center = planToWorld({ x: 900, y: 1400 });
  return colliderFromCenter('story:arrival-gate', center.x, center.z, 86 * WORLD_SCALE, 20 * WORLD_SCALE, 1.35);
}

export function createBeachGatePosts(): AabbCollider[] {
  const north = planToWorld({ x: BEACH_GATE.x + BEACH_GATE.width / 2, y: BEACH_GATE.y - 12 });
  const south = planToWorld({ x: BEACH_GATE.x + BEACH_GATE.width / 2, y: BEACH_GATE.y + BEACH_GATE.height + 12 });
  return [
    colliderFromCenter('beach-gate:north', north.x, north.z, 0.28, 0.28, 1.1),
    colliderFromCenter('beach-gate:south', south.x, south.z, 0.28, 0.28, 1.1),
  ];
}

export function distanceInWorld(a: PlanPoint, b: { x: number; z: number }): number {
  const world = planToWorld(a);
  return Math.hypot(world.x - b.x, world.z - b.z);
}

function objectFootprint(id: string, placement: Placement): { width: number; depth: number; height: number } {
  const width = placement.width ?? 30;
  const depth = placement.height ?? 30;
  if (id.includes('tree')) return { width: width * 0.28, depth: depth * 0.28, height: 2.6 };
  if (id.includes('lantern') || id.includes('sign')) return { width: Math.min(width, 28), depth: Math.min(depth, 28), height: 1.25 };
  if (id.includes('tent')) return { width: width * 0.74, depth: depth * 0.7, height: 1.35 };
  if (id.includes('camper')) return { width: width * 0.9, depth: depth * 0.82, height: 1.75 };
  if (id.includes('rock')) return { width: width * 0.7, depth: depth * 0.7, height: 0.7 };
  if (id.includes('bench') || id.includes('table')) return { width: width * 0.82, depth: depth * 0.82, height: 0.72 };
  if (id.includes('dock')) return { width: width * 0.95, depth: depth * 0.75, height: 0.25 };
  return { width: width * 0.88, depth: depth * 0.82, height: isBuilding(id) ? 2.2 : 1.1 };
}

function isBuilding(id: string): boolean {
  return ['reception', 'sanitary', 'clubhouse', 'party', 'lifeguard', 'kiosk', 'workshop', 'wood-shed', 'shelter', 'stage'].some((part) => id.includes(part));
}

function isDecorative(id: string): boolean {
  return id.includes('flowerbed') || id.includes('fence') || id === 'north-fence';
}
