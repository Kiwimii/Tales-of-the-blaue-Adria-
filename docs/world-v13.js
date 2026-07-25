(()=>{
'use strict';
const E=window.TBA13,M=window.TBA13_MAP,C=window.TBA13_CONTENT;
if(!E||!M||!C)throw new Error('Weltmodule fehlen.');
const {ctx,el,R}=E;
const S=()=>E.getState();
const state={points:[],npcPositions:{},patrolWarn:0,lastArea:'',lastAutoCatch:0};
function init(){
 const s=S();
 if(!s.world.x||s.world.x> M.width)s.world.x=260;
 if(!s.world.y||s.world.y> M.height)s.world.y=520;
 state.points=buildPoints();
 E.renderHud();
}
function buildPoints(){return [
 {id:'gate',label:'Haupttor',x:590,y:500,r:110,kind:'gate',action:gateAction},
 {id:'gundula',label:'Gundula',dynamic:true,r:95,kind:'npc',action:talkGundula},
 {id:'uli',label:'Uli',dynamic:true,r:95,kind:'npc',action:talkUli},
 {id:'toilets',label:'Toiletten',x:780,y:520,r:120,kind:'place',action:toiletAction},
 {id:'hedge',label:'Hecke',x:915,y:630,r:90,kind:'danger',action:hedgeAction},
 {id:'kiosk',label:'Kiosk',x:1490,y:1060,r:120,kind:'shop',action:kioskAction},
 {id:'beach',label:'Strand',x:1730,y:810,r:150,kind:'place',action:beachAction},
 {id:'lake',label:'Blaue Adria',x:1870,y:1120,r:130,kind:'place',action:lakeAction},
 {id:'smokeSpot',label:'Rauchplatz',x:1440,y:1430,r:120,kind:'secret',action:smokeAction},
 {id:'departure',label:'Abreise',x:300,y:820,r:130,kind:'exit',action:departureAction},
 {id:'flip',label:'Flip Cup',x:1350,y:680,r:100,kind:'game',action:()=>E.activities?.startMinigame?.('flip')},
 {id:'pong',label:'Beer Pong',x:1510,y:620,r:100,kind:'game',action:()=>E.activities?.startMinigame?.('pong')},
 {id:'flunky',label:'Flunkyball',x:1510,y:840,r:110,kind:'game',action:()=>E.activities?.startMinigame?.('flunky')},
 ...C.friendIds.map(id=>({id,label:C.crew[id].name,dynamic:true,r:92,kind:'friend',action:()=>talkFriend(id)}))
];}
function gateAction(){const s=S();if(s.inside){s.inside=false;s.world.x=500;E.toast('Draußen','Du verlässt freiwillig den Campingplatz. Seltsame Entscheidung.');E.save();return}
 if(E.gateClosed()){E.openDialogue('gundula',C.dialogues.gundula.intro.slice(1),[{label:'„Aber ich will jetzt rein.“',hint:'Verwaltungsrecht durch Jammern',action:()=>E.toast('Nein','13 bis 15 Uhr. Mittagspause. Gundulas Gesicht ist bereits die Rechtsgrundlage.','bad')},{label:'Warten bis 15 Uhr',hint:'Zwei Stunden Lebenszeit opfern',action:()=>{const target=900-E.minuteOfDay();E.advance(target,'Vor dem Tor herumstehen');}}]);return}
 if(s.flags.gundula&&s.flags.uli){s.world.gateOpen=true;s.inside=true;s.world.x=660;s.world.y=520;E.completeQuest('entry');E.addQuest('reunion');E.banner('WILLKOMMEN IM KONTROLLIERTEN KONTROLLVERLUST');E.save();return}
 E.toast('Tor bleibt zu','Rede mit Gundula und Uli. Beide. Verwaltung liebt Doppelarbeit.','warn');}
function guardPositions(){const s=S(),p=E.patrolType(),m=E.minuteOfDay();if(p){const route=M.patrolRoutes[p==='round'?'round':'quiet'];const start=p==='round'?1080:1320;const duration=60;const progress=E.clamp((m-start)/duration,0,1)*(route.length-1);const i=Math.min(route.length-2,Math.floor(progress)),f=progress-i;const a=route[i],b=route[i+1];return {gundula:{x:a[0]+(b[0]-a[0])*f,y:a[1]+(b[1]-a[1])*f},uli:{x:a[0]+(b[0]-a[0])*f-38,y:a[1]+(b[1]-a[1])*f+34}}}
 return {gundula:{x:1040,y:590},uli:{x:1110,y:590}};}
function friendPosition(id){const s=S(),h=E.hour(),d=s.day,a=M.friendAnchors[id]||[1100,700];if(d===3){if(id==='danny'&&h>=8)return h<10?{x:340,y:820}:{x:-1000,y:-1000};if(h>=10)return {x:260+(C.friendIds.indexOf(id)%5)*72,y:850+Math.floor(C.friendIds.indexOf(id)/5)*72};}
 const table={
  andre:h<15?[1060,215]:h<20?[1120,700]:[960,1030],
  rene:h<14?[620,620]:h<19?[980,650]:[1240,1020],
  lars:h<15?[1490,1060]:h<22?[1050,1040]:[1380,720],
  danny:h<18?[1230,230]:[900,1010],
  gregor:h<12?[940,1040]:h<21?[1020,1060]:[1160,1010],
  felix:h<15?[1700,800]:h<22?[1510,650]:[1500,1030],
  masl:h<13?[1300,690]:[1400,700],
  schubert:h<19?[1180,260]:[1400,1430],
  schima:h<20?[820,1010]:[1500,1380]
 };
 const p=table[id]||a;return {x:p[0],y:p[1]};}
function updateDynamicPoints(){state.npcPositions=guardPositions();for(const id of C.friendIds)state.npcPositions[id]=friendPosition(id);for(const p of state.points)if(p.dynamic){const v=state.npcPositions[p.id];if(v){p.x=v.x;p.y=v.y;}}}
function update(dt,t){const s=S();if(s.scene!=='world')return;updateDynamicPoints();if(!R.paused){movePlayer(dt);updateCamera(dt);updateNearest();checkArea();checkPatrolCatch(t);}
 R.particles=R.particles.filter(p=>(p.life-=dt)>0);}
function movePlayer(dt){const s=S();let dx=0,dy=0,k=R.keys;if(k.has('ArrowLeft')||k.has('a')||k.has('A'))dx--;if(k.has('ArrowRight')||k.has('d')||k.has('D'))dx++;if(k.has('ArrowUp')||k.has('w')||k.has('W'))dy--;if(k.has('ArrowDown')||k.has('s')||k.has('S'))dy++;dx+=R.stick.x;dy+=R.stick.y;const len=Math.hypot(dx,dy);if(len<.08)return;dx/=Math.max(1,len);dy/=Math.max(1,len);const fatigue=s.needs.energy<20?.62:s.needs.thirst>85?.74:1,drunk=s.needs.alcohol>70?.75:1,high=s.needs.highness>70?.86:1;let speed=245*fatigue*drunk*high;if(s.needs.bladder>90)speed*=1.08;const wobble=s.needs.alcohol>45?Math.sin(performance.now()/220)*s.needs.alcohol*.007:0;const ox=s.world.x,oy=s.world.y;s.world.x+=dx*speed*dt+dy*wobble;s.world.y+=dy*speed*dt-dx*wobble;s.world.facing=Math.abs(dx)>Math.abs(dy)?(dx<0?'left':'right'):(dy<0?'up':'down');resolveCollision(ox,oy);s.stats.steps+=Math.hypot(s.world.x-ox,s.world.y-oy)/16;if(Math.random()<.16)R.particles.push({x:s.world.x,y:s.world.y+20,life:.45,size:4+Math.random()*5});}
function resolveCollision(ox,oy){const s=S(),x=s.world.x,y=s.world.y;s.world.x=E.clamp(x,20,M.width-20);s.world.y=E.clamp(y,20,M.height-20);const rects=M.buildings.map(b=>[b.x-20,b.y-25,b.w+40,b.h+45]);for(const [rx,ry,rw,rh] of rects)if(s.world.x>rx&&s.world.x<rx+rw&&s.world.y>ry&&s.world.y<ry+rh){s.world.x=ox;s.world.y=oy;}
 if(pointInPolygon(s.world.x,s.world.y,M.lake)){s.world.x=ox;s.world.y=oy;}
 if(!s.world.gateOpen&&s.world.x>545&&s.world.x<640&&s.world.y>300&&s.world.y<780){s.world.x=ox;s.world.y=oy;}
}
function pointInPolygon(x,y,poly){let inside=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const xi=poly[i][0],yi=poly[i][1],xj=poly[j][0],yj=poly[j][1];const hit=((yi>y)!==(yj>y))&&(x<(xj-xi)*(y-yi)/(yj-yi)+xi);if(hit)inside=!inside;}return inside;}
function updateCamera(dt){const s=S(),cw=el.canvas.width,ch=el.canvas.height,tx=E.clamp(s.world.x-cw/2,0,M.width-cw),ty=E.clamp(s.world.y-ch/2,0,M.height-ch);R.camera.x+=(tx-R.camera.x)*Math.min(1,dt*5);R.camera.y+=(ty-R.camera.y)*Math.min(1,dt*5);}
function updateNearest(){const s=S();R.nearest=state.points.filter(p=>p.x>-500).map(p=>({p,d:Math.hypot(s.world.x-p.x,s.world.y-p.y)})).filter(o=>o.d<=o.p.r).sort((a,b)=>a.d-b.d)[0]?.p||null;el.action.querySelector('span').textContent=R.nearest?'!':'·';el.action.querySelector('small').textContent=R.nearest?R.nearest.label:'AKTION';}
function interact(){if(S().scene!=='world'||R.paused)return;if(!R.nearest){say(E.choice(C.oneLiners));return}R.nearest.action();E.vibrate(20);}
function areaAt(x,y){for(const z of Object.values(M.zones))if(x>=z.x&&x<=z.x+z.w&&y>=z.y&&y<=z.y+z.h)return z.name;return 'Campingwege';}
function checkArea(){const s=S(),a=areaAt(s.world.x,s.world.y);if(a!==s.world.lastArea){s.world.lastArea=a;E.toast(a,E.choice(C.oneLiners));E.log(`Gebiet: ${a}`);E.save();}}
function checkPatrolCatch(t){const s=S(),p=E.patrolType();if(!p||t-state.lastAutoCatch<5000)return;const guards=guardPositions(),d=Math.min(Math.hypot(s.world.x-guards.gundula.x,s.world.y-guards.gundula.y),Math.hypot(s.world.x-guards.uli.x,s.world.y-guards.uli.y));if(d<150){state.lastAutoCatch=t;if(p==='round'&&(s.world.noise>55||s.world.trash>7||s.world.hedgeWet))patrolConfrontation('round');if(p==='quiet'&&s.world.noise>25)patrolConfrontation('quiet');}}
function patrolConfrontation(type){const s=S();const isQuiet=type==='quiet';E.openDialogue('gundula',isQuiet?C.dialogues.gundula.quiet:C.dialogues.gundula.patrol,[
 {label:'René vorschicken',hint:'Diplomatie mit menschlichem Schutzschild',action:()=>{const bonus=s.foundFriends.includes('rene')?24:0;resolvePatrol(48+bonus,type)}},
 {label:'Alles abstreiten',hint:'Trotz sichtbarer Beweislage',action:()=>resolvePatrol(28,type)},
 {label:'Aufräumen und leiser werden',hint:'Erwachsen wirken, kurz',action:()=>{s.world.noise=Math.max(0,s.world.noise-45);s.world.trash=Math.max(0,s.world.trash-3);s.reputation+=2;E.completeQuest(isQuiet?'quiet22':'patrol18');E.save();}},
 {label:'„Was willst du denn machen?“',hint:'Strategie: maximale Dummheit',action:()=>resolvePatrol(8,type)}
 ]);}
function resolvePatrol(chance,type){const s=S(),roll=E.rand(1,100);if(roll<=chance){s.reputation+=3;s.relations.gundula+=2;s.world.noise=Math.max(0,s.world.noise-20);E.toast('Durchgekommen',`Wurf ${roll}/${chance}. Verwaltung vorübergehend besiegt.`,'good');E.completeQuest(type==='quiet'?'quiet22':'patrol18');}else{s.reputation-=4;s.chaos+=5;s.relations.gundula-=10;s.needs.dignity=E.clamp(s.needs.dignity-12);E.toast('Erwischt',`Wurf ${roll}/${chance}. Gundula schreibt innerlich bereits das Hausverbot.`,'bad');}E.save();}
function talkGundula(){const s=S();if(E.gateClosed()&&!s.inside)return gateAction();if(!s.flags.gundula){E.openDialogue('gundula',C.dialogues.gundula.intro,[
 {label:'Höflich anmelden',hint:'+ Charakter und vorhandene Würde',action:()=>guardCheck('gundula',48+C.traits[s.profile.trait].dialogue)},
 {label:'Batida de Coco erwähnen',hint:s.inventory.batida?'Ein überraschend wirksames Argument':'Du besitzt keine',action:()=>s.inventory.batida?guardCheck('gundula',82):E.toast('Bluff geplatzt','Gundula erkennt leere Flaschenversprechen.','bad')},
 {label:'„Ich bruns auch nicht in die Hecke.“',hint:'Verdächtig spezifisch',action:()=>guardCheck('gundula',38)},
 {label:'Frech zurückpöbeln',hint:'Kann Respekt oder Platzverweis erzeugen',action:()=>guardCheck('gundula',24+C.traits[s.profile.trait].battle)}
 ]);return}
 if(s.world.hedgeWet)return hedgeCaught();E.openDialogue('gundula',[E.choice(C.dialogues.gundula.patrol),`Dein aktueller Ruf: ${s.reputation}. Das ist keine Zahl, auf die ich stolz wäre.`]);}
function talkUli(){const s=S();if(!s.flags.uli){E.openDialogue('uli',C.dialogues.uli.intro,[
 {label:'Parkplatz 4 bestätigen',hint:'Die Zahl zwischen drei und fünf',action:()=>guardCheck('uli',68)},
 {label:'René reden lassen',hint:s.foundFriends.includes('rene')?'Guter Plan':'René ist noch nicht da',action:()=>guardCheck('uli',s.foundFriends.includes('rene')?88:30)},
 {label:'„Passt doch so.“',hint:'Uli sieht das anders',action:()=>guardCheck('uli',14)},
 {label:'Wasser anbieten',hint:s.inventory.water?'Praktisch und unromantisch':'Kein Wasser vorhanden',action:()=>guardCheck('uli',s.inventory.water?76:25)}
 ]);return}E.openDialogue('uli',[E.choice(C.dialogues.uli.patrol),'Wenn ein Reifen über der Linie steht, spüre ich das körperlich.']);}
function guardCheck(id,chance){const s=S(),roll=E.rand(1,100);if(roll<=chance){s.flags[id]=true;s.relations[id]+=10;E.toast(`${id==='gundula'?'Gundula':'Uli'} überzeugt`,`Wurf ${roll}/${chance}. Gerade so menschlich genug.`,'good');if(s.flags.gundula&&s.flags.uli)E.banner('TOR FREIGEGEBEN · ZUMINDEST THEORETISCH');}else{s.relations[id]-=5;s.flags.entryDenied=true;E.toast('Abgelehnt',`Wurf ${roll}/${chance}. Deine Ausstrahlung war ein verbaler Parkschaden.`,'bad');}E.save();}
function talkFriend(id){const s=S(),d=C.dialogues[id],crew=C.crew[id];if(!s.foundFriends.includes(id)){s.foundFriends.push(id);s.team.unlocked.push(id);s.team.reserve.push(id);s.relations[id]+=8;E.toast(`${crew.name} gefunden`,crew.nickname,'good');E.log(`${crew.name} zur Gruppe hinzugefügt.`);if(s.foundFriends.length===9){E.completeQuest('reunion');E.addQuest('patrol18');}}
 const special={
  andre:()=>E.openDialogue(id,d.lines,[{label:'Wochenendplan ansehen',action:()=>E.openDrawer('journal')},{label:'Mittrinken',action:()=>drinkTogether(id)}]),
  rene:()=>E.openDialogue(id,d.lines,[{label:'Ausreden trainieren',action:()=>{s.relations.rene+=4;s.needs.courage=E.clamp(s.needs.courage+8);E.advance(15,'Ausreden mit René üben')}},{label:'Bier teilen',action:()=>drinkTogether(id)}]),
  lars:()=>E.openDialogue(id,d.lines,[{label:'Trinkduell',action:()=>E.activities?.startMinigame?.('drink')},{label:'Wasser predigen',action:()=>{s.relations.lars-=2;E.toast('Lars ist enttäuscht','Er dachte, ihr wärt Freunde.','warn')}}]),
  danny:()=>E.openDialogue(id,d.lines,[{label:'Sonntag zum Aufräumen verpflichten',action:()=>{s.relations.danny+=3;s.flags.dannyPromised=true;E.toast('Versprochen','Danny lügt erstaunlich überzeugend.')}}]),
  gregor:()=>E.openDialogue(id,d.lines,[{label:'Wurst essen',action:()=>{s.needs.hunger=E.clamp(s.needs.hunger-30);s.needs.dignity=E.clamp(s.needs.dignity-2);E.advance(10,'Gregor-Wurst riskieren')}},{label:'Grillhilfe',action:()=>{s.relations.gregor+=6;s.world.trash=Math.max(0,s.world.trash-1);E.save()}}]),
  felix:()=>E.openDialogue(id,d.lines,[{label:'Flirten gehen',action:()=>E.activities?.startFlirt?.()},{label:'Beer Pong',action:()=>E.activities?.startMinigame?.('pong')}]),
  masl:()=>E.openDialogue(id,d.lines,[{label:'Flip Cup',action:()=>E.activities?.startMinigame?.('flip')},{label:'Flunkyball',action:()=>E.activities?.startMinigame?.('flunky')}]),
  schubert:()=>E.openDialogue(id,d.lines,[{label:'Botanische Forschung',action:smokeAction},{label:'Snack suchen',action:()=>{s.needs.hunger=E.clamp(s.needs.hunger-18);s.relations.schubert+=3;E.save()}}]),
  schima:()=>E.openDialogue(id,d.lines,[{label:'Nachtplan schmieden',action:()=>{E.addQuest('quiet22');s.world.noise+=10;s.relations.schima+=4;E.save()}},{label:'Feuerzeug suchen',action:()=>{if(!s.inventory.lighter){s.inventory.lighter=1;E.toast('Gefunden','Es lag in Schimas eigener Tasche. Natürlich.','good');E.save()}}}])
 };(special[id]||(()=>E.openDialogue(id,d.lines)))();}
function drinkTogether(id){const s=S();if(!s.inventory.beer)return E.toast('Kein Bier','Eine soziale Katastrophe ohne Hilfsmittel.','bad');E.useItem('beer');s.relations[id]+=5;s.world.noise+=8;E.advance(12,`Mit ${C.crew[id].name} trinken`);}
function toiletAction(){const s=S();if(s.needs.bladder<20)return E.toast('Noch nicht nötig','Du gehst freiwillig auf einen Campingplatz-WC? Verdächtig.');s.needs.bladder=0;s.needs.dignity=E.clamp(s.needs.dignity+2);E.advance(6,'Sanitärgebäude überleben');E.toast('Erleichtert','Die Kabine war schlimmer als die Konsequenz.','good');}
function hedgeAction(){const s=S();if(s.needs.bladder<35)return E.toast('Hecke bleibt trocken','Gundula weiß es nicht, aber sie ist kurz glücklich.');E.openDialogue('gundula','Vor dir steht die verbotene Hecke. Dein Körper hat eine Forderung. Deine Vernunft hat gekündigt.',[
 {label:'Zur Toilette gehen',hint:'Ungewöhnlich vernünftig',action:()=>{s.world.x=790;s.world.y=650;E.toast('Gute Entscheidung','Niemand wird davon erfahren.')}} ,
 {label:'In die Hecke brunsen',hint:'Schnell, dreckig, hochriskant',action:()=>peeHedge()},
 {label:'Lars als Sichtschutz benutzen',hint:s.foundFriends.includes('lars')?'Groß genug':'Lars fehlt',action:()=>{if(!s.foundFriends.includes('lars'))return E.toast('Kein Lars','Die Hecke bleibt ungeschützt.','bad');peeHedge(22)}}
 ]);}
function peeHedge(bonus=0){const s=S();s.needs.bladder=0;s.world.hedgeWet=true;s.stats.hedgePees++;s.chaos+=6;s.needs.dignity=E.clamp(s.needs.dignity-9);E.addQuest('hedge');const guard=guardPositions().gundula,d=Math.hypot(s.world.x-guard.x,s.world.y-guard.y),caughtChance=E.clamp(72-d/6-bonus,12,88);if(E.rand(1,100)<=caughtChance)hedgeCaught();else{E.toast('Hecke entweiht','Gundula hat es nicht gesehen. Die Hecke schon.','warn');E.save();}}
function hedgeCaught(){const s=S();s.flags.caughtHedge=true;s.relations.gundula-=30;s.reputation-=8;s.chaos+=10;E.openDialogue('gundula',C.dialogues.gundula.hedge,[{label:'Hecke reinigen',action:()=>cleanHedge()},{label:'Lars beschuldigen',action:()=>{s.relations.lars-=12;s.needs.dignity=E.clamp(s.needs.dignity-15);E.toast('Feige','Gundula glaubt dir nicht. Lars leider schon.','bad');E.save()}},{label:'Fliehen',action:()=>{s.world.x-=180;s.world.y+=100;s.world.noise+=12;E.save()}}]);}
function cleanHedge(){const s=S();if(!s.inventory.water&&!s.inventory.trashBag)return E.toast('Material fehlt','Du brauchst Wasser oder einen Müllsack. Scham allein reinigt nichts.','bad');if(s.inventory.water)s.inventory.water--;if(s.inventory.trashBag)s.inventory.trashBag--;s.world.hedgeWet=false;s.relations.gundula+=8;s.reputation+=2;E.completeQuest('hedge');E.advance(20,'Gundulas Hecke reinigen');}
function kioskAction(){const s=S();const offers=['water','beer','chips','coffee','kebab','painkiller','deodorant','trashBag'];E.openDialogue('jule',C.dialogues.jule.lines,[...offers.map(id=>({label:`${C.items[id].icon} ${C.items[id].label} · ${E.money(C.items[id].price)}`,action:()=>buyKiosk(id)})),{label:'Mit Jule flirten',hint:'Brotmesser in Reichweite',action:()=>E.activities?.startFlirt?.('jule')}]);}
function buyKiosk(id){const s=S(),it=C.items[id];if(s.money<it.price)return E.toast('Zu arm',`Es fehlen ${E.money(it.price-s.money)}.`,'bad');s.money-=it.price;s.inventory[id]++;E.toast('Gekauft',it.label,'good');E.save();}
function beachAction(){const s=S();E.openDialogue('nina',C.dialogues.nina.lines,[{label:'Flirten',hint:`Flirtwert ${Math.round(s.needs.flirt)}`,action:()=>E.activities?.startFlirt?.('nina')},{label:'Schwimmen',action:()=>{s.needs.energy=E.clamp(s.needs.energy-8);s.needs.alcohol=E.clamp(s.needs.alcohol-5);s.needs.dignity=E.clamp(s.needs.dignity-2);E.advance(25,'Im See baden');}},{label:'Nur peinlich schweigen',action:()=>E.toast('Stark','Zumindest hast du nichts verschlimmert.')}]);}
function lakeAction(){const s=S();if(s.needs.alcohol>65)return E.toast('Zu besoffen','Der See bleibt heute ohne Rettungseinsatz.','bad');s.needs.energy=E.clamp(s.needs.energy-10);s.needs.thirst=E.clamp(s.needs.thirst+4);E.advance(30,'In der Blauen Adria schwimmen');}
function smokeAction(){const s=S();E.addQuest('smoke');if(!s.flags.smokeFound){s.flags.smokeFound=true;s.inventory.joint=Math.max(1,s.inventory.joint);s.smokeRespect+=5;E.toast('Geheimer Rauchplatz','Schubert nennt es Naturschutzgebiet.','good');}
 E.openDialogue('schubert',C.dialogues.schubert.lines,[{label:'Eine rauchen',hint:s.inventory.joint?'Vorhanden':'Keine vorhanden',action:()=>{if(E.useItem('joint')){s.smokeRespect+=4;s.world.noise=Math.max(0,s.world.noise-4);E.completeQuest('smoke');E.advance(15,'Botanische Feldforschung')}} ,{label:'Nur daneben sitzen',action:()=>{s.needs.energy=E.clamp(s.needs.energy+8);E.advance(10,'Verdächtig entspannt sitzen')}}]);}
function departureAction(){const s=S();if(s.day<3)return E.toast('Noch nicht','Bis Sonntagmittag wird weiter eskaliert.','warn');E.activities?.startEndgame?.();}
function say(text){R.message=text;R.messageUntil=performance.now()+3800;}
function draw(t){const s=S();if(s.scene!=='world')return;ctx.clearRect(0,0,el.canvas.width,el.canvas.height);ctx.save();ctx.translate(-R.camera.x,-R.camera.y);drawTerrain();drawRoads();drawZones();drawProps();drawWaterDetails(t);drawNPCs(t);drawPlayer(t);drawParticles();ctx.restore();drawAtmosphere(t);drawWorldUI();}
function polygon(points,fill,stroke=null){ctx.beginPath();ctx.moveTo(points[0][0],points[0][1]);for(let i=1;i<points.length;i++)ctx.lineTo(points[i][0],points[i][1]);ctx.closePath();ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=3;ctx.stroke();}}
function drawTerrain(){ctx.fillStyle=M.palette.grass;ctx.fillRect(0,0,M.width,M.height);for(let x=0;x<M.width;x+=80)for(let y=0;y<M.height;y+=80){ctx.fillStyle=(x/80+y/80)%2?'rgba(255,255,255,.018)':'rgba(0,0,0,.018)';ctx.fillRect(x,y,80,80)}M.forests.forEach(f=>polygon(f,M.palette.forest));polygon(M.lake,M.palette.water);polygon(M.beach,M.palette.sand);}
function drawRoads(){ctx.lineCap='round';ctx.lineJoin='round';for(const r of M.roads){ctx.beginPath();ctx.moveTo(...r.points[0]);for(let i=1;i<r.points.length;i++)ctx.lineTo(...r.points[i]);ctx.strokeStyle='rgba(42,49,43,.28)';ctx.lineWidth=r.w+12;ctx.stroke();ctx.strokeStyle=M.palette.road;ctx.lineWidth=r.w;ctx.stroke();ctx.setLineDash([16,20]);ctx.strokeStyle='rgba(240,229,194,.3)';ctx.lineWidth=3;ctx.stroke();ctx.setLineDash([]);}for(const r of M.footpaths){ctx.beginPath();ctx.moveTo(...r.points[0]);for(let i=1;i<r.points.length;i++)ctx.lineTo(...r.points[i]);ctx.strokeStyle=M.palette.path;ctx.lineWidth=r.w;ctx.stroke();}}
function roundRect(x,y,w,h,r,fill,stroke){ctx.beginPath();ctx.roundRect(x,y,w,h,r);if(fill){ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=3;ctx.stroke()}}
function drawZones(){roundRect(200,360,350,310,28,'#60665e','#b6aa87');for(const p of M.parkingSlots)roundRect(p.x,p.y,p.w,p.h,7,'#8a8c83','#c8c4b3');for(const b of M.buildings){roundRect(b.x+8,b.y+12,b.w,b.h,14,'rgba(0,0,0,.22)');roundRect(b.x,b.y,b.w,b.h,14,b.roof,'#4a4036');label(b.label,b.x+b.w/2,b.y+b.h/2,'#fff8dc',14);}roundRect(1250,510,410,430,42,'rgba(159,190,104,.48)','#d7c66f');roundRect(670,900,780,320,38,'rgba(89,133,69,.55)','#d4b96e');}
function drawProps(){for(const c of M.caravans){ctx.save();ctx.translate(c.x,c.y);ctx.rotate(c.rot);if(c.type==='tent')tent(0,0,'#db7660',.75);else{roundRect(-32,-19,64,38,8,M.palette.caravan,'#655f54');ctx.fillStyle='#74a2ad';ctx.fillRect(-19,-11,18,13);ctx.fillStyle='#343a3a';ctx.beginPath();ctx.arc(-20,21,6,0,Math.PI*2);ctx.arc(20,21,6,0,Math.PI*2);ctx.fill()}ctx.restore();}for(const t of M.northTents)tent(t.x,t.y,t.color,1);for(const t of M.southTents)tent(t.x,t.y,t.color,1);for(const tr of M.trees)tree(tr.x,tr.y,tr.r,tr.dark);for(let i=0;i<8;i++)tree(910,410+i*47,20+i%2*4,true);}
function tree(x,y,r,dark){ctx.fillStyle='rgba(0,0,0,.18)';ctx.beginPath();ctx.ellipse(x+5,y+8,r,r*.65,0,0,Math.PI*2);ctx.fill();ctx.fillStyle=dark?M.palette.forest2:M.palette.forest;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.arc(x-r*.5,y+4,r*.65,0,Math.PI*2);ctx.arc(x+r*.5,y+3,r*.7,0,Math.PI*2);ctx.fill();ctx.fillStyle='rgba(255,255,255,.08)';ctx.beginPath();ctx.arc(x-r*.25,y-r*.25,r*.35,0,Math.PI*2);ctx.fill();}
function tent(x,y,color,s=1){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.fillStyle='rgba(0,0,0,.18)';ctx.beginPath();ctx.ellipse(0,22,42,12,0,0,Math.PI*2);ctx.fill();ctx.fillStyle=color;ctx.beginPath();ctx.moveTo(-42,20);ctx.lineTo(0,-32);ctx.lineTo(42,20);ctx.closePath();ctx.fill();ctx.strokeStyle='#40372e';ctx.lineWidth=3;ctx.stroke();ctx.beginPath();ctx.moveTo(0,-32);ctx.lineTo(0,20);ctx.stroke();ctx.restore();}
function drawWaterDetails(t){ctx.save();ctx.beginPath();ctx.rect(1740,0,1060,1840);ctx.clip();for(let y=90;y<1840;y+=58){ctx.beginPath();for(let x=1720;x<2820;x+=38){const yy=y+Math.sin(x*.018+t*.0012+y*.01)*5;ctx.lineTo(x,yy)}ctx.strokeStyle='rgba(197,238,241,.18)';ctx.lineWidth=3;ctx.stroke()}ctx.restore();for(let i=0;i<7;i++){ctx.fillStyle='rgba(255,255,255,.75)';ctx.beginPath();ctx.arc(1690+i*32,800+Math.sin(i+t*.002)*16,3,0,Math.PI*2);ctx.fill();}}
function drawNPCs(t){const s=S(),guards=guardPositions();drawCharacter(guards.gundula.x,guards.gundula.y,C.crew.gundula,'G',t);drawCharacter(guards.uli.x,guards.uli.y,C.crew.uli,'U',t);for(const id of C.friendIds){const p=friendPosition(id);if(p.x>-500)drawCharacter(p.x,p.y,C.crew[id],C.crew[id].name[0],t);}drawMarker(1350,680,'FLIP');drawMarker(1510,620,'PONG');drawMarker(1510,840,'FLUNKY');if(s.flags.smokeFound)drawMarker(1440,1430,'🌿');}
function drawCharacter(x,y,crew,letter,t){const bob=Math.sin(t*.004+x)*2;ctx.save();ctx.translate(x,y+bob);ctx.fillStyle='rgba(0,0,0,.25)';ctx.beginPath();ctx.ellipse(0,28,20,8,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#efc3a4';ctx.beginPath();ctx.arc(0,-19,13,0,Math.PI*2);ctx.fill();ctx.fillStyle=crew.color;roundRect(-16,-7,32,34,9,crew.color,'#2c302f');ctx.fillStyle='#27343a';ctx.fillRect(-13,22,10,17);ctx.fillRect(3,22,10,17);ctx.fillStyle='#1b2225';ctx.font='900 13px system-ui';ctx.textAlign='center';ctx.fillText(letter,0,4);ctx.restore();if(Math.hypot(S().world.x-x,S().world.y-y)<180)label(crew.name,x,y-52,'#fff8dc',13);}
function drawMarker(x,y,text){const pulse=1+Math.sin(performance.now()*.006+x)*.1;ctx.save();ctx.translate(x,y);ctx.scale(pulse,pulse);ctx.fillStyle='#f2c84f';ctx.beginPath();ctx.arc(0,0,18,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#fff4c8';ctx.lineWidth=3;ctx.stroke();ctx.restore();label(text,x,y+38,'#fff8dc',12);}
function drawPlayer(t){const s=S(),bob=Math.sin(t*.01)*1.7;ctx.save();ctx.translate(s.world.x,s.world.y+bob);ctx.fillStyle='rgba(0,0,0,.28)';ctx.beginPath();ctx.ellipse(0,31,23,9,0,0,Math.PI*2);ctx.fill();ctx.fillStyle=s.profile.skin;ctx.beginPath();ctx.arc(0,-20,14,0,Math.PI*2);ctx.fill();ctx.fillStyle=s.profile.hair;ctx.beginPath();ctx.arc(0,-25,15,Math.PI,Math.PI*2);ctx.fill();roundRect(-18,-7,36,38,10,s.profile.shirt,'#2b3130');ctx.fillStyle='#293a43';ctx.fillRect(-15,25,11,20);ctx.fillRect(4,25,11,20);ctx.restore();}
function drawParticles(){for(const p of R.particles){ctx.fillStyle=`rgba(214,199,151,${p.life*.35})`;ctx.beginPath();ctx.arc(p.x,p.y,p.size,0,Math.PI*2);ctx.fill();}}
function drawAtmosphere(t){const h=E.hour();let night=0;if(h>=20)night=Math.min(.62,(h-20)*.16);else if(h<6)night=.62;else if(h<8)night=.62-(h-6)*.31;if(night){ctx.fillStyle=`rgba(12,25,52,${night})`;ctx.fillRect(0,0,el.canvas.width,el.canvas.height);const px=S().world.x-R.camera.x,py=S().world.y-R.camera.y,g=ctx.createRadialGradient(px,py,30,px,py,260);g.addColorStop(0,'rgba(255,224,150,.16)');g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.fillRect(0,0,el.canvas.width,el.canvas.height);}if(E.patrolType()){ctx.fillStyle=`rgba(245,190,80,${.04+Math.sin(t*.006)*.02})`;ctx.fillRect(0,0,el.canvas.width,el.canvas.height);}}
function drawWorldUI(){const s=S(),a=areaAt(s.world.x,s.world.y);ctx.save();ctx.fillStyle='rgba(9,18,15,.76)';roundRect(18,18,250,56,16,'rgba(9,18,15,.76)','rgba(255,255,255,.12)');label(a,143,52,'#fff7d2',16);if(E.gateClosed()&&!s.inside){roundRect(820,18,430,62,16,'rgba(125,42,37,.9)','#ef8b77');label('MITTAGSPAUSE 13–15 UHR · KEIN EINLASS',1035,55,'#fff6e9',16)}if(E.patrolType()){roundRect(825,18,430,62,16,'rgba(105,71,19,.92)','#f0c55b');label(E.patrolType()==='round'?'18-UHR-RUNDGANG LÄUFT':'NACHTRUHEKONTROLLE LÄUFT',1040,55,'#fff6d0',16)}if(R.nearest){roundRect(el.canvas.width/2-170,el.canvas.height-84,340,52,16,'rgba(12,22,18,.9)','#f1c758');label(`AKTION · ${R.nearest.label}`,el.canvas.width/2,el.canvas.height-51,'#fff7cc',14)}if(R.messageUntil>performance.now()){roundRect(170,el.canvas.height-155,el.canvas.width-340,58,14,'rgba(10,20,17,.9)','rgba(255,255,255,.15)');label(R.message,el.canvas.width/2,el.canvas.height-120,'#fff8dc',15);ctx.restore();}}
function label(text,x,y,color='#fff',size=14){ctx.fillStyle=color;ctx.font=`800 ${size}px system-ui`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,x,y);}
Object.assign(E.world,{init,interact,guardPositions,friendPosition});
E.updateScene=(dt,t)=>{if(S().scene==='world')update(dt,t);else E.activities?.update?.(dt,t)};
E.drawScene=t=>{if(S().scene==='world')draw(t);else E.activities?.draw?.(t)};
})();