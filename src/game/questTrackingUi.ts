import { FRIEND_IDS, QUESTS } from './content';
import type { GameSnapshot } from './types';

export const TRACKED_QUEST_STORAGE_KEY = 'tales-adria-tracked-quest';
export const TRACKED_QUEST_CHANGED_EVENT = 'tales:tracked-quest-changed';

export type QuestTrackingUiState = Pick<GameSnapshot, 'quests' | 'activeQuest' | 'flags' | 'needs'>;

export interface TrackedQuestUi {
  questId: string;
  title: string;
  objective: string;
  targetLabel: string;
}

export function activeQuestIds(state: QuestTrackingUiState): string[] {
  return Object.keys(QUESTS).filter((id) => state.quests[id]?.status === 'active');
}

export function currentTrackedQuestId(state: QuestTrackingUiState): string | null {
  const active = activeQuestIds(state);
  if (!active.length) return null;
  const stored = readStoredQuestId();
  if (stored && active.includes(stored)) return stored;
  if (state.activeQuest && active.includes(state.activeQuest)) return state.activeQuest;
  return active[0];
}

export function setTrackedQuestId(id: string, state: QuestTrackingUiState): boolean {
  if (state.quests[id]?.status !== 'active') return false;
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(TRACKED_QUEST_STORAGE_KEY, id);
    window.dispatchEvent(new CustomEvent(TRACKED_QUEST_CHANGED_EVENT, { detail: { id } }));
  }
  return true;
}

export function trackedQuestUi(state: QuestTrackingUiState, questId = currentTrackedQuestId(state)): TrackedQuestUi | null {
  if (!questId || state.quests[questId]?.status !== 'active') return null;
  const definition = QUESTS[questId];
  if (!definition) return null;

  if (questId === 'entry') {
    const objective = !state.flags.arrivalDocumentsFound
      ? 'Öffne den Kofferraum und suche die Reservierungsunterlagen.'
      : !state.flags.reservationSolved
        ? 'Vergleiche die Unterlagen mit dem Reservierungsbrett.'
        : !state.flags.gundulaConvinced
          ? 'Melde die Gruppe bei Gundula an.'
          : !state.flags.uliInspectionPassed
            ? 'Bestehe Ulis Kontrolle.'
            : !state.flags.entryDebateWon
              ? 'Gewinne die Einlassdiskussion an der Schranke.'
              : !state.flags.carParkedAtTaucherplatz
                ? 'Bringe den Wagen zum Taucherplatz.'
                : !state.flags.powerAccessOrganized
                  ? 'Organisiere den Stromanschluss.'
                  : !state.flags.firstBeerOpened
                    ? 'Lade aus und öffne das erste Bier.'
                    : definition.objective;
    return { questId, title: definition.title, objective, targetLabel: 'Nächstes Ankunftsziel' };
  }

  if (questId === 'reunion') {
    const found = FRIEND_IDS.filter((id) => state.flags[`met-${id}`]).length;
    return {
      questId,
      title: definition.title,
      objective: `Finde die Freundesgruppe auf dem Platz (${found}/${FRIEND_IDS.length}).`,
      targetLabel: 'Nächste fehlende Person',
    };
  }

  if (questId === 'recovery') {
    const missing: string[] = [];
    if (state.needs.energy < 65) missing.push('Energie');
    if (state.needs.thirst > 45) missing.push('Durst');
    if (state.needs.hangover > 25) missing.push('Kater');
    return {
      questId,
      title: definition.title,
      objective: missing.length ? `Stabilisiere ${missing.join(', ')}.` : definition.objective,
      targetLabel: 'Eigenes Zelt und Vorräte',
    };
  }

  const labels: Record<string, string> = {
    paper: 'Manni am Sanitärgebäude',
    rival: 'Ronny und das Camping-Duell',
    flip: 'Flip Cup am Partyzelt',
    pong: 'Beer Pong am Partyzelt',
    flunky: 'Flunkyball am Strand',
  };
  return { questId, title: definition.title, objective: definition.objective, targetLabel: labels[questId] ?? 'Questziel' };
}

function readStoredQuestId(): string | null {
  if (typeof window === 'undefined') return null;
  const value = window.localStorage.getItem(TRACKED_QUEST_STORAGE_KEY);
  return value && QUESTS[value] ? value : null;
}
