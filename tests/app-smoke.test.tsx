import { renderToString } from 'react-dom/server';
import { afterEach, describe, expect, it } from 'vitest';
import App from '../src/App';
import { gameStore } from '../src/game/state/GameStore';
import type { PlayerProfile } from '../src/game/types';

const profile: PlayerProfile = {
  name: 'Testcamper',
  skinTone: '#efc09b',
  hair: '#49301f',
  shirt: '#e3b74f',
  shorts: '#263b47',
  hairStyle: 'welle',
  bodyType: 'breit',
  accessory: 'brille',
  trait: 'beobachtend',
};

describe('application onboarding smoke path', () => {
  afterEach(() => gameStore.reset());

  it('renders intro, creator, shop and game shell in sequence', () => {
    gameStore.reset();
    expect(renderToString(<App />)).toContain('WOCHENENDE I');

    gameStore.completeIntro();
    const creator = renderToString(<App />);
    expect(creator).toContain('Wer fährt da eigentlich hin?');
    expect(creator).toContain('Startmerkmal');

    gameStore.setProfile(profile);
    const shop = renderToString(<App />);
    expect(shop).toContain('25 Euro. Keine zweite Chance.');
    expect(shop).toContain('Testcamper');

    gameStore.completeShopping({ wasser: 2, wuerste: 1, klopapier: 1 });
    const shell = renderToString(<App />);
    expect(shell).toContain('Melde dich zuerst bei Gundula');
    expect(shell).toContain('Beziehungen');
    expect(shell).toContain('game-host');
  });
});
