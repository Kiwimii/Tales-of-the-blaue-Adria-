import type { GameSnapshot } from './types';
import type { RegionId } from './worldV2';

export type WorldActivityId = 'battle' | 'flip-cup' | 'beer-pong' | 'flunkyball' | 'masl-hole' | 'tent-hedge-relief';
export type WorldActivityHostKind = 'object' | 'npc';

export interface WorldActivityHost {
  kind: WorldActivityHostKind;
  id: string;
  maxDistance: number;
}

export interface WorldActivityDefinition {
  id: WorldActivityId;
  sceneKey: string;
  regionId: RegionId;
  x: number;
  y: number;
  radius: number;
  label: string;
  prompt: string;
  host: WorldActivityHost;
  completedFlag?: string;
  requiresGate?: boolean;
  requiresFirstBeer?: boolean;
}

export const WORLD_ACTIVITY_CATALOG: readonly WorldActivityDefinition[] = [
  {
    id: 'battle', sceneKey: 'battle', regionId: 'central', x: 1120, y: 850, radius: 98,
    label: 'CAMPING-DUELL', prompt: 'Ronny zum Frustduell herausfordern', completedFlag: 'firstBattleWon', requiresGate: true,
    host: { kind: 'npc', id: 'ronny', maxDistance: 105 },
  },
  {
    id: 'flip-cup', sceneKey: 'flip-cup', regionId: 'festival', x: 1510, y: 560, radius: 100,
    label: 'FLIP CUP', prompt: 'Flip Cup vor dem Partyzelt spielen', completedFlag: 'flipCupWon', requiresFirstBeer: true,
    host: { kind: 'object', id: 'party', maxDistance: 110 },
  },
  {
    id: 'beer-pong', sceneKey: 'beer-pong', regionId: 'festival', x: 1840, y: 560, radius: 100,
    label: 'BEER PONG', prompt: 'Beer Pong vor dem Partyzelt spielen', completedFlag: 'beerPongWon', requiresFirstBeer: true,
    host: { kind: 'object', id: 'party', maxDistance: 80 },
  },
  {
    id: 'masl-hole', sceneKey: 'masl-hole', regionId: 'festival', x: 1840, y: 820, radius: 96,
    label: 'KOMM ANS LOCH', prompt: 'Masls Spezialtechnik ausprobieren', completedFlag: 'maslHoleMastered', requiresFirstBeer: true,
    host: { kind: 'npc', id: 'masl', maxDistance: 115 },
  },
  {
    id: 'flunkyball', sceneKey: 'flunkyball', regionId: 'beach', x: 2140, y: 900, radius: 104,
    label: 'FLUNKYBALL', prompt: 'Flunkyball am Strand starten', completedFlag: 'flunkyballWon', requiresFirstBeer: true,
    host: { kind: 'object', id: 'beach-table', maxDistance: 80 },
  },
  {
    id: 'tent-hedge-relief', sceneKey: 'hedge-pee', regionId: 'central', x: 800, y: 960, radius: 96,
    label: 'HECKE', prompt: 'In die Hecke brunzen', completedFlag: 'hedgeRelieved', requiresFirstBeer: true,
    host: { kind: 'object', id: 'tent-hedge-east', maxDistance: 55 },
  },
] as const;

export function activityPrompt(definition: WorldActivityDefinition, snapshot: GameSnapshot): string {
  if (definition.completedFlag && snapshot.flags[definition.completedFlag]) return `${definition.prompt} · erneut`;
  return definition.prompt;
}

export function activityBlockReason(definition: WorldActivityDefinition, snapshot: GameSnapshot): string | null {
  if (definition.requiresGate && !snapshot.flags.gateOpen) return 'Die Aktivität liegt hinter der geschlossenen Schranke.';
  if (definition.requiresFirstBeer && !snapshot.flags.firstBeerOpened) return 'Erst den Taucherplatz beziehen und das erste Bier öffnen.';
  return null;
}
