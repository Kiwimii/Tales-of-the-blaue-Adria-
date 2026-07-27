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
}

export class SocialInteractionWorldScene extends QuestReliabilityWorldScene {
  private socialState!: GameSnapshot;
  private socialUnsubscribe?: () => void;
  private originalNpcActions = new Map<string, () => void>();

  create(): void {
    super.create();
    this.socialState = gameStore.snapshot();
    this.syncAllNpcInteractions();
    this.socialUnsubscribe = gameStore.subscribe((snapshot) => {
      this.socialState = snapshot;
      this.syncAllNpcInteractions();
    });
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.socialUnsubscribe?.());
  }

  update(time: number): void {
    super.update(time);
    // Advanced authority scheduling can replace these actions during update.
    // Re-apply only the two affected desk conversations afterwards.
    this.syncNpcInteraction('gundula');
    this.syncNpcInteraction('uli');
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
    if (characterId === 'gundula') return Boolean(this.socialState.flags.gundulaConvinced);
    if (characterId === 'uli') return Boolean(this.socialState.flags.uliInspectionPassed || this.socialState.flags.uliConvinced);
    if (characterId === 'manni') return this.socialState.quests.paper?.status === 'completed';
    if (characterId === 'ronny') return Boolean(this.socialState.flags.firstBattleWon);
    return true;
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
