import type { CampaignMetaState } from './metaStore';

export const BATTLE_LEAGUE_VERSION: string;
export const LEAGUE_OPPONENTS: Record<string, {
  id: string;
  name: string;
  title: string;
  tier: number;
  relationId: string;
  rewardAttack: string | null;
  rewardText: string;
  unlockText: string;
  palette: string[];
  accessory: string;
}>;

export function leagueVictoryIds(meta: Partial<CampaignMetaState>): string[];
export function leagueRank(meta: Partial<CampaignMetaState>): { id: string; label: string; level: number; wins: number };
export function opponentUnlockState(meta: Partial<CampaignMetaState>, id: string): { unlocked: boolean; reason: string };
export function leaguePhase(id: string, ratio: number): string;
export function attackAnimationKey(id: string): string;
export function battleDeltaSummary(before: Partial<CampaignMetaState>, after: Partial<CampaignMetaState>, opponentId: string): {
  weekendScore: number;
  scoreBefore: number;
  scoreAfter: number;
  relationship: number;
  relationBefore: number;
  relationAfter: number;
  attempts: number;
  wins: number;
  rankBefore: ReturnType<typeof leagueRank>;
  rankAfter: ReturnType<typeof leagueRank>;
  mastery: Array<{ id: string; uses: number; successes: number; levelBefore: number; levelAfter: number }>;
  unlocked: string[];
};
