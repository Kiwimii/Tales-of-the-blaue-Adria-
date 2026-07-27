import { useEffect, useState } from 'react';
import type { ReactElement } from 'react';
import { createPortal } from 'react-dom';
import { gameStore } from '../game/state/GameStore';
import type { GameSnapshot } from '../game/types';
import { MobileGameControls, SceneCloseButton } from './MobileGameControls';

interface PortalTargets {
  frame: HTMLElement | null;
  encounter: HTMLElement | null;
  relationships: HTMLElement | null;
}

const EMPTY_TARGETS: PortalTargets = { frame: null, encounter: null, relationships: null };

export function GlobalGameControls(): ReactElement {
  const [snapshot, setSnapshot] = useState<GameSnapshot>(() => gameStore.snapshot());
  const [targets, setTargets] = useState<PortalTargets>(EMPTY_TARGETS);

  useEffect(() => gameStore.subscribe(setSnapshot), []);

  useEffect(() => {
    const refresh = (): void => {
      const next: PortalTargets = {
        frame: document.querySelector<HTMLElement>('.game-frame'),
        encounter: document.querySelector<HTMLElement>('.encounter-card'),
        relationships: document.querySelector<HTMLElement>('.relationship-panel'),
      };
      setTargets((current) => (
        current.frame === next.frame
        && current.encounter === next.encounter
        && current.relationships === next.relationships
          ? current
          : next
      ));
    };

    refresh();
    const observer = new MutationObserver(refresh);
    observer.observe(document.body, { childList: true, subtree: true });
    window.addEventListener('resize', refresh);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', refresh);
    };
  }, []);

  const movementActive = snapshot.mode === 'world'
    || (snapshot.mode === 'interior' && Boolean(snapshot.currentInterior));
  const phaserWindowOpen = snapshot.mode !== 'world' && snapshot.mode !== 'shop';

  return (
    <>
      {targets.frame && movementActive && !snapshot.encounter
        ? createPortal(<MobileGameControls />, targets.frame)
        : null}
      {targets.frame && phaserWindowOpen && !snapshot.encounter
        ? createPortal(<SceneCloseButton />, targets.frame)
        : null}
      {targets.encounter
        ? createPortal(
          <button
            type="button"
            className="dialog-x-button"
            aria-label="Gespräch schließen"
            title="Zurück zur Welt"
            onClick={() => gameStore.closeEncounter()}
          >
            ×
          </button>,
          targets.encounter,
        )
        : null}
      {targets.relationships
        ? createPortal(
          <button
            type="button"
            className="dialog-x-button"
            aria-label="Beziehungsfenster schließen"
            title="Fenster schließen"
            onClick={() => {
              targets.relationships?.querySelector<HTMLButtonElement>('header .quiet-button')?.click();
            }}
          >
            ×
          </button>,
          targets.relationships,
        )
        : null}
    </>
  );
}
