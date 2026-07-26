import Phaser from 'phaser';
import {
  createCombatState,
  resolveCombatRound,
  type CombatAction,
  type CombatState,
} from '../combat';
import { gameStore } from '../state/GameStore';

export class BattleScene extends Phaser.Scene {
  private combat!: CombatState;
  private enemyBar!: Phaser.GameObjects.Rectangle;
  private playerBar!: Phaser.GameObjects.Rectangle;
  private log!: Phaser.GameObjects.Text;
  private roundLabel!: Phaser.GameObjects.Text;
  private locked = false;

  constructor() {
    super('battle');
  }

  create(): void {
    gameStore.setMode('battle');
    const snapshot = gameStore.snapshot();
    this.combat = createCombatState(snapshot);
    this.cameras.main.setBackgroundColor('#1b2735');

    const background = this.add.graphics();
    background.fillGradientStyle(0x173044, 0x173044, 0x684a36, 0x684a36, 1);
    background.fillRect(0, 0, 960, 640);
    background.fillStyle(0xe4c27a, 0.18);
    for (let i = 0; i < 18; i += 1) {
      background.fillCircle(Phaser.Math.Between(0, 960), Phaser.Math.Between(0, 640), Phaser.Math.Between(2, 6));
    }

    this.add.text(480, 42, 'CAMPING-DUELL', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '34px',
      fontStyle: 'bold',
      color: '#fff2c4',
    }).setOrigin(0.5);

    this.roundLabel = this.add.text(480, 82, 'Runde 1', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '15px',
      color: '#d7ccb0',
    }).setOrigin(0.5);

    this.drawCombatant(225, 255, 'player', snapshot.profile?.name ?? 'Du', '#78cfa4');
    this.drawCombatant(735, 255, 'rival', 'Rivalen-Ronny', '#ef8b72');

    const support = snapshot.team.length
      ? snapshot.team.map((member) => `${member.name}: ${member.role}`).join(' · ')
      : 'Noch kein Begleiter: Team-Zuruf ist entsprechend schwach.';
    this.add.text(225, 330, support, {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '13px',
      color: '#bcd2c7',
      align: 'center',
      wordWrap: { width: 330 },
    }).setOrigin(0.5);

    this.playerBar = this.makeBar(145, 375, 160, 18, 0x67d69a);
    this.enemyBar = this.makeBar(655, 375, 160, 18, 0xef765f);
    this.updateBars();

    this.log = this.add.text(480, 445, 'Ronny blockiert den Weg. Zustand, Würde und Gruppenrollen bestimmen deine tatsächliche Standfestigkeit.', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '17px',
      color: '#f8f2df',
      align: 'center',
      wordWrap: { width: 760 },
      backgroundColor: '#101923dd',
      padding: { x: 18, y: 14 },
    }).setOrigin(0.5);

    this.addButton(135, 555, 'Trockener Konter', () => this.playerTurn('counter'));
    this.addButton(375, 555, 'Stuhl-Blockade', () => this.playerTurn('guard'));
    this.addButton(610, 555, 'Team-Zuruf', () => this.playerTurn('rally'));
    this.addButton(825, 555, 'Rückzug', () => this.withdraw());
  }

  private drawCombatant(x: number, y: number, texture: string, label: string, accent: string): void {
    this.add.circle(x, y + 62, 82, 0x0c1218, 0.35);
    this.add.image(x, y, texture).setScale(3.2);
    this.add.text(x, y - 105, label, {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '21px',
      fontStyle: 'bold',
      color: accent,
    }).setOrigin(0.5);
  }

  private makeBar(x: number, y: number, width: number, height: number, color: number): Phaser.GameObjects.Rectangle {
    this.add.rectangle(x + width / 2, y, width + 8, height + 8, 0x10161c, 0.9);
    return this.add.rectangle(x, y, width, height, color, 1).setOrigin(0, 0.5);
  }

  private addButton(x: number, y: number, label: string, action: () => void): void {
    const button = this.add.text(x, y, label, {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '16px',
      fontStyle: 'bold',
      color: '#173027',
      backgroundColor: '#f4d47b',
      padding: { x: 16, y: 12 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    button.on('pointerover', () => button.setScale(1.04));
    button.on('pointerout', () => button.setScale(1));
    button.on('pointerdown', action);
  }

  private playerTurn(action: CombatAction): void {
    if (this.locked) return;
    this.locked = true;

    const result = resolveCombatRound(this.combat, action, gameStore.snapshot());
    this.combat = result.state;
    this.log.setText(result.log);
    this.roundLabel.setText(`Runde ${this.combat.round}`);
    this.updateBars();

    if (result.finished === 'victory') {
      this.time.delayedCall(900, () => this.victory());
      return;
    }
    if (result.finished === 'defeat') {
      this.time.delayedCall(1000, () => this.defeat());
      return;
    }

    this.time.delayedCall(650, () => {
      this.locked = false;
    });
  }

  private victory(): void {
    gameStore.recordActivity('battle', true);
    this.log.setText('Sieg. Ronny respektiert deine Standfestigkeit und verstärkt die Gruppe als Diskutierer.');
    this.time.delayedCall(1700, () => this.returnToWorld());
  }

  private defeat(): void {
    gameStore.recordActivity('battle', false);
    this.log.setText('Deine Gruppe zieht sich zum Getränkevorrat zurück. Die Quest bleibt offen, die Folgen nicht.');
    this.time.delayedCall(1600, () => this.returnToWorld());
  }

  private withdraw(): void {
    if (this.locked) return;
    this.locked = true;
    gameStore.recordActivity('battle', false);
    this.log.setText('Taktischer Rückzug. Würde und Momentum zahlen die Rechnung.');
    this.time.delayedCall(1000, () => this.returnToWorld());
  }

  private updateBars(): void {
    this.playerBar.setScale(this.combat.playerResolve / this.combat.playerMaxResolve, 1);
    this.enemyBar.setScale(this.combat.enemyResolve / this.combat.enemyMaxResolve, 1);
  }

  private returnToWorld(): void {
    gameStore.setMode('world');
    this.scene.start('world');
  }
}
