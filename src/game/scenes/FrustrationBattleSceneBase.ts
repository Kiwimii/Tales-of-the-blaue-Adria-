import Phaser from 'phaser';
import { COMBAT_OPPONENTS, equippedCombatMoves, type CombatOpponentId } from '../combatMoves';
import {
  createFrustrationCombatState,
  frustrationStatusLabels,
  resolveFrustrationRound,
  type FrustrationCombatState,
} from '../frustrationCombat';
import { playBattleIntro } from '../battleIntro';
import { gameStore } from '../state/GameStore';
import { activeStatuses, statusVisuals } from '../statusSystem';
import type { CombatMoveId, GameSnapshot } from '../types';
import { addCinematicFrame } from '../visuals';

export abstract class FrustrationBattleSceneBase extends Phaser.Scene {
  private combat!: FrustrationCombatState;
  private playerBar!: Phaser.GameObjects.Rectangle;
  private enemyBar!: Phaser.GameObjects.Rectangle;
  private playerValue!: Phaser.GameObjects.Text;
  private enemyValue!: Phaser.GameObjects.Text;
  private log!: Phaser.GameObjects.Text;
  private roundLabel!: Phaser.GameObjects.Text;
  private playerStatus!: Phaser.GameObjects.Text;
  private enemyStatus!: Phaser.GameObjects.Text;
  private arena!: Phaser.GameObjects.Container;
  private locked = true;

  protected constructor(
    key: string,
    private readonly opponentId: CombatOpponentId,
    private readonly heading: string,
    private readonly battleTitle: string,
  ) {
    super(key);
  }

  create(): void {
    gameStore.setMode('battle');
    const snapshot = gameStore.snapshot();
    this.combat = createFrustrationCombatState(snapshot, this.opponentId);
    this.cameras.main.setBackgroundColor('#07151c');
    this.arena = this.add.container(0, 0).setAlpha(0);
    this.buildArena(snapshot);
    addCinematicFrame(this, this.opponentId === 'entry-authority' ? 0xf4c75d : 0xef685c);
    playBattleIntro(this, this.opponentId, snapshot, () => this.unlockArena());
    this.time.delayedCall(3200, () => this.unlockArena());
  }

  protected abstract onVictory(): void;
  protected abstract onDefeat(): void;
  protected abstract onWithdraw(): void;

  protected showFinalMessage(text: string, delay = 1600): void {
    this.log.setText(text);
    this.time.delayedCall(delay, () => this.returnToWorld());
  }

  protected returnToWorld(): void {
    gameStore.setMode('world');
    this.scene.start('world');
  }

  private unlockArena(): void {
    if (!this.arena?.active) return;
    this.tweens.killTweensOf(this.arena);
    this.arena.setAlpha(1);
    this.locked = false;
  }

  private buildArena(snapshot: GameSnapshot): void {
    const opponent = COMBAT_OPPONENTS[this.opponentId];
    const background = this.add.graphics();
    background.fillGradientStyle(0x071c2a, 0x173a3c, 0x42222d, 0x6b382a, 1).fillRect(0, 0, 960, 640);
    background.fillStyle(0x050b0f, 0.52).fillRect(0, 470, 960, 170);
    background.fillStyle(0xc4aa70, 0.14).fillEllipse(480, 374, 760, 180);
    background.lineStyle(3, 0xf4c75d, 0.28).strokeEllipse(480, 374, 760, 180);
    this.arena.add(background);

    const heading = this.add.text(480, 21, this.heading, {
      fontFamily: 'Arial Black, system-ui', fontSize: '11px', color: '#66dac6', letterSpacing: 2,
    }).setOrigin(0.5);
    const title = this.add.text(480, 52, this.battleTitle, {
      fontFamily: 'Arial Black, system-ui', fontSize: '31px', color: '#fff2c4', stroke: '#461820', strokeThickness: 5,
    }).setOrigin(0.5);
    this.roundLabel = this.add.text(480, 91, 'Runde 1 · Ziel: Gegner vollständig frustrieren', {
      fontFamily: 'system-ui', fontSize: '13px', fontStyle: 'bold', color: '#fff0c0', backgroundColor: '#07151fe8', padding: { x: 12, y: 5 },
    }).setOrigin(0.5);
    this.arena.add([heading, title, this.roundLabel]);

    const player = this.drawPlayer(215, 230, snapshot);
    const enemy = this.opponentId === 'entry-authority'
      ? this.drawAuthority(745, 230)
      : this.drawCombatant(745, 230, 'rival', opponent.name, '#ef8b72');
    this.arena.add([player, enemy]);
    this.applyBodyAnimation(player, snapshot);

    const opponentInfo = this.add.text(745, 335, `${opponent.title}\nEigenschaften: ${opponent.traits.join(' · ')}`, {
      fontFamily: 'system-ui', fontSize: '12px', color: '#edc9c2', align: 'center', wordWrap: { width: 370 },
    }).setOrigin(0.5);
    const loadout = equippedCombatMoves(snapshot);
    const loadoutInfo = this.add.text(215, 335, `Ausgerüstet ${loadout.length}/4\n${loadout.map((move) => move.shortLabel).join(' · ')}`, {
      fontFamily: 'system-ui', fontSize: '12px', color: '#bed7ca', align: 'center', wordWrap: { width: 370 },
    }).setOrigin(0.5);
    this.arena.add([opponentInfo, loadoutInfo]);

    this.playerBar = this.makeBar(125, 382, 180, 18, 0xf0b44e);
    this.enemyBar = this.makeBar(655, 382, 180, 18, 0xef685c);
    this.playerValue = this.add.text(215, 382, '', { fontFamily: 'Arial Black, system-ui', fontSize: '11px', color: '#fff7df' }).setOrigin(0.5);
    this.enemyValue = this.add.text(745, 382, '', { fontFamily: 'Arial Black, system-ui', fontSize: '11px', color: '#fff7df' }).setOrigin(0.5);
    this.playerStatus = this.add.text(215, 410, '', { fontFamily: 'Arial Black, system-ui', fontSize: '10px', color: '#ffe8a7', align: 'center', wordWrap: { width: 370 } }).setOrigin(0.5);
    this.enemyStatus = this.add.text(745, 410, '', { fontFamily: 'Arial Black, system-ui', fontSize: '10px', color: '#ffc1b4', align: 'center', wordWrap: { width: 370 } }).setOrigin(0.5);
    this.arena.add([this.playerBar, this.enemyBar, this.playerValue, this.enemyValue, this.playerStatus, this.enemyStatus]);

    this.log = this.add.text(480, 463, 'Frustpunkte steigen durch Treffer. Bei maximalem Frust ist die Auseinandersetzung verloren.', {
      fontFamily: 'system-ui', fontSize: '15px', color: '#f8f2df', align: 'center', wordWrap: { width: 820 }, backgroundColor: '#101923e8', padding: { x: 16, y: 10 },
    }).setOrigin(0.5);
    this.arena.add(this.log);

    const positions = buttonPositions(loadout.length);
    loadout.forEach((move, index) => {
      this.arena.add(this.addMoveButton(positions[index], 558, move.shortLabel, move.id));
    });
    const withdraw = this.add.text(886, 105, 'Rückzug', {
      fontFamily: 'system-ui', fontSize: '12px', fontStyle: 'bold', color: '#35151a', backgroundColor: '#ef8b72', padding: { x: 10, y: 7 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    withdraw.on('pointerup', () => this.withdraw());
    this.arena.add(withdraw);
    this.updateUi(snapshot);
  }

  private drawPlayer(x: number, y: number, snapshot: GameSnapshot): Phaser.GameObjects.Container {
    return this.drawCombatant(x, y, 'player', snapshot.profile?.name ?? 'Du', '#78cfa4');
  }

  private drawCombatant(x: number, y: number, texture: string, label: string, accent: string): Phaser.GameObjects.Container {
    return this.add.container(x, y, [
      this.add.ellipse(7, 73, 180, 55, 0x03080c, 0.36),
      this.add.circle(0, 0, 84, 0x07151c, 0.5).setStrokeStyle(4, Phaser.Display.Color.HexStringToColor(accent).color, 0.48),
      this.add.image(0, 0, texture).setScale(3.05),
      this.add.text(0, -101, label, { fontFamily: 'system-ui', fontSize: '20px', fontStyle: 'bold', color: accent }).setOrigin(0.5),
    ]);
  }

  private drawAuthority(x: number, y: number): Phaser.GameObjects.Container {
    return this.add.container(x, y, [
      this.add.ellipse(5, 73, 214, 56, 0x03080c, 0.38),
      this.add.circle(0, 0, 88, 0x351d24, 0.62).setStrokeStyle(4, 0xef8b72, 0.5),
      this.add.image(-38, 4, 'npc-gundula').setScale(2.55),
      this.add.image(42, 4, 'npc-uli').setScale(2.55),
      this.add.text(0, -104, 'Gundula & Uli', { fontFamily: 'system-ui', fontSize: '20px', fontStyle: 'bold', color: '#ef8b72' }).setOrigin(0.5),
    ]);
  }

  private applyBodyAnimation(group: Phaser.GameObjects.Container, snapshot: GameSnapshot): void {
    const visuals = statusVisuals(snapshot.needs);
    if (visuals.sway > 0) {
      this.tweens.add({ targets: group, angle: { from: -2 * visuals.sway, to: 2 * visuals.sway }, x: `+=${4 * visuals.sway}`, duration: 880, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
    }
  }

  private makeBar(x: number, y: number, width: number, height: number, color: number): Phaser.GameObjects.Rectangle {
    const frame = this.add.rectangle(x + width / 2, y, width + 12, height + 12, 0x07151c, 0.94).setStrokeStyle(2, 0xfff1c7, 0.24);
    this.arena.add(frame);
    return this.add.rectangle(x, y, width, height, color, 1).setOrigin(0, 0.5).setScale(0, 1);
  }

  private addMoveButton(x: number, y: number, label: string, moveId: CombatMoveId): Phaser.GameObjects.Text {
    const button = this.add.text(x, y, label, {
      fontFamily: 'system-ui', fontSize: '14px', fontStyle: 'bold', color: '#173027', backgroundColor: '#f4d47b', padding: { x: 13, y: 12 }, align: 'center', fixedWidth: 205,
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    button.on('pointerover', () => button.setScale(1.035));
    button.on('pointerout', () => button.setScale(1));
    button.on('pointerup', () => this.playerTurn(moveId));
    return button;
  }

  private playerTurn(moveId: CombatMoveId): void {
    if (this.locked) return;
    this.locked = true;
    const snapshot = gameStore.snapshot();
    const result = resolveFrustrationRound(this.combat, moveId, snapshot);
    this.combat = result.state;
    this.log.setText(result.log);
    this.roundLabel.setText(`Runde ${this.combat.round} · ${result.chance}% · ${result.effectivenessLabel}`);
    this.updateUi(snapshot);
    if (result.finished === 'victory') return void this.time.delayedCall(850, () => this.onVictory());
    if (result.finished === 'defeat') return void this.time.delayedCall(900, () => this.onDefeat());
    this.time.delayedCall(520 + statusVisuals(snapshot.needs).delayMs, () => { this.locked = false; });
  }

  private withdraw(): void {
    if (this.locked) return;
    this.locked = true;
    this.onWithdraw();
  }

  private updateUi(snapshot: GameSnapshot): void {
    const playerRatio = this.combat.playerFrustration / this.combat.playerMaxFrustration;
    const enemyRatio = this.combat.enemyFrustration / this.combat.enemyMaxFrustration;
    this.playerBar?.setScale(playerRatio, 1);
    this.enemyBar?.setScale(enemyRatio, 1);
    this.playerValue?.setText(`FRUSTPUNKTE ${this.combat.playerFrustration}/${this.combat.playerMaxFrustration}`);
    this.enemyValue?.setText(`FRUSTPUNKTE ${this.combat.enemyFrustration}/${this.combat.enemyMaxFrustration}`);
    const body = activeStatuses(snapshot.needs).map((status) => status.shortLabel);
    const playerEffects = frustrationStatusLabels(this.combat.playerStatuses);
    const enemyEffects = frustrationStatusLabels(this.combat.enemyStatuses);
    this.playerStatus?.setText([...body, ...playerEffects].slice(0, 4).join(' · ') || 'STABIL');
    this.enemyStatus?.setText(enemyEffects.join(' · ') || 'NOCH NICHT FRUSTRIERT');
  }
}

function buttonPositions(count: number): number[] {
  if (count <= 1) return [480];
  if (count === 2) return [350, 610];
  if (count === 3) return [220, 480, 740];
  return [120, 360, 600, 840];
}
