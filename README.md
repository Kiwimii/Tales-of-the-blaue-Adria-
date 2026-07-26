# Tales of the Blaue Adria

Ein schwarzhumoriges, storygetriebenes Camping-RPG für Smartphone und Desktop. Das Spiel verbindet eine frei begehbare Top-down-Welt mit Dialogproben, Bedürfnissen, festen Tagesabläufen, Quests, einer rekrutierbaren Freundesgruppe, rundenbasierten Teamkämpfen und eingebetteten Minispielen.

## Jetzt spielen

**Veröffentlichte Alpha:** [Build v29 starten](https://kiwimii.github.io/Tales-of-the-blaue-Adria-/?v=29)

Inhaltlicher Stand: **Sprint 28 · v1.8.0 · Build v29**

Die Alpha ist von Freitagmorgen bis zum Sonntagsfinale spielbar. Spielstände, Export/Import, mobile Steuerung und Offline-Nutzung werden unterstützt.

Die Zielarchitektur enthält zusätzlich die **Gameplay-Sprints 29–33**. Sie vertiefen Einkauf, Entscheidungen, Beziehungen, Gruppenrollen, Bedürfnisse, Quests, Kampf und Flip Cup, sind aber wegen noch fehlender Gesamtparität bewusst noch nicht als GitHub-Pages-Fassung veröffentlicht.

## Entwicklungsstatus

| Bereich | Status | Verbindliche Rolle |
| --- | --- | --- |
| `docs/` | umfangreiche, veröffentlichte Alpha | Referenz für Funktionsumfang und GitHub-Pages-Release |
| `src/` | baubare React-/Phaser-/TypeScript-Migration | einzige Zielarchitektur für die weitere Entwicklung |

`docs/` ist ab jetzt **feature-frozen**: Dort werden nur kritische Fehler, Kompatibilität, PWA und Release-Stabilität gepflegt. Neue Spielinhalte werden erst wieder umgesetzt, wenn sie in der Zielarchitektur entstehen. Der Wechsel der veröffentlichten Fassung erfolgt erst nach nachgewiesener Funktionsparität.

Die vollständige Entscheidung und ihre Abnahmekriterien stehen in [ARCHITECTURE.md](docs/ARCHITECTURE.md). Den ehrlichen Migrationsstand zeigt [MIGRATION-CHECKLIST.md](docs/MIGRATION-CHECKLIST.md).

## Aktueller Spielumfang

- Charaktererstellung und Supermarkt-Prolog mit 25-Euro-Budget
- frei begehbarer, an einer Luftaufnahme orientierter Campingplatz
- neun Freunde mit Tagesabläufen, Dialogen, Werten und Fähigkeiten
- Zeit, Bedürfnisse, Alkohol, Würde, Chaos, Beziehungen und Inventar
- Quests, Kontrollen durch Gundula und Uli und mehrere Enden
- rundenbasierte Teamkämpfe
- Flip Cup, Beer Pong, Flunkyball, Trinkduell und Sonntags-Aufräumspiel
- lokale Spielstände mit Export, Import und Sicherheitsbackup
- mobile Steuerung, Safe Areas und Querformat-Unterstützung
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
- automatisierte Store-, Persistenz- und Freitag-bis-Sonntag-Endgame-Szenarien
- den vollständigen Vite-Produktionsbuild

Die detaillierte Sprint-Historie liegt in [SPRINTS.md](docs/SPRINTS.md), [SPRINTS-21-28.md](docs/SPRINTS-21-28.md) und [SPRINTS-29-33.md](docs/SPRINTS-29-33.md).
