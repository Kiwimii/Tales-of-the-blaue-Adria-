import { FRIEND_IDS } from '../../game/content';
import type { GameSnapshot } from '../../game/types';
import type { CampaignMetaState } from './metaStore';

export const PROGRESSION_FLOW_VERSION = 'progression-rewards-markers-v6';
export const CORE_MINIGAME_ORDER = ['flipCup', 'beerPong', 'flunkyball'] as const;
export type CoreMinigameId = (typeof CORE_MINIGAME_ORDER)[number];
export type UnlockableGameId = CoreMinigameId | 'hedgePee' | 'maslHole' | 'ronnyBattle';

export interface ProgressionObjective {
  title: string;
  text: string;
  targetId: string;
  source: 'story' | 'reunion' | 'minigame' | 'rival';
}

export interface UnlockState {
  unlocked: boolean;
  reason: string;
  introducedBy: string;
}

export interface WeightedReward<T extends string = string> {
  id: T;
  weight: number;
  min?: number;
  max?: number;
}

const LATE_STAGES = new Set<CampaignMetaState['questStage']>([
  'saturday-complaint', 'wake-masl', 'saturday-debate', 'saturday-brawl', 'secret-millionaire',
  'early-eviction', 'sunday-final', 'complete',
]);

const FREE_PLAY_STAGES = new Set<CampaignMetaState['questStage']>([
  'free-weekend', 'friday-olympiad', ...LATE_STAGES,
]);

const MASL_STAGES = new Set<CampaignMetaState['questStage']>([
  'wake-masl', 'saturday-debate', 'saturday-brawl', 'secret-millionaire', 'sunday-final', 'complete',
]);

export function minigameAttempted(meta: Pick<CampaignMetaState, 'miniResults'>, id: string): boolean {
  return (meta.miniResults[id]?.attempts ?? 0) > 0;
}

export function allCoreMinigamesUnlocked(meta: CampaignMetaState): boolean {
  if (meta.flags['all-core-minigames-unlocked']) return true;
  if (LATE_STAGES.has(meta.questStage)) return true;
  return CORE_MINIGAME_ORDER.every((id) => minigameAttempted(meta, id));
}

export function minigameUnlockState(meta: CampaignMetaState, id: UnlockableGameId): UnlockState {
  const allCore = allCoreMinigamesUnlocked(meta);
  if (id === 'hedgePee') {
    const unlocked = meta.firstBeerOpened || minigameAttempted(meta, id) || Boolean(meta.flags.hedgeRelieved);
    return { unlocked, reason: unlocked ? 'Die Heckenoption wurde nach dem ersten Bier entdeckt.' : 'Erst das erste Bier öffnen.', introducedBy: 'Das erste Bier und eine zunehmend praktische Blase.' };
  }
  if (id === 'maslHole') {
    const unlocked = MASL_STAGES.has(meta.questStage) || minigameAttempted(meta, id) || Boolean(meta.flags.maslHoleWon);
    return { unlocked, reason: unlocked ? 'Masls Spezialdisziplin ist Teil der Samstagsquest.' : 'Masl führt diese Disziplin erst in seiner Samstagsquest ein.', introducedBy: 'Masl, sobald er tatsächlich wach ist.' };
  }
  if (id === 'ronnyBattle') {
    const unlocked = allCore || minigameAttempted(meta, id) || Boolean(meta.flags.ronnyDefeated);
    return { unlocked, reason: unlocked ? 'Nach allen drei großen Spielen akzeptiert Ronny ein Frustduell.' : 'Erst Flip Cup, Beer Pong und Flunkyball kennenlernen.', introducedBy: 'Ronny, nachdem er genügend Material für einen Vortrag gesammelt hat.' };
  }
  if (allCore) return { unlocked: true, reason: 'Alle großen Minispiele bleiben dauerhaft aktiv.', introducedBy: 'Freitag-Olympiade' };
  if (id === 'flipCup') {
    const unlocked = FREE_PLAY_STAGES.has(meta.questStage) || minigameAttempted(meta, id);
    return { unlocked, reason: unlocked ? 'André eröffnet den Spieleabend mit Flip Cup.' : 'Erst Ankunft, Aufbau und Gruppenfindung abschließen.', introducedBy: 'André am Zeltkreis.' };
  }
  if (id === 'beerPong') {
    const unlocked = minigameAttempted(meta, 'flipCup') || LATE_STAGES.has(meta.questStage) || minigameAttempted(meta, id);
    return { unlocked, reason: unlocked ? 'Susi erklärt nach Flip Cup das Beer-Pong-Tischduell.' : 'Zuerst Flip Cup mindestens einmal spielen.', introducedBy: 'Susi auf der Festwiese.' };
  }
  const unlocked = minigameAttempted(meta, 'beerPong') || LATE_STAGES.has(meta.questStage) || minigameAttempted(meta, id);
  return { unlocked, reason: unlocked ? 'Lars und Felix verlegen die nächste Eskalationsstufe an den Strand.' : 'Zuerst Beer Pong mindestens einmal spielen.', introducedBy: 'Lars und Felix am Strand.' };
}

export function unlockedMinigames(meta: CampaignMetaState): UnlockableGameId[] {
  return (['flipCup', 'beerPong', 'flunkyball', 'hedgePee', 'maslHole', 'ronnyBattle'] as UnlockableGameId[])
    .filter((id) => minigameUnlockState(meta, id).unlocked);
}

export function nextProgressionObjective(
  meta: CampaignMetaState,
  base: Pick<GameSnapshot, 'flags'>,
  fallback: ProgressionObjective,
): ProgressionObjective {
  if (meta.questStage === 'reunion') {
    const missing = FRIEND_IDS.find((id) => !base.flags[`met-${id}`]);
    if (missing) {
      return {
        title: 'Finde die Problemträger',
        text: `Nächster Schritt: ${friendLabel(missing)} finden. Erst danach wird die nächste Person markiert.`,
        targetId: missing,
        source: 'reunion',
      };
    }
    if (meta.activeTeam.length === 0) {
      return { title: 'Team am Lagerfeuer bilden', text: 'Alle gefunden. Wähle jetzt mindestens einen aktiven Begleiter am Lagerfeuer.', targetId: 'campfire', source: 'reunion' };
    }
  }

  if (FREE_PLAY_STAGES.has(meta.questStage) && !LATE_STAGES.has(meta.questStage)) {
    if (!minigameAttempted(meta, 'flipCup')) {
      return { title: 'Eröffnung am Zeltkreis', text: 'André führt Flip Cup ein. Spiele die erste Disziplin, damit die nächste freigeschaltet wird.', targetId: 'flipCup', source: 'minigame' };
    }
    if (!minigameAttempted(meta, 'beerPong')) {
      return { title: 'Susi übernimmt den Tisch', text: 'Beer Pong ist freigeschaltet. Wähle normalen Wurf oder Aufsetzer und spiele eine Partie.', targetId: 'beerPong', source: 'minigame' };
    }
    if (!minigameAttempted(meta, 'flunkyball')) {
      return { title: 'Der Strand verlangt Bewegung', text: 'Lars und Felix führen Flunkyball ein. Absolviere die dritte große Disziplin.', targetId: 'flunkyball', source: 'minigame' };
    }
    if (!meta.flags.ronnyDefeated) {
      return { title: 'Ronnys ungefragter Vortrag', text: 'Alle großen Minispiele bleiben aktiv. Jetzt kann Ronny im Frustduell gestoppt werden.', targetId: 'ronny', source: 'rival' };
    }
  }
  return fallback;
}

export function conversationGiftChance(conversationCount: number): number {
  return clamp(.16 + Math.max(0, conversationCount - 1) * .045, .16, .34);
}

export function pickWeightedReward<T extends string>(entries: WeightedReward<T>[], randomValue: number): { id: T; amount: number } | undefined {
  const valid = entries.filter((entry) => entry.weight > 0);
  const total = valid.reduce((sum, entry) => sum + entry.weight, 0);
  if (!total) return undefined;
  let cursor = clamp(randomValue, 0, .999999) * total;
  for (const entry of valid) {
    cursor -= entry.weight;
    if (cursor <= 0) {
      const min = Math.max(1, Math.floor(entry.min ?? 1));
      const max = Math.max(min, Math.floor(entry.max ?? min));
      const amountSeed = (clamp(randomValue, 0, .999999) * 997) % 1;
      return { id: entry.id, amount: min + Math.floor(amountSeed * (max - min + 1)) };
    }
  }
  const last = valid.at(-1);
  return last ? { id: last.id, amount: Math.max(1, Math.floor(last.min ?? 1)) } : undefined;
}

function friendLabel(id: string): string {
  return ({ andre: 'André', rene: 'René', lars: 'Lars', danny: 'Danny', gregor: 'Gregor', masl: 'Masl', schubert: 'Schubert', felix: 'Felix', schima: 'Schima' } as Record<string, string>)[id] ?? id;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
