import Phaser from 'phaser';
import { FRIEND_ID_SET } from '../advancedContent';
import { ENCOUNTERS, RELATIONSHIP_CHARACTERS } from '../content';
import { ROMANCE_PROFILES, patrolOpening } from '../socialSystem';
import { gameStore } from '../state/GameStore';
import { activeStatuses, statusVisuals } from '../statusSystem';
import { applySystemEffects } from '../storeAdapter';
import type { GameSnapshot } from '../types';
import { regionAt, type RegionId } from '../worldV2';
import { worldDepth } from '../worldRealism';
import { ArrivalQuestWorldScene } from './ArrivalQuestWorldScene';

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
  shadow?: Phaser.GameObjects.Ellipse;
  interactions?: WorldInteraction[];
  initialCar?: Phaser.GameObjects.Container;
  pitchCar?: Phaser.GameObjects.Container;
  showMessage?: (text: string) => void;
}

type AuthorityPhase = 'desk' | 'lunch' | 'patrol';
type VisibleAuthority = Phaser.GameObjects.Sprite | Phaser.GameObjects.Text | Phaser.GameObjects.Ellipse;

const PATROL_POINTS: Array<{ x: number; y: number }> = [
  { x: 1040, y: 1460 }, { x: 835, y: 1325 }, { x: 760, y: 1120 }, { x: 420, y: 930 },
  { x: 780, y: 900 }, { x: 1120, y: 1000 }, { x: 1260, y: 1160 }, { x: 900, y: 1325 },
];

export class AdvancedWorldScene extends ArrivalQuestWorldScene {
  private advancedState!: GameSnapshot;
  private authorityPhase: AuthorityPhase = 'desk';
  private staticAuthority: VisibleAuthority[] = [];
  private patrolGundula!: Phaser.Physics.Arcade.Sprite;
  private patrolUli!: Phaser.Physics.Arcade.Sprite;
  private patrolLabel!: Phaser.GameObjects.Text;
  private lunchLabel!: Phaser.GameObjects.Text;
  private statusLabel!: Phaser.GameObjects.Text;
  private hangoverOverlay!: Phaser.GameObjects.Rectangle;
  private highGhost!: Phaser.GameObjects.Image;
  private delayedVelocity = new Phaser.Math.Vector2();
  private lastAdvancedTime = 0;
  private interactionsUpgraded = false;
  private carReturnApplied = false;
  private advancedUnsubscribe?: () => void;

  create(): void {
    super.create();
    this.advancedState = gameStore.snapshot();
    this.captureAuthorityObjects();
    this.createAuthorityActors();
    this.createStatusPresentation();
    this.addHedgeInteraction();
    this.advancedUnsubscribe = gameStore.subscribe((snapshot) => { this.advancedState = snapshot; });
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.advancedUnsubscribe?.());
  }

  update(time: number): void {
    super.update(time);
    if (!this.advancedState) return;
    this.upgradeSocialInteractions();
    this.updateConditionPresentation(time);
    this.updateAuthoritySchedule(time);
    this.enforceVehicleRule();
  }

  private captureAuthorityObjects(): void {
    this.staticAuthority = this.children.list.filter((child): child is VisibleAuthority => {
      if (child instanceof Phaser.GameObjects.Sprite) return ['npc-gundula', 'npc-uli'].includes(child.texture.key);
      if (child instanceof Phaser.GameObjects.Text) return ['Gundula', 'Uli'].includes(child.text);
      if (child instanceof Phaser.GameObjects.Ellipse) {
        return Phaser.Math.Distance.Between(child.x, child.y, 790, 1415) < 55
          || Phaser.Math.Distance.Between(child.x, child.y, 885, 1415) < 55;
      }
      return false;
    });
  }

  private createAuthorityActors(): void {
    this.patrolGundula = this.physics.add.sprite(0, 0, 'npc-gundula').setVisible(false);
    this.patrolUli = this.physics.add.sprite(0, 0, 'npc-uli').setVisible(false);
    this.patrolLabel = this.add.text(0, 0, 'KONTROLLGANG · 18 UHR', {
      fontFamily: 'Arial Black, system-ui', fontSize: '11px', color: '#fff0ba', backgroundColor: '#6b2f32dc', padding: { x: 6, y: 3 },
    }).setOrigin(0.5).setVisible(false);
    this.lunchLabel = this.add.text(1110, 1580, 'MITTAGSPAUSE\nSaufen oder Schlafen. Klopfen auf eigenes Risiko.', {
      fontFamily: 'Arial Black, system-ui', fontSize: '11px', color: '#fff0ba', backgroundColor: '#173027e8', padding: { x: 9, y: 6 }, align: 'center',
    }).setOrigin(0.5).setDepth(worldDepth(1590)).setVisible(false);
  }

  private createStatusPresentation(): void {
    const player = (this as unknown as WorldInternals).player;
    this.statusLabel = this.add.text(18, 18, '', {
      fontFamily: 'Arial Black, system-ui', fontSize: '11px', color: '#fff2c4', backgroundColor: '#07151ddd', padding: { x: 9, y: 6 }, lineSpacing: 3,
    }).setScrollFactor(0).setDepth(130);
    this.hangoverOverlay = this.add.rectangle(480, 320, 960, 640, 0x44515a, 0).setScrollFactor(0).setDepth(92).setBlendMode(Phaser.BlendModes.MULTIPLY);
    this.highGhost = this.add.image(player?.x ?? 0, player?.y ?? 0, 'player').setAlpha(0).setTint(0xb99ce8).setDepth(49);
  }

  private upgradeSocialInteractions(): void {
    if (!this.advancedState.flags.firstBeerOpened) return;
    const interactions = (this as unknown as WorldInternals).interactions;
    if (!interactions) return;
    for (const point of interactions) {
      const characterId = point.id.match(/^npc-(.+)$/)?.[1];
      if (!characterId || ['gundula', 'uli', 'manni', 'ronny'].includes(characterId)) continue;
      if (!FRIEND_ID_SET.has(characterId as never) && !ROMANCE_PROFILES[characterId as keyof typeof ROMANCE_PROFILES]) continue;
      point.prompt = `Mit ${RELATIONSHIP_CHARACTERS.find((entry) => entry.id === characterId)?.name ?? characterId} interagieren`;
      point.action = () => this.startSocial(characterId);
    }
    this.interactionsUpgraded = true;
  }

  private startSocial(characterId: string): void {
    const player = (this as unknown as WorldInternals).player;
    if (player) gameStore.setWorldPosition(player.x, player.y);
    gameStore.socialize(characterId);
    this.scene.start('social', { characterId });
  }

  private addHedgeInteraction(): void {
    const interactions = (this as unknown as WorldInternals).interactions;
    if (!interactions || interactions.some((point) => point.id === 'tent-hedge-relief')) return;
    interactions.push({
      id: 'tent-hedge-relief', regionId: 'central', x: 690, y: 1230, radius: 78, prompt: 'In die Hecke brunsen', action: () => this.useHedge(),
    });
  }

  private useHedge(): void {
    if (!this.advancedState.flags.firstBeerOpened) return this.showAdvancedMessage('Erst den Platz beziehen. Vorher wäre das kein Ritual, sondern ein Platzverweis.');
    const caught = this.authorityPhase === 'patrol' && this.distanceToPatrol() < 280;
    applySystemEffects(gameStore, {
      needs: { bladder: -100 },
      metrics: caught ? { dignity: -10, chaos: 7 } : { dignity: -1, chaos: 3, momentum: 2 },
      relationships: caught ? { gundula: -12, uli: -9 } : { lars: 2, danny: 2 },
      flags: { hedgeRelieved: true, hedgeCaught: caught }, minutes: 4,
    }, caught ? 'Beim Brunsen in die Zelthecke vom Kontrollgang erwischt.' : 'Die Hecke neben der Zeltgruppe wurde zweckentfremdet.', caught ? 'bad' : 'neutral');
    if (caught) this.preparePatrolEncounter();
    else this.showAdvancedMessage('HECKE · Blase leer. Lars und Danny erklären den Standort damit offiziell für geeignet.');
  }

  private updateConditionPresentation(time: number): void {
    const player = (this as unknown as WorldInternals).player;
    if (!player) return;
    const body = player.body as Phaser.Physics.Arcade.Body | null;
    const statuses = activeStatuses(this.advancedState.needs);
    const visuals = statusVisuals(this.advancedState.needs);
    this.statusLabel.setText(statuses.length
      ? `ZUSTAND\n${statuses.slice(0, 3).map((status) => status.shortLabel).join(' · ')}`
      : `ZUSTAND\nSTABIL · TEAM ${this.advancedState.team.length}/3`);
    this.hangoverOverlay.setAlpha(visuals.vignette);
    this.cameras.main.setRotation(Math.sin(time * 0.0018) * 0.006 * visuals.sway);

    const delta = this.lastAdvancedTime ? Math.min(50, time - this.lastAdvancedTime) : 16;
    this.lastAdvancedTime = time;
    if (visuals.delayMs > 0) {
      const current = new Phaser.Math.Vector2(body?.velocity.x ?? 0, body?.velocity.y ?? 0);
      const alpha = Math.max(0.04, Math.min(0.45, delta / (visuals.delayMs + delta)));
      this.delayedVelocity.lerp(current, alpha);
      player.setVelocity(this.delayedVelocity.x, this.delayedVelocity.y);
      this.highGhost.setAlpha(0.12 + Math.min(0.16, visuals.delayMs / 2800));
      this.highGhost.x = Phaser.Math.Linear(this.highGhost.x, player.x - 10, 0.08);
      this.highGhost.y = Phaser.Math.Linear(this.highGhost.y, player.y + 2, 0.08);
      this.highGhost.setFlipX(player.flipX).setDepth(player.depth - 0.2);
    } else {
      this.delayedVelocity.set(body?.velocity.x ?? 0, body?.velocity.y ?? 0);
      this.highGhost.setAlpha(0);
    }
    if (visuals.sway > 0 && (body?.velocity.length() ?? 0) > 4) {
      player.setAngle(player.angle + Math.sin(time * 0.006) * 1.2 * visuals.sway);
    }
  }

  private updateAuthoritySchedule(time: number): void {
    if (!this.advancedState.flags.firstBeerOpened) return;
    const minute = this.advancedState.minutes % (24 * 60);
    this.authorityPhase = minute >= 12 * 60 && minute < 14 * 60
      ? 'lunch'
      : minute >= 18 * 60 && minute < 18 * 60 + 45 ? 'patrol' : 'desk';
    const staticVisible = this.authorityPhase === 'desk';
    this.staticAuthority.forEach((object) => object.setVisible(staticVisible));
    this.lunchLabel.setVisible(this.authorityPhase === 'lunch');
    const patrolVisible = this.authorityPhase === 'patrol';
    this.patrolGundula.setVisible(patrolVisible);
    this.patrolUli.setVisible(patrolVisible);
    this.patrolLabel.setVisible(patrolVisible);

    if (patrolVisible) {
      const progress = (minute - 18 * 60) / 45;
      const position = patrolPosition(progress);
      const next = patrolPosition(Math.min(1, progress + 0.025));
      this.patrolGundula.setPosition(position.x - 18, position.y);
      this.patrolUli.setPosition(position.x + 22, position.y + 4);
      const flip = next.x < position.x;
      this.patrolGundula.setFlipX(flip).setDepth(worldDepth(position.y + 28));
      this.patrolUli.setFlipX(flip).setDepth(worldDepth(position.y + 30));
      this.patrolLabel.setPosition(position.x, position.y - 54).setDepth(worldDepth(position.y + 40));
      this.syncAuthorityInteractions(position.x, position.y);
      this.checkPatrolSight(time);
    } else if (this.authorityPhase === 'lunch') this.syncAuthorityInteractions(1110, 1530);
    else this.syncAuthorityInteractions(835, 1390);
  }

  private syncAuthorityInteractions(x: number, y: number): void {
    const interactions = (this as unknown as WorldInternals).interactions;
    if (!interactions || !this.interactionsUpgraded) return;
    for (const id of ['gundula', 'uli']) {
      const point = interactions.find((entry) => entry.id === `npc-${id}`);
      if (!point) continue;
      point.x = id === 'gundula' ? x - 20 : x + 22;
      point.y = y;
      point.regionId = regionAt(point.x, point.y).id;
      point.prompt = this.authorityPhase === 'lunch' ? 'Mittagspause kontrollieren' : this.authorityPhase === 'patrol' ? 'Kontrollgang ansprechen' : `Mit ${id === 'gundula' ? 'Gundula' : 'Uli'} sprechen`;
      point.action = () => {
        if (this.authorityPhase === 'lunch') this.showAdvancedMessage(Math.floor(this.advancedState.minutes / 10) % 2 ? 'Aus der Hütte kommt Schnarchen. Auf dem Tisch stehen zwei verdächtig leere Gläser.' : 'Gundula und Uli führen eine interne Flüssigkeitsbesprechung durch. Die Tür bleibt zu.');
        else if (this.authorityPhase === 'patrol') this.preparePatrolEncounter();
        else this.showAdvancedMessage(id === 'gundula' ? 'Gundula prüft bereits die Sonntagsnachzahlung.' : 'Uli weist darauf hin, dass das Auto nicht dauerhaft am Zelt stehen darf.');
      };
    }
  }

  private checkPatrolSight(time: number): void {
    const player = (this as unknown as WorldInternals).player;
    if (!player || this.advancedState.encounter || time < 1000) return;
    const caughtFlag = `patrolCaught-day-${this.advancedState.day}`;
    if (this.advancedState.flags[caughtFlag] || this.distanceToPatrol() > 205) return;
    if (regionAt(player.x, player.y).id !== regionAt(this.patrolGundula.x, this.patrolGundula.y).id) return;
    gameStore.setFlag(caughtFlag);
    this.preparePatrolEncounter();
  }

  private preparePatrolEncounter(): void {
    const id = `patrol-control-${this.advancedState.day}`;
    ENCOUNTERS[id] = {
      id, speaker: 'Gundula & Uli', portrait: 'GU', intro: patrolOpening(this.advancedState),
      options: [
        {
          id: 'calm', label: 'Zustand sachlich erklären', hint: 'Fokus · Kater und Breitheit erschweren die Reaktion',
          challenge: { skill: 'focus', baseChance: 54, relation: 'gundula' },
          successText: 'Die Erklärung ist zusammenhängend genug. Der Kontrollgang zieht weiter.', failureText: 'Uli entdeckt drei Widersprüche, bevor du den ersten Satz beendet hast.',
          success: { relationships: { gundula: 2, uli: 2 }, metrics: { dignity: 3 }, flags: { patrolPassed: true }, minutes: 4 },
          failure: { relationships: { gundula: -5, uli: -4 }, metrics: { dignity: -5, chaos: 3 }, minutes: 6 },
        },
        {
          id: 'team', label: 'Aktives Team reden lassen', hint: 'Teamwork · bis zu drei Partner und ihre Sozialwerte zählen',
          challenge: { skill: 'teamwork', baseChance: 48, relation: 'gundula' },
          successText: 'Die Freundesgruppe produziert so viele parallele Erklärungen, dass Gundula nur eine Verwarnung notiert.', failureText: 'Drei Erklärungen ergeben vier Versionen. Uli beginnt mitzuschreiben.',
          success: { metrics: { reputation: 2, momentum: 3 }, flags: { patrolPassed: true }, minutes: 5 }, failure: { metrics: { dignity: -4, chaos: 5 }, minutes: 7 },
        },
        {
          id: 'batida', label: 'Batida-Protokoll aktivieren', hint: 'Chaos · benötigt Batida de Coco', requiredItem: 'batida',
          challenge: { skill: 'chaos', baseChance: 76, relation: 'gundula' },
          successText: 'Gundula erkennt das bekannte Kokos-Signal. Uli erklärt die Kontrolle für vorläufig beendet.', failureText: 'Die Flasche ist dieses Mal nur Alkohol und keine Verwaltungsabkürzung.',
          success: { relationships: { gundula: 4 }, metrics: { chaos: 3 }, flags: { patrolPassed: true }, minutes: 3 }, failure: { metrics: { dignity: -3, chaos: 4 }, minutes: 5 },
        },
      ],
    };
    gameStore.openEncounter(id);
  }

  private enforceVehicleRule(): void {
    const internals = this as unknown as WorldInternals;
    const returned = Boolean(this.advancedState.flags.firstBeerOpened || this.advancedState.flags.carReturnedToParking);
    const parkedOnPitch = Boolean(this.advancedState.flags.carParkedAtTaucherplatz) && !returned;
    internals.pitchCar?.setVisible(parkedOnPitch);
    internals.initialCar?.setVisible(!this.advancedState.flags.carParkedAtTaucherplatz || returned);
    if (returned && !this.advancedState.flags.carReturnedToParking && !this.carReturnApplied) {
      this.carReturnApplied = true;
      gameStore.setFlag('carReturnedToParking');
      this.showAdvancedMessage('FAHRZEUGREGEL · Nach dem Entladen steht das Auto wieder auf dem Parkplatz vor der Schranke.');
    }
  }

  private distanceToPatrol(): number {
    const player = (this as unknown as WorldInternals).player;
    return player ? Phaser.Math.Distance.Between(player.x, player.y, this.patrolGundula.x, this.patrolGundula.y) : Number.POSITIVE_INFINITY;
  }

  private showAdvancedMessage(text: string): void {
    (this as unknown as WorldInternals).showMessage?.call(this, text);
  }
}

function patrolPosition(progress: number): { x: number; y: number } {
  const clamped = Math.max(0, Math.min(0.9999, progress));
  const scaled = clamped * (PATROL_POINTS.length - 1);
  const index = Math.floor(scaled);
  const local = scaled - index;
  const from = PATROL_POINTS[index];
  const to = PATROL_POINTS[Math.min(PATROL_POINTS.length - 1, index + 1)];
  return { x: Phaser.Math.Linear(from.x, to.x, local), y: Phaser.Math.Linear(from.y, to.y, local) };
}
