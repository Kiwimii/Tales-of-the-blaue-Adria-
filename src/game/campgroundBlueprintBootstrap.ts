import { BLUEPRINT_NODES, BLUEPRINT_ROADS, BLUEPRINT_ZONES } from './campgroundBlueprint';
import { EXPANDED_WORLD_OBJECTS } from './worldV2';

let prepared = false;

export function prepareCampgroundBlueprint(): void {
  if (prepared) return;

  Object.assign(BLUEPRINT_NODES.partyDoor as { x: number; y: number }, { x: 1650, y: 650 });
  Object.assign(BLUEPRINT_NODES.beachDock as { x: number; y: number }, { x: 2100, y: 550 });
  const duplicateIndex = BLUEPRINT_ROADS.findIndex((road) => road.id === 'party-spur-vertical');
  if (duplicateIndex >= 0) BLUEPRINT_ROADS.splice(duplicateIndex, 1);

  const beach = BLUEPRINT_ZONES.find((zone) => zone.id === 'beach');
  const cove = BLUEPRINT_ZONES.find((zone) => zone.id === 'cove');
  if (beach) beach.bounds.width = 300;
  if (cove) cove.bounds.width = 300;

  moveObject('reception', { y: 1260 });
  moveObject('sanitary', { y: 700 });
  moveObject('home-tent', { y: 1035 });
  moveObject('tent-andre', { x: 230, y: 1035 });
  moveObject('central-tree-2', { x: 1290, y: 850 });
  moveObject('north-camper-3', { x: 980, y: 380 });
  moveObject('beach-bench-1', { x: 1960, y: 500 });

  prepared = true;
}

function moveObject(id: string, placement: Partial<{ x: number; y: number; width: number; height: number }>): void {
  const object = EXPANDED_WORLD_OBJECTS.find((entry) => entry.id === id);
  if (object) Object.assign(object, placement);
}
