(()=>{
'use strict';
const E=window.TBA13,M=window.TBA13_MAP,D=E?.design23;
if(!E||!M||!D)throw new Error('Design world v23: Grundlage fehlt.');
const ctx=E.ctx;
const tile=16;
const clutter=[];
for(let i=0;i<110;i++)clutter.push({x:720+(i*137)%930,y:120+(i*211)%1120,type:i%11===0?'flower':i%7===0?'bag':i%5===0?'chair':'grass'});
const pitches=[];for(let row=0;row<5;row++)for(let col=0;col<7;col++)pitches.push({x:805+col*112,y:455+row*92,w:96,h:72});
function px(v){return Math.round(v/tile)*tile}
function line(points,color,width=4,dash=[]){ctx.save();ctx.beginPath();ctx.moveTo(px(points[0][0]),px(points[0][1]));for(let i=1;i<points.length;i++)ctx.lineTo(px(points[i][0]),px(points[i][1]));ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='butt';ctx.lineJoin='miter';ctx.setLineDash(dash);ctx.stroke();ctx.restore()}
function grassTuft(x,y){ctx.fillStyle='#3e8b42';ctx.fillRect(px(x),px(y),3,8);ctx.fillRect(px(x)-4,px(y)+3,4,3);ctx.fillRect(px(x)+3,px(y)+2,4,3)}
function flower(x,y,c='#ef5f67'){grassTuft(x,y+4);ctx.fillStyle=c;ctx.fillRect(px(x)-4,px(y)-3,5,5);ctx.fillRect(px(x)+2,px(y)-5,5,5);ctx.fillStyle='#ffe7a5';ctx.fillRect(px(x),px(y)-2,3,3)}
function ground(){
 ctx.save();ctx.imageSmoothingEnabled=false;ctx.fillStyle='#78cf54';ctx.fillRect(0,0,M.width,M.height);
 for(let y=0;y<M.height;y+=tile){for(let x=0;x<M.width;x+=tile){const n=((x/tile)*17+(y/tile)*31)%19;if(n===0){ctx.fillStyle='#6ec44b';ctx.fillRect(x,y,tile,tile)}else if(n===3){ctx.fillStyle='#82d75c';ctx.fillRect(x,y,tile,tile)}}}
 for(const p of pitches){D.rect(p.x,p.y,p.w,p.h,'#9ed66d','#4c8b47',2);D.rect(p.x+8,p.y+8,p.w-16,4,'#7db657')}
 for(let i=0;i<120;i++)grassTuft(40+(i*193)%1700,40+(i*277)%1720);
 ctx.restore();
}
function caravan(x,y,rot=0,tone='#f4efcf'){
 ctx.save();ctx.translate(px(x),px(y));D.shadow(4,27,38,9,.24);D.rect(-40,-24,80,48,tone,'#273228',3);D.rect(-32,-16,24,16,'#8fd0d8','#273228',2);D.rect(8,-16,20,32,'#d9cda5','#273228',2);D.rect(13,-10,4,4,'#273228');D.rect(-32,3,72,5,'#d6b453');D.rect(-27,24,12,8,'#22292a');D.rect(17,24,12,8,'#22292a');ctx.restore();
}
function car(x,y,color){ctx.save();ctx.translate(px(x),px(y));D.shadow(0,19,31,8,.22);D.rect(-32,-16,64,32,color,'#202728',3);D.rect(-17,-13,34,17,'#77afbf','#203036',2);D.rect(-24,16,12,7,'#171d1e');D.rect(12,16,12,7,'#171d1e');D.rect(-32,-4,5,8,'#f7df6f');ctx.restore()}
function chair(x,y,color='#df7d55'){ctx.save();ctx.translate(px(x),px(y));D.rect(-14,-12,28,18,color,'#402f29',2);D.rect(-13,6,4,14,'#26362f');D.rect(9,6,4,14,'#26362f');ctx.restore()}
function firepit(x,y,t){D.shadow(x,y+17,32,9,.25);D.rect(x-24,y-8,48,20,'#594232','#2c2923',3);const frame=Math.floor(t/180)%2;ctx.fillStyle=frame?'#ffdf52':'#ff9e3e';ctx.fillRect(px(x-10),px(y-26),8,22);ctx.fillRect(px(x+2),px(y-20),8,16);ctx.fillStyle='#f05b3f';ctx.fillRect(px(x-4),px(y-15),8,15)}
function tree(x,y,s=1){ctx.save();ctx.translate(px(x),px(y));ctx.scale(s,s);D.rect(-8,16,16,34,'#8b5a34','#2d3429',2);D.rect(-34,-28,68,48,'#4c9648','#294d31',3);D.rect(-25,-40,46,28,'#63ad52','#294d31',3);D.rect(-14,-48,28,18,'#72bb59','#294d31',3);ctx.restore()}
function treeLine(){for(let y=390;y<850;y+=56)tree(905+(y%3)*8,y,.85)}
function beach(t){
 for(let i=0;i<9;i++){const x=1640+(i%3)*82,y=690+Math.floor(i/3)*88;D.rect(x-24,y-14,48,28,['#e05d64','#4f8fc0','#f0c94d'][i%3],'#403b32',2)}
 line([[1610,900],[1805,900],[1805,1040],[1610,1040],[1610,900]],'#f4eed1',4,[10,8]);
 for(let i=0;i<6;i++)D.rect(1630+i*34,930+(i%2)*40,10,10,'#fff2d2','#4d5043',1);
 D.rect(1745,1112,176,18,'#8a6b47','#42311f',2);D.rect(1760,1130,10,70,'#6c5439');D.rect(1888,1130,10,70,'#6c5439');
 for(let i=0;i<18;i++)grassTuft(1710+i*17,590+(i%2)*8);
}
function signs(){const list=[[590,450,'EINFAHRT'],[745,400,'WC'],[1045,390,'GUNDULA'],[1465,955,'KIOSK'],[1640,590,'STRAND']];for(const [x,y,l] of list){D.rect(x-3,y,6,26,'#5b4732');D.rect(x-44,y-24,88,24,'#f3dc8e','#463b2c',2);D.text(l,x,y-12,10,'#29342d','center',900)}}
function props(t){
 treeLine();
 const cars=[['#bb4e43',270,430],['#4d718c',350,510],['#6b7048',430,590],['#d0b14c',285,610]];for(const [c,x,y] of cars)car(x,y,c);
 for(let i=0;i<18;i++)caravan(850+(i%6)*111,500+Math.floor(i/6)*98,0,['#f2edcf','#ddd5b8','#fff2ce'][i%3]);
 for(let i=0;i<6;i++){chair(1020+i*38,285+(i%2)*28,['#dd7355','#5e91b8','#d0a745'][i%3]);chair(920+i*45,1120+(i%2)*22,['#d85c55','#557fb0','#6e9f6b'][i%3]);}
 firepit(1195,1085,t);beach(t);signs();
 for(const c of clutter){if(c.type==='chair')chair(c.x,c.y,'#8c7461');else if(c.type==='bag')D.rect(c.x-7,c.y-9,14,18,'#444a40','#1c211e',1);else if(c.type==='flower')flower(c.x,c.y,c.x%2?'#ef5f67':'#f7ef7b');else grassTuft(c.x,c.y)}
 for(let i=0;i<8;i++)tree(80+i*120,120+(i%2)*40,.8);
}
function foreground(){for(let i=0;i<12;i++)tree(1300+i*34,1335+(i%2)*15,.7);for(let i=0;i<8;i++)tree(1510+i*28,625,.55)}
D.hooks.world.push({layer:'ground',draw:ground},{layer:'props',draw:props},{layer:'foreground',draw:foreground});
})();