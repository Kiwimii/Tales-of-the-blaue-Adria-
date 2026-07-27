import Phaser from 'phaser';
import { NPC_PLACEMENTS } from '../aerialCampgroundPlan';
import { RELATIONSHIP_CHARACTERS } from '../content';
import {
  ACTION_EVENT,
  CYCLE_INTERACTION_EVENT,
  REQUEST_INTERACTION_STATE_EVENT,
  SELECT_INTERACTION_EVENT,
  sendInteractionState,
  type CycleInteractionDetail,
  type InteractionCandidateDetail,
  type SelectInteractionDetail,
} from '../events';
import { cycleInteractionId, rankInteractionCandidates } from '../interactionSelection';
import { gameStore } from '../state/GameStore';
import type { GameSnapshot } from '../types';
import { activityBlockReason, activityPrompt, WORLD_ACTIVITY_CATALOG, type WorldActivityDefinition } from '../worldActivityCatalog';
import { isRegionUnlocked, regionAt, type RegionId } from '../worldV2';
import { worldDepth } from '../worldRealism';
import { SocialInteractionWorldScene } from './SocialInteractionWorldScene';

interface RuntimeInteraction {
  id: string;
  regionId: RegionId;
  x: number;
  y: number;
  radius: number;
  prompt: string;
  action: () => void;
}

interface WorldRuntimeInternals {
  player?: Phaser.Physics.Arcade.Sprite;
  interactions?: RuntimeInteraction[];
  prompt?: Phaser.GameObjects.Text;
  interactionPulse?: Phaser.GameObjects.Container;
  showMessage?: (text: string) => void;
  onAction?: () => void;
  keys?: Record<string, Phaser.Input.Keyboard.Key>;
}

interface NearbyRuntimeInteraction extends RuntimeInteraction {
  distance: number;
}

export class InteractionAuditWorldScene extends SocialInteractionWorldScene {
  private auditState!: GameSnapshot;
  private auditUnsubscribe?: () => void;
  private selectedInteractionId?: string;
  private selectionSignature = '';
  private activityLabels = new Map<string, Phaser.GameObjects.Text>();
  private activityMarkers = new Map<string, Phaser.GameObjects.Image>();

  private readonly onAuditedAction = (): void => this.performSelectedInteraction();
  private readonly onCycleInteraction = (event: Event): void => {
    const detail = (event as CustomEvent<CycleInteractionDetail>).detail;
    this.cycleInteraction(detail?.direction ?? 1);
  };
  private readonly onSelectInteraction = (event: Event): void => {
    const id = (event as CustomEvent<SelectInteractionDetail>).detail?.id;
    if (!id || !this.nearbyInteractions().some((candidate) => candidate.id === id)) return;
    this.selectedInteractionId = id;
    this.syncSelectedInteractionFeedback(true);
  };
  private readonly onInteractionStateRequest = (): void => this.publishSelectedInteraction(true);
  private readonly onTab = (event: KeyboardEvent): void => {
    event.preventDefault();
    this.cycleInteraction(event.shiftKey ? -1 : 1);
  };
  private readonly onQ = (): void => this.cycleInteraction(1);
  private readonly onNumberSelect = (event: KeyboardEvent): void => {
    const index = Number(event.key) - 1;
    const candidates = this.nearbyInteractions();
    if (!Number.isInteger(index) || index < 0 || index >= candidates.length) return;
    this.selectedInteractionId = candidates[index].id;
    this.syncSelectedInteractionFeedback(true);
  };

  create(): void {
    super.create();
    this.auditState = gameStore.snapshot();
    this.installAuditedActionInput();
    this.auditInteractionRegistry();
    this.auditUnsubscribe = gameStore.subscribe((snapshot) => {
      this.auditState = snapshot;
      this.auditInteractionRegistry();
      this.publishSelectedInteraction(true);
    });
    window.addEventListener(CYCLE_INTERACTION_EVENT, this.onCycleInteraction);
    window.addEventListener(SELECT_INTERACTION_EVENT, this.onSelectInteraction);
    window.addEventListener(REQUEST_INTERACTION_STATE_EVENT, this.onInteractionStateRequest);
    this.input.keyboard?.on('keydown-TAB', this.onTab);
    this.input.keyboard?.on('keydown-Q', this.onQ);
    this.input.keyboard?.on('keydown', this.onNumberSelect);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.shutdownInteractionAudit());
  }

  update(time: number): void {
    super.update(time);
    if (!this.auditState) return;
    this.syncSelectedInteractionFeedback();
  }

  private installAuditedActionInput(): void {
    const internals = this as unknown as WorldRuntimeInternals;
    const original = internals.onAction;
    if (original) {
      window.removeEventListener(ACTION_EVENT, original);
      internals.keys?.E?.off('down', original);
      internals.keys?.SPACE?.off('down', original);
    }
    window.addEventListener(ACTION_EVENT, this.onAuditedAction);
    internals.keys?.E?.on('down', this.onAuditedAction);
    internals.keys?.SPACE?.on('down', this.onAuditedAction);
  }

  private auditInteractionRegistry(): void {
    const internals = this as unknown as WorldRuntimeInternals;
    const interactions = internals.interactions;
    if (!interactions) return;

    this.removeExactDuplicates(interactions);
    this.ensureWorldActivities(interactions);
    this.ensureNpcInteractions(interactions);

    for (const point of interactions) {
      if (point.id.startsWith('npc-')) point.radius = Math.max(point.radius, 92);
      else if (WORLD_ACTIVITY_CATALOG.some((activity) => activity.id === point.id)) point.radius = Math.max(point.radius, 96);
      else if (point.id.includes('door') || point.id.includes('entrance')) point.radius = Math.max(point.radius, 82);
      else if (point.id.startsWith('landmark-')) point.radius = Math.max(point.radius, 76);
      else point.radius = Math.max(point.radius, 78);
    }
  }

  private removeExactDuplicates(interactions: RuntimeInteraction[]): void {
    const seen = new Set<string>();
    for (let index = interactions.length - 1; index >= 0; index -= 1) {
      const point = interactions[index];
      if (!seen.has(point.id)) {
        seen.add(point.id);
        continue;
      }
      interactions.splice(index, 1);
    }
  }

  private ensureWorldActivities(interactions: RuntimeInteraction[]): void {
    for (const definition of WORLD_ACTIVITY_CATALOG) {
      let point = interactions.find((entry) => entry.id === definition.id);
      const previous = point ? { x: point.x, y: point.y } : undefined;
      const action = (): void => this.startWorldActivity(definition);
      if (!point) {
        point = {
          id: definition.id,
          regionId: definition.regionId,
          x: definition.x,
          y: definition.y,
          radius: definition.radius,
          prompt: activityPrompt(definition, this.auditState),
          action,
        };
        interactions.push(point);
      } else {
        Object.assign(point, {
          regionId: definition.regionId,
          x: definition.x,
          y: definition.y,
          radius: definition.radius,
          prompt: activityPrompt(definition, this.auditState),
          action,
        });
      }
      this.ensureActivityVisual(definition, previous);
    }
  }

  private ensureActivityVisual(definition: WorldActivityDefinition, previous?: { x: number; y: number }): void {
    let label = this.activityLabels.get(definition.id);
    if (!label) {
      label = this.children.list.find((child): child is Phaser.GameObjects.Text => (
        child instanceof Phaser.GameObjects.Text && child.text === definition.label
      ));
    }
    let marker = this.activityMarkers.get(definition.id);
    if (!marker && previous) {
      marker = this.children.list.find((child): child is Phaser.GameObjects.Image => (
        child instanceof Phaser.GameObjects.Image
        && child.texture.key === 'activity-marker'
        && Phaser.Math.Distance.Between(child.x, child.y, previous.x, previous.y) < 54
      ));
    }
    if (!marker) marker = this.add.image(definition.x, definition.y, 'activity-marker');
    if (!label) {
      label = this.add.text(definition.x, definition.y + 29, definition.label, {
        fontFamily: 'Arial Black, system-ui', fontSize: '10px', color: '#fff0ba', backgroundColor: '#173027d8', padding: { x: 6, y: 3 },
      }).setOrigin(0.5);
    }
    marker.setPosition(definition.x, definition.y).setVisible(true).setDepth(worldDepth(definition.y + 24));
    label.setPosition(definition.x, definition.y + 29).setVisible(true).setDepth(worldDepth(definition.y + 35));
    this.activityMarkers.set(definition.id, marker);
    this.activityLabels.set(definition.id, label);
  }

  private ensureNpcInteractions(interactions: RuntimeInteraction[]): void {
    if (!this.auditState.flags.firstBeerOpened && this.auditState.quests.entry?.status !== 'completed') return;
    for (const [characterId, placement] of Object.entries(NPC_PLACEMENTS)) {
      if (!RELATIONSHIP_CHARACTERS.some((character) => character.id === characterId)) continue;
      if (interactions.some((point) => interactionCharacterId(point.id) === characterId)) continue;
      const character = RELATIONSHIP_CHARACTERS.find((entry) => entry.id === characterId)!;
      interactions.push({
        id: `npc-${characterId}`,
        regionId: regionAt(placement.x, placement.y).id,
        x: placement.x,
        y: placement.y,
        radius: 92,
        prompt: `Mit ${character.name} sprechen`,
        action: () => {
          const player = (this as unknown as WorldRuntimeInternals).player;
          if (player) gameStore.setWorldPosition(player.x, player.y);
          gameStore.socialize(characterId);
          this.scene.start('social', { characterId });
        },
      });
    }
  }

  private startWorldActivity(definition: WorldActivityDefinition): void {
    const blocked = activityBlockReason(definition, this.auditState);
    if (blocked) {
      this.showAuditMessage(blocked);
      return;
    }
    const player = (this as unknown as WorldRuntimeInternals).player;
    if (player) gameStore.setWorldPosition(player.x, player.y);
    this.scene.start(definition.sceneKey);
  }

  private nearbyInteractions(): NearbyRuntimeInteraction[] {
    const internals = this as unknown as WorldRuntimeInternals;
    const player = internals.player;
    const interactions = internals.interactions;
    if (!player || !interactions) return [];
    return rankInteractionCandidates(interactions
      .filter((point) => isRegionUnlocked(point.regionId, this.auditState))
      .map((point) => ({ ...point, distance: Phaser.Math.Distance.Between(player.x, player.y, point.x, point.y) }))
      .filter((point) => point.distance <= point.radius));
  }

  private selectedInteraction(): { candidates: NearbyRuntimeInteraction[]; selected?: NearbyRuntimeInteraction; selectedIndex: number } {
    const candidates = this.nearbyInteractions();
    if (!candidates.length) {
      this.selectedInteractionId = undefined;
      return { candidates, selected: undefined, selectedIndex: 0 };
    }
    if (!this.selectedInteractionId || !candidates.some((candidate) => candidate.id === this.selectedInteractionId)) {
      this.selectedInteractionId = candidates[0].id;
    }
    const selectedIndex = Math.max(0, candidates.findIndex((candidate) => candidate.id === this.selectedInteractionId));
    return { candidates, selected: candidates[selectedIndex], selectedIndex };
  }

  private cycleInteraction(direction: 1 | -1): void {
    const candidates = this.nearbyInteractions();
    this.selectedInteractionId = cycleInteractionId(candidates.map((candidate) => candidate.id), this.selectedInteractionId, direction);
    this.syncSelectedInteractionFeedback(true);
  }

  private performSelectedInteraction(): void {
    const { selected } = this.selectedInteraction();
    if (selected) selected.action();
    else this.showAuditMessage('Hier ist nichts in Reichweite. Geh näher an eine Person, Tür, Aktivität oder ein markiertes Objekt.');
  }

  private syncSelectedInteractionFeedback(force = false): void {
    const { candidates, selected, selectedIndex } = this.selectedInteraction();
    const internals = this as unknown as WorldRuntimeInternals;
    const prompt = internals.prompt;
    if (!selected) {
      prompt?.setVisible(false);
      internals.interactionPulse?.setVisible(false);
      this.publishSelectedInteraction(force);
      return;
    }

    const suffix = candidates.length > 1 ? ` · ${selectedIndex + 1}/${candidates.length} · Q/TAB WECHSELN` : '';
    prompt?.setVisible(true).setText(`AKTION · ${selected.prompt}${suffix}`);
    const pulse = internals.interactionPulse;
    pulse?.setVisible(true).setPosition(selected.x, selected.y - 4).setDepth(worldDepth(selected.y + 70) + 1);
    const pulseLabel = pulse?.list.find((entry): entry is Phaser.GameObjects.Text => entry instanceof Phaser.GameObjects.Text);
    pulseLabel?.setText(candidates.length > 1 ? `AKTION ${selectedIndex + 1}/${candidates.length}` : 'AKTION');
    this.publishSelectedInteraction(force);
  }

  private publishSelectedInteraction(force = false): void {
    const { candidates, selected, selectedIndex } = this.selectedInteraction();
    const candidateDetails: InteractionCandidateDetail[] = candidates.map(({ id, prompt }) => ({ id, prompt }));
    const signature = `${selected?.id ?? ''}|${selectedIndex}|${candidateDetails.map((candidate) => candidate.id).join(',')}`;
    if (!force && signature === this.selectionSignature) return;
    this.selectionSignature = signature;
    sendInteractionState(selected?.id ?? null, selected?.prompt ?? null, candidateDetails, selectedIndex);
  }

  private showAuditMessage(text: string): void {
    const showMessage = (this as unknown as WorldRuntimeInternals).showMessage;
    showMessage?.call(this, text);
  }

  private shutdownInteractionAudit(): void {
    const internals = this as unknown as WorldRuntimeInternals;
    window.removeEventListener(ACTION_EVENT, this.onAuditedAction);
    window.removeEventListener(CYCLE_INTERACTION_EVENT, this.onCycleInteraction);
    window.removeEventListener(SELECT_INTERACTION_EVENT, this.onSelectInteraction);
    window.removeEventListener(REQUEST_INTERACTION_STATE_EVENT, this.onInteractionStateRequest);
    internals.keys?.E?.off('down', this.onAuditedAction);
    internals.keys?.SPACE?.off('down', this.onAuditedAction);
    this.input.keyboard?.off('keydown-TAB', this.onTab);
    this.input.keyboard?.off('keydown-Q', this.onQ);
    this.input.keyboard?.off('keydown', this.onNumberSelect);
    this.auditUnsubscribe?.();
    sendInteractionState(null, null, [], 0);
  }
}

function interactionCharacterId(interactionId: string): string | null {
  if (!interactionId.startsWith('npc-')) return null;
  const raw = interactionId.slice(4);
  return raw.endsWith('-story') ? raw.slice(0, -6) : raw;
}
