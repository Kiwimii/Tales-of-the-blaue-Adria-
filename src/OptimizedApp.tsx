import { useEffect, useState } from 'react';
import type { ReactElement } from 'react';
import App from './App';
import { PlayExperience } from './components/PlayExperience';
import { gameStore } from './game/state/GameStore';
import type { GameSnapshot } from './game/types';

export default function OptimizedApp(): ReactElement {
  const [snapshot, setSnapshot] = useState<GameSnapshot>(() => gameStore.snapshot());

  useEffect(() => gameStore.subscribe(setSnapshot), []);

  const playReady = Boolean(
    snapshot.prologue.introSeen
    && snapshot.profile
    && snapshot.prologue.shoppingComplete
    && snapshot.mode !== 'shop',
  );

  if (!playReady) return <App />;
  return <PlayExperience snapshot={snapshot} />;
}
