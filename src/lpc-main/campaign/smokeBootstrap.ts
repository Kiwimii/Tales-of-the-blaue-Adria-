const query = new URLSearchParams(location.search);
const saveKey = 'tales-blaue-adria-lpc-main-v1';
const metaKey = 'tales-blaue-adria-lpc-campaign-meta-v2';
const releaseMarker = 'tales-blaue-adria-lpc-campaign-release';
const releaseVersion = 'sprints-1-6-v1';

if (query.get('smoke') === '1') {
  const progressionSmoke = query.get('progression') === '1';
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
    inventory: { wasser: 2, wuerste: 1, bier: 1, batida: 0, chips: 1, kaffee: 0, klopapier: 1, tablette: 0 },
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
    version: 3,
    introSeen: true,
    questStage: progressionSmoke ? 'arrival' : 'complete',
    firstBeerOpened: !progressionSmoke,
    authorityBattleWon: !progressionSmoke,
    powerConnected: !progressionSmoke,
    learnedAttacks: ['classic-high-five'],
    equippedAttacks: ['classic-high-five'],
    activeTeam: [],
    miniResults: progressionSmoke ? {} : {
      flipCup: { attempts: 1, wins: 1, best: 100, last: 100, bestQuality: 'solid' },
      beerPong: { attempts: 1, wins: 1, best: 100, last: 100, bestQuality: 'solid' },
      flunkyball: { attempts: 1, wins: 1, best: 100, last: 100, bestQuality: 'solid' },
    },
    flags: progressionSmoke ? {} : { 'all-core-minigames-unlocked': true },
  }));
} else if (localStorage.getItem(releaseMarker) !== releaseVersion) {
  localStorage.removeItem(saveKey);
  localStorage.removeItem(metaKey);
  localStorage.setItem(releaseMarker, releaseVersion);
}
