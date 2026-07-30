import type { GameSnapshot } from '../../game/types';
import { GameStore } from '../../game/state/GameStore';
import type { MiniGameId, MiniGameOutcome } from './minigames';
import { campaignMeta } from './metaStore';
import {
  addCampaignChronicle,
  adjustCampaignMetrics,
  adjustCampaignNeeds,
  adjustCampaignRelationship,
  consumeCampaignItem,
  setCampaignFlag,
} from './storeBridge';
import {
  FAREWELL_SONG,
  OLYMPIAD_ORDER,
  SECRET_MILLIONAIRE_CANDIDATES,
  VICTORY_SONG,
  brawlSetup,
  calculateNightNoise,
  debateOpeningPressure,
  secretMillionaireId,
  secretRivalScore,
  secretRoundPoints,
  type OlympiadDisciplineId,
} from './weekendArcModel';
import { CAMPAIGN_CHARACTER_BY_ID } from './content';
import './weekendArc.css';

export interface WeekendArcHooks {
  store: GameStore;
  getSnapshot: () => GameSnapshot;
  startMinigame: (id: MiniGameId) => void;
  animate: (id: string | undefined, animation: string) => void;
  renderHud: () => void;
}

interface BrawlState {
  playerHp: number;
  maslHp: number;
  gundulaHp: number;
  uliHp: number;
  enemyPower: number;
  maslPower: number;
  turn: number;
  charge: number;
  guarding: boolean;
  stunned: boolean;
  log: string[];
}

const BASE_SAVE = 'tales-blaue-adria-lpc-main-v1';
const META_SAVE = 'tales-blaue-adria-lpc-campaign-meta-v2';
const CHECKPOINT_BASE = 'tales-blaue-adria-saturday-checkpoint-base';
const CHECKPOINT_META = 'tales-blaue-adria-saturday-checkpoint-meta';

let hooks: WeekendArcHooks | undefined;
let mounted = false;
let latestSnapshot: GameSnapshot | undefined;
let arcAutoOpenQueued = false;
let brawl: BrawlState | undefined;
let secretQuestionBudget = 2;

export function installWeekendArc(nextHooks: WeekendArcHooks): void {
  hooks = nextHooks;
  if (mounted) return;
  mounted = true;
  mountShell();
  nextHooks.store.subscribe((snapshot) => {
    latestSnapshot = snapshot;
    evaluateTriggers(snapshot);
    updateMenuBadge();
  });
  campaignMeta.subscribe(() => {
    updateMenuBadge();
    if (isArcModalOpen()) renderCurrentArc();
  });
  installKeyboard();
  exposeSmokeDebug();
}

export function handleWeekendArcMinigame(outcome: MiniGameOutcome): void {
  if (!hooks) return;
  const meta = campaignMeta.snapshot();
  const snapshot = hooks.getSnapshot();
  if (meta.questStage === 'friday-olympiad' && OLYMPIAD_ORDER.includes(outcome.id as OlympiadDisciplineId)) {
    const id = outcome.id as OlympiadDisciplineId;
    if (meta.weekendArc.olympiad.current === id) {
      campaignMeta.recordOlympiadRound(id, outcome.success, outcome.score, outcome.quality);
      addCampaignChronicle(hooks.store, `${disciplineName(id)} bringt ${campaignMeta.snapshot().weekendArc.olympiad.disciplines[id].points} Olympiapunkte.`, outcome.success ? 'good' : 'warn');
      if (snapshot.minutes >= 22 * 60 || snapshot.day > 1) {
        campaignMeta.updateWeekendArc((arc) => { arc.nightNoise = clamp(arc.nightNoise + 9 + Math.round(snapshot.needs.alcohol * .08), 0, 100); }, 'Die späte Disziplin erhöht den Lärmwert.');
      }
      window.setTimeout(() => openArc(), 280);
    }
  }
}

function mountShell(): void {
  const game = document.getElementById('campaign-game');
  const nav = game?.querySelector('.topbar nav');
  if (!game || !nav) { window.setTimeout(mountShell, 50); return; }
  const button = document.createElement('button');
  button.id = 'open-weekend-arc';
  button.type = 'button';
  button.innerHTML = '<span>Wochenendbogen</span><b></b>';
  button.addEventListener('click', openArc);
  nav.prepend(button);
  document.getElementById('app')?.insertAdjacentHTML('beforeend', `
    <section id="weekend-arc-modal" class="modal weekend-arc-modal" hidden>
      <article class="weekend-arc-window">
        <button id="weekend-arc-close" class="modal-x" type="button" aria-label="Schließen">×</button>
        <div id="weekend-arc-content"></div>
      </article>
    </section>`);
  byId<HTMLButtonElement>('weekend-arc-close').addEventListener('click', closeArc);
  byId('weekend-arc-modal').addEventListener('click', (event) => { if (event.target === byId('weekend-arc-modal')) closeArc(); });
  byId('weekend-arc-content').addEventListener('click', handleArcClick);
}

function evaluateTriggers(snapshot: GameSnapshot): void {
  const meta = campaignMeta.snapshot();
  if (!snapshot.prologue.shoppingComplete || meta.weekendArc.saturday.earlyEnding || meta.finalBattleWon) return;
  if (
    snapshot.day === 1
    && snapshot.minutes >= 18 * 60
    && meta.questStage === 'free-weekend'
    && !meta.weekendArc.olympiad.started
  ) {
    campaignMeta.startFridayOlympiad();
    queueAutoOpen();
    return;
  }
  if (
    snapshot.day >= 2
    && snapshot.minutes >= 8 * 60
    && meta.weekendArc.olympiad.completed
    && !meta.weekendArc.saturday.triggered
  ) {
    createSaturdayCheckpoint();
    campaignMeta.startSaturdayComplaint();
    queueAutoOpen();
    return;
  }
  if (meta.questStage === 'early-eviction' && !isArcModalOpen()) queueAutoOpen();
}

function queueAutoOpen(): void {
  if (arcAutoOpenQueued) return;
  arcAutoOpenQueued = true;
  window.setTimeout(() => {
    arcAutoOpenQueued = false;
    if (!document.querySelector('.modal:not([hidden])')) openArc();
  }, 220);
}

function openArc(): void {
  if (!hooks) return;
  const meta = campaignMeta.snapshot();
  const snapshot = hooks.getSnapshot();
  if (meta.questStage === 'free-weekend' && !meta.weekendArc.olympiad.started) {
    if (snapshot.day === 1 && snapshot.minutes >= 17 * 60) campaignMeta.startFridayOlympiad();
    else {
      showStandalone('WOCHENENDBOGEN', 'Noch keine Sonderquest aktiv', `Die Freitag-Olympiade startet ab 18:00 Uhr. Aktuell: Tag ${snapshot.day}, ${snapshot.clockLabel}. Danach verbindet der Bogen Nachtlärm, Räumungsquest, Faustkampf und Secret Millionär.`, [{ label: 'Schließen', action: closeArc }]);
      return;
    }
  }
  byId<HTMLElement>('weekend-arc-modal').hidden = false;
  document.body.classList.add('campaign-modal-open', 'weekend-arc-open');
  renderCurrentArc();
}

function closeArc(): void {
  byId<HTMLElement>('weekend-arc-modal').hidden = true;
  document.body.classList.remove('weekend-arc-open');
  if (!document.querySelector('.modal:not([hidden])')) document.body.classList.remove('campaign-modal-open');
}

function isArcModalOpen(): boolean { return !byId<HTMLElement>('weekend-arc-modal').hidden; }

function renderCurrentArc(): void {
  const meta = campaignMeta.snapshot();
  if (meta.questStage === 'friday-olympiad') return renderOlympiad(meta);
  if (meta.questStage === 'saturday-complaint') return renderComplaint(meta);
  if (meta.questStage === 'wake-masl') return renderWakeMasl(meta);
  if (meta.questStage === 'saturday-debate') return renderDebate(meta);
  if (meta.questStage === 'saturday-brawl') return renderBrawl(meta);
  if (meta.questStage === 'secret-millionaire') return renderSecretMillionaire(meta);
  if (meta.questStage === 'early-eviction') return renderEvictionEnding(meta);
  if (meta.weekendArc.saturday.brawlWon && meta.weekendArc.secretMillionaire.completed) return renderArcSummary(meta);
  renderArcPreview(meta);
}

function renderArcPreview(meta: ReturnType<typeof campaignMeta.snapshot>): void {
  byId('weekend-arc-content').innerHTML = arcPage('SONDERQUESTS', 'Der Freitag kippt in den Samstag', 'Der Bogen reagiert auf Minispiele, Pegel, Chaos, Beziehungen und die nächtliche Uhrzeit.', `
    ${arcStats([
      ['Olympiade', meta.weekendArc.olympiad.completed ? `${meta.weekendArc.olympiad.points} Punkte` : 'offen'],
      ['Nachtlärm', `${meta.weekendArc.nightNoise}/100`],
      ['Bleiberecht', meta.weekendArc.saturday.brawlWon ? 'erkämpft' : 'offen'],
      ['Secret Millionär', meta.weekendArc.secretMillionaire.completed ? 'beendet' : 'gesperrt'],
    ])}
    <section class="arc-section"><h3>Abfolge</h3>${arcSteps(['Freitag: Trinkspiel-Olympiade', 'Nach 22 Uhr: Pegel und Lärm', 'Samstag 08:00: Gundulas Räumungsversuch', 'Danny/Felix und Andrés Abschiedslied', 'Masl wecken und überzeugen', 'Diskussion und Faustkampf', 'Bei Sieg: Secret Millionär'])}</section>
    <button class="arc-primary" data-arc-action="close">Zurück auf den Platz</button>`);
}

function renderOlympiad(meta: ReturnType<typeof campaignMeta.snapshot>): void {
  const olympiad = meta.weekendArc.olympiad;
  const complete = OLYMPIAD_ORDER.every((id) => olympiad.disciplines[id].attempted);
  const rows = OLYMPIAD_ORDER.map((id, index) => {
    const result = olympiad.disciplines[id];
    return `<article class="olympiad-discipline ${result.attempted ? 'complete' : olympiad.current === id ? 'active' : ''}">
      <span>0${index + 1}</span><div><h3>${escapeHtml(disciplineName(id))}</h3><p>${escapeHtml(disciplineDescription(id))}</p></div>
      <strong>${result.attempted ? `${result.points} P · ${qualityLabel(result.quality)}` : olympiad.current === id ? 'LÄUFT' : 'OFFEN'}</strong>
    </article>`;
  }).join('');
  const action = complete
    ? `<section class="arc-section"><h3>Olympische Nachfeier</h3><p>Die Spiele sind vorbei. Die Entscheidung danach bestimmt den nächtlichen Lärmwert und damit Gundulas Beweislage um 08:00 Uhr.</p><div class="arc-options">
        <button data-arc-action="afterparty-quiet"><strong>Lichter aus und schlafen</strong><small>Lärm sinkt, Pegel baut sich ab, etwas Würde bleibt übrig.</small></button>
        <button data-arc-action="afterparty-one"><strong>Noch eine Runde am Zeltkreis</strong><small>Mehr Alkohol, Chaos und glaubwürdige Beschwerden.</small></button>
        <button class="danger" data-arc-action="afterparty-full"><strong>Olympische Nachfeier bis keiner mehr weiß, wer gewonnen hat</strong><small>Maximaler Nachtlärm, hoher Pegel und deutlich härterer Samstagmorgen.</small></button>
      </div></section>`
    : `<button class="arc-primary" data-arc-action="start-next-olympiad" ${olympiad.current ? 'disabled' : ''}>${olympiad.current ? `${disciplineName(olympiad.current)} läuft` : `Nächste Disziplin: ${disciplineName(nextOlympiadDiscipline(olympiad) ?? 'flipCup')}`}</button>`;
  byId('weekend-arc-content').innerHTML = arcPage('FREITAG · TRINKSPIEL-OLYMPIADE', 'Drei Disziplinen bis die Nachtruhe theoretisch beginnt', 'Die Olympiade motiviert dazu, alle großen Trinkspiele auszuprobieren. Jeder Erfolg erhöht den Wochenendwert – und fast jede Feier die spätere Beschwerdelage.', `
    ${arcStats([['Punkte', String(olympiad.points)], ['Pegelsituation', latestSnapshot?.conditionLabel ?? '–'], ['Uhrzeit', latestSnapshot?.clockLabel ?? '–'], ['Nachtlärm', `${meta.weekendArc.nightNoise}/100`]])}
    <div class="olympiad-list">${rows}</div>${action}`);
}

function renderComplaint(meta: ReturnType<typeof campaignMeta.snapshot>): void {
  const saturday = meta.weekendArc.saturday;
  if (saturday.step === 'complaint') {
    const noise = meta.weekendArc.nightNoise;
    byId('weekend-arc-content').innerHTML = arcPage('SAMSTAG · 08:00 UHR', 'Klemmbrett vor der Plane', `Gundula steht am Zeltkreis. Der gespeicherte Nachtlärm liegt bei ${noise}/100. ${noise >= 70 ? 'Ihre Vorwürfe sind leider erschreckend konkret.' : noise >= 40 ? 'Ein Teil ihrer Beschwerde ist glaubwürdig, der Rest ist Machtausübung.' : 'Die Anschuldigung ist überzogen, aber sie genießt den Auftritt zu sehr.'}`, `
      <div class="arc-scene authority-scene"><div class="scene-person gundula">G</div><blockquote>„Acht Uhr. Ich habe euch die halbe Nacht bis zur Rezeption gehört. Ihr packt jetzt euren Kram und verschwindet. Uli macht die Schranke um zwölf endgültig dicht.“</blockquote></div>
      ${arcStats([['Nachtlärm', `${noise}/100`], ['Ultimatum', '12:00 Uhr'], ['Gundula', meta.flags['authority-goodwill'] ? 'persönlich gekränkt' : 'offen feindselig'], ['Gruppe', 'verkatert und unkoordiniert']])}
      <button class="arc-primary" data-arc-action="complaint-continue">Danny und Felix anhören</button>`);
    return;
  }
  if (saturday.step === 'testimonies') {
    byId('weekend-arc-content').innerHTML = arcPage('BEWEISAUFNAHME AM ZELTKREIS', 'Zwei Zeugen, drei Versionen', 'Danny und Felix erzählen dieselbe Nacht mit vollkommen unterschiedlicher Beziehung zur überprüfbaren Realität.', `
      <div class="testimony-grid">
        <article class="testimony ${saturday.dannyTestimony ? 'complete' : ''}"><header><strong>Danny</strong><span>CHAOSZEUGE</span></header><p>„Laut war es schon. Aber zwischendurch haben wir auch sehr leise gesucht, wer eigentlich so laut ist.“</p><button data-arc-action="hear-danny" ${saturday.dannyTestimony ? 'disabled' : ''}>${saturday.dannyTestimony ? 'Version gesichert' : 'Danny ausreden lassen'}</button></article>
        <article class="testimony ${saturday.felixTimeline ? 'complete' : ''}"><header><strong>Felix</strong><span>ZEITLINIE</span></header><p>„Musik bis 01:26. Um 01:31 hat Uli selbst an der Schranke gebrüllt. Mindestens ein Geräusch kam vom Dauerplatz.“</p><button data-arc-action="hear-felix" ${saturday.felixTimeline ? 'disabled' : ''}>${saturday.felixTimeline ? 'Zeitlinie gesichert' : 'Felix protokollieren lassen'}</button></article>
      </div>
      ${saturday.dannyTestimony && saturday.felixTimeline ? '<button class="arc-primary" data-arc-action="play-farewell-song">Andrés KI-Abschiedslied abspielen</button>' : '<p class="arc-hint">Beide Aussagen werden später als unterschiedliche Diskussionskarten gebraucht.</p>'}`);
    return;
  }
  renderSong('ANDRÉS KI-LIED · ABSCHIEDSVERSION', 'Goodbye Adria', FAREWELL_SONG, 'wake-after-song', 'Masl als letzte Chance wecken');
}

function renderSong(kicker: string, title: string, lyrics: string, nextAction: string, nextLabel: string): void {
  byId('weekend-arc-content').innerHTML = arcPage(kicker, title, 'André hat die Lage bereits vertont, bevor jemand versucht hat, sie zu lösen. Das Lied wird vollständig als festes Storyelement gespeichert.', `
    <div class="song-player"><div class="song-disc"><i></i></div><div><strong>ANDRÉ KI PRODUCTIONS</strong><small>Camping-Schlager · emotional unangemessen · offline verfügbar</small></div></div>
    <pre class="song-lyrics">${escapeHtml(lyrics)}</pre>
    <button class="arc-primary" data-arc-action="${nextAction}">${escapeHtml(nextLabel)}</button>`);
}

function renderWakeMasl(meta: ReturnType<typeof campaignMeta.snapshot>): void {
  const state = meta.weekendArc.saturday;
  if (state.step === 'wake') {
    byId('weekend-arc-content').innerHTML = arcPage('MASL WECKEN', 'Der Körper ist im Zelt, der Rest noch nicht', 'Schlaftiefe muss auf 100 gebracht werden. Harte Methoden sind schneller, beschädigen aber Stimmung und spätere Kampfkraft.', `
      ${arcStats([['Weckfortschritt', `${state.wakeProgress}/100`], ['Masls Stimmung', `${state.wakeMood}/100`], ['Kaffee im Inventar', String(latestSnapshot?.inventory.kaffee ?? 0)], ['Komm ans Loch', meta.flags.maslHoleWon ? 'gemeinsam gewonnen' : 'keine Bindung']])}
      <div class="wake-meter"><i style="width:${state.wakeProgress}%"></i><span class="mood" style="width:${state.wakeMood}%"></span></div>
      <div class="arc-options wake-options">
        <button data-wake="quiet"><strong>Ruhig „Masl“ sagen</strong><small>+12 Wachheit · +4 Stimmung</small></button>
        <button data-wake="tap"><strong>An die Plane tippen</strong><small>+18 Wachheit · neutral</small></button>
        <button data-wake="song"><strong>Abschiedslied vor das Zelt stellen</strong><small>+24 Wachheit · −1 Stimmung</small></button>
        <button data-wake="danny"><strong>Danny ins Zelt schicken</strong><small>+35 Wachheit · −8 Stimmung</small></button>
        <button data-wake="shake"><strong>Zelt kräftig schütteln</strong><small>+30 Wachheit · −12 Stimmung</small></button>
        <button data-wake="coffee" ${(latestSnapshot?.inventory.kaffee ?? 0) <= 0 ? 'disabled' : ''}><strong>Kaffee vor die Öffnung stellen</strong><small>+42 Wachheit · +10 Stimmung · verbraucht Kaffee</small></button>
      </div>`);
    return;
  }
  byId('weekend-arc-content').innerHTML = arcPage('MASL ÜBERZEUGEN', '„Warum steht Gundula morgens schon in meinem Leben?“', 'Masl ist wach. Jetzt muss er freiwillig mit zur Schranke gehen. Die Route verändert Debatte und Faustkampf.', `
    ${arcStats([['Beziehung', signed(hooks?.getSnapshot().relationships.masl ?? 0)], ['Stimmung', `${state.wakeMood}/100`], ['Komm ans Loch', meta.flags.maslHoleWon ? 'Bindung vorhanden' : 'nicht gewonnen'], ['Danny/Felix', `${state.dannyTestimony ? 'D' : '–'} / ${state.felixTimeline ? 'F' : '–'}`]])}
    <div class="arc-options">
      <button data-convince="friendship"><strong>„Wenn du nicht mitkommst, müssen alle abreisen.“</strong><small>Freundschaft · stark bei guter Beziehung oder gemeinsamem Komm ans Loch.</small></button>
      <button data-convince="ego"><strong>„Nur du kannst Gundula so verwirren, dass sie ihrer eigenen Regel widerspricht.“</strong><small>Ego/Spezialwissen · profitiert von guter Weckstimmung.</small></button>
      <button data-convince="challenge"><strong>„Uli behauptet, du traust dich nicht.“</strong><small>Sicherer Start, aber Masl wird aggressiver und weniger kontrolliert.</small></button>
      <button class="danger" data-convince="emergency"><strong>Notfallargument ohne Rücksicht auf Beziehung</strong><small>Garantiert · kostet Masl-Beziehung und Stimmung.</small></button>
    </div>`);
}

function renderDebate(meta: ReturnType<typeof campaignMeta.snapshot>): void {
  const state = meta.weekendArc.saturday;
  if (!state.debatePressure) {
    campaignMeta.updateWeekendArc((arc) => {
      arc.saturday.debatePressure = debateOpeningPressure(arc.nightNoise, meta.flags);
      arc.saturday.debateCrowd = 0;
    });
    return;
  }
  const cards = debateCards(meta).filter((card) => !state.debateUsed.includes(card.id));
  byId('weekend-arc-content').innerHTML = arcPage('LETZTE DISKUSSION', 'Masl gegen Klemmbrett und Schlüsselbund', 'Vier Argumentationsrunden verändern die Bedingungen des unvermeidlichen Faustkampfs. Druck soll sinken, Publikum auf eure Seite wechseln.', `
    ${arcStats([['Rauswurfdruck', `${state.debatePressure}/100`], ['Publikum', signed(state.debateCrowd)], ['Runden', `${state.debateTurns}/4`], ['Nachtlärm', `${meta.weekendArc.nightNoise}/100`]])}
    <div class="debate-stage"><div class="debate-side allies"><b>DU</b><b>MASL</b></div><div class="debate-versus">VS</div><div class="debate-side authority"><b>GUNDULA</b><b>ULI</b></div></div>
    <div class="arc-options debate-cards">${cards.map((card) => `<button data-debate="${card.id}"><strong>${escapeHtml(card.label)}</strong><small>${escapeHtml(card.hint)}</small></button>`).join('')}</div>
    ${state.debateTurns >= 4 || state.debatePressure <= 15 ? '<button class="arc-primary danger" data-arc-action="start-brawl">Ulis „vernünftige Klärung“ annehmen</button>' : ''}
    <div class="arc-log">${state.debateUsed.slice().reverse().map((id) => `<p>${escapeHtml(debateCards(meta).find((card) => card.id === id)?.result ?? id)}</p>`).join('')}</div>`);
}

function renderBrawl(meta: ReturnType<typeof campaignMeta.snapshot>): void {
  if (!brawl) brawl = createBrawlState(meta);
  const activeEnemy = brawl.gundulaHp > 0 ? 'Gundula' : 'Uli';
  const chargeReady = brawl.charge >= 3;
  byId('weekend-arc-content').innerHTML = arcPage('FAUSTRECHT AN DER SCHRANKE', 'Zwei gegen zwei, null Erwachsene', 'Keine realistische Gewalt: Standfestigkeit, Campingmöbel, Schlüsselbund und übertriebene Trefferanimationen. Niederlage beendet den Spielstand vorzeitig.', `
    <div class="brawl-arena">
      ${fighter('Du', brawl.playerHp, 'player')}${fighter('Masl', brawl.maslHp, 'masl')}
      <div class="brawl-impact">${escapeHtml(nextEnemyTelegraph(brawl))}</div>
      ${fighter('Gundula', brawl.gundulaHp, 'gundula')}${fighter('Uli', brawl.uliHp, 'uli')}
    </div>
    ${arcStats([['Aktives Ziel', activeEnemy], ['Runde', String(brawl.turn)], ['Masl-Ladung', `${brawl.charge}/3`], ['Nachtlärm-Macht', `${Math.round((brawl.enemyPower - 1) * 100)} %`]])}
    <div class="timing-strip"><i></i><span>Schlagtiming: Mitte trifft am härtesten</span></div>
    <div class="brawl-actions">
      <button data-brawl="punch"><strong>Schlagen</strong><small>Leertaste · Schaden abhängig vom Timing.</small></button>
      <button data-brawl="block"><strong>Blocken</strong><small>Shift · reduziert den angekündigten Angriff stark.</small></button>
      <button data-brawl="dodge"><strong>Ausweichen</strong><small>Riskant · perfektes Timing verursacht Konter.</small></button>
      <button data-brawl="masl" ${chargeReady ? '' : 'disabled'}><strong>Masl-Tunnel</strong><small>${chargeReady ? 'Unterbricht und trifft beide.' : 'Ladung durch Runden aufbauen.'}</small></button>
    </div>
    <div class="arc-log">${brawl.log.slice(-7).reverse().map((line) => `<p>${escapeHtml(line)}</p>`).join('')}</div>`);
}

function renderEvictionEnding(meta: ReturnType<typeof campaignMeta.snapshot>): void {
  const accusations = meta.weekendArc.secretMillionaire.accusations.length;
  byId('weekend-arc-content').innerHTML = arcPage('VORZEITIGES ENDE', 'Vom Platz geflogen', 'Gundula gibt dreißig Minuten. Uli öffnet die Schranke. André spielt das Lied, während Danny einen Schuh und Masl bereits wieder Schlaf sucht.', `
    ${arcStats([['Nachtlärm', `${meta.weekendArc.nightNoise}/100`], ['Olympiapunkte', String(meta.weekendArc.olympiad.points)], ['Debattendruck', `${meta.weekendArc.saturday.debatePressure}/100`], ['Millionärsrunden', String(accusations)]])}
    <pre class="song-lyrics ending-song">${escapeHtml(FAREWELL_SONG)}</pre>
    <div class="early-ending-actions">
      <button class="arc-primary" data-arc-action="restore-saturday">Samstagmorgen erneut versuchen</button>
      <button class="danger" data-arc-action="reset-weekend">Komplettes Wochenende neu beginnen</button>
    </div>`);
}

function renderSecretMillionaire(meta: ReturnType<typeof campaignMeta.snapshot>): void {
  const game = meta.weekendArc.secretMillionaire;
  if (!game.started) {
    byId('weekend-arc-content').innerHTML = arcPage('SAMSTAG · GEHEIMSPIEL', 'Secret Millionär – Der goldene Kronkorken', 'André ist Spielleiter. Zwölf Figuren können der geheime Millionär sein. Vier geheime Abstimmungen werden zunehmend wertvoll. Beschuldigte fliegen aus dem Gewinnpool – auch Unschuldige. Es gibt nur einen Hauptgewinn.', `
      ${arcStats([['Aktive Figuren', '12'], ['Abstimmungen', '4'], ['Punkte', '1 · 2 · 3 · 4'], ['Trostpreis', 'grundsätzlich keiner']])}
      <section class="arc-section"><h3>Browserfassung</h3>${arcSteps(['Pro Runde erscheinen indirekte Beobachtungen.', 'Du darfst zwei Personen befragen.', 'Danach beschuldigst du genau eine Person.', 'Die Wahrheit bleibt bis zum Finale geheim.', 'Beschuldigte verlieren sofort ihre Gewinnchance.', 'Der geheime Millionär erhält verdeckte Missionen und Vorteile, die nicht öffentlich erklärt werden.'])}</section>
      <button class="arc-primary" data-arc-action="start-secret">Geheime Rollen verteilen</button>`);
    return;
  }
  if (game.completed) return renderSecretResult(meta);
  const round = Math.max(1, game.round);
  const observations = secretObservations(game.millionaireId, round, meta.weekendScore + meta.weekendArc.nightNoise);
  const questionedThisRound = game.questioned.filter((entry) => entry.startsWith(`${round}:`)).length;
  byId('weekend-arc-content').innerHTML = arcPage(`SECRET MILLIONÄR · RUNDE ${round}/4`, 'Wer trägt den goldenen Kronkorken?', 'Die Missionen bleiben unsichtbar. Nur Verhalten, Widersprüche und das Risiko deiner eigenen Beschuldigung sind sichtbar.', `
    ${arcStats([['Rundenwert', `${secretRoundPoints(round)} Punkt(e)`], ['Eigene Punkte', String(game.playerScore)], ['Befragungen', `${questionedThisRound}/2`], ['Aus Gewinnpool', String(game.eliminated.length)]])}
    <div class="secret-observations">${observations.map((line) => `<p>${escapeHtml(line)}</p>`).join('')}</div>
    <div class="secret-roster">${SECRET_MILLIONAIRE_CANDIDATES.map((id) => secretCandidateCard(id, game, round)).join('')}</div>
    <p class="arc-hint">Eine Beschuldigung beendet die Runde. Das Ergebnis wird erst nach Runde 4 offengelegt.</p>`);
}

function renderSecretResult(meta: ReturnType<typeof campaignMeta.snapshot>): void {
  const game = meta.weekendArc.secretMillionaire;
  const name = characterName(game.millionaireId);
  byId('weekend-arc-content').innerHTML = arcPage('SECRET MILLIONÄR · AUFLÖSUNG', `${name} war der geheime Millionär`, game.winner === 'player' ? 'Du gewinnst den einzigen Hauptpreis. Alle anderen erhalten die pädagogische Erfahrung, falsch verdächtigt worden zu sein.' : 'Ein rivalisierender Ermittler gewinnt den Hauptpreis. Es gibt weder Trost- noch Nebenpreis.', `
    ${arcStats([['Deine Punkte', String(game.playerScore)], ['Rivalenpunkte', String(game.rivalScore)], ['Gewinner', game.winner === 'player' ? 'DU' : 'RIVALE'], ['Ausgeschieden', String(game.eliminated.length)]])}
    <div class="secret-result-list">${game.accusations.map((entry) => `<p><strong>Runde ${entry.round}: ${escapeHtml(characterName(entry.suspectId))}</strong><span>${entry.correct ? `RICHTIG · +${entry.points}` : 'FALSCH · aus Gewinnpool'}</span></p>`).join('')}</div>
    <button class="arc-primary" data-arc-action="secret-finish">Zurück ins freie Wochenende</button>`);
}

function renderArcSummary(meta: ReturnType<typeof campaignMeta.snapshot>): void {
  byId('weekend-arc-content').innerHTML = arcPage('WOCHENENDBOGEN ABGESCHLOSSEN', 'Freitag laut, Samstag noch da', 'Olympiade, Räumungsversuch, Faustkampf und Secret Millionär sind dauerhaft im Spielstand verknüpft.', `
    ${arcStats([['Olympiade', `${meta.weekendArc.olympiad.points} Punkte`], ['Nachtlärm', `${meta.weekendArc.nightNoise}/100`], ['Bleiberecht', 'erkämpft'], ['Secret Millionär', meta.weekendArc.secretMillionaire.winner === 'player' ? 'gewonnen' : 'beendet']])}
    <button class="arc-primary" data-arc-action="show-victory-song">Andrés Bleibe-Lied erneut abspielen</button>`);
}

function handleArcClick(event: Event): void {
  const target = (event.target as Element).closest<HTMLElement>('[data-arc-action],[data-wake],[data-convince],[data-debate],[data-brawl],[data-secret-question],[data-secret-accuse]');
  if (!target || !hooks) return;
  if (target.dataset.arcAction) handleArcAction(target.dataset.arcAction);
  if (target.dataset.wake) applyWakeAction(target.dataset.wake);
  if (target.dataset.convince) convinceMasl(target.dataset.convince);
  if (target.dataset.debate) useDebateCard(target.dataset.debate);
  if (target.dataset.brawl) resolveBrawlAction(target.dataset.brawl);
  if (target.dataset.secretQuestion) questionSecretCandidate(target.dataset.secretQuestion);
  if (target.dataset.secretAccuse) accuseSecretCandidate(target.dataset.secretAccuse);
}

function handleArcAction(action: string): void {
  if (!hooks) return;
  if (action === 'close') return closeArc();
  if (action === 'start-next-olympiad') {
    const next = nextOlympiadDiscipline(campaignMeta.snapshot().weekendArc.olympiad);
    if (!next) return renderOlympiad(campaignMeta.snapshot());
    campaignMeta.setOlympiadCurrent(next);
    closeArc();
    hooks.startMinigame(next);
    return;
  }
  if (action.startsWith('afterparty-')) {
    const kind = action === 'afterparty-full' ? 'full-send' : action === 'afterparty-one' ? 'one-more' : 'quiet';
    finishFridayNight(kind);
    return;
  }
  if (action === 'complaint-continue') {
    campaignMeta.updateWeekendArc((arc) => { arc.saturday.step = 'testimonies'; }, 'Danny und Felix rekonstruieren die Nacht. Beide verwenden unterschiedliche Definitionen von Rekonstruktion.');
    return;
  }
  if (action === 'hear-danny') {
    campaignMeta.updateWeekendArc((arc) => { arc.saturday.dannyTestimony = true; }, 'Danny liefert eine chaotische Gegendarstellung. Glaubwürdigkeit unklar, Unterhaltungswert hoch.');
    adjustCampaignMetrics(hooks.store, { chaos: 2, momentum: 2 });
    return;
  }
  if (action === 'hear-felix') {
    campaignMeta.updateWeekendArc((arc) => { arc.saturday.felixTimeline = true; }, 'Felix sichert eine minutengenaue Nachtchronologie inklusive Ulis eigener Lautstärke.');
    adjustCampaignMetrics(hooks.store, { reputation: 2, momentum: 2 });
    return;
  }
  if (action === 'play-farewell-song') {
    campaignMeta.updateWeekendArc((arc) => { arc.saturday.step = 'song'; arc.saturday.farewellSongPlayed = true; }, 'Andrés Abschiedslied ist vollständig abgespielt. Masl wird im Outro ausdrücklich zur Attacke aufgefordert.');
    return;
  }
  if (action === 'wake-after-song') {
    campaignMeta.updateWeekendArc((arc) => { arc.saturday.step = 'wake'; }, 'Der Song endet. Masls Zelt reagiert nicht, was als erste Verhandlungsniederlage gilt.');
    campaignMeta.setStage('wake-masl');
    return;
  }
  if (action === 'start-brawl') {
    campaignMeta.updateWeekendArc((arc) => { arc.saturday.step = 'brawl'; arc.saturday.brawlAttempts += 1; }, 'Uli erklärt die Diskussion für beendet und eine Schlägerei für „vernünftig“.');
    campaignMeta.setStage('saturday-brawl');
    brawl = undefined;
    hooks.animate('uli', 'hit'); hooks.animate('masl', 'stagger');
    return;
  }
  if (action === 'start-secret') return startSecretMillionaire();
  if (action === 'secret-finish') {
    campaignMeta.completeSecretMillionaire(campaignMeta.snapshot().weekendArc.secretMillionaire.winner || 'rival');
    closeArc();
    return;
  }
  if (action === 'show-victory-song') return renderSong('ANDRÉS KI-LIED · BLEIBEVERSION', 'Goodbye Adria – nicht!', VICTORY_SONG, 'close', 'Zurück auf den Platz');
  if (action === 'restore-saturday') return restoreSaturdayCheckpoint();
  if (action === 'reset-weekend') {
    hooks.store.reset(); campaignMeta.reset(); localStorage.removeItem(BASE_SAVE); location.reload();
  }
}

function finishFridayNight(afterparty: 'quiet' | 'one-more' | 'full-send'): void {
  if (!hooks) return;
  const snapshot = hooks.getSnapshot();
  const meta = campaignMeta.snapshot();
  if (afterparty === 'one-more') {
    adjustCampaignNeeds(hooks.store, { alcohol: 14, bladder: 9, energy: -7, courage: 4 });
    adjustCampaignMetrics(hooks.store, { chaos: 7, dignity: -2, momentum: 4 });
  } else if (afterparty === 'full-send') {
    adjustCampaignNeeds(hooks.store, { alcohol: 24, bladder: 16, energy: -13, courage: 7 });
    adjustCampaignMetrics(hooks.store, { chaos: 14, dignity: -5, momentum: 7 });
  } else {
    adjustCampaignMetrics(hooks.store, { dignity: 3, chaos: -3 });
  }
  const prepared = hooks.getSnapshot();
  const noise = calculateNightNoise({
    olympiadPoints: meta.weekendArc.olympiad.points,
    afterparty,
    alcohol: prepared.needs.alcohol,
    chaos: prepared.metrics.chaos,
    lateActivities: afterparty === 'full-send' ? 2 : afterparty === 'one-more' ? 1 : 0,
    quietRest: afterparty === 'quiet',
  });
  campaignMeta.completeOlympiad(afterparty, noise, `Die Freitagnacht endet mit ${noise}/100 Nachtlärm. Gundula beginnt innerlich bereits ein Protokoll.`);
  const current = hooks.getSnapshot();
  const untilSaturdayEight = current.day === 1 ? (24 * 60 - current.minutes) + 8 * 60 : Math.max(0, 8 * 60 - current.minutes);
  hooks.store.advanceMinutes(untilSaturdayEight);
  createSaturdayCheckpoint();
  campaignMeta.startSaturdayComplaint();
  hooks.animate(undefined, afterparty === 'quiet' ? 'sit' : 'stagger');
  renderCurrentArc();
}

function applyWakeAction(action: string): void {
  if (!hooks) return;
  const values: Record<string, [number, number]> = { quiet: [12, 4], tap: [18, 0], song: [24, -1], danny: [35, -8], shake: [30, -12], coffee: [42, 10] };
  const [progress, mood] = values[action] ?? [0, 0];
  if (action === 'coffee' && !consumeCampaignItem(hooks.store, 'kaffee')) return;
  campaignMeta.updateWeekendArc((arc) => {
    arc.saturday.wakeProgress = clamp(arc.saturday.wakeProgress + progress, 0, 100);
    arc.saturday.wakeMood = clamp(arc.saturday.wakeMood + mood, 0, 100);
    if (arc.saturday.wakeProgress >= 100) { arc.saturday.maslAwake = true; arc.saturday.step = 'convince'; }
  }, action === 'danny' ? 'Danny verschwindet im Zelt. Masl wacht hauptsächlich aus Selbstschutz auf.' : action === 'coffee' ? 'Der Kaffeegeruch erreicht Masl vor der Sprache.' : 'Masl reagiert minimal. Das wird als Fortschritt gewertet.');
  hooks.animate('masl', action === 'shake' || action === 'danny' ? 'stagger' : 'sit');
}

function convinceMasl(route: string): void {
  if (!hooks) return;
  const snapshot = hooks.getSnapshot();
  const meta = campaignMeta.snapshot();
  const relation = snapshot.relationships.masl ?? 0;
  const mood = meta.weekendArc.saturday.wakeMood;
  const success = route === 'emergency'
    || route === 'challenge'
    || (route === 'friendship' && (relation >= 10 || meta.flags.maslHoleWon))
    || (route === 'ego' && (mood >= 42 || relation >= 5));
  if (!success) {
    campaignMeta.updateWeekendArc((arc) => { arc.saturday.wakeMood = clamp(arc.saturday.wakeMood - 6, 0, 100); }, 'Masl dreht sich im Sitzen kurz weg. Das Argument war wach, aber nicht überzeugend.');
    adjustCampaignRelationship(hooks.store, 'masl', -1);
    return;
  }
  campaignMeta.updateWeekendArc((arc) => {
    arc.saturday.maslConvinced = true;
    arc.saturday.convinceRoute = route as 'friendship' | 'ego' | 'challenge' | 'emergency';
    arc.saturday.step = 'debate';
    arc.saturday.debatePressure = debateOpeningPressure(arc.nightNoise, meta.flags);
  }, `Masl kommt mit. Route: ${route}. Er hält das bereits für eine vollständige Strategie.`);
  if (route === 'friendship') adjustCampaignRelationship(hooks.store, 'masl', 6);
  if (route === 'ego') adjustCampaignRelationship(hooks.store, 'masl', 4);
  if (route === 'challenge') adjustCampaignMetrics(hooks.store, { chaos: 3, momentum: 4 });
  if (route === 'emergency') { adjustCampaignRelationship(hooks.store, 'masl', -6); adjustCampaignMetrics(hooks.store, { dignity: -2 }); }
  campaignMeta.setStage('saturday-debate');
  hooks.animate('masl', 'cheer');
}

function debateCards(meta: ReturnType<typeof campaignMeta.snapshot>): Array<{ id: string; label: string; hint: string; pressure: number; crowd: number; result: string }> {
  const state = meta.weekendArc.saturday;
  return [
    { id: 'felix', label: 'Felix’ Nachtchronologie', hint: state.felixTimeline ? 'Minutengenaue Gegenbeweise und Ulis eigene Lautstärke.' : 'Nicht vorbereitet; geringere Wirkung.', pressure: state.felixTimeline ? -19 : -7, crowd: 5, result: 'Felix nennt 01:26, 01:31 und drei widersprüchliche Aussagen. Gundula hasst Uhrzeiten, die nicht ihr gehören.' },
    { id: 'danny', label: 'Dannys chaotische Gegendarstellung', hint: state.dannyTestimony ? 'Unzuverlässig, aber publikumswirksam.' : 'Nicht vorbereitet; fast nur Lärm.', pressure: state.dannyTestimony ? -9 : -3, crowd: 13, result: 'Danny beweist nichts, erzählt es aber so überzeugt, dass mehrere Camper lachen und Uli die Kontrolle verliert.' },
    { id: 'song', label: 'Andrés KI-Abschiedshymne', hint: 'Fremdscham, Pathos und öffentliche Eskalation.', pressure: meta.weekendArc.nightNoise >= 72 ? -7 : -13, crowd: 11, result: 'Der Refrain „Zur nächsten Adria“ zieht Publikum an. Gundula merkt, dass eine Räumung zur schlechten Werbung wird.' },
    { id: 'ego', label: 'Gundulas Unverzichtbarkeit bestätigen', hint: meta.flags['authority-ego-hook'] ? 'Vorbereitete Schwachstelle.' : 'Improvisierte Schmeichelei.', pressure: meta.flags['authority-ego-hook'] ? -17 : -9, crowd: -2, result: 'Gundula hört, dass ohne sie alles zusammenbricht, und vergisst für einen Moment, dass sie genau das gerade herbeiführen wollte.' },
    { id: 'wegbeer', label: 'Uli mit Wegbierlogik festnageln', hint: meta.flags['authority-drinking-bond'] ? 'Bestehender Kumpelvertrag.' : 'Ohne Vorgeschichte riskanter.', pressure: meta.flags['authority-drinking-bond'] ? -15 : -6, crowd: 2, result: 'Uli erinnert sich an das Wegbier und formuliert die Räumung plötzlich als „eigentlich nur deutliche Ansage“.' },
    { id: 'masl', label: 'Masls Lochlogik', hint: meta.flags.maslHoleWon ? 'Gemeinsame Erfahrung macht den Vergleich fast nachvollziehbar.' : 'Niemand versteht ihn, aber niemand will es zugeben.', pressure: meta.flags.maslHoleWon ? -21 : -13, crowd: 8, result: 'Masl erklärt Lärm wie ein schlecht abgedichtetes Loch. Gundula widerspricht, korrigiert sich und widerspricht damit ihrem ersten Widerspruch.' },
  ];
}

function useDebateCard(id: string): void {
  if (!hooks) return;
  const meta = campaignMeta.snapshot();
  const card = debateCards(meta).find((entry) => entry.id === id);
  if (!card || meta.weekendArc.saturday.debateUsed.includes(id)) return;
  campaignMeta.updateWeekendArc((arc) => {
    arc.saturday.debatePressure = clamp(arc.saturday.debatePressure + card.pressure, 0, 100);
    arc.saturday.debateCrowd = clamp(arc.saturday.debateCrowd + card.crowd, -30, 60);
    arc.saturday.debateTurns += 1;
    arc.saturday.debateUsed.push(id);
  }, card.result);
  adjustCampaignMetrics(hooks.store, { momentum: card.pressure <= -15 ? 3 : 1, reputation: card.crowd > 5 ? 2 : 0, chaos: id === 'danny' || id === 'song' ? 2 : 0 });
  hooks.animate(id === 'masl' ? 'masl' : id === 'felix' ? 'felix' : undefined, id === 'song' ? 'cheer' : 'talk');
}

function createBrawlState(meta: ReturnType<typeof campaignMeta.snapshot>): BrawlState {
  const setup = brawlSetup({
    pressure: meta.weekendArc.saturday.debatePressure,
    crowd: meta.weekendArc.saturday.debateCrowd,
    wakeMood: meta.weekendArc.saturday.wakeMood,
    relationshipMasl: hooks?.getSnapshot().relationships.masl ?? 0,
    nightNoise: meta.weekendArc.nightNoise,
  });
  return { ...setup, turn: 1, charge: meta.weekendArc.saturday.convinceRoute === 'challenge' ? 1 : 0, guarding: false, stunned: false, log: ['Uli: „Jetzt klären wir das einmal vernünftig.“ Masl: „Das Wort bedeutet bei dir etwas anderes.“'] };
}

function resolveBrawlAction(action: string): void {
  if (!hooks || !brawl) return;
  const timing = timingQuality();
  const enemy = brawl.gundulaHp > 0 ? 'gundula' : 'uli';
  brawl.guarding = false;
  if (action === 'punch') {
    const damage = Math.round((timing > .8 ? 26 : timing > .5 ? 19 : 12) * (1 + Math.min(.3, (hooks.getSnapshot().needs.courage ?? 0) / 300)));
    damageEnemy(enemy, damage);
    brawl.log.push(timing > .8 ? `PERFEKTER NACKENKLATSCHER: ${damage} Standfestigkeit.` : `Schlag trifft ${enemy === 'gundula' ? 'das Klemmbrett' : 'Ulis Bierbauch'}: ${damage}.`);
    hooks.animate(undefined, 'hit');
  } else if (action === 'block') {
    brawl.guarding = true;
    brawl.log.push('Campingstuhl-Deckung aufgebaut. Der nächste Treffer verliert den Großteil seiner Wirkung.');
    hooks.animate(undefined, 'sit');
  } else if (action === 'dodge') {
    if (timing > .55) {
      damageEnemy(enemy, timing > .82 ? 10 : 5);
      brawl.stunned = timing > .82;
      brawl.log.push(timing > .82 ? 'Perfekt ausgewichen: Gegner trifft die Schranke und verliert seinen Zug.' : 'Ausgewichen und kleiner Konter gesetzt.');
    } else brawl.log.push('Ausweichversuch beginnt zu früh und endet dort, wo der Angriff ohnehin hinwollte.');
  } else if (action === 'masl' && brawl.charge >= 3) {
    brawl.charge = 0;
    const damage = Math.round(19 * brawl.maslPower);
    brawl.gundulaHp = clamp(brawl.gundulaHp - damage, 0, 100);
    brawl.uliHp = clamp(brawl.uliHp - damage, 0, 108);
    brawl.stunned = true;
    brawl.log.push(`MASL-TUNNEL: Beide verlieren ${damage}. Niemand versteht die Bewegung ausreichend für einen Gegenzug.`);
    hooks.animate('masl', 'hit');
  }
  maslAutoAction();
  if (brawl.gundulaHp <= 0 && brawl.uliHp <= 0) return winBrawl();
  if (!brawl.stunned) enemyBrawlAttack(); else { brawl.log.push('Der gegnerische Zug fällt wegen vollständiger Verwirrung aus.'); brawl.stunned = false; }
  brawl.charge = clamp(brawl.charge + 1, 0, 3);
  brawl.turn += 1;
  if (brawl.playerHp <= 0 && brawl.maslHp <= 0) return loseBrawl();
  renderBrawl(campaignMeta.snapshot());
}

function maslAutoAction(): void {
  if (!brawl || brawl.maslHp <= 0) return;
  const enemy = brawl.gundulaHp > 0 ? 'gundula' : 'uli';
  const damage = Math.round((5 + (brawl.turn % 3) * 2) * brawl.maslPower);
  damageEnemy(enemy, damage);
  brawl.log.push(`Masls schlaftrunkener Haken verursacht ${damage}. Er wirkt selbst überrascht.`);
}

function enemyBrawlAttack(): void {
  if (!brawl) return;
  const attacker = brawl.turn % 2 === 0 && brawl.uliHp > 0 ? 'Uli' : brawl.gundulaHp > 0 ? 'Gundula' : 'Uli';
  const targetMasl = brawl.turn % 3 === 0 && brawl.maslHp > 0;
  const base = attacker === 'Uli' ? 15 : 12;
  let damage = Math.round((base + (brawl.turn % 4) * 2) * brawl.enemyPower);
  if (brawl.guarding) damage = Math.max(2, Math.round(damage * .32));
  if (targetMasl) brawl.maslHp = clamp(brawl.maslHp - damage, 0, 100);
  else brawl.playerHp = clamp(brawl.playerHp - damage, 0, 100);
  const attack = attacker === 'Uli'
    ? ['Schlüsselbund-Schwinger', 'Bierbauch-Ramme', 'Kumpel-Nackenklatscher', 'SPORTSFREUND!'][brawl.turn % 4]
    : ['Klemmbrett-Schelle', 'Brillenrand-Finte', 'Handtaschen-Haken', 'RUNTER VOM PLATZ!'][brawl.turn % 4];
  brawl.log.push(`${attacker}: ${attack} trifft ${targetMasl ? 'Masl' : 'dich'} für ${damage}.`);
  hooks?.animate(attacker.toLocaleLowerCase('de'), 'hit');
}

function winBrawl(): void {
  if (!hooks || !brawl) return;
  campaignMeta.winSaturdayBrawl();
  campaignMeta.addRelationship('masl', 18, 'Masl hat das Bleiberecht mitdiskutiert und mitgeprügelt.');
  campaignMeta.addRelationship('gundula', 5); campaignMeta.addRelationship('uli', 7);
  adjustCampaignMetrics(hooks.store, { dignity: 7, chaos: 9, reputation: 14, momentum: 12 }, 'Faustrecht mit Frühstück: Das Bleiberecht ist erkämpft.');
  setCampaignFlag(hooks.store, 'saturdayStayWon');
  hooks.animate(undefined, 'cheer'); hooks.animate('masl', 'cheer'); hooks.animate('gundula', 'collapse'); hooks.animate('uli', 'collapse');
  campaignMeta.updateWeekendArc((arc) => { arc.saturday.victorySongPlayed = true; }, 'Andrés zweites KI-Lied beginnt: Goodbye Adria – nicht!');
  renderSong('ANDRÉS KI-LIED · BLEIBEVERSION', 'Goodbye Adria – nicht!', VICTORY_SONG, 'start-secret', 'Secret Millionär am Samstag starten');
}

function loseBrawl(): void {
  if (!hooks) return;
  campaignMeta.loseSaturdayBrawl();
  adjustCampaignMetrics(hooks.store, { dignity: -12, chaos: 4, reputation: -6, momentum: -20 }, 'Die Gruppe verliert den Faustkampf und muss abreisen.');
  setCampaignFlag(hooks.store, 'earlyEvictionEnding');
  renderEvictionEnding(campaignMeta.snapshot());
}

function damageEnemy(enemy: 'gundula' | 'uli', amount: number): void {
  if (!brawl) return;
  if (enemy === 'gundula') brawl.gundulaHp = clamp(brawl.gundulaHp - amount, 0, 100);
  else brawl.uliHp = clamp(brawl.uliHp - amount, 0, 108);
}

function startSecretMillionaire(): void {
  const meta = campaignMeta.snapshot();
  const snapshot = hooks?.getSnapshot();
  const seed = meta.weekendScore + meta.weekendArc.nightNoise * 7 + (snapshot?.relationships.masl ?? 0) * 3 + meta.suspicion * 11;
  campaignMeta.updateWeekendArc((arc) => {
    arc.secretMillionaire.unlocked = true;
    arc.secretMillionaire.started = true;
    arc.secretMillionaire.round = 1;
    arc.secretMillionaire.millionaireId = secretMillionaireId(seed);
    arc.secretMillionaire.rivalScore = secretRivalScore(seed);
    arc.secretMillionaire.questioned = [];
  }, 'André verteilt geheime Rollen. Der goldene Kronkorken verschwindet in einer Tasche.');
  secretQuestionBudget = 2;
  renderSecretMillionaire(campaignMeta.snapshot());
}

function questionSecretCandidate(id: string): void {
  const meta = campaignMeta.snapshot();
  const game = meta.weekendArc.secretMillionaire;
  const key = `${game.round}:${id}`;
  const questioned = game.questioned.filter((entry) => entry.startsWith(`${game.round}:`)).length;
  if (questioned >= 2 || game.questioned.includes(key)) return;
  campaignMeta.updateWeekendArc((arc) => { arc.secretMillionaire.questioned.push(key); }, `${characterName(id)} wurde in Runde ${game.round} befragt: ${secretStatement(id, game.millionaireId, game.round)}.`);
  secretQuestionBudget = Math.max(0, secretQuestionBudget - 1);
}

function accuseSecretCandidate(id: string): void {
  const meta = campaignMeta.snapshot();
  const game = meta.weekendArc.secretMillionaire;
  if (game.eliminated.includes(id) || game.completed || game.round < 1) return;
  const correct = id === game.millionaireId;
  const points = correct ? secretRoundPoints(game.round) : 0;
  const finishing = game.round >= 4;
  campaignMeta.updateWeekendArc((arc) => {
    arc.secretMillionaire.accusations.push({ round: arc.secretMillionaire.round, suspectId: id, correct, points });
    arc.secretMillionaire.eliminated.push(id);
    arc.secretMillionaire.playerScore += points;
    if (!finishing) arc.secretMillionaire.round = (arc.secretMillionaire.round + 1) as 1 | 2 | 3 | 4;
  }, `${characterName(id)} ist aus dem Gewinnpool. Ob die Beschuldigung richtig war, bleibt bis zum Ende geheim.`);
  if (finishing) finishSecretMillionaire(); else { secretQuestionBudget = 2; renderSecretMillionaire(campaignMeta.snapshot()); }
}

function finishSecretMillionaire(): void {
  if (!hooks) return;
  const meta = campaignMeta.snapshot();
  const winner = meta.weekendArc.secretMillionaire.playerScore > meta.weekendArc.secretMillionaire.rivalScore ? 'player' : 'rival';
  campaignMeta.updateWeekendArc((arc) => { arc.secretMillionaire.completed = true; arc.secretMillionaire.winner = winner; }, winner === 'player' ? 'Der einzige Hauptgewinn geht an dich.' : 'Der Hauptgewinn geht an einen rivalisierenden Ermittler. Trostpreise existieren nicht.');
  if (winner === 'player') adjustCampaignMetrics(hooks.store, { dignity: 6, reputation: 10, momentum: 8 });
  else adjustCampaignMetrics(hooks.store, { dignity: -2, reputation: 3, momentum: 2 });
  renderSecretResult(campaignMeta.snapshot());
}

function secretCandidateCard(id: string, game: ReturnType<typeof campaignMeta.snapshot>['weekendArc']['secretMillionaire'], round: number): string {
  const eliminated = game.eliminated.includes(id);
  const questioned = game.questioned.includes(`${round}:${id}`);
  const questionedCount = game.questioned.filter((entry) => entry.startsWith(`${round}:`)).length;
  return `<article class="secret-candidate ${eliminated ? 'eliminated' : ''}">
    <header><span>${escapeHtml(CAMPAIGN_CHARACTER_BY_ID[id]?.role ?? 'VERDÄCHTIG')}</span><strong>${escapeHtml(characterName(id))}</strong></header>
    <p>${questioned ? escapeHtml(secretStatement(id, game.millionaireId, round)) : 'Noch keine Aussage in dieser Runde.'}</p>
    <div><button data-secret-question="${id}" ${questioned || questionedCount >= 2 ? 'disabled' : ''}>Befragen</button><button class="danger" data-secret-accuse="${id}" ${eliminated ? 'disabled' : ''}>Beschuldigen</button></div>
    ${eliminated ? '<small>AUS DEM GEWINNPOOL</small>' : ''}
  </article>`;
}

function secretObservations(millionaireId: string, round: number, seed: number): string[] {
  const pool = [...SECRET_MILLIONAIRE_CANDIDATES];
  const decoyA = pool[(seed + round * 3) % pool.length];
  const decoyB = pool[(seed + round * 5 + 2) % pool.length];
  const trueName = characterName(millionaireId);
  return [
    `Beobachtung ${round}.1: ${trueName} verschwindet auffällig kurz aus dem Zeltkreis und kommt mit einer vollkommen unnötigen Erklärung zurück.`,
    `Beobachtung ${round}.2: ${characterName(decoyA)} wurde mit einem goldfarbenen Kronkorken gesehen. Herkunft unklar.`,
    `Beobachtung ${round}.3: ${characterName(decoyB)} lenkt die Diskussion auf eine Person, die bereits aus dem Gewinnpool ausgeschieden ist.`,
  ];
}

function secretStatement(id: string, millionaireId: string, round: number): string {
  const suspicious = id === millionaireId;
  const normal: Record<string, string> = {
    rene: '„Ich habe eine Tabelle gemacht. Das ist keine Mission, das ist Selbstschutz.“',
    lars: '„Wenn ich Millionär wäre, gäbe es hier kaltes Bier. Siehst du kaltes Bier?“',
    danny: '„Ich war die ganze Runde sichtbar. Außer in den Momenten, in denen ich weg war.“',
    gregor: '„Die Flugbahn dieses Kronkorkens beweist gar nichts. Fast gar nichts.“',
    masl: '„Ich kenne meine Rolle. Ich habe sie nur noch nicht vollständig gelesen.“',
    schubert: '„Eine geheime Mission würde ich professioneller durchführen.“',
    felix: '„Meine Zeitlinie ist konsistent. Das ist offenbar schon verdächtig.“',
    schima: '„Ich habe nur Getränke verteilt. Einige davon waren strategisch.“',
    ronny: '„Der Begriff Millionär ist in diesem Kontext ohnehin semantisch unsauber.“',
    manni: '„Ich war im Sanitärgebäude. Dort gibt es keine goldenen Kronkorken.“',
    susi: '„Ich beantworte die Frage, sobald du eine bessere stellst.“',
    jule: '„Beschuldige mich ruhig. Aber dann bin ich aus dem Pool und du erklärst es allen.“',
  };
  if (!suspicious) return normal[id] ?? '„Ich habe nichts gesehen und erstaunlich viel dazu zu sagen.“';
  return round <= 2
    ? `${normal[id] ?? ''} Danach folgt eine zu ausführliche Erklärung für eine Handlung, nach der niemand gefragt hat.`
    : `${normal[id] ?? ''} Bei der Nachfrage zur geheimen Mission fällt eine merkliche Pause, danach wird das Thema gewechselt.`;
}

function nextOlympiadDiscipline(olympiad: ReturnType<typeof campaignMeta.snapshot>['weekendArc']['olympiad']): OlympiadDisciplineId | undefined {
  return OLYMPIAD_ORDER.find((id) => !olympiad.disciplines[id].attempted);
}
function disciplineName(id: OlympiadDisciplineId): string { return ({ flipCup: 'Flip Cup Staffel', beerPong: 'Beer Pong Präzision', flunkyball: 'Flunkyball Ausdauer' } as const)[id]; }
function disciplineDescription(id: OlympiadDisciplineId): string { return ({ flipCup: 'Trinken, platzieren, flippen – vier Figuren in Folge.', beerPong: 'Direkt- und Bounce-Würfe mit Re-Rack und Redemption.', flunkyball: 'Mittelflasche, Trinkfenster, Sprint und Stoppruf.' } as const)[id]; }
function qualityLabel(quality: string): string { return ({ perfect: 'LEGENDÄR', solid: 'SOLIDE', messy: 'CHAOTISCH', failed: 'GESCH. ' } as Record<string, string>)[quality] ?? quality; }
function characterName(id: string): string { return CAMPAIGN_CHARACTER_BY_ID[id]?.name ?? id.charAt(0).toLocaleUpperCase('de') + id.slice(1); }
function fighter(name: string, hp: number, cls: string): string { return `<article class="brawl-fighter ${cls} ${hp <= 0 ? 'down' : ''}"><div><span>${escapeHtml(name)}</span><strong>${Math.round(hp)}</strong></div><i><b style="width:${clamp(hp, 0, 100)}%"></b></i><figure>${name.charAt(0)}</figure></article>`; }
function nextEnemyTelegraph(state: BrawlState): string { const attacker = state.turn % 2 === 0 && state.uliHp > 0 ? 'Uli' : state.gundulaHp > 0 ? 'Gundula' : 'Uli'; return attacker === 'Uli' ? 'Uli holt mit Schlüsselbund oder Bierbauch aus.' : 'Gundula hebt Klemmbrett und Brillenrand.'; }
function timingQuality(): number { const phase = (performance.now() % 1400) / 700; return 1 - Math.abs(phase - 1); }
function signed(value: number): string { const rounded = Math.round(value); return `${rounded >= 0 ? '+' : ''}${rounded}`; }
function clamp(value: number, min: number, max: number): number { return Math.max(min, Math.min(max, value)); }

function createSaturdayCheckpoint(): void {
  if (localStorage.getItem(CHECKPOINT_BASE) && localStorage.getItem(CHECKPOINT_META)) return;
  const base = localStorage.getItem(BASE_SAVE); const meta = localStorage.getItem(META_SAVE);
  if (base) localStorage.setItem(CHECKPOINT_BASE, base);
  if (meta) localStorage.setItem(CHECKPOINT_META, meta);
}
function restoreSaturdayCheckpoint(): void {
  const base = localStorage.getItem(CHECKPOINT_BASE); const meta = localStorage.getItem(CHECKPOINT_META);
  if (base) localStorage.setItem(BASE_SAVE, base);
  if (meta) localStorage.setItem(META_SAVE, meta);
  location.reload();
}

function updateMenuBadge(): void {
  const button = document.getElementById('open-weekend-arc'); if (!button) return;
  const meta = campaignMeta.snapshot();
  const badge = button.querySelector('b');
  if (badge) badge.textContent = meta.questStage === 'friday-olympiad' ? 'FR' : meta.questStage.startsWith('saturday') || meta.questStage === 'wake-masl' ? 'SA' : meta.questStage === 'secret-millionaire' ? 'SM' : meta.questStage === 'early-eviction' ? 'ENDE' : '';
  button.classList.toggle('urgent', ['friday-olympiad', 'saturday-complaint', 'wake-masl', 'saturday-debate', 'saturday-brawl', 'secret-millionaire', 'early-eviction'].includes(meta.questStage));
}

function installKeyboard(): void {
  window.addEventListener('keydown', (event) => {
    if (!isArcModalOpen() || campaignMeta.snapshot().questStage !== 'saturday-brawl') return;
    if (event.key === ' ' || event.key === 'Enter') { event.preventDefault(); resolveBrawlAction('punch'); }
    if (event.key === 'Shift') { event.preventDefault(); resolveBrawlAction('block'); }
    if (event.key.toLocaleLowerCase('de') === 'e') { event.preventDefault(); resolveBrawlAction('masl'); }
  });
}

function exposeSmokeDebug(): void {
  if (new URLSearchParams(location.search).get('smoke') !== '1') return;
  (window as unknown as Record<string, unknown>).__lpcWeekendArcDebug = {
    open(): void { openArc(); },
    showSong(): void { byId<HTMLElement>('weekend-arc-modal').hidden = false; document.body.classList.add('campaign-modal-open'); renderSong('TEST', 'Goodbye Adria', FAREWELL_SONG, 'close', 'Schließen'); },
    showBrawl(): void { campaignMeta.setStage('saturday-brawl'); brawl = createBrawlState(campaignMeta.snapshot()); openArc(); },
    showSecret(): void { campaignMeta.updateWeekendArc((arc) => { arc.secretMillionaire.unlocked = true; arc.secretMillionaire.started = true; arc.secretMillionaire.round = 1; arc.secretMillionaire.millionaireId = 'masl'; }); campaignMeta.setStage('secret-millionaire'); openArc(); },
    close(): void { closeArc(); },
    snapshot(): unknown { return campaignMeta.snapshot().weekendArc; },
  };
}

function showStandalone(kicker: string, title: string, copy: string, actions: Array<{ label: string; action: () => void }>): void {
  byId<HTMLElement>('weekend-arc-modal').hidden = false;
  document.body.classList.add('campaign-modal-open', 'weekend-arc-open');
  byId('weekend-arc-content').innerHTML = arcPage(kicker, title, copy, `<div class="arc-options">${actions.map((entry, index) => `<button data-standalone="${index}"><strong>${escapeHtml(entry.label)}</strong></button>`).join('')}</div>`);
  byId('weekend-arc-content').querySelectorAll<HTMLButtonElement>('[data-standalone]').forEach((button) => button.addEventListener('click', () => actions[Number(button.dataset.standalone)]?.action()));
}

function arcPage(kicker: string, title: string, intro: string, content: string): string { return `<header class="arc-head"><span>${escapeHtml(kicker)}</span><h2>${escapeHtml(title)}</h2><p>${escapeHtml(intro)}</p></header><main class="arc-main">${content}</main>`; }
function arcStats(items: Array<[string, string]>): string { return `<div class="arc-stats">${items.map(([label, value]) => `<div><small>${escapeHtml(label)}</small><strong>${escapeHtml(value)}</strong></div>`).join('')}</div>`; }
function arcSteps(items: string[]): string { return `<ol class="arc-steps">${items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ol>`; }
function byId<T extends HTMLElement = HTMLElement>(id: string): T { const node = document.getElementById(id); if (!node) throw new Error(`Missing weekend arc element: ${id}`); return node as T; }
function escapeHtml(value: string): string { return String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character] ?? character); }
