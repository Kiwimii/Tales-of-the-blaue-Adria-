import {
  AERIAL_FUNCTIONAL_AREAS,
  AERIAL_NODES,
  AERIAL_ROADS,
  ARRIVAL_STORY_PLACEMENTS,
  ENTRANCE_PLACEMENTS,
  LANDMARK_PLACEMENTS,
  NPC_PLACEMENTS,
  OBJECT_PLACEMENTS,
  type PlanPoint,
  type Placement,
} from './aerialCampgroundPlan';
import { WORLD_ACTIVITY_CATALOG, type WorldActivityDefinition } from './worldActivityCatalog';
import { regionAt, type RegionId } from './worldV2';

export type InteractionAnchorKind = 'activity' | 'npc' | 'entrance' | 'landmark' | 'story';

export interface InteractionAnchor {
  id: string;
  kind: InteractionAnchorKind;
  x: number;
  y: number;
  regionId: RegionId;
}

const STORY_ANCHORS: Record<string, { point: PlanPoint; regionId: RegionId }> = {
  'arrival-trunk': { point: ARRIVAL_STORY_PLACEMENTS.trunk, regionId: 'arrival' },
  'arrival-board': { point: ARRIVAL_STORY_PLACEMENTS.reservationBoard, regionId: 'arrival' },
  'npc-gundula-story': { point: ARRIVAL_STORY_PLACEMENTS.gundula, regionId: 'arrival' },
  'npc-uli-story': { point: ARRIVAL_STORY_PLACEMENTS.uli, regionId: 'arrival' },
  'arrival-debate': { point: ARRIVAL_STORY_PLACEMENTS.gateDebate, regionId: 'arrival' },
  'arrival-park-car': { point: ARRIVAL_STORY_PLACEMENTS.taucherplatz, regionId: 'central' },
  'arrival-power': { point: ARRIVAL_STORY_PLACEMENTS.powerBox, regionId: 'central' },
  'arrival-unload-drinks': { point: ARRIVAL_STORY_PLACEMENTS.drinks, regionId: 'central' },
  'arrival-unload-tents': { point: ARRIVAL_STORY_PLACEMENTS.tents, regionId: 'central' },
  'arrival-unload-cable': { point: ARRIVAL_STORY_PLACEMENTS.cable, regionId: 'central' },
  'arrival-first-beer': { point: ARRIVAL_STORY_PLACEMENTS.firstBeer, regionId: 'central' },
  'home-door-story': { point: ARRIVAL_STORY_PLACEMENTS.homeDoor, regionId: 'central' },
};

const INTERACTION_ALIASES: Record<string, string> = {
  'home-door-story': 'home-door',
  'landmark-notice-board': 'notice-board',
};

export function expectedInteractionAnchor(interactionId: string): InteractionAnchor | null {
  const activity = WORLD_ACTIVITY_CATALOG.find((entry) => entry.id === interactionId);
  if (activity) return anchor(interactionId, 'activity', activity, activity.regionId);

  const story = STORY_ANCHORS[interactionId];
  if (story) return anchor(interactionId, 'story', story.point, story.regionId);

  const characterId = interactionId.match(/^npc-(.+?)(?:-story)?$/)?.[1];
  const npc = characterId ? NPC_PLACEMENTS[characterId] : undefined;
  if (characterId && npc) return anchor(interactionId, 'npc', npc, regionAt(npc.x, npc.y).id);

  const normalized = INTERACTION_ALIASES[interactionId] ?? interactionId;
  const entrance = ENTRANCE_PLACEMENTS[normalized];
  if (entrance) return anchor(interactionId, 'entrance', entrance, regionAt(entrance.x, entrance.y).id);

  const landmarkId = normalized.startsWith('landmark-') ? normalized.slice('landmark-'.length) : normalized;
  const landmark = LANDMARK_PLACEMENTS[landmarkId];
  if (landmark) return anchor(interactionId, 'landmark', landmark, regionAt(landmark.x, landmark.y).id);

  return null;
}

export function findWorldPlacementIssues(): string[] {
  const issues: string[] = [];

  for (const activity of WORLD_ACTIVITY_CATALOG) validateActivity(activity, issues);

  for (const [id, point] of Object.entries(NPC_PLACEMENTS)) {
    validateWorldPoint(`NPC ${id}`, point, 170, issues);
  }
  for (const [id, point] of Object.entries(ENTRANCE_PLACEMENTS)) {
    validateWorldPoint(`Eingang ${id}`, point, 120, issues);
  }
  for (const [id, point] of Object.entries(LANDMARK_PLACEMENTS)) {
    validateWorldPoint(`Landmarke ${id}`, point, 190, issues);
  }

  const interactionAnchors = [
    ...WORLD_ACTIVITY_CATALOG.map((entry) => ({ id: entry.id, x: entry.x, y: entry.y })),
    ...Object.entries(NPC_PLACEMENTS).map(([id, point]) => ({ id: `npc-${id}`, ...point })),
    ...Object.entries(ENTRANCE_PLACEMENTS).map(([id, point]) => ({ id, ...point })),
    ...Object.entries(LANDMARK_PLACEMENTS).map(([id, point]) => ({ id: `landmark-${id}`, ...point })),
  ];

  for (let leftIndex = 0; leftIndex < interactionAnchors.length; leftIndex += 1) {
    const left = interactionAnchors[leftIndex];
    for (let rightIndex = leftIndex + 1; rightIndex < interactionAnchors.length; rightIndex += 1) {
      const right = interactionAnchors[rightIndex];
      const distance = Math.hypot(left.x - right.x, left.y - right.y);
      if (distance < 18) issues.push(`${left.id} und ${right.id} liegen praktisch auf demselben Auslösepunkt (${distance.toFixed(1)} px).`);
    }
  }

  return issues;
}

export function nearestRoadDistance(point: PlanPoint): number {
  let best = Number.POSITIVE_INFINITY;
  for (const road of AERIAL_ROADS) {
    const from = AERIAL_NODES[road.from];
    const to = AERIAL_NODES[road.to];
    best = Math.min(best, Math.max(0, distanceToSegment(point, from, to) - road.width / 2));
  }
  return best;
}

export function distanceToPlacement(point: PlanPoint, placement: Placement): number {
  const width = placement.width ?? 0;
  const height = placement.height ?? 0;
  const closestX = clamp(point.x, placement.x, placement.x + width);
  const closestY = clamp(point.y, placement.y, placement.y + height);
  return Math.hypot(point.x - closestX, point.y - closestY);
}

function validateActivity(activity: WorldActivityDefinition, issues: string[]): void {
  const actualRegion = regionAt(activity.x, activity.y).id;
  if (actualRegion !== activity.regionId) {
    issues.push(`${activity.id} liegt in ${actualRegion}, ist aber als ${activity.regionId} deklariert.`);
  }

  const roadDistance = nearestRoadDistance(activity);
  if (roadDistance > 105) issues.push(`${activity.id} liegt ${roadDistance.toFixed(1)} px vom nächsten begehbaren Weg entfernt.`);

  if (activity.radius < 88 || activity.radius > 130) {
    issues.push(`${activity.id} besitzt einen unplausiblen Auslöseradius von ${activity.radius} px.`);
  }

  const host = activity.host.kind === 'npc'
    ? NPC_PLACEMENTS[activity.host.id]
    : OBJECT_PLACEMENTS[activity.host.id];
  if (!host) {
    issues.push(`${activity.id} verweist auf den fehlenden Host ${activity.host.kind}:${activity.host.id}.`);
    return;
  }

  const hostDistance = activity.host.kind === 'npc'
    ? Math.hypot(activity.x - host.x, activity.y - host.y)
    : distanceToPlacement(activity, host);
  if (hostDistance > activity.host.maxDistance) {
    issues.push(`${activity.id} liegt ${hostDistance.toFixed(1)} px vom Host ${activity.host.id} entfernt.`);
  }

  for (const [objectId, placement] of Object.entries(OBJECT_PLACEMENTS)) {
    if (objectId === activity.host.id) continue;
    if ((placement.width ?? 0) <= 0 || (placement.height ?? 0) <= 0) continue;
    if (distanceToPlacement(activity, placement) < 8) {
      issues.push(`${activity.id} liegt im Objekt ${objectId} und kann dadurch verdeckt oder blockiert werden.`);
    }
  }
}

function validateWorldPoint(label: string, point: PlanPoint, maxRoadDistance: number, issues: string[]): void {
  const region = regionAt(point.x, point.y);
  const areaMatches = Object.values(AERIAL_FUNCTIONAL_AREAS).some((area) => (
    area.regionId === region.id
    && point.x >= area.x
    && point.x <= area.x + area.width
    && point.y >= area.y
    && point.y <= area.y + area.height
  ));
  if (!areaMatches) issues.push(`${label} liegt außerhalb einer passenden Funktionsfläche.`);

  const roadDistance = nearestRoadDistance(point);
  if (roadDistance > maxRoadDistance) issues.push(`${label} liegt ${roadDistance.toFixed(1)} px vom Wegenetz entfernt.`);
}

function anchor(id: string, kind: InteractionAnchorKind, point: PlanPoint, regionId: RegionId): InteractionAnchor {
  return { id, kind, x: point.x, y: point.y, regionId };
}

function distanceToSegment(point: PlanPoint, from: PlanPoint, to: PlanPoint): number {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const lengthSquared = dx * dx + dy * dy;
  if (!lengthSquared) return Math.hypot(point.x - from.x, point.y - from.y);
  const t = clamp(((point.x - from.x) * dx + (point.y - from.y) * dy) / lengthSquared, 0, 1);
  const projection = { x: from.x + t * dx, y: from.y + t * dy };
  return Math.hypot(point.x - projection.x, point.y - projection.y);
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
