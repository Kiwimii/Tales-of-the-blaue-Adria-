import type { GameSnapshot } from './types';
import type { RegionId } from './worldV2';

export type WorldActivityId = 'battle' | 'flip-cup' | 'beer-pong' | 'flunkyball' | 'masl-hole' | 'tent-hedge-relief';

export interface WorldActivityDefinition {
  id: WorldActivityId;
  sceneKey: string;
  regionId: RegionId;
  x: number;
  y: number;
  radius: number;
  label: string;
  prompt: string;
  completedFlag?: string;
  requiresGate?: boolean;
  requiresFirstBeer?: boolean;
}

export const WORLD_ACTIVITY_CATALOG: readonly WorldActivityDefinition[] = [
  {
    id: 'battle', sceneKey: 'battle', regionId: 'central', x: 1120, y: 850, radius: 98,
    label: 'CAMPING-DUELL', prompt: 'Ronny zum Frustduell herausfordern', completedFlag: 'firstBattleWon', requiresGate: true,
  },
  {
    id: 'flip-cup', sceneKey: 'flip-cup', regionId: 'festival', x: 1510, y: 560, radius: 100,
    label: 'FLIP CUP', prompt: 'Flip Cup am Partyzelt spielen', completedFlag: 'flipCupWon', requiresFirstBeer: true,
  },
  {
    id: 'beer-pong', sceneKey: 'beer-pong', regionId: 'festival', x: 1840, y: 560, radius: 100,
    label: 'BEER PONG', prompt: 'Beer Pong am Partyzelt spielen', completedFlag: 'beerPongWon', requiresFirstBeer: true,
  },
  {
    id: 'masl-hole', sceneKey: 'masl-hole', regionId: 'festival', x: 1840, y: 820, radius: 96,
    label: 'KOMM ANS LOCH', prompt: 'Masls Spezialtechnik ausprobieren', completedFlag: 'maslHoleMastered', requiresFirstBeer: true,
  },
  {
    id: 'flunkyball', sceneKey: 'flunkyball', regionId: 'beach', x: 2140, y: 900, radius: 104,
    label: 'FLUNKYBALL', prompt: 'Flunkyball am Strand starten', completedFlag: 'flunkyballWon', requiresFirstBeer: true,
  },
  {
    id: 'tent-hedge-relief', sceneKey: 'hedge-pee', regionId: 'central', x: 800, y: 960, radius: 96,
    label: 'HECKE', prompt: 'In die Hecke brunzen', completedFlag: 'hedgeRelieved', requiresFirstBeer: true,
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
