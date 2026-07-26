import Phaser from 'phaser';
import { RELATIONSHIP_CHARACTERS } from '../content';
import { gameStore } from '../state/GameStore';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('boot');
  }

  create(): void {
    const profile = gameStore.snapshot().profile;
    this.createCharacterTexture(
      'player',
      hex(profile?.shirt, 0xf3c969),
      hex(profile?.shorts, 0x24444a),
      hex(profile?.skinTone, 0xf3c8a8),
      hex(profile?.hair, 0x49301f),
      profile?.hairStyle ?? 'kurz',
    );
    for (const character of RELATIONSHIP_CHARACTERS) {
      const shirt = Phaser.Display.Color.HexStringToColor(character.color).color;
      this.createCharacterTexture(`npc-${character.id}`, shirt, darken(shirt), 0xf3c8a8, darken(shirt), 'kurz');
    }
    this.createCharacterTexture('rival', 0xe4694f, 0x5c2018, 0xf3c8a8, 0x4a271f, 'kurz');

    const marker = this.make.graphics({ x: 0, y: 0 });
    marker.fillStyle(0xffd75a, 0.95);
    marker.fillCircle(18, 18, 16);
    marker.lineStyle(3, 0xffffff, 0.8);
    marker.strokeCircle(18, 18, 16);
    marker.generateTexture('activity-marker', 36, 36);
    marker.destroy();

    const door = this.make.graphics({ x: 0, y: 0 });
    door.fillStyle(0x10251f, 0.9);
    door.fillRoundedRect(2, 2, 32, 32, 8);
    door.lineStyle(3, 0xf4d47b, 1);
    door.strokeRoundedRect(2, 2, 32, 32, 8);
    door.fillStyle(0xf4d47b, 1);
    door.fillRect(10, 8, 16, 22);
    door.fillStyle(0x10251f, 1);
    door.fillCircle(22, 19, 2);
    door.generateTexture('door-marker', 36, 36);
    door.destroy();

    this.scene.start('world');
  }

  private createCharacterTexture(
    key: string,
    shirt: number,
    trousers: number,
    skin: number,
    hair: number,
    hairStyle: string,
  ): void {
    const graphics = this.make.graphics({ x: 0, y: 0 });
    graphics.fillStyle(skin, 1);
    graphics.fillCircle(16, 9, 7);
    graphics.fillStyle(hair, 1);
    if (hairStyle === 'buzz') graphics.fillRect(10, 3, 12, 4);
    else if (hairStyle === 'cap') {
      graphics.fillRoundedRect(8, 1, 17, 7, 3);
      graphics.fillRect(21, 6, 8, 3);
    } else if (hairStyle === 'welle') {
      graphics.fillCircle(11, 4, 5);
      graphics.fillCircle(17, 3, 6);
      graphics.fillCircle(22, 5, 5);
    } else graphics.fillRoundedRect(9, 2, 14, 6, 3);
    graphics.fillStyle(shirt, 1);
    graphics.fillRoundedRect(7, 15, 18, 17, 5);
    graphics.fillStyle(trousers, 1);
    graphics.fillRect(8, 29, 7, 12);
    graphics.fillRect(18, 29, 7, 12);
    graphics.generateTexture(key, 32, 42);
    graphics.destroy();
  }
}

function hex(value: string | undefined, fallback: number): number {
  return value && /^#[\da-f]{6}$/i.test(value)
    ? Phaser.Display.Color.HexStringToColor(value).color
    : fallback;
}

function darken(color: number): number {
  const parsed = Phaser.Display.Color.IntegerToColor(color);
  return Phaser.Display.Color.GetColor(
    Math.round(parsed.red * 0.48),
    Math.round(parsed.green * 0.48),
    Math.round(parsed.blue * 0.48),
  );
}
