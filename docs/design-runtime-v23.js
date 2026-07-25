(()=>{
'use strict';
const E=window.TBA13,C=window.TBA13_CONTENT,D=E?.design23;
if(!E||!C||!D)throw new Error('Design runtime v23: Designmodule fehlen.');
const ctx=E.ctx,S=()=>E.getState(),stage=E.el.stage;
C.version='2.3.0-sprint24';C.build='Sprint 24 · v2.3.0';
const order=['ground','props','characters','foreground','atmosphere'];
const oldUpdate=E.updateScene;
E.updateScene=function(dt,t){oldUpdate?.(dt,t);for(const fn of D.hooks.update)try{fn(dt,t)}catch(error){console.error('Design update',error)}};
const oldDraw=E.drawScene;
E.drawScene=function(t){const s=S();oldDraw?.(t);stage.classList.toggle('battle-v23',s.scene==='battle');stage.classList.toggle('minigame-v23',s.scene==='minigame'||s.scene==='flirt');if(s.scene==='world'){
 ctx.save();ctx.translate(-E.R.camera.x,-E.R.camera.y);for(const layer of order)for(const hook of D.hooks.world)if(hook.layer===layer)try{hook.draw(t)}catch(error){console.error(`Design world ${layer}`,error)}ctx.restore();
 for(const hook of D.hooks.screen)if(hook.scene==='overlay')try{hook.draw(t)}catch(error){console.error('Design overlay',error)}
 }else{for(const hook of D.hooks.screen)if(hook.scene===s.scene)try{hook.draw(t)}catch(error){console.error(`Design scene ${s.scene}`,error)}}D.drawEffects?.();};
const oldDialogue=E.openDialogue;
E.openDialogue=function(id,lines,choices=[]){oldDialogue(id,lines,choices);requestAnimationFrame(()=>enhanceDialogue(id,choices));};
function enhanceDialogue(id,choices){const portrait=document.getElementById('dialogue-portrait'),box=document.getElementById('dialogue-choices');if(portrait){const initial=(C.dialogues[id]?.name||id||'?').slice(0,1).toUpperCase();portrait.innerHTML=`<span class="portrait-face"><i></i><b></b><em></em></span><small>${initial}</small>`;portrait.dataset.person=id;}
 [...box.querySelectorAll('.choice-button')].forEach((button,i)=>{const label=(choices[i]?.label||button.textContent).toLowerCase();const risky=/pöbel|bruns|lüg|flieh|bestech|dumm|beleid|scheiß|später/.test(label),safe=/höflich|helfen|aufräumen|wasser|warten|vernünftig|bestätigen/.test(label);button.dataset.tone=risky?'risk':safe?'safe':'neutral';button.style.setProperty('--choice-index',i);});}
const observer=new MutationObserver(()=>{const s=S();document.documentElement.dataset.scene=s.scene;document.documentElement.dataset.time=E.phase(s.minutes);});observer.observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});
window.addEventListener('resize',()=>{const mobile=innerWidth<700;stage.style.setProperty('--render-density',mobile?'1':'1.25')},{passive:true});
E.save();E.toast('Grafik-Upgrade aktiv','Acht Design-Sprints geladen. Die Strichmännchen haben Kündigung erhalten.','good');
})();