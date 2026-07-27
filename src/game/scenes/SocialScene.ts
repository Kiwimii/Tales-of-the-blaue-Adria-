import Phaser from 'phaser';
import { ITEMS, RELATIONSHIP_CHARACTERS } from '../content';
import { FRIEND_PROFILES, type FriendId } from '../friendRoster';
import {
  CONVERSATION_TOPICS,
  ROMANCE_PROFILES,
  canRecruit,
  conversationTopicOutcome,
  dynamicOpening,
  flirtChance,
  flirtReaction,
  giftReaction,
  type ConversationTopicId,
  type RomanceId,
} from '../socialSystem';
import { gameStore } from '../state/GameStore';
import { activeStatuses } from '../statusSystem';
import { adjustRelationship, consumeInventoryItem, toggleActiveTeamMember } from '../storeAdapter';
import { addCinematicFrame } from '../visuals';

interface SocialSceneData {
  characterId: string;
}

export class SocialScene extends Phaser.Scene {
  private characterId = '';
  private snapshot = gameStore.snapshot();
  private dialogue!: Phaser.GameObjects.Text;
  private relationLabel!: Phaser.GameObjects.Text;
  private teamLabel!: Phaser.GameObjects.Text;
  private optionContainer!: Phaser.GameObjects.Container;

  constructor() {
    super('social');
  }

  init(data: SocialSceneData): void {
    this.characterId = data.characterId;
  }

  create(): void {
    gameStore.setMode('interior');
    this.snapshot = gameStore.snapshot();
    const character = RELATIONSHIP_CHARACTERS.find((entry) => entry.id === this.characterId);
    if (!character) return void this.returnToWorld();

    const background = this.add.graphics();
    background.fillGradientStyle(0x0a1717, 0x183631, 0x37273d, 0x171c1d, 1).fillRect(0, 0, 960, 640);
    background.fillStyle(0x07120f, 0.42).fillRoundedRect(56, 60, 848, 510, 34);
    background.lineStyle(3, Phaser.Display.Color.HexStringToColor(character.color).color, 0.46).strokeRoundedRect(56, 60, 848, 510, 34);

    this.add.text(80, 30, 'GESPRÄCH · THEMEN, BEZIEHUNG, TEAM UND FLIRT', {
      fontFamily: 'Arial Black, system-ui', fontSize: '11px', color: '#66dac6', letterSpacing: 2,
    });
    this.add.circle(220, 235, 128, 0x0b1918, 0.85).setStrokeStyle(5, Phaser.Display.Color.HexStringToColor(character.color).color, 0.58);
    const portrait = this.add.image(220, 235, `npc-${character.id}`).setScale(4.8);
    const statuses = activeStatuses(this.snapshot.needs);
    if (this.snapshot.needs.alcohol >= 38) this.tweens.add({ targets: portrait, angle: { from: -2, to: 2 }, x: '+=4', duration: 900, yoyo: true, repeat: -1, ease: 'Sine.InOut' });

    this.add.text(220, 91, character.name, {
      fontFamily: 'Arial Black, system-ui', fontSize: '29px', color: character.color, stroke: '#07120f', strokeThickness: 6,
    }).setOrigin(0.5);
    this.add.text(220, 120, character.nickname, { fontFamily: 'system-ui', fontSize: '14px', fontStyle: 'bold', color: '#d4e0da' }).setOrigin(0.5);
    this.add.text(220, 390, statuses.length ? `Dein Zustand: ${statuses.map((status) => status.shortLabel).join(' · ')}` : 'Dein Zustand: STABIL', {
      fontFamily: 'Arial Black, system-ui', fontSize: '11px', color: statuses[0] ? `#${statuses[0].color.toString(16).padStart(6, '0')}` : '#9ed8b6', align: 'center', wordWrap: { width: 290 },
    }).setOrigin(0.5);

    this.relationLabel = this.add.text(220, 430, '', {
      fontFamily: 'system-ui', fontSize: '15px', fontStyle: 'bold', color: '#fff0ba', backgroundColor: '#173027cc', padding: { x: 10, y: 6 },
    }).setOrigin(0.5);
    this.teamLabel = this.add.text(220, 475, '', {
      fontFamily: 'system-ui', fontSize: '12px', color: '#c9d9d0', align: 'center', wordWrap: { width: 300 },
    }).setOrigin(0.5);

    this.dialogue = this.add.text(420, 105, dynamicOpening(this.characterId, this.snapshot), {
      fontFamily: 'system-ui', fontSize: '19px', color: '#f6f0df', wordWrap: { width: 420 }, lineSpacing: 7,
      backgroundColor: '#101923df', padding: { x: 18, y: 16 },
    });
    this.optionContainer = this.add.container(0, 0);
    this.buildOptions();
    this.refreshMeta();
    addCinematicFrame(this, Phaser.Display.Color.HexStringToColor(character.color).color);
  }

  private buildOptions(message?: string): void {
    this.optionContainer.removeAll(true);
    if (message) this.dialogue.setText(message);
    const romance = ROMANCE_PROFILES[this.characterId as RomanceId];
    const friend = FRIEND_PROFILES[this.characterId as FriendId];
    const buttons: Phaser.GameObjects.Text[] = [];

    buttons.push(this.button(440, 315, 'Gesprächsthema wählen', () => this.showConversationTopics(), false, false, 220));
    if (romance) {
      const chance = flirtChance(this.characterId, this.snapshot);
      buttons.push(this.button(690, 315, `Flirten · ${chance}%`, () => this.flirt(), false, false, 220));
    }
    buttons.push(this.button(440, 375, 'Geschenk auswählen', () => this.showGifts(), false, false, 220));
    if (friend) {
      const active = this.snapshot.team.some((member) => member.id === this.characterId);
      const label = active ? 'Aus Aktivteam nehmen' : canRecruit(this.characterId, this.snapshot) ? 'Ins Aktivteam holen' : `Team ab Beziehung ${friend.recruitmentThreshold}`;
      buttons.push(this.button(690, 375, label, () => this.toggleTeam(), !active && !canRecruit(this.characterId, this.snapshot), false, 220));
      if (this.characterId === 'masl' && (this.snapshot.relationships.masl ?? 0) >= 8) {
        buttons.push(this.button(565, 435, 'Minispiel: Komm ans Loch', () => this.startMaslGame(), false, false, 280));
      }
    }
    buttons.push(this.button(690, 515, 'Gespräch beenden', () => this.returnToWorld(), false, true, 220));
    this.optionContainer.add(buttons);
  }

  private showConversationTopics(): void {
    this.optionContainer.removeAll(true);
    const buttons = CONVERSATION_TOPICS.map((topic, index) => this.button(
      625,
      300 + index * 68,
      `${topic.label}\n${topic.hint}`,
      () => this.talk(topic.id),
      false,
      false,
      430,
      8,
    ));
    buttons.push(this.button(690, 515, 'Zurück', () => this.buildOptions(), false, true, 220));
    this.optionContainer.add(buttons);
  }

  private talk(topicId: ConversationTopicId): void {
    const outcome = conversationTopicOutcome(this.characterId, topicId, this.snapshot);
    const repeatFlag = `conversation-${this.characterId}-${topicId}-day-${this.snapshot.day}`;
    const repeated = Boolean(this.snapshot.flags[repeatFlag]);
    const relationship = repeated ? Math.max(0, Math.min(1, outcome.relationship)) : outcome.relationship;
    adjustRelationship(gameStore, this.characterId, relationship, `${this.characterId}: Gespräch über ${topicId} ${relationship >= 0 ? 'vertieft' : 'misslungen'}.`);
    if (!repeated) gameStore.setFlag(repeatFlag);
    gameStore.advanceMinutes(repeated ? 3 : outcome.minutes);
    this.reload(`${outcome.text}${repeated ? '\n\nIhr habt dieses Thema heute schon ausführlich besprochen. Die Beziehung wächst deshalb kaum noch.' : ''}`);
  }

  private flirt(): void {
    const attemptFlag = `flirt-${this.characterId}-day-${this.snapshot.day}`;
    if (this.snapshot.flags[attemptFlag]) {
      this.buildOptions('Ein zweiter Versuch am selben Tag wirkt nicht hartnäckig, sondern unaufmerksam.');
      return;
    }
    const chance = flirtChance(this.characterId, this.snapshot);
    const success = Math.floor(Math.random() * 100) + 1 <= chance;
    const delta = success ? 14 : -5;
    adjustRelationship(gameStore, this.characterId, delta, `${ROMANCE_PROFILES[this.characterId as RomanceId].name}: Flirt ${success ? 'positiv' : 'negativ'} reagiert.`);
    gameStore.setFlag(attemptFlag);
    if (success) gameStore.setFlag(`romance-spark-${this.characterId}`);
    gameStore.advanceMinutes(8);
    this.reload(`${flirtReaction(this.characterId, success, this.snapshot)}\n\nTrefferchance war ${chance}%. Flirten bleibt bewusst anspruchsvoll.`);
  }

  private showGifts(): void {
    this.optionContainer.removeAll(true);
    const available = ['wasser', 'chips', 'kaffee', 'bier', 'batida', 'wuerste'].filter((id) => (this.snapshot.inventory[id] ?? 0) > 0);
    if (!available.length) {
      this.buildOptions('Du hast nichts dabei, das sich glaubwürdig als Geschenk verkaufen lässt.');
      return;
    }
    const buttons = available.slice(0, 6).map((itemId, index) => {
      const item = ITEMS[itemId];
      const x = index % 2 ? 690 : 440;
      const y = 315 + Math.floor(index / 2) * 58;
      return this.button(x, y, `${item.icon} ${item.label} ×${this.snapshot.inventory[itemId]}`, () => this.giveGift(itemId), false, false, 220);
    });
    buttons.push(this.button(690, 515, 'Zurück', () => this.buildOptions(), false, true, 220));
    this.optionContainer.add(buttons);
  }

  private giveGift(itemId: string): void {
    if (!consumeInventoryItem(gameStore, itemId)) return this.reload('Das Geschenk ist nicht mehr im Inventar.');
    const reaction = giftReaction(this.characterId, itemId);
    adjustRelationship(gameStore, this.characterId, reaction.delta, `${this.characterId} erhält ${ITEMS[itemId].label}.`);
    gameStore.setFlag(`gifted-${this.characterId}-${itemId}`);
    gameStore.advanceMinutes(3);
    this.reload(reaction.text);
  }

  private toggleTeam(): void {
    const active = this.snapshot.team.some((member) => member.id === this.characterId);
    if (!active && !canRecruit(this.characterId, this.snapshot)) {
      this.buildOptions('Ein einziges Gespräch reicht nicht. Erst Beziehung aufbauen, dann Verantwortung verteilen.');
      return;
    }
    const result = toggleActiveTeamMember(gameStore, this.characterId, 3);
    this.reload(result.ok ? (result.active ? 'Der Partner ist jetzt aktiv für Kämpfe und Minispiele.' : 'Der Partner bleibt Freund, ist aber nicht mehr Teil des aktiven Dreierteams.') : result.reason ?? 'Teamwechsel nicht möglich.');
  }

  private startMaslGame(): void {
    gameStore.setWorldPosition(this.snapshot.worldPosition.x, this.snapshot.worldPosition.y);
    this.scene.start('masl-hole');
  }

  private reload(message: string): void {
    this.snapshot = gameStore.snapshot();
    this.refreshMeta();
    this.buildOptions(message);
  }

  private refreshMeta(): void {
    this.relationLabel.setText(`Beziehung ${this.snapshot.relationships[this.characterId] ?? 0}/100`);
    this.teamLabel.setText(`Aktives Team ${this.snapshot.team.length}/3\n${this.snapshot.team.map((member) => member.name).join(' · ') || 'Du startest und kämpfst allein.'}`);
  }

  private button(
    x: number,
    y: number,
    label: string,
    action: () => void,
    disabled = false,
    danger = false,
    width = 200,
    paddingY = 10,
  ): Phaser.GameObjects.Text {
    const button = this.add.text(x, y, label, {
      fontFamily: 'system-ui', fontSize: '14px', fontStyle: 'bold', color: disabled ? '#7f8d86' : '#173027',
      backgroundColor: disabled ? '#303a36' : danger ? '#ef8b72' : '#f4d47b', padding: { x: 13, y: paddingY }, align: 'center', fixedWidth: width,
    }).setOrigin(0.5);
    if (!disabled) {
      button.setInteractive({ useHandCursor: true });
      button.on('pointerover', () => button.setScale(1.035));
      button.on('pointerout', () => button.setScale(1));
      button.on('pointerdown', action);
    }
    return button;
  }

  private returnToWorld(): void {
    gameStore.setMode('world');
    this.scene.start('world');
  }
}
