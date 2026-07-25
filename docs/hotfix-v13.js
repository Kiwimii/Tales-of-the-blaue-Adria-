(()=>{
'use strict';
const E=window.TBA13,C=window.TBA13_CONTENT,M=window.TBA13_MAP;
if(!E||!E.world||!E.activities)throw new Error('Hotfix kann Spielmodule nicht finden.');
const S=()=>E.getState(),R=E.R,ctx=E.ctx,canvas=E.el.canvas;
const originalInteract=E.world.interact;
E.world.interact=function(){
 const s=S(),h=E.hour(),nearRonny=Math.hypot(s.world.x-1580,s.world.y-500)<105;
 if(s.scene!=='world')return originalInteract();
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
function openSleep(){const s=S(),where=s.world.y<700?'Nordlager':'Südlager';E.openDialogue('andre',`Das Zelt in ${where} sieht aus wie eine feuchte Plastiktüte mit Reißverschluss. Trotzdem wäre Schlaf vermutlich klüger als die nächste Idee.`,[
 {label:'Bis 08:00 Uhr schlafen',hint:'Energie hoch, Kater eventuell auch',action:sleepMorning},
 {label:'Powernap · 90 Minuten',hint:'Etwas Energie, viel Zeitverlust',action:()=>{s.needs.energy=E.clamp(s.needs.energy+32);s.needs.alcohol=E.clamp(s.needs.alcohol-8);E.advance(90,'Im Zelt wegtreten');}},
 {label:'Weiter eskalieren',hint:'Vernunft erfolgreich abgewehrt',action:()=>E.toast('Natürlich','Schlaf ist offenbar ein Problem für Zukunfts-Dich.','warn')}
 ]);}
function sleepMorning(){const s=S(),m=E.minuteOfDay();let delta=m<480?480-m:1440-m+480;s.needs.energy=100;s.needs.alcohol=E.clamp(s.needs.alcohol-45);s.needs.highness=E.clamp(s.needs.highness-35);s.needs.hangover=E.clamp(s.needs.hangover+s.needs.alcohol*.28+12);s.needs.hunger=E.clamp(s.needs.hunger+12);s.needs.thirst=E.clamp(s.needs.thirst+16);s.world.noise=0;E.advance(delta,'Bis morgens im Zelt schlafen');if(s.day===3)E.addQuest('cleanup');E.toast(`${E.dayName(s.day)}morgen`,'Du wachst auf. Dein Mund fühlt sich an wie ein Aschenbecher mit Sandfüllung.','warn');}
const originalDraw=E.drawScene;
E.drawScene=function(t){originalDraw?.(t);if(S().scene==='world'){ctx.restore();drawExtraHotspots(t);}};
function drawExtraHotspots(t){const s=S(),h=E.hour();ctx.save();if(s.day<=2&&h>=17&&!s.flags.rivalWon)markerWorld(1580,500,'R',C.crew.ronny.color,'RONNY · KAMPF',t);if((h>=22||h<6)){markerWorld(1120,245,'☾','#526ca5','SCHLAFEN',t);markerWorld(1010,1080,'☾','#526ca5','SCHLAFEN',t);}if(s.day===3&&E.minuteOfDay()<720&&!s.flags.cleanupDone)markerWorld(300,820,'♻','#6fbf79','AUFRÄUMEN',t);ctx.restore();}
function markerWorld(wx,wy,glyph,color,label,t){const x=wx-R.camera.x,y=wy-R.camera.y;if(x<-80||y<-80||x>canvas.width+80||y>canvas.height+80)return;const p=1+Math.sin(t*.006+wx)*.08;ctx.save();ctx.translate(x,y);ctx.scale(p,p);ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.ellipse(0,23,24,8,0,0,Math.PI*2);ctx.fill();ctx.fillStyle=color;ctx.beginPath();ctx.arc(0,0,23,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#fff5d2';ctx.lineWidth=3;ctx.stroke();ctx.fillStyle='#fff';ctx.font='900 18px system-ui';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(glyph,0,1);ctx.fillStyle='rgba(10,18,15,.88)';ctx.beginPath();ctx.roundRect(-66,33,132,27,9);ctx.fill();ctx.fillStyle='#fff8dc';ctx.font='800 11px system-ui';ctx.fillText(label,0,47);ctx.restore();}
})();