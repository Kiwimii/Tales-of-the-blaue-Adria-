import Phaser from 'phaser';
import { RELATIONSHIP_CHARACTERS } from '../content';
import { gameStore } from '../state/GameStore';
import { colorShade, seededFraction } from '../visuals';

const ACCESSORY_BY_CHARACTER: Record<string, string> = {
  gundula: 'brille', uli: 'cap', manni: 'bart', ronny: 'bart', andre: 'brille', rene: 'ohrring',
  lars: 'cap', danny: 'brille', gregor: 'bart', felix: 'ohrring', masl: 'cap', schubert: 'brille', schima: 'cap',
};

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
      'player',
    );

    const hairStyles = ['kurz', 'buzz', 'welle', 'cap'];
    for (const [index, character] of RELATIONSHIP_CHARACTERS.entries()) {
      const shirt = Phaser.Display.Color.HexStringToColor(character.color).color;
      const tone = [0xf6c9a7, 0xd79b73, 0xb97955, 0x80533d][index % 4];
      this.createCharacterTexture(
        `npc-${character.id}`,
        shirt,
        colorShade(shirt, 0.44),
        tone,
        colorShade(shirt, 0.34),
        character.id === 'uli' || character.id === 'lars' || character.id === 'masl' || character.id === 'schima'
          ? 'cap'
          : hairStyles[Math.floor(seededFraction(character.id, 1) * hairStyles.length)],
        index % 4 === 0 ? 'breit' : index % 3 === 0 ? 'schmal' : 'normal',
        ACCESSORY_BY_CHARACTER[character.id] ?? 'keins',
        character.id,
      );
    }
    this.createCharacterTexture('rival', 0xe4694f, 0x5c2018, 0xf3c8a8, 0x4a271f, 'welle', 'breit', 'bart', 'ronny');

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
    identity: string,
  ): void {
    const graphics = this.make.graphics({ x: 0, y: 0 });
    const bodyWidth = bodyType === 'breit' ? 28 : bodyType === 'schmal' ? 21 : 24;
    const bodyLeft = 23 - bodyWidth / 2;
    const outline = 0x14211f;
    const skinShade = colorShade(skin, 0.78);
    const shirtShade = colorShade(shirt, 0.72);
    const pattern = Math.floor(seededFraction(identity, 7) * 4);

    graphics.fillStyle(0x07120f, 0.3).fillEllipse(23, 59, 35, 8);

    graphics.fillStyle(outline).fillRoundedRect(10, 43, 12, 17, 4).fillRoundedRect(24, 43, 12, 17, 4);
    graphics.fillStyle(trousers).fillRoundedRect(12, 43, 9, 13, 3).fillRoundedRect(25, 43, 9, 13, 3);
    graphics.fillStyle(colorShade(trousers, 1.18), 0.62).fillRect(13, 44, 2, 10).fillRect(26, 44, 2, 10);
    graphics.fillStyle(skinShade, 0.78).fillCircle(16.5, 55, 3).fillCircle(29.5, 55, 3);
    graphics.fillStyle(0xe8e1ce).fillRoundedRect(9, 55, 13, 7, 3).fillRoundedRect(24, 55, 13, 7, 3);
    graphics.fillStyle(0x5b625f).fillRoundedRect(9, 60, 13, 2, 1).fillRoundedRect(24, 60, 13, 2, 1);
    graphics.lineStyle(1, 0x9aa09a, 0.7).lineBetween(13, 58, 19, 58).lineBetween(28, 58, 34, 58);

    graphics.fillStyle(skinShade).fillRoundedRect(19, 20, 8, 7, 3);
    graphics.fillStyle(outline).fillRoundedRect(bodyLeft - 3, 23, bodyWidth + 6, 25, 8);
    graphics.fillStyle(shirt).fillRoundedRect(bodyLeft, 24, bodyWidth, 22, 7);
    graphics.fillStyle(shirtShade).fillRoundedRect(bodyLeft - 3, 25, 7, 12, 4).fillRoundedRect(bodyLeft + bodyWidth - 4, 25, 7, 12, 4);
    graphics.fillStyle(skin).fillRoundedRect(bodyLeft - 4, 34, 6, 12, 3).fillRoundedRect(bodyLeft + bodyWidth - 2, 34, 6, 12, 3);
    graphics.fillCircle(bodyLeft - 1, 46, 3.5).fillCircle(bodyLeft + bodyWidth + 1, 46, 3.5);
    graphics.lineStyle(1.2, skinShade, 0.75).lineBetween(bodyLeft - 2, 44, bodyLeft + 1, 44).lineBetween(bodyLeft + bodyWidth - 1, 44, bodyLeft + bodyWidth + 2, 44);

    graphics.fillStyle(colorShade(trousers, 0.72)).fillRoundedRect(bodyLeft, 43, bodyWidth, 5, 2);
    graphics.fillStyle(0xd9bd72).fillRoundedRect(bodyLeft + bodyWidth / 2 - 3, 43, 6, 4, 1);

    if (pattern === 0) {
      graphics.fillStyle(colorShade(shirt, 1.3), 0.72).fillRect(bodyLeft + 2, 30, bodyWidth - 4, 4).fillRect(bodyLeft + 2, 38, bodyWidth - 4, 3);
    } else if (pattern === 1) {
      graphics.fillStyle(0xf0e4bd, 0.9).fillCircle(23, 34, 5).fillStyle(shirtShade).fillCircle(23, 34, 2);
    } else if (pattern === 2) {
      graphics.fillStyle(colorShade(shirt, 1.22), 0.78).fillRoundedRect(bodyLeft + bodyWidth - 10, 29, 7, 7, 2);
    } else {
      graphics.fillStyle(0xf0e1bb, 0.65).fillTriangle(18, 25, 23, 31, 28, 25);
    }

    graphics.fillStyle(outline).fillCircle(23, 12, 11);
    graphics.fillStyle(skin).fillRoundedRect(13, 6, 20, 18, 8);
    graphics.fillCircle(12.5, 14, 3.2).fillCircle(33.5, 14, 3.2);
    graphics.fillStyle(skinShade, 0.7).fillEllipse(12.5, 14, 2, 3).fillEllipse(33.5, 14, 2, 3);

    graphics.fillStyle(hair);
    if (hairStyle === 'buzz') graphics.fillRoundedRect(13, 2, 20, 7, 4);
    else if (hairStyle === 'cap') {
      graphics.fillRoundedRect(11, 1, 25, 9, 4).fillRect(31, 8, 11, 3);
      graphics.fillStyle(colorShade(shirt, 0.8)).fillRoundedRect(13, 2, 21, 5, 3);
    } else if (hairStyle === 'welle') {
      graphics.fillCircle(14, 5, 6).fillCircle(21, 3, 7).fillCircle(29, 4, 7).fillCircle(34, 8, 4);
    } else graphics.fillRoundedRect(12, 2, 22, 8, 4).fillTriangle(12, 7, 16, 12, 18, 7);
    graphics.fillStyle(colorShade(hair, 1.25), 0.55).fillRoundedRect(16, 3, 10, 2, 1);

    graphics.lineStyle(1.2, colorShade(hair, 0.72), 0.9).lineBetween(16, 11, 21, 10).lineBetween(25, 10, 30, 11);
    graphics.fillStyle(0xf7f5e9).fillEllipse(19, 14, 5, 3).fillEllipse(27, 14, 5, 3);
    graphics.fillStyle(0x25312d).fillCircle(19, 14, 1.5).fillCircle(27, 14, 1.5);
    graphics.lineStyle(1.2, skinShade, 0.85).lineBetween(23, 14, 22, 18).lineBetween(22, 18, 25, 18);
    graphics.lineStyle(1.2, 0x7c433a, 0.8).beginPath().moveTo(19, 21).lineTo(23, 22).lineTo(28, 20).strokePath();

    if (accessory === 'brille') {
      graphics.lineStyle(1.6, 0x172321, 1).strokeRoundedRect(15, 11, 7, 6, 2).strokeRoundedRect(24, 11, 7, 6, 2).lineBetween(22, 14, 24, 14);
    } else if (accessory === 'bart') {
      graphics.fillStyle(hair, 0.9).fillTriangle(15, 18, 31, 18, 23, 27).fillStyle(skin).fillTriangle(20, 19, 26, 19, 23, 22);
    } else if (accessory === 'ohrring') {
      graphics.lineStyle(2, 0xffd75a, 1).strokeCircle(33, 17, 2.5);
    }

    this.drawIdentityProp(graphics, identity, bodyLeft, bodyWidth, shirt);
    graphics.generateTexture(key, 46, 64);
    graphics.destroy();
  }

  private drawIdentityProp(
    g: Phaser.GameObjects.Graphics,
    identity: string,
    bodyLeft: number,
    bodyWidth: number,
    shirt: number,
  ): void {
    const leftHandX = bodyLeft - 2;
    const rightHandX = bodyLeft + bodyWidth + 2;
    if (identity === 'gundula') {
      g.fillStyle(0x7c5c3a).fillRoundedRect(leftHandX - 7, 33, 10, 16, 2).fillStyle(0xf2e7c9).fillRect(leftHandX - 5, 35, 6, 11);
    } else if (identity === 'uli') {
      g.lineStyle(1.5, 0xd8d5c5).lineBetween(rightHandX, 43, rightHandX + 5, 48).strokeCircle(rightHandX + 7, 50, 3);
    } else if (identity === 'manni') {
      g.fillStyle(0xf4f1e7).fillCircle(rightHandX + 4, 44, 5).fillStyle(0xb7b2a6).fillCircle(rightHandX + 4, 44, 2);
    } else if (identity === 'ronny') {
      g.lineStyle(2, 0x17211f).lineBetween(rightHandX + 1, 43, rightHandX + 5, 31).fillStyle(0xf3c8a8).fillCircle(rightHandX + 5, 30, 2.5);
    } else if (identity === 'andre') {
      g.fillStyle(0xe8ddb8).fillRoundedRect(leftHandX - 8, 33, 11, 14, 2).lineStyle(1, 0x607a78).lineBetween(leftHandX - 6, 37, leftHandX + 1, 37).lineBetween(leftHandX - 6, 41, leftHandX, 41);
    } else if (identity === 'rene') {
      g.fillStyle(0xd94f4f).fillRoundedRect(rightHandX, 38, 7, 11, 2).fillStyle(0xf0dfbb).fillRect(rightHandX + 1, 38, 5, 2);
    } else if (identity === 'lars') {
      g.fillStyle(0x6b4a27).fillRoundedRect(rightHandX, 33, 6, 16, 2).fillStyle(0xd2bd66).fillRect(rightHandX + 1, 32, 4, 3);
    } else if (identity === 'danny') {
      g.fillStyle(0x18201f, 0.8).fillRoundedRect(bodyLeft + 3, 29, bodyWidth - 6, 3, 1);
    } else if (identity === 'gregor') {
      g.lineStyle(2, 0xaeb4ae).lineBetween(rightHandX, 38, rightHandX + 8, 49).lineBetween(rightHandX + 8, 49, rightHandX + 10, 45);
    } else if (identity === 'felix') {
      g.fillStyle(0x1d2929).fillRoundedRect(rightHandX, 34, 7, 13, 2).fillStyle(0x71b8d2).fillRect(rightHandX + 1, 36, 5, 7);
    } else if (identity === 'masl') {
      g.lineStyle(1.5, 0xe6d6ae).lineBetween(23, 26, rightHandX + 4, 38).fillStyle(0xd8b94f).fillCircle(rightHandX + 5, 39, 3);
    } else if (identity === 'schubert') {
      g.fillStyle(0x4f8c4e).fillEllipse(rightHandX + 4, 40, 7, 13).lineStyle(1, 0x28572f).lineBetween(rightHandX + 4, 46, rightHandX + 4, 34);
    } else if (identity === 'schima') {
      g.lineStyle(3, 0x66e5d2).lineBetween(rightHandX, 38, rightHandX + 7, 48);
    } else if (identity === 'player') {
      g.lineStyle(1.2, colorShade(shirt, 1.35), 0.75).lineBetween(bodyLeft + 4, 27, bodyLeft + 4, 42);
    }
  }
}

function hex(value: string | undefined, fallback: number): number {
  return value && /^#[\da-f]{6}$/i.test(value)
    ? Phaser.Display.Color.HexStringToColor(value).color
    : fallback;
}
