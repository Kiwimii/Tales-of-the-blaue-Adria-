import * as THREE from 'three';

export type ThirdPersonActivityId = 'flipCup' | 'beerPong' | 'flunkyball' | 'romme' | 'hedge' | 'maslHole' | 'ronnyBattle';
export type FrustMoveId = 'highFive' | 'logic' | 'counter' | 'beer' | 'chair';
export interface RommeCard { rank: number; suit: 'herz' | 'karo' | 'pik' | 'kreuz'; }
export interface FrustFightState {
  playerFrustration: number; enemyFrustration: number; round: number; lastMove: FrustMoveId | null;
  repetition: number; finished: boolean; won: boolean;
}

interface Move { id: FrustMoveId; label: string; detail: string; power: number; accuracy: number; relief?: number; guard?: number; }
const MOVES: readonly Move[] = [
  { id: 'highFive', label: 'Klassisches High Five', detail: 'sehr sicher · überrumpelt', power: 18, accuracy: .96 },
  { id: 'logic', label: 'Logisch argumentieren', detail: 'stark gegen Ronny', power: 26, accuracy: .84 },
  { id: 'counter', label: 'Trockener Konter', detail: 'hoher Frust · Wiederholung wird gelesen', power: 29, accuracy: .87 },
  { id: 'beer', label: 'Bier anbieten', detail: 'senkt eigenen Frust', power: 14, accuracy: .91, relief: 11 },
  { id: 'chair', label: 'Campingstuhl-Blockade', detail: 'schwacher Treffer · starker Block', power: 9, accuracy: 1, guard: .46 },
];
const IDS = new Set<ThirdPersonActivityId>(['flipCup','beerPong','flunkyball','romme','hedge','maslHole','ronnyBattle']);
const COPY: Record<ThirdPersonActivityId, [string,string]> = {
  flipCup: ['3D-MINISPIEL · TEAMSTAFFEL','Vier Becher: austrinken, an die Tischkante setzen und mit dem richtigen Impuls flippen. Fehlversuche kosten Zeit.'],
  beerPong: ['3D-MINISPIEL · FREIER WURF','Ziele frei auf zehn Becher. Direktwürfe sind sicherer; Bounce ist enger, kann aber zwei Becher räumen.'],
  flunkyball: ['3D-MINISPIEL · MANNSCHAFTSDUELL','Treffe die Mittelflasche, trinke danach nur bis zum STOPP-Ruf und reagiere rechtzeitig.'],
  romme: ['3D-MINISPIEL · ROMMÉ','Wähle mindestens drei Karten. Erlaubt sind gleiche Werte mit unterschiedlichen Farben oder echte Folgen derselben Farbe.'],
  hedge: ['3D-MINISPIEL · HECKEN-STEALTH','Wähle Deckung, halte zum Erleichtern und bleib in der Hecke, während Gundula und Uli ihre Kontrollrunden drehen.'],
  maslHole: ['3D-MINISPIEL · KOMM ANS LOCH','Führe beide Hände zu einer dichten Kammer, zieh erst bei guter Abdichtung und lass vor dem Husten los.'],
  ronnyBattle: ['3D-FRUSTKAMPF · RUNDENBASIERT','Kein Timing-Balken: Wähle Angriffe. Ronnys Frust muss 110 erreichen, bevor dein eigener Frust 100 erreicht.'],
};
const PONG = [
  [.50,.23,0,-1.12],[.42,.31,-.46,-.72],[.58,.31,.46,-.72],[.34,.40,-.86,-.30],[.50,.40,0,-.30],
  [.66,.40,.86,-.30],[.26,.49,-1.24,.14],[.42,.49,-.42,.14],[.58,.49,.42,.14],[.74,.49,1.24,.14],
] as const;
const DECK: RommeCard[] = [
  {rank:7,suit:'herz'},{rank:8,suit:'herz'},{rank:9,suit:'herz'},
  {rank:11,suit:'pik'},{rank:11,suit:'herz'},{rank:11,suit:'karo'},
  {rank:4,suit:'kreuz'},{rank:5,suit:'kreuz'},{rank:6,suit:'kreuz'},
  {rank:12,suit:'pik'},{rank:12,suit:'kreuz'},{rank:12,suit:'herz'},
  {rank:2,suit:'karo'},{rank:3,suit:'karo'},{rank:4,suit:'karo'},
];

export function isThirdPersonActivityId(value: string): value is ThirdPersonActivityId { return IDS.has(value as ThirdPersonActivityId); }
export function flipTimingScore(value: number, placement = .56): number {
  const timing = Math.max(0, 1 - Math.abs(value-.5)/.28); const edge = Math.max(0,1-Math.abs(placement-.56)/.22);
  return Math.round((timing*.72+edge*.28)*100);
}
export function pongAimScore(aim:{x:number;y:number}, target:{x:number;y:number}, wind:number, bounce=false): number {
  const x = aim.x + wind*(bounce?1.3:.82); const d = Math.hypot(x-target.x, aim.y-target.y); const tolerance = bounce?.15:.19;
  return Math.round(Math.max(0,100*(1-d/tolerance)));
}
export function flunkyThrowScore(power:number, aim:number): number {
  const p=Math.max(0,1-Math.abs(power-.72)/.25), a=Math.max(0,1-Math.abs(aim-.5)/.22); return Math.round((p*.52+a*.48)*100);
}
export function isRommeMeld(cards: readonly RommeCard[]): boolean {
  if (cards.length<3) return false;
  if (cards.every(card=>card.rank===cards[0]?.rank)) return new Set(cards.map(card=>card.suit)).size===cards.length;
  if (!cards.every(card=>card.suit===cards[0]?.suit)) return false;
  const ranks=[...new Set(cards.map(card=>card.rank))].sort((a,b)=>a-b);
  return ranks.length===cards.length && ranks.every((rank,i)=>i===0||rank===ranks[i-1]!+1);
}
export function resolveFrustMove(current:FrustFightState, moveId:FrustMoveId, random:()=>number=Math.random) {
  if(current.finished) return {state:{...current},hit:false,playerDamage:0,counterDamage:0,text:'Der Kampf ist bereits entschieden.'};
  const move=MOVES.find(entry=>entry.id===moveId)??MOVES[0]!; const repeated=current.lastMove===moveId?current.repetition+1:0;
  const adaptation=Math.max(.48,1-repeated*.17); const hit=random()<=move.accuracy; const playerDamage=hit?Math.max(1,Math.round(move.power*adaptation)):0;
  const enemyFrustration=Math.min(110,current.enemyFrustration+playerDamage); let playerFrustration=Math.max(0,current.playerFrustration-(move.relief??0));
  let counterDamage=0; if(enemyFrustration<110){ counterDamage=Math.round((14+current.round*.7+random()*5)*(move.guard??1)); playerFrustration=Math.min(100,playerFrustration+counterDamage); }
  const won=enemyFrustration>=110, lost=playerFrustration>=100;
  const state:FrustFightState={playerFrustration,enemyFrustration,round:current.round+1,lastMove:moveId,repetition:repeated,finished:won||lost,won};
  const text=(hit?`${move.label}: +${playerDamage} Frust bei Ronny.`:`${move.label}: Ronny redet einfach darüber hinweg.`)+(counterDamage?` Ronny kontert: +${counterDamage} eigener Frust.`:'');
  return {state,hit,playerDamage,counterDamage,text};
}

type State = Record<string, any>;
export class ThirdPersonActivity3D {
  private overlay:HTMLElement; private canvas:HTMLCanvasElement; private title:HTMLElement; private kicker:HTMLElement; private copy:HTMLElement;
  private result:HTMLElement; private action:HTMLButtonElement; private controls:HTMLElement; private hud:HTMLElement;
  private renderer:THREE.WebGLRenderer; private scene=new THREE.Scene(); private camera=new THREE.PerspectiveCamera(43,16/9,.05,80);
  private id:ThirdPersonActivityId|null=null; private state:State={}; private running=false; private finished=false; private score=0; private elapsed=0;
  private last=performance.now(); private frame=0; private hold=false; private suppressClick=false;
  constructor(private readonly onExit:(report:boolean,score:number)=>void){
    installCss(); this.overlay=document.createElement('section'); this.overlay.className='a3d-overlay'; this.overlay.hidden=true; this.overlay.setAttribute('role','dialog'); this.overlay.setAttribute('aria-modal','true'); this.overlay.innerHTML=shell(); document.body.append(this.overlay);
    this.canvas=req(this.overlay,'#a3d-canvas',HTMLCanvasElement); this.title=req(this.overlay,'#a3d-title',HTMLElement); this.kicker=req(this.overlay,'#a3d-kicker',HTMLElement); this.copy=req(this.overlay,'#a3d-copy',HTMLElement); this.result=req(this.overlay,'#a3d-result',HTMLElement); this.action=req(this.overlay,'#a3d-action',HTMLButtonElement); this.controls=req(this.overlay,'#a3d-controls',HTMLElement); this.hud=req(this.overlay,'#a3d-hud',HTMLElement);
    this.renderer=new THREE.WebGLRenderer({canvas:this.canvas,antialias:true,powerPreference:'high-performance'}); this.renderer.outputColorSpace=THREE.SRGBColorSpace; this.renderer.toneMapping=THREE.ACESFilmicToneMapping; this.renderer.shadowMap.enabled=true; this.renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.35));
    req(this.overlay,'#a3d-close',HTMLButtonElement).addEventListener('click',()=>this.close(false));
    this.action.addEventListener('click',()=>{if(this.suppressClick){this.suppressClick=false;return;}const mode=this.action.dataset.mode;if(mode==='close')this.close(true);else if(mode==='start')this.begin();else this.primary();});
    this.action.addEventListener('pointerdown',e=>{if(this.running&&!this.finished&&this.isHold()){e.preventDefault();this.suppressClick=true;this.hold=true;}});
    const release=()=>this.release(); this.action.addEventListener('pointerup',release);this.action.addEventListener('pointerleave',release);this.action.addEventListener('pointercancel',release);
    this.canvas.addEventListener('pointermove',e=>this.pointer(e,false)); this.canvas.addEventListener('pointerdown',e=>this.pointer(e,true));
    window.addEventListener('keydown',e=>{if(e.code==='Escape'&&!this.overlay.hidden)this.close(false);}); new ResizeObserver(()=>this.resize()).observe(this.canvas);
  }
  open(id:string,label:string,best:number):void{
    this.stop(); this.overlay.hidden=false; this.id=isThirdPersonActivityId(id)?id:'flipCup'; this.running=false;this.finished=false;this.score=0;this.elapsed=0;this.hold=false;
    this.title.textContent=label;this.kicker.textContent=COPY[this.id][0];this.copy.textContent=COPY[this.id][1];this.result.textContent=best>0?`Bisheriger Bestwert: ${Math.round(best)} Punkte.`:'Noch kein gewerteter Versuch.';this.result.dataset.tone='neutral';
    this.action.hidden=false;this.action.disabled=false;this.action.dataset.mode='start';this.action.textContent=this.id==='ronnyBattle'?'FRUSTKAMPF STARTEN':'SPIEL STARTEN';this.controls.replaceChildren();
    this.init();this.buildScene();this.resize();this.render();setTimeout(()=>this.action.focus(),0);
  }
  close(report:boolean):void{const score=this.score;this.overlay.hidden=true;this.stop();this.onExit(report,score);document.getElementById('third-person-canvas')?.focus();}
  debugSnapshot(){return{id:this.id,running:this.running,finished:this.finished,score:this.score,visible:!this.overlay.hidden,renderCalls:this.renderer.info.render.calls,triangles:this.renderer.info.render.triangles,sceneObjects:this.scene.children.length,contextLost:this.renderer.getContext().isContextLost()};}
  debugStart():boolean{if(!this.id||this.finished)return false;if(!this.running)this.begin();return true;}
  debugAutowin():boolean{if(!this.id)return false;this.finish(88,`${this.title.textContent??'Aktivität'}: Smoke-Test erfolgreich.`);return true;}
  private stop(){cancelAnimationFrame(this.frame);this.running=false;this.hold=false;}
  private begin(){if(!this.id)return;this.running=true;this.finished=false;this.elapsed=0;this.last=performance.now();this.action.dataset.mode='play';this.liveControls();this.result.textContent='Los geht’s.';this.frame=requestAnimationFrame(t=>this.tick(t));}
  private liveControls(){if(!this.id)return;this.controls.replaceChildren();
    if(this.id==='flipCup')this.action.textContent='HALTEN: TRINKEN';
    if(this.id==='beerPong'){this.action.textContent='WERFEN';const mode=this.control('WURFART: DIREKT',()=>{this.state.bounce=!this.state.bounce;mode.textContent=this.state.bounce?'WURFART: BOUNCE ×2':'WURFART: DIREKT';});this.controls.append(mode);}
    if(this.id==='flunkyball')this.action.textContent='WERFEN';
    if(this.id==='romme'){this.action.textContent='MELDUNG LEGEN';this.renderCards();}
    if(this.id==='hedge')this.action.textContent='ERST DECKUNG WÄHLEN';
    if(this.id==='maslHole')this.action.textContent='ABDICHTUNG PRÜFEN';
    if(this.id==='ronnyBattle'){this.action.hidden=true;MOVES.forEach(move=>this.controls.append(this.control(move.label,()=>this.fight(move.id),move.detail)));}
  }
  private init(){if(this.id==='flipCup')this.state={phase:'drink',runner:0,liquid:1,placement:.56,marker:.1,dir:1,misses:0,perfects:0};
    if(this.id==='beerPong')this.state={aimX:.5,aimY:.38,bounce:false,cups:PONG.map(()=>true),shots:0,hits:0,wind:0,pending:null,ballT:0};
    if(this.id==='flunkyball')this.state={phase:'throw',round:1,aim:.5,power:.1,dir:1,hits:0,drinks:0,fouls:0,drink:0,stopAt:0,stop:false};
    if(this.id==='romme')this.state={hand:DECK.slice(0,7),next:7,selected:new Set<number>(),melds:0,misses:0,cpu:0};
    if(this.id==='hedge')this.state={phase:'choose',spot:-1,progress:0,suspicion:0,aim:.5,a:.1,b:.9};
    if(this.id==='maslHole')this.state={phase:'seal',round:1,left:.29,right:.71,seal:.2,pull:0,cough:0,scores:[]};
    if(this.id==='ronnyBattle')this.state={fight:{playerFrustration:0,enemyFrustration:0,round:1,lastMove:null,repetition:0,finished:false,won:false} satisfies FrustFightState,flash:0};}
  private tick(time:number){if(!this.running||this.finished||!this.id)return;const d=Math.min(.05,Math.max(0,(time-this.last)/1000));this.last=time;this.elapsed+=d;
    if(this.id==='flipCup')this.updateFlip(d);if(this.id==='beerPong')this.updatePong(d);if(this.id==='flunkyball')this.updateFlunky(d);if(this.id==='romme')this.updateRomme(d);if(this.id==='hedge')this.updateHedge(d);if(this.id==='maslHole')this.updateMasl(d);if(this.id==='ronnyBattle')this.state.flash=Math.max(0,this.state.flash-d*3.5);
    this.render();this.frame=requestAnimationFrame(t=>this.tick(t));}
  private primary(){if(!this.running||this.finished||!this.id)return;if(this.id==='flipCup')this.flip();if(this.id==='beerPong')this.throwPong();if(this.id==='flunkyball')this.flunky();if(this.id==='romme')this.meld();if(this.id==='maslHole')this.masl();}
  private isHold(){return (this.id==='flipCup'&&this.state.phase==='drink')||(this.id==='flunkyball'&&this.state.phase==='drink')||(this.id==='hedge'&&this.state.phase==='active')||(this.id==='maslHole'&&this.state.phase==='inhale');}
  private release(){if(!this.hold)return;this.hold=false;if(this.id==='flunkyball'&&this.state.phase==='drink'&&this.state.stop)this.finishDrink();if(this.id==='maslHole'&&this.state.phase==='inhale'&&this.state.pull>.18)this.finishPull();}
  private updateFlip(d:number){if(this.state.phase==='drink'&&this.hold){this.state.liquid=Math.max(0,this.state.liquid-d*.72);if(this.state.liquid<=0){this.hold=false;this.state.phase='place';this.action.textContent='BECHER AN KANTE SETZEN';this.result.textContent='Leer. Becher im 3D-Feld an die Kante ziehen und bestätigen.';}}
    if(this.state.phase==='flip'){this.state.marker+=this.state.dir*d*1.75;if(this.state.marker>=1){this.state.marker=1;this.state.dir=-1}if(this.state.marker<=0){this.state.marker=0;this.state.dir=1}}const cup=this.scene.getObjectByName('active-cup');if(cup){cup.position.x=(this.state.placement-.5)*4.2;cup.rotation.z=this.state.phase==='flip'?(this.state.marker-.5)*Math.PI*1.9:0;cup.position.y=this.state.phase==='flip'?1.1+Math.sin(this.state.marker*Math.PI)*1.35:1.08;}}
  private flip(){if(this.state.phase==='place'){this.state.phase='flip';this.state.marker=0;this.state.dir=1;this.action.textContent='JETZT FLIPPEN';return;}if(this.state.phase!=='flip')return;const s=flipTimingScore(this.state.marker,this.state.placement);if(s>=58){if(s>=88)this.state.perfects++;this.state.runner++;this.result.textContent=`${s} · Becher ${this.state.runner}/4 steht.`;if(this.state.runner>=4){this.finish(Math.max(58,Math.min(100,64+this.state.perfects*8-this.state.misses*4)),`4/4 Becher · ${this.state.perfects} perfekte Landungen.`);return;}}else{this.state.misses++;this.result.textContent=`${s} · Becher fällt um.`;}this.state.phase='drink';this.state.liquid=1;this.state.placement=.56;this.action.textContent='HALTEN: TRINKEN';}
  private updatePong(d:number){this.state.wind=Math.sin(this.elapsed*1.7)*.07;if(this.state.pending){this.state.ballT+=d/.72;const ball=this.scene.getObjectByName('pong-ball');if(ball){const t=Math.min(1,this.state.ballT),tar=this.state.pending.target;ball.visible=true;ball.position.set(THREE.MathUtils.lerp(0,tar[2]+this.state.wind*4,t),1.15+Math.sin(t*Math.PI)*(this.state.bounce?1.25:1.75),THREE.MathUtils.lerp(3.25,tar[3],t));}if(this.state.ballT>=1){this.resolvePong();this.state.pending=null;if(ball)ball.visible=false;}}const aim=this.scene.getObjectByName('pong-aim');if(aim)aim.position.set((this.state.aimX-.5)*5,1.02,(this.state.aimY-.36)*5-.4);}
  private throwPong(){if(this.state.pending)return;const left=PONG.map((target,index)=>({target,index})).filter(x=>this.state.cups[x.index]);if(!left.length)return;let near=left[0]!,dist=99;left.forEach(e=>{const d=Math.hypot(this.state.aimX-e.target[0],this.state.aimY-e.target[1]);if(d<dist){dist=d;near=e;}});const s=pongAimScore({x:this.state.aimX,y:this.state.aimY},{x:near.target[0],y:near.target[1]},this.state.wind,this.state.bounce);this.state.shots++;this.state.pending={index:near.index,target:near.target,score:s};this.state.ballT=0;}
  private resolvePong(){const p=this.state.pending,threshold=this.state.bounce?68:58;if(p.score>=threshold){this.state.cups[p.index]=false;this.state.hits++;if(this.state.bounce&&p.score>=82){const bonus=this.state.cups.findIndex(Boolean);if(bonus>=0)this.state.cups[bonus]=false;}this.result.textContent=`${p.score} · Treffer!`;this.result.dataset.tone='good';}else{this.result.textContent=`${p.score} · daneben.`;this.result.dataset.tone='warn';}PONG.forEach((_,i)=>{const cup=this.scene.getObjectByName(`pong-cup-${i}`);if(cup)cup.visible=this.state.cups[i];});const remaining=this.state.cups.filter(Boolean).length;if(!remaining||this.state.shots>=14)this.finish(!remaining?Math.min(100,64+(14-this.state.shots)*3+this.state.hits):Math.max(0,(10-remaining)*8),!remaining?`Tisch leer in ${this.state.shots} Würfen.`:`${10-remaining}/10 Becher geräumt.`);}
  private updateFlunky(d:number){if(this.state.phase==='throw'){this.state.power+=this.state.dir*d*1.15;if(this.state.power>=1){this.state.power=1;this.state.dir=-1}if(this.state.power<=0){this.state.power=0;this.state.dir=1}}if(this.state.phase==='drink'){if(this.hold)this.state.drink=Math.min(1.2,this.state.drink+d*.62);if(!this.state.stop&&this.elapsed>=this.state.stopAt){this.state.stop=true;this.result.textContent='STOPP! Jetzt loslassen.';}if(this.state.stop&&this.hold&&this.elapsed-this.state.stopAt>.72){this.state.fouls++;this.hold=false;this.result.textContent='Foul: nach STOPP weitergetrunken.';this.nextRound();}}}
  private flunky(){if(this.state.phase!=='throw')return;const s=flunkyThrowScore(this.state.power,this.state.aim);if(s>=58){this.state.hits++;this.state.phase='drink';this.state.drink=0;this.state.stop=false;this.state.stopAt=this.elapsed+1.05+this.state.round*.13;this.action.textContent='HALTEN: TRINKEN';this.result.textContent=`${s} · Mittelflasche getroffen.`;}else{this.result.textContent=`${s} · verfehlt.`;this.nextRound();}}
  private finishDrink(){const reaction=Math.max(0,this.elapsed-this.state.stopAt);if(reaction<=.55&&this.state.drink>=.35){this.state.drinks++;this.result.textContent=`Sauberer STOPP nach ${reaction.toFixed(2)} s.`;}else this.result.textContent='Trinkphase nicht sauber abgeschlossen.';this.nextRound();}
  private nextRound(){this.state.round++;if(this.state.round>4){this.finish(Math.max(0,Math.min(100,30+this.state.hits*10+this.state.drinks*12-this.state.fouls*9)),`${this.state.hits}/4 Treffer · ${this.state.drinks}/4 saubere STOPPs · ${this.state.fouls} Fouls.`);return;}this.state.phase='throw';this.state.power=.08;this.state.aim=.5;this.state.dir=1;this.action.textContent=`RUNDE ${this.state.round}: WERFEN`;}
  private updateRomme(d:number){this.state.cpu=Math.min(1,this.state.cpu+d/34);if(this.state.cpu>=1)this.finish(Math.max(0,42+this.state.melds*8-this.state.misses*4),`Gegenspieler macht zu · eigene Meldungen ${this.state.melds}.`);}
  private renderCards(){this.controls.replaceChildren();(this.state.hand as RommeCard[]).forEach((card,i)=>{const b=this.control(cardLabel(card),()=>{const s=this.state.selected as Set<number>;s.has(i)?s.delete(i):s.add(i);this.renderCards();});b.classList.add('a3d-card');b.dataset.selected=String((this.state.selected as Set<number>).has(i));this.controls.append(b);});}
  private meld(){const idx=[...(this.state.selected as Set<number>)].sort((a,b)=>a-b),cards=idx.map(i=>this.state.hand[i]).filter(Boolean) as RommeCard[];if(!isRommeMeld(cards)){this.state.misses++;this.result.textContent='Keine gültige Meldung.';return;}this.state.melds++;idx.forEach(i=>{this.state.hand[i]=DECK[this.state.next%DECK.length]!;this.state.next++;});(this.state.selected as Set<number>).clear();this.renderCards();this.result.textContent=`Gültige Meldung ${this.state.melds}/2.`;if(this.state.melds>=2)this.finish(Math.max(58,Math.min(100,72+(1-this.state.cpu)*18-this.state.misses*4)),'Zwei Meldungen vor dem Gegenspieler gelegt.');}
  private updateHedge(d:number){this.state.a=.5+Math.sin(this.elapsed*.9)*.45;this.state.b=.5+Math.sin(this.elapsed*1.15+2.4)*.45;if(this.state.phase==='active'&&this.hold){const cover=[.72,.9,.8][this.state.spot]??.75,pen=Math.min(1,Math.abs(this.state.aim-.5)*2.3),watched=Math.min(Math.abs(this.state.a-this.state.aim),Math.abs(this.state.b-this.state.aim));this.state.progress=Math.min(1,this.state.progress+d*(.18+cover*.18));if(watched<.05||pen>cover)this.state.suspicion=Math.min(1,this.state.suspicion+d*(.34+pen*.32));else this.state.suspicion=Math.max(0,this.state.suspicion-d*.08);if(this.state.suspicion>=1)this.finish(18,'Erwischt. Zwei unabhängige Beschwerden, identischer Wortlaut.');else if(this.state.progress>=1)this.finish(Math.max(58,96-this.state.suspicion*55),`Unauffällig erledigt · Verdacht ${Math.round(this.state.suspicion*100)} %.`);}}
  private updateMasl(d:number){this.state.seal=Math.max(0,1-(Math.abs(this.state.left-.43)+Math.abs(this.state.right-.57))*4.1);if(this.state.phase==='inhale'&&this.hold){this.state.pull=Math.min(1.2,this.state.pull+d*(.52+this.state.seal*.14));this.state.cough=Math.max(0,(this.state.pull-.72)*2.1);if(this.state.pull>=1.05){this.hold=false;this.finishPull();}}}
  private masl(){if(this.state.phase!=='seal')return;if(this.state.seal<.72){this.result.textContent=`Abdichtung ${Math.round(this.state.seal*100)} % · Hände näher zusammen.`;return;}this.state.phase='inhale';this.state.pull=0;this.action.textContent='HALTEN: ZIEHEN';}
  private finishPull(){const q=Math.max(0,1-Math.abs(this.state.pull-.72)/.38),s=Math.round((this.state.seal*.58+q*.42)*100);this.state.scores.push(s);this.state.round++;if(this.state.round>3){const avg=Math.round(this.state.scores.reduce((a:number,b:number)=>a+b,0)/this.state.scores.length);this.finish(avg,`Drei Züge · Durchschnitt ${avg}.`);return;}this.state.phase='seal';this.state.pull=0;this.state.left=.29;this.state.right=.71;this.action.textContent=`RUNDE ${this.state.round}: ABDICHTUNG PRÜFEN`;}
  private fight(move:FrustMoveId){if(!this.running||this.finished)return;const out=resolveFrustMove(this.state.fight,move);this.state.fight=out.state;this.result.textContent=out.text;this.state.flash=1;if(out.state.finished)this.finish(out.state.won?Math.max(58,Math.min(100,63+(100-out.state.playerFrustration)*.28)):Math.max(0,42-out.state.enemyFrustration*.12),out.state.won?'Ronny hat zum ersten Mal keinen Folgesatz mehr.':'Dein Frust erreicht das Maximum.');}
  private pointer(e:PointerEvent,down:boolean){if(!this.running||this.finished||!this.id)return;const r=this.canvas.getBoundingClientRect(),x=Math.max(0,Math.min(1,(e.clientX-r.left)/Math.max(1,r.width))),y=Math.max(0,Math.min(1,(e.clientY-r.top)/Math.max(1,r.height)));
    if(this.id==='beerPong'){this.state.aimX=x;this.state.aimY=y}if(this.id==='flunkyball'&&this.state.phase==='throw')this.state.aim=x;if(this.id==='flipCup'&&this.state.phase==='place')this.state.placement=Math.max(.28,Math.min(.78,x));if(this.id==='hedge'){if(down&&this.state.phase==='choose'){this.state.spot=x<.34?0:x>.66?2:1;this.state.phase='active';this.state.aim=[.28,.5,.72][this.state.spot];this.action.textContent='HALTEN: ERLEICHTERN';}else if(this.state.phase==='active')this.state.aim=x;}if(this.id==='maslHole'&&this.state.phase==='seal'){if(x<.5)this.state.left=Math.max(.18,Math.min(.49,x));else this.state.right=Math.max(.51,Math.min(.82,x));}}
  private finish(score:number,text:string){this.score=Math.max(0,Math.min(100,Math.round(score)));this.running=false;this.finished=true;this.hold=false;cancelAnimationFrame(this.frame);this.result.textContent=`${this.score} Punkte · ${text}`;this.result.dataset.tone=this.score>=58?'good':'warn';this.controls.querySelectorAll<HTMLButtonElement>('button').forEach(b=>b.disabled=true);this.action.hidden=false;this.action.disabled=false;this.action.textContent='ZURÜCK IN DIE WELT';this.action.dataset.mode='close';this.render();}
  private buildScene(){dispose(this.scene);this.scene.background=new THREE.Color(this.id==='ronnyBattle'?0x2d2830:0x18382c);this.scene.add(new THREE.HemisphereLight(0xfff1cf,0x18352c,1.5));const light=new THREE.DirectionalLight(0xffe3a0,2.6);light.position.set(4,7,5);this.scene.add(light);
    if(this.id==='flunkyball'){this.camera.position.set(0,5.6,9.5);this.camera.lookAt(0,.5,-1.8);this.scene.add(M(new THREE.PlaneGeometry(15,18),0x597c3c,[0,0,-2],[-Math.PI/2,0,0]));const bottle=M(new THREE.CylinderGeometry(.18,.24,1,16),0x2d6b45,[0,.52,-2.2]);bottle.name='flunky-bottle';this.scene.add(bottle);this.scene.add(M(new THREE.SphereGeometry(.19,16,12),0xf1dfbd,[0,.24,3.1]));return;}
    if(this.id==='hedge'){this.camera.position.set(0,4.2,8.6);this.camera.lookAt(0,1.2,-1.2);this.scene.add(M(new THREE.PlaneGeometry(15,15),0x3d6c3c,[0,0,-1],[-Math.PI/2,0,0]));for(let i=-4;i<=4;i++)this.scene.add(M(new THREE.BoxGeometry(1.35,2.3,1.1),0x28572f,[i*1.25,1.1,-2]));this.scene.add(human(0x7b5944,-2.7,-5.2));this.scene.add(human(0x506e58,2.7,-5.6));return;}
    if(this.id==='ronnyBattle'){this.camera.position.set(0,3.2,8.2);this.camera.lookAt(0,1.15,0);this.scene.add(M(new THREE.CircleGeometry(7.5,48),0x493f36,[0,0,0],[-Math.PI/2,0,0]));const p=human(0xe0b34d,-2,0);p.name='fight-player';const r=human(0x8b4b45,2,0);r.name='fight-enemy';this.scene.add(p,r);return;}
    this.camera.position.set(0,4.5,7.4);this.camera.lookAt(0,.9,-.3);this.scene.add(M(new THREE.PlaneGeometry(16,12),0x214f38,[0,0,0],[-Math.PI/2,0,0]));this.scene.add(M(new THREE.BoxGeometry(6.7,.22,4.1),0x7a4c29,[0,.92,0]));
    if(this.id==='beerPong'){PONG.forEach((t,i)=>{const cup=M(new THREE.CylinderGeometry(.19,.15,.55,18,1,true),0xc94335,[t[2],1.3,t[3]]);cup.name=`pong-cup-${i}`;this.scene.add(cup);});const ball=M(new THREE.SphereGeometry(.12,18,12),0xf5ead2,[0,1.15,3.25]);ball.name='pong-ball';ball.visible=false;this.scene.add(ball);const aim=M(new THREE.TorusGeometry(.22,.045,8,24),0xf2d269,[0,1.02,-.4],[-Math.PI/2,0,0]);aim.name='pong-aim';this.scene.add(aim);}
    if(this.id==='flipCup')for(let i=0;i<4;i++){const cup=M(new THREE.CylinderGeometry(.27,.20,.78,18,1,true),i?0xb83f35:0xe6c465,[-1.65+i*1.1,1.34,.55]);if(!i)cup.name='active-cup';this.scene.add(cup);}
    if(this.id==='romme'){this.scene.add(human(0x566d9c,0,-2.3));for(let i=0;i<7;i++){const c=M(new THREE.BoxGeometry(.68,.035,1),0xf2ead4,[-2.55+i*.85,1.12,1.15]);c.name=`romme-card-${i}`;this.scene.add(c);}}
    if(this.id==='maslHole'){const l=M(new THREE.SphereGeometry(.42,18,14),0xd6a076,[-1.05,1.55,.45]);l.name='masl-left';const r=M(new THREE.SphereGeometry(.42,18,14),0xd6a076,[1.05,1.55,.45]);r.name='masl-right';this.scene.add(l,r,M(new THREE.CylinderGeometry(.06,.05,1,12),0xe3d1a1,[0,1.6,-.05],[Math.PI/2,0,0]));}}
  private render(){if(!this.id)return;let h='';if(this.id==='flipCup')h=`BECHER ${Math.min(4,this.state.runner+1)}/4 · ${String(this.state.phase).toUpperCase()} · INHALT ${Math.round(this.state.liquid*100)}%`;
    if(this.id==='beerPong')h=`BECHER ${this.state.cups.filter(Boolean).length}/10 · WÜRFE ${this.state.shots}/14 · WIND ${this.state.wind>=0?'→':'←'} ${Math.round(Math.abs(this.state.wind)*100)}`;
    if(this.id==='flunkyball')h=`RUNDE ${Math.min(4,this.state.round)}/4 · ${String(this.state.phase).toUpperCase()} · KRAFT ${Math.round(this.state.power*100)} · TRINKEN ${Math.round(this.state.drink*100)}`;
    if(this.id==='romme')h=`MELDUNGEN ${this.state.melds}/2 · AUSGEWÄHLT ${(this.state.selected as Set<number>).size} · GEGNER ${Math.round(this.state.cpu*100)}%`;
    if(this.id==='hedge')h=this.state.phase==='choose'?'DECKUNG WÄHLEN · LINKS / MITTE / RECHTS':`ERLEICHTERUNG ${Math.round(this.state.progress*100)}% · VERDACHT ${Math.round(this.state.suspicion*100)}%`;
    if(this.id==='maslHole')h=`RUNDE ${Math.min(3,this.state.round)}/3 · ABDICHTUNG ${Math.round(this.state.seal*100)}% · ZUG ${Math.round(this.state.pull*100)}% · HUSTEN ${Math.round(this.state.cough*100)}%`;
    if(this.id==='ronnyBattle'){const f=this.state.fight as FrustFightState;h=`RUNDE ${f.round} · DEIN FRUST ${Math.round(f.playerFrustration)}/100 · RONNY ${Math.round(f.enemyFrustration)}/110`;}
    this.hud.textContent=h;this.renderer.render(this.scene,this.camera);}
  private resize(){const w=Math.max(320,Math.round(this.canvas.clientWidth||900)),h=Math.max(190,Math.round(this.canvas.clientHeight||430));this.camera.aspect=w/h;this.camera.updateProjectionMatrix();this.renderer.setSize(w,h,false);}
  private control(label:string,fn:()=>void,detail?:string){const b=document.createElement('button');b.type='button';b.className='a3d-control';const s=document.createElement('strong');s.textContent=label;b.append(s);if(detail){const small=document.createElement('small');small.textContent=detail;b.append(small)}b.addEventListener('click',fn);return b;}
}

function shell(){return `<article class="a3d-panel"><button id="a3d-close" class="a3d-close" type="button">×</button><p id="a3d-kicker" class="a3d-kicker"></p><h2 id="a3d-title"></h2><p id="a3d-copy" class="a3d-copy"></p><div class="a3d-stage"><canvas id="a3d-canvas" width="900" height="430"></canvas><div id="a3d-hud" class="a3d-hud">BEREIT</div></div><p id="a3d-result" class="a3d-result"></p><div id="a3d-controls" class="a3d-controls"></div><button id="a3d-action" class="a3d-primary" type="button">SPIEL STARTEN</button></article>`;}
function installCss(){if(document.getElementById('a3d-css'))return;const s=document.createElement('style');s.id='a3d-css';s.textContent=`.a3d-overlay{position:fixed;z-index:220;inset:0;display:grid;place-items:center;padding:14px;background:rgba(4,12,8,.8);backdrop-filter:blur(11px);overflow:auto;color:#f7f1df}.a3d-overlay[hidden]{display:none!important}.a3d-panel{position:relative;width:min(920px,100%);max-height:96vh;overflow:auto;padding:clamp(18px,3.2vw,34px);border:1px solid rgba(255,236,179,.24);border-radius:22px;background:rgba(12,25,20,.98);box-shadow:0 30px 100px rgba(0,0,0,.52)}.a3d-panel h2{margin:0 46px 8px 0;color:#fff1c8;font-family:Georgia,serif;font-size:clamp(25px,4vw,42px)}.a3d-kicker{margin:0 0 7px;color:#f0c65f;font-size:10px;font-weight:900;letter-spacing:.17em}.a3d-copy{margin:0 0 14px;color:#cad9d0;font-size:13px;line-height:1.55}.a3d-close{position:absolute;top:13px;right:13px;width:40px;height:40px;border:1px solid #ffffff29;border-radius:50%;background:#ffffff12;color:#fff1c8;font-size:24px}.a3d-stage{position:relative;border:1px solid #ffecb32e;border-radius:16px;overflow:hidden;background:#132b22}#a3d-canvas{display:block;width:100%;height:clamp(235px,48vh,440px);touch-action:none;cursor:crosshair}.a3d-hud{position:absolute;left:10px;right:10px;top:10px;padding:7px 10px;border-radius:10px;background:#08140fc2;color:#fff1c8;font-size:10px;font-weight:850;text-align:center}.a3d-result{min-height:24px;margin:12px 0 6px;text-align:center;font-size:13px;font-weight:750}.a3d-result[data-tone=good]{color:#73d3b7}.a3d-result[data-tone=warn]{color:#e8a16d}.a3d-controls{display:grid;grid-template-columns:repeat(auto-fit,minmax(145px,1fr));gap:8px;margin:10px 0}.a3d-control{display:grid;gap:3px;min-height:48px;padding:9px 11px;border:1px solid #ffffff24;border-radius:11px;background:#ffffff0e;color:#fff1c8;text-align:left}.a3d-control small{color:#b6c8bd;font-size:9px}.a3d-card{text-align:center}.a3d-card[data-selected=true]{border-color:#f0c65f;background:#f0c65f2e;transform:translateY(-3px)}.a3d-primary{width:100%;min-height:48px;padding:12px;border:0;border-radius:12px;background:linear-gradient(135deg,#f3d06e,#d29f38);color:#172119;font-weight:900}@media(max-width:600px){.a3d-overlay{padding:0}.a3d-panel{min-height:100%;border-radius:0;padding:18px 12px}.a3d-controls{grid-template-columns:repeat(2,minmax(0,1fr))}#a3d-canvas{height:38vh;min-height:220px}}`;document.head.append(s);}
function req<T extends Element>(root:ParentNode,selector:string,ctor:{new(...args:never[]):T}):T{const e=root.querySelector(selector);if(!(e instanceof ctor))throw new Error(`Missing 3D activity element: ${selector}`);return e;}
function M(g:THREE.BufferGeometry,color:number,pos:[number,number,number],rot:[number,number,number]=[0,0,0]){const o=new THREE.Mesh(g,new THREE.MeshStandardMaterial({color,roughness:.68,side:THREE.DoubleSide}));o.position.set(...pos);o.rotation.set(...rot);return o;}
function human(color:number,x:number,z:number){const g=new THREE.Group();g.position.set(x,0,z);g.add(M(new THREE.BoxGeometry(.72,1.05,.38),color,[0,1.25,0]),M(new THREE.SphereGeometry(.32,18,14),0xd7a078,[0,2.02,0]));for(const side of [-1,1])g.add(M(new THREE.BoxGeometry(.22,.9,.24),0x26313b,[side*.2,.45,0]),M(new THREE.BoxGeometry(.18,.82,.2),0xd7a078,[side*.5,1.34,0]));return g;}
function dispose(scene:THREE.Scene){for(const child of [...scene.children]){scene.remove(child);child.traverse(o=>{if(!(o instanceof THREE.Mesh))return;o.geometry.dispose();(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>m.dispose());});}}
function cardLabel(c:RommeCard){const ranks:Record<number,string>={11:'B',12:'D',13:'K',14:'A'},suits={herz:'♥',karo:'♦',pik:'♠',kreuz:'♣'} as const;return `${ranks[c.rank]??c.rank}${suits[c.suit]}`;}
