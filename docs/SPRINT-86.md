# Sprint 86 – Vollständige Interaktionsauswahl und „In die Hecke“

## Ausgangslage

Die Welt führte zwar zahlreiche Personen, Gegenstände, Türen und Minispiele, wählte aber immer ausschließlich die räumlich nächste Interaktion. Lagen mehrere Kandidaten dicht zusammen, war nur der vorderste erreichbar. Andere Aktionen wurden dauerhaft überlagert.

Zusätzlich waren mehrere bereits implementierte Minispiele nicht sauber in der Welt verankert. Flip Cup, Beer Pong und Masls „Komm ans Loch“ besaßen keinen eigenen belastbaren Weltzugang. Flunkyball und das Ronny-Duell lagen teilweise an unlogischen Positionen. „In die Hecke brunzen“ war nur eine sofort ausgeführte Zustandsänderung.

## Kandidaten statt Einzelaktion

`InteractionAuditWorldScene` ermittelt alle erreichbaren Interaktionen innerhalb ihres jeweiligen Radius und sortiert sie nach Entfernung und Kontext. Storyaktionen behalten Vorrang, verdrängen aber keine anderen Kandidaten mehr aus der Auswahl.

Doppelte Zugänge werden logisch gruppiert. Beispielsweise gelten `npc-gundula-story` und `npc-gundula` als dieselbe Person. Eine Person, ein Minispiel und eine Tür am gleichen Ort bleiben dagegen drei getrennte Optionen.

## Bedienung

### Smartphone

Bei mehr als einer erreichbaren Aktion erscheint eine Auswahlleiste mit:

- allen Kandidaten,
- direkter Antipp-Auswahl,
- Vor- und Zurück-Pfeilen,
- markierter aktiver Aktion,
- sichtbarem Positionszähler.

Die große Aktionstaste führt ausschließlich die markierte Aktion aus.

### Desktop

- `Q` oder `Tab`: nächste Interaktion,
- `Shift + Tab`: vorherige Interaktion,
- Zifferntasten: direkte Auswahl,
- `E` oder Leertaste: markierte Aktion ausführen.

## Weltaktivitätskatalog

`worldActivityCatalog.ts` ist die verbindliche Quelle für frei startbare Aktivitäten:

| Aktivität | Ort |
| --- | --- |
| Ronny-Frustduell | bei Ronny im zentralen Servicebereich |
| Flip Cup | westlich am Partyzelt |
| Beer Pong | östlich am Partyzelt |
| Komm ans Loch | bei Masl auf der Festwiese |
| Flunkyball | am Strand |
| In die Hecke | an der Zelthecke des Taucherplatzes |

Jeder Eintrag definiert Szene, Region, Position, Radius, Prompt, Fortschrittsbedingung und gegebenenfalls Abschlussflag.

## Minispiel „In die Hecke“

Das Minispiel verbindet Timing und Unauffälligkeit:

1. Bildschirm, `E` oder Leertaste gedrückt halten, um zu brunzen.
2. Der Erleichterungsbalken steigt.
3. Gundula und Uli bewegen sich in zwei unabhängigen Blickzyklen.
4. Während hoher Blickgefahr steigt der Verdacht stark.
5. Loslassen stoppt den Vorgang und baut Verdacht ab.
6. Vollständige Erleichterung vor 100 Prozent Verdacht gewinnt.

Die Anzeige trennt:

- Erleichterung,
- Verdacht,
- aktuelles Blickrisiko.

### Unbemerkter Erfolg

- Blase vollständig geleert,
- leichte Chaossteigerung,
- kleiner Würdeverlust,
- bessere Beziehung zu Lars und Danny,
- gespeicherter Bestwert.

### Erwischtwerden

- nur anteilige Erleichterung,
- deutlicher Würdeverlust,
- starke Chaossteigerung,
- schlechtere Beziehung zu Gundula und Uli,
- dokumentiertes Erwischt-Flag.

## Automatische Prüfung

Sprint 86 prüft:

- Gruppierung doppelter Personeninteraktionen,
- Erhalt aller unterschiedlichen Kandidaten,
- zyklische Vorwärts- und Rückwärtsauswahl,
- vollständigen Aktivitätskatalog,
- korrekte Regionen der Aktivitätsmarker,
- sichere und gefährliche Blickfenster,
- Verdachtsabbau beim Stoppen,
- Erfolgs- und Erwischtzustände,
- Einbindung von Auswahlleiste und Hecken-Minispiel in den Produktionsbuild.

Eine manuelle Prüfung auf einem physischen Android- oder iPhone-Gerät bleibt separat erforderlich.
