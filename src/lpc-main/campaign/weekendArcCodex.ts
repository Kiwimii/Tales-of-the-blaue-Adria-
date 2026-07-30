import type { GameSnapshot } from '../../game/types';
import type { CampaignMetaState } from './metaStore';
import { FAREWELL_SONG, VICTORY_SONG } from './weekendArcModel';

interface CodexEntryLike {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  badge?: string;
  search: string;
  render: () => string;
}

export function buildWeekendArcCodexEntries(snapshot: GameSnapshot, meta: CampaignMetaState): CodexEntryLike[] {
  const arc = meta.weekendArc;
  return [
    make('weekend-arc-overview', 'Wochenendbogen', 'Freitag-Olympiade → Samstagentscheidung', 'Olympiade Nachtlärm Räumung Masl Faustkampf Secret Millionär', () => page('VERKNÜPFTE QUESTREIHE', 'Der neue Wochenendbogen', 'Der Bogen ist kein isolierter Nebeninhalt. Minispielresultate, Pegel, Chaos, Beziehungen und Uhrzeit werden über Freitag und Samstag weitergereicht.', stats([
      ['Olympiade', arc.olympiad.completed ? `${arc.olympiad.points} Punkte` : 'offen'],
      ['Nachtlärm', `${arc.nightNoise}/100`],
      ['Bleiberecht', arc.saturday.brawlWon ? 'erkämpft' : arc.saturday.earlyEnding ? 'verloren' : 'offen'],
      ['Secret Millionär', arc.secretMillionaire.completed ? 'beendet' : arc.secretMillionaire.unlocked ? 'freigeschaltet' : 'gesperrt'],
    ]) + sections([
      ['Ablauf', list(['Freitag ab 18:00 Uhr: Trinkspiel-Olympiade.', 'Nachfeier berechnet den endgültigen Nachtlärm.', 'Samstag 08:00 Uhr: Gundula fordert die Räumung.', 'Danny und Felix liefern unterschiedliche Beweise.', 'Andrés Abschiedslied führt direkt zu Masls Weckquest.', 'Masl verändert Diskussion und 2-gegen-2-Faustkampf.', 'Sieg schaltet das Bleibe-Lied und Secret Millionär frei.', 'Niederlage setzt das echte frühe Spielende.'])],
      ['Finalverknüpfung', para('Das Sonntagsfinale kann erst geöffnet werden, wenn der Samstagskampf gewonnen und Secret Millionär beendet wurde. Drei Aktivitäten und Ronny bleiben zusätzlich erforderlich.')],
      ['Codequellen', sources(['src/lpc-main/campaign/weekendArc.ts', 'src/lpc-main/campaign/weekendArcModel.ts', 'src/lpc-main/campaign/metaStore.ts'])],
    ]), arc.saturday.brawlWon ? 'BESTANDEN' : arc.saturday.earlyEnding ? 'ENDE' : 'AKTIV')),
    make('weekend-arc-olympiad', 'Freitag-Olympiade', `${arc.olympiad.points} Punkte`, 'Flip Cup Beer Pong Flunkyball Punkte Nachfeier Pegel', () => page('FREITAG', 'Trinkspiel-Olympiade', 'Drei bestehende Minispiele werden als verbindliche Questdisziplinen orchestriert. Dadurch werden sie ausprobiert, ohne ihre eigentliche Mechanik zu duplizieren.', sections([
      ['Disziplinen', table(['Disziplin', 'Versucht', 'Sieg', 'Qualität', 'Punkte'], Object.entries(arc.olympiad.disciplines).map(([id, result]) => [name(id), yes(result.attempted), yes(result.success), result.quality, String(result.points)]))],
      ['Punkte', table(['Ergebnis', 'Olympiapunkte'], [['Fehlschlag', '0'], ['Chaotischer Sieg', '2'], ['Solider Sieg', '3'], ['Perfekter Sieg', '5']])],
      ['Nachfeier', list(['Ruhig schlafen: negativer Lärmbeitrag, etwas Würde bleibt.', 'Noch eine Runde: Alkohol, Blase, Chaos und Lärm steigen.', 'Volle Nachfeier: stärkster Lärmbeitrag, höchster Pegel und härtester Samstag.'])],
      ['Gesamtwert', para('Bei Abschluss gibt die Olympiade 8 feste Wochenendpunkte plus die erreichten Olympiapunkte. Die normalen Minispielbelohnungen gelten zusätzlich.')],
    ]), arc.olympiad.completed ? 'FERTIG' : 'OFFEN')),
    make('weekend-arc-noise', 'Nachtlärm', `${arc.nightNoise}/100`, 'Formel Alkohol Chaos spät laut Gundula Beweise', () => page('PERSISTENTER ZUSTAND', 'Nachtlärm', 'Der Lärmwert bestimmt, wie glaubwürdig Gundulas Beschwerde und wie stark Gundula/Uli im Faustkampf sind.', formula('Lärm = 8 + Olympiapunkte×2,2 + Nachfeier + Alkohol×0,34 + Chaos×0,28 + späte Aktivitäten×9 − ruhige Erholung') + list(['Nachfeier: −12 ruhig, +19 eine Runde, +34 volle Eskalation.', 'Ergebnis wird auf 0–100 begrenzt.', 'Späte Olympiadendisziplinen erhöhen den Wert zusätzlich.', 'Debattenstartdruck = 42 + Lärm×0,43, reduziert durch vorbereitete Autoritätsmarker.', 'Gegnerkraft im Faustkampf steigt mit Lärm und verbleibendem Rauswurfdruck.']))),
    make('weekend-arc-saturday', 'Acht-Uhr-Räumung', stepLabel(arc.saturday.step), 'Gundula Danny Felix André Lied Masl Diskussion', () => page('SAMSTAG · 08:00', 'Die Acht-Uhr-Räumung', 'Gundula kommt an den Zeltkreis und will die Gruppe wegen der Nacht vom Platz werfen. Die Sequenz blockiert das freie Wochenende, bis eine Entscheidung gefallen ist.', sections([
      ['Beweislage', table(['Element', 'Aktuell', 'Wirkung'], [['Danny', yes(arc.saturday.dannyTestimony), 'Publikumsstark, chaotisch, schwächt Druck moderat.'], ['Felix', yes(arc.saturday.felixTimeline), 'Minutengenaue Zeitlinie, stärkste sachliche Karte.'], ['Abschiedslied', yes(arc.saturday.farewellSongPlayed), 'Öffentlicher Druck und Fremdscham.'], ['Nachtlärm', `${arc.nightNoise}/100`, 'Erhöht Glaubwürdigkeit und gegnerische Kampfkraft.']])],
      ['Questschritte', list(['Gundulas Ultimatum.', 'Danny und Felix anhören.', 'Andrés Lied vollständig abspielen.', 'Masl wecken.', 'Masl überzeugen.', 'Vier Diskussionskarten einsetzen.', 'Faustkampf gewinnen oder vorzeitig abreisen.'])],
      ['Checkpoint', para('Vor der Beschwerde werden Basis- und Metaspielstand als Samstagmorgen-Checkpoint gesichert. Nach einer Niederlage kann genau dieser Punkt erneut geladen werden.')],
    ]), arc.saturday.earlyEnding ? 'VERLOREN' : arc.saturday.brawlWon ? 'GEWONNEN' : 'AKTIV')),
    make('weekend-arc-wake', 'Masl wecken und überzeugen', `${arc.saturday.wakeProgress}/100 Wachheit`, 'Kaffee Zelt schütteln Stimmung Beziehung challenge', () => page('MASL', 'Weck- und Überzeugungssystem', 'Weckfortschritt und Stimmung bilden einen echten Zielkonflikt. Schnelle Methoden schwächen Masls spätere Standfestigkeit.', sections([
      ['Weckaktionen', table(['Aktion', 'Wachheit', 'Stimmung'], [['Ruhig rufen', '+12', '+4'], ['Plane tippen', '+18', '0'], ['Abschiedslied', '+24', '−1'], ['Danny ins Zelt', '+35', '−8'], ['Zelt schütteln', '+30', '−12'], ['Kaffee', '+42', '+10, verbraucht Kaffee']])],
      ['Überzeugungsrouten', table(['Route', 'Bedingung/Folge'], [['Freundschaft', 'Gute Masl-Beziehung oder gewonnenes Komm ans Loch. Beziehung steigt.'], ['Ego', 'Gute Stimmung oder brauchbare Beziehung.'], ['Herausforderung', 'Erfolgt sicher, gibt Chaos und Startladung.'], ['Notfall', 'Garantiert, kostet Beziehung, Stimmung und Würde.']])],
      ['Kampfeffekt', para('Masls Start-HP und Kraft werden aus Weckstimmung und Beziehung berechnet. Die Überzeugungsroute kann zusätzliche Startladung geben.')],
    ]), arc.saturday.maslConvinced ? 'ÜBERZEUGT' : arc.saturday.maslAwake ? 'WACH' : 'SCHLÄFT')),
    make('weekend-arc-debate', 'Letzte Diskussion', `${arc.saturday.debatePressure}/100 Druck`, 'Felix Danny Song Ego Wegbier Lochlogik crowd debate', () => page('DISKUSSION', 'Vier Karten vor dem Faustkampf', 'Die Diskussion verhindert den Faustkampf nicht. Sie verändert Start-HP, Gegnerkraft, Masls Kraft und Publikum.', sections([
      ['Werte', stats([['Rauswurfdruck', `${arc.saturday.debatePressure}/100`], ['Publikum', signed(arc.saturday.debateCrowd)], ['Runden', `${arc.saturday.debateTurns}/4`], ['Verwendet', arc.saturday.debateUsed.join(' · ') || 'nichts']])],
      ['Karten', table(['Karte', 'Kernwirkung'], [['Felix-Zeitlinie', '−19 Druck vorbereitet, sonst −7.'], ['Danny-Gegendarstellung', '−9/−3 Druck, +13 Publikum.'], ['KI-Abschiedslied', '−13 Druck, bei sehr hohem Lärm nur −7; +11 Publikum.'], ['Gundulas Ego', '−17 mit Ego-Marker, sonst −9.'], ['Wegbierlogik', '−15 mit Bindung, sonst −6.'], ['Masls Lochlogik', '−21 mit Komm-ans-Loch-Sieg, sonst −13.']])],
      ['Startvorteil', formula('Debattenvorteil = (100−Druck)×0,28 + Publikum×0,18; begrenzt 0–28. Dieser Wert reduziert Gundulas und Ulis Start-HP.')],
    ])),
    make('weekend-arc-brawl', 'Faustrecht an der Schranke', arc.saturday.brawlWon ? 'gewonnen' : arc.saturday.earlyEnding ? 'verloren' : `${arc.saturday.brawlAttempts} Versuch(e)`, 'Faustkampf Standfestigkeit blocken ausweichen Masl Tunnel', () => page('2-GEGEN-2', 'Faustkampf', 'Der Kampf ist überzeichnet und arbeitet mit Standfestigkeit statt realistischer Verletzung.', sections([
      ['Steuerung', table(['Aktion', 'Eingabe', 'Wirkung'], [['Schlagen', 'Button / Leertaste', 'Timing in der Mitte verursacht 26 statt 19/12 Schaden.'], ['Blocken', 'Button / Shift', 'Nächster Schaden ×0,32.'], ['Ausweichen', 'Button', 'Gutes Timing verhindert Schaden; perfektes Timing betäubt.'], ['Masl-Tunnel', 'Button / E', 'Ab 3 Ladung: trifft beide und unterbricht Gegenzug.']])],
      ['Gegner', list(['Gundula: Klemmbrett-Schelle, Brillenrand-Finte, Handtaschen-Haken, RUNTER VOM PLATZ.', 'Uli: Schlüsselbund-Schwinger, Bierbauch-Ramme, Kumpel-Nackenklatscher, SPORTSFREUND.'])],
      ['Ausgang', list(['Sieg: +35 Wochenendpunkte, Bleiberecht, starke Masl-Beziehung, Secret Millionär.', 'Niederlage: earlyEvictionEnding, echtes vorzeitiges Ende und Abschiedslied.'])],
    ])),
    make('weekend-arc-songs', 'Andrés KI-Lieder', `${arc.saturday.farewellSongPlayed ? 'Abschied gehört' : 'Abschied offen'} · ${arc.saturday.victorySongPlayed ? 'Bleibe gehört' : 'Bleibe offen'}`, 'Goodbye Adria Lied lyrics Chorus Andre', () => page('MUSIKALISCHE STORY', 'Zwei feste Lieder', 'Beide Texte sind vollständig offline im Build gespeichert. Das Abschiedslied wird vor Masls Weckquest und im frühen Ende verwendet; das Bleibe-Lied nach dem gewonnenen Faustkampf.', sections([
      ['Abschiedsversion', `<details><summary>Vollständigen Text anzeigen</summary><pre class="codex-song">${esc(FAREWELL_SONG)}</pre></details>`],
      ['Bleibeversion', `<details><summary>Vollständigen Text anzeigen</summary><pre class="codex-song">${esc(VICTORY_SONG)}</pre></details>`],
      ['Technik', para('Keine externe KI- oder Audioverbindung. Die Texte werden als Story- und Karaokeelemente gerendert; eine spätere Audiodatei kann an dieselben IDs angebunden werden.')],
    ])),
    make('weekend-arc-secret', 'Secret Millionär', arc.secretMillionaire.completed ? `beendet · ${arc.secretMillionaire.winner}` : `${arc.secretMillionaire.round}/4`, 'goldener Kronkorken hidden role accuse elimination main prize', () => page('SAMSTAGSSPIEL', 'Secret Millionär – Der goldene Kronkorken', 'Die Browserfassung übernimmt das frühere gemeinsame Konzept und reduziert es auf vier lesbare Deduktionsrunden.', sections([
      ['Verbindliche Regeln', list(['Zwölf aktive Figuren; André ist Spielleiter.', 'Vier geheime Abstimmungen mit 1, 2, 3 und 4 Punkten.', 'Punktestand und Richtigkeit bleiben bis zur Auflösung geheim.', 'Jede beschuldigte Person scheidet aus dem Gewinnpool aus – auch wenn sie unschuldig ist.', 'Ausgeschiedene Figuren können den Hauptpreis nicht mehr über Punkte gewinnen.', 'Es gibt nur einen Hauptpreis, keine Trost- oder Nebenpreise.', 'Missionen und konkrete Vorteile des Millionärs bleiben absichtlich verborgen und werden im Codex nicht offengelegt.'])],
      ['Browserablauf', list(['Pro Runde drei indirekte Beobachtungen.', 'Zwei Befragungen.', 'Eine Beschuldigung beendet die Runde.', 'Bereits Beschuldigte bleiben als Figuren im Spiel, können aber nicht erneut aus dem Gewinnpool fliegen.', 'Nach Runde vier: Rolle, Punkte und Hauptgewinner werden aufgedeckt.'])],
      ['Aktueller Stand', table(['Feld', 'Wert'], [['Runde', String(arc.secretMillionaire.round)], ['Eigene Punkte', String(arc.secretMillionaire.playerScore)], ['Rivalenpunkte', String(arc.secretMillionaire.rivalScore)], ['Ausgeschieden', arc.secretMillionaire.eliminated.join(' · ') || 'niemand'], ['Gewinner', arc.secretMillionaire.winner || 'offen']])],
      ['Designgrundlage', para('Die Browserfassung nutzt die Kernprinzipien versteckte Identität, asymmetrische Information, Diskussion und geheime Abstimmung. Ähnliche Hidden-Role-Spiele strukturieren Spannung ebenfalls über geheime Rollen, Diskussion, Teamwahl oder Abstimmungen; hier bleibt die eigene Ausscheidungs- und Punkteidee maßgeblich.')],
    ]), arc.secretMillionaire.completed ? 'FERTIG' : arc.secretMillionaire.unlocked ? 'FREI' : 'GESPERRT')),
  ];
}

function make(id: string, title: string, subtitle: string, keywords: string, render: () => string, badge?: string): CodexEntryLike {
  return { id, category: 'weekend', title, subtitle, badge, search: `${title} ${subtitle} ${keywords}`.toLocaleLowerCase('de'), render };
}
function page(kicker: string, title: string, intro: string, content: string): string { return `<article class="codex-page"><header class="codex-page-head"><span>${esc(kicker)}</span><h2>${esc(title)}</h2><p>${esc(intro)}</p></header>${content}</article>`; }
function sections(items: Array<[string, string]>): string { return items.map(([title, content]) => `<section class="codex-section"><h3>${esc(title)}</h3>${content}</section>`).join(''); }
function stats(items: Array<[string, string]>): string { return `<div class="codex-stat-grid">${items.map(([label, value]) => `<div><small>${esc(label)}</small><strong>${esc(value)}</strong></div>`).join('')}</div>`; }
function table(headers: string[], rows: string[][]): string { return `<div class="codex-table-wrap"><table><thead><tr>${headers.map((item) => `<th>${esc(item)}</th>`).join('')}</tr></thead><tbody>${rows.map((row) => `<tr>${row.map((item) => `<td>${esc(item)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`; }
function list(items: string[]): string { return `<ul>${items.map((item) => `<li>${esc(item)}</li>`).join('')}</ul>`; }
function para(text: string): string { return `<p>${esc(text)}</p>`; }
function formula(text: string): string { return `<div class="codex-formula">${esc(text)}</div>`; }
function sources(items: string[]): string { return `<div class="codex-sources">${items.map((item) => `<code>${esc(item)}</code>`).join('')}</div>`; }
function yes(value: boolean): string { return value ? 'Ja' : 'Nein'; }
function signed(value: number): string { return `${value >= 0 ? '+' : ''}${Math.round(value)}`; }
function name(id: string): string { return ({ flipCup: 'Flip Cup', beerPong: 'Beer Pong', flunkyball: 'Flunkyball' } as Record<string, string>)[id] ?? id; }
function stepLabel(step: string): string { return ({ dormant: 'wartet', complaint: 'Gundula motzt', testimonies: 'Zeugen', song: 'Lied', wake: 'Masl wecken', convince: 'Masl überzeugen', debate: 'Diskussion', brawl: 'Faustkampf', won: 'Bleiberecht', evicted: 'Rauswurf' } as Record<string, string>)[step] ?? step; }
function esc(value: string): string { return String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char] ?? char); }
