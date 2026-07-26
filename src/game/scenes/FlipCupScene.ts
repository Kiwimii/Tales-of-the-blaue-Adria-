import Phaser from 'phaser';
import { minigameAttempts, minigameWindow } from '../mechanics';
import { gameStore } from '../state/GameStore';

export class FlipCupScene extends Phaser.Scene {
  private marker!: Phaser.GameObjects.Rectangle;
  private cup!: Phaser.GameObjects.Container;
  private message!: Phaser.GameObjects.Text;
  private phase: 'drink' | 'flip' | 'done' = 'drink';
  private direction = 1;
  private power = 0;
  private attempts = 0;
  private drinkWindow = 18;
  private flipWindow = 12;
  private maxAttempts = 3;
  private targetZone!: Phaser.GameObjects.Rectangle;
  private perfectZone!: Phaser.GameObjects.Rectangle;

  constructor() {
    super('flip-cup');
  }

  create(): void {
    gameStore.setMode('flip-cup');
    const snapshot = gameStore.snapshot();
    this.drinkWindow = minigameWindow(snapshot, 'drink');
    this.flipWindow = minigameWindow(snapshot, 'flip');
    this.maxAttempts = minigameAttempts(snapshot);
    this.cameras.main.setBackgroundColor('#152d2a');

    const bg = this.add.graphics();
    bg.fillGradientStyle(0x173d36, 0x173d36, 0x6a412c, 0x6a412c, 1);
    bg.fillRect(0, 0, 960, 640);
    bg.fillStyle(0x8c5c35, 1);
    bg.fillRoundedRect(90, 380, 780, 110, 18);
    bg.fillStyle(0x4f2f1e, 1);
    bg.fillRect(120, 480, 38, 130);
    bg.fillRect(802, 480, 38, 130);

    this.add.text(480, 54, 'FLIP CUP', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '38px',
      fontStyle: 'bold',
      color: '#ffe6a7',
    }).setOrigin(0.5);

    this.message = this.add.text(480, 120, 'Tippe, wenn der Marker im goldenen Bereich ist.', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '19px',
      color: '#f8f0dd',
      align: 'center',
    }).setOrigin(0.5);

    this.drawTimingBar();
    this.cup = this.makeCup(480, 340);

    this.input.on('pointerdown', () => this.handleInput());
    this.input.keyboard?.on('keydown-SPACE', () => this.handleInput());
    this.input.keyboard?.on('keydown-E', () => this.handleInput());

    this.add.text(480, 574, `Tippen oder Leertaste · ${this.maxAttempts} Versuche · Zustand und Team verändern das Timingfenster`, {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '15px',
      color: '#d7ccb0',
    }).setOrigin(0.5);
  }

  update(_: number, delta: number): void {
    if (this.phase === 'done') return;

    const speed = this.phase === 'drink' ? 0.22 : 0.17;
    this.power += delta * speed * this.direction;
    if (this.power >= 100) {
      this.power = 100;
      this.direction = -1;
    }
    if (this.power <= 0) {
      this.power = 0;
      this.direction = 1;
    }
    this.marker.x = 230 + this.power * 5;
  }

  private drawTimingBar(): void {
    this.add.rectangle(480, 205, 520, 32, 0x0e1715, 0.9);
    this.targetZone = this.add.rectangle(480, 205, 120, 28, 0xe4bd55, 0.95);
    this.perfectZone = this.add.rectangle(480, 205, 54, 28, 0x79d59d, 0.98);
    this.marker = this.add.rectangle(230, 205, 8, 44, 0xffffff, 1);
    this.updateTargetZone(this.drinkWindow);
  }

  private makeCup(x: number, y: number): Phaser.GameObjects.Container {
    const cupBody = this.add.graphics();
    cupBody.fillStyle(0xd94d45, 1);
    cupBody.fillRoundedRect(-30, -48, 60, 82, 8);
    cupBody.fillStyle(0xffffff, 0.9);
    cupBody.fillRect(-29, -35, 58, 8);
    cupBody.fillStyle(0x7d2925, 1);
    cupBody.fillEllipse(0, 34, 48, 12);
    return this.add.container(x, y, [cupBody]);
  }

  private handleInput(): void {
    if (this.phase === 'done') return;
    const distance = Math.abs(this.power - 50);

    if (this.phase === 'drink') {
      if (distance <= this.drinkWindow) {
        this.phase = 'flip';
        this.power = 0;
        this.direction = 1;
        this.updateTargetZone(this.flipWindow);
        this.message.setText('Gut geleert. Jetzt Kraft aufbauen und im richtigen Moment flippen.');
        this.tweens.add({ targets: this.cup, y: 326, duration: 180, yoyo: true });
      } else {
        this.attempts += 1;
        this.message.setText('Zu früh oder zu spät. Noch einmal ansetzen.');
        this.shakeCup();
        this.checkFailure();
      }
      return;
    }

    this.attempts += 1;
    if (distance <= this.flipWindow) {
      this.phase = 'done';
      this.tweens.add({
        targets: this.cup,
        angle: 360,
        y: 300,
        duration: 550,
        ease: 'Cubic.Out',
        onComplete: () => this.finish(true, distance <= Math.max(3, this.flipWindow * 0.35)),
      });
    } else {
      this.message.setText('Der Becher landet auf der Seite. Noch ein Versuch.');
      this.tweens.add({ targets: this.cup, angle: 110, x: 535, duration: 280, yoyo: true, onComplete: () => this.cup.setAngle(0) });
      this.checkFailure();
    }
  }

  private checkFailure(): void {
    if (this.attempts < this.maxAttempts) return;
    this.phase = 'done';
    this.finish(false);
  }

  private finish(won: boolean, perfect = false): void {
    gameStore.recordActivity('flipCup', won, perfect ? 'perfect' : 'solid');
    this.message.setText(won
      ? `${perfect ? 'Perfekter' : 'Sauberer'} Flip. Ruf, Würde und Momentum reagieren auf die Qualität.`
      : `${this.maxAttempts} Versuche sind vorbei. Das Südlager applaudiert trotzdem aus Höflichkeit.`);

    const back = this.add.text(480, 520, 'Zurück zum Campingplatz', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '18px',
      fontStyle: 'bold',
      color: '#173027',
      backgroundColor: '#f1cf70',
      padding: { x: 18, y: 12 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    back.on('pointerdown', () => {
      gameStore.setMode('world');
      this.scene.start('world');
    });
  }

  private shakeCup(): void {
    this.tweens.add({ targets: this.cup, x: '+=12', duration: 60, yoyo: true, repeat: 3 });
  }

  private updateTargetZone(halfWindow: number): void {
    this.targetZone.setSize(halfWindow * 10, 28);
    this.targetZone.setDisplaySize(halfWindow * 10, 28);
    const perfect = Math.max(26, halfWindow * 4);
    this.perfectZone.setSize(perfect, 28);
    this.perfectZone.setDisplaySize(perfect, 28);
  }
}
