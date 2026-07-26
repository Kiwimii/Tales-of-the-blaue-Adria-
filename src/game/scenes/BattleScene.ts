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
    this.cameras.main.setBackgroundColor('#07151c');

    const background = this.add.graphics();
    background.fillGradientStyle(0x071c2a, 0x12363e, 0x40212b, 0x733728, 1);
    background.fillRect(0, 0, 960, 640);
    this.drawArena(background);

    this.add.text(480, 24, 'HAUPTWEG · UNGEFRAGTE MEISTERSCHAFT', {
      fontFamily: 'Arial, system-ui, sans-serif',
      fontSize: '11px',
      fontStyle: 'bold',
      letterSpacing: 3,
      color: '#66dac6',
    }).setOrigin(0.5);
    this.add.text(480, 55, 'CAMPING-DUELL', {
      fontFamily: 'Arial Black, system-ui, sans-serif',
      fontSize: '34px',
      fontStyle: 'bold',
      color: '#fff2c4',
      stroke: '#461820',
      strokeThickness: 5,
    }).setOrigin(0.5);

    this.roundLabel = this.add.text(480, 94, 'Runde 1', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '15px',
      fontStyle: 'bold',
      color: '#fff0c0',
      backgroundColor: '#07151fe0',
      padding: { x: 14, y: 6 },
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
    this.add.ellipse(x + 8, y + 78, 182, 58, 0x03080c, 0.35);
    this.add.circle(x, y + 10, 91, 0x07151c, 0.46)
      .setStrokeStyle(4, Phaser.Display.Color.HexStringToColor(accent).color, 0.42);
    this.add.circle(x, y + 10, 78, 0xffffff, 0.025);
    this.add.image(x, y, texture).setScale(3.2);
    this.add.text(x, y - 105, label, {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '21px',
      fontStyle: 'bold',
      color: accent,
    }).setOrigin(0.5);
  }

  private makeBar(x: number, y: number, width: number, height: number, color: number): Phaser.GameObjects.Rectangle {
    this.add.rectangle(x + width / 2, y, width + 12, height + 12, 0x07151c, 0.92)
      .setStrokeStyle(2, 0xfff1c7, 0.2);
    const bar = this.add.rectangle(x, y, width, height, color, 1).setOrigin(0, 0.5);
    this.add.rectangle(x + width / 2, y - 4, width, 4, 0xffffff, 0.12);
    return bar;
  }

  private addButton(x: number, y: number, label: string, action: () => void): void {
    const button = this.add.text(x, y, label, {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '16px',
      fontStyle: 'bold',
      color: '#173027',
      backgroundColor: label === 'Rückzug' ? '#ef8b72' : '#f4d47b',
      padding: { x: 17, y: 13 },
    }).setOrigin(0.5)
      .setStroke('#fff2c4', 1)
      .setInteractive({ useHandCursor: true });

    button.on('pointerover', () => button.setScale(1.04));
    button.on('pointerout', () => button.setScale(1));
    button.on('pointerdown', action);
  }

  private drawArena(graphics: Phaser.GameObjects.Graphics): void {
    graphics.fillStyle(0x040b10, 0.38);
    graphics.fillRect(0, 470, 960, 170);
    graphics.fillStyle(0xbda56f, 0.16);
    graphics.fillEllipse(480, 382, 720, 178);
    graphics.lineStyle(3, 0xf4c75d, 0.3);
    graphics.strokeEllipse(480, 382, 720, 178);

    graphics.lineStyle(2, 0xfff0ba, 0.28);
    graphics.beginPath();
    graphics.moveTo(0, 128);
    for (let x = 0; x <= 960; x += 80) graphics.lineTo(x, 142 + ((x / 80) % 2) * 18);
    graphics.strokePath();
    const colors = [0xf4c75d, 0x66dac6, 0xef685c];
    for (let index = 0; index < 13; index += 1) {
      const x = 28 + index * 77;
      const y = 140 + (index % 2) * 18;
      graphics.fillStyle(colors[index % colors.length], 0.13);
      graphics.fillCircle(x, y, 21);
      graphics.fillStyle(colors[index % colors.length], 0.98);
      graphics.fillCircle(x, y, 6);
    }

    for (let index = 0; index < 12; index += 1) {
      const x = 18 + index * 86;
      graphics.fillStyle(0x03090d, 0.7);
      graphics.fillCircle(x, 488, 24);
      graphics.fillRoundedRect(x - 23, 507, 46, 118, 18);
    }
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
