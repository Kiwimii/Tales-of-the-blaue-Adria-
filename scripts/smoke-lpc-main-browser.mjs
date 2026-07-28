import { createServer } from 'node:http';
import { createReadStream, existsSync } from 'node:fs';
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
  if (!file.startsWith(root) || !existsSync(file)) {
    response.writeHead(404).end('Not found');
    return;
  }
  response.setHeader('content-type', mime[extname(file)] ?? 'application/octet-stream');
  createReadStream(file).pipe(response);
});

await new Promise((resolve) => server.listen(4177, '127.0.0.1', resolve));

const candidates = [process.env.CHROME_BIN, 'google-chrome', 'chromium', 'chromium-browser'].filter(Boolean);
let browser;
for (const candidate of candidates) {
  browser = spawn(candidate, [
    '--headless=new',
    '--no-sandbox',
    '--disable-gpu',
    '--disable-dev-shm-usage',
    '--disable-background-networking',
    '--enable-logging=stderr',
    '--virtual-time-budget=16000',
    '--dump-dom',
    'http://127.0.0.1:4177/Tales-of-the-blaue-Adria-/lpc-main/?smoke=1',
  ], { stdio: ['ignore', 'pipe', 'pipe'] });
  const started = await new Promise((resolve) => {
    let settled = false;
    browser.once('spawn', () => { settled = true; resolve(true); });
    browser.once('error', () => { if (!settled) resolve(false); });
  });
  if (started) break;
  browser = undefined;
}

if (!browser) {
  server.close();
  throw new Error('No Chromium-compatible browser found for LPC smoke test.');
}

let stdout = '';
let stderr = '';
browser.stdout.on('data', (chunk) => { stdout += chunk; });
browser.stderr.on('data', (chunk) => { stderr += chunk; });

const exitCode = await Promise.race([
  new Promise((resolve) => browser.once('close', resolve)),
  new Promise((resolve) => setTimeout(() => { browser.kill('SIGKILL'); resolve(124); }, 30000)),
]);
server.close();

const importantErrors = stderr
  .split('\n')
  .filter((line) => /uncaught|referenceerror|typeerror|syntaxerror|failed to load resource/i.test(line));

if (exitCode !== 0) throw new Error(`Chromium exited with ${exitCode}.\n${stderr.slice(-5000)}`);
if (!stdout.includes('LPC CAMPAIGN')) throw new Error('LPC campaign HTML identity was not rendered.');
if (!stdout.includes('AKTIVE KAMPAGNENQUEST')) throw new Error('Campaign HUD did not render in smoke mode.');
if (!stdout.includes('<canvas')) {
  throw new Error(`Phaser campaign canvas was not created.\nBrowser errors:\n${importantErrors.join('\n') || stderr.slice(-5000)}`);
}
if (importantErrors.some((line) => /uncaught|referenceerror|typeerror|syntaxerror/i.test(line))) {
  throw new Error(`Browser runtime exception detected:\n${importantErrors.join('\n')}`);
}

console.log('LPC campaign browser smoke test passed: HUD and Phaser world created without runtime exceptions.');
