import {
  applyPreparationToMeta,
  buildSecretClues,
  chooseNextMillionaire,
  computeDirectorState,
} from '../src/lpc-main/campaign/depthUpdateV2.js';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const nextA = chooseNextMillionaire({ seed: 42, round: 2, eliminated: ['rene', 'lars'], previous: 'masl' });
const nextB = chooseNextMillionaire({ seed: 42, round: 2, eliminated: ['rene', 'lars'], previous: 'masl' });
assert(nextA === nextB, 'Secret role selection must be deterministic.');
assert(!['rene', 'lars', 'masl'].includes(nextA), 'Secret role selection must exclude eliminated and previous roles when possible.');

for (const difficulty of ['easy', 'standard', 'expert']) {
  const clues = buildSecretClues({ millionaireId: 'masl', round: 3, seed: 99, difficulty });
  assert(clues.length === 3, `Expected three clues for ${difficulty}.`);
  assert(!clues.join(' ').toLocaleLowerCase('de').includes('masl'), `Clues must not reveal the role name in ${difficulty}.`);
}

const director = computeDirectorState(
  {
    weekendScore: 140,
    relationshipBonus: { masl: 30, felix: 20 },
    activeTeam: ['masl', 'felix'],
    suspicion: 15,
    flags: { 'authority-goodwill': true },
    weekendArc: { nightNoise: 68, olympiad: {}, saturday: { dannyTestimony: true, felixTimeline: true } },
  },
  { needs: { energy: 35, alcohol: 60 }, metrics: { reputation: 22, momentum: 12 } },
  { olympiad: { strategies: { flipCup: 'team', beerPong: 'risk', flunkyball: 'safe' }, outcomes: [{ success: true, quality: 'perfect' }, { success: false, quality: 'failed' }] } },
);
for (const [key, value] of Object.entries(director)) assert(value >= 0 && value <= 100, `${key} must remain in the 0..100 range.`);
assert(director.preparation > 20, 'Witnesses and team focus should create meaningful preparation.');

const baseMeta = { weekendArc: { nightNoise: 50, saturday: { debatePressure: 70, debateCrowd: 0, wakeMood: 30, dannyTestimony: true, felixTimeline: true } } };
const evidence = applyPreparationToMeta(baseMeta, 'evidence', director);
assert(evidence.weekendArc.saturday.debatePressure === 56, 'Evidence preparation must reduce pressure by 14 with both witnesses.');
const rally = applyPreparationToMeta(baseMeta, 'rally', { cohesion: 80 });
assert(rally.weekendArc.saturday.debateCrowd === 14, 'High cohesion rally must add 14 crowd support.');
const bluff = applyPreparationToMeta(baseMeta, 'bluff', director);
assert(bluff.weekendArc.nightNoise === 56, 'Bluff must add six night-noise counterevidence.');

console.log('Gameplay Depth Update V2 validation passed: deterministic role rotation, non-spoiling clues, bounded director values and persistent Saturday preparation effects.');
