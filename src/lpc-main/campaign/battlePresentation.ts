import type { CombatMoveId } from '../../game/types';

export type BattleMotion = 'highfive' | 'reveal' | 'agree' | 'argue' | 'counter' | 'block' | 'drink' | 'team-cheer' | 'focus' | 'exaggerate';

export interface BattlePresentationElements {
  modal: HTMLElement;
  title: HTMLElement;
  round: HTMLElement;
  playerBar: HTMLElement;
  enemyBar: HTMLElement;
  moves: HTMLElement;
  log: HTMLElement;
}

export class BattlePresentation {
  private stage: HTMLElement;
  private playerFigure: HTMLElement;
  private enemyFigure: HTMLElement;
  private effect: HTMLElement;
  private phase: HTMLElement;
  private previousPlayer = 0;
  private previousEnemy = 0;
  private locked = false;
  private wasOpen = false;
  private observer: MutationObserver;
  private timers: number[] = [];

  constructor(private readonly elements: BattlePresentationElements) {
    this.stage = document.createElement('section');
    this.stage.className = 'cinematic-battle-stage';
    this.stage.innerHTML = `
      <div class="battle-backdrop"><i></i><i></i><i></i></div>
      <div class="battle-side battle-side-player">
        <span class="battle-name">DU</span>
        <div class="battle-sprite battle-sprite-player"><b></b><i></i><em></em></div>
        <div class="battle-team-shadows"><i></i><i></i><i></i></div>
      </div>
      <div class="battle-center-fx"><strong>VS</strong><div class="battle-impact"></div></div>
      <div class="battle-side battle-side-enemy">
        <span class="battle-name">GEGENSEITE</span>
        <div class="battle-sprite battle-sprite-enemy"><b></b><i></i><em></em></div>
        <div class="battle-enemy-partner"></div>
      </div>
      <div class="battle-phase" aria-live="polite">WÄHLE EINE ATTACKE</div>`;
    const arena = elements.modal.querySelector('.battle-arena');
    arena?.before(this.stage);
    this.playerFigure = requireElement(this.stage, '.battle-sprite-player');
    this.enemyFigure = requireElement(this.stage, '.battle-sprite-enemy');
    this.effect = requireElement(this.stage, '.battle-impact');
    this.phase = requireElement(this.stage, '.battle-phase');

    this.elements.moves.addEventListener('click', this.onMove, true);
    this.observer = new MutationObserver(() => this.sync());
    this.observer.observe(elements.modal, { attributes: true, attributeFilter: ['hidden'] });
    this.observer.observe(elements.title, { childList: true, subtree: true, characterData: true });
    this.observer.observe(elements.round, { childList: true, subtree: true, characterData: true });
    this.observer.observe(elements.playerBar, { attributes: true, attributeFilter: ['style'] });
    this.observer.observe(elements.enemyBar, { attributes: true, attributeFilter: ['style'] });
    this.observer.observe(elements.log, { childList: true, subtree: true, characterData: true });
    this.sync();
  }

  destroy(): void {
    this.observer.disconnect();
    this.elements.moves.removeEventListener('click', this.onMove, true);
    this.timers.forEach((timer) => window.clearTimeout(timer));
    this.stage.remove();
  }

  private readonly onMove = (event: Event): void => {
    const button = (event.target as Element | null)?.closest<HTMLButtonElement>('[data-battle-move]');
    if (!button || this.locked) return;
    const move = button.dataset.battleMove as CombatMoveId | undefined;
    if (!move) return;
    this.locked = true;
    this.elements.modal.classList.add('battle-resolving');
    this.elements.moves.setAttribute('aria-busy', 'true');
    this.playMove(move);
    this.delay(() => {
      this.playerFigure.className = 'battle-sprite battle-sprite-player';
      this.enemyFigure.className = `battle-sprite battle-sprite-enemy ${enemyClass(this.elements.title.textContent ?? '')}`;
      this.effect.className = 'battle-impact';
      this.elements.modal.classList.remove('battle-resolving', 'battle-camera-hit', 'battle-camera-critical');
      this.elements.moves.removeAttribute('aria-busy');
      this.phase.textContent = 'WÄHLE EINE ATTACKE';
      this.locked = false;
      this.sync();
    }, 1150);
  };

  private playMove(move: CombatMoveId): void {
    const motion = battleAnimationForMove(move);
    this.phase.textContent = motion === 'block' ? 'VERTEIDIGUNG AUFBAUEN' : 'ATTACKE LÄUFT';
    this.playerFigure.classList.add(`motion-${motion}`);
    this.effect.classList.add(`impact-${motion}`);
    hapticForMove(move);

    this.delay(() => {
      this.enemyFigure.classList.add('motion-hit');
      this.elements.modal.classList.add('battle-camera-hit');
      this.phase.textContent = 'WIRKUNG WIRD BERECHNET';
    }, motion === 'argue' || motion === 'agree' ? 420 : 310);
    this.delay(() => {
      this.enemyFigure.classList.remove('motion-hit');
      this.enemyFigure.classList.add('motion-counter');
      this.phase.textContent = 'GEGNERISCHER KONTER';
    }, 700);
  }

  private sync(): void {
    const isOpen = !this.elements.modal.hidden;
    this.stage.hidden = !isOpen;
    if (!isOpen) {
      this.wasOpen = false;
      return;
    }

    const title = this.elements.title.textContent ?? '';
    const enemyName = title.split('·')[0]?.trim() || 'GEGENSEITE';
    setText(requireElement(this.stage, '.battle-side-enemy .battle-name'), enemyName.toUpperCase());
    setText(requireElement(this.stage, '.battle-side-player .battle-name'), 'DU & TEAM');
    if (!this.locked) this.enemyFigure.className = `battle-sprite battle-sprite-enemy ${enemyClass(title)}`;
    this.stage.classList.toggle('authority-battle', /Gundula|Uli|Platzordnung/i.test(title));
    this.stage.classList.toggle('ronny-battle', /Ronny/i.test(title));
    this.stage.dataset.round = this.elements.round.textContent?.replace(/\D/g, '') || '1';

    const player = parseBar(this.elements.playerBar);
    const enemy = parseBar(this.elements.enemyBar);
    if (!this.wasOpen) {
      this.previousPlayer = player;
      this.previousEnemy = enemy;
      this.wasOpen = true;
    } else {
      if (enemy > this.previousEnemy) this.floatDamage(enemy - this.previousEnemy, 'enemy');
      if (player > this.previousPlayer) this.floatDamage(player - this.previousPlayer, 'player');
      this.previousPlayer = player;
      this.previousEnemy = enemy;
    }

    const latest = this.elements.log.querySelector('.latest')?.textContent ?? '';
    this.stage.dataset.result = /gewonnen|schranke|frustriert genug/i.test(latest) ? 'win' : /rückzug|100|niederlage/i.test(latest) ? 'loss' : 'active';
  }

  private floatDamage(amount: number, side: 'player' | 'enemy'): void {
    if (amount <= 0.1) return;
    const label = document.createElement('b');
    label.className = `battle-floating-number ${side}`;
    label.textContent = `+${Math.round(amount)} FRUST`;
    this.stage.append(label);
    this.delay(() => label.remove(), 1000);
    if (amount >= 20) this.elements.modal.classList.add('battle-camera-critical');
  }

  private delay(callback: () => void, milliseconds: number): void {
    const timer = window.setTimeout(() => {
      this.timers = this.timers.filter((entry) => entry !== timer);
      callback();
    }, milliseconds);
    this.timers.push(timer);
  }
}

export function battleAnimationForMove(move: CombatMoveId): BattleMotion {
  const motions: Record<CombatMoveId, BattleMotion> = {
    'classic-high-five': 'highfive',
    'aldi-shirt-show': 'reveal',
    'agree-anyway': 'agree',
    'logical-argument': 'argue',
    'dry-counter': 'counter',
    'camping-chair-block': 'block',
    'beer-offer': 'drink',
    'synchronised-cheer': 'team-cheer',
    'cup-eye-contact': 'focus',
    'total-exaggeration': 'exaggerate',
  };
  return motions[move] ?? 'argue';
}

function enemyClass(title: string): string {
  if (/Gundula|Uli|Platzordnung/i.test(title)) return 'enemy-authority';
  if (/Ronny/i.test(title)) return 'enemy-ronny';
  return 'enemy-generic';
}

function parseBar(element: HTMLElement): number {
  const value = Number.parseFloat(element.style.width || '0');
  return Number.isFinite(value) ? value : 0;
}

function hapticForMove(move: CombatMoveId): void {
  if (typeof navigator.vibrate !== 'function') return;
  if (move === 'total-exaggeration' || move === 'synchronised-cheer') navigator.vibrate([20, 35, 35]);
  else if (move === 'camping-chair-block') navigator.vibrate([12, 40, 12]);
  else navigator.vibrate(18);
}

function setText(element: HTMLElement, value: string): void {
  if (element.textContent !== value) element.textContent = value;
}

function requireElement<T extends HTMLElement = HTMLElement>(root: ParentNode, selector: string): T {
  const node = root.querySelector<T>(selector);
  if (!node) throw new Error(`Missing battle presentation element: ${selector}`);
  return node;
}
