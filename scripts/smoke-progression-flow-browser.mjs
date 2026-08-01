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
await new Promise((resolve) => server.listen(4182, '127.0.0.1', resolve));

const pageUrl = 'http://127.0.0.1:4182/Tales-of-the-blaue-Adria-/lpc-main/?progression=1';
const debuggingPort = 9333;
const profile = `/tmp/lpc-progression-smoke-${process.pid}`;
rmSync(profile, { recursive: true, force: true });
const candidates = [process.env.CHROME_BIN, 'google-chrome', 'chromium', 'chromium-browser'].filter(Boolean);
let browser;
for (const candidate of candidates) {
  browser = spawn(candidate, ['--headless=new','--no-sandbox','--disable-gpu','--enable-unsafe-swiftshader','--disable-dev-shm-usage','--disable-background-networking','--disable-extensions','--disable-sync','--no-first-run','--mute-audio',`--remote-debugging-port=${debuggingPort}`,`--user-data-dir=${profile}`,pageUrl], { stdio: ['ignore','ignore','pipe'] });
  const started = await new Promise((resolve) => { let settled = false; browser.once('spawn', () => { settled = true; resolve(true); }); browser.once('error', () => { if (!settled) resolve(false); }); });
  if (started) break;
  browser = undefined;
}
if (!browser) { server.close(); throw new Error('No Chromium-compatible browser found for progression smoke test.'); }
let stderr = '';
browser.stderr.on('data', (chunk) => { stderr += chunk; });

try {
  const target = await waitForTarget(debuggingPort, pageUrl, 18_000);
  const session = await connectDevTools(target.webSocketDebuggerUrl);
  try {
    await session.command('Runtime.enable');
    await session.command('Page.enable');

    const intro = await waitForExpression(session, `(() => ({
      visible:document.querySelector('#campaign-intro')?.hidden===false,
      crawl:Boolean(document.querySelector('.opening-v5-crawl')),
      slow:Number(document.querySelector('.opening-v5-space')?.dataset.introDuration)>=68000,
      speedChoices:document.querySelectorAll('[data-intro-duration]').length===3,
      defaultSelected:document.querySelector('[data-intro-duration="68000"]')?.classList.contains('selected')===true,
      release:document.documentElement.dataset.progressionRelease==='progression-rewards-markers-v6'
    }))()`, 24_000);
    assertState('Slower intro', intro);

    await evaluate(session, `(() => {
      localStorage.setItem('tales-blaue-adria-lpc-campaign-release','sprints-1-6-v1');
      localStorage.setItem('tales-blaue-adria-lpc-main-v1', JSON.stringify({
        version:3,mode:'world',profile:{name:'Progression Smoke',skinTone:'#d9a67e',hair:'#4a3224',shirt:'#e5ad43',shorts:'#294954',hairStyle:'kurz',bodyType:'normal',accessory:'keins',trait:'beobachtend'},
        prologue:{introSeen:true,shoppingComplete:true,spent:18},day:1,minutes:480,money:7,
        needs:{energy:92,hunger:10,thirst:8,bladder:5,alcohol:0,highness:0,hangover:0,courage:30},metrics:{dignity:60,chaos:0,reputation:0,momentum:0},
        inventory:{wasser:2,wuerste:1,bier:1,batida:0,chips:1,kaffee:0,klopapier:1,tablette:0},team:[],relationships:{},quests:{},activeQuest:'entry',flags:{},encounter:null,chronicle:[],worldPosition:{x:900,y:1600},currentInterior:null,activityResults:{}
      }));
      localStorage.setItem('tales-blaue-adria-lpc-campaign-meta-v2', JSON.stringify({version:3,introSeen:true,questStage:'arrival',learnedAttacks:['classic-high-five'],equippedAttacks:['classic-high-five'],activeTeam:[],miniResults:{},flags:{}}));
      location.reload();
      return true;
    })()`);

    const world = await waitForExpression(session, `(() => ({
      bridge:Boolean(window.__lpcProgressionV6),
      minigame:Boolean(window.__lpcMinigameDebug),
      canvas:Boolean(document.querySelector('#campaign-world canvas')),
      game:document.querySelector('#campaign-game')?.hidden===false
    }))()`, 24_000);
    assertState('Progression world', world);

    const initial = await evaluate(session, `(() => {
      const snap=window.__lpcProgressionV6.snapshot();
      return { objective:snap.objective.targetId==='trunk', oneStory:snap.enabledStory.length===1&&snap.enabledStory[0]==='trunk' };
    })()`);
    assertState('Single arrival objective', initial);

    await evaluate(session, `window.__lpcProgressionV6.forceMeta({questStage:'free-weekend',firstBeerOpened:true,authorityBattleWon:true,powerConnected:true,activeTeam:['andre'],flags:{},miniResults:{}})`);
    const firstGame = await waitForExpression(session, `(() => {
      const snap=window.__lpcProgressionV6.snapshot();
      return { objective:snap.objective.targetId==='flipCup', flip:snap.unlocked.includes('flipCup'), pong:!snap.unlocked.includes('beerPong'), flunky:!snap.unlocked.includes('flunkyball') };
    })()`, 5_000);
    assertState('Flip Cup first', firstGame);

    await evaluate(session, `window.__lpcMinigameDebug.start('beerPong')`);
    const blocked = await waitForExpression(session, `(() => ({
      closed:document.querySelector('#minigame-modal')?.hidden===true,
      blocked:window.__lpcProgressionV6.snapshot().blockedStarts>=1
    }))()`, 3_000);
    assertState('Locked Beer Pong', blocked);

    await evaluate(session, `window.__lpcProgressionV6.recordMini('flipCup',false)`);
    const pongUnlocked = await waitForExpression(session, `(() => {
      const snap=window.__lpcProgressionV6.snapshot();
      return { objective:snap.objective.targetId==='beerPong', pong:snap.unlocked.includes('beerPong'), flunky:!snap.unlocked.includes('flunkyball') };
    })()`, 4_000);
    assertState('Beer Pong second', pongUnlocked);

    await evaluate(session, `window.__lpcMinigameDebug.start('beerPong'); window.__lpcMinigameDebug.begin(); window.__lpcMinigameDebug.skipCountdown()`);
    const harderPong = await waitForExpression(session, `(() => {
      const state=window.__lpcMinigameDebug.snapshot();
      return {
        open:document.querySelector('#minigame-modal')?.hidden===false,
        picker:document.querySelectorAll('[data-pong-mode]').length===2,
        normal:Boolean(document.querySelector('[data-pong-mode="direct"]')),
        bounce:Boolean(document.querySelector('[data-pong-mode="bounce"]')),
        fewerCups:Number(state.playerCups)<=8,
        difficulty:Boolean(state.difficultyTier)
      };
    })()`, 6_000);
    assertState('Harder Beer Pong', harderPong);

    await evaluate(session, `document.querySelector('[data-pong-mode="bounce"]').click()`);
    const bounce = await waitForExpression(session, `(() => ({
      mode:window.__lpcMinigameDebug.snapshot().mode==='bounce',
      selected:document.querySelector('[data-pong-mode="bounce"]')?.classList.contains('selected')===true
    }))()`, 3_000);
    assertState('Explicit bounce selection', bounce);
    await evaluate(session, `window.__lpcMinigameDebug.close(); window.__lpcProgressionV6.closeStory()`);

    await evaluate(session, `window.__lpcProgressionV6.recordMini('beerPong',false); window.__lpcProgressionV6.recordMini('flunkyball',false)`);
    const allGames = await waitForExpression(session, `(() => {
      const snap=window.__lpcProgressionV6.snapshot();
      return {
        all:snap.allCore===true,
        flip:snap.unlocked.includes('flipCup'),pong:snap.unlocked.includes('beerPong'),flunky:snap.unlocked.includes('flunkyball'),
        ronny:snap.unlocked.includes('ronnyBattle'),objective:snap.objective.targetId==='ronny'
      };
    })()`, 5_000);
    assertState('Permanent core unlocks', allGames);

    const rewards = await evaluate(session, `(() => {
      const before={...window.__lpcProgressionV6.snapshot().inventory};
      window.__lpcProgressionV6.setRandom(.01); window.__lpcProgressionV6.grantBattle('smoke');
      const afterBattle={...window.__lpcProgressionV6.snapshot().inventory};
      window.__lpcProgressionV6.setRandom(.01,.01); window.__lpcProgressionV6.conversation('lars');
      const afterGift={...window.__lpcProgressionV6.snapshot().inventory};
      return {
        battle:Number(afterBattle.wasser||0)>Number(before.wasser||0),
        gift:Object.keys(afterGift).some((id)=>Number(afterGift[id]||0)>Number(afterBattle[id]||0)),
        rewardToast:Boolean(document.querySelector('.progression-v6-reward'))
      };
    })()`);
    assertState('Randomized item rewards', rewards);

    const runtimeErrors = stderr.split('\n').filter((line) => /uncaught|referenceerror|typeerror|syntaxerror/i.test(line));
    if (runtimeErrors.length) throw new Error(`Browser runtime exception detected:\n${runtimeErrors.join('\n')}`);
    console.log('Progression V6 browser smoke passed: slower intro, one active objective, sequential permanent unlocks, explicit Beer Pong modes, harder opponent setup and randomized rewards are operational.');
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
async function waitForTarget(port, expectedUrl, timeoutMs) { const deadline=Date.now()+timeoutMs; while(Date.now()<deadline){try{const response=await fetch(`http://127.0.0.1:${port}/json/list`);if(response.ok){const targets=await response.json();const page=targets.find((entry)=>entry.type==='page'&&entry.url.startsWith(expectedUrl.split('?')[0]));if(page?.webSocketDebuggerUrl)return page;}}catch{}await delay(250);}throw new Error(`Chromium DevTools target did not become available.\n${stderr.slice(-5000)}`); }
async function waitForExpression(session, expression, timeoutMs) { const deadline=Date.now()+timeoutMs;let latest;while(Date.now()<deadline){try{latest=await evaluate(session,expression);if(latest&&Object.values(latest).every(Boolean))return latest;}catch(error){if(!/Execution context|Cannot find context|navigated/i.test(String(error)))throw error;}await delay(140);}throw new Error(`Browser expression did not become true. State: ${JSON.stringify(latest)}`); }
async function evaluate(session, expression) { const response=await session.command('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(response?.result?.exceptionDetails)throw new Error(response.result.exceptionDetails.exception?.description??response.result.exceptionDetails.text);return response?.result?.result?.value; }
async function connectDevTools(url) { const socket=new WebSocket(url);await new Promise((resolve,reject)=>{const timeout=setTimeout(()=>reject(new Error('DevTools connection timed out.')),8000);socket.addEventListener('open',()=>{clearTimeout(timeout);resolve();},{once:true});socket.addEventListener('error',()=>{clearTimeout(timeout);reject(new Error('DevTools connection failed.'));},{once:true});});let nextId=1;const pending=new Map();socket.addEventListener('message',(event)=>{const message=JSON.parse(String(event.data));if(!message.id||!pending.has(message.id))return;const entry=pending.get(message.id);pending.delete(message.id);if(message.error)entry.reject(new Error(message.error.message));else entry.resolve(message);});return{command(method,params={}){return new Promise((resolve,reject)=>{const id=nextId++;const timeout=setTimeout(()=>{pending.delete(id);reject(new Error(`DevTools command timed out: ${method}`));},15000);pending.set(id,{resolve(value){clearTimeout(timeout);resolve(value);},reject(error){clearTimeout(timeout);reject(error);}});socket.send(JSON.stringify({id,method,params}));});},close(){socket.close();}}; }
function delay(ms){return new Promise((resolve)=>setTimeout(resolve,ms));}
