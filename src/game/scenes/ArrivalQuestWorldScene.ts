import Phaser from 'phaser';
import {
  ARRIVAL_POSITIONS,
  arrivalStage,
  arrivalTarget,
  arrivalUnloadCount,
  isArrivalIntroActive,
} from '../arrivalQuest';
import { applyArrivalLayout, TAUCHER_TENT } from '../arrivalLayout';
import { gameStore } from '../state/GameStore';
import type { GameSnapshot } from '../types';
import { worldDepth } from '../worldRealism';
import type { RegionId } from '../worldV2';
import { RealisticWorldScene } from './RealisticWorldScene';

interface StoryInteraction {
  id: string;
  regionId: RegionId;
  x: number;
  y: number;
  radius: number;
  prompt: string;
  action: () => void;
}

interface SceneInternals {
  player?: Phaser.Physics.Arcade.Sprite;
  interactions?: StoryInteraction[];
  showMessage?: (text: string) => void;
}

interface ToggleObstacle {
  zone: Phaser.GameObjects.Zone;
  body: Phaser.Physics.Arcade.StaticBody;
}

export class ArrivalQuestWorldScene extends RealisticWorldScene {
  private storyState!: GameSnapshot;
  private storyUnsubscribe?: () => void;
  private deferredInteractions: StoryInteraction[] = [];
  private deferredRestored = false;
  private deferredMarkers: Phaser.GameObjects.Image[] = [];
  private initialCar!: Phaser.GameObjects.Container;
  private pitchCar!: Phaser.GameObjects.Container;
  private powerBox!: Phaser.GameObjects.Container;
  private drinksCargo!: Phaser.GameObjects.Container;
  private tentCargo!: Phaser.GameObjects.Container;
  private cableCargo!: Phaser.GameObjects.Container;
  private taucherTent!: Phaser.GameObjects.Container;
  private homeDoorMarker!: Phaser.GameObjects.Image;
  private targetMarker!: Phaser.GameObjects.Container;
  private initialCarObstacle?: ToggleObstacle;
  private pitchCarObstacle?: ToggleObstacle;
  private tentObstacle?: ToggleObstacle;

  create(): void {
    applyArrivalLayout();
    super.create();
    this.storyState = gameStore.snapshot();
    this.captureAndReplaceInteractions();
    this.createStoryVisuals();
    this.installStoryInteractions();
    this.storyUnsubscribe = gameStore.subscribe((next) => this.refreshStory(next));
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.storyShutdown());
  }

  private captureAndReplaceInteractions(): void {
    const internals = this as unknown as SceneInternals;
    const existing = internals.interactions ?? [];
    const replaced = new Set(['npc-gundula', 'npc-uli', 'landmark-notice-board', 'home-door']);
    this.deferredInteractions = existing.filter((point) => !replaced.has(point.id));
    existing.length = 0;

    this.deferredMarkers = this.children.list.filter((child): child is Phaser.GameObjects.Image => (
      child instanceof Phaser.GameObjects.Image
      && ['door-marker', 'activity-marker'].includes(child.texture.key)
    ));
    this.deferredMarkers.forEach((marker) => marker.setVisible(false));
  }

  private createStoryVisuals(): void {
    this.drawPitchBoundary();
    this.initialCar = this.drawCar(650, 1568, 0x4f6f87, 'ANKUNFT');
    this.pitchCar = this.drawCar(1125, 985, 0x4f6f87, 'TAUCHERPLATZ');
    this.powerBox = this.drawPowerBox(ARRIVAL_POSITIONS.powerBox.x, ARRIVAL_POSITIONS.powerBox.y);
    this.drinksCargo = this.drawCargo(ARRIVAL_POSITIONS.drinks.x, ARRIVAL_POSITIONS.drinks.y, 'GETRÄNKE', 0xd8b44d);
    this.tentCargo = this.drawCargo(ARRIVAL_POSITIONS.tents.x, ARRIVAL_POSITIONS.tents.y, 'ZELTSÄCKE', 0x6c8fc9);
    this.cableCargo = this.drawCargo(ARRIVAL_POSITIONS.cable.x, ARRIVAL_POSITIONS.cable.y, 'KABEL', 0xd46f55);
    this.taucherTent = this.drawTaucherTent();
    this.homeDoorMarker = this.add.image(ARRIVAL_POSITIONS.homeDoor.x, ARRIVAL_POSITIONS.homeDoor.y, 'door-marker')
      .setDepth(worldDepth(ARRIVAL_POSITIONS.homeDoor.y + 20));
    this.targetMarker = this.drawTargetMarker();

    this.initialCarObstacle = this.makeToggleObstacle(565, 1538, 170, 62);
    this.pitchCarObstacle = this.makeToggleObstacle(1040, 955, 170, 62);
    this.tentObstacle = this.makeToggleObstacle(TAUCHER_TENT.x + 24, TAUCHER_TENT.y + 72, 107, 43);
  }

  private installStoryInteractions(): void {
    const internals = this as unknown as SceneInternals;
    const interactions = internals.interactions ?? [];
    interactions.push(
      this.interaction('arrival-trunk', 'arrival', ARRIVAL_POSITIONS.trunk, 82, 'Kofferraum durchsuchen', () => this.inspectTrunk()),
      this.interaction('arrival-board', 'arrival', ARRIVAL_POSITIONS.reservationBoard, 76, 'Reservierungsbrett prüfen', () => this.inspectReservationBoard()),
      this.interaction('npc-gundula-story', 'arrival', ARRIVAL_POSITIONS.gundula, 74, 'Bei Gundula anmelden', () => this.talkToGundula()),
      this.interaction('npc-uli-story', 'arrival', ARRIVAL_POSITIONS.uli, 74, 'Ulis Kontrolle bestehen', () => this.talkToUli()),
      this.interaction('arrival-debate', 'arrival', ARRIVAL_POSITIONS.gateDebate, 76, 'Einlassdiskussion beginnen', () => this.startEntryDebate()),
      this.interaction('arrival-park-car', 'central', ARRIVAL_POSITIONS.taucherplatz, 90, 'Wagen auf den Taucherplatz bringen', () => this.parkAtTaucherplatz()),
      this.interaction('arrival-power', 'central', ARRIVAL_POSITIONS.powerBox, 72, 'Stromanschluss organisieren', () => this.organizePower()),
      this.interaction('arrival-unload-drinks', 'central', ARRIVAL_POSITIONS.drinks, 66, 'Getränke ausladen', () => this.unload('arrivalDrinksUnloaded', 5, 'Getränkekisten und Kühlbox stehen. Die wichtigste Infrastruktur ist hergestellt.')),
      this.interaction('arrival-unload-tents', 'central', ARRIVAL_POSITIONS.tents, 66, 'Zeltsäcke ausladen', () => this.unload('arrivalTentsUnloaded', 8, 'Zeltsäcke, Planen und mehr Heringe als angemeldet liegen auf dem Taucherplatz.')),
      this.interaction('arrival-unload-cable', 'central', ARRIVAL_POSITIONS.cable, 66, 'Kabeltrommel anschließen', () => this.unloadCable()),
      this.interaction('arrival-first-beer', 'central', ARRIVAL_POSITIONS.firstBeer, 72, 'Erstes Bier öffnen', () => this.openFirstBeer()),
      this.interaction('home-door-story', 'central', ARRIVAL_POSITIONS.homeDoor, 68, 'Eigenes Zelt betreten', () => this.enterHomeTent()),
    );
  }

  private interaction(
    id: string,
    regionId: RegionId,
    position: { x: number; y: number },
    radius: number,
    prompt: string,
    action: () => void,
  ): StoryInteraction {
    return { id, regionId, x: position.x, y: position.y, radius, prompt, action };
  }

  private inspectTrunk(): void {
    if (this.storyState.flags.arrivalDocumentsFound) {
      this.showStoryMessage('Im Kofferraum liegen weiterhin der Zettel „T.T.“, Taucherplatz, 3 Personen, 2 Zelte und kein Strom. Nichts davon beschreibt die sichtbare Ladung vollständig.');
      return;
    }
    gameStore.setFlag('arrivalDocumentsFound');
    gameStore.setFlag('reservationClueInitialsTT');
    gameStore.setFlag('reservationClueTaucherplatz');
    gameStore.setFlag('reservationClueUnderreported');
    gameStore.advanceMinutes(4);
    this.showStoryMessage('UNTERLAGEN GEFUNDEN · Initialen T.T., Taucherplatz, 3 Personen, 2 Zelte, kein Strom. Auf dem Dach liegen bereits mehr als zwei Zeltsäcke.');
  }

  private inspectReservationBoard(): void {
    if (!this.storyState.flags.arrivalDocumentsFound) {
      this.showStoryMessage('Das Brett enthält zu viele Aliasnamen. Ohne den Zettel aus dem Kofferraum ist das reine Verwaltungsarchäologie.');
      return;
    }
    if (this.storyState.flags.reservationSolved) {
      this.showStoryMessage('Die aktuelle Buchung läuft unter „Tauchgruppe Tiefenrausch“. Frühere Namen wurden von Gundula nicht vergessen, nur verschieden falsch abgelegt.');
      return;
    }
    this.startStoryScene('reservation-puzzle');
  }

  private talkToGundula(): void {
    if (!this.storyState.flags.reservationSolved) {
      this.showStoryMessage('Gundula: „Ohne Reservierungsnamen bist du für mich nur Gepäck mit Frisur.“ Prüfe erst Zettel und Reservierungsbrett.');
      return;
    }
    if (!this.storyState.flags.gundulaConvinced) {
      gameStore.openEncounter('gundula-entry');
      return;
    }
    this.showStoryMessage('Gundula hat euch vorläufig eingetragen. Personen, zusätzliche Zelte und Strom bleiben als Sonntagsproblem markiert.');
  }

  private talkToUli(): void {
    if (!this.storyState.flags.gundulaConvinced) {
      this.showStoryMessage('Uli: „Erst Gundulas Stempel. Ich kontrolliere Geometrie, nicht Existenz.“');
      return;
    }
    if (!this.storyState.flags.uliInspectionPassed) {
      gameStore.openEncounter('uli-entry');
      return;
    }
    if (!this.storyState.flags.entryDebateWon) {
      this.showStoryMessage('Uli: „Kleidung vorläufig geduldet. Der Rest wird an der Schranke ausdiskutiert.“');
      return;
    }
    this.showStoryMessage('Uli: „Der Taucherplatz ist rechts hinter der Schranke. Groß genug ist er. Das war keine Einladung, mehr Zelte aufzustellen.“');
  }

  private startEntryDebate(): void {
    if (!this.storyState.flags.uliInspectionPassed) {
      this.showStoryMessage('Gundula und Uli diskutieren nur mit vollständig geprüften Problemfällen. Erst Anmeldung und Kleidungskontrolle abschließen.');
      return;
    }
    if (this.storyState.flags.entryDebateWon) {
      this.showStoryMessage('Die Schranke ist offen. Die Verwaltung hat die Niederlage auf „vorläufig“ umetikettiert.');
      return;
    }
    this.startStoryScene('entry-debate');
  }

  private parkAtTaucherplatz(): void {
    if (!this.storyState.flags.entryDebateWon) {
      this.showStoryMessage('Der Taucherplatz liegt hinter der geschlossenen Schranke. Erst die Einlassdiskussion gewinnen.');
      return;
    }
    if (this.storyState.flags.carParkedAtTaucherplatz) {
      this.showStoryMessage('Der Wagen steht auf dem östlichen Teil des Taucherplatzes und lässt noch genug Raum für die tatsächlich mitgebrachten Zelte.');
      return;
    }
    gameStore.setFlag('carParkedAtTaucherplatz');
    gameStore.advanceMinutes(10);
    this.showStoryMessage('TAUCHERPLATZ ERREICHT · Der Wagen steht. Gundulas Angabe „zwei Zelte“ wirkt angesichts der Ladung zunehmend theoretisch.');
  }

  private organizePower(): void {
    if (!this.storyState.flags.carParkedAtTaucherplatz) {
      this.showStoryMessage('Ohne Wagen, Kabel und Gepäck gibt es am Stromkasten nur abstrakte Probleme. Erst auf dem Taucherplatz parken.');
      return;
    }
    if (this.storyState.flags.powerConnected) {
      this.showStoryMessage('Der Anschluss ist organisiert. Sobald die Kabeltrommel ausgeladen ist, wird aus Verwaltungstheorie tatsächlich Strom.');
      return;
    }
    gameStore.openEncounter('power-box');
  }

  private unload(flag: string, minutes: number, text: string): void {
    if (!this.storyState.flags.powerConnected) {
      this.showStoryMessage('Erst klären, welchen Stromanschluss ihr benutzen dürft oder zumindest glaubwürdig benutzen könnt.');
      return;
    }
    if (this.storyState.flags[flag]) {
      this.showStoryMessage('Dieser Teil der Ladung steht bereits auf dem Taucherplatz.');
      return;
    }
    gameStore.setFlag(flag);
    gameStore.advanceMinutes(minutes);
    this.showStoryMessage(text);
  }

  private unloadCable(): void {
    if (!this.storyState.flags.powerConnected) {
      this.showStoryMessage('Erst Anschluss oder Adapter organisieren, dann lohnt sich die Kabeltrommel.');
      return;
    }
    if (this.storyState.flags.arrivalCableUnloaded) {
      this.showStoryMessage('Die Kabeltrommel liegt ausgerollt, der Kühlschrank brummt und die Stromgebühr wartet auf Sonntag.');
      return;
    }
    gameStore.setFlag('arrivalCableUnloaded');
    gameStore.setFlag('powerPhysicallyConnected');
    gameStore.advanceMinutes(7);
    this.showStoryMessage('STROM LÄUFT · Die Kabeltrommel verbindet Taucherplatz und Anschluss. Ob der Anschluss bezahlt ist, bleibt eine Frage für die Abreise.');
  }

  private openFirstBeer(): void {
    if (arrivalUnloadCount(this.storyState) < 3) {
      this.showStoryMessage(`Noch nicht. Erst vollständig ausladen (${arrivalUnloadCount(this.storyState)}/3). Ein Meilenstein braucht wenigstens eine halbwegs stehende Kühlbox.`);
      return;
    }
    if (this.storyState.flags.firstBeerOpened) {
      this.showStoryMessage('Das erste Bier ist bereits offen. Die Anreise lässt sich nicht ein zweites Mal erfolgreich abschließen.');
      return;
    }

    if ((this.storyState.inventory.bier ?? 0) > 0) gameStore.useItem('bier');
    else gameStore.setFlag('firstBeerBorrowedFromLars');
    gameStore.setFlag('firstBeerOpened');
    gameStore.setFlag('introComplete');
    gameStore.setFlag('uliConvinced');
    gameStore.advanceMinutes(2);
    this.cameras.main.flash(500, 244, 212, 123, false);
    this.showStoryMessage('MEILENSTEIN · ERSTES BIER. Reservierung gefunden, Schranke bezwungen, Taucherplatz bezogen, Strom irgendwie vorhanden. Das eigentliche Wochenende beginnt.');
  }

  private enterHomeTent(): void {
    if (!this.storyState.flags.arrivalTentsUnloaded) {
      this.showStoryMessage('Hier liegt bisher nur eine freie Parzelle. Das eigene Zelt steckt noch im Wagen.');
      return;
    }
    const internals = this as unknown as SceneInternals;
    const player = internals.player;
    if (player) gameStore.setWorldPosition(player.x, player.y);
    gameStore.enterInterior('home-tent');
    this.scene.start('interior');
  }

  private startStoryScene(key: string): void {
    const player = (this as unknown as SceneInternals).player;
    if (player) gameStore.setWorldPosition(player.x, player.y);
    this.scene.start(key);
  }

  private refreshStory(next: GameSnapshot): void {
    this.storyState = next;
    const introActive = isArrivalIntroActive(next);
    const parked = Boolean(next.flags.carParkedAtTaucherplatz);
    const tentsUnloaded = Boolean(next.flags.arrivalTentsUnloaded);

    this.initialCar?.setVisible(!parked);
    this.pitchCar?.setVisible(parked);
    this.powerBox?.setVisible(parked || next.flags.entryDebateWon);
    this.drinksCargo?.setVisible(Boolean(next.flags.arrivalDrinksUnloaded));
    this.tentCargo?.setVisible(Boolean(next.flags.arrivalTentsUnloaded));
    this.cableCargo?.setVisible(Boolean(next.flags.arrivalCableUnloaded));
    this.taucherTent?.setVisible(tentsUnloaded);
    this.homeDoorMarker?.setVisible(tentsUnloaded);
    this.setObstacleEnabled(this.initialCarObstacle, !parked);
    this.setObstacleEnabled(this.pitchCarObstacle, parked);
    this.setObstacleEnabled(this.tentObstacle, tentsUnloaded);

    if (this.targetMarker) {
      const target = arrivalTarget(next);
      this.targetMarker.setPosition(target.x, target.y - 38).setVisible(introActive);
    }

    if (!introActive) this.restoreDeferredWorld();
  }

  private restoreDeferredWorld(): void {
    if (this.deferredRestored) return;
    const interactions = (this as unknown as SceneInternals).interactions;
    interactions?.push(...this.deferredInteractions);
    this.deferredMarkers.forEach((marker) => marker.setVisible(true));
    this.deferredRestored = true;
  }

  private storyShutdown(): void {
    this.storyUnsubscribe?.();
  }

  private showStoryMessage(text: string): void {
    const showMessage = (this as unknown as SceneInternals).showMessage;
    if (showMessage) showMessage.call(this, text);
  }

  private drawPitchBoundary(): void {
    const g = this.add.graphics().setDepth(worldDepth(1235) - 1);
    g.fillStyle(0x8fb56d, 0.12).fillRoundedRect(970, 940, 300, 300, 24);
    g.lineStyle(4, 0xf4d47b, 0.38).strokeRoundedRect(970, 940, 300, 300, 24);
    g.lineStyle(2, 0xfff0ba, 0.24);
    for (let x = 990; x < 1250; x += 34) g.lineBetween(x, 952, x + 14, 952);
    this.add.text(1120, 955, 'TAUCHERPLATZ · T-7', {
      fontFamily: 'Arial Black, system-ui', fontSize: '12px', color: '#fff0ba', stroke: '#173027', strokeThickness: 4,
    }).setOrigin(0.5).setDepth(worldDepth(970));
  }

  private drawCar(x: number, y: number, color: number, label: string): Phaser.GameObjects.Container {
    const g = this.add.graphics();
    g.fillStyle(0x101817, 0.28).fillEllipse(0, 35, 178, 34)
      .fillStyle(color).fillRoundedRect(-78, -24, 156, 58, 18)
      .fillStyle(0x8ec1ce).fillRoundedRect(-45, -35, 82, 34, 10)
      .fillStyle(0x22363d).fillRoundedRect(-38, -30, 32, 24, 5).fillRoundedRect(2, -30, 29, 24, 5)
      .fillStyle(0x252b2b).fillCircle(-48, 34, 15).fillCircle(49, 34, 15)
      .fillStyle(0xf4d47b).fillCircle(74, 3, 7)
      .fillStyle(0xef765f).fillCircle(-75, 3, 6);
    const text = this.add.text(0, 55, label, {
      fontFamily: 'system-ui', fontSize: '10px', fontStyle: 'bold', color: '#fff0ba', backgroundColor: '#173027cc', padding: { x: 5, y: 2 },
    }).setOrigin(0.5);
    return this.add.container(x, y, [g, text]).setDepth(worldDepth(y + 42));
  }

  private drawPowerBox(x: number, y: number): Phaser.GameObjects.Container {
    const g = this.add.graphics();
    g.fillStyle(0x202b28, 0.28).fillEllipse(0, 38, 70, 20)
      .fillStyle(0x7d897f).fillRoundedRect(-32, -38, 64, 76, 7)
      .lineStyle(3, 0xcbd2c8, 0.6).strokeRoundedRect(-32, -38, 64, 76, 7)
      .fillStyle(0x252d2b).fillCircle(-15, 4, 9).fillCircle(15, 4, 9)
      .fillStyle(0xf4c75d).fillTriangle(-8, -29, 7, -29, 0, -10);
    const text = this.add.text(0, 52, 'STROM T-7', { fontFamily: 'system-ui', fontSize: '10px', fontStyle: 'bold', color: '#fff0ba', backgroundColor: '#173027cc', padding: { x: 5, y: 2 } }).setOrigin(0.5);
    return this.add.container(x, y, [g, text]).setDepth(worldDepth(y + 45));
  }

  private drawCargo(x: number, y: number, label: string, color: number): Phaser.GameObjects.Container {
    const g = this.add.graphics();
    g.fillStyle(0x111817, 0.26).fillEllipse(0, 20, 86, 22)
      .fillStyle(color).fillRoundedRect(-34, -18, 68, 38, 7)
      .lineStyle(3, 0x2b352f, 0.6).strokeRoundedRect(-34, -18, 68, 38, 7)
      .lineStyle(3, 0xf4e0a5, 0.55).lineBetween(-24, -5, 24, -5);
    const text = this.add.text(0, 34, label, { fontFamily: 'system-ui', fontSize: '9px', fontStyle: 'bold', color: '#fff0ba', backgroundColor: '#173027cc', padding: { x: 4, y: 2 } }).setOrigin(0.5);
    return this.add.container(x, y, [g, text]).setDepth(worldDepth(y + 25));
  }

  private drawTaucherTent(): Phaser.GameObjects.Container {
    const { x, y, width: w, height: h, color = 0x6c8fc9 } = TAUCHER_TENT;
    const g = this.add.graphics();
    g.fillStyle(0x112419, 0.24).fillEllipse(w / 2 + 7, h + 9, w * 1.04, 31)
      .fillStyle(0x445b80).fillTriangle(8, h + 2, w / 2 + 5, 6, w + 6, h + 2)
      .fillStyle(color).fillTriangle(0, h, w / 2, 0, w, h)
      .lineStyle(4, 0xf4e4b7, 0.56).lineBetween(w / 2, 7, w / 2, h);
    const label = this.add.text(w / 2, h / 2, 'DEIN ZELT', {
      fontFamily: 'Arial Black, system-ui', fontSize: '12px', color: '#213027', stroke: '#f3d98d', strokeThickness: 3,
    }).setOrigin(0.5);
    return this.add.container(x, y, [g, label]).setDepth(worldDepth(y + h));
  }

  private drawTargetMarker(): Phaser.GameObjects.Container {
    const ring = this.add.circle(0, 0, 16, 0xf4d47b, 0.12).setStrokeStyle(3, 0xf4d47b, 0.9);
    const pointer = this.add.triangle(0, 22, -8, -5, 8, -5, 0, 8, 0xf4d47b, 0.95);
    const label = this.add.text(0, -26, 'ZIEL', { fontFamily: 'Arial Black, system-ui', fontSize: '10px', color: '#fff3c8', backgroundColor: '#173027dd', padding: { x: 5, y: 2 } }).setOrigin(0.5);
    const marker = this.add.container(0, 0, [ring, pointer, label]).setDepth(74);
    this.tweens.add({ targets: marker, y: '+=8', alpha: { from: 0.72, to: 1 }, duration: 750, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
    return marker;
  }

  private makeToggleObstacle(x: number, y: number, width: number, height: number): ToggleObstacle | undefined {
    const player = (this as unknown as SceneInternals).player;
    if (!player) return undefined;
    const zone = this.add.zone(x + width / 2, y + height / 2, width, height);
    this.physics.add.existing(zone, true);
    this.physics.add.collider(player, zone);
    return { zone, body: zone.body as Phaser.Physics.Arcade.StaticBody };
  }

  private setObstacleEnabled(obstacle: ToggleObstacle | undefined, enabled: boolean): void {
    if (!obstacle) return;
    obstacle.zone.setActive(enabled);
    obstacle.body.enable = enabled;
  }
}
