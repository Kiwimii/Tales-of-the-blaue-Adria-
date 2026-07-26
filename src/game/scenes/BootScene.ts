import Phaser from 'phaser';
import { RELATIONSHIP_CHARACTERS } from '../content';
import { gameStore } from '../state/GameStore';
import { colorShade, seededFraction } from '../visuals';

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
      profile?.bodyType ?? 'normal',
      profile?.accessory ?? 'keins',
    );
    const hairStyles = ['kurz', 'buzz', 'welle', 'cap'];
    const accessories = ['keins', 'bart', 'brille', 'ohrring'];
    for (const [index, character] of RELATIONSHIP_CHARACTERS.entries()) {
      const shirt = Phaser.Display.Color.HexStringToColor(character.color).color;
      const tone = [0xf6c9a7, 0xd79b73, 0xb97955, 0x80533d][index % 4];
      this.createCharacterTexture(
        `npc-${character.id}`,
        shirt,
        colorShade(shirt, 0.44),
        tone,
        colorShade(shirt, 0.34),
        hairStyles[Math.floor(seededFraction(character.id, 1) * hairStyles.length)],
        index % 4 === 0 ? 'breit' : index % 3 === 0 ? 'schmal' : 'normal',
        accessories[Math.floor(seededFraction(character.id, 2) * accessories.length)],
      );
    }
    this.createCharacterTexture('rival', 0xe4694f, 0x5c2018, 0xf3c8a8, 0x4a271f, 'welle', 'breit', 'bart');

    const marker = this.make.graphics({ x: 0, y: 0 });
    marker.fillStyle(0x07151c, 0.28);
    marker.fillEllipse(24, 42, 34, 9);
    marker.fillStyle(0xffd75a, 0.16);
    marker.fillCircle(24, 22, 21);
    marker.fillStyle(0xf4c75d, 1);
    marker.fillCircle(24, 22, 14);
    marker.lineStyle(3, 0xfff3c6, 0.95);
    marker.strokeCircle(24, 22, 14);
    marker.lineStyle(2, 0x173027, 0.7);
    marker.lineBetween(24, 13, 24, 27);
    marker.fillCircle(24, 32, 2.5);
    marker.generateTexture('activity-marker', 48, 48);
    marker.destroy();

    const door = this.make.graphics({ x: 0, y: 0 });
    door.fillStyle(0x07151c, 0.28);
    door.fillEllipse(24, 43, 34, 8);
    door.fillStyle(0x10251f, 0.94);
    door.fillRoundedRect(3, 3, 42, 39, 10);
    door.lineStyle(3, 0xf4d47b, 1);
    door.strokeRoundedRect(3, 3, 42, 39, 10);
    door.fillGradientStyle(0xffdf82, 0xf2bf4c, 0xc88732, 0xe0a640, 1);
    door.fillRoundedRect(14, 10, 21, 29, 3);
    door.lineStyle(1, 0xffffff, 0.42);
    door.strokeRoundedRect(14, 10, 21, 29, 3);
    door.fillStyle(0x173027, 1);
    door.fillCircle(30, 26, 2.4);
    door.generateTexture('door-marker', 48, 48);
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
    bodyType: string,
    accessory: string,
  ): void {
    const graphics = this.make.graphics({ x: 0, y: 0 });
    const bodyWidth = bodyType === 'breit' ? 28 : bodyType === 'schmal' ? 21 : 24;
    const bodyLeft = 23 - bodyWidth / 2;
    const outline = 0x14211f;

    graphics.fillStyle(0x07120f, 0.26);
    graphics.fillEllipse(23, 59, 33, 8);
    graphics.fillStyle(outline, 1);
    graphics.fillCircle(23, 12, 10);
    graphics.fillStyle(hair, 1);
    if (hairStyle === 'buzz') graphics.fillRoundedRect(14, 3, 18, 8, 4);
    else if (hairStyle === 'cap') {
      graphics.fillRoundedRect(12, 1, 23, 9, 4);
      graphics.fillRect(31, 8, 10, 3);
    } else if (hairStyle === 'welle') {
      graphics.fillCircle(15, 5, 6);
      graphics.fillCircle(22, 3, 7);
      graphics.fillCircle(30, 5, 6);
    } else graphics.fillRoundedRect(13, 2, 20, 8, 4);

    graphics.fillStyle(skin, 1);
    graphics.fillRoundedRect(14, 7, 18, 17, 8);
    graphics.fillCircle(13, 14, 3);
    graphics.fillCircle(33, 14, 3);
    graphics.fillStyle(0x26322e, 1);
    graphics.fillCircle(19, 14, 1.4);
    graphics.fillCircle(27, 14, 1.4);
    graphics.lineStyle(1.3, colorShade(skin, 0.62), 0.85);
    graphics.beginPath();
    graphics.moveTo(20, 20);
    graphics.lineTo(23, 22);
    graphics.lineTo(27, 19);
    graphics.strokePath();

    graphics.fillStyle(outline, 1);
    graphics.fillRoundedRect(bodyLeft - 2, 23, bodyWidth + 4, 25, 7);
    graphics.fillStyle(shirt, 1);
    graphics.fillRoundedRect(bodyLeft, 24, bodyWidth, 22, 6);
    graphics.fillStyle(colorShade(shirt, 1.18), 0.72);
    graphics.fillRoundedRect(bodyLeft + 3, 26, 4, 15, 2);
    graphics.fillStyle(skin, 1);
    graphics.fillRoundedRect(bodyLeft - 4, 26, 6, 19, 3);
    graphics.fillRoundedRect(bodyLeft + bodyWidth - 2, 26, 6, 19, 3);

    graphics.fillStyle(outline, 1);
    graphics.fillRoundedRect(11, 44, 11, 16, 4);
    graphics.fillRoundedRect(24, 44, 11, 16, 4);
    graphics.fillStyle(trousers, 1);
    graphics.fillRoundedRect(13, 44, 8, 12, 3);
    graphics.fillRoundedRect(25, 44, 8, 12, 3);
    graphics.fillStyle(0xe4dfcd, 1);
    graphics.fillRoundedRect(10, 55, 12, 6, 3);
    graphics.fillRoundedRect(24, 55, 12, 6, 3);

    if (accessory === 'brille') {
      graphics.lineStyle(2, 0x172321, 1);
      graphics.strokeRoundedRect(15, 11, 7, 6, 2);
      graphics.strokeRoundedRect(24, 11, 7, 6, 2);
      graphics.lineBetween(22, 14, 24, 14);
    } else if (accessory === 'bart') {
      graphics.fillStyle(hair, 0.95);
      graphics.fillTriangle(16, 18, 30, 18, 23, 26);
      graphics.fillStyle(skin, 1);
      graphics.fillTriangle(20, 19, 26, 19, 23, 22);
    } else if (accessory === 'ohrring') {
      graphics.lineStyle(2, 0xffd75a, 1);
      graphics.strokeCircle(33, 17, 2.5);
    }

    graphics.generateTexture(key, 46, 64);
    graphics.destroy();
  }
}

function hex(value: string | undefined, fallback: number): number {
  return value && /^#[\da-f]{6}$/i.test(value)
    ? Phaser.Display.Color.HexStringToColor(value).color
    : fallback;
}
