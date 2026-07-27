import { useEffect, useState } from 'react';
import type { PointerEvent as ReactPointerEvent, ReactElement } from 'react';
import { createPortal } from 'react-dom';
import { sendDirection } from '../game/events';
import { DIALOG_TOUCH_GUARD_MS } from '../game/touchInteraction';
import { gameStore } from '../game/state/GameStore';
import type { Direction, GameSnapshot } from '../game/types';
import { MobileGameControls, SceneCloseButton } from './MobileGameControls';
import '../dialogGuard.css';

interface PortalTargets {
  frame: HTMLElement | null;
  encounter: HTMLElement | null;
  encounterResult: HTMLElement | null;
  relationships: HTMLElement | null;
}

const EMPTY_TARGETS: PortalTargets = {
  frame: null,
  encounter: null,
  encounterResult: null,
  relationships: null,
};
const ALL_DIRECTIONS: Direction[] = ['up', 'down', 'left', 'right'];

export function GlobalGameControls(): ReactElement {
  const [snapshot, setSnapshot] = useState<GameSnapshot>(() => gameStore.snapshot());
  const [targets, setTargets] = useState<PortalTargets>(EMPTY_TARGETS);

  useEffect(() => gameStore.subscribe(setSnapshot), []);

  useEffect(() => {
    releaseAllDirections();
  }, [snapshot.encounter?.id, snapshot.encounter?.result?.optionId]);

  useEffect(() => {
    const refresh = (): void => {
      const next: PortalTargets = {
        frame: document.querySelector<HTMLElement>('.game-frame'),
        encounter: document.querySelector<HTMLElement>('.encounter-card'),
        encounterResult: document.querySelector<HTMLElement>('.encounter-result'),
        relationships: document.querySelector<HTMLElement>('.relationship-panel'),
      };
      setTargets((current) => (
        current.frame === next.frame
        && current.encounter === next.encounter
        && current.encounterResult === next.encounterResult
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
  const closeEncounter = (): void => {
    releaseAllDirections();
    gameStore.closeEncounter();
  };

  return (
    <>
      {targets.frame && movementActive && !snapshot.encounter
        ? createPortal(<MobileGameControls />, targets.frame)
        : null}
      {targets.frame && phaserWindowOpen && !snapshot.encounter
        ? createPortal(<SceneCloseButton />, targets.frame)
        : null}
      {targets.encounter && snapshot.encounter && !snapshot.encounter.result
        ? createPortal(
          <EncounterTouchGuard key={snapshot.encounter.id} />,
          targets.encounter,
        )
        : null}
      {targets.encounter
        ? createPortal(
          <button
            type="button"
            className="dialog-x-button"
            aria-label="Gespräch schließen"
            title="Zurück zur Welt"
            onClick={closeEncounter}
          >
            ×
          </button>,
          targets.encounter,
        )
        : null}
      {targets.encounterResult && snapshot.encounter?.result
        ? createPortal(
          <button
            type="button"
            className="encounter-world-return"
            onClick={closeEncounter}
          >
            Gespräch schließen und weiterlaufen
          </button>,
          targets.encounterResult,
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

function EncounterTouchGuard(): ReactElement | null {
  const [locked, setLocked] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setLocked(false), DIALOG_TOUCH_GUARD_MS);
    return () => window.clearTimeout(timer);
  }, []);

  if (!locked) return null;
  const block = (event: ReactPointerEvent<HTMLDivElement>): void => {
    event.preventDefault();
    event.stopPropagation();
  };
  return (
    <div
      className="dialog-input-guard"
      aria-hidden="true"
      onPointerDown={block}
      onPointerUp={block}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
      }}
    />
  );
}

function releaseAllDirections(): void {
  for (const direction of ALL_DIRECTIONS) sendDirection(direction, false);
}
