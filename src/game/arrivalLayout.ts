import { applyRealisticWorldLayout } from './worldRealism';
import {
  EXPANDED_ENTRANCES,
  EXPANDED_NPCS,
  EXPANDED_WORLD_OBJECTS,
  WORLD_REGIONS,
  type ExpandedWorldObject,
} from './worldV2';

export const TAUCHER_TENT: ExpandedWorldObject = {
  id: 'arrival-home-tent',
  kind: 'tent',
  regionId: 'central',
  x: 865,
  y: 1125,
  width: 155,
  height: 120,
  label: 'DEIN ZELT',
  color: 0x6c8fc9,
  solid: true,
};

let applied = false;

export function applyArrivalLayout(): void {
  if (applied) return;
  applyRealisticWorldLayout();

  const central = WORLD_REGIONS.find((region) => region.id === 'central');
  if (central) {
    central.title = 'Taucherplatz & Südlager';
    central.subtitle = 'Große Parzelle, kompakte Freundeszeltreihe, Hecke und kreative Anmeldung';
  }

  patchObject('central-sign', { x: 85, y: 1025, width: 118, label: 'TAUCHERPLATZ' });
  patchObject('home-tent', {
    kind: 'flowerbed', x: 1040, y: 1190, width: 155, height: 38, label: undefined, solid: false,
  });
  patchObject('tent-andre', { x: 290, y: 1135 });
  patchObject('tent-rene', { x: 435, y: 1140 });
  patchObject('tent-lars', { x: 580, y: 1125 });
  patchObject('tent-danny', { x: 725, y: 1135 });
  patchObject('central-camper', { x: 1080, y: 800 });
  patchObject('central-tree-2', { x: 1265, y: 1080 });

  patchNpc('andre', 330, 1088);
  patchNpc('rene', 475, 1093);
  patchNpc('lars', 625, 1083);
  patchNpc('danny', 770, 1093);

  const homeDoor = EXPANDED_ENTRANCES.find((entrance) => entrance.id === 'home-door');
  if (homeDoor) {
    homeDoor.x = 942;
    homeDoor.y = 1250;
  }

  applied = true;
}

export function validateArrivalLayout(): string[] {
  applyArrivalLayout();
  const errors: string[] = [];
  const sign = EXPANDED_WORLD_OBJECTS.find((object) => object.id === 'central-sign');
  if (sign?.label !== 'TAUCHERPLATZ') errors.push('Taucherplatz sign is missing.');

  const friendTents = ['tent-andre', 'tent-rene', 'tent-lars', 'tent-danny']
    .map((id) => EXPANDED_WORLD_OBJECTS.find((object) => object.id === id))
    .filter((object): object is ExpandedWorldObject => Boolean(object));
  const sorted = friendTents.map((tent) => tent.x).sort((a, b) => a - b);
  for (let index = 1; index < sorted.length; index += 1) {
    const gap = sorted[index] - sorted[index - 1];
    if (gap < 135) errors.push('Friend tents overlap.');
    if (gap > 165) errors.push('Friend tents are no longer a coherent group.');
  }

  if (TAUCHER_TENT.x < 820 || TAUCHER_TENT.x + TAUCHER_TENT.width > 1060) {
    errors.push('Player tent is not adjacent to the friend tent row.');
  }
  const hedge = EXPANDED_WORLD_OBJECTS.find((object) => object.id === 'tent-hedge');
  if (hedge && hedge.y < TAUCHER_TENT.y + TAUCHER_TENT.height - 8) errors.push('Hedge intersects the tent row.');
  return errors;
}

function patchObject(id: string, patch: Partial<ExpandedWorldObject>): void {
  const object = EXPANDED_WORLD_OBJECTS.find((entry) => entry.id === id);
  if (object) Object.assign(object, patch);
}

function patchNpc(id: string, x: number, y: number): void {
  const npc = EXPANDED_NPCS.find((entry) => entry.id === id);
  if (npc) Object.assign(npc, { x, y });
}
