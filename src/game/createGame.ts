import Phaser from 'phaser';
import { BattleScene } from './scenes/BattleScene';
import { BeerPongScene } from './scenes/BeerPongScene';
import { BootScene } from './scenes/BootScene';
import { FlunkyballScene } from './scenes/FlunkyballScene';
import { FlipCupScene } from './scenes/FlipCupScene';
import { InteriorScene } from './scenes/InteriorScene';
import { RealisticWorldScene } from './scenes/RealisticWorldScene';

export function createGame(parent: HTMLElement): Phaser.Game {
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
      RealisticWorldScene,
      InteriorScene,
      BattleScene,
      FlipCupScene,
      BeerPongScene,
      FlunkyballScene,
    ],
  });
}
