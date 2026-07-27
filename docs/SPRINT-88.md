# Sprint 88 – Strukturelle Grafikdetails und Questnavigation

## Ausgangslage

Sprint 87 ergänzte technisch neue Umgebungsdetails, blieb visuell aber zu vorsichtig. Viele Elemente bestanden aus kleinen, transparenten Bodenflecken oder Partikeln. Besonders auf dem automatisch gewählten Mobilprofil war der Unterschied kaum erkennbar. Gleichzeitig konnten mehrere Quests aktiv sein, während das Spiel weiterhin automatisch nur eine Prioritätsquest im HUD anzeigte.

Sprint 88 setzt deshalb zwei verbindliche Ziele um:

1. Ein Grafikupdate muss die Form und Konstruktion der Spielwelt sichtbar verändern – nicht nur die Partikelzahl.
2. Aktive Quests müssen bewusst auswählbar und räumlich auffindbar sein.

## Personen

Die 46 × 64 Pixel großen Figuren bleiben wegen vorhandener Kollisionen und Animationen kompatibel, werden aber vollständig neu gezeichnet.

Jede Figur besitzt jetzt:

- Hals und Schultern
- getrennte Oberarme, Unterarme und Hände
- Gürtel und Schnalle
- erkennbare Knie
- Schuhe mit Sohlen und Schnürung
- Ohren, Augenweiß, Pupillen, Augenbrauen, Nase und Mund
- Kleidungsmuster wie Streifen, Emblem, Tasche oder Kragen
- charakterabhängige Haare und Accessoires

Zusätzlich erhalten die Personen individuelle Gegenstände:

- Gundula: Klemmbrett
- Uli: Schlüsselbund
- Manni: Toilettenpapierrolle
- Ronny: erhobener Erklärfinger
- André: Plan beziehungsweise Ablaufzettel
- René: roter Becher
- Lars: Flasche
- Gregor: Grillzange
- Felix: Smartphone
- Masl: Pfeife
- Schubert: Blatt
- Schima: Leuchtstab

## Wege und Materialien

Alle kanonischen Straßen und Fußwege erhalten materialabhängige Oberflächen:

### Asphalt

- sichtbare Risse
- verzweigte Schadstellen
- rechteckige Flicken
- harte Randlinien
- unterschiedliche Grautöne

### Kies

- einzelne Steine in mehreren Farbtönen
- unregelmäßige Verteilung
- Fahr- und Laufspuren
- weicher Übergang zum Platzrand

### Sand

- einzelne Fußabdrücke
- paarweise Trittspuren
- flache Sandrippel
- weiche Kanten

Die Texturen werden aus dem bestehenden Straßengraph erzeugt. Sie besitzen keine zweite Koordinatenquelle und keine eigenen Kollisionen.

## Bäume und Vegetation

Jeder Baum erhält zusätzlich zur bisherigen Krone:

- ein sichtbares Netz aus Haupt- und Nebenästen
- Rindenlinien
- Astknoten und Stammnarben
- einzelne Blätter mit unterschiedlichen Größen, Winkeln und Grüntönen

Das Mobilprofil zeigt pro Baum mindestens 38 einzelne Blätter, das PC-Profil 72. Bewegungen bleiben dem PC-Profil beziehungsweise Geräten mit ausreichender Leistung vorbehalten.

## Sämtliche Weltobjekte

Für jede vorhandene Objektart existiert jetzt eine eigene strukturelle Detailebene:

- Gebäude: Dachreihen, Fassadenlinien, Dachrinne, Fallrohr, Fensterteilung und Beschläge
- Kioske: Holzbohlen, Flaschen, Tresen und Rahmen
- Zelte: Nähte, Reißverschluss, Eingang, Lüftung, Abspannleinen und Heringe
- Partyzelt: Stoffbahnen, Seile und Verankerungen
- Wohnwagen: Paneelfugen, Fensterrahmen, Türgriff, Leuchten, Kennzeichen und Dachkante
- Bühne: Traversen, Kreuzverstrebungen, Bodenplanken, Lautsprecher und Kabel
- Stege: einzelne Bohlen, Nägel und Holzmaserung
- Zäune: Pfostenstruktur, Nägel und Drahtreihen
- Tische und Bänke: Bretter, Schrauben und Beine
- Schilder: Maserung und Befestigung
- Felsen: Bruchlinien und Aufhellungen
- Laternen: Gehäuse und Streben
- Blumenbeete: einzelne Blätter und Blattadern

## Große erkennbare Szenengruppen

Zusätzlich zu den Objektdetails besitzt jeder Hauptbereich eine sofort erkennbare Identität:

- Ankunft: Straßenschrift „BLAUE ADRIA“, Check-in-Fahnen, Markise, Fahrradständer und Pflanzkübel
- Dauercamper: Wäscheleine, Markisen, Blumenkästen und Sitzplätze
- Taucherplatz: beschriftete Zelte, Matten, Kühlbox, Getränkekisten, Tisch, Stühle, Feuerstelle und Wimpelkette
- Festwiese: Tanzfläche, Bühnentechnik, Lautsprecher, Getränkekisten, Palettenlounge und Fahnen
- Strand: Sonnenschirme, Handtücher, Rettungsring, Strandtasche und Fußspuren
- Servicehof: Schubkarre, Reifen, Werkzeugwand, Holzstapel und Gebrauchsspuren
- Bucht: Laternen, Steinkreis, Treibholz und Lagerplatz

Die mehr als 100 Kernelemente bleiben auch im Mobilprofil sichtbar. Das PC-Profil ergänzt zusätzliche Gegenstände, Lichtanimationen, Blätter und Wasserreflexe.

## Auswählbare Questverfolgung

Im Übersichtsmenü erscheint ein neuer Bereich **Zielfindung**. Er listet alle aktuell laufenden Quests auf. Der Spieler kann eine davon ausdrücklich verfolgen.

Die Auswahl wird lokal gespeichert und bleibt nach einem Neuladen erhalten. Ist die gewählte Quest nicht mehr aktiv, verwendet das Spiel automatisch eine andere laufende Quest.

## Räumliche Zielführung

Die verfolgte Quest erhält:

- einen pulsierenden Marker direkt am Weltziel
- den Namen der Quest und des Zielorts am Marker
- einen Richtungspfeil am Bildschirmrand, wenn das Ziel außerhalb der Kamera liegt
- die ungefähre Entfernung in Metern
- eine aktualisierte Zielbeschreibung im HUD

Die Ankunftsquest wechselt ihren Marker automatisch über alle Stationen:

1. Kofferraum
2. Reservierungsbrett
3. Gundula
4. Uli
5. Einlassdiskussion
6. Taucherplatz
7. Stromkasten
8. Ausladen
9. erstes Bier

Die Freundesquest zeigt auf die nächste noch nicht gefundene Person. Kampf- und Minispielquests verwenden exakt die Positionen ihrer tatsächlichen Aktivitätsmarker.

## Leistung und Architektur

Die Menüauswahl nutzt ein leichtes Datenmodell ohne Weltkoordinaten. Räumliche Karten-, NPC- und Aktivitätsdaten werden erst mit dem Phaser-Spiel geladen. Dadurch bleibt das initiale React-Bundle unter 300 kB.

Grafikdetails verändern weder Kollisionen noch Interaktionspunkte. Die kanonischen Platzierungs- und Aktivitätsdaten bleiben die einzige Quelle für spielrelevante Positionen.

## Qualitätssicherung

Sprint 88 ergänzt Tests für:

- vollständige Detailrenderer aller Objektarten
- verschiedene Materiallogik für Asphalt, Kies und Sand
- Mindestumfang sichtbarer Details im Mobilprofil
- anatomische Personenmerkmale und individuelle Gegenstände
- Baumäste und einzelne Blätter
- sieben große Szenengruppen
- Auswahl laufender Quests
- dynamische Ankunftsziele
- nächste fehlende Person
- exakte Aktivitätsmarker von Kampf und Minispielen
- verständliche Distanzumrechnung
- Produktions-CSS für Questauswahl und HUD-Ziel
- Produktionsbundle mit dynamischen Zielen und sichtbaren Szenenmerkmalen

Der PWA-Cache wird mit Sprint 88 auf `tales-adria-next-s88` angehoben.
