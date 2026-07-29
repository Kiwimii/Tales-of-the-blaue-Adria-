import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { actionLabel, vectorToDirections } from './mobileControls';
import { battleAnimationForMove } from './battlePresentation';

const root = resolve(process.cwd());

describe('campaign sprint 7-18 enhancements', () => {
  it('converts analog joystick vectors into all four cardinal directions', () => {
    expect([...vectorToDirections({ x: .8, y: 0, magnitude: .8 })]).toEqual(['right']);
    expect([...vectorToDirections({ x: -.8, y: 0, magnitude: .8 })]).toEqual(['left']);
    expect([...vectorToDirections({ x: 0, y: -.8, magnitude: .8 })]).toEqual(['up']);
    expect([...vectorToDirections({ x: 0, y: .8, magnitude: .8 })]).toEqual(['down']);
  });

  it('supports diagonal movement and ignores the joystick dead zone', () => {
    expect(new Set(vectorToDirections({ x: .75, y: -.62, magnitude: .95 }))).toEqual(new Set(['right', 'up']));
    expect(vectorToDirections({ x: .1, y: .09, magnitude: .12 }).size).toBe(0);
  });

  it('uses context-specific labels for the mobile action button', () => {
    expect(actionLabel('Susi ansprechen')).toBe('REDEN');
    expect(actionLabel('Kofferraum öffnen')).toBe('ÖFFNEN');
    expect(actionLabel('Flip Cup am Zeltkreis')).toBe('SPIELEN');
    expect(actionLabel('Stromkasten verbinden')).toBe('MACHEN');
    expect(actionLabel('Im eigenen Zelt ruhen')).toBe('RUHEN');
  });

  it('assigns a distinct staged motion to every learned combat move', () => {
    const moves = [
      'classic-high-five', 'aldi-shirt-show', 'agree-anyway', 'logical-argument', 'dry-counter',
      'camping-chair-block', 'beer-offer', 'synchronised-cheer', 'cup-eye-contact', 'total-exaggeration',
    ] as const;
    const motions = moves.map((move) => battleAnimationForMove(move));
    expect(new Set(motions).size).toBe(10);
    expect(motions).toContain('highfive');
    expect(motions).toContain('block');
    expect(motions).toContain('team-cheer');
  });

  it('loads world patches before the campaign and presentation patches afterwards', () => {
    const html = readFileSync(resolve(root, 'lpc-main/index.html'), 'utf8');
    const world = html.indexOf('worldSceneEnhancements.ts');
    const app = html.indexOf('app.ts');
    const presentation = html.indexOf('campaignEnhancements.ts');
    expect(world).toBeGreaterThan(0);
    expect(world).toBeLessThan(app);
    expect(presentation).toBeGreaterThan(app);
  });

  it('contains invisible controls, battle staging and reduced-motion fallbacks', () => {
    const css = readFileSync(resolve(root, 'src/lpc-main/campaign/enhancements.css'), 'utf8');
    for (const marker of [
      '.mobile-move-zone', '.mobile-context-action', '.cinematic-battle-stage',
      '.world-atmosphere', '.campaign-reduced-motion', '.mobile-panel-sheet',
    ]) expect(css).toContain(marker);
  });
});
