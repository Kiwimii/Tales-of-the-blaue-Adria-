import { useEffect, useRef, useState } from 'react';
import type {
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
  ReactElement,
} from 'react';
import {
  INTERACTION_STATE_EVENT,
  requestInteractionState,
  sendAction,
  sendCycleInteraction,
  sendDirection,
  sendReturnToWorld,
  sendSelectInteraction,
  type InteractionStateDetail,
} from '../game/events';
import { clampSwipeVector, directionsForSwipe } from '../game/mobileInput';
import {
  canTriggerAction,
  isActionTap,
  shouldTriggerContextAction,
} from '../game/touchInteraction';
import type { Direction } from '../game/types';
import { interactionActionLabel } from '../game/uxPresentation';
import '../mobileControls.css';

interface Point {
  x: number;
  y: number;
}

export function MobileGameControls(): ReactElement {
  const pointerId = useRef<number | null>(null);
  const origin = useRef<Point | null>(null);
  const moveExceededTapThreshold = useRef(false);
  const activeDirections = useRef(new Set<Direction>());
  const actionPointerId = useRef<number | null>(null);
  const actionOrigin = useRef<Point | null>(null);
  const lastActionAt = useRef(Number.NEGATIVE_INFINITY);
  const [nearbyInteraction, setNearbyInteraction] = useState<InteractionStateDetail | null>(null);
  const [joystick, setJoystick] = useState<{ origin: Point; offset: Point } | null>(null);
  const [actionActive, setActionActive] = useState(false);

  useEffect(() => {
    const onInteractionState = (event: Event): void => {
      const detail = (event as CustomEvent<InteractionStateDetail>).detail;
      setNearbyInteraction(detail.id ? detail : null);
    };
    window.addEventListener(INTERACTION_STATE_EVENT, onInteractionState);
    requestInteractionState();
    return () => {
      window.removeEventListener(INTERACTION_STATE_EVENT, onInteractionState);
      releaseDirections(activeDirections.current);
    };
  }, []);

  const triggerAction = (): void => {
    const now = performance.now();
    if (!canTriggerAction(lastActionAt.current, now)) return;
    lastActionAt.current = now;
    sendAction();
  };

  const updateDirections = (x: number, y: number): void => {
    const next = new Set(directionsForSwipe(x, y));
    for (const direction of activeDirections.current) {
      if (!next.has(direction)) sendDirection(direction, false);
    }
    for (const direction of next) {
      if (!activeDirections.current.has(direction)) sendDirection(direction, true);
    }
    activeDirections.current = next;
  };

  const relativePoint = (event: ReactPointerEvent<HTMLElement>): Point => {
    const rect = event.currentTarget.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  const beginMove = (event: ReactPointerEvent<HTMLDivElement>): void => {
    if (pointerId.current !== null) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    const point = relativePoint(event);
    pointerId.current = event.pointerId;
    origin.current = point;
    moveExceededTapThreshold.current = false;
    updateDirections(0, 0);
    setJoystick({ origin: point, offset: { x: 0, y: 0 } });
  };

  const move = (event: ReactPointerEvent<HTMLDivElement>): void => {
    if (pointerId.current !== event.pointerId || !origin.current) return;
    event.preventDefault();
    const point = relativePoint(event);
    const raw = { x: point.x - origin.current.x, y: point.y - origin.current.y };
    if (!isActionTap(raw.x, raw.y)) moveExceededTapThreshold.current = true;
    const offset = clampSwipeVector(raw.x, raw.y);
    updateDirections(raw.x, raw.y);
    setJoystick({ origin: origin.current, offset });
  };

  const finishMove = (event: ReactPointerEvent<HTMLDivElement>, allowContextAction: boolean): void => {
    if (pointerId.current !== event.pointerId || !origin.current) return;
    event.preventDefault();
    const point = relativePoint(event);
    const deltaX = point.x - origin.current.x;
    const deltaY = point.y - origin.current.y;
    const movedBeyondTap = moveExceededTapThreshold.current;

    releaseDirections(activeDirections.current);
    activeDirections.current = new Set();
    pointerId.current = null;
    origin.current = null;
    moveExceededTapThreshold.current = false;
    setJoystick(null);

    if (allowContextAction && shouldTriggerContextAction(
      Boolean(nearbyInteraction?.id),
      deltaX,
      deltaY,
      movedBeyondTap,
    )) triggerAction();
  };

  const endMove = (event: ReactPointerEvent<HTMLDivElement>): void => finishMove(event, true);
  const cancelMove = (event: ReactPointerEvent<HTMLDivElement>): void => finishMove(event, false);

  const beginAction = (event: ReactPointerEvent<HTMLButtonElement>): void => {
    if (actionPointerId.current !== null) return;
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    actionPointerId.current = event.pointerId;
    actionOrigin.current = relativePoint(event);
    setActionActive(true);
  };

  const endAction = (event: ReactPointerEvent<HTMLButtonElement>): void => {
    if (actionPointerId.current !== event.pointerId || !actionOrigin.current) return;
    event.preventDefault();
    event.stopPropagation();
    const point = relativePoint(event);
    const deltaX = point.x - actionOrigin.current.x;
    const deltaY = point.y - actionOrigin.current.y;
    actionPointerId.current = null;
    actionOrigin.current = null;
    setActionActive(false);

    if (isActionTap(deltaX, deltaY)) triggerAction();
  };

  const cancelAction = (event: ReactPointerEvent<HTMLButtonElement>): void => {
    if (actionPointerId.current !== event.pointerId) return;
    event.preventDefault();
    event.stopPropagation();
    actionPointerId.current = null;
    actionOrigin.current = null;
    setActionActive(false);
  };

  const clickGuard = (event: ReactMouseEvent<HTMLButtonElement>): void => {
    event.preventDefault();
    event.stopPropagation();
  };

  const selectCandidate = (event: ReactPointerEvent<HTMLButtonElement>, id: string): void => {
    event.preventDefault();
    event.stopPropagation();
    sendSelectInteraction(id);
  };

  const cycleCandidate = (event: ReactPointerEvent<HTMLButtonElement>, direction: 1 | -1): void => {
    event.preventDefault();
    event.stopPropagation();
    sendCycleInteraction(direction);
  };

  const actionLabel = interactionActionLabel(nearbyInteraction?.prompt);
  const candidates = nearbyInteraction?.candidates ?? [];
  const selectedIndex = nearbyInteraction?.selectedIndex ?? 0;

  return (
    <div className="mobile-touch-controls" aria-label="Mobile Spielsteuerung">
      <div
        className="mobile-move-zone"
        aria-label="Links unten wischen, um die Figur zu bewegen"
        onPointerDown={beginMove}
        onPointerMove={move}
        onPointerUp={endMove}
        onPointerCancel={cancelMove}
      >
        {!joystick && <span className="mobile-move-hint"><b>WISCHEN</b><small>Figur bewegen</small></span>}
        {joystick && (
          <span className="mobile-joystick" style={{ left: joystick.origin.x, top: joystick.origin.y }}>
            <span
              className="mobile-joystick-thumb"
              style={{ transform: `translate(${joystick.offset.x}px, ${joystick.offset.y}px)` }}
            />
          </span>
        )}
      </div>

      {nearbyInteraction && (
        <div className="mobile-context-prompt" role="status" aria-live="polite">
          <span aria-hidden="true">◆</span>
          <strong>{actionLabel}</strong>
          {candidates.length > 1 && <small>{selectedIndex + 1}/{candidates.length} auswählbar</small>}
        </div>
      )}

      {candidates.length > 1 && (
        <div className="mobile-interaction-picker" role="group" aria-label="Interaktion auswählen">
          <button type="button" aria-label="Vorherige Interaktion" onPointerDown={(event) => cycleCandidate(event, -1)}>‹</button>
          <div className="mobile-interaction-options">
            {candidates.map((candidate, index) => (
              <button
                type="button"
                key={candidate.id}
                className={index === selectedIndex ? 'mobile-interaction-option mobile-interaction-option-active' : 'mobile-interaction-option'}
                aria-pressed={index === selectedIndex}
                onPointerDown={(event) => selectCandidate(event, candidate.id)}
              >
                <b>{index + 1}</b>
                <span>{interactionActionLabel(candidate.prompt)}</span>
              </button>
            ))}
          </div>
          <button type="button" aria-label="Nächste Interaktion" onPointerDown={(event) => cycleCandidate(event, 1)}>›</button>
        </div>
      )}

      <button
        type="button"
        className={`mobile-action-zone${actionActive ? ' mobile-action-active' : ''}${nearbyInteraction ? ' mobile-action-ready' : ''}`}
        aria-label={nearbyInteraction?.prompt ? `Aktion ausführen: ${nearbyInteraction.prompt}` : 'Aktion ausführen'}
        onPointerDown={beginAction}
        onPointerUp={endAction}
        onPointerCancel={cancelAction}
        onClick={clickGuard}
        onContextMenu={clickGuard}
      >
        <span className="mobile-action-glyph" aria-hidden="true">A</span>
        <span className="mobile-action-copy">
          <strong>{nearbyInteraction ? 'AUSWÄHLEN' : 'AKTION'}</strong>
          <small>{actionLabel}</small>
        </span>
      </button>
    </div>
  );
}

export function SceneCloseButton(): ReactElement {
  return (
    <button
      type="button"
      className="scene-close-button"
      aria-label="Fenster schließen und zur Welt zurückkehren"
      title="Zurück zur Welt"
      onPointerDown={(event) => {
        event.preventDefault();
        event.stopPropagation();
        sendReturnToWorld();
      }}
    >
      ×
    </button>
  );
}

function releaseDirections(directions: Set<Direction>): void {
  for (const direction of directions) sendDirection(direction, false);
}
