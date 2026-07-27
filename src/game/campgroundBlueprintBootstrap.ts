import { BLUEPRINT_NODES, BLUEPRINT_ROADS } from './campgroundBlueprint';

let prepared = false;

export function prepareCampgroundBlueprint(): void {
  if (prepared) return;

  Object.assign(BLUEPRINT_NODES.partyDoor as { x: number; y: number }, { x: 1650, y: 650 });
  const duplicateIndex = BLUEPRINT_ROADS.findIndex((road) => road.id === 'party-spur-vertical');
  if (duplicateIndex >= 0) BLUEPRINT_ROADS.splice(duplicateIndex, 1);

  prepared = true;
}
