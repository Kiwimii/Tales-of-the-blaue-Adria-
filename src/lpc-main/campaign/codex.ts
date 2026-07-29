import { COMBAT_MOVES, COMBAT_OPPONENTS, MAX_EQUIPPED_ATTACKS, type CombatMoveTag } from '../../game/combatMoves';
import { ITEMS, QUESTS, RELATIONSHIP_CHARACTERS } from '../../game/content';
import { FRIEND_PROFILES, FRIEND_TEAM_MEMBERS, activeTeamSynergies, type FriendId } from '../../game/friendRoster';
import { ROMANCE_PROFILES, type RomanceId } from '../../game/socialSystem';
import { GameStore, type StorageAdapter } from '../../game/state/GameStore';
import { activeStatuses, statusModifiers } from '../../game/statusSystem';
import type { CombatMoveId, GameSnapshot, Needs } from '../../game/types';
import { CAMPAIGN_CHARACTER_BY_ID, ALL_INTERACTIONS } from './content';
import { CAMPAIGN_OPPONENTS } from './battleEngine';
import { CHARACTER_VOICES, type DialogueApproach } from './characterVoices';
import { installAuthorityOverhaul, authorityManipulationScore } from './authorityOverhaul';
import { campaignMeta, type CampaignMetaState, type CampaignQuestStage } from './metaStore';
import {
  ANECDOTES,
  COMPANION_ACTIONS,
  WEEKEND_RANKS,
  branchLabel,
  type AnecdoteId,
  type WeekendRankId,
} from './progression';
import './codex.css';

installAuthorityOverhaul();

const SAVE_KEY = 'tales-blaue-adria-lpc-main-v1';

type CodexCategoryId =
  | 'overview'
  | 'characters'
  | 'attacks'
  | 'combat'
  | 'minigames'
  | 'status'
  | 'items'
  | 'quests'
  | 'progression'
  | 'world';

interface CodexCategory {
  id: CodexCategoryId;
  label: string;
  icon: string;
  description: string;
}

interface CodexEntry {
  id: string;
  category: CodexCategoryId;
  title: string;
  subtitle: string;
  badge?: string;
  search: string;
  render: () => string;
}

interface MiniGameDoc {
  id: 'flipCup' | 'beerPong' | 'flunkyball' | 'hedgePee' | 'maslHole';
  title: string;
  kicker: string;
  objective: string;
  controls: string[];
  phases: string[];
  exactRules: string[];
  scoring: string[];
  quality: string[];
  rewards: string[];
  assists: Array<{ flag: string; source: string; effect: string }>;
  source: string;
}

const CATEGORIES: CodexCategory[] = [
  { id: 'overview', label: 'Grundsystem', icon: '◎', description: 'Spielablauf, Steuerung, Speicherung und Charaktererstellung.' },
  { id: 'characters', label: 'Charaktere', icon: '♟', description: 'Persönlichkeiten, Dialoglogik, Beziehungen, Rollen und aktuelle Zustände.' },
  { id: 'attacks', label: 'Attacken', icon: '✦', description: 'Alle Frustattacken mit exakten Werten, Freischaltungen und Gegnerwirkung.' },
  { id: 'combat', label: 'Kampfsystem', icon: '⚔', description: 'Rundenablauf, Frust, Kombos, Gegnerphasen und Statuswirkungen.' },
  { id: 'minigames', label: 'Minispiele', icon: '◆', description: 'Steuerung, Physik, Wertungsformeln, Qualitätsstufen und Hilfen.' },
  { id: 'status', label: 'Zustände & Werte', icon: '◒', description: 'Bedürfnisse, Pegel, Kater, Würde, Chaos, Ruf und Momentum.' },
  { id: 'items', label: 'Inventar', icon: '▣', description: 'Preise, Wirkungen, Grenzen und Questfunktionen aller Gegenstände.' },
  { id: 'quests', label: 'Quests', icon: '◇', description: 'Kampagnenstufen, Ziele, Voraussetzungen und Finale.' },
  { id: 'progression', label: 'Fortschritt', icon: '▲', description: 'Wochenendränge, Meisterschaften, Anekdoten, Teams und Freischaltungen.' },
  { id: 'world', label: 'Welt & Orte', icon: '⌖', description: 'Regionen, Interaktionsorte, Karte und Bewegungsregeln.' },
];

const APPROACH_LABELS: Record<DialogueApproach, string> = {
  listen: 'Zuhören',
  joke: 'Humor',
  challenge: 'Herausfordern',
  help: 'Helfen/Planen',
};

const TAG_LABELS: Record<CombatMoveTag, string> = {
  rapport: 'Kumpelkontakt',
  style: 'Stil/Fremdscham',
  submission: 'Zustimmung/Leerlauf',
  logic: 'Logik',
  wit: 'Trockener Witz',
  guard: 'Verteidigung',
  drink: 'Getränkeritual',
  team: 'Gruppe',
  charm: 'Charme/Spiel',
  chaos: 'Chaos/Übertreibung',
};

const BATTLE_STATUS_DOCS: Record<string, { label: string; effect: string }> = {
  ueberrumpelt: { label: 'Überrumpelt', effect: 'Der Gegner gilt als geöffnet; die nächste Attacke erhält +6 Genauigkeit.' },
  fremdschaemen: { label: 'Fremdschämen', effect: 'Stil-Attacken verursachen zusätzlich 8 Frust.' },
  leerlauf: { label: 'Leerlauf', effect: 'Der Gegner kontert nicht; Witz- und Zustimmungsattacken verursachen zusätzlich 7 Frust.' },
  unterbrochen: { label: 'Unterbrochen', effect: 'Der betroffene Kämpfer verliert den Gegenzug. Beim Spieler sinkt zusätzlich die Genauigkeit um 9.' },
  abgesichert: { label: 'Abgesichert', effect: 'Eingehender Konter wird mit 0,62 multipliziert.' },
  verwirrt: { label: 'Verwirrt', effect: 'Der Gegner gilt als geöffnet; die nächste Attacke erhält +6 Genauigkeit.' },
  fokussiert: { label: 'Fokussiert', effect: 'Die eigene Genauigkeit steigt um 8.' },
  fixiert: { label: 'Fixiert', effect: 'Der Gegner gilt als geöffnet; die nächste Attacke erhält +6 Genauigkeit.' },
};

const NEED_DOCS: Array<{ id: keyof Needs; label: string; direction: string; details: string[] }> = [
  { id: 'energy', label: 'Energie', direction: '100 ist gut; 0 ist erschöpft.', details: ['Unter 30 entsteht der Status PLATT.', 'Niedrige Energie reduziert Bewegung, Verteidigung, Genauigkeit und Charme.', '60 Minuten Ruhe geben 43 Energie und 4 Mut zurück, kosten aber Zeit.'] },
  { id: 'hunger', label: 'Hunger', direction: '0 ist satt; 100 ist kritisch.', details: ['Würste senken Hunger um 36.', 'Chips senken Hunger um 18, erhöhen aber Durst um 8.', 'Hunger ist ein fortlaufender Versorgungswert und kann spätere Leistung indirekt verschlechtern.'] },
  { id: 'thirst', label: 'Durst', direction: '0 ist versorgt; 100 ist dehydriert.', details: ['Ab 72 entsteht DURST/Dehydriert.', 'Dehydrierung kostet 5 bis 13 Genauigkeit und erhöht Energieverbrauch.', 'Wasser senkt Durst um 30, füllt aber die Blase um 12.'] },
  { id: 'bladder', label: 'Blase', direction: '0 ist leer; 100 ist Notfall.', details: ['Getränke erhöhen den Wert.', 'Die Toilette setzt den Wert in 5 Minuten auf 0.', 'Ab 88 bringt ein rechtzeitiger Toilettengang zusätzlich 2 Würde und 3 Momentum.'] },
  { id: 'alcohol', label: 'Alkohol', direction: '0 ist nüchtern; 100 ist Vollpegel.', details: ['14–37: PEGEL, +10 % Kraft, −6 Genauigkeit, +3 Charme, +2 Flirt.', '38–67: BESOFFEN, +20 % Kraft, −16 Genauigkeit, schwächere Verteidigung.', 'Ab 68: VOLL, +34 % Kraft, −29 Genauigkeit, −18 % Verteidigung, schwankende Bewegung.', 'Ein mittlerer Pegel kann bei Gundula/Uli Getränkerituale stärken; ab 76 wird diese Wirkung wieder schlechter.'] },
  { id: 'highness', label: 'Breit', direction: '0 ist klar; 100 ist sehr breit.', details: ['Ab 30: BREIT, +210 ms Reaktionsverzögerung, −5 Genauigkeit.', 'Ab 70: SEHR BREIT, +430 ms Verzögerung, −12 Genauigkeit und −18 % Bewegung.', 'Chaos-Proben erhalten bei mindestens 30 Breit einen Bonus.'] },
  { id: 'hangover', label: 'Kater', direction: '0 ist frisch; 100 ist maximaler Kater.', details: ['Ab 28 entsteht KATER.', 'Kater erhöht den Energieverbrauch, senkt Genauigkeit, Charme, Flirt und Verteidigung.', 'Kaffee senkt Kater um 5; die Tablette senkt ihn um 38.'] },
  { id: 'courage', label: 'Mut', direction: '100 ist selbstbewusst; 0 ist verunsichert.', details: ['Getränke und erfolgreiche soziale Aktionen können Mut erhöhen.', 'Fehlgeschlagene Dialoge und Entdeckung in der Hecke können Mut senken.', 'Mut wird als allgemeiner Zustandswert geführt und beeinflusst Herausforderungen im Basissystem.'] },
];

const MINIGAME_DOCS: MiniGameDoc[] = [
  {
    id: 'flipCup',
    title: 'Flip Cup',
    kicker: 'Vier Becher, ein gemeinsames Nervensystem',
    objective: 'Vier Figuren müssen nacheinander trinken, den Becher an der Tischkante platzieren und ihn kopfüber landen lassen, bevor der Gegner seine vier Stationen beendet.',
    controls: ['AKTION/Leertaste halten: trinken.', 'Nach dem Leeren sofort loslassen.', 'Becher horizontal an den optimalen Überstand ziehen.', 'Vom unteren Becherrand nach oben wischen, um Rotation und Flug zu erzeugen.'],
    phases: ['drink: Becher leeren und Reaktionszeit messen.', 'place: Überstand an der Kante wählen.', 'flip: Wischimpuls erfassen.', 'flight: Position, Vertikalgeschwindigkeit, Rotation und Landung simulieren.'],
    exactRules: [
      'Die Staffel beginnt mit André und ergänzt das aktive Team; fehlende Plätze werden mit René, Lars und Danny aufgefüllt.',
      'Gegnerfortschritt pro Millisekunde: (0,000029 + aktuelle Position × 0,0000027) × Schwierigkeit. Renés Hilfe multipliziert ihn mit 0,88.',
      'Zu langes Halten nach leerem Becher wird ab 700 ms als Verschütten und Fehler gezählt.',
      'Eine Reaktion bis einschließlich 360 ms gilt als perfekt.',
      'Der normale Platzierungsbereich besitzt Breite 0,085; Lars erweitert ihn auf 0,14.',
      'Landetoleranz: (0,43 + Platzierungswert × 0,12 + 0,05 beim ersten Versuch) ÷ Schwierigkeit.',
      'Jede Figur besitzt eine eigene Trinkrate, Kontrolle und einen eigenen idealen Überstand.',
    ],
    scoring: ['Wert = 100 − Gegnerfortschritt × 11 − Fehler × 7 + perfekte Flips × 9 + perfekte Reaktionen × 4 + beste Serie × 3.', 'Verliert der Gegner zuerst, wird der Wert aus bereits abgeschlossenen Läufern × 24 minus Fehler × 5 berechnet.'],
    quality: ['Perfekt: mindestens 3 perfekte Flips, 0 Fehler und mindestens 3 perfekte Reaktionen.', 'Solide: Sieg mit höchstens 2 Fehlern.', 'Chaotisch: Sieg mit mehr als 2 Fehlern.', 'Gescheitert: Gegner erreicht vier Stationen zuerst.'],
    rewards: ['Sieg lernt den Bierbank-Chor „JAWOLL CHEF!“.', 'Perfekt schaltet die Anekdote „Alle gleichzeitig“ frei.', 'Sieg: +14 Alkohol, +10 Blase, +7 Mut, Ruf und Momentum sowie Beziehungspunkte für die Staffel.'],
    assists: [
      { flag: 'assist-flip-edge', source: 'Lars', effect: 'Markiert und verbreitert den optimalen Becherüberstand.' },
      { flag: 'assist-team-shout', source: 'René', effect: 'Verlangsamt den gegnerischen Staffelfortschritt auf 88 %.' },
    ],
    source: 'src/lpc-main/campaign/minigamesV2.ts · setupFlipCup / tickFlip / completeFlip',
  },
  {
    id: 'beerPong',
    title: 'Beer Pong',
    kicker: 'Flugbahn, Risiko und Redemption',
    objective: 'Zehn Becher vor dem Gegner abräumen. Direkte Würfe sind sicherer; Bounce-Würfe können zwei Becher entfernen, dürfen aber abgewehrt werden.',
    controls: ['Ball berühren und zurückziehen.', 'Loslassen startet die physikalische Flugbahn.', 'AKTION wechselt zwischen DIREKT und BOUNCE.'],
    phases: ['ready: Wurfart und Zugvektor vorbereiten.', 'flight: Schwerkraft, Geschwindigkeit, Tischkontakt und Bechertreffer simulieren.', 'redemption: Nach gegnerischem Sieg hält nur jeder weitere Treffer die letzte Chance am Leben.'],
    exactRules: [
      'Der Gegner wirft, sobald seine Uhr 4.300 erreicht; höhere Schwierigkeit lässt diese Uhr schneller laufen.',
      'Gegnerische Trefferchance: 0,62 + (Schwierigkeit − 1) × 0,25.',
      'Trefferradius: 0,064 beim ersten Versuch, danach 0,057.',
      'Bounce-Abwehrchance: 0,24 × Schwierigkeit; mit Susi nur 0,12.',
      'Ein erfolgreicher Bounce entfernt den getroffenen und nach Möglichkeit einen zweiten aktiven Becher.',
      'Automatische Re-Racks erfolgen bei 6, 3 und 1 verbleibenden Bechern.',
      'Redemption ist möglich, wenn bereits mindestens 7 Treffer erzielt wurden oder Felix die entsprechende Hilfe freigeschaltet hat.',
      'Ein Fehlwurf während der Redemption beendet das Match sofort.',
    ],
    scoring: ['Wert = Treffer × 13 − Fehlwürfe × 3 + Bounce-Doppeltreffer × 10 + beste Serie × 4 + Redemption-Treffer × 6.'],
    quality: ['Perfekt: Sieg, höchstens 1 Fehlwurf und mindestens 1 erfolgreicher Bounce.', 'Solide: Sieg mit höchstens 4 Fehlwürfen.', 'Chaotisch: jeder andere Sieg.', 'Gescheitert: Gegner leert zuerst oder Redemption endet.'],
    rewards: ['Sieg lernt das Beer-Pong-Zwangsduell.', 'Perfekt schaltet die Anekdote „Über Bande“ frei.', 'Sieg verändert Alkohol, Blase, Mut, Ruf, Momentum sowie Beziehungen zu Susi/Felix, sofern sie beteiligt sind.'],
    assists: [
      { flag: 'partner-susi-pong', source: 'Susi', effect: 'Verlangsamt die gegnerische Serie und senkt Bounce-Abwehr auf 12 %.' },
      { flag: 'assist-pong-redemption', source: 'Felix', effect: 'Erlaubt Redemption unabhängig von sieben eigenen Treffern.' },
      { flag: 'assist-precision', source: 'Gregor', effect: 'Zeigt eine Flugbahnprognose und verbessert die Wurfkontrolle.' },
    ],
    source: 'src/lpc-main/campaign/minigamesV2.ts · setupBeerPong / tickPong / finishPong',
  },
  {
    id: 'flunkyball',
    title: 'Flunkyball',
    kicker: 'Werfen, trinken, retten, STOPP',
    objective: 'Mittelflasche treffen, während der gegnerischen Verteidigung trinken und in der eigenen Verteidigung Flasche, Ball und Linie rechtzeitig bedienen.',
    controls: ['Im Angriff Ball zurückziehen und werfen.', 'Nach Treffer AKTION halten: trinken.', 'Beim Stoppruf sofort loslassen.', 'In der Verteidigung Feld antippen, an Flasche/Ball/Linie jeweils AKTION drücken.'],
    phases: ['attack-throw: Zielwurf auf die Mittelflasche.', 'attack-drink: trinken, bis der Verteidiger STOPP auslöst.', 'defense-run: zur Flasche laufen und aufstellen.', 'defense-ball: Ball aufnehmen.', 'defense-return: zur eigenen Linie zurück und STOPP drücken.'],
    exactRules: [
      'Zielvektor des Angriffswurfs liegt bei x=0,02 und y=0,38.',
      'Wurftoleranz: (0,18 + 0,045 Präzisionshilfe + 0,035 beim ersten Versuch) ÷ Schwierigkeit.',
      'Eigener Trinkfortschritt steigt beim Halten mit 0,00255 pro Millisekunde.',
      'Der gegnerische Verteidiger erreicht STOPP mit 0,00019 × Schwierigkeit pro Millisekunde.',
      'Sauberes Stoppruf-Fenster: 310 ms; mit Jule 430 ms.',
      'Nach 650 ms Weitertrinken entsteht ein Foul und 14 % Trinkfortschritt werden abgezogen.',
      'Verteidigerbewegung: 0,00023 pro Millisekunde; Danny multipliziert sie mit 1,22.',
      'Gegnerischer Trinkfortschritt in der Verteidigung: 0,00142 × Schwierigkeit pro Millisekunde.',
      'Nach Runde 8 entscheidet der höhere Trinkfortschritt.',
    ],
    scoring: ['Regulärer Sieg: 100 + Treffer × 12 + Stopqualität + perfekte Verteidigungen × 12 − 18 bei Foul.', 'Zeitentscheidung: eigener Fortschritt − Gegnerfortschritt + 70.'],
    quality: ['Perfekt: mindestens 3 Treffer, kein Foul, Stopqualität mindestens 40 und mindestens 1 perfekte Verteidigung.', 'Solide: Sieg mit mindestens 2 Treffern.', 'Chaotisch: anderer regulärer Sieg oder knappe Zeitentscheidung.', 'Gescheitert: Gegner leert zuerst oder gewinnt die Zeitentscheidung.'],
    rewards: ['Sieg lernt die Platzwart-Legendenlüge.', 'Perfekt schaltet „STOPP heißt Stopp“ frei.', 'Sieg: Energie −22, Durst +14, Alkohol +14, Blase +8, Mut +8 sowie Ruf, Momentum und Beziehungen zu Danny/Jule.'],
    assists: [
      { flag: 'assist-flunky-sprint', source: 'Danny', effect: 'Erhöht Laufgeschwindigkeit in der Verteidigung um 22 %.' },
      { flag: 'partner-jule-flunky', source: 'Jule', effect: 'Erweitert das perfekte Stoppruf-Fenster von 310 auf 430 ms.' },
    ],
    source: 'src/lpc-main/campaign/minigamesV2.ts · setupFlunkyball / tickFlunky / endFlunkyRound',
  },
  {
    id: 'hedgePee',
    title: 'In die Hecke',
    kicker: 'Deckung, Wind und Beweislage',
    objective: 'Die Blase vollständig leeren, ohne von Gundulas oder Ulis Blickkegel erfasst zu werden und ohne sichtbare Beweise außerhalb der Deckung zu hinterlassen.',
    controls: ['Eine von drei Stellen antippen.', 'AKTION halten: brunzen.', 'Auf dem Spielfeld horizontal zielen.', 'Loslassen, um Verdacht wieder abzubauen.'],
    phases: ['choose: nahen Busch, tiefe Hecke oder Taucherzelt wählen.', 'active: Fortschritt, Wind, Blickkegel, Beweise, Geräusch und Verdacht gleichzeitig kontrollieren.'],
    exactRules: [
      'Naher Busch: Fortschritt 0,00325/ms, geringe Deckung, Zielposition 0,27.',
      'Tiefe Hecke: Fortschritt 0,00245/ms, beste Toleranz 0,16, stärkster Wind, Zielposition 0,50.',
      'Taucherzelt: Fortschritt 0,00272/ms, mittlere Deckung, sozial teurere Beweise, Zielposition 0,74.',
      'Ulis Routenwissen multipliziert Patrouillengeschwindigkeit mit 0,76.',
      'Gundulas Wohlwollen multipliziert Verdachtsaufbau mit 0,75.',
      'Verdacht steigt mit 0,0115 × Anzahl aktiver Gefahren × Wohlwollen pro Millisekunde.',
      'Außerhalb der Hecke steigen Beweise mit 0,0032 pro Millisekunde.',
      'Beim Loslassen sinkt Verdacht mit 0,0017 × Wohlwollen; Unterbrechungen und Geräusch nehmen jedoch zu.',
      '100 Verdacht bedeutet sofortige Entdeckung.',
    ],
    scoring: ['Erfolg: 116 − Verdacht − Beweise − Geräusch.', 'Entdeckung: bisheriger Fortschritt − Beweise − Geräusch.'],
    quality: ['Perfekt: Verdacht unter 14, Beweise unter 7 und Unterbrechungen unter 1,4.', 'Solide: Erfolg mit Verdacht unter 42.', 'Chaotisch: Erfolg ab 42 Verdacht.', 'Gescheitert: Verdacht erreicht 100.'],
    rewards: ['Perfekt schaltet „Die Hecke schweigt“ frei.', 'Entdeckung schaltet „Gundula hat es notiert“ frei.', 'Erfolg setzt Blase auf 0; Entdeckung kostet Würde und Beziehungen zu Gundula/Uli und erhöht den dauerhaften Heckenverdacht.'],
    assists: [
      { flag: 'uli-route-knowledge', source: 'Uli', effect: 'Macht beide Kontrollgänge 24 % langsamer.' },
      { flag: 'authority-goodwill', source: 'Gundula', effect: 'Reduziert Verdachtsaufbau um 25 %.' },
    ],
    source: 'src/lpc-main/campaign/minigamesV2.ts · setupHedgePee / chooseHedgeSpot / tickHedge',
  },
  {
    id: 'maslHole',
    title: 'Komm ans Loch',
    kicker: 'Abdichtung, Atemrhythmus und Wirkung',
    objective: 'Mit zwei Händen eine dichte Kammer um das Loch bilden, drei kontrollierte Züge im richtigen Atemfenster ausführen und vor dem Hustenmaximum loslassen.',
    controls: ['Zwei Finger führen linke und rechte Hand gleichzeitig.', 'Mit Maus können die Hände nacheinander gezogen werden.', 'Bei stabiler Abdichtung AKTION drücken.', 'AKTION im hellen Atemfenster halten und rechtzeitig loslassen.'],
    phases: ['seal: Abstand, Höhengleichheit und Zentrum beider Hände stabilisieren.', 'pull: Abdichtung, Atemrhythmus, Wirkung, Lecks und Husten gleichzeitig kontrollieren.', 'Drei Runden mit zunehmender seitlicher Drift.'],
    exactRules: [
      'Optimaler Handabstand ist 0,22; Höhenunterschied und Abweichung vom Jointzentrum verschlechtern die Abdichtung.',
      'Startschwelle der Abdichtung: 0,64; beim ersten Versuch 0,59; mit Masl-Hilfe 0,55.',
      'Die Abdichtung muss länger als 450 ms stabil gehalten werden, bevor der Zug gestartet werden kann.',
      'Ideales Atemzentrum liegt bei 0,72; daraus entsteht ein Rhythmusfaktor zwischen 0,25 und 1.',
      'Wirkungsfortschritt: 0,00305 × Abdichtung × Rhythmusfaktor pro Millisekunde.',
      'Husten steigt durch schlechte Abdichtung, Wirkung über 78 und schlechten Atemrhythmus.',
      'Ein guter Zug benötigt Wirkung 48–84, Abdichtung mindestens 0,54 und Rhythmusqualität über 450.',
      'Nach jedem Zug steigt die seitliche Drift; Husten sinkt nur um 8.',
    ],
    scoring: ['Guter Zug: 72 + Abdichtung × 24 − Abstand zu Wirkung 66 × 0,48 − Lecks + bis zu 10 Rhythmuspunkte.', 'Schlechter Zug: maximal 5 beziehungsweise Wirkung × 0,25 minus Lecks.', 'Gesamterfolg ab 175 Punkten nach drei Zügen.'],
    quality: ['Perfekt: mindestens 255 Punkte, Erfolg und Husten unter 55.', 'Solide: mindestens 175 Punkte.', 'Chaotisch: 120–174 Punkte.', 'Gescheitert: unter 120 Punkte.'],
    rewards: ['Perfekt schaltet „Masls Tunnel“ frei.', 'Erfolg: Breit +42, Energie −8, Mut +6, Ruf/Momentum und Beziehung zu Masl.', 'Fehlschlag erzeugt dennoch Breit +20 und zeigt vorhandene, aber undichte Wirkung.'],
    assists: [
      { flag: 'assist-masl-seal', source: 'Masl', effect: 'Senkt die Abdichtungsschwelle auf 0,55 und erweitert den stabilen Bereich.' },
    ],
    source: 'src/lpc-main/campaign/minigamesV2.ts · setupMaslHole / tickMasl / completeMaslPull',
  },
];

const QUEST_STAGE_DOCS: Array<{ id: CampaignQuestStage; title: string; objective: string; target: string; completion: string }> = [
  { id: 'arrival', title: 'Ankunft ohne Plan B', objective: 'Kofferraum öffnen.', target: 'trunk', completion: 'Setzt die Kampagne auf Reservierungssuche.' },
  { id: 'reservation', title: 'Wer lesen kann, parkt später', objective: 'Die korrekte Reservierung am Schwarzen Brett finden.', target: 'reservationBoard', completion: 'Schaltet die Konfrontation mit Gundula und Uli frei.' },
  { id: 'authority', title: 'Verwaltung im Doppelpack', objective: 'Gundula/Uli im ersten Frustkampf überwinden.', target: 'gundula', completion: 'Öffnet die Schranke, gibt 25 Wochenendpunkte und lernt die Aldi-Shirt-Offensive.' },
  { id: 'gate-open', title: 'Zum Taucherplatz', objective: 'Durch die Schranke zum Fahrzeug gehen.', target: 'taucherplatz', completion: 'Aktiviert den Stromaufbau.' },
  { id: 'power', title: 'Strom oder Zivilisationsabbruch', objective: 'Stromkasten verbinden.', target: 'powerBox', completion: 'Gibt 10 Wochenendpunkte und startet das Ausladen.' },
  { id: 'unload', title: 'Ausladen ohne Bandscheibenvorfall', objective: 'Getränke, Zelte und Kabel ausladen.', target: 'drinks/tents/cable', completion: 'Wenn alle drei erledigt sind, wird das erste Bier möglich.' },
  { id: 'first-beer', title: 'Rituelle Inbetriebnahme', objective: 'Das erste Bier öffnen.', target: 'firstBeer', completion: 'Gibt 10 Wochenendpunkte, lernt den Biervertrag und startet die Freundessuche.' },
  { id: 'reunion', title: 'Finde die Problemträger', objective: 'Freunde finden und aktives Team aufbauen.', target: 'andre', completion: 'Geht in das freie Wochenende über.' },
  { id: 'free-weekend', title: 'Freies Wochenende', objective: 'Minispiele, Beziehungen, Ronny und Progression bearbeiten.', target: 'campfire', completion: 'Drei unterschiedliche Aktivitäten plus besiegter Ronny öffnen das Finale.' },
  { id: 'sunday-final', title: 'Sonntagsabnahme', objective: 'Team, vier Attacken und bis zu zwei Anekdoten vorbereiten und das Abschlussprotokoll überstehen.', target: 'noticeBoard', completion: 'Gewonnener Endkampf gibt 40 Wochenendpunkte.' },
  { id: 'complete', title: 'Abreise mit Restwürde', objective: 'Verbleibende Zeit frei nutzen.', target: 'campfire', completion: 'Kampagne gilt als abgeschlossen.' },
];

const REGION_DOCS = [
  ['arrival', 'Ankunft und Rezeption', 'Schranke, Reservierung, Gundula und Uli.'],
  ['north', 'Adria-Klause und Nordplätze', 'Dauerplätze, Wege und nördliche Camper.'],
  ['central', 'Taucherplatz und Sanitär', 'Eigenes Lager, Strom, Zelte, Sanitär und Hecke.'],
  ['festival', 'Festwiese', 'Beer Pong, Bühne und Partybereich.'],
  ['woodland', 'Servicehof und Waldsaum', 'Werkstatt, Holzlager und ruhigere Wege.'],
  ['beach', 'Strand und Hauptsteg', 'Flunkyball, Wasser und Hauptsteg.'],
  ['cove', 'Ruhige Bucht', 'Bucht, Unterstand und abgelegener Steg.'],
] as const;

class SnapshotStorage implements StorageAdapter {
  getItem(): string | null { return localStorage.getItem(SAVE_KEY); }
  setItem(): void { /* Codex reads but never writes the main save. */ }
  removeItem(): void { /* Codex reads but never resets the main save. */ }
}

let activeCategory: CodexCategoryId = 'overview';
let activeEntryId = 'overview-flow';
let searchTerm = '';
let mounted = false;

export function mountCampaignCodex(): void {
  if (mounted) return;
  const game = document.getElementById('campaign-game');
  const nav = game?.querySelector('.topbar nav');
  if (!game || !nav) {
    window.setTimeout(mountCampaignCodex, 50);
    return;
  }
  mounted = true;

  const openButton = document.createElement('button');
  openButton.id = 'open-codex';
  openButton.type = 'button';
  openButton.textContent = 'Codex';
  openButton.title = 'Spiel-Codex öffnen (C)';
  nav.prepend(openButton);

  document.getElementById('app')?.insertAdjacentHTML('beforeend', codexShell());
  const modal = requireElement<HTMLElement>('campaign-codex');
  const close = requireElement<HTMLButtonElement>('codex-close');
  const search = requireElement<HTMLInputElement>('codex-search');
  const tabs = requireElement<HTMLElement>('codex-tabs');
  const list = requireElement<HTMLElement>('codex-entry-list');

  openButton.addEventListener('click', openCodex);
  close.addEventListener('click', closeCodex);
  modal.addEventListener('click', (event) => { if (event.target === modal) closeCodex(); });
  search.addEventListener('input', () => { searchTerm = search.value.trim().toLocaleLowerCase('de'); renderCodex(); });
  tabs.addEventListener('click', (event) => {
    const button = (event.target as Element).closest<HTMLButtonElement>('[data-codex-category]');
    if (!button) return;
    activeCategory = button.dataset.codexCategory as CodexCategoryId;
    searchTerm = '';
    search.value = '';
    const first = buildEntries().find((entry) => entry.category === activeCategory);
    if (first) activeEntryId = first.id;
    renderCodex();
  });
  list.addEventListener('click', (event) => {
    const button = (event.target as Element).closest<HTMLButtonElement>('[data-codex-entry]');
    if (!button) return;
    activeEntryId = button.dataset.codexEntry ?? activeEntryId;
    renderCodex();
    if (window.matchMedia('(max-width: 820px)').matches) requireElement<HTMLElement>('codex-detail').scrollIntoView({ block: 'start', behavior: 'smooth' });
  });
  window.addEventListener('keydown', (event) => {
    const target = event.target as HTMLElement | null;
    if (target?.matches('input, textarea, select, [contenteditable="true"]')) return;
    if (event.key === 'Escape' && !modal.hidden) { event.preventDefault(); closeCodex(); return; }
    if (event.key.toLocaleLowerCase('de') === 'c' && modal.hidden && !document.querySelector('.modal:not([hidden])')) { event.preventDefault(); openCodex(); }
  });
  window.addEventListener('lpc-campaign-meta', () => { if (!modal.hidden) renderCodex(); });
  renderCodex();
}

function openCodex(): void {
  const modal = requireElement<HTMLElement>('campaign-codex');
  modal.hidden = false;
  document.body.classList.add('campaign-modal-open', 'campaign-codex-open');
  const prompt = document.getElementById('interaction-prompt');
  if (prompt) prompt.hidden = true;
  renderCodex();
  window.setTimeout(() => requireElement<HTMLInputElement>('codex-search').focus(), 0);
}

function closeCodex(): void {
  const modal = requireElement<HTMLElement>('campaign-codex');
  modal.hidden = true;
  document.body.classList.remove('campaign-codex-open');
  if (!document.querySelector('.modal:not([hidden])')) document.body.classList.remove('campaign-modal-open');
}

function renderCodex(): void {
  const entries = buildEntries();
  const tabs = requireElement<HTMLElement>('codex-tabs');
  const list = requireElement<HTMLElement>('codex-entry-list');
  const detail = requireElement<HTMLElement>('codex-detail');
  const categoryCopy = requireElement<HTMLElement>('codex-category-copy');
  const count = requireElement<HTMLElement>('codex-count');

  tabs.innerHTML = CATEGORIES.map((category) => {
    const categoryCount = entries.filter((entry) => entry.category === category.id).length;
    return `<button type="button" data-codex-category="${category.id}" class="${activeCategory === category.id ? 'active' : ''}"><i>${category.icon}</i><span>${escapeHtml(category.label)}</span><b>${categoryCount}</b></button>`;
  }).join('');

  const filtered = entries.filter((entry) => {
    if (searchTerm) return entry.search.includes(searchTerm) || entry.title.toLocaleLowerCase('de').includes(searchTerm) || entry.subtitle.toLocaleLowerCase('de').includes(searchTerm);
    return entry.category === activeCategory;
  });
  if (!filtered.some((entry) => entry.id === activeEntryId)) activeEntryId = filtered[0]?.id ?? entries[0]?.id ?? '';
  const selected = entries.find((entry) => entry.id === activeEntryId) ?? filtered[0];
  const category = CATEGORIES.find((entry) => entry.id === activeCategory) ?? CATEGORIES[0];
  categoryCopy.textContent = searchTerm ? `Suche über den vollständigen Codex: „${searchTerm}“` : category.description;
  count.textContent = `${filtered.length} Einträge`;

  list.innerHTML = filtered.length ? filtered.map((entry) => `<button type="button" data-codex-entry="${entry.id}" class="${entry.id === selected?.id ? 'active' : ''}"><span>${escapeHtml(entry.title)}</span><small>${escapeHtml(entry.subtitle)}</small>${entry.badge ? `<b>${escapeHtml(entry.badge)}</b>` : ''}</button>`).join('') : '<p class="codex-empty">Keine Einträge gefunden. Suche kürzer oder verwende einen anderen Begriff.</p>';
  detail.innerHTML = selected ? selected.render() : '<div class="codex-empty">Kein Eintrag ausgewählt.</div>';
}

function buildEntries(): CodexEntry[] {
  const base = new GameStore(new SnapshotStorage()).snapshot();
  const meta = campaignMeta.snapshot();
  const snapshot = campaignMeta.augmentSnapshot(base);
  return [
    ...overviewEntries(snapshot, meta),
    ...characterEntries(snapshot, meta),
    ...attackEntries(snapshot, meta),
    ...combatEntries(snapshot, meta),
    ...minigameEntries(meta),
    ...statusEntries(snapshot),
    ...itemEntries(snapshot),
    ...questEntries(meta),
    ...progressionEntries(meta),
    ...worldEntries(snapshot),
  ];
}

function overviewEntries(snapshot: GameSnapshot, meta: CampaignMetaState): CodexEntry[] {
  return [
    entry('overview-flow', 'overview', 'Spielablauf', 'Vom Intro bis zur Sonntagsabnahme', 'Kampagne Tutorial Supermarkt Einlass freies Wochenende Finale', () => page(
      'SPIELSTRUKTUR', 'Spielablauf', 'Die Kampagne ist ein zusammenhängendes Campingwochenende. Entscheidungen verändern Zustände, Beziehungen, Attacken, Anekdoten, Minispiele und das Finale.',
      statusGrid([
        ['Aktuelle Stufe', stageLabel(meta.questStage)],
        ['Tag / Zeit', `Tag ${snapshot.day} · ${snapshot.clockLabel}`],
        ['Aktuelles Ziel', campaignMeta.objective().title],
        ['Wochenendwert', `${meta.weekendScore} · ${rankLabel(meta.weekendRank)}`],
      ]) + sections([
        ['1. Intro und Charakter', paragraphs(['Die variable Einleitung stellt Gruppe, Einkauf, Platz und Konflikte vor.', 'Danach werden Name, Körper, Frisur, Accessoire, Farben und eine soziale Eigenschaft gewählt.'])],
        ['2. Supermarkt', paragraphs(['Startbudget: 25 €. Jeder Gegenstand besitzt Preis, Maximalmenge und konkrete Zustandswirkungen.', 'Mindestens ein Gegenstand muss gekauft werden; eine Überschreitung des Budgets wird verhindert.'])],
        ['3. Ankunftsquest', numbered(['Kofferraum öffnen.', 'Reservierung am Schwarzen Brett finden.', 'Gundula und Uli überwinden.', 'Zum Taucherplatz fahren.', 'Strom verbinden.', 'Getränke, Zelte und Kabel ausladen.', 'Erstes Bier öffnen.'])],
        ['4. Freies Wochenende', paragraphs(['Charaktere finden, Beziehungen aufbauen, bis zu drei Begleiter wählen, Attacken lernen und Minispiele absolvieren.', 'Drei unterschiedliche Aktivitäten plus ein besiegter Ronny öffnen die Sonntagsabnahme.'])],
        ['5. Finale', paragraphs(['Team, bis zu vier Attacken und zwei Anekdoten wirken im Abschlusskampf zusammen.', 'Der finale Ausgang berücksichtigt den gesamten gespeicherten Wochenendverlauf.'])],
        ['Codequellen', codeSources(['src/lpc-main/campaign/app.ts', 'src/lpc-main/campaign/metaStore.ts', 'src/game/state/GameStore.ts'])],
      ]),
    )),
    entry('overview-controls', 'overview', 'Steuerung', 'Tastatur, Maus, Touch und Mobilmodus', 'WASD Pfeile E Space C joystick Aktion touch', () => page(
      'BEDIENUNG', 'Steuerung', 'Alle Kernfunktionen sind mit Tastatur sowie Touch bedienbar. Minispiele besitzen zusätzliche Gesten.',
      sections([
        ['Welt', table(['Eingabe', 'Funktion'], [
          ['WASD / Pfeiltasten', 'Figur bewegen. Diagonalen werden normalisiert.'],
          ['E oder Leertaste', 'Nächstes Ziel, Figur oder Objekt benutzen.'],
          ['Q', 'Winken/Emote.'],
          ['C', 'Codex öffnen, sofern kein anderes Fenster aktiv ist.'],
          ['Gelber Zielpunkt', 'Aktives Questziel auf der Minikarte. Weißer Punkt ist die Spielerposition.'],
        ])],
        ['Mobil', paragraphs(['Links erscheint ein unsichtbarer, dynamischer Analogstick dort, wo der Daumen aufsetzt. Bewegungsstärke beeinflusst die Geschwindigkeit.', 'Rechts befindet sich die kontextabhängige Aktionstaste. Sie wechselt beispielsweise zwischen REDEN, ÖFFNEN, SPIELEN, MACHEN und RUHEN.'])],
        ['Dialoge und Menüs', paragraphs(['Optionen werden direkt angeklickt. Escape schließt den Codex.', 'Während eines Modals wird die Weltbewegung durch die Klasse campaign-modal-open vollständig gesperrt.'])],
        ['Minispiele', paragraphs(['Die konkrete Steuerung wird vor jedem Start angezeigt und zusätzlich in den jeweiligen Codex-Einträgen dokumentiert.', 'Pointer-Capture verhindert, dass Zieh- oder Haltegesten beim Verlassen einer Schaltfläche unkontrolliert weiterlaufen.'])],
        ['Codequellen', codeSources(['src/lpc-main/campaign/worldScene.ts', 'src/lpc-main/campaign/mobileControls.ts', 'src/lpc-main/campaign/minigamesV2.ts'])],
      ]),
    )),
    entry('overview-save', 'overview', 'Speicherung und Kompatibilität', 'Lokale Browserstände und stabile IDs', 'save localStorage Speicherstand Attacken IDs Kompatibilität', () => page(
      'TECHNIK', 'Speicherung', 'Das Spiel speichert lokal im Browser. Es existieren ein Basisspielstand und ein zusätzlicher Kampagnen-Metastand.',
      sections([
        ['Speicherschlüssel', table(['Bereich', 'Schlüssel'], [
          ['Basisspiel', SAVE_KEY],
          ['Kampagnenfortschritt', 'tales-blaue-adria-lpc-campaign-meta-v2'],
          ['Intro-Variante', 'tales-adria-intro-variant-v2'],
        ])],
        ['Gespeicherte Daten', bullets(['Position, Zeit, Inventar, Bedürfnisse und Wochenendwerte.', 'Beziehungen, Quests, Chronik und Flags.', 'Gelernte/ausgerüstete Attacken und Meisterschaft.', 'Minispielversuche, Siege, Bestwerte und Qualitätsstufen.', 'Anekdoten, aktives Team, Romanzen, Heckenverdacht und Finale.'])],
        ['Kompatibilität', paragraphs(['Attacken besitzen technische IDs wie classic-high-five oder cup-eye-contact. Namen und Texte dürfen geändert werden, ohne ältere Spielstände zu zerstören.', 'Der Codex zeigt deshalb sowohl sichtbare Bezeichnungen als auch technische IDs und Codequellen.'])],
        ['Neustart', paragraphs(['Die Schaltfläche Neustart löscht beide Spielstände und lädt die Seite neu. Dieser Vorgang kann nicht rückgängig gemacht werden.'])],
      ]),
    )),
    entry('overview-profile', 'overview', 'Spielerprofil und Eigenschaften', snapshot.profile ? `${snapshot.profile.name} · ${snapshot.profile.trait}` : 'Noch kein Profil', 'Charakter Eigenschaft charmant direkt chaotisch hilfreich beobachtend', () => page(
      'SPIELERFIGUR', 'Eigenschaften', 'Die gewählte Eigenschaft beeinflusst vor allem, welche Gesprächsstrategie zusätzliche Beziehungspunkte erhält.',
      statusGrid([
        ['Name', snapshot.profile?.name ?? 'Nicht erstellt'],
        ['Eigenschaft', snapshot.profile?.trait ?? '–'],
        ['Körper', snapshot.profile?.bodyType ?? '–'],
        ['Frisur', snapshot.profile?.hairStyle ?? '–'],
      ]) + table(['Eigenschaft', 'Aktuelle Wirkung'], [
        ['Hilfsbereit', '+2 Beziehung bei erfolgreichen Hilfe-/Planen-Dialogen. Zusätzlich +2 bei allgemeinen Plan-Gesprächen.'],
        ['Beobachtend', '+1 Beziehung bei erfolgreichem Zuhören.'],
        ['Chaotisch', '+1 Beziehung bei erfolgreichem Humor; kreative Romanzen können zusätzlich profitieren.'],
        ['Direkt', '+1 Beziehung bei erfolgreicher Herausforderung.'],
        ['Charmant', 'Ist als Profiloption und Basiston vorhanden; der aktuelle charakterbasierte Dialogresolver besitzt dafür keinen separaten festen Bonus.'],
      ]) + note('Bearbeitungshinweis', 'Die Eigenschaft „Charmant“ ist derzeit schwächer mechanisch angebunden als die anderen vier. Das ist ein klarer Ansatzpunkt für spätere Verfeinerung.') + codeSources(['src/lpc-main/campaign/app.ts · saveProfile', 'src/lpc-main/campaign/characterVoices.ts · resolveCharacterChoice', 'src/game/socialSystem.ts']),
    )),
  ];
}

function characterEntries(snapshot: GameSnapshot, meta: CampaignMetaState): CodexEntry[] {
  return Object.values(CHARACTER_VOICES)
    .sort((a, b) => characterOrder(a.id) - characterOrder(b.id) || a.name.localeCompare(b.name, 'de'))
    .map((voice) => {
      const relationship = snapshot.relationships[voice.id] ?? meta.relationshipBonus[voice.id] ?? 0;
      const met = Boolean(snapshot.flags[`met-${voice.id}`]) || (meta.conversationCounts[voice.id] ?? 0) > 0;
      const active = meta.activeTeam.includes(voice.id);
      const friend = FRIEND_PROFILES[voice.id as FriendId];
      const romance = ROMANCE_PROFILES[voice.id as RomanceId];
      const visual = CAMPAIGN_CHARACTER_BY_ID[voice.id];
      const companion = COMPANION_ACTIONS[voice.id];
      const stateBadge = active ? 'AKTIV' : met ? `BEZ. ${signed(relationship)}` : 'UNBEKANNT';
      const search = [voice.name, voice.role, voice.cadence, ...voice.values, ...voice.irritants, friend?.biography, romance?.description].filter(Boolean).join(' ');
      return entry(`character-${voice.id}`, 'characters', voice.name, voice.role, search, () => page(
        visual?.role ?? 'CHARAKTER', voice.name, voice.cadence,
        statusGrid([
          ['Status', active ? 'Aktiver Begleiter' : met ? 'Kennengelernt' : 'Noch nicht getroffen'],
          ['Beziehung', signed(relationship)],
          ['Gespräche', String(meta.conversationCounts[voice.id] ?? 0)],
          ['Portrait / Rolle', `${voice.portrait} · ${visual?.role ?? voice.role}`],
        ]) + sections([
          ['Persönlichkeitskern', table(['Bereich', 'Beschreibung'], [
            ['Rolle', voice.role],
            ['Sprechweise', voice.cadence],
            ['Werte', voice.values.join(' · ')],
            ['Reizpunkte', voice.irritants.join(' · ')],
            ['Mag', voice.likes.map((id) => APPROACH_LABELS[id]).join(' · ') || 'Keine feste Präferenz'],
            ['Mag nicht', voice.dislikes.map((id) => APPROACH_LABELS[id]).join(' · ') || 'Keine feste Abneigung'],
          ])],
          ...(friend ? [['Freundesprofil', table(['Feld', 'Aktueller Inhalt'], [
            ['Archetyp', friend.archetype],
            ['Biografie', friend.biography],
            ['Stärken', friend.strengths.join(' · ')],
            ['Schwächen', friend.weaknesses.join(' · ')],
            ['Themen', friend.topics.join(' · ')],
            ['Cannabis', friend.likesCannabis ? 'Ja' : 'Nein'],
            ['Alkoholtoleranz', friend.alcoholTolerance],
            ['Rekrutierung', `Ab ${friend.recruitmentThreshold} Beziehungspunkten und nach erstem Treffen`],
            ['Feldsatz', friend.fieldLine],
          ])]] as Array<[string, string]> : []),
          ...(friend && FRIEND_TEAM_MEMBERS[voice.id as FriendId] ? [['Teamwerte', teamMemberHtml(voice.id as FriendId)]] as Array<[string, string]> : []),
          ...(romance ? [['Romanze', romanceHtml(romance.id, snapshot, meta)]] as Array<[string, string]> : []),
          ['Dialogoptionen', voice.choices.map((choice) => `<article class="codex-choice"><header><strong>${escapeHtml(choice.label)}</strong><span class="risk-${choice.risk}">${choice.risk.toLocaleUpperCase('de')}</span></header><p>${escapeHtml(choice.hint)}</p><small>Thema: ${escapeHtml(choice.topic)} · Ansatz: ${escapeHtml(APPROACH_LABELS[choice.approach])}</small></article>`).join('')],
          ['Mögliche positive Reaktionen', approachResponses(voice.positive)],
          ['Mögliche negative Reaktionen', approachResponses(voice.negative)],
          ['Persönliche Enthüllung', paragraphs([voice.personalReveal])],
          ['Konkrete Spielwirkung', voice.assistLabel ? paragraphs([voice.assistLabel, `Technisches Flag: ${voice.consequenceFlag ?? 'keins'}`]) : paragraphs(['Keine eigene dauerhafte Assistenz definiert.'])],
          ...(companion ? [['Begleiteraktion im Kampf', table(['Name', 'Wirkung', 'Kosten'], [[companion.label, companion.detail, `${companion.momentum} Momentum`]])]] as Array<[string, string]> : []),
          ['Visuelle Implementierung', table(['Feld', 'Wert'], [
            ['Outfit', visual?.outfit ?? '–'],
            ['Frisur', visual?.hairStyle ?? '–'],
            ['Accessoires', visual?.accessories.join(' · ') ?? '–'],
            ['Leerlaufanimation', visual?.idleAnimation ?? '–'],
            ['Begrüßungsanimation', visual?.greetingAnimation ?? '–'],
            ['Welttext', visual?.dialogue ?? '–'],
          ])],
          ...(voice.id === 'gundula' || voice.id === 'uli' ? [['Aktuelle Manipulationslage', authorityStateHtml(meta)]] as Array<[string, string]> : []),
          ['Codequellen', codeSources(['src/lpc-main/campaign/characterVoices.ts', friend ? 'src/game/friendRoster.ts' : '', romance ? 'src/game/socialSystem.ts' : '', 'src/lpc-main/content.ts', voice.id === 'gundula' || voice.id === 'uli' ? 'src/lpc-main/campaign/authorityOverhaul.ts' : ''].filter(Boolean))],
        ]),
      ), stateBadge);
    });
}

function attackEntries(snapshot: GameSnapshot, meta: CampaignMetaState): CodexEntry[] {
  return Object.values(COMBAT_MOVES).map((move) => {
    const learned = meta.learnedAttacks.includes(move.id);
    const equipped = meta.equippedAttacks.includes(move.id);
    const mastery = meta.attackMastery[move.id];
    const badge = equipped ? 'AUSGERÜSTET' : learned ? `M${mastery?.level ?? 1}` : 'GESPERRT';
    return entry(`attack-${move.id}`, 'attacks', move.label, `${TAG_LABELS[move.tag]} · ${move.accuracy}%`, [move.label, move.shortLabel, move.description, move.unlockTitle, move.unlockDetail, move.tag].join(' '), () => {
      const status = move.status ? BATTLE_STATUS_DOCS[move.status.id] : undefined;
      const opponentRows = Object.entries(CAMPAIGN_OPPONENTS).map(([id, opponent]) => {
        const moveMultiplier = opponent.moveMultipliers[move.id] ?? 1;
        const tagMultiplier = opponent.tagMultipliers[move.tag] ?? 1;
        return [opponent.name, `${moveMultiplier.toFixed(2)} × ${tagMultiplier.toFixed(2)} = ${(moveMultiplier * tagMultiplier).toFixed(2)}`, effectivenessLabel(moveMultiplier * tagMultiplier)];
      });
      return page('FRUSTATTACKE', move.label, move.description,
        statusGrid([
          ['Technische ID', move.id],
          ['Kategorie', TAG_LABELS[move.tag]],
          ['Grundfrust', String(move.baseFrustration)],
          ['Genauigkeit', `${move.accuracy}%`],
          ['Status', equipped ? 'Ausgerüstet' : learned ? 'Gelernt' : 'Noch gesperrt'],
          ['Meisterschaft', `M${mastery?.level ?? 1} · ${branchLabel(mastery?.branch)}`],
        ]) + sections([
          ['Exakte Wirkung', table(['Parameter', 'Wert'], [
            ['Grundfrust', String(move.baseFrustration)],
            ['Grundgenauigkeit', `${move.accuracy}%`],
            ['Kategorie/Tag', `${move.tag} · ${TAG_LABELS[move.tag]}`],
            ['Eigene Frustheilung', move.selfRelief ? String(move.selfRelief) : 'Keine'],
            ['Verteidigungsmultiplikator', move.guardMultiplier ? String(move.guardMultiplier) : 'Keine'],
            ['Statuswirkung', move.status ? `${move.status.target === 'enemy' ? 'Gegner' : 'Spieler'}: ${status?.label ?? move.status.id} für ${move.status.turns} Runde(n)` : 'Keine'],
          ]) + (status ? note(status.label, status.effect) : '')],
          ['Aktueller Kampftext', paragraphs([attackPresentation(move.id, meta.activeTeam.length || 1)])],
          ['Freischaltung', table(['Titel', 'Bedingung'], [[move.unlockTitle, move.unlockDetail]])],
          ['Flirtverwendung', table(['Option', 'Modifikator'], [[move.flirtOption, signed(move.flirtModifier)]])],
          ['Meisterschaft', masteryHtml(move.id, meta)],
          ['Wirkung gegen Gegner', table(['Gegner', 'Attacke × Kategorie', 'Bewertung'], opponentRows)],
          ['Wiederholung und Kombos', paragraphs(['Jede direkte Wiederholung erzeugt Gewöhnung: −8 Genauigkeit beim zweiten Einsatz, −18 beim dritten und −35 ab dem vierten.', 'Schadensmultiplikator bei Wiederholung: 1,00 / 0,85 / 0,65 / 0,35. Andere Attacken bauen die Gewöhnung der nicht verwendeten Attacken pro Runde um 1 ab.', 'Passende Kategorien können Kombo-Multiplikatoren von 1,16 bis 1,30 erzeugen.'])],
          ['Codequellen', codeSources(['src/game/combatMoves.ts', 'src/lpc-main/campaign/authorityOverhaul.ts', 'src/lpc-main/campaign/battleEngine.ts', 'src/lpc-main/campaign/progression.ts'])],
        ]));
    }, badge);
  });
}

function combatEntries(snapshot: GameSnapshot, meta: CampaignMetaState): CodexEntry[] {
  const modifiers = statusModifiers(snapshot.needs);
  const authorityScore = authorityManipulationScore(meta.flags);
  return [
    entry('combat-turn', 'combat', 'Rundenablauf', 'Treffer, Frust, Konter und Gewöhnung', 'Kampf Runde Genauigkeit Schaden Frust Konter critical Momentum', () => page('KAMPFSYSTEM', 'Rundenablauf', 'Kämpfe sind soziale Frustduelle. Wer zuerst sein Frustmaximum erreicht, verliert die Auseinandersetzung.', sections([
      ['Ablauf einer Runde', numbered(['Attacke auswählen.', 'Grundgenauigkeit mit Zuständen, Meisterschaft, Fokus und Gewöhnung verrechnen.', 'Trefferwurf von 0 bis 100 ausführen.', 'Bei Treffer Frustschaden aus allen Multiplikatoren berechnen.', 'Status, Selbstentlastung oder Schutz anwenden.', 'Momentum aus neuer Attacke, Kombo, Phasenschwäche und kritischem Treffer gewinnen.', 'Sofern der Gegner nicht unterbrochen ist, führt er einen Konter aus.', 'Statusdauer reduzieren, Gewöhnung aktualisieren und nächste Runde starten.'])],
      ['Aktuelle Körpermodifikatoren', table(['Wert', 'Aktuell'], [
        ['Kraft', `${modifiers.power.toFixed(2)}×`],
        ['Genauigkeit', signed(modifiers.accuracy)],
        ['Verteidigung', `${modifiers.defense.toFixed(2)}×`],
        ['Bewegung', `${modifiers.movement.toFixed(2)}×`],
        ['Reaktionsverzögerung', `${modifiers.reactionDelayMs} ms`],
      ])],
      ['Trefferformel', formula('Genauigkeit = Attacke + Zustände + Meisterschaft + Fokus + nächste Boni + Anekdote − Unterbrechung − Gewöhnung + geöffneter Gegner')],
      ['Schadensformel', formula('Frust = Grundfrust × Körperkraft × Meisterschaft × Gegnerkategorie × Gegnermove × Phase × Kombo × Team × Wiederholung × Anekdote × Signatur × Vorbereitung × Kritisch')],
      ['Kritischer Treffer', paragraphs(['Ein Treffer ist kritisch, wenn der Zufallswurf höchstens 12 % der aktuellen Genauigkeit beträgt; bei Signaturattacken sind es 20 %. Mindestens 4 % bleiben möglich.', 'Kritische Treffer multiplizieren Frust mit 1,45 und geben zusätzliches Momentum.'])],
      ['Codequelle', codeSources(['src/lpc-main/campaign/battleEngine.ts'])],
    ]))),
    entry('combat-opponents', 'combat', 'Gegnerprofile', 'Gundula/Uli, Ronny und Sonntagsabnahme', 'Gegner Boss Gundula Uli Ronny Sonntag Phasen Schwächen', () => page('GEGNER', 'Gegnerprofile', 'Jeder Gegner besitzt eigenes Frustmaximum, Grundkonter, Eigenschaften und Multiplikatoren.', Object.entries(CAMPAIGN_OPPONENTS).map(([id, opponent]) => `<article class="codex-opponent"><header><div><span>${escapeHtml(id)}</span><h3>${escapeHtml(opponent.name)}</h3><p>${escapeHtml(opponent.title)}</p></div><b>${opponent.maxFrustration} FRUST</b></header>${table(['Parameter', 'Wert'], [['Eigenschaften', opponent.traits.join(' · ')], ['Grundkonter', String(opponent.baseCounterFrustration)], ['Kontertexte', `${opponent.counterLines.length} Varianten`]])}<details><summary>Attackenmultiplikatoren</summary>${table(['Attacke', 'Faktor'], Object.entries(opponent.moveMultipliers).map(([move, value]) => [COMBAT_MOVES[move as CombatMoveId]?.shortLabel ?? move, Number(value).toFixed(2)]))}</details><details><summary>Kategoriemultiplikatoren</summary>${table(['Kategorie', 'Faktor'], Object.entries(opponent.tagMultipliers).map(([tag, value]) => [TAG_LABELS[tag as CombatMoveTag] ?? tag, Number(value).toFixed(2)]))}</details></article>`).join('') + codeSources(['src/game/combatMoves.ts', 'src/lpc-main/campaign/battleEngine.ts', 'src/lpc-main/campaign/authorityOverhaul.ts']))),
    entry('combat-authority', 'combat', 'Gundula/Uli manipulieren', `${authorityScore} aktive Manipulationsmarker`, 'authority ego Wegbier gossip Pong Nackenklatscher Startfrust', () => page('BOSSMECHANIK', 'Manipulierbare Platzleitung', 'Die beiden beginnen grimmig und relativ gefährlich. Vorherige Dialogerfolge werden jedoch dauerhaft in Kampfboni umgewandelt.', statusGrid([
      ['Manipulationswert', String(authorityScore)],
      ['Wohlwollen', yesNo(meta.flags['authority-goodwill'])],
      ['Wegbierbindung', yesNo(meta.flags['authority-drinking-bond'])],
      ['Ego gekapert', yesNo(meta.flags['authority-ego-hook'])],
    ]) + sections([
      ['Persistente Marker', flagTable([
        ['authority-ego-hook', 'Ego-Bestätigung', 'Verstärkt Kumpelkontakt und Zustimmung um 26 %.'],
        ['authority-gossip-bond', 'Pöbelpakt', 'Verstärkt Witz, Team und Chaos um 20 %.'],
        ['authority-drinking-bond', 'Wegbierbindung', 'Verstärkt Getränkerituale um 42 % und senkt Konter bei mittlerem Pegel.'],
        ['authority-pong-challenge', 'Beer-Pong-Stolz', 'Beer-Pong-Zwangsduell erhält 52 % Zusatzwirkung.'],
        ['authority-nacken-calibrated', 'Nackenklatscher kalibriert', 'Nackenklatscher und Pöbelkonter erhalten 38 % Zusatzwirkung.'],
        ['authority-goodwill', 'Wohlwollen', 'Senkt gegnerische Konter zusätzlich auf 88 %.'],
        ['uli-route-knowledge', 'Ulis Routenwissen', 'Zählt zum Manipulationswert und hilft im Heckenminispiel.'],
      ], meta.flags)],
      ['Allgemeine Skalierung', paragraphs(['Jeder aktive Marker erhöht die eigene Wirkung um 4,5 %, maximal 28 %.', 'Startfrust: Manipulationswert × 5 plus 4 bei Wohlwollen; maximal 34 im Einlasskampf und 22 im Finale.', 'Kontermultiplikator: maximal(0,48; 1 − Marker × 0,075), danach weitere Wohlwollen-/Wegbierfaktoren; absolute Untergrenze 0,38.'])],
      ['Phasen', table(['Phase', 'Frustbereich', 'Starke Kategorien'], [
        ['Schranken-Gockelmodus', '0–33 %', 'Kumpelkontakt, Zustimmung, Getränk'],
        ['Angeschickerte Stichelei', '34–69 %', 'Team, Charme, Witz, Getränk'],
        ['Gekränkte Platzherrschaft', '70–100 %', 'Chaos, Team, Charme'],
      ])],
      ['Codequelle', codeSources(['src/lpc-main/campaign/authorityOverhaul.ts', 'src/lpc-main/campaign/progression.ts', 'src/lpc-main/campaign/battleEngine.ts'])],
    ]))),
    entry('combat-statuses', 'combat', 'Kampfstatus', 'Temporäre Effekte in Frustduellen', 'Überrumpelt Leerlauf Unterbrochen Abgesichert Verwirrt Fokus Fixiert', () => page('KAMPFSTATUS', 'Temporäre Effekte', 'Attacken können den Spieler oder den Gegner für mehrere Runden beeinflussen.', Object.entries(BATTLE_STATUS_DOCS).map(([id, doc]) => `<article class="codex-rule"><header><strong>${escapeHtml(doc.label)}</strong><code>${id}</code></header><p>${escapeHtml(doc.effect)}</p></article>`).join('') + note('Dauer', 'Statusdauer wird am Ende jeder Runde um 1 reduziert. Kontrolle-Meisterschaft verlängert durch Attacken gesetzte Zustände um eine zusätzliche Runde.')),
    entry('combat-team', 'combat', 'Team und Begleiteraktionen', `${meta.activeTeam.length} aktiv`, 'Begleiter Momentum Team slots companion action synergy', () => page('TEAM', 'Begleiter im Kampf', 'Aktive Begleiter verstärken Teamattacken und besitzen einmalige, momentumabhängige Aktionen.', statusGrid([
      ['Aktiv', meta.activeTeam.map((id) => CAMPAIGN_CHARACTER_BY_ID[id]?.name ?? id).join(' · ') || 'Niemand'],
      ['Aktuelles Limit', String(WEEKEND_RANKS.find((rank) => rank.id === meta.weekendRank)?.companionSlots ?? 1)],
      ['Teamattacke', `1 + (Teamgröße − 1) × 0,24`],
      ['Andere Attacken', `1 + (Teamgröße − 1) × 0,04`],
    ]) + table(['Begleiter', 'Aktion', 'Wirkung', 'Momentum'], Object.entries(COMPANION_ACTIONS).map(([id, action]) => [CAMPAIGN_CHARACTER_BY_ID[id]?.name ?? id, action.label, action.detail, String(action.momentum)])) + synergiesHtml(meta.activeTeam) + codeSources(['src/lpc-main/campaign/progression.ts', 'src/lpc-main/campaign/battleEngine.ts', 'src/game/friendRoster.ts'])),
  ];
}

function minigameEntries(meta: CampaignMetaState): CodexEntry[] {
  return MINIGAME_DOCS.map((doc) => {
    const result = meta.miniResults[doc.id];
    const badge = result ? `${result.wins}/${result.attempts} · ${result.bestQuality}` : 'UNVERSUCHT';
    return entry(`minigame-${doc.id}`, 'minigames', doc.title, doc.kicker, [doc.title, doc.kicker, doc.objective, ...doc.controls, ...doc.exactRules, ...doc.assists.map((assist) => assist.source)].join(' '), () => page('MINISPIEL', `${doc.title} · ${doc.kicker}`, doc.objective,
      statusGrid([
        ['Versuche', String(result?.attempts ?? 0)],
        ['Siege', String(result?.wins ?? 0)],
        ['Bestwert', String(result?.best ?? 0)],
        ['Beste Qualität', result?.bestQuality ?? 'failed'],
      ]) + sections([
        ['Steuerung', numbered(doc.controls)],
        ['Phasen', bullets(doc.phases)],
        ['Exakt programmierte Regeln', bullets(doc.exactRules)],
        ['Wertungsformel', doc.scoring.map(formula).join('')],
        ['Qualitätsstufen', bullets(doc.quality)],
        ['Belohnungen und Folgen', bullets(doc.rewards)],
        ['Charakterhilfen', assistTable(doc.assists, meta.flags)],
        ['Adaptive Schwierigkeit', paragraphs(['Erster Versuch: 0,84.', 'Zweiter Versuch ohne Sieg: 0,90.', 'Normalbasis danach: 1,00.', 'Ab zwei Siegen: +0,05.', 'Beste Qualität Perfekt: +0,08.', 'Energie unter 30: +0,03.', 'Endwert wird auf 0,82 bis 1,18 begrenzt. Anzeigen: unter 0,90 Einstiegshilfe; unter 1,04 Normal; unter 1,12 Fortgeschritten; sonst Legendenmodus.'])],
        ['Codequelle', codeSources([doc.source])],
      ])), badge);
  });
}

function statusEntries(snapshot: GameSnapshot): CodexEntry[] {
  const statuses = activeStatuses(snapshot.needs);
  const modifiers = statusModifiers(snapshot.needs);
  return [
    ...NEED_DOCS.map((doc) => entry(`need-${doc.id}`, 'status', doc.label, `${Math.round(snapshot.needs[doc.id])} / 100`, [doc.label, doc.direction, ...doc.details].join(' '), () => page('BEDÜRFNIS', doc.label, doc.direction, statusGrid([
      ['Aktueller Wert', String(Math.round(snapshot.needs[doc.id]))],
      ['Aktiver Status', statuses.find((status) => status.id.includes(doc.id === 'alcohol' ? '' : String(doc.id)))?.label ?? statusForNeed(doc.id, statuses)],
    ]) + bullets(doc.details) + codeSources(['src/game/statusSystem.ts', 'src/game/state/GameStore.ts', 'src/game/content.ts'])))),
    entry('status-active', 'status', 'Aktuelle Gesamtwirkung', statuses.map((status) => status.shortLabel).join(' · ') || 'STABIL', 'aktive Status Modifikatoren Kraft Genauigkeit Verteidigung Bewegung Reaktion Charme Flirt', () => page('ZUSTAND', 'Aktuelle Gesamtwirkung', statuses.length ? 'Mehrere Statuswirkungen werden miteinander kombiniert.' : 'Der Spieler besitzt derzeit keinen Schwellenstatus.', statusGrid([
      ['Kraft', `${modifiers.power.toFixed(2)}×`],
      ['Genauigkeit', signed(modifiers.accuracy)],
      ['Verteidigung', `${modifiers.defense.toFixed(2)}×`],
      ['Bewegung', `${modifiers.movement.toFixed(2)}×`],
      ['Reaktionsverzögerung', `${modifiers.reactionDelayMs} ms`],
      ['Charme', signed(modifiers.charm)],
      ['Flirt', signed(modifiers.flirt)],
      ['Energieverbrauch', `${modifiers.energyDrain.toFixed(2)}×`],
    ]) + (statuses.length ? statuses.map((status) => note(`${status.shortLabel} · ${Math.round(status.intensity * 100)} % Intensität`, status.description)).join('') : note('Stabil', 'Alle Werte befinden sich außerhalb der definierten Statusschwellen.')))),
    entry('status-metrics', 'status', 'Wochenendwerte', `Würde ${snapshot.metrics.dignity} · Chaos ${snapshot.metrics.chaos}`, 'Würde Chaos Ruf Reputation Momentum score', () => page('METAWERTE', 'Würde, Chaos, Ruf und Momentum', 'Diese vier Werte beschreiben nicht den Körper, sondern die soziale Qualität des Wochenendes.', statusGrid([
      ['Würde', String(Math.round(snapshot.metrics.dignity))],
      ['Chaos', String(Math.round(snapshot.metrics.chaos))],
      ['Ruf', String(Math.round(snapshot.metrics.reputation))],
      ['Momentum', String(Math.round(snapshot.metrics.momentum))],
    ]) + table(['Wert', 'Funktion'], [
      ['Würde', 'Steigt durch kontrollierte, respektvolle oder knapp gerettete Situationen; sinkt durch öffentliche Fehlschläge.'],
      ['Chaos', 'Steigt durch Alkohol, riskante Witze, Entdeckung und Eskalation. Hoher Chaoswert schadet insbesondere bestimmten Romanzen.'],
      ['Ruf', 'Belohnung für Siege, perfekte Minispiele, Hilfe und sichtbare Kompetenz. Fließt in Flirtchance und Wochenendwert ein.'],
      ['Momentum', 'Ressource für Begleiteraktionen und Signaturangriffe; steigt durch Erfolge, Kombos und Schwachstellentreffer.'],
    ]))),
  ];
}

function itemEntries(snapshot: GameSnapshot): CodexEntry[] {
  return Object.values(ITEMS).map((item) => entry(`item-${item.id}`, 'items', `${item.icon} ${item.label}`, `${item.price} € · Bestand ${snapshot.inventory[item.id] ?? 0}`, [item.label, item.description, item.id, ...Object.keys(item.effects ?? {})].join(' '), () => page('GEGENSTAND', `${item.icon} ${item.label}`, item.description,
    statusGrid([
      ['Technische ID', item.id],
      ['Preis', `${item.price} €`],
      ['Maximal im Einkauf', String(item.max)],
      ['Aktueller Bestand', String(snapshot.inventory[item.id] ?? 0)],
    ]) + (item.effects ? table(['Bedürfnis', 'Änderung'], Object.entries(item.effects).map(([key, value]) => [needLabel(key), signed(Number(value))])) : note('Questgegenstand', 'Dieser Gegenstand kann nicht direkt benutzt werden. Seine Wirkung entsteht in einer Quest oder Interaktion.')) + itemSpecificNote(item.id) + codeSources(['src/game/content.ts', 'src/game/state/GameStore.ts'])), (snapshot.inventory[item.id] ?? 0) > 0 ? `${snapshot.inventory[item.id]}×` : undefined));
}

function questEntries(meta: CampaignMetaState): CodexEntry[] {
  const stageEntries = QUEST_STAGE_DOCS.map((stage) => entry(`quest-stage-${stage.id}`, 'quests', stage.title, stage.id === meta.questStage ? 'AKTIV' : stage.id, [stage.title, stage.objective, stage.completion, stage.target].join(' '), () => page('KAMPAGNENSTUFE', stage.title, stage.objective,
    statusGrid([
      ['Technische Stufe', stage.id],
      ['Zielort', stage.target],
      ['Aktueller Status', stage.id === meta.questStage ? 'Aktiv' : stageProgressLabel(stage.id, meta.questStage)],
    ]) + sections([
      ['Abschlusswirkung', paragraphs([stage.completion])],
      ['Aktuell programmierte Zielführung', paragraphs([campaignObjectiveForStage(stage.id)])],
      ['Codequelle', codeSources(['src/lpc-main/campaign/metaStore.ts · objective / checkFinale'])],
    ])), stage.id === meta.questStage ? 'AKTIV' : undefined));
  const legacyEntries = Object.values(QUESTS).map((quest) => entry(`quest-base-${quest.id}`, 'quests', quest.title, 'Basissystem-Quest', [quest.title, quest.objective, quest.reward].join(' '), () => page('BASISQUEST', quest.title, quest.objective, table(['Feld', 'Wert'], [['Technische ID', quest.id], ['Belohnung', quest.reward]]) + note('Einordnung', 'Diese Questdefinition stammt aus dem gemeinsamen Basissystem. Die LPC-Kampagne verwendet zusätzlich die feinere Stufenlogik des CampaignMetaStore.') + codeSources(['src/game/content.ts']))));
  return [
    entry('quest-finale', 'quests', 'Finale freischalten', `${finaleProgress(meta)}/4 Bedingungen`, 'Finale drei Aktivitäten Ronny Sonntag Abschlussprotokoll', () => page('FINALE', 'Sonntagsabnahme freischalten', 'Das Finale wird automatisch geöffnet, sobald der freie Wochenendabschnitt aktiv ist und genügend Beweise gesammelt wurden.', statusGrid([
      ['Unterschiedliche Aktivitäten', `${completedActivities(meta)}/3 benötigt`],
      ['Ronny besiegt', yesNo(meta.flags.ronnyDefeated)],
      ['Finale aktiv', yesNo(meta.questStage === 'sunday-final')],
      ['Finale gewonnen', yesNo(meta.finalBattleWon)],
    ]) + bullets(['Als Aktivität zählen Flip Cup, Beer Pong, Flunkyball, Komm ans Loch und In die Hecke.', 'Bei den vier normalen Minispielen genügt mindestens ein Versuch; bei der Hecke genügt ein gespeicherter erfolgreicher Erleichterungszustand.', 'Ronny muss separat besiegt sein.', 'Sind mindestens drei der fünf Aktivitäten registriert, wechselt die Queststufe auf sunday-final.']))),
    ...stageEntries,
    ...legacyEntries,
  ];
}

function progressionEntries(meta: CampaignMetaState): CodexEntry[] {
  return [
    entry('progression-score', 'progression', 'Wochenendwert', `${meta.weekendScore} Punkte`, 'Score Formel Rang Punkte Würde Beziehungen Romanze Anekdoten Meisterschaft', () => page('FORTSCHRITT', 'Wochenendwert', 'Der Wochenendwert bündelt Kampagne, Siege, Beziehungen, Romanzen, Meisterschaft, Anekdoten und Heckenrisiko.', statusGrid([
      ['Aktueller Wert', String(meta.weekendScore)],
      ['Rang', rankLabel(meta.weekendRank)],
      ['Attackenplätze', String(WEEKEND_RANKS.find((rank) => rank.id === meta.weekendRank)?.attackSlots ?? 2)],
      ['Begleiterplätze', String(WEEKEND_RANKS.find((rank) => rank.id === meta.weekendRank)?.companionSlots ?? 1)],
    ]) + formula('Wert = 25 Einlass + 10 Strom + 10 erstes Bier + 40 Finale + Siege×12 + perfekte Spiele×8 + Anekdoten×5 + Meisterschaft + Romanzen×0,18 + Beziehungen×0,12 + Erleichterungen×3 − Heckenverdacht×0,15') + breakdownHtml(meta) + codeSources(['src/lpc-main/campaign/metaStore.ts · recalculateScore']))),
    entry('progression-ranks', 'progression', 'Wochenendränge', rankLabel(meta.weekendRank), 'Rang newcomer tolerated legend myth Attackenslots companions', () => page('RÄNGE', 'Wochenendränge', 'Der Rang bestimmt, wie viele Attacken und Begleiter gleichzeitig ausgerüstet werden dürfen.', table(['Rang', 'Mindestwert', 'Attacken', 'Begleiter', 'Status'], WEEKEND_RANKS.map((rank) => [rank.label, String(rank.minScore), String(rank.attackSlots), String(rank.companionSlots), rank.id === meta.weekendRank ? 'AKTUELL' : ''])) + note('Grenzen', `Unabhängig vom Rang können nie mehr als ${MAX_EQUIPPED_ATTACKS} Attacken gleichzeitig verwendet werden. Beim Sinken des Werts werden ausgerüstete Listen automatisch gekürzt.`))),
    entry('progression-mastery', 'progression', 'Attackenmeisterschaft', `${Object.keys(meta.attackMastery).length} trainierte Attacken`, 'Mastery uses successes level impact control signature', () => page('MEISTERSCHAFT', 'Attacken trainieren', 'Jeder Einsatz und jeder Treffer wird dauerhaft gezählt.', table(['Attacke', 'Einsätze', 'Treffer', 'Stufe', 'Spezialisierung'], meta.learnedAttacks.map((id) => {
      const mastery = meta.attackMastery[id];
      return [COMBAT_MOVES[id].shortLabel, String(mastery?.uses ?? 0), String(mastery?.successes ?? 0), `M${mastery?.level ?? 1}`, branchLabel(mastery?.branch)];
    })) + sections([
      ['Stufenschwellen', bullets(['M1: Standardzustand.', 'M2: mindestens 4 Einsätze und 3 Treffer. Spezialisierung wird möglich.', 'M3: mindestens 9 Einsätze und 7 Treffer. Signaturtechnik wird möglich.'])],
      ['Wirkung', bullets(['M2 erhöht Grundwirkung auf 1,11 beziehungsweise Genauigkeit um 4.', 'M3 erhöht Grundwirkung auf 1,22 beziehungsweise Genauigkeit um 7.', 'Spezialisierung Wirkung multipliziert zusätzlich mit 1,09.', 'Spezialisierung Kontrolle gibt zusätzlich +7 Genauigkeit und verlängert gesetzte Status um eine Runde.', 'M3-Signatur kostet 2 Momentum, gibt +6 Genauigkeit und 1,38 Schadensmultiplikator.'])],
    ]))),
    entry('progression-anecdotes', 'progression', 'Anekdoten', `${meta.unlockedAnecdotes.length}/${Object.keys(ANECDOTES).length} freigeschaltet`, 'Anekdote equipped story combat bonus', () => page('ANEKDOTEN', 'Gespeicherte Wochenendlegenden', 'Anekdoten entstehen aus besonderen Erfolgen oder Fehlschlägen. Bis zu zwei können für Kämpfe ausgerüstet werden.', Object.values(ANECDOTES).map((anecdote) => anecdoteHtml(anecdote.id, meta)).join('') + codeSources(['src/lpc-main/campaign/progression.ts', 'src/lpc-main/campaign/metaStore.ts']))),
    entry('progression-team', 'progression', 'Teamzusammenstellung', meta.activeTeam.map((id) => CAMPAIGN_CHARACTER_BY_ID[id]?.name ?? id).join(' · ') || 'Kein Team', 'Team recruitment threshold active synergy bonuses', () => page('TEAMFORTSCHRITT', 'Aktives Team', 'Freunde werden über Beziehungsschwellen rekrutiert. Das Ranglimit bestimmt die Zahl gleichzeitig aktiver Begleiter.', statusGrid([
      ['Aktives Team', meta.activeTeam.length ? meta.activeTeam.map((id) => CAMPAIGN_CHARACTER_BY_ID[id]?.name ?? id).join(' · ') : 'Niemand'],
      ['Limit', String(WEEKEND_RANKS.find((rank) => rank.id === meta.weekendRank)?.companionSlots ?? 1)],
    ]) + table(['Freund', 'Schwelle', 'Aktiv', 'Stärken'], Object.values(FRIEND_PROFILES).map((friend) => [CAMPAIGN_CHARACTER_BY_ID[friend.id]?.name ?? friend.id, String(friend.recruitmentThreshold), yesNo(meta.activeTeam.includes(friend.id)), friend.strengths.join(' · ')])) + synergiesHtml(meta.activeTeam))),
  ];
}

function worldEntries(snapshot: GameSnapshot): CodexEntry[] {
  const interactionGroups = ['story', 'service', 'minigame', 'landmark'] as const;
  return [
    entry('world-regions', 'world', 'Regionen', 'Sieben funktionale Bereiche', 'Karte region arrival north central festival woodland beach cove', () => page('WELT', 'Regionen des Campingplatzes', 'Die Welt ist 2.600 × 1.800 Einheiten groß und in sieben benannte Regionen gegliedert.', table(['ID', 'Name', 'Funktion'], REGION_DOCS.map(([id, name, detail]) => [id, name, detail])) + statusGrid([
      ['Aktuelle Position', `${Math.round(snapshot.worldPosition.x)} / ${Math.round(snapshot.worldPosition.y)}`],
      ['Weltgröße', '2.600 × 1.800'],
      ['Kameragröße', '1.280 × 720'],
      ['Spielergrundtempo', '195 Einheiten/s × Bewegungsmodifikator'],
    ]) + codeSources(['src/game/aerialCampgroundPlan.ts', 'src/lpc-main/campaign/worldScene.ts'])),
    ...interactionGroups.map((kind) => entry(`world-${kind}`, 'world', interactionKindLabel(kind), `${ALL_INTERACTIONS.filter((item) => item.kind === kind).length} Orte`, [kind, ...ALL_INTERACTIONS.filter((item) => item.kind === kind).map((item) => `${item.label} ${item.id}`)].join(' '), () => page('INTERAKTIONEN', interactionKindLabel(kind), interactionKindDescription(kind), table(['Ort', 'Technische ID', 'Position', 'Radius', 'Einlass nötig'], ALL_INTERACTIONS.filter((item) => item.kind === kind).map((item) => [item.label, item.id, `${item.x}/${item.y}`, String(item.radius), yesNo(Boolean(item.requiresGate))])) + codeSources(['src/lpc-main/campaign/content.ts'])))),
    entry('world-map', 'world', 'Minikarte und Zielführung', 'Gelb: Ziel · Weiß: Spieler', 'Minimap objective target distance focus camera', () => page('NAVIGATION', 'Minikarte', 'Die Minikarte wird aus denselben Weltkoordinaten wie die Phaser-Szene berechnet.', sections([
      ['Darstellung', bullets(['Canvasgröße 330 × 230.', 'Weltkoordinaten werden mit 330/2600 beziehungsweise 230/1800 skaliert.', 'Gelber Kreis: aktuelles Questziel.', 'Weißer Kreis: aktuelle Spielerposition.', 'Objektivdistanz ist die euklidische Distanz zwischen Spieler und Ziel, gerundet in Metern.'])],
      ['Fokusfunktion', paragraphs(['Beziehungsbuttons und das Schwarze Brett können ein Ziel fokussieren. Die Kamera löst kurz die Spielerfolgung, schwenkt in 500 ms zum Ziel und kehrt nach 950 ms zurück.'])],
      ['Codequelle', codeSources(['src/lpc-main/campaign/app.ts · drawMinimap / targetPosition', 'src/lpc-main/campaign/worldScene.ts · externalFocus'])],
    ]))),
  ];
}

function entry(id: string, category: CodexCategoryId, title: string, subtitle: string, search: string, render: () => string, badge?: string): CodexEntry {
  return { id, category, title, subtitle, badge, search: `${title} ${subtitle} ${search}`.toLocaleLowerCase('de'), render };
}

function page(kicker: string, title: string, intro: string, content: string): string {
  return `<article class="codex-page"><header class="codex-page-head"><span>${escapeHtml(kicker)}</span><h2>${escapeHtml(title)}</h2><p>${escapeHtml(intro)}</p></header>${content}</article>`;
}

function sections(items: Array<[string, string]>): string {
  return items.map(([title, content]) => `<section class="codex-section"><h3>${escapeHtml(title)}</h3>${content}</section>`).join('');
}

function statusGrid(items: Array<[string, string]>): string {
  return `<div class="codex-stat-grid">${items.map(([label, value]) => `<div><small>${escapeHtml(label)}</small><strong>${escapeHtml(value)}</strong></div>`).join('')}</div>`;
}

function paragraphs(lines: string[]): string { return lines.map((line) => `<p>${escapeHtml(line)}</p>`).join(''); }
function bullets(lines: string[]): string { return `<ul>${lines.map((line) => `<li>${escapeHtml(line)}</li>`).join('')}</ul>`; }
function numbered(lines: string[]): string { return `<ol>${lines.map((line) => `<li>${escapeHtml(line)}</li>`).join('')}</ol>`; }
function formula(text: string): string { return `<div class="codex-formula">${escapeHtml(text)}</div>`; }
function note(title: string, text: string): string { return `<aside class="codex-note"><strong>${escapeHtml(title)}</strong><p>${escapeHtml(text)}</p></aside>`; }
function codeSources(paths: string[]): string { return `<div class="codex-sources">${paths.map((path) => `<code>${escapeHtml(path)}</code>`).join('')}</div>`; }

function table(headers: string[], rows: Array<Array<string>>): string {
  return `<div class="codex-table-wrap"><table><thead><tr>${headers.map((header) => `<th>${escapeHtml(header)}</th>`).join('')}</tr></thead><tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}

function approachResponses(responses: Record<DialogueApproach, string[]>): string {
  return Object.entries(responses).map(([approach, lines]) => `<details><summary>${escapeHtml(APPROACH_LABELS[approach as DialogueApproach])}</summary>${paragraphs(lines)}</details>`).join('');
}

function romanceHtml(id: RomanceId, snapshot: GameSnapshot, meta: CampaignMetaState): string {
  const profile = ROMANCE_PROFILES[id];
  const state = meta.romance[id];
  return `${paragraphs([profile.description])}${statusGrid([
    ['Interesse', String(Math.round(state.interest))],
    ['Versuche / Erfolge', `${state.attempts} / ${state.successes}`],
    ['Grenzverstöße', String(state.boundaryStrikes)],
    ['Aktuelle Probe', `${flirtChanceSummary(id, snapshot)}/20`],
  ])}${table(['Bereich', 'Wert'], [
    ['Bevorzugte Geschenke', profile.preferredGifts.map((item) => ITEMS[item]?.label ?? item).join(' · ')],
    ['Abgelehnte Geschenke', profile.dislikedGifts.map((item) => ITEMS[item]?.label ?? item).join(' · ')],
    ['Bevorzugte Zustände', profile.prefers.join(' · ')],
    ['Ablehnungsgründe', profile.rejects.join(' · ')],
  ])}${state.lastLine ? note('Letzte Reaktion', stripHtml(state.lastLine)) : ''}`;
}

function flirtChanceSummary(id: RomanceId, snapshot: GameSnapshot): number {
  const profile = ROMANCE_PROFILES[id];
  const modifiers = statusModifiers(snapshot.needs);
  let chance = 7 + Math.round((snapshot.relationships[id] ?? 0) * .08) + Math.round(snapshot.metrics.reputation * .035) + Math.round(modifiers.flirt * .45);
  if (profile.prefers.includes('buzzed') && snapshot.needs.alcohol >= 14 && snapshot.needs.alcohol < 38) chance += 3;
  if (profile.prefers.includes('sober') && snapshot.needs.alcohol < 10 && snapshot.needs.highness < 15) chance += 3;
  if (profile.prefers.includes('high') && snapshot.needs.highness >= 25 && snapshot.needs.highness < 60) chance += 2;
  if (profile.prefers.includes('creative') && snapshot.profile?.trait === 'chaotisch') chance += 2;
  if (profile.prefers.includes('helpful') && snapshot.profile?.trait === 'hilfsbereit') chance += 3;
  if (profile.prefers.includes('sporty') && snapshot.needs.energy >= 65) chance += 2;
  if (profile.rejects.includes('drunk') && snapshot.needs.alcohol >= 38) chance -= 10;
  if (profile.rejects.includes('veryHigh') && snapshot.needs.highness >= 70) chance -= 10;
  if (profile.rejects.includes('hangover') && snapshot.needs.hangover >= 35) chance -= 8;
  if (profile.rejects.includes('chaos') && snapshot.metrics.chaos >= 55) chance -= 5;
  return Math.max(2, Math.min(20, Math.round(chance)));
}

function teamMemberHtml(id: FriendId): string {
  const member = FRIEND_TEAM_MEMBERS[id];
  return table(['Feld', 'Wert'], [
    ['Level', String(member.level)],
    ['Entschlossenheit', `${member.resolve}/${member.maxResolve}`],
    ['Loyalität', String(member.loyalty)],
    ['Kampfbonus', signed(member.bonuses.battle)],
    ['Sozialbonus', signed(member.bonuses.social)],
    ['Spielbonus', signed(member.bonuses.games)],
    ['Erholungsbonus', signed(member.bonuses.recovery)],
  ]);
}

function authorityStateHtml(meta: CampaignMetaState): string {
  return flagTable([
    ['authority-ego-hook', 'Ego gekapert', 'Zustimmung und Kumpelkontakt treffen stärker.'],
    ['authority-gossip-bond', 'Pöbelpakt', 'Witz, Team und Chaos treffen stärker.'],
    ['authority-drinking-bond', 'Wegbierbindung', 'Getränkerituale treffen stärker und Konter werden schwächer.'],
    ['authority-pong-challenge', 'Beer-Pong-Stolz', 'Pong-Duell trifft besonders stark.'],
    ['authority-nacken-calibrated', 'Nackenklatscher kalibriert', 'Nackenklatscher und Pöbelkonter treffen stärker.'],
    ['authority-goodwill', 'Wohlwollen', 'Konter und Heckenverdacht werden reduziert.'],
    ['uli-route-knowledge', 'Routenwissen', 'Patrouillen in der Hecke werden langsamer.'],
  ], meta.flags);
}

function flagTable(rows: Array<[string, string, string]>, flags: Record<string, boolean>): string {
  return table(['Marker', 'Name', 'Aktiv', 'Wirkung'], rows.map(([flag, label, effect]) => [flag, label, yesNo(flags[flag]), effect]));
}

function assistTable(assists: MiniGameDoc['assists'], flags: Record<string, boolean>): string {
  return table(['Quelle', 'Flag', 'Aktiv', 'Wirkung'], assists.map((assist) => [assist.source, assist.flag, yesNo(flags[assist.flag]), assist.effect]));
}

function masteryHtml(id: CombatMoveId, meta: CampaignMetaState): string {
  const mastery = meta.attackMastery[id];
  const uses = mastery?.uses ?? 0;
  const successes = mastery?.successes ?? 0;
  const next = (mastery?.level ?? 1) === 1 ? `${Math.max(0, 4 - uses)} Einsätze und ${Math.max(0, 3 - successes)} Treffer bis M2` : (mastery?.level ?? 1) === 2 ? `${Math.max(0, 9 - uses)} Einsätze und ${Math.max(0, 7 - successes)} Treffer bis M3` : 'Maximale Stufe erreicht';
  return table(['Einsätze', 'Treffer', 'Stufe', 'Spezialisierung', 'Nächster Schritt'], [[String(uses), String(successes), `M${mastery?.level ?? 1}`, branchLabel(mastery?.branch), next]]);
}

function attackPresentation(id: CombatMoveId, teamSize: number): string {
  const lines: Record<CombatMoveId, string> = {
    'classic-high-five': '„Passt, Chef“ plus exakt kalibrierter Kumpel-Nackenklatscher.',
    'aldi-shirt-show': 'Aldi-Shirt wie eine Uniform mit Sondervollmacht präsentieren.',
    'agree-anyway': 'Beide zu den einzigen vernünftigen Menschen erklären und ihre Standpauke verhungern lassen.',
    'logical-argument': 'Das gesamte Argument auf einen feuchten Bierdeckel komprimieren.',
    'dry-counter': 'Nach dem Monolog nur „Stark, Chef“ antworten.',
    'camping-chair-block': 'Im Machtbereich eine unangemeldete Bierbank-Sitzung eröffnen.',
    'beer-offer': 'Ein halbes Bier als Friedensvertrag über den Tisch schieben.',
    'synchronised-cheer': `${teamSize} Stimmen rufen gleichzeitig „JAWOLL CHEF!“`,
    'cup-eye-contact': 'Den Konflikt zum Beer-Pong-Zwangsduell mit öffentlichem Einsatz erklären.',
    'total-exaggeration': 'Eine heroische Platzwartlegende erfinden, die größer ist als jede überprüfbare Realität.',
  };
  return lines[id];
}

function effectivenessLabel(value: number): string {
  if (value >= 1.55) return 'extreme Schwäche';
  if (value >= 1.25) return 'sehr stark';
  if (value <= .72) return 'schwach';
  return 'normal';
}

function anecdoteHtml(id: AnecdoteId, meta: CampaignMetaState): string {
  const anecdote = ANECDOTES[id];
  const unlocked = meta.unlockedAnecdotes.includes(id);
  const equipped = meta.equippedAnecdotes.includes(id);
  return `<article class="codex-anecdote ${unlocked ? 'unlocked' : 'locked'}"><header><div><span>${escapeHtml(id)}</span><h3>${escapeHtml(anecdote.label)}</h3></div><b>${equipped ? 'AUSGERÜSTET' : unlocked ? 'FREI' : 'GESPERRT'}</b></header><p>${escapeHtml(anecdote.detail)}</p><small>${escapeHtml(anecdote.combatText)}</small></article>`;
}

function breakdownHtml(meta: CampaignMetaState): string {
  const wins = Object.values(meta.miniResults).reduce((sum, result) => sum + result.wins, 0);
  const perfects = Object.values(meta.miniResults).filter((result) => result.bestQuality === 'perfect').length;
  const romance = Object.values(meta.romance).reduce((sum, state) => sum + Math.max(0, state.interest), 0);
  const relations = Object.values(meta.relationshipBonus).reduce((sum, value) => sum + value, 0);
  const mastery = Object.values(meta.attackMastery).reduce((sum, state) => sum + ((state?.level ?? 1) - 1) * 5, 0);
  return table(['Quelle', 'Berechnung', 'Beitrag'], [
    ['Einlass', meta.authorityBattleWon ? 'gewonnen' : 'offen', meta.authorityBattleWon ? '25' : '0'],
    ['Strom', meta.powerConnected ? 'verbunden' : 'offen', meta.powerConnected ? '10' : '0'],
    ['Erstes Bier', meta.firstBeerOpened ? 'geöffnet' : 'offen', meta.firstBeerOpened ? '10' : '0'],
    ['Finale', meta.finalBattleWon ? 'gewonnen' : 'offen', meta.finalBattleWon ? '40' : '0'],
    ['Minispielsiege', `${wins} × 12`, String(wins * 12)],
    ['Perfekte Spiele', `${perfects} × 8`, String(perfects * 8)],
    ['Anekdoten', `${meta.unlockedAnecdotes.length} × 5`, String(meta.unlockedAnecdotes.length * 5)],
    ['Meisterschaft', '5 je Stufe über M1', String(mastery)],
    ['Romanzen', `${romance} × 0,18`, (romance * .18).toFixed(1)],
    ['Beziehungen', `${relations} × 0,12`, (relations * .12).toFixed(1)],
    ['Erleichterungen', `${meta.reliefCount} × 3`, String(meta.reliefCount * 3)],
    ['Heckenverdacht', `${meta.suspicion} × −0,15`, (-meta.suspicion * .15).toFixed(1)],
  ]);
}

function synergiesHtml(team: string[]): string {
  const synergies = activeTeamSynergies(team);
  return `<section class="codex-section"><h3>Aktive Synergien</h3>${synergies.length ? table(['Synergie', 'Beschreibung', 'Kampf', 'Sozial', 'Spiele', 'Erholung'], synergies.map((synergy) => [synergy.label, synergy.description, signed(synergy.battle), signed(synergy.social), signed(synergy.games), signed(synergy.recovery)])) : paragraphs(['Für das aktuelle Team ist keine definierte Synergie aktiv.'])}</section>`;
}

function itemSpecificNote(id: string): string {
  if (id === 'klopapier') return note('Questfunktion', 'Kann Manni in der braunen Krise übergeben werden. Manni erhält +18 Beziehung, tritt dem Team bei und verbessert Ruf, Würde sowie Momentum.');
  if (id === 'bier') return note('Zusatzwirkung', 'Beim direkten Benutzen steigt Chaos um 1 und Momentum um 1. Das erste Bier ist zusätzlich eine Kampagnenquest.');
  if (id === 'batida') return note('Zusatzwirkung', 'Beim direkten Benutzen steigt Chaos um 2 und Momentum um 1. Susi lehnt Batida als Geschenk ab.');
  return '';
}

function stageLabel(stage: CampaignQuestStage): string { return QUEST_STAGE_DOCS.find((entry) => entry.id === stage)?.title ?? stage; }
function rankLabel(id: WeekendRankId): string { return WEEKEND_RANKS.find((rank) => rank.id === id)?.label ?? id; }
function yesNo(value: boolean): string { return value ? 'Ja' : 'Nein'; }
function signed(value: number): string { return `${value >= 0 ? '+' : ''}${Math.round(value)}`; }
function needLabel(id: string): string { return NEED_DOCS.find((need) => need.id === id)?.label ?? id; }
function stripHtml(value: string): string { const node = document.createElement('div'); node.innerHTML = value; return node.textContent ?? ''; }

function characterOrder(id: string): number {
  const order = ['gundula', 'uli', 'ronny', 'manni', 'andre', 'rene', 'lars', 'danny', 'gregor', 'masl', 'schubert', 'felix', 'schima', 'susi', 'jule', 'kira'];
  const index = order.indexOf(id);
  return index < 0 ? 999 : index;
}

function statusForNeed(id: keyof Needs, statuses: ReturnType<typeof activeStatuses>): string {
  if (id === 'alcohol') return statuses.find((status) => ['angetrunken', 'betrunken', 'voll'].includes(status.id))?.label ?? 'Kein Alkoholstatus';
  if (id === 'highness') return statuses.find((status) => ['breit', 'sehr-breit'].includes(status.id))?.label ?? 'Klar';
  if (id === 'hangover') return statuses.find((status) => status.id === 'kater')?.label ?? 'Kein Kater';
  if (id === 'energy') return statuses.find((status) => status.id === 'erschoepft')?.label ?? 'Nicht erschöpft';
  if (id === 'thirst') return statuses.find((status) => status.id === 'dehydriert')?.label ?? 'Nicht dehydriert';
  return 'Kein eigener Schwellenstatus';
}

function stageProgressLabel(stage: CampaignQuestStage, current: CampaignQuestStage): string {
  const order = QUEST_STAGE_DOCS.map((entry) => entry.id);
  return order.indexOf(stage) < order.indexOf(current) ? 'Abgeschlossen/vorbei' : 'Noch nicht aktiv';
}

function campaignObjectiveForStage(stage: CampaignQuestStage): string {
  return QUEST_STAGE_DOCS.find((entry) => entry.id === stage)?.objective ?? stage;
}

function completedActivities(meta: CampaignMetaState): number {
  return ['flipCup', 'beerPong', 'flunkyball', 'maslHole', 'hedgePee'].filter((id) => (meta.miniResults[id]?.attempts ?? 0) > 0 || (id === 'hedgePee' && meta.flags.hedgeRelieved)).length;
}

function finaleProgress(meta: CampaignMetaState): number { return Math.min(3, completedActivities(meta)) + (meta.flags.ronnyDefeated ? 1 : 0); }

function interactionKindLabel(kind: 'story' | 'service' | 'minigame' | 'landmark'): string {
  return ({ story: 'Story-Interaktionen', service: 'Versorgung und Ruhe', minigame: 'Minispielorte', landmark: 'Orientierungsorte' } as const)[kind];
}

function interactionKindDescription(kind: 'story' | 'service' | 'minigame' | 'landmark'): string {
  return ({ story: 'Objekte der linearen Ankunftsquest.', service: 'Orte zur Stabilisierung von Bedürfnissen oder für dauerhafte Menüs.', minigame: 'Orte, die ein vollständiges Minispiel oder Frustduell starten.', landmark: 'Zentrale Treffpunkte und Übersichtsorte.' } as const)[kind];
}

function codexShell(): string {
  return `<section id="campaign-codex" class="modal codex-modal" hidden>
    <article class="codex-window">
      <header class="codex-header"><div><span>SPIEL-CODEX · LIVE AUS DEN SYSTEMDATEN</span><h2>Tales of the Blaue Adria</h2><p id="codex-category-copy"></p></div><button id="codex-close" class="modal-x" type="button" aria-label="Codex schließen">×</button></header>
      <div class="codex-tools"><label><span>Alles durchsuchen</span><input id="codex-search" type="search" placeholder="Charakter, Attacke, Wert, Flag oder Regel …" autocomplete="off"></label><b id="codex-count"></b></div>
      <nav id="codex-tabs" class="codex-tabs" aria-label="Codex-Kategorien"></nav>
      <div class="codex-body"><aside id="codex-entry-list" class="codex-entry-list"></aside><main id="codex-detail" class="codex-detail"></main></div>
    </article>
  </section>`;
}

function requireElement<T extends HTMLElement>(id: string): T {
  const node = document.getElementById(id);
  if (!node) throw new Error(`Missing codex element: ${id}`);
  return node as T;
}

function escapeHtml(value: string): string {
  return String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character] ?? character);
}

mountCampaignCodex();
