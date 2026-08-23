import * as THREE from 'three';
import { ARRIVAL_STORY_PLACEMENTS } from '../game/aerialCampgroundPlan';
import { RELATIONSHIP_CHARACTERS } from '../game/content';
import { GameStore, type StorageAdapter } from '../game/state/GameStore';
import type { GameSnapshot } from '../game/types';
import { circleIntersectsAabb, moveCircle, type AabbCollider } from './collision';
import { THIRD_PERSON_CHARACTERS, THIRD_PERSON_INTERACTIONS, type ThirdPersonInteraction } from './content';
import { ThirdPersonInput } from './input';
import {
  ARRIVAL_QUEST,
  THIRD_PERSON_PROGRESS_KEY,
  completeCampfire,
  completeQuestInteraction,
  createDefaultProgress,
  currentObjective,
  isGateOpen,
  loadProgress,
  meetFriend,
  recordActivity,
  saveProgress,
  type ThirdPersonProgress,
} from './progression';
import { ThirdPersonUi, type DialogueChoice } from './ui';
import { AdriaWorld3D, createPlayerModel, type GraphicsQuality } from './world';
import { createGateCollider, createStaticColliders, planToWorld, WORLD_BOUNDS, worldToPlan } from './worldModel';
import './styles.css';

const THIRD_PERSON_GAME_KEY = 'tales-blaue-adria-third-person-state-v1';
const PLAYER_RADIUS = 0.27;
const SAVE_INTERVAL = 1.5;
const MINIMAP_INTERVAL = 0.09;

interface NearbyTarget {
  id: string;
  label: string;
  distance: number;
  type: 'interaction' | 'npc';
  interaction?: ThirdPersonInteraction;
}

class ThirdPersonGame {
  private readonly scene = new THREE.Scene();
  private readonly camera = new THREE.PerspectiveCamera(55, 1, 0.08, 130);
  private readonly renderer: THREE.WebGLRenderer;
  private readonly world: AdriaWorld3D;
  private readonly player = createPlayerModel();
  private readonly input: ThirdPersonInput;
  private readonly raycaster = new THREE.Raycaster();
  private readonly staticColliders = createStaticColliders();
  private readonly gateCollider = createGateCollider();
  private readonly store = new GameStore(new ThirdPersonStorage());
  private snapshot: GameSnapshot;
  private progress: ThirdPersonProgress;
  private playerYaw = Math.PI;
  private cameraYaw = 0;
  private cameraPitch = 0.43;
  private cameraDistance = 5.1;
  private started = false;
  private modalOpen = true;
  private nearby: NearbyTarget | null = null;
  private lastTime = performance.now();
  private saveAccumulator = 0;
  private timeAccumulator = 0;
  private minimapAccumulator = 0;
  private movementBlend = 0;
  private frame = 0;

  constructor(private readonly ui: ThirdPersonUi) {
    this.progress = loadProgress(localStorage);
    this.bootstrapStore();
    this.snapshot = this.store.snapshot();
    this.store.subscribe((snapshot) => {
      this.snapshot = snapshot;
      this.refreshHud();
    });

    const quality = selectQuality();
    this.scene.background = new THREE.Color(0x88b5c3);
    this.scene.fog = new THREE.FogExp2(0x7fa5a4, quality === 'high' ? 0.018 : 0.025);
    this.renderer = new THREE.WebGLRenderer({
      canvas: ui.canvas,
      antialias: quality === 'high',
      powerPreference: 'high-performance',
    });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.06;
    this.renderer.shadowMap.enabled = quality === 'high';
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, quality === 'high' ? 1.65 : 1.15));

    this.world = new AdriaWorld3D(this.scene, quality);
    this.scene.add(this.player);
    const spawn = this.safeSpawn(this.progress.player ?? this.defaultSpawn());
    this.player.position.set(spawn.x, 0, spawn.z);
    this.playerYaw = spawn.yaw;
    this.player.rotation.y = spawn.yaw;
    this.cameraYaw = spawn.yaw + Math.PI;
    this.world.playerShadow.position.set(spawn.x, 0.025, spawn.z);
    this.world.setGateOpen(isGateOpen(this.progress));
    this.setObjectiveTarget();

    this.input = new ThirdPersonInput(
      ui.canvas,
      ui.joystick,
      ui.joystickKnob,
      ui.lookZone,
      ui.sprintButton,
      () => this.interact(),
      () => this.toggleMenu(),
    );
    this.input.setEnabled(false);
    this.ui.canvas.addEventListener('wheel', (event) => {
      this.cameraDistance = THREE.MathUtils.clamp(this.cameraDistance + Math.sign(event.deltaY) * 0.42, 3.2, 7.3);
    }, { passive: true });
    this.ui.canvas.addEventListener('webglcontextlost', (event) => {
      event.preventDefault();
      this.setModalOpen(true);
      this.ui.showWebGlFailure('Der Browser hat den WebGL-Kontext verloren. Lade die Seite neu oder nutze den vollständigen 2D-Build.');
    });
    window.addEventListener('resize', () => this.resize());
    window.visualViewport?.addEventListener('resize', () => this.resize());
    window.addEventListener('beforeunload', () => this.persist());
    this.resize();
    this.refreshHud();
    this.ui.showStart(Boolean(localStorage.getItem(THIRD_PERSON_PROGRESS_KEY)));
    this.frame = requestAnimationFrame((time) => this.loop(time));
  }

  start(): void {
    this.started = true;
    this.ui.hideStart();
    this.setModalOpen(false);
    this.ui.showToast('3D-Build gestartet. Folge dem goldenen Zielmarker.', 'good');
  }

  setModalOpen(open: boolean): void {
    this.modalOpen = open;
    this.input?.setEnabled(this.started && !open);
  }

  toggleMenu(): void {
    if (!this.started) return;
    if (this.ui.handleEscape()) return;
    this.ui.showMenu();
  }

  requestReset(): void {
    this.ui.showDialogue(
      '3D-SPIELSTAND',
      'Wirklich von vorn beginnen?',
      'Nur der separate 3D-Spielstand wird gelöscht. Der vollständige 2D-Spielstand bleibt erhalten.',
      [
        { label: 'Abbrechen', action: () => this.ui.hideDialog() },
        {
          label: '3D-Spielstand löschen', tone: 'danger', action: () => {
            localStorage.removeItem(THIRD_PERSON_PROGRESS_KEY);
            localStorage.removeItem(THIRD_PERSON_GAME_KEY);
            window.location.reload();
          },
        },
      ],
    );
  }

  useItem(id: string): void {
    if (!this.started || this.modalOpen) return;
    const used = this.store.useItem(id);
    this.ui.showToast(used ? `${itemLabel(id)} benutzt.` : `${itemLabel(id)} ist nicht mehr im Rucksack.`, used ? 'good' : 'warn');
  }

  debugSnapshot(): Record<string, unknown> {
    return {
      started: this.started,
      modalOpen: this.modalOpen,
      objective: currentObjective(this.progress).id,
      objectiveTarget: currentObjective(this.progress).targetId,
      questIndex: this.progress.questIndex,
      gateOpen: isGateOpen(this.progress),
      player: { x: this.player.position.x, z: this.player.position.z },
      npcCount: this.world.npcObjects.size,
      interactionCount: this.world.interactionObjects.size,
      renderCalls: this.renderer.info.render.calls,
      triangles: this.renderer.info.render.triangles,
      contextLost: this.renderer.getContext().isContextLost(),
      startVisible: !document.getElementById('start-overlay')?.hidden,
      progressSaved: Boolean(localStorage.getItem(THIRD_PERSON_PROGRESS_KEY)),
      gameSaved: Boolean(localStorage.getItem(THIRD_PERSON_GAME_KEY)),
      legacySaveTouched: Boolean(localStorage.getItem('tales-blaue-adria-save-v1')),
    };
  }

  debugTeleportToObjective(): boolean {
    const target = this.world.interactionTargetPosition(currentObjective(this.progress).targetId);
    if (!target) return false;
    this.player.position.set(target.x, 0, target.z);
    this.world.playerShadow.position.set(target.x, 0.025, target.z);
    this.updateNearby();
    return true;
  }

  debugTeleportToPlan(x: number, y: number): void {
    const target = planToWorld({ x, y });
    this.player.position.set(target.x, 0, target.z);
    this.world.playerShadow.position.set(target.x, 0.025, target.z);
    this.updateNearby();
  }

  debugPersist(): void {
    this.persist();
  }

  interact(): void {
    if (!this.started || this.modalOpen || !this.nearby) return;
    if (this.nearby.type === 'npc') this.handleNpc(this.nearby.id);
    else if (this.nearby.interaction?.kind === 'story') this.handleStory(this.nearby.interaction);
    else if (this.nearby.interaction?.kind === 'minigame') this.handleActivity(this.nearby.interaction);
    else if (this.nearby.interaction) this.handleService(this.nearby.interaction);
  }

  private loop(time: number): void {
    const delta = Math.min(0.05, Math.max(0, (time - this.lastTime) / 1000));
    this.lastTime = time;
    if (this.started && !this.modalOpen) {
      this.updateCameraInput();
      this.updateMovement(delta);
      this.updateGameTime(delta);
      this.updateNearby();
      this.saveAccumulator += delta;
      if (this.saveAccumulator >= SAVE_INTERVAL) {
        this.saveAccumulator = 0;
        this.persist();
      }
    }
    this.updateCamera(delta);
    this.world.update(time / 1000, delta);
    this.minimapAccumulator += delta;
    if (this.minimapAccumulator >= MINIMAP_INTERVAL) {
      this.minimapAccumulator = 0;
      const target = this.world.interactionTargetPosition(currentObjective(this.progress).targetId);
      this.ui.updateMinimap(this.player.position, this.playerYaw, target);
    }
    this.renderer.render(this.scene, this.camera);
    this.frame = requestAnimationFrame((next) => this.loop(next));
  }

  private updateCameraInput(): void {
    const look = this.input.consumeLook();
    this.cameraYaw -= look.x * 0.0042;
    this.cameraPitch = THREE.MathUtils.clamp(this.cameraPitch - look.y * 0.0032, 0.18, 0.78);
  }

  private updateMovement(delta: number): void {
    const movement = this.input.movement();
    const inputLength = Math.min(1, Math.hypot(movement.x, movement.forward));
    const forwardX = -Math.sin(this.cameraYaw);
    const forwardZ = -Math.cos(this.cameraYaw);
    const rightX = Math.cos(this.cameraYaw);
    const rightZ = -Math.sin(this.cameraYaw);
    const directionX = rightX * movement.x + forwardX * movement.forward;
    const directionZ = rightZ * movement.x + forwardZ * movement.forward;
    const speed = movement.sprint ? 4.65 : 2.95;
    const colliders: AabbCollider[] = isGateOpen(this.progress)
      ? this.staticColliders
      : [...this.staticColliders, this.gateCollider];
    const next = moveCircle(
      { x: this.player.position.x, z: this.player.position.z },
      { x: directionX * speed * delta, z: directionZ * speed * delta },
      PLAYER_RADIUS,
      colliders,
      WORLD_BOUNDS,
    );
    const moved = Math.hypot(next.x - this.player.position.x, next.z - this.player.position.z) > 0.0001;
    this.player.position.x = next.x;
    this.player.position.z = next.z;
    this.world.playerShadow.position.x = next.x;
    this.world.playerShadow.position.z = next.z;
    this.movementBlend = THREE.MathUtils.damp(this.movementBlend, moved ? inputLength : 0, 10, delta);
    if (moved) {
      const targetYaw = Math.atan2(directionX, directionZ);
      this.playerYaw = dampAngle(this.playerYaw, targetYaw, 13, delta);
      this.player.rotation.y = this.playerYaw;
    }
    this.animatePlayer(performance.now() / 1000, delta, movement.sprint && moved);
  }

  private animatePlayer(time: number, delta: number, sprinting: boolean): void {
    const arms = this.player.userData.arms as THREE.Mesh[];
    const legs = this.player.userData.legs as THREE.Mesh[];
    const torso = this.player.userData.torso as THREE.Mesh;
    const cadence = sprinting ? 12.5 : 8.2;
    const amplitude = this.movementBlend * (sprinting ? 0.72 : 0.52);
    arms.forEach((arm, index) => { arm.rotation.x = THREE.MathUtils.damp(arm.rotation.x, Math.sin(time * cadence + index * Math.PI) * amplitude, 18, delta); });
    legs.forEach((leg, index) => { leg.rotation.x = THREE.MathUtils.damp(leg.rotation.x, Math.sin(time * cadence + (index + 1) * Math.PI) * amplitude, 18, delta); });
    torso.position.y = 1.28 + Math.abs(Math.sin(time * cadence)) * this.movementBlend * 0.035;
  }

  private updateCamera(delta: number): void {
    const target = new THREE.Vector3(this.player.position.x, 1.2, this.player.position.z);
    const horizontal = Math.cos(this.cameraPitch) * this.cameraDistance;
    const desired = new THREE.Vector3(
      target.x + Math.sin(this.cameraYaw) * horizontal,
      target.y + Math.sin(this.cameraPitch) * this.cameraDistance,
      target.z + Math.cos(this.cameraYaw) * horizontal,
    );
    const ray = desired.clone().sub(target);
    const desiredDistance = ray.length();
    ray.normalize();
    this.raycaster.set(target, ray);
    this.raycaster.far = desiredDistance;
    const hits = this.raycaster.intersectObjects(this.world.cameraBlockers, true);
    if (hits[0] && hits[0].distance < desiredDistance) desired.copy(target).addScaledVector(ray, Math.max(0.9, hits[0].distance - 0.32));
    this.camera.position.x = THREE.MathUtils.damp(this.camera.position.x, desired.x, 11, delta);
    this.camera.position.y = THREE.MathUtils.damp(this.camera.position.y, desired.y, 11, delta);
    this.camera.position.z = THREE.MathUtils.damp(this.camera.position.z, desired.z, 11, delta);
    this.camera.lookAt(target);
  }

  private updateGameTime(delta: number): void {
    this.timeAccumulator += delta;
    if (this.timeAccumulator >= 3.5) {
      const minutes = Math.floor(this.timeAccumulator / 3.5);
      this.timeAccumulator -= minutes * 3.5;
      this.store.advanceMinutes(minutes);
    }
  }

  private updateNearby(): void {
    const objective = currentObjective(this.progress);
    const gateOpen = isGateOpen(this.progress);
    const candidates: NearbyTarget[] = [];
    for (const interaction of THIRD_PERSON_INTERACTIONS) {
      if (interaction.requiresGate && !gateOpen) continue;
      if (interaction.kind === 'story' && interaction.id !== objective.id) continue;
      const point = planToWorld(interaction);
      const distance = Math.hypot(point.x - this.player.position.x, point.z - this.player.position.z);
      const radius = Math.max(0.92, interaction.radius * 0.012);
      if (distance <= radius) candidates.push({
        id: interaction.id,
        label: interaction.label,
        distance,
        type: 'interaction',
        interaction,
      });
    }
    for (const character of THIRD_PERSON_CHARACTERS) {
      if (candidates.some((candidate) => candidate.id === character.id)) continue;
      const npc = this.world.npcObjects.get(character.id);
      if (!npc) continue;
      const distance = npc.position.distanceTo(this.player.position);
      if (distance <= 1.25) candidates.push({ id: character.id, label: `Mit ${character.name} sprechen`, distance, type: 'npc' });
    }
    candidates.sort((a, b) => {
      const aObjective = a.id === objective.targetId ? -1 : 0;
      const bObjective = b.id === objective.targetId ? -1 : 0;
      return aObjective - bObjective || a.distance - b.distance;
    });
    this.nearby = candidates[0] ?? null;
    this.ui.setInteraction(this.nearby ? { id: this.nearby.id, label: this.nearby.label } : null);
  }

  private handleStory(interaction: ThirdPersonInteraction): void {
    const story = storyCopy(interaction.id);
    const complete = (message: string, flags: string[] = []): void => {
      this.ui.hideDialog();
      if (!completeQuestInteraction(this.progress, interaction.id)) return;
      for (const flag of flags) this.store.setFlag(flag, true);
      if (interaction.id === 'gundula') {
        this.store.socialize('gundula');
        this.store.socialize('uli');
      }
      if (interaction.id === 'firstBeer') this.store.useItem('bier');
      this.store.advanceMinutes(interaction.id === 'gundula' ? 12 : 4);
      saveProgress(localStorage, this.progress);
      this.world.setGateOpen(isGateOpen(this.progress));
      this.setObjectiveTarget();
      this.ui.showToast(message, 'good');
      this.refreshHud();
    };
    const choices: DialogueChoice[] = interaction.id === 'gundula'
      ? [
          {
            label: 'Reservierung zeigen und ruhig bleiben',
            detail: 'Die unwahrscheinlich erwachsene Variante.',
            tone: 'primary',
            action: () => complete('Die Schranke öffnet sich. Uli nennt es Kulanz.', ['gundulaConvinced', 'uliConvinced']),
          },
          {
            label: 'Uli zum einzigen echten Schrankenchef erklären',
            detail: 'Ego ist auch eine Zugangskarte.',
            action: () => complete('Uli öffnet die Schranke demonstrativ selbst.', ['gundulaConvinced', 'uliConvinced', 'authorityEgoFlattered']),
          },
        ]
      : [{
          label: story.action,
          tone: 'primary',
          action: () => complete(story.toast, story.flags),
        }];
    this.ui.showDialogue(story.kicker, story.title, story.text, choices);
  }

  private handleNpc(id: string): void {
    const relationship = RELATIONSHIP_CHARACTERS.find((character) => character.id === id);
    const visual = THIRD_PERSON_CHARACTERS.find((character) => character.id === id);
    if (!relationship && !visual) return;
    const objective = currentObjective(this.progress);
    const firstMeeting = objective.targetId === id && meetFriend(this.progress, id);
    const choices: DialogueChoice[] = [
      {
        label: firstMeeting ? 'Zum Zeltkreis schicken' : 'Kurz weiterreden',
        tone: 'primary',
        action: () => {
          this.store.socialize(id);
          saveProgress(localStorage, this.progress);
          this.ui.hideDialog();
          this.setObjectiveTarget();
          this.refreshHud();
          this.ui.showToast(firstMeeting ? `${relationship?.name ?? visual?.name} ist wieder Teil der Gruppe.` : 'Beziehung gepflegt. Zumindest technisch.', 'good');
        },
      },
      { label: 'Später', action: () => this.ui.hideDialog() },
    ];
    this.ui.showDialogue(
      relationship?.nickname.toUpperCase() ?? visual?.role ?? 'CAMPINGPLATZ',
      relationship?.name ?? visual?.name ?? id,
      relationship?.line ?? visual?.dialogue ?? 'Ein bedeutungsvoller Blick in Richtung Getränkekiste.',
      choices,
    );
  }

  private handleService(interaction: ThirdPersonInteraction): void {
    const objective = currentObjective(this.progress);
    if (interaction.id === 'homeTent') {
      this.store.rest(60);
      this.ui.showToast('Eine Stunde geschlafen. Der Platz ist noch da.', 'good');
      return;
    }
    if (interaction.id === 'sanitary') {
      this.store.relieve();
      this.ui.showToast('Sanitärstopp erledigt. Würde bleibt im positiven Bereich.', 'good');
      return;
    }
    if (interaction.id === 'campfire') {
      const completed = completeCampfire(this.progress);
      if (completed) {
        saveProgress(localStorage, this.progress);
        this.setObjectiveTarget();
        this.refreshHud();
        this.ui.showDialogue('TEAM GEBILDET', 'Alle wieder am Feuer', 'Fünf Freunde, ein Zeltkreis und noch immer kein realistischer Ablaufplan. Die freie 3D-Erkundung ist freigeschaltet.', [
          { label: 'Wochenende freigeben', tone: 'primary', action: () => this.ui.hideDialog() },
        ]);
      } else {
        this.ui.showDialogue('FEUERSTELLE', 'Noch fehlen Leute', `Aktuell sind ${this.progress.metFriends.length}/5 Freunde gefunden. ${objective.text}`, [
          { label: 'Weitersuchen', tone: 'primary', action: () => this.ui.hideDialog() },
        ]);
      }
      return;
    }
    if (interaction.id === 'noticeBoard') {
      this.ui.showDialogue(objective.kicker, objective.title, objective.text, [
        { label: 'Ziel weiter verfolgen', tone: 'primary', action: () => this.ui.hideDialog() },
      ]);
      return;
    }
    this.ui.showDialogue('ORT ENTDECKT', interaction.label, 'Der Ort ist im 3D-Build vollständig begehbar und bleibt als Orientierungspunkt auf der Karte erhalten.', [
      { label: 'Weiter', tone: 'primary', action: () => this.ui.hideDialog() },
    ]);
  }

  private handleActivity(interaction: ThirdPersonInteraction): void {
    const previous = this.progress.activityResults[interaction.id];
    this.ui.showActivity(interaction.id, interaction.label, previous?.best ?? 0, (score) => {
      const result = recordActivity(this.progress, interaction.id, score);
      const success = score >= 58;
      const baseId = baseActivityId(interaction.id);
      if (baseId) this.store.recordActivity(baseId, success, score >= 86 ? 'perfect' : success ? 'solid' : 'failed', score);
      else this.store.advanceMinutes(8);
      saveProgress(localStorage, this.progress);
      this.ui.showToast(
        success ? `${interaction.label}: ${score} Punkte. Bestwert ${Math.round(result.best)}.` : `${interaction.label}: ${score} Punkte. Noch einmal geht immer.`,
        success ? 'good' : 'warn',
      );
      this.refreshHud();
    });
  }

  private refreshHud(): void {
    if (!this.ui || !this.progress || !this.snapshot) return;
    const objective = currentObjective(this.progress);
    const target = this.world?.interactionTargetPosition(objective.targetId) ?? fallbackObjectivePosition(objective.targetId);
    const distance = target ? target.distanceTo(this.player?.position ?? target) : null;
    this.ui.updateHud(this.snapshot, this.progress, objective, distance);
  }

  private setObjectiveTarget(): void {
    const objective = currentObjective(this.progress);
    this.world.setActiveTarget(objective.targetId);
    this.refreshHud();
  }

  private persist(): void {
    if (!this.started) return;
    this.progress.player = { x: this.player.position.x, z: this.player.position.z, yaw: this.playerYaw };
    saveProgress(localStorage, this.progress);
    const plan = worldToPlan(this.player.position);
    this.store.setWorldPosition(plan.x, plan.y);
  }

  private resize(): void {
    const width = Math.max(1, this.ui.canvas.clientWidth);
    const height = Math.max(1, this.ui.canvas.clientHeight);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
  }

  private bootstrapStore(): void {
    let snapshot = this.store.snapshot();
    if (!snapshot.profile) {
      if (!snapshot.prologue.introSeen) this.store.completeIntro();
      this.store.setProfile({
        name: 'André', skinTone: '#d8a47c', hair: '#35241c', shirt: '#e4ae46', shorts: '#233949',
        hairStyle: 'kurz', bodyType: 'normal', accessory: 'keins', trait: 'chaotisch',
      });
      this.store.completeShopping({ wasser: 2, bier: 3, chips: 1, klopapier: 1 });
      snapshot = this.store.snapshot();
    }
    if (snapshot.mode !== 'world') this.store.setMode('world');
  }

  private defaultSpawn(): { x: number; z: number; yaw: number } {
    const point = planToWorld({ x: ARRIVAL_STORY_PLACEMENTS.trunk.x - 145, y: ARRIVAL_STORY_PLACEMENTS.trunk.y + 10 });
    return { ...point, yaw: Math.PI / 2 };
  }

  private safeSpawn(spawn: { x: number; z: number; yaw: number }): { x: number; z: number; yaw: number } {
    const clamped = moveCircle(spawn, { x: 0, z: 0 }, PLAYER_RADIUS, [], WORLD_BOUNDS);
    if (this.staticColliders.some((collider) => circleIntersectsAabb(clamped, PLAYER_RADIUS, collider))) return this.defaultSpawn();
    return { ...clamped, yaw: Number.isFinite(spawn.yaw) ? spawn.yaw : Math.PI / 2 };
  }
}

class ThirdPersonStorage implements StorageAdapter {
  getItem(): string | null { return localStorage.getItem(THIRD_PERSON_GAME_KEY); }
  setItem(_key: string, value: string): void { localStorage.setItem(THIRD_PERSON_GAME_KEY, value); }
  removeItem(): void { localStorage.removeItem(THIRD_PERSON_GAME_KEY); }
}

function storyCopy(id: string): { kicker: string; title: string; text: string; action: string; toast: string; flags: string[] } {
  const copy: Record<string, ReturnType<typeof storyCopy>> = {
    trunk: { kicker: 'KOFFERRAUM', title: 'Alles dabei, Planung nicht', text: 'Getränke, Zeltsäcke und Kabeltrommel sind da. Der Plan, wer was trägt, offenbar nicht.', action: 'Kofferraum öffnen', toast: 'Kofferraum geöffnet. Die Verantwortung ist jetzt sichtbar.', flags: ['thirdPersonTrunkOpened'] },
    reservationBoard: { kicker: 'SCHWARZES BRETT', title: 'Gefunden zwischen Regeln', text: 'Die Reservierung steht tatsächlich auf der Liste. Direkt unter einem Hinweis, dass Spaß ab 22 Uhr nur schriftlich erlaubt ist.', action: 'Reservierung markieren', toast: 'Reservierung gefunden. Jetzt zur Platzleitung.', flags: ['reservationSolved'] },
    taucherplatz: { kicker: 'TAUCHERPLATZ', title: 'Das Basislager', text: 'Der Wagen, die Zelte und der Stromkasten bilden eine logische Versorgungskette. Das ist für diese Gruppe bereits verdächtig professionell.', action: 'Wagen abstellen', toast: 'Taucherplatz erreicht. Als Nächstes braucht der Platz Strom.', flags: ['thirdPersonCampReached'] },
    powerBox: { kicker: 'STROMKASTEN', title: 'Spannung ohne Dialog', text: 'Kabel prüfen, Stecker setzen, Sicherung hoch. Zum ersten Mal heute löst Technik ein Problem ohne Meinung.', action: 'Strom verbinden', toast: 'Strom liegt an. Die Kabeltrommel liegt weiterhin im Weg.', flags: ['powerConnected'] },
    drinks: { kicker: 'GETRÄNKEKISTEN', title: 'Prioritäten in Glas', text: 'Die Kisten sind schwer, aber kulturell unverhandelbar.', action: 'Getränke ausladen', toast: 'Getränke ausgeladen. Die Gruppe spürt Hoffnung.', flags: ['drinksUnloaded'] },
    tents: { kicker: 'ZELTSÄCKE', title: 'Fünf Dächer, viele Meinungen', text: 'Die Zelte kommen in den offenen Ring um die Feuerstelle. Fluchtwege bleiben frei, Ausreden nicht.', action: 'Zeltsäcke verteilen', toast: 'Zelte verteilt. Niemand hat dieselbe Anleitung gelesen.', flags: ['tentsUnloaded'] },
    cable: { kicker: 'KABELTROMMEL', title: 'Die rote Lebensader', text: 'Die Trommel gehört zwischen Wagen und Stromkasten, ohne den Weg zur Stolperfalle zu erklären.', action: 'Kabel sauber verlegen', toast: 'Kabel liegt. Uli hätte es anders gemacht, weiß aber nicht wie.', flags: ['cablePlaced'] },
    firstBeer: { kicker: 'ERSTES BIER', title: 'Der Platz ist gegründet', text: 'Ein leises Zischen, ein kurzer Blick in die Runde und plötzlich ist aus Geometrie ein Wochenende geworden.', action: 'Erstes Bier öffnen', toast: 'Das erste Bier ist offen. Jetzt fehlt nur noch die Gruppe.', flags: ['firstBeerOpened'] },
  };
  return copy[id] ?? { kicker: 'ANKUNFT', title: 'Nächster Schritt', text: 'Die Aufgabe wartet.', action: 'Erledigen', toast: 'Aufgabe erledigt.', flags: [] };
}

function baseActivityId(id: string): 'battle' | 'flipCup' | 'beerPong' | 'flunkyball' | null {
  if (id === 'ronnyBattle') return 'battle';
  if (id === 'flipCup' || id === 'beerPong' || id === 'flunkyball') return id;
  return null;
}

function fallbackObjectivePosition(id: string | null): THREE.Vector3 | null {
  if (!id) return null;
  const objective = ARRIVAL_QUEST.find((entry) => entry.targetId === id);
  if (!objective) return null;
  const position = ARRIVAL_STORY_PLACEMENTS[id as keyof typeof ARRIVAL_STORY_PLACEMENTS];
  if (!position) return null;
  const world = planToWorld(position);
  return new THREE.Vector3(world.x, 0, world.z);
}

function dampAngle(current: number, target: number, lambda: number, delta: number): number {
  const difference = Math.atan2(Math.sin(target - current), Math.cos(target - current));
  return current + difference * (1 - Math.exp(-lambda * delta));
}

function selectQuality(): GraphicsQuality {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = matchMedia('(pointer: coarse)').matches;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
  return reduced || coarse || memory <= 4 ? 'low' : 'high';
}

function itemLabel(id: string): string {
  return ({ wasser: 'Wasser', bier: 'Bier', chips: 'Chips', kaffee: 'Kaffee', tablette: 'Kopfschmerztablette', wuerste: 'Würste' } as Record<string, string>)[id] ?? id;
}

const app = document.getElementById('app');
if (!app) throw new Error('Third-person application root is missing.');

let game: ThirdPersonGame | null = null;
let ui: ThirdPersonUi;
ui = new ThirdPersonUi(app, {
  action: () => game?.interact(),
  menu: () => game?.toggleMenu(),
  start: () => game?.start(),
  reset: () => game?.requestReset(),
  useItem: (id) => game?.useItem(id),
  modalChange: (open) => game?.setModalOpen(open),
});

try {
  game = new ThirdPersonGame(ui);
  if (new URLSearchParams(window.location.search).get('smoke') === '1') {
    (window as Window & { __talesThirdPerson?: unknown }).__talesThirdPerson = {
      start: () => game?.start(),
      snapshot: () => game?.debugSnapshot(),
      teleportObjective: () => game?.debugTeleportToObjective(),
      teleportPlan: (x: number, y: number) => game?.debugTeleportToPlan(x, y),
      action: () => game?.interact(),
      persist: () => game?.debugPersist(),
    };
  }
} catch (error) {
  console.error(error);
  ui.showWebGlFailure(error instanceof Error ? error.message : 'Unbekannter WebGL-Fehler.');
}
