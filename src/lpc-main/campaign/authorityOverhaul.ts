import type { CombatMoveId, GameSnapshot, Needs, WeekendMetrics } from '../../game/types';
import { COMBAT_MOVES, COMBAT_OPPONENTS, type CombatMoveTag } from '../../game/combatMoves';
import { CHARACTER_VISUALS } from '../content';
import { CHARACTER_VOICES } from './characterVoices';
import type { CampaignMetaState } from './metaStore';

interface AuthorityDialogueAction {
  type: string;
  choiceId?: string;
}

interface AuthorityDialogueResolution {
  text: string;
  relationship: number;
  minutes: number;
  success?: boolean;
  learnedAttack?: CombatMoveId;
  needs?: Partial<Needs>;
  metrics?: Partial<WeekendMetrics>;
  flags?: Record<string, boolean>;
  ripples?: Array<{ id: string; delta: number }>;
  followUp?: string;
  consequenceLabel?: string;
}

const AUTHORITY_FLAGS = [
  'authority-ego-hook',
  'authority-gossip-bond',
  'authority-drinking-bond',
  'authority-pong-challenge',
  'authority-nacken-calibrated',
  'authority-goodwill',
  'uli-route-knowledge',
] as const;

let installed = false;

export function installAuthorityOverhaul(): void {
  if (installed) return;
  installed = true;
  installVoices();
  installCombatMoves();
  installOpponentProfile();
  installVisuals();
}

installAuthorityOverhaul();

export function authorityDialogueStateLine(
  characterId: string,
  snapshot: GameSnapshot,
  meta: CampaignMetaState,
): string {
  if (characterId !== 'gundula' && characterId !== 'uli') return '';
  const flags = { ...snapshot.flags, ...meta.flags };
  const score = authorityManipulationScore(flags);
  const relation = snapshot.relationships[characterId] ?? 0;

  if (score >= 5 || relation >= 28) {
    return characterId === 'gundula'
      ? 'Sie versucht noch grimmig zu wirken, behandelt dich aber bereits wie einen nützlichen Mitlästerer mit Sonderzugang.'
      : 'Uli nennt dich nicht Freund, klatscht dir aber schon so auf den Nacken, als wäre die Schranke gemeinsames Eigentum.';
  }
  if (flags['authority-drinking-bond']) {
    return characterId === 'gundula'
      ? 'Neben dem Klemmbrett steht ein halbvolles Bier. Seit dem gemeinsamen Anstoßen sind ihre Regeln auffällig verhandelbar.'
      : 'Uli hat ein Wegbier in der Hand und erklärt jede Anweisung inzwischen als kollegialen Hinweis.';
  }
  if (flags['authority-ego-hook']) {
    return 'Die Schmeichelei wirkt noch. Beide richten sich sofort auf, sobald du ihre angebliche Unverzichtbarkeit bestätigst.';
  }
  if (snapshot.minutes >= 1140 || snapshot.needs.alcohol >= 42) {
    return characterId === 'gundula'
      ? 'Gundula ist sichtbar angeschickert: bissiger im Ton, aber empfänglicher für Zustimmung, Klatsch und eine neue Runde.'
      : 'Uli riecht nach Bier und Wichtigkeit. Ein „passt, Chef“ erreicht ihn schneller als jedes sachliche Argument.';
  }
  if (meta.suspicion >= 25) {
    return 'Beide freuen sich viel zu sehr über den Verdacht. Wer ihr Ego füttert, kann die Stimmung trotzdem schnell drehen.';
  }
  return 'Sie suchen weniger nach einer Lösung als nach einer Gelegenheit, dich kleinzumachen. Ihre Schwäche ist, dass sie unbedingt bewundert und einbezogen werden wollen.';
}

export function applyAuthorityDialogueResolution(
  characterId: string,
  action: AuthorityDialogueAction,
  resolution: AuthorityDialogueResolution,
): AuthorityDialogueResolution {
  if ((characterId !== 'gundula' && characterId !== 'uli') || action.type !== 'character' || !action.choiceId) return resolution;

  const success = resolution.success !== false;
  const flags = { ...(resolution.flags ?? {}) };
  const needs = { ...(resolution.needs ?? {}) };
  const metrics = { ...(resolution.metrics ?? {}) };
  const ripples = [...(resolution.ripples ?? [])];
  let relationship = resolution.relationship;
  let learnedAttack = resolution.learnedAttack;
  let text = resolution.text;
  let followUp = resolution.followUp;
  let consequenceLabel = resolution.consequenceLabel;

  const reward = (extraRelationship: number, label: string, extraText: string): void => {
    relationship += extraRelationship;
    consequenceLabel = label;
    text = `${text} ${extraText}`;
  };
  const punish = (extraRelationship: number, extraDignity: number, extraText: string): void => {
    relationship += extraRelationship;
    metrics.dignity = (metrics.dignity ?? 0) + extraDignity;
    metrics.chaos = (metrics.chaos ?? 0) + 2;
    text = `${text} ${extraText}`;
  };

  if (success) {
    switch (action.choiceId) {
      case 'gundula-proof':
        flags['authority-ego-hook'] = true;
        flags['authority-goodwill'] = true;
        metrics.reputation = (metrics.reputation ?? 0) + 2;
        metrics.chaos = (metrics.chaos ?? 0) + 1;
        reward(3, 'EGO GEKAPERT', 'Gundula hört vor allem, dass ohne sie angeblich alles zusammenbrechen würde. Ab diesem Moment hält sie dich für einen der wenigen Menschen mit „Blick für Führung“.');
        followUp = 'Ego-Attacken, Zustimmung und kumpelhafte Gesten treffen Gundula und Uli im Kampf deutlich stärker.';
        break;
      case 'gundula-reason':
        flags['authority-gossip-bond'] = true;
        metrics.chaos = (metrics.chaos ?? 0) + 3;
        ripples.push({ id: 'uli', delta: 2 });
        reward(3, 'GEMEINSAMES PÖBELN', 'Sie zählt begeistert die schlimmsten „Vollpfosten“ der letzten Jahre auf. Du musst nur gelegentlich verständnisvoll „unfassbar“ sagen.');
        followUp = 'Gemeinsames Lästern öffnet Team-, Witz- und Chaosattacken gegen beide.';
        break;
      case 'gundula-form':
        flags['authority-drinking-bond'] = true;
        flags['authority-goodwill'] = true;
        needs.alcohol = (needs.alcohol ?? 0) + 7;
        needs.bladder = (needs.bladder ?? 0) + 4;
        needs.courage = (needs.courage ?? 0) + 3;
        learnedAttack = 'beer-offer';
        reward(4, 'WEGBIER-DIPLOMATIE', 'Nach dem Anstoßen duzt sie dich und erklärt dieselbe Regel plötzlich als lockere Empfehlung unter vernünftigen Leuten.');
        followUp = 'Getränkeattacken schwächen ihre Gegenzüge massiv. Dein eigener Pegel sollte nur nicht völlig entgleisen.';
        break;
      case 'gundula-contradiction':
        flags['authority-pong-challenge'] = true;
        metrics.momentum = (metrics.momentum ?? 0) + 5;
        metrics.chaos = (metrics.chaos ?? 0) + 3;
        learnedAttack = 'cup-eye-contact';
        reward(5, 'SCHRANKEN-BEER-PONG', 'Gundula nimmt die Herausforderung sofort an, weil sie vor Uli niemals zugeben würde, bei Beer Pong unsicher zu sein. Die Schranke wird zum Einsatz.');
        followUp = 'Das Beer-Pong-Zwangsduell ist gegen die Platzleitung besonders stark und kann ihre Kampfphase überspringen.';
        break;
      case 'uli-route':
        flags['authority-ego-hook'] = true;
        flags['uli-route-knowledge'] = true;
        metrics.reputation = (metrics.reputation ?? 0) + 1;
        reward(3, 'CHEF-BESTÄTIGUNG', 'Uli saugt das Wort „Chef“ auf wie ein trockener Bierdeckel. Danach erklärt er dir den Weg nicht mehr als Befehl, sondern als Insiderwissen.');
        followUp = 'Ulis Kontrollgänge werden berechenbarer; kumpelhafte Attacken treffen ihn härter.';
        break;
      case 'uli-four':
        flags['authority-gossip-bond'] = true;
        metrics.chaos = (metrics.chaos ?? 0) + 3;
        ripples.push({ id: 'gundula', delta: 2 });
        reward(3, 'PARKPLATZ-PÖBELPAKT', 'Ihr schimpft gemeinsam über Leute, die nicht rückwärts einparken können. Nach zwei Beispielen verteidigt Uli dich bereits gegen erfundene Dritte.');
        followUp = 'Pöbelkonter, Gruppenattacken und absurde Übertreibungen erhalten gegen beide einen Bonus.';
        break;
      case 'uli-fix':
        flags['authority-drinking-bond'] = true;
        flags['uli-route-knowledge'] = true;
        needs.alcohol = (needs.alcohol ?? 0) + 6;
        needs.bladder = (needs.bladder ?? 0) + 4;
        learnedAttack = 'beer-offer';
        reward(4, 'WEGBIER-ABKOMMEN', 'Uli akzeptiert das Wegbier und verschiebt Parkplatz vier mit einem Handzeichen um ungefähr drei Meter. Vorschriften werden in Echtzeit weich.');
        followUp = 'Mit Wegbier-Bindung verursachen seine Schlüsselbund- und Parkplatzattacken deutlich weniger Frust.';
        break;
      case 'uli-feeling':
        flags['authority-nacken-calibrated'] = true;
        flags['authority-goodwill'] = true;
        metrics.momentum = (metrics.momentum ?? 0) + 4;
        learnedAttack = 'dry-counter';
        reward(5, 'KUMPEL-NACKENKLATSCHER', 'Der Nackenklatscher landet genau zwischen Respekt und Frechheit. Uli grinst, schlägt doppelt so fest zurück und erklärt dich damit offiziell zum akzeptierten Deppen.');
        followUp = 'Der Kumpel-Nackenklatscher und kurze Pöbelkonter sind gegen die Platzleitung jetzt besonders wirksam.';
        break;
    }
  } else {
    switch (action.choiceId) {
      case 'gundula-proof':
        punish(-2, -2, 'Die Schmeichelei ist zu dick. Gundula erkennt Manipulation nur dann, wenn sie schlecht ausgeführt ist, und genießt den seltenen Triumph.');
        break;
      case 'gundula-reason':
        punish(-2, -2, 'Du lästerst über die falsche Person. Gundula war mit ihr bis vor drei Minuten noch verfeindet, verteidigt sie jetzt aber aus Prinzip.');
        break;
      case 'gundula-form':
        punish(-3, -3, 'Du bietest das Bier im falschen Ton an. Gundula erklärt laut, sie trinke selbstverständlich niemals im Dienst, während ihr eigenes Bier hinter dem Klemmbrett steht.');
        break;
      case 'gundula-contradiction':
        punish(-4, -5, 'Gundula verliert den ersten Wurf, erklärt den Tisch für nicht normgerecht und sperrt die Schranke aus sportrechtlichen Gründen.');
        break;
      case 'uli-route':
        punish(-2, -2, 'Das „Chef“ klingt ironisch. Uli benötigt keine Beweise, um Ironie als Parkverstoß zu behandeln.');
        break;
      case 'uli-four':
        punish(-2, -2, 'Du pöbelst zu allgemein. Uli braucht Namen, Kennzeichen und mindestens eine unglaubwürdig genaue Uhrzeit.');
        break;
      case 'uli-fix':
        punish(-3, -3, 'Uli nimmt das Bier nicht, weil es nicht kalt genug ist, und verwandelt diese Temperaturfrage in eine Machtdemonstration.');
        break;
      case 'uli-feeling':
        punish(-5, -6, 'Der Nackenklatscher landet einen Zentimeter zu kumpelhaft. Uli dreht sich langsam um. Selbst der Schlüsselbund wird still.');
        break;
    }
  }

  return {
    ...resolution,
    text,
    relationship,
    learnedAttack,
    needs,
    metrics,
    flags,
    ripples,
    followUp,
    consequenceLabel,
  };
}

export function authorityManipulationScore(flags: Record<string, boolean>): number {
  return AUTHORITY_FLAGS.reduce((score, flag) => score + (flags[flag] ? 1 : 0), 0);
}

export function authorityOpeningFrustration(opponentId: string, flags: Record<string, boolean>): number {
  if (opponentId !== 'entry-authority' && opponentId !== 'sunday-inspection') return 0;
  const score = authorityManipulationScore(flags);
  const maximum = opponentId === 'sunday-inspection' ? 22 : 34;
  return Math.min(maximum, score * 5 + (flags['authority-goodwill'] ? 4 : 0));
}

export function authorityPlayerPowerMultiplier(
  opponentId: string,
  moveId: CombatMoveId,
  tag: CombatMoveTag,
  snapshot: GameSnapshot,
  flags: Record<string, boolean>,
): number {
  if (opponentId !== 'entry-authority' && opponentId !== 'sunday-inspection') return 1;
  let multiplier = 1 + Math.min(.28, authorityManipulationScore(flags) * .045);
  if (flags['authority-ego-hook'] && (tag === 'rapport' || tag === 'submission')) multiplier *= 1.26;
  if (flags['authority-gossip-bond'] && (tag === 'wit' || tag === 'team' || tag === 'chaos')) multiplier *= 1.2;
  if (flags['authority-drinking-bond'] && tag === 'drink') multiplier *= 1.42;
  if (flags['authority-pong-challenge'] && moveId === 'cup-eye-contact') multiplier *= 1.52;
  if (flags['authority-nacken-calibrated'] && (moveId === 'classic-high-five' || moveId === 'dry-counter')) multiplier *= 1.38;
  if (snapshot.needs.alcohol >= 18 && snapshot.needs.alcohol <= 58 && (tag === 'drink' || tag === 'rapport')) multiplier *= 1.08;
  if (snapshot.needs.alcohol >= 76) multiplier *= .86;
  return multiplier;
}

export function authorityCounterMultiplier(
  opponentId: string,
  snapshot: GameSnapshot,
  flags: Record<string, boolean>,
): number {
  if (opponentId !== 'entry-authority' && opponentId !== 'sunday-inspection') return 1;
  let multiplier = Math.max(.48, 1 - authorityManipulationScore(flags) * .075);
  if (flags['authority-goodwill']) multiplier *= .88;
  if (flags['authority-drinking-bond'] && snapshot.needs.alcohol >= 12 && snapshot.needs.alcohol <= 62) multiplier *= .82;
  if (snapshot.needs.alcohol >= 76) multiplier *= 1.2;
  return Math.max(.38, multiplier);
}

export function authorityBattleIntro(opponentId: string, flags: Record<string, boolean>): string {
  const score = authorityManipulationScore(flags);
  if (opponentId === 'sunday-inspection') {
    return score >= 4
      ? 'Sonntagmorgen. Gundula öffnet das Abschlussprotokoll grimmig, Uli klappert mit den Schlüsseln – beide wissen aber längst, dass du ihre Egos, ihr Wegbier und ihre Pöbelrituale lesen kannst.'
      : 'Sonntagmorgen. Gundula und Uli erscheinen mit Restalkohol, Klemmbrett und dem festen Wunsch, sich ein letztes Mal wichtigzumachen.';
  }
  if (opponentId !== 'entry-authority') return '';
  return score >= 3
    ? 'Gundula und Uli bauen sich an der Schranke auf. Der Ton ist grimmig, aber du erkennst bereits die Sollbruchstellen: Ego, Wegbier, gemeinsames Lästern und jede Challenge mit Publikum.'
    : 'Gundula und Uli eröffnen den Schrankenfrustkampf im Doppelpack: zwei angeschickerte Platzherrscher, die vor allem sehen wollen, ob du dich einschüchtern lässt oder ihr Spiel schneller verstehst.';
}

export function authorityEnemyAttackLine(
  opponentId: string,
  round: number,
  phaseId: string,
  flags: Record<string, boolean>,
  random: () => number,
): string {
  if (opponentId !== 'entry-authority' && opponentId !== 'sunday-inspection') return '';
  const softened = authorityManipulationScore(flags) >= 4;
  const pools: Record<string, string[]> = {
    'schranken-gockel': [
      'GUNDULAS BRILLENRAND-VERHÖR: Sie schaut über die Brille, sagt „also wirklich“ und lässt die Enttäuschung wie eine amtliche Feststellung wirken.',
      'ULIS SCHLÜSSELBUND-SALVE: Er lässt acht Schlüssel klimpern, obwohl genau einer gebraucht wird, und erklärt das Geräusch zur letzten Warnung.',
      'DOPPELTER ZUSTÄNDIGKEITS-NACKENKLATSCHER: Gundula verweist auf Uli, Uli auf Gundula und beide treffen dich gleichzeitig mit erfundener Verantwortung.',
    ],
    'angeschickerte-stichelei': [
      'BIERATEM-SCHRANKENPREDIGT: Uli kommt zu nah, nennt dich „Sportsfreund“ und erklärt Parkplatz vier zum Charaktertest.',
      'GUNDULAS LÄSTERPROTOKOLL: Sie zählt frühere Vollpfosten auf und schiebt dich mit einem einzigen „genau so“ in dieselbe Kategorie.',
      'BEER-PONG-UMDEUTUNG: Gundula behauptet, der letzte Becher habe wegen Wind, Tisch und falscher innerer Haltung nicht gezählt.',
    ],
    'gekraenkte-platzherrschaft': [
      'SCHRANKEN-RAMBO-FINALE: Uli legt eine Hand auf den Knopf, obwohl die Schranke längst offen ist, und kostet den Moment maximal aus.',
      'KLEMMBRETT-DONNERSCHLAG: Gundula schlägt das Brett zu und erklärt das Gespräch für beendet, beginnt danach aber sofort einen neuen Monolog.',
      'LETZTE-RUNDE-PÖBELKOMBO: Beide reden gleichzeitig lauter, widersprechen einander und geben dir trotzdem geschlossen die Schuld.',
    ],
  };
  const pool = pools[phaseId] ?? [...pools['schranken-gockel'], ...pools['angeschickerte-stichelei']];
  const line = pool[(round + Math.floor(random() * pool.length)) % pool.length];
  return softened ? `${line} Die Attacke verliert Wirkung, weil beide zwischendurch prüfen, ob du noch anerkennend nickst.` : line;
}

export function authorityVictoryLine(opponentId: string, flags: Record<string, boolean>): string {
  if (opponentId === 'entry-authority') {
    return authorityManipulationScore(flags) >= 3
      ? 'Gundula öffnet die Schranke mit einem grimmigen „Na gut“. Uli verpasst dir einen anerkennenden Nackenklatscher und behauptet, das sei von Anfang an sein Plan gewesen.'
      : 'Gundula schließt das Klemmbrett. Uli öffnet die Schranke und pöbelt noch hinterher, damit es nicht wie eine Niederlage aussieht.';
  }
  if (opponentId === 'sunday-inspection') {
    return 'Gundula streicht die Nachforderung. Uli nennt dich widerwillig „in Ordnung“ und beide retten ihr Gesicht mit einem letzten Bier auf eure Kosten.';
  }
  return '';
}

export function absurdAttackLine(id: CombatMoveId, teamSize: number): string {
  const lines: Record<CombatMoveId, string> = {
    'classic-high-five': 'Du gehst auf Uli zu, sagst „passt, Chef“ und setzt einen exakt kalibrierten Kumpel-Nackenklatscher. Nähe wird zur Verwirrungswaffe.',
    'aldi-shirt-show': 'Du spannst das Aldi-Shirt über der Brust, als wäre es eine Uniform mit Sondervollmacht, und verlangst Respekt vor der Aktionsware.',
    'agree-anyway': 'Du nickst übertrieben, nennst beide „die einzigen Vernünftigen hier“ und lässt ihre vorbereitete Standpauke mangels Widerstand verhungern.',
    'logical-argument': 'Du zeichnest die gesamte Beweisführung auf einen feuchten Bierdeckel. Dass sie dort vollständig Platz hat, ist der eigentliche Angriff.',
    'dry-counter': 'Du wartest den Pöbelmonolog ab und antwortest nur: „Stark, Chef.“ Der Satz trifft härter, weil niemand weiß, ob er Zustimmung oder Beleidigung war.',
    'camping-chair-block': 'Du klappst den Campingstuhl mitten im Machtbereich auf, setzt dich und eröffnest eine unangemeldete Bierbank-Sitzung.',
    'beer-offer': 'Du schiebst ein halbes Bier als Friedensvertrag über den Tisch. Beide vergessen augenblicklich, welcher Paragraph gerade wichtig war.',
    'synchronised-cheer': `${teamSize} Leute rufen gleichzeitig „JAWOLL CHEF!“. Gundula und Uli wachsen kurz vor Stolz und merken zu spät, dass sie ausgelacht werden.`,
    'cup-eye-contact': 'Du forderst die Gegenseite zum Beer-Pong-Zwangsduell heraus und erklärst die Schranke zum Einsatz. Rückzug würde vor Publikum wie Schwäche aussehen.',
    'total-exaggeration': 'Du erfindest eine Platzlegende, in der Gundula 1998 allein einen Orkan verwaltete und Uli die Schranke mit bloßen Händen reparierte. Beide wollen sofort Details hören.',
  };
  return lines[id];
}

function installVoices(): void {
  Object.assign(CHARACTER_VOICES.gundula, {
    role: 'angeschickerte Platzkönigin mit Klemmbrett',
    cadence: 'grimmig, schnippisch und laut genug, dass jeder Satz wie eine öffentliche Rüge klingt; nach Zustimmung oder Bier schlagartig kumpelhaft',
    values: ['Bewunderung ihrer Stellung', 'gemeinsames Lästern', 'Bier als Sozialvertrag'],
    irritants: ['Nichtbeachtung', 'Widerspruch ohne Schmeichelei', 'Menschen, die sich nicht einschüchtern lassen'],
    likes: ['help', 'listen', 'joke', 'challenge'],
    dislikes: [],
    openings: [
      'Gundula knallt das Klemmbrett gegen die Hüfte. „Na, da kommt ja die nächste organisatorische Spitzenleistung.“',
      '„Sprechen Sie – aber versuchen Sie diesmal, nicht schon beim ersten Satz Unsinn zu erzählen.“ Hinter dem Klemmbrett steht ein halbvolles Bier.',
      'Gundula mustert dich über den Brillenrand. „Sie sehen schon so aus, als müsste ich Ihnen gleich etwas sehr Einfaches dreimal erklären.“',
      '„Die Schranke bleibt zu, bis ich überzeugt bin. Uli wäre schneller überzeugt, aber Uli ist auch schneller beim Bier.“',
    ],
    returning: [
      '„Ach, unser Spezialist.“ Gundula sagt es wie Lob und Beleidigung gleichzeitig.',
      'Gundula hebt das Bier, nicht das Klemmbrett. „Na gut. Was wollen Sie diesmal schönreden?“',
      '„Ich habe Uli gesagt, dass Sie lernfähig sind. Blamieren Sie mich jetzt nicht.“',
    ],
    choices: [
      { id: 'gundula-proof', label: 'Bestätigen, dass ohne sie hier alles im Suff versinken würde', hint: 'Sicher · füttert ihr Ego und macht Regeln verhandelbar', topic: 'plan', approach: 'help', risk: 'safe' },
      { id: 'gundula-reason', label: 'Sie über die schlimmsten Vollpfosten auf dem Platz lästern lassen', hint: 'Gemeinsames Pöbeln · leicht manipulierbar, aber chaotisch', topic: 'personal', approach: 'listen', risk: 'balanced' },
      { id: 'gundula-form', label: 'Ein Wegbier anbieten und gemeinsam über „die Jugend“ schimpfen', hint: 'Alkoholritual · starke Bindung, eigener Pegel steigt', topic: 'weekend', approach: 'joke', risk: 'balanced' },
      { id: 'gundula-contradiction', label: 'Die Schranke in einem Beer-Pong-Duell ausspielen', hint: 'Sehr riskant · ihr Stolz kann nicht ablehnen', topic: 'weekend', approach: 'challenge', risk: 'risky' },
    ],
    positive: {
      listen: ['Gundula zählt mit wachsender Begeisterung frühere Platzkatastrophen auf. Nach dem dritten „Vollidioten“ bist du kein Gast mehr, sondern Publikum.'],
      help: ['Du erklärst Gundula zur letzten tragenden Säule des Campingplatzes. Sie richtet sich auf und vergisst, dass sie dich eigentlich maßregeln wollte.'],
      joke: ['Das Wegbier öffnet mehr Schranken als jeder Schlüssel. Gundula duzt dich nach dem zweiten Schluck und nennt ihre eigene Regel „eigentlich nur eine Empfehlung“.'],
      challenge: ['Gundula nimmt die Beer-Pong-Challenge mit beleidigtem Ehrgeiz an. Sie ist sofort weniger Platzleitung und deutlich mehr Kneipenmannschaft.'],
    },
    negative: {
      listen: ['Du lästerst über jemanden, den Gundula gerade selbst nicht leiden kann. Sie verteidigt die Person trotzdem, nur um dir nicht recht geben zu müssen.'],
      help: ['Die Schmeichelei klingt wie Schmeichelei. Gundula liebt Manipulation nur, solange sie sich für eigene Menschenkenntnis halten kann.'],
      joke: ['Das Bier ist warm. Gundula behandelt die Temperatur wie einen persönlichen Angriff auf ihre Amtswürde.'],
      challenge: ['Gundula verliert den ersten Wurf und erklärt den Tisch für regelwidrig. Dein sportliches Argument wird zum zusätzlichen Verfahren.'],
    },
    personalReveal: 'Gundula gibt nach genügend Zustimmung zu, dass ihr das Aufspielen vor allem Spaß macht: Solange alle zu ihr kommen müssen, fühlt sie sich wichtiger als der Platz selbst.',
    consequenceFlag: 'authority-goodwill',
    assistLabel: 'Gundulas Ego ist geknackt: Zustimmung, Bier und öffentliches Spiel bringen ihre Härte schnell zum Einsturz.',
  });

  Object.assign(CHARACTER_VOICES.uli, {
    role: 'Schlüsselbund-Macho und Schranken-Rambo',
    cadence: 'kurz, grimmig und künstlich dominant; wird nach „Chef“, Wegbier oder Nackenklatscher sofort zum kumpelhaften Mitpöbler',
    values: ['als Chef behandelt werden', 'Wegbier', 'Leute gemeinsam abwerten'],
    irritants: ['Ironie, die er bemerkt', 'falsch geparkte Fahrzeuge', 'fehlender Respekt vor dem Schlüsselbund'],
    likes: ['help', 'listen', 'joke', 'challenge'],
    dislikes: [],
    openings: [
      'Uli lässt den Schlüsselbund kreisen. „Ein falscher Schritt und du parkst draußen. Ist mir völlig egal, was auf der Reservierung steht.“',
      '„Kurz machen.“ Uli nimmt einen Schluck und beginnt danach selbst eine zwölfminütige Beschwerde über andere Camper.',
      'Uli stellt sich einen halben Meter zu breit in den Weg. „Parkplatz vier. Wer den nicht findet, sollte vielleicht kein Fahrzeug führen.“',
      '„Was guckst du? Schranke ist zu.“ Der Schlüsselbund sagt dasselbe, nur lauter.',
    ],
    returning: [
      '„Da ist ja mein Spezialist.“ Uli meint damit gleichzeitig Freund und Problemfall.',
      'Uli hebt kurz das Bier. „Alles gut. Aber nur, weil ich das so entschieden habe.“',
      'Der Schlüsselbund klimpert. Danach folgt ein Nicken, das fast kameradschaftlich wäre.',
    ],
    choices: [
      { id: 'uli-route', label: 'Ihn zum einzigen Mann erklären, der den Laden noch im Griff hat', hint: 'Sicher · Ego bestätigen und Insiderstatus gewinnen', topic: 'plan', approach: 'help', risk: 'safe' },
      { id: 'uli-four', label: 'Mit ihm über falsch parkende Vollpfosten pöbeln', hint: 'Gemeinsame Feindbilder · schnell wirksam, erhöht Chaos', topic: 'personal', approach: 'listen', risk: 'balanced' },
      { id: 'uli-fix', label: 'Ein Wegbier gegen eine großzügige Auslegung von Parkplatz vier anbieten', hint: 'Kumpeldeal · eigener Pegel steigt', topic: 'weekend', approach: 'joke', risk: 'balanced' },
      { id: 'uli-feeling', label: '„Passt, Chef“ sagen und einen Kumpel-Nackenklatscher riskieren', hint: 'Sehr riskant · trifft exakt seine primitive Anerkennungslogik', topic: 'personal', approach: 'challenge', risk: 'risky' },
    ],
    positive: {
      listen: ['Uli schimpft über Einparkversuche, Kabelwege und Menschen mit Anhängern. Nach fünf Minuten verteidigt er dich bereits gegen dieselben Leute.'],
      help: ['Das Wort „Chef“ wirkt sofort. Uli zeigt dir Abkürzungen, Kontrollzeiten und Stellen, an denen er selbst nicht so genau hinsieht.'],
      joke: ['Das Wegbier verschiebt Parkplatz vier um mehrere Meter. Uli nennt das „praktische Lösung“ und fühlt sich dabei wie ein Gesetzgeber.'],
      challenge: ['Der Nackenklatscher sitzt. Uli grinst, schlägt zurück und akzeptiert dich damit nach seinem vollständigen sozialen Betriebssystem.'],
    },
    negative: {
      listen: ['Du schimpfst ohne konkrete Namen oder Kennzeichen. Uli hält pauschales Pöbeln für mangelnde Sachkenntnis.'],
      help: ['Das „Chef“ klingt ironisch. Uli erkennt selten Ironie, aber ausgerechnet jetzt reicht es.'],
      joke: ['Das Wegbier ist nicht kalt. Uli macht aus der Temperatur eine Frage des Respekts.'],
      challenge: ['Der Nackenklatscher landet zu früh. Uli dreht sich langsam um und sogar Gundula macht einen Schritt zurück.'],
    },
    personalReveal: 'Uli gibt nach genügend Wegbier zu, dass er die Schranke vor allem mag, weil dort jeder an ihm vorbei muss. Der Schlüssel ist weniger Werkzeug als Publikumsmagnet.',
    consequenceFlag: 'uli-route-knowledge',
    assistLabel: 'Uli ist über Ego und Kumpelrituale geknackt: Kontrollgänge und Gegenzüge werden vorhersehbar.',
  });
}

function installCombatMoves(): void {
  Object.assign(COMBAT_MOVES['classic-high-five'], {
    label: 'Kumpel-Nackenklatscher', shortLabel: 'Nackenklatscher',
    description: 'Täuscht sofortige Männerfreundschaft an. Besonders stark gegen Leute, die Respekt ausschließlich als Schulterkontakt verstehen.',
    unlockDetail: 'Von Beginn an gelernt. Der Abstand zwischen Begrüßung und körperlich übertriebener Kameradschaft ist eine vollwertige Kampfressource.',
    flirtOption: 'Einen deutlich sanfteren Kumpel-Nackenklatscher nur andeuten und rechtzeitig stoppen',
  });
  Object.assign(COMBAT_MOVES['aldi-shirt-show'], {
    label: 'Aldi-Shirt-Offensive', shortLabel: 'Aldi-Offensive',
    description: 'Spannt die Aktionsware wie eine Uniform über der Brust und verlangt Anerkennung für textile Preis-Leistungs-Dominanz.',
    unlockDetail: 'Nach dem Schrankenfrustkampf. Gundula bezeichnet das Shirt als „auffällig“, Uli fragt nach dem Preis.',
  });
  Object.assign(COMBAT_MOVES['agree-anyway'], {
    label: '„Chef, du hast komplett recht“', shortLabel: 'Chef-Recht',
    description: 'Überfüttert das gegnerische Ego mit Zustimmung, bis die vorbereitete Standpauke mangels Widerstand in sich zusammensackt.',
    unlockDetail: 'Nach einem persönlichen Gespräch mit Gundula. Ihre größte Schwäche ist Zustimmung, die sie für Einsicht hält.',
  });
  Object.assign(COMBAT_MOVES['logical-argument'], {
    label: 'Bierdeckel-Beweisführung', shortLabel: 'Bierdeckel-Logik',
    description: 'Komprimiert das gesamte Argument auf einen feuchten Bierdeckel. Dass alles darauf passt, beschädigt ausufernde Gegner nachhaltig.',
  });
  Object.assign(COMBAT_MOVES['dry-counter'], {
    label: 'Ein-Wort-Pöbelkonter', shortLabel: 'Pöbelkonter',
    description: 'Wartet den kompletten Monolog ab und antwortet nur „stark“. Zustimmung, Beleidigung und Desinteresse treffen gleichzeitig.',
  });
  Object.assign(COMBAT_MOVES['camping-chair-block'], {
    label: 'Bierbank-Sitzblockade', shortLabel: 'Bierbank-Block',
    description: 'Besetzt demonstrativ den Machtbereich mit einem Campingstuhl. Der Gegner muss um eine sitzende Person herum Autorität spielen.',
  });
  Object.assign(COMBAT_MOVES['beer-offer'], {
    label: 'Halbes Bier als Friedensvertrag', shortLabel: 'Biervertrag',
    description: 'Schiebt ein halbvolles Bier über den Tisch. Konfliktgrund und Paragraph verschwimmen sofort hinter einem konkreten Trinkangebot.',
    unlockTitle: 'Wegbier-Diplomatie verstehen',
    unlockDetail: 'Nach einem erfolgreichen Trinkritual mit Lars, Gundula oder Uli.',
  });
  Object.assign(COMBAT_MOVES['synchronised-cheer'], {
    label: 'Bierbank-Chor „JAWOLL CHEF!“', shortLabel: 'Jawoll-Chef-Chor',
    description: 'Die Gruppe bestätigt den Gegner gleichzeitig so übertrieben, dass Stolz und Misstrauen frontal kollidieren.',
  });
  Object.assign(COMBAT_MOVES['cup-eye-contact'], {
    label: 'Beer-Pong-Zwangsduell', shortLabel: 'Pong-Duell',
    description: 'Erklärt den Konflikt zum Beer-Pong-Duell und setzt etwas ein, das der Gegner vor Publikum nicht verlieren will.',
    unlockTitle: 'Jemanden öffentlich zum Beer Pong zwingen',
    unlockDetail: 'Nach einem Beer-Pong-Sieg oder einer erfolgreichen Schranken-Challenge gegen Gundula.',
    flirtOption: 'Ein spielerisches Beer-Pong-Duell vorschlagen, ohne daraus eine Machtdemonstration zu machen',
  });
  Object.assign(COMBAT_MOVES['total-exaggeration'], {
    label: 'Platzwart-Legendenlüge', shortLabel: 'Legendenlüge',
    description: 'Erfindet eine heroische Platzgeschichte, in der der Gegner größer, härter und wichtiger war als jede überprüfbare Realität.',
  });
}

function installOpponentProfile(): void {
  Object.assign(COMBAT_OPPONENTS['entry-authority'], {
    name: 'Gundula & Uli',
    title: 'Schranken-Rambos im Frühschoppenmodus',
    maxFrustration: 108,
    traits: ['grimmig', 'angeschickert', 'pöbelsüchtig', 'leicht am Ego zu packen'],
    baseCounterFrustration: 16,
    moveMultipliers: {
      'classic-high-five': 1.48,
      'aldi-shirt-show': .82,
      'agree-anyway': 1.58,
      'logical-argument': .48,
      'dry-counter': 1.12,
      'camping-chair-block': .92,
      'beer-offer': 1.62,
      'synchronised-cheer': 1.28,
      'cup-eye-contact': 1.46,
      'total-exaggeration': 1.34,
    },
    tagMultipliers: { rapport: 1.34, submission: 1.42, drink: 1.52, charm: 1.28, team: 1.12, chaos: 1.15, logic: .58, style: .82 },
    counterLines: [
      'GUNDULAS BRILLENRAND-VERHÖR: Ein Blick, ein Seufzer und du fühlst dich für Dinge schuldig, die noch gar nicht passiert sind.',
      'ULIS SCHLÜSSELBUND-SALVE: Acht Schlüssel klimpern, einer passt, und trotzdem klingt es wie eine Räumungsandrohung.',
      'BIERATEM-SCHRANKENPREDIGT: Uli nennt dich „Sportsfreund“ und macht Parkplatz vier zur moralischen Prüfung.',
      'DOPPEL-PÖBELKOMBO: Beide reden gleichzeitig, widersprechen einander und geben dir geschlossen die Schuld.',
    ],
  });
}

function installVisuals(): void {
  const gundula = CHARACTER_VISUALS.find((entry) => entry.id === 'gundula');
  if (gundula) Object.assign(gundula, {
    role: 'PLATZKÖNIGIN', scaleX: .96, scaleY: .98,
    shirt: 0x4c252d, shirtShade: 0x271318, trousers: 0x1f2123, accent: 0xd0a55d,
    idleAnimation: 'drink', greetingAnimation: 'stagger',
    dialogue: 'Na, da kommt ja die nächste organisatorische Spitzenleistung. Schranke bleibt erst mal zu.',
  });
  const uli = CHARACTER_VISUALS.find((entry) => entry.id === 'uli');
  if (uli) Object.assign(uli, {
    role: 'SCHRANKEN-RAMBO', scaleX: 1.25, scaleY: 1.01,
    shirt: 0x343126, shirtShade: 0x1c1a15, trousers: 0x51523d, accent: 0xd0a33d,
    idleAnimation: 'drink', greetingAnimation: 'hit',
    dialogue: 'Parkplatz vier. Und guck nicht so. Schranke ist zu, weil ich das sage.',
  });
}
