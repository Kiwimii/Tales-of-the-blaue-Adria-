export interface HedgePeeState {
  progress: number;
  suspicion: number;
}

export function hedgeDangerAt(elapsedMs: number): number {
  const gundulaSweep = (Math.sin(elapsedMs * 0.00135) + 1) / 2;
  const uliSweep = (Math.sin(elapsedMs * 0.00087 + 2.1) + 1) / 2;
  const gundulaDanger = clamp01((gundulaSweep - 0.58) / 0.42);
  const uliDanger = clamp01((uliSweep - 0.68) / 0.32) * 0.86;
  return Math.max(gundulaDanger, uliDanger);
}

export function advanceHedgePee(
  state: HedgePeeState,
  deltaMs: number,
  peeing: boolean,
  danger: number,
  bladder: number,
): HedgePeeState {
  const urgency = clamp01(bladder / 100);
  const progressRate = 0.008 + urgency * 0.0045;
  const safeNoise = 0.0014 + urgency * 0.0012;
  const exposedNoise = 0.010 + danger * 0.018 + urgency * 0.002;
  const suspicionDelta = peeing
    ? deltaMs * (danger >= 0.38 ? exposedNoise : safeNoise)
    : -deltaMs * 0.012;

  return {
    progress: clamp(state.progress + (peeing ? deltaMs * progressRate : 0), 0, 100),
    suspicion: clamp(state.suspicion + suspicionDelta, 0, 100),
  };
}

export function hedgePeeResult(state: HedgePeeState): 'running' | 'success' | 'caught' {
  if (state.suspicion >= 100) return 'caught';
  if (state.progress >= 100) return 'success';
  return 'running';
}

function clamp01(value: number): number {
  return clamp(value, 0, 1);
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
