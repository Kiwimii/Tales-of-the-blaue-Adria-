import { COMBAT_MOVES, MAX_EQUIPPED_ATTACKS } from '../../game/combatMoves';
import { ITEMS, QUESTS } from '../../game/content';
import { FRIEND_PROFILES, FRIEND_TEAM_MEMBERS, activeTeamSynergies } from '../../game/friendRoster';
import { ROMANCE_PROFILES, flirtChance } from '../../game/socialSystem';
import { GameStore, STORAGE_KEY } from '../../game/state/GameStore';
import { activeStatuses, statusModifiers } from '../../game/statusSystem';
import { CAMPAIGN_CHARACTER_BY_ID, ALL_INTERACTIONS } from './content';
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

const TAG_LABELS = {
  rapport: 'Kumpelkontakt', style: 'Stil/Fremdscham', submission: 'Zustimmung/Leerlauf', logic: 'Logik',
  wit: 'Trockener Witz', guard: 'Verteidigung', drink: 'Getränkeritual', team: 'Gruppe',
  charm: 'Charme/Spiel', chaos: 'Chaos/Übertreibung',
};

const APPROACH_LABELS = { listen: 'Zuhören', joke: 'Humor', challenge: 'Herausfordern', help: 'Helfen/Planen' };

const BATTLE_STATUS = {
  ueberrumpelt: ['Überrumpelt', 'Der Gegner gilt als geöffnet; die nächste Attacke erhält +6 Genauigkeit.'],
  fremdschaemen: ['Fremdschämen', 'Stil-Attacken verursachen zusätzlich 8 Frust.'],
  leerlauf: ['Leerlauf', 'Der Gegner kontert nicht; Witz- und Zustimmungsattacken verursachen zusätzlich 7 Frust.'],
  unterbrochen: ['Unterbrochen', 'Der betroffene Kämpfer verliert den Gegenzug. Beim Spieler sinkt zusätzlich die Genauigkeit um 9.'],
  abgesichert: ['Abgesichert', 'Eingehender Konter wird mit 0,62 multipliziert.'],
  verwirrt: ['Verwirrt', 'Der Gegner gilt als geöffnet; die nächste Attacke erhält +6 Genauigkeit.'],
  fokussiert: ['Fokussiert', 'Die eigene Genauigkeit steigt um 8.'],
  fixiert: ['Fixiert', 'Der Gegner gilt als geöffnet; die nächste Attacke erhält +6 Genauigkeit.'],
};

const NEED_DOCS = [
  ['energy', 'Energie', '100 ist gut; 0 ist erschöpft.', ['Unter 30 entsteht PLATT.', 'Niedrige Energie reduziert Bewegung, Verteidigung, Genauigkeit und Charme.', '60 Minuten Ruhe geben 43 Energie und 4 Mut zurück, kosten aber Zeit.']],
  ['hunger', 'Hunger', '0 ist satt; 100 ist kritisch.', ['Würste senken Hunger um 36.', 'Chips senken Hunger um 18 und erhöhen Durst um 8.', 'Der Wert steigt mit der Zeit und macht Versorgung langfristig notwendig.']],
  ['thirst', 'Durst', '0 ist versorgt; 100 ist dehydriert.', ['Ab 72 entsteht DURST.', 'DURST kostet 5 bis 13 Genauigkeit und erhöht den Energieverbrauch.', 'Wasser senkt Durst um 30 und erhöht die Blase um 12.']],
  ['bladder', 'Blase', '0 ist leer; 100 ist Notfall.', ['Getränke erhöhen den Wert.', 'Die Toilette setzt den Wert in 5 Minuten auf 0.', 'Ab 88 bringt ein rechtzeitiger Toilettengang zusätzlich 2 Würde und 3 Momentum.']],
  ['alcohol', 'Alkohol', '0 ist nüchtern; 100 ist Vollpegel.', ['14–37: PEGEL, Kraft ×1,10, Genauigkeit −6, Charme +3, Flirt +2.', '38–67: BESOFFEN, Kraft ×1,20, Genauigkeit −16, Verteidigung ×0,92.', 'Ab 68: VOLL, Kraft ×1,34, Genauigkeit −29, Verteidigung ×0,82, Bewegung ×0,88.', 'Mittlerer Pegel stärkt passende Rituale gegen Gundula/Uli; ab 76 wird diese Sonderwirkung wieder schwächer.']],
  ['highness', 'Breit', '0 ist klar; 100 ist sehr breit.', ['Ab 30: BREIT, +210 ms Reaktionsverzögerung und −5 Genauigkeit.', 'Ab 70: SEHR BREIT, +430 ms, −12 Genauigkeit und Bewegung ×0,82.', 'Chaos-Proben erhalten bei mindestens 30 Breit einen Bonus.']],
  ['hangover', 'Kater', '0 ist frisch; 100 ist maximaler Kater.', ['Ab 28 entsteht KATER.', 'Kater erhöht Energieverbrauch und senkt Genauigkeit, Charme, Flirt und Verteidigung.', 'Kaffee senkt Kater um 5; die Kopfschmerztablette um 38.']],
  ['courage', 'Mut', '100 ist selbstbewusst; 0 ist verunsichert.', ['Erfolgreiche soziale Aktionen und Getränke können Mut erhöhen.', 'Fehlschläge und öffentliche Entdeckung können Mut senken.', 'Der Wert fließt in Herausforderungen des gemeinsamen Basissystems ein.']],
];

const MINIGAMES = [
  {
    id: 'flipCup', title: 'Flip Cup', subtitle: 'Vier Becher, ein gemeinsames Nervensystem',
    objective: 'Vier Figuren trinken und flippen nacheinander, bevor der Gegner seine vier Stationen beendet.',
    controls: ['AKTION/Leertaste halten: trinken.', 'Nach dem Leeren sofort loslassen.', 'Becher an den optimalen Tischüberstand ziehen.', 'Vom unteren Becherrand nach oben wischen.'],
    phases: ['drink: Flüssigkeit leeren und Reaktionszeit messen.', 'place: Überstand bestimmen.', 'flip: Wischimpuls erfassen.', 'flight: Flug, Rotation und Landung simulieren.'],
    rules: ['Gegnerfortschritt/ms: (0,000029 + Position×0,0000027) × Schwierigkeit; René multipliziert mit 0,88.', 'Ab 700 ms Weiterhalten nach LEER gilt der Becher als verschüttet.', 'Loslassen bis 360 ms gilt als perfekte Reaktion.', 'Normaler Platzierungsbereich 0,085; mit Lars 0,14.', 'Landetoleranz = (0,43 + Platzierungswert×0,12 + 0,05 beim ersten Versuch) ÷ Schwierigkeit.', 'Jede Figur besitzt eigene Trinkrate, Kontrolle und idealen Überstand.'],
    score: ['Wert = 100 − Gegner×11 − Fehler×7 + perfekte Flips×9 + perfekte Reaktionen×4 + beste Serie×3.'],
    quality: ['Perfekt: mindestens 3 perfekte Flips, 0 Fehler und mindestens 3 perfekte Reaktionen.', 'Solide: Sieg mit höchstens 2 Fehlern.', 'Chaotisch: anderer Sieg.', 'Gescheitert: Gegner beendet zuerst.'],
    rewards: ['Sieg lernt den Bierbank-Chor „JAWOLL CHEF!“.', 'Perfekt schaltet „Alle gleichzeitig“ frei.', 'Sieg verändert Alkohol, Blase, Mut, Ruf, Momentum und Beziehungen der Staffel.'],
    assists: [['assist-flip-edge', 'Lars', 'Erweitert den Überstandsbereich auf 0,14.'], ['assist-team-shout', 'René', 'Verlangsamt den Gegner auf 88 %.']],
    source: 'src/lpc-main/campaign/minigamesV2.ts · tickFlip / completeFlip',
  },
  {
    id: 'beerPong', title: 'Beer Pong', subtitle: 'Flugbahn, Risiko und Redemption',
    objective: 'Zehn Becher vor dem Gegner abräumen. Bounce kann zwei Becher entfernen, darf aber abgewehrt werden.',
    controls: ['Ball berühren und zurückziehen.', 'Loslassen startet die Flugbahn.', 'AKTION wechselt DIREKT/BOUNCE.'],
    phases: ['ready: Wurf vorbereiten.', 'flight: Schwerkraft, Tischkontakt und Treffer simulieren.', 'redemption: Jeder Treffer hält die letzte Chance am Leben; ein Fehlschuss beendet sie.'],
    rules: ['Gegnerzug alle 4.300 Schwierigkeitseinheiten.', 'Gegnerische Trefferchance = 0,62 + (Schwierigkeit−1)×0,25.', 'Trefferradius 0,064 beim ersten Versuch, danach 0,057.', 'Bounce-Abwehr 0,24×Schwierigkeit; mit Susi 0,12.', 'Ein Bounce-Treffer entfernt nach Möglichkeit zwei Becher.', 'Automatische Re-Racks bei 6, 3 und 1 Becher.', 'Redemption ab 7 eigenen Treffern oder mit Felix-Hilfe.'],
    score: ['Wert = Treffer×13 − Fehlwürfe×3 + Bounce-Doppeltreffer×10 + beste Serie×4 + Redemption-Treffer×6.'],
    quality: ['Perfekt: Sieg, höchstens 1 Fehlwurf und mindestens 1 Bounce.', 'Solide: Sieg mit höchstens 4 Fehlwürfen.', 'Chaotisch: anderer Sieg.', 'Gescheitert: Gegner zuerst oder Redemption verfehlt.'],
    rewards: ['Sieg lernt das Beer-Pong-Zwangsduell.', 'Perfekt schaltet „Über Bande“ frei.', 'Sieg verändert Alkohol, Blase, Mut, Ruf, Momentum und Beziehungen zu Susi/Felix.'],
    assists: [['partner-susi-pong', 'Susi', 'Verlangsamt den Gegner und senkt Bounce-Abwehr.'], ['assist-pong-redemption', 'Felix', 'Sichert Redemption auch unter 7 Treffern.'], ['assist-precision', 'Gregor', 'Zeigt eine Flugbahnprognose.']],
    source: 'src/lpc-main/campaign/minigamesV2.ts · tickPong / finishPong',
  },
  {
    id: 'flunkyball', title: 'Flunkyball', subtitle: 'Werfen, trinken, retten, STOPP',
    objective: 'Mittelflasche treffen, trinken und in der Verteidigung Flasche, Ball und Linie rechtzeitig bedienen.',
    controls: ['Ball zurückziehen und werfen.', 'Nach Treffer AKTION halten.', 'Bei STOPP sofort loslassen.', 'In der Verteidigung Ziel antippen und an Flasche/Ball/Linie AKTION drücken.'],
    phases: ['attack-throw: Zielwurf.', 'attack-drink: trinken bis STOPP.', 'defense-run: Flasche aufstellen.', 'defense-ball: Ball holen.', 'defense-return: Linie erreichen und STOPP.'],
    rules: ['Zielvektor x=0,02/y=0,38.', 'Toleranz = (0,18 + 0,045 Präzisionshilfe + 0,035 erster Versuch) ÷ Schwierigkeit.', 'Trinken +0,00255/ms.', 'Stoppsignal bei Verteidigerfortschritt 1; dieser wächst 0,00019×Schwierigkeit/ms.', 'Sauberes Loslassfenster 310 ms, mit Jule 430 ms.', 'Ab 650 ms Weitertrinken: Foul und −14 Trinkfortschritt.', 'Laufgeschwindigkeit 0,00023/ms, mit Danny ×1,22.', 'Nach Runde 8 entscheidet der höhere Trinkfortschritt.'],
    score: ['Regulärer Sieg = 100 + Treffer×12 + Stopqualität + perfekte Verteidigung×12 − 18 bei Foul.', 'Zeitentscheidung = eigener Fortschritt − Gegner + 70.'],
    quality: ['Perfekt: ≥3 Treffer, kein Foul, Stopqualität ≥40, ≥1 perfekte Verteidigung.', 'Solide: Sieg mit ≥2 Treffern.', 'Chaotisch: anderer Sieg.', 'Gescheitert: Gegner leert zuerst.'],
    rewards: ['Sieg lernt die Platzwart-Legendenlüge.', 'Perfekt schaltet „STOPP heißt Stopp“ frei.', 'Sieg verändert Energie, Durst, Alkohol, Blase, Mut, Ruf, Momentum und Beziehungen.'],
    assists: [['assist-flunky-sprint', 'Danny', 'Laufgeschwindigkeit +22 %.'], ['partner-jule-flunky', 'Jule', 'Stoppruf-Fenster 430 statt 310 ms.']],
    source: 'src/lpc-main/campaign/minigamesV2.ts · tickFlunky / endFlunkyRound',
  },
  {
    id: 'hedgePee', title: 'In die Hecke', subtitle: 'Deckung, Wind und Beweislage',
    objective: 'Blase leeren, ohne Blickkegel und ohne sichtbare Beweise außerhalb der Deckung.',
    controls: ['Stelle antippen.', 'AKTION halten.', 'Horizontal zielen.', 'Loslassen, um Verdacht abzubauen.'],
    phases: ['choose: naher Busch, tiefe Hecke oder Taucherzelt.', 'active: Fortschritt, Wind, Blicke, Beweise, Geräusch und Verdacht kontrollieren.'],
    rules: ['Nah: Fortschritt 0,00325/ms, wenig Deckung.', 'Tief: 0,00245/ms, Toleranz 0,16, stärkster Wind.', 'Zelt: 0,00272/ms, mittlere Deckung, sozial teure Beweise.', 'Ulis Routenwissen: Patrouillen ×0,76.', 'Gundulas Wohlwollen: Verdachtsaufbau ×0,75.', 'Verdacht +0,0115×Gefahren×Wohlwollen/ms.', 'Außerhalb der Hecke Beweise +0,0032/ms.', 'Loslassen baut Verdacht mit 0,0017×Wohlwollen/ms ab.', '100 Verdacht bedeutet Entdeckung.'],
    score: ['Erfolg = 116 − Verdacht − Beweise − Geräusch.', 'Entdeckung = Fortschritt − Beweise − Geräusch.'],
    quality: ['Perfekt: Verdacht <14, Beweise <7, Unterbrechungen <1,4.', 'Solide: Erfolg mit Verdacht <42.', 'Chaotisch: anderer Erfolg.', 'Gescheitert: 100 Verdacht.'],
    rewards: ['Perfekt schaltet „Die Hecke schweigt“ frei.', 'Entdeckung schaltet „Gundula hat es notiert“ frei.', 'Erfolg leert die Blase; Entdeckung kostet Würde und Beziehungen.'],
    assists: [['uli-route-knowledge', 'Uli', 'Patrouillen 24 % langsamer.'], ['authority-goodwill', 'Gundula', 'Verdachtsaufbau 25 % langsamer.']],
    source: 'src/lpc-main/campaign/minigamesV2.ts · chooseHedgeSpot / tickHedge',
  },
  {
    id: 'maslHole', title: 'Komm ans Loch', subtitle: 'Abdichtung, Atemrhythmus und Wirkung',
    objective: 'Mit zwei Händen abdichten und drei kontrollierte Züge im richtigen Atemfenster ausführen.',
    controls: ['Zwei Finger führen beide Hände.', 'Mit Maus Hände nacheinander ziehen.', 'Bei stabiler Abdichtung AKTION drücken.', 'Im hellen Atemfenster halten und rechtzeitig loslassen.'],
    phases: ['seal: Handabstand, Höhe und Zentrum stabilisieren.', 'pull: Abdichtung, Rhythmus, Wirkung, Lecks und Husten kontrollieren.', 'Drei Runden mit zunehmender Drift.'],
    rules: ['Optimaler Handabstand 0,22.', 'Startschwelle 0,64; erster Versuch 0,59; mit Masl 0,55.', 'Abdichtung länger als 450 ms stabil halten.', 'Ideales Atemzentrum 0,72; Rhythmusfaktor 0,25–1.', 'Wirkung +0,00305×Abdichtung×Rhythmus/ms.', 'Guter Zug: Wirkung 48–84, Abdichtung ≥0,54, Rhythmusqualität >450.', 'Nach jedem Zug Husten nur −8 und Drift steigt.'],
    score: ['Guter Zug = 72 + Abdichtung×24 − |66−Wirkung|×0,48 − Lecks + bis 10 Rhythmus.', 'Gesamterfolg ab 175 Punkten.'],
    quality: ['Perfekt: ≥255 Punkte und Husten <55.', 'Solide: ≥175.', 'Chaotisch: 120–174.', 'Gescheitert: <120.'],
    rewards: ['Perfekt schaltet „Masls Tunnel“ frei.', 'Erfolg gibt Breit +42, Energie −8, Mut +6, Ruf, Momentum und Masl-Beziehung.', 'Fehlschlag gibt dennoch Breit +20.'],
    assists: [['assist-masl-seal', 'Masl', 'Schwelle auf 0,55 und breiterer stabiler Bereich.']],
    source: 'src/lpc-main/campaign/minigamesV2.ts · tickMasl / completeMaslPull',
  },
];

const QUEST_STAGES = [
  ['arrival', 'Ankunft ohne Plan B', 'Kofferraum öffnen.', 'trunk', 'Wechselt zur Reservierungssuche.'],
  ['reservation', 'Wer lesen kann, parkt später', 'Reservierung finden.', 'reservationBoard', 'Schaltet Gundula/Uli frei.'],
  ['authority', 'Verwaltung im Doppelpack', 'Einlassfrustkampf gewinnen.', 'gundula', 'Schranke, 25 Punkte, Aldi-Shirt-Offensive.'],
  ['gate-open', 'Zum Taucherplatz', 'Zum Fahrzeug gehen.', 'taucherplatz', 'Aktiviert Stromaufbau.'],
  ['power', 'Strom oder Zivilisationsabbruch', 'Strom verbinden.', 'powerBox', '10 Punkte und Ausladen.'],
  ['unload', 'Ausladen ohne Bandscheibenvorfall', 'Getränke, Zelte, Kabel.', 'drinks/tents/cable', 'Schaltet erstes Bier frei.'],
  ['first-beer', 'Rituelle Inbetriebnahme', 'Erstes Bier öffnen.', 'firstBeer', '10 Punkte, Biervertrag, Freundessuche.'],
  ['reunion', 'Finde die Problemträger', 'Freunde finden und Team bilden.', 'andre', 'Wechselt ins freie Wochenende.'],
  ['free-weekend', 'Freies Wochenende', 'Spiele, Beziehungen, Ronny und Fortschritt.', 'campfire', 'Drei Aktivitäten plus Ronny öffnen Finale.'],
  ['sunday-final', 'Sonntagsabnahme', 'Abschlussprotokoll gewinnen.', 'noticeBoard', '40 Punkte und Abschluss.'],
  ['complete', 'Abreise mit Restwürde', 'Verbleibende Zeit frei nutzen.', 'campfire', 'Kampagne abgeschlossen.'],
];

const REGIONS = [
  ['arrival', 'Ankunft und Rezeption', 'Schranke, Reservierung, Gundula/Uli'],
  ['north', 'Adria-Klause und Nordplätze', 'Dauerplätze und nördliche Wege'],
  ['central', 'Taucherplatz und Sanitär', 'Eigenes Lager, Strom, Sanitär, Hecke'],
  ['festival', 'Festwiese', 'Beer Pong, Bühne, Party'],
  ['woodland', 'Servicehof und Waldsaum', 'Werkstatt, Holzlager, ruhige Wege'],
  ['beach', 'Strand und Hauptsteg', 'Flunkyball und Wasser'],
  ['cove', 'Ruhige Bucht', 'Unterstand und abgelegener Steg'],
];

let mounted = false;
let category = 'overview';
let selectedId = 'overview-flow';
let search = '';

export function mountCampaignCodex() {
  if (mounted) return;
  const game = document.getElementById('campaign-game');
  const nav = game?.querySelector('.topbar nav');
  if (!game || !nav) { window.setTimeout(mountCampaignCodex, 50); return; }
  mounted = true;

  const button = document.createElement('button');
  button.id = 'open-codex';
  button.type = 'button';
  button.textContent = 'Codex';
  button.title = 'Spiel-Codex öffnen (C)';
  nav.prepend(button);
  document.getElementById('app')?.insertAdjacentHTML('beforeend', shell());

  const modal = byId('campaign-codex');
  const input = byId('codex-search');
  button.addEventListener('click', open);
  byId('codex-close').addEventListener('click', close);
  modal.addEventListener('click', (event) => { if (event.target === modal) close(); });
  input.addEventListener('input', () => { search = input.value.trim().toLocaleLowerCase('de'); render(); });
  byId('codex-tabs').addEventListener('click', (event) => {
    const target = event.target.closest?.('[data-codex-category]');
    if (!target) return;
    category = target.dataset.codexCategory;
    search = '';
    input.value = '';
    selectedId = entries().find((item) => item.category === category)?.id ?? selectedId;
    render();
  });
  byId('codex-entry-list').addEventListener('click', (event) => {
    const target = event.target.closest?.('[data-codex-entry]');
    if (!target) return;
    selectedId = target.dataset.codexEntry;
    render();
    if (matchMedia('(max-width: 820px)').matches) byId('codex-detail').scrollIntoView({ block: 'start', behavior: 'smooth' });
  });
  addEventListener('keydown', (event) => {
    if (event.target?.matches?.('input,textarea,select,[contenteditable="true"]')) return;
    if (event.key === 'Escape' && !modal.hidden) { event.preventDefault(); close(); }
    if (event.key.toLocaleLowerCase('de') === 'c' && modal.hidden && !document.querySelector('.modal:not([hidden])')) { event.preventDefault(); open(); }
  });
  addEventListener('lpc-campaign-meta', () => { if (!modal.hidden) render(); });
  render();
}

function open() {
  byId('campaign-codex').hidden = false;
  document.body.classList.add('campaign-modal-open', 'campaign-codex-open');
  const prompt = document.getElementById('interaction-prompt');
  if (prompt) prompt.hidden = true;
  render();
  setTimeout(() => byId('codex-search').focus(), 0);
}

function close() {
  byId('campaign-codex').hidden = true;
  document.body.classList.remove('campaign-codex-open');
  if (!document.querySelector('.modal:not([hidden])')) document.body.classList.remove('campaign-modal-open');
}

function render() {
  const all = entries();
  const filtered = all.filter((item) => search ? item.search.includes(search) : item.category === category);
  if (!filtered.some((item) => item.id === selectedId)) selectedId = filtered[0]?.id ?? all[0]?.id;
  const selected = all.find((item) => item.id === selectedId) ?? filtered[0];
  const current = CATEGORIES.find(([id]) => id === category) ?? CATEGORIES[0];

  byId('codex-tabs').innerHTML = CATEGORIES.map(([id, icon, label]) => `<button type="button" data-codex-category="${id}" class="${category === id ? 'active' : ''}"><i>${icon}</i><span>${esc(label)}</span><b>${all.filter((item) => item.category === id).length}</b></button>`).join('');
  byId('codex-category-copy').textContent = search ? `Suche über den vollständigen Codex: „${search}“` : current[3];
  byId('codex-count').textContent = `${filtered.length} Einträge`;
  byId('codex-entry-list').innerHTML = filtered.length ? filtered.map((item) => `<button type="button" data-codex-entry="${item.id}" class="${item.id === selected?.id ? 'active' : ''}"><span>${esc(item.title)}</span><small>${esc(item.subtitle)}</small>${item.badge ? `<b>${esc(item.badge)}</b>` : ''}</button>`).join('') : '<p class="codex-empty">Keine Einträge gefunden.</p>';
  byId('codex-detail').innerHTML = selected?.html() ?? '<p class="codex-empty">Kein Eintrag.</p>';
}

function entries() {
  const base = new GameStore({ getItem: (key) => localStorage.getItem(key === STORAGE_KEY ? STORAGE_KEY : key), setItem() {}, removeItem() {} }).snapshot();
  const meta = campaignMeta.snapshot();
  const snapshot = campaignMeta.augmentSnapshot(base);
  return [
    ...overviewEntries(snapshot, meta), ...characterEntries(snapshot, meta), ...attackEntries(meta),
    ...combatEntries(snapshot, meta), ...minigameEntries(meta), ...statusEntries(snapshot),
    ...itemEntries(snapshot), ...questEntries(meta), ...progressionEntries(meta), ...worldEntries(snapshot),
  ];
}

function overviewEntries(snapshot, meta) {
  return [
    make('overview-flow', 'overview', 'Spielablauf', 'Vom Intro bis zur Sonntagsabnahme', 'Kampagne Tutorial Supermarkt Einlass Finale', () => page('SPIELSTRUKTUR', 'Spielablauf', 'Ein zusammenhängendes Campingwochenende, in dem jede Entscheidung Zustände, Beziehungen und das Finale verändert.', stats([['Stufe', stageName(meta.questStage)], ['Zeit', `Tag ${snapshot.day} · ${snapshot.clockLabel}`], ['Ziel', campaignMeta.objective().title], ['Wochenendwert', `${meta.weekendScore} · ${rankName(meta.weekendRank)}`]]) + sections([
      ['1. Intro und Profil', paras(['Variable Einleitung, danach Name, Körper, Haare, Accessoire, Farben und Eigenschaft wählen.'])],
      ['2. Einkauf', paras(['Startbudget 25 €. Mindestens ein Gegenstand; Maximalmengen und konkrete Wirkungen gelten direkt.'])],
      ['3. Ankunft', ordered(['Kofferraum.', 'Reservierung.', 'Gundula/Uli.', 'Taucherplatz.', 'Strom.', 'Ausladen.', 'Erstes Bier.'])],
      ['4. Freies Wochenende', paras(['Charaktere finden, Team bilden, Minispiele spielen, Ronny besiegen, Attacken und Anekdoten entwickeln.'])],
      ['5. Finale', paras(['Drei unterschiedliche Aktivitäten plus Ronny öffnen die Sonntagsabnahme.'])],
      ['Codequellen', sources(['src/lpc-main/campaign/app.ts', 'src/lpc-main/campaign/metaStore.ts', 'src/game/state/GameStore.ts'])],
    ]))),
    make('overview-controls', 'overview', 'Steuerung', 'Tastatur, Maus und Touch', 'WASD Pfeile E Leertaste C Joystick', () => page('BEDIENUNG', 'Steuerung', 'Welt, Dialoge und Minispiele sind mobil und mit Tastatur bedienbar.', sections([
      ['Welt', table(['Eingabe', 'Funktion'], [['WASD/Pfeile', 'Bewegen; diagonale Bewegung wird normalisiert.'], ['E/Leertaste', 'Interagieren.'], ['Q', 'Winken.'], ['C', 'Codex öffnen.']])],
      ['Mobil', paras(['Unsichtbarer dynamischer Analogstick links; kontextabhängige Aktionstaste rechts.'])],
      ['Modalregel', paras(['Während Codex, Dialog, Kampf oder Minispiel sperrt campaign-modal-open die Weltbewegung.'])],
      ['Codequellen', sources(['src/lpc-main/campaign/worldScene.ts', 'src/lpc-main/campaign/mobileControls.ts'])],
    ]))),
    make('overview-save', 'overview', 'Speicherung', 'Zwei lokale Speicherstände', 'localStorage save attack ids compatibility', () => page('TECHNIK', 'Speicherung und Kompatibilität', 'Der Browser speichert Basisspiel und Kampagnenmetadaten lokal.', table(['Bereich', 'Schlüssel'], [['Basisspiel', STORAGE_KEY], ['Kampagne', 'tales-blaue-adria-lpc-campaign-meta-v2'], ['Introvariante', 'tales-adria-intro-variant-v2']]) + note('Kompatibilität', 'Technische Attacken-IDs bleiben stabil. Namen, Texte und Balancing können geändert werden, ohne alte Speicherstände zu zerstören.') + sources(['src/game/state/GameStore.ts', 'src/lpc-main/campaign/metaStore.ts']))),
    make('overview-profile', 'overview', 'Spielerprofil', snapshot.profile ? `${snapshot.profile.name} · ${snapshot.profile.trait}` : 'Noch nicht erstellt', 'hilfsbereit beobachtend chaotisch direkt charmant', () => page('SPIELERFIGUR', 'Eigenschaften', 'Eigenschaften geben charaktergerechten Gesprächsansätzen Zusatzpunkte.', stats([['Name', snapshot.profile?.name ?? '–'], ['Eigenschaft', snapshot.profile?.trait ?? '–'], ['Körper', snapshot.profile?.bodyType ?? '–'], ['Frisur', snapshot.profile?.hairStyle ?? '–']]) + table(['Eigenschaft', 'Aktuelle feste Wirkung'], [['Hilfsbereit', '+2 bei erfolgreichem Helfen/Planen.'], ['Beobachtend', '+1 bei erfolgreichem Zuhören.'], ['Chaotisch', '+1 bei erfolgreichem Humor; kreative Romanzen können profitieren.'], ['Direkt', '+1 bei erfolgreicher Herausforderung.'], ['Charmant', 'Aktuell kein eigener fester Bonus im charakterbasierten Resolver.']]) + note('Verfeinerungspunkt', 'Charmant ist mechanisch schwächer angebunden als die anderen Eigenschaften.')),
  ];
}

function characterEntries(snapshot, meta) {
  const order = ['gundula','uli','ronny','manni','andre','rene','lars','danny','gregor','masl','schubert','felix','schima','susi','jule','kira'];
  return Object.values(CHARACTER_VOICES).sort((a,b) => order.indexOf(a.id)-order.indexOf(b.id)).map((voice) => {
    const friend = FRIEND_PROFILES[voice.id];
    const romance = ROMANCE_PROFILES[voice.id];
    const visual = CAMPAIGN_CHARACTER_BY_ID[voice.id];
    const relation = snapshot.relationships[voice.id] ?? 0;
    const active = meta.activeTeam.includes(voice.id);
    const met = Boolean(snapshot.flags[`met-${voice.id}`]) || (meta.conversationCounts[voice.id] ?? 0) > 0;
    const searchText = [voice.name, voice.role, voice.cadence, ...voice.values, ...voice.irritants, friend?.biography, romance?.description].filter(Boolean).join(' ');
    return make(`character-${voice.id}`, 'characters', voice.name, voice.role, searchText, () => page(visual?.role ?? 'CHARAKTER', voice.name, voice.cadence,
      stats([['Status', active ? 'Aktiver Begleiter' : met ? 'Kennengelernt' : 'Unbekannt'], ['Beziehung', signed(relation)], ['Gespräche', String(meta.conversationCounts[voice.id] ?? 0)], ['Portrait', voice.portrait]]) + sections([
        ['Persönlichkeit', table(['Feld','Inhalt'], [['Rolle',voice.role],['Sprechweise',voice.cadence],['Werte',voice.values.join(' · ')],['Reizpunkte',voice.irritants.join(' · ')],['Mag',voice.likes.map((id)=>APPROACH_LABELS[id]).join(' · ')],['Mag nicht',voice.dislikes.map((id)=>APPROACH_LABELS[id]).join(' · ')||'Keine feste Abneigung']])],
        ...(friend ? [['Freundesprofil', table(['Feld','Inhalt'], [['Archetyp',friend.archetype],['Biografie',friend.biography],['Stärken',friend.strengths.join(' · ')],['Schwächen',friend.weaknesses.join(' · ')],['Themen',friend.topics.join(' · ')],['Cannabis',friend.likesCannabis?'Ja':'Nein'],['Alkoholtoleranz',friend.alcoholTolerance],['Rekrutierung',`ab ${friend.recruitmentThreshold} Beziehung und erstem Treffen`],['Feldsatz',friend.fieldLine]])]] : []),
        ...(friend && FRIEND_TEAM_MEMBERS[voice.id] ? [['Teamwerte', teamStats(FRIEND_TEAM_MEMBERS[voice.id])]] : []),
        ...(romance ? [['Romanze', romanceView(voice.id, romance, snapshot, meta)]] : []),
        ['Dialogoptionen', voice.choices.map((choice)=>`<article class="codex-choice"><header><strong>${esc(choice.label)}</strong><span class="risk-${choice.risk}">${choice.risk.toUpperCase()}</span></header><p>${esc(choice.hint)}</p><small>${esc(choice.topic)} · ${esc(APPROACH_LABELS[choice.approach])}</small></article>`).join('')],
        ['Positive Reaktionen', responsePools(voice.positive)], ['Negative Reaktionen', responsePools(voice.negative)],
        ['Persönliche Enthüllung', paras([voice.personalReveal])],
        ['Dauerhafte Spielwirkung', paras([voice.assistLabel ?? 'Keine eigene Assistenz.', `Flag: ${voice.consequenceFlag ?? 'keins'}`])],
        ...(COMPANION_ACTIONS[voice.id] ? [['Begleiteraktion', table(['Name','Wirkung','Kosten'], [[COMPANION_ACTIONS[voice.id].label,COMPANION_ACTIONS[voice.id].detail,`${COMPANION_ACTIONS[voice.id].momentum} Momentum`]])]] : []),
        ['Visual', table(['Feld','Wert'], [['Outfit',visual?.outfit??'–'],['Frisur',visual?.hairStyle??'–'],['Accessoires',visual?.accessories?.join(' · ')??'–'],['Idle',visual?.idleAnimation??'–'],['Begrüßung',visual?.greetingAnimation??'–'],['Welttext',visual?.dialogue??'–']])],
        ...(['gundula','uli'].includes(voice.id) ? [['Manipulationsmarker', authorityFlags(meta.flags)]] : []),
        ['Codequellen', sources(['src/lpc-main/campaign/characterVoices.ts', friend?'src/game/friendRoster.ts':'', romance?'src/game/socialSystem.ts':'', 'src/lpc-main/content.ts', ['gundula','uli'].includes(voice.id)?'src/lpc-main/campaign/authorityOverhaul.ts':''].filter(Boolean))],
      ])), active ? 'AKTIV' : met ? `BEZ. ${signed(relation)}` : 'UNBEKANNT');
  });
}

function attackEntries(meta) {
  return Object.values(COMBAT_MOVES).map((move) => {
    const learned = meta.learnedAttacks.includes(move.id);
    const equipped = meta.equippedAttacks.includes(move.id);
    const mastery = meta.attackMastery[move.id];
    return make(`attack-${move.id}`, 'attacks', move.label, `${TAG_LABELS[move.tag]} · ${move.accuracy}%`, [move.label,move.shortLabel,move.description,move.unlockTitle,move.unlockDetail,move.id].join(' '), () => page('FRUSTATTACKE', move.label, move.description,
      stats([['Technische ID',move.id],['Kategorie',TAG_LABELS[move.tag]],['Grundfrust',String(move.baseFrustration)],['Genauigkeit',`${move.accuracy}%`],['Status',equipped?'Ausgerüstet':learned?'Gelernt':'Gesperrt'],['Meisterschaft',`M${mastery?.level??1} · ${branchLabel(mastery?.branch)}`]]) + sections([
        ['Exakte Wirkung', table(['Parameter','Wert'], [['Grundfrust',String(move.baseFrustration)],['Genauigkeit',`${move.accuracy}%`],['Tag',`${move.tag} · ${TAG_LABELS[move.tag]}`],['Selbstentlastung',move.selfRelief?String(move.selfRelief):'Keine'],['Schutzfaktor',move.guardMultiplier?String(move.guardMultiplier):'Keiner'],['Status',move.status?`${move.status.target}: ${BATTLE_STATUS[move.status.id]?.[0]??move.status.id}, ${move.status.turns} Runde(n)`:'Keiner']])],
        ['Aktueller Kampftext', paras([attackText(move.id, meta.activeTeam.length||1)])],
        ['Freischaltung', table(['Titel','Bedingung'], [[move.unlockTitle,move.unlockDetail]])],
        ['Flirtoption', table(['Option','Modifikator'], [[move.flirtOption,signed(move.flirtModifier)]])],
        ['Meisterschaft', masteryView(move.id, meta)],
        ['Wirkung gegen Gegner', table(['Gegner','Move×Tag','Bewertung'], Object.values(CAMPAIGN_OPPONENTS).map((opponent)=>{const factor=(opponent.moveMultipliers[move.id]??1)*(opponent.tagMultipliers[move.tag]??1);return[opponent.name,factor.toFixed(2),effectiveness(factor)];}))],
        ['Wiederholung', bullets(['Genauigkeit: 0 / −8 / −18 / −35 ab der 1./2./3./4. Nutzung in Folge.', 'Schadensfaktor: 1,00 / 0,85 / 0,65 / 0,35.', 'Andere Attacken bauen die jeweilige Gewöhnung pro Runde um 1 ab.'])],
        ['Codequellen', sources(['src/game/combatMoves.ts','src/lpc-main/campaign/authorityOverhaul.ts','src/lpc-main/campaign/battleEngine.ts','src/lpc-main/campaign/progression.ts'])],
      ])), equipped?'AUSGERÜSTET':learned?`M${mastery?.level??1}`:'GESPERRT');
  });
}

function combatEntries(snapshot, meta) {
  const mod = statusModifiers(snapshot.needs);
  return [
    make('combat-turn','combat','Rundenablauf','Treffer, Frust, Konter und Gewöhnung','Kampf Formel critical Schaden Genauigkeit',()=>page('KAMPFSYSTEM','Rundenablauf','Wer zuerst sein Frustmaximum erreicht, verliert.',sections([
      ['Schritte',ordered(['Attacke wählen.','Genauigkeit berechnen.','Trefferwurf ausführen.','Bei Treffer Frust und Status anwenden.','Momentum berechnen.','Gegnerischen Konter ausführen.','Statusdauer und Gewöhnung aktualisieren.'])],
      ['Aktueller Körper',stats([['Kraft',`${mod.power.toFixed(2)}×`],['Genauigkeit',signed(mod.accuracy)],['Verteidigung',`${mod.defense.toFixed(2)}×`],['Bewegung',`${mod.movement.toFixed(2)}×`],['Verzögerung',`${mod.reactionDelayMs} ms`]])],
      ['Trefferformel',formula('Attackengenauigkeit + Körper + Meisterschaft + Fokus + nächste Boni + Anekdote − Unterbrechung − Gewöhnung + geöffneter Gegner')],
      ['Schadensformel',formula('Grundfrust × Körperkraft × Meisterschaft × Gegner-Tag × Gegner-Move × Phase × Kombo × Team × Wiederholung × Anekdote × Signatur × Vorbereitung × Kritisch')],
      ['Kritisch',paras(['Normal: Wurf ≤ max(4; Genauigkeit×0,12). Signatur: Genauigkeit×0,20. Kritischer Frust ×1,45.'])],
      ['Codequelle',sources(['src/lpc-main/campaign/battleEngine.ts'])],
    ]))),
    make('combat-opponents','combat','Gegnerprofile','Einlass, Ronny und Sonntag','Boss Gundula Uli Ronny opponent multiplier',()=>page('GEGNER','Gegnerprofile','Jeder Gegner besitzt eigene Frustgrenze, Konter und Multiplikatoren.',Object.entries(CAMPAIGN_OPPONENTS).map(([id,opponent])=>`<article class="codex-opponent"><header><div><span>${esc(id)}</span><h3>${esc(opponent.name)}</h3><p>${esc(opponent.title)}</p></div><b>${opponent.maxFrustration} FRUST</b></header>${table(['Parameter','Wert'],[['Eigenschaften',opponent.traits.join(' · ')],['Grundkonter',String(opponent.baseCounterFrustration)],['Kontertexte',String(opponent.counterLines.length)]])}<details><summary>Attackenmultiplikatoren</summary>${table(['Attacke','Faktor'],Object.entries(opponent.moveMultipliers).map(([id,value])=>[COMBAT_MOVES[id]?.shortLabel??id,Number(value).toFixed(2)]))}</details><details><summary>Kategorien</summary>${table(['Tag','Faktor'],Object.entries(opponent.tagMultipliers).map(([id,value])=>[TAG_LABELS[id]??id,Number(value).toFixed(2)]))}</details></article>`).join('')+sources(['src/game/combatMoves.ts','src/lpc-main/campaign/battleEngine.ts']))),
    make('combat-authority','combat','Gundula/Uli manipulieren',`${authorityManipulationScore(meta.flags)} aktive Marker`,'Manipulierbare Platzleitung Ego Wegbier Pong Nackenklatscher',()=>page('BOSSMECHANIK','Manipulierbare Platzleitung','Grimmig im Auftreten, aber systematisch über Ego, Pöbelpakt, Alkoholritual und Publikum zu drehen.',stats([['Marker',String(authorityManipulationScore(meta.flags))],['Ego',yes(meta.flags['authority-ego-hook'])],['Wegbier',yes(meta.flags['authority-drinking-bond'])],['Wohlwollen',yes(meta.flags['authority-goodwill'])]])+sections([
      ['Marker und Wirkung',authorityFlags(meta.flags)],
      ['Skalierung',bullets(['Jeder Marker: +4,5 % eigene Wirkung, maximal +28 %.','Startfrust: Marker×5 +4 bei Wohlwollen; maximal 34 am Einlass, 22 im Finale.','Konter: max(0,48; 1−Marker×0,075), danach Wohlwollen ×0,88 und passende Wegbierbindung ×0,82; Minimum 0,38.'])],
      ['Phasen',table(['Phase','Bereich','Stark'],[['Schranken-Gockelmodus','0–33 %','Kumpelkontakt, Zustimmung, Getränk'],['Angeschickerte Stichelei','34–69 %','Team, Charme, Witz, Getränk'],['Gekränkte Platzherrschaft','70–100 %','Chaos, Team, Charme']])],
      ['Codequellen',sources(['src/lpc-main/campaign/authorityOverhaul.ts','src/lpc-main/campaign/progression.ts'])],
    ]))),
    make('combat-status','combat','Kampfstatus','Temporäre Effekte','Überrumpelt Leerlauf Unterbrochen Fixiert',()=>page('KAMPFSTATUS','Temporäre Effekte','Status werden am Rundenende um eine Runde reduziert.',Object.entries(BATTLE_STATUS).map(([id,[label,effect]])=>`<article class="codex-rule"><header><strong>${esc(label)}</strong><code>${id}</code></header><p>${esc(effect)}</p></article>`).join('')+note('Kontrolle','Kontroll-Spezialisierung verlängert durch Attacken gesetzte Status um eine Runde.')),
    make('combat-team','combat','Team und Begleiteraktionen',`${meta.activeTeam.length} aktiv`,'Team Momentum companion synergy',()=>page('TEAM','Begleiter im Kampf','Begleiter geben Skalierung und einmalige Momentumaktionen.',stats([['Aktiv',meta.activeTeam.map(nameFor).join(' · ')||'Niemand'],['Limit',String(currentRank(meta).companionSlots)],['Teamattacke','1+(Größe−1)×0,24'],['Andere Attacken','1+(Größe−1)×0,04']])+table(['Begleiter','Aktion','Wirkung','Kosten'],Object.entries(COMPANION_ACTIONS).map(([id,a])=>[nameFor(id),a.label,a.detail,String(a.momentum)]))+synergyView(meta.activeTeam)),
  ];
}

function minigameEntries(meta) {
  return MINIGAMES.map((doc)=>{const result=meta.miniResults[doc.id];return make(`minigame-${doc.id}`,'minigames',doc.title,doc.subtitle,[doc.title,doc.objective,...doc.rules,...doc.assists.flat()].join(' '),()=>page('MINISPIEL',`${doc.title} · ${doc.subtitle}`,doc.objective,stats([['Versuche',String(result?.attempts??0)],['Siege',String(result?.wins??0)],['Bestwert',String(result?.best??0)],['Qualität',result?.bestQuality??'failed']])+sections([
    ['Steuerung',ordered(doc.controls)],['Phasen',bullets(doc.phases)],['Exakt programmierte Regeln',bullets(doc.rules)],['Wertungsformel',doc.score.map(formula).join('')],['Qualität',bullets(doc.quality)],['Belohnungen und Folgen',bullets(doc.rewards)],['Charakterhilfen',table(['Flag','Quelle','Aktiv','Wirkung'],doc.assists.map(([flag,source,effect])=>[flag,source,yes(meta.flags[flag]),effect]))],['Adaptive Schwierigkeit',bullets(['Erster Versuch 0,84.','Zweiter Versuch ohne Sieg 0,90.','Danach Basis 1,00.','Ab zwei Siegen +0,05.','Bestqualität Perfekt +0,08.','Energie unter 30 +0,03.','Begrenzung 0,82–1,18.'])],['Codequelle',sources([doc.source])],
  ])),result?`${result.wins}/${result.attempts} · ${result.bestQuality}`:'UNVERSUCHT');});
}

function statusEntries(snapshot) {
  const statuses=activeStatuses(snapshot.needs);const mod=statusModifiers(snapshot.needs);
  const needEntries=NEED_DOCS.map(([id,label,direction,details])=>make(`need-${id}`,'status',label,`${Math.round(snapshot.needs[id])}/100`,[label,direction,...details].join(' '),()=>page('BEDÜRFNIS',label,direction,stats([['Aktueller Wert',String(Math.round(snapshot.needs[id]))],['Status',statusForNeed(id,statuses)]])+bullets(details)+sources(['src/game/statusSystem.ts','src/game/state/GameStore.ts']))));
  return [...needEntries,
    make('status-current','status','Aktuelle Gesamtwirkung',statuses.map((s)=>s.shortLabel).join(' · ')||'STABIL','power accuracy defense charm',()=>page('ZUSTAND','Aktuelle Gesamtwirkung','Alle aktiven Schwellen werden kombiniert.',stats([['Kraft',`${mod.power.toFixed(2)}×`],['Genauigkeit',signed(mod.accuracy)],['Verteidigung',`${mod.defense.toFixed(2)}×`],['Bewegung',`${mod.movement.toFixed(2)}×`],['Verzögerung',`${mod.reactionDelayMs} ms`],['Charme',signed(mod.charm)],['Flirt',signed(mod.flirt)],['Energieverbrauch',`${mod.energyDrain.toFixed(2)}×`]])+(statuses.length?statuses.map((s)=>note(`${s.shortLabel} · ${Math.round(s.intensity*100)} %`,s.description)).join(''):note('Stabil','Kein Schwellenstatus aktiv.')))),
    make('status-metrics','status','Wochenendwerte',`Würde ${snapshot.metrics.dignity} · Chaos ${snapshot.metrics.chaos}`,'Würde Chaos Ruf Momentum',()=>page('METAWERTE','Würde, Chaos, Ruf und Momentum','Soziale Qualität und Ressourcen des Wochenendes.',stats([['Würde',String(snapshot.metrics.dignity)],['Chaos',String(snapshot.metrics.chaos)],['Ruf',String(snapshot.metrics.reputation)],['Momentum',String(snapshot.metrics.momentum)]])+table(['Wert','Funktion'],[['Würde','Kontrolle und Restrespekt; sinkt bei öffentlicher Blamage.'],['Chaos','Eskalation; schadet manchen Romanzen.'],['Ruf','Kompetenz und sichtbare Erfolge; hilft Flirt und Score.'],['Momentum','Bezahlt Begleiteraktionen und Signaturattacken.']]))),
  ];
}

function itemEntries(snapshot) {
  return Object.values(ITEMS).map((item)=>make(`item-${item.id}`,'items',`${item.icon} ${item.label}`,`${item.price} € · Bestand ${snapshot.inventory[item.id]??0}`,[item.label,item.description,item.id,...Object.keys(item.effects??{})].join(' '),()=>page('GEGENSTAND',`${item.icon} ${item.label}`,item.description,stats([['ID',item.id],['Preis',`${item.price} €`],['Maximal',String(item.max)],['Bestand',String(snapshot.inventory[item.id]??0)]])+(item.effects?table(['Wert','Änderung'],Object.entries(item.effects).map(([id,value])=>[needName(id),signed(value)])):note('Questgegenstand','Nicht direkt benutzbar; Wirkung entsteht in einer Interaktion.'))+itemNote(item.id)+sources(['src/game/content.ts','src/game/state/GameStore.ts'])),(snapshot.inventory[item.id]??0)>0?`${snapshot.inventory[item.id]}×`:undefined));
}

function questEntries(meta) {
  const stageEntries=QUEST_STAGES.map(([id,title,objective,target,completion])=>make(`quest-${id}`,'quests',title,id===meta.questStage?'AKTIV':id,[title,objective,target,completion].join(' '),()=>page('KAMPAGNENSTUFE',title,objective,stats([['ID',id],['Ziel',target],['Status',id===meta.questStage?'Aktiv':stageState(id,meta.questStage)]])+note('Abschlusswirkung',completion)+sources(['src/lpc-main/campaign/metaStore.ts'])),id===meta.questStage?'AKTIV':undefined));
  const base=Object.values(QUESTS).map((q)=>make(`basequest-${q.id}`,'quests',q.title,'Basissystem-Quest',[q.title,q.objective,q.reward].join(' '),()=>page('BASISQUEST',q.title,q.objective,table(['ID','Belohnung'],[[q.id,q.reward]])+note('Einordnung','Die LPC-Kampagne legt darüber eine detailliertere Stufenlogik.'))));
  return [make('quest-finale','quests','Finale freischalten',`${finaleProgress(meta)}/4 Bedingungen`,'Finale Ronny drei Aktivitäten',()=>page('FINALE','Sonntagsabnahme freischalten','Im freien Wochenende werden drei verschiedene Aktivitäten und Ronny benötigt.',stats([['Aktivitäten',`${completedActivities(meta)}/3`],['Ronny',yes(meta.flags.ronnyDefeated)],['Finale aktiv',yes(meta.questStage==='sunday-final')],['Gewonnen',yes(meta.finalBattleWon)]])+bullets(['Aktivitäten: Flip Cup, Beer Pong, Flunkyball, Komm ans Loch, In die Hecke.','Mindestens drei unterschiedliche müssen registriert sein.','Ronny muss besiegt sein.']))),...stageEntries,...base];
}

function progressionEntries(meta) {
  return [
    make('progress-score','progression','Wochenendwert',`${meta.weekendScore} Punkte`,'Score Formel rank relationships',()=>page('FORTSCHRITT','Wochenendwert','Bündelt Kampagne, Siege, Perfektion, Beziehungen, Romanzen, Meisterschaft und Risiko.',stats([['Wert',String(meta.weekendScore)],['Rang',rankName(meta.weekendRank)],['Attackenplätze',String(currentRank(meta).attackSlots)],['Begleiterplätze',String(currentRank(meta).companionSlots)]])+formula('25 Einlass + 10 Strom + 10 erstes Bier + 40 Finale + Siege×12 + Perfekt×8 + Anekdoten×5 + Meisterschaft + Romanzen×0,18 + Beziehungen×0,12 + Erleichterungen×3 − Verdacht×0,15')+scoreBreakdown(meta)+sources(['src/lpc-main/campaign/metaStore.ts · recalculateScore']))),
    make('progress-ranks','progression','Wochenendränge',rankName(meta.weekendRank),'Rang slots legend myth',()=>page('RÄNGE','Wochenendränge','Ränge bestimmen Ausrüstungs- und Teamgrenzen.',table(['Rang','Mindestwert','Attacken','Begleiter','Status'],WEEKEND_RANKS.map((r)=>[r.label,String(r.minScore),String(r.attackSlots),String(r.companionSlots),r.id===meta.weekendRank?'AKTUELL':'']))+note('Globale Grenze',`Maximal ${MAX_EQUIPPED_ATTACKS} Attacken.`))),
    make('progress-mastery','progression','Attackenmeisterschaft',`${Object.keys(meta.attackMastery).length} trainiert`,'Mastery M2 M3 impact control signature',()=>page('MEISTERSCHAFT','Attacken trainieren','Einsätze und Treffer werden dauerhaft gezählt.',table(['Attacke','Einsätze','Treffer','Stufe','Zweig'],meta.learnedAttacks.map((id)=>{const m=meta.attackMastery[id];return[COMBAT_MOVES[id].shortLabel,String(m?.uses??0),String(m?.successes??0),`M${m?.level??1}`,branchLabel(m?.branch)];}))+bullets(['M2: mindestens 4 Einsätze und 3 Treffer.','M3: mindestens 9 Einsätze und 7 Treffer.','Wirkung-Zweig: zusätzlicher Faktor 1,09.','Kontrolle: +7 Genauigkeit und +1 Statusrunde.','M3-Signatur: kostet 2 Momentum, +6 Genauigkeit, Schaden ×1,38.']))),
    make('progress-anecdotes','progression','Anekdoten',`${meta.unlockedAnecdotes.length}/${Object.keys(ANECDOTES).length}`,'Anekdote story equipped bonus',()=>page('ANEKDOTEN','Wochenendlegenden','Besondere Erfolge und Fehlschläge werden als ausrüstbare Kampfboni gespeichert.',Object.values(ANECDOTES).map((a)=>`<article class="codex-anecdote ${meta.unlockedAnecdotes.includes(a.id)?'unlocked':'locked'}"><header><div><span>${a.id}</span><h3>${esc(a.label)}</h3></div><b>${meta.equippedAnecdotes.includes(a.id)?'AUSGERÜSTET':meta.unlockedAnecdotes.includes(a.id)?'FREI':'GESPERRT'}</b></header><p>${esc(a.detail)}</p><small>${esc(a.combatText)}</small></article>`).join('')+sources(['src/lpc-main/campaign/progression.ts']))),
    make('progress-team','progression','Teamzusammenstellung',meta.activeTeam.map(nameFor).join(' · ')||'Kein Team','recruit threshold synergy',()=>page('TEAMFORTSCHRITT','Aktives Team','Freunde werden nach Treffen und Beziehungsschwelle rekrutierbar.',stats([['Aktiv',meta.activeTeam.map(nameFor).join(' · ')||'Niemand'],['Limit',String(currentRank(meta).companionSlots)]])+table(['Freund','Schwelle','Aktiv','Stärken'],Object.values(FRIEND_PROFILES).map((f)=>[nameFor(f.id),String(f.recruitmentThreshold),yes(meta.activeTeam.includes(f.id)),f.strengths.join(' · ')]))+synergyView(meta.activeTeam))),
  ];
}

function worldEntries(snapshot) {
  const groups=['story','service','minigame','landmark'];
  return [
    make('world-regions','world','Regionen','Sieben Funktionsbereiche','arrival central festival beach cove map',()=>page('WELT','Regionen','Die Karte ist 2.600×1.800 Einheiten groß.',stats([['Position',`${Math.round(snapshot.worldPosition.x)}/${Math.round(snapshot.worldPosition.y)}`],['Welt','2.600×1.800'],['Kamera','1.280×720'],['Grundtempo','195 Einheiten/s']])+table(['ID','Name','Funktion'],REGIONS)+sources(['src/game/aerialCampgroundPlan.ts','src/lpc-main/campaign/worldScene.ts']))),
    ...groups.map((kind)=>make(`world-${kind}`,'world',kindName(kind),`${ALL_INTERACTIONS.filter((i)=>i.kind===kind).length} Orte`,[kind,...ALL_INTERACTIONS.filter((i)=>i.kind===kind).map((i)=>i.label)].join(' '),()=>page('INTERAKTIONEN',kindName(kind),kindDescription(kind),table(['Ort','ID','Position','Radius','Einlass'],ALL_INTERACTIONS.filter((i)=>i.kind===kind).map((i)=>[i.label,i.id,`${i.x}/${i.y}`,String(i.radius),yes(Boolean(i.requiresGate))]))+sources(['src/lpc-main/campaign/content.ts'])))),
    make('world-map','world','Minikarte und Zielführung','Gelb Ziel · Weiß Spieler','Minimap focus distance',()=>page('NAVIGATION','Minikarte','Weltkoordinaten werden direkt in eine 330×230-Pixel-Karte übersetzt.',bullets(['Skalierung x: 330/2600, y: 230/1800.','Gelb: aktuelles Questziel.','Weiß: Spielerposition.','Distanz: euklidischer Abstand, gerundet.','Fokus schwenkt 500 ms zum Ziel und folgt nach 950 ms wieder dem Spieler.'])+sources(['src/lpc-main/campaign/app.ts · drawMinimap','src/lpc-main/campaign/worldScene.ts · externalFocus']))),
  ];
}

function make(id, category, title, subtitle, keywords, html, badge) { return { id, category, title, subtitle, badge, search: `${title} ${subtitle} ${keywords}`.toLocaleLowerCase('de'), html }; }
function page(kicker,title,intro,content){return `<article class="codex-page"><header class="codex-page-head"><span>${esc(kicker)}</span><h2>${esc(title)}</h2><p>${esc(intro)}</p></header>${content}</article>`;}
function sections(rows){return rows.map(([title,content])=>`<section class="codex-section"><h3>${esc(title)}</h3>${content}</section>`).join('');}
function stats(rows){return `<div class="codex-stat-grid">${rows.map(([a,b])=>`<div><small>${esc(a)}</small><strong>${esc(b)}</strong></div>`).join('')}</div>`;}
function table(headers,rows){return `<div class="codex-table-wrap"><table><thead><tr>${headers.map((h)=>`<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map((r)=>`<tr>${r.map((c)=>`<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;}
function paras(lines){return lines.map((x)=>`<p>${esc(x)}</p>`).join('');}
function bullets(lines){return `<ul>${lines.map((x)=>`<li>${esc(x)}</li>`).join('')}</ul>`;}
function ordered(lines){return `<ol>${lines.map((x)=>`<li>${esc(x)}</li>`).join('')}</ol>`;}
function formula(x){return `<div class="codex-formula">${esc(x)}</div>`;}
function note(title,text){return `<aside class="codex-note"><strong>${esc(title)}</strong><p>${esc(text)}</p></aside>`;}
function sources(paths){return `<div class="codex-sources">${paths.map((p)=>`<code>${esc(p)}</code>`).join('')}</div>`;}
function signed(x){const n=Math.round(Number(x)||0);return `${n>=0?'+':''}${n}`;}
function yes(x){return x?'Ja':'Nein';}
function byId(id){const node=document.getElementById(id);if(!node)throw new Error(`Missing codex element: ${id}`);return node;}
function esc(x){return String(x??'').replace(/[&<>'"]/g,(c)=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
function nameFor(id){return CAMPAIGN_CHARACTER_BY_ID[id]?.name??CHARACTER_VOICES[id]?.name??id;}
function currentRank(meta){return WEEKEND_RANKS.find((r)=>r.id===meta.weekendRank)??WEEKEND_RANKS[0];}
function rankName(id){return WEEKEND_RANKS.find((r)=>r.id===id)?.label??id;}
function stageName(id){return QUEST_STAGES.find((r)=>r[0]===id)?.[1]??id;}
function needName(id){return NEED_DOCS.find((r)=>r[0]===id)?.[1]??id;}
function stageState(id,current){const order=QUEST_STAGES.map((r)=>r[0]);return order.indexOf(id)<order.indexOf(current)?'Abgeschlossen':'Noch nicht aktiv';}
function completedActivities(meta){return ['flipCup','beerPong','flunkyball','maslHole','hedgePee'].filter((id)=>(meta.miniResults[id]?.attempts??0)>0||(id==='hedgePee'&&meta.flags.hedgeRelieved)).length;}
function finaleProgress(meta){return Math.min(3,completedActivities(meta))+(meta.flags.ronnyDefeated?1:0);}
function effectiveness(x){return x>=1.55?'extreme Schwäche':x>=1.25?'sehr stark':x<=0.72?'schwach':'normal';}
function responsePools(pool){return Object.entries(pool).map(([id,lines])=>`<details><summary>${esc(APPROACH_LABELS[id])}</summary>${paras(lines)}</details>`).join('');}
function teamStats(m){return table(['Feld','Wert'],[['Level',String(m.level)],['Entschlossenheit',`${m.resolve}/${m.maxResolve}`],['Loyalität',String(m.loyalty)],['Kampf',signed(m.bonuses.battle)],['Sozial',signed(m.bonuses.social)],['Spiele',signed(m.bonuses.games)],['Erholung',signed(m.bonuses.recovery)]]);}
function romanceView(id,p,snapshot,meta){const state=meta.romance[id];return paras([p.description])+stats([['Interesse',String(state.interest)],['Versuche/Erfolge',`${state.attempts}/${state.successes}`],['Grenzverstöße',String(state.boundaryStrikes)],['Probe',`${flirtChance(id,snapshot)}/20`]])+table(['Bereich','Wert'],[['Gute Geschenke',p.preferredGifts.map((x)=>ITEMS[x]?.label??x).join(' · ')],['Schlechte Geschenke',p.dislikedGifts.map((x)=>ITEMS[x]?.label??x).join(' · ')],['Bevorzugt',p.prefers.join(' · ')],['Lehnt ab',p.rejects.join(' · ')]]);}
function authorityFlags(flags){const rows=[['authority-ego-hook','Ego gekapert','Kumpelkontakt/Zustimmung +26 %'],['authority-gossip-bond','Pöbelpakt','Witz/Team/Chaos +20 %'],['authority-drinking-bond','Wegbierbindung','Getränk +42 %, passende Konter schwächer'],['authority-pong-challenge','Beer-Pong-Stolz','Pong-Duell +52 %'],['authority-nacken-calibrated','Nackenklatscher','Nackenklatscher/Pöbelkonter +38 %'],['authority-goodwill','Wohlwollen','Konter ×0,88, Heckenverdacht langsamer'],['uli-route-knowledge','Routenwissen','Patrouillen ×0,76']];return table(['Flag','Name','Aktiv','Wirkung'],rows.map(([flag,name,effect])=>[flag,name,yes(flags[flag]),effect]));}
function attackText(id,n){return {'classic-high-five':'„Passt, Chef“ plus Kumpel-Nackenklatscher.','aldi-shirt-show':'Aldi-Shirt wie eine Uniform präsentieren.','agree-anyway':'Beide zu den einzigen Vernünftigen erklären.','logical-argument':'Beweisführung auf einen feuchten Bierdeckel.','dry-counter':'Nach dem Monolog nur „Stark, Chef“.','camping-chair-block':'Bierbank-Sitzblockade im Machtbereich.','beer-offer':'Halbes Bier als Friedensvertrag.','synchronised-cheer':`${n} Stimmen: „JAWOLL CHEF!“`,'cup-eye-contact':'Beer-Pong-Zwangsduell mit öffentlichem Einsatz.','total-exaggeration':'Heroische Platzwart-Legendenlüge.'}[id]??id;}
function masteryView(id,meta){const m=meta.attackMastery[id];return table(['Einsätze','Treffer','Stufe','Zweig','Nächstes Ziel'],[[String(m?.uses??0),String(m?.successes??0),`M${m?.level??1}`,branchLabel(m?.branch),(m?.level??1)===1?`${Math.max(0,4-(m?.uses??0))} Einsätze / ${Math.max(0,3-(m?.successes??0))} Treffer bis M2`:(m?.level??1)===2?`${Math.max(0,9-(m?.uses??0))} Einsätze / ${Math.max(0,7-(m?.successes??0))} Treffer bis M3`:'Maximum']]);}
function statusForNeed(id,statuses){if(id==='alcohol')return statuses.find((s)=>['angetrunken','betrunken','voll'].includes(s.id))?.label??'Kein Alkoholstatus';if(id==='highness')return statuses.find((s)=>['breit','sehr-breit'].includes(s.id))?.label??'Klar';if(id==='hangover')return statuses.find((s)=>s.id==='kater')?.label??'Kein Kater';if(id==='energy')return statuses.find((s)=>s.id==='erschoepft')?.label??'Nicht erschöpft';if(id==='thirst')return statuses.find((s)=>s.id==='dehydriert')?.label??'Nicht dehydriert';return 'Kein eigener Schwellenstatus';}
function itemNote(id){if(id==='klopapier')return note('Questfunktion','Kann Manni übergeben werden und schaltet ihn als Unterstützer frei.');if(id==='bier')return note('Zusatz','Direkte Nutzung: Chaos +1, Momentum +1. Erstes Bier ist Kampagnenstufe.');if(id==='batida')return note('Zusatz','Direkte Nutzung: Chaos +2, Momentum +1. Susi lehnt es als Geschenk ab.');return '';}
function synergyView(team){const list=activeTeamSynergies(team);return sections([['Aktive Synergien',list.length?table(['Name','Beschreibung','Kampf','Sozial','Spiele','Erholung'],list.map((s)=>[s.label,s.description,signed(s.battle),signed(s.social),signed(s.games),signed(s.recovery)])):paras(['Keine aktive definierte Synergie.'])]]);}
function scoreBreakdown(meta){const wins=Object.values(meta.miniResults).reduce((a,b)=>a+b.wins,0);const perfect=Object.values(meta.miniResults).filter((x)=>x.bestQuality==='perfect').length;const romance=Object.values(meta.romance).reduce((a,b)=>a+Math.max(0,b.interest),0);const rel=Object.values(meta.relationshipBonus).reduce((a,b)=>a+b,0);const mastery=Object.values(meta.attackMastery).reduce((a,b)=>a+((b?.level??1)-1)*5,0);return table(['Quelle','Berechnung','Beitrag'],[['Einlass',yes(meta.authorityBattleWon),meta.authorityBattleWon?'25':'0'],['Strom',yes(meta.powerConnected),meta.powerConnected?'10':'0'],['Erstes Bier',yes(meta.firstBeerOpened),meta.firstBeerOpened?'10':'0'],['Finale',yes(meta.finalBattleWon),meta.finalBattleWon?'40':'0'],['Siege',`${wins}×12`,String(wins*12)],['Perfekt',`${perfect}×8`,String(perfect*8)],['Anekdoten',`${meta.unlockedAnecdotes.length}×5`,String(meta.unlockedAnecdotes.length*5)],['Meisterschaft','5 je Stufe',String(mastery)],['Romanzen',`${romance}×0,18`,(romance*.18).toFixed(1)],['Beziehungen',`${rel}×0,12`,(rel*.12).toFixed(1)],['Erleichterung',`${meta.reliefCount}×3`,String(meta.reliefCount*3)],['Verdacht',`${meta.suspicion}×−0,15`,(-meta.suspicion*.15).toFixed(1)]]);}
function kindName(k){return {story:'Story-Interaktionen',service:'Versorgung und Ruhe',minigame:'Minispielorte',landmark:'Orientierungsorte'}[k];}
function kindDescription(k){return {story:'Lineare Ankunftsquest.',service:'Stabilisierung und dauerhafte Menüs.',minigame:'Startet Minispiel oder Frustduell.',landmark:'Treffpunkt und Orientierung.'}[k];}
function shell(){return `<section id="campaign-codex" class="modal codex-modal" hidden><article class="codex-window"><header class="codex-header"><div><span>SPIEL-CODEX · LIVE AUS DEN SYSTEMDATEN</span><h2>Tales of the Blaue Adria</h2><p id="codex-category-copy"></p></div><button id="codex-close" class="modal-x" type="button" aria-label="Codex schließen">×</button></header><div class="codex-tools"><label><span>Alles durchsuchen</span><input id="codex-search" type="search" placeholder="Charakter, Attacke, Wert, Flag oder Regel …" autocomplete="off"></label><b id="codex-count"></b></div><nav id="codex-tabs" class="codex-tabs"></nav><div class="codex-body"><aside id="codex-entry-list" class="codex-entry-list"></aside><main id="codex-detail" class="codex-detail"></main></div></article></section>`;}

mountCampaignCodex();
