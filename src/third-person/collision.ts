export interface Point2 {
  x: number;
  z: number;
}

export interface AabbCollider {
  id: string;
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
  height?: number;
  cameraBlocking?: boolean;
}

export interface MovementBounds {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

export function circleIntersectsAabb(point: Point2, radius: number, collider: AabbCollider): boolean {
  const nearestX = Math.max(collider.minX, Math.min(point.x, collider.maxX));
  const nearestZ = Math.max(collider.minZ, Math.min(point.z, collider.maxZ));
  const dx = point.x - nearestX;
  const dz = point.z - nearestZ;
  return dx * dx + dz * dz < radius * radius;
}

export function moveCircle(
  position: Point2,
  delta: Point2,
  radius: number,
  colliders: readonly AabbCollider[],
  bounds: MovementBounds,
): Point2 {
  const next = { ...position };
  const xCandidate = {
    x: clamp(position.x + delta.x, bounds.minX + radius, bounds.maxX - radius),
    z: position.z,
  };
  if (!colliders.some((collider) => circleIntersectsAabb(xCandidate, radius, collider))) next.x = xCandidate.x;

  const zCandidate = {
    x: next.x,
    z: clamp(position.z + delta.z, bounds.minZ + radius, bounds.maxZ - radius),
  };
  if (!colliders.some((collider) => circleIntersectsAabb(zCandidate, radius, collider))) next.z = zCandidate.z;
  return next;
}

export function colliderFromCenter(
  id: string,
  x: number,
  z: number,
  width: number,
  depth: number,
  height = 1,
  cameraBlocking = true,
): AabbCollider {
  return {
    id,
    minX: x - width / 2,
    maxX: x + width / 2,
    minZ: z - depth / 2,
    maxZ: z + depth / 2,
    height,
    cameraBlocking,
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
