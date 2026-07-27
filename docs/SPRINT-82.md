# Sprint 82 – Frustkampfsystem, lernbare Attacken und rotationsfeste Darstellung

## Ausgangslage

Der Einlasskampf gegen Gundula und Uli verwendete eine eigene, ältere Tutorialberechnung. Der Ronny-Kampf verwendete parallel eine andere Statuskampf-Engine. Beide Szenen besaßen eigene Buttons, Zustände, Schadenswerte und Abschlusslogik. Dadurch konnten Fehler nur in einem der beiden Kämpfe auftreten und Weiterentwicklungen mussten doppelt umgesetzt werden.

Zusätzlich blieb das Kampfbild nach dem Intro auf manchen Touchgeräten gesperrt. Beim Drehen des Smartphones konnten Spielrahmen und Phaser-Canvas außerdem unterschiedliche Höhen- und Breitenberechnungen verwenden, wodurch das Bild gestreckt erschien.

## Gemeinsame Kampfarchitektur

`src/game/frustrationCombat.ts` ist die gemeinsame Berechnungsengine. `src/game/scenes/FrustrationBattleSceneBase.ts` ist die gemeinsame Phaser-Szene.

Der Einlasskampf und der Ronny-Kampf definieren nur noch:

- Gegnerprofil,
- Überschrift und Darstellung,
- Folgen von Sieg, Niederlage und Rückzug.

Trefferberechnung, Frustpunkte, Zustände, Attackenbuttons, Balken, Statusanzeigen, Effektivitäten und Rundenablauf stammen aus derselben Implementierung.

Das Kampfintro ist antippbar, über die Leertaste überspringbar und besitzt einen zeitlichen Fail-safe. Die Kampfschaltflächen reagieren auf `pointerup`. Selbst wenn eine Animation oder ein Eingabegerät das reguläre Abschlussereignis nicht liefert, wird die Arena spätestens nach wenigen Sekunden freigegeben.

## Frustpunkte

Klassische Lebenspunkte wurden durch Frustpunkte ersetzt.

- Beide Seiten starten bei 0 Frustpunkten.
- Erfolgreiche Attacken erhöhen den Frust des Gegners.
- Gegenzüge erhöhen den eigenen Frust.
- Schutz- und Entlastungsattacken reduzieren Gegenzüge oder bauen eigenen Frust ab.
- Wer sein persönliches Frustmaximum erreicht, verliert die Auseinandersetzung.

Die Balken wachsen daher von leer zu voll. Die Oberfläche zeigt immer den aktuellen Wert und das persönliche Maximum.

## Gegnermerkmale und Effektivität

Jeder Gegner besitzt Eigenschaften, Move-Multiplikatoren und Typ-Multiplikatoren.

### Gundula und Uli

Eigenschaften:

- bürokratisch,
- rechthaberisch,
- ritualabhängig.

Besonders effektiv:

- Recht geben, obwohl man es besser weiß: Faktor 1,55.
- Klassisches High Five: Faktor 1,45.

Wenig effektiv:

- Logisch argumentieren: Faktor 0,55.
- Aldi-T-Shirt präsentieren: Faktor 0,45.

Die Logik dahinter: Sachliche Gegenargumente verlängern ihre Verwaltungsroutine. Discounter-Mode ist bereits Teil des Konflikts und schockiert beide kaum. Zustimmung und ein unangemessen positives Ritual entziehen ihnen dagegen die erwartete Konfrontation.

### Rivalen-Ronny

Eigenschaften:

- diskussionshungrig,
- eitel,
- unterbrechungsanfällig.

Gegen Ronny funktionieren trockene Konter und logische Argumente gut. Einfaches Zustimmen oder ein High Five liefern ihm dagegen kaum Frust, weil er die Diskussion dann selbst fortsetzt.

## Zehn Attacken und Lernwege

| Attacke | Funktion | Lernen |
| --- | --- | --- |
| Klassisches High Five | zuverlässiger Sozialangriff, Zustand Überrumpelt | von Beginn an |
| Aldi-T-Shirt präsentieren | hoher Basisfrust, Fremdscham | ersten Einlasskampf gewinnen |
| Recht geben, obwohl du es besser weißt | stark gegen rechthaberische Gegner, Leerlauf | nach gewonnenem Einlasskampf persönlich mit Gundula sprechen |
| Logisch argumentieren | präziser Logikangriff, Unterbrochen | persönliches Gespräch mit Ronny ab Beziehung 8 |
| Trockener Konter | kurzer starker Wortangriff, Unterbrochen | persönliches Gespräch mit André ab Beziehung 8 |
| Campingstuhl-Blockade | geringer Angriff, stark reduzierte Gegenzüge | mit René etwas planen ab Beziehung 8 |
| Bier anbieten | baut eigenen Frust ab und verwirrt | nach dem ersten Bier mit Lars über das Wochenende reden |
| Synchroner Gruppen-Zuruf | skaliert mit aktiven Begleitern, Fokussiert | erstmals Flip Cup gewinnen |
| Becher-Blickkontakt | präziser Charmeangriff, Fixiert | erstmals Beer Pong gewinnen |
| Komplett übertreiben | sehr hoher, aber unzuverlässiger Chaosangriff | erstmals Flunkyball gewinnen |

Bereits erfüllte Bedingungen werden bei vorhandenen Spielständen beim ersten Laden ausgewertet. Erarbeitete Attacken gehen dadurch nicht verloren.

## Attacken-Loadout

Im Spielmenü gibt es den neuen Bereich **Attacken**.

Dort kann der Spieler:

- alle gelernten Attacken ansehen,
- Genauigkeit, Basisfrust, Typ und Beschreibung prüfen,
- den Lernweg noch gesperrter Attacken sehen,
- bis zu vier Attacken ausrüsten,
- Attacken wieder ablegen,
- die zugehörige Flirtoption lesen.

Mindestens eine Attacke bleibt immer ausgerüstet. Zu Beginn ist ausschließlich das Klassische High Five verfügbar.

Der Fortschritt wird über bestehende Save-Flags gespeichert. Das Speicherformat bleibt Version 3 und benötigt keine riskante Migration.

## Verbindung mit Gesprächen und Flirts

Bestimmte Gespräche mit Freunden und Platzfiguren vermitteln Attacken. Das gewählte Thema und die bestehende Beziehung entscheiden darüber, ob der Lernmoment ausgelöst wird.

Bei Susi, Jule und Kira zeigt die Flirtansicht zusätzlich zu einem direkten Flirt alle aktuell ausgerüsteten Attacken als eigene soziale Ansätze. Jede Attacke besitzt:

- eine konkrete Flirtformulierung,
- einen kleinen positiven, neutralen oder negativen Chancenmodifikator.

Becher-Blickkontakt ist beispielsweise eine starke Flirttechnik. Das Aldi-T-Shirt ist als Kampfattacke nützlich, kann beim Flirten aber leicht schaden.

Ein Flirtversuch pro Person und Spieltag bleibt bestehen.

## Smartphone-Drehung

Der Spielrahmen und das Canvas verwenden verbindlich das Seitenverhältnis 3:2.

Die Darstellung reagiert auf:

- `ResizeObserver` des Spielcontainers,
- `orientationchange`,
- normales Fenster-Resize,
- Änderungen des mobilen `VisualViewport`.

Nach jeder Änderung wird `game.scale.refresh()` aufgerufen. Canvas und Container verwenden zusätzlich `object-fit: contain`. Dadurch entstehen beim Wechsel zwischen Hoch- und Querformat schwarze beziehungsweise freie Randflächen statt einer horizontalen oder vertikalen Verzerrung.

## Qualitätssicherung

Die neuen Tests prüfen:

- zehn vollständige Attackendefinitionen,
- Lernquellen und Flirtoptionen,
- Start ausschließlich mit High Five,
- kompatible Save-Flags für gelernte und ausgerüstete Attacken,
- Gesprächsfreischaltungen,
- Gegner-Effektivität,
- Sieg durch vollständige Frustration,
- Statuswirkungen und Gegenzugreduktion.

Bestehende Quests, Gespräche, Minispiele, Spielstände und der Campingplatz-Blueprint bleiben erhalten.