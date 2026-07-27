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

`src/game/aerialCampgroundPlan.ts` ist die kanonische geografische und funktionale Quelle für den Campingplatz. Der Plan definiert gemeinsam:

- achsenparallele Campingplatz-, Ankunfts-, Strand-, Buchten- und Wasserflächen,
- die südliche Einfahrt, Parkreihe, Schranke und den östlich danebenliegenden Rezeptionshof,
- eine durchgehende Nord-Süd-Hauptachse,
- drei Camping-Querwege sowie Anschlüsse zu Festwiese, Strand, Servicehof und Bucht,
- ausschließlich horizontale oder vertikale Asphalt-, Kies- und Sandwege,
- den Zaun zwischen Campingplatz und Strand einschließlich eindeutigem Tor,
- zwölf funktionale Nutzungsflächen,
- Stellplätze und den Taucherplatz,
- Objekt-, NPC-, Eingangs- und Landmarkenpositionen,
- Questanker der Ankunft,
- die erwartete Funktionsfläche jedes statischen Objekts und jedes NPCs.

`src/game/campgroundBlueprint.ts` wendet diesen Plan auf die vorhandenen Weltobjekte an. Der Validator prüft:

- den verbundenen und rechtwinkligen Straßengraphen,
- das Planraster,
- achsenparallele Gelände- und Wasserpolygone,
- geografische Beziehungen zwischen Einfahrt, Parkplatz, Schranke, Rezeption, Taucherplatz, Strand und Servicehof,
- Funktionsflächenzuordnungen,
- freie Wege und Objektabstände,
- Zeltreihe und Zeltbesitzer,
- Veranstaltungsabfolge,
- Wasseranschlüsse der Stege,
- erreichbare Eingänge und Questanker.

`src/game/campgroundBlueprintLayer.ts` rendert diese Planung als zusammenhängende Funktionsparzellen und 36 rechtwinklige Straßen- und Fußwegsegmente. Laufzeitcode darf keine zweite unabhängige Straßen-, Strand-, Zaun- oder Parzellengeometrie zeichnen. Der historische Renderer wird ausschließlich für vorhandene Objektgrafiken verwendet; seine Regionsüberschriften werden aus dem aktiven Szenenaufbau entfernt.

`src/game/campgroundBlueprintBootstrap.ts` ist nur noch ein Kompatibilitätseinstieg und darf keine Koordinaten nachträglich verändern. `src/game/worldRealism.ts` darf ebenfalls keine Koordinaten verändern und enthält nur Kollisions-, Wasser-, Abstands- und Zugangsregeln.

Die älteren Dateien `campgroundPlan.ts`, `campgroundAccessPlan.ts` und `campgroundPlanLayer.ts` bleiben vorerst als Migrationshistorie und Testreferenz erhalten, gehören aber nicht mehr zum aktiven Weltaufbau.

Gundula und Uli sind im Rezeptionshof verankert. Frühere Mittagspausen- oder Patrouillenpositionen dürfen ihre Anmeldefunktion nicht ersetzen.

## Verbindliche Interaktionsarchitektur

`src/game/scenes/InteractionAuditWorldScene.ts` ist die aktive Weltklasse für Interaktionsauswahl. Sie führt alle erreichbaren Personen, Questaktionen, Türen, Landmarken und Aktivitäten in einer sortierten Kandidatenliste zusammen. Eine Interaktion darf eine andere erreichbare Interaktion nicht allein deshalb dauerhaft verdrängen, weil sie wenige Pixel näher liegt.

`src/game/interactionSelection.ts` definiert Priorisierung, Identitätsgruppen und zyklisches Wechseln. Story- und Standardzugänge derselben Person werden als eine logische Interaktion behandelt; unterschiedliche Personen, Objekte und Aktivitäten bleiben getrennt auswählbar.

`src/game/worldActivityCatalog.ts` ist die einzige Quelle für frei zugängliche Weltaktivitäten. Jede Aktivität benötigt:

- eine eindeutige ID,
- einen registrierten Szenenschlüssel,
- eine Region und erreichbare Weltposition,
- einen sichtbaren Marker und verständlichen Prompt,
- einen Auswahlradius,
- gegebenenfalls eine nachvollziehbare Fortschrittsbedingung.

Aktuell umfasst der Katalog Ronny-Duell, Flip Cup, Beer Pong, Flunkyball, Masls „Komm ans Loch“ und das Hecken-Minispiel. Zusätzliche Minispiele dürfen nicht ausschließlich als registrierte Phaser-Szene existieren; sie benötigen einen geprüften Weltzugang.

`src/components/MobileGameControls.tsx` zeigt bei mehreren Kandidaten eine direkte Auswahlleiste. Desktop verwendet Q beziehungsweise Tab zum Wechseln und Zifferntasten zur direkten Auswahl. Die Hauptaktion führt ausschließlich die sichtbar markierte Interaktion aus.

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

## Verbindliche UX- und UI-Architektur

`src/game/uxPresentation.ts` ist die gemeinsame Präsentationslogik für verständliche Risikostufen, kurze Aktionsbeschriftungen und kompakte Zieltexte. React-Komponenten dürfen keine abweichenden Grenzwerte oder konkurrierenden Begriffe für dieselbe Spielsituation einführen.

`src/components/PlayExperience.tsx` ist die verbindliche Spielhülle. Das HUD priorisiert in dieser Reihenfolge:

1. aktuelle Aufgabe,
2. Zeit und Phase,
3. echte Körperwarnungen,
4. Menüzugang.

Neue HUD-Elemente dürfen die Spielfläche nicht dauerhaft überdecken und das aktuelle Ziel auf kleinen Displays nicht vor weniger wichtigen Informationen verdrängen.

`src/components/MobileGameControls.tsx` ist die einzige React-basierte mobile Weltsteuerung. Hauptaktionen benötigen eine sichtbare Schaltfläche, eine konkrete Beschriftung, Safe-Area-Abstände und eine Mindestgröße von 44 Pixeln. Unsichtbare großflächige Aktionszonen sind nicht zulässig.

`src/components/EncounterDialog.tsx` ist die verbindliche React-Darstellung für dialogbasierte Entscheidungen. Optionen verwenden gemeinsame Risikostufen, Prozentwerte, Balken, Voraussetzungen und Ergebnisdarstellung. Zusätzliche Dialogkomponenten müssen dasselbe Muster übernehmen.

`src/components/GameMenu.tsx` ist die zentrale Informations- und Verwaltungsoberfläche. Desktop verwendet eine Seitennavigation; kleine Displays verwenden eine horizontal scrollbare Tab-Leiste. Neue Bereiche benötigen Tastatur-, Touch- und Fokusunterstützung.

`src/uxRefresh.css` enthält die Sprint-85-Oberflächenregeln. `src/interactionAudit.css` enthält die ergänzende Mehrfachauswahl. Neue Animationen benötigen eine `prefers-reduced-motion`-Alternative. Fokuszustände dürfen nicht ausschließlich über Farbe erkennbar sein.

## Verbindliche mobile Runtime

Der Phaser-Build wird weiterhin als lazy Chunk geladen. Fehler beim Laden dieses Chunks dürfen nicht zu einer leeren Spielfläche führen.

- Die React-Hülle zeigt einen Lade- beziehungsweise Reparaturzustand.
- Veraltete Next-Caches dürfen einmal kontrolliert repariert werden, ohne den lokalen Spielstand zu löschen.
- JavaScript- und CSS-Bundles verwenden im Service Worker network-first.
- Die Service-Worker-Registrierung prüft Updates mit `updateViaCache: 'none'`.
- Geräte- und Viewportänderungen müssen ohne zwingende `ResizeObserver`-Unterstützung funktionieren.
- Alte Weltkoordinaten werden beim Laden auf eine freigeschaltete Position der aktuellen Karte migriert.

## Verbindliche Entwicklungsregeln

1. Neue Spielfunktionen entstehen ausschließlich in `src/`.
2. Änderungen in `docs/` sind auf kritische Fehler, Browserkompatibilität, Offline-Funktion und Release-Sicherheit begrenzt.
3. Jeder migrierte Abschnitt umfasst Spielzustand, UI, mobile Eingabe, Persistenz und Tests.
4. Ein Abschnitt gilt nicht als migriert, wenn nur eine vereinfachte Demo vorhanden ist.
5. Das Save-Format wird versioniert; vor dem Release muss ein Importpfad für bestehende v13-Spielstände vorhanden sein.
6. Der neue Build wird erst veröffentlicht, wenn `npm run check` erfolgreich ist und der manuelle Release-Durchlauf bestanden wurde.
7. Neue Weltbereiche müssen an den rechtwinkligen Straßengraphen angeschlossen werden.
8. Neue Wege dürfen nicht diagonal verlaufen.
9. Neue feste Objekte benötigen eine Funktionsflächenzuordnung und dürfen keine Straße, keinen Eingang, kein Strandtor und keinen Questanker blockieren.
10. Relevante Objektgruppen benötigen überprüfbare Nachbarschaftsregeln statt ausschließlich freier Koordinaten.
11. Positionen dürfen nicht parallel in Renderer, Szene, Realismusmodul und Questcode gepflegt werden.
12. Neue Frustkämpfe verwenden die gemeinsame Kampfengine und die gemeinsame Basisszene.
13. Neue Attacken werden ausschließlich in `combatMoves.ts` definiert und benötigen Lernweg, Kampfwerte, Statuslogik, Tests und eine Prüfung ihrer sozialen Anschlussfähigkeit.
14. Kampf- und Flirtansichten müssen dasselbe ausgerüstete Vierer-Loadout lesen.
15. Eine mobile Ladefehlermeldung darf niemals den Spielstand löschen.
16. Neue HUD-Informationen dürfen das aktuelle Ziel nicht verdrängen.
17. Mobile Hauptaktionen benötigen eine sichtbare, kontextbeschriftete Schaltfläche.
18. Erfolgswahrscheinlichkeiten verwenden ausschließlich die gemeinsame UX-Risikologik.
19. Neue Menü- oder Dialogoberflächen benötigen Touch-, Tastatur- und Fokusunterstützung.
20. Touchziele der Hauptbedienung dürfen nicht kleiner als 44 Pixel sein.
21. Neue Animationen benötigen eine Reduced-Motion-Alternative.
22. Mehrere erreichbare Interaktionen müssen einzeln auswählbar bleiben.
23. Neue frei spielbare Aktivitäten werden ausschließlich im Weltaktivitätskatalog registriert.
24. Eine registrierte Minispielszene benötigt einen sichtbaren, geprüften Weltzugang.
25. Mobile und Desktop-Auswahl müssen denselben markierten Kandidaten ausführen.

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
