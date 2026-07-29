import type { GameSnapshot, Needs, WeekendMetrics } from '../../game/types';
import type { CampaignMetaState } from './metaStore';

export type DialogueApproach = 'listen' | 'joke' | 'challenge' | 'help';
export type DialogueTopic = 'weekend' | 'personal' | 'plan';

export interface VoiceChoice {
  id: string;
  label: string;
  hint: string;
  topic: DialogueTopic;
  approach: DialogueApproach;
  risk: 'safe' | 'balanced' | 'risky';
}

export interface CharacterVoice {
  id: string;
  name: string;
  role: string;
  portrait: string;
  cadence: string;
  values: string[];
  irritants: string[];
  likes: DialogueApproach[];
  dislikes: DialogueApproach[];
  openings: string[];
  returning: string[];
  choices: VoiceChoice[];
  positive: Record<DialogueApproach, string[]>;
  negative: Record<DialogueApproach, string[]>;
  personalReveal: string;
  consequenceFlag?: string;
  assistLabel?: string;
}

export interface VoiceConsequence {
  relationship: number;
  success: boolean;
  text: string;
  needs?: Partial<Needs>;
  metrics?: Partial<WeekendMetrics>;
  flags?: Record<string, boolean>;
  ripples?: Array<{ id: string; delta: number }>;
  followUp?: string;
}

const choice = (
  id: string,
  label: string,
  hint: string,
  topic: DialogueTopic,
  approach: DialogueApproach,
  risk: VoiceChoice['risk'],
): VoiceChoice => ({ id, label, hint, topic, approach, risk });

export const CHARACTER_VOICES: Record<string, CharacterVoice> = {
  andre: {
    id: 'andre', name: 'André', role: 'KI-Bastler mit zu vielen Tabs', portrait: 'A',
    cadence: 'schnell, begeistert, mit drei Nebensätzen und einem unfertigen Prototyp',
    values: ['Ideen', 'Technik', 'Improvisation'], irritants: ['reine Bedenkenträger', 'unkonkrete Kritik'],
    likes: ['listen', 'help', 'joke'], dislikes: ['challenge'],
    openings: [
      '„Ich habe eine Lösung. Genau genommen vier. Keine davon ist vollständig ungefährlich.“',
      'André schaut auf sein Handy, den Stromkasten und wieder auf sein Handy. „Das lässt sich automatisieren.“',
      '„Kurze Frage: Wie schlimm wäre es, wenn wir das Wochenende als Prototyp betrachten?“',
    ],
    returning: ['„Ich habe die Idee von eben weitergedacht. Das war objektiv ein Fehler.“', '„Der Prototyp läuft. Also: Er startet.“'],
    choices: [
      choice('andre-prototype', 'Nach dem Prototyp fragen und tatsächlich zuhören', 'Sicher · Kreativität und Vertrauen', 'personal', 'listen', 'safe'),
      choice('andre-finish', 'Eine seiner Ideen bis zu einem echten nächsten Schritt planen', 'Hilft später bei Orientierung und Minispielen', 'plan', 'help', 'balanced'),
      choice('andre-tabs', 'Ihn auf seine zwölf offenen Projekte festnageln', 'Riskant · kann als guter Konter oder Angriff landen', 'weekend', 'challenge', 'risky'),
      choice('andre-song', 'Die Situation sofort in einen schlechten KI-Song verwandeln', 'Humor · Mut und Gruppendynamik', 'weekend', 'joke', 'balanced'),
    ],
    positive: {
      listen: ['André erklärt nicht nur die Idee, sondern auch warum sie ihm wichtig ist. Du unterbrichst ihn überraschend selten.'],
      help: ['Ihr streicht elf Nebenideen und behaltet eine umsetzbare. André nennt das radikale Produktstrategie.'],
      joke: ['Der improvisierte Refrain ist schlecht genug, um sofort von der Gruppe übernommen zu werden.'],
      challenge: ['André verteidigt seine Ideen schnell, erkennt dann aber einen echten Punkt und schreibt ihn in eine Notiz, die später niemand findet.'],
    },
    negative: {
      listen: ['Du hörst nur auf die Stelle, an der du selbst wieder reden kannst. André bemerkt es.'],
      help: ['Aus Planung wird ein zweites Projekt. Das erste bleibt emotional unterstützt, aber praktisch allein.'],
      joke: ['Der Witz klingt wie Kritik mit Melodie. André lacht erst, als das Thema vorbei ist.'],
      challenge: ['Du nennst seine Ideen „Spielerei“. Das Gespräch friert schneller ein als ein schlecht optimierter Browser.'],
    },
    personalReveal: 'André gibt zu, dass neue Ideen leichter sind als eine Sache konsequent fertigzustellen.',
    consequenceFlag: 'assist-idea-map', assistLabel: 'Andrés Prototypkarte zeigt in Minispielen kurz optimale Bereiche.',
  },
  rene: {
    id: 'rene', name: 'René', role: 'großer Bruder und akustische Naturgewalt', portrait: 'R',
    cadence: 'laut, direkt, beschützend und überzeugt, dass Lautstärke eine Form der Beweisführung ist',
    values: ['Familie', 'Loyalität', 'gemeinsame Eskalation'], irritants: ['Drückeberger', 'leise Ausreden'],
    likes: ['joke', 'help', 'listen'], dislikes: ['challenge'],
    openings: ['„WIE HEISST DER HUND?“ René deutet auf keinen sichtbaren Hund.', '„NACHHOLEN!“ Es ist unklar, was genau. Die Gruppe reagiert trotzdem.', 'René klopft dir auf die Schulter. Dein Oberkörper interpretiert das als Ereignis.'],
    returning: ['„Da bist du ja. Ich habe das Gespräch ohne dich lauter weitergeführt.“', '„Nur kurz: Wir müssen nachholen.“'],
    choices: [
      choice('rene-dog', '„WIE HEISST DER HUND?“ mit voller Überzeugung zurückrufen', 'Humor · hohe Gruppendynamik', 'weekend', 'joke', 'balanced'),
      choice('rene-family', 'Nach Familie fragen und die Lautstärke nicht kommentieren', 'Sicher · persönliches Vertrauen', 'personal', 'listen', 'safe'),
      choice('rene-command', 'René zum Aufbaukommandeur machen', 'Hilft Teamaktionen und Flip Cup', 'plan', 'help', 'balanced'),
      choice('rene-volume', 'Behaupten, Lautstärke ersetze keine Argumente', 'Sehr riskant, technisch korrekt', 'weekend', 'challenge', 'risky'),
    ],
    positive: {
      listen: ['René wird für zwei Minuten leiser und erzählt ernsthaft von Familie und Verantwortung. Niemand filmt es.'],
      help: ['René verteilt Aufgaben so laut, dass selbst Abwesende kurz ein schlechtes Gewissen bekommen.'],
      joke: ['Die absurde Frage wird zum Gruppenruf. Selbst Leute ohne Kontext antworten.'],
      challenge: ['René lacht über den Widerstand und respektiert, dass du stehen bleibst.'],
    },
    negative: {
      listen: ['Du fragst persönlich und schaust gleichzeitig auf dein Handy. René nennt das „komische Priorität“.'],
      help: ['Du gibst ihm Verantwortung, widersprichst aber jeder Anweisung. Das Konzept stirbt laut.'],
      joke: ['Der Rückruf kommt halbherzig. René erkennt fehlende Hingabe sofort.'],
      challenge: ['Du sagst ihm, er solle leiser sein. Der Satz verlängert das Gespräch um elf Minuten.'],
    },
    personalReveal: 'René gibt zu, dass er Verantwortung häufig in Lautstärke verpackt, weil Unsicherheit darin schlechter zu hören ist.',
    consequenceFlag: 'assist-team-shout', assistLabel: 'Renés Gruppenruf stabilisiert Staffel- und Teamaktionen.',
  },
  lars: {
    id: 'lars', name: 'Lars', role: 'Technik-Schnäppchenjäger und selbsternannter Sportler', portrait: 'L',
    cadence: 'analytisch, preisbewusst und mit überraschend konkreten Vergleichen zu Drei-Euro-Produkten',
    values: ['Preis-Leistung', 'Technik', 'Schildkröten'], irritants: ['teure Lösungen', 'andere Tiere'],
    likes: ['help', 'joke', 'listen'], dislikes: ['challenge'],
    openings: ['„Die Brille hat drei Euro gekostet. Für den Preis muss sie gut sein.“', 'Lars prüft den Becherrand wie ein Materialgutachter ohne Auftrag.', '„Ich sage nicht, dass ich Sportler bin. Ich dokumentiere nur den offensichtlichen Zustand.“'],
    returning: ['„Ich habe nachgerechnet. Wir hätten zwölf Prozent günstiger scheitern können.“', '„Die Brille hält noch. Das Gespräch kann weitergehen.“'],
    choices: [
      choice('lars-deal', 'Nach dem besten Schnäppchen des Wochenendes fragen', 'Sicher · Lars redet gern über Preis-Leistung', 'weekend', 'listen', 'safe'),
      choice('lars-cup', 'Mit ihm den perfekten Becherüberstand vermessen', 'Minispielhilfe für Flip Cup', 'plan', 'help', 'safe'),
      choice('lars-sport', 'Seinen Sportlerstatus einer kurzen Prüfung unterziehen', 'Riskanter Humor', 'weekend', 'joke', 'balanced'),
      choice('lars-animals', 'Behaupten, Schildkröten seien auch nur langsame Tiere', 'Unnötig riskant', 'personal', 'challenge', 'risky'),
    ],
    positive: {
      listen: ['Lars erzählt ausführlich, wie man mit wenig Geld erstaunlich brauchbare Ausrüstung findet. Zwei Beispiele sind tatsächlich gut.'],
      help: ['Ihr markiert den idealen Becherüberstand. Lars nennt das eine kostenlose Qualitätssteigerung.'],
      joke: ['Lars verteidigt seine Sportlichkeit mit Messwerten, die zufällig kurz vor der Anstrengung enden.'],
      challenge: ['Er nimmt die Herausforderung an und beginnt sofort mit einer Tabelle. Das gilt bei Lars als Respekt.'],
    },
    negative: {
      listen: ['Du nennst jedes Schnäppchen billig. Lars beendet das Gespräch aus wirtschaftsethischen Gründen.'],
      help: ['Du schlägst eine teure Spezialausrüstung vor. Lars hört nur den Preis und verliert den Rest des Satzes.'],
      joke: ['Der Sportwitz trifft einen Bereich, den Lars statistisch noch nicht freigegeben hat.'],
      challenge: ['Die Schildkrötenbemerkung überschreitet eine klar erkennbare rote Linie.'],
    },
    personalReveal: 'Lars gesteht, dass er Schnäppchen nicht nur wegen des Geldes mag, sondern weil ein guter Fund sich wie ein kleiner Sieg gegen das System anfühlt.',
    consequenceFlag: 'assist-flip-edge', assistLabel: 'Lars markiert beim Flip Cup den optimalen Überstand.',
  },
  danny: {
    id: 'danny', name: 'Danny', role: 'Sprinter mit vorformulierter Sonntagsflucht', portrait: 'D',
    cadence: 'kurz, trocken und immer so, als müsse er in fünf Minuten wirklich los',
    values: ['Tempo', 'Sport', 'Schildkröten'], irritants: ['Nachholen', 'Aufräumpläne für Sonntag'],
    likes: ['challenge', 'joke', 'help'], dislikes: ['listen'],
    openings: ['„Ich muss Sonntag wirklich früh los.“ Es ist Freitag.', 'Danny steht bereits so, als wäre das Gespräch ein Startblock.', '„Kurz. Ich habe später noch einen Fluchtweg zu prüfen.“'],
    returning: ['„Noch da? Gut. Ich auch. Vorläufig.“', '„Das Gespräch hat eine akzeptable Zwischenzeit.“'],
    choices: [
      choice('danny-race', 'Ihn zu einer kurzen Sprintwette provozieren', 'Riskant, aber charaktergerecht', 'weekend', 'challenge', 'balanced'),
      choice('danny-route', 'Mit ihm die schnellste Flunkyball-Laufroute planen', 'Direkte Minispielhilfe', 'plan', 'help', 'safe'),
      choice('danny-sunday', 'Seine Sonntagsflucht wie einen Staatsbesuch behandeln', 'Humor · kann treffen', 'weekend', 'joke', 'balanced'),
      choice('danny-feelings', 'Acht Minuten über Gefühle sprechen wollen', 'Für Danny eher Belastungstest', 'personal', 'listen', 'risky'),
    ],
    positive: {
      listen: ['Danny antwortet knapp, aber ehrlich. Dass er nicht wegläuft, ist bereits ein vollständiger Absatz.'],
      help: ['Ihr zeichnet eine Laufroute ohne unnötige Kurven. Danny akzeptiert den Plan, weil er weniger Zeit kostet.'],
      joke: ['Danny ergänzt seine Abreise um Sicherheitseskorte und diplomatische Immunität.'],
      challenge: ['Er grinst, nimmt die Wette an und respektiert, dass du das Ergebnis nicht vorher relativierst.'],
    },
    negative: {
      listen: ['Du eröffnest mit „Lass uns tief gehen“. Danny prüft sichtbar alternative Ausgänge.'],
      help: ['Dein Plan enthält eine Besprechung vor der Besprechung. Danny ist gedanklich bereits abgereist.'],
      joke: ['Der Abreisewitz wirkt wie ein versteckter Aufräumauftrag. Danny wird sofort defensiv.'],
      challenge: ['Du provozierst ihn und erklärst danach, dass du eigentlich nicht laufen möchtest. Das ist für Danny Betrug.'],
    },
    personalReveal: 'Danny sagt, dass frühes Gehen oft einfacher ist, als irgendwo lange genug zu bleiben, um verantwortlich zu werden.',
    consequenceFlag: 'assist-flunky-sprint', assistLabel: 'Danny zeigt im Flunkyball eine schnellere Verteidigungslinie.',
  },
  gregor: {
    id: 'gregor', name: 'Gregor', role: 'Programmierer und belastbarer Problemlöser', portrait: 'G',
    cadence: 'ruhig, logisch und mit der Tendenz, Gefühle als schlecht dokumentierte Zustände zu beschreiben',
    values: ['Logik', 'Hilfsbereitschaft', 'saubere Fehlerbilder'], irritants: ['unklare Anforderungen', 'unnötige Dramatik'],
    likes: ['help', 'listen', 'challenge'], dislikes: ['joke'],
    openings: ['„Das ist kein Problem. Das ist nur ein schlecht dokumentierter Zustand.“', 'Gregor schaut auf die Situation wie auf einen Bug, der sich reproduzieren lässt.', '„Was genau war der erwartete Ausgang?“'],
    returning: ['„Ich habe den Fehler eingegrenzt. Er sitzt teilweise vor dem Campingstuhl.“', '„Der Zustand ist stabiler. Nicht gut, aber reproduzierbar.“'],
    choices: [
      choice('gregor-debug', 'Die aktuelle Wochenendkatastrophe mit ihm debuggen', 'Sicher · konkrete Problemlösung', 'plan', 'help', 'safe'),
      choice('gregor-real', 'Nachfragen, wann er selbst Hilfe annimmt', 'Persönlich · braucht Vertrauen', 'personal', 'listen', 'balanced'),
      choice('gregor-proof', 'Eine seiner Annahmen sachlich widerlegen', 'Herausforderung ohne Drama', 'weekend', 'challenge', 'balanced'),
      choice('gregor-bug', 'Den Grill als Produktionsfehler bezeichnen', 'Humor ist nicht seine stärkste Schnittstelle', 'weekend', 'joke', 'risky'),
    ],
    positive: {
      listen: ['Gregor spricht darüber, wie anstrengend es ist, immer derjenige zu sein, der Probleme ruhig löst.'],
      help: ['Ihr zerlegt die Lage in drei konkrete Schritte. Zwei davon werden später tatsächlich erledigt.'],
      joke: ['Der Witz ist trocken genug, dass Gregor ihn nach kurzer Prüfung akzeptiert.'],
      challenge: ['Gregor prüft deinen Einwand, korrigiert seine Annahme und wirkt eher zufrieden als beleidigt.'],
    },
    negative: {
      listen: ['Du fragst persönlich und beantwortest die Frage sofort selbst. Gregor markiert den Dialog innerlich als fehlerhaft.'],
      help: ['Deine Problembeschreibung besteht nur aus „geht nicht“. Gregor verlangt verwertbare Schritte.'],
      joke: ['Der Witz ersetzt eine konkrete Information. Gregor lehnt den Commit ab.'],
      challenge: ['Du widersprichst ohne Begründung. Für Gregor ist das keine Meinung, sondern fehlende Dokumentation.'],
    },
    personalReveal: 'Gregor sagt, dass Verlässlichkeit manchmal dazu führt, dass andere vergessen, ihn überhaupt zu fragen, wie es ihm geht.',
    consequenceFlag: 'assist-precision', assistLabel: 'Gregors Analyse blendet bei Präzisionsspielen eine kurze Flugbahn ein.',
  },
  masl: {
    id: 'masl', name: 'Masl', role: 'Platzverteidiger und alternative Regelauslegung', portrait: 'M',
    cadence: 'ruhig, beharrlich und juristisch kreativ, selbst wenn der Satz gerade in Rauch steht',
    values: ['Loyalität', 'Gruppenschutz', 'Regelspielraum'], irritants: ['kampfloses Aufgeben', 'zu enge Auslegung'],
    likes: ['challenge', 'help', 'listen'], dislikes: ['joke'],
    openings: ['„Das steht da so. Es bedeutet nur nicht das, was Gundula denkt.“', 'Masl zieht an einer unsichtbaren Argumentationslinie. „Da ist Spielraum.“', '„Bevor wir anfangen: Welche Version der Regel gilt gerade?“'],
    returning: ['„Ich habe noch einmal darüber nachgedacht. Die Regel ist jetzt günstiger.“', '„Der Fall ist nicht abgeschlossen. Er ist nur entspannter.“'],
    choices: [
      choice('masl-rule', 'Mit ihm eine Regel bis zur Unkenntlichkeit auslegen', 'Charaktergerecht · stärkt Kampfkontrolle', 'weekend', 'challenge', 'safe'),
      choice('masl-help', 'Ihn um Schutz bei der nächsten Platzdiskussion bitten', 'Team- und Kampfhilfe', 'plan', 'help', 'safe'),
      choice('masl-hole', 'Nach der Theorie hinter „Komm ans Loch“ fragen', 'Persönlich und spielrelevant', 'personal', 'listen', 'balanced'),
      choice('masl-smoke', 'Behaupten, der Rauch mache seine Argumente nur langsamer', 'Riskanter Humor', 'weekend', 'joke', 'risky'),
    ],
    positive: {
      listen: ['Masl erklärt die Technik nicht als Konsum, sondern als Frage von Abdichtung, Vertrauen und unnötig viel Ernst.'],
      help: ['Masl verspricht, beim nächsten Verwaltungsangriff neben dir stehen zu bleiben. Das ist seine Form von Vertrag.'],
      joke: ['Masl lacht spät, aber ehrlich. Der Witz musste erst durch mehrere Auslegungen.'],
      challenge: ['Ihr zerlegt die Regel gemeinsam, bis sie euch nicht mehr eindeutig widerspricht.'],
    },
    negative: {
      listen: ['Du fragst nach seiner Technik und machst dich gleichzeitig darüber lustig. Masl schließt die Lehrveranstaltung.'],
      help: ['Du bittest um Unterstützung, willst aber keine Verantwortung übernehmen. Masl verteidigt keine reine Bequemlichkeit.'],
      joke: ['Der Witz trifft nicht den Rauch, sondern Masls Loyalität.'],
      challenge: ['Du erklärst die Regel für eindeutig. Masl betrachtet das als persönliche Beleidigung der Sprache.'],
    },
    personalReveal: 'Masl sagt, dass er Regeln nicht aus Prinzip bekämpft, sondern weil Gruppen ohne jemanden dazwischen oft von den Lautesten überfahren werden.',
    consequenceFlag: 'assist-masl-seal', assistLabel: 'Masls Hinweis verbreitert beim Loch kurz den stabilen Abdichtungsbereich.',
  },
  schubert: {
    id: 'schubert', name: 'Schubert', role: 'Physio im Energiesparmodus', portrait: 'S',
    cadence: 'müde, fachlich und mit der Gelassenheit eines Mannes, der sich jederzeit hinlegen könnte',
    values: ['Regeneration', 'Körpergefühl', 'Ruhe'], irritants: ['unnötiges Durchziehen', 'medizinische Selbstüberschätzung'],
    likes: ['listen', 'help'], dislikes: ['challenge', 'joke'],
    openings: ['„Deine Haltung ist schlecht. Meine Wachheit aber auch.“', 'Schubert mustert deinen Rücken und gähnt professionell.', '„Bevor wir reden: Trink Wasser und stell dich gerade hin.“'],
    returning: ['„Die Haltung ist unverändert. Das Gespräch darf trotzdem weitergehen.“', '„Ich war kurz weg. Körperlich nur teilweise.“'],
    choices: [
      choice('schubert-check', 'Eine ehrliche Zustandsanalyse zulassen', 'Sicher · kann Bedürfnisse stabilisieren', 'personal', 'listen', 'safe'),
      choice('schubert-recovery', 'Mit ihm eine echte Erholungspause planen', 'Regeneration und Katerkontrolle', 'plan', 'help', 'safe'),
      choice('schubert-gaming', 'Gaming als physiotherapeutische Maßnahme verkaufen', 'Leichter Humor', 'weekend', 'joke', 'balanced'),
      choice('schubert-awake', 'Seine Wachheit öffentlich anzweifeln', 'Unnötige Provokation', 'weekend', 'challenge', 'risky'),
    ],
    positive: {
      listen: ['Schubert erklärt deinen Zustand ohne Drama. Das allein senkt den gefühlten Schaden.'],
      help: ['Ihr plant Wasser, Essen und zwanzig Minuten Ruhe. Das Konzept ist verdächtig vernünftig.'],
      joke: ['Schubert akzeptiert Gaming als passive Regeneration unter Vorbehalt.'],
      challenge: ['Er hebt eine Augenbraue. Das zählt bei seinem Energielevel als intensive Reaktion.'],
    },
    negative: {
      listen: ['Du fragst nach Einschätzung und ignorierst jeden Satz. Schubert spart die restliche Energie.'],
      help: ['Du planst Erholung direkt nach drei weiteren Spielen. Schubert verweigert die medizinische Abnahme.'],
      joke: ['Der Witz über Bluthochdruck landet unnötig nah an einer echten Grenze.'],
      challenge: ['Du nennst Müdigkeit fehlenden Ehrgeiz. Schubert beendet die Sitzung.'],
    },
    personalReveal: 'Schubert sagt, dass Ruhe für ihn nicht Faulheit ist, sondern oft die einzige Möglichkeit, für andere wieder belastbar zu werden.',
    consequenceFlag: 'assist-recovery', assistLabel: 'Schuberts Rat reduziert nach Minispielen Energie- und Katerfolgen.',
  },
  felix: {
    id: 'felix', name: 'Felix', role: 'Geschichtenerzähler mit sinkendem Wahrheitsanteil', portrait: 'F',
    cadence: 'offen, motivierend und mit Details, die sich während des Satzes vermehren',
    values: ['Geschichten', 'Spiele', 'soziale Energie'], irritants: ['zu frühe Faktenprüfung', 'komplette Spielverweigerung'],
    likes: ['joke', 'listen', 'help'], dislikes: ['challenge'],
    openings: ['„Das ist wirklich passiert. Nur Ort, Zeit und Beteiligte waren anders.“', 'Felix beginnt eine Geschichte mit „Ganz kurz“. Niemand glaubt an das Zeitmaß.', '„Ich kann das erklären. Die Erklärung macht es nur größer.“'],
    returning: ['„Ich habe die Geschichte korrigiert. Sie ist jetzt besser und weniger wahr.“', '„Wo waren wir? Wahrscheinlich beim glaubwürdigen Teil.“'],
    choices: [
      choice('felix-story', 'Eine Geschichte bis zum Ende hören, ohne Faktencheck', 'Sicher · stärkt Vertrauen', 'personal', 'listen', 'safe'),
      choice('felix-redemption', 'Mit ihm eine Beer-Pong-Aufholgeschichte planen', 'Kann eine Redemption retten', 'plan', 'help', 'safe'),
      choice('felix-bigger', 'Seine Geschichte noch absurder weitererzählen', 'Humor und Gruppendynamik', 'weekend', 'joke', 'balanced'),
      choice('felix-proof', 'Jedes Detail sofort überprüfen', 'Riskant · trifft seine Schwäche direkt', 'weekend', 'challenge', 'risky'),
    ],
    positive: {
      listen: ['Du lässt die Geschichte stehen, obwohl mindestens zwei Ortsangaben unmöglich sind. Felix merkt die Geduld.'],
      help: ['Ihr vereinbart ein klares Aufholritual für den letzten Becher. Felix nennt es dramaturgische Vorbereitung.'],
      joke: ['Ihr steigert die Geschichte gemeinsam, bis sogar Felix kurz nachfragt, ob das wirklich passiert ist.'],
      challenge: ['Felix gibt einen Fehler zu und ersetzt ihn sofort durch zwei bessere Details.'],
    },
    negative: {
      listen: ['Du unterbrichst an jeder Stelle, die nach Übertreibung klingt. Das Gespräch besteht bald nur noch aus Unterbrechungen.'],
      help: ['Du planst die Aufholjagd so nüchtern, dass Felix keine Geschichte mehr darin erkennt.'],
      joke: ['Du machst die Pointe auf seine Kosten statt mit ihm.'],
      challenge: ['Der vollständige Faktencheck nimmt der Geschichte genau den Teil, wegen dem sie erzählt wurde.'],
    },
    personalReveal: 'Felix erzählt, dass die Geschichten größer werden, weil gemeinsame Erinnerungen sich für ihn besser anfühlen, wenn alle darin eine Rolle bekommen.',
    consequenceFlag: 'assist-pong-redemption', assistLabel: 'Felix gewährt beim Beer Pong eine zusätzliche Redemption-Chance.',
  },
  schima: {
    id: 'schima', name: 'Schima', role: 'Versorgungsbus mit menschlichem Fahrer', portrait: 'S',
    cadence: 'pragmatisch, ruhig und immer kurz vor dem Satz „Hab ich im Bus“',
    values: ['Ausrüstung', 'Vorräte', 'Improvisation'], irritants: ['schlechte Beschriftung', 'unnötiger Neukauf'],
    likes: ['help', 'listen', 'joke'], dislikes: ['challenge'],
    openings: ['„Hab ich im Bus. Ich weiß nur nicht in welcher Kiste.“', 'Schima blickt zum Bus. Der Bus blickt mit dreißig Kisten zurück.', '„Bevor du etwas kaufst: Ich habe wahrscheinlich zwei davon.“'],
    returning: ['„Ich habe die Kiste gefunden. Es war die falsche, aber interessant.“', '„Der Bus ist jetzt besser sortiert. Theoretisch.“'],
    choices: [
      choice('schima-bus', 'Nach der absurdesten Sache im Bus fragen', 'Sicher · gute Geschichte und Versorgung', 'weekend', 'listen', 'safe'),
      choice('schima-sort', 'Mit ihm die wichtigen Kisten priorisieren', 'Hilft Versorgung und Minispielen', 'plan', 'help', 'safe'),
      choice('schima-box', 'Die falsche Kiste zum offiziellen Notfallpaket erklären', 'Humor · leichte Chaosfolge', 'weekend', 'joke', 'balanced'),
      choice('schima-hoard', 'Sein Material als unnötigen Ballast bezeichnen', 'Riskant und objektiv unklug', 'personal', 'challenge', 'risky'),
    ],
    positive: {
      listen: ['Schima erzählt von einem Gegenstand, den bisher niemand brauchte. Fünf Minuten später wird er relevant.'],
      help: ['Ihr markiert drei wichtige Kisten. Zum ersten Mal besitzt der Bus eine erkennbare Priorität.'],
      joke: ['Das falsche Paket enthält erstaunlich brauchbare Dinge und wird offiziell beibehalten.'],
      challenge: ['Schima verteidigt jedes Teil und findet dabei tatsächlich zwei unnötige Gegenstände.'],
    },
    negative: {
      listen: ['Du fragst nach dem Bus und nennst jede Antwort Gerümpel. Schima schließt gedanklich die Türen.'],
      help: ['Du sortierst nach Farbe statt Funktion. Schima beendet das Experiment.'],
      joke: ['Du versteckst eine wichtige Kiste als Pointe. Der Humor verliert sofort seine Betriebserlaubnis.'],
      challenge: ['Du nennst Vorräte Ballast, während du selbst nichts mitgebracht hast.'],
    },
    personalReveal: 'Schima sagt, dass Ausrüstung für ihn weniger Sammeln als die Sicherheit ist, im entscheidenden Moment jemandem helfen zu können.',
    consequenceFlag: 'assist-supplies', assistLabel: 'Schimas vorbereitete Kiste reduziert negative Minispielzustände.',
  },
  gundula: {
    id: 'gundula', name: 'Gundula', role: 'Platzordnung mit Klemmbrett', portrait: 'G',
    cadence: 'förmlich, präzise und so, als würde jeder Satz später ausgedruckt',
    values: ['Ordnung', 'Nachweis', 'Verlässlichkeit'], irritants: ['Ausreden', 'ungeklärte Zuständigkeit'],
    likes: ['help', 'listen'], dislikes: ['joke', 'challenge'],
    openings: ['Gundula hebt das Klemmbrett. Damit gilt das Gespräch offiziell als begonnen.', '„Sprechen Sie.“ Gundula hat bereits entschieden, welche Teile belegpflichtig sind.', 'Gundula betrachtet dich wie einen Stellplatz, der zwei Zentimeter über die Markierung ragt.'],
    returning: ['„Zu unserem vorherigen Gespräch existiert inzwischen eine Ergänzung.“', 'Gundula blättert zurück. Das ist selten ein gutes Geräusch.'],
    choices: [
      choice('gundula-proof', 'Ihr ungefragt einen sauberen, belegbaren Zwischenstand geben', 'Sicher · reduziert späteren Verwaltungsdruck', 'plan', 'help', 'safe'),
      choice('gundula-reason', 'Nach dem Zweck hinter einer Regel fragen, nicht nach dem Schlupfloch', 'Respektvoll persönlich', 'personal', 'listen', 'balanced'),
      choice('gundula-form', 'Die Platzordnung als spannenden Roman loben', 'Humor wird wahrscheinlich protokolliert', 'weekend', 'joke', 'risky'),
      choice('gundula-contradiction', 'Einen Widerspruch im Formular offen markieren', 'Riskant · Logik kann Respekt erzeugen', 'weekend', 'challenge', 'risky'),
    ],
    positive: {
      listen: ['Gundula erklärt, dass Regeln meist erst entstehen, nachdem jemand etwas erstaunlich Dummes getan hat. Du erkennst mehrere mögliche Vorbilder.'],
      help: ['Du lieferst Zeiten, Zuständigkeiten und einen erkennbaren Plan. Gundula muss überraschend wenig ergänzen.'],
      joke: ['Gundula reagiert nicht sichtbar. Ein winziger Strich am Mund könnte Humor oder eine neue Notiz sein.'],
      challenge: ['Der Widerspruch ist sauber belegt. Gundula korrigiert eine Zeile und respektiert widerwillig die Vorbereitung.'],
    },
    negative: {
      listen: ['Du fragst nach dem Zweck und unterbrichst die Antwort mit einer Ausrede. Das Klemmbrett gewinnt eine Seite.'],
      help: ['Dein „Zwischenstand“ enthält keine Uhrzeit, keinen Namen und viel Hoffnung.'],
      joke: ['Der Romanwitz wird als fehlende Ernsthaftigkeit dokumentiert.'],
      challenge: ['Du rufst „Widerspruch“, kannst aber keine konkrete Stelle nennen. Gundula erlebt einen sehr guten Moment.'],
    },
    personalReveal: 'Gundula sagt, dass Ordnung für sie weniger Macht als die Hoffnung ist, am Ende nicht allein für das Chaos anderer verantwortlich zu sein.',
    consequenceFlag: 'authority-goodwill', assistLabel: 'Gundulas Wohlwollen reduziert Verdacht und den ersten Konter im Finale.',
  },
  uli: {
    id: 'uli', name: 'Uli', role: 'Schlüsselbund, Parkplatz und Kontrollgang', portrait: 'U',
    cadence: 'knapp, praktisch und mit unnötig exakten Ortsangaben',
    values: ['klare Wege', 'funktionierende Dinge', 'kurze Ansagen'], irritants: ['falsch geparkte Fahrzeuge', 'lange Erklärungen'],
    likes: ['help', 'challenge'], dislikes: ['listen', 'joke'],
    openings: ['Uli lässt den Schlüsselbund kreisen. Irgendwo wird vorsorglich eine Tür nervös.', '„Kurz machen.“ Uli plant selbst zwölf Minuten Antwort.', 'Uli prüft deine Haltung, den Weg und vermutlich die Betriebserlaubnis.'],
    returning: ['„Parkplatz vier gilt weiterhin.“ Uli hält das für Gesprächskontinuität.', 'Der Schlüsselbund klingt, bevor Uli etwas sagt.'],
    choices: [
      choice('uli-route', 'Ihm den geplanten Weg in drei klaren Sätzen wiederholen', 'Sicher · verbessert Navigation und Vertrauen', 'plan', 'help', 'safe'),
      choice('uli-four', 'Parkplatz vier exakt zwischen drei und fünf verorten', 'Trockener Humor, begrenztes Risiko', 'weekend', 'joke', 'balanced'),
      choice('uli-fix', 'Ihn nach dem letzten wirklich gelösten Problem fragen', 'Direkte Herausforderung', 'personal', 'challenge', 'balanced'),
      choice('uli-feeling', 'Nach seiner emotionalen Beziehung zum Schlüsselbund fragen', 'Für Uli unnötig persönlich', 'personal', 'listen', 'risky'),
    ],
    positive: {
      listen: ['Uli antwortet in sieben Wörtern. Für seine Verhältnisse ist das eine biografische Öffnung.'],
      help: ['Du wiederholst Weg und Stellplatz fehlerfrei. Uli nickt einmal und spart euch später eine Kontrolle.'],
      joke: ['Uli schaut auf Parkplatz vier und zurück. „Wenigstens weißt du, wo er ist.“'],
      challenge: ['Uli nennt drei Probleme, die er tatsächlich gelöst hat. Zwei davon waren Türen.'],
    },
    negative: {
      listen: ['Die Frage nach Gefühlen verlängert die Schlüsselgeräusche, nicht die Antwort.'],
      help: ['Du erklärst den Weg mit „da hinten links irgendwo“. Uli beendet das Gespräch.'],
      joke: ['Der Parkplatzwitz fällt genau in eine Kontrollphase. Uli bleibt vollständig funktional.'],
      challenge: ['Du stellst seine Zuständigkeit infrage und stehst dabei im falschen Weg.'],
    },
    personalReveal: 'Uli sagt knapp, dass funktionierende Abläufe für ihn angenehmer sind als Menschen, die erst bei Problemen freundlich werden.',
    consequenceFlag: 'uli-route-knowledge', assistLabel: 'Ulis Wegkenntnis zeigt sichere Routen und senkt Heckenpatrouillenrisiko.',
  },
  ronny: {
    id: 'ronny', name: 'Rivalen-Ronny', role: 'Parkplatz-Philosoph im Endlosmodus', portrait: 'R',
    cadence: 'selbstsicher, ausführlich und mit Definitionen, die sich während der Diskussion verschieben',
    values: ['Rechthaben', 'Theorien', 'Publikum'], irritants: ['kurze Antworten', 'sauber belegte Widersprüche'],
    likes: ['challenge', 'listen'], dislikes: ['help', 'joke'],
    openings: ['Ronny beginnt mit „Ganz objektiv“. Mehr Warnung gibt es nicht.', '„Ich erkläre dir das kurz.“ Die Sonne sinkt merklich tiefer.', 'Ronny hat bereits eine Meinung zu deiner Meinung und wartet auf das Beweismaterial.'],
    returning: ['„Zu dem Punkt von eben muss ich noch etwas klarstellen.“ Natürlich muss er.', 'Ronny hat einen neuen Begriff für dieselbe Behauptung.'],
    choices: [
      choice('ronny-thesis', 'Seine Hauptthese in einem Satz zusammenfassen lassen', 'Herausforderung · deckt Widersprüche auf', 'weekend', 'challenge', 'safe'),
      choice('ronny-origin', 'Nachfragen, warum ihm das Thema wirklich wichtig ist', 'Persönlich · kann den Monolog kurz öffnen', 'personal', 'listen', 'balanced'),
      choice('ronny-plan', 'Ein messbares Kriterium für seine Behauptung vereinbaren', 'Hilfreich, aber für Ronny unangenehm konkret', 'plan', 'help', 'balanced'),
      choice('ronny-short', '„Ganz kurz“ nach exakt neun Minuten zurückgeben', 'Riskanter trockener Humor', 'weekend', 'joke', 'risky'),
    ],
    positive: {
      listen: ['Ronny verlässt für einen Moment den Vortrag und sagt, warum ihm Anerkennung wichtiger ist, als er zugibt.'],
      help: ['Ihr legt ein Kriterium fest. Ronny versucht es dreimal umzudefinieren und akzeptiert es schließlich.'],
      joke: ['Der trockene Rückruf trifft genau die Stelle, an der Ronny selbst Luft holen wollte.'],
      challenge: ['Ronny muss seine These verkürzen. Dabei verliert sie zwei Widersprüche und einen Nebenschauplatz.'],
    },
    negative: {
      listen: ['Du stellst eine persönliche Frage nur, um den nächsten Angriff vorzubereiten. Ronny erkennt ausnahmsweise das Muster.'],
      help: ['Das messbare Kriterium wird von dir selbst sofort ignoriert. Ronny gewinnt unnötig Vertrauen in seine Methode.'],
      joke: ['Der Witz unterbricht ihn, aber nicht seine Energie. Der Monolog startet neu.'],
      challenge: ['Du widersprichst laut, aber ohne seinen Punkt verstanden zu haben. Ronny erhält neues Material.'],
    },
    personalReveal: 'Ronny gibt zu, dass lange Erklärungen auch verhindern, dass jemand merkt, wie unsicher er bei einer kurzen Antwort wäre.',
    consequenceFlag: 'ronny-contradiction-noted', assistLabel: 'Ronnys Widerspruch ist markiert; Logik und Witz treffen ihn später härter.',
  },
  manni: {
    id: 'manni', name: 'Manni Mische', role: 'Versorger mit angewandter Mischmathematik', portrait: 'M',
    cadence: 'pragmatisch, freundlich und stets einen Schritt von einer improvisierten Mischung entfernt',
    values: ['Versorgung', 'Mischverhältnisse', 'gegenseitige Hilfe'], irritants: ['Vorräte horten', 'sanitäre Gleichgültigkeit'],
    likes: ['help', 'joke', 'listen'], dislikes: ['challenge'],
    openings: ['„Mischungsverhältnis ist auch nur angewandte Mathematik.“', 'Manni prüft seine Vorräte und deine moralische Lagerfähigkeit.', '„Hast du zufällig etwas Brauchbares dabei?“'],
    returning: ['„Die Mischung von eben war fast richtig. Fast ist ein dehnbarer Begriff.“', 'Manni hat inzwischen aus drei Resten eine neue Versorgungskategorie gebaut.'],
    choices: [
      choice('manni-mix', 'Nach seinem zuverlässigsten Mischverhältnis fragen', 'Leicht und charaktergerecht', 'weekend', 'listen', 'safe'),
      choice('manni-supply', 'Mit ihm eine kleine Notfallversorgung aufbauen', 'Hilft Inventarfolgen', 'plan', 'help', 'safe'),
      choice('manni-paper', 'Die Klopapierkrise zum historischen Wendepunkt erklären', 'Humor · gemeinsame Erinnerung', 'weekend', 'joke', 'balanced'),
      choice('manni-math', 'Seine Mathematik öffentlich nachrechnen', 'Riskant, wenn du falsch liegst', 'personal', 'challenge', 'risky'),
    ],
    positive: {
      listen: ['Manni erklärt ein Verhältnis, das überraschend sinnvoll klingt und wahrscheinlich trotzdem nicht geprüft werden sollte.'],
      help: ['Ihr legt Wasser, Papier und etwas Essbares beiseite. Der Platz gewinnt minimale Resilienz.'],
      joke: ['Manni nennt die Klopapierübergabe eine humanitäre Operation und lacht noch einmal ehrlich darüber.'],
      challenge: ['Die Rechnung stimmt. Manni akzeptiert den Gegencheck und erhöht dich zum stellvertretenden Mischkontrolleur.'],
    },
    negative: {
      listen: ['Du fragst nach der Mischung und hörst nur auf den Alkoholanteil. Manni korrigiert die Priorität.'],
      help: ['Du willst eine Notfallkiste bauen und nimmst zuerst das Wasser heraus.'],
      joke: ['Der Klopapierwitz kommt vor der Hilfe. Manni bewertet die Reihenfolge.'],
      challenge: ['Du rechnest laut nach und übersiehst eine einfache Zahl. Manni genießt den Moment unnötig.'],
    },
    personalReveal: 'Manni sagt, dass Versorgung für ihn bedeutet, dass niemand in einem peinlichen Moment allein gelassen wird.',
    consequenceFlag: 'manni-supply-tip', assistLabel: 'Mannis Notfallreserve mildert Durst-, Blasen- und Versorgungsfolgen.',
  },
  susi: {
    id: 'susi', name: 'Susi', role: 'Becherstrategin mit niedriger Toleranz für Show', portrait: 'S',
    cadence: 'trocken, spielerisch und schnell darin, Selbstinszenierung zu erkennen',
    values: ['Selbstironie', 'Spielgefühl', 'Ehrlichkeit'], irritants: ['Pegelmut', 'plumpe Anmache'],
    likes: ['joke', 'listen', 'challenge'], dislikes: ['help'],
    openings: ['„Ein guter Wurf ist noch keine Persönlichkeit. Aber er hilft.“', 'Susi schaut erst auf den Becher und dann auf dich. Die Reihenfolge ist eine Bewertung.', '„Bitte sag nicht, dass das dein Flirtshirt ist.“'],
    returning: ['„Der letzte Spruch war knapp außerhalb des Bechers.“', '„Noch ein Versuch. Diesmal ohne Selbstkommentar.“'],
    choices: [
      choice('susi-game', 'Sie nach ihrem besten wirklich schlechten Wurf fragen', 'Humor und echtes Interesse', 'weekend', 'joke', 'safe'),
      choice('susi-read', 'Zuhören, wie sie Gegner und Becherformationen liest', 'Beer-Pong-Partnerschaft', 'personal', 'listen', 'safe'),
      choice('susi-duel', 'Ein Duell ohne Ausreden vereinbaren', 'Spielerische Herausforderung', 'plan', 'challenge', 'balanced'),
      choice('susi-carry', 'Anbieten, ihr das Spiel zu erklären', 'Unnötig herablassend', 'plan', 'help', 'risky'),
    ],
    positive: {
      listen: ['Susi erklärt, dass sie weniger auf Flugbahnen als auf Menschen achtet, die nach Fehlern sofort Ausreden suchen.'],
      help: ['Du hilfst praktisch, ohne daraus einen Auftritt zu machen. Susi registriert den Unterschied.'],
      joke: ['Ihr lacht über einen Wurf, der so schlecht war, dass er wieder eine klare Geschichte ergibt.'],
      challenge: ['Susi nimmt das Duell an. Die Bedingung: keine Ausrede über Tisch, Wind oder emotionalen Gegenwind.'],
    },
    negative: {
      listen: ['Du wartest nur auf eine Pause für deinen eigenen Rekord. Susi lässt die Pause aus.'],
      help: ['Du erklärst ihr Beer Pong. Susi erklärt dir sehr kurz soziale Wahrnehmung.'],
      joke: ['Der Witz ist nur eine Anmache mit Tarnlack. Susi erkennt das Modell.'],
      challenge: ['Du forderst ein Duell und relativierst bereits vor dem ersten Wurf.'],
    },
    personalReveal: 'Susi sagt, dass sie Selbstironie mag, weil Menschen dann weniger Energie darauf verwenden müssen, perfekt zu wirken.',
    consequenceFlag: 'partner-susi-pong', assistLabel: 'Susi liest Re-Racks und verlangsamt kurz die gegnerische Beer-Pong-Serie.',
  },
  jule: {
    id: 'jule', name: 'Jule', role: 'Strandläuferin mit klarer Belastungsgrenze', portrait: 'J',
    cadence: 'direkt, körperlich präsent und ohne Interesse an unnötiger Selbstdarstellung',
    values: ['Hilfsbereitschaft', 'Klarheit', 'Ausdauer'], irritants: ['Angeberei', 'Chaos auf Kosten anderer'],
    likes: ['help', 'listen', 'challenge'], dislikes: ['joke'],
    openings: ['„Erst Wasser, dann Heldengeschichte.“', 'Jule schaut auf deinen Zustand. „Das ist keine Aufwärmphase.“', '„Wer beim Aufräumen hilft, darf später reden.“'],
    returning: ['„Wasserstand besser?“ Jule meint nicht den See.', '„Du bist noch da. Dann kannst du auch kurz helfen.“'],
    choices: [
      choice('jule-help', 'Ohne Kommentar beim Tragen und Aufräumen helfen', 'Sehr passend · Flunkyball-Ausdauer', 'plan', 'help', 'safe'),
      choice('jule-sport', 'Nach ihrem Training fragen und nicht sofort vergleichen', 'Persönlich und respektvoll', 'personal', 'listen', 'safe'),
      choice('jule-race', 'Eine faire Laufchallenge vorschlagen', 'Direkte Herausforderung', 'weekend', 'challenge', 'balanced'),
      choice('jule-hero', 'Die eigene Kondition ausführlich erklären', 'Wirkt wahrscheinlich wie Angeberei', 'weekend', 'joke', 'risky'),
    ],
    positive: {
      listen: ['Jule erzählt, warum Bewegung für sie eher Ruhe als Leistung ist. Du vergleichst es ausnahmsweise nicht mit dir.'],
      help: ['Ihr räumt tatsächlich etwas weg. Das Gespräch entsteht nebenbei und wirkt deshalb glaubwürdiger.'],
      joke: ['Die Heldengeschichte ist kurz und endet mit einer ehrlichen Niederlage. Jule akzeptiert die Selbstironie.'],
      challenge: ['Jule nimmt die Challenge an und respektiert die klare Abmachung.'],
    },
    negative: {
      listen: ['Du fragst nach Training und wartest nur auf die Gelegenheit, eigene Werte zu nennen.'],
      help: ['Du hilfst zwei Minuten und erwähnst es viermal. Jule zieht die soziale Bilanz ab.'],
      joke: ['Der Witz macht aus Verantwortung eine Pointe. Jule lacht nicht.'],
      challenge: ['Du schlägst eine Challenge vor, obwohl du kaum gerade stehst. Das wirkt nicht mutig.'],
    },
    personalReveal: 'Jule sagt, dass Direktheit für sie fairer ist als freundliche Unklarheit, auch wenn sie damit manchmal härter wirkt als beabsichtigt.',
    consequenceFlag: 'partner-jule-flunky', assistLabel: 'Jule reduziert Flunkyball-Foulfenster und verbessert defensive Ausdauer.',
  },
  kira: {
    id: 'kira', name: 'Kira', role: 'Nachtfotografin und stille Beobachterin', portrait: 'K',
    cadence: 'ruhig, bildhaft und mit Fragen, die länger im Raum bleiben als die Antworten',
    values: ['Geschichten', 'Beobachtung', 'authentische Momente'], irritants: ['inszenierte Tiefe', 'ungefragte Selbstdarstellung'],
    likes: ['listen', 'joke', 'help'], dislikes: ['challenge'],
    openings: ['„Das Licht hier ist besser als die Gespräche. Noch.“', 'Kira hebt das Handy, fotografiert aber nicht. „Der Moment ist noch nicht ehrlich genug.“', '„Erzähl etwas Echtes. Oder wenigstens gut Erfundenes.“'],
    returning: ['„Die Geschichte von eben hatte ein gutes Bild und ein schwaches Ende.“', '„Das Licht ist anders. Du hoffentlich auch ein bisschen.“'],
    choices: [
      choice('kira-story', 'Eine echte kleine Geschichte erzählen, ohne Held darin zu sein', 'Persönlich und passend', 'personal', 'listen', 'safe'),
      choice('kira-photo', 'Mit ihr ein ungestelltes Gruppenfoto vorbereiten', 'Ruf- und Beziehungsfolge', 'plan', 'help', 'safe'),
      choice('kira-light', 'Das schlechte Licht für alle bisherigen Entscheidungen verantwortlich machen', 'Leichter, kreativer Humor', 'weekend', 'joke', 'balanced'),
      choice('kira-pose', 'Sie zu einem inszenierten Porträt von dir überreden', 'Widerspricht ihrer Charakterisierung', 'weekend', 'challenge', 'risky'),
    ],
    positive: {
      listen: ['Du erzählst von einem kleinen, peinlichen Moment statt von einem Sieg. Kira stellt eine echte Rückfrage.'],
      help: ['Ihr wartet auf einen Moment, in dem niemand posiert. Das Bild wird später wichtiger als geplant.'],
      joke: ['Der Lichtwitz wird zu einer guten Bildunterschrift und nicht zu einer Anmache.'],
      challenge: ['Kira lehnt die Pose ab, respektiert aber, dass du das Nein ohne Verhandlung akzeptierst.'],
    },
    negative: {
      listen: ['Die angeblich echte Geschichte endet wieder bei deiner Großartigkeit. Kira verliert das Bild.'],
      help: ['Du organisierst das Foto so stark, dass kein echter Moment übrig bleibt.'],
      joke: ['Der kreative Witz ist nur ein Kompliment mit Umweg.'],
      challenge: ['Du diskutierst über eine Pose, nachdem Kira bereits nein gesagt hat. Das Gespräch endet.'],
    },
    personalReveal: 'Kira sagt, dass sie fotografiert, weil Menschen in unbeobachteten Sekunden oft ehrlicher wirken als in langen Erklärungen.',
    consequenceFlag: 'partner-kira-story', assistLabel: 'Kiras Foto stärkt Ruf und Zeugenaussagen im Sonntagsfinale.',
  },
};

export function characterOpening(characterId: string, snapshot: GameSnapshot, meta: CampaignMetaState): string {
  const voice = CHARACTER_VOICES[characterId];
  if (!voice) return 'Ein Gespräch beginnt. Noch ist unklar, ob daraus Erkenntnis oder nur Zeitverlust wird.';
  const count = meta.conversationCounts[characterId] ?? 0;
  const relation = snapshot.relationships[characterId] ?? 0;
  const pool = count > 1 ? voice.returning : voice.openings;
  const index = Math.abs(snapshot.day * 17 + Math.floor(snapshot.minutes / 18) + count * 7 + characterId.length) % pool.length;
  const condition = conditionLine(characterId, snapshot);
  const memory = memoryLine(characterId, meta);
  return `${pool[index]}${condition ? ` ${condition}` : ''}${memory ? ` ${memory}` : ''}`;
}

export function characterChoices(characterId: string, snapshot: GameSnapshot, meta: CampaignMetaState): VoiceChoice[] {
  const voice = CHARACTER_VOICES[characterId];
  if (!voice) return [];
  const count = meta.conversationCounts[characterId] ?? 0;
  const relation = snapshot.relationships[characterId] ?? 0;
  const available = voice.choices.map((entry) => ({
    ...entry,
    hint: enrichHint(entry, relation, snapshot, meta, characterId),
  }));
  const offset = Math.abs(count + snapshot.day + characterId.length) % available.length;
  return [...available.slice(offset), ...available.slice(0, offset)];
}

export function resolveCharacterChoice(
  characterId: string,
  choiceId: string,
  snapshot: GameSnapshot,
  meta: CampaignMetaState,
  random: () => number = Math.random,
): VoiceConsequence {
  const voice = CHARACTER_VOICES[characterId];
  const selected = voice?.choices.find((entry) => entry.id === choiceId);
  if (!voice || !selected) return { relationship: 0, success: false, text: 'Das Gespräch verliert seinen Faden, bevor eine klare Entscheidung fällt.' };

  const relation = snapshot.relationships[characterId] ?? 0;
  const count = meta.conversationCounts[characterId] ?? 0;
  const liked = voice.likes.includes(selected.approach);
  const disliked = voice.dislikes.includes(selected.approach);
  const statePenalty = socialStatePenalty(snapshot, characterId);
  const historyPenalty = Math.max(0, count - 4) * .35;
  const riskBase = selected.risk === 'safe' ? .88 : selected.risk === 'balanced' ? .7 : .48;
  const relationBonus = Math.max(-.12, Math.min(.18, relation / 180));
  const preference = liked ? .16 : disliked ? -.22 : 0;
  const chance = clamp(riskBase + relationBonus + preference - statePenalty - historyPenalty, .08, .97);
  const success = random() <= chance;

  let relationship = success ? (selected.risk === 'risky' ? 7 : selected.risk === 'balanced' ? 5 : 4) : (disliked ? -5 : selected.risk === 'risky' ? -3 : -1);
  if (selected.topic === 'personal' && relation >= 16 && success) relationship += 2;
  if (selected.approach === 'listen' && snapshot.profile?.trait === 'beobachtend') relationship += 1;
  if (selected.approach === 'help' && snapshot.profile?.trait === 'hilfsbereit') relationship += 2;
  if (selected.approach === 'joke' && snapshot.profile?.trait === 'chaotisch') relationship += 1;
  if (selected.approach === 'challenge' && snapshot.profile?.trait === 'direkt') relationship += 1;
  relationship = Math.round(clamp(relationship, -7, 10));

  const linePool = success ? voice.positive[selected.approach] : voice.negative[selected.approach];
  const line = linePool[Math.abs(snapshot.minutes + count * 11 + choiceId.length) % linePool.length];
  const personal = success && selected.topic === 'personal' && relation + relationship >= 16 ? ` ${voice.personalReveal}` : '';
  const flags: Record<string, boolean> = {};
  if (success && voice.consequenceFlag && (selected.approach === 'help' || selected.approach === 'listen' || selected.risk !== 'safe')) flags[voice.consequenceFlag] = true;
  flags[`talked-${characterId}-${selected.id}`] = true;

  const needs: Partial<Needs> = {};
  const metrics: Partial<WeekendMetrics> = {};
  if (success && selected.approach === 'listen') { needs.courage = 3; metrics.dignity = 1; }
  if (success && selected.approach === 'help') { metrics.reputation = 2; metrics.chaos = -2; metrics.momentum = 2; }
  if (success && selected.approach === 'joke') { needs.courage = 4; metrics.chaos = 1; }
  if (success && selected.approach === 'challenge') { metrics.momentum = 3; metrics.dignity = selected.risk === 'risky' ? 2 : 1; }
  if (!success) { needs.courage = -2; metrics.dignity = selected.risk === 'risky' ? -3 : -1; if (selected.approach === 'joke') metrics.chaos = 2; }

  const ripples = socialRipples(characterId, selected, success);
  const assist = success && flags[voice.consequenceFlag ?? ''] ? ` Neue Wirkung: ${voice.assistLabel}` : '';
  return {
    relationship,
    success,
    text: `${line}${personal}${assist}`,
    needs,
    metrics,
    flags,
    ripples,
    followUp: success ? followUpLine(voice, selected) : 'Beim nächsten Gespräch verändert sich die Reihenfolge und die Figur erinnert sich an den Ton.',
  };
}

export function voiceSummary(characterId: string): { role: string; cadence: string; values: string[]; irritants: string[] } | undefined {
  const voice = CHARACTER_VOICES[characterId];
  if (!voice) return undefined;
  return { role: voice.role, cadence: voice.cadence, values: voice.values, irritants: voice.irritants };
}

function conditionLine(characterId: string, snapshot: GameSnapshot): string {
  if (snapshot.needs.alcohol >= 68) return characterId === 'rene' ? 'René hält deinen Pegel für einen Mannschaftszustand.' : 'Dein Pegel übernimmt sichtbar Teile der Gesprächsführung.';
  if (snapshot.needs.highness >= 68) return characterId === 'masl' ? 'Masl akzeptiert deine verzögerte Taktung als Gesprächsformat.' : 'Zwischen Frage und Reaktion entsteht ein kleiner eigener Urlaub.';
  if (snapshot.needs.hangover >= 45) return 'Dein Gesicht führt bereits ein separates Beschwerdeverfahren gegen Tageslicht.';
  if (snapshot.needs.thirst >= 72) return 'Deine trockene Stimme macht aus jeder Aussage eine unfreiwillige Krisenmeldung.';
  return '';
}

function memoryLine(characterId: string, meta: CampaignMetaState): string {
  if (characterId === 'susi' && (meta.miniResults.beerPong?.attempts ?? 0) > 0) return `Susi kennt deinen letzten Beer-Pong-Wert: ${meta.miniResults.beerPong.last}.`;
  if (characterId === 'jule' && (meta.miniResults.flunkyball?.attempts ?? 0) > 0) return 'Jule hat gesehen, wie du beim Flunkyball gelaufen oder eine Ausrede gesucht hast.';
  if (characterId === 'lars' && (meta.miniResults.flipCup?.attempts ?? 0) > 0) return 'Lars hat den letzten Becherflip bereits wirtschaftlich ausgewertet.';
  if ((characterId === 'gundula' || characterId === 'uli') && meta.suspicion > 25) return `Der aktuelle Heckenverdacht beträgt ${meta.suspicion}. Beide kennen die Zahl.`;
  if (characterId === 'ronny' && meta.flags.ronnyDefeated) return 'Ronny spricht seit der Niederlage kürzer. Nur relativ.';
  if (characterId === 'manni' && meta.flags.paperGiven) return 'Die Klopapierübergabe bleibt zwischen euch eine belastbare diplomatische Grundlage.';
  return '';
}

function enrichHint(entry: VoiceChoice, relation: number, snapshot: GameSnapshot, meta: CampaignMetaState, characterId: string): string {
  const risk = entry.risk === 'safe' ? 'SICHER' : entry.risk === 'balanced' ? 'ABWÄGUNG' : 'RISKANT';
  const relationText = relation >= 18 ? 'Vertrauen vorhanden' : relation < 0 ? 'angespannte Beziehung' : 'Beziehung kann helfen';
  const remembered = meta.flags[`talked-${characterId}-${entry.id}`] ? ' · schon einmal gewählt' : '';
  const impaired = snapshot.needs.alcohol >= 55 || snapshot.needs.hangover >= 45 ? ' · Zustand erschwert soziale Präzision' : '';
  return `${risk} · ${entry.hint} · ${relationText}${remembered}${impaired}`;
}

function socialStatePenalty(snapshot: GameSnapshot, characterId: string): number {
  let penalty = 0;
  if (snapshot.needs.alcohol >= 68) penalty += ['rene', 'masl', 'gregor'].includes(characterId) ? .05 : .24;
  else if (snapshot.needs.alcohol >= 38) penalty += ['rene', 'lars', 'felix'].includes(characterId) ? 0 : .1;
  if (snapshot.needs.highness >= 68) penalty += ['masl', 'schubert', 'schima'].includes(characterId) ? .02 : .2;
  if (snapshot.needs.hangover >= 45) penalty += .12;
  if (snapshot.needs.thirst >= 75) penalty += .08;
  return penalty;
}

function socialRipples(characterId: string, selected: VoiceChoice, success: boolean): Array<{ id: string; delta: number }> {
  if (!success) return [];
  if (characterId === 'rene' && selected.approach === 'joke') return [{ id: 'andre', delta: 1 }, { id: 'lars', delta: 1 }];
  if (characterId === 'jule' && selected.approach === 'help') return [{ id: 'susi', delta: 1 }, { id: 'kira', delta: 1 }];
  if (characterId === 'gundula' && selected.approach === 'help') return [{ id: 'uli', delta: 2 }];
  if (characterId === 'uli' && selected.approach === 'help') return [{ id: 'gundula', delta: 1 }];
  if (characterId === 'ronny' && selected.approach === 'challenge') return [{ id: 'andre', delta: 1 }, { id: 'gregor', delta: 1 }];
  if (characterId === 'masl' && selected.approach === 'help') return [{ id: 'rene', delta: 1 }];
  return [];
}

function followUpLine(voice: CharacterVoice, selected: VoiceChoice): string {
  if (selected.approach === 'listen') return `${voice.name} wird beim nächsten persönlichen Gespräch offener reagieren.`;
  if (selected.approach === 'help') return `Die gemeinsame Planung hat eine konkrete Spielwirkung erhalten.`;
  if (selected.approach === 'joke') return `Der gemeinsame Witz kann später in Gruppen- oder Kampfreaktionen wieder auftauchen.`;
  return `Die Herausforderung verändert, wie ${voice.name} spätere direkte Aussagen bewertet.`;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
