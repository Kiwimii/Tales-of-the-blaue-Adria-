import { useEffect, useMemo, useRef, useState } from 'react';
import type { ReactElement } from 'react';
import type Phaser from 'phaser';
import { QUESTS } from '../game/content';
import { RECOVER_WORLD_CONTROL_EVENT, sendDirection } from '../game/events';
import type { Direction, GameSnapshot } from '../game/types';
import { conditionTone, importantNeedAlerts, modeName } from '../game/uiState';
import { encounterJustClosed, WORLD_RECOVERY_DELAYS_MS } from '../game/worldControlRecovery';
import { EncounterDialog } from './EncounterDialog';
import { GameMenu } from './GameMenu';
import { MobileGameControls, SceneCloseButton } from './MobileGameControls';
import '../playExperience.css';
import '../combatMenu.css';
import '../responsiveGame.css';

interface PlayExperienceProps {
  snapshot: GameSnapshot;
}

interface RecoverableWorldScene extends Phaser.Scene {
  recoverWorldControl?: () => void;
}

const ALL_DIRECTIONS: Direction[] = ['up', 'down', 'left', 'right'];

export function PlayExperience({ snapshot }: PlayExperienceProps): ReactElement {
  const [menuOpen, setMenuOpen] = useState(false);
  const [gameReady, setGameReady] = useState(false);
  const gameHostRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  const pausedScenes = useRef<string[]>([]);
  const previousEncounterId = useRef<string | null>(snapshot.encounter?.id ?? null);

  useEffect(() => {
    if (!gameHostRef.current || gameRef.current) return;
    const host = gameHostRef.current;
    let cancelled = false;
    void import('../game/createGame').then(({ createGame }) => {
      if (cancelled || gameRef.current) return;
      gameRef.current = createGame(host);
      setGameReady(true);
    });
    return () => {
      cancelled = true;
      resumePausedScenes(gameRef.current, pausedScenes.current);
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  useEffect(() => {
    const game = gameRef.current;
    const host = gameHostRef.current;
    if (!gameReady || !game || !host) return;

    let frame = 0;
    const refreshScale = (): void => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        game.scale.refresh();
        game.canvas.style.aspectRatio = '3 / 2';
        game.canvas.style.objectFit = 'contain';
      });
    };
    const observer = new ResizeObserver(refreshScale);
    observer.observe(host);
    window.addEventListener('orientationchange', refreshScale);
    window.addEventListener('resize', refreshScale);
    window.visualViewport?.addEventListener('resize', refreshScale);
    refreshScale();

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
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

  return (
    <main className="play-screen">
      <section className="game-frame focused-game-frame">
        <div className="game-host" ref={gameHostRef} />

        <header className="play-hud" aria-label="Aktuelle Spielinformationen">
          <div className="play-time-card">
            <small>Tag {snapshot.day} · {snapshot.phaseLabel}</small>
            <strong>{snapshot.clockLabel}</strong>
          </div>
          <div className="play-objective-card">
            <small>{questTitle}</small>
            <strong>{snapshot.currentObjective}</strong>
          </div>
          <div className="play-hud-actions">
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
