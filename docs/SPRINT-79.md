# Sprint 79 – Objekt-Audit und Weltdetails

## Ziel

Die komplette Außenwelt wird erneut auf plausible Objektpositionen, freie Laufwege, erreichbare Eingänge und visuelle Dichte geprüft. Zusätzliche Details dürfen keine neuen Kollisionen oder Questprobleme erzeugen.

## Positionskorrekturen

- René- und Lars-Zelt besitzen keine überlappenden Kollisionsflächen mehr.
- Der Campingtisch überschneidet das Sanitärgebäude nicht mehr.
- Die fünf Zelte bilden eine lesbare Gruppe mit freiem Mittelgang.
- Die Hecke liegt hinter den Zelteingängen und besteht weiterhin aus zwei Segmenten mit breitem Durchgang.
- Tische, Bänke, Camper, Bäume, Werkstatt, Holzlager, Strandmöbel, Felsen und Buchtelemente wurden zonenweise neu ausgerichtet.
- Der zweite Baum in der Bucht steht vollständig auf trockenem Land.
- Gundula, Uli und die übrigen Figuren wurden an die korrigierten Objektgruppen angepasst.

## Automatische Layoutprüfung

Sprint 79 erweitert die Layouttests von drei auf elf verbindliche Verbindungen:

- Parkplatz-Zufahrt
- Schrankenpassage
- Hauptweg im Südlager
- Übergang zum Nordlager
- Nordlager-Spange
- Zugang zur Festwiese
- Festwiesenrand
- Wald-Serviceweg
- Verbindung zur Bucht
- Zugang zum Hauptsteg
- Zugang zum kleinen Steg

Zusätzlich werden freie Annäherungsflächen für Rezeption, Sanitärgebäude, eigenes Zelt, Partyzelt und Schwarzes Brett geprüft. Die Validierung erkennt außerdem:

- sich überschneidende physische Objektflächen,
- zu geringe Abstände zwischen statischen Objekten,
- Objekte außerhalb ihrer Region,
- Objekte oder Figuren im Wasser,
- blockierte Feuerstellenbereiche,
- blockierte Lauf- und Eingangsflächen.

## Neue grafische Detail-Schicht

Die Dekoration befindet sich in `src/game/worldDetailLayer.ts` und bleibt vollständig ohne Kollision. Dadurch kann die Welt dichter wirken, ohne unsichtbare Hindernisse zu erzeugen.

### Ankunft und Rezeption

- Parkplatzmarkierungen und Reifenspuren
- sichtbarer Schrankenbaum und Poller
- Müllbehälter und Bank
- detailliertes Schwarzes Brett mit einzelnen Aushängen

### Südlager

- ausgetretener Boden um die Feuerstelle
- Zeltschnüre und Heringe
- Kühlbox, Getränkekiste und Feuerholz
- Campingstühle
- sichtbare Pflanzenstruktur der Hecke

### Nordlager

- Kiesflächen unter den Wohnwagen
- Wäscheleine
- Pflanzkasten
- zusätzliche Campingstühle

### Festwiese

- strapazierte Grasflächen
- Strom- und Audiokabel
- Lautsprecherstapel
- Kleinteile und Veranstaltungsaufbau

### Strand

- nasse Sandkante
- Fußspuren
- Schilf und Uferpflanzen
- Sonnenschirm, Rettungsring und Strandtuch
- zusätzliche Wasserreflexe im Cinematic-Profil

### Waldsaum

- Laub, Äste und Moosflächen
- Holzstapel
- Werkzeug- und Werkstattdetails

### Bucht

- Kiesel und unregelmäßiger Untergrund
- Treibholz
- Uferpflanzen
- zusätzliche Fels- und Vegetationsdetails

## Kompatibilität

- Das Speicherformat bleibt unverändert.
- Questflags und Gesprächssysteme werden nicht geändert.
- Alle neuen Dekorationen sind nicht interaktiv und nicht kollidierend.
- Die bestehenden Interaktionspositionen bleiben mit der korrigierten Welt erreichbar.
