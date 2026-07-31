const UPDATE_VERSION = '2.0.0';
const CORE_META_KEY = 'tales-blaue-adria-lpc-campaign-meta-v2';
const BASE_SAVE_KEY = 'tales-blaue-adria-lpc-main-v1';
const DEPTH_SAVE_KEY = 'tales-blaue-adria-gameplay-depth-v2';
const OLYMPIAD_IDS = ['flipCup', 'beerPong', 'flunkyball'];
const SECRET_CANDIDATES = ['rene', 'lars', 'danny', 'gregor', 'masl', 'schubert', 'felix', 'schima', 'ronny', 'manni', 'susi', 'jule'];
const CANDIDATE_LABELS = {
  rene: 'René', lars: 'Lars', danny: 'Danny', gregor: 'Gregor', masl: 'Masl', schubert: 'Schubert',
  felix: 'Felix', schima: 'Schima', ronny: 'Ronny', manni: 'Manni', susi: 'Susi', jule: 'Jule',
};
const CANDIDATE_TRAITS = {
  rene: ['planung', 'ordnung', 'logistik'],
  lars: ['sozial', 'getraenke', 'improvisation'],
  danny: ['chaos', 'bewegung', 'widerspruch'],
  gregor: ['analyse', 'sport', 'beobachtung'],
  masl: ['chaos', 'schlaf', 'improvisation'],
  schubert: ['planung', 'technik', 'ordnung'],
  felix: ['analyse', 'zeit', 'ordnung'],
  schima: ['getraenke', 'sozial', 'logistik'],
  ronny: ['analyse', 'widerspruch', 'ego'],
  manni: ['technik', 'bewegung', 'logistik'],
  susi: ['sozial', 'beobachtung', 'ego'],
  jule: ['sozial', 'widerspruch', 'beobachtung'],
};

export function clamp(value, min, max) {
  const number = Number.isFinite(Number(value)) ? Number(value) : min;
  return Math.max(min, Math.min(max, number));
}

export function hashString(value) {
  let hash = 2166136261;
  for (const char of String(value)) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function chooseNextMillionaire({ seed = 0, round = 1, eliminated = [], previous = '' } = {}) {
  const blocked = new Set(eliminated);
  let pool = SECRET_CANDIDATES.filter((id) => !blocked.has(id) && id !== previous);
  if (!pool.length) pool = SECRET_CANDIDATES.filter((id) => !blocked.has(id));
  if (!pool.length) pool = [...SECRET_CANDIDATES];
  return pool[hashString(`${seed}:${round}:${previous}:${pool.join('|')}`) % pool.length];
}

export function buildSecretClues({ millionaireId = 'rene', round = 1, seed = 0, difficulty = 'standard' } = {}) {
  const traits = CANDIDATE_TRAITS[millionaireId] ?? ['beobachtung', 'sozial', 'planung'];
  const primary = traits[(round - 1) % traits.length];
  const secondary = traits[round % traits.length];
  const decoyPool = ['technik', 'getraenke', 'bewegung', 'analyse', 'ordnung', 'chaos', 'sozial'];
  let decoy = decoyPool[hashString(`${seed}:${round}:decoy`) % decoyPool.length];
  if (traits.includes(decoy)) decoy = decoyPool[(decoyPool.indexOf(decoy) + 3) % decoyPool.length];
  const traitText = {
    planung: 'Die Aktion wirkte vorbereitet, aber nicht vollständig durchdacht.',
    ordnung: 'Jemand kannte Abläufe, Wege und Zeitfenster auffällig genau.',
    logistik: 'Ein Gegenstand wechselte den Ort, ohne dass jemand den Transport bemerkt haben will.',
    sozial: 'Die Mission nutzte Gespräche und Gruppendynamik statt Geschwindigkeit.',
    getraenke: 'Ein Getränk oder Kronkorken wurde als unauffällige Tarnung eingesetzt.',
    improvisation: 'Der Ablauf änderte sich spontan, ohne vollständig zusammenzubrechen.',
    chaos: 'Mehrere kleine Störungen verdeckten eine gezielte Handlung.',
    bewegung: 'Die gesuchte Person war kurz außerhalb des üblichen Blickfelds.',
    widerspruch: 'Zwei Aussagen passen zeitlich oder inhaltlich nicht sauber zusammen.',
    analyse: 'Jemand stellte ungewöhnlich präzise Fragen, bevor überhaupt Verdacht bestand.',
    sport: 'Timing und eine kurze körperliche Aktion waren wichtiger als ein Gespräch.',
    beobachtung: 'Die Person wusste etwas, das nur aus genauer Beobachtung stammen konnte.',
    schlaf: 'Die Mission nutzte einen Moment, in dem andere unaufmerksam oder erschöpft waren.',
    technik: 'Ein technischer Gegenstand oder eine Platzinstallation spielte vermutlich eine Nebenrolle.',
    zeit: 'Ein enges Zeitfenster ist zuverlässiger als die widersprüchlichen Zeugenaussagen.',
    ego: 'Die handelnde Person wollte nicht nur Erfolg, sondern auch Anerkennung für die Idee.',
  };
  const clueA = traitText[primary] ?? traitText.beobachtung;
  const clueB = traitText[secondary] ?? traitText.sozial;
  const clueC = `Unbestätigtes Gerücht: ${traitText[decoy] ?? traitText.technik}`;
  if (difficulty === 'easy') return [clueA, clueB, 'Hinweis: Mindestens zwei weitere Personen teilen jeweils eines dieser Merkmale. Namen werden bewusst nicht genannt.'];
  if (difficulty === 'expert') return [clueA, clueC, 'Die dritte Spur wurde durch Nachtlärm und Gruppengerüchte unbrauchbar.'];
  return [clueA, clueB, clueC];
}

export function computeDirectorState(core = {}, base = {}, depth = {}) {
  const arc = core.weekendArc ?? {};
  const olympiad = arc.olympiad ?? {};
  const saturday = arc.saturday ?? {};
  const relationships = Object.values(core.relationshipBonus ?? {}).filter(Number.isFinite);
  const relationAverage = relationships.length ? relationships.reduce((sum, value) => sum + value, 0) / relationships.length : 0;
  const stateRoot = base.state ?? base.snapshot ?? base;
  const needs = stateRoot.needs ?? {};
  const metrics = stateRoot.metrics ?? {};
  const strategyValues = Object.values(depth.olympiad?.strategies ?? {});
  const teamwork = strategyValues.filter((value) => value === 'team').length;
  const risk = strategyValues.filter((value) => value === 'risk').length;
  const safety = strategyValues.filter((value) => value === 'safe').length;
  const outcomes = depth.olympiad?.outcomes ?? [];
  const wins = outcomes.filter((entry) => entry.success).length;
  const perfects = outcomes.filter((entry) => entry.quality === 'perfect').length;
  const failures = outcomes.filter((entry) => !entry.success).length;
  const cohesion = clamp(48 + relationAverage * 0.35 + (core.activeTeam?.length ?? 0) * 5 + teamwork * 8 + wins * 2 - failures * 3, 0, 100);
  const fatigue = clamp((100 - Number(needs.energy ?? 75)) * 0.55 + Number(needs.alcohol ?? 0) * 0.22 + risk * 9 + outcomes.length * 3 - safety * 4, 0, 100);
  const authorityHeat = clamp(Number(arc.nightNoise ?? 0) * 0.78 + Number(core.suspicion ?? 0) * 0.3 + risk * 5 - safety * 4 - (core.flags?.['authority-goodwill'] ? 9 : 0), 0, 100);
  const preparation = clamp((saturday.dannyTestimony ? 12 : 0) + (saturday.felixTimeline ? 18 : 0) + teamwork * 7 + Number(metrics.reputation ?? 0) * 0.15 + perfects * 4, 0, 100);
  const morale = clamp(42 + Number(core.weekendScore ?? 0) * 0.18 + Number(metrics.momentum ?? 0) * 0.5 + wins * 5 - failures * 4 - fatigue * 0.2, 0, 100);
  return { cohesion: Math.round(cohesion), fatigue: Math.round(fatigue), authorityHeat: Math.round(authorityHeat), preparation: Math.round(preparation), morale: Math.round(morale) };
}

export function applyPreparationToMeta(core, choice, director = {}) {
  const cloned = JSON.parse(JSON.stringify(core ?? {}));
  const arc = cloned.weekendArc ?? (cloned.weekendArc = {});
  const saturday = arc.saturday ?? (arc.saturday = {});
  const pressure = Number(saturday.debatePressure ?? 0);
  const crowd = Number(saturday.debateCrowd ?? 0);
  if (choice === 'evidence') {
    const completeEvidence = Boolean(saturday.dannyTestimony && saturday.felixTimeline);
    saturday.debatePressure = clamp(pressure - (completeEvidence ? 14 : 8), 0, 100);
    saturday.debateCrowd = clamp(crowd + (completeEvidence ? 4 : 1), -30, 60);
  } else if (choice === 'rally') {
    saturday.debatePressure = clamp(pressure - 4, 0, 100);
    saturday.debateCrowd = clamp(crowd + (Number(director.cohesion ?? 0) >= 65 ? 14 : 8), -30, 60);
  } else if (choice === 'recover') {
    saturday.wakeMood = clamp(Number(saturday.wakeMood ?? 0) + 12, 0, 100);
    saturday.debatePressure = clamp(pressure - 5, 0, 100);
  } else if (choice === 'bluff') {
    saturday.debatePressure = clamp(pressure - 10, 0, 100);
    saturday.debateCrowd = clamp(crowd + 5, -30, 60);
    arc.nightNoise = clamp(Number(arc.nightNoise ?? 0) + 6, 0, 100);
  }
  cloned.lastEvent = `Großes Gameplay-Update: Samstagsvorbereitung „${choice}“ wurde auf die Debatte angewandt.`;
  return cloned;
}

function defaultDepthState() {
  return {
    version: 2,
    updateVersion: UPDATE_VERSION,
    olympiad: { strategies: {}, outcomes: [], lastOutcome: '', lastOutcomeAt: 0, noiseApplied: false, noiseModifier: 0 },
    saturday: { preparationChoice: '', applied: false },
    secret: { difficulty: 'standard', roleHistory: {}, asked: {}, investigatorScore: 0, rivalAdjusted: false, pendingAccusation: null },
    history: [],
  };
}

function parseStorage(key, fallback = {}) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function loadDepth() {
  const raw = parseStorage(DEPTH_SAVE_KEY, {});
  const base = defaultDepthState();
  return {
    ...base,
    ...raw,
    version: 2,
    updateVersion: UPDATE_VERSION,
    olympiad: { ...base.olympiad, ...(raw.olympiad ?? {}), strategies: { ...base.olympiad.strategies, ...(raw.olympiad?.strategies ?? {}) }, outcomes: Array.isArray(raw.olympiad?.outcomes) ? raw.olympiad.outcomes.slice(-12) : [] },
    saturday: { ...base.saturday, ...(raw.saturday ?? {}) },
    secret: { ...base.secret, ...(raw.secret ?? {}), roleHistory: { ...base.secret.roleHistory, ...(raw.secret?.roleHistory ?? {}) }, asked: { ...base.secret.asked, ...(raw.secret?.asked ?? {}) } },
    history: Array.isArray(raw.history) ? raw.history.slice(-40) : [],
  };
}

function saveDepth(depth) {
  localStorage.setItem(DEPTH_SAVE_KEY, JSON.stringify({ ...depth, history: (depth.history ?? []).slice(-40) }));
}

function readCore() { return parseStorage(CORE_META_KEY, {}); }
function readBase() { return parseStorage(BASE_SAVE_KEY, {}); }
function writeCore(core) { localStorage.setItem(CORE_META_KEY, JSON.stringify(core)); }
function label(id) { return CANDIDATE_LABELS[id] ?? String(id); }
function escapeHtml(value) { return String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char] ?? char); }
function currentDiscipline(core) {
  const olympiad = core.weekendArc?.olympiad;
  if (!olympiad) return '';
  return olympiad.current || OLYMPIAD_IDS.find((id) => !olympiad.disciplines?.[id]?.attempted) || '';
}
function strategyLabel(value) { return ({ safe: 'Kontrolliert', team: 'Teamfokus', risk: 'Volles Risiko' })[value] ?? 'Ausgeglichen'; }
function difficultyLabel(value) { return ({ easy: 'Locker', standard: 'Standard', expert: 'Experte' })[value] ?? 'Standard'; }
function stageIsSecret(core) { return core.questStage === 'secret-millionaire' || Boolean(core.weekendArc?.secretMillionaire?.started); }

function recordHistory(depth, text) {
  depth.history = [...(depth.history ?? []), { at: new Date().toISOString(), text }].slice(-40);
}

function recordOlympiadOutcome(event) {
  const outcome = event?.detail;
  if (!outcome || !OLYMPIAD_IDS.includes(outcome.id)) return;
  const depth = loadDepth();
  const fingerprint = `${outcome.id}:${outcome.success}:${outcome.score}:${outcome.quality}`;
  const now = Date.now();
  if (depth.olympiad.lastOutcome === fingerprint && now - depth.olympiad.lastOutcomeAt < 1800) return;
  depth.olympiad.lastOutcome = fingerprint;
  depth.olympiad.lastOutcomeAt = now;
  const strategy = depth.olympiad.strategies[outcome.id] ?? 'balanced';
  depth.olympiad.outcomes = [...depth.olympiad.outcomes.filter((entry) => entry.id !== outcome.id), {
    id: outcome.id, success: Boolean(outcome.success), score: Number(outcome.score ?? 0), quality: outcome.quality ?? (outcome.success ? 'solid' : 'failed'), strategy,
  }];
  recordHistory(depth, `${outcome.id}: ${outcome.success ? 'Erfolg' : 'Fehlschlag'} mit ${strategyLabel(strategy)}.`);
  saveDepth(depth);
  showToast(`${strategyLabel(strategy)} ausgewertet: ${outcome.success ? 'Form aufgebaut' : 'Folgekosten steigen'}.`);
}

function applyOlympiadNoiseModifier() {
  const depth = loadDepth();
  const core = readCore();
  if (depth.olympiad.noiseApplied || !core.weekendArc?.olympiad?.completed) return;
  const strategies = Object.values(depth.olympiad.strategies ?? {});
  const outcomes = depth.olympiad.outcomes ?? [];
  const modifier = strategies.reduce((sum, value) => sum + (value === 'safe' ? -3 : value === 'risk' ? 4 : value === 'team' ? -1 : 0), 0)
    + outcomes.filter((entry) => !entry.success).length * 3
    - outcomes.filter((entry) => entry.quality === 'perfect').length * 2;
  core.weekendArc.nightNoise = clamp(Number(core.weekendArc.nightNoise ?? 0) + modifier, 0, 100);
  core.lastEvent = `Olympiadestrategien verändern den endgültigen Nachtlärm um ${modifier >= 0 ? '+' : ''}${modifier}.`;
  depth.olympiad.noiseApplied = true;
  depth.olympiad.noiseModifier = modifier;
  recordHistory(depth, `Nachtlärm-Modifikator ${modifier >= 0 ? '+' : ''}${modifier} angewandt.`);
  writeCore(core);
  saveDepth(depth);
  reloadSafely();
}

function applySaturdayChoice(choice) {
  const depth = loadDepth();
  const core = readCore();
  if (depth.saturday.applied || core.questStage !== 'saturday-debate') return;
  const director = computeDirectorState(core, readBase(), depth);
  const next = applyPreparationToMeta(core, choice, director);
  depth.saturday.applied = true;
  depth.saturday.preparationChoice = choice;
  recordHistory(depth, `Samstagsvorbereitung gewählt: ${choice}.`);
  writeCore(next);
  saveDepth(depth);
  reloadSafely();
}

function expectedRivalScore(difficulty, current) {
  if (difficulty === 'easy') return Math.min(4, Math.max(3, Number(current ?? 3)));
  if (difficulty === 'expert') return Math.max(7, Number(current ?? 7));
  return clamp(Number(current ?? 5), 5, 6);
}

function ensureSecretState(core, depth) {
  const game = core.weekendArc?.secretMillionaire;
  if (!game?.started || game.completed) return false;
  const round = Math.max(1, Number(game.round ?? 1));
  let changed = false;
  if (!depth.secret.roleHistory[round]) {
    depth.secret.roleHistory[round] = game.millionaireId || chooseNextMillionaire({ seed: core.weekendScore, round, eliminated: game.eliminated });
    changed = true;
  }
  const expectedRole = depth.secret.roleHistory[round];
  if (expectedRole && game.millionaireId !== expectedRole) {
    game.millionaireId = expectedRole;
    changed = true;
  }
  if (!depth.secret.rivalAdjusted && round === 1 && (game.accusations?.length ?? 0) === 0) {
    game.rivalScore = expectedRivalScore(depth.secret.difficulty, game.rivalScore);
    depth.secret.rivalAdjusted = true;
    changed = true;
  }
  if (changed) {
    writeCore(core);
    saveDepth(depth);
  }
  return changed;
}

function finalizeSecretAccusation(pending) {
  const depth = loadDepth();
  const core = readCore();
  const game = core.weekendArc?.secretMillionaire;
  if (!game || !pending) return;
  const accusation = (game.accusations ?? []).find((entry) => Number(entry.round) === Number(pending.round) && entry.suspectId === pending.suspectId);
  if (!accusation) return;
  const correct = pending.suspectId === pending.role;
  depth.secret.investigatorScore = clamp(Number(depth.secret.investigatorScore ?? 0) + (correct ? Number(pending.round) * 3 : -1), -10, 40);
  recordHistory(depth, `Secret Millionär Runde ${pending.round}: ${label(pending.suspectId)} ${correct ? 'richtig' : 'falsch'} beschuldigt.`);
  depth.secret.pendingAccusation = null;
  if (!game.completed && Number(game.round) > Number(pending.round)) {
    const nextRound = Number(game.round);
    const nextRole = chooseNextMillionaire({
      seed: Number(core.weekendScore ?? 0) + Number(core.weekendArc?.nightNoise ?? 0) * 7,
      round: nextRound,
      eliminated: game.eliminated ?? [],
      previous: pending.role,
    });
    depth.secret.roleHistory[nextRound] = nextRole;
    game.millionaireId = nextRole;
    if (!correct && depth.secret.difficulty !== 'easy') game.rivalScore = clamp(Number(game.rivalScore ?? 0) + 1, 0, 10);
    core.lastEvent = `Secret Millionär: Runde ${nextRound} erhält ein neues geheimes Mandat. Die vorherige Rolle bleibt bis zur Gesamtauswertung verdeckt.`;
    writeCore(core);
    saveDepth(depth);
    reloadSafely();
    return;
  }
  saveDepth(depth);
  scheduleEnhance();
}

function buildCandidateResponse(id, millionaireId, round, difficulty) {
  const traits = CANDIDATE_TRAITS[id] ?? ['beobachtung'];
  const trueRole = id === millionaireId;
  const trait = traits[(round + hashString(id)) % traits.length];
  const neutral = {
    planung: '„Ich hatte einen Ablauf im Kopf. Das ist auf diesem Platz bereits verdächtig genug.“',
    ordnung: '„Ich weiß nur, wo Dinge liegen. Nicht, warum sie dort plötzlich nicht mehr lagen.“',
    logistik: '„Ich habe etwas getragen. Das macht mich noch nicht zum Drahtzieher.“',
    sozial: '„Ich habe mit vielen gesprochen. Die meisten haben dabei mehr verraten als ich.“',
    getraenke: '„Der Kronkorken beweist nur, dass hier jemand ein Getränk geöffnet hat.“',
    improvisation: '„Der Plan hat sich geändert. Ich wusste nur früher davon als andere.“',
    chaos: '„Dass es um mich herum chaotisch war, ist kein belastbarer Beweis.“',
    bewegung: '„Ich war kurz weg. Andere waren nur zu beschäftigt, das zu bemerken.“',
    widerspruch: '„Meine Aussage widerspricht höchstens einer Version, die ohnehin nicht stimmt.“',
    analyse: '„Ich stelle Fragen, bevor jemand merkt, dass er Antworten braucht.“',
    sport: '„Timing war wichtig. Mehr sage ich dazu nicht.“',
    beobachtung: '„Ich habe etwas gesehen. Ob es wichtig war, entscheide ich später.“',
    schlaf: '„Ich war müde, nicht bewusstlos. Das wird ständig verwechselt.“',
    technik: '„Der Gegenstand funktionierte. Wer ihn benutzt hat, ist eine andere Frage.“',
    zeit: '„Die Uhrzeit stimmt. Die Geschichten darum wahrscheinlich nicht.“',
    ego: '„Eine gute Idee erkennt man auch daran, dass andere sie gern für ihre halten.“',
  }[trait] ?? '„Ich habe genug gesehen, um vorsichtig zu antworten.“';
  if (!trueRole) return neutral;
  if (difficulty === 'easy') return `${neutral} Die Antwort kommt nach einer auffällig langen Pause.`;
  if (difficulty === 'expert') return neutral;
  return `${neutral} Ein Detail wird erst auf Nachfrage korrigiert.`;
}

function candidateSuspicion(id, role, round, depth) {
  const roleTraits = CANDIDATE_TRAITS[role] ?? [];
  const traits = CANDIDATE_TRAITS[id] ?? [];
  const overlap = traits.filter((trait) => roleTraits.includes(trait)).length;
  const asked = (depth.secret.asked?.[round] ?? []).includes(id);
  const noise = hashString(`${id}:${round}:${role}`) % 5;
  return overlap * 3 + (asked ? 2 : 0) + noise;
}

function enhanceSecret(core, depth) {
  const game = core.weekendArc?.secretMillionaire;
  if (!game) return;
  const content = document.querySelector('#weekend-arc-content');
  if (!content) return;
  if (!game.started) {
    if (!content.querySelector('.depth-secret-difficulty')) {
      const panel = document.createElement('section');
      panel.className = 'depth-panel depth-secret-difficulty';
      panel.innerHTML = `<h3>Deduktionsniveau</h3><p>Bestimmt Hinweisqualität, Befragungslimit und Rivalendruck. Der Modus kann bis zur Rollenverteilung geändert werden.</p><div class="depth-choice-row">${['easy', 'standard', 'expert'].map((value) => `<button data-depth-secret-difficulty="${value}" class="${depth.secret.difficulty === value ? 'selected' : ''}"><strong>${difficultyLabel(value)}</strong><small>${value === 'easy' ? '2 klare Spuren · Rivalenwert 3–4' : value === 'expert' ? '1 Befragung · Gerüchte · Rivalenwert 7+' : '2 Befragungen · gemischte Spuren'}</small></button>`).join('')}</div>`;
      content.querySelector('[data-arc-action="start-secret"]')?.before(panel);
    }
    return;
  }
  if (game.completed) {
    patchSecretResult(content, depth, game);
    return;
  }
  const round = Math.max(1, Number(game.round ?? 1));
  const role = depth.secret.roleHistory[round] ?? game.millionaireId;
  const observations = content.querySelector('.secret-observations');
  if (observations) {
    const clues = buildSecretClues({ millionaireId: role, round, seed: Number(core.weekendScore ?? 0) + Number(core.weekendArc?.nightNoise ?? 0), difficulty: depth.secret.difficulty });
    observations.innerHTML = clues.map((line, index) => `<p><strong>Spur ${index + 1}</strong> ${escapeHtml(line)}</p>`).join('');
    observations.classList.add('depth-clues-ready');
  }
  const cards = [...content.querySelectorAll('.secret-candidate')];
  const scores = cards.map((card) => {
    const id = card.querySelector('[data-secret-accuse]')?.getAttribute('data-secret-accuse') ?? '';
    const paragraph = card.querySelector('p');
    if (paragraph && id) {
      const questioned = (game.questioned ?? []).includes(`${round}:${id}`);
      paragraph.textContent = questioned ? buildCandidateResponse(id, role, round, depth.secret.difficulty) : 'Noch keine belastbare Aussage in dieser Runde.';
      paragraph.classList.add('depth-response-ready');
    }
    if (depth.secret.difficulty === 'expert') card.classList.add('depth-expert-card'); else card.classList.remove('depth-expert-card');
    return { id, score: candidateSuspicion(id, role, round, depth) };
  }).filter((entry) => entry.id);
  if (depth.secret.difficulty === 'expert') {
    const askedCount = (game.questioned ?? []).filter((entry) => entry.startsWith(`${round}:`)).length;
    if (askedCount >= 1) content.querySelectorAll('[data-secret-question]').forEach((button) => { if (!button.disabled) button.disabled = true; });
  }
  let caseFile = content.querySelector('.depth-case-file');
  if (!caseFile) {
    caseFile = document.createElement('section');
    caseFile.className = 'depth-panel depth-case-file';
    content.querySelector('.secret-roster')?.before(caseFile);
  }
  if (caseFile) {
    const sorted = scores.sort((a, b) => b.score - a.score).slice(0, depth.secret.difficulty === 'expert' ? 4 : 6);
    caseFile.innerHTML = `<h3>Ermittlungsakte · Runde ${round}/4</h3><p>Jede Runde besitzt ein neues geheimes Mandat. Beschuldigte scheiden aus dem Gewinnpool aus; Punkte und Rollen werden erst am Ende vollständig offengelegt.</p>${depth.secret.difficulty === 'expert' ? '<div class="depth-redacted">Rangfolge teilweise geschwärzt. Nutze Aussagen und Ausschlusslogik.</div>' : `<div class="depth-suspicion-list">${sorted.map((entry, index) => `<span><b>${index + 1}. ${escapeHtml(label(entry.id))}</b><i>${entry.score >= 8 ? 'auffällig' : entry.score >= 5 ? 'unklar' : 'schwach belastet'}</i></span>`).join('')}</div>`}`;
  }
}

function patchSecretResult(content, depth, game) {
  if (content.querySelector('.depth-role-history')) return;
  const roles = Object.entries(depth.secret.roleHistory ?? {}).sort((a, b) => Number(a[0]) - Number(b[0]));
  const section = document.createElement('section');
  section.className = 'depth-panel depth-role-history';
  section.innerHTML = `<h3>Vier geheime Mandate</h3><p>Jede Runde hatte eine neue Rolle. Dadurch bleiben alle vier Beschuldigungen punktrelevant und die Ausscheidungsregel funktioniert ohne logischen Stillstand.</p><div class="depth-role-grid">${roles.map(([round, id]) => `<span><small>Runde ${round}</small><strong>${escapeHtml(label(id))}</strong></span>`).join('')}</div><p><strong>Ermittlungswertung:</strong> ${Number(depth.secret.investigatorScore ?? 0)} · Rivalenwert: ${Number(game.rivalScore ?? 0)}</p>`;
  content.querySelector('.secret-result-list')?.before(section);
}

function injectOlympiadStrategy(core, depth) {
  if (core.questStage !== 'friday-olympiad') return;
  const content = document.querySelector('#weekend-arc-content');
  if (!content || content.querySelector('.depth-olympiad-strategy')) return;
  const discipline = currentDiscipline(core);
  if (!discipline) return;
  const selected = depth.olympiad.strategies[discipline] ?? 'balanced';
  const panel = document.createElement('section');
  panel.className = 'depth-panel depth-olympiad-strategy';
  panel.innerHTML = `<h3>Taktik für ${escapeHtml(({ flipCup: 'Flip Cup', beerPong: 'Beer Pong', flunkyball: 'Flunkyball' })[discipline] ?? discipline)}</h3><p>Die Minispielregeln bleiben unverändert. Deine Taktik verändert jedoch Ermüdung, Gruppenzusammenhalt und den späteren Nachtlärm.</p><div class="depth-choice-row">${[
    ['safe', 'Kontrolliert', 'weniger Lärm und Ermüdung'],
    ['team', 'Teamfokus', 'mehr Zusammenhalt und Vorbereitung'],
    ['risk', 'Volles Risiko', 'mehr Form, aber höhere Folgekosten'],
  ].map(([value, title, hint]) => `<button data-depth-strategy="${value}" data-depth-discipline="${discipline}" class="${selected === value ? 'selected' : ''}"><strong>${title}</strong><small>${hint}</small></button>`).join('')}</div>`;
  const target = content.querySelector('[data-arc-action="start-next-olympiad"]');
  target?.before(panel);
}

function injectSaturdayPreparation(core, depth, director) {
  if (core.questStage !== 'saturday-debate' || depth.saturday.applied) return;
  const content = document.querySelector('#weekend-arc-content');
  if (!content || content.querySelector('.depth-saturday-prep')) return;
  const panel = document.createElement('section');
  panel.className = 'depth-panel depth-saturday-prep';
  panel.innerHTML = `<h3>Eine Vorbereitung vor der Diskussion</h3><p>Du kannst genau einen systemischen Vorteil nutzen. Er verändert echte Debattenwerte und damit den anschließenden Faustkampf.</p><div class="depth-choice-row depth-prep-grid">
    <button data-depth-saturday="evidence"><strong>Beweiskette ordnen</strong><small>−14 Druck mit Danny und Felix, sonst −8</small></button>
    <button data-depth-saturday="rally"><strong>Gruppe einteilen</strong><small>mehr Publikum durch Zusammenhalt ${director.cohesion}/100</small></button>
    <button data-depth-saturday="recover"><strong>Katermanagement</strong><small>+12 Masl-Stimmung und −5 Druck</small></button>
    <button data-depth-saturday="bluff"><strong>Offensiver Bluff</strong><small>stark, aber +6 Nachtlärm als Gegenbeweis</small></button>
  </div>`;
  content.querySelector('.debate-stage')?.before(panel);
}

function injectCodexEntry(core, depth, director) {
  const modal = document.querySelector('#campaign-codex');
  if (!modal || modal.hidden) return;
  const list = modal.querySelector('.codex-entry-list');
  if (!list || list.querySelector('[data-depth-codex-entry]')) return;
  const button = document.createElement('button');
  button.type = 'button';
  button.setAttribute('data-depth-codex-entry', 'systems');
  button.className = 'depth-codex-entry';
  button.innerHTML = '<span>MAJOR UPDATE</span><strong>Spieltiefe & Wechselwirkungen</strong><small>Form, Erschöpfung, Vorbereitung und Deduktion</small>';
  button.addEventListener('click', () => renderDepthCodex(core, depth, director));
  list.prepend(button);
}

function renderDepthCodex(core, depth, director) {
  const detail = document.querySelector('#codex-detail');
  if (!detail) return;
  const strategies = OLYMPIAD_IDS.map((id) => `<tr><td>${escapeHtml(({ flipCup: 'Flip Cup', beerPong: 'Beer Pong', flunkyball: 'Flunkyball' })[id])}</td><td>${escapeHtml(strategyLabel(depth.olympiad.strategies[id]))}</td></tr>`).join('');
  detail.innerHTML = `<article class="codex-page depth-codex-page"><header class="codex-page-head"><span>GAMEPLAY DEPTH UPDATE V2</span><h2>Systemische Wochenenddynamik</h2><p>Das Update verbindet vorhandene Mechaniken stärker miteinander, ohne Minispiele, Spielstände oder Questabfolge zu ersetzen.</p></header>
    <div class="codex-stat-grid"><div><small>Zusammenhalt</small><strong>${director.cohesion}</strong></div><div><small>Erschöpfung</small><strong>${director.fatigue}</strong></div><div><small>Autoritätsdruck</small><strong>${director.authorityHeat}</strong></div><div><small>Vorbereitung</small><strong>${director.preparation}</strong></div></div>
    <section class="codex-section"><h3>Olympiadestrategien</h3><div class="codex-table-wrap"><table><thead><tr><th>Disziplin</th><th>Taktik</th></tr></thead><tbody>${strategies}</tbody></table></div><p>Kontrolliert senkt Folgekosten, Teamfokus stärkt Zusammenhalt und Vorbereitung, volles Risiko erhöht Form und Nachtlärm. Die ursprüngliche Minispielwertung bleibt maßgeblich.</p></section>
    <section class="codex-section"><h3>Samstagsvorbereitung</h3><p>${depth.saturday.applied ? `Gewählt: ${escapeHtml(depth.saturday.preparationChoice)}. Die Werte wurden dauerhaft in den Kampagnenstand übernommen.` : 'Vor der letzten Diskussion steht genau eine Vorbereitung zur Verfügung. Sie verändert Debattendruck, Publikum oder Masls Kampfform.'}</p></section>
    <section class="codex-section"><h3>Secret Millionär</h3><p>Vier geheime Mandate lösen den bisherigen logischen Stillstand: Nach jeder Beschuldigung wird eine neue Rolle unter den verbleibenden Personen verteilt. Hinweise sind merkmalsbasiert, enthalten Gerüchte und nennen die Lösung nicht direkt.</p><p>Schwierigkeit: <strong>${escapeHtml(difficultyLabel(depth.secret.difficulty))}</strong> · Ermittlungswertung: <strong>${Number(depth.secret.investigatorScore ?? 0)}</strong></p></section>
    <section class="codex-section"><h3>Kompatibilität</h3><p>Alle Zusatzdaten liegen in einem getrennten, versionierten Speicher. Kernspielstände werden nur an zwei klaren Übergängen erweitert: der Olympiade-Nachtlärm und die einmalige Samstagsvorbereitung.</p></section></article>`;
}

function mountDirectorButton() {
  const nav = document.querySelector('#campaign-game .topbar nav');
  if (!nav || nav.querySelector('#open-depth-director')) return;
  const button = document.createElement('button');
  button.id = 'open-depth-director';
  button.type = 'button';
  button.innerHTML = '<span>Strategie</span><b>V2</b>';
  button.addEventListener('click', openDirectorModal);
  nav.append(button);
}

function mountDirectorModal() {
  if (document.querySelector('#depth-director-modal')) return;
  const section = document.createElement('section');
  section.id = 'depth-director-modal';
  section.className = 'modal depth-director-modal';
  section.hidden = true;
  section.innerHTML = `<article class="depth-director-window"><button id="depth-director-close" class="modal-x" type="button" aria-label="Schließen">×</button><div id="depth-director-content"></div></article>`;
  document.querySelector('#app')?.append(section);
  section.querySelector('#depth-director-close')?.addEventListener('click', closeDirectorModal);
  section.addEventListener('click', (event) => { if (event.target === section) closeDirectorModal(); });
}

function openDirectorModal() {
  const modal = document.querySelector('#depth-director-modal');
  if (!modal) return;
  modal.hidden = false;
  document.body.classList.add('campaign-modal-open', 'depth-director-open');
  renderDirectorModal();
}
function closeDirectorModal() {
  const modal = document.querySelector('#depth-director-modal');
  if (modal) modal.hidden = true;
  document.body.classList.remove('depth-director-open');
  if (!document.querySelector('.modal:not([hidden])')) document.body.classList.remove('campaign-modal-open');
}
function renderDirectorModal() {
  const core = readCore();
  const depth = loadDepth();
  const director = computeDirectorState(core, readBase(), depth);
  const target = document.querySelector('#depth-director-content');
  if (!target) return;
  target.innerHTML = `<header><span>GAMEPLAY DEPTH UPDATE V2</span><h2>Wochenend-Direktor</h2><p>Diese Werte entstehen aus Beziehungen, Team, Körperzuständen, Olympiadestrategien, Nachtlärm und Beweisen.</p></header><div class="depth-director-grid">${[
    ['Zusammenhalt', director.cohesion, 'stärkt Gruppenaktionen und Publikum'],
    ['Erschöpfung', director.fatigue, 'hohe Werte verschlechtern sichere Optionen'],
    ['Autoritätsdruck', director.authorityHeat, 'Lärm, Verdacht und riskante Entscheidungen'],
    ['Vorbereitung', director.preparation, 'Zeugen, Teamfokus und Reputation'],
    ['Moral', director.morale, 'Fortschritt, Siege und Momentum'],
  ].map(([name, value, hint]) => `<article><div><small>${name}</small><strong>${value}/100</strong></div><i><b style="width:${value}%"></b></i><p>${hint}</p></article>`).join('')}</div><section class="depth-history"><h3>Letzte Wechselwirkungen</h3>${(depth.history ?? []).slice(-6).reverse().map((entry) => `<p>${escapeHtml(entry.text)}</p>`).join('') || '<p>Noch keine Update-Entscheidung protokolliert.</p>'}</section>`;
}

function enhance() {
  const core = readCore();
  if (!core || !Object.keys(core).length) return;
  const depth = loadDepth();
  const director = computeDirectorState(core, readBase(), depth);
  mountDirectorButton();
  mountDirectorModal();
  injectOlympiadStrategy(core, depth);
  injectSaturdayPreparation(core, depth, director);
  if (stageIsSecret(core)) {
    const changed = ensureSecretState(core, depth);
    if (changed && !core.weekendArc?.secretMillionaire?.completed) {
      scheduleEnhance();
      return;
    }
    enhanceSecret(readCore(), loadDepth());
  }
  injectCodexEntry(core, depth, director);
  if (!document.querySelector('#depth-director-modal')?.hidden) renderDirectorModal();
}

let enhanceQueued = false;
function scheduleEnhance() {
  if (enhanceQueued) return;
  enhanceQueued = true;
  requestAnimationFrame(() => { enhanceQueued = false; enhance(); });
}

let reloadQueued = false;
function reloadSafely() {
  if (reloadQueued) return;
  reloadQueued = true;
  window.setTimeout(() => location.reload(), 60);
}

function showToast(text) {
  let toast = document.querySelector('#depth-v2-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'depth-v2-toast';
    document.body.append(toast);
  }
  toast.textContent = text;
  toast.classList.add('show');
  window.setTimeout(() => toast?.classList.remove('show'), 2200);
}

function installEvents() {
  window.addEventListener('lpc-campaign-minigame-outcome', recordOlympiadOutcome);
  document.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target.closest('button') : null;
    if (!target) return;
    const strategy = target.getAttribute('data-depth-strategy');
    if (strategy) {
      const depth = loadDepth();
      const discipline = target.getAttribute('data-depth-discipline');
      if (discipline) depth.olympiad.strategies[discipline] = strategy;
      recordHistory(depth, `${discipline}: Taktik ${strategyLabel(strategy)} gewählt.`);
      saveDepth(depth);
      target.parentElement?.querySelectorAll('button').forEach((button) => button.classList.toggle('selected', button === target));
      scheduleEnhance();
      return;
    }
    const secretDifficulty = target.getAttribute('data-depth-secret-difficulty');
    if (secretDifficulty) {
      const depth = loadDepth();
      depth.secret.difficulty = secretDifficulty;
      depth.secret.rivalAdjusted = false;
      saveDepth(depth);
      target.parentElement?.querySelectorAll('button').forEach((button) => button.classList.toggle('selected', button === target));
      scheduleEnhance();
      return;
    }
    const prep = target.getAttribute('data-depth-saturday');
    if (prep) { applySaturdayChoice(prep); return; }
    const action = target.getAttribute('data-arc-action');
    if (action?.startsWith('afterparty-')) window.setTimeout(applyOlympiadNoiseModifier, 160);
    const question = target.getAttribute('data-secret-question');
    if (question) {
      const core = readCore();
      const round = Math.max(1, Number(core.weekendArc?.secretMillionaire?.round ?? 1));
      const depth = loadDepth();
      const asked = new Set(depth.secret.asked[round] ?? []);
      asked.add(question);
      depth.secret.asked[round] = [...asked];
      saveDepth(depth);
      window.setTimeout(scheduleEnhance, 80);
    }
    const suspectId = target.getAttribute('data-secret-accuse');
    if (suspectId) {
      const core = readCore();
      const game = core.weekendArc?.secretMillionaire;
      if (!game || game.completed) return;
      const depth = loadDepth();
      const pending = { round: Number(game.round), suspectId, role: depth.secret.roleHistory[game.round] ?? game.millionaireId };
      depth.secret.pendingAccusation = pending;
      saveDepth(depth);
      window.setTimeout(() => finalizeSecretAccusation(pending), 140);
    }
  }, true);
}

function injectStyles() {
  if (document.querySelector('#depth-update-v2-style')) return;
  const style = document.createElement('style');
  style.id = 'depth-update-v2-style';
  style.textContent = `
    .depth-panel{margin:16px 0;padding:16px;border:1px solid rgba(237,196,93,.32);border-radius:14px;background:linear-gradient(145deg,rgba(19,48,39,.96),rgba(8,24,19,.96));box-shadow:0 14px 32px rgba(0,0,0,.24)}
    .depth-panel h3{margin:0 0 6px;color:#edc45d;font-size:14px;letter-spacing:.05em;text-transform:uppercase}.depth-panel>p{margin:0 0 12px;color:#c8d9d0;line-height:1.45}
    .depth-choice-row{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.depth-choice-row button{min-height:72px;padding:11px;border:1px solid rgba(255,255,255,.13);border-radius:10px;background:#102b23;color:#fff1ca;text-align:left}.depth-choice-row button:hover,.depth-choice-row button.selected{border-color:#edc45d;background:#1c4134;transform:translateY(-1px)}.depth-choice-row strong,.depth-choice-row small{display:block}.depth-choice-row small{margin-top:5px;color:#adc4b8;font-size:10px;line-height:1.35}
    .depth-prep-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.depth-case-file{position:relative}.depth-suspicion-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px}.depth-suspicion-list span{display:flex;justify-content:space-between;gap:8px;padding:8px 10px;border-radius:8px;background:rgba(255,255,255,.05)}.depth-suspicion-list i{color:#adc4b8;font-size:10px;font-style:normal}.depth-redacted{padding:12px;background:repeating-linear-gradient(135deg,#101916,#101916 8px,#17231f 8px,#17231f 16px);color:#adc4b8;border-radius:8px}
    .depth-v2-active .secret-observations:not(.depth-clues-ready){visibility:hidden}.depth-v2-active .secret-candidate p:not(.depth-response-ready){visibility:hidden}.depth-expert-card header span{filter:blur(4px);opacity:.45;user-select:none}.depth-role-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.depth-role-grid span{padding:10px;border-radius:8px;background:rgba(255,255,255,.06)}.depth-role-grid small,.depth-role-grid strong{display:block}.depth-role-grid small{color:#adc4b8}
    #open-depth-director{display:flex;align-items:center;gap:5px}#open-depth-director b{padding:2px 5px;border-radius:5px;background:#edc45d;color:#10261f;font-size:8px}.depth-director-modal{z-index:1300}.depth-director-window{width:min(780px,calc(100vw - 24px));max-height:88vh;overflow:auto;margin:6vh auto;padding:24px;border:1px solid rgba(237,196,93,.28);border-radius:18px;background:#0b201a;color:#fff1ca;position:relative}.depth-director-window header span{color:#edc45d;font-size:10px;font-weight:900;letter-spacing:.15em}.depth-director-window h2{margin:8px 0}.depth-director-window header p{color:#adc4b8}.depth-director-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.depth-director-grid article{padding:13px;border-radius:12px;background:#122d25}.depth-director-grid article div{display:flex;justify-content:space-between}.depth-director-grid article i{display:block;height:8px;margin:8px 0;border-radius:99px;background:#07130f;overflow:hidden}.depth-director-grid article i b{display:block;height:100%;background:linear-gradient(90deg,#75c68c,#edc45d)}.depth-director-grid article p{margin:0;color:#adc4b8;font-size:11px}.depth-history{margin-top:16px}.depth-history p{margin:5px 0;padding:8px 10px;border-radius:7px;background:rgba(255,255,255,.04);color:#c8d9d0}
    .depth-codex-entry{display:block;width:100%;padding:12px!important;border:1px solid rgba(237,196,93,.38)!important;background:rgba(237,196,93,.08)!important;text-align:left}.depth-codex-entry span,.depth-codex-entry strong,.depth-codex-entry small{display:block}.depth-codex-entry span{color:#edc45d;font-size:8px;font-weight:900;letter-spacing:.12em}.depth-codex-entry small{color:#adc4b8;margin-top:4px}.depth-codex-page .codex-section{margin-top:18px}
    #depth-v2-toast{position:fixed;z-index:2000;left:50%;bottom:24px;transform:translate(-50%,20px);opacity:0;pointer-events:none;padding:10px 14px;border:1px solid rgba(237,196,93,.4);border-radius:9px;background:#081611;color:#fff1ca;transition:.2s}#depth-v2-toast.show{opacity:1;transform:translate(-50%,0)}
    @media(max-width:720px){.depth-choice-row,.depth-prep-grid,.depth-director-grid{grid-template-columns:1fr}.depth-suspicion-list{grid-template-columns:1fr}.depth-role-grid{grid-template-columns:repeat(2,1fr)}.depth-director-window{padding:18px}.depth-panel{padding:13px}.depth-choice-row button{min-height:62px}}
  `;
  document.head.append(style);
}

function install() {
  document.documentElement.classList.add('depth-v2-active');
  injectStyles();
  installEvents();
  const observer = new MutationObserver(scheduleEnhance);
  observer.observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden', 'class'] });
  scheduleEnhance();
  window.setInterval(scheduleEnhance, 1200);
  window.__talesDepthUpdateV2 = { version: UPDATE_VERSION, computeDirectorState, buildSecretClues, chooseNextMillionaire, snapshot: () => ({ core: readCore(), depth: loadDepth(), director: computeDirectorState(readCore(), readBase(), loadDepth()) }) };
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') install();
