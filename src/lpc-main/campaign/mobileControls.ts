export interface AnalogVector {
  x: number;
  y: number;
  magnitude: number;
  angle: number;
}

export type CardinalDirection = 'up' | 'down' | 'left' | 'right';

export interface InvisibleJoystickOptions {
  deadZone?: number;
  maxRadius?: number;
  haptics?: boolean;
}

const DEFAULT_OPTIONS: Required<InvisibleJoystickOptions> = {
  deadZone: 0.13,
  maxRadius: 68,
  haptics: true,
};

export class InvisibleJoystick {
  private readonly options: Required<InvisibleJoystickOptions>;
  private activePointer?: number;
  private origin = { x: 0, y: 0 };
  private activeDirections = new Set<CardinalDirection>();
  private base: HTMLElement;
  private thumb: HTMLElement;
  private label: HTMLElement;

  constructor(private readonly zone: HTMLElement, options: InvisibleJoystickOptions = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this.zone.classList.add('invisible-joystick-zone');
    this.zone.innerHTML = `
      <div class="joystick-ghost" aria-hidden="true">
        <i class="joystick-ring"></i>
        <b class="joystick-thumb"></b>
      </div>
      <span class="joystick-help">Links berühren und ziehen</span>`;
    this.base = requireElement(this.zone, '.joystick-ghost');
    this.thumb = requireElement(this.zone, '.joystick-thumb');
    this.label = requireElement(this.zone, '.joystick-help');
    this.bind();
  }

  destroy(): void {
    this.clearDirections();
    this.zone.replaceChildren();
  }

  private bind(): void {
    this.zone.addEventListener('pointerdown', this.onPointerDown, { passive: false });
    this.zone.addEventListener('pointermove', this.onPointerMove, { passive: false });
    this.zone.addEventListener('pointerup', this.onPointerUp, { passive: false });
    this.zone.addEventListener('pointercancel', this.onPointerUp, { passive: false });
    this.zone.addEventListener('contextmenu', (event) => event.preventDefault());
  }

  private readonly onPointerDown = (event: PointerEvent): void => {
    if (this.activePointer !== undefined || event.pointerType === 'mouse' && event.button !== 0) return;
    event.preventDefault();
    this.activePointer = event.pointerId;
    this.origin = { x: event.clientX, y: event.clientY };
    this.zone.setPointerCapture(event.pointerId);
    this.base.style.setProperty('--joy-x', `${event.offsetX}px`);
    this.base.style.setProperty('--joy-y', `${event.offsetY}px`);
    this.base.classList.add('active');
    this.label.classList.add('hidden');
    this.updateVector(event.clientX, event.clientY);
    vibrate(this.options.haptics ? 8 : 0);
  };

  private readonly onPointerMove = (event: PointerEvent): void => {
    if (event.pointerId !== this.activePointer) return;
    event.preventDefault();
    this.updateVector(event.clientX, event.clientY);
  };

  private readonly onPointerUp = (event: PointerEvent): void => {
    if (event.pointerId !== this.activePointer) return;
    event.preventDefault();
    this.activePointer = undefined;
    this.base.classList.remove('active');
    this.thumb.style.transform = 'translate3d(0,0,0)';
    this.clearDirections();
    dispatchVector({ x: 0, y: 0, magnitude: 0, angle: 0 });
  };

  private updateVector(clientX: number, clientY: number): void {
    const rawX = clientX - this.origin.x;
    const rawY = clientY - this.origin.y;
    const distance = Math.hypot(rawX, rawY);
    const limitedDistance = Math.min(distance, this.options.maxRadius);
    const scale = distance > 0 ? limitedDistance / distance : 0;
    const displayX = rawX * scale;
    const displayY = rawY * scale;
    this.thumb.style.transform = `translate3d(${displayX}px,${displayY}px,0)`;

    const normalizedX = displayX / this.options.maxRadius;
    const normalizedY = displayY / this.options.maxRadius;
    const magnitude = Math.min(1, Math.hypot(normalizedX, normalizedY));
    const vector: AnalogVector = {
      x: magnitude < this.options.deadZone ? 0 : normalizedX,
      y: magnitude < this.options.deadZone ? 0 : normalizedY,
      magnitude: magnitude < this.options.deadZone ? 0 : magnitude,
      angle: Math.atan2(normalizedY, normalizedX),
    };
    dispatchVector(vector);
    this.syncDirections(vectorToDirections(vector));
  }

  private syncDirections(next: Set<CardinalDirection>): void {
    for (const direction of this.activeDirections) {
      if (!next.has(direction)) dispatchDirection(direction, false);
    }
    for (const direction of next) {
      if (!this.activeDirections.has(direction)) dispatchDirection(direction, true);
    }
    this.activeDirections = next;
  }

  private clearDirections(): void {
    for (const direction of this.activeDirections) dispatchDirection(direction, false);
    this.activeDirections.clear();
  }
}

export function vectorToDirections(vector: Pick<AnalogVector, 'x' | 'y' | 'magnitude'>): Set<CardinalDirection> {
  const directions = new Set<CardinalDirection>();
  if (vector.magnitude <= 0) return directions;
  const threshold = 0.28;
  if (vector.x <= -threshold) directions.add('left');
  if (vector.x >= threshold) directions.add('right');
  if (vector.y <= -threshold) directions.add('up');
  if (vector.y >= threshold) directions.add('down');
  return directions;
}

export function actionLabel(target: string): string {
  const value = target.toLowerCase();
  if (/sprechen|ansprechen|gundula|uli|ronny|manni|susi|jule|kira/.test(value)) return 'REDEN';
  if (/öffnen|kofferraum|bier/.test(value)) return 'ÖFFNEN';
  if (/flip|pong|flunky|loch|hecke|duell|kampf/.test(value)) return 'SPIELEN';
  if (/strom|verbinden|ausladen|platzieren/.test(value)) return 'MACHEN';
  if (/ruhen|zelt/.test(value)) return 'RUHEN';
  return 'AKTION';
}

export function installContextAction(button: HTMLButtonElement, prompt: HTMLElement, promptText: HTMLElement): () => void {
  const update = (): void => {
    const target = promptText.textContent?.trim() ?? '';
    const available = !prompt.hidden && Boolean(target);
    button.classList.toggle('available', available);
    button.classList.toggle('idle', !available);
    button.innerHTML = `<b>${available ? actionLabel(target) : 'AKTION'}</b><small>${available ? escapeHtml(target) : 'In der Nähe eines Ziels'}</small>`;
  };
  const observer = new MutationObserver(update);
  observer.observe(prompt, { attributes: true, childList: true, subtree: true, characterData: true });
  observer.observe(promptText, { childList: true, subtree: true, characterData: true });
  button.addEventListener('pointerdown', onActionDown);
  button.addEventListener('click', onActionClick);
  update();
  return () => {
    observer.disconnect();
    button.removeEventListener('pointerdown', onActionDown);
    button.removeEventListener('click', onActionClick);
  };
}

function onActionDown(event: PointerEvent): void {
  vibrate(12);
  (event.currentTarget as HTMLElement).classList.add('pressed');
  window.setTimeout(() => (event.currentTarget as HTMLElement)?.classList.remove('pressed'), 140);
}

function onActionClick(event: MouseEvent): void {
  event.preventDefault();
  window.dispatchEvent(new Event('lpc-campaign-action'));
}

function dispatchDirection(direction: CardinalDirection, active: boolean): void {
  window.dispatchEvent(new CustomEvent('lpc-campaign-direction', { detail: { direction, active } }));
}

function dispatchVector(vector: AnalogVector): void {
  window.dispatchEvent(new CustomEvent('lpc-campaign-vector', { detail: vector }));
}

function vibrate(duration: number): void {
  if (duration <= 0 || typeof navigator.vibrate !== 'function') return;
  navigator.vibrate(duration);
}

function requireElement<T extends HTMLElement = HTMLElement>(root: ParentNode, selector: string): T {
  const node = root.querySelector<T>(selector);
  if (!node) throw new Error(`Missing joystick element: ${selector}`);
  return node;
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character] ?? character);
}
