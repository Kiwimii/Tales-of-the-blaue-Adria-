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
await new Promise((resolve) => server.listen(4179, '127.0.0.1', resolve));

const pageUrl = 'http://127.0.0.1:4179/Tales-of-the-blaue-Adria-/lpc-main/?smoke=1';
const debuggingPort = 9329;
const profile = `/tmp/lpc-pong-smoke-${process.pid}`;
rmSync(profile, { recursive: true, force: true });
const candidates = [process.env.CHROME_BIN, 'google-chrome', 'chromium', 'chromium-browser'].filter(Boolean);
let browser;
for (const candidate of candidates) {
  browser = spawn(candidate, [
    '--headless=new', '--no-sandbox', '--disable-gpu', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage',
    '--disable-background-networking', '--disable-component-update', '--disable-extensions', '--disable-sync',
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
if (!browser) { server.close(); throw new Error('No Chromium-compatible browser found for Beer Pong smoke test.'); }

let stderr = '';
browser.stderr.on('data', (chunk) => { stderr += chunk; });
try {
  const target = await waitForTarget(debuggingPort, pageUrl, 18000);
  const session = await connectDevTools(target.webSocketDebuggerUrl);
  try {
    await session.command('Runtime.enable');
    await session.command('Page.enable');
    await waitForExpression(session, `Boolean(window.__lpcMinigameDebug && document.querySelector('#minigame-modal canvas'))`, 24000);

    await evaluate(session, `(() => {
      const debug = window.__lpcMinigameDebug;
      debug.start('beerPong');
      debug.begin();
      debug.skipCountdown();
      return true;
    })()`);

    const initial = await waitForExpression(session, `(() => {
      const root = document.querySelector('#minigame-modal');
      const state = window.__lpcMinigameDebug.snapshot();
      const oldLayer = root?.querySelector('.graphics-v3-minigame-layer');
      return {
        rebuilt: root?.classList.contains('beer-pong-rebuild-active') ?? false,
        version: root?.dataset.beerPongVersion === 'beer-pong-perspective-v4',
        perspectiveTitle: (document.querySelector('[data-mini-title]')?.textContent ?? '').includes('Perspektivisches Tischduell'),
        tenOpponentCups: state.opponentCups === 10,
        tenPlayerCups: state.playerCups === 10,
        playerTurn: state.phase === 'ready',
        oldOverlayHidden: !oldLayer || getComputedStyle(oldLayer).display === 'none'
      };
    })()`, 9000);
    assertState('Beer Pong initial perspective', initial);

    const aiming = await evaluate(session, `(() => {
      const preview = Array.from({ length: 34 }, (_, index) => {
        const progress = index / 33;
        return {
          x: .5,
          depth: progress * .965,
          height: Math.sin(Math.PI * progress) * .22,
          progress,
          bounced: false
        };
      });
      window.__lpcMinigameDebug.setState({
        phase: 'aiming', mode: 'direct', dragNow: { x: .5, y: .995 }, preview
      });
      const state = window.__lpcMinigameDebug.snapshot();
      return {
        aiming: state.phase === 'aiming',
        trajectory: state.preview?.length >= 30,
        direct: state.mode === 'direct'
      };
    })()`);
    assertState('Beer Pong aiming', aiming);

    await evaluate(session, `(() => {
      window.__lpcMinigameDebug.setState({
        phase: 'flight', mode: 'direct', running: true, paused: false, countdown: 0,
        plan: { mode: 'direct', targetX: .5, range: .965, power: .8, duration: 180 },
        ball: { x: .5, depth: 0, height: 0, progress: 0, bounced: false },
        flightElapsed: 0, blockChecked: false, preview: [], dragNow: undefined
      });
      return true;
    })()`);
    const directHit = await waitForExpression(session, `(() => {
      const state = window.__lpcMinigameDebug.snapshot();
      return {
        hit: state.hits >= 1,
        cupRemoved: state.opponentCups === 9,
        extraTurn: state.phase === 'ready',
        mode: state.mode === 'direct'
      };
    })()`, 5000);
    assertState('Direct hit and extra turn', directHit);

    await evaluate(session, `document.querySelector('[data-mini-action]')?.click()`);
    const bounceMode = await evaluate(session, `window.__lpcMinigameDebug.snapshot().mode === 'bounce'`);
    if (!bounceMode) throw new Error('Bounce mode did not activate.');

    await evaluate(session, `(() => {
      Math.random = () => .99;
      window.__beerPongOutcome = null;
      window.addEventListener('lpc-campaign-minigame-outcome', (event) => {
        if (event.detail?.id === 'beerPong') window.__beerPongOutcome = event.detail;
      }, { once: true });
      window.__lpcMinigameDebug.setState({
        phase: 'flight', mode: 'bounce', running: true, paused: false, countdown: 0,
        cups: [
          { id: 90, x: .5, depth: .855, active: true },
          { id: 91, x: .55, depth: .86, active: true }
        ],
        hits: 8, playerCups: 10,
        plan: { mode: 'bounce', targetX: .5, range: .855, power: .8, duration: 180 },
        ball: { x: .5, depth: 0, height: 0, progress: 0, bounced: false },
        flightElapsed: 0, blockChecked: false, preview: [], dragNow: undefined
      });
      return true;
    })()`);
    const bounceWin = await waitForExpression(session, `(() => {
      const state = window.__lpcMinigameDebug.snapshot();
      return {
        finished: state.phase === 'finished',
        twoRemoved: state.opponentCups === 0,
        bounceRecorded: state.bounceHits >= 1,
        won: window.__beerPongOutcome?.success === true,
        resultVisible: document.querySelector('[data-mini-result]')?.hidden === false
      };
    })()`, 6000);
    assertState('Bounce double removal and victory', bounceWin);

    await evaluate(session, `window.__lpcMinigameDebug.close()`);
    const cleanup = await evaluate(session, `(() => ({
      modalClosed: document.querySelector('#minigame-modal')?.hidden === true,
      classRemoved: !document.querySelector('#minigame-modal')?.classList.contains('beer-pong-rebuild-active'),
      inputRestored: !document.body.classList.contains('campaign-modal-open')
    }))()`);
    assertState('Beer Pong cleanup', cleanup);

    const runtimeErrors = stderr.split('\n').filter((line) => /uncaught|referenceerror|typeerror|syntaxerror/i.test(line));
    if (runtimeErrors.length) throw new Error(`Browser runtime exception detected:\n${runtimeErrors.join('\n')}`);
    console.log('Beer Pong browser smoke passed: perspective table, trajectory state, direct-hit extra turn, bounce double removal, victory and cleanup are operational.');
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
  if (failed.length) throw new Error(`${label} incomplete: ${failed.join(', ')}. State: ${JSON.stringify(state)}`);
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
    if (typeof latest === 'boolean' ? latest : latest && Object.values(latest).every(Boolean)) return latest;
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
        pending.set(id, {
          resolve(value) { clearTimeout(timeout); resolve(value); },
          reject(error) { clearTimeout(timeout); reject(error); }
        });
        socket.send(JSON.stringify({ id, method, params }));
      });
    },
    close() { socket.close(); },
  };
}
function delay(ms) { return new Promise((resolve) => setTimeout(resolve, ms)); }
