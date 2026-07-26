# Sprint 44 – Beer Pong und visuelle Richtung

Stand: 26. Juli 2026

## Ziel

Den geometrischen Beer-Pong-Blocker entfernen und der Next-Alpha eine konsistente, deutlich hochwertigere Bildsprache geben, ohne die bewährten Abläufe oder Save-Daten zu verändern.

## Umsetzung

- Die Zielbahn wird relativ zum jeweils aktiven Becher berechnet. Sie kreuzt dessen Mittelpunkt bei jedem Durchlauf – auch bei maximalem Alkohol-Schwanken.
- Ein automatisierter Test prüft die Erreichbarkeit aller sechs Becher.
- Beer Pong besitzt jetzt Wurfanimation, Zielaura, Lichtstimmung, räumlichere Becher und einen neu gezeichneten Tisch.
- Flip Cup, Flunkyball und das Camping-Duell wurden visuell auf dieselbe Festival-/Camping-Nacht-Richtung gebracht.
- Karte, Gebäude, Zelte, Camper, Bäume, Wege, See, Feuerstelle und Innenräume erhielten mehr Tiefe und eindeutiger erkennbare Materialien.
- React-HUD, Charaktererstellung, Supermarkt, Beziehungen, Dialoge und mobile Steuerung verwenden nun ein gemeinsames Farb-, Flächen- und Interaktionssystem.
- Der PWA-Cache wurde auf `s44` angehoben.

## Nicht verändert

- Save-Format bleibt v3.
- Quest-, Kampf- und Minispiel-Belohnungen bleiben unverändert.
- Die bisherige vollständige Legacy-Alpha am Root-Link bleibt unangetastet.
