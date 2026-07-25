import Phaser from 'phaser';
import { gameStore } from '../state/GameStore';

export class BattleScene extends Phaser.Scene {
  private enemyResolve = 72;
  private playerResolve = 85;
  private enemyBar!: Phaser.GameObjects.Rectangle;
  private playerBar!: Phaser.GameObjects.Rectangle;
  private log!: Phaser.GameObjects.Text;
  private locked = false;

  constructor() {
    super('battle');
  }

  create(): void {
    gameStore.setMode('battle');
    this.cameras.main.setBackgroundColor('#1b2735');

    const background = this.add.graphics();
    background.fillGradientStyle(0x173044, 0x173044, 0x684a36, 0x684a36, 1);
    background.fillRect(0, 0, 960, 640);
    background.fillStyle(0xe4c27a, 0.18);
    for (let i = 0; i < 18; i += 1) background.fillCircle(Phaser.Math.Between(0, 960), Phaser.Math.Between(0, 640), Phaser.Math.Between(2, 6));

    this.add.text(480, 42, 'CAMPING-DUELL', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '34px',
      fontStyle: 'bold',
      color: '#fff2c4',
    }).setOrigin(0.5);

    this.drawCombatant(225, 255, 'player', gameStore.snapshot().profile?.name ?? 'Du', '#78cfa4');
    this.drawCombatant(735, 255, 'rival', 'Rivalen-Ronny', '#ef8b72');

    this.playerBar = this.makeBar(145, 365, 160, 18, 0x67d69a);
    this.enemyBar = this.makeBar(655, 365, 160, 18, 0xef765f);
    this.updateBars();

    this.log = this.add.text(480, 430, 'Rivalen-Ronny blockiert den Weg zum Strand. Dein Team muss Haltung zeigen.', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '18px',
      color: '#f8f2df',
      align: 'center',
      wordWrap: { width: 700 },
      backgroundColor: '#101923dd',
      padding: { x: 18, y: 14 },
    }).setOrigin(0.5);

    this.addButton(220, 540, 'Trockener Konter', () => this.playerTurn('counter'));
    this.addButton(480, 540, 'Campingstuhl-Blockade', () => this.playerTurn('guard'));
    this.addButton(740, 540, 'Zurückziehen', () => this.returnToWorld());
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
      fontSize: '17px',
      fontStyle: 'bold',
      color: '#173027',
      backgroundColor: '#f4d47b',
      padding: { x: 18, y: 12 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    button.on('pointerover', () => button.setScale(1.04));
    button.on('pointerout', () => button.setScale(1));
    button.on('pointerdown', action);
  }

  private playerTurn(action: 'counter' | 'guard'): void {
    if (this.locked) return;
    this.locked = true;

    const damage = action === 'counter' ? Phaser.Math.Between(15, 25) : Phaser.Math.Between(8, 14);
    this.enemyResolve = Math.max(0, this.enemyResolve - damage);
    this.log.setText(action === 'counter'
      ? `Du setzt einen trockenen Konter. Rivalen-Ronny verliert ${damage} Fassung.`
      : `Du errichtest eine Campingstuhl-Blockade. ${damage} Fassungsschaden und bessere Deckung.`);
    this.updateBars();

    if (this.enemyResolve <= 0) {
      this.time.delayedCall(700, () => this.victory());
      return;
    }

    this.time.delayedCall(900, () => {
      const retaliation = action === 'guard' ? Phaser.Math.Between(5, 10) : Phaser.Math.Between(10, 18);
      this.playerResolve = Math.max(0, this.playerResolve - retaliation);
      this.log.setText(`Rivalen-Ronny startet einen ungefragten Vortrag. Du verlierst ${retaliation} Fassung.`);
      this.updateBars();
      this.locked = false;

      if (this.playerResolve <= 0) {
        this.log.setText('Dein Team zieht sich taktisch zum Getränkevorrat zurück.');
        this.time.delayedCall(1200, () => this.returnToWorld());
      }
    });
  }

  private victory(): void {
    gameStore.setFlag('firstBattleWon');
    gameStore.recruit({
      id: 'rivalen-ronny',
      name: 'Ronny',
      role: 'Hartnäckiger Diskutierer',
      level: 2,
      resolve: 70,
      maxResolve: 70,
    });
    gameStore.advanceMinutes(25);
    this.log.setText('Sieg. Ronny respektiert deine Standfestigkeit und schließt sich deinem Team an.');
    this.time.delayedCall(1800, () => this.returnToWorld());
  }

  private updateBars(): void {
    this.playerBar.setScale(this.playerResolve / 85, 1);
    this.enemyBar.setScale(this.enemyResolve / 72, 1);
  }

  private returnToWorld(): void {
    gameStore.setMode('world');
    this.scene.start('world');
  }
}
