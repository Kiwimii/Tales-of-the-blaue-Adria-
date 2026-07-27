import { ARRIVAL_POSITIONS } from './arrivalQuest';
import { CAMP_ROADS, CAMP_ROAD_NODES, type PlanPoint } from './campgroundPlan';
import { EXPANDED_ENTRANCES, EXPANDED_NPCS, EXPANDED_WORLD_OBJECTS } from './worldV2';

interface MutableRoad {
  id: string;
  from: string;
  to: string;
  width: number;
  surface: 'asphalt' | 'gravel' | 'sand';
}

const ACCESS_NODES: Record<string, PlanPoint> = {
  receptionWalkTurn: { x: 835, y: 1540 },
  receptionDoorApproach: { x: 1170, y: 1540 },
  westLaneTurn: { x: 370, y: 930 },
  sanitaryTurn: { x: 370, y: 1010 },
  sanitaryApproach: { x: 218, y: 1010 },
  southPitchLane: { x: 370, y: 1228 },
  homeApproach: { x: 258, y: 1228 },
  partyTurn: { x: 1700, y: 580 },
  partyApproach: { x: 1645, y: 580 },
};

const ACCESS_ROADS: MutableRoad[] = [
  { id: 'reception-walk-turn', from: 'parking', to: 'receptionWalkTurn', width: 58, surface: 'asphalt' },
  { id: 'reception-walk', from: 'receptionWalkTurn', to: 'receptionDoorApproach', width: 58, surface: 'asphalt' },
  { id: 'west-pitch-entry', from: 'westCamp', to: 'westLaneTurn', width: 48, surface: 'gravel' },
  { id: 'west-pitch-lane-upper', from: 'westLaneTurn', to: 'sanitaryTurn', width: 48, surface: 'gravel' },
  { id: 'west-pitch-lane-lower', from: 'sanitaryTurn', to: 'southPitchLane', width: 48, surface: 'gravel' },
  { id: 'sanitary-spur', from: 'sanitaryTurn', to: 'sanitaryApproach', width: 48, surface: 'gravel' },
  { id: 'home-spur', from: 'southPitchLane', to: 'homeApproach', width: 42, surface: 'gravel' },
  { id: 'party-lane', from: 'festivalHub', to: 'partyTurn', width: 48, surface: 'gravel' },
  { id: 'party-spur', from: 'partyTurn', to: 'partyApproach', width: 48, surface: 'gravel' },
];

let applied = false;

export function applyCampgroundAccessPlan(): void {
  if (applied) return;

  Object.assign(CAMP_ROAD_NODES as unknown as Record<string, PlanPoint>, ACCESS_NODES);
  const roads = CAMP_ROADS as unknown as MutableRoad[];
  for (const road of ACCESS_ROADS) {
    if (!roads.some((entry) => entry.id === road.id)) roads.push(road);
  }

  moveObject('sanitary', { x: 90, y: 800 });
  moveObject('festival-kiosk', { x: 1475, y: 760 });
  moveObject('festival-table-2', { x: 1740, y: 820 });
  moveObject('cove-rock-1', { x: 1980, y: 1360 });
  moveObject('tent-hedge-west', { x: 150, y: 1255, width: 610 });
  moveObject('tent-hedge-east', { x: 930, y: 1255, width: 410 });

  moveNpc('manni', { x: 465, y: 850 });

  moveEntrance('sanitary-door', { x: 218, y: 980 });
  moveEntrance('home-door', { x: 258, y: 1210 });
  moveEntrance('party-door', { x: 1645, y: 535 });
  moveEntrance('reception-door', { x: 1170, y: 1490 });

  Object.assign(
    (ARRIVAL_POSITIONS as unknown as Record<string, PlanPoint>).homeDoor,
    { x: 258, y: 1210 },
  );

  applied = true;
}

function moveObject(id: string, placement: Partial<{ x: number; y: number; width: number; height: number }>): void {
  const object = EXPANDED_WORLD_OBJECTS.find((entry) => entry.id === id);
  if (object) Object.assign(object, placement);
}

function moveNpc(id: string, placement: PlanPoint): void {
  const npc = EXPANDED_NPCS.find((entry) => entry.id === id);
  if (npc) Object.assign(npc, placement);
}

function moveEntrance(id: string, placement: PlanPoint): void {
  const entrance = EXPANDED_ENTRANCES.find((entry) => entry.id === id);
  if (entrance) Object.assign(entrance, placement);
}
