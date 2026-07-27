# Sprint 84 – Logischer Campingplatz und verbindliche Objektplatzierung

## Ausgangslage

Sprint 83 führte einen gemeinsamen Luftbildplan ein, ließ aber weiterhin unregelmäßige Geländeformen, diagonale Wegverbindungen und überwiegend freie Objektkoordinaten zu. Dadurch war die Karte technisch zusammenhängend, wirkte im Spiel jedoch weiterhin wie eine Ansammlung unabhängiger Formen. Objekte konnten innerhalb ihrer groben Region liegen, ohne funktional zueinander zu passen.

Sprint 84 ersetzt diese Freiformplanung durch einen nachvollziehbaren Campingplatzaufbau.

## Verbindliche Orientierung

Die Karte folgt nun einer festen räumlichen Logik:

1. Die Einfahrt kommt von Süden.
2. Die Parkreihe liegt unmittelbar hinter der Einfahrt.
3. Die Schranke folgt nördlich des Parkplatzes.
4. Die Rezeption besitzt rechts neben der Schranke einen eigenen Hof.
5. Eine durchgehende Nord-Süd-Achse erschließt den gesamten Campingplatz.
6. Drei Querwege verbinden Stellplätze, Sanitärbereich und Taucherplatz.
7. Festwiese, Strand und Servicehof zweigen klar von dieser Hauptstruktur ab.
8. See, Strand, Hauptsteg und Bucht liegen dauerhaft auf der rechten Kartenseite.

Alle Land- und Wasserflächen sind achsenparallel aufgebaut. Straßen dürfen nur horizontal oder vertikal verlaufen.

## Funktionale Flächen

Der Campingplatz wird nicht mehr nur nach großen Regionen, sondern nach zwölf konkreten Nutzungsflächen geplant:

- Parkplatz und Ankunft,
- Rezeption und Schrankenhof,
- obere Stellplatzreihe,
- Adria-Klause und Sitzbereich,
- Sanitär- und Dauercamperreihe,
- Taucherplatz und Zeltgruppe,
- Bühne und Veranstaltungsfläche,
- Partyzelt und Festwiese,
- Strandwache und Hauptsteg,
- Strandtor und Kiosk,
- Servicehof und Waldsaum,
- ruhige Bucht.

Jedes statische Objekt und jeder NPC ist einer dieser Flächen ausdrücklich zugeordnet. Der Validator lehnt Positionen außerhalb der erwarteten Nutzungsfläche ab.

## Logische Objektgruppen

### Ankunft

- Parkplatzbegrenzungen rahmen die Zufahrt, ohne sie zu schließen.
- Gundula und Uli stehen im Rezeptionshof statt auf der Fahrbahn.
- Schwarzes Brett, Rezeption und Schranke liegen in unmittelbarer Sicht- und Laufbeziehung.

### Taucherplatz

- Eigenes Zelt und vier Freundeszelte stehen in einer geraden, gleichmäßig beabstandeten Reihe.
- André, René, Lars und Danny stehen jeweils vor ihrem eigenen Zelt.
- Ein eigener Seitenweg führt vom mittleren Campingweg bis zum Spielzelt.
- Tisch, Bank und Feuerstelle liegen seitlich der Zeltreihe und nicht in deren Zugängen.

### Festwiese

- Die Bühne bildet den nördlichen Abschluss.
- Das Partyzelt steht in der mittleren Veranstaltungsfläche.
- Kiosk und Sitzmöbel liegen am südlichen Rand und nicht auf dem Hauptgang.

### Servicehof und Wasser

- Werkstatt und Holzlager liegen gemeinsam am Wirtschaftsweg.
- Der Hauptsteg führt tatsächlich in den großen See.
- Der kleine Steg führt tatsächlich in das Wasser der Bucht.
- Der Unterstand der Bucht liegt landeinwärts und nördlich des Stegs.

## Rendering

Der neue Blueprint zeichnet:

- zusammenhängende Funktionsparzellen,
- 36 rechtwinklige Asphalt-, Kies- und Sandwege,
- passende Kreuzungen und Wegmarkierungen,
- eine zur südlichen Einfahrt passende Parkreihe,
- den physischen Strandzaun mit eindeutigem Tor,
- Funktionsbeschriftungen ohne doppelte Regionsüberschriften.

Die bestehende Objektgrafik bleibt erhalten. Frühere Regionsbeschriftungen aus dem historischen Renderer werden nach dem Objektaufbau entfernt, damit nicht zwei Kartensysteme gleichzeitig sichtbar sind.

## Verbindliche Architekturregeln

`aerialCampgroundPlan.ts` ist weiterhin die einzige Quelle für Koordinaten. Zusätzlich gelten nun:

1. Neue Wege sind orthogonal und an den bestehenden Graphen anzuschließen.
2. Neue Objekte benötigen eine Funktionsflächenzuordnung.
3. Relevante Objektgruppen benötigen überprüfbare Nachbarschaftsregeln.
4. Gebäude, Zelte und Veranstaltungsobjekte dürfen keine Straßen oder Zugänge schneiden.
5. Nachträgliche Koordinaten-Overrides außerhalb des Plans sind nicht zulässig.

`worldRealism.ts` verändert keine Koordinaten mehr. Es enthält nur noch Kollisions-, Wasser-, Abstands- und Zugangsregeln.

## Automatische Prüfung

Sprint 84 prüft unter anderem:

- einen vollständig verbundenen Straßengraphen,
- ausschließlich horizontale und vertikale Straßen,
- achsenparallele Land- und Wasserpolygone,
- die Reihenfolge Einfahrt–Parkplatz–Schranke,
- die Rezeption rechts neben dem Schrankenhof,
- vollständige Funktionsflächenzuordnungen,
- Objekt- und NPC-Positionen innerhalb ihrer erwarteten Fläche,
- freie Haupt-, Quer-, Strand-, Service- und Stegwege,
- getrennte Kollisionsflächen relevanter Objekte,
- eine gleichmäßig ausgerichtete Zeltreihe,
- Freunde vor ihren eigenen Zelten,
- die Abfolge Bühne–Partyzelt–Kiosk,
- beide Stege mit echtem Wasseranschluss,
- erreichbare Türen und Questanker,
- Next-Cache `s84`.

Eine manuelle Prüfung auf einem physischen Android- oder iPhone-Gerät bleibt weiterhin separat erforderlich.
