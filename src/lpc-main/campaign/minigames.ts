export type MiniGameId = 'flipCup' | 'beerPong' | 'flunkyball' | 'hedgePee' | 'maslHole';
export interface MiniGameOutcome {
  id: MiniGameId;
  success: boolean;
  score: number;
  quality: 'perfect' | 'solid' | 'messy' | 'failed';
  text: string;
  needs?: Partial<Record<'energy' | 'thirst' | 'bladder' | 'alcohol' | 'highness' | 'courage', number>>;
  suspicion?: number;
  relief?: number;
}
interface Point { x: number; y: number; }
interface Runtime {
  id: MiniGameId;
  running: boolean;
  start: number;
  last: number;
  raf: number;
  state: Record<string, any>;
  pointers: Map<number, Point>;
  cleanup: Array<() => void>;
}
const TITLES: Record<MiniGameId, string> = {
  flipCup: 'Flip Cup · Staffel gegen den Kontrollverlust',
  beerPong: 'Beer Pong · Flugbahn, Risiko und Blickkontakt',
  flunkyball: 'Flunkyball · Werfen, trinken, retten, STOPP',
  hedgePee: 'In die Hecke · Deckung, Blickkegel und Strahlrichtung',
  maslHole: 'Komm ans Loch · Masls beidhändige Spezialtechnik',
};

export class MinigameDirector {
  private runtime?: Runtime;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private title: HTMLElement;
  private copy: HTMLElement;
  private hint: HTMLElement;
  private action: HTMLButtonElement;
  private close: HTMLButtonElement;
  private result: HTMLElement;

  constructor(private readonly root: HTMLElement, private readonly onOutcome: (outcome: MiniGameOutcome) => void) {
    this.canvas = requireElement<HTMLCanvasElement>(root, 'canvas');
    const context = this.canvas.getContext('2d'); if (!context) throw new Error('Minigame canvas context unavailable');
    this.ctx = context; this.title = requireElement(root, '[data-mini-title]'); this.copy = requireElement(root, '[data-mini-copy]'); this.hint = requireElement(root, '[data-mini-hint]'); this.action = requireElement<HTMLButtonElement>(root, '[data-mini-action]'); this.close = requireElement<HTMLButtonElement>(root, '[data-mini-close]'); this.result = requireElement(root, '[data-mini-result]');
    this.action.addEventListener('click', () => this.primaryAction()); this.close.addEventListener('click', () => this.stop());
  }

  start(id: MiniGameId): void {
    this.stop(false); this.root.hidden = false; this.title.textContent = TITLES[id]; this.result.hidden = true; this.result.textContent = ''; this.action.disabled = false; this.canvas.width = 900; this.canvas.height = 430;
    this.runtime = { id, running: true, start: performance.now(), last: performance.now(), raf: 0, state: {}, pointers: new Map(), cleanup: [] };
    if (id === 'flipCup') this.setupFlipCup();
    if (id === 'beerPong') this.setupBeerPong();
    if (id === 'flunkyball') this.setupFlunkyball();
    if (id === 'hedgePee') this.setupHedgePee();
    if (id === 'maslHole') this.setupMaslHole();
    this.runtime.raf = requestAnimationFrame((time) => this.tick(time));
  }
  stop(hide = true): void { if (this.runtime) { cancelAnimationFrame(this.runtime.raf); this.runtime.cleanup.forEach((cleanup) => cleanup()); } this.runtime = undefined; if (hide) this.root.hidden = true; }

  private setupFlipCup(): void {
    Object.assign(this.runtime!.state, { phase: 'drink', runner: 0, liquid: 1, holding: false, overhang: .5, cupX: .5, cupY: .69, cupVx: 0, cupVy: 0, rotation: 0, angular: 0, opponent: 0, mistakes: 0, perfects: 0, gestureStart: null });
    this.copy.textContent = 'Vier Freunde treten als Staffel an: Becher leeren, an die Tischkante setzen und mit einem echten Wischimpuls auf den Kopf flippen. Fehlversuche kosten Zeit, nicht sofort das Match.';
    this.hint.textContent = 'HALTEN zum Leeren · Becher an die Kante ziehen · kräftig nach oben wischen.'; this.action.textContent = 'HALTEN: TRINKEN';
    this.bindCanvasGestures(); this.bindHoldAction('holding');
  }

  private setupBeerPong(): void {
    Object.assign(this.runtime!.state, { phase: 'ready', mode: 'direct', cups: pongCups(), hits: 0, misses: 0, opponentHits: 0, opponentClock: 0, dragStart: null, dragNow: null, ball: null, bounced: false, reracks: 0, lastShotBounce: false });
    this.copy.textContent = 'Zehn Becher, freie Wurfphysik und ein sichtbarer Gegner. Ziehe den Ball zurück und lasse los. Direkte Würfe sind sicherer; Bounce-Würfe können zwei Becher entfernen, dürfen aber abgewehrt werden.';
    this.hint.textContent = 'Auf den Ball drücken, zurückziehen, loslassen. AKTION wechselt zwischen DIREKT und BOUNCE.'; this.action.textContent = 'WURFART: DIREKT';
    this.bindCanvasGestures();
  }

  private setupFlunkyball(): void {
    Object.assign(this.runtime!.state, { phase: 'attack-throw', round: 1, teamDrink: 0, enemyDrink: 0, dragStart: null, dragNow: null, throwBall: null, holding: false, defender: 0, foul: false, runnerX: .1, runnerY: .77, targetX: .5, targetY: .55, bottleUp: false, ballHeld: false, defenseBallX: .75, defenseBallY: .58, stopQuality: 0, attackHits: 0 });
    this.copy.textContent = 'Das echte Mannschaftsduell: Flasche treffen, trinken, während die Gegenseite Ball und Flasche rettet – danach selbst zur Mitte sprinten, aufstellen, Ball holen, zurücklaufen und STOPP rufen.';
    this.hint.textContent = 'Angriff: Ball ziehen und werfen. Nach Treffer AKTION halten zum Trinken. Verteidigung: auf dem Feld ziehen, an Objekten AKTION drücken.'; this.action.textContent = 'BALL WERFEN';
    this.bindCanvasGestures(); this.bindHoldAction('holding');
  }

  private setupHedgePee(): void {
    Object.assign(this.runtime!.state, { phase: 'choose', spot: -1, progress: 0, suspicion: 0, holding: false, aim: .5, observerA: 0, observerB: 1, wind: 0, evidence: 0, interruptions: 0 });
    this.copy.textContent = 'Wähle eine Stelle mit eigenem Verhältnis aus Weg, Deckung und sozialem Risiko. Während der Erleichterung müssen Blickkegel gemieden und die Strahlrichtung innerhalb der Hecke gehalten werden.';
    this.hint.textContent = 'Erst eine Stelle antippen. Danach AKTION halten und mit dem Finger auf dem Feld die Richtung korrigieren.'; this.action.textContent = 'STELLE WÄHLEN';
    this.bindCanvasGestures(); this.bindHoldAction('holding');
  }

  private setupMaslHole(): void {
    Object.assign(this.runtime!.state, { phase: 'seal', round: 1, left: { x: .34, y: .55 }, right: { x: .66, y: .55 }, jointX: .5, jointY: .35, seal: 0, pull: 0, cough: 0, holding: false, score: 0, leaks: 0, activeHand: 'left' });
    this.copy.textContent = 'Der Joint liegt zwischen den Händen. Zwei Finger bewegen beide Hände, bis ein dichter Hohlraum und ein kleines Loch entstehen. Danach wird gezogen, ohne die Abdichtung zu verlieren oder das Hustenrisiko zu überziehen.';
    this.hint.textContent = 'Zwei Finger: Hände gleichzeitig führen. Maus: linke/rechte Hand nacheinander ziehen. Bei guter Abdichtung AKTION halten und rechtzeitig loslassen.'; this.action.textContent = 'HÄNDE ABDICHTEN';
    this.bindCanvasGestures(); this.bindHoldAction('holding');
  }

  private bindCanvasGestures(): void {
    const down = (event: PointerEvent): void => { event.preventDefault(); const p = this.point(event); this.runtime?.pointers.set(event.pointerId, p); this.canvas.setPointerCapture(event.pointerId); this.pointerDown(p, event.pointerId); };
    const move = (event: PointerEvent): void => { if (!this.runtime?.pointers.has(event.pointerId)) return; const p = this.point(event); this.runtime.pointers.set(event.pointerId, p); this.pointerMove(p, event.pointerId); };
    const up = (event: PointerEvent): void => { const p = this.point(event); this.pointerUp(p, event.pointerId); this.runtime?.pointers.delete(event.pointerId); };
    this.canvas.addEventListener('pointerdown', down); this.canvas.addEventListener('pointermove', move); this.canvas.addEventListener('pointerup', up); this.canvas.addEventListener('pointercancel', up);
    this.runtime!.cleanup.push(() => this.canvas.removeEventListener('pointerdown', down), () => this.canvas.removeEventListener('pointermove', move), () => this.canvas.removeEventListener('pointerup', up), () => this.canvas.removeEventListener('pointercancel', up));
  }
  private bindHoldAction(key: string): void {
    const down = (event?: Event): void => { event?.preventDefault(); if (this.runtime) this.runtime.state[key] = true; };
    const up = (): void => { if (this.runtime) this.runtime.state[key] = false; };
    this.action.addEventListener('pointerdown', down); this.action.addEventListener('pointerup', up); this.action.addEventListener('pointerleave', up);
    const kd = (event: KeyboardEvent): void => { if (event.code === 'Space') down(event); }; const ku = (event: KeyboardEvent): void => { if (event.code === 'Space') up(); };
    window.addEventListener('keydown', kd); window.addEventListener('keyup', ku);
    this.runtime!.cleanup.push(() => this.action.removeEventListener('pointerdown', down), () => this.action.removeEventListener('pointerup', up), () => this.action.removeEventListener('pointerleave', up), () => window.removeEventListener('keydown', kd), () => window.removeEventListener('keyup', ku));
  }

  private pointerDown(p: Point, pointerId: number): void {
    const r = this.runtime; if (!r?.running) return; const s = r.state;
    if (r.id === 'flipCup') { if (s.phase === 'place') s.overhang = clamp(p.x, .35, .68); if (s.phase === 'flip') s.gestureStart = p; }
    if (r.id === 'beerPong' && s.phase === 'ready' && distance(p.x, p.y, .5, .88) < .12) { s.dragStart = p; s.dragNow = p; }
    if (r.id === 'flunkyball') {
      if (s.phase === 'attack-throw') { s.dragStart = p; s.dragNow = p; }
      else if (String(s.phase).startsWith('defense')) { s.targetX = p.x; s.targetY = p.y; }
    }
    if (r.id === 'hedgePee') {
      if (s.phase === 'choose') this.chooseHedgeSpot(p.x);
      else s.aim = clamp(p.x, .12, .88);
    }
    if (r.id === 'maslHole') { this.assignMaslHand(pointerId, p); }
  }
  private pointerMove(p: Point, pointerId: number): void {
    const r = this.runtime; if (!r?.running) return; const s = r.state;
    if (r.id === 'flipCup' && s.phase === 'place') s.overhang = clamp(p.x, .35, .68);
    if (r.id === 'beerPong' && s.dragStart) s.dragNow = p;
    if (r.id === 'flunkyball') { if (s.phase === 'attack-throw' && s.dragStart) s.dragNow = p; else if (String(s.phase).startsWith('defense')) { s.targetX = p.x; s.targetY = p.y; } }
    if (r.id === 'hedgePee' && s.phase === 'active') s.aim = clamp(p.x, .12, .88);
    if (r.id === 'maslHole') this.moveMaslHand(pointerId, p);
  }
  private pointerUp(p: Point, pointerId: number): void {
    const r = this.runtime; if (!r?.running) return; const s = r.state;
    if (r.id === 'flipCup') {
      if (s.phase === 'place') { s.phase = 'flip'; s.cupX = s.overhang; this.hint.textContent = 'Jetzt vom Becherrand kräftig nach oben wischen.'; this.action.textContent = 'WISCHEN'; }
      else if (s.phase === 'flip' && s.gestureStart) { const dx = p.x - s.gestureStart.x; const dy = p.y - s.gestureStart.y; s.cupVx = dx * 1.8; s.cupVy = Math.min(-.48, dy * 2.2); s.angular = clamp(-dy * 18 + dx * 5, 4, 13); s.phase = 'flight'; s.gestureStart = null; }
    }
    if (r.id === 'beerPong' && s.dragStart) this.launchPong(p);
    if (r.id === 'flunkyball' && s.phase === 'attack-throw' && s.dragStart) this.launchFlunky(p);
    if (r.id === 'maslHole') { r.pointers.delete(pointerId); }
  }

  private primaryAction(): void {
    const r = this.runtime; if (!r?.running) return; const s = r.state;
    if (r.id === 'flipCup') { if (s.phase === 'drink' && s.liquid <= .02) this.startFlipPlacement(); else if (s.phase === 'place') { s.phase = 'flip'; s.cupX = s.overhang; } }
    if (r.id === 'beerPong') { s.mode = s.mode === 'direct' ? 'bounce' : 'direct'; this.action.textContent = `WURFART: ${String(s.mode).toUpperCase()}`; }
    if (r.id === 'flunkyball') this.flunkyAction();
    if (r.id === 'hedgePee' && s.phase === 'choose') this.chooseHedgeSpot(.5);
    if (r.id === 'maslHole' && s.phase === 'seal' && s.seal >= .64) { s.phase = 'pull'; this.action.textContent = 'HALTEN: ZIEHEN'; }
  }

  private tick(time: number): void {
    const r = this.runtime; if (!r?.running) return; const delta = Math.min(40, time - r.last); r.last = time;
    if (r.id === 'flipCup') this.tickFlip(delta);
    if (r.id === 'beerPong') this.tickPong(delta);
    if (r.id === 'flunkyball') this.tickFlunky(delta);
    if (r.id === 'hedgePee') this.tickHedge(delta);
    if (r.id === 'maslHole') this.tickMasl(delta);
    this.draw(r); r.raf = requestAnimationFrame((next) => this.tick(next));
  }

  private tickFlip(delta: number): void {
    const s = this.runtime!.state;
    s.opponent += delta * (.000032 + s.runner * .0000025);
    if (s.opponent >= 4) return this.finish({ id: 'flipCup', success: false, score: Math.max(0, Math.round(s.runner * 22 - s.mistakes * 4)), quality: 'failed', text: 'Die Gegenseite beendet ihre Staffel. Euer letzter Becher befindet sich noch in einem offenen Rechtsstreit mit der Schwerkraft.', needs: { alcohol: 8, bladder: 6 } });
    if (s.phase === 'drink' && s.holding) { s.liquid = Math.max(0, s.liquid - delta * .00075); if (s.liquid <= .02) this.startFlipPlacement(); }
    if (s.phase === 'flight') {
      s.cupVy += delta * .0009; s.cupX += s.cupVx * delta * .001; s.cupY += s.cupVy * delta * .001; s.rotation += s.angular * delta * .001;
      if (s.cupY >= .69) {
        const normalized = Math.abs(((s.rotation % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2) - Math.PI);
        const landed = normalized < .48 && s.cupX > .17 && s.cupX < .83;
        if (landed) this.completeFlip(normalized < .17); else { s.mistakes += 1; s.phase = 'place'; s.cupY = .69; s.rotation = 0; s.cupVx = 0; s.cupVy = 0; this.hint.textContent = 'Nicht gelandet. Becher erneut an die Kante setzen – der Gegner wartet nicht.'; }
      }
    }
  }
  private startFlipPlacement(): void { const s = this.runtime!.state; s.phase = 'place'; s.holding = false; this.action.textContent = 'BECHER PLATZIEREN'; this.hint.textContent = 'Becher horizontal an die Tischkante ziehen. Der Überstand bestimmt die Flipkontrolle.'; }
  private completeFlip(perfect: boolean): void {
    const s = this.runtime!.state; s.runner += 1; s.perfects += perfect ? 1 : 0;
    if (s.runner >= 4) { const score = Math.round(100 - s.opponent * 12 - s.mistakes * 7 + s.perfects * 8); this.finish({ id: 'flipCup', success: true, score, quality: s.perfects >= 3 && s.mistakes === 0 ? 'perfect' : s.mistakes <= 2 ? 'solid' : 'messy', text: s.perfects >= 3 && s.mistakes === 0 ? 'Vier Leute, vier Becher, fast ein gemeinsames Nervensystem. Die Staffel wird sofort zur übertriebenen Lagerlegende.' : 'Die Staffel gewinnt. Nicht elegant, aber vor der Gegenseite – und nur das steht auf dem imaginären Pokal.', needs: { alcohol: 14, bladder: 10, courage: 7 } }); return; }
    Object.assign(s, { phase: 'drink', liquid: 1, cupX: .5, cupY: .69, rotation: 0, angular: 0, cupVx: 0, cupVy: 0 }); this.action.textContent = 'HALTEN: TRINKEN'; this.hint.textContent = `${['André','René','Lars','Danny'][s.runner]} ist dran. Halten zum Leeren.`;
  }

  private launchPong(end: Point): void {
    const s = this.runtime!.state; const start = s.dragStart as Point; const dx = start.x - end.x; const dy = start.y - end.y;
    if (Math.hypot(dx, dy) < .045) { s.dragStart = null; return; }
    s.ball = { x: .5, y: .88, vx: dx * 1.35, vy: dy * 1.5 - .35, life: 0 }; s.bounced = false; s.lastShotBounce = s.mode === 'bounce'; s.phase = 'flight'; s.dragStart = null; s.dragNow = null;
  }
  private tickPong(delta: number): void {
    const s = this.runtime!.state; s.opponentClock += delta;
    if (s.opponentClock > 4900 && s.phase !== 'flight') { s.opponentClock = 0; s.opponentHits += Math.random() < .68 ? 1 : 0; if (s.opponentHits >= 6) return this.finish({ id: 'beerPong', success: false, score: Math.round(s.hits * 14 - s.misses * 3), quality: 'failed', text: 'Die Gegenseite räumt sechs Becher ab. Der Tisch war nicht schief genug, um das vollständig zu erklären.', needs: { alcohol: 8, bladder: 5 } }); }
    const ball = s.ball; if (!ball) return;
    const dt = delta / 1000; ball.life += dt; ball.vy += 1.35 * dt; ball.x += ball.vx * dt; ball.y += ball.vy * dt;
    if (s.mode === 'bounce' && !s.bounced && ball.y >= .58 && ball.vy > 0) { s.bounced = true; ball.y = .58; ball.vy *= -.58; ball.vx *= .9; if (Math.random() < .22) { s.ball = null; s.phase = 'ready'; s.misses += 1; this.hint.textContent = 'Bounce abgewehrt. Risiko hatte diesmal nur dramaturgischen Wert.'; return; } }
    const cups = s.cups.filter((cup: any) => cup.active);
    const hit = cups.find((cup: any) => distance(ball.x, ball.y, cup.x, cup.y) < .055 && ball.vy > 0);
    if (hit) {
      hit.active = false; s.hits += 1; const second = s.lastShotBounce ? cups.find((cup: any) => cup.active && cup !== hit) : undefined; if (second) { second.active = false; s.hits += 1; }
      s.ball = null; s.phase = 'ready'; this.hint.textContent = s.lastShotBounce ? 'BOUNCE: zwei Becher entfernt. Unnötig riskant, deshalb besonders wirksam.' : 'Direkter Treffer. Nächsten Becher lesen und erneut werfen.'; this.autoRerack();
      if (s.hits >= 6) { const score = Math.round(75 + (6 - s.misses) * 7 + (s.lastShotBounce ? 12 : 0)); this.finish({ id: 'beerPong', success: true, score, quality: s.misses === 0 && s.lastShotBounce ? 'perfect' : s.misses <= 2 ? 'solid' : 'messy', text: s.misses === 0 && s.lastShotBounce ? 'Sechs Becher, kein Fehlschuss und der letzte über Bande. Felix nennt es Physik; alle anderen nennen es verdächtig.' : 'Die Becher sind leergeräumt. Der Blickkontakt war optional, die Geschichte darüber nicht.', needs: { alcohol: 10, bladder: 6, courage: 5 } }); }
      return;
    }
    if (ball.y > 1.05 || ball.x < -.1 || ball.x > 1.1 || ball.life > 3) { s.ball = null; s.phase = 'ready'; s.misses += 1; this.hint.textContent = 'Daneben. Ziehrichtung und Kraft lagen in unterschiedlichen Bundesländern.'; }
  }
  private autoRerack(): void { const s = this.runtime!.state; const remaining = s.cups.filter((cup: any) => cup.active); if (![6,3,1].includes(remaining.length)) return; s.reracks += 1; const layouts = remaining.length === 6 ? pongCups().slice(0,6) : remaining.length === 3 ? [{x:.5,y:.27},{x:.455,y:.35},{x:.545,y:.35}] : [{x:.5,y:.31}]; remaining.forEach((cup: any, i: number) => { cup.x = layouts[i].x; cup.y = layouts[i].y; }); }

  private launchFlunky(end: Point): void {
    const s = this.runtime!.state; const start = s.dragStart as Point; const dx = start.x - end.x; const dy = start.y - end.y; s.dragStart = null; s.dragNow = null;
    const accuracy = Math.hypot((dx - .02) * .8, dy - .38); const hit = accuracy < .2;
    if (hit) { s.attackHits += 1; s.phase = 'attack-drink'; s.defender = 0; s.foul = false; this.action.textContent = 'HALTEN: TRINKEN'; this.hint.textContent = 'Treffer. Halten zum Trinken – aber beim Stoppruf sofort loslassen.'; }
    else { this.hint.textContent = 'Flasche verfehlt. Jetzt verteidigen: zur Mitte, Flasche aufstellen, Ball holen, zurück.'; this.startDefense(); }
  }
  private tickFlunky(delta: number): void {
    const s = this.runtime!.state;
    if (s.phase === 'attack-drink') {
      s.defender = Math.min(1, s.defender + delta * .00022); if (s.holding) s.teamDrink = Math.min(100, s.teamDrink + delta * .0027);
      if (s.defender >= 1) { if (s.holding) { s.foul = true; s.teamDrink = Math.max(0, s.teamDrink - 12); this.hint.textContent = 'FOUL: Nach STOPP weitergetrunken. Zwölf Prozent werden zurückgerechnet.'; } this.endFlunkyRound(); }
    } else if (String(s.phase).startsWith('defense')) {
      const dx = s.targetX - s.runnerX; const dy = s.targetY - s.runnerY; const len = Math.hypot(dx, dy); if (len > .01) { s.runnerX += dx / len * delta * .00022; s.runnerY += dy / len * delta * .00022; }
      s.enemyDrink = Math.min(100, s.enemyDrink + delta * .00145);
      if (s.enemyDrink >= 100) return this.finish({ id: 'flunkyball', success: false, score: Math.round(s.teamDrink), quality: 'failed', text: 'Die Gegenseite leert ihre Flaschen, während euer Ball noch eine eigene Reisebeschreibung verdient.', needs: { energy: -15, thirst: 10, alcohol: 8 } });
    }
  }
  private flunkyAction(): void {
    const s = this.runtime!.state;
    if (s.phase === 'defense-run' && distance(s.runnerX,s.runnerY,.5,.55)<.11) { s.bottleUp = true; s.phase='defense-ball'; this.hint.textContent='Flasche steht. Jetzt zum Ball laufen und AKTION drücken.'; }
    else if (s.phase === 'defense-ball' && distance(s.runnerX,s.runnerY,s.defenseBallX,s.defenseBallY)<.11) { s.ballHeld=true; s.phase='defense-return'; s.targetX=.1; s.targetY=.77; this.hint.textContent='Ball aufgenommen. Zur Linie zurück und STOPP rufen.'; }
    else if (s.phase === 'defense-return' && s.runnerX<.17) { s.stopQuality=Math.max(s.stopQuality, Math.round((100-s.enemyDrink)*.6)); this.hint.textContent='STOPP rechtzeitig gerufen. Nächste Angriffsrunde.'; this.endFlunkyRound(); }
  }
  private startDefense(): void { const s=this.runtime!.state; Object.assign(s,{phase:'defense-run',runnerX:.1,runnerY:.77,targetX:.5,targetY:.55,bottleUp:false,ballHeld:false,defenseBallX:.66+Math.random()*.2,defenseBallY:.48+Math.random()*.18}); this.action.textContent='AUFSTELLEN / AUFHEBEN / STOPP'; }
  private endFlunkyRound(): void {
    const s=this.runtime!.state; s.round+=1; s.holding=false;
    if(s.teamDrink>=100){const quality=s.attackHits>=3&&!s.foul&&s.stopQuality>=25?'perfect':s.attackHits>=2?'solid':'messy';return this.finish({id:'flunkyball',success:true,score:Math.round(100+s.attackHits*12+s.stopQuality-(s.foul?15:0)),quality,text:quality==='perfect'?'Flasche getroffen, defensiv sauber gerettet und STOPP exakt an der Linie. Kurz sieht es wie organisierter Sport aus.':'Eure Flaschen sind leer. Der Weg dorthin war körperlich, taktisch und juristisch nicht vollständig sauber.',needs:{energy:-22,thirst:14,alcohol:14,bladder:8,courage:8}})}
    if(s.round>7)return this.finish({id:'flunkyball',success:s.teamDrink>s.enemyDrink,score:Math.round(s.teamDrink-s.enemyDrink+70),quality:s.teamDrink>s.enemyDrink?'messy':'failed',text:s.teamDrink>s.enemyDrink?'Zeitentscheidung. Ihr gewinnt knapp, hauptsächlich weil beide Seiten inzwischen Regeln erfinden.':'Zeitentscheidung verloren. Die Gegenseite war minimal organisierter.',needs:{energy:-20,thirst:12,alcohol:10}});
    Object.assign(s,{phase:'attack-throw',dragStart:null,dragNow:null});this.action.textContent='BALL WERFEN';this.hint.textContent=`Runde ${s.round}: Ball zurückziehen und auf die Mittelflasche werfen.`;
  }

  private chooseHedgeSpot(x:number):void{const s=this.runtime!.state;const index=x<.33?0:x>.67?2:1;s.spot=index;s.phase='active';s.aim=[.27,.5,.74][index];this.action.textContent='HALTEN: BRUNSEN';this.hint.textContent=['Naher Busch: kurze Aktion, aber kaum Deckung.','Tiefe Hecke: gute Deckung, bewegliche Äste.','Hinter dem Taucherzelt: sicher vor Uli, sozial riskant.'][index];}
  private tickHedge(delta:number):void{const s=this.runtime!.state;if(s.phase!=='active')return;s.observerA=(s.observerA+delta*.00009)%1;s.observerB=(s.observerB-delta*.000065+1)%1;s.wind=Math.sin(performance.now()/900)*.07;const spotX=[.27,.5,.74][s.spot];const viewA=Math.abs(s.observerA-spotX)<.13;const viewB=Math.abs(s.observerB-spotX)<.1;const stream=s.aim+s.wind*(.4+s.progress/100);const inHedge=Math.abs(stream-spotX)<([.11,.16,.13][s.spot]);if(s.holding){s.progress=Math.min(100,s.progress+delta*([.0032,.0024,.0027][s.spot]));const danger=(viewA?1:0)+(viewB?1:0)+(!inHedge?1:0);s.suspicion=Math.min(100,s.suspicion+delta*.012*danger);if(!inHedge)s.evidence+=delta*.003;}else{s.suspicion=Math.max(0,s.suspicion-delta*.0015);s.interruptions+=delta*.00002;}if(s.suspicion>=100)return this.finish({id:'hedgePee',success:false,score:Math.round(s.progress-s.evidence),quality:'failed',text:'Taschenlampe, Blickkontakt und eine ungünstige Strahlrichtung ergeben gemeinsam ein sehr belastbares Heckenprotokoll.',suspicion:32,relief:s.progress>=70?1:0,needs:{bladder:-Math.round(s.progress),courage:-8}});if(s.progress>=100){const perfect=s.suspicion<14&&s.evidence<8;return this.finish({id:'hedgePee',success:true,score:Math.round(110-s.suspicion-s.evidence),quality:perfect?'perfect':s.suspicion<40?'solid':'messy',text:perfect?'Erleichtert, unentdeckt und ohne sichtbaren Beweis. Die Hecke schweigt aus freien Stücken.':'Die Sache ist erledigt. Ein paar Blätter kennen die Wahrheit, aber sie haben keine Aussagegenehmigung.',suspicion:Math.round(s.suspicion*.25),relief:1,needs:{bladder:-100,courage:5}})}}

  private assignMaslHand(pointerId:number,p:Point):void{const s=this.runtime!.state;const hand=this.runtime!.pointers.size>=2?(p.x<.5?'left':'right'):(distance(p.x,p.y,s.left.x,s.left.y)<distance(p.x,p.y,s.right.x,s.right.y)?'left':'right');s[`pointer-${pointerId}`]=hand;s.activeHand=hand;this.moveMaslHand(pointerId,p)}
  private moveMaslHand(pointerId:number,p:Point):void{const s=this.runtime!.state;const hand=s[`pointer-${pointerId}`]??s.activeHand;s[hand]={x:clamp(p.x,hand==='left'?.18:.51,hand==='left'?.49:.82),y:clamp(p.y,.38,.72)};}
  private tickMasl(delta:number):void{const s=this.runtime!.state;const gap=s.right.x-s.left.x;const level=Math.abs(s.left.y-s.right.y);const center=(s.left.x+s.right.x)/2;const alignment=Math.abs(center-s.jointX);s.seal=clamp(1-Math.abs(gap-.22)*4-level*3-alignment*3,0,1);if(s.phase==='seal'&&s.seal>=.64){this.action.textContent='ABDICHTUNG OK · STARTEN';this.hint.textContent='Loch stabil. AKTION drücken, dann halten. Hände während des Zugs weiter korrigieren.';}if(s.phase==='pull'&&s.holding){s.pull=Math.min(100,s.pull+delta*.0032*s.seal);s.cough=Math.min(100,s.cough+delta*.0014*(1.35-s.seal)+(s.pull>76?delta*.0022:0));if(s.seal<.42)s.leaks+=delta*.004;if(s.cough>=100)this.completeMaslPull(false);}else if(s.phase==='pull'&&!s.holding&&s.pull>12)this.completeMaslPull(s.pull>=48&&s.pull<=82&&s.seal>=.55)}
  private completeMaslPull(good:boolean):void{const s=this.runtime!.state;const points=good?Math.round(70+s.seal*25-Math.abs(66-s.pull)*.5-s.leaks):Math.max(5,Math.round(s.pull*.25-s.leaks));s.score+=points;if(!good)s.cough=Math.min(100,s.cough+18);if(s.round>=3){const success=s.score>=175;const quality=success&&s.score>=255&&s.cough<55?'perfect':success?'solid':s.score>=120?'messy':'failed';this.finish({id:'maslHole',success,score:s.score,quality,text:quality==='perfect'?'Drei dichte Züge, das Loch blieb stabil und Masl nickt exakt einmal. Mehr Anerkennung ist organisatorisch nicht vorgesehen.':success?'Die Technik wirkt. Masl erkennt mehrere Momente echter Abdichtung an.':'Wirkung vorhanden, aber ein erheblicher Teil des Rauchs führte ein eigenständiges Außenleben.',needs:{highness:success?42:20,energy:-8,courage:success?6:1}});return}s.round+=1;Object.assign(s,{phase:'seal',pull:0,cough:Math.max(0,s.cough-8),leaks:0,left:{x:.32+Math.random()*.04,y:.53+Math.random()*.05},right:{x:.64+Math.random()*.04,y:.53+Math.random()*.05}});this.action.textContent='HÄNDE ABDICHTEN';this.hint.textContent=`Zug ${s.round}/3: Beide Hände erneut stabil um das Loch führen.`;}

  private draw(runtime:Runtime):void{const c=this.ctx,w=this.canvas.width,h=this.canvas.height;c.clearRect(0,0,w,h);c.fillStyle='#17382f';c.fillRect(0,0,w,h);if(runtime.id==='flipCup')drawFlip(c,w,h,runtime.state);if(runtime.id==='beerPong')drawPong(c,w,h,runtime.state);if(runtime.id==='flunkyball')drawFlunky(c,w,h,runtime.state);if(runtime.id==='hedgePee')drawHedge(c,w,h,runtime.state);if(runtime.id==='maslHole')drawMasl(c,w,h,runtime.state)}
  private finish(outcome:MiniGameOutcome):void{const r=this.runtime;if(!r?.running)return;r.running=false;cancelAnimationFrame(r.raf);this.action.disabled=true;this.result.hidden=false;this.result.innerHTML=`<strong>${outcome.success?outcome.quality==='perfect'?'LEGENDÄR':outcome.quality==='messy'?'CHAOTISCH GESCHAFFT':'GESCHAFFT':'GESCHEITERT'}</strong><p>${escapeHtml(outcome.text)}</p><small>Wert ${Math.round(outcome.score)} · Qualität ${outcome.quality}</small>`;this.onOutcome(outcome)}
  private point(event:PointerEvent):Point{const rect=this.canvas.getBoundingClientRect();return{x:clamp((event.clientX-rect.left)/rect.width,0,1),y:clamp((event.clientY-rect.top)/rect.height,0,1)}}
}

function drawFlip(c:CanvasRenderingContext2D,w:number,h:number,s:any):void{c.fillStyle='#162f38';c.fillRect(0,0,w,h);c.fillStyle='#70452e';c.fillRect(70,h*.69,w-140,80);c.fillStyle='#fff1c4';c.font='700 21px system-ui';c.fillText(`Euer Team ${s.runner}/4 · Gegner ${Math.min(4,s.opponent).toFixed(1)}/4 · Fehler ${s.mistakes}`,35,34);for(let i=0;i<4;i++){c.fillStyle=i<s.runner?'#79c992':i===s.runner?'#e6b94e':'#8f5148';c.beginPath();c.arc(230+i*145,130,30,0,Math.PI*2);c.fill();c.fillStyle='#fff';c.font='700 13px system-ui';c.fillText(['André','René','Lars','Danny'][i],205+i*145,180)}const x=s.cupX*w,y=s.cupY*h;c.save();c.translate(x,y);c.rotate(s.rotation);c.fillStyle='#d6534c';c.beginPath();c.moveTo(-28,-58);c.lineTo(28,-58);c.lineTo(22,0);c.lineTo(-22,0);c.closePath();c.fill();if(s.phase==='drink'){c.fillStyle='#e6c052';c.fillRect(-20,-48,40,Math.max(0,42*s.liquid))}c.restore();c.fillStyle='#d8c16f';c.fillRect(w*.35,h*.66,w*.33,5)}
function drawPong(c:CanvasRenderingContext2D,w:number,h:number,s:any):void{c.fillStyle='#172937';c.fillRect(0,0,w,h);c.fillStyle='#7c3b31';roundRect(c,110,50,w-220,h-100,28);c.fill();c.strokeStyle='#e9b660';c.lineWidth=5;c.stroke();for(const cup of s.cups){if(!cup.active)continue;c.fillStyle='#d34d59';c.beginPath();c.arc(cup.x*w,cup.y*h,23,0,Math.PI*2);c.fill();c.strokeStyle='#fff2d8';c.lineWidth=3;c.stroke()}const ball=s.ball??{x:.5,y:.88};c.fillStyle='#f5f0d9';c.beginPath();c.arc(ball.x*w,ball.y*h,10,0,Math.PI*2);c.fill();if(s.dragStart&&s.dragNow){c.strokeStyle='#76d8c0';c.lineWidth=4;c.beginPath();c.moveTo(s.dragStart.x*w,s.dragStart.y*h);c.lineTo(s.dragNow.x*w,s.dragNow.y*h);c.stroke()}c.fillStyle='#fff1c4';c.font='700 19px system-ui';c.fillText(`Treffer ${s.hits}/6 · Gegner ${s.opponentHits}/6 · Fehlwürfe ${s.misses} · ${String(s.mode).toUpperCase()}`,25,30)}
function drawFlunky(c:CanvasRenderingContext2D,w:number,h:number,s:any):void{c.fillStyle='#79a7ad';c.fillRect(0,0,w,h*.48);c.fillStyle='#d4bd82';c.fillRect(0,h*.48,w,h*.52);c.fillStyle='#e6d890';c.fillRect(w*.485,h*.44,30,90);c.fillStyle='#e6524a';c.fillRect(w*.485,h*.55,30,10);c.fillStyle='#fff1c4';c.font='700 19px system-ui';c.fillText(`Runde ${s.round} · Ihr ${Math.round(s.teamDrink)}% · Gegner ${Math.round(s.enemyDrink)}% · ${String(s.phase).toUpperCase()}`,24,30);c.fillStyle='#e5a84e';c.beginPath();c.arc(s.runnerX*w,s.runnerY*h,18,0,Math.PI*2);c.fill();c.fillStyle='#f2eee0';c.beginPath();c.arc(s.defenseBallX*w,s.defenseBallY*h,9,0,Math.PI*2);c.fill();if(s.dragStart&&s.dragNow){c.strokeStyle='#2d665b';c.lineWidth=5;c.beginPath();c.moveTo(s.dragStart.x*w,s.dragStart.y*h);c.lineTo(s.dragNow.x*w,s.dragNow.y*h);c.stroke()}drawBar(c,25,h-55,w*.38,18,s.teamDrink/100,'EUER GETRÄNK');drawBar(c,w*.57,h-55,w*.38,18,s.enemyDrink/100,'GEGNER')}
function drawHedge(c:CanvasRenderingContext2D,w:number,h:number,s:any):void{c.fillStyle='#0f241d';c.fillRect(0,0,w,h);c.fillStyle='#2f6a40';c.fillRect(70,170,w-140,170);for(let x=80;x<w-70;x+=38){c.fillStyle=x%76?'#397b49':'#2b613b';c.beginPath();c.arc(x,175,48,0,Math.PI*2);c.fill()}const spots=[.27,.5,.74];for(let i=0;i<3;i++){c.strokeStyle=i===s.spot?'#f0c75b':'rgba(255,255,255,.35)';c.lineWidth=4;c.strokeRect(spots[i]*w-55,210,110,95);c.fillStyle='#fff1c4';c.font='700 12px system-ui';c.fillText(['NAH','TIEF','ZELT'][i],spots[i]*w-18,325)}const ax=s.observerA*w,bx=s.observerB*w;c.fillStyle='rgba(239,197,93,.16)';c.beginPath();c.moveTo(ax,85);c.lineTo(ax-110,210);c.lineTo(ax+110,210);c.fill();c.fillStyle='rgba(117,185,210,.13)';c.beginPath();c.moveTo(bx,110);c.lineTo(bx-90,230);c.lineTo(bx+90,230);c.fill();c.fillStyle='#d4b455';c.fillRect(ax-12,55,24,42);c.fillStyle='#76a9c0';c.fillRect(bx-12,80,24,42);if(s.phase==='active'){const spot=spots[s.spot];c.strokeStyle='#e4cf5c';c.lineWidth=5;c.beginPath();c.moveTo(spot*w,350);c.quadraticCurveTo(s.aim*w,300,(s.aim+s.wind)*w,235);c.stroke()}drawBar(c,35,380,w*.42,18,s.progress/100,'ERLEICHTERUNG');drawBar(c,w*.54,380,w*.42,18,s.suspicion/100,'VERDACHT')}
function drawMasl(c:CanvasRenderingContext2D,w:number,h:number,s:any):void{c.fillStyle='#17282a';c.fillRect(0,0,w,h);const hand=(p:any,left:boolean)=>{c.fillStyle='#d8a17d';roundRect(c,p.x*w-105,p.y*h-70,210,140,62);c.fill();c.fillStyle='#9f7058';roundRect(c,p.x*w+(left?45:-75),p.y*h-55,30,105,14);c.fill()};hand(s.left,true);hand(s.right,false);c.fillStyle='#f1e4c4';roundRect(c,s.jointX*w-62,s.jointY*h-6,124,12,5);c.fill();c.fillStyle='#7f4a2e';c.fillRect(s.jointX*w+48,s.jointY*h-6,14,12);const center=(s.left.x+s.right.x)/2;c.fillStyle='#07120f';c.beginPath();c.arc(center*w,(s.left.y+s.right.y)/2*h,18+22*(1-s.seal),0,Math.PI*2);c.fill();c.strokeStyle=s.seal>.64?'#80d5a2':'#df7b63';c.lineWidth=5;c.stroke();drawBar(c,35,355,w*.28,16,s.seal,'ABDICHTUNG');drawBar(c,w*.36,355,w*.28,16,s.pull/100,'WIRKUNG');drawBar(c,w*.67,355,w*.28,16,s.cough/100,'HUSTEN');c.fillStyle='#fff1c4';c.font='700 18px system-ui';c.fillText(`Zug ${s.round}/3 · Wert ${s.score}`,35,32)}
function drawBar(c:CanvasRenderingContext2D,x:number,y:number,w:number,h:number,value:number,label:string):void{c.fillStyle='#071611';roundRect(c,x,y,w,h,8);c.fill();c.fillStyle=value>.78?'#df6e58':'#79c992';roundRect(c,x+2,y+2,Math.max(0,(w-4)*clamp(value,0,1)),h-4,6);c.fill();c.fillStyle='#fff1c4';c.font='700 10px system-ui';c.fillText(label,x,y-6)}
function pongCups():any[]{return[{x:.5,y:.22},{x:.455,y:.29},{x:.545,y:.29},{x:.41,y:.36},{x:.5,y:.36},{x:.59,y:.36},{x:.365,y:.43},{x:.455,y:.43},{x:.545,y:.43},{x:.635,y:.43}].map((p)=>({...p,active:true}))}
function roundRect(c:CanvasRenderingContext2D,x:number,y:number,w:number,h:number,r:number):void{c.beginPath();c.roundRect(x,y,w,h,r)}
function distance(ax:number,ay:number,bx:number,by:number):number{return Math.hypot(ax-bx,ay-by)}
function clamp(value:number,min:number,max:number):number{return Math.max(min,Math.min(max,value))}
function escapeHtml(value:string):string{return value.replace(/[&<>'"]/g,(character)=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[character]??character))}
function requireElement<T extends Element=HTMLElement>(root:ParentNode,selector:string):T{const node=root.querySelector(selector);if(!node)throw new Error(`Missing minigame element: ${selector}`);return node as T}
