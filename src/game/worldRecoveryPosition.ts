import { EXPANDED_NPCS, EXPANDED_WORLD_HEIGHT, EXPANDED_WORLD_WIDTH } from './worldV2';

export function recoveryPointOutsideNpcCluster(x: number, y: number): { x: number; y: number } {
  const nearby = EXPANDED_NPCS.filter((npc) => Math.hypot(x - npc.x, y - npc.y) < 96);
  if (!nearby.length) return { x, y };

  const center = nearby.reduce((sum, npc) => ({ x: sum.x + npc.x, y: sum.y + npc.y }), { x: 0, y: 0 });
  center.x /= nearby.length;
  center.y /= nearby.length;
  let dx = x - center.x;
  let dy = y - center.y;
  const length = Math.hypot(dx, dy);
  if (length < 4) {
    dx = -1;
    dy = 0.45;
  } else {
    dx /= length;
    dy /= length;
  }

  return {
    x: clamp(center.x + dx * 118, 45, EXPANDED_WORLD_WIDTH - 45),
    y: clamp(center.y + dy * 118, 45, EXPANDED_WORLD_HEIGHT - 45),
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
