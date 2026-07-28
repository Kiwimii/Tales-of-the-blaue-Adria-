import { GameStore } from '../../game/state/GameStore';
import type { Needs, SessionState, WeekendMetrics } from '../../game/types';

interface StoreInternals {
  state: SessionState;
  emit: () => void;
  syncProgress: () => void;
  addChronicle: (text: string, tone: 'good' | 'neutral' | 'warn' | 'bad') => void;
}

function internals(store: GameStore): StoreInternals {
  return store as unknown as StoreInternals;
}

export function consumeCampaignItem(store: GameStore, itemId: string, amount = 1): boolean {
  const internal = internals(store);
  if ((internal.state.inventory[itemId] ?? 0) < amount) return false;
  internal.state.inventory[itemId] -= amount;
  internal.addChronicle?.(`${itemId} weitergegeben.`, 'neutral');
  internal.syncProgress?.();
  internal.emit();
  return true;
}

export function adjustCampaignNeeds(store: GameStore, changes: Partial<Needs>, minutes = 0): void {
  if (minutes > 0) store.advanceMinutes(minutes);
  const internal = internals(store);
  for (const [key, delta] of Object.entries(changes)) {
    const id = key as keyof Needs;
    internal.state.needs[id] = clamp(internal.state.needs[id] + (delta ?? 0), 0, 100);
  }
  internal.syncProgress?.();
  internal.emit();
}

export function adjustCampaignMetrics(store: GameStore, changes: Partial<WeekendMetrics>, chronicle?: string): void {
  const internal = internals(store);
  for (const [key, delta] of Object.entries(changes)) {
    const id = key as keyof WeekendMetrics;
    const min = id === 'momentum' ? -50 : 0;
    internal.state.metrics[id] = clamp(internal.state.metrics[id] + (delta ?? 0), min, 100);
  }
  if (chronicle) internal.addChronicle?.(chronicle, 'neutral');
  internal.emit();
}

export function adjustCampaignRelationship(store: GameStore, characterId: string, delta: number): void {
  const internal = internals(store);
  internal.state.relationships[characterId] = clamp((internal.state.relationships[characterId] ?? 0) + delta, -100, 100);
  internal.emit();
}

export function setCampaignFlag(store: GameStore, flag: string, value = true): void {
  const internal = internals(store);
  internal.state.flags[flag] = value;
  internal.syncProgress?.();
  internal.emit();
}

export function addCampaignChronicle(store: GameStore, text: string, tone: 'good' | 'neutral' | 'warn' | 'bad' = 'neutral'): void {
  const internal = internals(store);
  internal.addChronicle?.(text, tone);
  internal.emit();
}

function clamp(value: number, min: number, max: number): number { return Math.max(min, Math.min(max, value)); }
