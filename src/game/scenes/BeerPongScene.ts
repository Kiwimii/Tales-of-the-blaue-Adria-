import Phaser from 'phaser';
import { conditionModifier, totalTeamBonus } from '../mechanics';
import { gameStore } from '../state/GameStore';

export class BeerPongScene extends Phaser.Scene {
  private reticle!: Phaser.GameObjects.Container;
  private message!: Phaser.GameObjects.Text;
  private scoreLabel!: Phaser.GameObjects.Text;
  private cups: Phaser.GameObjects.Arc[] = [];
  private targetIndex = 0;
  private phase = 0;
  private direction = 1;
  private shots = 0;
  private hits = 0;
  private perfects = 0;
  private maxShots = 6;
  private tolerance = 42;
  private finished = false;

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
    graphics.fillGradientStyle(0x122b27, 0x122b27, 0x543221, 0x543221, 1);
    graphics.fillRect(0, 0, 960, 640);
    graphics.fillStyle(0x7c4a2c, 1);
    graphics.fillRoundedRect(120, 155, 720, 360, 24);
    graphics.lineStyle(5, 0xb87845, 0.7);
    graphics.strokeRoundedRect(120, 155, 720, 360, 24);

    this.add.text(480, 42, 'BEER PONG · PRÄZISION VOR RESTWÜRDE', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '30px',
      fontStyle: 'bold',
      color: '#ffe5a5',
    }).setOrigin(0.5);
    this.message = this.add.text(480, 92, 'Stoppe das Fadenkreuz über dem leuchtenden Becher.', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '17px',
      color: '#f8f0dd',
    }).setOrigin(0.5);
    this.scoreLabel = this.add.text(480, 558, '', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '16px',
      fontStyle: 'bold',
      color: '#f6deb0',
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
      const cup = this.add.circle(x, y, 29, index === 0 ? 0xf5ce66 : 0xd85149, 1);
      cup.setStrokeStyle(6, 0xffffff, 0.75);
      this.add.circle(x, y, 17, 0x6f2522, 1);
      return cup;
    });

    const cross = this.add.graphics();
    cross.lineStyle(4, 0x7effb2, 1);
    cross.strokeCircle(0, 0, 24);
    cross.lineBetween(-34, 0, 34, 0);
    cross.lineBetween(0, -34, 0, 34);
    this.reticle = this.add.container(240, 280, [cross]);

    this.input.on('pointerdown', () => this.throwBall());
    this.input.keyboard?.on('keydown-SPACE', () => this.throwBall());
    this.input.keyboard?.on('keydown-E', () => this.throwBall());
    this.updateScore();
  }

  update(_: number, delta: number): void {
    if (this.finished) return;
    this.phase += delta * 0.0014 * this.direction;
    if (this.phase >= Math.PI * 2) {
      this.phase = Math.PI * 2;
      this.direction = -1;
    }
    if (this.phase <= 0) {
      this.phase = 0;
      this.direction = 1;
    }
    const sway = gameStore.snapshot().needs.alcohol * 0.35;
    this.reticle.setPosition(
      250 + (this.phase / (Math.PI * 2)) * 460,
      315 + Math.sin(this.phase * 2.4) * (82 + sway),
    );
  }

  private throwBall(): void {
    if (this.finished) return;
    this.shots += 1;
    const target = this.cups[this.targetIndex];
    const distance = Phaser.Math.Distance.Between(this.reticle.x, this.reticle.y, target.x, target.y);
    const hit = distance <= this.tolerance;
    if (hit) {
      this.hits += 1;
      if (distance <= Math.max(12, this.tolerance * 0.34)) this.perfects += 1;
      target.setFillStyle(0x4e3126, 0.38).setStrokeStyle(3, 0xe9c47a, 0.3);
      this.targetIndex += 1;
      this.message.setText(distance <= Math.max(12, this.tolerance * 0.34)
        ? 'Sauber mittig. Verdächtig kompetent.'
        : 'Drin. Physik und Restalkohol einigen sich.');
      if (this.targetIndex < this.cups.length) {
        this.cups[this.targetIndex].setFillStyle(0xf5ce66, 1);
      }
    } else {
      this.message.setText('Daneben. Der Tisch war vermutlich schief.');
      this.cameras.main.shake(100, 0.004);
    }
    this.updateScore();
    if (this.hits >= 3 || this.shots >= this.maxShots) this.finish(this.hits >= 3);
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
