import Phaser from 'phaser';
import { ACTION_EVENT, INPUT_EVENT, type InputEventDetail } from '../events';
import { gameStore } from '../state/GameStore';
import type { Direction } from '../types';
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
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private keys?: Record<string, Phaser.Input.Keyboard.Key>;
  private activeDirections = new Set<Direction>();
  private actions: InteriorAction[] = [];
  private message!: Phaser.GameObjects.Text;

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
    this.drawRoom(interior.floor, interior.wall);

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

    this.player = this.physics.add.sprite(480, 535, 'player');
    this.player.setCollideWorldBounds(true).setDepth(20);
    this.player.body?.setSize(20, 22).setOffset(6, 18);

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
  }

  update(): void {
    const speed = 150;
    let horizontal = 0;
    let vertical = 0;
    if (this.cursors?.left.isDown || this.keys?.A.isDown || this.activeDirections.has('left')) horizontal -= 1;
    if (this.cursors?.right.isDown || this.keys?.D.isDown || this.activeDirections.has('right')) horizontal += 1;
    if (this.cursors?.up.isDown || this.keys?.W.isDown || this.activeDirections.has('up')) vertical -= 1;
    if (this.cursors?.down.isDown || this.keys?.S.isDown || this.activeDirections.has('down')) vertical += 1;
    const vector = new Phaser.Math.Vector2(horizontal, vertical).normalize().scale(speed);
    this.player.setVelocity(vector.x, vector.y);
    if (horizontal) this.player.setFlipX(horizontal < 0);
  }

  private drawRoom(floor: number, wall: number): void {
    const graphics = this.add.graphics();
    graphics.fillStyle(0x000000, 0.34);
    graphics.fillRoundedRect(94, 103, 772, 474, 27);
    graphics.fillStyle(floor, 1);
    graphics.fillRoundedRect(110, 112, 740, 450, 20);
    graphics.lineStyle(24, wall, 1);
    graphics.strokeRoundedRect(110, 112, 740, 450, 20);
    graphics.lineStyle(3, 0xfff1c7, 0.09);
    for (let x = 144; x < 830; x += 52) graphics.lineBetween(x, 127, x, 530);
    for (let y = 145; y < 530; y += 48) graphics.lineBetween(124, y, 836, y);

    graphics.fillStyle(0x8bd8d2, 0.58);
    graphics.fillRoundedRect(155, 126, 112, 53, 8);
    graphics.fillRoundedRect(693, 126, 112, 53, 8);
    graphics.lineStyle(4, 0xdff8ed, 0.52);
    graphics.strokeRoundedRect(155, 126, 112, 53, 8);
    graphics.strokeRoundedRect(693, 126, 112, 53, 8);
    graphics.lineBetween(211, 128, 211, 177);
    graphics.lineBetween(749, 128, 749, 177);

    for (const x of [260, 480, 700]) {
      graphics.fillStyle(0xffd471, 0.12);
      graphics.fillCircle(x, 118, 34);
      graphics.fillStyle(0xffd471, 1);
      graphics.fillCircle(x, 118, 7);
    }

    graphics.fillStyle(0xe7c46d, 1);
    graphics.fillRect(420, 536, 120, 14);
    graphics.lineStyle(3, 0xfff0ae, 0.5);
    graphics.lineBetween(424, 541, 536, 541);
  }

  private drawInteriorContent(id: keyof typeof INTERIORS): void {
    if (id === 'reception') {
      const desk = this.drawFurniture(300, 230, 360, 86, 0x68412b, 'EMPFANG');
      this.physics.add.collider(this.player, desk);
      const props = this.add.graphics().setDepth(9);
      props.fillStyle(0xf4d47b, 1);
      props.fillRoundedRect(425, 210, 42, 27, 3);
      props.fillStyle(0xf6f0d8, 1);
      props.fillRect(500, 205, 52, 34);
      props.lineStyle(2, 0x5c4532, 0.45);
      for (let line = 0; line < 4; line += 1) props.lineBetween(507, 213 + line * 6, 545, 213 + line * 6);
      this.addAction(480, 340, 'KLEMMBRETT', () => {
        this.showMessage(gameStore.snapshot().flags.gateOpen
          ? 'Dein Name steht tatsächlich auf der Liste. Gundula hat ihn sogar richtig geschrieben.'
          : 'Die Liste liegt hinter dem Tresen. Gundula steht draußen und bewacht sie persönlich.');
      });
      this.drawFurniture(170, 410, 120, 70, 0x4c6754, 'SCHLÜSSEL');
      return;
    }

    if (id === 'sanitary') {
      for (let index = 0; index < 3; index += 1) {
        const stall = this.drawFurniture(195 + index * 195, 190, 150, 190, 0x57777c, `KABINE ${index + 1}`);
        this.physics.add.collider(this.player, stall);
      }
      const tileShine = this.add.graphics().setDepth(8);
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
      tentProps.fillStyle(0xef685c, 0.9);
      tentProps.fillRoundedRect(540, 405, 82, 46, 9);
      tentProps.lineStyle(3, 0xffe49a, 0.72);
      tentProps.lineBetween(550, 416, 608, 442);
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
    const graphics = this.add.graphics();
    graphics.fillStyle(0x000000, 0.24);
    graphics.fillEllipse(x + width / 2 + 7, y + height + 10, width * 0.94, 30);
    graphics.fillStyle(color, 1);
    graphics.fillRoundedRect(x, y, width, height, 12);
    graphics.fillStyle(0xffffff, 0.07);
    graphics.fillRoundedRect(x + 5, y + 5, width - 10, Math.min(22, height * 0.2), 8);
    graphics.lineStyle(3, 0xffffff, 0.18);
    graphics.strokeRoundedRect(x, y, width, height, 12);
    this.add.text(x + width / 2, y + height / 2, label, {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '14px',
      fontStyle: 'bold',
      color: '#fff2c4',
    }).setOrigin(0.5);
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
