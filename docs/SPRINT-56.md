# Sprint 56 – Realismus, Maßstab und Objektlogik

Stand: 26. Juli 2026

## Anlass

Die erweiterte Karte aus Sprint 55 war funktional, enthielt aber mehrere visuelle und räumliche Unstimmigkeiten. Einige Bäume wurden als komplette Weltgrafik rotiert und bewegten dadurch Stamm und Krone sichtbar über den Boden. Die Feueranimation skalierte ebenfalls um den Weltursprung. Mehrere Objekte, Figuren und Landmarken lagen teilweise im Wasser oder überschnitten andere Nutzungen.

## Korrekturen

- Baumstämme und Schatten bleiben vollständig statisch.
- Nur einzelne Baumkronen bewegen sich mit weniger als zwei Welteinheiten Amplitude und sehr geringer Rotation.
- Die Feuerstelle wurde aus der Zeltreihe in eine freie Gemeinschaftsfläche versetzt.
- Die Flamme wird lokal um ihren eigenen Mittelpunkt animiert.
- Zelte und zugehörige Figuren wurden als geordnete Lagerreihe mit ausreichendem Abstand zur Feuerstelle angeordnet.
- Rettungswache, Schima, Bucht-Schild, Bucht-Bank und Bäume wurden aus dem Wasser auf plausible Standorte verschoben.
- Aussichtspunkte am See und in der Bucht liegen nun tatsächlich auf den jeweiligen Stegen.
- Die Wasser-Kollision wurde in sechs Teilflächen zerlegt. Begehbar bleiben nur die realen Stegkorridore; neben den Stegenden kann nicht mehr ins Wasser gelaufen werden.
- Gebäude, Camper, Zelte, Bühne, Möbel, Felsen und Bäume besitzen unterschiedliche physische Fußabdrücke.
- Baumkollisionen beschränken sich auf den Stamm statt auf die gesamte Krone.
- Die Tiefensortierung richtet sich nach der vertikalen Position: Figuren verschwinden hinter Gebäuden und Bäumen, wenn sie tatsächlich dahinter stehen.

## Gebäude und Objektvarianten

- Das Sanitärgebäude besitzt nun eine flachere Dachform, geflieste Fassade, hochliegende Fenster und Lüftung.
- Die Rettungswache steht erhöht auf Stützen und besitzt Geländer und Leiter.
- Die Werkstatt besitzt Pultdach, breites Tor, Fenster und Materialstapel.
- Strandbar und Kiosk besitzen eigene Markisen.
- Holzlager und Unterstand sind offene Konstruktionen statt verkleinerter Wohnhäuser.
- Das Partyzelt ist nun ein rechteckiges Festzelt mit Pfosten, offener Front, Lichtleiste und Biertisch statt eines übergroßen Dreieckzelts.
- Stege besitzen sichtbare Bohlen und Stützen.

## Qualitätssicherung

Neue Tests prüfen:

- unbeabsichtigte Wasserplatzierungen,
- ausreichenden Abstand der Feuerstelle zu allen Zelten,
- vollständig blockierte Wasserflächen außerhalb der Stege,
- realistische Kollisionsgrößen,
- monotone Y-basierte Tiefensortierung.

Save-Format, Quests, Freischaltungen, Innenräume, Figuren und Minispiele bleiben unverändert.
