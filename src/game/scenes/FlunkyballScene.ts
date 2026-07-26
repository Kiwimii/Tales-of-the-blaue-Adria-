import Phaser from 'phaser';
import { conditionModifier, minigameWindow, totalTeamBonus } from '../mechanics';
import { gameStore } from '../state/GameStore';
import { addCinematicFrame } from '../visuals';

type FlunkyStage = 'throw' | 'sprint' | 'drink' | 'done';

export class FlunkyballScene extends Phaser.Scene {
  private stage: FlunkyStage = 'throw';
  private marker!: Phaser.GameObjects.Rectangle;
  private target!: Phaser.GameObjects.Rectangle;
  private message!: Phaser.GameObjects.Text;
  private progressLabel!: Phaser.GameObjects.Text;
  private power = 0;
  private direction = 1;
  private sprintTaps = 0;
  private sprintNeeded = 9;
  private sprintRemaining = 4200;
  private throwWindow = 15;
  private drinkWindow = 18;
  private quality = 0;

  constructor() {
    super('flunkyball');
  }

  create(): void {
    gameStore.setMode('flunkyball');
    const state = gameStore.snapshot();
    this.throwWindow = Phaser.Math.Clamp(
      Math.round(14 + conditionModifier(state.needs, 'focus') * 0.24 + totalTeamBonus(state.team, 'games') * 0.35),
      7,
      25,
    );
    this.drinkWindow = minigameWindow(state, 'drink');
    this.sprintNeeded = Phaser.Math.Clamp(
      10 - Math.floor(totalTeamBonus(state.team, 'games') / 4) + (state.needs.energy < 35 ? 2 : 0),
      6,
      12,
    );

    const graphics = this.add.graphics();
    graphics.fillGradientStyle(0x214d62, 0x4b7f80, 0xd18f62, 0xf0bd72, 1);
    graphics.fillRect(0, 0, 960, 640);
    graphics.fillStyle(0xffd77c, 0.35);
    graphics.fillCircle(760, 120, 74);
    graphics.fillStyle(0xffe6a5, 0.86);
    graphics.fillCircle(760, 120, 45);
    this.drawBeachBackdrop(graphics);
    graphics.fillGradientStyle(0xe9d09a, 0xdac18c, 0xcaa875, 0xd8b980, 1);
    graphics.fillRect(0, 400, 960, 240);
    graphics.fillGradientStyle(0x56aeca, 0x4c9fbe, 0x2d789d, 0x397f9f, 1);
    graphics.fillRect(0, 530, 960, 110);
    graphics.lineStyle(3, 0xbfeaf0, 0.5);
    for (let y = 548; y < 625; y += 22) graphics.lineBetween(20, y, 940, y - 7);
    graphics.fillStyle(0x2d241d, 0.24);
    graphics.fillEllipse(480, 430, 94, 28);
    graphics.fillGradientStyle(0xe5d594, 0xd4c073, 0xa98c55, 0xbda264, 1);
    graphics.fillRoundedRect(455, 325, 50, 105, 10);
    graphics.fillStyle(0xeae4cd, 1);
    graphics.fillRect(462, 304, 36, 30);
    graphics.fillStyle(0xef685c, 0.82);
    graphics.fillRect(461, 361, 38, 13);
    graphics.lineStyle(3, 0xffffff, 0.55);
    graphics.strokeRoundedRect(455, 325, 50, 105, 10);

    this.add.text(480, 24, 'STRANDMEISTERSCHAFT · BLAUE ADRIA', {
      fontFamily: 'Arial, system-ui, sans-serif',
      fontSize: '11px',
      fontStyle: 'bold',
      letterSpacing: 3,
      color: '#173e48',
    }).setOrigin(0.5);
    this.add.text(480, 53, 'FLUNKYBALL', {
      fontFamily: 'Arial Black, system-ui, sans-serif',
      fontSize: '34px',
      fontStyle: 'bold',
      color: '#fff0bd',
      stroke: '#214452',
      strokeThickness: 5,
    }).setOrigin(0.5);
    this.message = this.add.text(480, 100, '1/3 WURF · Stoppe den Marker im Zielbereich.', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '18px',
      color: '#f8f0dd',
      backgroundColor: '#173027cc',
      padding: { x: 15, y: 9 },
    }).setOrigin(0.5);

    this.add.rectangle(480, 190, 536, 50, 0x07151c, 0.28)
      .setStrokeStyle(2, 0xfff0bd, 0.3);
    this.add.rectangle(480, 190, 520, 34, 0x101714, 0.92);
    this.target = this.add.rectangle(480, 190, this.throwWindow * 10, 30, 0xe4bd55, 1);
    this.marker = this.add.rectangle(230, 190, 8, 46, 0xffffff, 1);
    this.progressLabel = this.add.text(480, 250, '', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '20px',
      fontStyle: 'bold',
      color: '#fff4cb',
    }).setOrigin(0.5);
    this.updateProgress();

    this.input.on('pointerdown', () => this.handleInput());
    this.input.keyboard?.on('keydown-SPACE', () => this.handleInput());
    this.input.keyboard?.on('keydown-E', () => this.handleInput());
    this.add.text(480, 588, 'Tippen oder Leertaste · Wurf → Sprint → Trinken', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '15px',
      color: '#20342e',
      backgroundColor: '#fff0c8b8',
      padding: { x: 13, y: 7 },
    }).setOrigin(0.5);
    addCinematicFrame(this, 0x56aeca);
  }

  private drawBeachBackdrop(graphics: Phaser.GameObjects.Graphics): void {
    graphics.fillStyle(0x173d35, 0.72);
    for (const x of [35, 120, 850, 925]) {
      graphics.fillRect(x - 7, 225, 14, 190);
      graphics.fillCircle(x, 205, 68);
      graphics.fillStyle(0x2c6248, 0.88);
      graphics.fillCircle(x - 30, 230, 48);
      graphics.fillCircle(x + 34, 232, 46);
      graphics.fillStyle(0x173d35, 0.72);
    }
    graphics.fillStyle(0x36594a, 0.6);
    for (let index = 0; index < 8; index += 1) {
      const x = 70 + index * 120;
      graphics.fillCircle(x, 381, 15 + (index % 3) * 4);
    }
    graphics.lineStyle(4, 0xfff0bd, 0.22);
    graphics.lineBetween(180, 350, 780, 350);
    for (let x = 210; x < 780; x += 76) {
      const color = x % 3 === 0 ? 0xef685c : x % 2 === 0 ? 0xf4c75d : 0x66dac6;
      graphics.fillStyle(color, 0.9);
      graphics.fillTriangle(x, 350, x + 45, 350, x + 22, 377);
    }
  }

  update(_: number, delta: number): void {
    if (this.stage === 'done') return;
    if (this.stage === 'sprint') {
      this.sprintRemaining -= delta;
      this.updateProgress();
      if (this.sprintRemaining <= 0) this.finish(false, 'Die Zeit ist um. Deine Beine melden ein Organisationsproblem.');
      return;
    }
    const speed = this.stage === 'throw' ? 0.2 : 0.245;
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

  private handleInput(): void {
    if (this.stage === 'done') return;
    if (this.stage === 'sprint') {
      this.sprintTaps += 1;
      this.cameras.main.shake(45, 0.0015);
      this.updateProgress();
      if (this.sprintTaps >= this.sprintNeeded) this.startDrink();
      return;
    }

    const distance = Math.abs(this.power - 50);
    const window = this.stage === 'throw' ? this.throwWindow : this.drinkWindow;
    if (distance > window) {
      this.finish(false, this.stage === 'throw'
        ? 'Die Flasche bleibt stehen. Der Wurf war mehr Meinung als Richtung.'
        : 'Zu früh abgesetzt. Der Schiedsrichter kennt erschreckend genaue Regeln.');
      return;
    }

    this.quality += Math.max(0, Math.round(100 - distance * 3));
    if (this.stage === 'throw') this.startSprint();
    else this.finish(true, distance <= Math.max(3, this.drinkWindow * 0.3)
      ? 'Perfekter Abschluss. Sogar Masl fehlen kurzfristig Zusatzregeln.'
      : 'Flasche leer, Staffel gewonnen, Restwürde noch messbar.');
  }

  private startSprint(): void {
    this.stage = 'sprint';
    this.marker.setVisible(false);
    this.target.setDisplaySize(500, 30).setFillStyle(0x4c3124, 0.8);
    this.message.setText('2/3 SPRINT · Tippe schnell genug bis zur Flasche und zurück.');
    this.updateProgress();
  }

  private startDrink(): void {
    this.stage = 'drink';
    this.quality += Math.max(0, Math.round(this.sprintRemaining / 45));
    this.power = 0;
    this.direction = 1;
    this.marker.setVisible(true);
    this.target.setDisplaySize(this.drinkWindow * 10, 30).setFillStyle(0x79d59d, 1);
    this.message.setText('3/3 TRINKEN · Stoppe im grünen Bereich. Nicht diskutieren.');
    this.updateProgress();
  }

  private finish(won: boolean, text: string): void {
    this.stage = 'done';
    this.message.setText(text);
    const score = won ? this.quality + 120 : this.quality;
    const perfect = won && score >= 315;
    gameStore.recordActivity('flunkyball', won, perfect ? 'perfect' : 'solid', score);
    this.updateProgress();
    const back = this.add.text(480, 540, 'Zurück zum Strand', {
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

  private updateProgress(): void {
    if (this.stage === 'throw') {
      this.progressLabel.setText(`Wurffenster ${this.throwWindow} · Phase 1 von 3`);
    } else if (this.stage === 'sprint') {
      this.progressLabel.setText(`Sprint ${this.sprintTaps}/${this.sprintNeeded} · ${(Math.max(0, this.sprintRemaining) / 1000).toFixed(1)} s`);
    } else if (this.stage === 'drink') {
      this.progressLabel.setText(`Trinkfenster ${this.drinkWindow} · Phase 3 von 3`);
    } else {
      this.progressLabel.setText(`Staffelwert ${this.quality}`);
    }
  }
}
