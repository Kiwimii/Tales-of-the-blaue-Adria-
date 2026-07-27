import Phaser from 'phaser';
import { advanceHedgePee, hedgeDangerAt, hedgePeeResult, type HedgePeeState } from '../hedgePeeMechanics';
import { gameStore } from '../state/GameStore';
import { recordMetaActivity } from '../storeAdapter';
import { addCinematicFrame } from '../visuals';

export class HedgePeeScene extends Phaser.Scene {
  private attempt: HedgePeeState = { progress: 0, suspicion: 0 };
  private elapsedMs = 0;
  private bladder = 50;
  private peeing = false;
  private finished = false;
  private danger = 0;
  private progressFill!: Phaser.GameObjects.Rectangle;
  private suspicionFill!: Phaser.GameObjects.Rectangle;
  private dangerFill!: Phaser.GameObjects.Rectangle;
  private dangerLabel!: Phaser.GameObjects.Text;
  private instruction!: Phaser.GameObjects.Text;
  private stream!: Phaser.GameObjects.Graphics;
  private guardGundula!: Phaser.GameObjects.Container;
  private guardUli!: Phaser.GameObjects.Container;

  constructor() {
    super('hedge-pee');
  }

  create(): void {
    gameStore.setMode('interior');
    this.bladder = gameStore.snapshot().needs.bladder;
    this.cameras.main.setBackgroundColor('#081611');

    const background = this.add.graphics();
    background.fillGradientStyle(0x07120f, 0x173b2c, 0x26301d, 0x07120f, 1).fillRect(0, 0, 960, 640);
    background.fillStyle(0x0a1512, 0.62).fillRoundedRect(55, 34, 850, 568, 30);
    background.lineStyle(3, 0x80a969, 0.38).strokeRoundedRect(55, 34, 850, 568, 30);
    this.drawHedge(background);
    this.drawPlayer(background);

    this.add.text(480, 42, 'TAUCHERPLATZ · DISKRETE ANGELEGENHEIT', {
      fontFamily: 'Arial Black, system-ui', fontSize: '12px', color: '#93d8c4', letterSpacing: 2,
    }).setOrigin(0.5);
    this.add.text(480, 78, 'IN DIE HECKE', {
      fontFamily: 'Arial Black, system-ui', fontSize: '38px', color: '#fff0ba', stroke: '#173027', strokeThickness: 6,
    }).setOrigin(0.5);

    this.guardGundula = this.makeGuard(260, 170, 'G', 0xd8b65f, 'GUNDULA');
    this.guardUli = this.makeGuard(700, 170, 'U', 0x7db9d2, 'ULI');

    this.progressFill = this.makeBar(220, 470, 520, 'ERLEICHTERUNG', 0x6fd8b8);
    this.suspicionFill = this.makeBar(220, 520, 520, 'VERDACHT', 0xef685c);
    this.dangerFill = this.makeBar(220, 570, 520, 'BLICKRISIKO', 0xf2c65f);
    this.dangerLabel = this.add.text(770, 570, 'SICHER', {
      fontFamily: 'Arial Black, system-ui', fontSize: '12px', color: '#8be0b7',
    }).setOrigin(0, 0.5);

    this.instruction = this.add.text(480, 420, 'HALTEN: Bildschirm, E oder Leertaste.\nLOS­LASSEN, sobald Gundula oder Uli in deine Richtung schauen.', {
      fontFamily: 'system-ui', fontSize: '16px', color: '#f5ead0', align: 'center', lineSpacing: 7,
      backgroundColor: '#07151de6', padding: { x: 18, y: 12 }, wordWrap: { width: 700 },
    }).setOrigin(0.5);

    this.stream = this.add.graphics().setVisible(false);
    this.input.on('pointerdown', this.beginPee, this);
    this.input.on('pointerup', this.stopPee, this);
    this.input.on('pointerout', this.stopPee, this);
    this.input.keyboard?.on('keydown-SPACE', this.beginPee, this);
    this.input.keyboard?.on('keyup-SPACE', this.stopPee, this);
    this.input.keyboard?.on('keydown-E', this.beginPee, this);
    this.input.keyboard?.on('keyup-E', this.stopPee, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.stopPee());
    addCinematicFrame(this, 0x80a969);
  }

  update(_: number, delta: number): void {
    if (this.finished) return;
    this.elapsedMs += delta;
    this.danger = hedgeDangerAt(this.elapsedMs);
    this.attempt = advanceHedgePee(this.attempt, delta, this.peeing, this.danger, this.bladder);
    this.updatePresentation();

    const result = hedgePeeResult(this.attempt);
    if (result !== 'running') this.finish(result === 'success');
  }

  private beginPee(): void {
    if (this.finished) return;
    this.peeing = true;
    this.stream.setVisible(true);
  }

  private stopPee(): void {
    this.peeing = false;
    this.stream?.setVisible(false);
  }

  private updatePresentation(): void {
    this.progressFill.setScale(this.attempt.progress / 100, 1);
    this.suspicionFill.setScale(this.attempt.suspicion / 100, 1);
    this.dangerFill.setScale(this.danger, 1);
    this.guardGundula.setX(230 + Math.sin(this.elapsedMs * 0.00135) * 120);
    this.guardUli.setX(700 + Math.sin(this.elapsedMs * 0.00087 + 2.1) * 105);

    const dangerous = this.danger >= 0.62;
    const uncertain = this.danger >= 0.34;
    this.dangerLabel.setText(dangerous ? 'SOFORT STOPPEN' : uncertain ? 'AUFPASSEN' : 'SICHER')
      .setColor(dangerous ? '#ff8f82' : uncertain ? '#f4d47b' : '#8be0b7');

    this.stream.clear();
    if (this.peeing) {
      const alpha = dangerous ? 0.95 : 0.72;
      this.stream.lineStyle(5, dangerous ? 0xffd56d : 0xe7d36c, alpha)
        .beginPath().moveTo(485, 362).lineTo(482 + Math.sin(this.elapsedMs * 0.012) * 16, 282).strokePath();
      this.stream.fillStyle(0xe7d36c, alpha * 0.6).fillEllipse(482, 278, 34 + this.attempt.progress * 0.08, 10);
    }
  }

  private finish(success: boolean): void {
    if (this.finished) return;
    this.finished = true;
    this.stopPee();
    const score = Math.max(0, Math.round((100 - this.attempt.suspicion) * 10 + Math.max(0, 24000 - this.elapsedMs) / 80));
    const relievedDelta = success ? -100 : -Math.max(40, Math.round(this.bladder * this.attempt.progress / 100));

    recordMetaActivity(
      gameStore,
      'hedgePee',
      success,
      score,
      success
        ? {
            needs: { bladder: relievedDelta },
            metrics: { dignity: -1, chaos: 3, momentum: 2 },
            relationships: { lars: 2, danny: 2 },
            flags: { hedgeRelieved: true, hedgeCleanGetaway: true },
            minutes: 4,
          }
        : {
            needs: { bladder: relievedDelta },
            metrics: { dignity: -12, chaos: 8, momentum: -4 },
            relationships: { gundula: -12, uli: -9 },
            flags: { hedgeRelieved: this.attempt.progress >= 70, hedgeCaught: true },
            minutes: 5,
          },
      success
        ? `Ungesehen in die Hecke gebrunst. Verdacht ${Math.round(this.attempt.suspicion)} %, Restwürde weitgehend erhalten.`
        : `Beim Brunzen in die Zelthecke erwischt. Verdacht ${Math.round(this.attempt.suspicion)} %, Verwaltungsbeziehung beschädigt.`,
    );

    this.cameras.main.flash(260, success ? 105 : 239, success ? 210 : 104, success ? 160 : 92, false);
    this.instruction.setText(success
      ? `UNBEMERKT · ${score} PUNKTE\nDie Hecke schweigt. Lars und Danny erkennen den Standort offiziell an.`
      : `ERWISCHT · ${score} PUNKTE\nGundula und Uli haben Blickkontakt, Uhrzeit und mutmaßliche Strahlrichtung dokumentiert.`);
    this.dangerLabel.setText(success ? 'GESCHAFFT' : 'ERWISCHT').setColor(success ? '#8be0b7' : '#ff8f82');

    const back = this.add.text(480, 610, 'Zurück zum Taucherplatz', {
      fontFamily: 'Arial Black, system-ui', fontSize: '16px', color: '#173027', backgroundColor: '#f4d47b',
      padding: { x: 18, y: 11 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    back.on('pointerdown', () => this.returnToWorld());
    this.input.keyboard?.once('keydown-SPACE', () => this.returnToWorld());
    this.input.keyboard?.once('keydown-E', () => this.returnToWorld());
  }

  private returnToWorld(): void {
    gameStore.setMode('world');
    this.scene.start('world');
  }

  private makeBar(x: number, y: number, width: number, label: string, color: number): Phaser.GameObjects.Rectangle {
    this.add.text(x - 18, y, label, {
      fontFamily: 'Arial Black, system-ui', fontSize: '11px', color: '#e9ddc3',
    }).setOrigin(1, 0.5);
    this.add.rectangle(x + width / 2, y, width, 20, 0x07120f, 0.88).setStrokeStyle(2, 0xffedba, 0.22);
    return this.add.rectangle(x, y, width, 14, color, 0.96).setOrigin(0, 0.5).setScale(0, 1);
  }

  private makeGuard(x: number, y: number, initial: string, color: number, label: string): Phaser.GameObjects.Container {
    const glow = this.add.circle(0, 0, 42, color, 0.08).setStrokeStyle(2, color, 0.4);
    const head = this.add.circle(0, -10, 20, color, 0.96).setStrokeStyle(3, 0x173027, 0.7);
    const body = this.add.rectangle(0, 26, 48, 60, color, 0.82).setStrokeStyle(3, 0x173027, 0.62);
    const letter = this.add.text(0, -10, initial, { fontFamily: 'Arial Black', fontSize: '16px', color: '#173027' }).setOrigin(0.5);
    const name = this.add.text(0, 64, label, { fontFamily: 'Arial Black, system-ui', fontSize: '10px', color: '#f5ead0' }).setOrigin(0.5);
    return this.add.container(x, y, [glow, body, head, letter, name]);
  }

  private drawHedge(graphics: Phaser.GameObjects.Graphics): void {
    graphics.fillStyle(0x1f4b32, 1).fillRoundedRect(170, 210, 620, 110, 28);
    graphics.fillStyle(0x315f3e, 0.98);
    for (let x = 185; x < 785; x += 34) graphics.fillCircle(x, 218 + (x % 3) * 12, 42);
    graphics.fillStyle(0x4c7b4d, 0.48);
    for (let x = 205; x < 770; x += 62) graphics.fillCircle(x, 198 + (x % 4) * 8, 18);
  }

  private drawPlayer(graphics: Phaser.GameObjects.Graphics): void {
    graphics.fillStyle(0x07120f, 0.32).fillEllipse(480, 392, 112, 26);
    graphics.fillStyle(0x4f84bf, 1).fillRoundedRect(438, 315, 84, 88, 24);
    graphics.fillStyle(0xefc09b, 1).fillCircle(480, 292, 36);
    graphics.fillStyle(0x49301f, 1).fillEllipse(480, 278, 68, 30);
  }
}
