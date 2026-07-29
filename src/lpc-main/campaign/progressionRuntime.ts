import { GameStore, type StorageAdapter } from '../../game/state/GameStore';
import { COMBAT_MOVES } from '../../game/combatMoves';
import type { CombatMoveId, GameSnapshot } from '../../game/types';
import { campaignMeta } from './metaStore';
import { ANECDOTES, COMPANION_ACTIONS, branchLabel, weekendRank, type AnecdoteId, type AttackBranch } from './progression';
import { CAMPAIGN_OPPONENTS, applyActiveCompanion, armSignatureAttack, battlePrediction, createBattle, currentCampaignBattle, resolveBattleTurn, setBattleProgressionContext, type BattleState } from './battleEngine';
import './progression.css';

const SAVE_KEY = 'tales-blaue-adria-lpc-main-v1';
class NamespacedStorage implements StorageAdapter {
  getItem(): string | null { return localStorage.getItem(SAVE_KEY); }
  setItem(_key: string, value: string): void { localStorage.setItem(SAVE_KEY, value); }
  removeItem(): void { localStorage.removeItem(SAVE_KEY); }
}

let finalBattle: BattleState | undefined;
let patchQueued = false;
let inferenceLock = false;
const observerOptions: MutationObserverInit = { childList: true, subtree: true, characterData: true };
const observer = new MutationObserver(() => queuePatch());

campaignMeta.subscribe((meta) => {
  setBattleProgressionContext(campaignMeta.progressionContext());
  if (!inferenceLock) inferProgression(meta);
  queuePatch();
});

window.addEventListener('lpc-campaign-attack-use', ((event: CustomEvent<{ id: CombatMoveId; success: boolean }>) => {
  campaignMeta.recordAttackUse(event.detail.id, event.detail.success);
}) as EventListener);
window.addEventListener('lpc-campaign-battle-state', ((event: CustomEvent<BattleState>) => {
  patchBattle(event.detail);
  if (event.detail.finished && event.detail.won && event.detail.opponentId === 'ronny') campaignMeta.recordBattleVictory('ronny');
}) as EventListener);

observer.observe(document.documentElement, observerOptions);
window.addEventListener('load', () => queuePatch());
queuePatch();

function inferProgression(meta: ReturnType<typeof campaignMeta.snapshot>): void {
  inferenceLock = true;
  try {
    if (meta.questStage === 'reunion' && meta.firstBeerOpened && meta.activeTeam.length >= 1) campaignMeta.setStage('free-weekend', 'Die Gruppe ist wieder vollständig genug, um Entscheidungen kollektiv falsch zu treffen. Das freie Wochenende beginnt.');
    const thresholds: Record<string, { score: number; anecdote: AnecdoteId }> = {
      flipCup: { score: 112, anecdote: 'all-at-once' }, beerPong: { score: 108, anecdote: 'bank-shot' }, flunkyball: { score: 145, anecdote: 'stop-means-stop' }, maslHole: { score: 255, anecdote: 'masl-tunnel' },
    };
    for (const [id, rule] of Object.entries(thresholds)) if ((meta.miniResults[id]?.best ?? 0) >= rule.score) campaignMeta.unlockAnecdote(rule.anecdote);
    if (meta.flags.hedgeRelieved && meta.suspicion < 15) campaignMeta.unlockAnecdote('hedge-silent');
    if (meta.flags.hedgeCaught) campaignMeta.unlockAnecdote('gundula-noted');
    if (!meta.flags['progression-v3-online']) campaignMeta.setFlag('progression-v3-online', true);
  } finally { inferenceLock = false; }
}

function queuePatch(): void {
  if (patchQueued) return;
  patchQueued = true;
  window.setTimeout(() => {
    patchQueued = false;
    observer.disconnect();
    try {
      patchHud();
      patchCampfireModal();
      patchQuestBoard();
      const state = currentCampaignBattle(); if (state) patchBattle(state);
    } finally {
      observer.observe(document.documentElement, observerOptions);
    }
  }, 16);
}

function patchHud(): void {
  const score = document.getElementById('weekend-score');
  const stats = score?.closest('.top-stats');
  if (stats && !stats.querySelector('.rank-badge')) {
    const badge = document.createElement('em'); badge.className = 'rank-badge'; badge.innerHTML = '<small>RUF</small><strong></strong>'; stats.append(badge);
  }
  const rank = weekendRank(campaignMeta.snapshot().weekendScore);
  const rankStrong = stats?.querySelector<HTMLElement>('.rank-badge strong'); if (rankStrong && rankStrong.textContent !== rank.label) rankStrong.textContent = rank.label;
  const meta = campaignMeta.snapshot();
  document.querySelectorAll<HTMLButtonElement>('[data-attack-toggle]').forEach((button) => {
    const id = button.dataset.attackToggle as CombatMoveId; const mastery = meta.attackMastery[id]; const small = button.querySelector('small');
    const text = `${meta.equippedAttacks.includes(id) ? 'ausgerüstet' : 'gelernt'} · M${mastery?.level ?? 1} · ${branchLabel(mastery?.branch)}`;
    if (small && small.textContent !== text) small.textContent = text;
  });
  const attackList = document.getElementById('attack-list');
  if (attackList) {
    let anecdotes = attackList.parentElement?.querySelector<HTMLElement>('.anecdote-hud');
    if (!anecdotes) { anecdotes = document.createElement('div'); anecdotes.className = 'anecdote-hud'; attackList.parentElement?.append(anecdotes); }
    const html = `<b>Anekdoten ${meta.equippedAnecdotes.length}/2</b>${meta.equippedAnecdotes.map((id) => `<span>${escapeHtml(ANECDOTES[id].label)}</span>`).join('') || '<small>Noch keine ausgerüstet.</small>'}`;
    if (anecdotes.innerHTML !== html) anecdotes.innerHTML = html;
  }
}

function patchCampfireModal(): void {
  const modal = document.getElementById('generic-modal'); const title = document.getElementById('modal-title'); const options = document.getElementById('modal-options');
  if (!modal || modal.hidden || !title || !options || title.textContent !== 'Team und Attacken') return;
  let panel = options.querySelector<HTMLElement>('.progression-tools'); if (panel) return;
  const meta = campaignMeta.snapshot(); panel = document.createElement('section'); panel.className = 'progression-tools';
  const masteryRows = meta.learnedAttacks.map((id) => {
    const state = meta.attackMastery[id]; if (!state || state.level < 2) return '';
    if (state.branch) return `<div class="mastery-row"><strong>${escapeHtml(COMBAT_MOVES[id].shortLabel)} · Meisterschaft ${state.level}</strong><small>${branchLabel(state.branch)}</small></div>`;
    return `<div class="mastery-row"><strong>${escapeHtml(COMBAT_MOVES[id].shortLabel)} · Spezialisierung</strong><div><button data-branch="impact" data-mastery="${id}">Wirkung</button><button data-branch="control" data-mastery="${id}">Kontrolle</button></div></div>`;
  }).join('');
  const anecdotes = meta.unlockedAnecdotes.map((id) => `<button class="anecdote-choice ${meta.equippedAnecdotes.includes(id) ? 'equipped' : ''}" data-anecdote="${id}"><strong>${escapeHtml(ANECDOTES[id].label)}</strong><small>${escapeHtml(ANECDOTES[id].detail)}</small></button>`).join('');
  panel.innerHTML = `<header><span>KAMPFPROGRESSION</span><strong>${weekendRank(meta.weekendScore).label}</strong><small>${campaignMeta.attackSlotLimit()} Attacken · ${weekendRank(meta.weekendScore).companionSlots} Begleiter · 2 Anekdoten</small></header>${masteryRows || '<p>Attacken steigen durch erfolgreiche Einsätze auf. Ab Meisterschaft 2 wird eine Spezialisierung gewählt.</p>'}<h3>Anekdoten</h3><div class="anecdote-grid">${anecdotes || '<p>Legendäre oder peinliche Minispielergebnisse werden hier ausrüstbar.</p>'}</div>`;
  options.append(panel);
  panel.querySelectorAll<HTMLButtonElement>('[data-mastery]').forEach((button) => button.addEventListener('click', () => { campaignMeta.chooseAttackBranch(button.dataset.mastery as CombatMoveId, button.dataset.branch as AttackBranch); panel?.remove(); patchCampfireModal(); }));
  panel.querySelectorAll<HTMLButtonElement>('[data-anecdote]').forEach((button) => button.addEventListener('click', () => { campaignMeta.toggleAnecdote(button.dataset.anecdote as AnecdoteId); panel?.remove(); patchCampfireModal(); }));
}

function patchQuestBoard(): void {
  const modal = document.getElementById('generic-modal'); const options = document.getElementById('modal-options'); const meta = campaignMeta.snapshot();
  if (!modal || modal.hidden || !options || meta.questStage !== 'sunday-final' || options.querySelector('[data-start-final]')) return;
  const button = document.createElement('button'); button.dataset.startFinal = '1'; button.className = 'tone-danger final-start'; button.innerHTML = '<strong>Sonntagsabnahme beginnen</strong><small>Dreiphasiger Endkampf. Team, Meisterschaft, Ruf und Anekdoten wirken vollständig.</small>';
  button.addEventListener('click', startFinalBattle); options.prepend(button);
}

function patchBattle(state: BattleState): void {
  const modal = document.getElementById('battle-modal'); if (!modal || modal.hidden) return;
  const round = document.getElementById('battle-round'); const roundText = `Runde ${state.round} · ${state.phaseLabel} · Momentum ${'●'.repeat(state.momentum)}${'○'.repeat(3 - state.momentum)}`; if (round && round.textContent !== roundText) round.textContent = roundText;
  updateBattleBars(state);
  const moves = document.getElementById('battle-moves'); if (!moves || state.finished) return;
  moves.querySelectorAll('.progression-support,.signature-button').forEach((node) => node.remove());
  const meta = campaignMeta.snapshot();
  moves.querySelectorAll<HTMLButtonElement>('[data-battle-move]').forEach((button) => {
    const id = button.dataset.battleMove as CombatMoveId; const mastery = meta.attackMastery[id];
    if (mastery?.level === 3) {
      const signature = document.createElement('button'); signature.className = 'signature-button'; signature.disabled = state.momentum < 2; signature.innerHTML = `<strong>SIGNATUR · 2M</strong><small>${escapeHtml(COMBAT_MOVES[id].shortLabel)} in Meisterschaft 3</small>`;
      signature.addEventListener('click', () => { armSignatureAttack(id); button.click(); }); button.after(signature);
    }
  });
  const support = document.createElement('section'); support.className = 'progression-support'; support.innerHTML = '<header><strong>Begleiteraktionen</strong><small>Einmal pro Kampf · kosten Momentum</small></header>';
  for (const id of meta.activeTeam) {
    const action = COMPANION_ACTIONS[id]; if (!action) continue; const button = document.createElement('button'); button.disabled = state.usedCompanions.includes(id) || state.momentum < action.momentum; button.innerHTML = `<strong>${escapeHtml(action.label)} · ${action.momentum}M</strong><small>${escapeHtml(action.detail)}</small>`;
    button.addEventListener('click', () => { const result = applyActiveCompanion(id); if (result) { animate(id, result.animation); const current = currentCampaignBattle(); if (current) patchBattle(current); } }); support.append(button);
  }
  if (meta.activeTeam.length) moves.append(support);
}

function updateBattleBars(state: BattleState): void {
  const playerBar = document.getElementById('battle-player-bar'); const enemyBar = document.getElementById('battle-enemy-bar');
  if (playerBar) playerBar.style.width = `${state.player.frustration / state.player.maxFrustration * 100}%`;
  if (enemyBar) enemyBar.style.width = `${state.enemy.frustration / state.enemy.maxFrustration * 100}%`;
  const playerValue = document.getElementById('battle-player-value'); const enemyValue = document.getElementById('battle-enemy-value');
  if (playerValue) playerValue.textContent = `${Math.round(state.player.frustration)} / ${state.player.maxFrustration}`;
  if (enemyValue) enemyValue.textContent = `${Math.round(state.enemy.frustration)} / ${state.enemy.maxFrustration}`;
  const log = document.getElementById('battle-log'); const html = state.log.slice().reverse().map((line, i) => `<p class="${i === 0 ? 'latest' : ''}">${escapeHtml(line)}</p>`).join(''); if (log && log.innerHTML !== html) log.innerHTML = html;
}

function startFinalBattle(): void {
  const generic = document.getElementById('generic-modal'); if (generic) generic.hidden = true;
  const battle = document.getElementById('battle-modal'); if (!battle) return; battle.hidden = false; document.body.classList.add('campaign-modal-open');
  finalBattle = createBattle('sunday-inspection', campaignMeta.progressionContext()); renderFinalBattle(); animate('gundula', 'point'); animate('uli', 'carry');
}

function renderFinalBattle(): void {
  const state = finalBattle; if (!state) return; const opponent = CAMPAIGN_OPPONENTS['sunday-inspection'];
  const title = document.getElementById('battle-title'); if (title) title.textContent = `${opponent.name} · ${opponent.title}`;
  updateBattleBars(state); patchBattle(state);
  const close = document.getElementById('battle-close') as HTMLButtonElement | null; const moves = document.getElementById('battle-moves'); if (!moves) return;
  if (state.finished) {
    moves.innerHTML = `<div class="battle-finish ${state.won ? 'won' : 'lost'}"><strong>${state.won ? 'WOCHENENDE BESTANDEN' : 'KAUTION GEFÄHRDET'}</strong><p>${state.won ? 'Das Abschlussprotokoll endet ohne Nachforderung.' : 'Die Abnahme kann erneut vorbereitet und versucht werden.'}</p></div>`;
    if (close) close.hidden = false; if (state.won) campaignMeta.winFinalBattle(); return;
  }
  if (close) close.hidden = true;
  const snapshot = readSnapshot(); const meta = campaignMeta.snapshot();
  moves.innerHTML = meta.equippedAttacks.slice(0, campaignMeta.attackSlotLimit()).map((id) => `<button type="button" data-final-move="${id}"><strong>${escapeHtml(COMBAT_MOVES[id].label)}</strong><span>${escapeHtml(COMBAT_MOVES[id].description)}</span><small>${escapeHtml(battlePrediction(id, state, snapshot, meta.activeTeam.length + 1, campaignMeta.progressionContext()))}</small></button>`).join('');
  moves.querySelectorAll<HTMLButtonElement>('[data-final-move]').forEach((button) => button.addEventListener('click', () => finalMove(button.dataset.finalMove as CombatMoveId)));
  patchBattle(state);
}

function finalMove(id: CombatMoveId): void {
  if (!finalBattle || finalBattle.finished) return; const result = resolveBattleTurn(finalBattle, id, readSnapshot(), campaignMeta.snapshot().activeTeam.length + 1, campaignMeta.progressionContext()); finalBattle = result.state; animate(undefined, result.animation); animate('gundula', result.hit ? 'hit' : 'argue'); renderFinalBattle();
}
function readSnapshot(): GameSnapshot { return campaignMeta.augmentSnapshot(new GameStore(new NamespacedStorage()).snapshot()); }
function animate(id: string | undefined, animation: string): void { window.dispatchEvent(new CustomEvent('lpc-campaign-animation', { detail: { id, animation } })); }
function escapeHtml(value: string): string { return value.replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character] ?? character); }
