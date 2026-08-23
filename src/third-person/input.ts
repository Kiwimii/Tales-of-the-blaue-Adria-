export interface MovementInput {
  x: number;
  forward: number;
  sprint: boolean;
}

export class ThirdPersonInput {
  private readonly keys = new Set<string>();
  private movePointer: number | null = null;
  private lookPointer: number | null = null;
  private canvasPointer: number | null = null;
  private joystickX = 0;
  private joystickY = 0;
  private lookX = 0;
  private lookY = 0;
  private previousLook = { x: 0, y: 0 };
  private previousCanvas = { x: 0, y: 0 };
  private sprintTouch = false;
  private enabled = true;

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly joystick: HTMLElement,
    private readonly joystickKnob: HTMLElement,
    private readonly lookZone: HTMLElement,
    private readonly sprintButton: HTMLButtonElement,
    onAction: () => void,
    onMenu: () => void,
  ) {
    window.addEventListener('keydown', (event) => {
      if (isMovementKey(event.code)) event.preventDefault();
      this.keys.add(event.code);
      if (event.code === 'Escape' && !event.repeat) {
        onMenu();
        return;
      }
      if (!this.enabled || event.repeat) return;
      if (event.code === 'KeyE' || event.code === 'Enter') onAction();
    });
    window.addEventListener('keyup', (event) => this.keys.delete(event.code));
    window.addEventListener('blur', () => this.reset());
    document.addEventListener('visibilitychange', () => { if (document.hidden) this.reset(); });

    this.canvas.addEventListener('pointerdown', (event) => {
      if (!this.enabled || event.pointerType === 'touch' || event.button !== 0) return;
      this.canvasPointer = event.pointerId;
      this.previousCanvas = { x: event.clientX, y: event.clientY };
      this.canvas.setPointerCapture(event.pointerId);
      this.canvas.classList.add('camera-dragging');
    });
    this.canvas.addEventListener('pointermove', (event) => {
      if (this.canvasPointer !== event.pointerId) return;
      this.lookX += event.clientX - this.previousCanvas.x;
      this.lookY += event.clientY - this.previousCanvas.y;
      this.previousCanvas = { x: event.clientX, y: event.clientY };
    });
    const endCanvas = (event: PointerEvent): void => {
      if (this.canvasPointer !== event.pointerId) return;
      this.canvasPointer = null;
      this.canvas.classList.remove('camera-dragging');
      try { this.canvas.releasePointerCapture(event.pointerId); } catch { /* capture may already be gone */ }
    };
    this.canvas.addEventListener('pointerup', endCanvas);
    this.canvas.addEventListener('pointercancel', endCanvas);
    this.canvas.addEventListener('wheel', (event) => event.preventDefault(), { passive: false });

    this.joystick.addEventListener('pointerdown', (event) => {
      if (!this.enabled) return;
      event.preventDefault();
      this.movePointer = event.pointerId;
      this.joystick.setPointerCapture(event.pointerId);
      this.updateJoystick(event);
    });
    this.joystick.addEventListener('pointermove', (event) => {
      if (this.movePointer === event.pointerId) this.updateJoystick(event);
    });
    const endJoystick = (event: PointerEvent): void => {
      if (this.movePointer !== event.pointerId) return;
      this.movePointer = null;
      this.joystickX = 0;
      this.joystickY = 0;
      this.joystickKnob.style.transform = 'translate(0px, 0px)';
    };
    this.joystick.addEventListener('pointerup', endJoystick);
    this.joystick.addEventListener('pointercancel', endJoystick);
    this.joystick.addEventListener('lostpointercapture', endJoystick);

    this.lookZone.addEventListener('pointerdown', (event) => {
      if (!this.enabled || event.pointerType !== 'touch') return;
      this.lookPointer = event.pointerId;
      this.previousLook = { x: event.clientX, y: event.clientY };
      this.lookZone.setPointerCapture(event.pointerId);
    });
    this.lookZone.addEventListener('pointermove', (event) => {
      if (this.lookPointer !== event.pointerId) return;
      this.lookX += (event.clientX - this.previousLook.x) * 1.3;
      this.lookY += (event.clientY - this.previousLook.y) * 1.3;
      this.previousLook = { x: event.clientX, y: event.clientY };
    });
    const endLook = (event: PointerEvent): void => {
      if (this.lookPointer === event.pointerId) this.lookPointer = null;
    };
    this.lookZone.addEventListener('pointerup', endLook);
    this.lookZone.addEventListener('pointercancel', endLook);

    const sprintOn = (event: PointerEvent): void => {
      event.preventDefault();
      this.sprintTouch = true;
      this.sprintButton.classList.add('pressed');
      this.sprintButton.setPointerCapture(event.pointerId);
    };
    const sprintOff = (): void => {
      this.sprintTouch = false;
      this.sprintButton.classList.remove('pressed');
    };
    this.sprintButton.addEventListener('pointerdown', sprintOn);
    this.sprintButton.addEventListener('pointerup', sprintOff);
    this.sprintButton.addEventListener('pointercancel', sprintOff);
    this.sprintButton.addEventListener('lostpointercapture', sprintOff);
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    if (!enabled) this.reset();
  }

  movement(): MovementInput {
    if (!this.enabled) return { x: 0, forward: 0, sprint: false };
    const x = axis(this.keys, 'KeyD', 'ArrowRight') - axis(this.keys, 'KeyA', 'ArrowLeft') + this.joystickX;
    const forward = axis(this.keys, 'KeyW', 'ArrowUp') - axis(this.keys, 'KeyS', 'ArrowDown') - this.joystickY;
    const length = Math.hypot(x, forward);
    return {
      x: length > 1 ? x / length : x,
      forward: length > 1 ? forward / length : forward,
      sprint: this.sprintTouch || this.keys.has('ShiftLeft') || this.keys.has('ShiftRight'),
    };
  }

  consumeLook(): { x: number; y: number } {
    const result = { x: this.lookX, y: this.lookY };
    this.lookX = 0;
    this.lookY = 0;
    return result;
  }

  private updateJoystick(event: PointerEvent): void {
    const bounds = this.joystick.getBoundingClientRect();
    const radius = bounds.width * 0.34;
    let x = event.clientX - (bounds.left + bounds.width / 2);
    let y = event.clientY - (bounds.top + bounds.height / 2);
    const length = Math.hypot(x, y);
    if (length > radius) {
      x = x / length * radius;
      y = y / length * radius;
    }
    this.joystickX = x / radius;
    this.joystickY = y / radius;
    this.joystickKnob.style.transform = `translate(${x}px, ${y}px)`;
  }

  private reset(): void {
    this.keys.clear();
    this.joystickX = 0;
    this.joystickY = 0;
    this.lookX = 0;
    this.lookY = 0;
    this.movePointer = null;
    this.lookPointer = null;
    this.canvasPointer = null;
    this.sprintTouch = false;
    this.joystickKnob.style.transform = 'translate(0px, 0px)';
    this.sprintButton.classList.remove('pressed');
    this.canvas.classList.remove('camera-dragging');
  }
}

function axis(keys: Set<string>, primary: string, secondary: string): number {
  return keys.has(primary) || keys.has(secondary) ? 1 : 0;
}

function isMovementKey(code: string): boolean {
  return ['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(code);
}
