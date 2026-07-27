import { useEffect, useRef, useState } from 'react';
import type {
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
  ReactElement,
} from 'react';
import { sendAction, sendDirection, sendReturnToWorld } from '../game/events';
import { clampSwipeVector, directionsForSwipe } from '../game/mobileInput';
import { isActionTap } from '../game/touchInteraction';
import type { Direction } from '../game/types';
import '../mobileControls.css';

interface Point {
  x: number;
  y: number;
}

export function MobileGameControls(): ReactElement {
  const pointerId = useRef<number | null>(null);
  const origin = useRef<Point | null>(null);
  const activeDirections = useRef(new Set<Direction>());
  const actionPointerId = useRef<number | null>(null);
  const actionOrigin = useRef<Point | null>(null);
  const scheduledAction = useRef<number | null>(null);
  const [joystick, setJoystick] = useState<{ origin: Point; offset: Point } | null>(null);
  const [actionActive, setActionActive] = useState(false);

  useEffect(() => () => {
    releaseDirections(activeDirections.current);
    if (scheduledAction.current !== null) window.clearTimeout(scheduledAction.current);
  }, []);

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
    updateDirections(0, 0);
    setJoystick({ origin: point, offset: { x: 0, y: 0 } });
  };

  const move = (event: ReactPointerEvent<HTMLDivElement>): void => {
    if (pointerId.current !== event.pointerId || !origin.current) return;
    event.preventDefault();
    const point = relativePoint(event);
    const raw = { x: point.x - origin.current.x, y: point.y - origin.current.y };
    const offset = clampSwipeVector(raw.x, raw.y);
    updateDirections(raw.x, raw.y);
    setJoystick({ origin: origin.current, offset });
  };

  const endMove = (event: ReactPointerEvent<HTMLDivElement>): void => {
    if (pointerId.current !== event.pointerId) return;
    event.preventDefault();
    releaseDirections(activeDirections.current);
    activeDirections.current = new Set();
    pointerId.current = null;
    origin.current = null;
    setJoystick(null);
  };

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

    if (!isActionTap(deltaX, deltaY)) return;
    if (scheduledAction.current !== null) window.clearTimeout(scheduledAction.current);
    scheduledAction.current = window.setTimeout(() => {
      scheduledAction.current = null;
      sendAction();
    }, 0);
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

  return (
    <div className="mobile-touch-controls" aria-label="Mobile Spielsteuerung">
      <div
        className="mobile-move-zone"
        aria-label="Links unten wischen, um die Figur zu bewegen"
        onPointerDown={beginMove}
        onPointerMove={move}
        onPointerUp={endMove}
        onPointerCancel={endMove}
      >
        {!joystick && <span className="mobile-move-hint">LINKS WISCHEN · LAUFEN</span>}
        {joystick && (
          <span className="mobile-joystick" style={{ left: joystick.origin.x, top: joystick.origin.y }}>
            <span
              className="mobile-joystick-thumb"
              style={{ transform: `translate(${joystick.offset.x}px, ${joystick.offset.y}px)` }}
            />
          </span>
        )}
      </div>
      <button
        type="button"
        className={`mobile-action-zone${actionActive ? ' mobile-action-active' : ''}`}
        aria-label="Aktion ausführen"
        onPointerDown={beginAction}
        onPointerUp={endAction}
        onPointerCancel={cancelAction}
        onClick={clickGuard}
        onContextMenu={clickGuard}
      >
        Aktion
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
