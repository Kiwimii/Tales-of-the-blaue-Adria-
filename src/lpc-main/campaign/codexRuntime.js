import { COMBAT_MOVES, MAX_EQUIPPED_ATTACKS } from '../../game/combatMoves';
import { ITEMS, QUESTS } from '../../game/content';
import { FRIEND_PROFILES, FRIEND_TEAM_MEMBERS, activeTeamSynergies } from '../../game/friendRoster';
import { ROMANCE_PROFILES, flirtChance } from '../../game/socialSystem';
import { GameStore, STORAGE_KEY } from '../../game/state/GameStore';
import { activeStatuses, statusModifiers } from '../../game/statusSystem';
import { ALL_INTERACTIONS, CAMPAIGN_CHARACTER_BY_ID } from './content';
import { CAMPAIGN_OPPONENTS } from './battleEngine';
import { CHARACTER_VOICES } from './characterVoices';
import { authorityManipulationScore, installAuthorityOverhaul } from './authorityOverhaul';
import { campaignMeta } from './metaStore';
import { ANECDOTES, COMPANION_ACTIONS, WEEKEND_RANKS, branchLabel } from './progression';
import './codex.css';

installAuthorityOverhaul();

const CATEGORIES = [
  ['overview', '◎', 'Grundsystem', 'Spielablauf, Steuerung, Speicherung und Charaktererstellung.'],
  ['characters', '♟', 'Charaktere', 'Persönlichkeiten, Dialoglogik, Beziehungen, Rollen und aktuelle Zustände.'],
  ['attacks', '✦', 'Attacken', 'Alle Frustattacken mit exakten Werten, Freischaltungen und Gegnerwirkung.'],
  ['combat', '⚔', 'Kampfsystem', 'Rundenablauf, Frust, Kombos, Gegnerphasen und Statuswirkungen.'],
  ['minigames', '◆', 'Minispiele', 'Steuerung, Physik, Wertungsformeln, Qualitätsstufen und Hilfen.'],
  ['status', '◒', 'Zustände & Werte', 'Bedürfnisse, Pegel, Kater, Würde, Chaos, Ruf und Momentum.'],
  ['items', '▣', 'Inventar', 'Preise, Wirkungen, Grenzen und Questfunktionen aller Gegenstände.'],
  ['quests', '◇', 'Quests', 'Kampagnenstufen, Ziele, Voraussetzungen und Finale.'],
  ['progression', '▲', 'Fortschritt', 'Wochenendränge, Meisterschaften, Anekdoten, Teams und Freischaltungen.'],
  ['world', '⌖', 'Welt & Orte', 'Regionen, Interaktionsorte, Karte und Bewegungsregeln.'],
];

const TAGS = {
  rapport: 'Kumpelkontakt', style: 'Stil/Fremdscham', submission: 'Zustimmung/Leerlauf', logic: 'Logik',
  wit: 'Trockener Witz', guard: 'Verteidigung', drink: 'Getränkeritual', team: 'Gruppe',
  charm: 'Charme/Spiel', chaos: 'Chaos/Übertreibung',
};
const APPROACH = { listen: 'Zuhören', joke: 'Humor', challenge: 'Herausfordern', help: 'Helfen/Planen' };
const BATTLE_STATUS = {
  ueberrumpelt: ['Überrumpelt', 'Gegner gilt als geöffnet; +6 Genauigkeit für die nächste Attacke.'],
  fremdschaemen: ['Fremdschämen', 'Stil-Attacken verursachen zusätzlich 8 Frust.'],
  leerlauf: ['Leerlauf', 'Kein Konter; Witz und Zustimmung verursachen zusätzlich 7 Frust.'],
  unterbrochen: ['Unterbrochen', 'Gegenzug entfällt; beim Spieler zusätzlich −9 Genauigkeit.'],
  abgesichert: ['Abgesichert', 'Eingehender Konter wird mit 0,62 multipliziert.'],
  verwirrt: ['Verwirrt', 'Gegner gilt als geöffnet; +6 Genauigkeit.'],
  fokussiert: ['Fokussiert', 'Eigene Genauigkeit +8.'],
  fixiert: ['Fixiert', 'Gegner gilt als geöffnet; +6 Genauigkeit.'],
};

const NEEDS = [
  ['energy', 'Energie', '100 gut, 0 erschöpft', ['Unter 30: PLATT.', 'Niedrige Energie reduziert Bewegung, Verteidigung, Genauigkeit und Charme.', '60 Minuten Ruhe: +43 Energie, +4 Mut.']],
  ['hunger', 'Hunger', '0 satt, 100 kritisch', ['Wurst: −36 Hunger.', 'Chips: −18 Hunger, +8 Durst.', 'Steigt mit der Zeit und erzwingt Versorgung.']],
  ['thirst', 'Durst', '0 versorgt, 100 dehydriert', ['Ab 72: DURST.', 'Genauigkeit −5 bis −13; Energieverbrauch steigt.', 'Wasser: −30 Durst, +12 Blase.']],
  ['bladder', 'Blase', '0 leer, 100 Notfall', ['Getränke erhöhen den Wert.', 'Toilette: in 5 Minuten auf 0.', 'Ab 88 rechtzeitig zur Toilette: +2 Würde, +3 Momentum.']],
  ['alcohol', 'Alkohol', '0 nüchtern, 100 Vollpegel', ['14–37 PEGEL: Kraft ×1,10, Genauigkeit −6, Charme +3, Flirt +2.', '38–67 BESOFFEN: Kraft ×1,20, Genauigkeit −16, Verteidigung ×0,92.', 'Ab 68 VOLL: Kraft ×1,34, Genauigkeit −29, Verteidigung ×0,82, Bewegung ×0,88.', 'Mittlerer Pegel stärkt passende Rituale gegen Gundula/Uli; ab 76 schwächer.']],
  ['highness', 'Breit', '0 klar, 100 sehr breit', ['Ab 30 BREIT: +210 ms Reaktion, −5 Genauigkeit.', 'Ab 70 SEHR BREIT: +430 ms, −12 Genauigkeit, Bewegung ×0,82.', 'Chaos-Proben profitieren ab 30.']],
  ['hangover', 'Kater', '0 frisch, 100 maximal', ['Ab 28: KATER.', 'Mehr Energieverbrauch; weniger Genauigkeit, Charme, Flirt und Verteidigung.', 'Kaffee −5 Kater; Tablette −38.']],
  ['courage', 'Mut', '100 selbstbewusst, 0 verunsichert', ['Erfolge und Getränke können Mut erhöhen.', 'Soziale Fehlschläge und Entdeckung senken ihn.', 'Fließt in Herausforderungen des Basissystems ein.']],
];

const MINI_DOCS = [
  {
    id: 'flipCup', title: 'Flip Cup', subtitle: 'Vier Becher, ein gemeinsames Nervensystem',
    objective: 'Vier Figuren trinken und flippen nacheinander, bevor der Gegner seine vier Stationen beendet.',
    controls: ['AKTION halten: trinken.', 'Nach LEER sofort loslassen.', 'Becher an den idealen Überstand ziehen.', 'Vom unteren Rand nach oben wischen.'],
    phases: ['drink: Flüssigkeit und Reaktionszeit.', 'place: Überstand.', 'flip: Wischimpuls.', 'flight: Flug, Rotation, Landung.'],
    rules: ['Gegner/ms = (0,000029 + Position×0,0000027) × Schwierigkeit; René ×0,88.', 'Ab 700 ms Weiterhalten nach LEER: Fehler.', 'Bis 360 ms Loslassen: perfekte Reaktion.', 'Platzierungsbereich 0,085; mit Lars 0,14.', 'Landetoleranz = (0,43 + Platzierung×0,12 + 0,05 erster Versuch) ÷ Schwierigkeit.', 'Jede Figur hat eigene Trinkrate, Kontrolle und Sweetspot.'],
    score: ['100 − Gegner×11 − Fehler×7 + perfekte Flips×9 + perfekte Reaktionen×4 + beste Serie×3.'],
    quality: ['Perfekt: ≥3 perfekte Flips, 0 Fehler, ≥3 perfekte Reaktionen.', 'Solide: Sieg mit ≤2 Fehlern.', 'Chaotisch: anderer Sieg.', 'Fehlschlag: Gegner zuerst.'],
    rewards: ['Sieg lernt Bierbank-Chor „JAWOLL CHEF!“.', 'Perfekt: Anekdote „Alle gleichzeitig“.', 'Verändert Alkohol, Blase, Mut, Ruf, Momentum und Staffelbeziehungen.'],
    assists: [['assist-flip-edge', 'Lars', 'Sweetspot 0,14 statt 0,085.'], ['assist-team-shout', 'René', 'Gegner ×0,88.']],
    source: 'src/lpc-main/campaign/minigamesV2.ts · tickFlip / completeFlip',
  },
  {
    id: 'beerPong', title: 'Beer Pong', subtitle: 'Flugbahn, Risiko und Redemption',
    objective: 'Zehn Becher vor dem Gegner abräumen; Bounce kann zwei Becher treffen, darf aber abgewehrt werden.',
    controls: ['Ball zurückziehen.', 'Loslassen wirft.', 'AKTION wechselt DIREKT/BOUNCE.'],
    phases: ['ready: Wurf vorbereiten.', 'flight: Schwerkraft, Tisch und Treffer.', 'redemption: Treffer halten die letzte Chance am Leben.'],
    rules: ['Gegnerzug bei Uhr 4.300.', 'Gegnertreffer = 0,62 + (Schwierigkeit−1)×0,25.', 'Trefferradius 0,064 beim ersten, danach 0,057.', 'Bounce-Abwehr 0,24×Schwierigkeit; mit Susi 0,12.', 'Bounce entfernt nach Möglichkeit zwei Becher.', 'Re-Rack bei 6, 3 und 1 Restbecher.', 'Redemption ab 7 Treffern oder mit Felix.'],
    score: ['Treffer×13 − Fehlwurf×3 + Bounce-Doppel×10 + Serie×4 + Redemption×6.'],
    quality: ['Perfekt: Sieg, ≤1 Fehlwurf, ≥1 Bounce.', 'Solide: Sieg mit ≤4 Fehlwürfen.', 'Chaotisch: anderer Sieg.', 'Fehlschlag: Gegner/Redemption.'],
    rewards: ['Sieg lernt Beer-Pong-Zwangsduell.', 'Perfekt: Anekdote „Über Bande“.', 'Verändert Alkohol, Blase, Mut, Ruf, Momentum und Susi/Felix.'],
    assists: [['partner-susi-pong', 'Susi', 'Weniger gegnerische Serien/Bounce-Abwehr.'], ['assist-pong-redemption', 'Felix', 'Redemption ohne 7 Treffer.'], ['assist-precision', 'Gregor', 'Flugbahnprognose.']],
    source: 'src/lpc-main/campaign/minigamesV2.ts · tickPong / finishPong',
  },
  {
    id: 'flunkyball', title: 'Flunkyball', subtitle: 'Werfen, trinken, retten, STOPP',
    objective: 'Mittelflasche treffen, trinken und in der Verteidigung Flasche, Ball und Linie bedienen.',
    controls: ['Ball ziehen/werfen.', 'Nach Treffer AKTION halten.', 'Bei STOPP sofort loslassen.', 'Verteidigungsziele antippen und AKTION.'],
    phases: ['attack-throw.', 'attack-drink.', 'defense-run.', 'defense-ball.', 'defense-return.'],
    rules: ['Zielvektor 0,02/0,38.', 'Toleranz = (0,18 + 0,045 Hilfe + 0,035 erster Versuch) ÷ Schwierigkeit.', 'Trinken +0,00255/ms.', 'Verteidiger +0,00019×Schwierigkeit/ms.', 'Stoppruf 310 ms, mit Jule 430 ms.', 'Ab 650 ms weitertrinken: Foul und −14 Fortschritt.', 'Laufgeschwindigkeit 0,00023/ms, mit Danny ×1,22.', 'Nach Runde 8 entscheidet Fortschritt.'],
    score: ['Sieg = 100 + Treffer×12 + Stopqualität + perfekte Verteidigung×12 −18 bei Foul.'],
    quality: ['Perfekt: ≥3 Treffer, kein Foul, Stopqualität ≥40, ≥1 perfekte Verteidigung.', 'Solide: Sieg ≥2 Treffer.', 'Chaotisch: anderer Sieg.', 'Fehlschlag: Gegner zuerst.'],
    rewards: ['Sieg lernt Platzwart-Legendenlüge.', 'Perfekt: „STOPP heißt Stopp“.', 'Verändert Energie, Durst, Alkohol, Blase, Mut, Ruf, Momentum, Danny/Jule.'],
    assists: [['assist-flunky-sprint', 'Danny', 'Laufen +22 %.'], ['partner-jule-flunky', 'Jule', 'Stoppruf 430 ms.']],
    source: 'src/lpc-main/campaign/minigamesV2.ts · tickFlunky / endFlunkyRound',
  },
  {
    id: 'hedgePee', title: 'In die Hecke', subtitle: 'Deckung, Wind und Beweislage',
    objective: 'Blase leeren, ohne Blickkegel und sichtbare Beweise.',
    controls: ['Stelle wählen.', 'AKTION halten.', 'Horizontal zielen.', 'Loslassen baut Verdacht ab.'],
    phases: ['choose: Busch/Hecke/Zelt.', 'active: Fortschritt, Wind, Blicke, Beweise, Geräusch, Verdacht.'],
    rules: ['Busch 0,00325/ms; Hecke 0,00245/ms; Zelt 0,00272/ms.', 'Ulis Wissen: Patrouillen ×0,76.', 'Gundulas Wohlwollen: Verdacht ×0,75.', 'Verdacht +0,0115×Gefahren×Wohlwollen/ms.', 'Außerhalb Deckung Beweise +0,0032/ms.', 'Loslassen: Verdacht −0,0017×Wohlwollen/ms.', '100 Verdacht: entdeckt.'],
    score: ['Erfolg = 116 − Verdacht − Beweise − Geräusch.'],
    quality: ['Perfekt: Verdacht <14, Beweise <7, Unterbrechung <1,4.', 'Solide: Erfolg <42 Verdacht.', 'Chaotisch: anderer Erfolg.', 'Fehlschlag: entdeckt.'],
    rewards: ['Perfekt: „Die Hecke schweigt“.', 'Entdeckung: „Gundula hat es notiert“.', 'Erfolg leert Blase; Entdeckung kostet Würde/Beziehungen.'],
    assists: [['uli-route-knowledge', 'Uli', 'Patrouillen −24 %.'], ['authority-goodwill', 'Gundula', 'Verdacht −25 %.']],
    source: 'src/lpc-main/campaign/minigamesV2.ts · chooseHedgeSpot / tickHedge',
  },
  {
    id: 'maslHole', title: 'Komm ans Loch', subtitle: 'Abdichtung, Atemrhythmus und Wirkung',
    objective: 'Mit zwei Händen abdichten und drei kontrollierte Züge ausführen.',
    controls: ['Zwei Finger für beide Hände.', 'Maus: Hände nacheinander.', 'Bei stabiler Dichtung AKTION.', 'Im Atemfenster halten/loslassen.'],
    phases: ['seal: Abstand, Höhe, Zentrum.', 'pull: Dichtung, Rhythmus, Wirkung, Lecks, Husten.', 'Drei Runden, zunehmende Drift.'],
    rules: ['Optimaler Handabstand 0,22.', 'Startschwelle 0,64; erster Versuch 0,59; Masl 0,55.', 'Stabilität >450 ms.', 'Atemzentrum 0,72; Faktor 0,25–1.', 'Wirkung +0,00305×Dichtung×Rhythmus/ms.', 'Guter Zug: Wirkung 48–84, Dichtung ≥0,54, Rhythmus >450.'],
    score: ['Guter Zug = 72 + Dichtung×24 − |66−Wirkung|×0,48 − Lecks + Rhythmusbonus.', 'Gesamterfolg ab 175.'],
    quality: ['Perfekt ≥255 und Husten <55.', 'Solide ≥175.', 'Chaotisch 120–174.', 'Fehlschlag <120.'],
    rewards: ['Perfekt: „Masls Tunnel“.', 'Erfolg: Breit +42, Energie −8, Mut +6, Ruf/Momentum/Masl.', 'Fehlschlag trotzdem Breit +20.'],
    assists: [['assist-masl-seal', 'Masl', 'Schwelle 0,55.']],
    source: 'src/lpc-main/campaign/minigamesV2.ts · tickMasl / completeMaslPull',
  },
];

const QUEST_STAGES = [
  ['arrival', 'Ankunft ohne Plan B', 'Kofferraum öffnen', 'trunk', 'Reservierungssuche'],
  ['reservation', 'Wer lesen kann, parkt später', 'Reservierung finden', 'reservationBoard', 'Gundula/Uli'],
  ['authority', 'Verwaltung im Doppelpack', 'Einlasskampf gewinnen', 'gundula', 'Schranke, 25 Punkte, Aldi-Shirt'],
  ['gate-open', 'Zum Taucherplatz', 'Zum Wagen gehen', 'taucherplatz', 'Stromaufbau'],
  ['power', 'Strom oder Zivilisationsabbruch', 'Strom verbinden', 'powerBox', '10 Punkte, Ausladen'],
  ['unload', 'Ausladen ohne Bandscheibenvorfall', 'Getränke/Zelte/Kabel', 'drinks/tents/cable', 'Erstes Bier'],
  ['first-beer', 'Rituelle Inbetriebnahme', 'Erstes Bier öffnen', 'firstBeer', '10 Punkte, Biervertrag'],
  ['reunion', 'Finde die Problemträger', 'Freunde/Team', 'andre', 'Freies Wochenende'],
  ['free-weekend', 'Freies Wochenende', 'Spiele, Beziehungen, Ronny', 'campfire', 'Finalvoraussetzungen'],
  ['sunday-final', 'Sonntagsabnahme', 'Abschlussprotokoll', 'noticeBoard', '40 Punkte'],
  ['complete', 'Abreise mit Restwürde', 'Freie Restzeit', 'campfire', 'Abgeschlossen'],
];
const REGIONS = [
  ['arrival', 'Ankunft/Rezeption', 'Schranke, Reservierung, Gundula/Uli'],
  ['north', 'Adria-Klause/Nordplätze', 'Dauerplätze und Wege'],
  ['central', 'Taucherplatz/Sanitär', 'Lager, Strom, Hecke'],
  ['festival', 'Festwiese', 'Beer Pong, Bühne, Party'],
  ['woodland', 'Servicehof/Wald', 'Werkstatt, Holzlager'],
  ['beach', 'Strand/Hauptsteg', 'Flunkyball und Wasser'],
  ['cove', 'Ruhige Bucht', 'Unterstand und Steg'],
];

let mounted = false;
let activeCategory = 'overview';
let activeEntry = 'overview-flow';
let searchTerm = '';

export function mountCampaignCodex() {
  if (mounted) return;
  const game = document.getElementById('campaign-game');
  const nav = game?.querySelector('.topbar nav');
  if (!game || !nav) { setTimeout(mountCampaignCodex, 50); return; }
  mounted = true;
  const button = document.createElement('button');
  button.id = 'open-codex';
  button.type = 'button';
  button.textContent = 'Codex';
  button.title = 'Spiel-Codex öffnen (C)';
  nav.prepend(button);
  document.getElementById('app')?.insertAdjacentHTML('beforeend', codexShell());
  button.addEventListener('click', openCodex);
  byId('codex-close').addEventListener('click', closeCodex);
  byId('campaign-codex').addEventListener('click', (event) => { if (event.target === byId('campaign-codex')) closeCodex(); });
  byId('codex-search').addEventListener('input', (event) => { searchTerm = event.target.value.trim().toLocaleLowerCase('de'); render(); });
  byId('codex-tabs').addEventListener('click', (event) => {
    const target = event.target.closest?.('[data-codex-category]');
    if (!target) return;
    activeCategory = target.dataset.codexCategory;
    searchTerm = '';
    byId('codex-search').value = '';
    activeEntry = buildEntries().find((entry) => entry.category === activeCategory)?.id ?? activeEntry;
    render();
  });
  byId('codex-entry-list').addEventListener('click', (event) => {
    const target = event.target.closest?.('[data-codex-entry]');
    if (!target) return;
    activeEntry = target.dataset.codexEntry;
    render();
    if (matchMedia('(max-width: 820px)').matches) byId('codex-detail').scrollIntoView({ block: 'start', behavior: 'smooth' });
  });
  addEventListener('keydown', (event) => {
    if (event.target?.matches?.('input,textarea,select,[contenteditable="true"]')) return;
    if (event.key === 'Escape' && !byId('campaign-codex').hidden) { event.preventDefault(); closeCodex(); }
    if (event.key.toLocaleLowerCase('de') === 'c' && byId('campaign-codex').hidden && !document.querySelector('.modal:not([hidden])')) { event.preventDefault(); openCodex(); }
  });
  addEventListener('lpc-campaign-meta', () => { if (!byId('campaign-codex').hidden) render(); });
  render();
}

function openCodex() {
  byId('campaign-codex').hidden = false;
  document.body.classList.add('campaign-modal-open', 'campaign-codex-open');
  render();
  setTimeout(() => byId('codex-search').focus(), 0);
}
function closeCodex() {
  byId('campaign-codex').hidden = true;
  document.body.classList.remove('campaign-codex-open');
  if (!document.querySelector('.modal:not([hidden])')) document.body.classList.remove('campaign-modal-open');
}
function render() {
  const entries = buildEntries();
  const filtered = entries.filter((entry) => searchTerm ? entry.search.includes(searchTerm) : entry.category === activeCategory);
  if (!filtered.some((entry) => entry.id === activeEntry)) activeEntry = filtered[0]?.id ?? entries[0]?.id;
  const selected = entries.find((entry) => entry.id === activeEntry) ?? filtered[0];
  const category = CATEGORIES.find(([id]) => id === activeCategory) ?? CATEGORIES[0];
  byId('codex-tabs').innerHTML = CATEGORIES.map(([id, icon, label]) => `<button type="button" data-codex-category="${id}" class="${id === activeCategory ? 'active' : ''}"><i>${icon}</i><span>${esc(label)}</span><b>${entries.filter((entry) => entry.category === id).length}</b></button>`).join('');
  byId('codex-category-copy').textContent = searchTerm ? `Suche über den vollständigen Codex: „${searchTerm}“` : category[3];
  byId('codex-count').textContent = `${filtered.length} Einträge`;
  byId('codex-entry-list').innerHTML = filtered.length ? filtered.map((entry) => `<button type="button" data-codex-entry="${entry.id}" class="${entry.id === selected?.id ? 'active' : ''}"><span>${esc(entry.title)}</span><small>${esc(entry.subtitle)}</small>${entry.badge ? `<b>${esc(entry.badge)}</b>` : ''}</button>`).join('') : '<p class="codex-empty">Keine Einträge gefunden.</p>';
  byId('codex-detail').innerHTML = selected?.render() ?? '<p class="codex-empty">Kein Eintrag.</p>';
}

function buildEntries() {
  const store = new GameStore({ getItem: (key) => localStorage.getItem(key), setItem() {}, removeItem() {} });
  const base = store.snapshot();
  const meta = campaignMeta.snapshot();
  const snapshot = campaignMeta.augmentSnapshot(base);
  const result = [];
  addOverview(result, snapshot, meta);
  addCharacters(result, snapshot, meta);
  addAttacks(result, meta);
  addCombat(result, snapshot, meta);
  addMinigames(result, meta);
  addStatus(result, snapshot);
  addItems(result, snapshot);
  addQuests(result, meta);
  addProgression(result, meta);
  addWorld(result, snapshot);
  return result;
}

function addOverview(out, snapshot, meta) {
  push(out, 'overview-flow', 'overview', 'Spielablauf', 'Vom Intro bis zur Sonntagsabnahme', 'Kampagne Supermarkt Einlass Finale', () => page('SPIELSTRUKTUR', 'Spielablauf', 'Ein zusammenhängendes Campingwochenende, in dem Entscheidungen Zustände, Beziehungen und das Finale verändern.', stats([['Stufe', stageName(meta.questStage)], ['Zeit', `Tag ${snapshot.day} · ${snapshot.clockLabel}`], ['Ziel', campaignMeta.objective().title], ['Wochenendwert', `${meta.weekendScore} · ${rankName(meta.weekendRank)}`]]) + sections([
    ['1. Intro und Profil', paras(['Variable Einleitung; danach Name, Körper, Haare, Accessoire, Farben und Eigenschaft.'])],
    ['2. Supermarkt', paras(['25 € Startbudget, Maximalmengen, mindestens ein Kauf.'])],
    ['3. Ankunft', ordered(['Kofferraum', 'Reservierung', 'Gundula/Uli', 'Taucherplatz', 'Strom', 'Ausladen', 'Erstes Bier'])],
    ['4. Freies Wochenende', paras(['Charaktere, Team, Minispiele, Ronny, Attacken, Anekdoten und Romanzen.'])],
    ['5. Finale', paras(['Drei unterschiedliche Aktivitäten plus Ronny öffnen die Sonntagsabnahme.'])],
    ['Codequellen', sources(['src/lpc-main/campaign/app.ts', 'src/lpc-main/campaign/metaStore.ts', 'src/game/state/GameStore.ts'])],
  ])));
  push(out, 'overview-controls', 'overview', 'Steuerung', 'Tastatur, Maus und Touch', 'WASD Pfeile E Leertaste C Joystick', () => page('BEDIENUNG', 'Steuerung', 'Alle Kernfunktionen sind mobil und mit Tastatur bedienbar.', sections([
    ['Welt', table(['Eingabe', 'Funktion'], [['WASD/Pfeile', 'Bewegen; diagonal normalisiert.'], ['E/Leertaste', 'Interagieren.'], ['Q', 'Winken.'], ['C', 'Codex öffnen.']])],
    ['Mobil', paras(['Dynamischer unsichtbarer Analogstick links; kontextabhängige Aktionstaste rechts.'])],
    ['Sperre', paras(['campaign-modal-open stoppt Weltbewegung während Menüs und Minispielen.'])],
    ['Codequellen', sources(['src/lpc-main/campaign/worldScene.ts', 'src/lpc-main/campaign/mobileControls.ts'])],
  ])));
  push(out, 'overview-save', 'overview', 'Speicherung', 'Lokale Browserstände', 'localStorage Kompatibilität IDs', () => page('TECHNIK', 'Speicherung', 'Basisspiel und Kampagnenfortschritt werden getrennt gespeichert.', table(['Bereich', 'Schlüssel'], [['Basisspiel', STORAGE_KEY], ['Kampagne', 'tales-blaue-adria-lpc-campaign-meta-v2'], ['Intro', 'tales-adria-intro-variant-v2']]) + note('Kompatibilität', 'Attacken-IDs bleiben stabil, während Namen, Texte und Balancing verändert werden können.') + sources(['src/game/state/GameStore.ts', 'src/lpc-main/campaign/metaStore.ts'])));
  push(out, 'overview-profile', 'overview', 'Spielerprofil', snapshot.profile ? `${snapshot.profile.name} · ${snapshot.profile.trait}` : 'Noch nicht erstellt', 'hilfsbereit beobachtend chaotisch direkt charmant', () => page('SPIELERFIGUR', 'Eigenschaften', 'Eigenschaften verstärken passende Dialogansätze.', stats([['Name', snapshot.profile?.name ?? '–'], ['Eigenschaft', snapshot.profile?.trait ?? '–'], ['Körper', snapshot.profile?.bodyType ?? '–'], ['Frisur', snapshot.profile?.hairStyle ?? '–']]) + table(['Eigenschaft', 'Aktuelle Wirkung'], [['Hilfsbereit', '+2 bei Hilfe/Planen.'], ['Beobachtend', '+1 bei Zuhören.'], ['Chaotisch', '+1 bei Humor; kreative Romanzen.'], ['Direkt', '+1 bei Herausforderung.'], ['Charmant', 'Noch kein eigener fester Bonus im Charakterresolver.']]) + note('Verfeinerungspunkt', 'Charmant ist mechanisch schwächer angebunden.'));
}

function addCharacters(out, snapshot, meta) {
  const order = ['gundula', 'uli', 'ronny', 'manni', 'andre', 'rene', 'lars', 'danny', 'gregor', 'masl', 'schubert', 'felix', 'schima', 'susi', 'jule', 'kira'];
  const voices = Object.values(CHARACTER_VOICES).sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
  for (const voice of voices) {
    const friend = FRIEND_PROFILES[voice.id];
    const romance = ROMANCE_PROFILES[voice.id];
    const visual = CAMPAIGN_CHARACTER_BY_ID[voice.id];
    const relation = snapshot.relationships[voice.id] ?? 0;
    const active = meta.activeTeam.includes(voice.id);
    const met = Boolean(snapshot.flags[`met-${voice.id}`]) || (meta.conversationCounts[voice.id] ?? 0) > 0;
    const keywords = [voice.name, voice.role, voice.cadence, ...voice.values, ...voice.irritants, friend?.biography, romance?.description].filter(Boolean).join(' ');
    push(out, `character-${voice.id}`, 'characters', voice.name, voice.role, keywords, () => renderCharacter(voice, friend, romance, visual, snapshot, meta), active ? 'AKTIV' : met ? `BEZ. ${signed(relation)}` : 'UNBEKANNT');
  }
}
function renderCharacter(voice, friend, romance, visual, snapshot, meta) {
  const relation = snapshot.relationships[voice.id] ?? 0;
  const content = [];
  content.push(['Persönlichkeit', table(['Feld', 'Inhalt'], [['Rolle', voice.role], ['Sprechweise', voice.cadence], ['Werte', voice.values.join(' · ')], ['Reizpunkte', voice.irritants.join(' · ')], ['Mag', voice.likes.map((id) => APPROACH[id]).join(' · ') || '–'], ['Mag nicht', voice.dislikes.map((id) => APPROACH[id]).join(' · ') || 'Keine feste Abneigung']])]);
  if (friend) content.push(['Freundesprofil', table(['Feld', 'Inhalt'], [['Archetyp', friend.archetype], ['Biografie', friend.biography], ['Stärken', friend.strengths.join(' · ')], ['Schwächen', friend.weaknesses.join(' · ')], ['Themen', friend.topics.join(' · ')], ['Cannabis', yes(friend.likesCannabis)], ['Alkoholtoleranz', friend.alcoholTolerance], ['Rekrutierung', `ab ${friend.recruitmentThreshold} Beziehung und erstem Treffen`], ['Feldsatz', friend.fieldLine]])]);
  if (friend && FRIEND_TEAM_MEMBERS[voice.id]) content.push(['Teamwerte', teamStats(FRIEND_TEAM_MEMBERS[voice.id])]);
  if (romance) content.push(['Romanze', romanceView(voice.id, romance, snapshot, meta)]);
  content.push(['Dialogoptionen', voice.choices.map((choice) => `<article class="codex-choice"><header><strong>${esc(choice.label)}</strong><span class="risk-${choice.risk}">${choice.risk.toUpperCase()}</span></header><p>${esc(choice.hint)}</p><small>${esc(choice.topic)} · ${esc(APPROACH[choice.approach])}</small></article>`).join('')]);
  content.push(['Positive Reaktionen', responsePools(voice.positive)]);
  content.push(['Negative Reaktionen', responsePools(voice.negative)]);
  content.push(['Persönliche Enthüllung', paras([voice.personalReveal])]);
  content.push(['Dauerhafte Spielwirkung', paras([voice.assistLabel ?? 'Keine eigene Assistenz.', `Flag: ${voice.consequenceFlag ?? 'keins'}`])]);
  if (COMPANION_ACTIONS[voice.id]) {
    const action = COMPANION_ACTIONS[voice.id];
    content.push(['Begleiteraktion', table(['Name', 'Wirkung', 'Kosten'], [[action.label, action.detail, `${action.momentum} Momentum`]])]);
  }
  content.push(['Visual', table(['Feld', 'Wert'], [['Outfit', visual?.outfit ?? '–'], ['Frisur', visual?.hairStyle ?? '–'], ['Accessoires', visual?.accessories?.join(' · ') ?? '–'], ['Idle', visual?.idleAnimation ?? '–'], ['Begrüßung', visual?.greetingAnimation ?? '–'], ['Welttext', visual?.dialogue ?? '–']])]);
  if (['gundula', 'uli'].includes(voice.id)) content.push(['Manipulationsmarker', authorityFlags(meta.flags)]);
  content.push(['Codequellen', sources(['src/lpc-main/campaign/characterVoices.ts', friend ? 'src/game/friendRoster.ts' : '', romance ? 'src/game/socialSystem.ts' : '', 'src/lpc-main/content.ts', ['gundula', 'uli'].includes(voice.id) ? 'src/lpc-main/campaign/authorityOverhaul.ts' : ''].filter(Boolean))]);
  return page(visual?.role ?? 'CHARAKTER', voice.name, voice.cadence, stats([['Beziehung', signed(relation)], ['Gespräche', String(meta.conversationCounts[voice.id] ?? 0)], ['Aktives Team', yes(meta.activeTeam.includes(voice.id))], ['Portrait', voice.portrait]]) + sections(content));
}

function addAttacks(out, meta) {
  for (const move of Object.values(COMBAT_MOVES)) {
    const learned = meta.learnedAttacks.includes(move.id);
    const equipped = meta.equippedAttacks.includes(move.id);
    const mastery = meta.attackMastery[move.id];
    const badge = equipped ? 'AUSGERÜSTET' : learned ? `M${mastery?.level ?? 1}` : 'GESPERRT';
    push(out, `attack-${move.id}`, 'attacks', move.label, `${TAGS[move.tag]} · ${move.accuracy}%`, `${move.id} ${move.description} ${move.unlockTitle} ${move.unlockDetail}`, () => renderAttack(move, meta), badge);
  }
}
function renderAttack(move, meta) {
  const mastery = meta.attackMastery[move.id];
  const opponentRows = Object.values(CAMPAIGN_OPPONENTS).map((opponent) => {
    const factor = (opponent.moveMultipliers[move.id] ?? 1) * (opponent.tagMultipliers[move.tag] ?? 1);
    return [opponent.name, factor.toFixed(2), effectiveness(factor)];
  });
  return page('FRUSTATTACKE', move.label, move.description, stats([['Technische ID', move.id], ['Kategorie', TAGS[move.tag]], ['Grundfrust', String(move.baseFrustration)], ['Genauigkeit', `${move.accuracy}%`], ['Status', meta.equippedAttacks.includes(move.id) ? 'Ausgerüstet' : meta.learnedAttacks.includes(move.id) ? 'Gelernt' : 'Gesperrt'], ['Meisterschaft', `M${mastery?.level ?? 1} · ${branchLabel(mastery?.branch)}`]]) + sections([
    ['Exakte Wirkung', table(['Parameter', 'Wert'], [['Grundfrust', String(move.baseFrustration)], ['Genauigkeit', `${move.accuracy}%`], ['Tag', `${move.tag} · ${TAGS[move.tag]}`], ['Selbstentlastung', move.selfRelief ? String(move.selfRelief) : 'Keine'], ['Schutzfaktor', move.guardMultiplier ? String(move.guardMultiplier) : 'Keiner'], ['Status', move.status ? `${move.status.target}: ${BATTLE_STATUS[move.status.id]?.[0] ?? move.status.id}, ${move.status.turns} Runde(n)` : 'Keiner']])],
    ['Aktueller Kampftext', paras([attackText(move.id, meta.activeTeam.length || 1)])],
    ['Freischaltung', table(['Titel', 'Bedingung'], [[move.unlockTitle, move.unlockDetail]])],
    ['Flirtoption', table(['Option', 'Modifikator'], [[move.flirtOption, signed(move.flirtModifier)]])],
    ['Meisterschaft', masteryView(move.id, meta)],
    ['Gegnerwirkung', table(['Gegner', 'Move×Tag', 'Bewertung'], opponentRows)],
    ['Wiederholung', bullets(['Genauigkeit: 0 / −8 / −18 / −35 ab 1./2./3./4. Nutzung in Folge.', 'Schadensfaktor: 1,00 / 0,85 / 0,65 / 0,35.', 'Andere Attacken bauen Gewöhnung um 1 ab.'])],
    ['Codequellen', sources(['src/game/combatMoves.ts', 'src/lpc-main/campaign/authorityOverhaul.ts', 'src/lpc-main/campaign/battleEngine.ts', 'src/lpc-main/campaign/progression.ts'])],
  ]));
}

function addCombat(out, snapshot, meta) {
  const mod = statusModifiers(snapshot.needs);
  push(out, 'combat-turn', 'combat', 'Rundenablauf', 'Treffer, Frust, Konter und Gewöhnung', 'Kampf Formel kritisch Genauigkeit Schaden', () => page('KAMPFSYSTEM', 'Rundenablauf', 'Wer zuerst sein Frustmaximum erreicht, verliert.', sections([
    ['Schritte', ordered(['Attacke wählen.', 'Genauigkeit berechnen.', 'Trefferwurf.', 'Frust und Status.', 'Momentum.', 'Gegnerkonter.', 'Statusdauer und Gewöhnung.'])],
    ['Aktueller Körper', stats([['Kraft', `${mod.power.toFixed(2)}×`], ['Genauigkeit', signed(mod.accuracy)], ['Verteidigung', `${mod.defense.toFixed(2)}×`], ['Bewegung', `${mod.movement.toFixed(2)}×`], ['Verzögerung', `${mod.reactionDelayMs} ms`]])],
    ['Trefferformel', formula('Attacke + Körper + Meisterschaft + Fokus + Boni + Anekdote − Unterbrechung − Gewöhnung + geöffneter Gegner')],
    ['Schadensformel', formula('Grundfrust × Körper × Meisterschaft × Gegner-Tag × Gegner-Move × Phase × Kombo × Team × Wiederholung × Anekdote × Signatur × Vorbereitung × Kritisch')],
    ['Kritisch', paras(['Normal: Wurf ≤ max(4; Genauigkeit×0,12). Signatur: Genauigkeit×0,20. Schaden ×1,45.'])],
    ['Codequelle', sources(['src/lpc-main/campaign/battleEngine.ts'])],
  ])));
  push(out, 'combat-opponents', 'combat', 'Gegnerprofile', 'Einlass, Ronny und Sonntag', 'Boss Gundula Uli Ronny', () => page('GEGNER', 'Gegnerprofile', 'Eigene Frustgrenzen, Konter und Multiplikatoren.', Object.entries(CAMPAIGN_OPPONENTS).map(([id, opponent]) => opponentCard(id, opponent)).join('') + sources(['src/game/combatMoves.ts', 'src/lpc-main/campaign/battleEngine.ts'])));
  push(out, 'combat-authority', 'combat', 'Gundula/Uli manipulieren', `${authorityManipulationScore(meta.flags)} aktive Marker`, 'Manipulierbare Platzleitung Ego Wegbier Beer Pong Nackenklatscher', () => page('BOSSMECHANIK', 'Manipulierbare Platzleitung', 'Grimmig, aber über Ego, Pöbelpakt, Wegbier, Spielstolz und Kumpelrituale berechenbar.', stats([['Marker', String(authorityManipulationScore(meta.flags))], ['Ego', yes(meta.flags['authority-ego-hook'])], ['Wegbier', yes(meta.flags['authority-drinking-bond'])], ['Wohlwollen', yes(meta.flags['authority-goodwill'])]]) + sections([
    ['Marker', authorityFlags(meta.flags)],
    ['Skalierung', bullets(['Je Marker +4,5 % Wirkung, maximal +28 %.', 'Startfrust = Marker×5 +4 bei Wohlwollen; Max 34/22.', 'Konter = max(0,48; 1−Marker×0,075), danach Wohlwollen ×0,88, Wegbier ×0,82; Minimum 0,38.'])],
    ['Phasen', table(['Phase', 'Bereich', 'Stark'], [['Schranken-Gockelmodus', '0–33 %', 'Kumpel, Zustimmung, Getränk'], ['Angeschickerte Stichelei', '34–69 %', 'Team, Charme, Witz, Getränk'], ['Gekränkte Platzherrschaft', '70–100 %', 'Chaos, Team, Charme']])],
    ['Codequellen', sources(['src/lpc-main/campaign/authorityOverhaul.ts', 'src/lpc-main/campaign/progression.ts'])],
  ])));
  push(out, 'combat-status', 'combat', 'Kampfstatus', 'Temporäre Effekte', 'Überrumpelt Leerlauf Unterbrochen Abgesichert', () => page('KAMPFSTATUS', 'Temporäre Effekte', 'Am Rundenende sinkt Dauer um 1.', Object.entries(BATTLE_STATUS).map(([id, [label, effect]]) => `<article class="codex-rule"><header><strong>${esc(label)}</strong><code>${id}</code></header><p>${esc(effect)}</p></article>`).join('') + note('Kontrolle', 'Kontroll-Spezialisierung verlängert gesetzte Status um eine Runde.')));
  push(out, 'combat-team', 'combat', 'Team und Begleiteraktionen', `${meta.activeTeam.length} aktiv`, 'Team Begleiter Momentum Synergie', () => page('TEAM', 'Begleiter im Kampf', 'Begleiter skalieren Teamattacken und besitzen einmalige Momentumaktionen.', stats([['Aktiv', meta.activeTeam.map(nameFor).join(' · ') || 'Niemand'], ['Limit', String(currentRank(meta).companionSlots)], ['Teamattacke', '1+(Größe−1)×0,24'], ['Andere Attacken', '1+(Größe−1)×0,04']]) + table(['Begleiter', 'Aktion', 'Wirkung', 'Kosten'], Object.entries(COMPANION_ACTIONS).map(([id, action]) => [nameFor(id), action.label, action.detail, String(action.momentum)])) + synergyView(meta.activeTeam)));
}

function addMinigames(out, meta) {
  for (const doc of MINI_DOCS) {
    const result = meta.miniResults[doc.id];
    const badge = result ? `${result.wins}/${result.attempts} · ${result.bestQuality}` : 'UNVERSUCHT';
    push(out, `minigame-${doc.id}`, 'minigames', doc.title, doc.subtitle, `${doc.objective} ${doc.rules.join(' ')} ${doc.assists.flat().join(' ')}`, () => renderMinigame(doc, result, meta.flags), badge);
  }
}
function renderMinigame(doc, result, flags) {
  return page('MINISPIEL', `${doc.title} · ${doc.subtitle}`, doc.objective, stats([['Versuche', String(result?.attempts ?? 0)], ['Siege', String(result?.wins ?? 0)], ['Bestwert', String(result?.best ?? 0)], ['Qualität', result?.bestQuality ?? 'failed']]) + sections([
    ['Steuerung', ordered(doc.controls)],
    ['Phasen', bullets(doc.phases)],
    ['Exakt programmierte Regeln', bullets(doc.rules)],
    ['Wertungsformel', doc.score.map(formula).join('')],
    ['Qualitätsstufen', bullets(doc.quality)],
    ['Belohnungen und Folgen', bullets(doc.rewards)],
    ['Charakterhilfen', table(['Flag', 'Quelle', 'Aktiv', 'Wirkung'], doc.assists.map(([flag, source, effect]) => [flag, source, yes(flags[flag]), effect]))],
    ['Adaptive Schwierigkeit', bullets(['Erster Versuch 0,84.', 'Zweiter ohne Sieg 0,90.', 'Danach 1,00.', 'Ab 2 Siegen +0,05.', 'Bestqualität Perfekt +0,08.', 'Energie <30 +0,03.', 'Grenzen 0,82–1,18.'])],
    ['Codequelle', sources([doc.source])],
  ]));
}

function addStatus(out, snapshot) {
  const statuses = activeStatuses(snapshot.needs);
  const mod = statusModifiers(snapshot.needs);
  for (const [id, label, direction, details] of NEEDS) {
    push(out, `need-${id}`, 'status', label, `${Math.round(snapshot.needs[id])}/100`, `${direction} ${details.join(' ')}`, () => page('BEDÜRFNIS', label, direction, stats([['Aktuell', String(Math.round(snapshot.needs[id]))], ['Status', statusForNeed(id, statuses)]]) + bullets(details) + sources(['src/game/statusSystem.ts', 'src/game/state/GameStore.ts'])));
  }
  push(out, 'status-current', 'status', 'Aktuelle Gesamtwirkung', statuses.map((status) => status.shortLabel).join(' · ') || 'STABIL', 'Kraft Genauigkeit Verteidigung Charme Flirt', () => page('ZUSTAND', 'Aktuelle Gesamtwirkung', 'Alle Schwellen werden kombiniert.', stats([['Kraft', `${mod.power.toFixed(2)}×`], ['Genauigkeit', signed(mod.accuracy)], ['Verteidigung', `${mod.defense.toFixed(2)}×`], ['Bewegung', `${mod.movement.toFixed(2)}×`], ['Verzögerung', `${mod.reactionDelayMs} ms`], ['Charme', signed(mod.charm)], ['Flirt', signed(mod.flirt)], ['Energieverbrauch', `${mod.energyDrain.toFixed(2)}×`]]) + (statuses.length ? statuses.map((status) => note(`${status.shortLabel} · ${Math.round(status.intensity * 100)} %`, status.description)).join('') : note('Stabil', 'Kein Schwellenstatus.'))));
  push(out, 'status-metrics', 'status', 'Wochenendwerte', `Würde ${snapshot.metrics.dignity} · Chaos ${snapshot.metrics.chaos}`, 'Würde Chaos Ruf Momentum', () => page('METAWERTE', 'Würde, Chaos, Ruf und Momentum', 'Soziale Qualität und Ressourcen.', stats([['Würde', String(snapshot.metrics.dignity)], ['Chaos', String(snapshot.metrics.chaos)], ['Ruf', String(snapshot.metrics.reputation)], ['Momentum', String(snapshot.metrics.momentum)]]) + table(['Wert', 'Funktion'], [['Würde', 'Kontrolle/Restrespekt.'], ['Chaos', 'Eskalation; schadet manchen Romanzen.'], ['Ruf', 'Kompetenz; hilft Flirt und Score.'], ['Momentum', 'Begleiteraktionen und Signaturattacken.']])));
}

function addItems(out, snapshot) {
  for (const item of Object.values(ITEMS)) {
    const count = snapshot.inventory[item.id] ?? 0;
    push(out, `item-${item.id}`, 'items', `${item.icon} ${item.label}`, `${item.price} € · Bestand ${count}`, `${item.id} ${item.description} ${Object.keys(item.effects ?? {}).join(' ')}`, () => page('GEGENSTAND', `${item.icon} ${item.label}`, item.description, stats([['ID', item.id], ['Preis', `${item.price} €`], ['Maximal', String(item.max)], ['Bestand', String(count)]]) + (item.effects ? table(['Wert', 'Änderung'], Object.entries(item.effects).map(([id, value]) => [needName(id), signed(value)])) : note('Questgegenstand', 'Nicht direkt benutzbar; Wirkung in Interaktion.')) + itemNote(item.id) + sources(['src/game/content.ts', 'src/game/state/GameStore.ts'])), count > 0 ? `${count}×` : undefined);
  }
}

function addQuests(out, meta) {
  push(out, 'quest-finale', 'quests', 'Finale freischalten', `${finaleProgress(meta)}/4 Bedingungen`, 'Finale drei Aktivitäten Ronny', () => page('FINALE', 'Sonntagsabnahme freischalten', 'Drei unterschiedliche Aktivitäten plus Ronny.', stats([['Aktivitäten', `${completedActivities(meta)}/3`], ['Ronny', yes(meta.flags.ronnyDefeated)], ['Finale aktiv', yes(meta.questStage === 'sunday-final')], ['Gewonnen', yes(meta.finalBattleWon)]]) + bullets(['Aktivitäten: Flip Cup, Beer Pong, Flunkyball, Komm ans Loch, In die Hecke.', 'Mindestens drei verschiedene.', 'Ronny separat besiegen.'])));
  for (const [id, title, objective, target, completion] of QUEST_STAGES) {
    push(out, `quest-${id}`, 'quests', title, id === meta.questStage ? 'AKTIV' : id, `${objective} ${target} ${completion}`, () => page('KAMPAGNENSTUFE', title, objective, stats([['ID', id], ['Ziel', target], ['Status', id === meta.questStage ? 'Aktiv' : stageState(id, meta.questStage)]]) + note('Abschlusswirkung', completion) + sources(['src/lpc-main/campaign/metaStore.ts'])), id === meta.questStage ? 'AKTIV' : undefined);
  }
  for (const quest of Object.values(QUESTS)) {
    push(out, `basequest-${quest.id}`, 'quests', quest.title, 'Basissystem-Quest', `${quest.objective} ${quest.reward}`, () => page('BASISQUEST', quest.title, quest.objective, table(['ID', 'Belohnung'], [[quest.id, quest.reward]]) + note('Einordnung', 'Die LPC-Kampagne legt eine detailliertere Stufenlogik darüber.')));
  }
}

function addProgression(out, meta) {
  push(out, 'progress-score', 'progression', 'Wochenendwert', `${meta.weekendScore} Punkte`, 'Score Formel Rang Beziehungen Romanze', () => page('FORTSCHRITT', 'Wochenendwert', 'Bündelt Kampagne, Spiele, Beziehungen, Romanzen, Meisterschaft und Risiko.', stats([['Wert', String(meta.weekendScore)], ['Rang', rankName(meta.weekendRank)], ['Attackenplätze', String(currentRank(meta).attackSlots)], ['Begleiterplätze', String(currentRank(meta).companionSlots)]]) + formula('25 Einlass + 10 Strom + 10 erstes Bier + 40 Finale + Siege×12 + Perfekt×8 + Anekdoten×5 + Meisterschaft + Romanzen×0,18 + Beziehungen×0,12 + Erleichterungen×3 − Verdacht×0,15') + scoreBreakdown(meta) + sources(['src/lpc-main/campaign/metaStore.ts · recalculateScore'])));
  push(out, 'progress-ranks', 'progression', 'Wochenendränge', rankName(meta.weekendRank), 'Rang Slots Legende Mythos', () => page('RÄNGE', 'Wochenendränge', 'Bestimmen Attacken- und Begleiterplätze.', table(['Rang', 'Mindestwert', 'Attacken', 'Begleiter', 'Status'], WEEKEND_RANKS.map((rank) => [rank.label, String(rank.minScore), String(rank.attackSlots), String(rank.companionSlots), rank.id === meta.weekendRank ? 'AKTUELL' : ''])) + note('Grenze', `Maximal ${MAX_EQUIPPED_ATTACKS} Attacken.`)));
  push(out, 'progress-mastery', 'progression', 'Attackenmeisterschaft', `${Object.keys(meta.attackMastery).length} trainiert`, 'M2 M3 Wirkung Kontrolle Signatur', () => page('MEISTERSCHAFT', 'Attacken trainieren', 'Einsätze und Treffer werden dauerhaft gezählt.', table(['Attacke', 'Einsätze', 'Treffer', 'Stufe', 'Zweig'], meta.learnedAttacks.map((id) => { const mastery = meta.attackMastery[id]; return [COMBAT_MOVES[id].shortLabel, String(mastery?.uses ?? 0), String(mastery?.successes ?? 0), `M${mastery?.level ?? 1}`, branchLabel(mastery?.branch)]; })) + bullets(['M2: 4 Einsätze und 3 Treffer.', 'M3: 9 Einsätze und 7 Treffer.', 'Wirkung: ×1,09.', 'Kontrolle: +7 Genauigkeit, +1 Statusrunde.', 'M3-Signatur: 2 Momentum, +6 Genauigkeit, ×1,38 Schaden.'])));
  push(out, 'progress-anecdotes', 'progression', 'Anekdoten', `${meta.unlockedAnecdotes.length}/${Object.keys(ANECDOTES).length}`, 'Anekdoten ausgerüstet Kampfbonus', () => page('ANEKDOTEN', 'Wochenendlegenden', 'Besondere Erfolge und Fehlschläge werden als Kampfboni gespeichert.', Object.values(ANECDOTES).map((anecdote) => anecdoteCard(anecdote, meta)).join('') + sources(['src/lpc-main/campaign/progression.ts'])));
  push(out, 'progress-team', 'progression', 'Teamzusammenstellung', meta.activeTeam.map(nameFor).join(' · ') || 'Kein Team', 'Rekrutierung Schwelle Synergie', () => page('TEAMFORTSCHRITT', 'Aktives Team', 'Freunde benötigen Treffen und Beziehungsschwelle.', stats([['Aktiv', meta.activeTeam.map(nameFor).join(' · ') || 'Niemand'], ['Limit', String(currentRank(meta).companionSlots)]]) + table(['Freund', 'Schwelle', 'Aktiv', 'Stärken'], Object.values(FRIEND_PROFILES).map((friend) => [nameFor(friend.id), String(friend.recruitmentThreshold), yes(meta.activeTeam.includes(friend.id)), friend.strengths.join(' · ')])) + synergyView(meta.activeTeam)));
}

function addWorld(out, snapshot) {
  push(out, 'world-regions', 'world', 'Regionen', 'Sieben Funktionsbereiche', 'Ankunft Zentral Festwiese Strand Bucht', () => page('WELT', 'Regionen', 'Die Karte ist 2.600×1.800 Einheiten groß.', stats([['Position', `${Math.round(snapshot.worldPosition.x)}/${Math.round(snapshot.worldPosition.y)}`], ['Welt', '2.600×1.800'], ['Kamera', '1.280×720'], ['Grundtempo', '195 Einheiten/s']]) + table(['ID', 'Name', 'Funktion'], REGIONS) + sources(['src/game/aerialCampgroundPlan.ts', 'src/lpc-main/campaign/worldScene.ts'])));
  for (const kind of ['story', 'service', 'minigame', 'landmark']) {
    const list = ALL_INTERACTIONS.filter((interaction) => interaction.kind === kind);
    push(out, `world-${kind}`, 'world', kindName(kind), `${list.length} Orte`, `${kind} ${list.map((item) => item.label).join(' ')}`, () => page('INTERAKTIONEN', kindName(kind), kindDescription(kind), table(['Ort', 'ID', 'Position', 'Radius', 'Einlass'], list.map((item) => [item.label, item.id, `${item.x}/${item.y}`, String(item.radius), yes(Boolean(item.requiresGate))])) + sources(['src/lpc-main/campaign/content.ts'])));
  }
  push(out, 'world-map', 'world', 'Minikarte und Zielführung', 'Gelb Ziel · Weiß Spieler', 'Minimap Fokus Distanz', () => page('NAVIGATION', 'Minikarte', 'Weltkoordinaten werden in eine 330×230-Pixel-Karte übersetzt.', bullets(['Skalierung x=330/2600, y=230/1800.', 'Gelb: Questziel.', 'Weiß: Spieler.', 'Distanz: euklidisch, gerundet.', 'Fokus: 500 ms Schwenk, nach 950 ms wieder Spielerfolge.']) + sources(['src/lpc-main/campaign/app.ts · drawMinimap', 'src/lpc-main/campaign/worldScene.ts · externalFocus'])));
}

function push(out, id, category, title, subtitle, keywords, render, badge) { out.push({ id, category, title, subtitle, badge, search: `${title} ${subtitle} ${keywords}`.toLocaleLowerCase('de'), render }); }
function page(kicker, title, intro, content) { return `<article class="codex-page"><header class="codex-page-head"><span>${esc(kicker)}</span><h2>${esc(title)}</h2><p>${esc(intro)}</p></header>${content}</article>`; }
function sections(rows) { return rows.map(([title, content]) => `<section class="codex-section"><h3>${esc(title)}</h3>${content}</section>`).join(''); }
function stats(rows) { return `<div class="codex-stat-grid">${rows.map(([label, value]) => `<div><small>${esc(label)}</small><strong>${esc(value)}</strong></div>`).join('')}</div>`; }
function table(headers, rows) { return `<div class="codex-table-wrap"><table><thead><tr>${headers.map((header) => `<th>${esc(header)}</th>`).join('')}</tr></thead><tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${esc(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`; }
function paras(lines) { return lines.map((line) => `<p>${esc(line)}</p>`).join(''); }
function bullets(lines) { return `<ul>${lines.map((line) => `<li>${esc(line)}</li>`).join('')}</ul>`; }
function ordered(lines) { return `<ol>${lines.map((line) => `<li>${esc(line)}</li>`).join('')}</ol>`; }
function formula(text) { return `<div class="codex-formula">${esc(text)}</div>`; }
function note(title, text) { return `<aside class="codex-note"><strong>${esc(title)}</strong><p>${esc(text)}</p></aside>`; }
function sources(paths) { return `<div class="codex-sources">${paths.map((path) => `<code>${esc(path)}</code>`).join('')}</div>`; }
function signed(value) { const number = Math.round(Number(value) || 0); return `${number >= 0 ? '+' : ''}${number}`; }
function yes(value) { return value ? 'Ja' : 'Nein'; }
function byId(id) { const node = document.getElementById(id); if (!node) throw new Error(`Missing codex element: ${id}`); return node; }
function esc(value) { return String(value ?? '').replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]); }
function nameFor(id) { return CAMPAIGN_CHARACTER_BY_ID[id]?.name ?? CHARACTER_VOICES[id]?.name ?? id; }
function currentRank(meta) { return WEEKEND_RANKS.find((rank) => rank.id === meta.weekendRank) ?? WEEKEND_RANKS[0]; }
function rankName(id) { return WEEKEND_RANKS.find((rank) => rank.id === id)?.label ?? id; }
function stageName(id) { return QUEST_STAGES.find((stage) => stage[0] === id)?.[1] ?? id; }
function needName(id) { return NEEDS.find((need) => need[0] === id)?.[1] ?? id; }
function completedActivities(meta) { return ['flipCup', 'beerPong', 'flunkyball', 'maslHole', 'hedgePee'].filter((id) => (meta.miniResults[id]?.attempts ?? 0) > 0 || (id === 'hedgePee' && meta.flags.hedgeRelieved)).length; }
function finaleProgress(meta) { return Math.min(3, completedActivities(meta)) + (meta.flags.ronnyDefeated ? 1 : 0); }
function effectiveness(factor) { return factor >= 1.55 ? 'extreme Schwäche' : factor >= 1.25 ? 'sehr stark' : factor <= 0.72 ? 'schwach' : 'normal'; }
function stageState(id, current) { const order = QUEST_STAGES.map((stage) => stage[0]); return order.indexOf(id) < order.indexOf(current) ? 'Abgeschlossen' : 'Noch nicht aktiv'; }
function responsePools(pool) { return Object.entries(pool).map(([id, lines]) => `<details><summary>${esc(APPROACH[id])}</summary>${paras(lines)}</details>`).join(''); }
function teamStats(member) { return table(['Feld', 'Wert'], [['Level', String(member.level)], ['Entschlossenheit', `${member.resolve}/${member.maxResolve}`], ['Loyalität', String(member.loyalty)], ['Kampf', signed(member.bonuses.battle)], ['Sozial', signed(member.bonuses.social)], ['Spiele', signed(member.bonuses.games)], ['Erholung', signed(member.bonuses.recovery)]]); }
function romanceView(id, profile, snapshot, meta) { const state = meta.romance[id]; return paras([profile.description]) + stats([['Interesse', String(state.interest)], ['Versuche/Erfolge', `${state.attempts}/${state.successes}`], ['Grenzverstöße', String(state.boundaryStrikes)], ['Probe', `${flirtChance(id, snapshot)}/20`]]) + table(['Bereich', 'Wert'], [['Gute Geschenke', profile.preferredGifts.map((item) => ITEMS[item]?.label ?? item).join(' · ')], ['Schlechte Geschenke', profile.dislikedGifts.map((item) => ITEMS[item]?.label ?? item).join(' · ')], ['Bevorzugt', profile.prefers.join(' · ')], ['Lehnt ab', profile.rejects.join(' · ')]]); }
function authorityFlags(flags) { const rows = [['authority-ego-hook', 'Ego gekapert', 'Kumpel/Zustimmung +26 %'], ['authority-gossip-bond', 'Pöbelpakt', 'Witz/Team/Chaos +20 %'], ['authority-drinking-bond', 'Wegbier', 'Getränk +42 %, Konter schwächer'], ['authority-pong-challenge', 'Beer-Pong-Stolz', 'Pong-Duell +52 %'], ['authority-nacken-calibrated', 'Nackenklatscher', 'Nacken/Pöbel +38 %'], ['authority-goodwill', 'Wohlwollen', 'Konter ×0,88, Verdacht langsamer'], ['uli-route-knowledge', 'Routenwissen', 'Patrouillen ×0,76']]; return table(['Flag', 'Name', 'Aktiv', 'Wirkung'], rows.map(([flag, name, effect]) => [flag, name, yes(flags[flag]), effect])); }
function attackText(id, teamSize) { return { 'classic-high-five': '„Passt, Chef“ plus Kumpel-Nackenklatscher.', 'aldi-shirt-show': 'Aldi-Shirt als Sondervollmacht.', 'agree-anyway': 'Beide zu den einzig Vernünftigen erklären.', 'logical-argument': 'Beweisführung auf feuchtem Bierdeckel.', 'dry-counter': 'Nur „Stark, Chef“ antworten.', 'camping-chair-block': 'Bierbank-Sitzblockade.', 'beer-offer': 'Halbes Bier als Friedensvertrag.', 'synchronised-cheer': `${teamSize} Stimmen: „JAWOLL CHEF!“`, 'cup-eye-contact': 'Beer-Pong-Zwangsduell mit Einsatz.', 'total-exaggeration': 'Platzwart-Legendenlüge.' }[id] ?? id; }
function masteryView(id, meta) { const mastery = meta.attackMastery[id]; const next = (mastery?.level ?? 1) === 1 ? `${Math.max(0, 4 - (mastery?.uses ?? 0))} Einsätze / ${Math.max(0, 3 - (mastery?.successes ?? 0))} Treffer bis M2` : (mastery?.level ?? 1) === 2 ? `${Math.max(0, 9 - (mastery?.uses ?? 0))} Einsätze / ${Math.max(0, 7 - (mastery?.successes ?? 0))} Treffer bis M3` : 'Maximum'; return table(['Einsätze', 'Treffer', 'Stufe', 'Zweig', 'Nächstes Ziel'], [[String(mastery?.uses ?? 0), String(mastery?.successes ?? 0), `M${mastery?.level ?? 1}`, branchLabel(mastery?.branch), next]]); }
function statusForNeed(id, statuses) { if (id === 'alcohol') return statuses.find((status) => ['angetrunken', 'betrunken', 'voll'].includes(status.id))?.label ?? 'Kein Alkoholstatus'; if (id === 'highness') return statuses.find((status) => ['breit', 'sehr-breit'].includes(status.id))?.label ?? 'Klar'; if (id === 'hangover') return statuses.find((status) => status.id === 'kater')?.label ?? 'Kein Kater'; if (id === 'energy') return statuses.find((status) => status.id === 'erschoepft')?.label ?? 'Nicht erschöpft'; if (id === 'thirst') return statuses.find((status) => status.id === 'dehydriert')?.label ?? 'Nicht dehydriert'; return 'Kein eigener Schwellenstatus'; }
function itemNote(id) { if (id === 'klopapier') return note('Questfunktion', 'Kann Manni übergeben werden und schaltet Unterstützung frei.'); if (id === 'bier') return note('Zusatz', 'Nutzung: Chaos +1, Momentum +1. Erstes Bier ist Quest.'); if (id === 'batida') return note('Zusatz', 'Nutzung: Chaos +2, Momentum +1. Susi lehnt es ab.'); return ''; }
function synergyView(team) { const synergies = activeTeamSynergies(team); return sections([['Aktive Synergien', synergies.length ? table(['Name', 'Beschreibung', 'Kampf', 'Sozial', 'Spiele', 'Erholung'], synergies.map((synergy) => [synergy.label, synergy.description, signed(synergy.battle), signed(synergy.social), signed(synergy.games), signed(synergy.recovery)])) : paras(['Keine aktive definierte Synergie.'])]]); }
function opponentCard(id, opponent) { return `<article class="codex-opponent"><header><div><span>${esc(id)}</span><h3>${esc(opponent.name)}</h3><p>${esc(opponent.title)}</p></div><b>${opponent.maxFrustration} FRUST</b></header>${table(['Parameter', 'Wert'], [['Eigenschaften', opponent.traits.join(' · ')], ['Grundkonter', String(opponent.baseCounterFrustration)], ['Kontertexte', String(opponent.counterLines.length)]])}<details><summary>Attackenmultiplikatoren</summary>${table(['Attacke', 'Faktor'], Object.entries(opponent.moveMultipliers).map(([move, value]) => [COMBAT_MOVES[move]?.shortLabel ?? move, Number(value).toFixed(2)]))}</details><details><summary>Kategorien</summary>${table(['Tag', 'Faktor'], Object.entries(opponent.tagMultipliers).map(([tag, value]) => [TAGS[tag] ?? tag, Number(value).toFixed(2)]))}</details></article>`; }
function anecdoteCard(anecdote, meta) { const unlocked = meta.unlockedAnecdotes.includes(anecdote.id); const equipped = meta.equippedAnecdotes.includes(anecdote.id); return `<article class="codex-anecdote ${unlocked ? 'unlocked' : 'locked'}"><header><div><span>${anecdote.id}</span><h3>${esc(anecdote.label)}</h3></div><b>${equipped ? 'AUSGERÜSTET' : unlocked ? 'FREI' : 'GESPERRT'}</b></header><p>${esc(anecdote.detail)}</p><small>${esc(anecdote.combatText)}</small></article>`; }
function scoreBreakdown(meta) { const wins = Object.values(meta.miniResults).reduce((sum, result) => sum + result.wins, 0); const perfects = Object.values(meta.miniResults).filter((result) => result.bestQuality === 'perfect').length; const romance = Object.values(meta.romance).reduce((sum, state) => sum + Math.max(0, state.interest), 0); const relationships = Object.values(meta.relationshipBonus).reduce((sum, value) => sum + value, 0); const mastery = Object.values(meta.attackMastery).reduce((sum, state) => sum + ((state?.level ?? 1) - 1) * 5, 0); return table(['Quelle', 'Berechnung', 'Beitrag'], [['Einlass', yes(meta.authorityBattleWon), meta.authorityBattleWon ? '25' : '0'], ['Strom', yes(meta.powerConnected), meta.powerConnected ? '10' : '0'], ['Erstes Bier', yes(meta.firstBeerOpened), meta.firstBeerOpened ? '10' : '0'], ['Finale', yes(meta.finalBattleWon), meta.finalBattleWon ? '40' : '0'], ['Siege', `${wins}×12`, String(wins * 12)], ['Perfekt', `${perfects}×8`, String(perfects * 8)], ['Anekdoten', `${meta.unlockedAnecdotes.length}×5`, String(meta.unlockedAnecdotes.length * 5)], ['Meisterschaft', '5 je Stufe', String(mastery)], ['Romanzen', `${romance}×0,18`, (romance * 0.18).toFixed(1)], ['Beziehungen', `${relationships}×0,12`, (relationships * 0.12).toFixed(1)], ['Erleichterung', `${meta.reliefCount}×3`, String(meta.reliefCount * 3)], ['Verdacht', `${meta.suspicion}×−0,15`, (-meta.suspicion * 0.15).toFixed(1)]]); }
function kindName(kind) { return { story: 'Story-Interaktionen', service: 'Versorgung und Ruhe', minigame: 'Minispielorte', landmark: 'Orientierungsorte' }[kind]; }
function kindDescription(kind) { return { story: 'Lineare Ankunftsquest.', service: 'Stabilisierung und Menüs.', minigame: 'Minispiel oder Frustduell.', landmark: 'Treffpunkt und Orientierung.' }[kind]; }
function codexShell() { return `<section id="campaign-codex" class="modal codex-modal" hidden><article class="codex-window"><header class="codex-header"><div><span>SPIEL-CODEX · LIVE AUS DEN SYSTEMDATEN</span><h2>Tales of the Blaue Adria</h2><p id="codex-category-copy"></p></div><button id="codex-close" class="modal-x" type="button" aria-label="Codex schließen">×</button></header><div class="codex-tools"><label><span>Alles durchsuchen</span><input id="codex-search" type="search" placeholder="Charakter, Attacke, Wert, Flag oder Regel …" autocomplete="off"></label><b id="codex-count"></b></div><nav id="codex-tabs" class="codex-tabs"></nav><div class="codex-body"><aside id="codex-entry-list" class="codex-entry-list"></aside><main id="codex-detail" class="codex-detail"></main></div></article></section>`; }

mountCampaignCodex();
