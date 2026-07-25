(()=>{
'use strict';
const E=window.TBA13;
if(!E)throw new Error('Popup policy v29: Engine fehlt.');
const passiveTitles=new Set(['Kurzsteuerung','Statuswarnung','Neuer Bereich','Kurzhinweis','Spielstand repariert']);
const originalToast=E.toast;
E.toast=function(title,text='',tone='neutral',options={}){
 const explicit=options===true||options?.explicit===true;
 if(passiveTitles.has(String(title))&&!explicit){
  if(E.log)E.log(`${title}: ${text}`);
  return;
 }
 return originalToast(title,text,tone);
};
window.TBA_POPUP_POLICY={version:29,rule:'Nur explizit ausgelöste Hinweise erscheinen als Popup.'};
})();
