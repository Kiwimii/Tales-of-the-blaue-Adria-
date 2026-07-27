# Architekturentscheidung

**Status:** angenommen  
**Datum:** 27. Juli 2026

## Entscheidung

React 19, Phaser 4, TypeScript und Vite bilden die einzige Zielarchitektur. Die bisher veröffentlichte Canvas-Fassung in `docs/` bleibt vorübergehend die spielbare Referenz, wird aber nicht mehr um neue Spielinhalte erweitert.

Die GitHub-Pages-Veröffentlichung wechselt erst von `docs/` auf den neuen Build, wenn die in `MIGRATION-CHECKLIST.md` definierten Paritätskriterien erfüllt sind.

## Warum diese Grenze notwendig ist

Die Canvas-Fassung enthält den größten Teil des Spiels, ist aber über viele nacheinander geladene globale Skripte gewachsen. Dadurch werden Änderungen, Save-Migrationen und vollständige Tests zunehmend riskant.

Die React-/Phaser-Fassung besitzt eine klarere Trennung:

- React verwaltet Menüs, HUD, Einstellungen und barrierearme Oberflächen.
- Phaser verwaltet Welt, Bewegung, Kämpfe und Minispiele.
- `GameStore` ist die einzige Quelle für den persistenten Spielzustand.
- TypeScript und automatisierte Tests sichern Schnittstellen und Kernregeln ab.

Ein sofortiger Austausch wäre trotzdem falsch: Die neue Fassung hat noch keine inhaltliche Parität. Deshalb bleibt die Alpha spielbar, während die Migration kontrolliert in vertikalen Abschnitten erfolgt.

## Verbindliche Weltarchitektur

`src/game/campgroundBlueprint.ts` ist die kanonische Quelle für den Campingplatz. Sie definiert gemeinsam:

- die sieben Funktionszonen,
- das Planraster,
- alle Knoten und Straßenverbindungen,
- Oberflächen und Wegbreiten,
- Objekt-, NPC-, Eingangs- und Landmarkenpositionen,
- Questanker der Ankunft.

`src/game/campgroundBlueprintLayer.ts` rendert diese Planung. Laufzeitcode darf keine zweite unabhängige Straßen- oder Parzellengeometrie mehr zeichnen. Der historische Renderer wird nur noch für vorhandene Objektgrafiken verwendet.

`src/game/campgroundBlueprintBootstrap.ts` enthält ausschließlich abschließende Normalisierungen, die vor der Objektzeichnung angewendet und durch Blueprint-Tests abgesichert werden. Neue Platzänderungen sollen grundsätzlich im Blueprint entstehen; weitere nachträgliche Override-Schichten sind nicht zulässig.

Die älteren Dateien `campgroundPlan.ts`, `campgroundAccessPlan.ts` und `campgroundPlanLayer.ts` bleiben vorerst als Migrationshistorie und Testreferenz erhalten, gehören aber nicht mehr zum aktiven Weltaufbau.

## Verbindliche Kampfarchitektur

`src/game/frustrationCombat.ts` ist die kanonische Berechnungsengine für rundenbasierte Auseinandersetzungen. Sie verwaltet:

- Frustpunkte und persönliche Frustmaxima,
- Trefferchancen,
- gegnerspezifische Effektivität,
- temporäre Zustände,
- eigene Entlastung und Schutz,
- Sieg, Niederlage und Rundenprotokolle.

`src/game/combatMoves.ts` ist die einzige Quelle für Attacken, Lernwege, Typen, Werte, Flirtvarianten und Gegnerprofile.

`src/game/scenes/FrustrationBattleSceneBase.ts` ist die gemeinsame Phaser-Darstellung für Frustkämpfe. Konkrete Kampfszenen dürfen nur noch Gegner, Texte und Folgen von Sieg, Niederlage oder Rückzug definieren. Eigene parallele Treffer-, Balken- oder Statusberechnungen sind nicht zulässig.

Attackenfortschritt wird kompatibel über vorhandene Save-Flags gespeichert. Das Spielmenü liest und verändert dasselbe Loadout, das die Kampfszene und die attackenbasierten Flirtoptionen verwenden.

Die älteren Berechnungen in `advancedCombat.ts` und `entryDebate.ts` bleiben vorerst als Migrationsreferenz und für bestehende Vergleichstests erhalten, gehören aber nicht mehr zum aktiven Gundula-/Uli- oder Ronny-Kampf.

## Verbindliche Entwicklungsregeln

1. Neue Spielfunktionen entstehen ausschließlich in `src/`.
2. Änderungen in `docs/` sind auf kritische Fehler, Browserkompatibilität, Offline-Funktion und Release-Sicherheit begrenzt.
3. Jeder migrierte Abschnitt umfasst Spielzustand, UI, mobile Eingabe, Persistenz und Tests.
4. Ein Abschnitt gilt nicht als migriert, wenn nur eine vereinfachte Demo vorhanden ist.
5. Das Save-Format wird versioniert; vor dem Release muss ein Importpfad für bestehende v13-Spielstände vorhanden sein.
6. Der neue Build wird erst veröffentlicht, wenn `npm run check` erfolgreich ist und der manuelle Release-Durchlauf bestanden wurde.
7. Neue Weltbereiche müssen an den Blueprint-Straßengraphen angeschlossen werden.
8. Neue feste Objekte dürfen keine Blueprint-Straße, keinen Eingang und keinen Questanker blockieren.
9. Positionen dürfen nicht parallel in Renderer, Szene und Questcode gepflegt werden.
10. Neue Frustkämpfe verwenden die gemeinsame Kampfengine und die gemeinsame Basisszene.
11. Neue Attacken werden ausschließlich in `combatMoves.ts` definiert und benötigen Lernweg, Kampfwerte, Statuslogik, Tests und eine Prüfung ihrer sozialen Anschlussfähigkeit.
12. Kampf- und Flirtansichten müssen dasselbe ausgerüstete Vierer-Loadout lesen.

## Reihenfolge der Migration

1. Charaktererstellung, Einkauf und Einlass
2. vollständige Weltkarte, Kollisionen und NPC-Tagespläne
3. Freunde, Dialoge, Beziehungen und Quests
4. Inventar, Bedürfnisse, Kontrollen und Schlaf
5. Kämpfe und Teamverwaltung
6. alle fünf Minispiele
7. Freitag-bis-Sonntag-Zeitplan, Aufräumen und alle Enden
8. Import bestehender Spielstände, PWA-Umschaltung und Release

## Abnahmekriterien für den Architekturwechsel

- alle Zeilen der Migrationscheckliste sind abgeschlossen
- keine ungefangenen Fehler im kompletten Freitag-bis-Sonntag-Durchlauf
- alle Enden sind automatisiert erreichbar und bewertet
- Desktop-, Android- und iPhone-Touchsteuerung sind manuell geprüft
- Speichern, Laden, Export, Import und Migration eines v13-Spielstands funktionieren
- Erststart und Wiederholungsstart funktionieren online und offline
- keine kritischen oder hohen Fehler in der Release-Checkliste

Sound, Musik und zusätzliches Balancing sind wichtige Release-Themen, aber keine Voraussetzung für die technische Umschaltung. Sie werden nach Funktionsparität bearbeitet, damit sie nicht doppelt implementiert werden.