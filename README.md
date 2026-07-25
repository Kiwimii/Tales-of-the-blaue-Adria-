# Tales of the Blaue Adria

A story-driven top-down camping RPG for desktop and mobile browsers.

## Current vertical slice

- character creation
- top-down campsite prototype
- keyboard and touch controls
- day/night and needs system
- NPC interaction hooks for Gundula and Uli
- turn-based encounter scene
- Flip Cup minigame scene
- local save state

## Tech stack

- Phaser 4
- React
- TypeScript
- Vite
- GitHub Pages

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

The architecture keeps world exploration, battles and minigames as separate scenes connected through a shared game session store. This allows the project to grow into a larger RPG without coupling story content to individual screens.
