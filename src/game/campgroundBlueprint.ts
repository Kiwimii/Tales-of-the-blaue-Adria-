import { ARRIVAL_POSITIONS } from './arrivalQuest';
import { TAUCHER_TENT } from './arrivalLayout';
import {
  AERIAL_FENCE_SEGMENTS,
  AERIAL_FUNCTIONAL_AREAS,
  AERIAL_NODES,
  AERIAL_PITCHES,
  AERIAL_REGION_LAYOUT,
  AERIAL_ROADS,
  AERIAL_SITE_POLYGONS,
  AERIAL_WATER_POLYGONS,
  ARRIVAL_STORY_PLACEMENTS,
  BEACH_GATE,
  ENTRANCE_PLACEMENTS,
  LANDMARK_PLACEMENTS,
  NPC_AREA_ASSIGNMENTS,
  NPC_PLACEMENTS,
  OBJECT_AREA_ASSIGNMENTS,
  OBJECT_PLACEMENTS,
  TAUCHER_PITCH_BOUNDS,
  type AerialNodeId,
  type FunctionalAreaId,
  type Placement,
  type PlanPoint,
  type PlanRoad,
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
export const BLUEPRINT_FUNCTIONAL_AREAS = AERIAL_FUNCTIONAL_AREAS;
export { TAUCHER_PITCH_BOUNDS };

const REGION_STYLE: Record<RegionId, { label: string; ground: number; border: number }> = {
  arrival: { label: 'PARKPLATZ · SCHRANKE · REZEPTION', ground: 0x748175, border: 0xc4b98b },
  north: { label: 'ADRIA-KLAUSE · DAUERCAMPER', ground: 0x698c59, border: 0x9fbd7f },
  central: { label: 'SANITÄR · TAUCHERPLATZ', ground: 0x70945f, border: 0xa8c47e },
  festival: { label: 'BÜHNE · FESTWIESE · PARTYZELT', ground: 0x7d9457, border: 0xd0b36a },
  woodland: { label: 'WERKSTATT · SERVICEHOF · WALDSAUM', ground: 0x4f7652, border: 0x86a979 },
  beach: { label: 'WACHE · STRAND · HAUPTSTEG', ground: 0xd8c487, border: 0xf2dfaa },
  cove: { label: 'UNTERSTAND · BUCHT · KLEINER STEG', ground: 0x557d61, border: 0x9ab58f },
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
      region.title = 'Parkplatz, Schranke & Rezeption';
      region.subtitle = 'Gerade Zufahrt von Süden, Parkreihe und Anmeldung rechts neben der Schranke';
    }
    if (region.id === 'north') {
      region.title = 'Nordlager & Adria-Klause';
      region.subtitle = 'Geordnete Dauercamper-Reihen mit gemeinsamer Sitzfläche';
    }
    if (region.id === 'central') {
      region.title = 'Sanitär & Taucherplatz';
      region.subtitle = 'Sanitärreihe, ausgerichtete Freundeszeltgruppe und gemeinsame Feuerstelle';
    }
    if (region.id === 'festival') {
      region.title = 'Festwiese';
      region.subtitle = 'Bühne im Norden, freie Veranstaltungsfläche und Partyzelt im Süden';
    }
    if (region.id === 'woodland') {
      region.title = 'Servicehof & Waldsaum';
      region.subtitle = 'Werkstatt und Holzlager am südlichen Wirtschaftsweg';
    }
    if (region.id === 'beach') {
      region.title = 'Strand der Blauen Adria';
      region.subtitle = 'Wache und Hauptsteg im Norden, Kiosk am südlichen Strandabschnitt';
    }
    if (region.id === 'cove') {
      region.title = 'Versteckte Bucht';
      region.subtitle = 'Ruhiger Unterstand und kleiner Steg am südlichen Seeufer';
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
      x: OBJECT_PLACEMENTS['home-tent'].x,
      y: OBJECT_PLACEMENTS['home-tent'].y,
      width: 1,
      height: 1,
      label: undefined,
      solid: false,
    });
  }

  Object.assign(CAMPFIRE_POSITION as unknown as { x: number; y: number; safeRadius: number }, {
    ...LANDMARK_PLACEMENTS.campfire,
    safeRadius: 62,
  });

  const homeTent = OBJECT_PLACEMENTS['home-tent'];
  Object.assign(TAUCHER_TENT, {
    x: homeTent.x,
    y: homeTent.y,
    width: homeTent.width ?? 145,
    height: homeTent.height ?? 120,
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
  validateOrthogonalGeometry(errors);
  validateGeographicRelations(errors);
  validateFunctionalAssignments(errors);
  validatePlacements(errors);
  validateLogicalGroups(errors);
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
    if (!connected.has(id)) errors.push(`Disconnected blueprint node: ${id}`);
    if (!Number.isFinite(node.x) || !Number.isFinite(node.y)) errors.push(`Invalid blueprint node: ${id}`);
  }
}

function validateOrthogonalGeometry(errors: string[]): void {
  for (const [id, node] of Object.entries(BLUEPRINT_NODES)) {
    if (!onGrid(node.x) || !onGrid(node.y)) errors.push(`Node leaves ${BLUEPRINT_GRID}px planning grid: ${id}`);
  }
  for (const road of BLUEPRINT_ROADS) {
    const from = BLUEPRINT_NODES[road.from];
    const to = BLUEPRINT_NODES[road.to];
    if (from.x !== to.x && from.y !== to.y) errors.push(`Road is not orthogonal: ${road.id}`);
    const minimum = road.id === 'reception-walk' ? 18 : 45;
    if (pointDistance(from, to) < minimum) errors.push(`Road segment is too short: ${road.id}`);
  }
  for (const polygon of [...BLUEPRINT_SITE_POLYGONS, ...BLUEPRINT_WATER_POLYGONS]) {
    for (let index = 0; index < polygon.points.length; index += 1) {
      const from = polygon.points[index];
      const to = polygon.points[(index + 1) % polygon.points.length];
      if (from.x !== to.x && from.y !== to.y) errors.push(`Polygon has diagonal edge: ${polygon.id}`);
    }
  }
}

function validateGeographicRelations(errors: string[]): void {
  const entrance = BLUEPRINT_NODES.entrance;
  const parking = BLUEPRINT_NODES.parkingSouth;
  const gate = BLUEPRINT_NODES.gate;
  const reception = ENTRANCE_PLACEMENTS['reception-door'];
  const taucher = ARRIVAL_STORY_PLACEMENTS.taucherplatz;
  const kiosk = centerOfPlacement(OBJECT_PLACEMENTS['beach-kiosk']);
  const workshop = centerOfPlacement(OBJECT_PLACEMENTS.workshop);
  const woodShed = centerOfPlacement(OBJECT_PLACEMENTS['wood-shed']);

  if (!(entrance.y > parking.y && parking.y > gate.y)) errors.push('Arrival sequence must run north from entrance through parking to gate.');
  if (!(reception.x > gate.x && Math.abs(reception.y - gate.y) < 80)) errors.push('Reception must sit directly east of the gate court.');
  if (!(taucher.y < gate.y && taucher.x < 1400)) errors.push('Taucherplatz must sit north-west of the arrival area.');
  if (!(kiosk.x > BLUEPRINT_BEACH_GATE.x && kiosk.y > BLUEPRINT_BEACH_GATE.y)) errors.push('Beach kiosk must sit south-east of the beach gate.');
  if (!(workshop.y > BLUEPRINT_NODES.serviceWest.y && woodShed.y > BLUEPRINT_NODES.serviceEast.y)) errors.push('Workshop and wood shed must sit south of the service lane.');

  const leftFence = OBJECT_PLACEMENTS['parking-fence-left'];
  const rightFence = OBJECT_PLACEMENTS['parking-fence-right'];
  if (!(leftFence.x < parking.x - 100 && rightFence.x > parking.x + 20)) errors.push('Parking fences must frame the drive without closing it.');
  if (BLUEPRINT_FENCES[0].y + BLUEPRINT_FENCES[0].height !== BLUEPRINT_BEACH_GATE.y) errors.push('North beach fence does not end at the gate.');
  if (BLUEPRINT_FENCES[1].y !== BLUEPRINT_BEACH_GATE.y + BLUEPRINT_BEACH_GATE.height) errors.push('South beach fence does not start after the gate.');
}

function validateFunctionalAssignments(errors: string[]): void {
  for (const [id, placement] of Object.entries(OBJECT_PLACEMENTS)) {
    const areaId = OBJECT_AREA_ASSIGNMENTS[id];
    if (!areaId) {
      errors.push(`Object has no functional area: ${id}`);
      continue;
    }
    const area = BLUEPRINT_FUNCTIONAL_AREAS[areaId];
    if (!contains(area, centerOfPlacement(placement))) errors.push(`Object outside functional area ${areaId}: ${id}`);
  }

  for (const [id, placement] of Object.entries(NPC_PLACEMENTS)) {
    const areaId = NPC_AREA_ASSIGNMENTS[id];
    if (!areaId) {
      errors.push(`NPC has no functional area: ${id}`);
      continue;
    }
    if (!contains(BLUEPRINT_FUNCTIONAL_AREAS[areaId], placement)) errors.push(`NPC outside functional area ${areaId}: ${id}`);
  }
}

function validatePlacements(errors: string[]): void {
  const roadRelevantKinds: ExpandedWorldObject['kind'][] = ['building', 'camper', 'party-tent', 'tent', 'stage', 'kiosk'];
  const roadExemptions: Record<string, string[]> = {
    reception: ['reception-court', 'reception-walk'],
    'main-dock': ['dock-approach'],
    'cove-dock': ['cove-dock-path'],
  };

  for (const object of EXPANDED_WORLD_OBJECTS) {
    const region = WORLD_REGIONS.find((entry) => entry.id === object.regionId);
    const center = { x: object.x + object.width / 2, y: object.y + object.height / 2 };
    if (!region || !contains(region.bounds, center)) errors.push(`Object outside region: ${object.id}`);
    if (!roadRelevantKinds.includes(object.kind) || object.id === 'home-tent') continue;
    const footprint = collisionFootprint(object);
    for (const road of BLUEPRINT_ROADS) {
      if (roadExemptions[object.id]?.includes(road.id)) continue;
      if (roadIntersectsBounds(road, footprint, 2)) errors.push(`${road.id} blocked by object ${object.id}`);
    }
  }

  for (const npc of EXPANDED_NPCS) {
    const region = WORLD_REGIONS.find((entry) => entry.id === npc.regionId);
    if (!region || !contains(region.bounds, npc)) errors.push(`NPC outside region: ${npc.id}`);
    for (const road of BLUEPRINT_ROADS) {
      if (distanceToRoad(npc, road) < road.width / 2 + 8) errors.push(`${road.id} blocked by npc ${npc.id}`);
    }
  }

  const major = EXPANDED_WORLD_OBJECTS.filter((object) => (
    object.solid !== false
    && ['building', 'camper', 'party-tent', 'tent', 'stage', 'kiosk', 'table', 'bench'].includes(object.kind)
    && object.id !== 'home-tent'
  ));
  for (let index = 0; index < major.length; index += 1) {
    for (const other of major.slice(index + 1)) {
      if (major[index].regionId !== other.regionId) continue;
      if (overlaps(expand(collisionFootprint(major[index]), 2), expand(collisionFootprint(other), 2))) {
        errors.push(`Logical objects overlap: ${major[index].id} / ${other.id}`);
      }
    }
  }
}

function validateLogicalGroups(errors: string[]): void {
  const tentIds = ['home-tent', 'tent-andre', 'tent-rene', 'tent-lars', 'tent-danny'];
  const tents = tentIds.map((id) => OBJECT_PLACEMENTS[id]);
  const rowY = tents[0].y;
  if (tents.some((tent) => Math.abs(tent.y - rowY) > 4)) errors.push('Friend tents must form one aligned row.');
  for (let index = 1; index < tents.length; index += 1) {
    const previousEnd = tents[index - 1].x + (tents[index - 1].width ?? 135);
    const gap = tents[index].x - previousEnd;
    if (gap < 8 || gap > 25) errors.push(`Tent row has illogical gap before ${tentIds[index]}: ${gap}`);
  }

  const friendIds = ['andre', 'rene', 'lars', 'danny'];
  friendIds.forEach((id, index) => {
    const tent = OBJECT_PLACEMENTS[`tent-${id}`];
    const npc = NPC_PLACEMENTS[id];
    const centerX = tent.x + (tent.width ?? 135) / 2;
    if (Math.abs(npc.x - centerX) > 45 || npc.y < tent.y + (tent.height ?? 105)) errors.push(`${id} is not positioned in front of their tent.`);
  });

  const stage = OBJECT_PLACEMENTS['festival-stage'];
  const party = OBJECT_PLACEMENTS.party;
  const kiosk = OBJECT_PLACEMENTS['festival-kiosk'];
  if (!(stage.y < party.y && party.y < kiosk.y)) errors.push('Festival must run from stage to party tent to kiosk.');

  const mainDock = OBJECT_PLACEMENTS['main-dock'];
  const coveDock = OBJECT_PLACEMENTS['cove-dock'];
  if (mainDock.x + (mainDock.width ?? 0) <= 2250) errors.push('Main dock does not reach the lake.');
  if (coveDock.x + (coveDock.width ?? 0) <= 2220) errors.push('Cove dock does not reach cove water.');
  if (!(OBJECT_PLACEMENTS['cove-shelter'].y < coveDock.y)) errors.push('Cove shelter must sit inland and north of the dock.');

  const campfire = LANDMARK_PLACEMENTS.campfire;
  if (!(campfire.x > OBJECT_PLACEMENTS['tent-danny'].x + (OBJECT_PLACEMENTS['tent-danny'].width ?? 135))) {
    errors.push('Campfire must sit beside, not inside, the tent row.');
  }
}

function validateEntrances(errors: string[]): void {
  const entranceOwners: Record<string, string> = {
    'reception-door': 'reception',
    'sanitary-door': 'sanitary',
    'home-door': 'home-tent',
    'party-door': 'party',
  };
  for (const entrance of EXPANDED_ENTRANCES) {
    const nearestRoad = BLUEPRINT_ROADS.reduce((best, road) => Math.min(best, distanceToRoad(entrance, road)), Number.POSITIVE_INFINITY);
    if (nearestRoad > 95) errors.push(`Entrance lacks road access: ${entrance.id}`);
    const owner = OBJECT_PLACEMENTS[entranceOwners[entrance.id]];
    if (!owner) continue;
    const ownerBounds = { x: owner.x, y: owner.y, width: owner.width ?? 1, height: owner.height ?? 1 };
    if (distanceToBounds(entrance, ownerBounds) > 45) errors.push(`Entrance is detached from owner: ${entrance.id}`);
  }
}

function centerOfPlacement(placement: Placement): PlanPoint {
  return { x: placement.x + (placement.width ?? 0) / 2, y: placement.y + (placement.height ?? 0) / 2 };
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

function distanceToBounds(point: PlanPoint, bounds: Bounds): number {
  const dx = Math.max(bounds.x - point.x, 0, point.x - (bounds.x + bounds.width));
  const dy = Math.max(bounds.y - point.y, 0, point.y - (bounds.y + bounds.height));
  return Math.hypot(dx, dy);
}

function pointDistance(a: PlanPoint, b: PlanPoint): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function contains(bounds: Bounds, point: PlanPoint): boolean {
  return point.x >= bounds.x && point.x <= bounds.x + bounds.width && point.y >= bounds.y && point.y <= bounds.y + bounds.height;
}

function overlaps(a: Bounds, b: Bounds): boolean {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}

function expand(bounds: Bounds, amount: number): Bounds {
  return { x: bounds.x - amount, y: bounds.y - amount, width: bounds.width + amount * 2, height: bounds.height + amount * 2 };
}

function onGrid(value: number): boolean {
  return value % BLUEPRINT_GRID === 0;
}
