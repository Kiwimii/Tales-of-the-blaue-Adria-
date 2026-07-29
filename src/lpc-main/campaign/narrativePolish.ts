import { INTRO_BEATS } from './narrative';

const VARIANT_KEY = 'tales-adria-intro-variant-v2';
const stored = Number.parseInt(sessionStorage.getItem(VARIANT_KEY) ?? '', 10);
const variant = Number.isFinite(stored) ? stored % 3 : Math.floor(Math.random() * 3);
sessionStorage.setItem(VARIANT_KEY, String(variant));

const variants: Record<string, string[][]> = {
  peace: [
    ['Noch ahnt die Wasserwacht nichts. Das ist ihr letzter unbelasteter Moment.', 'Auf dem Platz gelten Ruhezeiten. Die Gruppe betrachtet Uhrzeiten traditionell als Gerüchte.'],
    ['Der See liegt glatt. Später wird mindestens eine Person behaupten, genau dort sei ihr Handy verschwunden.', 'Sogar die Möwen wirken organisiert. Der Vergleich wird für Menschen ungünstig ausfallen.'],
    ['Die Rezeption öffnet. Gleichzeitig endet irgendwo unsichtbar die Zuständigkeit des gesunden Menschenverstands.', 'Der Platz ist sauber, ruhig und vollständig unvorbereitet.'],
  ],
  crew: [
    ['Jeder hat „alles Wichtige“ eingepackt. Die Definitionen überschneiden sich hauptsächlich bei Alkohol.', 'Die Person mit dem Klopapier wird später kurzzeitig zum mächtigsten Menschen der Gruppe.'],
    ['Neun Freunde teilen sich Navigation, Gepäck und eine erstaunlich begrenzte Menge Verantwortung.', 'Drei kennen den Weg. Alle drei meinen einen anderen.'],
    ['Das Auto ist voll. Der Tank ist es nicht. Die Zuversicht basiert auf keiner messbaren Größe.', 'Auf der Rückbank beginnt bereits der erste Konflikt über Musik und historische Schuld.'],
  ],
  budget: [
    ['An der Kasse entscheidet sich, ob das Wochenende an Durst, Hunger oder fehlendem Toilettenpapier scheitert.', 'Der Einkauf ist kein Tutorial. Er ist eine sehr frühe Beweisaufnahme.'],
    ['25 Euro reichen für Vernunft oder Stimmung. Beides gleichzeitig wäre schlechtes Balancing.', 'Die Kassiererin scannt wortlos und schützt damit ihre eigene Zeugenaussage.'],
    ['Jeder Artikel ist eine spätere Lösung oder ein besser verpacktes Problem.', 'Der Kassenbon dokumentiert Entscheidungen, die später niemand getroffen haben will.'],
  ],
  authority: [
    ['Gundula sitzt hinter dem Klemmbrett wie eine angeschickerte Königin ohne Königreich.', 'Uli bewacht die Schranke, als hätte er sie persönlich im Krieg erobert.'],
    ['Beide wollen dich nicht verstehen. Sie wollen sehen, ob du klein beigibst, mitpöbelst oder ihr Ego schneller fütterst als sie ihr Bier.', 'Wer „passt, Chef“ glaubwürdig sagt, kommt hier weiter als mit drei korrekten Formularen.'],
    ['Die erste Bossarena riecht nach Asphalt, Schlüsselbund und Frühschoppen.', 'Ihre größte Stärke ist Lautstärke. Ihre größte Schwäche ist jede Form von Bewunderung mit Getränk.'],
  ],
  reservation: [
    ['Vier nahezu gleiche Namen stehen auf der Liste. Nur einer führt nicht zu einer Familie im Ruhebereich.', 'Falsches Lesen kostet Minuten. Lautes falsches Lesen kostet zusätzlich Würde.'],
    ['Die Buchung ist vorhanden, aber bürokratisch getarnt.', 'Alphabetische Ordnung wurde hier offenbar unter Vorbehalt genehmigt.'],
    ['Ein Stück Papier entscheidet über Zugang zum Wochenende. Digitaler Fortschritt endet an Gundulas Kugelschreiber.', 'Die richtige Zeile ist sichtbar. Das macht sie nicht automatisch auffindbar.'],
  ],
  camp: [
    ['Strom, Zelte und Getränke müssen in eine Reihenfolge gebracht werden, bevor Lars nur noch eine davon akzeptiert.', 'Der Taucherplatz wird Operationsbasis, Küche und spätere Tatortbeschreibung.'],
    ['Hinter der Schranke wartet Freiheit mit Kabeltrommel.', 'Jeder Gegenstand besitzt einen vorgesehenen Platz. Keine Person wird ihn sofort benutzen.'],
    ['Das Lager entsteht. Von außen sieht es nach Aufbau aus, von innen bereits nach Schadensbegrenzung.', 'Das erste Bier beendet offiziell die Planungsphase.'],
  ],
  night: [
    ['In der Dunkelheit werden Gespräche ehrlicher, Würfe ungenauer und Hecken strategisch relevanter.', 'Romantik und Dehydrierung besitzen überraschend ähnliche Anfangssymptome.'],
    ['Der Platz wird leiser. Die Gruppe kompensiert.', 'Ab jetzt verändern Zustände nicht nur Werte, sondern auch Erinnerungen.'],
    ['Unter Lichterketten wirkt selbst eine schlechte Idee kurz wie Charakterentwicklung.', 'Wer jetzt noch einen Plan hat, wird verdächtigt, nüchtern zu sein.'],
  ],
  sunday: [
    ['Am Ende zählt nicht, ob alles gut ging. Es zählt, ob sich alle auf dieselbe Version einigen.', 'Der Platz soll stehen bleiben. Für einzelne Beziehungen gilt nur eine Zielquote.'],
    ['Sonntagmorgen ist der Endgegner ohne eigene Dialogoptionen.', 'Erinnerungen werden gesichert, Beweismittel eingesammelt und Pfand grob demokratisch verteilt.'],
    ['Wer abreist, nimmt Beziehungen, Attacken und mindestens einen unnötigen Gegenstand mit.', 'Das Wochenende endet. Seine Folgen wechseln nur den Speicherstand.'],
  ],
};

for (const beat of INTRO_BEATS) {
  const additions = variants[beat.id]?.[variant] ?? [];
  beat.lines = [...beat.lines.slice(0, 2), ...additions];
  beat.duration = Math.max(7200, beat.duration + additions.length * 950);
}

export function introVariantIndex(): number {
  return variant;
}
