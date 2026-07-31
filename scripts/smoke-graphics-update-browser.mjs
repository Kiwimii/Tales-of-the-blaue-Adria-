import { createServer } from 'node:http';
import { createReadStream, existsSync, rmSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { spawn } from 'node:child_process';

const root = join(process.cwd(), 'docs/lpc-main');
if (!existsSync(join(root, 'index.html'))) throw new Error('Build docs/lpc-main is missing.');
const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.png': 'image/png', '.svg': 'image/svg+xml' };
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
await new Promise((resolve) => server.listen(4179, '127.0.0.1', resolve));

const pageUrl = 'http://127.0.0.1:4179/Tales-of-the-blaue-Adria-/lpc-main/?smoke=1';
const debuggingPort = 9329;
const profile = `/tmp/lpc-graphics-smoke-${process.pid}`;
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
if (!browser) { server.close(); throw new Error('No Chromium-compatible browser found for graphics smoke test.'); }
let stderr = '';
browser.stderr.on('data', (chunk) => { stderr += chunk; });

try {
  const target = await waitForTarget(debuggingPort, pageUrl, 18000);
  const session = await connectDevTools(target.webSocketDebuggerUrl);
  try {
    await session.command('Runtime.enable');
    await session.command('Page.enable');
    assertState('Graphics runtime', await waitForExpression(session, `(() => ({
      campaign: Boolean(document.querySelector('#campaign-game')),
      weekendDebug: Boolean(window.__lpcWeekendArcDebug),
      minigameDebug: Boolean(window.__lpcMinigameDebug),
      graphicsRuntime: Boolean(window.__talesGraphicsUpdateV3),
      graphicsClass: document.documentElement.classList.contains('graphics-update-v3-active'),
      version: window.__talesGraphicsUpdateV3?.version === '3.0.0'
    }))()`, 24000));

    await evaluate(session, `(() => {
      window.__lpcWeekendArcDebug.showBrawl();
      window.__talesGraphicsUpdateV3.setActiveTeam(['masl','felix','danny','rene','susi']);
      window.__talesGraphicsUpdateV3.force();
    })()`);
    const brawl = await waitForExpression(session, `(() => ({
      arena: document.querySelector('.brawl-arena')?.classList.contains('graphics-v3-brawl') ?? false,
      fourCharacterFigures: document.querySelectorAll('.brawl-fighter .graphics-v3-character').length === 4,
      supportTeam: document.querySelectorAll('.graphics-v3-support-member').length === 4,
      supportNames: ['Felix','Danny','René','Susi'].every((name) => document.querySelector('.graphics-v3-support-row')?.textContent?.includes(name)),
      gate: Boolean(document.querySelector('.graphics-v3-gate')),
      crowd: document.querySelectorAll('.graphics-v3-crowd span').length >= 3
    }))()`, 10000);
    assertState('Brawl graphics', brawl);
    await evaluate(session, `window.__lpcWeekendArcDebug.close()`);

    await evaluate(session, `window.__talesGraphicsUpdateV3.startMinigame('hedgePee', ['danny','felix','rene','lars'])`);
    const hedge = await waitForExpression(session, `(() => {
      const guards = [...document.querySelectorAll('.graphics-v3-patrol')].map((node) => node.className);
      const opacity = Number.parseFloat(getComputedStyle(document.querySelector('.minigame-vfx-canvas')).opacity);
      return {
        hedgeScene: Boolean(document.querySelector('.graphics-v3-scene-hedgePee')),
        twoPatrols: guards.length === 2,
        gundula: guards.some((name) => name.includes('gundula')),
        uli: guards.some((name) => name.includes('uli')),
        visionCones: document.querySelectorAll('.graphics-v3-vision-cone').length === 2,
        hedgeCover: Boolean(document.querySelector('.graphics-v3-hedge-wall')),
        abstractLightReduced: opacity <= .2
      };
    })()`, 10000);
    assertState('Hedge patrol graphics', hedge);

    for (const [game, selector] of [['flipCup','.graphics-v3-table.flip'],['beerPong','.graphics-v3-table.pong'],['flunkyball','.graphics-v3-flunky-lane'],['maslHole','.graphics-v3-hole']]) {
      await evaluate(session, `window.__talesGraphicsUpdateV3.startMinigame('${game}', ['felix','danny','rene','lars'])`);
      const state = await waitForExpression(session, `(() => ({
        scene: Boolean(document.querySelector('.graphics-v3-scene-${game}')),
        prop: Boolean(document.querySelector('${selector}')),
        cast: document.querySelectorAll('.graphics-v3-cast-member').length >= 4,
        release: document.querySelector('.minigame-stage')?.dataset.graphicsRelease === '3.0.0'
      }))()`, 9000);
      assertState(`${game} graphics`, state);
    }

    const cleanup = await evaluate(session, `(() => {
      window.__lpcMinigameDebug.close();
      return document.querySelector('#minigame-modal')?.hidden === true
        && !document.body.classList.contains('campaign-modal-open');
    })()`);
    if (!cleanup) throw new Error('Graphics smoke test did not restore world input.');
    const runtimeErrors = stderr.split('\n').filter((line) => /uncaught|referenceerror|typeerror|syntaxerror/i.test(line));
    if (runtimeErrors.length) throw new Error(`Browser runtime exception detected:\n${runtimeErrors.join('\n')}`);
    console.log('Graphics Update V3 browser smoke test passed: dynamic brawl team, four fighter sprites, crowd, all five minigame scenes and Gundula/Uli hedge patrols are operational.');
  } finally {
    session.close();
  }
} finally {
  browser.kill('SIGKILL');
  server.close();
  rmSync(profile, { recursive: true, force: true });
}

function assertState(label, state) {
  const failed = Object.entries(state ?? {}).filter(([, value]) => value !== true).map(([key]) => key);
  if (failed.length) throw new Error(`${label} browser smoke state is incomplete: ${failed.join(', ')}. State: ${JSON.stringify(state)}`);
}
async function waitForTarget(port, expectedUrl, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/json/list`);
      if (response.ok) {
        const targets = await response.json();
        const page = targets.find((entry) => entry.type === 'page' && entry.url.startsWith(expectedUrl.split('?')[0]));
        if (page?.webSocketDebuggerUrl) return page;
      }
    } catch { }
    await delay(250);
  }
  throw new Error(`Chromium DevTools target did not become available.\n${stderr.slice(-5000)}`);
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
