import { GameStore } from '../../game/state/GameStore';
import type { Needs, WeekendMetrics } from '../../game/types';
import { campaignMeta, CampaignMetaStore, type CampaignMiniResult } from './metaStore';
import {
  addCampaignChronicle,
  adjustCampaignMetrics,
  adjustCampaignNeeds,
  setCampaignFlag,
} from './storeBridge';
import type { DialogueResolution } from './dialogueV2';
import type { MiniGameContext, MiniGameId, MiniGameOutcome } from './minigamesV2';

const stores = new Set<GameStore>();
const pendingQualities = new Map<string, CampaignMiniResult['bestQuality']>();
let pendingHedgePerfect = false;
let patched = false;

installRuntimeBridge();

export function activeCampaignStore(): GameStore | undefined {
  return [...stores].at(-1);
}

export function applyDialogueRuntimeEffects(characterId: string, resolution: DialogueResolution): void {
  const store = activeCampaignStore();
  if (resolution.flags) {
    for (const [flag, value] of Object.entries(resolution.flags)) {
      campaignMeta.setFlag(flag, value);
      if (store) setCampaignFlag(store, flag, value);
    }
  }
  if (resolution.ripples) {
    for (const ripple of resolution.ripples) campaignMeta.addRelationship(ripple.id, ripple.delta);
  }
  if (store && resolution.needs && hasChanges(resolution.needs)) adjustCampaignNeeds(store, resolution.needs);
  if (store && resolution.metrics && hasChanges(resolution.metrics)) adjustCampaignMetrics(store, resolution.metrics);
  if (store && resolution.consequenceLabel) {
    const sign = resolution.relationship > 0 ? '+' : '';
    addCampaignChronicle(store, `${resolution.consequenceLabel}: ${characterId} ${sign}${resolution.relationship} Beziehung.`, resolution.success === false ? 'warn' : 'good');
  }
}

export function stageMinigameOutcome(outcome: MiniGameOutcome): void {
  pendingQualities.set(outcome.id, outcome.quality);
  pendingHedgePerfect = outcome.id === 'hedgePee' && outcome.quality === 'perfect';
}

export function applyMinigameRuntimeEffects(outcome: MiniGameOutcome): void {
  const store = activeCampaignStore();
  if (outcome.flags) {
    for (const [flag, value] of Object.entries(outcome.flags)) {
      campaignMeta.setFlag(flag, value);
      if (store) setCampaignFlag(store, flag, value);
    }
  }
  if (outcome.relationships && outcome.id !== 'maslHole') {
    for (const [id, delta] of Object.entries(outcome.relationships)) campaignMeta.addRelationship(id, delta);
  }
  if (store && outcome.metrics && outcome.id !== 'maslHole') adjustCampaignMetrics(store, outcome.metrics, outcome.chronicle);
  else if (store && outcome.chronicle) addCampaignChronicle(store, outcome.chronicle, outcome.success ? 'good' : 'warn');
}

export function currentMinigameContext(id: MiniGameId): MiniGameContext {
  const meta = campaignMeta.snapshot();
  const result = meta.miniResults[id];
  const snapshot = activeCampaignStore()?.snapshot();
  return {
    attempts: result?.attempts ?? 0,
    wins: result?.wins ?? 0,
    best: result?.best ?? 0,
    bestQuality: result?.bestQuality ?? 'failed',
    activeTeam: [...meta.activeTeam],
    flags: { ...meta.flags, ...(snapshot?.flags ?? {}) },
    needs: snapshot?.needs ?? defaultNeeds(),
  };
}

function installRuntimeBridge(): void {
  if (patched) return;
  patched = true;

  const originalSubscribe = GameStore.prototype.subscribe;
  GameStore.prototype.subscribe = function subscribeWithRuntimeCapture(listener) {
    stores.add(this);
    const unsubscribe = originalSubscribe.call(this, listener);
    return () => {
      unsubscribe();
      stores.delete(this);
    };
  };

  const originalRecordMiniGame = CampaignMetaStore.prototype.recordMiniGame;
  CampaignMetaStore.prototype.recordMiniGame = function recordMiniGameWithQuality(id, success, score, event, quality) {
    const staged = pendingQualities.get(id);
    pendingQualities.delete(id);
    return originalRecordMiniGame.call(this, id, success, score, event, quality ?? staged ?? (success ? 'solid' : 'failed'));
  };

  const originalRecordHedge = CampaignMetaStore.prototype.recordHedge;
  CampaignMetaStore.prototype.recordHedge = function recordHedgeWithQuality(success, suspicionDelta, relief, event, perfect) {
    const staged = pendingHedgePerfect;
    pendingHedgePerfect = false;
    return originalRecordHedge.call(this, success, suspicionDelta, relief, event, perfect ?? staged);
  };
}

function hasChanges<T extends Needs | WeekendMetrics>(changes: Partial<T>): boolean {
  return Object.values(changes).some((value) => typeof value === 'number' && value !== 0);
}

function defaultNeeds(): Needs {
  return { energy: 100, hunger: 0, thirst: 0, bladder: 0, alcohol: 0, highness: 0, hangover: 0, courage: 30 };
}
