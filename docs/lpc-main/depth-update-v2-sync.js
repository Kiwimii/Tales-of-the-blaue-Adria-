const CORE_META_KEY = 'tales-blaue-adria-lpc-campaign-meta-v2';
const DEPTH_SAVE_KEY = 'tales-blaue-adria-gameplay-depth-v2';
const SECRET_SYNC_KEY = 'tales-blaue-adria-depth-v2-secret-sync';

function parse(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeDepth(depth) {
  localStorage.setItem(DEPTH_SAVE_KEY, JSON.stringify(depth));
}

function freshProgress(previous) {
  return {
    version: 2,
    updateVersion: '2.0.0',
    olympiad: { strategies: {}, outcomes: [], lastOutcome: '', lastOutcomeAt: 0, noiseApplied: false, noiseModifier: 0 },
    saturday: { preparationChoice: '', applied: false },
    secret: {
      difficulty: previous?.secret?.difficulty ?? 'standard',
      roleHistory: {},
      asked: {},
      investigatorScore: 0,
      rivalAdjusted: false,
      pendingAccusation: null,
    },
    history: [],
  };
}

function synchronizeDepthLifecycle() {
  const core = parse(CORE_META_KEY);
  const depth = parse(DEPTH_SAVE_KEY);
  if (!core || !depth) return;
  const arc = core.weekendArc ?? {};
  const olympiad = arc.olympiad ?? {};
  const saturday = arc.saturday ?? {};
  const secret = arc.secretMillionaire ?? {};

  const cleanCampaignStart = core.questStage === 'arrival'
    && !olympiad.started
    && !saturday.triggered
    && !secret.started;
  const hasDepthProgress = Boolean(
    depth.olympiad?.outcomes?.length
    || depth.olympiad?.noiseApplied
    || depth.saturday?.applied
    || Object.keys(depth.secret?.roleHistory ?? {}).length
    || depth.history?.length
  );
  if (cleanCampaignStart && hasDepthProgress) {
    writeDepth(freshProgress(depth));
    sessionStorage.removeItem(SECRET_SYNC_KEY);
    return;
  }

  const restoredSaturdayCheckpoint = core.questStage === 'saturday-complaint'
    && !saturday.brawlWon
    && !saturday.earlyEnding
    && depth.saturday?.applied;
  if (restoredSaturdayCheckpoint) {
    depth.saturday = { preparationChoice: '', applied: false };
    depth.history = [...(depth.history ?? []), {
      at: new Date().toISOString(),
      text: 'Samstagmorgen-Checkpoint erkannt: Die einmalige Vorbereitung ist wieder verfügbar.',
    }].slice(-40);
    writeDepth(depth);
  }

  const firstSecretRound = secret.started
    && !secret.completed
    && Number(secret.round ?? 0) === 1
    && (secret.accusations?.length ?? 0) === 0
    && depth.secret?.rivalAdjusted;
  if (!firstSecretRound) return;
  const fingerprint = `${secret.millionaireId}:${secret.rivalScore}:${depth.secret?.difficulty ?? 'standard'}`;
  if (sessionStorage.getItem(SECRET_SYNC_KEY) === fingerprint) return;
  sessionStorage.setItem(SECRET_SYNC_KEY, fingerprint);
  window.setTimeout(() => location.reload(), 40);
}

if (typeof window !== 'undefined') {
  window.setTimeout(synchronizeDepthLifecycle, 260);
  window.setInterval(synchronizeDepthLifecycle, 900);
}
