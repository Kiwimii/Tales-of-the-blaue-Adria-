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
await new Promise((resolve) => server.listen(4178, '127.0.0.1', resolve));

const pageUrl = 'http://127.0.0.1:4178/Tales-of-the-blaue-Adria-/lpc-main/?smoke=1';
const debuggingPort = 9328;
const profile = `/tmp/lpc-depth-smoke-${process.pid}`;
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
if (!browser) { server.close(); throw new Error('No Chromium-compatible browser found for gameplay-depth smoke test.'); }

let stderr = '';
browser.stderr.on('data', (chunk) => { stderr += chunk; });

try {
  const target = await waitForTarget(debuggingPort, pageUrl, 18000);
  const session = await connectDevTools(target.webSocketDebuggerUrl);
  try {
    await session.command('Runtime.enable');
    await session.command('Page.enable');
    const ready = await waitForExpression(session, `(() => ({
      campaign: Boolean(document.querySelector('#campaign-game')),
      baseArc: Boolean(window.__lpcWeekendArcDebug),
      depthRuntime: Boolean(window.__talesDepthUpdateV2),
      depthClass: document.documentElement.classList.contains('depth-v2-active'),
      directorButton: Boolean(document.querySelector('#open-depth-director')),
      directorModal: Boolean(document.querySelector('#depth-director-modal'))
    }))()`, 24000);
    assertState('Depth runtime', ready);

    const director = await evaluate(session, `(() => {
      document.querySelector('#open-depth-director')?.click();
      const modal = document.querySelector('#depth-director-modal');
      const cards = [...document.querySelectorAll('.depth-director-grid article')];
      const values = cards.map((card) => Number(card.querySelector('strong')?.textContent?.split('/')[0] ?? -1));
      return {
        visible: modal?.hidden === false,
        fiveDirectorValues: cards.length === 5,
        valuesBounded: values.length === 5 && values.every((value) => value >= 0 && value <= 100),
        inputLocked: document.body.classList.contains('campaign-modal-open')
      };
    })()`);
    assertState('Weekend director', director);
    const directorClosed = await evaluate(session, `(() => {
      document.querySelector('#depth-director-close')?.click();
      return document.querySelector('#depth-director-modal')?.hidden === true
        && !document.body.classList.contains('depth-director-open')
        && !document.body.classList.contains('campaign-modal-open');
    })()`);
    if (!directorClosed) throw new Error('Weekend director did not restore world input after closing.');

    const codexOpened = await evaluate(session, `(() => {
      const button = document.querySelector('#open-codex');
      if (!(button instanceof HTMLButtonElement)) return false;
      button.click(); return true;
    })()`);
    if (!codexOpened) throw new Error('Codex button is missing.');
    const codex = await waitForExpression(session, `(() => {
      const entry = document.querySelector('[data-depth-codex-entry="systems"]');
      if (entry instanceof HTMLButtonElement) entry.click();
      const text = document.querySelector('#codex-detail')?.textContent ?? '';
      return {
        entry: Boolean(entry),
        page: Boolean(document.querySelector('.depth-codex-page')),
        title: text.includes('Systemische Wochenenddynamik'),
        compatibility: text.includes('Kompatibilität'),
        statGrid: document.querySelectorAll('.depth-codex-page .codex-stat-grid > div').length === 4
      };
    })()`, 9000);
    assertState('Depth codex', codex);
    await evaluate(session, `document.querySelector('#codex-close')?.click()`);

    await evaluate(session, `window.__lpcWeekendArcDebug.showSecret()`);
    const secret = await waitForExpression(session, `(() => {
      const debug = window.__lpcWeekendArcDebug;
      const runtime = window.__talesDepthUpdateV2;
      if (!debug?.showSecret || !runtime?.snapshot) {
        return { bridge: false, caseFile: false, threeClues: false, cluesEnhanced: false, roleNotNamed: false, twelveCandidates: false, roleHistory: false, separateSave: false };
      }
      const candidates = document.querySelectorAll('.secret-candidate');
      const modal = document.querySelector('#weekend-arc-modal');
      if (candidates.length !== 12 || modal?.hidden !== false) debug.showSecret();
      const observations = document.querySelector('.secret-observations');
      const text = observations?.textContent?.toLocaleLowerCase('de') ?? '';
      const snapshot = runtime.snapshot();
      return {
        bridge: true,
        caseFile: Boolean(document.querySelector('.depth-case-file')),
        threeClues: document.querySelectorAll('.secret-observations p').length === 3,
        cluesEnhanced: observations?.classList.contains('depth-clues-ready') ?? false,
        roleNotNamed: Boolean(observations) && !text.includes('masl'),
        twelveCandidates: document.querySelectorAll('.secret-candidate').length === 12,
        roleHistory: Boolean(snapshot?.depth?.secret?.roleHistory?.[1]),
        separateSave: Boolean(localStorage.getItem('tales-blaue-adria-gameplay-depth-v2'))
      };
    })()`, 16000);
    assertState('Secret Millionaire depth', secret);

    const strategyFunctions = await evaluate(session, `(() => {
      const runtime = window.__talesDepthUpdateV2;
      const clues = runtime.buildSecretClues({ millionaireId: 'masl', round: 2, seed: 77, difficulty: 'expert' });
      const a = runtime.chooseNextMillionaire({ seed: 77, round: 3, eliminated: ['rene', 'lars'], previous: 'masl' });
      const b = runtime.chooseNextMillionaire({ seed: 77, round: 3, eliminated: ['rene', 'lars'], previous: 'masl' });
      return {
        deterministicRole: a === b,
        exclusions: !['rene', 'lars', 'masl'].includes(a),
        threeExpertClues: clues.length === 3,
        noRoleSpoiler: !clues.join(' ').toLocaleLowerCase('de').includes('masl')
      };
    })()`);
    assertState('Depth model in browser', strategyFunctions);

    const closed = await waitForExpression(session, `(() => {
      const debug = window.__lpcWeekendArcDebug;
      if (!debug?.close) return { bridge: false, modalClosed: false, arcClassCleared: false, inputRestored: false };
      debug.close();
      return {
        bridge: true,
        modalClosed: document.querySelector('#weekend-arc-modal')?.hidden === true,
        arcClassCleared: !document.body.classList.contains('weekend-arc-open'),
        inputRestored: !document.body.classList.contains('campaign-modal-open')
      };
    })()`, 9000);
    assertState('Weekend arc cleanup', closed);

    const runtimeErrors = stderr.split('\n').filter((line) => /uncaught|referenceerror|typeerror|syntaxerror/i.test(line));
    if (runtimeErrors.length) throw new Error(`Browser runtime exception detected:\n${runtimeErrors.join('\n')}`);
    console.log('Gameplay Depth Update V2 browser smoke test passed: director, codex, non-spoiling Secret Millionaire clues, role rotation model, separated persistence and modal cleanup are operational.');
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
    } catch { /* Chromium is still starting. */ }
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
      if (!/Execution context|Cannot find context|Inspected target navigated|Uncaught/i.test(String(error))) throw error;
    }
    await delay(160);
  }
  throw new Error(`Browser expression did not become true. State: ${JSON.stringify(latest)}`);
}

async function evaluate(session, expression) {
  const response = await session.command('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (response?.result?.exceptionDetails) {
    const details = response.result.exceptionDetails;
    const description = details.exception?.description ?? details.text ?? 'Unknown browser exception';
    throw new Error(`Runtime.evaluate failed: ${description}`);
  }
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
