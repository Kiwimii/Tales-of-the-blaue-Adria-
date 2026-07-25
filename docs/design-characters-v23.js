(()=>{
'use strict';
const E=window.TBA13,C=window.TBA13_CONTENT,M=window.TBA13_MAP,D=E?.design23;
if(!E||!C||!M||!D)throw new Error('Design characters v23: Grundlage fehlt.');
const ctx=E.ctx,S=()=>E.getState();
const traits={
 player:{scale:1.08,item:null},gundula:{scale:1.08,emotion:'angry'},uli:{scale:1.05,item:null},andre:{scale:1.08,item:'beer'},rene:{scale:1.05,item:'beer'},lars:{scale:1.18,item:'beer'},danny:{scale:1.02,item:'beer'},gregor:{scale:1.12,item:'beer'},felix:{scale:1.04,item:null},masl:{scale:1.02,item:'beer'},schubert:{scale:1.04,item:'joint'},schima:{scale:1.08,item:'joint'},ronny:{scale:1.12,emotion:'angry'},nina:{scale:1.02,emotion:'happy'},jule:{scale:1.02,item:null}
};
function hour(){return E.hour()}
function guards(){const p=E.patrolType(),m=E.minuteOfDay();if(p){const route=M.patrolRoutes[p==='round'?'round':'quiet'],start=p==='round'?1080:1320,progress=E.clamp((m-start)/60,0,1)*(route.length-1),i=Math.min(route.length-2,Math.floor(progress)),f=progress-i,a=route[i],b=route[i+1],x=a[0]+(b[0]-a[0])*f,y=a[1]+(b[1]-a[1])*f;return {gundula:{x,y},uli:{x:x-38,y:y+34}}}return {gundula:{x:1040,y:590},uli:{x:1110,y:590}}}
function friend(id){const s=S(),h=hour(),d=s.day;const table={andre:h<15?[1060,215]:h<20?[1120,700]:[960,1030],rene:h<14?[620,620]:h<19?[980,650]:[1240,1020],lars:h<15?[1490,1060]:h<22?[1050,1040]:[1380,720],danny:h<18?[1230,230]:[900,1010],gregor:h<12?[940,1040]:h<21?[1020,1060]:[1160,1010],felix:h<15?[1700,800]:h<22?[1510,650]:[1500,1030],masl:h<13?[1300,690]:[1400,700],schubert:h<19?[1180,260]:[1400,1430],schima:h<20?[820,1010]:[1500,1380]};if(d===3&&h>=10)return {x:260+(C.friendIds.indexOf(id)%5)*72,y:850+Math.floor(C.friendIds.indexOf(id)/5)*72};const p=table[id]||M.friendAnchors[id]||[1100,700];return {x:p[0],y:p[1]}}
function badge(id,x,y,t){const s=S(),rel=s.relations[id]||0;let icon='';if(id==='gundula'&&s.world.hedgeWet)icon='💢';else if(id==='schubert'||id==='schima')icon=h>=19?'💨':'';else if(rel>20)icon='♥';if(!icon)return;ctx.save();ctx.translate(x+22,y-60+Math.sin(t*.005)*3);ctx.fillStyle='rgba(255,250,225,.95)';ctx.beginPath();ctx.arc(0,0,14,0,Math.PI*2);ctx.fill();D.text(icon,0,1,14,'#222','center',800);ctx.restore()}
let last={x:0,y:0,t:0};
function worldCharacters(t){const s=S();const moved=Math.hypot(s.world.x-last.x,s.world.y-last.y)>1.2;last={x:s.world.x,y:s.world.y,t};
 const g=guards();
 const all=[['gundula',g.gundula],['uli',g.uli],...C.friendIds.map(id=>[id,friend(id)])];
 if(s.day<=2&&hour()>=17&&!s.flags.rivalWon)all.push(['ronny',{x:1580,y:500}]);
 for(const [id,p] of all){if(p.x<0)continue;const selected=E.R.nearest?.id===id,opt={...(traits[id]||{}),time:t,selected,dir:'down'};D.drawPerson(id,p.x,p.y,opt);D.drawNameplate(C.crew[id]?.name||id,p.x,p.y+62,traits[id]?.emotion==='angry'?'#48211d':'#15221d');badge(id,p.x,p.y,t)}
 const mood=s.needs.alcohol>70?'shocked':s.needs.dignity<25?'angry':s.needs.flirt>55?'happy':'neutral';D.drawPerson('player',s.world.x,s.world.y,{...traits.player,time:t,moving:moved,dir:s.world.facing,emotion:mood,selected:true,item:s.needs.alcohol>30?'beer':s.needs.highness>35?'joint':null});D.drawNameplate(s.profile?.name||'Spieler',s.world.x,s.world.y+66);
 if(s.needs.alcohol>65){ctx.save();ctx.globalAlpha=.55;for(let i=0;i<3;i++){ctx.fillStyle='#f6d35e';ctx.beginPath();ctx.arc(s.world.x-18+i*18,s.world.y-65+Math.sin(t*.004+i)*5,3+i,0,Math.PI*2);ctx.fill()}ctx.restore()}
}
D.hooks.world.push({layer:'characters',draw:worldCharacters});
})();