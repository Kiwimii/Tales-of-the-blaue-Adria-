import Phaser from 'phaser';
import { RELATIONSHIP_CHARACTERS } from '../content';
import { ACTION_EVENT, INPUT_EVENT, type InputEventDetail } from '../events';
import { gameStore } from '../state/GameStore';
import type { Direction, GameSnapshot } from '../types';
import { colorShade, currentVisualProfile, seededFraction, type VisualProfile } from '../visuals';
import {
  WORLD_ENTRANCES,
  WORLD_HEIGHT,
  WORLD_NPCS,
  WORLD_OBJECTS,
  WORLD_WIDTH,
  type WorldObject,
} from '../world';

interface InteractionPoint {
  id: string;
  x: number;
  y: number;
  radius: number;
  prompt: string;
  action: () => void;
}

export class WorldScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private playerShadow!: Phaser.GameObjects.Ellipse;
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private keys?: Record<string, Phaser.Input.Keyboard.Key>;
  private activeDirections = new Set<Direction>();
  private interactionPoints: InteractionPoint[] = [];
  private message!: Phaser.GameObjects.Text;
  private prompt!: Phaser.GameObjects.Text;
  private nightOverlay!: Phaser.GameObjects.Rectangle;
  private lockedOverlay?: Phaser.GameObjects.Rectangle;
  private lockedLabel?: Phaser.GameObjects.Text;
  private gateVisual?: Phaser.GameObjects.Container;
  private gateCollider?: Phaser.GameObjects.Zone;
  private npcObstacles: Phaser.GameObjects.Zone[] = [];
  private lastNeedTick = 0;
  private unsubscribeStore?: () => void;
  private gateWasOpen = false;
  private readonly visualProfile: VisualProfile = currentVisualProfile();

  private readonly onMobileInput = (event: Event): void => {
    const detail = (event as CustomEvent<InputEventDetail>).detail;
    if (detail.active) this.activeDirections.add(detail.direction);
    else this.activeDirections.delete(detail.direction);
  };

  private readonly onAction = (): void => this.interact();

  constructor() {
    super('world');
  }

  create(): void {
    gameStore.setMode('world');
    const initial = gameStore.snapshot();
    this.gateWasOpen = Boolean(initial.flags.gateOpen);
    this.physics.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    this.cameras.main.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    this.drawGround();
    this.drawSceneryDetails();

    const obstacles = this.drawWorldObjects();
    this.drawGate(this.gateWasOpen);
    this.drawPeople();
    this.addEntrances();
    this.addActivities();

    const start = initial.worldPosition;
    this.playerShadow = this.add.ellipse(start.x + 2, start.y + 25, 35, 12, 0x07120f, 0.28).setDepth(39);
    this.player = this.physics.add.sprite(start.x, start.y, 'player');
    this.player.setCollideWorldBounds(true).setDepth(50);
    this.player.body?.setSize(21, 18).setOffset(12, 40);
    obstacles.forEach((obstacle) => this.physics.add.collider(this.player, obstacle));
    this.npcObstacles.forEach((obstacle) => this.physics.add.collider(this.player, obstacle));
    if (this.gateCollider) this.physics.add.collider(this.player, this.gateCollider);

    this.cameras.main.startFollow(this.player, true, 0.13, 0.13);
    this.cameras.main.setZoom(1.05);

    this.cursors = this.input.keyboard?.createCursorKeys();
    this.keys = this.input.keyboard?.addKeys('W,A,S,D,E,SPACE') as Record<string, Phaser.Input.Keyboard.Key>;
    this.keys?.E.on('down', () => this.interact());
    this.keys?.SPACE.on('down', () => this.interact());

    window.addEventListener(INPUT_EVENT, this.onMobileInput);
    window.addEventListener(ACTION_EVENT, this.onAction);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      window.removeEventListener(INPUT_EVENT, this.onMobileInput);
      window.removeEventListener(ACTION_EVENT, this.onAction);
      this.unsubscribeStore?.();
    });

    this.message = this.add.text(480, 596, initial.currentObjective, {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '17px',
      color: '#f5f1df',
      backgroundColor: '#14241fe9',
      padding: { x: 16, y: 10 },
      align: 'center',
      wordWrap: { width: 720 },
    }).setOrigin(0.5).setScrollFactor(0).setDepth(100);

    this.prompt = this.add.text(480, 545, '', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '14px',
      fontStyle: 'bold',
      color: '#173027',
      backgroundColor: '#f4d47be8',
      padding: { x: 12, y: 7 },
    }).setOrigin(0.5).setScrollFactor(0).setDepth(100).setVisible(false);

    this.unsubscribeStore = gameStore.subscribe((state) => this.onStoreUpdate(state));

    this.nightOverlay = this.add.rectangle(480, 320, 960, 640, 0x10254a, 0)
      .setScrollFactor(0)
      .setDepth(80)
      .setBlendMode(Phaser.BlendModes.MULTIPLY);
    this.time.addEvent({ delay: 1000, loop: true, callback: () => this.updateLighting() });
    this.updateLighting();
  }

  update(time: number): void {
    if (gameStore.snapshot().encounter) {
      this.player.setVelocity(0, 0);
      this.prompt.setVisible(false);
      return;
    }

    let horizontal = 0;
    let vertical = 0;
    if (this.cursors?.left.isDown || this.keys?.A.isDown || this.activeDirections.has('left')) horizontal -= 1;
    if (this.cursors?.right.isDown || this.keys?.D.isDown || this.activeDirections.has('right')) horizontal += 1;
    if (this.cursors?.up.isDown || this.keys?.W.isDown || this.activeDirections.has('up')) vertical -= 1;
    if (this.cursors?.down.isDown || this.keys?.S.isDown || this.activeDirections.has('down')) vertical += 1;

    const vector = new Phaser.Math.Vector2(horizontal, vertical).normalize().scale(158);
    this.player.setVelocity(vector.x, vector.y);
    this.playerShadow.setPosition(this.player.x + 2, this.player.y + 25);
    if (horizontal || vertical) {
      if (horizontal) this.player.setFlipX(horizontal < 0);
      const stride = Math.sin(time * 0.022);
      this.player.setScale(1 + Math.abs(stride) * 0.012, 1 - Math.abs(stride) * 0.018);
      this.player.setAngle(stride * 1.4);
      gameStore.setWorldPosition(this.player.x, this.player.y);
    } else {
      this.player.setScale(1).setAngle(0);
    }

    const nearby = this.nearestInteraction();
    this.prompt.setVisible(Boolean(nearby));
    if (nearby) this.prompt.setText(`AKTION · ${nearby.prompt}`);

    if (time - this.lastNeedTick > 12000) {
      this.lastNeedTick = time;
      gameStore.advanceMinutes(5);
    }
  }

  private drawGround(): void {
    const graphics = this.add.graphics();
    graphics.fillGradientStyle(0x6f985f, 0x789e63, 0x567d50, 0x628651, 1);
    graphics.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    graphics.fillStyle(0xa4c178, 0.18);
    for (let x = 22; x < WORLD_WIDTH; x += 44) {
      for (let y = 18; y < WORLD_HEIGHT; y += 48) {
        const offset = ((x / 44 + y / 48) % 3) * 4;
        graphics.fillCircle(x + offset, y, 2);
        graphics.fillRect(x + 9, y + 8, 2, 7);
      }
    }
    const grassTones = [0x315c3c, 0x436f43, 0x83a85d, 0xb8c979];
    for (let index = 0; index < 460; index += 1) {
      const x = seededFraction('grass-x', index) * WORLD_WIDTH;
      const y = seededFraction('grass-y', index) * WORLD_HEIGHT;
      if (x > 1210 && y < 820) continue;
      graphics.lineStyle(1.2, grassTones[index % grassTones.length], 0.32 + (index % 3) * 0.11);
      graphics.lineBetween(x, y + 5, x + (index % 2 ? 3 : -2), y);
      if (index % 17 === 0) {
        graphics.fillStyle(index % 34 === 0 ? 0xf0d27a : 0xe8eee0, 0.74);
        graphics.fillCircle(x + 3, y - 1, 1.8);
      }
    }

    graphics.fillStyle(0xb9a97c, 0.5);
    for (let y = 80; y < 760; y += 22) {
      graphics.fillEllipse(1239 + (y % 3) * 3, y, 28 + (y % 5) * 2, 12);
    }
    graphics.fillStyle(0x3d83a4, 1);
    graphics.fillRoundedRect(1240, 30, 360, 760, 70);
    graphics.fillGradientStyle(0x62b3cb, 0x4b9fbd, 0x2f7096, 0x357e9d, 0.72);
    graphics.fillRoundedRect(1260, 50, 340, 725, 58);
    graphics.lineStyle(3, 0xb7ecf2, 0.45);
    for (let y = 85; y < 760; y += 36) {
      graphics.beginPath();
      graphics.moveTo(1278, y);
      graphics.lineTo(1355, y - 6);
      graphics.lineTo(1440, y + 5);
      graphics.lineTo(1535, y - 4);
      graphics.strokePath();
    }
    graphics.lineStyle(2, 0xd7f9f0, 0.22);
    for (let index = 0; index < 18; index += 1) {
      const x = 1280 + seededFraction('lake-x', index) * 270;
      const y = 82 + seededFraction('lake-y', index) * 640;
      graphics.beginPath();
      graphics.moveTo(x - 22, y);
      graphics.lineTo(x, y - 4);
      graphics.lineTo(x + 28, y + 1);
      graphics.strokePath();
    }
    graphics.fillStyle(0x274f39, 0.72);
    for (let y = 80; y < 760; y += 34) {
      graphics.fillTriangle(1230, y + 10, 1248, y - 9, 1245, y + 15);
      graphics.fillTriangle(1221, y + 15, 1238, y - 3, 1234, y + 20);
    }
    graphics.fillStyle(0xf8e5ae, 0.52);
    for (let index = 0; index < 62; index += 1) {
      const x = 1138 + seededFraction('sand-x', index) * 126;
      const y = 550 + seededFraction('sand-y', index) * 235;
      graphics.fillCircle(x, y, index % 5 === 0 ? 2 : 1);
    }
    graphics.fillStyle(0xe7cf8f, 1);
    graphics.fillRoundedRect(1125, 535, 155, 270, 36);
    graphics.fillStyle(0xf2dfaa, 0.72);
    for (let y = 555; y < 795; y += 26) {
      graphics.fillEllipse(1170 + ((y / 26) % 2) * 20, y, 36, 5);
    }
    this.add.text(1290, 66, 'BLAUE ADRIA', this.zoneLabel('#eaf9ff')).setDepth(2);

    graphics.fillStyle(0x9f9576, 0.5);
    graphics.fillRoundedRect(682, 777, 296, 323, 31);
    graphics.fillStyle(0xbfae82, 1);
    graphics.fillRoundedRect(690, 785, 280, 315, 26);
    graphics.fillStyle(0xd5c18c, 1);
    graphics.fillRoundedRect(770, 40, 170, 765, 28);
    graphics.fillRoundedRect(250, 380, 1030, 92, 30);
    graphics.fillRoundedRect(260, 650, 920, 78, 30);
    graphics.lineStyle(3, 0xf0dfaa, 0.35);
    graphics.strokeRoundedRect(770, 40, 170, 765, 28);
    graphics.strokeRoundedRect(250, 380, 1030, 92, 30);
    graphics.strokeRoundedRect(260, 650, 920, 78, 30);
    graphics.fillStyle(0x806f53, 0.16);
    for (let x = 292; x < 1230; x += 72) graphics.fillEllipse(x, 426, 22, 8);
    for (let x = 300; x < 1150; x += 78) graphics.fillEllipse(x, 691, 24, 8);
    graphics.lineStyle(2, 0x7b694e, 0.17);
    for (let x = 292; x < 1215; x += 44) {
      graphics.lineBetween(x, 386 + (x % 5), x + 18, 390 + (x % 7));
      graphics.lineBetween(x + 8, 655 + (x % 6), x + 28, 658 + (x % 4));
    }
    graphics.fillStyle(0xf0dfaa, 0.18);
    for (let x = 300; x < 1210; x += 37) {
      graphics.fillCircle(x, 400 + (x % 41), 1.6 + (x % 3));
      graphics.fillCircle(x, 670 + (x % 39), 1.4 + (x % 2));
    }

    graphics.fillGradientStyle(0x8c9290, 0x7e8583, 0x5d6262, 0x676d6b, 1);
    graphics.fillRoundedRect(510, 850, 690, 220, 24);
    graphics.fillStyle(0xffffff, 0.045);
    for (let y = 868; y < 1050; y += 28) graphics.fillRect(530, y, 650, 2);
    graphics.lineStyle(4, 0xd8d4bd, 0.85);
    for (let x = 550; x < 1160; x += 102) {
      graphics.lineBetween(x, 885, x, 1018);
    }
    graphics.fillStyle(0x25302e, 0.18);
    graphics.fillEllipse(630, 950, 84, 24);
    graphics.fillEllipse(1065, 1015, 62, 15);
    graphics.lineStyle(2, 0xffffff, 0.12);
    for (let x = 534; x < 1170; x += 54) {
      graphics.lineBetween(x, 870, x + 22, 874);
    }
    this.add.text(530, 866, 'ANKUNFT & PARKPLATZ', this.zoneLabel('#f7f4df')).setDepth(2);

    graphics.fillStyle(0x7e5c3c, 1);
    graphics.fillRect(1250, 545, 110, 16);
    graphics.fillRect(1350, 545, 16, 130);
    this.add.text(1152, 764, 'STRAND', this.zoneLabel('#433521')).setDepth(2);
    this.add.text(430, 690, 'SÜDLAGER', this.zoneLabel('#26301d')).setDepth(2);
    this.add.text(455, 395, 'NORDLAGER', this.zoneLabel('#26301d')).setDepth(2);
  }

  private drawSceneryDetails(): void {
    const details = this.add.graphics().setDepth(3);

    details.fillStyle(0x24472e, 0.42);
    for (let y = 105; y < 760; y += 54) {
      details.fillTriangle(1218, y, 1235, y - 13, 1231, y + 14);
      details.fillTriangle(1205, y + 8, 1224, y - 5, 1218, y + 22);
    }

    for (let index = 0; index < this.visualProfile.animatedWaterLines; index += 1) {
      const x = 1300 + (index % 4) * 72;
      const y = 125 + Math.floor(index / 4) * 155 + (index % 3) * 27;
      const shimmer = this.add.graphics().setDepth(3);
      shimmer.lineStyle(3, index % 2 === 0 ? 0xd9fbf3 : 0x8ddae2, 0.3);
      shimmer.beginPath();
      shimmer.moveTo(x - 30, y);
      shimmer.lineTo(x, y - 4);
      shimmer.lineTo(x + 38, y + 2);
      shimmer.strokePath();
      this.tweens.add({
        targets: shimmer,
        x: { from: -8, to: 11 },
        alpha: { from: 0.32, to: 0.82 },
        duration: 1900 + index * 130,
        delay: index * 110,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.InOut',
      });
    }

    details.fillStyle(0x68462d, 1);
    details.fillRoundedRect(1246, 536, 122, 18, 4);
    details.fillRoundedRect(1350, 536, 18, 144, 4);
    details.lineStyle(2, 0xd4a86b, 0.72);
    for (let plank = 1252; plank < 1360; plank += 16) details.lineBetween(plank, 538, plank, 551);
    details.lineStyle(3, 0xe0cf9f, 0.55);
    details.beginPath();
    details.moveTo(1250, 538);
    details.lineTo(1280, 553);
    details.lineTo(1308, 559);
    details.lineTo(1337, 551);
    details.lineTo(1362, 540);
    details.strokePath();

    this.drawCampingClutter(details);

    for (const [x, y] of [[330, 505], [480, 760], [1040, 760], [1090, 310]] as Array<[number, number]>) {
      details.fillStyle(0x4d3828, 1);
      details.fillRect(x - 4, y, 8, 48);
      details.fillStyle(0xffdc7a, 0.16);
      details.fillCircle(x, y, 29);
      details.fillStyle(0xffdc7a, 1);
      details.fillCircle(x, y, 7);
      details.lineStyle(2, 0xfff3bd, 0.85);
      details.strokeCircle(x, y, 10);
    }

    details.lineStyle(3, 0x44311f, 0.75);
    details.lineBetween(745, 98, 1098, 112);
    const flagColors = [0xef685c, 0xf4c75d, 0x66dac6, 0x6e9fd2];
    for (let index = 0; index < 12; index += 1) {
      const x = 756 + index * 29;
      const y = 99 + index * 1.15;
      details.fillStyle(flagColors[index % flagColors.length], 0.95);
      details.fillTriangle(x, y, x + 22, y + 2, x + 11, y + 24);
    }

    details.fillStyle(0x2a251f, 0.28);
    details.fillEllipse(745, 621, 128, 48);
    details.lineStyle(8, 0x75614a, 1);
    details.strokeCircle(745, 610, 39);
    const glow = this.add.circle(745, 608, 48, 0xffa142, 0.12).setDepth(4);
    const flame = this.add.graphics().setDepth(5);
    flame.fillStyle(0xff5f3b, 0.95);
    flame.fillTriangle(726, 615, 746, 574, 765, 615);
    flame.fillStyle(0xffd15d, 0.98);
    flame.fillTriangle(736, 614, 748, 588, 757, 614);
    this.tweens.add({
      targets: [glow, flame],
      alpha: { from: 0.72, to: 1 },
      scale: { from: 0.96, to: 1.04 },
      duration: 540,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.InOut',
    });
    for (let index = 0; index < Math.max(5, Math.floor(this.visualProfile.ambientSprites / 2)); index += 1) {
      const ember = this.add.circle(
        735 + seededFraction('ember-x', index) * 24,
        592 + seededFraction('ember-y', index) * 18,
        1.5 + (index % 3),
        index % 2 === 0 ? 0xffd15d : 0xff7047,
        0.82,
      ).setDepth(6);
      this.tweens.add({
        targets: ember,
        x: `+=${Math.round((seededFraction('ember-drift', index) - 0.5) * 34)}`,
        y: `-=${38 + index * 5}`,
        alpha: 0,
        scale: 0.4,
        duration: 1200 + index * 190,
        delay: index * 230,
        repeat: -1,
      });
    }

    this.add.text(745, 650, 'FEUERSTELLE', {
      ...this.zoneLabel('#fff0bd'),
      fontSize: '12px',
      backgroundColor: '#173027b8',
      padding: { x: 6, y: 3 },
    }).setOrigin(0.5).setDepth(6);
  }

  private drawCampingClutter(graphics: Phaser.GameObjects.Graphics): void {
    // Cooler and supplies beside the south camp.
    graphics.fillStyle(0x152420, 0.22);
    graphics.fillEllipse(520, 694, 70, 18);
    graphics.fillStyle(0xe6e4d7, 1);
    graphics.fillRoundedRect(485, 646, 66, 44, 8);
    graphics.fillStyle(0xef685c, 1);
    graphics.fillRect(489, 658, 58, 23);
    graphics.lineStyle(3, 0x32413d, 0.8);
    graphics.strokeRoundedRect(485, 646, 66, 44, 8);
    graphics.lineBetween(503, 644, 533, 644);

    // Two bikes provide recognisable campsite scale without becoming collision traps.
    for (const [x, y, color] of [[1018, 727, 0xef685c], [1080, 737, 0x66dac6]] as Array<[number, number, number]>) {
      graphics.lineStyle(4, 0x24302d, 1);
      graphics.strokeCircle(x, y, 17);
      graphics.strokeCircle(x + 43, y, 17);
      graphics.lineStyle(4, color, 1);
      graphics.beginPath();
      graphics.moveTo(x, y);
      graphics.lineTo(x + 17, y - 31);
      graphics.lineTo(x + 30, y);
      graphics.lineTo(x, y);
      graphics.moveTo(x + 17, y - 31);
      graphics.lineTo(x + 43, y);
      graphics.strokePath();
      graphics.lineStyle(3, 0x24302d, 1);
      graphics.lineBetween(x + 11, y - 34, x + 28, y - 34);
    }

    // Barbecue, deckchairs and beach parasol.
    graphics.fillStyle(0x1d2825, 1);
    graphics.fillCircle(1075, 490, 24);
    graphics.fillRect(1070, 509, 5, 32);
    graphics.fillRect(1082, 509, 5, 32);
    graphics.fillStyle(0xef8c4c, 0.72);
    graphics.fillEllipse(1075, 486, 35, 10);
    graphics.lineStyle(6, 0xe85f52, 1);
    graphics.lineBetween(1150, 698, 1185, 745);
    graphics.lineBetween(1192, 698, 1160, 745);
    graphics.lineStyle(5, 0xffe3a0, 0.9);
    graphics.lineBetween(1157, 706, 1185, 706);
    graphics.fillStyle(0x47372b, 1);
    graphics.fillRect(1172, 556, 7, 112);
    graphics.fillStyle(0xf3c75d, 0.98);
    graphics.slice(1175, 556, 76, Phaser.Math.DegToRad(184), Phaser.Math.DegToRad(356), true);
    graphics.fillPath();

    // Laundry and pennants make the lived-in campsite readable at a glance.
    graphics.lineStyle(2, 0x4f3b2e, 0.75);
    graphics.lineBetween(420, 512, 665, 492);
    for (let index = 0; index < 7; index += 1) {
      const x = 442 + index * 32;
      const y = 510 - index * 2.6;
      graphics.fillStyle([0xef685c, 0xf4c75d, 0x66dac6, 0x6f91cf][index % 4], 0.92);
      graphics.fillRoundedRect(x, y, 23, 27 + (index % 2) * 7, 3);
      graphics.lineStyle(1, 0xffffff, 0.28);
      graphics.lineBetween(x + 4, y + 3, x + 19, y + 3);
    }

    // Reeds, stones and buoys soften the hard lake boundary.
    for (let index = 0; index < 28; index += 1) {
      const x = 1205 + (index % 5) * 8;
      const y = 90 + index * 24;
      graphics.lineStyle(3, index % 2 === 0 ? 0x476b3c : 0x6f8747, 0.9);
      graphics.lineBetween(x, y + 18, x + (index % 3) * 3 - 3, y);
      if (index % 4 === 0) {
        graphics.fillStyle(0x6d492c, 0.95);
        graphics.fillEllipse(x - 2, y + 2, 6, 14);
      }
    }
    for (const [x, y, color] of [[1450, 180, 0xef685c], [1500, 430, 0xf4c75d], [1405, 690, 0x66dac6]] as Array<[number, number, number]>) {
      graphics.lineStyle(4, 0xffffff, 0.85);
      graphics.strokeCircle(x, y, 10);
      graphics.lineStyle(5, color, 1);
      graphics.beginPath();
      graphics.arc(x, y, 10, 0, Math.PI * 0.48);
      graphics.strokePath();
      graphics.beginPath();
      graphics.arc(x, y, 10, Math.PI, Math.PI * 1.48);
      graphics.strokePath();
    }
  }

  private drawWorldObjects(): Phaser.GameObjects.Zone[] {
    const obstacles: Phaser.GameObjects.Zone[] = [];
    for (const object of WORLD_OBJECTS) {
      this.drawObject(object);
      if (object.solid === false || object.kind === 'sign') continue;
      obstacles.push(this.makeObstacle(object.x, object.y, object.width, object.height));
    }
    obstacles.push(this.makeObstacle(1260, 38, 340, 735));
    return obstacles;
  }

  private drawObject(object: WorldObject): void {
    const graphics = this.add.graphics().setDepth(4);
    const color = object.color ?? 0x7d5c3f;
    const { x, y, width, height } = object;

    if (object.kind === 'building') {
      graphics.fillStyle(0x102018, 0.26);
      graphics.fillEllipse(x + width / 2 + 13, y + height + 11, width * 1.01, 43);
      graphics.fillStyle(colorShade(color, 0.73), 1);
      graphics.fillRoundedRect(x + 10, y + 12, width, height, 15);
      graphics.fillStyle(color, 1);
      graphics.fillRoundedRect(x, y, width, height, 16);
      graphics.fillStyle(colorShade(color, 1.12), 0.38);
      graphics.fillRoundedRect(x + 7, y + 8, width - 14, 23, 8);
      graphics.lineStyle(2, colorShade(color, 0.72), 0.28);
      if (object.id === 'sanitary') {
        for (let row = y + 35; row < y + height; row += 20) {
          graphics.lineBetween(x + 5, row, x + width - 5, row);
        }
        for (let column = x + 25; column < x + width; column += 42) {
          graphics.lineBetween(column, y + 32, column, y + height - 5);
        }
      } else {
        for (let row = y + 38; row < y + height - 8; row += 19) {
          for (let column = x + 8 + ((row / 19) % 2) * 18; column < x + width - 8; column += 38) {
            graphics.lineBetween(column, row, Math.min(column + 28, x + width - 7), row);
          }
        }
      }
      graphics.fillStyle(0x573526, 1);
      graphics.fillTriangle(x - 12, y + 20, x + width / 2, y - 50, x + width + 12, y + 20);
      graphics.fillStyle(0x8d5637, 1);
      graphics.fillTriangle(x + 8, y + 17, x + width / 2, y - 39, x + width - 8, y + 17);
      graphics.lineStyle(3, 0xc78552, 0.74);
      for (let roofLine = 0; roofLine < 5; roofLine += 1) {
        const inset = 21 + roofLine * 18;
        graphics.lineBetween(
          x + inset,
          y + 11 - roofLine * 10,
          x + width - inset,
          y + 11 - roofLine * 10,
        );
      }
      graphics.lineStyle(4, 0x39251e, 0.74);
      graphics.lineBetween(x - 4, y + 20, x + width + 4, y + 20);
      graphics.fillStyle(0x493429, 1);
      graphics.fillRoundedRect(x + width * 0.72, y - 37, 23, 39, 3);
      graphics.fillStyle(0x1c2926, 0.55);
      graphics.fillEllipse(x + width * 0.72 + 11, y - 42, 19, 7);
      graphics.lineStyle(4, 0xffffff, 0.2);
      graphics.strokeRoundedRect(x, y, width, height, 16);
      graphics.fillGradientStyle(0x9cdae2, 0x5f9eb6, 0x3e718f, 0x629fb0, 1);
      graphics.fillRoundedRect(x + 22, y + 42, 48, 42, 5);
      graphics.fillRoundedRect(x + width - 70, y + 42, 48, 42, 5);
      graphics.lineStyle(3, 0xe7f6ef, 0.58);
      graphics.lineBetween(x + 46, y + 43, x + 46, y + 83);
      graphics.lineBetween(x + 23, y + 63, x + 69, y + 63);
      graphics.lineBetween(x + width - 46, y + 43, x + width - 46, y + 83);
      graphics.lineBetween(x + width - 69, y + 63, x + width - 23, y + 63);
      graphics.fillStyle(0x2e493a, 1);
      graphics.fillRoundedRect(x + 17, y + 84, 58, 10, 3);
      graphics.fillRoundedRect(x + width - 75, y + 84, 58, 10, 3);
      for (const flowerX of [x + 25, x + 39, x + 55, x + width - 64, x + width - 48, x + width - 32]) {
        graphics.fillStyle(flowerX % 3 === 0 ? 0xef685c : 0xf4c75d, 0.94);
        graphics.fillCircle(flowerX, y + 84, 3);
      }
      graphics.fillStyle(0x52382d, 1);
      graphics.fillRoundedRect(x + width / 2 - 25, y + height - 65, 50, 65, 7);
      graphics.fillStyle(0x7d5940, 0.72);
      graphics.fillRoundedRect(x + width / 2 - 19, y + height - 58, 38, 48, 4);
      graphics.lineStyle(2, 0xeccf8d, 0.32);
      graphics.strokeRoundedRect(x + width / 2 - 18, y + height - 57, 36, 46, 3);
      graphics.fillStyle(0xf4c75d, 0.95);
      graphics.fillCircle(x + width / 2 + 15, y + height - 32, 3);
      graphics.fillStyle(0x4b3428, 1);
      graphics.fillRect(x - 2, y + height - 7, width + 4, 9);
      if (object.id === 'clubhouse') {
        graphics.fillStyle(0xf4c75d, 0.98);
        graphics.fillRoundedRect(x + 78, y + 25, width - 156, 28, 6);
        graphics.lineStyle(2, 0xffefbf, 0.65);
        graphics.strokeRoundedRect(x + 78, y + 25, width - 156, 28, 6);
      }
    } else if (object.kind === 'tent' || object.kind === 'party-tent') {
      graphics.fillStyle(0x112419, 0.24);
      graphics.fillEllipse(x + width / 2 + 8, y + height + 9, width * 1.06, 34);
      graphics.fillStyle(colorShade(color, 0.62), 1);
      graphics.fillTriangle(x + 8, y + height + 3, x + width / 2 + 5, y + 6, x + width + 7, y + height + 3);
      graphics.fillStyle(color, 1);
      graphics.fillTriangle(x, y + height, x + width / 2, y, x + width, y + height);
      graphics.fillStyle(colorShade(color, 1.18), 0.5);
      graphics.fillTriangle(x + 8, y + height - 2, x + width / 2, y + 8, x + width / 2, y + height - 2);
      graphics.lineStyle(object.kind === 'party-tent' ? 6 : 4, 0xf7e8bd, 0.58);
      graphics.lineBetween(x + width / 2, y + 7, x + width / 2, y + height);
      graphics.lineStyle(2, colorShade(color, 0.54), 0.75);
      graphics.lineBetween(x + 8, y + height - 1, x + width / 2, y + 8);
      graphics.lineBetween(x + width - 8, y + height - 1, x + width / 2, y + 8);
      graphics.fillStyle(0x172525, 0.54);
      graphics.fillTriangle(
        x + width * 0.31,
        y + height,
        x + width / 2,
        y + height * 0.42,
        x + width * 0.69,
        y + height,
      );
      graphics.fillStyle(0xffdc7a, 0.28);
      graphics.fillTriangle(
        x + width * 0.43,
        y + height * 0.94,
        x + width / 2,
        y + height * 0.53,
        x + width * 0.57,
        y + height * 0.94,
      );
      graphics.lineStyle(2, 0xffefc8, 0.38);
      graphics.lineBetween(x - 12, y + height + 8, x + width / 2, y);
      graphics.lineBetween(x + width + 12, y + height + 8, x + width / 2, y);
      graphics.fillStyle(0xf4c75d, 0.75);
      graphics.fillCircle(x - 12, y + height + 8, 3);
      graphics.fillCircle(x + width + 12, y + height + 8, 3);
      graphics.fillStyle(0x9b7a4d, 0.9);
      graphics.fillRoundedRect(x + width * 0.31, y + height - 3, width * 0.38, 13, 3);
      graphics.lineStyle(1.5, 0xf8e0ad, 0.36);
      for (let stitch = x + 14; stitch < x + width - 10; stitch += 15) {
        graphics.lineBetween(stitch, y + height - 2, stitch + 7, y + height - 2);
      }
      if (object.kind === 'party-tent') {
        graphics.lineStyle(5, 0xe6d7ad, 1);
        graphics.lineBetween(x + 10, y + height, x + 10, y + height + 23);
        graphics.lineBetween(x + width - 10, y + height, x + width - 10, y + height + 23);
        graphics.fillStyle(0xf7e7ba, 0.96);
        graphics.fillRoundedRect(x + 10, y + height + 4, width - 20, 12, 3);
        for (let lamp = 0; lamp < 9; lamp += 1) {
          graphics.fillStyle([0xf4c75d, 0xef685c, 0x66dac6][lamp % 3], 0.96);
          graphics.fillCircle(x + 25 + lamp * ((width - 50) / 8), y + height + 16, 4);
        }
      } else {
        graphics.fillStyle(colorShade(color, 0.5), 0.95);
        graphics.fillRoundedRect(x + width - 22, y + height + 2, 30, 16, 5);
        graphics.fillStyle(0xd5be7f, 0.92);
        graphics.fillCircle(x + width - 7, y + height + 1, 7);
      }
    } else if (object.kind === 'camper') {
      graphics.fillStyle(0x102018, 0.25);
      graphics.fillEllipse(x + width / 2 + 10, y + height + 9, width * 1.04, 38);
      graphics.fillStyle(colorShade(color, 0.72), 1);
      graphics.fillRoundedRect(x + 9, y + 9, width, height, 18);
      graphics.fillStyle(color, 1);
      graphics.fillRoundedRect(x, y, width, height, 18);
      graphics.fillStyle(0xffffff, 0.42);
      graphics.fillRoundedRect(x + 14, y + 7, width - 28, 12, 6);
      graphics.fillStyle(0xef685c, 0.8);
      graphics.fillRect(x + 9, y + 66, width - 18, 12);
      graphics.lineStyle(2, 0xffffff, 0.45);
      graphics.lineBetween(x + 12, y + 71, x + width - 12, y + 71);
      graphics.fillGradientStyle(0xa8d6df, 0x5f94aa, 0x3e6e86, 0x6096a8, 1);
      graphics.fillRoundedRect(x + 24, y + 20, 62, 38, 6);
      graphics.fillRoundedRect(x + width - 83, y + 20, 58, 38, 6);
      graphics.lineStyle(2, 0xdff5f4, 0.7);
      graphics.lineBetween(x + 55, y + 21, x + 55, y + 57);
      graphics.lineBetween(x + 25, y + 39, x + 85, y + 39);
      graphics.lineBetween(x + width - 82, y + 39, x + width - 26, y + 39);
      graphics.fillStyle(0xb8a987, 1);
      graphics.fillRoundedRect(x + width / 2 - 24, y + 20, 48, 74, 5);
      graphics.fillStyle(0x7d6a50, 1);
      graphics.fillRoundedRect(x + width / 2 - 17, y + 27, 34, 31, 3);
      graphics.fillStyle(0x5a4c3d, 1);
      graphics.fillCircle(x + width / 2 + 13, y + 56, 3);
      graphics.fillStyle(0xf5d37a, 1);
      graphics.fillRoundedRect(x + 18, y + 84, 40, 11, 3);
      graphics.fillStyle(0x20332d, 0.9);
      graphics.fillRoundedRect(x + 74, y - 7, 58, 18, 6);
      graphics.lineStyle(2, 0xe5dec5, 0.55);
      for (let vent = x + 82; vent < x + 125; vent += 8) graphics.lineBetween(vent, y - 2, vent, y + 6);
      graphics.fillStyle(0x272d2c, 1);
      graphics.fillCircle(x + 48, y + height, 17);
      graphics.fillCircle(x + width - 48, y + height, 17);
      graphics.fillStyle(0xc4c8bd, 1);
      graphics.fillCircle(x + 48, y + height, 7);
      graphics.fillCircle(x + width - 48, y + height, 7);
      graphics.lineStyle(4, 0x594432, 0.95);
      graphics.lineBetween(x + 12, y + height - 4, x + 12, y + height + 20);
      graphics.lineBetween(x + width - 12, y + height - 4, x + width - 12, y + height + 20);
      graphics.fillStyle(0xf4c75d, 0.96);
      graphics.fillCircle(x + width - 8, y + 80, 4);
    } else if (object.kind === 'tree') {
      graphics.fillStyle(0x17351f, 0.22);
      graphics.fillEllipse(x + width * 0.56, y + height * 0.94, width * 1.08, height * 0.34);
      graphics.fillStyle(0x3d2a1b, 1);
      graphics.fillRoundedRect(x + width * 0.39, y + height * 0.48, width * 0.22, height * 0.5, 5);
      graphics.fillStyle(0x68472b, 0.9);
      graphics.fillRoundedRect(x + width * 0.44, y + height * 0.5, width * 0.07, height * 0.46, 3);
      graphics.lineStyle(5, 0x49301e, 0.9);
      graphics.lineBetween(x + width * 0.49, y + height * 0.61, x + width * 0.25, y + height * 0.37);
      graphics.lineBetween(x + width * 0.52, y + height * 0.58, x + width * 0.78, y + height * 0.31);
      const canopy = [
        [0.5, 0.34, 0.48, 0x245233],
        [0.28, 0.39, 0.3, 0x376b3e],
        [0.72, 0.39, 0.31, 0x2f6237],
        [0.39, 0.18, 0.29, 0x56834a],
        [0.65, 0.2, 0.28, 0x477844],
        [0.5, 0.08, 0.2, 0x6e9a54],
      ] as Array<[number, number, number, number]>;
      for (const [cx, cy, size, tone] of canopy) {
        graphics.fillStyle(tone, 1);
        graphics.fillCircle(x + width * cx, y + height * cy, width * size);
      }
      graphics.fillStyle(0xc4d88a, 0.42);
      graphics.fillCircle(x + width * 0.33, y + height * 0.14, width * 0.1);
      graphics.fillCircle(x + width * 0.56, y + height * 0.02, width * 0.08);
      graphics.fillStyle(0xd9c578, 0.72);
      graphics.fillCircle(x + width * 0.12, y + height * 0.92, 2);
      graphics.fillCircle(x + width * 0.78, y + height * 0.97, 2);
      graphics.fillCircle(x + width * 0.94, y + height * 0.89, 1.5);
    } else if (object.kind === 'fence') {
      graphics.fillStyle(0x15241e, 0.24);
      graphics.fillRect(x + 5, y + height + 5, width, 9);
      graphics.fillStyle(0x60482f, 1);
      graphics.fillRect(x, y + 3, width, 7);
      graphics.fillRect(x, y + height - 8, width, 7);
      graphics.fillStyle(0xd5bf8f, 1);
      for (let post = x; post <= x + width; post += 48) {
        graphics.fillRoundedRect(post, y - 13, 10, height + 26, 3);
        graphics.fillStyle(0xf0d9a4, 0.52);
        graphics.fillTriangle(post, y - 13, post + 5, y - 20, post + 10, y - 13);
        graphics.fillStyle(0xd5bf8f, 1);
      }
      graphics.lineStyle(1.5, 0x3e3429, 0.42);
      for (let knot = x + 18; knot < x + width; knot += 73) graphics.strokeCircle(knot, y + 6, 2);
    } else if (object.kind === 'table' || object.kind === 'bench') {
      graphics.fillStyle(0x17301f, 0.24);
      graphics.fillEllipse(x + width / 2 + 4, y + height + 10, width, 20);
      graphics.fillStyle(0x48321f, 1);
      graphics.fillRect(x + 12, y + height - 2, 8, 24);
      graphics.fillRect(x + width - 20, y + height - 2, 8, 24);
      graphics.fillStyle(0x6f472b, 1);
      graphics.fillRoundedRect(x, y, width, height, 8);
      graphics.lineStyle(4, 0xc48a4f, 0.75);
      graphics.lineBetween(x + 10, y + height / 2, x + width - 10, y + height / 2);
      graphics.lineStyle(2, 0x3e281b, 0.5);
      for (let plank = x + 15; plank < x + width; plank += 24) {
        graphics.lineBetween(plank, y + 4, plank + 8, y + height - 4);
      }
      if (object.kind === 'table') {
        graphics.fillStyle(0xd64f52, 0.95);
        graphics.fillRoundedRect(x + width * 0.2, y - 10, 12, 20, 3);
        graphics.fillStyle(0xf2eee0, 0.9);
        graphics.fillRect(x + width * 0.2 + 1, y - 6, 10, 4);
        graphics.fillStyle(0x66dac6, 0.9);
        graphics.fillCircle(x + width * 0.72, y + 3, 8);
        graphics.fillStyle(0xdce8dd, 0.8);
        graphics.fillCircle(x + width * 0.72, y + 3, 3);
      }
    } else {
      graphics.fillStyle(0x17241f, 0.2);
      graphics.fillEllipse(x + width / 2 + 4, y + height + 4, width * 0.9, 14);
      graphics.fillStyle(0x6b5136, 1);
      graphics.fillRoundedRect(x + width / 2 - 6, y + height * 0.5, 12, height * 0.58, 3);
      graphics.fillStyle(0xe0c06e, 1);
      graphics.fillRoundedRect(x, y, width, height * 0.65, 7);
      graphics.fillStyle(0xf4e2a7, 0.48);
      graphics.fillRoundedRect(x + 5, y + 5, width - 10, 8, 3);
      graphics.lineStyle(2, 0x5f472f, 0.62);
      graphics.strokeRoundedRect(x, y, width, height * 0.65, 7);
    }

    if (object.label) {
      this.add.text(x + width / 2, y + height / 2, object.label, {
        fontFamily: 'Arial Black, system-ui, sans-serif',
        fontSize: object.kind === 'sign' ? '10px' : '12px',
        fontStyle: 'bold',
        color: object.kind === 'building' ? '#fff4d2' : '#213027',
        stroke: object.kind === 'building' ? '#13241f' : '#f3d98d',
        strokeThickness: object.kind === 'building' ? 3 : 2,
        align: 'center',
      }).setOrigin(0.5).setDepth(6);
    }
  }

  private drawGate(open: boolean): void {
    const leftShadow = this.add.ellipse(780, 819, 47, 14, 0x07120f, 0.28);
    const rightShadow = this.add.ellipse(884, 819, 47, 14, 0x07120f, 0.28);
    const left = this.add.rectangle(778, 800, 38, 42, 0xd4ba76, 1).setStrokeStyle(3, 0x59472f, 0.8);
    const right = this.add.rectangle(882, 800, 38, 42, 0xd4ba76, 1).setStrokeStyle(3, 0x59472f, 0.8);
    const leftLamp = this.add.circle(778, 778, 8, 0xffdf82, 1).setStrokeStyle(3, 0xfff3bd, 0.65);
    const rightLamp = this.add.circle(882, 778, 8, 0xffdf82, 1).setStrokeStyle(3, 0xfff3bd, 0.65);
    const barrier = this.add.rectangle(830, 797, 104, 16, 0xd9584e, 1).setStrokeStyle(2, 0x6f2827, 0.72);
    const stripe1 = this.add.rectangle(808, 797, 19, 16, 0xffffff, 0.92).setAngle(-18);
    const stripe2 = this.add.rectangle(851, 797, 19, 16, 0xffffff, 0.92).setAngle(-18);
    const hinge = this.add.circle(782, 797, 9, 0x27312e, 1).setStrokeStyle(2, 0xe6cf90, 0.7);
    this.gateVisual = this.add.container(0, 0, [
      leftShadow,
      rightShadow,
      left,
      right,
      leftLamp,
      rightLamp,
      barrier,
      stripe1,
      stripe2,
      hinge,
    ]).setDepth(25);
    if (open) {
      barrier.setAngle(-78).setPosition(786, 758);
      stripe1.setVisible(false);
      stripe2.setVisible(false);
    } else {
      this.gateCollider = this.makeObstacle(760, 786, 140, 34);
      this.lockedOverlay = this.add.rectangle(800, 390, 1600, 780, 0x12261f, 0.2).setDepth(24);
      this.lockedLabel = this.add.text(830, 750, 'CAMPINGPLATZ GESPERRT', {
        fontFamily: 'system-ui, sans-serif',
        fontSize: '22px',
        fontStyle: 'bold',
        color: '#ffe09a',
        backgroundColor: '#13251fe6',
        padding: { x: 16, y: 9 },
      }).setOrigin(0.5).setDepth(26);
    }
  }

  private drawPeople(): void {
    for (const placement of WORLD_NPCS) {
      const character = RELATIONSHIP_CHARACTERS.find((entry) => entry.id === placement.id);
      if (!character) continue;
      this.add.ellipse(placement.x + 2, placement.y + 25, 34, 11, 0x07120f, 0.28).setDepth(40);
      const sprite = this.physics.add.staticSprite(placement.x, placement.y, `npc-${placement.id}`).setDepth(42);
      this.add.text(placement.x, placement.y - 45, character.name, this.npcStyle())
        .setOrigin(0.5)
        .setDepth(43);
      const solid = this.add.zone(sprite.x, sprite.y + 18, 26, 26);
      this.physics.add.existing(solid, true);
      this.npcObstacles.push(solid);
      this.interactionPoints.push({
        id: `npc-${placement.id}`,
        x: placement.x,
        y: placement.y,
        radius: 72,
        prompt: `Mit ${character.name} sprechen`,
        action: () => this.talkToCharacter(character.id),
      });
    }
  }

  private addEntrances(): void {
    for (const entrance of WORLD_ENTRANCES) {
      this.add.image(entrance.x, entrance.y, 'door-marker').setDepth(34);
      this.interactionPoints.push({
        id: entrance.id,
        x: entrance.x,
        y: entrance.y,
        radius: 64,
        prompt: entrance.label,
        action: () => {
          const state = gameStore.snapshot();
          if (entrance.requiresGate && !state.flags.gateOpen) {
            this.showMessage('Das liegt hinter dem geschlossenen Tor. Erst Gundula, dann Uli.');
            return;
          }
          gameStore.setWorldPosition(this.player.x, this.player.y);
          gameStore.enterInterior(entrance.interiorId);
          this.scene.start('interior');
        },
      });
    }
  }

  private addActivities(): void {
    this.addActivity(260, 340, 'CAMPING-DUELL', 'Ronny herausfordern', () => {
      const state = gameStore.snapshot();
      if (!state.flags.gateOpen) return this.showMessage('Ronny wartet hinter dem Tor. Leider redet er trotzdem hörbar.');
      if (state.flags.firstBattleWon) return this.showMessage('Ronny wurde bereits überzeugt. Sein Vortrag läuft außer Konkurrenz weiter.');
      gameStore.setWorldPosition(this.player.x, this.player.y);
      this.scene.start('battle');
    });

    this.addActivity(1165, 715, 'FLUNKYBALL', 'Flunkyball starten', () => {
      const state = gameStore.snapshot();
      if (!state.flags.gateOpen) return this.showMessage('Der Strand bleibt bis zum Einlass unerreichbar.');
      if (state.flags.flunkyballWon) return this.showMessage('Die Strandstaffel ist bereits gewonnen. Der Rufbonus bleibt einmalig.');
      gameStore.setWorldPosition(this.player.x, this.player.y);
      this.scene.start('flunkyball');
    });
  }

  private addActivity(x: number, y: number, label: string, prompt: string, action: () => void): void {
    this.add.image(x, y, 'activity-marker').setDepth(32);
    this.add.text(x, y + 27, label, this.npcStyle()).setOrigin(0.5).setDepth(33);
    this.interactionPoints.push({ id: label, x, y, radius: 68, prompt, action });
  }

  private talkToCharacter(id: string): void {
    const state = gameStore.snapshot();
    if (id === 'gundula') {
      if (state.flags.gundulaConvinced) {
        gameStore.socialize(id);
        this.showMessage('Gundula: „Der erste Eindruck war ausreichend. Ruinier ihn nicht rückwirkend.“');
      } else {
        gameStore.openEncounter('gundula-entry');
      }
      return;
    }

    if (id === 'uli') {
      if (!state.flags.gundulaConvinced) {
        this.showMessage('Uli: „Erst Anmeldung bei Gundula. Ich bin hier für Geometrie, nicht für Gefühle.“');
      } else if (state.flags.uliConvinced) {
        gameStore.socialize(id);
        this.showMessage('Uli: „Parkplatz vier bleibt Parkplatz vier. Wir verstehen uns.“');
      } else {
        gameStore.openEncounter('uli-entry');
      }
      return;
    }

    if (!state.flags.gateOpen) {
      this.showMessage('Die Person steht hinter dem gesperrten Tor. Verwaltungsphysik ist unerbittlich.');
      return;
    }

    if (id === 'manni' && state.quests.paper.status !== 'completed') {
      gameStore.openEncounter('manni-paper');
      return;
    }
    if (id === 'ronny' && !state.flags.firstBattleWon) {
      this.showMessage('Ronny: „Reden können wir nach dem Camping-Duell. Vorher rede nur ich.“');
      return;
    }

    const character = RELATIONSHIP_CHARACTERS.find((entry) => entry.id === id);
    if (!character) return;
    const first = gameStore.socialize(id);
    this.showMessage(first ? `${character.name} gefunden · Beziehung +${character.group === 'freunde' ? 8 : 3}` : character.line);
  }

  private interact(): void {
    const nearest = this.nearestInteraction();
    if (!nearest) {
      this.showMessage('Hier ist nichts in Reichweite. Personen, Türen und goldene Marker reagieren auf Aktion.');
      return;
    }
    nearest.action();
  }

  private nearestInteraction(): InteractionPoint | undefined {
    if (!this.player) return undefined;
    return this.interactionPoints
      .map((point) => ({
        point,
        distance: Phaser.Math.Distance.Between(this.player.x, this.player.y, point.x, point.y),
      }))
      .filter(({ point, distance }) => distance <= point.radius)
      .sort((a, b) => a.distance - b.distance)[0]?.point;
  }

  private onStoreUpdate(state: GameSnapshot): void {
    if (!state.encounter && this.message) this.message.setText(state.currentObjective);
    const isOpen = Boolean(state.flags.gateOpen);
    if (isOpen && !this.gateWasOpen) this.openGate();
    this.gateWasOpen = isOpen;
  }

  private openGate(): void {
    this.gateCollider?.destroy();
    this.gateCollider = undefined;
    if (this.gateVisual) {
      const movable = this.gateVisual.list.slice(6, 9);
      this.tweens.add({
        targets: movable,
        angle: -78,
        y: '-=43',
        x: '-=44',
        alpha: 0.88,
        duration: 800,
        ease: 'Back.Out',
      });
    }
    if (this.lockedOverlay) this.tweens.add({ targets: this.lockedOverlay, alpha: 0, duration: 900 });
    if (this.lockedLabel) this.tweens.add({ targets: this.lockedLabel, alpha: 0, y: '-=35', duration: 650 });
    this.cameras.main.flash(450, 244, 212, 123, false);
    this.showMessage('TOR GEÖFFNET · Der gesamte Campingplatz ist jetzt freigeschaltet.');
  }

  private makeObstacle(x: number, y: number, width: number, height: number): Phaser.GameObjects.Zone {
    const zone = this.add.zone(x + width / 2, y + height / 2, width, height);
    this.physics.add.existing(zone, true);
    return zone;
  }

  private showMessage(text: string): void {
    if (!this.message) return;
    this.message.setText(text).setAlpha(1);
    this.tweens.killTweensOf(this.message);
    this.tweens.add({ targets: this.message, alpha: 0.84, duration: 2400, yoyo: true });
  }

  private updateLighting(): void {
    const { minutes } = gameStore.snapshot();
    const hour = minutes / 60;
    let alpha = 0;
    if (hour >= 19) alpha = Math.min(0.62, (hour - 19) * 0.12);
    if (hour < 6) alpha = 0.62;
    if (hour >= 6 && hour < 8) alpha = Math.max(0, 0.45 - (hour - 6) * 0.22);
    this.nightOverlay.setAlpha(alpha);
  }

  private zoneLabel(color: string): Phaser.Types.GameObjects.Text.TextStyle {
    return { fontFamily: 'system-ui, sans-serif', fontSize: '16px', fontStyle: 'bold', color };
  }

  private npcStyle(): Phaser.Types.GameObjects.Text.TextStyle {
    return {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '13px',
      fontStyle: 'bold',
      color: '#fff8dc',
      backgroundColor: '#173027d9',
      padding: { x: 6, y: 3 },
    };
  }
}
