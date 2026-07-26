# Sprints 58–72 · Zustände, Beziehungen und Metagame

## Ziel

Die bisher getrennten Kampf-, Bedürfnis-, Freundes- und Dialogmechaniken werden zu einem gemeinsamen Metagame verbunden. Zustände entstehen in der offenen Welt und wirken danach konsistent in Kämpfen, Gesprächen, Flirts, Patrouillenkontrollen und Minispielen.

## Sprint 58 · Systemische Körperzustände

- Schwellenwerte für angetrunken, betrunken, voll, breit, sehr breit, Kater, Erschöpfung und Dehydrierung
- einheitliche Modifikatoren für Kraft, Präzision, Verteidigung, Reaktionszeit, Charme, Flirt und Energieverbrauch
- zentraler Statusservice statt szenenspezifischer Sonderregeln

## Sprint 59 · Visuelle Zustandsinszenierung

- Schwanken bei hohem Alkoholwert
- verzögertes Bewegungs- und Geisterbild bei Breitheit
- Kater-Vignette und sichtbare Statusanzeige in der Welt
- Kampfporträts übernehmen den körperlichen Zustand

## Sprint 60 · Kampfintro

- Pokémon-artige, kurze VS-Inszenierung vor jedem Kampf
- hereinfahrende Kontrahenten, Kameraimpuls und wechselnde markige Sprüche
- Gegnerprofile sind datengetrieben und für spätere Kämpfe erweiterbar

## Sprint 61 · Statuskampf

- Alkohol erhöht Schaden und senkt Trefferquote
- Breitheit erzeugt Reaktionsverzögerung
- Kater und Erschöpfung reduzieren Verteidigung und Ausdauer
- temporäre Kampfzustände wie fokussiert, unterbrochen, frustriert und verzögert

## Sprint 62 · Freundeskanon

- Profile aller neun Freunde mit Biografie, Themen, Stärken, Schwächen, Alkohol- und Cannabisverhalten
- Lars und Danny als gegensätzliche Schildkröten-Zwillinge
- Rollen und Aussagen entsprechen dem festgelegten Gruppenkanon

## Sprint 63 · Aktives Dreierteam

- Spielstart und erster Kampf allein
- Freunde werden erst nach Gesprächen und Beziehungsaufbau aktivierbar
- maximal drei aktive Partner
- Partner wirken in Kämpfen und vorhandenen Minispielen

## Sprint 64 · Teamsynergien

- Schildkröten-Zwillinge
- Technikrat
- Hotbox-Komitee
- Papa-Schicht
- Synergien erzeugen nachvollziehbare Stärken und einzelne Nachteile

## Sprint 65 · Dynamische Gespräche

- Gesprächseröffnung reagiert auf Alkohol, Breitheit, Kater und Beziehung
- Freundesreaktionen berücksichtigen individuelle Toleranz und Vorlieben
- Gesprächsergebnisse verändern Beziehungen und Zeit

## Sprint 66 · Anspruchsvolles Flirten

- drei eigenständige flirtbare Campinggäste mit unterschiedlichen Präferenzen
- maximale Erfolgswahrscheinlichkeit von 20 Prozent
- positive und negative Reaktionen
- nur ein ernsthafter Versuch pro Person und Spieltag
- Zustand, Ruf, Beziehung und Charaktermerkmal fließen ein

## Sprint 67 · Geschenke

- Wasser, Kaffee, Chips, Bier, Batida und Würste können gezielt verschenkt werden
- jede Person bewertet Geschenke unterschiedlich
- unpassende Geschenke können Beziehungen verschlechtern

## Sprint 68 · Platzordnung und Fahrzeug

- Auto steht nur zum Be- und Entladen auf dem Taucherplatz
- nach dem ersten Bier fährt es automatisch zurück auf den Parkplatz vor der Schranke
- Zelte der Freundesgruppe stehen als kompakte Reihe zusammen
- eigenes Zelt schließt direkt an die Gruppe an

## Sprint 69 · Die Hecke

- Hecke unmittelbar hinter der Zeltreihe
- eigener Interaktionspunkt zum Brunsen
- Lars und Danny reagieren positiv
- Kontrollgang kann den Spieler dabei erwischen und Folgewirkungen auslösen

## Sprint 70 · Gundula- und Uli-Tagesroutine

- regulärer Dienst an der Anmeldung
- Mittagspause von 12 bis 14 Uhr in der Hütte: schlafen oder trinken
- gemeinsamer Kontrollgang ab 18 Uhr über mehrere Kartenbereiche
- Sichtkontakt löst ein zustandsabhängiges Kontrollgespräch aus

## Sprint 71 · Masls „Komm ans Loch“

- eigenes Timing-Minispiel mit drei Zügen
- Ergebnis beeinflusst Breitheit, Energie, Chaos, Masl-Beziehung und Momentum
- Wirkung wird anschließend von Welt, Kampf und sozialen Systemen übernommen

## Sprint 72 · Architektur, UX und Qualität

- Content, Statusmodell, soziale Regeln, Store-Adapter, Kampfregeln und Szenen voneinander getrennt
- bestehendes Save-Format bleibt kompatibel
- alte Nicht-Freundes-Unterstützer werden nicht mehr als aktive Kampfpartner geführt
- neue automatisierte Tests für Zustände, Flirtobergrenze, Geschenkpräferenzen, Teamsynergien und Statuskampf
- neuer PWA-Cache und Veröffentlichung unter Buildparameter `v=72`

## Metagame-Schleife

1. Essen, Trinken, Rauchpausen und Minispiele verändern den Körperzustand.
2. Der Zustand verändert Bewegung, Wahrnehmung, Gespräche, Flirts und Kämpfe.
3. Gespräche und passende Geschenke bauen Beziehungen auf.
4. Beziehungen schalten Freunde für das aktive Dreierteam frei.
5. Teamzusammenstellung und Synergien verändern Kämpfe und Minispiele.
6. Zeit und Tagesroutinen erzeugen Risiken, insbesondere den Kontrollgang um 18 Uhr.
7. Regeneration und Vorbereitung sind dadurch echte strategische Entscheidungen statt reine Statusleistenpflege.
