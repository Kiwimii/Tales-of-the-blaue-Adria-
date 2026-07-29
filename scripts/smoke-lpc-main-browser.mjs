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
    const html = await waitForCampaignDom(session, 22000);
    for (const marker of ['LPC CAMPAIGN', 'AKTIVE KAMPAGNENQUEST', 'mobile-move-zone', 'cinematic-battle-stage', '<canvas']) {
      if (!html.includes(marker)) throw new Error(`Campaign browser smoke marker is missing: ${marker}`);
    }
    const runtimeErrors = stderr.split('\n').filter((line) => /uncaught|referenceerror|typeerror|syntaxerror/i.test(line));
    if (runtimeErrors.length) throw new Error(`Browser runtime exception detected:\n${runtimeErrors.join('\n')}`);
    console.log('LPC campaign browser smoke test passed: mobile controls, battle staging and Phaser world rendered through DevTools without runtime exceptions.');
  } finally {
    session.close();
  }
} finally {
  browser.kill('SIGKILL');
  server.close();
  rmSync(profile, { recursive: true, force: true });
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

async function waitForCampaignDom(session, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  let latest = '';
  while (Date.now() < deadline) {
    const response = await session.command('Runtime.evaluate', {
      expression: 'document.documentElement ? document.documentElement.outerHTML : ""',
      returnByValue: true,
    });
    latest = response?.result?.result?.value ?? '';
    if (latest.includes('<canvas') && latest.includes('AKTIVE KAMPAGNENQUEST') && latest.includes('mobile-move-zone')) return latest;
    await delay(300);
  }
  throw new Error(`Campaign DOM was not ready before timeout.\n${latest.slice(0, 1000)}\n${stderr.slice(-5000)}`);
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
        const timeout = setTimeout(() => { pending.delete(id); reject(new Error(`DevTools command timed out: ${method}`)); }, 8000);
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
