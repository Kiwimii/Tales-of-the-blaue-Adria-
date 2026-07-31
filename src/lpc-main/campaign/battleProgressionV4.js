import { GameStore } from '../../game/state/GameStore';
import { COMBAT_MOVES } from '../../game/combatMoves';
import { campaignMeta } from './metaStore';
import {
  CAMPAIGN_OPPONENTS,
  battlePrediction,
  createBattle,
  resolveBattleTurn,
} from './battleEngine';
import { MINIGAME_INTERACTIONS } from './content';
import './battleProgressionV4.css';

export const BATTLE_LEAGUE_VERSION = 'frustkampf-progression-v4';
const SAVE_KEY = 'tales-blaue-adria-lpc-main-v1';
const LEAGUE_IDS = ['gregor', 'schubert', 'masl', 'ronny'];

export const LEAGUE_OPPONENTS = {
  gregor: {
    id: 'gregor',
    name: 'Grill-Gregor',
    title: 'Dogmatiker der schwarzen Kruste',
    tier: 1,
    relationId: 'gregor',
    rewardAttack: 'beer-offer',
    rewardText: 'Gregor erkennt an, dass ein Friedensbier gelegentlich stärker ist als eine Grillzange.',
    unlockText: 'Nach dem Einlasskampf verfügbar.',
    palette: ['#b76532', '#7b4127', '#f3cf69', '#4b3025'],
    accessory: 'spatula',
  },
  schubert: {
    id: 'schubert',
    name: 'Schubert',
    title: 'Botanischer Nebelwerfer',
    tier: 2,
    relationId: 'schubert',
    rewardAttack: 'dry-counter',
    rewardText: 'Nach dem dritten Pflanzenexkurs entsteht das Timing für einen trockenen Konter.',
    unlockText: 'Gewinne einen Ligakampf oder baue Beziehung zu Schubert auf.',
    palette: ['#567c55', '#39543a', '#9bc67e', '#4c3528'],
    accessory: 'plant',
  },
  masl: {
    id: 'masl',
    name: 'Masl',
    title: 'Regelrichter mit Sonderklausel',
    tier: 3,
    relationId: 'masl',
    rewardAttack: 'total-exaggeration',
    rewardText: 'Masl bestätigt offiziell, dass komplette Übertreibung eine zulässige Sonderregel ist.',
    unlockText: 'Gewinne einen Ligakampf und mindestens ein Minispiel.',
    palette: ['#4d8b55', '#315c39', '#f2df7c', '#4c3225'],
    accessory: 'whistle',
  },
  ronny: {
    id: 'ronny',
    name: 'Rivalen-Ronny',
    title: 'Endgegner des roten Fadens',
    tier: 4,
    relationId: 'ronny',
    rewardAttack: null,
    rewardText: 'Ronny verliert den roten Faden. Die Anekdote wird dauerhaft Teil deines Kampfstils.',
    unlockText: 'Gewinne zwei unterschiedliche Ligakämpfe und lerne mindestens drei Attacken.',
    palette: ['#9b4037', '#662b28', '#e6c85d', '#32251e'],
    accessory: 'whistle',
  },
};

Object.assign(CAMPAIGN_OPPONENTS, {
  gregor: {
    id: 'ronny', name: LEAGUE_OPPONENTS.gregor.name, title: LEAGUE_OPPONENTS.gregor.title,
    maxFrustration: 86, traits: ['grilldogmatisch', 'stolz', 'bierempfänglich'], baseCounterFrustration: 10,
    moveMultipliers: { 'beer-offer': 1.55, 'logical-argument': 1.32, 'cup-eye-contact': 1.18, 'total-exaggeration': .68, 'aldi-shirt-show': .8 },
    tagMultipliers: { drink: 1.32, logic: 1.18, charm: 1.12, chaos: .72, style: .84 },
    counterLines: ['Gregor erklärt Röstaromen anhand eines vollständig schwarzen Würstchens.', 'Gregor dreht die Grillzange wie einen Richterspruch.', 'Gregor nennt jede Kritik eine Frage der Kerntemperatur.'],
  },
  schubert: {
    id: 'ronny', name: LEAGUE_OPPONENTS.schubert.name, title: LEAGUE_OPPONENTS.schubert.title,
    maxFrustration: 94, traits: ['abschweifend', 'botanisch', 'konterempfindlich'], baseCounterFrustration: 12,
    moveMultipliers: { 'dry-counter': 1.5, 'aldi-shirt-show': 1.28, 'classic-high-five': 1.2, 'logical-argument': .72, 'agree-anyway': .82 },
    tagMultipliers: { wit: 1.28, style: 1.2, rapport: 1.14, logic: .75, submission: .86 },
    counterLines: ['Schubert beantwortet die Frage mit der Geschichte einer Zimmerpflanze.', 'Schubert beginnt bei Photosynthese und endet ohne erkennbaren Zwischenhalt.', 'Schubert hebt einen Zweig hoch, als wäre damit alles bewiesen.'],
  },
  masl: {
    id: 'ronny', name: LEAGUE_OPPONENTS.masl.name, title: LEAGUE_OPPONENTS.masl.title,
    maxFrustration: 104, traits: ['regelwendig', 'spielerisch', 'chaosoffen'], baseCounterFrustration: 14,
    moveMultipliers: { 'total-exaggeration': 1.52, 'synchronised-cheer': 1.34, 'agree-anyway': 1.24, 'camping-chair-block': .7, 'logical-argument': .78 },
    tagMultipliers: { chaos: 1.35, team: 1.22, submission: 1.16, guard: .72, logic: .82 },
    counterLines: ['Masl erfindet eine Sonderregel, die rückwirkend schon immer gegolten haben soll.', 'Masl pfeift ab und erklärt erst danach, was eigentlich gespielt wurde.', 'Masl wertet denselben Satz gleichzeitig als Foul und Bonuspunkt.'],
  },
});

class NamespacedStorage {
  getItem() { return localStorage.getItem(SAVE_KEY); }
  setItem(_key, value) { localStorage.setItem(SAVE_KEY, value); }
  removeItem() { localStorage.removeItem(SAVE_KEY); }
}

let leagueBattle;
let leagueOpponentId = '';
let battleStartMeta;
let resultSummary;
let rewardApplied = false;
let patchQueued = false;
let forceUnlock = false;
let animationTimer = 0;
let counterTimer = 0;

export function leagueVictoryIds(meta) {
  return LEAGUE_IDS.filter((id) => (meta?.miniResults?.[`battle-${id}`]?.wins ?? 0) > 0);
}

export function leagueRank(meta) {
  const wins = leagueVictoryIds(meta).length;
  if (wins >= 4) return { id: 'legend', label: 'Frustkampf-Legende', level: 5, wins };
  if (wins >= 3) return { id: 'duellant', label: 'Platzduellant', level: 4, wins };
  if (wins >= 2) return { id: 'counter', label: 'Zeltkreis-Konterer', level: 3, wins };
  if (wins >= 1) return { id: 'novice', label: 'Frust-Novize', level: 2, wins };
  return { id: 'rookie', label: 'Schranken-Neuling', level: 1, wins };
}

export function opponentUnlockState(meta, id) {
  const wins = leagueVictoryIds(meta).length;
  const minigameWins = Object.entries(meta?.miniResults ?? {})
    .filter(([key]) => !key.startsWith('battle-'))
    .reduce((sum, [, entry]) => sum + Number(entry?.wins ?? 0), 0);
  if (id === 'gregor') return { unlocked: Boolean(meta?.authorityBattleWon), reason: LEAGUE_OPPONENTS.gregor.unlockText };
  if (id === 'schubert') return { unlocked: wins >= 1 || Number(meta?.relationshipBonus?.schubert ?? 0) >= 6, reason: LEAGUE_OPPONENTS.schubert.unlockText };
  if (id === 'masl') return { unlocked: wins >= 1 && minigameWins >= 1, reason: LEAGUE_OPPONENTS.masl.unlockText };
  if (id === 'ronny') return { unlocked: wins >= 2 && Number(meta?.learnedAttacks?.length ?? 0) >= 3, reason: LEAGUE_OPPONENTS.ronny.unlockText };
  return { unlocked: false, reason: 'Unbekannter Gegner.' };
}

export function leaguePhase(id, ratio) {
  const phase = ratio < .34 ? 0 : ratio < .7 ? 1 : 2;
  const phases = {
    gregor: ['Anheizen', 'Grilldogma', 'Verkohlte Autorität'],
    schubert: ['Pflanzenfund', 'Botanischer Exkurs', 'Photosynthese-Kollaps'],
    masl: ['Grundregel', 'Sonderklausel', 'Regelbruch-Finale'],
    ronny: ['Monolog', 'Begriffsverteidigung', 'Widerspruchskollaps'],
  };
  return phases[id]?.[phase] ?? 'Frustkampf';
}

export function attackAnimationKey(id) {
  return ({
    'classic-high-five': 'highfive', 'aldi-shirt-show': 'shirt-flash', 'agree-anyway': 'agree',
    'logical-argument': 'logic-cards', 'dry-counter': 'counter-slash', 'camping-chair-block': 'chair-guard',
    'beer-offer': 'beer-arc', 'synchronised-cheer': 'team-wave', 'cup-eye-contact': 'pong-arc',
    'total-exaggeration': 'shockwave',
  })[id] ?? 'talk';
}

export function battleDeltaSummary(before, after, opponentId) {
  const relationId = LEAGUE_OPPONENTS[opponentId]?.relationId ?? opponentId;
  const beforeRelation = Number(before?.relationshipBonus?.[relationId] ?? 0);
  const afterRelation = Number(after?.relationshipBonus?.[relationId] ?? 0);
  const mastery = [];
  for (const id of new Set([...(before?.learnedAttacks ?? []), ...(after?.learnedAttacks ?? [])])) {
    const previous = before?.attackMastery?.[id] ?? { uses: 0, successes: 0, level: 1 };
    const next = after?.attackMastery?.[id] ?? { uses: 0, successes: 0, level: 1 };
    if (next.uses !== previous.uses || next.successes !== previous.successes || next.level !== previous.level) {
      mastery.push({ id, uses: next.uses - previous.uses, successes: next.successes - previous.successes, levelBefore: previous.level, levelAfter: next.level });
    }
  }
  return {
    weekendScore: Number(after?.weekendScore ?? 0) - Number(before?.weekendScore ?? 0),
    scoreBefore: Number(before?.weekendScore ?? 0), scoreAfter: Number(after?.weekendScore ?? 0),
    relationship: afterRelation - beforeRelation, relationBefore: beforeRelation, relationAfter: afterRelation,
    attempts: Number(after?.miniResults?.[`battle-${opponentId}`]?.attempts ?? 0),
    wins: Number(after?.miniResults?.[`battle-${opponentId}`]?.wins ?? 0),
    rankBefore: leagueRank(before), rankAfter: leagueRank(after), mastery,
    unlocked: LEAGUE_IDS.filter((id) => !opponentUnlockState(before, id).unlocked && opponentUnlockState(after, id).unlocked),
  };
}

function readSnapshot() {
  const store = new GameStore(new NamespacedStorage());
  return campaignMeta.augmentSnapshot(store.snapshot());
}

function install() {
  const arena = MINIGAME_INTERACTIONS.find((entry) => entry.id === 'ronnyBattle');
  if (arena) Object.assign(arena, { label: 'Frustkampf-Liga am Hauptweg', x: 1635, y: 610, radius: 135 });
  const observer = new MutationObserver(queuePatch);
  observer.observe(document.documentElement, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['hidden'] });
  document.addEventListener('click', handleClick, true);
  window.addEventListener('lpc-campaign-battle-state', handleBattleState);
  window.addEventListener('lpc-campaign-meta', queuePatch);
  queuePatch();
  exposeDebug();
}

function queuePatch() {
  if (patchQueued) return;
  patchQueued = true;
  window.setTimeout(() => { patchQueued = false; patchRonnyDialogue(); patchBattleModal(); }, 20);
}

function patchRonnyDialogue() {
  const modal = document.getElementById('generic-modal');
  const title = document.getElementById('modal-title');
  const options = document.getElementById('modal-options');
  const copy = document.getElementById('modal-copy');
  if (!modal || modal.hidden || title?.textContent !== 'Rivalen-Ronny' || !options) return;
  for (const button of options.querySelectorAll('button')) {
    if (button.textContent?.includes('Frustduell')) button.remove();
  }
  if (copy && !copy.querySelector('.league-dialogue-note')) {
    const note = document.createElement('p');
    note.className = 'league-dialogue-note';
    note.textContent = 'Ronny reden und Ronny bekämpfen sind jetzt getrennt: Gespräche entwickeln Beziehung und Logik-Attacken. Der Frustkampf findet ausschließlich in der Liga am Hauptweg statt.';
    copy.append(note);
  }
}

function patchBattleModal() {
  const modal = document.getElementById('battle-modal');
  const title = document.getElementById('battle-title');
  if (!modal || modal.hidden) return;
  if (!modal.dataset.leagueActive && !modal.dataset.leagueSelect && title?.textContent?.startsWith('Rivalen-Ronny')) showRoster();
  if (modal.dataset.leagueSelect === '1') cleanProgressionExtras();
}

function handleBattleState(event) {
  const modal = document.getElementById('battle-modal');
  if (!modal || modal.dataset.leagueActive !== '1' || !leagueOpponentId) return;
  if (event.detail?.opponentId !== leagueOpponentId) return;
  leagueBattle = event.detail;
  decoratePhase();
  renderLeagueBattle();
}

function handleClick(event) {
  const target = event.target instanceof Element ? event.target.closest('button') : null;
  if (!(target instanceof HTMLButtonElement)) return;
  if (target.dataset.leagueOpponent) { event.preventDefault(); event.stopImmediatePropagation(); startLeagueOpponent(target.dataset.leagueOpponent); return; }
  if (target.dataset.leagueMove) { event.preventDefault(); event.stopImmediatePropagation(); playLeagueMove(target.dataset.leagueMove); return; }
  if (target.dataset.leagueRoster !== undefined) { event.preventDefault(); event.stopImmediatePropagation(); showRoster(); return; }
  if (target.dataset.leagueRematch !== undefined) { event.preventDefault(); event.stopImmediatePropagation(); startLeagueOpponent(leagueOpponentId, true); return; }
  if (target.id === 'battle-close') resetLeagueRuntime();
}

function showRoster(force = false) {
  const modal = document.getElementById('battle-modal');
  const title = document.getElementById('battle-title');
  const round = document.getElementById('battle-round');
  const moves = document.getElementById('battle-moves');
  const log = document.getElementById('battle-log');
  const close = document.getElementById('battle-close');
  if (!modal || !moves) return;
  forceUnlock = forceUnlock || force;
  leagueBattle = undefined; leagueOpponentId = ''; resultSummary = undefined; rewardApplied = false;
  modal.hidden = false; modal.dataset.leagueSelect = '1'; delete modal.dataset.leagueActive; document.body.classList.add('campaign-modal-open');
  if (title) title.textContent = 'FRUSTKAMPF-LIGA · eigener Progressionspfad';
  if (round) round.textContent = `${leagueRank(campaignMeta.snapshot()).label} · Gegnerleiter`;
  if (log) log.innerHTML = '<p class="latest">Gespräche bleiben Gespräche. Hier zählen Attacken, Meisterschaft, Team und unterschiedliche Gegnerschwächen.</p>';
  if (close instanceof HTMLButtonElement) close.hidden = false;
  renderRoster(moves);
  renderStage('roster');
}

function renderRoster(moves) {
  const meta = campaignMeta.snapshot();
  const rank = leagueRank(meta);
  moves.innerHTML = `<section class="league-roster" data-version="${BATTLE_LEAGUE_VERSION}"><header><span>FRUSTKAMPF-PROGRESSION</span><strong>${escapeHtml(rank.label)}</strong><small>${rank.wins}/4 Gegner besiegt · jeder Sieg verändert dauerhaft deinen Wochenendstand</small></header><div class="league-opponent-grid"></div></section>`;
  const grid = moves.querySelector('.league-opponent-grid');
  for (const id of LEAGUE_IDS) {
    const opponent = LEAGUE_OPPONENTS[id];
    const state = opponentUnlockState(meta, id);
    const record = meta.miniResults?.[`battle-${id}`] ?? { attempts: 0, wins: 0, best: 0 };
    const unlocked = forceUnlock || state.unlocked;
    const card = document.createElement('article');
    card.className = `league-opponent-card ${unlocked ? 'unlocked' : 'locked'} ${record.wins ? 'defeated' : ''}`;
    card.innerHTML = `<div class="league-card-portrait">${figureMarkup(id, 'card')}</div><div><span>STUFE ${opponent.tier}</span><h3>${escapeHtml(opponent.name)}</h3><p>${escapeHtml(opponent.title)}</p><small>${record.wins}/${record.attempts} Siege · Bestwert ${record.best || '–'}</small><em>${escapeHtml(unlocked ? opponent.rewardText : state.reason)}</em><button type="button" data-league-opponent="${id}" ${unlocked ? '' : 'disabled'}>${record.wins ? 'Erneut fordern' : unlocked ? 'Kampf beginnen' : 'Gesperrt'}</button></div>`;
    grid?.append(card);
  }
}

function startLeagueOpponent(id, force = false) {
  const meta = campaignMeta.snapshot();
  if (!LEAGUE_OPPONENTS[id] || (!force && !forceUnlock && !opponentUnlockState(meta, id).unlocked)) return;
  const modal = document.getElementById('battle-modal');
  if (!modal) return;
  modal.dataset.leagueActive = '1'; delete modal.dataset.leagueSelect;
  leagueOpponentId = id; battleStartMeta = meta; resultSummary = undefined; rewardApplied = false;
  leagueBattle = createBattle(id, campaignMeta.progressionContext());
  decoratePhase();
  renderLeagueBattle();
  dispatchWorldAnimation(id, 'argue');
}

function decoratePhase() {
  if (!leagueBattle || !leagueOpponentId) return;
  leagueBattle.phaseLabel = leaguePhase(leagueOpponentId, leagueBattle.enemy.frustration / leagueBattle.enemy.maxFrustration);
}

function renderLeagueBattle() {
  if (!leagueBattle || !leagueOpponentId) return;
  const opponent = LEAGUE_OPPONENTS[leagueOpponentId];
  const title = document.getElementById('battle-title');
  const round = document.getElementById('battle-round');
  const moves = document.getElementById('battle-moves');
  const log = document.getElementById('battle-log');
  const close = document.getElementById('battle-close');
  if (title) title.textContent = `${opponent.name} · ${opponent.title}`;
  if (round) round.textContent = `Liga-Stufe ${opponent.tier} · Runde ${leagueBattle.round} · ${leagueBattle.phaseLabel} · Momentum ${leagueBattle.momentum}/3`;
  updateBars(leagueBattle);
  if (log) log.innerHTML = leagueBattle.log.slice().reverse().map((line, index) => `<p class="${index === 0 ? 'latest' : ''}">${escapeHtml(line)}</p>`).join('');
  renderStage(leagueOpponentId);
  if (!moves) return;
  if (leagueBattle.finished) {
    settleLeagueBattle();
    renderResult(moves);
    if (close instanceof HTMLButtonElement) close.hidden = false;
    return;
  }
  if (close instanceof HTMLButtonElement) close.hidden = true;
  const snapshot = readSnapshot();
  const meta = campaignMeta.snapshot();
  moves.innerHTML = `<section class="league-move-intro"><strong>${escapeHtml(opponent.name)} liest Wiederholungen mit.</strong><small>Wechsle Angriffstypen. Team-Attacken skalieren mit sichtbaren Begleitern.</small></section>${meta.equippedAttacks.map((id) => { const move = COMBAT_MOVES[id]; return `<button type="button" data-league-move="${id}"><strong>${escapeHtml(move.label)}</strong><span>${escapeHtml(move.description)}</span><small>${escapeHtml(battlePrediction(id, leagueBattle, snapshot, meta.activeTeam.length + 1, campaignMeta.progressionContext()))}</small></button>`; }).join('')}`;
}

function playLeagueMove(moveId) {
  if (!leagueBattle || leagueBattle.finished || !COMBAT_MOVES[moveId]) return;
  const result = resolveBattleTurn(leagueBattle, moveId, readSnapshot(), campaignMeta.snapshot().activeTeam.length + 1, campaignMeta.progressionContext());
  leagueBattle = result.state; decoratePhase(); animateTurn(moveId, result);
  if (leagueBattle.finished) window.setTimeout(() => { settleLeagueBattle(); renderLeagueBattle(); }, 520);
  else renderLeagueBattle();
}

function settleLeagueBattle() {
  if (!leagueBattle || !leagueOpponentId || rewardApplied) return;
  rewardApplied = true;
  const before = battleStartMeta ?? campaignMeta.snapshot();
  const opponent = LEAGUE_OPPONENTS[leagueOpponentId];
  const won = leagueBattle.won;
  const remaining = 1 - leagueBattle.player.frustration / leagueBattle.player.maxFrustration;
  const score = Math.max(10, Math.round(55 + opponent.tier * 18 + remaining * 45 - Math.max(0, leagueBattle.round - 4) * 3));
  const quality = won ? (remaining > .72 && leagueBattle.round <= 6 ? 'perfect' : remaining > .42 ? 'solid' : 'messy') : 'failed';
  campaignMeta.recordMiniGame(`battle-${leagueOpponentId}`, won, score, won ? `${opponent.name} wurde in der Frustkampf-Liga besiegt.` : `${opponent.name} hält seine Position in der Frustkampf-Liga.`, quality);
  campaignMeta.setFlag(`league-${leagueOpponentId}-attempted`, true);
  if (won) {
    campaignMeta.setFlag(`league-${leagueOpponentId}-won`, true, opponent.rewardText);
    campaignMeta.addRelationship(opponent.relationId, 4 + opponent.tier * 2);
    if (opponent.rewardAttack) campaignMeta.learnAttack(opponent.rewardAttack, `${opponent.name} schaltet eine alternative Kampflektion frei: ${COMBAT_MOVES[opponent.rewardAttack].label}.`);
    campaignMeta.recordBattleVictory(leagueOpponentId);
    if (leagueOpponentId === 'ronny') campaignMeta.setFlag('ronnyDefeated', true, 'Ronny wurde als später Ligagegner besiegt – unabhängig vom normalen Gesprächspfad.');
  }
  const after = campaignMeta.snapshot();
  resultSummary = { won, score, quality, before, after, deltas: battleDeltaSummary(before, after, leagueOpponentId) };
  window.dispatchEvent(new CustomEvent('lpc-campaign-league-result', { detail: structuredClone({ opponentId: leagueOpponentId, won, score, quality, deltas: resultSummary.deltas }) }));
  dispatchWorldAnimation(leagueOpponentId, won ? 'collapse' : 'cheer');
}

function renderResult(moves) {
  if (!resultSummary) return;
  const { won, score, quality, deltas } = resultSummary;
  const masteryText = deltas.mastery.length ? deltas.mastery.map((entry) => `${COMBAT_MOVES[entry.id]?.shortLabel ?? entry.id}: ${entry.uses >= 0 ? '+' : ''}${entry.uses} Einsatz, ${entry.successes >= 0 ? '+' : ''}${entry.successes} Treffer${entry.levelAfter > entry.levelBefore ? `, M${entry.levelBefore}→M${entry.levelAfter}` : ''}`).join('<br>') : 'Keine Attacken-Meisterschaft verändert.';
  const unlocked = deltas.unlocked.length ? deltas.unlocked.map((id) => LEAGUE_OPPONENTS[id].name).join(' · ') : 'Kein neuer Gegner';
  moves.innerHTML = `<section class="league-result ${won ? 'won' : 'lost'}"><header><span>${won ? 'LIGASIEG' : 'LIGANIEDERLAGE'}</span><strong>${won ? 'Fortschritt gespeichert' : 'Versuch gespeichert'}</strong><small>Wert ${score} · Qualität ${quality}</small></header><div class="league-delta-grid"><article><span>Wochenendwert</span><strong>${signed(deltas.weekendScore)}</strong><small>${deltas.scoreBefore} → ${deltas.scoreAfter}</small></article><article><span>Beziehung</span><strong>${signed(deltas.relationship)}</strong><small>${deltas.relationBefore} → ${deltas.relationAfter}</small></article><article><span>Kampfbilanz</span><strong>${deltas.wins}/${deltas.attempts}</strong><small>Siege / Versuche</small></article><article><span>Ligarang</span><strong>${escapeHtml(deltas.rankAfter.label)}</strong><small>${deltas.rankBefore.label === deltas.rankAfter.label ? 'unverändert' : `${escapeHtml(deltas.rankBefore.label)} → ${escapeHtml(deltas.rankAfter.label)}`}</small></article></div><section class="league-mastery-delta"><h3>Attackenentwicklung</h3><p>${masteryText}</p><h3>Freischaltung</h3><p>${escapeHtml(unlocked)}</p></section><footer><button type="button" data-league-rematch>Revanche</button><button type="button" data-league-roster>Zur Gegnerleiter</button></footer></section>`;
}

function renderStage(mode) {
  const modal = document.getElementById('battle-modal');
  const log = document.getElementById('battle-log');
  if (!modal || !log) return;
  let stage = modal.querySelector('.league-cinematic-stage');
  if (!(stage instanceof HTMLElement)) { stage = document.createElement('section'); stage.className = 'league-cinematic-stage'; log.before(stage); }
  if (mode === 'roster') {
    stage.dataset.mode = 'roster'; stage.innerHTML = `<div class="league-banner"><span>FRUSTKAMPF-LIGA</span><strong>Reden baut Beziehungen auf. Kämpfen baut einen Stil auf.</strong></div><div class="league-silhouettes">${LEAGUE_IDS.map((id) => figureMarkup(id, 'silhouette')).join('')}</div>`;
    return;
  }
  stage.dataset.mode = 'battle';
  const team = campaignMeta.snapshot().activeTeam;
  stage.innerHTML = `<div class="league-arena-bg"><i></i><i></i><b>HAUPTWEG · RING AUS CAMPINGSTÜHLEN</b></div><div class="league-fighter-slot player">${figureMarkup('player', 'fighter')}<strong>${escapeHtml(readSnapshot().profile?.name ?? 'Du')}</strong></div><div class="league-impact-layer"></div><div class="league-fighter-slot enemy">${figureMarkup(leagueOpponentId, 'fighter')}<strong>${escapeHtml(LEAGUE_OPPONENTS[leagueOpponentId].name)}</strong></div><div class="league-support-cast">${team.map((id, index) => `<div style="--support:${index}">${figureMarkup(id, 'support')}<small>${escapeHtml(id)}</small></div>`).join('')}</div>`;
}

function animateTurn(moveId, result) {
  const stage = document.querySelector('.league-cinematic-stage');
  if (!(stage instanceof HTMLElement)) return;
  window.clearTimeout(animationTimer); window.clearTimeout(counterTimer);
  stage.dataset.attack = attackAnimationKey(moveId); stage.dataset.outcome = result.hit ? (result.critical ? 'critical' : 'hit') : 'miss';
  stage.classList.remove('animate-player', 'animate-counter'); void stage.offsetWidth; stage.classList.add('animate-player');
  const layer = stage.querySelector('.league-impact-layer');
  if (layer) layer.innerHTML = `<span class="league-effect effect-${attackAnimationKey(moveId)}"></span><b>${result.hit ? `${result.critical ? 'KRITISCH · ' : ''}+${result.playerDamage}` : 'VORBEI'}</b>`;
  dispatchWorldAnimation(undefined, result.animation);
  dispatchWorldAnimation(leagueOpponentId, result.hit ? 'hit' : 'argue');
  if (result.counterDamage > 0) counterTimer = window.setTimeout(() => { stage.classList.add('animate-counter'); if (layer) layer.insertAdjacentHTML('beforeend', `<em>GEGENFRUST +${result.counterDamage}</em>`); }, 330);
  animationTimer = window.setTimeout(() => { stage.classList.remove('animate-player', 'animate-counter'); delete stage.dataset.attack; delete stage.dataset.outcome; if (layer) layer.innerHTML = ''; }, 980);
}

function figureMarkup(id, variant) {
  const opponent = LEAGUE_OPPONENTS[id];
  const palette = opponent?.palette ?? (id === 'player' ? ['#e4ad3c', '#a96e24', '#f5e5b5', '#513627'] : paletteForTeam(id));
  const accessory = opponent?.accessory ?? 'none';
  return `<div class="league-character ${variant}" data-character="${id}" data-accessory="${accessory}" style="--shirt:${palette[0]};--shade:${palette[1]};--accent:${palette[2]};--hair:${palette[3]}"><i class="shadow"></i><span class="legs"><i></i><i></i></span><span class="torso"><i class="arm left"></i><i class="arm right"></i><b></b></span><span class="head"><i class="hair"></i><b class="eye left"></b><b class="eye right"></b><em></em></span><span class="accessory"></span></div>`;
}

function paletteForTeam(id) {
  const palettes = { andre: ['#e4ad3c','#a96e24','#f5e5b5','#513627'], rene: ['#2f8b87','#1d5f62','#f0d39a','#242323'], lars: ['#5f7042','#3f4d31','#b94a3d','#4d3224'], danny: ['#396e9d','#234b75','#e9eef2','#5b3927'], felix: ['#9a4eb2','#653477','#f3d5e9','#6a442c'], manni: ['#5d794a','#3d5232','#f0d071','#57402e'] };
  return palettes[id] ?? ['#476c5b','#24483c','#e9bd52','#3a2a22'];
}

function updateBars(state) {
  const playerBar = document.getElementById('battle-player-bar'); const enemyBar = document.getElementById('battle-enemy-bar');
  const playerValue = document.getElementById('battle-player-value'); const enemyValue = document.getElementById('battle-enemy-value');
  if (playerBar) playerBar.style.width = `${state.player.frustration / state.player.maxFrustration * 100}%`;
  if (enemyBar) enemyBar.style.width = `${state.enemy.frustration / state.enemy.maxFrustration * 100}%`;
  if (playerValue) playerValue.textContent = `${Math.round(state.player.frustration)} / ${state.player.maxFrustration}`;
  if (enemyValue) enemyValue.textContent = `${Math.round(state.enemy.frustration)} / ${state.enemy.maxFrustration}`;
}

function cleanProgressionExtras() { document.querySelectorAll('#battle-moves .progression-support,#battle-moves .signature-button').forEach((node) => node.remove()); }
function dispatchWorldAnimation(id, animation) { window.dispatchEvent(new CustomEvent('lpc-campaign-animation', { detail: { id, animation } })); }
function resetLeagueRuntime() { leagueBattle = undefined; leagueOpponentId = ''; battleStartMeta = undefined; resultSummary = undefined; rewardApplied = false; forceUnlock = false; const modal = document.getElementById('battle-modal'); if (modal) { delete modal.dataset.leagueActive; delete modal.dataset.leagueSelect; } }
function signed(value) { return `${value >= 0 ? '+' : ''}${Math.round(value)}`; }
function escapeHtml(value) { return String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character] ?? character); }

function exposeDebug() {
  if (new URLSearchParams(location.search).get('smoke') !== '1') return;
  window.__lpcBattleLeagueV4 = {
    showRoster(force = true) { showRoster(force); },
    start(id, force = true) { startLeagueOpponent(id, force); },
    move(id) { playLeagueMove(id); },
    setState(values) { if (leagueBattle) { Object.assign(leagueBattle, values); if (values.player) Object.assign(leagueBattle.player, values.player); if (values.enemy) Object.assign(leagueBattle.enemy, values.enemy); renderLeagueBattle(); } },
    finish(won = true) { if (!leagueBattle) return; leagueBattle.finished = true; leagueBattle.won = won; if (won) leagueBattle.enemy.frustration = leagueBattle.enemy.maxFrustration; else leagueBattle.player.frustration = leagueBattle.player.maxFrustration; settleLeagueBattle(); renderLeagueBattle(); },
    snapshot() { return { version: BATTLE_LEAGUE_VERSION, opponentId: leagueOpponentId, state: leagueBattle ? structuredClone(leagueBattle) : null, result: resultSummary ? structuredClone(resultSummary) : null, rank: leagueRank(campaignMeta.snapshot()), roster: LEAGUE_IDS.map((id) => ({ id, ...opponentUnlockState(campaignMeta.snapshot(), id) })) }; },
  };
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') install();
