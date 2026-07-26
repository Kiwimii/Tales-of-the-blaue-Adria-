# Tales of the Blaue Adria

Ein schwarzhumoriges, storygetriebenes Camping-RPG für Smartphone und Desktop. Das Spiel verbindet eine frei begehbare Top-down-Welt mit Dialogproben, Bedürfnissen, festen Tagesabläufen, Quests, einer rekrutierbaren Freundesgruppe, rundenbasierten Teamkämpfen und eingebetteten Minispielen.

## Jetzt spielen

**Vollständige Legacy-Alpha:** [Build v29 starten](https://kiwimii.github.io/Tales-of-the-blaue-Adria-/?v=29)

**Neue Next-Alpha:** [Sprint 56 starten](https://kiwimii.github.io/Tales-of-the-blaue-Adria-/next/?v=56)

Inhaltlicher Stand: **Sprint 28 · v1.8.0 · Build v29**

Die Alpha ist von Freitagmorgen bis zum Sonntagsfinale spielbar. Spielstände, Export/Import, mobile Steuerung und Offline-Nutzung werden unterstützt.

Die Zielarchitektur enthält die **Gameplay-Sprints 29–56** und wird parallel unter `/next/` veröffentlicht. Neu sind unter anderem der Weltraum-Schriftcrawl, die ausgebaute Charaktererstellung, die Gundula-/Uli-Einlassquest mit physischem Tor, betretbare Innenräume, 13 sichtbare Beziehungen sowie überarbeitetes Flip Cup, Beer Pong und Flunkyball. Die Sprints 46–55 erweiterten die Außenwelt zu einer großen, datengetriebenen Karte mit sieben Regionen. Sprint 56 korrigiert Maßstab, Objektabstände, Wassergrenzen, Kollisionsflächen, Tiefensortierung und unrealistische Umgebungsanimationen.

## Entwicklungsstatus

| Bereich | Status | Verbindliche Rolle |
| --- | --- | --- |
| `docs/` | umfangreiche, veröffentlichte Alpha | Referenz für Funktionsumfang und GitHub-Pages-Release |
| `src/` | spielbare React-/Phaser-/TypeScript-Next-Alpha | einzige Zielarchitektur für die weitere Entwicklung |
| `docs/next/` | gebauter Next-Preview | separater GitHub-Pages-Release der Zielarchitektur |

`docs/` ist ab jetzt **feature-frozen**: Dort werden nur kritische Fehler, Kompatibilität, PWA und Release-Stabilität gepflegt. Neue Spielinhalte werden erst wieder umgesetzt, wenn sie in der Zielarchitektur entstehen. Der Wechsel der veröffentlichten Fassung erfolgt erst nach nachgewiesener Funktionsparität.

Die vollständige Entscheidung und ihre Abnahmekriterien stehen in [ARCHITECTURE.md](docs/ARCHITECTURE.md). Den ehrlichen Migrationsstand zeigt [MIGRATION-CHECKLIST.md](docs/MIGRATION-CHECKLIST.md).

## Aktueller Spielumfang

- Charaktererstellung und Supermarkt-Prolog mit 25-Euro-Budget
- frei begehbarer, in sieben Regionen gegliederter Campingplatz mit stufenweisen Freischaltungen
- realistische Objektabstände, abgestufte Kollisionsflächen und Y-basierte Tiefensortierung
- neun Freunde mit Positionen, Dialogen, Werten und Fähigkeiten
- Zeit, Bedürfnisse, Alkohol, Würde, Chaos, Beziehungen und Inventar
- Quests, Kontrollen durch Gundula und Uli und mehrere Enden
- rundenbasierte Teamkämpfe
- Flip Cup, Beer Pong, Flunkyball, Trinkduell und Sonntags-Aufräumspiel
- lokale Spielstände mit Export, Import und Sicherheitsbackup
- mobile Steuerung, Safe Areas und Querformat-Unterstützung
- Minikarte, Bereichsbanner, Landmarken und adaptive Umgebungsanimationen
- Questassistenz, Erfolge, Entdeckungen und Schnellaktionen
- installierbare PWA mit versioniertem Offline-App-Shell

## Lokale Entwicklung

Voraussetzung: Node.js 24 oder neuer.

```bash
npm ci
npm run dev
```

Der Entwicklungsserver startet die React-/Phaser-Zielarchitektur. Die veröffentlichte Referenzfassung kann statisch aus `docs/` ausgeliefert werden.

## Qualitätsprüfung

```bash
npm run check
```

Der Befehl prüft:

- Syntax, Vollständigkeit und Ladefolge aller veröffentlichten Runtime-Module
- Build-Version, PWA-Manifest und Offline-Cache
- TypeScript-Typen der Zielarchitektur
- automatisierte Store-, Persistenz-, Welt-, Realismus- und Freitag-bis-Sonntag-Endgame-Szenarien
- den vollständigen Vite-Produktionsbuild

Die detaillierte Sprint-Historie liegt in [SPRINTS.md](docs/SPRINTS.md), [SPRINTS-21-28.md](docs/SPRINTS-21-28.md), [SPRINTS-29-33.md](docs/SPRINTS-29-33.md), [SPRINTS-34-43.md](docs/SPRINTS-34-43.md), [SPRINTS-44.md](docs/SPRINTS-44.md), [SPRINTS-45.md](docs/SPRINTS-45.md), [SPRINTS-46-55.md](docs/SPRINTS-46-55.md) und [SPRINT-56.md](docs/SPRINT-56.md).
