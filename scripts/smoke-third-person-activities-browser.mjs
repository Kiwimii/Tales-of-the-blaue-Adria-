import { createReadStream, existsSync, rmSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';
import { spawn } from 'node:child_process';

const root = join(process.cwd(), 'docs/third-person');
if (!existsSync(join(root, 'index.html'))) throw new Error('Build docs/third-person is missing.');
const prefix = '/Tales-of-the-blaue-Adria-/third-person/';
const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml' };
const server = createServer((request, response) => {
  const pathname = new URL(request.url ?? '/', 'http://127.0.0.1').pathname;
  const relative = pathname.startsWith(prefix) ? pathname.slice(prefix.length) : pathname.replace(/^\/+/, '');
  const safe = normalize(relative || 'index.html').replace(/^(\.\.[/\\])+/, '');
  const file = join(root, safe);
  if (!file.startsWith(root) || !existsSync(file)) { response.writeHead(404).end('Not found'); return; }
  response.setHeader('content-type', mime[extname(file)] ?? 'application/octet-stream');
  createReadStream(file).pipe(response);
});
await new Promise((resolve) => server.listen(4184, '127.0.0.1', resolve));

const pageUrl = 'http://127.0.0.1:4184/Tales-of-the-blaue-Adria-/third-person/?smoke=1&quality=low';
const debuggingPort = 9334;
const profile = `/tmp/adria-third-person-activity-smoke-${process.pid}`;
rmSync(profile, { recursive: true, force: true });
const candidates = [process.env.CHROME_BIN, 'google-chrome', 'chromium', 'chromium-browser'].filter(Boolean);
let browser;
for (const candidate of candidates) {
  browser = spawn(candidate, [
    '--headless=new', '--no-sandbox', '--disable-gpu', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage',
    '--disable-background-networking', '--disable-background-timer-throttling', '--disable-renderer-backgrounding',
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
if (!browser) { server.close(); throw new Error('No Chromium-compatible browser found for 3D activity smoke test.'); }
let stderr = '';
browser.stderr.on('data', (chunk) => { stderr += chunk; });

try {
  const target = await waitForTarget(debuggingPort, pageUrl, 18000);
  const session = await connect(target.webSocketDebuggerUrl);
  try {
    await session.command('Runtime.enable');
    await session.command('Page.enable');
    await waitFor(session, `Boolean(window.__talesThirdPerson?.step && window.__talesActivity3D?.snapshot)`, 24000, Boolean);
    await evaluate(session, `window.__talesThirdPerson.step(2)`);
    await evaluate(session, `window.__talesThirdPerson.start()`);

    for (const expected of ['reservationBoard', 'gundula', 'taucherplatz']) {
      assert(await evaluate(session, `window.__talesThirdPerson.teleportObjective()`), 'Could not teleport to active objective.');
      await evaluate(session, `window.__talesThirdPerson.action()`);
      await waitFor(session, `Boolean(document.querySelector('#dialog-overlay:not([hidden]) .dialog-choice'))`, 3000, Boolean);
      await evaluate(session, `document.querySelector('#dialog-overlay .dialog-choice.primary')?.click()`);
      await waitFor(session, `window.__talesThirdPerson.snapshot()`, 4000, (state) => state.objective === expected);
    }

    await evaluate(session, `window.__talesThirdPerson.teleportPlan(1690,700)`);
    await evaluate(session, `window.__talesThirdPerson.action()`);
    const pong = await waitFor(session, `window.__talesActivity3D.snapshot()`, 5000, (state) => state?.id === 'beerPong' && state.visible && state.renderCalls > 0 && state.triangles > 0 && !state.contextLost);
    assert(pong.sceneObjects >= 10, `Beer Pong 3D scene is unexpectedly sparse: ${JSON.stringify(pong)}`);
    assert(await evaluate(session, `window.__talesActivity3D.start()`), 'Beer Pong 3D runtime did not start.');
    assert(await evaluate(session, `window.__talesActivity3D.autowin()`), 'Beer Pong smoke completion failed.');
    await evaluate(session, `window.__talesActivity3D.report()`);
    await waitFor(session, `window.__talesThirdPerson.snapshot()`, 4000, (state) => !state.modalOpen);

    await evaluate(session, `window.__talesActivity3D.preview('ronnyBattle')`);
    const fight = await waitFor(session, `window.__talesActivity3D.snapshot()`, 5000, (state) => state?.id === 'ronnyBattle' && state.visible && state.renderCalls > 0 && state.triangles > 0 && !state.contextLost);
    assert(fight.sceneObjects >= 4, `Frustkampf 3D scene is unexpectedly sparse: ${JSON.stringify(fight)}`);
    assert(await evaluate(session, `window.__talesActivity3D.start()`), 'Frustkampf runtime did not start.');
    const screenshot = await session.command('Page.captureScreenshot', { format: 'png' });
    assert((screenshot?.result?.data?.length ?? 0) > 20000, '3D activity screenshot is unexpectedly empty.');
    await evaluate(session, `window.__talesActivity3D.cancel()`);

    const runtimeErrors = stderr.split('\n').filter((line) => /uncaught|referenceerror|typeerror|syntaxerror/i.test(line));
    if (runtimeErrors.length) throw new Error(`3D activity browser runtime exception detected:\n${runtimeErrors.join('\n')}`);
    console.log('Third-person activity smoke passed: Beer Pong opened through the world interaction, rendered in WebGL, returned a score to progression, and the Ronny frustration fight rendered and started as its own 3D mode.');
  } finally { session.close(); }
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
    } catch { /* browser starting */ }
    await delay(180);
  }
  throw new Error(`Activity DevTools target did not appear.\n${stderr.slice(-4000)}`);
}

async function connect(url) {
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
    const entry = pending.get(message.id); pending.delete(message.id);
    if (message.error) entry.reject(new Error(message.error.message)); else entry.resolve(message);
  });
  return {
    command(method, params = {}) {
      return new Promise((resolve, reject) => {
        const id = nextId++;
        const timeout = setTimeout(() => { pending.delete(id); reject(new Error(`DevTools command timed out: ${method}`)); }, 60000);
        pending.set(id, { resolve(value) { clearTimeout(timeout); resolve(value); }, reject(error) { clearTimeout(timeout); reject(error); } });
        socket.send(JSON.stringify({ id, method, params }));
      });
    },
    close() { socket.close(); },
  };
}

async function evaluate(session, expression) {
  const response = await session.command('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (response?.result?.exceptionDetails) throw new Error(response.result.exceptionDetails.exception?.description ?? response.result.exceptionDetails.text ?? 'Browser exception');
  return response?.result?.result?.value;
}
async function waitFor(session, expression, timeoutMs, predicate) {
  const deadline = Date.now() + timeoutMs; let latest;
  while (Date.now() < deadline) { latest = await evaluate(session, expression); if (predicate(latest)) return latest; await delay(160); }
  throw new Error(`Browser condition timed out. State: ${JSON.stringify(latest)}\n${stderr.slice(-4000)}`);
}
function assert(condition, message) { if (!condition) throw new Error(message); }
function delay(ms) { return new Promise((resolve) => setTimeout(resolve, ms)); }
