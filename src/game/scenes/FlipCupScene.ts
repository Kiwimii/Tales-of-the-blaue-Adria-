import Phaser from 'phaser';
import { minigameAttempts, minigameWindow } from '../mechanics';
import { gameStore } from '../state/GameStore';

export class FlipCupScene extends Phaser.Scene {
  private marker!: Phaser.GameObjects.Rectangle;
  private cup!: Phaser.GameObjects.Container;
  private message!: Phaser.GameObjects.Text;
  private scoreLabel!: Phaser.GameObjects.Text;
  private opponentBar!: Phaser.GameObjects.Rectangle;
  private phase: 'drink' | 'flip' | 'done' = 'drink';
  private direction = 1;
  private power = 0;
  private failedInputs = 0;
  private drinkWindow = 18;
  private flipWindow = 12;
  private maxFails = 3;
  private targetZone!: Phaser.GameObjects.Rectangle;
  private perfectZone!: Phaser.GameObjects.Rectangle;
  private playerCups = 0;
  private opponentCups = 0;
  private perfectFlips = 0;
  private opponentProgress = 0;
  private opponentInterval = 6500;

  constructor() {
    super('flip-cup');
  }

  create(): void {
    gameStore.setMode('flip-cup');
    const snapshot = gameStore.snapshot();
    this.drinkWindow = minigameWindow(snapshot, 'drink');
    this.flipWindow = minigameWindow(snapshot, 'flip');
    this.maxFails = minigameAttempts(snapshot);
    this.opponentInterval = Math.max(4200, 6500 + (this.flipWindow - 12) * 70);

    const bg = this.add.graphics();
    bg.fillGradientStyle(0x173d36, 0x173d36, 0x6a412c, 0x6a412c, 1);
    bg.fillRect(0, 0, 960, 640);
    bg.fillStyle(0x8c5c35, 1);
    bg.fillRoundedRect(90, 390, 780, 110, 18);
    bg.fillStyle(0x4f2f1e, 1);
    bg.fillRect(120, 490, 38, 120);
    bg.fillRect(802, 490, 38, 120);

    this.add.text(480, 42, 'FLIP CUP · BEST OF THREE', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '32px',
      fontStyle: 'bold',
      color: '#ffe6a7',
    }).setOrigin(0.5);

    this.scoreLabel = this.add.text(480, 86, '', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '18px',
      fontStyle: 'bold',
      color: '#f8f0dd',
    }).setOrigin(0.5);
    this.updateScore();

    this.message = this.add.text(480, 132, 'Leeren: Stoppe den Marker im goldenen Bereich.', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '18px',
      color: '#f8f0dd',
      align: 'center',
    }).setOrigin(0.5);

    this.drawTimingBar();
    this.drawOpponentRace();
    this.cup = this.makeCup(480, 355);

    this.input.on('pointerdown', () => this.handleInput());
    this.input.keyboard?.on('keydown-SPACE', () => this.handleInput());
    this.input.keyboard?.on('keydown-E', () => this.handleInput());
    this.add.text(480, 580, `Tippen oder Leertaste · ${this.maxFails} Fehlversuche erlaubt · Zustand und Beziehungen verändern das Fenster`, {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '14px',
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

    this.opponentProgress += (delta / this.opponentInterval) * 100;
    this.opponentBar.setScale(Math.min(1, this.opponentProgress / 100), 1);
    if (this.opponentProgress >= 100) {
      this.opponentProgress = 0;
      this.opponentCups += 1;
      this.updateScore();
      if (this.opponentCups >= 3) this.finish(false);
    }
  }

  private drawTimingBar(): void {
    this.add.rectangle(480, 215, 520, 32, 0x0e1715, 0.9);
    this.targetZone = this.add.rectangle(480, 215, 120, 28, 0xe4bd55, 0.95);
    this.perfectZone = this.add.rectangle(480, 215, 54, 28, 0x79d59d, 0.98);
    this.marker = this.add.rectangle(230, 215, 8, 44, 0xffffff, 1);
    this.updateTargetZone(this.drinkWindow);
  }

  private drawOpponentRace(): void {
    this.add.text(205, 270, 'Gegnerischer Becher', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '13px',
      color: '#d7ccb0',
    });
    this.add.rectangle(620, 279, 300, 15, 0x101714, 0.9);
    this.opponentBar = this.add.rectangle(470, 279, 300, 15, 0xe46d55, 1).setOrigin(0, 0.5);
    this.opponentBar.setScale(0, 1);
  }

  private makeCup(x: number, y: number): Phaser.GameObjects.Container {
    const body = this.add.graphics();
    body.fillStyle(0xd94d45, 1);
    body.fillRoundedRect(-30, -48, 60, 82, 8);
    body.fillStyle(0xffffff, 0.9);
    body.fillRect(-29, -35, 58, 8);
    body.fillStyle(0x7d2925, 1);
    body.fillEllipse(0, 34, 48, 12);
    return this.add.container(x, y, [body]);
  }

  private handleInput(): void {
    if (this.phase === 'done') return;
    const distance = Math.abs(this.power - 50);
    const window = this.phase === 'drink' ? this.drinkWindow : this.flipWindow;
    if (distance > window) {
      this.failedInputs += 1;
      this.message.setText(this.phase === 'drink'
        ? 'Daneben. Zu früh oder zu spät angesetzt.'
        : 'Der Becher fällt um. Der Tisch behauptet Unschuld.');
      this.shakeCup();
      if (this.failedInputs >= this.maxFails) this.finish(false);
      return;
    }

    if (this.phase === 'drink') {
      this.phase = 'flip';
      this.resetMarker(this.flipWindow);
      this.message.setText('Leer. Jetzt den Flip im grünen Kern landen.');
      this.tweens.add({ targets: this.cup, y: 340, duration: 160, yoyo: true });
      return;
    }

    const perfect = distance <= Math.max(3, this.flipWindow * 0.34);
    if (perfect) this.perfectFlips += 1;
    this.phase = 'done';
    this.tweens.add({
      targets: this.cup,
      angle: 360,
      y: 315,
      duration: 460,
      ease: 'Cubic.Out',
      onComplete: () => this.completeCup(perfect),
    });
  }

  private completeCup(perfect: boolean): void {
    this.playerCups += 1;
    this.updateScore();
    if (this.playerCups >= 3) {
      this.finish(true);
      return;
    }
    this.phase = 'drink';
    this.cup.setAngle(0).setY(355);
    this.resetMarker(this.drinkWindow);
    this.message.setText(`${perfect ? 'Perfekt.' : 'Sauber.'} Nächster Becher – der Gegner wartet nicht.`);
  }

  private finish(won: boolean): void {
    if (this.phase === 'done' && this.playerCups >= 3 && !won) return;
    this.phase = 'done';
    const score = Math.max(0, this.playerCups * 100 + this.perfectFlips * 25 - this.failedInputs * 12);
    const perfectRun = won && this.perfectFlips === 3 && this.failedInputs === 0;
    gameStore.recordActivity('flipCup', won, perfectRun ? 'perfect' : 'solid', score);
    this.message.setText(won
      ? `${perfectRun ? 'Makellose' : 'Gewonnene'} Serie: ${this.playerCups}: ${this.opponentCups}.`
      : `Verloren: ${this.playerCups}: ${this.opponentCups}. Die Becher führen keine Diskussion.`);
    const back = this.add.text(480, 530, 'Zurück zum Partyzelt', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '18px',
      fontStyle: 'bold',
      color: '#173027',
      backgroundColor: '#f1cf70',
      padding: { x: 18, y: 12 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    back.on('pointerdown', () => this.returnToTent());
  }

  private returnToTent(): void {
    gameStore.enterInterior('party-tent');
    this.scene.start('interior');
  }

  private resetMarker(halfWindow: number): void {
    this.power = 0;
    this.direction = 1;
    this.updateTargetZone(halfWindow);
  }

  private shakeCup(): void {
    this.tweens.add({ targets: this.cup, x: '+=12', duration: 60, yoyo: true, repeat: 3 });
  }

  private updateTargetZone(halfWindow: number): void {
    this.targetZone.setDisplaySize(halfWindow * 10, 28);
    this.perfectZone.setDisplaySize(Math.max(26, halfWindow * 4), 28);
  }

  private updateScore(): void {
    this.scoreLabel.setText(`DU ${this.playerCups}  ·  ${this.opponentCups} GEGNER  |  Perfekt ${this.perfectFlips}`);
  }
}
