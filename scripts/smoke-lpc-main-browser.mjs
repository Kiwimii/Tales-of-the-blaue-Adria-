import { createServer } from 'node:http';
import { createReadStream, existsSync, rmSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { spawn } from 'node:child_process';

const root = join(process.cwd(), 'docs/lpc-main');
if (!existsSync(join(root, 'index.html'))) throw new Error('Build docs/lpc-main is missing.');

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
};
const prefix = '/Tales-of-the-blaue-Adria-/lpc-main/';
const server = createServer((request, response) => {
  const pathname = new URL(request.url ?? '/', 'http://127.0.0.1').pathname;
  const relative = pathname.startsWith(prefix) ? pathname.slice(prefix.length) : pathname.replace(/^\/+/, '');
  const safe = normalize(relative || 'index.html').replace(/^(\.\.[/\\])+/, '');
  const file = join(root, safe);
  if (!file.startsWith(root) || !existsSync(file)) { response.writeHead(404).end('Not found'); return; }
  response.setHeader('content-type', mime[extname(file)] ?? 'application/octet-stream');
  createReadStream(file).pipe(response);
});
await new Promise((resolve) => server.listen(4177, '127.0.0.1', resolve));

const pageUrl = 'http://127.0.0.1:4177/Tales-of-the-blaue-Adria-/lpc-main/?smoke=1';
const debuggingPort = 9327;
const profile = `/tmp/lpc-smoke-${process.pid}`;
rmSync(profile, { recursive: true, force: true });
const candidates = [process.env.CHROME_BIN, 'google-chrome', 'chromium', 'chromium-browser'].filter(Boolean);
let browser;
for (const candidate of candidates) {
  browser = spawn(candidate, [
    '--headless=new',
    '--no-sandbox',
    '--disable-gpu',
    '--enable-unsafe-swiftshader',
    '--disable-dev-shm-usage',
    '--disable-background-networking',
    '--disable-component-update',
    '--disable-component-extensions-with-background-pages',
    '--disable-default-apps',
    '--disable-extensions',
    '--disable-sync',
    '--disable-features=MediaRouter,Translate,OptimizationGuideModelDownloading,OptimizationHints,PushMessaging,Notifications,BackgroundSync,PeriodicBackgroundSync',
    '--no-first-run',
    '--no-default-browser-check',
    '--mute-audio',
    `--remote-debugging-port=${debuggingPort}`,
    `--user-data-dir=${profile}`,
    pageUrl,
  ], { stdio: ['ignore', 'ignore', 'pipe'] });
  const started = await new Promise((resolve) => {
    let settled = false;
    browser.once('spawn', () => { settled = true; resolve(true); });
    browser.once('error', () => { if (!settled) resolve(false); });
  });
  if (started) break;
  browser = undefined;
}
if (!browser) { server.close(); throw new Error('No Chromium-compatible browser found for LPC smoke test.'); }

let stderr = '';
browser.stderr.on('data', (chunk) => { stderr += chunk; });

try {
  const target = await waitForTarget(debuggingPort, pageUrl, 18000);
  const session = await connectDevTools(target.webSocketDebuggerUrl);
  try {
    await session.command('Runtime.enable');
    await session.command('Page.enable');
    const readiness = await waitForCampaignState(session, 22000);
    const missing = Object.entries(readiness).filter(([, value]) => value !== true).map(([key]) => key);
    if (missing.length) throw new Error(`Campaign browser smoke state is incomplete: ${missing.join(', ')}`);

    const codexState = await exerciseCodex(session);
    const codexFailed = Object.entries(codexState).filter(([, value]) => value !== true).map(([key]) => key);
    if (codexFailed.length) throw new Error(`Codex browser smoke state is incomplete: ${codexFailed.join(', ')}. State: ${JSON.stringify(codexState)}`);

    const minigameState = await exerciseMinigames(session);
    const failed = Object.entries(minigameState).filter(([, value]) => value !== true).map(([key]) => key);
    if (failed.length) throw new Error(`Minigame browser smoke state is incomplete: ${failed.join(', ')}. State: ${JSON.stringify(minigameState)}`);

    const runtimeErrors = stderr.split('\n').filter((line) => /uncaught|referenceerror|typeerror|syntaxerror/i.test(line));
    if (runtimeErrors.length) throw new Error(`Browser runtime exception detected:\n${runtimeErrors.join('\n')}`);
    console.log('LPC campaign browser smoke test passed: world input, searchable codex, mobile controls, battles, hardened minigame input and CC0/fallback VFX rendered without runtime exceptions.');
  } finally {
    session.close();
  }
} finally {
  browser.kill('SIGKILL');
  server.close();
  rmSync(profile, { recursive: true, force: true });
}

async function exerciseCodex(session) {
  const opened = await evaluate(session, `(() => {
    const button = document.querySelector('#open-codex');
    if (!(button instanceof HTMLButtonElement)) return false;
    button.click();
    return true;
  })()`);
  if (!opened) return { button: false };

  const visible = await waitForExpression(session, `(() => ({
    modal: document.querySelector('#campaign-codex')?.hidden === false,
    categories: document.querySelectorAll('[data-codex-category]').length === 10,
    entries: document.querySelectorAll('[data-codex-entry]').length >= 4,
    detail: document.querySelector('#codex-detail')?.textContent?.includes('Spielablauf') ?? false,
    locked: document.body.classList.contains('campaign-modal-open')
  }))()`, 9000);

  const search = await evaluate(session, `(() => {
    const input = document.querySelector('#codex-search');
    if (!(input instanceof HTMLInputElement)) return false;
    input.value = 'Beer-Pong-Zwangsduell';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    const first = document.querySelector('[data-codex-entry]');
    if (!(first instanceof HTMLButtonElement)) return false;
    first.click();
    return {
      result: document.querySelectorAll('[data-codex-entry]').length >= 1,
      text: document.querySelector('#codex-detail')?.textContent?.includes('Beer-Pong-Zwangsduell') ?? false,
      source: document.querySelector('#codex-detail')?.textContent?.includes('src/game/combatMoves.ts') ?? false
    };
  })()`);

  const closed = await evaluate(session, `(() => {
    const close = document.querySelector('#codex-close');
    if (!(close instanceof HTMLButtonElement)) return false;
    close.click();
    return document.querySelector('#campaign-codex')?.hidden === true
      && document.body.classList.contains('campaign-codex-open') === false
      && document.body.classList.contains('campaign-modal-open') === false;
  })()`);

  return {
    codexButton: opened === true,
    codexModal: visible.modal === true,
    tenCategories: visible.categories === true,
    categoryEntries: visible.entries === true,
    initialDetail: visible.detail === true,
    worldInputLocked: visible.locked === true,
    searchResult: search?.result === true,
    searchDetail: search?.text === true,
    sourcePathVisible: search?.source === true,
    worldInputRestoredAfterCodex: closed === true,
  };
}

async function exerciseMinigames(session) {
  await evaluate(session, `(() => {
    const debug = window.__lpcMinigameDebug;
    if (!debug) return false;
    debug.start('beerPong');
    debug.begin();
    debug.skipCountdown();
    return true;
  })()`);
  const pongOpen = await waitForExpression(session, `(() => ({
    modal: document.querySelector('#minigame-modal')?.hidden === false,
    stage: Boolean(document.querySelector('.minigame-stage')),
    vfx: Boolean(document.querySelector('.minigame-vfx-canvas')),
    action: document.querySelector('[data-mini-action]')?.disabled === false,
    assets: ['loading','loaded','fallback'].includes(document.querySelector('#minigame-modal')?.dataset.vfxAssets ?? '')
  }))()`, 9000);

  const pongLock = await evaluate(session, `(() => {
    const debug = window.__lpcMinigameDebug;
    debug.setState({ phase: 'flight', mode: 'direct' });
    debug.action();
    const state = debug.snapshot();
    return state.phase === 'flight' && state.mode === 'direct';
  })()`);

  const flunkyRelease = await evaluate(session, `(() => {
    const debug = window.__lpcMinigameDebug;
    debug.start('flunkyball');
    debug.begin();
    debug.skipCountdown();
    debug.setState({ phase: 'attack-drink', holding: false });
    debug.holdAndRelease(92);
    debug.action();
    const state = debug.snapshot();
    return state.phase === 'attack-drink' && state.holding === false && state.pointerCount === 0;
  })()`);

  const maslTransition = await evaluate(session, `(() => {
    const debug = window.__lpcMinigameDebug;
    debug.start('maslHole');
    debug.begin();
    debug.skipCountdown();
    debug.setState({ phase: 'seal', seal: 1, stableTime: 700 });
    debug.action();
    return debug.snapshot().phase === 'pull';
  })()`);

  const cleanup = await evaluate(session, `(() => {
    const debug = window.__lpcMinigameDebug;
    document.body.classList.add('campaign-modal-open');
    debug.close();
    const state = debug.snapshot();
    return document.querySelector('#minigame-modal')?.hidden === true
      && state.pointerCount === 0
      && state.holding === false
      && state.pausedClass === false
      && document.body.classList.contains('campaign-modal-open') === false;
  })()`);

  return {
    pongModal: pongOpen.modal === true,
    visualStage: pongOpen.stage === true,
    vfxCanvas: pongOpen.vfx === true,
    actionEnabled: pongOpen.action === true,
    assetFallbackSafe: pongOpen.assets === true,
    pongModeLocked: pongLock === true,
    flunkyHoldReleased: flunkyRelease === true,
    maslActionWorks: maslTransition === true,
    worldInputRestored: cleanup === true,
  };
}

async function waitForTarget(port, expectedUrl, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/json/list`);
      if (response.ok) {
        const targets = await response.json();
        const page = targets.find((target) => target.type === 'page' && target.url.startsWith(expectedUrl.split('?')[0]));
        if (page?.webSocketDebuggerUrl) return page;
      }
    } catch { /* Chromium is still starting. */ }
    await delay(250);
  }
  throw new Error(`Chromium DevTools target did not become available.\n${stderr.slice(-5000)}`);
}

async function waitForCampaignState(session, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  let latest = {};
  const expression = `(() => ({
    identity: document.body?.innerText.includes('LPC CAMPAIGN') ?? false,
    hud: document.body?.innerText.includes('AKTIVE KAMPAGNENQUEST') ?? false,
    joystick: Boolean(document.querySelector('.mobile-move-zone')),
    battleStage: Boolean(document.querySelector('.cinematic-battle-stage')),
    canvas: Boolean(document.querySelector('canvas')),
    minigameDirector: Boolean(window.__lpcMinigameDebug),
    vfxLayer: Boolean(document.querySelector('.minigame-vfx-canvas')),
    codexButton: Boolean(document.querySelector('#open-codex')),
    codexModal: Boolean(document.querySelector('#campaign-codex'))
  }))()`;
  while (Date.now() < deadline) {
    latest = await evaluate(session, expression);
    if (Object.values(latest).length === 9 && Object.values(latest).every(Boolean)) return latest;
    await delay(300);
  }
  throw new Error(`Campaign DOM was not ready before timeout. State: ${JSON.stringify(latest)}\n${stderr.slice(-5000)}`);
}

async function waitForExpression(session, expression, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  let latest;
  while (Date.now() < deadline) {
    latest = await evaluate(session, expression);
    if (latest && Object.values(latest).every(Boolean)) return latest;
    await delay(160);
  }
  throw new Error(`Browser expression did not become true. State: ${JSON.stringify(latest)}`);
}

async function evaluate(session, expression) {
  const response = await session.command('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (response?.result?.exceptionDetails) throw new Error(`Runtime.evaluate failed: ${response.result.exceptionDetails.text}`);
  return response?.result?.result?.value;
}

async function connectDevTools(url) {
  const socket = new WebSocket(url);
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('DevTools WebSocket connection timed out.')), 8000);
    socket.addEventListener('open', () => { clearTimeout(timeout); resolve(); }, { once: true });
    socket.addEventListener('error', () => { clearTimeout(timeout); reject(new Error('DevTools WebSocket connection failed.')); }, { once: true });
  });
  let nextId = 1;
  const pending = new Map();
  socket.addEventListener('message', (event) => {
    const message = JSON.parse(String(event.data));
    if (!message.id || !pending.has(message.id)) return;
    const entry = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) entry.reject(new Error(message.error.message)); else entry.resolve(message);
  });
  return {
    command(method, params = {}) {
      return new Promise((resolve, reject) => {
        const id = nextId++;
        const timeout = setTimeout(() => { pending.delete(id); reject(new Error(`DevTools command timed out: ${method}`)); }, 15000);
        pending.set(id, {
          resolve(value) { clearTimeout(timeout); resolve(value); },
          reject(error) { clearTimeout(timeout); reject(error); },
        });
        socket.send(JSON.stringify({ id, method, params }));
      });
    },
    close() { socket.close(); },
  };
}

function delay(ms) { return new Promise((resolve) => setTimeout(resolve, ms)); }
