import {
  AERIAL_NODES,
  AERIAL_ROADS,
  AERIAL_SITE_POLYGONS,
  AERIAL_WATER_POLYGONS,
  NPC_PLACEMENTS,
  type PlanPoint,
} from '../game/aerialCampgroundPlan';
import { ITEMS } from '../game/content';
import type { GameSnapshot } from '../game/types';
import type { ThirdPersonInteraction } from './content';
import type { QuestObjective, ThirdPersonProgress } from './progression';
import { planToWorld, worldToPlan } from './worldModel';

export interface DialogueChoice {
  label: string;
  detail?: string;
  tone?: 'primary' | 'neutral' | 'danger';
  action: () => void;
}

export interface UiEvents {
  action: () => void;
  menu: () => void;
  start: () => void;
  reset: () => void;
  useItem: (id: string) => void;
  modalChange: (open: boolean) => void;
}

export class ThirdPersonUi {
  readonly canvas: HTMLCanvasElement;
  readonly joystick: HTMLElement;
  readonly joystickKnob: HTMLElement;
  readonly lookZone: HTMLElement;
  readonly actionButton: HTMLButtonElement;
  readonly sprintButton: HTMLButtonElement;
  readonly menuButton: HTMLButtonElement;

  private readonly objectiveKicker: HTMLElement;
  private readonly objectiveTitle: HTMLElement;
  private readonly objectiveText: HTMLElement;
  private readonly objectiveDistance: HTMLElement;
  private readonly clock: HTMLElement;
  private readonly condition: HTMLElement;
  private readonly interactionPrompt: HTMLElement;
  private readonly interactionLabel: HTMLElement;
  private readonly toast: HTMLElement;
  private readonly live: HTMLElement;
  private readonly minimap: HTMLCanvasElement;
  private readonly minimapContext: CanvasRenderingContext2D;
  private readonly meters: Record<string, HTMLElement>;
  private readonly inventory: HTMLElement;
  private readonly startOverlay: HTMLElement;
  private readonly startCopy: HTMLElement;
  private readonly dialog: HTMLElement;
  private readonly dialogKicker: HTMLElement;
  private readonly dialogTitle: HTMLElement;
  private readonly dialogText: HTMLElement;
  private readonly dialogChoices: HTMLElement;
  private readonly activity: HTMLElement;
  private readonly activityTitle: HTMLElement;
  private readonly activityText: HTMLElement;
  private readonly activityNeedle: HTMLElement;
  private readonly activityResult: HTMLElement;
  private readonly activityButton: HTMLButtonElement;
  private readonly menu: HTMLElement;
  private toastTimer = 0;
  private activityFrame = 0;
  private activityValue = 0;
  private activityDirection = 1;
  private activityRunning = false;
  private activityFinished: ((score: number) => void) | null = null;

  constructor(root: HTMLElement, private readonly events: UiEvents) {
    root.innerHTML = shell();
    this.canvas = required(root, '#third-person-canvas', HTMLCanvasElement);
    this.joystick = required(root, '#mobile-joystick', HTMLElement);
    this.joystickKnob = required(root, '#mobile-joystick-knob', HTMLElement);
    this.lookZone = required(root, '#mobile-look-zone', HTMLElement);
    this.actionButton = required(root, '#mobile-action', HTMLButtonElement);
    this.sprintButton = required(root, '#mobile-sprint', HTMLButtonElement);
    this.menuButton = required(root, '#open-menu', HTMLButtonElement);
    this.objectiveKicker = required(root, '#objective-kicker', HTMLElement);
    this.objectiveTitle = required(root, '#objective-title', HTMLElement);
    this.objectiveText = required(root, '#objective-text', HTMLElement);
    this.objectiveDistance = required(root, '#objective-distance', HTMLElement);
    this.clock = required(root, '#hud-clock', HTMLElement);
    this.condition = required(root, '#hud-condition', HTMLElement);
    this.interactionPrompt = required(root, '#interaction-prompt', HTMLElement);
    this.interactionLabel = required(root, '#interaction-label', HTMLElement);
    this.toast = required(root, '#toast', HTMLElement);
    this.live = required(root, '#aria-live', HTMLElement);
    this.minimap = required(root, '#minimap', HTMLCanvasElement);
    const minimapContext = this.minimap.getContext('2d');
    if (!minimapContext) throw new Error('Minimap canvas context unavailable.');
    this.minimapContext = minimapContext;
    this.inventory = required(root, '#quick-inventory', HTMLElement);
    this.startOverlay = required(root, '#start-overlay', HTMLElement);
    this.startCopy = required(root, '#start-copy', HTMLElement);
    this.dialog = required(root, '#dialog-overlay', HTMLElement);
    this.dialogKicker = required(root, '#dialog-kicker', HTMLElement);
    this.dialogTitle = required(root, '#dialog-title', HTMLElement);
    this.dialogText = required(root, '#dialog-text', HTMLElement);
    this.dialogChoices = required(root, '#dialog-choices', HTMLElement);
    this.activity = required(root, '#activity-overlay', HTMLElement);
    this.activityTitle = required(root, '#activity-title', HTMLElement);
    this.activityText = required(root, '#activity-text', HTMLElement);
    this.activityNeedle = required(root, '#activity-needle', HTMLElement);
    this.activityResult = required(root, '#activity-result', HTMLElement);
    this.activityButton = required(root, '#activity-action', HTMLButtonElement);
    this.menu = required(root, '#menu-overlay', HTMLElement);
    this.meters = Object.fromEntries(
      ['energy', 'thirst', 'bladder', 'alcohol'].map((id) => [id, required(root, `[data-meter="${id}"]`, HTMLElement)]),
    );

    this.menuButton.addEventListener('click', events.menu);
    this.actionButton.addEventListener('click', events.action);
    required(root, '#start-3d', HTMLButtonElement).addEventListener('click', events.start);
    required(root, '#start-reset', HTMLButtonElement).addEventListener('click', events.reset);
    required(root, '#menu-resume', HTMLButtonElement).addEventListener('click', () => this.hideMenu());
    required(root, '#menu-reset', HTMLButtonElement).addEventListener('click', events.reset);
    required(root, '#dialog-close', HTMLButtonElement).addEventListener('click', () => this.hideDialog());
    required(root, '#activity-close', HTMLButtonElement).addEventListener('click', () => this.finishActivity(false));
    this.activityButton.addEventListener('click', () => {
      if (this.activityButton.dataset.mode === 'close') this.finishActivity(true, Number(this.activityButton.dataset.score ?? 0));
      else this.stopActivity();
    });
    this.minimap.addEventListener('click', () => this.minimap.closest('.minimap-card')?.classList.toggle('expanded'));
    this.renderInventory();
  }

  get isModalOpen(): boolean {
    return !this.dialog.hidden || !this.activity.hidden || !this.menu.hidden || !this.startOverlay.hidden;
  }

  handleEscape(): boolean {
    if (!this.menu.hidden) { this.hideMenu(); return true; }
    if (!this.dialog.hidden) { this.hideDialog(); return true; }
    if (!this.activity.hidden) { this.finishActivity(false); return true; }
    return false;
  }

  showStart(hasSave: boolean): void {
    this.startCopy.textContent = hasSave
      ? 'Dein separater 3D-Spielstand wurde gefunden. Der bestehende 2D-Spielstand bleibt unverändert.'
      : 'Ein eigenständiger 3D-Spielstand beginnt auf dem Parkplatz. Der bestehende 2D-Build bleibt unverändert.';
    required(this.startOverlay, '#start-3d', HTMLButtonElement).textContent = hasSave ? '3D-Spiel fortsetzen' : '3D-Wochenende starten';
    this.startOverlay.hidden = false;
    this.events.modalChange(true);
  }

  hideStart(): void {
    this.startOverlay.hidden = true;
    this.events.modalChange(this.isModalOpen);
    this.canvas.focus();
  }

  updateHud(snapshot: GameSnapshot, progress: ThirdPersonProgress, objective: QuestObjective, distance: number | null): void {
    this.objectiveKicker.textContent = objective.kicker;
    this.objectiveTitle.textContent = objective.title;
    this.objectiveText.textContent = objective.text;
    this.objectiveDistance.textContent = distance === null ? 'Freies Erkunden' : `${Math.max(1, Math.round(distance * 2.2))} m`;
    this.clock.textContent = `TAG ${snapshot.day} · ${snapshot.clockLabel}`;
    this.condition.textContent = snapshot.conditionLabel.toUpperCase();
    setMeter(this.meters.energy, snapshot.needs.energy, `${Math.round(snapshot.needs.energy)} %`);
    setMeter(this.meters.thirst, snapshot.needs.thirst, `${Math.round(snapshot.needs.thirst)} %`, true);
    setMeter(this.meters.bladder, snapshot.needs.bladder, `${Math.round(snapshot.needs.bladder)} %`, true);
    setMeter(this.meters.alcohol, snapshot.needs.alcohol, `${Math.round(snapshot.needs.alcohol)} %`);
    this.renderInventoryCounts(snapshot.inventory);
    document.documentElement.dataset.gateOpen = progress.questIndex >= 3 ? 'true' : 'false';
  }

  setInteraction(interaction: ThirdPersonInteraction | { id: string; label: string } | null): void {
    const visible = Boolean(interaction);
    this.interactionPrompt.hidden = !visible;
    this.actionButton.disabled = !visible;
    this.actionButton.classList.toggle('ready', visible);
    const label = interaction?.label ?? 'Nichts in Reichweite';
    this.interactionLabel.textContent = label;
    this.actionButton.querySelector('span')!.textContent = visible ? label : 'AKTION';
  }

  showToast(message: string, tone: 'good' | 'warn' | 'neutral' = 'neutral'): void {
    window.clearTimeout(this.toastTimer);
    this.toast.textContent = message;
    this.toast.dataset.tone = tone;
    this.toast.classList.add('visible');
    this.live.textContent = message;
    this.toastTimer = window.setTimeout(() => this.toast.classList.remove('visible'), 3200);
  }

  showDialogue(kicker: string, title: string, text: string, choices: DialogueChoice[]): void {
    this.dialogKicker.textContent = kicker;
    this.dialogTitle.textContent = title;
    this.dialogText.textContent = text;
    this.dialogChoices.replaceChildren();
    for (const choice of choices) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `dialog-choice ${choice.tone ?? 'neutral'}`;
      const strong = document.createElement('strong');
      strong.textContent = choice.label;
      button.append(strong);
      if (choice.detail) {
        const small = document.createElement('small');
        small.textContent = choice.detail;
        button.append(small);
      }
      button.addEventListener('click', () => choice.action(), { once: true });
      this.dialogChoices.append(button);
    }
    this.dialog.hidden = false;
    this.events.modalChange(true);
    window.setTimeout(() => this.dialogChoices.querySelector<HTMLButtonElement>('button')?.focus(), 0);
  }

  hideDialog(): void {
    this.dialog.hidden = true;
    this.events.modalChange(this.isModalOpen);
    this.canvas.focus();
  }

  showMenu(): void {
    this.menu.hidden = false;
    this.events.modalChange(true);
    window.setTimeout(() => required(this.menu, '#menu-resume', HTMLButtonElement).focus(), 0);
  }

  hideMenu(): void {
    this.menu.hidden = true;
    this.events.modalChange(this.isModalOpen);
    this.canvas.focus();
  }

  showActivity(id: string, label: string, best: number, onFinished: (score: number) => void): void {
    const copy = activityCopy(id);
    this.activityTitle.textContent = label;
    this.activityText.textContent = copy;
    this.activityResult.textContent = best > 0 ? `Bisheriger Bestwert: ${Math.round(best)}` : 'Noch kein gewerteter Versuch.';
    this.activityResult.dataset.tone = 'neutral';
    this.activityButton.textContent = 'RUNDE STARTEN';
    this.activityButton.dataset.mode = 'play';
    delete this.activityButton.dataset.score;
    this.activityButton.disabled = false;
    this.activityValue = 0;
    this.activityDirection = 1;
    this.activityRunning = false;
    this.activityFinished = onFinished;
    this.activityNeedle.style.transform = 'translateX(0%)';
    this.activity.hidden = false;
    this.events.modalChange(true);
    window.setTimeout(() => this.activityButton.focus(), 0);
  }

  updateMinimap(player: { x: number; z: number }, yaw: number, target: { x: number; z: number } | null): void {
    const context = this.minimapContext;
    const width = this.minimap.width;
    const height = this.minimap.height;
    context.clearRect(0, 0, width, height);
    context.fillStyle = '#243d30';
    context.fillRect(0, 0, width, height);
    const map = (point: PlanPoint): { x: number; y: number } => ({ x: point.x / 2600 * width, y: point.y / 1800 * height });

    for (const polygon of AERIAL_SITE_POLYGONS) {
      context.beginPath();
      polygon.points.forEach((point, index) => {
        const next = map(point);
        if (index === 0) context.moveTo(next.x, next.y);
        else context.lineTo(next.x, next.y);
      });
      context.closePath();
      context.fillStyle = polygon.id.includes('beach') ? '#c7ad70' : polygon.id.includes('arrival') ? '#657169' : '#547b51';
      context.fill();
    }
    for (const polygon of AERIAL_WATER_POLYGONS) {
      context.beginPath();
      polygon.points.forEach((point, index) => {
        const next = map(point);
        if (index === 0) context.moveTo(next.x, next.y);
        else context.lineTo(next.x, next.y);
      });
      context.closePath();
      context.fillStyle = '#2c7187';
      context.fill();
    }
    context.lineCap = 'round';
    for (const road of AERIAL_ROADS) {
      const start = map(AERIAL_NODES[road.from]);
      const end = map(AERIAL_NODES[road.to]);
      context.beginPath();
      context.moveTo(start.x, start.y);
      context.lineTo(end.x, end.y);
      context.strokeStyle = road.surface === 'asphalt' ? '#4a5253' : road.surface === 'sand' ? '#dcc587' : '#a79a79';
      context.lineWidth = Math.max(1, road.width / 2600 * width);
      context.stroke();
    }

    context.fillStyle = 'rgba(255,255,255,.48)';
    for (const npc of Object.values(NPC_PLACEMENTS)) {
      const point = map(npc);
      context.beginPath();
      context.arc(point.x, point.y, 1.6, 0, Math.PI * 2);
      context.fill();
    }

    if (target) {
      const point = map(worldToPlan(target));
      context.strokeStyle = '#ffdc73';
      context.lineWidth = 2.5;
      context.beginPath();
      context.arc(point.x, point.y, 6, 0, Math.PI * 2);
      context.stroke();
    }

    const playerPoint = map(worldToPlan(player));
    context.save();
    context.translate(playerPoint.x, playerPoint.y);
    context.rotate(-yaw);
    context.fillStyle = '#fff4c2';
    context.beginPath();
    context.moveTo(0, -6);
    context.lineTo(4.3, 4.5);
    context.lineTo(-4.3, 4.5);
    context.closePath();
    context.fill();
    context.restore();
  }

  showWebGlFailure(message: string): void {
    this.showDialogue('TECHNISCHER HINWEIS', '3D konnte nicht gestartet werden', message, [
      { label: 'Zum 2D-Hauptspiel', tone: 'primary', action: () => { window.location.href = '../lpc-main/'; } },
    ]);
  }

  private renderInventory(): void {
    this.inventory.replaceChildren();
    for (const item of Object.values(ITEMS).filter((entry) => Boolean(entry.effects))) {
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.item = item.id;
      button.title = `${item.label}: ${item.description}`;
      const icon = document.createElement('span');
      icon.textContent = item.icon;
      const count = document.createElement('b');
      count.textContent = '0';
      button.append(icon, count);
      button.addEventListener('click', () => this.events.useItem(item.id));
      this.inventory.append(button);
    }
  }

  private renderInventoryCounts(inventory: Record<string, number>): void {
    this.inventory.querySelectorAll<HTMLButtonElement>('[data-item]').forEach((button) => {
      const count = inventory[button.dataset.item ?? ''] ?? 0;
      button.disabled = count <= 0;
      const label = button.querySelector('b');
      if (label) label.textContent = String(count);
    });
  }

  private startActivity(): void {
    this.activityRunning = true;
    this.activityValue = Math.random() * 0.22;
    this.activityDirection = 1;
    this.activityButton.textContent = 'JETZT STOPPEN';
    let previous = performance.now();
    const tick = (time: number): void => {
      if (!this.activityRunning) return;
      const delta = Math.min(0.05, (time - previous) / 1000);
      previous = time;
      this.activityValue += this.activityDirection * delta * 0.92;
      if (this.activityValue >= 1) { this.activityValue = 1; this.activityDirection = -1; }
      if (this.activityValue <= 0) { this.activityValue = 0; this.activityDirection = 1; }
      this.activityNeedle.style.transform = `translateX(${this.activityValue * 100}%)`;
      this.activityFrame = requestAnimationFrame(tick);
    };
    this.activityFrame = requestAnimationFrame(tick);
  }

  private stopActivity(): void {
    if (!this.activityRunning) {
      this.startActivity();
      return;
    }
    this.activityRunning = false;
    cancelAnimationFrame(this.activityFrame);
    const distance = Math.abs(this.activityValue - 0.5);
    const score = Math.round(Math.max(0, 100 - distance * 205));
    const success = score >= 58;
    this.activityResult.textContent = success
      ? `${score} Punkte · ${score >= 86 ? 'Perfektes Timing.' : 'Saubere Runde.'}`
      : `${score} Punkte · Der Campingplatz hat schon Schlimmeres gesehen.`;
    this.activityResult.dataset.tone = success ? 'good' : 'warn';
    this.activityButton.textContent = 'ZURÜCK IN DIE WELT';
    this.activityButton.dataset.mode = 'close';
    this.activityButton.dataset.score = String(score);
  }

  private finishActivity(report: boolean, score = 0): void {
    cancelAnimationFrame(this.activityFrame);
    this.activityRunning = false;
    this.activityButton.dataset.mode = 'play';
    delete this.activityButton.dataset.score;
    const finished = this.activityFinished;
    this.activityFinished = null;
    this.activity.hidden = true;
    this.events.modalChange(this.isModalOpen);
    if (report) finished?.(score);
    this.canvas.focus();
  }
}

function shell(): string {
  return `
    <main class="third-person-shell">
      <canvas id="third-person-canvas" tabindex="0" aria-label="3D-Spielwelt"></canvas>
      <div class="world-vignette" aria-hidden="true"></div>
      <div id="mobile-look-zone" class="mobile-look-zone" aria-hidden="true"></div>

      <header class="top-hud">
        <div class="brand-card"><span>TALES OF THE</span><strong>BLAUE ADRIA</strong><small>3D THIRD PERSON · V1</small></div>
        <section class="objective-card" aria-labelledby="objective-title">
          <div><span id="objective-kicker">ANKUNFT</span><b id="objective-distance">—</b></div>
          <h1 id="objective-title">Campingplatz wird geladen</h1>
          <p id="objective-text">Die Schranke sammelt noch Argumente.</p>
        </section>
        <div class="status-card"><strong id="hud-clock">TAG 1 · 07:00</strong><span id="hud-condition">STABIL</span><button id="open-menu" type="button" aria-label="Spielmenü öffnen">☰</button></div>
      </header>

      <aside class="left-hud">
        <section class="needs-card" aria-label="Körperzustand">
          ${meter('energy', 'ENERGIE', '⚡')}
          ${meter('thirst', 'DURST', '💧')}
          ${meter('bladder', 'BLASE', '◉')}
          ${meter('alcohol', 'PEGEL', '🍺')}
        </section>
        <div id="quick-inventory" class="quick-inventory" aria-label="Schnellinventar"></div>
      </aside>

      <aside class="minimap-card">
        <canvas id="minimap" width="280" height="194" aria-label="Karte des Campingplatzes"></canvas>
        <span>KARTE · ANTIPPEN ZUM VERGRÖSSERN</span>
      </aside>

      <div id="interaction-prompt" class="interaction-prompt" hidden>
        <kbd>E</kbd><div><small>INTERAGIEREN</small><strong id="interaction-label">Aktion</strong></div>
      </div>
      <div class="desktop-help"><span>WASD</span> Bewegen <span>MAUSZUG</span> Kamera <span>SHIFT</span> Sprinten <span>E</span> Aktion</div>

      <div class="mobile-controls" aria-label="Mobile Spielsteuerung">
        <div id="mobile-joystick" class="mobile-joystick"><i id="mobile-joystick-knob"></i></div>
        <button id="mobile-sprint" class="mobile-sprint" type="button"><b>↟</b><span>SPRINT</span></button>
        <button id="mobile-action" class="mobile-action" type="button" disabled><b>E</b><span>AKTION</span></button>
      </div>

      <div id="toast" class="toast" role="status"></div>
      <div id="aria-live" class="sr-only" aria-live="polite"></div>

      <section id="start-overlay" class="modal-backdrop start-overlay" role="dialog" aria-modal="true">
        <article class="start-panel">
          <p class="eyebrow">SEPARATER ZWEITER BUILD</p>
          <h2>Die Blaue Adria bekommt Tiefe.</h2>
          <p id="start-copy">Ein eigenständiger 3D-Spielstand beginnt auf dem Parkplatz.</p>
          <ul><li>Third-Person-Kamera und freie Bewegung</li><li>Kanonische Karte, NPCs, Quests und Kollisionen</li><li>Desktop- und Touch-Steuerung</li></ul>
          <button id="start-3d" class="primary" type="button">3D-Wochenende starten</button>
          <div class="start-links"><a href="../lpc-main/">2D-Hauptspiel</a><a href="../">Legacy-Build</a><button id="start-reset" type="button">3D-Spielstand löschen</button></div>
        </article>
      </section>

      <section id="dialog-overlay" class="modal-backdrop" role="dialog" aria-modal="true" hidden>
        <article class="dialog-panel">
          <button id="dialog-close" class="modal-close" type="button" aria-label="Dialog schließen">×</button>
          <p id="dialog-kicker" class="eyebrow">GESPRÄCH</p>
          <h2 id="dialog-title">Titel</h2>
          <p id="dialog-text" class="dialog-copy">Text</p>
          <div id="dialog-choices" class="dialog-choices"></div>
        </article>
      </section>

      <section id="activity-overlay" class="modal-backdrop" role="dialog" aria-modal="true" hidden>
        <article class="activity-panel">
          <button id="activity-close" class="modal-close" type="button" aria-label="Aktivität schließen">×</button>
          <p class="eyebrow">3D-AKTIVITÄT · TIMINGRUNDE</p>
          <h2 id="activity-title">Aktivität</h2>
          <p id="activity-text" class="dialog-copy">Stoppe im goldenen Bereich.</p>
          <div class="timing-track"><span class="target-zone"></span><i id="activity-needle"></i></div>
          <p id="activity-result" class="activity-result">Noch kein Versuch.</p>
          <button id="activity-action" class="primary" type="button">RUNDE STARTEN</button>
        </article>
      </section>

      <section id="menu-overlay" class="modal-backdrop" role="dialog" aria-modal="true" hidden>
        <article class="menu-panel">
          <p class="eyebrow">3D-SPIELMENÜ</p>
          <h2>Kurze Pause, lange Geschichte.</h2>
          <p>Der 3D-Spielstand wird automatisch und getrennt vom 2D-Hauptspiel gespeichert.</p>
          <button id="menu-resume" class="primary" type="button">WEITERSPIELEN</button>
          <a class="menu-link" href="../lpc-main/">Zum vollständigen 2D-Hauptspiel</a>
          <button id="menu-reset" class="danger-link" type="button">3D-Spielstand zurücksetzen</button>
        </article>
      </section>
    </main>`;
}

function meter(id: string, label: string, icon: string): string {
  return `<div class="need-row" data-meter="${id}"><span>${icon}</span><div><small>${label}</small><i><b></b></i></div><strong>0 %</strong></div>`;
}

function setMeter(root: HTMLElement, value: number, label: string, inverse = false): void {
  const normalized = Math.max(0, Math.min(100, value));
  const fill = root.querySelector<HTMLElement>('i b');
  const output = root.querySelector<HTMLElement>('strong');
  if (fill) fill.style.width = `${inverse ? normalized : normalized}%`;
  if (output) output.textContent = label;
  root.dataset.warning = String(inverse ? normalized >= 72 : normalized <= 28);
}

function activityCopy(id: string): string {
  const copy: Record<string, string> = {
    flipCup: 'Stoppe den Marker im goldenen Bereich. Das simuliert den entscheidenden Becherflip der Trainingsrunde.',
    beerPong: 'Timing und Nerven: Stoppe im Zentrum, bevor der Wurf zur Zeugenaussage wird.',
    flunkyball: 'Treffen, trinken, STOPP hören. Für diesen 3D-Slice zählt der entscheidende Timingmoment.',
    maslHole: 'Masls Regel ist simpel, bis Masl sie erklärt. Triff den goldenen Moment.',
    hedge: 'Warte auf das kurze sichere Fenster zwischen Gundulas und Ulis Kontrollblicken.',
    ronnyBattle: 'Unterbrich Ronnys Vortrag genau dann, wenn selbst er Luft holen muss.',
  };
  return copy[id] ?? 'Stoppe den Marker möglichst genau im goldenen Bereich.';
}

function required<T extends Element>(root: ParentNode, selector: string, constructor: { new(...args: never[]): T }): T {
  const element = root.querySelector(selector);
  if (!(element instanceof constructor)) throw new Error(`Required UI element missing: ${selector}`);
  return element;
}

export function targetWorldPosition(objective: QuestObjective): { x: number; z: number } | null {
  if (!objective.targetId) return null;
  const point = NPC_PLACEMENTS[objective.targetId] ?? (objective.targetId === 'campfire' ? { x: 650, y: 1130 } : null);
  return point ? planToWorld(point) : null;
}
