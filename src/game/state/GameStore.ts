import type { GameMode, GameSnapshot, PlayerProfile, SessionState, TeamMember } from '../types';

const STORAGE_KEY = 'tales-blaue-adria-save-v1';

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

class GameStore {
  private state: SessionState = this.load();
  private listeners = new Set<Listener>();

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
    localStorage.removeItem(STORAGE_KEY);
    this.state = structuredClone(initialState);
    this.emit();
  }

  private emit(): void {
    this.persist();
    const snapshot = this.snapshot();
    this.listeners.forEach((listener) => listener(snapshot));
  }

  private persist(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
  }

  private load(): SessionState {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return structuredClone(initialState);
      const parsed = JSON.parse(raw) as SessionState;
      return parsed.version === 1 ? parsed : structuredClone(initialState);
    } catch {
      return structuredClone(initialState);
    }
  }

  private clamp(value: number): number {
    return Math.max(0, Math.min(100, Math.round(value * 10) / 10));
  }
}

export const gameStore = new GameStore();
