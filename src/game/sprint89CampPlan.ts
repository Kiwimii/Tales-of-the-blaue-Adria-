import {
  ARRIVAL_STORY_PLACEMENTS,
  ENTRANCE_PLACEMENTS,
  FRIEND_CAMP_CENTER,
  FRIEND_TENT_ENTRY_POINTS,
  LANDMARK_PLACEMENTS,
  NPC_PLACEMENTS,
  OBJECT_PLACEMENTS,
  TAUCHER_CAR_POSITION,
  type Placement,
  type PlanPoint,
} from './aerialCampgroundPlan';

let applied = false;

/**
 * Sprint 89 refines the canonical Taucherplatz geometry before the world
 * blueprint is copied into runtime objects. Every consumer receives the same
 * shared placement objects; this function does not reposition rendered items.
 */
export function applySprint89CampPlan(): void {
  if (applied) return;

  assignPlacement('home-tent', { x: 80, y: 1060, width: 145, height: 120 });
  assignPlacement('tent-andre', { x: 270, y: 960, width: 135, height: 105 });
  assignPlacement('tent-rene', { x: 570, y: 990, width: 135, height: 105 });
  assignPlacement('tent-lars', { x: 650, y: 1150, width: 135, height: 110 });
  assignPlacement('tent-danny', { x: 275, y: 1160, width: 135, height: 105 });

  assignPlacement('central-table', { x: 490, y: 1170, width: 145, height: 72 });
  assignPlacement('central-bench', { x: 980, y: 1220, width: 105, height: 38 });
  assignPlacement('central-flowerbed', { x: 1140, y: 1230, width: 190, height: 45 });
  assignPlacement('central-tree-2', { x: 1250, y: 930, width: 100, height: 112 });
  assignPlacement('tent-hedge-west', { x: 80, y: 890, width: 720, height: 24 });
  assignPlacement('tent-hedge-east', { x: 1000, y: 890, width: 320, height: 24 });

  Object.assign(FRIEND_CAMP_CENTER, { x: 470, y: 1110 });
  Object.assign(TAUCHER_CAR_POSITION, { x: 1240, y: 1170 });

  assignPoint(FRIEND_TENT_ENTRY_POINTS['home-tent'], { x: 225, y: 1120 });
  assignPoint(FRIEND_TENT_ENTRY_POINTS['tent-andre'], { x: 415, y: 1075 });
  assignPoint(FRIEND_TENT_ENTRY_POINTS['tent-rene'], { x: 560, y: 1085 });
  assignPoint(FRIEND_TENT_ENTRY_POINTS['tent-lars'], { x: 625, y: 1185 });
  assignPoint(FRIEND_TENT_ENTRY_POINTS['tent-danny'], { x: 420, y: 1145 });

  assignPoint(NPC_PLACEMENTS.andre, FRIEND_TENT_ENTRY_POINTS['tent-andre']);
  assignPoint(NPC_PLACEMENTS.rene, FRIEND_TENT_ENTRY_POINTS['tent-rene']);
  assignPoint(NPC_PLACEMENTS.lars, FRIEND_TENT_ENTRY_POINTS['tent-lars']);
  assignPoint(NPC_PLACEMENTS.danny, FRIEND_TENT_ENTRY_POINTS['tent-danny']);
  assignPoint(NPC_PLACEMENTS.manni, { x: 360, y: 850 });

  assignPoint(ENTRANCE_PLACEMENTS['home-door'], FRIEND_TENT_ENTRY_POINTS['home-tent']);
  assignPoint(LANDMARK_PLACEMENTS.campfire, FRIEND_CAMP_CENTER);

  const story = ARRIVAL_STORY_PLACEMENTS as unknown as Record<string, PlanPoint>;
  assignPoint(story.taucherplatz, TAUCHER_CAR_POSITION);
  assignPoint(story.powerBox, { x: 1290, y: 1080 });
  assignPoint(story.drinks, { x: 1130, y: 1210 });
  assignPoint(story.tents, { x: 1110, y: 1020 });
  assignPoint(story.cable, { x: 1210, y: 1090 });
  assignPoint(story.firstBeer, { x: 1100, y: 1170 });
  assignPoint(story.homeDoor, FRIEND_TENT_ENTRY_POINTS['home-tent']);

  applied = true;
}

function assignPlacement(id: string, placement: Placement): void {
  Object.assign(OBJECT_PLACEMENTS[id], placement);
}

function assignPoint(target: PlanPoint, point: PlanPoint): void {
  Object.assign(target, point);
}
