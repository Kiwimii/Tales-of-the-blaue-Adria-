import Phaser from 'phaser';
import { playBattleIntro } from '../battleIntro';
import type { CombatAction } from '../combat';
import { createEntryDebateState, entryDebateHint, resolveEntryDebateRound, type EntryDebateState } from '../entryDebate';
import { gameStore } from '../state/GameStore';
import { activeStatuses, statusModifiers, statusVisuals } from '../statusSystem';
import { addCinematicFrame } from '../visuals';

export class AdvancedEntryDebateScene extends Phaser.Scene {
  private debate!: EntryDebateState;
  private playerBar!: Phaser.GameObjects.Rectangle;
  private authorityBar!: Phaser.GameObjects.Rectangle;
  private log!: Phaser.GameObjects.Text;
  private hint!: Phaser.GameObjects.Text;
  private roundLabel!: Phaser.GameObjects.Text;
  private statusLabel!: Phaser.GameObjects.Text;
  private arena!: Phaser.GameObjects.Container;
  private locked = true;
  private hasBatida = false;

  constructor() {
    super('entry-debate');
  }

  create(): void {
    gameStore.setMode('battle');
    const snapshot = gameStore.snapshot();
    this.hasBatida = (snapshot.inventory.batida ?? 0) > 0;
    this.debate = createEntryDebateState();
    const modifiers = statusModifiers(snapshot.needs);
    this.debate.playerMaxResolve = Math.max(62, Math.round(this.debate.playerMaxResolve * modifiers.defense));
    this.debate.playerResolve = this.debate.playerMaxResolve;
    this.cameras.main.setBackgroundColor('#111617');
    this.arena = this.add.container(0, 0).setAlpha(0);
    this.buildArena(snapshot);
    addCinematicFrame(this, 0xf4c75d);
    playBattleIntro(this, 'entry-authority', snapshot, () => {
      this.tweens.add({ targets: this.arena, alpha: 1, duration: 360 });
      this.locked = false;
    });
  }

  private buildArena(snapshot: ReturnType<typeof gameStore.snapshot>): void {
    const background = this.add.graphics();
    background.fillGradientStyle(0x112b2a, 0x1f4540, 0x5d352b, 0x251b21, 1).fillRect(0, 0, 960, 640);
    background.fillStyle(0x0a1010, 0.5).fillRect(0, 455, 960, 185);
    background.lineStyle(3, 0xf4c75d, 0.28).strokeRoundedRect(75, 120, 810, 330, 34);
    this.arena.add(background);

    const heading = this.add.text(480, 25, 'HAUPTSCHRANKE · VERWALTUNG GEGEN RESTVERNUNFT', {
      fontFamily: 'Arial Black, system-ui', fontSize: '12px', color: '#66dac6', letterSpacing: 2,
    }).setOrigin(0.5);
    const title = this.add.text(480, 58, 'EINLASSDISKUSSION', {
      fontFamily: 'Arial Black, system-ui', fontSize: '33px', color: '#fff2c4', stroke: '#4b2527', strokeThickness: 5,
    }).setOrigin(0.5);
    this.roundLabel = this.add.text(480, 98, 'Tutorial · Runde 1', {
      fontFamily: 'system-ui', fontSize: '14px', fontStyle: 'bold', color: '#fff0c0', backgroundColor: '#0b1717dd', padding: { x: 13, y: 6 },
    }).setOrigin(0.5);
    this.arena.add([heading, title, this.roundLabel]);

    const player = this.drawCombatant(205, 245, 'player', snapshot.profile?.name ?? 'Du', '#79d39a');
    const authority = this.drawAuthority(725, 245);
    this.arena.add([player, authority]);
    if (snapshot.needs.alcohol >= 38) this.tweens.add({ targets: player, angle: { from: -2.2, to: 2.2 }, x: '+=4', duration: 850, yoyo: true, repeat: -1, ease: 'Sine.InOut' });

    this.playerBar = this.makeBar(130, 370, 170, 18, 0x67d69a);
    this.authorityBar = this.makeBar(650, 370, 170, 18, 0xef765f);
    this.statusLabel = this.add.text(205, 405, activeStatuses(snapshot.needs).map((status) => status.shortLabel).join(' · ') || 'STABIL', {
      fontFamily: 'Arial Black, system-ui', fontSize: '11px', color: '#fff2c4', align: 'center', wordWrap: { width: 350 },
    }).setOrigin(0.5);
    this.arena.add([this.playerBar, this.authorityBar, this.statusLabel]);

    this.log = this.add.text(480, 445, 'Die Einlassdiskussion ist der erste Kampf. Der außerhalb aufgebaute Zustand verändert bereits hier Verteidigung und Reaktionszeit.', {
      fontFamily: 'system-ui', fontSize: '16px', color: '#f8f2df', align: 'center', wordWrap: { width: 790 }, backgroundColor: '#101923e6', padding: { x: 16, y: 12 },
    }).setOrigin(0.5);
    this.hint = this.add.text(480, 505, entryDebateHint(this.debate), {
      fontFamily: 'system-ui', fontSize: '14px', fontStyle: 'bold', color: '#8de2cf', align: 'center', wordWrap: { width: 800 },
    }).setOrigin(0.5);
    this.arena.add([this.log, this.hint]);
    this.arena.add([
      this.addButton(175, 570, 'Beleg kontern', () => this.playerTurn('counter')),
      this.addButton(430, 570, 'Regelwerk blocken', () => this.playerTurn('guard')),
      this.addButton(690, 570, this.hasBatida ? 'Batida-Zuruf' : 'Gruppen-Zuruf', () => this.playerTurn('rally')),
      this.addButton(870, 570, 'Rückzug', () => this.withdraw(), true),
    ]);
    this.updateBars();
  }

  private drawCombatant(x: number, y: number, texture: string, label: string, accent: string): Phaser.GameObjects.Container {
    const children = [
      this.add.ellipse(6, 70, 170, 52, 0x03080c, 0.35),
      this.add.circle(0, 0, 80, 0x07151c, 0.52).setStrokeStyle(4, Phaser.Display.Color.HexStringToColor(accent).color, 0.5),
      this.add.image(0, 0, texture).setScale(3),
      this.add.text(0, -105, label, { fontFamily: 'system-ui', fontSize: '20px', fontStyle: 'bold', color: accent }).setOrigin(0.5),
    ];
    return this.add.container(x, y, children);
  }

  private drawAuthority(x: number, y: number): Phaser.GameObjects.Container {
    return this.add.container(x, y, [
      this.add.ellipse(5, 72, 210, 55, 0x03080c, 0.38),
      this.add.circle(0, 0, 86, 0x351d24, 0.62).setStrokeStyle(4, 0xef8b72, 0.5),
      this.add.image(-38, 4, 'npc-gundula').setScale(2.55),
      this.add.image(42, 4, 'npc-uli').setScale(2.55),
      this.add.text(0, -110, 'Gundula & Uli', { fontFamily: 'system-ui', fontSize: '20px', fontStyle: 'bold', color: '#ef8b72' }).setOrigin(0.5),
    ]);
  }

  private makeBar(x: number, y: number, width: number, height: number, color: number): Phaser.GameObjects.Rectangle {
    this.arena.add(this.add.rectangle(x + width / 2, y, width + 12, height + 12, 0x07151c, 0.92).setStrokeStyle(2, 0xfff1c7, 0.2));
    return this.add.rectangle(x, y, width, height, color, 1).setOrigin(0, 0.5);
  }

  private addButton(x: number, y: number, label: string, action: () => void, danger = false): Phaser.GameObjects.Text {
    const button = this.add.text(x, y, label, {
      fontFamily: 'system-ui', fontSize: danger ? '14px' : '16px', fontStyle: 'bold', color: '#173027', backgroundColor: danger ? '#ef8b72' : '#f4d47b', padding: { x: danger ? 12 : 16, y: 12 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    button.on('pointerover', () => button.setScale(1.04));
    button.on('pointerout', () => button.setScale(1));
    button.on('pointerdown', action);
    return button;
  }

  private playerTurn(action: CombatAction): void {
    if (this.locked) return;
    this.locked = true;
    const snapshot = gameStore.snapshot();
    const result = resolveEntryDebateRound(this.debate, action, this.hasBatida);
    const modifiers = statusModifiers(snapshot.needs);
    if (result.playerDamage > 0 && modifiers.power > 1) {
      const bonus = Math.round(result.playerDamage * (modifiers.power - 1));
      result.state.authorityResolve = Math.max(0, result.state.authorityResolve - bonus);
      result.playerDamage += bonus;
      result.log += ` Dein Pegel erhöht den Druck um ${bonus}, nicht aber die Eleganz.`;
    }
    this.debate = result.state;
    this.log.setText(result.log);
    this.hint.setText(entryDebateHint(this.debate));
    this.roundLabel.setText(`Tutorial · Runde ${this.debate.round}`);
    this.updateBars();
    if (this.debate.authorityResolve <= 0 || result.finished === 'victory') return void this.time.delayedCall(900, () => this.victory());
    if (result.finished === 'defeat') return void this.time.delayedCall(900, () => this.defeat());
    this.time.delayedCall(560 + statusVisuals(snapshot.needs).delayMs, () => { this.locked = false; });
  }

  private victory(): void {
    gameStore.setFlag('entryDebateWon');
    gameStore.setFlag('taucherplatzAssigned');
    gameStore.setFlag('gateOpen');
    gameStore.advanceMinutes(14);
    this.log.setText('Sieg: Gundula verschiebt die Mehrkosten auf Sonntag, Uli öffnet die Schranke.');
    this.cameras.main.flash(380, 244, 212, 123, false);
    this.time.delayedCall(1700, () => this.returnToWorld());
  }

  private defeat(): void {
    gameStore.setFlag('entryDebateFailed');
    gameStore.advanceMinutes(8);
    this.log.setText('Die Verwaltung gewinnt diese Runde. Zustände bleiben bestehen; ein neuer Versuch kann besser vorbereitet werden.');
    this.time.delayedCall(1500, () => this.returnToWorld());
  }

  private withdraw(): void {
    if (this.locked) return;
    this.locked = true;
    gameStore.setFlag('entryDebateWithdrew');
    gameStore.advanceMinutes(5);
    this.log.setText('Taktischer Rückzug. Die Schranke bleibt geschlossen.');
    this.time.delayedCall(1100, () => this.returnToWorld());
  }

  private updateBars(): void {
    this.playerBar?.setScale(this.debate.playerResolve / this.debate.playerMaxResolve, 1);
    this.authorityBar?.setScale(this.debate.authorityResolve / this.debate.authorityMaxResolve, 1);
  }

  private returnToWorld(): void {
    gameStore.setMode('world');
    this.scene.start('world');
  }
}
