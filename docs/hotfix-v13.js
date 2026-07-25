(()=>{
'use strict';
const E=window.TBA13,C=window.TBA13_CONTENT,M=window.TBA13_MAP;
if(!E||!E.world||!E.activities)throw new Error('Hotfix kann Spielmodule nicht finden.');
const S=()=>E.getState(),R=E.R,ctx=E.ctx,canvas=E.el.canvas;
let worldReady=false;
const originalUpdate=E.updateScene;
E.updateScene=function(dt,t){if(S().scene==='world'&&!worldReady){E.world.init();worldReady=true;}originalUpdate?.(dt,t);};
const originalInteract=E.world.interact;
E.world.interact=function(){
 const s=S(),h=E.hour(),nearRonny=Math.hypot(s.world.x-1580,s.world.y-500)<105;
 if(s.scene!=='world')return originalInteract();
 if(R.nearest?.id==='gate'&&!s.world.gateOpen&&!E.gateClosed()&&(!s.flags.gundula||!s.flags.uli)){openGateLobby();return;}
 if(s.day<=2&&h>=17&&nearRonny&&!s.flags.rivalWon){E.addQuest('rival');E.openDialogue('ronny',C.dialogues.ronny?.lines||['Du siehst aus, als hätte ein Campingstuhl dich großgezogen.'],[
  {label:'Camping-Duell starten',hint:'Team gegen Parkplatz-Philosophen',action:()=>E.activities.startBattle('parkingCrew')},
  {label:'„Später, du Pfeife.“',hint:'Taktischer Aufschub',action:()=>E.toast('Aufgeschoben','Ronny hält das für Angst. Leider klingt es auch so.','warn')}
 ]);return;}
 const inNorth=s.world.x>780&&s.world.x<1560&&s.world.y>70&&s.world.y<430;
 const inSouth=s.world.x>650&&s.world.x<1480&&s.world.y>880&&s.world.y<1240;
 if((inNorth||inSouth)&&(h>=22||h<6)&&!R.nearest){openSleep();return;}
 if(R.nearest?.id==='departure'&&s.day===3&&E.minuteOfDay()<720){E.addQuest('cleanup');E.activities.startCleanup();return;}
 if(R.nearest?.id==='departure'&&s.day===3&&E.minuteOfDay()>=720){E.activities.startEndgame();return;}
 originalInteract();
};
function openGateLobby(){const s=S();E.openDialogue('gundula','Vor dem Tor stehen Gundula und Uli wie ein schlecht gelauntes Doppelboss-System. Beide wollen angesprochen werden. Verwaltung kennt keine Abkürzung.',[
 {label:`Gundula ansprechen ${s.flags.gundula?'✓':''}`,hint:'Hecke, Platzordnung und Menschenverachtung',action:talkGateGundula},
 {label:`Uli ansprechen ${s.flags.uli?'✓':''}`,hint:'Parkplatz vier. Nicht drei. Nicht fünf.',action:talkGateUli},
 {label:'Tor prüfen',hint:s.flags.gundula&&s.flags.uli?'Einlass möglich':'Noch nicht beide überzeugt',action:()=>{if(s.flags.gundula&&s.flags.uli)originalInteract();else E.toast('Tor bleibt zu','Zwei Wachleute, zwei Gespräche. Rechnen hilft.','warn')}}
 ]);}
function talkGateGundula(){const s=S();if(s.flags.gundula)return E.openDialogue('gundula','Du darfst vielleicht rein. Die Hecke ist trotzdem tabu. Besonders für Körperflüssigkeiten.');E.openDialogue('gundula',C.dialogues.gundula.intro,[
 {label:'Höflich anmelden',hint:'Langweilig, aber überraschend wirksam',action:()=>gateCheck('gundula',48+C.traits[s.profile.trait].dialogue)},
 {label:'Batida de Coco erwähnen',hint:s.inventory.batida?'Flüssiges Verwaltungsschmiermittel':'Nicht eingekauft',action:()=>gateCheck('gundula',s.inventory.batida?82:18)},
 {label:'„Ich bruns garantiert nicht in die Hecke.“',hint:'Extrem verdächtig formuliert',action:()=>gateCheck('gundula',38)},
 {label:'Zurückpöbeln',hint:'Respekt oder sofortige Feindschaft',action:()=>gateCheck('gundula',24+C.traits[s.profile.trait].battle)}
 ]);}
function talkGateUli(){const s=S();if(s.flags.uli)return E.openDialogue('uli','Parkplatz vier. Du hast genickt. Ich habe Zeugen.');E.openDialogue('uli',C.dialogues.uli.intro,[
 {label:'Parkplatz 4 bestätigen',hint:'Die Zahl zwischen drei und fünf',action:()=>gateCheck('uli',68)},
 {label:'Ordentlich neu einparken',hint:'Zehn Minuten und etwas Restwürde',action:()=>{E.advance(10,'Unter Ulis Blick neu einparken');gateCheck('uli',86)}},
 {label:'„Passt doch so.“',hint:'Uli empfindet körperlichen Schmerz',action:()=>gateCheck('uli',14)},
 {label:'Wasser anbieten',hint:s.inventory.water?'Praktisch':'Du hast keins',action:()=>gateCheck('uli',s.inventory.water?76:22)}
 ]);}
function gateCheck(id,chance){const s=S(),roll=E.rand(1,100);if(roll<=chance){s.flags[id]=true;s.relations[id]+=10;E.toast(`${id==='gundula'?'Gundula':'Uli'} überzeugt`,`Wurf ${roll}/${chance}. Ein bürokratisches Wunder.`,'good');if(s.flags.gundula&&s.flags.uli)E.banner('BEIDE ÜBERZEUGT · TOR ERNEUT ANSPRECHEN');}else{s.relations[id]-=5;E.toast('Abgelehnt',`Wurf ${roll}/${chance}. Deine Erklärung hatte die Statik eines nassen Zelts.`,'bad');}E.save();}
function openSleep(){const s=S(),where=s.world.y<700?'Nordlager':'Südlager';E.openDialogue('andre',`Das Zelt in ${where} sieht aus wie eine feuchte Plastiktüte mit Reißverschluss. Trotzdem wäre Schlaf vermutlich klüger als die nächste Idee.`,[
 {label:'Bis 08:00 Uhr schlafen',hint:'Energie hoch, Kater eventuell auch',action:sleepMorning},
 {label:'Powernap · 90 Minuten',hint:'Etwas Energie, viel Zeitverlust',action:()=>{s.needs.energy=E.clamp(s.needs.energy+32);s.needs.alcohol=E.clamp(s.needs.alcohol-8);E.advance(90,'Im Zelt wegtreten');}},
 {label:'Weiter eskalieren',hint:'Vernunft erfolgreich abgewehrt',action:()=>E.toast('Natürlich','Schlaf ist offenbar ein Problem für Zukunfts-Dich.','warn')}
 ]);}
function sleepMorning(){const s=S(),m=E.minuteOfDay();let delta=m<480?480-m:1440-m+480;const oldAlcohol=s.needs.alcohol;s.needs.energy=100;s.needs.alcohol=E.clamp(s.needs.alcohol-45);s.needs.highness=E.clamp(s.needs.highness-35);s.needs.hangover=E.clamp(s.needs.hangover+oldAlcohol*.28+12);s.needs.hunger=E.clamp(s.needs.hunger+12);s.needs.thirst=E.clamp(s.needs.thirst+16);s.world.noise=0;E.advance(delta,'Bis morgens im Zelt schlafen');if(s.day===3)E.addQuest('cleanup');E.toast(`${E.dayName(s.day)}morgen`,'Du wachst auf. Dein Mund fühlt sich an wie ein Aschenbecher mit Sandfüllung.','warn');}
const originalDraw=E.drawScene;
E.drawScene=function(t){originalDraw?.(t);if(S().scene==='world'){ctx.restore();drawExtraHotspots(t);}};
function drawExtraHotspots(t){const s=S(),h=E.hour();ctx.save();if(!s.world.gateOpen){markerWorld(505,455,'G',C.crew.gundula.color,'GUNDULA',t);markerWorld(505,565,'U',C.crew.uli.color,'ULI',t);}if(s.day<=2&&h>=17&&!s.flags.rivalWon)markerWorld(1580,500,'R',C.crew.ronny.color,'RONNY · KAMPF',t);if((h>=22||h<6)){markerWorld(1120,245,'☾','#526ca5','SCHLAFEN',t);markerWorld(1010,1080,'☾','#526ca5','SCHLAFEN',t);}if(s.day===3&&E.minuteOfDay()<720&&!s.flags.cleanupDone)markerWorld(300,820,'♻','#6fbf79','AUFRÄUMEN',t);ctx.restore();}
function markerWorld(wx,wy,glyph,color,label,t){const x=wx-R.camera.x,y=wy-R.camera.y;if(x<-80||y<-80||x>canvas.width+80||y>canvas.height+80)return;const p=1+Math.sin(t*.006+wx)*.08;ctx.save();ctx.translate(x,y);ctx.scale(p,p);ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.ellipse(0,23,24,8,0,0,Math.PI*2);ctx.fill();ctx.fillStyle=color;ctx.beginPath();ctx.arc(0,0,23,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#fff5d2';ctx.lineWidth=3;ctx.stroke();ctx.fillStyle='#fff';ctx.font='900 18px system-ui';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(glyph,0,1);ctx.fillStyle='rgba(10,18,15,.88)';ctx.beginPath();ctx.roundRect(-66,33,132,27,9);ctx.fill();ctx.fillStyle='#fff8dc';ctx.font='800 11px system-ui';ctx.fillText(label,0,47);ctx.restore();}
})();