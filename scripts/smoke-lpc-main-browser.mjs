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
    '--headless=new', '--no-sandbox', '--disable-gpu', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage',
    '--disable-background-networking', '--disable-component-update', '--disable-component-extensions-with-background-pages',
    '--disable-default-apps', '--disable-extensions', '--disable-sync',
    '--disable-features=MediaRouter,Translate,OptimizationGuideModelDownloading,OptimizationHints,PushMessaging,Notifications,BackgroundSync,PeriodicBackgroundSync',
    '--no-first-run', '--no-default-browser-check', '--mute-audio',
    `--remote-debugging-port=${debuggingPort}`, `--user-data-dir=${profile}`, pageUrl,
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
    assertState('Campaign', await waitForCampaignState(session, 24000));
    assertState('Codex', await exerciseCodex(session));
    assertState('Weekend arc', await exerciseWeekendArc(session));
    assertState('Minigame', await exerciseMinigames(session));
    const runtimeErrors = stderr.split('\n').filter((line) => /uncaught|referenceerror|typeerror|syntaxerror/i.test(line));
    if (runtimeErrors.length) throw new Error(`Browser runtime exception detected:\n${runtimeErrors.join('\n')}`);
    console.log('LPC campaign browser smoke test passed: world input, eleven-category codex, Friday/Saturday arc, both songs, brawl, Secret Millionaire, mobile controls, minigames and VFX rendered without runtime exceptions.');
  } finally {
    session.close();
  }
} finally {
  browser.kill('SIGKILL');
  server.close();
  rmSync(profile, { recursive: true, force: true });
}

function assertState(label, state) {
  const failed = Object.entries(state).filter(([, value]) => value !== true).map(([key]) => key);
  if (failed.length) throw new Error(`${label} browser smoke state is incomplete: ${failed.join(', ')}. State: ${JSON.stringify(state)}`);
}

async function exerciseCodex(session) {
  const opened = await evaluate(session, `(() => {
    const button = document.querySelector('#open-codex');
    if (!(button instanceof HTMLButtonElement)) return false;
    button.click(); return true;
  })()`);
  if (!opened) return { codexButton: false };
  const visible = await waitForExpression(session, `(() => ({
    codexModal: document.querySelector('#campaign-codex')?.hidden === false,
    elevenCategories: document.querySelectorAll('[data-codex-category]').length === 11,
    categoryEntries: document.querySelectorAll('[data-codex-entry]').length >= 4,
    initialDetail: document.querySelector('#codex-detail')?.textContent?.includes('Spielablauf') ?? false,
    worldInputLocked: document.body.classList.contains('campaign-modal-open')
  }))()`, 9000);
  const search = await evaluate(session, `(() => {
    const input = document.querySelector('#codex-search');
    if (!(input instanceof HTMLInputElement)) return false;
    input.value = 'Secret Millionär'; input.dispatchEvent(new Event('input', { bubbles: true }));
    const first = document.querySelector('[data-codex-entry]');
    if (!(first instanceof HTMLButtonElement)) return false;
    first.click();
    return {
      searchResult: document.querySelectorAll('[data-codex-entry]').length >= 1,
      searchDetail: document.querySelector('#codex-detail')?.textContent?.includes('Secret Millionär') ?? false,
      sourcePathVisible: document.querySelector('#codex-detail')?.textContent?.includes('weekendArc') ?? false
    };
  })()`);
  const closed = await evaluate(session, `(() => {
    document.querySelector('#codex-close')?.click();
    return document.querySelector('#campaign-codex')?.hidden === true
      && !document.body.classList.contains('campaign-codex-open')
      && !document.body.classList.contains('campaign-modal-open');
  })()`);
  return { codexButton: opened === true, ...visible, ...(search || {}), worldInputRestoredAfterCodex: closed === true };
}

async function exerciseWeekendArc(session) {
  const song = await evaluate(session, `(() => {
    const debug = window.__lpcWeekendArcDebug;
    if (!debug) return false;
    debug.showSong();
    const text = document.querySelector('#weekend-arc-content')?.textContent ?? '';
    return {
      arcButton: Boolean(document.querySelector('#open-weekend-arc')),
      arcModal: document.querySelector('#weekend-arc-modal')?.hidden === false,
      farewellSong: text.includes('Es ist vorbei') && text.includes('Masl unsere letzte Chance'),
      fullLyrics: text.includes('Wie kann man mit Bier im Mund schreien?') && text.includes('Bis zwölf ist Zeit'),
      lockedDuringArc: document.body.classList.contains('campaign-modal-open')
    };
  })()`);
  await evaluate(session, `window.__lpcWeekendArcDebug.close()`);

  const brawl = await evaluate(session, `(() => {
    const debug = window.__lpcWeekendArcDebug;
    debug.showBrawl();
    const before = document.querySelectorAll('.brawl-fighter').length;
    document.querySelector('[data-brawl="punch"]')?.click();
    return {
      brawlArena: Boolean(document.querySelector('.brawl-arena')),
      fourFighters: before === 4,
      fourActions: document.querySelectorAll('[data-brawl]').length === 4,
      brawlLog: document.querySelector('.arc-log')?.textContent?.length > 20
    };
  })()`);
  await evaluate(session, `window.__lpcWeekendArcDebug.close()`);

  const secret = await evaluate(session, `(() => {
    const debug = window.__lpcWeekendArcDebug;
    debug.showSecret();
    const firstQuestion = document.querySelector('[data-secret-question]');
    if (firstQuestion instanceof HTMLButtonElement) firstQuestion.click();
    return {
      secretRoster: document.querySelectorAll('.secret-candidate').length === 12,
      secretObservations: document.querySelectorAll('.secret-observations p').length === 3,
      questionButtons: document.querySelectorAll('[data-secret-question]').length === 12,
      accusationButtons: document.querySelectorAll('[data-secret-accuse]').length === 12,
      hiddenRoleNotPrinted: !(document.querySelector('#weekend-arc-content')?.textContent ?? '').includes('masl ist der geheime Millionär')
    };
  })()`);
  const closed = await evaluate(session, `(() => {
    window.__lpcWeekendArcDebug.close();
    return document.querySelector('#weekend-arc-modal')?.hidden === true
      && !document.body.classList.contains('weekend-arc-open')
      && !document.body.classList.contains('campaign-modal-open');
  })()`);
  return { ...(song || {}), ...(brawl || {}), ...(secret || {}), worldInputRestoredAfterArc: closed === true };
}

async function exerciseMinigames(session) {
  await evaluate(session, `(() => {
    const debug = window.__lpcMinigameDebug;
    if (!debug) return false;
    debug.start('beerPong'); debug.begin(); debug.skipCountdown(); return true;
  })()`);
  const pongOpen = await waitForExpression(session, `(() => ({
    pongModal: document.querySelector('#minigame-modal')?.hidden === false,
    visualStage: Boolean(document.querySelector('.minigame-stage')),
    vfxCanvas: Boolean(document.querySelector('.minigame-vfx-canvas')),
    actionEnabled: document.querySelector('[data-mini-action]')?.disabled === false,
    assetFallbackSafe: ['loading','loaded','fallback'].includes(document.querySelector('#minigame-modal')?.dataset.vfxAssets ?? '')
  }))()`, 9000);
  const pongModeLocked = await evaluate(session, `(() => {
    const debug = window.__lpcMinigameDebug;
    debug.setState({ phase: 'flight', mode: 'direct' }); debug.action();
    const state = debug.snapshot(); return state.phase === 'flight' && state.mode === 'direct';
  })()`);
  const flunkyHoldReleased = await evaluate(session, `(() => {
    const debug = window.__lpcMinigameDebug;
    debug.start('flunkyball'); debug.begin(); debug.skipCountdown();
    debug.setState({ phase: 'attack-drink', holding: false }); debug.holdAndRelease(92); debug.action();
    const state = debug.snapshot(); return state.phase === 'attack-drink' && state.holding === false && state.pointerCount === 0;
  })()`);
  const maslActionWorks = await evaluate(session, `(() => {
    const debug = window.__lpcMinigameDebug;
    debug.start('maslHole'); debug.begin(); debug.skipCountdown();
    debug.setState({ phase: 'seal', seal: 1, stableTime: 700 }); debug.action();
    return debug.snapshot().phase === 'pull';
  })()`);
  const cleanup = await evaluate(session, `(() => {
    const debug = window.__lpcMinigameDebug;
    document.body.classList.add('campaign-modal-open'); debug.close();
    const state = debug.snapshot();
    return document.querySelector('#minigame-modal')?.hidden === true
      && state.pointerCount === 0 && state.holding === false && state.pausedClass === false
      && !document.body.classList.contains('campaign-modal-open');
  })()`);
  return { ...pongOpen, pongModeLocked: pongModeLocked === true, flunkyHoldReleased: flunkyHoldReleased === true, maslActionWorks: maslActionWorks === true, worldInputRestored: cleanup === true };
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
    codexModal: Boolean(document.querySelector('#campaign-codex')),
    arcButton: Boolean(document.querySelector('#open-weekend-arc')),
    arcModal: Boolean(document.querySelector('#weekend-arc-modal')),
    arcDebug: Boolean(window.__lpcWeekendArcDebug)
  }))()`;
  while (Date.now() < deadline) {
    latest = await evaluate(session, expression);
    if (Object.values(latest).length === 12 && Object.values(latest).every(Boolean)) return latest;
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
    const entry = pending.get(message.id); pending.delete(message.id);
    if (message.error) entry.reject(new Error(message.error.message)); else entry.resolve(message);
  });
  return {
    command(method, params = {}) {
      return new Promise((resolve, reject) => {
        const id = nextId++;
        const timeout = setTimeout(() => { pending.delete(id); reject(new Error(`DevTools command timed out: ${method}`)); }, 15000);
        pending.set(id, { resolve(value) { clearTimeout(timeout); resolve(value); }, reject(error) { clearTimeout(timeout); reject(error); } });
        socket.send(JSON.stringify({ id, method, params }));
      });
    },
    close() { socket.close(); },
  };
}

function delay(ms) { return new Promise((resolve) => setTimeout(resolve, ms)); }
