# Sprint 77 – Schwarzes Brett und mobile Kontextinteraktion

## Ausgangsfehler

Nach Sprint 76 lag die mobile React-Touchsteuerung vollständig über dem Phaser-Canvas. Das war für Wischbewegung und die rechte Aktionshälfte beabsichtigt, blockierte aber direkte Phaser-Taps auf das Schwarze Brett. Zusätzlich öffnete das Brett vor dem Fund der Reservierungsunterlagen keine eigene Ansicht, sondern zeigte nur eine kurze Weltmeldung. Für Spieler wirkte beides wie eine nicht funktionierende Interaktion.

## Umsetzung

- Das Schwarze Brett startet nun in jedem Questzustand die Reservierungsansicht.
- Ohne Unterlagen wird das Brett sichtbar geöffnet und erklärt, dass zuerst der Kofferraum durchsucht werden muss.
- Im verfügbaren Zustand bleibt das vollständige Reservierungsrätsel erhalten.
- Nach der Lösung wird die richtige Reservierung weiterhin sichtbar markiert.
- Nach Abschluss der Ankunft bleibt das Brett als Archiv einsehbar.
- Die normale Aktionsreichweite wurde auf 148 Welteinheiten erhöht.
- Der direkte Tap-Bereich wurde vergrößert und verwendet `pointerup` statt `pointerdown`.
- Phaser veröffentlicht die aktuell erreichbare Interaktion an die React-Touchsteuerung.
- Die Touchsteuerung fragt diesen Zustand bei jedem Einblenden erneut ab.
- Ein kurzer Tap in der linken Bewegungszone löst eine markierte Interaktion aus, sofern keine Wischbewegung stattgefunden hat.
- Die rechte Bildschirmhälfte bleibt der primäre Aktionsweg.
- Doppelte oder durch Wischen verursachte Aktionen bleiben durch Bewegungsprüfung und Debounce gesperrt.

## Kompatibilität

Das Speicherformat bleibt unverändert bei Version 3. Bestehende Spielstände werden nicht zurückgesetzt. Alle bisherigen Quest-, Dialog-, Bewegungs- und Menüfunktionen bleiben erhalten.

## Prüfung

Der vollständige Qualitätslauf umfasst TypeScript, automatisierte Tests, Legacy-Validierung, Produktionsbuild, Next-Build und Release-Validierung. Zusätzliche Tests prüfen Kontext-Taps, Brettreichweiten und alle vier Zustände des Schwarzen Bretts.
