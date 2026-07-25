(()=>{
'use strict';
const E=window.TBA13,C=window.TBA13_CONTENT;
if(!E||!C)throw new Error('Design core v23: Spielmodule fehlen.');
const D=E.design23=E.design23||{hooks:{world:[],screen:[],update:[]},effects:[],version:'2.3.0'};
const ctx=E.ctx;
D.clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
D.round=(x,y,w,h,r,fill,stroke,line=2)=>{ctx.beginPath();ctx.roundRect(x,y,w,h,r);if(fill){ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=line;ctx.stroke()}};
D.text=(text,x,y,size=16,color='#fff8dc',align='center',weight=800)=>{ctx.fillStyle=color;ctx.textAlign=align;ctx.textBaseline='middle';ctx.font=`${weight} ${size}px system-ui,-apple-system,sans-serif`;ctx.fillText(text,x,y)};
D.shadow=(x,y,rx=24,ry=9,a=.28)=>{ctx.fillStyle=`rgba(0,0,0,${a})`;ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fill()};
D.palette={player:'#e6bc4f',gundula:'#c75d7a',uli:'#4e89ad',andre:'#d9ae47',rene:'#557fbd',lars:'#9a6545',danny:'#6ca977',gregor:'#ce704f',felix:'#875fb4',masl:'#d39b3d',schubert:'#54885d',schima:'#455b83',ronny:'#c34f42',nina:'#b65c91',jule:'#d28a45'};
D.profile=(id)=>{
 const crew=C.crew[id]||{};
 const seed=[...String(id)].reduce((a,ch)=>a+ch.charCodeAt(0),0);
 const colors={shirt:crew.color||D.palette[id]||`hsl(${seed%360} 48% 52%)`,skin:['#f1c39f','#deb08b','#c98e67','#e8b58d'][seed%4],hair:['#2c211d','#5c3926','#9c7041','#27282e'][seed%4],pants:['#263b48','#3d3938','#405744','#352e4c'][seed%4]};
 if(id==='player'){
  const s=E.getState();return {...colors,shirt:s.profile?.shirt||colors.shirt,skin:s.profile?.skin||colors.skin,hair:s.profile?.hair||colors.hair,name:s.profile?.name||'Spieler'};
 }
 return {...colors,name:crew.name||id};
};
D.drawPerson=(id,x,y,opt={})=>{
 const p=D.profile(id),t=opt.time||performance.now(),moving=!!opt.moving,dir=opt.dir||'down',scale=opt.scale||1,selected=!!opt.selected,emotion=opt.emotion||'neutral';
 const bob=(moving?Math.sin(t*.014+(x+y)*.01)*2.5:Math.sin(t*.003+(x+y)*.01)*1.2)*scale;
 const step=moving?Math.sin(t*.014+(x+y)*.01)*6:0;
 ctx.save();ctx.translate(x,y+bob);ctx.scale(scale,scale);
 D.shadow(0,29,22,8,.32);
 if(selected){ctx.strokeStyle='#ffe16c';ctx.lineWidth=4;ctx.beginPath();ctx.ellipse(0,25,29,13,0,0,Math.PI*2);ctx.stroke();}
 const side=dir==='left'?-1:dir==='right'?1:0;
 ctx.lineCap='round';
 ctx.strokeStyle=p.skin;ctx.lineWidth=9;ctx.beginPath();ctx.moveTo(-14,-2);ctx.lineTo(-22+side*3,12+step*.25);ctx.moveTo(14,-2);ctx.lineTo(22+side*3,12-step*.25);ctx.stroke();
 ctx.strokeStyle=p.pants;ctx.lineWidth=11;ctx.beginPath();ctx.moveTo(-7,20);ctx.lineTo(-9+step*.4,43);ctx.moveTo(7,20);ctx.lineTo(9-step*.4,43);ctx.stroke();
 ctx.strokeStyle='#20282d';ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(-14+step*.4,44);ctx.lineTo(-5+step*.4,44);ctx.moveTo(4-step*.4,44);ctx.lineTo(14-step*.4,44);ctx.stroke();
 D.round(-18,-12,36,38,12,p.shirt,'#19231f',2.5);
 ctx.fillStyle=p.skin;ctx.beginPath();ctx.arc(0,-29,17,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#19231f';ctx.lineWidth=2.5;ctx.stroke();
 ctx.fillStyle=p.hair;ctx.beginPath();ctx.arc(0,-34,17,Math.PI,Math.PI*2);ctx.lineTo(16,-29);ctx.quadraticCurveTo(9,-43,0,-45);ctx.quadraticCurveTo(-10,-43,-17,-29);ctx.closePath();ctx.fill();
 if(dir!=='up'){
  const eyeY=-29,ex=side*3;ctx.fillStyle='#fff';ctx.beginPath();ctx.ellipse(-6+ex,eyeY,4.2,3.6,0,0,Math.PI*2);ctx.ellipse(6+ex,eyeY,4.2,3.6,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#15211d';ctx.beginPath();ctx.arc(-5+ex,eyeY,.1+1.6,0,Math.PI*2);ctx.arc(7+ex,eyeY,.1+1.6,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='#5e3029';ctx.lineWidth=2;ctx.beginPath();if(emotion==='angry'){ctx.moveTo(-11,-38);ctx.lineTo(-3,-35);ctx.moveTo(11,-38);ctx.lineTo(3,-35);}else{ctx.moveTo(-10,-36);ctx.lineTo(-3,-37);ctx.moveTo(10,-36);ctx.lineTo(3,-37);}ctx.stroke();
  ctx.beginPath();if(emotion==='happy'){ctx.arc(0,-20,6,0,Math.PI);}else if(emotion==='shocked'){ctx.arc(0,-20,3,0,Math.PI*2);}else{ctx.moveTo(-5,-20);ctx.quadraticCurveTo(0,-18,5,-20);}ctx.stroke();
 }
 if(opt.item==='beer'){ctx.fillStyle='#d9b24a';D.round(18,4,8,17,2,'#d9b24a','#fff1b4',1);ctx.fillStyle='#fff';ctx.fillRect(19,5,6,3)}
 if(opt.item==='joint'){ctx.strokeStyle='#e5d6a4';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(13,-18);ctx.lineTo(25,-14);ctx.stroke();ctx.fillStyle='#d86d4d';ctx.beginPath();ctx.arc(26,-14,2,0,Math.PI*2);ctx.fill();}
 ctx.restore();
};
D.drawNameplate=(name,x,y,color='#15221d')=>{ctx.save();ctx.font='800 12px system-ui';const w=Math.min(150,ctx.measureText(name).width+20);D.round(x-w/2,y-13,w,25,9,'rgba(8,17,13,.88)','rgba(255,255,255,.2)',1);D.text(name,x,y,12,'#fff6d5','center',850);ctx.restore()};
D.spark=(x,y,color='#ffe16c',count=8)=>{for(let i=0;i<count;i++){const a=Math.PI*2*i/count,Dd=E.rand(10,34);D.effects.push({x,y,vx:Math.cos(a)*Dd,vy:Math.sin(a)*Dd-10,life:.55,color,size:E.rand(2,5)})}};
D.hooks.update.push((dt)=>{D.effects.forEach(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=25*dt;p.life-=dt});D.effects=D.effects.filter(p=>p.life>0)});
D.drawEffects=()=>{for(const p of D.effects){ctx.globalAlpha=D.clamp(p.life/.55);ctx.fillStyle=p.color;ctx.beginPath();ctx.arc(p.x,p.y,p.size,0,Math.PI*2);ctx.fill()}ctx.globalAlpha=1};
})();