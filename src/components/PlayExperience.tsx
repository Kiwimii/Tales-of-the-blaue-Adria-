import { useEffect, useMemo, useRef, useState } from 'react';
import type { ReactElement } from 'react';
import type Phaser from 'phaser';
import { QUESTS } from '../game/content';
import { RECOVER_WORLD_CONTROL_EVENT, sendDirection } from '../game/events';
import type { Direction, GameSnapshot } from '../game/types';
import { conditionTone, importantNeedAlerts, modeName } from '../game/uiState';
import { compactObjective } from '../game/uxPresentation';
import { encounterJustClosed, WORLD_RECOVERY_DELAYS_MS } from '../game/worldControlRecovery';
import { EncounterDialog } from './EncounterDialog';
import { GameMenu } from './GameMenu';
import { MobileGameControls, SceneCloseButton } from './MobileGameControls';
import '../playExperience.css';
import '../combatMenu.css';
import '../responsiveGame.css';
import '../uxRefresh.css';

interface PlayExperienceProps {
  snapshot: GameSnapshot;
}

interface RecoverableWorldScene extends Phaser.Scene {
  recoverWorldControl?: () => void;
}

const ALL_DIRECTIONS: Direction[] = ['up', 'down', 'left', 'right'];
const MOBILE_REPAIR_KEY = 'tales-adria-mobile-repair-s85';

export function PlayExperience({ snapshot }: PlayExperienceProps): ReactElement {
  const [menuOpen, setMenuOpen] = useState(false);
  const [gameReady, setGameReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const gameHostRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  const pausedScenes = useRef<string[]>([]);
  const previousEncounterId = useRef<string | null>(snapshot.encounter?.id ?? null);

  useEffect(() => {
    if (!gameHostRef.current || gameRef.current) return;
    const host = gameHostRef.current;
    let cancelled = false;
    setLoadError(null);

    void import('../game/createGame')
      .then(({ createGame }) => {
        if (cancelled || gameRef.current) return;
        gameRef.current = createGame(host);
        sessionStorage.removeItem(MOBILE_REPAIR_KEY);
        setGameReady(true);
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        const message = error instanceof Error ? error.message : String(error);
        if (isLikelyStaleBundleError(message) && !sessionStorage.getItem(MOBILE_REPAIR_KEY)) {
          sessionStorage.setItem(MOBILE_REPAIR_KEY, '1');
          void clearNextRuntimeCaches().finally(() => window.location.reload());
          return;
        }
        setLoadError(message || 'Die Spielengine konnte nicht geladen werden.');
      });

    return () => {
      cancelled = true;
      resumePausedScenes(gameRef.current, pausedScenes.current);
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, [loadAttempt]);

  useEffect(() => {
    const game = gameRef.current;
    const host = gameHostRef.current;
    if (!gameReady || !game || !host) return;

    let frame = 0;
    const timers: number[] = [];
    const refreshScale = (): void => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        if (!game.isRunning) return;
        game.scale.refresh();
        game.canvas.style.aspectRatio = '3 / 2';
        game.canvas.style.objectFit = 'contain';
      });
      timers.push(window.setTimeout(() => game.isRunning && game.scale.refresh(), 120));
      timers.push(window.setTimeout(() => game.isRunning && game.scale.refresh(), 420));
    };

    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(refreshScale);
    observer?.observe(host);
    window.addEventListener('orientationchange', refreshScale);
    window.addEventListener('resize', refreshScale);
    window.visualViewport?.addEventListener('resize', refreshScale);
    refreshScale();

    return () => {
      observer?.disconnect();
      window.cancelAnimationFrame(frame);
      timers.forEach((timer) => window.clearTimeout(timer));
      window.removeEventListener('orientationchange', refreshScale);
      window.removeEventListener('resize', refreshScale);
      window.visualViewport?.removeEventListener('resize', refreshScale);
    };
  }, [gameReady]);

  useEffect(() => {
    releaseAllDirections();
  }, [menuOpen, snapshot.mode, snapshot.encounter?.id, snapshot.encounter?.result?.optionId]);

  useEffect(() => {
    const game = gameRef.current;
    if (!gameReady || !game) return;
    if (menuOpen) {
      pausedScenes.current = game.scene.getScenes(true)
        .filter((scene) => scene.scene.key !== 'boot')
        .map((scene) => scene.scene.key)
        .filter((key) => {
          if (game.scene.isPaused(key)) return false;
          game.scene.pause(key);
          return true;
        });
      return;
    }
    resumePausedScenes(game, pausedScenes.current);
    pausedScenes.current = [];
  }, [gameReady, menuOpen]);

  useEffect(() => {
    if (snapshot.encounter) setMenuOpen(false);
  }, [snapshot.encounter?.id]);

  useEffect(() => {
    const recover = (): void => {
      void scheduleWorldRecovery(() => gameRef.current);
    };
    window.addEventListener(RECOVER_WORLD_CONTROL_EVENT, recover);
    return () => window.removeEventListener(RECOVER_WORLD_CONTROL_EVENT, recover);
  }, []);

  useEffect(() => {
    const currentEncounterId = snapshot.encounter?.id ?? null;
    const shouldRecover = encounterJustClosed(previousEncounterId.current, currentEncounterId);
    previousEncounterId.current = currentEncounterId;
    if (!shouldRecover) return;
    return scheduleWorldRecovery(() => gameRef.current);
  }, [snapshot.encounter?.id]);

  const alerts = useMemo(() => importantNeedAlerts(snapshot.needs, 2), [snapshot.needs]);
  const movementActive = snapshot.mode === 'world'
    || (snapshot.mode === 'interior' && Boolean(snapshot.currentInterior));
  const phaserWindowOpen = snapshot.mode !== 'world' && snapshot.mode !== 'shop' && !snapshot.encounter;
  const questTitle = snapshot.activeQuest ? QUESTS[snapshot.activeQuest]?.title : 'Freies Spiel';
  const objective = compactObjective(snapshot.currentObjective);

  return (
    <main className="play-screen">
      <section className="game-frame focused-game-frame">
        <div className="game-host" ref={gameHostRef} />

        {!gameReady && (
          <div className={loadError ? 'game-load-panel game-load-error' : 'game-load-panel'} role="status">
            <strong>{loadError ? 'Spiel konnte nicht geladen werden' : 'Campingplatz wird aufgebaut …'}</strong>
            <p>{loadError ? 'Meist ist ein veralteter mobiler PWA-Cache die Ursache. Der Spielstand bleibt beim Reparieren erhalten.' : 'Grafiken, Welt und Steuerung werden geladen.'}</p>
            {loadError && (
              <div>
                <button type="button" onClick={() => { setGameReady(false); setLoadAttempt((value) => value + 1); }}>Erneut versuchen</button>
                <button type="button" onClick={() => void clearNextRuntimeCaches().finally(() => window.location.reload())}>Cache reparieren</button>
              </div>
            )}
          </div>
        )}

        <header className="play-hud" aria-label="Aktuelle Spielinformationen">
          <div className="play-time-card">
            <small>Tag {snapshot.day} · {snapshot.phaseLabel}</small>
            <strong>{snapshot.clockLabel}</strong>
          </div>
          <button
            className="play-objective-card"
            type="button"
            aria-label={`Aktuelles Ziel öffnen: ${snapshot.currentObjective}`}
            onClick={() => setMenuOpen(true)}
          >
            <span>
              <small>{questTitle}</small>
              <strong>{objective}</strong>
            </span>
            <i aria-hidden="true">›</i>
          </button>
          <div className="play-hud-actions" aria-live="polite">
            <div className="play-status-stack">
              {alerts.map((alert) => (
                <span className={alert.critical ? 'play-alert play-alert-critical' : 'play-alert'} key={alert.key}>
                  {alert.icon} {alert.label} {Math.round(alert.value)}
                </span>
              ))}
              {!alerts.length && (
                <span className={`play-condition condition-${conditionTone(snapshot.conditionLabel)}`}>
                  {snapshot.conditionLabel}
                </span>
              )}
            </div>
            <button
              className={phaserWindowOpen ? 'hud-menu-button hud-menu-button-shifted' : 'hud-menu-button'}
              type="button"
              aria-label="Spielmenü öffnen"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(true)}
            >
              <span aria-hidden="true">☰</span>
              <small>MENÜ</small>
            </button>
          </div>
        </header>

        <div className="desktop-control-hint" aria-hidden="true">
          <span><kbd>WASD</kbd> / Pfeile · Laufen</span>
          <span><kbd>E</kbd> / Leertaste · Aktion</span>
          <span><kbd>M</kbd> · Karte</span>
        </div>

        <span className="play-mode-label">{modeName(snapshot.mode)}</span>

        {movementActive && !snapshot.encounter && !menuOpen && <MobileGameControls />}
        {phaserWindowOpen && !menuOpen && <SceneCloseButton />}
      </section>

      {snapshot.encounter && <EncounterDialog snapshot={snapshot} />}
      {menuOpen && <GameMenu snapshot={snapshot} onClose={() => setMenuOpen(false)} />}
    </main>
  );
}

function releaseAllDirections(): void {
  for (const direction of ALL_DIRECTIONS) sendDirection(direction, false);
}

function resumePausedScenes(game: Phaser.Game | null, keys: string[]): void {
  if (!game) return;
  for (const key of keys) {
    if (game.scene.isPaused(key)) game.scene.resume(key);
  }
}

function scheduleWorldRecovery(getGame: () => Phaser.Game | null): () => void {
  releaseAllDirections();
  const recover = (): void => recoverWorldAfterOverlay(getGame());
  recover();
  const frame = window.requestAnimationFrame(recover);
  const timers = WORLD_RECOVERY_DELAYS_MS.map((delay) => window.setTimeout(recover, delay));
  return () => {
    window.cancelAnimationFrame(frame);
    for (const timer of timers) window.clearTimeout(timer);
  };
}

function recoverWorldAfterOverlay(game: Phaser.Game | null): void {
  if (!game) return;
  game.loop.wake();
  game.input.enabled = true;

  if (game.scene.isPaused('world')) game.scene.resume('world');
  if (game.scene.isSleeping('world')) game.scene.wake('world');
  if (!game.scene.isActive('world')) game.scene.start('world');

  const world = game.scene.getScene('world') as RecoverableWorldScene;
  world.input.enabled = true;
  world.physics.world.resume();
  world.recoverWorldControl?.();

  const focused = document.activeElement;
  if (focused instanceof HTMLElement && focused !== game.canvas) focused.blur();
  game.canvas.tabIndex = 0;
  game.canvas.focus({ preventScroll: true });
}

function isLikelyStaleBundleError(message: string): boolean {
  return /dynamically imported module|failed to fetch|loading chunk|importing a module script/i.test(message);
}

async function clearNextRuntimeCaches(): Promise<void> {
  if ('caches' in window) {
    const names = await window.caches.keys();
    await Promise.all(names.filter((name) => name.startsWith('tales-adria-next-')).map((name) => window.caches.delete(name)));
  }
  if ('serviceWorker' in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.map((registration) => registration.update().catch(() => undefined)));
  }
}
