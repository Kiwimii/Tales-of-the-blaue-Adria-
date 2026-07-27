import { ARRIVAL_POSITIONS } from './arrivalQuest';
import { TAUCHER_TENT } from './arrivalLayout';
import {
  AERIAL_FENCE_SEGMENTS,
  AERIAL_NODES,
  AERIAL_REGION_LAYOUT,
  AERIAL_ROADS,
  AERIAL_SITE_POLYGONS,
  AERIAL_WATER_POLYGONS,
  ARRIVAL_STORY_PLACEMENTS,
  BEACH_GATE,
  ENTRANCE_PLACEMENTS,
  LANDMARK_PLACEMENTS,
  NPC_PLACEMENTS,
  OBJECT_PLACEMENTS,
  TAUCHER_PITCH_BOUNDS,
  type AerialNodeId,
  type Placement,
  type PlanPoint,
  type PlanRoad,
  pointInPolygon,
} from './aerialCampgroundPlan';
import {
  EXPANDED_ENTRANCES,
  EXPANDED_NPCS,
  EXPANDED_WORLD_OBJECTS,
  LANDMARKS,
  WORLD_REGIONS,
  type Bounds,
  type ExpandedWorldObject,
  type RegionId,
} from './worldV2';
import { CAMPFIRE_POSITION, collisionFootprint } from './worldRealism';

export interface BlueprintZone {
  id: string;
  regionId: RegionId;
  label: string;
  bounds: Bounds;
  ground: number;
  border: number;
}

export type BlueprintPoint = PlanPoint;
export type BlueprintRoad = PlanRoad;
export type BlueprintNodeId = AerialNodeId;

export const BLUEPRINT_GRID = 10;
export const BLUEPRINT_NODES = AERIAL_NODES;
export const BLUEPRINT_ROADS = AERIAL_ROADS;
export const BLUEPRINT_FENCES = AERIAL_FENCE_SEGMENTS;
export const BLUEPRINT_BEACH_GATE = BEACH_GATE;
export const BLUEPRINT_SITE_POLYGONS = AERIAL_SITE_POLYGONS;
export const BLUEPRINT_WATER_POLYGONS = AERIAL_WATER_POLYGONS;
export { TAUCHER_PITCH_BOUNDS };

const REGION_STYLE: Record<RegionId, { label: string; ground: number; border: number }> = {
  arrival: { label: 'ZUFAHRT · PARKPLATZ · ANMELDUNG', ground: 0x748175, border: 0xc4b98b },
  north: { label: 'OBERE CAMPINGREIHEN', ground: 0x698c59, border: 0x9fbd7f },
  central: { label: 'CAMPINGPLATZ · TAUCHERPLATZ', ground: 0x70945f, border: 0xa8c47e },
  festival: { label: 'FESTWIESE', ground: 0x7d9457, border: 0xd0b36a },
  woodland: { label: 'SERVICE UND WALDSAUM', ground: 0x4f7652, border: 0x86a979 },
  beach: { label: 'STRAND', ground: 0xd8c487, border: 0xf2dfaa },
  cove: { label: 'SÜDLICHE BUCHT', ground: 0x557d61, border: 0x9ab58f },
};

export const BLUEPRINT_ZONES: BlueprintZone[] = (Object.keys(AERIAL_REGION_LAYOUT) as RegionId[]).map((regionId) => ({
  id: regionId,
  regionId,
  label: REGION_STYLE[regionId].label,
  bounds: { ...AERIAL_REGION_LAYOUT[regionId] },
  ground: REGION_STYLE[regionId].ground,
  border: REGION_STYLE[regionId].border,
}));

let applied = false;

export function applyCampgroundBlueprint(): void {
  if (applied) return;

  for (const region of WORLD_REGIONS) {
    Object.assign(region.bounds, AERIAL_REGION_LAYOUT[region.id]);
    if (region.id === 'arrival') {
      region.title = 'Zufahrt, Parkplatz & Anmeldung';
      region.subtitle = 'Anfahrt von Nordosten, Schranke und Anmeldung direkt am Eingang';
    }
    if (region.id === 'central') {
      region.title = 'Campingplatz & Taucherplatz';
      region.subtitle = 'Parzellen, Freundeszeltgruppe und Taucherplatz oberhalb des Strandkiosks';
    }
    if (region.id === 'beach') {
      region.title = 'Strand der Blauen Adria';
      region.subtitle = 'Vom Campingplatz durch Zaun und mittiges Strandtor getrennt';
    }
  }

  applyPlacements(EXPANDED_WORLD_OBJECTS, OBJECT_PLACEMENTS);
  applyPlacements(EXPANDED_NPCS, NPC_PLACEMENTS);
  applyPlacements(EXPANDED_ENTRANCES, ENTRANCE_PLACEMENTS);
  applyPlacements(LANDMARKS, LANDMARK_PLACEMENTS);

  const legacyHomeTent = EXPANDED_WORLD_OBJECTS.find((object) => object.id === 'home-tent');
  if (legacyHomeTent) {
    Object.assign(legacyHomeTent, {
      kind: 'flowerbed',
      x: 1540,
      y: 1345,
      width: 1,
      height: 1,
      label: undefined,
      solid: false,
    });
  }

  Object.assign(CAMPFIRE_POSITION as unknown as { x: number; y: number; safeRadius: number }, {
    ...LANDMARK_PLACEMENTS.campfire,
    safeRadius: 68,
  });

  Object.assign(TAUCHER_TENT, {
    x: 930,
    y: 1040,
    width: 155,
    height: 120,
  });

  const arrival = ARRIVAL_POSITIONS as unknown as Record<string, PlanPoint>;
  for (const [id, placement] of Object.entries(ARRIVAL_STORY_PLACEMENTS)) {
    if (arrival[id]) Object.assign(arrival[id], placement);
  }

  applied = true;
}

function applyPlacements<T extends { id: string; x: number; y: number }>(items: T[], placements: Record<string, Placement>): void {
  for (const item of items) {
    const placement = placements[item.id];
    if (placement) Object.assign(item, placement);
  }
}

export function blueprintRoadBounds(road: BlueprintRoad): Bounds {
  const from = BLUEPRINT_NODES[road.from];
  const to = BLUEPRINT_NODES[road.to];
  const half = road.width / 2;
  return {
    x: Math.min(from.x, to.x) - half,
    y: Math.min(from.y, to.y) - half,
    width: Math.abs(to.x - from.x) + road.width,
    height: Math.abs(to.y - from.y) + road.width,
  };
}

export function blueprintPlacement(id: string): BlueprintPoint | null {
  const placement = OBJECT_PLACEMENTS[id]
    ?? NPC_PLACEMENTS[id]
    ?? ENTRANCE_PLACEMENTS[id]
    ?? LANDMARK_PLACEMENTS[id]
    ?? (ARRIVAL_STORY_PLACEMENTS as Record<string, PlanPoint>)[id];
  return placement ? { x: placement.x, y: placement.y } : null;
}

export function validateCampgroundBlueprint(): string[] {
  applyCampgroundBlueprint();
  const errors: string[] = [];
  validateConnectedRoadGraph(errors);
  validateGeographicRelations(errors);
  validatePlacements(errors);
  validateEntrances(errors);
  return [...new Set(errors)];
}

function validateConnectedRoadGraph(errors: string[]): void {
  const connected = new Set<BlueprintNodeId>(['entrance']);
  let changed = true;
  while (changed) {
    changed = false;
    for (const road of BLUEPRINT_ROADS) {
      if (connected.has(road.from) && !connected.has(road.to)) {
        connected.add(road.to);
        changed = true;
      }
      if (connected.has(road.to) && !connected.has(road.from)) {
        connected.add(road.from);
        changed = true;
      }
    }
  }

  for (const [id, node] of Object.entries(BLUEPRINT_NODES) as Array<[BlueprintNodeId, BlueprintPoint]>) {
    if (!connected.has(id)) errors.push(`Disconnected aerial-plan node: ${id}`);
    if (!Number.isFinite(node.x) || !Number.isFinite(node.y)) errors.push(`Invalid aerial-plan node: ${id}`);
  }
  for (const road of BLUEPRINT_ROADS) {
    const from = BLUEPRINT_NODES[road.from];
    const to = BLUEPRINT_NODES[road.to];
    if (pointDistance(from, to) < 55) errors.push(`Road segment is too short: ${road.id}`);
  }
}

function validateGeographicRelations(errors: string[]): void {
  const entrance = BLUEPRINT_NODES.entrance;
  const parking = BLUEPRINT_NODES.parking;
  const gate = BLUEPRINT_NODES.gate;
  const reception = ENTRANCE_PLACEMENTS['reception-door'];
  const taucher = ARRIVAL_STORY_PLACEMENTS.taucherplatz;
  const kiosk = centerOfPlacement(OBJECT_PLACEMENTS['beach-kiosk']);
  const beachPolygon = AERIAL_SITE_POLYGONS.find((area) => area.id === 'main-beach')?.points ?? [];
  const campsitePolygon = AERIAL_SITE_POLYGONS.find((area) => area.id === 'campground-land')?.points ?? [];

  if (!(entrance.x > parking.x && entrance.y < parking.y)) errors.push('Arrival road must enter from the north-east.');
  if (!(parking.x > gate.x && parking.y < gate.y)) errors.push('Parking must sit before the gate.');
  if (!(reception.x < gate.x && Math.abs(reception.y - gate.y) < 120)) errors.push('Reception must sit directly behind and left of the gate.');
  if (!(taucher.x > kiosk.x && taucher.y < kiosk.y)) errors.push('Taucherplatz must sit right and above the beach kiosk.');
  if (!pointInPolygon(taucher, campsitePolygon)) errors.push('Taucherplatz must remain inside the campground fence.');
  if (!pointInPolygon(kiosk, beachPolygon)) errors.push('Beach kiosk must remain on the beach side of the fence.');
  if (BEACH_GATE.y < 900 || BEACH_GATE.y > 1250) errors.push('Beach gate must remain near the middle of the campground-beach fence.');
  if (AERIAL_FENCE_SEGMENTS.some((segment) => overlaps(segment, BEACH_GATE))) errors.push('Beach gate gap is blocked by a fence segment.');
}

function validatePlacements(errors: string[]): void {
  for (const object of EXPANDED_WORLD_OBJECTS) {
    const region = WORLD_REGIONS.find((entry) => entry.id === object.regionId);
    const center = { x: object.x + object.width / 2, y: object.y + object.height / 2 };
    if (!region || !contains(region.bounds, center.x, center.y)) errors.push(`Object outside region: ${object.id}`);
    if (!['building', 'camper', 'party-tent', 'tent'].includes(object.kind)) continue;
    if (['reception', 'home-tent'].includes(object.id)) continue;
    const footprint = collisionFootprint(object);
    for (const road of BLUEPRINT_ROADS) {
      if (roadIntersectsBounds(road, footprint, 4)) errors.push(`${road.id} blocked by object ${object.id}`);
    }
  }

  for (const npc of EXPANDED_NPCS) {
    const region = WORLD_REGIONS.find((entry) => entry.id === npc.regionId);
    if (!region || !contains(region.bounds, npc.x, npc.y)) errors.push(`NPC outside region: ${npc.id}`);
    if (npc.id === 'gundula' || npc.id === 'uli') continue;
    for (const road of BLUEPRINT_ROADS) {
      if (distanceToRoad(npc, road) < road.width / 2 + 12) errors.push(`${road.id} blocked by npc ${npc.id}`);
    }
  }
}

function validateEntrances(errors: string[]): void {
  for (const entrance of EXPANDED_ENTRANCES) {
    const nearestRoad = BLUEPRINT_ROADS.reduce((best, road) => Math.min(best, distanceToRoad(entrance, road)), Number.POSITIVE_INFINITY);
    if (nearestRoad > 115) errors.push(`Entrance lacks aerial-plan access: ${entrance.id}`);
  }
}

function centerOfPlacement(placement: Placement): PlanPoint {
  return {
    x: placement.x + (placement.width ?? 0) / 2,
    y: placement.y + (placement.height ?? 0) / 2,
  };
}

function roadIntersectsBounds(road: BlueprintRoad, bounds: Bounds, padding: number): boolean {
  const center = { x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2 };
  const radius = Math.min(bounds.width, bounds.height) * 0.34;
  return distanceToRoad(center, road) < road.width / 2 + radius + padding;
}

function distanceToRoad(point: PlanPoint, road: BlueprintRoad): number {
  return distanceToSegment(point, BLUEPRINT_NODES[road.from], BLUEPRINT_NODES[road.to]);
}

function distanceToSegment(point: PlanPoint, from: PlanPoint, to: PlanPoint): number {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const lengthSquared = dx * dx + dy * dy;
  if (!lengthSquared) return pointDistance(point, from);
  const t = Math.max(0, Math.min(1, ((point.x - from.x) * dx + (point.y - from.y) * dy) / lengthSquared));
  return pointDistance(point, { x: from.x + t * dx, y: from.y + t * dy });
}

function pointDistance(a: PlanPoint, b: PlanPoint): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function contains(bounds: Bounds, x: number, y: number): boolean {
  return x >= bounds.x && x <= bounds.x + bounds.width && y >= bounds.y && y <= bounds.y + bounds.height;
}

function overlaps(a: Bounds, b: Bounds): boolean {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}

export function blueprintCollisionFootprint(id: string): Bounds | null {
  const object = EXPANDED_WORLD_OBJECTS.find((entry) => entry.id === id) as ExpandedWorldObject | undefined;
  return object ? collisionFootprint(object) : null;
}
