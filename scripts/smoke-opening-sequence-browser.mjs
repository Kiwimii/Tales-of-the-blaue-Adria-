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
await new Promise((resolve) => server.listen(4181, '127.0.0.1', resolve));

const pageUrl = 'http://127.0.0.1:4181/Tales-of-the-blaue-Adria-/lpc-main/?smoke=1';
const debuggingPort = 9331;
const profile = `/tmp/lpc-opening-smoke-${process.pid}`;
rmSync(profile, { recursive: true, force: true });
const candidates = [process.env.CHROME_BIN, 'google-chrome', 'chromium', 'chromium-browser'].filter(Boolean);
let browser;
for (const candidate of candidates) {
  browser = spawn(candidate, ['--headless=new','--no-sandbox','--disable-gpu','--enable-unsafe-swiftshader','--disable-dev-shm-usage','--disable-background-networking','--disable-extensions','--disable-sync','--no-first-run','--mute-audio',`--remote-debugging-port=${debuggingPort}`,`--user-data-dir=${profile}`,pageUrl], { stdio: ['ignore','ignore','pipe'] });
  const started = await new Promise((resolve) => { let settled = false; browser.once('spawn', () => { settled = true; resolve(true); }); browser.once('error', () => { if (!settled) resolve(false); }); });
  if (started) break;
  browser = undefined;
}
if (!browser) { server.close(); throw new Error('No Chromium-compatible browser found for opening sequence smoke test.'); }
let stderr = '';
browser.stderr.on('data', (chunk) => { stderr += chunk; });

try {
  const target = await waitForTarget(debuggingPort, pageUrl, 18000);
  const session = await connectDevTools(target.webSocketDebuggerUrl);
  try {
    await session.command('Runtime.enable');
    await session.command('Page.enable');

    const intro = await waitForExpression(session, `(() => {
      const bridge = window.__lpcOpeningV5;
      const modelText = bridge?.crawl().join(' ') || '';
      const rendered = document.querySelector('.opening-v5-crawl-track')?.textContent || '';
      return {
        bridge: Boolean(bridge),
        version: bridge?.version === 'star-crawl-arrival-v5',
        crawl: Boolean(document.querySelector('.opening-v5-intro .opening-v5-crawl-track')),
        stars: document.querySelectorAll('.opening-v5-stars').length === 3,
        story: modelText.includes('25 Euro') && modelText.includes('Gundula') && modelText.includes('Kaution'),
        renderedTitle: rendered.includes('Tales of the Blaue Adria'),
        singleFlow: document.querySelector('#intro-back')?.disabled === true && (document.querySelector('#intro-next')?.textContent?.includes('Supermarkt') ?? false),
        layout: bridge?.layout().report.valid === true,
      };
    })()`, 24000);
    assertState('Opening crawl', intro);

    await evaluate(session, `document.querySelector('#intro-skip')?.click()`);
    const creator = await waitForExpression(session, `(() => ({
      visible: document.querySelector('#campaign-creator')?.hidden === false,
      marketEntrance: Boolean(document.querySelector('.opening-v5-market-entrance .opening-v5-market-door')),
      copy: document.querySelector('.creator-copy h1')?.textContent?.includes('Einkauf') ?? false,
    }))()`, 9000);
    assertState('Market entrance character setup', creator);

    await evaluate(session, `document.querySelector('#creator-finish')?.click()`);
    const market = await waitForExpression(session, `(() => ({
      visible: document.querySelector('#campaign-shop')?.hidden === false,
      scene: Boolean(document.querySelector('.opening-v5-supermarket .opening-v5-market-scene')),
      cart: Boolean(document.querySelector('.market-cart')),
      checkout: Boolean(document.querySelector('.market-checkout')),
    }))()`, 9000);
    assertState('Supermarket', market);

    await evaluate(session, `document.querySelector('#shop-recommended')?.click(); document.querySelector('#shop-finish')?.click();`);
    const arrival = await waitForExpression(session, `(() => {
      const snap = window.__lpcOpeningV5?.snapshot();
      return {
        overlay: Boolean(document.querySelector('.opening-v5-arrival')),
        phase: ['approach','turn','parked','door','exit'].includes(snap?.arrival || ''),
        car: Boolean(document.querySelector('.arrival-car')),
        reception: Boolean(document.querySelector('.arrival-reception')),
        gate: Boolean(document.querySelector('.arrival-gate')),
        locked: document.body.classList.contains('campaign-modal-open'),
      };
    })()`, 18000);
    assertState('Parking arrival', arrival);

    await evaluate(session, `window.__lpcOpeningV5.skipArrival()`);
    const world = await waitForExpression(session, `(() => {
      const snap = window.__lpcOpeningV5?.snapshot();
      const save = JSON.parse(localStorage.getItem('tales-blaue-adria-lpc-main-v1') || '{}');
      return {
        overlayClosed: !document.querySelector('.opening-v5-arrival'),
        gameVisible: document.querySelector('#campaign-game')?.hidden === false,
        canvas: Boolean(document.querySelector('#campaign-world canvas')),
        arrivalSeen: snap?.arrivalSeen === true,
        unlocked: !document.body.classList.contains('opening-v5-arriving'),
        shoppingSaved: save?.prologue?.shoppingComplete === true,
        layoutStillValid: window.__lpcOpeningV5.layout().report.valid === true,
      };
    })()`, 12000);
    assertState('World after arrival', world);

    const runtimeErrors = stderr.split('\n').filter((line) => /uncaught|referenceerror|typeerror|syntaxerror/i.test(line));
    if (runtimeErrors.length) throw new Error(`Browser runtime exception detected:\n${runtimeErrors.join('\n')}`);
    console.log('Opening sequence browser smoke test passed: space crawl, supermarket, coherent parking arrival and world handoff are operational.');
  } finally { session.close(); }
} finally {
  browser.kill('SIGKILL'); server.close(); rmSync(profile, { recursive: true, force: true });
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
    } catch {}
    await delay(250);
  }
  throw new Error(`Chromium DevTools target did not become available.\n${stderr.slice(-5000)}`);
}
async function waitForExpression(session, expression, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  let latest;
  while (Date.now() < deadline) {
    try {
      latest = await evaluate(session, expression);
      if (latest && Object.values(latest).every(Boolean)) return latest;
    } catch (error) {
      if (!/Execution context|Cannot find context|navigated/i.test(String(error))) throw error;
    }
    await delay(120);
  }
  throw new Error(`Browser expression did not become true. State: ${JSON.stringify(latest)}`);
}
async function evaluate(session, expression) {
  const response = await session.command('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (response?.result?.exceptionDetails) throw new Error(response.result.exceptionDetails.exception?.description ?? response.result.exceptionDetails.text);
  return response?.result?.result?.value;
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
