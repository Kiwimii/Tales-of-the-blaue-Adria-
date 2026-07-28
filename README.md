# Tales of the Blaue Adria

Ein schwarzhumoriges, storygetriebenes Camping-RPG für Smartphone und Desktop. Das Spiel verbindet eine frei begehbare Top-down-Welt mit Dialogproben, Bedürfnissen, festen Tagesabläufen, Quests, einer rekrutierbaren Freundesgruppe, rundenbasierten Frustkämpfen und eingebetteten Minispielen.

## Jetzt spielen

**Vollständige Legacy-Alpha:** [Build v29 starten](https://kiwimii.github.io/Tales-of-the-blaue-Adria-/?v=29)

**Neue Next-Alpha:** [Sprint 89 starten](https://kiwimii.github.io/Tales-of-the-blaue-Adria-/next/?v=89)

Inhaltlicher Stand: **Sprint 28 · v1.8.0 · Build v29**

Die Alpha ist von Freitagmorgen bis zum Sonntagsfinale spielbar. Spielstände, Export/Import, mobile Steuerung und Offline-Nutzung werden unterstützt.

Die Zielarchitektur enthält die **Gameplay-Sprints 29–89** und wird parallel unter `/next/` veröffentlicht. Die Sprints 46–55 erweiterten die Außenwelt zu einer großen Karte mit sieben Regionen. Sprint 56 korrigierte Maßstab, Kollision und Tiefensortierung. Sprint 57 baute die zusammenhängende Ankunftsquest zum Taucherplatz. Die Sprints 58–72 vernetzen Körperzustände, visuelle Effekte, Kämpfe, Freundesbeziehungen, aktives Dreierteam, Flirts, Geschenke, Tagesroutinen, Kontrollgänge und Masls Minispiel zu einem gemeinsamen Metagame. Sprint 73 stabilisiert Schwarzes Brett und Questnavigation. Die Sprints 74–78 überarbeiten mobile Eingaben, Szenenwechsel und Interaktionen. Die Sprints 79–81 führen den kanonischen Campingplatz-Blueprint ein. Sprint 82 vereinheitlicht die Frustkämpfe. Die Sprints 83–84 ordnen Karte, Wege, Funktionsflächen und Objekte neu. Sprint 85 überarbeitet die gesamte UX. Sprint 86 führt die vollständige Interaktionsauswahl und das Hecken-Minispiel ein. Sprint 87 ergänzt Grafikprofile und einen planbasierten Detail-Layer. Sprint 88 vertieft Personen, Objekte, Bäume und Wegmaterialien und ergänzt eine auswählbare Questverfolgung. Sprint 89 ersetzt den sichtbaren mobilen Aktionsbutton durch eine unsichtbare rechte Tippfläche, ordnet die Freundeszelte als begehbaren Kreis an, strukturiert die Questgegenstände am Versorgungsrand und gibt Gundula sowie Uli eindeutige grimmige Erscheinungsbilder.

## Entwicklungsstatus

| Bereich | Status | Verbindliche Rolle |
| --- | --- | --- |
| `docs/` | umfangreiche, veröffentlichte Alpha | Referenz für Funktionsumfang und GitHub-Pages-Release |
| `src/` | spielbare React-/Phaser-/TypeScript-Next-Alpha | einzige Zielarchitektur für die weitere Entwicklung |
| `docs/next/` | gebauter Next-Preview | separater GitHub-Pages-Release der Zielarchitektur |

`docs/` ist feature-frozen. Neue Spielinhalte entstehen ausschließlich in der TypeScript-Zielarchitektur unter `src/`.

Die Architekturentscheidung steht in [ARCHITECTURE.md](docs/ARCHITECTURE.md). Den Migrationsstand zeigt [MIGRATION-CHECKLIST.md](docs/MIGRATION-CHECKLIST.md).

## Aktueller Spielumfang

- Charaktererstellung und Supermarkt-Prolog mit 25-Euro-Budget
- Ankunftsquest mit Reservierungsrätsel, Gundula-/Uli-Kontrolle, Frustkampf, Stromproblem, Ausladen und Bier-Meilenstein
- sichtbares Schwarzes Brett in jedem Questzustand
- auswählbare Verfolgung aller laufenden Quests im Übersichtsmenü
- pulsierender Weltmarker sowie Richtungspfeil mit Zielname und Entfernung
- dynamische Ziele für jeden Schritt der Ankunftsquest und die nächste noch fehlende Person
- vollständige Auswahl mehrerer erreichbarer Personen, Türen, Gegenstände und Aktivitäten
- mobile Auswahlleiste sowie Desktop-Wechsel über Q, Tab und Zifferntasten
- universelles X für Rätsel, Kämpfe, soziale Ansichten, Innenräume und Minispiele
- mobile Wischsteuerung auf der linken Seite
- unsichtbare, weiterhin funktionale Aktionsfläche über der rechten Bildschirmhälfte
- klar getrennte Bewegungs- und Aktionsbereiche ohne großen sichtbaren Mobilbutton
- fokussiertes HUD mit Zeit, verfolgter Quest, Zielort und Warnungen
- Spielmenü mit responsiver Navigation, Grafikprofilen und Questauswahl
- gespeicherte Grafikprofile: Automatisch, Mobil optimiert und PC optimiert
- detailliertere Figuren mit Körperteilen, Gesichtszügen, Kleidungsmustern und individuellen Gegenständen
- Gundula mit kurzen hochstehenden weißen Haaren, Brille, strenger Jacke, Klemmbrett und grimmiger Mimik
- Uli mit Glatze, breitem Körper, dunklem Tanktop, Schlüsselbund und grimmiger Mimik – ohne Brille
- unterschiedliche Asphalt-, Kies- und Sandwege mit eigenen Texturen
- Bäume mit Ästen, Rinde, Astgabeln und einzelnen Blättern
- konstruktive Details für Gebäude, Zelte, Wohnwagen, Bühne, Stege, Zäune, Möbel, Schilder, Felsen und Pflanzen
- frei begehbarer Campingplatz mit sieben stufenweise freigeschalteten Regionen
- südliche Einfahrt, Parkreihe, Schranke und eigener Rezeptionshof
- durchgehende Nord-Süd-Hauptachse und klar angebundene Querwege
- zwölf funktionale Parzellen für Ankunft, Rezeption, Stellplätze, Adria-Klause, Sanitär, Taucherplatz, Festwiese, Strand, Servicehof und Bucht
- fünf Freundeszelte als offener Fünfeck-Ring westlich der Hauptachse
- mindestens 42 Pixel freie Laufbreite zwischen allen Zeltkörpern
- mindestens 72 Pixel freier Gemeinschaftsraum rund um die Feuerstelle
- horizontale und vertikale Kieswege durch den Zeltkreis
- jeder Freund steht am nach innen gerichteten Eingang seines eigenen Zeltes
- östlicher Versorgungsrand mit Wagen, Getränken, Zeltsäcken, Kabeltrommel und Stromkasten
- Kabeltrommel logisch zwischen Wagen und Stromkasten samt sichtbarer Kabelroute
- Getränke direkt bei Wagen, Kühlplatz und erstem Bier
- Questmarker verwenden dieselben Positionen wie die sichtbaren Gegenstände
- Bühne im Norden der Festwiese, Partyzelt in der Mitte und Kiosk am südlichen Rand
- Werkstatt und Holzlager gemeinsam am Wirtschaftsweg
- See, Strand, Hauptsteg und Bucht dauerhaft auf der rechten Kartenseite
- Campingplatz und Strand durch einen physischen Zaun mit eindeutigem Tor getrennt
- automatische Prüfung von Straßengraph, Funktionsflächen, Objektabständen, Eingängen, Zeltkreis, Versorgungskette und Wasseranschlüssen
- mehrere Gesprächsthemen, Geschenke, Beziehungen, Teamrekrutierung und Flirts
- gemeinsames Frustkampfsystem für Gundula/Uli und Ronny
- maximal vier ausrüstbare Attacken aus einem wachsenden Repertoire
- zehn Attacken mit Lernwegen über Kämpfe, Gespräche und Minispiele
- systemische Körperzustände: Alkohol, Breitheit, Kater, Erschöpfung und Dehydrierung
- neun ausgearbeitete Freunde und ein aktives Team aus maximal drei Personen
- Ronny-Frustduell, Flip Cup, Beer Pong, Masls „Komm ans Loch“ und Flunkyball mit festen Weltzugängen
- Schleichen-/Timing-Minispiel „In die Hecke“ mit Erleichterung, Verdacht und Blickrisiko
- lokale Spielstände, mobile Steuerung, optionale Minikarte und installierbare PWA

## Lokale Entwicklung

Voraussetzung: Node.js 24 oder neuer.

```bash
npm ci
npm run dev
```

## Qualitätsprüfung

```bash
npm run check
```

Der Befehl prüft:

- Syntax, Vollständigkeit und Ladefolge der Runtime
- Build-Version, PWA-Manifest und Offline-Cache
- TypeScript-Typen
- Store-, Welt-, Navigation-, Quest-, Interaktions-, Platzierungs-, Zeltkreis-, Versorgungsketten-, Grafik-, Mobil-, Gesprächs-, Kampf-, Team- und Minispieltests
- Produktionsbuild und Next-Preview

Die Sprint-Historie liegt in [SPRINTS.md](docs/SPRINTS.md), [SPRINTS-21-28.md](docs/SPRINTS-21-28.md), [SPRINTS-29-33.md](docs/SPRINTS-29-33.md), [SPRINTS-34-43.md](docs/SPRINTS-34-43.md), [SPRINTS-44.md](docs/SPRINTS-44.md), [SPRINTS-45.md](docs/SPRINTS-45.md), [SPRINTS-46-55.md](docs/SPRINTS-46-55.md), [SPRINT-56.md](docs/SPRINT-56.md), [SPRINT-57.md](docs/SPRINT-57.md), [SPRINTS-58-72.md](docs/SPRINTS-58-72.md), [SPRINT-73.md](docs/SPRINT-73.md), [SPRINT-74.md](docs/SPRINT-74.md), [SPRINT-75.md](docs/SPRINT-75.md), [SPRINT-76.md](docs/SPRINT-76.md), [SPRINT-77.md](docs/SPRINT-77.md), [SPRINT-78.md](docs/SPRINT-78.md), [SPRINT-79.md](docs/SPRINT-79.md), [SPRINT-80.md](docs/SPRINT-80.md), [SPRINT-81.md](docs/SPRINT-81.md), [SPRINT-82.md](docs/SPRINT-82.md), [SPRINT-83.md](docs/SPRINT-83.md), [SPRINT-84.md](docs/SPRINT-84.md), [SPRINT-85.md](docs/SPRINT-85.md), [SPRINT-86.md](docs/SPRINT-86.md), [SPRINT-87.md](docs/SPRINT-87.md), [SPRINT-88.md](docs/SPRINT-88.md) und [SPRINT-89.md](docs/SPRINT-89.md).
