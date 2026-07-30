# Connected Friday–Saturday Weekend Arc

This document mirrors the implemented browser systems. It is intended as a maintenance map; player-facing detail also appears in the in-game Codex.

## Campaign sequence

1. Friday from 18:00, while `free-weekend` is active, the drinking-game Olympics begins.
2. Flip Cup, Beer Pong and Flunkyball are played through their existing minigame implementations.
3. The selected afterparty calculates persistent `nightNoise` and advances the clock to Saturday 08:00.
4. Gundula starts the eviction complaint at the tent circle.
5. Danny and Felix create distinct testimony flags.
6. André's complete goodbye song is played from an offline text constant.
7. Masl is woken and convinced through stateful choices.
8. Four debate cards reduce eviction pressure and/or gain crowd support.
9. A mandatory exaggerated 2v2 brawl resolves the right to stay.
10. Defeat creates a real early ending with a Saturday checkpoint retry.
11. Victory plays André's complete stay song and unlocks Secret Millionaire.
12. Secret Millionaire must be completed before the normal Sunday finale can unlock.

## Olympics scoring

- Failure: 0 Olympic points
- Messy victory: 2
- Solid victory: 3
- Perfect victory: 5

All original minigame rewards, conditions, relationship changes and mastery consequences remain active.

## Night noise

```text
8
+ Olympic points × 2.2
+ afterparty contribution (-12 / +19 / +34)
+ alcohol × 0.34
+ chaos × 0.28
+ late activities × 9
- 8 for quiet rest
```

The result is clamped to `0..100`. It affects Gundula's evidence, opening debate pressure and enemy power in the brawl.

## Masl

Wake actions alter both wake progress and mood. Mood and the Masl relationship determine Masl's brawl HP and power. Convincing routes are friendship, ego, challenge and emergency. The emergency route prevents deadlocks but costs relationship, mood and dignity.

## Debate

Available cards:

- Felix's timeline
- Danny's chaotic counter-story
- André's goodbye song
- Gundula's ego weakness
- Uli's Wegbier bond
- Masl's hole logic

The debate cannot cancel the brawl. It changes its setup:

```text
Debate advantage = (100 - pressure) × 0.28 + crowd × 0.18
```

The value is clamped and reduces Gundula/Uli starting HP.

## Brawl

Player actions:

- Punch: timing-sensitive damage
- Block: next damage × 0.32
- Dodge: timing-sensitive avoidance and possible counter
- Masl Tunnel: charge 3, hits both and cancels the enemy turn

Gundula and Uli use character-specific exaggerated attacks. No gore or realistic injury system is used; the resource is standfastness.

## Early ending

On defeat:

- `earlyEvictionEnding = true`
- campaign stage becomes `early-eviction`
- free exploration and Sunday finale stop
- the goodbye song appears in the ending
- the player can restore the Saturday 08:00 checkpoint or restart the full weekend

## Secret Millionaire

Binding rules from the prior concept:

- André is game master.
- Twelve characters are candidates.
- Four secret votes are worth 1, 2, 3 and 4 points.
- Each round contains observations, two questions and one accusation.
- Any accused person leaves the prize pool, including an innocent person.
- Eliminated people cannot win the main prize.
- Scores and correctness remain hidden until the end.
- Exactly one main prize exists; there are no consolation or side prizes.
- The millionaire's missions and specific advantages remain hidden from the public Codex.

## Persistence and compatibility

The existing campaign storage key and metadata version remain unchanged. `weekendArc` is added through a deep default merge so older saves receive all required substructures without invalidating their existing progress.

## Main source files

- `src/lpc-main/campaign/weekendArcModel.ts`
- `src/lpc-main/campaign/weekendArc.ts`
- `src/lpc-main/campaign/weekendArcBootstrap.ts`
- `src/lpc-main/campaign/weekendArcCodex.ts`
- `src/lpc-main/campaign/weekendArc.css`
- `src/lpc-main/campaign/metaStore.ts`
- `src/lpc-main/campaign/minigames.ts`
