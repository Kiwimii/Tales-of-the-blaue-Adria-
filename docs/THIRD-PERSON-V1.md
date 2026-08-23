# 3D-Third-Person-Build V1

Der neue Build unter `/third-person/` ist eine eigenständige zweite Spielfassung. Er ersetzt weder `/lpc-main/` noch `/next/` und verwendet eigene Speicher-IDs.

## Enthalten

- prozedurale 3D-Darstellung des kanonischen Campingplatzplans
- frei drehbare Third-Person-Kamera mit Kollisionskorrektur
- WASD-/Pfeiltastensteuerung, Sprint, Mauszug und Zoom
- sichtbare mobile Joystick-, Sprint- und Aktionselemente
- Kollisionen für Gebäude, Zelte, Wohnwagen, Bäume, Zäune, Wasser und die anfangs geschlossene Schranke
- komplette zusammenhängende Ankunftsquest bis zum ersten Bier
- anschließende Suche nach fünf Freunden und Teamtreffen am Lagerfeuer
- alle bestehenden NPC-Positionen und Gespräche als 3D-Figuren
- frei zugängliche Aktivitäten als wiederholbare Timingrunden
- Bedürfnisse, Inventar, Spielzeit, Minikarte, Questentfernung und automatische Speicherung
- getrennte, defensiv validierte 3D-Spielstände

## Bewusste V1-Grenze

Die vollständigen spezialisierten Kämpfe, alle fünf individuellen Minispielregeln, der Freitags-/Samstagsbogen, Secret Millionär und sämtliche Enden bleiben vorerst im umfangreicheren 2D-Hauptbuild. Die 3D-Fassung ist ein spielbarer vertikaler Slice und keine vorgetäuschte Inhaltsparität.

## Architektur

Die 3D-Welt liest `aerialCampgroundPlan.ts`, den zentralen Figureninhalt, den Sprint-89-Zeltplan und den bestehenden `GameStore`. Die dünne 3D-Interaktionsliste verweist auf dieselben kanonischen Anker, damit der Build keine 2D-Grafik-URLs oder Phaser-Runtime laden muss. Neue 3D-spezifische Fortschrittsdaten liegen versioniert unter `tales-blaue-adria-third-person-progress-v1`.
