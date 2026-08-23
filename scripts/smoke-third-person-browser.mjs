import { createReadStream, existsSync, rmSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';
import { spawn } from 'node:child_process';

const root = join(process.cwd(), 'docs/third-person');
if (!existsSync(join(root, 'index.html'))) throw new Error('Build docs/third-person is missing.');
const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml' };
const prefix = '/Tales-of-the-blaue-Adria-/third-person/';
const server = createServer((request, response) => {
  const pathname = new URL(request.url ?? '/', 'http://127.0.0.1').pathname;
  const relative = pathname.startsWith(prefix) ? pathname.slice(prefix.length) : pathname.replace(/^\/+/, '');
  const safe = normalize(relative || 'index.html').replace(/^(\.\.[/\\])+/, '');
  const file = join(root, safe);
  if (!file.startsWith(root) || !existsSync(file)) { response.writeHead(404).end('Not found'); return; }
  response.setHeader('content-type', mime[extname(file)] ?? 'application/octet-stream');
  createReadStream(file).pipe(response);
});
await new Promise((resolve) => server.listen(4183, '127.0.0.1', resolve));

const pageUrl = 'http://127.0.0.1:4183/Tales-of-the-blaue-Adria-/third-person/?smoke=1';
const debuggingPort = 9333;
const profile = `/tmp/adria-third-person-smoke-${process.pid}`;
rmSync(profile, { recursive: true, force: true });
const candidates = [process.env.CHROME_BIN, 'google-chrome', 'chromium', 'chromium-browser'].filter(Boolean);
let browser;
for (const candidate of candidates) {
  browser = spawn(candidate, [
    '--headless=new', '--no-sandbox', '--disable-gpu', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage',
    '--disable-background-networking', '--disable-background-timer-throttling', '--disable-renderer-backgrounding',
    '--disable-backgrounding-occluded-windows', '--disable-component-update', '--disable-extensions', '--disable-sync',
    '--disable-features=MediaRouter,Translate,OptimizationGuideModelDownloading,OptimizationHints,PushMessaging,Notifications,BackgroundSync,PeriodicBackgroundSync',
    '--no-first-run', '--no-default-browser-check', '--mute-audio', '--window-size=1440,900',
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
if (!browser) { server.close(); throw new Error('No Chromium-compatible browser found for third-person smoke test.'); }

let stderr = '';
browser.stderr.on('data', (chunk) => { stderr += chunk; });

try {
  const target = await waitForTarget(debuggingPort, pageUrl, 18000);
  const session = await connectDevTools(target.webSocketDebuggerUrl);
  try {
    await session.command('Runtime.enable');
    await session.command('Page.enable');
    await session.command('Page.bringToFront');
    await waitFor(session, `Boolean(window.__talesThirdPerson?.step)`, 24000, Boolean);
    await evaluate(session, `window.__talesThirdPerson.step(2)`);
    const initial = await waitFor(session, `(() => window.__talesThirdPerson?.snapshot?.())()`, 24000, (state) => (
      state?.objective === 'trunk' && state.npcCount >= 16 && state.interactionCount >= 19 && state.renderCalls > 0 && state.triangles > 0 && !state.contextLost
    ));
    assert(initial.startVisible, 'Start overlay must be visible before beginning.');
    assert(!initial.legacySaveTouched, 'Third-person bootstrap must not write the 2D save key.');

    await evaluate(session, `window.__talesThirdPerson.start()`);
    await waitFor(session, `window.__talesThirdPerson.snapshot()`, 5000, (state) => state.started && !state.modalOpen);
    const screenshot = await session.command('Page.captureScreenshot', { format: 'png' });
    assert((screenshot?.result?.data?.length ?? 0) > 20000, 'Rendered 3D screenshot is unexpectedly empty.');

    for (const expected of ['reservationBoard', 'gundula', 'taucherplatz']) {
      const teleported = await evaluate(session, `window.__talesThirdPerson.teleportObjective()`);
      assert(teleported, 'Could not teleport to the active quest objective.');
      await evaluate(session, `window.__talesThirdPerson.action()`);
      await waitFor(session, `Boolean(document.querySelector('#dialog-overlay:not([hidden]) .dialog-choice'))`, 3000, Boolean);
      await evaluate(session, `document.querySelector('#dialog-overlay .dialog-choice.primary')?.click()`);
      await waitFor(session, `window.__talesThirdPerson.snapshot()`, 4000, (state) => state.objective === expected);
    }

    const gate = await evaluate(session, `window.__talesThirdPerson.snapshot()`);
    assert(gate.gateOpen && gate.questIndex === 3, `Arrival gate did not open after authority step: ${JSON.stringify(gate)}`);

    await evaluate(session, `window.__talesThirdPerson.teleportPlan(800,1500)`);
    const before = await evaluate(session, `window.__talesThirdPerson.snapshot().player`);
    await evaluate(session, `window.dispatchEvent(new KeyboardEvent('keydown',{code:'KeyW'}))`);
    await evaluate(session, `window.__talesThirdPerson.step(30)`);
    await evaluate(session, `window.dispatchEvent(new KeyboardEvent('keyup',{code:'KeyW'}))`);
    const after = await evaluate(session, `window.__talesThirdPerson.snapshot().player`);
    assert(Math.hypot(after.x - before.x, after.z - before.z) > 0.3, 'Keyboard movement did not move the 3D player.');

    await evaluate(session, `window.__talesThirdPerson.persist()`);
    const saved = await evaluate(session, `window.__talesThirdPerson.snapshot()`);
    assert(saved.progressSaved && saved.gameSaved && !saved.legacySaveTouched, `Separated saves are incomplete: ${JSON.stringify(saved)}`);
    const runtimeErrors = stderr.split('\n').filter((line) => /uncaught|referenceerror|typeerror|syntaxerror/i.test(line));
    if (runtimeErrors.length) throw new Error(`Third-person browser runtime exception detected:\n${runtimeErrors.join('\n')}`);
    console.log('Third-person browser smoke passed: WebGL rendered, start flow worked, three arrival objectives advanced, the gate opened, keyboard movement worked and saves stayed isolated.');
  } finally {
    session.close();
  }
} finally {
  browser.kill('SIGKILL');
  server.close();
  rmSync(profile, { recursive: true, force: true });
}

async function waitForTarget(port, url, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/json/list`);
      const targets = await response.json();
      const target = targets.find((entry) => entry.type === 'page' && entry.url.startsWith(url));
      if (target) return target;
    } catch { /* browser is still starting */ }
    await delay(180);
  }
  throw new Error(`Third-person DevTools target did not appear.\n${stderr.slice(-4000)}`);
}

async function connectDevTools(url) {
  const socket = new WebSocket(url);
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('DevTools connection timed out.')), 8000);
    socket.addEventListener('open', () => { clearTimeout(timeout); resolve(); }, { once: true });
    socket.addEventListener('error', () => { clearTimeout(timeout); reject(new Error('DevTools connection failed.')); }, { once: true });
  });
  let nextId = 1;
  const pending = new Map();
  socket.addEventListener('message', (event) => {
    const message = JSON.parse(String(event.data));
    if (!message.id || !pending.has(message.id)) return;
    const entry = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) entry.reject(new Error(message.error.message));
    else entry.resolve(message);
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

async function evaluate(session, expression) {
  const response = await session.command('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (response?.result?.exceptionDetails) throw new Error(`Runtime.evaluate failed: ${response.result.exceptionDetails.text}`);
  return response?.result?.result?.value;
}

async function waitFor(session, expression, timeoutMs, predicate) {
  const deadline = Date.now() + timeoutMs;
  let latest;
  while (Date.now() < deadline) {
    latest = await evaluate(session, expression);
    if (predicate(latest)) return latest;
    await delay(160);
  }
  throw new Error(`Browser condition timed out. State: ${JSON.stringify(latest)}\n${stderr.slice(-4000)}`);
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function delay(ms) { return new Promise((resolve) => setTimeout(resolve, ms)); }
