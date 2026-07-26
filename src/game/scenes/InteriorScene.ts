import Phaser from 'phaser';
import { ACTION_EVENT, INPUT_EVENT, type InputEventDetail } from '../events';
import { gameStore } from '../state/GameStore';
import type { Direction } from '../types';
import { addCinematicFrame, colorShade, currentVisualProfile, seededFraction } from '../visuals';
import { INTERIORS } from '../world';

interface InteriorAction {
  x: number;
  y: number;
  radius: number;
  label: string;
  action: () => void;
}

export class InteriorScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private playerShadow!: Phaser.GameObjects.Ellipse;
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private keys?: Record<string, Phaser.Input.Keyboard.Key>;
  private activeDirections = new Set<Direction>();
  private actions: InteriorAction[] = [];
  private message!: Phaser.GameObjects.Text;
  private readonly visualProfile = currentVisualProfile();

  private readonly onMobileInput = (event: Event): void => {
    const detail = (event as CustomEvent<InputEventDetail>).detail;
    if (detail.active) this.activeDirections.add(detail.direction);
    else this.activeDirections.delete(detail.direction);
  };

  private readonly onAction = (): void => this.interact();

  constructor() {
    super('interior');
  }

  create(): void {
    const interiorId = gameStore.snapshot().currentInterior;
    if (!interiorId || !(interiorId in INTERIORS)) {
      gameStore.leaveInterior();
      this.scene.start('world');
      return;
    }

    const interior = INTERIORS[interiorId as keyof typeof INTERIORS];
    this.cameras.main.setBackgroundColor('#07151c');
    this.drawRoom(interior.id, interior.floor, interior.wall);

    this.add.text(480, 25, 'INNENRAUM · BLAUE ADRIA', {
      fontFamily: 'Arial, system-ui, sans-serif',
      fontSize: '11px',
      fontStyle: 'bold',
      letterSpacing: 3,
      color: '#66dac6',
    }).setOrigin(0.5);
    this.add.text(480, 53, interior.title.toUpperCase(), {
      fontFamily: 'Arial Black, system-ui, sans-serif',
      fontSize: '30px',
      fontStyle: 'bold',
      color: '#fff0bd',
      stroke: '#132523',
      strokeThickness: 5,
    }).setOrigin(0.5);
    this.add.text(480, 84, interior.subtitle, {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '14px',
      color: '#d8d1b8',
    }).setOrigin(0.5);

    this.playerShadow = this.add.ellipse(482, 560, 35, 11, 0x030907, 0.3).setDepth(18);
    this.player = this.physics.add.sprite(480, 535, 'player');
    this.player.setCollideWorldBounds(true).setDepth(20);
    this.player.body?.setSize(21, 18).setOffset(12, 40);

    const walls = [
      this.makeObstacle(110, 112, 740, 24),
      this.makeObstacle(110, 112, 24, 450),
      this.makeObstacle(826, 112, 24, 450),
      this.makeObstacle(110, 538, 310, 24),
      this.makeObstacle(540, 538, 310, 24),
    ];
    walls.forEach((wall) => this.physics.add.collider(this.player, wall));

    this.addAction(480, 548, 'ZURÜCK', () => this.leave());
    this.drawInteriorContent(interior.id);

    this.cursors = this.input.keyboard?.createCursorKeys();
    this.keys = this.input.keyboard?.addKeys('W,A,S,D,E,SPACE,ESC') as Record<string, Phaser.Input.Keyboard.Key>;
    this.keys?.E.on('down', () => this.interact());
    this.keys?.SPACE.on('down', () => this.interact());
    this.keys?.ESC.on('down', () => this.leave());

    window.addEventListener(INPUT_EVENT, this.onMobileInput);
    window.addEventListener(ACTION_EVENT, this.onAction);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      window.removeEventListener(INPUT_EVENT, this.onMobileInput);
      window.removeEventListener(ACTION_EVENT, this.onAction);
    });

    this.message = this.add.text(480, 605, 'Gehe zu einem goldenen Marker und drücke Aktion.', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '16px',
      color: '#fff8dc',
      backgroundColor: '#071820ee',
      padding: { x: 18, y: 10 },
    }).setOrigin(0.5).setDepth(100);
    addCinematicFrame(this, interior.id === 'sanitary' ? 0x66dac6 : 0xf4c75d);
  }

  update(time: number): void {
    const speed = 150;
    let horizontal = 0;
    let vertical = 0;
    if (this.cursors?.left.isDown || this.keys?.A.isDown || this.activeDirections.has('left')) horizontal -= 1;
    if (this.cursors?.right.isDown || this.keys?.D.isDown || this.activeDirections.has('right')) horizontal += 1;
    if (this.cursors?.up.isDown || this.keys?.W.isDown || this.activeDirections.has('up')) vertical -= 1;
    if (this.cursors?.down.isDown || this.keys?.S.isDown || this.activeDirections.has('down')) vertical += 1;
    const vector = new Phaser.Math.Vector2(horizontal, vertical).normalize().scale(speed);
    this.player.setVelocity(vector.x, vector.y);
    this.playerShadow.setPosition(this.player.x + 2, this.player.y + 25);
    if (horizontal || vertical) {
      if (horizontal) this.player.setFlipX(horizontal < 0);
      const stride = Math.sin(time * 0.023);
      this.player.setScale(1 + Math.abs(stride) * 0.012, 1 - Math.abs(stride) * 0.018);
      this.player.setAngle(stride * 1.4);
    } else {
      this.player.setScale(1).setAngle(0);
    }
  }

  private drawRoom(id: keyof typeof INTERIORS, floor: number, wall: number): void {
    const graphics = this.add.graphics();
    graphics.fillStyle(0x000000, 0.34);
    graphics.fillRoundedRect(94, 103, 772, 474, 27);
    graphics.fillStyle(colorShade(wall, 0.47), 1);
    graphics.fillRoundedRect(102, 104, 756, 466, 24);
    graphics.fillStyle(floor, 1);
    graphics.fillRoundedRect(110, 112, 740, 450, 20);
    graphics.lineStyle(24, wall, 1);
    graphics.strokeRoundedRect(110, 112, 740, 450, 20);
    this.drawFloorMaterial(graphics, id, floor);

    graphics.fillGradientStyle(0xcaf4ee, 0x78c1cd, 0x5d91a7, 0x7db1bb, 0.78);
    graphics.fillRoundedRect(155, 126, 112, 53, 8);
    graphics.fillRoundedRect(693, 126, 112, 53, 8);
    graphics.lineStyle(4, 0xdff8ed, 0.52);
    graphics.strokeRoundedRect(155, 126, 112, 53, 8);
    graphics.strokeRoundedRect(693, 126, 112, 53, 8);
    graphics.lineBetween(211, 128, 211, 177);
    graphics.lineBetween(749, 128, 749, 177);
    graphics.fillStyle(0xffffff, 0.36);
    graphics.fillTriangle(160, 131, 220, 131, 160, 169);
    graphics.fillTriangle(698, 131, 758, 131, 698, 169);
    graphics.fillStyle(0x27443a, 0.9);
    graphics.fillRoundedRect(150, 174, 122, 8, 3);
    graphics.fillRoundedRect(688, 174, 122, 8, 3);

    for (const x of [260, 480, 700]) {
      graphics.fillStyle(0xffd471, 0.12);
      graphics.fillCircle(x, 118, 34);
      graphics.fillStyle(0xffd471, 0.05);
      graphics.fillCircle(x, 118, 52);
      graphics.fillStyle(0xffd471, 1);
      graphics.fillCircle(x, 118, 7);
      graphics.lineStyle(2, 0xfff2b2, 0.7);
      graphics.strokeCircle(x, 118, 11);
    }

    graphics.fillStyle(0xe7c46d, 1);
    graphics.fillRect(420, 536, 120, 14);
    graphics.lineStyle(3, 0xfff0ae, 0.5);
    graphics.lineBetween(424, 541, 536, 541);
    this.drawInteriorAtmosphere();
  }

  private drawFloorMaterial(
    graphics: Phaser.GameObjects.Graphics,
    id: keyof typeof INTERIORS,
    floor: number,
  ): void {
    if (id === 'sanitary') {
      graphics.lineStyle(2, 0xeafcff, 0.22);
      for (let x = 126; x < 840; x += 42) graphics.lineBetween(x, 128, x, 540);
      for (let y = 132; y < 545; y += 42) graphics.lineBetween(124, y, 836, y);
      graphics.fillStyle(0xf6ffff, 0.14);
      for (let x = 135; x < 830; x += 84) {
        for (let y = 140; y < 530; y += 84) graphics.fillRoundedRect(x, y, 31, 3, 2);
      }
      return;
    }
    if (id === 'home-tent') {
      graphics.fillStyle(colorShade(floor, 0.7), 0.38);
      for (let band = 130; band < 545; band += 34) {
        graphics.fillRect(124, band, 712, 16);
      }
      graphics.lineStyle(2, 0xf8e8b8, 0.16);
      graphics.beginPath();
      graphics.moveTo(120, 118);
      graphics.lineTo(480, 350);
      graphics.lineTo(840, 118);
      graphics.strokePath();
      return;
    }
    graphics.lineStyle(2, colorShade(floor, 0.66), 0.28);
    for (let y = 132; y < 545; y += 34) {
      graphics.lineBetween(124, y, 836, y);
      for (let x = 140 + ((y / 34) % 2) * 28; x < 830; x += 78) {
        graphics.lineBetween(x, y, x, y + 33);
      }
    }
    graphics.fillStyle(0xfff1c7, 0.07);
    for (let index = 0; index < 80; index += 1) {
      graphics.fillCircle(
        130 + seededFraction(`${id}-floor-x`, index) * 700,
        130 + seededFraction(`${id}-floor-y`, index) * 405,
        1.5,
      );
    }
  }

  private drawInteriorAtmosphere(): void {
    if (!this.visualProfile.postFx) return;
    for (let index = 0; index < 8; index += 1) {
      const mote = this.add.circle(
        160 + seededFraction('interior-mote-x', index) * 640,
        170 + seededFraction('interior-mote-y', index) * 315,
        1.4 + (index % 3),
        0xffedbd,
        0.22,
      ).setDepth(17);
      this.tweens.add({
        targets: mote,
        y: '-=28',
        x: `+=${index % 2 === 0 ? 12 : -9}`,
        alpha: { from: 0.08, to: 0.42 },
        duration: 3200 + index * 280,
        delay: index * 170,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.InOut',
      });
    }
  }

  private drawInteriorContent(id: keyof typeof INTERIORS): void {
    if (id === 'reception') {
      const desk = this.drawFurniture(300, 230, 360, 86, 0x68412b, 'EMPFANG');
      this.physics.add.collider(this.player, desk);
      const props = this.add.graphics().setDepth(9);
      props.fillStyle(0xf4d47b, 1);
      props.fillRoundedRect(425, 210, 42, 27, 3);
      props.fillStyle(0x203a33, 1);
      props.fillRect(432, 216, 28, 15);
      props.fillStyle(0x8fd7c9, 0.9);
      props.fillRect(436, 219, 20, 8);
      props.fillStyle(0xf6f0d8, 1);
      props.fillRect(500, 205, 52, 34);
      props.lineStyle(2, 0x5c4532, 0.45);
      for (let line = 0; line < 4; line += 1) props.lineBetween(507, 213 + line * 6, 545, 213 + line * 6);
      this.addAction(480, 340, 'KLEMMBRETT', () => {
        this.showMessage(gameStore.snapshot().flags.gateOpen
          ? 'Dein Name steht tatsächlich auf der Liste. Gundula hat ihn sogar richtig geschrieben.'
          : 'Die Liste liegt hinter dem Tresen. Gundula steht draußen und bewacht sie persönlich.');
      });
      const keyBoard = this.drawFurniture(170, 410, 120, 70, 0x4c6754, 'SCHLÜSSEL');
      this.physics.add.collider(this.player, keyBoard);
      props.fillStyle(0xdcc674, 1);
      for (let row = 0; row < 3; row += 1) {
        for (let column = 0; column < 5; column += 1) {
          props.fillCircle(186 + column * 20, 426 + row * 16, 3);
          props.lineStyle(2, 0xdcc674, 0.9);
          props.lineBetween(186 + column * 20, 429 + row * 16, 186 + column * 20, 437 + row * 16);
        }
      }
      props.fillStyle(0x456d43, 1);
      props.fillRoundedRect(690, 395, 58, 44, 8);
      props.fillStyle(0x315936, 1);
      props.fillCircle(700, 387, 22);
      props.fillCircle(722, 378, 27);
      props.fillCircle(741, 395, 20);
      props.fillStyle(0xd8c18f, 1);
      props.fillRoundedRect(703, 432, 32, 26, 5);
      return;
    }

    if (id === 'sanitary') {
      for (let index = 0; index < 3; index += 1) {
        const stall = this.drawFurniture(195 + index * 195, 190, 150, 190, 0x57777c, `KABINE ${index + 1}`);
        this.physics.add.collider(this.player, stall);
      }
      const tileShine = this.add.graphics().setDepth(8);
      for (let index = 0; index < 3; index += 1) {
        const centerX = 270 + index * 195;
        tileShine.fillStyle(0xf2fbf9, 1);
        tileShine.fillRoundedRect(centerX - 29, 285, 58, 54, 10);
        tileShine.fillStyle(0xc4d8d8, 1);
        tileShine.fillEllipse(centerX, 335, 48, 13);
        tileShine.fillStyle(0x293c3e, 1);
        tileShine.fillCircle(centerX, 327, 5);
      }
      tileShine.fillStyle(0x9ad4d7, 0.65);
      tileShine.fillRoundedRect(148, 135, 110, 48, 5);
      tileShine.fillRoundedRect(702, 135, 110, 48, 5);
      tileShine.lineStyle(3, 0xeafcff, 0.72);
      tileShine.strokeRoundedRect(148, 135, 110, 48, 5);
      tileShine.strokeRoundedRect(702, 135, 110, 48, 5);
      tileShine.fillStyle(0x687f7c, 1);
      tileShine.fillCircle(480, 480, 12);
      tileShine.lineStyle(2, 0xdbe7e2, 0.6);
      tileShine.strokeCircle(480, 480, 8);
      tileShine.fillStyle(0xeafcff, 0.45);
      for (let x = 180; x <= 780; x += 70) tileShine.fillRoundedRect(x, 415, 44, 17, 8);
      this.addAction(480, 430, 'TOILETTE', () => {
        gameStore.relieve();
        this.showMessage('Erleichterung erreicht. Fünf Minuten und ein Problem weniger.');
      });
      return;
    }

    if (id === 'home-tent') {
      const bed = this.drawFurniture(205, 205, 310, 175, 0x567396, 'SCHLAFSACK');
      const crate = this.drawFurniture(590, 230, 130, 110, 0x6c4b2d, 'VORRÄTE');
      this.physics.add.collider(this.player, bed);
      this.physics.add.collider(this.player, crate);
      const tentProps = this.add.graphics().setDepth(9);
      tentProps.fillStyle(0xf4c75d, 0.9);
      tentProps.fillCircle(675, 206, 10);
      tentProps.fillStyle(0xffe7a4, 0.14);
      tentProps.fillCircle(675, 206, 38);
      tentProps.fillStyle(0xef685c, 0.9);
      tentProps.fillRoundedRect(540, 405, 82, 46, 9);
      tentProps.lineStyle(3, 0xffe49a, 0.72);
      tentProps.lineBetween(550, 416, 608, 442);
      tentProps.fillStyle(0x25384a, 0.9);
      tentProps.fillRoundedRect(230, 225, 260, 136, 22);
      tentProps.fillStyle(0x6b8fba, 1);
      for (let stripe = 242; stripe < 485; stripe += 31) {
        tentProps.fillRoundedRect(stripe, 230, 16, 126, 6);
      }
      tentProps.fillStyle(0xf1d29a, 0.9);
      tentProps.fillRoundedRect(235, 225, 100, 43, 14);
      tentProps.fillStyle(0x514333, 1);
      tentProps.fillRoundedRect(640, 365, 58, 72, 8);
      tentProps.fillStyle(0x7ca981, 1);
      tentProps.fillRoundedRect(647, 371, 44, 23, 5);
      tentProps.fillStyle(0xe8e2c7, 0.9);
      tentProps.fillCircle(652, 451, 8);
      tentProps.fillCircle(674, 451, 8);
      this.addAction(480, 430, 'PAUSE', () => {
        gameStore.rest(60);
        this.showMessage('Eine Stunde Zeltpause. Draußen wurde das Wochenende ohne dich schlechter organisiert.');
      });
      return;
    }

    const leftTable = this.drawFurniture(180, 205, 210, 110, 0x704425, 'FLIP CUP');
    const rightTable = this.drawFurniture(570, 205, 210, 110, 0x704425, 'BEER PONG');
    this.physics.add.collider(this.player, leftTable);
    this.physics.add.collider(this.player, rightTable);
    const party = this.add.graphics().setDepth(9);
    party.lineStyle(3, 0xffe49a, 0.38);
    party.lineBetween(150, 180, 810, 180);
    const colors = [0xf4c75d, 0x66dac6, 0xef685c];
    for (let index = 0; index < 14; index += 1) {
      party.fillStyle(colors[index % colors.length], 0.95);
      party.fillCircle(165 + index * 48, 181 + (index % 2) * 7, 5);
    }
    for (const x of [145, 815]) {
      party.fillStyle(0x10191d, 1);
      party.fillRoundedRect(x - 34, 250, 68, 152, 10);
      party.fillStyle(0x26383c, 1);
      party.fillCircle(x, 290, 23);
      party.fillCircle(x, 355, 28);
      party.lineStyle(3, 0x66dac6, 0.42);
      party.strokeCircle(x, 290, 23);
      party.strokeCircle(x, 355, 28);
    }
    party.fillStyle(0x4d5d62, 1);
    party.fillCircle(480, 170, 24);
    for (let facet = 0; facet < 8; facet += 1) {
      party.fillStyle(facet % 2 === 0 ? 0xa8ece1 : 0xf5d981, 0.74);
      party.fillTriangle(480, 170, 480 + Math.cos(facet * Math.PI / 4) * 22, 170 + Math.sin(facet * Math.PI / 4) * 22, 480 + Math.cos((facet + 1) * Math.PI / 4) * 22, 170 + Math.sin((facet + 1) * Math.PI / 4) * 22);
    }
    for (let cup = 0; cup < 12; cup += 1) {
      party.fillStyle(cup % 3 === 0 ? 0xf4c75d : 0xef685c, 0.92);
      party.fillRoundedRect(195 + cup * 50, 214 + (cup % 2) * 18, 11, 17, 3);
      party.fillStyle(0xffffff, 0.7);
      party.fillRect(196 + cup * 50, 217 + (cup % 2) * 18, 9, 3);
    }
    if (this.visualProfile.foliageMotion) {
      const discoGlow = this.add.circle(480, 170, 64, 0x66dac6, 0.08).setDepth(8);
      this.tweens.add({
        targets: discoGlow,
        scale: { from: 0.82, to: 1.18 },
        alpha: { from: 0.05, to: 0.18 },
        duration: 900,
        yoyo: true,
        repeat: -1,
      });
    }
    this.addAction(285, 365, 'FLIP CUP', () => this.startActivity('flip-cup'));
    this.addAction(675, 365, 'BEER PONG', () => this.startActivity('beer-pong'));
  }

  private drawFurniture(
    x: number,
    y: number,
    width: number,
    height: number,
    color: number,
    label: string,
  ): Phaser.GameObjects.Zone {
    const graphics = this.add.graphics().setDepth(7);
    graphics.fillStyle(0x000000, 0.24);
    graphics.fillEllipse(x + width / 2 + 7, y + height + 10, width * 0.94, 30);
    graphics.fillStyle(colorShade(color, 0.62), 1);
    graphics.fillRoundedRect(x + 7, y + 9, width, height, 13);
    graphics.fillStyle(color, 1);
    graphics.fillRoundedRect(x, y, width, height, 12);
    graphics.fillStyle(colorShade(color, 1.28), 0.16);
    graphics.fillRoundedRect(x + 5, y + 5, width - 10, Math.min(22, height * 0.2), 8);
    graphics.lineStyle(3, 0xffffff, 0.18);
    graphics.strokeRoundedRect(x, y, width, height, 12);
    graphics.lineStyle(2, colorShade(color, 0.48), 0.38);
    for (let detail = x + 18; detail < x + width - 8; detail += 34) {
      graphics.lineBetween(detail, y + 8, detail + 10, y + height - 8);
    }
    this.add.text(x + width / 2, y + height / 2, label, {
      fontFamily: 'Arial Black, system-ui, sans-serif',
      fontSize: '14px',
      fontStyle: 'bold',
      color: '#fff2c4',
      stroke: '#16231f',
      strokeThickness: 3,
    }).setOrigin(0.5).setDepth(10);
    return this.makeObstacle(x, y, width, height);
  }

  private makeObstacle(x: number, y: number, width: number, height: number): Phaser.GameObjects.Zone {
    const zone = this.add.zone(x + width / 2, y + height / 2, width, height);
    this.physics.add.existing(zone, true);
    return zone;
  }

  private addAction(x: number, y: number, label: string, action: () => void): void {
    this.add.image(x, y, 'activity-marker').setDepth(12);
    this.add.text(x, y + 29, label, {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '13px',
      fontStyle: 'bold',
      color: '#fff8dc',
      backgroundColor: '#173027cc',
      padding: { x: 6, y: 3 },
    }).setOrigin(0.5).setDepth(13);
    this.actions.push({ x, y, radius: 62, label, action });
  }

  private interact(): void {
    const nearest = this.actions
      .map((action) => ({
        action,
        distance: Phaser.Math.Distance.Between(this.player.x, this.player.y, action.x, action.y),
      }))
      .filter(({ action, distance }) => distance <= action.radius)
      .sort((a, b) => a.distance - b.distance)[0];
    if (!nearest) {
      this.showMessage('Nichts in Reichweite. Goldene Marker sind erstaunlich verlässlich.');
      return;
    }
    nearest.action.action();
  }

  private startActivity(scene: 'flip-cup' | 'beer-pong'): void {
    gameStore.setMode(scene);
    this.scene.start(scene);
  }

  private leave(): void {
    gameStore.leaveInterior();
    this.scene.start('world');
  }

  private showMessage(text: string): void {
    this.message.setText(text).setAlpha(1);
    this.tweens.killTweensOf(this.message);
    this.tweens.add({ targets: this.message, alpha: 0.82, duration: 2200, yoyo: true });
  }
}
