import type { GameMode, GameSnapshot, PlayerProfile, SessionState, TeamMember } from '../types';

export const STORAGE_KEY = 'tales-blaue-adria-save-v1';

const initialState: SessionState = {
  version: 1,
  mode: 'creator',
  profile: null,
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
  },
  inventory: {
    wasser: 2,
    wuerste: 1,
    bier: 2,
    batida: 1,
  },
  team: [],
  flags: {},
  worldPosition: { x: 165, y: 360 },
};

type Listener = (snapshot: GameSnapshot) => void;

export interface StorageAdapter {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
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
    const minutes = this.state.minutes % 60;
    const phaseLabel = hours < 6 ? 'Nacht' : hours < 12 ? 'Morgen' : hours < 18 ? 'Tag' : 'Abend';

    return {
      ...structuredClone(this.state),
      clockLabel: `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`,
      phaseLabel,
    };
  }

  setProfile(profile: PlayerProfile): void {
    this.state.profile = profile;
    this.state.mode = 'world';
    this.emit();
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
    this.state.minutes += minutes;
    while (this.state.minutes >= 24 * 60) {
      this.state.minutes -= 24 * 60;
      this.state.day += 1;
    }

    const hours = minutes / 60;
    this.state.needs.energy = this.clamp(this.state.needs.energy - hours * 5);
    this.state.needs.hunger = this.clamp(this.state.needs.hunger + hours * 7);
    this.state.needs.thirst = this.clamp(this.state.needs.thirst + hours * 9);
    this.state.needs.bladder = this.clamp(this.state.needs.bladder + hours * 5 + this.state.needs.alcohol * 0.02);
    this.state.needs.alcohol = this.clamp(this.state.needs.alcohol - hours * 4);
    this.state.needs.highness = this.clamp(this.state.needs.highness - hours * 3);
    this.emit();
  }

  useItem(item: string): boolean {
    if (!this.state.inventory[item]) return false;
    this.state.inventory[item] -= 1;

    if (item === 'wasser') {
      this.state.needs.thirst = this.clamp(this.state.needs.thirst - 30);
      this.state.needs.bladder = this.clamp(this.state.needs.bladder + 12);
    }
    if (item === 'bier') {
      this.state.needs.thirst = this.clamp(this.state.needs.thirst - 8);
      this.state.needs.bladder = this.clamp(this.state.needs.bladder + 20);
      this.state.needs.alcohol = this.clamp(this.state.needs.alcohol + 18);
    }
    if (item === 'wuerste') this.state.needs.hunger = this.clamp(this.state.needs.hunger - 35);
    if (item === 'batida') {
      this.state.needs.alcohol = this.clamp(this.state.needs.alcohol + 24);
      this.state.needs.bladder = this.clamp(this.state.needs.bladder + 10);
    }

    this.emit();
    return true;
  }

  recruit(member: TeamMember): void {
    if (this.state.team.some((entry) => entry.id === member.id)) return;
    this.state.team.push(member);
    this.emit();
  }

  setFlag(flag: string, value = true): void {
    this.state.flags[flag] = value;
    this.emit();
  }

  reset(): void {
    this.storage.removeItem(STORAGE_KEY);
    this.state = structuredClone(initialState);
    this.emit();
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
      const parsed = JSON.parse(raw) as Partial<SessionState>;
      if (parsed.version !== 1) return structuredClone(initialState);

      return {
        ...structuredClone(initialState),
        ...parsed,
        version: 1,
        day: positiveInteger(parsed.day, 1),
        minutes: nonNegativeNumber(parsed.minutes, initialState.minutes),
        profile: validProfile(parsed.profile) ? parsed.profile : null,
        needs: numericObject(parsed.needs, initialState.needs),
        inventory: numericObject(parsed.inventory, initialState.inventory),
        team: Array.isArray(parsed.team) ? parsed.team : [],
        flags: booleanObject(parsed.flags),
        worldPosition: {
          x: finiteNumber(parsed.worldPosition?.x, initialState.worldPosition.x),
          y: finiteNumber(parsed.worldPosition?.y, initialState.worldPosition.y),
        },
      };
    } catch {
      return structuredClone(initialState);
    }
  }

  private clamp(value: number): number {
    return Math.max(0, Math.min(100, Math.round(value * 10) / 10));
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

function positiveInteger(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isInteger(value) && value > 0 ? value : fallback;
}

function nonNegativeNumber(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : fallback;
}

function finiteNumber(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function numericObject<T extends object>(
  value: unknown,
  defaults: T,
): T {
  const result = { ...defaults } as Record<string, unknown>;
  if (!value || typeof value !== 'object' || Array.isArray(value)) return result as T;

  for (const [key, entry] of Object.entries(value)) {
    if (typeof entry === 'number' && Number.isFinite(entry)) result[key] = entry;
  }
  return result as T;
}

function booleanObject(value: unknown): Record<string, boolean> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};

  return Object.fromEntries(
    Object.entries(value).filter((entry): entry is [string, boolean] => typeof entry[1] === 'boolean'),
  );
}
