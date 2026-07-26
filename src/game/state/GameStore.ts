import { ENCOUNTERS, INITIAL_QUESTS, ITEMS, QUESTS, TEAM_MEMBERS } from '../content';
import { performanceCondition, resolveChallenge } from '../mechanics';
import type {
  ChronicleTone,
  EffectSet,
  GameMode,
  GameSnapshot,
  Needs,
  PlayerProfile,
  QuestProgress,
  QuestStatus,
  SessionState,
  TeamMember,
  WeekendMetrics,
} from '../types';

export const STORAGE_KEY = 'tales-blaue-adria-save-v1';

const initialState: SessionState = {
  version: 2,
  mode: 'creator',
  profile: null,
  prologue: { shoppingComplete: false, spent: 0 },
  day: 1,
  minutes: 7 * 60,
  money: 25,
  needs: {
    energy: 100,
    hunger: 8,
    thirst: 10,
    bladder: 4,
    alcohol: 0,
    highness: 0,
    hangover: 0,
    courage: 20,
  },
  metrics: {
    dignity: 60,
    chaos: 0,
    reputation: 0,
    momentum: 0,
  },
  inventory: Object.fromEntries(Object.keys(ITEMS).map((id) => [id, 0])),
  team: [],
  relationships: {
    gundula: 0,
    uli: 0,
    manni: 0,
    ronny: -8,
  },
  quests: structuredClone(INITIAL_QUESTS),
  activeQuest: 'entry',
  flags: {},
  encounter: null,
  chronicle: [],
  worldPosition: { x: 165, y: 360 },
};

type Listener = (snapshot: GameSnapshot) => void;
type LoadedState = Omit<Partial<SessionState>, 'version'> & { version?: number };

export interface StorageAdapter {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export interface ShoppingResult {
  ok: boolean;
  total: number;
  error?: string;
}

export class GameStore {
  private state: SessionState;
  private listeners = new Set<Listener>();

  constructor(private readonly storage: StorageAdapter = defaultStorage()) {
    this.state = this.load();
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    listener(this.snapshot());
    return () => this.listeners.delete(listener);
  }

  snapshot(): GameSnapshot {
    const hours = Math.floor(this.state.minutes / 60) % 24;
    const minutes = Math.floor(this.state.minutes % 60);
    const phaseLabel = hours < 6 ? 'Nacht' : hours < 12 ? 'Morgen' : hours < 18 ? 'Tag' : 'Abend';
    const activeQuest = this.state.activeQuest ? QUESTS[this.state.activeQuest] : null;

    return {
      ...structuredClone(this.state),
      clockLabel: `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`,
      phaseLabel,
      conditionLabel: performanceCondition(this.state.needs),
      currentObjective: activeQuest?.objective ?? 'Erkunde den Campingplatz und stabilisiere die Gruppe.',
    };
  }

  setProfile(profile: PlayerProfile): void {
    this.state.profile = profile;
    this.state.mode = this.state.prologue.shoppingComplete ? 'world' : 'shop';
    this.addChronicle(`${profile.name} ist bereit für ein Wochenende mit begrenzter Restvernunft.`, 'neutral');
    this.emit();
  }

  completeShopping(cart: Record<string, number>): ShoppingResult {
    const normalized = Object.fromEntries(
      Object.entries(ITEMS).map(([id, item]) => {
        const count = cart[id];
        return [id, clamp(Number.isFinite(count) ? Math.floor(count) : 0, 0, item.max)];
      }),
    );
    const total = Object.entries(normalized).reduce((sum, [id, count]) => sum + ITEMS[id].price * count, 0);

    if (total > 25) return { ok: false, total, error: 'Das 25-Euro-Budget ist überschritten.' };
    if (total <= 0) return { ok: false, total, error: 'Ganz ohne Vorräte beginnt selbst Chaos zu schlecht.' };

    this.state.inventory = normalized;
    this.state.money = 25 - total;
    this.state.prologue = { shoppingComplete: true, spent: total };
    this.state.mode = 'world';
    this.addChronicle(`Supermarkt abgeschlossen: ${total} € investiert, ${this.state.money} € Reserve.`, 'good');
    this.emit();
    return { ok: true, total };
  }

  setMode(mode: GameMode): void {
    this.state.mode = mode;
    this.emit();
  }

  setWorldPosition(x: number, y: number): void {
    this.state.worldPosition = { x, y };
    this.persist();
  }

  advanceMinutes(minutes: number): void {
    this.applyTime(minutes);
    this.syncProgress();
    this.emit();
  }

  rest(minutes = 60): void {
    const beforeEnergy = this.state.needs.energy;
    this.applyTime(minutes);
    const hours = minutes / 60;
    this.state.needs.energy = this.clamp(this.state.needs.energy + hours * 43);
    this.state.needs.courage = this.clamp(this.state.needs.courage + hours * 4);
    this.state.metrics.momentum = this.metricClamp(this.state.metrics.momentum + (this.state.needs.energy - beforeEnergy) * 0.18, 'momentum');
    this.addChronicle(`${minutes} Minuten Pause: Energie zurückgewonnen, Zeit verloren.`, 'neutral');
    this.syncProgress();
    this.emit();
  }

  relieve(): void {
    const emergency = this.state.needs.bladder >= 88;
    this.applyTime(5);
    this.state.needs.bladder = 0;
    if (emergency) {
      this.state.metrics.dignity = this.metricClamp(this.state.metrics.dignity + 2, 'dignity');
      this.state.metrics.momentum = this.metricClamp(this.state.metrics.momentum + 3, 'momentum');
    }
    this.addChronicle(emergency ? 'Sanitärgebäude in letzter Sekunde erreicht.' : 'Kurzer, strategischer Toilettenstopp.', emergency ? 'good' : 'neutral');
    this.syncProgress();
    this.emit();
  }

  useItem(itemId: string): boolean {
    const definition = ITEMS[itemId];
    if (!definition?.effects || !this.state.inventory[itemId]) return false;
    this.state.inventory[itemId] -= 1;

    for (const [key, delta] of Object.entries(definition.effects)) {
      const need = key as keyof Needs;
      this.state.needs[need] = this.clamp(this.state.needs[need] + (delta ?? 0));
    }

    if (itemId === 'bier' || itemId === 'batida') {
      this.state.metrics.chaos = this.metricClamp(this.state.metrics.chaos + (itemId === 'batida' ? 2 : 1), 'chaos');
    }
    this.state.metrics.momentum = this.metricClamp(this.state.metrics.momentum + 1, 'momentum');
    this.addChronicle(`${definition.label} benutzt.`, 'neutral');
    this.syncProgress();
    this.emit();
    return true;
  }

  openEncounter(id: string): boolean {
    if (!ENCOUNTERS[id]) return false;
    this.state.encounter = { id, result: null };
    this.emit();
    return true;
  }

  resolveEncounter(optionId: string, forcedRoll?: number): boolean {
    const active = this.state.encounter;
    if (!active || active.result) return false;
    const definition = ENCOUNTERS[active.id];
    const option = definition?.options.find((entry) => entry.id === optionId);
    if (!option) return false;
    if (option.requiredItem && !this.state.inventory[option.requiredItem]) return false;

    const resolution = resolveChallenge(this.state, option.challenge, forcedRoll);
    const succeeded = resolution.outcome === 'great' || resolution.outcome === 'success';
    this.applyEffects(succeeded ? option.success : option.failure);

    if (succeeded && option.consumeItemOnSuccess) {
      this.state.inventory[option.consumeItemOnSuccess] = Math.max(
        0,
        (this.state.inventory[option.consumeItemOnSuccess] ?? 0) - 1,
      );
    }

    if (resolution.outcome === 'great') {
      this.state.metrics.momentum = this.metricClamp(this.state.metrics.momentum + 3, 'momentum');
      this.state.metrics.dignity = this.metricClamp(this.state.metrics.dignity + 1, 'dignity');
    }
    if (resolution.outcome === 'disaster') {
      this.state.metrics.momentum = this.metricClamp(this.state.metrics.momentum - 4, 'momentum');
      this.state.metrics.dignity = this.metricClamp(this.state.metrics.dignity - 2, 'dignity');
      this.state.metrics.chaos = this.metricClamp(this.state.metrics.chaos + 2, 'chaos');
    }

    const text =
      resolution.outcome === 'great'
        ? option.greatText ?? option.successText
        : resolution.outcome === 'disaster'
          ? option.disasterText ?? option.failureText
          : succeeded
            ? option.successText
            : option.failureText;

    active.result = {
      optionId,
      outcome: resolution.outcome,
      chance: resolution.chance,
      roll: resolution.roll,
      text,
    };
    this.addChronicle(`${definition.speaker}: ${text}`, succeeded ? 'good' : resolution.outcome === 'disaster' ? 'bad' : 'warn');
    this.syncProgress();
    this.emit();
    return true;
  }

  closeEncounter(): void {
    this.state.encounter = null;
    this.emit();
  }

  recruit(member: TeamMember): void {
    if (this.state.team.some((entry) => entry.id === member.id)) return;
    this.state.team.push(structuredClone(member));
    this.addChronicle(`${member.name} schließt sich als ${member.role} an.`, 'good');
    this.emit();
  }

  recordActivity(activity: 'battle' | 'flipCup', success: boolean, quality = 'solid'): void {
    if (success && activity === 'battle' && this.state.flags.firstBattleWon) return;
    if (success && activity === 'flipCup' && this.state.flags.flipCupWon) return;

    if (activity === 'battle') {
      this.applyTime(success ? 25 : 18);
      this.state.flags.battleTried = true;
      if (success) {
        this.state.flags.firstBattleWon = true;
        this.setQuestStatus('rival', 'completed');
        this.addTeamMember('ronny');
        this.adjustRelationship('ronny', 20);
        this.adjustMetrics({ dignity: 6, reputation: 8, momentum: 7 });
        this.addChronicle('Rivalen-Ronny wurde im Camping-Duell überzeugt.', 'good');
      } else {
        this.adjustRelationship('ronny', -4);
        this.adjustMetrics({ dignity: -5, chaos: 3, momentum: -7 });
        this.addChronicle('Rückzug aus dem Camping-Duell. Ronny redet immer noch.', 'bad');
      }
    }

    if (activity === 'flipCup') {
      this.applyTime(15);
      this.state.flags.flipCupTried = true;
      if (success) {
        this.state.flags.flipCupWon = true;
        this.setQuestStatus('flip', 'completed');
        this.adjustMetrics({
          dignity: quality === 'perfect' ? 6 : 3,
          reputation: quality === 'perfect' ? 10 : 6,
          momentum: quality === 'perfect' ? 10 : 6,
        });
        this.addChronicle(`Flip Cup gewonnen${quality === 'perfect' ? ' – nahezu beleidigend sauber' : ''}.`, 'good');
      } else {
        this.adjustMetrics({ dignity: -3, chaos: 2, momentum: -4 });
        this.addChronicle('Flip Cup verloren. Der Becher hat gewonnen.', 'warn');
      }
    }

    this.syncProgress();
    this.emit();
  }

  setFlag(flag: string, value = true): void {
    this.state.flags[flag] = value;
    this.syncProgress();
    this.emit();
  }

  reset(): void {
    this.storage.removeItem(STORAGE_KEY);
    this.state = structuredClone(initialState);
    this.emit();
  }

  private applyEffects(effects: EffectSet): void {
    if (effects.needs) {
      for (const [key, delta] of Object.entries(effects.needs)) {
        const need = key as keyof Needs;
        this.state.needs[need] = this.clamp(this.state.needs[need] + (delta ?? 0));
      }
    }
    if (effects.metrics) this.adjustMetrics(effects.metrics);
    if (effects.relationships) {
      for (const [id, delta] of Object.entries(effects.relationships)) this.adjustRelationship(id, delta);
    }
    if (effects.flags) Object.assign(this.state.flags, effects.flags);
    if (effects.quests) {
      for (const [id, status] of Object.entries(effects.quests)) this.setQuestStatus(id, status);
    }
    if (effects.items) {
      for (const [id, delta] of Object.entries(effects.items)) {
        this.state.inventory[id] = Math.max(0, (this.state.inventory[id] ?? 0) + delta);
      }
    }
    if (effects.recruit) this.addTeamMember(effects.recruit);
    if (effects.minutes) this.applyTime(effects.minutes);
  }

  private applyTime(minutes: number): void {
    const safeMinutes = Math.max(0, minutes);
    this.state.minutes += safeMinutes;
    while (this.state.minutes >= 24 * 60) {
      this.state.minutes -= 24 * 60;
      this.state.day += 1;
    }

    const hours = safeMinutes / 60;
    const oldAlcohol = this.state.needs.alcohol;
    const metabolized = Math.min(oldAlcohol, hours * 4.5);
    this.state.needs.energy = this.clamp(this.state.needs.energy - hours * 5);
    this.state.needs.hunger = this.clamp(this.state.needs.hunger + hours * 7);
    this.state.needs.thirst = this.clamp(this.state.needs.thirst + hours * 9);
    this.state.needs.bladder = this.clamp(this.state.needs.bladder + hours * 5 + oldAlcohol * hours * 0.025);
    this.state.needs.alcohol = this.clamp(oldAlcohol - metabolized);
    this.state.needs.highness = this.clamp(this.state.needs.highness - hours * 3);
    this.state.needs.hangover = this.clamp(this.state.needs.hangover + metabolized * 0.18 - hours * 0.8);
    this.state.needs.courage = this.clamp(this.state.needs.courage - hours * 1.8);
    this.state.metrics.momentum = this.metricClamp(this.state.metrics.momentum - hours * 1.2, 'momentum');
  }

  private syncProgress(): void {
    if (this.state.flags.gundulaConvinced && this.state.flags.uliConvinced) {
      if (this.state.quests.entry.status !== 'completed') {
        this.state.quests.entry = { status: 'completed', stage: 99 };
        this.state.flags.gateOpen = true;
        this.addChronicle('Einlass geschafft. Das Wochenende ist offiziell entgleist.', 'good');
      }
      for (const id of ['paper', 'rival', 'flip']) {
        if (this.state.quests[id].status === 'locked') this.state.quests[id] = { status: 'active', stage: 0 };
      }
    }

    const needsRecovery =
      this.state.day >= 2
      || this.state.needs.hangover >= 30
      || this.state.needs.energy <= 35;
    if (needsRecovery && this.state.quests.recovery.status === 'locked') {
      this.state.quests.recovery = { status: 'active', stage: 0 };
    }
    if (
      this.state.quests.recovery.status === 'active'
      && this.state.needs.energy >= 65
      && this.state.needs.thirst <= 45
      && this.state.needs.hangover <= 25
    ) {
      this.state.quests.recovery = { status: 'completed', stage: 99 };
      this.state.metrics.momentum = this.metricClamp(this.state.metrics.momentum + 8, 'momentum');
      this.addChronicle('Körper halbwegs stabilisiert. Das zählt bereits als Erfolg.', 'good');
    }

    const priority = ['entry', 'paper', 'rival', 'flip', 'recovery'];
    this.state.activeQuest = priority.find((id) => this.state.quests[id]?.status === 'active') ?? null;
  }

  private setQuestStatus(id: string, status: QuestStatus): void {
    const current = this.state.quests[id] ?? { status: 'locked', stage: 0 };
    this.state.quests[id] = { ...current, status, stage: status === 'completed' ? 99 : current.stage };
  }

  private addTeamMember(id: string): void {
    const member = TEAM_MEMBERS[id];
    if (!member || this.state.team.some((entry) => entry.id === id)) return;
    this.state.team.push(structuredClone(member));
    this.addChronicle(`${member.name} verstärkt die Gruppe als ${member.role}.`, 'good');
  }

  private adjustMetrics(deltas: Partial<WeekendMetrics>): void {
    for (const [key, delta] of Object.entries(deltas)) {
      const metric = key as keyof WeekendMetrics;
      this.state.metrics[metric] = this.metricClamp(this.state.metrics[metric] + (delta ?? 0), metric);
    }
  }

  private adjustRelationship(id: string, delta: number): void {
    this.state.relationships[id] = clamp((this.state.relationships[id] ?? 0) + delta, -100, 100);
  }

  private addChronicle(text: string, tone: ChronicleTone): void {
    const previousId = this.state.chronicle.at(-1)?.id ?? 0;
    this.state.chronicle.push({
      id: previousId + 1,
      day: this.state.day,
      minutes: this.state.minutes,
      text,
      tone,
    });
    if (this.state.chronicle.length > 40) this.state.chronicle.splice(0, this.state.chronicle.length - 40);
  }

  private emit(): void {
    this.persist();
    const snapshot = this.snapshot();
    this.listeners.forEach((listener) => listener(snapshot));
  }

  private persist(): void {
    this.storage.setItem(STORAGE_KEY, JSON.stringify(this.state));
  }

  private load(): SessionState {
    try {
      const raw = this.storage.getItem(STORAGE_KEY);
      if (!raw) return structuredClone(initialState);
      const parsed = JSON.parse(raw) as LoadedState;
      if (parsed.version !== 1 && parsed.version !== 2) return structuredClone(initialState);

      const migrated = parsed.version === 1 ? this.migrateV1(parsed) : parsed;
      const result: SessionState = {
        ...structuredClone(initialState),
        ...migrated,
        version: 2,
        day: positiveInteger(migrated.day, 1),
        minutes: nonNegativeNumber(migrated.minutes, initialState.minutes),
        profile: validProfile(migrated.profile) ? migrated.profile : null,
        prologue: {
          shoppingComplete: Boolean(migrated.prologue?.shoppingComplete),
          spent: nonNegativeNumber(migrated.prologue?.spent, 0),
        },
        needs: clampedNumericObject(migrated.needs, initialState.needs, 0, 100),
        metrics: metricObject(migrated.metrics, initialState.metrics),
        inventory: clampedNumericObject(migrated.inventory, initialState.inventory, 0, 99),
        team: validTeam(migrated.team),
        relationships: clampedNumericObject(migrated.relationships, initialState.relationships, -100, 100),
        quests: questObject(migrated.quests),
        activeQuest: typeof migrated.activeQuest === 'string' ? migrated.activeQuest : 'entry',
        flags: booleanObject(migrated.flags),
        encounter: validEncounter(migrated.encounter) ? migrated.encounter : null,
        chronicle: Array.isArray(migrated.chronicle) ? migrated.chronicle.slice(-40) : [],
        worldPosition: {
          x: finiteNumber(migrated.worldPosition?.x, initialState.worldPosition.x),
          y: finiteNumber(migrated.worldPosition?.y, initialState.worldPosition.y),
        },
      };
      this.state = result;
      this.syncProgress();
      return this.state;
    } catch {
      return structuredClone(initialState);
    }
  }

  private migrateV1(parsed: LoadedState): Partial<SessionState> {
    return {
      ...parsed,
      version: 2,
      mode: parsed.profile ? 'world' : 'creator',
      prologue: { shoppingComplete: Boolean(parsed.profile), spent: 25 - (parsed.money ?? 0) },
      metrics: structuredClone(initialState.metrics),
      relationships: structuredClone(initialState.relationships),
      quests: structuredClone(initialState.quests),
      activeQuest: 'entry',
      encounter: null,
      chronicle: [],
    };
  }

  private clamp(value: number): number {
    return clamp(Math.round(value * 10) / 10, 0, 100);
  }

  private metricClamp(value: number, metric: keyof WeekendMetrics): number {
    return clamp(Math.round(value * 10) / 10, metric === 'momentum' ? -50 : 0, 100);
  }
}

export const gameStore = new GameStore();

function defaultStorage(): StorageAdapter {
  if (typeof window !== 'undefined' && window.localStorage) return window.localStorage;

  const values = new Map<string, string>();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  };
}

function validProfile(value: PlayerProfile | null | undefined): value is PlayerProfile {
  return Boolean(
    value
      && typeof value.name === 'string'
      && typeof value.skinTone === 'string'
      && typeof value.hair === 'string'
      && typeof value.shirt === 'string',
  );
}

function validEncounter(value: unknown): value is SessionState['encounter'] {
  if (value === null) return true;
  return Boolean(value && typeof value === 'object' && typeof (value as { id?: unknown }).id === 'string');
}

function validTeam(value: unknown): TeamMember[] {
  if (!Array.isArray(value)) return [];
  return value.filter((member): member is TeamMember => Boolean(
    member
      && typeof member === 'object'
      && typeof member.id === 'string'
      && typeof member.name === 'string'
      && member.bonuses
      && typeof member.bonuses.battle === 'number',
  ));
}

function questObject(value: unknown): Record<string, QuestProgress> {
  const result = structuredClone(INITIAL_QUESTS);
  if (!value || typeof value !== 'object' || Array.isArray(value)) return result;

  for (const [id, entry] of Object.entries(value)) {
    if (!entry || typeof entry !== 'object') continue;
    const status = (entry as { status?: unknown }).status;
    const stage = (entry as { stage?: unknown }).stage;
    if (!['locked', 'active', 'completed', 'failed'].includes(String(status))) continue;
    result[id] = {
      status: status as QuestStatus,
      stage: typeof stage === 'number' && Number.isFinite(stage) ? stage : 0,
    };
  }
  return result;
}

function positiveInteger(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isInteger(value) && value > 0 ? value : fallback;
}

function nonNegativeNumber(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : fallback;
}

function finiteNumber(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function clampedNumericObject<T extends object>(
  value: unknown,
  defaults: T,
  min: number,
  max: number,
): T {
  const result = { ...defaults } as Record<string, unknown>;
  if (!value || typeof value !== 'object' || Array.isArray(value)) return result as T;

  for (const [key, entry] of Object.entries(value)) {
    if (typeof entry === 'number' && Number.isFinite(entry)) result[key] = clamp(entry, min, max);
  }
  return result as T;
}

function metricObject(value: unknown, defaults: WeekendMetrics): WeekendMetrics {
  const result = clampedNumericObject(value, defaults, -50, 100);
  result.dignity = clamp(result.dignity, 0, 100);
  result.chaos = clamp(result.chaos, 0, 100);
  result.reputation = clamp(result.reputation, 0, 100);
  return result;
}

function booleanObject(value: unknown): Record<string, boolean> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};

  return Object.fromEntries(
    Object.entries(value).filter((entry): entry is [string, boolean] => typeof entry[1] === 'boolean'),
  );
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
