import Phaser from 'phaser';
import { installAdvancedSystemsRuntime } from './advancedRuntime';
import { installArrivalQuestRuntime } from './arrivalQuestRuntime';
import { AdvancedBattleScene } from './scenes/AdvancedBattleScene';
import { AdvancedEntryDebateScene } from './scenes/AdvancedEntryDebateScene';
import { AdvancedWorldScene } from './scenes/AdvancedWorldScene';
import { BeerPongScene } from './scenes/BeerPongScene';
import { BootScene } from './scenes/BootScene';
import { FlunkyballScene } from './scenes/FlunkyballScene';
import { FlipCupScene } from './scenes/FlipCupScene';
import { InteriorScene } from './scenes/InteriorScene';
import { MaslHoleScene } from './scenes/MaslHoleScene';
import { ReservationPuzzleScene } from './scenes/ReservationPuzzleScene';
import { SocialScene } from './scenes/SocialScene';
import { gameStore } from './state/GameStore';

export function createGame(parent: HTMLElement): Phaser.Game {
  installArrivalQuestRuntime(gameStore);
  installAdvancedSystemsRuntime(gameStore);
  return new Phaser.Game({
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
      AdvancedWorldScene,
      ReservationPuzzleScene,
      AdvancedEntryDebateScene,
      InteriorScene,
      SocialScene,
      AdvancedBattleScene,
      MaslHoleScene,
      FlipCupScene,
      BeerPongScene,
      FlunkyballScene,
    ],
  });
}
