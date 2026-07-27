import Phaser from 'phaser';
import { ARRIVAL_POSITIONS } from '../arrivalQuest';
import { RELATIONSHIP_CHARACTERS } from '../content';
import { gameStore } from '../state/GameStore';
import type { GameSnapshot } from '../types';
import type { RegionId } from '../worldV2';
import { QuestReliabilityWorldScene } from './QuestReliabilityWorldScene';

interface WorldInteraction {
  id: string;
  regionId: RegionId;
  x: number;
  y: number;
  radius: number;
  prompt: string;
  action: () => void;
}

interface WorldInternals {
  player?: Phaser.Physics.Arcade.Sprite;
  interactions?: WorldInteraction[];
  showMessage?: (text: string) => void;
}

type AuthorityVisual = Phaser.GameObjects.Sprite | Phaser.GameObjects.Text | Phaser.GameObjects.Ellipse;
type AuthorityPhase = 'desk' | 'lunch' | 'patrol';

export class SocialInteractionWorldScene extends QuestReliabilityWorldScene {
  private socialState!: GameSnapshot;
  private socialUnsubscribe?: () => void;
  private originalNpcActions = new Map<string, () => void>();
  private staticAuthorityVisuals: AuthorityVisual[] = [];

  create(): void {
    super.create();
    this.socialState = gameStore.snapshot();
    this.captureStaticAuthorityVisuals();
    this.syncAllNpcInteractions();
    this.socialUnsubscribe = gameStore.subscribe((snapshot) => {
      this.socialState = snapshot;
      this.syncAllNpcInteractions();
      this.syncAuthorityVisibility();
    });
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.socialUnsubscribe?.());
  }

  update(time: number): void {
    super.update(time);
    // Advanced authority scheduling can replace these actions and visibility during update.
    // Re-apply only the two affected characters afterwards.
    this.syncNpcInteraction('gundula');
    this.syncNpcInteraction('uli');
    this.syncAuthorityVisibility();
  }

  private captureStaticAuthorityVisuals(): void {
    this.staticAuthorityVisuals = this.children.list.filter((child): child is AuthorityVisual => {
      if (child instanceof Phaser.GameObjects.Sprite) {
        if (!['npc-gundula', 'npc-uli'].includes(child.texture.key)) return false;
        return distanceToAuthorityPoint(child.x, child.y) < 70;
      }
      if (child instanceof Phaser.GameObjects.Text) return ['Gundula', 'Uli'].includes(child.text);
      if (child instanceof Phaser.GameObjects.Ellipse) return distanceToAuthorityPoint(child.x, child.y) < 70;
      return false;
    });
  }

  private syncAuthorityVisibility(): void {
    const visible = !this.socialState.flags.firstBeerOpened || authorityPhase(this.socialState) === 'desk';
    for (const visual of this.staticAuthorityVisuals) visual.setVisible(visible);
  }

  private syncAllNpcInteractions(): void {
    const interactions = (this as unknown as WorldInternals).interactions;
    if (!interactions) return;
    for (const point of interactions) {
      const characterId = characterIdFromInteraction(point.id);
      if (!characterId) continue;
      this.syncPoint(point, characterId);
    }
  }

  private syncNpcInteraction(characterId: string): void {
    const interactions = (this as unknown as WorldInternals).interactions;
    if (!interactions) return;
    for (const point of interactions) {
      if (characterIdFromInteraction(point.id) === characterId) this.syncPoint(point, characterId);
    }
  }

  private syncPoint(point: WorldInteraction, characterId: string): void {
    if (!this.originalNpcActions.has(point.id)) this.originalNpcActions.set(point.id, point.action);
    if (!this.canOpenFullConversation(characterId)) {
      if (isAuthority(characterId) && this.authorityStoryComplete(characterId)) {
        this.applyUnavailableAuthorityAction(point, characterId);
        return;
      }
      const original = this.originalNpcActions.get(point.id);
      if (original) point.action = original;
      return;
    }

    const character = RELATIONSHIP_CHARACTERS.find((entry) => entry.id === characterId);
    if (!character) return;
    point.prompt = `Mit ${character.name} sprechen · Themen${isRomanceCharacter(characterId) ? ' / Flirt' : ''}`;
    point.action = () => this.openConversation(characterId);
  }

  private canOpenFullConversation(characterId: string): boolean {
    if (!RELATIONSHIP_CHARACTERS.some((entry) => entry.id === characterId)) return false;
    if (characterId === 'gundula' || characterId === 'uli') {
      return this.authorityStoryComplete(characterId) && authorityPhase(this.socialState) === 'desk';
    }
    if (characterId === 'manni') return this.socialState.quests.paper?.status === 'completed';
    if (characterId === 'ronny') return Boolean(this.socialState.flags.firstBattleWon);
    return true;
  }

  private authorityStoryComplete(characterId: string): boolean {
    if (characterId === 'gundula') return Boolean(this.socialState.flags.gundulaConvinced);
    return Boolean(this.socialState.flags.uliInspectionPassed || this.socialState.flags.uliConvinced);
  }

  private applyUnavailableAuthorityAction(point: WorldInteraction, characterId: string): void {
    const phase = authorityPhase(this.socialState);
    point.prompt = phase === 'lunch' ? 'Mittagspause respektieren' : 'Kontrollgang ansprechen';
    point.action = () => {
      const showMessage = (this as unknown as WorldInternals).showMessage;
      const text = phase === 'lunch'
        ? 'Gundula und Uli befinden sich in einer internen Flüssigkeitsbesprechung. Ein normales Gespräch ist nach der Mittagspause wieder möglich.'
        : `${characterId === 'gundula' ? 'Gundula' : 'Uli'} ist im Kontrollmodus. Für persönliche Themen ist das gerade der schlechteste denkbare Zeitpunkt.`;
      showMessage?.call(this, text);
    };
  }

  private openConversation(characterId: string): void {
    const player = (this as unknown as WorldInternals).player;
    if (player) gameStore.setWorldPosition(player.x, player.y);
    gameStore.socialize(characterId);
    this.scene.start('social', { characterId });
  }
}

function characterIdFromInteraction(interactionId: string): string | null {
  if (!interactionId.startsWith('npc-')) return null;
  const raw = interactionId.slice(4);
  return raw.endsWith('-story') ? raw.slice(0, -6) : raw;
}

function isRomanceCharacter(characterId: string): boolean {
  return characterId === 'susi' || characterId === 'jule' || characterId === 'kira';
}

function isAuthority(characterId: string): boolean {
  return characterId === 'gundula' || characterId === 'uli';
}

function authorityPhase(state: GameSnapshot): AuthorityPhase {
  if (!state.flags.firstBeerOpened) return 'desk';
  const minute = state.minutes % (24 * 60);
  if (minute >= 12 * 60 && minute < 14 * 60) return 'lunch';
  if (minute >= 18 * 60 && minute < 18 * 60 + 45) return 'patrol';
  return 'desk';
}

function distanceToAuthorityPoint(x: number, y: number): number {
  return Math.min(
    Phaser.Math.Distance.Between(x, y, ARRIVAL_POSITIONS.gundula.x, ARRIVAL_POSITIONS.gundula.y),
    Phaser.Math.Distance.Between(x, y, ARRIVAL_POSITIONS.uli.x, ARRIVAL_POSITIONS.uli.y),
  );
}
