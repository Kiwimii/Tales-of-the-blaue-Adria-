import Phaser from 'phaser';
import { ACTION_EVENT, INPUT_EVENT, type InputEventDetail } from '../events';
import { gameStore } from '../state/GameStore';
import type { Direction } from '../types';

interface InteractionPoint {
  id: string;
  x: number;
  y: number;
  radius: number;
  action: () => void;
}

export class WorldScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private keys?: Record<string, Phaser.Input.Keyboard.Key>;
  private activeDirections = new Set<Direction>();
  private interactionPoints: InteractionPoint[] = [];
  private message!: Phaser.GameObjects.Text;
  private nightOverlay!: Phaser.GameObjects.Rectangle;
  private lastNeedTick = 0;

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
    this.physics.world.setBounds(0, 0, 960, 640);
    this.cameras.main.setBounds(0, 0, 960, 640);
    this.drawWorld();

    const start = gameStore.snapshot().worldPosition;
    this.player = this.physics.add.sprite(start.x, start.y, 'player');
    this.player.setCollideWorldBounds(true);
    this.player.setDepth(20);

    this.cameras.main.startFollow(this.player, true, 0.12, 0.12);
    this.cameras.main.setZoom(1.08);

    this.cursors = this.input.keyboard?.createCursorKeys();
    this.keys = this.input.keyboard?.addKeys('W,A,S,D,E,SPACE') as Record<string, Phaser.Input.Keyboard.Key>;

    this.keys?.E.on('down', () => this.interact());
    this.keys?.SPACE.on('down', () => this.interact());

    window.addEventListener(INPUT_EVENT, this.onMobileInput);
    window.addEventListener(ACTION_EVENT, this.onAction);

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      window.removeEventListener(INPUT_EVENT, this.onMobileInput);
      window.removeEventListener(ACTION_EVENT, this.onAction);
    });

    this.message = this.add
      .text(480, 596, 'Erkunde den Parkplatz und sprich mit Gundula und Uli.', {
        fontFamily: 'system-ui, sans-serif',
        fontSize: '17px',
        color: '#f5f1df',
        backgroundColor: '#14241fe6',
        padding: { x: 16, y: 10 },
        align: 'center',
        wordWrap: { width: 700 },
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(100);

    this.nightOverlay = this.add
      .rectangle(480, 320, 960, 640, 0x10254a, 0)
      .setScrollFactor(0)
      .setDepth(80)
      .setBlendMode(Phaser.BlendModes.MULTIPLY);

    this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => this.updateLighting(),
    });
    this.updateLighting();
  }

  update(time: number): void {
    const speed = 155;
    let horizontal = 0;
    let vertical = 0;

    if (this.cursors?.left.isDown || this.keys?.A.isDown || this.activeDirections.has('left')) horizontal -= 1;
    if (this.cursors?.right.isDown || this.keys?.D.isDown || this.activeDirections.has('right')) horizontal += 1;
    if (this.cursors?.up.isDown || this.keys?.W.isDown || this.activeDirections.has('up')) vertical -= 1;
    if (this.cursors?.down.isDown || this.keys?.S.isDown || this.activeDirections.has('down')) vertical += 1;

    const vector = new Phaser.Math.Vector2(horizontal, vertical).normalize().scale(speed);
    this.player.setVelocity(vector.x, vector.y);

    if (horizontal !== 0 || vertical !== 0) {
      this.player.setFlipX(horizontal < 0);
      gameStore.setWorldPosition(this.player.x, this.player.y);
    }

    if (time - this.lastNeedTick > 12000) {
      this.lastNeedTick = time;
      gameStore.advanceMinutes(5);
    }
  }

  private drawWorld(): void {
    const g = this.add.graphics();
    g.fillStyle(0x88b56b, 1);
    g.fillRect(0, 0, 960, 640);

    g.fillStyle(0xd5bd87, 1);
    g.fillRoundedRect(32, 270, 330, 180, 24);
    g.fillStyle(0x8f9692, 1);
    for (let i = 0; i < 5; i += 1) g.fillRoundedRect(58 + i * 58, 300, 46, 92, 8);
    this.add.text(54, 278, 'PARKPLATZ', this.labelStyle()).setDepth(2);

    g.fillStyle(0xe4dfcf, 1);
    g.fillRoundedRect(396, 220, 170, 146, 18);
    g.fillStyle(0x547b86, 1);
    g.fillRect(416, 245, 55, 88);
    g.fillRect(490, 245, 55, 88);
    this.add.text(424, 228, 'TOILETTEN', this.labelStyle()).setDepth(2);

    g.fillStyle(0xc7835d, 1);
    g.fillRoundedRect(626, 236, 210, 150, 22);
    g.fillStyle(0xf3ddb1, 1);
    g.fillRect(652, 272, 155, 92);
    this.add.text(645, 245, 'GUNDULA & ULI', this.labelStyle()).setDepth(2);

    g.fillStyle(0x779b62, 1);
    g.fillRoundedRect(300, 34, 380, 142, 24);
    g.fillStyle(0xe9a759, 1);
    for (let i = 0; i < 4; i += 1) {
      const x = 340 + i * 82;
      g.fillTriangle(x, 142, x + 34, 76, x + 68, 142);
    }
    this.add.text(410, 48, 'NÖRDLICHES LAGER', this.labelStyle()).setDepth(2);

    g.fillStyle(0x6d9259, 1);
    g.fillRoundedRect(270, 420, 420, 136, 24);
    g.fillStyle(0x7d67b5, 1);
    for (let i = 0; i < 4; i += 1) {
      const x = 310 + i * 90;
      g.fillTriangle(x, 530, x + 38, 460, x + 76, 530);
    }
    this.add.text(396, 432, 'SÜDLICHES LAGER', this.labelStyle()).setDepth(2);

    g.fillStyle(0xe6d7a4, 1);
    g.fillRect(700, 440, 260, 58);
    g.fillStyle(0x4e94b4, 1);
    g.fillRect(700, 498, 260, 142);
    g.fillStyle(0x8ec4d4, 0.65);
    for (let y = 520; y < 630; y += 24) g.fillRect(715, y, 215, 5);
    this.add.text(776, 454, 'STRAND & SEE', this.labelStyle()).setDepth(2);

    g.lineStyle(18, 0xcbb889, 1);
    g.beginPath();
    g.moveTo(350, 356);
    g.lineTo(420, 356);
    g.lineTo(480, 390);
    g.lineTo(650, 390);
    g.strokePath();

    const gundula = this.physics.add.staticSprite(682, 404, 'gundula').setDepth(15);
    const uli = this.physics.add.staticSprite(742, 404, 'uli').setDepth(15);
    this.add.text(gundula.x, gundula.y - 36, 'Gundula', this.npcStyle()).setOrigin(0.5).setDepth(16);
    this.add.text(uli.x, uli.y - 36, 'Uli', this.npcStyle()).setOrigin(0.5).setDepth(16);

    this.addActivity(220, 238, 'KAMPF', () => {
      gameStore.setWorldPosition(this.player.x, this.player.y);
      this.scene.start('battle');
    });
    this.addActivity(568, 492, 'FLIP CUP', () => {
      gameStore.setWorldPosition(this.player.x, this.player.y);
      this.scene.start('flip-cup');
    });

    this.interactionPoints.push(
      {
        id: 'gundula',
        x: gundula.x,
        y: gundula.y,
        radius: 72,
        action: () => this.talkToGundula(),
      },
      {
        id: 'uli',
        x: uli.x,
        y: uli.y,
        radius: 72,
        action: () => this.talkToUli(),
      },
    );
  }

  private addActivity(x: number, y: number, label: string, action: () => void): void {
    this.add.image(x, y, 'activity-marker').setDepth(12);
    this.add.text(x, y + 27, label, this.npcStyle()).setOrigin(0.5).setDepth(13);
    this.interactionPoints.push({ id: label, x, y, radius: 60, action });
  }

  private interact(): void {
    const nearest = this.interactionPoints
      .map((point) => ({ point, distance: Phaser.Math.Distance.Between(this.player.x, this.player.y, point.x, point.y) }))
      .filter(({ point, distance }) => distance <= point.radius)
      .sort((a, b) => a.distance - b.distance)[0];

    if (!nearest) {
      this.showMessage('Hier gibt es gerade nichts zu tun. Gelbe Marker und Personen sind interaktiv.');
      return;
    }

    nearest.point.action();
  }

  private talkToGundula(): void {
    const state = gameStore.snapshot();
    if (state.flags.gundulaConvinced) {
      this.showMessage('Gundula: „Ich behalte dich trotzdem im Auge.“');
      return;
    }

    if ((state.inventory.batida ?? 0) > 0) {
      gameStore.setFlag('gundulaConvinced');
      this.showMessage('Du erwähnst die Batida de Coco. Gundula ist plötzlich deutlich gesprächsbereiter. Einlasschance erhöht.');
      return;
    }

    this.showMessage('Gundula: „Wer bist du und warum glaubst du, hier einfach reinzukommen?“ Eine passende Dialogquest folgt im nächsten Sprint.');
  }

  private talkToUli(): void {
    const state = gameStore.snapshot();
    if (state.flags.uliConvinced) {
      this.showMessage('Uli: „Parken kannst du inzwischen. Das ist schon mehr als bei vielen anderen.“');
      return;
    }

    gameStore.setFlag('uliConvinced');
    this.showMessage('Uli prüft deine Geschichte und gibt dir eine erste Parkplatzaufgabe. Einlasschance erhöht.');
  }

  private showMessage(text: string): void {
    this.message.setText(text);
    this.tweens.killTweensOf(this.message);
    this.message.setAlpha(1);
    this.tweens.add({ targets: this.message, alpha: 0.86, duration: 2600, yoyo: true });
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

  private labelStyle(): Phaser.Types.GameObjects.Text.TextStyle {
    return { fontFamily: 'system-ui, sans-serif', fontSize: '18px', fontStyle: 'bold', color: '#173027' };
  }

  private npcStyle(): Phaser.Types.GameObjects.Text.TextStyle {
    return {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '14px',
      fontStyle: 'bold',
      color: '#fff8dc',
      backgroundColor: '#173027cc',
      padding: { x: 6, y: 3 },
    };
  }
}
