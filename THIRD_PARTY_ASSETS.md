# Third-party assets

## Kenney Particle Pack

The LPC campaign minigames optionally load selected particle textures from the **Kenney Particle Pack** at runtime:

- `circle_03.png`
- `dirt_02.png`
- `smoke_04.png`
- `spark_03.png`
- `star_06.png`
- `trace_02.png`

Source mirror used by the game:

- `Calinou/kenney-particle-pack`
- `addons/kenney_particle_pack/`

Original author: **Kenney**  
License: **CC0 1.0 Universal / Public Domain**  
Official asset page: `kenney.nl/assets/particle-pack`

Attribution is not legally required under CC0, but the source is documented here for transparency and reproducibility.

## Runtime and offline behavior

The remote textures are visual enhancements only. The minigame renderer has built-in Canvas fallbacks for every effect. A failed or blocked network request therefore does not prevent a minigame from loading, starting, finishing, being paused, retried, or scored.

No gameplay rules, collision checks, scoring calculations, save data, or progression depend on third-party assets.
