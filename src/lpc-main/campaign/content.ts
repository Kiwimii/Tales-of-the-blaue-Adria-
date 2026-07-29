import { CHARACTER_VISUALS, PLAYER_VISUAL, type CharacterVisual } from '../content';
import {
  ARRIVAL_STORY_PLACEMENTS,
  LANDMARK_PLACEMENTS,
  NPC_PLACEMENTS,
  OBJECT_PLACEMENTS,
  type PlanPoint,
} from '../../game/aerialCampgroundPlan';
import { applySprint89CampPlan } from '../../game/sprint89CampPlan';
import { installAuthorityOverhaul } from './authorityOverhaul';

installAuthorityOverhaul();
applySprint89CampPlan();

export type CampaignInteractionKind = 'story' | 'service' | 'minigame' | 'landmark';
export interface CampaignInteraction extends PlanPoint {
  id: string;
  label: string;
  kind: CampaignInteractionKind;
  radius: number;
  requiresGate?: boolean;
}

const supplemental: CharacterVisual[] = [
  {
    id: 'susi', name: 'Susi', role: 'BECHERSTRATEGIN', x: 0, y: 0,
    scaleX: .93, scaleY: 1.02, shirt: 0xc45f79, shirtShade: 0x873d55, trousers: 0x293746,
    accent: 0xf5d5dd, hair: 0x6a3d29, hairStyle: 'wave', outfit: 'polo', accessories: ['earring'],
    idleAnimation: 'carry', greetingAnimation: 'wave', dialogue: 'Ein guter Wurf ist noch keine Persönlichkeit. Aber er hilft beim Einstieg.',
  },
  {
    id: 'jule', name: 'Jule', role: 'STRANDLÄUFERIN', x: 0, y: 0,
    scaleX: .9, scaleY: 1.08, shirt: 0x3d8c82, shirtShade: 0x286159, trousers: 0x283a4a,
    accent: 0xd7f2e9, hair: 0x4b3125, hairStyle: 'long', outfit: 'jersey', accessories: ['none'],
    idleAnimation: 'idle', greetingAnimation: 'wave', dialogue: 'Erst Wasser, dann Heldengeschichte. Die Reihenfolge ist nicht verhandelbar.',
  },
  {
    id: 'kira', name: 'Kira', role: 'NACHTFOTOGRAFIN', x: 0, y: 0,
    scaleX: .92, scaleY: 1.04, shirt: 0x4e4b82, shirtShade: 0x333154, trousers: 0x292936,
    accent: 0xb8b4ed, hair: 0x242126, hairStyle: 'sidepart', outfit: 'night-shirt', accessories: ['phone'],
    idleAnimation: 'phone', greetingAnimation: 'talk', dialogue: 'Das Licht hier ist besser als die Gespräche. Noch.',
  },
];

export const CAMPAIGN_PLAYER_VISUAL: CharacterVisual = { ...PLAYER_VISUAL, x: ARRIVAL_STORY_PLACEMENTS.trunk.x, y: ARRIVAL_STORY_PLACEMENTS.trunk.y };

export const CAMPAIGN_CHARACTERS: CharacterVisual[] = [...CHARACTER_VISUALS, ...supplemental].map((visual) => {
  const position = NPC_PLACEMENTS[visual.id] ?? { x: visual.x, y: visual.y };
  return { ...visual, x: position.x, y: position.y };
});

export const CAMPAIGN_CHARACTER_BY_ID = Object.fromEntries(CAMPAIGN_CHARACTERS.map((visual) => [visual.id, visual])) as Record<string, CharacterVisual>;

export const STORY_INTERACTIONS: CampaignInteraction[] = [
  point('trunk', 'Kofferraum öffnen', 'story', ARRIVAL_STORY_PLACEMENTS.trunk, 105),
  point('reservationBoard', 'Reservierung am Schwarzen Brett', 'story', ARRIVAL_STORY_PLACEMENTS.reservationBoard, 100),
  point('gundula', 'Gundula und Uli auf ihre Seite ziehen', 'story', ARRIVAL_STORY_PLACEMENTS.gundula, 115),
  point('taucherplatz', 'Wagen am Taucherplatz', 'story', ARRIVAL_STORY_PLACEMENTS.taucherplatz, 120, true),
  point('powerBox', 'Stromkasten verbinden', 'story', ARRIVAL_STORY_PLACEMENTS.powerBox, 105, true),
  point('drinks', 'Getränke ausladen', 'story', ARRIVAL_STORY_PLACEMENTS.drinks, 90, true),
  point('tents', 'Zeltsäcke ausladen', 'story', ARRIVAL_STORY_PLACEMENTS.tents, 90, true),
  point('cable', 'Kabeltrommel platzieren', 'story', ARRIVAL_STORY_PLACEMENTS.cable, 90, true),
  point('firstBeer', 'Erstes Bier öffnen', 'story', ARRIVAL_STORY_PLACEMENTS.firstBeer, 90, true),
];

export const SERVICE_INTERACTIONS: CampaignInteraction[] = [
  point('homeTent', 'Im eigenen Zelt ruhen', 'service', { x: OBJECT_PLACEMENTS['home-tent'].x + 90, y: OBJECT_PLACEMENTS['home-tent'].y + 95 }, 95, true),
  point('sanitary', 'Sanitärgebäude', 'service', { x: OBJECT_PLACEMENTS.sanitary.x + 130, y: OBJECT_PLACEMENTS.sanitary.y + 155 }, 100, true),
  point('hedge', 'Unauffällige Hecke', 'minigame', { x: 550, y: OBJECT_PLACEMENTS['tent-hedge-west'].y + 18 }, 125, true),
  point('campfire', 'Feuerstelle und Team', 'landmark', LANDMARK_PLACEMENTS.campfire, 120, true),
  point('noticeBoard', 'Schwarzes Brett', 'landmark', LANDMARK_PLACEMENTS['notice-board'], 100),
];

export const MINIGAME_INTERACTIONS: CampaignInteraction[] = [
  point('flipCup', 'Flip Cup am Zeltkreis', 'minigame', { x: 630, y: 1200 }, 115, true),
  point('beerPong', 'Beer Pong auf der Festwiese', 'minigame', { x: 1690, y: 700 }, 120, true),
  point('flunkyball', 'Flunkyball am Strand', 'minigame', { x: 2070, y: 860 }, 135, true),
  point('maslHole', 'Masls „Komm ans Loch“', 'minigame', NPC_PLACEMENTS.masl, 120, true),
  point('ronnyBattle', 'Frustduell gegen Ronny', 'minigame', NPC_PLACEMENTS.ronny, 110, true),
];

export const ALL_INTERACTIONS: CampaignInteraction[] = [...STORY_INTERACTIONS, ...SERVICE_INTERACTIONS, ...MINIGAME_INTERACTIONS];

export const IMPORTANT_OBJECT_IDS = [
  'reception', 'sanitary', 'home-tent', 'tent-andre', 'tent-rene', 'tent-lars', 'tent-danny',
  'clubhouse', 'central-camper', 'festival-stage', 'party', 'festival-kiosk', 'lifeguard', 'main-dock',
  'beach-kiosk', 'workshop', 'wood-shed', 'cove-shelter', 'cove-dock', 'central-table', 'central-bench',
  'tent-hedge-west', 'tent-hedge-east', 'arrival-sign', 'north-camper-1', 'north-camper-2', 'north-camper-3',
] as const;

function point(id: string, label: string, kind: CampaignInteractionKind, position: PlanPoint, radius: number, requiresGate = false): CampaignInteraction {
  return { id, label, kind, x: position.x, y: position.y, radius, requiresGate };
}
