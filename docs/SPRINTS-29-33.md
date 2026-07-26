# Gameplay-Sprints 29–33

Stand: 26. Juli 2026

Diese fünf Sprints vertiefen die vorhandenen Mechaniken ausschließlich in der React-/Phaser-/TypeScript-Zielarchitektur. Die veröffentlichte Referenz in `docs/` bleibt unverändert auf Build v29.

## Sprint 29 – Konsequente Entscheidungen

- zustandsabhängige Proben für Charme, Nerven, Fokus, Chaos und Teamwork
- sichtbare Erfolgschancen vor einer Entscheidung
- vier Ergebnisstufen: großer Erfolg, Erfolg, Fehlschlag und Desaster
- Würde, Chaos, Ruf und Momentum als miteinander verbundene Wochenendwerte
- chronologisches Feedback statt folgenloser Dialogantworten
- vollständiger 25-Euro-Supermarkt mit acht relevanten Gegenständen

## Sprint 30 – Beziehungen und Gruppenrollen

- persistente Beziehungen zu Gundula, Uli, Manni und Ronny
- Loyalität und konkrete Rollenboni statt eines pauschalen Teambonus
- Manni als Versorger mit Erholungs- und Minispielbonus
- Ronny als Diskutierer mit Kampfschwerpunkt
- Begleiter wirken auf Dialoge, Kampf, Erholung und Minispiele
- Questgegenstände können Beziehungen und Rekrutierungen auslösen

## Sprint 31 – Körper und Zeit als System

- Bedürfnisse um Kater und Mut erweitert
- Alkoholabbau erzeugt zeitversetzt Kater statt folgenlos zu verschwinden
- Energie, Hunger, Durst, Blase, Alkohol, Breitheit, Kater und Mut verändern Proben
- Pause und Toilettengang als echte Zeit-/Zustandsentscheidungen in der Welt
- Gegenstände haben klare Nutzen- und Folgekosten
- Zustandslabel fasst den aktuellen Leistungsdruck verständlich zusammen

## Sprint 32 – Reaktive Questkette

- persistenter Queststatus mit `locked`, `active`, `completed` und `failed`
- Einlass bei Gundula und Uli entsperrt Manni, Ronny und Flip Cup
- aktive Ziele werden automatisch priorisiert und im HUD angezeigt
- Erholungsquest reagiert dynamisch auf Tag, Energie und Kater
- abgeschlossene Aktivitäten können nicht zur Ruf- oder Wertefarm missbraucht werden
- Entscheidungen schreiben Folgen in das Adria-Protokoll

## Sprint 33 – Gemeinsames Balancing

- Camping-Duell verwendet Würde, Zustand, Beziehung und Gruppenrollen
- drei taktisch unterschiedliche Aktionen: Konter, Blockade und Team-Zuruf
- Blockade reduziert zuverlässig Gegenschaden; Team-Zuruf tauscht Tempo gegen Erholung
- Flip-Cup-Timingfenster und Versuche reagieren auf Fokus, Erschöpfung und Begleiter
- perfekte Minispielergebnisse werden anders belohnt als knappe Erfolge
- Save-Format v2 mit automatischer Migration des bisherigen v1-Stands

## Automatische Abdeckung

- Budgetgrenzen und Übernahme des Einkaufs
- Gegenstandseffekte und nicht konsumierbare Questgegenstände
- Freitag-bis-Sonntag-Zeitfortschritt
- deterministische Dialogproben und Einlasskette
- Rekrutierung durch Questabschluss
- Schutz gegen wiederholtes Belohnungs-Farming
- Migration von v1 auf v2
- Zustands-, Merkmals-, Beziehungs- und Rollenmodifikatoren
- Minispiel-Toleranz und Versuche
- Kampfstartwerte, Blockade und Team-Erholung
- bestehende Endgame-Szenarien der veröffentlichten Referenz

## Bewusst noch offen

Die fünf Sprints stellen keine vollständige Funktionsparität her. Noch fehlen insbesondere die große Weltkarte, alle neun Freunde und Tagespläne, die übrigen vier Minispiele, Kontrollen und Schlafablauf, das Sonntagsfinale in `src/`, der v13-Import sowie die Umschaltung der PWA auf den neuen Build.
