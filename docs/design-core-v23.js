(()=>{
'use strict';
const E=window.TBA13,C=window.TBA13_CONTENT;
if(!E||!C)throw new Error('Design core v23: Spielmodule fehlen.');
const D=E.design23=E.design23||{hooks:{world:[],screen:[],update:[]},effects:[],version:'2.4.0-pixel'};
const ctx=E.ctx;
ctx.imageSmoothingEnabled=false;
D.clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
D.px=(v,g=2)=>Math.round(v/g)*g;
D.rect=(x,y,w,h,fill,stroke=null,line=2)=>{x=D.px(x);y=D.px(y);w=D.px(w);h=D.px(h);if(fill){ctx.fillStyle=fill;ctx.fillRect(x,y,w,h)}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=line;ctx.strokeRect(x,y,w,h)}};
D.round=(x,y,w,h,r,fill,stroke,line=2)=>D.rect(x,y,w,h,fill,stroke,line);
D.text=(text,x,y,size=16,color='#fff8dc',align='center',weight=800)=>{ctx.fillStyle=color;ctx.textAlign=align;ctx.textBaseline='middle';ctx.font=`${weight} ${size}px monospace`;ctx.fillText(text,D.px(x),D.px(y))};
D.shadow=(x,y,rx=24,ry=9,a=.28)=>{ctx.fillStyle=`rgba(26,38,28,${a})`;ctx.fillRect(D.px(x-rx),D.px(y-ry/2),D.px(rx*2),D.px(ry))};
D.palette={player:'#f4c542',gundula:'#d95d78',uli:'#4c8fc5',andre:'#e3b83f',rene:'#557fbd',lars:'#9a6545',danny:'#6ca977',gregor:'#ce704f',felix:'#875fb4',masl:'#d39b3d',schubert:'#54885d',schima:'#455b83',ronny:'#c34f42',nina:'#b65c91',jule:'#d28a45'};
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
 const bob=(moving?Math.round(Math.sin(t*.012+(x+y)*.01)*2):0)*scale;
 const step=moving?(Math.sin(t*.012+(x+y)*.01)>0?1:-1):0;
 ctx.save();ctx.translate(D.px(x),D.px(y+bob));ctx.scale(scale,scale);ctx.imageSmoothingEnabled=false;
 D.shadow(0,31,18,8,.26);
 if(selected){ctx.strokeStyle='#fff06a';ctx.lineWidth=3;ctx.strokeRect(-21,20,42,14)}
 const side=dir==='left'?-1:dir==='right'?1:0;
 const outline='#202820';
 D.rect(-10,14,8,22,p.pants,outline,2);D.rect(2,14,8,22,p.pants,outline,2);
 D.rect(-12+(step>0?2:0),34,11,6,'#202428');D.rect(1-(step<0?2:0),34,11,6,'#202428');
 D.rect(-14,-8,28,26,p.shirt,outline,2);
 D.rect(-20,-4,6,18,p.skin,outline,2);D.rect(14,-4,6,18,p.skin,outline,2);
 D.rect(-13,-32,26,24,p.skin,outline,2);
 if(dir==='up'){
  D.rect(-13,-35,26,14,p.hair,outline,2);D.rect(-13,-23,5,10,p.hair);
 }else{
  D.rect(-13,-35,26,9,p.hair,outline,2);D.rect(-13,-28,5,7,p.hair);D.rect(8,-28,5,7,p.hair);
  const ex=side*2;D.rect(-8+ex,-23,4,4,'#fff');D.rect(4+ex,-23,4,4,'#fff');D.rect(-6+ex,-22,2,2,'#1b211d');D.rect(6+ex,-22,2,2,'#1b211d');
  if(emotion==='angry'){D.rect(-9,-29,7,2,'#5e3029');D.rect(2,-29,7,2,'#5e3029')}else{D.rect(-8,-28,5,2,'#5e3029');D.rect(3,-28,5,2,'#5e3029')}
  if(emotion==='happy'){D.rect(-5,-15,10,2,'#8c3e39');D.rect(-3,-13,6,2,'#8c3e39')}else if(emotion==='shocked'){D.rect(-2,-16,4,5,'#71352f')}else{D.rect(-4,-15,8,2,'#71352f')}
 }
 if(opt.item==='beer'){D.rect(17,3,7,16,'#d9b24a','#fff1b4',1);D.rect(18,4,5,3,'#fff')}
 if(opt.item==='joint'){D.rect(13,-17,12,3,'#e5d6a4');D.rect(24,-17,3,3,'#d86d4d')}
 ctx.restore();
};
D.drawNameplate=(name,x,y,color='#15221d')=>{ctx.save();ctx.font='800 12px monospace';const w=Math.min(150,ctx.measureText(name).width+20);D.rect(x-w/2,y-13,w,24,'rgba(20,30,22,.92)','#f5e7a8',2);D.text(name,x,y,12,'#fff6d5','center',850);ctx.restore()};
D.spark=(x,y,color='#ffe16c',count=8)=>{for(let i=0;i<count;i++){const a=Math.PI*2*i/count,Dd=E.rand(10,34);D.effects.push({x,y,vx:Math.cos(a)*Dd,vy:Math.sin(a)*Dd-10,life:.55,color,size:E.rand(3,6)})}};
D.hooks.update.push((dt)=>{D.effects.forEach(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=25*dt;p.life-=dt});D.effects=D.effects.filter(p=>p.life>0)});
D.drawEffects=()=>{for(const p of D.effects){ctx.globalAlpha=D.clamp(p.life/.55);D.rect(p.x,p.y,p.size,p.size,p.color)}ctx.globalAlpha=1};
})();