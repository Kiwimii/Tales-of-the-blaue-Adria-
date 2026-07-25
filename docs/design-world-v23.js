(()=>{
'use strict';
const E=window.TBA13,M=window.TBA13_MAP,D=E?.design23;
if(!E||!M||!D)throw new Error('Design world v23: Grundlage fehlt.');
const ctx=E.ctx;
const clutter=[];
for(let i=0;i<90;i++)clutter.push({x:720+(i*137)%930,y:120+(i*211)%1120,type:i%9===0?'bag':i%5===0?'chair':'grass',rot:(i%7-.5)*.2});
const pitches=[];for(let row=0;row<5;row++)for(let col=0;col<7;col++)pitches.push({x:805+col*112,y:455+row*92,w:96,h:72});
function line(points,color,width,dash=[]){ctx.save();ctx.beginPath();ctx.moveTo(points[0][0],points[0][1]);for(let i=1;i<points.length;i++)ctx.lineTo(points[i][0],points[i][1]);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.lineJoin='round';ctx.setLineDash(dash);ctx.stroke();ctx.restore()}
function ground(){
 ctx.save();
 const grad=ctx.createLinearGradient(0,0,0,M.height);grad.addColorStop(0,'rgba(244,217,126,.09)');grad.addColorStop(.45,'rgba(65,103,53,.03)');grad.addColorStop(1,'rgba(39,76,44,.14)');ctx.fillStyle=grad;ctx.fillRect(0,0,M.width,M.height);
 for(const p of pitches){D.round(p.x,p.y,p.w,p.h,9,'rgba(182,163,104,.12)','rgba(248,225,162,.16)',1);ctx.fillStyle='rgba(40,57,40,.13)';ctx.fillRect(p.x+10,p.y+8,p.w-20,3)}
 for(let i=0;i<180;i++){const x=(i*193)%1680+35,y=(i*277)%1780+35;if(x>1740)continue;ctx.fillStyle=i%4?'rgba(240,219,148,.08)':'rgba(30,65,35,.11)';ctx.beginPath();ctx.ellipse(x,y,2+i%4,1.5+i%3,(i%6)*.4,0,Math.PI*2);ctx.fill()}
 ctx.restore();
}
function caravan(x,y,rot=0,tone='#eee3ce'){
 ctx.save();ctx.translate(x,y);ctx.rotate(rot);D.shadow(4,25,40,10,.25);D.round(-37,-22,74,44,9,tone,'#423d35',3);D.round(-27,-13,22,16,3,'#74a6b2','#33444a',2);D.round(8,-13,18,27,2,'#cdbf9e','#4d4538',2);ctx.fillStyle='#2a302f';ctx.beginPath();ctx.arc(-23,24,7,0,Math.PI*2);ctx.arc(23,24,7,0,Math.PI*2);ctx.fill();ctx.fillStyle='#f4ca54';ctx.fillRect(-37,-3,4,8);ctx.restore();
}
function car(x,y,color,rot=0){ctx.save();ctx.translate(x,y);ctx.rotate(rot);D.shadow(0,18,32,8,.24);D.round(-31,-15,62,30,10,color,'#202728',3);D.round(-18,-12,36,18,6,'#527987','#203036',2);ctx.fillStyle='#171d1e';ctx.beginPath();ctx.arc(-20,16,6,0,Math.PI*2);ctx.arc(20,16,6,0,Math.PI*2);ctx.fill();ctx.restore()}
function chair(x,y,rot=0,color='#df7d55'){ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.strokeStyle='#26362f';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(-10,-8);ctx.lineTo(-15,15);ctx.moveTo(10,-8);ctx.lineTo(15,15);ctx.stroke();D.round(-14,-12,28,19,4,color,'#402f29',2);ctx.restore()}
function firepit(x,y,t){D.shadow(x,y+17,34,10,.28);ctx.fillStyle='#4b3a30';ctx.beginPath();ctx.arc(x,y,27,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#8a7763';ctx.lineWidth=7;ctx.stroke();for(let i=0;i<4;i++){ctx.fillStyle=i%2?'#f2c550':'#e6613f';ctx.beginPath();ctx.moveTo(x-12+i*7,y+10);ctx.quadraticCurveTo(x-15+i*7,y-18-Math.sin(t*.008+i)*6,x-2+i*7,y+8);ctx.fill()}}
function treeLine(){for(let y=390;y<850;y+=46){const x=905+Math.sin(y*.04)*13;ctx.fillStyle='#254632';ctx.beginPath();ctx.arc(x,y,22,0,Math.PI*2);ctx.fill();ctx.fillStyle='#365f3d';ctx.beginPath();ctx.arc(x-7,y-7,14,0,Math.PI*2);ctx.fill();}}
function beach(t){
 for(let i=0;i<9;i++){const x=1640+(i%3)*82,y=690+Math.floor(i/3)*88;ctx.save();ctx.translate(x,y);ctx.rotate((i%4-.5)*.15);ctx.fillStyle=['#d85f5c','#4f8fc0','#e0b84d'][i%3];ctx.fillRect(-23,-13,46,26);ctx.strokeStyle='rgba(255,255,255,.45)';ctx.lineWidth=3;ctx.strokeRect(-23,-13,46,26);ctx.restore()}
 line([[1610,900],[1805,900]],'rgba(235,232,212,.6)',4,[8,9]);line([[1610,900],[1610,1040]],'rgba(235,232,212,.6)',4,[8,9]);line([[1805,900],[1805,1040]],'rgba(235,232,212,.6)',4,[8,9]);line([[1610,1040],[1805,1040]],'rgba(235,232,212,.6)',4,[8,9]);
 for(let i=0;i<6;i++){const x=1630+i*34,y=930+(i%2)*40;ctx.fillStyle='#fff2d2';ctx.beginPath();ctx.arc(x,y,7,0,Math.PI*2);ctx.fill();}
 line([[1745,1120],[1910,1120]],'#8a6b47',18);line([[1760,1135],[1760,1200]],'#6c5439',8);line([[1888,1135],[1888,1200]],'#6c5439',8);
 for(let i=0;i<18;i++){const x=1710+i*17,y=590+Math.sin(i*.8+t*.001)*8;ctx.strokeStyle='#527b48';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(x,y+32);ctx.lineTo(x+Math.sin(i)*5,y);ctx.stroke()}
}
function signs(){const list=[[590,450,'EINFAHRT'],[745,400,'WC'],[1045,390,'GUNDULA'],[1465,955,'KIOSK'],[1640,590,'STRAND']];for(const [x,y,l] of list){ctx.fillStyle='#5b4732';ctx.fillRect(x-3,y,6,25);D.round(x-42,y-22,84,24,5,'#e6ce88','#463b2c',2);D.text(l,x,y-10,9,'#29342d','center',900)}}
function props(t){
 treeLine();
 const cars=[['#a84f43',270,430,.04],['#4d718c',350,510,-.03],['#6b7048',430,590,.02],['#d0b14c',285,610,-.04]];for(const [c,x,y,r] of cars)car(x,y,c,r);
 for(let i=0;i<18;i++)caravan(850+(i%6)*111,500+Math.floor(i/6)*98,(i%3-1)*.035,['#e7e2d2','#d8cfb7','#efe5c9'][i%3]);
 for(let i=0;i<6;i++){chair(1020+i*38,285+(i%2)*28,(i%3-1)*.3,['#dd7355','#5e91b8','#d0a745'][i%3]);chair(920+i*45,1120+(i%2)*22,(i%3-1)*.25,['#d85c55','#557fb0','#6e9f6b'][i%3]);}
 firepit(1195,1085,t);beach(t);signs();
 for(const c of clutter){if(c.type==='chair')chair(c.x,c.y,c.rot,'#8c7461');else if(c.type==='bag'){D.round(c.x-7,c.y-9,14,18,4,'#444a40','#1c211e',1)}else{ctx.strokeStyle='rgba(37,79,41,.45)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(c.x,c.y+5);ctx.lineTo(c.x-2,c.y-4);ctx.moveTo(c.x,c.y+5);ctx.lineTo(c.x+4,c.y-2);ctx.stroke();}}
}
function foreground(t){
 for(let i=0;i<12;i++){const x=1300+i*25,y=1320+Math.sin(i*.7)*20;ctx.fillStyle=i%2?'#2f5938':'#3b6741';ctx.beginPath();ctx.arc(x,y,17+i%3*4,0,Math.PI*2);ctx.fill()}
 for(let i=0;i<8;i++){const x=1510+i*22,y=610;ctx.fillStyle='#314e36';ctx.beginPath();ctx.arc(x,y,15,0,Math.PI*2);ctx.fill()}
}
D.hooks.world.push({layer:'ground',draw:ground},{layer:'props',draw:props},{layer:'foreground',draw:foreground});
})();