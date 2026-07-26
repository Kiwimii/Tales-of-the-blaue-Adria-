import Phaser from 'phaser';
import type { GameSnapshot } from './types';

export type BattleOpponentId = 'ronny' | 'entry-authority';

interface IntroProfile {
  title: string;
  subtitle: string;
  accent: number;
  textures: string[];
  names: string[];
  phrases: string[];
}

const PROFILES: Record<BattleOpponentId, IntroProfile> = {
  ronny: {
    title: 'RIVALEN-RONNY',
    subtitle: 'Parkplatz-Philosoph fordert dich heraus',
    accent: 0xef765f,
    textures: ['rival'],
    names: ['RONNY'],
    phrases: [
      '„Ich erkläre dir das kurz.“',
      '„Du hast Haltung. Noch.“',
      '„Das ist kein Streit, das ist Weiterbildung.“',
      '„Ich habe dazu eine sehr klare Meinung und viel Zeit.“',
      '„Nach diesem Gespräch verstehst du Parkplätze anders.“',
    ],
  },
  'entry-authority': {
    title: 'GUNDULA & ULI',
    subtitle: 'Die Verwaltung setzt Klemmbrett und Maßband ein',
    accent: 0xf4c75d,
    textures: ['npc-gundula', 'npc-uli'],
    names: ['GUNDULA', 'ULI'],
    phrases: [
      '„Die Reservierung existiert nur unter Vorbehalt.“',
      '„Drei Personen. Ich sehe mehr Schuhe.“',
      '„Parkplatz vier bleibt Parkplatz vier.“',
      '„Batida ist kein amtliches Formular.“',
      '„Der Taucherplatz ist groß, unsere Geduld nicht.“',
    ],
  },
};

export function playBattleIntro(
  scene: Phaser.Scene,
  opponentId: BattleOpponentId,
  snapshot: GameSnapshot,
  onComplete: () => void,
): void {
  const profile = PROFILES[opponentId];
  const overlay = scene.add.container(0, 0).setDepth(500);
  const background = scene.add.rectangle(480, 320, 960, 640, 0x050b0d, 0.98);
  const upper = scene.add.rectangle(-300, 175, 1060, 230, profile.accent, 0.2).setAngle(-7);
  const lower = scene.add.rectangle(1260, 465, 1060, 230, 0x10251f, 0.96).setAngle(7);
  const flash = scene.add.rectangle(480, 320, 960, 8, 0xfff0ba, 0.85).setScale(0, 1);
  overlay.add([background, upper, lower, flash]);

  const portraits: Phaser.GameObjects.Image[] = [];
  profile.textures.forEach((texture, index) => {
    const offset = (index - (profile.textures.length - 1) / 2) * 155;
    const portrait = scene.add.image(1180 + offset, 265 + index * 18, texture).setScale(4.25).setAlpha(0);
    portraits.push(portrait);
    overlay.add(portrait);
  });

  const player = scene.add.image(-180, 405, 'player').setScale(4.1).setFlipX(true).setAlpha(0);
  const versus = scene.add.text(480, 310, 'VS', {
    fontFamily: 'Arial Black, system-ui', fontSize: '72px', color: '#fff0ba', stroke: '#481f25', strokeThickness: 9,
  }).setOrigin(0.5).setScale(0);
  const title = scene.add.text(480, 80, profile.title, {
    fontFamily: 'Arial Black, system-ui', fontSize: '42px', color: '#fff4d2', stroke: '#101817', strokeThickness: 7,
  }).setOrigin(0.5).setAlpha(0);
  const subtitle = scene.add.text(480, 126, profile.subtitle, {
    fontFamily: 'system-ui', fontSize: '16px', fontStyle: 'bold', color: '#c6d9cf', letterSpacing: 1,
  }).setOrigin(0.5).setAlpha(0);
  const phrase = scene.add.text(480, 555, '', {
    fontFamily: 'Arial Black, system-ui', fontSize: '22px', color: '#f4d47b', align: 'center', wordWrap: { width: 780 },
    backgroundColor: '#07151ce8', padding: { x: 18, y: 12 },
  }).setOrigin(0.5).setAlpha(0);
  const status = scene.add.text(480, 607, statusLead(snapshot), {
    fontFamily: 'system-ui', fontSize: '12px', color: '#a8c8bc', fontStyle: 'bold',
  }).setOrigin(0.5).setAlpha(0);
  overlay.add([player, versus, title, subtitle, phrase, status]);

  scene.tweens.add({ targets: upper, x: 480, duration: 420, ease: 'Power3.Out' });
  scene.tweens.add({ targets: lower, x: 480, duration: 420, ease: 'Power3.Out' });
  scene.tweens.add({ targets: player, x: 220, alpha: 1, duration: 560, ease: 'Back.Out' });
  portraits.forEach((portrait, index) => scene.tweens.add({ targets: portrait, x: 725 + (index - (portraits.length - 1) / 2) * 112, alpha: 1, duration: 560, delay: 80 * index, ease: 'Back.Out' }));
  scene.tweens.add({ targets: [title, subtitle, status], alpha: 1, duration: 380, delay: 220 });
  scene.tweens.add({ targets: versus, scale: 1, angle: { from: -20, to: 0 }, duration: 450, delay: 360, ease: 'Back.Out' });
  scene.tweens.add({ targets: flash, scaleX: 1, duration: 300, delay: 440, yoyo: true });

  const start = Math.abs(snapshot.day * 11 + Math.floor(snapshot.minutes / 10) + profile.title.length) % profile.phrases.length;
  let phraseIndex = 0;
  scene.time.addEvent({
    delay: 360,
    repeat: 3,
    callback: () => {
      phrase.setText(profile.phrases[(start + phraseIndex) % profile.phrases.length]).setAlpha(1).setScale(0.96);
      scene.tweens.add({ targets: phrase, scale: 1, duration: 160, ease: 'Back.Out' });
      phraseIndex += 1;
    },
  });

  scene.time.delayedCall(1880, () => {
    phrase.setText('KAMPF!').setFontSize(36);
    scene.cameras.main.shake(180, 0.006);
    scene.tweens.add({
      targets: overlay, alpha: 0, duration: 360, delay: 230,
      onComplete: () => { overlay.destroy(true); onComplete(); },
    });
  });
}

function statusLead(snapshot: GameSnapshot): string {
  if (snapshot.needs.alcohol >= 38) return 'STATUS: BESOFFEN · mehr Kraft, weniger Präzision';
  if (snapshot.needs.highness >= 30) return 'STATUS: BREIT · Reaktion verzögert';
  if (snapshot.needs.hangover >= 28) return 'STATUS: KATER · Energieverlust erhöht';
  return `STATUS: STABIL · aktive Partner ${snapshot.team.length}/3`;
}
