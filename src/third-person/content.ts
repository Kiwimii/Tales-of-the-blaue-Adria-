import {
  ARRIVAL_STORY_PLACEMENTS,
  LANDMARK_PLACEMENTS,
  NPC_PLACEMENTS,
  OBJECT_PLACEMENTS,
  type PlanPoint,
} from '../game/aerialCampgroundPlan';
import { RELATIONSHIP_CHARACTERS } from '../game/content';
import { applySprint89CampPlan } from '../game/sprint89CampPlan';

applySprint89CampPlan();

export type ThirdPersonInteractionKind = 'story' | 'service' | 'minigame' | 'landmark';

export interface ThirdPersonInteraction extends PlanPoint {
  id: string;
  label: string;
  kind: ThirdPersonInteractionKind;
  radius: number;
  requiresGate?: boolean;
}

export interface ThirdPersonCharacter extends PlanPoint {
  id: string;
  name: string;
  role: string;
  dialogue: string;
  shirt: number;
  trousers: number;
  skin: number;
  hair: number;
}

const supplemental = [
  { id: 'susi', name: 'Susi', role: 'Becherstrategin', dialogue: 'Ein guter Wurf ist noch keine Persönlichkeit. Aber er hilft beim Einstieg.', color: '#c45f79' },
  { id: 'jule', name: 'Jule', role: 'Strandläuferin', dialogue: 'Erst Wasser, dann Heldengeschichte. Die Reihenfolge ist nicht verhandelbar.', color: '#3d8c82' },
  { id: 'kira', name: 'Kira', role: 'Nachtfotografin', dialogue: 'Das Licht hier ist besser als die Gespräche. Noch.', color: '#4e4b82' },
];

const source = [
  ...RELATIONSHIP_CHARACTERS.map((character) => ({
    id: character.id,
    name: character.name,
    role: character.nickname,
    dialogue: character.line,
    color: character.color,
  })),
  ...supplemental,
];

export const THIRD_PERSON_CHARACTERS: ThirdPersonCharacter[] = source.flatMap((character, index) => {
  const point = NPC_PLACEMENTS[character.id];
  if (!point) return [];
  return [{
    ...character,
    ...point,
    shirt: parseColor(character.color, 0x557f70),
    trousers: [0x263849, 0x38343d, 0x293f39][index % 3],
    skin: [0xe2a478, 0xd79b70, 0xc98c63, 0xe8b58b][index % 4],
    hair: [0x39291f, 0x5c3825, 0x222326, 0x6d5844][index % 4],
  }];
});

export const THIRD_PERSON_CHARACTER_BY_ID = Object.fromEntries(
  THIRD_PERSON_CHARACTERS.map((character) => [character.id, character]),
) as Record<string, ThirdPersonCharacter>;

export const THIRD_PERSON_INTERACTIONS: ThirdPersonInteraction[] = [
  point('trunk', 'Kofferraum öffnen', 'story', ARRIVAL_STORY_PLACEMENTS.trunk, 105),
  point('reservationBoard', 'Reservierung am Schwarzen Brett', 'story', ARRIVAL_STORY_PLACEMENTS.reservationBoard, 100),
  point('gundula', 'Gundula und Uli auf die eigene Seite ziehen', 'story', ARRIVAL_STORY_PLACEMENTS.gundula, 115),
  point('taucherplatz', 'Wagen am Taucherplatz', 'story', ARRIVAL_STORY_PLACEMENTS.taucherplatz, 120, true),
  point('powerBox', 'Stromkasten verbinden', 'story', ARRIVAL_STORY_PLACEMENTS.powerBox, 105, true),
  point('drinks', 'Getränke ausladen', 'story', ARRIVAL_STORY_PLACEMENTS.drinks, 90, true),
  point('tents', 'Zeltsäcke ausladen', 'story', ARRIVAL_STORY_PLACEMENTS.tents, 90, true),
  point('cable', 'Kabeltrommel platzieren', 'story', ARRIVAL_STORY_PLACEMENTS.cable, 90, true),
  point('firstBeer', 'Erstes Bier öffnen', 'story', ARRIVAL_STORY_PLACEMENTS.firstBeer, 90, true),
  point('homeTent', 'Im eigenen Zelt ruhen', 'service', { x: OBJECT_PLACEMENTS['home-tent'].x + 90, y: OBJECT_PLACEMENTS['home-tent'].y + 95 }, 95, true),
  point('sanitary', 'Sanitärgebäude', 'service', { x: OBJECT_PLACEMENTS.sanitary.x + 130, y: OBJECT_PLACEMENTS.sanitary.y + 155 }, 100, true),
  point('hedge', 'Unauffällige Hecke', 'minigame', { x: 550, y: OBJECT_PLACEMENTS['tent-hedge-west'].y + 18 }, 125, true),
  point('campfire', 'Feuerstelle und Team', 'landmark', LANDMARK_PLACEMENTS.campfire, 120, true),
  point('noticeBoard', 'Schwarzes Brett', 'landmark', LANDMARK_PLACEMENTS['notice-board'], 100),
  point('flipCup', 'Flip Cup am Zeltkreis', 'minigame', { x: 630, y: 1200 }, 115, true),
  point('romme', 'Rommé am Zeltkreis', 'minigame', { x: 760, y: 1170 }, 115, true),
  point('beerPong', 'Beer Pong auf der Festwiese', 'minigame', { x: 1690, y: 700 }, 120, true),
  point('flunkyball', 'Flunkyball am Strand', 'minigame', { x: 2070, y: 860 }, 135, true),
  point('maslHole', 'Masls „Komm ans Loch“', 'minigame', NPC_PLACEMENTS.masl, 120, true),
  point('ronnyBattle', 'Frustduell gegen Ronny', 'minigame', NPC_PLACEMENTS.ronny, 110, true),
];

function parseColor(value: string, fallback: number): number {
  const normalized = value.startsWith('#') ? value.slice(1) : value;
  const parsed = Number.parseInt(normalized, 16);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function point(
  id: string,
  label: string,
  kind: ThirdPersonInteractionKind,
  position: PlanPoint,
  radius: number,
  requiresGate = false,
): ThirdPersonInteraction {
  return { id, label, kind, ...position, radius, requiresGate };
}
