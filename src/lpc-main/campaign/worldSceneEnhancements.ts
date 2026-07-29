import Phaser from 'phaser';
import { statusModifiers } from '../../game/statusSystem';
import type { GameSnapshot } from '../../game/types';
import { campaignMeta } from './metaStore';
import { CampaignWorldScene } from './worldScene';
import type { ActorRig } from './actors';
import type { AnalogVector } from './mobileControls';

interface SceneInternals {
  control: Phaser.GameObjects.Rectangle;
  controlBody: Phaser.Physics.Arcade.Body;
  player: ActorRig;
  actors: Map<string, ActorRig>;
  hooks: { getSnapshot: () => GameSnapshot };
  cameras: Phaser.Cameras.Scene2D.CameraManager;
  time: Phaser.Time.Clock;
}

interface NpcRoutineState {
  clock: number;
  bases: Map<string, { x: number; y: number }>;
  pausedUntil: Map<string, number>;
}

const analogTarget: AnalogVector = { x: 0, y: 0, magnitude: 0, angle: 0 };
const analogCurrent: AnalogVector = { x: 0, y: 0, magnitude: 0, angle: 0 };
const sceneState = new WeakMap<object, NpcRoutineState>();
let installed = false;

installWorldSceneEnhancements();

export function installWorldSceneEnhancements(): void {
  if (installed) return;
  installed = true;
  window.addEventListener('lpc-campaign-vector', (event) => {
    const vector = (event as CustomEvent<AnalogVector>).detail;
    analogTarget.x = clamp(vector?.x ?? 0, -1, 1);
    analogTarget.y = clamp(vector?.y ?? 0, -1, 1);
    analogTarget.magnitude = clamp(vector?.magnitude ?? 0, 0, 1);
    analogTarget.angle = vector?.angle ?? 0;
  });

  const originalUpdate = CampaignWorldScene.prototype.update;
  CampaignWorldScene.prototype.update = function enhancedUpdate(time: number, delta: number): void {
    originalUpdate.call(this, time, delta);
    const scene = this as unknown as SceneInternals;
    applyAnalogMovement(scene, delta);
    updateNpcRoutines(scene, time, delta);
    updateCameraLead(scene, delta);
  };
}

function applyAnalogMovement(scene: SceneInternals, delta: number): void {
  const modalOpen = document.body.classList.contains('campaign-modal-open');
  const smoothing = 1 - Math.exp(-delta / 52);
  const targetX = modalOpen ? 0 : analogTarget.x;
  const targetY = modalOpen ? 0 : analogTarget.y;
  analogCurrent.x = Phaser.Math.Linear(analogCurrent.x, targetX, smoothing);
  analogCurrent.y = Phaser.Math.Linear(analogCurrent.y, targetY, smoothing);
  analogCurrent.magnitude = Math.min(1, Math.hypot(analogCurrent.x, analogCurrent.y));
  if (analogCurrent.magnitude < .025) return;

  const snapshot = scene.hooks.getSnapshot();
  const modifiers = statusModifiers(snapshot.needs);
  const precisionCurve = .24 + Math.pow(analogCurrent.magnitude, .72) * .76;
  const speed = 205 * modifiers.movement * precisionCurve;
  const direction = new Phaser.Math.Vector2(analogCurrent.x, analogCurrent.y);
  if (direction.lengthSq() > 1) direction.normalize();
  direction.scale(speed);
  scene.controlBody.setVelocity(direction.x, direction.y);
  scene.player.updateWalk(direction.x, direction.y, delta);
}

function updateCameraLead(scene: SceneInternals, delta: number): void {
  const camera = scene.cameras.main;
  const modalOpen = document.body.classList.contains('campaign-modal-open');
  const targetOffsetX = modalOpen ? 0 : analogCurrent.x * -44;
  const targetOffsetY = modalOpen ? 0 : analogCurrent.y * -28;
  const smoothing = 1 - Math.exp(-delta / 180);
  camera.followOffset.x = Phaser.Math.Linear(camera.followOffset.x, targetOffsetX, smoothing);
  camera.followOffset.y = Phaser.Math.Linear(camera.followOffset.y, targetOffsetY, smoothing);
  const targetZoom = window.matchMedia('(pointer: coarse)').matches ? 1.07 - analogCurrent.magnitude * .035 : 1.03;
  camera.zoom = Phaser.Math.Linear(camera.zoom, targetZoom, smoothing * .4);
}

function updateNpcRoutines(scene: SceneInternals, time: number, delta: number): void {
  let state = sceneState.get(scene as object);
  if (!state) {
    state = { clock: 0, bases: new Map(), pausedUntil: new Map() };
    for (const [id, actor] of scene.actors) state.bases.set(id, { x: actor.x, y: actor.y });
    sceneState.set(scene as object, state);
  }
  state.clock += delta;
  if (state.clock < 70 || document.body.classList.contains('campaign-modal-open')) return;
  state.clock = 0;

  const meta = campaignMeta.snapshot();
  const movable = meta.authorityBattleWon
    ? ['andre', 'rene', 'lars', 'danny', 'susi', 'jule', 'kira', 'masl', 'felix', 'gregor']
    : ['andre', 'rene', 'lars', 'danny'];

  for (const id of movable) {
    const actor = scene.actors.get(id);
    const base = state.bases.get(id);
    if (!actor || !base || (state.pausedUntil.get(id) ?? 0) > time) continue;
    const seed = hash(id);
    const radiusX = 18 + seed % 34;
    const radiusY = 10 + seed % 23;
    const speed = 6100 + seed % 4700;
    const phase = time / speed + seed;
    const targetX = base.x + Math.sin(phase * Math.PI * 2) * radiusX;
    const targetY = base.y + Math.cos(phase * Math.PI * 1.6) * radiusY;
    const dx = targetX - actor.x;
    const dy = targetY - actor.y;
    const distanceToPlayer = Phaser.Math.Distance.Between(actor.x, actor.y, scene.control.x, scene.control.y);
    if (distanceToPlayer < 125) {
      state.pausedUntil.set(id, time + 1250);
      actor.updateWalk(0, 0, 70);
      continue;
    }
    const step = Math.min(1, 70 / 640);
    actor.setPosition(actor.x + dx * step, actor.y + dy * step);
    actor.updateWalk(dx, dy, 70);
  }
}

function hash(value: string): number {
  let result = 0;
  for (let index = 0; index < value.length; index += 1) result = (result * 31 + value.charCodeAt(index)) >>> 0;
  return result;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
