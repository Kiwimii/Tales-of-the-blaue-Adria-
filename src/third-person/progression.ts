export const THIRD_PERSON_PROGRESS_KEY = 'tales-blaue-adria-third-person-progress-v1';

export const REUNION_IDS = ['andre', 'rene', 'lars', 'danny', 'gregor'] as const;
export type ReunionId = (typeof REUNION_IDS)[number];

export interface QuestObjective {
  id: string;
  targetId: string | null;
  kicker: string;
  title: string;
  text: string;
}

export interface ActivityResult {
  attempts: number;
  best: number;
  completed: boolean;
}

export interface ThirdPersonProgress {
  version: 1;
  questIndex: number;
  completedInteractions: string[];
  metFriends: ReunionId[];
  campfireComplete: boolean;
  activityResults: Record<string, ActivityResult>;
  player: { x: number; z: number; yaw: number } | null;
  updatedAt: number;
}

export const ARRIVAL_QUEST: readonly QuestObjective[] = [
  {
    id: 'trunk', targetId: 'trunk', kicker: 'ANKUNFT · 1/9', title: 'Erst einmal ausladen',
    text: 'Öffne den Kofferraum auf dem Parkplatz. Ohne Gepäck ist das hier nur ein sehr langer Spaziergang.',
  },
  {
    id: 'reservationBoard', targetId: 'reservationBoard', kicker: 'ANKUNFT · 2/9', title: 'Der Name auf der Liste',
    text: 'Prüfe die Reservierung am Schwarzen Brett vor der Rezeption.',
  },
  {
    id: 'gundula', targetId: 'gundula', kicker: 'ANKUNFT · 3/9', title: 'Die Schranke hat zwei Namen',
    text: 'Sprich mit Gundula und Uli. Danach kann sich die Schranke widerwillig öffnen.',
  },
  {
    id: 'taucherplatz', targetId: 'taucherplatz', kicker: 'ANKUNFT · 4/9', title: 'Zum Taucherplatz',
    text: 'Folge dem Hauptweg bis zum Wagen am Zeltkreis.',
  },
  {
    id: 'powerBox', targetId: 'powerBox', kicker: 'ANKUNFT · 5/9', title: 'Strom vor Stimmung',
    text: 'Verbinde den Stromkasten am östlichen Versorgungsrand.',
  },
  {
    id: 'drinks', targetId: 'drinks', kicker: 'ANKUNFT · 6/9', title: 'Die sensible Fracht',
    text: 'Lade die Getränkekisten aus dem Wagen.',
  },
  {
    id: 'tents', targetId: 'tents', kicker: 'ANKUNFT · 7/9', title: 'Ein Dach aus Stoff',
    text: 'Nimm die Zeltsäcke aus dem Wagen.',
  },
  {
    id: 'cable', targetId: 'cable', kicker: 'ANKUNFT · 8/9', title: 'Kabelsalat mit Absicht',
    text: 'Platziere die Kabeltrommel zwischen Wagen und Stromkasten.',
  },
  {
    id: 'firstBeer', targetId: 'firstBeer', kicker: 'ANKUNFT · 9/9', title: 'Platz offiziell gegründet',
    text: 'Öffne das erste Bier am Zeltkreis. Deutsches Campingrecht verlangt offenbar Rituale.',
  },
] as const;

export function createDefaultProgress(now = Date.now()): ThirdPersonProgress {
  return {
    version: 1,
    questIndex: 0,
    completedInteractions: [],
    metFriends: [],
    campfireComplete: false,
    activityResults: {},
    player: null,
    updatedAt: now,
  };
}

export function loadProgress(storage: Pick<Storage, 'getItem'>, now = Date.now()): ThirdPersonProgress {
  try {
    const raw = storage.getItem(THIRD_PERSON_PROGRESS_KEY);
    if (!raw) return createDefaultProgress(now);
    return normalizeProgress(JSON.parse(raw), now);
  } catch {
    return createDefaultProgress(now);
  }
}

export function normalizeProgress(value: unknown, now = Date.now()): ThirdPersonProgress {
  const input = value && typeof value === 'object' ? value as Partial<ThirdPersonProgress> : {};
  const completedInteractions = Array.isArray(input.completedInteractions)
    ? [...new Set(input.completedInteractions.filter((entry): entry is string => typeof entry === 'string'))]
    : [];
  const metFriends = Array.isArray(input.metFriends)
    ? [...new Set(input.metFriends.filter((entry): entry is ReunionId => REUNION_IDS.includes(entry as ReunionId)))]
    : [];
  const player = validPlayer(input.player) ? { x: input.player.x, z: input.player.z, yaw: input.player.yaw } : null;
  const activityResults: Record<string, ActivityResult> = {};
  if (input.activityResults && typeof input.activityResults === 'object') {
    for (const [id, raw] of Object.entries(input.activityResults)) {
      if (!raw || typeof raw !== 'object') continue;
      const result = raw as Partial<ActivityResult>;
      activityResults[id] = {
        attempts: clampInteger(result.attempts, 0, 999),
        best: clampNumber(result.best, 0, 100),
        completed: Boolean(result.completed),
      };
    }
  }
  return {
    version: 1,
    questIndex: clampInteger(input.questIndex, 0, ARRIVAL_QUEST.length),
    completedInteractions,
    metFriends,
    campfireComplete: Boolean(input.campfireComplete),
    activityResults,
    player,
    updatedAt: Number.isFinite(input.updatedAt) ? Number(input.updatedAt) : now,
  };
}

export function saveProgress(storage: Pick<Storage, 'setItem'>, progress: ThirdPersonProgress, now = Date.now()): void {
  progress.updatedAt = now;
  storage.setItem(THIRD_PERSON_PROGRESS_KEY, JSON.stringify(progress));
}

export function currentObjective(progress: ThirdPersonProgress): QuestObjective {
  const arrival = ARRIVAL_QUEST[progress.questIndex];
  if (arrival) return arrival;

  const missing = REUNION_IDS.find((id) => !progress.metFriends.includes(id));
  if (missing) {
    const number = progress.metFriends.length + 1;
    return {
      id: `meet-${missing}`,
      targetId: missing,
      kicker: `WIEDERSEHEN · ${number}/${REUNION_IDS.length}`,
      title: 'Die Gruppe zusammensuchen',
      text: `Finde ${friendName(missing)} und bring die alte Ordnung ein kleines Stück weiter durcheinander.`,
    };
  }

  if (!progress.campfireComplete) {
    return {
      id: 'campfire', targetId: 'campfire', kicker: 'WIEDERSEHEN · FINALE', title: 'Alle ans Feuer',
      text: 'Trefft euch an der Feuerstelle im Zeltkreis und gründet das aktive Team.',
    };
  }

  return {
    id: 'free-roam', targetId: 'beerPong', kicker: 'FREIES WOCHENENDE', title: 'Die Blaue Adria gehört euch',
    text: 'Erkunde den Platz, sprich mit den Figuren und probiere die markierten Aktivitäten aus.',
  };
}

export function completeQuestInteraction(progress: ThirdPersonProgress, interactionId: string): boolean {
  const objective = ARRIVAL_QUEST[progress.questIndex];
  if (!objective || objective.id !== interactionId) return false;
  if (!progress.completedInteractions.includes(interactionId)) progress.completedInteractions.push(interactionId);
  progress.questIndex += 1;
  return true;
}

export function meetFriend(progress: ThirdPersonProgress, id: string): boolean {
  if (!REUNION_IDS.includes(id as ReunionId) || progress.metFriends.includes(id as ReunionId)) return false;
  progress.metFriends.push(id as ReunionId);
  return true;
}

export function completeCampfire(progress: ThirdPersonProgress): boolean {
  if (progress.metFriends.length < REUNION_IDS.length || progress.campfireComplete) return false;
  progress.campfireComplete = true;
  return true;
}

export function recordActivity(progress: ThirdPersonProgress, id: string, score: number): ActivityResult {
  const previous = progress.activityResults[id] ?? { attempts: 0, best: 0, completed: false };
  const next = {
    attempts: previous.attempts + 1,
    best: Math.max(previous.best, clampNumber(score, 0, 100)),
    completed: previous.completed || score >= 58,
  };
  progress.activityResults[id] = next;
  return next;
}

export function isGateOpen(progress: ThirdPersonProgress): boolean {
  return progress.questIndex > ARRIVAL_QUEST.findIndex((objective) => objective.id === 'gundula');
}

export function friendName(id: ReunionId): string {
  return ({ andre: 'André', rene: 'René', lars: 'Lars', danny: 'Danny', gregor: 'Gregor' })[id];
}

function validPlayer(value: ThirdPersonProgress['player'] | undefined): value is NonNullable<ThirdPersonProgress['player']> {
  return Boolean(value && Number.isFinite(value.x) && Number.isFinite(value.z) && Number.isFinite(value.yaw));
}

function clampInteger(value: unknown, min: number, max: number): number {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? Math.max(min, Math.min(max, Math.floor(numeric))) : min;
}

function clampNumber(value: unknown, min: number, max: number): number {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? Math.max(min, Math.min(max, numeric)) : min;
}
