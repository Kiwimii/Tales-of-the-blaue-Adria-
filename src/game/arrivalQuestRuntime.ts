import { ARRIVAL_ENCOUNTERS } from './arrivalEncounters';
import { arrivalObjective } from './arrivalQuest';
import { ENCOUNTERS, QUESTS } from './content';
import type { GameStore } from './state/GameStore';
import type { GameSnapshot } from './types';

const installedStores = new WeakSet<object>();

export function installArrivalQuestRuntime(store: GameStore): void {
  Object.assign(ENCOUNTERS, ARRIVAL_ENCOUNTERS);
  QUESTS.entry = {
    id: 'entry',
    title: 'Der Weg zum Taucherplatz',
    objective: 'Finde die Reservierung, überstehe die Einlasskontrolle und beziehe den Taucherplatz.',
    reward: 'Taucherplatz, Strom und das erste Bier',
  };

  if (installedStores.has(store)) return;
  installedStores.add(store);

  const originalSnapshot = store.snapshot.bind(store);
  const patchedSnapshot = (): GameSnapshot => {
    const snapshot = originalSnapshot();
    if (snapshot.quests.entry?.status !== 'active' || snapshot.flags.firstBeerOpened) return snapshot;
    return { ...snapshot, currentObjective: arrivalObjective(snapshot) };
  };

  (store as unknown as { snapshot: () => GameSnapshot }).snapshot = patchedSnapshot;
}
