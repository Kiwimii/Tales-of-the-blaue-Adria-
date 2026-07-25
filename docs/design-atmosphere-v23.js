(()=>{
'use strict';
const E=window.TBA13,D=E?.design23,M=window.TBA13_MAP;
if(!E||!D||!M)throw new Error('Design atmosphere v23: Grundlage fehlt.');
const ctx=E.ctx,S=()=>E.getState();
const fireflies=Array.from({length:34},(_,i)=>({x:730+(i*191)%950,y:220+(i*137)%1180,p:i*.7}));
function world(t){const s=S(),m=E.minuteOfDay(),h=m/60;
 for(let i=0;i<35;i++){const x=1745+(i*57)%990,y=100+(i*83)%1650;ctx.strokeStyle=`rgba(210,244,246,${.08+(i%4)*.025})`;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x,y+Math.sin(t*.001+i)*4);ctx.quadraticCurveTo(x+24,y-5,x+48,y+Math.sin(t*.001+i+1)*4);ctx.stroke()}
 const night=h>=20||h<6;if(night){for(const p of fireflies){const a=.25+.55*(.5+.5*Math.sin(t*.004+p.p));ctx.fillStyle=`rgba(255,229,102,${a})`;ctx.beginPath();ctx.arc(p.x+Math.sin(t*.001+p.p)*18,p.y+Math.cos(t*.0013+p.p)*12,2.4,0,Math.PI*2);ctx.fill()}}
 const fires=[[1195,1085],[1015,300]];for(const [x,y] of fires){const glow=ctx.createRadialGradient(x,y,5,x,y,115);glow.addColorStop(0,'rgba(255,187,75,.34)');glow.addColorStop(1,'rgba(255,157,43,0)');ctx.fillStyle=glow;ctx.fillRect(x-120,y-120,240,240)}
}
function overlay(t){const s=S(),m=E.minuteOfDay(),h=m/60;ctx.save();
 let color='rgba(0,0,0,0)';if(h>=22||h<5)color='rgba(9,22,43,.53)';else if(h>=20)color=`rgba(16,30,49,${(h-20)*.22})`;else if(h<7)color=`rgba(17,31,53,${(7-h)*.16})`;else if(h>=18)color=`rgba(131,66,35,${(h-18)*.08})`;ctx.fillStyle=color;ctx.fillRect(0,0,1280,720);
 if(h>=21||h<6){for(const [x,y] of [[760,610],[1110,655],[1450,780],[620,455]]){const sx=x-E.R.camera.x,sy=y-E.R.camera.y;if(sx<-100||sy<-100||sx>1380||sy>820)continue;const g=ctx.createRadialGradient(sx,sy,5,sx,sy,95);g.addColorStop(0,'rgba(255,219,118,.34)');g.addColorStop(1,'rgba(255,219,118,0)');ctx.fillStyle=g;ctx.fillRect(sx-100,sy-100,200,200)}}
 if(s.needs.alcohol>55){ctx.globalAlpha=Math.min(.2,(s.needs.alcohol-55)/180);ctx.fillStyle='#e6a14d';for(let i=0;i<7;i++){ctx.beginPath();ctx.arc(120+i*190+Math.sin(t*.003+i)*18,90+(i%3)*220,45+i%2*18,0,Math.PI*2);ctx.fill()}}
 if(s.needs.highness>45){ctx.globalAlpha=Math.min(.16,(s.needs.highness-45)/220);ctx.fillStyle='#6fae73';for(let i=0;i<8;i++){ctx.beginPath();ctx.arc(70+i*165,160+Math.sin(t*.002+i)*80,36,0,Math.PI*2);ctx.fill()}}
 if(s.needs.hangover>60){const v=ctx.createRadialGradient(640,360,160,640,360,700);v.addColorStop(0,'rgba(80,75,65,0)');v.addColorStop(1,'rgba(28,23,25,.48)');ctx.globalAlpha=.7;ctx.fillStyle=v;ctx.fillRect(0,0,1280,720)}
 ctx.restore();
}
D.hooks.world.push({layer:'atmosphere',draw:world});D.hooks.screen.push({scene:'overlay',draw:overlay});
})();