(()=>{
'use strict';
const E=window.TBA13,C=window.TBA13_CONTENT;
if(!E||!C||!E.visuals)throw new Error('UX-Runtime v15 kann die visuellen Module nicht finden.');
C.version='1.5.0-sprint16';
C.build='Sprint 16 · v1.5.0';
const S=()=>E.getState(),R=E.R,ctx=E.ctx;
const originalUpdate=E.updateScene;
E.updateScene=function(dt,t){
 const s=S();
 originalUpdate?.(dt,t);
 if(s.scene==='world')R.messageUntil=0;
};
const originalDraw=E.drawScene;
E.drawScene=function(t){
 const s=S(),nearest=R.nearest;
 if(s.scene==='world'){
  R.nearest=null;
  R.messageUntil=0;
 }
 originalDraw?.(t);
 if(s.scene==='world'){
  R.nearest=nearest;
  ctx.save();
  ctx.translate(-R.camera.x,-R.camera.y);
  E.visuals.drawGround?.(t);
  E.visuals.drawProps?.(t);
  E.visuals.drawForeground?.(t);
  ctx.restore();
 }
};
})();