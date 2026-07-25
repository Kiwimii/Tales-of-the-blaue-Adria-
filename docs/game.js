(async()=>{
  'use strict';
  const fatal=(error)=>{
    console.error(error);
    const box=document.getElementById('fatal-error');
    const message=document.getElementById('fatal-message');
    if(box) box.classList.remove('hidden');
    if(message) message.textContent=String(error&&error.stack?error.stack:error);
  };
  try{
    if(typeof DecompressionStream==='undefined') throw new Error('Dein Browser unterstützt die benötigte Dekomprimierung nicht. Bitte öffne den Link in einer aktuellen Version von Chrome, Firefox oder Safari.');
    const files=Array.from({length:6},(_,index)=>`./runtime/gz-${String(index).padStart(2,'0')}.b64?v=8`);
    const responses=await Promise.all(files.map(url=>fetch(url,{cache:'no-store'})));
    responses.forEach((response,index)=>{if(!response.ok) throw new Error(`Runtime-Segment ${index+1}/6 fehlt (${response.status}).`);});
    const encoded=(await Promise.all(responses.map(response=>response.text()))).join('').replace(/\s/g,'');
    const binary=atob(encoded);
    const compressed=Uint8Array.from(binary,character=>character.charCodeAt(0));
    const stream=new Blob([compressed]).stream().pipeThrough(new DecompressionStream('gzip'));
    const source=await new Response(stream).text();
    if(!source.includes("const BUILD='Sprint 5 · v0.8.0'")) throw new Error('Runtime-Prüfung fehlgeschlagen: falsche oder unvollständige Spielversion.');
    (0,eval)(`${source}\n//# sourceURL=tales-of-the-blaue-adria-runtime.js`);
  }catch(error){fatal(error);}
})();
