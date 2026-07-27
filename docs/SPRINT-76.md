# Sprint 76 · Architekturprüfung, Interaktionen und mobile Konzentration

## Ziel

Der gesamte Next-Code wurde erneut auf Fehlerquellen, unnötige Parallelarchitektur, Touch-Probleme, Renderlast und mobile Informationsdichte geprüft. Bestehende Spielfunktionen bleiben erhalten; dauerhaft nicht benötigte Informationen werden aus der eigentlichen Spielansicht entfernt und in ein jederzeit erreichbares Menü verlagert.

## Gefundene Architekturprobleme

- Die alte React-Spieloberfläche und die nachträglich per Portal eingesetzten Controls existierten parallel.
- Ein globaler `MutationObserver` suchte fortlaufend nach Dialog- und Szenenelementen, um dort Schaltflächen einzusetzen.
- Der Spielzustand wurde während des Spielens von mehreren UI-Schichten separat abonniert.
- Die alte D-Pad- und Aktionssteuerung wurde weiterhin gerendert und lediglich per CSS ausgeblendet.
- Die mobile Aktion wurde über einen verzögerten Timer ausgelöst, wodurch Interaktionen unter ungünstigen Renderübergängen verloren gehen konnten.
- Minikarte, Statusblock, Zieltext, äußere Statusleisten, Inventar und Teamdaten konkurrierten gleichzeitig mit der eigentlichen Spielwelt um Bildschirmfläche.
- Erreichbare Personen und Gegenstände waren technisch interaktiv, aber visuell nicht eindeutig von Dekoration unterscheidbar.

## Architekturkorrekturen

- Eine zentrale `PlayExperience` ist die einzige laufende Spieloberfläche.
- Die Portal- und `MutationObserver`-Architektur wurde entfernt.
- Dialog, mobile Steuerung, Szenen-X und Menü werden direkt in der React-Struktur gerendert.
- Das Spielmenü pausiert alle aktiven Phaser-Szenen und gibt sämtliche Bewegungsrichtungen frei.
- Beim Schließen werden nur zuvor pausierte Szenen wieder fortgesetzt.
- Zentrale UI-Selektoren bestimmen Warnungen, Zustand, Inventar- und Beziehungsdaten.
- Der bestehende Speicherstand und das Save-Schema bleiben unverändert.
- Phaser bleibt weiterhin im lazy geladenen Spiel-Bundle.

## Mobile Darstellung

Dauerhaft sichtbar sind nur:

- Tag und Uhrzeit,
- das aktuelle Questziel,
- ausschließlich wirklich kritische Warnungen,
- das Menüsymbol,
- temporäre Interaktions- und Ereignishinweise.

Im pausierenden Menü liegen:

- alle acht Körperwerte,
- Würde, Chaos, Ruf und Lauf,
- Inventar und benutzbare Gegenstände,
- Geldreserve,
- aktives Team und Boni,
- Beziehungen,
- die letzten Chronikeinträge,
- Minikarten-Umschaltung,
- Intro-Wiederholung und abgesicherter Neustart.

Die Minikarte und das redundante Phaser-Statusfeld sind standardmäßig ausgeblendet. Das ursprüngliche Seitenverhältnis der Spielwelt bleibt auch im Hochformat erhalten.

## Interaktionskorrekturen

- Die rechte Aktionsfläche löst direkt nach einer abgeschlossenen Tap-Geste aus, nicht mehr über einen späteren Timer.
- Normales Fingerzittern wird mit einer größeren Toleranz akzeptiert.
- Ein Debounce verhindert versehentliche Doppelaktionen.
- Das nächste erreichbare Interaktionsziel erhält einen pulsierenden Ring.
- Die zugehörige Person oder der Gegenstand blinkt leicht.
- Die bestehende Textaufforderung bleibt erhalten.
- Dialogantworten behalten ihre kurze Schutzzeit gegen durchgereichte Touch-Ereignisse.

## Lidl- und Aldimania-Kanon

Lidl und Aldimania sind keine Racing- oder Motorsport-Teams. Beide stehen im Spiel für kostenbewusste Discounter-Mode mit polarisierender Außenwirkung:

- manche Figuren sehen limitierte Kollektionen als ironischen oder echten Hype,
- andere halten sie für billige Mode,
- skeptische Figuren fragen, warum Kleidung beim Discounter gekauft wird,
- mögliche Vorurteile zu Geld, Qualität oder einer Beschäftigung beim Discounter werden in Dialogen aufgegriffen.

## Qualitätssicherung

Die Prüfung umfasst:

- TypeScript unter strikter Konfiguration,
- vollständige Unit- und Systemtests,
- Touch-Tap, Swipe-Abgrenzung und Debounce,
- UI-Warnungspriorisierung,
- Discounter-Mode-Kanon,
- Store- und Save-Kompatibilität,
- Welt-, Quest-, Status-, Sozial-, Team- und Kampfsysteme,
- Legacy-Validierung,
- Produktionsbuild,
- Next-Build,
- PWA- und Release-Validator.
