const query = new URLSearchParams(location.search);
const saveKey = 'tales-blaue-adria-lpc-main-v1';
const metaKey = 'tales-blaue-adria-lpc-campaign-meta-v2';
const releaseMarker = 'tales-blaue-adria-lpc-campaign-release';
const releaseVersion = 'sprints-1-6-v1';

if (query.get('smoke') === '1') {
  localStorage.setItem(releaseMarker, releaseVersion);
  localStorage.setItem(saveKey, JSON.stringify({
    version: 3,
    mode: 'world',
    profile: {
      name: 'Smoke Camper', skinTone: '#d9a67e', hair: '#4a3224', shirt: '#e5ad43', shorts: '#294954',
      hairStyle: 'kurz', bodyType: 'normal', accessory: 'keins', trait: 'beobachtend',
    },
    prologue: { introSeen: true, shoppingComplete: true, spent: 18 },
    day: 1,
    minutes: 480,
    money: 7,
    needs: { energy: 92, hunger: 10, thirst: 8, bladder: 5, alcohol: 0, highness: 0, hangover: 0, courage: 30 },
    metrics: { dignity: 60, chaos: 0, reputation: 0, momentum: 0 },
    inventory: { wasser: 2, wuerste: 1, bier: 1, chips: 1, klopapier: 1 },
    team: [],
    relationships: {},
    quests: {},
    activeQuest: 'entry',
    flags: {},
    encounter: null,
    chronicle: [],
    worldPosition: { x: 900, y: 1600 },
    currentInterior: null,
    activityResults: {},
  }));
  localStorage.setItem(metaKey, JSON.stringify({
    version: 2,
    introSeen: true,
    questStage: 'arrival',
    learnedAttacks: ['classic-high-five'],
    equippedAttacks: ['classic-high-five'],
  }));
} else if (localStorage.getItem(releaseMarker) !== releaseVersion) {
  localStorage.removeItem(saveKey);
  localStorage.removeItem(metaKey);
  localStorage.setItem(releaseMarker, releaseVersion);
}
