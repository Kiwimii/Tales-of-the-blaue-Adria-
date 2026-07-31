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
await new Promise((resolve) => server.listen(4180, '127.0.0.1', resolve));

const pageUrl = 'http://127.0.0.1:4180/Tales-of-the-blaue-Adria-/lpc-main/?opening=1';
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
  const target = await waitForTarget(debuggingPort, pageUrl, 18_000);
  const session = await connectDevTools(target.webSocketDebuggerUrl);
  try {
    await session.command('Runtime.enable');
    await session.command('Page.enable');

    const intro = await waitForExpression(session, `(() => ({
      bridge:Boolean(window.__lpcOpeningV5),
      visible:document.querySelector('#campaign-intro')?.hidden===false,
      version:document.querySelector('#campaign-intro')?.dataset.openingVersion==='opening-space-crawl-v5',
      space:Boolean(document.querySelector('.opening-v5-space')),
      stars:document.querySelectorAll('.opening-v5-star').length>=70,
      paragraphs:document.querySelectorAll('.opening-v5-crawl p').length>=7,
      supermarketMention:[...document.querySelectorAll('.opening-v5-crawl p')].some((node)=>node.textContent.includes('Supermarkt')),
      continueButton:Boolean(document.querySelector('[data-opening-continue]'))
    }))()`, 24_000);
    assertState('Space crawl intro', intro);

    await evaluate(session, `document.querySelector('[data-opening-continue]').click()`);
    const driver = await waitForExpression(session, `(() => ({
      visible:document.querySelector('#campaign-creator')?.hidden===false,
      rail:document.querySelector('#campaign-creator .opening-v5-flow-rail .active')?.dataset.flow==='driver',
      title:document.querySelector('#campaign-creator h1')?.textContent?.includes('aus dem Auto')??false,
      finish:document.querySelector('#creator-finish')?.textContent?.includes('Einkaufswagen')??false
    }))()`, 9_000);
    assertState('Driver file', driver);

    await evaluate(session, `document.querySelector('#creator-finish').click()`);
    const market = await waitForExpression(session, `(() => ({
      visible:document.querySelector('#campaign-shop')?.hidden===false,
      scene:Boolean(document.querySelector('.opening-v5-market-scene')),
      shelves:document.querySelectorAll('.opening-v5-shelf').length===3,
      checkout:Boolean(document.querySelector('.opening-v5-checkout')),
      cards:document.querySelectorAll('.shop-item').length>=8,
      rail:document.querySelector('#campaign-shop .opening-v5-flow-rail .active')?.dataset.flow==='market'
    }))()`, 9_000);
    assertState('Supermarket', market);

    await evaluate(session, `document.querySelector('#shop-recommended').click()`);
    const cart = await waitForExpression(session, `(() => ({
      count:Number(document.querySelector('.opening-v5-cart-count')?.dataset.count||0)>=6,
      selected:document.querySelectorAll('.shop-item.selected').length>=5,
      enabled:document.querySelector('#shop-finish')?.disabled===false,
      route:document.querySelector('#shop-finish')?.textContent?.includes('Parkplatz')??false
    }))()`, 7_000);
    assertState('Market cart', cart);

    await evaluate(session, `document.querySelector('#shop-finish').click()`);
    const arrival = await waitForExpression(session, `(() => ({
      game:document.querySelector('#campaign-game')?.hidden===false,
      canvas:Boolean(document.querySelector('#campaign-world canvas')),
      overlay:Boolean(document.querySelector('#opening-v5-arrival')),
      car:Boolean(document.querySelector('.opening-v5-arrival-car')),
      parking:Boolean(document.querySelector('.opening-v5-parking')),
      reception:Boolean(document.querySelector('.opening-v5-reception')),
      gate:Boolean(document.querySelector('.opening-v5-gate')),
      board:Boolean(document.querySelector('.opening-v5-board'))
    }))()`, 18_000);
    assertState('Car arrival', arrival);

    await evaluate(session, `window.__lpcOpeningV5.setArrivalPhase('ready')`);
    const ready = await waitForExpression(session, `(() => ({
      phase:document.querySelector('#opening-v5-arrival')?.dataset.phase==='ready',
      player:Boolean(document.querySelector('.opening-v5-exiting-player')),
      objective:document.querySelector('.opening-v5-arrival-copy h2')?.textContent?.includes('Kofferraum')??false
    }))()`, 4_000);
    assertState('Arrival exit staging', ready);

    await evaluate(session, `window.__lpcOpeningV5.finishArrival(false)`);
    const world = await waitForExpression(session, `(() => {
      const snap=window.__lpcOpeningV5.snapshot();
      const meta=JSON.parse(localStorage.getItem('tales-blaue-adria-lpc-campaign-meta-v2')||'{}');
      return {
        closed:!document.querySelector('#opening-v5-arrival'),
        seen:meta.flags?.openingArrivalSeen===true,
        layout:Array.isArray(snap.layoutErrors)&&snap.layoutErrors.length===0,
        exit:snap.exit?.x===820&&snap.exit?.y===1538,
        objective:document.querySelector('#objective-title')?.textContent?.includes('Ankunft')??false,
        trunk:document.querySelector('#interaction-text')?.textContent?.includes('Kofferraum')??false,
        input:!document.body.classList.contains('opening-v5-arrival-active')
      };
    })()`, 10_000);
    assertState('Playable parking arrival', world);

    const runtimeErrors = stderr.split('\n').filter((line) => /uncaught|referenceerror|typeerror|syntaxerror/i.test(line));
    if (runtimeErrors.length) throw new Error(`Browser runtime exception detected:\n${runtimeErrors.join('\n')}`);
    console.log('Opening sequence browser smoke test passed: space crawl, driver file, supermarket purchase, car arrival, coherent map layout and playable trunk objective are operational.');
  } finally { session.close(); }
} finally {
  browser.kill('SIGKILL');
  server.close();
  rmSync(profile, { recursive: true, force: true });
}

function assertState(label, state) {
  const failed = Object.entries(state ?? {}).filter(([, value]) => value !== true).map(([key]) => key);
  if (failed.length) throw new Error(`${label} browser smoke state is incomplete: ${failed.join(', ')}. State: ${JSON.stringify(state)}`);
}
async function waitForTarget(port, expectedUrl, timeoutMs) { const deadline = Date.now() + timeoutMs; while (Date.now() < deadline) { try { const response = await fetch(`http://127.0.0.1:${port}/json/list`); if (response.ok) { const targets = await response.json(); const page = targets.find((entry) => entry.type === 'page' && entry.url.startsWith(expectedUrl.split('?')[0])); if (page?.webSocketDebuggerUrl) return page; } } catch {} await delay(250); } throw new Error(`Chromium DevTools target did not become available.\n${stderr.slice(-5000)}`); }
async function waitForExpression(session, expression, timeoutMs) { const deadline = Date.now() + timeoutMs; let latest; while (Date.now() < deadline) { try { latest = await evaluate(session, expression); if (latest && Object.values(latest).every(Boolean)) return latest; } catch (error) { if (!/Execution context|Cannot find context|navigated/i.test(String(error))) throw error; } await delay(120); } throw new Error(`Browser expression did not become true. State: ${JSON.stringify(latest)}`); }
async function evaluate(session, expression) { const response = await session.command('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true }); if (response?.result?.exceptionDetails) throw new Error(response.result.exceptionDetails.exception?.description ?? response.result.exceptionDetails.text); return response?.result?.result?.value; }
async function connectDevTools(url) { const socket = new WebSocket(url); await new Promise((resolve, reject) => { const timeout=setTimeout(()=>reject(new Error('DevTools connection timed out.')),8000); socket.addEventListener('open',()=>{clearTimeout(timeout);resolve();},{once:true}); socket.addEventListener('error',()=>{clearTimeout(timeout);reject(new Error('DevTools connection failed.'));},{once:true}); }); let nextId=1; const pending=new Map(); socket.addEventListener('message',(event)=>{const message=JSON.parse(String(event.data)); if(!message.id||!pending.has(message.id))return; const entry=pending.get(message.id); pending.delete(message.id); if(message.error)entry.reject(new Error(message.error.message)); else entry.resolve(message);}); return { command(method,params={}){return new Promise((resolve,reject)=>{const id=nextId++; const timeout=setTimeout(()=>{pending.delete(id);reject(new Error(`DevTools command timed out: ${method}`));},15000); pending.set(id,{resolve(value){clearTimeout(timeout);resolve(value);},reject(error){clearTimeout(timeout);reject(error);}}); socket.send(JSON.stringify({id,method,params}));});}, close(){socket.close();} }; }
function delay(ms){return new Promise((resolve)=>setTimeout(resolve,ms));}
