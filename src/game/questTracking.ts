import { arrivalObjective, arrivalStage, arrivalTarget } from './arrivalQuest';
import { FRIEND_IDS, QUESTS } from './content';
import type { GameSnapshot, QuestProgress } from './types';
import { WORLD_ACTIVITY_CATALOG } from './worldActivityCatalog';
import { NPC_PLACEMENTS, ENTRANCE_PLACEMENTS } from './aerialCampgroundPlan';
import { regionAt, type RegionId } from './worldV2';

export const TRACKED_QUEST_STORAGE_KEY = 'tales-adria-tracked-quest';
export const TRACKED_QUEST_CHANGED_EVENT = 'tales:tracked-quest-changed';

export type QuestTrackingState = Pick<GameSnapshot, 'quests' | 'activeQuest' | 'flags' | 'needs' | 'inventory'>;

export interface QuestTrackingTarget {
  questId: string;
  title: string;
  objective: string;
  targetLabel: string;
  x: number;
  y: number;
  regionId: RegionId;
}

const ACTIVITY_BY_QUEST: Record<string, string> = {
  rival: 'battle',
  flip: 'flip-cup',
  pong: 'beer-pong',
  flunky: 'flunkyball',
};

const ARRIVAL_LABELS = [
  'Kofferraum',
  'Reservierungsbrett',
  'Gundula',
  'Uli',
  'Einlassdiskussion',
  'Taucherplatz',
  'Stromkasten',
  'Ausrüstung ausladen',
  'Erstes Bier',
  'Taucherplatz',
] as const;

export function activeQuestIds(state: QuestTrackingState): string[] {
  return Object.keys(QUESTS).filter((id) => state.quests[id]?.status === 'active');
}

export function currentTrackedQuestId(state: QuestTrackingState): string | null {
  const active = activeQuestIds(state);
  if (!active.length) return null;
  const stored = readStoredQuestId();
  if (stored && active.includes(stored)) return stored;
  if (state.activeQuest && active.includes(state.activeQuest)) return state.activeQuest;
  return active[0];
}

export function setTrackedQuestId(id: string, state: QuestTrackingState): boolean {
  if (state.quests[id]?.status !== 'active') return false;
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(TRACKED_QUEST_STORAGE_KEY, id);
    window.dispatchEvent(new CustomEvent(TRACKED_QUEST_CHANGED_EVENT, { detail: { id } }));
  }
  return true;
}

export function questTrackingTarget(
  state: QuestTrackingState,
  questId = currentTrackedQuestId(state),
): QuestTrackingTarget | null {
  if (!questId || state.quests[questId]?.status !== 'active') return null;
  const definition = QUESTS[questId];
  if (!definition) return null;

  if (questId === 'entry') {
    const point = arrivalTarget(state);
    const stage = arrivalStage(state);
    return buildTarget(questId, definition.title, arrivalObjective(state), ARRIVAL_LABELS[stage], point.x, point.y);
  }

  if (questId === 'reunion') {
    const missing = FRIEND_IDS.find((id) => !state.flags[`met-${id}`]);
    const point = missing ? NPC_PLACEMENTS[missing] : NPC_PLACEMENTS.andre;
    const found = FRIEND_IDS.filter((id) => state.flags[`met-${id}`]).length;
    return buildTarget(
      questId,
      definition.title,
      `Finde die Freundesgruppe auf dem Platz (${found}/${FRIEND_IDS.length}).`,
      missing ? `${displayName(missing)} finden` : 'Treffpunkt der Gruppe',
      point.x,
      point.y,
    );
  }

  if (questId === 'paper') {
    const point = NPC_PLACEMENTS.manni;
    return buildTarget(questId, definition.title, definition.objective, 'Manni am Sanitärgebäude', point.x, point.y);
  }

  if (questId === 'recovery') {
    const point = ENTRANCE_PLACEMENTS['home-door'];
    const missing: string[] = [];
    if (state.needs.energy < 65) missing.push('Energie');
    if (state.needs.thirst > 45) missing.push('Durst');
    if (state.needs.hangover > 25) missing.push('Kater');
    const objective = missing.length
      ? `Stabilisiere ${missing.join(', ')} am eigenen Zelt oder mit Vorräten.`
      : 'Halte deinen Zustand stabil, bis die Erholung abgeschlossen ist.';
    return buildTarget(questId, definition.title, objective, 'Eigenes Zelt und Vorräte', point.x, point.y);
  }

  const activityId = ACTIVITY_BY_QUEST[questId];
  const activity = WORLD_ACTIVITY_CATALOG.find((entry) => entry.id === activityId);
  if (activity) return buildTarget(questId, definition.title, definition.objective, activity.label, activity.x, activity.y);
  return null;
}

export function questDistanceMetres(from: { x: number; y: number }, target: { x: number; y: number }): number {
  return Math.max(0, Math.round(Math.hypot(target.x - from.x, target.y - from.y) / 5));
}

export function questTrackingLabel(state: QuestTrackingState): string {
  const target = questTrackingTarget(state);
  return target ? `${target.title} · ${target.targetLabel}` : 'Keine Quest verfolgt';
}

function buildTarget(
  questId: string,
  title: string,
  objective: string,
  targetLabel: string,
  x: number,
  y: number,
): QuestTrackingTarget {
  return { questId, title, objective, targetLabel, x, y, regionId: regionAt(x, y).id };
}

function displayName(id: string): string {
  const names: Record<string, string> = {
    andre: 'André', rene: 'René', lars: 'Lars', danny: 'Danny', gregor: 'Gregor', felix: 'Felix',
    masl: 'Masl', schubert: 'Schubert', schima: 'Schima',
  };
  return names[id] ?? id;
}

function readStoredQuestId(): string | null {
  if (typeof window === 'undefined') return null;
  const value = window.localStorage.getItem(TRACKED_QUEST_STORAGE_KEY);
  return value && QUESTS[value] ? value : null;
}

export function normalizeQuestProgress(value: Record<string, QuestProgress>): Record<string, QuestProgress> {
  return value;
}
