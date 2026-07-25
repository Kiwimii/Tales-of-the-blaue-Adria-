(()=>{
'use strict';
const E=window.TBA13,C=window.TBA13_CONTENT,D=E?.design23;
if(!E||!C||!D)throw new Error('Design battle v23: Grundlage fehlt.');
const ctx=E.ctx,S=()=>E.getState();
let lastLog='',impact=0,impactSide='foe';
function bar(x,y,w,value,max,color,label,status){
 D.round(x,y,w,54,15,'rgba(8,16,13,.9)','rgba(255,255,255,.2)',2);D.text(label,x+14,y+15,13,'#fff5d2','left',900);D.text(`${Math.max(0,Math.ceil(value))}/${max}`,x+w-14,y+15,11,'#cbd7cf','right',800);
 D.round(x+13,y+31,w-26,11,6,'#251d1c',null);const ratio=D.clamp(value/max);if(ratio>0)D.round(x+13,y+31,(w-26)*ratio,11,6,color,null);if(status)D.text(status,x+w-15,y+43,10,'#f3c966','right',800);
}
function arena(t){
 const s=S(),b=s.battle;if(!b)return;
 const bg=ctx.createLinearGradient(0,0,0,720);bg.addColorStop(0,'#26483d');bg.addColorStop(.56,'#49694c');bg.addColorStop(1,'#8e7651');ctx.fillStyle=bg;ctx.fillRect(0,0,1280,720);
 ctx.fillStyle='rgba(255,221,131,.08)';for(let i=0;i<12;i++){ctx.beginPath();ctx.arc(80+i*115,70+(i%3)*28,32+i%4*9,0,Math.PI*2);ctx.fill()}
 ctx.fillStyle='#756047';ctx.fillRect(0,410,1280,310);for(let i=0;i<20;i++){ctx.fillStyle=i%2?'rgba(255,255,255,.035)':'rgba(0,0,0,.035)';ctx.fillRect(i*70,410,38,310)}
 for(let i=0;i<8;i++){const x=110+i*155;ctx.fillStyle='#233c2d';ctx.beginPath();ctx.arc(x,370,52,0,Math.PI*2);ctx.fill();ctx.fillStyle='#365c40';ctx.beginPath();ctx.arc(x-18,350,32,0,Math.PI*2);ctx.fill()}
 D.text('CAMPING-DUELL',640,52,28,'#ffe074','center',1000);D.text(b.enemyName||'Gegnergruppe',640,84,14,'#e7eadf','center',750);
 const ally=b.party[b.ally],foe=b.foes[b.foe];if(!ally||!foe)return;
 const shake=impact>0?Math.sin(t*.09)*impact:0;ctx.save();ctx.translate(shake,0);
 D.drawPerson(ally.id,300,398,{time:t,scale:2.35,emotion:ally.hp<ally.max*.3?'shocked':'angry',item:'beer',selected:true});D.drawPerson(foe.id,980,398,{time:t,scale:2.35,emotion:'angry',selected:true});ctx.restore();
 const ac=C.crew[ally.id],fc=C.crew[foe.id];bar(60,112,430,ally.hp,ally.max,'#65c98b',ac.name,ally.status);bar(790,112,430,foe.hp,foe.max,'#dc6754',fc.name,foe.status);
 const party=b.party.map((u,i)=>({u,i}));for(const {u,i} of party){const x=92+i*74,y=202;ctx.globalAlpha=u.hp>0?1:.35;ctx.fillStyle=i===b.ally?'#f2cd61':'#18241f';ctx.beginPath();ctx.arc(x,y,28,0,Math.PI*2);ctx.fill();D.drawPerson(u.id,x,y+10,{time:t,scale:.58});ctx.globalAlpha=1}
 D.round(255,555,770,82,18,'rgba(8,15,13,.91)','rgba(255,255,255,.17)',2);D.text(b.log||'Die Würde wird gleich verrechnet.',640,586,15,'#fff2d2','center',800);D.text(`RUNDE ${b.turn||1}`,640,618,11,'#d9bc62','center',900);
 if(impact>0){ctx.fillStyle=`rgba(255,240,176,${impact/35})`;ctx.fillRect(0,0,1280,720);impact=Math.max(0,impact-1.6)}
}
function update(){const b=S().battle;if(!b)return;if(b.log&&b.log!==lastLog){impact=22;impactSide=b.log.includes('verliert')?'ally':'foe';lastLog=b.log;D.spark(impactSide==='foe'?980:300,370,impactSide==='foe'?'#ff835f':'#ffe16c',12)}}
D.hooks.screen.push({scene:'battle',draw:arena});D.hooks.update.push(update);
})();