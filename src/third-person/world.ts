import * as THREE from 'three';
import {
  AERIAL_FUNCTIONAL_AREAS,
  AERIAL_NODES,
  AERIAL_ROADS,
  AERIAL_SITE_POLYGONS,
  AERIAL_WATER_POLYGONS,
  ARRIVAL_CAR_POSITION,
  ARRIVAL_STORY_PLACEMENTS,
  BEACH_GATE,
  FRIEND_CAMP_CENTER,
  LANDMARK_PLACEMENTS,
  OBJECT_PLACEMENTS,
  TAUCHER_CAR_POSITION,
  type Placement,
  type PlanPoint,
} from '../game/aerialCampgroundPlan';
import { RELATIONSHIP_CHARACTERS } from '../game/content';
import { THIRD_PERSON_CHARACTERS, THIRD_PERSON_INTERACTIONS, type ThirdPersonInteraction } from './content';
import { planToWorld, WORLD_BOUNDS, WORLD_SCALE } from './worldModel';

export type GraphicsQuality = 'low' | 'high';

const MATERIALS = {
  grass: new THREE.MeshStandardMaterial({ color: 0x52754d, roughness: 1 }),
  grassLight: new THREE.MeshStandardMaterial({ color: 0x698c5d, roughness: 1 }),
  asphalt: new THREE.MeshStandardMaterial({ color: 0x4e5556, roughness: 0.98 }),
  gravel: new THREE.MeshStandardMaterial({ color: 0xa39472, roughness: 1 }),
  sand: new THREE.MeshStandardMaterial({ color: 0xd8bf82, roughness: 1 }),
  wood: new THREE.MeshStandardMaterial({ color: 0x744b2d, roughness: 0.92 }),
  darkWood: new THREE.MeshStandardMaterial({ color: 0x3e2d22, roughness: 1 }),
  metal: new THREE.MeshStandardMaterial({ color: 0x7f8a8b, roughness: 0.55, metalness: 0.3 }),
  canvas: new THREE.MeshStandardMaterial({ color: 0xb96743, roughness: 0.9 }),
  stone: new THREE.MeshStandardMaterial({ color: 0x77766f, roughness: 1 }),
  hedge: new THREE.MeshStandardMaterial({ color: 0x315b37, roughness: 1 }),
};

export class AdriaWorld3D {
  readonly root = new THREE.Group();
  readonly cameraBlockers: THREE.Object3D[] = [];
  readonly npcObjects = new Map<string, THREE.Group>();
  readonly interactionObjects = new Map<string, THREE.Group>();
  readonly interactionById = new Map<string, ThirdPersonInteraction>();
  readonly playerShadow: THREE.Mesh;

  private readonly animated: Array<(time: number, delta: number) => void> = [];
  private readonly targetBeacon = new THREE.Group();
  private readonly gatePivot = new THREE.Group();
  private readonly markerMaterial = new THREE.MeshBasicMaterial({ color: 0xd9bd61, transparent: true, opacity: 0.52, depthWrite: false });
  private activeTargetId: string | null = null;

  constructor(private readonly scene: THREE.Scene, private readonly quality: GraphicsQuality) {
    this.root.name = 'adria-3d-world';
    this.scene.add(this.root);
    this.playerShadow = new THREE.Mesh(
      new THREE.CircleGeometry(0.34, 24),
      new THREE.MeshBasicMaterial({ color: 0x08120e, transparent: true, opacity: 0.32, depthWrite: false }),
    );
    this.playerShadow.rotation.x = -Math.PI / 2;
    this.playerShadow.position.y = 0.025;
    this.root.add(this.playerShadow);
    this.build();
  }

  update(time: number, delta: number): void {
    for (const animate of this.animated) animate(time, delta);
    if (this.targetBeacon.visible) {
      const pulse = 1 + Math.sin(time * 4.2) * 0.13;
      this.targetBeacon.scale.setScalar(pulse);
      this.targetBeacon.rotation.y += delta * 0.75;
    }
  }

  setActiveTarget(id: string | null): void {
    this.activeTargetId = id;
    const interaction = id ? this.interactionById.get(id) : undefined;
    const npc = id ? this.npcObjects.get(id) : undefined;
    if (!interaction && !npc) {
      this.targetBeacon.visible = false;
    } else {
      const world = interaction ? planToWorld(interaction) : npc!.position;
      this.targetBeacon.position.set(world.x, 0.12, 'z' in world ? world.z : 0);
      this.targetBeacon.visible = true;
    }
    for (const [interactionId, group] of this.interactionObjects) {
      const ring = group.userData.ring as THREE.Mesh | undefined;
      if (!(ring?.material instanceof THREE.MeshBasicMaterial)) continue;
      const active = interactionId === id;
      ring.material.opacity = active ? 0.95 : (group.userData.kind === 'minigame' ? 0.42 : 0.18);
      ring.material.color.setHex(active ? 0xffd96f : group.userData.kind === 'minigame' ? 0x65d6c4 : 0xb6aa79);
      group.visible = active || group.userData.kind === 'minigame' || group.userData.kind === 'service';
    }
  }

  setGateOpen(open: boolean): void {
    this.gatePivot.userData.open = open;
  }

  interactionTargetPosition(id: string | null): THREE.Vector3 | null {
    if (!id) return null;
    const interaction = this.interactionById.get(id);
    if (interaction) {
      const world = planToWorld(interaction);
      return new THREE.Vector3(world.x, 0, world.z);
    }
    const npc = this.npcObjects.get(id);
    return npc ? npc.position.clone() : null;
  }

  private build(): void {
    this.buildLighting();
    this.buildTerrain();
    this.buildRoads();
    this.buildWater();
    this.buildObjects();
    this.buildArrivalProps();
    this.buildCampfire();
    this.buildGate();
    this.buildBeachFence();
    this.buildNpcs();
    this.buildInteractions();
    this.buildTargetBeacon();
    this.buildAtmosphere();
  }

  private buildLighting(): void {
    const hemi = new THREE.HemisphereLight(0xd6edff, 0x344125, 2.15);
    this.scene.add(hemi);
    const sun = new THREE.DirectionalLight(0xffefc4, this.quality === 'high' ? 3.2 : 2.6);
    sun.position.set(-10, 18, 8);
    sun.castShadow = this.quality === 'high';
    if (sun.shadow) {
      sun.shadow.mapSize.set(1536, 1536);
      sun.shadow.camera.left = -22;
      sun.shadow.camera.right = 22;
      sun.shadow.camera.top = 18;
      sun.shadow.camera.bottom = -18;
      sun.shadow.camera.near = 1;
      sun.shadow.camera.far = 45;
      sun.shadow.bias = -0.0008;
    }
    this.scene.add(sun);
  }

  private buildTerrain(): void {
    const base = new THREE.Mesh(
      new THREE.PlaneGeometry(WORLD_BOUNDS.maxX - WORLD_BOUNDS.minX + 10, WORLD_BOUNDS.maxZ - WORLD_BOUNDS.minZ + 10),
      new THREE.MeshStandardMaterial({ color: 0x283e2d, roughness: 1 }),
    );
    base.rotation.x = -Math.PI / 2;
    base.position.y = -0.09;
    base.receiveShadow = true;
    this.root.add(base);

    for (const polygon of AERIAL_SITE_POLYGONS) {
      const material = polygon.id.includes('beach')
        ? MATERIALS.sand
        : polygon.id.includes('arrival')
          ? new THREE.MeshStandardMaterial({ color: 0x667067, roughness: 1 })
          : MATERIALS.grass;
      const mesh = polygonMesh(polygon.points, material, 0);
      mesh.receiveShadow = true;
      mesh.name = `terrain:${polygon.id}`;
      this.root.add(mesh);
    }

    for (const area of Object.values(AERIAL_FUNCTIONAL_AREAS)) {
      const center = planToWorld({ x: area.x + area.width / 2, y: area.y + area.height / 2 });
      const tile = new THREE.Mesh(
        new THREE.BoxGeometry(area.width * WORLD_SCALE, 0.018, area.height * WORLD_SCALE),
        new THREE.MeshStandardMaterial({ color: area.fill, transparent: true, opacity: 0.28, roughness: 1 }),
      );
      tile.position.set(center.x, 0.012, center.z);
      tile.receiveShadow = true;
      this.root.add(tile);
    }
  }

  private buildRoads(): void {
    for (const road of AERIAL_ROADS) {
      const start = planToWorld(AERIAL_NODES[road.from]);
      const end = planToWorld(AERIAL_NODES[road.to]);
      const dx = end.x - start.x;
      const dz = end.z - start.z;
      const length = Math.hypot(dx, dz);
      const material = road.surface === 'asphalt' ? MATERIALS.asphalt : road.surface === 'sand' ? MATERIALS.sand : MATERIALS.gravel;
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(road.width * WORLD_SCALE, 0.035, length), material);
      mesh.position.set((start.x + end.x) / 2, 0.045, (start.z + end.z) / 2);
      mesh.rotation.y = Math.atan2(dx, dz);
      mesh.receiveShadow = true;
      mesh.name = `road:${road.id}`;
      this.root.add(mesh);
    }
  }

  private buildWater(): void {
    for (const polygon of AERIAL_WATER_POLYGONS) {
      const material = new THREE.MeshPhysicalMaterial({
        color: polygon.id === 'main-lake' ? 0x2b718b : 0x28677b,
        roughness: 0.22,
        metalness: 0.06,
        transmission: this.quality === 'high' ? 0.08 : 0,
        transparent: true,
        opacity: 0.9,
      });
      const water = polygonMesh(polygon.points, material, 0.025);
      water.name = `water:${polygon.id}`;
      this.root.add(water);
      this.animated.push((time) => {
        water.position.y = 0.025 + Math.sin(time * 0.85 + (polygon.id === 'main-lake' ? 0 : 1.3)) * 0.018;
        material.color.offsetHSL(0, 0, Math.sin(time * 0.35) * 0.0007);
      });
    }
  }

  private buildObjects(): void {
    for (const [id, placement] of Object.entries(OBJECT_PLACEMENTS)) {
      if (!placement.width || !placement.height) continue;
      const object = createWorldObject(id, placement, this.quality);
      if (!object) continue;
      object.name = `object:${id}`;
      this.root.add(object);
      if (isCameraBlocker(id)) this.cameraBlockers.push(object);
    }
  }

  private buildArrivalProps(): void {
    this.addCar(ARRIVAL_CAR_POSITION, 0x2f5965, 'arrival-car', Math.PI / 2);
    this.addCar(TAUCHER_CAR_POSITION, 0x6e3136, 'taucher-car', 0);
    this.addQuestProp('powerBox', ARRIVAL_STORY_PLACEMENTS.powerBox, 0x6b7a77, 'STROM');
    this.addQuestProp('drinks', ARRIVAL_STORY_PLACEMENTS.drinks, 0xd9a844, 'GETRÄNKE');
    this.addQuestProp('tents', ARRIVAL_STORY_PLACEMENTS.tents, 0x7e5135, 'ZELTE');
    this.addQuestProp('cable', ARRIVAL_STORY_PLACEMENTS.cable, 0xd95f38, 'KABEL');
    this.addQuestProp('firstBeer', ARRIVAL_STORY_PLACEMENTS.firstBeer, 0xe3c05f, 'ERSTES BIER', 0.16);

    const board = createSign('RESERVIERUNG', 1.15, 0.7, 0x5b3f29);
    setAtPlan(board, ARRIVAL_STORY_PLACEMENTS.reservationBoard, 0.38);
    this.root.add(board);
  }

  private addCar(point: PlanPoint, color: number, id: string, yaw: number): void {
    const group = new THREE.Group();
    const bodyMaterial = new THREE.MeshStandardMaterial({ color, roughness: 0.45, metalness: 0.18 });
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.56, 0.92), bodyMaterial);
    body.position.y = 0.5;
    body.castShadow = true;
    const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.48, 0.78), new THREE.MeshStandardMaterial({ color: 0xa9c3c6, roughness: 0.25, metalness: 0.15 }));
    cabin.position.set(-0.12, 0.94, 0);
    cabin.castShadow = true;
    group.add(body, cabin);
    const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x15191a, roughness: 1 });
    for (const x of [-0.58, 0.58]) for (const z of [-0.5, 0.5]) {
      const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.16, 16), wheelMaterial);
      wheel.rotation.x = Math.PI / 2;
      wheel.position.set(x, 0.28, z);
      group.add(wheel);
    }
    const world = planToWorld(point);
    group.position.set(world.x, 0, world.z);
    group.rotation.y = yaw;
    group.name = id;
    this.root.add(group);
    this.cameraBlockers.push(group);
  }

  private addQuestProp(id: string, point: PlanPoint, color: number, label: string, size = 0.34): void {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(size, size, size), new THREE.MeshStandardMaterial({ color, roughness: 0.75 }));
    mesh.position.y = size / 2;
    mesh.castShadow = true;
    const sprite = createTextSprite(label, '#fff3c7', 'rgba(20,28,23,.82)', 48);
    sprite.position.y = size + 0.42;
    sprite.scale.set(1.2, 0.3, 1);
    group.add(mesh, sprite);
    setAtPlan(group, point);
    group.name = `quest-prop:${id}`;
    this.root.add(group);
  }

  private buildCampfire(): void {
    const group = new THREE.Group();
    const stone = new THREE.MeshStandardMaterial({ color: 0x77736d, roughness: 1 });
    for (let index = 0; index < 10; index += 1) {
      const angle = (index / 10) * Math.PI * 2;
      const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(0.12, 0), stone);
      rock.scale.set(1.2, 0.65, 0.9);
      rock.position.set(Math.cos(angle) * 0.42, 0.09, Math.sin(angle) * 0.42);
      rock.castShadow = true;
      group.add(rock);
    }
    for (const angle of [-0.62, 0.62]) {
      const log = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.1, 0.7, 10), MATERIALS.darkWood);
      log.rotation.z = Math.PI / 2;
      log.rotation.y = angle;
      log.position.y = 0.16;
      group.add(log);
    }
    const flameMaterial = new THREE.MeshBasicMaterial({ color: 0xff9a38, transparent: true, opacity: 0.9 });
    const flame = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.72, 10), flameMaterial);
    flame.position.y = 0.55;
    group.add(flame);
    const light = new THREE.PointLight(0xff7a2f, this.quality === 'high' ? 2.1 : 1.25, 5.5, 2);
    light.position.y = 0.72;
    group.add(light);
    setAtPlan(group, FRIEND_CAMP_CENTER);
    group.name = 'landmark:campfire';
    this.root.add(group);
    this.animated.push((time) => {
      const flicker = 0.88 + Math.sin(time * 9.5) * 0.09 + Math.sin(time * 16.2) * 0.04;
      flame.scale.set(flicker, 0.9 + Math.sin(time * 12.7) * 0.12, flicker);
      light.intensity = (this.quality === 'high' ? 2 : 1.2) * flicker;
    });
  }

  private buildGate(): void {
    const world = planToWorld({ x: 900, y: 1400 });
    const postMaterial = new THREE.MeshStandardMaterial({ color: 0x424b46, roughness: 0.65, metalness: 0.35 });
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.22, 1.45, 0.22), postMaterial);
    post.position.set(world.x - 0.7, 0.72, world.z);
    post.castShadow = true;
    this.root.add(post);
    const arm = new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.13, 0.14), new THREE.MeshStandardMaterial({ color: 0xece4cc, roughness: 0.7 }));
    arm.position.set(0.72, 1.22, 0);
    arm.castShadow = true;
    for (let index = 0; index < 5; index += 1) {
      const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.138, 0.145), new THREE.MeshBasicMaterial({ color: 0xb83e35 }));
      stripe.position.set(0.22 + index * 0.28, 1.22, 0.003);
      this.gatePivot.add(stripe);
    }
    this.gatePivot.add(arm);
    this.gatePivot.position.set(world.x - 0.7, 0, world.z);
    this.root.add(this.gatePivot);
    this.cameraBlockers.push(post, arm);
    this.animated.push((_time, delta) => {
      const target = this.gatePivot.userData.open ? -Math.PI / 2 : 0;
      this.gatePivot.rotation.z = THREE.MathUtils.damp(this.gatePivot.rotation.z, target, 5.5, delta);
    });
  }

  private buildBeachFence(): void {
    const material = new THREE.MeshStandardMaterial({ color: 0x66553f, roughness: 0.9 });
    for (const segment of [
      { x: 1938, y: 0, width: 22, height: 600 },
      { x: 1938, y: 720, width: 22, height: 380 },
    ]) {
      const center = planToWorld({ x: segment.x + segment.width / 2, y: segment.y + segment.height / 2 });
      const fence = new THREE.Group();
      const length = segment.height * WORLD_SCALE;
      for (let offset = -length / 2; offset <= length / 2; offset += 1.25) {
        const post = new THREE.Mesh(new THREE.BoxGeometry(0.11, 1.15, 0.11), material);
        post.position.set(0, 0.58, offset);
        post.castShadow = true;
        fence.add(post);
      }
      for (const y of [0.38, 0.83]) {
        const rail = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.09, length), material);
        rail.position.y = y;
        fence.add(rail);
      }
      fence.position.set(center.x, 0, center.z);
      this.root.add(fence);
      this.cameraBlockers.push(fence);
    }
    const gateCenter = planToWorld({ x: BEACH_GATE.x, y: BEACH_GATE.y + BEACH_GATE.height / 2 });
    const label = createTextSprite('STRANDTOR', '#fff5cc', 'rgba(48,38,25,.84)', 44);
    label.position.set(gateCenter.x, 1.55, gateCenter.z);
    label.scale.set(1.45, 0.35, 1);
    this.root.add(label);
  }

  private buildNpcs(): void {
    const relationshipById = new Map(RELATIONSHIP_CHARACTERS.map((character) => [character.id, character]));
    for (const visual of THIRD_PERSON_CHARACTERS) {
      const relationship = relationshipById.get(visual.id);
      const group = createPerson({
        skin: visual.skin,
        shirt: visual.shirt,
        trousers: visual.trousers,
        hair: visual.hair,
        name: visual.name,
        role: relationship?.nickname ?? visual.role,
      });
      const world = planToWorld(visual);
      group.position.set(world.x, 0, world.z);
      group.rotation.y = Math.PI + seededAngle(visual.id) * 0.45;
      group.name = `npc:${visual.id}`;
      this.root.add(group);
      this.npcObjects.set(visual.id, group);
      this.animated.push((time) => {
        const offset = seededAngle(visual.id) * Math.PI;
        const torso = group.userData.torso as THREE.Object3D;
        torso.position.y = 1.28 + Math.sin(time * 1.45 + offset) * 0.018;
      });
    }
  }

  private buildInteractions(): void {
    for (const interaction of THIRD_PERSON_INTERACTIONS) {
      this.interactionById.set(interaction.id, interaction);
      const group = new THREE.Group();
      const ringMaterial = this.markerMaterial.clone();
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.43, 0.045, 8, 32), ringMaterial);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 0.055;
      group.add(ring);
      const world = planToWorld(interaction);
      group.position.set(world.x, 0, world.z);
      group.userData.ring = ring;
      group.userData.kind = interaction.kind;
      group.name = `interaction:${interaction.id}`;
      this.root.add(group);
      this.interactionObjects.set(interaction.id, group);
      if (interaction.kind === 'minigame') {
        const icon = createTextSprite('★', '#0b2524', '#68d6c5', 72);
        icon.position.y = 0.72;
        icon.scale.set(0.34, 0.34, 1);
        group.add(icon);
      }
    }
  }

  private buildTargetBeacon(): void {
    const ringMaterial = new THREE.MeshBasicMaterial({ color: 0xffd96f, transparent: true, opacity: 0.92, depthWrite: false });
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.065, 10, 40), ringMaterial);
    ring.rotation.x = Math.PI / 2;
    const arrow = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.5, 4), new THREE.MeshBasicMaterial({ color: 0xffdf7c }));
    arrow.position.y = 1.55;
    arrow.rotation.x = Math.PI;
    this.targetBeacon.add(ring, arrow);
    this.targetBeacon.visible = false;
    this.root.add(this.targetBeacon);
  }

  private buildAtmosphere(): void {
    if (this.quality !== 'high') return;
    const cloudMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.42, depthWrite: false });
    for (let index = 0; index < 6; index += 1) {
      const cloud = new THREE.Group();
      for (let puff = 0; puff < 4; puff += 1) {
        const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.8 + puff * 0.09, 12, 8), cloudMaterial);
        mesh.scale.y = 0.42;
        mesh.position.x = puff * 0.7;
        cloud.add(mesh);
      }
      cloud.position.set(-16 + index * 6.2, 8 + (index % 2) * 1.2, -10 + (index % 3) * 7);
      this.scene.add(cloud);
      this.animated.push((_time, delta) => {
        cloud.position.x += delta * (0.13 + index * 0.012);
        if (cloud.position.x > 20) cloud.position.x = -20;
      });
    }
  }
}

export function createPlayerModel(): THREE.Group {
  const group = createPerson({
    skin: 0xe2a478,
    shirt: 0xe7b04d,
    trousers: 0x243c4d,
    hair: 0x3a291f,
    name: '',
    role: '',
  }, false);
  group.name = 'player';
  const backpack = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.58, 0.22), new THREE.MeshStandardMaterial({ color: 0x4d5a3a, roughness: 0.92 }));
  backpack.position.set(0, 1.27, -0.22);
  backpack.castShadow = true;
  group.add(backpack);
  return group;
}

function createWorldObject(id: string, placement: Placement, quality: GraphicsQuality): THREE.Group | null {
  const center = {
    x: placement.x + (placement.width ?? 0) / 2,
    y: placement.y + (placement.height ?? 0) / 2,
  };
  const width = Math.max(0.2, (placement.width ?? 30) * WORLD_SCALE);
  const depth = Math.max(0.2, (placement.height ?? 30) * WORLD_SCALE);
  let group: THREE.Group;
  if (id.includes('tree')) group = createTree(Math.max(width, depth) * 0.32, quality);
  else if (id.includes('tent')) group = createTent(width * 0.82, depth * 0.78, id);
  else if (id.includes('camper')) group = createCamper(width * 0.9, depth * 0.8, id);
  else if (id.includes('bench')) group = createBench(width, depth);
  else if (id.includes('table')) group = createTable(width, depth);
  else if (id.includes('lantern')) group = createLantern();
  else if (id.includes('sign')) group = createSign(labelForObject(id), Math.max(0.7, width), 0.52, 0x5b412a);
  else if (id.includes('rock')) group = createRock(width, depth);
  else if (id.includes('dock')) group = createDock(width, depth);
  else if (id.includes('hedge')) group = createHedge(width, depth);
  else if (id.includes('flowerbed')) group = createFlowerbed(width, depth, quality);
  else if (id.includes('stage')) group = createStage(width, depth);
  else if (id === 'party') group = createPartyTent(width, depth);
  else if (isBuildingId(id)) group = createBuilding(id, width, depth);
  else if (id.includes('fence')) return null;
  else group = createCrate(width, depth);
  setAtPlan(group, center);
  return group;
}

function createBuilding(id: string, width: number, depth: number): THREE.Group {
  const group = new THREE.Group();
  const height = id === 'clubhouse' ? 2.25 : id.includes('lifeguard') ? 1.7 : 1.95;
  const wallColor = id === 'reception' ? 0xd6c89f : id === 'sanitary' ? 0xc8d3c6 : id.includes('kiosk') ? 0x9f684d : 0xb99d78;
  const wall = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), new THREE.MeshStandardMaterial({ color: wallColor, roughness: 0.88 }));
  wall.position.y = height / 2;
  wall.castShadow = true;
  wall.receiveShadow = true;
  group.add(wall);
  const roof = new THREE.Mesh(new THREE.ConeGeometry(Math.max(width, depth) * 0.73, 0.62, 4), new THREE.MeshStandardMaterial({ color: 0x714134, roughness: 0.92 }));
  roof.rotation.y = Math.PI / 4;
  roof.scale.z = Math.max(0.7, depth / Math.max(width, depth));
  roof.position.y = height + 0.31;
  roof.castShadow = true;
  group.add(roof);
  const door = new THREE.Mesh(new THREE.BoxGeometry(Math.min(0.55, width * 0.25), 1.25, 0.06), new THREE.MeshStandardMaterial({ color: 0x4a382c, roughness: 1 }));
  door.position.set(0, 0.63, depth / 2 + 0.035);
  group.add(door);
  for (const side of [-1, 1]) {
    const window = new THREE.Mesh(new THREE.PlaneGeometry(Math.min(0.62, width * 0.2), 0.55), new THREE.MeshStandardMaterial({ color: 0x99c5cf, emissive: 0x102a30, emissiveIntensity: 0.25, roughness: 0.2 }));
    window.position.set(side * width * 0.27, 1.2, depth / 2 + 0.036);
    group.add(window);
  }
  const label = createTextSprite(labelForObject(id), '#fff3cf', 'rgba(34,34,27,.83)', 44);
  label.position.set(0, height + 0.82, 0);
  label.scale.set(Math.min(2.6, Math.max(1.25, width * 0.8)), 0.36, 1);
  group.add(label);
  return group;
}

function createTent(width: number, depth: number, id: string): THREE.Group {
  const group = new THREE.Group();
  const colors = [0x9f5d3e, 0x527b70, 0x6d658f, 0xa67b3c, 0x47708c];
  const color = colors[Math.abs(hash(id)) % colors.length];
  const tent = new THREE.Mesh(new THREE.ConeGeometry(Math.max(width, depth) * 0.58, 1.35, 4), new THREE.MeshStandardMaterial({ color, roughness: 0.95, side: THREE.DoubleSide }));
  tent.rotation.y = Math.PI / 4;
  tent.scale.set(width / Math.max(width, depth), 1, depth / Math.max(width, depth));
  tent.position.y = 0.67;
  tent.castShadow = true;
  group.add(tent);
  const opening = new THREE.Mesh(new THREE.CircleGeometry(0.28, 3), new THREE.MeshBasicMaterial({ color: 0x1b2422 }));
  opening.position.set(0, 0.4, depth * 0.42);
  group.add(opening);
  return group;
}

function createCamper(width: number, depth: number, id: string): THREE.Group {
  const group = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(width, 1.35, depth), new THREE.MeshStandardMaterial({ color: 0xe8e1cf, roughness: 0.78 }));
  body.position.y = 0.82;
  body.castShadow = true;
  group.add(body);
  const stripe = new THREE.Mesh(new THREE.BoxGeometry(width + 0.01, 0.25, depth + 0.012), new THREE.MeshStandardMaterial({ color: Math.abs(hash(id)) % 2 ? 0x66847c : 0xa25f45, roughness: 0.75 }));
  stripe.position.y = 0.82;
  group.add(stripe);
  for (const x of [-width * 0.3, width * 0.3]) {
    const window = new THREE.Mesh(new THREE.PlaneGeometry(width * 0.22, 0.42), new THREE.MeshStandardMaterial({ color: 0x7fa7ad, roughness: 0.28 }));
    window.position.set(x, 1.18, depth / 2 + 0.008);
    group.add(window);
  }
  return group;
}

function createTree(radius: number, quality: GraphicsQuality): THREE.Group {
  const group = new THREE.Group();
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.16, radius * 0.22, 1.55, 8), new THREE.MeshStandardMaterial({ color: 0x5a3a26, roughness: 1 }));
  trunk.position.y = 0.78;
  trunk.castShadow = true;
  group.add(trunk);
  const crownMaterial = new THREE.MeshStandardMaterial({ color: 0x315e38, roughness: 1 });
  const crownCount = quality === 'high' ? 5 : 3;
  for (let index = 0; index < crownCount; index += 1) {
    const angle = index / crownCount * Math.PI * 2;
    const crown = new THREE.Mesh(new THREE.IcosahedronGeometry(radius * (index === 0 ? 1.05 : 0.78), 1), crownMaterial);
    crown.position.set(Math.cos(angle) * radius * 0.46, 1.75 + (index % 2) * 0.35, Math.sin(angle) * radius * 0.46);
    crown.castShadow = true;
    group.add(crown);
  }
  return group;
}

function createBench(width: number, depth: number): THREE.Group {
  const group = new THREE.Group();
  const seat = new THREE.Mesh(new THREE.BoxGeometry(width, 0.12, Math.max(0.28, depth)), MATERIALS.wood);
  seat.position.y = 0.48;
  seat.castShadow = true;
  group.add(seat);
  for (const x of [-width * 0.36, width * 0.36]) {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.48, 0.12), MATERIALS.darkWood);
    leg.position.set(x, 0.24, 0);
    group.add(leg);
  }
  return group;
}

function createTable(width: number, depth: number): THREE.Group {
  const group = createBench(width, Math.max(0.38, depth));
  const top = group.children[0];
  top.position.y = 0.78;
  return group;
}

function createLantern(): THREE.Group {
  const group = new THREE.Group();
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.05, 1.55, 8), MATERIALS.metal);
  pole.position.y = 0.77;
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.13, 10, 8), new THREE.MeshStandardMaterial({ color: 0xffe3a1, emissive: 0xffa83c, emissiveIntensity: 1.4 }));
  bulb.position.y = 1.52;
  group.add(pole, bulb);
  return group;
}

function createSign(text: string, width: number, height: number, color: number): THREE.Group {
  const group = new THREE.Group();
  const board = new THREE.Mesh(new THREE.BoxGeometry(width, height, 0.1), new THREE.MeshStandardMaterial({ color, roughness: 0.9 }));
  board.position.y = 1.05;
  board.castShadow = true;
  const post = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.1, 0.1), MATERIALS.darkWood);
  post.position.y = 0.55;
  const label = createTextSprite(text, '#fff1c5', 'rgba(55,37,24,.92)', 46);
  label.position.set(0, 1.05, 0.07);
  label.scale.set(width * 0.88, height * 0.45, 1);
  group.add(post, board, label);
  return group;
}

function createRock(width: number, depth: number): THREE.Group {
  const group = new THREE.Group();
  const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(Math.max(width, depth) * 0.42, 0), MATERIALS.stone);
  rock.scale.set(width / Math.max(width, depth), 0.65, depth / Math.max(width, depth));
  rock.position.y = Math.max(width, depth) * 0.25;
  rock.castShadow = true;
  group.add(rock);
  return group;
}

function createDock(width: number, depth: number): THREE.Group {
  const group = new THREE.Group();
  const deck = new THREE.Mesh(new THREE.BoxGeometry(width, 0.18, depth), MATERIALS.wood);
  deck.position.y = 0.14;
  deck.castShadow = true;
  deck.receiveShadow = true;
  group.add(deck);
  return group;
}

function createHedge(width: number, depth: number): THREE.Group {
  const group = new THREE.Group();
  const count = Math.max(3, Math.ceil(width / 0.48));
  for (let index = 0; index < count; index += 1) {
    const bush = new THREE.Mesh(new THREE.IcosahedronGeometry(0.36, 1), MATERIALS.hedge);
    bush.scale.set(1, 0.9 + (index % 2) * 0.18, Math.max(0.75, depth / 0.65));
    bush.position.set(-width / 2 + (index + 0.5) * width / count, 0.38, 0);
    bush.castShadow = true;
    group.add(bush);
  }
  return group;
}

function createFlowerbed(width: number, depth: number, quality: GraphicsQuality): THREE.Group {
  const group = new THREE.Group();
  const soil = new THREE.Mesh(new THREE.BoxGeometry(width, 0.08, depth), new THREE.MeshStandardMaterial({ color: 0x4b3829, roughness: 1 }));
  soil.position.y = 0.04;
  group.add(soil);
  const count = quality === 'high' ? 11 : 5;
  for (let index = 0; index < count; index += 1) {
    const flower = new THREE.Mesh(new THREE.SphereGeometry(0.055, 7, 5), new THREE.MeshBasicMaterial({ color: [0xe9858b, 0xf2d46f, 0xa886d5][index % 3] }));
    flower.position.set(-width / 2 + ((index * 41) % 100) / 100 * width, 0.18, -depth / 2 + ((index * 67) % 100) / 100 * depth);
    group.add(flower);
  }
  return group;
}

function createStage(width: number, depth: number): THREE.Group {
  const group = new THREE.Group();
  const deck = new THREE.Mesh(new THREE.BoxGeometry(width, 0.45, depth), MATERIALS.darkWood);
  deck.position.y = 0.22;
  deck.castShadow = true;
  group.add(deck);
  for (const x of [-width / 2 + 0.12, width / 2 - 0.12]) for (const z of [-depth / 2 + 0.12, depth / 2 - 0.12]) {
    const pole = new THREE.Mesh(new THREE.BoxGeometry(0.1, 2.1, 0.1), MATERIALS.metal);
    pole.position.set(x, 1.25, z);
    group.add(pole);
  }
  return group;
}

function createPartyTent(width: number, depth: number): THREE.Group {
  const group = new THREE.Group();
  const roof = new THREE.Mesh(new THREE.ConeGeometry(Math.max(width, depth) * 0.72, 0.72, 4), new THREE.MeshStandardMaterial({ color: 0xe5d8bc, roughness: 0.92, side: THREE.DoubleSide }));
  roof.rotation.y = Math.PI / 4;
  roof.scale.z = depth / Math.max(width, depth);
  roof.position.y = 2.05;
  roof.castShadow = true;
  group.add(roof);
  for (const x of [-width / 2 * 0.82, width / 2 * 0.82]) for (const z of [-depth / 2 * 0.82, depth / 2 * 0.82]) {
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2, 8), MATERIALS.metal);
    pole.position.set(x, 1, z);
    group.add(pole);
  }
  return group;
}

function createCrate(width: number, depth: number): THREE.Group {
  const group = new THREE.Group();
  const crate = new THREE.Mesh(new THREE.BoxGeometry(width, Math.min(0.8, Math.max(0.25, depth)), depth), MATERIALS.wood);
  crate.position.y = Math.min(0.8, Math.max(0.25, depth)) / 2;
  crate.castShadow = true;
  group.add(crate);
  return group;
}

interface PersonStyle {
  skin: number;
  shirt: number;
  trousers: number;
  hair: number;
  name: string;
  role: string;
}

function createPerson(style: PersonStyle, label = true): THREE.Group {
  const group = new THREE.Group();
  const shirt = new THREE.MeshStandardMaterial({ color: style.shirt, roughness: 0.86 });
  const skin = new THREE.MeshStandardMaterial({ color: style.skin, roughness: 0.82 });
  const trousers = new THREE.MeshStandardMaterial({ color: style.trousers, roughness: 0.92 });
  const hair = new THREE.MeshStandardMaterial({ color: style.hair, roughness: 0.98 });
  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.29, 0.5, 5, 10), shirt);
  torso.position.y = 1.28;
  torso.castShadow = true;
  group.add(torso);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.24, 14, 10), skin);
  head.position.y = 1.93;
  head.castShadow = true;
  group.add(head);
  const hairCap = new THREE.Mesh(new THREE.SphereGeometry(0.248, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.52), hair);
  hairCap.position.y = 1.98;
  group.add(hairCap);
  const limbGeometry = new THREE.CapsuleGeometry(0.085, 0.42, 4, 8);
  const arms: THREE.Mesh[] = [];
  const legs: THREE.Mesh[] = [];
  for (const side of [-1, 1]) {
    const arm = new THREE.Mesh(limbGeometry, shirt);
    arm.position.set(side * 0.36, 1.28, 0);
    arm.rotation.z = side * 0.08;
    arm.castShadow = true;
    arms.push(arm);
    group.add(arm);
    const leg = new THREE.Mesh(limbGeometry, trousers);
    leg.position.set(side * 0.14, 0.55, 0);
    leg.castShadow = true;
    legs.push(leg);
    group.add(leg);
  }
  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 6), skin);
  nose.position.set(0, 1.92, 0.225);
  group.add(nose);
  if (label && style.name) {
    const text = createTextSprite(`${style.name}\n${style.role}`, '#fff5d8', 'rgba(16,29,24,.86)', 44);
    text.position.y = 2.6;
    text.scale.set(1.7, 0.48, 1);
    group.add(text);
  }
  group.userData = { torso, arms, legs };
  return group;
}

function polygonMesh(points: PlanPoint[], material: THREE.Material, y: number): THREE.Mesh {
  const shape = new THREE.Shape();
  points.forEach((point, index) => {
    const world = planToWorld(point);
    if (index === 0) shape.moveTo(world.x, world.z);
    else shape.lineTo(world.x, world.z);
  });
  shape.closePath();
  const geometry = new THREE.ShapeGeometry(shape);
  geometry.rotateX(Math.PI / 2);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.y = y;
  return mesh;
}

function createTextSprite(text: string, color: string, background: string, fontSize: number): THREE.Sprite {
  const lines = text.split('\n');
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = lines.length > 1 ? 160 : 112;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Canvas 2D context unavailable for labels.');
  context.fillStyle = background;
  roundedRect(context, 8, 8, canvas.width - 16, canvas.height - 16, 26);
  context.fill();
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  lines.forEach((line, index) => {
    context.font = `${index === 0 ? 700 : 600} ${index === 0 ? fontSize : Math.round(fontSize * 0.64)}px system-ui, sans-serif`;
    context.fillStyle = index === 0 ? color : '#bed4c6';
    context.fillText(line, canvas.width / 2, lines.length === 1 ? canvas.height / 2 : 56 + index * 56);
  });
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: true, depthWrite: false }));
  return sprite;
}

function roundedRect(context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number): void {
  const r = Math.min(radius, width / 2, height / 2);
  context.beginPath();
  context.moveTo(x + r, y);
  context.arcTo(x + width, y, x + width, y + height, r);
  context.arcTo(x + width, y + height, x, y + height, r);
  context.arcTo(x, y + height, x, y, r);
  context.arcTo(x, y, x + width, y, r);
  context.closePath();
}

function setAtPlan(object: THREE.Object3D, point: PlanPoint, y = 0): void {
  const world = planToWorld(point);
  object.position.set(world.x, y, world.z);
}

function isBuildingId(id: string): boolean {
  return ['reception', 'sanitary', 'clubhouse', 'lifeguard', 'kiosk', 'workshop', 'wood-shed', 'shelter'].some((part) => id.includes(part));
}

function isCameraBlocker(id: string): boolean {
  return isBuildingId(id) || id.includes('camper') || id.includes('tree') || id.includes('tent') || id === 'party';
}

function labelForObject(id: string): string {
  const labels: Record<string, string> = {
    reception: 'REZEPTION', sanitary: 'SANITÄR', clubhouse: 'ADRIA-KLAUSE', party: 'PARTYZELT',
    lifeguard: 'STRANDWACHE', workshop: 'WERKSTATT', 'wood-shed': 'HOLZLAGER', 'festival-kiosk': 'FESTKIOSK',
    'beach-kiosk': 'STRANDKIOSK', 'arrival-sign': 'BLAUE ADRIA', 'central-sign': 'TAUCHERPLATZ',
    'north-sign': 'DAUERCAMPER', 'festival-sign': 'FESTWIESE', 'beach-sign': 'STRAND', 'woodland-sign': 'SERVICEHOF', 'cove-sign': 'BUCHT',
  };
  return labels[id] ?? id.replaceAll('-', ' ').toUpperCase();
}

function hash(value: string): number {
  let result = 0;
  for (let index = 0; index < value.length; index += 1) result = ((result << 5) - result + value.charCodeAt(index)) | 0;
  return result;
}

function seededAngle(value: string): number {
  return (Math.abs(hash(value)) % 1000) / 1000;
}
