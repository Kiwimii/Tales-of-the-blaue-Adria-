import { campaignMeta } from './metaStore';

const query = new URLSearchParams(location.search);

// The generic campaign smoke bootstrap intentionally starts with a completed shop and an arrival-stage save.
// Suppress only the one-time cinematic in that generic fixture so it cannot interrupt unrelated codex,
// weekend-arc or minigame checks. The dedicated opening browser test does not use the generic smoke fixture.
if (query.get('smoke') === '1' && query.get('opening') !== '1') {
  campaignMeta.setFlag('openingArrivalSeen', true);
}
