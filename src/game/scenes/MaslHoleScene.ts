import Phaser from 'phaser';
import { gameStore } from '../state/GameStore';
import { recordMetaActivity } from '../storeAdapter';
import { addCinematicFrame } from '../visuals';

export class MaslHoleScene extends Phaser.Scene {
  private ring!: Phaser.GameObjects.Arc;
  private target!: Phaser.GameObjects.Arc;
  private meter!: Phaser.GameObjects.Rectangle;
  private instruction!: Phaser.GameObjects.Text;
  private score = 0;
  private round = 1;
  private direction = 1;
  private radius = 118;
  private locked = false;

  constructor() {
    super('masl-hole');
  }

  create(): void {
    gameStore.setMode('interior');
    this.cameras.main.setBackgroundColor('#101817');
    const background = this.add.graphics();
    background.fillGradientStyle(0x0b1714, 0x22443a, 0x3c2943, 0x101418, 1).fillRect(0, 0, 960, 640);
    background.fillStyle(0x08110f, 0.55).fillRoundedRect(105, 76, 750, 480, 42);
    background.lineStyle(3, 0x84d6a2, 0.4).strokeRoundedRect(105, 76, 750, 480, 42);

    this.add.text(480, 36, 'MASLS SPEZIALTECHNIK', {
      fontFamily: 'Arial Black, system-ui', fontSize: '13px', color: '#84d6a2', letterSpacing: 3,
    }).setOrigin(0.5);
    this.add.text(480, 72, 'KOMM ANS LOCH', {
      fontFamily: 'Arial Black, system-ui', fontSize: '38px', color: '#fff2c4', stroke: '#173027', strokeThickness: 6,
    }).setOrigin(0.5);

    this.drawHands();
    this.target = this.add.circle(480, 320, 58, 0x84d6a2, 0.08).setStrokeStyle(10, 0x84d6a2, 0.72);
    this.ring = this.add.circle(480, 320, this.radius, 0xb99ce8, 0.03).setStrokeStyle(6, 0xd9c6ff, 0.92);
    this.add.circle(480, 320, 18, 0x07120f, 0.95).setStrokeStyle(3, 0xf4d47b, 0.7);

    this.meter = this.add.rectangle(270, 512, 0, 18, 0x84d6a2).setOrigin(0, 0.5);
    this.add.rectangle(480, 512, 430, 28, 0x07120f, 0.72).setStrokeStyle(2, 0xfff0ba, 0.28).setDepth(this.meter.depth - 1);
    this.instruction = this.add.text(480, 565, 'Drücke LEERTASTE oder tippe, wenn der pulsierende Ring den grünen Zielbereich trifft.', {
      fontFamily: 'system-ui', fontSize: '16px', color: '#f4e7c0', align: 'center', wordWrap: { width: 720 }, backgroundColor: '#07151ddd', padding: { x: 14, y: 9 },
    }).setOrigin(0.5);
    this.add.text(480, 605, 'Drei Züge · gutes Timing erhöht Breitheit und Masls Respekt stärker', {
      fontFamily: 'system-ui', fontSize: '12px', color: '#a7beb3',
    }).setOrigin(0.5);

    this.input.keyboard?.on('keydown-SPACE', () => this.takePull());
    this.input.on('pointerdown', () => this.takePull());
    this.time.addEvent({ delay: 16, loop: true, callback: () => this.animateRing() });
    this.createSmoke();
    addCinematicFrame(this, 0x84d6a2);
  }

  private animateRing(): void {
    if (this.locked) return;
    this.radius += this.direction * (1.8 + this.round * 0.28);
    if (this.radius <= 38 || this.radius >= 132) this.direction *= -1;
    this.ring.setRadius(this.radius);
  }

  private takePull(): void {
    if (this.locked) return;
    this.locked = true;
    const distance = Math.abs(this.radius - 58);
    const points = Math.max(0, Math.round(100 - distance * 2.15));
    this.score += points;
    this.meter.width = Math.min(430, (this.score / 300) * 430);
    this.cameras.main.flash(180, 132, 214, 162, false);
    this.instruction.setText(points >= 80 ? `Zug ${this.round}: Volltreffer. Masl nickt sehr langsam.` : points >= 45 ? `Zug ${this.round}: Solide. Der Hohlraum hält.` : `Zug ${this.round}: Zu früh oder zu spät. Mehr Luft als Wirkung.`);
    this.time.delayedCall(650, () => {
      if (this.round >= 3) this.finish();
      else {
        this.round += 1;
        this.radius = 126 - this.round * 7;
        this.direction = -1;
        this.ring.setRadius(this.radius);
        this.locked = false;
      }
    });
  }

  private finish(): void {
    const success = this.score >= 155;
    recordMetaActivity(
      gameStore,
      'maslHole',
      success,
      this.score,
      success
        ? { needs: { highness: 42, energy: -8, courage: 6 }, relationships: { masl: 9 }, metrics: { chaos: 5, momentum: 5 }, flags: { maslHoleMastered: true }, minutes: 12 }
        : { needs: { highness: 20, energy: -5 }, relationships: { masl: 3 }, metrics: { chaos: 2 }, minutes: 9 },
      success
        ? `Komm ans Loch gemeistert: ${this.score} Punkte. Der Zustand BREIT ist jetzt deutlich aktiv.`
        : `Komm ans Loch beendet: ${this.score} Punkte. Wirkung vorhanden, Technik ausbaufähig.`,
    );
    this.instruction.setText(success ? `MEISTERSCHAFT · ${this.score}/300\nDie Reaktion in Welt, Kämpfen und Gesprächen ist nun merklich verzögert.` : `ERGEBNIS · ${this.score}/300\nMasl: „Das Loch war da. Du warst nur nicht immer dran.“`);
    this.time.delayedCall(2200, () => this.returnToWorld());
  }

  private drawHands(): void {
    const g = this.add.graphics();
    g.fillStyle(0xd79b73, 0.98).fillRoundedRect(250, 235, 175, 170, 70).fillRoundedRect(535, 235, 175, 170, 70);
    g.fillStyle(0x9b684d, 0.78).fillRoundedRect(392, 270, 42, 132, 18).fillRoundedRect(526, 270, 42, 132, 18);
    g.fillStyle(0xf3e5c4).fillRoundedRect(420, 195, 120, 12, 5);
    g.fillStyle(0x7a4a2b).fillRoundedRect(520, 195, 20, 12, 4);
    g.fillStyle(0xef765f).fillCircle(421, 201, 7);
  }

  private createSmoke(): void {
    for (let index = 0; index < 12; index += 1) {
      const smoke = this.add.circle(445 + (index % 4) * 24, 205 - Math.floor(index / 4) * 20, 7 + index % 3, 0xd9e5df, 0.08);
      this.tweens.add({ targets: smoke, y: `-=${70 + index * 3}`, x: `+=${(index % 2 ? 1 : -1) * (15 + index)}`, alpha: { from: 0.04, to: 0.18 }, scale: 2.2, duration: 2100 + index * 130, delay: index * 90, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
    }
  }

  private returnToWorld(): void {
    gameStore.setMode('world');
    this.scene.start('world');
  }
}
