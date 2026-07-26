import Phaser from 'phaser';
import type { CombatAction } from '../combat';
import {
  createEntryDebateState,
  entryDebateHint,
  resolveEntryDebateRound,
  type EntryDebateState,
} from '../entryDebate';
import { gameStore } from '../state/GameStore';
import { addCinematicFrame } from '../visuals';

export class EntryDebateScene extends Phaser.Scene {
  private debate!: EntryDebateState;
  private playerBar!: Phaser.GameObjects.Rectangle;
  private authorityBar!: Phaser.GameObjects.Rectangle;
  private log!: Phaser.GameObjects.Text;
  private hint!: Phaser.GameObjects.Text;
  private roundLabel!: Phaser.GameObjects.Text;
  private locked = false;
  private hasBatida = false;

  constructor() {
    super('entry-debate');
  }

  create(): void {
    gameStore.setMode('battle');
    const snapshot = gameStore.snapshot();
    this.hasBatida = (snapshot.inventory.batida ?? 0) > 0;
    this.debate = createEntryDebateState();
    this.cameras.main.setBackgroundColor('#111617');

    const background = this.add.graphics();
    background.fillGradientStyle(0x112b2a, 0x1f4540, 0x5d352b, 0x251b21, 1).fillRect(0, 0, 960, 640);
    background.fillStyle(0x0a1010, 0.5).fillRect(0, 455, 960, 185);
    background.lineStyle(3, 0xf4c75d, 0.28).strokeRoundedRect(75, 120, 810, 330, 34);

    this.add.text(480, 25, 'HAUPTSCHRANKE · VERWALTUNG GEGEN RESTVERNUNFT', {
      fontFamily: 'Arial Black, system-ui', fontSize: '12px', color: '#66dac6', letterSpacing: 2,
    }).setOrigin(0.5);
    this.add.text(480, 58, 'EINLASSDISKUSSION', {
      fontFamily: 'Arial Black, system-ui', fontSize: '33px', color: '#fff2c4', stroke: '#4b2527', strokeThickness: 5,
    }).setOrigin(0.5);
    this.roundLabel = this.add.text(480, 98, 'Tutorial · Runde 1', {
      fontFamily: 'system-ui', fontSize: '14px', fontStyle: 'bold', color: '#fff0c0',
      backgroundColor: '#0b1717dd', padding: { x: 13, y: 6 },
    }).setOrigin(0.5);

    this.drawCombatant(205, 245, 'player', snapshot.profile?.name ?? 'Du', '#79d39a');
    this.drawAuthority(725, 245);
    this.playerBar = this.makeBar(130, 370, 170, 18, 0x67d69a);
    this.authorityBar = this.makeBar(650, 370, 170, 18, 0xef765f);

    this.log = this.add.text(480, 430, 'Gundula und Uli blockieren die Schranke. Lerne Konter, Blockade und Team-Zuruf; neue Aktionen wirken stärker als Wiederholungen.', {
      fontFamily: 'system-ui', fontSize: '16px', color: '#f8f2df', align: 'center', wordWrap: { width: 790 },
      backgroundColor: '#101923e6', padding: { x: 16, y: 12 },
    }).setOrigin(0.5);
    this.hint = this.add.text(480, 495, entryDebateHint(this.debate), {
      fontFamily: 'system-ui', fontSize: '14px', fontStyle: 'bold', color: '#8de2cf', align: 'center', wordWrap: { width: 800 },
    }).setOrigin(0.5);

    this.addButton(175, 565, 'Beleg kontern', () => this.playerTurn('counter'));
    this.addButton(430, 565, 'Regelwerk blocken', () => this.playerTurn('guard'));
    this.addButton(690, 565, this.hasBatida ? 'Batida-Zuruf' : 'Gruppen-Zuruf', () => this.playerTurn('rally'));
    this.addButton(870, 565, 'Rückzug', () => this.withdraw(), true);
    this.updateBars();
    addCinematicFrame(this, 0xf4c75d);
  }

  private drawCombatant(x: number, y: number, texture: string, label: string, accent: string): void {
    this.add.ellipse(x + 6, y + 70, 170, 52, 0x03080c, 0.35);
    this.add.circle(x, y, 80, 0x07151c, 0.52).setStrokeStyle(4, Phaser.Display.Color.HexStringToColor(accent).color, 0.5);
    this.add.image(x, y, texture).setScale(3);
    this.add.text(x, y - 105, label, { fontFamily: 'system-ui', fontSize: '20px', fontStyle: 'bold', color: accent }).setOrigin(0.5);
  }

  private drawAuthority(x: number, y: number): void {
    this.add.ellipse(x + 5, y + 72, 210, 55, 0x03080c, 0.38);
    this.add.circle(x, y, 86, 0x351d24, 0.62).setStrokeStyle(4, 0xef8b72, 0.5);
    this.add.image(x - 38, y + 4, 'npc-gundula').setScale(2.55);
    this.add.image(x + 42, y + 4, 'npc-uli').setScale(2.55);
    this.add.text(x, y - 110, 'Gundula & Uli', { fontFamily: 'system-ui', fontSize: '20px', fontStyle: 'bold', color: '#ef8b72' }).setOrigin(0.5);
  }

  private makeBar(x: number, y: number, width: number, height: number, color: number): Phaser.GameObjects.Rectangle {
    this.add.rectangle(x + width / 2, y, width + 12, height + 12, 0x07151c, 0.92).setStrokeStyle(2, 0xfff1c7, 0.2);
    return this.add.rectangle(x, y, width, height, color, 1).setOrigin(0, 0.5);
  }

  private addButton(x: number, y: number, label: string, action: () => void, danger = false): void {
    const button = this.add.text(x, y, label, {
      fontFamily: 'system-ui', fontSize: danger ? '14px' : '16px', fontStyle: 'bold', color: '#173027',
      backgroundColor: danger ? '#ef8b72' : '#f4d47b', padding: { x: danger ? 12 : 16, y: 12 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    button.on('pointerover', () => button.setScale(1.04));
    button.on('pointerout', () => button.setScale(1));
    button.on('pointerdown', action);
  }

  private playerTurn(action: CombatAction): void {
    if (this.locked) return;
    this.locked = true;
    const result = resolveEntryDebateRound(this.debate, action, this.hasBatida);
    this.debate = result.state;
    this.log.setText(result.log);
    this.hint.setText(entryDebateHint(this.debate));
    this.roundLabel.setText(`Tutorial · Runde ${this.debate.round}`);
    this.updateBars();

    if (result.finished === 'victory') {
      this.time.delayedCall(900, () => this.victory());
      return;
    }
    if (result.finished === 'defeat') {
      this.time.delayedCall(900, () => this.defeat());
      return;
    }
    this.time.delayedCall(560, () => { this.locked = false; });
  }

  private victory(): void {
    gameStore.setFlag('entryDebateWon');
    gameStore.setFlag('taucherplatzAssigned');
    gameStore.setFlag('gateOpen');
    gameStore.advanceMinutes(14);
    this.log.setText('Sieg: Die Reservierung gilt vorläufig. Gundula verschiebt die Mehrkosten auf Sonntag, Uli öffnet die Schranke zum Taucherplatz.');
    this.cameras.main.flash(380, 244, 212, 123, false);
    this.time.delayedCall(1700, () => this.returnToWorld());
  }

  private defeat(): void {
    gameStore.setFlag('entryDebateFailed');
    gameStore.advanceMinutes(8);
    this.log.setText('Die Verwaltung gewinnt diese Runde. Die Schranke bleibt zu, aber die Diskussion kann erneut begonnen werden.');
    this.time.delayedCall(1500, () => this.returnToWorld());
  }

  private withdraw(): void {
    if (this.locked) return;
    this.locked = true;
    gameStore.setFlag('entryDebateWithdrew');
    gameStore.advanceMinutes(5);
    this.log.setText('Taktischer Rückzug zum Kofferraum. Die Schranke bleibt geschlossen.');
    this.time.delayedCall(1100, () => this.returnToWorld());
  }

  private updateBars(): void {
    this.playerBar.setScale(this.debate.playerResolve / this.debate.playerMaxResolve, 1);
    this.authorityBar.setScale(this.debate.authorityResolve / this.debate.authorityMaxResolve, 1);
  }

  private returnToWorld(): void {
    gameStore.setMode('world');
    this.scene.start('world');
  }
}
