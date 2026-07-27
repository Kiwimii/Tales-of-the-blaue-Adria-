import Phaser from 'phaser';
import { TOGGLE_MAP_EVENT } from '../events';
import {
  QUEST_MARKER_BOB_DISTANCE,
  RESERVATION_BOARD_INTERACTION_RADIUS,
  RESERVATION_BOARD_TAP_RADIUS,
  activeArrivalInteractionId,
  questMarkerAnchor,
  reservationBoardPosition,
  reservationBoardState,
} from '../questNavigation';
import { gameStore } from '../state/GameStore';
import type { GameSnapshot } from '../types';
import { worldDepth } from '../worldRealism';
import { isRegionUnlocked, type RegionId } from '../worldV2';
import { AdvancedWorldScene } from './AdvancedWorldScene';

interface InteractionPoint {
  id: string;
  regionId: RegionId;
  x: number;
  y: number;
  radius: number;
  prompt: string;
  action: () => void;
}

type Highlightable =
  | Phaser.GameObjects.Sprite
  | Phaser.GameObjects.Image
  | Phaser.GameObjects.Container
  | Phaser.GameObjects.Text
  | Phaser.GameObjects.Arc
  | Phaser.GameObjects.Ellipse
  | Phaser.GameObjects.Rectangle;

interface WorldInternals {
  player?: Phaser.Physics.Arcade.Sprite;
  interactions?: InteractionPoint[];
  showMessage?: (text: string) => void;
  minimap?: Phaser.GameObjects.Container;
  message?: Phaser.GameObjects.Text;
}

export class QuestReliabilityWorldScene extends AdvancedWorldScene {
  private questState!: GameSnapshot;
  private questUnsubscribe?: () => void;
  private questMarker?: Phaser.GameObjects.Container;
  private reservationBoard?: Phaser.GameObjects.Container;
  private reservationBoardHitArea?: Phaser.GameObjects.Zone;
  private interactionPulse?: Phaser.GameObjects.Container;
  private highlightedVisual?: Highlightable;
  private highlightedVisualBaseAlpha = 1;
  private highlightedInteractionId?: string;
  private baseInteractionRadii = new Map<string, number>();
  private readonly onToggleMap = (): void => {
    const minimap = (this as unknown as WorldInternals).minimap;
    minimap?.setVisible(!minimap.visible);
  };

  create(): void {
    super.create();
    this.questState = gameStore.snapshot();
    this.configureFocusedWorldHud();
    this.upgradeReservationBoard();
    this.repairQuestMarkerAnimation();
    this.createInteractionPulse();
    this.questUnsubscribe = gameStore.subscribe((snapshot) => {
      this.questState = snapshot;
      this.syncQuestNavigation();
    });
    window.addEventListener(TOGGLE_MAP_EVENT, this.onToggleMap);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.shutdownQuestReliability());
  }

  update(time: number): void {
    super.update(time);
    if (!this.questState) return;
    this.syncQuestNavigation();
    this.syncInteractionFeedback(time);
  }

  private configureFocusedWorldHud(): void {
    const internals = this as unknown as WorldInternals;
    internals.minimap?.setVisible(false);
    internals.message?.setAlpha(0);
    const statusLabel = this.children.list.find((child): child is Phaser.GameObjects.Text => (
      child instanceof Phaser.GameObjects.Text
      && child.scrollFactorX === 0
      && Math.abs(child.x - 18) < 2
      && Math.abs(child.y - 18) < 2
    ));
    statusLabel?.setVisible(false);
  }

  private createInteractionPulse(): void {
    const graphics = this.add.graphics();
    graphics.lineStyle(3, 0xffe39a, 0.95).strokeCircle(0, 0, 34)
      .lineStyle(1, 0x6ed7c6, 0.78).strokeCircle(0, 0, 43)
      .fillStyle(0xffe39a, 0.9).fillCircle(0, -43, 4);
    const label = this.add.text(0, -57, 'AKTION', {
      fontFamily: 'Arial Black, system-ui',
      fontSize: '9px',
      color: '#173027',
      backgroundColor: '#ffe39ae8',
      padding: { x: 5, y: 2 },
    }).setOrigin(0.5);
    this.interactionPulse = this.add.container(0, 0, [graphics, label]).setVisible(false);
  }

  private upgradeReservationBoard(): void {
    const { x, y } = reservationBoardPosition();
    const internals = this as unknown as WorldInternals;
    const interaction = internals.interactions?.find((point) => point.id === 'arrival-board');
    if (interaction) {
      interaction.x = x;
      interaction.y = y;
      interaction.radius = RESERVATION_BOARD_INTERACTION_RADIUS;
      interaction.prompt = 'Schwarzes Brett öffnen';
      interaction.action = () => this.openReservationBoard(false);
    }

    const graphics = this.add.graphics();
    graphics.fillStyle(0x281d15, 0.34).fillEllipse(0, 41, 132, 25)
      .fillStyle(0x6d4b2f).fillRoundedRect(-60, -45, 120, 90, 8)
      .lineStyle(4, 0xd3af6d, 0.85).strokeRoundedRect(-60, -45, 120, 90, 8)
      .fillStyle(0xe9dfbf).fillRoundedRect(-45, -31, 40, 28, 3)
      .fillStyle(0xd8c18d).fillRoundedRect(6, -28, 39, 42, 3)
      .fillStyle(0xf2ead1).fillRoundedRect(-37, 9, 52, 23, 3)
      .fillStyle(0xc34f45).fillCircle(-37, -24, 3)
      .fillStyle(0x4d7d9b).fillCircle(37, -21, 3)
      .fillStyle(0x4d8b57).fillCircle(7, 15, 3);
    const title = this.add.text(0, 54, 'SCHWARZES BRETT', {
      fontFamily: 'Arial Black, system-ui',
      fontSize: '10px',
      color: '#fff0ba',
      backgroundColor: '#173027dd',
      padding: { x: 6, y: 3 },
    }).setOrigin(0.5);
    this.reservationBoard = this.add.container(x, y, [graphics, title]).setDepth(worldDepth(y + 48));

    this.reservationBoardHitArea = this.add.zone(x, y, 150, 118)
      .setDepth(worldDepth(y + 50))
      .setInteractive({ useHandCursor: true });
    this.reservationBoardHitArea.on('pointerover', () => this.reservationBoard?.setScale(1.04));
    this.reservationBoardHitArea.on('pointerout', () => this.reservationBoard?.setScale(1));
    this.reservationBoardHitArea.on('pointerdown', () => this.openReservationBoard(true));
  }

  private openReservationBoard(fromPointer: boolean): void {
    const state = gameStore.snapshot();
    const player = (this as unknown as WorldInternals).player;
    const { x, y } = reservationBoardPosition();
    if (fromPointer && player && Phaser.Math.Distance.Between(player.x, player.y, x, y) > RESERVATION_BOARD_TAP_RADIUS) {
      this.showQuestMessage('Das Schwarze Brett ist zu weit weg. Geh näher heran, damit du die Reservierungen lesen kannst.');
      return;
    }

    switch (reservationBoardState(state)) {
      case 'archive':
        this.showQuestMessage('Am Brett hängt eure Buchung unter „Tauchgruppe Tiefenrausch“. Daneben steht Gundulas Vermerk: „Sonntag Personen, Zelte und Strom nachberechnen.“');
        return;
      case 'needs-documents':
        this.showQuestMessage('Zu viele ähnliche Aliasnamen. Suche zuerst im Kofferraum nach den Reservierungsunterlagen.');
        return;
      case 'solved':
        this.showQuestMessage('Die passende Reservierung ist markiert: „Tauchgruppe Tiefenrausch“ · Taucherplatz · 3 Personen · 2 Zelte · ohne Strom.');
        return;
      case 'available':
        if (player) gameStore.setWorldPosition(player.x, player.y);
        if (!this.scene.isActive('reservation-puzzle')) this.scene.start('reservation-puzzle');
    }
  }

  private repairQuestMarkerAnimation(): void {
    this.questMarker = this.children.list.find((child): child is Phaser.GameObjects.Container => (
      child instanceof Phaser.GameObjects.Container
      && child.list.some((entry) => entry instanceof Phaser.GameObjects.Text && entry.text === 'ZIEL')
    ));
    if (!this.questMarker) return;

    this.tweens.killTweensOf(this.questMarker);
    this.questMarker.setAlpha(1).setDepth(74);
    const visualParts = [...this.questMarker.list];
    this.tweens.killTweensOf(visualParts);
    this.tweens.add({
      targets: visualParts,
      y: `+=${QUEST_MARKER_BOB_DISTANCE}`,
      duration: 750,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.InOut',
    });
  }

  private syncQuestNavigation(): void {
    const marker = this.questMarker;
    if (marker) {
      const anchor = questMarkerAnchor(this.questState);
      const active = this.questState.quests.entry?.status === 'active' && !this.questState.flags.firstBeerOpened;
      marker.setPosition(anchor.x, anchor.y).setVisible(active);
    }

    const interactions = (this as unknown as WorldInternals).interactions;
    if (!interactions) return;
    const activeId = activeArrivalInteractionId(this.questState);
    for (const point of interactions) {
      if (!point.id.startsWith('arrival-') && !point.id.startsWith('npc-') && point.id !== 'home-door-story') continue;
      if (!this.baseInteractionRadii.has(point.id)) this.baseInteractionRadii.set(point.id, point.radius);
      const baseRadius = this.baseInteractionRadii.get(point.id) ?? point.radius;
      if (point.id === activeId) point.radius = Math.max(baseRadius, point.id === 'arrival-board' ? RESERVATION_BOARD_INTERACTION_RADIUS : 92);
      else point.radius = baseRadius;
    }
  }

  private syncInteractionFeedback(time: number): void {
    const nearest = this.nearestAvailableInteraction();
    if (!nearest || this.questState.encounter) {
      this.clearInteractionFeedback();
      return;
    }

    if (nearest.id !== this.highlightedInteractionId) {
      this.resetHighlightedVisual();
      this.highlightedInteractionId = nearest.id;
      this.highlightedVisual = this.findInteractionVisual(nearest);
      this.highlightedVisualBaseAlpha = this.highlightedVisual?.alpha ?? 1;
    }

    const wave = (Math.sin(time * 0.009) + 1) / 2;
    this.interactionPulse?.setVisible(true)
      .setPosition(nearest.x, nearest.y - 4)
      .setDepth(worldDepth(nearest.y + 70) + 1)
      .setAlpha(0.58 + wave * 0.38)
      .setScale(0.94 + wave * 0.08);
    if (this.highlightedVisual) {
      this.highlightedVisual.setAlpha(this.highlightedVisualBaseAlpha * (0.72 + wave * 0.28));
    }
  }

  private nearestAvailableInteraction(): InteractionPoint | undefined {
    const internals = this as unknown as WorldInternals;
    const player = internals.player;
    const interactions = internals.interactions;
    if (!player || !interactions) return undefined;
    let nearest: InteractionPoint | undefined;
    let bestDistance = Number.POSITIVE_INFINITY;
    for (const point of interactions) {
      if (!isRegionUnlocked(point.regionId, this.questState)) continue;
      const distance = Phaser.Math.Distance.Between(player.x, player.y, point.x, point.y);
      if (distance <= point.radius && distance < bestDistance) {
        nearest = point;
        bestDistance = distance;
      }
    }
    return nearest;
  }

  private findInteractionVisual(point: InteractionPoint): Highlightable | undefined {
    if (point.id === 'arrival-board' && this.reservationBoard) return this.reservationBoard;
    const player = (this as unknown as WorldInternals).player;
    let best: Highlightable | undefined;
    let bestScore = Number.POSITIVE_INFINITY;
    for (const child of this.children.list) {
      if (child === player || child === this.interactionPulse || child === this.questMarker) continue;
      if (!isHighlightable(child) || !child.visible || child.scrollFactorX === 0) continue;
      const distance = Phaser.Math.Distance.Between(child.x, child.y, point.x, point.y);
      if (distance > 62) continue;
      const score = distance + highlightPenalty(child);
      if (score < bestScore) {
        best = child;
        bestScore = score;
      }
    }
    return best;
  }

  private clearInteractionFeedback(): void {
    this.interactionPulse?.setVisible(false);
    this.resetHighlightedVisual();
    this.highlightedInteractionId = undefined;
  }

  private resetHighlightedVisual(): void {
    if (this.highlightedVisual?.active) this.highlightedVisual.setAlpha(this.highlightedVisualBaseAlpha);
    this.highlightedVisual = undefined;
    this.highlightedVisualBaseAlpha = 1;
  }

  private showQuestMessage(text: string): void {
    const showMessage = (this as unknown as WorldInternals).showMessage;
    showMessage?.call(this, text);
  }

  private shutdownQuestReliability(): void {
    this.clearInteractionFeedback();
    this.questUnsubscribe?.();
    this.reservationBoardHitArea?.removeAllListeners();
    window.removeEventListener(TOGGLE_MAP_EVENT, this.onToggleMap);
  }
}

function isHighlightable(child: Phaser.GameObjects.GameObject): child is Highlightable {
  return child instanceof Phaser.GameObjects.Sprite
    || child instanceof Phaser.GameObjects.Image
    || child instanceof Phaser.GameObjects.Container
    || child instanceof Phaser.GameObjects.Text
    || child instanceof Phaser.GameObjects.Arc
    || child instanceof Phaser.GameObjects.Ellipse
    || child instanceof Phaser.GameObjects.Rectangle;
}

function highlightPenalty(child: Highlightable): number {
  if (child instanceof Phaser.GameObjects.Sprite) return 0;
  if (child instanceof Phaser.GameObjects.Container) return 5;
  if (child instanceof Phaser.GameObjects.Image) return 10;
  if (child instanceof Phaser.GameObjects.Arc || child instanceof Phaser.GameObjects.Ellipse) return 18;
  if (child instanceof Phaser.GameObjects.Rectangle) return 24;
  return 34;
}
