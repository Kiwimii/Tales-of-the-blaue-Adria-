import Phaser from 'phaser';
import { beerPongReticlePosition, conditionModifier, totalTeamBonus } from '../mechanics';
import { gameStore } from '../state/GameStore';

export class BeerPongScene extends Phaser.Scene {
  private reticle!: Phaser.GameObjects.Container;
  private targetAura!: Phaser.GameObjects.Arc;
  private message!: Phaser.GameObjects.Text;
  private scoreLabel!: Phaser.GameObjects.Text;
  private cups: Phaser.GameObjects.Arc[] = [];
  private targetIndex = 0;
  private sweep = 0;
  private direction = 1;
  private shots = 0;
  private hits = 0;
  private perfects = 0;
  private maxShots = 6;
  private tolerance = 42;
  private finished = false;
  private throwing = false;

  constructor() {
    super('beer-pong');
  }

  create(): void {
    gameStore.setMode('beer-pong');
    const state = gameStore.snapshot();
    const focus = conditionModifier(state.needs, 'focus');
    const support = totalTeamBonus(state.team, 'games');
    this.tolerance = Phaser.Math.Clamp(Math.round(38 + focus * 0.35 + Math.min(9, support)), 26, 56);
    this.maxShots = state.profile?.trait === 'beobachtend' ? 7 : 6;

    const graphics = this.add.graphics();
    graphics.fillGradientStyle(0x071522, 0x102d35, 0x411d28, 0x702f2a, 1);
    graphics.fillRect(0, 0, 960, 640);
    this.drawAtmosphere(graphics);
    this.drawTable(graphics);

    this.add.text(480, 27, 'NACHTPROGRAMM · PARTY-ZELT', {
      fontFamily: 'Arial, system-ui, sans-serif',
      fontSize: '12px',
      fontStyle: 'bold',
      letterSpacing: 3,
      color: '#73dfcc',
    }).setOrigin(0.5);
    this.add.text(480, 55, 'BEER PONG', {
      fontFamily: 'Arial Black, system-ui, sans-serif',
      fontSize: '34px',
      fontStyle: 'bold',
      color: '#fff1c1',
      stroke: '#48171d',
      strokeThickness: 5,
    }).setOrigin(0.5);
    this.message = this.add.text(480, 101, 'Stoppe das Fadenkreuz über dem goldenen Zielbecher.', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '17px',
      color: '#f8f0dd',
      backgroundColor: '#06131dcc',
      padding: { x: 16, y: 8 },
    }).setOrigin(0.5);
    this.scoreLabel = this.add.text(480, 555, '', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '16px',
      fontStyle: 'bold',
      color: '#fff4d0',
      backgroundColor: '#07151fe8',
      padding: { x: 18, y: 9 },
    }).setOrigin(0.5);

    const cupPositions = [
      [480, 235],
      [420, 305],
      [540, 305],
      [360, 375],
      [480, 375],
      [600, 375],
    ];
    this.cups = cupPositions.map(([x, y], index) => {
      this.add.ellipse(x + 5, y + 12, 66, 30, 0x12090b, 0.35);
      const cup = this.add.circle(x, y, 28, index === 0 ? 0xf6c95f : 0xd94b5b, 1);
      cup.setStrokeStyle(5, 0xfff3df, 0.9);
      this.add.circle(x, y, 19, 0x681b2c, 1).setStrokeStyle(2, 0xff9d82, 0.4);
      this.add.circle(x - 7, y - 8, 5, 0xffffff, 0.22);
      return cup;
    });

    this.targetAura = this.add.circle(480, 235, 40, 0xf6c95f, 0.08)
      .setStrokeStyle(3, 0xffdf7a, 0.7)
      .setDepth(4);
    this.tweens.add({
      targets: this.targetAura,
      scale: { from: 0.86, to: 1.16 },
      alpha: { from: 0.85, to: 0.3 },
      duration: 720,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.InOut',
    });

    const cross = this.add.graphics();
    cross.fillStyle(0x68ffe1, 0.11);
    cross.fillCircle(0, 0, 34);
    cross.lineStyle(7, 0x06151c, 0.75);
    cross.strokeCircle(0, 0, 24);
    cross.lineStyle(3, 0x78ffe7, 1);
    cross.strokeCircle(0, 0, 24);
    cross.lineBetween(-35, 0, -10, 0);
    cross.lineBetween(10, 0, 35, 0);
    cross.lineBetween(0, -35, 0, -10);
    cross.lineBetween(0, 10, 0, 35);
    cross.fillStyle(0xffffff, 1);
    cross.fillCircle(0, 0, 3);
    this.reticle = this.add.container(255, 235, [cross]).setDepth(20);

    this.input.on('pointerdown', () => this.throwBall());
    this.input.keyboard?.on('keydown-SPACE', () => this.throwBall());
    this.input.keyboard?.on('keydown-E', () => this.throwBall());
    this.add.text(480, 603, 'TIPPEN / LEERTASTE · Jeder aktive Becher liegt garantiert auf der Zielbahn', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '13px',
      color: '#b9d8d4',
    }).setOrigin(0.5);
    this.updateScore();
  }

  update(_: number, delta: number): void {
    if (this.finished || this.throwing) return;
    this.sweep += delta * 0.00034 * this.direction;
    if (this.sweep >= 1) {
      this.sweep = 1;
      this.direction = -1;
    }
    if (this.sweep <= 0) {
      this.sweep = 0;
      this.direction = 1;
    }
    const target = this.cups[this.targetIndex];
    if (!target) return;
    const position = beerPongReticlePosition(
      this.sweep,
      { x: target.x, y: target.y },
      gameStore.snapshot().needs.alcohol,
    );
    this.reticle.setPosition(position.x, position.y);
  }

  private throwBall(): void {
    if (this.finished || this.throwing) return;
    this.throwing = true;
    const aim = { x: this.reticle.x, y: this.reticle.y };
    const ball = this.add.circle(480, 522, 9, 0xf8f2dc, 1)
      .setStrokeStyle(3, 0xd6c69f, 1)
      .setDepth(30);
    this.tweens.add({
      targets: ball,
      x: aim.x,
      y: aim.y,
      scale: { from: 1.15, to: 0.72 },
      duration: 260,
      ease: 'Quad.Out',
      onComplete: () => {
        ball.destroy();
        this.resolveThrow(aim.x, aim.y);
        this.throwing = false;
      },
    });
  }

  private resolveThrow(x: number, y: number): void {
    this.shots += 1;
    const target = this.cups[this.targetIndex];
    const distance = Phaser.Math.Distance.Between(x, y, target.x, target.y);
    const hit = distance <= this.tolerance;
    if (hit) {
      this.hits += 1;
      if (distance <= Math.max(12, this.tolerance * 0.34)) this.perfects += 1;
      target.setFillStyle(0x4e3126, 0.38).setStrokeStyle(3, 0xe9c47a, 0.3);
      this.tweens.add({
        targets: target,
        scale: { from: 1.3, to: 1 },
        duration: 230,
        ease: 'Back.Out',
      });
      this.targetIndex += 1;
      this.message.setText(distance <= Math.max(12, this.tolerance * 0.34)
        ? 'Sauber mittig. Verdächtig kompetent.'
        : 'Drin. Physik und Restalkohol einigen sich.');
      if (this.targetIndex < this.cups.length) {
        const next = this.cups[this.targetIndex];
        next.setFillStyle(0xf6c95f, 1);
        this.targetAura.setPosition(next.x, next.y);
      }
    } else {
      this.message.setText('Daneben. Der Tisch war vermutlich schief.');
      this.cameras.main.shake(100, 0.004);
    }
    this.updateScore();
    if (this.hits >= 3 || this.shots >= this.maxShots) this.finish(this.hits >= 3);
  }

  private drawAtmosphere(graphics: Phaser.GameObjects.Graphics): void {
    graphics.fillStyle(0x05090d, 0.44);
    graphics.fillRect(0, 455, 960, 185);
    for (let index = 0; index < 13; index += 1) {
      const x = 34 + index * 76;
      const color = index % 3 === 0 ? 0xffc760 : index % 3 === 1 ? 0x69e4cf : 0xff7183;
      graphics.fillStyle(color, 0.12);
      graphics.fillCircle(x, 135 + (index % 2) * 18, 24);
      graphics.fillStyle(color, 0.95);
      graphics.fillCircle(x, 135 + (index % 2) * 18, 6);
    }
    graphics.lineStyle(2, 0xfff0ba, 0.3);
    graphics.beginPath();
    graphics.moveTo(0, 122);
    for (let x = 0; x <= 960; x += 80) graphics.lineTo(x, 138 + ((x / 80) % 2) * 18);
    graphics.strokePath();
    for (let index = 0; index < 9; index += 1) {
      const x = 36 + index * 116;
      graphics.fillStyle(0x071016, 0.75);
      graphics.fillCircle(x, 485, 28);
      graphics.fillRoundedRect(x - 27, 507, 54, 110, 20);
    }
  }

  private drawTable(graphics: Phaser.GameObjects.Graphics): void {
    graphics.fillStyle(0x09080a, 0.34);
    graphics.fillRoundedRect(96, 163, 768, 374, 35);
    graphics.fillGradientStyle(0x8e3d2f, 0x7b302a, 0x4a221f, 0x5a261f, 1);
    graphics.fillRoundedRect(112, 146, 736, 372, 28);
    graphics.lineStyle(6, 0xf1b465, 0.72);
    graphics.strokeRoundedRect(112, 146, 736, 372, 28);
    graphics.lineStyle(2, 0xffd995, 0.14);
    for (let y = 174; y < 500; y += 28) graphics.lineBetween(132, y, 828, y);
    graphics.lineStyle(3, 0xffe0a8, 0.35);
    graphics.lineBetween(480, 163, 480, 501);
    graphics.fillStyle(0xffe1a8, 0.1);
    graphics.fillCircle(480, 332, 64);
    graphics.lineStyle(2, 0xffe1a8, 0.3);
    graphics.strokeCircle(480, 332, 64);
  }

  private finish(won: boolean): void {
    this.finished = true;
    const score = this.hits * 100 + this.perfects * 35 + Math.max(0, this.maxShots - this.shots) * 15;
    const perfect = won && this.hits >= 3 && this.shots === 3 && this.perfects >= 2;
    gameStore.recordActivity('beerPong', won, perfect ? 'perfect' : 'solid', score);
    this.message.setText(won
      ? `${perfect ? 'Makellose Serie.' : 'Sieg.'} ${this.hits} Treffer in ${this.shots} Würfen.`
      : `${this.hits} Treffer reichen nicht. Die Becher bleiben arrogant.`);
    const back = this.add.text(480, 602, 'Zurück zum Partyzelt', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '17px',
      fontStyle: 'bold',
      color: '#173027',
      backgroundColor: '#f1cf70',
      padding: { x: 18, y: 11 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    back.on('pointerdown', () => {
      gameStore.enterInterior('party-tent');
      this.scene.start('interior');
    });
  }

  private updateScore(): void {
    this.scoreLabel.setText(`Treffer ${this.hits}/3 · Würfe ${this.shots}/${this.maxShots} · Präzisionsfenster ${this.tolerance}`);
  }
}
