import { TEAM_MEMBERS } from './content';
import type { GameStore } from './state/GameStore';
import type { ChronicleTone, EffectSet, SessionState, TeamMember, WeekendMetrics } from './types';

interface StoreInternals {
  state: SessionState;
  syncProgress: () => void;
  emit: () => void;
}

export interface TeamToggleResult {
  ok: boolean;
  active: boolean;
  reason?: string;
}

export function applySystemEffects(store: GameStore, effects: EffectSet, text?: string, tone: ChronicleTone = 'neutral'): void {
  mutateStore(store, (state, internals) => {
    if (effects.needs) {
      for (const [key, delta] of Object.entries(effects.needs)) {
        const need = key as keyof SessionState['needs'];
        state.needs[need] = clamp(state.needs[need] + (delta ?? 0), 0, 100);
      }
    }
    if (effects.metrics) adjustMetrics(state, effects.metrics);
    if (effects.relationships) {
      for (const [id, delta] of Object.entries(effects.relationships)) {
        state.relationships[id] = clamp((state.relationships[id] ?? 0) + delta, -100, 100);
      }
    }
    if (effects.flags) Object.assign(state.flags, effects.flags);
    if (effects.items) {
      for (const [id, delta] of Object.entries(effects.items)) {
        state.inventory[id] = Math.max(0, (state.inventory[id] ?? 0) + delta);
      }
    }
    if (effects.minutes) applyRawTime(state, effects.minutes);
    if (text) addChronicle(state, text, tone);
    internals.syncProgress();
  });
}

export function adjustRelationship(store: GameStore, characterId: string, delta: number, text?: string): void {
  mutateStore(store, (state) => {
    state.relationships[characterId] = clamp((state.relationships[characterId] ?? 0) + delta, -100, 100);
    if (text) addChronicle(state, text, delta >= 0 ? 'good' : 'warn');
  });
}

export function consumeInventoryItem(store: GameStore, itemId: string): boolean {
  let consumed = false;
  mutateStore(store, (state) => {
    if ((state.inventory[itemId] ?? 0) <= 0) return;
    state.inventory[itemId] -= 1;
    consumed = true;
  });
  return consumed;
}

export function toggleActiveTeamMember(store: GameStore, memberId: string, maxTeam = 3): TeamToggleResult {
  let result: TeamToggleResult = { ok: false, active: false, reason: 'Unbekannter Teampartner.' };
  mutateStore(store, (state) => {
    const existingIndex = state.team.findIndex((member) => member.id === memberId);
    if (existingIndex >= 0) {
      const [removed] = state.team.splice(existingIndex, 1);
      addChronicle(state, `${removed.name} verlässt die aktive Dreiergruppe, bleibt aber am Platz verfügbar.`, 'neutral');
      result = { ok: true, active: false };
      return;
    }
    const member = TEAM_MEMBERS[memberId];
    if (!member) return;
    if (state.team.length >= maxTeam) {
      result = { ok: false, active: false, reason: 'Die aktive Gruppe ist bereits voll. Entferne zuerst einen Partner.' };
      return;
    }
    state.team.push(structuredClone(member));
    addChronicle(state, `${member.name} wird als ${member.role} in die aktive Dreiergruppe aufgenommen.`, 'good');
    result = { ok: true, active: true };
  });
  return result;
}

export function sanitizeTeam(store: GameStore, allowedIds: Set<string>, maxTeam = 3): void {
  mutateStore(store, (state) => {
    const unique = new Map<string, TeamMember>();
    for (const member of state.team) {
      if (allowedIds.has(member.id) && !unique.has(member.id)) unique.set(member.id, member);
    }
    state.team = [...unique.values()].slice(0, maxTeam);
  });
}

export function recordMetaActivity(
  store: GameStore,
  id: string,
  success: boolean,
  score: number,
  effects: EffectSet,
  text: string,
): void {
  mutateStore(store, (state, internals) => {
    const previous = state.activityResults[id] ?? { attempts: 0, completed: false, best: 0 };
    state.activityResults[id] = {
      attempts: previous.attempts + 1,
      completed: previous.completed || success,
      best: Math.max(previous.best, score),
    };
    if (effects.needs) {
      for (const [key, delta] of Object.entries(effects.needs)) {
        const need = key as keyof SessionState['needs'];
        state.needs[need] = clamp(state.needs[need] + (delta ?? 0), 0, 100);
      }
    }
    if (effects.relationships) {
      for (const [characterId, delta] of Object.entries(effects.relationships)) {
        state.relationships[characterId] = clamp((state.relationships[characterId] ?? 0) + delta, -100, 100);
      }
    }
    if (effects.metrics) adjustMetrics(state, effects.metrics);
    if (effects.flags) Object.assign(state.flags, effects.flags);
    if (effects.minutes) applyRawTime(state, effects.minutes);
    addChronicle(state, text, success ? 'good' : 'warn');
    internals.syncProgress();
  });
}

export function mutateStore(
  store: GameStore,
  mutation: (state: SessionState, internals: StoreInternals) => void,
): void {
  const internals = store as unknown as StoreInternals;
  mutation(internals.state, internals);
  internals.emit();
}

function adjustMetrics(state: SessionState, deltas: Partial<WeekendMetrics>): void {
  for (const [key, delta] of Object.entries(deltas)) {
    const metric = key as keyof WeekendMetrics;
    const min = metric === 'momentum' ? -50 : 0;
    state.metrics[metric] = clamp(state.metrics[metric] + (delta ?? 0), min, 100);
  }
}

function applyRawTime(state: SessionState, minutes: number): void {
  const safe = Math.max(0, minutes);
  state.minutes += safe;
  while (state.minutes >= 24 * 60) {
    state.minutes -= 24 * 60;
    state.day += 1;
  }
}

function addChronicle(state: SessionState, text: string, tone: ChronicleTone): void {
  const previousId = state.chronicle.at(-1)?.id ?? 0;
  state.chronicle.push({ id: previousId + 1, day: state.day, minutes: state.minutes, text, tone });
  if (state.chronicle.length > 50) state.chronicle.splice(0, state.chronicle.length - 50);
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, Math.round(value * 10) / 10));
}
