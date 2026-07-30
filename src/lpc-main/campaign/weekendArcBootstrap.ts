import { GameStore, type StorageAdapter } from '../../game/state/GameStore';
import { campaignMeta } from './metaStore';
import { handleWeekendArcMinigame, installWeekendArc } from './weekendArc';
import type { MiniGameId, MiniGameOutcome } from './minigames';

const SAVE_KEY = 'tales-blaue-adria-lpc-main-v1';

class NamespacedStorage implements StorageAdapter {
  getItem(): string | null { return localStorage.getItem(SAVE_KEY); }
  setItem(_key: string, value: string): void { localStorage.setItem(SAVE_KEY, value); }
  removeItem(): void { localStorage.removeItem(SAVE_KEY); }
}

const storage = new NamespacedStorage();
const arcStore = new GameStore(storage);
let lastSerialized = localStorage.getItem(SAVE_KEY) ?? '';
let baseAtLastOpen = lastSerialized;

function refreshStore(notify = true): void {
  const serialized = localStorage.getItem(SAVE_KEY) ?? '';
  if (serialized === lastSerialized) return;
  const fresh = new GameStore(storage) as unknown as { state: unknown };
  const internal = arcStore as unknown as { state: unknown; listeners: Set<(snapshot: ReturnType<GameStore['snapshot']>) => void> };
  internal.state = fresh.state;
  lastSerialized = serialized;
  if (notify) {
    const snapshot = arcStore.snapshot();
    internal.listeners.forEach((listener) => listener(snapshot));
  }
}

function snapshot() {
  refreshStore(false);
  return campaignMeta.augmentSnapshot(arcStore.snapshot());
}

installWeekendArc({
  store: arcStore,
  getSnapshot: snapshot,
  startMinigame: (id: MiniGameId) => window.dispatchEvent(new CustomEvent('lpc-campaign-start-minigame', { detail: id })),
  animate: (id: string | undefined, animation: string) => window.dispatchEvent(new CustomEvent('lpc-campaign-animation', { detail: { id, animation } })),
  renderHud: () => window.dispatchEvent(new CustomEvent('lpc-campaign-external-refresh')),
});

window.addEventListener('lpc-campaign-minigame-outcome', ((event: CustomEvent<MiniGameOutcome>) => {
  refreshStore(false);
  handleWeekendArcMinigame(event.detail);
  lastSerialized = localStorage.getItem(SAVE_KEY) ?? '';
}) as EventListener);

window.setInterval(() => refreshStore(true), 650);

window.addEventListener('click', (event) => {
  const target = (event.target as Element | null)?.closest?.('#open-weekend-arc,#weekend-arc-close,[data-arc-action="close"]');
  if (!target) return;
  if (target.id === 'open-weekend-arc') baseAtLastOpen = localStorage.getItem(SAVE_KEY) ?? '';
  if (target.id === 'weekend-arc-close' || target.getAttribute('data-arc-action') === 'close') {
    const current = localStorage.getItem(SAVE_KEY) ?? '';
    if (current !== baseAtLastOpen) window.setTimeout(() => location.reload(), 40);
  }
}, true);
