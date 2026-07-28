# Sprint 89 – Unsichtbare Mobilaktion, Zeltkreis und Platzwarte

## Mobile Aktion

Der sichtbare große Aktionsbutton wird auf Geräten mit grobem Zeiger beziehungsweise Touchscreen vollständig ausgeblendet. Seine vorhandene Eingabelogik bleibt erhalten:

- die rechte Bildschirmhälfte ist eine transparente Aktionsfläche,
- ein Tap löst weiterhin die aktuell ausgewählte Interaktion aus,
- Beschriftung, Kreis, Rahmen, Schatten und Aktivzustand bleiben unsichtbar,
- die linke Bewegungszone belegt 46 Prozent der Breite,
- zwischen Bewegung und Aktionsfläche bleibt dadurch ein kleiner neutraler Übergang.

Die Aktionsfläche besitzt bewusst weiterhin Pointer-Ereignisse. Sie wird nicht mit `pointer-events: none` deaktiviert.

## Begehbarer Zeltkreis

Die bisherige gerade Freundeszeltreihe wird durch einen offenen Fünfeck-Ring westlich der Nord-Süd-Hauptachse ersetzt.

Der Ring besteht aus:

- dem eigenen Zelt,
- Andrés Zelt,
- Renés Zelt,
- Lars’ Zelt,
- Dannys Zelt.

Die Zelte umgeben eine gemeinsame Feuerstelle. Zwischen sämtlichen Zeltkörpern bleiben mindestens 42 Pixel freie Laufbreite. Der Abstand der Zeltkörper von der Gemeinschaftsmitte beträgt mindestens 72 Pixel.

Ein Kiesweg erschließt den Kreis:

- von Westen bis zur Mitte,
- von der Mitte bis zur Hauptachse und Versorgungsseite,
- durch die südliche Öffnung,
- mit einem eigenen kurzen Zugang zum Spielzelt.

Alle vier Freunde stehen an den nach innen gerichteten Eingängen ihrer eigenen Zelte. Das eigene Zelt besitzt ebenfalls einen nach innen gerichteten Türpunkt.

## Hauptweg und Versorgungszone

Der komplette Zeltkreis liegt westlich der Hauptachse. Dadurch blockieren weder Zelte noch Freunde den zentralen Nord-Süd-Weg.

Die östliche Seite des Taucherplatzes bildet eine eigene Versorgungszone:

- Wagen am äußeren Rand,
- Getränkekisten und Kühlplatz direkt neben dem Wagen,
- erstes Bier unmittelbar beim Getränkevorrat,
- Zeltsäcke zwischen Wagen und Zugang zum Zeltkreis,
- Kabeltrommel zwischen Wagen und Stromkasten,
- Stromkasten am östlichen Rand.

Zwischen Kabeltrommel und Stromkasten wird eine sichtbare Kabelroute gezeichnet. Getränke, Zeltsäcke und Kabeltrommel erhalten eindeutige Beschriftungen. Die Storymarker verwenden exakt dieselben Positionen.

Automatische Regeln prüfen unter anderem:

- Getränke höchstens 145 Pixel vom Wagen entfernt,
- Kabeltrommel höchstens 120 Pixel vom Wagen entfernt,
- Kabeltrommel höchstens 105 Pixel vom Stromkasten entfernt,
- Zeltsäcke höchstens 210 Pixel vom Wagen entfernt,
- erstes Bier höchstens 90 Pixel von den Getränken entfernt,
- keine Questgegenstände innerhalb von Tisch oder Bank.

## Gundula

Gundula erhält eine eigenständige Silhouette:

- kurze, deutlich hochstehende weiße Stachelhaare,
- dunkle Brille,
- scharf nach innen gezogene Augenbrauen,
- missbilligender Mund,
- strenge Jacke,
- sichtbares Klemmbrett.

Ihr Beiname und ihre Standardzeile wurden ebenfalls verschärft. Sie wirkt nicht mehr wie eine zufällig variierte Standardfigur, sondern wie die personifizierte Platzordnung.

## Uli

Uli erhält ebenfalls eine eigenständige Silhouette:

- sichtbare Glatze,
- keine Brille,
- breiter Oberkörper,
- dunkles Tanktop mit freien Schultern und Armen,
- grimmige Augenbrauen und abweisender Mund,
- sichtbarer Schlüsselbund.

Sein Beiname und seine Standardzeile unterstreichen die wortkarge, abweisende Schrankenwärter-Rolle.

## Entfernung alter Überschreibungen

Die historische Laufzeitlogik setzte das eigene Zelt und einzelne Aktivitätsmarker nach dem Laden noch auf ältere Koordinaten zurück. Sprint 89 entfernt diese Restlogik.

Zeltkreis, Freundepositionen, Fahrzeug, Questgegenstände, Stromkasten, Hecke, Aktivitätsmarker und sichtbare Dekoration werden nun aus denselben gemeinsam vorbereiteten Platzdaten erzeugt.

## Qualitätssicherung

Sprint 89 ergänzt eigene Tests für:

- unsichtbare, weiterhin pointeraktive rechte Mobilfläche,
- Gundulas weiße Stachelhaare, Brille und grimmige Darstellung,
- Ulis Glatze, Tanktop und fehlende Brille,
- fünf Zelte im begehbaren Ring,
- mindestens 42 Pixel Abstand zwischen Zeltkörpern,
- mindestens 72 Pixel freien Gemeinschaftsraum,
- horizontale und vertikale Kreiszugänge,
- logische Kette aus Wagen, Getränken, Zeltsäcken, Kabeltrommel und Stromkasten,
- entsprechende Inhalte im Produktions-CSS und Produktionsbundle.

Der PWA-Cache wird auf `tales-adria-next-s89` angehoben.
