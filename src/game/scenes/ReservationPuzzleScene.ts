import Phaser from 'phaser';
import { gameStore } from '../state/GameStore';
import { addCinematicFrame } from '../visuals';

interface ReservationChoice {
  id: string;
  title: string;
  detail: string;
  correct: boolean;
  failure: string;
}

const CHOICES: ReservationChoice[] = [
  {
    id: 'tiefenrausch',
    title: 'Tauchgruppe Tiefenrausch',
    detail: 'Taucherplatz · 3 Personen · 2 Zelte · ohne Strom',
    correct: true,
    failure: '',
  },
  {
    id: 'familie-kokos',
    title: 'Familie Kokos',
    detail: 'Komfortwiese · 2 Personen · 1 Zelt · mit Strom',
    correct: false,
    failure: 'Die Quittung trägt zwar Kokosflecken, aber die Initialen T.T. passen nicht.',
  },
  {
    id: 'echter-name',
    title: 'André & Freunde',
    detail: 'Nordlager · 9 Personen · 5 Zelte · mit Strom',
    correct: false,
    failure: 'Zu ehrlich. Unter dem echten Namen wurde dieses Jahr ausdrücklich nichts reserviert.',
  },
  {
    id: 'aldimania',
    title: 'Aldimania Betriebssport',
    detail: 'Stellplatz 4 · 4 Personen · 2 Zelte · ohne Strom',
    correct: false,
    failure: 'Stellplatz 4 ist Ulis Parkplatz, kein Taucherplatz. Außerdem fehlt das zweite T.',
  },
];

export class ReservationPuzzleScene extends Phaser.Scene {
  private feedback!: Phaser.GameObjects.Text;
  private solved = false;

  constructor() {
    super('reservation-puzzle');
  }

  create(): void {
    gameStore.setMode('battle');
    this.cameras.main.setBackgroundColor('#0b1717');
    const background = this.add.graphics();
    background.fillGradientStyle(0x102b2a, 0x183d39, 0x3f2c25, 0x171c1d, 1).fillRect(0, 0, 960, 640);

    this.add.text(480, 38, 'ANKUNFT · RESERVIERUNGSARCHÄOLOGIE', {
      fontFamily: 'Arial Black, system-ui', fontSize: '13px', color: '#66dac6', letterSpacing: 2,
    }).setOrigin(0.5);
    this.add.text(480, 77, 'Unter welchem Namen wurde diesmal reserviert?', {
      fontFamily: 'Arial Black, system-ui', fontSize: '28px', color: '#fff2c4', stroke: '#173027', strokeThickness: 5,
    }).setOrigin(0.5);

    const clues = [
      'Zerknitterter Zettel im Kofferraum: Initialen „T.T.“',
      'Handschriftlicher Zusatz: „Wieder Taucherplatz – da ist am meisten Platz.“',
      'Buchungsumfang: 3 Personen, 2 Zelte, ausdrücklich kein Strom',
      'Gundulas Brett enthält mehrere frühere Aliasnamen der Gruppe.',
    ];
    this.add.rectangle(480, 155, 820, 116, 0x0b1918, 0.9).setStrokeStyle(2, 0xf4c75d, 0.45).setDepth(1);
    clues.forEach((clue, index) => this.add.text(95, 116 + index * 25, `• ${clue}`, {
      fontFamily: 'system-ui', fontSize: '15px', color: index === 3 ? '#d8b7ff' : '#e9eadb',
    }).setDepth(2));

    CHOICES.forEach((choice, index) => this.addChoice(choice, index));
    this.feedback = this.add.text(480, 580, 'Wähle die einzige Reservierung, zu der alle Hinweise passen.', {
      fontFamily: 'system-ui', fontSize: '16px', color: '#f4d47b', align: 'center', wordWrap: { width: 780 },
      backgroundColor: '#101923e8', padding: { x: 14, y: 9 },
    }).setOrigin(0.5);
    addCinematicFrame(this, 0x66dac6);
  }

  private addChoice(choice: ReservationChoice, index: number): void {
    const column = index % 2;
    const row = Math.floor(index / 2);
    const x = column ? 705 : 255;
    const y = 320 + row * 145;
    const card = this.add.rectangle(x, y, 400, 112, 0x173027, 0.95)
      .setStrokeStyle(2, 0xf4d47b, 0.42)
      .setInteractive({ useHandCursor: true });
    const title = this.add.text(x, y - 23, choice.title, {
      fontFamily: 'Arial Black, system-ui', fontSize: '18px', color: '#fff3c8', align: 'center',
    }).setOrigin(0.5);
    const detail = this.add.text(x, y + 19, choice.detail, {
      fontFamily: 'system-ui', fontSize: '14px', color: '#bcd6c9', align: 'center', wordWrap: { width: 350 },
    }).setOrigin(0.5);

    card.on('pointerover', () => [card, title, detail].forEach((item) => item.setScale(1.025)));
    card.on('pointerout', () => [card, title, detail].forEach((item) => item.setScale(1)));
    card.on('pointerdown', () => this.choose(choice, card));
  }

  private choose(choice: ReservationChoice, card: Phaser.GameObjects.Rectangle): void {
    if (this.solved) return;
    if (!choice.correct) {
      card.setFillStyle(0x6b2f32, 0.96).setStrokeStyle(3, 0xef765f, 0.8);
      const wrongFlag = `reservationWrong-${choice.id}`;
      if (!gameStore.snapshot().flags[wrongFlag]) {
        gameStore.setFlag(wrongFlag);
        gameStore.advanceMinutes(2);
      }
      this.feedback.setColor('#ffb0a1').setText(choice.failure);
      this.cameras.main.shake(180, 0.004);
      return;
    }

    this.solved = true;
    card.setFillStyle(0x285d46, 1).setStrokeStyle(4, 0x79d39a, 0.95);
    gameStore.setFlag('reservationSolved');
    gameStore.setFlag('reservationAliasTiefenrausch');
    gameStore.advanceMinutes(4);
    this.feedback.setColor('#a9f0bd').setText('Treffer: Tauchgruppe Tiefenrausch. Gundula hat die Reservierung nur unter dem Namen abgelegt, den niemand laut aussprechen wollte.');
    this.cameras.main.flash(350, 121, 211, 154, false);
    this.time.delayedCall(1500, () => this.returnToWorld());
  }

  private returnToWorld(): void {
    gameStore.setMode('world');
    this.scene.start('world');
  }
}
