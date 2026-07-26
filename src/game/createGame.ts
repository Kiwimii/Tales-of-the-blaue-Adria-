import Phaser from 'phaser';
import { installArrivalQuestRuntime } from './arrivalQuestRuntime';
import { ArrivalQuestWorldScene } from './scenes/ArrivalQuestWorldScene';
import { BattleScene } from './scenes/BattleScene';
import { BeerPongScene } from './scenes/BeerPongScene';
import { BootScene } from './scenes/BootScene';
import { EntryDebateScene } from './scenes/EntryDebateScene';
import { FlunkyballScene } from './scenes/FlunkyballScene';
import { FlipCupScene } from './scenes/FlipCupScene';
import { InteriorScene } from './scenes/InteriorScene';
import { ReservationPuzzleScene } from './scenes/ReservationPuzzleScene';
import { gameStore } from './state/GameStore';

export function createGame(parent: HTMLElement): Phaser.Game {
  installArrivalQuestRuntime(gameStore);
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
      ArrivalQuestWorldScene,
      ReservationPuzzleScene,
      EntryDebateScene,
      InteriorScene,
      BattleScene,
      FlipCupScene,
      BeerPongScene,
      FlunkyballScene,
    ],
  });
}
