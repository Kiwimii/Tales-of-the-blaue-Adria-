(()=>{
'use strict';
const E=window.TBA13,C=window.TBA13_CONTENT,M=window.TBA13_MAP;
if(!E||!C||!M)throw new Error('UX-v15 kann die Spielmodule nicht finden.');
const S=()=>E.getState(),R=E.R,ctx=E.ctx,canvas=E.el.canvas,stage=E.el.stage;
const visuals=E.visuals=E.visuals||{};
const zoomLevels=[1.12,1.24,1.36,1.5];
const props=[
 {type:'table',x:1020,y:250,r:31,solid:true},{type:'crate',x:1090,y:282,r:18,solid:true},{type:'cooler',x:1180,y:210,r:20,solid:true},
 {type:'grill',x:935,y:1055,r:23,solid:true},{type:'table',x:1060,y:1075,r:32,solid:true},{type:'crate',x:1145,y:1030,r:18,solid:true},
 {type:'umbrella',x:1680,y:720,r:25,solid:true},{type:'towel',x:1740,y:790,r:0},{type:'towel',x:1650,y:870,r:0},
 {type:'bench',x:1480,y:1110,r:28,solid:true},{type:'bin',x:1570,y:1065,r:19,solid:true},{type:'sign',x:635,y:455,r:14,solid:true},
 {type:'lamp',x:760,y:610,r:12,solid:true},{type:'lamp',x:1110,y:655,r:12,solid:true},{type:'lamp',x:1450,y:780,r:12,solid:true},
 {type:'bush',x:900,y:705,r:28,solid:true},{type:'bush',x:930,y:760,r:26,solid:true},{type:'bush',x:1260,y:1270,r:30,solid:true},
 {type:'fire',x:1225,y:1070,r:34,solid:true},{type:'speaker',x:1325,y:635,r:20,solid:true}
];
const groundMarks=Array.from({length:240},(_,i)=>({
 x:70+(i*197)%1620,y:70+(i*283)%1680,a:.04+(i%4)*.012,s:2+(i%5)
})).filter(p=>!pointInPolygon(p.x,p.y,M.lake));
let lastSafe={x:250,y:760},mapCanvas=null;

function pointInPolygon(x,y,poly){let inside=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const xi=poly[i][0],yi=poly[i][1],xj=poly[j][0],yj=poly[j][1];const hit=((yi>y)!==(yj>y))&&(x<(xj-xi)*(y-yi)/(yj-yi)+xi);if(hit)inside=!inside;}return inside;}
function insideRect(x,y,rx,ry,rw,rh,pad=0){return x>rx-pad&&x<rx+rw+pad&&y>ry-pad&&y<ry+rh+pad;}
function nearCircle(x,y,cx,cy,r){return Math.hypot(x-cx,y-cy)<r;}
function collidesAt(x,y){
 if(x<38||y<38||x>M.width-38||y>M.height-38)return true;
 if(pointInPolygon(x,y,M.lake))return true;
 for(const b of M.buildings)if(insideRect(x,y,b.x,b.y,b.w,b.h,13))return true;
 if(insideRect(x,y,M.zones.hedge.x,M.zones.hedge.y,M.zones.hedge.w,M.zones.hedge.h,8))return true;
 for(const c of M.caravans)if(nearCircle(x,y,c.x,c.y,c.type==='tent'?25:30))return true;
 for(const t of M.northTents)if(nearCircle(x,y,t.x,t.y,27))return true;
 for(const t of M.southTents)if(nearCircle(x,y,t.x,t.y,27))return true;
 for(const tr of M.trees)if(nearCircle(x,y,tr.x,tr.y,Math.max(10,tr.r*.4)))return true;
 for(const p of props)if(p.solid&&nearCircle(x,y,p.x,p.y,p.r))return true;
 return false;
}
function resolveNaturalCollision(ox,oy){
 const s=S(),nx=s.world.x,ny=s.world.y;
 if(!collidesAt(nx,ny)){lastSafe={x:nx,y:ny};return;}
 if(!collidesAt(nx,oy)){s.world.y=oy;lastSafe={x:nx,y:oy};return;}
 if(!collidesAt(ox,ny)){s.world.x=ox;lastSafe={x:ox,y:ny};return;}
 s.world.x=Number.isFinite(lastSafe.x)?lastSafe.x:ox;
 s.world.y=Number.isFinite(lastSafe.y)?lastSafe.y:oy;
 stage.classList.remove('collision-bump');void stage.offsetWidth;stage.classList.add('collision-bump');
}

function installWorldHud(){
 const hud=document.createElement('div');hud.className='world-ux-layer';hud.innerHTML=`
  <div class="world-area-chip"><small>GEBIET</small><strong id="world-area-v15">Campingwege</strong></div>
  <div class="world-zoom-controls" aria-label="Kamerazoom"><button type="button" data-zoom="out" aria-label="Weiter herauszoomen">−</button><span id="world-zoom-label">125%</span><button type="button" data-zoom="in" aria-label="Näher heranzoomen">+</button></div>
  <button type="button" id="context-action-v15" class="context-action-v15 hidden"><span>!</span><div><small>AKTION</small><strong>Interagieren</strong></div></button>`;
 stage.append(hud);
 hud.querySelector('[data-zoom="out"]').addEventListener('click',()=>changeZoom(-1));
 hud.querySelector('[data-zoom="in"]').addEventListener('click',()=>changeZoom(1));
 hud.querySelector('#context-action-v15').addEventListener('click',()=>E.world?.interact?.());
}
function currentZoomIndex(){const s=S();s.settings=s.settings||{};if(!Number.isInteger(s.settings.zoomIndex))s.settings.zoomIndex=matchMedia('(max-width:700px)').matches?2:1;return E.clamp(s.settings.zoomIndex,0,zoomLevels.length-1);}
function applyZoom(){const idx=currentZoomIndex(),z=zoomLevels[idx];stage.style.setProperty('--world-zoom',z);const label=document.getElementById('world-zoom-label');if(label)label.textContent=`${Math.round(z*100)}%`;}
function changeZoom(delta){const s=S();s.settings=s.settings||{};s.settings.zoomIndex=E.clamp(currentZoomIndex()+delta,0,zoomLevels.length-1);E.save();applyZoom();}
function updateWorldHud(){
 const s=S(),world=s.scene==='world';stage.classList.toggle('world-view-v15',world);
 if(!world)return;
 applyZoom();
 const area=document.getElementById('world-area-v15');if(area)area.textContent=s.world.lastArea||'Campingwege';
 const action=document.getElementById('context-action-v15');if(action){
  const label=R.nearest?.label;
  action.classList.toggle('hidden',!label);
  if(label)action.querySelector('strong').textContent=label;
 }
}

function drawBoundary(){
 ctx.save();ctx.strokeStyle='rgba(32,55,38,.72)';ctx.lineWidth=18;ctx.setLineDash([34,20]);ctx.strokeRect(28,28,M.width-56,M.height-56);ctx.setLineDash([]);
 for(let x=55;x<M.width-30;x+=90){post(x,38);post(x,M.height-38);}for(let y=90;y<M.height-30;y+=92){post(38,y);post(M.width-38,y);}ctx.restore();
}
function post(x,y){ctx.fillStyle='#4d3b2b';ctx.fillRect(x-4,y-15,8,30);ctx.fillStyle='#7b664c';ctx.fillRect(x-6,y-16,12,5);}
function drawGround(t){
 drawBoundary();
 for(const g of groundMarks){ctx.fillStyle=`rgba(238,223,154,${g.a})`;ctx.beginPath();ctx.ellipse(g.x,g.y,g.s*2,g.s,((g.x+g.y)%7)*.2,0,Math.PI*2);ctx.fill();}
 for(let i=0;i<36;i++){const x=1620+(i*37)%240,y=620+(i*71)%390;ctx.fillStyle='rgba(109,78,45,.18)';ctx.beginPath();ctx.ellipse(x,y,5,11,(i%4)*.5,0,Math.PI*2);ctx.fill();}
}
function drawProps(t){
 const sorted=[...props].sort((a,b)=>a.y-b.y);for(const p of sorted)drawProp(p,t);
 drawNaturalCollisionHints();
}
function drawProp(p,t){ctx.save();ctx.translate(p.x,p.y);switch(p.type){
 case'table':ctx.fillStyle='rgba(0,0,0,.2)';ctx.beginPath();ctx.ellipse(0,18,45,13,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#8b603d';round(-38,-8,76,25,7);ctx.fillStyle='#59412e';ctx.fillRect(-30,14,8,24);ctx.fillRect(22,14,8,24);break;
 case'crate':ctx.fillStyle='#8d5b2e';round(-19,-16,38,32,5);ctx.strokeStyle='#d5a45f';ctx.lineWidth=3;ctx.strokeRect(-13,-10,26,20);for(let i=-8;i<=8;i+=8){ctx.fillStyle='#5b2f20';ctx.beginPath();ctx.arc(i,-2,4,0,Math.PI*2);ctx.fill();}break;
 case'cooler':ctx.fillStyle='#d5e1dd';round(-22,-14,44,28,6);ctx.fillStyle='#55a3bd';ctx.fillRect(-20,-8,40,18);ctx.strokeStyle='#26393e';ctx.stroke();break;
 case'grill':ctx.fillStyle='#2b3131';ctx.beginPath();ctx.arc(0,-3,22,0,Math.PI);ctx.fill();ctx.strokeStyle='#1a2020';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(-12,8);ctx.lineTo(-17,31);ctx.moveTo(12,8);ctx.lineTo(17,31);ctx.stroke();for(let i=0;i<3;i++){ctx.strokeStyle=`rgba(220,220,210,${.12+i*.05})`;ctx.beginPath();ctx.moveTo(-8+i*8,-20);ctx.quadraticCurveTo(-18+i*8,-38+Math.sin(t*.003+i)*5,-5+i*8,-52);ctx.stroke();}break;
 case'umbrella':ctx.fillStyle='#d85f58';ctx.beginPath();ctx.arc(0,-15,34,Math.PI,Math.PI*2);ctx.fill();ctx.fillStyle='#f2c861';ctx.beginPath();ctx.moveTo(-34,-15);ctx.lineTo(0,-49);ctx.lineTo(34,-15);ctx.fill();ctx.strokeStyle='#66533c';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(0,-15);ctx.lineTo(0,30);ctx.stroke();break;
 case'towel':ctx.fillStyle='rgba(255,255,255,.18)';round(-29,-16,58,32,4);ctx.fillStyle='#5ba7be';ctx.fillRect(-24,-12,12,24);ctx.fillStyle='#e6bd5b';ctx.fillRect(-5,-12,24,24);break;
 case'bench':ctx.fillStyle='#6e4f35';round(-36,-10,72,14,4);ctx.fillRect(-31,5,8,20);ctx.fillRect(23,5,8,20);ctx.strokeStyle='#35291f';ctx.stroke();break;
 case'bin':ctx.fillStyle='#31584b';round(-15,-20,30,40,5);ctx.fillStyle='#182d27';ctx.fillRect(-18,-23,36,7);break;
 case'sign':ctx.strokeStyle='#5b412d';ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(0,-10);ctx.lineTo(0,31);ctx.stroke();ctx.fillStyle='#efe0a4';round(-34,-34,68,28,5);ctx.fillStyle='#263e34';ctx.font='900 11px system-ui';ctx.textAlign='center';ctx.fillText('PLATZ',0,-16);break;
 case'lamp':ctx.strokeStyle='#39463f';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(0,20);ctx.lineTo(0,-27);ctx.stroke();ctx.fillStyle=E.hour()>=20||E.hour()<6?'#ffd887':'#c8d2ca';ctx.beginPath();ctx.arc(0,-31,9,0,Math.PI*2);ctx.fill();if(E.hour()>=20||E.hour()<6){const g=ctx.createRadialGradient(0,-31,2,0,-31,48);g.addColorStop(0,'rgba(255,220,130,.28)');g.addColorStop(1,'rgba(255,220,130,0)');ctx.fillStyle=g;ctx.fillRect(-50,-80,100,100);}break;
 case'bush':ctx.fillStyle='#2d5c3b';for(const q of [[-13,2,18],[8,0,20],[0,-12,18]]){ctx.beginPath();ctx.arc(q[0],q[1],q[2],0,Math.PI*2);ctx.fill();}ctx.strokeStyle='rgba(214,235,184,.28)';ctx.lineWidth=2;ctx.stroke();break;
 case'fire':for(let i=0;i<5;i++){ctx.strokeStyle='#6b4027';ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(-22+i*11,18);ctx.lineTo(18-i*8,-2);ctx.stroke();}ctx.fillStyle='#e65d35';ctx.beginPath();ctx.moveTo(-13,10);ctx.quadraticCurveTo(-4,-25+Math.sin(t*.008)*5,2,2);ctx.quadraticCurveTo(13,-17,16,11);ctx.fill();ctx.fillStyle='#f5c84f';ctx.beginPath();ctx.moveTo(-5,9);ctx.quadraticCurveTo(1,-9,8,8);ctx.fill();break;
 case'speaker':ctx.fillStyle='#242b2c';round(-18,-28,36,56,5);for(const cy of [-12,12]){ctx.fillStyle='#111718';ctx.beginPath();ctx.arc(0,cy,10,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#66706c';ctx.stroke();}break;
 }ctx.restore();}
function round(x,y,w,h,r){ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill();}
function drawNaturalCollisionHints(){
 const s=S();if(s.settings?.showBoundaries===false)return;
 ctx.save();ctx.setLineDash([5,7]);ctx.lineWidth=2;ctx.strokeStyle='rgba(246,216,119,.46)';ctx.fillStyle='rgba(15,30,23,.12)';
 const drawCircle=(x,y,r)=>{if(Math.hypot(s.world.x-x,s.world.y-y)>470)return;ctx.beginPath();ctx.ellipse(x,y+8,r,r*.55,0,0,Math.PI*2);ctx.fill();ctx.stroke();};
 for(const tr of M.trees)drawCircle(tr.x,tr.y,Math.max(10,tr.r*.4));
 for(const c of M.caravans)drawCircle(c.x,c.y,c.type==='tent'?25:30);
 for(const t of M.northTents)drawCircle(t.x,t.y,27);for(const t of M.southTents)drawCircle(t.x,t.y,27);
 for(const p of props)if(p.solid)drawCircle(p.x,p.y,p.r);
 ctx.setLineDash([]);ctx.restore();
}
function drawForeground(t){
 if(R.nearest){const x=R.nearest.x,y=R.nearest.y;if(Number.isFinite(x)&&Number.isFinite(y)){ctx.save();ctx.strokeStyle=`rgba(255,222,100,${.65+Math.sin(t*.008)*.25})`;ctx.lineWidth=5;ctx.beginPath();ctx.ellipse(x,y+13,42,22,0,0,Math.PI*2);ctx.stroke();ctx.restore();}}
}
Object.assign(visuals,{drawGround,drawProps,drawForeground});

const originalUpdate=E.updateScene;
E.updateScene=function(dt,t){const s=S(),ox=s.world.x,oy=s.world.y;originalUpdate?.(dt,t);if(s.scene==='world')resolveNaturalCollision(ox,oy);updateWorldHud();};

function installMapUpgrade(){
 const button=document.getElementById('map-button');if(!button)return;
 button.addEventListener('click',()=>setTimeout(renderDetailedMap,0));
}
function renderDetailedMap(){
 const content=document.getElementById('drawer-content');if(!content||document.getElementById('drawer-layer')?.classList.contains('hidden'))return;
 content.innerHTML=`<div class="map-v15-wrap"><canvas id="map-v15-canvas" width="760" height="500" aria-label="Detaillierte Platzkarte"></canvas><div class="map-v15-legend"><span><i class="walkable"></i> frei begehbar</span><span><i class="blocked"></i> natürliche Grenze</span><span><i class="water"></i> Wasser</span><span><i class="player"></i> deine Position</span></div><label class="map-boundary-toggle"><input id="boundary-toggle-v15" type="checkbox" ${S().settings?.showBoundaries===false?'':'checked'}> Laufgrenzen in der Welt sichtbar anzeigen</label><p>Freie Wiesen und offene Wege sind begehbar. Gebäude, Zelte, Wohnwagen, Baumstämme, Hecken, feste Ausstattung und das Wasser blockieren.</p></div>`;
 mapCanvas=document.getElementById('map-v15-canvas');drawDetailedMap();
 document.getElementById('boundary-toggle-v15').addEventListener('change',e=>{const s=S();s.settings=s.settings||{};s.settings.showBoundaries=e.target.checked;E.save();});
}
function drawDetailedMap(){if(!mapCanvas)return;const x=mapCanvas.getContext('2d'),sx=mapCanvas.width/M.width,sy=mapCanvas.height/M.height;const P=(px,py)=>[px*sx,py*sy];x.clearRect(0,0,mapCanvas.width,mapCanvas.height);x.fillStyle='#769e5d';x.fillRect(0,0,mapCanvas.width,mapCanvas.height);
 const poly=(pts,fill,stroke)=>{x.beginPath();const a=P(...pts[0]);x.moveTo(...a);for(let i=1;i<pts.length;i++)x.lineTo(...P(...pts[i]));x.closePath();x.fillStyle=fill;x.fill();if(stroke){x.strokeStyle=stroke;x.lineWidth=2;x.stroke();}};
 M.forests.forEach(f=>poly(f,'#365f3d'));poly(M.lake,'#3d8da8','#b7e7e2');poly(M.beach,'#d7c584','#fff1b4');
 for(const r of M.roads){x.beginPath();x.moveTo(...P(...r.points[0]));for(let i=1;i<r.points.length;i++)x.lineTo(...P(...r.points[i]));x.strokeStyle='#8b887d';x.lineWidth=Math.max(3,r.w*sx);x.stroke();}
 for(const b of M.buildings){x.fillStyle='#b87050';x.fillRect(b.x*sx,b.y*sy,b.w*sx,b.h*sy);}
 x.fillStyle='rgba(24,42,31,.82)';for(const tr of M.trees){x.beginPath();x.arc(tr.x*sx,tr.y*sy,Math.max(1.5,tr.r*sx*.45),0,Math.PI*2);x.fill();}
 x.fillStyle='#e8dfc8';for(const c of M.caravans)x.fillRect(c.x*sx-3,c.y*sy-2,6,4);
 x.strokeStyle='#f2c85a';x.lineWidth=2;x.setLineDash([5,4]);x.strokeRect(4,4,mapCanvas.width-8,mapCanvas.height-8);x.setLineDash([]);
 const s=S(),pp=P(s.world.x,s.world.y);x.fillStyle='#ffe56e';x.beginPath();x.arc(pp[0],pp[1],7,0,Math.PI*2);x.fill();x.strokeStyle='#18231f';x.lineWidth=3;x.stroke();
 x.font='800 12px system-ui';x.fillStyle='#fff8dc';x.textAlign='center';for(const z of Object.values(M.zones)){const p=P(z.x+z.w/2,z.y+z.h/2);x.fillText(z.name,p[0],p[1]);}
}

installWorldHud();installMapUpgrade();applyZoom();
addEventListener('resize',applyZoom,{passive:true});
})();