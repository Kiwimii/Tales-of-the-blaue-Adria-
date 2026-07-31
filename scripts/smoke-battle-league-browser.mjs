import { createServer } from 'node:http';
import { createReadStream, existsSync, rmSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { spawn } from 'node:child_process';

const root=join(process.cwd(),'docs/lpc-main');
if(!existsSync(join(root,'index.html')))throw new Error('Build docs/lpc-main is missing.');
const prefix='/Tales-of-the-blaue-Adria-/lpc-main/';
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8'};
const server=createServer((req,res)=>{const path=new URL(req.url??'/','http://127.0.0.1').pathname;const rel=path.startsWith(prefix)?path.slice(prefix.length):path.replace(/^\/+/, '');const safe=normalize(rel||'index.html').replace(/^(\.\.[/\\])+/, '');const file=join(root,safe);if(!file.startsWith(root)||!existsSync(file)){res.writeHead(404).end();return;}res.setHeader('content-type',mime[extname(file)]??'application/octet-stream');createReadStream(file).pipe(res);});
await new Promise(r=>server.listen(4180,'127.0.0.1',r));

const url='http://127.0.0.1:4180/Tales-of-the-blaue-Adria-/lpc-main/?smoke=1';
const port=9330,profile=`/tmp/lpc-league-${process.pid}`;rmSync(profile,{recursive:true,force:true});
let browser;for(const bin of [process.env.CHROME_BIN,'google-chrome','chromium','chromium-browser'].filter(Boolean)){browser=spawn(bin,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage',`--remote-debugging-port=${port}`,`--user-data-dir=${profile}`,url],{stdio:['ignore','ignore','pipe']});const ok=await new Promise(r=>{let done=false;browser.once('spawn',()=>{done=true;r(true)});browser.once('error',()=>{if(!done)r(false)});});if(ok)break;browser=undefined;}
if(!browser){server.close();throw new Error('No Chromium-compatible browser found.');}
let stderr='';browser.stderr.on('data',c=>stderr+=c);

try{
 const target=await targetFor(port,url,18000),cdp=await connect(target.webSocketDebuggerUrl);await cdp.command('Runtime.enable');
 await wait(cdp,`({bridge:!!window.__lpcBattleLeagueV4,modal:!!document.querySelector('#battle-modal')})`,24000,'bridge');
 await evalJs(cdp,`window.__lpcBattleLeagueV4.showRoster(true)`);
 await wait(cdp,`({cards:document.querySelectorAll('.league-opponent-card').length===4,separated:document.querySelector('#battle-title')?.textContent?.includes('eigener Progressionspfad')??false,version:!!document.querySelector('[data-version="frustkampf-progression-v4"]')})`,9000,'roster');
 await evalJs(cdp,`window.__lpcBattleLeagueV4.start('gregor',true)`);
 await wait(cdp,`({opponent:document.querySelector('#battle-title')?.textContent?.includes('Grill-Gregor')??false,fighters:document.querySelectorAll('.league-fighter-slot .league-character').length===2,attacks:document.querySelectorAll('[data-league-move]').length>0})`,9000,'battle');
 const animation=await evalJs(cdp,`(()=>{window.__lpcBattleLeagueV4.move('classic-high-five');const s=document.querySelector('.league-cinematic-stage'),l=document.querySelector('.league-impact-layer'),p=l?getComputedStyle(l,'::before'):null;return{attack:s?.classList.contains('animate-player')===true,family:s?.dataset.attack==='highfive',effect:!!p&&p.animationName.includes('leaguePersistentBurst'),refined:document.querySelectorAll('.league-character .head,.league-character .torso,.league-character .legs').length>=6};})()`);assert(animation,'animation');
 await evalJs(cdp,`window.__lpcBattleLeagueV4.finish(true)`);
 await wait(cdp,`(()=>{const s=window.__lpcBattleLeagueV4.snapshot(),m=JSON.parse(localStorage.getItem('tales-blaue-adria-lpc-campaign-meta-v2')||'{}');return{panel:!!document.querySelector('.league-result.won'),deltas:document.querySelectorAll('.league-delta-grid article').length===4,saved:s.result?.deltas?.attempts>=1,score:s.result?.deltas?.weekendScore>0,relation:s.result?.deltas?.relationship>0,flag:!!m.flags?.['league-gregor-won']};})()`,9000,'result');
 if(stderr.split('\n').some(line=>/uncaught|referenceerror|typeerror|syntaxerror/i.test(line)))throw new Error(`Browser runtime exception:\n${stderr}`);
 console.log('Frustkampf league browser smoke passed: roster, distinct opponent, refined animation and persistent progression deltas are operational.');cdp.close();
}finally{browser.kill('SIGKILL');server.close();rmSync(profile,{recursive:true,force:true});}

function assert(state,label){const bad=Object.entries(state??{}).filter(([,v])=>v!==true).map(([k])=>k);if(bad.length)throw new Error(`${label} incomplete: ${bad.join(', ')}. ${JSON.stringify(state)}`);}
async function wait(cdp,body,ms,label){const end=Date.now()+ms;let state;while(Date.now()<end){try{state=await evalJs(cdp,`(()=>${body})()`);if(state&&Object.values(state).every(Boolean))return state;}catch(e){if(!/Execution context|navigated/i.test(String(e)))throw e;}await delay(120);}throw new Error(`${label} timeout: ${JSON.stringify(state)}`);}
async function evalJs(cdp,expression){const r=await cdp.command('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r?.result?.exceptionDetails)throw new Error(r.result.exceptionDetails.exception?.description??r.result.exceptionDetails.text);return r?.result?.result?.value;}
async function targetFor(port,url,ms){const end=Date.now()+ms;while(Date.now()<end){try{const r=await fetch(`http://127.0.0.1:${port}/json/list`),list=await r.json(),page=list.find(x=>x.type==='page'&&x.url.startsWith(url.split('?')[0]));if(page?.webSocketDebuggerUrl)return page;}catch{}await delay(200);}throw new Error('DevTools target timeout.');}
async function connect(url){const ws=new WebSocket(url);await new Promise((r,j)=>{const t=setTimeout(()=>j(new Error('CDP timeout')),8000);ws.addEventListener('open',()=>{clearTimeout(t);r();},{once:true});ws.addEventListener('error',()=>j(new Error('CDP failed')),{once:true});});let id=1;const pending=new Map();ws.addEventListener('message',e=>{const m=JSON.parse(String(e.data)),p=pending.get(m.id);if(!p)return;pending.delete(m.id);m.error?p.reject(new Error(m.error.message)):p.resolve(m);});return{command(method,params={}){return new Promise((resolve,reject)=>{const n=id++;pending.set(n,{resolve,reject});ws.send(JSON.stringify({id:n,method,params}));});},close(){ws.close();}};}
function delay(ms){return new Promise(r=>setTimeout(r,ms));}
