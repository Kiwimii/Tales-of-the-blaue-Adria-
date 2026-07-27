import { RELATIONSHIP_CHARACTERS, TEAM_MEMBERS } from './content';
import { FRIEND_PROFILES, FRIEND_TEAM_MEMBERS, type FriendId } from './friendRoster';
import { ROMANCE_PROFILES } from './socialSystem';
import { EXPANDED_NPCS, EXPANDED_WORLD_OBJECTS, type ExpandedWorldObject } from './worldV2';

let installed = false;

export const TENT_HEDGE_SEGMENTS: ExpandedWorldObject[] = [
  {
    id: 'tent-hedge-west', kind: 'fence', regionId: 'central', x: 245, y: 1245, width: 385, height: 24,
    label: 'HECKE', color: 0x315c3f, solid: true,
  },
  {
    id: 'tent-hedge-east', kind: 'fence', regionId: 'central', x: 1010, y: 1245, width: 280, height: 24,
    color: 0x315c3f, solid: true,
  },
];

export function installAdvancedContent(): void {
  if (installed) return;
  installed = true;

  for (const [id, profile] of Object.entries(FRIEND_PROFILES)) {
    const character = RELATIONSHIP_CHARACTERS.find((entry) => entry.id === id);
    if (character) {
      character.nickname = profile.archetype;
      character.line = profile.fieldLine;
    }
  }
  Object.assign(TEAM_MEMBERS, FRIEND_TEAM_MEMBERS);

  const romanceCharacters = [
    { id: 'susi', color: '#d46aa5', portrait: 'S', regionId: 'festival' as const, x: 1740, y: 700 },
    { id: 'jule', color: '#5eb7c9', portrait: 'J', regionId: 'beach' as const, x: 2070, y: 540 },
    { id: 'kira', color: '#8f79ce', portrait: 'K', regionId: 'north' as const, x: 1060, y: 490 },
  ];
  for (const placement of romanceCharacters) {
    const profile = ROMANCE_PROFILES[placement.id as keyof typeof ROMANCE_PROFILES];
    if (!RELATIONSHIP_CHARACTERS.some((entry) => entry.id === placement.id)) {
      RELATIONSHIP_CHARACTERS.push({
        id: placement.id,
        name: profile.name,
        nickname: profile.nickname,
        color: placement.color,
        portrait: placement.portrait,
        line: profile.opening[0],
        group: 'campingplatz',
      });
    }
    if (!EXPANDED_NPCS.some((entry) => entry.id === placement.id)) {
      EXPANDED_NPCS.push({ id: placement.id, regionId: placement.regionId, x: placement.x, y: placement.y });
    }
  }

  for (const segment of TENT_HEDGE_SEGMENTS) {
    if (!EXPANDED_WORLD_OBJECTS.some((object) => object.id === segment.id)) EXPANDED_WORLD_OBJECTS.push({ ...segment });
  }
  if (!EXPANDED_WORLD_OBJECTS.some((object) => object.id === 'lunch-sign')) {
    EXPANDED_WORLD_OBJECTS.push({
      id: 'lunch-sign', kind: 'sign', regionId: 'arrival', x: 1210, y: 1500, width: 105, height: 65,
      label: 'MITTAGSPAUSE', solid: false,
    });
  }
}

export const FRIEND_ID_SET = new Set<FriendId>(Object.keys(FRIEND_PROFILES) as FriendId[]);
