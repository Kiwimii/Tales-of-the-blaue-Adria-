import Phaser from 'phaser';
import {
  combatStatusLabels,
  createAdvancedCombatState,
  resolveAdvancedCombatRound,
  type AdvancedCombatAction,
  type AdvancedCombatState,
} from '../advancedCombat';
import { playBattleIntro } from '../battleIntro';
import { activeTeamSynergies } from '../friendRoster';
import { gameStore } from '../state/GameStore';
import { activeStatuses, statusVisuals } from '../statusSystem';
import { addCinematicFrame } from '../visuals';

export class AdvancedBattleScene extends Phaser.Scene {
  private combat!: AdvancedCombatState;
  private enemyBar!: Phaser.GameObjects.Rectangle;
  private playerBar!: Phaser.GameObjects.Rectangle;
  private log!: Phaser.GameObjects.Text;
  private roundLabel!: Phaser.GameObjects.Text;
  private statusLabel!: Phaser.GameObjects.Text;
  private enemyStatusLabel!: Phaser.GameObjects.Text;
  private arena!: Phaser.GameObjects.Container;
  private locked = true;

  constructor() {
    super('battle');
  }

  create(): void {
    gameStore.setMode('battle');
    const snapshot = gameStore.snapshot();
    this.combat = createAdvancedCombatState(snapshot);
    this.cameras.main.setBackgroundColor('#07151c');
    this.arena = this.add.container(0, 0).setAlpha(0);
    this.buildArena(snapshot);
    addCinematicFrame(this, 0xef685c);
    playBattleIntro(this, 'ronny', snapshot, () => {
      this.tweens.add({ targets: this.arena, alpha: 1, duration: 360 });
      this.locked = false;
    });
  }

  private buildArena(snapshot: ReturnType<typeof gameStore.snapshot>): void {
    const background = this.add.graphics();
    background.fillGradientStyle(0x071c2a, 0x12363e, 0x40212b, 0x733728, 1).fillRect(0, 0, 960, 640);
    this.drawArena(background);
    this.arena.add(background);

    const heading = this.add.text(480, 24, 'HAUPTWEG · STATUSKAMPF', {
      fontFamily: 'Arial, system-ui', fontSize: '11px', fontStyle: 'bold', letterSpacing: 3, color: '#66dac6',
    }).setOrigin(0.5);
    const title = this.add.text(480, 55, 'CAMPING-DUELL', {
      fontFamily: 'Arial Black, system-ui', fontSize: '34px', fontStyle: 'bold', color: '#fff2c4', stroke: '#461820', strokeThickness: 5,
    }).setOrigin(0.5);
    this.roundLabel = this.add.text(480, 94, 'Runde 1', {
      fontFamily: 'system-ui', fontSize: '15px', fontStyle: 'bold', color: '#fff0c0', backgroundColor: '#07151fe0', padding: { x: 14, y: 6 },
    }).setOrigin(0.5);
    this.arena.add([heading, title, this.roundLabel]);

    const playerGroup = this.drawCombatant(225, 252, 'player', snapshot.profile?.name ?? 'Du', '#78cfa4');
    const enemyGroup = this.drawCombatant(735, 252, 'rival', 'Rivalen-Ronny', '#ef8b72');
    this.arena.add([playerGroup, enemyGroup]);
    this.applyBodyAnimation(playerGroup, snapshot);

    const supportText = snapshot.team.length
      ? snapshot.team.map((member) => `${member.name}: ${member.role}`).join(' · ')
      : 'Du kämpfst allein. Freunde können später bis zu drei aktive Partner werden.';
    const support = this.add.text(225, 337, supportText, {
      fontFamily: 'system-ui', fontSize: '12px', color: '#bcd2c7', align: 'center', wordWrap: { width: 360 },
    }).setOrigin(0.5);
    const synergies = activeTeamSynergies(snapshot.team.map((member) => member.id));
    const synergy = this.add.text(735, 337, synergies.length ? `Synergie: ${synergies.map((item) => item.label).join(' · ')}` : 'Keine Team-Synergie aktiv', {
      fontFamily: 'system-ui', fontSize: '12px', color: '#d9c4f2', align: 'center', wordWrap: { width: 360 },
    }).setOrigin(0.5);
    this.arena.add([support, synergy]);

    this.playerBar = this.makeBar(145, 378, 160, 18, 0x67d69a);
    this.enemyBar = this.makeBar(655, 378, 160, 18, 0xef765f);
    this.statusLabel = this.add.text(225, 408, '', {
      fontFamily: 'Arial Black, system-ui', fontSize: '11px', color: '#fff2c4', align: 'center', wordWrap: { width: 360 },
    }).setOrigin(0.5);
    this.enemyStatusLabel = this.add.text(735, 408, 'RONNY · STABIL', {
      fontFamily: 'Arial Black, system-ui', fontSize: '11px', color: '#ffc1b4', align: 'center', wordWrap: { width: 360 },
    }).setOrigin(0.5);
    this.arena.add([this.playerBar, this.enemyBar, this.statusLabel, this.enemyStatusLabel]);

    this.log = this.add.text(480, 465, 'Zustände aus der offenen Welt wirken direkt auf Kraft, Präzision, Verteidigung und Reaktionszeit.', {
      fontFamily: 'system-ui', fontSize: '16px', color: '#f8f2df', align: 'center', wordWrap: { width: 790 }, backgroundColor: '#101923dd', padding: { x: 18, y: 12 },
    }).setOrigin(0.5);
    this.arena.add(this.log);

    this.arena.add([
      this.addButton(135, 565, 'Trockener Konter', () => this.playerTurn('counter')),
      this.addButton(375, 565, 'Stuhl-Blockade', () => this.playerTurn('guard')),
      this.addButton(610, 565, 'Team-Zuruf', () => this.playerTurn('rally')),
      this.addButton(825, 565, 'Rückzug', () => this.withdraw(), true),
    ]);
    this.updateUi(snapshot);
  }

  private drawCombatant(x: number, y: number, texture: string, label: string, accent: string): Phaser.GameObjects.Container {
    const shadow = this.add.ellipse(8, 78, 182, 58, 0x03080c, 0.35);
    const ring = this.add.circle(0, 10, 91, 0x07151c, 0.46).setStrokeStyle(4, Phaser.Display.Color.HexStringToColor(accent).color, 0.42);
    const portrait = this.add.image(0, 0, texture).setScale(3.2);
    const name = this.add.text(0, -105, label, { fontFamily: 'system-ui', fontSize: '21px', fontStyle: 'bold', color: accent }).setOrigin(0.5);
    return this.add.container(x, y, [shadow, ring, portrait, name]);
  }

  private applyBodyAnimation(group: Phaser.GameObjects.Container, snapshot: ReturnType<typeof gameStore.snapshot>): void {
    const visuals = statusVisuals(snapshot.needs);
    if (visuals.sway > 0) {
      this.tweens.add({ targets: group, angle: { from: -2.2 * visuals.sway, to: 2.2 * visuals.sway }, x: `+=${4 * visuals.sway}`, duration: 880, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
    }
    if (snapshot.needs.highness >= 30) {
      const ghost = this.add.image(group.x - 8, group.y + 2, 'player').setScale(3.2).setAlpha(0.13).setTint(0xb99ce8);
      this.arena.add(ghost);
      this.tweens.add({ targets: ghost, x: group.x + 10, alpha: { from: 0.06, to: 0.2 }, duration: 1100, yoyo: true, repeat: -1 });
    }
  }

  private makeBar(x: number, y: number, width: number, height: number, color: number): Phaser.GameObjects.Rectangle {
    const frame = this.add.rectangle(x + width / 2, y, width + 12, height + 12, 0x07151c, 0.92).setStrokeStyle(2, 0xfff1c7, 0.2);
    this.arena.add(frame);
    return this.add.rectangle(x, y, width, height, color, 1).setOrigin(0, 0.5);
  }

  private addButton(x: number, y: number, label: string, action: () => void, danger = false): Phaser.GameObjects.Text {
    const button = this.add.text(x, y, label, {
      fontFamily: 'system-ui', fontSize: danger ? '14px' : '16px', fontStyle: 'bold', color: '#173027', backgroundColor: danger ? '#ef8b72' : '#f4d47b', padding: { x: danger ? 12 : 17, y: 13 },
    }).setOrigin(0.5).setStroke('#fff2c4', 1).setInteractive({ useHandCursor: true });
    button.on('pointerover', () => button.setScale(1.04));
    button.on('pointerout', () => button.setScale(1));
    button.on('pointerdown', action);
    return button;
  }

  private drawArena(graphics: Phaser.GameObjects.Graphics): void {
    graphics.fillStyle(0x040b10, 0.38).fillRect(0, 470, 960, 170);
    graphics.fillStyle(0xbda56f, 0.16).fillEllipse(480, 382, 720, 178);
    graphics.lineStyle(3, 0xf4c75d, 0.3).strokeEllipse(480, 382, 720, 178);
    graphics.lineStyle(2, 0xfff0ba, 0.28).beginPath().moveTo(0, 128);
    for (let x = 0; x <= 960; x += 80) graphics.lineTo(x, 142 + ((x / 80) % 2) * 18);
    graphics.strokePath();
  }

  private playerTurn(action: AdvancedCombatAction): void {
    if (this.locked) return;
    this.locked = true;
    const snapshot = gameStore.snapshot();
    const result = resolveAdvancedCombatRound(this.combat, action, snapshot);
    this.combat = result.state;
    this.log.setText(result.log);
    this.roundLabel.setText(`Runde ${this.combat.round} · Treffer ${result.chance}%`);
    this.updateUi(snapshot);
    if (result.finished === 'victory') return void this.time.delayedCall(900, () => this.victory());
    if (result.finished === 'defeat') return void this.time.delayedCall(1000, () => this.defeat());
    const delay = 620 + statusVisuals(snapshot.needs).delayMs;
    this.time.delayedCall(delay, () => { this.locked = false; });
  }

  private updateUi(snapshot: ReturnType<typeof gameStore.snapshot>): void {
    this.playerBar?.setScale(this.combat.playerResolve / this.combat.playerMaxResolve, 1);
    this.enemyBar?.setScale(this.combat.enemyResolve / this.combat.enemyMaxResolve, 1);
    const labels = combatStatusLabels(snapshot, this.combat);
    this.statusLabel?.setText(labels.length ? labels.join(' · ') : 'STABIL');
    const enemy = this.combat.enemyEffects.map((effect) => effect.id.toUpperCase());
    this.enemyStatusLabel?.setText(enemy.length ? `RONNY · ${enemy.join(' · ')}` : 'RONNY · STABIL');
  }

  private victory(): void {
    gameStore.recordActivity('battle', true);
    this.log.setText('Sieg. Ronny verliert die Diskussion; die aktive Freundesgruppe bleibt weiterhin auf maximal drei Partner begrenzt.');
    this.time.delayedCall(1700, () => this.returnToWorld());
  }

  private defeat(): void {
    gameStore.recordActivity('battle', false);
    this.log.setText('Niederlage. Die außerhalb des Kampfes aufgebauten Zustände bleiben bestehen und müssen aktiv stabilisiert werden.');
    this.time.delayedCall(1600, () => this.returnToWorld());
  }

  private withdraw(): void {
    if (this.locked) return;
    this.locked = true;
    gameStore.recordActivity('battle', false);
    this.log.setText('Taktischer Rückzug. Der Zustand wird dadurch nicht automatisch geheilt.');
    this.time.delayedCall(1000, () => this.returnToWorld());
  }

  private returnToWorld(): void {
    gameStore.setMode('world');
    this.scene.start('world');
  }
}
