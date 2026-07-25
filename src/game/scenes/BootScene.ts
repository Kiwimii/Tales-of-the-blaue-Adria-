import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('boot');
  }

  create(): void {
    this.createCharacterTexture('player', 0xf3c969, 0x24444a);
    this.createCharacterTexture('gundula', 0xe47d99, 0x5d294f);
    this.createCharacterTexture('uli', 0x7ab9d8, 0x263f67);
    this.createCharacterTexture('rival', 0xe4694f, 0x5c2018);

    const marker = this.make.graphics({ x: 0, y: 0 });
    marker.fillStyle(0xffd75a, 0.95);
    marker.fillCircle(18, 18, 16);
    marker.lineStyle(3, 0xffffff, 0.8);
    marker.strokeCircle(18, 18, 16);
    marker.generateTexture('activity-marker', 36, 36);
    marker.destroy();

    this.scene.start('world');
  }

  private createCharacterTexture(key: string, shirt: number, trousers: number): void {
    const graphics = this.make.graphics({ x: 0, y: 0 });
    graphics.fillStyle(0xf3c8a8, 1);
    graphics.fillCircle(16, 9, 7);
    graphics.fillStyle(shirt, 1);
    graphics.fillRoundedRect(7, 15, 18, 17, 5);
    graphics.fillStyle(trousers, 1);
    graphics.fillRect(8, 29, 7, 12);
    graphics.fillRect(18, 29, 7, 12);
    graphics.generateTexture(key, 32, 42);
    graphics.destroy();
  }
}
