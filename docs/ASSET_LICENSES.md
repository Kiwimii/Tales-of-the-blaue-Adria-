# Externe Grafik-Assets

## Ninja Adventure – Pixel-Boy & AAA

- Projekt: Ninja Adventure Asset Pack
- Hauptquelle: https://pixel-boy.itch.io/ninja-adventure-asset-pack
- Fixierte Quellrevision: `6ac78232d5aedcc85ce5f27d060ea92366f7c24a`
- Lizenz: CC0 1.0 Universal

Eingebundene Quelldateien:

- `content/map/tileset_village_abandoned.png`
- `content/character/ninja_blue/sprite.png`

Laufzeitquellen:

- https://raw.githubusercontent.com/pixel-boy/NinjaAdventure/6ac78232d5aedcc85ce5f27d060ea92366f7c24a/content/map/tileset_village_abandoned.png
- https://raw.githubusercontent.com/pixel-boy/NinjaAdventure/6ac78232d5aedcc85ce5f27d060ea92366f7c24a/content/character/ninja_blue/sprite.png

CC0 erlaubt Kopieren, Bearbeiten, Weitergeben und kommerzielle Nutzung ohne verpflichtende Namensnennung. Die Urheber werden hier dennoch zur Nachvollziehbarkeit genannt.

## Verwendung im aktuellen `/next/`-Build

Der bestehende Spielbuild verwendet kuratierte Ausschnitte für Bäume, Büsche, Baumstümpfe und kleine Servicehof-Requisiten als ergänzenden Umgebungs-Layer. Die individuell erstellten Charaktere, Zelte, Questobjekte und die bestehende Platzarchitektur bleiben dort erhalten.

## Verwendung im separaten `/redesign/`-Build

Der eigenständige Redesign-Testbuild verwendet die Assetfamilie als visuelle Grundlage für Gebäude, Vegetation, Requisiten sowie eine vollständig neu komponierte Karte. Dieser Build bleibt zum direkten Vergleich bestehen, wird aber nicht als bevorzugte Figurenrichtung weitergeführt.

## Universal LPC – separater `/lpc-test/`-Build

- Projekt: Universal LPC Spritesheet Character Generator
- Hauptquelle: https://github.com/LiberatedPixelCup/Universal-LPC-Spritesheet-Character-Generator
- Fixierte Quellrevision: `0f898bb675a1abe16ce430e82e3bf9daed278690`

Verwendete LPC-Layer:

- `spritesheets/body/bodies/male/walk.png`
- `spritesheets/head/heads/human/male/walk.png`
- `spritesheets/head/faces/male/neutral/walk.png`

Laufzeitquellen:

- https://raw.githubusercontent.com/LiberatedPixelCup/Universal-LPC-Spritesheet-Character-Generator/0f898bb675a1abe16ce430e82e3bf9daed278690/spritesheets/body/bodies/male/walk.png
- https://raw.githubusercontent.com/LiberatedPixelCup/Universal-LPC-Spritesheet-Character-Generator/0f898bb675a1abe16ce430e82e3bf9daed278690/spritesheets/head/heads/human/male/walk.png
- https://raw.githubusercontent.com/LiberatedPixelCup/Universal-LPC-Spritesheet-Character-Generator/0f898bb675a1abe16ce430e82e3bf9daed278690/spritesheets/head/faces/male/neutral/walk.png

Urheber und Lizenzangaben der verwendeten Basislayer:

- Körper: bluecarrot16, JaidynReiman, Benjamin K. Smith, Evert, Eliza Wyatt, TheraHedwig, MuffinElZangano, Durrani, Johannes Sjölund und Stephen Challener. Angeboten unter OGA-BY 3.0, CC-BY-SA 3.0 und GPL 3.0.
- Kopf: bluecarrot16, Benjamin K. Smith und Stephen Challener. Angeboten unter OGA-BY 3.0, CC-BY-SA 3.0 und GPL 3.0.
- Gesicht: JaidynReiman, Eliza Wyatt und Stephen Challener. Angeboten unter OGA-BY 3.0.

Für diesen Test werden die LPC-Dateien unverändert als anatomische und animierte Grundebenen geladen. Kleidung, Frisuren, Accessoires, Proportionen und Rollenmerkmale werden im Spielcode separat darüber gezeichnet. Diese neuen grafischen Overlays dürfen unter CC-BY-SA 4.0 weiterverwendet und verändert werden, solange das Projekt und die jeweiligen Urheber genannt werden.

Der `/lpc-test/`-Build ist bewusst ein Charaktervergleich und kein vollständiger Inhaltsersatz. Er prüft sechs individuelle moderne Figuren, bevor weitere Spielwelten oder Mechaniken auf diese Basis migriert werden.

Alle externen URLs sind revisionsgenau fixiert. Spätere Änderungen in fremden Repositories können die veröffentlichten Spielbuilds daher nicht unbemerkt verändern.
