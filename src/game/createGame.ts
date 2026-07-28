import Phaser from 'phaser';
import { installAdvancedSystemsRuntime } from './advancedRuntime';
import { installArrivalQuestRuntime } from './arrivalQuestRuntime';
import { installCombatProgressRuntime } from './combatProgress';
import { RETURN_TO_WORLD_EVENT } from './events';
import { AdvancedBattleScene } from './scenes/AdvancedBattleScene';
import { AdvancedEntryDebateScene } from './scenes/AdvancedEntryDebateScene';
import { BeerPongScene } from './scenes/BeerPongScene';
import { BootScene } from './scenes/BootScene';
import { FlunkyballScene } from './scenes/FlunkyballScene';
import { FlipCupScene } from './scenes/FlipCupScene';
import { HedgePeeScene } from './scenes/HedgePeeScene';
import { InteriorScene } from './scenes/InteriorScene';
import { MaslHoleScene } from './scenes/MaslHoleScene';
import { PixelArtWorldScene } from './scenes/PixelArtWorldScene';
import { ReservationPuzzleScene } from './scenes/ReservationPuzzleScene';
import { SocialScene } from './scenes/SocialScene';
import { gameStore } from './state/GameStore';

export function createGame(parent: HTMLElement): Phaser.Game {
  installArrivalQuestRuntime(gameStore);
  installAdvancedSystemsRuntime(gameStore);
  const unsubscribeCombatProgress = installCombatProgressRuntime(gameStore);
  const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent,
    width: 960,
    height: 640,
    backgroundColor: '#10241f',
    antialias: true,
    antialiasGL: true,
    roundPixels: false,
    pixelArt: false,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { x: 0, y: 0 },
        debug: false,
      },
    },
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: 960,
      height: 640,
    },
    scene: [
      BootScene,
      PixelArtWorldScene,
      ReservationPuzzleScene,
      AdvancedEntryDebateScene,
      InteriorScene,
      SocialScene,
      AdvancedBattleScene,
      MaslHoleScene,
      FlipCupScene,
      BeerPongScene,
      FlunkyballScene,
      HedgePeeScene,
    ],
  });

  const returnToWorld = (): void => {
    const snapshot = gameStore.snapshot();
    if (snapshot.encounter) gameStore.closeEncounter();
    if (snapshot.currentInterior) gameStore.leaveInterior();
    else if (gameStore.snapshot().mode !== 'world') gameStore.setMode('world');

    for (const scene of game.scene.getScenes(true)) {
      if (scene.scene.key !== 'world') game.scene.stop(scene.scene.key);
    }
    if (!game.scene.isActive('world')) game.scene.start('world');
  };

  const onEscape = (event: KeyboardEvent): void => {
    if (event.key === 'Escape' && gameStore.snapshot().mode !== 'world') returnToWorld();
  };

  window.addEventListener(RETURN_TO_WORLD_EVENT, returnToWorld);
  window.addEventListener('keydown', onEscape);
  game.events.once(Phaser.Core.Events.DESTROY, () => {
    unsubscribeCombatProgress();
    window.removeEventListener(RETURN_TO_WORLD_EVENT, returnToWorld);
    window.removeEventListener('keydown', onEscape);
  });

  return game;
}
