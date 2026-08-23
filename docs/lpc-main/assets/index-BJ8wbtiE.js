(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=new URLSearchParams(location.search),t=`tales-blaue-adria-lpc-main-v1`,n=`tales-blaue-adria-lpc-campaign-meta-v2`,r=`tales-blaue-adria-lpc-campaign-release`,i=`sprints-1-6-v1`;if(e.get(`smoke`)===`1`){let a=e.get(`progression`)===`1`;localStorage.setItem(r,i),localStorage.setItem(t,JSON.stringify({version:3,mode:`world`,profile:{name:`Smoke Camper`,skinTone:`#d9a67e`,hair:`#4a3224`,shirt:`#e5ad43`,shorts:`#294954`,hairStyle:`kurz`,bodyType:`normal`,accessory:`keins`,trait:`beobachtend`},prologue:{introSeen:!0,shoppingComplete:!0,spent:18},day:1,minutes:480,money:7,needs:{energy:92,hunger:10,thirst:8,bladder:5,alcohol:0,highness:0,hangover:0,courage:30},metrics:{dignity:60,chaos:0,reputation:0,momentum:0},inventory:{wasser:2,wuerste:1,bier:1,batida:0,chips:1,kaffee:0,klopapier:1,tablette:0},team:[],relationships:{},quests:{},activeQuest:`entry`,flags:{},encounter:null,chronicle:[],worldPosition:{x:900,y:1600},currentInterior:null,activityResults:{}})),localStorage.setItem(n,JSON.stringify({version:3,introSeen:!0,questStage:a?`arrival`:`complete`,firstBeerOpened:!a,authorityBattleWon:!a,powerConnected:!a,learnedAttacks:[`classic-high-five`],equippedAttacks:[`classic-high-five`],activeTeam:[],miniResults:a?{}:{flipCup:{attempts:1,wins:1,best:100,last:100,bestQuality:`solid`},beerPong:{attempts:1,wins:0,best:20,last:20,bestQuality:`failed`},flunkyball:{attempts:1,wins:1,best:100,last:100,bestQuality:`solid`}},flags:a?{}:{"all-core-minigames-unlocked":!0}}))}else localStorage.getItem(r)!==i&&(localStorage.removeItem(t),localStorage.removeItem(n),localStorage.setItem(r,i));var a={50792(e){var t=Object.prototype.hasOwnProperty,n=`~`;function r(){}Object.create&&(r.prototype=Object.create(null),new r().__proto__||(n=!1));function i(e,t,n){this.fn=e,this.context=t,this.once=n||!1}function a(e,t,r,a,o){if(typeof r!=`function`)throw TypeError(`The listener must be a function`);var s=new i(r,a||e,o),c=n?n+t:t;return e._events[c]?e._events[c].fn?e._events[c]=[e._events[c],s]:e._events[c].push(s):(e._events[c]=s,e._eventsCount++),e}function o(e,t){--e._eventsCount===0?e._events=new r:delete e._events[t]}function s(){this._events=new r,this._eventsCount=0}s.prototype.eventNames=function(){var e=[],r,i;if(this._eventsCount===0)return e;for(i in r=this._events)t.call(r,i)&&e.push(n?i.slice(1):i);return Object.getOwnPropertySymbols?e.concat(Object.getOwnPropertySymbols(r)):e},s.prototype.listeners=function(e){var t=n?n+e:e,r=this._events[t];if(!r)return[];if(r.fn)return[r.fn];for(var i=0,a=r.length,o=Array(a);i<a;i++)o[i]=r[i].fn;return o},s.prototype.listenerCount=function(e){var t=n?n+e:e,r=this._events[t];return r?r.fn?1:r.length:0},s.prototype.emit=function(e,t,r,i,a,o){var s=n?n+e:e;if(!this._events[s])return!1;var c=this._events[s],l=arguments.length,u,d;if(c.fn){switch(c.once&&this.removeListener(e,c.fn,void 0,!0),l){case 1:return c.fn.call(c.context),!0;case 2:return c.fn.call(c.context,t),!0;case 3:return c.fn.call(c.context,t,r),!0;case 4:return c.fn.call(c.context,t,r,i),!0;case 5:return c.fn.call(c.context,t,r,i,a),!0;case 6:return c.fn.call(c.context,t,r,i,a,o),!0}for(d=1,u=Array(l-1);d<l;d++)u[d-1]=arguments[d];c.fn.apply(c.context,u)}else{var f=c.length,p;for(d=0;d<f;d++)switch(c[d].once&&this.removeListener(e,c[d].fn,void 0,!0),l){case 1:c[d].fn.call(c[d].context);break;case 2:c[d].fn.call(c[d].context,t);break;case 3:c[d].fn.call(c[d].context,t,r);break;case 4:c[d].fn.call(c[d].context,t,r,i);break;default:if(!u)for(p=1,u=Array(l-1);p<l;p++)u[p-1]=arguments[p];c[d].fn.apply(c[d].context,u)}}return!0},s.prototype.on=function(e,t,n){return a(this,e,t,n,!1)},s.prototype.once=function(e,t,n){return a(this,e,t,n,!0)},s.prototype.removeListener=function(e,t,r,i){var a=n?n+e:e;if(!this._events[a])return this;if(!t)return o(this,a),this;var s=this._events[a];if(s.fn)s.fn===t&&(!i||s.once)&&(!r||s.context===r)&&o(this,a);else{for(var c=0,l=[],u=s.length;c<u;c++)(s[c].fn!==t||i&&!s[c].once||r&&s[c].context!==r)&&l.push(s[c]);l.length?this._events[a]=l.length===1?l[0]:l:o(this,a)}return this},s.prototype.removeAllListeners=function(e){var t;return e?(t=n?n+e:e,this._events[t]&&o(this,t)):(this._events=new r,this._eventsCount=0),this},s.prototype.off=s.prototype.removeListener,s.prototype.addListener=s.prototype.on,s.prefixed=n,s.EventEmitter=s,e.exports=s},93300(e,t,n){var r=n(10312);e.exports=function(e,t){Array.isArray(e)||(e=[e]),t||={};for(var n=t.threshold===void 0?.5:t.threshold,i=t.blurRadius===void 0?2:t.blurRadius,a=t.blurSteps===void 0?4:t.blurSteps,o=t.blurQuality===void 0?0:t.blurQuality,s=t.blendAmount===void 0?1:t.blendAmount,c=t.blendMode===void 0?r.ADD:t.blendMode,l=[],u=0;u<e.length;u++){var d=e[u];d.enableFilters&&d.enableFilters();var f=(t.useInternal?d.filters.internal:d.filters.external).addParallelFilters(),p=f.top.addThreshold(n,1),m=f.top.addBlur(o,i,i,1,16777215,a);f.blend.blendMode=c,f.blend.amount=s,l.push({item:d,parallelFilters:f,threshold:p,blur:m})}return l}},56704(e,t,n){var r=n(16438),i=n(10312),a=n(41337),o=n(95643),s=n(45650);e.exports=function(e,t){t||={},Array.isArray(e)||(e=[e]);var n=e[0],c=n.scene,l=t.direction===void 0?.5:t.direction%(Math.PI*2),u=t.scale===void 0?2:t.scale,d=(t.radius||.5)/u,f=t.width||n.width||128,p=t.height||n.height||128,m={x:0,y:0};l<0&&(l+=Math.PI*2),l>Math.PI*3/2?m.y=1:l>Math.PI?(m.x=1,m.y=1):l>Math.PI/2&&(m.x=1);for(var h=[],g=0;g<e.length;g++){var _=e[g],v={origin:0,width:f,height:p,config:{offset:-d,repeatMode:3,shapeMode:0,direction:l,length:u,start:m,bands:t.bands||[{interpolation:2,colorStart:16777215,colorEnd:[1,1,1,0],size:d},{colorStart:[1,1,1,0],size:1-d}]}},y=c.make.gradient(v,!1);if(t.displacementMap){var b=t.displacement||.1;y.enableFilters().filters.internal.addDisplacement(t.displacementMap,b,b)}for(var x=s(),S=c.textures;S.exists(x);)x=s();var C=S.addDynamicTexture(x,y.width,y.height),w=c.tweens.add({targets:y,offset:1+d,repeat:-1,yoyo:!!t.yoyo,ease:t.ease,duration:t.duration||2e3,repeatDelay:t.repeatDelay||0,onUpdate:function(){C.clear().draw(y).render()}});_ instanceof o&&_.enableFilters();var T=t.useExternal?_.filters.external:_.filters.internal,E,D,O=t.colorFactor||[1.15,.85,.85,1];t.reveal?E=T.addBlend(x,i.MULTIPLY,1,O):(D=T.addParallelFilters(),E=D.top.addBlend(x,i.MULTIPLY,1,O),D.blend.blendMode=i.ADD);var k=function(){w.destroy(),C.destroy()};_ instanceof o?_.on(a,k):_.on(r,k),h.push({item:_,dynamicTexture:C,gradient:y,tween:w,parallelFilters:D,blendFilter:E})}return h}},245(e,t,n){var r=n(95643),i=n(93232),a=n(94591);e.exports=function(e,t){Array.isArray(e)||(e=[e]),t||={};for(var n=t.aspectRatio===void 0?1:t.aspectRatio,o=t.padding||0,s=e[0].scene,c=[],l=0;l<e.length;l++){var u=e[l],d=t.region;d||=t.useInternal&&u._sizeComponent?new i(0,0,u.width,u.height):new i(0,0,s.scale.width,s.scale.height);var f;switch(t.shape){case`ellipse`:f=s.add.ellipse(0,0,n,1,16777215);break;case`square`:f=s.add.rectangle(0,0,1,1,16777215);break;case`rectangle`:f=s.add.rectangle(0,0,n,1,16777215);break;default:f=s.add.circle(0,0,1,16777215);break}s.children.remove(f),o&&(d=new i(d.x+o,d.y+o,d.width-o*2,d.height-o*2)),a(f,t.scaleMode,d),t.blurRadius>0&&f.enableFilters().filters.external.addBlur(t.blurQuality,t.blurRadius,t.blurRadius,1,void 0,t.blurSteps),u instanceof r&&u.enableFilters();var p=(t.useInternal?u.filters.internal:u.filters.external).addMask(f,t.invert);c.push(p)}return c}},11517(e,t,n){var r=n(38829);e.exports=function(e,t,n,i){for(var a=e[0],o=1;o<e.length;o++){var s=e[o];r(s,a,t,n,i),a=s}return e}},80318(e,t,n){var r=n(66979);e.exports=function(e,t,n,i,a){return r(e,`angle`,t,n,i,a)}},60757(e){e.exports=function(e,t,n){for(var r=0;r<e.length;r++){var i=e[r];t.call(n,i)}return e}},94591(e,t,n){var r=n(87841),i=n(95540);e.exports=function(e,t,n,a){if(Array.isArray(e)||(e=[e]),t===void 0&&(t=0),!n){var o=e[0].scene;n=new r(0,0,o.scale.width,o.scale.height)}a||={};for(var s=0;s<e.length;s++){var c=e[s],l=i(a,`width`,i(c,`width`,1)),u=i(a,`height`,i(c,`height`,1)),d=i(a,`originX`,i(c,`originX`,.5)),f=i(a,`originY`,i(c,`originY`,.5));c.x=n.x+n.width*d,c.y=n.y+n.height*f;var p=n.width/l,m=n.height/u;switch(t){case-1:c.setScale(Math.min(p,m));break;case 0:c.setScale(p,m);break;case 1:c.setScale(Math.max(p,m));break}}return c}},69927(e){e.exports=function(e,t,n){n===void 0&&(n=0);for(var r=n;r<e.length;r++){var i=e[r],a=!0;for(var o in t)i[o]!==t[o]&&(a=!1);if(a)return i}return null}},32265(e){e.exports=function(e,t,n){n===void 0&&(n=0);for(var r=e.length-1;r>=n;r--){var i=e[r],a=!0;for(var o in t)i[o]!==t[o]&&(a=!1);if(a)return i}return null}},94420(e,t,n){var r=n(11879),i=n(60461),a=n(95540),o=n(29747),s=new(n(41481))({sys:{queueDepthSort:o,events:{once:o}}},0,0,1,1).setOrigin(0,0);e.exports=function(e,t){t===void 0&&(t={});var n=t.hasOwnProperty(`width`),o=t.hasOwnProperty(`height`),c=a(t,`width`,-1),l=a(t,`height`,-1),u=a(t,`cellWidth`,1),d=a(t,`cellHeight`,u),f=a(t,`position`,i.TOP_LEFT),p=a(t,`x`,0),m=a(t,`y`,0),h=0,g=0,_=c*u,v=l*d;s.setPosition(p,m),s.setSize(u,d);for(var y=0;y<e.length;y++)if(r(e[y],s,f),n&&c===-1)s.x+=u;else if(o&&l===-1)s.y+=d;else if(o&&!n){if(g+=d,s.y+=d,g===v&&(g=0,h+=u,s.y=m,s.x+=u,h===_))break}else if(h+=u,s.x+=u,h===_&&(h=0,g+=d,s.x=p,s.y+=d,g===v))break;return e}},41721(e,t,n){var r=n(66979);e.exports=function(e,t,n,i,a){return r(e,`alpha`,t,n,i,a)}},67285(e,t,n){var r=n(66979);e.exports=function(e,t,n,i,a){return r(e,`x`,t,n,i,a)}},9074(e,t,n){var r=n(66979);e.exports=function(e,t,n,i,a,o,s){return n??=t,r(e,`x`,t,i,o,s),r(e,`y`,n,a,o,s)}},75222(e,t,n){var r=n(66979);e.exports=function(e,t,n,i,a){return r(e,`y`,t,n,i,a)}},22983(e){e.exports=function(e,t,n,r){n===void 0&&(n=0),r===void 0&&(r=6.28);for(var i=n,a=(r-n)/e.length,o=t.x,s=t.y,c=t.radius,l=0;l<e.length;l++)e[l].x=o+c*Math.cos(i),e[l].y=s+c*Math.sin(i),i+=a;return e}},95253(e){e.exports=function(e,t,n,r){n===void 0&&(n=0),r===void 0&&(r=6.28);for(var i=n,a=(r-n)/e.length,o=t.width/2,s=t.height/2,c=0;c<e.length;c++)e[c].x=t.x+o*Math.cos(i),e[c].y=t.y+s*Math.sin(i),i+=a;return e}},88505(e,t,n){var r=n(15258),i=n(26708);e.exports=function(e,t,n){for(var a=n?i(t,n,e.length):r(t,e.length),o=0;o<e.length;o++){var s=e[o],c=a[o];s.x=c.x,s.y=c.y}return e}},41346(e,t,n){var r=n(14649),i=n(86003),a=n(49498);e.exports=function(e,t,n){n===void 0&&(n=0);var o=r(t,!1,e.length);n>0?i(o,n):n<0&&a(o,Math.abs(n));for(var s=0;s<e.length;s++)e[s].x=o[s].x,e[s].y=o[s].y;return e}},11575(e,t,n){var r=n(84993);e.exports=function(e,t,n){var i=r({x1:t.x1,y1:t.y1,x2:t.x2,y2:t.y2},n),a=r({x1:t.x2,y1:t.y2,x2:t.x3,y2:t.y3},n),o=r({x1:t.x3,y1:t.y3,x2:t.x1,y2:t.y1},n);i.pop(),a.pop(),o.pop(),i=i.concat(a,o);for(var s=i.length/e.length,c=0,l=0;l<e.length;l++){var u=e[l],d=i[Math.floor(c)];u.x=d.x,u.y=d.y,c+=s}return e}},29953(e){e.exports=function(e,t,n){for(var r=0;r<e.length;r++){var i=e[r];i.anims&&i.anims.play(t,n)}return e}},66979(e){e.exports=function(e,t,n,r,i,a){r===void 0&&(r=0),i===void 0&&(i=0),a===void 0&&(a=1);var o,s=0,c=e.length;if(a===1)for(o=i;o<c;o++)e[o][t]+=n+s*r,s++;else for(o=i;o>=0;o--)e[o][t]+=n+s*r,s++;return e}},43967(e){e.exports=function(e,t,n,r,i,a){r===void 0&&(r=0),i===void 0&&(i=0),a===void 0&&(a=1);var o,s=0,c=e.length;if(a===1)for(o=i;o<c;o++)e[o][t]=n+s*r,s++;else for(o=i;o>=0;o--)e[o][t]=n+s*r,s++;return e}},88926(e,t,n){var r=n(28176);e.exports=function(e,t){for(var n=0;n<e.length;n++)r(t,e[n]);return e}},33286(e,t,n){var r=n(24820);e.exports=function(e,t){for(var n=0;n<e.length;n++)r(t,e[n]);return e}},96e3(e,t,n){var r=n(65822);e.exports=function(e,t){for(var n=0;n<e.length;n++)r(t,e[n]);return e}},28789(e,t,n){var r=n(26597);e.exports=function(e,t){for(var n=0;n<e.length;n++)r(t,e[n]);return e}},97154(e,t,n){var r=n(90260);e.exports=function(e,t){for(var n=0;n<e.length;n++)r(t,e[n]);return e}},20510(e,t,n){var r=n(66979);e.exports=function(e,t,n,i,a){return r(e,`rotation`,t,n,i,a)}},91051(e,t,n){var r=n(1163),i=n(20339);e.exports=function(e,t,n){for(var a=t.x,o=t.y,s=0;s<e.length;s++){var c=e[s];r(c,a,o,n,Math.max(1,i(c.x,c.y,a,o)))}return e}},76332(e,t,n){var r=n(1163);e.exports=function(e,t,n,i){var a=t.x,o=t.y;if(i===0)return e;for(var s=0;s<e.length;s++)r(e[s],a,o,n,i);return e}},61619(e,t,n){var r=n(66979);e.exports=function(e,t,n,i,a){return r(e,`scaleX`,t,n,i,a)}},94868(e,t,n){var r=n(66979);e.exports=function(e,t,n,i,a,o,s){return n??=t,r(e,`scaleX`,t,i,o,s),r(e,`scaleY`,n,a,o,s)}},95532(e,t,n){var r=n(66979);e.exports=function(e,t,n,i,a){return r(e,`scaleY`,t,n,i,a)}},8689(e,t,n){var r=n(43967);e.exports=function(e,t,n,i,a){return r(e,`alpha`,t,n,i,a)}},2645(e,t,n){var r=n(43967);e.exports=function(e,t,n,i){return r(e,`blendMode`,t,0,n,i)}},32372(e,t,n){var r=n(43967);e.exports=function(e,t,n,i,a){return r(e,`depth`,t,n,i,a)}},85373(e){e.exports=function(e,t,n){for(var r=0;r<e.length;r++)e[r].setInteractive(t,n);return e}},81583(e,t,n){var r=n(43967);e.exports=function(e,t,n,i,a,o,s){return n??=t,r(e,`originX`,t,i,o,s),r(e,`originY`,n,a,o,s),e.forEach(function(e){e.updateDisplayOrigin()}),e}},79939(e,t,n){var r=n(43967);e.exports=function(e,t,n,i,a){return r(e,`rotation`,t,n,i,a)}},2699(e,t,n){var r=n(43967);e.exports=function(e,t,n,i,a,o,s){return n??=t,r(e,`scaleX`,t,i,o,s),r(e,`scaleY`,n,a,o,s)}},98739(e,t,n){var r=n(43967);e.exports=function(e,t,n,i,a){return r(e,`scaleX`,t,n,i,a)}},98476(e,t,n){var r=n(43967);e.exports=function(e,t,n,i,a){return r(e,`scaleY`,t,n,i,a)}},6207(e,t,n){var r=n(43967);e.exports=function(e,t,n,i,a,o,s){return n??=t,r(e,`scrollFactorX`,t,i,o,s),r(e,`scrollFactorY`,n,a,o,s)}},6607(e,t,n){var r=n(43967);e.exports=function(e,t,n,i,a){return r(e,`scrollFactorX`,t,n,i,a)}},72248(e,t,n){var r=n(43967);e.exports=function(e,t,n,i,a){return r(e,`scrollFactorY`,t,n,i,a)}},14036(e){e.exports=function(e,t,n,r,i){for(var a=0;a<e.length;a++)e[a].setTint(t,n,r,i);return e}},50159(e,t,n){var r=n(43967);e.exports=function(e,t,n,i){return r(e,`visible`,t,0,n,i)}},77597(e,t,n){var r=n(43967);e.exports=function(e,t,n,i,a){return r(e,`x`,t,n,i,a)}},83194(e,t,n){var r=n(43967);e.exports=function(e,t,n,i,a,o,s){return n??=t,r(e,`x`,t,i,o,s),r(e,`y`,n,a,o,s)}},67678(e,t,n){var r=n(43967);e.exports=function(e,t,n,i,a){return r(e,`y`,t,n,i,a)}},35850(e,t,n){var r=n(26099);e.exports=function(e,t,n,i,a){i===void 0&&(i=0),a===void 0&&(a=new r);var o,s,c=e.length;if(c===1)o=e[0].x,s=e[0].y,e[0].x=t,e[0].y=n;else{var l=1,u=0;i===0&&(u=c-1,l=c-2),o=e[u].x,s=e[u].y,e[u].x=t,e[u].y=n;for(var d=0;d<c;d++)if(!(l>=c||l===-1)){var f=e[l],p=f.x,m=f.y;f.x=o,f.y=s,o=p,s=m,i===0?l--:l++}}return a.x=o,a.y=s,a}},8628(e,t,n){var r=n(33680);e.exports=function(e){return r(e)}},21837(e,t,n){var r=n(7602);e.exports=function(e,t,n,i,a){a===void 0&&(a=!1);var o=Math.abs(i-n)/e.length,s;if(a)for(s=0;s<e.length;s++)e[s][t]+=r(s*o,n,i);else for(s=0;s<e.length;s++)e[s][t]=r(s*o,n,i);return e}},21910(e,t,n){var r=n(54261);e.exports=function(e,t,n,i,a){a===void 0&&(a=!1);var o=Math.abs(i-n)/e.length,s;if(a)for(s=0;s<e.length;s++)e[s][t]+=r(s*o,n,i);else for(s=0;s<e.length;s++)e[s][t]=r(s*o,n,i);return e}},62054(e){e.exports=function(e,t,n,r,i){if(i===void 0&&(i=!1),e.length===0)return e;if(e.length===1)return i?e[0][t]+=(r+n)/2:e[0][t]=(r+n)/2,e;var a=Math.abs(r-n)/(e.length-1),o;if(i)for(o=0;o<e.length;o++)e[o][t]+=o*a+n;else for(o=0;o<e.length;o++)e[o][t]=o*a+n;return e}},79815(e){e.exports=function(e){for(var t=0;t<e.length;t++)e[t].visible=!e[t].visible;return e}},39665(e,t,n){var r=n(15994);e.exports=function(e,t,n){n===void 0&&(n=0);for(var i=0;i<e.length;i++){var a=e[i];a.x=r(a.x,t.left-n,t.right+n),a.y=r(a.y,t.top-n,t.bottom+n)}return e}},61061(e,t,n){e.exports={AddEffectBloom:n(93300),AddEffectShine:n(56704),AddMaskShape:n(245),AlignTo:n(11517),Angle:n(80318),Call:n(60757),FitToRegion:n(94591),GetFirst:n(69927),GetLast:n(32265),GridAlign:n(94420),IncAlpha:n(41721),IncX:n(67285),IncXY:n(9074),IncY:n(75222),PlaceOnCircle:n(22983),PlaceOnEllipse:n(95253),PlaceOnLine:n(88505),PlaceOnRectangle:n(41346),PlaceOnTriangle:n(11575),PlayAnimation:n(29953),PropertyValueInc:n(66979),PropertyValueSet:n(43967),RandomCircle:n(88926),RandomEllipse:n(33286),RandomLine:n(96e3),RandomRectangle:n(28789),RandomTriangle:n(97154),Rotate:n(20510),RotateAround:n(91051),RotateAroundDistance:n(76332),ScaleX:n(61619),ScaleXY:n(94868),ScaleY:n(95532),SetAlpha:n(8689),SetBlendMode:n(2645),SetDepth:n(32372),SetHitArea:n(85373),SetOrigin:n(81583),SetRotation:n(79939),SetScale:n(2699),SetScaleX:n(98739),SetScaleY:n(98476),SetScrollFactor:n(6207),SetScrollFactorX:n(6607),SetScrollFactorY:n(72248),SetTint:n(14036),SetVisible:n(50159),SetX:n(77597),SetXY:n(83194),SetY:n(67678),ShiftPosition:n(35850),Shuffle:n(8628),SmootherStep:n(21910),SmoothStep:n(21837),Spread:n(62054),ToggleVisible:n(79815),WrapInRectangle:n(39665)}},42099(e,t,n){var r=n(45319),i=n(83419),a=n(74943),o=n(81957),s=n(41138),c=n(35154),l=n(90126);e.exports=new i({initialize:function(e,t,n){this.manager=e,this.key=t,this.type=`frame`,this.frames=this.getFrames(e.textureManager,c(n,`frames`,[]),c(n,`defaultTextureKey`,null),c(n,`sortFrames`,!0)),this.frameRate=c(n,`frameRate`,null),this.duration=c(n,`duration`,null),this.msPerFrame,this.skipMissedFrames=c(n,`skipMissedFrames`,!0),this.delay=c(n,`delay`,0),this.repeat=c(n,`repeat`,0),this.repeatDelay=c(n,`repeatDelay`,0),this.yoyo=c(n,`yoyo`,!1),this.showBeforeDelay=c(n,`showBeforeDelay`,!1),this.showOnStart=c(n,`showOnStart`,!1),this.hideOnComplete=c(n,`hideOnComplete`,!1),this.randomFrame=c(n,`randomFrame`,!1),this.paused=!1,this.calculateDuration(this,this.getTotalFrames(),this.duration,this.frameRate),this.manager.on&&(this.manager.on(a.PAUSE_ALL,this.pause,this),this.manager.on(a.RESUME_ALL,this.resume,this))},getTotalFrames:function(){return this.frames.length},calculateDuration:function(e,t,n,r){n===null&&r===null?(e.frameRate=24,e.duration=24/t*1e3):n&&r===null?(e.duration=n,e.frameRate=t/(n/1e3)):(e.frameRate=r,e.duration=t/r*1e3),e.msPerFrame=1e3/e.frameRate},addFrame:function(e){return this.addFrameAt(this.frames.length,e)},addFrameAt:function(e,t){var n=this.getFrames(this.manager.textureManager,t);if(n.length>0){if(e===0)this.frames=n.concat(this.frames);else if(e===this.frames.length)this.frames=this.frames.concat(n);else{var r=this.frames.slice(0,e),i=this.frames.slice(e);this.frames=r.concat(n,i)}this.updateFrameSequence()}return this},checkFrame:function(e){return e>=0&&e<this.frames.length},getFirstTick:function(e){e.accumulator=0,e.nextTick=e.frameRate===e.currentAnim.frameRate&&e.currentFrame.duration||e.msPerFrame},getFrameAt:function(e){return this.frames[e]},getFrames:function(e,t,n,r){r===void 0&&(r=!0);var i=[],a,o,u=1,d,f;if(typeof t==`string`){if(f=t,!e.exists(f))return console.warn(`Texture "%s" not found`,f),i;var p=e.get(f).getFrameNames();r&&l(p),t=[],p.forEach(function(e){t.push({key:f,frame:e})})}if(!Array.isArray(t)||t.length===0)return i;for(d=0;d<t.length;d++){var m=t[d],h=c(m,`key`,n);if(h){var g=c(m,`frame`,0),_=e.getFrame(h,g);if(!_){console.warn(`Texture "%s" not found`,h);continue}o=new s(h,g,u,_),o.duration=c(m,`duration`,0),o.isFirst=!a,a&&(a.nextFrame=o,o.prevFrame=a),i.push(o),a=o,u++}}if(i.length>0){o.isLast=!0,o.nextFrame=i[0],i[0].prevFrame=o;var v=1/(i.length-1);for(d=0;d<i.length;d++)i[d].progress=d*v}return i},getNextTick:function(e){e.accumulator-=e.nextTick,e.nextTick=e.frameRate===e.currentAnim.frameRate&&e.currentFrame.duration||e.msPerFrame},getFrameByProgress:function(e){return e=r(e,0,1),o(e,this.frames,`progress`)},nextFrame:function(e){var t=e.currentFrame;t.isLast?e.yoyo?this.handleYoyoFrame(e,!1):e.repeatCounter>0?e.inReverse&&e.forward?e.forward=!1:this.repeatAnimation(e):e.complete():this.updateAndGetNextTick(e,t.nextFrame)},handleYoyoFrame:function(e,t){if(t||=!1,e.inReverse===!t&&e.repeatCounter>0){(e.repeatDelay===0||e.pendingRepeat)&&(e.forward=t),this.repeatAnimation(e);return}if(e.inReverse!==t&&e.repeatCounter===0){e.complete();return}e.forward=t;var n=t?e.currentFrame.nextFrame:e.currentFrame.prevFrame;this.updateAndGetNextTick(e,n)},getLastFrame:function(){return this.frames[this.frames.length-1]},previousFrame:function(e){var t=e.currentFrame;t.isFirst?e.yoyo?this.handleYoyoFrame(e,!0):e.repeatCounter>0?(e.inReverse&&!e.forward||(e.forward=!0),this.repeatAnimation(e)):e.complete():this.updateAndGetNextTick(e,t.prevFrame)},updateAndGetNextTick:function(e,t){e.setCurrentFrame(t),this.getNextTick(e)},removeFrame:function(e){var t=this.frames.indexOf(e);return t!==-1&&this.removeFrameAt(t),this},removeFrameAt:function(e){return this.frames.splice(e,1),this.updateFrameSequence(),this},repeatAnimation:function(e){if(e._pendingStop===2){if(e._pendingStopValue===0)return e.stop();e._pendingStopValue--}e.repeatDelay>0&&!e.pendingRepeat?(e.pendingRepeat=!0,e.accumulator-=e.nextTick,e.nextTick+=e.repeatDelay):(e.repeatCounter--,e.forward?e.setCurrentFrame(e.currentFrame.nextFrame):e.setCurrentFrame(e.currentFrame.prevFrame),e.isPlaying&&(this.getNextTick(e),e.handleRepeat()))},toJSON:function(){var e={key:this.key,type:this.type,frames:[],frameRate:this.frameRate,duration:this.duration,skipMissedFrames:this.skipMissedFrames,delay:this.delay,repeat:this.repeat,repeatDelay:this.repeatDelay,yoyo:this.yoyo,showBeforeDelay:this.showBeforeDelay,showOnStart:this.showOnStart,randomFrame:this.randomFrame,hideOnComplete:this.hideOnComplete};return this.frames.forEach(function(t){e.frames.push(t.toJSON())}),e},updateFrameSequence:function(){for(var e=this.frames.length,t=1/(e-1),n,r=0;r<e;r++)n=this.frames[r],n.index=r+1,n.isFirst=!1,n.isLast=!1,n.progress=r*t,r===0?(n.isFirst=!0,e===1?(n.isLast=!0,n.nextFrame=n,n.prevFrame=n):(n.isLast=!1,n.prevFrame=this.frames[e-1],n.nextFrame=this.frames[r+1])):r===e-1&&e>1?(n.isLast=!0,n.prevFrame=this.frames[e-2],n.nextFrame=this.frames[0]):e>1&&(n.prevFrame=this.frames[r-1],n.nextFrame=this.frames[r+1]);return this},pause:function(){return this.paused=!0,this},resume:function(){return this.paused=!1,this},destroy:function(){this.manager.off&&(this.manager.off(a.PAUSE_ALL,this.pause,this),this.manager.off(a.RESUME_ALL,this.resume,this)),this.manager.remove(this.key);for(var e=0;e<this.frames.length;e++)this.frames[e].destroy();this.frames=[],this.manager=null}})},41138(e,t,n){e.exports=new(n(83419))({initialize:function(e,t,n,r,i){i===void 0&&(i=!1),this.textureKey=e,this.textureFrame=t,this.index=n,this.frame=r,this.isFirst=!1,this.isLast=!1,this.prevFrame=null,this.nextFrame=null,this.duration=0,this.progress=0,this.isKeyFrame=i},toJSON:function(){return{key:this.textureKey,frame:this.textureFrame,duration:this.duration,keyframe:this.isKeyFrame}},destroy:function(){this.frame=void 0}})},60848(e,t,n){var r=n(42099),i=n(83419),a=n(90330),o=n(50792),s=n(74943),c=n(8443),l=n(95540),u=n(35154),d=n(36383),f=n(20283),p=n(41836);e.exports=new i({Extends:o,initialize:function(e){o.call(this),this.game=e,this.textureManager=null,this.globalTimeScale=1,this.anims=new a,this.mixes=new a,this.paused=!1,this.name=`AnimationManager`,e.events.once(c.BOOT,this.boot,this)},boot:function(){this.textureManager=this.game.textures,this.game.events.once(c.DESTROY,this.destroy,this)},addMix:function(e,t,n){var r=this.anims,i=this.mixes,a=typeof e==`string`?e:e.key,o=typeof t==`string`?t:t.key;if(r.has(a)&&r.has(o)){var s=i.get(a);s||={},s[o]=n,i.set(a,s)}return this},removeMix:function(e,t){var n=this.mixes,r=typeof e==`string`?e:e.key,i=n.get(r);if(i)if(t){var a=typeof t==`string`?t:t.key;i.hasOwnProperty(a)&&delete i[a]}else t||n.delete(r);return this},getMix:function(e,t){var n=this.mixes,r=typeof e==`string`?e:e.key,i=typeof t==`string`?t:t.key,a=n.get(r);return a&&a.hasOwnProperty(i)?a[i]:0},add:function(e,t){return this.anims.has(e)?(console.warn(`Animation key exists: `+e),this):(t.key=e,this.anims.set(e,t),this.emit(s.ADD_ANIMATION,e,t),this)},exists:function(e){return this.anims.has(e)},createFromAseprite:function(e,t,n){var r=[],i=this.game.cache.json.get(e);if(!i)return console.warn(`No Aseprite data found for: `+e),r;var a=this,o=u(i,`meta`,null),s=u(i,`frames`,null);return o&&s&&u(o,`frameTags`,[]).forEach(function(i){var o=[],c=l(i,`name`,null),u=l(i,`from`,0),f=l(i,`to`,0),p=l(i,`direction`,`forward`);if(c&&(!t||t&&t.indexOf(c)>-1)){for(var m=0,h=u;h<=f;h++){var g=h.toString(),_=s[g];if(_){var v=l(_,`duration`,d.MAX_SAFE_INTEGER);o.push({key:e,frame:g,duration:v}),m+=v}}p===`reverse`&&(o=o.reverse());var y={key:c,frames:o,duration:m,yoyo:p===`pingpong`},b;n?n.anims&&(b=n.anims.create(y)):b=a.create(y),b&&r.push(b)}}),r},create:function(e){var t=e.key,n=!1;return t&&(n=this.get(t),n?console.warn(`AnimationManager key already exists: `+t):(n=new r(this,t,e),this.anims.set(t,n),this.emit(s.ADD_ANIMATION,t,n))),n},fromJSON:function(e,t){t===void 0&&(t=!1),t&&this.anims.clear(),typeof e==`string`&&(e=JSON.parse(e));var n=[];if(e.hasOwnProperty(`anims`)&&Array.isArray(e.anims)){for(var r=0;r<e.anims.length;r++)n.push(this.create(e.anims[r]));e.hasOwnProperty(`globalTimeScale`)&&(this.globalTimeScale=e.globalTimeScale)}else e.hasOwnProperty(`key`)&&e.type===`frame`&&n.push(this.create(e));return n},generateFrameNames:function(e,t){var n=u(t,`prefix`,``),r=u(t,`start`,0),i=u(t,`end`,0),a=u(t,`suffix`,``),o=u(t,`zeroPad`,0),s=u(t,`outputArray`,[]),c=u(t,`frames`,!1);if(!this.textureManager.exists(e))return console.warn(`Texture "%s" not found`,e),s;var l=this.textureManager.get(e);if(!l)return s;var d;if(t)for(c||=f(r,i),d=0;d<c.length;d++){var m=n+p(c[d],o,`0`,1)+a;l.has(m)?s.push({key:e,frame:m}):console.warn(`Frame "%s" not found in texture "%s"`,m,e)}else for(c=l.getFrameNames(),d=0;d<c.length;d++)s.push({key:e,frame:c[d]});return s},generateFrameNumbers:function(e,t){var n=u(t,`start`,0),r=u(t,`end`,-1),i=u(t,`first`,!1),a=u(t,`outputArray`,[]),o=u(t,`frames`,!1);if(!this.textureManager.exists(e))return console.warn(`Texture "%s" not found`,e),a;var s=this.textureManager.get(e);if(!s)return a;i&&s.has(i)&&a.push({key:e,frame:i}),o||=(r===-1&&(r=s.frameTotal-2),f(n,r));for(var c=0;c<o.length;c++){var l=o[c];s.has(l)?a.push({key:e,frame:l}):console.warn(`Frame "%s" not found in texture "%s"`,l,e)}return a},get:function(e){return this.anims.get(e)},getAnimsFromTexture:function(e){for(var t=this.textureManager.get(e).key,n=this.anims.getArray(),r=[],i=0;i<n.length;i++)for(var a=n[i],o=a.frames,s=0;s<o.length;s++)if(o[s].textureKey===t){r.push(a.key);break}return r},pauseAll:function(){return this.paused||(this.paused=!0,this.emit(s.PAUSE_ALL)),this},play:function(e,t){Array.isArray(t)||(t=[t]);for(var n=0;n<t.length;n++)t[n].anims.play(e);return this},staggerPlay:function(e,t,n,r){n===void 0&&(n=0),r===void 0&&(r=!0),Array.isArray(t)||(t=[t]);var i=t.length;r||i--;for(var a=0;a<t.length;a++){var o=n<0?Math.abs(n)*(i-a):n*a;t[a].anims.playAfterDelay(e,o)}return this},remove:function(e){var t=this.get(e);return t&&(this.emit(s.REMOVE_ANIMATION,e,t),this.anims.delete(e),this.removeMix(e)),t},resumeAll:function(){return this.paused&&(this.paused=!1,this.emit(s.RESUME_ALL)),this},toJSON:function(e){var t={anims:[],globalTimeScale:this.globalTimeScale};return e!==void 0&&e!==``?t.anims.push(this.anims.get(e).toJSON()):this.anims.each(function(e,n){t.anims.push(n.toJSON())}),t},destroy:function(){this.anims.clear(),this.mixes.clear(),this.textureManager=null,this.game=null}})},9674(e,t,n){var r=n(42099),i=n(30976),a=n(83419),o=n(90330),s=n(74943),c=n(95540);e.exports=new a({initialize:function(e){this.parent=e,this.animationManager=e.scene.sys.anims,this.animationManager.on(s.REMOVE_ANIMATION,this.globalRemove,this),this.textureManager=this.animationManager.textureManager,this.anims=null,this.isPlaying=!1,this.hasStarted=!1,this.currentAnim=null,this.currentFrame=null,this.nextAnim=null,this.nextAnimsQueue=[],this.timeScale=1,this.frameRate=0,this.duration=0,this.msPerFrame=0,this.skipMissedFrames=!0,this.randomFrame=!1,this.delay=0,this.repeat=0,this.repeatDelay=0,this.yoyo=!1,this.showBeforeDelay=!1,this.showOnStart=!1,this.hideOnComplete=!1,this.forward=!0,this.inReverse=!1,this.accumulator=0,this.nextTick=0,this.delayCounter=0,this.repeatCounter=0,this.pendingRepeat=!1,this._paused=!1,this._wasPlaying=!1,this._pendingStop=0,this._pendingStopValue},chain:function(e){var t=this.parent;if(e===void 0)return this.nextAnimsQueue.length=0,this.nextAnim=null,t;Array.isArray(e)||(e=[e]);for(var n=0;n<e.length;n++){var r=e[n];this.nextAnim?this.nextAnimsQueue.push(r):this.nextAnim=r}return this.parent},getName:function(){return this.currentAnim?this.currentAnim.key:``},getFrameName:function(){return this.currentFrame?this.currentFrame.textureFrame:``},load:function(e){this.isPlaying&&this.stop();var t=this.animationManager,n=typeof e==`string`?e:c(e,`key`,null),r=this.exists(n)?this.get(n):t.get(n);if(!r)console.warn(`Missing animation: `+n);else{this.currentAnim=r;var a=r.getTotalFrames(),o=c(e,`frameRate`,r.frameRate),s=c(e,`duration`,r.duration);r.calculateDuration(this,a,s,o),this.delay=c(e,`delay`,r.delay),this.repeat=c(e,`repeat`,r.repeat),this.repeatDelay=c(e,`repeatDelay`,r.repeatDelay),this.yoyo=c(e,`yoyo`,r.yoyo),this.showBeforeDelay=c(e,`showBeforeDelay`,r.showBeforeDelay),this.showOnStart=c(e,`showOnStart`,r.showOnStart),this.hideOnComplete=c(e,`hideOnComplete`,r.hideOnComplete),this.skipMissedFrames=c(e,`skipMissedFrames`,r.skipMissedFrames),this.randomFrame=c(e,`randomFrame`,r.randomFrame),this.timeScale=c(e,`timeScale`,this.timeScale);var l=c(e,`startFrame`,0);l>a&&(l=0),this.randomFrame&&(l=i(0,a-1));var u=r.frames[l];l===0&&!this.forward&&(u=r.getLastFrame()),this.currentFrame=u}return this.parent},pause:function(e){return this._paused||(this._paused=!0,this._wasPlaying=this.isPlaying,this.isPlaying=!1),e!==void 0&&this.setCurrentFrame(e),this.parent},resume:function(e){return this._paused&&(this._paused=!1,this.isPlaying=this._wasPlaying),e!==void 0&&this.setCurrentFrame(e),this.parent},playAfterDelay:function(e,t){if(!this.isPlaying)this.delayCounter=t,this.play(e,!0);else{var n=this.nextAnim,r=this.nextAnimsQueue;n&&r.unshift(n),this.nextAnim=e,this._pendingStop=1,this._pendingStopValue=t}return this.parent},playAfterRepeat:function(e,t){if(t===void 0&&(t=1),!this.isPlaying)this.play(e);else{var n=this.nextAnim,r=this.nextAnimsQueue;n&&r.unshift(n),this.repeatCounter!==-1&&t>this.repeatCounter&&(t=this.repeatCounter),this.nextAnim=e,this._pendingStop=2,this._pendingStopValue=t}return this.parent},play:function(e,t){t===void 0&&(t=!1);var n=this.currentAnim,r=this.parent,i=typeof e==`string`?e:e.key;if(t&&this.isPlaying&&n.key===i)return r;if(n&&this.isPlaying){var a=this.animationManager.getMix(n.key,e);if(a>0)return this.playAfterDelay(e,a)}return this.forward=!0,this.inReverse=!1,this._paused=!1,this._wasPlaying=!0,this.startAnimation(e)},playReverse:function(e,t){t===void 0&&(t=!1);var n=typeof e==`string`?e:e.key;return t&&this.isPlaying&&this.currentAnim.key===n?this.parent:(this.forward=!1,this.inReverse=!0,this._paused=!1,this._wasPlaying=!0,this.startAnimation(e))},startAnimation:function(e){this.load(e);var t=this.currentAnim,n=this.parent;return t?(this.repeatCounter=this.repeat===-1?Number.MAX_VALUE:this.repeat,t.getFirstTick(this),this.isPlaying=!0,this.pendingRepeat=!1,this.hasStarted=!1,this._pendingStop=0,this._pendingStopValue=0,this._paused=!1,this.delayCounter+=this.delay,this.delayCounter===0?this.handleStart():this.showBeforeDelay&&this.setCurrentFrame(this.currentFrame),n):n},handleStart:function(){this.showOnStart&&this.parent.setVisible(!0),this.setCurrentFrame(this.currentFrame),this.hasStarted=!0,this.emitEvents(s.ANIMATION_START)},handleRepeat:function(){this.pendingRepeat=!1,this.emitEvents(s.ANIMATION_REPEAT)},handleStop:function(){this._pendingStop=0,this.isPlaying=!1,this.emitEvents(s.ANIMATION_STOP)},handleComplete:function(){this._pendingStop=0,this.isPlaying=!1,this.hideOnComplete&&this.parent.setVisible(!1),this.emitEvents(s.ANIMATION_COMPLETE,s.ANIMATION_COMPLETE_KEY)},emitEvents:function(e,t){var n=this.currentAnim;if(n){var r=this.currentFrame,i=this.parent,a=r.textureFrame;i.emit(e,n,r,i,a),t&&i.emit(t+n.key,n,r,i,a)}},reverse:function(){return this.isPlaying&&(this.inReverse=!this.inReverse,this.forward=!this.forward),this.parent},getProgress:function(){var e=this.currentFrame;if(!e)return 0;var t=e.progress;return this.inReverse&&(t*=-1),t},setProgress:function(e){return this.forward||(e=1-e),this.setCurrentFrame(this.currentAnim.getFrameByProgress(e)),this.parent},setRepeat:function(e){return this.repeatCounter=e===-1?Number.MAX_VALUE:e,this.parent},globalRemove:function(e,t){t===void 0&&(t=this.currentAnim),this.isPlaying&&t.key===this.currentAnim.key&&(this.stop(),this.setCurrentFrame(this.currentAnim.frames[0]))},restart:function(e,t){e===void 0&&(e=!1),t===void 0&&(t=!1);var n=this.currentAnim,r=this.parent;return n?(t&&(this.repeatCounter=this.repeat===-1?Number.MAX_VALUE:this.repeat),n.getFirstTick(this),this.emitEvents(s.ANIMATION_RESTART),this.isPlaying=!0,this.pendingRepeat=!1,this.hasStarted=!e,this._pendingStop=0,this._pendingStopValue=0,this._paused=!1,this.setCurrentFrame(n.frames[0]),this.parent):r},complete:function(){if(this._pendingStop=0,this.isPlaying=!1,this.currentAnim&&this.handleComplete(),this.nextAnim){var e=this.nextAnim;this.nextAnim=this.nextAnimsQueue.length>0?this.nextAnimsQueue.shift():null,this.play(e)}return this.parent},stop:function(){if(this._pendingStop=0,this.isPlaying=!1,this.delayCounter=0,this.currentAnim&&this.handleStop(),this.nextAnim){var e=this.nextAnim;this.nextAnim=this.nextAnimsQueue.shift(),this.play(e)}return this.parent},stopAfterDelay:function(e){return this._pendingStop=1,this._pendingStopValue=e,this.parent},stopAfterRepeat:function(e){return e===void 0&&(e=1),this.repeatCounter!==-1&&e>this.repeatCounter&&(e=this.repeatCounter),this._pendingStop=2,this._pendingStopValue=e,this.parent},stopOnFrame:function(e){return this._pendingStop=3,this._pendingStopValue=e,this.parent},getTotalFrames:function(){return this.currentAnim?this.currentAnim.getTotalFrames():0},update:function(e,t){var n=this.currentAnim;if(!(!this.isPlaying||!n||n.paused)){if(this.accumulator+=t*this.timeScale*this.animationManager.globalTimeScale,this._pendingStop===1&&(this._pendingStopValue-=t,this._pendingStopValue<=0))return this.stop();if(!this.hasStarted)this.accumulator>=this.delayCounter&&(this.accumulator-=this.delayCounter,this.handleStart());else if(this.accumulator>=this.nextTick&&(this.forward?n.nextFrame(this):n.previousFrame(this),this.isPlaying&&this._pendingStop===0&&this.skipMissedFrames&&this.accumulator>this.nextTick)){var r=0;do this.forward?n.nextFrame(this):n.previousFrame(this),r++;while(this.isPlaying&&this.accumulator>this.nextTick&&r<60)}}},setCurrentFrame:function(e){var t=this.parent;return this.currentFrame=e,t.texture=e.frame.texture,t.frame=e.frame,t.isCropped&&t.frame.updateCropUVs(t._crop,t.flipX,t.flipY),e.setAlpha&&(t.alpha=e.alpha),t.setSizeToFrame(),t._originComponent&&(e.frame.customPivot?t.setOrigin(e.frame.pivotX,e.frame.pivotY):t.updateDisplayOrigin()),this.isPlaying&&this.hasStarted&&(this.emitEvents(s.ANIMATION_UPDATE),this._pendingStop===3&&this._pendingStopValue===e&&this.stop()),t},nextFrame:function(){return this.currentAnim&&this.currentAnim.nextFrame(this),this.parent},previousFrame:function(){return this.currentAnim&&this.currentAnim.previousFrame(this),this.parent},get:function(e){return this.anims?this.anims.get(e):null},exists:function(e){return this.anims?this.anims.has(e):!1},create:function(e){var t=e.key,n=!1;return t&&(n=this.get(t),n?console.warn(`Animation key already exists: `+t):(n=new r(this,t,e),this.anims||=new o,this.anims.set(t,n))),n},createFromAseprite:function(e,t){return this.animationManager.createFromAseprite(e,t,this.parent)},generateFrameNames:function(e,t){return this.animationManager.generateFrameNames(e,t)},generateFrameNumbers:function(e,t){return this.animationManager.generateFrameNumbers(e,t)},remove:function(e){var t=this.get(e);return t&&(this.currentAnim===t&&this.stop(),this.anims.delete(e)),t},destroy:function(){this.animationManager.off(s.REMOVE_ANIMATION,this.globalRemove,this),this.anims&&this.anims.clear(),this.animationManager=null,this.parent=null,this.nextAnim=null,this.nextAnimsQueue.length=0,this.currentAnim=null,this.currentFrame=null},isPaused:{get:function(){return this._paused}}})},57090(e){e.exports=`add`},25312(e){e.exports=`animationcomplete`},89580(e){e.exports=`animationcomplete-`},52860(e){e.exports=`animationrepeat`},63850(e){e.exports=`animationrestart`},99085(e){e.exports=`animationstart`},28087(e){e.exports=`animationstop`},1794(e){e.exports=`animationupdate`},52562(e){e.exports=`pauseall`},57953(e){e.exports=`remove`},68339(e){e.exports=`resumeall`},74943(e,t,n){e.exports={ADD_ANIMATION:n(57090),ANIMATION_COMPLETE:n(25312),ANIMATION_COMPLETE_KEY:n(89580),ANIMATION_REPEAT:n(52860),ANIMATION_RESTART:n(63850),ANIMATION_START:n(99085),ANIMATION_STOP:n(28087),ANIMATION_UPDATE:n(1794),PAUSE_ALL:n(52562),REMOVE_ANIMATION:n(57953),RESUME_ALL:n(68339)}},60421(e,t,n){e.exports={Animation:n(42099),AnimationFrame:n(41138),AnimationManager:n(60848),AnimationState:n(9674),Events:n(74943)}},2161(e,t,n){var r=n(83419),i=n(90330),a=n(50792),o=n(24736);e.exports=new r({initialize:function(){this.entries=new i,this.events=new a},add:function(e,t){return this.entries.set(e,t),this.events.emit(o.ADD,this,e,t),this},has:function(e){return this.entries.has(e)},exists:function(e){return this.entries.has(e)},get:function(e){return this.entries.get(e)},remove:function(e){var t=this.get(e);return t&&(this.entries.delete(e),this.events.emit(o.REMOVE,this,e,t.data)),this},getKeys:function(){return this.entries.keys()},destroy:function(){this.entries.clear(),this.events.removeAllListeners(),this.entries=null,this.events=null}})},24047(e,t,n){var r=n(2161),i=n(83419),a=n(8443);e.exports=new i({initialize:function(e){this.game=e,this.binary=new r,this.bitmapFont=new r,this.json=new r,this.physics=new r,this.shader=new r,this.audio=new r,this.video=new r,this.text=new r,this.html=new r,this.tilemap=new r,this.xml=new r,this.atlas=new r,this.custom={},this.game.events.once(a.DESTROY,this.destroy,this)},addCustom:function(e){return this.custom.hasOwnProperty(e)||(this.custom[e]=new r),this.custom[e]},destroy:function(){for(var e=[`binary`,`bitmapFont`,`json`,`physics`,`shader`,`audio`,`video`,`text`,`html`,`tilemap`,`xml`,`atlas`],t=0;t<e.length;t++)this[e[t]].destroy(),this[e[t]]=null;for(var n in this.custom)this.custom[n].destroy();this.custom=null,this.game=null}})},51464(e){e.exports=`add`},59261(e){e.exports=`remove`},24736(e,t,n){e.exports={ADD:n(51464),REMOVE:n(59261)}},83388(e,t,n){e.exports={BaseCache:n(2161),CacheManager:n(24047),Events:n(24736)}},71911(e,t,n){var r=n(83419),i=n(39506),a=n(50792),o=n(19715),s=n(87841),c=n(88509),l=n(61340),u=n(59715),d=n(80333),f=n(26099);e.exports=new r({Extends:a,Mixins:[c,u],initialize:function(e,t,n,r){e===void 0&&(e=0),t===void 0&&(t=0),n===void 0&&(n=0),r===void 0&&(r=0),a.call(this),this.scene,this.sceneManager,this.scaleManager,this.cameraManager,this.id=0,this.name=``,this.roundPixels=!1,this.useBounds=!1,this.worldView=new s,this.dirty=!0,this._x=e,this._y=t,this._width=n,this._height=r,this._bounds=new s,this._scrollX=0,this._scrollY=0,this._zoomX=1,this._zoomY=1,this._rotation=0,this.matrix=new l,this.matrixCombined=new l,this.matrixExternal=new l,this.transparent=!0,this.backgroundColor=d(`rgba(0,0,0,0)`),this.disableCull=!1,this.culledObjects=[],this.midPoint=new f(n/2,r/2),this.originX=.5,this.originY=.5,this._customViewport=!1,this.mask=null,this._maskCamera=null,this.renderList=[],this.isSceneCamera=!0,this.forceComposite=!1,this.renderRoundPixels=!0},addToRenderList:function(e){this.renderList.push(e)},setOrigin:function(e,t){return e===void 0&&(e=.5),t===void 0&&(t=e),this.originX=e,this.originY=t,this},getScroll:function(e,t,n){n===void 0&&(n=new f);var r=this.width*.5,i=this.height*.5;return n.x=e-r,n.y=t-i,this.useBounds&&(n.x=this.clampX(n.x),n.y=this.clampY(n.y)),n},centerOnX:function(e){var t=this.width*.5;return this.midPoint.x=e,this.scrollX=e-t,this.useBounds&&(this.scrollX=this.clampX(this.scrollX)),this},centerOnY:function(e){var t=this.height*.5;return this.midPoint.y=e,this.scrollY=e-t,this.useBounds&&(this.scrollY=this.clampY(this.scrollY)),this},centerOn:function(e,t){return this.centerOnX(e),this.centerOnY(t),this},centerToBounds:function(){if(this.useBounds){var e=this._bounds,t=this.width*.5,n=this.height*.5;this.midPoint.set(e.centerX,e.centerY),this.scrollX=e.centerX-t,this.scrollY=e.centerY-n}return this},centerToSize:function(){return this.scrollX=this.width*.5,this.scrollY=this.height*.5,this},cull:function(e){if(this.disableCull)return e;var t=this.matrix.matrix,n=t[0],r=t[1],i=t[2],a=t[3],o=n*a-r*i;if(!o)return e;var s=this.scrollX,c=this.scrollY,l=this.width,u=this.height,d=this.y,f=d+u,p=this.x,m=p+l,h=this.culledObjects,g=e.length;o=1/o,h.length=0;for(var _=0;_<g;++_){var v=e[_];if(!v.hasOwnProperty(`width`)||v.parentContainer){h.push(v);continue}var y=v.width,b=v.height,x=v.x-s*v.scrollFactorX-y*v.originX,S=v.y-c*v.scrollFactorY-b*v.originY,C=x*n+S*i,w=x*r+S*a,T=(x+y)*n+(S+b)*i,E=(x+y)*r+(S+b)*a;T>p&&C<m&&E>d&&w<f&&h.push(v)}return h},getWorldPoint:function(e,t,n){n===void 0&&(n=new f);var r=this.matrixCombined.matrix,i=r[0],a=r[1],o=r[2],s=r[3],c=r[4],l=r[5],u=i*s-a*o;if(!u)return n.x=e,n.y=t,n;u=1/u;var d=s*u,p=-a*u,m=-o*u,h=i*u,g=(o*l-s*c)*u,_=(a*c-i*l)*u;return n.x=e*d+t*m+g,n.y=e*p+t*h+_,n},ignore:function(e){var t=this.id;Array.isArray(e)||(e=[e]);for(var n=0;n<e.length;n++){var r=e[n];Array.isArray(r)?this.ignore(r):r.isParent?this.ignore(r.getChildren()):r.cameraFilter|=t}return this},clampX:function(e){var t=this._bounds,n=this.displayWidth,r=t.x+(n-this.width)/2,i=Math.max(r,r+t.width-n);return e<r?e=r:e>i&&(e=i),e},clampY:function(e){var t=this._bounds,n=this.displayHeight,r=t.y+(n-this.height)/2,i=Math.max(r,r+t.height-n);return e<r?e=r:e>i&&(e=i),e},removeBounds:function(){return this.useBounds=!1,this.dirty=!0,this._bounds.setEmpty(),this},setAngle:function(e){return e===void 0&&(e=0),this.rotation=i(e),this},setBackgroundColor:function(e){return e===void 0&&(e=`rgba(0,0,0,0)`),this.backgroundColor=d(e),this.transparent=this.backgroundColor.alpha===0,this},setBounds:function(e,t,n,r,i){return i===void 0&&(i=!1),this._bounds.setTo(e,t,n,r),this.dirty=!0,this.useBounds=!0,i?this.centerToBounds():(this.scrollX=this.clampX(this.scrollX),this.scrollY=this.clampY(this.scrollY)),this},setForceComposite:function(e){return this.forceComposite=e,this},getBounds:function(e){e===void 0&&(e=new s);var t=this._bounds;return e.setTo(t.x,t.y,t.width,t.height),e},setName:function(e){return e===void 0&&(e=``),this.name=e,this},setPosition:function(e,t){return t===void 0&&(t=e),this.x=e,this.y=t,this},setRotation:function(e){return e===void 0&&(e=0),this.rotation=e,this},setRoundPixels:function(e){return this.roundPixels=e,this},setScene:function(e,t){t===void 0&&(t=!0),this.scene&&this._customViewport&&this.sceneManager.customViewports--,this.scene=e,this.isSceneCamera=t;var n=e.sys;return this.sceneManager=n.game.scene,this.scaleManager=n.scale,this.cameraManager=n.cameras,this.updateSystem(),this},setScroll:function(e,t){return t===void 0&&(t=e),this.scrollX=e,this.scrollY=t,this},setSize:function(e,t){return t===void 0&&(t=e),this.width=e,this.height=t,this},setViewport:function(e,t,n,r){return this.x=e,this.y=t,this.width=n,this.height=r,this},setZoom:function(e,t){return e===void 0&&(e=1),t===void 0&&(t=e),e===0&&(e=.001),t===0&&(t=.001),this.zoomX=e,this.zoomY=t,this},setMask:function(e,t){return t===void 0&&(t=!0),this.mask=e,this._maskCamera=t?this.cameraManager.default:this,this},clearMask:function(e){return e===void 0&&(e=!1),e&&this.mask&&this.mask.destroy(),this.mask=null,this},toJSON:function(){var e={name:this.name,x:this.x,y:this.y,width:this.width,height:this.height,zoom:this.zoom,rotation:this.rotation,roundPixels:this.roundPixels,scrollX:this.scrollX,scrollY:this.scrollY,backgroundColor:this.backgroundColor.rgba};return this.useBounds&&(e.bounds={x:this._bounds.x,y:this._bounds.y,width:this._bounds.width,height:this._bounds.height}),e},update:function(){},setIsSceneCamera:function(e){return this.isSceneCamera=e,this},updateSystem:function(){if(!(!this.scaleManager||!this.isSceneCamera)){var e=this._x!==0||this._y!==0||this.scaleManager.width!==this._width||this.scaleManager.height!==this._height,t=this.sceneManager;e&&!this._customViewport?t.customViewports++:!e&&this._customViewport&&t.customViewports--,this.dirty=!0,this._customViewport=e}},destroy:function(){this.emit(o.DESTROY,this),this.removeAllListeners(),this.matrix.destroy(),this.matrixCombined.destroy(),this.matrixExternal.destroy(),this.culledObjects=[],this._customViewport&&this.sceneManager.customViewports--,this.renderList=[],this._bounds=null,this.scene=null,this.scaleManager=null,this.sceneManager=null,this.cameraManager=null},x:{get:function(){return this._x},set:function(e){this._x=e,this.updateSystem()}},y:{get:function(){return this._y},set:function(e){this._y=e,this.updateSystem()}},width:{get:function(){return this._width},set:function(e){this._width=e,this.updateSystem()}},height:{get:function(){return this._height},set:function(e){this._height=e,this.updateSystem()}},scrollX:{get:function(){return this._scrollX},set:function(e){e!==this._scrollX&&(this._scrollX=e,this.dirty=!0)}},scrollY:{get:function(){return this._scrollY},set:function(e){e!==this._scrollY&&(this._scrollY=e,this.dirty=!0)}},zoom:{get:function(){return(this._zoomX+this._zoomY)/2},set:function(e){this._zoomX=e,this._zoomY=e,this.dirty=!0}},zoomX:{get:function(){return this._zoomX},set:function(e){this._zoomX=e,this.dirty=!0}},zoomY:{get:function(){return this._zoomY},set:function(e){this._zoomY=e,this.dirty=!0}},rotation:{get:function(){return this._rotation},set:function(e){this._rotation=e,this.dirty=!0}},centerX:{get:function(){return this.x+.5*this.width}},centerY:{get:function(){return this.y+.5*this.height}},displayWidth:{get:function(){return this.width/this.zoomX}},displayHeight:{get:function(){return this.height/this.zoomY}}})},38058(e,t,n){var r=n(71911),i=n(67502),a=n(45319),o=n(83419),s=n(31401),c=n(20052),l=n(19715),u=n(28915),d=n(87841),f=n(26099);e.exports=new o({Extends:r,initialize:function(e,t,n,i){r.call(this,e,t,n,i),this.filters={internal:new s.FilterList(this),external:new s.FilterList(this)},this.isObjectInversion=!1,this.inputEnabled=!0,this.fadeEffect=new c.Fade(this),this.flashEffect=new c.Flash(this),this.shakeEffect=new c.Shake(this),this.panEffect=new c.Pan(this),this.rotateToEffect=new c.RotateTo(this),this.zoomEffect=new c.Zoom(this),this.lerp=new f(1,1),this.followOffset=new f,this.deadzone=null,this._follow=null},setDeadzone:function(e,t){if(e===void 0)this.deadzone=null;else{if(this.deadzone?(this.deadzone.width=e,this.deadzone.height=t):this.deadzone=new d(0,0,e,t),this._follow){var n=this.width/2,r=this.height/2,a=this._follow.x-this.followOffset.x,o=this._follow.y-this.followOffset.y;this.midPoint.set(a,o),this.scrollX=a-n,this.scrollY=o-r}i(this.deadzone,this.midPoint.x,this.midPoint.y)}return this},fadeIn:function(e,t,n,r,i,a){return this.fadeEffect.start(!1,e,t,n,r,!0,i,a)},fadeOut:function(e,t,n,r,i,a){return this.fadeEffect.start(!0,e,t,n,r,!0,i,a)},fadeFrom:function(e,t,n,r,i,a,o){return this.fadeEffect.start(!1,e,t,n,r,i,a,o)},fade:function(e,t,n,r,i,a,o){return this.fadeEffect.start(!0,e,t,n,r,i,a,o)},flash:function(e,t,n,r,i,a,o){return this.flashEffect.start(e,t,n,r,i,a,o)},shake:function(e,t,n,r,i){return this.shakeEffect.start(e,t,n,r,i)},pan:function(e,t,n,r,i,a,o){return this.panEffect.start(e,t,n,r,i,a,o)},rotateTo:function(e,t,n,r,i,a,o){return this.rotateToEffect.start(e,t,n,r,i,a,o)},zoomTo:function(e,t,n,r,i,a){return this.zoomEffect.start(e,t,n,r,i,a)},preRender:function(){this.renderList.length=0;var e=this.width,t=this.height,n=e*.5,r=t*.5,a=this.zoomX,o=this.zoomY;this.renderRoundPixels=this.roundPixels&&Number.isInteger(a)&&Number.isInteger(o);var s=e*this.originX,c=t*this.originY,d=this._follow,f=this.deadzone,p=this.scrollX,m=this.scrollY;f&&i(f,this.midPoint.x,this.midPoint.y);var h=!1;if(d&&!this.panEffect.isRunning){var g=this.lerp,_=d.x-this.followOffset.x,v=d.y-this.followOffset.y;f?(_<f.x?p=u(p,p-(f.x-_),g.x):_>f.right&&(p=u(p,p+(_-f.right),g.x)),v<f.y?m=u(m,m-(f.y-v),g.y):v>f.bottom&&(m=u(m,m+(v-f.bottom),g.y))):(p=u(p,_-s,g.x),m=u(m,v-c,g.y)),h=!0}this.useBounds&&(p=this.clampX(p),m=this.clampY(m)),this.scrollX=p,this.scrollY=m;var y=p+n,b=m+r;this.midPoint.set(y,b);var x=e/a,S=t/o,C=y-x/2,w=b-S/2;this.worldView.setTo(C,w,x,S);var T=this.matrix,E=this.matrixExternal;this.isObjectInversion?(T.loadIdentity(),T.translate(s,c),T.scale(a,o),T.rotate(this.rotation),T.translate(-p-s,-m-c)):(T.applyITRS(s,c,this.rotation,a,o),T.translate(-p-s,-m-c)),E.applyITRS(this.x,this.y,0,1,1),this.shakeEffect.preRender(),E.multiply(T,this.matrixCombined),h&&this.emit(l.FOLLOW_UPDATE,this,d)},getViewMatrix:function(e){return e||this.forceComposite||this.filters.external.length>0||this.filters.internal.length>0?this.matrix:this.matrixCombined},getPaddingWrapper:function(e){var t={padding:0},n=new Proxy(this,{get:function(e,n){switch(n){case`padding`:return t.padding;case`x`:case`y`:case`scrollX`:case`scrollY`:return e[n]+t.padding;case`width`:case`height`:return e[n]-t.padding*2;default:return e[n]}},set:function(n,r,i){switch(r){case`padding`:var a=t.padding;t.padding=i;var o=t.padding-a;return n.x-=o,n.y-=o,n.width+=o*2,n.height+=o*2,n.scrollX-=o,n.scrollY-=o,e;case`x`:case`y`:case`scrollX`:case`scrollY`:return n[r]=i-t.padding;case`width`:case`height`:return n[r]=i+t.padding*2;default:return n[r]=i}}});return n.padding=e||0,n},setLerp:function(e,t){return e===void 0&&(e=1),t===void 0&&(t=e),this.lerp.set(e,t),this},setFollowOffset:function(e,t){return e===void 0&&(e=0),t===void 0&&(t=0),this.followOffset.set(e,t),this},startFollow:function(e,t,n,r,i,o){t===void 0&&(t=!1),n===void 0&&(n=1),r===void 0&&(r=n),i===void 0&&(i=0),o===void 0&&(o=i),this._follow=e,this.roundPixels=t,n=a(n,0,1),r=a(r,0,1),this.lerp.set(n,r),this.followOffset.set(i,o);var s=this.width/2,c=this.height/2,l=e.x-i,u=e.y-o;return this.midPoint.set(l,u),this.scrollX=l-s,this.scrollY=u-c,this.useBounds&&(this.scrollX=this.clampX(this.scrollX),this.scrollY=this.clampY(this.scrollY)),this},stopFollow:function(){return this._follow=null,this},resetFX:function(){return this.rotateToEffect.reset(),this.panEffect.reset(),this.shakeEffect.reset(),this.flashEffect.reset(),this.fadeEffect.reset(),this},update:function(e,t){this.visible&&(this.rotateToEffect.update(e,t),this.panEffect.update(e,t),this.zoomEffect.update(e,t),this.shakeEffect.update(e,t),this.flashEffect.update(e,t),this.fadeEffect.update(e,t))},destroy:function(){this.resetFX(),this.filters.internal.destroy(),this.filters.external.destroy(),r.prototype.destroy.call(this),this._follow=null,this.deadzone=null}})},32743(e,t,n){var r=n(38058),i=n(83419),a=n(95540),o=n(37277),s=n(37303),c=n(97480),l=n(44594),u=new i({initialize:function(e){this.scene=e,this.systems=e.sys,this.roundPixels=e.sys.game.config.roundPixels,this.cameras=[],this.main,this.default,e.sys.events.once(l.BOOT,this.boot,this),e.sys.events.on(l.START,this.start,this)},boot:function(){var e=this.systems;e.settings.cameras?this.fromJSON(e.settings.cameras):this.add(),this.main=this.cameras[0],this.default=new r(0,0,e.scale.width,e.scale.height).setScene(this.scene),e.game.scale.on(c.RESIZE,this.onResize,this),this.systems.events.once(l.DESTROY,this.destroy,this)},start:function(){if(!this.main){var e=this.systems;e.settings.cameras?this.fromJSON(e.settings.cameras):this.add(),this.main=this.cameras[0]}var t=this.systems.events;t.on(l.UPDATE,this.update,this),t.once(l.SHUTDOWN,this.shutdown,this)},add:function(e,t,n,i,a,o){e===void 0&&(e=0),t===void 0&&(t=0),n===void 0&&(n=this.scene.sys.scale.width),i===void 0&&(i=this.scene.sys.scale.height),a===void 0&&(a=!1),o===void 0&&(o=``);var s=new r(e,t,n,i);return s.setName(o),s.setScene(this.scene),s.setRoundPixels(this.roundPixels),s.id=this.getNextID(),this.cameras.push(s),a&&(this.main=s),s},addExisting:function(e,t){return t===void 0&&(t=!1),this.cameras.indexOf(e)===-1?(e.id=this.getNextID(),e.setRoundPixels(this.roundPixels),this.cameras.push(e),t&&(this.main=e),e):null},getNextID:function(){for(var e=this.cameras,t=1,n=0;n<32;n++){for(var r=!1,i=0;i<e.length;i++){var a=e[i];if(a&&a.id===t){r=!0;continue}}if(r)t<<=1;else return t}return 0},getTotal:function(e){e===void 0&&(e=!1);for(var t=0,n=this.cameras,r=0;r<n.length;r++){var i=n[r];(!e||e&&i.visible)&&t++}return t},fromJSON:function(e){Array.isArray(e)||(e=[e]);for(var t=this.scene.sys.scale.width,n=this.scene.sys.scale.height,r=0;r<e.length;r++){var i=e[r],o=a(i,`x`,0),s=a(i,`y`,0),c=a(i,`width`,t),l=a(i,`height`,n),u=this.add(o,s,c,l);u.name=a(i,`name`,``),u.zoom=a(i,`zoom`,1),u.rotation=a(i,`rotation`,0),u.scrollX=a(i,`scrollX`,0),u.scrollY=a(i,`scrollY`,0),u.roundPixels=a(i,`roundPixels`,!1),u.visible=a(i,`visible`,!0);var d=a(i,`backgroundColor`,!1);d&&u.setBackgroundColor(d);var f=a(i,`bounds`,null);if(f){var p=a(f,`x`,0),m=a(f,`y`,0),h=a(f,`width`,t),g=a(f,`height`,n);u.setBounds(p,m,h,g)}}return this},getCamera:function(e){for(var t=this.cameras,n=0;n<t.length;n++)if(t[n].name===e)return t[n];return null},getCamerasBelowPointer:function(e){for(var t=this.cameras,n=e.x,r=e.y,i=[],a=0;a<t.length;a++){var o=t[a];o.visible&&o.inputEnabled&&s(o,n,r)&&i.unshift(o)}return i},remove:function(e,t){t===void 0&&(t=!0),Array.isArray(e)||(e=[e]);for(var n=0,r=this.cameras,i=0;i<e.length;i++){var a=r.indexOf(e[i]);a!==-1&&(t?r[a].destroy():r[a].renderList=[],r.splice(a,1),n++)}return!this.main&&r[0]&&(this.main=r[0]),n},render:function(e,t){for(var n=this.scene,r=this.cameras,i=0;i<r.length;i++){var a=r[i];if(a.visible&&a.alpha>0){a.preRender();var o=this.getVisibleChildren(t.getChildren(),a);e.render(n,o,a)}}},getVisibleChildren:function(e,t){return e.filter(function(e){return e.willRender(t)})},resetAll:function(){for(var e=0;e<this.cameras.length;e++)this.cameras[e].destroy();return this.cameras=[],this.main=this.add(),this.main},update:function(e,t){for(var n=0;n<this.cameras.length;n++)this.cameras[n].update(e,t)},onResize:function(e,t,n,r,i){for(var a=0;a<this.cameras.length;a++){var o=this.cameras[a];o._x===0&&o._y===0&&o._width===r&&o._height===i&&o.setSize(t.width,t.height)}},resize:function(e,t){for(var n=0;n<this.cameras.length;n++)this.cameras[n].setSize(e,t)},shutdown:function(){this.main=void 0;for(var e=0;e<this.cameras.length;e++)this.cameras[e].destroy();this.cameras=[];var t=this.systems.events;t.off(l.UPDATE,this.update,this),t.off(l.SHUTDOWN,this.shutdown,this)},destroy:function(){this.shutdown(),this.default.destroy(),this.systems.events.off(l.START,this.start,this),this.systems.events.off(l.DESTROY,this.destroy,this),this.systems.game.scale.off(c.RESIZE,this.onResize,this),this.scene=null,this.systems=null}});o.register(`CameraManager`,u,`cameras`),e.exports=u},5020(e,t,n){var r=n(45319),i=n(83419),a=n(19715);e.exports=new i({initialize:function(e){this.camera=e,this.isRunning=!1,this.isComplete=!1,this.direction=!0,this.duration=0,this.red=0,this.green=0,this.blue=0,this.alpha=0,this.progress=0,this._elapsed=0,this._onUpdate,this._onUpdateScope},start:function(e,t,n,r,i,o,s,c){if(e===void 0&&(e=!0),t===void 0&&(t=1e3),n===void 0&&(n=0),r===void 0&&(r=0),i===void 0&&(i=0),o===void 0&&(o=!1),s===void 0&&(s=null),c===void 0&&(c=this.camera.scene),!o&&this.isRunning)return this.camera;this.isRunning=!0,this.isComplete=!1,this.duration=t,this.direction=e,this.progress=0,this.red=n,this.green=r,this.blue=i,this.alpha=e?Number.MIN_VALUE:1,this._elapsed=0,this._onUpdate=s,this._onUpdateScope=c;var l=e?a.FADE_OUT_START:a.FADE_IN_START;return this.camera.emit(l,this.camera,this,t,n,r,i),this.camera},update:function(e,t){this.isRunning&&(this._elapsed+=t,this.progress=r(this._elapsed/this.duration,0,1),this._onUpdate&&this._onUpdate.call(this._onUpdateScope,this.camera,this.progress),this._elapsed<this.duration?this.alpha=this.direction?this.progress:1-this.progress:(this.alpha=+!!this.direction,this.effectComplete()))},postRenderCanvas:function(e){if(!this.isRunning&&!this.isComplete)return!1;var t=this.camera;return e.fillStyle=`rgba(`+this.red+`,`+this.green+`,`+this.blue+`,`+this.alpha+`)`,e.fillRect(t.x,t.y,t.width,t.height),!0},postRenderWebGL:function(){return this.isRunning||this.isComplete},effectComplete:function(){this._onUpdate=null,this._onUpdateScope=null,this.isRunning=!1,this.isComplete=!0;var e=this.direction?a.FADE_OUT_COMPLETE:a.FADE_IN_COMPLETE;this.camera.emit(e,this.camera,this)},reset:function(){this.isRunning=!1,this.isComplete=!1,this._onUpdate=null,this._onUpdateScope=null},destroy:function(){this.reset(),this.camera=null}})},10662(e,t,n){var r=n(45319),i=n(83419),a=n(19715);e.exports=new i({initialize:function(e){this.camera=e,this.isRunning=!1,this.duration=0,this.red=0,this.green=0,this.blue=0,this.alpha=1,this.progress=0,this._elapsed=0,this._alpha,this._onUpdate,this._onUpdateScope},start:function(e,t,n,r,i,o,s){return e===void 0&&(e=250),t===void 0&&(t=255),n===void 0&&(n=255),r===void 0&&(r=255),i===void 0&&(i=!1),o===void 0&&(o=null),s===void 0&&(s=this.camera.scene),!i&&this.isRunning?this.camera:(this.isRunning=!0,this.duration=e,this.progress=0,this.red=t,this.green=n,this.blue=r,this._alpha=this.alpha,this._elapsed=0,this._onUpdate=o,this._onUpdateScope=s,this.camera.emit(a.FLASH_START,this.camera,this,e,t,n,r),this.camera)},update:function(e,t){this.isRunning&&(this._elapsed+=t,this.progress=r(this._elapsed/this.duration,0,1),this._onUpdate&&this._onUpdate.call(this._onUpdateScope,this.camera,this.progress),this._elapsed<this.duration?this.alpha=this._alpha*(1-this.progress):this.effectComplete())},postRenderCanvas:function(e){if(!this.isRunning)return!1;var t=this.camera;return e.fillStyle=`rgba(`+this.red+`,`+this.green+`,`+this.blue+`,`+this.alpha+`)`,e.fillRect(t.x,t.y,t.width,t.height),!0},postRenderWebGL:function(){return this.isRunning},effectComplete:function(){this.alpha=this._alpha,this._onUpdate=null,this._onUpdateScope=null,this.isRunning=!1,this.camera.emit(a.FLASH_COMPLETE,this.camera,this)},reset:function(){this.isRunning=!1,this._onUpdate=null,this._onUpdateScope=null},destroy:function(){this.reset(),this.camera=null}})},20359(e,t,n){var r=n(45319),i=n(83419),a=n(62640),o=n(19715),s=n(26099);e.exports=new i({initialize:function(e){this.camera=e,this.isRunning=!1,this.duration=0,this.source=new s,this.current=new s,this.destination=new s,this.ease,this.progress=0,this._elapsed=0,this._onUpdate,this._onUpdateScope},start:function(e,t,n,r,i,s,c){n===void 0&&(n=1e3),r===void 0&&(r=a.Linear),i===void 0&&(i=!1),s===void 0&&(s=null),c===void 0&&(c=this.camera.scene);var l=this.camera;return!i&&this.isRunning?l:(this.isRunning=!0,this.duration=n,this.progress=0,this.source.set(l.scrollX,l.scrollY),this.destination.set(e,t),l.getScroll(e,t,this.current),typeof r==`string`&&a.hasOwnProperty(r)?this.ease=a[r]:typeof r==`function`&&(this.ease=r),this._elapsed=0,this._onUpdate=s,this._onUpdateScope=c,this.camera.emit(o.PAN_START,this.camera,this,n,e,t),l)},update:function(e,t){if(this.isRunning){this._elapsed+=t;var n=r(this._elapsed/this.duration,0,1);this.progress=n;var i=this.camera;if(this._elapsed<this.duration){var a=this.ease(n);i.getScroll(this.destination.x,this.destination.y,this.current);var o=this.source.x+(this.current.x-this.source.x)*a,s=this.source.y+(this.current.y-this.source.y)*a;i.setScroll(o,s),this._onUpdate&&this._onUpdate.call(this._onUpdateScope,i,n,o,s)}else i.centerOn(this.destination.x,this.destination.y),this._onUpdate&&this._onUpdate.call(this._onUpdateScope,i,n,i.scrollX,i.scrollY),this.effectComplete()}},effectComplete:function(){this._onUpdate=null,this._onUpdateScope=null,this.isRunning=!1,this.camera.emit(o.PAN_COMPLETE,this.camera,this)},reset:function(){this.isRunning=!1,this._onUpdate=null,this._onUpdateScope=null},destroy:function(){this.reset(),this.camera=null,this.source=null,this.destination=null}})},34208(e,t,n){var r=n(45319),i=n(83419),a=n(19715),o=n(62640),s=n(86554);e.exports=new i({initialize:function(e){this.camera=e,this.isRunning=!1,this.duration=0,this.source=0,this.current=0,this.destination=0,this.ease,this.progress=0,this._elapsed=0,this._onUpdate,this._onUpdateScope,this.clockwise=!0,this.shortestPath=!1},start:function(e,t,n,r,i,c,l){n===void 0&&(n=1e3),r===void 0&&(r=o.Linear),i===void 0&&(i=!1),c===void 0&&(c=null),l===void 0&&(l=this.camera.scene),t===void 0&&(t=!1);var u=this.camera;if(!i&&this.isRunning)return u;if(this.shortestPath=t,this.isRunning=!0,this.duration=n,this.progress=0,this.source=u.rotation,this.destination=e,typeof r==`string`&&o.hasOwnProperty(r)?this.ease=o[r]:typeof r==`function`&&(this.ease=r),this._elapsed=0,this._onUpdate=c,this._onUpdateScope=l,this.shortestPath){var d=s(this.destination-this.source);this.destination=this.source+d,this.clockwise=d>=0}else this.clockwise=this.destination>=this.source;return this.camera.emit(a.ROTATE_START,this.camera,this,n,this.destination),u},update:function(e,t){if(this.isRunning){this._elapsed+=t;var n=r(this._elapsed/this.duration,0,1);this.progress=n;var i=this.camera;if(this._elapsed<this.duration){var a=this.ease(n),o=this.source+a*(this.destination-this.source);i.rotation=o,this.current=o,this._onUpdate&&this._onUpdate.call(this._onUpdateScope,i,n,o)}else i.rotation=this.destination,this.current=this.destination,this._onUpdate&&this._onUpdate.call(this._onUpdateScope,i,n,this.destination),this.effectComplete()}},effectComplete:function(){this._onUpdate=null,this._onUpdateScope=null,this.isRunning=!1,this.camera.emit(a.ROTATE_COMPLETE,this.camera,this)},reset:function(){this.isRunning=!1,this._onUpdate=null,this._onUpdateScope=null},destroy:function(){this.reset(),this.camera=null,this.source=null,this.destination=null}})},30330(e,t,n){var r=n(45319),i=n(83419),a=n(19715),o=n(26099);e.exports=new i({initialize:function(e){this.camera=e,this.isRunning=!1,this.duration=0,this.intensity=new o,this.progress=0,this._elapsed=0,this._offsetX=0,this._offsetY=0,this._onUpdate,this._onUpdateScope},start:function(e,t,n,r,i){return e===void 0&&(e=100),t===void 0&&(t=.05),n===void 0&&(n=!1),r===void 0&&(r=null),i===void 0&&(i=this.camera.scene),!n&&this.isRunning?this.camera:(this.isRunning=!0,this.duration=e,this.progress=0,typeof t==`number`?this.intensity.set(t):this.intensity.set(t.x,t.y),this._elapsed=0,this._offsetX=0,this._offsetY=0,this._onUpdate=r,this._onUpdateScope=i,this.camera.emit(a.SHAKE_START,this.camera,this,e,t),this.camera)},preRender:function(){this.isRunning&&this.camera.matrix.translate(this._offsetX,this._offsetY)},update:function(e,t){if(this.isRunning)if(this._elapsed+=t,this.progress=r(this._elapsed/this.duration,0,1),this._onUpdate&&this._onUpdate.call(this._onUpdateScope,this.camera,this.progress),this._elapsed<this.duration){var n=this.intensity,i=this.camera.width,a=this.camera.height,o=this.camera.zoom;this._offsetX=(Math.random()*n.x*i*2-n.x*i)*o,this._offsetY=(Math.random()*n.y*a*2-n.y*a)*o,this.camera.roundPixels&&(this._offsetX=Math.round(this._offsetX),this._offsetY=Math.round(this._offsetY))}else this.effectComplete()},effectComplete:function(){this._offsetX=0,this._offsetY=0,this._onUpdate=null,this._onUpdateScope=null,this.isRunning=!1,this.camera.emit(a.SHAKE_COMPLETE,this.camera,this)},reset:function(){this.isRunning=!1,this._offsetX=0,this._offsetY=0,this._onUpdate=null,this._onUpdateScope=null},destroy:function(){this.reset(),this.camera=null,this.intensity=null}})},45641(e,t,n){var r=n(45319),i=n(83419),a=n(62640),o=n(19715);e.exports=new i({initialize:function(e){this.camera=e,this.isRunning=!1,this.duration=0,this.source=1,this.destination=1,this.ease,this.progress=0,this._elapsed=0,this._onUpdate,this._onUpdateScope},start:function(e,t,n,r,i,s){t===void 0&&(t=1e3),n===void 0&&(n=a.Linear),r===void 0&&(r=!1),i===void 0&&(i=null),s===void 0&&(s=this.camera.scene);var c=this.camera;return!r&&this.isRunning?c:(this.isRunning=!0,this.duration=t,this.progress=0,this.source=c.zoom,this.destination=e,typeof n==`string`&&a.hasOwnProperty(n)?this.ease=a[n]:typeof n==`function`&&(this.ease=n),this._elapsed=0,this._onUpdate=i,this._onUpdateScope=s,this.camera.emit(o.ZOOM_START,this.camera,this,t,e),c)},update:function(e,t){this.isRunning&&(this._elapsed+=t,this.progress=r(this._elapsed/this.duration,0,1),this._elapsed<this.duration?(this.camera.zoom=this.source+(this.destination-this.source)*this.ease(this.progress),this._onUpdate&&this._onUpdate.call(this._onUpdateScope,this.camera,this.progress,this.camera.zoom)):(this.camera.zoom=this.destination,this._onUpdate&&this._onUpdate.call(this._onUpdateScope,this.camera,this.progress,this.destination),this.effectComplete()))},effectComplete:function(){this._onUpdate=null,this._onUpdateScope=null,this.isRunning=!1,this.camera.emit(o.ZOOM_COMPLETE,this.camera,this)},reset:function(){this.isRunning=!1,this._onUpdate=null,this._onUpdateScope=null},destroy:function(){this.reset(),this.camera=null}})},20052(e,t,n){e.exports={Fade:n(5020),Flash:n(10662),Pan:n(20359),Shake:n(30330),RotateTo:n(34208),Zoom:n(45641)}},16438(e){e.exports=`cameradestroy`},32726(e){e.exports=`camerafadeincomplete`},87807(e){e.exports=`camerafadeinstart`},45917(e){e.exports=`camerafadeoutcomplete`},95666(e){e.exports=`camerafadeoutstart`},47056(e){e.exports=`cameraflashcomplete`},91261(e){e.exports=`cameraflashstart`},45047(e){e.exports=`followupdate`},81927(e){e.exports=`camerapancomplete`},74264(e){e.exports=`camerapanstart`},54419(e){e.exports=`postrender`},79330(e){e.exports=`prerender`},93183(e){e.exports=`camerarotatecomplete`},80112(e){e.exports=`camerarotatestart`},62252(e){e.exports=`camerashakecomplete`},86017(e){e.exports=`camerashakestart`},539(e){e.exports=`camerazoomcomplete`},51892(e){e.exports=`camerazoomstart`},19715(e,t,n){e.exports={DESTROY:n(16438),FADE_IN_COMPLETE:n(32726),FADE_IN_START:n(87807),FADE_OUT_COMPLETE:n(45917),FADE_OUT_START:n(95666),FLASH_COMPLETE:n(47056),FLASH_START:n(91261),FOLLOW_UPDATE:n(45047),PAN_COMPLETE:n(81927),PAN_START:n(74264),POST_RENDER:n(54419),PRE_RENDER:n(79330),ROTATE_COMPLETE:n(93183),ROTATE_START:n(80112),SHAKE_COMPLETE:n(62252),SHAKE_START:n(86017),ZOOM_COMPLETE:n(539),ZOOM_START:n(51892)}},87969(e,t,n){e.exports={Camera:n(38058),BaseCamera:n(71911),CameraManager:n(32743),Effects:n(20052),Events:n(19715)}},63091(e,t,n){var r=n(83419),i=n(35154);e.exports=new r({initialize:function(e){this.camera=i(e,`camera`,null),this.left=i(e,`left`,null),this.right=i(e,`right`,null),this.up=i(e,`up`,null),this.down=i(e,`down`,null),this.zoomIn=i(e,`zoomIn`,null),this.zoomOut=i(e,`zoomOut`,null),this.zoomSpeed=i(e,`zoomSpeed`,.01),this.minZoom=i(e,`minZoom`,.001),this.maxZoom=i(e,`maxZoom`,1e3),this.speedX=0,this.speedY=0;var t=i(e,`speed`,null);typeof t==`number`?(this.speedX=t,this.speedY=t):(this.speedX=i(e,`speed.x`,0),this.speedY=i(e,`speed.y`,0)),this._zoom=0,this.active=this.camera!==null},start:function(){return this.active=this.camera!==null,this},stop:function(){return this.active=!1,this},setCamera:function(e){return this.camera=e,this},update:function(e){if(this.active){e===void 0&&(e=1);var t=this.camera;this.up&&this.up.isDown?t.scrollY-=this.speedY*e|0:this.down&&this.down.isDown&&(t.scrollY+=this.speedY*e|0),this.left&&this.left.isDown?t.scrollX-=this.speedX*e|0:this.right&&this.right.isDown&&(t.scrollX+=this.speedX*e|0),this.zoomIn&&this.zoomIn.isDown?(t.zoom-=this.zoomSpeed,t.zoom<this.minZoom&&(t.zoom=this.minZoom)):this.zoomOut&&this.zoomOut.isDown&&(t.zoom+=this.zoomSpeed,t.zoom>this.maxZoom&&(t.zoom=this.maxZoom))}},destroy:function(){this.camera=null,this.left=null,this.right=null,this.up=null,this.down=null,this.zoomIn=null,this.zoomOut=null}})},58818(e,t,n){var r=n(83419),i=n(35154);e.exports=new r({initialize:function(e){this.camera=i(e,`camera`,null),this.left=i(e,`left`,null),this.right=i(e,`right`,null),this.up=i(e,`up`,null),this.down=i(e,`down`,null),this.zoomIn=i(e,`zoomIn`,null),this.zoomOut=i(e,`zoomOut`,null),this.zoomSpeed=i(e,`zoomSpeed`,.01),this.minZoom=i(e,`minZoom`,.001),this.maxZoom=i(e,`maxZoom`,1e3),this.accelX=0,this.accelY=0;var t=i(e,`acceleration`,null);typeof t==`number`?(this.accelX=t,this.accelY=t):(this.accelX=i(e,`acceleration.x`,0),this.accelY=i(e,`acceleration.y`,0)),this.dragX=0,this.dragY=0;var n=i(e,`drag`,null);typeof n==`number`?(this.dragX=n,this.dragY=n):(this.dragX=i(e,`drag.x`,0),this.dragY=i(e,`drag.y`,0)),this.maxSpeedX=0,this.maxSpeedY=0;var r=i(e,`maxSpeed`,null);typeof r==`number`?(this.maxSpeedX=r,this.maxSpeedY=r):(this.maxSpeedX=i(e,`maxSpeed.x`,0),this.maxSpeedY=i(e,`maxSpeed.y`,0)),this._speedX=0,this._speedY=0,this._zoom=0,this.active=this.camera!==null},start:function(){return this.active=this.camera!==null,this},stop:function(){return this.active=!1,this},setCamera:function(e){return this.camera=e,this},update:function(e){if(this.active){e===void 0&&(e=1);var t=this.camera;this._speedX>0?(this._speedX-=this.dragX*e,this._speedX<0&&(this._speedX=0)):this._speedX<0&&(this._speedX+=this.dragX*e,this._speedX>0&&(this._speedX=0)),this._speedY>0?(this._speedY-=this.dragY*e,this._speedY<0&&(this._speedY=0)):this._speedY<0&&(this._speedY+=this.dragY*e,this._speedY>0&&(this._speedY=0)),this.up&&this.up.isDown?(this._speedY+=this.accelY,this._speedY>this.maxSpeedY&&(this._speedY=this.maxSpeedY)):this.down&&this.down.isDown&&(this._speedY-=this.accelY,this._speedY<-this.maxSpeedY&&(this._speedY=-this.maxSpeedY)),this.left&&this.left.isDown?(this._speedX+=this.accelX,this._speedX>this.maxSpeedX&&(this._speedX=this.maxSpeedX)):this.right&&this.right.isDown&&(this._speedX-=this.accelX,this._speedX<-this.maxSpeedX&&(this._speedX=-this.maxSpeedX)),this.zoomIn&&this.zoomIn.isDown?this._zoom=-this.zoomSpeed:this.zoomOut&&this.zoomOut.isDown?this._zoom=this.zoomSpeed:this._zoom=0,this._speedX!==0&&(t.scrollX-=this._speedX*e|0),this._speedY!==0&&(t.scrollY-=this._speedY*e|0),this._zoom!==0&&(t.zoom+=this._zoom,t.zoom<this.minZoom?t.zoom=this.minZoom:t.zoom>this.maxZoom&&(t.zoom=this.maxZoom))}},destroy:function(){this.camera=null,this.left=null,this.right=null,this.up=null,this.down=null,this.zoomIn=null,this.zoomOut=null}})},38865(e,t,n){e.exports={FixedKeyControl:n(63091),SmoothedKeyControl:n(58818)}},26638(e,t,n){e.exports={Controls:n(38865),Scene2D:n(87969)}},8054(e,t,n){e.exports={VERSION:`4.2.1`,LOG_VERSION:`v4021`,BlendModes:n(10312),ScaleModes:n(29795),AUTO:0,CANVAS:1,WEBGL:2,HEADLESS:3,FOREVER:-1,NONE:4,UP:5,DOWN:6,LEFT:7,RIGHT:8}},69547(e,t,n){var r=n(83419),i=n(8054),a=n(42363),o=n(82264),s=n(95540),c=n(35154),l=n(41212),u=n(29747),d=n(75508),f=n(80333);e.exports=new r({initialize:function(e){e===void 0&&(e={});var t=[`#000814`,`#001d3d`,`#003566`],n=`#ffffff`,r=c(e,`scale`,null);this.width=c(r,`width`,1024,e),this.height=c(r,`height`,768,e),this.zoom=c(r,`zoom`,1,e),this.parent=c(r,`parent`,void 0,e),this.scaleMode=c(r,r?`mode`:`scaleMode`,0,e),this.expandParent=c(r,`expandParent`,!0,e),this.autoRound=c(r,`autoRound`,!1,e),this.autoCenter=c(r,`autoCenter`,0,e),this.resizeInterval=c(r,`resizeInterval`,500,e),this.fullscreenTarget=c(r,`fullscreenTarget`,null,e),this.minWidth=c(r,`min.width`,0,e),this.maxWidth=c(r,`max.width`,0,e),this.minHeight=c(r,`min.height`,0,e),this.maxHeight=c(r,`max.height`,0,e),this.snapWidth=c(r,`snap.width`,0,e),this.snapHeight=c(r,`snap.height`,0,e),this.renderType=c(e,`type`,i.AUTO),this.canvas=c(e,`canvas`,null),this.context=c(e,`context`,null),this.canvasStyle=c(e,`canvasStyle`,null),this.customEnvironment=c(e,`customEnvironment`,!1),this.sceneConfig=c(e,`scene`,null),this.seed=c(e,`seed`,[(Date.now()*Math.random()).toString()]),d.RND=new d.RandomDataGenerator(this.seed),this.gameTitle=c(e,`title`,``),this.gameURL=c(e,`url`,`https://phaser.io/`+i.LOG_VERSION),this.gameVersion=c(e,`version`,``),this.autoFocus=c(e,`autoFocus`,!0),this.stableSort=c(e,`stableSort`,-1),this.stableSort===-1&&(this.stableSort=+!!o.browser.es2019),o.features.stableSort=this.stableSort,this.domCreateContainer=c(e,`dom.createContainer`,!1),this.domPointerEvents=c(e,`dom.pointerEvents`,`none`),this.inputKeyboard=c(e,`input.keyboard`,!0),this.inputKeyboardEventTarget=c(e,`input.keyboard.target`,window),this.inputKeyboardCapture=c(e,`input.keyboard.capture`,[]),this.inputMouse=c(e,`input.mouse`,!0),this.inputMouseEventTarget=c(e,`input.mouse.target`,null),this.inputMousePreventDefaultDown=c(e,`input.mouse.preventDefaultDown`,!0),this.inputMousePreventDefaultUp=c(e,`input.mouse.preventDefaultUp`,!0),this.inputMousePreventDefaultMove=c(e,`input.mouse.preventDefaultMove`,!0),this.inputMousePreventDefaultWheel=c(e,`input.mouse.preventDefaultWheel`,!0),this.inputTouch=c(e,`input.touch`,o.input.touch),this.inputTouchEventTarget=c(e,`input.touch.target`,null),this.inputTouchCapture=c(e,`input.touch.capture`,!0),this.inputActivePointers=c(e,`input.activePointers`,1),this.inputSmoothFactor=c(e,`input.smoothFactor`,0),this.inputWindowEvents=c(e,`input.windowEvents`,!0),this.inputGamepad=c(e,`input.gamepad`,!1),this.inputGamepadEventTarget=c(e,`input.gamepad.target`,window),this.disableContextMenu=c(e,`disableContextMenu`,!1),this.audio=c(e,`audio`,{}),this.hideBanner=c(e,`banner`,null)===!1,this.hidePhaser=c(e,`banner.hidePhaser`,!1),this.bannerTextColor=c(e,`banner.text`,n),this.bannerBackgroundColor=c(e,`banner.background`,t),this.gameTitle===``&&this.hidePhaser&&(this.hideBanner=!0),this.fps=c(e,`fps`,null);var p=c(e,`render`,null);this.autoMobileTextures=c(p,`autoMobileTextures`,!0,e),this.antialias=c(p,`antialias`,!0,e),this.antialiasGL=c(p,`antialiasGL`,!0,e),this.mipmapFilter=c(p,`mipmapFilter`,``,e),this.mipmapRegeneration=c(p,`mipmapRegeneration`,!1,e),this.desynchronized=c(p,`desynchronized`,!1,e),this.roundPixels=c(p,`roundPixels`,!1,e),this.selfShadow=c(p,`selfShadow`,!1,e),this.pathDetailThreshold=c(p,`pathDetailThreshold`,1,e),this.pixelArt=c(p,`pixelArt`,!1,e),this.pixelArt&&(this.antialias=!1,this.antialiasGL=!1,this.roundPixels=!0),this.smoothPixelArt=c(p,`smoothPixelArt`,!1,e),this.smoothPixelArt&&(this.antialias=!0,this.antialiasGL=!0,this.pixelArt=!1),this.transparent=c(p,`transparent`,!1,e),this.alphaStrategy=c(p,`alphaStrategy`,`keep`,e),this.stencil=c(p,`stencil`,!0,e),this.stencilAlphaStrategy=c(p,`stencilAlphaStrategy`,`dither`,e),this.clearBeforeRender=c(p,`clearBeforeRender`,!0,e),this.preserveDrawingBuffer=c(p,`preserveDrawingBuffer`,!1,e),this.premultipliedAlpha=c(p,`premultipliedAlpha`,!0,e),this.skipUnreadyShaders=c(p,`skipUnreadyShaders`,!1,e),this.failIfMajorPerformanceCaveat=c(p,`failIfMajorPerformanceCaveat`,!1,e),this.powerPreference=c(p,`powerPreference`,`default`,e),this.batchSize=c(p,`batchSize`,16384,e),this.maxTextures=c(p,`maxTextures`,-1,e),this.maxLights=c(p,`maxLights`,10,e),this.renderNodes=c(p,`renderNodes`,{},e);var m=c(e,`backgroundColor`,0);this.backgroundColor=f(m),this.transparent&&(this.backgroundColor=f(0),this.backgroundColor.alpha=0),this.preBoot=c(e,`callbacks.preBoot`,u),this.postBoot=c(e,`callbacks.postBoot`,u),this.physics=c(e,`physics`,{}),this.defaultPhysicsSystem=c(this.physics,`default`,!1),this.loaderBaseURL=c(e,`loader.baseURL`,``),this.loaderPath=c(e,`loader.path`,``),this.loaderMaxParallelDownloads=c(e,`loader.maxParallelDownloads`,o.os.android?6:32),this.loaderCrossOrigin=c(e,`loader.crossOrigin`,void 0),this.loaderResponseType=c(e,`loader.responseType`,``),this.loaderAsync=c(e,`loader.async`,!0),this.loaderUser=c(e,`loader.user`,``),this.loaderPassword=c(e,`loader.password`,``),this.loaderTimeout=c(e,`loader.timeout`,0),this.loaderMaxRetries=c(e,`loader.maxRetries`,2),this.loaderWithCredentials=c(e,`loader.withCredentials`,!1),this.loaderImageLoadType=c(e,`loader.imageLoadType`,`XHR`),this.loaderLocalScheme=c(e,`loader.localScheme`,[`file://`,`capacitor://`]),this.glowQuality=c(e,`filters.glow.quality`,10),this.glowDistance=c(e,`filters.glow.distance`,10),this.installGlobalPlugins=[],this.installScenePlugins=[];var h=c(e,`plugins`,null),g=a.DefaultScene;h&&(Array.isArray(h)?this.defaultPlugins=h:l(h)&&(this.installGlobalPlugins=s(h,`global`,[]),this.installScenePlugins=s(h,`scene`,[]),Array.isArray(h.default)?g=h.default:Array.isArray(h.defaultMerge)&&(g=g.concat(h.defaultMerge)))),this.defaultPlugins=g;var _=`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAg`;this.defaultImage=c(e,`images.default`,_+`AQMAAABJtOi3AAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAABVJREFUeF7NwIEAAAAAgKD9qdeocAMAoAABm3DkcAAAAABJRU5ErkJggg==`),this.missingImage=c(e,`images.missing`,_+`CAIAAAD8GO2jAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAJ9JREFUeNq01ssOwyAMRFG46v//Mt1ESmgh+DFmE2GPOBARKb2NVjo+17PXLD8a1+pl5+A+wSgFygymWYHBb0FtsKhJDdZlncG2IzJ4ayoMDv20wTmSMzClEgbWYNTAkQ0Z+OJ+A/eWnAaR9+oxCF4Os0H8htsMUp+pwcgBBiMNnAwF8GqIgL2hAzaGFFgZauDPKABmowZ4GL369/0rwACp2yA/ttmvsQAAAABJRU5ErkJggg==`),this.whiteImage=c(e,`images.white`,`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAIAAAAmkwkpAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAABdJREFUeNpi/P//PwMMMDEgAdwcgAADAJZuAwXJYZOzAAAAAElFTkSuQmCC`),window&&(window.FORCE_WEBGL?this.renderType=i.WEBGL:window.FORCE_CANVAS&&(this.renderType=i.CANVAS))}})},86054(e,t,n){var r=n(20623),i=n(27919),a=n(8054),o=n(89357);e.exports=function(e){var t=e.config;if((t.customEnvironment||t.canvas)&&t.renderType===a.AUTO)throw Error(`Must set explicit renderType in custom environment`);if(!t.customEnvironment&&!t.canvas&&t.renderType!==a.HEADLESS)if(t.renderType===a.AUTO&&(t.renderType=o.webGL?a.WEBGL:a.CANVAS),t.renderType===a.WEBGL){if(!o.webGL)throw Error(`Cannot create WebGL context, aborting.`)}else if(t.renderType===a.CANVAS){if(!o.canvas)throw Error(`Cannot create Canvas context, aborting.`)}else throw Error(`Unknown value for renderer type: `+t.renderType);t.antialias||i.disableSmoothing();var s=e.scale.baseSize,c=s.width,l=s.height;if(t.canvas?(e.canvas=t.canvas,e.canvas.width=c,e.canvas.height=l):e.canvas=i.create(e,c,l,t.renderType),t.canvasStyle&&(e.canvas.style=t.canvasStyle),t.antialias||r.setCrisp(e.canvas),t.renderType!==a.HEADLESS){var u=n(68627),d=n(74797);t.renderType===a.WEBGL?e.renderer=new d(e):(e.renderer=new u(e),e.context=e.renderer.gameContext)}}},96391(e,t,n){var r=n(8054);e.exports=function(e){var t=e.config;if(!t.hideBanner){var n=`WebGL`;t.renderType===r.CANVAS?n=`Canvas`:t.renderType===r.HEADLESS&&(n=`Headless`);var i=t.audio,a=e.device.audio,o=a.webAudio&&!i.disableWebAudio?`Web Audio`:i.noAudio||!a.webAudio&&!a.audioData?`No Audio`:`HTML5 Audio`;if(e.device.browser.ie)window.console&&console.log(`Phaser v`+r.VERSION+` / https://phaser.io`);else{var s=`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAOCAYAAAAmL5yKAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAARBJREFUeNpi/P//P0OHsPB/BiCoePuWkYFEwALSXJElzMBgLwE2CNkQxgWr/yMr/p8QimlBu5DQ//+8vBBco/ofzAe6imH+qv/53/6jYJAYSA4ZoxoANYTPKhiuCQZwGcJU+e4dqpMmvsDq14krV2MPAxDha2CMKvoXoiE/PBQUDgQD8j82UFae9B9bOIC8B9UD9gIjjIMN7Ns6lWHn4XMoYu62RgxO3tkMjIyMII2MYAOAtmFVhA+ADHf2ycGMRhANjUq8YO+WKWCvgAORIV8CkpDCrzIwsLIymC1qAtuAD4Bsh3sBmqAY3qcGwL2AC4DCpKtzHlgzOLWihwEuzTCN0GhDJHeYC4gByBphACDAAH2dDIxdjr+VAAAAAElFTkSuQmCC`,c=`color: `+t.bannerTextColor+`;`,l=Array.isArray(t.bannerBackgroundColor)?t.bannerBackgroundColor:[t.bannerBackgroundColor];l.length===1&&(l=[l[0],l[0]]);var u=`linear-gradient(to bottom, `+l.join(`, `)+`)`;c+=` background-image: url("`+s+`"), `+u+`;`,c+=` background-repeat: no-repeat;`,c+=` background-position: 4px center, 0 0;`,c+=` padding: 2px 6px 2px 24px;`;var d=`%c`,f=[null,c];f.push(`background: transparent`),t.gameTitle&&(d=d.concat(t.gameTitle),t.gameVersion&&(d=d.concat(` v`+t.gameVersion)),t.hidePhaser||(d=d.concat(` / `))),t.hidePhaser||(d=d.concat(`Phaser v`+r.VERSION+` (`+n+` | `+o+`)`)),d=d.concat(`%c `+t.gameURL),f[0]=d,console.log.apply(console,f)}}}},50127(e,t,n){var r=n(40366),i=n(60848),a=n(24047),o=n(27919),s=n(83419),c=n(69547),l=n(83719),u=n(86054),d=n(45893),f=n(96391),p=n(82264),m=n(57264),h=n(50792),g=n(8443),_=n(7003),v=n(37277),y=n(77332),b=n(76531),x=n(60903),S=n(69442),C=n(17130),w=n(65898),T=n(51085),E=n(14747);e.exports=new s({initialize:function(e){this.config=new c(e),this.renderer=null,this.domContainer=null,this.canvas=null,this.context=null,this.isBooted=!1,this.isRunning=!1,this.events=new h,this.anims=new i(this),this.textures=new C(this),this.cache=new a(this),this.registry=new d(this,new h),this.input=new _(this,this.config),this.scene=new x(this,this.config.sceneConfig),this.device=p,this.scale=new b(this,this.config),this.sound=null,this.sound=E.create(this),this.loop=new w(this,this.config.fps),this.plugins=new y(this,this.config),this.pendingDestroy=!1,this.removeCanvas=!1,this.noReturn=!1,this.hasFocus=!1,this.isPaused=!1,m(this.boot.bind(this))},boot:function(){if(!v.hasCore(`EventEmitter`)){console.warn(`Aborting. Core Plugins missing.`);return}this.isBooted=!0,this.config.preBoot(this),this.scale.preBoot(),u(this),l(this),f(this),r(this.canvas,this.config.parent),this.textures.once(S.READY,this.texturesReady,this),this.events.emit(g.BOOT)},texturesReady:function(){this.events.emit(g.READY),this.start()},start:function(){this.isRunning=!0,this.config.postBoot(this),this.renderer?this.loop.start(this.step.bind(this)):this.loop.start(this.headlessStep.bind(this)),T(this);var e=this.events;e.on(g.HIDDEN,this.onHidden,this),e.on(g.VISIBLE,this.onVisible,this),e.on(g.BLUR,this.onBlur,this),e.on(g.FOCUS,this.onFocus,this)},step:function(e,t){if(this.pendingDestroy)return this.runDestroy();if(!this.isPaused){var n=this.events;n.emit(g.PRE_STEP,e,t),n.emit(g.STEP,e,t),this.scene.update(e,t),n.emit(g.POST_STEP,e,t);var r=this.renderer;r.preRender(),n.emit(g.PRE_RENDER,r,e,t),this.scene.render(r),r.postRender(),n.emit(g.POST_RENDER,r,e,t)}},headlessStep:function(e,t){if(this.pendingDestroy)return this.runDestroy();if(!this.isPaused){var n=this.events;n.emit(g.PRE_STEP,e,t),n.emit(g.STEP,e,t),this.scene.update(e,t),n.emit(g.POST_STEP,e,t),this.scene.isProcessing=!1,n.emit(g.PRE_RENDER,null,e,t),n.emit(g.POST_RENDER,null,e,t)}},onHidden:function(){this.loop.pause(),this.events.emit(g.PAUSE)},pause:function(){var e=this.isPaused;this.isPaused=!0,e||this.events.emit(g.PAUSE)},onVisible:function(){this.loop.resume(),this.events.emit(g.RESUME,this.loop.pauseDuration)},resume:function(){var e=this.isPaused;this.isPaused=!1,e&&this.events.emit(g.RESUME,0)},onBlur:function(){this.hasFocus=!1,this.loop.blur()},onFocus:function(){this.hasFocus=!0,this.loop.focus()},getFrame:function(){return this.loop.frame},getTime:function(){return this.loop.now},destroy:function(e,t){t===void 0&&(t=!1),this.pendingDestroy=!0,this.removeCanvas=e,this.noReturn=t},runDestroy:function(){this.scene.destroy(),this.events.emit(g.DESTROY),this.events.removeAllListeners(),this.renderer&&this.renderer.destroy(),this.removeCanvas&&this.canvas&&(o.remove(this.canvas),this.canvas.parentNode&&this.canvas.parentNode.removeChild(this.canvas)),this.domContainer&&this.domContainer.parentNode&&this.domContainer.parentNode.removeChild(this.domContainer),this.loop.destroy(),this.pendingDestroy=!1}})},65898(e,t,n){var r=n(83419),i=n(35154),a=n(29747),o=n(43092);e.exports=new r({initialize:function(e,t){this.game=e,this.raf=new o,this.started=!1,this.running=!1,this.minFps=i(t,`min`,5),this.targetFps=i(t,`target`,60),this.fpsLimit=i(t,`limit`,0),this.hasFpsLimit=this.fpsLimit>0,this._limitRate=this.hasFpsLimit?1e3/this.fpsLimit:0,this._min=1e3/this.minFps,this._target=1e3/this.targetFps,this.actualFps=this.targetFps,this.nextFpsUpdate=0,this.framesThisSecond=0,this.callback=a,this.forceSetTimeOut=i(t,`forceSetTimeOut`,!1),this.time=0,this.startTime=0,this.lastTime=0,this.frame=0,this.inFocus=!0,this.pauseDuration=0,this._pauseTime=0,this._coolDown=0,this.delta=0,this.deltaIndex=0,this.deltaHistory=[],this.deltaSmoothingMax=i(t,`deltaHistory`,10),this.panicMax=i(t,`panicMax`,120),this.rawDelta=0,this.now=0,this.smoothStep=i(t,`smoothStep`,!0)},blur:function(){this.inFocus=!1},focus:function(){this.inFocus=!0,this.resetDelta()},pause:function(){this._pauseTime=window.performance.now()},resume:function(){this.resetDelta(),this.pauseDuration=this.time-this._pauseTime,this.startTime+=this.pauseDuration},resetDelta:function(){var e=window.performance.now();this.time=e,this.lastTime=e,this.nextFpsUpdate=e+1e3,this.framesThisSecond=0;for(var t=0;t<this.deltaSmoothingMax;t++)this.deltaHistory[t]=Math.min(this._target,this.deltaHistory[t]);this.delta=0,this.deltaIndex=0,this._coolDown=this.panicMax},start:function(e){if(this.started)return this;this.started=!0,this.running=!0;for(var t=0;t<this.deltaSmoothingMax;t++)this.deltaHistory[t]=this._target;this.resetDelta(),this.startTime=window.performance.now(),this.callback=e;var n=this.hasFpsLimit?this.stepLimitFPS.bind(this):this.step.bind(this);this.raf.start(n,this.forceSetTimeOut,this._target)},smoothDelta:function(e){var t=this.deltaIndex,n=this.deltaHistory,r=this.deltaSmoothingMax;(this._coolDown>0||!this.inFocus)&&(this._coolDown--,e=Math.min(e,this._target)),e>this._min&&(e=n[t],e=Math.min(e,this._min)),n[t]=e,this.deltaIndex++,this.deltaIndex>=r&&(this.deltaIndex=0);for(var i=0,a=0;a<r;a++)i+=n[a];return i/=r,i},updateFPS:function(e){this.actualFps=.25*this.framesThisSecond+.75*this.actualFps,this.nextFpsUpdate=e+1e3,this.framesThisSecond=0},stepLimitFPS:function(e){this.now=e;var t=Math.max(0,e-this.lastTime);this.rawDelta=t,this.time+=this.rawDelta,this.smoothStep&&(t=this.smoothDelta(t)),this.delta+=t,e>=this.nextFpsUpdate&&this.updateFPS(e),this.framesThisSecond++,this.delta>=this._limitRate&&(this.callback(e,this.delta),this.delta%=this._limitRate),this.lastTime=e,this.frame++},step:function(e){this.now=e;var t=Math.max(0,e-this.lastTime);this.rawDelta=t,this.time+=this.rawDelta,this.smoothStep&&(t=this.smoothDelta(t)),this.delta=t,e>=this.nextFpsUpdate&&this.updateFPS(e),this.framesThisSecond++,this.callback(e,t),this.lastTime=e,this.frame++},tick:function(){var e=window.performance.now();this.hasFpsLimit?this.stepLimitFPS(e):this.step(e)},sleep:function(){this.running&&=(this.raf.stop(),!1)},wake:function(e){e===void 0&&(e=!1);var t=window.performance.now();if(!this.running){e&&(this.startTime+=-this.lastTime+(this.lastTime+t));var n=this.hasFpsLimit?this.stepLimitFPS.bind(this):this.step.bind(this);this.raf.start(n,this.forceSetTimeOut,this._target),this.running=!0,this.nextFpsUpdate=t+1e3,this.framesThisSecond=0,this.fpsLimitTriggered=!1,this.tick()}},getDuration:function(){return Math.round(this.lastTime-this.startTime)/1e3},getDurationMS:function(){return Math.round(this.lastTime-this.startTime)},setFPSLimit:function(e){if(this.fpsLimit=e,this.hasFpsLimit=this.fpsLimit>0,this._limitRate=this.hasFpsLimit?1e3/this.fpsLimit:0,this.running){var t=this.hasFpsLimit?this.stepLimitFPS.bind(this):this.step.bind(this);this.raf.stop(),this.raf.start(t,this.forceSetTimeOut,this._limitRate)}return this},stop:function(){return this.running=!1,this.started=!1,this.raf.stop(),this},destroy:function(){this.stop(),this.raf.destroy(),this.raf=null,this.game=null,this.callback=null}})},51085(e,t,n){var r=n(8443);e.exports=function(e){var t,n=e.events;document.hidden===void 0?[`webkit`,`moz`,`ms`].forEach(function(e){document[e+`Hidden`]!==void 0&&(document.hidden=function(){return document[e+`Hidden`]},t=e+`visibilitychange`)}):t=`visibilitychange`,t&&document.addEventListener(t,function(e){document.hidden||e.type===`pause`?n.emit(r.HIDDEN):n.emit(r.VISIBLE)},!1),window.onblur=function(){n.emit(r.BLUR)},window.onfocus=function(){n.emit(r.FOCUS)},window.focus&&e.config.autoFocus&&window.focus()}},97217(e){e.exports=`blur`},47548(e){e.exports=`boot`},19814(e){e.exports=`contextlost`},68446(e){e.exports=`destroy`},41700(e){e.exports=`focus`},25432(e){e.exports=`hidden`},65942(e){e.exports=`pause`},59211(e){e.exports=`postrender`},47789(e){e.exports=`poststep`},39066(e){e.exports=`prerender`},460(e){e.exports=`prestep`},16175(e){e.exports=`ready`},42331(e){e.exports=`resume`},11966(e){e.exports=`step`},32969(e){e.exports=`systemready`},94830(e){e.exports=`visible`},8443(e,t,n){e.exports={BLUR:n(97217),BOOT:n(47548),CONTEXT_LOST:n(19814),DESTROY:n(68446),FOCUS:n(41700),HIDDEN:n(25432),PAUSE:n(65942),POST_RENDER:n(59211),POST_STEP:n(47789),PRE_RENDER:n(39066),PRE_STEP:n(460),READY:n(16175),RESUME:n(42331),STEP:n(11966),SYSTEM_READY:n(32969),VISIBLE:n(94830)}},42857(e,t,n){e.exports={Config:n(69547),CreateRenderer:n(86054),DebugHeader:n(96391),Events:n(8443),TimeStep:n(65898),VisibilityHandler:n(51085)}},46728(e,t,n){var r=n(83419),i=n(36316),a=n(80021),o=n(26099),s=new r({Extends:a,initialize:function(e,t,n,r){a.call(this,`CubicBezierCurve`),Array.isArray(e)&&(r=new o(e[6],e[7]),n=new o(e[4],e[5]),t=new o(e[2],e[3]),e=new o(e[0],e[1])),this.p0=e,this.p1=t,this.p2=n,this.p3=r},getStartPoint:function(e){return e===void 0&&(e=new o),e.copy(this.p0)},getResolution:function(e){return e},getPoint:function(e,t){t===void 0&&(t=new o);var n=this.p0,r=this.p1,a=this.p2,s=this.p3;return t.set(i(e,n.x,r.x,a.x,s.x),i(e,n.y,r.y,a.y,s.y))},draw:function(e,t){t===void 0&&(t=32);var n=this.getPoints(t);e.beginPath(),e.moveTo(this.p0.x,this.p0.y);for(var r=1;r<n.length;r++)e.lineTo(n[r].x,n[r].y);return e.strokePath(),e},toJSON:function(){return{type:this.type,points:[this.p0.x,this.p0.y,this.p1.x,this.p1.y,this.p2.x,this.p2.y,this.p3.x,this.p3.y]}}});s.fromJSON=function(e){var t=e.points;return new s(new o(t[0],t[1]),new o(t[2],t[3]),new o(t[4],t[5]),new o(t[6],t[7]))},e.exports=s},80021(e,t,n){var r=n(83419),i=n(19217),a=n(87841),o=n(26099);e.exports=new r({initialize:function(e){this.type=e,this.defaultDivisions=5,this.arcLengthDivisions=100,this.cacheArcLengths=[],this.needsUpdate=!0,this.active=!0,this._tmpVec2A=new o,this._tmpVec2B=new o},draw:function(e,t){return t===void 0&&(t=32),e.strokePoints(this.getPoints(t))},getBounds:function(e,t){e||=new a,t===void 0&&(t=16);var n=this.getLength();t>n&&(t=n/2);var r=Math.max(1,Math.round(n/t));return i(this.getSpacedPoints(r),e)},getDistancePoints:function(e){var t=this.getLength(),n=Math.max(1,t/e);return this.getSpacedPoints(n)},getEndPoint:function(e){return e===void 0&&(e=new o),this.getPointAt(1,e)},getLength:function(){var e=this.getLengths();return e[e.length-1]},getLengths:function(e){if(e===void 0&&(e=this.arcLengthDivisions),this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;var t=[],n,r=this.getPoint(0,this._tmpVec2A),i=0;t.push(0);for(var a=1;a<=e;a++)n=this.getPoint(a/e,this._tmpVec2B),i+=n.distance(r),t.push(i),r.copy(n);return this.cacheArcLengths=t,t},getPointAt:function(e,t){var n=this.getUtoTmapping(e);return this.getPoint(n,t)},getPoints:function(e,t,n){n===void 0&&(n=[]),e||=t?this.getLength()/t:this.defaultDivisions;for(var r=0;r<=e;r++)n.push(this.getPoint(r/e));return n},getRandomPoint:function(e){return e===void 0&&(e=new o),this.getPoint(Math.random(),e)},getSpacedPoints:function(e,t,n){n===void 0&&(n=[]),e||=t?this.getLength()/t:this.defaultDivisions;for(var r=0;r<=e;r++){var i=this.getUtoTmapping(r/e,null,e);n.push(this.getPoint(i))}return n},getStartPoint:function(e){return e===void 0&&(e=new o),this.getPointAt(0,e)},getTangent:function(e,t){t===void 0&&(t=new o);var n=1e-4,r=e-n,i=e+n;return r<0&&(r=0),i>1&&(i=1),this.getPoint(r,this._tmpVec2A),this.getPoint(i,t),t.subtract(this._tmpVec2A).normalize()},getTangentAt:function(e,t){var n=this.getUtoTmapping(e);return this.getTangent(n,t)},getTFromDistance:function(e,t){return e<=0?0:this.getUtoTmapping(0,e,t)},getUtoTmapping:function(e,t,n){for(var r=this.getLengths(n),i=0,a=r.length,o=t?Math.min(t,r[a-1]):e*r[a-1],s=0,c=a-1,l;s<=c;)if(i=Math.floor(s+(c-s)/2),l=r[i]-o,l<0)s=i+1;else if(l>0)c=i-1;else{c=i;break}if(i=c,r[i]===o)return i/(a-1);var u=r[i],d=r[i+1]-u,f=(o-u)/d;return(i+f)/(a-1)},updateArcLengths:function(){this.needsUpdate=!0,this.getLengths()}})},73825(e,t,n){var r=n(83419),i=n(80021),a=n(39506),o=n(35154),s=n(43396),c=n(26099),l=new r({Extends:i,initialize:function(e,t,n,r,s,l,u,d){if(typeof e==`object`){var f=e;e=o(f,`x`,0),t=o(f,`y`,0),n=o(f,`xRadius`,0),r=o(f,`yRadius`,n),s=o(f,`startAngle`,0),l=o(f,`endAngle`,360),u=o(f,`clockwise`,!1),d=o(f,`rotation`,0)}else r===void 0&&(r=n),s===void 0&&(s=0),l===void 0&&(l=360),u===void 0&&(u=!1),d===void 0&&(d=0);i.call(this,`EllipseCurve`),this.p0=new c(e,t),this._xRadius=n,this._yRadius=r,this._startAngle=a(s),this._endAngle=a(l),this._clockwise=u,this._rotation=a(d)},getStartPoint:function(e){return e===void 0&&(e=new c),this.getPoint(0,e)},getResolution:function(e){return e*2},getPoint:function(e,t){t===void 0&&(t=new c);for(var n=Math.PI*2,r=this._endAngle-this._startAngle,i=Math.abs(r)<2**-52;r<0;)r+=n;for(;r>n;)r-=n;r<2**-52&&(r=i?0:n),this._clockwise&&!i&&(r===n?r=-n:r-=n);var a=this._startAngle+e*r,o=this.p0.x+this._xRadius*Math.cos(a),s=this.p0.y+this._yRadius*Math.sin(a);if(this._rotation!==0){var l=Math.cos(this._rotation),u=Math.sin(this._rotation),d=o-this.p0.x,f=s-this.p0.y;o=d*l-f*u+this.p0.x,s=d*u+f*l+this.p0.y}return t.set(o,s)},setXRadius:function(e){return this.xRadius=e,this},setYRadius:function(e){return this.yRadius=e,this},setWidth:function(e){return this.xRadius=e/2,this},setHeight:function(e){return this.yRadius=e/2,this},setStartAngle:function(e){return this.startAngle=e,this},setEndAngle:function(e){return this.endAngle=e,this},setClockwise:function(e){return this.clockwise=e,this},setRotation:function(e){return this.rotation=e,this},x:{get:function(){return this.p0.x},set:function(e){this.p0.x=e}},y:{get:function(){return this.p0.y},set:function(e){this.p0.y=e}},xRadius:{get:function(){return this._xRadius},set:function(e){this._xRadius=e}},yRadius:{get:function(){return this._yRadius},set:function(e){this._yRadius=e}},startAngle:{get:function(){return s(this._startAngle)},set:function(e){this._startAngle=a(e)}},endAngle:{get:function(){return s(this._endAngle)},set:function(e){this._endAngle=a(e)}},clockwise:{get:function(){return this._clockwise},set:function(e){this._clockwise=e}},angle:{get:function(){return s(this._rotation)},set:function(e){this._rotation=a(e)}},rotation:{get:function(){return this._rotation},set:function(e){this._rotation=e}},toJSON:function(){return{type:this.type,x:this.p0.x,y:this.p0.y,xRadius:this._xRadius,yRadius:this._yRadius,startAngle:s(this._startAngle),endAngle:s(this._endAngle),clockwise:this._clockwise,rotation:s(this._rotation)}}});l.fromJSON=function(e){return new l(e)},e.exports=l},33951(e,t,n){var r=n(83419),i=n(80021),a=n(19217),o=n(87841),s=n(26099),c=new r({Extends:i,initialize:function(e,t){i.call(this,`LineCurve`),Array.isArray(e)&&(t=new s(e[2],e[3]),e=new s(e[0],e[1])),this.p0=e,this.p1=t,this.arcLengthDivisions=1},getBounds:function(e){return e===void 0&&(e=new o),a([this.p0,this.p1],e)},getStartPoint:function(e){return e===void 0&&(e=new s),e.copy(this.p0)},getResolution:function(e){return e===void 0&&(e=1),e},getPoint:function(e,t){return t===void 0&&(t=new s),e===1?t.copy(this.p1):(t.copy(this.p1).subtract(this.p0).scale(e).add(this.p0),t)},getPointAt:function(e,t){return this.getPoint(e,t)},getTangent:function(e,t){return t===void 0&&(t=new s),t.copy(this.p1).subtract(this.p0).normalize(),t},getUtoTmapping:function(e,t,n){var r;if(t){var i=this.getLengths(n),a=i[i.length-1];r=Math.min(t,a)/a}else r=e;return r},draw:function(e){return e.lineBetween(this.p0.x,this.p0.y,this.p1.x,this.p1.y),e},toJSON:function(){return{type:this.type,points:[this.p0.x,this.p0.y,this.p1.x,this.p1.y]}}});c.fromJSON=function(e){var t=e.points;return new c(new s(t[0],t[1]),new s(t[2],t[3]))},e.exports=c},14744(e,t,n){var r=n(83419),i=n(80021),a=n(32112),o=n(26099),s=new r({Extends:i,initialize:function(e,t,n){i.call(this,`QuadraticBezierCurve`),Array.isArray(e)&&(n=new o(e[4],e[5]),t=new o(e[2],e[3]),e=new o(e[0],e[1])),this.p0=e,this.p1=t,this.p2=n},getStartPoint:function(e){return e===void 0&&(e=new o),e.copy(this.p0)},getResolution:function(e){return e},getPoint:function(e,t){t===void 0&&(t=new o);var n=this.p0,r=this.p1,i=this.p2;return t.set(a(e,n.x,r.x,i.x),a(e,n.y,r.y,i.y))},draw:function(e,t){t===void 0&&(t=32);var n=this.getPoints(t);e.beginPath(),e.moveTo(this.p0.x,this.p0.y);for(var r=1;r<n.length;r++)e.lineTo(n[r].x,n[r].y);return e.strokePath(),e},toJSON:function(){return{type:this.type,points:[this.p0.x,this.p0.y,this.p1.x,this.p1.y,this.p2.x,this.p2.y]}}});s.fromJSON=function(e){var t=e.points;return new s(new o(t[0],t[1]),new o(t[2],t[3]),new o(t[4],t[5]))},e.exports=s},42534(e,t,n){var r=n(87842),i=n(83419),a=n(80021),o=n(26099),s=new i({Extends:a,initialize:function(e){e===void 0&&(e=[]),a.call(this,`SplineCurve`),this.points=[],this.addPoints(e)},addPoints:function(e){for(var t=0;t<e.length;t++){var n=new o;typeof e[t]==`number`?(n.x=e[t],n.y=e[t+1],t++):Array.isArray(e[t])?(n.x=e[t][0],n.y=e[t][1]):(n.x=e[t].x,n.y=e[t].y),this.points.push(n)}return this},addPoint:function(e,t){var n=new o(e,t);return this.points.push(n),n},getStartPoint:function(e){return e===void 0&&(e=new o),e.copy(this.points[0])},getResolution:function(e){return e*this.points.length},getPoint:function(e,t){t===void 0&&(t=new o);var n=this.points,i=(n.length-1)*e,a=Math.floor(i),s=i-a,c=n[a===0?a:a-1],l=n[a],u=n[a>n.length-2?n.length-1:a+1],d=n[a>n.length-3?n.length-1:a+2];return t.set(r(s,c.x,l.x,u.x,d.x),r(s,c.y,l.y,u.y,d.y))},toJSON:function(){for(var e=[],t=0;t<this.points.length;t++)e.push(this.points[t].x),e.push(this.points[t].y);return{type:this.type,points:e}}});s.fromJSON=function(e){return new s(e.points)},e.exports=s},25410(e,t,n){e.exports={Path:n(46669),MoveTo:n(68618),CubicBezier:n(46728),Curve:n(80021),Ellipse:n(73825),Line:n(33951),QuadraticBezier:n(14744),Spline:n(42534)}},68618(e,t,n){var r=n(83419),i=n(26099);e.exports=new r({initialize:function(e,t){this.active=!1,this.p0=new i(e,t)},getPoint:function(e,t){return t===void 0&&(t=new i),t.copy(this.p0)},getPointAt:function(e,t){return this.getPoint(e,t)},getResolution:function(){return 1},getLength:function(){return 0},toJSON:function(){return{type:`MoveTo`,points:[this.p0.x,this.p0.y]}}})},46669(e,t,n){var r=n(83419),i=n(46728),a=n(73825),o=n(39429),s=n(33951),c=n(68618),l=n(14744),u=n(87841),d=n(42534),f=n(26099),p=n(36383),m=new r({initialize:function(e,t){e===void 0&&(e=0),t===void 0&&(t=0),this.name=``,this.defaultDivisions=12,this.curves=[],this.cacheLengths=[],this.autoClose=!1,this.startPoint=new f,this._tmpVec2A=new f,this._tmpVec2B=new f,typeof e==`object`?this.fromJSON(e):this.startPoint.set(e,t)},add:function(e){return this.curves.push(e),this},circleTo:function(e,t,n){return t===void 0&&(t=!1),this.ellipseTo(e,e,0,360,t,n)},closePath:function(){var e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);return e.equals(t)||this.curves.push(new s(t,e)),this},cubicBezierTo:function(e,t,n,r,a,o){var s=this.getEndPoint(),c,l,u;return e instanceof f?(c=e,l=t,u=n):(c=new f(n,r),l=new f(a,o),u=new f(e,t)),this.add(new i(s,c,l,u))},quadraticBezierTo:function(e,t,n,r){var i=this.getEndPoint(),a,o;return e instanceof f?(a=e,o=t):(a=new f(n,r),o=new f(e,t)),this.add(new l(i,a,o))},draw:function(e,t){for(var n=0;n<this.curves.length;n++){var r=this.curves[n];r.active&&r.draw(e,t)}return e},ellipseTo:function(e,t,n,r,i,o){var s=new a(0,0,e,t,n,r,i,o),c=this.getEndPoint(this._tmpVec2A),l=s.getStartPoint(this._tmpVec2B);return c.subtract(l),s.x=c.x,s.y=c.y,this.add(s)},fromJSON:function(e){this.curves=[],this.cacheLengths=[],this.startPoint.set(e.x,e.y),this.autoClose=e.autoClose;for(var t=0;t<e.curves.length;t++){var n=e.curves[t];switch(n.type){case`LineCurve`:this.add(s.fromJSON(n));break;case`EllipseCurve`:this.add(a.fromJSON(n));break;case`SplineCurve`:this.add(d.fromJSON(n));break;case`CubicBezierCurve`:this.add(i.fromJSON(n));break;case`QuadraticBezierCurve`:this.add(l.fromJSON(n));break}}return this},getBounds:function(e,t){e===void 0&&(e=new u),t===void 0&&(t=16),e.x=Number.MAX_VALUE,e.y=Number.MAX_VALUE;for(var n=new u,r=p.MIN_SAFE_INTEGER,i=p.MIN_SAFE_INTEGER,a=0;a<this.curves.length;a++){var o=this.curves[a];o.active&&(o.getBounds(n,t),e.x=Math.min(e.x,n.x),e.y=Math.min(e.y,n.y),r=Math.max(r,n.right),i=Math.max(i,n.bottom))}return e.right=r,e.bottom=i,e},getCurveLengths:function(){if(this.cacheLengths.length===this.curves.length)return this.cacheLengths;for(var e=[],t=0,n=0;n<this.curves.length;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e},getCurveAt:function(e){for(var t=e*this.getLength(),n=this.getCurveLengths(),r=0;r<n.length;){if(n[r]>=t)return this.curves[r];r++}return null},getEndPoint:function(e){return e===void 0&&(e=new f),this.curves.length>0?this.curves[this.curves.length-1].getPoint(1,e):e.copy(this.startPoint),e},getLength:function(){var e=this.getCurveLengths();return e[e.length-1]},getPoint:function(e,t){t===void 0&&(t=new f);for(var n=e*this.getLength(),r=this.getCurveLengths(),i=0;i<r.length;){if(r[i]>=n){var a=r[i]-n,o=this.curves[i],s=o.getLength(),c=s===0?0:1-a/s;return o.getPointAt(c,t)}i++}return null},getPoints:function(e,t){!e&&!t&&(e=this.defaultDivisions);for(var n=[],r,i=0;i<this.curves.length;i++){var a=this.curves[i];if(a.active)for(var o=a.getResolution(e),s=a.getPoints(o,t),c=0;c<s.length;c++){var l=s[c];r&&r.equals(l)||(n.push(l),r=l)}}return this.autoClose&&n.length>1&&!n[n.length-1].equals(n[0])&&n.push(n[0]),n},getRandomPoint:function(e){return e===void 0&&(e=new f),this.getPoint(Math.random(),e)},getSpacedPoints:function(e){e===void 0&&(e=40);for(var t=[],n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t},getStartPoint:function(e){return e===void 0&&(e=new f),e.copy(this.startPoint)},getTangent:function(e,t){t===void 0&&(t=new f);for(var n=e*this.getLength(),r=this.getCurveLengths(),i=0;i<r.length;){if(r[i]>=n){var a=r[i]-n,o=this.curves[i],s=o.getLength(),c=s===0?0:1-a/s;return o.getTangentAt(c,t)}i++}return null},lineTo:function(e,t){e instanceof f?this._tmpVec2B.copy(e):typeof e==`object`?this._tmpVec2B.setFromObject(e):this._tmpVec2B.set(e,t);var n=this.getEndPoint(this._tmpVec2A);return this.add(new s([n.x,n.y,this._tmpVec2B.x,this._tmpVec2B.y]))},splineTo:function(e){return e.unshift(this.getEndPoint()),this.add(new d(e))},moveTo:function(e,t){return e instanceof f?this.add(new c(e.x,e.y)):this.add(new c(e,t))},toJSON:function(){for(var e=[],t=0;t<this.curves.length;t++)e.push(this.curves[t].toJSON());return{type:`Path`,x:this.startPoint.x,y:this.startPoint.y,autoClose:this.autoClose,curves:e}},updateArcLengths:function(){this.cacheLengths=[],this.getCurveLengths()},destroy:function(){this.curves.length=0,this.cacheLengths.length=0,this.startPoint=void 0}});o.register(`path`,function(e,t){return new m(e,t)}),e.exports=m},45893(e,t,n){var r=n(83419),i=n(24882);e.exports=new r({initialize:function(e,t){this.parent=e,this.events=t,t||(this.events=e.events?e.events:e),this.list={},this.values={},this._frozen=!1,!e.hasOwnProperty(`sys`)&&this.events&&this.events.once(i.DESTROY,this.destroy,this)},get:function(e){var t=this.list;if(Array.isArray(e)){for(var n=[],r=0;r<e.length;r++)n.push(t[e[r]]);return n}else return t[e]},getAll:function(){var e={};for(var t in this.list)this.list.hasOwnProperty(t)&&(e[t]=this.list[t]);return e},query:function(e){var t={};for(var n in this.list)this.list.hasOwnProperty(n)&&n.match(e)&&(t[n]=this.list[n]);return t},set:function(e,t){if(this._frozen)return this;if(typeof e==`string`)return this.setValue(e,t);for(var n in e)this.setValue(n,e[n]);return this},inc:function(e,t){if(this._frozen)return this;t===void 0&&(t=1);var n=this.get(e);return n===void 0&&(n=0),this.set(e,n+t),this},toggle:function(e){return this._frozen||this.set(e,!this.get(e)),this},setValue:function(e,t){if(this._frozen)return this;if(this.has(e))this.values[e]=t;else{var n=this,r=this.list,a=this.events,o=this.parent;Object.defineProperty(this.values,e,{enumerable:!0,configurable:!0,get:function(){return r[e]},set:function(t){if(!n._frozen){var s=r[e];r[e]=t,a.emit(i.CHANGE_DATA,o,e,t,s),a.emit(i.CHANGE_DATA_KEY+e,o,t,s)}}}),r[e]=t,a.emit(i.SET_DATA,o,e,t)}return this},each:function(e,t){for(var n=[this.parent,null,void 0],r=1;r<arguments.length;r++)n.push(arguments[r]);for(var i in this.list)n[1]=i,n[2]=this.list[i],e.apply(t,n);return this},merge:function(e,t){for(var n in t===void 0&&(t=!0),e)e.hasOwnProperty(n)&&(t||!t&&!this.has(n))&&this.setValue(n,e[n]);return this},remove:function(e){if(this._frozen)return this;if(Array.isArray(e))for(var t=0;t<e.length;t++)this.removeValue(e[t]);else return this.removeValue(e);return this},removeValue:function(e){if(this.has(e)){var t=this.list[e];delete this.list[e],delete this.values[e],this.events.emit(i.REMOVE_DATA,this.parent,e,t)}return this},pop:function(e){var t=void 0;return!this._frozen&&this.has(e)&&(t=this.list[e],delete this.list[e],delete this.values[e],this.events.emit(i.REMOVE_DATA,this.parent,e,t)),t},has:function(e){return this.list.hasOwnProperty(e)},setFreeze:function(e){return this._frozen=e,this},reset:function(){for(var e in this.list)delete this.list[e],delete this.values[e];return this._frozen=!1,this},destroy:function(){this.reset(),this.events.off(i.CHANGE_DATA),this.events.off(i.SET_DATA),this.events.off(i.REMOVE_DATA),this.parent=null},freeze:{get:function(){return this._frozen},set:function(e){this._frozen=!!e}},count:{get:function(){var e=0;for(var t in this.list)this.list[t]!==void 0&&e++;return e}}})},63646(e,t,n){var r=n(83419),i=n(45893),a=n(37277),o=n(44594),s=new r({Extends:i,initialize:function(e){i.call(this,e,e.sys.events),this.scene=e,this.systems=e.sys,e.sys.events.once(o.BOOT,this.boot,this),e.sys.events.on(o.START,this.start,this)},boot:function(){this.events=this.systems.events,this.events.once(o.DESTROY,this.destroy,this)},start:function(){this.events.once(o.SHUTDOWN,this.shutdown,this)},shutdown:function(){this.systems.events.off(o.SHUTDOWN,this.shutdown,this)},destroy:function(){i.prototype.destroy.call(this),this.events.off(o.START,this.start,this),this.scene=null,this.systems=null}});a.register(`DataManagerPlugin`,s,`data`),e.exports=s},10700(e){e.exports=`changedata`},93608(e){e.exports=`changedata-`},60883(e){e.exports=`destroy`},69780(e){e.exports=`removedata`},22166(e){e.exports=`setdata`},24882(e,t,n){e.exports={CHANGE_DATA:n(10700),CHANGE_DATA_KEY:n(93608),DESTROY:n(60883),REMOVE_DATA:n(69780),SET_DATA:n(22166)}},44965(e,t,n){e.exports={DataManager:n(45893),DataManagerPlugin:n(63646),Events:n(24882)}},7098(e,t,n){var r=n(84148),i={flac:!1,aac:!1,audioData:!1,dolby:!1,m4a:!1,mp3:!1,ogg:!1,opus:!1,wav:!1,webAudio:!1,webm:!1};function a(){if(typeof importScripts==`function`)return i;i.audioData=!!window.Audio,i.webAudio=!!(window.AudioContext||window.webkitAudioContext);var e=document.createElement(`audio`),t=!!e.canPlayType;try{if(t){var n=function(t,n){var r=e.canPlayType(`audio/`+t).replace(/^no$/,``);return n?!!(r||e.canPlayType(`audio/`+n).replace(/^no$/,``)):!!r};if(i.ogg=n(`ogg; codecs="vorbis"`),i.opus=n(`ogg; codecs="opus"`,`opus`),i.mp3=n(`mpeg`),i.wav=n(`wav`),i.m4a=n(`x-m4a`),i.aac=n(`aac`),i.flac=n(`flac`,`x-flac`),i.webm=n(`webm; codecs="vorbis"`),e.canPlayType(`audio/mp4; codecs="ec-3"`)!==``){if(r.edge)i.dolby=!0;else if(r.safari&&r.safariVersion>=9&&/Mac OS X (\d+)_(\d+)/.test(navigator.userAgent)){var a=parseInt(RegExp.$1,10),o=parseInt(RegExp.$2,10);(a===10&&o>=11||a>10)&&(i.dolby=!0)}}}}catch{}return i}e.exports=a()},84148(e,t,n){var r=n(25892),i={chrome:!1,chromeVersion:0,edge:!1,firefox:!1,firefoxVersion:0,ie:!1,ieVersion:0,mobileSafari:!1,opera:!1,safari:!1,safariVersion:0,silk:!1,trident:!1,tridentVersion:0,es2019:!1};function a(){var e=navigator.userAgent;return/Edg\/\d+/.test(e)?(i.edge=!0,i.es2019=!0):/OPR/.test(e)?(i.opera=!0,i.es2019=!0):/Chrome\/(\d+)/.test(e)&&!r.windowsPhone?(i.chrome=!0,i.chromeVersion=parseInt(RegExp.$1,10),i.es2019=i.chromeVersion>69):/Firefox\D+(\d+)/.test(e)?(i.firefox=!0,i.firefoxVersion=parseInt(RegExp.$1,10),i.es2019=i.firefoxVersion>10):/AppleWebKit\/(?!.*CriOS)/.test(e)&&r.iOS?(i.mobileSafari=!0,i.es2019=!0):/MSIE (\d+\.\d+);/.test(e)?(i.ie=!0,i.ieVersion=parseInt(RegExp.$1,10)):/Version\/(\d+\.\d+(\.\d+)?) Safari/.test(e)&&!r.windowsPhone?(i.safari=!0,i.safariVersion=parseInt(RegExp.$1,10),i.es2019=i.safariVersion>10):/Trident\/(\d+\.\d+)(.*)rv:(\d+\.\d+)/.test(e)&&(i.ie=!0,i.trident=!0,i.tridentVersion=parseInt(RegExp.$1,10),i.ieVersion=parseInt(RegExp.$3,10)),/Silk/.test(e)&&(i.silk=!0),i}e.exports=a()},89289(e,t,n){var r=n(27919),i={supportInverseAlpha:!1,supportNewBlendModes:!1};function a(){var e=`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAABAQMAAADD8p2OAAAAA1BMVEX/`,t=`AAAACklEQVQI12NgAAAAAgAB4iG8MwAAAABJRU5ErkJggg==`,n=new Image;return n.onload=function(){var a=new Image;a.onload=function(){var e=r.create2D(a,6).getContext(`2d`,{willReadFrequently:!0});if(e.globalCompositeOperation=`multiply`,e.drawImage(n,0,0),e.drawImage(a,2,0),!e.getImageData(2,0,1,1))return!1;var t=e.getImageData(2,0,1,1).data;r.remove(a),i.supportNewBlendModes=t[0]===255&&t[1]===0&&t[2]===0},a.src=e+`/wCKxvRF`+t},n.src=e+`AP804Oa6`+t,!1}function o(){var e=r.create2D(this,2).getContext(`2d`,{willReadFrequently:!0});e.fillStyle=`rgba(10, 20, 30, 0.5)`,e.fillRect(0,0,1,1);var t=e.getImageData(0,0,1,1);if(t===null)return!1;e.putImageData(t,1,0);var n=e.getImageData(1,0,1,1),i=n.data[0]===t.data[0]&&n.data[1]===t.data[1]&&n.data[2]===t.data[2]&&n.data[3]===t.data[3];return r.remove(this),i}function s(){return typeof importScripts!=`function`&&document!==void 0&&(i.supportNewBlendModes=a(),i.supportInverseAlpha=o()),i}e.exports=s()},89357(e,t,n){var r=n(25892),i=n(84148),a=n(27919),o={canvas:!1,canvasBitBltShift:null,file:!1,fileSystem:!1,getUserMedia:!0,littleEndian:!1,localStorage:!1,pointerLock:!1,stableSort:!1,support32bit:!1,vibration:!1,webGL:!1,worker:!1};function s(){var e=new ArrayBuffer(4),t=new Uint8Array(e),n=new Uint32Array(e);return t[0]=161,t[1]=178,t[2]=195,t[3]=212,n[0]===3569595041||n[0]!==2712847316&&null}function c(){if(typeof importScripts==`function`)return o;o.canvas=!!window.CanvasRenderingContext2D;try{o.localStorage=!!localStorage.getItem}catch{o.localStorage=!1}o.file=!!window.File&&!!window.FileReader&&!!window.FileList&&!!window.Blob,o.fileSystem=!!window.requestFileSystem;var e=!1;return o.webGL=function(){if(window.WebGLRenderingContext)try{var t=a.createWebGL(this),n=t.getContext(`webgl`)||t.getContext(`experimental-webgl`),r=a.create2D(this);return e=r.getContext(`2d`,{willReadFrequently:!0}).createImageData(1,1).data instanceof Uint8ClampedArray,a.remove(t),a.remove(r),!!n}catch{return!1}return!1}(),o.worker=!!window.Worker,o.pointerLock=`pointerLockElement`in document||`mozPointerLockElement`in document||`webkitPointerLockElement`in document,navigator.getUserMedia=navigator.getUserMedia||navigator.webkitGetUserMedia||navigator.mozGetUserMedia||navigator.msGetUserMedia||navigator.oGetUserMedia,window.URL=window.URL||window.webkitURL||window.mozURL||window.msURL,o.getUserMedia=o.getUserMedia&&!!navigator.getUserMedia&&!!window.URL,i.firefox&&i.firefoxVersion<21&&(o.getUserMedia=!1),!r.iOS&&(i.ie||i.firefox||i.chrome)&&(o.canvasBitBltShift=!0),(i.safari||i.mobileSafari)&&(o.canvasBitBltShift=!1),navigator.vibrate=navigator.vibrate||navigator.webkitVibrate||navigator.mozVibrate||navigator.msVibrate,navigator.vibrate&&(o.vibration=!0),typeof ArrayBuffer<`u`&&typeof Uint8Array<`u`&&typeof Uint32Array<`u`&&(o.littleEndian=s()),o.support32bit=typeof ArrayBuffer<`u`&&typeof Uint8ClampedArray<`u`&&typeof Int32Array<`u`&&o.littleEndian!==null&&e,o}e.exports=c()},91639(e){var t={available:!1,cancel:``,keyboard:!1,request:``};function n(){if(typeof importScripts==`function`)return t;var e,n=`Fullscreen`,r=`FullScreen`,i=[`request`+n,`request`+r,`webkitRequest`+n,`webkitRequest`+r,`msRequest`+n,`msRequest`+r,`mozRequest`+r,`mozRequest`+n];for(e=0;e<i.length;e++)if(document.documentElement[i[e]]){t.available=!0,t.request=i[e];break}var a=[`cancel`+r,`exit`+n,`webkitCancel`+r,`webkitExit`+n,`msCancel`+r,`msExit`+n,`mozCancel`+r,`mozExit`+n];if(t.available){for(e=0;e<a.length;e++)if(document[a[e]]){t.cancel=a[e];break}}return window.Element&&Element.ALLOW_KEYBOARD_INPUT&&!/ Version\/5\.1(?:\.\d+)? Safari\//.test(navigator.userAgent)&&(t.keyboard=!0),Object.defineProperty(t,"active",{get:function(){return!!(document.fullscreenElement||document.webkitFullscreenElement||document.mozFullScreenElement||document.msFullscreenElement)}}),t}e.exports=n()},31784(e,t,n){var r=n(84148),i={gamepads:!1,mspointer:!1,touch:!1,wheelEvent:null};function a(){return typeof importScripts==`function`?i:((`ontouchstart`in document.documentElement||navigator.maxTouchPoints&&navigator.maxTouchPoints>=1)&&(i.touch=!0),(navigator.msPointerEnabled||navigator.pointerEnabled)&&(i.mspointer=!0),navigator.getGamepads&&(i.gamepads=!0),`onwheel`in window||r.ie&&`WheelEvent`in window?i.wheelEvent=`wheel`:`onmousewheel`in window?i.wheelEvent=`mousewheel`:r.firefox&&`MouseScrollEvent`in window&&(i.wheelEvent=`DOMMouseScroll`),i)}e.exports=a()},25892(e){var t={android:!1,chromeOS:!1,cordova:!1,crosswalk:!1,desktop:!1,ejecta:!1,electron:!1,iOS:!1,iOSVersion:0,iPad:!1,iPhone:!1,kindle:!1,linux:!1,macOS:!1,node:!1,nodeWebkit:!1,pixelRatio:1,webApp:!1,windows:!1,windowsPhone:!1};function n(){if(typeof importScripts==`function`)return t;var e=navigator.userAgent;/Windows/.test(e)?t.windows=!0:/Mac OS/.test(e)&&!/like Mac OS/.test(e)?navigator.maxTouchPoints&&navigator.maxTouchPoints>2?(t.iOS=!0,t.iPad=!0,navigator.appVersion.match(/Version\/(\d+)/),t.iOSVersion=parseInt(RegExp.$1,10)):t.macOS=!0:/Android/.test(e)?t.android=!0:/Linux/.test(e)?t.linux=!0:/iP[ao]d|iPhone/i.test(e)?(t.iOS=!0,navigator.appVersion.match(/OS (\d+)/),t.iOSVersion=parseInt(RegExp.$1,10),t.iPhone=e.toLowerCase().indexOf(`iphone`)!==-1,t.iPad=e.toLowerCase().indexOf(`ipad`)!==-1):/Kindle/.test(e)||/\bKF[A-Z][A-Z]+/.test(e)||/Silk.*Mobile Safari/.test(e)?t.kindle=!0:/CrOS/.test(e)&&(t.chromeOS=!0),(/Windows Phone/i.test(e)||/IEMobile/i.test(e))&&(t.android=!1,t.iOS=!1,t.macOS=!1,t.windows=!0,t.windowsPhone=!0);var n=/Silk/.test(e);return(t.windows||t.macOS||t.linux&&!n||t.chromeOS)&&(t.desktop=!0),(t.windowsPhone||/Windows NT/i.test(e)&&/Touch/i.test(e))&&(t.desktop=!1),navigator.standalone&&(t.webApp=!0),typeof importScripts!=`function`&&(window.cordova!==void 0&&(t.cordova=!0),window.ejecta!==void 0&&(t.ejecta=!0)),typeof process<`u`&&process.versions&&process.versions.node&&(t.node=!0),t.node&&typeof process.versions==`object`&&(t.nodeWebkit=!!process.versions[`node-webkit`],t.electron=!!process.versions.electron),/Crosswalk/.test(e)&&(t.crosswalk=!0),t.pixelRatio=window.devicePixelRatio||1,t}e.exports=n()},43267(e,t,n){var r=n(95540),i={h264:!1,hls:!1,mov:!1,mp4:!1,m4v:!1,ogg:!1,vp9:!1,webm:!1,hasRequestVideoFrame:!1};function a(){if(typeof importScripts==`function`)return i;var e=document.createElement(`video`),t=!!e.canPlayType,n=/^no$/;try{t&&(e.canPlayType(`video/ogg; codecs="theora"`).replace(n,``)&&(i.ogg=!0),e.canPlayType(`video/mp4; codecs="avc1.42E01E"`).replace(n,``)&&(i.h264=!0,i.mp4=!0),e.canPlayType(`video/quicktime4; codecs="avc1.42E01E"`).replace(n,``)&&(i.mov=!0),e.canPlayType(`video/x-m4v`).replace(n,``)&&(i.m4v=!0),e.canPlayType(`video/webm; codecs="vp8, vorbis"`).replace(n,``)&&(i.webm=!0),e.canPlayType(`video/webm; codecs="vp9"`).replace(n,``)&&(i.vp9=!0),e.canPlayType(`application/x-mpegURL; codecs="avc1.42E01E"`).replace(n,``)&&(i.hls=!0))}catch{}return e.parentNode&&e.parentNode.removeChild(e),i.getVideoURL=function(e){Array.isArray(e)||(e=[e]);for(var t=0;t<e.length;t++){var n=r(e[t],`url`,e[t]);if(n.indexOf(`blob:`)===0)return{url:n,type:``};var a=n.indexOf(`data:`)===0?n.split(`,`)[0].match(/\/(.*?);/):n.match(/\.([a-zA-Z0-9]+)($|\?)/);if(a=r(e[t],`type`,a?a[1]:``).toLowerCase(),i[a])return{url:n,type:a}}return null},i}e.exports=a()},82264(e,t,n){e.exports={os:n(25892),browser:n(84148),features:n(89357),input:n(31784),audio:n(7098),video:n(43267),fullscreen:n(91639),canvasFeatures:n(89289)}},34664(e,t,n){var r=n(79980),i=n(28915),a=n(83419),o=n(40987),s=n(13699);e.exports=new a({initialize:function(e){e||={},this.isColorBand=!0,this.colorStart=new o,this.colorEnd=new o,this.start=e.start||0,this.middle=e.middle===void 0?.5:e.middle,this.end=1,e.end===void 0?e.size!==void 0&&(this.end=this.start+e.size):this.end=e.end,this.interpolation=e.interpolation||0,this.colorSpace=e.colorSpace||0,this.setColors(e.colorStart,e.colorEnd)},setColors:function(e,t){var n;return e===void 0&&(e=0),t===void 0&&(t=e),typeof e==`number`?o.IntegerToColor(e,this.colorStart):typeof e==`string`?o.HexStringToColor(e,this.colorStart):Array.isArray(e)?(n=e[3]===void 0?1:e[3],this.colorStart.setGLTo(e[0],e[1],e[2],n)):e instanceof o&&this.colorStart.setTo(e.red,e.green,e.blue,e.alpha),typeof t==`number`?o.IntegerToColor(t,this.colorEnd):typeof t==`string`?o.HexStringToColor(t,this.colorEnd):Array.isArray(t)?(n=t[3]===void 0?1:t[3],this.colorEnd.setGLTo(t[0],t[1],t[2],n)):t instanceof o&&this.colorEnd.setTo(t.red,t.green,t.blue,t.alpha),this},getColor:function(e){var t=Math.log(.5)/Math.log(this.middle);switch(e**=+t,e=Math.min(Math.max(0,e),1),this.interpolation){case 1:(e*=2)<1?e=.5*Math.sqrt(1- --e*e):(e=1-e,e=1-.5*Math.sqrt(1-e*e));break;case 2:e=r.InOut(e);break;case 3:e=r.Out(e);break;case 4:e=r.In(e);break}var n=0;this.colorSpace===2?n=1:this.colorSpace===3&&(n=-1);var a=s.ColorWithColor(this.colorStart,this.colorEnd,1,e,this.colorSpace!==0,n);return a.a=i(this.colorStart.alpha,this.colorEnd.alpha,e),a}})},89422(e,t,n){var r=n(83419),i=new Float32Array(20),a=new r({initialize:function(){this._matrix=new Float32Array(20),this.alpha=1,this._dirty=!0,this._data=new Float32Array(20),this.reset()},set:function(e){return this._matrix.set(e),this._dirty=!0,this},reset:function(){var e=this._matrix;return e.fill(0),e[0]=1,e[6]=1,e[12]=1,e[18]=1,this.alpha=1,this._dirty=!0,this},getData:function(){var e=this._data;return this._dirty&&=(e.set(this._matrix),e[4]/=255,e[9]/=255,e[14]/=255,e[19]/=255,!1),e},brightness:function(e,t){e===void 0&&(e=0),t===void 0&&(t=!1);var n=e;return this.multiply([n,0,0,0,0,0,n,0,0,0,0,0,n,0,0,0,0,0,1,0],t)},saturate:function(e,t){e===void 0&&(e=0),t===void 0&&(t=!1);var n=e*2/3+1,r=(n-1)*-.5;return this.multiply([n,r,r,0,0,r,n,r,0,0,r,r,n,0,0,0,0,0,1,0],t)},desaturate:function(e){return e===void 0&&(e=!1),this.saturate(-1,e)},hue:function(e,t){e===void 0&&(e=0),t===void 0&&(t=!1),e=e/180*Math.PI;var n=Math.cos(e),r=Math.sin(e),i=.213,a=.715,o=.072;return this.multiply([i+n*(1-i)+r*-i,a+n*-a+r*-a,o+n*-o+r*(1-o),0,0,i+n*-i+r*.143,a+n*(1-a)+r*.14,o+n*-o+r*-.283,0,0,i+n*-i+r*-(1-i),a+n*-a+r*a,o+n*(1-o)+r*o,0,0,0,0,0,1,0],t)},grayscale:function(e,t){return e===void 0&&(e=1),t===void 0&&(t=!1),this.saturate(-e,t)},blackWhite:function(e){return e===void 0&&(e=!1),this.multiply(a.BLACK_WHITE,e)},black:function(e){return this.multiply(a.BLACK,e)},contrast:function(e,t){e===void 0&&(e=0),t===void 0&&(t=!1);var n=e+1,r=-.5*(n-1);return this.multiply([n,0,0,0,r,0,n,0,0,r,0,0,n,0,r,0,0,0,1,0],t)},negative:function(e){return e===void 0&&(e=!1),this.multiply(a.NEGATIVE,e)},desaturateLuminance:function(e){return e===void 0&&(e=!1),this.multiply(a.DESATURATE_LUMINANCE,e)},sepia:function(e){return e===void 0&&(e=!1),this.multiply(a.SEPIA,e)},night:function(e,t){return e===void 0&&(e=.1),t===void 0&&(t=!1),this.multiply([e*-2,-e,0,0,0,-e,0,e,0,0,0,e,e*2,0,0,0,0,0,1,0],t)},lsd:function(e){return e===void 0&&(e=!1),this.multiply(a.LSD,e)},brown:function(e){return e===void 0&&(e=!1),this.multiply(a.BROWN,e)},vintagePinhole:function(e){return e===void 0&&(e=!1),this.multiply(a.VINTAGE,e)},kodachrome:function(e){return e===void 0&&(e=!1),this.multiply(a.KODACHROME,e)},technicolor:function(e){return e===void 0&&(e=!1),this.multiply(a.TECHNICOLOR,e)},polaroid:function(e){return e===void 0&&(e=!1),this.multiply(a.POLAROID,e)},alphaToBrightness:function(e){return e===void 0&&(e=!1),this.multiply(a.ALPHA_TO_BRIGHTNESS,e)},alphaToBrightnessInverse:function(e){return e===void 0&&(e=!1),this.multiply(a.ALPHA_TO_BRIGHTNESS_INVERSE,e)},brightnessToAlpha:function(e){return e===void 0&&(e=!1),this.multiply(a.BRIGHTNESS_TO_ALPHA,e)},brightnessToAlphaInverse:function(e){return e===void 0&&(e=!1),this.multiply(a.BRIGHTNESS_TO_ALPHA_INVERSE,e)},shiftToBGR:function(e){return e===void 0&&(e=!1),this.multiply(a.SHIFT_BGR,e)},multiply:function(e,t){t===void 0&&(t=!1),t||this.reset();var n=this._matrix,r=i;return r.set(n),n.set([r[0]*e[0]+r[1]*e[5]+r[2]*e[10]+r[3]*e[15],r[0]*e[1]+r[1]*e[6]+r[2]*e[11]+r[3]*e[16],r[0]*e[2]+r[1]*e[7]+r[2]*e[12]+r[3]*e[17],r[0]*e[3]+r[1]*e[8]+r[2]*e[13]+r[3]*e[18],r[0]*e[4]+r[1]*e[9]+r[2]*e[14]+r[3]*e[19]+r[4],r[5]*e[0]+r[6]*e[5]+r[7]*e[10]+r[8]*e[15],r[5]*e[1]+r[6]*e[6]+r[7]*e[11]+r[8]*e[16],r[5]*e[2]+r[6]*e[7]+r[7]*e[12]+r[8]*e[17],r[5]*e[3]+r[6]*e[8]+r[7]*e[13]+r[8]*e[18],r[5]*e[4]+r[6]*e[9]+r[7]*e[14]+r[8]*e[19]+r[9],r[10]*e[0]+r[11]*e[5]+r[12]*e[10]+r[13]*e[15],r[10]*e[1]+r[11]*e[6]+r[12]*e[11]+r[13]*e[16],r[10]*e[2]+r[11]*e[7]+r[12]*e[12]+r[13]*e[17],r[10]*e[3]+r[11]*e[8]+r[12]*e[13]+r[13]*e[18],r[10]*e[4]+r[11]*e[9]+r[12]*e[14]+r[13]*e[19]+r[14],r[15]*e[0]+r[16]*e[5]+r[17]*e[10]+r[18]*e[15],r[15]*e[1]+r[16]*e[6]+r[17]*e[11]+r[18]*e[16],r[15]*e[2]+r[16]*e[7]+r[17]*e[12]+r[18]*e[17],r[15]*e[3]+r[16]*e[8]+r[17]*e[13]+r[18]*e[18],r[15]*e[4]+r[16]*e[9]+r[17]*e[14]+r[18]*e[19]+r[19]]),this._dirty=!0,this}});a.BLACK=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0],a.BLACK_WHITE=[.3,.6,.1,0,0,.3,.6,.1,0,0,.3,.6,.1,0,0,0,0,0,1,0],a.NEGATIVE=[-1,0,0,1,0,0,-1,0,1,0,0,0,-1,1,0,0,0,0,1,0],a.DESATURATE_LUMINANCE=[.2764723,.929708,.0938197,0,-37.1,.2764723,.929708,.0938197,0,-37.1,.2764723,.929708,.0938197,0,-37.1,0,0,0,1,0],a.SEPIA=[.393,.7689999,.18899999,0,0,.349,.6859999,.16799999,0,0,.272,.5339999,.13099999,0,0,0,0,0,1,0],a.LSD=[2,-.4,.5,0,0,-.5,2,-.4,0,0,-.4,-.5,3,0,0,0,0,0,1,0],a.BROWN=[.5997023498159715,.34553243048391263,-.2708298674538042,0,47.43192855600873,-.037703249837783157,.8609577587992641,.15059552388459913,0,-36.96841498319127,.24113635128153335,-.07441037908422492,.44972182064877153,0,-7.562075277591283,0,0,0,1,0],a.VINTAGE=[.6279345635605994,.3202183420819367,-.03965408211312453,0,9.651285835294123,.02578397704808868,.6441188644374771,.03259127616149294,0,7.462829176470591,.0466055556782719,-.0851232987247891,.5241648018700465,0,5.159190588235296,0,0,0,1,0],a.KODACHROME=[1.1285582396593525,-.3967382283601348,-.03992559172921793,0,63.72958762196502,-.16404339962244616,1.0835251566291304,-.05498805115633132,0,24.732407896706203,-.16786010706155763,-.5603416277695248,1.6014850761964943,0,35.62982807460946,0,0,0,1,0],a.TECHNICOLOR=[1.9125277891456083,-.8545344976951645,-.09155508482755585,0,11.793603434377337,-.3087833385928097,1.7658908555458428,-.10601743074722245,0,-70.35205161461398,-.231103377548616,-.7501899197440212,1.847597816108189,0,30.950940869491138,0,0,0,1,0],a.POLAROID=[1.438,-.062,-.062,0,0,-.122,1.378,-.122,0,0,-.016,-.016,1.483,0,0,0,0,0,1,0],a.ALPHA_TO_BRIGHTNESS=[0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,255],a.ALPHA_TO_BRIGHTNESS_INVERSE=[0,0,0,-1,255,0,0,0,-1,255,0,0,0,-1,255,0,0,0,0,255],a.BRIGHTNESS_TO_ALPHA=[1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,.3,.6,.1,0,0],a.BRIGHTNESS_TO_ALPHA_INVERSE=[1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,-.3,-.6,-.1,0,255],a.SHIFT_BGR=[0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,1,0],e.exports=a},73043(e,t,n){var r=n(28915),i=n(70554),a=n(83419),o=n(45650),s=n(34664),c=i.getTintFromFloats;e.exports=new a({initialize:function(e,t,n){n===void 0&&(n=!0),this.scene=e,this.bands=[],this.gpuEncode=n,this.dataTexture=null,this.glTexture=null,this.dataTextureFirstBand=0,this.bandTreeDepth=0,this.dataTextureResolution=[0,0],this.setBands(t)},setBands:function(e,t){this.bands.length=0,Array.isArray(e)||(e=[e]);for(var n=0,r=0;r<e.length;r++){var i=e[r];if(i.isColorBand){this.bands.push(i),n=i.end;continue}i.start===void 0&&(i=Object.assign({start:n},i));var a=new s(i);this.bands.push(a),n=a.end}return t!==!1&&this.gpuEncode&&this.encode(),this},encode:function(){var e=this.bands.length,t=Math.ceil(Math.log2(e));this.bandTreeDepth=t;var n=2**t-1,r=(8+4*n+12*e)/4,i=1;r>4096&&(i=Math.ceil(r/4096),r=4096),this.dataTextureResolution[0]=r,this.dataTextureResolution[1]=i;var a=new ArrayBuffer(r*i*4),s=new Uint32Array(a),l=new Uint8Array(a),u=0,d=256*256;s[u++]=Math.round(this.bands[0].start*d),s[u++]=Math.round(this.bands[this.bands.length-1].end*d);for(var f=0;f<=t;f++)for(var p=2**f,m=1;m<p;m+=2){var h=Math.floor(n*m/p),g=this.bands[Math.min(h,e-1)];s[u++]=Math.round(g.end*d)}this.dataTextureFirstBand=u;for(var _=0;_<e;_++){g=this.bands[_];var v=g.colorStart,y=g.colorEnd;s[u++]=c(v.blueGL,v.greenGL,v.redGL,v.alphaGL),s[u++]=c(y.blueGL,y.greenGL,y.redGL,y.alphaGL);var b=g.colorSpace*255,x=g.interpolation,S=g.middle/2;s[u++]=d*(b+x+S)}if(this.glTexture){var C=this.glTexture;C.update(l,r,i,C.flipY,C.wrapS,C.wrapT,C.minFilter,C.magFilter,C.format)}else{var w=this.scene.renderer.createUint8ArrayTexture(l,r,i,!1,!1);this.glTexture=w;for(var T=o();this.scene.textures.exists(T);)T=o();this.dataTexture=this.scene.textures.addGLTexture(T,w)}},fixFit:function(e,t,n,r){var i=this.bands;if(i.length===0)return this;n===void 0&&(n=!0),r===void 0&&(r=!0),e!==void 0&&(i[0].start=e),t!==void 0&&(i[i.length-1].end=t);for(var a=0;a<i.length-1;a++){var o=i[a],s=i[a+1];s.start=o.end,s.start>s.end&&(s.end=s.start)}return n&&(this.bands=i.filter(function(e){return e.start<e.end})),r&&this.encode(),this},splitBand:function(e,t,n,i){if(t===0)return this;t===void 0&&(t=2),i===void 0&&(i=!0);var a=0;if(typeof e==`number`)a=e,e=this.bands[e];else if(a=this.bands.indexOf(e),a===-1)return this;if(!e)return this;this.bands.splice(a,1);for(var o=0;o<t;o++){var c=o/t,l=(o+1)/t;n&&(c=o/(t-1),l=(o+1)/(t-1));var u=e.getColor(c),d=e.getColor(l);n&&(d=u);var f=new s({colorStart:[u.r/255,u.g/255,u.b/255,u.a/255],colorEnd:[d.r/255,d.g/255,d.b/255,d.a/255],start:r(e.start,e.end,c),end:r(e.start,e.end,l),middle:e.middle,interpolation:e.interpolation,colorSpace:e.colorSpace});this.bands.splice(a++,0,f)}return i&&this.encode(),this},getColor:function(e){for(var t,n=0;n<this.bands.length;n++){var r=this.bands[n];if(r.start<=e&&r.end>=e){t=r;break}}return t?(e=(e-t.start)/(t.end-t.start),t.getColor(e)):{r:0,g:0,b:0,a:0,color:0}},destroy:function(){this.scene=null,this.dataTexture&&this.dataTexture.destroy()}})},51767(e,t,n){var r=n(83419),i=n(29747);e.exports=new r({initialize:function(e,t,n){this._rgb=[0,0,0],this.onChangeCallback=i,this.dirty=!1,this.set(e,t,n)},set:function(e,t,n){return e===void 0&&(e=0),t===void 0&&(t=0),n===void 0&&(n=0),this._rgb=[e,t,n],this.onChange(),this},equals:function(e,t,n){var r=this._rgb;return r[0]===e&&r[1]===t&&r[2]===n},onChange:function(){this.dirty=!0;var e=this._rgb;this.onChangeCallback.call(this,e[0],e[1],e[2])},r:{get:function(){return this._rgb[0]},set:function(e){this._rgb[0]=e,this.onChange()}},g:{get:function(){return this._rgb[1]},set:function(e){this._rgb[1]=e,this.onChange()}},b:{get:function(){return this._rgb[2]},set:function(e){this._rgb[2]=e,this.onChange()}},destroy:function(){this.onChangeCallback=null}})},60461(e){e.exports={TOP_LEFT:0,TOP_CENTER:1,TOP_RIGHT:2,LEFT_TOP:3,LEFT_CENTER:4,LEFT_BOTTOM:5,CENTER:6,RIGHT_TOP:7,RIGHT_CENTER:8,RIGHT_BOTTOM:9,BOTTOM_LEFT:10,BOTTOM_CENTER:11,BOTTOM_RIGHT:12}},54312(e,t,n){var r=n(62235),i=n(35893),a=n(86327),o=n(88417);e.exports=function(e,t,n,s){return n===void 0&&(n=0),s===void 0&&(s=0),o(e,i(t)+n),a(e,r(t)+s),e}},46768(e,t,n){var r=n(62235),i=n(26541),a=n(86327),o=n(385);e.exports=function(e,t,n,s){return n===void 0&&(n=0),s===void 0&&(s=0),o(e,i(t)-n),a(e,r(t)+s),e}},35827(e,t,n){var r=n(62235),i=n(54380),a=n(86327),o=n(40136);e.exports=function(e,t,n,s){return n===void 0&&(n=0),s===void 0&&(s=0),o(e,i(t)+n),a(e,r(t)+s),e}},46871(e,t,n){var r=n(66786),i=n(35893),a=n(7702);e.exports=function(e,t,n,o){return n===void 0&&(n=0),o===void 0&&(o=0),r(e,i(t)+n,a(t)+o),e}},5198(e,t,n){var r=n(7702),i=n(26541),a=n(20786),o=n(385);e.exports=function(e,t,n,s){return n===void 0&&(n=0),s===void 0&&(s=0),o(e,i(t)-n),a(e,r(t)+s),e}},11879(e,t,n){var r=n(60461),i=[];i[r.BOTTOM_CENTER]=n(54312),i[r.BOTTOM_LEFT]=n(46768),i[r.BOTTOM_RIGHT]=n(35827),i[r.CENTER]=n(46871),i[r.LEFT_CENTER]=n(5198),i[r.RIGHT_CENTER]=n(80503),i[r.TOP_CENTER]=n(89698),i[r.TOP_LEFT]=n(922),i[r.TOP_RIGHT]=n(21373),i[r.LEFT_BOTTOM]=i[r.BOTTOM_LEFT],i[r.LEFT_TOP]=i[r.TOP_LEFT],i[r.RIGHT_BOTTOM]=i[r.BOTTOM_RIGHT],i[r.RIGHT_TOP]=i[r.TOP_RIGHT],e.exports=function(e,t,n,r,a){return i[n](e,t,r,a)}},80503(e,t,n){var r=n(7702),i=n(54380),a=n(20786),o=n(40136);e.exports=function(e,t,n,s){return n===void 0&&(n=0),s===void 0&&(s=0),o(e,i(t)+n),a(e,r(t)+s),e}},89698(e,t,n){var r=n(35893),i=n(17717),a=n(88417),o=n(66737);e.exports=function(e,t,n,s){return n===void 0&&(n=0),s===void 0&&(s=0),a(e,r(t)+n),o(e,i(t)-s),e}},922(e,t,n){var r=n(26541),i=n(17717),a=n(385),o=n(66737);e.exports=function(e,t,n,s){return n===void 0&&(n=0),s===void 0&&(s=0),a(e,r(t)-n),o(e,i(t)-s),e}},21373(e,t,n){var r=n(54380),i=n(17717),a=n(40136),o=n(66737);e.exports=function(e,t,n,s){return n===void 0&&(n=0),s===void 0&&(s=0),a(e,r(t)+n),o(e,i(t)-s),e}},91660(e,t,n){e.exports={BottomCenter:n(54312),BottomLeft:n(46768),BottomRight:n(35827),Center:n(46871),LeftCenter:n(5198),QuickSet:n(11879),RightCenter:n(80503),TopCenter:n(89698),TopLeft:n(922),TopRight:n(21373)}},71926(e,t,n){var r=n(60461),i=n(79291),a={In:n(91660),To:n(16694)};a=i(!1,a,r),e.exports=a},21578(e,t,n){var r=n(62235),i=n(35893),a=n(88417),o=n(66737);e.exports=function(e,t,n,s){return n===void 0&&(n=0),s===void 0&&(s=0),a(e,i(t)+n),o(e,r(t)+s),e}},10210(e,t,n){var r=n(62235),i=n(26541),a=n(385),o=n(66737);e.exports=function(e,t,n,s){return n===void 0&&(n=0),s===void 0&&(s=0),a(e,i(t)-n),o(e,r(t)+s),e}},82341(e,t,n){var r=n(62235),i=n(54380),a=n(40136),o=n(66737);e.exports=function(e,t,n,s){return n===void 0&&(n=0),s===void 0&&(s=0),a(e,i(t)+n),o(e,r(t)+s),e}},87958(e,t,n){var r=n(62235),i=n(26541),a=n(86327),o=n(40136);e.exports=function(e,t,n,s){return n===void 0&&(n=0),s===void 0&&(s=0),o(e,i(t)-n),a(e,r(t)+s),e}},40080(e,t,n){var r=n(7702),i=n(26541),a=n(20786),o=n(40136);e.exports=function(e,t,n,s){return n===void 0&&(n=0),s===void 0&&(s=0),o(e,i(t)-n),a(e,r(t)+s),e}},88466(e,t,n){var r=n(26541),i=n(17717),a=n(40136),o=n(66737);e.exports=function(e,t,n,s){return n===void 0&&(n=0),s===void 0&&(s=0),a(e,r(t)-n),o(e,i(t)-s),e}},38829(e,t,n){var r=n(60461),i=[];i[r.BOTTOM_CENTER]=n(21578),i[r.BOTTOM_LEFT]=n(10210),i[r.BOTTOM_RIGHT]=n(82341),i[r.LEFT_BOTTOM]=n(87958),i[r.LEFT_CENTER]=n(40080),i[r.LEFT_TOP]=n(88466),i[r.RIGHT_BOTTOM]=n(19211),i[r.RIGHT_CENTER]=n(34609),i[r.RIGHT_TOP]=n(48741),i[r.TOP_CENTER]=n(49440),i[r.TOP_LEFT]=n(81288),i[r.TOP_RIGHT]=n(61323),e.exports=function(e,t,n,r,a){return i[n](e,t,r,a)}},19211(e,t,n){var r=n(62235),i=n(54380),a=n(86327),o=n(385);e.exports=function(e,t,n,s){return n===void 0&&(n=0),s===void 0&&(s=0),o(e,i(t)+n),a(e,r(t)+s),e}},34609(e,t,n){var r=n(7702),i=n(54380),a=n(20786),o=n(385);e.exports=function(e,t,n,s){return n===void 0&&(n=0),s===void 0&&(s=0),o(e,i(t)+n),a(e,r(t)+s),e}},48741(e,t,n){var r=n(54380),i=n(17717),a=n(385),o=n(66737);e.exports=function(e,t,n,s){return n===void 0&&(n=0),s===void 0&&(s=0),a(e,r(t)+n),o(e,i(t)-s),e}},49440(e,t,n){var r=n(35893),i=n(17717),a=n(86327),o=n(88417);e.exports=function(e,t,n,s){return n===void 0&&(n=0),s===void 0&&(s=0),o(e,r(t)+n),a(e,i(t)-s),e}},81288(e,t,n){var r=n(26541),i=n(17717),a=n(86327),o=n(385);e.exports=function(e,t,n,s){return n===void 0&&(n=0),s===void 0&&(s=0),o(e,r(t)-n),a(e,i(t)-s),e}},61323(e,t,n){var r=n(54380),i=n(17717),a=n(86327),o=n(40136);e.exports=function(e,t,n,s){return n===void 0&&(n=0),s===void 0&&(s=0),o(e,r(t)+n),a(e,i(t)-s),e}},16694(e,t,n){e.exports={BottomCenter:n(21578),BottomLeft:n(10210),BottomRight:n(82341),LeftBottom:n(87958),LeftCenter:n(40080),LeftTop:n(88466),QuickSet:n(38829),RightBottom:n(19211),RightCenter:n(34609),RightTop:n(48741),TopCenter:n(49440),TopLeft:n(81288),TopRight:n(61323)}},66786(e,t,n){var r=n(88417),i=n(20786);e.exports=function(e,t,n){return r(e,t),i(e,n)}},62235(e){e.exports=function(e){return e.y+e.height-e.height*e.originY}},72873(e,t,n){var r=n(62235),i=n(26541),a=n(54380),o=n(17717),s=n(87841);e.exports=function(e,t){t===void 0&&(t=new s);var n=i(e),c=o(e);return t.x=n,t.y=c,t.width=a(e)-n,t.height=r(e)-c,t}},35893(e){e.exports=function(e){return e.x-e.width*e.originX+e.width*.5}},7702(e){e.exports=function(e){return e.y-e.height*e.originY+e.height*.5}},26541(e){e.exports=function(e){return e.x-e.width*e.originX}},87431(e){e.exports=function(e){return e.width*e.originX}},46928(e){e.exports=function(e){return e.height*e.originY}},54380(e){e.exports=function(e){return e.x+e.width-e.width*e.originX}},17717(e){e.exports=function(e){return e.y-e.height*e.originY}},86327(e){e.exports=function(e,t){return e.y=t-e.height+e.height*e.originY,e}},88417(e){e.exports=function(e,t){return e.x=t+e.width*e.originX-e.width*.5,e}},20786(e){e.exports=function(e,t){return e.y=t+e.height*e.originY-e.height*.5,e}},385(e){e.exports=function(e,t){return e.x=t+e.width*e.originX,e}},40136(e){e.exports=function(e,t){return e.x=t-e.width+e.width*e.originX,e}},66737(e){e.exports=function(e,t){return e.y=t+e.height*e.originY,e}},58724(e,t,n){e.exports={CenterOn:n(66786),GetBottom:n(62235),GetBounds:n(72873),GetCenterX:n(35893),GetCenterY:n(7702),GetLeft:n(26541),GetOffsetX:n(87431),GetOffsetY:n(46928),GetRight:n(54380),GetTop:n(17717),SetBottom:n(86327),SetCenterX:n(88417),SetCenterY:n(20786),SetLeft:n(385),SetRight:n(40136),SetTop:n(66737)}},20623(e){e.exports={setCrisp:function(e){return[`optimizeSpeed`,`-moz-crisp-edges`,`-o-crisp-edges`,`-webkit-optimize-contrast`,`optimize-contrast`,`crisp-edges`,`pixelated`].forEach(function(t){e.style[`image-rendering`]=t}),e.style.msInterpolationMode=`nearest-neighbor`,e},setBicubic:function(e){return e.style[`image-rendering`]=`auto`,e.style.msInterpolationMode=`bicubic`,e}}},27919(e,t,n){var r=n(8054),i=n(68703),a=[],o=!1;e.exports=function(){var e=function(e,t,n,c,l){t===void 0&&(t=1),n===void 0&&(n=1),c===void 0&&(c=r.CANVAS),l===void 0&&(l=!1);var u,d=s(c);return d===null?(d={parent:e,canvas:document.createElement(`canvas`),type:c},c===r.CANVAS&&a.push(d),u=d.canvas):(d.parent=e,u=d.canvas),l&&(d.parent=u),u.width=t,u.height=n,o&&c===r.CANVAS&&i.disable(u.getContext(`2d`,{willReadFrequently:!1})),u},t=function(t,n,i){return e(t,n,i,r.CANVAS)},n=function(t,n,i){return e(t,n,i,r.WEBGL)},s=function(e){if(e===void 0&&(e=r.CANVAS),e===r.WEBGL)return null;for(var t=0;t<a.length;t++){var n=a[t];if(!n.parent&&n.type===e)return n}return null},c=function(e){var t=e instanceof HTMLCanvasElement;a.forEach(function(n){(t&&n.canvas===e||!t&&n.parent===e)&&(n.parent=null,n.canvas.width=1,n.canvas.height=1)})},l=function(){var e=0;return a.forEach(function(t){t.parent&&e++}),e};return{create2D:t,create:e,createWebGL:n,disableSmoothing:function(){o=!0},enableSmoothing:function(){o=!1},first:s,free:function(){return a.length-l()},pool:a,remove:c,total:l}}()},68703(e){var t=``;e.exports=function(){var e=function(e){for(var t=[`i`,`webkitI`,`msI`,`mozI`,`oI`],n=0;n<t.length;n++){var r=t[n]+`mageSmoothingEnabled`;if(r in e)return r}return null};return{disable:function(n){return t===``&&(t=e(n)),t&&(n[t]=!1),n},enable:function(n){return t===``&&(t=e(n)),t&&(n[t]=!0),n},getPrefix:e,isEnabled:function(e){return t===null?null:e[t]}}}()},65208(e){e.exports=function(e,t){return t===void 0&&(t=`none`),e.style.msTouchAction=t,e.style[`ms-touch-action`]=t,e.style[`touch-action`]=t,e}},91610(e){e.exports=function(e,t){return t===void 0&&(t=`none`),[`-webkit-`,`-khtml-`,`-moz-`,`-ms-`,``].forEach(function(n){e.style[n+`user-select`]=t}),e.style[`-webkit-touch-callout`]=t,e.style[`-webkit-tap-highlight-color`]=`rgba(0, 0, 0, 0)`,e}},26253(e,t,n){e.exports={CanvasInterpolation:n(20623),CanvasPool:n(27919),Smoothing:n(68703),TouchAction:n(65208),UserSelect:n(91610)}},40987(e,t,n){var r=n(83419),i=n(37589),a=n(1e3),o=n(7537),s=n(87837),c=new r({initialize:function(e,t,n,r){e===void 0&&(e=0),t===void 0&&(t=0),n===void 0&&(n=0),r===void 0&&(r=255),this.r=0,this.g=0,this.b=0,this.a=255,this._h=0,this._s=0,this._v=0,this._locked=!1,this.gl=[0,0,0,1],this._color=0,this._color32=0,this._rgba=``,this.setTo(e,t,n,r)},transparent:function(){return this._locked=!0,this.red=0,this.green=0,this.blue=0,this.alpha=0,this._locked=!1,this.update(!0)},setTo:function(e,t,n,r,i){return r===void 0&&(r=255),i===void 0&&(i=!0),this._locked=!0,this.red=e,this.green=t,this.blue=n,this.alpha=r,this._locked=!1,this.update(i)},setGLTo:function(e,t,n,r){return r===void 0&&(r=1),this._locked=!0,this.redGL=e,this.greenGL=t,this.blueGL=n,this.alphaGL=r,this._locked=!1,this.update(!0)},setFromRGB:function(e){return this._locked=!0,this.red=e.r,this.green=e.g,this.blue=e.b,e.hasOwnProperty(`a`)&&(this.alpha=e.a),this._locked=!1,this.update(!0)},setFromHSV:function(e,t,n){return o(e,t,n,this)},update:function(e){if(e===void 0&&(e=!1),this._locked)return this;var t=this.r,n=this.g,r=this.b,o=this.a;return this._color=i(t,n,r),this._color32=a(t,n,r,o),this._rgba=`rgba(`+t+`,`+n+`,`+r+`,`+o/255+`)`,e&&s(t,n,r,this),this},updateHSV:function(){var e=this.r,t=this.g,n=this.b;return s(e,t,n,this),this},clone:function(){return new c(this.r,this.g,this.b,this.a)},gray:function(e){return this.setTo(e,e,e)},random:function(e,t){e===void 0&&(e=0),t===void 0&&(t=255);var n=Math.floor(e+Math.random()*(t-e)),r=Math.floor(e+Math.random()*(t-e)),i=Math.floor(e+Math.random()*(t-e));return this.setTo(n,r,i)},randomGray:function(e,t){e===void 0&&(e=0),t===void 0&&(t=255);var n=Math.floor(e+Math.random()*(t-e));return this.setTo(n,n,n)},saturate:function(e){return this.s+=e/100,this},desaturate:function(e){return this.s-=e/100,this},lighten:function(e){return this.v+=e/100,this},darken:function(e){return this.v-=e/100,this},brighten:function(e){var t=this.r,n=this.g,r=this.b;return t=Math.max(0,Math.min(255,t-Math.round(255*-(e/100)))),n=Math.max(0,Math.min(255,n-Math.round(255*-(e/100)))),r=Math.max(0,Math.min(255,r-Math.round(255*-(e/100)))),this.setTo(t,n,r)},color:{get:function(){return this._color}},color32:{get:function(){return this._color32}},rgba:{get:function(){return this._rgba}},redGL:{get:function(){return this.gl[0]},set:function(e){this.gl[0]=Math.min(Math.abs(e),1),this.r=Math.floor(this.gl[0]*255),this.update(!0)}},greenGL:{get:function(){return this.gl[1]},set:function(e){this.gl[1]=Math.min(Math.abs(e),1),this.g=Math.floor(this.gl[1]*255),this.update(!0)}},blueGL:{get:function(){return this.gl[2]},set:function(e){this.gl[2]=Math.min(Math.abs(e),1),this.b=Math.floor(this.gl[2]*255),this.update(!0)}},alphaGL:{get:function(){return this.gl[3]},set:function(e){this.gl[3]=Math.min(Math.abs(e),1),this.a=Math.floor(this.gl[3]*255),this.update()}},red:{get:function(){return this.r},set:function(e){e=Math.floor(Math.abs(e)),this.r=Math.min(e,255),this.gl[0]=e/255,this.update(!0)}},green:{get:function(){return this.g},set:function(e){e=Math.floor(Math.abs(e)),this.g=Math.min(e,255),this.gl[1]=e/255,this.update(!0)}},blue:{get:function(){return this.b},set:function(e){e=Math.floor(Math.abs(e)),this.b=Math.min(e,255),this.gl[2]=e/255,this.update(!0)}},alpha:{get:function(){return this.a},set:function(e){e=Math.floor(Math.abs(e)),this.a=Math.min(e,255),this.gl[3]=e/255,this.update()}},h:{get:function(){return this._h},set:function(e){this._h=e,o(e,this._s,this._v,this)}},s:{get:function(){return this._s},set:function(e){this._s=e,o(this._h,e,this._v,this)}},v:{get:function(){return this._v},set:function(e){this._v=e,o(this._h,this._s,e,this)}}});e.exports=c},92728(e,t,n){var r=n(37589);e.exports=function(e){e===void 0&&(e=1024);var t=[],n=255,i,a=255,o=0,s=0;for(i=0;i<=n;i++)t.push({r:a,g:i,b:s,color:r(a,i,s)});for(o=255,i=n;i>=0;i--)t.push({r:i,g:o,b:s,color:r(i,o,s)});for(a=0,i=0;i<=n;i++,o--)t.push({r:a,g:o,b:i,color:r(a,o,i)});for(o=0,s=255,i=0;i<=n;i++,s--,a++)t.push({r:a,g:o,b:s,color:r(a,o,s)});if(e===1024)return t;var c=[],l=0,u=1024/e;for(i=0;i<e;i++)c.push(t[Math.floor(l)]),l+=u;return c}},91588(e){e.exports=function(e){var t={r:e>>16&255,g:e>>8&255,b:e&255,a:255};return e>16777215&&(t.a=e>>>24),t}},62957(e){e.exports=function(e){var t=e.toString(16);return t.length===1?`0`+t:t}},37589(e){e.exports=function(e,t,n){return e<<16|t<<8|n}},1e3(e){e.exports=function(e,t,n,r){return r<<24|e<<16|t<<8|n}},62183(e,t,n){var r=n(40987),i=n(89528);e.exports=function(e,t,n,a){a||=new r;var o=n,s=n,c=n;if(t!==0){var l=n<.5?n*(1+t):n+t-n*t,u=2*n-l;o=i(u,l,e+1/3),s=i(u,l,e),c=i(u,l,e-1/3)}return a.setGLTo(o,s,c,1)}},27939(e,t,n){var r=n(7537);e.exports=function(e,t){e===void 0&&(e=1),t===void 0&&(t=1);for(var n=[],i=0;i<=359;i++)n.push(r(i/359,e,t));return n}},7537(e,t,n){var r=n(37589);function i(e,t,n,r){var i=(e+t*6)%6,a=Math.min(i,4-i,1);return Math.round(255*(r-r*n*Math.max(0,a)))}e.exports=function(e,t,n,a){t===void 0&&(t=1),n===void 0&&(n=1);var o=i(5,e,t,n),s=i(3,e,t,n),c=i(1,e,t,n);return a?a.setTo?a.setTo(o,s,c,a.alpha,!0):(a.r=o,a.g=s,a.b=c,a.color=r(o,s,c),a):{r:o,g:s,b:c,color:r(o,s,c)}}},70238(e,t,n){var r=n(40987);e.exports=function(e,t){t||=new r,e=e.replace(/^(?:#|0x)?([a-f\d])([a-f\d])([a-f\d])$/i,function(e,t,n,r){return t+t+n+n+r+r});var n=/^(?:#|0x)?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e);if(n){var i=parseInt(n[1],16),a=parseInt(n[2],16),o=parseInt(n[3],16);t.setTo(i,a,o)}return t}},89528(e){e.exports=function(e,t,n){return n<0&&(n+=1),n>1&&--n,n<1/6?e+(t-e)*6*n:n<1/2?t:n<2/3?e+(t-e)*(2/3-n)*6:e}},30100(e,t,n){var r=n(40987),i=n(90664);e.exports=function(e,t){var n=i(e);return t?t.setTo(n.r,n.g,n.b,n.a):new r(n.r,n.g,n.b,n.a)}},90664(e){e.exports=function(e){return e>16777215?{a:e>>>24,r:e>>16&255,g:e>>8&255,b:e&255}:{a:255,r:e>>16&255,g:e>>8&255,b:e&255}}},13699(e,t,n){var r=n(28915),i=n(37589),a=n(7537),o=function(e,t,n,a,o,s,c,l){c===void 0&&(c=100),l===void 0&&(l=0);var u=l/c,d=r(e,a,u),f=r(t,o,u),p=r(n,s,u);return{r:d,g:f,b:p,a:255,color:i(d,f,p)}},s=function(e,t,n,i,o,s,c,l,u){if(u===void 0&&(u=0),u===0){var d=e-i;d>.5?--e:d<-.5&&(e+=1)}else u>0?e>i&&--e:e<i&&(e+=1);var f=l/c;return a(r(e,i,f),r(t,o,f),r(n,s,f))};e.exports={RGBWithRGB:o,HSVWithHSV:s,ColorWithRGB:function(e,t,n,r,i,a){return i===void 0&&(i=100),a===void 0&&(a=0),o(e.r,e.g,e.b,t,n,r,i,a)},ColorWithColor:function(e,t,n,r,i,a){return n===void 0&&(n=100),r===void 0&&(r=0),i?s(e.h,e.s,e.v,t.h,t.s,t.v,n,r,a):o(e.r,e.g,e.b,t.r,t.g,t.b,n,r)}}},68957(e,t,n){var r=n(40987);e.exports=function(e,t){return t?t.setTo(e.r,e.g,e.b,e.a):new r(e.r,e.g,e.b,e.a)}},87388(e,t,n){var r=n(40987);e.exports=function(e,t){t||=new r;var n=/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d+(?:\.\d+)?))?\s*\)$/.exec(e.toLowerCase());if(n){var i=parseInt(n[1],10),a=parseInt(n[2],10),o=parseInt(n[3],10),s=n[4]===void 0?1:parseFloat(n[4]);t.setTo(i,a,o,s*255)}return t}},87837(e){e.exports=function(e,t,n,r){r===void 0&&(r={h:0,s:0,v:0}),e/=255,t/=255,n/=255;var i=Math.min(e,t,n),a=Math.max(e,t,n),o=a-i,s=0,c=a===0?0:o/a,l=a;return a!==i&&(a===e?s=(t-n)/o+(t<n?6:0):a===t?s=(n-e)/o+2:a===n&&(s=(e-t)/o+4),s/=6),r.hasOwnProperty(`_h`)?(r._h=s,r._s=c,r._v=l):(r.h=s,r.s=c,r.v=l),r}},75723(e,t,n){var r=n(62957);e.exports=function(e,t,n,i,a){return i===void 0&&(i=255),a===void 0&&(a=`#`),a===`#`?`#`+((1<<24)+(e<<16)+(t<<8)+n).toString(16).slice(1,7):`0x`+r(i)+r(e)+r(t)+r(n)}},85386(e,t,n){var r=n(30976),i=n(40987);e.exports=function(e,t){return e===void 0&&(e=0),t===void 0&&(t=255),new i(r(e,t),r(e,t),r(e,t))}},80333(e,t,n){var r=n(70238),i=n(30100),a=n(68957),o=n(87388);e.exports=function(e,t){switch(typeof e){case`string`:return e.substr(0,3).toLowerCase()===`rgb`?o(e,t):r(e,t);case`number`:return i(e,t);case`object`:return a(e,t)}}},3956(e,t,n){var r=n(40987);r.ColorSpectrum=n(92728),r.ColorToRGBA=n(91588),r.ComponentToHex=n(62957),r.GetColor=n(37589),r.GetColor32=n(1e3),r.HexStringToColor=n(70238),r.HSLToColor=n(62183),r.HSVColorWheel=n(27939),r.HSVToRGB=n(7537),r.HueToComponent=n(89528),r.IntegerToColor=n(30100),r.IntegerToRGB=n(90664),r.Interpolate=n(13699),r.ObjectToColor=n(68957),r.RandomRGB=n(85386),r.RGBStringToColor=n(87388),r.RGBToHSV=n(87837),r.RGBToString=n(75723),r.ValueToColor=n(80333),e.exports=r},27460(e,t,n){e.exports={Align:n(71926),BaseShader:n(73894),Bounds:n(58724),Canvas:n(26253),Color:n(3956),ColorBand:n(34664),ColorMatrix:n(89422),ColorRamp:n(73043),Masks:n(69781),RGB:n(51767)}},80661(e,t,n){e.exports=new(n(83419))({initialize:function(e,t){this.geometryMask=t},setShape:function(e){return this.geometryMask=e,this},preRenderCanvas:function(e,t,n){var r=this.geometryMask;e.currentContext.save(),r.renderCanvas(e,r,n,null,null,!0),e.currentContext.clip()},postRenderCanvas:function(e){e.currentContext.restore()},destroy:function(){this.geometryMask=null}})},69781(e,t,n){e.exports={GeometryMask:n(80661)}},73894(e,t,n){e.exports=new(n(83419))({initialize:function(e,t,n){n===void 0&&(n={}),this.key=e,this.glsl=t,this.metadata=n}})},40366(e){e.exports=function(e,t){var n;if(t)typeof t==`string`?n=document.getElementById(t):typeof t==`object`&&t.nodeType===1&&(n=t);else if(e.parentElement||t===null)return e;return n||=document.body,n.appendChild(e),e}},83719(e,t,n){var r=n(40366);e.exports=function(e){var t=e.config;if(!(!t.parent||!t.domCreateContainer)){var n=document.createElement(`div`);n.style.cssText=[`display: block;`,`width: `+e.scale.width+`px;`,`height: `+e.scale.height+`px;`,`padding: 0; margin: 0;`,`position: absolute;`,`overflow: hidden;`,`pointer-events: `+t.domPointerEvents+`;`,`transform: scale(1);`,`transform-origin: left top;`].join(` `),e.domContainer=n,r(n,t.parent)}}},57264(e,t,n){var r=n(25892);e.exports=function(e){if(document.readyState===`complete`||document.readyState===`interactive`){e();return}var t=function(){document.removeEventListener(`deviceready`,t,!0),document.removeEventListener(`DOMContentLoaded`,t,!0),window.removeEventListener(`load`,t,!0),e()};document.body?r.cordova?document.addEventListener(`deviceready`,t,!1):(document.addEventListener(`DOMContentLoaded`,t,!0),window.addEventListener(`load`,t,!0)):window.setTimeout(t,20)}},57811(e){e.exports=function(e){if(!e)return window.innerHeight;var t=Math.abs(window.orientation),n={w:0,h:0},r=document.createElement(`div`);return r.setAttribute(`style`,`position: fixed; height: 100vh; width: 0; top: 0`),document.documentElement.appendChild(r),n.w=t===90?r.offsetHeight:window.innerWidth,n.h=t===90?window.innerWidth:r.offsetHeight,document.documentElement.removeChild(r),r=null,Math.abs(window.orientation)===90?n.w:n.h}},45818(e,t,n){var r=n(13560);e.exports=function(e,t){var n=window.screen,i=n?n.orientation||n.mozOrientation||n.msOrientation:!1;if(i&&typeof i.type==`string`)return i.type;if(typeof i==`string`)return i;if(typeof window.orientation==`number`)return window.orientation===0||window.orientation===180?r.ORIENTATION.PORTRAIT:r.ORIENTATION.LANDSCAPE;if(window.matchMedia){if(window.matchMedia(`(orientation: portrait)`).matches)return r.ORIENTATION.PORTRAIT;if(window.matchMedia(`(orientation: landscape)`).matches)return r.ORIENTATION.LANDSCAPE}else return t>e?r.ORIENTATION.PORTRAIT:r.ORIENTATION.LANDSCAPE}},74403(e){e.exports=function(e){var t;return e!==``&&(typeof e==`string`?t=document.getElementById(e):e&&e.nodeType===1&&(t=e)),t||=document.body,t}},56836(e){e.exports=function(e){var t=``;try{window.DOMParser?t=new DOMParser().parseFromString(e,`text/xml`):(t=new ActiveXObject(`Microsoft.XMLDOM`),t.loadXML(e))}catch{t=null}return!t||!t.documentElement||t.getElementsByTagName(`parsererror`).length?null:t}},35846(e){e.exports=function(e){e.parentNode&&e.parentNode.removeChild(e)}},43092(e,t,n){var r=n(83419),i=n(29747);e.exports=new r({initialize:function(){this.isRunning=!1,this.callback=i,this.isSetTimeOut=!1,this.timeOutID=null,this.delay=0;var e=this;this.step=function t(n){e.callback(n),e.isRunning&&(e.timeOutID=window.requestAnimationFrame(t))},this.stepTimeout=function t(){e.isRunning&&(e.timeOutID=window.setTimeout(t,e.delay)),e.callback(window.performance.now())}},start:function(e,t,n){this.isRunning||(this.callback=e,this.isSetTimeOut=t,this.delay=n,this.isRunning=!0,this.timeOutID=t?window.setTimeout(this.stepTimeout,0):window.requestAnimationFrame(this.step))},stop:function(){this.isRunning=!1,this.isSetTimeOut?clearTimeout(this.timeOutID):window.cancelAnimationFrame(this.timeOutID)},destroy:function(){this.stop(),this.callback=i}})},84902(e,t,n){e.exports={AddToDOM:n(40366),DOMContentLoaded:n(57264),GetInnerHeight:n(57811),GetScreenOrientation:n(45818),GetTarget:n(74403),ParseXML:n(56836),RemoveFromDOM:n(35846),RequestAnimationFrame:n(43092)}},47565(e,t,n){var r=n(83419),i=n(50792),a=n(37277),o=new r({Extends:i,initialize:function(){i.call(this)},shutdown:function(){this.removeAllListeners()},destroy:function(){this.removeAllListeners()}});a.register(`EventEmitter`,o,`events`),e.exports=o},93055(e,t,n){e.exports={EventEmitter:n(47565)}},10189(e,t,n){var r=n(83419),i=n(13045);e.exports=new r({Extends:i,initialize:function(e,t){t===void 0&&(t=1),i.call(this,e,`FilterBarrel`),this.amount=t}})},16762(e,t,n){var r=n(83419),i=n(13045);e.exports=new r({Extends:i,initialize:function(e,t,n,r,a){t===void 0&&(t=`__WHITE`),n===void 0&&(n=0),r===void 0&&(r=1),a===void 0&&(a=[1,1,1,1]),i.call(this,e,`FilterBlend`),this.glTexture,this.blendMode=n,this.amount=r,this.color=a,this.setTexture(t)},setTexture:function(e){var t=this.camera.scene.sys.textures.getFrame(e);return t&&(this.glTexture=t.glTexture),this}})},37597(e,t,n){var r=n(83419),i=n(13045);e.exports=new r({Extends:i,initialize:function(e,t){i.call(this,e,`FilterBlocky`),this.size={x:4,y:4},this.offset={x:0,y:0},t&&(t.size!==void 0&&(typeof t.size==`number`?(this.size.x=t.size,this.size.y=t.size):(this.size.x=t.size.x,this.size.y=t.size.y)),t.offset!==void 0&&(typeof t.offset==`number`?(this.offset.x=t.offset,this.offset.y=t.offset):(this.offset.x=t.offset.x,this.offset.y=t.offset.y)))}})},88344(e,t,n){var r=n(83419),i=n(13045);e.exports=new r({Extends:i,initialize:function(e,t,n,r,a,o,s){t===void 0&&(t=0),n===void 0&&(n=2),r===void 0&&(r=2),a===void 0&&(a=1),s===void 0&&(s=4),i.call(this,e,`FilterBlur`),this.quality=t,this.x=n,this.y=r,this.strength=a,this.glcolor=[1,1,1],o!=null&&(this.color=o),this.steps=s},color:{get:function(){var e=this.glcolor;return(e[0]*255<<16)+(e[1]*255<<8)+(e[2]*255|0)},set:function(e){var t=this.glcolor;t[0]=(e>>16&255)/255,t[1]=(e>>8&255)/255,t[2]=(e&255)/255}},getPadding:function(){var e=this.paddingOverride;if(e)return this.currentPadding.setTo(e.x,e.y,e.width,e.height),e;var t=this.quality,n=t===0?1.333:t===1?3.2307692308:5.176470588235294,r=this.steps*this.strength*n,i=Math.ceil(this.x*r),a=Math.ceil(this.y*r);return this.currentPadding.setTo(-i,-a,i*2,a*2),this.currentPadding}})},47564(e,t,n){var r=n(83419),i=n(13045);e.exports=new r({Extends:i,initialize:function(e,t,n,r,a,o,s,c){t===void 0&&(t=.5),n===void 0&&(n=1),r===void 0&&(r=.2),a===void 0&&(a=!1),o===void 0&&(o=1),s===void 0&&(s=1),c===void 0&&(c=1),i.call(this,e,`FilterBokeh`),this.radius=t,this.amount=n,this.contrast=r,this.isTiltShift=a,this.blurX=o,this.blurY=s,this.strength=c},getPadding:function(){var e=this.paddingOverride;if(e)return this.currentPadding.setTo(e.x,e.y,e.width,e.height),e;var t=Math.ceil(this.camera.height*this.radius*.021426096060426905);return this.currentPadding.setTo(-t,-t,t*2,t*2),this.currentPadding}})},77011(e,t,n){var r=n(83419),i=n(13045),a=n(89422);e.exports=new r({Extends:i,initialize:function(e){i.call(this,e,`FilterColorMatrix`),this.colorMatrix=new a},destroy:function(){this.colorMatrix=null,i.prototype.destroy.call(this)}})},95200(e,t,n){var r=n(83419),i=n(13045),a=n(89422),o=n(79237);e.exports=new r({Extends:i,initialize:function(e,t){i.call(this,e,`FilterCombineColorMatrix`),this.glTexture,this.colorMatrixSelf=new a,this.colorMatrixTransfer=new a,this.additions=[1,1,1,0],this.multiplications=[0,0,0,1],this.setTexture(t||`__WHITE`)},setTexture:function(e){var t=e instanceof o?e:this.camera.scene.sys.textures.getFrame(e);return t&&(this.glTexture=t.glTexture),this},setupAlphaTransfer:function(e,t,n,r,i,a){var o=this.colorMatrixSelf,s=this.colorMatrixTransfer;o.reset(),s.reset(),this.additions=[1,1,1,0],this.multiplications=[0,0,0,1],e||o.black(),t||s.black(),i?o.brightnessToAlphaInverse(!0):n&&o.brightnessToAlpha(!0),a?s.brightnessToAlphaInverse(!0):r&&s.brightnessToAlpha(!0)},destroy:function(){this.colorMatrixSelf=null,this.colorMatrixTransfer=null,i.prototype.destroy.call(this)}})},13045(e,t,n){var r=n(83419),i=n(87841);e.exports=new r({initialize:function(e,t){this.active=!0,this.camera=e,this.renderNode=t,this.paddingOverride=new i,this.currentPadding=new i,this.allowBaseDraw=!0,this.ignoreDestroy=!1},getPadding:function(){return this.paddingOverride||this.currentPadding},getPaddingCeil:function(){var e=this.getPadding(),t=new i(Math.ceil(e.x),Math.ceil(e.y),Math.ceil(e.width),Math.ceil(e.height));return this.currentPadding.setTo(t.x,t.y,t.width,t.height),t},setPaddingOverride:function(e,t,n,r){return e===null?(this.paddingOverride=null,this):(e===void 0&&(e=0),t===void 0&&(t=0),n===void 0&&(n=0),r===void 0&&(r=0),this.paddingOverride=new i(e,t,n-e,r-t),this)},setActive:function(e){return this.active=e,this},destroy:function(){this.active=!1,this.renderNode=null,this.camera=null}})},16898(e,t,n){var r=n(83419),i=n(13045);e.exports=new r({Extends:i,initialize:function(e,t,n,r){t===void 0&&(t=`__WHITE`),n===void 0&&(n=.005),r===void 0&&(r=.005),i.call(this,e,`FilterDisplacement`),this.x=n,this.y=r,this.glTexture,this.setTexture(t)},setTexture:function(e){var t=this.camera.scene.sys.textures.getFrame(e);return t&&(this.glTexture=t.glTexture),this},getPadding:function(){var e=this.paddingOverride;if(e)return this.currentPadding.setTo(e.x,e.y,e.width,e.height),e;var t=this.camera,n=Math.ceil(t.width*this.x*.5),r=Math.ceil(t.height*this.y*.5);return this.currentPadding.setTo(-n,-r,n*2,r*2),this.currentPadding}})},42652(e,t,n){var r=n(83419),i=n(13045);e.exports=new r({Extends:i,initialize:function(e,t,n,r,a,o,s,c){n===void 0&&(n=4),r===void 0&&(r=0),a===void 0&&(a=1),o===void 0&&(o=!1),s===void 0&&(s=e.scene.sys.game.config.glowQuality),c===void 0&&(c=e.scene.sys.game.config.glowDistance),i.call(this,e,`FilterGlow`),this.outerStrength=n,this.innerStrength=r,this.scale=a,this.knockout=o,this._quality=Math.max(Math.round(s),1),this._distance=Math.max(Math.round(c),1),this.glcolor=[1,1,1,1],t!==void 0&&(this.color=t)},color:{get:function(){var e=this.glcolor;return(e[0]*255<<16)+(e[1]*255<<8)+(e[2]*255|0)},set:function(e){var t=this.glcolor;t[0]=(e>>16&255)/255,t[1]=(e>>8&255)/255,t[2]=(e&255)/255}},distance:{get:function(){return this._distance}},quality:{get:function(){return this._quality}},getPadding:function(){var e=this.paddingOverride;if(e)return this.currentPadding.setTo(e.x,e.y,e.width,e.height),e;var t=this.currentPadding,n=Math.ceil(this.distance*this.scale);return t.left=-n,t.top=-n,t.right=n,t.bottom=n,t}})},43927(e,t,n){var r=n(83419),i=n(13045),a=n(73043);e.exports=new r({Extends:i,initialize:function(e,t){t||={};var n=e.scene;i.call(this,e,`FilterGradientMap`);var r=t.ramp;r||={colorStart:0,colorEnd:16777215},r instanceof a||(r=new a(n,r,!0)),this.ramp=r,this.dither=!!t.dither,this.color=[0,0,0,0],t.color&&(this.color[0]=t.color[0]||0,this.color[1]=t.color[1]||0,this.color[2]=t.color[2]||0,this.color[3]=t.color[3]||0),this.colorFactor=[.3,.6,.1,0],t.colorFactor&&(this.colorFactor[0]=t.colorFactor[0]||0,this.colorFactor[1]=t.colorFactor[1]||0,this.colorFactor[2]=t.colorFactor[2]||0,this.colorFactor[3]=t.colorFactor[3]||0),this.unpremultiply=t.unpremultiply===void 0||t.unpremultiply,this.alpha=t.alpha===void 0?1:t.alpha}})},84714(e,t,n){var r=n(83419),i=n(13045),a=n(37867),o=n(61340),s=n(79237);e.exports=new r({Extends:i,initialize:function(e,t){i.call(this,e,`FilterImageLight`),this.normalGlTexture,this.environmentGlTexture,this.viewMatrix=new a,this.modelRotation=t.modelRotation||0,this.modelRotationSource=t.modelRotationSource||null,this.bulge=t.bulge||0,this.colorFactor=t.colorFactor||[1,1,1],this._tempMatrix=new o,this._tempParentMatrix=new o,this.setEnvironmentMap(t.environmentMap||`__WHITE`),this.setNormalMap(t.normalMap||`__NORMAL`),t.viewMatrix&&this.viewMatrix.set(t.viewMatrix)},setEnvironmentMap:function(e){var t=e instanceof s?e:this.camera.scene.sys.textures.getFrame(e);return t&&(this.environmentGlTexture=t.glTexture),this},setNormalMap:function(e){var t=e instanceof s?e:this.camera.scene.sys.textures.getFrame(e);return t&&(this.normalGlTexture=t.glTexture),this},setNormalMapFromGameObject:function(e){var t=e.texture.dataSource[0];return t&&(this.normalGlTexture=t.glTexture),this},getModelRotation:function(){return this.modelRotationSource?typeof this.modelRotationSource==`function`?this.modelRotationSource():this.modelRotationSource.hasTransformComponent?this.modelRotationSource.getWorldTransformMatrix(this._tempMatrix,this._tempParentMatrix).rotationNormalized:this.modelRotation:this.modelRotation}})},51890(e,t,n){var r=n(83419),i=n(13045),a=n(40987);e.exports=new r({Extends:i,initialize:function(e,t){t===void 0&&(t={}),i.call(this,e,`FilterKey`),this.color=[1,1,1,1],t.color!==void 0&&this.setColor(t.color),t.alpha!==void 0&&this.setAlpha(t.alpha),this.isolate=!1,t.isolate!==void 0&&(this.isolate=t.isolate),this.threshold=.0625,t.threshold!==void 0&&(this.threshold=t.threshold),this.feather=0,t.feather!==void 0&&(this.feather=t.feather)},setAlpha:function(e){return this.color[3]=e,this},setColor:function(e){var t=this.color[3];if(typeof e==`number`){var n=a.IntegerToRGB(e);this.color=[n.r/255,n.g/255,n.b/255,t]}else if(typeof e==`string`){var r=a.HexStringToColor(e);this.color=[r.redGL,r.greenGL,r.blueGL,t]}else Array.isArray(e)?this.color=[e[0],e[1],e[2],t]:e instanceof a&&(this.color=[e.redGL,e.greenGL,e.blueGL,t]);return this}})},97797(e,t,n){var r=n(83419),i=n(45650),a=n(13045);e.exports=new r({Extends:a,initialize:function(e,t,n,r,i,o){t===void 0&&(t=`__WHITE`),n===void 0&&(n=!1),o===void 0&&(o=1),a.call(this,e,`FilterMask`),this.glTexture,this._dynamicTexture=null,this.maskGameObject=null,this.invert=n,this.autoUpdate=!0,this.needsUpdate=!1,this.viewTransform=i||`world`,this.viewCamera=r,this.scaleFactor=o,typeof t==`string`?this.setTexture(t):this.setGameObject(t)},updateDynamicTexture:function(e,t){var n=this.scaleFactor,r=e*n,a=t*n,o=this.maskGameObject;if(o){if(this._dynamicTexture)this._dynamicTexture.width!==r||this._dynamicTexture.height!==a?this._dynamicTexture.setSize(r,a,!1):this._dynamicTexture.clear();else{var s=this.camera.scene.sys.textures;this._dynamicTexture=s.addDynamicTexture(i(),r,a,!1)}this.glTexture=this._dynamicTexture.get().glTexture;var c=this.viewCamera||o.scene.renderer.currentViewCamera;this._dynamicTexture.capture(o,{transform:this.viewTransform,camera:c}),this._dynamicTexture.render(),this.needsUpdate=!1}},setGameObject:function(e){return this.maskGameObject=e,this.needsUpdate=!0,this},setTexture:function(e){var t=this.camera.scene.sys.textures.getFrame(e);return t&&(this.maskGameObject=null,this.glTexture=t.glTexture),this},destroy:function(){this._dynamicTexture&&this._dynamicTexture.destroy(),this.maskGameObject=null,this._dynamicTexture=null,a.prototype.destroy.call(this)}})},37911(e,t,n){var r=n(83419),i=n(13045),a=n(37867),o=n(25836);e.exports=new r({Extends:i,initialize:function(e,t){t||={},i.call(this,e,`FilterNormalTools`),this._rotation=0,this.viewMatrix=new a,this.setRotation(t.rotation||0),this.rotationSource=t.rotationSource||null,this.facingPower=t.facingPower||1,this.outputRatio=t.outputRatio||!1,this.ratioVector=new o(0,0,1),t.ratioVector&&this.ratioVector.set(t.ratioVector[0],t.ratioVector[1],t.ratioVector[2]),this.ratioRadius=t.ratioRadius||1},getRotation:function(){if(this.rotationSource){if(typeof this.rotationSource==`function`)return this.rotationSource();if(this.rotationSource.hasTransformComponent)return this.rotationSource.getWorldTransformMatrix().rotationNormalized}return this._rotation},setRotation:function(e){return this.viewMatrix.identity().rotateZ(e),this._rotation=e,this},updateRotation:function(){if(this.rotationSource){var e=this.getRotation();this.viewMatrix.identity().rotateZ(e),this._rotation=e}return this}})},6379(e,t,n){var r=n(83419),i=n(13045);e.exports=new r({Extends:i,initialize:function(e,t){t===void 0&&(t={}),i.call(this,e,`FilterPanoramaBlur`),this.radius=t.radius||1,this.samplesX=t.samplesX||32,this.samplesY=t.samplesY||16,this.power=t.power||1}})},2195(e,t,n){var r=n(83419),i=n(53427),a=n(13045),o=n(16762),s=new r({Extends:a,initialize:function(e){a.call(this,e,`FilterParallelFilters`),this.top=new i(e),this.bottom=new i(e),this.blend=new o(e)}});i.prototype.addParallelFilters=function(){return this.add(new s(this.camera))},e.exports=s},29861(e,t,n){var r=n(83419),i=n(13045);e.exports=new r({Extends:i,initialize:function(e,t){t===void 0&&(t=1),i.call(this,e,`FilterPixelate`),this.amount=t}})},14366(e,t,n){var r=n(83419),i=n(13045);e.exports=new r({Extends:i,initialize:function(e,t){t||={},i.call(this,e,`FilterQuantize`),this.steps=[8,8,8,8],t.steps&&(this.steps[0]=t.steps[0],this.steps[1]=t.steps[1],this.steps[2]=t.steps[2],this.steps[3]=t.steps[3]),this.gamma=[1,1,1,1],t.gamma&&(this.gamma[0]=t.gamma[0],this.gamma[1]=t.gamma[1],this.gamma[2]=t.gamma[2],this.gamma[3]=t.gamma[3]),this.offset=[0,0,0,0],t.offset&&(this.offset[0]=t.offset[0],this.offset[1]=t.offset[1],this.offset[2]=t.offset[2],this.offset[3]=t.offset[3]),this.mode=t.mode||0,this.dither=!!t.dither}})},63785(e,t,n){var r=n(83419),i=n(13045);e.exports=new r({Extends:i,initialize:function(e,t,n){n===void 0&&(n=null),i.call(this,e,`FilterSampler`),this.allowBaseDraw=!1,this.callback=t,this.region=n}})},62229(e,t,n){var r=n(83419),i=n(13045);e.exports=new r({Extends:i,initialize:function(e,t,n,r,a,o,s,c){t===void 0&&(t=0),n===void 0&&(n=0),r===void 0&&(r=.1),a===void 0&&(a=1),s===void 0&&(s=6),c===void 0&&(c=1),i.call(this,e,`FilterShadow`),this.x=t,this.y=n,this.decay=r,this.power=a,this.glcolor=[0,0,0,1],this.samples=s,this.intensity=c,o!==void 0&&(this.color=o)},color:{get:function(){var e=this.glcolor;return(e[0]*255<<16)+(e[1]*255<<8)+(e[2]*255|0)},set:function(e){var t=this.glcolor;t[0]=(e>>16&255)/255,t[1]=(e>>8&255)/255,t[2]=(e&255)/255}},getPadding:function(){var e=this.paddingOverride;if(e)return this.currentPadding.setTo(e.x,e.y,e.width,e.height),e;var t=this.camera,n=this.decay*this.intensity,r=Math.ceil(Math.abs(this.x)*t.width*n),i=Math.ceil(Math.abs(this.y)*t.height*n);return this.currentPadding.setTo(-r,-i,r*2,i*2),this.currentPadding}})},99534(e,t,n){var r=n(83419),i=n(13045);e.exports=new r({Extends:i,initialize:function(e,t,n,r){i.call(this,e,`FilterThreshold`),this.edge1=[.5,.5,.5,.5],this.edge2=[.5,.5,.5,.5],this.invert=[!1,!1,!1,!1],this.setEdge(t,n),this.setInvert(r)},setEdge:function(e,t){e===void 0&&(e=.5),typeof e==`number`&&(e=[e,e,e,e]),this.edge1[0]=e[0],this.edge1[1]=e[1],this.edge1[2]=e[2],this.edge1[3]=e[3],t===void 0&&(t=e),typeof t==`number`&&(t=[t,t,t,t]),this.edge2[0]=t[0],this.edge2[1]=t[1],this.edge2[2]=t[2],this.edge2[3]=t[3];for(var n=0;n<4;n++)if(this.edge1[n]>this.edge2[n]){var r=this.edge1[n];this.edge1[n]=this.edge2[n],this.edge2[n]=r}return this},setInvert:function(e){return e===void 0&&(e=!1),typeof e==`boolean`&&(e=[e,e,e,e]),this.invert[0]=e[0],this.invert[1]=e[1],this.invert[2]=e[2],this.invert[3]=e[3],this}})},20263(e,t,n){var r=n(83419),i=n(13045),a=n(40987);e.exports=new r({Extends:i,initialize:function(e,t,n,r,o,s,c){t===void 0&&(t=.5),n===void 0&&(n=.5),r===void 0&&(r=.5),o===void 0&&(o=.5),s===void 0&&(s=0),c===void 0&&(c=0),i.call(this,e,`FilterVignette`),this.x=t,this.y=n,this.radius=r,this.strength=o,this.color=new a,this.blendMode=c,this.setColor(s)},setColor:function(e){return typeof e==`number`?a.IntegerToColor(e,this.color):typeof e==`string`?a.HexStringToColor(e,this.color):e.setTo?this.color.setTo(e.red,e.green,e.blue,e.alpha):e?this.color.setTo(e.r||0,e.g||0,e.b||0,e.a||255):this.color.setTo(0,0,0,255),this}})},90002(e,t,n){var r=n(83419),i=n(13045),a=n(79237);e.exports=new r({Extends:i,initialize:function(e,t,n,r,a,o){t===void 0&&(t=.1),i.call(this,e,`FilterWipe`),this.progress=0,this.wipeWidth=t,this.direction=n||0,this.axis=r||0,this.reveal=a||0,this.wipeTexture=null,this.setTexture(o)},setWipeWidth:function(e){return e===void 0&&(e=.1),this.wipeWidth=e,this},setLeftToRight:function(){return this.direction=0,this.axis=0,this},setRightToLeft:function(){return this.direction=1,this.axis=0,this},setTopToBottom:function(){return this.direction=1,this.axis=1,this},setBottomToTop:function(){return this.direction=0,this.axis=1,this},setWipeEffect:function(){return this.reveal=0,this.progress=0,this},setRevealEffect:function(){return this.setTexture(),this.reveal=1,this.progress=0,this},setTexture:function(e){return e===void 0&&(e=`__DEFAULT`),e instanceof a?this.wipeTexture=e:this.wipeTexture=this.camera.scene.sys.textures.get(e)||this.camera.scene.sys.textures.get(`__DEFAULT`),this},setProgress:function(e){return this.progress=e,this}})},11889(e,t,n){e.exports={Controller:n(13045),Barrel:n(10189),Blend:n(16762),Blocky:n(37597),Blur:n(88344),Bokeh:n(47564),ColorMatrix:n(77011),CombineColorMatrix:n(95200),Displacement:n(16898),Glow:n(42652),GradientMap:n(43927),ImageLight:n(84714),Key:n(51890),Mask:n(97797),NormalTools:n(37911),PanoramaBlur:n(6379),ParallelFilters:n(2195),Pixelate:n(29861),Quantize:n(14366),Sampler:n(63785),Shadow:n(62229),Threshold:n(99534),Vignette:n(20263),Wipe:n(90002)}},25305(e,t,n){var r=n(10312),i=n(23568);e.exports=function(e,t,n){t.x=i(n,`x`,0),t.y=i(n,`y`,0),t.depth=i(n,`depth`,0),t.flipX=i(n,`flipX`,!1),t.flipY=i(n,`flipY`,!1);var a=i(n,`scale`,null);typeof a==`number`?t.setScale(a):a!==null&&(t.scaleX=i(a,`x`,1),t.scaleY=i(a,`y`,1));var o=i(n,`scrollFactor`,null);typeof o==`number`?t.setScrollFactor(o):o!==null&&(t.scrollFactorX=i(o,`x`,1),t.scrollFactorY=i(o,`y`,1)),t.rotation=i(n,`rotation`,0);var s=i(n,`angle`,null);s!==null&&(t.angle=s),t.alpha=i(n,`alpha`,1);var c=i(n,`origin`,null);if(typeof c==`number`)t.setOrigin(c);else if(c!==null){var l=i(c,`x`,.5),u=i(c,`y`,.5);t.setOrigin(l,u)}return t.blendMode=i(n,`blendMode`,r.NORMAL),t.visible=i(n,`visible`,!0),i(n,`add`,!0)&&e.sys.displayList.add(t),t.preUpdate&&e.sys.updateList.add(t),t}},13059(e,t,n){var r=n(23568);e.exports=function(e,t){var n=r(t,`anims`,null);if(n===null)return e;if(typeof n==`string`)e.anims.play(n);else if(typeof n==`object`){var i=e.anims,a=r(n,`key`,void 0);if(a){var o=r(n,`startFrame`,void 0),s=r(n,`delay`,0),c=r(n,`repeat`,0),l=r(n,`repeatDelay`,0),u=r(n,`yoyo`,!1),d=r(n,`play`,!1),f=r(n,`delayedPlay`,0),p={key:a,delay:s,repeat:c,repeatDelay:l,yoyo:u,startFrame:o};d?i.play(p):f>0?i.playAfterDelay(p,f):i.load(p)}}return e}},8050(e,t,n){var r=n(83419),i=n(73162),a=n(37277),o=n(51708),s=n(44594),c=n(19186),l=new r({Extends:i,initialize:function(e){i.call(this,e),this.sortChildrenFlag=!1,this.scene=e,this.systems=e.sys,this.events=e.sys.events,this.addCallback=this.addChildCallback,this.removeCallback=this.removeChildCallback,this.events.once(s.BOOT,this.boot,this),this.events.on(s.START,this.start,this)},boot:function(){this.events.once(s.DESTROY,this.destroy,this)},addChildCallback:function(e){e.displayList&&e.displayList!==this&&e.removeFromDisplayList(),e.parentContainer&&e.parentContainer.remove(e),e.displayList||(this.queueDepthSort(),e.displayList=this,e.emit(o.ADDED_TO_SCENE,e,this.scene),this.events.emit(s.ADDED_TO_SCENE,e,this.scene))},removeChildCallback:function(e){this.queueDepthSort(),e.displayList=null,e.emit(o.REMOVED_FROM_SCENE,e,this.scene),this.events.emit(s.REMOVED_FROM_SCENE,e,this.scene)},start:function(){this.events.once(s.SHUTDOWN,this.shutdown,this)},queueDepthSort:function(){this.sortChildrenFlag=!0},depthSort:function(){this.sortChildrenFlag&&=(c(this.list,this.sortByDepth),!1)},sortByDepth:function(e,t){return e._depth-t._depth},getChildren:function(){return this.list},shutdown:function(){for(var e=this.list,t=e.length;t--;)e[t]&&e[t].destroy(!0);e.length=0,this.events.off(s.SHUTDOWN,this.shutdown,this)},destroy:function(){this.shutdown(),this.events.off(s.START,this.start,this),this.scene=null,this.systems=null,this.events=null}});a.register(`DisplayList`,l,`displayList`),e.exports=l},95643(e,t,n){var r=n(83419),i=n(31401),a=n(53774),o=n(45893),s=n(50792),c=n(51708),l=n(44594),u=new r({Extends:s,Mixins:[i.Filters,i.RenderSteps],initialize:function(e,t){s.call(this),this.scene=e,this.displayList=null,this.type=t,this.state=0,this.parentContainer=null,this.name=``,this.active=!0,this.tabIndex=-1,this.data=null,this.renderFlags=15,this.cameraFilter=0,this.vertexRoundMode=`safeAuto`,this.input=null,this.body=null,this.ignoreDestroy=!1,this.isDestroyed=!1,this.addRenderStep&&this.addRenderStep(this.renderWebGL),this.on(c.ADDED_TO_SCENE,this.addedToScene,this),this.on(c.REMOVED_FROM_SCENE,this.removedFromScene,this),e.sys.queueDepthSort()},setActive:function(e){return this.active=e,this},setName:function(e){return this.name=e,this},setState:function(e){return this.state=e,this},setDataEnabled:function(){return this.data||=new o(this),this},setData:function(e,t){return this.data||=new o(this),this.data.set(e,t),this},incData:function(e,t){return this.data||=new o(this),this.data.inc(e,t),this},toggleData:function(e){return this.data||=new o(this),this.data.toggle(e),this},getData:function(e){return this.data||=new o(this),this.data.get(e)},setInteractive:function(e,t,n){return this.scene.sys.input.enable(this,e,t,n),this},disableInteractive:function(e){return e===void 0&&(e=!1),this.scene.sys.input.disable(this,e),this},removeInteractive:function(e){return e===void 0&&(e=!1),this.scene.sys.input.clear(this),e&&this.scene.sys.input.resetCursor(),this.input=void 0,this},addedToScene:function(){},removedFromScene:function(){},update:function(){},toJSON:function(){return a(this)},willRender:function(e){return!(!(!(this.displayList&&this.displayList.active)||this.displayList.willRender(e))||u.RENDER_MASK!==this.renderFlags||this.cameraFilter!==0&&this.cameraFilter&e.id)},willRoundVertices:function(e,t){switch(this.vertexRoundMode){case`safe`:return t;case`safeAuto`:return t&&e.roundPixels;case`full`:return!0;case`fullAuto`:return e.roundPixels;default:return!1}},setVertexRoundMode:function(e){return this.vertexRoundMode=e,this},getIndexList:function(){for(var e=this,t=this.parentContainer,n=[];t&&(n.unshift(t.getIndex(e)),e=t,t.parentContainer);)t=t.parentContainer;return this.displayList?n.unshift(this.displayList.getIndex(e)):n.unshift(this.scene.sys.displayList.getIndex(e)),n},addToDisplayList:function(e){return e===void 0&&(e=this.scene.sys.displayList),this.displayList&&this.displayList!==e&&this.removeFromDisplayList(),e.exists(this)||(this.displayList=e,e.add(this,!0),e.queueDepthSort(),this.emit(c.ADDED_TO_SCENE,this,this.scene),e.events.emit(l.ADDED_TO_SCENE,this,this.scene)),this},addToUpdateList:function(){return this.scene&&this.preUpdate&&this.scene.sys.updateList.add(this),this},removeFromDisplayList:function(){var e=this.displayList||this.scene.sys.displayList;return e&&e.exists(this)&&(e.remove(this,!0),e.queueDepthSort(),this.displayList=null,this.emit(c.REMOVED_FROM_SCENE,this,this.scene),e.events.emit(l.REMOVED_FROM_SCENE,this,this.scene)),this},removeFromUpdateList:function(){return this.scene&&this.preUpdate&&this.scene.sys.updateList.remove(this),this},getDisplayList:function(){var e=null;return this.parentContainer?e=this.parentContainer.list:this.displayList&&(e=this.displayList.list),e},destroy:function(e){!this.scene||this.ignoreDestroy||(e===void 0&&(e=!1),this.isDestroyed=!0,this.preDestroy&&this.preDestroy.call(this),this.emit(c.DESTROY,this,e),this.removeAllListeners(),this.removeFromDisplayList(),this.removeFromUpdateList(),this.input&&=(this.scene.sys.input.clear(this),void 0),this.data&&=(this.data.destroy(),void 0),this.body&&=(this.body.destroy(),void 0),this.filterCamera&&=(this.filterCamera.destroy(),void 0),this.active=!1,this.visible=!1,this.scene=void 0,this.parentContainer=void 0)}});u.RENDER_MASK=15,e.exports=u},44603(e,t,n){var r=n(83419),i=n(37277),a=n(44594),o=new r({initialize:function(e){this.scene=e,this.systems=e.sys,this.events=e.sys.events,this.displayList,this.updateList,this.events.once(a.BOOT,this.boot,this),this.events.on(a.START,this.start,this)},boot:function(){this.displayList=this.systems.displayList,this.updateList=this.systems.updateList,this.events.once(a.DESTROY,this.destroy,this)},start:function(){this.events.once(a.SHUTDOWN,this.shutdown,this)},shutdown:function(){this.events.off(a.SHUTDOWN,this.shutdown,this)},destroy:function(){this.shutdown(),this.events.off(a.START,this.start,this),this.scene=null,this.systems=null,this.events=null,this.displayList=null,this.updateList=null}});o.register=function(e,t){o.prototype.hasOwnProperty(e)||(o.prototype[e]=t)},o.remove=function(e){o.prototype.hasOwnProperty(e)&&delete o.prototype[e]},i.register(`GameObjectCreator`,o,`make`),e.exports=o},39429(e,t,n){var r=n(83419),i=n(37277),a=n(44594),o=new r({initialize:function(e){this.scene=e,this.systems=e.sys,this.events=e.sys.events,this.displayList,this.updateList,this.events.once(a.BOOT,this.boot,this),this.events.on(a.START,this.start,this)},boot:function(){this.displayList=this.systems.displayList,this.updateList=this.systems.updateList,this.events.once(a.DESTROY,this.destroy,this)},start:function(){this.events.once(a.SHUTDOWN,this.shutdown,this)},existing:function(e){return(e.renderCanvas||e.renderWebGL)&&this.displayList.add(e),e.preUpdate&&this.updateList.add(e),e},shutdown:function(){this.events.off(a.SHUTDOWN,this.shutdown,this)},destroy:function(){this.shutdown(),this.events.off(a.START,this.start,this),this.scene=null,this.systems=null,this.events=null,this.displayList=null,this.updateList=null}});o.register=function(e,t){o.prototype.hasOwnProperty(e)||(o.prototype[e]=t)},o.remove=function(e){o.prototype.hasOwnProperty(e)&&delete o.prototype[e]},i.register(`GameObjectFactory`,o,`add`),e.exports=o},91296(e,t,n){var r=n(61340),i=new r,a=new r,o=new r,s=new r,c={camera:i,sprite:a,calc:o,cameraExternal:s};e.exports=function(e,t,n,r){return r?s.loadIdentity():s.copyFrom(t.matrixExternal),i.copyWithScrollFactorFrom(r?t.matrix:t.matrixCombined,t.scrollX,t.scrollY,e.scrollFactorX,e.scrollFactorY),o.copyFrom(i),n&&o.multiply(n),a.applyITRS(e.x,e.y,e.rotation,e.scaleX,e.scaleY),o.multiply(a),c}},45027(e,t,n){var r=n(83419),i=n(25774),a=n(37277),o=n(44594),s=new r({Extends:i,initialize:function(e){i.call(this),this.checkQueue=!0,this.scene=e,this.systems=e.sys,e.sys.events.once(o.BOOT,this.boot,this),e.sys.events.on(o.START,this.start,this)},boot:function(){this.systems.events.once(o.DESTROY,this.destroy,this)},start:function(){var e=this.systems.events;e.on(o.PRE_UPDATE,this.update,this),e.on(o.UPDATE,this.sceneUpdate,this),e.once(o.SHUTDOWN,this.shutdown,this)},sceneUpdate:function(e,t){for(var n=this._active,r=n.length,i=0;i<r;i++){var a=n[i];a.active&&a.preUpdate.call(a,e,t)}},shutdown:function(){for(var e=this._active.length;e--;)this._active[e].destroy(!0);for(e=this._pending.length;e--;)this._pending[e].destroy(!0);for(e=this._destroy.length;e--;)this._destroy[e].destroy(!0);this._toProcess=0,this._pending=[],this._active=[],this._destroy=[],this.removeAllListeners();var t=this.systems.events;t.off(o.PRE_UPDATE,this.update,this),t.off(o.UPDATE,this.sceneUpdate,this),t.off(o.SHUTDOWN,this.shutdown,this)},destroy:function(){this.shutdown(),this.systems.events.off(o.START,this.start,this),this.scene=null,this.systems=null}});a.register(`UpdateList`,s,`updateList`),e.exports=s},3217(e){var t={frame:null,uvSource:null},n={quad:new Float32Array(8)};e.exports=function(e,r,i,a,o,s,c,l,u){t.frame=i.frame,t.uvSource=o;var d=a.x-i.displayOriginX+s,f=a.y-i.displayOriginY+c,p=d+a.w,m=f+a.h,h=l.a,g=l.b,_=l.c,v=l.d,y=l.e,b=l.f,x=d*h+f*_+y,S=d*g+f*v+b,C=d*h+m*_+y,w=d*g+m*v+b,T=p*h+m*_+y,E=p*g+m*v+b,D=p*h+f*_+y,O=p*g+f*v+b;n.quad[0]=x,n.quad[1]=S,n.quad[2]=C,n.quad[3]=w,n.quad[4]=T,n.quad[5]=E,n.quad[6]=D,n.quad[7]=O,r.run(e,i,void 0,0,t,n,u)}},53048(e){e.exports=function(e,t,n,r){if(n===void 0&&(n=!1),r===void 0)return r={local:{x:0,y:0,width:0,height:0},global:{x:0,y:0,width:0,height:0},lines:{shortest:0,longest:0,lengths:null,height:0},wrappedText:``,words:[],characters:[],scaleX:0,scaleY:0},r;var i=e.text,a=i.length,o=e.maxWidth,s=e.wordWrapCharCode,c=Number.MAX_VALUE,l=Number.MAX_VALUE,u=0,d=0,f=e.fontData.chars,p=e.fontData.lineHeight,m=e.letterSpacing,h=e.lineSpacing,g=0,_=0,v=0,y=null,b=e._align,x=0,S=0,C=e.fontSize/e.fontData.size,w=C*e.scaleX,T=C*e.scaleY,E=null,D=0,O=[],k=Number.MAX_VALUE,A=0,j=0,M=0,N,P,F,I=[],L=[],R=null,z=function(e,t){for(var n=0,r=0;r<e.length;r++){var i=e.charCodeAt(r),a=t.chars[i];a&&(n+=a.xAdvance)}return n*w};if(o>0){F=i.split(`
`);var ee=[];for(N=0;N<F.length;N++){var te=F[N],ne=``,B=``,re=``,ie=``;for(P=0;P<te.length;P++)v=te.charCodeAt(P),ne+=te[P],(v===s||P===te.length-1)&&(ie=re+ne,z(ie,e.fontData)<=o?re=ie:(B=B.slice(0,-1),B+=(B?`
`:``)+re,re=ne),ne=``);B=B.slice(0,-1),B+=(B?`
`:``)+re,ee.push(B)}i=ee.join(`
`),r.wrappedText=i,a=i.length}var ae=0;for(N=0;N<a;N++){if(v=i.charCodeAt(N),v===10){R!==null&&(I.push({word:R.word,i:R.i,x:R.x*w,y:R.y*T,w:R.w*w,h:R.h*T}),R=null),E=null,O[j]=M,M>A&&(A=M),M<k&&(k=M),j++,M=0,g=0,_=(p+h)*j;continue}if(y=f[v],y){if(x=g,S=_,E!==null){var V=y.kerning[D];x+=V===void 0?0:V}c>x&&(c=x),l>S&&(l=S);var oe=x+y.xAdvance,se=S+p;u<oe&&(u=oe),d<se&&(d=se);var ce=y.xOffset+y.xAdvance+(V===void 0?0:V);v===s?R!==null&&(I.push({word:R.word,i:R.i,x:R.x*w,y:R.y*T,w:R.w*w,h:R.h*T}),R=null):(R===null&&(R={word:``,i:ae,x:g,y:_,w:0,h:p}),R.word=R.word.concat(i[N]),R.w+=ce),L.push({i:ae,idx:N,char:i[N],code:v,x:(y.xOffset+x)*C,y:(y.yOffset+_)*C,w:y.width*C,h:y.height*C,t:_*C,r:oe*C,b:p*C,line:j,glyph:y}),g+=y.xAdvance+m+(V===void 0?0:V),E=y,D=v,M=oe*C,ae++}}if(R!==null&&I.push({word:R.word,i:R.i,x:R.x*w,y:R.y*T,w:R.w*w,h:R.h*T}),O[j]=M,M>A&&(A=M),M<k&&(k=M),b>0)for(var le=0;le<L.length;le++){var H=L[le];if(b===1){var ue=(A-O[H.line])/2;H.x+=ue,H.r+=ue}else if(b===2){var U=A-O[H.line];H.x+=U,H.r+=U}}var de=r.local,fe=r.global;return F=r.lines,de.x=c*C,de.y=l*C,de.width=u*C,de.height=d*C,fe.x=e.x-e._displayOriginX+c*w,fe.y=e.y-e._displayOriginY+l*T,fe.width=u*w,fe.height=d*T,F.shortest=k,F.longest=A,F.lengths=O,t&&(de.x=Math.ceil(de.x),de.y=Math.ceil(de.y),de.width=Math.ceil(de.width),de.height=Math.ceil(de.height),fe.x=Math.ceil(fe.x),fe.y=Math.ceil(fe.y),fe.width=Math.ceil(fe.width),fe.height=Math.ceil(fe.height),F.shortest=Math.ceil(k),F.longest=Math.ceil(A)),n&&(e._displayOriginX=e.originX*de.width,e._displayOriginY=e.originY*de.height,fe.x=e.x-e._displayOriginX*e.scaleX,fe.y=e.y-e._displayOriginY*e.scaleY,t&&(fe.x=Math.ceil(fe.x),fe.y=Math.ceil(fe.y))),r.words=I,r.characters=L,r.lines.height=p,r.scale=C,r.scaleX=e.scaleX,r.scaleY=e.scaleY,r}},61327(e,t,n){var r=n(21859);e.exports=function(e,t,n,i,a,o,s){var c=e.sys.textures.get(n),l=c.get(i),u=e.sys.cache.xml.get(a);if(l&&u){var d=r(u,l,o,s,c);return e.sys.cache.bitmapFont.add(t,{data:d,texture:n,frame:i,fromAtlas:!0}),!0}else return!1}},6925(e,t,n){var r=n(35154);e.exports=function(e,t){var n=t.width,i=t.height,a=Math.floor(n/2),o=Math.floor(i/2),s=r(t,`chars`,``);if(s!==``){var c=r(t,`image`,``),l=e.sys.textures.getFrame(c),u=l.cutX,d=l.cutY,f=l.source.width,p=l.source.height,m=r(t,`offset.x`,0),h=r(t,`offset.y`,0),g=r(t,`spacing.x`,0),_=r(t,`spacing.y`,0),v=r(t,`lineSpacing`,0),y=r(t,`charsPerRow`,null);y===null&&(y=f/n,y>s.length&&(y=s.length));for(var b=m,x=h,S={retroFont:!0,font:c,size:n,lineHeight:i+v,chars:{}},C=0,w=0;w<s.length;w++){var T=s.charCodeAt(w),E=(u+b)/f,D=1-(d+x)/p,O=(u+b+n)/f,k=1-(d+x+i)/p;S.chars[T]={x:b,y:x,width:n,height:i,centerX:a,centerY:o,xOffset:0,yOffset:0,xAdvance:n,data:{},kerning:{},u0:E,v0:D,u1:O,v1:k},C++,C===y?(C=0,b=m,x+=i+_):b+=n+g}return{data:S,frame:null,texture:c}}}},21859(e){function t(e,t){return parseInt(e.getAttribute(t),10)}e.exports=function(e,n,r,i,a){r===void 0&&(r=0),i===void 0&&(i=0);var o=n.cutX,s=n.cutY,c=n.source.width,l=n.source.height,u=n.sourceIndex,d={},f=e.getElementsByTagName(`info`)[0],p=e.getElementsByTagName(`common`)[0];d.font=f.getAttribute(`face`),d.size=t(f,`size`),d.lineHeight=t(p,`lineHeight`)+i,d.chars={};var m=e.getElementsByTagName(`char`),h=n!==void 0&&n.trimmed;if(h)var g=n.data.spriteSourceSize.x,_=n.data.spriteSourceSize.y;for(var v=0;v<m.length;v++){var y=m[v],b=t(y,`id`),x=String.fromCharCode(b),S=t(y,`x`),C=t(y,`y`),w=t(y,`width`),T=t(y,`height`);h&&(S-=g,C-=_);var E=(o+S)/c,D=1-(s+C)/l,O=(o+S+w)/c,k=1-(s+C+T)/l;d.chars[b]={x:S,y:C,width:w,height:T,centerX:Math.floor(w/2),centerY:Math.floor(T/2),xOffset:t(y,`xoffset`),yOffset:t(y,`yoffset`),xAdvance:t(y,`xadvance`)+r,data:{},kerning:{},u0:E,v0:D,u1:O,v1:k},a&&w!==0&&T!==0&&a.add(x,u,S+n.data.cut.x,C+n.data.cut.y,w,T)}var A=e.getElementsByTagName(`kerning`);for(v=0;v<A.length;v++){var j=A[v],M=t(j,`first`),N=t(j,`second`),P=t(j,`amount`);d.chars[N].kerning[M]=P}return d}},196(e,t,n){var r=n(87662),i=n(79291),a={Parse:n(6925)};a=i(!1,a,r),e.exports=a},87662(e){e.exports={TEXT_SET1:` !"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_\`abcdefghijklmnopqrstuvwxyz{|}~`,TEXT_SET2:` !"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ`,TEXT_SET3:`ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 `,TEXT_SET4:`ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789`,TEXT_SET5:`ABCDEFGHIJKLMNOPQRSTUVWXYZ.,/() '!?-*:0123456789`,TEXT_SET6:`ABCDEFGHIJKLMNOPQRSTUVWXYZ!?:;0123456789"(),-.' `,TEXT_SET7:`AGMSY+:4BHNTZ!;5CIOU.?06DJPV,(17EKQW")28FLRX-'39`,TEXT_SET8:`0123456789 .ABCDEFGHIJKLMNOPQRSTUVWXYZ`,TEXT_SET9:`ABCDEFGHIJKLMNOPQRSTUVWXYZ()-0123456789.:,'"?!`,TEXT_SET10:`ABCDEFGHIJKLMNOPQRSTUVWXYZ`,TEXT_SET11:`ABCDEFGHIJKLMNOPQRSTUVWXYZ.,"-+!?()':;0123456789`}},2638(e,t,n){var r=n(22186);e.exports=new(n(83419))({Extends:r,Mixins:[n(12310)],initialize:function(e,t,n,i,a,o,s){r.call(this,e,t,n,i,a,o,s),this.type=`DynamicBitmapText`,this.scrollX=0,this.scrollY=0,this.cropWidth=0,this.cropHeight=0,this.displayCallback,this.callbackData={parent:this,color:0,tint:{topLeft:0,topRight:0,bottomLeft:0,bottomRight:0},index:0,charCode:0,x:0,y:0,scale:0,rotation:0,data:0}},setSize:function(e,t){return this.cropWidth=e,this.cropHeight=t,this},setDisplayCallback:function(e){return this.displayCallback=e,this},setScrollX:function(e){return this.scrollX=e,this},setScrollY:function(e){return this.scrollY=e,this}})},86741(e,t,n){var r=n(20926);e.exports=function(e,t,n,i){var a=t._text,o=a.length,s=e.currentContext;if(!(o===0||!r(e,s,t,n,i))){n.addToRenderList(t);var c=t.fromAtlas?t.frame:t.texture.frames.__BASE,l=t.displayCallback,u=t.callbackData,d=t.fontData.chars,f=t.fontData.lineHeight,p=t._letterSpacing,m=0,h=0,g=0,_=null,v=0,y=0,b=0,x=0,S=0,C=0,w=null,T=0,E=t.frame.source.image,D=c.cutX,O=c.cutY,k=0,A=0,j=t._fontSize/t.fontData.size,M=t._align,N=0,P=0;t.getTextBounds(!1);var F=t._bounds.lines;M===1?P=(F.longest-F.lengths[0])/2:M===2&&(P=F.longest-F.lengths[0]),s.translate(-t.displayOriginX,-t.displayOriginY);var I=n.roundPixels;t.cropWidth>0&&t.cropHeight>0&&(s.beginPath(),s.rect(0,0,t.cropWidth,t.cropHeight),s.clip());for(var L=0;L<o;L++){if(A=j,k=0,g=a.charCodeAt(L),g===10){N++,M===1?P=(F.longest-F.lengths[N])/2:M===2&&(P=F.longest-F.lengths[N]),m=0,h+=f,w=null;continue}if(_=d[g],_){if(v=D+_.x,y=O+_.y,b=_.width,x=_.height,S=_.xOffset+m-t.scrollX,C=_.yOffset+h-t.scrollY,w!==null){var R=_.kerning[T];S+=R===void 0?0:R}if(l){u.index=L,u.charCode=g,u.x=S,u.y=C,u.scale=A,u.rotation=k,u.data=_.data;var z=l(u);S=z.x,C=z.y,A=z.scale,k=z.rotation}S*=A,C*=A,S+=P,m+=_.xAdvance+p+(R===void 0?0:R),w=_,T=g,!(b===0||x===0||g===32)&&(I&&(S=Math.round(S),C=Math.round(C)),s.save(),s.translate(S,C),s.rotate(k),s.scale(A,A),s.drawImage(E,v,y,b,x,0,0,b,x),s.restore())}}s.restore()}}},11164(e,t,n){var r=n(2638),i=n(25305),a=n(44603),o=n(23568);a.register(`dynamicBitmapText`,function(e,t){e===void 0&&(e={});var n=o(e,`font`,``),a=o(e,`text`,``),s=o(e,`size`,!1),c=new r(this.scene,0,0,n,a,s);return t!==void 0&&(e.add=t),i(this.scene,c,e),c})},72566(e,t,n){var r=n(2638);n(39429).register(`dynamicBitmapText`,function(e,t,n,i,a){return this.displayList.add(new r(this.scene,e,t,n,i,a))})},12310(e,t,n){var r=n(29747),i=r,a=r;i=n(73482),a=n(86741),e.exports={renderWebGL:i,renderCanvas:a}},73482(e,t,n){var r=n(91296),i=n(84322),a=n(61340),o=n(70554),s=new a,c={frame:null,uvSource:null},l={tintEffect:i.MULTIPLY,tintTopLeft:0,tintTopRight:0,tintBottomLeft:0,tintBottomRight:0};e.exports=function(e,t,n,a){var u=t.text,d=u.length;if(d!==0){var f=n.camera;f.addToRenderList(t);var p=n,m=t.customRenderNodes.Submitter||t.defaultRenderNodes.Submitter,h=r(t,f,a,!n.useCanvas),g=h.sprite,_=h.calc,v=s,y=t.cropWidth>0||t.cropHeight>0;y&&(p=n.getClone(),p.setScissorEnable(!0),p.setScissorBox(_.tx,_.ty,t.cropWidth*_.scaleX,t.cropHeight*_.scaleY),p.use()),c.frame=t.frame;var b=i.MULTIPLY,x=o.getTintAppendFloatAlpha(t.tintTopLeft,t._alphaTL),S=o.getTintAppendFloatAlpha(t.tintTopRight,t._alphaTR),C=o.getTintAppendFloatAlpha(t.tintBottomLeft,t._alphaBL),w=o.getTintAppendFloatAlpha(t.tintBottomRight,t._alphaBR),T=0,E=0,D=0,O=0,k=t.letterSpacing,A,j=0,M=0,N,P=t.scrollX,F=t.scrollY,I=t.fontData,L=I.chars,R=I.lineHeight,z=t.fontSize/I.size,ee=0,te=t._align,ne=0,B=0,re=t.getTextBounds(!1);t.maxWidth>0&&(u=re.wrappedText,d=u.length);var ie=t._bounds.lines;te===1?B=(ie.longest-ie.lengths[0])/2:te===2&&(B=ie.longest-ie.lengths[0]);for(var ae=t.displayCallback,V=t.callbackData,oe=0;oe<d;oe++){if(D=u.charCodeAt(oe),D===10){ne++,te===1?B=(ie.longest-ie.lengths[ne])/2:te===2&&(B=ie.longest-ie.lengths[ne]),T=0,E+=R,N=null;continue}if(A=L[D],A){c.uvSource=A,j=A.width,M=A.height;var se=A.xOffset+T-P,ce=A.yOffset+E-F;if(N!==null){var le=A.kerning[O]||0;se+=le,T+=le}if(T+=A.xAdvance+k,N=A,O=D,!(j===0||M===0||D===32)){if(z=t.fontSize/t.fontData.size,ee=0,ae){V.color=0,V.tintMode=b,V.tint.topLeft=x,V.tint.topRight=S,V.tint.bottomLeft=C,V.tint.bottomRight=w,V.index=oe,V.charCode=D,V.x=se,V.y=ce,V.scale=z,V.rotation=ee,V.data=A.data;var H=ae(V);se=H.x,ce=H.y,z=H.scale,ee=H.rotation,H.color?(x=H.color,S=H.color,C=H.color,w=H.color):(x=H.tint.topLeft,S=H.tint.topRight,C=H.tint.bottomLeft,w=H.tint.bottomRight),b=H.tintMode,x=o.getTintAppendFloatAlpha(x,t._alphaTL),S=o.getTintAppendFloatAlpha(S,t._alphaTR),C=o.getTintAppendFloatAlpha(C,t._alphaBL),w=o.getTintAppendFloatAlpha(w,t._alphaBR)}l.tintEffect=b,l.tintTopLeft=x,l.tintTopRight=S,l.tintBottomLeft=C,l.tintBottomRight=w,se*=z,ce*=z,se-=t.displayOriginX,ce-=t.displayOriginY,se+=B,v.applyITRS(se,ce,ee,z,z),_.multiply(v,g);var ue=j,U=M,de=g.e,fe=g.f,pe=U*g.c+g.e,me=U*g.d+g.f,he=ue*g.a+U*g.c+g.e,ge=ue*g.b+U*g.d+g.f,_e=ue*g.a+g.e,ve=ue*g.b+g.f;m.run(p,t,void 0,0,c,{quad:[de,fe,pe,me,he,ge,_e,ve]},l)}}}y&&n.use()}}},22186(e,t,n){var r=n(70972),i=n(83419),a=n(45319),o=n(31401),s=n(95643),c=n(53048),l=n(61327),u=n(21859),d=n(87841),f=n(18658),p=n(84322),m=new i({Extends:s,Mixins:[o.Alpha,o.BlendMode,o.Depth,o.GetBounds,o.Lighting,o.Mask,o.Origin,o.RenderNodes,o.ScrollFactor,o.Texture,o.Tint,o.Transform,o.Visible,f],initialize:function(e,t,n,r,i,a,o){i===void 0&&(i=``),o===void 0&&(o=0),s.call(this,e,`BitmapText`),this.font=r;var l=this.scene.sys.cache.bitmapFont.get(r);l||console.warn(`Invalid BitmapText key: `+r),this.fontData=l.data,this._text=``,this._fontSize=a||this.fontData.size,this._letterSpacing=0,this._lineSpacing=0,this._align=o,this._bounds=c(),this._dirty=!0,this._maxWidth=0,this.wordWrapCharCode=32,this.charColors=[],this.dropShadowX=0,this.dropShadowY=0,this.dropShadowColor=0,this.dropShadowAlpha=.5,this.fromAtlas=l.fromAtlas,this.setTexture(l.texture,l.frame),this.setPosition(t,n),this.setOrigin(0,0),this.initRenderNodes(this._defaultRenderNodesMap),this.setText(i)},_defaultRenderNodesMap:{get:function(){return r}},setLeftAlign:function(){return this._align=m.ALIGN_LEFT,this._dirty=!0,this},setCenterAlign:function(){return this._align=m.ALIGN_CENTER,this._dirty=!0,this},setRightAlign:function(){return this._align=m.ALIGN_RIGHT,this._dirty=!0,this},setFontSize:function(e){return this._fontSize=e,this._dirty=!0,this},setLetterSpacing:function(e){return e===void 0&&(e=0),this._letterSpacing=e,this._dirty=!0,this},setLineSpacing:function(e){return e===void 0&&(e=0),this.lineSpacing=e,this},setText:function(e){return!e&&e!==0&&(e=``),Array.isArray(e)&&(e=e.join(`
`)),e!==this.text&&(this._text=e.toString(),this._dirty=!0,this.updateDisplayOrigin()),this},setDropShadow:function(e,t,n,r){return e===void 0&&(e=0),t===void 0&&(t=0),n===void 0&&(n=0),r===void 0&&(r=.5),this.dropShadowX=e,this.dropShadowY=t,this.dropShadowColor=n,this.dropShadowAlpha=r,this},setCharacterTint:function(e,t,n,r,i,o,s){e===void 0&&(e=0),t===void 0&&(t=1),n===void 0&&(n=p.MULTIPLY),r===void 0&&(r=-1),i===void 0&&(i=r,o=r,s=r);var c=this.text.length;t===-1&&(t=c),e<0&&(e=c+e),e=a(e,0,c-1);for(var l=a(e+t,e,c),u=this.charColors,d=e;d<l;d++){var f=u[d];if(r===-1)u[d]=null;else{var m=n;f?(f.tintEffect=m,f.tintTL=r,f.tintTR=i,f.tintBL=o,f.tintBR=s):u[d]={tintEffect:m,tintTL:r,tintTR:i,tintBL:o,tintBR:s}}}return this},setWordTint:function(e,t,n,r,i,a,o){t===void 0&&(t=1);for(var s=this.getTextBounds().words,c=typeof e==`number`,l=0,u=0;u<s.length;u++){var d=s[u];if((c&&u===e||!c&&d.word===e)&&(this.setCharacterTint(d.i,d.word.length,n,r,i,a,o),l++,l===t))return this}return this},getTextBounds:function(e){var t=this._bounds;return(this._dirty||e||this.scaleX!==t.scaleX||this.scaleY!==t.scaleY)&&(c(this,e,!0,t),this._dirty=!1),t},getCharacterAt:function(e,t,n){for(var r=this.getLocalPoint(e,t,null,n),i=this.getTextBounds().characters,a=new d,o=0;o<i.length;o++){var s=i[o];if(a.setTo(s.x,s.t,s.r-s.x,s.b),a.contains(r.x,r.y))return s}return null},updateDisplayOrigin:function(){return this._dirty=!0,this.getTextBounds(!1),this},setFont:function(e,t,n){t===void 0&&(t=this._fontSize),n===void 0&&(n=this._align);var r=this.scene.sys.cache.bitmapFont.get(e);return r&&(this.font=e,this.fontData=r.data,this._fontSize=t,this._align=n,this.fromAtlas=r.fromAtlas===!0,this.setTexture(r.texture,r.frame),c(this,!1,!0,this._bounds)),this},setMaxWidth:function(e,t){return this._maxWidth=e,this._dirty=!0,t!==void 0&&(this.wordWrapCharCode=t),this},setDisplaySize:function(e,t){this.setScale(1,1),this.getTextBounds(!1);var n=e/this.width,r=t/this.height;return this.setScale(n,r),this},align:{set:function(e){this._align=e,this._dirty=!0},get:function(){return this._align}},text:{set:function(e){this.setText(e)},get:function(){return this._text}},fontSize:{set:function(e){this._fontSize=e,this._dirty=!0},get:function(){return this._fontSize}},letterSpacing:{set:function(e){this._letterSpacing=e,this._dirty=!0},get:function(){return this._letterSpacing}},lineSpacing:{set:function(e){this._lineSpacing=e,this._dirty=!0},get:function(){return this._lineSpacing}},maxWidth:{set:function(e){this._maxWidth=e,this._dirty=!0},get:function(){return this._maxWidth}},width:{get:function(){return this.getTextBounds(!1),this._bounds.global.width}},height:{get:function(){return this.getTextBounds(!1),this._bounds.global.height}},displayWidth:{set:function(e){this.setScaleX(1),this.getTextBounds(!1);var t=e/this.width;this.setScaleX(t)},get:function(){return this.width}},displayHeight:{set:function(e){this.setScaleY(1),this.getTextBounds(!1);var t=e/this.height;this.setScaleY(t)},get:function(){return this.height}},toJSON:function(){var e=o.ToJSON(this);return e.data={font:this.font,text:this.text,fontSize:this.fontSize,letterSpacing:this.letterSpacing,lineSpacing:this.lineSpacing,align:this.align},e},preDestroy:function(){this.charColors.length=0,this._bounds=null,this.fontData=null}});m.ALIGN_LEFT=0,m.ALIGN_CENTER=1,m.ALIGN_RIGHT=2,m.ParseFromAtlas=l,m.ParseXMLBitmapFont=u,e.exports=m},37289(e,t,n){var r=n(20926);e.exports=function(e,t,n,i){var a=t._text,o=a.length,s=e.currentContext;if(!(o===0||!r(e,s,t,n,i))){n.addToRenderList(t);var c=t.fromAtlas?t.frame:t.texture.frames.__BASE,l=t.fontData.chars,u=t.fontData.lineHeight,d=t._letterSpacing,f=t._lineSpacing,p=0,m=0,h=0,g=null,_=0,v=0,y=0,b=0,x=0,S=0,C=null,w=0,T=c.source.image,E=c.cutX,D=c.cutY,O=t._fontSize/t.fontData.size,k=t._align,A=0,j=0,M=t.getTextBounds(!1);t.maxWidth>0&&(a=M.wrappedText,o=a.length);var N=t._bounds.lines;k===1?j=(N.longest-N.lengths[0])/2:k===2&&(j=N.longest-N.lengths[0]),s.translate(-t.displayOriginX,-t.displayOriginY);for(var P=n.roundPixels,F=0;F<o;F++){if(h=a.charCodeAt(F),h===10){A++,k===1?j=(N.longest-N.lengths[A])/2:k===2&&(j=N.longest-N.lengths[A]),p=0,m+=u+f,C=null;continue}if(g=l[h],g){if(_=E+g.x,v=D+g.y,y=g.width,b=g.height,x=g.xOffset+p,S=g.yOffset+m,C!==null){var I=g.kerning[w];x+=I===void 0?0:I}x*=O,S*=O,x+=j,p+=g.xAdvance+d+(I===void 0?0:I),C=g,w=h,!(y===0||b===0||h===32)&&(P&&(x=Math.round(x),S=Math.round(S)),s.save(),s.translate(x,S),s.scale(O,O),s.drawImage(T,_,v,y,b,0,0,y,b),s.restore())}}s.restore()}}},57336(e,t,n){var r=n(22186),i=n(25305),a=n(44603),o=n(23568),s=n(35154);a.register(`bitmapText`,function(e,t){e===void 0&&(e={});var n=s(e,`font`,``),a=o(e,`text`,``),c=o(e,`size`,!1),l=s(e,`align`,0),u=new r(this.scene,0,0,n,a,c,l);return t!==void 0&&(e.add=t),i(this.scene,u,e),u})},34914(e,t,n){var r=n(22186);n(39429).register(`bitmapText`,function(e,t,n,i,a,o){return this.displayList.add(new r(this.scene,e,t,n,i,a,o))})},18658(e,t,n){var r=n(29747),i=r,a=r;i=n(33590),a=n(37289),e.exports={renderWebGL:i,renderCanvas:a}},33590(e,t,n){var r=n(3217),i=n(91296),a=n(70554),o={tintEffect:0,tintTopLeft:0,tintTopRight:0,tintBottomLeft:0,tintBottomRight:0},s={tintEffect:0,tintTopLeft:0,tintTopRight:0,tintBottomLeft:0,tintBottomRight:0};e.exports=function(e,t,n,c){if(t._text.length!==0){var l=n.camera;l.addToRenderList(t);var u=t.customRenderNodes.Submitter||t.defaultRenderNodes.Submitter,d=i(t,l,c,!n.useCanvas).calc,f=t.charColors,p=a.getTintAppendFloatAlpha;o.tintEffect=t.tintMode,o.tintTopLeft=p(t.tintTopLeft,t._alphaTL),o.tintTopRight=p(t.tintTopRight,t._alphaTR),o.tintBottomLeft=p(t.tintBottomLeft,t._alphaBL),o.tintBottomRight=p(t.tintBottomRight,t._alphaBR);var m=t.getTextBounds(!1),h,g,_,v=m.characters,y=t.dropShadowX,b=t.dropShadowY;if(y!==0||b!==0){var x=t.dropShadowColor,S=t.dropShadowAlpha;for(s.tintEffect=1,s.tintTopLeft=p(x,S*t._alphaTL),s.tintTopRight=p(x,S*t._alphaTR),s.tintBottomLeft=p(x,S*t._alphaBL),s.tintBottomRight=p(x,S*t._alphaBR),h=0;h<v.length;h++)g=v[h],_=g.glyph,!(g.code===32||_.width===0||_.height===0)&&r(n,u,t,g,_,y,b,d,s)}for(h=0;h<v.length;h++)if(g=v[h],_=g.glyph,!(g.code===32||_.width===0||_.height===0))if(f[g.i]){var C=f[g.i];s.tintEffect=C.tintEffect,s.tintTopLeft=p(C.tintTL,t._alphaTL),s.tintTopRight=p(C.tintTR,t._alphaTR),s.tintBottomLeft=p(C.tintBL,t._alphaBL),s.tintBottomRight=p(C.tintBR,t._alphaBR),r(n,u,t,g,_,0,0,d,s)}else r(n,u,t,g,_,0,0,d,o)}}},6107(e,t,n){var r=n(48011),i=n(46590),a=n(98682),o=n(83419),s=n(31401),c=n(4327),l=n(95643),u=n(73162);e.exports=new o({Extends:l,Mixins:[s.Alpha,s.BlendMode,s.Depth,s.Lighting,s.Mask,s.RenderNodes,s.ScrollFactor,s.Size,s.Texture,s.Transform,s.Visible,r],initialize:function(e,t,n,r,i){l.call(this,e,`Blitter`),this.setTexture(r,i),this.setPosition(t,n),this.initRenderNodes(this._defaultRenderNodesMap),this.children=new u,this.renderList=[],this.dirty=!1},_defaultRenderNodesMap:{get:function(){return a}},create:function(e,t,n,r,a){r===void 0&&(r=!0),a===void 0&&(a=this.children.length),n===void 0?n=this.frame:n instanceof c||(n=this.texture.get(n));var o=new i(this,e,t,n,r);return this.children.addAt(o,a,!1),this.dirty=!0,o},createFromCallback:function(e,t,n,r){for(var i=this.createMultiple(t,n,r),a=0;a<i.length;a++){var o=i[a];e.call(this,o,a)}return i},createMultiple:function(e,t,n){t===void 0&&(t=this.frame.name),n===void 0&&(n=!0),Array.isArray(t)||(t=[t]);var r=[],i=this;return t.forEach(function(t){for(var a=0;a<e;a++)r.push(i.create(0,0,t,n))}),r},childCanRender:function(e){return e.visible&&e.alpha>0},getRenderList:function(){return this.dirty&&=(this.renderList=this.children.list.filter(this.childCanRender,this),!1),this.renderList},clear:function(e){if(e)for(var t=this.children.list,n=t.length;n--;)t[n].destroy();else this.children.removeAll();this.dirty=!0},preDestroy:function(){this.clear(!0),this.children.destroy(),this.renderList=[]}})},72396(e){e.exports=function(e,t,n,r){var i=t.getRenderList();if(i.length!==0){var a=e.currentContext,o=n.alpha*t.alpha;if(o!==0){n.addToRenderList(t),a.globalCompositeOperation=e.blendModes[t.blendMode],a.imageSmoothingEnabled=!t.frame.source.scaleMode;var s=t.x-n.scrollX*t.scrollFactorX,c=t.y-n.scrollY*t.scrollFactorY;a.save(),r&&r.copyToContext(a);for(var l=n.roundPixels,u=0;u<i.length;u++){var d=i[u],f=d.flipX||d.flipY,p=d.frame,m=p.canvasData,h=p.x,g=p.y,_=1,v=1,y=d.alpha*o;y!==0&&(a.globalAlpha=y,f?(d.flipX&&(_=-1,h-=m.width),d.flipY&&(v=-1,g-=m.height),m.width>0&&m.height>0&&(a.save(),a.translate(d.x+s,d.y+c),a.scale(_,v),a.drawImage(p.source.image,m.x,m.y,m.width,m.height,h,g,m.width,m.height),a.restore())):(l&&(h=Math.round(h),g=Math.round(g)),m.width>0&&m.height>0&&a.drawImage(p.source.image,m.x,m.y,m.width,m.height,h+d.x+s,g+d.y+c,m.width,m.height)))}a.restore()}}}},9403(e,t,n){var r=n(6107),i=n(25305),a=n(44603),o=n(23568);a.register(`blitter`,function(e,t){e===void 0&&(e={});var n=o(e,`key`,null),a=o(e,`frame`,null),s=new r(this.scene,0,0,n,a);return t!==void 0&&(e.add=t),i(this.scene,s,e),s})},12709(e,t,n){var r=n(6107);n(39429).register(`blitter`,function(e,t,n,i){return this.displayList.add(new r(this.scene,e,t,n,i))})},48011(e,t,n){var r=n(29747),i=r,a=r;i=n(99485),a=n(72396),e.exports={renderWebGL:i,renderCanvas:a}},99485(e,t,n){var r=n(61340),i=n(70554),a=new r,o={quad:new Float32Array(8)},s={},c={};e.exports=function(e,t,n,r){var l=t.getRenderList(),u=n.camera,d=t.alpha;if(!(l.length===0||d===0)){u.addToRenderList(t);var f=a.copyWithScrollFactorFrom(u.getViewMatrix(!n.useCanvas),u.scrollX,u.scrollY,t.scrollFactorX,t.scrollFactorY);r&&f.multiply(r);for(var p=t.x,m=t.y,h=t.customRenderNodes,g=t.defaultRenderNodes,_=0;_<l.length;_++){var v=l[_],y=v.frame,b=v.alpha*d;if(b!==0){var x=y.width,S=y.height,C=p+v.x+y.x,w=m+v.y+y.y;v.flipX&&(x*=-1,C+=y.width),v.flipY&&(S*=-1,w+=y.height),f.setQuad(C,w,C+x,w+S,o.quad),s.frame=y,s.uvSource=y;var T=i.getTintAppendFloatAlpha(v.tint,b);c.tintTopLeft=T,c.tintBottomLeft=T,c.tintTopRight=T,c.tintBottomRight=T,(h.Submitter||g.Submitter).run(n,t,r,0,s,o,c,void 0,0)}}}}},46590(e,t,n){var r=n(83419),i=n(4327);e.exports=new r({initialize:function(e,t,n,r,i){this.parent=e,this.x=t,this.y=n,this.frame=r,this.data={},this.tint=16777215,this._visible=i,this._alpha=1,this.flipX=!1,this.flipY=!1,this.hasTransformComponent=!0},setFrame:function(e){return e===void 0?this.frame=this.parent.frame:e instanceof i&&e.texture===this.parent.texture?this.frame=e:this.frame=this.parent.texture.get(e),this},resetFlip:function(){return this.flipX=!1,this.flipY=!1,this},reset:function(e,t,n){return this.x=e,this.y=t,this.flipX=!1,this.flipY=!1,this._alpha=1,this._visible=!0,this.parent.dirty=!0,n&&this.setFrame(n),this},setPosition:function(e,t){return this.x=e,this.y=t,this},setFlipX:function(e){return this.flipX=e,this},setFlipY:function(e){return this.flipY=e,this},setFlip:function(e,t){return this.flipX=e,this.flipY=t,this},setVisible:function(e){return this.visible=e,this},setAlpha:function(e){return this.alpha=e,this},setTint:function(e){return this.tint=e,this},destroy:function(){this.parent.dirty=!0,this.parent.children.remove(this),this.parent=void 0,this.frame=void 0,this.data=void 0},visible:{get:function(){return this._visible},set:function(e){this.parent.dirty|=this._visible!==e,this._visible=e}},alpha:{get:function(){return this._alpha},set:function(e){this.parent.dirty|=this._alpha>0!=e>0,this._alpha=e}}})},43451(e,t,n){var r=n(87774),i=n(30529),a=n(83419),o=n(31401),s=n(95643),c=n(36683);e.exports=new a({Extends:s,Mixins:[o.BlendMode,o.Depth,o.RenderNodes,o.Visible,c],initialize:function(e,t){s.call(this,e,`CaptureFrame`);var n=e.renderer;this.drawingContext=new r(n,{width:n.width,height:n.height}),this.captureTexture=e.sys.textures.addGLTexture(t,this.drawingContext.texture),this.initRenderNodes(this._defaultRenderNodesMap)},_defaultRenderNodesMap:{get:function(){return i}},setAlpha:function(e){return this},setScrollFactor:function(e,t){return this}})},23675(e,t,n){var r=n(44603),i=n(23568),a=n(43451);r.register(`captureFrame`,function(e,t){e===void 0&&(e={});var n=i(e,`depth`,0),r=i(e,`key`,null),o=i(e,`visible`,!0),s=new a(this.scene,r);return t!==void 0&&(e.add=t),s.setDepth(n).setVisible(o),e.add&&this.scene.sys.displayList.add(s),s})},20421(e,t,n){var r=n(43451);n(39429).register(`captureFrame`,function(e){return this.displayList.add(new r(this.scene,e))})},36683(e,t,n){var r=n(29747),i=r,a=r;i=n(82237),e.exports={renderWebGL:i,renderCanvas:a}},82237(e){var t=!1;e.exports=function(e,n,r){if(r.useCanvas){t||(t=!0,console.warn("CaptureFrame: Cannot capture from main canvas. Activate `forceComposite` on the camera to use this feature. This warning will now mute."));return}r.camera.addToRenderList(n);var i=r.width,a=r.height,o=n.customRenderNodes,s=n.defaultRenderNodes;n.drawingContext.resize(i,a),n.drawingContext.use(),(o.BatchHandler||s.BatchHandler).batch(n.drawingContext,r.texture,0,a,0,0,i,a,i,0,0,0,1,1,!1,4294967295,4294967295,4294967295,4294967295,{}),n.drawingContext.release()}},16005(e,t,n){var r=n(45319),i=2;e.exports={_alpha:1,_alphaTL:1,_alphaTR:1,_alphaBL:1,_alphaBR:1,clearAlpha:function(){return this.setAlpha(1)},setAlpha:function(e,t,n,i){return e===void 0&&(e=1),t===void 0?this.alpha=e:(this._alphaTL=r(e,0,1),this._alphaTR=r(t,0,1),this._alphaBL=r(n,0,1),this._alphaBR=r(i,0,1)),this},alpha:{get:function(){return this._alpha},set:function(e){var t=r(e,0,1);this._alpha=t,this._alphaTL=t,this._alphaTR=t,this._alphaBL=t,this._alphaBR=t,t===0?this.renderFlags&=~i:this.renderFlags|=i}},alphaTopLeft:{get:function(){return this._alphaTL},set:function(e){var t=r(e,0,1);this._alphaTL=t,t!==0&&(this.renderFlags|=i)}},alphaTopRight:{get:function(){return this._alphaTR},set:function(e){var t=r(e,0,1);this._alphaTR=t,t!==0&&(this.renderFlags|=i)}},alphaBottomLeft:{get:function(){return this._alphaBL},set:function(e){var t=r(e,0,1);this._alphaBL=t,t!==0&&(this.renderFlags|=i)}},alphaBottomRight:{get:function(){return this._alphaBR},set:function(e){var t=r(e,0,1);this._alphaBR=t,t!==0&&(this.renderFlags|=i)}}}},88509(e,t,n){var r=n(45319),i=2;e.exports={_alpha:1,clearAlpha:function(){return this.setAlpha(1)},setAlpha:function(e){return e===void 0&&(e=1),this.alpha=e,this},alpha:{get:function(){return this._alpha},set:function(e){var t=r(e,0,1);this._alpha=t,t===0?this.renderFlags&=~i:this.renderFlags|=i}}}},90065(e,t,n){var r=n(10312);e.exports={_blendMode:r.NORMAL,blendMode:{get:function(){return this._blendMode},set:function(e){typeof e==`string`&&(e=r[e]),e|=0,e>=-1&&(this._blendMode=e)}},setBlendMode:function(e){return this.blendMode=e,this}}},94215(e){e.exports={width:0,height:0,displayWidth:{get:function(){return this.scaleX*this.width},set:function(e){this.scaleX=e/this.width}},displayHeight:{get:function(){return this.scaleY*this.height},set:function(e){this.scaleY=e/this.height}},setSize:function(e,t){return this.width=e,this.height=t,this},setDisplaySize:function(e,t){return this.displayWidth=e,this.displayHeight=t,this}}},61683(e){e.exports={texture:null,frame:null,isCropped:!1,setCrop:function(e,t,n,r){if(e===void 0)this.isCropped=!1;else if(this.frame){if(typeof e==`number`)this.frame.setCropUVs(this._crop,e,t,n,r,this.flipX,this.flipY);else{var i=e;this.frame.setCropUVs(this._crop,i.x,i.y,i.width,i.height,this.flipX,this.flipY)}this.isCropped=!0}return this},resetCropObject:function(){return{u0:0,v0:0,u1:0,v1:0,width:0,height:0,x:0,y:0,flipX:!1,flipY:!1,cx:0,cy:0,cw:0,ch:0}}}},89272(e,t,n){var r=n(37105);e.exports={_depth:0,depth:{get:function(){return this._depth},set:function(e){this.displayList&&this.displayList.queueDepthSort(),this._depth=e}},setDepth:function(e){return e===void 0&&(e=0),this.depth=e,this},setToTop:function(){var e=this.getDisplayList();return e&&r.BringToTop(e,this),this},setToBack:function(){var e=this.getDisplayList();return e&&r.SendToBack(e,this),this},setAbove:function(e){var t=this.getDisplayList();return t&&e&&r.MoveAbove(t,this,e),this},setBelow:function(e){var t=this.getDisplayList();return t&&e&&r.MoveBelow(t,this,e),this}}},3248(e){e.exports={timeElapsed:0,timeElapsedResetPeriod:3600*1e3,timePaused:!1,setTimerResetPeriod:function(e){return this.timeElapsedResetPeriod=e,this},setTimerPaused:function(e){return this.timePaused=!!e,this},resetTimer:function(e){return e===void 0&&(e=0),this.timeElapsed=e,this},updateTimer:function(e,t){return this.timePaused||(this.timeElapsed+=t,this.timeElapsed>=this.timeElapsedResetPeriod&&(this.timeElapsed-=this.timeElapsedResetPeriod)),this}}},53427(e,t,n){var r=n(83419),i=n(10189),a=n(16762),o=n(37597),s=n(88344),c=n(47564),l=n(77011),u=n(95200),d=n(16898),f=n(42652),p=n(43927),m=n(84714),h=n(51890),g=n(97797),_=n(37911),v=n(6379),y=n(29861),b=n(14366),x=n(63785),S=n(62229),C=n(99534),w=n(20263),T=n(90002),E=new r({initialize:function(e){this.camera=e,this.list=[]},clear:function(){for(var e=0;e<this.list.length;e++){var t=this.list[e];t.ignoreDestroy||t.destroy()}return this.list.length=0,this},add:function(e,t){return t===void 0?this.list.push(e):this.list.splice(t,0,e),e},remove:function(e,t){var n=this.list.indexOf(e);return n!==-1&&(this.list.splice(n,1),(!e.ignoreDestroy||t)&&e.destroy()),this},getActive:function(){return this.list.filter(D)},addBarrel:function(e){return this.add(new i(this.camera,e))},addBlend:function(e,t,n,r){return this.add(new a(this.camera,e,t,n,r))},addBlocky:function(e){return this.add(new o(this.camera,e))},addBlur:function(e,t,n,r,i,a){return this.add(new s(this.camera,e,t,n,r,i,a))},addBokeh:function(e,t,n){return this.add(new c(this.camera,e,t,n))},addColorMatrix:function(){return this.add(new l(this.camera))},addCombineColorMatrix:function(e){return this.add(new u(this.camera,e))},addDisplacement:function(e,t,n){return this.add(new d(this.camera,e,t,n))},addGlow:function(e,t,n,r,i,a,o){return this.add(new f(this.camera,e,t,n,r,i,a,o))},addGradientMap:function(e){return this.add(new p(this.camera,e))},addImageLight:function(e){return this.add(new m(this.camera,e))},addKey:function(e){return this.add(new h(this.camera,e))},addMask:function(e,t,n,r,i){return this.add(new g(this.camera,e,t,n,r,i))},addNormalTools:function(e){return this.add(new _(this.camera,e))},addPanoramaBlur:function(e){return this.add(new v(this.camera,e))},addPixelate:function(e){return this.add(new y(this.camera,e))},addQuantize:function(e){return this.add(new b(this.camera,e))},addSampler:function(e,t){return this.add(new x(this.camera,e,t))},addShadow:function(e,t,n,r,i,a,o){return this.add(new S(this.camera,e,t,n,r,i,a,o))},addThreshold:function(e,t,n){return this.add(new C(this.camera,e,t,n))},addTiltShift:function(e,t,n,r,i,a){return this.add(new c(this.camera,e,t,n,!0,r,i,a))},addVignette:function(e,t,n,r,i,a){return this.add(new w(this.camera,e,t,n,r,i,a))},addWipe:function(e,t,n,r,i){return this.add(new T(this.camera,e,t,n,r,i))},destroy:function(){this.clear(),this.camera=null}});function D(e){return e.active}e.exports=E},43102(e,t,n){var r=null,i=n(26099),a=n(61340),o={};o={filterCamera:null,filters:{get:function(){return this.filterCamera?this.filterCamera.filters:null}},renderFilters:!0,maxFilterSize:null,filtersAutoFocus:!0,filtersFocusContext:!1,filtersForceComposite:!1,_filtersMatrix:null,_filtersViewMatrix:null,willRenderFilters:function(){return this.renderFilters&&this.filters&&(this.filters.internal.getActive().length>0||this.filters.external.getActive().length>0||this.filtersForceComposite)},enableFilters:function(){if(this.filterCamera||!this.scene.renderer.gl)return this;var e=this.scene;if(r||=n(38058),this.filterCamera=new r(0,0,1,1).setScene(e,!1),this.filterCamera.isObjectInversion=!0,e.game.config.roundPixels&&(this.filterCamera.roundPixels=!0),!this.maxFilterSize){var t=e.renderer.getMaxTextureSize();this.maxFilterSize=new i(t,t)}this._filtersMatrix=new a,this._filtersViewMatrix=new a,(!this.getBounds||this.width===void 0||this.height===void 0||this.width===0||this.height===0)&&(this.filtersFocusContext=!0);var o=this._renderSteps.indexOf(this.renderWebGL);return this.addRenderStep(this.renderWebGLFilters,o),this},renderWebGLFilters:function(e,t,n,r,i){if(!t.willRenderFilters()){t.renderWebGLStep(e,t,n,r,i+1);return}var a=n.camera,o=t.filtersAutoFocus,s=t.filtersFocusContext;o&&(s?t.focusFiltersOnCamera(a):t.focusFilters());var c=t.filterCamera;c.preRender();var l=c.roundPixels;if(c.roundPixels=t.willRoundVertices(c,t.rotation%(Math.PI*2)==0&&(t.scaleX,t.scaleY===1)),o&&s){var u=t.parentContainer;if(u){var d=u.getWorldTransformMatrix();c.matrix.multiply(d)}}var f=t._filtersMatrix,p=t._filtersViewMatrix.copyWithScrollFactorFrom(a.getViewMatrix(!n.useCanvas),a.scrollX,a.scrollY,t.scrollFactorX,t.scrollFactorY);if(r&&p.multiply(r),s)f.loadIdentity();else{if(t.type===`Layer`)f.loadIdentity();else{var m=t.flipX?-1:1,h=t.flipY?-1:1;f.applyITRS(t.x,t.y,t.rotation,t.scaleX*m,t.scaleY*h)}var g=c.width,_=c.height;f.translate(-g*c.originX,-_*c.originY),p.multiply(f,f)}var v=t.scrollFactorX,y=t.scrollFactorY;t.scrollFactorX=1,t.scrollFactorY=1,e.cameraRenderNode.run(n,[t],c,f,!0,i+1),t.scrollFactorX=v,t.scrollFactorY=y,c.roundPixels=l;for(var b=c.renderList.length,x=0;x<b;x++)a.addToRenderList(c.renderList[x])},focusFilters:function(){var e=this.x,t=this.y,n=this.originX,r=this.originY,i=this.width,a=this.height;if(this.type===`Layer`||isNaN(e)||isNaN(t)||isNaN(i)||isNaN(a)||isNaN(n)||isNaN(r)||i===0||a===0)return this.filtersFocusContext=!0,this;var o=this.rotation,s=this.scaleX,c=this.scaleY;this.flipX&&(s*=-1,n=1-n),this.flipY&&(c*=-1,r=1-r);var l=e+i*(.5-n),u=t+a*(.5-r);return this.setFilterSize(i,a),this.filterCamera.centerOn(l,u).setRotation(-o).setOrigin(n,r).setZoom(1/s,1/c),this},focusFiltersOnCamera:function(e){var t=e.width,n=e.height,r=e.scrollX,i=e.scrollY,a=e.rotation,o=e.zoomX,s=e.zoomY;return this.setFilterSize(t,n),this.filterCamera.setScroll(r,i),this.filterCamera.setRotation(a),this.filterCamera.setZoom(o,s),this},focusFiltersOverride:function(e,t,n,r){var i=this.filterCamera;n===void 0&&(n=i.width),r===void 0&&(r=i.height),e===void 0&&(e=n/2),t===void 0&&(t=r/2);var a=this.x,o=this.y;this.setFilterSize(n,r),i.setScroll(a-e,o-t);var s=e/n,c=t/r;return i.setOrigin(s,c),this.filtersAutoFocus=!1,this},setFilterSize:function(e,t){e=Math.max(1,Math.min(Math.ceil(e),this.maxFilterSize.x)),t=Math.max(1,Math.min(Math.ceil(t),this.maxFilterSize.y));var n=this.filterCamera;return n&&n.setSize(e,t),this},setFiltersAutoFocus:function(e){return this.filtersAutoFocus=e,this},setFiltersFocusContext:function(e){return this.filtersFocusContext=e,this},setFiltersForceComposite:function(e){return this.filtersForceComposite=e,this},setRenderFilters:function(e){return this.renderFilters=e,this}},e.exports=o},54434(e){e.exports={flipX:!1,flipY:!1,toggleFlipX:function(){return this.flipX=!this.flipX,this},toggleFlipY:function(){return this.flipY=!this.flipY,this},setFlipX:function(e){return this.flipX=e,this},setFlipY:function(e){return this.flipY=e,this},setFlip:function(e,t){return this.flipX=e,this.flipY=t,this},resetFlip:function(){return this.flipX=!1,this.flipY=!1,this}}},8004(e,t,n){var r=n(87841),i=n(11520),a=n(26099);e.exports={prepareBoundsOutput:function(e,t){return t===void 0&&(t=!1),this.rotation!==0&&i(e,this.x,this.y,this.rotation),t&&this.parentContainer&&this.parentContainer.getBoundsTransformMatrix().transformPoint(e.x,e.y,e),e},getCenter:function(e,t){return e===void 0&&(e=new a),e.x=this.x-this.displayWidth*this.originX+this.displayWidth/2,e.y=this.y-this.displayHeight*this.originY+this.displayHeight/2,this.prepareBoundsOutput(e,t)},getTopLeft:function(e,t){return e||=new a,e.x=this.x-this.displayWidth*this.originX,e.y=this.y-this.displayHeight*this.originY,this.prepareBoundsOutput(e,t)},getTopCenter:function(e,t){return e||=new a,e.x=this.x-this.displayWidth*this.originX+this.displayWidth/2,e.y=this.y-this.displayHeight*this.originY,this.prepareBoundsOutput(e,t)},getTopRight:function(e,t){return e||=new a,e.x=this.x-this.displayWidth*this.originX+this.displayWidth,e.y=this.y-this.displayHeight*this.originY,this.prepareBoundsOutput(e,t)},getLeftCenter:function(e,t){return e||=new a,e.x=this.x-this.displayWidth*this.originX,e.y=this.y-this.displayHeight*this.originY+this.displayHeight/2,this.prepareBoundsOutput(e,t)},getRightCenter:function(e,t){return e||=new a,e.x=this.x-this.displayWidth*this.originX+this.displayWidth,e.y=this.y-this.displayHeight*this.originY+this.displayHeight/2,this.prepareBoundsOutput(e,t)},getBottomLeft:function(e,t){return e||=new a,e.x=this.x-this.displayWidth*this.originX,e.y=this.y-this.displayHeight*this.originY+this.displayHeight,this.prepareBoundsOutput(e,t)},getBottomCenter:function(e,t){return e||=new a,e.x=this.x-this.displayWidth*this.originX+this.displayWidth/2,e.y=this.y-this.displayHeight*this.originY+this.displayHeight,this.prepareBoundsOutput(e,t)},getBottomRight:function(e,t){return e||=new a,e.x=this.x-this.displayWidth*this.originX+this.displayWidth,e.y=this.y-this.displayHeight*this.originY+this.displayHeight,this.prepareBoundsOutput(e,t)},getBounds:function(e){e===void 0&&(e=new r);var t,n,i,a,o,s,c,l;if(this.parentContainer){var u=this.parentContainer.getBoundsTransformMatrix();this.getTopLeft(e),u.transformPoint(e.x,e.y,e),t=e.x,n=e.y,this.getTopRight(e),u.transformPoint(e.x,e.y,e),i=e.x,a=e.y,this.getBottomLeft(e),u.transformPoint(e.x,e.y,e),o=e.x,s=e.y,this.getBottomRight(e),u.transformPoint(e.x,e.y,e),c=e.x,l=e.y}else this.getTopLeft(e),t=e.x,n=e.y,this.getTopRight(e),i=e.x,a=e.y,this.getBottomLeft(e),o=e.x,s=e.y,this.getBottomRight(e),c=e.x,l=e.y;return e.x=Math.min(t,i,o,c),e.y=Math.min(n,a,s,l),e.width=Math.max(t,i,o,c)-e.x,e.height=Math.max(n,a,s,l)-e.y,e}}},73629(e){e.exports={lighting:!1,selfShadow:{enabled:null,penumbra:.5,diffuseFlatThreshold:1/3},setLighting:function(e){return this.lighting=e,this},setSelfShadow:function(e,t,n){return e!==void 0&&(e===null?this.selfShadow.enabled=this.scene.sys.game.config.selfShadow:this.selfShadow.enabled=e),t!==void 0&&(this.selfShadow.penumbra=t),n!==void 0&&(this.selfShadow.diffuseFlatThreshold=n),this}}},8573(e,t,n){var r=n(8054),i=n(80661);e.exports={mask:null,setMask:function(e){return this.scene.renderer.type===r.WEBGL?(console.warn(`Phaser.GameObjects.Components.Mask.setMask: This method is not supported in WebGL. Create a Mask filter instead.`),this):(this.mask=e,this)},clearMask:function(e){return e===void 0&&(e=!1),e&&this.mask&&this.mask.destroy(),this.mask=null,this},createGeometryMask:function(e){return e===void 0&&(this.type===`Graphics`||this.geom)&&(e=this),new i(this.scene,e)}}},27387(e){e.exports={_originComponent:!0,originX:.5,originY:.5,_displayOriginX:0,_displayOriginY:0,displayOriginX:{get:function(){return this._displayOriginX},set:function(e){this._displayOriginX=e,this.originX=e/this.width}},displayOriginY:{get:function(){return this._displayOriginY},set:function(e){this._displayOriginY=e,this.originY=e/this.height}},setOrigin:function(e,t){return e===void 0&&(e=.5),t===void 0&&(t=e),this.originX=e,this.originY=t,this.updateDisplayOrigin()},setOriginFromFrame:function(){return!this.frame||!this.frame.customPivot?this.setOrigin():(this.originX=this.frame.pivotX,this.originY=this.frame.pivotY,this.updateDisplayOrigin())},setDisplayOrigin:function(e,t){return e===void 0&&(e=0),t===void 0&&(t=e),this.displayOriginX=e,this.displayOriginY=t,this},updateDisplayOrigin:function(){return this._displayOriginX=this.originX*this.width,this._displayOriginY=this.originY*this.height,this}}},37640(e,t,n){var r=n(39506),i=n(57355),a=n(35154),o=n(86353),s=n(26099);e.exports={path:null,rotateToPath:!1,pathRotationOffset:0,pathOffset:null,pathVector:null,pathDelta:null,pathTween:null,pathConfig:null,_prevDirection:o.PLAYING_FORWARD,setPath:function(e,t){t===void 0&&(t=this.pathConfig);var n=this.pathTween;return n&&n.isPlaying()&&n.stop(),this.path=e,t&&this.startFollow(t),this},setRotateToPath:function(e,t){return t===void 0&&(t=0),this.rotateToPath=e,this.pathRotationOffset=t,this},isFollowing:function(){var e=this.pathTween;return e&&e.isPlaying()},startFollow:function(e,t){e===void 0&&(e={}),t===void 0&&(t=0);var n=this.pathTween;n&&n.isPlaying()&&n.stop(),typeof e==`number`&&(e={duration:e}),e.from=a(e,`from`,0),e.to=a(e,`to`,1);var c=i(e,`positionOnPath`,!1);this.rotateToPath=i(e,`rotateToPath`,!1),this.pathRotationOffset=a(e,`rotationOffset`,0);var l=a(e,`startAt`,t);if(l&&(e.onStart=function(e){var t=e.data[0];t.progress=l,t.elapsed=t.duration*l;var n=t.ease(t.progress);t.current=t.start+(t.end-t.start)*n,t.setTargetValue()}),this.pathOffset||=new s(this.x,this.y),this.pathVector||=new s,this.pathDelta||=new s,this.pathDelta.reset(),e.persist=!0,this.pathTween=this.scene.sys.tweens.addCounter(e),this.path.getStartPoint(this.pathOffset),c&&(this.x=this.pathOffset.x,this.y=this.pathOffset.y),this.pathOffset.x=this.x-this.pathOffset.x,this.pathOffset.y=this.y-this.pathOffset.y,this._prevDirection=o.PLAYING_FORWARD,this.rotateToPath){var u=this.path.getPoint(.1);this.rotation=Math.atan2(u.y-this.y,u.x-this.x)+r(this.pathRotationOffset)}return this.pathConfig=e,this},pauseFollow:function(){var e=this.pathTween;return e&&e.isPlaying()&&e.pause(),this},resumeFollow:function(){var e=this.pathTween;return e&&e.isPaused()&&e.resume(),this},stopFollow:function(){var e=this.pathTween;return e&&e.isPlaying()&&e.stop(),this},pathUpdate:function(){var e=this.pathTween;if(e&&e.data){var t=e.data[0],n=this.pathDelta,i=this.pathVector;if(n.copy(i).negate(),t.state===o.COMPLETE){this.path.getPoint(t.end,i),n.add(i),i.add(this.pathOffset),this.setPosition(i.x,i.y);return}else if(t.state!==o.PLAYING_FORWARD&&t.state!==o.PLAYING_BACKWARD)return;this.path.getPoint(e.getValue(),i),n.add(i),i.add(this.pathOffset);var a=this.x,s=this.y;this.setPosition(i.x,i.y);var c=this.x-a,l=this.y-s;if(c===0&&l===0)return;if(t.state!==this._prevDirection){this._prevDirection=t.state;return}this.rotateToPath&&(this.rotation=Math.atan2(l,c)+r(this.pathRotationOffset))}}}},68680(e,t,n){var r=n(62644);e.exports={customRenderNodes:null,defaultRenderNodes:null,renderNodeData:null,initRenderNodes:function(e){this.customRenderNodes={},this.defaultRenderNodes={},this.renderNodeData={};var t=this.scene.sys.renderer;if(t){var n=t.renderNodes;if(n&&e){var r=this.defaultRenderNodes;e.each(function(e,t){r[e]=n.getNode(t)})}}},setRenderNodeRole:function(e,t,n,i){var a=this.scene.sys.renderer;if(!a)return this;var o=a.renderNodes;if(!o)return this;if(t!==null){if(typeof t==`string`&&(t=o.getNode(t)),!t)return this;this.customRenderNodes[e]=t,n?this.renderNodeData[t.name]=i?r(n):n:this.renderNodeData[t.name]={}}else{var s=this.customRenderNodes[e];s&&(delete this.renderNodeData[s.name],delete this.customRenderNodes[e])}return this},setRenderNodeData:function(e,t,n){var r=e;typeof e!=`string`&&(r=e.name);var i=this.renderNodeData[r];return n===void 0?delete i[t]:i[t]=n,this}}},86038(e){var t={};t={_renderSteps:null,renderWebGLStep:function(e,t,n,r,i,a,o){i===void 0&&(i=0);var s=t._renderSteps[i];s&&(a?o===void 0&&(o=0):(a=[t],o=0),s(e,t,n,r,i,a,o))},addRenderStep:function(e,t){return this._renderSteps||=[],t===void 0?(this._renderSteps.push(e),this):(this._renderSteps.splice(t,0,e),this)}},e.exports=t},80227(e){e.exports={scrollFactorX:1,scrollFactorY:1,setScrollFactor:function(e,t){return t===void 0&&(t=e),this.scrollFactorX=e,this.scrollFactorY=t,this}}},16736(e){e.exports={_sizeComponent:!0,width:0,height:0,displayWidth:{get:function(){return Math.abs(this.scaleX*this.frame.realWidth)},set:function(e){this.scaleX=e/this.frame.realWidth}},displayHeight:{get:function(){return Math.abs(this.scaleY*this.frame.realHeight)},set:function(e){this.scaleY=e/this.frame.realHeight}},setSizeToFrame:function(e){e||=this.frame,this.width=e.realWidth,this.height=e.realHeight;var t=this.input;return t&&!t.customHitArea&&(t.hitArea.width=this.width,t.hitArea.height=this.height),this},setSize:function(e,t){return this.width=e,this.height=t,this},setDisplaySize:function(e,t){return this.displayWidth=e,this.displayHeight=t,this}}},43520(e){e.exports={stencilLayerMode:`addLayer`,stencilInvert:!1,stencilAlphaStrategy:`dither`,stencilCompositeCheck:`auto`,stencilClearValue:0,stencilValueWrap:!0,isStencilModifier:{get:function(){return!0},set:function(e){}},setStencilAlphaStrategy:function(e){return this.stencilAlphaStrategy=e,this},setStencilClearValue:function(e){return this.stencilClearValue=e,this},setStencilCompositeCheck:function(e){return this.stencilCompositeCheck=e,this},setStencilInvert:function(e){return this.stencilInvert=e,this},setStencilLayerMode:function(e){return this.stencilLayerMode=e,this},setStencilValueWrap:function(e){return this.stencilValueWrap=e,this}}},37726(e,t,n){var r=n(4327),i=8;e.exports={texture:null,frame:null,isCropped:!1,setTexture:function(e,t,n,r){return this.texture=this.scene.sys.textures.get(e),this.setFrame(t,n,r)},setFrame:function(e,t,n){return t===void 0&&(t=!0),n===void 0&&(n=!0),e instanceof r?(this.texture=this.scene.sys.textures.get(e.texture.key),this.frame=e):this.frame=this.texture.get(e),!this.frame.cutWidth||!this.frame.cutHeight?this.renderFlags&=~i:this.renderFlags|=i,this._sizeComponent&&t&&this.setSizeToFrame(),this._originComponent&&n&&(this.frame.customPivot?this.setOrigin(this.frame.pivotX,this.frame.pivotY):this.updateDisplayOrigin()),this}}},79812(e,t,n){var r=n(4327),i=8;e.exports={texture:null,frame:null,isCropped:!1,setCrop:function(e,t,n,r){if(e===void 0)this.isCropped=!1;else if(this.frame){if(typeof e==`number`)this.frame.setCropUVs(this._crop,e,t,n,r,this.flipX,this.flipY);else{var i=e;this.frame.setCropUVs(this._crop,i.x,i.y,i.width,i.height,this.flipX,this.flipY)}this.isCropped=!0}return this},setTexture:function(e,t){return this.texture=this.scene.sys.textures.get(e),this.setFrame(t)},setFrame:function(e,t,n){return t===void 0&&(t=!0),n===void 0&&(n=!0),e instanceof r?(this.texture=this.scene.sys.textures.get(e.texture.key),this.frame=e):this.frame=this.texture.get(e),!this.frame.cutWidth||!this.frame.cutHeight?this.renderFlags&=~i:this.renderFlags|=i,this._sizeComponent&&t&&this.setSizeToFrame(),this._originComponent&&n&&(this.frame.customPivot?this.setOrigin(this.frame.pivotX,this.frame.pivotY):this.updateDisplayOrigin()),this.isCropped&&this.frame.updateCropUVs(this._crop,this.flipX,this.flipY),this},resetCropObject:function(){return{u0:0,v0:0,u1:0,v1:0,width:0,height:0,x:0,y:0,flipX:!1,flipY:!1,cx:0,cy:0,cw:0,ch:0}}}},27472(e,t,n){var r=n(84322);e.exports={tintTopLeft:16777215,tintTopRight:16777215,tintBottomLeft:16777215,tintBottomRight:16777215,tint2TopLeft:0,tint2TopRight:0,tint2BottomLeft:0,tint2BottomRight:0,tintMode:r.MULTIPLY,clearTint:function(){return this.setTint(16777215),this.setTint2(0),this.setTintMode(r.MULTIPLY),this},setTint:function(e,t,n,r){return e===void 0&&(e=16777215),t===void 0&&(t=e,n=e,r=e),this.tintTopLeft=e,this.tintTopRight=t,this.tintBottomLeft=n,this.tintBottomRight=r,this},setTint2:function(e,t,n,r){return e===void 0&&(e=0),t===void 0&&(t=e,n=e,r=e),this.tint2TopLeft=e,this.tint2TopRight=t,this.tint2BottomLeft=n,this.tint2BottomRight=r,this},setTintMode:function(e){return this.tintMode=e,this},setTintFill:function(){console.error("`setTintFill(color)` is removed as of Phaser 4. Use setTint(color).setTintMode(Phaser.TintModes.FILL)` instead.")},tint:{get:function(){return this.tintTopLeft},set:function(e){this.setTint(e,e,e,e)}},isTinted:{get:function(){var e=16777215,t=0;return this.tintMode!==r.MULTIPLY||this.tintTopLeft!==e||this.tintTopRight!==e||this.tintBottomLeft!==e||this.tintBottomRight!==e||this.tint2TopLeft!==t||this.tint2TopRight!==t||this.tint2BottomLeft!==t||this.tint2BottomRight!==t}}}},53774(e){e.exports=function(e){var t={name:e.name,type:e.type,x:e.x,y:e.y,depth:e.depth,scale:{x:e.scaleX,y:e.scaleY},origin:{x:e.originX,y:e.originY},flipX:e.flipX,flipY:e.flipY,rotation:e.rotation,alpha:e.alpha,visible:e.visible,blendMode:e.blendMode,textureKey:``,frameKey:``,data:{}};return e.texture&&(t.textureKey=e.texture.key,t.frameKey=e.frame.name),t}},16901(e,t,n){var r=n(36383),i=n(61340),a=n(85955),o=n(86554),s=n(30954),c=n(26099),l=4;e.exports={hasTransformComponent:!0,_scaleX:1,_scaleY:1,_rotation:0,x:0,y:0,z:0,w:0,scale:{get:function(){return(this._scaleX+this._scaleY)/2},set:function(e){this._scaleX=e,this._scaleY=e,e===0?this.renderFlags&=~l:this.renderFlags|=l}},scaleX:{get:function(){return this._scaleX},set:function(e){this._scaleX=e,e===0?this.renderFlags&=~l:this._scaleY!==0&&(this.renderFlags|=l)}},scaleY:{get:function(){return this._scaleY},set:function(e){this._scaleY=e,e===0?this.renderFlags&=~l:this._scaleX!==0&&(this.renderFlags|=l)}},angle:{get:function(){return s(this._rotation*r.RAD_TO_DEG)},set:function(e){this.rotation=s(e)*r.DEG_TO_RAD}},rotation:{get:function(){return this._rotation},set:function(e){this._rotation=o(e)}},setPosition:function(e,t,n,r){return e===void 0&&(e=0),t===void 0&&(t=e),n===void 0&&(n=0),r===void 0&&(r=0),this.x=e,this.y=t,this.z=n,this.w=r,this},copyPosition:function(e){return e.x!==void 0&&(this.x=e.x),e.y!==void 0&&(this.y=e.y),e.z!==void 0&&(this.z=e.z),e.w!==void 0&&(this.w=e.w),this},setRandomPosition:function(e,t,n,r){return e===void 0&&(e=0),t===void 0&&(t=0),n===void 0&&(n=this.scene.sys.scale.width),r===void 0&&(r=this.scene.sys.scale.height),this.x=e+Math.random()*n,this.y=t+Math.random()*r,this},setRotation:function(e){return e===void 0&&(e=0),this.rotation=e,this},setAngle:function(e){return e===void 0&&(e=0),this.angle=e,this},setScale:function(e,t){return e===void 0&&(e=1),t===void 0&&(t=e),this.scaleX=e,this.scaleY=t,this},setX:function(e){return e===void 0&&(e=0),this.x=e,this},setY:function(e){return e===void 0&&(e=0),this.y=e,this},setZ:function(e){return e===void 0&&(e=0),this.z=e,this},setW:function(e){return e===void 0&&(e=0),this.w=e,this},getLocalTransformMatrix:function(e){return e===void 0&&(e=new i),e.applyITRS(this.x,this.y,this._rotation,this._scaleX,this._scaleY)},getWorldTransformMatrix:function(e,t){e===void 0&&(e=new i);var n=this.parentContainer;if(!n)return this.getLocalTransformMatrix(e);var r=!1;for(t||(t=new i,r=!0),e.applyITRS(this.x,this.y,this._rotation,this._scaleX,this._scaleY);n;)t.applyITRS(n.x,n.y,n._rotation,n._scaleX,n._scaleY),t.multiply(e,e),n=n.parentContainer;return r&&t.destroy(),e},getLocalPoint:function(e,t,n,r){n||=new c,r||=this.scene.sys.cameras.main;var i=r.scrollX,o=r.scrollY,s=e+i*this.scrollFactorX-i,l=t+o*this.scrollFactorY-o;return this.parentContainer?this.getWorldTransformMatrix().applyInverse(s,l,n):a(s,l,this.x,this.y,this.rotation,this.scaleX,this.scaleY,n),this._originComponent&&(n.x+=this._displayOriginX,n.y+=this._displayOriginY),n},getWorldPoint:function(e,t,n){if(e===void 0&&(e=new c),!this.parentContainer)return e.x=this.x,e.y=this.y,e;var r=this.getWorldTransformMatrix(t,n);return e.x=r.tx,e.y=r.ty,e},getParentRotation:function(){for(var e=0,t=this.parentContainer;t;)e+=t.rotation,t=t.parentContainer;return e}}},61340(e,t,n){var r=n(83419),i=n(36383),a=n(26099);e.exports=new r({initialize:function(e,t,n,r,i,a){e===void 0&&(e=1),t===void 0&&(t=0),n===void 0&&(n=0),r===void 0&&(r=1),i===void 0&&(i=0),a===void 0&&(a=0),this.matrix=new Float32Array([e,t,n,r,i,a,0,0,1]),this.decomposedMatrix={translateX:0,translateY:0,scaleX:1,scaleY:1,rotation:0},this.quad=new Float32Array(8)},a:{get:function(){return this.matrix[0]},set:function(e){this.matrix[0]=e}},b:{get:function(){return this.matrix[1]},set:function(e){this.matrix[1]=e}},c:{get:function(){return this.matrix[2]},set:function(e){this.matrix[2]=e}},d:{get:function(){return this.matrix[3]},set:function(e){this.matrix[3]=e}},e:{get:function(){return this.matrix[4]},set:function(e){this.matrix[4]=e}},f:{get:function(){return this.matrix[5]},set:function(e){this.matrix[5]=e}},tx:{get:function(){return this.matrix[4]},set:function(e){this.matrix[4]=e}},ty:{get:function(){return this.matrix[5]},set:function(e){this.matrix[5]=e}},rotation:{get:function(){return Math.acos(this.a/this.scaleX)*(Math.atan(-this.c/this.a)<0?-1:1)}},rotationNormalized:{get:function(){var e=this.matrix,t=e[0],n=e[1],r=e[2],a=e[3];return t||n?n>0?Math.acos(t/this.scaleX):-Math.acos(t/this.scaleX):r||a?i.PI_OVER_2-(a>0?Math.acos(-r/this.scaleY):-Math.acos(r/this.scaleY)):0}},scaleX:{get:function(){return Math.sqrt(this.a*this.a+this.b*this.b)}},scaleY:{get:function(){return Math.sqrt(this.c*this.c+this.d*this.d)}},loadIdentity:function(){var e=this.matrix;return e[0]=1,e[1]=0,e[2]=0,e[3]=1,e[4]=0,e[5]=0,this},translate:function(e,t){var n=this.matrix;return n[4]=n[0]*e+n[2]*t+n[4],n[5]=n[1]*e+n[3]*t+n[5],this},scale:function(e,t){var n=this.matrix;return n[0]*=e,n[1]*=e,n[2]*=t,n[3]*=t,this},rotate:function(e){var t=Math.sin(e),n=Math.cos(e),r=this.matrix,i=r[0],a=r[1],o=r[2],s=r[3];return r[0]=i*n+o*t,r[1]=a*n+s*t,r[2]=i*-t+o*n,r[3]=a*-t+s*n,this},multiply:function(e,t){var n=this.matrix,r=e.matrix,i=n[0],a=n[1],o=n[2],s=n[3],c=n[4],l=n[5],u=r[0],d=r[1],f=r[2],p=r[3],m=r[4],h=r[5],g=t===void 0?n:t.matrix;return g[0]=u*i+d*o,g[1]=u*a+d*s,g[2]=f*i+p*o,g[3]=f*a+p*s,g[4]=m*i+h*o+c,g[5]=m*a+h*s+l,g},multiplyWithOffset:function(e,t,n){var r=this.matrix,i=e.matrix,a=r[0],o=r[1],s=r[2],c=r[3],l=r[4],u=r[5],d=t*a+n*s+l,f=t*o+n*c+u,p=i[0],m=i[1],h=i[2],g=i[3],_=i[4],v=i[5];return r[0]=p*a+m*s,r[1]=p*o+m*c,r[2]=h*a+g*s,r[3]=h*o+g*c,r[4]=_*a+v*s+d,r[5]=_*o+v*c+f,this},transform:function(e,t,n,r,i,a){var o=this.matrix,s=o[0],c=o[1],l=o[2],u=o[3],d=o[4],f=o[5];return o[0]=e*s+t*l,o[1]=e*c+t*u,o[2]=n*s+r*l,o[3]=n*c+r*u,o[4]=i*s+a*l+d,o[5]=i*c+a*u+f,this},transformPoint:function(e,t,n){n===void 0&&(n={x:0,y:0});var r=this.matrix,i=r[0],a=r[1],o=r[2],s=r[3],c=r[4],l=r[5];return n.x=e*i+t*o+c,n.y=e*a+t*s+l,n},invert:function(){var e=this.matrix,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=t*i-n*r;return e[0]=i/s,e[1]=-n/s,e[2]=-r/s,e[3]=t/s,e[4]=(r*o-i*a)/s,e[5]=-(t*o-n*a)/s,this},copyFrom:function(e){var t=this.matrix;return t[0]=e.a,t[1]=e.b,t[2]=e.c,t[3]=e.d,t[4]=e.e,t[5]=e.f,this},copyFromArray:function(e){var t=this.matrix;return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t[4]=e[4],t[5]=e[5],this},copyWithScrollFactorFrom:function(e,t,n,r,i){var a=this.matrix;a[0]=e.a,a[1]=e.b,a[2]=e.c,a[3]=e.d;var o=t*(1-r),s=n*(1-i);return a[4]=e.a*o+e.c*s+e.e,a[5]=e.b*o+e.d*s+e.f,this},copyToContext:function(e){var t=this.matrix;return e.transform(t[0],t[1],t[2],t[3],t[4],t[5]),e},setToContext:function(e){return e.setTransform(this.a,this.b,this.c,this.d,this.e,this.f),e},copyToArray:function(e){var t=this.matrix;return e===void 0?e=[t[0],t[1],t[2],t[3],t[4],t[5]]:(e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e[4]=t[4],e[5]=t[5]),e},setTransform:function(e,t,n,r,i,a){var o=this.matrix;return o[0]=e,o[1]=t,o[2]=n,o[3]=r,o[4]=i,o[5]=a,this},decomposeMatrix:function(){var e=this.decomposedMatrix,t=this.matrix,n=t[0],r=t[1],i=t[2],a=t[3],o=n*a-r*i;if(e.translateX=t[4],e.translateY=t[5],n||r){var s=Math.sqrt(n*n+r*r);e.rotation=r>0?Math.acos(n/s):-Math.acos(n/s),e.scaleX=s,e.scaleY=o/s}else if(i||a){var c=Math.sqrt(i*i+a*a);e.rotation=Math.PI*.5-(a>0?Math.acos(-i/c):-Math.acos(i/c)),e.scaleX=o/c,e.scaleY=c}else e.rotation=0,e.scaleX=0,e.scaleY=0;return e},applyITRS:function(e,t,n,r,i){var a=this.matrix,o=Math.sin(n),s=Math.cos(n);return a[4]=e,a[5]=t,a[0]=s*r,a[1]=o*r,a[2]=-o*i,a[3]=s*i,this},applyInverse:function(e,t,n){n===void 0&&(n=new a);var r=this.matrix,i=r[0],o=r[1],s=r[2],c=r[3],l=r[4],u=r[5],d=1/(i*c+s*-o);return n.x=c*d*e+-s*d*t+(u*s-l*c)*d,n.y=i*d*t+-o*d*e+(-u*i+l*o)*d,n},setQuad:function(e,t,n,r,i){i===void 0&&(i=this.quad);var a=this.matrix,o=a[0],s=a[1],c=a[2],l=a[3],u=a[4],d=a[5];return i[0]=e*o+t*c+u,i[1]=e*s+t*l+d,i[2]=e*o+r*c+u,i[3]=e*s+r*l+d,i[4]=n*o+r*c+u,i[5]=n*s+r*l+d,i[6]=n*o+t*c+u,i[7]=n*s+t*l+d,i},getX:function(e,t){return e*this.a+t*this.c+this.e},getY:function(e,t){return e*this.b+t*this.d+this.f},getXRound:function(e,t,n){var r=this.getX(e,t);return n&&(r=Math.floor(r+.5)),r},getYRound:function(e,t,n){var r=this.getY(e,t);return n&&(r=Math.floor(r+.5)),r},getCSSMatrix:function(){var e=this.matrix;return`matrix(`+e[0]+`,`+e[1]+`,`+e[2]+`,`+e[3]+`,`+e[4]+`,`+e[5]+`)`},destroy:function(){this.matrix=null,this.quad=null,this.decomposedMatrix=null}})},59715(e){e.exports={_visible:!0,visible:{get:function(){return this._visible},set:function(e){e?(this._visible=!0,this.renderFlags|=1):(this._visible=!1,this.renderFlags&=-2)}},setVisible:function(e){return this.visible=e,this}}},31401(e,t,n){e.exports={Alpha:n(16005),AlphaSingle:n(88509),BlendMode:n(90065),ComputedSize:n(94215),Crop:n(61683),Depth:n(89272),ElapseTimer:n(3248),FilterList:n(53427),Filters:n(43102),Flip:n(54434),GetBounds:n(8004),Lighting:n(73629),Mask:n(8573),Origin:n(27387),PathFollower:n(37640),RenderNodes:n(68680),RenderSteps:n(86038),ScrollFactor:n(80227),Size:n(16736),StencilModifier:n(43520),Texture:n(37726),TextureCrop:n(79812),Tint:n(27472),ToJSON:n(53774),Transform:n(16901),TransformMatrix:n(61340),Visible:n(59715)}},31559(e,t,n){var r=n(37105),i=n(10312),a=n(83419),o=n(31401),s=n(51708),c=n(95643),l=n(87841),u=n(29959),d=n(36899),f=n(26099),p=n(93595),m=new o.TransformMatrix;e.exports=new a({Extends:c,Mixins:[o.AlphaSingle,o.BlendMode,o.ComputedSize,o.Depth,o.Mask,o.Transform,o.Visible,u],initialize:function(e,t,n,r){c.call(this,e,`Container`),this.list=[],this.exclusive=!0,this.maxSize=-1,this.position=0,this.localTransform=new o.TransformMatrix,this._sortKey=``,this._sysEvents=e.sys.events,this.scrollFactorX=1,this.scrollFactorY=1,this.setPosition(t,n),this.setBlendMode(i.SKIP_CHECK),r&&this.add(r)},originX:{get:function(){return .5}},originY:{get:function(){return .5}},displayOriginX:{get:function(){return this.width*.5}},displayOriginY:{get:function(){return this.height*.5}},setExclusive:function(e){return e===void 0&&(e=!0),this.exclusive=e,this},getBounds:function(e){if(e===void 0&&(e=new l),e.setTo(this.x,this.y,0,0),this.parentContainer){var t=this.parentContainer.getBoundsTransformMatrix().transformPoint(this.x,this.y);e.setTo(t.x,t.y,0,0)}if(this.list.length>0){var n=this.list,r=new l,i=!1;e.setEmpty();for(var a=0;a<n.length;a++){var o=n[a];o.getBounds&&(o.getBounds(r),i?d(r,e,e):(e.setTo(r.x,r.y,r.width,r.height),i=!0))}}return e},addHandler:function(e){e.once(s.DESTROY,this.onChildDestroyed,this),this.exclusive&&(e.parentContainer&&e.parentContainer.remove(e),e.parentContainer=this,e.removeFromDisplayList(),e.addedToScene())},removeHandler:function(e){e.off(s.DESTROY,this.remove,this),this.exclusive&&(e.parentContainer=null,e.removedFromScene(),e.addToDisplayList())},pointToContainer:function(e,t){t===void 0&&(t=new f),this.parentContainer?this.parentContainer.pointToContainer(e,t):(t.x=e.x,t.y=e.y);var n=m;return n.applyITRS(this.x,this.y,this.rotation,this.scaleX,this.scaleY),n.invert(),n.transformPoint(e.x,e.y,t),t},getBoundsTransformMatrix:function(){return this.getWorldTransformMatrix(m,this.localTransform)},add:function(e){if(Array.isArray(e))e.forEach(function(e){if(e&&e instanceof p)throw Error(`Tried to add a Layer to a Container: this is not allowed`)});else if(e&&e instanceof p)throw Error(`Tried to add a Layer to a Container: this is not allowed`);return r.Add(this.list,e,this.maxSize,this.addHandler,this),this},addAt:function(e,t){return r.AddAt(this.list,e,t,this.maxSize,this.addHandler,this),this},getAt:function(e){return this.list[e]},getIndex:function(e){return this.list.indexOf(e)},sort:function(e,t){return e?(t===void 0&&(t=function(t,n){return t[e]-n[e]}),r.StableSort(this.list,t),this):this},getByName:function(e){return r.GetFirst(this.list,`name`,e)},getRandom:function(e,t){return r.GetRandom(this.list,e,t)},getFirst:function(e,t,n,i){return r.GetFirst(this.list,e,t,n,i)},getAll:function(e,t,n,i){return r.GetAll(this.list,e,t,n,i)},count:function(e,t,n,i){return r.CountAllMatching(this.list,e,t,n,i)},swap:function(e,t){return r.Swap(this.list,e,t),this},moveTo:function(e,t){return r.MoveTo(this.list,e,t),this},moveAbove:function(e,t){return r.MoveAbove(this.list,e,t),this},moveBelow:function(e,t){return r.MoveBelow(this.list,e,t),this},remove:function(e,t){var n=r.Remove(this.list,e,this.removeHandler,this);if(t&&n){Array.isArray(n)||(n=[n]);for(var i=0;i<n.length;i++)n[i].destroy()}return this},removeAt:function(e,t){var n=r.RemoveAt(this.list,e,this.removeHandler,this);return t&&n&&n.destroy(),this},removeBetween:function(e,t,n){var i=r.RemoveBetween(this.list,e,t,this.removeHandler,this);if(n)for(var a=0;a<i.length;a++)i[a].destroy();return this},removeAll:function(e){var t=this.list;if(e){for(var n=0;n<t.length;n++)t[n]&&t[n].scene&&(t[n].off(s.DESTROY,this.onChildDestroyed,this),t[n].destroy());this.list=[]}else r.RemoveBetween(t,0,t.length,this.removeHandler,this);return this},bringToTop:function(e){return r.BringToTop(this.list,e),this},sendToBack:function(e){return r.SendToBack(this.list,e),this},moveUp:function(e){return r.MoveUp(this.list,e),this},moveDown:function(e){return r.MoveDown(this.list,e),this},reverse:function(){return this.list.reverse(),this},shuffle:function(){return r.Shuffle(this.list),this},replace:function(e,t,n){return r.Replace(this.list,e,t)&&(this.addHandler(t),this.removeHandler(e),n&&e.destroy()),this},exists:function(e){return this.list.indexOf(e)>-1},setAll:function(e,t,n,i){return r.SetAll(this.list,e,t,n,i),this},each:function(e,t){var n=[null],r,i=this.list.slice(),a=i.length;for(r=2;r<arguments.length;r++)n.push(arguments[r]);for(r=0;r<a;r++)n[0]=i[r],e.apply(t,n);return this},iterate:function(e,t){var n=[null],r;for(r=2;r<arguments.length;r++)n.push(arguments[r]);for(r=0;r<this.list.length;r++)n[0]=this.list[r],e.apply(t,n);return this},setScrollFactor:function(e,t,n){return t===void 0&&(t=e),n===void 0&&(n=!1),this.scrollFactorX=e,this.scrollFactorY=t,n&&(r.SetAll(this.list,`scrollFactorX`,e),r.SetAll(this.list,`scrollFactorY`,t)),this},length:{get:function(){return this.list.length}},first:{get:function(){return this.position=0,this.list.length>0?this.list[0]:null}},last:{get:function(){return this.list.length>0?(this.position=this.list.length-1,this.list[this.position]):null}},next:{get:function(){return this.position<this.list.length?(this.position++,this.list[this.position]):null}},previous:{get:function(){return this.position>0?(this.position--,this.list[this.position]):null}},preDestroy:function(){this.removeAll(!!this.exclusive),this.localTransform.destroy(),this.list=[]},onChildDestroyed:function(e){r.Remove(this.list,e),this.exclusive&&(e.parentContainer=null,e.removedFromScene())}})},53584(e){e.exports=function(e,t,n,r){n.addToRenderList(t);var i=t.list;if(i.length!==0){var a=t.localTransform;r?(a.loadIdentity(),a.multiply(r),a.translate(t.x,t.y),a.rotate(t.rotation),a.scale(t.scaleX,t.scaleY)):a.applyITRS(t.x,t.y,t.rotation,t.scaleX,t.scaleY);var o=t.blendMode!==-1;o||e.setBlendMode(0);var s=t._alpha,c=t.scrollFactorX,l=t.scrollFactorY;t.mask&&t.mask.preRenderCanvas(e,null,n);for(var u=0;u<i.length;u++){var d=i[u];if(d.willRender(n)){var f=d.alpha,p=d.scrollFactorX,m=d.scrollFactorY;!o&&d.blendMode!==e.currentBlendMode&&e.setBlendMode(d.blendMode),d.setScrollFactor(p*c,m*l),d.setAlpha(f*s),d.renderCanvas(e,d,n,a),d.setAlpha(f),d.setScrollFactor(p,m)}}t.mask&&t.mask.postRenderCanvas(e)}}},77143(e,t,n){var r=n(25305),i=n(31559),a=n(44603),o=n(23568),s=n(95540);a.register(`container`,function(e,t){e===void 0&&(e={});var n=o(e,`x`,0),a=o(e,`y`,0),c=s(e,`children`,null),l=new i(this.scene,n,a,c);return t!==void 0&&(e.add=t),r(this.scene,l,e),l})},24961(e,t,n){var r=n(31559);n(39429).register(`container`,function(e,t,n){return this.displayList.add(new r(this.scene,e,t,n))})},29959(e,t,n){var r=n(29747),i=r,a=r;i=n(72249),a=n(53584),e.exports={renderWebGL:i,renderCanvas:a}},72249(e,t,n){var r=n(8054);e.exports=function(e,t,n,i,a,o,s){var c=n.camera;c.addToRenderList(t);var l=t.list,u=l.length;if(u!==0){var d=n,f=t.localTransform;i?(f.loadIdentity(),f.multiply(i),f.translate(t.x,t.y),f.rotate(t.rotation),f.scale(t.scaleX,t.scaleY)):f.applyITRS(t.x,t.y,t.rotation,t.scaleX,t.scaleY);var p=t.blendMode!==-1;!p&&d.blendMode!==0&&(d=d.getClone(),d.setBlendMode(0),d.use());for(var m=d,h=t.alpha,g=t.scrollFactorX,_=t.scrollFactorY,v=0;v<u;v++){var y=l[v];if(y.willRender(c)){var b,x,S,C;if(y.alphaTopLeft!==void 0)b=y.alphaTopLeft,x=y.alphaTopRight,S=y.alphaBottomLeft,C=y.alphaBottomRight;else{var w=y.alpha;b=w,x=w,S=w,C=w}var T=y.scrollFactorX,E=y.scrollFactorY;!p&&y.blendMode!==m.blendMode&&y.blendMode!==r.BlendModes.SKIP_CHECK&&(m=d.getClone(),m.setBlendMode(y.blendMode),m.use()),y.setScrollFactor&&y.setScrollFactor(T*g,E*_),y.setAlpha&&y.setAlpha(b*h,x*h,S*h,C*h),y.renderWebGLStep(e,y,m,f,void 0,l,v),y.setAlpha&&y.setAlpha(b,x,S,C),y.setScrollFactor&&y.setScrollFactor(T,E)}}m!==n&&m.release()}}},55327(e,t,n){var r=n(83419),i=n(31559);e.exports=new r({Extends:i,initialize:function(e,t,n,r,a){i.call(this,e,t,n,r),this.customContextCallback=a||null,this.addRenderStep(this.customContextRenderStep,0)},customContextRenderStep:function(e,t,n,r,i,a,o){if(i===void 0&&(i=0),!t.customContextCallback){t.renderWebGLStep(e,t,n,r,i+1,a,o);return}var s=n.getClone();t.customContextCallback(s),s.use(),t.renderWebGLStep(e,t,s,r,i+1,a,o),s.release()}})},90255(e,t,n){var r=n(25305),i=n(44603),a=n(23568),o=n(55327);i.register(`customContext`,function(e,t){e===void 0&&(e={});var n=a(e,`x`,0),i=a(e,`y`,0),s=a(e,`children`,null),c=a(e,`customContextCallback`,void 0),l=new o(this.scene,n,i,s,c);return t!==void 0&&(e.add=t),r(this.scene,l,e),l})},4745(e,t,n){var r=n(55327);n(39429).register(`customcontext`,function(e,t,n,i){return this.displayList.add(new r(this.scene,e,t,n,i))})},47407(e){e.exports=[`normal`,`multiply`,`multiply`,`screen`,`overlay`,`darken`,`lighten`,`color-dodge`,`color-burn`,`hard-light`,`soft-light`,`difference`,`exclusion`,`hue`,`saturation`,`color`,`luminosity`]},3069(e,t,n){var r=n(83419),i=n(31401),a=n(441),o=n(95643),s=n(41212),c=n(35846),l=n(44594),u=n(61369);e.exports=new r({Extends:o,Mixins:[i.AlphaSingle,i.BlendMode,i.Depth,i.Origin,i.ScrollFactor,i.Transform,i.Visible,a],initialize:function(e,t,n,r,i,a){if(o.call(this,e,`DOMElement`),this.parent=e.sys.game.domContainer,!this.parent)throw Error(`No DOM Container set in game config`);this.cache=e.sys.cache.html,this.node,this.transformOnly=!1,this.skewX=0,this.skewY=0,this.rotate3d=new u,this.rotate3dAngle=`deg`,this.pointerEvents=`auto`,this.width=0,this.height=0,this.displayWidth=0,this.displayHeight=0,this.handler=this.dispatchNativeEvent.bind(this),this.setPosition(t,n),typeof r==`string`?r[0]===`#`?this.setElement(r.substr(1),i,a):this.createElement(r,i,a):r&&this.setElement(r,i,a),e.sys.events.on(l.SLEEP,this.handleSceneEvent,this),e.sys.events.on(l.WAKE,this.handleSceneEvent,this),e.sys.events.on(l.PRE_RENDER,this.preRender,this)},handleSceneEvent:function(e){var t=this.node,n=t.style;t&&(n.display=e.settings.visible?`block`:`none`)},setSkew:function(e,t){return e===void 0&&(e=0),t===void 0&&(t=e),this.skewX=e,this.skewY=t,this},setPerspective:function(e){return this.parent.style.perspective=e+`px`,this},perspective:{get:function(){return parseFloat(this.parent.style.perspective)},set:function(e){this.parent.style.perspective=e+`px`}},addListener:function(e){if(this.node){e=e.split(` `);for(var t=0;t<e.length;t++)this.node.addEventListener(e[t],this.handler,!1)}return this},removeListener:function(e){if(this.node){e=e.split(` `);for(var t=0;t<e.length;t++)this.node.removeEventListener(e[t],this.handler)}return this},dispatchNativeEvent:function(e){this.emit(e.type,e)},createElement:function(e,t,n){return this.setElement(document.createElement(e),t,n)},setElement:function(e,t,n){this.removeElement();var r;if(typeof e==`string`?(e[0]===`#`&&(e=e.substr(1)),r=document.getElementById(e)):typeof e==`object`&&e.nodeType===1&&(r=e),!r)return this;if(this.node=r,t&&s(t))for(var i in t)r.style[i]=t[i];else typeof t==`string`&&(r.style=t);return r.style.zIndex=`0`,r.style.display=`inline`,r.style.position=`absolute`,r.phaser=this,this.parent.appendChild(r),n&&(r.innerText=n),this.updateSize()},createFromCache:function(e,t){var n=this.cache.get(e);return n&&this.createFromHTML(n,t),this},createFromHTML:function(e,t){t===void 0&&(t=`div`),this.removeElement();var n=document.createElement(t);return this.node=n,n.style.zIndex=`0`,n.style.display=`inline`,n.style.position=`absolute`,n.phaser=this,this.parent.appendChild(n),n.innerHTML=e,this.updateSize()},removeElement:function(){return this.node&&=(c(this.node),null),this},updateSize:function(){var e=this.node;return this.width=e.clientWidth,this.height=e.clientHeight,this.displayWidth=this.width*this.scaleX,this.displayHeight=this.height*this.scaleY,this},getChildByProperty:function(e,t){if(this.node){for(var n=this.node.querySelectorAll(`*`),r=0;r<n.length;r++)if(n[r][e]===t)return n[r]}return null},getChildByID:function(e){return this.getChildByProperty(`id`,e)},getChildByName:function(e){return this.getChildByProperty(`name`,e)},setClassName:function(e){return this.node&&(this.node.className=e,this.updateSize()),this},setText:function(e){return this.node&&(this.node.innerText=e,this.updateSize()),this},setHTML:function(e){return this.node&&(this.node.innerHTML=e,this.updateSize()),this},preRender:function(){var e=this.parentContainer,t=this.node;t&&e&&!e.willRender()&&(t.style.display=`none`)},willRender:function(){return!0},preDestroy:function(){this.removeElement(),this.scene.sys.events.off(l.SLEEP,this.handleSceneEvent,this),this.scene.sys.events.off(l.WAKE,this.handleSceneEvent,this),this.scene.sys.events.off(l.PRE_RENDER,this.preRender,this)}})},49381(e,t,n){var r=n(47407),i=n(95643),a=n(61340),o=new a,s=new a,c=new a;e.exports=function(e,t,n,a){if(t.node){n.camera&&(n=n.camera);var l=t.node.style,u=t.scene.sys.settings;if(!l||!u.visible||i.RENDER_MASK!==t.renderFlags||t.cameraFilter!==0&&t.cameraFilter&n.id||t.parentContainer&&!t.parentContainer.willRender()){l.display=`none`;return}var d=t.parentContainer,f=n.alpha*t.alpha;d&&(f*=d.alpha);var p=o,m=s,h=c,g=t.width*t.originX,_=t.height*t.originY,v=`0%`,y=`0%`;p.copyWithScrollFactorFrom(n.matrix,n.scrollX,n.scrollY,t.scrollFactorX,t.scrollFactorY),a?(p.multiply(a),g*=t.scaleX,_*=t.scaleY):(v=100*t.originX+`%`,y=100*t.originY+`%`),p.translate(-g,-_),m.applyITRS(t.x,t.y,t.rotation,t.scaleX,t.scaleY),p.multiply(m,h),t.transformOnly||(l.display=`block`,l.opacity=f,l.zIndex=t._depth,l.pointerEvents=t.pointerEvents,l.mixBlendMode=r[t._blendMode]),l.transform=h.getCSSMatrix()+` skew(`+t.skewX+`rad, `+t.skewY+`rad) rotate3d(`+t.rotate3d.x+`,`+t.rotate3d.y+`,`+t.rotate3d.z+`,`+t.rotate3d.w+t.rotate3dAngle+`)`,l.transformOrigin=v+` `+y}}},2611(e,t,n){var r=n(3069);n(39429).register(`dom`,function(e,t,n,i,a){var o=new r(this.scene,e,t,n,i,a);return this.displayList.add(o),o})},441(e,t,n){var r=n(29747),i=r,a=r;i=n(49381),a=n(49381),e.exports={renderWebGL:i,renderCanvas:a}},62980(e){e.exports=`addedtoscene`},41337(e){e.exports=`destroy`},44947(e){e.exports=`removedfromscene`},49358(e){e.exports=`complete`},35163(e){e.exports=`created`},97249(e){e.exports=`error`},19483(e){e.exports=`locked`},56059(e){e.exports=`loop`},26772(e){e.exports=`metadata`},64437(e){e.exports=`playing`},83411(e){e.exports=`play`},75780(e){e.exports=`seeked`},67799(e){e.exports=`seeking`},63500(e){e.exports=`stalled`},55541(e){e.exports=`stop`},53208(e){e.exports=`textureready`},4992(e){e.exports=`unlocked`},12(e){e.exports=`unsupported`},51708(e,t,n){e.exports={ADDED_TO_SCENE:n(62980),DESTROY:n(41337),REMOVED_FROM_SCENE:n(44947),VIDEO_COMPLETE:n(49358),VIDEO_CREATED:n(35163),VIDEO_ERROR:n(97249),VIDEO_LOCKED:n(19483),VIDEO_LOOP:n(56059),VIDEO_METADATA:n(26772),VIDEO_PLAY:n(83411),VIDEO_PLAYING:n(64437),VIDEO_SEEKED:n(75780),VIDEO_SEEKING:n(67799),VIDEO_STALLED:n(63500),VIDEO_STOP:n(55541),VIDEO_TEXTURE:n(53208),VIDEO_UNLOCKED:n(4992),VIDEO_UNSUPPORTED:n(12)}},42421(e,t,n){var r=n(83419),i=n(31401),a=n(95643),o=n(64993);e.exports=new r({Extends:a,Mixins:[i.Alpha,i.BlendMode,i.Depth,i.Flip,i.Origin,i.ScrollFactor,i.Size,i.Texture,i.Tint,i.Transform,i.Visible,o],initialize:function(e){a.call(this,e,`Extern`)},addedToScene:function(){this.scene.sys.updateList.add(this)},removedFromScene:function(){this.scene.sys.updateList.remove(this)},preUpdate:function(){},render:function(){}})},70217(){},56315(e,t,n){var r=n(42421);n(39429).register(`extern`,function(){var e=new r(this.scene);return this.displayList.add(e),e})},64993(e,t,n){var r=n(29747),i=r,a=r;i=n(80287),a=n(70217),e.exports={renderWebGL:i,renderCanvas:a}},80287(e,t,n){var r=n(91296);e.exports=function(e,t,n,i,a,o,s){e.renderNodes.getNode(`YieldContext`).run(n);var c=r(t,n.camera,i,!n.useCanvas).calc;t.render.call(t,e,n,c,o,s),e.renderNodes.getNode(`RebindContext`).run(n)}},34637(e,t,n){var r=n(73043),i=n(26099),a=n(41509),o=n(68589),s=n(83419),c=n(20071);e.exports=new s({Extends:c,initialize:function(e,t,n,s,l,u){t||={};var d={name:`gradient`,fragmentSource:a,shaderAdditions:[{name:`RAMP_0`,tags:`RAMP`,additions:{fragmentHeader:o}}],initialUniforms:{uRampTexture:0},setupUniforms:this._setupUniforms,updateShaderConfig:this._updateShaderConfig};if(c.call(this,e,d,n,s,l,u),this.type=`Gradient`,this.ramp=new r(this.scene,t.bands||{colorStart:0,colorEnd:16777215}),this.offset=t.offset||0,this.repeatMode=t.repeatMode||0,this.shapeMode=t.shapeMode||0,this.start=new i(0,0),t.start&&this.start.copy(t.start),this.shape=new i(1,0),t.shape)this.shape.copy(t.shape);else{var f=t.length===void 0?1:t.length,p=t.direction||0;this.shape.setTo(f*Math.cos(p),f*Math.sin(p))}this.dither=!!t.dither,this.setTextures([this.ramp.dataTexture])},_setupUniforms:function(e,t){e(`uRampResolution`,this.ramp.dataTextureResolution),e(`uRampBandStart`,this.ramp.dataTextureFirstBand),e(`uOffset`,this.offset),e(`uRepeatMode`,this.repeatMode),e(`uShapeMode`,this.shapeMode),e(`uStart`,[this.start.x,1-this.start.y]),e(`uShape`,[this.shape.x,-this.shape.y]),e(`uDither`,this.dither)},_updateShaderConfig:function(e,t,n){var r=t.ramp.bandTreeDepth,i=n.programManager.getAdditionsByTag(`RAMP`)[0];i.name=`RAMP_`+r,i.additions.fragmentHeader=o.replace(`#define BAND_TREE_DEPTH 0.0`,`#define BAND_TREE_DEPTH `+r+`.0`)},preDestroy:function(){this.ramp.destroy(),c.prototype.preDestroy.call(this)}})},26353(e,t,n){var r=n(25305),i=n(44603),a=n(23568),o=n(34637);i.register(`gradient`,function(e,t){e===void 0&&(e={});var n=a(e,`config`,null),i=a(e,`x`,0),s=a(e,`y`,0),c=a(e,`width`,128),l=a(e,`height`,128),u=new o(this.scene,n,i,s,c,l);return t!==void 0&&(e.add=t),r(this.scene,u,e),u})},69315(e,t,n){var r=n(34637);n(39429).register(`gradient`,function(e,t,n,i,a){return this.displayList.add(new r(this.scene,e,t,n,i,a))})},85592(e){e.exports={ARC:0,BEGIN_PATH:1,CLOSE_PATH:2,FILL_RECT:3,LINE_TO:4,MOVE_TO:5,LINE_STYLE:6,FILL_STYLE:7,FILL_PATH:8,STROKE_PATH:9,FILL_TRIANGLE:10,STROKE_TRIANGLE:11,SAVE:14,RESTORE:15,TRANSLATE:16,SCALE:17,ROTATE:18,GRADIENT_FILL_STYLE:21,GRADIENT_LINE_STYLE:22}},43831(e,t,n){var r=n(71911),i=n(83419),a=n(85592),o=n(31401),s=n(8497),c=n(95643),l=n(87891),u=n(95540),d=n(35154),f=n(36383),p=n(84503),m=new i({Extends:c,Mixins:[o.AlphaSingle,o.BlendMode,o.Depth,o.Lighting,o.Mask,o.RenderNodes,o.Transform,o.Visible,o.ScrollFactor,p],initialize:function(e,t){var n=d(t,`x`,0),r=d(t,`y`,0);c.call(this,e,`Graphics`),this.setPosition(n,r),this.initRenderNodes(this._defaultRenderNodesMap),this.displayOriginX=0,this.displayOriginY=0,this.commandBuffer=[],this.defaultFillColor=-1,this.defaultFillAlpha=1,this.defaultStrokeWidth=1,this.defaultStrokeColor=-1,this.defaultStrokeAlpha=1,this._lineWidth=1,this.pathDetailThreshold=-1,this.lineStyle(1,0,0),this.fillStyle(0,0),this.setDefaultStyles(t)},_defaultRenderNodesMap:{get:function(){return l}},setDefaultStyles:function(e){return d(e,`lineStyle`,null)&&(this.defaultStrokeWidth=d(e,`lineStyle.width`,1),this.defaultStrokeColor=d(e,`lineStyle.color`,16777215),this.defaultStrokeAlpha=d(e,`lineStyle.alpha`,1),this.lineStyle(this.defaultStrokeWidth,this.defaultStrokeColor,this.defaultStrokeAlpha)),d(e,`fillStyle`,null)&&(this.defaultFillColor=d(e,`fillStyle.color`,16777215),this.defaultFillAlpha=d(e,`fillStyle.alpha`,1),this.fillStyle(this.defaultFillColor,this.defaultFillAlpha)),this},lineStyle:function(e,t,n){return n===void 0&&(n=1),this.commandBuffer.push(a.LINE_STYLE,e,t,n),this._lineWidth=e,this},fillStyle:function(e,t){return t===void 0&&(t=1),this.commandBuffer.push(a.FILL_STYLE,e,t),this},fillGradientStyle:function(e,t,n,r,i,o,s,c){return i===void 0&&(i=1),o===void 0&&(o=i),s===void 0&&(s=i),c===void 0&&(c=i),this.commandBuffer.push(a.GRADIENT_FILL_STYLE,i,o,s,c,e,t,n,r),this},lineGradientStyle:function(e,t,n,r,i,o){return o===void 0&&(o=1),this.commandBuffer.push(a.GRADIENT_LINE_STYLE,e,o,t,n,r,i),this},beginPath:function(){return this.commandBuffer.push(a.BEGIN_PATH),this},closePath:function(){return this.commandBuffer.push(a.CLOSE_PATH),this},fillPath:function(){return this.commandBuffer.push(a.FILL_PATH),this},fill:function(){return this.commandBuffer.push(a.FILL_PATH),this},strokePath:function(){return this.commandBuffer.push(a.STROKE_PATH),this},stroke:function(){return this.commandBuffer.push(a.STROKE_PATH),this},fillCircleShape:function(e){return this.fillCircle(e.x,e.y,e.radius)},strokeCircleShape:function(e){return this.strokeCircle(e.x,e.y,e.radius)},fillCircle:function(e,t,n){return this.beginPath(),this.arc(e,t,n,0,f.TAU),this.fillPath(),this},strokeCircle:function(e,t,n){return this.beginPath(),this.arc(e,t,n,0,f.TAU),this.strokePath(),this},fillRectShape:function(e){return this.fillRect(e.x,e.y,e.width,e.height)},strokeRectShape:function(e){return this.strokeRect(e.x,e.y,e.width,e.height)},fillRect:function(e,t,n,r){return this.commandBuffer.push(a.FILL_RECT,e,t,n,r),this},strokeRect:function(e,t,n,r){var i=this._lineWidth/2,a=e-i,o=e+i;return this.beginPath(),this.moveTo(e,t),this.lineTo(e,t+r),this.strokePath(),this.beginPath(),this.moveTo(e+n,t),this.lineTo(e+n,t+r),this.strokePath(),this.beginPath(),this.moveTo(a,t),this.lineTo(o+n,t),this.strokePath(),this.beginPath(),this.moveTo(a,t+r),this.lineTo(o+n,t+r),this.strokePath(),this},fillRoundedRect:function(e,t,n,r,i){i===void 0&&(i=20);var a=i,o=i,s=i,c=i;typeof i!=`number`&&(a=u(i,`tl`,20),o=u(i,`tr`,20),s=u(i,`bl`,20),c=u(i,`br`,20));var l=a>=0,d=o>=0,p=s>=0,m=c>=0;return a=Math.abs(a),o=Math.abs(o),s=Math.abs(s),c=Math.abs(c),this.beginPath(),this.moveTo(e+a,t),this.lineTo(e+n-o,t),d?this.arc(e+n-o,t+o,o,-f.PI_OVER_2,0):this.arc(e+n,t,o,Math.PI,f.PI_OVER_2,!0),this.lineTo(e+n,t+r-c),m?this.arc(e+n-c,t+r-c,c,0,f.PI_OVER_2):this.arc(e+n,t+r,c,-f.PI_OVER_2,Math.PI,!0),this.lineTo(e+s,t+r),p?this.arc(e+s,t+r-s,s,f.PI_OVER_2,Math.PI):this.arc(e,t+r,s,0,-f.PI_OVER_2,!0),this.lineTo(e,t+a),l?this.arc(e+a,t+a,a,-Math.PI,-f.PI_OVER_2):this.arc(e,t,a,f.PI_OVER_2,0,!0),this.fillPath(),this},strokeRoundedRect:function(e,t,n,r,i){i===void 0&&(i=20);var a=i,o=i,s=i,c=i,l=Math.min(n,r)/2;typeof i!=`number`&&(a=u(i,`tl`,20),o=u(i,`tr`,20),s=u(i,`bl`,20),c=u(i,`br`,20));var d=a>=0,p=o>=0,m=s>=0,h=c>=0;return a=Math.min(Math.abs(a),l),o=Math.min(Math.abs(o),l),s=Math.min(Math.abs(s),l),c=Math.min(Math.abs(c),l),this.beginPath(),this.moveTo(e+a,t),this.lineTo(e+n-o,t),this.moveTo(e+n-o,t),p?this.arc(e+n-o,t+o,o,-f.PI_OVER_2,0):this.arc(e+n,t,o,Math.PI,f.PI_OVER_2,!0),this.lineTo(e+n,t+r-c),this.moveTo(e+n,t+r-c),h?this.arc(e+n-c,t+r-c,c,0,f.PI_OVER_2):this.arc(e+n,t+r,c,-f.PI_OVER_2,Math.PI,!0),this.lineTo(e+s,t+r),this.moveTo(e+s,t+r),m?this.arc(e+s,t+r-s,s,f.PI_OVER_2,Math.PI):this.arc(e,t+r,s,0,-f.PI_OVER_2,!0),this.lineTo(e,t+a),this.moveTo(e,t+a),d?this.arc(e+a,t+a,a,-Math.PI,-f.PI_OVER_2):this.arc(e,t,a,f.PI_OVER_2,0,!0),this.strokePath(),this},fillPointShape:function(e,t){return this.fillPoint(e.x,e.y,t)},fillPoint:function(e,t,n){return!n||n<1?n=1:(e-=n/2,t-=n/2),this.commandBuffer.push(a.FILL_RECT,e,t,n,n),this},fillTriangleShape:function(e){return this.fillTriangle(e.x1,e.y1,e.x2,e.y2,e.x3,e.y3)},strokeTriangleShape:function(e){return this.strokeTriangle(e.x1,e.y1,e.x2,e.y2,e.x3,e.y3)},fillTriangle:function(e,t,n,r,i,o){return this.commandBuffer.push(a.FILL_TRIANGLE,e,t,n,r,i,o),this},strokeTriangle:function(e,t,n,r,i,o){return this.commandBuffer.push(a.STROKE_TRIANGLE,e,t,n,r,i,o),this},strokeLineShape:function(e){return this.lineBetween(e.x1,e.y1,e.x2,e.y2)},lineBetween:function(e,t,n,r){return this.beginPath(),this.moveTo(e,t),this.lineTo(n,r),this.strokePath(),this},lineTo:function(e,t){return this.commandBuffer.push(a.LINE_TO,e,t),this},moveTo:function(e,t){return this.commandBuffer.push(a.MOVE_TO,e,t),this},strokePoints:function(e,t,n,r){t===void 0&&(t=!1),n===void 0&&(n=!1),r===void 0&&(r=e.length),this.beginPath(),this.moveTo(e[0].x,e[0].y);for(var i=1;i<r;i++)this.lineTo(e[i].x,e[i].y);return t&&this.lineTo(e[0].x,e[0].y),n&&this.closePath(),this.strokePath(),this},fillPoints:function(e,t,n,r){t===void 0&&(t=!1),n===void 0&&(n=!1),r===void 0&&(r=e.length),this.beginPath(),this.moveTo(e[0].x,e[0].y);for(var i=1;i<r;i++)this.lineTo(e[i].x,e[i].y);return t&&this.lineTo(e[0].x,e[0].y),n&&this.closePath(),this.fillPath(),this},strokeEllipseShape:function(e,t){t===void 0&&(t=32);var n=e.getPoints(t);return this.strokePoints(n,!0)},strokeEllipse:function(e,t,n,r,i){i===void 0&&(i=32);var a=new s(e,t,n,r).getPoints(i);return this.strokePoints(a,!0)},fillEllipseShape:function(e,t){t===void 0&&(t=32);var n=e.getPoints(t);return this.fillPoints(n,!0)},fillEllipse:function(e,t,n,r,i){i===void 0&&(i=32);var a=new s(e,t,n,r).getPoints(i);return this.fillPoints(a,!0)},arc:function(e,t,n,r,i,o,s){return o===void 0&&(o=!1),s===void 0&&(s=0),this.commandBuffer.push(a.ARC,e,t,n,r,i,o,s),this},slice:function(e,t,n,r,i,o,s){return o===void 0&&(o=!1),s===void 0&&(s=0),this.commandBuffer.push(a.BEGIN_PATH),this.commandBuffer.push(a.MOVE_TO,e,t),this.commandBuffer.push(a.ARC,e,t,n,r,i,o,s),this.commandBuffer.push(a.CLOSE_PATH),this},save:function(){return this.commandBuffer.push(a.SAVE),this},restore:function(){return this.commandBuffer.push(a.RESTORE),this},translateCanvas:function(e,t){return this.commandBuffer.push(a.TRANSLATE,e,t),this},scaleCanvas:function(e,t){return this.commandBuffer.push(a.SCALE,e,t),this},rotateCanvas:function(e){return this.commandBuffer.push(a.ROTATE,e),this},clear:function(){return this.commandBuffer.length=0,this.defaultFillColor>-1&&this.fillStyle(this.defaultFillColor,this.defaultFillAlpha),this.defaultStrokeColor>-1&&this.lineStyle(this.defaultStrokeWidth,this.defaultStrokeColor,this.defaultStrokeAlpha),this},generateTexture:function(e,t,n){var r=this.scene.sys,i=r.game.renderer;t===void 0&&(t=r.scale.width),n===void 0&&(n=r.scale.height),m.TargetCamera.setScene(this.scene),m.TargetCamera.setViewport(0,0,t,n),m.TargetCamera.scrollX=this.x,m.TargetCamera.scrollY=this.y;var a,o,s={willReadFrequently:!0};if(typeof e==`string`)if(r.textures.exists(e)){a=r.textures.get(e);var c=a.getSourceImage();c instanceof HTMLCanvasElement&&(o=c.getContext(`2d`,s))}else a=r.textures.createCanvas(e,t,n),o=a.getSourceImage().getContext(`2d`,s);else e instanceof HTMLCanvasElement&&(o=e.getContext(`2d`,s));return o&&(this.renderCanvas(i,this,m.TargetCamera,null,o,!1),a&&a.refresh()),this},preDestroy:function(){this.commandBuffer=[]}});m.TargetCamera=new r,e.exports=m},32768(e,t,n){var r=n(85592),i=n(20926);e.exports=function(e,t,n,a,o,s){var c=t.commandBuffer,l=c.length,u=o||e.currentContext;if(!(l===0||!i(e,u,t,n,a))){n.addToRenderList(t);var d=1,f=1,p=0,m=0,h=1,g=0,_=0,v=0;u.beginPath();for(var y=0;y<l;++y)switch(c[y]){case r.ARC:u.arc(c[y+1],c[y+2],c[y+3],c[y+4],c[y+5],c[y+6]),y+=7;break;case r.LINE_STYLE:h=c[y+1],p=c[y+2],d=c[y+3],g=(p&16711680)>>>16,_=(p&65280)>>>8,v=p&255,u.strokeStyle=`rgba(`+g+`,`+_+`,`+v+`,`+d+`)`,u.lineWidth=h,y+=3;break;case r.FILL_STYLE:m=c[y+1],f=c[y+2],g=(m&16711680)>>>16,_=(m&65280)>>>8,v=m&255,u.fillStyle=`rgba(`+g+`,`+_+`,`+v+`,`+f+`)`,y+=2;break;case r.BEGIN_PATH:u.beginPath();break;case r.CLOSE_PATH:u.closePath();break;case r.FILL_PATH:s||u.fill();break;case r.STROKE_PATH:s||u.stroke();break;case r.FILL_RECT:s?u.rect(c[y+1],c[y+2],c[y+3],c[y+4]):u.fillRect(c[y+1],c[y+2],c[y+3],c[y+4]),y+=4;break;case r.FILL_TRIANGLE:u.beginPath(),u.moveTo(c[y+1],c[y+2]),u.lineTo(c[y+3],c[y+4]),u.lineTo(c[y+5],c[y+6]),u.closePath(),s||u.fill(),y+=6;break;case r.STROKE_TRIANGLE:u.beginPath(),u.moveTo(c[y+1],c[y+2]),u.lineTo(c[y+3],c[y+4]),u.lineTo(c[y+5],c[y+6]),u.closePath(),s||u.stroke(),y+=6;break;case r.LINE_TO:u.lineTo(c[y+1],c[y+2]),y+=2;break;case r.MOVE_TO:u.moveTo(c[y+1],c[y+2]),y+=2;break;case r.LINE_FX_TO:u.lineTo(c[y+1],c[y+2]),y+=5;break;case r.MOVE_FX_TO:u.moveTo(c[y+1],c[y+2]),y+=5;break;case r.SAVE:u.save();break;case r.RESTORE:u.restore();break;case r.TRANSLATE:u.translate(c[y+1],c[y+2]),y+=2;break;case r.SCALE:u.scale(c[y+1],c[y+2]),y+=2;break;case r.ROTATE:u.rotate(c[y+1]),y+=1;break;case r.GRADIENT_FILL_STYLE:y+=5;break;case r.GRADIENT_LINE_STYLE:y+=6;break}u.restore()}}},87079(e,t,n){var r=n(44603),i=n(43831);r.register(`graphics`,function(e,t){e===void 0&&(e={}),t!==void 0&&(e.add=t);var n=new i(this.scene,e);return e.add&&this.scene.sys.displayList.add(n),n})},1201(e,t,n){var r=n(43831);n(39429).register(`graphics`,function(e){return this.displayList.add(new r(this.scene,e))})},84503(e,t,n){var r=n(29747),i=r,a=r;i=n(77545),a=n(32768),a=n(32768),e.exports={renderWebGL:i,renderCanvas:a}},77545(e,t,n){var r=n(85592),i=n(91296),a=n(70554),o=n(61340),s=function(e,t,n){this.x=e,this.y=t,this.width=n},c=function(e,t,n){this.points=[],this.points[0]=new s(e,t,n),this.addPoint=function(e,t,n){var r=this.points[this.points.length-1];r.x===e&&r.y===t||this.points.push(new s(e,t,n))}},l=[],u=new o,d=new o,f={TL:0,TR:0,BL:0,BR:0},p={TL:0,TR:0,BL:0,BR:0},m=[{x:0,y:0,width:0},{x:0,y:0,width:0},{x:0,y:0,width:0},{x:0,y:0,width:0}];e.exports=function(e,t,n,o){if(t.commandBuffer.length!==0){var s=t.customRenderNodes,h=t.defaultRenderNodes,g=s.Submitter||h.Submitter,_=t.lighting,v=n,y=v.camera;y.addToRenderList(t);for(var b=i(t,y,o,!n.useCanvas).calc,x=u.loadIdentity(),S=t.commandBuffer,C=t.alpha,w=Math.max(t.pathDetailThreshold,e.config.pathDetailThreshold,0),T=1,E=0,D=0,O=0,k=.01,A=Math.PI*2,j,M=[],N=0,P=!0,F=null,I=a.getTintAppendFloatAlpha,L=0;L<S.length;L++)switch(j=S[L],j){case r.BEGIN_PATH:M.length=0,F=null,P=!0;break;case r.CLOSE_PATH:P=!1,F&&F.points.length&&F.points.push(F.points[0]);break;case r.FILL_PATH:for(b.multiply(x,d),N=0;N<M.length;N++)(s.FillPath||h.FillPath).run(v,d,g,M[N].points,f.TL,f.TR,f.BL,w,_);break;case r.STROKE_PATH:for(b.multiply(x,d),N=0;N<M.length;N++)(s.StrokePath||h.StrokePath).run(v,g,M[N].points,T,P,d,p.TL,p.TR,p.BL,p.BR,w,_);break;case r.LINE_STYLE:T=S[++L];var R=S[++L],z=I(R,S[++L]*C);p.TL=z,p.TR=z,p.BL=z,p.BR=z;break;case r.FILL_STYLE:var ee=S[++L],te=I(ee,S[++L]*C);f.TL=te,f.TR=te,f.BL=te,f.BR=te;break;case r.GRADIENT_FILL_STYLE:var ne=S[++L]*C,B=S[++L]*C,re=S[++L]*C,ie=S[++L]*C;f.TL=I(S[++L],ne),f.TR=I(S[++L],B),f.BL=I(S[++L],re),f.BR=I(S[++L],ie);break;case r.GRADIENT_LINE_STYLE:T=S[++L];var ae=S[++L]*C;p.TL=I(S[++L],ae),p.TR=I(S[++L],ae),p.BL=I(S[++L],ae),p.BR=I(S[++L],ae);break;case r.ARC:var V=0,oe=S[++L],se=S[++L],ce=S[++L],le=S[++L],H=S[++L],ue=S[++L],U=S[++L];for(H-=le,ue?H<-A?H=-A:H>0&&(H=-A+H%A):H>A?H=A:H<0&&(H=A+H%A),F===null&&(F=new c(oe+Math.cos(le)*ce,se+Math.sin(le)*ce,T),M.push(F),V+=k);V<1+U;)O=H*V+le,E=oe+Math.cos(O)*ce,D=se+Math.sin(O)*ce,F.addPoint(E,D,T),V+=k;O=H+le,E=oe+Math.cos(O)*ce,D=se+Math.sin(O)*ce,F.addPoint(E,D,T);break;case r.FILL_RECT:b.multiply(x,d),(s.FillRect||h.FillRect).run(v,d,g,S[++L],S[++L],S[++L],S[++L],f.TL,f.TR,f.BL,f.BR,_);break;case r.FILL_TRIANGLE:b.multiply(x,d),(s.FillTri||h.FillTri).run(v,d,g,S[++L],S[++L],S[++L],S[++L],S[++L],S[++L],f.TL,f.TR,f.BL,_);break;case r.STROKE_TRIANGLE:b.multiply(x,d),m[0].x=S[++L],m[0].y=S[++L],m[0].width=T,m[1].x=S[++L],m[1].y=S[++L],m[1].width=T,m[2].x=S[++L],m[2].y=S[++L],m[2].width=T,m[3].x=m[0].x,m[3].y=m[0].y,m[3].width=T,(s.StrokePath||h.StrokePath).run(v,g,m,T,!1,d,p.TL,p.TR,p.BL,p.BR,_);break;case r.LINE_TO:oe=S[++L],se=S[++L],F===null?(F=new c(oe,se,T),M.push(F)):F.addPoint(oe,se,T);break;case r.MOVE_TO:F=new c(S[++L],S[++L],T),M.push(F);break;case r.SAVE:l.push(x.copyToArray());break;case r.RESTORE:x.copyFromArray(l.pop());break;case r.TRANSLATE:oe=S[++L],se=S[++L],x.translate(oe,se);break;case r.SCALE:oe=S[++L],se=S[++L],x.scale(oe,se);break;case r.ROTATE:x.rotate(S[++L]);break}}}},26479(e,t,n){var r=n(61061),i=n(83419),a=n(51708),o=n(50792),s=n(46710),c=n(95540),l=n(35154),u=n(97022),d=n(41212),f=n(88492),p=n(68287);e.exports=new i({Extends:o,initialize:function(e,t,n){o.call(this),n?t&&!Array.isArray(t)&&(t=[t]):Array.isArray(t)?d(t[0])&&(n=t,t=null):d(t)&&(n=t,t=null),this.scene=e,this.children=new Set,this.isParent=!0,this.type=`Group`,this.classType=c(n,`classType`,p),this.name=c(n,`name`,``),this.active=c(n,`active`,!0),this.maxSize=c(n,`maxSize`,-1),this.defaultKey=c(n,`defaultKey`,null),this.defaultFrame=c(n,`defaultFrame`,null),this.runChildUpdate=c(n,`runChildUpdate`,!1),this.createCallback=c(n,`createCallback`,null),this.removeCallback=c(n,`removeCallback`,null),this.createMultipleCallback=c(n,`createMultipleCallback`,null),this.internalCreateCallback=c(n,`internalCreateCallback`,null),this.internalRemoveCallback=c(n,`internalRemoveCallback`,null),t&&this.addMultiple(t),n&&this.createMultiple(n),this.on(a.ADDED_TO_SCENE,this.addedToScene,this),this.on(a.REMOVED_FROM_SCENE,this.removedFromScene,this)},addedToScene:function(){this.scene.sys.updateList.add(this)},removedFromScene:function(){this.scene.sys.updateList.remove(this)},create:function(e,t,n,r,i,a){if(e===void 0&&(e=0),t===void 0&&(t=0),n===void 0&&(n=this.defaultKey),r===void 0&&(r=this.defaultFrame),i===void 0&&(i=!0),a===void 0&&(a=!0),this.isFull())return null;var o=new this.classType(this.scene,e,t,n,r);return o.addToDisplayList(this.scene.sys.displayList),o.addToUpdateList(),o.visible=i,o.setActive(a),this.add(o),o},createMultiple:function(e){if(this.isFull())return[];Array.isArray(e)||(e=[e]);var t=[];if(e[0].key)for(var n=0;n<e.length;n++){var r=this.createFromConfig(e[n]);t=t.concat(r)}return t},createFromConfig:function(e){if(this.isFull())return[];this.classType=c(e,`classType`,this.classType);var t=c(e,`key`,void 0),n=c(e,`frame`,null),i=c(e,`visible`,!0),a=c(e,`active`,!0),o=[];if(t===void 0)return o;Array.isArray(t)||(t=[t]),Array.isArray(n)||(n=[n]);var s=c(e,`repeat`,0),d=c(e,`randomKey`,!1),p=c(e,`randomFrame`,!1),m=c(e,`yoyo`,!1),h=c(e,`quantity`,!1),g=c(e,`frameQuantity`,1),_=c(e,`max`,0),v=f(t,n,{max:_,qty:h||g,random:d,randomB:p,repeat:s,yoyo:m});e.createCallback&&(this.createCallback=e.createCallback),e.removeCallback&&(this.removeCallback=e.removeCallback),e.internalCreateCallback&&(this.internalCreateCallback=e.internalCreateCallback),e.internalRemoveCallback&&(this.internalRemoveCallback=e.internalRemoveCallback);for(var y=0;y<v.length;y++){var b=this.create(0,0,v[y].a,v[y].b,i,a);if(!b)break;o.push(b)}if(u(e,`setXY`)){var x=l(e,`setXY.x`,0),S=l(e,`setXY.y`,0),C=l(e,`setXY.stepX`,0),w=l(e,`setXY.stepY`,0);r.SetXY(o,x,S,C,w)}if(u(e,`setRotation`)){var T=l(e,`setRotation.value`,0),E=l(e,`setRotation.step`,0);r.SetRotation(o,T,E)}if(u(e,`setScale`)){var D=l(e,`setScale.x`,1),O=l(e,`setScale.y`,D),k=l(e,`setScale.stepX`,0),A=l(e,`setScale.stepY`,0);r.SetScale(o,D,O,k,A)}if(u(e,`setOrigin`)){var j=l(e,`setOrigin.x`,.5),M=l(e,`setOrigin.y`,j),N=l(e,`setOrigin.stepX`,0),P=l(e,`setOrigin.stepY`,0);r.SetOrigin(o,j,M,N,P)}if(u(e,`setAlpha`)){var F=l(e,`setAlpha.value`,1),I=l(e,`setAlpha.step`,0);r.SetAlpha(o,F,I)}if(u(e,`setDepth`)){var L=l(e,`setDepth.value`,0),R=l(e,`setDepth.step`,0);r.SetDepth(o,L,R)}if(u(e,`setScrollFactor`)){var z=l(e,`setScrollFactor.x`,1),ee=l(e,`setScrollFactor.y`,z),te=l(e,`setScrollFactor.stepX`,0),ne=l(e,`setScrollFactor.stepY`,0);r.SetScrollFactor(o,z,ee,te,ne)}var B=c(e,`hitArea`,null),re=c(e,`hitAreaCallback`,null);B&&r.SetHitArea(o,B,re);var ie=c(e,`gridAlign`,!1);return ie&&r.GridAlign(o,ie),this.createMultipleCallback&&this.createMultipleCallback.call(this,o),o},preUpdate:function(e,t){!this.runChildUpdate||this.children.size===0||this.children.forEach(function(n){n.active&&n.update(e,t)})},add:function(e,t){return t===void 0&&(t=!1),this.isFull()?this:(this.children.add(e),this.internalCreateCallback&&this.internalCreateCallback.call(this,e),this.createCallback&&this.createCallback.call(this,e),t&&(e.addToDisplayList(this.scene.sys.displayList),e.addToUpdateList()),e.on(a.DESTROY,this.remove,this),this)},addMultiple:function(e,t){if(t===void 0&&(t=!1),Array.isArray(e))for(var n=0;n<e.length;n++)this.add(e[n],t);return this},remove:function(e,t,n){return t===void 0&&(t=!1),n===void 0&&(n=!1),this.children.has(e)?(this.children.delete(e),this.internalRemoveCallback&&this.internalRemoveCallback.call(this,e),this.removeCallback&&this.removeCallback.call(this,e),e.off(a.DESTROY,this.remove,this),n?e.destroy():t&&(e.removeFromDisplayList(),e.removeFromUpdateList()),this):this},clear:function(e,t){e===void 0&&(e=!1),t===void 0&&(t=!1);var n=this.children;return n.forEach(function(n){n.off(a.DESTROY,this.remove,this),t?n.destroy():e&&(n.removeFromDisplayList(),n.removeFromUpdateList())},this),n.clear(),this},contains:function(e){return this.children.has(e)},getChildren:function(){return Array.from(this.children)},getLength:function(){return this.children.size},getMatching:function(e,t,n,r){return s(Array.from(this.children),e,t,n,r)},getFirst:function(e,t,n,r,i,a,o){return this.getHandler(!0,1,e,t,n,r,i,a,o)},getFirstNth:function(e,t,n,r,i,a,o,s){return this.getHandler(!0,e,t,n,r,i,a,o,s)},getLast:function(e,t,n,r,i,a,o){return this.getHandler(!1,1,e,t,n,r,i,a,o)},getLastNth:function(e,t,n,r,i,a,o,s){return this.getHandler(!1,e,t,n,r,i,a,o,s)},getHandler:function(e,t,n,r,i,a,o,s,c){n===void 0&&(n=!1),r===void 0&&(r=!1);var l,u,d=0,f=Array.from(this.children);if(e)for(u=0;u<f.length;u++)if(l=f[u],l.active===n){if(d++,d===t)break}else l=null;else for(u=f.length-1;u>=0;u--)if(l=f[u],l.active===n){if(d++,d===t)break}else l=null;return l?(typeof i==`number`&&(l.x=i),typeof a==`number`&&(l.y=a),l):r?this.create(i,a,o,s,c):null},get:function(e,t,n,r,i){return this.getFirst(!1,!0,e,t,n,r,i)},getFirstAlive:function(e,t,n,r,i,a){return this.getFirst(!0,e,t,n,r,i,a)},getFirstDead:function(e,t,n,r,i,a){return this.getFirst(!1,e,t,n,r,i,a)},playAnimation:function(e,t){return r.PlayAnimation(Array.from(this.children),e,t),this},isFull:function(){return this.maxSize!==-1&&this.children.size>=this.maxSize},countActive:function(e){e===void 0&&(e=!0);var t=0;return this.children.forEach(function(n){n.active===e&&t++}),t},getTotalUsed:function(){return this.countActive()},getTotalFree:function(){var e=this.getTotalUsed();return(this.maxSize===-1?999999999999:this.maxSize)-e},setActive:function(e){return this.active=e,this},setName:function(e){return this.name=e,this},propertyValueSet:function(e,t,n,i,a){return r.PropertyValueSet(Array.from(this.children),e,t,n,i,a),this},propertyValueInc:function(e,t,n,i,a){return r.PropertyValueInc(Array.from(this.children),e,t,n,i,a),this},setX:function(e,t){return r.SetX(Array.from(this.children),e,t),this},setY:function(e,t){return r.SetY(Array.from(this.children),e,t),this},setXY:function(e,t,n,i){return r.SetXY(Array.from(this.children),e,t,n,i),this},incX:function(e,t){return r.IncX(Array.from(this.children),e,t),this},incY:function(e,t){return r.IncY(Array.from(this.children),e,t),this},incXY:function(e,t,n,i){return r.IncXY(Array.from(this.children),e,t,n,i),this},shiftPosition:function(e,t,n){return r.ShiftPosition(Array.from(this.children),e,t,n),this},angle:function(e,t){return r.Angle(Array.from(this.children),e,t),this},rotate:function(e,t){return r.Rotate(Array.from(this.children),e,t),this},rotateAround:function(e,t){return r.RotateAround(Array.from(this.children),e,t),this},rotateAroundDistance:function(e,t,n){return r.RotateAroundDistance(Array.from(this.children),e,t,n),this},setAlpha:function(e,t){return r.SetAlpha(Array.from(this.children),e,t),this},setTint:function(e,t,n,i){return r.SetTint(Array.from(this.children),e,t,n,i),this},setOrigin:function(e,t,n,i){return r.SetOrigin(Array.from(this.children),e,t,n,i),this},scaleX:function(e,t){return r.ScaleX(Array.from(this.children),e,t),this},scaleY:function(e,t){return r.ScaleY(Array.from(this.children),e,t),this},scaleXY:function(e,t,n,i){return r.ScaleXY(Array.from(this.children),e,t,n,i),this},setDepth:function(e,t){return r.SetDepth(Array.from(this.children),e,t),this},setBlendMode:function(e){return r.SetBlendMode(Array.from(this.children),e),this},setHitArea:function(e,t){return r.SetHitArea(Array.from(this.children),e,t),this},shuffle:function(){return r.Shuffle(Array.from(this.children)),this},kill:function(e){this.children.has(e)&&e.setActive(!1)},killAndHide:function(e){this.children.has(e)&&(e.setActive(!1),e.setVisible(!1))},setVisible:function(e,t,n){return r.SetVisible(Array.from(this.children),e,t,n),this},toggleVisible:function(){return r.ToggleVisible(Array.from(this.children)),this},destroy:function(e,t){e===void 0&&(e=!1),t===void 0&&(t=!1),!(!this.scene||this.ignoreDestroy)&&(this.emit(a.DESTROY,this),this.removeAllListeners(),this.scene.sys.updateList.remove(this),this.clear(t,e),this.scene=void 0,this.children=void 0)}})},94975(e,t,n){var r=n(44603),i=n(26479);r.register(`group`,function(e){return new i(this.scene,null,e)})},3385(e,t,n){var r=n(26479);n(39429).register(`group`,function(e,t){return this.updateList.add(new r(this.scene,e,t))})},88571(e,t,n){var r=n(40939),i=n(83419),a=n(31401),o=n(95643),s=n(59819);e.exports=new i({Extends:o,Mixins:[a.Alpha,a.BlendMode,a.Depth,a.Flip,a.GetBounds,a.Lighting,a.Mask,a.Origin,a.RenderNodes,a.ScrollFactor,a.Size,a.TextureCrop,a.Tint,a.Transform,a.Visible,s],initialize:function(e,t,n,r,i){o.call(this,e,`Image`),this._crop=this.resetCropObject(),this.setTexture(r,i),this.setPosition(t,n),this.setSizeToFrame(),this.setOriginFromFrame(),this.initRenderNodes(this._defaultRenderNodesMap)},_defaultRenderNodesMap:{get:function(){return r}}})},40652(e){e.exports=function(e,t,n,r){n.addToRenderList(t),e.batchSprite(t,t.frame,n,r)}},82459(e,t,n){var r=n(25305),i=n(44603),a=n(23568),o=n(88571);i.register(`image`,function(e,t){e===void 0&&(e={});var n=a(e,`key`,null),i=a(e,`frame`,null),s=new o(this.scene,0,0,n,i);return t!==void 0&&(e.add=t),r(this.scene,s,e),s})},2117(e,t,n){var r=n(88571);n(39429).register(`image`,function(e,t,n,i){return this.displayList.add(new r(this.scene,e,t,n,i))})},59819(e,t,n){var r=n(29747),i=r,a=r;i=n(99517),a=n(40652),e.exports={renderWebGL:i,renderCanvas:a}},99517(e){e.exports=function(e,t,n,r){n.camera.addToRenderList(t);var i=t.customRenderNodes,a=t.defaultRenderNodes;(i.Submitter||a.Submitter).run(n,t,r,0,i.Texturer||a.Texturer,i.Transformer||a.Transformer)}},77856(e,t,n){var r={Events:n(51708),DisplayList:n(8050),GameObjectCreator:n(44603),GameObjectFactory:n(39429),UpdateList:n(45027),Components:n(31401),GetCalcMatrix:n(91296),BuildGameObject:n(25305),BuildGameObjectAnimation:n(13059),GameObject:n(95643),BitmapText:n(22186),Blitter:n(6107),Bob:n(46590),Container:n(31559),DOMElement:n(3069),DynamicBitmapText:n(2638),Extern:n(42421),Graphics:n(43831),Group:n(26479),Image:n(88571),Layer:n(93595),Particles:n(18404),PathFollower:n(1159),RenderTexture:n(591),RetroFont:n(196),Rope:n(77757),Sprite:n(68287),Stamp:n(14727),Text:n(50171),GetTextSize:n(14220),MeasureText:n(79557),TextStyle:n(35762),TileSprite:n(20839),Zone:n(41481),Video:n(18471),Shape:n(17803),Arc:n(23629),Curve:n(89),Ellipse:n(19921),Grid:n(30479),IsoBox:n(61475),IsoTriangle:n(16933),Line:n(57847),Polygon:n(24949),Rectangle:n(74561),Star:n(55911),Triangle:n(36931),Factories:{Blitter:n(12709),Container:n(24961),DOMElement:n(2611),DynamicBitmapText:n(72566),Extern:n(56315),Graphics:n(1201),Group:n(3385),Image:n(2117),Layer:n(20005),Particles:n(676),PathFollower:n(90145),RenderTexture:n(60505),Rope:n(96819),Sprite:n(46409),Stamp:n(85326),StaticBitmapText:n(34914),Text:n(68005),TileSprite:n(91681),Zone:n(84175),Video:n(89025),Arc:n(42563),Curve:n(40511),Ellipse:n(1543),Grid:n(34137),IsoBox:n(3933),IsoTriangle:n(49803),Line:n(2481),Polygon:n(64827),Rectangle:n(87959),Star:n(93697),Triangle:n(45245)},Creators:{Blitter:n(9403),Container:n(77143),DynamicBitmapText:n(11164),Graphics:n(87079),Group:n(94975),Image:n(82459),Layer:n(25179),Particles:n(92730),RenderTexture:n(34495),Rope:n(26209),Sprite:n(15567),Stamp:n(31479),StaticBitmapText:n(57336),Text:n(71259),TileSprite:n(14167),Zone:n(95261),Video:n(11511)}};r.CaptureFrame=n(43451),r.CustomContext=n(55327),r.Gradient=n(34637),r.Mesh2D=n(76435),r.Noise=n(35387),r.NoiseCell2D=n(51513),r.NoiseCell3D=n(15686),r.NoiseCell4D=n(41946),r.NoiseSimplex2D=n(1792),r.NoiseSimplex3D=n(51098),r.Shader=n(20071),r.NineSlice=n(28103),r.PointLight=n(80321),r.SpriteGPULayer=n(76573),r.Stencil=n(84423),r.StencilReference=n(63911),r.Factories.CaptureFrame=n(20421),r.Factories.CustomContext=n(4745),r.Factories.Gradient=n(69315),r.Factories.Mesh2D=n(2317),r.Factories.Noise=n(34757),r.Factories.NoiseCell2D=n(26590),r.Factories.NoiseCell3D=n(89918),r.Factories.NoiseCell4D=n(65874),r.Factories.NoiseSimplex2D=n(80308),r.Factories.NoiseSimplex3D=n(73810),r.Factories.Shader=n(74177),r.Factories.NineSlice=n(47521),r.Factories.PointLight=n(71255),r.Factories.SpriteGPULayer=n(96019),r.Factories.Stencil=n(67841),r.Factories.StencilReference=n(37889),r.Creators.CaptureFrame=n(23675),r.Creators.CustomContext=n(90255),r.Creators.Gradient=n(26353),r.Creators.Mesh2D=n(2227),r.Creators.Noise=n(39931),r.Creators.NoiseCell2D=n(98292),r.Creators.NoiseCell3D=n(97044),r.Creators.NoiseCell4D=n(20136),r.Creators.NoiseSimplex2D=n(51754),r.Creators.NoiseSimplex3D=n(71112),r.Creators.Shader=n(54935),r.Creators.NineSlice=n(28279),r.Creators.PointLight=n(39829),r.Creators.SpriteGPULayer=n(16193),r.Creators.Stencil=n(32247),r.Creators.StencilReference=n(44023),r.Light=n(41432),r.LightsManager=n(61356),r.LightsPlugin=n(88992),e.exports=r},93595(e,t,n){var r=n(10312),i=n(83419),a=n(31401),o=n(50792),s=n(95643),c=n(51708),l=n(73162),u=n(33963),d=n(44594),f=n(19186);e.exports=new i({Extends:l,Mixins:[o,s,a.AlphaSingle,a.BlendMode,a.Depth,a.Mask,a.Visible,u],initialize:function(e,t){l.call(this,e),o.call(this),s.call(this,e,`Layer`),this.scene=e,this.systems=e.sys,this.events=e.sys.events,this.sortChildrenFlag=!1,this.addCallback=this.addChildCallback,this.removeCallback=this.removeChildCallback,this.clearAlpha(),this.setBlendMode(r.SKIP_CHECK),t&&this.add(t),e.sys.queueDepthSort()},setInteractive:function(){return this},disableInteractive:function(){return this},removeInteractive:function(){return this},willRender:function(e){return!(this.renderFlags!==15||this.list.length===0||this.cameraFilter!==0&&this.cameraFilter&e.id)},addChildCallback:function(e){var t=e.displayList;t&&t!==this&&e.removeFromDisplayList(),e.displayList||(this.queueDepthSort(),e.displayList=this,e.emit(c.ADDED_TO_SCENE,e,this.scene),this.events.emit(d.ADDED_TO_SCENE,e,this.scene))},removeChildCallback:function(e){this.queueDepthSort(),e.displayList=null,e.emit(c.REMOVED_FROM_SCENE,e,this.scene),this.events.emit(d.REMOVED_FROM_SCENE,e,this.scene)},queueDepthSort:function(){this.sortChildrenFlag=!0},depthSort:function(){this.sortChildrenFlag&&=(f(this.list,this.sortByDepth),!1)},sortByDepth:function(e,t){return e._depth-t._depth},getChildren:function(){return this.list},destroy:function(e){if(!(!this.scene||this.ignoreDestroy)){s.prototype.destroy.call(this,e);for(var t=this.list;t.length;)t[0].destroy(e);this.list=void 0,this.systems=void 0,this.events=void 0}}})},2956(e){e.exports=function(e,t,n){var r=t.list;if(r.length!==0){t.depthSort();var i=t.blendMode!==-1;i||e.setBlendMode(0);var a=t._alpha;t.mask&&t.mask.preRenderCanvas(e,null,n);for(var o=0;o<r.length;o++){var s=r[o];if(s.willRender(n)){var c=s.alpha;!i&&s.blendMode!==e.currentBlendMode&&e.setBlendMode(s.blendMode),s.setAlpha(c*a),s.renderCanvas(e,s,n),s.setAlpha(c)}}t.mask&&t.mask.postRenderCanvas(e)}}},25179(e,t,n){var r=n(25305),i=n(93595),a=n(44603),o=n(23568);a.register(`layer`,function(e,t){e===void 0&&(e={});var n=o(e,`children`,null),a=new i(this.scene,n);return t!==void 0&&(e.add=t),r(this.scene,a,e),a})},20005(e,t,n){var r=n(93595);n(39429).register(`layer`,function(e){return this.displayList.add(new r(this.scene,e))})},33963(e,t,n){var r=n(29747),i=r,a=r;i=n(15869),a=n(2956),e.exports={renderWebGL:i,renderCanvas:a}},15869(e,t,n){var r=n(8054);e.exports=function(e,t,n,i,a,o,s){var c=t.list,l=c.length;if(l!==0){var u=n,d=u.camera;t.depthSort();var f=t.blendMode!==r.BlendModes.SKIP_CHECK;!f&&u.blendMode!==0&&(u=u.getClone(),u.setBlendMode(0),u.use());for(var p=t.alpha,m=0;m<l;m++){var h=c[m];if(h.willRender(d)){var g,_,v,y;if(h.alphaTopLeft!==void 0)g=h.alphaTopLeft,_=h.alphaTopRight,v=h.alphaBottomLeft,y=h.alphaBottomRight;else{var b=h.alpha;g=b,_=b,v=b,y=b}!f&&h.blendMode!==u.blendMode&&h.blendMode!==r.BlendModes.SKIP_CHECK&&(u=u.getClone(),u.setBlendMode(h.blendMode),u.use()),h.setAlpha(g*p,_*p,v*p,y*p),h.renderWebGLStep(e,h,u,void 0,void 0,c,m),h.setAlpha(g,_,v,y)}}u!==n&&u.release()}}},41432(e,t,n){var r=n(96503),i=n(83419),a=n(31401),o=n(51767),s=n(70554),c=new i({Extends:r,Mixins:[a.Origin,a.ScrollFactor,a.Visible],initialize:function(e,t,n,i,a,s,c,l){r.call(this,e,t,n),this.color=new o(i,a,s),this.intensity=c,this.z=l===void 0?n*.1:l,this.coneEnabled=!1,this.coneRotation=0,this.coneInnerAngle=0,this.coneOuterAngle=0,this.renderFlags=15,this.cameraFilter=0,this.setScrollFactor(1,1),this.setOrigin(),this.setDisplayOrigin(n)},displayWidth:{get:function(){return this.diameter},set:function(e){this.diameter=e}},displayHeight:{get:function(){return this.diameter},set:function(e){this.diameter=e}},width:{get:function(){return this.diameter},set:function(e){this.diameter=e}},height:{get:function(){return this.diameter},set:function(e){this.diameter=e}},zNormal:{get:function(){return this.z/this.radius},set:function(e){this.z=e*this.radius}},willRender:function(e){return!(c.RENDER_MASK!==this.renderFlags||this.cameraFilter!==0&&this.cameraFilter&e.id)},setColor:function(e){var t=s.getFloatsFromUintRGB(e);return this.color.set(t[0],t[1],t[2]),this},setIntensity:function(e){return this.intensity=e,this},setRadius:function(e){return this.radius=e,this},setZ:function(e){return this.z=e,this},setZNormal:function(e){return this.z=e*this.radius,this},setCone:function(e,t,n){return n===void 0&&(n=t),t=Math.max(0,Math.min(Math.PI*2,t)),n=Math.max(0,Math.min(Math.PI*2,n)),n<t&&(n=t),this.coneEnabled=!0,this.coneRotation=e,this.coneInnerAngle=t,this.coneOuterAngle=n,this},setConeRotation:function(e){return this.coneRotation=e,this},setConeAngles:function(e,t){return t===void 0&&(t=e),e=Math.max(0,Math.min(Math.PI*2,e)),t=Math.max(0,Math.min(Math.PI*2,t)),t<e&&(t=e),this.coneInnerAngle=e,this.coneOuterAngle=t,this},disableCone:function(){return this.coneEnabled=!1,this}});c.RENDER_MASK=15,e.exports=c},61356(e,t,n){var r=n(81491),i=n(83419),a=n(20339),o=n(41432),s=n(80321),c=n(51767),l=n(19133),u=n(19186),d=n(70554);e.exports=new i({initialize:function(){this.lights=[],this.ambientColor=new c(.1,.1,.1),this.active=!1,this.maxLights=-1,this.visibleLights=0},addPointLight:function(e,t,n,r,i,a){return this.systems.displayList.add(new s(this.scene,e,t,n,r,i,a))},enable:function(){return this.maxLights===-1&&(this.maxLights=this.systems.renderer.config.maxLights),this.active=!0,this},disable:function(){return this.active=!1,this},getLights:function(e){for(var t=this.lights,n=e.worldView,i=[],o=0;o<t.length;o++){var s=t[o];s.willRender(e)&&r(s,n)&&i.push({light:s,distance:a(s.x,s.y,n.centerX,n.centerY)})}return i.length>this.maxLights&&(u(i,this.sortByDistance),i=i.slice(0,this.maxLights)),this.visibleLights=i.length,i},sortByDistance:function(e,t){return e.distance>=t.distance},setAmbientColor:function(e){var t=d.getFloatsFromUintRGB(e);return this.ambientColor.set(t[0],t[1],t[2]),this},getMaxVisibleLights:function(){return this.maxLights},getLightCount:function(){return this.lights.length},addLight:function(e,t,n,r,i,a){e===void 0&&(e=0),t===void 0&&(t=0),n===void 0&&(n=128),r===void 0&&(r=16777215),i===void 0&&(i=1),a===void 0&&(a=n*.1);var s=d.getFloatsFromUintRGB(r),c=new o(e,t,n,s[0],s[1],s[2],i,a);return this.lights.push(c),c},addConeLight:function(e,t,n,r,i,a,o,s,c){return a===void 0&&(a=0),o===void 0&&(o=Math.PI/4),this.addLight(e,t,n,r,i,c).setCone(a,o,s)},removeLight:function(e){var t=this.lights.indexOf(e);return t>=0&&l(this.lights,t),this},shutdown:function(){this.lights.length=0},destroy:function(){this.shutdown()}})},88992(e,t,n){var r=n(83419),i=n(61356),a=n(37277),o=n(44594),s=new r({Extends:i,initialize:function(e){this.scene=e,this.systems=e.sys,e.sys.settings.isBooted||e.sys.events.once(o.BOOT,this.boot,this),i.call(this)},boot:function(){var e=this.systems.events;e.on(o.SHUTDOWN,this.shutdown,this),e.on(o.DESTROY,this.destroy,this)},destroy:function(){this.shutdown(),this.scene=void 0,this.systems=void 0}});a.register(`LightsPlugin`,s,`lights`),e.exports=s},76435(e,t,n){var r=n(84322),i=n(2389),a=n(83419),o=n(31401),s=n(95643),c=n(63635);e.exports=new a({Extends:s,Mixins:[o.AlphaSingle,o.BlendMode,o.ComputedSize,o.Depth,o.Flip,o.GetBounds,o.Lighting,o.Origin,o.RenderNodes,o.ScrollFactor,o.TextureCrop,o.Transform,o.Visible,c],initialize:function(e,t,n,i,a,o,c){s.call(this,e,`Mesh2D`),this.setTexture(i),this.setPosition(t,n),this.initRenderNodes(this._defaultRenderNodesMap),this.vertices=a,this.indices=o,this.indicesOrdered=null,this.useOrderedIndices=!1,this.renderAsTriangles=!1,this.flipV=!!c,this.tintMode=r.MULTIPLY,this.tint=16777215,this.tint2=0},_defaultRenderNodesMap:{get:function(){return i}},clearTint:function(){return this.tintMode=r.MULTIPLY,this.tint=16777215,this.tint2=0,this},setTint:function(e){return this.tint=e,this},setTint2:function(e){return this.tint2=e,this},setTintMode:function(e){return this.tintMode=e,this},isTinted:function(){return this.tint!==16777215||this.tint2!==0||this.tintMode!==r.MULTIPLY},setFlipV:function(e){return this.flipV=!!e,this},setUseOrderedIndices:function(e){return this.useOrderedIndices=!!e,this},setRenderAsTriangles:function(e){return this.renderAsTriangles=!!e,this},buildOrderedIndices:function(e,t){e===void 0&&(e=0),t!==void 0&&(this.useOrderedIndices=!!t);var n=this.indices,r=n.length/4|0,i=this.vertices.length/4|0,a=[];return e===1?this._buildOrderedIndicesNext(n,r,i,a):e===2?this._buildOrderedIndicesAll(n,r,i,a):this._buildOrderedIndicesFast(n,r,a),this.indicesOrdered=a,this},_buildOrderedIndicesFast:function(e,t,n){for(var r=0;r<t;r++){var i=r*4;this._pushDegenerateQuad(n,e[i],e[i+1],e[i+2],e[i+3])}},_buildOrderedIndicesNext:function(e,t,n,r){for(var i=0;i<t;i++){var a=i*4,o=e[a],s=e[a+1],c=e[a+2],l=e[a+3],u=!1,d=i+1;if(d<t){var f=d*4;if(l===e[f+3]){var p=this._sharedEdgeQuad(o,s,c,e[f],e[f+1],e[f+2],n);p&&(this._pushQuad(r,p[0],p[1],p[2],p[3],l),i=d,u=!0)}}u||this._pushDegenerateQuad(r,o,s,c,l)}},_buildOrderedIndicesAll:function(e,t,n,r){var i={},a,o,s,c,l,u;for(a=0;a<t;a++)o=a*4,s=e[o],c=e[o+1],l=e[o+2],u=e[o+3],this._addEdge(i,s,c,l,a,u,n),this._addEdge(i,c,l,s,a,u,n),this._addEdge(i,l,s,c,a,u,n);var d=[];for(a=0;a<t;a++)d[a]||(o=a*4,s=e[o],c=e[o+1],l=e[o+2],u=e[o+3],d[a]=!0,this._matchEdge(i,d,r,a,s,c,l,u,n)||this._matchEdge(i,d,r,a,c,l,s,u,n)||this._matchEdge(i,d,r,a,l,s,c,u,n)||this._pushDegenerateQuad(r,s,c,l,u))},_addEdge:function(e,t,n,r,i,a,o){var s=t<n?t*o+n:n*o+t,c=e[s];c||=e[s]=[],c.push({tri:i,opp:r,page:a})},_matchEdge:function(e,t,n,r,i,a,o,s,c){var l=e[a<o?a*c+o:o*c+a];if(!l)return!1;for(var u=0;u<l.length;u++){var d=l[u];if(d.tri!==r&&!t[d.tri]&&d.page===s)return t[d.tri]=!0,this._pushQuad(n,i,a,o,d.opp,s),!0}return!1},_sharedEdgeQuad:function(e,t,n,r,i,a,o){for(var s=[[this._edgeKey(e,t,o),n,e,t],[this._edgeKey(t,n,o),e,t,n],[this._edgeKey(n,e,o),t,n,e]],c=[[this._edgeKey(r,i,o),a],[this._edgeKey(i,a,o),r],[this._edgeKey(a,r,o),i]],l=0;l<3;l++)for(var u=0;u<3;u++)if(s[l][0]===c[u][0])return[s[l][1],s[l][2],s[l][3],c[u][1]];return null},_edgeKey:function(e,t,n){return e<t?e*n+t:t*n+e},_pushQuad:function(e,t,n,r,i,a){e.push(t,n,r,a,n,r,i,a)},_pushDegenerateQuad:function(e,t,n,r,i){e.push(t,n,r,i,n,r,r,i)}})},2227(e,t,n){var r=n(25305),i=n(44603),a=n(23568),o=n(76435);i.register(`mesh2d`,function(e,t){e===void 0&&(e={});var n=a(e,`key`,null),i=a(e,`vertices`,[]),s=a(e,`indices`,[]),c=a(e,`flipV`,!1),l=new o(this.scene,0,0,n,i,s,c);return t!==void 0&&(e.add=t),r(this.scene,l,e),l})},2317(e,t,n){var r=n(76435);n(39429).register(`mesh2d`,function(e,t,n,i,a,o){return this.displayList.add(new r(this.scene,e,t,n,i,a,o))})},63635(e,t,n){var r=n(29747);e.exports={renderWebGL:n(43909),renderCanvas:r}},43909(e){e.exports=function(e,t,n,r){n.camera.addToRenderList(t);var i=t.customRenderNodes,a=t.defaultRenderNodes,o=i.Transformer||a.Transformer,s=i.Submitter||a.Submitter;if(t.renderAsTriangles){var c=i.BatchHandlerTriangles||a.BatchHandlerTriangles;s.setRenderOptions(t),c.batchTriangles(n,t,r,o,t.vertices,t.indices,s._renderOptions);return}s.run(n,t,r,o)}},28103(e,t,n){var r=n(30529),i=n(83419),a=n(31401),o=n(95643),s=n(78023),c=n(84322),l=n(82513);e.exports=new i({Extends:o,Mixins:[a.AlphaSingle,a.BlendMode,a.Depth,a.GetBounds,a.Mask,a.Origin,a.RenderNodes,a.ScrollFactor,a.Texture,a.Transform,a.Visible,s],initialize:function(e,t,n,r,i,a,s,u,d,f,p,m,h){o.call(this,e,`NineSlice`),this._width,this._height,this._originX=.5,this._originY=.5,this._sizeComponent=!0,this.vertices=[],this.leftWidth,this.rightWidth,this.topHeight,this.bottomHeight,this.tileX=m||!1,this.tileY=h||!1,this._repeatCountX=1,this._repeatCountY=1,this.tint=16777215,this.tintMode=c.MULTIPLY;var g=e.textures.getFrame(r,i);this.is3Slice=!f&&!p,g&&g.scale9&&(this.is3Slice=g.is3Slice);for(var _=this.is3Slice?18:54,v=0;v<_;v++)this.vertices.push(new l);this.setPosition(t,n),this.setTexture(r,i),this.setSlices(a,s,u,d,f,p,!1),this.updateDisplayOrigin(),this.initRenderNodes(this._defaultRenderNodesMap)},_defaultRenderNodesMap:{get:function(){return r}},setSlices:function(e,t,n,r,i,a,o){n===void 0&&(n=10),r===void 0&&(r=10),i===void 0&&(i=0),a===void 0&&(a=0),o===void 0&&(o=!1);var s=this.frame,c=!1;if(this.is3Slice&&o&&i!==0&&a!==0&&(c=!0),c)console.warn(`Cannot change 9 slice to 3 slice`);else{if(s&&s.scale9&&!o){var l=s.data.scale9Borders,u=l.x,d=l.y;n=u,r=s.width-l.w-u,i=d,a=s.height-l.h-d,e===void 0&&(e=s.width),t===void 0&&(t=s.height)}else e===void 0&&(e=256),t===void 0&&(t=256);this._width=e,this._height=t,this.leftWidth=n,this.rightWidth=r,this.topHeight=i,this.bottomHeight=a,this.is3Slice&&(t=s.height,this._height=t,this.topHeight=t,this.bottomHeight=0),this.updateVertices(),this.updateUVs()}return this},updateUVs:function(){var e=this.leftWidth,t=this.rightWidth,n=this.topHeight,r=this.bottomHeight,i=this.frame.width,a=this.frame.height,o=e/i,s=1-t/i,c=n/a,l=1-r/a,u=0;if(this.is3Slice)this._updateUVRow(u,o,s,0,c);else{u=this._updateUVRow(u,o,s,0,c);for(var d=0;d<this._repeatCountY;d++)u=this._updateUVRow(u,o,s,c,l);this._updateUVRow(u,o,s,l,1)}},_updateUVRow:function(e,t,n,r,i){this.updateQuadUVs(e,0,r,t,i),e+=6;for(var a=0;a<this._repeatCountX;a++)this.updateQuadUVs(e,t,r,n,i),e+=6;return this.updateQuadUVs(e,n,r,1,i),e+=6,e},updateVertices:function(){var e=this.leftWidth,t=this.rightWidth,n=this.topHeight,r=this.bottomHeight,i=this.width,a=this.height,o=this.frame,s=this.tileX?this._calcRepeatCount(i-e-t,o.width-e-t):1,c=this.tileY&&!this.is3Slice?this._calcRepeatCount(a-n-r,o.height-n-r):1,l=this._rebuildVertexArray(s,c),u=-.5,d=-.5+e/i,f=.5-t/i,p=.5,m=.5,h=.5-n/a,g=(f-d)/s,_=0;if(this.is3Slice)this._updateVertexRow(_,u,d,f,p,m,h,g);else{var v=-.5+r/a,y=-.5,b=(h-v)/c;_=this._updateVertexRow(_,u,d,f,p,m,h,g);for(var x=0;x<c;x++){var S=h-x*b,C=h-(x+1)*b;_=this._updateVertexRow(_,u,d,f,p,S,C,g)}this._updateVertexRow(_,u,d,f,p,v,y,g)}l&&this.updateUVs()},_calcRepeatCount:function(e,t){return t>0?Math.max(1,Math.floor(e/t)):1},_rebuildVertexArray:function(e,t){if(e===this._repeatCountX&&t===this._repeatCountY)return!1;this._repeatCountX=e,this._repeatCountY=t;var n=this.is3Slice?1:t+2,r=(e+2)*n*6,i=this.vertices;if(i.length!==r){i.length=0;for(var a=0;a<r;a++)i.push(new l)}return!0},_updateVertexRow:function(e,t,n,r,i,a,o,s){this.updateQuad(e,t,a,n,o),e+=6;for(var c=0;c<this._repeatCountX;c++)this.updateQuad(e,n+c*s,a,n+(c+1)*s,o),e+=6;return this.updateQuad(e,r,a,i,o),e+=6,e},updateQuad:function(e,t,n,r,i){var a=this.width,o=this.height,s=this.originX,c=this.originY,l=this.vertices;l[e+0].resize(t,n,a,o,s,c),l[e+1].resize(t,i,a,o,s,c),l[e+2].resize(r,n,a,o,s,c),l[e+3].resize(t,i,a,o,s,c),l[e+4].resize(r,i,a,o,s,c),l[e+5].resize(r,n,a,o,s,c)},updateQuadUVs:function(e,t,n,r,i){var a=this.vertices,o=this.frame,s=o.u0,c=o.v0,l=o.u1,u=o.v1;if(s!==0||l!==1){var d=l-s;t=s+t*d,r=s+r*d}if(c!==0||u!==1){var f=u-c;n=c+n*f,i=c+i*f}a[e+0].setUVs(t,n),a[e+1].setUVs(t,i),a[e+2].setUVs(r,n),a[e+3].setUVs(t,i),a[e+4].setUVs(r,i),a[e+5].setUVs(r,n)},clearTint:function(){return this.setTint(16777215),this.setTintMode(),this},setTint:function(e){return e===void 0&&(e=16777215),this.tint=e,this},setTintMode:function(e){return e===void 0&&(e=c.MULTIPLY),this.tintMode=e,this},isTinted:{get:function(){return this.tint!==16777215||this.tintMode!==c.MULTIPLY}},width:{get:function(){return this._width},set:function(e){this._width=Math.max(e,this.leftWidth+this.rightWidth),this.updateVertices()}},height:{get:function(){return this._height},set:function(e){this.is3Slice||(this._height=Math.max(e,this.topHeight+this.bottomHeight),this.updateVertices())}},displayWidth:{get:function(){return this.scaleX*this.width},set:function(e){this.scaleX=e/this.width}},displayHeight:{get:function(){return this.scaleY*this.height},set:function(e){this.scaleY=e/this.height}},setSize:function(e,t){this.width=e,this.height=t,this.updateDisplayOrigin();var n=this.input;return n&&!n.customHitArea&&(n.hitArea.width=this.width,n.hitArea.height=this.height),this},setDisplaySize:function(e,t){return this.displayWidth=e,this.displayHeight=t,this},originX:{get:function(){return this._originX},set:function(e){this._originX=e,this.updateVertices()}},originY:{get:function(){return this._originY},set:function(e){this._originY=e,this.updateVertices()}},setOrigin:function(e,t){return e===void 0&&(e=.5),t===void 0&&(t=e),this._originX=e,this._originY=t,this.updateVertices(),this.updateDisplayOrigin()},setSizeToFrame:function(){if(this.is3Slice){var e=this.frame.height;this._height=e,this.topHeight=e,this.bottomHeight=0}return this.updateUVs(),this},preDestroy:function(){this.vertices=[]}})},28279(e,t,n){var r=n(25305),i=n(44603),a=n(23568),o=n(35154),s=n(28103);i.register(`nineslice`,function(e,t){e===void 0&&(e={});var n=a(e,`key`,null),i=a(e,`frame`,null),c=o(e,`width`,256),l=o(e,`height`,256),u=o(e,`leftWidth`,10),d=o(e,`rightWidth`,10),f=o(e,`topHeight`,0),p=o(e,`bottomHeight`,0),m=o(e,`tileX`,!1),h=o(e,`tileY`,!1),g=new s(this.scene,0,0,n,i,c,l,u,d,f,p,m,h);return t!==void 0&&(e.add=t),r(this.scene,g,e),g})},47521(e,t,n){var r=n(28103);n(39429).register(`nineslice`,function(e,t,n,i,a,o,s,c,l,u,d,f){return this.displayList.add(new r(this.scene,e,t,n,i,a,o,s,c,l,u,d,f))})},78023(e,t,n){var r=n(29747),i=r,a=r;i=n(52230),e.exports={renderWebGL:i,renderCanvas:a}},82513(e,t,n){var r=n(83419),i=n(26099);e.exports=new r({Extends:i,initialize:function(e,t,n,r){i.call(this,e,t),this.vx=0,this.vy=0,this.u=n,this.v=r},setUVs:function(e,t){return this.u=e,this.v=t,this},resize:function(e,t,n,r,i,a){return this.x=e,this.y=t,this.vx=this.x*n,this.vy=-this.y*r,i<.5?this.vx+=n*(.5-i):i>.5&&(this.vx-=n*(i-.5)),a<.5?this.vy+=r*(.5-a):a>.5&&(this.vy-=r*(a-.5)),this}})},52230(e,t,n){var r=n(91296),i=n(70554),a={multiTexturing:!0};e.exports=function(e,t,n,o){var s=t.vertices,c=s.length;if(c!==0){var l=n.camera;l.addToRenderList(t);for(var u=t.alpha,d=t.customRenderNodes.BatchHandler||t.defaultRenderNodes.BatchHandler,f=r(t,l,o,!n.useCanvas).calc,p=i.getTintAppendFloatAlpha(t.tint,u),m=t.frame.source.glTexture,h=t.tintMode,g,_,v,y=0;y<c;y+=6)_=s[y+1],v=s[y+2],g=f.setQuad(_.vx,_.vy,v.vx,v.vy),d.batch(n,m,g[0],g[1],g[2],g[3],g[6],g[7],g[4],g[5],_.u,_.v,v.u-_.u,v.v-_.v,h,p,p,p,p,a)}}},35387(e,t,n){var r=n(83419),i=n(20071),a=n(40987),o=n(16421);e.exports=new r({Extends:i,initialize:function(e,t,n,r,s,c){t||={};var l={name:`noise`,fragmentSource:o,setupUniforms:this._setupUniforms};i.call(this,e,l,n,r,s,c),this.type=`Noise`,this.noiseOffset=[0,0],t.noiseOffset&&(this.noiseOffset=t.noiseOffset),this.noisePower=t.noisePower===void 0?1:t.noisePower,this.noiseColorStart=new a(0,0,0),this.noiseColorEnd=new a(255,255,255),(t.noiseColorStart!==void 0||t.noiseColorEnd!==void 0)&&this.setNoiseColor(t.noiseColorStart,t.noiseColorEnd),this.noiseRandomChannels=!!t.noiseRandomChannels,this.noiseRandomNormal=!!t.noiseRandomNormal},setNoiseColor:function(e,t){var n;return e===void 0&&(e=0),t===void 0&&(t=16777215),typeof e==`number`?a.IntegerToColor(e,this.noiseColorStart):typeof e==`string`?a.HexStringToColor(e,this.noiseColorStart):Array.isArray(e)?(n=e[3]===void 0?1:e[3],this.noiseColorStart.setGLTo(e[0],e[1],e[2],n)):e instanceof a&&this.noiseColorStart.setTo(e.red,e.green,e.blue,e.alpha),typeof t==`number`?a.IntegerToColor(t,this.noiseColorEnd):typeof t==`string`?a.HexStringToColor(t,this.noiseColorEnd):Array.isArray(t)?(n=t[3]===void 0?1:t[3],this.noiseColorEnd.setGLTo(t[0],t[1],t[2],n)):t instanceof a&&this.noiseColorEnd.setTo(t.red,t.green,t.blue,t.alpha),this},_setupUniforms:function(e){e(`uOffset`,this.noiseOffset),e(`uColorStart`,this.noiseColorStart.gl),e(`uColorEnd`,this.noiseColorEnd.gl),e(`uPower`,this.noisePower);var t=0;this.noiseRandomChannels&&(t=1),this.noiseRandomNormal&&(t=2),e(`uMode`,t)}})},39931(e,t,n){var r=n(25305),i=n(44603),a=n(23568),o=n(35387);i.register(`noise`,function(e,t){e===void 0&&(e={});var n=a(e,`config`,null),i=a(e,`x`,0),s=a(e,`y`,0),c=a(e,`width`,128),l=a(e,`height`,128),u=new o(this.scene,n,i,s,c,l);return t!==void 0&&(e.add=t),r(this.scene,u,e),u})},34757(e,t,n){var r=n(35387);n(39429).register(`noise`,function(e,t,n,i,a){return this.displayList.add(new r(this.scene,e,t,n,i,a))})},51513(e,t,n){var r=n(83419),i=n(20071),a=n(40987),o=n(17205);e.exports=new r({Extends:i,initialize:function(e,t,n,r,s,c){t||={};var l={name:`noiseCell2D`,fragmentSource:o,shaderAdditions:[{name:`MODE_DISTANCE`,tags:[`MODE`],additions:{fragmentMode:`#define MODE_DISTANCE`}},{name:`ITERATION_COUNT_1`,tags:[`ITERATION_COUNT`],additions:{fragmentIterations:`#define ITERATION_COUNT 1.0`}},{name:`NORMALMAP`,tags:[`NORMALMAP`],additions:{fragmentNormalMap:`#define NORMAL_MAP
#extension GL_OES_standard_derivatives : enable`},disable:!t.noiseNormalMap}],setupUniforms:this._setupUniforms,updateShaderConfig:this._updateShaderConfig};i.call(this,e,l,n,r,s,c),this.type=`NoiseCell2D`,this.noiseCells=[32,32],t.noiseCells&&(this.noiseCells=t.noiseCells),this.noiseWrap=[this.noiseCells[0],this.noiseCells[1]],t.noiseWrap&&(this.noiseWrap=t.noiseWrap),this.noiseOffset=[0,0],t.noiseOffset&&(this.noiseOffset=t.noiseOffset),this.noiseVariation=[1,1],t.noiseVariation&&(this.noiseVariation=t.noiseVariation),this.noiseIterations=1,t.noiseIterations&&(this.noiseIterations=t.noiseIterations),this.noiseMode=0,t.noiseMode&&(this.noiseMode=t.noiseMode),this.noiseSmoothing=1,t.noiseSmoothing&&(this.noiseSmoothing=t.noiseSmoothing),this.noiseNormalMap=!!t.noiseNormalMap,this.noiseNormalScale=1,t.noiseNormalScale!==void 0&&(this.noiseNormalScale=t.noiseNormalScale),this.noiseColorStart=new a(0,0,0),this.noiseColorEnd=new a(255,255,255),(t.noiseColorStart!==void 0||t.noiseColorEnd!==void 0)&&this.setNoiseColor(t.noiseColorStart,t.noiseColorEnd),this.noiseSeed=[1,2,3,4,5,6,7,8],t.noiseSeed&&(this.noiseSeed=t.noiseSeed),t.randomizeNoiseSeed&&this.randomizeNoiseSeed(),this.keepAwake=!0},setNoiseColor:function(e,t){var n;return e===void 0&&(e=0),t===void 0&&(t=16777215),typeof e==`number`?a.IntegerToColor(e,this.noiseColorStart):typeof e==`string`?a.HexStringToColor(e,this.noiseColorStart):Array.isArray(e)?(n=e[3]===void 0?1:e[3],this.noiseColorStart.setGLTo(e[0],e[1],e[2],n)):e instanceof a&&this.noiseColorStart.setTo(e.red,e.green,e.blue,e.alpha),typeof t==`number`?a.IntegerToColor(t,this.noiseColorEnd):typeof t==`string`?a.HexStringToColor(t,this.noiseColorEnd):Array.isArray(t)?(n=t[3]===void 0?1:t[3],this.noiseColorEnd.setGLTo(t[0],t[1],t[2],n)):t instanceof a&&this.noiseColorEnd.setTo(t.red,t.green,t.blue,t.alpha),this},randomizeNoiseSeed:function(){for(var e=this.noiseSeed.length,t=0;t<e;t++)this.noiseSeed[t]=Math.random();return this},wrapNoise:function(){for(var e=this.noiseWrap.length,t=0;t<e;t++)this.noiseWrap[t]=this.noiseCells[t];return this},_setupUniforms:function(e){if(this.keepAwake){var t=Math.sin(this.scene.time.now)/4096/256;e(`uCellOffset`,[this.noiseOffset[0]+t,this.noiseOffset[1]+t])}else e(`uCellOffset`,this.noiseOffset);e(`uSeedX`,this.noiseSeed.slice(0,2)),e(`uSeedY`,this.noiseSeed.slice(2,4)),e(`uCells`,this.noiseCells),e(`uVariation`,this.noiseVariation),e(`uWrap`,this.noiseWrap),e(`uSmoothing`,this.noiseSmoothing),e(`uNormalScale`,this.noiseNormalScale),e(`uColorStart`,this.noiseColorStart.gl),e(`uColorEnd`,this.noiseColorEnd.gl)},_updateShaderConfig:function(e,t,n){var r=Math.max(1,Math.floor(t.noiseIterations)),i=n.programManager.getAdditionsByTag(`ITERATION_COUNT`)[0];i.name=`ITERATION_COUNT_`+r,i.additions.fragmentIterations=`#define ITERATION_COUNT `+r+`.0`;var a=`MODE_DISTANCE`;switch(t.noiseMode){case 1:a=`MODE_INDEX`;break;case 2:a=`MODE_DISTANCE_SMOOTH`;break}var o=n.programManager.getAdditionsByTag(`MODE`)[0];o.name=a,o.additions.fragmentMode=`#define `+a;var s=n.programManager.getAdditionsByTag(`NORMALMAP`)[0];s.disable=!t.noiseNormalMap}})},98292(e,t,n){var r=n(25305),i=n(44603),a=n(23568),o=n(51513);i.register(`noisecell2d`,function(e,t){e===void 0&&(e={});var n=a(e,`config`,null),i=a(e,`x`,0),s=a(e,`y`,0),c=a(e,`width`,128),l=a(e,`height`,128),u=new o(this.scene,n,i,s,c,l);return t!==void 0&&(e.add=t),r(this.scene,u,e),u})},26590(e,t,n){var r=n(51513);n(39429).register(`noisecell2d`,function(e,t,n,i,a){return this.displayList.add(new r(this.scene,e,t,n,i,a))})},15686(e,t,n){var r=n(83419),i=n(20071),a=n(40987),o=n(79814);e.exports=new r({Extends:i,initialize:function(e,t,n,r,s,c){t||={};var l={name:`noiseCell3D`,fragmentSource:o,shaderAdditions:[{name:`MODE_DISTANCE`,tags:[`MODE`],additions:{fragmentMode:`#define MODE_DISTANCE`}},{name:`ITERATION_COUNT_1`,tags:[`ITERATION_COUNT`],additions:{fragmentIterations:`#define ITERATION_COUNT 1.0`}},{name:`NORMALMAP`,tags:[`NORMALMAP`],additions:{fragmentNormalMap:`#define NORMAL_MAP
#extension GL_OES_standard_derivatives : enable`},disable:!t.noiseNormalMap}],setupUniforms:this._setupUniforms,updateShaderConfig:this._updateShaderConfig};i.call(this,e,l,n,r,s,c),this.type=`NoiseCell3D`,this.noiseCells=[32,32,32],t.noiseCells&&(this.noiseCells=t.noiseCells),this.noiseWrap=[this.noiseCells[0],this.noiseCells[1],this.noiseCells[2]],t.noiseWrap&&(this.noiseWrap=t.noiseWrap),this.noiseOffset=[0,0,0],t.noiseOffset&&(this.noiseOffset=t.noiseOffset),this.noiseVariation=[1,1,1],t.noiseVariation&&(this.noiseVariation=t.noiseVariation),this.noiseIterations=1,t.noiseIterations&&(this.noiseIterations=t.noiseIterations),this.noiseMode=0,t.noiseMode&&(this.noiseMode=t.noiseMode),this.noiseSmoothing=1,t.noiseSmoothing&&(this.noiseSmoothing=t.noiseSmoothing),this.noiseNormalMap=!!t.noiseNormalMap,this.noiseNormalScale=1,t.noiseNormalScale!==void 0&&(this.noiseNormalScale=t.noiseNormalScale),this.noiseColorStart=new a(0,0,0),this.noiseColorEnd=new a(255,255,255),(t.noiseColorStart!==void 0||t.noiseColorEnd!==void 0)&&this.setNoiseColor(t.noiseColorStart,t.noiseColorEnd),this.noiseSeed=[1,2,3,4,5,6,7,8,9,10,11,12],t.noiseSeed&&(this.noiseSeed=t.noiseSeed),t.randomizeNoiseSeed&&this.randomizeNoiseSeed(),this.keepAwake=!0},setNoiseColor:function(e,t){var n;return e===void 0&&(e=0),t===void 0&&(t=16777215),typeof e==`number`?a.IntegerToColor(e,this.noiseColorStart):typeof e==`string`?a.HexStringToColor(e,this.noiseColorStart):Array.isArray(e)?(n=e[3]===void 0?1:e[3],this.noiseColorStart.setGLTo(e[0],e[1],e[2],n)):e instanceof a&&this.noiseColorStart.setTo(e.red,e.green,e.blue,e.alpha),typeof t==`number`?a.IntegerToColor(t,this.noiseColorEnd):typeof t==`string`?a.HexStringToColor(t,this.noiseColorEnd):Array.isArray(t)?(n=t[3]===void 0?1:t[3],this.noiseColorEnd.setGLTo(t[0],t[1],t[2],n)):t instanceof a&&this.noiseColorEnd.setTo(t.red,t.green,t.blue,t.alpha),this},randomizeNoiseSeed:function(){for(var e=this.noiseSeed.length,t=0;t<e;t++)this.noiseSeed[t]=Math.random();return this},wrapNoise:function(){for(var e=this.noiseWrap.length,t=0;t<e;t++)this.noiseWrap[t]=this.noiseCells[t];return this},_setupUniforms:function(e){if(this.keepAwake){var t=Math.sin(this.scene.time.now)/4096/256;e(`uCellOffset`,[this.noiseOffset[0]+t,this.noiseOffset[1]+t,this.noiseOffset[2]+t])}else e(`uCellOffset`,this.noiseOffset);e(`uSeedX`,this.noiseSeed.slice(0,3)),e(`uSeedY`,this.noiseSeed.slice(3,6)),e(`uSeedZ`,this.noiseSeed.slice(6,9)),e(`uCells`,this.noiseCells),e(`uVariation`,this.noiseVariation),e(`uWrap`,this.noiseWrap),e(`uSmoothing`,this.noiseSmoothing),e(`uNormalScale`,this.noiseNormalScale),e(`uColorStart`,this.noiseColorStart.gl),e(`uColorEnd`,this.noiseColorEnd.gl)},_updateShaderConfig:function(e,t,n){var r=Math.max(1,Math.floor(t.noiseIterations)),i=n.programManager.getAdditionsByTag(`ITERATION_COUNT`)[0];i.name=`ITERATION_COUNT_`+r,i.additions.fragmentIterations=`#define ITERATION_COUNT `+r+`.0`;var a=`MODE_DISTANCE`;switch(t.noiseMode){case 1:a=`MODE_INDEX`;break;case 2:a=`MODE_DISTANCE_SMOOTH`;break}var o=n.programManager.getAdditionsByTag(`MODE`)[0];o.name=a,o.additions.fragmentMode=`#define `+a;var s=n.programManager.getAdditionsByTag(`NORMALMAP`)[0];s.disable=!t.noiseNormalMap}})},97044(e,t,n){var r=n(25305),i=n(44603),a=n(23568),o=n(15686);i.register(`noisecell3d`,function(e,t){e===void 0&&(e={});var n=a(e,`config`,null),i=a(e,`x`,0),s=a(e,`y`,0),c=a(e,`width`,128),l=a(e,`height`,128),u=new o(this.scene,n,i,s,c,l);return t!==void 0&&(e.add=t),r(this.scene,u,e),u})},89918(e,t,n){var r=n(15686);n(39429).register(`noisecell3d`,function(e,t,n,i,a){return this.displayList.add(new r(this.scene,e,t,n,i,a))})},41946(e,t,n){var r=n(83419),i=n(20071),a=n(40987),o=n(99595);e.exports=new r({Extends:i,initialize:function(e,t,n,r,s,c){t||={};var l={name:`noiseCell4D`,fragmentSource:o,shaderAdditions:[{name:`MODE_DISTANCE`,tags:[`MODE`],additions:{fragmentMode:`#define MODE_DISTANCE`}},{name:`ITERATION_COUNT_1`,tags:[`ITERATION_COUNT`],additions:{fragmentIterations:`#define ITERATION_COUNT 1.0`}},{name:`NORMALMAP`,tags:[`NORMALMAP`],additions:{fragmentNormalMap:`#define NORMAL_MAP
#extension GL_OES_standard_derivatives : enable`},disable:!t.noiseNormalMap}],setupUniforms:this._setupUniforms,updateShaderConfig:this._updateShaderConfig};i.call(this,e,l,n,r,s,c),this.type=`NoiseCell4D`,this.noiseCells=[32,32,32,32],t.noiseCells&&(this.noiseCells=t.noiseCells),this.noiseWrap=[this.noiseCells[0],this.noiseCells[1],this.noiseCells[2],this.noiseCells[3]],t.noiseWrap&&(this.noiseWrap=t.noiseWrap),this.noiseOffset=[0,0,0,0],t.noiseOffset&&(this.noiseOffset=t.noiseOffset),this.noiseVariation=[1,1,1,1],t.noiseVariation&&(this.noiseVariation=t.noiseVariation),this.noiseIterations=1,t.noiseIterations&&(this.noiseIterations=t.noiseIterations),this.noiseMode=0,t.noiseMode&&(this.noiseMode=t.noiseMode),this.noiseSmoothing=1,t.noiseSmoothing&&(this.noiseSmoothing=t.noiseSmoothing),this.noiseNormalMap=!!t.noiseNormalMap,this.noiseNormalScale=1,t.noiseNormalScale!==void 0&&(this.noiseNormalScale=t.noiseNormalScale),this.noiseColorStart=new a(0,0,0),this.noiseColorEnd=new a(255,255,255),(t.noiseColorStart!==void 0||t.noiseColorEnd!==void 0)&&this.setNoiseColor(t.noiseColorStart,t.noiseColorEnd),this.noiseSeed=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],t.noiseSeed&&(this.noiseSeed=t.noiseSeed),t.randomizeNoiseSeed&&this.randomizeNoiseSeed(),this.keepAwake=!0},setNoiseColor:function(e,t){var n;return e===void 0&&(e=0),t===void 0&&(t=16777215),typeof e==`number`?a.IntegerToColor(e,this.noiseColorStart):typeof e==`string`?a.HexStringToColor(e,this.noiseColorStart):Array.isArray(e)?(n=e[3]===void 0?1:e[3],this.noiseColorStart.setGLTo(e[0],e[1],e[2],n)):e instanceof a&&this.noiseColorStart.setTo(e.red,e.green,e.blue,e.alpha),typeof t==`number`?a.IntegerToColor(t,this.noiseColorEnd):typeof t==`string`?a.HexStringToColor(t,this.noiseColorEnd):Array.isArray(t)?(n=t[3]===void 0?1:t[3],this.noiseColorEnd.setGLTo(t[0],t[1],t[2],n)):t instanceof a&&this.noiseColorEnd.setTo(t.red,t.green,t.blue,t.alpha),this},randomizeNoiseSeed:function(){for(var e=this.noiseSeed.length,t=0;t<e;t++)this.noiseSeed[t]=Math.random();return this},wrapNoise:function(){for(var e=this.noiseWrap.length,t=0;t<e;t++)this.noiseWrap[t]=this.noiseCells[t];return this},_setupUniforms:function(e){if(this.keepAwake){var t=Math.sin(this.scene.time.now)/4096/256;e(`uCellOffset`,[this.noiseOffset[0]+t,this.noiseOffset[1]+t,this.noiseOffset[2]+t,this.noiseOffset[3]+t])}else e(`uCellOffset`,this.noiseOffset);e(`uSeedX`,this.noiseSeed.slice(0,4)),e(`uSeedY`,this.noiseSeed.slice(4,8)),e(`uSeedZ`,this.noiseSeed.slice(8,12)),e(`uSeedW`,this.noiseSeed.slice(12,16)),e(`uCells`,this.noiseCells),e(`uVariation`,this.noiseVariation),e(`uWrap`,this.noiseWrap),e(`uSmoothing`,this.noiseSmoothing),e(`uNormalScale`,this.noiseNormalScale),e(`uColorStart`,this.noiseColorStart.gl),e(`uColorEnd`,this.noiseColorEnd.gl)},_updateShaderConfig:function(e,t,n){var r=Math.max(1,Math.floor(t.noiseIterations)),i=n.programManager.getAdditionsByTag(`ITERATION_COUNT`)[0];i.name=`ITERATION_COUNT_`+r,i.additions.fragmentIterations=`#define ITERATION_COUNT `+r+`.0`;var a=`MODE_DISTANCE`;switch(t.noiseMode){case 1:a=`MODE_INDEX`;break;case 2:a=`MODE_DISTANCE_SMOOTH`;break}var o=n.programManager.getAdditionsByTag(`MODE`)[0];o.name=a,o.additions.fragmentMode=`#define `+a;var s=n.programManager.getAdditionsByTag(`NORMALMAP`)[0];s.disable=!t.noiseNormalMap}})},20136(e,t,n){var r=n(25305),i=n(44603),a=n(23568),o=n(41946);i.register(`noisecell4d`,function(e,t){e===void 0&&(e={});var n=a(e,`config`,null),i=a(e,`x`,0),s=a(e,`y`,0),c=a(e,`width`,128),l=a(e,`height`,128),u=new o(this.scene,n,i,s,c,l);return t!==void 0&&(e.add=t),r(this.scene,u,e),u})},65874(e,t,n){var r=n(41946);n(39429).register(`noisecell4d`,function(e,t,n,i,a){return this.displayList.add(new r(this.scene,e,t,n,i,a))})},1792(e,t,n){var r=n(83419),i=n(20071),a=n(40987),o=n(83587);e.exports=new r({Extends:i,initialize:function(e,t,n,r,s,c){t||={};var l={name:`noiseSimplex2D`,fragmentSource:o,shaderAdditions:[{name:`ITERATION_COUNT_1_WARP_ITERATION_COUNT_1`,tags:[`ITERATION_COUNT`],additions:{fragmentIterations:`#define ITERATION_COUNT 1.0
#define WARP_ITERATION_COUNT 1.0`}},{name:`NORMALMAP`,tags:[`NORMALMAP`],additions:{fragmentNormalMap:`#define NORMAL_MAP
#extension GL_OES_standard_derivatives : enable`},disable:!t.noiseNormalMap}],setupUniforms:this._setupUniforms,updateShaderConfig:this._updateShaderConfig};i.call(this,e,l,n,r,s,c),this.type=`NoiseSimplex2D`,this.noiseCells=t.noiseCells||[32,32],this.noisePeriod=[this.noiseCells[0],this.noiseCells[1]],t.noisePeriod&&(this.noisePeriod=t.noisePeriod),this.noiseOffset=[0,0],t.noiseOffset&&(this.noiseOffset=t.noiseOffset),this.noiseFlow=t.noiseFlow||0,this.noiseWarpAmount=t.noiseWarpAmount||0,this.noiseIterations=t.noiseIterations||1,this.noiseWarpIterations=t.noiseWarpIterations||1,this.noiseDetailPower=t.noiseDetailPower||2,this.noiseFlowPower=t.noiseFlowPower||2,this.noiseContributionPower=t.noiseContributionPower||2,this.noiseWarpDetailPower=t.noiseWarpDetailPower||2,this.noiseWarpFlowPower=t.noiseWarpFlowPower||2,this.noiseWarpContributionPower=t.noiseWarpContributionPower||2,this.noiseNormalMap=!!t.noiseNormalMap,this.noiseNormalScale=1,t.noiseNormalScale!==void 0&&(this.noiseNormalScale=t.noiseNormalScale),this.noiseValueFactor=t.noiseValueFactor===void 0?.5:t.noiseValueFactor,this.noiseValueAdd=t.noiseValueAdd===void 0?.5:t.noiseValueAdd,this.noiseValuePower=t.noiseValuePower===void 0?1:t.noiseValuePower,this.noiseColorStart=new a(0,0,0),this.noiseColorEnd=new a(255,255,255),(t.noiseColorStart!==void 0||t.noiseColorEnd!==void 0)&&this.setNoiseColor(t.noiseColorStart,t.noiseColorEnd),this.noiseSeed=t.noiseSeed||[1,2]},setNoiseColor:function(e,t){var n;return e===void 0&&(e=0),t===void 0&&(t=16777215),typeof e==`number`?a.IntegerToColor(e,this.noiseColorStart):typeof e==`string`?a.HexStringToColor(e,this.noiseColorStart):Array.isArray(e)?(n=e[3]===void 0?1:e[3],this.noiseColorStart.setGLTo(e[0],e[1],e[2],n)):e instanceof a&&this.noiseColorStart.setTo(e.red,e.green,e.blue,e.alpha),typeof t==`number`?a.IntegerToColor(t,this.noiseColorEnd):typeof t==`string`?a.HexStringToColor(t,this.noiseColorEnd):Array.isArray(t)?(n=t[3]===void 0?1:t[3],this.noiseColorEnd.setGLTo(t[0],t[1],t[2],n)):t instanceof a&&this.noiseColorEnd.setTo(t.red,t.green,t.blue,t.alpha),this},randomizeNoiseSeed:function(){for(var e=this.noiseSeed.length,t=0;t<e;t++)this.noiseSeed[t]=Math.random();return this},wrapNoise:function(){for(var e=this.noisePeriod.length,t=0;t<e;t++)this.noisePeriod[t]=this.noiseCells[t];return this},_setupUniforms:function(e){e(`uCells`,this.noiseCells),e(`uPeriod`,this.noisePeriod),e(`uOffset`,this.noiseOffset),e(`uFlow`,this.noiseFlow),e(`uDetailPower`,this.noiseDetailPower),e(`uFlowPower`,this.noiseFlowPower),e(`uContributionPower`,this.noiseContributionPower),e(`uWarpDetailPower`,this.noiseWarpDetailPower),e(`uWarpFlowPower`,this.noiseWarpFlowPower),e(`uWarpContributionPower`,this.noiseWarpContributionPower),e(`uWarpAmount`,this.noiseWarpAmount),e(`uNormalScale`,this.noiseNormalScale),e(`uValueFactor`,this.noiseValueFactor),e(`uValueAdd`,this.noiseValueAdd),e(`uValuePower`,this.noiseValuePower),e(`uColorStart`,this.noiseColorStart.gl),e(`uColorEnd`,this.noiseColorEnd.gl),e(`uSeed`,this.noiseSeed)},_updateShaderConfig:function(e,t,n){var r=Math.max(1,Math.floor(t.noiseIterations)),i=Math.max(1,Math.floor(t.noiseWarpIterations)),a=n.programManager.getAdditionsByTag(`ITERATION_COUNT`)[0];a.name=`ITERATION_COUNT_`+r+`_WARP_ITERATION_COUNT_`+i,a.additions.fragmentIterations=`#define ITERATION_COUNT `+r+`.0
#define WARP_ITERATION_COUNT `+i+`.0`;var o=n.programManager.getAdditionsByTag(`NORMALMAP`)[0];o.disable=!t.noiseNormalMap}})},51754(e,t,n){var r=n(25305),i=n(44603),a=n(23568),o=n(1792);i.register(`noisesimplex2d`,function(e,t){e===void 0&&(e={});var n=a(e,`config`,null),i=a(e,`x`,0),s=a(e,`y`,0),c=a(e,`width`,128),l=a(e,`height`,128),u=new o(this.scene,n,i,s,c,l);return t!==void 0&&(e.add=t),r(this.scene,u,e),u})},80308(e,t,n){var r=n(1792);n(39429).register(`noisesimplex2d`,function(e,t,n,i,a){return this.displayList.add(new r(this.scene,e,t,n,i,a))})},51098(e,t,n){var r=n(83419),i=n(20071),a=n(40987),o=n(13460);e.exports=new r({Extends:i,initialize:function(e,t,n,r,s,c){t||={};var l={name:`noiseSimplex3D`,fragmentSource:o,shaderAdditions:[{name:`ITERATION_COUNT_1_WARP_ITERATION_COUNT_1`,tags:[`ITERATION_COUNT`],additions:{fragmentIterations:`#define ITERATION_COUNT 1.0
#define WARP_ITERATION_COUNT 1.0`}},{name:`NORMALMAP`,tags:[`NORMALMAP`],additions:{fragmentNormalMap:`#define NORMAL_MAP
#extension GL_OES_standard_derivatives : enable`},disable:!t.noiseNormalMap}],setupUniforms:this._setupUniforms,updateShaderConfig:this._updateShaderConfig};i.call(this,e,l,n,r,s,c),this.type=`NoiseSimplex3D`,this.noiseCells=t.noiseCells||[32,32,32],this.noisePeriod=[this.noiseCells[0],this.noiseCells[1],this.noiseCells[2]],t.noisePeriod&&(this.noisePeriod=t.noisePeriod),this.noiseOffset=[0,0,0],t.noiseOffset&&(this.noiseOffset=t.noiseOffset),this.noiseFlow=t.noiseFlow||0,this.noiseWarpAmount=t.noiseWarpAmount||0,this.noiseIterations=t.noiseIterations||1,this.noiseWarpIterations=t.noiseWarpIterations||1,this.noiseDetailPower=t.noiseDetailPower||2,this.noiseFlowPower=t.noiseFlowPower||2,this.noiseContributionPower=t.noiseContributionPower||2,this.noiseWarpDetailPower=t.noiseWarpDetailPower||2,this.noiseWarpFlowPower=t.noiseWarpFlowPower||2,this.noiseWarpContributionPower=t.noiseWarpContributionPower||2,this.noiseNormalMap=!!t.noiseNormalMap,this.noiseNormalScale=1,t.noiseNormalScale!==void 0&&(this.noiseNormalScale=t.noiseNormalScale),this.noiseValueFactor=t.noiseValueFactor===void 0?.5:t.noiseValueFactor,this.noiseValueAdd=t.noiseValueAdd===void 0?.5:t.noiseValueAdd,this.noiseValuePower=t.noiseValuePower===void 0?1:t.noiseValuePower,this.noiseColorStart=new a(0,0,0),this.noiseColorEnd=new a(255,255,255),(t.noiseColorStart!==void 0||t.noiseColorEnd!==void 0)&&this.setNoiseColor(t.noiseColorStart,t.noiseColorEnd),this.noiseSeed=t.noiseSeed||[1,2,3]},setNoiseColor:function(e,t){var n;return e===void 0&&(e=0),t===void 0&&(t=16777215),typeof e==`number`?a.IntegerToColor(e,this.noiseColorStart):typeof e==`string`?a.HexStringToColor(e,this.noiseColorStart):Array.isArray(e)?(n=e[3]===void 0?1:e[3],this.noiseColorStart.setGLTo(e[0],e[1],e[2],n)):e instanceof a&&this.noiseColorStart.setTo(e.red,e.green,e.blue,e.alpha),typeof t==`number`?a.IntegerToColor(t,this.noiseColorEnd):typeof t==`string`?a.HexStringToColor(t,this.noiseColorEnd):Array.isArray(t)?(n=t[3]===void 0?1:t[3],this.noiseColorEnd.setGLTo(t[0],t[1],t[2],n)):t instanceof a&&this.noiseColorEnd.setTo(t.red,t.green,t.blue,t.alpha),this},randomizeNoiseSeed:function(){for(var e=this.noiseSeed.length,t=0;t<e;t++)this.noiseSeed[t]=Math.random();return this},wrapNoise:function(){for(var e=this.noisePeriod.length,t=0;t<e;t++)this.noisePeriod[t]=this.noiseCells[t];return this},_setupUniforms:function(e){e(`uCells`,this.noiseCells),e(`uPeriod`,this.noisePeriod),e(`uOffset`,this.noiseOffset),e(`uFlow`,this.noiseFlow),e(`uDetailPower`,this.noiseDetailPower),e(`uFlowPower`,this.noiseFlowPower),e(`uContributionPower`,this.noiseContributionPower),e(`uWarpDetailPower`,this.noiseWarpDetailPower),e(`uWarpFlowPower`,this.noiseWarpFlowPower),e(`uWarpContributionPower`,this.noiseWarpContributionPower),e(`uWarpAmount`,this.noiseWarpAmount),e(`uNormalScale`,this.noiseNormalScale),e(`uValueFactor`,this.noiseValueFactor),e(`uValueAdd`,this.noiseValueAdd),e(`uValuePower`,this.noiseValuePower),e(`uColorStart`,this.noiseColorStart.gl),e(`uColorEnd`,this.noiseColorEnd.gl),e(`uSeed`,this.noiseSeed)},_updateShaderConfig:function(e,t,n){var r=Math.max(1,Math.floor(t.noiseIterations)),i=Math.max(1,Math.floor(t.noiseWarpIterations)),a=n.programManager.getAdditionsByTag(`ITERATION_COUNT`)[0];a.name=`ITERATION_COUNT_`+r+`_WARP_ITERATION_COUNT_`+i,a.additions.fragmentIterations=`#define ITERATION_COUNT `+r+`.0
#define WARP_ITERATION_COUNT `+i+`.0`;var o=n.programManager.getAdditionsByTag(`NORMALMAP`)[0];o.disable=!t.noiseNormalMap}})},71112(e,t,n){var r=n(25305),i=n(44603),a=n(23568),o=n(51098);i.register(`noisesimplex3d`,function(e,t){e===void 0&&(e={});var n=a(e,`config`,null),i=a(e,`x`,0),s=a(e,`y`,0),c=a(e,`width`,128),l=a(e,`height`,128),u=new o(this.scene,n,i,s,c,l);return t!==void 0&&(e.add=t),r(this.scene,u,e),u})},73810(e,t,n){var r=n(51098);n(39429).register(`noisesimplex3d`,function(e,t,n,i,a){return this.displayList.add(new r(this.scene,e,t,n,i,a))})},76472(e,t,n){var r=n(83419),i=n(44777),a=n(37589),o=n(6113),s=n(91389),c=n(90664);e.exports=new r({Extends:i,initialize:function(e){i.call(this,e,null,!1),this.active=!1,this.easeName=`Linear`,this.r=[],this.g=[],this.b=[]},getMethod:function(){return this.propertyValue===null?0:9},setMethods:function(){var e=this.propertyValue,t=e,n=this.defaultEmit,r=this.defaultUpdate;if(this.method===9){this.start=e[0],this.ease=o(`Linear`),this.interpolation=s(`linear`),n=this.easedValueEmit,r=this.easeValueUpdate,t=e[0],this.active=!0,this.r.length=0,this.g.length=0,this.b.length=0;for(var i=0;i<e.length;i++){var a=c(e[i]);this.r.push(a.r),this.g.push(a.g),this.b.push(a.b)}}return this.onEmit=n,this.onUpdate=r,this.current=t,this},setEase:function(e){this.easeName=e,this.ease=o(e)},easedValueEmit:function(){return this.current=this.start,this.start},easeValueUpdate:function(e,t,n){var r=this.ease(n),i=a(this.interpolation(this.r,r),this.interpolation(this.g,r),this.interpolation(this.b,r));return this.current=i,i}})},44777(e,t,n){var r=n(30976),i=n(45319),a=n(83419),o=n(99472),s=n(6113),c=n(95540),l=n(91389),u=n(77720),d=n(15994);e.exports=new a({initialize:function(e,t,n){n===void 0&&(n=!1),this.propertyKey=e,this.propertyValue=t,this.defaultValue=t,this.steps=0,this.counter=0,this.yoyo=!1,this.direction=0,this.start=0,this.current=0,this.end=0,this.ease=null,this.interpolation=null,this.emitOnly=n,this.onEmit=this.defaultEmit,this.onUpdate=this.defaultUpdate,this.active=!0,this.method=0,this._onEmit,this._onUpdate},loadConfig:function(e,t){e===void 0&&(e={}),t&&(this.propertyKey=t),this.propertyValue=c(e,this.propertyKey,this.defaultValue),this.method=this.getMethod(),this.setMethods(),this.emitOnly&&(this.onUpdate=this.defaultUpdate)},toJSON:function(){return JSON.stringify(this.propertyValue)},onChange:function(e){var t;switch(this.method){case 1:case 3:case 8:t=e;break;case 2:this.propertyValue.indexOf(e)>=0&&(t=e);break;case 4:t=u(e,(this.end-this.start)/this.steps),this.counter=t;break;case 5:case 6:case 7:t=i(e,this.start,this.end);break;case 9:t=this.start[0];break}return this.current=t,this},getMethod:function(){var e=this.propertyValue;if(e===null)return 0;var t=typeof e;if(t===`number`)return 1;if(Array.isArray(e))return 2;if(t===`function`)return 3;if(t===`object`){if(this.hasBoth(e,`start`,`end`))return this.has(e,`steps`)?4:5;if(this.hasBoth(e,`min`,`max`))return 6;if(this.has(e,`random`))return 7;if(this.hasEither(e,`onEmit`,`onUpdate`))return 8;if(this.hasEither(e,`values`,`interpolation`))return 9}return 0},setMethods:function(){var e=this.propertyValue,t=e,n=this.defaultEmit,r=this.defaultUpdate;switch(this.method){case 1:n=this.staticValueEmit;break;case 2:n=this.randomStaticValueEmit,t=e[0];break;case 3:this._onEmit=e,n=this.proxyEmit,t=this.defaultValue;break;case 4:this.start=e.start,this.end=e.end,this.steps=e.steps,this.counter=this.start,this.yoyo=this.has(e,`yoyo`)?e.yoyo:!1,this.direction=0,n=this.steppedEmit,t=this.start;break;case 5:this.start=e.start,this.end=e.end;var i=this.has(e,`ease`)?e.ease:`Linear`;this.ease=s(i,e.easeParams),n=this.has(e,`random`)&&e.random?this.randomRangedValueEmit:this.easedValueEmit,r=this.easeValueUpdate,t=this.start;break;case 6:this.start=e.min,this.end=e.max,n=this.has(e,`int`)&&e.int?this.randomRangedIntEmit:this.randomRangedValueEmit,t=this.start;break;case 7:var a=e.random;Array.isArray(a)&&(this.start=a[0],this.end=a[1]),n=this.randomRangedIntEmit,t=this.start;break;case 8:this._onEmit=this.has(e,`onEmit`)?e.onEmit:this.defaultEmit,this._onUpdate=this.has(e,`onUpdate`)?e.onUpdate:this.defaultUpdate,n=this.proxyEmit,r=this.proxyUpdate,t=this.defaultValue;break;case 9:this.start=e.values;var o=this.has(e,`ease`)?e.ease:`Linear`;this.ease=s(o,e.easeParams),this.interpolation=l(e.interpolation),n=this.easedValueEmit,r=this.easeValueUpdate,t=this.start[0];break}return this.onEmit=n,this.onUpdate=r,this.current=t,this},has:function(e,t){return e.hasOwnProperty(t)},hasBoth:function(e,t,n){return e.hasOwnProperty(t)&&e.hasOwnProperty(n)},hasEither:function(e,t,n){return e.hasOwnProperty(t)||e.hasOwnProperty(n)},defaultEmit:function(){return this.defaultValue},defaultUpdate:function(e,t,n,r){return r},proxyEmit:function(e,t,n){var r=this._onEmit(e,t,n);return this.current=r,r},proxyUpdate:function(e,t,n,r){var i=this._onUpdate(e,t,n,r);return this.current=i,i},staticValueEmit:function(){return this.current},staticValueUpdate:function(){return this.current},randomStaticValueEmit:function(){var e=Math.floor(Math.random()*this.propertyValue.length);return this.current=this.propertyValue[e],this.current},randomRangedValueEmit:function(e,t){var n=o(this.start,this.end);return e&&e.data[t]&&(e.data[t].min=n,e.data[t].max=this.end),this.current=n,n},randomRangedIntEmit:function(e,t){var n=r(this.start,this.end);return e&&e.data[t]&&(e.data[t].min=n,e.data[t].max=this.end),this.current=n,n},steppedEmit:function(){var e=this.counter,t=e,n=(this.end-this.start)/this.steps;if(this.yoyo){var r;this.direction===0?(t+=n,t>=this.end&&(r=t-this.end,t=this.end-r,this.direction=1)):(t-=n,t<=this.start&&(r=this.start-t,t=this.start+r,this.direction=0)),this.counter=t}else this.counter=d(t+n,this.start,this.end);return this.current=e,e},easedValueEmit:function(e,t){if(e&&e.data[t]){var n=e.data[t];n.min=this.start,n.max=this.end}return this.current=this.start,this.start},easeValueUpdate:function(e,t,n){var r=e.data[t],i,a=this.ease(n);return i=this.interpolation?this.interpolation(this.start,a):(r.max-r.min)*a+r.min,this.current=i,i},destroy:function(){this.propertyValue=null,this.defaultValue=null,this.ease=null,this.interpolation=null,this._onEmit=null,this._onUpdate=null}})},24502(e,t,n){var r=n(83419),i=n(95540),a=n(20286);e.exports=new r({Extends:a,initialize:function(e,t,n,r,o){if(typeof e==`object`){var s=e;e=i(s,`x`,0),t=i(s,`y`,0),n=i(s,`power`,0),r=i(s,`epsilon`,100),o=i(s,`gravity`,50)}else e===void 0&&(e=0),t===void 0&&(t=0),n===void 0&&(n=0),r===void 0&&(r=100),o===void 0&&(o=50);a.call(this,e,t,!0),this._gravity=o,this._power=n*o,this._epsilon=r*r},update:function(e,t){var n=this.x-e.x,r=this.y-e.y,i=n*n+r*r;if(i!==0){var a=Math.sqrt(i);i<this._epsilon&&(i=this._epsilon);var o=this._power*t/(i*a)*100;e.velocityX+=n*o,e.velocityY+=r*o}},epsilon:{get:function(){return Math.sqrt(this._epsilon)},set:function(e){this._epsilon=e*e}},power:{get:function(){return this._power/this._gravity},set:function(e){this._power=e*this._gravity}},gravity:{get:function(){return this._gravity},set:function(e){var t=this.power;this._gravity=e,this.power=t}}})},56480(e,t,n){var r=n(9674),i=n(45319),a=n(83419),o=n(39506),s=n(87841),c=n(11520),l=n(26099);e.exports=new a({initialize:function(e){this.emitter=e,this.texture=null,this.frame=null,this.x=0,this.y=0,this.worldPosition=new l,this.velocityX=0,this.velocityY=0,this.accelerationX=0,this.accelerationY=0,this.maxVelocityX=1e4,this.maxVelocityY=1e4,this.bounce=0,this.scaleX=1,this.scaleY=1,this.alpha=1,this.angle=0,this.rotation=0,this.tint=16777215,this.life=1e3,this.lifeCurrent=1e3,this.delayCurrent=0,this.holdCurrent=0,this.lifeT=0,this.data={tint:{min:16777215,max:16777215},alpha:{min:1,max:1},rotate:{min:0,max:0},scaleX:{min:1,max:1},scaleY:{min:1,max:1},x:{min:0,max:0},y:{min:0,max:0},accelerationX:{min:0,max:0},accelerationY:{min:0,max:0},maxVelocityX:{min:0,max:0},maxVelocityY:{min:0,max:0},moveToX:{min:0,max:0},moveToY:{min:0,max:0},bounce:{min:0,max:0}},this.isCropped=!1,this.scene=e.scene,this.anims=null,this.emitter.anims.length>0&&(this.anims=new r(this)),this.bounds=new s},emit:function(e,t,n,r,i,a){return this.emitter.emit(e,t,n,r,i,a)},isAlive:function(){return this.lifeCurrent>0},kill:function(){this.lifeCurrent=0},setPosition:function(e,t){e===void 0&&(e=0),t===void 0&&(t=0),this.x=e,this.y=t},fire:function(e,t){var n=this.emitter,r=n.ops,i=n.getAnim();if(i?this.anims.play(i):(this.frame=n.getFrame(),this.texture=this.frame.texture),!this.frame)throw Error(`Particle has no texture frame`);if(n.getEmitZone(this),e===void 0?this.x+=r.x.onEmit(this,`x`):r.x.steps>0?this.x+=e+r.x.onEmit(this,`x`):this.x+=e,t===void 0?this.y+=r.y.onEmit(this,`y`):r.y.steps>0?this.y+=t+r.y.onEmit(this,`y`):this.y+=t,this.life=r.lifespan.onEmit(this,`lifespan`),this.lifeCurrent=this.life,this.lifeT=0,this.delayCurrent=r.delay.onEmit(this,`delay`),this.holdCurrent=r.hold.onEmit(this,`hold`),this.scaleX=r.scaleX.onEmit(this,`scaleX`),this.scaleY=r.scaleY.active?r.scaleY.onEmit(this,`scaleY`):this.scaleX,this.angle=r.rotate.onEmit(this,`rotate`),this.rotation=o(this.angle),n.worldMatrix.transformPoint(this.x,this.y,this.worldPosition),this.delayCurrent===0&&n.getDeathZone(this))return this.lifeCurrent=0,!1;var a=r.speedX.onEmit(this,`speedX`),s=r.speedY.active?r.speedY.onEmit(this,`speedY`):a;if(n.radial){var c=o(r.angle.onEmit(this,`angle`));this.velocityX=Math.cos(c)*Math.abs(a),this.velocityY=Math.sin(c)*Math.abs(s)}else if(n.moveTo){var l=r.moveToX.onEmit(this,`moveToX`),u=r.moveToY.onEmit(this,`moveToY`),d=this.life/1e3;this.velocityX=(l-this.x)/d,this.velocityY=(u-this.y)/d}else this.velocityX=a,this.velocityY=s;return n.acceleration&&(this.accelerationX=r.accelerationX.onEmit(this,`accelerationX`),this.accelerationY=r.accelerationY.onEmit(this,`accelerationY`)),this.maxVelocityX=r.maxVelocityX.onEmit(this,`maxVelocityX`),this.maxVelocityY=r.maxVelocityY.onEmit(this,`maxVelocityY`),this.bounce=r.bounce.onEmit(this,`bounce`),this.alpha=r.alpha.onEmit(this,`alpha`),r.color.active?this.tint=r.color.onEmit(this,`tint`):this.tint=r.tint.onEmit(this,`tint`),!0},update:function(e,t,n){if(this.lifeCurrent<=0)return this.holdCurrent>0?(this.holdCurrent-=e,this.holdCurrent<=0):!0;if(this.delayCurrent>0)return this.delayCurrent-=e,!1;this.anims&&this.anims.update(0,e);var r=this.emitter,a=r.ops,s=1-this.lifeCurrent/this.life;if(this.lifeT=s,this.x=a.x.onUpdate(this,`x`,s,this.x),this.y=a.y.onUpdate(this,`y`,s,this.y),r.moveTo){var c=a.moveToX.onUpdate(this,`moveToX`,s,r.moveToX),l=a.moveToY.onUpdate(this,`moveToY`,s,r.moveToY),u=this.lifeCurrent/1e3;this.velocityX=(c-this.x)/u,this.velocityY=(l-this.y)/u}return this.computeVelocity(r,e,t,n,s),this.scaleX=a.scaleX.onUpdate(this,`scaleX`,s,this.scaleX),a.scaleY.active?this.scaleY=a.scaleY.onUpdate(this,`scaleY`,s,this.scaleY):this.scaleY=this.scaleX,this.angle=a.rotate.onUpdate(this,`rotate`,s,this.angle),this.rotation=o(this.angle),r.getDeathZone(this)?(this.lifeCurrent=0,!0):(this.alpha=i(a.alpha.onUpdate(this,`alpha`,s,this.alpha),0,1),a.color.active?this.tint=a.color.onUpdate(this,`color`,s,this.tint):this.tint=a.tint.onUpdate(this,`tint`,s,this.tint),this.lifeCurrent-=e,this.lifeCurrent<=0&&this.holdCurrent<=0)},computeVelocity:function(e,t,n,r,a){var o=e.ops,s=this.velocityX,c=this.velocityY,l=o.accelerationX.onUpdate(this,`accelerationX`,a,this.accelerationX),u=o.accelerationY.onUpdate(this,`accelerationY`,a,this.accelerationY),d=o.maxVelocityX.onUpdate(this,`maxVelocityX`,a,this.maxVelocityX),f=o.maxVelocityY.onUpdate(this,`maxVelocityY`,a,this.maxVelocityY);this.bounce=o.bounce.onUpdate(this,`bounce`,a,this.bounce),s+=e.gravityX*n+l*n,c+=e.gravityY*n+u*n,s=i(s,-d,d),c=i(c,-f,f),this.velocityX=s,this.velocityY=c,this.x+=s*n,this.y+=c*n,e.worldMatrix.transformPoint(this.x,this.y,this.worldPosition);for(var p=0;p<r.length;p++){var m=r[p];m.active&&m.update(this,t,n,a)}},setSizeToFrame:function(){},getBounds:function(e){e===void 0&&(e=this.emitter.getWorldTransformMatrix());var t=Math.abs(e.scaleX)*this.scaleX,n=Math.abs(e.scaleY)*this.scaleY,r=this.x,i=this.y,a=this.rotation,o=this.frame.width*t/2,s=this.frame.height*n/2,u=this.bounds,d=new l(r-o,i-s),f=new l(r+o,i-s),p=new l(r-o,i+s),m=new l(r+o,i+s);return a!==0&&(c(d,r,i,a),c(f,r,i,a),c(p,r,i,a),c(m,r,i,a)),e.transformPoint(d.x,d.y,d),e.transformPoint(f.x,f.y,f),e.transformPoint(p.x,p.y,p),e.transformPoint(m.x,m.y,m),u.x=Math.min(d.x,f.x,p.x,m.x),u.y=Math.min(d.y,f.y,p.y,m.y),u.width=Math.max(d.x,f.x,p.x,m.x)-u.x,u.height=Math.max(d.y,f.y,p.y,m.y)-u.y,u},destroy:function(){this.anims&&this.anims.destroy(),this.anims=null,this.emitter=null,this.texture=null,this.frame=null,this.scene=null}})},69601(e,t,n){var r=n(83419),i=n(20286),a=n(87841);e.exports=new r({Extends:i,initialize:function(e,t,n,r,o,s,c,l){o===void 0&&(o=!0),s===void 0&&(s=!0),c===void 0&&(c=!0),l===void 0&&(l=!0),i.call(this,e,t,!0),this.bounds=new a(e,t,n,r),this.collideLeft=o,this.collideRight=s,this.collideTop=c,this.collideBottom=l},update:function(e){var t=this.bounds,n=-e.bounce,r=e.worldPosition;r.x<t.x&&this.collideLeft?(e.x+=t.x-r.x,e.velocityX*=n):r.x>t.right&&this.collideRight&&(e.x-=r.x-t.right,e.velocityX*=n),r.y<t.y&&this.collideTop?(e.y+=t.y-r.y,e.velocityY*=n):r.y>t.bottom&&this.collideBottom&&(e.y-=r.y-t.bottom,e.velocityY*=n)}})},31600(e,t,n){var r=n(68668),i=n(83419),a=n(31401),o=n(53774),s=n(43459),c=n(26388),l=n(19909),u=n(76472),d=n(44777),f=n(20696),p=n(95643),m=n(95540),h=n(26546),g=n(24502),_=n(69036),v=n(1985),y=n(97022),b=n(86091),x=n(73162),S=n(20074),C=n(269),w=n(56480),T=n(69601),E=n(68875),D=n(87841),O=n(59996),k=n(72905),A=n(90668),j=n(19186),M=n(84322),N=n(61340),P=n(26099),F=n(15994),I=`active.advance.blendMode.colorEase.deathCallback.deathCallbackScope.duration.emitCallback.emitCallbackScope.follow.frequency.gravityX.gravityY.maxAliveParticles.maxParticles.name.emitting.particleBringToTop.particleClass.radial.sortCallback.sortOrderAsc.sortProperty.stopAfter.tintMode.timeScale.trackVisible.visible`.split(`.`),L=[`accelerationX`,`accelerationY`,`alpha`,`angle`,`bounce`,`color`,`delay`,`hold`,`lifespan`,`maxVelocityX`,`maxVelocityY`,`moveToX`,`moveToY`,`quantity`,`rotate`,`scaleX`,`scaleY`,`speedX`,`speedY`,`tint`,`x`,`y`];e.exports=new i({Extends:p,Mixins:[a.AlphaSingle,a.BlendMode,a.Depth,a.Lighting,a.Mask,a.RenderNodes,a.ScrollFactor,a.Texture,a.Transform,a.Visible,A],initialize:function(e,t,n,r,i){p.call(this,e,`ParticleEmitter`),this.particleClass=w,this.config=null,this.ops={accelerationX:new d(`accelerationX`,0),accelerationY:new d(`accelerationY`,0),alpha:new d(`alpha`,1),angle:new d(`angle`,{min:0,max:360},!0),bounce:new d(`bounce`,0),color:new u(`color`),delay:new d(`delay`,0,!0),hold:new d(`hold`,0,!0),lifespan:new d(`lifespan`,1e3,!0),maxVelocityX:new d(`maxVelocityX`,1e4),maxVelocityY:new d(`maxVelocityY`,1e4),moveToX:new d(`moveToX`,0),moveToY:new d(`moveToY`,0),quantity:new d(`quantity`,1,!0),rotate:new d(`rotate`,0),scaleX:new d(`scaleX`,1),scaleY:new d(`scaleY`,1),speedX:new d(`speedX`,0,!0),speedY:new d(`speedY`,0,!0),tint:new d(`tint`,16777215),x:new d(`x`,0),y:new d(`y`,0)},this.radial=!0,this.gravityX=0,this.gravityY=0,this.acceleration=!1,this.moveTo=!1,this.emitCallback=null,this.emitCallbackScope=null,this.deathCallback=null,this.deathCallbackScope=null,this.maxParticles=0,this.maxAliveParticles=0,this.stopAfter=0,this.duration=0,this.frequency=0,this.emitting=!0,this.particleBringToTop=!0,this.timeScale=1,this.emitZones=[],this.deathZones=[],this.viewBounds=null,this.follow=null,this.followOffset=new P,this.trackVisible=!1,this.frames=[],this.randomFrame=!0,this.frameQuantity=1,this.anims=[],this.randomAnim=!0,this.animQuantity=1,this.dead=[],this.alive=[],this.counters=new Float32Array(10),this.skipping=!1,this.worldMatrix=new N,this.sortProperty=``,this.sortOrderAsc=!0,this.sortCallback=this.depthSortCallback,this.processors=new x(this),this.tintMode=M.MULTIPLY,this.initRenderNodes(this._defaultRenderNodesMap),this.setPosition(t,n),this.setTexture(r),i&&this.setConfig(i)},_defaultRenderNodesMap:{get:function(){return r}},addedToScene:function(){this.scene.sys.updateList.add(this)},removedFromScene:function(){this.scene.sys.updateList.remove(this)},setConfig:function(e){if(!e)return this;this.config=e;var t=0,n=``,r=this.ops;for(t=0;t<L.length;t++)n=L[t],r[n].loadConfig(e);for(t=0;t<I.length;t++)n=I[t],y(e,n)&&(this[n]=m(e,n));if(this.acceleration=this.accelerationX!==0||this.accelerationY!==0,this.moveTo=_(e,[`moveToX`,`moveToY`]),y(e,`speed`)&&(r.speedX.loadConfig(e,`speed`),r.speedY.active=!1),(v(e,[`speedX`,`speedY`])||this.moveTo)&&(this.radial=!1),y(e,`scale`)&&(r.scaleX.loadConfig(e,`scale`),r.scaleY.active=!1),y(e,`callbackScope`)){var i=m(e,`callbackScope`,null);this.emitCallbackScope=i,this.deathCallbackScope=i}if(y(e,`emitZone`)&&this.addEmitZone(e.emitZone),y(e,`deathZone`)&&this.addDeathZone(e.deathZone),y(e,`bounds`)){var a=this.addParticleBounds(e.bounds);a.collideLeft=m(e,`collideLeft`,!0),a.collideRight=m(e,`collideRight`,!0),a.collideTop=m(e,`collideTop`,!0),a.collideBottom=m(e,`collideBottom`,!0)}return y(e,`followOffset`)&&this.followOffset.setFromObject(m(e,`followOffset`,0)),y(e,`texture`)&&this.setTexture(e.texture),y(e,`frame`)?this.setEmitterFrame(e.frame):y(e,`anim`)&&this.setAnim(e.anim),y(e,`reserve`)&&this.reserve(e.reserve),y(e,`advance`)&&this.fastForward(e.advance),this.resetCounters(this.frequency,this.emitting),this.emitting&&this.emit(f.START,this),this},updateConfig:function(e){return e&&(this.config?this.setConfig(C(this.config,e)):this.setConfig(e)),this},toJSON:function(){var e=o(this),t=0,n=``;for(t=0;t<I.length;t++)n=I[t],e[n]=this[n];var r=this.ops;for(t=0;t<L.length;t++)n=L[t],r[n]&&(e[n]=r[n].toJSON());return r.speedY.active||(delete e.speedX,e.speed=r.speedX.toJSON()),this.scaleX===this.scaleY&&(delete e.scaleX,delete e.scaleY,e.scale=r.scaleX.toJSON()),e},resetCounters:function(e,t){var n=this.counters;n.fill(0),n[0]=e,t&&(n[5]=1)},startFollow:function(e,t,n,r){return t===void 0&&(t=0),n===void 0&&(n=0),r===void 0&&(r=!1),this.follow=e,this.followOffset.set(t,n),this.trackVisible=r,this},stopFollow:function(){return this.follow=null,this.followOffset.set(0,0),this.trackVisible=!1,this},getFrame:function(){var e=this.frames,t=e.length,n;return t===1?n=e[0]:this.randomFrame?n=h(e):(n=e[this.currentFrame],this.frameCounter++,this.frameCounter===this.frameQuantity&&(this.frameCounter=0,this.currentFrame++,this.currentFrame===t&&(this.currentFrame=0))),this.texture.get(n)},setEmitterFrame:function(e,t,n){t===void 0&&(t=!0),n===void 0&&(n=1),this.randomFrame=t,this.frameQuantity=n,this.currentFrame=0;var r=typeof e;if(this.frames.length=0,Array.isArray(e))this.frames=this.frames.concat(e);else if(r===`string`||r===`number`)this.frames.push(e);else if(r===`object`){var i=e;e=m(i,`frames`,null),e&&(this.frames=this.frames.concat(e));var a=m(i,`cycle`,!1);this.randomFrame=!a,this.frameQuantity=m(i,`quantity`,n)}return this.frames.length===1&&(this.frameQuantity=1,this.randomFrame=!1),this},getAnim:function(){var e=this.anims,t=e.length;if(t===0)return null;if(t===1)return e[0];if(this.randomAnim)return h(e);var n=e[this.currentAnim];return this.animCounter++,this.animCounter>=this.animQuantity&&(this.animCounter=0,this.currentAnim=F(this.currentAnim+1,0,t)),n},setAnim:function(e,t,n){t===void 0&&(t=!0),n===void 0&&(n=1),this.randomAnim=t,this.animQuantity=n,this.currentAnim=0;var r=typeof e;if(this.anims.length=0,Array.isArray(e))this.anims=this.anims.concat(e);else if(r===`string`)this.anims.push(e);else if(r===`object`){var i=e;e=m(i,`anims`,null),e&&(this.anims=this.anims.concat(e));var a=m(i,`cycle`,!1);this.randomAnim=!a,this.animQuantity=m(i,`quantity`,n)}return this.anims.length===1&&(this.animQuantity=1,this.randomAnim=!1),this},setRadial:function(e){return e===void 0&&(e=!0),this.radial=e,this},addParticleBounds:function(e,t,n,r,i,a,o,s){if(typeof e==`object`){var c=e;e=c.x,t=c.y,n=y(c,`w`)?c.w:c.width,r=y(c,`h`)?c.h:c.height}return this.addParticleProcessor(new T(e,t,n,r,i,a,o,s))},setParticleSpeed:function(e,t){return t===void 0&&(t=e),this.ops.speedX.onChange(e),e===t?this.ops.speedY.active=!1:this.ops.speedY.onChange(t),this.radial=!0,this},setParticleScale:function(e,t){return e===void 0&&(e=1),t===void 0&&(t=e),this.ops.scaleX.onChange(e),this.ops.scaleY.onChange(t),this},setParticleGravity:function(e,t){return this.gravityX=e,this.gravityY=t,this},setParticleAlpha:function(e){return this.ops.alpha.onChange(e),this},setParticleTint:function(e){return this.ops.tint.onChange(e),this},setEmitterAngle:function(e){return this.ops.angle.onChange(e),this},setParticleLifespan:function(e){return this.ops.lifespan.onChange(e),this},setQuantity:function(e){return this.quantity=e,this},setFrequency:function(e,t){return this.frequency=e,this.flowCounter=e>0?e:0,t&&(this.quantity=t),this},addDeathZone:function(e){Array.isArray(e)||(e=[e]);for(var t,n=[],r=0;r<e.length;r++)if(t=e[r],t instanceof c)n.push(t);else if(typeof t.contains==`function`)t=new c(t,!0),n.push(t);else{var i=m(t,`type`,`onEnter`),a=m(t,`source`,null);a&&typeof a.contains==`function`&&(t=new c(a,i===`onEnter`),n.push(t))}return this.deathZones=this.deathZones.concat(n),n},removeDeathZone:function(e){return k(this.deathZones,e),this},clearDeathZones:function(){return this.deathZones.length=0,this},addEmitZone:function(e){Array.isArray(e)||(e=[e]);for(var t,n=[],r=0;r<e.length;r++)if(t=e[r],t instanceof E||t instanceof l)n.push(t);else{var i=m(t,`source`,null);if(i){var a=m(t,`type`,`random`);a===`random`&&typeof i.getRandomPoint==`function`?(t=new E(i),n.push(t)):a===`edge`&&typeof i.getPoints==`function`&&(t=new l(i,m(t,`quantity`,1),m(t,`stepRate`,0),m(t,`yoyo`,!1),m(t,`seamless`,!0),m(t,`total`,-1)),n.push(t))}}return this.emitZones=this.emitZones.concat(n),n},removeEmitZone:function(e){return k(this.emitZones,e),this.zoneIndex=0,this},clearEmitZones:function(){return this.emitZones.length=0,this.zoneIndex=0,this},getEmitZone:function(e){var t=this.emitZones,n=t.length;if(n!==0){var r=t[this.zoneIndex];r.getPoint(e),r.total>-1&&(this.zoneTotal++,this.zoneTotal===r.total&&(this.zoneTotal=0,this.zoneIndex++,this.zoneIndex===n&&(this.zoneIndex=0)))}},getDeathZone:function(e){for(var t=this.deathZones,n=0;n<t.length;n++){var r=t[n];if(r.willKill(e))return this.emit(f.DEATH_ZONE,this,e,r),!0}return!1},setEmitZone:function(e){var t=isFinite(e)?e:this.emitZones.indexOf(e);return t>=0&&(this.zoneIndex=t),this},addParticleProcessor:function(e){return this.processors.exists(e)||(e.emitter&&e.emitter.removeParticleProcessor(e),this.processors.add(e),e.emitter=this),e},removeParticleProcessor:function(e){return this.processors.exists(e)&&(this.processors.remove(e,!0),e.emitter=null),e},getProcessors:function(){return this.processors.getAll(`active`,!0)},createGravityWell:function(e){return this.addParticleProcessor(new g(e))},reserve:function(e){var t=this.dead;if(this.maxParticles>0){var n=this.getParticleCount();n+e>this.maxParticles&&(e=this.maxParticles-(n+e))}for(var r=0;r<e;r++)t.push(new this.particleClass(this));return this},getAliveParticleCount:function(){return this.alive.length},getDeadParticleCount:function(){return this.dead.length},getParticleCount:function(){return this.getAliveParticleCount()+this.getDeadParticleCount()},atLimit:function(){return this.maxParticles>0&&this.getParticleCount()>=this.maxParticles||this.maxAliveParticles>0&&this.getAliveParticleCount()>=this.maxAliveParticles},onParticleEmit:function(e,t){return e===void 0?(this.emitCallback=null,this.emitCallbackScope=null):typeof e==`function`&&(this.emitCallback=e,t&&(this.emitCallbackScope=t)),this},onParticleDeath:function(e,t){return e===void 0?(this.deathCallback=null,this.deathCallbackScope=null):typeof e==`function`&&(this.deathCallback=e,t&&(this.deathCallbackScope=t)),this},killAll:function(){for(var e=this.dead,t=this.alive;t.length>0;)e.push(t.pop());return this},forEachAlive:function(e,t){for(var n=this.alive,r=n.length,i=0;i<r;i++)e.call(t,n[i],this);return this},forEachDead:function(e,t){for(var n=this.dead,r=n.length,i=0;i<r;i++)e.call(t,n[i],this);return this},start:function(e,t){return e===void 0&&(e=0),this.emitting||(e>0&&this.fastForward(e),this.emitting=!0,this.resetCounters(this.frequency,!0),t!==void 0&&(this.duration=Math.abs(t)),this.emit(f.START,this)),this},stop:function(e){return e===void 0&&(e=!1),this.emitting&&(this.emitting=!1,e&&this.killAll(),this.emit(f.STOP,this)),this},pause:function(){return this.active=!1,this},resume:function(){return this.active=!0,this},setSortProperty:function(e,t){return e===void 0&&(e=``),t===void 0&&(t=this.true),this.sortProperty=e,this.sortOrderAsc=t,this.sortCallback=this.depthSortCallback,this},setSortCallback:function(e){return e=this.sortProperty===``?null:this.depthSortCallback,this.sortCallback=e,this},depthSort:function(){return j(this.alive,this.sortCallback.bind(this)),this},depthSortCallback:function(e,t){var n=this.sortProperty;return this.sortOrderAsc?e[n]-t[n]:t[n]-e[n]},flow:function(e,t,n){return t===void 0&&(t=1),this.emitting=!1,this.frequency=e,this.quantity=t,n!==void 0&&(this.stopAfter=n),this.start()},explode:function(e,t,n){this.frequency=-1,this.resetCounters(-1,!0);var r=this.emitParticle(e,t,n);return this.emit(f.EXPLODE,this,r),r},emitParticleAt:function(e,t,n){return this.emitParticle(n,e,t)},emitParticle:function(e,t,n){if(!this.atLimit()){e===void 0&&(e=this.ops.quantity.onEmit());for(var r=this.dead,i=this.stopAfter,a=this.follow?this.follow.x+this.followOffset.x:t,o=this.follow?this.follow.y+this.followOffset.y:n,s=0;s<e;s++){var c=r.pop();if(c||=new this.particleClass(this),c.fire(a,o)?(this.particleBringToTop?this.alive.push(c):this.alive.unshift(c),this.emitCallback&&this.emitCallback.call(this.emitCallbackScope,c,this)):this.dead.push(c),i>0&&(this.stopCounter++,this.stopCounter>=i)||this.atLimit())break}return c}},fastForward:function(e,t){t===void 0&&(t=1e3/60);var n=0;for(this.skipping=!0;n<Math.abs(e);)this.preUpdate(0,t),n+=t;return this.skipping=!1,this},preUpdate:function(e,t){t*=this.timeScale;var n=t/1e3;this.trackVisible&&(this.visible=this.follow.visible),this.getWorldTransformMatrix(this.worldMatrix);var r=this.getProcessors(),i=this.alive,a=this.dead,o=0,s=[],c=i.length;for(o=0;o<c;o++){var l=i[o];l.update(t,n,r)&&s.push({index:o,particle:l})}if(c=s.length,c>0){var u=this.deathCallback,d=this.deathCallbackScope;for(o=c-1;o>=0;o--){var p=s[o];i.splice(p.index,1),a.push(p.particle),u&&u.call(d,p.particle),p.particle.setPosition()}}if(!this.emitting&&!this.skipping){this.completeFlag===1&&i.length===0&&(this.completeFlag=0,this.emit(f.COMPLETE,this));return}if(this.frequency===0)this.emitParticle();else if(this.frequency>0)for(this.flowCounter-=t;this.flowCounter<=0;)this.emitParticle(),this.flowCounter+=this.frequency;this.skipping||(this.duration>0&&(this.elapsed+=t,this.elapsed>=this.duration&&this.stop()),this.stopAfter>0&&this.stopCounter>=this.stopAfter&&this.stop())},overlap:function(e){for(var t=this.getWorldTransformMatrix(),n=this.alive,r=n.length,i=[],a=0;a<r;a++){var o=n[a];O(e,o.getBounds(t))&&i.push(o)}return i},getBounds:function(e,t,n,r){e===void 0&&(e=0),t===void 0&&(t=0),n===void 0&&(n=1e3/60),r===void 0&&(r=new D);var i=this.getWorldTransformMatrix(),a,o,c=this.alive,l=!1;if(r.setTo(0,0,0,0),t>0){var u=0;for(this.skipping=!0;u<Math.abs(t);){for(this.preUpdate(0,n),a=0;a<c.length;a++)o=c[a].getBounds(i),l?S(r,o):(l=!0,s(o,r));u+=n}this.skipping=!1}else for(a=0;a<c.length;a++)o=c[a].getBounds(i),l?S(r,o):(l=!0,s(o,r));return e>0&&b(r,e,e),r},createEmitter:function(){throw Error(`createEmitter removed. See ParticleEmitter docs for info`)},particleX:{get:function(){return this.ops.x.current},set:function(e){this.ops.x.onChange(e)}},particleY:{get:function(){return this.ops.y.current},set:function(e){this.ops.y.onChange(e)}},accelerationX:{get:function(){return this.ops.accelerationX.current},set:function(e){this.ops.accelerationX.onChange(e)}},accelerationY:{get:function(){return this.ops.accelerationY.current},set:function(e){this.ops.accelerationY.onChange(e)}},maxVelocityX:{get:function(){return this.ops.maxVelocityX.current},set:function(e){this.ops.maxVelocityX.onChange(e)}},maxVelocityY:{get:function(){return this.ops.maxVelocityY.current},set:function(e){this.ops.maxVelocityY.onChange(e)}},speed:{get:function(){return this.ops.speedX.current},set:function(e){this.ops.speedX.onChange(e),this.ops.speedY.onChange(e)}},speedX:{get:function(){return this.ops.speedX.current},set:function(e){this.ops.speedX.onChange(e)}},speedY:{get:function(){return this.ops.speedY.current},set:function(e){this.ops.speedY.onChange(e)}},moveToX:{get:function(){return this.ops.moveToX.current},set:function(e){this.ops.moveToX.onChange(e)}},moveToY:{get:function(){return this.ops.moveToY.current},set:function(e){this.ops.moveToY.onChange(e)}},bounce:{get:function(){return this.ops.bounce.current},set:function(e){this.ops.bounce.onChange(e)}},particleScaleX:{get:function(){return this.ops.scaleX.current},set:function(e){this.ops.scaleX.onChange(e)}},particleScaleY:{get:function(){return this.ops.scaleY.current},set:function(e){this.ops.scaleY.onChange(e)}},particleColor:{get:function(){return this.ops.color.current},set:function(e){this.ops.color.onChange(e)}},colorEase:{get:function(){return this.ops.color.easeName},set:function(e){this.ops.color.setEase(e)}},particleTint:{get:function(){return this.ops.tint.current},set:function(e){this.ops.tint.onChange(e)}},particleAlpha:{get:function(){return this.ops.alpha.current},set:function(e){this.ops.alpha.onChange(e)}},lifespan:{get:function(){return this.ops.lifespan.current},set:function(e){this.ops.lifespan.onChange(e)}},particleAngle:{get:function(){return this.ops.angle.current},set:function(e){this.ops.angle.onChange(e)}},particleRotate:{get:function(){return this.ops.rotate.current},set:function(e){this.ops.rotate.onChange(e)}},quantity:{get:function(){return this.ops.quantity.current},set:function(e){this.ops.quantity.onChange(e)}},delay:{get:function(){return this.ops.delay.current},set:function(e){this.ops.delay.onChange(e)}},hold:{get:function(){return this.ops.hold.current},set:function(e){this.ops.hold.onChange(e)}},flowCounter:{get:function(){return this.counters[0]},set:function(e){this.counters[0]=e}},frameCounter:{get:function(){return this.counters[1]},set:function(e){this.counters[1]=e}},animCounter:{get:function(){return this.counters[2]},set:function(e){this.counters[2]=e}},elapsed:{get:function(){return this.counters[3]},set:function(e){this.counters[3]=e}},stopCounter:{get:function(){return this.counters[4]},set:function(e){this.counters[4]=e}},completeFlag:{get:function(){return this.counters[5]},set:function(e){this.counters[5]=e}},zoneIndex:{get:function(){return this.counters[6]},set:function(e){this.counters[6]=e}},zoneTotal:{get:function(){return this.counters[7]},set:function(e){this.counters[7]=e}},currentFrame:{get:function(){return this.counters[8]},set:function(e){this.counters[8]=e}},currentAnim:{get:function(){return this.counters[9]},set:function(e){this.counters[9]=e}},preDestroy:function(){this.texture=null,this.frames=null,this.anims=null,this.emitCallback=null,this.emitCallbackScope=null,this.deathCallback=null,this.deathCallbackScope=null,this.emitZones=null,this.deathZones=null,this.bounds=null,this.follow=null,this.counters=null;var e,t=this.ops;for(e=0;e<L.length;e++)t[L[e]].destroy();for(e=0;e<this.alive.length;e++)this.alive[e].destroy();for(e=0;e<this.dead.length;e++)this.dead[e].destroy();this.ops=null,this.alive=[],this.dead=[],this.worldMatrix.destroy()}})},9871(e,t,n){var r=n(59996),i=n(61340),a=new i,o=new i,s=new i,c=new i;e.exports=function(e,t,n,i){n.addToRenderList(t),a.copyWithScrollFactorFrom(n.matrix,n.scrollX,n.scrollY,t.scrollFactorX,t.scrollFactorY),i&&a.multiply(i),c.applyITRS(t.x,t.y,t.rotation,t.scaleX,t.scaleY),a.multiply(c);var l=e.currentContext,u=n.roundPixels,d=n.alpha,f=t.alpha,p=t.alive,m=p.length,h=t.viewBounds;if(!(!t.visible||m===0||h&&!r(h,n.worldView))){t.sortCallback&&t.depthSort(),l.save(),l.globalCompositeOperation=e.blendModes[t.blendMode];for(var g=0;g<m;g++){var _=p[g],v=_.alpha*f*d;if(!(v<=0||_.scaleX===0||_.scaleY===0)){s.applyITRS(_.x,_.y,_.rotation,_.scaleX,_.scaleY),a.multiply(s,o);var y=_.frame,b=y.canvasData;if(b.width>0&&b.height>0){var x=-y.halfWidth,S=-y.halfHeight;l.globalAlpha=v,l.save(),o.setToContext(l),u&&(x=Math.round(x),S=Math.round(S)),l.imageSmoothingEnabled=!y.source.scaleMode,l.drawImage(y.source.image,b.x,b.y,b.width,b.height,x,S,b.width,b.height),l.restore()}}}l.restore()}}},92730(e,t,n){var r=n(25305),i=n(44603),a=n(23568),o=n(95540),s=n(31600);i.register(`particles`,function(e,t){e===void 0&&(e={});var n=a(e,`key`,null),i=o(e,`config`,null),c=new s(this.scene,0,0,n);return t!==void 0&&(e.add=t),r(this.scene,c,e),i&&c.setConfig(i),c})},676(e,t,n){var r=n(39429),i=n(31600);r.register(`particles`,function(e,t,n,r){return e!==void 0&&typeof e==`string`&&console.warn(`ParticleEmitterManager was removed in Phaser 3.60. See documentation for details`),this.displayList.add(new i(this.scene,e,t,n,r))})},90668(e,t,n){var r=n(29747),i=r,a=r;i=n(21188),a=n(9871),e.exports={renderWebGL:i,renderCanvas:a}},21188(e,t,n){var r=n(59996),i=n(61340),a=n(70554),o=new i,s=new i,c=new i,l=new i,u={},d={},f={quad:new Float32Array(8)};e.exports=function(e,t,n,i){var p=n.camera;p.addToRenderList(t),o.copyWithScrollFactorFrom(p.getViewMatrix(!n.useCanvas),p.scrollX,p.scrollY,t.scrollFactorX,t.scrollFactorY),i&&o.multiply(i),l.applyITRS(t.x,t.y,t.rotation,t.scaleX,t.scaleY),o.multiply(l);var m=a.getTintAppendFloatAlpha,h=t.alpha,g=t.alive,_=g.length,v=t.viewBounds;if(!(_===0||v&&!r(v,p.worldView))){t.sortCallback&&t.depthSort();for(var y=t.tintMode,b=0;b<_;b++){var x=g[b],S=x.alpha*h;if(!(S<=0||x.scaleX===0||x.scaleY===0)){c.applyITRS(x.x,x.y,x.rotation,x.scaleX,x.scaleY),o.multiply(c,s);var C=x.frame,w=-C.halfWidth,T=-C.halfHeight;s.setQuad(w,T,w+C.width,T+C.height,f.quad),u.frame!==C&&(u.frame=C,u.uvSource=C);var E=m(x.tint,S);d.tintTopLeft=E,d.tintBottomLeft=E,d.tintTopRight=E,d.tintBottomRight=E,d.tintEffect=y;var D,O;t.lighting&&(x.texture&&(D=C.texture.dataSource[C.sourceIndex]),O=x.rotation,t.parentContainer&&(O=t.getWorldTransformMatrix(o,s).rotate(x.rotation).rotationNormalized));var k=t.customRenderNodes,A=t.defaultRenderNodes;(k.Submitter||A.Submitter).run(n,t,i,0,u,f,d,D,O)}}}}},20286(e,t,n){e.exports=new(n(83419))({initialize:function(e,t,n){e===void 0&&(e=0),t===void 0&&(t=0),n===void 0&&(n=!0),this.emitter,this.x=e,this.y=t,this.active=n},update:function(){},destroy:function(){this.emitter=null}})},9774(e){e.exports=`complete`},812(e){e.exports=`deathzone`},30522(e){e.exports=`explode`},96695(e){e.exports=`start`},18677(e){e.exports=`stop`},20696(e,t,n){e.exports={COMPLETE:n(9774),DEATH_ZONE:n(812),EXPLODE:n(30522),START:n(96695),STOP:n(18677)}},18404(e,t,n){e.exports={EmitterColorOp:n(76472),EmitterOp:n(44777),Events:n(20696),GravityWell:n(24502),Particle:n(56480),ParticleBounds:n(69601),ParticleEmitter:n(31600),ParticleProcessor:n(20286),Zones:n(21024)}},26388(e,t,n){e.exports=new(n(83419))({initialize:function(e,t){this.source=e,this.killOnEnter=t},willKill:function(e){var t=e.worldPosition,n=this.source.contains(t.x,t.y);return n&&this.killOnEnter||!n&&!this.killOnEnter}})},19909(e,t,n){e.exports=new(n(83419))({initialize:function(e,t,n,r,i,a){r===void 0&&(r=!1),i===void 0&&(i=!0),a===void 0&&(a=-1),this.source=e,this.points=[],this.quantity=t,this.stepRate=n,this.yoyo=r,this.counter=-1,this.seamless=i,this._length=0,this._direction=0,this.total=a,this.updateSource()},updateSource:function(){if(this.points=this.source.getPoints(this.quantity,this.stepRate),this.seamless){var e=this.points[0],t=this.points[this.points.length-1];e.x===t.x&&e.y===t.y&&this.points.pop()}var n=this._length;return this._length=this.points.length,this._length<n&&this.counter>this._length&&(this.counter=this._length-1),this},changeSource:function(e){return this.source=e,this.updateSource()},getPoint:function(e){this._direction===0?(this.counter++,this.counter>=this._length&&(this.yoyo?(this._direction=1,this.counter=this._length-1):this.counter=0)):(this.counter--,this.counter===-1&&(this.yoyo?(this._direction=0,this.counter=0):this.counter=this._length-1));var t=this.points[this.counter];t&&(e.x=t.x,e.y=t.y)}})},68875(e,t,n){var r=n(83419),i=n(26099);e.exports=new r({initialize:function(e){this.source=e,this._tempVec=new i,this.total=-1},getPoint:function(e){var t=this._tempVec;this.source.getRandomPoint(t),e.x=t.x,e.y=t.y}})},21024(e,t,n){e.exports={DeathZone:n(26388),EdgeZone:n(19909),RandomZone:n(68875)}},1159(e,t,n){var r=n(83419),i=n(31401),a=n(68287);e.exports=new r({Extends:a,Mixins:[i.PathFollower],initialize:function(e,t,n,r,i,o){a.call(this,e,n,r,i,o),this.path=t},preUpdate:function(e,t){this.anims.update(e,t),this.pathUpdate(e)}})},90145(e,t,n){var r=n(39429),i=n(1159);r.register(`follower`,function(e,t,n,r,a){var o=new i(this.scene,e,t,n,r,a);return this.displayList.add(o),this.updateList.add(o),o})},80321(e,t,n){var r=n(43246),i=n(83419),a=n(31401),o=n(95643),s=n(30100),c=n(67277);e.exports=new i({Extends:o,Mixins:[a.AlphaSingle,a.BlendMode,a.Depth,a.Mask,a.RenderNodes,a.ScrollFactor,a.Transform,a.Visible,c],initialize:function(e,t,n,r,i,a,c){r===void 0&&(r=16777215),i===void 0&&(i=128),a===void 0&&(a=1),c===void 0&&(c=.1),o.call(this,e,`PointLight`),this.initRenderNodes(this._defaultRenderNodesMap),this.setPosition(t,n),this.color=s(r),this.intensity=a,this.attenuation=c,this.width=i*2,this.height=i*2,this._radius=i},_defaultRenderNodesMap:{get:function(){return r}},radius:{get:function(){return this._radius},set:function(e){this._radius=e,this.width=e*2,this.height=e*2}},originX:{get:function(){return .5}},originY:{get:function(){return .5}},displayOriginX:{get:function(){return this._radius}},displayOriginY:{get:function(){return this._radius}}})},39829(e,t,n){var r=n(25305),i=n(44603),a=n(23568),o=n(80321);i.register(`pointlight`,function(e,t){e===void 0&&(e={});var n=a(e,`color`,16777215),i=a(e,`radius`,128),s=a(e,`intensity`,1),c=a(e,`attenuation`,.1),l=new o(this.scene,0,0,n,i,s,c);return t!==void 0&&(e.add=t),r(this.scene,l,e),l})},71255(e,t,n){var r=n(39429),i=n(80321);r.register(`pointlight`,function(e,t,n,r,a,o){return this.displayList.add(new i(this.scene,e,t,n,r,a,o))})},67277(e,t,n){var r=n(29747),i=r,a=r;i=n(57787),e.exports={renderWebGL:i,renderCanvas:a}},57787(e,t,n){var r=n(91296);e.exports=function(e,t,n,i){var a=n.camera;a.addToRenderList(t);var o=r(t,a,i,!n.useCanvas).calc,s=t.width,c=t.height,l=-t._radius,u=-t._radius,d=l+s,f=u+c,p=o.getX(0,0),m=o.getY(0,0),h=o.getX(l,u),g=o.getY(l,u),_=o.getX(l,f),v=o.getY(l,f),y=o.getX(d,f),b=o.getY(d,f),x=o.getX(d,u),S=o.getY(d,u);(t.customRenderNodes.BatchHandler||t.defaultRenderNodes.BatchHandler).batch(n,t,h,g,_,v,x,S,y,b,p,m)}},591(e,t,n){var r=n(83419),i=n(45650),a=n(88571),o=n(83999),s=n(58855);e.exports=new r({Extends:a,Mixins:[o],initialize:function(e,t,n,r,o,c){t===void 0&&(t=0),n===void 0&&(n=0),r===void 0&&(r=32),o===void 0&&(o=32),c===void 0&&(c=!0);var l=e.sys.textures.addDynamicTexture(i(),r,o,c);a.call(this,e,t,n,l),this.type=`RenderTexture`,this.camera=this.texture.camera,this._saved=!1,this.renderMode=s.RENDER,this.isCurrentlyRendering=!1},setSize:function(e,t){this.width=e,this.height=t,this.updateDisplayOrigin();var n=this.input;return n&&!n.customHitArea&&(n.hitArea.width=e,n.hitArea.height=t),this},resize:function(e,t,n){return this.texture.setSize(e,t,n),this.setSize(this.texture.width,this.texture.height),this},saveTexture:function(e){var t=this.texture,n=t.key,r=t.manager;return r.exists(n)&&r.get(n)===t?(r.renameTexture(n,e),this._saved=!0):(t.key=e,t.manager.addDynamicTexture(t)&&(this._saved=!0)),t},setRenderMode:function(e,t){return this.renderMode=e,t&&this.texture.preserve(!0),this},render:function(){return this.texture.render(),this},fill:function(e,t,n,r,i,a){return this.texture.fill(e,t,n,r,i,a),this},clear:function(e,t,n,r){return this.texture.clear(e,t,n,r),this},stamp:function(e,t,n,r,i){return this.texture.stamp(e,t,n,r,i),this},erase:function(e,t,n){return this.texture.erase(e,t,n),this},draw:function(e,t,n,r,i){return this.texture.draw(e,t,n,r,i),this},capture:function(e,t){return this.texture.capture(e,t),this},repeat:function(e,t,n,r,i,a,o){return this.texture.repeat(e,t,n,r,i,a,o),this},preserve:function(e){return this.texture.preserve(e),this},callback:function(e){return this.texture.callback(e),this},snapshotArea:function(e,t,n,r,i,a,o){return this.texture.snapshotArea(e,t,n,r,i,a,o),this},snapshot:function(e,t,n){return this.texture.snapshot(e,t,n)},snapshotPixel:function(e,t,n){return this.texture.snapshotPixel(e,t,n)},preDestroy:function(){this.camera=null,this._saved||this.texture.destroy()}})},97272(e,t,n){var r=n(40652),i=n(58855);e.exports=function(e,t,n,a){var o=!0,s=!0;t.renderMode===i.REDRAW?s=!1:t.renderMode===i.RENDER&&(o=!1),o&&t.render(),s&&r(e,t,n,a)}},34495(e,t,n){var r=n(25305),i=n(44603),a=n(23568),o=n(591);i.register(`renderTexture`,function(e,t){e===void 0&&(e={});var n=a(e,`x`,0),i=a(e,`y`,0),s=a(e,`width`,32),c=a(e,`height`,32),l=new o(this.scene,n,i,s,c);return t!==void 0&&(e.add=t),r(this.scene,l,e),l})},60505(e,t,n){var r=n(39429),i=n(591);r.register(`renderTexture`,function(e,t,n,r){return this.displayList.add(new i(this.scene,e,t,n,r))})},83999(e,t,n){var r=n(29747),i=r,a=r;i=n(53937),a=n(97272),e.exports={renderWebGL:i,renderCanvas:a}},58855(e){e.exports={RENDER:`render`,REDRAW:`redraw`,ALL:`all`}},53937(e,t,n){var r=n(99517),i=n(58855);e.exports=function(e,t,n,a){if(!t.isCurrentlyRendering){t.isCurrentlyRendering=!0;var o=!0,s=!0;t.renderMode===i.REDRAW?s=!1:t.renderMode===i.RENDER&&(o=!1),o&&t.render(),s&&r(e,t,n,a),t.isCurrentlyRendering=!1}}},77757(e,t,n){var r=n(9674),i=n(85760),a=n(83419),o=n(31401),s=n(95643),c=n(38745),l=n(84322),u=n(26099);e.exports=new a({Extends:s,Mixins:[o.AlphaSingle,o.BlendMode,o.Depth,o.Flip,o.Mask,o.RenderNodes,o.Size,o.Texture,o.Transform,o.Visible,o.ScrollFactor,c],initialize:function(e,t,n,i,a,o,c,d,f){i===void 0&&(i=`__DEFAULT`),o===void 0&&(o=2),c===void 0&&(c=!0),s.call(this,e,`Rope`),this.anims=new r(this),this.points=o,this.vertices,this.uv,this.colors,this.alphas,this.tintMode=i===`__DEFAULT`?l.FILL:l.MULTIPLY,this.dirty=!1,this.horizontal=c,this._flipX=!1,this._flipY=!1,this._perp=new u,this.debugCallback=null,this.debugGraphic=null,this.setTexture(i,a),this.setPosition(t,n),this.setSizeToFrame(),this.initRenderNodes(this._defaultRenderNodesMap),Array.isArray(o)&&this.resizeArrays(o.length),this.setPoints(o,d,f),this.updateVertices()},_defaultRenderNodesMap:{get:function(){return i}},addedToScene:function(){this.scene.sys.updateList.add(this)},removedFromScene:function(){this.scene.sys.updateList.remove(this)},preUpdate:function(e,t){var n=this.anims.currentFrame;this.anims.update(e,t),this.anims.currentFrame!==n&&(this.updateUVs(),this.updateVertices())},play:function(e,t,n){return this.anims.play(e,t,n),this},setDirty:function(){return this.dirty=!0,this},setHorizontal:function(e,t,n){return e===void 0&&(e=this.points.length),this.horizontal?this:(this.horizontal=!0,this.setPoints(e,t,n))},setVertical:function(e,t,n){return e===void 0&&(e=this.points.length),this.horizontal?(this.horizontal=!1,this.setPoints(e,t,n)):this},setTintMode:function(e){return e===void 0&&(e=l.MULTIPLY),this.tintMode=e,this},setAlphas:function(e,t){var n=this.points.length;if(n<1)return this;var r=this.alphas;e===void 0?e=[1]:!Array.isArray(e)&&t===void 0&&(e=[e]);var i,a=0;if(t!==void 0)for(i=0;i<n;i++)a=i*2,r[a]=e,r[a+1]=t;else if(e.length===n)for(i=0;i<n;i++)a=i*2,r[a]=e[i],r[a+1]=e[i];else{var o=e[0];for(i=0;i<n;i++)a=i*2,e.length>a&&(o=e[a]),r[a]=o,e.length>a+1&&(o=e[a+1]),r[a+1]=o}return this},setColors:function(e){var t=this.points.length;if(t<1)return this;var n=this.colors;e===void 0?e=[16777215]:Array.isArray(e)||(e=[e]);var r,i=0;if(e.length===t)for(r=0;r<t;r++)i=r*2,n[i]=e[r],n[i+1]=e[r];else{var a=e[0];for(r=0;r<t;r++)i=r*2,e.length>i&&(a=e[i]),n[i]=a,e.length>i+1&&(a=e[i+1]),n[i+1]=a}return this},setPoints:function(e,t,n){if(e===void 0&&(e=2),typeof e==`number`){var r=e;r<2&&(r=2),e=[];var i,a,o;if(this.horizontal)for(o=-this.frame.halfWidth,a=this.frame.width/(r-1),i=0;i<r;i++)e.push({x:o+i*a,y:0});else for(o=-this.frame.halfHeight,a=this.frame.height/(r-1),i=0;i<r;i++)e.push({x:0,y:o+i*a})}var s=e.length,c=this.points.length;return s<1?(console.warn(`Rope: Not enough points given`),this):(s===1&&(e.unshift({x:0,y:0}),s++),c!==s&&this.resizeArrays(s),this.dirty=!0,this.points=e,this.updateUVs(),t!=null&&this.setColors(t),n!=null&&this.setAlphas(n),this)},updateUVs:function(){for(var e=this.uv,t=this.points.length,n=this.frame.u0,r=this.frame.v0,i=this.frame.u1,a=this.frame.v1,o=(i-n)/(t-1),s=(a-r)/(t-1),c=0;c<t;c++){var l=c*4,u,d,f,p;this.horizontal?(this._flipX?(u=i-c*o,f=i-c*o):(u=n+c*o,f=n+c*o),this._flipY?(d=a,p=r):(d=r,p=a)):(this._flipX?(u=n,f=i):(u=i,f=n),this._flipY?(d=a-c*s,p=a-c*s):(d=r+c*s,p=r+c*s)),e[l+0]=u,e[l+1]=d,e[l+2]=f,e[l+3]=p}return this},resizeArrays:function(e){var t=this.colors,n=this.alphas;this.vertices=new Float32Array(e*4),this.uv=new Float32Array(e*4),t=new Uint32Array(e*2),n=new Float32Array(e*2);for(var r=0;r<e*2;r++)t[r]=16777215,n[r]=1;return this.colors=t,this.alphas=n,this.dirty=!0,this},updateVertices:function(){var e=this._perp,t=this.points,n=this.vertices,r=t.length;if(this.dirty=!1,!(r<1)){for(var i,a=t[0],o=this.horizontal?this.frame.halfHeight:this.frame.halfWidth,s=0;s<r;s++){var c=t[s],l=s*4;i=s<r-1?t[s+1]:c,e.x=i.y-a.y,e.y=-(i.x-a.x);var u=e.length();e.x/=u,e.y/=u,e.x*=o,e.y*=o,n[l]=c.x+e.x,n[l+1]=c.y+e.y,n[l+2]=c.x-e.x,n[l+3]=c.y-e.y,a=c}return this}},setDebug:function(e,t){return this.debugGraphic=e,!e&&!t?this.debugCallback=null:t?this.debugCallback=t:this.debugCallback=this.renderDebugVerts,this},renderDebugVerts:function(e,t,n){var r=e.debugGraphic,i=n[0],a=n[1],o=n[2],s=n[3];r.lineBetween(i,a,o,s);for(var c=4;c<t;c+=4){var l=n[c+0],u=n[c+1],d=n[c+2],f=n[c+3];r.lineBetween(i,a,l,u),r.lineBetween(o,s,d,f),r.lineBetween(o,s,l,u),r.lineBetween(l,u,d,f),i=l,a=u,o=d,s=f}},preDestroy:function(){this.anims.destroy(),this.anims=void 0,this.points=null,this.vertices=null,this.uv=null,this.colors=null,this.alphas=null,this.debugCallback=null,this.debugGraphic=null},flipX:{get:function(){return this._flipX},set:function(e){return this._flipX=e,this.updateUVs()}},flipY:{get:function(){return this._flipY},set:function(e){return this._flipY=e,this.updateUVs()}}})},95262(e){e.exports=function(){}},26209(e,t,n){var r=n(25305),i=n(44603),a=n(23568),o=n(35154),s=n(77757);i.register(`rope`,function(e,t){e===void 0&&(e={});var n=a(e,`key`,null),i=a(e,`frame`,null),c=a(e,`horizontal`,!0),l=o(e,`points`,void 0),u=o(e,`colors`,void 0),d=o(e,`alphas`,void 0),f=new s(this.scene,0,0,n,i,l,c,u,d);return t!==void 0&&(e.add=t),r(this.scene,f,e),f})},96819(e,t,n){var r=n(77757);n(39429).register(`rope`,function(e,t,n,i,a,o,s,c){return this.displayList.add(new r(this.scene,e,t,n,i,a,o,s,c))})},38745(e,t,n){var r=n(29747),i=r,a=r;i=n(20439),a=n(95262),e.exports={renderWebGL:i,renderCanvas:a}},20439(e,t,n){var r=n(91296),i={multiTexturing:!1,smoothPixelArt:!1};e.exports=function(e,t,n,a){var o=n.camera;o.addToRenderList(t);var s=r(t,o,a,!n.useCanvas).calc;t.dirty&&t.updateVertices();var c,l=t.texture;c=l&&l.smoothPixelArt!==null?l.smoothPixelArt:t.scene.sys.game.config.smoothPixelArt,i.smoothPixelArt=c,(t.customRenderNodes.BatchHandler||t.defaultRenderNodes.BatchHandler).batchStrip(n,t,s,t.texture.source[0].glTexture,t.vertices,t.uv,t.colors,t.alphas,t.alpha,t.tintMode,i,t.debugCallback)}},20071(e,t,n){var r=n(71911),i=n(26099),a=n(55403),o=n(87774),s=n(83419),c=n(95540),l=n(31401),u=n(95643),d=n(25479);e.exports=new s({Extends:u,Mixins:[l.BlendMode,l.ComputedSize,l.Depth,l.GetBounds,l.Origin,l.ScrollFactor,l.Transform,l.Visible,d],initialize:function(e,t,n,r,o,s,l){t===void 0&&(t={}),typeof t==`string`&&(t={fragmentKey:t}),n===void 0&&(n=0),r===void 0&&(r=0),o===void 0&&(o=128),s===void 0&&(s=128),u.call(this,e,`Shader`);var d=e.sys.renderer;this.textures=[],this.renderNode=new a(d.renderNodes,t),this.setupUniforms=c(t,`setupUniforms`,function(){}),t.updateShaderConfig&&(this.renderNode.updateShaderConfig=t.updateShaderConfig);var f=c(t,`initialUniforms`,{});Object.entries(f).forEach(function(e){this.setUniform(e[0],e[1])},this),this.drawingContext=null,this.glTexture=null,this.renderToTexture=!1,this.texture=null,this.textureCoordinateTopLeft=new i(0,1),this.textureCoordinateTopRight=new i(1,1),this.textureCoordinateBottomLeft=new i(0,0),this.textureCoordinateBottomRight=new i(1,0),this.setTextures(l),this.setPosition(n,r),this.setSize(o,s),this.setOrigin(.5,.5)},getUniform:function(e){return this.renderNode.programManager.uniforms[e]},setUniform:function(e,t){return this.renderNode.programManager.setUniform(e,t),this},setTextures:function(e){e===void 0&&(e=[]),this.textures.length=0;for(var t=0;t<e.length;t++){var n=e[t];typeof n==`string`&&(n=this.scene.textures.get(n)),this.textures.push(n)}return this},setRenderToTexture:function(e){if(this.renderToTexture)return this;var t=this.width,n=this.height,i=this.scene.sys.renderer,a=this.scene,s=new r(0,0,t,n).setScene(a.game.scene.systemScene,!1);return this.drawingContext=new o(i,{width:t,height:n,camera:s}),this.glTexture=this.drawingContext.texture,e&&(this.texture=a.sys.textures.addGLTexture(e,this.glTexture)),this.renderToTexture=!0,this.renderWebGLStep(i,this,this.drawingContext),this},renderImmediate:function(){return this.renderWebGLStep(this.scene.renderer,this,this.drawingContext),this},setupUniforms:function(e,t){},setAlpha:function(){return this},setTextureCoordinates:function(e,t,n,r,i,a,o,s){return e===void 0&&(e=0),t===void 0&&(t=1),n===void 0&&(n=1),r===void 0&&(r=1),i===void 0&&(i=0),a===void 0&&(a=0),o===void 0&&(o=1),s===void 0&&(s=0),this.textureCoordinateTopLeft.set(e,t),this.textureCoordinateTopRight.set(n,r),this.textureCoordinateBottomLeft.set(i,a),this.textureCoordinateBottomRight.set(o,s),this},setTextureCoordinatesFromFrame:function(e,t){typeof e==`string`&&(t?typeof t==`string`&&(t=this.scene.textures.get(t)):t=this.textures[0],e=t.get(e));var n=e.u0,r=e.v0,i=e.u1,a=e.v1;this.setTextureCoordinates(n,r,i,r,n,a,i,a)},preDestroy:function(){this.renderNode=null,this.textures.length=0,this.drawingContext&&(this.drawingContext.destroy(),this.texture&&this.texture.destroy(),this.drawingContext=null,this.glTexture=null,this.texture=null)}})},80464(e){e.exports=function(){}},54935(e,t,n){var r=n(25305),i=n(44603),a=n(23568),o=n(20071);i.register(`shader`,function(e,t){e===void 0&&(e={});var n=a(e,`config`,null),i=a(e,`x`,0),s=a(e,`y`,0),c=a(e,`width`,128),l=a(e,`height`,128),u=new o(this.scene,n,i,s,c,l);return t!==void 0&&(e.add=t),r(this.scene,u,e),u})},74177(e,t,n){var r=n(20071);n(39429).register(`shader`,function(e,t,n,i,a,o){return this.displayList.add(new r(this.scene,e,t,n,i,a,o))})},25479(e,t,n){var r=n(29747),i=r,a=r;i=n(19257),a=n(80464),e.exports={renderWebGL:i,renderCanvas:a}},19257(e){e.exports=function(e,t,n,r){if(n.camera.addToRenderList(t),t.renderToTexture){if(n=t.drawingContext,n.width!==t.width||n.height!==t.height){var i=t.width,a=t.height;n.resize(i,a),n.camera.setSize(i,a)}n.use()}t.renderNode.run(n,t,r),t.renderToTexture&&n.release()}},10441(e,t,n){var r=n(70554);e.exports=function(e,t,n,i,a,o,s){var c=r.getTintAppendFloatAlpha(i.fillColor,i.fillAlpha*a),l=i.pathData,u=i.pathIndexes,d=l.length,f,p,m,h,g,_=Array(d*2),v=Array(d),y=0,b=0;for(f=0;f<d;f+=2)p=l[f]-o,m=l[f+1]-s,h=n.getX(p,m),g=n.getY(p,m),_[y++]=h,_[y++]=g,v[b++]=c;t.batch(e,u,_,v,i.lighting)}},65960(e){e.exports=function(e,t,n,r){var i=n||t.fillColor,a=r||t.fillAlpha,o=(i&16711680)>>>16,s=(i&65280)>>>8,c=i&255;e.fillStyle=`rgba(`+o+`,`+s+`,`+c+`,`+a+`)`}},75177(e){e.exports=function(e,t,n,r){var i=n||t.strokeColor,a=r||t.strokeAlpha,o=(i&16711680)>>>16,s=(i&65280)>>>8,c=i&255;e.strokeStyle=`rgba(`+o+`,`+s+`,`+c+`,`+a+`)`,e.lineWidth=t.lineWidth}},17803(e,t,n){var r=n(87891),i=n(83419),a=n(31401),o=n(95643),s=n(23031);e.exports=new i({Extends:o,Mixins:[a.AlphaSingle,a.BlendMode,a.Depth,a.GetBounds,a.Lighting,a.Mask,a.Origin,a.RenderNodes,a.ScrollFactor,a.Transform,a.Visible],initialize:function(e,t,n){t===void 0&&(t=`Shape`),o.call(this,e,t),this.geom=n,this.pathData=[],this.pathIndexes=[],this.fillColor=16777215,this.fillAlpha=1,this.strokeColor=16777215,this.strokeAlpha=1,this.lineWidth=1,this.isFilled=!1,this.isStroked=!1,this.closePath=!0,this._tempLine=new s,this.width=0,this.height=0,this.enableFilters&&(this.filtersFocusContext=!0),this.initRenderNodes(this._defaultRenderNodesMap)},_defaultRenderNodesMap:{get:function(){return r}},setFillStyle:function(e,t){return t===void 0&&(t=1),e===void 0?this.isFilled=!1:(this.fillColor=e,this.fillAlpha=t,this.isFilled=!0),this},setStrokeStyle:function(e,t,n){return n===void 0&&(n=1),e===void 0?this.isStroked=!1:(this.lineWidth=e,this.strokeColor=t,this.strokeAlpha=n,this.isStroked=!0),this},setClosePath:function(e){return this.closePath=e,this},setSize:function(e,t){return this.width=e,this.height=t,this},setDisplaySize:function(e,t){return this.displayWidth=e,this.displayHeight=t,this},preDestroy:function(){this.geom=null,this._tempLine=null,this.pathData=[],this.pathIndexes=[]},displayWidth:{get:function(){return this.scaleX*this.width},set:function(e){this.scaleX=e/this.width}},displayHeight:{get:function(){return this.scaleY*this.height},set:function(e){this.scaleY=e/this.height}}})},34682(e,t,n){var r=n(70554);e.exports=function(e,t,n,i,a,o,s){var c=r.getTintAppendFloatAlpha(i.strokeColor,i.strokeAlpha*a),l=i.pathData,u=l.length-1,d=i.lineWidth,f=!i.closePath,p=i.customRenderNodes.StrokePath||i.defaultRenderNodes.StrokePath,m=[];f&&(u-=2);for(var h=0;h<u;h+=2){var g=l[h]-o,_=l[h+1]-s;h>0&&g===l[h-2]&&_===l[h-1]||m.push({x:g,y:_,width:d})}p.run(e,t,m,d,f,n,c,c,c,c,void 0,i.lighting)}},23629(e,t,n){var r=n(13609),i=n(83419),a=n(39506),o=n(94811),s=n(96503),c=n(36383),l=n(17803);e.exports=new i({Extends:l,Mixins:[r],initialize:function(e,t,n,r,i,a,o,c,u){t===void 0&&(t=0),n===void 0&&(n=0),r===void 0&&(r=128),i===void 0&&(i=0),a===void 0&&(a=360),o===void 0&&(o=!1),l.call(this,e,`Arc`,new s(0,0,r)),this._startAngle=i,this._endAngle=a,this._anticlockwise=o,this._iterations=.01,this.setPosition(t,n);var d=this.geom.radius*2;this.setSize(d,d),c!==void 0&&this.setFillStyle(c,u),this.updateDisplayOrigin(),this.updateData()},iterations:{get:function(){return this._iterations},set:function(e){this._iterations=e,this.updateData()}},radius:{get:function(){return this.geom.radius},set:function(e){this.geom.radius=e;var t=e*2;this.setSize(t,t),this.updateDisplayOrigin(),this.updateData()}},startAngle:{get:function(){return this._startAngle},set:function(e){this._startAngle=e,this.updateData()}},endAngle:{get:function(){return this._endAngle},set:function(e){this._endAngle=e,this.updateData()}},anticlockwise:{get:function(){return this._anticlockwise},set:function(e){this._anticlockwise=e,this.updateData()}},setRadius:function(e){return this.radius=e,this},setIterations:function(e){return e===void 0&&(e=.01),this.iterations=e,this},setStartAngle:function(e,t){return this._startAngle=e,t!==void 0&&(this._anticlockwise=t),this.updateData()},setEndAngle:function(e,t){return this._endAngle=e,t!==void 0&&(this._anticlockwise=t),this.updateData()},updateData:function(){var e=this._iterations,t=e,n=this.geom.radius,r=a(this._startAngle),i=a(this._endAngle),s=this._anticlockwise,l=n,u=n;i-=r,s?i<-c.TAU?i=-c.TAU:i>0&&(i=-c.TAU+i%c.TAU):i>c.TAU?i=c.TAU:i<0&&(i=c.TAU+i%c.TAU);for(var d=[l+Math.cos(r)*n,u+Math.sin(r)*n],f;t<1;)f=i*t+r,d.push(l+Math.cos(f)*n,u+Math.sin(f)*n),t+=e;return f=i+r,d.push(l+Math.cos(f)*n,u+Math.sin(f)*n),d.push(l+Math.cos(r)*n,u+Math.sin(r)*n),this.pathIndexes=o(d),this.pathData=d,this}})},42542(e,t,n){var r=n(39506),i=n(65960),a=n(75177),o=n(20926);e.exports=function(e,t,n,s){n.addToRenderList(t);var c=e.currentContext;if(o(e,c,t,n,s)){var l=t.radius;c.beginPath(),c.arc(l-t.originX*(l*2),l-t.originY*(l*2),l,r(t._startAngle),r(t._endAngle),t.anticlockwise),t.closePath&&c.closePath(),t.isFilled&&(i(c,t),c.fill()),t.isStroked&&(a(c,t),c.stroke()),c.restore()}}},42563(e,t,n){var r=n(23629),i=n(39429);i.register(`arc`,function(e,t,n,i,a,o,s,c){return this.displayList.add(new r(this.scene,e,t,n,i,a,o,s,c))}),i.register(`circle`,function(e,t,n,i,a){return this.displayList.add(new r(this.scene,e,t,n,0,360,!1,i,a))})},13609(e,t,n){var r=n(29747),i=r,a=r;i=n(41447),a=n(42542),e.exports={renderWebGL:i,renderCanvas:a}},41447(e,t,n){var r=n(91296),i=n(10441),a=n(34682);e.exports=function(e,t,n,o){var s=n.camera;s.addToRenderList(t);var c=r(t,s,o,!n.useCanvas).calc,l=t._displayOriginX,u=t._displayOriginY,d=t.alpha,f=t.customRenderNodes.Submitter||t.defaultRenderNodes.Submitter;t.isFilled&&i(n,f,c,t,d,l,u),t.isStroked&&a(n,f,c,t,d,l,u)}},89(e,t,n){var r=n(83419),i=n(33141),a=n(94811),o=n(87841),s=n(17803);e.exports=new r({Extends:s,Mixins:[i],initialize:function(e,t,n,r,i,a){t===void 0&&(t=0),n===void 0&&(n=0),s.call(this,e,`Curve`,r),this._smoothness=32,this._curveBounds=new o,this.closePath=!1,this.setPosition(t,n),i!==void 0&&this.setFillStyle(i,a),this.updateData()},smoothness:{get:function(){return this._smoothness},set:function(e){this._smoothness=e,this.updateData()}},setSmoothness:function(e){return this._smoothness=e,this.updateData()},updateData:function(){var e=this._curveBounds,t=this._smoothness;this.geom.getBounds(e,t),this.setSize(e.width,e.height),this.updateDisplayOrigin();for(var n=[],r=this.geom.getPoints(t),i=0;i<r.length;i++)n.push(r[i].x,r[i].y);return n.push(r[0].x,r[0].y),this.pathIndexes=a(n),this.pathData=n,this}})},3170(e,t,n){var r=n(65960),i=n(75177),a=n(20926);e.exports=function(e,t,n,o){n.addToRenderList(t);var s=e.currentContext;if(a(e,s,t,n,o)){var c=t._displayOriginX+t._curveBounds.x,l=t._displayOriginY+t._curveBounds.y,u=t.pathData,d=u.length-1,f=u[0]-c,p=u[1]-l;s.beginPath(),s.moveTo(f,p),t.closePath||(d-=2);for(var m=2;m<d;m+=2){var h=u[m]-c,g=u[m+1]-l;s.lineTo(h,g)}t.closePath&&s.closePath(),t.isFilled&&(r(s,t),s.fill()),t.isStroked&&(i(s,t),s.stroke()),s.restore()}}},40511(e,t,n){var r=n(39429),i=n(89);r.register(`curve`,function(e,t,n,r,a){return this.displayList.add(new i(this.scene,e,t,n,r,a))})},33141(e,t,n){var r=n(29747),i=r,a=r;i=n(53987),a=n(3170),e.exports={renderWebGL:i,renderCanvas:a}},53987(e,t,n){var r=n(10441),i=n(91296),a=n(34682);e.exports=function(e,t,n,o){var s=n.camera;s.addToRenderList(t);var c=i(t,s,o,!n.useCanvas).calc,l=t._displayOriginX+t._curveBounds.x,u=t._displayOriginY+t._curveBounds.y,d=t.alpha,f=t.customRenderNodes.Submitter||t.defaultRenderNodes.Submitter;t.isFilled&&r(n,f,c,t,d,l,u),t.isStroked&&a(n,f,c,t,d,l,u)}},19921(e,t,n){var r=n(83419),i=n(94811),a=n(54205),o=n(8497),s=n(17803);e.exports=new r({Extends:s,Mixins:[a],initialize:function(e,t,n,r,i,a,c){t===void 0&&(t=0),n===void 0&&(n=0),r===void 0&&(r=128),i===void 0&&(i=128),s.call(this,e,`Ellipse`,new o(r/2,i/2,r,i)),this._smoothness=64,this.setPosition(t,n),this.width=r,this.height=i,a!==void 0&&this.setFillStyle(a,c),this.updateDisplayOrigin(),this.updateData()},smoothness:{get:function(){return this._smoothness},set:function(e){this._smoothness=e,this.updateData()}},setSize:function(e,t){return this.width=e,this.height=t,this.geom.setPosition(e/2,t/2),this.geom.setSize(e,t),this.updateDisplayOrigin(),this.updateData()},setSmoothness:function(e){return this._smoothness=e,this.updateData()},updateData:function(){for(var e=[],t=this.geom.getPoints(this._smoothness),n=0;n<t.length;n++)e.push(t[n].x,t[n].y);return e.push(t[0].x,t[0].y),this.pathIndexes=i(e),this.pathData=e,this}})},7930(e,t,n){var r=n(65960),i=n(75177),a=n(20926);e.exports=function(e,t,n,o){n.addToRenderList(t);var s=e.currentContext;if(a(e,s,t,n,o)){var c=t._displayOriginX,l=t._displayOriginY,u=t.pathData,d=u.length-1,f=u[0]-c,p=u[1]-l;s.beginPath(),s.moveTo(f,p),t.closePath||(d-=2);for(var m=2;m<d;m+=2){var h=u[m]-c,g=u[m+1]-l;s.lineTo(h,g)}s.closePath(),t.isFilled&&(r(s,t),s.fill()),t.isStroked&&(i(s,t),s.stroke()),s.restore()}}},1543(e,t,n){var r=n(19921);n(39429).register(`ellipse`,function(e,t,n,i,a,o){return this.displayList.add(new r(this.scene,e,t,n,i,a,o))})},54205(e,t,n){var r=n(29747),i=r,a=r;i=n(19467),a=n(7930),e.exports={renderWebGL:i,renderCanvas:a}},19467(e,t,n){var r=n(10441),i=n(91296),a=n(34682);e.exports=function(e,t,n,o){var s=n.camera;s.addToRenderList(t);var c=i(t,s,o,!n.useCanvas).calc,l=t._displayOriginX,u=t._displayOriginY,d=t.alpha,f=t.customRenderNodes.Submitter||t.defaultRenderNodes.Submitter;t.isFilled&&r(n,f,c,t,d,l,u),t.isStroked&&a(n,f,c,t,d,l,u)}},30479(e,t,n){var r=n(83419),i=n(17803);e.exports=new r({Extends:i,Mixins:[n(26015)],initialize:function(e,t,n,r,a,o,s,c,l,u,d){t===void 0&&(t=0),n===void 0&&(n=0),r===void 0&&(r=128),a===void 0&&(a=128),o===void 0&&(o=32),s===void 0&&(s=32),i.call(this,e,`Grid`,null),this.cellWidth=o,this.cellHeight=s,this.showAltCells=!1,this.altFillColor,this.altFillAlpha,this.cellPadding=.5,this.strokeOutside=!1,this.strokeOutsideIncomplete=!0,this.setPosition(t,n),this.setSize(r,a),this.setFillStyle(c,l),u!==void 0&&this.setStrokeStyle(1,u,d),this.updateDisplayOrigin()},setAltFillStyle:function(e,t){return t===void 0&&(t=1),e===void 0?this.showAltCells=!1:(this.altFillColor=e,this.altFillAlpha=t,this.showAltCells=!0),this},setCellPadding:function(e){return this.cellPadding=e||0,this},setStrokeOutside:function(e,t){return this.strokeOutside=e,t!==void 0&&(this.strokeOutsideIncomplete=t),this}})},49912(e,t,n){var r=n(65960),i=n(75177),a=n(20926);e.exports=function(e,t,n,o){n.addToRenderList(t);var s=e.currentContext;if(a(e,s,t,n,o)){var c=-t._displayOriginX,l=-t._displayOriginY,u=n.alpha*t.alpha,d=t.width,f=t.height,p=t.cellWidth,m=t.cellHeight,h=Math.ceil(d/p),g=Math.ceil(f/m),_=p,v=m,y=p-(h*p-d),b=m-(g*m-f),x=t.isFilled,S=t.showAltCells,C=t.isStroked,w=t.cellPadding,T=t.lineWidth/2,E=0,D=0,O=0,k=0,A=0;if(w&&(_-=w*2,v-=w*2,y-=w*2,b-=w*2),x&&t.fillAlpha>0)for(r(s,t),D=0;D<g;D++)for(S&&(O=D%2),E=0;E<h;E++){if(S&&O){O=0;continue}O++,k=E<h-1?_:y,A=D<g-1?v:b,k>0&&A>0&&s.fillRect(c+E*p+w,l+D*m+w,k,A)}if(S&&t.altFillAlpha>0)for(r(s,t,t.altFillColor,t.altFillAlpha*u),D=0;D<g;D++)for(S&&(O=D%2),E=0;E<h;E++){if(S&&!O){O=1;continue}O=0,k=E<h-1?_:y,A=D<g-1?v:b,k>0&&A>0&&s.fillRect(c+E*p+w,l+D*m+w,k,A)}if(C&&t.strokeAlpha>0){i(s,t,t.strokeColor,t.strokeAlpha*u);var j=+!t.strokeOutside;for(E=j;E<h;E++){var M=E*p;s.beginPath(),s.moveTo(M+c,l),s.lineTo(M+c,f+l),s.stroke()}for(D=j;D<g;D++){var N=D*m;s.beginPath(),s.moveTo(c,N+l),s.lineTo(c+d,N+l),s.stroke()}t.strokeOutside&&(d>T&&(s.beginPath(),s.moveTo(d+c,l),s.lineTo(d+c,f+l),s.stroke()),f>T&&(s.beginPath(),s.moveTo(c,f+l),s.lineTo(d+c,f+l),s.stroke()))}s.restore()}}},34137(e,t,n){var r=n(39429),i=n(30479);r.register(`grid`,function(e,t,n,r,a,o,s,c,l,u){return this.displayList.add(new i(this.scene,e,t,n,r,a,o,s,c,l,u))})},26015(e,t,n){var r=n(29747),i=r,a=r;i=n(46161),a=n(49912),e.exports={renderWebGL:i,renderCanvas:a}},46161(e,t,n){var r=n(91296),i=n(70554);e.exports=function(e,t,n,a){var o=n.camera;o.addToRenderList(t);var s=t.customRenderNodes.FillRect||t.defaultRenderNodes.FillRect,c=t.customRenderNodes.Submitter||t.defaultRenderNodes.Submitter,l=r(t,o,a,!n.useCanvas).calc;l.translate(-t._displayOriginX,-t._displayOriginY);var u=t.alpha,d=t.width,f=t.height,p=t.cellWidth,m=t.cellHeight,h=Math.ceil(d/p),g=Math.ceil(f/m),_=p,v=m,y=p-(h*p-d),b=m-(g*m-f),x,S=t.isFilled,C=t.showAltCells,w=t.isStroked,T=t.cellPadding,E=t.lineWidth,D=E/2,O=0,k=0,A=0,j=0,M=0;if(T&&(_-=T*2,v-=T*2,y-=T*2,b-=T*2),S&&t.fillAlpha>0)for(x=i.getTintAppendFloatAlpha(t.fillColor,t.fillAlpha*u),k=0;k<g;k++)for(C&&(A=k%2),O=0;O<h;O++){if(C&&A){A=0;continue}A++,j=O<h-1?_:y,M=k<g-1?v:b,j>0&&M>0&&s.run(n,l,c,O*p+T,k*m+T,j,M,x,x,x,x,t.lighting)}if(C&&t.altFillAlpha>0)for(x=i.getTintAppendFloatAlpha(t.altFillColor,t.altFillAlpha*u),k=0;k<g;k++)for(C&&(A=k%2),O=0;O<h;O++){if(C&&!A){A=1;continue}A=0,j=O<h-1?_:y,M=k<g-1?v:b,j>0&&M>0&&s.run(n,l,c,O*p+T,k*m+T,j,M,x,x,x,x)}if(w&&t.strokeAlpha>0){var N=i.getTintAppendFloatAlpha(t.strokeColor,t.strokeAlpha*u),P=+!t.strokeOutside;for(O=P;O<h;O++){var F=O*p-D;s.run(n,l,c,F,0,E,f,N,N,N,N)}for(k=P;k<g;k++){var I=k*m-D;s.run(n,l,c,0,I,d,E,N,N,N,N)}t.strokeOutside&&t.strokeOutsideIncomplete&&(d>D&&s.run(n,l,c,d-D,0,E,f,N,N,N,N),f>D&&s.run(n,l,c,0,f-D,d,E,N,N,N,N))}}},61475(e,t,n){var r=n(99651),i=n(83419),a=n(17803);e.exports=new i({Extends:a,Mixins:[r],initialize:function(e,t,n,r,i,o,s,c){t===void 0&&(t=0),n===void 0&&(n=0),r===void 0&&(r=48),i===void 0&&(i=32),o===void 0&&(o=15658734),s===void 0&&(s=10066329),c===void 0&&(c=13421772),a.call(this,e,`IsoBox`,null),this.projection=4,this.fillTop=o,this.fillLeft=s,this.fillRight=c,this.showTop=!0,this.showLeft=!0,this.showRight=!0,this.isFilled=!0,this.setPosition(t,n),this.setSize(r,i),this.updateDisplayOrigin()},setProjection:function(e){return this.projection=e,this},setFaces:function(e,t,n){return e===void 0&&(e=!0),t===void 0&&(t=!0),n===void 0&&(n=!0),this.showTop=e,this.showLeft=t,this.showRight=n,this},setFillStyle:function(e,t,n){return this.fillTop=e,this.fillLeft=t,this.fillRight=n,this.isFilled=!0,this}})},11508(e,t,n){var r=n(65960),i=n(20926);e.exports=function(e,t,n,a){n.addToRenderList(t);var o=e.currentContext;if(i(e,o,t,n,a)&&t.isFilled){var s=t.width,c=t.height,l=s/2,u=s/t.projection;t.showTop&&(r(o,t,t.fillTop),o.beginPath(),o.moveTo(-l,-c),o.lineTo(0,-u-c),o.lineTo(l,-c),o.lineTo(l,-1),o.lineTo(0,u-1),o.lineTo(-l,-1),o.lineTo(-l,-c),o.fill()),t.showLeft&&(r(o,t,t.fillLeft),o.beginPath(),o.moveTo(-l,0),o.lineTo(0,u),o.lineTo(0,u-c),o.lineTo(-l,-c),o.lineTo(-l,0),o.fill()),t.showRight&&(r(o,t,t.fillRight),o.beginPath(),o.moveTo(l,0),o.lineTo(0,u),o.lineTo(0,u-c),o.lineTo(l,-c),o.lineTo(l,0),o.fill()),o.restore()}}},3933(e,t,n){var r=n(39429),i=n(61475);r.register(`isobox`,function(e,t,n,r,a,o,s){return this.displayList.add(new i(this.scene,e,t,n,r,a,o,s))})},99651(e,t,n){var r=n(29747),i=r,a=r;i=n(68149),a=n(11508),e.exports={renderWebGL:i,renderCanvas:a}},68149(e,t,n){var r=n(91296),i=n(70554);e.exports=function(e,t,n,a){if(t.isFilled){var o=n.camera;o.addToRenderList(t);var s=t.customRenderNodes.FillTri||t.defaultRenderNodes.FillTri,c=t.customRenderNodes.Submitter||t.defaultRenderNodes.Submitter,l=r(t,o,a,!n.useCanvas).calc,u=t.width,d=t.height,f=u/2,p=u/t.projection,m=t.alpha,h,g=t.lighting,_,v,y,b,x,S,C,w;t.showTop&&(h=i.getTintAppendFloatAlpha(t.fillTop,m),_=-f,v=-d,y=0,b=-p-d,x=f,S=-d,C=0,w=p-d,s.run(n,l,c,_,v,y,b,x,S,h,h,h,g),s.run(n,l,c,x,S,C,w,_,v,h,h,h,g)),t.showLeft&&(h=i.getTintAppendFloatAlpha(t.fillLeft,m),_=-f,v=0,y=0,b=p,x=0,S=p-d,C=-f,w=-d,s.run(n,l,c,_,v,y,b,x,S,h,h,h,g),s.run(n,l,c,x,S,C,w,_,v,h,h,h,g)),t.showRight&&(h=i.getTintAppendFloatAlpha(t.fillRight,m),_=f,v=0,y=0,b=p,x=0,S=p-d,C=f,w=-d,s.run(n,l,c,_,v,y,b,x,S,h,h,h,g),s.run(n,l,c,x,S,C,w,_,v,h,h,h,g))}}},16933(e,t,n){var r=n(83419),i=n(60561),a=n(17803);e.exports=new r({Extends:a,Mixins:[i],initialize:function(e,t,n,r,i,o,s,c,l){t===void 0&&(t=0),n===void 0&&(n=0),r===void 0&&(r=48),i===void 0&&(i=32),o===void 0&&(o=!1),s===void 0&&(s=15658734),c===void 0&&(c=10066329),l===void 0&&(l=13421772),a.call(this,e,`IsoTriangle`,null),this.projection=4,this.fillTop=s,this.fillLeft=c,this.fillRight=l,this.showTop=!0,this.showLeft=!0,this.showRight=!0,this.isReversed=o,this.isFilled=!0,this.setPosition(t,n),this.setSize(r,i),this.updateDisplayOrigin()},setProjection:function(e){return this.projection=e,this},setReversed:function(e){return this.isReversed=e,this},setFaces:function(e,t,n){return e===void 0&&(e=!0),t===void 0&&(t=!0),n===void 0&&(n=!0),this.showTop=e,this.showLeft=t,this.showRight=n,this},setFillStyle:function(e,t,n){return this.fillTop=e,this.fillLeft=t,this.fillRight=n,this.isFilled=!0,this}})},79590(e,t,n){var r=n(65960),i=n(20926);e.exports=function(e,t,n,a){n.addToRenderList(t);var o=e.currentContext;if(i(e,o,t,n,a)&&t.isFilled){var s=t.width,c=t.height,l=s/2,u=s/t.projection,d=t.isReversed;t.showTop&&d&&(r(o,t,t.fillTop),o.beginPath(),o.moveTo(-l,-c),o.lineTo(0,-u-c),o.lineTo(l,-c),o.lineTo(0,u-c),o.fill()),t.showLeft&&(r(o,t,t.fillLeft),o.beginPath(),d?(o.moveTo(-l,-c),o.lineTo(0,u),o.lineTo(0,u-c)):(o.moveTo(-l,0),o.lineTo(0,u),o.lineTo(0,u-c)),o.fill()),t.showRight&&(r(o,t,t.fillRight),o.beginPath(),d?(o.moveTo(l,-c),o.lineTo(0,u),o.lineTo(0,u-c)):(o.moveTo(l,0),o.lineTo(0,u),o.lineTo(0,u-c)),o.fill()),o.restore()}}},49803(e,t,n){var r=n(39429),i=n(16933);r.register(`isotriangle`,function(e,t,n,r,a,o,s,c){return this.displayList.add(new i(this.scene,e,t,n,r,a,o,s,c))})},60561(e,t,n){var r=n(29747),i=r,a=r;i=n(51503),a=n(79590),e.exports={renderWebGL:i,renderCanvas:a}},51503(e,t,n){var r=n(91296),i=n(70554);e.exports=function(e,t,n,a){if(t.isFilled){var o=n.camera;o.addToRenderList(t);var s=t.customRenderNodes.FillTri||t.defaultRenderNodes.FillTri,c=t.customRenderNodes.Submitter||t.defaultRenderNodes.Submitter,l=r(t,o,a,!n.useCanvas).calc,u=t.width,d=t.height,f=u/2,p=u/t.projection,m=t.isReversed,h=t.alpha,g=t.lighting,_,v,y,b,x,S,C;if(t.showTop&&m){_=i.getTintAppendFloatAlpha(t.fillTop,h),v=-f,y=-d,b=0,x=-p-d,S=f,C=-d;var w=0,T=p-d;s.run(n,l,c,v,y,b,x,S,C,_,_,_,g),s.run(n,l,c,S,C,w,T,v,y,_,_,_,g)}t.showLeft&&(_=i.getTintAppendFloatAlpha(t.fillLeft,h),m?(v=-f,y=-d,b=0,x=p,S=0,C=p-d):(v=-f,y=0,b=0,x=p,S=0,C=p-d),s.run(n,l,c,v,y,b,x,S,C,_,_,_,g)),t.showRight&&(_=i.getTintAppendFloatAlpha(t.fillRight,h),m?(v=f,y=-d,b=0,x=p,S=0,C=p-d):(v=f,y=0,b=0,x=p,S=0,C=p-d),s.run(n,l,c,v,y,b,x,S,C,_,_,_,g))}}},57847(e,t,n){var r=n(83419),i=n(17803),a=n(23031);e.exports=new r({Extends:i,Mixins:[n(36823)],initialize:function(e,t,n,r,o,s,c,l,u){t===void 0&&(t=0),n===void 0&&(n=0),r===void 0&&(r=0),o===void 0&&(o=0),s===void 0&&(s=128),c===void 0&&(c=0),i.call(this,e,`Line`,new a(r,o,s,c)),this.lineWidth=1,this._startWidth=1,this._endWidth=1,this.setPosition(t,n),this.updateSize(),l!==void 0&&this.setStrokeStyle(1,l,u),this.updateDisplayOrigin()},setLineWidth:function(e,t){return t===void 0&&(t=e),this._startWidth=e,this._endWidth=t,this.lineWidth=e,this},setTo:function(e,t,n,r){return this.geom.setTo(e,t,n,r),this.updateSize(),this},updateSize:function(){var e=Math.max(1,this.geom.right-this.geom.left),t=Math.max(1,this.geom.bottom-this.geom.top);return this.setSize(e,t),this}})},17440(e,t,n){var r=n(75177),i=n(20926);e.exports=function(e,t,n,a){n.addToRenderList(t);var o=e.currentContext;if(i(e,o,t,n,a)){var s=t._displayOriginX,c=t._displayOriginY;t.isStroked&&(r(o,t),o.beginPath(),o.moveTo(t.geom.x1-s,t.geom.y1-c),o.lineTo(t.geom.x2-s,t.geom.y2-c),o.stroke()),o.restore()}}},2481(e,t,n){var r=n(39429),i=n(57847);r.register(`line`,function(e,t,n,r,a,o,s,c){return this.displayList.add(new i(this.scene,e,t,n,r,a,o,s,c))})},36823(e,t,n){var r=n(29747),i=r,a=r;i=n(77385),a=n(17440),e.exports={renderWebGL:i,renderCanvas:a}},77385(e,t,n){var r=n(91296),i=n(70554),a=[{x:0,y:0,width:0},{x:0,y:0,width:0}];e.exports=function(e,t,n,o){var s=n.camera;s.addToRenderList(t);var c=r(t,s,o,!n.useCanvas).calc,l=t._displayOriginX,u=t._displayOriginY,d=t.alpha;if(t.isStroked){var f=i.getTintAppendFloatAlpha(t.strokeColor,t.strokeAlpha*d);a[0].x=t.geom.x1-l,a[0].y=t.geom.y1-u,a[0].width=t._startWidth,a[1].x=t.geom.x2-l,a[1].y=t.geom.y2-u,a[1].width=t._endWidth,(t.customRenderNodes.StrokePath||t.defaultRenderNodes.StrokePath).run(n,t.customRenderNodes.Submitter||t.defaultRenderNodes.Submitter,a,1,!0,c,f,f,f,f,void 0,t.lighting)}}},24949(e,t,n){var r=n(90273),i=n(83419),a=n(94811),o=n(13829),s=n(25717),c=n(17803),l=n(5469);e.exports=new i({Extends:c,Mixins:[r],initialize:function(e,t,n,r,i,a){t===void 0&&(t=0),n===void 0&&(n=0),c.call(this,e,`Polygon`,new s(r));var l=o(this.geom);thi×Ÿu÷Ş›Ê×¬¢h­µçJ\™]\›Û]YK›[™İOOMÑÜŠ
KœÛXÙJŠN™K›[™İOOLÏÖŞŞ‹K\‹MKŞ‹K\‹ŸKŞ‹MMK\‹ŸWN–ŞŞ‹K\‹L_WNÙK™›Ü‘XXÚ

KŠOO“Øš™Xİ˜\ÜÚYÛŠKŞÛ—K\Û—K™\JJ_Yš[š\Ú
J^Û]]\Ëœİ]NÚYŠ]œ\ÙOOOXš[š\ÚY
\™]\›İœ\ÙOXš[š\ÚYœ[›š[™ÏHLKœ]\ÙYHL\Ë˜Xİ[Û‹™\ØX›YHL\Ëœ]\ÙP]Û‹™\ØX›YHL\Ëœ™]P]Û‹šY[HLNÛ]SX]›X^
X]œ›İ[™
š]ÊŒLË]›Z\ÜÙ\ÊŒÊİ˜›İ[˜ÙR]ÊŒLŠİ˜™\İİ™XZÊK]›ÜÛ™[]ÊŒŠJKYI‰›Z\ÜÙ\ÏL‰‰˜›İ[˜ÙR]ÏLOØ\™™Xİ™I‰›Z\ÜÙ\ÏMØÛÛY™OØY\ÜŞX˜˜Z[YO^ÚY˜™Y\”Û™ØİXØÙ\ÜÎ™KØÛÜ™N›‹]X[]Nœ‹^™OÜOOX\™™XİØYHÙYÛ™\š\ØÚH›Ü›X][Ûˆ\İY\‹ˆ\™ZİHğï™™KZ[ˆÛÛ›ÛY\\ˆ]Y™İ™\ˆ[™Z[™H[™ÙH™Y™™\™›ÛÙH\ÜÙ[ˆÙZ[™H]\Ü™YH0ïœšYË˜˜\ˆ]HÙYÛ™\š\ØÚH™XÚ\ˆ\İÙYËˆ™Y\ˆ™Y™™\ˆœ˜XÚHZ[™[ˆÙZ]\™[ˆİ\™ˆ[™YH\ØÚ\œÜZİ]™Hİ\™H]ğéÚXÚÙ[]˜˜YHÙYÙ[œÙZ]H°é[]]\™H›Ü›X][ÛˆY\œİX‹ˆ™Y™™\šÙ][ˆ[™]Y™İ™\ˆ›ZX™[ˆ°ïˆ[ˆ°éÚİ[ˆ™\œİXÚ\š[[‹˜™YYÎØ[ÛÚÛ™OÌL›Y\™OÎKÛİ\˜YÙN™OÍ‹LŸKY]šXÜÎÜ™\]][Û™OÜOOX\™™XİÍŒÎ‹LK[ÛY[[N™OÍ‹LŸK™[][ÛœÚ\ÎJ\Ë˜ÛÛ^JK›YÜÎœOOX\™™XİŞÈœÛ™Ë\\œÜXİ]™K[X\İ\™YˆLN›ÚYNİ\Ëœ™\İ[šY[HLK\Ëœ™\İ[š[›™\’SXİ›Û™Ï‰ÙOÜOOX\™™XİØQÑS‘0á˜˜ÑUÓÓ“‘S˜˜‘T“Ô‘S˜OÜİ›Û™Ï‰ÙÚJK^
_OÜ]ˆÛ\ÜÏH›Z[šK\™\İ[\İ]ÈÜ[•Ù\‰ÛŸOØÜÜ[Ü[•™Y™™\ˆ‰İš]ßOØÜÜ[Ü[]Y™İ™\ˆ‰İ˜›İ[˜ÙR]ßOØÜÜ[Ù]˜\ËœÙ]™YY˜XÚÊOØÑUÓÓ“‘S˜˜‘T“Ô‘S˜Ù\	ÛŸXOØÛÛÙ˜˜Y
K\Ë›Û“İ]ÛÛYJJ_\Ş[˜ÓX™[Ê
^Û]O]\Ëœİ]NÚYŠYJ\™]\›Û]YK˜İ\Ë™š[\ŠOO™K˜Xİ]™JK›[™İÙK˜Ûİ[İÛŒÊ\Ëœ\ÙSX™[^ÛÛ[XÕT•\Ë›]™SX™[^ÛÛ[Tİš[™ÊX]˜ÙZ[
K˜Ûİ[İÛ‹ÌYLÊJJNŠ\Ëœ\ÙSX™[^ÛÛ[YKœ\ÙOOOXÜÛ™[ØÑQÓ‘TˆSH•QØ˜	İHÑQÓ‘T‘PÒT˜\Ë›]™SX™[^ÛÛ[YKœ™\İ[[Y\ŒÙKœ™\İ[^›šJJJNÛ]]\Ëœ›Ûİœ]Y\TÙ[XİÜŠ›Z[šK[]™K\›ÙÜ™\ÜÈX
NÛ‰‰Š‹œİ[KÚYX	ÊL]
JŒLIX
_\Ù]™YY˜XÚÊKŠ^Û]]\Ëœİ]NÜ‰‰ŠØš™Xİ˜\ÜÚYÛŠ‹Ü™\İ[^™\İ[Û™N›‹™\İ[[Y\LJK\Ëœ\ÙSX™[^ÛÛ[YK\Ë›]™SX™[^ÛÛ[]\Ëœ›Ûİ™]\Ù]˜™Y\”Û™Ñ™YY˜XÚÏ[‹Ú[™İËœÙ][Y[İ]


OOİ\Ëœ›Ûİ™]\Ù]˜™Y\”Û™Ñ™YY˜XÚÏOO[‰‰™[]H\Ëœ›Ûİ™]\Ù]˜™Y\”Û™Ñ™YY˜XÚßK
K\[Ùˆ˜]šYØ]Ü‹šXœ˜]OOX[˜İ[Û˜	‰›˜]šYØ]Ü‹šXœ˜]JOOXÛÛÙÖÌL‹KL—N›OOX˜YÖÌÍ—N–ÌLJJ_Y˜]Ê
^Û]O]\Ëœİ]NÚYŠYJ\™]\›Û]ØİØ[˜\Î›ŸO]\ËİÚYœ‹ZYÚš_O[İ˜ÛX\”™Xİ
‹JKšJ‹JKZJ‹JKZJ‹KJKÚJ‹KK˜İ\ÊKÚJ‹KKœ^Y\İ\ÊKÚJ‹KJKJ‹KJKZJ‹JKKœ]\ÙY	‰™Kœ[›š[™ÏÙJ‹KUTÒQT•›ÜÙ]™[ˆ0ï™\ˆYHØÚ[›0éÚHØ™\š[ˆ\ÈÜY[™[Ø
N™K˜Ûİ[İÛŒ	‰™J‹Kİš[™ÊX]˜ÙZ[
K˜Ûİ[İÛ‹ÌYLÊJK[H\ØÚ™\™Z]XXÚ[˜
_\Ú[
J^Û]]\Ë˜Ø[˜\Ë™Ù]›İ[™[™ĞÛY[™Xİ

NÜ™]\›Ş›ZJ
K˜ÛY[]›Y
KİÚYJKN›ZJ
K˜ÛY[K]Ü
KİšZYÚJ__Z[œ][İÙY

^Ü™]\›ˆHJ\Ëœİ]OËœ[›š[™É‰ˆ]\Ëœİ]Kœ]\ÙY	‰\Ëœİ]K˜Ûİ[İÛL	‰\Ëœİ]Kœ\ÙHOOXš[š\ÚY
__NÙ[˜İ[ÛˆœŠJ^Ü™]\›ˆOĞ\œ˜^K™œ›ÛJÛ[™İŒÍK
ŠOOœ\ŠK‹ÌÌÊJN–×_Y[˜İ[Ûˆ\ŠK
^Ü™]\›ˆK™š[\ŠOO™K˜Xİ]™I‰™HOO]
KœÛÜ

KŠOO“X]š\İ
K]K™\]™\
KSX]š\İ
‹]‹™\]™\
JVÌ_Y[˜İ[Ûˆ	ŠJ^Û]YOË™›YÜÏË–Ø\™\‹\İ\ÚK\Û™ØOËKŒÎŒÜ™]\›ˆZJ
ÊZJJKLJJ‹Œ
İŒÌ‹ŒŠ_Y[˜İ[ÛˆZJJ^ÚYŠYJ\™]\›ˆNÛ]YK˜][\ÏOOLË™KÚ[œÏLÌKŒŒNÜ™]\›ˆK˜™\İ]X[]OOOX\™™Xİ	‰Š
ÏKŒJKZJ‹KŒM
_Y[˜İ[ÛˆJK
^ÚYŠYJ\™]\›ßNÛ]VØİ\ÚX™[^K™š[\ŠO™K˜Xİ]™UX[Kš[˜ÛY\Ê
_K™›YÜÏË–Ø\™\‹IİK\Û™ØJNÜ™]\›ˆØš™Xİ™œ›ÛQ[šY\Ê‹›X\
OO–ÙKÌŒJJ_Y[˜İ[ÛˆšJJ^Ü™]\›ˆKœ\ÙOOOXZ[Z[™ØÙK›[ÙOOOX›İ[˜ÙXØ]Y™İ™\ˆ]\ÜšXÚ[ˆ[™ÜÛ\ÜÙ[˜˜›YØ˜Zˆ]\ÜšXÚ[ˆ[™ÜÛ\ÜÙ[˜™Kœ\ÙOOOX›YÚÙK›[ÙOOOX›İ[˜ÙXØ]Y™İ™\ˆ[\ÙYÜØ˜\™Zİ\ˆ˜[›YØ™Kœ\ÙOOOXÜÛ™[ØÙYÛ™\ˆšY[]Yˆ]\™H™XÚ\˜™Kœ\ÙOOOXš[š\ÚYØX]Ú™Y[™]™K›[ÙOOOX›İ[˜ÙXØ˜[Ü™ZY™[ˆ0­È]Y™İ™\ˆÙ]ğé˜˜[Ü™ZY™[ˆ0­È\™Zİİ\™ˆÙ]ğéY[˜İ[ÛˆšJKŠ^Û]YK˜Ü™X]S[™X\‘Ü˜YY[
ŠNÜ‹˜YÛÛÜ”İÜ
ÌLXŒ
K‹˜YÛÛÜ”İÜ
ÌÍL
K‹˜YÛÛÜ”İÜ
KÌLŒY˜
KK™š[İ[O\‹K™š[™Xİ
ŠKK™š[İ[OX™Ø˜JŒKLLŒLŠXÙ›ÜŠ]LİLNİ
ÏLJYK˜™YÚ[”]

KK˜\˜ÊMJİ
‹ŠÓX]œÚ[Š
ŒKÊJŒLX]”JŒŠKK™š[

_Y[˜İ[ÛˆZJKŠ^ÙK™š[İ[OXÍY˜Ì˜XK˜™YÚ[”]

KK›[İ™UÊ
‹ŒNKŠ‹MŠKK›[™UÊ
‹KŠ‹MŠKK›[™UÊ
‹ŒÍKŠ‹ŒM
KK›[™UÊ
‹ŒÍKŠ‹ŒM
KK˜ÛÜÙT]

KK™š[

KKœİ›ÚÙTİ[OXÙMYK›[™UÚYMKKœİ›ÚÙJ
KKœİ›ÚÙTİ[OX™Ø˜JMKŒLKŒÎ
XK›[™UÚYL‹K˜™YÚ[”]

KK›[İ™UÊ
‹KŠ‹MJKK›[™UÊ
‹KŠ‹ŒMJKKœİ›ÚÙJ
KK™š[İ[OXÍŒLY˜K™š[™Xİ

‹ŒNŠ‹MK
‹LŠ_Y[˜İ[ÛˆZJK‹Š^ÙKœØ]™J
KK˜[œÛ]J
‹KŠ‹ŒLJKK™š[İ[OXÌMÌNLYXK˜™YÚ[”]

KK˜\˜ÊŒ‹X]”JŒŠKK™š[

KK™š[™Xİ
LŒKNK‹LŠK‹œ\ÙOOOXÜÛ™[	‰ŠKœİ›ÚÙTİ[OXÙŒMØXK›[™UÚYMËK˜™YÚ[”]

KK›[İ™UÊLL‹
KK›[™UÊMŒŠÓX]œÚ[Š‹›ÜÛ™[[\ÙYÌMŒ
JŒL‹N
KKœİ›ÚÙJ
JKKœ™\İÜ™J
_Y[˜İ[ÛˆÚJK‹Š^Ù›ÜŠ]HÙˆŠ^ÚYŠZK˜Xİ]™JXÛÛ[YNÛ]V\ŠŞšK\šK™\ZYÚŒKŠKOLNJœ‹œØØ[KÏLLJœ‹œØØ[NÙK™š[İ[OXÙMNK˜™YÚ[”]

KK™[\ÙJ‹‹KKËX]”JŒŠKK™š[

KKœİ›ÚÙTİ[OXÙ™™ŒK›[™UÚYSX]›X^
KKÊœ‹œØØ[JKKœİ›ÚÙJ
KK™š[İ[OX™Ø˜JKŒKËÌŠXK˜™YÚ[”]

KK™[\ÙJ‹‹K[Ê‹ŒKJ‹Ì‹Ê‹MKX]”JŒŠKK™š[

__Y[˜İ[ÛˆÚJK‹Š^ÙK™š[İ[OX™Ø˜JËMKNÎ
XšJKN‹NMMÍ‹KM
KK™š[

KK™š[İ[OXÙ™MØ™K™›ÛXL\Ş\İ[K]ZXK™š[^
UT‘H‘PÒTˆ0­È	ÜŸKÌLÌK‹MJNÙ›ÜŠ]LİLİ
ÏLJYK™š[İ[O]ØÙMN˜ÍÌÍLÍ˜K˜™YÚ[”]

KK˜\˜ÊÍ
İ
ŒM‹M‹KX]”JŒŠKK™š[

_Y[˜İ[ÛˆÚJK‹Š^ÚYŠ‹œ™]šY]Ë›[™İ
^ÚYŠKœØ]™J
KKœÙ][™Q\Ú
ÍKWJKKœİ›ÚÙTİ[O\‹›[ÙOOOX›İ[˜ÙXØÙY˜ÌL˜˜ÍÍYXÌØK›[™UÚYMK˜™YÚ[”]

K‹œ™]šY]Ë™›Ü‘XXÚ

‹JOOÛ]OV\Š‹ŠNÚOOOLÙK›[İ™UÊKKJN™K›[™UÊKKJ_JKKœİ›ÚÙJ
KKœÙ][™Q\Ú
×JK‹›[ÙOOOX›İ[˜ÙX
^Û]O\‹œ™]šY]ÖÓX]™›ÛÜŠ‹œ™]šY]Ë›[™İÌŠWKOV\ŠKŠNÙK™š[İ[OXÙY˜ÌL˜K˜™YÚ[”]

KK˜\˜ÊKKKËX]”JŒŠKK™š[

KK™š[İ[OXÙ™™Œ™K™›ÛXLŞ\İ[K]ZXK™š[^
UQ‘Õ‘T˜K
ÌLKKN
_YKœ™\İÜ™J
K‹™˜YÓ›İÉ‰ŠKœİ›ÚÙTİ[OX™Ø˜JMKMKMKÍŠXK›[™UÚYMK˜™YÚ[”]

KK›[İ™UÊ\‹
\‹J›ŠKK›[™UÊ‹™˜YÓ›İË
‹™˜YÓ›İËJ›ŠKKœİ›ÚÙJ
J__Y[˜İ[ÛˆJK‹Š^Û]OU\‹
OU\‹J›‹ÏLNÚYŠ‹˜˜[
^Û]OV\Š‹˜˜[ŠNÚOYKOYKKÏYKœØØ[_Y[ÙHYŠ‹œ\ÙOOOXÜÛ™[
^Û]O[ZJ‹›ÜÛ™[[\ÙYÌLNJNÚO]
ŠJÓX]œÚ[ŠJ“X]”JJ‹Œ
KO[ŠšJŒMK‹JKSX]œÚ[ŠX]”J™JJLÏZJKKJ_YK™š[İ[OXÙÙŒÙ˜K˜™YÚ[”]

KK˜\˜ÊKKX]›X^
KLJ›ÊKX]”JŒŠKK™š[

KKœİ›ÚÙTİ[OXØÎXÌM˜K›[™UÚYL‹Kœİ›ÚÙJ
_Y[˜İ[ÛˆZJKŠ^Û][‹˜İ\Ë™š[\ŠOO™K˜Xİ]™JK›[™İÙK™š[İ[OX™Ø˜JKLËNÍŠXšJKLÍ‹M‹NM
KK™š[

KK™š[İ[OXÙ™™ŒXÍK™›ÛXLÜŞ\İ[K]ZXK™š[^
ÑQÓ‘Tˆ	ÜŸKÌL0­ÈRˆ	Û‹œ^Y\İ\ßKÌLLNŠKK™š[İ[O[‹›[ÙOOOX›İ[˜ÙXØÙY˜ÌL˜˜ÍÍYXÌØK™›ÛXLL\Ş\İ[K]ZXK™š[^
	Û‹›[ÙOOOX›İ[˜ÙXØUQ‘Õ‘T˜˜T‘RÕH0­ÈÑT’QH	Û‹œİ™XZßXLN
_Y[˜İ[ÛˆJK‹‹J^ÙK™š[İ[OX™Ø˜JKMKL‹ÍŠXK™š[™Xİ
ŠKK^[YÛXÙ[\˜K™š[İ[OXÙ™™ŒXÍK™›ÛXLŞ\İ[K]ZXK™š[^
‹Ì‹‹Ì‹LLŠKK™›ÛXÌMÜŞ\İ[K]ZXK™š[İ[OXØÎYK™š[^
KÌ‹‹ÌŠÌ
KK^[YÛXYY[˜İ[ÛˆšJK‹‹KJ^ÙK˜™YÚ[”]

KKœ›İ[™™Xİ
‹‹KJ_Y[˜İ[ÛˆJK
^Û]YKœ]Y\TÙ[XİÜŠ
NÚYŠ[Š]›İÈ\œ›ÜŠZ\ÜÚ[™È™Y\ˆÛ™È[[Y[ˆ	İX
NÜ™]\›ˆŸY[˜İ[ÛˆZJKŠ^Ü™]\›ˆX]›X^
X]›Z[Š‹JJ_Y[˜İ[ÛˆJKŠ^Ü™]\›ˆJÊYJJ›ŸY[˜İ[ÛˆÚJJ^Ü™]\›ˆİš[™ÊJKœ™\XÙJÖÉ‰È—KÙËOOŠÈ‰ˆ˜	˜[\Ø˜	›Øˆ˜	™İØ‰È˜	ˆÌÎNØ	È‰Î˜	œ][İØJVÙWOÏÙJ_]˜\ˆÚO^Ù›\İ\˜›\İ\0­ÈšY\ˆ™XÚ\‹Z[ˆÙ[YZ[œØ[Y\È™\™[œŞ\İ[X™Y\”Û™Î˜™Y\ˆÛ™È0­È›YØ˜Z‹š\ÚZÛÈ[™™Y[\[Û˜›[šŞX˜[˜›[šŞX˜[0­ÈÙ\™™[‹š[šÙ[‹™][‹ÕÔYÙTYN˜[ˆYHXÚÙH0­ÈXÚİ[™ËÚ[™[™™]ÙZ\ÛYÙXX\ÛÛN˜ÛÛ[H[œÈØÚ0­ÈX™XÚ[™Ëš]]\È[™Ú\šİ[™ØKšO^Ù›\İ\İ]N˜PSTÕQ‘‘SØš™Xİ]™N˜Y\™HšY\ˆ™XÚ\‹]šY\™H™Y[ˆ[ˆ\ˆØ[H[™›\HZˆÛÜ°ï™\‹™]›ÜˆYHÙYÙ[œÙZ]H™\YÈ\İ˜ÛÛ›ÛÎ–ØRÕSÓˆ[[ˆš[šÙ[˜™XÚ\ˆ[ˆ\ˆ\ØÚØ[HšYZ[˜›ÛH˜[™˜XÚØ™[ˆÚ\ØÚ[˜KX\İ\N˜\™™ZİH[™[™Ù[ˆ[™ØÚ™[\ÈÜÛ\ÜÙ[ˆ˜XÚ[HY\™[ˆ˜]Y[ˆZ[™[ˆİY™™[Ù\šY[˜›Û\È]Y‹˜[™Ù\˜H[™Ù\È[[ˆ™\œØÚ0ï]™Z][™ğï™Kˆ™Z›\ÈpïÜÙ[ˆÛÙ›ÜÚYY\šÛÙ\™[‹˜K™Y\”Û™Îİ]N˜”‘RQTˆÕT‘˜Øš™Xİ]™N˜°é[YH™Zˆ™XÚ\ˆX‹ˆ\™ZİHğï™™HÚ[™ÚXÚ\™\‹›İ[˜ÙKUğï™™Hš\ÚØ[\ˆ[™Ü[Ú\šÜØ[K˜ÛÛ›ÛÎ–Ø˜[™\°ï™[ˆ[™\°ïÚŞšYZ[˜ÜÛ\ÜÙ[ˆ›YØ˜Zˆİ\[˜RÕSÓˆ\™ZİĞ›İ[˜ÙHÙXÚÙ[˜KX\İ\N˜™KT˜XÚÜÈ™ZHÙXÚË™ZH[™Z[™[H™XÚ\ˆ™\°é™\›ˆYHšY[Ù[ÛY]šYKˆZ[ˆÜ0é\ˆ°ïÚÜİ[™Ø[›ˆ0ï™\ˆ™Y[\[ÛˆÙY™ZÙ\™[‹˜[™Ù\˜›İ[˜ÙKUğï™™H0ï™™[ˆX™Ù]ÙZÙ\™[‹ˆYHÙYÙ[œÙZ]HÜY[ÚXÚ˜\ˆÙZ]\‹˜K›[šŞX˜[İ]N˜PÒTÈPS“”ĞÒQ•ÑQSØš™Xİ]™N˜šY™ˆYHZ][›\ØÚKš[šÈš\È[HİÜYˆ[™™]H[ˆ\ˆ™\ZYYİ[™È›\ØÚH[™˜[˜ÛÛ›ÛÎ–Ø˜[\°ïÚŞšYZ[ˆ[™Ù\™™[˜RÕSÓˆ[[ˆš[šÙ[˜™[[\[ˆ]Y™[ˆ0­ÈRÕSÓˆ]Yœİ[[‹]Y›™ZY[‹ÕÔKX\İ\N˜°éš\ÙHğï™™Kİ\™H]YÙYÙH[™Z[ˆØ]X™\™\ˆİÜYˆ\™]YÙ[ˆ[ˆ0í˜Úİ[ˆÙ\˜[™Ù\˜˜XÚ[HİÜYˆÙZ]\š[šÙ[ˆ\İZ[ˆ›İ[ˆ[ˆ\ˆ™\ZYYİ[™Èš[šİYHÙYÙ[œÙZ]HÚ™H°ïÚÜÚXÚÙZ]\‹˜KYÙTYNİ]N˜ÕPSRUÕRÓÓ•“ÓXØš™Xİ]™N˜ğéHXÚİ[™Ë[H\ˆ\›ZXÚ\[™È[™İ]Y\™HYHšXÚ[™È›İˆÚ[™[›™\š[ˆ\ˆXÚÙK˜ÛÛ›ÛÎ–Øİ[H[\[˜RÕSÓˆ[[ˆœ[™[˜]Yˆ[H™[šXÚ[™ÈÛÜœšYÚY\™[˜KX\İ\N˜Ù[šYÙH[\˜œ™XÚ[™Ù[‹ÙZ[™H™]ÙZ\ÙH[™šYYšYÙ\ˆ™\™XÚ\™ÙX™[ˆZ[™H]]ÜÙHYÙ[™K˜[™Ù\˜İ[™[H[™[H™\Ú]™[ˆÙ]™[›H›XÚÚÙYÙ[ˆÙYË™[[™›0é\ˆ™XYÚY\™[ˆ[\œØÚYYXÚ]Yˆ™Z\‹˜KX\ÛÛNİ]N˜‘RQ0á‘QÑHÓÓÔ‘SUSÓ˜Øš™Xİ]™N˜°ï™H™ZYH0é™HHZ[™\ˆXÚ[ˆØ[[Y\‹[H\ÈØÚ[H›Ú[[™™Y[™H[ˆYÈ›Üˆ[H\İ[›X^[][K˜ÛÛ›ÛÎ–ØÙZHš[™Ù\ˆ0é™HÛZXÚ™Z]YÈ°ï™[˜X]\Îˆ0é™H˜XÚZ[˜[™\ˆšYZ[˜RÕSÓˆ[[ˆÚ\šİ[™ÜŞYØKX\İ\N˜X™XÚ[™Ë][\š]]\È[™™XÚ™Z]YÙ\ÈÜÛ\ÜÙ[ˆ°é[ˆÙ[YZ[œØ[Kˆ™ZH\˜Úğé™ÙHÙ\™[ˆ[™ZY[™[œİXš[˜[™Ù\˜HØÚÙ\™H0é™H\™]YÙ[ˆXÚÜÎÈH[™Ù\ˆYÈ\š0íš\İ[ˆ[™Ù[šİYHÙ\[™Ë˜_KZO^Ø[™™N˜[™°êX™[™N˜™[°êX\œÎ˜\œØ[›N˜[›XÜ™YÛÜ˜Ü™YÛÜ˜X\Û˜X\ÛØÚX™\˜ØÚX™\™[^˜™[^ØÚ[XN˜ØÚ[XXKšOXÛ\ÜŞÜ›ÛİÛÛ“İ]ÛÛYNÙÙ]ÛÛ^Ü[[YNØØ[˜\ÎØİİ]NØÛÜNÚ[ØXİ[ÛØÛÜÙNÜ™\İ[Ø\XÛNÙ^\šY[˜ÙNØœšYYš[™ÎÜ\ÙSX™[Û]™SX™[Ü]\ÙP]ÛÚ[]ÛÜ™]P]ÛÜİ\]ÛØ]Y[ÎØÛÛœİXİÜŠKJ
OOÚJ
J^İ\Ëœ›ÛİYK\Ë›Û“İ]ÛÛYO]\Ë™Ù]ÛÛ^[‹\Ë˜Ø[˜\ÏRšJKØ[˜\Ø
NÛ]]\Ë˜Ø[˜\Ë™Ù]ÛÛ^
™
NÚYŠ\Š]›İÈ\œ›ÜŠZ[šYØ[YHØ[˜\ÈÛÛ^[˜]˜Z[X›X
Nİ\Ë˜İ\‹\Ë]ORšJKÙ]K[Z[šK]]WX
K\Ë˜ÛÜORšJKÙ]K[Z[šKXÛÜWX
K\Ëš[RšJKÙ]K[Z[šKZ[X
K\Ë˜Xİ[ÛRšJKÙ]K[Z[šKXXİ[Û—X
K\Ë˜ÛÜÙORšJKÙ]K[Z[šKXÛÜÙWX
K\Ëœ™\İ[RšJKÙ]K[Z[šK\™\İ[X
K\Ë˜\XÛORšJK\XÛX
K\Ë™^\šY[˜ÙOYØİ[Y[˜Ü™X]Q[[Y[
ÙXİ[Û˜
K\Ë™^\šY[˜ÙK˜Û\ÜÓ˜[YOXZ[šKY^\šY[˜ÙX\Ë™^\šY[˜ÙKš[›™\’SXˆ]ˆÛ\ÜÏH›Z[šK[]™X˜\ˆÜ[ˆ]K[Z[šK\\ÙO•“Ô‘T‘RUS‘ÏÜÜ[İ›Û™È]K[Z[šK[]™O•Ø\H]Yˆİ\Üİ›Û™Ï]ˆÛ\ÜÏH›Z[šK[]™K\›ÙÜ™\ÜÈOÚOÙ]Ù]‚ˆ]ˆÛ\ÜÏH›Z[šKXœšYYš[™Èˆ]K[Z[šKXœšYYš[™ÏÙ]‚ˆ]ˆÛ\ÜÏH›Z[šK]ÛÛ˜\ˆ‚ˆ]Ûˆ\OH˜]Ûˆˆ]K[Z[šKZ[’[™OØ]Û‚ˆ]Ûˆ\OH˜]Ûˆˆ]K[Z[šK\]\ÙO”]\ÙOØ]Û‚ˆ]Ûˆ\OH˜]Ûˆˆ]K[Z[šK\™]HY[‘\›™]]™\œİXÚ[Ø]Û‚ˆÙ]˜\Ë˜Ø[˜\Ë˜™Y›Ü™J\Ë™^\šY[˜ÙJK\Ë˜œšYYš[™ÏRšJ\Ë™^\šY[˜ÙKÙ]K[Z[šKXœšYYš[™×X
K\Ëœ\ÙSX™[RšJ\Ë™^\šY[˜ÙKÙ]K[Z[šK\\ÙWX
K\Ë›]™SX™[RšJ\Ë™^\šY[˜ÙKÙ]K[Z[šK[]™WX
K\Ëœ]\ÙP]ÛRšJ\Ë™^\šY[˜ÙKÙ]K[Z[šK\]\ÙWX
K\Ëš[]ÛRšJ\Ë™^\šY[˜ÙKÙ]K[Z[šKZ[X
K\Ëœ™]P]ÛRšJ\Ë™^\šY[˜ÙKÙ]K[Z[šK\™]WX
K\Ëœİ\]ÛYØİ[Y[˜Ü™X]Q[[Y[
]Û˜
K\Ëœİ\]Û‹\OX]Û˜\Ëœİ\]Û‹˜Û\ÜÓ˜[YOXš[X\HZ[šK\İ\\Ëœİ\]Û‹^ÛÛ[XÔQSÕT•S˜\Ë˜Xİ[Û‹˜Y]™[\İ[™\ŠÛXÚØ

OO\Ëœš[X\PXİ[ÛŠ
JK\Ë˜ÛÜÙK˜Y]™[\İ[™\ŠÛXÚØ

OO\ËœİÜ

JK\Ëœ]\ÙP]Û‹˜Y]™[\İ[™\ŠÛXÚØ

OO\ËÙÙÛT]\ÙJ
JK\Ëš[]Û‹˜Y]™[\İ[™\ŠÛXÚØ

OO\ËÙÙÛPœšYYš[™Ê
JK\Ëœ™]P]Û‹˜Y]™[\İ[™\ŠÛXÚØ

OOİ\Ëœ[[YI‰\Ëœİ\
\Ëœ[[YKšY
_JK\Ëœİ\]Û‹˜Y]™[\İ[™\ŠÛXÚØ

OO\Ë˜™YÚ[Š
J_\İ\
J^İ\ËœİÜ
LJK\Ëœ›ÛİšY[HLK\Ëœ›Ûİ™]\Ù]›Z[šQØ[YOYK\Ë]K^ÛÛ[WÚVÙWK\Ëœ™\İ[šY[HL\Ëœ™\İ[^ÛÛ[X\Ë˜Xİ[Û‹™\ØX›YHL\Ëœ™]P]Û‹šY[HL\Ëœ]\ÙP]Û‹™\ØX›YHL\Ëœ]\ÙP]Û‹^ÛÛ[X]\ÙX\Ë˜Ø[˜\ËÚYNL\Ë˜Ø[˜\ËšZYÚMÌÛ]]\Ë™Ù]ÛÛ^
JK^J
Nİ\Ëœ[[YO^ÚY™K[›š[™ÎˆLK]\ÙYˆLİ\œ\™›Ü›X[˜ÙK››İÊ
K\İœ\™›Ü›X[˜ÙK››İÊ
K˜YŒÛİ[İÛŒÛÛ^Y™šXİ[N›‹İ]NßKÚ[\œÎ›™]ÈX\ÛX[\–×_K\ËœÙ]\
JK\Ëœ™[™\œšYYš[™ÊJK\Ë\]S]™J“Ô‘T‘RUS‘ØÚJŠK
K\Ë™˜]Ê\Ëœ[[YJK\Ëœ[[YKœ˜Y\™\]Y\İ[š[X][Û‘œ˜[YJOO\ËXÚÊJJ_\İÜ
OHL
^İ\Ëœ[[YI‰ŠØ[˜Ù[[š[X][Û‘œ˜[YJ\Ëœ[[YKœ˜YŠK\Ëœ[[YK˜ÛX[\™›Ü‘XXÚ
OO™J
JJK\Ëœ[[YO]›ÚY\Ë˜œšYYš[™ËšY[HLI‰Š\Ëœ›ÛİšY[HL
_\Ù]\
J^ÙOOOX›\İ\	‰\ËœÙ]\›\İ\

KOOOX™Y\”Û™Ø	‰\ËœÙ]\™Y\”Û™Ê
KOOOX›[šŞX˜[	‰\ËœÙ]\›[šŞX˜[

KOOOXYÙTYX	‰\ËœÙ]\YÙTYJ
KOOOXX\ÛÛX	‰\ËœÙ]\X\ÛÛJ
_\™[™\œšYYš[™ÊJ^Û]]\Ëœ[[YK]šVÙWK]˜ÛÛ^OPÚJKŠKO\‹˜Xİ]™UX[K›X\
OOZVÙWOÏÙJKš›Ú[Š0­È
_ÙZ[™HZİ]™[ˆ™YÛZ]\˜İ\Ë˜œšYYš[™ËšY[HLK\Ë˜œšYYš[™Ëš[›™\’SXˆ\XÛO‚ˆÜ[‰Û‹]_OÜÜ[‚ˆÏ‰ÜZJ‹›Øš™Xİ]™J_OÚÏ‚ˆ]ˆÛ\ÜÏH›Z[šKXœšYYš[™ËYÜšY‚ˆÙXİ[Û”ÕUQT•S‘ÏØ‰Û‹˜ÛÛ›ÛË›X\

K
OO˜O‰İ
Ì_OÚO‰ÜZJJ_OÜ˜
Kš›Ú[Š
_OÜÙXİ[Û‚ˆÙXİ[Û“QRTÕT”ĞÒQ•Ø‰ÜZJ‹›X\İ\J_OÜ”’TÒRÓÏØ‰ÜZJ‹™[™Ù\Š_OÜÜÙXİ[Û‚ˆÙ]‚ˆ]ˆÛ\ÜÏH›Z[šK\™Y›YÚ‚ˆ[OÛX[”ØÚÚY\šYÚÙZ]ÜÛX[İ›Û™Ï‰ÔÚJ™Y™šXİ[J_OÜİ›Û™ÏÙ[O‚ˆ[OÛX[™\İ\ˆÙ\ÜÛX[İ›Û™Ï‰Ü‹˜™\İ8 $ØOÜİ›Û™ÏÙ[O‚ˆ[OÛX[•X[OÜÛX[İ›Û™Ï‰ÜZJJ_OÜİ›Û™ÏÙ[O‚ˆÙ]‚ˆ]ˆÛ\ÜÏH›Z[šKX\ÜÚ\İ	ÚOØXİ]™X˜HÛX[RÕU‘HS‘OÜÛX[İ›Û™Ï‰ÜZJ_ÙZ[™HÚ\˜Zİ\˜˜\ÚY\H[™Hœ™ZYÙ\ØÚ[]
_OÜİ›Û™ÏÙ]‚ˆØ\XÛO˜\Ë˜œšYYš[™Ëœ]Y\TÙ[XİÜŠ\XÛX
OË˜\[™
\Ëœİ\]ÛŠ_X™YÚ[Š
^Û]O]\Ëœ[[YNÙI‰Š\Ë˜œšYYš[™ËšY[HLKœ[›š[™ÏHLKœ]\ÙYHLKK˜Ûİ[İÛLÙLËK›\İ\\™›Ü›X[˜ÙK››İÊ
K\Ë˜Xİ[Û‹™\ØX›YHLK\Ëœ]\ÙP]Û‹™\ØX›YHLK\Ë™™YY˜XÚÊÕT•™\™Z]XXÚ[˜™]]˜[
J_]ÙÙÛT]\ÙJ
^Û]O]\Ëœ[[YNÙOËœ[›š[™É‰ŠKœ]\ÙYHYKœ]\ÙY\Ëœ]\ÙP]Û‹^ÛÛ[YKœ]\ÙYØ›ÜÙ]™[˜˜]\ÙX\Ë›]™SX™[^ÛÛ[YKœ]\ÙYØÜY[]\ÚY\\Ëœ\ÙQ\ØÜš\[ÛŠJKØİ[Y[˜›ÙK˜Û\ÜÓ\İÙÙÛJZ[šYØ[YK\]\ÙYKœ]\ÙY
J_]ÙÙÛPœšYYš[™Ê
^Û]O]\Ëœ[[YNÚYŠYJ\™]\›Û]H]\Ë˜œšYYš[™ËšY[İ\Ë˜œšYYš[™ËšY[]]	‰™Kœ[›š[™É‰ŠKœ]\ÙYHL\Ëœ]\ÙP]Û‹^ÛÛ[X›ÜÙ]™[˜
_\Ù]\›\İ\

^Û]O]\Ëœ[[YKVØ[™™X‹‹™K˜ÛÛ^˜Xİ]™UX[K™š[\ŠOO™HOOX[™™X
WKœÛXÙJ
NÙ›ÜŠİ›[™İÊ]œ\Ú
Ø™[™X\œØ[›XVİ›[™İLWOÏØ[›X
NÓØš™Xİ˜\ÜÚYÛŠKœİ]KÜ\ÙN˜š[šØ[›™\Œ[™]\\]ZYŒKÛ[™ÎˆLK[\TÚ[˜ÙNŒİ™\šÛŒİ™\š[™Î‹Kİ\‹Kİ\N‹Kİ\Œİ\NŒ›İ][ÛŒ[™İ[\ŒÜÛ™[ŒZ\İZÙ\ÎŒ\™™XİÎŒİ™XZÎŒ™\İİ™XZÎŒ™XXİ[Û”\™™XİÎŒÙ\İ\™Tİ\›[XÙ[Y[ØÛÜ™NŒJK\Ë˜ÛÜK^ÛÛ[X™YHšYİ\ˆ™\Ú]Z[ˆZYÙ[™\Èš[šËH[™›\›Ùš[ˆ˜XÚ[HY\™[ˆ°éYH™XZİ[Û‹[˜XÚ]šY\[™È[™XÚ\ˆÚ\ØÚ[\[Ë˜\Ëš[^ÛÛ[X˜XÚ[HÛİ[İÛˆRÕSÓˆ[[‹ˆÛØ˜[\ˆ™XÚ\ˆY\ˆ\İˆÛÙ›ÜÜÛ\ÜÙ[‹˜\Ë˜Xİ[Û‹^ÛÛ[XSSˆ’S’ÑS˜\Ë˜š[™Ø[˜\ÑÙ\İ\™\Ê
K\Ë˜š[™ÛXİ[ÛŠÛ[™Ø
_\Ù]\™Y\”Û™Ê
^ÓØš™Xİ˜\ÜÚYÛŠ\Ëœ[[YKœİ]KÜ\ÙN˜™XYX[ÙN˜\™Xİİ\Î“ZJ
K]ÎŒZ\ÜÙ\ÎŒÜÛ™[]ÎŒÜÛ™[ÛØÚÎŒ˜YÔİ\›[˜YÓ›İÎ›[˜[›[›İ[˜ÙYˆLK™\˜XÚÜÎŒ›İ[˜ÙR]ÎŒİ™XZÎŒ™\İİ™XZÎŒ™Y[\[ÛˆLK™Y[\[Û’]ÎŒ\İÚİ›İ[˜ÙNˆLK˜Z™XİÜN–×_JK\Ë˜ÛÜK^ÛÛ[X™Zˆ™XÚ\‹œ™ZYH›YÜ\ÚZÈ[™Z[ˆÛÛ\]\ˆÙYÛ™\›]Y‹ˆ™KT˜XÚÜË›İ[˜ÙKPXÙZˆ[™Z[™Hpí™ÛXÚH™Y[\[Ûˆ™\°é™\›ˆ\ÈX]Ú˜\Ëš[^ÛÛ[X˜[™\°ï™[‹\°ïÚŞšYZ[ˆ[™ÜÛ\ÜÙ[‹ˆRÕSÓˆÙXÚÙ[Ú\ØÚ[ˆT‘RÕ[™“ÕSÑK˜\Ë˜Xİ[Û‹^ÛÛ[XÕT‘T•ˆT‘RÕ\Ë˜š[™Ø[˜\ÑÙ\İ\™\Ê
_\Ù]\›[šŞX˜[

^ÓØš™Xİ˜\ÜÚYÛŠ\Ëœ[[YKœİ]KÜ\ÙN˜]XÚË]›İØ›İ[™ŒKX[Qš[šÎŒ[™[^Qš[šÎŒ˜YÔİ\›[˜YÓ›İÎ›[Û[™ÎˆLKY™[™\ŒİÜÚYÛ˜[ˆLKİÜ[Y\Œ›İ[ˆLK[›™\–‹ŒK[›™\–N‹ÍË\™Ù]‹K\™Ù]N‹MK›İU\ˆLK˜[[ˆLKY™[œÙP˜[‹ÍKY™[œÙP˜[N‹NİÜ]X[]NŒ]XÚÒ]ÎŒY™[œÙT\™™XİÎŒØœİXÛ\Î“šJ
_JK\Ë˜ÛÜK^ÛÛ[X[™ÜšY™ˆ[™™\ZYYİ[™ÈÙXÚÙ[ˆ›Ûİ0é™YËˆ\ˆİÜYˆ\İZ[ˆXÚ\È™XZİ[ÛœÙ™[œİ\‹YH]Yœ›İ]H[0é[™\›š\ÜÙK˜\Ëš[^ÛÛ[X[™ÜšY™ˆ˜[šYZ[ˆ[™Ù\™™[‹ˆ™\ZYYİ[™ÎˆšY[[šİ[\[ˆ[™[ˆ›\ØÚK˜[[™[šYHRÕSÓˆ°ïÚÙ[‹˜\Ë˜Xİ[Û‹^ÛÛ[XSÑT‘‘S˜\Ë˜š[™Ø[˜\ÑÙ\İ\™\Ê
K\Ë˜š[™ÛXİ[ÛŠÛ[™Ø
_\Ù]\YÙTYJ
^ÓØš™Xİ˜\ÜÚYÛŠ\Ëœ[[YKœİ]KÜ\ÙN˜ÚÛÜÙXÜİ‹LK›ÙÜ™\ÜÎŒİ\ÜXÚ[ÛŒÛ[™ÎˆLKZ[N‹KØœÙ\™\N‹ŒKØœÙ\™\‹MKÚ[™Œ]šY[˜ÙNŒ[\œ\[ÛœÎŒ›Ú\ÙNŒ™X\“Z\ÜÙ\ÎŒØ]YÚ›\ÚŒJK\Ë˜ÛÜK^ÛÛ[X™ZHÜH™\Ú]™[ˆ[\œØÚYYXÚHÙ\ØÚÚ[™YÚÙZ]XÚİ[™ËÙ\°é\ØÚ[™ÛŞšX[H›ÛÙ[‹ˆÚXÚÙYÙ[[™Ú[™™XYÚY\™[ˆÛÛ[ZY\›XÚ˜\Ëš[^ÛÛ[X\œİİ[H[\[‹ˆ[˜XÚRÕSÓˆ[[ˆ[™]Yˆ[H™[YHšXÚ[™ÈÛÜœšYÚY\™[‹˜\Ë˜Xİ[Û‹^ÛÛ[XÕSHğáS˜\Ë˜š[™Ø[˜\ÑÙ\İ\™\Ê
K\Ë˜š[™ÛXİ[ÛŠÛ[™Ø
_\Ù]\X\ÛÛJ
^ÓØš™Xİ˜\ÜÚYÛŠ\Ëœ[[YKœİ]KÜ\ÙN˜ÙX[›İ[™ŒKYŞ‹ŒÍN‹M_KšYÚŞ‹‹N‹M_K›Ú[‹K›Ú[N‹ŒÍKÙX[Œ[ŒÛİYÚŒÛ[™ÎˆLKØÛÜ™NŒXZÜÎŒXİ]™R[™˜Yœ™X]‹Kš]T]X[]NŒİX›U[YNŒJK\Ë˜ÛÜK^ÛÛ[XYH0é™HpïÜÙ[ˆšXÚ\ˆXÚÛÛ™\›ˆ[H][\š]]\ÈİXš[›ZX™[‹ˆ™ZH\˜Úğé™ÙH\š0íš[ˆšY[™\İ[™[\š[™XÚÙZ]˜\Ëš[^ÛÛ[X0é™H°ï™[‹ˆ™ZHÜ°ï™\ˆX™XÚ[™ÈRÕSÓˆ°ïÚÙ[‹[›ˆ[H[[ˆ][Y™[œİ\ˆ[[ˆ[™™XÚ™Z]YÈÜÛ\ÜÙ[‹˜\Ë˜Xİ[Û‹^ÛÛ[X0á‘HP‘PÒS˜\Ë˜š[™Ø[˜\ÑÙ\İ\™\Ê
K\Ë˜š[™ÛXİ[ÛŠÛ[™Ø
_Xš[™Ø[˜\ÑÙ\İ\™\Ê
^Û]OYOOÚYŠ]\Ëš[œ][İÙY

J\™]\›ÙKœ™]™[Y˜][

NÛ]]\ËœÚ[
JNİ\Ëœ[[YOËœÚ[\œËœÙ]
KœÚ[\’Y
K\Ë˜Ø[˜\ËœÙ]Ú[\Ø\\™JKœÚ[\’Y
K\ËœÚ[\‘İÛŠKœÚ[\’Y
_KYOOÚYŠ]\Ëœ[[YOËœÚ[\œËš\ÊKœÚ[\’Y
_]\Ëš[œ][İÙY

J\™]\›Û]]\ËœÚ[
JNİ\Ëœ[[YKœÚ[\œËœÙ]
KœÚ[\’Y
K\ËœÚ[\“[İ™JKœÚ[\’Y
_KYOOÚYŠ]\Ëœ[[YJ\™]\›Û]]\ËœÚ[
JNİ\ËœÚ[\•\
KœÚ[\’Y
K\Ëœ[[YKœÚ[\œË™[]JKœÚ[\’Y
_Nİ\Ë˜Ø[˜\Ë˜Y]™[\İ[™\ŠÚ[\™İÛ˜JK\Ë˜Ø[˜\Ë˜Y]™[\İ[™\ŠÚ[\›[İ™X
K\Ë˜Ø[˜\Ë˜Y]™[\İ[™\ŠÚ[\\ŠK\Ë˜Ø[˜\Ë˜Y]™[\İ[™\ŠÚ[\˜Ø[˜Ù[ŠK\Ëœ[[YK˜ÛX[\œ\Ú


OO\Ë˜Ø[˜\Ëœ™[[İ™Q]™[\İ[™\ŠÚ[\™İÛ˜JK

OO\Ë˜Ø[˜\Ëœ™[[İ™Q]™[\İ[™\ŠÚ[\›[İ™X
K

OO\Ë˜Ø[˜\Ëœ™[[İ™Q]™[\İ[™\ŠÚ[\\ŠK

OO\Ë˜Ø[˜\Ëœ™[[İ™Q]™[\İ[™\ŠÚ[\˜Ø[˜Ù[ŠJ_Xš[™ÛXİ[ÛŠJ^Û]]Oİ\Ëš[œ][İÙY

I‰ŠËœ™]™[Y˜][

K\Ëœ[[YI‰Š\Ëœ[[YKœİ]VÙWOHL
J_KJ
OOİ\Ëœ[[YI‰Š\Ëœ[[YKœİ]VÙWOHLJ_Nİ\Ë˜Xİ[Û‹˜Y]™[\İ[™\ŠÚ[\™İÛ˜
K\Ë˜Xİ[Û‹˜Y]™[\İ[™\ŠÚ[\\ŠK\Ë˜Xİ[Û‹˜Y]™[\İ[™\ŠÚ[\›X]™XŠK\Ë˜Xİ[Û‹˜Y]™[\İ[™\ŠÚ[\˜Ø[˜Ù[ŠNÛ]YOOÙK˜ÛÙOOOXÜXÙX	‰ˆYKœ™\X]	‰
J_KOYOOÙK˜ÛÙOOOXÜXÙX	‰›Š
_NİÚ[™İË˜Y]™[\İ[™\ŠÙ^YİÛ˜ŠKÚ[™İË˜Y]™[\İ[™\ŠÙ^]\JK\Ëœ[[YK˜ÛX[\œ\Ú


OO\Ë˜Xİ[Û‹œ™[[İ™Q]™[\İ[™\ŠÚ[\™İÛ˜
K

OO\Ë˜Xİ[Û‹œ™[[İ™Q]™[\İ[™\ŠÚ[\\ŠK

OO\Ë˜Xİ[Û‹œ™[[İ™Q]™[\İ[™\ŠÚ[\›X]™XŠK

OO\Ë˜Xİ[Û‹œ™[[İ™Q]™[\İ[™\ŠÚ[\˜Ø[˜Ù[ŠK

OOÚ[™İËœ™[[İ™Q]™[\İ[™\ŠÙ^YİÛ˜ŠK

OOÚ[™İËœ™[[İ™Q]™[\İ[™\ŠÙ^]\JJ_\Ú[\‘İÛŠK
^Û]]\Ëœ[[YNÚYŠ[Ëœ[›š[™Ê\™]\›Û][‹œİ]NÛ‹šYOOX›\İ\	‰Š‹œ\ÙOOOXXÙX	‰Š‹›İ™\š[™ÏRÚJKŒÌ‹ÊJK‹œ\ÙOOOX›\	‰Š‹™Ù\İ\™Tİ\YJJK‹šYOOX™Y\”Û™Ø	‰œ‹œ\ÙOOOX™XYX	‰‘ÚJKKKK
OŒM	‰Š‹™˜YÔİ\YK‹™˜YÓ›İÏYJK‹šYOOX›[šŞX˜[	‰Š‹œ\ÙOOOX]XÚË]›İØÊ‹™˜YÔİ\YK‹™˜YÓ›İÏYJN”İš[™Ê‹œ\ÙJKœİ\ÕÚ]
Y™[œÙX
I‰Š‹\™Ù]YK‹\™Ù]OYKJJK‹šYOOXYÙTYX	‰Š‹œ\ÙOOOXÚÛÜÙXİ\Ë˜ÚÛÜÙRYÙTÜİ
K
Nœ‹˜Z[ORÚJKŒKJJK‹šYOOXX\ÛÛX	‰\Ë˜\ÜÚYÛ“X\Û[™
J_\Ú[\“[İ™JK
^Û]]\Ëœ[[YNÚYŠ[Ëœ[›š[™Ê\™]\›Û][‹œİ]NÛ‹šYOOX›\İ\	‰œ‹œ\ÙOOOXXÙX	‰Š‹›İ™\š[™ÏRÚJKŒÌ‹ÊJK‹šYOOX™Y\”Û™Ø	‰œ‹™˜YÔİ\	‰Š‹™˜YÓ›İÏYK‹˜Z™XİÜOZšJ‹™˜YÔİ\K‹›[ÙOOOX›İ[˜ÙX
JK‹šYOOX›[šŞX˜[	‰Š‹œ\ÙOOOX]XÚË]›İØ	‰œ‹™˜YÔİ\Ü‹™˜YÓ›İÏYN”İš[™Ê‹œ\ÙJKœİ\ÕÚ]
Y™[œÙX
I‰Š‹\™Ù]YK‹\™Ù]OYKJJK‹šYOOXYÙTYX	‰œ‹œ\ÙOOOXXİ]™X	‰Š‹˜Z[ORÚJKŒKJJK‹šYOOXX\ÛÛX	‰\Ë›[İ™SX\Û[™
J_\Ú[\•\
K
^Û]]\Ëœ[[YNÚYŠ[Ëœ[›š[™Ê\™]\›Û][‹œİ]NÛ‹šYOOX›\İ\	‰Š‹œ\ÙOOOXXÙXİ\Ëœİ\›\Ù\İ\™J
Nœ‹œ\ÙOOOX›\	‰œ‹™Ù\İ\™Tİ\	‰\Ë›][˜Ú›\
JJK‹šYOOX™Y\”Û™Ø	‰œ‹™˜YÔİ\	‰\Ë›][˜ÚÛ™ÊJK‹šYOOX›[šŞX˜[	‰œ‹œ\ÙOOOX]XÚË]›İØ	‰œ‹™˜YÔİ\	‰\Ë›][˜Ú›[šŞJJK‹šYOOXX\ÛÛX	‰›‹œÚ[\œË™[]J
_\š[X\PXİ[ÛŠ
^Û]O]\Ëœ[[YNÚYŠ]\Ëš[œ][İÙY

_YJ\™]\›Û]YKœİ]NÙKšYOOX›\İ\	‰œ\ÙOOOXXÙX	‰\Ëœİ\›\Ù\İ\™J
KKšYOOX™Y\”Û™Ø	‰Š›[ÙO]›[ÙOOOX\™XİØ›İ[˜ÙX˜\™Xİ\Ë˜Xİ[Û‹^ÛÛ[XÕT‘T•ˆ	Ôİš[™Ê›[ÙJKÕ\\Ø\ÙJ
_X\Ë™™YY˜XÚÊÕT‘T•›[ÙOOOX›İ[˜ÙXØÙZH™XÚ\ˆpí™ÛXÚ0­ÈXÙZˆpí™ÛXÚ˜ÚXÚ\™\ˆ\™Zİ\ˆİ\™˜™]]˜[
JKKšYOOX›[šŞX˜[	‰\Ë™›[šŞPXİ[ÛŠ
KKšYOOXYÙTYX	‰œ\ÙOOOXÚÛÜÙX	‰\Ë˜ÚÛÜÙRYÙTÜİ
JKKšYOOXX\ÛÛX	‰œ\ÙOOOXÙX[	‰œÙX[PZJJI‰Šœ\ÙOX[\Ë˜Xİ[Û‹^ÛÛ[XSSˆ’QRS˜\Ë™™YY˜XÚÊP‘PÒS‘ØØÚİXš[0­È][Y™[œİ\ˆ™[Ø˜XÚ[˜ÛÛÙ
J_]XÚÊJ^Û]]\Ëœ[[YNÚYŠ]
\™]\›Û]SX]›Z[ŠK]›\İMŠNİ›\İYK]œ]\ÙY	‰œ[›š[™É‰Š˜Ûİ[İÛŒÊ˜Ûİ[İÛSX]›X^
˜Ûİ[İÛ‹[ŠK\Ë\]S]™JÕT•˜Ûİ[İÛŒÔİš[™ÊX]˜ÙZ[
˜Ûİ[İÛ‹ÌYLÊJN˜ÔØK]˜Ûİ[İÛ‹ÌÙLÊK˜Ûİ[İÛOOL	‰\Ë™™YY˜XÚÊÔØ\Ëœ\ÙQ\ØÜš\[ÛŠ
KÛÛÙ
JNŠšYOOX›\İ\	‰\ËXÚÑ›\
ŠKšYOOX™Y\”Û™Ø	‰\ËXÚÔÛ™ÊŠKšYOOX›[šŞX˜[	‰\ËXÚÑ›[šŞJŠKšYOOXYÙTYX	‰\ËXÚÒYÙJŠKšYOOXX\ÛÛX	‰\ËXÚÓX\Û
‹JK\ËœŞ[˜Ó]™J
JJK\Ë™˜]Ê
Kœ˜Y\™\]Y\İ[š[X][Û‘œ˜[YJOO\ËXÚÊJJ_]XÚÑ›\
J^Û]]\Ëœ[[YK]œİ]K]˜ÛÛ^™›YÜÖØ\ÜÚ\İ]X[K\Úİ]OËŒNÚYŠ‹›ÜÛ™[
ÏYJŠYKMŠÛ‹œ[›™\ŠŒÙKMÊJ™Y™šXİ[Jœ‹‹›ÜÛ™[M
^İ\Ë™š[š\Ú
ÚY˜›\İ\İXØÙ\ÜÎˆLKØÛÜ™N“X]›X^
X]œ›İ[™
‹œ[›™\ŠŒ[‹›Z\İZÙ\ÊJJK]X[]N˜˜Z[Y^˜YHÙYÙ[œÙZ]H™Y[™]Z™HİY™™[ˆ]Y\ˆ]\ˆ™XÚ\ˆ°ï›ØÚZ[™[ˆÙ™™[™[ˆ™XÚÜİ™Z]Z]ØÚÙ\šÜ˜Y[™™XZİ[ÛœŞ™Z]˜™YYÎØ[ÛÚÛ›Y\ŸKY]šXÜÎÙYÛš]N‹LŸK™[][ÛœÚ\Î‘šJ‹›[™]\LJ_JNÜ™]\›ŸZYŠ‹œ\ÙOOOXš[šØ
^Û][‹›[™]\Û‹œ[›™\—KOUJŠKİ™Y™šXİ[NÚYŠ‹šÛ[™É‰›‹›\]ZYŒ	‰Š‹›\]ZYSX]›X^
‹›\]ZYYJšJJK‹›\]ZYL
ZYŠ‹™[\TÚ[˜Ù_
‹™[\TÚ[˜ÙO\\™›Ü›X[˜ÙK››İÊ
K\Ë™™YY˜XÚÊQT˜™]ÜÛ\ÜÙ[˜Ø\›š[™Ø
JK‹šÛ[™Ê[‹›İ™\šÛ
ÏYK‹›İ™\šÛÌ	‰ˆ[‹œÜ[Ûİ[Y	‰Š‹œÜ[Ûİ[YHL‹›Z\İZÙ\ÊÏLK‹œİ™XZÏL\Ë™™YY˜XÚÊ‘T”ĞÒ0çUH[™ÙHÙZ[[ˆ0­È™Z]™\›\İ˜Y
JNÙ[Ù^Û]O\\™›Ü›X[˜ÙK››İÊ
K[‹™[\TÚ[˜ÙNÙOLÍŒÊ‹œ™XXİ[Û”\™™XİÊÏLK‹œİ™XZÊÏLK\Ë™™YY˜XÚÊĞUP‘T˜	ÓX]œ›İ[™
J_H\È™XZİ[Û˜ÛÛÙ
JN›‹œİ™XZÏL\Ëœİ\›\XÙ[Y[

__ZYŠ‹œ\ÙOOOX›YÚ	‰Š‹˜İ\JÏYJYKM‹˜İ\
Ï[‹˜İ\
™J‹ŒK‹˜İ\JÏ[‹˜İ\J™J‹ŒK‹œ›İ][ÛŠÏ[‹˜[™İ[\Š™J‹ŒK‹˜İ\OKJJ^Û]OZÚJ‹œ›İ][ÛŠNÙOÚJŠI‰›‹˜İ\‹ŒM	‰›‹˜İ\İ\Ë˜ÛÛ\]Q›\
OŒMI‰›‹œXÙ[Y[ØÛÜ™O‹ŠNŠ‹›Z\İZÙ\ÊÏLK‹œİ™XZÏLØš™Xİ˜\ÜÚYÛŠ‹Ü\ÙN˜XÙXİ\N‹K›İ][ÛŒİ\Œİ\NŒJK\Ëš[^ÛÛ[XšXÚÙ[[™]ˆÛÙ›Ü\›™]][ˆYHØ[HÙ]™[ˆ8 $È\ˆÙYÛ™\ˆØ\]šXÚ˜\Ë™™YY˜XÚÊ‘R“TO‹OØHšY[›İ][Û˜˜Ú[šÙ[Ù\ˆÜÚ][ÛˆšXÚİXš[˜Y
J_[‹˜™\İİ™XZÏSX]›X^
‹˜™\İİ™XZË‹œİ™XZÊ_\İ\›\XÙ[Y[

^Û]O]\Ëœ[[YKœİ]NÓØš™Xİ˜\ÜÚYÛŠKÜ\ÙN˜XÙXÛ[™ÎˆLK[\TÚ[˜ÙNŒİ™\šÛŒÜ[Ûİ[YˆL_JK\Ë˜Xİ[Û‹^ÛÛ[X‘PÒTˆU’QT‘S˜\Ëš[^ÛÛ[X™XÚ\ˆ[ˆYH\ØÚØ[HšYZ[‹ˆ\ˆX\šÚY\H™\™ZXÚ™ZYİ[ˆİ][ˆ0ç™\œİ[™˜\İ\›\Ù\İ\™J
^Û]O]\Ëœ[[YKœİ]KQJK›[™]\ÙKœ[›™\—JK]\Ëœ[[YK˜ÛÛ^™›YÜÖØ\ÜÚ\İY›\YYÙXOËŒM‹ŒNÙKœXÙ[Y[ØÛÜ™ORÚJKSX]˜XœÊK›İ™\š[™Ë]
KÛ‹JKKœ\ÙOX›\K˜İ\YK›İ™\š[™Ë\Ë˜Xİ[Û‹^ÛÛ[XÒTĞÒS˜\Ëš[^ÛÛ[X›ÛH[\™[ˆ™XÚ\œ˜[™°ïÚYÈ˜XÚØ™[ˆÚ\ØÚ[‹ˆÛZ[™HÙZ]XÚHXÙZXÚ[™È\İÛÛ›ÛY\˜˜\‹˜[][˜Ú›\
J^Û]]\Ëœ[[YKœİ]K]™Ù\İ\™Tİ\YK[‹OYKK[‹KO]›[™]\İœ[›™\—KÏQZJJJİœXÙ[Y[ØÛÜ™J‹Œİ˜İ\\ŠŒKMKÛË˜İ\OSX]›Z[ŠKJŒ‹ŒJK˜[™İ[\RÚJZJŠMËÛÊJÜŠŒ‹ËLËJKœ\ÙOX›YÚ™Ù\İ\™Tİ\[[XÛÛ\]Q›\
J^Û]]\Ëœ[[YKœİ]NÚYŠœ[›™\ŠÏLKOÊœ\™™XİÊÏLKœİ™XZÊÏLK\Ë™™YY˜XÚÊT‘‘RÕTˆ“TÙ\šYH	İœİ™XZßXÛÛÙ
JNŠœİ™XZÏSX]›X^
œİ™XZËLJK\Ë™™YY˜XÚÊÑSS‘UİY™™[ÙZ]\˜™]]˜[
JKœ[›™\M
^Û]OSX]œ›İ[™
L]›ÜÛ™[
ŒLK]›Z\İZÙ\ÊÊİœ\™™XİÊJİœ™XXİ[Û”\™™XİÊ
İ˜™\İİ™XZÊŒÊK]œ\™™XİÏLÉ‰›Z\İZÙ\ÏOOL	‰œ™XXİ[Û”\™™XİÏLÏØ\™™Xİ›Z\İZÙ\ÏLØÛÛY˜Y\ÜŞXİ\Ë™š[š\Ú
ÚY˜›\İ\İXØÙ\ÜÎˆLØÛÜ™N™K]X[]N›‹^›OOX\™™XİØšY\ˆ]]KšY\ˆØ]X™\™H™XZİ[Û™[ˆ[™˜\İZ[ˆÙ[YZ[œØ[Y\È™\™[œŞ\İ[KˆYHİY™™[Ú\™\ˆÛÙ›Ü0ï™\šYX™[™[ˆYÙ\›YÙ[™K˜˜YHİY™™[Ù]Ú[›ˆšXÚXZÙ[ÜËX™\ˆ›Üˆ\ˆÙYÙ[œÙZ]H8 $È\ˆZ[šYÙHÙ\[ˆÜ0é\ˆ™[X[™YÚX˜™YYÎØ[ÛÚÛŒM›Y\ŒLÛİ\˜YÙNßKY]šXÜÎÜ™\]][Û›OOX\™™XİÍŒË[ÛY[[N_K™[][ÛœÚ\Î‘šJ›[™]\OOX\™™XİÍŒŠK›YÜÎ›OOX\™™XİŞÈ™›\\\™™Xİ[[™]\ˆLN›ÚYJNÜ™]\›ŸSØš™Xİ˜\ÜÚYÛŠÜ\ÙN˜š[šØ\]ZYŒKİ\‹Kİ\N‹K›İ][ÛŒ[™İ[\Œİ\Œİ\NŒ[\TÚ[˜ÙNŒİ™\šÛŒÜ[Ûİ[YˆL_JK\Ë˜Xİ[Û‹^ÛÛ[XSSˆ’S’ÑS˜\Ëš[^ÛÛ[X	ŞZVİ›[™]\İœ[›™\—WOÏİ›[™]\İœ[›™\—_H\İ˜[‹ˆ[[‹Y\™[‹ÛÙ›ÜÜÛ\ÜÙ[‹˜[][˜ÚÛ™ÊJ^Û]]\Ëœ[[YKœİ]K]™˜YÔİ\[‹YKO[‹KYKNÚYŠX]š\İ
‹JOŒ
^İ™˜YÔİ\[[˜Z™XİÜOV×NÜ™]\›Ÿ[]O]\Ëœ[[YK˜ÛÛ^™›YÜÖØ\ÜÚ\İ\™XÚ\Ú[Û˜OËMŒNİ˜˜[^Ş‹KN‹œŠŒKŒÌŠ˜KNšJŒKKŒÍY™NŒK˜›İ[˜ÙYHLK›\İÚİ›İ[˜ÙO]›[ÙOOOX›İ[˜ÙXœ\ÙOX›YÚ™˜YÔİ\[[™˜YÓ›İÏ[[˜Z™XİÜOV×_]XÚÔÛ™ÊJ^Û]]\Ëœ[[YK]œİ]K]˜ÛÛ^™›YÜÖØ\™\‹\İ\ÚK\Û™ØOËŒNÚYŠ‹›ÜÛ™[ÛØÚÊÏYJ™Y™šXİ[Jœ‹‹›ÜÛ™[ÛØÚÏÌ	‰›‹œ\ÙHOOX›YÚ	‰Š‹›ÜÛ™[ÛØÚÏLX]œ˜[™ÛJ
OŒŠÊ™Y™šXİ[KLJJ‹ŒI‰Š‹›ÜÛ™[]ÊÏLJK‹›ÜÛ™[]ÏLL	‰ˆ[‹œ™Y[\[ÛŠJZYŠ‹š]ÏMß˜ÛÛ^™›YÜÖØ\ÜÚ\İ\Û™Ë\™Y[\[Û˜J[‹œ™Y[\[ÛHL‹œ\ÙOX™XYX\Ë™™YY˜XÚÊ‘QSTSÓ˜™Y\ˆ™Y™™\ˆ™\›0é™Ù\YH]HÚ[˜ÙXØ\›š[™Ø
K\Ëš[^ÛÛ[X]HÚ[˜ÙNˆ™Y\ˆ™Y™™\ˆ0éYH™Y[\[Ûˆ[HX™[‹ˆZ[ˆ™ZØÚ\ÜÈ™Y[™]\ÈX]Ú˜Ù[Ù^İ\Ë™š[š\ÚÛ™ÊLJNÜ™]\›Ÿ[]O[‹˜˜[ÚYŠZJ\™]\›Û]OYKÌYLÎÚYŠK›Y™JÏXKKJÏLKŒÍJ˜KK
ÏZK
˜KKJÏZKJ˜K‹›[ÙOOOX›İ[˜ÙX	‰ˆ[‹˜›İ[˜ÙY	‰šKOKN	‰šKOŒ
^Û‹˜›İ[˜ÙYHLKOKNKJKKNK
KNÛ]O]˜ÛÛ^™›YÜÖØ\™\‹\İ\ÚK\Û™ØOËŒL‹Œ
™Y™šXİ[NÚYŠX]œ˜[™ÛJ
OJ^Û‹˜˜[[[‹œ\ÙOX™XYX‹›Z\ÜÙ\ÊÏLK‹œİ™XZÏL\Ë™™YY˜XÚÊP‘ÑUÑR•›İ[˜ÙH\šØ[›˜Y
K‹œ™Y[\[Û‰‰\Ë™š[š\ÚÛ™ÊLJNÜ™]\›Ÿ_[]Ï[‹˜İ\Ë™š[\ŠOO™K˜Xİ]™JKÏ]˜ÛÛ^˜][\ÏOOLËŒ‹ŒMËÏ[Ë™š[™
OO‘ÚJKKKKKJOÉ‰šKOŒ
NÚYŠÊ^ÚYŠË˜Xİ]™OHLK‹š]ÊÏLK‹œİ™XZÊÏLK‹›\İÚİ›İ[˜ÙJ^Û]O[Ë™š[™
OO™K˜Xİ]™I‰™HOOXÊNÙI‰ŠK˜Xİ]™OHLK‹š]ÊÏLK‹˜›İ[˜ÙR]ÊÏLJ_ZYŠ‹˜˜[[[‹œ\ÙOX™XYX‹˜™\İİ™XZÏSX]›X^
‹˜™\İİ™XZË‹œİ™XZÊK‹œ™Y[\[Û‰‰Š‹œ™Y[\[Û’]ÊÏLJK\Ë™™YY˜XÚÊ‹›\İÚİ›İ[˜ÙOØ“ÕSÑKU‘Q‘‘T˜˜‘Q‘‘T˜Ù\šYH	Û‹œİ™XZßXÛÛÙ
K\Ë˜]]Ô™\˜XÚÊ
K‹š]ÏLL
^İ\Ë™š[š\ÚÛ™ÊL
NÜ™]\›Ÿ\™]\›ŸJKOŒKŒ_KKŒ_KŒKŒ_K›Y™OŒÊI‰Š‹˜˜[[[‹œ\ÙOX™XYX‹›Z\ÜÙ\ÊÏLK‹œİ™XZÏL\Ë™™YY˜XÚÊS‘P‘S˜‹œ™Y[\[ÛØ™Y[\[Ûˆ™Y[™]˜Ü˜YÙ\ˆšXÚ[™ÈÛÜœšYÚY\™[˜˜Y
K‹œ™Y[\[Û‰‰\Ë™š[š\ÚÛ™ÊLJJ_X]]Ô™\˜XÚÊ
^Û]O]\Ëœ[[YKœİ]KYK˜İ\Ë™š[\ŠOO™K˜Xİ]™JNÚYŠVÍ‹ËWKš[˜ÛY\Ê›[™İ
J\™]\›ÙKœ™\˜XÚÜÊÏLNÛ]]›[™İOOMÓZJ
KœÛXÙJŠN›[™İOOLÏÖŞŞ‹KN‹ŒßKŞ‹MKN‹ŒÍ_KŞ‹MKN‹ŒÍ_WN–ŞŞ‹KN‹ŒÌ_WNİ™›Ü‘XXÚ

K
OOÙK[–İKKO[–İK_JK\Ë™™YY˜XÚÊ‘KTPÒØ	İ›[™İH™XÚ\ˆ™]HÙ\İ[™]]˜[
_Yš[š\ÚÛ™ÊJ^Û]]\Ëœ[[YKœİ]KSX]œ›İ[™
š]ÊŒLË]›Z\ÜÙ\ÊŒÊİ˜›İ[˜ÙR]ÊŒL
İ˜™\İİ™XZÊ
İœ™Y[\[Û’]ÊŠKYI‰›Z\ÜÙ\ÏLI‰˜›İ[˜ÙR]ÏLOØ\™™Xİ™I‰›Z\ÜÙ\ÏMØÛÛY™OØY\ÜŞX˜˜Z[Yİ\Ë™š[š\Ú
ÚY˜™Y\”Û™ØİXØÙ\ÜÎ™KØÛÜ™N›‹]X[]Nœ‹^™OÜOOX\™™XİØ™Zˆ™XÚ\‹ÛÛ›ÛY\H›YØ˜Z™[ˆ[™Z[™\İ[œÈZ[ˆ\™›ÛÜ™ZXÚ\ˆ[]ÙYÈ0ï™\ˆ[ˆ\ØÚˆİ\ÚH™[›\ÈØ]X™\‹ˆ™[^™[›\ÈØÚXÚÜØ[˜˜YH›Ü›X][Ûˆ\İY\™Ù\°é[]ˆšXÚ™Y\ˆİ\™ˆØ\ˆØÚ0í›‹X™\ˆ™Y\ˆ™\˜›ZX™[™H™XÚ\ˆÙZ0íœ\ˆÙYÙ[œÙZ]K˜œ™Y[\[ÛØYH™Y[\[Ûˆ[™][H\œİ[ˆ™ZØÚ\ÜËˆ°ïˆZ[™Hİ]HÙ\ØÚXÚH™ZXÚ\È›İ™[K°ïˆZ[™[ˆÚYYÈšXÚ˜˜YHÙYÙ[œÙZ]H°é[]Z™H™Zˆ™XÚ\ˆY\œİX‹ˆ\ˆ\ØÚØ\ˆšXÚØÚYYˆÙ[YË[H\È›Ûİ0é™YÈH\šÛ0é™[‹˜™YYÎØ[ÛÚÛ™OÌL›Y\™OÎKÛİ\˜YÙN™OÍ‹LŸKY]šXÜÎÜ™\]][Û™OÜOOX\™™XİÍŒÎ‹LK[ÛY[[N™OÍ‹LŸK™[][ÛœÚ\Î’ZJ\Ëœ[[YK˜ÛÛ^Øİ\ÚX™[^KOÌŒ
K›YÜÎœOOX\™™XİŞÈœÛ™Ë\\™™Xİ\™Y[\[Ûˆœ™Y[\[Û’]ÏŒN›ÚYJ_[][˜Ú›[šŞJJ^Û]]\Ëœ[[YK]œİ]K[‹™˜YÔİ\O\‹YKO\‹KYKNÛ‹™˜YÔİ\[[‹™˜YÓ›İÏ[[Û]ÏJŒN
Ê˜ÛÛ^™›YÜÖØ\ÜÚ\İ\™XÚ\Ú[Û˜OËŒNŒ
JÊ˜ÛÛ^˜][\ÏOOLËŒÍNŒ
JKİ™Y™šXİ[NÓX]š\İ

KKŒŠJ‹KKŒÎ
OÏÊ‹˜]XÚÒ]ÊÏLK‹œ\ÙOX]XÚËYš[šØ‹™Y™[™\L‹œİÜÚYÛ˜[HLK‹œİÜ[Y\L‹™›İ[HLK\Ë˜Xİ[Û‹^ÛÛ[XSSˆ’S’ÑS˜\Ë™™YY˜XÚÊ“TĞÒH°áš[šÙ[ˆš\È[HİÜY˜ÛÛÙ
JNŠ\Ë™™YY˜XÚÊ‘T‘‘RÛÙ›Ü[ˆYH™\ZYYİ[™Ø˜Y
K\Ëœİ\Y™[œÙJ
J_]XÚÑ›[šŞJJ^Û]]\Ëœ[[YK]œİ]NÚYŠ‹œ\ÙOOOX]XÚËYš[šØ
^Û]LNYKMJ™Y™šXİ[NÚYŠ‹™Y™[™\SX]›Z[ŠK‹™Y™[™\ŠÙJœŠK‹šÛ[™É‰ˆ[‹œİÜÚYÛ˜[	‰Š‹X[Qš[šÏSX]›Z[ŠL‹X[Qš[šÊÙJ‹ŒMJJK‹™Y™[™\LI‰ˆ[‹œİÜÚYÛ˜[	‰Š‹œİÜÚYÛ˜[HL‹œİÜ[Y\L\Ë™™YY˜XÚÊÕÔXÛÙ›ÜÜÛ\ÜÙ[˜Ø\›š[™Ø
JK‹œİÜÚYÛ˜[
ZYŠ‹œİÜ[Y\ŠÏYK‹šÛ[™Ê[‹œİÜ[Y\L	‰Š‹™›İ[HL‹šÛ[™ÏHLK‹X[Qš[šÏSX]›X^
‹X[Qš[šËLM
K\Ë™™YY˜XÚÊ“ÕS˜XÚÕÔÙZ]\™Ù][šÙ[˜˜Y
K\Ë™[™›[šŞT›İ[™

JNÙ[Ù^Û]O]˜ÛÛ^™›YÜÖØ\™\‹Z[KY›[šŞXOÍÌŒÌLÛ‹œİÜ[Y\YOÊ‹œİÜ]X[]JÏSX]œ›İ[™

K[‹œİÜ[Y\ŠKÌLŠÌN
K\Ë™™YY˜XÚÊĞUP‘T‘TˆÕÔ	ÓX]œ›İ[™
‹œİÜ[Y\Š_H\ØÛÛÙ
JNŠ‹X[Qš[šÏSX]›X^
‹X[Qš[šËMJK\Ë™™YY˜XÚÊÔ0áÛZ[™H°ïÚÜ™XÚ[™Ø˜Y
JK\Ë™[™›[šŞT›İ[™

__Y[ÙHYŠİš[™Ê‹œ\ÙJKœİ\ÕÚ]
Y™[œÙX
J^Û]]˜ÛÛ^™›YÜÖØ\ÜÚ\İY›[šŞK\Üš[OÌKŒŒŒKO[‹\™Ù][‹œ[›™\–O[‹\™Ù]K[‹œ[›™\–KÏSX]š\İ
KJNÚYŠÏ‹ŒJ^Û][‹œ[›™\–
ÚKÛÊ™JŒŒÙKMJœ‹Ï[‹œ[›™\–JØKÛÊ™JŒŒÙKMJœÔJË‹›ØœİXÛ\ÊOİ\Ë™™YY˜XÚÊS‘T“’TØ›İ]HÛÜœšYÚY\™[˜˜YLJNŠ‹œ[›™\–]‹œ[›™\–O\Ê_[‹™[™[^Qš[šÏSX]›Z[ŠL‹™[™[^Qš[šÊÙJ‹ŒMŠ™Y™šXİ[JK‹™[™[^Qš[šÏLL	‰\Ë™š[š\Ú
ÚY˜›[šŞX˜[İXØÙ\ÜÎˆLKØÛÜ™N“X]œ›İ[™
‹X[Qš[šÊK]X[]N˜˜Z[Y^˜YHÙYÙ[œÙZ]HY\Z™H›\ØÚ[‹ğé™[™]Y\ˆ˜[›ØÚZ[™HZYÙ[™H™Z\ÙX™\ØÚ™ZX[™È™\™Y[˜™YYÎÙ[™\™ŞN‹LMK\œİŒL[ÛÚÛKY]šXÜÎÜ™\]][Û‹L__J__Y›[šŞPXİ[ÛŠ
^Û]O]\Ëœ[[YKœİ]NÚYŠKœ\ÙOOOXY™[œÙK\[˜	‰‘ÚJKœ[›™\–Kœ[›™\–KKMJOŒJYK˜›İU\HLKœ\ÙOXY™[œÙKX˜[\Ë™™YY˜XÚÊ“TĞÒHÕR™][H˜[ÛÛÙ
NÙ[ÙHYŠKœ\ÙOOOXY™[œÙKX˜[	‰‘ÚJKœ[›™\–Kœ[›™\–KK™Y™[œÙP˜[K™Y™[œÙP˜[JOŒJYK˜˜[[HLKœ\ÙOXY™[œÙK\™]\›˜K\™Ù]KŒKK\™Ù]OKÍË\Ë™™YY˜XÚÊSUQ‘ÑS“ÓSQS˜\ˆ[šYH\°ïÚØÛÛÙ
NÙ[ÙHYŠKœ\ÙOOOXY™[œÙK\™]\›˜	‰™Kœ[›™\–ŒMÊ^Û]LLYK™[™[^Qš[šÎÙKœİÜ]X[]JÏSX]œ›İ[™

‹MJKMI‰ŠK™Y™[œÙT\™™XİÊÏLJK\Ë™™YY˜XÚÊÕÔX	ÓX]œ›İ[™

_H	HÙYÛ™\š\ØÚ\ÈÙ]°éšÈÙ\™]]ÛÛÙ
K\Ë™[™›[šŞT›İ[™

_Y[ÙH\Ë™™YY˜XÚÊ•HÑRUÑQØ\œİ°é\ˆ[ˆ\ÈšY[]Y™[˜˜YLJ_\İ\Y™[œÙJ
^Û]O]\Ëœ[[YKœİ]NÓØš™Xİ˜\ÜÚYÛŠKÜ\ÙN˜Y™[œÙK\[˜[›™\–‹ŒK[›™\–N‹ÍË\™Ù]‹K\™Ù]N‹MK›İU\ˆLK˜[[ˆLKY™[œÙP˜[‹
ÓX]œ˜[™ÛJ
J‹ŒY™[œÙP˜[N‹
ÓX]œ˜[™ÛJ
J‹ŒŸJK\Ë˜Xİ[Û‹^ÛÛ[XUQ”ÕSSˆÈUQ’P‘SˆÈÕÔ\Ëš[^ÛÛ[X[\[ˆÙ]\È]YšY[ˆ[ˆ›\ØÚK˜[[™ZYÙ[™\ˆ[šYH™]ÙZ[ÈRÕSÓˆ°ïÚÙ[‹˜Y[™›[šŞT›İ[™

^Û]O]\Ëœ[[YKYKœİ]NÚYŠœ›İ[™
ÏLKšÛ[™ÏHLKX[Qš[šÏLL
^Û]]˜]XÚÒ]ÏLÉ‰ˆ]™›İ[	‰œİÜ]X[]OM	‰™Y™[œÙT\™™XİÏLOØ\™™Xİ˜]XÚÒ]ÏLØÛÛY˜Y\ÜŞXİ\Ë™š[š\Ú
ÚY˜›[šŞX˜[İXØÙ\ÜÎˆLØÛÜ™N“X]œ›İ[™
L
İ˜]XÚÒ]ÊŒLŠİœİÜ]X[]Jİ™Y™[œÙT\™™XİÊŒL‹J™›İ[ÌNŒ
JK]X[]N›‹^›OOX\™™XİØ›\ØÚHÙ]›Ù™™[‹Y™[œÚ]ˆØ]X™\ˆÙ\™]][™ÕÔ^Zİ[ˆ\ˆ[šYKˆİ\ˆÚYZ\ÈÚYHÜ™Ø[š\ÚY\\ˆÜÜ]\Ë˜˜]\™H›\ØÚ[ˆÚ[™Y\‹ˆ\ˆÙYÈÜ[ˆØ\ˆğíœœ\›XÚZİ\ØÚ[™\š\İ\ØÚšXÚ›Ûİ0é™YÈØ]X™\‹˜™YYÎÙ[™\™ŞN‹LŒ‹\œİŒM[ÛÚÛŒM›Y\Ûİ\˜YÙNKY]šXÜÎÜ™\]][Û›OOX\™™XİÍÎ[ÛY[[NßK™[][ÛœÚ\Î’ZJK˜ÛÛ^Ø[›X[XKOOX\™™XİÍŒŠ_JNÜ™]\›ŸZYŠœ›İ[™
^Û]O]X[Qš[šÏ™[™[^Qš[šÎİ\Ë™š[š\Ú
ÚY˜›[šŞX˜[İXØÙ\ÜÎ™KØÛÜ™N“X]œ›İ[™
X[Qš[šË]™[™[^Qš[šÊÍÌ
K]X[]N™OØY\ÜŞX˜˜Z[Y^™OØ™Z][ØÚZY[™ËˆZˆÙ]Ú[›Û˜\]\ğéÚXÚÙZ[™ZYHÙZ][ˆ[Ú\ØÚ[ˆ™YÙ[ˆ\™š[™[‹˜˜™Z][ØÚZY[™È™\›Ü™[‹ˆYHÙYÙ[œÙZ]HØ\ˆZ[š[X[Ü™Ø[š\ÚY\\‹˜™YYÎÙ[™\™ŞN‹LŒ\œİŒL‹[ÛÚÛŒLKY]šXÜÎÜ™\]][Û™OÌ‹L__JNÜ™]\›ŸSØš™Xİ˜\ÜÚYÛŠÜ\ÙN˜]XÚË]›İØ˜YÔİ\›[˜YÓ›İÎ›[İÜÚYÛ˜[ˆLKİÜ[Y\ŒJK\Ë˜Xİ[Û‹^ÛÛ[XSÑT‘‘S˜\Ëš[^ÛÛ[X[™H	İœ›İ[™Nˆ˜[\°ïÚŞšYZ[ˆ[™]YˆYHZ][›\ØÚHÙ\™™[‹˜XÚÛÜÙRYÙTÜİ
J^Û]]\Ëœ[[YKœİ]KYOŒÌÏÌ™O‹ÏÌŒNİœÜİ[‹œ\ÙOXXİ]™X˜Z[OVËŒËKÍVÛ—K\Ë˜Xİ[Û‹^ÛÛ[XSSˆ”•S”ÑS˜\Ëš[^ÛÛ[VØ˜Z\ˆ\ØÚˆØÚ™[X™\ˆØ][HXÚİ[™È[™ÚHÙ\°é\ØÚÚ\šİ[™Ë˜YY™HXÚÙNˆ[™ÜØ[Y\‹İ]HXÚİ[™Ëİ0éšÙ\™HÚ[™™]ÙYİ[™Ë˜]XÚ\™[ˆÚXÚØÚ]‹X™\ˆÚXÚ˜\™H™]ÙZ\ÙHÙ\™[ˆÛŞšX[]\™\‹˜VÛ—K\Ë™™YY˜XÚÊÕSHÑUğáØ˜Z\ˆ\ØÚYY™HXÚÙX]XÚ\™[VÛ—K™]]˜[
_]XÚÒYÙJJ^Û]]\Ëœ[[YK]œİ]NÚYŠ‹œ\ÙHOOXXİ]™X
\™]\›Û]]˜ÛÛ^™›YÜÖØ[K\›İ]KZÛ›İÛYÙXOËÍŒKO]˜ÛÛ^™›YÜÖØ]]Üš]KYÛÛÙÚ[OËÍNŒNÛ‹›ØœÙ\™\OJ‹›ØœÙ\™\JÙJYKMŠ™Y™šXİ[JœŠILK‹›ØœÙ\™\J‹›ØœÙ\™\‹YJŒÙKMŠ™Y™šXİ[JœŠÌJILK‹Ú[™SX]œÚ[Š\™›Ü›X[˜ÙK››İÊ
KÎL
JŠËŒMKŒKŒWVÛ‹œÜİOÏËŒŠNÛ]OVËŒËKÍVÛ‹œÜİKÏSX]˜XœÊ‹›ØœÙ\™\KXJOŒLËÏSX]˜XœÊ‹›ØœÙ\™\‹XJOŒLKÏ[‹˜Z[JÛ‹Ú[™
ŠJÛ‹œ›ÙÜ™\ÜËÎL
KJËŒLKŒM‹ŒLWVÛ‹œÜİOÏËŒLŠJÊ˜ÛÛ^˜][\ÏOOLËŒNŒ
KOSX]˜XœÊËXJO[ßÎÚYŠ‹šÛ[™Ê^Û‹œ›ÙÜ™\ÜÏSX]›Z[ŠL‹œ›ÙÜ™\ÜÊÙJŠËŒÌKŒKŒÌ—VÛ‹œÜİOÏËŒÊJNÛ]JÈH[ÊÈ
ÈH\ÊÈ
È]NÛ‹œİ\ÜXÚ[ÛSX]›Z[ŠL‹œİ\ÜXÚ[ÛŠÙJ‹ŒLMJ
šJK_
‹™]šY[˜ÙJÏYJ‹ŒÌŠK	‰›‹œİ\ÜXÚ[ÛL	‰Š‹˜Ø]YÚ›\ÚLN
K
]JI‰›‹›™X\“Z\ÜĞÛÛÛİÛL	‰Š‹›™X\“Z\ÜÙ\ÊÏLK‹›™X\“Z\ÜĞÛÛÛİÛMÌ\Ë™™YY˜XÚÊØ“PÒÒÑQÑS˜UTÔÑT’S˜ØÜÛ\ÜÙ[ˆÙ\ˆXÚİ[™È[[˜˜šXÚ[™ÈÛÜœšYÚY\™[˜Ø\›š[™ØLJJ_Y[ÙH‹œİ\ÜXÚ[ÛSX]›X^
‹œİ\ÜXÚ[Û‹YJ‹ŒMÊšJK‹œ›ÙÜ™\ÜÏŒ	‰Š‹š[\œ\[ÛœÊÏYJŒNKMŠK‹››Ú\ÙOSX]›Z[ŠL‹››Ú\ÙJÙJKM
›‹š[\œ\[ÛœÊNÚYŠ‹›™X\“Z\ÜĞÛÛÛİÛSX]›X^

‹›™X\“Z\ÜĞÛÛÛİÛÏÌ
KYJK‹˜Ø]YÚ›\ÚSX]›X^
‹˜Ø]YÚ›\ÚYJK‹œİ\ÜXÚ[ÛLL
^İ\Ë™š[š\Ú
ÚY˜YÙTYXİXØÙ\ÜÎˆLKØÛÜ™N“X]œ›İ[™
‹œ›ÙÜ™\ÜË[‹™]šY[˜ÙK[‹››Ú\ÙJK]X[]N˜˜Z[Y^˜\ØÚ[›[\K›XÚÚÛÛZİ[™Z[™H[™ğïœİYÙHİ˜ZšXÚ[™È\™ÙX™[ˆÙ[YZ[œØ[HZ[ˆ™[\İ˜\™\ÈXÚÙ[œ›İÚÛÛ˜İ\ÜXÚ[ÛŒÌ‹™[YYŠÊ‹œ›ÙÜ™\ÜÏMÌ
K™YYÎØ›Y\‹SX]œ›İ[™
‹œ›ÙÜ™\ÜÊKÛİ\˜YÙN‹NKY]šXÜÎÙYÛš]N‹MËÚ[ÜÎŸK™[][ÛœÚ\ÎÙİ[™[N‹MK[N‹MK›YÜÎÚYÙPØ]YÚˆL_JNÜ™]\›ŸZYŠ‹œ›ÙÜ™\ÜÏLL
^Û]O[‹œİ\ÜXÚ[ÛM	‰›‹™]šY[˜ÙOÉ‰›‹š[\œ\[ÛœÏKYOØ\™™Xİ›‹œİ\ÜXÚ[ÛØÛÛY˜Y\ÜŞXİ\Ë™š[š\Ú
ÚY˜YÙTYXİXØÙ\ÜÎˆLØÛÜ™N“X]œ›İ[™
LM‹[‹œİ\ÜXÚ[Û‹[‹™]šY[˜ÙK[‹››Ú\ÙJK]X[]N^™OØ\›ZXÚ\[™[XÚİ[™Ú™HÚXÚ˜\™[ˆ™]ÙZ\ËˆYHXÚÙHØÚÙZYİ]\Èœ™ZY[ˆİ0ïÚÙ[‹˜˜YHØXÚH\İ\›YYİˆZ[šYÙH›0é\ˆÙ[›™[ˆYHØZšZ]™\Ú]™[ˆX™\ˆÙZ[™H]\ÜØYÙYÙ[™ZZYİ[™Ë˜İ\ÜXÚ[Û“X]œ›İ[™
‹œİ\ÜXÚ[ÛŠ‹ŒŒŠK™[YYŒK™YYÎØ›Y\‹LLÛİ\˜YÙN_KY]šXÜÎÙYÛš]N™OÌ‹LKÚ[ÜÎ™OÌŒŸK›YÜÎ™OŞÚYÙT\™™XİˆLN›ÚYJ__X\ÜÚYÛ“X\Û[™
K
^Û]]\Ëœ[[YKœİ]K]\Ëœ[[YKœÚ[\œËœÚ^™OLİOØY˜šYÚ‘ÚJK‹›Y‹›YJOÚJK‹œšYÚ‹œšYÚJOØY˜šYÚÛ–ØÚ[\‹IÙ_XO\‹‹˜Xİ]™R[™\‹\Ë›[İ™SX\Û[™
K
_[[İ™SX\Û[™
K
^Û]]\Ëœ[[YKœİ]K[–ØÚ[\‹IÙ_XOÏÛ‹˜Xİ]™R[™Û–Ü—O^Ş’ÚJOOXYËŒN‹LKOOXYËN‹ŠKN’ÚJKŒÎÌŠ__]XÚÓX\Û
K
^Û]]\Ëœ[[YK[‹œİ]KO\‹œšYÚ\‹›YOSX]˜XœÊ‹›YK\‹œšYÚJKÏJ‹›Y
Ü‹œšYÚ
KÌ‹ÏSX]˜XœÊË\‹š›Ú[
KÏ[‹˜ÛÛ^™›YÜÖØ\ÜÚ\İ[X\Û\ÙX[OËŒLŒJ‹œ›İ[™LJJ‹ŒNÚYŠ‹š›Ú[KJÓX]œÚ[ŠÊLŒ\‹œ›İ[™
L
JJ›‹˜œ™X]JX]œÚ[ŠÍLŒ
JÌJKÌ‹‹œÙX[RÚJKSX]˜XœÊKKŒŒŠJŠXÊ
KXJŒË\ÊŒÊØËJK‹œ\ÙOOOXÙX[	‰Š‹œÙX[PZJŠOÊ‹œİX›U[YJÏYK\Ë˜Xİ[Û‹^ÛÛ[\‹œİX›U[YOLØP‘PÒS‘ÈÒÈ0­ÈÕT•S˜˜ÕP’SSS˜\Ëš[^ÛÛ[\‹œİX›U[YOLØØÚİXš[ˆRÕSÓˆ°ïÚÙ[ˆ[™[œØÚYpçÙ[™[H[[ˆ][Y™[œİ\ˆ[[‹˜˜›ØÚİ\ˆİXš[[[‹˜
Nœ‹œİX›U[YOSX]›X^
‹œİX›U[YKYJŒKJJK‹œ\ÙOOOX[	‰œ‹šÛ[™Ê^Û]RÚJKSX]˜XœÊ‹˜œ™X]KÌŠJŒKŒKJNÜ‹œš]T]X[]JÏYJ‹œ[SX]›Z[ŠL‹œ[
ÙJ‹ŒÌJœ‹œÙX[

K‹˜ÛİYÚSX]›Z[ŠL‹˜ÛİYÚ
ÙJ‹ŒLÍJŠKŒÎ\‹œÙX[
JÊ‹œ[ÎÙJ‹ŒŒÎŒ
JÊÙJ‹ŒLŒ
JK‹œÙX[É‰Š‹›XZÜÊÏYJ‹ŒÎ
K‹˜ÛİYÚLL	‰\Ë˜ÛÛ\]SX\Û[
LJ_Y[ÙH‹œ\ÙOOOX[	‰ˆ\‹šÛ[™É‰œ‹œ[ŒL‰‰\Ë˜ÛÛ\]SX\Û[
‹œ[M	‰œ‹œ[N	‰œ‹œÙX[KM	‰œ‹œš]T]X[]OL
_XÛÛ\]SX\Û[
J^Û]]\Ëœ[[YKœİ]KYOÓX]œ›İ[™
ÌŠİœÙX[
ŒSX]˜XœÊ‹]œ[
J‹]›XZÜÊÓX]›Z[ŠLœš]T]X[]KÌN
JN“X]›X^
KX]œ›İ[™
œ[
‹ŒK]›XZÜÊJNÚYŠœØÛÜ™JÏ[‹_
˜ÛİYÚSX]›Z[ŠL˜ÛİYÚ
ÌN
JK\Ë™™YY˜XÚÊOØĞUP‘T‘Tˆ•QØ˜TÕSˆÈPÒØ	ÛŸH[šİXOØÛÛÙ˜˜Y
Kœ›İ[™LÊ^Û]O]œØÛÜ™OLMÍKYI‰œØÛÜ™OLMI‰˜ÛİYÚMOØ\™™Xİ™OØÛÛYœØÛÜ™OLLŒØY\ÜŞX˜˜Z[Yİ\Ë™š[š\Ú
ÚY˜X\ÛÛXİXØÙ\ÜÎ™KØÛÜ™NœØÛÜ™K]X[]N›‹^›OOX\™™XİØ™ZHXÚH°ïÙKİXš[\ˆš]]\È[™X\ÛšXÚİ^ZİZ[›X[ˆYZˆ[™\šÙ[›[™È\İÜ™Ø[š\Ø]Üš\ØÚšXÚ›Ü™Ù\ÙZ[‹˜™OØYHXÚšZÈÚ\šİˆX\Û\šÙ[›YZ™\™H[ÛY[HXÚ\ˆX™XÚ[™È[™œ˜]XÚ˜\™[ˆš]]\È[‹˜˜Ú\šİ[™È›Üš[™[‹X™\ˆZ[ˆ\šX›XÚ\ˆZ[\È˜]XÚÈ°ïHZ[ˆZYÙ[œİ0é™YÙ\È]pçÙ[›X™[‹˜™YYÎÚYÚ™\ÜÎ™OÍŒŒ[™\™ŞN‹NÛİ\˜YÙN™OÍŒ_KY]šXÜÎÜ™\]][Û›OOX\™™XİÍN™OÌ‹LK[ÛY[[N™OÍNŒK™[][ÛœÚ\ÎÛX\Û›OOX\™™XİÍN™OÌÎŒK›YÜÎ›OOX\™™XİŞÛX\ÛXÚš\]YSX\İ\™YˆLN›ÚYJNÜ™]\›Ÿ]œ›İ[™
ÏLKØš™Xİ˜\ÜÚYÛŠÜ\ÙN˜ÙX[[ŒÛİYÚ“X]›X^
˜ÛİYÚN
KXZÜÎŒš]T]X[]NŒİX›U[YNŒYŞ‹ŒÌJÓX]œ˜[™ÛJ
J‹ŒKN‹LŠÓX]œ˜[™ÛJ
J‹ŒŸKšYÚŞ‹
ÓX]œ˜[™ÛJ
J‹ŒKN‹LŠÓX]œ˜[™ÛJ
J‹ŒŸ_JK\Ë˜Xİ[Û‹^ÛÛ[X0á‘HP‘PÒS˜\Ëš[^ÛÛ[XYÈ	İœ›İ[™KÌÎˆšYš[[]Kˆ™ZYH0é™H\›™]]İXš[[H\ÈØÚ°ï™[‹˜\Ş[˜Ó]™JJ^Û]YKœİ]NÙKšYOOX›\İ\	‰\Ë\]S]™JÕQ‘‘S	İœ[›™\ŠÌ_KÍ\Ëœ\ÙQ\ØÜš\[ÛŠJKÚJ
œ[›™\ŠÊK]›\]ZY
J‹ŒÍJKÍJJKKšYOOX™Y\”Û™Ø	‰\Ë\]S]™Jœ™Y[\[ÛØ‘QSTSÓ˜˜	İš]ßKÌL‘PÒT˜\Ëœ\ÙQ\ØÜš\[ÛŠJKÚJš]ËÌLJJKKšYOOX›[šŞX˜[	‰\Ë\]S]™J•S‘H	İœ›İ[™X\Ëœ\ÙQ\ØÜš\[ÛŠJKÚJX[Qš[šËÌLJJKKšYOOXYÙTYX	‰\Ë\]S]™J‘T‘PÒ	ÓX]œ›İ[™
œİ\ÜXÚ[ÛŠ_X\Ëœ\ÙQ\ØÜš\[ÛŠJKÚJœ›ÙÜ™\ÜËÌLJJKKšYOOXX\ÛÛX	‰\Ë\]S]™J•QÈ	İœ›İ[™KÌØ\Ëœ\ÙQ\ØÜš\[ÛŠJKÚJ
œ›İ[™LJİœ[ÌL
KÌËJJ_\\ÙQ\ØÜš\[ÛŠJ^Û]YKœİ]NÜ™]\›Ù›\İ\Ùš[šÎ˜™XÚ\ˆY\™[ˆ0­È™XÚ™Z]YÈÜÛ\ÜÙ[˜XÙN˜0ç™\œİ[™ğé[˜›\˜Ú\ØÚ[\[ÈÙ]™[˜›YÚ˜™XÚ\ˆ[ˆ\ˆYK™Y\”Û™ÎÜ™XYNœ™Y[\[ÛØ]HÚ[˜ÙH›Ü˜™\™Z][˜˜	Ôİš[™Ê›[ÙJKÕ\\Ø\ÙJ
_KUİ\™ˆ›Ü˜™\™Z][˜›YÚ˜˜[›YÈ™[Ø˜XÚ[˜K›[šŞX˜[È˜]XÚË]›İÈ˜Z][›\ØÚH™Y™™[˜˜]XÚËYš[šÈœİÜÚYÛ˜[ØÕÔ8 $ÈÜÛ\ÜÙ[˜˜š[šÙ[‹ÙYÛ™\ˆ™[Ø˜XÚ[˜™Y™[œÙK\[ˆ˜\ˆ›\ØÚH]Y™[˜™Y™[œÙKX˜[˜˜[]Y›™ZY[˜™Y™[œÙK\™]\›ˆ˜\ˆ[šYH[™ÕÔKYÙTYNØÚÛÜÙN˜XÚİ[™Èğé[˜Xİ]™NšÛ[™ÏØšXÚ[™È[™›XÚÚÙYÙ[[[˜˜Ø\[ˆÈ™\™XÚX˜˜]Y[˜KX\ÛÛNÜÙX[˜0é™HX™XÚ[˜[šÛ[™ÏØÚ\šİ[™ÜŞYÈÛÛ›ÛY\™[˜˜YÈİ\[ˆÙ\ˆ™Y[™[˜_VÙKšYVİœ\ÙWOÏÔİš[™Êœ\ÙJ_Y™YY˜XÚÊK‹HL
^İ\Ëœ\ÙSX™[^ÛÛ[YK\Ë›]™SX™[^ÛÛ[]\Ë™^\šY[˜ÙK™]\Ù]™™YY˜XÚÏ[‹Ú[™İË˜ÛX\•[Y[İ]
[X™\Š\Ë™^\šY[˜ÙK™]\Ù]™™YY˜XÚÕ[Y\Ÿ
JNÛ]O]Ú[™İËœÙ][Y[İ]


OOÙ[]H\Ë™^\šY[˜ÙK™]\Ù]™™YY˜XÚßKL
Nİ\Ë™^\šY[˜ÙK™]\Ù]™™YY˜XÚÕ[Y\Tİš[™ÊJK‰‰\[Ùˆ˜]šYØ]Ü‹šXœ˜]OOX[˜İ[Û˜	‰›˜]šYØ]Ü‹šXœ˜]JOOXÛÛÙÖÌL‹KL—N›OOX˜YÖÌÎN›OOXØ\›š[™ØÖÌNNNN–ÎJK\Ë˜™Y\
Š_X™Y\
J^İ^İ\Ë˜]Y[ÏÏÏ[™]È]Y[ĞÛÛ^Û]]\Ë˜]Y[Ë˜Ü™X]SÜØÚ[]ÜŠ
K]\Ë˜]Y[Ë˜Ü™X]QØZ[Š
Nİ\OXÚ[™X™œ™\]Y[˜ŞK˜[YOYOOOXÛÛÙÍŒ™OOOX˜YÌNL™OOOXØ\›š[™ØÌÌÌ‹™ØZ[‹œÙ]˜[YP][YJŒK\Ë˜]Y[Ë˜İ\œ™[[YJK‹™ØZ[‹™^Û™[X[˜[\Õ˜[YP][YJYKM\Ë˜]Y[Ë˜İ\œ™[[YJËŒ
K˜ÛÛ›™Xİ
ŠK˜ÛÛ›™Xİ
\Ë˜]Y[Ë™\İ[˜][ÛŠKœİ\

KœİÜ
\Ë˜]Y[Ë˜İ\œ™[[YJËŒ
_XØ]Úß_]\]S]™JKŠ^İ\Ëœ\ÙSX™[^ÛÛ[YK\Ë›]™SX™[^ÛÛ[]Û]]\Ë™^\šY[˜ÙKœ]Y\TÙ[XİÜŠ›Z[šK[]™K\›ÙÜ™\ÜÈX
NÜ‰‰Š‹œİ[KÚYX	ÒÚJ‹JJŒLIX
_Z[œ][İÙY

^Ü™]\›ˆHJ\Ëœ[[YOËœ[›š[™É‰ˆ]\Ëœ[[YKœ]\ÙY	‰\Ëœ[[YK˜Ûİ[İÛL
_Y˜]ÊJ^Û]]\Ë˜İ]\Ë˜Ø[˜\ËÚY]\Ë˜Ø[˜\ËšZYÚİ˜ÛX\”™Xİ
‹ŠK™š[İ[OXÌMÌÎ™˜™š[™Xİ
‹ŠKKšYOOX›\İ\	‰“J‹‹Kœİ]KK˜ÛÛ^
KKšYOOX™Y\”Û™Ø	‰”šJ‹‹Kœİ]KK˜ÛÛ^
KKšYOOX›[šŞX˜[	‰šJ‹‹Kœİ]JKKšYOOXYÙTYX	‰šJ‹‹Kœİ]JKKšYOOXX\ÛÛX	‰•šJ‹‹Kœİ]KZJJJKKœ]\ÙY	‰™Kœ[›š[™ÏÒJ‹‹UTÒQT•›ÜÙ]™[ˆ0ï™\ˆYHØÚ[›0éÚHØ™\š[ˆ\ÈÜY[™[Ø
N™K˜Ûİ[İÛŒ	‰’J‹‹İš[™ÊX]˜ÙZ[
K˜Ûİ[İÛ‹ÌYLÊJK™\™Z]XXÚ[˜
_Yš[š\Ú
J^Û]]\Ëœ[[YNÚYŠ]Ëœ[›š[™Ê\™]\›İœ[›š[™ÏHLKœ]\ÙYHL\Ë˜Xİ[Û‹™\ØX›YHL\Ëœ]\ÙP]Û‹™\ØX›YHL\Ëœ™]P]Û‹šY[HLNÛ]YKœİXØÙ\ÜÏÙKœ]X[]OOOX\™™XİØQÑS‘0á˜™Kœ]X[]OOOXY\ÜŞXØÒSÕTĞÒÑTĞÒQ‘•˜ÑTĞÒQ‘•˜ÑTĞÒRUT•İ\Ëœ™\İ[šY[HLK\Ëœ™\İ[š[›™\’SXˆİ›Û™Ï‰ÛŸOÜİ›Û™Ï‚ˆ‰ÜZJK^
_OÜ‚ˆ]ˆÛ\ÜÏH›Z[šK\™\İ[\İ]ÈÜ[•Ù\‰ÓX]œ›İ[™
KœØÛÜ™J_OØÜÜ[Ü[”]X[]0é‰ÙKœ]X[]_OØÜÜ[Ü[•™\œİXÚ‰İ˜ÛÛ^˜][\ÊÌ_OØÜÜ[Ù]‚ˆÛX[‰ÙKœİXØÙ\ÜÏØ\È\™ÙX›š\È™\°é™\™^šYZ[™Ù[‹Y‹\İ0é™H[™pí™ÛXÚHØ[\œ›ÙÜ™\ÜÚ[Û‹˜˜Z[ˆ™ZØÚYÈ›ZXZ[\ˆÚ›ÛšZËˆ\›™]]™\œİXÚ[ˆ\İpí™ÛXÚ˜OÜÛX[˜\Ë™™YY˜XÚÊ‹Ù\	ÓX]œ›İ[™
KœØÛÜ™J_XKœİXØÙ\ÜÏØÛÛÙ˜˜Y
K\Ë›Û“İ]ÛÛYJJ_\Ú[
J^Û]]\Ë˜Ø[˜\Ë™Ù]›İ[™[™ĞÛY[™Xİ

NÜ™]\›Ş’ÚJ
K˜ÛY[]›Y
KİÚYJKN’ÚJ
K˜ÛY[K]Ü
KİšZYÚJ___NÙ[˜İ[ÛˆJJ^Û]YK˜][\ÏOOLË™K˜][\ÏOOLI‰™KÚ[œÏOOLËNŒNÜ™]\›ˆKÚ[œÏL‰‰Š
ÏKŒJKK˜™\İ]X[]OOOX\™™Xİ	‰Š
ÏKŒ
KK›™YYË™[™\™ŞOÌ	‰Š
ÏKŒÊKÚJ‹KŒN
_Y[˜İ[ÛˆÚJJ^Ü™]\›ˆOOØZ[œİYYÜÚ[™X™OKŒØ›Ü›X[™OKŒLØ›ÜÙ\ØÚš][˜˜YÙ[™[›[Ù\ØY[˜İ[ÛˆÚJK
^Ü™]\›ŠOOOX›\İ\ÖÖÈH]™›YÜÖØ\ÜÚ\İY›\YYÙXK\œÈX\šÚY\[ˆÜ[X[[ˆ™XÚ\°ï™\œİ[™˜KÈH]™›YÜÖØ\ÜÚ\İ]X[K\Úİ]K™[°ê\ÈÜ\[œYˆ™\›[™ÜØ[][ˆÙYÛ™\š\ØÚ[ˆš]]\Ë˜WN™OOOX™Y\”Û™ØÖÖÈH]™›YÜÖØ\™\‹\İ\ÚK\Û™ØKİ\ÚHY\İ›Ü›X][Û™[ˆ[™ØÚğéÚÙYÛ™\š\ØÚHÙ\šY[‹˜KÈH]™›YÜÖØ\ÜÚ\İ\Û™Ë\™Y[\[Û˜K™[^ÚXÚ\Z[™H\ğé›XÚH™Y[\[Û‹˜KÈH]™›YÜÖØ\ÜÚ\İ\™XÚ\Ú[Û˜KÜ™YÛÜˆ›[™]Z[™H›YØ˜Zœ›ÙÛ›ÜÙHZ[‹˜WN™OOOX›[šŞX˜[ÖÖÈH]™›YÜÖØ\ÜÚ\İY›[šŞK\Üš[K[›H™ZYİYHğï™\™H™\ZYYİ[™ÜÛ[šYK˜KÈH]™›YÜÖØ\™\‹Z[KY›[šŞXK[H\ÙZ]\\ÈØ]X™\™HİÜY‹Q™[œİ\‹˜WN™OOOXYÙTYXÖÖÈH]™›YÜÖØ[K\›İ]KZÛ›İÛYÙXK[\È›İ]HXXÚÛÛ›Ûğé™ÙH[™ÜØ[Y\ˆ›Üš\œÙZ˜\‹˜KÈH]™›YÜÖØ]]Üš]KYÛÛÙÚ[Kİ[™[\ÈÛÚÛÛ[ˆœ™[\İ™\™XÚØ]Y˜˜]K˜WN–ÖÈH]™›YÜÖØ\ÜÚ\İ[X\Û\ÙX[KX\Û™\˜œ™Z]\[ˆİXš[[ˆX™XÚ[™ÜØ™\™ZXÚ˜WJK™š[™

ÙWJOO™JOË–ÌWOÏØY[˜İ[ÛˆÚJ
^Ü™]\›Ø][\ÎŒÚ[œÎŒ™\İŒ™\İ]X[]N˜˜Z[YXİ]™UX[N–×K›YÜÎßK™YYÎÙ[™\™ŞNŒL[™Ù\Œ\œİŒ›Y\Œ[ÛÚÛŒYÚ™\ÜÎŒ[™Ûİ™\ŒÛİ\˜YÙNŒÌ__Y[˜İ[ÛˆJJ^Ü™]\›Ø[™™NÍKMK™[™N™KMK\œÎKMK[›NÎKMKÜ™YÛÜÙKMX\ÛKM™[^Í™KM_VÙWOÏÍÌ™KM_Y[˜İ[ÛˆZJJ^Ü™]\›Ø[™™NŒKŒ‹™[™N‹LK\œÎŒKŒM[›NŒKŒÜ™YÛÜŒKŒKX\Û‹K™[^ŒKŒßVÙWOÏÌ_Y[˜İ[ÛˆJJ^Ü™]\›Ø[™™N‹LK™[™N‹MK\œÎ‹K[›N‹LËÜ™YÛÜ‹KX\Û‹MË™[^‹LŸVÙWOÏËLŸY[˜İ[ÛˆÚJK
^Ü™]\›ŠÊİœXÙ[Y[ØÛÜ™J‹ŒLŠÊK˜ÛÛ^˜][\ÏOOLËŒNŒ
JKÙK™Y™šXİ[_Y[˜İ[ÛˆÚJJ^Ü™]\›ˆX]˜XœÊ
IJX]”JŒŠJÓX]”JŒŠIJX]”JŒŠKSX]”J_Y[˜İ[ÛˆZJJ^Ü™]\›ˆK˜ÛÛ^™›YÜÖØ\ÜÚ\İ[X\Û\ÙX[OËMN™K˜ÛÛ^˜][\ÏOOLËNN‹Y[˜İ[ÛˆšJKŠ^Û]YK]OYKK]KOKKÏKÏ\ŠŒKŒÌ‹ÏZJŒKKŒÍHLKOV×NÙ›ÜŠ]OLÙOÙJÏLJXÊÏLKŒÍJ‹ŒMKJÏ\Ê‹ŒMKÊÏXÊ‹ŒMK‰‰ˆ[	‰›ÏKN	‰˜ÏŒ	‰ŠHLÏKNÊKKNÊKJKKœ\Ú
Ş˜KN›ßJNÜ™]\›ˆ_Y[˜İ[ÛˆZJ
^Ü™]\›–ŞŞ‹KN‹ŒŒŸKŞ‹MKN‹Œ_KŞ‹MKN‹Œ_KŞ‹KN‹ŒÍŸKŞ‹KN‹ŒÍŸKŞ‹NKN‹ŒÍŸKŞ‹ŒÍKN‹ßKŞ‹MKN‹ßKŞ‹MKN‹ßKŞ‹ŒÍKN‹ßWK›X\
OOŠË‹‹™KXİ]™NˆLJJ_Y[˜İ[ÛˆšJ
^Ü™]\›–ŞŞ‹ŒN‹Î‹ŒK‹ŒKŞ‹ŒËN‹Î‹ŒL‹‹ŒßW_Y[˜İ[ÛˆJKŠ^Ü™]\›ˆ‹œÛÛYJO™O›‹	‰™O‹
Û‹É‰›‹I‰‹JÛ‹š
_Y[˜İ[ÛˆšJK
^Ü™]\›ˆØš™Xİ™œ›ÛQ[šY\ÊË‹‹›™]ÈÙ]
JWK™š[\Š›ÛÛX[ŠK›X\
OO–ÙKJJ_Y[˜İ[ÛˆZJKŠ^Û]]™š[\ŠO™K˜Xİ]™UX[Kš[˜ÛY\Ê
_K™›YÜÖØ\™\‹IİK\Û™Ø_K™›YÜÖØ\™\‹IİKY›[šŞXJNÜ™]\›ˆØš™Xİ™œ›ÛQ[šY\Ê‹›X\
OO–ÙK—JJ_Y[˜İ[ÛˆJK‹‹J^ÙK™š[İ[OXÌMŒ™ŒÎK™š[™Xİ
ŠKK™š[İ[OXÍÌL™XK™š[™Xİ
ÌŠ‹KLM
KK™š[İ[OXÙ™™ŒXÍK™›ÛXÌN\Ş\İ[K]ZXK™š[^
]Y\ˆX[H	Ü‹œ[›™\ŸKÍ0­ÈÙYÛ™\ˆ	ÓX]›Z[Š‹›ÜÛ™[
KÑš^Y
J_KÍ0­È™Z\ˆ	Ü‹›Z\İZÙ\ßH0­ÈÙ\šYH	Ü‹œİ™XZßXÌ
NÙ›ÜŠ]Lİİ
ÏLJYK™š[İ[O]‹œ[›™\ØÍÎXÎNL˜OO\‹œ[›™\ØÙM˜MX˜ÎLMK˜™YÚ[”]

KK˜\˜ÊŒJİ
ŒMKLKÌX]”JŒŠKK™š[

KK™š[İ[OXÙ™™˜K™›ÛXÌLÜŞ\İ[K]ZXK™š[^
ZVÜ‹›[™]\İWOÏÜ‹›[™]\İKN
İ
ŒMKMÍJNÚYŠ‹œ\ÙOOOXXÙX‹œ\ÙOOOX›\
^Û]OQJ‹›[™]\Ü‹œ[›™\—JKÏZK™›YÜÖØ\ÜÚ\İY›\YYÙXOËŒM‹ŒNÙK™š[İ[OX™Ø˜JLMËNNMŒŒŠXK™š[™Xİ

K[ÊJŠ‹KÊŒŠN
_[]O\‹˜İ\
Ï\‹˜İ\J›ÙKœØ]™J
KK˜[œÛ]JKÊKKœ›İ]J‹œ›İ][ÛŠKK™š[İ[OXÙLÍØK˜™YÚ[”]

KK›[İ™UÊLMN
KK›[™UÊMN
KK›[™UÊŒ‹
KK›[™UÊLŒ‹
KK˜ÛÜÙT]

KK™š[

K‹œ\ÙOOOXš[šØ	‰ŠK™š[İ[OXÙM˜ÌL˜K™š[™Xİ
LŒMX]›X^
Šœ‹›\]ZY
JJKKœ™\İÜ™J
KK™š[İ[OXÙÌM™˜K™š[™Xİ

‹ŒÌ‹Š‹‹
‹ŒÎKJ_Y[˜İ[ÛˆšJK‹‹J^ÙK™š[İ[OXÌMÌLÍØK™š[™Xİ
ŠKK™š[İ[OXÍØÌØŒÌXÚJKLLLLŒŒ‹LL
KK™š[

KKœİ›ÚÙTİ[OXÙNXŒK›[™UÚYMKKœİ›ÚÙJ
NÙ›ÜŠ]HÙˆ‹˜İ\ÊZK˜Xİ]™I‰ŠK™š[İ[OXÙÍNXK˜™YÚ[”]

KK˜\˜ÊK
KJ›‹ŒKX]”JŒŠKK™š[

KKœİ›ÚÙTİ[OXÙ™™Œ™K›[™UÚYLËKœİ›ÚÙJ
JNÚYŠK™›YÜÖØ\ÜÚ\İ\™XÚ\Ú[Û˜I‰œ‹˜Z™XİÜOË›[™İ
^ÙK™š[İ[OX™Ø˜JLNŒM‹NL‹MJXÙ›ÜŠ]HÙˆ‹˜Z™XİÜK™š[\Š
K
OO	LOL
JYK˜™YÚ[”]

KK˜\˜ÊK
KJ›‹X]”JŒŠKK™š[

_[]O\‹˜˜[ÏŞŞ‹KN‹NÙK™š[İ[OXÙYŒXK˜™YÚ[”]

KK˜\˜ÊK
KJ›‹LX]”JŒŠKK™š[

K‹™˜YÔİ\	‰œ‹™˜YÓ›İÉ‰ŠKœİ›ÚÙTİ[OXÍÍ™ÌK›[™UÚYMK˜™YÚ[”]

KK›[İ™UÊ‹™˜YÔİ\
‹™˜YÔİ\J›ŠKK›[™UÊ‹™˜YÓ›İË
‹™˜YÓ›İËJ›ŠKKœİ›ÚÙJ
JKK™š[İ[OXÙ™™ŒXÍK™›ÛXÌNŞ\İ[K]ZXK™š[^
	Ü‹œ™Y[\[ÛØ‘QSTSÓˆ0­È˜U™Y™™\ˆ	Ü‹š]ßKÌL0­ÈÙYÛ™\ˆ	Ü‹›ÜÛ™[]ßKÌL0­È™Zğï™™H	Ü‹›Z\ÜÙ\ßH0­È	Ôİš[™Ê‹›[ÙJKÕ\\Ø\ÙJ
_XÌ
_Y[˜İ[ÛˆšJK‹Š^ÙK™š[İ[OXÍÎXMØYK™š[™Xİ
Š‹
KK™š[İ[OXÙ™˜K™š[™Xİ
Š‹Š‹LŠKK™š[İ[OXÙM™LK™š[™Xİ

‹KŠ‹ÌL
KK™š[İ[OXÙMLXK™š[™Xİ

‹KŠ‹MKÌL
NÙ›ÜŠ]HÙˆ‹›ØœİXÛ\ÊYK™š[İ[OXÍYŒÎXÚJKK
KJ›‹KÊKš
›‹
KK™š[

NÙK™š[İ[OXÙ™™ŒXÍK™›ÛXÌNŞ\İ[K]ZXK™š[^
[™H	Ü‹œ›İ[™H0­ÈZˆ	ÓX]œ›İ[™
‹X[Qš[šÊ_IH0­ÈÙYÛ™\ˆ	ÓX]œ›İ[™
‹™[™[^Qš[šÊ_IH0­È	Ôİš[™Ê‹œ\ÙJKÕ\\Ø\ÙJ
_XÌ
KK™š[İ[OXÙMXNXK˜™YÚ[”]

KK˜\˜Ê‹œ[›™\–
‹œ[›™\–J›‹NX]”JŒŠKK™š[

KK™š[İ[OXÙŒ™YYLK˜™YÚ[”]

KK˜\˜Ê‹™Y™[œÙP˜[
‹™Y™[œÙP˜[J›‹KX]”JŒŠKK™š[

K‹™˜YÔİ\	‰œ‹™˜YÓ›İÉ‰ŠKœİ›ÚÙTİ[OXÌ™X˜K›[™UÚYMKK˜™YÚ[”]

KK›[İ™UÊ‹™˜YÔİ\
‹™˜YÔİ\J›ŠKK›[™UÊ‹™˜YÓ›İË
‹™˜YÓ›İËJ›ŠKKœİ›ÚÙJ
JKZJKK‹MMK
‹ŒÎN‹X[Qš[šËÌLUQTˆÑU°á’Ø
KZJK
‹MË‹MMK
‹ŒÎN‹™[™[^Qš[šËÌLÑQÓ‘T˜
K‹œİÜÚYÛ˜[	‰ŠK™š[İ[OX™Ø˜JŒMËLËLŠXK™›ÛXLÌœŞ\İ[K]ZXK^[YÛXÙ[\˜K™š[^
ÕÔXÌ‹‹ÌŠKK^[YÛXY
_Y[˜İ[ÛˆšJK‹Š^ÙK™š[İ[OXÌŒYK™š[™Xİ
ŠKK™š[İ[OXÌ™˜MK™š[™Xİ
ÌMÌLMMÌ
NÙ›ÜŠ]NÛMÌÛŠÏLÎ
YK™š[İ[O[‰MÍØÌÎMØX˜Ì˜ŒLØ˜K˜™YÚ[”]

KK˜\˜Ê‹MÍKX]”JŒŠKK™š[

NÛ]OVËŒËKÍNÙ›ÜŠ]LÛÎÛŠÏLJYKœİ›ÚÙTİ[O[OO\‹œÜİØÙŒÍÍX˜˜™Ø˜JMKMKMKŒÍJXK›[™UÚYMKœİ›ÚÙT™Xİ
VÛ—JMMKŒLLLMJKK™š[İ[OXÙ™™ŒXÍK™›ÛXÌLœŞ\İ[K]ZXK™š[^
ØRQQ˜‘SVÛ—KVÛ—JLNÌJNÛ]O\‹›ØœÙ\™\JÏ\‹›ØœÙ\™\ŠÚYŠK™š[İ[OX™Ø˜JŒÎKNMËLËŒN
XK˜™YÚ[”]

KK›[İ™UÊKJKK›[™UÊKLLLŒÌ
KK›[™UÊJÌLLŒÌ
KK™š[

KK™š[İ[OX™Ø˜JLMËNKŒLŒMJXK˜™YÚ[”]

KK›[İ™UÊËLL
KK›[™UÊËNLJKK›[™UÊÊÎLJKK™š[

KK™š[İ[OXÙMXK™š[™Xİ
KLL‹MKŠKK™š[İ[OXÍÍ˜NXÌK™š[™Xİ
ËLL‹ŠK‹œ\ÙOOOXXİ]™X
^Û]ZVÜ‹œÜİNÙKœİ›ÚÙTİ[O\‹˜Ø]YÚ›\ÚŒØÙYÌYX˜ÙMÙXØK›[™UÚYMKK˜™YÚ[”]

KK›[İ™UÊŠÍL
KKœ]XY˜]XĞİ\™UÊ‹˜Z[JÌ
‹˜Z[JÜ‹Ú[™
JŒÍJKKœİ›ÚÙJ
_UZJKÍKÎ
‹‹N‹œ›ÙÜ™\ÜËÌLT“RPÒT•S‘Ø
KZJK
‹MÎ
‹‹N‹œİ\ÜXÚ[Û‹ÌL‘T‘PÒ
_Y[˜İ[ÛˆšJK‹‹J^ÙK™š[İ[OXÌMÌ˜XK™š[™Xİ
ŠNÛ]OJ‹JOOÙK™š[İ[OXÙLMÙÚJK‹
LLK‹J›‹MÌŒLMŒŠKK™š[

KK™š[İ[OXÎYÌNÚJK‹

ÊOÍN‹MÍJK‹J›‹MMKÌLKM
KK™š[

_NØJ‹›YL
KJ‹œšYÚLJKK™š[İ[OXÙŒYMÍÚJK‹š›Ú[
MŒ‹‹š›Ú[J›‹M‹LL‹JKK™š[

KK™š[İ[OXÍÙL™XK™š[™Xİ
‹š›Ú[

Í‹š›Ú[J›‹M‹MLŠNÛ]ÏJ‹›Y
Ü‹œšYÚ
KÌÙK™š[İ[OXÌÌLŒ˜K˜™YÚ[”]

KK˜\˜ÊÊ
‹›YJÜ‹œšYÚJKÌŠ›‹N
ÌŒŠŠK\‹œÙX[
KX]”JŒŠKK™š[

KKœİ›ÚÙTİ[O\‹œÙX[šOØÎXL˜˜ÙØŒØK›[™UÚYMKKœİ›ÚÙJ
NÛ]ÏLÍJÊMÌ
Jœ‹˜œ™X]ÙK™š[İ[OX™Ø˜JMKKNM‹ŒLŠXK™š[™Xİ
ÍKÌÌMÌ
KK™š[İ[O\‹˜œ™X]‹MI‰œ‹˜œ™X]ØÎXL˜˜ÙMXYK˜™YÚ[”]

KK˜\˜ÊËÌÍX]”JŒŠKK™š[

KZJKÍKÍŒ
‹ŒM‹‹œÙX[P‘PÒS‘Ø
KZJK
‹ŒÍ‹ÍŒ
‹ŒM‹‹œ[ÌLÒT’ÕS‘Ø
KZJK
‹ËÍŒ
‹ŒM‹‹˜ÛİYÚÌLTÕS˜
KK™š[İ[OXÙ™™ŒXÍK™›ÛXÌNŞ\İ[K]ZXK™š[^
YÈ	Ü‹œ›İ[™KÌÈ0­ÈÙ\	Ü‹œØÛÜ™_XÍKÌŠ_Y[˜İ[ÛˆJK‹‹J^ÙK™š[İ[OX™Ø˜JKMKL‹ÌŠXK™š[™Xİ
ŠKK^[YÛXÙ[\˜K™š[İ[OXÙ™™ŒXÍK™›ÛXLÌœŞ\İ[K]ZXK™š[^
‹Ì‹‹Ì‹LMJKK™›ÛXÌNŞ\İ[K]ZXK™š[İ[OXØÎYK™š[^
KÌ‹‹ÌŠÌ
KK^[YÛXYY[˜İ[ÛˆZJK‹‹KKÊ^ÙK™š[İ[OXÌÌMŒLXÚJK‹‹K
KK™š[

KK™š[İ[OXO‹ÎØÙ™MN˜ÍÎXÎNL˜ÚJK
Ì‹ŠÌ‹X]›X^

‹M
J’ÚJKJJKKMŠKK™š[

KK™š[İ[OXÙ™™ŒXÍK™›ÛXÌLŞ\İ[K]ZXK™š[^
Ë‹MŠ_Y[˜İ[ÛˆÚJK‹‹KJ^ÙK˜™YÚ[”]

KKœ›İ[™™Xİ
‹‹KJ_Y[˜İ[ÛˆÚJK‹Š^Ü™]\›ˆX]š\İ
K[‹\Š_Y[˜İ[ÛˆÚJKŠ^Ü™]\›ˆX]›X^
X]›Z[Š‹JJ_Y[˜İ[ÛˆZJJ^Ü™]\›ˆKœ™\XÙJÖÉ‰È—KÙËOOŠÈ‰ˆ˜	˜[\Ø˜	›Øˆ˜	™İØ‰È˜	ˆÌÎNØ	È‰Î˜	œ][İØJVÙWOÏÙJ_Y[˜İ[ÛˆšJK
^Û]YKœ]Y\TÙ[XİÜŠ
NÚYŠ[Š]›İÈ\œ›ÜŠZ\ÜÚ[™ÈZ[šYØ[YH[[Y[ˆ	İX
NÜ™]\›ˆŸ]˜\ˆZOX˜\İZYÙK[X\Û]ŒXO[™]ÈÙ]
ØYÙTYXX\ÛÛXJKšOVŞŞ‹ŒËX™[˜RTˆ•TĞÒ˜]N‹ŒLÌ‹Ûİ™\‹ŸKŞ‹KX™[˜QQ‘HPÒÑX˜]N‹ŒLÛİ™\‹KŞ‹ÍX™[˜UPÒT–‘S˜]N‹ŒLMËÛİ™\‹ÍßWNÙ[˜İ[ÛˆZJK‹Š^Û]OYJİ
›Šœ‹O]Ü™]\›ˆOKMÉ‰ŠOKMËJKKMÊKOKLJKOKŒÉ‰ŠOKŒÊÊŒËZJKOLJKÜÜÚ][ÛœJKŒËMÊK\™Xİ[Û˜__Y[˜İ[Ûˆ	JK‹‹OLJ^Û]OJ‹YJJÜ™]\›ˆOKKŒN	‰˜O\Šš_Y[˜İ[ÛˆXJKKJ^Û]]YKOSX]˜XœÊKK]JKOJK
İ
KÌ‹ÏSX]˜XœÊ
KJİJKÌ‹KMŠNÜ™]\›ˆJKSX]˜XœÊ‹KŒŒJJKŒ‹ZJŒËSX]˜XœÊK[ŠJŒË[ÊŒKËJ_Y[˜İ[ÛˆJK‹Š^Û]OYOMN	‰™ON‰‰K	‰›KL‰‰œL‹OSX]›X^
KSX]˜XœÊÌ‹YJKÌ
NÜ™]\›ÙÛÛÙšKØÛÜ™N“X]›X^
KX]œ›İ[™

İ
ŠÛŠŒ
ØJŒŒ‹\Š‹ŒŒŠJ__]˜\ˆ˜OXÛ\ÜŞØÛÛœİXİÜŠKŠ^ÚYŠ\Ëœ›ÛİYK\Ë›Û“İ]ÛÛYO]\Ë™Ù]ÛÛ^[‹\Ë˜Ø[˜\ÏZJKØ[˜\Ø
K\Ë˜İ]\Ë˜Ø[˜\Ë™Ù]ÛÛ^
™
K]\Ë˜İ
]›İÈ\œ›ÜŠ˜\İZ[šYØ[YHØ[˜\ÈÛÛ^[˜]˜Z[X›K˜
Nİ\Ë]OZJKÙ]K[Z[šK]]WX
K\Ë˜ÛÜOZJKÙ]K[Z[šKXÛÜWX
K\Ëš[ZJKÙ]K[Z[šKZ[X
K\Ë˜Xİ[ÛZJKÙ]K[Z[šKXXİ[Û—X
K\Ëœ™\İ[ZJKÙ]K[Z[šK\™\İ[X
K\Ë˜œšYYš[™ÏZJKÙ]K[Z[šKXœšYYš[™×X
K\Ëœ\ÙSX™[ZJKÙ]K[Z[šK\\ÙWX
K\Ë›]™SX™[ZJKÙ]K[Z[šK[]™WX
K\Ëœ]\ÙP]ÛZJKÙ]K[Z[šK\]\ÙWX
K\Ëš[]ÛZJKÙ]K[Z[šKZ[X
K\Ëœ™]P]ÛZJKÙ]K[Z[šK\™]WX
K\Ëœİ\]ÛYØİ[Y[˜Ü™X]Q[[Y[
]Û˜
K\Ëœİ\]Û‹\OX]Û˜\Ëœİ\]Û‹˜Û\ÜÓ˜[YOXš[X\HZ[šK\İ\˜\İ[Z[šYØ[YK\İ\\Ëœİ\]Û‹^ÛÛ[XÔQSÕT•S˜\Ëœ˜YL\Ë›\İL\Ëœİ]O]›ÚY\Ë˜ÛÛ^]›ÚY\Ë˜Xİ]™TÚ[\]›ÚY\Ëœİ\]Û‹˜Y]™[\İ[™\ŠÛXÚØ

OO\Ë˜™YÚ[Š
JK\Ë˜Xİ[Û‹˜Y]™[\İ[™\ŠÚ[\™İÛ˜OO\Ë˜Xİ[Û‘İÛŠJJK\Ë˜Xİ[Û‹˜Y]™[\İ[™\ŠÚ[\\

OO\Ë˜Xİ[Û•\

JK\Ë˜Xİ[Û‹˜Y]™[\İ[™\ŠÚ[\›X]™X

OO\Ë˜Xİ[Û•\

JK\Ë˜Xİ[Û‹˜Y]™[\İ[™\ŠÚ[\˜Ø[˜Ù[

OO\Ë˜Xİ[Û•\

JKÚ[™İË˜Y]™[\İ[™\ŠÚ[\\

OO\Ë˜Xİ[Û•\

JKÚ[™İË˜Y]™[\İ[™\ŠÙ^YİÛ˜OOÙK˜ÛÙOOOXÜXÙX	‰ˆYKœ™\X]	‰\Ëš\ĞXİ]™J
I‰ŠKœ™]™[Y˜][

K\Ë˜Xİ[Û‘İÛŠJJ_JKÚ[™İË˜Y]™[\İ[™\ŠÙ^]\OOÙK˜ÛÙOOOXÜXÙX	‰\Ëš\ĞXİ]™J
I‰\Ë˜Xİ[Û•\

_JK\Ëœ]\ÙP]Û‹˜Y]™[\İ[™\ŠÛXÚØ

OOİ\Ëš\ĞXİ]™J
I‰\ËÙÙÛT]\ÙJ
_JK\Ëš[]Û‹˜Y]™[\İ[™\ŠÛXÚØ

OOİ\Ëš\ĞXİ]™J
I‰\ËÙÙÛR[

_JK\Ëœ™]P]Û‹˜Y]™[\İ[™\ŠÛXÚØ

OOİ\Ëœİ]OËšY	‰\Ëœİ\
\Ëœİ]KšY
_JK\Ë˜Ø[˜\Ë˜Y]™[\İ[™\ŠÚ[\™İÛ˜OO\ËœÚ[\‘İÛŠJJK\Ë˜Ø[˜\Ë˜Y]™[\İ[™\ŠÚ[\›[İ™XOO\ËœÚ[\“[İ™JJJK\Ë˜Ø[˜\Ë˜Y]™[\İ[™\ŠÚ[\\OO\ËœÚ[\•\
JJK\Ë˜Ø[˜\Ë˜Y]™[\İ[™\ŠÚ[\˜Ø[˜Ù[OO\ËœÚ[\•\
JJ_\İ\
J^ÚYŠVKš\ÊJJ\™]\›İ\ËœİÜ
LJK\Ë˜ÛÛ^]\Ë™Ù]ÛÛ^
JNÛ]XXJ\Ë˜ÛÛ^
Nİ\Ëœİ]OYOOOXYÙTYXÜ˜J
NšXJ
K\Ëœ›ÛİšY[HLK\Ëœ›Ûİ™]\Ù]›Z[šQØ[YOYK\Ëœ›Ûİ™]\Ù]™˜\İZ[šYØ[YU™\œÚ[ÛVZK\Ëœ›Ûİ˜Û\ÜÓ\İÙÙÛJYÙKY˜\İ\™XZ[XXİ]™XOOOXYÙTYX
K\Ëœ›Ûİ˜Û\ÜÓ\İÙÙÛJX\ÛY˜\İ\™XZ[XXİ]™XOOOXX\ÛÛX
K\Ë˜Ø[˜\ËÚYNL\Ë˜Ø[˜\ËšZYÚMÌ\Ëœ™\İ[šY[HL\Ëœ™\İ[^ÛÛ[X\Ëœ™]P]Û‹šY[HL\Ëœ]\ÙP]Û‹™\ØX›YHL\Ëœ]\ÙP]Û‹^ÛÛ[X]\ÙX\Ë˜Xİ[Û‹™\ØX›YHL\ËœÙ]\ÛÜJJK\Ëœ™[™\œšYYš[™ÊJK\ËœŞ[˜Ô]›ÛÜÜÊ
K\Ë›\İ\\™›Ü›X[˜ÙK››İÊ
K\Ëœ˜Y\™\]Y\İ[š[X][Û‘œ˜[YJOO\ËXÚÊJJ_\İÜ
OHL
^ØØ[˜Ù[[š[X][Û‘œ˜[YJ\Ëœ˜YŠK\Ëœ˜YL\Ë˜Xİ]™TÚ[\]›ÚY\Ëœİ]O]›ÚY\Ë˜ÛÛ^]›ÚY\Ëœİ\]Û‹œ™[[İ™J
K\Ëœ›Ûİ˜Û\ÜÓ\İœ™[[İ™JYÙKY˜\İ\™XZ[XXİ]™XX\ÛY˜\İ\™XZ[XXİ]™X
K[]H\Ëœ›Ûİ™]\Ù]™˜\İZ[šYØ[YU™\œÚ[ÛÙ›ÜŠ]HÙ–ØKZYÙKYİ[™[K^KZYÙKYİ[™[KY\˜KZYÙK][K^KZYÙK][KY\˜J]\Ëœ›Ûİœİ[Kœ™[[İ™T›Ü\JJNÙØİ[Y[˜›ÙK˜Û\ÜÓ\İœ™[[İ™JZ[šYØ[YK\]\ÙY
KI‰Š\Ëœ›ÛİšY[HL
_Z\ĞXİ]™J
^Ü™]\›ˆHJ\Ëœİ]I‰–Kš\Ê\Ëœ›Ûİ™]\Ù]›Z[šQØ[YJI‰\Ëœ›Ûİ™]\Ù]™˜\İZ[šYØ[YU™\œÚ[ÛOOVZJ_YXYÔÚÚ\Ûİ[İÛŠ
^İ\Ëœİ]I‰Š\Ëœİ]K˜Ûİ[İÛL
_YXYÔÙ]İ]JJ^İ\Ëœİ]I‰“Øš™Xİ˜\ÜÚYÛŠ\Ëœİ]KJ_YXYĞXİ[ÛŠ
^ÚYŠ\Ëœİ]J^ÚYŠ\Ëœİ]KšYOOXYÙTYX
^İ\Ëœİ]KšÛ[™ÏH]\Ëœİ]KšÛ[™ÎÜ™]\›Ÿ]\Ëœİ]Kœ\ÙOOOX[Z[™Øİ\Ë˜Xİ[Û‘İÛŠ
N\Ëœİ]Kœ\ÙOOOX[	‰\Ë˜Xİ[Û•\

__YXYÔÛ˜\Úİ

^Ü™]\›ˆ\Ëœİ]OŞË‹‹œİXİ\™YÛÛ™J\Ëœİ]JK™\œÚ[Û–ZKXİ]™N\Ëš\ĞXİ]™J
K›ÔÜİYÚÎ\Ëœİ]KšYOOXYÙTYXÚYÚÛÛ™\Õš\ÚX›N\Ëœİ]KšYOOXYÙTYX	‰™Øİ[Y[œ]Y\TÙ[XİÜ[
™Ü˜\XÜË]ŒË]š\Ú[Û‹XÛÛ™X
K›[™İLŸNß_\Ù]\ÛÜJJ^ÙOOOXYÙTYXÊ\Ë]K^ÛÛ[X[ˆYHXÚÙH0­È›XÚÚÙYÙ[\Ù[ˆ[™™\YØ\Ë˜ÛÜK^ÛÛ[Xİ[™[H[™[HÚ[™YHZ[šYÙ[ˆ]›İZ[[‹ˆÙZ[™HXœİ˜Zİ[ˆØÚZ[Ù\™™\ˆYZˆZ™HÚXÚ˜\™[ˆ›XÚÚÙYÙ[[Ü™XÚ[ˆ\ˆ]ğéÚXÚ[ˆÙY˜Z‹˜\Ëš[^ÛÛ[XXÚİ[™È[\[‹ˆ[[‹ÛÛ[™ÙHÙZ[ˆ›XÚÚÙYÙ[Z[™Hİ[H\™˜\ÜİÈ™ZHÙY˜ZˆÛÙ›ÜÜÛ\ÜÙ[‹˜\Ë˜Xİ[Û‹^ÛÛ[XSSˆ”•S”ÑS˜
NŠ\Ë]K^ÛÛ[XÛÛ[H[œÈØÚ0­ÈX™XÚ[‹[Z[™ËÜÛ\ÜÙ[˜\Ë˜ÛÜK^ÛÛ[XÙZHİ\™H[™[ˆ0é™H[ˆYHX\šÚY\[™Ù[ˆ°ï™[‹\ÈØÚİ\ˆİXš[\ÚY\™[ˆ[™[ˆYÈ[HÜ°ï™[ˆ][Y™[œİ\ˆÛÛ›ÛY\™[‹˜\Ëš[^ÛÛ[X0é™H]\ÜšXÚ[‹ˆÛØ˜[YHX™XÚ[™ÈZ[œ˜\İ][HÜ°ï™[ˆ™[œİ\ˆ[[ˆ[™[HÛÛ[™[ˆÚ\šİ[™ÜØ™\™ZXÚÜÛ\ÜÙ[‹˜\Ë˜Xİ[Û‹^ÛÛ[X0á‘HUTÔ’PÒS˜
_\™[™\œšYYš[™ÊJ^İ\Ë˜œšYYš[™ËšY[HLNÛ]YOOOXYÙTYXİ\Ë˜œšYYš[™Ëš[›™\’S]Ø\XÛOÜ[”ĞÒ‘SHÕPST•S‘OÜÜ[Ï‘\›ZXÚ\[™ÈØÚY™™[‹Ú™H[ˆİ[™[\ÈÙ\ˆ[\È›XÚÚÙYÙ[HÙ\˜][‹ÚÏ]ˆÛ\ÜÏH›Z[šKXœšYYš[™ËYÜšYÙXİ[Û”ÕUQT•S‘ÏØOŒOÚO‘Z[™H\ˆ™ZHXÚİ[™Ù[ˆ[\[‹ÜOŒÚORÕSÓˆ[[‹[H›ÜØÚš]]YX˜]Y[‹ÜOŒÏÚO“ÜÛ\ÜÙ[‹ÛØ˜[Z[ˆÚXÚ˜\™\ˆ›XÚÚÙYÙ[YHİ[H\œ™ZXÚÜÜÙXİ[ÛÙXİ[Û•STÏØ‘Z[™HØ]X™\™H[™H]Y\[™ÙY°éˆHš\ÈMÙZİ[™[‹Ü•ÒPÒQÏØ“\ˆYHšYİ\™[ˆ[™Z™H›XÚÚÙYÙ[°é[‹ˆ\ÈÚXÙZ[™H\ğé›XÚ[ˆØÚZ[Ù\™™\‹ÜÜÙXİ[ÛÙ]Ø\XÛO˜˜\XÛOÜ[–•ÑRHÕT–‘H°çÑOÜÜ[Ï‘\œİX™XÚ[‹[›ˆ[HšXÚYÙ[ˆ[ÛY[Ú\šİ[™È\™]YÙ[‹ÚÏ]ˆÛ\ÜÏH›Z[šKXœšYYš[™ËYÜšYÙXİ[Û”ÕUQT•S‘ÏØOŒOÚO“[šÙH[™™XÚH[™[ˆYHšY[X\šÚY\[™Ù[ˆšYZ[‹ÜOŒÚO“˜XÚ[HZ[œ˜\İ[ˆ[HÜ°ï™[ˆ][Y™[œİ\ˆRÕSÓˆ[[‹ÜOŒÏÚO’[HÛÛ[™[ˆÚ\šİ[™ÜØ™\™ZXÚÜÛ\ÜÙ[‹™]›Üˆ\ˆ\İ[ˆİZYİÜÜÙXİ[ÛÙXİ[Û•STÏØ“\ˆÙZH[™[‹YZ\İ]]XÚ[\ˆŒÙZİ[™[‹Ü•ÑT•S‘ÏØX™XÚ[™Ëİ\™Z][šİ[™™XÚ™Z]YÙ\ÈÜÛ\ÜÙ[ˆ°é[ˆÙ[YZ[œØ[KÜÜÙXİ[ÛÙ]Ø\XÛO˜\Ë˜œšYYš[™Ëœ]Y\TÙ[XİÜŠ\XÛX
OË˜\[™
\Ëœİ\]ÛŠ_X™YÚ[Š
^È]\Ëœİ]_\Ëœİ]Kœ[›š[™ß
\Ë˜œšYYš[™ËšY[HL\Ëœİ]Kœ[›š[™ÏHL\Ëœİ]Kœ]\ÙYHLK\Ëœİ]K˜Ûİ[İÛLLŒ\Ëœ]\ÙP]Û‹™\ØX›YHLK\Ë˜Xİ[Û‹™\ØX›Y]\Ëœİ]KšYOOXX\ÛÛX\ËœÙ]™YY˜XÚÊÕT•\Ëœİ]KšYOOXYÙTYXØXÚİ[™Èğé[˜˜0é™H]\ÜšXÚ[˜™]]˜[
J_]ÙÙÛT]\ÙJ
^È]\Ëœİ]OËœ[›š[™ß\Ëœİ]Kœ\ÙOOOXš[š\ÚY
\Ëœİ]Kœ]\ÙYH]\Ëœİ]Kœ]\ÙY\Ëœ]\ÙP]Û‹^ÛÛ[]\Ëœİ]Kœ]\ÙYØ›ÜÙ]™[˜˜]\ÙXØİ[Y[˜›ÙK˜Û\ÜÓ\İÙÙÛJZ[šYØ[YK\]\ÙY\Ëœİ]Kœ]\ÙY
J_]ÙÙÛR[

^ÚYŠ]\Ëœİ]J\™]\›Û]O]\Ë˜œšYYš[™ËšY[İ\Ë˜œšYYš[™ËšY[HYKI‰\Ëœİ]Kœ[›š[™É‰Š\Ëœİ]Kœ]\ÙYHL\Ëœ]\ÙP]Û‹^ÛÛ[X›ÜÙ]™[˜Øİ[Y[˜›ÙK˜Û\ÜÓ\İ˜Y
Z[šYØ[YK\]\ÙY
J_XXİ[Û‘İÛŠJ^ÚYŠ]\Ëš[œ][İÙY

J\™]\›ÙOËœ™]™[Y˜][ËŠ
NÛ]]\Ëœİ]NÚYŠšYOOXYÙTYX
^İœ\ÙOOOXXİ]™X	‰ŠšÛ[™ÏHL
NÜ™]\›Ÿ]œ\ÙOOOX[Z[™Ø	‰Š˜œ™X]K	‰˜œ™X]KÎOÊœ\ÙOX[šÛ[™ÏHLœ[Lœš]U[YOLœ[[YOL\Ë˜Xİ[Û‹^ÛÛ[XSSˆ0­ÈSHÓÓS‘Sˆ‘T‘RPÒÔÓTÔÑS˜\ËœÙ]™YY˜XÚÊ•QÈÕT•UÚ\šİ[™È]Y˜˜]Y[ˆ[™™XÚ™Z]YÈÜÛ\ÜÙ[˜ÛÛÙ
JNŠ›Z\İZÙ\ÊÏLK˜ÛİYÚSX]›Z[ŠL˜ÛİYÚ
ÌL
K\ËœÙ]™YY˜XÚÊSĞÒTˆSÓQS•]Yˆ\ÈÜ°ï™H][Y™[œİ\ˆØ\[˜˜Y
JJ_XXİ[Û•\

^Û]O]\Ëœİ]NÚYŠJ^ÚYŠKšYOOXYÙTYX
^ÙKšÛ[™ÏHLNÜ™]\›ŸYKœ\ÙOOOX[	‰™KšÛ[™É‰ŠKšÛ[™ÏHLK\Ë˜ÛÛ\]SX\Û›İ[™

J__\Ú[\‘İÛŠJ^ÚYŠ]\Ëš[œ][İÙY

J\™]\›Û]]\ËœÚ[
JK]\Ëœİ]NÚYŠKœ™]™[Y˜][

K‹šYOOXYÙTYX
^Û‹œ\ÙOOOXÚÛÜÙX	‰\Ë˜ÚÛÜÙTÜİ

NÜ™]\›ŸZYŠ‹œ\ÙHOOXÙX[
\™]\›Û]Y˜J‹›Y
KOY˜J‹œšYÚ
Nİ\Ë˜Xİ]™TÚ[\YKœÚ[\’Y‹˜Xİ]™R[™\ZOØY˜šYÚ\Ë˜Ø[˜\ËœÙ]Ú[\Ø\\™OËŠKœÚ[\’Y
K\Ë›[İ™R[™

_\Ú[\“[İ™JJ^È]\Ëš[œ][İÙY

_KœÚ[\’YOO]\Ë˜Xİ]™TÚ[\Ÿ\Ëœİ]OËšYOOXX\ÛÛX\Ëœİ]Kœ\ÙHOOXÙX[\Ë›[İ™R[™
\ËœÚ[
JJ_\Ú[\•\
J^ÙKœÚ[\’YOO]\Ë˜Xİ]™TÚ[\‰‰Š\Ë˜Xİ]™TÚ[\]›ÚY
_XÚÛÜÙTÜİ
J^Û]]\Ëœİ]KYOŒÍÌ™O‹OÌŒNİœÜİ[‹œ\ÙOXXİ]™X\Ë˜Xİ[Û‹™\ØX›YHLK\Ë˜Xİ[Û‹^ÛÛ[XSSˆ”•S”ÑS˜\Ëš[^ÛÛ[X	ÖšVÛ—K›X™[Nˆ[[‹›XÚÚÙYÙ[™[Ø˜XÚ[‹™ZHÙY˜ZˆÜÛ\ÜÙ[‹˜\ËœÙ]™YY˜XÚÊPÒÕS‘ÈÑUğášVÛ—K›X™[™]]˜[
_[[İ™R[™
J^Û]]\Ëœİ]K]˜Xİ]™R[™İÛ—O^ŞœJKOOXYËŒN‹LKOOXYËN‹ŠKNœJKKŒÎKÌJ__]XÚÊJ^ÚYŠ]\Ëœİ]J\™]\›Û]SX]›Z[ŠKK]\Ë›\İMŠNİ\Ë›\İYK\Ëœİ]Kœ[›š[™É‰ˆ]\Ëœİ]Kœ]\ÙY	‰Š\Ëœİ]K˜Ûİ[İÛŒÊ\Ëœİ]K˜Ûİ[İÛSX]›X^
\Ëœİ]K˜Ûİ[İÛ‹]
K\Ë\]S]™JÕT•\Ëœİ]K˜Ûİ[İÛŒÔİš[™ÊX]˜ÙZ[
\Ëœİ]K˜Ûİ[İÛ‹ÌYLÊJN˜ÔØK]\Ëœİ]K˜Ûİ[İÛ‹ÌLŒ
JN\Ëœİ]KšYOOXYÙTYXİ\ËXÚÒYÙJ
N\ËXÚÓX\Û
JJK\Ë™˜]Ê
K\Ëœ˜Y\™\]Y\İ[š[X][Û‘œ˜[YJOO\ËXÚÊJJ_]XÚÒYÙJJ^Û]]\Ëœİ]KTZJ™İ[™[K™İ[™[Q\‹MYKMŠ™Y™šXİ[KJKTZJ[K[Q\‹LL™KMŠ™Y™šXİ[KJNÚYŠ™İ[™[O[‹œÜÚ][Û‹™İ[™[Q\[‹™\™Xİ[Û‹[O\‹œÜÚ][Û‹[Q\\‹™\™Xİ[Û‹\ËœŞ[˜Ô]›ÛÜÜÊ
Kœ\ÙHOOXXİ]™X
^İ\Ë\]S]™JPÒÕS‘Øİ[H[\[˜
NÜ™]\›Ÿ[]OVšVİœÜİKOIJ™İ[™[K™İ[™[Q\‹KŒMKK˜Ûİ™\ŠKÏIJ[K[Q\‹KŒŒMKX]›Z[ŠKK˜Ûİ™\ŠËŒ
JNÚYŠØ]ÚYX_ËØ]ÚYOVØOØİ[™[X˜ÏØ[X˜K™š[\Š›ÛÛX[ŠKš›Ú[Š
È
KšÛ[™ÏÊœ›ÙÜ™\ÜÏSX]›Z[ŠLœ›ÙÜ™\ÜÊÙJšKœ˜]Kİ™Y™šXİ[JKØ]ÚYÊœİ\ÜXÚ[ÛSX]›Z[ŠLœİ\ÜXÚ[ÛŠÙJ‹ŒŒJŠKŒKZK˜Ûİ™\ŠJ™Y™šXİ[JK™[™Ù\‘›\ÚLNØ\›š[™ĞÛÛÛİÛL	‰Š›™X\“Z\ÜÙ\ÊÏLKØ\›š[™ĞÛÛÛİÛMŒ\ËœÙ]™YY˜XÚÊ“PÒÒÑQÑSX	İØ]ÚY_HÚYZ[ˆZ[™HšXÚ[™È0­ÈÜÛ\ÜÙ[˜Ø\›š[™Ø
JJNœİ\ÜXÚ[ÛSX]›X^
œİ\ÜXÚ[Û‹YJ‹Œ
JNœİ\ÜXÚ[ÛSX]›X^
œİ\ÜXÚ[Û‹YJ‹ŒLÊKØ\›š[™ĞÛÛÛİÛSX]›X^
Ø\›š[™ĞÛÛÛİÛ‹YJK™[™Ù\‘›\ÚSX]›X^
™[™Ù\‘›\ÚYJK\Ë\]S]™JØ]ÚYØÒPÒˆ	İØ]ÚYKÕ\\Ø\ÙJ
_X˜S‘ÑTÕ0å”•šÛ[™ÏØ\›ZXÚ\[™È0éY˜Ø\[ˆÈ™\™XÚÚ[šİœ›ÙÜ™\ÜËÌL
Kœİ\ÜXÚ[ÛLL
^İ\Ë™š[š\Ú
ÚY˜YÙTYXİXØÙ\ÜÎˆLKØÛÜ™N“X]›X^
X]œ›İ[™
œ›ÙÜ™\ÜË]›™X\“Z\ÜÙ\ÊJJK]X[]N˜˜Z[Y^˜İ[™[H[™[Hœ˜]XÚ[ˆÙZ[™HØÚZ[Ù\™™\ˆ\ˆ\™ZİH›XÚÚÛÛZİ™ZXÚ°ïˆZ[ˆ›Ûİ0é™YÙ\ÈXÚÙ[œ›İÚÛÛ˜İ\ÜXÚ[ÛŒÌ‹™[YYŠÊœ›ÙÜ™\ÜÏMÌ
K™YYÎØ›Y\‹SX]œ›İ[™
œ›ÙÜ™\ÜÊKÛİ\˜YÙN‹NKY]šXÜÎÙYÛš]N‹MËÚ[ÜÎ_K™[][ÛœÚ\ÎÙİ[™[N‹MK[N‹MK›YÜÎÚYÙPØ]YÚˆL_JNÜ™]\›ŸZYŠœ›ÙÜ™\ÜÏLL
^Û]O]œİ\ÜXÚ[ÛL	‰›™X\“Z\ÜÙ\ÏLKYOØ\™™Xİœİ\ÜXÚ[ÛOØÛÛY˜Y\ÜŞXİ\Ë™š[š\Ú
ÚY˜YÙTYXİXØÙ\ÜÎˆLØÛÜ™N“X]œ›İ[™
LŒ]œİ\ÜXÚ[Û‹]›™X\“Z\ÜÙ\Ê
K]X[]N›‹^™OØİ\‹Ø]X™\ˆ[™]pçÙ\š[ˆ™ZY\ˆ›XÚÚÙYÙ[ˆYHXÚÙH›ZXÛ]Xğï™YÈZ[™ÜÛÜË˜˜\›YYİˆİ[™[H[™[HØ\™[ˆ˜ZX™\ˆšXÚ˜ZÙ[YÈ°ïˆZ[™H™[\İ˜\™HÚXÚ[™Ë˜İ\ÜXÚ[Û“X]œ›İ[™
œİ\ÜXÚ[ÛŠ‹ŒŠK™[YYŒK™YYÎØ›Y\‹LLÛİ\˜YÙN_KY]šXÜÎÙYÛš]N™OÌŒÚ[ÜÎŠÈY_K›YÜÎ™OŞÚYÙT\™™XİˆLN›ÚYJ__]XÚÓX\Û
K
^Û]]\Ëœİ]NÚYŠ‹˜œ™X]JX]œÚ[ŠÌÌÌ
JÌJKÌ‹‹œ\ÙOOOXÙX[
^Û‹œÙX[YXJ‹›Y‹œšYÚ‹\™Ù]
K‹œÙX[[‹œÙX[™\ÚÛÛ‹œİX›U[YJÏYN›‹œİX›U[YOSX]›X^
‹œİX›U[YKYJŒK
K\Ë\]S]™JP‘PÒS‘È	ÓX]œ›İ[™
‹œÙX[
ŒL
_IX‹œİX›U[YOLŒØZ[™Ù\˜\İ]˜0é™H[ˆYHšY[š[™ÙH°ï™[˜‹œÙX[
K‹œİX›U[YOLŒ	‰Š‹œ\ÙOX[Z[™Ø‹›ØÚÙYÙX[[‹œÙX[\Ë˜Xİ[Û‹™\ØX›YHLK\Ë˜Xİ[Û‹^ÛÛ[XSHÔ°ç‘Sˆ‘S”ÕTˆSS˜\Ëš[^ÛÛ[X\ˆ][[X\šÙ\ˆ™]ÙYİÚXÚØÚ™[ˆ[HÜ°ï™[ˆ™\™ZXÚ[[‹[HÛÛ[™[ˆÚ\šİ[™ÜØ™\™ZXÚÜÛ\ÜÙ[‹˜\ËœÙ]™YY˜XÚÊP‘PÒS‘ÈÒU•™]][Y™[œİ\ˆ™Y™™[˜ÛÛÙ
JNÜ™]\›ŸZYŠ‹œ\ÙOOOX[Z[™Ø
^İ\Ë\]S]™J•QÈ	Û‹œ›İ[™KÌ˜‹˜œ™X]K	‰›‹˜œ™X]KÎOØÔ°ç‘TÈ‘S”ÕTˆ0­È™][[˜˜]YˆÜ°ïˆØ\[˜
NÜ™]\›Ÿ[‹œ\ÙOOOX[	‰›‹šÛ[™É‰Š‹œ[[YJÏYK‹œ[SX]›Z[ŠL‹œ[
ÙJ‹ŒNMJ›‹›ØÚÙYÙX[Û‹™Y™šXİ[JK‹˜œ™X]KŒÍ	‰›‹˜œ™X]KÛ‹œš]U[YJÏYN›‹˜ÛİYÚSX]›Z[ŠL‹˜ÛİYÚ
ÙJ‹ŒÊK‹œ[É‰Š‹˜ÛİYÚSX]›Z[ŠL‹˜ÛİYÚ
ÙJ‹ŒŒŠJK\Ë\]S]™J•QÈ	Û‹œ›İ[™KÌ˜‹œ[MN	‰›‹œ[NØÓÓS‘Tˆ‘T‘RPÒ0­ÈÜÛ\ÜÙ[˜›‹œ[NØÚ\šİ[™È]Y˜˜]Y[˜˜H[™È0­ÈÜÛ\ÜÙ[ˆX‹œ[ÌL
K
‹œ[LL‹˜ÛİYÚLL
I‰Š‹šÛ[™ÏHLK\Ë˜ÛÛ\]SX\Û›İ[™

JJ_XÛÛ\]SX\Û›İ[™

^Û]O]\Ëœİ]KYKœ[[YOŒÙKœš]U[YKÙKœ[[YNŒ]JKœ[K›ØÚÙYÙX[K˜ÛİYÚ
NÚYŠKœØÛÜ™JÏ[‹œØÛÜ™K‹™ÛÛÙ
K›Z\İZÙ\ÊÏLKK˜ÛİYÚSX]›Z[ŠLK˜ÛİYÚ
ÌM
JK\ËœÙ]™YY˜XÚÊ‹™ÛÛÙØĞUP‘T‘Tˆ•QØ˜TÕSˆÈ•H”°ç	Û‹œØÛÜ™_H[šİX‹™ÛÛÙØÛÛÙ˜˜Y
KKœ›İ[™LŠ^Û]YKœØÛÜ™OLL]	‰™KœØÛÜ™OLNI‰™K›Z\İZÙ\ÏLOØ\™™XİØÛÛY™KœØÛÜ™ONLØY\ÜŞX˜˜Z[Yİ\Ë™š[š\Ú
ÚY˜X\ÛÛXİXØÙ\ÜÎØÛÜ™N™KœØÛÜ™K]X[]N›‹^›OOX\™™XİØÙZ[X[ØÚ™[X™ÙYXÚ][H][Y™[œİ\ˆÙ\İ\][™^Zİ[HÚ\šİ[™ÜØ™\™ZXÚÙ[0íœİˆX\ÛšXÚİ[™\šÙ[›™[™˜ØYHXÚšZÈ[šİ[ÛšY\™]Ú™H[™ÜÙHÚYY\šÛ[™Ù[ˆÙZHœ˜]XÚ˜\™H°ïÙKÛ\™HÚ\šİ[™Ë™\YË˜˜YHYYHØ\ˆšXÚYËX™\ˆX™XÚ[™ÈÙ\ˆ[Z[™ÈØ\™[ˆ[ˆ™ZY[ˆİ\™[ˆ™\œİXÚ[ˆšXÚİXš[Ù[YË˜™YYÎÚYÚ™\ÜÎÌÎŒN[™\™ŞN‹MKÛİ\˜YÙNÍŒ_KY]šXÜÎÜ™\]][Û›OOX\™™XİÍNÌ‹LK[ÛY[[NÍŒK™[][ÛœÚ\ÎÛX\Û›OOX\™™XİÍNÌÎŒK›YÜÎ›OOX\™™XİŞÛX\ÛXÚš\]YSX\İ\™YˆLN›ÚYJNÜ™]\›ŸYKœ›İ[™
ÏLKØš™Xİ˜\ÜÚYÛŠKÜ\ÙN˜ÙX[YŞ‹ŒËN‹ŒŸKšYÚŞ‹ËN‹K\™Ù]‹JÊKœ›İ[™OOLËŒNŒ
KÙX[ŒØÚÙYÙX[ŒİX›U[YNŒ[Œ[[YNŒš]U[YNŒÛ[™ÎˆLKÛİYÚ“X]›X^
K˜ÛİYÚLLŠ_JK\Ë˜Xİ[Û‹™\ØX›YHL\Ë˜Xİ[Û‹^ÛÛ[X0á‘HUTÔ’PÒS˜\Ëš[^ÛÛ[X]H[™Nˆ0é™H\›™]][ˆYHX\šÚY\[™Ù[ˆšYZ[‹ˆ[˜XÚ\ˆ›ØÚZ[ˆİ\™\ˆ[Z[™ËVYË˜\Ş[˜Ô]›ÛÜÜÊ
^Û]O]\Ëœİ]NÈY_KšYOOXYÙTYX
\Ëœ›Ûİœİ[KœÙ]›Ü\JKZYÙKYİ[™[K^	ÙK™İ[™[JŸIX
K\Ëœ›Ûİœİ[KœÙ]›Ü\JKZYÙKYİ[™[KY\˜İš[™ÊK™İ[™[Q\ŠJK\Ëœ›Ûİœİ[KœÙ]›Ü\JKZYÙK][K^	ÙK[JŸIX
K\Ëœ›Ûİœİ[KœÙ]›Ü\JKZYÙK][KY\˜İš[™ÊK[Q\ŠJJ_Y˜]Ê
^İ\Ëœİ]I‰Š\Ë˜İ˜ÛX\”™Xİ
\Ë˜Ø[˜\ËÚY\Ë˜Ø[˜\ËšZYÚ
K\Ëœİ]KšYOOXYÙTYXÛØJ\Ë˜İ\Ë˜Ø[˜\ËÚY\Ë˜Ø[˜\ËšZYÚ\Ëœİ]JNœØJ\Ë˜İ\Ë˜Ø[˜\ËÚY\Ë˜Ø[˜\ËšZYÚ\Ëœİ]JK\Ëœİ]Kœ]\ÙY	‰\Ëœİ]Kœ[›š[™ÏÛJ\Ë˜İ\Ë˜Ø[˜\ËÚY\Ë˜Ø[˜\ËšZYÚUTÒQT•›ÜÙ]™[ˆ0ï™\ˆYHØÚ[›0éÚX
N\Ëœİ]K˜Ûİ[İÛŒ	‰›J\Ë˜İ\Ë˜Ø[˜\ËÚY\Ë˜Ø[˜\ËšZYÚİš[™ÊX]˜ÙZ[
\Ëœİ]K˜Ûİ[İÛ‹ÌYLÊJK™\™Z]XXÚ[˜
J_Yš[š\Ú
J^ÚYŠ]\Ëœİ]OËœ[›š[™Ê\™]\›İ\Ëœİ]Kœ[›š[™ÏHLK\Ëœİ]Kœ]\ÙYHL\Ëœİ]Kœ\ÙOXš[š\ÚY\Ë˜Xİ[Û‹™\ØX›YHL\Ëœ]\ÙP]Û‹™\ØX›YHL\Ëœ™]P]Û‹šY[HLNÛ]YKœİXØÙ\ÜÏÙKœ]X[]OOOX\™™XİØQÑS‘0á˜™Kœ]X[]OOOXY\ÜŞXØÒSÕTĞÒÑTĞÒQ‘•˜ÑTĞÒQ‘•˜ÑTĞÒRUT•İ\Ëœ™\İ[šY[HLK\Ëœ™\İ[š[›™\’SXİ›Û™Ï‰İOÜİ›Û™Ï‰ÛXJK^
_OÜ]ˆÛ\ÜÏH›Z[šK\™\İ[\İ]ÈÜ[•Ù\‰ÓX]œ›İ[™
KœØÛÜ™J_OØÜÜ[Ü[”]X[]0é‰ÙKœ]X[]_OØÜÜ[Ù]˜\ËœÙ]™YY˜XÚÊÙ\	ÓX]œ›İ[™
KœØÛÜ™J_XKœİXØÙ\ÜÏØÛÛÙ˜˜Y
K\Ë›Û“İ]ÛÛYJJ_]\]S]™JKŠ^İ\Ëœ\ÙSX™[^ÛÛ[YK\Ë›]™SX™[^ÛÛ[]Û]]\Ëœ›Ûİœ]Y\TÙ[XİÜŠ›Z[šK[]™K\›ÙÜ™\ÜÈX
NÜ‰‰Š‹œİ[KÚYX	ÜJ‹JJŒLIX
_\Ù]™YY˜XÚÊKŠ^İ\Ëœ\ÙSX™[^ÛÛ[YK\Ë›]™SX™[^ÛÛ[]Û]]\Ëœ›Ûİœ]Y\TÙ[XİÜŠ›Z[šKY^\šY[˜ÙX
NÜ‰‰Š‹™]\Ù]™™YY˜XÚÏ[‹Ú[™İËœÙ][Y[İ]


OOÜ‹™]\Ù]™™YY˜XÚÏOO[‰‰™[]H‹™]\Ù]™™YY˜XÚßKL
JK\[Ùˆ˜]šYØ]Ü‹šXœ˜]OOX[˜İ[Û˜	‰›˜]šYØ]Ü‹šXœ˜]JOOXÛÛÙÖÌL‹ŒL—N›OOX˜YÖÌÍWN›OOXØ\›š[™ØÖÌM‹MM—N–ÎJ_Z[œ][İÙY

^Ü™]\›ˆHJ\Ëœİ]OËœ[›š[™É‰ˆ]\Ëœİ]Kœ]\ÙY	‰\Ëœİ]K˜Ûİ[İÛL	‰\Ëœİ]Kœ\ÙHOOXš[š\ÚY
_\Ú[
J^Û]]\Ë˜Ø[˜\Ë™Ù]›İ[™[™ĞÛY[™Xİ

NÜ™]\›ŞœJ
K˜ÛY[]›Y
KİÚYJKNœJ
K˜ÛY[K]Ü
KİšZYÚJ___NÙ[˜İ[Ûˆ˜JJ^Ü™]\›ÚY˜YÙTYX[›š[™ÎˆLK]\ÙYˆLÛİ[İÛŒ\ÙN˜ÚÛÜÙXY™šXİ[N™KÜİ‹LKÛ[™ÎˆLK›ÙÜ™\ÜÎŒİ\ÜXÚ[ÛŒİ[™[N‹Œ‹İ[™[Q\ŒK[N‹M[Q\‹LKØ]ÚYˆLKØ]ÚYN˜™X\“Z\ÜÙ\ÎŒØ\›š[™ĞÛÛÛİÛŒ[™Ù\‘›\ÚŒ_Y[˜İ[ÛˆXJJ^Ü™]\›ÚY˜X\ÛÛX[›š[™ÎˆLK]\ÙYˆLÛİ[İÛŒ\ÙN˜ÙX[Y™šXİ[N™K›İ[™ŒKYŞ‹ŒÌKN‹ŒŸKšYÚŞ‹KN‹_KXİ]™R[™˜Y\™Ù]‹KÙX[ŒØÚÙYÙX[ŒÙX[™\ÚÛ‹ÌËİX›U[YNŒœ™X]‹K[Œ[[YNŒš]U[YNŒÛİYÚŒÛ[™ÎˆLKØÛÜ™NŒZ\İZÙ\ÎŒ_Y[˜İ[ÛˆXJJ^Û]YOË˜][\ÏOOLËNŒNÜ™]\›ˆOË˜™\İ]X[]OOOX\™™Xİ	‰Š
ÏKŒJKOË›™YYÏË™[™\™ŞOÌ	‰Š
ÏKŒ
KJKŒJ_Y[˜İ[ÛˆØJK‹Š^ÙK™š[İ[OXÌÌŒLXXK™š[™Xİ
ŠKK™š[İ[OXÌMŒÙ˜XK™š[™Xİ
ÍKMJKK™š[İ[OXÌ™ÌK™š[™Xİ
MKMŒLLLMÍJNÙ›ÜŠ]MNÛMLÛŠÏMŠYK™š[İ[O[‰NØÌÎMÙM˜˜ÌŒLØ˜K˜™YÚ[”]

KK˜\˜Ê‹MKL‹X]”JŒŠKK™š[

NÙK™š[İ[OXØXÎX™K™›ÛXÌMŞ\İ[K]ZXK™š[^
ÕS‘SH
ÈSHU“ÕRSQT‘Sˆ0­È•TˆR‘HÒPÒÑQÑS°áS˜Í
NÙ›ÜŠ]LÛšK›[™İÛŠÏLJ^Û]OVšVÛ—KO\‹œÜİOO[‹ÏXI‰œ‹Ø]ÚYÙK™š[İ[OXOÛÏØ™Ø˜JŒLKÍKŒ
X˜™Ø˜JŒÍËNM‹LËŒŒŠX˜™Ø˜JMKMKMKŒMJXJKK
MNŒMKLM‹LLŠKK™š[

KKœİ›ÚÙTİ[OXOÛÏØÙYÌYX˜ÙYÍY˜™Ø˜JMKMKMKŒ
XK›[™UÚYXOÍNŒËKœİ›ÚÙJ
KK™š[İ[OXÙ™™ŒÌ˜K™›ÛXL\Ş\İ[K]ZXK^[YÛXÙ[\˜K™š[^
K›X™[K
ÌŠKK^[YÛXY\‹œ\ÙOOOXÚÛÜÙXÊK™š[İ[OXÙ™™ŒÌ˜K™›ÛXLŞ\İ[K]ZXK^[YÛXÙ[\˜K™š[^
PÒÕS‘ÈS•TS˜Ì‹LŒ
KK^[YÛXY
Nœ‹Ø]ÚY	‰ŠK™š[İ[O\‹™[™Ù\‘›\ÚŒØÙYÌYX˜ÙNMMXK™›ÛXLœŞ\İ[K]ZXK^[YÛXÙ[\˜K™š[^
	Ü‹Ø]ÚYKÕ\\Ø\ÙJ
_HÒQRT˜Ì‹LŒ
KK^[YÛXY
KXJKÍKÍÍË
‹‹N‹œ›ÙÜ™\ÜËÌLT“RPÒT•S‘Ø
KXJK
‹MÍÍË
‹‹N‹œİ\ÜXÚ[Û‹ÌL‘T‘PÒ
_Y[˜İ[ÛˆØJK‹Š^ÙK™š[İ[OXÌLÌÌK™š[™Xİ
ŠKK™š[İ[OXÌLMÌMXJKMÍKLÍLŒKÍ
KK™š[

NÛ]O^Şœ‹\™Ù]KŒLLKN‹MŸKO^Şœ‹\™Ù]
ËŒLLKN‹MŸNÙ›ÜŠ]ÈÙ–ÚKWJYKœİ›ÚÙTİ[O\‹œ\ÙOOOXÙX[Ø™Ø˜JL‹ŒLKMNKÊX˜™Ø˜JŒÍËNM‹LËŒÍJXK›[™UÚYM‹KœÙ][™Q\Ú
ÌL×JKK˜™YÚ[”]

KK˜\˜ÊË
ËJ›‹‹X]”JŒŠKKœİ›ÚÙJ
KKœÙ][™Q\Ú
×JNØØJK‹›Y
‹›YJ›‹L‹œ\ÙHOOXÙX[
KØJK‹œšYÚ
‹œšYÚJ›‹LK‹œ\ÙHOOXÙX[
NÛ]ÏJ‹›Y
Ü‹œšYÚ
KÌŠÏJ‹›YJÜ‹œšYÚJKÌŠ›ÙK™š[İ[OXÌŒLK˜™YÚ[”]

KK˜\˜ÊËËN
ÊK\‹œÙX[
JŒX]”JŒŠKK™š[

KKœİ›ÚÙTİ[O\‹œÙX[\‹œÙX[™\ÚÛØÍÙYÎY˜˜ÙL™XØK›[™UÚYMKKœİ›ÚÙJ
KK™š[İ[OX™Ø˜JMKMKMKŒ
XJKÌŒ‹LMLŠKK™š[

KK™š[İ[OX™Ø˜JL‹ŒLKMNKŒÌŠXK™š[™Xİ
Ì
ÊLM
J‹Œ‹
LM
J‹ŒÍK
NÛ]ÏMÌ
ÊLM
Jœ‹˜œ™X]ÙK™š[İ[O\‹˜œ™X]K	‰œ‹˜œ™X]KÎOØÍÙYÎY˜˜ÙNMMXK˜™YÚ[”]

KK˜\˜ÊËÍLX]”JŒŠKK™š[

KK™š[İ[OXÙ™™ŒÌ˜K™›ÛXL\Ş\İ[K]ZXK™š[^
USQ‘S”ÕT˜ÌMÊKK™š[İ[OX™Ø˜JŒÍËNM‹LËŒŠXK™š[™Xİ
Ì
ÊLM
J‹NÌÍË
LM
J‹ŒŒ
KXJKÌÌÍËLMŒ‹œ[ÌLÒT’ÕS‘È0­ÈÓÓN8 $Î‰X
KXJKÌÎË
‹ŒÍKMK‹œÙX[P‘PÒS‘Ø
KXJK
‹MËÎË
‹ŒÍKMK‹˜ÛİYÚÌLTÕS˜
KK™š[İ[OXÙ™™ŒÌ˜K™›ÛXLNŞ\İ[K]ZXK™š[^
•QÈ	Ü‹œ›İ[™KÌˆ0­ÈÑT•	Ü‹œØÛÜ™_XÌŠ_Y[˜İ[ÛˆØJK‹‹J^ÙKœØ]™J
KK˜[œÛ]JŠKKœ›İ]JËKŒL‹ŒLŠKK™š[İ[OZOØØÙMÍ˜Ù˜NN˜JKMNLÍ‹LM‹Ì‹Ì
KK™š[

KK™š[İ[OXØMM™M˜JKÌ‹MLŒM‹JKK™š[

KKœ™\İÜ™J
_Y[˜İ[ÛˆJK‹‹J^ÙK™š[İ[OX™Ø˜JKMKL‹ÌŠXK™š[™Xİ
ŠKK^[YÛXÙ[\˜K™š[İ[OXÙ™™ŒXÍK™›ÛXLÌœŞ\İ[K]ZXK™š[^
‹Ì‹‹Ì‹LMJKK™›ÛXÌNŞ\İ[K]ZXK™š[İ[OXØÎYK™š[^
KÌ‹‹ÌŠÌ
KK^[YÛXYY[˜İ[ÛˆXJK‹‹KKÊ^ÙK™š[İ[OXÌÌMŒLXJK‹‹K
KK™š[

KK™š[İ[OXO‹ÎØÙ™MN˜ÍÎXÎNL˜JK
Ì‹ŠÌ‹X]›X^

‹M
JœJKJJKKMŠKK™š[

KK™š[İ[OXÙ™™ŒXÍK™›ÛXÌLŞ\İ[K]ZXK™š[^
Ë‹MŠ_Y[˜İ[ÛˆJK‹‹KJ^ÙK˜™YÚ[”]

KKœ›İ[™™Xİ
‹‹KJ_Y[˜İ[Ûˆ˜JK
^Ü™]\›ˆX]š\İ
K]KK]J_Y[˜İ[ÛˆJKŠ^Ü™]\›ˆX]›X^
X]›Z[Š‹JJ_Y[˜İ[ÛˆXJJ^Ü™]\›ˆİš[™ÊJKœ™\XÙJÖÉ‰È—KÙËOOŠÈ‰ˆ˜	˜[\Ø˜	›Øˆ˜	™İØ‰È˜	ˆÌÎNØ	È‰Î˜	œ][İØJVÙWOÏÙJ_Y[˜İ[ÛˆJK
^Û]YKœ]Y\TÙ[XİÜŠ
NÚYŠ[Š]›İÈ\œ›ÜŠZ\ÜÚ[™È˜\İZ[šYØ[YH[[Y[ˆ	İX
NÜ™]\›ˆŸY[˜İ[ÛˆØJJ^Ü™]\›ˆ_Y[˜İ[ÛˆØJKLJ^Û]YØJJNÜ™]\›Š‹œİ]Kš[™[ÜVİOÏÌ
OÈLNŠ‹œİ]Kš[™[ÜVİKO[‹‹˜YÚ›ÛšXÛOËŠ	İHÙZ]\™ÙYÙX™[‹˜™]]˜[
K‹œŞ[˜Ô›ÙÜ™\ÜÏËŠ
K‹™[Z]

KL
_Y[˜İ[Ûˆ˜JKL
^ÛŒ	‰™K˜Y˜[˜ÙSZ[]\ÊŠNÛ]YØJJNÙ›ÜŠ]ÙK—[ÙˆØš™Xİ™[šY\Ê
J^Û]YNÜ‹œİ]K›™YYÖİOPØJ‹œİ]K›™YYÖİJÊÏÌ
KL
_\‹œŞ[˜Ô›ÙÜ™\ÜÏËŠ
K‹™[Z]

_Y[˜İ[ÛˆXJKŠ^Û]YØJJNÙ›ÜŠ]ÙK—[ÙˆØš™Xİ™[šY\Ê
J^Û]YKO]OOX[ÛY[[XËMLŒÜ‹œİ]K›Y]šXÜÖİOPØJ‹œİ]K›Y]šXÜÖİJÊÏÌ
KKL
_[‰‰œ‹˜YÚ›ÛšXÛOËŠ‹™]]˜[
K‹™[Z]

_Y[˜İ[Ûˆ˜JKŠ^Û]YØJJNÜ‹œİ]Kœ™[][ÛœÚ\ÖİOPØJ
‹œİ]Kœ™[][ÛœÚ\ÖİOÏÌ
JÛ‹LLL
K‹™[Z]

_Y[˜İ[ÛˆJKHL
^Û]YØJJNÜ‹œİ]K™›YÜÖİO[‹‹œŞ[˜Ô›ÙÜ™\ÜÏËŠ
K‹™[Z]

_Y[˜İ[ÛˆØJKX™]]˜[
^Û]YØJJNÜ‹˜YÚ›ÛšXÛOËŠŠK‹™[Z]

_Y[˜İ[ÛˆØJKŠ^Ü™]\›ˆX]›X^
X]›Z[Š‹JJ_]˜\ˆØO[™]ÈÙ]O[™]ÈX\XOHLKOHLNÓ˜J
NÙ[˜İ[ÛˆØJ
^Ü™]\›–Ë‹‹ØWK˜]
LJ_Y[˜İ[ÛˆØJK
^Û]SØJ
NÚYŠ™›YÜÊY›ÜŠ]ÙK—[ÙˆØš™Xİ™[šY\Ê™›YÜÊJUËœÙ]›YÊKŠK‰‰J‹KŠNÚYŠœš\\ÊY›ÜŠ]HÙˆœš\\ÊUË˜Y™[][ÛœÚ\
KšYK™[JNÚYŠ‰‰›™YYÉ‰”J›™YYÊI‰˜J‹›™YYÊK‰‰›Y]šXÜÉ‰”J›Y]šXÜÊI‰XJ‹›Y]šXÜÊK‰‰˜ÛÛœÙ\]Y[˜ÙSX™[
^Û]]œ™[][ÛœÚ\ŒØ
Ø˜ÔØJ‹	İ˜ÛÛœÙ\]Y[˜ÙSX™[Nˆ	Ù_H	ÜŸIİœ™[][ÛœÚ\H™^šYZ[™Ë˜œİXØÙ\ÜÏOOHLOØØ\›˜˜ÛÛÙ
__Y[˜İ[ÛˆXJJ^ÕKœÙ]
KšYKœ]X[]JKXOYKšYOOXYÙTYX	‰™Kœ]X[]OOOX\™™XİY[˜İ[Ûˆ˜JJ^Û]SØJ
NÚYŠK™›YÜÊY›ÜŠ]Û‹—[ÙˆØš™Xİ™[šY\ÊK™›YÜÊJUËœÙ]›YÊ‹ŠK	‰J‹ŠNÚYŠKœ™[][ÛœÚ\É‰™KšYOOXX\ÛÛX
Y›ÜŠ]İ—[ÙˆØš™Xİ™[šY\ÊKœ™[][ÛœÚ\ÊJUË˜Y™[][ÛœÚ\
ŠNİ	‰™K›Y]šXÜÉ‰™KšYOOXX\ÛÛXŞXJK›Y]šXÜËK˜Ú›ÛšXÛJN	‰™K˜Ú›ÛšXÛI‰”ØJK˜Ú›ÛšXÛKKœİXØÙ\ÜÏØÛÛÙ˜Ø\›˜
_Y[˜İ[ÛˆXJJ^Û]UËœÛ˜\Úİ

K]›Z[šT™\İ[ÖÙWKSØJ
OËœÛ˜\Úİ

NÜ™]\›Ø][\Î›Ë˜][\ÏÏÌÚ[œÎ›ËÚ[œÏÏÌ™\İ›Ë˜™\İÏÌ™\İ]X[]N›Ë˜™\İ]X[]OÏØ˜Z[YXİ]™UX[N–Ë‹‹˜Xİ]™UX[WK›YÜÎË‹‹™›YÜË‹‹œË™›YÜÏÏŞß_K™YYÎœË›™YYÏÏÑ˜J
__Y[˜İ[Ûˆ˜J
^ÚYŠJ\™]\›ÑOHLÛ]OZÜ‹œ›İİ\KœİXœØÜšX™NÚÜ‹œ›İİ\KœİXœØÜšX™OY[˜İ[ÛŠ
^İØK˜Y
\ÊNÛ]YK˜Ø[
\Ë
NÜ™]\›Š
OOÛŠ
KØK™[]J\Ê__NÛ]]]œ›İİ\Kœ™XÛÜ™Z[šQØ[YNİ]œ›İİ\Kœ™XÛÜ™Z[šQØ[YOY[˜İ[ÛŠK‹‹KJ^Û]ÏUK™Ù]
JNÜ™]\›ˆK™[]JJK˜Ø[
\ËK‹‹KOÏÛÏÏÊØÛÛY˜˜Z[Y
J_NÛ]]]œ›İİ\Kœ™XÛÜ™YÙNİ]œ›İİ\Kœ™XÛÜ™YÙOY[˜İ[ÛŠK‹KJ^Û]ÏQXNÜ™]\›ˆXOHLK‹˜Ø[
\ËK‹KOÏÛÊ__Y[˜İ[ÛˆJJ^Ü™]\›ˆØš™Xİ˜[Y\ÊJKœÛÛYJOO\[ÙˆOOX[X™\˜	‰™HOOL
_Y[˜İ[Ûˆ˜J
^Ü™]\›Ù[™\™ŞNŒL[™Ù\Œ\œİŒ›Y\Œ[ÛÚÛŒYÚ™\ÜÎŒ[™Ûİ™\ŒÛİ\˜YÙNŒÌ_]˜\ˆXOHLNÙ[˜İ[ÛˆJ
^ÚYŠXJ\™]\›ÒXOHLÛ]OXšKœ›İİ\NÒJJKXJJKØJJKØJJKØJJKXJJ_Y[˜İ[Ûˆ˜JJ^Û]VØ™[™X\œØ[›XÜ™YÛÜ˜X\Û™[^ØÚ[XXNÜ™]\›–Ø[™™X‹‹™K‹‹K™š[\Š
KŠOOˆHYI‰›‹š[™^ÙŠJOOO]
KœÛXÙJ
_Y[˜İ[Ûˆ˜JJ^Ü™]\›ˆOOOX™XYXY[˜İ[Ûˆ˜JK
^Ü™]\›ˆOOOX™Y\”Û™ØÈ^˜J
N™OOOX›[šŞX˜[	‰OOX]XÚËYš[šØY[˜İ[Ûˆ˜JJ^Û]YKœ[[YNÜ™]\›ÚYËšYÏÛ[[›š[™ÎËœ[›š[™ÏÏÈLK]\ÙYËœ]\ÙYÏÈLK\ÙNËœİ]Kœ\ÙOÏÛ[Û[™ÎËœİ]KšÛ[™ÏÏÈLK[ÙNËœİ]K›[ÙOÏÛ[Ú[\Ûİ[ËœÚ[\œËœÚ^™OÏÌ˜YËœ˜YÏÌ]\ÙYÛ\ÜÎ™Øİ[Y[˜›ÙK˜Û\ÜÓ\İ˜ÛÛZ[œÊZ[šYØ[YK\]\ÙY
__Y[˜İ[ÛˆJJ^Û]YKœÙ]\›\İ\ÙKœÙ]\›\İ\Y[˜İ[ÛŠ
^İ˜Ø[
\ÊNÛ]O]\Ëœ[[YNÙI‰ŠKœİ]K›[™]\T˜JK˜ÛÛ^˜Xİ]™UX[JJ__Y[˜İ[ÛˆXJJ^ÙK˜š[™ÛXİ[ÛY[˜İ[ÛŠJ^Û]]\Ëœ[[YNÚYŠ]
\™]\›Û]‹J
OOİ\Ëœ[[YI‰Š\Ëœ[[YKœİ]VÙWOHLJK]›ÚYKO]OÒ˜J\ÊI‰Š]œÚ[\’Y\Ëœ[[YI‰Š\Ëœ[[YKœİ]VÙWOHL
J_KOYOOÊOO]›ÚYKœÚ[\’YOO[ŠI‰œŠ
_KÏ]Oİ˜ÛÙHOOXÜXÙXœ™\X]R˜J\Ê_
œ™]™[Y˜][

K\Ëœ[[YI‰Š\Ëœ[[YKœİ]VÙWOHL
J_KÏYOOÙK˜ÛÙOOOXÜXÙX	‰ŠKœ™]™[Y˜][

KŠ
J_KÏJ
OOÙØİ[Y[šY[‰‰œŠ
_Nİ\Ë˜Xİ[Û‹˜Y]™[\İ[™\ŠÚ[\™İÛ˜JKÚ[™İË˜Y]™[\İ[™\ŠÚ[\\JKÚ[™İË˜Y]™[\İ[™\ŠÚ[\˜Ø[˜Ù[JKÚ[™İË˜Y]™[\İ[™\Š›\˜ŠKÚ[™İË˜Y]™[\İ[™\ŠÙ^YİÛ˜ÊKÚ[™İË˜Y]™[\İ[™\ŠÙ^]\ÊKØİ[Y[˜Y]™[\İ[™\Šš\ÚXš[]XÚ[™ÙXÊK˜ÛX[\œ\Ú


OO\Ë˜Xİ[Û‹œ™[[İ™Q]™[\İ[™\ŠÚ[\™İÛ˜JK

OOÚ[™İËœ™[[İ™Q]™[\İ[™\ŠÚ[\\JK

OOÚ[™İËœ™[[İ™Q]™[\İ[™\ŠÚ[\˜Ø[˜Ù[JK

OOÚ[™İËœ™[[İ™Q]™[\İ[™\Š›\˜ŠK

OOÚ[™İËœ™[[İ™Q]™[\İ[™\ŠÙ^YİÛ˜ÊK

OOÚ[™İËœ™[[İ™Q]™[\İ[™\ŠÙ^]\ÊK

OO™Øİ[Y[œ™[[İ™Q]™[\İ[™\Šš\ÚXš[]XÚ[™ÙXÊJ__Y[˜İ[ÛˆØJJ^Û]YKœš[X\PXİ[ÛÙKœš[X\PXİ[ÛY[˜İ[ÛŠ
^Û]O]\Ëœ[[YNÚYŠYJ\™]\›ˆ˜Ø[
\ÊNÛ]Tİš[™ÊKœİ]Kœ\ÙJNÚYŠ˜JKšYŠJ^ÙKšYOOX™Y\”Û™Ø	‰\Ë™™YY˜XÚÊSSˆTˆQ•İ\™˜\Ú[š\È\ˆ[™[™Ø™]]˜[LJNÜ™]\›Ÿ]˜Ø[
\Ê__Y[˜İ[ÛˆØJJ^Û]YKœÚ[\•\ÙKœÚ[\•\Y[˜İ[ÛŠKŠ^ÚYŠ˜Ø[
\ËKŠK\Ëœ[[YJ^Ù[]H\Ëœ[[YKœİ]VØÚ[\‹IÛŸXK\Ëœ[[YKœÚ[\œË™[]JŠNİ^İ\Ë˜Ø[˜\Ëš\ÔÚ[\Ø\\™JŠI‰\Ë˜Ø[˜\Ëœ™[X\ÙTÚ[\Ø\\™JŠ_XØ]Úß___Y[˜İ[ÛˆØJJ^Û]YKœİ\ÙKœİ\Y[˜İ[ÛŠJ^İ˜Ø[
\ËJNÛ]]\Ëœ[[YNÚYŠ[Š\™]\›Û]J
OOÙØİ[Y[šY[‰‰›‹œ[›š[™É‰ˆ[‹œ]\ÙY	‰\ËÙÙÛT]\ÙJ
_NÙØİ[Y[˜Y]™[\İ[™\Šš\ÚXš[]XÚ[™ÙXŠK‹˜ÛX[\œ\Ú


OO™Øİ[Y[œ™[[İ™Q]™[\İ[™\Šš\ÚXš[]XÚ[™ÙXŠJ_NÛ]YK˜™YÚ[ÙK˜™YÚ[Y[˜İ[ÛŠ
^Û‹˜Ø[
\ÊNÛ]O]\Ëœ[[YNÈYOËœ[›š[™ßKœ˜YŸ
K›\İ\\™›Ü›X[˜ÙK››İÊ
KKœ˜Y\™\]Y\İ[š[X][Û‘œ˜[YJOO\ËXÚÊJJJ_NÛ]YKXÚÎÙKXÚÏY[˜İ[ÛŠJ^Ü‹˜Ø[
\ËJNÛ]]\Ëœ[[YNÈ]œ[›š[™ß
œ˜Y‰‰˜Ø[˜Ù[[š[X][Û‘œ˜[YJœ˜YŠKœ˜YL
_NÛ]OYK™š[š\ÚÙK™š[š\ÚY[˜İ[ÛŠJ^ÚK˜Ø[
\ËJKØİ[Y[˜›ÙK˜Û\ÜÓ\İœ™[[İ™JZ[šYØ[YK\]\ÙY
__Y[˜İ[ÛˆXJJ^Û]YKœİÜÙKœİÜY[˜İ[ÛŠOHL
^Û]]\Ëœ[[YNÚYŠŠ^Û‹œİ]KšÛ[™ÏHLNÙ›ÜŠ]HÙˆ‹œÚ[\œËšÙ^\Ê
J^Ù[]H‹œİ]VØÚ[\‹IÙ_XNİ^İ\Ë˜Ø[˜\Ëš\ÔÚ[\Ø\\™JJI‰\Ë˜Ø[˜\Ëœ™[X\ÙTÚ[\Ø\\™JJ_XØ]Úß_[‹œÚ[\œË˜ÛX\Š
_]˜Ø[
\ËJKØİ[Y[˜›ÙK˜Û\ÜÓ\İœ™[[İ™JZ[šYØ[YK\]\ÙY
__Y[˜İ[Ûˆ˜JJ^Û]YKœ[[YNÜ™]\›ˆHJËœ[›š[™É‰ˆ]œ]\ÙY	‰˜Ûİ[İÛL
_]˜\ˆXOXÙ[›™^HĞÌ\XÛHXÚÈšXHØ[[›İKÚÙ[›™^K\\XÛK\XÚØOXÎ‹ËÜ˜]Ë™Ú]X\Ù\˜ÛÛ[˜ÛÛKĞØ[[›İKÚÙ[›™^K\\XÛK\XÚËÛX\İ\‹ØYÛœËÚÙ[›™^WÜ\XÛWÜXÚØ˜O^ØÚ\˜ÛN˜	Ö_KØÚ\˜ÛWÌËœ™Ø\˜	Ö_KÙ\Ì‹œ™ØÛ[ÚÙN˜	Ö_KÜÛ[ÚÙWÌœ™ØÜ\šÎ˜	Ö_KÜÜ\š×ÌËœ™Øİ\˜	Ö_KÜİ\—Ì‹œ™Ø˜XÙN˜	Ö_Kİ˜XÙWÌ‹œ™ØKXO[™]ÈÙXZÓX\Ù[˜İ[Ûˆ	JJ^Û]TXK™Ù]
JNÚYŠ
\™]\›Š
OOÛÊ
NÛ]YKœ]Y\TÙ[XİÜŠØ[˜\Ø
NÚYŠ[Š]›İÈ\œ›ÜŠZ[šYØ[YHš\İX[^Y\ˆ™\]Z\™\ÈHØ[YHØ[˜\Ë˜
NÛ]YØİ[Y[˜Ü™X]Q[[Y[
]˜
NÜ‹˜Û\ÜÓ˜[YOXZ[šYØ[YK\İYÙXÛ]OYØİ[Y[˜Ü™X]Q[[Y[
Ø[˜\Ø
NÚK˜Û\ÜÓ˜[YOXZ[šYØ[YK]™XØ[˜\ØKÚYNLKšZYÚMÌKœÙ]]šX]J\šXKZY[˜YX
K‹˜™Y›Ü™JŠK‹˜\[™
‹JNÛ]OYØİ[Y[˜Ü™X]Q[[Y[
Ü[˜
NØK˜Û\ÜÓ˜[YOXZ[šYØ[YK]™X˜YÙXK^ÛÛ[XĞÌ‘–K]OVXK‹˜\[™
JNÛ]ÏZK™Ù]ÛÛ^
™
NÚYŠ[Ê]›İÈ\œ›ÜŠZ[šYØ[YH‘–Ø[˜\ÈÛÛ^[˜]˜Z[X›K˜
NÛ]Ï^Ü›Ûİ™KİYÙNœ‹İ™\›^NšKÛÛ^›Ë\ÜÙ]ÎßK\XÛ\Î–×Kš[™ÜÎ–×K˜YŒ\İœ\™›Ü›X[˜ÙK››İÊ
K[XšY[ÛØÚÎŒ\ÙU^˜]™U^˜Ø[YN”ÛÊK™]\Ù]›Z[šQØ[YJKØœÙ\™\›™]È]]][Û“ØœÙ\™\Š

OOÊÊJK\İ›ŞYYˆL_NÜ™]\›ˆXKœÙ]
KÊKË›ØœÙ\™\‹›ØœÙ\™JKØ]šX]\ÎˆL]šX]Qš[\–ØY[˜]K[Z[šKYØ[YXKÚ[\İˆLİX™YNˆLÚ\˜Xİ\‘]NˆLJK\[Ùˆ™\Ú^™SØœÙ\™\X	‰ŠËœ™\Ú^™SØœÙ\™\[™]È™\Ú^™SØœÙ\™\Š

OO˜›ÊÊJKËœ™\Ú^™SØœÙ\™\‹›ØœÙ\™JŠJKK™]\Ù]™\ÜÙ]ÏXØY[™Ø›ÊÊKÊÊK[ÊÊK

OOÛÊÊ_Y[˜İ[Ûˆ[ÊK
^Û]]Õ\\Ø\ÙJ
NÜ™]\›‹ÔT‘‘RÕ‘Q‘‘TŸĞUP‘TŸÑSS‘UP‘PÒS‘ÈÒß“TĞÒH°áË\İ
ŠOŞÚÚ[™™OOOXX\ÛÛXØÛ[ÚÙX›‹š[˜ÛY\Ê‘Q‘‘T˜
OØÜ\šØ˜İ\˜Û™N˜ÛÛÙÛİ[›‹š[˜ÛY\ÊT‘‘RÕ
OÌŒMŸN‹ÔÕÔ“PÒÒÑQÑS‘QSTSÓŸQTŸUTÔÑT’S‹Ë\İ
ŠOŞÚÚ[™›‹š[˜ÛY\Ê“PÒØ
OØ˜XÙX˜Ú\˜ÛXÛ™N˜Ø\›š[™ØÛİ[ŒLN‹Ñ“ÕS‘RS‘P‘SŸP‘ÑUÑR•TÕSŸPÒß‘T”ĞÒ0çUS‘T“’TËË\İ
ŠOŞÚÚ[™™OOOXYÙTYX‹š[˜ÛY\Ê‘T”ĞÒ0çU
OØ\˜Û[ÚÙXÛ™N˜˜YÛİ[ŒNNÚÚ[™˜Ú\˜ÛXÛ™N˜™]]˜[Ûİ[ß_Y[˜İ[ÛˆÊJ^ÚYŠK™\İ›ŞYY
\™]\›ÙK™Ø[YOTÛÊKœ›Ûİ™]\Ù]›Z[šQØ[YJNÛ]YKœ›Ûİœ]Y\TÙ[XİÜŠÙ]K[Z[šK\\ÙWX
OË^ÛÛ[Ëš[J
OÏØYKœ›Ûİœ]Y\TÙ[XİÜŠÙ]K[Z[šK[]™WX
OË^ÛÛ[Ëš[J
OÏØİ	‰OOYKœ\ÙU^	‰ŠKœ\ÙU^]›ÊK
JKK›]™U^[‹Kœ›ÛİšY[Ê[ÊJKÊJJNŠ›ÊJK[ÊJJ_X\Ş[˜È[˜İ[Ûˆ›ÊJ^Û]X]ØZ]›ÛZ\ÙK˜[
Øš™Xİ™[šY\Ê˜JK›X\
\Ş[˜ÊÙKJOO–ÙK]ØZ]›ÊŒ
WJJNÚYŠK™\İ›ŞYY
\™]\›Ù›ÜŠ]Û‹—[Ùˆ
\‰‰ŠK˜\ÜÙ]ÖÛ—O\ŠNÛ]SØš™XİšÙ^\ÊK˜\ÜÙ]ÊK›[™İÙKœ›Ûİ™]\Ù]™\ÜÙ]Ï[LÏØØYY˜˜[˜XÚØY[˜İ[Ûˆ›ÊK
^Ü™]\›ˆ™]È›ÛZ\ÙJOÛ][™]È[XYÙKOHLKOYOOÚ_
OHLÚ[™İË˜ÛX\•[Y[İ]
ÊKŠJJ_KÏ]Ú[™İËœÙ][Y[İ]


OO˜J
K
NÜ‹˜Ü›ÜÜÓÜšYÚ[X[›Û[[İ\Ø‹™XÛÙ[™ÏX\Ş[˜Ø‹›Û›ØYJ
OO˜JŠK‹›Û™\œ›ÜJ
OO˜J
K‹œÜ˜ÏY_J_Y[˜İ[Ûˆ[ÊJ^ÙKœ˜YŸK™\İ›ŞYYKœ›ÛİšY[Ÿ
K›\İ\\™›Ü›X[˜ÙK››İÊ
KKœ˜Y\™\]Y\İ[š[X][Û‘œ˜[YJO›ÛÊK
JJ_Y[˜İ[Ûˆ[ÊJ^ÙKœ˜Y‰‰˜Ø[˜Ù[[š[X][Û‘œ˜[YJKœ˜YŠKKœ˜YLY[˜İ[ÛˆÛÊK
^ÚYŠKœ˜YLK™\İ›ŞYYKœ›ÛİšY[Š\™]\›Û]SX]›Z[ŠLX]›X^
YK›\İ
JNÙK›\İ]Û]PÛÊ
NÙK˜[XšY[ÛØÚÊÏ[‹\‰‰™K˜[XšY[ÛØÚÏ^[ÊK™Ø[YJI‰ŠK˜[XšY[ÛØÚÏLÊJJKÛÊK‹ŠKÛÊKŠKKœ˜Y\™\]Y\İ[š[X][Û‘œ˜[YJO›ÛÊK
J_Y[˜İ[ÛˆÛÊKŠ^Û][ËŒŒŒNÙ›ÜŠ]ˆÙˆKœ\XÛ\Ê[‹›Y™KO]‹JÏ[‹™Ü˜]š]J
œ‹‹
Ï[‹

œ‹‹JÏ[‹J
œ‹‹œ›İ][ÛŠÏ[‹œÜ[Š
œÙKœ\XÛ\ÏYKœ\XÛ\Ë™š[\ŠOO™K›Y™OŒ
KœÛXÙJLN
NÙ›ÜŠ]ˆÙˆKœš[™ÜÊ[‹›Y™KO]ÙKœš[™ÜÏYKœš[™ÜË™š[\ŠOO™K›Y™OŒ
KœÛXÙJLLŠ_Y[˜İ[ÛˆÛÊKŠ^Û]YK˜ÛÛ^OYK›İ™\›^KÚYOYK›İ™\›^KšZYÚÜ‹˜ÛX\”™Xİ
KJKÊ‹K™Ø[YKKKŠNÙ›ÜŠ]ÙˆKœš[™ÜÊYÛÊ‹
NÙ›ÜŠ]ÙˆKœ\XÛ\Ê[[Ê‹K
Nİ[Ê‹K™Ø[YKKK
_Y[˜İ[ÛˆÊK‹‹KJ^ÚYŠKœØ]™J
KK™ÛØ˜[[OKŒ‹OOX›\İ\
^Û]XOÌ“X]œÚ[ŠKÌŒÌ
JÙ›ÜŠ]LÛNÛŠÏLJ^Û]MMJÛŠŒLNÙK™š[İ[O[‰LØ™Ø˜JKLËŒ
X˜™Ø˜JKŒKNLŠXK˜™YÚ[”]

KK˜\˜Ê‹M
İ
Š‰LÏOLÌN‹KJKMËX]”JŒŠKK™š[

KK™š[™Xİ
‹LL‹Ì
İÍŠ_YK™š[İ[OX™Ø˜JŒKLŒM
XK™š[™Xİ
LL‹Ê_Y[ÙHYŠOOX™Y\”Û™Ø
^Ù›ÜŠ]LİLİ
ÏLJ^Û]LÎ
İ
ÍKKŒJÓX]œÚ[ŠKÍŒ
İ
J‹ŒLÙK™š[İ[OX™Ø˜J	İ	LØŒÍËNM‹LØ˜LMËNLKŒXK	ÜŸJXK˜™YÚ[”]

KK˜\˜Ê‹JÓX]œÚ[Š
JKKX]”JŒŠKK™š[

_YKœİ›ÚÙTİ[OX™Ø˜JLMËNLKŒKŒLÊXK›[™UÚYL‹Kœİ›ÚÙT™Xİ
L‹‹‹LŒ‹N
_Y[ÙHYŠOOX›[šŞX˜[
^Û]XOÌšKÌL‰[ÙK™š[İ[OX™Ø˜JMKKNM‹ŒJXÙ›ÜŠ]OLÚONÚJÏLJYK™š[™Xİ


ÚJŒŒL
I[‹‹NL‹ZJÊNÙK™š[İ[OX™Ø˜JÌ‹KLŒ
XÙ›ÜŠ]Lİİ
ÏLJYK˜™YÚ[”]

KK˜\˜ÊŒ
İ
ŒMŒ‹ŒKX]”JŒŠKK™š[

KK™š[™Xİ
Jİ
ŒMŒNKÌ
_Y[ÙHYŠOOXYÙTYX
^Ù›ÜŠ]LİMİ
ÏLJ^Û]LÌ
İ
ÌI[‹OLÌ
İ
ÉLLŒÙK™š[İ[OX™Ø˜JËŒL	ËŒŒŠÓX]œÚ[ŠKÍL
İ
J‹ŒNJXK˜™YÚ[”]

KK˜\˜Ê‹K‹KX]”JŒŠKK™š[

_[]XOËNŠX]œÚ[ŠKÌML
JÌJKÌ‹YK˜Ü™X]S[™X\‘Ü˜YY[
ŠŠ
ÌŒLŒL
NÜ‹˜YÛÛÜ”İÜ
™Ø˜JMKŒÎKMŒLŠX
K‹˜YÛÛÜ”İÜ
K™Ø˜JMKŒÎKM
X
KK™š[İ[O\‹K˜™YÚ[”]

KK›[İ™UÊŠ
KK›[™UÊŠLLKŒJKK›[™UÊŠ
ÌNLŒJKK™š[

_Y[Ù^Û][‹ÌÙ›ÜŠ]LÛÎÛŠÏLJ^Û]OZKÊL
ÛŠL
JÛ‹Ï]
ÓX]œÚ[ŠJJŠŒ
ÛŠŒN
KÏ\‹MNZKÊLJÛŠILŒÌÙKœİ›ÚÙTİ[OX™Ø˜JŒMKŒÌ‹ŒŒ	ËŒJÛŠ‹ŒLŸJXK›[™UÚYMJÛŠ‹ËK˜™YÚ[”]

KK›[İ™UÊËÊÍŠKK˜™^šY\İ\™UÊËLÊÌLÊÌKËLL‹ËËMŠKKœİ›ÚÙJ
__YKœ™\İÜ™J
_Y[˜İ[Ûˆ[ÊK‹‹J^Û]O^Ù›\İ\˜ŒÍËNM‹LØ™Y\”Û™Î˜LMËNLKŒX›[šŞX˜[˜LMËNNMYÙTYN˜MËŒËLŒX\ÛÛN˜MÎKM‹ŒLXKÏKŒJÊX]œÚ[ŠKÍL
JÌJJ‹ŒKÏYK˜Ü™X]T˜YX[Ü˜YY[
‹Ì‹‹Ì‹Š‹ŒK‹Ì‹‹Ì‹Š‹ÌŠNÜË˜YÛÛÜ”İÜ
™Ø˜J
X
KË˜YÛÛÜ”İÜ
K™Ø˜J	ØVİ_K	ÛßJX
KK™š[İ[O\ËK™š[™Xİ
‹Š_Y[˜İ[Ûˆ›ÊK
^ÚYŠ]Õ“Ô‘T‘RUS‘ßÕT••S‘_ÕQ‘‘S•QÈË\İ
Õ\\Ø\ÙJ
JJ\™]\›Û]Y[ÊK™Ø[YK
KWÛÊK™Ø[YK
KO]›Ê‹Û™JKOPÛÊ
OÓX]›Z[ŠK‹˜Ûİ[
N›‹˜Ûİ[Ù›ÜŠ]LİNİ
ÏLJ^Û]SX]œ˜[™ÛJ
J“X]”JŒ‹OKŒÍJÓX]œ˜[™ÛJ
J‹ŒMÙKœ\XÛ\Ëœ\Ú
Şœ‹
ÊX]œ˜[™ÛJ
KKJJŒNœ‹JÊX]œ˜[™ÛJ
KKJJŒN“X]˜ÛÜÊ
J˜KN“X]œÚ[Š
J˜KJ‹šÚ[™OOXÛ[ÚÙXËŒÍN‹Œ
KÜ˜]š]N›‹šÚ[™OOX\ÌÍKMN›‹šÚ[™OOXÛ[ÚÙXËLNKMŒM™KMK›İ][Û“X]œ˜[™ÛJ
J“X]”JŒ‹Ü[ŠX]œ˜[™ÛJ
KKJJ‹ŒËÚ^™N›‹šÚ[™OOXÛ[ÚÙXÌ
ÓX]œ˜[™ÛJ
JŒL
ÓX]œ˜[™ÛJ
JŒŒ‹Y™NL
ÓX]œ˜[™ÛJ
JLX^Y™NŒLÍL[N‹MJÓX]œ˜[™ÛJ
J‹Ú[™›‹šÚ[™ÛÛÜš_J_YKœš[™ÜËœ\Ú
Şœ‹Nœ‹K˜Y]\ÎŒNX^˜Y]\Î›‹Û™OOOXØ\›š[™ØÌMNMKY™NLŒX^Y™NLŒÛÛÜšKÚY›‹Û™OOOX˜YÎ_J_Y[˜İ[ÛˆÊJ^Û]YK›İ™\›^KÚYYK›İ™\›^KšZYÚ^Ù›\İ\ÚÚ[™˜İ\˜ÛÛÜ˜ÙYÍY“X]œ˜[™ÛJ
JNŠX]œ˜[™ÛJ
KKJJ‹ŒËN‹ŒÍKÜ˜]š]NŒÙKMKÚ^™NK™Y\”Û™ÎÚÚ[™˜Ú\˜ÛXÛÛÜ˜ÍÍX™™XŒL
ÓX]œ˜[™ÛJ
JŠLŒ
KNŒÍKŠX]œ˜[™ÛJ
KKJJ‹ŒNN‹ŒŒ‹Ü˜]š]NŒÚ^™NßK›[šŞX˜[ÚÚ[™˜\ÛÛÜ˜Ù™˜“X]œ˜[™ÛJ
JN›‹MM‹‹ŒŠÓX]œ˜[™ÛJ
J‹ŒÍKN‹KŒMKÜ˜]š]NŒ™KMKÚ^™NŒLßKYÙTYNÚÚ[™˜\ÛÛÜ˜ÍÍXÍØŒ
ÓX]œ˜[™ÛJ
JŠLLŒ
KNŒMÌŠX]œ˜[™ÛJ
KKJJ‹ŒÍKN‹ŒNÜ˜]š]NŒMYKM‹Ú^™NŒL_KX\ÛÛNÚÚ[™˜Û[ÚÙXÛÛÜ˜ÙYMYXÌŠÊX]œ˜[™ÛJ
KKJJŒMŒN›‹MÌŠX]œ˜[™ÛJ
KKJJ‹ŒKN‹KŒKÜ˜]š]N‹LL™KM‹Ú^™NŒÍ_VÙK™Ø[YWNÙKœ\XÛ\Ëœ\Ú
Ë‹‹œ‹›İ][Û“X]œ˜[™ÛJ
J“X]”JŒ‹Ü[ŠX]œ˜[™ÛJ
KKJJ‹ŒMKY™NŒML
ÓX]œ˜[™ÛJ
JŒLLX^Y™NŒŒ[N‹ŒŒŠÓX]œ˜[™ÛJ
J‹ŒŸJ_Y[˜İ[Ûˆ[ÊKŠ^Û]SX]›X^
‹›Y™KÛ‹›X^Y™JKO[‹˜[J“X]›Z[ŠKŠŒ‹ŒÊNÙKœØ]™J
KK˜[œÛ]J‹‹JKKœ›İ]J‹œ›İ][ÛŠKK™ÛØ˜[[OZNÛ]O]˜\ÜÙ]ÖÛ‹šÚ[™NØOÙK™˜]Ò[XYÙJK[‹œÚ^™KÌ‹[‹œÚ^™KÌ‹‹œÚ^™K‹œÚ^™JNšÊKŠKKœ™\İÜ™J
_Y[˜İ[ÛˆÊK
^ÚYŠK™š[İ[O]˜ÛÛÜ‹Kœİ›ÚÙTİ[O]˜ÛÛÜ‹šÚ[™OOXÛ[ÚÙX
^Û]YK˜Ü™X]T˜YX[Ü˜YY[
œÚ^™KÌŠNÛ‹˜YÛÛÜ”İÜ
™Ø˜JŒKŒÍKŒKÍJX
K‹˜YÛÛÜ”İÜ
K™Ø˜JŒKŒÍKŒK
X
KK™š[İ[O[‹K˜™YÚ[”]

KK˜\˜ÊœÚ^™KÌ‹X]”JŒŠKK™š[

_Y[ÙHYŠšÚ[™OOXİ\˜šÚ[™OOXÜ\šØ
^Û]]šÚ[™OOXİ\˜ÍNÙK˜™YÚ[”]

NÙ›ÜŠ]LÜŠŒÜŠÏLJ^Û]O\‰LİœÚ^™J‹ŒNœÚ^™J‹KOKSX]”KÌŠÜŠ“X]”KÛ‹ÏSX]˜ÛÜÊJJšKÏSX]œÚ[ŠJJšNÜOOLÙK›[İ™UÊËÊN™K›[™UÊËÊ_YK˜ÛÜÙT]

KK™š[

_Y[ÙHšÚ[™OOX˜XÙXÊK›[™UÚYSX]›X^
‹œÚ^™J‹ŒM
KK˜™YÚ[”]

KK›[İ™UÊ]œÚ^™KÌ‹
KK›[™UÊœÚ^™KÌ‹
KKœİ›ÚÙJ
JNšÚ[™OOX\ÊK˜™YÚ[”]

KK™[\ÙJœÚ^™J‹‹œÚ^™J‹ŒŒ‹X]”JŒŠKK™š[

JNŠK˜™YÚ[”]

KK˜\˜ÊœÚ^™J‹ŒÍX]”JŒŠKK™š[

J_Y[˜İ[ÛˆÛÊK
^Û]LK]›Y™Kİ›X^Y™NÙKœØ]™J
KK™ÛØ˜[[OSX]›X^
K[ŠJ‹Kœİ›ÚÙTİ[O]˜ÛÛÜ‹K›[™UÚY]ÚY
ŠK[Š‹MJKK˜™YÚ[”]

KK˜\˜ÊKœ˜Y]\ÊÊ›X^˜Y]\Ë]œ˜Y]\ÊJ›‹X]”JŒŠKKœİ›ÚÙJ
KKœ™\İÜ™J
_Y[˜İ[ÛˆÛÊK
^Ü™]\›ˆOOOX›\İ\ŞŞLN‹ÓQT‹Ë\İ

OÌÌŒŒÍ_N™OOOX™Y\”Û™ØŞŞLN‹ÑS‘P‘S‹Ë\İ

OÌÌÌŒM_N™OOOX›[šŞX˜[ŞŞLN‹ÔÕÔË\İ

OÌŒNŒ_N™OOOXYÙTYXŞŞLNŒŒŒNŞLNŒŒ__Y[˜İ[Ûˆ›ÊJ^Ü™]\›ˆOOOXÛÛÙØÍØ™X˜™OOOX˜YØÙLÍÍŒØ™OOOXØ\›š[™ØØÙY˜™YX˜ÍÍX™™XY[˜İ[Ûˆ[ÊJ^Ü™]\›ˆOOOXX\ÛÛXÌML™OOOXYÙTYXÌŒÌŒÌÌY[˜İ[Ûˆ›ÊJ^ÙK›İ™\›^KÚYOONL	‰ŠK›İ™\›^KÚYNL
KK›İ™\›^KšZYÚOOMÌ	‰ŠK›İ™\›^KšZYÚMÌ
_Y[˜İ[ÛˆÊJ^ÙK˜ÛÛ^˜ÛX\”™Xİ
K›İ™\›^KÚYK›İ™\›^KšZYÚ
_Y[˜İ[ÛˆÛÊJ^Ü™]\›–Ø›\İ\™Y\”Û™Ø›[šŞX˜[YÙTYXX\ÛÛXKš[˜ÛY\ÊOÏØ
OÙN˜›\İ\Y[˜İ[ÛˆÛÊ
^Ü™]\›ˆØİ[Y[™Øİ[Y[[[Y[˜Û\ÜÓ\İ˜ÛÛZ[œÊ^\™YXÙY[[İ[Û˜
_Ú[™İË›X]ÚYYXOËŠ
™Y™\œË\™YXÙY[[İ[Ûˆ™YXÙJX
K›X]Ú\ÏOOHLY[˜İ[ÛˆÛÊJ^ÚYŠK™\İ›ŞYY
\™]\›ÙK™\İ›ŞYYHL[ÊJKK›ØœÙ\™\‹™\ØÛÛ›™Xİ

KKœ™\Ú^™SØœÙ\™\Ë™\ØÛÛ›™Xİ

KK›İ™\›^Kœ™[[İ™J
KKœİYÙKœ]Y\TÙ[XİÜŠ›Z[šYØ[YK]™X˜YÙX
OËœ™[[İ™J
NÛ]YKœİYÙKœ]Y\TÙ[XİÜŠØ[˜\Î››İ
›Z[šYØ[YK]™XØ[˜\ÊX
Nİ	‰™KœİYÙK˜™Y›Ü™J
KKœİYÙKœ™[[İ™J
KXK™[]JKœ›Ûİ
_\ÛŠ
Nİ˜\ˆÏ^Ë‹‹“YKœİ[™^KZ[œÜXİ[ÛˆÚY˜[KX]]Üš]X˜[YN˜İ[™[K[H	ˆYH]H[™X]N˜ÛÛ›YÜØX›˜ZYHZ]™\İ[ÛÚÛ[™Ø]][ÛœÛXXÚX^œ\İ˜][ÛŒMK˜Z]Î–Ø™\šØ]\˜XÚ˜YÙ[™ZXÚHØÚYZXÚ[˜Ø]][ÛœÛ˜ZK˜\ÙPÛİ[\‘œ\İ˜][ÛŒNK[İ™S][\Y\œÎÈ˜Û\ÜÚXËZYÚYš]™HŒKŒL‹˜[K\Ú\\ÚİÈŒKŒ˜YÜ™YKX[]Ø^HŒKŒM‹›ÙÚXØ[X\™İ[Y[‹™KXÛİ[\ˆŒKŒ‹˜Ø[\[™ËXÚZ\‹X›ØÚÈŒKŒK˜™Y\‹[Ù™™\ˆŒKŒœŞ[˜Ú›Ûš\ÙYXÚY\ˆŒKŒÌ‹˜İ\Y^YKXÛÛXİŒKŒİ[Y^YÙÙ\˜][ÛˆŒKŒÍKYÓ][\Y\œÎİX[NŒKŒ‹ÙÚXÎ‹KÚ]ŒKŒM‹š[šÎŒKŒ‹˜\ÜŒKŒM‹İX›Z\ÜÚ[ÛŒKŒNÚ[ÜÎŒKŒŸKÛİ[\“[™\Î–ØÕS‘STÈĞUUSÓ”ËP“PÒÎˆÚYHØÚ]]]YˆZ[™[ˆ›XÚÈ[™[›ˆ]YˆXÚØÛÚ™ZY\ÈÙZ[™[ˆ\Ø[[Y[š[™È]˜STÈÓÓ“•QÔËSPÒÑS’ÓUĞÒTˆ\ˆ™[›XÚÜÜÙœ™][™[™°éØÚ0é[ˆ]Y‹YH™\›]]XÚ]\È[ˆ™][šYÙ\›ˆİ[[Y[‹˜‘TÕSÓÒÓT“ÕÒÓÓˆ™ZYH\š[›™\›ˆÚXÚÛZXÚ™Z]YÈ[\œØÚYYXÚ[™ØÚ™ZX™[ˆ›İ™[HY\Ù[™H˜XÚ›Ü™\[™È]Y‹˜__K[Ï^Û[ÛY[[Tİ\Œ]XÚÓX\İ\NßK[™XÙİ\Î–×KXİ]™UX[N–×KÙYZÙ[™˜[šÎ˜™]ØÛÛY\˜›YÜÎß_KËÛÎÙ[˜İ[ÛˆÛÊJ^Ñ[Ï\İXİ\™YÛÛ™JJ_Y[˜İ[Ûˆ[Ê
^Ü™]\›ˆßY[˜İ[Ûˆ›ÊJ^ÓÛÏY_Y[˜İ[Ûˆ[ÊJ^ÚYŠQÊ\™]\›Û]Q›ÊËK[ÊNÜ™]\›ˆØš™Xİ˜\ÜÚYÛŠËœİ]JKÊÊKY[˜İ[Ûˆ›ÊK
^Û]]ÏÑ[ËUÖÙWKO[‹˜[™XÙİ\Ëš[˜ÛY\ÊØ]K[Ü[™Y
OÌLŒO[‹ÙYZÙ[™˜[šÏOOX^]ÌN›‹ÙYZÙ[™˜[šÏOOXYÙ[™ÌL›‹ÙYZÙ[™˜[šÏOOXÛ›İÛ˜ÍÎŒÏRJK
KÏQÛÊ‹›[ÛY[[Tİ\
Ê‹˜[™XÙİ\Ëš[˜ÛY\Ê[X][Û˜ÙX
I‰›‹˜Xİ]™UX[K›[™İÌNŒ
KÊKÏYŠK‹™›YÜÊK[[ŠK‹™›YÜÊ_	Ü‹›˜[Y_H\°í™™›™][ˆœ\İØ[\‹ˆğíœœ\›XÚHÙ]Ø[ğé™HZ[™˜XÚ\‹X™\ˆ]]XÚØÚXÚ\ˆ°ïˆYH]›Ü™[™Ë˜OXÏŒØ“Ô‘T‘RUUHPS’TSUSÓˆYÛËÙYØšY\ˆ[™İ[\[š]X[H™\\œØXÚ[ˆ™\™Z]È	ØßHİ\œ\İ˜˜Ü™]\›ˆÏ^ÛÜÛ™[Y™K›İ[™ŒK^Y\Ùœ\İ˜][ÛŒX^œ\İ˜][ÛŒL
ÚJØKİ]\Ù\Î–×KİX\™Œ_K[™[^NÙœ\İ˜][Û˜ËX^œ\İ˜][Ûœ‹›X^œ\İ˜][Û‹İ]\Ù\Î–×KİX\™Œ_KÙÎ–ÛK‹‹›‹˜[™XÙİ\ËœÛXÙJŠK›X\
OO‘™VÙWK˜ÛÛX˜]^
WK™š[\Š›ÛÛX[ŠKš[š\ÚYˆLKÛÛˆLKY\][ÛßK[ÛY[[NœË\ÙRY›ËšY\ÙSX™[›Ë›X™[\ÙY[™XÙİ\Î–×K\ÙYÛÛ\[š[ÛœÎ–×K™^XØİ\˜XŞP›Û\ÎŒ™^İÙ\“][\Y\ŒK™^Ûİ[\“][\Y\ŒK™]T™XYNˆL_KÊÊKßY[˜İ[ÛˆÊK‹‹KOHLKÏSX]œ˜[™ÛJ^ÚYŠK™š[š\ÚY
\™]\›ˆÛÊJNÛ]ÏZOÏÑ[ÎØ_SÛÏOO]ÛÏ]›ÚYÛ]Ï\İXİ\™YÛÛ™JJKZ™VİKOUÖØË›ÜÛ™[YKQJ‹›™YYÊK\Ë˜]XÚÓX\İ\VİKXË˜Y\][Û–İOÏÌORJË›ÜÛ™[YË™[™[^K™œ\İ˜][Û‹ØË™[™[^K›X^œ\İ˜][ÛŠK[KšYOOXËœ\ÙRYØËœ\ÙRY[KšYËœ\ÙSX™[[K›X™[Û]ÏUÙJË›\İYËYÊKÏU[ÊËœ^Y\‹œİ]\Ù\Ë›Úİ\ÜÚY\
OÎŒU[ÊËœ^Y\‹œİ]\Ù\Ë[\˜œ›ØÚ[˜
OÎNŒOU[ÊË™[™[^Kœİ]\Ù\ËYX™\œ[\[
_[ÊË™[™[^Kœİ]\Ù\Ë™\Ú\œ
_[ÊË™[™[^Kœİ]\Ù\Ëš^Y\
K\OOLÌœOOLOÎœOOLÌNŒÍKLÜË˜[™XÙİ\Ëš[˜ÛY\ÊX\Û][›™[
I‰ˆXË\ÙY[™XÙİ\Ëš[˜ÛY\ÊX\Û][›™[
I‰›˜XØİ\˜XŞO‰‰ŠLMKË\ÙY[™XÙİ\Ëœ\Ú
X\Û][›™[
JNÛ]ÏQÛÊ˜XØİ\˜XŞJÙ˜XØİ\˜XŞJĞ™JŠJ×ÊØË›™^XØİ\˜XŞP›Û\ÊŞ]‹XŠÊOÍŒ
KNJNØI‰™Ë›]™[OOLÉ‰˜Ë›[ÛY[[OLÊÏQÛÊÊÍ‹NJKË›[ÛY[[KOLŠN˜OHLNÛ]Ï[Ê
JŒLÏPÏTÎÈ]É‰˜Ëœ™]T™XYI‰ŠËœ™]T™XYOHLKÏ[Ê
JŒLÏPÏTÊNÛ]]É‰ÏSX]›X^
ÊŠOËŒ‹ŒLŠJKOLLÏ^›ÊŠKÏXO]KYÓ][\Y\œÖÛY×OÏÌK]K›[İ™S][\Y\œÖİOÏÌNÚ	‰œË˜[™XÙİ\Ëš[˜ÛY\Ê˜[šË\Úİ
I‰ˆXË\ÙY[™XÙİ\Ëš[˜ÛY\Ê˜[šË\Úİ
I‰ŠLKË\ÙY[™XÙİ\Ëœ\Ú
˜[šË\Úİ
JNÛ]OUYJË›ÜÛ™[YKšYYÊK[YÏOOXX[XÌJÓX]›X^
‹LJJ‹ŒŒJÓX]›X^
‹LJJ‹Œ\OOLÌNœOOLOËNœOOLËN‹ŒÍK\Ë˜[™XÙİ\Ëš[˜ÛY\ÊÜİ]™XY
I‰ŠYÏOOXÙÚXØYÏOOXÚ]
OÌKŒNœË˜[™XÙİ\Ëš[˜ÛY\Êİ[™[K[›İY
I‰›YÏOOXÚ[ÜØÌKŒŒŒKOXOÌKŒÎŒKY›ŠË›ÜÛ™[YYË‹Ë™›YÜÊNİÉ‰ŠOSX]›X^
KX]œ›İ[™
˜˜\ÙQœ\İ˜][ÛŠ™œİÙ\Š™JŠJJšŠ“J™Ë›][\Y\Š“Š”
‘Š’J“
˜Ë›™^İÙ\“][\Y\ŠŠÌKNŒJJJK[ÊË™[™[^Kœİ]\Ù\Ëœ™[YØÚY[Y[˜
I‰›YÏOOXİ[X	‰ŠJÏN
K[ÊË™[™[^Kœİ]\Ù\ËY\›]Y˜
I‰ŠYÏOOXÚ]YÏOOXİX›Z\ÜÚ[Û˜
I‰ŠJÏMÊKË™[™[^K™œ\İ˜][ÛQÛÊË™[™[^K™œ\İ˜][ÛŠÑKË™[™[^K›X^œ\İ˜][ÛŠKœÙ[”™[YY‰‰ŠËœ^Y\‹™œ\İ˜][ÛQÛÊËœ^Y\‹™œ\İ˜][Û‹[œÙ[”™[YY‹Ëœ^Y\‹›X^œ\İ˜][ÛŠJK™İX\™][\Y\‰‰ŠËœ^Y\‹™İX\™[™İX\™][\Y\ŠKœİ]\É‰•›Êœİ]\Ë\™Ù]OOX[™[^XØË™[™[^N˜Ëœ^Y\‹œİ]\ËšYœİ]\Ë\›œÊÈ
ÊË˜œ˜[˜ÚOOXÛÛ›Û
JKÏT›Ê‹JJNÛ]LİÉ‰œOOL	‰ŠŠÏLJKÉ‰™Ë›][\Y\ŒI‰ŠŠÏLJKÉ‰“OLKŒN	‰ŠŠÏLJKÉ‰“LKŒÉ‰ŠŠÏLJK	‰ŠŠÏLJNÛ]XË›[ÛY[[NØË›[ÛY[[OQÛÊË›[ÛY[[JÔ‹ÊKXË›[ÛY[[K^Û]YOU[ÊË™[™[^Kœİ]\Ù\Ë[\˜œ›ØÚ[˜
_[ÊË™[™[^Kœİ]\Ù\ËY\›]Y˜
NÚYŠYYI‰˜Ë™[™[^K™œ\İ˜][ÛË™[™[^K›X^œ\İ˜][ÛŠ^Û]O[‹›™YYËš[™Ûİ™\Š‹ŒMJÛ‹›™YYË\œİ
‹ŒÍJÓX]›X^
Ì[‹›™YYË™[™\™ŞJJ‹ŒL‹U[ÊËœ^Y\‹œİ]\Ù\ËX™Ù\ÚXÚ\
OËŒŒK\Ë˜[™XÙİ\Ëš[˜ÛY\Êİ[™[K[›İY
OÌKŒLŒKO\ŠË›ÜÛ™[Y‹Ë™›YÜÊNÑSX]›X^
KX]œ›İ[™

K˜˜\ÙPÛİ[\‘œ\İ˜][ÛŠÙJØËœ›İ[™
‹ŠJ™™Y™[œÙJŠ‹LJ˜Ëœ^Y\‹™İX\™

˜Ë›™^Ûİ[\“][\Y\ŠœŠšJJKË˜[™XÙİ\Ëš[˜ÛY\ÊİÜ[YX[œË\İÜ
I‰ˆXË\ÙY[™XÙİ\Ëš[˜ÛY\ÊİÜ[YX[œË\İÜ
I‰‘LLÊLË\ÙY[™XÙİ\Ëœ\Ú
İÜ[YX[œË\İÜ
KÏQ™VØİÜ[YX[œË\İÜK˜ÛÛX˜]^
NŠËœ^Y\‹™œ\İ˜][ÛQÛÊËœ^Y\‹™œ\İ˜][ÛŠÑËœ^Y\‹›X^œ\İ˜][ÛŠKÏZŠË›ÜÛ™[YËœ›İ[™KšYË™›YÜËÊ_K˜Ûİ[\“[™\ÖÊËœ›İ[™
ÓX]™›ÛÜŠÊ
JK˜Ûİ[\“[™\Ë›[™İ
JI]K˜Ûİ[\“[™\Ë›[™İJ_Y[ÙHÏYYOØ	İK›˜[Y_Hš[™][ˆZYÙ[™[ˆØ]˜[™˜[™ÈšXÚYZ‹˜˜	İK›˜[Y_H\İHœ\İšY\°ïˆZ[™[ˆÙ[Ü™™][ˆÙYÙ[YË˜ØËœ^Y\‹™İX\™LKË›™^XØİ\˜XŞP›Û\ÏLË›™^İÙ\“][\Y\LKË›™^Ûİ[\“][\Y\LKÊËœ^Y\ŠKÊË™[™[^JKË›\İ[İ™O]Ë›\İYÏ[YËË˜Y\][Û–İO\
ÌNÙ›ÜŠ]HÙˆØš™XİšÙ^\ÊË˜Y\][ÛŠJYHOO]	‰ŠË˜Y\][Û–ÙWOSX]›X^

Ë˜Y\][Û–ÙWOÏÌ
KLJJNÜ™]\›ˆËœ›İ[™
ÏLK	‰˜Ë›ÙËœ\Ú
TÑS•ÑPÒÑSˆ	ÛK›X™[Kˆ	ÛK™\ØÜš\[ÛŸX
KË™[™[^K™œ\İ˜][ÛXË™[™[^K›X^œ\İ˜][ÛÊË™š[š\ÚYHLËÛÛHLÏYÛŠË›ÜÛ™[YË™›YÜÊ_
Ë›ÜÛ™[YOOX›Û›XØ›Û›HØYİ[H\œİ[ˆX[šXÚË˜˜YHÙYÙ[œÙZ]H\İ›Ûİ0é™YÈœ\İšY\˜
JN˜Ëœ^Y\‹™œ\İ˜][ÛXËœ^Y\‹›X^œ\İ˜][Û‰‰ŠË™š[š\ÚYHLËÛÛHLKÏXZ[™Hœ\İ˜][Ûˆ\œ™ZXÚ\È[0éÜÚYÙHX^[][KˆHšYZİXÚ\°ïÚË˜
KË›ÙËœ\Ú
	ÓßH	İÏØ
ÉÑ_Hœ\İ˜˜ÙZ[ˆ™Y™™\‹˜IÓLKŒÏØĞÒĞPÒÕSNˆQÓËÒÕSTS’UPS˜˜IÙË›X™[ØÓÓP“Îˆ	ÙË›X™[K˜˜IÔØ
ÉÔŸH[ÛY[[K˜˜X
KÉ‰˜Ë›ÙËœ\Ú
	ÚßIÑØ
ÉÑHœ\İ˜˜X
KË›ÙÏXË›ÙËœÛXÙJLL
KÏXËÊÊK\[ÙˆÚ[™İÏX	‰Ú[™İË™\Ü]Ú]™[
™]Èİ\İÛQ]™[
ËXØ[\ZYÛ‹X]XÚË]\ÙXÙ]Z[ÚYİXØÙ\ÜÎß_JJKÜİ]N˜Ë]Ë^Y\‘[XYÙN‘KÛİ[\‘[XYÙN‘^Y\“[™N“Ë[™[^S[™NšËÜš]XØ[•ÛÛX›ÓX™[™Ë›X™[[ÛY[[QØZ[™Y”‹[š[X][Û›ÊÊ__Y[˜İ[Ûˆ›ÊKŠ^Û]\İXİ\™YÛÛ™JJKORYVİNÚYŠZ_‹™š[š\ÚY[‹˜Xİ]™UX[Kš[˜ÛY\Ê
_‹\ÙYÛÛ\[š[ÛœËš[˜ÛY\Ê
_‹›[ÛY[[OK›[ÛY[[J\™]\›Üİ]Nœ‹^˜Y\ÙH™YÛZ]\˜Zİ[Ûˆ\İÙ\˜YHšXÚ™\™°ïØ˜\‹˜[š[X][Û˜[ØNÜ‹›[ÛY[[KOZK›[ÛY[[K‹\ÙYÛÛ\[š[ÛœËœ\Ú

NÛ]OX	ÚK›X™[Nˆ	ÚK™]Z[XÏX[ØÜ™]\›ˆOOX[™™XOOXÚ\˜XÜ‹›™^XØİ\˜XŞP›Û\ÊÏLMNOOX™[™XÊ‹›™^Ûİ[\“][\Y\ŠKKÏXÚ]
NOOX\œØÊ‹œ^Y\‹™œ\İ˜][ÛSX]›X^
‹œ^Y\‹™œ\İ˜][Û‹LN
KÏXš[šØ
NOOX[›XÊ‹›™^XØİ\˜XŞP›Û\ÊÏNK‹›™^İÙ\“][\Y\ŠLKŒ‹ÏXØ]™X
NOOXX\ÛÊ‹›™^İÙ\“][\Y\ŠLKŒ‹›™^Ûİ[\“][\Y\ŠLKŒ‹ÏXÚY\˜
NOOX™[^Ü‹œ™]T™XYOHLOOXX[›šXOOX[XÊ‹œ^Y\‹œİ]\Ù\ÏV×K‹›™^Ûİ[\“][\Y\ŠKMKÏXÚY\˜
NOOXİ\ÚX	‰Š›Ê‹™[™[^Kš^Y\ŠK‹›™^İÙ\“][\Y\ŠLKŒL‹ÏXØ]™X
K‹›ÙËœ\Ú
JK‹›ÙÏ\‹›ÙËœÛXÙJLL
KÜİ]Nœ‹^˜K[š[X][Û›ß_Y[˜İ[Ûˆ[ÊK‹‹J^Û]OZOÏÑ[ËÏZ™VÙWKÏUÖİ›ÜÛ™[YKÏQJ‹›™YYÊK]˜Y\][Û–ÙWOÏÌOQÛÊË˜XØİ\˜XŞJØË˜XØİ\˜XŞJĞ™JK˜]XÚÓX\İ\VÙWJKJOOLÌ›OOLOÎ›OOLÌNŒÍJKNJKRJ›ÜÛ™[Y™[™[^K™œ\İ˜][Û‹İ™[™[^K›X^œ\İ˜][ÛŠKY›Š›ÜÛ™[YKËYË‹K™›YÜÊKJË›[İ™S][\Y\œÖÙWOÏÌJJŠËYÓ][\Y\œÖÛËY×OÏÌJJ•YJ›ÜÛ™[YšYËYÊJ•ÙJ›\İYËËYÊK›][\Y\Š™‹O[ËYÏOOXX[XØ0­È	ÓX]›X^
KŠ_H\œÛÛ™[˜˜XK˜]XÚÓX\İ\VÙWNÜ™]\›˜	İ_IH0­È	ÜLKMOØØÚØXÚİ[HÙ]›Ù™™[˜œLKŒOØÙZˆİ\šØœKÌØØÚØXÚ˜›Ü›X[H0­ÈIÚË›]™[ÏÌ_IÛ_IÛØ0­ÈÙ]ğíš[™È	ÛX˜XY[˜İ[ÛˆÊJ^İ\[ÙˆÚ[™İÏ˜XÚ[™İË™\Ü]Ú]™[
™]Èİ\İÛQ]™[
ËXØ[\ZYÛ‹X˜]K\İ]XÙ]Z[œİXİ\™YÛÛ™JJ_JJ_Y[˜İ[Ûˆ›ÊK‹Š^Ü™]\›˜	ÜØÒQÓUTˆØ“Ó‘Q‘‘Tˆ˜I×ÛŠKŠ_XY[˜İ[Ûˆ›ÊK
^Ü™]\›ˆ›™YYË˜[ÛÚÛMØYH]XÚÙH™YÚ[›İ\šËšY™[›ˆX™\ˆZ[™H°í›YÈ[™\™HÙ\ØÚXÚH]\ÈŒNK˜›™YYËšYÚ™\ÜÏMÌØYHXœİ\™HYYHİ\]YZ™\™HÙZİ[™[ˆ›Üˆ\ˆğíœœ\˜™]ÙYİ[™Ë˜›™YYËš[™Ûİ™\MOØZ[ˆØÚ0é[™\ÙZYÙ\˜XÚÙ[šÛ]ØÚ\‹™Y\ˆÛ™È[™™]ÙZ\Ù°ï[™ÈÛZXÚ™Z]YË˜˜8 '‰Ú™VÙWKœÚÜX™[x '™\™™Z[™Ú\šİİ\ˆÚYHZ[ˆ\›œİÙ[YZ[\ˆ›ÜœØÚYË˜Y[˜İ[Ûˆ›ÊK
^Ü™]\›ˆŞÈ˜Û\ÜÚXËZYÚYš]™H˜]˜[K\Ú\\ÚİÈ˜ÚY\˜˜YÜ™YKX[]Ø^H˜[Ø›ÙÚXØ[X\™İ[Y[˜Ø\œX™KXÛİ[\ˆ˜[Ø˜Ø[\[™ËXÚZ\‹X›ØÚÈ˜Ú]˜™Y\‹[Ù™™\ˆ˜š[šØœŞ[˜Ú›Ûš\ÙYXÚY\ˆ˜ÚY\˜˜İ\Y^YKXÛÛXİ˜Ø\œXİ[Y^YÙÙ\˜][Ûˆ˜ÚY\˜VÙWOÏØ[Ø˜İYÙÙ\˜Y[˜İ[Ûˆ›ÊKŠ^Û]YKœİ]\Ù\Ë™š[™
OO™KšYOO]
NÜÜ‹\›œÏSX]›X^
‹\›œËŠN™Kœİ]\Ù\Ëœ\Ú
ÚY\›œÎ›ŸJ_Y[˜İ[ÛˆÊJ^ÙKœİ]\Ù\ÏYKœİ]\Ù\Ë›X\
OOŠË‹‹™K\›œÎ™K\›œËL_JJK™š[\ŠOO™K\›œÏŒ
_Y[˜İ[Ûˆ[ÊK
^Ü™]\›ˆKœÛÛYJOO™KšYOO]	‰™K\›œÏŒ
_Y[˜İ[ÛˆÛÊJ^Ü™]\›Üİ]N™K]ˆLK^Y\‘[XYÙNŒÛİ[\‘[XYÙNŒ^Y\“[™N˜[™[^S[™N˜Üš]XØ[ˆLKÛÛX›ÓX™[˜[ÛY[[QØZ[™YŒ[š[X][Û˜[Ø_Y[˜İ[ÛˆÛÊKŠ^Ü™]\›ˆX]›X^
X]›Z[Š‹JJ_]˜\ˆÛÏXœ\İØ[\‹\›ÙÜ™\ÜÚ[Û‹][ÏX[\ËX›]YKXYšXK[Ë[XZ[‹]ŒX›ÏVØÜ™YÛÜ˜ØÚX™\X\Û›Û›XK[Ï^ÙÜ™YÛÜÚY˜Ü™YÛÜ˜˜[YN˜Üš[QÜ™YÛÜ˜]N˜ÙÛX]ZÙ\ˆ\ˆØÚØ\™[ˆÜ\İXY\ŒK™[][Û’Y˜Ü™YÛÜ˜™]Ø\™]XÚÎ˜™Y\‹[Ù™™\˜™]Ø\™^˜Ü™YÛÜˆ\šÙ[›[‹\ÜÈZ[ˆœšYY[œØšY\ˆÙ[YÙ[XÚİ0éšÙ\ˆ\İ[ÈZ[™HÜš[˜[™ÙK˜[›ØÚÕ^˜˜XÚ[HZ[›\ÜÚØ[\ˆ™\™°ïØ˜\‹˜[]N–ØØÍLÌ˜ÍØLØÙŒØÙXÍŒÌXKXØÙ\ÜÛÜN˜Ü][XKØÚX™\ÚY˜ØÚX™\˜[YN˜ØÚX™\]N˜›İ[š\ØÚ\ˆ™X™[Ù\™™\˜Y\Œ‹™[][Û’Y˜ØÚX™\™]Ø\™]XÚÎ˜KXÛİ[\˜™]Ø\™^˜˜XÚ[Hš][ˆ›[™[™^İ\œÈ[İZ\È[Z[™È°ïˆZ[™[ˆ›ØÚÙ[™[ˆÛÛ\‹˜[›ØÚÕ^˜Ù]Ú[›™HZ[™[ˆYØZØ[\ˆÙ\ˆ˜]YH™^šYZ[™ÈHØÚX™\]Y‹˜[]N–ØÍMØÍMXÌÎMMØXÎX˜ÍÙXÍÌÍLKXØÙ\ÜÛÜN˜[KX\ÛÚY˜X\Û˜[YN˜X\Û]N˜™YÙ[šXÚ\ˆZ]ÛÛ™\šÛ]\Ù[Y\ŒË™[][Û’Y˜X\Û™]Ø\™]XÚÎ˜İ[Y^YÙÙ\˜][Û˜™]Ø\™^˜X\Û™\İ0éYİÙ™š^šY[\ÜÈÛÛ\]H0ç™\™ZX[™ÈZ[™H[0éÜÚYÙHÛÛ™\œ™YÙ[\İ˜[›ØÚÕ^˜Ù]Ú[›™HZ[™[ˆYØZØ[\ˆ[™Z[™\İ[œÈZ[ˆZ[š\ÜY[˜[]N–ØÍMXÌÌMXÌÎXÙŒ™ØØÍÌÌŒXKXØÙ\ÜÛÜN˜Ú\İXK›Û›NÚY˜›Û›X˜[YN˜š]˜[[‹T›Û›X]N˜[™ÙYÛ™\ˆ\È›İ[ˆ˜Y[œØY\™[][Û’Y˜›Û›X™]Ø\™]XÚÎ›[™]Ø\™^˜›Û›H™\›Y\[ˆ›İ[ˆ˜Y[‹ˆYH[™ZÙİHÚ\™]Y\šYZ[Z[™\ÈØ[\œİ[Ë˜[›ØÚÕ^˜Ù]Ú[›™HÙZH[\œØÚYYXÚHYØZğé\™H[™\›™HZ[™\İ[œÈ™ZH]XÚÙ[‹˜[]N–ØÎXÍØÍŒ˜ŒÙM˜ÎYÌÌŒLYXKXØÙ\ÜÛÜN˜Ú\İX_NÓØš™Xİ˜\ÜÚYÛŠËÙÜ™YÛÜÚY˜›Û›X˜[YN–[Ë™Ü™YÛÜ‹›˜[YK]N–[Ë™Ü™YÛÜ‹]KX^œ\İ˜][Û‹˜Z]Î–ØÜš[ÙÛX]\ØÚİÛ˜šY\™[\°é™ÛXÚK˜\ÙPÛİ[\‘œ\İ˜][ÛŒL[İ™S][\Y\œÎÈ˜™Y\‹[Ù™™\ˆŒKMK›ÙÚXØ[X\™İ[Y[ŒKŒÌ‹˜İ\Y^YKXÛÛXİŒKŒNİ[Y^YÙÙ\˜][Ûˆ‹˜[K\Ú\\ÚİÈ‹KYÓ][\Y\œÎÙš[šÎŒKŒÌ‹ÙÚXÎŒKŒNÚ\›NŒKŒL‹Ú[ÜÎ‹Ì‹İ[N‹KÛİ[\“[™\Î–ØÜ™YÛÜˆ\šÛ0é°íœİ\›ÛY[ˆ[š[™Z[™\È›Ûİ0é™YÈØÚØ\™[ˆğïœİÚ[œË˜Ü™YÛÜˆ™ZYHÜš[˜[™ÙHÚYHZ[™[ˆšXÚ\œÜXÚ˜Ü™YÛÜˆ™[›™YHÜš]ZÈZ[™Hœ˜YÙH\ˆÙ\›[\\˜]\‹˜_KØÚX™\ÚY˜›Û›X˜[YN–[ËœØÚX™\›˜[YK]N–[ËœØÚX™\]KX^œ\İ˜][ÛM˜Z]Î–ØXœØÚÙZY™[™›İ[š\ØÚÛÛ\™[\š[™XÚK˜\ÙPÛİ[\‘œ\İ˜][ÛŒL‹[İ™S][\Y\œÎÈ™KXÛİ[\ˆŒKK˜[K\Ú\\ÚİÈŒKŒ˜Û\ÜÚXËZYÚYš]™HŒKŒ‹›ÙÚXØ[X\™İ[Y[‹Ì‹˜YÜ™YKX[]Ø^H‹ŸKYÓ][\Y\œÎİÚ]ŒKŒİ[NŒKŒ‹˜\ÜŒKŒMÙÚXÎ‹ÍKİX›Z\ÜÚ[Û‹ŸKÛİ[\“[™\Î–ØØÚX™\™X[ÛÜ]YHœ˜YÙHZ]\ˆÙ\ØÚXÚHZ[™\ˆš[[Y\œ›[™K˜ØÚX™\™YÚ[›™ZHİÜŞ[\ÙH[™[™]Ú™H\šÙ[›˜˜\™[ˆÚ\ØÚ[š[˜ØÚX™\XZ[™[ˆÙZYÈØÚ[Èğé™H[Z][\È™]ÚY\Ù[‹˜_KX\ÛÚY˜›Û›X˜[YN–[Ë›X\Û›˜[YK]N–[Ë›X\Û]KX^œ\İ˜][ÛŒL˜Z]Î–Ø™YÙ[Ù[™YØÜY[\š\ØÚÚ[ÜÛÙ™™[˜K˜\ÙPÛİ[\‘œ\İ˜][ÛŒM[İ™S][\Y\œÎÈİ[Y^YÙÙ\˜][ÛˆŒKL‹œŞ[˜Ú›Ûš\ÙYXÚY\ˆŒKŒÍ˜YÜ™YKX[]Ø^HŒKŒ˜Ø[\[™ËXÚZ\‹X›ØÚÈ‹Ë›ÙÚXØ[X\™İ[Y[‹ÎKYÓ][\Y\œÎØÚ[ÜÎŒKŒÍKX[NŒKŒŒ‹İX›Z\ÜÚ[ÛŒKŒM‹İX\™‹Ì‹ÙÚXÎ‹ŸKÛİ[\“[™\Î–ØX\Û\™š[™]Z[™HÛÛ™\œ™YÙ[YH°ïÚİÚ\šÙ[™ØÚÛˆ[[Y\ˆÙYÛÛ[ˆX™[ˆÛÛ˜X\Û™ZYXˆ[™\šÛ0é\œİ[˜XÚØ\ÈZYÙ[XÚÙ\ÜY[İ\™K˜X\ÛÙ\][œÙ[™[ˆØ]ˆÛZXÚ™Z]YÈ[È›İ[[™›Û\Ü[šİ˜__JNİ˜\ˆÏXÛ\ÜŞÙÙ]][J
^Ü™]\›ˆØØ[İÜ˜YÙK™Ù]][J[Ê_\Ù]][JK
^ÛØØ[İÜ˜YÙKœÙ]][J[Ë
_\™[[İ™R][J
^ÛØØ[İÜ˜YÙKœ™[[İ™R][J[Ê__KË›ÏX[Ë	Ë\ÏHLKÏHLKœÏHLKœÏL\ÏLÙ[˜İ[Ûˆ\ÊJ^Ü™]\›ˆ›Ë™š[\ŠOŠOË›Z[šT™\İ[ÏË–Ø˜]KIİXOËÚ[œÏÏÌ
OŒ
_Y[˜İ[ÛˆÜÊJ^Û]X\ÊJK›[™İÜ™]\›ˆMŞÚY˜YÙ[™X™[˜œ\İØ[\‹SYÙ[™X]™[KÚ[œÎNLÏŞÚY˜Y[[X™[˜]™Y[[]™[Ú[œÎNLŞÚY˜Ûİ[\˜X™[˜™[Ü™Z\ËRÛÛ\™\˜]™[ŒËÚ[œÎNLOŞÚY˜›İšXÙXX™[˜œ\İS›İš^™X]™[Œ‹Ú[œÎNÚY˜›ÛÚÚYXX™[˜ØÚ˜[šÙ[‹S™][[™Ø]™[ŒKÚ[œÎ_Y[˜İ[ÛˆÜÊK
^Û]X\ÊJK›[™İSØš™Xİ™[šY\ÊOË›Z[šT™\İ[ÏÏŞßJK™š[\Š
ÙWJOOˆYKœİ\ÕÚ]
˜]KX
JKœ™YXÙJ
KËJOO™JÓ[X™\ŠËÚ[œÏÏÌ
K
NÜ™]\›ˆOOXÜ™YÛÜ˜Şİ[›ØÚÙYˆHYOË˜]]Üš]P˜]UÛÛ‹™X\ÛÛ–[Ë™Ü™YÛÜ‹[›ØÚÕ^NOOXØÚX™\Şİ[›ØÚÙY›L_[X™\ŠOËœ™[][ÛœÚ\›Û\ÏËœØÚX™\ÏÌ
OM‹™X\ÛÛ–[ËœØÚX™\[›ØÚÕ^NOOXX\ÛŞİ[›ØÚÙY›LI‰œLK™X\ÛÛ–[Ë›X\Û[›ØÚÕ^NOOX›Û›XŞİ[›ØÚÙY›L‰‰“[X™\ŠOË›X\›™Y]XÚÜÏË›[™İÏÌ
OLË™X\ÛÛ–[Ëœ›Û›K[›ØÚÕ^Nİ[›ØÚÙYˆLK™X\ÛÛ˜[˜™ZØ[›\ˆÙYÛ™\‹˜_Y[˜İ[ÛˆÜÊK
^Û]]ŒÍÌÏÌNŒÜ™]\›ÙÜ™YÛÜ–Ø[šZ^™[˜Üš[ÙÛXX™\šÛÚH]]Üš]0éKØÚX™\–Ø›[™[™[™›İ[š\ØÚ\ˆ^İ\œØİÜŞ[\ÙKRÛÛ\ØKX\Û–ØÜ[™™YÙ[ÛÛ™\šÛ]\Ù[™YÙ[œXÚQš[˜[XK›Û›N–Ø[Û›ÛÙØ™YÜšY™œİ™\ZYYİ[™ØÚY\œÜXÚÚÛÛ\Ø_VÙWOË–Û—OÏØœ\İØ[\˜Y[˜İ[ÛˆÊJ^Ü™]\›È˜Û\ÜÚXËZYÚYš]™H˜YÚš]™X˜[K\Ú\\ÚİÈ˜Ú\Y›\Ú˜YÜ™YKX[]Ø^H˜YÜ™YX›ÙÚXØ[X\™İ[Y[˜ÙÚXËXØ\™Ø™KXÛİ[\ˆ˜Ûİ[\‹\Û\Ú˜Ø[\[™ËXÚZ\‹X›ØÚÈ˜ÚZ\‹YİX\™˜™Y\‹[Ù™™\ˆ˜™Y\‹X\˜ØœŞ[˜Ú›Ûš\ÙYXÚY\ˆ˜X[K]Ø]™X˜İ\Y^YKXÛÛXİ˜Û™ËX\˜Øİ[Y^YÙÙ\˜][Ûˆ˜ÚØÚİØ]™XVÙWOÏØ[ØY[˜İ[Ûˆ\ÊKŠ^Û]V[ÖÛ—OËœ™[][Û’YÏÛ‹OS[X™\ŠOËœ™[][ÛœÚ\›Û\ÏË–Ü—OÏÌ
KOS[X™\ŠËœ™[][ÛœÚ\›Û\ÏË–Ü—OÏÌ
KÏV×NÙ›ÜŠ]ˆÙˆ™]ÈÙ]
Ë‹‹™OË›X\›™Y]XÚÜÏÏÖ×K‹‹Ë›X\›™Y]XÚÜÏÏÖ×WJJ^Û]YOË˜]XÚÓX\İ\OË–Û—OÏŞİ\Ù\ÎŒİXØÙ\ÜÙ\ÎŒ]™[Œ_KO]Ë˜]XÚÓX\İ\OË–Û—OÏŞİ\Ù\ÎŒİXØÙ\ÜÙ\ÎŒ]™[Œ_NÊK\Ù\ÈOO\‹\Ù\ßKœİXØÙ\ÜÙ\ÈOO\‹œİXØÙ\ÜÙ\ßK›]™[OO\‹›]™[
I‰›Ëœ\Ú
ÚY›‹\Ù\ÎšK\Ù\Ë\‹\Ù\ËİXØÙ\ÜÙ\ÎšKœİXØÙ\ÜÙ\Ë\‹œİXØÙ\ÜÙ\Ë]™[™Y›Ü™Nœ‹›]™[]™[Y\šK›]™[J_\™]\›İÙYZÙ[™ØÛÜ™N“[X™\ŠËÙYZÙ[™ØÛÜ™OÏÌ
KS[X™\ŠOËÙYZÙ[™ØÛÜ™OÏÌ
KØÛÜ™P™Y›Ü™N“[X™\ŠOËÙYZÙ[™ØÛÜ™OÏÌ
KØÛÜ™PY\“[X™\ŠËÙYZÙ[™ØÛÜ™OÏÌ
K™[][ÛœÚ\˜KZK™[][Û™Y›Ü™NšK™[][ÛY\˜K][\Î“[X™\ŠË›Z[šT™\İ[ÏË–Ø˜]KIÛŸXOË˜][\ÏÏÌ
KÚ[œÎ“[X™\ŠË›Z[šT™\İ[ÏË–Ø˜]KIÛŸXOËÚ[œÏÏÌ
K˜[šĞ™Y›Ü™N›ÜÊJK˜[šĞY\›ÜÊ
KX\İ\N›Ë[›ØÚÙY’›Ë™š[\ŠOˆ\ÜÊKŠK[›ØÚÙY	‰œÜÊŠK[›ØÚÙY
__Y[˜İ[ÛˆÊ
^Û]O[™]ÈÜŠ™]ÈÊNÜ™]\›ˆË˜]YÛY[Û˜\Úİ
KœÛ˜\Úİ

J_Y[˜İ[ÛˆœÊ
^Û]OSÛ‹™š[™
OO™KšYOOX›Û›P˜]X
NÙI‰“Øš™Xİ˜\ÜÚYÛŠKÛX™[˜œ\İØ[\‹SYØH[H]\ÙYØŒMŒÍKNŒL˜Y]\ÎŒLÍ_JK™]È]]][Û“ØœÙ\™\ŠÊK›ØœÙ\™JØİ[Y[™Øİ[Y[[[Y[ØÚ[\İˆLİX™YNˆLÚ\˜Xİ\‘]NˆL]šX]\ÎˆL]šX]Qš[\–ØY[˜_JKØİ[Y[˜Y]™[\İ[™\ŠÛXÚØÜËL
KÚ[™İË˜Y]™[\İ[™\ŠËXØ[\ZYÛ‹X˜]K\İ]XÜÊKÚ[™İË˜Y]™[\İ[™\ŠËXØ[\ZYÛ‹[Y]XÊKÊ
K\Ê
_Y[˜İ[ÛˆÊ
^İß
ÏHLÚ[™İËœÙ][Y[İ]


OOİÏHLK\Ê
KÊ
_KŒ
J_Y[˜İ[Ûˆ\Ê
^Û]OYØİ[Y[™Ù][[Y[RY
Ù[™\šXË[[Ù[
KYØİ[Y[™Ù][[Y[RY
[Ù[]]X
KYØİ[Y[™Ù][[Y[RY
[Ù[[Ü[ÛœØ
KYØİ[Y[™Ù][[Y[RY
[Ù[XÛÜX
NÚYŠJY_KšY[ŸË^ÛÛ[OOXš]˜[[‹T›Û›X[ŠJ^Ù›ÜŠ]HÙˆ‹œ]Y\TÙ[XİÜ[
]Û˜
JYK^ÛÛ[Ëš[˜ÛY\Êœ\İY[
I‰™Kœ™[[İ™J
NÚYŠ‰‰ˆ\‹œ]Y\TÙ[XİÜŠ›XYİYKYX[ÙİYK[›İX
J^Û]OYØİ[Y[˜Ü™X]Q[[Y[

NÙK˜Û\ÜÓ˜[YOXXYİYKYX[ÙİYK[›İXK^ÛÛ[X›Û›H™Y[ˆ[™›Û›H™Zğé\™[ˆÚ[™™]Ù]™[›ˆÙ\Ü°éÚH[ÚXÚÙ[ˆ™^šYZ[™È[™ÙÚZËP]XÚÙ[‹ˆ\ˆœ\İØ[\ˆš[™]]\ÜØÚYpçÛXÚ[ˆ\ˆYØH[H]\ÙYÈİ]˜‹˜\[™
J___Y[˜İ[ÛˆÊ
^Û]OYØİ[Y[™Ù][[Y[RY
˜]K[[Ù[
KYØİ[Y[™Ù][[Y[RY
˜]K]]X
NÈY_KšY[Ÿ
YK™]\Ù]›XYİYPXİ]™I‰ˆYK™]\Ù]›XYİYTÙ[Xİ	‰Ë^ÛÛ[Ëœİ\ÕÚ]
š]˜[[‹T›Û›X
I‰œÊ
KK™]\Ù]›XYİYTÙ[XİOOXX	‰šœÊ
J_Y[˜İ[ÛˆÜÊJ^Û]YØİ[Y[™Ù][[Y[RY
˜]K[[Ù[
NÈ]™]\Ù]›XYİYPXİ]™HOOXXV›ßK™]Z[Ë›ÜÛ™[YOOV›É‰ŠÏYK™]Z[Ê
KÜÊ
J_Y[˜İ[ÛˆÜÊJ^Û]YK\™Ù][œİ[˜Ù[Ùˆ[[Y[ÙK\™Ù]˜ÛÜÙ\İ
]Û˜
N›[ÚYŠ[œİ[˜Ù[ÙˆS]Û‘[[Y[
^ÚYŠ™]\Ù]›XYİYSÜÛ™[
^ÙKœ™]™[Y˜][

KKœİÜ[[YYX]T›ÜYØ][ÛŠ
KœÊ™]\Ù]›XYİYSÜÛ™[
NÜ™]\›ŸZYŠ™]\Ù]›XYİYS[İ™J^ÙKœ™]™[Y˜][

KKœİÜ[[YYX]T›ÜYØ][ÛŠ
KÜÊ™]\Ù]›XYİYS[İ™JNÜ™]\›ŸZYŠ™]\Ù]›XYİYT›Üİ\ˆOO]›ÚY
^ÙKœ™]™[Y˜][

KKœİÜ[[YYX]T›ÜYØ][ÛŠ
KœÊ
NÜ™]\›ŸZYŠ™]\Ù]›XYİYT™[X]ÚOO]›ÚY
^ÙKœ™]™[Y˜][

KKœİÜ[[YYX]T›ÜYØ][ÛŠ
KœÊ›ËL
NÜ™]\›Ÿ]šYOOX˜]KXÛÜÙX	‰“œÊ
__Y[˜İ[ÛˆœÊOHLJ^Û]YØİ[Y[™Ù][[Y[RY
˜]K[[Ù[
KYØİ[Y[™Ù][[Y[RY
˜]K]]X
KYØİ[Y[™Ù][[Y[RY
˜]K\›İ[™
KOYØİ[Y[™Ù][[Y[RY
˜]K[[İ™\Ø
KOYØİ[Y[™Ù][[Y[RY
˜]K[ÙØ
KÏYØİ[Y[™Ù][[Y[RY
˜]KXÛÜÙX
NÈ]Z_
œßYKÏ]›ÚY›ÏX	Ï]›ÚY\ÏHLKšY[HLK™]\Ù]›XYİYTÙ[XİXX[]H™]\Ù]›XYİYPXİ]™KØİ[Y[˜›ÙK˜Û\ÜÓ\İ˜Y
Ø[\ZYÛ‹[[Ù[[Ü[˜
K‰‰Š‹^ÛÛ[X”•TÕĞST‹SQĞH0­ÈZYÙ[™\ˆ›ÙÜ™\ÜÚ[ÛœÜ˜Y
K‰‰Š‹^ÛÛ[X	ÛÜÊËœÛ˜\Úİ

JK›X™[H0­ÈÙYÛ™\›Z]\˜
KI‰ŠKš[›™\’SXÛ\ÜÏH›]\İ‘Ù\Ü°éÚH›ZX™[ˆÙ\Ü°éÚKˆY\ˆ°é[ˆ]XÚÙ[‹YZ\İ\œØÚYX[H[™[\œØÚYYXÚHÙYÛ™\œØÚğéÚ[‹Ü˜
KÈ[œİ[˜Ù[ÙˆS]Û‘[[Y[	‰ŠËšY[HLJK\ÊJK\Ê›Üİ\˜
J_Y[˜İ[Ûˆ\ÊJ^Û]UËœÛ˜\Úİ

K[ÜÊ
NÙKš[›™\’SXÙXİ[ÛˆÛ\ÜÏH›XYİYK\›Üİ\ˆˆ]K]™\œÚ[ÛH‰ÒÛßHXY\Ü[‘”•TÕĞST‹T“ÑÔ‘TÔÒSÓÜÜ[İ›Û™Ï‰ÑœÊ‹›X™[
_OÜİ›Û™ÏÛX[‰Û‹Ú[œßKÍÙYÛ™\ˆ™\ÚYYİ0­È™Y\ˆÚYYÈ™\°é™\]Y\šYZ[™[ˆÛØÚ[™[™İ[™ÜÛX[ÚXY\]ˆÛ\ÜÏH›XYİYK[ÜÛ™[YÜšYÙ]ÜÙXİ[Û˜Û]YKœ]Y\TÙ[XİÜŠ›XYİYK[ÜÛ™[YÜšY
NÙ›ÜŠ]HÙˆ›Ê^Û]V[ÖÙWKO\ÜÊJKO]›Z[šT™\İ[ÏË–Ø˜]KIÙ_XOÏŞØ][\ÎŒÚ[œÎŒ™\İŒKÏ[œßK[›ØÚÙYÏYØİ[Y[˜Ü™X]Q[[Y[
\XÛX
NÜË˜Û\ÜÓ˜[YOXXYİYK[ÜÛ™[XØ\™	ÛÏØ[›ØÚÙY˜ØÚÙYH	ØKÚ[œÏØY™X]Y˜XËš[›™\’SX]ˆÛ\ÜÏH›XYİYKXØ\™\Ü˜Z]‰ÓÜÊKØ\™
_OÙ]]Ü[”ÕQ‘H	Û‹Y\ŸOÜÜ[Ï‰ÑœÊ‹›˜[YJ_OÚÏ‰ÑœÊ‹]J_OÜÛX[‰ØKÚ[œßKÉØK˜][\ßHÚYYÙH0­È™\İÙ\	ØK˜™\İ8 $ØOÜÛX[[O‰ÑœÊÏÛ‹œ™]Ø\™^šKœ™X\ÛÛŠ_OÙ[O]Ûˆ\OH˜]Ûˆˆ]K[XYİYK[ÜÛ™[H‰Ù_Hˆ	ÛÏØ˜\ØX›YO‰ØKÚ[œÏØ\›™]]›Ü™\›˜›ÏØØ[\ˆ™YÚ[›™[˜˜Ù\Ü\œOØ]ÛÙ]˜Ë˜\[™
Ê__Y[˜İ[ÛˆœÊKHLJ^Û]UËœÛ˜\Úİ

NÚYŠV[ÖÙW_]	‰ˆ[œÉ‰ˆ\ÜÊ‹JK[›ØÚÙY
\™]\›Û]YØİ[Y[™Ù][[Y[RY
˜]K[[Ù[
NÜ‰‰Š‹™]\Ù]›XYİYPXİ]™OXX[]H‹™]\Ù]›XYİYTÙ[Xİ›ÏYK[Ï[‹	Ï]›ÚY\ÏHLKÏS›ÊKËœ›ÙÜ™\ÜÚ[ÛÛÛ^

JKÊ
KÜÊ
K\ÊK\™İYX
J_Y[˜İ[ÛˆÊ
^ÈRßV›ß
Ëœ\ÙSX™[XÜÊ›ËË™[™[^K™œ\İ˜][Û‹ÒË™[™[^K›X^œ\İ˜][ÛŠJ_Y[˜İ[ÛˆÜÊ
^ÚYŠRßV›Ê\™]\›Û]OV[ÖÖ›×KYØİ[Y[™Ù][[Y[RY
˜]K]]X
KYØİ[Y[™Ù][[Y[RY
˜]K\›İ[™
KYØİ[Y[™Ù][[Y[RY
˜]K[[İ™\Ø
KOYØİ[Y[™Ù][[Y[RY
˜]K[ÙØ
KOYØİ[Y[™Ù][[Y[RY
˜]KXÛÜÙX
NÚYŠ	‰Š^ÛÛ[X	ÙK›˜[Y_H0­È	ÙK]_X
K‰‰Š‹^ÛÛ[XYØKTİY™H	ÙKY\ŸH0­È[™H	ÒËœ›İ[™H0­È	ÒËœ\ÙSX™[H0­È[ÛY[[H	ÒË›[ÛY[[_KÌØ
K\ÊÊKI‰ŠKš[›™\’SRË›ÙËœÛXÙJ
Kœ™]™\œÙJ
K›X\

K
OO˜Û\ÜÏH‰İOOLØ]\İ˜H‰ÑœÊJ_OÜ˜
Kš›Ú[Š
JK\Ê›ÊK\Š\™]\›ÚYŠË™š[š\ÚY
^İÜÊ
KÊŠKH[œİ[˜Ù[ÙˆS]Û‘[[Y[	‰ŠKšY[HLJNÜ™]\›ŸXH[œİ[˜Ù[ÙˆS]Û‘[[Y[	‰ŠKšY[HL
NÛ]ÏYÊ
KÏUËœÛ˜\Úİ

NÜ‹š[›™\’SXÙXİ[ÛˆÛ\ÜÏH›XYİYK[[İ™KZ[›Èİ›Û™Ï‰ÑœÊK›˜[YJ_HY\İÚYY\šÛ[™Ù[ˆZ]Üİ›Û™ÏÛX[•ÙXÚÛH[™ÜšY™œİ\[‹ˆX[KP]XÚÙ[ˆÚØ[Y\™[ˆZ]ÚXÚ˜\™[ˆ™YÛZ]\›‹ÜÛX[ÜÙXİ[Û‰ÜË™\]Z\Y]XÚÜË›X\
OOÛ]Z™VÙWNÜ™]\›˜]Ûˆ\OH˜]Ûˆˆ]K[XYİYK[[İ™OH‰Ù_Hİ›Û™Ï‰ÑœÊ›X™[
_OÜİ›Û™ÏÜ[‰ÑœÊ™\ØÜš\[ÛŠ_OÜÜ[ÛX[‰ÑœÊ[ÊKËËË˜Xİ]™UX[K›[™İ
ÌKËœ›ÙÜ™\ÜÚ[ÛÛÛ^

JJ_OÜÛX[Ø]Û˜JKš›Ú[Š
_XY[˜İ[ÛˆÜÊJ^ÚYŠRßË™š[š\ÚYZ™VÙWJ\™]\›Û]TÊËKÊ
KËœÛ˜\Úİ

K˜Xİ]™UX[K›[™İ
ÌKËœ›ÙÜ™\ÜÚ[ÛÛÛ^

JNÒÏ]œİ]KÊ
KÊK
KË™š[š\ÚYİÚ[™İËœÙ][Y[İ]


OOİÜÊ
KÜÊ
_KLŒ
N”ÜÊ
_Y[˜İ[ÛˆÜÊ
^ÚYŠRßV›ß\Ê\™]\›Ù\ÏHLÛ]OT[ÏÏÕËœÛ˜\Úİ

KV[ÖÖ›×KRËÛÛ‹LKRËœ^Y\‹™œ\İ˜][Û‹ÒËœ^Y\‹›X^œ\İ˜][Û‹OSX]›X^
LX]œ›İ[™
MJİY\ŠŒN
ÜŠKSX]›X^
Ëœ›İ[™M
JŒÊJKO[Ü‹Ì‰‰’Ëœ›İ[™MØ\™™Xİœ‹ØÛÛY˜Y\ÜŞX˜˜Z[YÕËœ™XÛÜ™Z[šQØ[YJ˜]KIÖ›ßX‹KØ	İ›˜[Y_Hİ\™H[ˆ\ˆœ\İØ[\‹SYØH™\ÚYYİ˜˜	İ›˜[Y_H0éÙZ[™HÜÚ][Ûˆ[ˆ\ˆœ\İØ[\‹SYØK˜JKËœÙ]›YÊXYİYKIÖ›ßKX][\YL
K‰‰ŠËœÙ]›YÊXYİYKIÖ›ßK]ÛÛ˜Lœ™]Ø\™^
KË˜Y™[][ÛœÚ\
œ™[][Û’Y
İY\ŠŒŠKœ™]Ø\™]XÚÉ‰•Ë›X\›]XÚÊœ™]Ø\™]XÚË	İ›˜[Y_HØÚ[]Z[™H[\›˜]]™HØ[\›Zİ[Ûˆœ™ZNˆ	Ú™Vİœ™]Ø\™]XÚ×K›X™[K˜
KËœ™XÛÜ™˜]UšXİÜJ›ÊK›ÏOOX›Û›X	‰•ËœÙ]›YÊ›Û›QY™X]YL›Û›Hİ\™H[ÈÜ0é\ˆYØYÙYÛ™\ˆ™\ÚYYİ8 $È[˜Xš0é™ÚYÈ›ÛH›Ü›X[[ˆÙ\Ü°éÚÜ˜Y˜
JNÛ]ÏUËœÛ˜\Úİ

NÉÏ^İÛÛ›‹ØÛÜ™NšK]X[]N˜K™Y›Ü™N™KY\›Ë[\Î\ÊKË›Ê_KÚ[™İË™\Ü]Ú]™[
™]Èİ\İÛQ]™[
ËXØ[\ZYÛ‹[XYİYK\™\İ[Ù]Z[œİXİ\™YÛÛ™JÛÜÛ™[Y–›ËÛÛ›‹ØÛÜ™NšK]X[]N˜K[\Î‰Ë™[\ßJ_JJK\Ê›ËØÛÛ\ÙX˜ÚY\˜
_Y[˜İ[ÛˆÊJ^ÚYŠIÊ\™]\›Û]İÛÛØÛÜ™N›‹]X[]Nœ‹[\Îš_OIËOZK›X\İ\K›[™İÚK›X\İ\K›X\
OO˜	Ú™VÙKšYOËœÚÜX™[ÏÙKšYNˆ	ÙK\Ù\ÏLØ
Ø˜IÙK\Ù\ßHZ[œØ]‹	ÙKœİXØÙ\ÜÙ\ÏLØ
Ø˜IÙKœİXØÙ\ÜÙ\ßH™Y™™\‰ÙK›]™[Y\™K›]™[™Y›Ü™OØIÙK›]™[™Y›Ü™_x¡¤“IÙK›]™[Y\ŸX˜X
Kš›Ú[Šœ˜
N˜ÙZ[™H]XÚÙ[‹SYZ\İ\œØÚY™\°é™\˜ÏZK[›ØÚÙY›[™İÚK[›ØÚÙY›X\
OO–[ÖÙWK›˜[YJKš›Ú[Š0­È
N˜ÙZ[ˆ™]Y\ˆÙYÛ™\˜ÙKš[›™\’SXÙXİ[ÛˆÛ\ÜÏH›XYİYK\™\İ[	İØÛÛ˜˜ÜİHXY\Ü[‰İØQĞTÒQQØ˜QĞS’QQT“QÑXOÜÜ[İ›Û™Ï‰İØ›ÜØÚš]Ù\ÜZXÚ\˜™\œİXÚÙ\ÜZXÚ\OÜİ›Û™ÏÛX[•Ù\	ÛŸH0­È]X[]0é	ÜŸOÜÛX[ÚXY\]ˆÛ\ÜÏH›XYİYKY[KYÜšY\XÛOÜ[•ÛØÚ[™[™Ù\ÜÜ[İ›Û™Ï‰ÔÊKÙYZÙ[™ØÛÜ™J_OÜİ›Û™ÏÛX[‰ÚKœØÛÜ™P™Y›Ü™_H8¡¤ˆ	ÚKœØÛÜ™PY\ŸOÜÛX[Ø\XÛO\XÛOÜ[™^šYZ[™ÏÜÜ[İ›Û™Ï‰ÔÊKœ™[][ÛœÚ\
_OÜİ›Û™ÏÛX[‰ÚKœ™[][Û™Y›Ü™_H8¡¤ˆ	ÚKœ™[][ÛY\ŸOÜÛX[Ø\XÛO\XÛOÜ[’Ø[\˜š[[ÜÜ[İ›Û™Ï‰ÚKÚ[œßKÉÚK˜][\ßOÜİ›Û™ÏÛX[”ÚYYÙHÈ™\œİXÚOÜÛX[Ø\XÛO\XÛOÜ[“YØ\˜[™ÏÜÜ[İ›Û™Ï‰ÑœÊKœ˜[šĞY\‹›X™[
_OÜİ›Û™ÏÛX[‰ÚKœ˜[šĞ™Y›Ü™K›X™[OOZKœ˜[šĞY\‹›X™[Ø[™\°é™\˜	ÑœÊKœ˜[šĞ™Y›Ü™K›X™[
_H8¡¤ˆ	ÑœÊKœ˜[šĞY\‹›X™[
_XOÜÛX[Ø\XÛOÙ]ÙXİ[ÛˆÛ\ÜÏH›XYİYK[X\İ\KY[HÏ]XÚÙ[™[ÚXÚÛ[™ÏÚÏ‰Ø_OÜÏ‘œ™Z\ØÚ[[™ÏÚÏ‰ÑœÊÊ_OÜÜÙXİ[Û›Ûİ\]Ûˆ\OH˜]Ûˆˆ]K[XYİYK\™[X]Ú”™]˜[˜ÚOØ]Û]Ûˆ\OH˜]Ûˆˆ]K[XYİYK\›Üİ\–\ˆÙYÛ™\›Z]\Ø]ÛÙ›Ûİ\ÜÙXİ[Û˜Y[˜İ[Ûˆ\ÊJ^Û]YØİ[Y[™Ù][[Y[RY
˜]K[[Ù[
KYØİ[Y[™Ù][[Y[RY
˜]K[ÙØ
NÚYŠ][Š\™]\›Û]]œ]Y\TÙ[XİÜŠ›XYİYKXÚ[™[X]XË\İYÙX
NÚYŠˆ[œİ[˜Ù[ÙˆS[[Y[
YØİ[Y[˜Ü™X]Q[[Y[
ÙXİ[Û˜
K‹˜Û\ÜÓ˜[YOXXYİYKXÚ[™[X]XË\İYÙX‹˜™Y›Ü™JŠJKOOOX›Üİ\˜
^Ü‹™]\Ù]›[ÙOX›Üİ\˜‹š[›™\’SX]ˆÛ\ÜÏH›XYİYKX˜[›™\ˆÜ[‘”•TÕĞST‹SQĞOÜÜ[İ›Û™Ï”™Y[ˆ˜]]™^šYZ[™Ù[ˆ]Y‹ˆğé\™[ˆ˜]]Z[™[ˆİ[]Y‹Üİ›Û™ÏÙ]]ˆÛ\ÜÏH›XYİYK\Ú[İY]\È‰Ò›Ë›X\
OO“ÜÊKÚ[İY]X
JKš›Ú[Š
_OÙ]˜Ü™]\›Ÿ\‹™]\Ù]›[ÙOX˜]XÛ]OUËœÛ˜\Úİ

K˜Xİ]™UX[NÜ‹š[›™\’SX]ˆÛ\ÜÏH›XYİYKX\™[˜KX™ÈOÚOOÚO’UTÑQÈ0­È’S‘ÈUTÈĞSTS‘ÔÕ0çSØÙ]]ˆÛ\ÜÏH›XYİYKYšYÚ\‹\Ûİ^Y\ˆ‰ÓÜÊ^Y\˜šYÚ\˜
_Oİ›Û™Ï‰ÑœÊÊ
Kœ›Ùš[OË›˜[YOÏØX
_OÜİ›Û™ÏÙ]]ˆÛ\ÜÏH›XYİYKZ[\Xİ[^Y\ˆÙ]]ˆÛ\ÜÏH›XYİYKYšYÚ\‹\Ûİ[™[^H‰ÓÜÊ›ËšYÚ\˜
_Oİ›Û™Ï‰ÑœÊ[ÖÖ›×K›˜[YJ_OÜİ›Û™ÏÙ]]ˆÛ\ÜÏH›XYİYK\İ\ÜXØ\İ‰ÚK›X\

K
OO˜]ˆİ[OH‹K\İ\Ü‰İH‰ÓÜÊKİ\Ü
_OÛX[‰ÑœÊJ_OÜÛX[Ù]˜
Kš›Ú[Š
_OÙ]˜Y[˜İ[ÛˆÊK
^Û]YØİ[Y[œ]Y\TÙ[XİÜŠ›XYİYKXÚ[™[X]XË\İYÙX
NÚYŠJˆ[œİ[˜Ù[ÙˆS[[Y[
J\™]\›İÚ[™İË˜ÛX\•[Y[İ]
œÊKÚ[™İË˜ÛX\•[Y[İ]
\ÊK‹™]\Ù]˜]XÚÏ[ÊJK‹™]\Ù]›İ]ÛÛYO]š]İ˜Üš]XØ[ØÜš]XØ[˜]˜Z\ÜØ‹˜Û\ÜÓ\İœ™[[İ™J[š[X]K\^Y\˜[š[X]KXÛİ[\˜
K‹›Ù™œÙ]ÚY‹˜Û\ÜÓ\İ˜Y
[š[X]K\^Y\˜
NÛ][‹œ]Y\TÙ[XİÜŠ›XYİYKZ[\Xİ[^Y\˜
NÜ‰‰Š‹š[›™\’SXÜ[ˆÛ\ÜÏH›XYİYKYY™™XİY™™XİIÛÊJ_HÜÜ[‰İš]Ø	İ˜Üš]XØ[ØÔ’UTĞÒ0­È˜JÉİœ^Y\‘[XYÙ_X˜“Ô‘RXOØ˜
K\Ê›ÚY˜[š[X][ÛŠK\Ê›Ëš]Ø]˜\™İYX
K˜Ûİ[\‘[XYÙOŒ	‰Š\Ï]Ú[™İËœÙ][Y[İ]


OOÛ‹˜Û\ÜÓ\İ˜Y
[š[X]KXÛİ[\˜
K‰‰œ‹š[œÙ\Y˜XÙ[S
™Y›Ü™Y[™[O‘ÑQÑS‘”•TÕ
Éİ˜Ûİ[\‘[XYÙ_OÙ[O˜
_KÌÌ
JKœÏ]Ú[™İËœÙ][Y[İ]


OOÛ‹˜Û\ÜÓ\İœ™[[İ™J[š[X]K\^Y\˜[š[X]KXÛİ[\˜
K[]H‹™]\Ù]˜]XÚË[]H‹™]\Ù]›İ]ÛÛYK‰‰Š‹š[›™\’SX
_KN
_Y[˜İ[ÛˆÜÊK
^Û]V[ÖÙWK[Ëœ[]OÏÊOOOX^Y\˜ÖØÙMYØØØNM™LÙYMXXÍLLÍŒØNšÜÊJJNÜ™]\›˜]ˆÛ\ÜÏH›XYİYKXÚ\˜Xİ\ˆ	İHˆ]KXÚ\˜Xİ\H‰Ù_Hˆ]KXXØÙ\ÜÛÜOH‰ÛË˜XØÙ\ÜÛÜOÏØ›Û™XHˆİ[OH‹K\Ú\‰Ü–Ì_NËK\ÚYN‰Ü–ÌW_NËKXXØÙ[‰Ü–Ì—_NËKZZ\‰Ü–Ì×_HHÛ\ÜÏHœÚYİÈÚOÜ[ˆÛ\ÜÏH›YÜÈOÚOOÚOÜÜ[Ü[ˆÛ\ÜÏHÜœÛÈHÛ\ÜÏH˜\›HYÚOHÛ\ÜÏH˜\›HšYÚÚOØÜÜ[Ü[ˆÛ\ÜÏHšXYHÛ\ÜÏHšZ\ˆÚOˆÛ\ÜÏH™^YHYØˆÛ\ÜÏH™^YHšYÚØ[OÙ[OÜÜ[Ü[ˆÛ\ÜÏH˜XØÙ\ÜÛÜHÜÜ[Ù]˜Y[˜İ[ÛˆÜÊJ^Ü™]\›Ø[™™N–ØÙMYØØØNM™LÙYMXXÍLLÍŒØK™[™N–ØÌ™ØÌYYŒ˜ÙŒÎXXÌŒÌŒØK\œÎ–ØÍYÌ˜ÌÙÌXØMLÙÍÌŒK[›N–ØÌÎM™NYÌŒÍÍXÙNYYYŒ˜ÍXŒÎLØK™[^–ØÎXMXŒ˜ÍLÍÍØÙŒÙYNXÍ˜M˜ØKX[›šN–ØÍYÎMXÌÙLŒÌ˜ÙŒÌXÍMÍ™X_VÙWOÏÖØÍÍ˜ÍX˜ÌØØÙNX™L˜ÌØL˜LŒ˜_Y[˜İ[Ûˆ\ÊJ^Û]YØİ[Y[™Ù][[Y[RY
˜]K\^Y\‹X˜\˜
KYØİ[Y[™Ù][[Y[RY
˜]KY[™[^KX˜\˜
KYØİ[Y[™Ù][[Y[RY
˜]K\^Y\‹]˜[YX
KOYØİ[Y[™Ù][[Y[RY
˜]KY[™[^K]˜[YX
Nİ	‰Šœİ[KÚYX	ÙKœ^Y\‹™œ\İ˜][Û‹ÙKœ^Y\‹›X^œ\İ˜][ÛŠŒLIX
K‰‰Š‹œİ[KÚYX	ÙK™[™[^K™œ\İ˜][Û‹ÙK™[™[^K›X^œ\İ˜][ÛŠŒLIX
K‰‰Š‹^ÛÛ[X	ÓX]œ›İ[™
Kœ^Y\‹™œ\İ˜][ÛŠ_HÈ	ÙKœ^Y\‹›X^œ\İ˜][ÛŸX
KI‰ŠK^ÛÛ[X	ÓX]œ›İ[™
K™[™[^K™œ\İ˜][ÛŠ_HÈ	ÙK™[™[^K›X^œ\İ˜][ÛŸX
_Y[˜İ[ÛˆœÊ
^ÙØİ[Y[œ]Y\TÙ[XİÜ[
Ø˜]K[[İ™\Èœ›ÙÜ™\ÜÚ[Û‹\İ\ÜØ˜]K[[İ™\ÈœÚYÛ˜]\™KX]Û˜
K™›Ü‘XXÚ
OO™Kœ™[[İ™J
J_Y[˜İ[Ûˆ\ÊK
^İÚ[™İË™\Ü]Ú]™[
™]Èİ\İÛQ]™[
ËXØ[\ZYÛ‹X[š[X][Û˜Ù]Z[ÚY™K[š[X][Û_JJ_Y[˜İ[ÛˆœÊ
^ÒÏ]›ÚY›ÏX[Ï]›ÚY	Ï]›ÚY\ÏHLKœÏHLNÛ]OYØİ[Y[™Ù][[Y[RY
˜]K[[Ù[
NÙI‰Š[]HK™]\Ù]›XYİYPXİ]™K[]HK™]\Ù]›XYİYTÙ[Xİ
_Y[˜İ[ÛˆÊJ^Ü™]\›˜	ÙOLØ
Ø˜IÓX]œ›İ[™
J_XY[˜İ[ÛˆœÊJ^Ü™]\›ˆİš[™ÊJKœ™\XÙJÖÉ‰È—KÙËOOŠÈ‰ˆ˜	˜[\Ø˜	›Øˆ˜	™İØ‰È˜	ˆÌÎNØ	È‰Î˜	œ][İØJVÙWOÏÙJ_Y[˜İ[Ûˆ\Ê
^Û™]ÈT“ÙX\˜Ú\˜[\ÊØØ][Û‹œÙX\˜Ú
K™Ù]
Û[ÚÙX
OOOXX	‰ŠÚ[™İË—×ÛĞ˜]SXYİYU^ÜÚİÔ›Üİ\ŠOHL
^İœÊJ_Kİ\
KHL
^ØœÊK
_K[İ™JJ^ĞÜÊJ_KÙ]İ]JJ^ÒÉ‰ŠØš™Xİ˜\ÜÚYÛŠËJKKœ^Y\‰‰“Øš™Xİ˜\ÜÚYÛŠËœ^Y\‹Kœ^Y\ŠKK™[™[^I‰“Øš™Xİ˜\ÜÚYÛŠË™[™[^KK™[™[^JKÜÊ
J_Kš[š\Ú
OHL
^ÒÉ‰ŠË™š[š\ÚYHLËÛÛYKOÒË™[™[^K™œ\İ˜][ÛRË™[™[^K›X^œ\İ˜][Û’Ëœ^Y\‹™œ\İ˜][ÛRËœ^Y\‹›X^œ\İ˜][Û‹ÜÊ
KÜÊ
J_KÛ˜\Úİ

^Ü™]\›İ™\œÚ[Û’ÛËÜÛ™[Y–›Ëİ]N’ÏÜİXİ\™YÛÛ™JÊN›[™\İ[‰ÏÜİXİ\™YÛÛ™J	ÊN›[˜[šÎ›ÜÊËœÛ˜\Úİ

JK›Üİ\’›Ë›X\
OOŠÚY™K‹‹œÜÊËœÛ˜\Úİ

KJ_JJ___J_]\[ÙˆÚ[™İÏX	‰\[ÙˆØİ[Y[X	‰™œÊ
Nİ˜\ˆÏHLKœÏHLNÙ[˜İ[ÛˆœÊ
^Óß
ÏHLØİ[Y[˜Y]™[\İ[™\ŠÛXÚØOOÛ]YK\™Ù]İ[œİ[˜Ù[Ùˆ[[Y[	‰˜ÛÜÙ\İ
ØØ[\ZYÛ‹\ÚÜÙ]K\ÚÜKØØ[\ZYÛ‹\ÚÜÜÚÜ\™XÛÛ[Y[™Y
I‰ŠœÊ
KÚ[™İËœÙ][Y[İ]
œËÌŠJ_KL
KÚ[™İË˜Y]™[\İ[™\ŠËXØ[\ZYÛ‹[Y]XœÊK™]È]]][Û“ØœÙ\™\ŠOOÙKœÛÛYJOOÛ]YK\™Ù]Ü™]\›ˆ[œİ[˜Ù[Ùˆ[[Y[	‰ˆH]˜ÛÜÙ\İ
ØØ[\ZYÛ‹\ÚÜÜÚÜZ][\ËØØ[\ZYÛ‹\ÚÜœÚÜZ][X
_JI‰œÊ
_JK›ØœÙ\™JØİ[Y[™Øİ[Y[[[Y[ØÚ[\İˆLİX™YNˆLÚ\˜Xİ\‘]NˆLJKœÊ
J_Y[˜İ[ÛˆœÊ
^Ôœß
œÏHLÚ[™İËœÙ][Y[İ]


OOÔœÏHLKœÊ
_K
J_Y[˜İ[ÛˆœÊ
^Û]OYØİ[Y[™Ù][[Y[RY
Ø[\ZYÛ‹\ÚÜ
KYOËœ]Y\TÙ[XİÜŠ›Ü[š[™Ë]KXØ\XÛİ[
NÚYŠY_]
\™]\›ˆÛ]VË‹‹™Kœ]Y\TÙ[XİÜ[
œÚÜZ][H›Ûİ\ˆ˜
WKœ™YXÙJ
K
OO™JÊ[X™\Š^ÛÛ[
_
K
KX	ÛŸH	ÛOOLOØZ[˜Z[XXÜ™]\›ˆ^ÛÛ[OO\‰‰Š^ÛÛ[\ŠK™]\Ù]˜Ûİ[OOTİš[™ÊŠI‰Š™]\Ù]˜Ûİ[Tİš[™ÊŠJKŸ^œÊ
Nİ˜\ˆÏX[Ù[\™[ØY\ÏY[˜İ[ÛŠJ^Ü™]\›˜Õ[\Ë[Ù‹]KX›]YKPYšXKKÛË[XZ[‹Ø
Ù_KÜÏ^ßKÜÏY[˜İ[ÛŠKŠ^Û]T›ÛZ\ÙKœ™\ÛÛ™J
NÚYŠ	‰›[™İŒ
^Û]OYØİ[Y[™Ù][[Y[ĞUYÓ˜[YJ[šØ
KOYØİ[Y[œ]Y\TÙ[XİÜŠY]VÜ›Ü\OXÜÜ[›Û˜ÙWX
KOZOË››Û˜Ù_OË™Ù]]šX]J›Û˜ÙX
NÙ[˜İ[ÛˆÊJ^Ü™]\›ˆ›ÛZ\ÙK˜[
K›X\
OO”›ÛZ\ÙKœ™\ÛÛ™JJK[ŠOOŠÜİ]\Î˜[š[Y˜[YN™_JKOOŠÜİ]\Î˜™Z™XİY™X\ÛÛ™_JJJJ_Y[˜İ[ÛˆÊJ^Ü™]\›ˆ[\Ü›Y]Kœ™\ÛÛ™OÚ[\Ü›Y]Kœ™\ÛÛ™JJN›™]ÈT“
K[\Ü›Y]K\›
Kš™YŸ\[Ê›X\
OÚYŠU\ÊŠK\Ê
K[ˆÜÊ\™]\›ÕÜÖİOHLÛ]]™[™ÕÚ]
˜ÜÜØ
NÙ›ÜŠ]YK›[™İLNÛLÛ‹KJ^Û]OYVÛ—NÚYŠKš™YOO]	‰Š\ŸKœ™[OOXİ[\ÚY]
J\™]\›Ÿ[]OYØİ[Y[˜Ü™X]Q[[Y[
[šØ
NÚYŠKœ™[\Øİ[\ÚY]’ËŸ
K˜\ÏXØÜš\
KK˜Ü›ÜÜÓÜšYÚ[XKš™Y]I‰šKœÙ]]šX]J›Û˜ÙXJKØİ[Y[šXY˜\[™Ú[
JKŠ\™]\›ˆ™]È›ÛZ\ÙJ
KŠOOÚK˜Y]™[\İ[™\ŠØYJKK˜Y]™[\İ[™\Š\œ›Ü˜

OO›Š\œ›ÜŠ[˜X›HÈ™[ØYÔÔÈ›Üˆ	İX
JJ_J_JJ_Y[˜İ[ÛˆJJ^Û][™]È]™[
š]Nœ™[ØY\œ›Ü˜ØØ[˜Ù[X›NˆLJNÚYŠœ^[ØYYKÚ[™İË™\Ü]Ú]™[

K]™Y˜][™]™[Y
]›İÈ_\™]\›ˆ‹[ŠOÙ›ÜŠ]HÙˆ×JYKœİ]\ÏOOX™Z™XİY	‰šJKœ™X\ÛÛŠNÜ™]\›ˆJ
K˜Ø]Ú
J_J_KÜÏ[™]ÈT“ÙX\˜Ú\˜[\ÊØØ][Û‹œÙX\˜Ú
NÒÜË™Ù]
Û[ÚÙX
OOOXX	‰’ÜË™Ù]
Ü[š[™Ø
HOOXXÜÊ

OOš[\Ü
‹ÛÜ[š[™ÔÙ\]Y[˜ÙUKXÜŞXÒÑšœØ
K×JKJ
K\Ê
KÊ
Nİ˜\ˆ\ËœÏXÛ\ÜÈ^[™Èš^Ø™Y\”Û™ÎÙ˜\İØ[Y\ÎØÛÛœİXİÜŠK
^Û]YOOĞXJJK˜JJK
JKÚ[™İË™\Ü]Ú]™[
™]Èİ\İÛQ]™[
ËXØ[\ZYÛ‹[Z[šYØ[YK[İ]ÛÛYXÙ]Z[œİXİ\™YÛÛ™JJ_JJ_NÜİ\\ŠK‹XJNÛ]YØİ[Y[˜Ü™X]Q[[Y[
]Û˜
NÜ‹\OX]Û˜‹˜Û\ÜÓ˜[YOXš[X\HZ[šK\İ\™Y\‹\Û™Ë\İ\‹^ÛÛ[XÔQSÕT•S˜Kœ]Y\TÙ[XİÜŠÙ]K[Z[šKXœšYYš[™×X
OË˜\[™
ŠK\Ë˜™Y\”Û™Ï[™]ÈŠK‹

OO“XJ™Y\”Û™Ø
JK‹œ™[[İ™J
K\Ë™˜\İØ[Y\Ï[™]È˜JK‹XJK\Ï]\Ë	JJKKœ]Y\TÙ[XİÜŠÙ]K[Z[šKXÛÜÙWX
OË˜Y]™[\İ[™\ŠÛXÚØ

OOİÚ[™İË™\Ü]Ú]™[
™]Èİ\İÛQ]™[
ËXØ[\ZYÛ‹[Z[šYØ[YKXÛÜÙY
J_JK	Ê\ËJ_\İ\
J^ÚYŠOOOX™Y\”Û™Ø
^İ\Ë™˜\İØ[Y\ËœİÜ
LJKİ\\‹œİÜ
LJK\Ë˜™Y\”Û™Ëœİ\

NÜ™]\›ŸZYŠOOOXYÙTYXOOOXX\ÛÛX
^İ\Ë˜™Y\”Û™ËœİÜ
LJKİ\\‹œİÜ
LJK\Ë™˜\İØ[Y\Ëœİ\
JNÜ™]\›Ÿ]\Ë™˜\İØ[Y\ËœİÜ
LJK\Ë˜™Y\”Û™ËœİÜ
LJKİ\\‹œİ\
J_\İÜ
OHL
^İ\Ë™˜\İØ[Y\ÏËœİÜ
LJK\Ë˜™Y\”Û™ÏËœİÜ
LJKİ\\‹œİÜ
J_X™Y\”Û™ĞXİ]™J
^Ü™]\›ˆ\Ë˜™Y\”Û™Ëš\ĞXİ]™J
_X™Y\”Û™ÔÚÚ\Ûİ[İÛŠ
^İ\Ë˜™Y\”Û™Ë™XYÔÚÚ\Ûİ[İÛŠ
_X™Y\”Û™ÔÙ]İ]JJ^İ\Ë˜™Y\”Û™Ë™XYÔÙ]İ]JJ_X™Y\”Û™ÔÛ˜\Úİ

^Ü™]\›ˆ\Ë˜™Y\”Û™Ë™XYÔÛ˜\Úİ

_Y˜\İØ[YPXİ]™J
^Ü™]\›ˆ\Ë™˜\İØ[Y\Ëš\ĞXİ]™J
_Y˜\İØ[YTÚÚ\Ûİ[İÛŠ
^İ\Ë™˜\İØ[Y\Ë™XYÔÚÚ\Ûİ[İÛŠ
_Y˜\İØ[YTÙ]İ]JJ^İ\Ë™˜\İØ[Y\Ë™XYÔÙ]İ]JJ_Y˜\İØ[YPXİ[ÛŠ
^Û]O]\Ë™˜\İØ[Y\Ë™XYÔÛ˜\Úİ

NÙKœ\ÙOOOXÙX[	‰“[X™\ŠKœİX›U[YJOLŒ	‰\Ë™˜\İØ[Y\Ë™XYÔÙ]İ]JÜ\ÙN˜[Z[™Øœ™X]‹‹ØÚÙYÙX[“[X™\ŠKœÙX[
__JK\Ë™˜\İØ[Y\Ë™XYĞXİ[ÛŠ
_Y˜\İØ[YTÛ˜\Úİ

^Ü™]\›ˆ\Ë™˜\İØ[Y\Ë™XYÔÛ˜\Úİ

__K\ÏHLNÙ[˜İ[ÛˆÊ
^Ö\ß
\ÏHLÚ[™İË˜Y]™[\İ[™\ŠËXØ[\ZYÛ‹\İ\[Z[šYØ[YX
OOÈ\\ßYK™]Z[
\Ëœİ\
K™]Z[
KØİ[Y[˜›ÙK˜Û\ÜÓ\İ˜Y
Ø[\ZYÛ‹[[Ù[[Ü[˜
J_JJJ_]˜\ˆœÏHLNÙ[˜İ[Ûˆ\Ê
^Öœß
œÏHLÚ[™İË˜Y]™[\İ[™\ŠËXØ[\ZYÛ‹[Z[šYØ[YKXÛÜÙY

OOÛ]OVØÙ[™\šXË[[Ù[˜]K[[Ù[Z[šYØ[YK[[Ù[ÙYZÙ[™X\˜Ë[[Ù[K›X\
OO™Øİ[Y[™Ù][[Y[RY
JJKœÛÛYJOOˆHJI‰ˆYKšY[ŠJNÙØİ[Y[˜›ÙK˜Û\ÜÓ\İÙÙÛJØ[\ZYÛ‹[[Ù[[Ü[˜JNÛ]YØİ[Y[™Ù][[Y[RY
[\˜Xİ[Û‹\›Û\
KYØİ[Y[™Ù][[Y[RY
[\˜Xİ[Û‹]^
OË^ÛÛ[Ëš[J
Nİ	‰ˆYI‰ŠšY[H[ŠKÚ[™İË™\Ü]Ú]™[
™]Èİ\İÛQ]™[
ËXØ[\ZYÛ‹]ÛÜ›Z[œ]\™\İÜ™Y
J_JJ_Y[˜İ[Ûˆ	ÊK
^ÚYŠ™]ÈT“ÙX\˜Ú\˜[\ÊØØ][Û‹œÙX\˜Ú
K™Ù]
Û[ÚÙX
HOOXX
\™]\›Û]YK]Ú[™İÎÜ‹—×ÛÓZ[šYØ[YQ\™XİÜYK‹—×ÛÓZ[šYØ[YQXYÏ^Üİ\

^ÙKœİ\

_K™YÚ[Š
^İœ]Y\TÙ[XİÜŠ›Z[šK\İ\
OË˜ÛXÚÊ
_KÛÜÙJ
^İœ]Y\TÙ[XİÜŠÙ]K[Z[šKXÛÜÙWX
OË˜ÛXÚÊ
_KÚÚ\Ûİ[İÛŠ
^ÙK˜™Y\”Û™ĞXİ]™J
OÙK˜™Y\”Û™ÔÚÚ\Ûİ[İÛŠ
N™K™˜\İØ[YPXİ]™J
OÙK™˜\İØ[YTÚÚ\Ûİ[İÛŠ
N›‹œ[[YI‰Š‹œ[[YK˜Ûİ[İÛL
_KÙ]İ]J
^ÙK˜™Y\”Û™ĞXİ]™J
OÙK˜™Y\”Û™ÔÙ]İ]J
N™K™˜\İØ[YPXİ]™J
OÙK™˜\İØ[YTÙ]İ]J
N›‹œ[[YI‰“Øš™Xİ˜\ÜÚYÛŠ‹œ[[YKœİ]K
_KXİ[ÛŠ
^ÙK˜™Y\”Û™ĞXİ]™J
Oİœ]Y\TÙ[XİÜŠÙ]K[Z[šKXXİ[Û—X
OË˜ÛXÚÊ
N™K™˜\İØ[YPXİ]™J
OÙK™˜\İØ[YPXİ[ÛŠ
N›‹œš[X\PXİ[ÛŠ
_KÛ[™™[X\ÙJONLJ^Û]]œ]Y\TÙ[XİÜŠÙ]K[Z[šKXXİ[Û—X
NÛ‰‰Š‹™\Ü]Ú]™[
™]ÈÚ[\‘]™[
Ú[\™İÛ˜ØX˜›\ÎˆLÚ[\’Y™_JJKÚ[™İË™\Ü]Ú]™[
™]ÈÚ[\‘]™[
Ú[\\ØX˜›\ÎˆLÚ[\’Y™_JJJ_KÛ˜\Úİ

^Ü™]\›ˆK˜™Y\”Û™ĞXİ]™J
OÙK˜™Y\”Û™ÔÛ˜\Úİ

N™K™˜\İØ[YPXİ]™J
OÙK™˜\İØ[YTÛ˜\Úİ

N•˜JJ___]˜\ˆXÏX›ÙÜ™\ÜÚ[Û‹\™]Ø\™Ë[X\šÙ\œË]˜ÏVØ›\İ\™Y\”Û™Ø›[šŞX˜[K˜Ï[™]ÈÙ]
ØØ]\™^KXÛÛ\Z[ØZÙK[X\ÛØ]\™^KYX˜]XØ]\™^KXœ˜]ÛÙXÜ™][Z[[Û˜Z\™XX\›KY]šXİ[Û˜İ[™^KYš[˜[ÛÛ\]XJK˜Ï[™]ÈÙ]
Øœ™YK]ÙYZÙ[™œšY^K[Û[\XY‹‹›˜×JKXÏ[™]ÈÙ]
ØØZÙK[X\ÛØ]\™^KYX˜]XØ]\™^KXœ˜]ÛÙXÜ™][Z[[Û˜Z\™Xİ[™^KYš[˜[ÛÛ\]XJNÙ[˜İ[ÛˆXÊK
^Ü™]\›ŠK›Z[šT™\İ[ÖİOË˜][\ÏÏÌ
OŒY[˜İ[ÛˆØÊJ^Ü™]\›ˆK™›YÜÖØ[XÛÜ™K[Z[šYØ[Y\Ë][›ØÚÙY_˜Ëš\ÊKœ]Y\İİYÙJOÈLË™]™\JO˜XÊK
J_Y[˜İ[ÛˆØÊK
^Û][ØÊJNÚYŠOOXYÙTYX
^Û]YK™š\œİ™Y\“Ü[™YXÊK
_HYK™›YÜËšYÙT™[Y]™YÜ™]\›İ[›ØÚÙY›‹™X\ÛÛ›ØYHXÚÙ[›Ü[Ûˆİ\™H˜XÚ[H\œİ[ˆšY\ˆ[XÚİ˜˜\œİ\È\œİHšY\ˆ0í™™›™[‹˜[›ÙXÙYN˜\È\œİHšY\ˆ[™Z[™H[™ZY[™˜Zİ\ØÚH›\ÙK˜_ZYŠOOXX\ÛÛX
^Û]ZXËš\ÊKœ]Y\İİYÙJ_XÊK
_HYK™›YÜË›X\ÛÛUÛÛÜ™]\›İ[›ØÚÙY›‹™X\ÛÛ›ØX\ÛÈÜ^šX[\Şš\[ˆ\İZ[\ˆØ[\İYÜÜ]Y\İ˜˜X\Û°ïY\ÙH\Şš\[ˆ\œİ[ˆÙZ[™\ˆØ[\İYÜÜ]Y\İZ[‹˜[›ÙXÙYN˜X\ÛÛØ˜[\ˆ]ğéÚXÚØXÚ\İ˜_ZYŠOOX›Û›P˜]X
^Û][ŸXÊK
_HYK™›YÜËœ›Û›QY™X]YÜ™]\›İ[›ØÚÙYœ‹™X\ÛÛœØ˜XÚ[[ˆ™ZHÜ›ğçÙ[ˆÜY[[ˆZŞ™\Y\›Û›HZ[ˆœ\İY[˜˜\œİ›\İ\™Y\ˆÛ™È[™›[šŞX˜[Ù[›™[›\›™[‹˜[›ÙXÙYN˜›Û›K˜XÚ[H\ˆÙ[°ïÙ[™X]\šX[°ïˆZ[™[ˆ›Ü˜YÈÙ\Ø[[Y[]˜_ZYŠŠ\™]\›İ[›ØÚÙYˆL™X\ÛÛ˜[HÜ›ğçÙ[ˆZ[š\ÜY[H›ZX™[ˆ]Y\šYZİ]‹˜[›ÙXÙYN˜œ™Z]YËSÛ[\XYXNÚYŠOOX›\İ\
^Û]\˜Ëš\ÊKœ]Y\İİYÙJ_XÊK
NÜ™]\›İ[›ØÚÙY›‹™X\ÛÛ›Ø[™°êH\°í™™›™][ˆÜY[XX™[™Z]›\İ\˜˜\œİ[šİ[™]Y˜˜]H[™Ü\[™š[™[™ÈXœØÚYpçÙ[‹˜[›ÙXÙYN˜[™°êH[H™[Ü™Z\Ë˜_ZYŠOOX™Y\”Û™Ø
^Û]XXÊK›\İ\
_˜Ëš\ÊKœ]Y\İİYÙJ_XÊK
NÜ™]\›İ[›ØÚÙY›‹™X\ÛÛ›Øİ\ÚH\šÛ0é˜XÚ›\İ\\È™Y\‹TÛ™ËU\ØÚY[˜˜Y\œİ›\İ\Z[™\İ[œÈZ[›X[ÜY[[‹˜[›ÙXÙYN˜İ\ÚH]Yˆ\ˆ™\İÚY\ÙK˜_[]XXÊK™Y\”Û™Ø
_˜Ëš\ÊKœ]Y\İİYÙJ_XÊK
NÜ™]\›İ[›ØÚÙYœ‹™X\ÛÛœØ\œÈ[™™[^™\›YÙ[ˆYH°éÚİH\ÚØ[][ÛœÜİY™H[ˆ[ˆİ˜[™˜˜Y\œİ™Y\ˆÛ™ÈZ[™\İ[œÈZ[›X[ÜY[[‹˜[›ÙXÙYN˜\œÈ[™™[^[Hİ˜[™˜_Y[˜İ[ÛˆØÊJ^Ü™]\›–Ø›\İ\™Y\”Û™Ø›[šŞX˜[YÙTYXX\ÛÛX›Û›P˜]XK™š[\ŠOœØÊK
K[›ØÚÙY
_Y[˜İ[ÛˆÊKŠ^ÚYŠKœ]Y\İİYÙOOOX™][š[Û˜
^Û]Q™š[™
OOˆ]™›YÜÖØY]IÙ_XJNÚYŠŠ\™]\›İ]N˜š[™HYH›Ø›[]°éÙ\˜^˜°éÚİ\ˆØÚš]ˆ	Ù˜ÊŠ_Hš[™[‹ˆ\œİ[˜XÚÚ\™YH°éÚİH\œÛÛˆX\šÚY\˜\™Ù]Y›‹Ûİ\˜ÙN˜™][š[Û˜NÚYŠK˜Xİ]™UX[K›[™İOOL
\™]\›İ]N˜X[H[HYÙ\™™]Y\ˆš[[˜^˜[HÙY[™[‹ˆğéH™]Z[™\İ[œÈZ[™[ˆZİ]™[ˆ™YÛZ]\ˆ[HYÙ\™™]Y\‹˜\™Ù]Y˜Ø[\š\™XÛİ\˜ÙN˜™][š[Û˜_ZYŠ˜Ëš\ÊKœ]Y\İİYÙJI‰ˆ[˜Ëš\ÊKœ]Y\İİYÙJJ^ÚYŠXXÊK›\İ\
J\™]\›İ]N˜\°í™™›[™È[H™[Ü™Z\Ø^˜[™°êH°ï›\İ\Z[‹ˆÜY[HYH\œİH\Şš\[‹[Z]YH°éÚİHœ™ZYÙ\ØÚ[]Ú\™˜\™Ù]Y˜›\İ\Ûİ\˜ÙN˜Z[šYØ[YXNÚYŠXXÊK™Y\”Û™Ø
J\™]\›İ]N˜İ\ÚH0ï™\›š[[][ˆ\ØÚ^˜™Y\ˆÛ™È\İœ™ZYÙ\ØÚ[]ˆğéH›Ü›X[[ˆİ\™ˆÙ\ˆ]YœÙ]™\ˆ[™ÜY[HZ[™H\YK˜\™Ù]Y˜™Y\”Û™ØÛİ\˜ÙN˜Z[šYØ[YXNÚYŠXXÊK›[šŞX˜[
J\™]\›İ]N˜\ˆİ˜[™™\›[™İ™]ÙYİ[™Ø^˜\œÈ[™™[^°ï™[ˆ›[šŞX˜[Z[‹ˆXœÛÛšY\™HYHš]HÜ›ğçÙH\Şš\[‹˜\™Ù]Y˜›[šŞX˜[Ûİ\˜ÙN˜Z[šYØ[YXNÚYŠYK™›YÜËœ›Û›QY™X]Y
\™]\›İ]N˜›Û›\È[™ÙYœ˜Yİ\ˆ›Ü˜YØ^˜[HÜ›ğçÙ[ˆZ[š\ÜY[H›ZX™[ˆZİ]‹ˆ™]Ø[›ˆ›Û›H[Hœ\İY[Ù\İÜÙ\™[‹˜\™Ù]Y˜›Û›XÛİ\˜ÙN˜š]˜[_\™]\›ˆŸY[˜İ[ÛˆXÊJ^Ü™]\›ˆÊŒMŠÓX]›X^
KLJJ‹ŒKŒM‹ŒÍ
_Y[˜İ[ÛˆÊK
^Û]YK™š[\ŠOO™KÙZYÚŒ
K[‹œ™YXÙJ
K
OO™JİÙZYÚ
NÚYŠ\Š\™]\›Û]O\ÊNNNNNJJœÙ›ÜŠ]HÙˆŠZYŠKOYKÙZYÚOL
^Û]SX]›X^
KX]™›ÛÜŠK›Z[ÏÌJJKSX]›X^
‹X]™›ÛÜŠK›X^ÏÛŠJKO\ÊNNNNNJJNMÉLNÜ™]\›ÚY™KšY[[İ[›ŠÓX]™›ÛÜŠJŠ‹[ŠÌJJ__[]O[‹˜]
LJNÜ™]\›ˆOŞÚY˜KšY[[İ[“X]›X^
KX]™›ÛÜŠK›Z[ÏÌJJ_N›ÚYY[˜İ[Ûˆ˜ÊJ^Ü™]\›Ø[™™N˜[™°êX™[™N˜™[°êX\œÎ˜\œØ[›N˜[›XÜ™YÛÜ˜Ü™YÛÜ˜X\Û˜X\ÛØÚX™\˜ØÚX™\™[^˜™[^ØÚ[XN˜ØÚ[XXVÙWOÏÙ_Y[˜İ[ÛˆÊKŠ^Ü™]\›ˆX]›X^
X]›Z[Š‹JJ_]˜\ˆXÏ[™]ÈX\
Û‹›X\
OO–ÙKšYKœ˜Y]\×JJKÏ[™]ÈÙ]ØÏV×KØË˜ËXÏHLK˜ËÏLØÏLĞØÊ
KØÊ
KXÊ
KÊ
KØÊ
KXÊ
K˜Ê
KØÊ
KÛ

KÊ
KËœİXœØÜšX™J

OOÕÊ
KË™›Ü‘XXÚ
OO™J
JKØÊ
_JKÚ[™İË˜Y]™[\İ[™\ŠËXØ[\ZYÛ‹]ÛÜ›Z[œ]\™\İÜ™YØÊKÚ[™İË˜Y]™[\İ[™\ŠËXØ[\ZYÛ‹[Z[šYØ[YKXÛÜÙY

OOÚYŠX˜Ê\™]\›Û]OX˜ÎØ˜Ï]›ÚYÚ[™İËœÙ][Y[İ]


OO‰ÊKšÚXÚÙ\‹K]KK^
KLŒ
_JNÙ[˜İ[ÛˆØÊ
^Û]OZÜ‹œ›İİ\NÚYŠK—×Ü›ÙÜ™\ÜÚ[Û•”İÜ™PØ\\™J\™]\›ÙK—×Ü›ÙÜ™\ÜÚ[Û•”İÜ™PØ\\™OHLÛ]YKœİXœØÜšX™NÙKœİXœØÜšX™OY[˜İ[ÛŠJ^Û]]\ÎÜ™]\›ˆØß[‹˜Ø[
\ËO×ØÏOO[‰‰Š˜Ï]Ê
KË™›Ü‘XXÚ
OO™J
JKØÊ
JKJ
_J__Y[˜İ[ÛˆØÊ
^Û]O]]œ›İİ\NÚYŠK—×Ü›ÙÜ™\ÜÚ[Û•“Øš™Xİ]™J\™]\›ÙK—×Ü›ÙÜ™\ÜÚ[Û•“Øš™Xİ]™OHLÛ]YK›Øš™Xİ]™NÙK›Øš™Xİ]™OY[˜İ[ÛŠ
^Û]O]˜Ø[
\ÊNÜ™]\›ˆÊ\ËœÛ˜\Úİ

KÊ
KË‹‹™KÛİ\˜ÙN˜İÜXJ__Y[˜İ[ÛˆÊ
^Û]OUËœÛ˜\Úİ

KUË›Øš™Xİ]™J
NÙ›ÜŠ]ˆÙˆÛŠ^Û][XË™Ù]
‹šY
OÏÛ‹œ˜Y]\ÎÚYŠ‹šÚ[™OOXİÜX
[‹œ˜Y]\Ï[‹šYOO]\™Ù]YÜŒÙ[ÙHYŠ‹šÚ[™OOXZ[šYØ[YX
^Û]V˜Ê‹šY
NÛ‹œ˜Y]\Ï]	‰œØÊK
K[›ØÚÙYÜŒY[ÙH‹œ˜Y]\Ï\Ÿ_Y[˜İ[ÛˆXÊ
^Û]OV[‹œ›İİ\NÙK—×Ü›ÙÜ™\ÜÚ[Û•“X\šÙ\Ÿ
K—×Ü›ÙÜ™\ÜÚ[Û•“X\šÙ\HLK™˜]Ò[\˜Xİ[Û“X\šÙ\œÏY[˜İ[ÛŠ
^Û]O]\ËYK˜Y˜Ú\˜ÛJMÌNLKŒN
KœÙ]İ›ÚÙTİ[JMÍÌÌMMŠKœÙ]\
L™LÊKYK˜Y˜Ú\˜ÛJMÍJKœÙ]\
LŒJKYK˜Y^
Ù›Û˜[Z[N˜\šX[›XÚËŞ\İ[K]ZX›ÛÚ^™N˜L\ÛÛÜ˜Ù™™˜XÚÙÜ›İ[™ÛÛÜ˜ÌLŒY™ŒY[™ÎŞN_Kİ›ÚÙN˜ÌÌLÌ˜İ›ÚÙUXÚÛ™\ÜÎŒŸJKœÙ]ÜšYÚ[ŠJKœÙ]\
LŒŠNÙKÙY[œË˜Y
İ\™Ù]ÎØØ[NÙœ›ÛN‹‹ÎŒKŒÍK[NÙœ›ÛN‹L‹Î‹ŒLŸK\˜][ÛLŒ™\X]‹L_JKØÊÏLNÛ]OJ
OOÛ]OUË›Øš™Xİ]™J
KOVXÊK\™Ù]Y
KOHHZNİœÙ]š\ÚX›JJK‹œÙ]š\ÚX›JJK‹œÙ]š\ÚX›JJKI‰ŠœÙ]ÜÚ][ÛŠKKKLÎ
K‹œÙ]ÜÚ][ÛŠKKKLÎ
K‹œÙ]ÜÚ][ÛŠKKJÌÎ
KœÙ]^
°áÒÕTÈ’QS0­È	ÙK]_X
J_NÚË˜Y
JKK™]™[Ë›Û˜ÙJK”ØÙ[™\Ë‘]™[Ë”ÒUÕÓ‹

OOÚË™[]JJKØÏSX]›X^
ØËLJ_JKJ
_J_Y[˜İ[ÛˆÊ
^Û]ORœËœ›İİ\NÚYŠK—×Ü›ÙÜ™\ÜÚ[Û•‘Ø]J\™]\›ÙK—×Ü›ÙÜ™\ÜÚ[Û•‘Ø]OHLÛ]YKœİ\ÙKœİ\Y[˜İ[ÛŠJ^Û]V˜ÊJNÚYŠŠ^Û]O\ØÊËœÛ˜\Úİ

KŠNÚYŠYK[›ØÚÙY
^ŞÊÏLK
“ĞÒÑTÔT”•0­È	ÙKœ™X\ÛÛŸX
NÜ™]\›Ÿ_]˜Ø[
\ËJ_KØİ[Y[˜Y]™[\İ[™\ŠÛXÚØOOÛ]YK\™Ù][œİ[˜Ù[Ùˆ[[Y[ÙK\™Ù]˜ÛÜÙ\İ
]Û˜
N›[ÚYŠJ[œİ[˜Ù[ÙˆS]Û‘[[Y[
_]^ÛÛ[Ëš[˜ÛY\Êœ\İY[™YÚ[›™[˜
J\™]\›Û]\ØÊËœÛ˜\Úİ

K›Û›P˜]X
NÛ‹[›ØÚÙY
Kœ™]™[Y˜][

KKœİÜ[[YYX]T›ÜYØ][ÛŠ
KÊÏLK
“Ó“–HR•Pˆ0­È	Û‹œ™X\ÛÛŸX
J_KL
_Y[˜İ[ÛˆØÊ
^Û]OV‹œ›İİ\NÚYŠK—×Ü›ÙÜ™\ÜÚ[Û•‘Y™šXİ[J\™]\›ÙK—×Ü›ÙÜ™\ÜÚ[Û•‘Y™šXİ[OHLÛ]YKœİ\YK˜™YÚ[“ÜÛ™[\›‹YKœÚ[\‘İÛ‹OYKœÚ[\“[İ™KOYKœŞ[˜ÓX™[ÎÙKœİ\Y[˜İ[ÛŠ
^İ˜Ø[
\ÊNÛ]O]\ËS[X™\ŠK˜ÛÛ^ËÚ[œÏÏÌ
KYK˜ÛÛ^Ë˜™\İ]X[]OOOX\™™XİÙKœİ]I‰ŠKœİ]Kœ^Y\İ\Ï\ŸLÍ›LOÍÎKœİ]K™Y™šXİ[UY\\ŸLØ^\›LOØY˜[˜ÙY˜İ[™\™\\ØKœİ]Kœ™]šY]ĞÛİ™\˜YÙO\ŸLËN›LOË‹ÌŠKK˜ÛÜK^ÛÛ[XHİ\\İ\ˆZ]	ÙKœİ]OËœ^Y\İ\ÏÏÎHZYÙ[™[ˆ™XÚ\›‹ˆYHšY[[™H™ZYİšXÚYZˆYHÙ\Ø[]H›YØ˜ZÈ\ˆÙYÛ™\ˆšY™]]XÚ0éYšYÙ\‹˜Kš[^ÛÛ[Xİ\™˜\Ø™[ˆğé[‹ˆ˜[Ü™ZY™[‹\°ïÚŞšYZ[ˆ[™Z]™\šğï\ˆšY[[™HÜÛ\ÜÙ[‹˜ØÊJKXÊJ_KK˜™YÚ[“ÜÛ™[\›Y[˜İ[ÛŠ
^Û‹˜Ø[
\ÊNÛ]O]\ÎÚYŠYKœİ]_Kœİ]Kœ\ÙHOOXÜÛ™[
\™]\›Û]S[X™\ŠK˜ÛÛ^ËÚ[œÏÏÌ
KS[X™\ŠK˜ÛÛ^Ë˜][\ÏÏÌ
KOYK˜ÛÛ^Ë˜™\İ]X[]OOOX\™™XİOYK˜ÛÛ^Ë™›YÜÏË–Ø\™\‹\İ\ÚK\Û™ØOËŒŒÏX[
M
ÓX]›Z[ŠŒŠ‹ŒMJJÓX]›Z[ŠŒL‹
‹ŒJJÊOËŒNŒ
KXKKÍŠNÙKœİ]K›ÜÛ™[]Ú[˜ÙO[ËKœİ]K›ÜÛ™[Ú[][›

OßKKœÚ[\‘İÛY[˜İ[ÛŠJ^Ü‹˜Ø[
\ËJK˜Ê\Ê_KKœÚ[\“[İ™OY[˜İ[ÛŠJ^ÚK˜Ø[
\ËJK˜Ê\Ê_KKœŞ[˜ÓX™[ÏY[˜İ[ÛŠ
^ØK˜Ø[
\ÊKXÊ\Ê__Y[˜İ[ÛˆØÊJ^ÚYŠKœ›Ûİœ]Y\TÙ[XİÜŠœ›ÙÜ™\ÜÚ[Û‹]‹\Û™Ë[[Ù\Ø
J\™]\›Û]YØİ[Y[˜Ü™X]Q[[Y[
ÙXİ[Û˜
Nİ˜Û\ÜÓ˜[YOX›ÙÜ™\ÜÚ[Û‹]‹\Û™Ë[[Ù\Øš[›™\’SXÜ[•ÕT‘T•UTÕğáSÜÜ[]‚ˆ]Ûˆ\OH˜]Ûˆˆ]K\Û™Ë[[ÙOH™\™Xİİ›Û™Ï““Ô“PSTˆÕT‘Üİ›Û™ÏÛX[ŒH™XÚ\ˆ0­ÈšXÚXÙZ˜˜\ÜÛX[Ø]Û‚ˆ]Ûˆ\OH˜]Ûˆˆ]K\Û™Ë[[ÙOH˜›İ[˜ÙHİ›Û™ÏUQ”ÑU‘TÜİ›Û™ÏÛX[Œˆ™XÚ\ˆpí™ÛXÚ0­ÈØ[›ˆÙX›ØÚİÙ\™[ÜÛX[Ø]Û‚ˆÙ]˜K˜Ø[˜\Ë˜™Y›Ü™J
Kœ]Y\TÙ[XİÜ[
Ù]K\Û™Ë[[ÙWX
K™›Ü‘XXÚ
O˜Y]™[\İ[™\ŠÛXÚØ

OOÛ]YKœİ]NÈ[Ÿ‹œ[›š[™É‰›‹œ\ÙHOOX™XYX
‹›[ÙO]™]\Ù]œÛ™Ó[ÙOOOX›İ[˜ÙXØ›İ[˜ÙX˜\™XİK˜Xİ[Û‹^ÛÛ[XÕT‘T•ˆ	Û‹›[ÙOOOX›İ[˜ÙXØUQ”ÑU‘T˜˜T‘RÕXKœÙ]™YY˜XÚÏËŠÕT‘T•‹›[ÙOOOX›İ[˜ÙXØ]YœÙ]™\ˆš\ÚØ[X™\ˆÙZH™XÚ\ˆpí™ÛXÚ˜˜›Ü›X[\ˆİ\™ˆ°éš\Ù\ˆ[™šXÚ›ØÚØ˜\‹˜™]]˜[
KXÊJJ_JJ_Y[˜İ[ÛˆXÊJ^Û]YKœ›Ûİœ]Y\TÙ[XİÜŠœ›ÙÜ™\ÜÚ[Û‹]‹\Û™Ë[[Ù\Ø
KYKœİ]NÈJ[œİ[˜Ù[ÙˆS[[Y[
_[Ÿ
™]\Ù]›[ÙO[‹›[ÙKœ]Y\TÙ[XİÜ[
Ù]K\Û™Ë[[ÙWX
K™›Ü‘XXÚ
OOÛ]YK™]\Ù]œÛ™Ó[ÙOOO[‹›[ÙNÙK˜Û\ÜÓ\İÙÙÛJÙ[XİY
KKœÙ]]šX]J\šXK\™\ÜÙYİš[™Ê
JKK™\ØX›YHHJ‹œ[›š[™É‰›‹œ\ÙHOOX™XYX
_JJ_Y[˜İ[Ûˆ˜ÊJ^Û]YKœİ]NÚYŠ]Ëœ™]šY]ÏË›[™İ
\™]\›Û]S[X™\Šœ™]šY]ĞÛİ™\˜YÙOÏËÌŠK]›[ÙOOOX›İ[˜ÙXÓX]›X^
‹KŒ
N›İœ™]šY]Ï]œ™]šY]ËœÛXÙJX]›X^
X]œ›İ[™
œ™]šY]Ë›[™İ
œŠJJ_Y[˜İ[ÛˆXÊ
^Û]O]]œ›İİ\NÚYŠK—×Ü›ÙÜ™\ÜÚ[Û•”™]Ø\™Ê\™]\›ÙK—×Ü›ÙÜ™\ÜÚ[Û•”™]Ø\™ÏHLÛ]YKœÙ]İYÙNÙKœÙ]İYÙOY[˜İ[ÛŠKŠ^İ˜Ø[
\ËKŠKOOOXœ™YK]ÙYZÙ[™	‰“˜Ê\Ê_NÛ]YKÚ[]]Üš]P˜]NÙKÚ[]]Üš]P˜]OY[˜İ[ÛŠ
^Û‹˜Ø[
\ÊKXÊ]]Üš]Xİ[™[HÚXÚY\Ú[YÈZ[™[ˆÙYÙ[œİ[™]\È\ˆ[™ØXÚ[šÚ\İHœ™ZK˜
_NÛ]YKœ™XÛÜ™Z[šQØ[YNÙKœ™XÛÜ™Z[šQØ[YOY[˜İ[ÛŠK‹KJ^Û]Ï]\ËœÛ˜\Úİ

NÜ‹˜Ø[
\ËK‹KJNÛ]Ï]\ÎÔÊËKÊK	‰™OOOX›Û›P˜]X	‰’XÊ›Û›KIÜËœİ]K›Z[šT™\İ[ÖÙWOË˜][\ÏÏÌ_X›Û›H™\›Y\\Èœ\İY[[™\šÛ0é[ˆ™Z\È°ïÚİÚ\šÙ[™\ˆİ˜]YÚYK˜
_NÛ]OYK˜ÛÛ™\œØ][ÛÙK˜ÛÛ™\œØ][ÛY[˜İ[ÛŠJ^Û]ZK˜Ø[
\ËJNÜ™]\›ˆ˜Ê\ËK
KNÛ]OYKÚ[”Ø]\™^Pœ˜]ÛÙKÚ[”Ø]\™^Pœ˜]ÛY[˜İ[ÛŠ
^ØK˜Ø[
\ÊKXÊØ]\™^KXœ˜]ÛÚ\ØÚ[ˆÛ[[Xœ™][™ğï™\™\İ[ˆYYİ0ï™\œ˜\ØÚ[™œ˜]XÚ˜\™H™]]K˜
_NÛ]ÏYKÚ[‘š[˜[˜]NÙKÚ[‘š[˜[˜]OY[˜İ[ÛŠ
^ÛË˜Ø[
\ÊKXÊİ[™^KYš[˜[YH™\İ[™[™HX›˜ZYH[™]Z]Z[™[HÙYÙ[œİ[™]\È\ˆÙ™š^šY[[ˆ[›Ù™š^šY[RÚ\İK˜
__Y[˜İ[Ûˆ˜ÊJ^ÙKœİ]K™›YÜÖØZ[šYØ[YKZ[›ÙXÙYY›\İ\_
Kœİ]K™›YÜÖØZ[šYØ[YKZ[›ÙXÙYY›\İ\OHLKœİ]K›\İ]™[X[™°êHİ[[H™[Ü™Z\È™XÚ\ˆ]Yˆ›\İ\\İYH\œİH\Şš\[‹˜K™[Z]

K	Ê‘UQHTÖ’TS˜[™°êH\°í™™›™]›\İ\ÜY[H›\İ\Z[™\İ[œÈZ[›X[ˆ[˜XÚ°ïİ\ÚH™Y\ˆÛ™ÈZ[‹˜
J_Y[˜İ[ÛˆÊKŠ^İOOX›\İ\	‰ˆYKœİ]K™›YÜÖØZ[šYØ[YKZ[›ÙXÙYX™Y\”Û™ØI‰ŠKœİ]K™›YÜÖØZ[šYØ[YKZ[›ÙXÙYX™Y\”Û™ØOHLKœİ]K›\İ]™[Xİ\ÚH\šÛ0éˆ™Y\ˆÛ™È\İ™]]Yˆ\ˆ™\İÚY\ÙHœ™ZYÙ\ØÚ[]˜K™[Z]

KXÊ‘UQHTÖ’TS˜İ\ÚH°ï™Y\ˆÛ™ÈZ[˜›Üˆ™Y[Hİ\™ˆÚ\™]\Ù°ïÚÛXÚÚ\ØÚ[ˆ›Ü›X[[Hİ\™ˆ[™]YœÙ]™\ˆÙ]ğé˜
JKOOX™Y\”Û™Ø	‰ˆYKœİ]K™›YÜÖØZ[šYØ[YKZ[›ÙXÙYY›[šŞX˜[I‰ŠKœİ]K™›YÜÖØZ[šYØ[YKZ[›ÙXÙYY›[šŞX˜[OHLKœİ]K›\İ]™[X\œÈ[™™[^™\›YÙ[ˆYH°éÚİH\ÚØ[][ÛœÜİY™H[ˆ[ˆİ˜[™ˆ›[šŞX˜[\İœ™ZYÙ\ØÚ[]˜K™[Z]

KXÊ‘UQHTÖ’TS˜›[šŞX˜[šYZ[ˆ[ˆİ˜[™XœÛÛšY\™HYHš]H\Şš\[È[˜XÚ›ZX™[ˆ[HÜ›ğçÙ[ˆÜY[H]Y\šYZİ]‹˜
JKOOX›[šŞX˜[	‰ˆ[‹™›YÜÖØ[XÛÜ™K[Z[šYØ[Y\Ë][›ØÚÙYI‰ŠKœİ]K™›YÜÖØ[XÛÜ™K[Z[šYØ[Y\Ë][›ØÚÙYOHLKœİ]K™›YÜÖØZ[šYØ[YKZ[›ÙXÙY\›Û›P˜]XOHLKœİ]K›\İ]™[X[HÜ›ğçÙ[ˆZ[š\ÜY[H›ZX™[ˆZİ]‹ˆ›Û›HZŞ™\Y\[ˆZ[ˆœ\İY[˜K™[Z]

KXÊÔQSPP‘S‘“ÓÕ0á‘QØ[\È›ZXÜY[˜\˜›\İ\™Y\ˆÛ™È[™›[šŞX˜[›ZX™[ˆ]Y\šYZİ]‹ˆ›Û›\Èœ\İY[\İœ™ZYÙ\ØÚ[]˜
J_Y[˜İ[Ûˆ˜ÊKŠ^ÚYŠWØßKœİ]K™›YÜÖØÛÛ™\œØ][Û‹YÚYIİKIÙKœİ]Kœ]Y\İİYÙ_XJ\™]\›Û]XÛÛ™\œØ][Û‹YÚY\›ÛIİKIÙKœİ]Kœ]Y\İİYÙ_KIÓX]›Z[Š‹Ê_XÚYŠYKœİ]K™›YÜÖÜ—J^ÚYŠKœİ]K™›YÜÖÜ—OHL›

O]XÊŠJ^ÙKœİ]K™›YÜÖØÛÛ™\œØ][Û‹YÚYIİKIÙKœİ]Kœ]Y\İİYÙ_XOHLÛ]YÊ˜Ê
K›

JNÛ‰‰“Ê‹šY‹˜[[İ[	Ü›

_HØÚ[šİ\ˆ	Û‹˜[[İ[påÈ	ÚÛ‹šYOË›X™[ÏÛ‹šYK˜ÚY
_YK™[Z]

__Y[˜İ[ÛˆXÊK
^Û]UËX˜]K\™]Ø\™IÙ_XÚYŠ‹œİ]K™›YÜÖÜ—J\™]\›Û‹œİ]K™›YÜÖÜ—OHLÛ]OYÊ˜Ë›

JNÚI‰“ÊKšYK˜[[İ[	İHH\š0éİ	ÚK˜[[İ[påÈ	ÚÚKšYOË›X™[ÏÚKšYK˜˜]X
K‹™[Z]

_Y[˜İ[ÛˆÊK‹Š^Ü™]\›ˆWØßZÙW_LÈLNŠØËœİ]Kš[™[ÜVÙWOSX]›Z[ŠNK[X™\ŠØËœİ]Kš[™[ÜVÙWOÏÌ
Jİ
KØË˜YÚ›ÛšXÛJ‹ÛÛÙ
KØË™[Z]

K[
K‹ŠKL
_]˜\ˆ˜ÏVŞÚY˜Ø\ÜÙ\˜ÙZYÚŒŒ‹Z[ŒKX^ŒŸKÚY˜Ú\ØÙZYÚŒNKÚY˜ØY™™YXÙZYÚŒMKÚY˜šY\˜ÙZYÚŒMßKÚY˜X›]XÙZYÚŒL_KÚY˜İY\œİXÙZYÚ_KÚY˜ÛÜ\Y\˜ÙZYÚŸKÚY˜˜]YXÙZYÚŒßWNÙ[˜İ[Ûˆ˜ÊJ^Ü™]\›Ø[™™N–ŞÚY˜Ø\ÜÙ\˜ÙZYÚKÚY˜ØY™™YXÙZYÚŒßKÚY˜Ú\ØÙZYÚŒŸWK™[™N–ŞÚY˜Ø\ÜÙ\˜ÙZYÚKÚY˜X›]XÙZYÚŒßKÚY˜ÛÜ\Y\˜ÙZYÚŒ_WK\œÎ–ŞÚY˜šY\˜ÙZYÚ_KÚY˜Ú\ØÙZYÚŒßKÚY˜Ø\ÜÙ\˜ÙZYÚŒŸWK[›N–ŞÚY˜Ú\ØÙZYÚKÚY˜šY\˜ÙZYÚŒßKÚY˜˜]YXÙZYÚŒ_WKÜ™YÛÜ–ŞÚY˜Ø\ÜÙ\˜ÙZYÚ_KÚY˜ØY™™YXÙZYÚŒßWKX\Û–ŞÚY˜šY\˜ÙZYÚKÚY˜İY\œİXÙZYÚŒßKÚY˜Ú\ØÙZYÚŒŸWKØÚX™\–ŞÚY˜ØY™™YXÙZYÚKÚY˜X›]XÙZYÚŒßKÚY˜Ø\ÜÙ\˜ÙZYÚŒŸWK™[^–ŞÚY˜Ø\ÜÙ\˜ÙZYÚKÚY˜Ú\ØÙZYÚŒßKÚY˜ØY™™YXÙZYÚŒŸWKØÚ[XN–ŞÚY˜šY\˜ÙZYÚKÚY˜˜]YXÙZYÚŒŸKÚY˜Ø\ÜÙ\˜ÙZYÚŒŸWKX[›šN–ŞÚY˜İY\œİXÙZYÚKÚY˜šY\˜ÙZYÚŒßKÚY˜ÛÜ\Y\˜ÙZYÚŒŸWKİ\ÚN–ŞÚY˜Ø\ÜÙ\˜ÙZYÚKÚY˜Ú\ØÙZYÚŒßKÚY˜šY\˜ÙZYÚŒŸWK[N–ŞÚY˜Ø\ÜÙ\˜ÙZYÚŸKÚY˜ØY™™YXÙZYÚŒŸWKÚ\˜N–ŞÚY˜ØY™™YXÙZYÚ_KÚY˜Ú\ØÙZYÚŒßWK›Û›N–ŞÚY˜Ú\ØÙZYÚKÚY˜Ø\ÜÙ\˜ÙZYÚŒßKÚY˜šY\˜ÙZYÚŒ_WKİ[™[N–ŞÚY˜ØY™™YXÙZYÚKÚY˜Ø\ÜÙ\˜ÙZYÚŒßKÚY˜ÛÜ\Y\˜ÙZYÚŒ_WK[N–ŞÚY˜Ø\ÜÙ\˜ÙZYÚKÚY˜ØY™™YXÙZYÚŒŸW_VÙWOÏÔ˜Ë™š[\ŠOO™KšYOOX˜]YX
_Y[˜İ[Ûˆ˜Ê
^Û™]È]]][Û“ØœÙ\™\Š˜ÊK›ØœÙ\™JØİ[Y[™Øİ[Y[[[Y[ØÚ[\İˆLİX™YNˆLJKÚ[™İË˜Y]™[\İ[™\ŠØY˜ÊK˜Ê
_Y[˜İ[Ûˆ˜Ê
^Û]OYØİ[Y[œ]Y\TÙ[XİÜŠ›Ü[š[™Ë]K\ÜXÙX
NÚYŠJH[œİ[˜Ù[ÙˆS[[Y[
_K™]\Ù]œXÚ[™ÕŠ\™]\›ÙK™]\Ù]œXÚ[™ÕXXÛ]S[X™\ŠØØ[İÜ˜YÙK™Ù]][J[\ËX›]YKXYšXKZ[›ËY\˜][Û‹]˜
JKVÍLËLËÎL×Kš[˜ÛY\Ê
OİLÎÒÊK‹LJNÛ]YKœ]Y\TÙ[XİÜŠ›Ü[š[™Ë]KZ[›ËXÛÛ›ÛØ
NÚYŠ\Š\™]\›Û]OYØİ[Y[˜Ü™X]Q[[Y[
]˜
NÚK˜Û\ÜÓ˜[YOX›ÙÜ™\ÜÚ[Û‹]‹Z[›Ë\ÜYYKš[›™\’SXÜ[“TÑQÑTĞÒÒS‘QÒÑRUÜÜ[]Ûˆ]KZ[›ËY\˜][ÛHÎ”ÙZˆZYÏØ]Û]Ûˆ]KZ[›ËY\˜][ÛH”ZYÏØ]Û]Ûˆ]KZ[›ËY\˜][ÛH”ØÚ™[Ø]Û˜‹œ™\[™
JKKœ]Y\TÙ[XİÜ[
Ù]KZ[›ËY\˜][Û—X
K™›Ü‘XXÚ
O˜Y]™[\İ[™\ŠÛXÚØ

OO’ÊK[X™\Š™]\Ù]š[›Ñ\˜][ÛŠKL
JJKXÊKŠ_Y[˜İ[ÛˆÊKŠ^ÙKœİ[KœÙ]›Ü\JKXÜ˜]ÛY\˜][Û˜	İ[\Ø
KK™]\Ù]š[›Ñ\˜][ÛTİš[™Ê
KØØ[İÜ˜YÙKœÙ]][J[\ËX›]YKXYšXKZ[›ËY\˜][Û‹]˜İš[™Ê
JKXÊK
K‰‰™Kœ]Y\TÙ[XİÜ[
›Ü[š[™Ë]K\™[YK›Ü[š[™Ë]K[ÙÛË›Ü[š[™Ë]KXÜ˜]Û
K™›Ü‘XXÚ
OOÙKœİ[K˜[š[X][ÛX›Û™XK›Ù™œÙ]ÚYKœİ[K˜[š[X][ÛXJ_Y[˜İ[ÛˆXÊK
^ÙKœ]Y\TÙ[XİÜ[
Ù]KZ[›ËY\˜][Û—X
K™›Ü‘XXÚ
OO™K˜Û\ÜÓ\İÙÙÛJÙ[XİY[X™\ŠK™]\Ù]š[›Ñ\˜][ÛŠOOO]
J_Y[˜İ[ÛˆØÊ
^Û™]È]]][Û“ØœÙ\™\ŠØÊK›ØœÙ\™JØİ[Y[™Øİ[Y[[[Y[ØÚ[\İˆLİX™YNˆLÚ\˜Xİ\‘]NˆL]šX]\ÎˆL]šX]Qš[\–ØY[˜_JKÚ[™İË˜Y]™[\İ[™\ŠØYØÊKÚ[™İËœÙ][\˜[


OOÒØÊ
KXÊ
_KÍŒ
KØÊ
_Y[˜İ[ÛˆØÊ
^ŞXß
XÏHLÚ[™İËœÙ][Y[İ]


OOŞXÏHLKØÊ
K˜Ê
K˜Ê
KØİ[Y[™Øİ[Y[[[Y[™]\Ù]œ›ÙÜ™\ÜÚ[Û”™[X\ÙOYXßK
J_Y[˜İ[ÛˆØÊ
^Û]OUË›Øš™Xİ]™J
KYØİ[Y[™Ù][[Y[RY
Øš™Xİ]™K]]X
KYØİ[Y[™Ù][[Y[RY
Øš™Xİ]™K]^
Nİ	‰^ÛÛ[OOYK]I‰Š^ÛÛ[YK]JK‰‰›‹^ÛÛ[OOYK^	‰Š‹^ÛÛ[YK^
NÛ]VXÊK\™Ù]Y
KOVÊ
KÛÜ›ÜÚ][Û‹OYØİ[Y[™Ù][[Y[RY
Øš™Xİ]™KY\İ[˜ÙX
NØI‰œ‰‰ŠK^ÛÛ[X	ÓX]œ›İ[™
X]š\İ
‹ZK‹KZKJJ_HX
_Y[˜İ[ÛˆXÊ
^Û]OYØİ[Y[™Ù][[Y[RY
Z[š[X\
NÚYŠJH[œİ[˜Ù[ÙˆSØ[˜\Ñ[[Y[
J\™]\›Û]VXÊË›Øš™Xİ]™J
K\™Ù]Y
KYK™Ù]ÛÛ^
™
NÚYŠ][Š\™]\›Û]]
™KÚYÌŒO]J™KšZYÚÌNÛ‹œØ]™J
K‹™š[İ[OXÙXØM˜‹œİ›ÚÙTİ[OXÍXMLLX‹›[™UÚYL‹‹˜™YÚ[”]

K‹˜\˜Ê‹KËX]”JŒŠK‹™š[

K‹œİ›ÚÙJ
K‹œ™\İÜ™J
_Y[˜İ[Ûˆ˜Ê
^Û]OYØİ[Y[™Ù][[Y[RY
Ù[™\šXË[[Ù[
NÚYŠY_KšY[ŸØİ[Y[™Ù][[Y[RY
[Ù[]]X
OË^ÛÛ[OOXš]˜[[‹T›Û›X
\™]\›Û]\ØÊËœÛ˜\Úİ

K›Û›P˜]X
NÚYŠ[›ØÚÙY
\™]\›Û]VË‹‹™Kœ]Y\TÙ[XİÜ[
]Û˜
WK™š[™
OO™K^ÛÛ[Ëš[˜ÛY\Êœ\İY[™YÚ[›™[˜
JNÚYŠJˆ[œİ[˜Ù[ÙˆS]Û‘[[Y[
J\™]\›Û‹™\ØX›YHLÛ][‹œ]Y\TÙ[XİÜŠÛX[
NÜ‰‰Š‹^ÛÛ[]œ™X\ÛÛŠ_Y[˜İ[ÛˆXÊJ^Û]U–ÙWNÚYŠ
\™]\›ŞN_NÛ]ZÛ‹™š[™
OšYOOYJNÜ™]\›ˆŞŞ›‹N›‹_N›ÚYY[˜İ[ÛˆÊ
^Ü™]\›ˆØÏ×ØËœÛ˜\Úİ

N˜ßÙ›YÜÎßKÛÜ›ÜÚ][ÛŞLNŒMŒ__Y[˜İ[Ûˆ˜ÊJ^Û]YOOOXYÙXØYÙTYX™NÜ™]\›–Ø›\İ\™Y\”Û™Ø›[šŞX˜[YÙTYXX\ÛÛX›Û›P˜]XKš[˜ÛY\Ê
Oİ›ÚYY[˜İ[ÛˆXÊKŠ^Ø˜Ï^ÚÚXÚÙ\™K]N^›Ÿ_Y[˜İ[Ûˆ	ÊKŠ^ÙØİ[Y[™Ù][[Y[RY
›ÙÜ™\ÜÚ[Û‹]‹\İÜX
OËœ™[[İ™J
NÛ]YØİ[Y[˜Ü™X]Q[[Y[
ÙXİ[Û˜
NÜ‹šYX›ÙÜ™\ÜÚ[Û‹]‹\İÜX‹˜Û\ÜÓ˜[YOX›ÙÜ™\ÜÚ[Û‹]‹\İÜX‹š[›™\’SX\XÛOÜ[‰Ú[
J_OÜÜ[‰Ú[

_OÚ‰Ú[
Š_OÜ]Ûˆ\OH˜]Ûˆ•™\œİ[™[Ø]ÛØ\XÛO˜Øİ[Y[˜›ÙK˜\[™
ŠKØİ[Y[˜›ÙK˜Û\ÜÓ\İ˜Y
Ø[\ZYÛ‹[[Ù[[Ü[˜
K‹œ]Y\TÙ[XİÜŠ]Û˜
OË˜Y]™[\İ[™\ŠÛXÚØ

OOÜ‹œ™[[İ™J
NÛ]OVË‹‹™Øİ[Y[œ]Y\TÙ[XİÜ[
›[Ù[
WKœÛÛYJOOˆYKšY[ŠNÙØİ[Y[˜›ÙK˜Û\ÜÓ\İÙÙÛJØ[\ZYÛ‹[[Ù[[Ü[˜J_J_Y[˜İ[Ûˆ[
K‹Š^Û]OZÙWKOYØİ[Y[˜Ü™X]Q[[Y[
\ÚYX
NØK˜Û\ÜÓ˜[YOX›ÙÜ™\ÜÚ[Û‹]‹\™]Ø\™Kš[›™\’SXÜ[‰ÚOËšXÛÛÏØ<'ã XOÜÜ[]ÛX[‰ÛOOX˜]XØ”•TÕĞST‹P‘SÒ•S‘Ø˜ÑTĞÒS’ÈT’SS˜OÜÛX[İ›Û™Ï‰İpåÈ	Ú[
OË›X™[ÏÙJ_OÜİ›Û™Ï‰Ú[
Š_OÜÙ]˜Øİ[Y[˜›ÙK˜\[™
JKÚ[™İËœÙ][Y[İ]


OO˜K˜Û\ÜÓ\İ˜Y
š\ÚX›X
KŒ
KÚ[™İËœÙ][Y[İ]


OOØK˜Û\ÜÓ\İœ™[[İ™Jš\ÚX›X
KÚ[™İËœÙ][Y[İ]


OO˜Kœ™[[İ™J
KÌŒ
_KŒ
_Y[˜İ[Ûˆ
J^ÙØİ[Y[™Ù][[Y[RY
›ÙÜ™\ÜÚ[Û‹]‹]Ø\İ
OËœ™[[İ™J
NÛ]YØİ[Y[˜Ü™X]Q[[Y[
]˜
NİšYX›ÙÜ™\ÜÚ[Û‹]‹]Ø\İ˜Û\ÜÓ˜[YOX›ÙÜ™\ÜÚ[Û‹]‹]Ø\İ^ÛÛ[YKØİ[Y[˜›ÙK˜\[™

KÚ[™İËœÙ][Y[İ]


OO˜Û\ÜÓ\İ˜Y
š\ÚX›X
KL
KÚ[™İËœÙ][Y[İ]


OOİ˜Û\ÜÓ\İœ™[[İ™Jš\ÚX›X
KÚ[™İËœÙ][Y[İ]


OOœ™[[İ™J
KL
_KÙLÊ_Y[˜İ[Ûˆ›

^ÚYŠØË›[™İ
\™]\›ˆ[
[X™\ŠØËœÚY

JKNNNNNJNÚYŠÛØ˜[\Ë˜Ü\ÏË™Ù]˜[™ÛU˜[Y\Ê^Û]O[™]ÈZ[Ì\œ˜^JJNÜ™]\›ˆÛØ˜[\Ë˜Ü\Ë™Ù]˜[™ÛU˜[Y\ÊJKVÌKÍMMÌMŸ\™]\›ˆX]œ˜[™ÛJ
_Y[˜İ[Ûˆ›
J^Ü™]\›ˆ–ÙWOË›˜[YOÏÙ_Y[˜İ[Ûˆ[
J^Ü™]\›ˆİš[™ÊJKœ™\XÙJÖÉ‰È—KÙËOOŠÈ‰ˆ˜	˜[\Ø˜	›Øˆ˜	™İØ‰È˜	ˆÌÎNØ	È‰Î˜	œ][İØJVÙWOÏÙJ_Y[˜İ[Ûˆ[
KŠ^Ü™]\›ˆX]›X^
X]›Z[Š‹JJ_Y[˜İ[ÛˆÛ

^Û]O[™]ÈT“ÙX\˜Ú\˜[\ÊØØ][Û‹œÙX\˜Ú
NÈYKš\ÊÛ[ÚÙX
I‰ˆYKš\Ê›ÙÜ™\ÜÚ[Û˜
_
Ú[™İË—×ÛÔ›ÙÜ™\ÜÚ[Û•^İ™\œÚ[Û™XËÛ˜\Úİ

^Û]OUËœÛ˜\Úİ

NÜ™]\›ÛØš™Xİ]™N•Ë›Øš™Xİ]™J
K[›ØÚÙY˜ØÊJK[ÛÜ™N›ØÊJK[˜X›YİÜNšÛ‹™š[\ŠOO™KšÚ[™OOXİÜX	‰™Kœ˜Y]\ÏŒ
K›X\
OO™KšY
K[˜X›YZ[šYØ[Y\ÎšÛ‹™š[\ŠOO™KšÚ[™OOXZ[šYØ[YX	‰™Kœ˜Y]\ÏŒ
K›X\
OO™KšY
K]Y\İX\šÙ\œÎ”ØË›ØÚÙYİ\ÎË[›Ñ\˜][Û“[X™\ŠØİ[Y[œ]Y\TÙ[XİÜŠ›Ü[š[™Ë]K\ÜXÙX
OË™]\Ù]š[›Ñ\˜][ÛÏÍLÊK[™[ÜN—ØÏŞË‹‹—ØËœİ]Kš[™[Ü_NßKİÜPØ\™™Øİ[Y[™Ù][[Y[RY
›ÙÜ™\ÜÚ[Û‹]‹\İÜX
OËœ]Y\TÙ[XİÜŠ˜
OË^ÛÛ[ÏØ_K›Ü˜ÙSY]JJ^Û]UÎÓØš™Xİ˜\ÜÚYÛŠœİ]KJKK™›YÜÉ‰Šœİ]K™›YÜÏ^Ë‹‹œİ]K™›YÜË‹‹™K™›YÜßJKK›Z[šT™\İ[É‰Šœİ]K›Z[šT™\İ[Ï^Ë‹‹œİ]K›Z[šT™\İ[Ë‹‹™K›Z[šT™\İ[ßJK™[Z]

_K™XÛÜ™Z[šJKHL
^ÕËœ™XÛÜ™Z[šQØ[YJKÌLŒŒŒXYÈ›ÙÜ™\ÜÚ[Ûˆ™\İ[›Üˆ	Ù_K˜ØÛÛY˜˜Z[Y
_KÙ]˜[™ÛJ‹‹™J^ÙØËœ\Ú
‹‹™J_KÜ˜[˜]JOXXYØ
^ÒXÊKXYËQœ\İØ[\ˆX™Ù\ØÚÜÜÙ[‹˜
_KÛÛ™\œØ][ÛŠJ^Ü™]\›ˆË˜ÛÛ™\œØ][ÛŠJ_KÛÜÙTİÜJ
^ÙØİ[Y[œ]Y\TÙ[XİÜŠÜ›ÙÜ™\ÜÚ[Û‹]‹\İÜH]Û˜
OË˜ÛXÚÊ
_K™Yœ™\Ú

^ÕÊ
KË™›Ü‘XXÚ
OO™J
JKØÊ
__J_]˜\ˆÛ^Ø[™™NÚY˜[™™X›ÛN˜Ü™X]]XÚšZÙ\˜\˜Ú]\N˜\ˆÒKP˜\İ\˜š[ÙÜ˜\N˜ØÚ™ZX\ÈÜY[˜]]ÒKSYY\ˆ0ï™\ˆYH›]YHYšXH[™X[Ü˜ØH[™™\˜š[™]XÚšZÈZ]Ü™X]]™[ˆYY[‹ˆÜÜXÚš[šÙ™\İ[™šXÚÜ[™ğé›XÚÙYÙ[ˆZ[™H˜]XÚ]\ÙK˜İ™[™İÎ–ØÜ™X]]™H0íœİ[™Ù[˜XÚšZØ[\›İš\Ø][Û˜KÙXZÛ™\ÜÙ\Î–Ø™\™][ÚXÚHšY[HYY[ˆÛZXÚ™Z]YØKÜXÜÎ–ØÒXXÚšZØ]\ÚZØÜÜKZÙ\ĞØ[›˜Xš\ÎˆL[ÛÚÛÛ\˜[˜ÙN˜ØÚ™XÜZ]Y[™\ÚÛŒNšY[[™N˜8 '’XÚX™HY°ïˆØÚÛˆZ[™[ˆ›İİ\ˆ\ˆ\İ\ˆ›ØÚšXÚØ[ˆ[™ÙY°é›XÚ¸ 'K™[™NÚY˜™[™X›ÛN˜]]İ\šÙ\ˆ˜[Z[Y[˜]\˜\˜Ú]\N˜\ˆÜ›ğçÙHœY\˜š[ÙÜ˜\N˜[™°ê\ÈÜ›ğçÙ\ˆœY\ˆ[™˜[Z[Y[˜]\‹ˆXXÚÜÜš[šİ[™ÚY™Ù\›™H[™Ø[›ˆZ[™HZYÙHÚ]X][ÛˆZ]8 '•ÒQHRTÔÕTˆS‘ø 'Ù\ˆ8 '“PÒÓSˆx ']™\›0éÜÚYÈ™Y[™[‹˜İ™[™İÎ–Øİ[™™\İYÚÙZ]Ü\[™XÚØ™\ØÚ0ï™\š[œİ[šİKÙXZÛ™\ÜÙ\Î–Ø]]İ0éšÙX\ÚØ[Y\\›[ÜÙHÚ]X][Û™[˜KÜXÜÎ–Ø˜[Z[YXÜÜšY\˜[HÙ\ØÚXÚ[˜KZÙ\ĞØ[›˜Xš\ÎˆL[ÛÚÛÛ\˜[˜ÙN˜ØÚ™XÜZ]Y[™\ÚÛŒNšY[[™N˜8 '•ÚYHZpçİ\ˆ[™È\È\İZ[™H›Ü›X[Hœ˜YÙHx 'K\œÎÚY˜\œØ›ÛN˜XÚšZËTØÚ°éÚ[š°éÙ\˜\˜Ú]\N˜\ˆİ]HÚ[[™Øš[ÙÜ˜\N˜XÚšZØ™YÙZ\İ\Z[X[YÙ\ˆÚİÜ˜[™[™ÛÛ\›ÛZ\ÜÛÜÙ\ˆØÚ°éÚ[š°éÙ\‹ˆØ]Y]YˆX[Hœš[[ˆ°ïˆ™ZH]\›Ë™^™ZXÚ™]ÚXÚ[ÈÜÜ\ˆ[™ÚY™›İ™[HÙ[YÙ[XÚˆXYÈ]pçÙ\ˆØÚ[Ü°í[ˆÙZ[™HY\™K˜İ™[™İÎ–ØXÚšZØ™Z\ËSZ\İ[™ØZ[š\ÜY[[˜[\ÙXKÙXZÛ™\ÜÙ\Î–Øš[YÙH]\Ü°ïİ[™Ø0ï™\œØÚ0éÙZ[™HÜÜXÚÙZ]KÜXÜÎ–ØØÚ[Ü°í[˜XÚšZØØÚ°éÚ[˜ÜÜKZÙ\ĞØ[›˜Xš\ÎˆL[ÛÚÛÛ\˜[˜ÙN˜Z][™XÜZ]Y[™\ÚÛŒM‹šY[[™N˜8 '‘YHœš[H]™ZH]\›ÈÙZÛÜİ]ˆ°ïˆ[ˆ™Z\È]\ÜÈÚYHİ]ÙZ[‹¸ 'K[›NÚY˜[›X›ÛN˜Üš[\˜\˜Ú]\N˜\ˆ°íœÙHÚ[[™Øš[ÙÜ˜\N˜0ï›™\ˆ[È\œËÜÜXÚ\ˆ[™]]XÚØÚ™[\‹ˆÚY™šXÚš[šİÙ[Zİ]‹\š[šY\X™\ˆÙ[˜]\ÛÈ]™\›0éÜÚYÈ[ˆYHXÚÙKˆ]Z[ˆ]\ÙÙ\°éİ\È[[Ù[˜]H›Üˆ[H]Yœ°é[Y[ˆœ°ï\ˆXZ]Y[‹ˆXYÈ]\ÜØÚYpçÛXÚØÚ[Ü°í[‹˜İ™[™İÎ–Ø[\Ø™XZİ[Û˜›[šŞX˜[KÙXZÛ™\ÜÙ\Î–Øœ°ïHXœ™Z\ÙX™\ÙZYÙ\˜XÚÛ[˜KÜXÜÎ–ØØÚ[Ü°í[˜ÜÜ›XÚ0é™XKZÙ\ĞØ[›˜Xš\ÎˆLK[ÛÚÛÛ\˜[˜ÙN˜Z][™XÜZ]Y[™\ÚÛŒMËšY[[™N˜8 '’XÚ]\ÜÈÛÛ›YÈÚ\šÛXÚœ°ïÜËˆÚ\šÛXÚ¸ 'KÜ™YÛÜÚY˜Ü™YÛÜ˜›ÛN˜›ÙÜ˜[[ZY\™\˜\˜Ú]\N˜\ˆ™[\İ˜\™H[™\˜š[ÙÜ˜\N˜›ÙÜ˜[[ZY\Ù\›™K™\°éİšY[[ÛÚÛÚY™šXÚ[™[™]›Üˆ[™\™H0ï™\š]\™[Y\šÙ[‹\ÜÈ]Ø\ÈØ\]\İ˜İ™[™İÎ–ØÙÚZØ[œØ™\™Z]ØÚY[ÛÚÛÛ\˜[˜KÙXZÛ™\ÜÙ\Î–ØXYÙİÙ\Ü°éÚHH[™ÙXKÜXÜÎ–Ø›ÙÜ˜[[ZY\™[˜›Ø›[[0íœİ[™ØšY\˜KZÙ\ĞØ[›˜Xš\ÎˆLK[ÛÚÛÛ\˜[˜ÙN˜ØÚ™XÜZ]Y[™\ÚÛŒMKšY[[™N˜8 '‘\È\İÙZ[ˆ›Ø›[Kˆ\È\İ\ˆZ[ˆØÚXÚÚİ[Y[Y\\ˆ\İ[™¸ 'KX\ÛÚY˜X\Û›ÛN˜]™\ZYYÙ\˜\˜Ú]\N˜\ˆX˜]Y\™\˜š[ÙÜ˜\N˜Ü›ğçËÙZˆ[œØ™\™Z][™™\ÛÛ™\œÈİ\šÈ\š[‹İ[™[H]\ÈZ[™\ˆ[™ğïYÙ[ˆ[ØÚZY[™ÈÚYY\ˆZ[™H›Ü›0éYšYÙHHXXÚ[‹ˆš[šİ[™ÚY™Ù\›™NÈÜ™Ø[š\ÚY\İ›Ş[ˆ[H™[[\ˆZ[™[H™YÙ[œØÚ\›H]Yˆ[HÙYHÙ\ˆ[\ˆZ[™[H[YÙZÚ\[ˆ›Ûİ˜İ™[™İÎ–Ø\Úİ\ÜÚ[Û˜ŞX[]0éÛŞšX[H™\ZYYİ[™ØKÙXZÛ™\ÜÙ\Î–ØÙZˆœ™Z]™YÙ[]\ÛYİ[™ØKÜXÜÎ–Ø\Úİ\ÜÚ[Û™[˜İ›ŞÜ\[œØÚ]˜KZÙ\ĞØ[›˜Xš\ÎˆL[ÛÚÛÛ\˜[˜ÙN˜ØÚ™XÜZ]Y[™\ÚÛŒMšY[[™N˜8 '‘\ÈİZHÛËˆ\È™Y]]]\ˆšXÚ\ËØ\Èİ[™[H[šİ¸ 'KØÚX™\ÚY˜ØÚX™\›ÛN˜\Ú[Ø\˜Ú]\N˜\ˆpïHš]XXÚ\˜š[ÙÜ˜\N˜\Ú[İ\˜\]]˜]\ˆ[™\İ0é™YÈY°ï‹\ÜÈ[H[ÙYÜÈ™]ÙYÛXÚ›ZX™[‹ˆØÚ0é[™›ØÚİšY[]›]ØÚXÚË™\°éİÙ[šYÙ\ˆ[ÛÚÛ[™ÚY™X™[™˜[Ë˜İ™[™İÎ–Ø™YÙ[™\˜][Û˜™\›][™ÜÜ°é™[[Û˜ZXKÙXZÛ™\ÜÙ\Î–ØÙ\š[™ÙH[ÛÚÛÛ\˜[˜™\œØÚ0éİ\ØKÜXÜÎ–Ø\Ú[ØØ[Z[™Ø˜[Z[YXØÚY˜KZÙ\ĞØ[›˜Xš\ÎˆL[ÛÚÛÛ\˜[˜ÙN˜šYYšYØ™XÜZ]Y[™\ÚÛŒM‹šY[[™N˜8 '‘Z[™H[[™È\İØÚXÚˆYZ[™HØXÚZ]X™\ˆ]XÚ¸ 'K™[^ÚY˜™[^›ÛN˜Ù\ØÚXÚ[™\°é\˜\˜Ú]\N˜\ˆÙ\™[™H\Xš[ÙÜ˜\N˜Ú\™˜[˜]\‹ÚY™šXÚš[šİÙ\›™HXÚÙ\ˆšY\˜Ú[‹ÜY[˜\İ[\ÈZ][™\°éÙ\ØÚXÚ[‹™ZH[™[ˆ\ˆØZšZ]Ø[Z[Z]™Y\ˆ[™HÚ[šİ˜İ™[™İÎ–Ø[İ]˜][Û˜ÜY[XÛŞšX[H[™\™ÚYXKÙXZÛ™\ÜÙ\Î–ØÚ[H]\ÜØÚpïÚİ[™Ù[˜KÜXÜÎ–Ø˜[Z[YXÜY[XšY\˜Ù\ØÚXÚ[˜KZÙ\ĞØ[›˜Xš\ÎˆLK[ÛÚÛÛ\˜[˜ÙN˜Z][™XÜZ]Y[™\ÚÛŒMKšY[[™N˜8 '‘\È\İÚ\šÛXÚ\ÜÚY\ˆ\ˆÜ™Z][™™]Z[YİHØ\™[ˆ[™\œË¸ 'KØÚ[XNÚY˜ØÚ[XX›ÛN˜™\œÛÜ™İ[™ÜØ\Ø\˜Ú]\N˜\ˆ]\ÙÙ\°ïİ]Xš[ÙÜ˜\N˜ÛÛ[]Z]Ü›ğçÙ[H\È[™\İ°ïˆÚ]X][Û™[ˆ]\ÙÙ\İ]]YH›ØÚšY[X[™Ù\[]ˆÚY™Ù\›™H[™šY[™\°éİX™\ˆ]Ø\ÈÙ[šYÙ\ˆ[ÛÚÛ[ÈÙZ[ˆX]\šX[™\İ[™™\›]][ˆ0éÜİ˜İ™[™İÎ–Ø]\Ü°ïİ[™Ø›Üœ°éX[\›İš\Ø][Û˜KÙXZÛ™\ÜÙ\Î–ØZ]\™H[ÛÚÛÛ\˜[˜HšY[Ù\0éÚØKÜXÜÎ–Ø\Ø]\Ü°ïİ[™Ø›Üœ°éX˜]XÚ]\Ù[˜KZÙ\ĞØ[›˜Xš\ÎˆL[ÛÚÛÛ\˜[˜ÙN˜Z][™XÜZ]Y[™\ÚÛŒMËšY[[™N˜8 '’XˆXÚ[H\ËˆXÚÙZpçÈ\ˆšXÚ[ˆÙ[Ú\ˆÚ\İK¸ '_KÛ^Ø[™™N[
[™™X[™°êXÜ™X]]XÚšZÙ\˜ËØ˜]NŒËÛØÚX[KØ[Y\Î™XÛİ™\NŒ_JK™[™N[
™[™X™[°êXÜ›ğçÙ\ˆœY\˜ËØ˜]N‹ÛØÚX[ŒËØ[Y\ÎŒË™XÛİ™\NŒŸJK\œÎ[
\œØ\œØXÚšZËTØÚ°éÚ[š°éÙ\˜‹Ø˜]NŒ‹ÛØÚX[Œ‹Ø[Y\Î‹™XÛİ™\NŒŸJK[›N[
[›X[›XÜš[\˜ËØ˜]NÛØÚX[ŒKØ[Y\ÎË™XÛİ™\NŒŸJKÜ™YÛÜ[
Ü™YÛÜ˜Ü™YÛÜ˜›ÙÜ˜[[ZY\™\˜ËØ˜]NŒËÛØÚX[Ø[Y\Î™XÛİ™\NJKX\Û[
X\ÛX\Û]™\ZYYÙ\˜Ø˜]NËÛØÚX[ËØ[Y\ÎŒ‹™XÛİ™\NŒ_JKØÚX™\[
ØÚX™\ØÚX™\\Ú[ØËØ˜]NŒ‹ÛØÚX[Œ‹Ø[Y\ÎŒ‹™XÛİ™\NJK™[^[
™[^™[^Ù\ØÚXÚ[™\°é\˜‹Ø˜]NŒ‹ÛØÚX[KØ[Y\Î‹™XÛİ™\NŒŸJKØÚ[XN[
ØÚ[XXØÚ[XX™\œÛÜ™İ[™ÜØ\ØËØ˜]NÛØÚX[ŒËØ[Y\ÎŒË™XÛİ™\NŸJ_NÙ[˜İ[Ûˆ
J^Û][™]ÈÙ]
JKV×NÜ™]\›ˆš\Ê\œØ
I‰š\Ê[›X
I‰›‹œ\Ú
ÚY˜Ú[œØX™[˜ØÚ[Ü°í[‹VÚ[[™ÙX\ØÜš\[Û˜ÙYÙ[œğé™HZ]Y[\ØÚ[HY\™Ù\ØÚXXÚË˜˜]NŒKÛØÚX[‹LKØ[Y\Î™XÛİ™\NŒJKØ[™™XÜ™YÛÜ˜\œØK™š[\ŠOOš\ÊJJK›[™İL‰‰›‹œ\Ú
ÚY˜XÚX™[˜XÚšZÜ˜]\ØÜš\[Û˜›Ø›[YHÙ\™[ˆ\œİ[˜[\ÚY\[™[›ˆÜ™X]]ˆ[YØ[™Ù[‹˜˜]NŒKÛØÚX[Œ‹Ø[Y\ÎŒË™XÛİ™\NŒJKØ™[™XX\ÛØÚ[XXK™š[\ŠOOš\ÊJJK›[™İL‰‰›‹œ\Ú
ÚY˜Û[ÚÙXX™[˜İ›ŞRÛÛZ]YX\ØÜš\[Û˜ÚHÙ[\ÜÙ[šZ][™ÜØ[Y\™H™XZİ[Û‹˜˜]NŒËÛØÚX[Œ‹Ø[Y\Î‹LK™XÛİ™\NŒ_JKØ™[™XØÚX™\™[^K™š[\ŠOOš\ÊJJK›[™İL‰‰›‹œ\Ú
ÚY˜YØX™[˜\KTØÚXÚ\ØÜš\[Û˜˜YÛX]\ØÚH\šÛ[™È[™0ï™\œ˜\ØÚ[™œ°ïH™\›[™˜˜]NŒÛØÚX[Œ‹Ø[Y\ÎŒ™XÛİ™\N_JKŸY[˜İ[Ûˆ[
K‹‹J^Ü™]\›ÚY™K˜[YN›ÛN›‹]™[œ‹™\ÛÛ™NŒŠÜŠ‹X^™\ÛÛ™NŒŠÜŠ‹ŞX[NMŠÜŠK›Û\Ù\Îš__]˜\ˆ^Üİ\ÚNÚY˜İ\ÚX˜[YN˜İ\ÚXšXÚÛ˜[YN˜YH™XÚ\œİ˜]YÚ[˜\ØÜš\[Û˜ÜY[Ù\›™K™XYÚY\]YˆÙ[œİ\›ÛšYH[™Y\šİÛÙ›ÜÙ[›ˆ™[X[™\ˆZ]YÙ[Ù[œİ™\˜]Y[ˆ[ÚXÚÙ[˜™Y™\œ™YÚYÎ–ØÚ\ØØ\ÜÙ\˜K\ÛZÙYÚYÎ–Ø˜]YXK™Y™\œÎ–Ø^™YÜ™X]]™XK™Z™XİÎ–Ø[šØ™\RYÚ[™Ûİ™\˜KÜ[š[™Î–Ø8 '‘Hš\İ[ÛÈ\ˆZ][HX›]Yœ[ø '8 '‘Z[ˆİ]\ˆİ\™ˆ\İ›ØÚÙZ[™H\œğí››XÚÙZ]¸ '8 'š]HØYÈšXÚ\ÜÈ\ÈZ[ˆ›\Ú\\İ¸ '_K[NÚY˜[X˜[YN˜[XšXÚÛ˜[YN˜YHİ˜[™0éY™\š[˜\ØÜš\[Û˜ÜÜXÚ\™Zİ[™Ù[šYÈ™YZ[™XÚİ›ÛˆÙ[œİ0ï™\œØÚ0é[™Ëˆ[œØ™\™Z]ØÚY°éYZˆ[ÈX\šÚYÙHÜ°ïÚK˜™Y™\œ™YÚYÎ–ØØ\ÜÙ\˜ØY™™YXK\ÛZÙYÚYÎ–ØšY\˜˜]YXK™Y™\œÎ–ØÛØ™\˜ÜÜX[[K™Z™XİÎ–Ø[šØ™\RYÚÚ[ÜØKÜ[š[™Î–Ø8 '‘HØÚØ[šÜİˆ\İ\È˜Z[š[™ÈÙ\ˆ\İ[™ø '8 '‘\œİØ\ÜÙ\‹[›ˆ[[™Ù\ØÚXÚK¸ '8 '•Ù\ˆ™Z[H]Yœ°é[Y[ˆ[\™ˆÜ0é\ˆ™Y[‹¸ '_KÚ\˜NÚY˜Ú\˜X˜[YN˜Ú\˜XšXÚÛ˜[YN˜YH˜XÚ›İÙÜ˜Yš[˜\ØÜš\[Û˜Ü™X]]‹™[Ø˜XÚ[™[™Ù™™[ˆ°ïˆ[™Ù]ğíš›XÚHÙ\ØÚXÚ[‹ˆ[\H[›XXÚH[™°í›YÙ\ˆÛÛ›Û™\›\İ™Y[™[ˆ\ÈÙ\Ü°éÚÛÙ›Ü˜™Y™\œ™YÚYÎ–ØØY™™YXÚ\ØK\ÛZÙYÚYÎ–ØİY\œİXK™Y™\œÎ–ØÜ™X]]™XYÚK™Z™XİÎ–Ø[šØ[™Ûİ™\˜KÜ[š[™Î–Ø8 '‘\ÈXÚY\ˆ\İ™\ÜÙ\ˆ[ÈYHÙ\Ü°éÚK¸ '8 '‘HÚ\šÜİ[Èğï™\İH™X™[˜™ZH™ZH›Ú™ZİH[™˜[™Ù[‹¸ '8 '‘\°é]Ø\ÈXÚ\ËˆÙ\ˆÙ[šYÜİ[œÈİ]\™[™[™\Ë¸ '__NÙ[˜İ[Ûˆ›
K
^Û]YÙWNÚYŠ[Š\™]\›ˆÛ]QJ›™YYÊKOMÎÜ™]\›ˆJÏSX]œ›İ[™

œ™[][ÛœÚ\ÖÙWOÏÌ
J‹Œ
KJÏSX]œ›İ[™
›Y]šXÜËœ™\]][ÛŠ‹ŒÍJKJÏSX]œ›İ[™
‹™›\
‹JK‹œ™Y™\œËš[˜ÛY\Ê^™Y
I‰›™YYË˜[ÛÚÛLM	‰›™YYË˜[ÛÚÛÎ	‰ŠJÏLÊK‹œ™Y™\œËš[˜ÛY\ÊÛØ™\˜
I‰›™YYË˜[ÛÚÛL	‰›™YYËšYÚ™\ÜÏMI‰ŠJÏLÊK‹œ™Y™\œËš[˜ÛY\ÊYÚ
I‰›™YYËšYÚ™\ÜÏLI‰›™YYËšYÚ™\ÜÏŒ	‰ŠJÏLŠK‹œ™Y™\œËš[˜ÛY\ÊÜ™X]]™X
I‰œ›Ùš[OË˜Z]OOXÚ[İ\ØÚ	‰ŠJÏLŠK‹œ™Y™\œËš[˜ÛY\Ê[[
I‰œ›Ùš[OË˜Z]OOX[œØ™\™Z]	‰ŠJÏLÊK‹œ™Y™\œËš[˜ÛY\ÊÜÜX
I‰›™YYË™[™\™ŞOMI‰ŠJÏLŠK‹œ™Z™XİËš[˜ÛY\Ê[šØ
I‰›™YYË˜[ÛÚÛLÎ	‰ŠKOLL
K‹œ™Z™XİËš[˜ÛY\Ê™\RYÚ
I‰›™YYËšYÚ™\ÜÏMÌ	‰ŠKOLL
K‹œ™Z™XİËš[˜ÛY\Ê[™Ûİ™\˜
I‰›™YYËš[™Ûİ™\LÍI‰ŠKON
K‹œ™Z™XİËš[˜ÛY\ÊÚ[ÜØ
I‰›Y]šXÜË˜Ú[ÜÏMMI‰ŠKOMJKX]›X^
‹X]›Z[ŠŒX]œ›İ[™
JJJ_Y[˜İ[Ûˆ
KŠ^Û]YÙWNÜ™]\›ˆİÛ‹›™YYË˜[ÛÚÛLMØ	Ü‹›˜[Y_HXÚ0ï™\ˆ[ˆÜXÚX™\ˆ›Üˆ[[H\°ï™\‹\ÜÈHZˆÙ[œİšXÚØ[ˆ\›œİš[[\İ˜˜	Ü‹›˜[Y_H›ZX[HÙ\Ü°éÚİ[Z[™HXÚH°ïÚÙœ˜YÙH[™ÚX\ˆ[Z]YZˆ[È\ˆ0í™›XÚÙZ]˜›‹›™YYË˜[ÛÚÛLÎØ	Ü‹›˜[Y_Nˆ8 '‘\ˆYÙ[ÜšXÚÙ\˜YH]]\ˆ[ÈKˆ™\œİXÚ\È[Ü™Ù[ˆ°ïÚ\›‹¸ '›‹›™YYËšYÚ™\ÜÏMŒØ	Ü‹›˜[Y_Nˆ8 '‘YHÚ[H\İ™\›]]XÚ›ØÚ[\ÙYÜË¸ '›‹›™YYËš[™Ûİ™\LÍOØ	Ü‹›˜[Y_Nˆ8 '‘HÛÛ\İY\œİZ]Ø\ÜÙ\ˆZ[™H™^šYZ[™È]Y˜˜]Y[‹¸ '˜	Ü‹›˜[Y_H™XYÚY\œ™][™XÚX™\ˆZ[™]]YËˆZ[ˆZ[™[™\ˆ™\œİXÚ\™]Yİ›ØÚÙZ[™H›ÛX[™K˜˜\ÈØ\ˆÙZ[ˆ›\Ù\Ü°éÚ˜Y[˜İ[Ûˆ[
K
^Û]YÙWNÜ™]\›ˆÛ‹œ™Y™\œ™YÚYËš[˜ÛY\Ê
OŞÙ[NË^˜	Û‹›˜[Y_HY\šİ\ÜÈ\ÈÙ\ØÚ[šÈ]ğéÚXÚHZˆ\Üİ˜N›‹™\ÛZÙYÚYËš[˜ÛY\Ê
OŞÙ[N‹MK^˜	Û‹›˜[Y_Hš[[]\ÈÙ\ØÚ[šÈšXÚ[‹ˆYH]\İØZØ\ˆZ\ˆÙ[œİ]\Úİ[™[È]Y›Y\šÜØ[ZÙZ]˜NÙ[NŒ‹^˜	Û‹›˜[Y_Hš[[]\È[‹Ú™H\˜]\È™\™Z]È›ÛX[\ØÚH™Y]][™ÈX[Z][‹˜NÙ[NOOXØ\ÜÙ\˜ÌŒK^˜\ÈÙ\ØÚ[šÈÚ\™[Èœ˜]XÚ˜\™HÜ\[™\œÛÜ™İ[™È™\˜XÚ˜_Y[˜İ[Ûˆ
KŠ^Ü™]\›ˆ]
KŠ_Y[˜İ[ÛˆÛ
KŠ^Û]]œ™[][ÛœÚ\ÖÙWOÏÌOR
KŠK›X\
OOŠÚY˜Ú\˜Xİ\‰ÙKšYXX™[™K›X™[[™Kš[š\ÚÎ™Kœš\ÚËÛ™N™Kœš\ÚÏOOXš\ÚŞXØ[™Ù\˜˜›Ü›X[Xİ[Ûİ\N˜Ú\˜Xİ\˜ÚÚXÙRY™KšYÜXÎ™KÜXË\›ØXÚ™K˜\›ØXÚ_JJKOYÙWNÚYŠJ^Û]ÏY›
K
KÏ[‹œ›ÛX[˜ÙVØKšYK˜›İ[™\TİšZÙ\ÏLÎÚKœ\Ú
ÚY˜›\X™[œÏØYHÙ\Ù]HÜ™[™H™\ÜZİY\™[˜[
KšY‹˜ÛÛ™\œØ][ÛÛİ[ÖÙWOÏÌ
K[œÏØÙZ]\™H›\™\œİXÚHÚ[™°ïˆY\Ù\ÈÛØÚ[™[™H™Y[™]ˆ›Ü›X[HÙ\Ü°éÚH›ZX™[ˆpí™ÛXÚ˜˜“ÓPS•TĞÒTÈ’TÒRÓÈ0­È™^šYZ[™È	ÜLØ
Ø˜IÜŸH0­ÈZİY[H›Ø™H	ÛßKÌŒXİ[ÛœÏŞİ\N˜X]™XNİ\N˜›\K\ØX›YœËÛ™NœÏØ[™Ù\˜˜›\š\ÚÎ˜š\ÚŞXJ_Y›ÜŠ]ˆÙˆ›
JJ^Û][[
KŠK]™[OMOØ\ÜİÙZˆİ]™[OØØZœØÚZ[›XÚ[œ\ÜÙ[™˜™]]˜[H]Y›Y\šÜØ[ZÙZ]ÚKœ\Ú
ÚY˜ÚY‰ÛŸXX™[˜	ÚÛ—KšXÛÛŸH	ÚÛ—K›X™[H[˜šY][˜[˜ÑTĞÒS’È0­È	ÜŸH0­ÈÚ\™™\˜œ˜]XÚXİ[Ûİ\N˜ÚY][RY›ŸKÛ™N™[OØ[™Ù\˜˜ÚYš\ÚÎ™[OØš\ÚŞX˜ØY™XJ_[]Ï\ÛÙWNÚYŠÊ^Û][‹˜Xİ]™UX[Kš[˜ÛY\ÊJNÚKœ\Ú
ÚY˜™XÜZ]X™[Ø™\™Z]È[HZİ]™[ˆX[X˜	Ô™š[™
OšYOOYJOË›˜[YOÏÙ_H[œÈX[HÛ[˜[œ[Ëœ™XÜZ]Y[™\ÚÛØPSH0­ÈŞX[]0é™ZXÚ0­Èœš[™İ	ÛËœİ™[™İÖÌ_X˜PSH0­È›ØÚ	ÓX]›X^
Ëœ™XÜZ]Y[™\ÚÛ\Š_H™^šYZ[™ÜÜ[šİHš\È\ˆ\ØYÙXXİ[Ûİ\N˜™XÜZ]K\ØX›YËœ™XÜZ]Y[™\ÚÛÛ™N˜X[Xš\ÚÎ˜ØY™XJ_\™]\›ˆKœ\Ú
ÚY˜X]™XX™[˜Ù\Ü°éÚ™Y[™[˜[˜ÙZ[™HÙZ]\™H™Z]0­ÈYHšYİ\ˆ\š[›™\ÚXÚ[ˆYHš\Ú\šYÙ[ˆ[ØÚZY[™Ù[˜Xİ[Ûİ\N˜X]™XKš\ÚÎ˜ØY™XJK_Y[˜İ[ÛˆÛ
K‹‹OSX]œ˜[™ÛJ^ÚYŠ\OOOXX]™X
\™]\›İ^˜\ÈÙ\Ü°éÚ[™]Ú™H\ğé›XÚ[ˆØÚY[‹ˆ]YˆY\Ù[H]ˆ\İZ[ˆØ]X™\™\ˆX™Ø[™È™\™Z]ÈÛŞšX[HÛÛ\][‹˜™[][ÛœÚ\ŒZ[]\ÎŒİXØÙ\ÜÎˆL›ÛİÕ\˜Ü0é\™HÙ\Ü°éÚH™\°ïÚÜÚXÚYÙ[ˆ[ˆš\Ú\šYÙ[ˆÛˆ[™Ù™™[™H[Y[‹˜NÚYŠ\OOOXÚ\˜Xİ\˜
^Û]OV]
K˜ÚÚXÙRY‹‹JKÏS™JKÜXËŠKÏ[ÏØH\šÙ[›œİ\š[ˆYHØ[\XÚš\]YH8 '‰Ú™VÛ×K›X™[x '˜˜Ü™]\›İ^˜	ØK^IÜßX™[][ÛœÚ\˜Kœ™[][ÛœÚ\Z[]\ÎÜXÏOOX\œÛÛ˜[ÎNÜXÏOOX[˜Î‹İXØÙ\ÜÎ˜KœİXØÙ\ÜËX\›™Y]XÚÎ›ÏÏİ›ÚY™YYÎ˜K›™YYËY]šXÜÎ˜K›Y]šXÜË›YÜÎ˜K™›YÜËš\\Î˜Kœš\\Ë›ÛİÕ\˜K™›ÛİÕ\ÛÛœÙ\]Y[˜ÙSX™[˜KœİXØÙ\ÜÏİ˜\›ØXÚOOX[ØÑSQRS”ĞSQTˆS˜˜\›ØXÚOOX\İ[˜Ø‘T•UQS˜˜\›ØXÚOOX›ÚÙXØÑURSTˆSSÔ˜˜‘TÔRÕ˜ÓÖ’PSTˆ‘R’U_ZYŠ\OOOX›\
^Û]Y›
KŠKLJÓX]™›ÛÜŠJ
JŒŒ
KO\]ÏXI‰œSX]›X^
‹X]™›ÛÜŠÌÊJKÏXOÛÏÎN›‹›™YYË˜[ÛÚÛLÎËM‹L‹ÏXOÛÏÌLœËYÙWKOHXI‰œÏKMÜ™]\›İ^˜	Ü
KKŠ_H	ØOÛÏØ\ˆ[ÛY[Ú\šİšXÚÚYHZ[ˆÙ]ÛÛ›™[™\ˆİ\™‹ÛÛ™\›ˆÚYHXÚ\ÈÙYÙ[œÙZ]YÙ\È[\™\ÜÙK˜˜\ÈÙ\Ü°éÚ›ZXÙ™™[ˆ[™™ZYH˜YÙ[ˆ]Ø\È^H™ZK˜OØYHÜ™[™H\İZ[™]]YËˆ™\ÜZİY\™[ˆ\İ™]YHZ[šYÙHİ]H›ÜÙ][™Ë˜˜\ˆ™\œİXÚ[™]šXÚÚ™H\˜]\ÈÛÙ›ÜZ[ˆ˜[XHHXXÚ[‹˜X™[][ÛœÚ\œË›ÛX[˜ÙQ[N˜ËZ[]\ÎËİXØÙ\ÜÎ˜K›YÜÎ˜OŞÖØ›ÛX[˜ÙK[[ÛY[IÙ_XNˆLNOŞÖØ›ÛX[˜ÙKX›İ[™\KIÙ_XNˆLN›ÚYY]šXÜÎ˜OŞÜ™\]][ÛŒKYÛš]N›ÏÌŒ_NÙYÛš]NOËM‹LKÚ[ÜÎOÌŒKÛÛœÙ\]Y[˜ÙSX™[˜OØÑQÑS”ÑRUQÑTÈS•T‘TÔÑXOØÔ‘S–‘HÑTÑU•˜ÑRSˆSÓQS•›ÛİÕ\›ØOØ	Û›˜[Y_H™XYÚY\[ˆÜ0é\™[ˆÙ\Ü°éÚ[ˆ\œğí››XÚ\‹X™\ˆšXÚ]]ÛX]\ØÚ›ÛX[\ØÚ˜˜ÙZ]\™H™\œİXÚH[šİ[ÛšY\™[ˆ\‹Ù[›ˆ\İ[™™^šYZ[™È[™™\š[[ˆÚXÚ™\°é™\›‹˜›ÚY_ZYŠ\OOOXÚY
^Û][[
Kš][RY
K[‹™[OMKO[‹™[OÜ™]\›İ^˜	Û‹^IÜØYH]\İØZ™ZYİ\ÜÈH™Z[H›Üš\šYÙ[ˆÙ\Ü°éÚ]ğéÚXÚYÙZ0íœ\İ˜šOØ\ÈÙ\ØÚ[šÈÚ\™šXÚ™\˜œ˜]XÚÙZ[YH\œÛÛˆ\ÈÛ\ˆX›Z˜˜X™[][ÛœÚ\›‹™[KZ[]\ÎŒ‹İXØÙ\ÜÎ›‹™[OŒ›ÛX[˜ÙQ[N™ÙWOÛ‹™[N›ÚYÛÛœİ[YR][NšOİ›ÚYš][RYY]šXÜÎœŞÜ™\]][ÛŒKYÛš]NŒ_NšOŞÙYÛš]N‹LŸN›ÚY›YÜÎœŞÖØÚY][™\œİÛÙIÙ_XNˆLNšOŞÖØÚY[Z\ÜÙYIÙ_XNˆLN›ÚYÛÛœÙ\]Y[˜ÙSX™[œØUQ“QT’ÔĞSRÑRUšOØSĞÒHUTÕĞR˜‘T”ÓÔ‘ÕS‘Ø›ÛİÕ\œØYHšYİ\ˆ\š[›™\ÚXÚÜ0é\ˆ\˜[‹\ÜÈ\ÈÙ\ØÚ[šÈHZˆ\ÜİK˜˜Ù\ØÚ[šÙH\œÙ]™[ˆÙZ[™HÚ\˜Zİ\™Ù\™XÚ[ˆÙ\Ü°éÚK˜_[]O\ÛÙWKÏT™š[™
OšYOOYJNÜ™]\›İ^˜OØ	ÛÏË›˜[YOÏÙ_HØYİKˆ[HX[Hœš[™İ	ØKœİ™[™İÖÌ_KX™\ˆ]XÚ	ØKÙXZÛ™\ÜÙ\ÖÌ_HÛÛšÜ™]H]\İÚ\šİ[™Ù[ˆ]Yˆğé\™H[™Z[š\ÜY[K˜˜Y\ÙH\œÛÛˆ\İšXÚ[È™YÛZ]\ˆ›Ü™Ù\ÙZ[‹ˆZ[ˆ™Z[ˆÚ\™Y\ÛX[šXÚ[È™\œİXÚİH]Y\İ™Z[™[˜™[][ÛœÚ\˜OÌŒZ[]\ÎŒ‹İXØÙ\ÜÎˆHXK™XÜZ]ˆHXK›YÜÎ˜OŞÖØ™XÜZ]YIÙ_XNˆLN›ÚYÛÛœÙ\]Y[˜ÙSX™[˜OØPSH‘T”Õ0á’Õ˜ÓT‘HÔ‘S–‘X›ÛİÕ\˜OØ	ÛÏË›˜[YOÏÙ_H\İ[HYÙ\™™]Y\ˆ[™[ˆğé\™[ˆ[È™YÛZ]\ˆ™\™°ïØ˜\‹˜›ÚY_Y[˜İ[Ûˆ›
K
^Û]YİNÜ™]\›ˆØš™XİšÙ^\ÊKš[™[ÜJK™š[\ŠOŠKš[™[ÜVİOÏÌ
OŒ	‰ˆHZİJKœÛÜ

K
OOŠËœ™Y™\œ™YÚYËš[˜ÛY\ÊJOËL›Ë™\ÛZÙYÚYËš[˜ÛY\ÊJOÌŒ
KJËœ™Y™\œ™YÚYËš[˜ÛY\Ê
OËL›Ë™\ÛZÙYÚYËš[˜ÛY\Ê
OÌŒ
_K›ØØ[PÛÛ\\™J
JKœÛXÙJ
_Y[˜İ[Ûˆ[
K
^Û]^Üİ\ÚN–ØÙ[œİ\›ÛšYHİ][›XXÚÜXÚ™\œİXÚ[˜Z[ˆÜY[\š\ØÚ\ÈY[Z]XÚ[H[\™\ÜÙH™\˜š[™[˜›XÚÚÛÛZİ[[‹Ú™Hİ]\İZÈ\˜]\ÈHXXÚ[˜K[N–Ø\™ZİÙZ[‹Ú™H]]Ù\ˆÜ›ğçÜÜ\šYÈHÙ\™[˜Z[™HÙ[YZ[œØ[YHZYÙH[™H›ÜœØÚYÙ[˜[\™\ÜÙH™ZYÙ[‹˜XÚ[HH]ğéÚXÚÙZÛ™[ˆ\İKÚ\˜N–ØZ[™HXÚHÙ\ØÚXÚHİ]Z[™\ˆÜÙH[˜šY][˜Z[™HZYÙHZ[]HÙ[YZ[œØ[HİZ[ˆ\ÜÙ[˜\ÈXÚ\ğé™[‹Ú™HXÚÙ[œİ[œÈš[H°é™Ù[˜_NÜ™]\›ˆ–ÙWVÓX]˜XœÊ
I[–ÙWK›[™İ_\ÛŠ
NÙ[˜İ[Ûˆ›
KUËœÛ˜\Úİ

J^Û]Z
KŠKOXÛŠKŠNÜ™]\›ˆOØ	ÜŸH	Ú_XœŸY[˜İ[Ûˆ
K‹SX]œ˜[™ÛJ^Û]O[ŠKÛ
K‹ËœÛ˜\Úİ

KŠJNÜ™]\›ˆØJKJKK™›ÛİÕ\	‰ŠK^X	ÚK^OÛX[‰ÚK™›ÛİÕ\OÜÛX[˜
K_]˜\ˆÛX[\ËX›]YKXYšXK[Ë[XZ[‹]ŒXO[™]ÈÜŠ™]ÈÛ\ÜŞÚÙ^NØÛÛœİXİÜŠJ^İ\ËšÙ^OY_YÙ]][J
^Ü™]\›ˆØØ[İÜ˜YÙK™Ù]][J\ËšÙ^J_\Ù]][JK
^ÛØØ[İÜ˜YÙKœÙ]][J\ËšÙ^K
_\™[[İ™R][J
^ÛØØ[İÜ˜YÙKœ™[[İ™R][J\ËšÙ^J__JÛ
JKÛ\KœÛ˜\Úİ

KUËœÛ˜\Úİ

KÛ[Û^ŞÛÛÜ›ÜÚ][Û‹NÛÛÜ›ÜÚ][Û‹K™YÚ[Û˜\œš]˜[KÛ[L›L[^ßK›YØİ[Y[™Ù][[Y[RY
\
NÚYŠS›
]›İÈ\œ›ÜŠZ\ÜÚ[™ÈÈØ[\ZYÛˆ\›Ûİ
NÓ›š[›™\’SZİJ
Nİ˜\ˆO^Ú[›Î–
Ø[\ZYÛ‹Z[›Ø
K[›Õš\İX[–
[›Ë]š\İX[
K[›ÒÚXÚÙ\–
[›ËZÚXÚÙ\˜
K[›Õ]N–
[›Ë]]X
K[›Ó[™\Î–
[›Ë[[™\Ø
K[›Ô›ÙÜ™\ÜÎ–
[›Ë\›ÙÜ™\ÜØ
K[›Ğ˜XÚÎ–
[›ËX˜XÚØ
K[›Ó™^–
[›Ë[™^
K[›ÔÚÚ\–
[›Ë\ÚÚ\
KÜ™X]Ü–
Ø[\ZYÛ‹XÜ™X]Ü˜
KÚÜ–
Ø[\ZYÛ‹\ÚÜ
KØ[YTÚ[–
Ø[\ZYÛ‹YØ[YX
KØ[YS[İ[–
Ø[\ZYÛ‹]ÛÜ›
KØš™Xİ]™U]N–
Øš™Xİ]™K]]X
KØš™Xİ]™U^–
Øš™Xİ]™K]^
KØš™Xİ]™Q\İ[˜ÙN–
Øš™Xİ]™KY\İ[˜ÙX
K[YN–
[YK[X™[
K™YÚ[Û–
™YÚ[Û‹[X™[
K[Û™^N–
[Û™^K[X™[
Kİ]\Ù\Î–
İ]\Ë[\İ
K™YYÎ–
™YYË[\İ
KY]šXÜÎ–
Y]šXÜË[\İ
K[™[ÜN–
[™[ÜK[\İ
K™[][ÛœÚ\Î–
™[][ÛœÚ\[\İ
K›ÛX[˜ÙN–
›ÛX[˜ÙK[\İ
KX[N–
X[K[\İ
K]XÚÜÎ–
]XÚË[\İ
KÚ›ÛšXÛN–
Ú›ÛšXÛK[\İ
K›Û\–
[\˜Xİ[Û‹\›Û\
K›Û\^–
[\˜Xİ[Û‹]^
KØÛÜ™N–
ÙYZÙ[™\ØÛÜ™X
KZ[š[X\–
Z[š[X\
KØ\İ–
Ø\İ
K[Ù[–
Ù[™\šXË[[Ù[
K[Ù[]N–
[Ù[]]X
K[Ù[ÚXÚÙ\–
[Ù[ZÚXÚÙ\˜
K[Ù[ÛÜN–
[Ù[XÛÜX
K[Ù[Ü[ÛœÎ–
[Ù[[Ü[ÛœØ
K[Ù[ÛÜÙN–
[Ù[XÛÜÙX
K˜]N–
˜]K[[Ù[
K˜]U]N–
˜]K]]X
K˜]T›İ[™–
˜]K\›İ[™
K˜]T^Y\˜\–
˜]K\^Y\‹X˜\˜
K˜]Q[™[^P˜\–
˜]KY[™[^KX˜\˜
K˜]T^Y\•˜[YN–
˜]K\^Y\‹]˜[YX
K˜]Q[™[^U˜[YN–
˜]KY[™[^K]˜[YX
K˜]T^Y\”İ]\Ù\Î–
˜]K\^Y\‹\İ]\Ù\Ø
K˜]Q[™[^Tİ]\Ù\Î–
˜]KY[™[^K\İ]\Ù\Ø
K˜]S[İ™\Î–
˜]K[[İ™\Ø
K˜]SÙÎ–
˜]K[ÙØ
K˜]PÛÜÙN–
˜]KXÛÜÙX
KZ[šN–
Z[šYØ[YK[[Ù[
_NÜKœİXœØÜšX™JOOĞÛYK

KK™Ø[YTÚ[šY[ŸÛ

_JKËœİXœØÜšX™JOOÒYK

KK™Ø[YTÚ[šY[ŸÛ

_JKJ
K

NÙ[˜İ[Ûˆ

^ÚYŠ›

KR‹š[›ÔÙY[Š^Ñ›
Kš[›ÊK[

K

NÜ™]\›ŸZYŠPÛœ›Ùš[J^Ñ›
K˜Ü™X]ÜŠK›

NÜ™]\›ŸZYŠPÛœ›ÛÙİYKœÚÜ[™ĞÛÛ\]J^Ñ›
KœÚÜ
K

NÜ™]\›ŸQ›
K™Ø[YTÚ[
KÛ

_Y[˜İ[Ûˆ›
J^Ù›ÜŠ]Ù–ÖKš[›ËK˜Ü™X]Ü‹KœÚÜK™Ø[YTÚ[J]šY[]OOY_Y[˜İ[Ûˆ[

^Û]OWÙVÚ›NÖKš[›Õš\İX[™]\Ù]š\İX[YKš\İX[Kš[›ÒÚXÚÙ\‹^ÛÛ[YKšÚXÚÙ\‹Kš[›Õ]K^ÛÛ[YK]KKš[›Ó[™\Ëš[›™\’SYK›[™\Ë›X\

K
OO˜İ[OH‹K[[™N‰İH‰ÓİJJ_OÜ˜
Kš›Ú[Š
KKš[›Ô›ÙÜ™\ÜËš[›™\’SWÙK›X\

K
OO˜]Ûˆ\OH˜]Ûˆˆ]KZ[›ËZ[™^H‰İHˆÛ\ÜÏH‰İOOZ›ØXİ]™X˜Hˆ\šXK[X™[H‰ÓİJK]J_HØ]Û˜
Kš›Ú[Š
KKš[›Ô›ÙÜ™\ÜËœ]Y\TÙ[XİÜ[
Ù]KZ[›ËZ[™^X
K™›Ü‘XXÚ
OO™K˜Y]™[\İ[™\ŠÛXÚØ

OOÚ›S[X™\ŠK™]\Ù]š[›Ò[™^
_›

K[

K

_JJKKš[›Ğ˜XÚË™\ØX›YZ›OOLKš[›Ó™^^ÛÛ[Z›OOWÙK›[™İLOØÛØÚ[™[™H™YÚ[›™[˜˜ÙZ]\˜Y[˜İ[Ûˆ

^Ğ[]Ú[™İËœÙ][Y[İ]


OOÚ›ÙK›[™İLI‰Š›
ÏLK[

K

J_KÙVÚ›K™\˜][ÛŠ_Y[˜İ[Ûˆ›

^Ğ[	‰Ú[™İË˜ÛX\•[Y[İ]
[
K[LY[˜İ[Ûˆ›

^Ô›

KË›X\šÒ[›ÔÙY[Š
KÛœ›ÛÙİYKš[›ÔÙY[ŸK˜ÛÛ\]R[›Ê
_Y[˜İ[Ûˆ›

^Û]OV
Ü™X]Ü‹\™]šY]Ø
KQ]J^Y\‹[˜[YX
_[™°êXÙKš[›™\’SX]ˆÛ\ÜÏHœ™]šY]Ë\\œÛÛˆ›ÙKIÑ]J›ÙK]\X
_›Ü›X[HZ\‹IÑ]JZ\‹\İ[X
_İ\˜HXØÙ\ÜÛÜKIÑ]JXØÙ\ÜÛÜX
_ÙZ[œØHOÚOØÜ[ÜÜ[Ù]İ›Û™Ï‰ÓİJ
_OÜİ›Û™ÏÛX[‰ÓİJ]J˜Z]
_Ú\›X[
_H0­ÈZğï™YÙ\ˆZ]™\\œØXÚ\ÜÛX[˜Y[˜İ[Ûˆ›

^Û]O^Û˜[YN‘]J^Y\‹[˜[YX
Kš[J
_[™°êXÚÚ[•Û™N‘]JÚÚ[‹]Û™X
_ÙXMÙXZ\‘]JZ\‹XÛÛÜ˜
_ÍLÌŒÚ\‘]JÚ\XÛÛÜ˜
_ÙMXYØÚÜÎ‘]JÚÜËXÛÛÜ˜
_ÌMMMZ\”İ[N‘JZ\‹\İ[Xİ\˜
K›ÙU\N‘J›ÙK]\X›Ü›X[
KXØÙ\ÜÛÜN‘JXØÙ\ÜÛÜXÙZ[œØ
K˜Z]‘J˜Z]Ú\›X[
_NÜKœÙ]›Ùš[JJKÚ[™İË™\Ü]Ú]™[
™]Èİ\İÛQ]™[
ËXØ[\ZYÛ‹\›Ùš[XÙ]Z[™_JJ_Y[˜İ[Ûˆ

^Û]OV
ÚÜZ][\Ø
K^J
KLK]Ö
ÚÜXYÙ]
K^ÛÛ[X	ÛŸH8 «
ÚÜXYÙ]
K˜Û\ÜÓ\İÙÙÛJ™YØ]]™X
K
Ø\ÚY\‹[[™X
K^ÛÛ[X™J™K
ÓØš™Xİ˜[Y\Ê[
Kœ™YXÙJ
K
OO™Jİ
JKKš[›™\’SSØš™Xİ˜[Y\Ê
K›X\
OOÛ]S[ÙKšYOÏÌX™JYVÙKšYOÏÖÙK™\ØÜš\[Û—KŠİ
ÙKšY›[™İ
NÜ™]\›˜\XÛHÛ\ÜÏHœÚÜZ][H	ÛØÙ[XİY˜H‚ˆ]ˆÛ\ÜÏHœÚÜZ][KZXYÜ[‰ÙKšXÛÛŸOÜÜ[]İ›Û™Ï‰ÓİJK›X™[
_OÜİ›Û™ÏÛX[‰ÙKœšXÙ_H8 «ÜÛX[Ù]Ù]‚ˆ‰ÓİJŠ_OÜ‚ˆ›Ûİ\]Ûˆ\OH˜]Ûˆˆ]K\ÚÜH‰ÙKšYHˆ]KY[OH‹LHˆ	ÛLØ\ØX›Y˜O¸¢$Ø]Û‰ÛŸOØ]Ûˆ\OH˜]Ûˆˆ]K\ÚÜH‰ÙKšYHˆ]KY[OHŒHˆ	ÛYK›X^Ø\ØX›Y˜OŠÏØ]ÛÙ›Ûİ\‚ˆØ\XÛO˜JKš›Ú[Š
KKœ]Y\TÙ[XİÜ[
Ù]K\ÚÜX
K™›Ü‘XXÚ
OO™K˜Y]™[\İ[™\ŠÛXÚØ

OOÛ]YK™]\Ù]œÚÜÏØS[X™\ŠK™]\Ù]™[J_Ó[İOSX]›X^
X]›Z[ŠİOË›X^ÏÌ
[İOÏÌ
JÛŠJK

_JJNÛ]V
ÚÜYš[š\Ú
NÜ‹™\ØX›Y[L‹^ÛÛ[]ŒØ°ïˆ	İH8 «™^˜Z[ˆ[™ÜÙ˜Z™[˜˜Z[™\İ[œÈZ[™H™Z[ØÚZY[™ÈØ]Y™[˜Y[˜İ[Ûˆ[

^Û]O\K˜ÛÛ\]TÚÜ[™Ê[
KV
ÚÜY\œ›Ü˜
NÚYŠYK›ÚÊ^İ^ÛÛ[YK™\œ›ÜÏØ\ˆZ[šØ]Yˆİ\™HÙ[œİ›Ûˆ\ˆØ\ÜÙHX™Ù[Z˜Ü™]\›Ÿ]^ÛÛ[XËœÙ]İYÙJ\œš]˜[°ïˆ	ÙKİ[H8 «Z[™ÙZØ]Yˆ	ÌKYKİ[H8 «›ZX™[ˆ°ïˆÚ]X][Û™[‹YHÙ™š^šY[šXÚ›Ü™Ù\ÙZ[ˆÚ[™˜
KÚ[™İË™\Ü]Ú]™[
™]Èİ\İÛQ]™[
ËXØ[\ZYÛ‹][\ÜÙ]Z[ŞLNŒMŒ_JJ_Y[˜İ[ÛˆÛ

^ÚYŠÛ
\™]\›Û]O^ÙÙ]Û˜\Úİ‘ÛÛ’[\˜Xİœ[Û“™X\˜N™OOÚÛYKKœ›Û\šY[HY_]J
KI‰ŠKœ›Û\^^ÛÛ[YKšÚ[™OOXÚ\˜Xİ\˜Ø	ÙK›X™[H[œÜ™XÚ[˜™K›X™[
_KÛ”ÜÚ][ÛŠKŠOOÓÛ^Ş™KN™YÚ[Û›ŸKKœÙ]ÛÜ›ÜÚ][ÛŠK
KJ
__NİÛVŠK™Ø[YS[İ[JK[™]ÈœÊK›Z[šKİJK‹œ]Y\İİYÙOOOX\œš]˜[	‰Ú[™İËœÙ][Y[İ]


OOÚ[™İË™\Ü]Ú]™[
™]Èİ\İÛQ]™[
ËXØ[\ZYÛ‹][\ÜÙ]Z[ŞLNŒMŒ_JJKL
KÛ

_Y[˜İ[ÛˆÛ

^Ü™]\›ˆË˜]YÛY[Û˜\Úİ
Û
_Y[˜İ[ÛˆÛ

^Û]OQÛ

KUË›Øš™Xİ]™J
NÖK›Øš™Xİ]™U]K^ÛÛ[]]KK›Øš™Xİ]™U^^ÛÛ[]^Û]^]J\™Ù]Y
NÖK›Øš™Xİ]™Q\İ[˜ÙK^ÛÛ[[Ø	ÓX]œ›İ[™
X]š\İ
‹SÛ‹KSÛJJ_HX˜K[YK^ÛÛ[XYÈ	ÙK™^_H0­È	ÙK˜ÛØÚÓX™[H0­È	ÙKœ\ÙSX™[XKœ™YÚ[Û‹^ÛÛ[]İJÛœ™YÚ[ÛŠKK›[Û™^K^ÛÛ[X	ÙK›[Û™^_H8 «KœØÛÜ™K^ÛÛ[Tİš[™Ê‹ÙYZÙ[™ØÛÜ™JKKœİ]\Ù\Ëš[›™\’SQYJK›™YYÊK›X\
OO˜Ü[ˆİ[OH‹K\İ]\ÎˆÉÙK˜ÛÛÜ‹Ôİš[™ÊMŠKœYİ\
‹
_Hˆ]OH‰ÓİJK™\ØÜš\[ÛŠ_H‰ÓİJKœÚÜX™[
_OÜÜ[˜
Kš›Ú[Š
_Ü[ˆÛ\ÜÏHœİX›H”ÕP’SÜÜ[˜K›™YYËš[›™\’SVÖØ[™\™ÚYXK›™YYË™[™\™ŞKLWKØ[™Ù\˜K›™YYËš[™Ù\‹LKØ\œİK›™YYË\œİLKØ›\ÙXK›™YYË˜›Y\‹LKØ[ÛÚÛK›™YYË˜[ÛÚÛLKØœ™Z]K›™YYËšYÚ™\ÜËLKØØ]\˜K›™YYËš[™Ûİ™\‹LKØ]]K›™YYË˜Ûİ\˜YÙKLWWK›X\

ÙK—JOO”İJİš[™ÊJK[X™\Š
KH[ŠJKš›Ú[Š
KK›Y]šXÜËš[›™\’SVÖØğï™XK›Y]šXÜË™YÛš]WKØÚ[ÜØK›Y]šXÜË˜Ú[Ü×KØY˜K›Y]šXÜËœ™\]][Û—KØ[ÛY[[XK›Y]šXÜË›[ÛY[[JÍLWK›X\

ÙKJOO”İJİš[™ÊJK[X™\Š
KOOOXÚ[ÜØ
JKš›Ú[Š
KKš[™[ÜKš[›™\’SSØš™Xİ˜[Y\Ê
K›X\
OÛ]YKš[™[ÜVİšYOÏÌÜ™]\›˜]Ûˆ\OH˜]Ûˆˆ]KZ][OH‰İšYHˆ	ÛL]™Y™™XİÏØ\ØX›Y˜OÜ[‰İšXÛÛŸOÜÜ[İ›Û™Ï‰ÓİJ›X™[
_OÜİ›Û™ÏÛX[‰ÛŸpåÏÜÛX[Ø]Û˜JKš›Ú[Š
KKš[™[ÜKœ]Y\TÙ[XİÜ[
Ù]KZ][WX
K™›Ü‘XXÚ
OO™K˜Y]™[\İ[™\ŠÛXÚØ

OO™İJK™]\Ù]š][OÏØ
JJKKœ™[][ÛœÚ\Ëš[›™\’ST›X\
OÛ]HHYK™›YÜÖØY]IİšYXKYKœ™[][ÛœÚ\ÖİšYOÏÌÜ™]\›˜]Ûˆ\OH˜]Ûˆˆ]KY›Øİ\ÏH‰İšYHˆÛ\ÜÏH‰ÛØY]˜HÜ[ˆİ[OH‹K\Ü˜Z]‰İ˜ÛÛÜŸH‰İœÜ˜Z]OÜÜ[]İ›Û™Ï‰ÓİJ›˜[YJ_OÜİ›Û™ÏÛX[‰ÛØ	ĞİJŠ_H™^šYZ[™Ø˜›ØÚšXÚÙY[™[˜OÜÛX[Ù]Ø]Û˜JKš›Ú[Š
KKœ™[][ÛœÚ\Ëœ]Y\TÙ[XİÜ[
Ù]KY›Øİ\×X
K™›Ü‘XXÚ
OO™K˜Y]™[\İ[™\ŠÛXÚØ

OOÚ[™İË™\Ü]Ú]™[
™]Èİ\İÛQ]™[
ËXØ[\ZYÛ‹Y›Øİ\ØÙ]Z[™K™]\Ù]™›Øİ\ßJJJJKKœ›ÛX[˜ÙKš[›™\’SVØİ\ÚX[XÚ\˜XK›X\
OOÛ]R‹œ›ÛX[˜ÙVÙWNÜ™]\›˜]İ›Û™Ï‰ÓİJ–ÙWOË›˜[YOÏÙJ_OÜİ›Û™ÏÜ[‰ÓX]œ›İ[™
š[\™\İ
_H[\™\ÜÙOÜÜ[Hİ[OHÚY‰ÓX]›X^
š[\™\İ
_IHÚOÛX[‰İ›\İ[™OÓİJ›\İ[™JN˜›ØÚÙZ[ˆ›ÛX[\ØÚ™\Ù\˜\™\ˆ›Ü™Ø[™Ë˜OÜÛX[Ù]˜JKš›Ú[Š
KKX[Kš[›™\’SR‹˜Xİ]™UX[K›[™İÒ‹˜Xİ]™UX[K›X\
OO˜]Ûˆ\OH˜]Ûˆˆ]K]X[K\™[[İ™OH‰Ù_Hİ›Û™Ï‰ÓİJ–ÙWOË›˜[YOÏÙJ_OÜİ›Û™ÏÛX[˜Zİ]ˆ0­È[™\›™[ÜÛX[Ø]Û˜
Kš›Ú[Š
N˜“›ØÚÙZ[ˆZİ]™\ÈX[Kˆ™ZH0é™K™][ˆpí™ÛXÚH]\Ü™Y[‹Ü˜KX[Kœ]Y\TÙ[XİÜ[
Ù]K]X[K\™[[İ™WX
K™›Ü‘XXÚ
OO™K˜Y]™[\İ[™\ŠÛXÚØ

OO•ËœÙ]Xİ]™UX[J‹˜Xİ]™UX[K™š[\ŠOOOYK™]\Ù]X[T™[[İ™JJJJKK˜]XÚÜËš[›™\’SR‹›X\›™Y]XÚÜË›X\
OOÛ]Z™VÙWKR‹™\]Z\Y]XÚÜËš[˜ÛY\ÊJNÜ™]\›˜]Ûˆ\OH˜]Ûˆˆ]KX]XÚË]ÙÙÛOH‰Ù_HˆÛ\ÜÏH‰ÛØ\]Z\Y˜Hİ›Û™Ï‰ÓİJœÚÜX™[
_OÜİ›Û™ÏÛX[‰ÛØ]\ÙÙ\°ïİ]˜Ù[\›OÜÛX[Ø]Û˜JKš›Ú[Š
KK˜]XÚÜËœ]Y\TÙ[XİÜ[
Ù]KX]XÚË]ÙÙÛWX
K™›Ü‘XXÚ
OO™K˜Y]™[\İ[™\ŠÛXÚØ

OO•ËÙÙÛP]XÚÊK™]\Ù]˜]XÚÕÙÙÛJJJKK˜Ú›ÛšXÛKš[›™\’SVÒ‹›\İ]™[‹‹™K˜Ú›ÛšXÛKœÛXÙJM
Kœ™]™\œÙJ
K›X\
OO™K^
WK™š[\Š›ÛÛX[ŠK›X\

K
OO˜Û\ÜÏH‰İOOLØ]\İ˜H‰ÓİJJ_OÜ˜
Kš›Ú[Š
KJ
_Y[˜İ[Ûˆ[
J^ÚYŠ]J
J\™]\›ÚYŠKšÚ[™OOXÚ\˜Xİ\˜
^Ò›
KšY
NÜ™]\›Ÿ[]YKšYÚYŠOOX[šØ
^ÚYŠ‹œ]Y\İİYÙHOOX\œš]˜[
\™]\›ˆJ\ˆÛÙ™™\œ˜][H\İ™\™Z]ÈÙ™™[‹ˆÙZ[ˆ[š[›ZX›İ™[H›Üİ\™œİ›Û˜
NÕËœÙ]İYÙJ™\Ù\˜][Û˜\ˆÛÙ™™\œ˜][H0í™™›™]ÚXÚˆ™[KÙ]°éšÙH[™ØX™[Ø\[ˆ]YˆZ[™HY\˜\˜ÚYKYHšY[X[™›Ü˜™\™Z]]]˜
KK˜Y˜[˜ÙSZ[]\Ê
KİJ›ÚYØ\œX
KJ°éÚİ\ˆØÚš]ˆ™\Ù\šY\[™È[HØÚØ\™[ˆœ™]İXÚ[‹˜
NÜ™]\›ŸZYŠOOX™\Ù\˜][Û›Ø\™
^Ô[

NÜ™]\›ŸZYŠOOXİ[™[X
^É

NÜ™]\›ŸZYŠOOX]XÚ\œ]˜
^ÚYŠR‹˜]]Üš]P˜]UÛÛŠ\™]\›ˆJYHØÚ˜[šÙH›ZXÙ\ØÚÜÜÙ[‹ˆ[H™[›\È8 'œ\ÚZØ[\ØÚH™\Ø[[™ø '—L
NÕËœÙ]İYÙJİÙ\˜\ˆØYÙ[ˆ\œ™ZXÚ[ˆ]XÚ\œ]‹ˆ\ˆİ›ÛZØ\İ[ˆÚ\šİ[È0éH\ˆ\ÈÛÛ[Y[ˆÙZ[‹˜
KK˜Y˜[˜ÙSZ[]\Ê
KJ™\˜š[™H™]İ›ÛZØ\İ[ˆ[™ØX™[›Û[Y[˜
NÜ™]\›ŸZYŠOOXİÙ\›Ş
^ÚYŠR‹˜]]Üš]P˜]UÛÛŠ\™]\›ˆJÚ™HZ[›\ÜÈÙZ[ˆİ›ÛKˆÚ™Hİ›ÛH[[Y\š[ˆ]XÚÙZ[™HØÚXÚH]\ÚZË˜
NÚYŠ‹œİÙ\ÛÛ›™XİY
\™]\›ˆJ\ˆİ›ÛH0éYˆ\ÈØX™[›ZX[ÈİÛ\™˜[H[HY]YØ[YK˜
NÕË˜ÛÛ›™XİİÙ\Š
KJKİÙ\ÛÛ›™XİY
KK˜Y˜[˜ÙSZ[]\ÊJKİJ›ÚYØ\œX
KJİ›ÛH™\˜[™[‹ˆÙ]°éšÙK™[H[™ØX™[]\ÛY[‹˜
NÜ™]\›ŸZYŠOOXš[šÜØOOX[ØOOXØX›X
^ÚYŠR‹œİÙ\ÛÛ›™XİY
\™]\›ˆJ\œİİ›ÛH\œİ[[‹ˆYH™ZZ[™›ÛÙH\İ[›ÙÚ\ØÚX™\ˆ]Y\İXÚš\ØÚ™\˜š[™XÚ˜
NÛ]O]ÚYŠ‹[›ØY[™ÖÙWJ\™]\›ˆJ™\™Z]È]\ÙÙ[Y[‹ˆšY[X[™°éİ\Èœ™Z]Ú[YÈZ[ˆÙZ]\ÈX[˜
NÕË›X\šÕ[›ØYY
JKK˜Y˜[˜ÙSZ[]\ÊOOOX[ØÌLŠK˜JKÙ[™\™ŞN™OOOX[ØËMN‹LŸJKİJ›ÚYØ\œX
NÜ™]\›ŸZYŠOOXš\œİ™Y\˜
^ÜİJ
NÜ™]\›ŸZYŠOOXÛYU[
^ÜKœ™\İ
Œ
KİJ›ÚYÚ]
KJZ[™Hİ[™H[H™[ˆ[™\™ÚYHİZYİ™Z][™ÛŞšX[HÛÛ›ÛHÚ[šÙ[‹˜
NÜ™]\›ŸZYŠOOXØ[š]\X
^ÜKœ™[Y]™J
KİJ›ÚYÚY\˜
KJØ[š]0éˆ\œ™ZXÚˆYHğï™H\š0éZ[™Hİ\™H™\˜YÜİ™\›0é™Ù\[™Ë˜
NÜ™]\›ŸZYŠOOXYÙX
^Ø]JYÙTYX
NÜ™]\›ŸZYŠOOXØ[\š\™X
^ØİJ
NÜ™]\›ŸZYŠOOX›İXÙP›Ø\™
^ÛJ
NÜ™]\›ŸZYŠOOX›\İ\
^Ø]J›\İ\
NÜ™]\›ŸZYŠOOX™Y\”Û™Ø
^Ø]J™Y\”Û™Ø
NÜ™]\›ŸZYŠOOX›[šŞX˜[
^Ø]J›[šŞX˜[
NÜ™]\›ŸZYŠOOXX\ÛÛX
^Ø]JX\ÛÛX
NÜ™]\›Ÿ]OOX›Û›P˜]X	‰™]J›Û›X
_Y[˜İ[Ûˆ›
J^ÚYŠ
OOOXİ[™[XOOOX[X
I‰’‹œ]Y\İİYÙOOOX]]Üš]X	‰ˆR‹˜]]Üš]P˜]UÛÛŠ^É

NÜ™]\›ŸZYŠOOOX›Û›X	‰ˆR‹™›YÜËœ›Û›QY™X]Y
^İ]J’USS’ÓÓ•RÕš]˜[[‹T›Û›X›
KÛ

KŠKÙJ\Èœ\İY[™YÚ[›™[˜›Û›H0éÜİÚXÚ\ˆ\˜Ú›Ûİ0é™YÙH\™İ[Y[]]™H\œØÚ0íœ[™È0ï™\™]YÙ[‹˜

OO™]J›Û›X
K[™Ù\˜
KJ\œİ›Ü›X[Z]ZH™Y[˜Ø[›ˆ™^šYZ[™Ù[ˆ[™Ü0é\ˆYHÙÚZËP]XÚÙHœ™Z\ØÚ[[‹˜

OO–[
JJWJNÜ™]\›ŸZYŠOOOXX[›šX	‰ˆR‹™›YÜËœ\\‘Ú]™[Š^Û]JÛš[™[ÜKšÛÜ\Y\ÏÌ
OŒİ]JĞS’U0á‘H“ÕQÑXX[›šHZ\ØÚXX[›šHİZ›Üˆ[HØ[š]0é™ÙX°éYHZ]\ˆZY[™HZ[™\ÈX[›™\Ë\ÜÙ[ˆZİ[™›ÛˆÙZ[YÚYÙ[H\Y\ˆXš0é™İ˜ÙJÛÜ\Y\ˆ0ï™\œ™ZXÚ[˜Ø™\˜œ˜]XÚpåÈÛÜ\Y\ˆ0­ÈÙZˆÚHŞX[]0éİÚ\šİ[™Ø˜šXÚ[H[™[\˜

OO–›

KX[X]
KJ\ÈÙ\Ü°éÚ]YˆÜ0é\ˆ™\œØÚYX™[˜X[›šHÚ\™Y\ÙH[ØÚZY[™ÈšXÚØXÚXÚ\š[›™\›‹˜

OO–[
JJWJNÜ™]\›ŸV[
J_Y[˜İ[Ûˆ[
J^Û]U–ÙWNÚYŠ]
\™]\›ÜKœÛØÚX[^™JJNÛ]QÛ

KUË˜ÛÛ™\œØ][ÛŠJKOX›
K‹Ë‹‹’‹ÛÛ™\œØ][ÛÛİ[ÎË‹‹’‹˜ÛÛ™\œØ][ÛÛİ[ËÙWNœŸ_JKOYÛ
K‹ËœÛ˜\Úİ

JN×İJK™Ü™Y][™Ğ[š[X][ÛOOX[ØØ[Ø˜Ø]™X
K]Jœ›ÛK›˜[YKKK›X\
O™J›X™[š[

OO–
K˜Xİ[ÛŠKÛ™K™\ØX›Y
JJ_Y[˜İ[Ûˆ
K
^ÚYŠ\OOOXX]™X
^ÜJ
NÜ™]\›Ÿ[]^
KÛ

JNÚYŠ‹›Z[]\É‰œK˜Y˜[˜ÙSZ[]\Ê‹›Z[]\ÊK‹œ™[][ÛœÚ\	‰•Ë˜Y™[][ÛœÚ\
K‹œ™[][ÛœÚ\‹^
K‹˜ÛÛœİ[YR][I‰—ØJK‹˜ÛÛœİ[YR][JK‹›X\›™Y]XÚÉ‰•Ë›X\›]XÚÊ‹›X\›™Y]XÚË™]YH]XÚÙNˆ	Ú™VÛ‹›X\›™Y]XÚ×K›X™[K˜
K\OOOX›\	‰•Ëœ™XÛÜ™›\
KH[‹œİXØÙ\ÜË‹œ›ÛX[˜ÙQ[OÏÌ‹^
K\OOOXÚY	‰›‹œ›ÛX[˜ÙQ[HOO]›ÚY	‰•Ëœ™XÛÜ™›\
K‹œ™[][ÛœÚ\Œ‹œ›ÛX[˜ÙQ[K‹^
K‹œ™XÜZ]
^Û]VË‹‹’‹˜Xİ]™UX[K™š[\ŠOOOYJKWKœÛXÙJLÊNÕËœÙ]Xİ]™UX[J
_WİJK\OOOX›\Û‹œİXØÙ\ÜÏØ›\˜ÚYØ›‹œİXØÙ\ÜÏØ[Ø˜İYÙÙ\˜
KİJ›ÚY\OOOX›\Û‹œİXØÙ\ÜÏØ›\˜İYÙÙ\˜›‹œİXØÙ\ÜÏØ[Ø˜ÚYØ
K]J‹œİXØÙ\ÜÏOOHLOØTÈĞTˆ’PÒQPS˜ÑTÔ°áÒÑ“ÓÑX–ÙWOË›˜[YOÏÙK‹^ÙJÙZ]\œ™Y[˜™]YHÜ[Û™[ˆ[™™ZZ[™›ÛÙX

OO–[
JJKJÙ\Ü°éÚ™Y[™[˜\°ïÚÈ]Yˆ[ˆ]˜JWJ_Y[˜İ[Ûˆ›

^×ØJKÛÜ\Y\˜
I‰ŠËœÙ]›YÊ\\‘Ú]™[˜LX[›šH\š0éÛÜ\Y\‹ˆÙZ[™HŞX[]0éİZYİØÚ™[\ˆ[È™YH[™\™H™^šYZ[™È\ÈYÙ\Ë˜
KË˜Y™[][ÛœÚ\
X[›šXN
KËœÙ]Xİ]™UX[JË‹‹’‹˜Xİ]™UX[KX[›šXKœÛXÙJLÊJKJKY][X[›šX
KXJKÜ™\]][ÛYÛš]NŒË[ÛY[[N_KYHœ˜][™HÜš\ÙHİ\™H\˜Ú›Ü˜]\ÜØÚ]Y[™[ˆZ[šØ]Yˆ™Y[™]˜
KİJX[›šXÚY\˜
KİJ›ÚYYÚš]™X
K]JUQTÕP‘ÑTĞÒÔÔÑS˜YHœ˜][™HÜš\ÙXX[›šHš[[]\ÈÛÜ\Y\ˆ[ÙYÙ[‹[Èğï™\İHZHYHØÚ0ïÜÙ[HZ[™\ˆ™\ÜÙ\™[ˆZİ[™ÙX™[‹ˆ\ˆš]Z[™[HZİ]™[ˆX[H™ZK˜ÙJ\°ïÚÈ[HÛØÚ[™[™XX[›šH\İ™][È™YÛZ]\ˆZİ]‹˜KX[X
WJJ_Y[˜İ[Ûˆ[

^ÚYŠ‹œ™\Ù\˜][Û”ÛÛ™Y
^ÕJ™\Ù\šY\[™È™\™Z]ÈÙY[™[‹ˆ\ˆ™][]ÙZ[™HØÚ[YÚÙZ]Ù][‹˜
NÜ™]\›ŸZYŠ‹œ]Y\İİYÙOOOX\œš]˜[
\™]\›ˆJ\œİ[ˆÛÙ™™\œ˜][H0í™™›™[‹ˆ\ˆİ™\İZ]YˆZ[™\ˆ™ZZ[™›ÛÙK˜
Nİ]J‘TÑT•’QT•S‘ÔÔ°áÑSYH\İH\ˆ0é›XÚ[ˆ˜[Y[˜İ[™[H]˜XÚ˜XÚ˜[Y[ˆÛÜY\ˆZ[ÙZ\ÙKˆš[™HYH™\Ù\šY\[™È°ïˆYHÜ\H[H]XÚ\œ]‹˜ŞÛ˜[YN˜°éÚÙ[ÈÈ]XÚ\œ]˜]Z[˜H\œÛÛ™[ˆ0­ÈØYÙ[ˆ[H™\œÛÜ™İ[™ÜÜ˜[™ÛÜœ™XİˆLKÛ˜[YN˜°éÚÙ[È]Y\œ]ˆ›Ü™]Z[˜ˆ\œÛÛ™[ˆ0­ÈÛÚØYÙ[ˆZ]Ø][][œØÚ0ïÜÙ[ÛÜœ™XİˆL_KÛ˜[YN˜˜ZÛØœÈÈXÚ]Z[˜˜[Z[YH0­ÈZX™\™ZXÚ0­È]\Ù°ïÚÛXÚÚ™H]\ÚZØÛÜœ™XİˆL_KÛ˜[YN˜°éÙ\œÈÈ™\İÚY\ÙX]Z[˜™\™Z[ˆ0­È]š[Ûˆ0­È[šÛ\™HY[™ØÛÜœ™XİˆL_WKœÛÜ


OO“X]œ˜[™ÛJ
KKJK›X\
OO™JK›˜[YKK™]Z[

OOÙK˜ÛÜœ™XİÊËœÛÛ™T™\Ù\˜][ÛŠ
KK˜Y˜[˜ÙSZ[]\ÊJKİJ›ÚYÚ[
K]JÑQ•S‘S˜°éÚÙ[ÈÈ]XÚ\œ]˜YH™\Ù\šY\[™È^\İY\]ğéÚXÚˆ\È\İ\ˆš\Û[™È[œ™X[\İ\ØÚİH\™›ÛÈ\ÈYÙ\Ëˆ™]Hİ[™[H[™[K˜ÙJ\ˆ™^™\[Û˜\ˆœ\İØ[\ˆØ\]˜JWJJNŠXJKÛ[ÛY[[N‹LKÚ[ÜÎŒ_JKK˜Y˜[˜ÙSZ[]\ÊŠKJ˜[ØÚ\ˆZ[˜YËˆ[[Y\š[ˆÙZpçİH™]Ù\ˆ]\Ù°ïÚÛXÚÙZ[™H]\ÚZÈ0íœ™[ˆpí˜ÚK˜
J_JJJ_Y[˜İ[Ûˆ	

^ÚYŠR‹œ™\Ù\˜][Û”ÛÛ™Y
^ÕJÚ™HÙY[™[™H™\Ù\šY\[™È™\›Yİİ[™[HXÚ™\™Z]È›ÜˆØ[\˜™YÚ[›‹˜
NÜ™]\›ŸZYŠ‹˜]]Üš]P˜]UÛÛŠ^Ö[
İ[™[X
NÜ™]\›Ÿ[]OQÛ

Nİ]JS•“ËRĞST˜İ[™[H	ˆ[X™JÙK›™YYË˜[ÛÚÛLÎØİ[™[HšYXÚ[ˆYÙ[ˆ[HZ\Üİ›ÜœÛÜ™ÛXÚ[ˆXœİ[™Ú\ØÚ[ˆ\ˆ[™™Y\ˆÛ]Xğï™YÙ[ˆ]\ÜØYÙK˜˜İ[™[H0éYH™\Ù\šY\[™ÈÙYÙ[ˆ\ÈXÚˆ[H0éğé™[™\ÜÙ[ˆZ[™H\šØXœÚXÚ°ïˆ[˜™]ÚY\Ù[‹˜‹œİ\ÜXÚ[ÛŒÌØ[H\šÙ[›XÚ]\ÈZ[™[Hœ°ï\™[ˆXÚÙ[œ›İÚÛÛˆ\ÈÙ\Ü°éÚİ\]Z]Z[™[H[›°íYÙ[ˆZİ[›ÜœÜ[™Ë˜˜YH™\Ù\šY\[™Èİ[[]ˆ™]™Z[ˆ\ˆ[›Y[[™Ë\šÛÜ™[™È[™Z[™H›Ûİ0é™YÙHÚ\˜Zİ\›XÚH°ï[™Ë˜KK›Z[]\ÊÒ‹œİ\ÜXÚ[ÛŠKÙJ[ˆœ\İØ[\ˆ™YÚ[›™[˜Ù[YZ[œØ[Y\ˆÙYÛ™\ˆ0­È\İ0é™KX[H[™]XÚÙ[ˆÚ\šÙ[ˆZ]˜

OO™]J[KX]]Üš]X
K[™Ù\˜
KJ›ØÚØÚ™[]Ø\Èš[šÙ[˜Ø[›ˆ]]\š0íš[‹°éš\Ú[ÛˆX™\ˆZ[šY\™[‹˜

OOÜJ
KJ]™HZ[ˆÙ]°éšÈ]\È[H[™[\ˆ[™ÜšXÚÚYH\›™]][‹˜
_JWJKİJİ[™[XÚ[
KİJ[XØ\œX
_Y[˜İ[Ûˆ]JJ^ÜJ
KYK[S›ÊJKK˜˜]KšY[HLKJ
KİJOOOX[KX]]Üš]XØİ[™[X˜›Û›X\™İYX
KOOOX[KX]]Üš]X	‰—İJ[XÚ[
KJ
_Y[˜İ[ÛˆJ
^ÚYŠQ[Q
\™]\›Û]OSYVÑNÖK˜˜]U]K^ÛÛ[X	ÙK›˜[Y_H0­È	ÙK]_XK˜˜]T›İ[™^ÛÛ[X[™H	Ñ[œ›İ[™XÛ]Q[œ^Y\‹™œ\İ˜][Û‹Ñ[œ^Y\‹›X^œ\İ˜][ÛŠŒLQ[™[™[^K™œ\İ˜][Û‹Ñ[™[™[^K›X^œ\İ˜][ÛŠŒLÚYŠK˜˜]T^Y\˜\‹œİ[KÚYX	İIXK˜˜]Q[™[^P˜\‹œİ[KÚYX	ÛŸIXK˜˜]T^Y\•˜[YK^ÛÛ[X	ÓX]œ›İ[™
[œ^Y\‹™œ\İ˜][ÛŠ_HÈ	Ñ[œ^Y\‹›X^œ\İ˜][ÛŸXK˜˜]Q[™[^U˜[YK^ÛÛ[X	ÓX]œ›İ[™
[™[™[^K™œ\İ˜][ÛŠ_HÈ	Ñ[™[™[^K›X^œ\İ˜][ÛŸXK˜˜]T^Y\”İ]\Ù\Ë^ÛÛ[Q[œ^Y\‹œİ]\Ù\Ë›X\
OO˜	ÙKšYH	ÙK\›œßX
Kš›Ú[Š0­È
_ÙZ[™HØ[\\İ0é™XK˜˜]Q[™[^Tİ]\Ù\Ë^ÛÛ[Q[™[™[^Kœİ]\Ù\Ë›X\
OO˜	ÙKšYH	ÙK\›œßX
Kš›Ú[Š0­È
_ÙZ[™HØ[\\İ0é™XK˜˜]SÙËš[›™\’SQ[›ÙËœÛXÙJ
Kœ™]™\œÙJ
K›X\

K
OO˜Û\ÜÏH‰İOOLØ]\İ˜H‰ÓİJJ_OÜ˜
Kš›Ú[Š
K[™š[š\ÚY
^ÖK˜˜]S[İ™\Ëš[›™\’SX]ˆÛ\ÜÏH˜˜]KYš[š\Ú	Ñ[ÛÛØÛÛ˜˜ÜİHİ›Û™Ï‰Ñ[ÛÛØÑUÓÓ“‘S˜˜°çÒÖ•QØOÜİ›Û™Ï‰Ñ[ÛÛØYHÙYÙ[œÙZ]H\İ›Ûİ0é™YÈœ\İšY\˜˜Z[™Hœ\İ˜][Ûˆ][ˆ[0éÜÚYÙ[ˆØ[\[™İÙ\0ï™\œØÚš][‹˜OÜÙ]˜K˜˜]PÛÜÙKšY[HLNÜ™]\›ŸVK˜˜]PÛÜÙKšY[HLÛ]QÛ

NÖK˜˜]S[İ™\Ëš[›™\’SR‹™\]Z\Y]XÚÜË›X\
OOÛ]Z™VÙWNÜ™]\›˜]Ûˆ\OH˜]Ûˆˆ]KX˜]K[[İ™OH‰Ù_Hİ›Û™Ï‰ÓİJ›X™[
_OÜİ›Û™ÏÜ[‰ÓİJ™\ØÜš\[ÛŠ_OÜÜ[ÛX[‰ÓİJ[ÊK[‹‹˜Xİ]™UX[K›[™İ
ÌJJ_OÜÛX[Ø]Û˜JKš›Ú[Š
KK˜˜]S[İ™\Ëœ]Y\TÙ[XİÜ[
Ù]KX˜]K[[İ™WX
K™›Ü‘XXÚ
OO™K˜Y]™[\İ[™\ŠÛXÚØ

OO›JK™]\Ù]˜˜]S[İ™JJJ_Y[˜İ[ÛˆJJ^ÚYŠQ[Q
\™]\›Û]TÊ[KÛ

K‹˜Xİ]™UX[K›[™İ
ÌJNÑ[]œİ]KİJ›ÚYOOOXÛ\ÜÚXËZYÚYš]™XØYÚš]™X˜[š[X][ÛŠKİJOOX[KX]]Üš]XÑ[œ›İ[™	LØİ[™[X˜[X˜›Û›Xš]Ø]˜\™İYX
K˜JKÙ[™\™ŞN‹L‹\œİŒ_KŠK[™š[š\ÚY	‰œJ[ÛÛŠKJ
_Y[˜İ[ÛˆJK
^ÙOOOX[KX]]Üš]XİÊËÚ[]]Üš]P˜]J
KJKİ[™[PÛÛš[˜ÙY
KJK[PÛÛš[˜ÙY
KJK[QX˜]UÛÛ˜
KË˜Y™[][ÛœÚ\
İ[™[XL
KË˜Y™[][ÛœÚ\
[X
KXJKÙYÛš]NK™\]][ÛK[ÛY[[NKİ[™[H[™[Hİ\™[ˆ[Hœ\İØ[\ˆ0ï™\™]Yİ˜
KİJİ[™[XİYÙÙ\˜
KİJ[XÚYØ
KİJ›ÚYÚY\˜
JNXJKÙYÛš]N‹MKÚ[ÜÎŒË[ÛY[[N‹MŸKYH™\Ø[[™ÈÙ]Ú[›YH\œİH[™KˆYHØÚ˜[šÙH›ZXÙ\ØÚÜÜÙ[‹˜
NŠKœ™XÛÜ™Xİ]š]J˜]XØ\™™Xİ˜˜Z[YÌLŒJKËœ™XÛÜ™Z[šQØ[YJ›Û›P˜]XÌLŒKØ›Û›H\İœ\İšY\Ù[YË[H[HX[HÚY\Ú[YÈ™\ÜZİH›Û[‹˜˜›Û›H™\Ú]›ØÚÙ\Ü°éÚÙ[™\™ÚYKˆ\È\İYHZYÙ[XÚHšYY\›YÙK˜
KËœÙ]›YÊ›Û›QY™X]Y
K	‰ŠË˜Y™[][ÛœÚ\
›Û›XN
KİJ›Û›XÛÛ\ÙX
JJ_Y[˜İ[Ûˆ]J
^ÖK˜˜]KšY[HL[]›ÚY]›ÚYJ
KÛ

_Y[˜İ[Ûˆ]JJ^ÚYŠR‹˜]]Üš]P˜]UÛÛ‰‰™HOOXYÙTYX
\™]\›ˆJ\œİ\˜ÚYHØÚ˜[šÙKˆYHZ[š\ÜY[HZŞ™\Y\™[ˆÙZ[™H˜][™ğéİK˜
NÕËœİ\
JKJ
KİJ›ÚYOOOX›[šŞX˜[Ø[˜™OOOX™Y\”Û™ØØ›İØ™OOOXYÙTYXØYX™OOOXX\ÛÛXØ[˜˜Ø\œX
_Y[˜İ[ÛˆİJJ^ÙK›™YYÉ‰˜JKK›™YYËKšYOOX›[šŞX˜[ÌŒ™KšYOOXYÙTYXÍŒMJKKšYOOX›\İ\KšYOOX™Y\”Û™ØKšYOOX›[šŞX˜[ÊKœ™XÛÜ™Xİ]š]JKšYKœİXØÙ\ÜËKœ]X[]KKœØÛÜ™JKËœ™XÛÜ™Z[šQØ[YJKšYKœİXØÙ\ÜËKœØÛÜ™KK^
JN™KšYOOXYÙTYXÊËœ™XÛÜ™YÙJKœİXØÙ\ÜËKœİ\ÜXÚ[ÛÏÌKœ™[YYÏÌK^
KKœİXØÙ\ÜÉ‰JKYÙT™[Y]™Y
JNŠËœ™XÛÜ™Z[šQØ[YJKšYKœİXØÙ\ÜËKœØÛÜ™KK^
KKœİXØÙ\ÜÉ‰ŠËœÙ]›YÊX\ÛÛUÛÛ˜
KË˜Y™[][ÛœÚ\
X\ÛL
KXJKÜ™\]][ÛK[ÛY[[NßJJJKİJ›ÚYKœİXØÙ\ÜÏØÚY\˜™KšYOOXYÙTYXØİYÙÙ\˜˜ÛÛ\ÙX
KÛ

_Y[˜İ[ÛˆİJ
^ÚYŠ‹œ]Y\İİYÙHOOXš\œİX™Y\˜	‰ˆR‹™š\œİ™Y\“Ü[™Y
\™]\›ˆJ\œİ›Ûİ0é™YÈ]\ÛY[‹ˆ\ÈšY\ˆ0ï™\ØXÚYH™ZZ[™›ÛÙK˜
NÚYŠ‹™š\œİ™Y\“Ü[™Y
\™]\›ˆJ\È\œİHšY\ˆ\İ™\™Z]ÈÙ\ØÚXÚKˆÙZ]\™HšY\™HÚ[™\ˆ›ØÚİ]\İZË˜
NÛ]OJÛš[™[ÜK˜šY\ÏÌ
OŒÙO×ØJKšY\˜
NXJKØÚ[ÜÎŒËYÛš]N‹LŸJK˜JKØ[ÛÚÛ™OÌMK›Y\ŒL‹Ûİ\˜YÙNŸK
KË›Ü[‘š\œİ™Y\Š
KJKš\œİ™Y\“Ü[™Y
KİJ›ÚYš[šØ
KİJ\œØÚY\˜
K]JS’ÕS‘•ÔUQTÕP‘ÑTĞÒÔÔÑS˜\È\œİHšY\˜OØ\ˆÜ›ÛšÛÜšÙ[ˆ°éˆ\ˆ™[Ü™Z\ÈÚ[Xˆ™][ÈÙ\Ù[ØÚYXÚ[ˆ™]šYX‹˜˜\ÈØ\ˆÙZ[ˆZYÙ[™\ÈšY\ˆYZˆKˆ\œÈİ[ÛÛ[Y[\›ÜÈZ[™\È[‹ˆZ[™H™\œÛÜ™İ[™ÜÛ0ïÚÙHÚ\™Ü0é\ˆÙYÙ[ˆXÚ™\Ù[™]˜ÙJYHÜ\HİXÚ[˜š[™H[Hœ™][™H[™İ[HZ[ˆ™ZY\X[H\Ø[[Y[‹˜KX[X
WJ_Y[˜İ[ÛˆİJ
^Û]OQÛ

KQ›X\
OÛ]HHYK™›YÜÖØY]IİXKR‹˜Xİ]™UX[Kš[˜ÛY\Ê
NÜ™]\›ˆJ	ÜØ8§$È˜IÕ–İOË›˜[YOÏİXÜØ[HZİ]™[ˆX[H0­È[™\›™[˜˜[ˆ\ÈZİ]™H™ZY\X[H]Y›™ZY[˜˜›ØÚšXÚÙY[™[˜

OOÚYŠ[Š\™]\›Û]O\Ò‹˜Xİ]™UX[K™š[\ŠOO™HOO]
N–Ë‹‹’‹˜Xİ]™UX[KKœÛXÙJLÊNÕËœÙ]Xİ]™UX[JJKİJ
_KX[X[Š_JKR‹›X\›™Y]XÚÜË›X\
OO™J	Ò‹™\]Z\Y]XÚÜËš[˜ÛY\ÊJOØ8§$È˜IÚ™VÙWK›X™[X™VÙWK™\ØÜš\[Û‹

OOÕËÙÙÛP]XÚÊJKİJ
_JJNİ]JQÑT‘‘UQT‹SQS°çX[H[™]XÚÙ[˜X^[X[™ZHZİ]™H™YÛZ]\ˆ[™šY\ˆ]\ÙÙ\°ïİ]H]XÚÙ[‹ˆ™^šYZ[™Ù[‹Ù\Ü°éÚKğé\™H[™Z[š\ÜY[H\ÙZ]\›ˆ™ZYH\İ[‹˜Ë‹‹‹‹›—J_Y[˜İ[ÛˆJ
^Û]OUË›Øš™Xİ]™J
KSØš™Xİ™[šY\Ê‹›Z[šT™\İ[ÊK›X\

ÙKJOO˜	Ù_Nˆ	İÚ[œßKÉİ˜][\ßHÚYYÙH0­È™\İÙ\	İ˜™\İX
Kš›Ú[Šœ˜
_›ØÚÙZ[™HZ[š\ÜY[İ]\İZË˜İ]JĞÒĞT–‘TÈ”‘UK]K	ÙK^Oİ›Û™Ï•ÛØÚ[™[™SY]OÜİ›Û™Ïœ‰İOœœ’XÚÙ[™\™XÚˆ	Ò‹œİ\ÜXÚ[ÛŸH0­È\›ZXÚ\[™Ù[ˆ	Ò‹œ™[YYÛİ[H0­ÈÛØÚ[™[™Ù\ˆ	Ò‹ÙYZÙ[™ØÛÜ™_XÙJšY[]YˆØ\HX\šÚY\™[˜Ø[Y\˜H™ZYİİ\ˆ[ˆ™[]˜[[ˆÜ˜

OOİÚ[™İË™\Ü]Ú]™[
™]Èİ\İÛQ]™[
ËXØ[\ZYÛ‹Y›Øİ\ØÙ]Z[™K\™Ù]YJJKJ
_JKJØÚYpçÙ[˜\°ïÚÈ]Yˆ[ˆ]˜JWJ_Y[˜İ[Ûˆ]JK‹Š^ÖK›[Ù[ÚXÚÙ\‹^ÛÛ[YKK›[Ù[]K^ÛÛ[]K›[Ù[ÛÜKš[›™\’S[‹K›[Ù[Ü[ÛœËš[›™\’S\‹š›Ú[Š
KK›[Ù[šY[HLKK›[Ù[Ü[ÛœËœ]Y\TÙ[XİÜ[
Ù]K[[Ù[XXİ[Û—X
K™›Ü‘XXÚ
OO™K˜Y]™[\İ[™\ŠÛXÚØ

OOÛ]S[X™\ŠK™]\Ù]›[Ù[Xİ[ÛŠNÙVİOËŠ
_JJKJ
_]˜\ˆOV×NÙ[˜İ[ÛˆJK‹X›Ü›X[OHLJ^Ü™]\›˜]Ûˆ\OH˜]Ûˆˆ]K[[Ù[XXİ[ÛH‰ÙKœ\Ú
ŠKL_HˆÛ\ÜÏHÛ™KIÜŸHˆ	ÚOØ\ØX›Y˜Oİ›Û™Ï‰ÓİJJ_OÜİ›Û™ÏÛX[‰ÓİJ
_OÜÛX[Ø]Û˜Y[˜İ[ÛˆJ
^ÖK›[Ù[šY[HLOV×KJ
_Y[˜İ[Ûˆ]J
^Ü™]\›ˆVK›[Ù[šY[ŸVK˜˜]KšY[ŸVK›Z[šKšY[ŸY[˜İ[ÛˆJ
^ÙØİ[Y[˜›ÙK˜Û\ÜÓ\İÙÙÛJØ[\ZYÛ‹[[Ù[[Ü[˜]J
JKKœ›Û\šY[[]J
_ZÛY[˜İ[ÛˆİJJ^ÚYŠ\K\ÙR][JJJ\™]\›ˆJšXÚ™\™°ïØ˜\ˆÙ\ˆ\ˆ[È]Y\İÙYÙ[œİ[™™\Ù[™˜\‹˜
N×İJ›ÚYØšY\˜˜]YXØ\ÜÙ\˜ØY™™YXKš[˜ÛY\ÊJOØš[šØ˜Ø\œX
KJ	ÚÙWOË›X™[ÏÙ_H™[]ˆ\ˆğíœœ\ˆ°ïYHXÚ[[™Ë˜
_Y[˜İ[ÛˆİJK
^İÚ[™İË™\Ü]Ú]™[
™]Èİ\İÛQ]™[
ËXØ[\ZYÛ‹X[š[X][Û˜Ù]Z[ÚY™K[š[X][Û_JJ_Y[˜İ[ÛˆJ
^Û]OVK›Z[š[X\YK™Ù]ÛÛ^
™
NÚYŠ]
\™]\›ÙKÚYLÌÌKšZYÚLŒÌÛ]YKÚYÌŒYKšZYÚÌNİ™š[İ[OXÌMÌØŒÌX™š[™Xİ
KÚYKšZYÚ
NÙ›ÜŠ]ÙKKKË×[Ù–ÖØÍÌNXØNMLLÌKØÍÌØMÌLLÌMLLKØØØØMÙ˜NMLÌLLKØÌYMÎŒLÍLLLKØÍLÍX˜NMLLLÌÌKØÌ˜™NØŒŒŒLLÎÌWJ]™š[İ[OYK™š[™Xİ
J›‹Jœ‹Ê›‹ÊœŠNİœİ›ÚÙTİ[OX™Ø˜JMKMKMKŒN
X›[™UÚYLNÙ›ÜŠ]LÛKÚYÛŠÏMJ]˜™YÚ[”]

K›[İ™UÊ‹
K›[™UÊ‹KšZYÚ
Kœİ›ÚÙJ
NÛ]O^]JË›Øš™Xİ]™J
K\™Ù]Y
NÚI‰Š™š[İ[OXÙŒÍÍX˜˜™YÚ[”]

K˜\˜ÊK
›‹KJœ‹‹X]”JŒŠK™š[

JK™š[İ[OXÙ™™˜˜™YÚ[”]

K˜\˜ÊÛ
›‹ÛJœ‹KX]”JŒŠK™š[

Kœİ›ÚÙTİ[OXÌLŒY˜›[™UÚYL‹œİ›ÚÙJ
_Y[˜İ[Ûˆ]JJ^Ü™]\›ˆ–ÙW_İ[šÎŞLNŒMŒK™\Ù\˜][Û›Ø\™ŞŒLNŒLÍŒKİ[™[NŞŒLNNŒLÍŒK]XÚ\œ]ŞŒLNŒLMÌKİÙ\›ŞŞŒLLNŒLKš[šÜÎŞŒLLÌNŒLŒLK[ÎŞŒLLLNŒLŒKØX›NŞŒLŒLNŒLLKš\œİ™Y\ŞŒLLNŒLMÌKØ[\š\™NŞÌNŒLLL_VÙW_Y[˜İ[ÛˆJ
^ÖKš[›Ğ˜XÚË˜Y]™[\İ[™\ŠÛXÚØ

OOÚ›SX]›X^
›LJK›

K[

K

_JKKš[›Ó™^˜Y]™[\İ[™\ŠÛXÚØ

OOÚ›WÙK›[™İLOŞ›

NŠ›
ÏLK›

K[

K

J_JKKš[›ÔÚÚ\˜Y]™[\İ[™\ŠÛXÚØ›
KØİ[Y[œ]Y\TÙ[XİÜ[
ØØ[\ZYÛ‹XÜ™X]Üˆ[œ]ØØ[\ZYÛ‹XÜ™X]ÜˆÙ[Xİ
K™›Ü‘XXÚ
OO™K˜Y]™[\İ[™\Š[œ]›
JK
Ü™X]Ü‹Yš[š\Ú
K˜Y]™[\İ[™\ŠÛXÚØ›
K
ÚÜ\™XÛÛ[Y[™Y
K˜Y]™[\İ[™\ŠÛXÚØ

OOÓ[^İØ\ÜÙ\Œ‹İY\œİNŒKšY\ŒKÛÜ\Y\ŒKÚ\ÎŒ_K

_JK
ÚÜYš[š\Ú
K˜Y]™[\İ[™\ŠÛXÚØ[
KK›[Ù[ÛÜÙK˜Y]™[\İ[™\ŠÛXÚØJKK˜˜]PÛÜÙK˜Y]™[\İ[™\ŠÛXÚØ]JKK›Z[šKœ]Y\TÙ[XİÜŠÙ]K[Z[šKXÛÜÙWX
OË˜Y]™[\İ[™\ŠÛXÚØ

OOİÚ[™İËœÙ][Y[İ]
JKÛ

_JK
™\Ù]\Ø]™X
K˜Y]™[\İ[™\ŠÛXÚØ

OOÜKœ™\Ù]

KËœ™\Ù]

KØØ[İÜ˜YÙKœ™[[İ™R][JÛ
KØØ][Û‹œ™[ØY

_JK
™\^KZ[›Ø
K˜Y]™[\İ[™\ŠÛXÚØ

OOÕËœ™\^R[›Ê
K›LJK
]ZXÚË\™\İ
K˜Y]™[\İ[™\ŠÛXÚØ

OOÜKœ™\İ
Œ
KİJ›ÚYÚ]
_JK
]ZXÚË]Ú[]
K˜Y]™[\İ[™\ŠÛXÚØ

OOÜKœ™[Y]™J
KİJ›ÚYÚY\˜
_JK
[Øš[KXXİ[Û˜
K˜Y]™[\İ[™\ŠÛXÚØ

OOÚ[™İË™\Ü]Ú]™[
™]È]™[
ËXØ[\ZYÛ‹XXİ[Û˜
JJKØİ[Y[œ]Y\TÙ[XİÜ[
Ù]KY\™Xİ[Û—X
K™›Ü‘XXÚ
OOÛ]]OİÚ[™İË™\Ü]Ú]™[
™]Èİ\İÛQ]™[
ËXØ[\ZYÛ‹Y\™Xİ[Û˜Ù]Z[Ù\™Xİ[Û™K™]\Ù]™\™Xİ[Û‹Xİ]™N_JJ_NÙK˜Y]™[\İ[™\ŠÚ[\™İÛ˜OÛ‹œ™]™[Y˜][

KKœÙ]Ú[\Ø\\™J‹œÚ[\’Y
K
L
_JKK˜Y]™[\İ[™\ŠÚ[\\

OO
LJJKK˜Y]™[\İ[™\ŠÚ[\˜Ø[˜Ù[

OO
LJJKK˜Y]™[\İ[™\ŠÚ[\›X]™X

OO
LJJ_J_Y[˜İ[ÛˆJ
^Ü™]\›ˆØš™Xİ™[šY\Ê[
Kœ™YXÙJ
Kİ—JOO™JÊİOËœšXÙOÏÌ
J›‹
_Y[˜İ[ÛˆİJKŠ^Û]SX]›X^
X]›Z[ŠL
JNÜ™]\›˜]ˆÛ\ÜÏH›Y]\‹\›İÈ	ÊÜMÌœLÌ
OØ[™Ù\˜˜HÜ[‰ÓİJJ_OÜÜ[]Hİ[OHÚY‰ÜŸIHÚOÙ]İ›Û™Ï‰ÓX]œ›İ[™

_OÜİ›Û™ÏÙ]˜Y[˜İ[ÛˆİJJ^Ü™]\›˜	ÙOLØ
Ø˜IÓX]œ›İ[™
J_XY[˜İ[ÛˆİJJ^Ü™]\›Ø\œš]˜[˜[šİ[™[™™^™\[Û˜›Ü˜YšXKRÛ]\ÙH[™›Ü™0é™XÙ[˜[˜]XÚ\œ]ˆ[™Ø[š]0é˜™\İ]˜[˜™\İÚY\ÙXÛÛÙ[™˜Ù\šXÙZÙˆ[™Ø[Ø][X™XXÚ˜İ˜[™[™]\İYØÛİ™N˜ZYÙHXÚØ[\Ü›İ[™˜Ø[\[™Ü]˜VÙWOÏÙ_Y[˜İ[ÛˆJJ^ÖKØ\İ^ÛÛ[YKKØ\İ˜Û\ÜÓ\İ˜Y
š\ÚX›X
KÚ[™İËœÙ][Y[İ]


OO–KØ\İ˜Û\ÜÓ\İœ™[[İ™Jš\ÚX›X
KÌL
_Y[˜İ[Ûˆ]JJ^Ü™]\›ˆØİ[Y[™Ù][[Y[RY
JOË˜[YOÏØY[˜İ[ÛˆJK
^Ü™]\›ˆ]JJ_Y[˜İ[Ûˆ
J^Û]YØİ[Y[™Ù][[Y[RY
JNÚYŠ]
]›İÈ\œ›ÜŠZ\ÜÚ[™ÈØ[\ZYÛˆ[[Y[ˆ	Ù_X
NÜ™]\›ˆY[˜İ[ÛˆİJJ^Ü™]\›ˆKœ™\XÙJÖÉ‰È—KÙËOOŠÈ‰ˆ˜	˜[\Ø˜	›Øˆ˜	™İØ‰È˜	ˆÌÎNØ	È‰Î˜	œ][İØJVÙWOÏÙJ_Y[˜İ[ÛˆİJ
^Ü™]\›˜ÙXİ[ÛˆYH˜Ø[\ZYÛ‹Z[›ÈˆÛ\ÜÏHš[›Ë\YÙH‚ˆ]ÛˆYHš[›Ë\ÚÚ\ˆÛ\ÜÏHš[›Ë\ÚÚ\ˆ\OH˜]Ûˆ’[›È0ï™\œÜš[™Ù[Ø]Û‚ˆ]ˆYHš[›Ë]š\İX[ˆÛ\ÜÏHš[›Ë]š\İX[ˆ]K]š\İX[Hœ›ØY]ˆÛ\ÜÏHœØÙ[™K\ÚŞHÙ]]ˆÛ\ÜÏHœØÙ[™K[ZÙHÙ]]ˆÛ\ÜÏHœØÙ[™K\›ØYÙ]]ˆÛ\ÜÏHœØÙ[™KXØ\ˆ•OÙ]]ˆÛ\ÜÏHœØÙ[™KYØ]HÙ]]ˆÛ\ÜÏHœØÙ[™KXÛ\›Ø\™°©ÏÙ]]ˆÛ\ÜÏHœØÙ[™K][ÈÙ]Ù]‚ˆ\XÛHÛ\ÜÏHš[›ËXÛÜHÜ[ˆYHš[›ËZÚXÚÙ\ˆÜÜ[HYHš[›Ë]]HÚO]ˆYHš[›Ë[[™\ÈÙ]]ˆYHš[›Ë\›ÙÜ™\ÜÈˆÛ\ÜÏHš[›Ë\›ÙÜ™\ÜÈÙ]›Ûİ\]ÛˆYHš[›ËX˜XÚÈˆ\OH˜]Ûˆ–\°ïÚÏØ]Û]ÛˆYHš[›Ë[™^ˆ\OH˜]Ûˆ•ÙZ]\Ø]ÛÙ›Ûİ\Ø\XÛO‚ˆÜÙXİ[Û‚ˆÙXİ[ÛˆYH˜Ø[\ZYÛ‹XÜ™X]ÜˆˆÛ\ÜÏH˜Ü™X]Ü‹\YÙHˆY[\XÛHÛ\ÜÏH˜Ü™X]Ü‹XØ\™]ˆÛ\ÜÏH˜Ü™X]Ü‹XÛÜHÜ[“ÈÒTRÕT‘T”ÕSS‘ÏÜÜ[O•Ù\ˆ°éİYH™\˜[ÛÜ[™ÏÏÚO“šY[X[™ˆX™\ˆZ[™HšYİ\ˆœ˜]XÚ\ÈÜY[›İ™[KÜ]ˆYH˜Ü™X]Ü‹\™]šY]ÈˆÛ\ÜÏH˜Ü™X]Ü‹\™]šY]ÈÙ]Ù]]ˆÛ\ÜÏH˜Ü™X]Ü‹Y›Ü›H‚ˆX™[“˜[YO[œ]YHœ^Y\‹[˜[YHˆ˜[YOH[™°êHˆX^[™İHŒNÛX™[X™[’ğíœœ\Ù[XİYH˜›ÙK]\HÜ[Ûˆ˜[YOH››Ü›X[“›Ü›X[ÛÜ[ÛÜ[Ûˆ˜[YOHœØÚX[”ØÚX[ÛÜ[ÛÜ[Ûˆ˜[YOH˜œ™Z]œ™Z]ÛÜ[ÛÜÙ[XİÛX™[X™[‘œš\İ\Ù[XİYHšZ\‹\İ[HÜ[Ûˆ˜[YOHšİ\ˆ’İ\ÛÜ[ÛÜ[Ûˆ˜[YOHÙ[H•Ù[OÛÜ[ÛÜ[Ûˆ˜[YOH˜^ˆ^ˆİ]ÛÜ[ÛÜ[Ûˆ˜[YOH˜Ø\Ø\ÛÜ[ÛÜÙ[XİÛX™[X™[XØÙ\ÜÛÚ\™OÙ[XİYH˜XØÙ\ÜÛÜHÜ[Ûˆ˜[YOHšÙZ[œÈ’ÙZ[œÏÛÜ[ÛÜ[Ûˆ˜[YOH˜œš[Hœš[OÛÜ[ÛÜ[Ûˆ˜[YOH˜˜\˜\ÛÜ[ÛÜ[Ûˆ˜[YOH›Úœš[™È“Úœš[™ÏÛÜ[ÛÜÙ[XİÛX™[X™[‘ZYÙ[œØÚYÙ[XİYH˜Z]Ü[Ûˆ˜[YOH˜Ú\›X[Ú\›X[ÛÜ[ÛÜ[Ûˆ˜[YOH™\™Zİ‘\™ZİÛÜ[ÛÜ[Ûˆ˜[YOH˜Ú[İ\ØÚÚ[İ\ØÚÛÜ[ÛÜ[Ûˆ˜[YOHš[œØ™\™Z]’[œØ™\™Z]ÛÜ[ÛÜ[Ûˆ˜[YOH˜™[Ø˜XÚ[™™[Ø˜XÚ[™ÛÜ[ÛÜÙ[XİÛX™[]ˆÛ\ÜÏH˜ÛÛÜ‹Z[œ]ÈX™[’]][œ]YHœÚÚ[‹]Û™Hˆ\OH˜ÛÛÜˆˆ˜[YOHˆÙXMÙHÛX™[X™[’X\™O[œ]YHšZ\‹XÛÛÜˆˆ\OH˜ÛÛÜˆˆ˜[YOHˆÍLÌŒÛX™[X™[”Ú\[œ]YHœÚ\XÛÛÜˆˆ\OH˜ÛÛÜˆˆ˜[YOHˆÙMXYÈÛX™[X™[”ÚÜÏ[œ]YHœÚÜËXÛÛÜˆˆ\OH˜ÛÛÜˆˆ˜[YOHˆÌMMMÛX™[Ù]]ÛˆYH˜Ü™X]Ü‹Yš[š\ÚˆÛ\ÜÏHœš[X\Hˆ\OH˜]Ûˆ–[Hİ\\›X\šİØ]Û‚ˆÙ]Ø\XÛOÜÙXİ[Û‚ˆÙXİ[ÛˆYH˜Ø[\ZYÛ‹\ÚÜˆÛ\ÜÏHœÚÜ\YÙHˆY[\XÛHÛ\ÜÏHœÚÜ\Ú[XY\]Ü[‘”‘RUQÈ0­È“ÔˆTˆP‘R•ÜÜ[OŒH]\›ËˆÙZ[ˆÜ0é\™\ˆ]]ÜØ]™H°ïˆ™\›[™ÚOYH˜Ø\ÚY\‹[[™HÜÙ]]ˆÛ\ÜÏHœÚÜXYÙ]ÛX[•™\˜›ZX™[™ÜÛX[İ›Û™ÈYHœÚÜXYÙ]ŒH8 «Üİ›Û™ÏÙ]ÚXY\]ˆYHœÚÜZ][\ÈˆÛ\ÜÏHœÚÜZ][\ÈÙ]›Ûİ\]ÛˆYHœÚÜ\™XÛÛ[Y[™Yˆ\OH˜]Ûˆ”ZÙ]8 '°ï™\›X™[œÙ°éYø 'Ø]ÛÜ[ˆYHœÚÜY\œ›ÜˆÜÜ[]ÛˆYHœÚÜYš[š\ÚˆÛ\ÜÏHœš[X\Hˆ\OH˜]Ûˆ‘Z[šØ]Y™[ˆ[™ÜÙ˜Z™[Ø]ÛÙ›Ûİ\Ø\XÛOÜÙXİ[Û‚ˆXZ[ˆYH˜Ø[\ZYÛ‹YØ[YHˆÛ\ÜÏH™Ø[YK\Ú[ˆY[‚ˆXY\ˆÛ\ÜÏHÜ˜\ˆ]ˆÛ\ÜÏH˜œ˜[™Ü[“ÈĞSTRQÓˆ0­ÈÔ’S•Èx $ÍÜÜ[İ›Û™Ï•[\ÈÙˆH›]YHYšXOÜİ›Û™ÏÙ]]ˆÛ\ÜÏHÜ\İ]ÈÜ[ˆYH[YK[X™[ÜÜ[ˆYHœ™YÚ[Û‹[X™[Øİ›Û™ÈYH›[Û™^K[X™[Üİ›Û™Ï[O•Ù\HYHÙYZÙ[™\ØÛÜ™HŒÚOÙ[OÙ]˜]H™YH‹‹‹Û™^È[\ˆ™^PZ[ØOH™YH‹‹‹ÛË]\İÈ‘šYİ\™[\İØO]ÛˆYHœ™\^KZ[›Èˆ\OH˜]Ûˆ’[›ÏØ]Û]ÛˆYHœ™\Ù]\Ø]™Hˆ\OH˜]Ûˆ“™]\İ\Ø]ÛÛ˜]ÚXY\‚ˆÙXİ[ÛˆÛ\ÜÏH›Øš™Xİ]™H]Ü[RÕU‘HĞSTQÓ‘S”UQTÕÜÜ[İ›Û™ÈYH›Øš™Xİ]™K]]HÜİ›Û™ÏYH›Øš™Xİ]™K]^ÜÙ]ˆYH›Øš™Xİ]™KY\İ[˜ÙHØÜÙXİ[Û‚ˆÙXİ[ÛˆÛ\ÜÏH™Ø[YK[^[İ]\ÚYHÛ\ÜÏHœ[™[Y\[™[ÙXİ[Û–\İ0é™OÚ]ˆYHœİ]\Ë[\İˆÛ\ÜÏHœİ]\Ë[\İÙ]ÜÙXİ[ÛÙXİ[Û™Y0ï™›š\ÜÙOÚ]ˆYH›™YYË[\İˆÛ\ÜÏH›Y]\‹[\İÙ]ÜÙXİ[ÛÙXİ[Û•ÛØÚ[™[™Ù\OÚ]ˆYH›Y]šXÜË[\İˆÛ\ÜÏH›Y]\‹[\İÙ]ÜÙXİ[ÛÙXİ[Û’[™[\Ú]ˆYHš[™[ÜK[\İˆÛ\ÜÏHš[™[ÜK[\İÙ]ÜÙXİ[Û]ˆÛ\ÜÏHœ]ZXÚËXXİ[ÛœÈ]ÛˆYHœ]ZXÚË\™\İˆ\OH˜]ÛˆŒZ[‹ˆZ[Ø]Û]ÛˆYHœ]ZXÚË]Ú[]ˆ\OH˜]Ûˆ•Ú[]OØ]ÛÙ]Ø\ÚYO‚ˆÙXİ[ÛˆÛ\ÜÏHÛÜ›XÛÛ[[ˆ]ˆÛ\ÜÏHÛÜ›Yœ˜[YH]ˆYH˜Ø[\ZYÛ‹]ÛÜ›Ù]]ˆYHš[\˜Xİ[Û‹\›Û\ˆÛ\ÜÏHš[\˜Xİ[Û‹\›Û\ˆY[Ø™‘OÚØ™Ü[ˆYHš[\˜Xİ[Û‹]^ÜÜ[Ù]]ˆÛ\ÜÏH›[Øš[KXÛÛ›ÛÈ]ˆÛ\ÜÏH™Y]Ûˆ]KY\™Xİ[ÛH\ˆ\OH˜]Ûˆ¸¥¬Ø]Û]Ûˆ]KY\™Xİ[ÛH›Yˆ\OH˜]Ûˆ¸¥àØ]Û]Ûˆ]KY\™Xİ[ÛH™İÛˆˆ\OH˜]Ûˆ¸¥¯Ø]Û]Ûˆ]KY\™Xİ[ÛHœšYÚˆ\OH˜]Ûˆ¸¥­Ø]ÛÙ]]ÛˆYH›[Øš[KXXİ[Ûˆˆ\OH˜]ÛˆRÕSÓØ]ÛÙ]Ù]ÙXİ[ÛˆÛ\ÜÏH›X\\İš\Ø[˜\ÈYH›Z[š[X\ØØ[˜\Ï]Ü[’ĞS“Ó’TĞÒTˆU”SÜÜ[İ›Û™Ï”ÚYX™[ˆ™YÚ[Û™[ˆ0­ÈXÚHÙYÙH0­È™\İH]Y\İÜOÜİ›Û™Ï‘Ù[ˆZİY[\ÈšY[0­ÈÙZpçÎˆZ[™HÜÚ][ÛÜÙ]ÜÙXİ[ÛÜÙXİ[Û‚ˆ\ÚYHÛ\ÜÏHœ[™[šYÚ\[™[ÙXİ[Û™^šYZ[™Ù[Ú]ˆYHœ™[][ÛœÚ\[\İˆÛ\ÜÏHœ™[][ÛœÚ\[\İÙ]ÜÙXİ[ÛÙXİ[Û‘›\ÏÚ]ˆYHœ›ÛX[˜ÙK[\İˆÛ\ÜÏHœ›ÛX[˜ÙK[\İÙ]ÜÙXİ[ÛÙXİ[ÛZİ]™\ÈX[OÚ]ˆYHX[K[\İˆÛ\ÜÏHX[K[\İÙ]ÜÙXİ[ÛÙXİ[Û]XÚÙ[Ú]ˆYH˜]XÚË[\İˆÛ\ÜÏH˜]XÚË[\İÙ]ÜÙXİ[ÛÙXİ[ÛÚ›ÛšZÏÚ]ˆYH˜Ú›ÛšXÛK[\İˆÛ\ÜÏH˜Ú›ÛšXÛK[\İÙ]ÜÙXİ[ÛØ\ÚYO‚ˆÜÙXİ[Û‚ˆÛXZ[‚ˆÙXİ[ÛˆYH™Ù[™\šXË[[Ù[ˆÛ\ÜÏH›[Ù[ˆY[\XÛO]ÛˆYH›[Ù[XÛÜÙHˆÛ\ÜÏH›[Ù[^ˆ\OH˜]Ûˆ°åÏØ]ÛÜ[ˆYH›[Ù[ZÚXÚÙ\ˆÜÜ[ˆYH›[Ù[]]HÚ]ˆYH›[Ù[XÛÜHˆÛ\ÜÏH›[Ù[XÛÜHÙ]]ˆYH›[Ù[[Ü[ÛœÈˆÛ\ÜÏH›[Ù[[Ü[ÛœÈÙ]Ø\XÛOÜÙXİ[Û‚ˆÙXİ[ÛˆYH˜˜]K[[Ù[ˆÛ\ÜÏH›[Ù[˜]K[[Ù[ˆY[\XÛOXY\]Ü[”•S‘STÒQT•Tˆ”•TÕĞSTÜÜ[ˆYH˜˜]K]]HÚÙ]ˆYH˜˜]K\›İ[™ØÚXY\]ˆÛ\ÜÏH˜˜]KX\™[˜H]ˆÛ\ÜÏH™šYÚ\ˆ^Y\ˆİ›Û™Ï‘HS‘RSˆPSOÜİ›Û™Ï]ˆÛ\ÜÏH™œ\İ˜][ÛˆHYH˜˜]K\^Y\‹X˜\ˆÚOÙ]ˆYH˜˜]K\^Y\‹]˜[YHØÛX[YH˜˜]K\^Y\‹\İ]\Ù\ÈÜÛX[Ù]]ˆÛ\ÜÏH™\œİ\È‘”•TÕÙ]]ˆÛ\ÜÏH™šYÚ\ˆ[™[^Hİ›Û™Ï‘ÑQÑS”ÑRUOÜİ›Û™Ï]ˆÛ\ÜÏH™œ\İ˜][ÛˆHYH˜˜]KY[™[^KX˜\ˆÚOÙ]ˆYH˜˜]KY[™[^K]˜[YHØÛX[YH˜˜]KY[™[^K\İ]\Ù\ÈÜÛX[Ù]Ù]]ˆYH˜˜]K[[İ™\ÈˆÛ\ÜÏH˜˜]K[[İ™\ÈÙ]]ˆYH˜˜]K[ÙÈˆÛ\ÜÏH˜˜]K[ÙÈÙ]]ÛˆYH˜˜]KXÛÜÙHˆÛ\ÜÏHœš[X\Hˆ\OH˜]ÛˆˆY[–\°ïÚÈ[ˆYHÙ[Ø]ÛØ\XÛOÜÙXİ[Û‚ˆÙXİ[ÛˆYH›Z[šYØ[YK[[Ù[ˆÛ\ÜÏH›[Ù[Z[šYØ[YK[[Ù[ˆY[\XÛOXY\]Ü[•“ÓÕ0á‘QÑTÈRS’TÔQSÜÜ[ˆ]K[Z[šK]]OÚ]K[Z[šKXÛÜOÜÙ]]Ûˆ]K[Z[šKXÛÜÙHÛ\ÜÏH›[Ù[^ˆ\OH˜]Ûˆ°åÏØ]ÛÚXY\Ø[˜\ÏØØ[˜\Ï]K[Z[šKZ[Û\ÜÏH›Z[šKZ[Ü]Ûˆ]K[Z[šKXXİ[ÛˆÛ\ÜÏHœš[X\Hˆ\OH˜]ÛˆRÕSÓØ]Û]ˆ]K[Z[šK\™\İ[Û\ÜÏH›Z[šK\™\İ[ˆY[Ù]Ø\XÛOÜÙXİ[Û‚ˆ]ˆYHØ\İˆÛ\ÜÏHØ\İˆ›ÛOHœİ]\ÈÙ]˜]˜\ˆ]OX[\ËX›]YKXYšXKZ[›ËY\˜][Û‹]˜OL]O]Ú[™İËœÙ][\˜[


OOÚJÏLNÛ]OYØİ[Y[œ]Y\TÙ[XİÜŠ›Ü[š[™Ë]K\ÜXÙX
NÚYŠJH[œİ[˜Ù[ÙˆS[[Y[
J^ÚOŒ	‰Ú[™İË˜ÛX\’[\˜[
]JNÜ™]\›Ÿ[]YKœ]Y\TÙ[XİÜŠ›Ü[š[™Ë]KZ[›ËXÛÛ›ÛØ
NÚYŠ]
\™]\›ÚYŠYKœ]Y\TÙ[XİÜŠÙ]KZ[›ËY\˜][Û—X
J^Û]YØİ[Y[˜Ü™X]Q[[Y[
]˜
NÛ‹˜Û\ÜÓ˜[YOX›ÙÜ™\ÜÚ[Û‹]‹Z[›Ë\ÜYY‹š[›™\’SXÜ[“TÑQÑTĞÒÒS‘QÒÑRUÜÜ[]Ûˆ]KZ[›ËY\˜][ÛHÎ”ÙZˆZYÏØ]Û]Ûˆ]KZ[›ËY\˜][ÛH”ZYÏØ]Û]Ûˆ]KZ[›ËY\˜][ÛH”ØÚ™[Ø]Û˜œ™\[™
ŠK‹œ]Y\TÙ[XİÜ[
Ù]KZ[›ËY\˜][Û—X
K™›Ü‘XXÚ
O˜Y]™[\İ[™\ŠÛXÚØ

OO“JK[X™\Š™]\Ù]š[›Ñ\˜][ÛŠKL
JJ_[]S[X™\ŠØØ[İÜ˜YÙK™Ù]][J]JJNÓJKÍLËLËÎL×Kš[˜ÛY\ÊŠOÛLËLJKÚ[™İË˜ÛX\’[\˜[
]J_KJNÙ[˜İ[ÛˆJKŠ^ÙKœİ[KœÙ]›Ü\JKXÜ˜]ÛY\˜][Û˜	İ[\Ø
KK™]\Ù]š[›Ñ\˜][ÛTİš[™Ê
KØØ[İÜ˜YÙKœÙ]][J]Kİš[™Ê
JKKœ]Y\TÙ[XİÜ[
Ù]KZ[›ËY\˜][Û—X
K™›Ü‘XXÚ
OO™K˜Û\ÜÓ\İÙÙÛJÙ[XİY[X™\ŠK™]\Ù]š[›Ñ\˜][ÛŠOOO]
JK‰‰™Kœ]Y\TÙ[XİÜ[
›Ü[š[™Ë]K\™[YK›Ü[š[™Ë]K[ÙÛË›Ü[š[™Ë]KXÜ˜]Û
K™›Ü‘XXÚ
OOÙKœİ[K˜[š[X][ÛX›Û™XK›Ù™œÙ]ÚYKœİ[K˜[š[X][ÛXJ_ZYŠ™]ÈT“ÙX\˜Ú\˜[\ÊØØ][Û‹œÙX\˜Ú
K™Ù]
Ü[š[™Ø
OOOXX
^Û]O]Ú[™İËœÙ][\˜[


OOÛ]]Ú[™İË—×ÛÓÜ[š[™ÕNÚYŠ]ËœÙ]\œš]˜[\Ù_—×Ü›ÙÜ™\ÜÚ[Û••Ü˜\Y
\™]\›İ—×Ü›ÙÜ™\ÜÚ[Û••Ü˜\YHLÛ]]œÙ]\œš]˜[\ÙK˜š[™

NİœÙ]\œš]˜[\ÙOYOOÚYŠŠJKHOOX™XYX
\™]\›Û]\\™›Ü›X[˜ÙK››İÊ
JÍL]Ú[™İËœÙ][\˜[


OOÚYŠ\™›Ü›X[˜ÙK››İÊ
O]YØİ[Y[™Ù][[Y[RY
Ü[š[™Ë]KX\œš]˜[
J^İÚ[™İË˜ÛX\’[\˜[
ŠNÜ™]\›Ÿ[Š™XYX
_K
_KÚ[™İË˜ÛX\’[\˜[
J_KJ_]˜\ˆOX[\ËX›]YKXYšXK[Ë[XZ[‹]ŒXOX[\ËX›]YKXYšXK[ËXØ[\ZYÛ‹[Y]K]Œ˜]OX[\ËX›]YKXYšXK\Ø]\™^KXÚXÚÜÚ[X˜\ÙXOX[\ËX›]YKXYšXK\Ø]\™^KXÚXÚÜÚ[[Y]X‹OHLKKOHLKKOLÙ[˜İ[ÛˆJJ^ÖYKTI‰ŠOHLİJ
KKœİÜ™KœİXœØÜšX™JOOŞOYKİJJK™

_JKËœİXœØÜšX™J

OOÕ™

K]J
I‰–J
_JK

KY

J_Y[˜İ[Ûˆ]JJ^ÚYŠVŠ\™]\›Û]UËœÛ˜\Úİ

KV‹™Ù]Û˜\Úİ

NÚYŠœ]Y\İİYÙOOOXœšY^K[Û[\XY	‰‘ÙKš[˜ÛY\ÊKšY
J^Û]YKšYİÙYZÙ[™\˜Ë›Û[\XY˜İ\œ™[OO\‰‰ŠËœ™XÛÜ™Û[\XY›İ[™
‹KœİXØÙ\ÜËKœØÛÜ™KKœ]X[]JKØJ‹œİÜ™K	ĞY
Š_Hœš[™İ	ÕËœÛ˜\Úİ

KÙYZÙ[™\˜Ë›Û[\XY™\ØÚ\[™\ÖÜ—KœÚ[ßHÛ[\X\[šİK˜KœİXØÙ\ÜÏØÛÛÙ˜Ø\›˜
K
‹›Z[]\ÏLLÌŒ‹™^OŒJI‰•Ë\]UÙYZÙ[™\˜ÊOOÙK›šYÚ›Ú\ÙOT™
K›šYÚ›Ú\ÙJÎJÓX]œ›İ[™
‹›™YYË˜[ÛÚÛ
‹Œ
KL
_KYHÜ0éH\Şš\[ˆ\š0íš[ˆ0é›]Ù\˜
KÚ[™İËœÙ][Y[İ]


OOœ]J
K
J__Y[˜İ[ÛˆİJ
^Û]OYØİ[Y[™Ù][[Y[RY
Ø[\ZYÛ‹YØ[YX
KYOËœ]Y\TÙ[XİÜŠÜ˜\ˆ˜]˜
NÚYŠY_]
^İÚ[™İËœÙ][Y[İ]
İKL
NÜ™]\›Ÿ[]YØİ[Y[˜Ü™X]Q[[Y[
]Û˜
NÛ‹šYXÜ[‹]ÙYZÙ[™X\˜Ø‹\OX]Û˜‹š[›™\’SXÜ[•ÛØÚ[™[™›ÙÙ[ÜÜ[Ø˜‹˜Y]™[\İ[™\ŠÛXÚØ]JKœ™\[™
ŠKØİ[Y[™Ù][[Y[RY
\
OËš[œÙ\Y˜XÙ[S
™Y›Ü™Y[™ˆÙXİ[ÛˆYHÙYZÙ[™X\˜Ë[[Ù[ˆÛ\ÜÏH›[Ù[ÙYZÙ[™X\˜Ë[[Ù[ˆY[‚ˆ\XÛHÛ\ÜÏHÙYZÙ[™X\˜Ë]Ú[™İÈ‚ˆ]ÛˆYHÙYZÙ[™X\˜ËXÛÜÙHˆÛ\ÜÏH›[Ù[^ˆ\OH˜]Ûˆˆ\šXK[X™[H”ØÚYpçÙ[ˆ°åÏØ]Û‚ˆ]ˆYHÙYZÙ[™X\˜ËXÛÛ[Ù]‚ˆØ\XÛO‚ˆÜÙXİ[Û˜
K™
ÙYZÙ[™X\˜ËXÛÜÙX
K˜Y]™[\İ[™\ŠÛXÚØJK™
ÙYZÙ[™X\˜Ë[[Ù[
K˜Y]™[\İ[™\ŠÛXÚØOOÙK\™Ù]OOR™
ÙYZÙ[™X\˜Ë[[Ù[
I‰’J
_JK™
ÙYZÙ[™X\˜ËXÛÛ[
K˜Y]™[\İ[™\ŠÛXÚØÙ
_Y[˜İ[ÛˆİJJ^Û]UËœÛ˜\Úİ

NÚYŠJYKœ›ÛÙİYKœÚÜ[™ĞÛÛ\]_ÙYZÙ[™\˜ËœØ]\™^K™X\›Q[™[™ß™š[˜[˜]UÛÛŠJ^ÚYŠK™^OOOLI‰™K›Z[]\ÏLL	‰œ]Y\İİYÙOOOXœ™YK]ÙYZÙ[™	‰ˆ]ÙYZÙ[™\˜Ë›Û[\XYœİ\Y
^ÕËœİ\œšY^SÛ[\XY

KİJ
NÜ™]\›ŸZYŠK™^OL‰‰™K›Z[]\ÏM	‰ÙYZÙ[™\˜Ë›Û[\XY˜ÛÛ\]Y	‰ˆ]ÙYZÙ[™\˜ËœØ]\™^KšYÙÙ\™Y
^Ş™

KËœİ\Ø]\™^PÛÛ\Z[

KİJ
NÜ™]\›Ÿ]œ]Y\İİYÙOOOXX\›KY]šXİ[Û˜	‰ˆV]J
I‰’İJ
__Y[˜İ[ÛˆİJ
^Ğ_
OHLÚ[™İËœÙ][Y[İ]


OOĞOHLKØİ[Y[œ]Y\TÙ[XİÜŠ›[Ù[››İ
ÚY[—JX
_]J
_KŒŒ
J_Y[˜İ[Ûˆ]J
^ÚYŠVŠ\™]\›Û]OUËœÛ˜\Úİ

KV‹™Ù]Û˜\Úİ

NÚYŠKœ]Y\İİYÙOOOXœ™YK]ÙYZÙ[™	‰ˆYKÙYZÙ[™\˜Ë›Û[\XYœİ\Y
ZYŠ™^OOOLI‰›Z[]\ÏLLŒ
UËœİ\œšY^SÛ[\XY

NÙ[Ù^ÕÙ
ÓĞÒS‘S‘“ÑÑS˜›ØÚÙZ[™HÛÛ™\œ]Y\İZİ]˜YHœ™Z]YËSÛ[\XYHİ\]XˆNŒZ‹ˆZİY[ˆYÈ	İ™^_K	İ˜ÛØÚÓX™[Kˆ[˜XÚ™\˜š[™]\ˆ›ÙÙ[ˆ˜XÚ0é›K°é[][™ÜÜ]Y\İ˜]\İØ[\ˆ[™ÙXÜ™]Z[[Û°é‹˜ŞÛX™[˜ØÚYpçÙ[˜Xİ[Û’_WJNÜ™]\›ŸR™
ÙYZÙ[™X\˜Ë[[Ù[
KšY[HLKØİ[Y[˜›ÙK˜Û\ÜÓ\İ˜Y
Ø[\ZYÛ‹[[Ù[[Ü[˜ÙYZÙ[™X\˜Ë[Ü[˜
KJ
_Y[˜İ[ÛˆJ
^Ò™
ÙYZÙ[™X\˜Ë[[Ù[
KšY[HLØİ[Y[˜›ÙK˜Û\ÜÓ\İœ™[[İ™JÙYZÙ[™X\˜Ë[Ü[˜
KØİ[Y[œ]Y\TÙ[XİÜŠ›[Ù[››İ
ÚY[—JX
_Øİ[Y[˜›ÙK˜Û\ÜÓ\İœ™[[İ™JØ[\ZYÛ‹[[Ù[[Ü[˜
_Y[˜İ[Ûˆ]J
^Ü™]\›ˆR™
ÙYZÙ[™X\˜Ë[[Ù[
KšY[ŸY[˜İ[ÛˆJ
^Û]OUËœÛ˜\Úİ

NÚYŠKœ]Y\İİYÙOOOXœšY^K[Û[\XY
\™]\›ˆ]JJNÚYŠKœ]Y\İİYÙOOOXØ]\™^KXÛÛ\Z[
\™]\›ˆ	JJNÚYŠKœ]Y\İİYÙOOOXØZÙK[X\Û
\™]\›ˆ
JNÚYŠKœ]Y\İİYÙOOOXØ]\™^KYX˜]X
\™]\›ˆ™
JNÚYŠKœ]Y\İİYÙOOOXØ]\™^KXœ˜]Û
\™]\›ˆ™
JNÚYŠKœ]Y\İİYÙOOOXÙXÜ™][Z[[Û˜Z\™X
\™]\›ˆY
JNÚYŠKœ]Y\İİYÙOOOXX\›KY]šXİ[Û˜
\™]\›ˆY
JNÚYŠKÙYZÙ[™\˜ËœØ]\™^K˜œ˜]ÛÛÛ‰‰™KÙYZÙ[™\˜ËœÙXÜ™]Z[[Û˜Z\™K˜ÛÛ\]Y
\™]\›ˆÙ
JNÖJJ_Y[˜İ[ÛˆJJ^Ò™
ÙYZÙ[™X\˜ËXÛÛ[
Kš[›™\’SQÙ
ÓÓ‘T”UQTÕØ\ˆœ™Z]YÈÚ\[ˆ[ˆØ[\İYØ\ˆ›ÙÙ[ˆ™XYÚY\]YˆZ[š\ÜY[KYÙ[Ú[ÜË™^šYZ[™Ù[ˆ[™YH°éÚXÚHZ™Z]˜ˆ	ÒÙ
ÖØÛ[\XYXKÙYZÙ[™\˜Ë›Û[\XY˜ÛÛ\]YØ	ÙKÙYZÙ[™\˜Ë›Û[\XYœÚ[ßH[šİX˜Ù™™[˜KØ˜XÚ0é›X	ÙKÙYZÙ[™\˜Ë›šYÚ›Ú\Ù_KÌLKØ›ZX™\™XÚKÙYZÙ[™\˜ËœØ]\™^K˜œ˜]ÛÛÛØ\šğé\˜Ù™™[˜KØÙXÜ™]Z[[Û°é˜KÙYZÙ[™\˜ËœÙXÜ™]Z[[Û˜Z\™K˜ÛÛ\]YØ™Y[™]˜Ù\Ü\œWJ_BˆÙXİ[ÛˆÛ\ÜÏH˜\˜Ë\ÙXİ[ÛˆÏX™›ÛÙOÚÏ‰ÜY
Øœ™Z]YÎˆš[šÜÜY[SÛ[\XYX˜XÚŒˆZˆYÙ[[™0é›XØ[\İYÈŒˆİ[™[\È°é[][™Üİ™\œİXÚ[›KÑ™[^[™[™°ê\ÈXœØÚYYÛYYX\ÛÙXÚÙ[ˆ[™0ï™\™]YÙ[˜\Úİ\ÜÚ[Ûˆ[™˜]\İØ[\˜™ZHÚYYÎˆÙXÜ™]Z[[Û°é˜J_OÜÙXİ[Û‚ˆ]ÛˆÛ\ÜÏH˜\˜Ë\š[X\Hˆ]KX\˜ËXXİ[ÛH˜ÛÜÙH–\°ïÚÈ]Yˆ[ˆ]Ø]Û˜
_Y[˜İ[Ûˆ]JJ^Û]YKÙYZÙ[™\˜Ë›Û[\XYQÙK™]™\JOO™\ØÚ\[™\ÖÙWK˜][\Y
KQÙK›X\

KŠOOÛ]]™\ØÚ\[™\ÖÙWNÜ™]\›˜\XÛHÛ\ÜÏH›Û[\XYY\ØÚ\[™H	Ü‹˜][\YØÛÛ\]X˜İ\œ™[OOYOØXİ]™X˜H‚ˆÜ[Œ	ÛŠÌ_OÜÜ[]Ï‰ÖY
Y
JJ_OÚÏ‰ÖY
™
JJ_OÜÙ]‚ˆİ›Û™Ï‰Ü‹˜][\YØ	Ü‹œÚ[ßH0­È	ÓY
‹œ]X[]J_X˜İ\œ™[OOYOØ0áQ•˜Ñ‘‘S˜OÜİ›Û™Ï‚ˆØ\XÛO˜JKš›Ú[Š
KO[ØÙXİ[ÛˆÛ\ÜÏH˜\˜Ë\ÙXİ[ÛˆÏ“Û[\\ØÚH˜XÚ™ZY\ÚÏ‘YHÜY[HÚ[™›Ü˜™ZKˆYH[ØÚZY[™È[˜XÚ™\İ[[][ˆ°éÚXÚ[ˆ0é›]Ù\[™[Z]İ[™[\È™]ÙZ\ÛYÙH[HŒZ‹Ü]ˆÛ\ÜÏH˜\˜Ë[Ü[ÛœÈ‚ˆ]Ûˆ]KX\˜ËXXİ[ÛH˜Y\œ\K\]ZY]İ›Û™Ï“XÚ\ˆ]\È[™ØÚY™[Üİ›Û™ÏÛX[“0é›HÚ[šİYÙ[˜]]ÚXÚX‹]Ø\Èğï™H›ZX0ïœšYËÜÛX[Ø]Û‚ˆ]Ûˆ]KX\˜ËXXİ[ÛH˜Y\œ\K[Û™Hİ›Û™Ï“›ØÚZ[™H[™H[H™[Ü™Z\ÏÜİ›Û™ÏÛX[“YZˆ[ÛÚÛÚ[ÜÈ[™Û]Xğï™YÙH™\ØÚÙ\™[‹ÜÛX[Ø]Û‚ˆ]ÛˆÛ\ÜÏH™[™Ù\ˆˆ]KX\˜ËXXİ[ÛH˜Y\œ\KY[İ›Û™Ï“Û[\\ØÚH˜XÚ™ZY\ˆš\ÈÙZ[™\ˆYZˆÙZpçËÙ\ˆÙ]ÛÛ›™[ˆ]Üİ›Û™ÏÛX[“X^[X[\ˆ˜XÚ0é›KÚ\ˆYÙ[[™]]XÚ0é\™\ˆØ[\İYÛ[Ü™Ù[‹ÜÛX[Ø]Û‚ˆÙ]ÜÙXİ[Û˜˜]ÛˆÛ\ÜÏH˜\˜Ë\š[X\Hˆ]KX\˜ËXXİ[ÛHœİ\[™^[Û[\XYˆ	İ˜İ\œ™[Ø\ØX›Y˜O‰İ˜İ\œ™[Ø	ĞY
˜İ\œ™[
_H0éY˜°éÚİH\Şš\[ˆ	ĞY
Ù

OÏØ›\İ\
_XOØ]Û˜Ò™
ÙYZÙ[™X\˜ËXÛÛ[
Kš[›™\’SQÙ
”‘RUQÈ0­È’S’ÔÔQSSÓSTPQX™ZH\Şš\[™[ˆš\ÈYH˜XÚZH[Ü™]\ØÚ™YÚ[›YHÛ[\XYH[İ]šY\^K[HÜ›ğçÙ[ˆš[šÜÜY[H]\Ş\›ØšY\™[‹ˆ™Y\ˆ\™›ÛÈ\š0íš[ˆÛØÚ[™[™Ù\8 $È[™˜\İ™YH™ZY\ˆYHÜ0é\™H™\ØÚÙ\™[YÙK˜ˆ	ÒÙ
ÖØ[šİXİš[™ÊœÚ[ÊWKØYÙ[Ú]X][Û˜OË˜ÛÛ™][Û“X™[ÏØ8 $ØKØZ™Z]OË˜ÛØÚÓX™[ÏØ8 $ØKØ˜XÚ0é›X	ÙKÙYZÙ[™\˜Ë›šYÚ›Ú\Ù_KÌLWJ_Bˆ]ˆÛ\ÜÏH›Û[\XY[\İ‰ÜŸOÙ]‰Ú_X
_Y[˜İ[Ûˆ	JJ^Û]YKÙYZÙ[™\˜ËœØ]\™^NÚYŠœİ\OOXÛÛ\Z[
^Û]YKÙYZÙ[™\˜Ë›šYÚ›Ú\ÙNÒ™
ÙYZÙ[™X\˜ËXÛÛ[
Kš[›™\’SQÙ
ĞSTÕQÈ0­ÈŒR˜Û[[Xœ™]›Üˆ\ˆ[™Xİ[™[HİZ[H™[Ü™Z\Ëˆ\ˆÙ\ÜZXÚ\H˜XÚ0é›HYYİ™ZH	İKÌLˆ	İMÌØZ™H›Üğï™™HÚ[™ZY\ˆ\œØÚ™XÚÙ[™ÛÛšÜ™]˜MØZ[ˆZ[Z™\ˆ™\ØÚÙ\™H\İÛ]Xğï™YË\ˆ™\İ\İXXÚ]\ğï[™Ë˜˜YH[œØÚ[Yİ[™È\İ0ï™\›ÙÙ[‹X™\ˆÚYHÙ[šYpçİ[ˆ]Yš]HÙZ‹˜Xˆ]ˆÛ\ÜÏH˜\˜Ë\ØÙ[™H]]Üš]K\ØÙ[™H]ˆÛ\ÜÏHœØÙ[™K\\œÛÛˆİ[™[H‘ÏÙ]›ØÚÜ][İO¸ 'XÚZ‹ˆXÚX™H]XÚYH[™H˜XÚš\È\ˆ™^™\[ÛˆÙZ0íœˆZˆXÚİ™]]\™[ˆÜ˜[H[™™\œØÚÚ[™]ˆ[HXXÚYHØÚ˜[šÙH[Hğí›ˆ[™ğïYÈXÚ¸ 'Ø›ØÚÜ][İOÙ]‚ˆ	ÒÙ
ÖØ˜XÚ0é›X	İKÌLKØ[[X][XLŒZ˜KØİ[™[XK™›YÜÖØ]]Üš]KYÛÛÙÚ[OØ\œğí››XÚÙZÜ°éšİ˜Ù™™[ˆ™Z[™Ù[YØKØÜ\X™\šØ]\[™[šÛÛÜ™[šY\WJ_Bˆ]ÛˆÛ\ÜÏH˜\˜Ë\š[X\Hˆ]KX\˜ËXXİ[ÛH˜ÛÛ\Z[XÛÛ[YH‘[›H[™™[^[š0íœ™[Ø]Û˜
NÜ™]\›ŸZYŠœİ\OOX\İ[[ÛšY\Ø
^Ò™
ÙYZÙ[™X\˜ËXÛÛ[
Kš[›™\’SQÙ
‘UÑRTĞUQ“RQHSH‘SÔ‘RTØÙZH™]YÙ[‹™ZH™\œÚ[Û™[˜[›H[™™[^\°é[ˆY\Ù[™H˜XÚZ]›ÛÛÛ[Y[ˆ[\œØÚYYXÚ\ˆ™^šYZ[™È\ˆ0ï™\œ°ï˜˜\™[ˆ™X[]0é˜ˆ]ˆÛ\ÜÏH\İ[[ÛKYÜšY‚ˆ\XÛHÛ\ÜÏH\İ[[ÛH	İ™[›U\İ[[ÛOØÛÛ\]X˜HXY\İ›Û™Ï‘[›OÜİ›Û™ÏÜ[ÒSÔÖ‘UQÑOÜÜ[ÚXY\¸ '“]]Ø\ˆ\ÈØÚÛ‹ˆX™\ˆÚ\ØÚ[™\˜ÚX™[ˆÚ\ˆ]XÚÙZˆZ\ÙHÙ\İXÚÙ\ˆZYÙ[XÚÛÈ]]\İ¸ 'Ü]Ûˆ]KX\˜ËXXİ[ÛHšX\‹Y[›Hˆ	İ™[›U\İ[[ÛOØ\ØX›Y˜O‰İ™[›U\İ[[ÛOØ™\œÚ[ÛˆÙ\ÚXÚ\˜[›H]\Ü™Y[ˆ\ÜÙ[˜OØ]ÛØ\XÛO‚ˆ\XÛHÛ\ÜÏH\İ[[ÛH	İ™™[^[Y[[™OØÛÛ\]X˜HXY\İ›Û™Ï‘™[^Üİ›Û™ÏÜ[–‘RUS’QOÜÜ[ÚXY\¸ '“]\ÚZÈš\ÈNŒ‹ˆ[HNŒÌH][HÙ[œİ[ˆ\ˆØÚ˜[šÙHÙXœ°ïˆZ[™\İ[œÈZ[ˆÙ\°é\ØÚØ[H›ÛH]Y\œ]‹¸ 'Ü]Ûˆ]KX\˜ËXXİ[ÛHšX\‹Y™[^ˆ	İ™™[^[Y[[™OØ\ØX›Y˜O‰İ™™[^[Y[[™OØ™Z][šYHÙ\ÚXÚ\˜™[^›İÚÛÛY\™[ˆ\ÜÙ[˜OØ]ÛØ\XÛO‚ˆÙ]‚ˆ	İ™[›U\İ[[ÛI‰™™[^[Y[[™OØ]ÛˆÛ\ÜÏH˜\˜Ë\š[X\Hˆ]KX\˜ËXXİ[ÛHœ^KY˜\™]Ù[\ÛÛ™È[™°ê\ÈÒKPXœØÚYYÛYYXœÜY[[Ø]Û˜˜Û\ÜÏH˜\˜ËZ[™ZYH]\ÜØYÙ[ˆÙ\™[ˆÜ0é\ˆ[È[\œØÚYYXÚH\Úİ\ÜÚ[ÛœÚØ\[ˆÙXœ˜]XÚÜ˜X
NÜ™]\›ŸYY
S‘°âTÈÒKSQQ0­ÈP”ĞÒQQÕ‘T”ÒSÓ˜ÛÛÙYHYšXXYKØZÙKXY\‹\ÛÛ™ØX\Û[È]HÚ[˜ÙHÙXÚÙ[˜
_Y[˜İ[ÛˆY
K‹‹J^Ò™
ÙYZÙ[™X\˜ËXÛÛ[
Kš[›™\’SQÙ
K[™°êH]YHYÙH™\™Z]È™\Û™]›Üˆ™[X[™™\œİXÚ]ÚYHH0íœÙ[‹ˆ\ÈYYÚ\™›Ûİ0é™YÈ[È™\İ\ÈİÜY[[Y[Ù\ÜZXÚ\˜ˆ]ˆÛ\ÜÏHœÛÛ™Ë\^Y\ˆ]ˆÛ\ÜÏHœÛÛ™ËY\ØÈOÚOÙ]]İ›Û™ÏS‘°âHÒH“ÑPÕSÓ”ÏÜİ›Û™ÏÛX[Ø[\[™ËTØÚYÙ\ˆ0­È[[İ[Û˜[[˜[™Ù[Y\ÜÙ[ˆ0­ÈÙ™›[™H™\™°ïØ˜\ÜÛX[Ù]Ù]‚ˆ™HÛ\ÜÏHœÛÛ™Ë[\šXÜÈ‰ÖY
Š_OÜ™O‚ˆ]ÛˆÛ\ÜÏH˜\˜Ë\š[X\Hˆ]KX\˜ËXXİ[ÛH‰ÜŸH‰ÖY
J_OØ]Û˜
_Y[˜İ[Ûˆ
J^Û]YKÙYZÙ[™\˜ËœØ]\™^NÚYŠœİ\OOXØZÙX
^Ò™
ÙYZÙ[™X\˜ËXÛÛ[
Kš[›™\’SQÙ
PTÓÑPÒÑS˜\ˆğíœœ\ˆ\İ[H™[\ˆ™\İ›ØÚšXÚØÚYYY™H]\ÜÈ]YˆLÙXœ˜XÚÙ\™[‹ˆ\HY]Ù[ˆÚ[™ØÚ™[\‹™\ØÚ0éYÙ[ˆX™\ˆİ[[][™È[™Ü0é\™HØ[\šÜ˜Y˜ˆ	ÒÙ
ÖØÙXÚÙ›ÜØÚš]	İØZÙT›ÙÜ™\ÜßKÌLKØX\ÛÈİ[[][™Ø	İØZÙS[ÛÙKÌLKØØY™™YH[H[™[\˜İš[™ÊOËš[™[ÜKšØY™™YOÏÌ
WKØÛÛ[H[œÈØÚK™›YÜË›X\ÛÛUÛÛØÙ[YZ[œØ[HÙ]ÛÛ›™[˜˜ÙZ[™Hš[™[™ØWJ_Bˆ]ˆÛ\ÜÏHØZÙK[Y]\ˆHİ[OHÚY‰İØZÙT›ÙÜ™\ÜßIHÚOÜ[ˆÛ\ÜÏH›[ÛÙˆİ[OHÚY‰İØZÙS[ÛÙIHÜÜ[Ù]‚ˆ]ˆÛ\ÜÏH˜\˜Ë[Ü[ÛœÈØZÙK[Ü[ÛœÈ‚ˆ]Ûˆ]K]ØZÙOHœ]ZY]İ›Û™Ï”ZYÈ8 '“X\Û8 'ØYÙ[Üİ›Û™ÏÛX[ŠÌLˆØXÚZ]0­È
Íİ[[][™ÏÜÛX[Ø]Û‚ˆ]Ûˆ]K]ØZÙOH\İ›Û™Ï[ˆYH[™H\[Üİ›Û™ÏÛX[ŠÌNØXÚZ]0­È™]]˜[ÜÛX[Ø]Û‚ˆ]Ûˆ]K]ØZÙOHœÛÛ™Èİ›Û™ÏXœØÚYYÛYY›Üˆ\È™[İ[[Üİ›Û™ÏÛX[ŠÌØXÚZ]0­È8¢$ŒHİ[[][™ÏÜÛX[Ø]Û‚ˆ]Ûˆ]K]ØZÙOH™[›Hİ›Û™Ï‘[›H[œÈ™[ØÚXÚÙ[Üİ›Û™ÏÛX[ŠÌÍHØXÚZ]0­È8¢$İ[[][™ÏÜÛX[Ø]Û‚ˆ]Ûˆ]K]ØZÙOHœÚZÙHİ›Û™Ï–™[Ü°éYÈØÚ0ï[Üİ›Û™ÏÛX[ŠÌÌØXÚZ]0­È8¢$ŒLˆİ[[][™ÏÜÛX[Ø]Û‚ˆ]Ûˆ]K]ØZÙOH˜ÛÙ™™YHˆ	ÊOËš[™[ÜKšØY™™YOÏÌ
OLØ\ØX›Y˜Oİ›Û™Ï’ØY™™YH›ÜˆYH0å™™›[™Èİ[[Üİ›Û™ÏÛX[ŠÍˆØXÚZ]0­È
ÌLİ[[][™È0­È™\˜œ˜]XÚØY™™YOÜÛX[Ø]Û‚ˆÙ]˜
NÜ™]\›ŸR™
ÙYZÙ[™X\˜ËXÛÛ[
Kš[›™\’SQÙ
PTÓ0ç‘T–‘UQÑS˜8 '•Ø\[HİZİ[™[H[Ü™Ù[œÈØÚÛˆ[ˆYZ[™[HX™[ø 'X\Û\İØXÚˆ™]]\ÜÈ\ˆœ™Z]Ú[YÈZ]\ˆØÚ˜[šÙHÙZ[‹ˆYH›İ]H™\°é™\X˜]H[™˜]\İØ[\‹˜ˆ	ÒÙ
ÖØ™^šYZ[™Ø
Ë™Ù]Û˜\Úİ

Kœ™[][ÛœÚ\Ë›X\ÛÏÌ
WKØİ[[][™Ø	İØZÙS[ÛÙKÌLKØÛÛ[H[œÈØÚK™›YÜË›X\ÛÛUÛÛØš[™[™È›Üš[™[˜˜šXÚÙ]ÛÛ›™[˜KØ[›KÑ™[^	İ™[›U\İ[[ÛOØ˜8 $ØHÈ	İ™™[^[Y[[™OØ˜˜8 $ØXWJ_Bˆ]ˆÛ\ÜÏH˜\˜Ë[Ü[ÛœÈ‚ˆ]Ûˆ]KXÛÛš[˜ÙOH™œšY[™Ú\İ›Û™Ï¸ '•Ù[›ˆHšXÚZ]ÛÛ[\İpïÜÙ[ˆ[HXœ™Z\Ù[‹¸ 'Üİ›Û™ÏÛX[‘œ™][™ØÚY0­Èİ\šÈ™ZHİ]\ˆ™^šYZ[™ÈÙ\ˆÙ[YZ[œØ[Y[HÛÛ[H[œÈØÚÜÛX[Ø]Û‚ˆ]Ûˆ]KXÛÛš[˜ÙOH™YÛÈİ›Û™Ï¸ '“\ˆHØ[›œİİ[™[HÛÈ™\Ú\œ™[‹\ÜÈÚYHZ™\ˆZYÙ[™[ˆ™YÙ[ÚY\œÜšXÚ¸ 'Üİ›Û™ÏÛX[‘YÛËÔÜ^šX[Ú\ÜÙ[ˆ0­È›Ùš]Y\›Ûˆİ]\ˆÙXÚÜİ[[][™ËÜÛX[Ø]Û‚ˆ]Ûˆ]KXÛÛš[˜ÙOH˜Ú[[™ÙHİ›Û™Ï¸ '•[H™Z]\]H˜]\İXÚšXÚ¸ 'Üİ›Û™ÏÛX[”ÚXÚ\™\ˆİ\X™\ˆX\ÛÚ\™YÙÜ™\ÜÚ]™\ˆ[™Ù[šYÙ\ˆÛÛ›ÛY\ÜÛX[Ø]Û‚ˆ]ÛˆÛ\ÜÏH™[™Ù\ˆˆ]KXÛÛš[˜ÙOH™[Y\™Ù[˜ŞHİ›Û™Ï“›İ˜[\™İ[Y[Ú™H°ïÚÜÚXÚ]Yˆ™^šYZ[™ÏÜİ›Û™ÏÛX[‘Ø\˜[Y\0­ÈÛÜİ]X\ÛP™^šYZ[™È[™İ[[][™ËÜÛX[Ø]Û‚ˆÙ]˜
_Y[˜İ[Ûˆ™
J^Û]YKÙYZÙ[™\˜ËœØ]\™^NÚYŠ]™X˜]T™\Üİ\™J^ÕË\]UÙYZÙ[™\˜ÊOİœØ]\™^K™X˜]T™\Üİ\™OTYJ›šYÚ›Ú\ÙKK™›YÜÊKœØ]\™^K™X˜]PÜ›İÙLJNÜ™]\›Ÿ[]\
JK™š[\ŠOOˆ]™X˜]U\ÙYš[˜ÛY\ÊKšY
JNÒ™
ÙYZÙ[™X\˜ËXÛÛ[
Kš[›™\’SQÙ
U•HTÒÕTÔÒSÓ˜X\ÛÙYÙ[ˆÛ[[Xœ™][™ØÚ0ïÜÙ[[™šY\ˆ\™İ[Y[][ÛœÜ[™[ˆ™\°é™\›ˆYH™Y[™İ[™Ù[ˆ\È[™\›YZYXÚ[ˆ˜]\İØ[\œËˆXÚÈÛÛÚ[šÙ[‹X›Zİ[H]Yˆ]\™HÙZ]HÙXÚÙ[‹˜ˆ	ÒÙ
ÖØ˜]\İİ\™™XÚØ	İ™X˜]T™\Üİ\™_KÌLKØX›Zİ[X
™X˜]PÜ›İÙ
WKØ[™[˜	İ™X˜]U\›œßKÍKØ˜XÚ0é›X	ÙKÙYZÙ[™\˜Ë›šYÚ›Ú\Ù_KÌLWJ_Bˆ]ˆÛ\ÜÏH™X˜]K\İYÙH]ˆÛ\ÜÏH™X˜]K\ÚYH[Y\È‘OØ“PTÓØÙ]]ˆÛ\ÜÏH™X˜]K]™\œİ\È•”ÏÙ]]ˆÛ\ÜÏH™X˜]K\ÚYH]]Üš]H‘ÕS‘SOØ•SOØÙ]Ù]‚ˆ]ˆÛ\ÜÏH˜\˜Ë[Ü[ÛœÈX˜]KXØ\™È‰Û‹›X\
OO˜]Ûˆ]KYX˜]OH‰ÙKšYHİ›Û™Ï‰ÖY
K›X™[
_OÜİ›Û™ÏÛX[‰ÖY
Kš[
_OÜÛX[Ø]Û˜
Kš›Ú[Š
_OÙ]‚ˆ	İ™X˜]U\›œÏM™X˜]T™\Üİ\™OLMOØ]ÛˆÛ\ÜÏH˜\˜Ë\š[X\H[™Ù\ˆˆ]KX\˜ËXXİ[ÛHœİ\Xœ˜]Û•[\È8 '™\›°ï™YÙHÛ0é[™ø '[›™ZY[Ø]Û˜˜Bˆ]ˆÛ\ÜÏH˜\˜Ë[ÙÈ‰İ™X˜]U\ÙYœÛXÙJ
Kœ™]™\œÙJ
K›X\
O˜‰ÖY

JK™š[™
OO™KšYOO]
OËœ™\İ[Ïİ
_OÜ˜
Kš›Ú[Š
_OÙ]˜
_Y[˜İ[Ûˆ™
J^Ô_Z
JNÛ]TK™İ[™[RŒØİ[™[X˜[XTK˜Ú\™ÙOLÎÒ™
ÙYZÙ[™X\˜ËXÛÛ[
Kš[›™\’SQÙ
UTÕ‘PÒSˆTˆĞÒS’ÑXÙZHÙYÙ[ˆÙZK[\ØXÚÙ[™XÙZ[™H™X[\İ\ØÚHÙ]Ø[ˆİ[™™\İYÚÙZ]Ø[\[™Ûpí˜™[ØÚ0ïÜÙ[[™[™0ï™\šYX™[™H™Y™™\˜[š[X][Û™[‹ˆšYY\›YÙH™Y[™][ˆÜY[İ[™›Ü™Z]YË˜ˆ]ˆÛ\ÜÏH˜œ˜]ÛX\™[˜H‚ˆ	Ô
XKœ^Y\’^Y\˜
_IÔ
X\ÛK›X\ÛX\Û
_Bˆ]ˆÛ\ÜÏH˜œ˜]ÛZ[\Xİ‰ÖY
™
JJ_OÙ]‚ˆ	Ô
İ[™[XK™İ[™[Rİ[™[X
_IÔ
[XK[R[X
_BˆÙ]‚ˆ	ÒÙ
ÖØZİ]™\ÈšY[KØ[™Xİš[™ÊK\›ŠWKØX\ÛSY[™Ø	ÔK˜Ú\™Ù_KÌØKØ˜XÚ0é›KSXXÚ	ÓX]œ›İ[™

K™[™[^TİÙ\‹LJJŒL
_H	XWJ_Bˆ]ˆÛ\ÜÏH[Z[™Ë\İš\OÚOÜ[”ØÚYİ[Z[™ÎˆZ]HšY™[H0é\İ[ÜÜ[Ù]‚ˆ]ˆÛ\ÜÏH˜œ˜]ÛXXİ[ÛœÈ‚ˆ]Ûˆ]KXœ˜]ÛHœ[˜Úİ›Û™Ï”ØÚYÙ[Üİ›Û™ÏÛX[“Y\\İH0­ÈØÚY[ˆXš0é™ÚYÈ›ÛH[Z[™ËÜÛX[Ø]Û‚ˆ]Ûˆ]KXœ˜]ÛH˜›ØÚÈİ›Û™Ï›ØÚÙ[Üİ›Û™ÏÛX[”ÚY0­È™Y^šY\[ˆ[™ÙZğï™Yİ[ˆ[™ÜšY™ˆİ\šËÜÛX[Ø]Û‚ˆ]Ûˆ]KXœ˜]ÛH™ÙÙHİ›Û™Ï]\İÙZXÚ[Üİ›Û™ÏÛX[”š\ÚØ[0­È\™™Zİ\È[Z[™È™\\œØXÚÛÛ\‹ÜÛX[Ø]Û‚ˆ]Ûˆ]KXœ˜]ÛH›X\Ûˆ	ÛØ˜\ØX›YOİ›Û™Ï“X\ÛU[›™[Üİ›Û™ÏÛX[‰ÛØ[\˜œšXÚ[™šY™™ZYK˜˜Y[™È\˜Ú[™[ˆ]Y˜˜]Y[‹˜OÜÛX[Ø]Û‚ˆÙ]‚ˆ]ˆÛ\ÜÏH˜\˜Ë[ÙÈ‰ÔK›ÙËœÛXÙJMÊKœ™]™\œÙJ
K›X\
OO˜‰ÖY
J_OÜ˜
Kš›Ú[Š
_OÙ]˜
_Y[˜İ[ÛˆY
J^Û]YKÙYZÙ[™\˜ËœÙXÜ™]Z[[Û˜Z\™K˜XØİ\Ø][ÛœË›[™İÒ™
ÙYZÙ[™X\˜ËXÛÛ[
Kš[›™\’SQÙ
“Ô–‘RUQÑTÈS‘X›ÛH]ˆÙY›ÙÙ[˜İ[™[HÚX™ZpçÚYÈZ[][‹ˆ[H0í™™›™]YHØÚ˜[šÙKˆ[™°êHÜY[\ÈYYğé™[™[›HZ[™[ˆØÚZ[™X\Û™\™Z]ÈÚYY\ˆØÚYˆİXÚ˜ˆ	ÒÙ
ÖØ˜XÚ0é›X	ÙKÙYZÙ[™\˜Ë›šYÚ›Ú\Ù_KÌLKØÛ[\X\[šİXİš[™ÊKÙYZÙ[™\˜Ë›Û[\XYœÚ[ÊWKØX˜][™XÚØ	ÙKÙYZÙ[™\˜ËœØ]\™^K™X˜]T™\Üİ\™_KÌLKØZ[[Û°éœÜ[™[˜İš[™Ê
WWJ_Bˆ™HÛ\ÜÏHœÛÛ™Ë[\šXÜÈ[™[™Ë\ÛÛ™È‰ÖY
YJ_OÜ™O‚ˆ]ˆÛ\ÜÏH™X\›KY[™[™ËXXİ[ÛœÈ‚ˆ]ÛˆÛ\ÜÏH˜\˜Ë\š[X\Hˆ]KX\˜ËXXİ[ÛHœ™\İÜ™K\Ø]\™^H”Ø[\İYÛ[Ü™Ù[ˆ\›™]]™\œİXÚ[Ø]Û‚ˆ]ÛˆÛ\ÜÏH™[™Ù\ˆˆ]KX\˜ËXXİ[ÛHœ™\Ù]]ÙYZÙ[™’ÛÛ\]\ÈÛØÚ[™[™H™]H™YÚ[›™[Ø]Û‚ˆÙ]˜
_Y[˜İ[ÛˆY
J^Û]YKÙYZÙ[™\˜ËœÙXÜ™]Z[[Û˜Z\™NÚYŠ]œİ\Y
^Ò™
ÙYZÙ[™X\˜ËXÛÛ[
Kš[›™\’SQÙ
ĞSTÕQÈ0­ÈÑRRSTÔQSÙXÜ™]Z[[Û°éˆ8 $È\ˆÛÛ[™HÜ›ÛšÛÜšÙ[˜[™°êH\İÜY[Z]\‹ˆğí›ˆšYİ\™[ˆğí››™[ˆ\ˆÙZZ[YHZ[[Û°éˆÙZ[‹ˆšY\ˆÙZZ[YHXœİ[[][™Ù[ˆÙ\™[ˆ[™ZY[™Ù\›Ûˆ™\ØÚ[YİH›YYÙ[ˆ]\È[HÙ]Ú[›œÛÛ8 $È]XÚ[œØÚ[YÙKˆ\ÈÚX\ˆZ[™[ˆ]\Ù]Ú[›‹˜ˆ	ÒÙ
ÖØZİ]™HšYİ\™[˜L˜KØXœİ[[][™Ù[˜KØ[šİXH0­Èˆ0­ÈÈ0­ÈKØ›Üİ™Z\ØÜ[™ğé›XÚÙZ[™\˜WJ_BˆÙXİ[ÛˆÛ\ÜÏH˜\˜Ë\ÙXİ[ÛˆÏœ›İÜÙ\™˜\Üİ[™ÏÚÏ‰ÜY
Ø›È[™H\œØÚZ[™[ˆ[™\™ZİH™[Ø˜XÚ[™Ù[‹˜H\™œİÙZH\œÛÛ™[ˆ™Yœ˜YÙ[‹˜[˜XÚ™\ØÚ[YÜİHÙ[˜]HZ[™H\œÛÛ‹˜YHØZšZ]›ZXš\È[Hš[˜[HÙZZ[K˜™\ØÚ[YİH™\›Y\™[ˆÛÙ›ÜZ™HÙ]Ú[›˜Ú[˜ÙK˜\ˆÙZZ[YHZ[[Û°éˆ\š0é™\™XÚİHZ\ÜÚ[Û™[ˆ[™›ÜZ[KYHšXÚ0í™™™[XÚ\šÛ0éÙ\™[‹˜J_OÜÙXİ[Û‚ˆ]ÛˆÛ\ÜÏH˜\˜Ë\š[X\Hˆ]KX\˜ËXXİ[ÛHœİ\\ÙXÜ™]‘ÙZZ[YH›Û[ˆ™\Z[[Ø]Û˜
NÜ™]\›ŸZYŠ˜ÛÛ\]Y
\™]\›ˆÙ
JNÛ]SX]›X^
Kœ›İ[™
KQ
›Z[[Û˜Z\™RY‹KÙYZÙ[™ØÛÜ™JÙKÙYZÙ[™\˜Ë›šYÚ›Ú\ÙJKO]œ]Y\İ[Û™Y™š[\ŠOO™Kœİ\ÕÚ]
	ÛŸN˜
JK›[™İÒ™
ÙYZÙ[™X\˜ËXÛÛ[
Kš[›™\’SQÙ
ÑPÔ‘URSSÓ°áˆ0­È•S‘H	ÛŸKÍÙ\ˆ°éİ[ˆÛÛ[™[ˆÜ›ÛšÛÜšÙ[ØYHZ\ÜÚ[Û™[ˆ›ZX™[ˆ[œÚXÚ˜\‹ˆ\ˆ™\š[[‹ÚY\œÜ°ïÚH[™\Èš\ÚZÛÈZ[™\ˆZYÙ[™[ˆ™\ØÚ[Yİ[™ÈÚ[™ÚXÚ˜\‹˜ˆ	ÒÙ
ÖØ[™[Ù\	İ
Š_H[šİ
JXKØZYÙ[™H[šİXİš[™Êœ^Y\”ØÛÜ™JWKØ™Yœ˜Yİ[™Ù[˜	Ú_KÌ˜KØ]\ÈÙ]Ú[›œÛÛİš[™Ê™[[Z[˜]Y›[™İ
WWJ_Bˆ]ˆÛ\ÜÏHœÙXÜ™][ØœÙ\˜][ÛœÈ‰Ü‹›X\
OO˜‰ÖY
J_OÜ˜
Kš›Ú[Š
_OÙ]‚ˆ]ˆÛ\ÜÏHœÙXÜ™]\›Üİ\ˆ‰ÒÙK›X\
OO‘Y
KŠJKš›Ú[Š
_OÙ]‚ˆÛ\ÜÏH˜\˜ËZ[‘Z[™H™\ØÚ[Yİ[™È™Y[™]YH[™Kˆ\È\™ÙX›š\ÈÚ\™\œİ˜XÚ[™HÙ™™[™Ù[YİÜ˜
_Y[˜İ[ÛˆÙ
J^Û]YKÙYZÙ[™\˜ËœÙXÜ™]Z[[Û˜Z\™KS™
›Z[[Û˜Z\™RY
NÒ™
ÙYZÙ[™X\˜ËXÛÛ[
Kš[›™\’SQÙ
ÑPÔ‘URSSÓ°áˆ0­ÈUQ“0å”ÕS‘Ø	ÛŸHØ\ˆ\ˆÙZZ[YHZ[[Û°é˜Ú[›™\OOX^Y\˜ØHÙ]Ú[›œİ[ˆZ[šYÙ[ˆ]\™Z\Ëˆ[H[™\™[ˆ\š[[ˆYH0éYÛÙÚ\ØÚH\™˜Z[™Ë˜[ØÚ™\™0éÚYİÛÜ™[ˆHÙZ[‹˜˜Z[ˆš]˜[\ÚY\™[™\ˆ\›Z]\ˆÙ]Ú[›[ˆ]\™Z\Ëˆ\ÈÚXÙY\ˆ›ÜİH›ØÚ™X™[œ™Z\Ë˜ˆ	ÒÙ
ÖØZ[™H[šİXİš[™Êœ^Y\”ØÛÜ™JWKØš]˜[[œ[šİXİš[™Êœš]˜[ØÛÜ™JWKØÙ]Ú[›™\˜Ú[›™\OOX^Y\˜ØX˜’USXKØ]\ÙÙ\ØÚYY[˜İš[™Ê™[[Z[˜]Y›[™İ
WWJ_Bˆ]ˆÛ\ÜÏHœÙXÜ™]\™\İ[[\İ‰İ˜XØİ\Ø][ÛœË›X\
OO˜İ›Û™Ï”[™H	ÙKœ›İ[™Nˆ	ÖY
™
Kœİ\ÜXİY
J_OÜİ›Û™ÏÜ[‰ÙK˜ÛÜœ™XİØ’PÒQÈ0­È
ÉÙKœÚ[ßX˜SĞÒ0­È]\ÈÙ]Ú[›œÛÛOÜÜ[Ü˜
Kš›Ú[Š
_OÙ]‚ˆ]ÛˆÛ\ÜÏH˜\˜Ë\š[X\Hˆ]KX\˜ËXXİ[ÛHœÙXÜ™]Yš[š\Ú–\°ïÚÈ[œÈœ™ZYHÛØÚ[™[™OØ]Û˜
_Y[˜İ[ÛˆÙ
J^Ò™
ÙYZÙ[™X\˜ËXÛÛ[
Kš[›™\’SQÙ
ÓĞÒS‘S‘“ÑÑSˆP‘ÑTĞÒÔÔÑS˜œ™Z]YÈ]]Ø[\İYÈ›ØÚXÛ[\XYK°é[][™Üİ™\œİXÚ˜]\İØ[\ˆ[™ÙXÜ™]Z[[Û°éˆÚ[™]Y\šY[HÜY[İ[™™\šÛ°ï˜ˆ	ÒÙ
ÖØÛ[\XYX	ÙKÙYZÙ[™\˜Ë›Û[\XYœÚ[ßH[šİXKØ˜XÚ0é›X	ÙKÙYZÙ[™\˜Ë›šYÚ›Ú\Ù_KÌLKØ›ZX™\™XÚ\šğé\KØÙXÜ™]Z[[Û°é˜KÙYZÙ[™\˜ËœÙXÜ™]Z[[Û˜Z\™KÚ[›™\OOX^Y\˜ØÙ]ÛÛ›™[˜˜™Y[™]WJ_Bˆ]ÛˆÛ\ÜÏH˜\˜Ë\š[X\Hˆ]KX\˜ËXXİ[ÛHœÚİË]šXİÜK\ÛÛ™È[™°ê\È›ZX™KSYY\›™]]XœÜY[[Ø]Û˜
_Y[˜İ[ÛˆÙ
J^Û]YK\™Ù]˜ÛÜÙ\İ
Ù]KX\˜ËXXİ[Û—KÙ]K]ØZÙWKÙ]KXÛÛš[˜ÙWKÙ]KYX˜]WKÙ]KXœ˜]ÛKÙ]K\ÙXÜ™]\]Y\İ[Û—KÙ]K\ÙXÜ™]XXØİ\ÙWX
NÈ]VŸ
™]\Ù]˜\˜ĞXİ[Û‰‰›
™]\Ù]˜\˜ĞXİ[ÛŠK™]\Ù]ØZÙI‰™
™]\Ù]ØZÙJK™]\Ù]˜ÛÛš[˜ÙI‰™™
™]\Ù]˜ÛÛš[˜ÙJK™]\Ù]™X˜]I‰›Y
™]\Ù]™X˜]JK™]\Ù]˜œ˜]Û	‰™Ù
™]\Ù]˜œ˜]Û
K™]\Ù]œÙXÜ™]]Y\İ[Û‰‰Ù
™]\Ù]œÙXÜ™]]Y\İ[ÛŠK™]\Ù]œÙXÜ™]XØİ\ÙI‰Ù
™]\Ù]œÙXÜ™]XØİ\ÙJJ_Y[˜İ[Ûˆ
J^ÚYŠŠ^ÚYŠOOOXÛÜÙX
\™]\›ˆJ
NÚYŠOOOXİ\[™^[Û[\XY
^Û]OZÙ
ËœÛ˜\Úİ

KÙYZÙ[™\˜Ë›Û[\XY
NÚYŠYJ\™]\›ˆ]JËœÛ˜\Úİ

JNÕËœÙ]Û[\XYİ\œ™[
JKJ
K‹œİ\Z[šYØ[YJJNÜ™]\›ŸZYŠKœİ\ÕÚ]
Y\œ\KX
J^İY
OOOXY\œ\KY[Ø[\Ù[™™OOOXY\œ\K[Û™XØÛ™K[[Ü™X˜]ZY]
NÜ™]\›ŸZYŠOOOXÛÛ\Z[XÛÛ[YX
^ÕË\]UÙYZÙ[™\˜ÊOOÙKœØ]\™^Kœİ\X\İ[[ÛšY\ØK[›H[™™[^™ZÛÛœİZY\™[ˆYH˜XÚˆ™ZYH™\Ù[™[ˆ[\œØÚYYXÚHYš[š][Û™[ˆ›Ûˆ™ZÛÛœİZİ[Û‹˜
NÜ™]\›ŸZYŠOOOXX\‹Y[›X
^ÕË\]UÙYZÙ[™\˜ÊOOÙKœØ]\™^K™[›U\İ[[ÛOHLK[›HYY™\Z[™HÚ[İ\ØÚHÙYÙ[™\œİ[[™ËˆÛ]Xğï™YÚÙZ][šÛ\‹[\š[[™ÜİÙ\ØÚ˜
KXJ‹œİÜ™KØÚ[ÜÎŒ‹[ÛY[[NŒŸJNÜ™]\›ŸZYŠOOOXX\‹Y™[^
^ÕË\]UÙYZÙ[™\˜ÊOOÙKœØ]\™^K™™[^[Y[[™OHLK™[^ÚXÚ\Z[™HZ[][™Ù[˜]YH˜XÚÚ›Û›ÛÙÚYH[šÛ\Ú]™H[\ÈZYÙ[™\ˆ]]İ0éšÙK˜
KXJ‹œİÜ™KÜ™\]][ÛŒ‹[ÛY[[NŒŸJNÜ™]\›ŸZYŠOOOX^KY˜\™]Ù[\ÛÛ™Ø
^ÕË\]UÙYZÙ[™\˜ÊOOÙKœØ]\™^Kœİ\XÛÛ™ØKœØ]\™^K™˜\™]Ù[ÛÛ™Ô^YYHLK[™°ê\ÈXœØÚYYÛYY\İ›Ûİ0é™YÈX™Ù\ÜY[ˆX\ÛÚ\™[Hİ]›È]\Ù°ïÚÛXÚ\ˆ]XÚÙH]Y™ÙY›Ü™\˜
NÜ™]\›ŸZYŠOOOXØZÙKXY\‹\ÛÛ™Ø
^ÕË\]UÙYZÙ[™\˜ÊOOÙKœØ]\™^Kœİ\XØZÙXK\ˆÛÛ™È[™]ˆX\ÛÈ™[™XYÚY\šXÚØ\È[È\œİH™\š[™[™ÜÛšYY\›YÙHÚ[˜
KËœÙ]İYÙJØZÙK[X\Û
NÜ™]\›ŸZYŠOOOXİ\Xœ˜]Û
^ÕË\]UÙYZÙ[™\˜ÊOOÙKœØ]\™^Kœİ\Xœ˜]ÛKœØ]\™^K˜œ˜]Û][\ÊÏL_K[H\šÛ0éYH\Úİ\ÜÚ[Ûˆ°ïˆ™Y[™][™Z[™HØÚ0éÙ\™ZH°ïˆ8 '™\›°ï™Yø '˜
KËœÙ]İYÙJØ]\™^KXœ˜]Û
KO]›ÚY‹˜[š[X]J[X]
K‹˜[š[X]JX\ÛİYÙÙ\˜
NÜ™]\›ŸZYŠOOOXİ\\ÙXÜ™]
\™]\›ˆÙ

NÚYŠOOOXÙXÜ™]Yš[š\Ú
^ÕË˜ÛÛ\]TÙXÜ™]Z[[Û˜Z\™JËœÛ˜\Úİ

KÙYZÙ[™\˜ËœÙXÜ™]Z[[Û˜Z\™KÚ[›™\Ÿš]˜[
KJ
NÜ™]\›ŸZYŠOOOXÚİË]šXİÜK\ÛÛ™Ø
\™]\›ˆY
S‘°âTÈÒKSQQ0­È“RP‘U‘T”ÒSÓ˜ÛÛÙYHYšXH8 $ÈšXÚX™KÛÜÙX\°ïÚÈ]Yˆ[ˆ]˜
NÚYŠOOOX™\İÜ™K\Ø]\™^X
\™]\›ˆ™

NÙOOOX™\Ù]]ÙYZÙ[™	‰Š‹œİÜ™Kœ™\Ù]

KËœ™\Ù]

KØØ[İÜ˜YÙKœ™[[İ™R][JJKØØ][Û‹œ™[ØY

J__Y[˜İ[ÛˆY
J^ÚYŠVŠ\™]\›Ö‹™Ù]Û˜\Úİ

NÛ]UËœÛ˜\Úİ

NÙOOOXÛ™K[[Ü™XÊ˜J‹œİÜ™KØ[ÛÚÛŒM›Y\K[™\™ŞN‹MËÛİ\˜YÙNJKXJ‹œİÜ™KØÚ[ÜÎËYÛš]N‹L‹[ÛY[[NJJN™OOOX[\Ù[™Ê˜J‹œİÜ™KØ[ÛÚÛŒ›Y\ŒM‹[™\™ŞN‹LLËÛİ\˜YÙNßJKXJ‹œİÜ™KØÚ[ÜÎŒMYÛš]N‹MK[ÛY[[NßJJNXJ‹œİÜ™KÙYÛš]NŒËÚ[ÜÎ‹LßJNÛ]V‹™Ù]Û˜\Úİ

KV™JÛÛ[\XYÚ[ÎÙYZÙ[™\˜Ë›Û[\XYœÚ[ËY\œ\N™K[ÛÚÛ›‹›™YYË˜[ÛÚÛÚ[ÜÎ›‹›Y]šXÜË˜Ú[ÜË]PXİ]š]Y\Î™OOOX[\Ù[™ÌŠÊOOOXÛ™K[[Ü™X
K]ZY]™\İ™OOOX]ZY]JNÕË˜ÛÛ\]SÛ[\XY
K‹YHœ™Z]YÛ˜XÚ[™]Z]	ÜŸKÌL˜XÚ0é›Kˆİ[™[H™YÚ[›[›™\›XÚ™\™Z]ÈZ[ˆ›İÚÛÛ˜
NÛ]OV‹™Ù]Û˜\Úİ

KOZK™^OOOLOÌMZK›Z[]\ÊÍ“X]›X^
ZK›Z[]\ÊNÖ‹œİÜ™K˜Y˜[˜ÙSZ[]\ÊJK™

KËœİ\Ø]\™^PÛÛ\Z[

K‹˜[š[X]J›ÚYOOOX]ZY]ØÚ]˜İYÙÙ\˜
KJ
_Y[˜İ[Ûˆ
J^ÚYŠVŠ\™]\›Û]İ—O^Ü]ZY]–ÌL‹K\–ÌNKÛÛ™Î–ÌLWK[›N–ÌÍKNKÚZÙN–ÌÌLL—KÛÙ™™YN–Í‹L_VÙWOÏÖÌNÙOOOXÛÙ™™YX	‰ˆWØJ‹œİÜ™KØY™™YX
_
Ë\]UÙYZÙ[™\˜ÊOOÙKœØ]\™^KØZÙT›ÙÜ™\ÜÏT™
KœØ]\™^KØZÙT›ÙÜ™\ÜÊİL
KKœØ]\™^KØZÙS[ÛÙT™
KœØ]\™^KØZÙS[ÛÙ
Û‹L
KKœØ]\™^KØZÙT›ÙÜ™\ÜÏLL	‰ŠKœØ]\™^K›X\Û]ØZÙOHLKœØ]\™^Kœİ\XÛÛš[˜ÙX
_KOOOX[›XØ[›H™\œØÚÚ[™][H™[ˆX\ÛØXÚ]\ğéÚXÚ]\ÈÙ[œİØÚ]ˆ]Y‹˜™OOOXÛÙ™™YXØ\ˆØY™™YYÙ\XÚ\œ™ZXÚX\Û›Üˆ\ˆÜ˜XÚK˜˜X\Û™XYÚY\Z[š[X[ˆ\ÈÚ\™[È›ÜØÚš]Ù]Ù\]˜
K‹˜[š[X]JX\ÛOOOXÚZÙXOOOX[›XØİYÙÙ\˜˜Ú]
J_Y[˜İ[Ûˆ™
J^ÚYŠVŠ\™]\›Û]V‹™Ù]Û˜\Úİ

KUËœÛ˜\Úİ

K]œ™[][ÛœÚ\Ë›X\ÛÏÌO[‹ÙYZÙ[™\˜ËœØ]\™^KØZÙS[ÛÙÚYŠJOOOX[Y\™Ù[˜ŞXOOOXÚ[[™ÙXOOOXœšY[™Ú\	‰ŠLL‹™›YÜË›X\ÛÛUÛÛŠ_OOOXYÛØ	‰ŠOMŸMJJJ^ÕË\]UÙYZÙ[™\˜ÊOOÙKœØ]\™^KØZÙS[ÛÙT™
KœØ]\™^KØZÙS[ÛÙM‹L
_KX\Û™ZÚXÚ[HÚ]™[ˆİ\ˆÙYËˆ\È\™İ[Y[Ø\ˆØXÚX™\ˆšXÚ0ï™\™]YÙ[™˜
K˜J‹œİÜ™KX\ÛLJNÜ™]\›ŸUË\]UÙYZÙ[™\˜ÊOİœØ]\™^K›X\ÛÛÛš[˜ÙYHLœØ]\™^K˜ÛÛš[˜ÙT›İ]OYKœØ]\™^Kœİ\XX˜]XœØ]\™^K™X˜]T™\Üİ\™OTYJ›šYÚ›Ú\ÙK‹™›YÜÊ_KX\ÛÛÛ[]Z]ˆ›İ]Nˆ	Ù_Kˆ\ˆ0é\È™\™Z]È°ïˆZ[™H›Ûİ0é™YÙHİ˜]YÚYK˜
KOOOXœšY[™Ú\	‰˜˜J‹œİÜ™KX\ÛŠKOOOXYÛØ	‰˜˜J‹œİÜ™KX\Û
KOOOXÚ[[™ÙX	‰XJ‹œİÜ™KØÚ[ÜÎŒË[ÛY[[NJKOOOX[Y\™Ù[˜ŞX	‰Š˜J‹œİÜ™KX\ÛMŠKXJ‹œİÜ™KÙYÛš]N‹LŸJJKËœÙ]İYÙJØ]\™^KYX˜]X
K‹˜[š[X]JX\ÛÚY\˜
_Y[˜İ[Ûˆ
J^Û]YKÙYZÙ[™\˜ËœØ]\™^NÜ™]\›–ŞÚY˜™[^X™[˜™[^8 &H˜XÚÚ›Û›ÛÙÚYX[™™[^[Y[[™OØZ[][™Ù[˜]YHÙYÙ[˜™]ÙZ\ÙH[™[\ÈZYÙ[™H]]İ0éšÙK˜˜šXÚ›Ü˜™\™Z]]ÈÙ\š[™Ù\™HÚ\šİ[™Ë˜™\Üİ\™N™™[^[Y[[™OËLNN‹MËÜ›İÙK™\İ[˜™[^™[›NŒ‹NŒÌH[™™ZHÚY\œÜ°ïÚXÚH]\ÜØYÙ[‹ˆİ[™[H\ÜİZ™Z][‹YHšXÚZˆÙZ0íœ™[‹˜KÚY˜[›XX™[˜[›\ÈÚ[İ\ØÚHÙYÙ[™\œİ[[™Ø[™[›U\İ[[ÛOØ[]™\›0éÜÚYËX™\ˆX›Zİ[\İÚ\šÜØ[K˜˜šXÚ›Ü˜™\™Z]]È˜\İ\ˆ0é›K˜™\Üİ\™N™[›U\İ[[ÛOËNN‹LËÜ›İÙŒLË™\İ[˜[›H™]ÙZ\İšXÚË\°é\ÈX™\ˆÛÈ0ï™\™]Yİ\ÜÈYZ™\™HØ[\\ˆXÚ[ˆ[™[HYHÛÛ›ÛH™\›Y\˜KÚY˜ÛÛ™ØX™[˜[™°ê\ÈÒKPXœØÚYYÚ[[™X[˜œ™[YØÚ[K]ÜÈ[™0í™™™[XÚH\ÚØ[][Û‹˜™\Üİ\™N™KÙYZÙ[™\˜Ë›šYÚ›Ú\ÙOMÌËMÎ‹LLËÜ›İÙŒLK™\İ[˜\ˆ™Yœ˜Z[ˆ8 '–\ˆ°éÚİ[ˆYšXx 'šYZX›Zİ[H[‹ˆİ[™[HY\šİ\ÜÈZ[™H°é[][™È\ˆØÚXÚ[ˆÙ\˜[™ÈÚ\™˜KÚY˜YÛØX™[˜İ[™[\È[™\šXÚ˜\šÙZ]™\İ0éYÙ[˜[™K™›YÜÖØ]]Üš]KYYÛËZÛÚØOØ›Ü˜™\™Z]]HØÚØXÚİ[K˜˜[\›İš\ÚY\HØÚYZXÚ[ZK˜™\Üİ\™N™K™›YÜÖØ]]Üš]KYYÛËZÛÚØOËLMÎ‹NKÜ›İÙ‹L‹™\İ[˜İ[™[H0íœ\ÜÈÚ™HÚYH[\È\Ø[[Y[˜œšXÚ[™™\™Ú\Üİ°ïˆZ[™[ˆ[ÛY[\ÜÈÚYHÙ[˜]H\ÈÙ\˜YH\˜™ZY°ï™[ˆÛÛK˜KÚY˜ÙYØ™Y\˜X™[˜[HZ]ÙYØšY\›ÙÚZÈ™\İ˜YÙ[˜[™K™›YÜÖØ]]Üš]KYš[šÚ[™ËX›Û™OØ™\İZ[™\ˆİ[\[™\˜YË˜˜Ú™H›Ü™Ù\ØÚXÚHš\ÚØ[\‹˜™\Üİ\™N™K™›YÜÖØ]]Üš]KYš[šÚ[™ËX›Û™OËLMN‹M‹Ü›İÙŒ‹™\İ[˜[H\š[›™\ÚXÚ[ˆ\ÈÙYØšY\ˆ[™›Ü›][Y\YH°é[][™È0í›XÚ[È8 '™ZYÙ[XÚ\ˆ]]XÚH[œØYÙx '˜KÚY˜X\ÛX™[˜X\ÛÈØÚÙÚZØ[™K™›YÜË›X\ÛÛUÛÛØÙ[YZ[œØ[YH\™˜Z[™ÈXXÚ[ˆ™\™ÛZXÚ˜\İ˜XÚ›ÛšYZ˜\‹˜˜šY[X[™™\œİZZ‹X™\ˆšY[X[™Ú[\ÈYÙX™[‹˜™\Üİ\™N™K™›YÜË›X\ÛÛUÛÛËLŒN‹LLËÜ›İÙ™\İ[˜X\Û\šÛ0é0é›HÚYHZ[ˆØÚXÚX™ÙYXÚ]\ÈØÚˆİ[™[HÚY\œÜšXÚÛÜœšYÚY\ÚXÚ[™ÚY\œÜšXÚ[Z]Z™[H\œİ[ˆÚY\œÜXÚ˜W_Y[˜İ[ÛˆY
J^ÚYŠVŠ\™]\›Û]UËœÛ˜\Úİ

K\

K™š[™
OšYOOYJNÈ[ŸÙYZÙ[™\˜ËœØ]\™^K™X˜]U\ÙYš[˜ÛY\ÊJ_
Ë\]UÙYZÙ[™\˜ÊOİœØ]\™^K™X˜]T™\Üİ\™OT™
œØ]\™^K™X˜]T™\Üİ\™JÛ‹œ™\Üİ\™KL
KœØ]\™^K™X˜]PÜ›İÙT™
œØ]\™^K™X˜]PÜ›İÙ
Û‹˜Ü›İÙLÌŒ
KœØ]\™^K™X˜]U\›œÊÏLKœØ]\™^K™X˜]U\ÙYœ\Ú
J_K‹œ™\İ[
KXJ‹œİÜ™KÛ[ÛY[[N›‹œ™\Üİ\™OKLMOÌÎŒK™\]][Û›‹˜Ü›İÙOÌŒÚ[ÜÎ™OOOX[›XOOOXÛÛ™ØÌŒJK‹˜[š[X]JOOOXX\ÛØX\Û™OOOX™[^Ø™[^›ÚYOOOXÛÛ™ØØÚY\˜˜[Ø
J_Y[˜İ[Ûˆ
J^Ü™]\›Ë‹‹‰JÜ™\Üİ\™N™KÙYZÙ[™\˜ËœØ]\™^K™X˜]T™\Üİ\™KÜ›İÙ™KÙYZÙ[™\˜ËœØ]\™^K™X˜]PÜ›İÙØZÙS[ÛÙ™KÙYZÙ[™\˜ËœØ]\™^KØZÙS[ÛÙ™[][ÛœÚ\X\Û–Ë™Ù]Û˜\Úİ

Kœ™[][ÛœÚ\Ë›X\ÛÏÌšYÚ›Ú\ÙN™KÙYZÙ[™\˜Ë›šYÚ›Ú\Ù_JK\›ŒKÚ\™ÙNŠÊKÙYZÙ[™\˜ËœØ]\™^K˜ÛÛš[˜ÙT›İ]OOOXÚ[[™ÙX
KİX\™[™ÎˆLKİ[›™YˆLKÙÎ–Ø[Nˆ8 '’™]Û0é™[ˆÚ\ˆ\ÈZ[›X[™\›°ï™YË¸ 'X\Ûˆ8 '‘\ÈÛÜ™Y]]]™ZH\ˆ]Ø\È[™\™\Ë¸ '__Y[˜İ[ÛˆÙ
J^ÚYŠVŸTJ\™]\›Û]RY

KTK™İ[™[RŒØİ[™[X˜[XÚYŠK™İX\™[™ÏHLKOOOX[˜Ú
^Û]OSX]œ›İ[™

‹Ì‹OÌNNŒLŠJŠJÓX]›Z[ŠŒË
‹™Ù]Û˜\Úİ

K›™YYË˜Ûİ\˜YÙOÏÌ
KÌÌ
JJNŞ
‹JKK›ÙËœ\Ú
‹ØT‘‘RÕTˆPÒÑS’ÓUĞÒTˆ	Ù_Hİ[™™\İYÚÙZ]˜˜ØÚYÈšY™	ÛOOXİ[™[XØ\ÈÛ[[Xœ™]˜[\ÈšY\˜˜]XÚNˆ	Ù_K˜
K‹˜[š[X]J›ÚY]
_Y[ÙHYŠOOOX›ØÚØ
TK™İX\™[™ÏHLK›ÙËœ\Ú
Ø[\[™ÜİZQXÚİ[™È]Y™ÙX˜]]ˆ\ˆ°éÚİH™Y™™\ˆ™\›Y\[ˆÜ›ğçİZ[ÙZ[™\ˆÚ\šİ[™Ë˜
K‹˜[š[X]J›ÚYÚ]
NÙ[ÙHYŠOOOXÙÙX
]‹MOÊ
‹‹ÌLJKKœİ[›™Y]‹‹K›ÙËœ\Ú
‹Ø\™™Zİ]\ÙÙ]ÚXÚ[ˆÙYÛ™\ˆšY™YHØÚ˜[šÙH[™™\›Y\ÙZ[™[ˆYË˜˜]\ÙÙ]ÚXÚ[ˆ[™ÛZ[™\ˆÛÛ\ˆÙ\Ù]˜
JN”K›ÙËœ\Ú
]\İÙZXÚ™\œİXÚ™YÚ[›Hœ°ï[™[™]ÜÛÈ\ˆ[™ÜšY™ˆÚ™Z[ˆ[ÛÛK˜
NÙ[ÙHYŠOOOXX\Û	‰”K˜Ú\™ÙOLÊ^ÔK˜Ú\™ÙOLÛ]OSX]œ›İ[™
NJ”K›X\ÛİÙ\ŠNÔK™İ[™[RT™
K™İ[™[RYKL
KK[RT™
K[RYKL
KKœİ[›™YHLK›ÙËœ\Ú
PTÓUS“‘Sˆ™ZYH™\›Y\™[ˆ	Ù_KˆšY[X[™™\œİZYH™]ÙYİ[™È]\Ü™ZXÚ[™°ïˆZ[™[ˆÙYÙ[YË˜
K‹˜[š[X]JX\Û]
_ZYŠÙ

KK™İ[™[RL	‰”K[RL
\™]\›ˆY

NÚYŠKœİ[›™YÊK›ÙËœ\Ú
\ˆÙYÛ™\š\ØÚHYÈ°éÙYÙ[ˆ›Ûİ0é™YÙ\ˆ™\Ú\œ[™È]\Ë˜
KKœİ[›™YHLJN™

KK˜Ú\™ÙOT™
K˜Ú\™ÙJÌKÊKK\›ŠÏLKKœ^Y\’L	‰”K›X\ÛL
\™]\›ˆ™

NÜ™
ËœÛ˜\Úİ

J_Y[˜İ[ÛˆÙ

^ÚYŠT_K›X\ÛL
\™]\›Û]OTK™İ[™[RŒØİ[™[X˜[XSX]œ›İ[™

JÔK\›‰LÊŒŠJ”K›X\ÛİÙ\ŠNŞ
K
KK›ÙËœ\Ú
X\ÛÈØÚY[šÙ[™\ˆZÙ[ˆ™\\œØXÚ	İKˆ\ˆÚ\šİÙ[œİ0ï™\œ˜\ØÚ˜
_Y[˜İ[Ûˆ™

^ÚYŠTJ\™]\›Û]OTK\›‰LOL	‰”K[RŒØ[X”K™İ[™[RŒØİ[™[X˜[XTK\›‰LÏOL	‰”K›X\ÛŒSX]œ›İ[™


OOOX[XÌMNŒLŠJÔK\›‰M
ŒŠJ”K™[™[^TİÙ\ŠNÔK™İX\™[™É‰ŠSX]›X^
‹X]œ›İ[™
Š‹ŒÌŠJJKÔK›X\ÛT™
K›X\Û[‹L
N”Kœ^Y\’T™
Kœ^Y\’[‹L
NÛ]YOOOX[XÖØØÚ0ïÜÙ[[™TØÚÚ[™Ù\˜šY\˜˜]XÚT˜[[YXİ[\[S˜XÚÙ[šÛ]ØÚ\˜ÔÔ•Ñ”‘US‘XVÔK\›‰MN–ØÛ[[Xœ™]TØÚ[Xœš[[œ˜[™Qš[X[™\ØÚ[‹RZÙ[˜•S•Tˆ“ÓHUˆXVÔK\›‰MNÔK›ÙËœ\Ú
	Ù_Nˆ	ÜŸHšY™	İØX\Û˜XÚH°ïˆ	ÛŸK˜
KË˜[š[X]JKÓØØ[SİÙ\Ø\ÙJX
K]
_Y[˜İ[ÛˆY

^ÈVŸT_
ËÚ[”Ø]\™^Pœ˜]Û

KË˜Y™[][ÛœÚ\
X\ÛNX\Û]\È›ZX™\™XÚZ]\Úİ]Y\[™Z]Ù\°ïÙ[˜
KË˜Y™[][ÛœÚ\
İ[™[XJKË˜Y™[][ÛœÚ\
[XÊKXJ‹œİÜ™KÙYÛš]NËÚ[ÜÎK™\]][ÛŒM[ÛY[[NŒLŸK˜]\İ™XÚZ]œ°ïİ0ïÚÎˆ\È›ZX™\™XÚ\İ\šğé\˜
KJ‹œİÜ™KØ]\™^Tİ^UÛÛ˜
K‹˜[š[X]J›ÚYÚY\˜
K‹˜[š[X]JX\ÛÚY\˜
K‹˜[š[X]Jİ[™[XÛÛ\ÙX
K‹˜[š[X]J[XÛÛ\ÙX
KË\]UÙYZÙ[™\˜ÊOOÙKœØ]\™^KšXİÜTÛÛ™Ô^YYHLK[™°ê\ÈÙZ]\ÈÒKSYY™YÚ[›ˆÛÛÙYHYšXH8 $ÈšXÚX
KY
S‘°âTÈÒKSQQ0­È“RP‘U‘T”ÒSÓ˜ÛÛÙYHYšXH8 $ÈšXÚX™Kİ\\ÙXÜ™]ÙXÜ™]Z[[Û°éˆ[HØ[\İYÈİ\[˜
J_Y[˜İ[Ûˆ™

^Ö‰‰ŠË›ÜÙTØ]\™^Pœ˜]Û

KXJ‹œİÜ™KÙYÛš]N‹LL‹Ú[ÜÎ™\]][Û‹M‹[ÛY[[N‹LŒKYHÜ\H™\›Y\[ˆ˜]\İØ[\ˆ[™]\ÜÈXœ™Z\Ù[‹˜
KJ‹œİÜ™KX\›Q]šXİ[Û‘[™[™Ø
KY
ËœÛ˜\Úİ

JJ_Y[˜İ[Ûˆ
K
^ÔI‰ŠOOOXİ[™[XÔK™İ[™[RT™
K™İ[™[R]L
N”K[RT™
K[R]L
J_Y[˜İ[ÛˆÙ

^Û]OUËœÛ˜\Úİ

KVË™Ù]Û˜\Úİ

KYKÙYZÙ[™ØÛÜ™JÙKÙYZÙ[™\˜Ë›šYÚ›Ú\ÙJÊÊËœ™[][ÛœÚ\Ë›X\ÛÏÌ
JŒÊÙKœİ\ÜXÚ[ÛŠŒLNÕË\]UÙYZÙ[™\˜ÊOOÙKœÙXÜ™]Z[[Û˜Z\™K[›ØÚÙYHLKœÙXÜ™]Z[[Û˜Z\™Kœİ\YHLKœÙXÜ™]Z[[Û˜Z\™Kœ›İ[™LKKœÙXÜ™]Z[[Û˜Z\™K›Z[[Û˜Z\™RYY]
ŠKKœÙXÜ™]Z[[Û˜Z\™Kœš]˜[ØÛÜ™O[
ŠKKœÙXÜ™]Z[[Û˜Z\™Kœ]Y\İ[Û™YV×_K[™°êH™\Z[ÙZZ[YH›Û[‹ˆ\ˆÛÛ[™HÜ›ÛšÛÜšÙ[ˆ™\œØÚÚ[™][ˆZ[™\ˆ\ØÚK˜
KOL‹Y
ËœÛ˜\Úİ

J_Y[˜İ[ÛˆÙ
J^Û]UËœÛ˜\Úİ

KÙYZÙ[™\˜ËœÙXÜ™]Z[[Û˜Z\™KX	İœ›İ[™N‰Ù_Xİœ]Y\İ[Û™Y™š[\ŠOO™Kœİ\ÕÚ]
	İœ›İ[™N˜
JK›[™İLŸœ]Y\İ[Û™Yš[˜ÛY\ÊŠ_
Ë\]UÙYZÙ[™\˜ÊOOÙKœÙXÜ™]Z[[Û˜Z\™Kœ]Y\İ[Û™Yœ\Ú
Š_K	Ó™
J_Hİ\™H[ˆ[™H	İœ›İ[™H™Yœ˜Yİˆ	ÓÙ
K›Z[[Û˜Z\™RYœ›İ[™
_K˜
KOSX]›X^
KLJJ_Y[˜İ[ÛˆÙ
J^Û]UËœÛ˜\Úİ

KÙYZÙ[™\˜ËœÙXÜ™]Z[[Û˜Z\™NÚYŠ™[[Z[˜]Yš[˜ÛY\ÊJ_˜ÛÛ\]Yœ›İ[™J\™]\›Û]YOOO]›Z[[Û˜Z\™RY[İ
œ›İ[™
NŒO]œ›İ[™MÕË\]UÙYZÙ[™\˜ÊOİœÙXÜ™]Z[[Û˜Z\™K˜XØİ\Ø][ÛœËœ\Ú
Ü›İ[™œÙXÜ™]Z[[Û˜Z\™Kœ›İ[™İ\ÜXİY™KÛÜœ™Xİ›‹Ú[ÎœŸJKœÙXÜ™]Z[[Û˜Z\™K™[[Z[˜]Yœ\Ú
JKœÙXÜ™]Z[[Û˜Z\™Kœ^Y\”ØÛÜ™JÏ\‹_
œÙXÜ™]Z[[Û˜Z\™Kœ›İ[™]œÙXÜ™]Z[[Û˜Z\™Kœ›İ[™
ÌJ_K	Ó™
J_H\İ]\È[HÙ]Ú[›œÛÛˆØˆYH™\ØÚ[Yİ[™ÈšXÚYÈØ\‹›ZXš\È[H[™HÙZZ[K˜
KOÕ

NŠOL‹Y
ËœÛ˜\Úİ

JJ_Y[˜İ[Ûˆ

^ÚYŠVŠ\™]\›Û]OUËœÛ˜\Úİ

KYKÙYZÙ[™\˜ËœÙXÜ™]Z[[Û˜Z\™Kœ^Y\”ØÛÜ™O™KÙYZÙ[™\˜ËœÙXÜ™]Z[[Û˜Z\™Kœš]˜[ØÛÜ™OØ^Y\˜˜š]˜[ÕË\]UÙYZÙ[™\˜ÊOOÙKœÙXÜ™]Z[[Û˜Z\™K˜ÛÛ\]YHLKœÙXÜ™]Z[[Û˜Z\™KÚ[›™\]KOOX^Y\˜Ø\ˆZ[šYÙH]\Ù]Ú[›ˆÙZ[ˆXÚ˜˜\ˆ]\Ù]Ú[›ˆÙZ[ˆZ[™[ˆš]˜[\ÚY\™[™[ˆ\›Z]\‹ˆ›Üİ™Z\ÙH^\İY\™[ˆšXÚ˜
KOOX^Y\˜ŞXJ‹œİÜ™KÙYÛš]N‹™\]][ÛŒL[ÛY[[NJNXJ‹œİÜ™KÙYÛš]N‹L‹™\]][ÛŒË[ÛY[[NŒŸJKÙ
ËœÛ˜\Úİ

J_Y[˜İ[ÛˆY
KŠ^Û]]™[[Z[˜]Yš[˜ÛY\ÊJKO]œ]Y\İ[Û™Yš[˜ÛY\Ê	ÛŸN‰Ù_X
KO]œ]Y\İ[Û™Y™š[\ŠOO™Kœİ\ÕÚ]
	ÛŸN˜
JK›[™İÜ™]\›˜\XÛHÛ\ÜÏHœÙXÜ™]XØ[™Y]H	ÜØ[[Z[˜]Y˜H‚ˆXY\Ü[‰ÖY
–ÙWOËœ›ÛOÏØ‘T‘0áÒQØ
_OÜÜ[İ›Û™Ï‰ÖY
™
JJ_OÜİ›Û™ÏÚXY\‚ˆ‰ÚOÖY
Ù
K›Z[[Û˜Z\™RYŠJN˜›ØÚÙZ[™H]\ÜØYÙH[ˆY\Ù\ˆ[™K˜OÜ‚ˆ]]Ûˆ]K\ÙXÜ™]\]Y\İ[ÛH‰Ù_Hˆ	Ú_OLØ\ØX›Y˜O™Yœ˜YÙ[Ø]Û]ÛˆÛ\ÜÏH™[™Ù\ˆˆ]K\ÙXÜ™]XXØİ\ÙOH‰Ù_Hˆ	ÜØ\ØX›Y˜O™\ØÚ[YÙ[Ø]ÛÙ]‚ˆ	ÜØÛX[UTÈSHÑUÒS“”ÓÓÜÛX[˜˜BˆØ\XÛO˜Y[˜İ[Ûˆ
KŠ^Û]VË‹‹’ÙWKO\–ÊŠİ
ŒÊI\‹›[™İKO\–ÊŠİ
JÌŠI\‹›[™İNÜ™]\›–Ø™[Ø˜XÚ[™È	İKŒNˆ	Ó™
J_H™\œØÚÚ[™]]Y™°éYÈİ\ˆ]\È[H™[Ü™Z\È[™ÛÛ[]Z]Z[™\ˆ›ÛÛÛ[Y[ˆ[›°íYÙ[ˆ\šÛ0é[™È\°ïÚË˜™[Ø˜XÚ[™È	İKŒˆ	Ó™
J_Hİ\™HZ]Z[™[HÛÛ˜\˜™[™[ˆÜ›ÛšÛÜšÙ[ˆÙ\ÙZ[‹ˆ\šİ[™[šÛ\‹˜™[Ø˜XÚ[™È	İKŒÎˆ	Ó™
J_H[šİYH\Úİ\ÜÚ[Ûˆ]YˆZ[™H\œÛÛ‹YH™\™Z]È]\È[HÙ]Ú[›œÛÛ]\ÙÙ\ØÚYY[ˆ\İ˜_Y[˜İ[ÛˆÙ
KŠ^Û]YOOO]O^Ü™[™N˜8 '’XÚX™HZ[™HX™[HÙ[XXÚˆ\È\İÙZ[™HZ\ÜÚ[Û‹\È\İÙ[œİØÚ]‹¸ '\œÎ˜8 '•Ù[›ˆXÚZ[[Û°éˆğé™Kğé™H\ÈY\ˆØ[\ÈšY\‹ˆÚYZİHØ[\ÈšY\ø '[›N˜8 '’XÚØ\ˆYHØ[™H[™HÚXÚ˜\‹ˆ]pçÙ\ˆ[ˆ[ˆ[ÛY[[‹[ˆ[™[ˆXÚÙYÈØ\‹¸ 'Ü™YÛÜ˜8 '‘YH›YØ˜ZˆY\Ù\ÈÜ›ÛšÛÜšÙ[œÈ™]ÙZ\İØ\ˆšXÚËˆ˜\İØ\ˆšXÚË¸ 'X\Û˜8 '’XÚÙ[›™HYZ[™H›ÛKˆXÚX™HÚYH\ˆ›ØÚšXÚ›Ûİ0é™YÈÙ[\Ù[‹¸ 'ØÚX™\˜8 '‘Z[™HÙZZ[YHZ\ÜÚ[Ûˆğï™HXÚ›Ù™\ÜÚ[Û™[\ˆ\˜Ú°ï™[‹¸ '™[^˜8 '“YZ[™H™Z][šYH\İÛÛœÚ\İ[ˆ\È\İÙ™™[˜˜\ˆØÚÛˆ™\™0éÚYË¸ 'ØÚ[XN˜8 '’XÚX™H\ˆÙ]°éšÙH™\Z[ˆZ[šYÙH]›ÛˆØ\™[ˆİ˜]YÚ\ØÚ¸ '›Û›N˜8 '‘\ˆ™YÜšY™ˆZ[[Û°éˆ\İ[ˆY\Ù[HÛÛ^Ú™Z[ˆÙ[X[\ØÚ[œØ]X™\‹¸ 'X[›šN˜8 '’XÚØ\ˆ[HØ[š]0é™ÙX°éYKˆÜÚX\ÈÙZ[™HÛÛ[™[ˆÜ›ÛšÛÜšÙ[‹¸ 'İ\ÚN˜8 '’XÚ™X[ÛÜHYHœ˜YÙKÛØ˜[HZ[™H™\ÜÙ\™Hİ[İ¸ '[N˜8 '™\ØÚ[YÙHZXÚZYËˆX™\ˆ[›ˆš[ˆXÚ]\È[HÛÛ[™H\šÛ0éœİ\È[[‹¸ 'NÜ™]\›ˆÛLØ	ÚVÙWOÏØH[˜XÚ›ÛİZ[™HH]\Ù°ï›XÚH\šÛ0é[™È°ïˆZ[™H[™[™Ë˜XÚ\ˆšY[X[™ÙYœ˜Yİ]˜˜	ÚVÙWOÏØH™ZH\ˆ˜XÚœ˜YÙH\ˆÙZZ[Y[ˆZ\ÜÚ[Ûˆ°éZ[™HY\šÛXÚH]\ÙK[˜XÚÚ\™\È[XHÙ]ÙXÚÙ[˜šVÙWOÏØ8 '’XÚX™HšXÚÈÙ\ÙZ[ˆ[™\œİ][›XÚšY[^HHØYÙ[‹¸ 'Y[˜İ[ÛˆÙ
J^Ü™]\›ˆÙK™š[™
OˆYK™\ØÚ\[™\ÖİK˜][\Y
_Y[˜İ[ÛˆY
J^Ü™]\›Ù›\İ\˜›\İ\İY™™[™Y\”Û™Î˜™Y\ˆÛ™È°éš\Ú[Û˜›[šŞX˜[˜›[šŞX˜[]\Ù]Y\˜VÙW_Y[˜İ[Ûˆ™
J^Ü™]\›Ù›\İ\˜š[šÙ[‹]šY\™[‹›\[ˆ8 $ÈšY\ˆšYİ\™[ˆ[ˆ›ÛÙK˜™Y\”Û™Î˜\™ZİH[™›İ[˜ÙKUğï™™HZ]™KT˜XÚÈ[™™Y[\[Û‹˜›[šŞX˜[˜Z][›\ØÚKš[šÙ™[œİ\‹Üš[[™İÜY‹˜VÙW_Y[˜İ[ÛˆY
J^Ü™]\›Ü\™™Xİ˜QÑS‘0á˜ÛÛY˜ÓÓQXY\ÜŞN˜ÒSÕTĞÒ˜Z[Y˜ÑTĞÒˆVÙWOÏÙ_Y[˜İ[Ûˆ™
J^Ü™]\›ˆ–ÙWOË›˜[YOÏÙK˜Ú\]

KÓØØ[U\\Ø\ÙJX
JÙKœÛXÙJJ_Y[˜İ[Ûˆ
KŠ^Ü™]\›˜\XÛHÛ\ÜÏH˜œ˜]ÛYšYÚ\ˆ	ÛŸH	İLØİÛ˜˜H]Ü[‰ÖY
J_OÜÜ[İ›Û™Ï‰ÓX]œ›İ[™

_OÜİ›Û™ÏÙ]Oˆİ[OHÚY‰Ô™
L
_IHØÚOšYİ\™O‰ÙK˜Ú\]

_OÙšYİ\™OØ\XÛO˜Y[˜İ[Ûˆ™
J^Ü™]\›ŠK\›‰LOL	‰™K[RŒØ[X™K™İ[™[RŒØİ[™[X˜[X
OOX[XØ[HÛZ]ØÚ0ïÜÙ[[™Ù\ˆšY\˜˜]XÚ]\Ë˜˜İ[™[HXÛ[[Xœ™][™œš[[œ˜[™˜Y[˜İ[ÛˆY

^Û]O\\™›Ü›X[˜ÙK››İÊ
ILMÍÌÜ™]\›ˆKSX]˜XœÊKLJ_Y[˜İ[Ûˆ
J^Û]SX]œ›İ[™
JNÜ™]\›˜	İLØ
Ø˜IİXY[˜İ[Ûˆ™
KŠ^Ü™]\›ˆX]›X^
X]›Z[Š‹JJ_Y[˜İ[Ûˆ™

^ÚYŠØØ[İÜ˜YÙK™Ù]][J]JI‰›ØØ[İÜ˜YÙK™Ù]][JJJ\™]\›Û]O[ØØ[İÜ˜YÙK™Ù]][JJK[ØØ[İÜ˜YÙK™Ù]][JJNÙI‰›ØØ[İÜ˜YÙKœÙ]][J]KJK	‰›ØØ[İÜ˜YÙKœÙ]][JK
_Y[˜İ[Ûˆ™

^Û]O[ØØ[İÜ˜YÙK™Ù]][J]JK[ØØ[İÜ˜YÙK™Ù]][JJNÙI‰›ØØ[İÜ˜YÙKœÙ]][JKJK	‰›ØØ[İÜ˜YÙKœÙ]][JK
KØØ][Û‹œ™[ØY

_Y[˜İ[Ûˆ™

^Û]OYØİ[Y[™Ù][[Y[RY
Ü[‹]ÙYZÙ[™X\˜Ø
NÚYŠYJ\™]\›Û]UËœÛ˜\Úİ

KYKœ]Y\TÙ[XİÜŠ˜
NÛ‰‰Š‹^ÛÛ[]œ]Y\İİYÙOOOXœšY^K[Û[\XYØ”˜œ]Y\İİYÙKœİ\ÕÚ]
Ø]\™^X
_œ]Y\İİYÙOOOXØZÙK[X\ÛØĞXœ]Y\İİYÙOOOXÙXÜ™][Z[[Û˜Z\™XØÓXœ]Y\İİYÙOOOXX\›KY]šXİ[Û˜ØS‘X˜
KK˜Û\ÜÓ\İÙÙÛJ\™Ù[ØœšY^K[Û[\XYØ]\™^KXÛÛ\Z[ØZÙK[X\ÛØ]\™^KYX˜]XØ]\™^KXœ˜]ÛÙXÜ™][Z[[Û˜Z\™XX\›KY]šXİ[Û˜Kš[˜ÛY\Êœ]Y\İİYÙJJ_Y[˜İ[Ûˆ

^İÚ[™İË˜Y]™[\İ[™\ŠÙ^YİÛ˜OOÈV]J
_ËœÛ˜\Úİ

Kœ]Y\İİYÙHOOXØ]\™^KXœ˜]Û

KšÙ^OOOXKšÙ^OOOX[\˜
I‰ŠKœ™]™[Y˜][

KÙ
[˜Ú
JKKšÙ^OOOXÚY	‰ŠKœ™]™[Y˜][

KÙ
›ØÚØ
JKKšÙ^KÓØØ[SİÙ\Ø\ÙJX
OOOXX	‰ŠKœ™]™[Y˜][

KÙ
X\Û
JJ_J_Y[˜İ[ÛˆY

^Û™]ÈT“ÙX\˜Ú\˜[\ÊØØ][Û‹œÙX\˜Ú
K™Ù]
Û[ÚÙX
OOOXX	‰ŠÚ[™İË—×ÛÕÙYZÙ[™\˜ÑXYÏ^ÛÜ[Š
^Ü]J
_KÚİÔÛÛ™Ê
^Ò™
ÙYZÙ[™X\˜Ë[[Ù[
KšY[HLKØİ[Y[˜›ÙK˜Û\ÜÓ\İ˜Y
Ø[\ZYÛ‹[[Ù[[Ü[˜
KY
TÕÛÛÙYHYšXXYKÛÜÙXØÚYpçÙ[˜
_KÚİĞœ˜]Û

^ÕËœÙ]İYÙJØ]\™^KXœ˜]Û
KOZ
ËœÛ˜\Úİ

JK]J
_KÚİÔÙXÜ™]

^ÕË\]UÙYZÙ[™\˜ÊOOÙKœÙXÜ™]Z[[Û˜Z\™K[›ØÚÙYHLKœÙXÜ™]Z[[Û˜Z\™Kœİ\YHLKœÙXÜ™]Z[[Û˜Z\™Kœ›İ[™LKKœÙXÜ™]Z[[Û˜Z\™K›Z[[Û˜Z\™RYXX\ÛJKËœÙ]İYÙJÙXÜ™][Z[[Û˜Z\™X
K]J
_KÛÜÙJ
^ÒJ
_KÛ˜\Úİ

^Ü™]\›ˆËœÛ˜\Úİ

KÙYZÙ[™\˜ß_J_Y[˜İ[ÛˆÙ
K‹Š^Ò™
ÙYZÙ[™X\˜Ë[[Ù[
KšY[HLKØİ[Y[˜›ÙK˜Û\ÜÓ\İ˜Y
Ø[\ZYÛ‹[[Ù[[Ü[˜ÙYZÙ[™X\˜Ë[Ü[˜
K™
ÙYZÙ[™X\˜ËXÛÛ[
Kš[›™\’SQÙ
K‹]ˆÛ\ÜÏH˜\˜Ë[Ü[ÛœÈ‰Ü‹›X\

K
OO˜]Ûˆ]K\İ[™[Û™OH‰İHİ›Û™Ï‰ÖY
K›X™[
_OÜİ›Û™ÏØ]Û˜
Kš›Ú[Š
_OÙ]˜
K™
ÙYZÙ[™X\˜ËXÛÛ[
Kœ]Y\TÙ[XİÜ[
Ù]K\İ[™[Û™WX
K™›Ü‘XXÚ
OO™K˜Y]™[\İ[™\ŠÛXÚØ

OOœ–Ó[X™\ŠK™]\Ù]œİ[™[Û™JWOË˜Xİ[ÛŠ
JJ_Y[˜İ[ÛˆÙ
K‹Š^Ü™]\›˜XY\ˆÛ\ÜÏH˜\˜ËZXYÜ[‰ÖY
J_OÜÜ[‰ÖY

_OÚ‰ÖY
Š_OÜÚXY\XZ[ˆÛ\ÜÏH˜\˜Ë[XZ[ˆ‰ÜŸOÛXZ[˜Y[˜İ[ÛˆÙ
J^Ü™]\›˜]ˆÛ\ÜÏH˜\˜Ë\İ]È‰ÙK›X\

ÙKJOO˜]ÛX[‰ÖY
J_OÜÛX[İ›Û™Ï‰ÖY

_OÜİ›Û™ÏÙ]˜
Kš›Ú[Š
_OÙ]˜Y[˜İ[ÛˆY
J^Ü™]\›˜ÛÛ\ÜÏH˜\˜Ë\İ\È‰ÙK›X\
OO˜O‰ÖY
J_OÛO˜
Kš›Ú[Š
_OÛÛ˜Y[˜İ[Ûˆ™
J^Û]YØİ[Y[™Ù][[Y[RY
JNÚYŠ]
]›İÈ\œ›ÜŠZ\ÜÚ[™ÈÙYZÙ[™\˜È[[Y[ˆ	Ù_X
NÜ™]\›ˆY[˜İ[ÛˆY
J^Ü™]\›ˆİš[™ÊJKœ™\XÙJÖÉ‰È—KÙËOOŠÈ‰ˆ˜	˜[\Ø˜	›Øˆ˜	™İØ‰È˜	ˆÌÎNØ	È‰Î˜	œ][İØJVÙWOÏÙJ_]˜\ˆX[\ËX›]YKXYšXK[Ë[XZ[‹]ŒX™[™]ÈÛ\ÜŞÙÙ]][J
^Ü™]\›ˆØØ[İÜ˜YÙK™Ù]][J
_\Ù]][JK
^ÛØØ[İÜ˜YÙKœÙ]][J
_\™[[İ™R][J
^ÛØØ[İÜ˜YÙKœ™[[İ™R][J
__KY[™]ÈÜŠ™
K	[ØØ[İÜ˜YÙK™Ù]][J
OÏØYIHLNÙ[˜İ[Ûˆ™ŠOHL
^Û][ØØ[İÜ˜YÙK™Ù]][J
OÏØÚYŠOOI
\™]\›Û][™]ÈÜŠ™
KTYÚYŠ‹œİ]O[‹œİ]K	]J^Û]OTYœÛ˜\Úİ

NÜ‹›\İ[™\œË™›Ü‘XXÚ
O
JJ__Y[˜İ[Ûˆ™Š
^Ü™]\›ˆ™ŠLJKË˜]YÛY[Û˜\Úİ
YœÛ˜\Úİ

J_RJÜİÜ™N”YÙ]Û˜\Úİœ™‹İ\Z[šYØ[YN™OOÚ[™İË™\Ü]Ú]™[
™]Èİ\İÛQ]™[
ËXØ[\ZYÛ‹\İ\[Z[šYØ[YXÙ]Z[™_JJK[š[X]NŠK
OOÚ[™İË™\Ü]Ú]™[
™]Èİ\İÛQ]™[
ËXØ[\ZYÛ‹X[š[X][Û˜Ù]Z[ÚY™K[š[X][Û_JJK™[™\’YŠ
OOÚ[™İË™\Ü]Ú]™[
™]Èİ\İÛQ]™[
ËXØ[\ZYÛ‹Y^\›˜[\™Yœ™\Ú
J_JKÚ[™İË˜Y]™[\İ[™\ŠËXØ[\ZYÛ‹[Z[šYØ[YK[İ]ÛÛYX
OOÛ™ŠLJNÛ]UËœÛ˜\Úİ

K]œ]Y\İİYÙOOOXœšY^K[Û[\XY	‰ÙYZÙ[™\˜Ë›Û[\XY˜İ\œ™[OOYK™]Z[šYÕ]JK™]Z[
K	[ØØ[İÜ˜YÙK™Ù]][J
OÏØ‰‰ŠHLÚ[™İËœÙ][Y[İ]


OOÛ]OYØİ[Y[™Ù][[Y[RY
Z[šYØ[YK[[Ù[
KYØİ[Y[™Ù][[Y[RY
ÙYZÙ[™X\˜Ë[[Ù[
NÙI‰ˆYKšY[‰‰	‰ŠšY[HL
_KÍ
J_JJKÚ[™İË˜Y]™[\İ[™\ŠËXØ[\ZYÛ‹[Z[šYØ[YKXÛÜÙY

OOÛ]OUËœÛ˜\Úİ

NÙKœ]Y\İİYÙOOOXœšY^K[Û[\XY	‰ŠKÙYZÙ[™\˜Ë›Û[\XY˜İ\œ™[	‰ŠËœÙ]Û[\XYİ\œ™[

KHL
K‰‰ŠHLKÚ[™İËœÙ][Y[İ]


OO™Øİ[Y[™Ù][[Y[RY
Ü[‹]ÙYZÙ[™X\˜Ø
OË˜ÛXÚÊ
K
JJ_JKÚ[™İËœÙ][\˜[


OO›™ŠL
KL
KÚ[™İË˜Y]™[\İ[™\ŠÛXÚØOOÛ]YK\™Ù]Ë˜ÛÜÙ\İËŠÛÜ[‹]ÙYZÙ[™X\˜ËİÙYZÙ[™X\˜ËXÛÜÙKÙ]KX\˜ËXXİ[ÛH˜ÛÜÙH—X
Nİ	‰ŠšYOOXÜ[‹]ÙYZÙ[™X\˜Ø	‰ŠY[ØØ[İÜ˜YÙK™Ù]][J
OÏØ
K
šYOOXÙYZÙ[™X\˜ËXÛÜÙX™Ù]]šX]J]KX\˜ËXXİ[Û˜
OOOXÛÜÙX
I‰ŠØØ[İÜ˜YÙK™Ù]][J
OÏØ
HOOYY‰‰Ú[™İËœÙ][Y[İ]


OO›ØØ][Û‹œ™[ØY

K
J_KL
NÙ[˜İ[ÛˆYŠK
^Ü™]\›–ÛÙŠ
KÙŠ
KÙŠ
KŠ
KYŠ
KŠ
K™Š
KŠ
KYŠ
W_Y[˜İ[ÛˆÙŠJ^Û]YKÙYZÙ[™\˜ÎÜ™]\›ˆŠÙYZÙ[™X\˜Ë[İ™\šY]ØÛØÚ[™[™›ÙÙ[˜œ™Z]YËSÛ[\XYH8¡¤ˆØ[\İYÙ[ØÚZY[™ØÛ[\XYH˜XÚ0é›H°é[][™ÈX\Û˜]\İØ[\ˆÙXÜ™]Z[[Û°é˜

OO™ÙŠ‘T’Ó°ç•HUQTÕ‘RRX\ˆ™]YHÛØÚ[™[™›ÙÙ[˜Z[š\ÜY[™\İ[]KYÙ[Ú[ÜË™^šYZ[™Ù[ˆ[™Z™Z]Ù\™[ˆ›Ûˆœ™Z]YÈš\È[HØ[\İYÈÙZ]\™Ù\™ZXÚ˜™ŠÖØÛ[\XYX›Û[\XY˜ÛÛ\]YØ	İ›Û[\XYœÚ[ßH[šİX˜Ù™™[˜KØ˜XÚ0é›X	İ›šYÚ›Ú\Ù_KÌLKØ›ZX™\™XÚœØ]\™^K˜œ˜]ÛÛÛØ\šğé\œØ]\™^K™X\›Q[™[™ÏØ™\›Ü™[˜˜Ù™™[˜KØÙXÜ™]Z[[Û°é˜œÙXÜ™]Z[[Û˜Z\™K˜ÛÛ\]YØ™Y[™]œÙXÜ™]Z[[Û˜Z\™K[›ØÚÙYØœ™ZYÙ\ØÚ[]˜Ù\Ü\œWJJ×ÙŠÖØX›]Y˜™ŠØœ™Z]YÈXˆNŒZˆš[šÜÜY[SÛ[\XYK˜˜XÚ™ZY\ˆ™\™XÚ™][ˆ[™ğïYÙ[ˆ˜XÚ0é›K˜Ø[\İYÈŒZˆİ[™[H›Ü™\YH°é[][™Ë˜[›H[™™[^YY™\›ˆ[\œØÚYYXÚH™]ÙZ\ÙK˜[™°ê\ÈXœØÚYYÛYY°ïHX\ÛÈÙXÚÜ]Y\İ˜X\Û™\°é™\\Úİ\ÜÚ[Ûˆ[™‹YÙYÙ[‹L‹Q˜]\İØ[\‹˜ÚYYÈØÚ[]›ZX™KSYY[™ÙXÜ™]Z[[Û°éˆœ™ZK˜šYY\›YÙHÙ]\ÈXÚHœ°ïHÜY[[™K˜JWKØš[˜[™\šÛ°ï[™ØŠ\ÈÛÛ›YÜÙš[˜[HØ[›ˆ\œİÙpí™™›™]Ù\™[‹Ù[›ˆ\ˆØ[\İYÜÚØ[\ˆÙ]ÛÛ›™[ˆ[™ÙXÜ™]Z[[Û°éˆ™Y[™]İ\™Kˆ™ZHZİ]š]0é[ˆ[™›Û›H›ZX™[ˆ\ğé›XÚ\™›Ü™\›XÚ˜
WKØÛÙ\]Y[[˜ÙŠØÜ˜ËÛË[XZ[‹ØØ[\ZYÛ‹İÙYZÙ[™\˜ËØÜ˜ËÛË[XZ[‹ØØ[\ZYÛ‹İÙYZÙ[™\˜Ó[Ù[ØÜ˜ËÛË[XZ[‹ØØ[\ZYÛ‹ÛY]TİÜ™KØJWWJJKœØ]\™^K˜œ˜]ÛÛÛØ‘TÕS‘S˜œØ]\™^K™X\›Q[™[™ÏØS‘X˜RÕU˜
_Y[˜İ[ÛˆÙŠJ^Û]YKÙYZÙ[™\˜Ë›Û[\XYSØš™Xİ™[šY\Ê™\ØÚ\[™\ÊK›X\

ÙKJOO–ÑYŠJKÙŠ˜][\Y
KÙŠœİXØÙ\ÜÊKœ]X[]Kİš[™ÊœÚ[ÊWJNÜ™]\›ˆŠÙYZÙ[™X\˜Ë[Û[\XYœ™Z]YËSÛ[\XYX	İœÚ[ßH[šİX›\İ\™Y\ˆÛ™È›[šŞX˜[[šİH˜XÚ™ZY\ˆYÙ[

OO™ÙŠ”‘RUQØš[šÜÜY[SÛ[\XYX™ZH™\İZ[™HZ[š\ÜY[HÙ\™[ˆ[È™\˜š[™XÚH]Y\İ\Şš\[™[ˆÜ˜Ú\İšY\Ú™HZ™HZYÙ[XÚHYXÚ[šZÈH\^šY\™[‹˜ÙŠÖØ\Şš\[™[˜YŠØ\Şš\[˜™\œİXÚÚYYØ]X[]0é[šİXKŠWKØ[šİXYŠØ\™ÙX›š\ØÛ[\X\[šİXKÖØ™ZØÚYØKØÚ[İ\ØÚ\ˆÚYYØ˜KØÛÛY\ˆÚYYØØKØ\™™Zİ\ˆÚYYØXWJWKØ˜XÚ™ZY\˜™ŠØZYÈØÚY™[ˆ™YØ]]™\ˆ0é›X™Z]˜YËğï™H›ZXZ\ˆ\š[[‹˜›ØÚZ[™H[™Nˆ[ÛÚÛ›\ÙKÚ[ÜÈ[™0é›HİZYÙ[‹˜›ÛH˜XÚ™ZY\ˆİ0éšÜİ\ˆ0é›X™Z]˜YË0í˜Úİ\ˆYÙ[[™0é\İ\ˆØ[\İYË˜JWKØÙ\Ø[]Ù\Š™ZHXœØÚ\ÜÈÚXYHÛ[\XYH™\İHÛØÚ[™[™[šİH\ÈYHÛ[\X\[šİKˆ›Ü›X[HZ[š\ÜY[™[Ú[™Ù[ˆÙ[[ˆ\ğé›XÚ˜
WWJJK˜ÛÛ\]YØ‘T•QØ˜Ñ‘‘S˜
_Y[˜İ[ÛˆÙŠJ^Û]YKÙYZÙ[™\˜Ë›šYÚ›Ú\ÙNÜ™]\›ˆŠÙYZÙ[™X\˜Ë[›Ú\ÙX˜XÚ0é›X	İKÌL›Ü›Y[[ÛÚÛÚ[ÜÈÜ0é]]İ[™[H™]ÙZ\ÙX

OO™ÙŠT”ÒTÕS•Tˆ•TÕS‘˜XÚ0é›X\ˆÙ\™\İ[[]ÚYHÛ]Xğï™YÈİ[™[\È™\ØÚÙ\™H[™ÚYHİ\šÈİ[™[H[™[H[H˜]\İØ[\ˆÚ[™˜ÙŠ0é›HH
ÈÛ[\X\[šİpåÌ‹ˆ
È˜XÚ™ZY\ˆ
È[ÛÚÛ0åÌÍ
ÈÚ[ÜğåÌ
ÈÜ0éHZİ]š]0é[°åÎH8¢$ˆZYÙH\šÛ[™Ø
JØ™ŠØ˜XÚ™ZY\ˆ8¢$ŒLˆZYË
ÌNHZ[™H[™K
ÌÍ›ÛH\ÚØ[][Û‹˜\™ÙX›š\ÈÚ\™]Yˆ8 $ÌL™YÜ™[˜Ü0éHÛ[\XY[™\Şš\[™[ˆ\š0íš[ˆ[ˆÙ\\ğé›XÚ˜X˜][œİ\XÚÈHˆ
È0é›påÌË™Y^šY\\˜Ú›Ü˜™\™Z]]H]]Üš]0éÛX\šÙ\‹˜ÙYÛ™\šÜ˜Y[H˜]\İØ[\ˆİZYİZ]0é›H[™˜]\İİ\™™XÚË˜JJJ_Y[˜İ[ÛˆŠJ^Û]YKÙYZÙ[™\˜Ë]œØ]\™^NÜ™]\›ˆŠÙYZÙ[™X\˜Ë\Ø]\™^XXÚUZ‹T°é[][™ØŠ‹œİ\
Kİ[™[H[›H™[^[™°êHYYX\Û\Úİ\ÜÚ[Û˜

OO™ÙŠĞSTÕQÈ0­ÈŒYHXÚUZ‹T°é[][™Øİ[™[HÛÛ[][ˆ[ˆ™[Ü™Z\È[™Ú[YHÜ\HÙYÙ[ˆ\ˆ˜XÚ›ÛH]ˆÙ\™™[‹˜ÙŠÖØ™]ÙZ\ÛYÙXYŠØ[[Y[ZİY[Ú\šİ[™ØKÖØ[›XÙŠ‹™[›U\İ[[ÛJKX›Zİ[\Üİ\šËÚ[İ\ØÚØÚğéÚXÚÈ[Ù\˜]˜KØ™[^ÙŠ‹™™[^[Y[[™JKZ[][™Ù[˜]YH™Z][šYKİ0éšÜİHØXÚXÚHØ\K˜KØXœØÚYYÛYYÙŠ‹™˜\™]Ù[ÛÛ™Ô^YY
K0å™™™[XÚ\ˆXÚÈ[™œ™[YØÚ[K˜KØ˜XÚ0é›X	İ›šYÚ›Ú\Ù_KÌL\š0íšÛ]Xğï™YÚÙZ][™ÙYÛ™\š\ØÚHØ[\šÜ˜Y˜WJWKØ]Y\İØÚš]X™ŠØİ[™[\È[[X][K˜[›H[™™[^[š0íœ™[‹˜[™°ê\ÈYY›Ûİ0é™YÈXœÜY[[‹˜X\ÛÙXÚÙ[‹˜X\Û0ï™\™]YÙ[‹˜šY\ˆ\Úİ\ÜÚ[ÛœÚØ\[ˆZ[œÙ]™[‹˜˜]\İØ[\ˆÙ]Ú[›™[ˆÙ\ˆ›Ü™Z]YÈXœ™Z\Ù[‹˜JWKØÚXÚÜÚ[Š›Üˆ\ˆ™\ØÚÙ\™HÙ\™[ˆ˜\Ú\ËH[™Y]\ÜY[İ[™[ÈØ[\İYÛ[Ü™Ù[‹PÚXÚÜÚ[Ù\ÚXÚ\ˆ˜XÚZ[™\ˆšYY\›YÙHØ[›ˆÙ[˜]HY\Ù\ˆ[šİ\›™]]Ù[Y[ˆÙ\™[‹˜
WWJJK‹™X\›Q[™[™ÏØ‘T“Ô‘S˜›‹˜œ˜]ÛÛÛØÑUÓÓ“‘S˜˜RÕU˜
_Y[˜İ[ÛˆYŠJ^Û]YKÙYZÙ[™\˜ËœØ]\™^NÜ™]\›ˆŠÙYZÙ[™X\˜Ë]ØZÙXX\ÛÙXÚÙ[ˆ[™0ï™\™]YÙ[˜	İØZÙT›ÙÜ™\ÜßKÌLØXÚZ]ØY™™YH™[ØÚ0ï[ˆİ[[][™È™^šYZ[™ÈÚ[[™ÙX

OO™ÙŠPTÓÙXÚËH[™0ç™\™]Yİ[™ÜÜŞ\İ[XÙXÚÙ›ÜØÚš][™İ[[][™Èš[[ˆZ[™[ˆšY[ÛÛ™›ZİˆØÚ™[HY]Ù[ˆØÚğéÚ[ˆX\ÛÈÜ0é\™Hİ[™™\İYÚÙZ]˜ÙŠÖØÙXÚØZİ[Û™[˜YŠØZİ[Û˜ØXÚZ]İ[[][™ØKÖØZYÈY™[˜
ÌL˜
ÍKØ[™H\[˜
ÌNKØXœØÚYYÛYY
Ì8¢$ŒXKØ[›H[œÈ™[
ÌÍX8¢$KØ™[ØÚ0ï[˜
ÌÌ8¢$ŒL˜KØØY™™YX
Í˜
ÌL™\˜œ˜]XÚØY™™YXWJWKØ0ç™\™]Yİ[™ÜÜ›İ][˜YŠØ›İ]X™Y[™İ[™ËÑ›ÛÙXKÖØœ™][™ØÚYİ]HX\ÛP™^šYZ[™ÈÙ\ˆÙ]ÛÛ›™[™\ÈÛÛ[H[œÈØÚˆ™^šYZ[™ÈİZYİ˜KØYÛØİ]Hİ[[][™ÈÙ\ˆœ˜]XÚ˜\™H™^šYZ[™Ë˜KØ\˜]\Ù›Ü™\[™Ø\™›ÛİÚXÚ\‹ÚXÚ[ÜÈ[™İ\Y[™Ë˜KØ›İ˜[Ø\˜[Y\ÛÜİ]™^šYZ[™Ëİ[[][™È[™ğï™K˜WJWKØØ[\™Y™™ZİŠX\ÛÈİ\R[™Ü˜YÙ\™[ˆ]\ÈÙXÚÜİ[[][™È[™™^šYZ[™È™\™XÚ™]ˆYH0ç™\™]Yİ[™ÜÜ›İ]HØ[›ˆ\ğé›XÚHİ\Y[™ÈÙX™[‹˜
WWJJK›X\ÛÛÛš[˜ÙYØ0ç‘T–‘UQÕ›X\Û]ØZÙOØĞPÒ˜ĞÒ0á•
_Y[˜İ[ÛˆŠJ^Û]YKÙYZÙ[™\˜ËœØ]\™^NÜ™]\›ˆŠÙYZÙ[™X\˜ËYX˜]X]H\Úİ\ÜÚ[Û˜	İ™X˜]T™\Üİ\™_KÌLXÚØ™[^[›HÛÛ™ÈYÛÈÙYØšY\ˆØÚÙÚZÈÜ›İÙX˜]X

OO™ÙŠTÒÕTÔÒSÓ˜šY\ˆØ\[ˆ›Üˆ[H˜]\İØ[\˜YH\Úİ\ÜÚ[Ûˆ™\š[™\[ˆ˜]\İØ[\ˆšXÚˆÚYH™\°é™\İ\RÙYÛ™\šÜ˜YX\ÛÈÜ˜Y[™X›Zİ[K˜™ŠÖØ˜]\İİ\™™XÚØ	İ™X˜]T™\Üİ\™_KÌLKØX›Zİ[XŠ™X˜]PÜ›İÙ
WKØ[™[˜	İ™X˜]U\›œßKÍKØ™\Ù[™]™X˜]U\ÙYš›Ú[Š0­È
_šXÚØWJJ×ÙŠÖØØ\[˜YŠØØ\XÙ\›Ú\šİ[™ØKÖØ™[^V™Z][šYX8¢$ŒNHXÚÈ›Ü˜™\™Z]]ÛÛœİ8¢$Ë˜KØ[›KQÙYÙ[™\œİ[[™Ø8¢$Kø¢$ŒÈXÚË
ÌLÈX›Zİ[K˜KØÒKPXœØÚYYÛYY8¢$ŒLÈXÚÎÈ™ZHÙZˆÚ[H0é›H\ˆ8¢$ÎÈ
ÌLHX›Zİ[K˜KØİ[™[\ÈYÛØ8¢$ŒMÈZ]YÛËSX\šÙ\‹ÛÛœİ8¢$K˜KØÙYØšY\›ÙÚZØ8¢$ŒMHZ]š[™[™ËÛÛœİ8¢$‹˜KØX\ÛÈØÚÙÚZØ8¢$ŒŒHZ]ÛÛ[KX[œËSØÚTÚYYËÛÛœİ8¢$ŒLË˜WJWKØİ\›ÜZ[ÙŠX˜][›ÜZ[H
L8¢$‘XÚÊpåÌ
ÈX›Zİ[påÌNÈ™YÜ™[8 $Ìˆ™Y^šY\İ[™[\È[™[\Èİ\R˜
WWJJJ_Y[˜İ[Ûˆ™ŠJ^Û]YKÙYZÙ[™\˜ËœØ]\™^NÜ™]\›ˆŠÙYZÙ[™X\˜ËXœ˜]Û˜]\İ™XÚ[ˆ\ˆØÚ˜[šÙX˜œ˜]ÛÛÛØÙ]ÛÛ›™[˜™X\›Q[™[™ÏØ™\›Ü™[˜˜	İ˜œ˜]Û][\ßH™\œİXÚ
JX˜]\İØ[\ˆİ[™™\İYÚÙZ]›ØÚÙ[ˆ]\İÙZXÚ[ˆX\Û[›™[

OO™ÙŠ‹QÑQÑS‹L˜˜]\İØ[\˜\ˆØ[\ˆ\İ0ï™\™ZXÚ™][™\˜™Z]]Z]İ[™™\İYÚÙZ]İ]™X[\İ\ØÚ\ˆ™\›][™Ë˜ÙŠÖØİ]Y\[™ØYŠØZİ[Û˜Z[™ØX™XÚ\šİ[™ØKÖØØÚYÙ[˜]ÛˆÈY\\İX[Z[™È[ˆ\ˆZ]H™\\œØXÚˆİ]NKÌLˆØÚY[‹˜KØ›ØÚÙ[˜]ÛˆÈÚY°éÚİ\ˆØÚY[ˆ0åÌÌ‹˜KØ]\İÙZXÚ[˜]Û˜İ]\È[Z[™È™\š[™\ØÚY[È\™™Zİ\È[Z[™È™]0éX˜KØX\ÛU[›™[]ÛˆÈXXˆÈY[™ÎˆšY™™ZYH[™[\˜œšXÚÙYÙ[YË˜WJWKØÙYÛ™\˜™ŠØİ[™[NˆÛ[[Xœ™]TØÚ[Kœš[[œ˜[™Qš[K[™\ØÚ[‹RZÙ[‹•S•Tˆ“ÓHU‹˜[NˆØÚ0ïÜÙ[[™TØÚÚ[™Ù\‹šY\˜˜]XÚT˜[[YKİ[\[S˜XÚÙ[šÛ]ØÚ\‹ÔÔ•Ñ”‘US‘˜JWKØ]\ÙØ[™Ø™ŠØÚYYÎˆ
ÌÍHÛØÚ[™[™[šİK›ZX™\™XÚİ\šÙHX\ÛP™^šYZ[™È[™ÙXÜ™]Z[[Û°é‹˜šYY\›YÙNˆX\›Q]šXİ[Û‘[™[™ËXÚ\È›Ü™Z]YÙ\È[™H[™XœØÚYYÛYY˜JWWJJJ_Y[˜İ[ÛˆŠJ^Û]YKÙYZÙ[™\˜ËœØ]\™^NÜ™]\›ˆŠÙYZÙ[™X\˜Ë\ÛÛ™ÜØ[™°ê\ÈÒKSYY\˜	İ™˜\™]Ù[ÛÛ™Ô^YYØXœØÚYYÙZ0íœ˜XœØÚYYÙ™™[˜H0­È	İšXİÜTÛÛ™Ô^YYØ›ZX™HÙZ0íœ˜›ZX™HÙ™™[˜XÛÛÙYHYšXHYY\šXÜÈÚÜ\È[™™X

OO™ÙŠUTÒRĞSTĞÒHÕÔ–XÙZH™\İHYY\˜™ZYH^HÚ[™›Ûİ0é™YÈÙ™›[™HÙ\ÜZXÚ\[™Ù\™[ˆ[ˆ[ˆ\ÜÙ[™[ˆİÜ\[šİ[ˆ[™Ù^™ZYİ˜ÙŠÖØXœØÚYYİ™\œÚ[Û˜]Z[Ïİ[[X\O•›Ûİ0é™YÙ[ˆ^[™ZYÙ[Üİ[[X\O™HÛ\ÜÏH˜ÛÙ^\ÛÛ™È‰ÓÙŠYJ_OÜ™OÙ]Z[Ï˜KØ›ZX™]™\œÚ[Û˜]Z[Ïİ[[X\O•›Ûİ0é™YÙ[ˆ^[™ZYÙ[Üİ[[X\O™HÛ\ÜÏH˜ÛÙ^\ÛÛ™È‰ÓÙŠ™J_OÜ™OÙ]Z[Ï˜KØXÚšZØŠÙZ[™H^\›™HÒKHÙ\ˆ]Y[İ™\˜š[™[™ËˆZ[™HÜ0é\™H]Y[Ù]ZHØ[›ˆ[ˆY\Ù[™[ˆİÜKRQÈ[™ÙX[™[ˆÙ\™[‹˜
WWJJJ_Y[˜İ[ÛˆYŠJ^Û]YKÙYZÙ[™\˜ËœÙXÜ™]Z[[Û˜Z\™NÜ™]\›ˆŠÙYZÙ[™X\˜Ë\ÙXÜ™]ÙXÜ™]Z[[Û°é˜˜ÛÛ\]YØ™Y[™]0­È	İÚ[›™\ŸX˜	İœ›İ[™KÍÛÛ[™\ˆÜ›ÛšÛÜšÙ[ˆY[ˆ›ÛHXØİ\ÙH[[Z[˜][ÛˆXZ[ˆš^™X

OO™ÙŠĞSTÕQÔÔÔQSÙXÜ™]Z[[Û°éˆ8 $È\ˆÛÛ[™HÜ›ÛšÛÜšÙ[˜YHœ›İÜÙ\™˜\Üİ[™È0ï™\›š[[]\Èœ°ï\™HÙ[YZ[œØ[YHÛÛ™\[™™Y^šY\\È]YˆšY\ˆ\Ø˜\™HYZİ[ÛœÜ[™[‹˜ÙŠÖØ™\˜š[™XÚH™YÙ[˜™ŠØğí›ˆZİ]™HšYİ\™[È[™°êH\İÜY[Z]\‹˜šY\ˆÙZZ[YHXœİ[[][™Ù[ˆZ]K‹È[™[šİ[‹˜[šİ\İ[™[™šXÚYÚÙZ]›ZX™[ˆš\È\ˆ]Y›0íœİ[™ÈÙZZ[K˜™YH™\ØÚ[YİH\œÛÛˆØÚZY]]\È[HÙ]Ú[›œÛÛ]\È8 $È]XÚÙ[›ˆÚYH[œØÚ[YÈ\İ˜]\ÙÙ\ØÚYY[™HšYİ\™[ˆğí››™[ˆ[ˆ]\™Z\ÈšXÚYZˆÙ]Ú[›™[‹˜\ÈÚX\ˆZ[™[ˆ]\Ù]Ú[›‹ÙZ[™H›ÜİHÙ\ˆ™X™[œ™Z\ÙK˜Z\ÜÚ[Û™[ˆ[™ÛÛšÜ™]H›ÜZ[H\ÈZ[[Û°éœÈ›ZX™[ˆXœÚXÚXÚ™\˜›Ü™Ù[‹˜JWKØœ›İÜÙ\˜X›]Y˜™ŠØ›È[™H™ZH[™\™ZİH™[Ø˜XÚ[™Ù[‹˜ÙZH™Yœ˜Yİ[™Ù[‹˜Z[™H™\ØÚ[Yİ[™È™Y[™]YH[™K˜˜XÚ[™HšY\ˆÙ\™[ˆ›ÛH[™[šİH]Y™ÙYXÚİ˜JWKØZİY[\ˆİ[™YŠØ™[Ù\KÖØ[™Xİš[™Êœ›İ[™
WKØZYÙ[™H[šİXİš[™Êœ^Y\”ØÛÜ™JWKØš]˜[[œ[šİXİš[™Êœš]˜[ØÛÜ™JWKØ]\ÙÙ\ØÚYY[˜™[[Z[˜]Yš›Ú[Š0­È
_šY[X[™KØÙ]Ú[›™\˜Ú[›™\ŸÙ™™[˜WJWKØ\ÚYÛ™Ü[™YÙXŠ™\œİXÚİHY[]0é\Ş[[Y]š\ØÚH[™›Ü›X][Û‹\Úİ\ÜÚ[Ûˆ[™ÙZZ[YHXœİ[[][™Èš[[ˆYHİZİ\‹ˆYHZYÙ[™H]\ÜØÚZY[™ÜËH[™[šİZYYH›ZXXpçÙÙX›XÚ˜
WWJJK˜ÛÛ\]YØ‘T•QØ[›ØÚÙYØ”‘RX˜ÑTÔT”•
_Y[˜İ[ÛˆŠK‹‹KJ^Ü™]\›ÚY™KØ]YÛÜN˜ÙYZÙ[™]NİX]N›‹˜YÙN˜KÙX\˜Ú˜	İH	ÛŸH	ÜŸXÓØØ[SİÙ\Ø\ÙJX
K™[™\š__Y[˜İ[ÛˆÙŠK‹Š^Ü™]\›˜\XÛHÛ\ÜÏH˜ÛÙ^\YÙHXY\ˆÛ\ÜÏH˜ÛÙ^\YÙKZXYÜ[‰ÓÙŠJ_OÜÜ[‰ÓÙŠ
_OÚ‰ÓÙŠŠ_OÜÚXY\‰ÜŸOØ\XÛO˜Y[˜İ[ÛˆÙŠJ^Ü™]\›ˆK›X\

ÙKJOO˜ÙXİ[ÛˆÛ\ÜÏH˜ÛÙ^\ÙXİ[ÛˆÏ‰ÓÙŠJ_OÚÏ‰İOÜÙXİ[Û˜
Kš›Ú[Š
_Y[˜İ[Ûˆ™ŠJ^Ü™]\›˜]ˆÛ\ÜÏH˜ÛÙ^\İ]YÜšY‰ÙK›X\

ÙKJOO˜]ÛX[‰ÓÙŠJ_OÜÛX[İ›Û™Ï‰ÓÙŠ
_OÜİ›Û™ÏÙ]˜
Kš›Ú[Š
_OÙ]˜Y[˜İ[ÛˆYŠK
^Ü™]\›˜]ˆÛ\ÜÏH˜ÛÙ^]X›K]Ü˜\X›OXY‰ÙK›X\
OO˜‰ÓÙŠJ_Oİ˜
Kš›Ú[Š
_OİİXY›ÙO‰İ›X\
OO˜‰ÙK›X\
OO˜‰ÓÙŠJ_Oİ˜
Kš›Ú[Š
_Oİ˜
Kš›Ú[Š
_Oİ›ÙOİX›OÙ]˜Y[˜İ[Ûˆ™ŠJ^Ü™]\›˜[‰ÙK›X\
OO˜O‰ÓÙŠJ_OÛO˜
Kš›Ú[Š
_Oİ[˜Y[˜İ[ÛˆŠJ^Ü™]\›˜‰ÓÙŠJ_OÜ˜Y[˜İ[ÛˆÙŠJ^Ü™]\›˜]ˆÛ\ÜÏH˜ÛÙ^Y›Ü›][H‰ÓÙŠJ_OÙ]˜Y[˜İ[ÛˆÙŠJ^Ü™]\›˜]ˆÛ\ÜÏH˜ÛÙ^\Ûİ\˜Ù\È‰ÙK›X\
OO˜ÛÙO‰ÓÙŠJ_OØÛÙO˜
Kš›Ú[Š
_OÙ]˜Y[˜İ[ÛˆÙŠJ^Ü™]\›ˆOØ˜X˜™Z[˜Y[˜İ[ÛˆŠJ^Ü™]\›˜	ÙOLØ
Ø˜IÓX]œ›İ[™
J_XY[˜İ[ÛˆYŠJ^Ü™]\›Ù›\İ\˜›\İ\™Y\”Û™Î˜™Y\ˆÛ™Ø›[šŞX˜[˜›[šŞX˜[VÙWOÏÙ_Y[˜İ[ÛˆŠJ^Ü™]\›ÙÜ›X[˜Ø\]ÛÛ\Z[˜İ[™[H[İ\İ[[ÛšY\Î˜™]YÙ[˜ÛÛ™Î˜YYØZÙN˜X\ÛÙXÚÙ[˜ÛÛš[˜ÙN˜X\Û0ï™\™]YÙ[˜X˜]N˜\Úİ\ÜÚ[Û˜œ˜]Û˜˜]\İØ[\˜ÛÛ˜›ZX™\™XÚ]šXİY˜˜]\İİ\™˜VÙWOÏÙ_Y[˜İ[ÛˆÙŠJ^Ü™]\›ˆİš[™ÊJKœ™\XÙJÖÉ‰È—KÙËOOŠÈ‰ˆ˜	˜[\Ø˜	›Øˆ˜	™İØ‰È˜	ˆÌÎNØ	È‰Î˜	œ][İØJVÙWOÏÙJ_]˜\ˆÙX[\ÜÈÓÓPUÓSÕ‘TËPVÑTURTQĞUPÒÔÈHœ›ÛH	Ë‹‹Ë‹‹ÙØ[YKØÛÛX˜][İ™\ÉÎÂš[\ÜÈUSTËUQTÕÈHœ›ÛH	Ë‹‹Ë‹‹ÙØ[YKØÛÛ[	ÎÂš[\ÜÈ”’QS‘Ô“Ñ’STË”’QS‘ÕPSWÓQSP‘T”ËXİ]™UX[TŞ[™\™ÚY\ÈHœ›ÛH	Ë‹‹Ë‹‹ÙØ[YKÙœšY[™›Üİ\‰ÎÂš[\ÜÈ“ÓPSÑWÔ“Ñ’STË›\Ú[˜ÙHHœ›ÛH	Ë‹‹Ë‹‹ÙØ[YKÜÛØÚX[Ş\İ[IÎÂš[\ÜÈØ[YTİÜ™KÕÔQÑWÒÑVHHœ›ÛH	Ë‹‹Ë‹‹ÙØ[YKÜİ]KÑØ[YTİÜ™IÎÂš[\ÜÈXİ]™Tİ]\Ù\Ëİ]\Ó[ÙYšY\œÈHœ›ÛH	Ë‹‹Ë‹‹ÙØ[YKÜİ]\ÔŞ\İ[IÎÂš[\ÜÈSÒS•TPÕSÓ”ËĞSTRQÓ—ĞÒTPÕT—Ğ–WÒQHœ›ÛH	Ë‹ØÛÛ[	ÎÂš[\ÜÈĞSTRQÓ—ÓÔÓ‘S•ÈHœ›ÛH	Ë‹Ø˜]Q[™Ú[™IÎÂš[\ÜÈÒTPÕT—Õ“ÒPÑTÈHœ›ÛH	Ë‹ØÚ\˜Xİ\•›ÚXÙ\ÉÎÂš[\ÜÈ]]Üš]SX[š\[][Û”ØÛÜ™K[œİ[]]Üš]Sİ™\š][Hœ›ÛH	Ë‹Ø]]Üš]Sİ™\š][	ÎÂš[\ÜÈØ[\ZYÛ“Y]HHœ›ÛH	Ë‹ÛY]TİÜ™IÎÂš[\ÜÈS‘PÑÕTËÓÓTS’SÓ—ĞPÕSÓ”ËÑQRÑS‘ÔS’ÔËœ˜[˜ÚX™[Hœ›ÛH	Ë‹Ü›ÙÜ™\ÜÚ[Û‰ÎÂš[\Ü	Ë‹ØÛÙ^˜ÜÜÉÎÂ‚š[œİ[]]Üš]Sİ™\š][

NÂ‚˜ÛÛœİĞUQÓÔ’QTÈHÂˆÉÛİ™\šY]ÉË	ø¥ã‰Ë	ÑÜ[™Ş\İ[IË	ÔÜY[X›]Y‹İ]Y\[™ËÜZXÚ\[™È[™Ú\˜Zİ\™\œİ[[™Ë‰×KˆÉØÚ\˜Xİ\œÉË	ø¦gÉË	ĞÚ\˜Zİ\™IË	Ô\œğí››XÚÙZ][‹X[ÙÛÙÚZË™^šYZ[™Ù[‹›Û[ˆ[™ZİY[H\İ0é™K‰×KˆÉØ]XÚÜÉË	ø§)‰Ë	Ğ]XÚÙ[‰Ë	Ğ[Hœ\İ]XÚÙ[ˆZ]^Zİ[ˆÙ\[‹œ™Z\ØÚ[[™Ù[ˆ[™ÙYÛ™\Ú\šİ[™Ë‰×KˆÉØÛÛX˜]	Ë	ø¦¥	Ë	ÒØ[\œŞ\İ[IË	Ô[™[˜X›]Y‹œ\İÛÛX›ÜËÙYÛ™\œ\Ù[ˆ[™İ]\İÚ\šİ[™Ù[‹‰×KˆÉÛZ[šYØ[Y\ÉË	ø¥á‰Ë	ÓZ[š\ÜY[IË	Ôİ]Y\[™Ë\ÚZËÙ\[™ÜÙ›Ü›Y[‹]X[]0éÜİY™[ˆ[™[™[‹‰×KˆÉÜİ]\ÉË	ø¥ä‰Ë	Ö\İ0é™H	ˆÙ\IË	Ğ™Y0ï™›š\ÜÙKYÙ[Ø]\‹ğï™KÚ[ÜËYˆ[™[ÛY[[K‰×KˆÉÚ][\ÉË	ø¥¨ÉË	Ò[™[\‰Ë	Ô™Z\ÙKÚ\šİ[™Ù[‹Ü™[™[ˆ[™]Y\İ[šİ[Û™[ˆ[\ˆÙYÙ[œİ0é™K‰×KˆÉÜ]Y\İÉË	ø¥áÉË	Ô]Y\İÉË	ÒØ[\YÛ™[œİY™[‹šY[K›Ü˜]\ÜÙ][™Ù[ˆ[™š[˜[K‰×KˆÉÜ›ÙÜ™\ÜÚ[Û‰Ë	ø¥¬‰Ë	Ñ›ÜØÚš]	Ë	ÕÛØÚ[™[™°é™ÙKYZ\İ\œØÚY[‹[™ZÙİ[‹X[\È[™œ™Z\ØÚ[[™Ù[‹‰×KˆÉİÛÜ›	Ë	ø£%‰Ë	ÕÙ[	ˆÜIË	Ô™YÚ[Û™[‹[\˜Zİ[ÛœÛÜKØ\H[™™]ÙYİ[™ÜÜ™YÙ[‹‰×K—NÂ‚˜ÛÛœİQÔÈHÂˆ˜\Üˆ	Òİ[\[ÛÛZİ	Ëİ[Nˆ	Ôİ[Ñœ™[YØÚ[IËİX›Z\ÜÚ[Ûˆ	Ö\İ[[][™ËÓY\›]Y‰ËÙÚXÎˆ	ÓÙÚZÉËˆÚ]ˆ	Õ›ØÚÙ[™\ˆÚ]‰ËİX\™ˆ	Õ™\ZYYİ[™ÉËš[šÎˆ	ÑÙ]°éšÙ\š]X[	ËX[Nˆ	ÑÜ\IËˆÚ\›Nˆ	ĞÚ\›YKÔÜY[	ËÚ[ÜÎˆ	ĞÚ[ÜËğç™\™ZX[™ÉËŸNÂ˜ÛÛœİT“ĞPÒHÈ\İ[ˆ	ÖZ0íœ™[‰Ë›ÚÙNˆ	Ò[[Ü‰ËÚ[[™ÙNˆ	Ò\˜]\Ù›Ü™\›‰Ë[ˆ	Ò[™[‹Ô[™[‰ÈNÂ˜ÛÛœİUWÔÕUTÈHÂˆYX™\œ[\[ˆÉğç™\œ[\[	Ë	ÑÙYÛ™\ˆÚ[[ÈÙpí™™›™]È
ÍˆÙ[˜]ZYÚÙZ]°ïˆYH°éÚİH]XÚÙK‰×Kˆœ™[YØÚY[Y[ˆÉÑœ™[YØÚ0éY[‰Ë	Ôİ[P]XÚÙ[ˆ™\\œØXÚ[ˆ\ğé›XÚœ\İ‰×KˆY\›]YˆÉÓY\›]Y‰Ë	ÒÙZ[ˆÛÛ\ÈÚ]ˆ[™\İ[[][™È™\\œØXÚ[ˆ\ğé›XÚÈœ\İ‰×Kˆ[\˜œ›ØÚ[ˆÉÕ[\˜œ›ØÚ[‰Ë	ÑÙYÙ[YÈ[°éÈ™Z[HÜY[\ˆ\ğé›XÚ8¢$HÙ[˜]ZYÚÙZ]‰×KˆX™Ù\ÚXÚ\ˆÉĞX™Ù\ÚXÚ\	Ë	ÑZ[™ÙZ[™\ˆÛÛ\ˆÚ\™Z]Œˆ][\^šY\‰×Kˆ™\Ú\œˆÉÕ™\Ú\œ	Ë	ÑÙYÛ™\ˆÚ[[ÈÙpí™™›™]È
ÍˆÙ[˜]ZYÚÙZ]‰×Kˆ›Úİ\ÜÚY\ˆÉÑ›Úİ\ÜÚY\	Ë	ÑZYÙ[™HÙ[˜]ZYÚÙZ]
Î‰×Kˆš^Y\ˆÉÑš^Y\	Ë	ÑÙYÛ™\ˆÚ[[ÈÙpí™™›™]È
ÍˆÙ[˜]ZYÚÙZ]‰×KŸNÂ‚˜ÛÛœİ‘QQÈHÂˆÉÙ[™\™ŞIË	Ñ[™\™ÚYIË	ÌLİ]\œØÚ0íœ	ËÉÕ[\ˆÌˆU‰Ë	ÓšYYšYÙH[™\™ÚYH™Y^šY\™]ÙYİ[™Ë™\ZYYİ[™ËÙ[˜]ZYÚÙZ][™Ú\›YK‰Ë	ÍŒZ[][ˆZNˆ
ÍÈ[™\™ÚYK
Í]]‰×WKˆÉÚ[™Ù\‰Ë	Ò[™Ù\‰Ë	ÌØ]LÜš]\ØÚ	ËÉÕİ\œİˆ8¢$ŒÍˆ[™Ù\‹‰Ë	ĞÚ\Îˆ8¢$ŒN[™Ù\‹
Î\œİ‰Ë	ÔİZYİZ]\ˆ™Z][™\Ú[™İ™\œÛÜ™İ[™Ë‰×WKˆÉİ\œİ	Ë	Ñ\œİ	Ë	Ì™\œÛÜ™İLZYšY\	ËÉĞXˆÌˆT”Õ‰Ë	ÑÙ[˜]ZYÚÙZ]8¢$Hš\È8¢$ŒLÎÈ[™\™ÚY]™\˜œ˜]XÚİZYİ‰Ë	ÕØ\ÜÙ\ˆ8¢$ŒÌ\œİ
ÌLˆ›\ÙK‰×WKˆÉØ›Y\‰Ë	Ğ›\ÙIË	ÌY\‹L›İ˜[	ËÉÑÙ]°éšÙH\š0íš[ˆ[ˆÙ\‰Ë	ÕÚ[]Nˆ[ˆHZ[][ˆ]Yˆ‰Ë	ĞXˆ™XÚ™Z]YÈ\ˆÚ[]Nˆ
Ìˆğï™K
ÌÈ[ÛY[[K‰×WKˆÉØ[ÛÚÛ	Ë	Ğ[ÛÚÛ	Ë	Ì°ïÚ\›‹L›ÛYÙ[	ËÉÌM8 $ÌÍÈQÑSˆÜ˜Y0åÌKLÙ[˜]ZYÚÙZ]8¢$‹Ú\›YH
ÌË›\
Ì‹‰Ë	ÌÎ8 $ÍÈ‘TÓÑ‘‘SˆÜ˜Y0åÌKŒÙ[˜]ZYÚÙZ]8¢$ŒM‹™\ZYYİ[™È0åÌL‹‰Ë	ĞXˆ“ÓˆÜ˜Y0åÌKÍÙ[˜]ZYÚÙZ]8¢$ŒK™\ZYYİ[™È0åÌ‹™]ÙYİ[™È0åÌ‰Ë	ÓZ]\™\ˆYÙ[İ0éšİ\ÜÙ[™Hš]X[HÙYÙ[ˆİ[™[KÕ[NÈXˆÍˆØÚğéÚ\‹‰×WKˆÉÚYÚ™\ÜÉË	Ğœ™Z]	Ë	ÌÛ\‹LÙZˆœ™Z]	ËÉĞXˆÌ”‘RUˆ
ÌŒL\È™XZİ[Û‹8¢$HÙ[˜]ZYÚÙZ]‰Ë	ĞXˆÌÑRˆ”‘RUˆ
ÍÌ\Ë8¢$ŒLˆÙ[˜]ZYÚÙZ]™]ÙYİ[™È0åÌ‹‰Ë	ĞÚ[ÜËT›Ø™[ˆ›Ùš]Y\™[ˆXˆÌ‰×WKˆÉÚ[™Ûİ™\‰Ë	ÒØ]\‰Ë	Ìœš\ØÚLX^[X[	ËÉĞXˆˆĞUT‹‰Ë	ÓYZˆ[™\™ÚY]™\˜œ˜]XÚÈÙ[šYÙ\ˆÙ[˜]ZYÚÙZ]Ú\›YK›\[™™\ZYYİ[™Ë‰Ë	ÒØY™™YH8¢$HØ]\ÈX›]H8¢$ŒÎ‰×WKˆÉØÛİ\˜YÙIË	Ó]]	Ë	ÌLÙ[œİ™]İ\Üİ™\[œÚXÚ\	ËÉÑ\™›ÛÙH[™Ù]°éšÙHğí››™[ˆ]]\š0íš[‹‰Ë	ÔÛŞšX[H™ZØÚ0éÙH[™[XÚİ[™ÈÙ[šÙ[ˆZ‹‰Ë	Ñ›Ypçİ[ˆ\˜]\Ù›Ü™\[™Ù[ˆ\È˜\Ú\ÜŞ\İ[\ÈZ[‹‰×WK—NÂ‚˜ÛÛœİRS’WÑĞÔÈHÂˆÂˆYˆ	Ù›\İ\	Ë]Nˆ	Ñ›\İ\	ËİX]Nˆ	ÕšY\ˆ™XÚ\‹Z[ˆÙ[YZ[œØ[Y\È™\™[œŞ\İ[IËˆØš™Xİ]™Nˆ	ÕšY\ˆšYİ\™[ˆš[šÙ[ˆ[™›\[ˆ˜XÚZ[˜[™\‹™]›Üˆ\ˆÙYÛ™\ˆÙZ[™HšY\ˆİ][Û™[ˆ™Y[™]‰ËˆÛÛ›ÛÎˆÉĞRÕSÓˆ[[ˆš[šÙ[‹‰Ë	Ó˜XÚQTˆÛÙ›ÜÜÛ\ÜÙ[‹‰Ë	Ğ™XÚ\ˆ[ˆ[ˆYX[[ˆ0ç™\œİ[™šYZ[‹‰Ë	Õ›ÛH[\™[ˆ˜[™˜XÚØ™[ˆÚ\ØÚ[‹‰×Kˆ\Ù\ÎˆÉÙš[šÎˆ›0ïÜÚYÚÙZ][™™XZİ[ÛœŞ™Z]‰Ë	ÜXÙNˆ0ç™\œİ[™‰Ë	Ù›\ˆÚ\ØÚ[\[Ë‰Ë	Ù›YÚˆ›YË›İ][Û‹[™[™Ë‰×Kˆ[\ÎˆÉÑÙYÛ™\‹Û\ÈH
H
ÈÜÚ][Û°åÌÊH0åÈØÚÚY\šYÚÙZ]È™[°êH0åÌ‰Ë	ĞXˆÌ\ÈÙZ]\š[[ˆ˜XÚQTˆ™Z\‹‰Ë	Ğš\ÈÍŒ\ÈÜÛ\ÜÙ[ˆ\™™ZİH™XZİ[Û‹‰Ë	Ô]šY\[™ÜØ™\™ZXÚNÈZ]\œÈM‰Ë	Ó[™]Û\˜[ˆH
È
È]šY\[™ğåÌLˆ
ÈH\œİ\ˆ™\œİXÚ
H0íÈØÚÚY\šYÚÙZ]‰Ë	Ò™YHšYİ\ˆ]ZYÙ[™Hš[šÜ˜]KÛÛ›ÛH[™İÙY]Üİ‰×KˆØÛÜ™NˆÉÌL8¢$ˆÙYÛ™\°åÌLH8¢$ˆ™Z\°åÍÈ
È\™™ZİH›\ğåÎH
È\™™ZİH™XZİ[Û™[°åÍ
È™\İHÙ\šYpåÌË‰×Kˆ]X[]NˆÉÔ\™™Zİˆ8¢iLÈ\™™ZİH›\Ë™Z\‹8¢iLÈ\™™ZİH™XZİ[Û™[‹‰Ë	ÔÛÛYNˆÚYYÈZ]8¢iˆ™Z\›‹‰Ë	ĞÚ[İ\ØÚˆ[™\™\ˆÚYYË‰Ë	Ñ™ZØÚYÎˆÙYÛ™\ˆY\œİ‰×Kˆ™]Ø\™ÎˆÉÔÚYYÈ\›šY\˜˜[šËPÚÜˆ8 '’UÓÓÒQˆx '‰Ë	Ô\™™Zİˆ[™ZÙİH8 '[HÛZXÚ™Z]Yø '‰Ë	Õ™\°é™\[ÛÚÛ›\ÙK]]Y‹[ÛY[[H[™İY™™[™^šYZ[™Ù[‹‰×Kˆ\ÜÚ\İÎˆÖÉØ\ÜÚ\İY›\YYÙIË	Ó\œÉË	ÔİÙY]ÜİMİ]K‰×KÉØ\ÜÚ\İ]X[K\Úİ]	Ë	Ô™[°êIË	ÑÙYÛ™\ˆ0åÌ‰×WKˆÛİ\˜ÙNˆ	ÜÜ˜ËÛË[XZ[‹ØØ[\ZYÛ‹ÛZ[šYØ[Y\ÕŒ‹È0­ÈXÚÑ›\ÈÛÛ\]Q›\	ËˆKˆÂˆYˆ	Ø™Y\”Û™ÉË]Nˆ	Ğ™Y\ˆÛ™ÉËİX]Nˆ	Ñ›YØ˜Z‹š\ÚZÛÈ[™™Y[\[Û‰ËˆØš™Xİ]™Nˆ	Ö™Zˆ™XÚ\ˆ›Üˆ[HÙYÛ™\ˆXœ°é[Y[È›İ[˜ÙHØ[›ˆÙZH™XÚ\ˆ™Y™™[‹\™ˆX™\ˆX™Ù]ÙZÙ\™[‹‰ËˆÛÛ›ÛÎˆÉĞ˜[\°ïÚŞšYZ[‹‰Ë	ÓÜÛ\ÜÙ[ˆÚ\™‰Ë	ĞRÕSÓˆÙXÚÙ[T‘RÕĞ“ÕSÑK‰×Kˆ\Ù\ÎˆÉÜ™XYNˆİ\™ˆ›Ü˜™\™Z][‹‰Ë	Ù›YÚˆØÚÙ\šÜ˜Y\ØÚ[™™Y™™\‹‰Ë	Ü™Y[\[Ûˆ™Y™™\ˆ[[ˆYH]HÚ[˜ÙH[HX™[‹‰×Kˆ[\ÎˆÉÑÙYÛ™\YÈ™ZHZˆŒÌ‰Ë	ÑÙYÛ™\™Y™™\ˆHŒˆ
È
ØÚÚY\šYÚÙZ]8¢$ŒJpåÌK‰Ë	Õ™Y™™\œ˜Y]\È™Z[H\œİ[‹[˜XÚMË‰Ë	Ğ›İ[˜ÙKPXÙZˆ0åÔØÚÚY\šYÚÙZ]ÈZ]İ\ÚHL‹‰Ë	Ğ›İ[˜ÙH[™\›˜XÚpí™ÛXÚÙZ]ÙZH™XÚ\‹‰Ë	Ô™KT˜XÚÈ™ZH‹È[™H™\İ™XÚ\‹‰Ë	Ô™Y[\[ÛˆXˆÈ™Y™™\›ˆÙ\ˆZ]™[^‰×KˆØÛÜ™NˆÉÕ™Y™™\°åÌLÈ8¢$ˆ™Zİ\™°åÌÈ
È›İ[˜ÙKQÜ[0åÌL
ÈÙ\šYpåÍ
È™Y[\[Û°åÍ‹‰×Kˆ]X[]NˆÉÔ\™™ZİˆÚYYË8¢iH™Zİ\™‹8¢iLH›İ[˜ÙK‰Ë	ÔÛÛYNˆÚYYÈZ]8¢i™Zğï™™[‹‰Ë	ĞÚ[İ\ØÚˆ[™\™\ˆÚYYË‰Ë	Ñ™ZØÚYÎˆÙYÛ™\‹Ô™Y[\[Û‹‰×Kˆ™]Ø\™ÎˆÉÔÚYYÈ\›™Y\‹TÛ™ËVØ[™ÜÙY[‰Ë	Ô\™™Zİˆ[™ZÙİH8 '°ç™\ˆ˜[™x '‰Ë	Õ™\°é™\[ÛÚÛ›\ÙK]]Y‹[ÛY[[H[™İ\ÚKÑ™[^‰×Kˆ\ÜÚ\İÎˆÖÉÜ\™\‹\İ\ÚK\Û™ÉË	Ôİ\ÚIË	ÕÙ[šYÙ\ˆÙYÛ™\š\ØÚHÙ\šY[‹Ğ›İ[˜ÙKPXÙZ‹‰×KÉØ\ÜÚ\İ\Û™Ë\™Y[\[Û‰Ë	Ñ™[^	Ë	Ô™Y[\[ÛˆÚ™HÈ™Y™™\‹‰×KÉØ\ÜÚ\İ\™XÚ\Ú[Û‰Ë	ÑÜ™YÛÜ‰Ë	Ñ›YØ˜Zœ›ÙÛ›ÜÙK‰×WKˆÛİ\˜ÙNˆ	ÜÜ˜ËÛË[XZ[‹ØØ[\ZYÛ‹ÛZ[šYØ[Y\ÕŒ‹È0­ÈXÚÔÛ™ÈÈš[š\ÚÛ™ÉËˆKˆÂˆYˆ	Ù›[šŞX˜[	Ë]Nˆ	Ñ›[šŞX˜[	ËİX]Nˆ	ÕÙ\™™[‹š[šÙ[‹™][‹ÕÔ	ËˆØš™Xİ]™Nˆ	ÓZ][›\ØÚH™Y™™[‹š[šÙ[ˆ[™[ˆ\ˆ™\ZYYİ[™È›\ØÚK˜[[™[šYH™YY[™[‹‰ËˆÛÛ›ÛÎˆÉĞ˜[šYZ[‹İÙ\™™[‹‰Ë	Ó˜XÚ™Y™™\ˆRÕSÓˆ[[‹‰Ë	Ğ™ZHÕÔÛÙ›ÜÜÛ\ÜÙ[‹‰Ë	Õ™\ZYYİ[™ÜŞšY[H[\[ˆ[™RÕSÓ‹‰×Kˆ\Ù\ÎˆÉØ]XÚË]›İË‰Ë	Ø]XÚËYš[šË‰Ë	ÙY™[œÙK\[‹‰Ë	ÙY™[œÙKX˜[‰Ë	ÙY™[œÙK\™]\›‹‰×Kˆ[\ÎˆÉÖšY[™ZİÜˆ‹ÌÎ‰Ë	ÕÛ\˜[ˆH
N
ÈH[™H
ÈÍH\œİ\ˆ™\œİXÚ
H0íÈØÚÚY\šYÚÙZ]‰Ë	Õš[šÙ[ˆ
ÌMKÛ\Ë‰Ë	Õ™\ZYYÙ\ˆ
ÌNpåÔØÚÚY\šYÚÙZ]Û\Ë‰Ë	ÔİÜYˆÌL\ËZ][HÌ\Ë‰Ë	ĞXˆL\ÈÙZ]\š[šÙ[ˆ›İ[[™8¢$ŒM›ÜØÚš]‰Ë	Ó]Y™Ù\ØÚÚ[™YÚÙZ]ŒËÛ\ËZ][›H0åÌKŒ‹‰Ë	Ó˜XÚ[™H[ØÚZY]›ÜØÚš]‰×KˆØÛÜ™NˆÉÔÚYYÈHL
È™Y™™\°åÌLˆ
ÈİÜ]X[]0é
È\™™ZİH™\ZYYİ[™ğåÌLˆ8¢$ŒN™ZH›İ[‰×Kˆ]X[]NˆÉÔ\™™Zİˆ8¢iLÈ™Y™™\‹ÙZ[ˆ›İ[İÜ]X[]0é8¢iM8¢iLH\™™ZİH™\ZYYİ[™Ë‰Ë	ÔÛÛYNˆÚYYÈ8¢iLˆ™Y™™\‹‰Ë	ĞÚ[İ\ØÚˆ[™\™\ˆÚYYË‰Ë	Ñ™ZØÚYÎˆÙYÛ™\ˆY\œİ‰×Kˆ™]Ø\™ÎˆÉÔÚYYÈ\›]Ø\SYÙ[™[›0ïÙK‰Ë	Ô\™™Zİˆ8 '”ÕÔZpçİİÜ8 '‰Ë	Õ™\°é™\[™\™ÚYK\œİ[ÛÚÛ›\ÙK]]Y‹[ÛY[[K[›KÒ[K‰×Kˆ\ÜÚ\İÎˆÖÉØ\ÜÚ\İY›[šŞK\Üš[	Ë	Ñ[›IË	Ó]Y™[ˆ
ÌŒˆ	K‰×KÉÜ\™\‹Z[KY›[šŞIË	Ò[IË	ÔİÜYˆÌ\Ë‰×WKˆÛİ\˜ÙNˆ	ÜÜ˜ËÛË[XZ[‹ØØ[\ZYÛ‹ÛZ[šYØ[Y\ÕŒ‹È0­ÈXÚÑ›[šŞHÈ[™›[šŞT›İ[™	ËˆKˆÂˆYˆ	ÚYÙTYIË]Nˆ	Ò[ˆYHXÚÙIËİX]Nˆ	ÑXÚİ[™ËÚ[™[™™]ÙZ\ÛYÙIËˆØš™Xİ]™Nˆ	Ğ›\ÙHY\™[‹Ú™H›XÚÚÙYÙ[[™ÚXÚ˜\™H™]ÙZ\ÙK‰ËˆÛÛ›ÛÎˆÉÔİ[Hğé[‹‰Ë	ĞRÕSÓˆ[[‹‰Ë	ÒÜš^›Û[šY[[‹‰Ë	ÓÜÛ\ÜÙ[ˆ˜]]™\™XÚX‹‰×Kˆ\Ù\ÎˆÉØÚÛÜÙNˆ\ØÚÒXÚÙKÖ™[‰Ë	ØXİ]™Nˆ›ÜØÚš]Ú[™›XÚÙK™]ÙZ\ÙKÙ\°é\ØÚ™\™XÚ‰×Kˆ[\ÎˆÉĞ\ØÚÌKÛ\ÎÈXÚÙHKÛ\ÎÈ™[Ì‹Û\Ë‰Ë	Õ[\ÈÚ\ÜÙ[ˆ]›İZ[[ˆ0åÌÍ‹‰Ë	Ñİ[™[\ÈÛÚÛÛ[ˆ™\™XÚ0åÌÍK‰Ë	Õ™\™XÚ
ÌLMpåÑÙY˜Z™[°åÕÛÚÛÛ[‹Û\Ë‰Ë	Ğ]pçÙ\š[ˆXÚİ[™È™]ÙZ\ÙH
ÌÌ‹Û\Ë‰Ë	ÓÜÛ\ÜÙ[ˆ™\™XÚ8¢$ŒMğåÕÛÚÛÛ[‹Û\Ë‰Ë	ÌL™\™XÚˆ[XÚİ‰×KˆØÛÜ™NˆÉÑ\™›ÛÈHLMˆ8¢$ˆ™\™XÚ8¢$ˆ™]ÙZ\ÙH8¢$ˆÙ\°é\ØÚ‰×Kˆ]X[]NˆÉÔ\™™Zİˆ™\™XÚM™]ÙZ\ÙHË[\˜œ™XÚ[™ÈK‰Ë	ÔÛÛYNˆ\™›ÛÈˆ™\™XÚ‰Ë	ĞÚ[İ\ØÚˆ[™\™\ˆ\™›ÛË‰Ë	Ñ™ZØÚYÎˆ[XÚİ‰×Kˆ™]Ø\™ÎˆÉÔ\™™Zİˆ8 '‘YHXÚÙHØÚÙZYİ8 '‰Ë	Ñ[XÚİ[™Îˆ8 '‘İ[™[H]\È›İY\8 '‰Ë	Ñ\™›ÛÈY\›\ÙNÈ[XÚİ[™ÈÛÜİ]ğï™KĞ™^šYZ[™Ù[‹‰×Kˆ\ÜÚ\İÎˆÖÉİ[K\›İ]KZÛ›İÛYÙIË	Õ[IË	Ô]›İZ[[ˆ8¢$Œ	K‰×KÉØ]]Üš]KYÛÛÙÚ[	Ë	Ñİ[™[IË	Õ™\™XÚ8¢$ŒH	K‰×WKˆÛİ\˜ÙNˆ	ÜÜ˜ËÛË[XZ[‹ØØ[\ZYÛ‹ÛZ[šYØ[Y\ÕŒ‹È0­ÈÚÛÜÙRYÙTÜİÈXÚÒYÙIËˆKˆÂˆYˆ	ÛX\ÛÛIË]Nˆ	ÒÛÛ[H[œÈØÚ	ËİX]Nˆ	ĞX™XÚ[™Ë][\š]]\È[™Ú\šİ[™ÉËˆØš™Xİ]™Nˆ	ÓZ]ÙZH0é™[ˆX™XÚ[ˆ[™™ZHÛÛ›ÛY\H°ïÙH]\Ù°ï™[‹‰ËˆÛÛ›ÛÎˆÉÖÙZHš[™Ù\ˆ°ïˆ™ZYH0é™K‰Ë	ÓX]\Îˆ0é™H˜XÚZ[˜[™\‹‰Ë	Ğ™ZHİXš[\ˆXÚ[™ÈRÕSÓ‹‰Ë	Ò[H][Y™[œİ\ˆ[[‹ÛÜÛ\ÜÙ[‹‰×Kˆ\Ù\ÎˆÉÜÙX[ˆXœİ[™0íšK™[[K‰Ë	Ü[ˆXÚ[™Ëš]]\ËÚ\šİ[™ËXÚÜË\İ[‹‰Ë	Ñ™ZH[™[‹[™ZY[™HšY‰×Kˆ[\ÎˆÉÓÜ[X[\ˆ[™Xœİ[™Œ‹‰Ë	Ôİ\ØÚÙ[HÈ\œİ\ˆ™\œİXÚNNÈX\ÛMK‰Ë	ÔİXš[]0éL\Ë‰Ë	Ğ][^™[[HÌÈ˜ZİÜˆx $ÌK‰Ë	ÕÚ\šİ[™È
ÌÌpåÑXÚ[™ğåÔš]]\ËÛ\Ë‰Ë	Ñİ]\ˆYÎˆÚ\šİ[™È8 $ÎXÚ[™È8¢iLMš]]\ÈL‰×KˆØÛÜ™NˆÉÑİ]\ˆYÈHÌˆ
ÈXÚ[™ğåÌ8¢$ˆ¸¢$•Ú\šİ[™ß0åÌ8¢$ˆXÚÜÈ
Èš]]\Ø›Û\Ë‰Ë	ÑÙ\Ø[]\™›ÛÈXˆMÍK‰×Kˆ]X[]NˆÉÔ\™™Zİ8¢iLMH[™\İ[ˆMK‰Ë	ÔÛÛYH8¢iLMÍK‰Ë	ĞÚ[İ\ØÚLŒ8 $ÌMÍ‰Ë	Ñ™ZØÚYÈLŒ‰×Kˆ™]Ø\™ÎˆÉÔ\™™Zİˆ8 '“X\ÛÈ[›™[8 '‰Ë	Ñ\™›ÛÎˆœ™Z]
Í‹[™\™ÚYH8¢$]]
Í‹Y‹Ó[ÛY[[KÓX\Û‰Ë	Ñ™ZØÚYÈ›İ™[Hœ™Z]
ÌŒ‰×Kˆ\ÜÚ\İÎˆÖÉØ\ÜÚ\İ[X\Û\ÙX[	Ë	ÓX\Û	Ë	ÔØÚÙ[HMK‰×WKˆÛİ\˜ÙNˆ	ÜÜ˜ËÛË[XZ[‹ØØ[\ZYÛ‹ÛZ[šYØ[Y\ÕŒ‹È0­ÈXÚÓX\ÛÈÛÛ\]SX\Û[	ËˆK—NÂ‚˜ÛÛœİUQTÕÔÕQÑTÈHÂˆÉØ\œš]˜[	Ë	Ğ[šİ[™Ú™H[ˆ‰Ë	ÒÛÙ™™\œ˜][H0í™™›™[‰Ë	İ[šÉË	Ô™\Ù\šY\[™ÜÜİXÚI×KˆÉÜ™\Ù\˜][Û‰Ë	ÕÙ\ˆ\Ù[ˆØ[›‹\šİÜ0é\‰Ë	Ô™\Ù\šY\[™Èš[™[‰Ë	Ü™\Ù\˜][Û›Ø\™	Ë	Ñİ[™[KÕ[I×KˆÉØ]]Üš]IË	Õ™\Ø[[™È[HÜ[XÚÉË	ÑZ[›\ÜÚØ[\ˆÙ]Ú[›™[‰Ë	Ùİ[™[IË	ÔØÚ˜[šÙKH[šİK[KTÚ\	×KˆÉÙØ]K[Ü[‰Ë	Ö[H]XÚ\œ]‰Ë	Ö[HØYÙ[ˆÙZ[‰Ë	İ]XÚ\œ]‰Ë	Ôİ›ÛX]Y˜˜]I×KˆÉÜİÙ\‰Ë	Ôİ›ÛHÙ\ˆš]š[\Ø][ÛœØX˜œXÚ	Ë	Ôİ›ÛH™\˜š[™[‰Ë	ÜİÙ\›Ş	Ë	ÌL[šİK]\ÛY[‰×KˆÉİ[›ØY	Ë	Ğ]\ÛY[ˆÚ™H˜[™ØÚZX™[›Ü™˜[	Ë	ÑÙ]°éšÙKÖ™[KÒØX™[	Ë	Ùš[šÜËİ[ËØØX›IË	Ñ\œİ\ÈšY\‰×KˆÉÙš\œİX™Y\‰Ë	Ôš]Y[H[˜™]šYX›˜ZYIË	Ñ\œİ\ÈšY\ˆ0í™™›™[‰Ë	Ùš\œİ™Y\‰Ë	ÌL[šİKšY\™\˜YÉ×KˆÉÜ™][š[Û‰Ë	Ñš[™HYH›Ø›[]°éÙ\‰Ë	Ñœ™][™KÕX[IË	Ø[™™IË	Ñœ™ZY\ÈÛØÚ[™[™I×KˆÉÙœ™YK]ÙYZÙ[™	Ë	Ñœ™ZY\ÈÛØÚ[™[™IË	ÔÜY[K™^šYZ[™Ù[‹›Û›IË	ØØ[\š\™IË	Ñš[˜[›Ü˜]\ÜÙ][™Ù[‰×KˆÉÜİ[™^KYš[˜[	Ë	ÔÛÛ›YÜØX›˜ZYIË	ĞXœØÚ\ÜÜ›İÚÛÛ	Ë	Û›İXÙP›Ø\™	Ë	Í[šİI×KˆÉØÛÛ\]IË	ĞXœ™Z\ÙHZ]™\İğï™IË	Ñœ™ZYH™\İ™Z]	Ë	ØØ[\š\™IË	ĞX™Ù\ØÚÜÜÙ[‰×K—NÂ˜ÛÛœİ‘QÒSÓ”ÈHÂˆÉØ\œš]˜[	Ë	Ğ[šİ[™Ô™^™\[Û‰Ë	ÔØÚ˜[šÙK™\Ù\šY\[™Ëİ[™[KÕ[I×KˆÉÛ›Ü	Ë	ĞYšXKRÛ]\ÙKÓ›Ü™0é™IË	Ñ]Y\œ0é™H[™ÙYÙI×KˆÉØÙ[˜[	Ë	Õ]XÚ\œ]‹ÔØ[š]0é‰Ë	ÓYÙ\‹İ›ÛKXÚÙI×KˆÉÙ™\İ]˜[	Ë	Ñ™\İÚY\ÙIË	Ğ™Y\ˆÛ™Ë°ï™K\I×KˆÉİÛÛÙ[™	Ë	ÔÙ\šXÙZÙ‹ÕØ[	Ë	ÕÙ\šÜİ]Û›YÙ\‰×KˆÉØ™XXÚ	Ë	Ôİ˜[™Ò]\İYÉË	Ñ›[šŞX˜[[™Ø\ÜÙ\‰×KˆÉØÛİ™IË	ÔZYÙHXÚ	Ë	Õ[\œİ[™[™İYÉ×K—NÂ‚›][İ[YH˜[ÙNÂ›]Xİ]™PØ]YÛÜHH	Ûİ™\šY]ÉÎÂ›]Xİ]™Q[HH	Ûİ™\šY]ËY›İÉÎÂ›]ÙX\˜Ú\›HH	ÉÎÂ‚™^Ü[˜İ[Ûˆ[İ[Ø[\ZYÛÛÙ^

HÂˆYˆ
[İ[Y
H™]\›ÂˆÛÛœİØ[YHHØİ[Y[™Ù][[Y[RY
	ØØ[\ZYÛ‹YØ[YIÊNÂˆÛÛœİ˜]ˆHØ[YOËœ]Y\TÙ[XİÜŠ	ËÜ˜\ˆ˜]‰ÊNÂˆYˆ
YØ[YH[˜]ŠHÈÙ][Y[İ]
[İ[Ø[\ZYÛÛÙ^L
NÈ™]\›ÈBˆ[İ[YHYNÂˆÛÛœİ]ÛˆHØİ[Y[˜Ü™X]Q[[Y[
	Ø]Û‰ÊNÂˆ]Û‹šYH	ÛÜ[‹XÛÙ^	ÎÂˆ]Û‹\HH	Ø]Û‰ÎÂˆ]Û‹^ÛÛ[H	ĞÛÙ^	ÎÂˆ]Û‹]HH	ÔÜY[PÛÙ^0í™™›™[ˆ
ÊIÎÂˆ˜]‹œ™\[™
]ÛŠNÂˆØİ[Y[™Ù][[Y[RY
	Ø\	ÊOËš[œÙ\Y˜XÙ[S
	Ø™Y›Ü™Y[™	ËÛÙ^Ú[

JNÂˆ]Û‹˜Y]™[\İ[™\Š	ØÛXÚÉËÜ[ÛÙ^
NÂˆRY
	ØÛÙ^XÛÜÙIÊK˜Y]™[\İ[™\Š	ØÛXÚÉËÛÜÙPÛÙ^
NÂˆRY
	ØØ[\ZYÛ‹XÛÙ^	ÊK˜Y]™[\İ[™\Š	ØÛXÚÉË
]™[
HOˆÈYˆ
]™[\™Ù]OOHRY
	ØØ[\ZYÛ‹XÛÙ^	ÊJHÛÜÙPÛÙ^

NÈJNÂˆRY
	ØÛÙ^\ÙX\˜Ú	ÊK˜Y]™[\İ[™\Š	Ú[œ]	Ë
]™[
HOˆÈÙX\˜Ú\›HH]™[\™Ù]˜[YKš[J
KÓØØ[SİÙ\Ø\ÙJ	ÙIÊNÈ™[™\Š
NÈJNÂˆRY
	ØÛÙ^]XœÉÊK˜Y]™[\İ[™\Š	ØÛXÚÉË
]™[
HOˆÂˆÛÛœİ\™Ù]H]™[\™Ù]˜ÛÜÙ\İËŠ	ÖÙ]KXÛÙ^XØ]YÛÜWIÊNÂˆYˆ
]\™Ù]
H™]\›ÂˆXİ]™PØ]YÛÜHH\™Ù]™]\Ù]˜ÛÙ^Ø]YÛÜNÂˆÙX\˜Ú\›HH	ÉÎÂˆRY
	ØÛÙ^\ÙX\˜Ú	ÊK˜[YHH	ÉÎÂˆXİ]™Q[HHZ[[šY\Ê
K™š[™

[JHOˆ[K˜Ø]YÛÜHOOHXİ]™PØ]YÛÜJOËšYÏÈXİ]™Q[NÂˆ™[™\Š
NÂˆJNÂˆRY
	ØÛÙ^Y[K[\İ	ÊK˜Y]™[\İ[™\Š	ØÛXÚÉË
]™[
HOˆÂˆÛÛœİ\™Ù]H]™[\™Ù]˜ÛÜÙ\İËŠ	ÖÙ]KXÛÙ^Y[WIÊNÂˆYˆ
]\™Ù]
H™]\›ÂˆXİ]™Q[HH\™Ù]™]\Ù]˜ÛÙ^[NÂˆ™[™\Š
NÂˆYˆ
X]ÚYYXJ	ÊX^]ÚYˆŒ
IÊK›X]Ú\ÊHRY
	ØÛÙ^Y]Z[	ÊKœØÜ›Û[ÕšY]ÊÈ›ØÚÎˆ	Üİ\	Ë™Z]š[Üˆ	ÜÛ[Ûİ	ÈJNÂˆJNÂˆY]™[\İ[™\Š	ÚÙ^YİÛ‰Ë
]™[
HOˆÂˆYˆ
]™[\™Ù]Ë›X]Ú\ÏËŠ	Ú[œ]^\™XKÙ[XİØÛÛ[Y]X›OHYH—IÊJH™]\›ÂˆYˆ
]™[šÙ^HOOH	Ñ\ØØ\IÈ	‰ˆXRY
	ØØ[\ZYÛ‹XÛÙ^	ÊKšY[ŠHÈ]™[œ™]™[Y˜][

NÈÛÜÙPÛÙ^

NÈBˆYˆ
]™[šÙ^KÓØØ[SİÙ\Ø\ÙJ	ÙIÊHOOH	ØÉÈ	‰ˆRY
	ØØ[\ZYÛ‹XÛÙ^	ÊKšY[ˆ	‰ˆYØİ[Y[œ]Y\TÙ[XİÜŠ	Ë›[Ù[››İ
ÚY[—JIÊJHÈ]™[œ™]™[Y˜][

NÈÜ[ÛÙ^

NÈBˆJNÂˆY]™[\İ[™\Š	ÛËXØ[\ZYÛ‹[Y]IË

HOˆÈYˆ
XRY
	ØØ[\ZYÛ‹XÛÙ^	ÊKšY[ŠH™[™\Š
NÈJNÂˆ™[™\Š
NÂŸB‚™[˜İ[ÛˆÜ[ÛÙ^

HÂˆRY
	ØØ[\ZYÛ‹XÛÙ^	ÊKšY[ˆH˜[ÙNÂˆØİ[Y[˜›ÙK˜Û\ÜÓ\İ˜Y
	ØØ[\ZYÛ‹[[Ù[[Ü[‰Ë	ØØ[\ZYÛ‹XÛÙ^[Ü[‰ÊNÂˆ™[™\Š
NÂˆÙ][Y[İ]


HOˆRY
	ØÛÙ^\ÙX\˜Ú	ÊK™›Øİ\Ê
K
NÂŸB™[˜İ[ÛˆÛÜÙPÛÙ^

HÂˆRY
	ØØ[\ZYÛ‹XÛÙ^	ÊKšY[ˆHYNÂˆØİ[Y[˜›ÙK˜Û\ÜÓ\İœ™[[İ™J	ØØ[\ZYÛ‹XÛÙ^[Ü[‰ÊNÂˆYˆ
YØİ[Y[œ]Y\TÙ[XİÜŠ	Ë›[Ù[››İ
ÚY[—JIÊJHØİ[Y[˜›ÙK˜Û\ÜÓ\İœ™[[İ™J	ØØ[\ZYÛ‹[[Ù[[Ü[‰ÊNÂŸB™[˜İ[Ûˆ™[™\Š
HÂˆÛÛœİ[šY\ÈHZ[[šY\Ê
NÂˆÛÛœİš[\™YH[šY\Ë™š[\Š
[JHOˆÙX\˜Ú\›HÈ[KœÙX\˜Úš[˜ÛY\ÊÙX\˜Ú\›JHˆ[K˜Ø]YÛÜHOOHXİ]™PØ]YÛÜJNÂˆYˆ
Yš[\™YœÛÛYJ
[JHOˆ[KšYOOHXİ]™Q[JJHXİ]™Q[HHš[\™YÌOËšYÏÈ[šY\ÖÌOËšYÂˆÛÛœİÙ[XİYH[šY\Ë™š[™

[JHOˆ[KšYOOHXİ]™Q[JHÏÈš[\™YÌNÂˆÛÛœİØ]YÛÜHHĞUQÓÔ’QTË™š[™

ÚYJHOˆYOOHXİ]™PØ]YÛÜJHÏÈĞUQÓÔ’QTÖÌNÂˆRY
	ØÛÙ^]XœÉÊKš[›™\’SHĞUQÓÔ’QTË›X\

ÚYXÛÛ‹X™[JHOˆ]Ûˆ\OH˜]Ûˆˆ]KXÛÙ^XØ]YÛÜOH—	ÚYHˆÛ\ÜÏH—	ÚYOOHXİ]™PØ]YÛÜHÈ	ØXİ]™IÈˆ	ÉßHO—	ÚXÛÛŸOÚOÜ[—	Ù\ØÊX™[
_OÜÜ[—	Ù[šY\Ë™š[\Š
[JHOˆ[K˜Ø]YÛÜHOOHY
K›[™İOØØ]Û—
Kš›Ú[Š	ÉÊNÂˆRY
	ØÛÙ^XØ]YÛÜKXÛÜIÊK^ÛÛ[HÙX\˜Ú\›HÈİXÚH0ï™\ˆ[ˆ›Ûİ0é™YÙ[ˆÛÙ^ˆ8 '—	ÜÙX\˜Ú\›_x 'ˆØ]YÛÜVÌ×NÂˆRY
	ØÛÙ^XÛİ[	ÊK^ÛÛ[H	Ùš[\™Y›[™İHZ[°éÙWÂˆRY
	ØÛÙ^Y[K[\İ	ÊKš[›™\’SHš[\™Y›[™İÈš[\™Y›X\

[JHOˆ]Ûˆ\OH˜]Ûˆˆ]KXÛÙ^Y[OH—	Ù[KšYHˆÛ\ÜÏH—	Ù[KšYOOHÙ[XİYËšYÈ	ØXİ]™IÈˆ	ÉßHÜ[—	Ù\ØÊ[K]J_OÜÜ[ÛX[—	Ù\ØÊ[KœİX]J_OÜÛX[—	Ù[K˜˜YÙHÈ—	Ù\ØÊ[K˜˜YÙJ_OØ—ˆ	ÉßOØ]Û—
Kš›Ú[Š	ÉÊHˆ	ÏÛ\ÜÏH˜ÛÙ^Y[\H’ÙZ[™HZ[°éÙHÙY[™[‹Ü‰ÎÂˆRY
	ØÛÙ^Y]Z[	ÊKš[›™\’SHÙ[XİYËœ™[™\Š
HÏÈ	ÏÛ\ÜÏH˜ÛÙ^Y[\H’ÙZ[ˆZ[˜YËÜ‰ÎÂŸB‚™[˜İ[ÛˆZ[[šY\Ê
HÂˆÛÛœİİÜ™HH™]ÈØ[YTİÜ™JÈÙ]][Nˆ
Ù^JHOˆØØ[İÜ˜YÙK™Ù]][JÙ^JKÙ]][J
HßK™[[İ™R][J
HßHJNÂˆÛÛœİ˜\ÙHHİÜ™KœÛ˜\Úİ

NÂˆÛÛœİY]HHØ[\ZYÛ“Y]KœÛ˜\Úİ

NÂˆÛÛœİÛ˜\ÚİHØ[\ZYÛ“Y]K˜]YÛY[Û˜\Úİ
˜\ÙJNÂˆÛÛœİ™\İ[H×NÂˆYİ™\šY]Ê™\İ[Û˜\ÚİY]JNÂˆYÚ\˜Xİ\œÊ™\İ[Û˜\ÚİY]JNÂˆY]XÚÜÊ™\İ[Y]JNÂˆYÛÛX˜]
™\İ[Û˜\ÚİY]JNÂˆYZ[šYØ[Y\Ê™\İ[Y]JNÂˆYİ]\Ê™\İ[Û˜\Úİ
NÂˆY][\Ê™\İ[Û˜\Úİ
NÂˆY]Y\İÊ™\İ[Y]JNÂˆY›ÙÜ™\ÜÚ[ÛŠ™\İ[Y]JNÂˆYÛÜ›
™\İ[Û˜\Úİ
NÂˆ™]\›ˆ™\İ[ÂŸB‚™[˜İ[ÛˆYİ™\šY]Êİ]Û˜\ÚİY]JHÂˆ\Ú
İ]	Ûİ™\šY]ËY›İÉË	Ûİ™\šY]ÉË	ÔÜY[X›]Y‰Ë	Õ›ÛH[›Èš\È\ˆÛÛ›YÜØX›˜ZYIË	ÒØ[\YÛ™Hİ\\›X\šİZ[›\ÜÈš[˜[IË

HOˆYÙJ	ÔÔQSÕ•RÕT‰Ë	ÔÜY[X›]Y‰Ë	ÑZ[ˆ\Ø[[Y[š0é™Ù[™\ÈØ[\[™İÛØÚ[™[™K[ˆ[H[ØÚZY[™Ù[ˆ\İ0é™K™^šYZ[™Ù[ˆ[™\Èš[˜[H™\°é™\›‹‰Ëİ]ÊÖÉÔİY™IËİYÙS˜[YJY]Kœ]Y\İİYÙJWKÉÖ™Z]	ËYÈ	ÜÛ˜\Úİ™^_H0­È	ÜÛ˜\Úİ˜ÛØÚÓX™[WKÉÖšY[	ËØ[\ZYÛ“Y]K›Øš™Xİ]™J
K]WKÉÕÛØÚ[™[™Ù\	Ë	ÛY]KÙYZÙ[™ØÛÜ™_H0­È	Ü˜[šÓ˜[YJY]KÙYZÙ[™˜[šÊ_WWJH
ÈÙXİ[ÛœÊÂˆÉÌKˆ[›È[™›Ùš[	Ë\˜\ÊÉÕ˜\šXX›HZ[›Z][™ÎÈ[˜XÚ˜[YKğíœœ\‹X\™KXØÙ\ÜÛÚ\™K˜\˜™[ˆ[™ZYÙ[œØÚY‰×JWKˆÉÌ‹ˆİ\\›X\šİ	Ë\˜\ÊÉÌH8 «İ\YÙ]X^[X[Y[™Ù[‹Z[™\İ[œÈZ[ˆØ]Y‹‰×JWKˆÉÌËˆ[šİ[™	ËÜ™\™Y
ÉÒÛÙ™™\œ˜][IË	Ô™\Ù\šY\[™ÉË	Ñİ[™[KÕ[IË	Õ]XÚ\œ]‰Ë	Ôİ›ÛIË	Ğ]\ÛY[‰Ë	Ñ\œİ\ÈšY\‰×JWKˆÉÍˆœ™ZY\ÈÛØÚ[™[™IË\˜\ÊÉĞÚ\˜Zİ\™KX[KZ[š\ÜY[K›Û›K]XÚÙ[‹[™ZÙİ[ˆ[™›ÛX[™[‹‰×JWKˆÉÍKˆš[˜[IË\˜\ÊÉÑ™ZH[\œØÚYYXÚHZİ]š]0é[ˆ\È›Û›H0í™™›™[ˆYHÛÛ›YÜØX›˜ZYK‰×JWKˆÉĞÛÙ\]Y[[‰ËÛİ\˜Ù\ÊÉÜÜ˜ËÛË[XZ[‹ØØ[\ZYÛ‹Ø\ÉË	ÜÜ˜ËÛË[XZ[‹ØØ[\ZYÛ‹ÛY]TİÜ™KÉË	ÜÜ˜ËÙØ[YKÜİ]KÑØ[YTİÜ™KÉ×JWKˆJJJNÂˆ\Ú
İ]	Ûİ™\šY]ËXÛÛ›ÛÉË	Ûİ™\šY]ÉË	Ôİ]Y\[™ÉË	Õ\İ]\‹X]\È[™İXÚ	Ë	ÕĞTÑ™Z[HHY\\İHÈ›Ş\İXÚÉË

HOˆYÙJ	Ğ‘QQS•S‘ÉË	Ôİ]Y\[™ÉË	Ğ[HÙ\›™[šİ[Û™[ˆÚ[™[Øš[[™Z]\İ]\ˆ™YY[˜˜\‹‰ËÙXİ[ÛœÊÂˆÉÕÙ[	ËX›JÉÑZ[™ØX™IË	Ñ[šİ[Û‰×KÖÉÕĞTÑÔ™Z[IË	Ğ™]ÙYÙ[ÈXYÛÛ˜[›Ü›X[\ÚY\‰×KÉÑKÓY\\İIË	Ò[\˜YÚY\™[‹‰×KÉÔIË	ÕÚ[šÙ[‹‰×KÉĞÉË	ĞÛÙ^0í™™›™[‹‰×WJWKˆÉÓ[Øš[	Ë\˜\ÊÉÑ[˜[Z\ØÚ\ˆ[œÚXÚ˜\™\ˆ[˜[ÙÜİXÚÈ[šÜÎÈÛÛ^Xš0é™ÚYÙHZİ[Ûœİ\İH™XÚË‰×JWKˆÉÔÜ\œ™IË\˜\ÊÉØØ[\ZYÛ‹[[Ù[[Ü[ˆİÜÙ[™]ÙYİ[™Èğé™[™Y[°ïÈ[™Z[š\ÜY[[‹‰×JWKˆÉĞÛÙ\]Y[[‰ËÛİ\˜Ù\ÊÉÜÜ˜ËÛË[XZ[‹ØØ[\ZYÛ‹İÛÜ›ØÙ[™KÉË	ÜÜ˜ËÛË[XZ[‹ØØ[\ZYÛ‹Û[Øš[PÛÛ›ÛËÉ×JWKˆJJJNÂˆ\Ú
İ]	Ûİ™\šY]Ë\Ø]™IË	Ûİ™\šY]ÉË	ÔÜZXÚ\[™ÉË	ÓÚØ[Hœ›İÜÙ\œİ0é™IË	ÛØØ[İÜ˜YÙHÛÛ\]Xš[]0éQÉË

HOˆYÙJ	ÕPÒ’RÉË	ÔÜZXÚ\[™ÉË	Ğ˜\Ú\ÜÜY[[™Ø[\YÛ™[™›ÜØÚš]Ù\™[ˆÙ]™[›Ù\ÜZXÚ\‰ËX›JÉĞ™\™ZXÚ	Ë	ÔØÚ0ïÜÙ[	×KÖÉĞ˜\Ú\ÜÜY[	ËÕÔQÑWÒÑVWKÉÒØ[\YÛ™IË	İ[\ËX›]YKXYšXK[ËXØ[\ZYÛ‹[Y]K]Œ‰×KÉÒ[›ÉË	İ[\ËXYšXKZ[›Ë]˜\šX[]Œ‰×WJH
È›İJ	ÒÛÛ\]Xš[]0é	Ë	Ğ]XÚÙ[‹RQÈ›ZX™[ˆİXš[ğé™[™˜[Y[‹^H[™˜[[˜Ú[™È™\°é™\Ù\™[ˆğí››™[‹‰ÊH
ÈÛİ\˜Ù\ÊÉÜÜ˜ËÙØ[YKÜİ]KÑØ[YTİÜ™KÉË	ÜÜ˜ËÛË[XZ[‹ØØ[\ZYÛ‹ÛY]TİÜ™KÉ×JJJNÂˆ\Ú
İ]	Ûİ™\šY]Ë\›Ùš[IË	Ûİ™\šY]ÉË	ÔÜY[\œ›Ùš[	ËÛ˜\Úİœ›Ùš[HÈ	ÜÛ˜\Úİœ›Ùš[K›˜[Y_H0­È	ÜÛ˜\Úİœ›Ùš[K˜Z]Wˆ	Ó›ØÚšXÚ\œİ[	Ë	Ú[œØ™\™Z]™[Ø˜XÚ[™Ú[İ\ØÚ\™ZİÚ\›X[	Ë

HOˆYÙJ	ÔÔQST‘’QÕT‰Ë	ÑZYÙ[œØÚY[‰Ë	ÑZYÙ[œØÚY[ˆ™\œİ0éšÙ[ˆ\ÜÙ[™HX[ÙØ[œğé™K‰Ëİ]ÊÖÉÓ˜[YIËÛ˜\Úİœ›Ùš[OË›˜[YHÏÈ	ø $É×KÉÑZYÙ[œØÚY	ËÛ˜\Úİœ›Ùš[OË˜Z]ÏÈ	ø $É×KÉÒğíœœ\‰ËÛ˜\Úİœ›Ùš[OË˜›ÙU\HÏÈ	ø $É×KÉÑœš\İ\‰ËÛ˜\Úİœ›Ùš[OËšZ\”İ[HÏÈ	ø $É×WJH
ÈX›JÉÑZYÙ[œØÚY	Ë	ĞZİY[HÚ\šİ[™É×KÖÉÒ[œØ™\™Z]	Ë	ÊÌˆ™ZH[™KÔ[™[‹‰×KÉĞ™[Ø˜XÚ[™	Ë	ÊÌH™ZHZ0íœ™[‹‰×KÉĞÚ[İ\ØÚ	Ë	ÊÌH™ZH[[ÜÈÜ™X]]™H›ÛX[™[‹‰×KÉÑ\™Zİ	Ë	ÊÌH™ZH\˜]\Ù›Ü™\[™Ë‰×KÉĞÚ\›X[	Ë	Ó›ØÚÙZ[ˆZYÙ[™\ˆ™\İ\ˆ›Û\È[HÚ\˜Zİ\œ™\ÛÛ™\‹‰×WJH
È›İJ	Õ™\™™Z[™\[™ÜÜ[šİ	Ë	ĞÚ\›X[\İYXÚ[š\ØÚØÚğéÚ\ˆ[™ÙX[™[‹‰ÊJNÂŸB‚™[˜İ[ÛˆYÚ\˜Xİ\œÊİ]Û˜\ÚİY]JHÂˆÛÛœİÜ™\ˆHÉÙİ[™[IË	İ[IË	Ü›Û›IË	ÛX[›šIË	Ø[™™IË	Ü™[™IË	Û\œÉË	Ù[›IË	ÙÜ™YÛÜ‰Ë	ÛX\Û	Ë	ÜØÚX™\	Ë	Ù™[^	Ë	ÜØÚ[XIË	Üİ\ÚIË	Ú[IË	ÚÚ\˜I×NÂˆÛÛœİ›ÚXÙ\ÈHØš™Xİ˜[Y\ÊÒTPÕT—Õ“ÒPÑTÊKœÛÜ

KŠHOˆÜ™\‹š[™^ÙŠKšY
HHÜ™\‹š[™^ÙŠ‹šY
JNÂˆ›Üˆ
ÛÛœİ›ÚXÙHÙˆ›ÚXÙ\ÊHÂˆÛÛœİœšY[™H”’QS‘Ô“Ñ’STÖİ›ÚXÙKšYNÂˆÛÛœİ›ÛX[˜ÙHH“ÓPSÑWÔ“Ñ’STÖİ›ÚXÙKšYNÂˆÛÛœİš\İX[HĞSTRQÓ—ĞÒTPÕT—Ğ–WÒQİ›ÚXÙKšYNÂˆÛÛœİ™[][ÛˆHÛ˜\Úİœ™[][ÛœÚ\Öİ›ÚXÙKšYHÏÈÂˆÛÛœİXİ]™HHY]K˜Xİ]™UX[Kš[˜ÛY\Ê›ÚXÙKšY
NÂˆÛÛœİY]H›ÛÛX[ŠÛ˜\Úİ™›YÜÖ×Y]W	İ›ÚXÙKšYWJH
Y]K˜ÛÛ™\œØ][ÛÛİ[Öİ›ÚXÙKšYHÏÈ
HˆÂˆÛÛœİÙ^]ÛÜ™ÈHİ›ÚXÙK›˜[YK›ÚXÙKœ›ÛK›ÚXÙK˜ØY[˜ÙK‹‹›ÚXÙK˜[Y\Ë‹‹›ÚXÙKš\œš][ËœšY[™Ë˜š[ÙÜ˜\K›ÛX[˜ÙOË™\ØÜš\[Û—K™š[\Š›ÛÛX[ŠKš›Ú[Š	È	ÊNÂˆ\Ú
İ]Ú\˜Xİ\‹W	İ›ÚXÙKšYW	ØÚ\˜Xİ\œÉË›ÚXÙK›˜[YK›ÚXÙKœ›ÛKÙ^]ÛÜ™Ë

HOˆ™[™\Ú\˜Xİ\Š›ÚXÙKœšY[™›ÛX[˜ÙKš\İX[Û˜\ÚİY]JKXİ]™HÈ	ĞRÕU‰ÈˆY]È‘V‹ˆ	ÜÚYÛ™Y
™[][ÛŠ_Wˆ	ÕS‘RĞS“•	ÊNÂˆBŸB™[˜İ[Ûˆ™[™\Ú\˜Xİ\Š›ÚXÙKœšY[™›ÛX[˜ÙKš\İX[Û˜\ÚİY]JHÂˆÛÛœİ™[][ÛˆHÛ˜\Úİœ™[][ÛœÚ\Öİ›ÚXÙKšYHÏÈÂˆÛÛœİÛÛ[H×NÂˆÛÛ[œ\Ú
ÉÔ\œğí››XÚÙZ]	ËX›JÉÑ™[	Ë	Ò[š[	×KÖÉÔ›ÛIË›ÚXÙKœ›ÛWKÉÔÜ™XÚÙZ\ÙIË›ÚXÙK˜ØY[˜ÙWKÉÕÙ\IË›ÚXÙK˜[Y\Ëš›Ú[Š	È0­È	ÊWKÉÔ™Z^œ[šİIË›ÚXÙKš\œš][Ëš›Ú[Š	È0­È	ÊWKÉÓXYÉË›ÚXÙK›ZÙ\Ë›X\

Y
HOˆT“ĞPÒÚYJKš›Ú[Š	È0­È	ÊH	ø $É×KÉÓXYÈšXÚ	Ë›ÚXÙK™\ÛZÙ\Ë›X\

Y
HOˆT“ĞPÒÚYJKš›Ú[Š	È0­È	ÊH	ÒÙZ[™H™\İHX›™ZYİ[™É×WJWJNÂˆYˆ
œšY[™
HÛÛ[œ\Ú
ÉÑœ™][™\Ü›Ùš[	ËX›JÉÑ™[	Ë	Ò[š[	×KÖÉĞ\˜Ú]\	ËœšY[™˜\˜Ú]\WKÉĞš[ÙÜ˜YšYIËœšY[™˜š[ÙÜ˜\WKÉÔİ0éšÙ[‰ËœšY[™œİ™[™İËš›Ú[Š	È0­È	ÊWKÉÔØÚğéÚ[‰ËœšY[™ÙXZÛ™\ÜÙ\Ëš›Ú[Š	È0­È	ÊWKÉÕ[Y[‰ËœšY[™ÜXÜËš›Ú[Š	È0­È	ÊWKÉĞØ[›˜Xš\ÉËY\ÊœšY[™›ZÙ\ĞØ[›˜Xš\ÊWKÉĞ[ÛÚÛÛ\˜[‰ËœšY[™˜[ÛÚÛÛ\˜[˜ÙWKÉÔ™ZÜ]Y\[™ÉËXˆ	ÙœšY[™œ™XÜZ]Y[™\ÚÛH™^šYZ[™È[™\œİ[H™Y™™[—KÉÑ™[Ø]‰ËœšY[™™šY[[™WWJWJNÂˆYˆ
œšY[™	‰ˆ”’QS‘ÕPSWÓQSP‘T”Öİ›ÚXÙKšYJHÛÛ[œ\Ú
ÉÕX[]Ù\IËX[Tİ]Ê”’QS‘ÕPSWÓQSP‘T”Öİ›ÚXÙKšYJWJNÂˆYˆ
›ÛX[˜ÙJHÛÛ[œ\Ú
ÉÔ›ÛX[™IË›ÛX[˜ÙUšY]Ê›ÚXÙKšY›ÛX[˜ÙKÛ˜\ÚİY]JWJNÂˆÛÛ[œ\Ú
ÉÑX[ÙÛÜ[Û™[‰Ë›ÚXÙK˜ÚÚXÙ\Ë›X\

ÚÚXÙJHOˆ\XÛHÛ\ÜÏH˜ÛÙ^XÚÚXÙHXY\İ›Û™Ï—	Ù\ØÊÚÚXÙK›X™[
_OÜİ›Û™ÏÜ[ˆÛ\ÜÏHœš\ÚËW	ØÚÚXÙKœš\ÚßH—	ØÚÚXÙKœš\ÚËÕ\\Ø\ÙJ
_OÜÜ[ÚXY\—	Ù\ØÊÚÚXÙKš[
_OÜÛX[—	Ù\ØÊÚÚXÙKÜXÊ_H0­È	Ù\ØÊT“ĞPÒØÚÚXÙK˜\›ØXÚJ_OÜÛX[Ø\XÛO—
Kš›Ú[Š	ÉÊWJNÂˆÛÛ[œ\Ú
ÉÔÜÚ]]™H™XZİ[Û™[‰Ë™\ÜÛœÙTÛÛÊ›ÚXÙKœÜÚ]]™JWJNÂˆÛÛ[œ\Ú
ÉÓ™YØ]]™H™XZİ[Û™[‰Ë™\ÜÛœÙTÛÛÊ›ÚXÙK›™YØ]]™JWJNÂˆÛÛ[œ\Ú
ÉÔ\œğí››XÚH[0ï[™ÉË\˜\Êİ›ÚXÙKœ\œÛÛ˜[™]™X[JWJNÂˆÛÛ[œ\Ú
ÉÑ]Y\šYHÜY[Ú\šİ[™ÉË\˜\Êİ›ÚXÙK˜\ÜÚ\İX™[ÏÈ	ÒÙZ[™HZYÙ[™H\ÜÚ\İ[‹‰Ë›YÎˆ	İ›ÚXÙK˜ÛÛœÙ\]Y[˜ÙQ›YÈÏÈ	ÚÙZ[œÉßWJWJNÂˆYˆ
ÓÓTS’SÓ—ĞPÕSÓ”Öİ›ÚXÙKšYJHÂˆÛÛœİXİ[ÛˆHÓÓTS’SÓ—ĞPÕSÓ”Öİ›ÚXÙKšYNÂˆÛÛ[œ\Ú
ÉĞ™YÛZ]\˜Zİ[Û‰ËX›JÉÓ˜[YIË	ÕÚ\šİ[™ÉË	ÒÛÜİ[‰×KÖØXİ[Û‹›X™[Xİ[Û‹™]Z[	ØXİ[Û‹›[ÛY[[_H[ÛY[[WWJWJNÂˆBˆÛÛ[œ\Ú
ÉÕš\İX[	ËX›JÉÑ™[	Ë	ÕÙ\	×KÖÉÓİ]š]	Ëš\İX[Ë›İ]š]ÏÈ	ø $É×KÉÑœš\İ\‰Ëš\İX[ËšZ\”İ[HÏÈ	ø $É×KÉĞXØÙ\ÜÛÚ\™\ÉËš\İX[Ë˜XØÙ\ÜÛÜšY\ÏËš›Ú[Š	È0­È	ÊHÏÈ	ø $É×KÉÒYIËš\İX[ËšYP[š[X][ÛˆÏÈ	ø $É×KÉĞ™YÜ°ï0çİ[™ÉËš\İX[Ë™Ü™Y][™Ğ[š[X][ÛˆÏÈ	ø $É×KÉÕÙ[^	Ëš\İX[Ë™X[ÙİYHÏÈ	ø $É×WJWJNÂˆYˆ
ÉÙİ[™[IË	İ[I×Kš[˜ÛY\Ê›ÚXÙKšY
JHÛÛ[œ\Ú
ÉÓX[š\[][ÛœÛX\šÙ\‰Ë]]Üš]Q›YÜÊY]K™›YÜÊWJNÂˆÛÛ[œ\Ú
ÉĞÛÙ\]Y[[‰ËÛİ\˜Ù\ÊÉÜÜ˜ËÛË[XZ[‹ØØ[\ZYÛ‹ØÚ\˜Xİ\•›ÚXÙ\ËÉËœšY[™È	ÜÜ˜ËÙØ[YKÙœšY[™›Üİ\‹ÉÈˆ	ÉË›ÛX[˜ÙHÈ	ÜÜ˜ËÙØ[YKÜÛØÚX[Ş\İ[KÉÈˆ	ÉË	ÜÜ˜ËÛË[XZ[‹ØÛÛ[ÉËÉÙİ[™[IË	İ[I×Kš[˜ÛY\Ê›ÚXÙKšY
HÈ	ÜÜ˜ËÛË[XZ[‹ØØ[\ZYÛ‹Ø]]Üš]Sİ™\š][ÉÈˆ	É×K™š[\Š›ÛÛX[ŠJWJNÂˆ™]\›ˆYÙJš\İX[Ëœ›ÛHÏÈ	ĞÒTRÕT‰Ë›ÚXÙK›˜[YK›ÚXÙK˜ØY[˜ÙKİ]ÊÖÉĞ™^šYZ[™ÉËÚYÛ™Y
™[][ÛŠWKÉÑÙ\Ü°éÚIËİš[™ÊY]K˜ÛÛ™\œØ][ÛÛİ[Öİ›ÚXÙKšYHÏÈ
WKÉĞZİ]™\ÈX[IËY\ÊY]K˜Xİ]™UX[Kš[˜ÛY\Ê›ÚXÙKšY
JWKÉÔÜ˜Z]	Ë›ÚXÙKœÜ˜Z]WJH
ÈÙXİ[ÛœÊÛÛ[
JNÂŸB‚™[˜İ[ÛˆY]XÚÜÊİ]Y]JHÂˆ›Üˆ
ÛÛœİ[İ™HÙˆØš™Xİ˜[Y\ÊÓÓPUÓSÕ‘TÊJHÂˆÛÛœİX\›™YHY]K›X\›™Y]XÚÜËš[˜ÛY\Ê[İ™KšY
NÂˆÛÛœİ\]Z\YHY]K™\]Z\Y]XÚÜËš[˜ÛY\Ê[İ™KšY
NÂˆÛÛœİX\İ\HHY]K˜]XÚÓX\İ\VÛ[İ™KšYNÂˆÛÛœİ˜YÙHH\]Z\YÈ	ĞUTÑÑT°çÕU	ÈˆX\›™YÈW	ÛX\İ\OË›]™[ÏÈ_Wˆ	ÑÑTÔT”•	ÎÂˆ\Ú
İ]]XÚËW	Û[İ™KšYW	Ø]XÚÜÉË[İ™K›X™[	ÕQÔÖÛ[İ™KY×_H0­È	Û[İ™K˜XØİ\˜XŞ_IW	Û[İ™KšYH	Û[İ™K™\ØÜš\[ÛŸH	Û[İ™K[›ØÚÕ]_H	Û[İ™K[›ØÚÑ]Z[W

HOˆ™[™\]XÚÊ[İ™KY]JK˜YÙJNÂˆBŸB™[˜İ[Ûˆ™[™\]XÚÊ[İ™KY]JHÂˆÛÛœİX\İ\HHY]K˜]XÚÓX\İ\VÛ[İ™KšYNÂˆÛÛœİÜÛ™[›İÜÈHØš™Xİ˜[Y\ÊĞSTRQÓ—ÓÔÓ‘S•ÊK›X\

ÜÛ™[
HOˆÂˆÛÛœİ˜XİÜˆH
ÜÛ™[›[İ™S][\Y\œÖÛ[İ™KšYHÏÈJH
ˆ
ÜÛ™[YÓ][\Y\œÖÛ[İ™KY×HÏÈJNÂˆ™]\›ˆÛÜÛ™[›˜[YK˜XİÜ‹Ñš^Y
ŠKY™™Xİ]™[™\ÜÊ˜XİÜŠWNÂˆJNÂˆ™]\›ˆYÙJ	Ñ”•TÕUPÒÑIË[İ™K›X™[[İ™K™\ØÜš\[Û‹İ]ÊÖÉÕXÚš\ØÚHQ	Ë[İ™KšYKÉÒØ]YÛÜšYIËQÔÖÛ[İ™KY×WKÉÑÜ[™œ\İ	Ëİš[™Ê[İ™K˜˜\ÙQœ\İ˜][ÛŠWKÉÑÙ[˜]ZYÚÙZ]	Ë	Û[İ™K˜XØİ\˜XŞ_IWKÉÔİ]\ÉËY]K™\]Z\Y]XÚÜËš[˜ÛY\Ê[İ™KšY
HÈ	Ğ]\ÙÙ\°ïİ]	ÈˆY]K›X\›™Y]XÚÜËš[˜ÛY\Ê[İ™KšY
HÈ	ÑÙ[\›	Èˆ	ÑÙ\Ü\œ	×KÉÓYZ\İ\œØÚY	ËW	ÛX\İ\OË›]™[ÏÈ_H0­È	Øœ˜[˜ÚX™[
X\İ\OË˜œ˜[˜Ú
_WWJH
ÈÙXİ[ÛœÊÂˆÉÑ^ZİHÚ\šİ[™ÉËX›JÉÔ\˜[Y]\‰Ë	ÕÙ\	×KÖÉÑÜ[™œ\İ	Ëİš[™Ê[İ™K˜˜\ÙQœ\İ˜][ÛŠWKÉÑÙ[˜]ZYÚÙZ]	Ë	Û[İ™K˜XØİ\˜XŞ_IWKÉÕYÉË	Û[İ™KYßH0­È	ÕQÔÖÛ[İ™KY×_WKÉÔÙ[œİ[\İ[™ÉË[İ™KœÙ[”™[YYˆÈİš[™Ê[İ™KœÙ[”™[YYŠHˆ	ÒÙZ[™I×KÉÔØÚ]™˜ZİÜ‰Ë[İ™K™İX\™][\Y\ˆÈİš[™Ê[İ™K™İX\™][\Y\ŠHˆ	ÒÙZ[™\‰×KÉÔİ]\ÉË[İ™Kœİ]\ÈÈ	Û[İ™Kœİ]\Ë\™Ù]Nˆ	ĞUWÔÕUTÖÛ[İ™Kœİ]\ËšYOË–ÌHÏÈ[İ™Kœİ]\ËšYK	Û[İ™Kœİ]\Ë\›œßH[™JŠWˆ	ÒÙZ[™\‰×WJWKˆÉĞZİY[\ˆØ[\^	Ë\˜\ÊØ]XÚÕ^
[İ™KšYY]K˜Xİ]™UX[K›[™İJWJWKˆÉÑœ™Z\ØÚ[[™ÉËX›JÉÕ][	Ë	Ğ™Y[™İ[™É×KÖÛ[İ™K[›ØÚÕ]K[İ™K[›ØÚÑ]Z[WJWKˆÉÑ›\Ü[Û‰ËX›JÉÓÜ[Û‰Ë	Ó[ÙYšZØ]Ü‰×KÖÛ[İ™K™›\Ü[Û‹ÚYÛ™Y
[İ™K™›\[ÙYšY\ŠWWJWKˆÉÓYZ\İ\œØÚY	ËX\İ\UšY]Ê[İ™KšYY]JWKˆÉÑÙYÛ™\Ú\šİ[™ÉËX›JÉÑÙYÛ™\‰Ë	Ó[İ™påÕYÉË	Ğ™]Ù\[™É×KÜÛ™[›İÜÊWKˆÉÕÚYY\šÛ[™ÉË[]ÊÉÑÙ[˜]ZYÚÙZ]ˆÈ8¢$È8¢$ŒNÈ8¢$ŒÍHXˆK‹Ì‹‹ÌË‹Íˆ][™È[ˆ›ÛÙK‰Ë	ÔØÚY[œÙ˜ZİÜˆKÈHÈHÈÍK‰Ë	Ğ[™\™H]XÚÙ[ˆ˜]Y[ˆÙ]ğíš[™È[HHX‹‰×JWKˆÉĞÛÙ\]Y[[‰ËÛİ\˜Ù\ÊÉÜÜ˜ËÙØ[YKØÛÛX˜][İ™\ËÉË	ÜÜ˜ËÛË[XZ[‹ØØ[\ZYÛ‹Ø]]Üš]Sİ™\š][ÉË	ÜÜ˜ËÛË[XZ[‹ØØ[\ZYÛ‹Ø˜]Q[™Ú[™KÉË	ÜÜ˜ËÛË[XZ[‹ØØ[\ZYÛ‹Ü›ÙÜ™\ÜÚ[Û‹É×JWKˆJJNÂŸB‚™[˜İ[ÛˆYÛÛX˜]
İ]Û˜\ÚİY]JHÂˆÛÛœİ[ÙHİ]\Ó[ÙYšY\œÊÛ˜\Úİ›™YYÊNÂˆ\Ú
İ]	ØÛÛX˜]]\›‰Ë	ØÛÛX˜]	Ë	Ô[™[˜X›]Y‰Ë	Õ™Y™™\‹œ\İÛÛ\ˆ[™Ù]ğíš[™ÉË	ÒØ[\ˆ›Ü›Y[Üš]\ØÚÙ[˜]ZYÚÙZ]ØÚY[‰Ë

HOˆYÙJ	ÒĞST”ÖTÕSIË	Ô[™[˜X›]Y‰Ë	ÕÙ\ˆY\œİÙZ[ˆœ\İX^[][H\œ™ZXÚ™\›Y\‰ËÙXİ[ÛœÊÂˆÉÔØÚš]IËÜ™\™Y
ÉĞ]XÚÙHğé[‹‰Ë	ÑÙ[˜]ZYÚÙZ]™\™XÚ™[‹‰Ë	Õ™Y™™\İ\™‹‰Ë	Ñœ\İ[™İ]\Ë‰Ë	Ó[ÛY[[K‰Ë	ÑÙYÛ™\šÛÛ\‹‰Ë	Ôİ]\Ù]Y\ˆ[™Ù]ğíš[™Ë‰×JWKˆÉĞZİY[\ˆğíœœ\‰Ëİ]ÊÖÉÒÜ˜Y	Ë	Û[ÙœİÙ\‹Ñš^Y
Š_på×KÉÑÙ[˜]ZYÚÙZ]	ËÚYÛ™Y
[Ù˜XØİ\˜XŞJWKÉÕ™\ZYYİ[™ÉË	Û[Ù™Y™[œÙKÑš^Y
Š_på×KÉĞ™]ÙYİ[™ÉË	Û[Ù›[İ™[Y[Ñš^Y
Š_på×KÉÕ™\°í™Ù\[™ÉË	Û[Ùœ™XXİ[Û‘[^S\ßH\×WJWKˆÉÕ™Y™™\™›Ü›Y[	Ë›Ü›][J	Ğ]XÚÙH
Èğíœœ\ˆ
ÈYZ\İ\œØÚY
È›Úİ\È
È›ÛšH
È[™ZÙİH8¢$ˆ[\˜œ™XÚ[™È8¢$ˆÙ]ğíš[™È
ÈÙpí™™›™]\ˆÙYÛ™\‰ÊWKˆÉÔØÚY[œÙ›Ü›Y[	Ë›Ü›][J	ÑÜ[™œ\İ0åÈğíœœ\ˆ0åÈYZ\İ\œØÚY0åÈÙYÛ™\‹UYÈ0åÈÙYÛ™\‹S[İ™H0åÈ\ÙH0åÈÛÛX›È0åÈX[H0åÈÚYY\šÛ[™È0åÈ[™ZÙİH0åÈÚYÛ˜]\ˆ0åÈ›Ü˜™\™Z][™È0åÈÜš]\ØÚ	ÊWKˆÉÒÜš]\ØÚ	Ë\˜\ÊÉÓ›Ü›X[ˆİ\™ˆ8¢iX^
ÈÙ[˜]ZYÚÙZ]0åÌLŠKˆÚYÛ˜]\ˆÙ[˜]ZYÚÙZ]0åÌŒˆØÚY[ˆ0åÌKK‰×JWKˆÉĞÛÙ\]Y[IËÛİ\˜Ù\ÊÉÜÜ˜ËÛË[XZ[‹ØØ[\ZYÛ‹Ø˜]Q[™Ú[™KÉ×JWKˆJJJNÂˆ\Ú
İ]	ØÛÛX˜][ÜÛ™[ÉË	ØÛÛX˜]	Ë	ÑÙYÛ™\œ›Ùš[IË	ÑZ[›\ÜË›Û›H[™ÛÛ›YÉË	Ğ›ÜÜÈİ[™[H[H›Û›IË

HOˆYÙJ	ÑÑQÓ‘T‰Ë	ÑÙYÛ™\œ›Ùš[IË	ÑZYÙ[™Hœ\İÜ™[™[‹ÛÛ\ˆ[™][\ZØ]Ü™[‹‰ËØš™Xİ™[šY\ÊĞSTRQÓ—ÓÔÓ‘S•ÊK›X\

ÚYÜÛ™[JHOˆÜÛ™[Ø\™
YÜÛ™[
JKš›Ú[Š	ÉÊH
ÈÛİ\˜Ù\ÊÉÜÜ˜ËÙØ[YKØÛÛX˜][İ™\ËÉË	ÜÜ˜ËÛË[XZ[‹ØØ[\ZYÛ‹Ø˜]Q[™Ú[™KÉ×JJJNÂˆ\Ú
İ]	ØÛÛX˜]X]]Üš]IË	ØÛÛX˜]	Ë	Ñİ[™[KÕ[HX[š\[Y\™[‰Ë	Ø]]Üš]SX[š\[][Û”ØÛÜ™JY]K™›YÜÊ_HZİ]™HX\šÙ\—	ÓX[š\[Y\˜˜\™H]›Z][™ÈYÛÈÙYØšY\ˆ™Y\ˆÛ™È˜XÚÙ[šÛ]ØÚ\‰Ë

HOˆYÙJ	Ğ“ÔÔÓQPÒS’RÉË	ÓX[š\[Y\˜˜\™H]›Z][™ÉË	ÑÜš[[ZYËX™\ˆ0ï™\ˆYÛË0í˜™[ZİÙYØšY\‹ÜY[İÛˆ[™İ[\[š]X[H™\™XÚ[˜˜\‹‰Ëİ]ÊÖÉÓX\šÙ\‰Ëİš[™Ê]]Üš]SX[š\[][Û”ØÛÜ™JY]K™›YÜÊJWKÉÑYÛÉËY\ÊY]K™›YÜÖÉØ]]Üš]KYYÛËZÛÚÉ×JWKÉÕÙYØšY\‰ËY\ÊY]K™›YÜÖÉØ]]Üš]KYš[šÚ[™ËX›Û™	×JWKÉÕÛÚÛÛ[‰ËY\ÊY]K™›YÜÖÉØ]]Üš]KYÛÛÙÚ[	×JWWJH
ÈÙXİ[ÛœÊÂˆÉÓX\šÙ\‰Ë]]Üš]Q›YÜÊY]K™›YÜÊWKˆÉÔÚØ[Y\[™ÉË[]ÊÉÒ™HX\šÙ\ˆ
ÍH	HÚ\šİ[™ËX^[X[
Ì	K‰Ë	Ôİ\œ\İHX\šÙ\°åÍH
Í™ZHÛÚÛÛ[ÈX^ÍÌŒ‹‰Ë	ÒÛÛ\ˆHX^
Èx¢$“X\šÙ\°åÌÍJK[˜XÚÛÚÛÛ[ˆ0åÌÙYØšY\ˆ0åÌÈZ[š[][HÎ‰×JWKˆÉÔ\Ù[‰ËX›JÉÔ\ÙIË	Ğ™\™ZXÚ	Ë	Ôİ\šÉ×KÖÉÔØÚ˜[šÙ[‹QÛØÚÙ[[Ù\ÉË	Ì8 $ÌÌÈ	IË	Òİ[\[\İ[[][™ËÙ]°éšÉ×KÉĞ[™Ù\ØÚXÚÙ\HİXÚ[ZIË	ÌÍ8 $ÍH	IË	ÕX[KÚ\›YKÚ]‹Ù]°éšÉ×KÉÑÙZÜ°éšİH]š\œœØÚY	Ë	ÍÌ8 $ÌL	IË	ĞÚ[ÜËX[KÚ\›YI×WJWKˆÉĞÛÙ\]Y[[‰ËÛİ\˜Ù\ÊÉÜÜ˜ËÛË[XZ[‹ØØ[\ZYÛ‹Ø]]Üš]Sİ™\š][ÉË	ÜÜ˜ËÛË[XZ[‹ØØ[\ZYÛ‹Ü›ÙÜ™\ÜÚ[Û‹É×JWKˆJJJNÂˆ\Ú
İ]	ØÛÛX˜]\İ]\ÉË	ØÛÛX˜]	Ë	ÒØ[\œİ]\ÉË	Õ[\Ü°é™HY™™ZİIË	ğç™\œ[\[Y\›]Yˆ[\˜œ›ØÚ[ˆX™Ù\ÚXÚ\	Ë

HOˆYÙJ	ÒĞST”ÕUTÉË	Õ[\Ü°é™HY™™ZİIË	Ğ[H[™[™[™HÚ[šİ]Y\ˆ[HK‰ËØš™Xİ™[šY\ÊUWÔÕUTÊK›X\

ÚYÛX™[Y™™XİWJHOˆ\XÛHÛ\ÜÏH˜ÛÙ^\[HXY\İ›Û™Ï—	Ù\ØÊX™[
_OÜİ›Û™ÏÛÙO—	ÚYOØÛÙOÚXY\—	Ù\ØÊY™™Xİ
_OÜØ\XÛO—
Kš›Ú[Š	ÉÊH
È›İJ	ÒÛÛ›ÛIË	ÒÛÛ›ÛTÜ^šX[\ÚY\[™È™\›0é™Ù\Ù\Ù]Hİ]\È[HZ[™H[™K‰ÊJJNÂˆ\Ú
İ]	ØÛÛX˜]]X[IË	ØÛÛX˜]	Ë	ÕX[H[™™YÛZ]\˜Zİ[Û™[‰Ë	ÛY]K˜Xİ]™UX[K›[™İHZİ]—	ÕX[H™YÛZ]\ˆ[ÛY[[HŞ[™\™ÚYIË

HOˆYÙJ	ÕPSIË	Ğ™YÛZ]\ˆ[HØ[\‰Ë	Ğ™YÛZ]\ˆÚØ[Y\™[ˆX[X]XÚÙ[ˆ[™™\Ú]™[ˆZ[›X[YÙH[ÛY[[XZİ[Û™[‹‰Ëİ]ÊÖÉĞZİ]‰ËY]K˜Xİ]™UX[K›X\
˜[YQ›ÜŠKš›Ú[Š	È0­È	ÊH	ÓšY[X[™	×KÉÓ[Z]	Ëİš[™Êİ\œ™[˜[šÊY]JK˜ÛÛ\[š[Û”ÛİÊWKÉÕX[X]XÚÙIË	ÌJÊÜ°í°çÙx¢$ŒJpåÌ	×KÉĞ[™\™H]XÚÙ[‰Ë	ÌJÊÜ°í°çÙx¢$ŒJpåÌ	×WJH
ÈX›JÉĞ™YÛZ]\‰Ë	ĞZİ[Û‰Ë	ÕÚ\šİ[™ÉË	ÒÛÜİ[‰×KØš™Xİ™[šY\ÊÓÓTS’SÓ—ĞPÕSÓ”ÊK›X\

ÚYXİ[Û—JHOˆÛ˜[YQ›ÜŠY
KXİ[Û‹›X™[Xİ[Û‹™]Z[İš[™ÊXİ[Û‹›[ÛY[[JWJJH
ÈŞ[™\™ŞUšY]ÊY]K˜Xİ]™UX[JJJNÂŸB‚™[˜İ[ÛˆYZ[šYØ[Y\Êİ]Y]JHÂˆ›Üˆ
ÛÛœİØÈÙˆRS’WÑĞÔÊHÂˆÛÛœİ™\İ[HY]K›Z[šT™\İ[ÖÙØËšYNÂˆÛÛœİ˜YÙHH™\İ[È	Ü™\İ[Ú[œßK×	Ü™\İ[˜][\ßH0­È	Ü™\İ[˜™\İ]X[]_Wˆ	ÕS•‘T”ÕPÒ	ÎÂˆ\Ú
İ]Z[šYØ[YKW	ÙØËšYW	ÛZ[šYØ[Y\ÉËØË]KØËœİX]K	ÙØË›Øš™Xİ]™_H	ÙØËœ[\Ëš›Ú[Š	È	Ê_H	ÙØË˜\ÜÚ\İË™›]

Kš›Ú[Š	È	Ê_W

HOˆ™[™\“Z[šYØ[YJØË™\İ[Y]K™›YÜÊK˜YÙJNÂˆBŸB™[˜İ[Ûˆ™[™\“Z[šYØ[YJØË™\İ[›YÜÊHÂˆ™]\›ˆYÙJ	ÓRS’TÔQS	Ë	ÙØË]_H0­È	ÙØËœİX]_WØË›Øš™Xİ]™Kİ]ÊÖÉÕ™\œİXÚIËİš[™Ê™\İ[Ë˜][\ÈÏÈ
WKÉÔÚYYÙIËİš[™Ê™\İ[ËÚ[œÈÏÈ
WKÉĞ™\İÙ\	Ëİš[™Ê™\İ[Ë˜™\İÏÈ
WKÉÔ]X[]0é	Ë™\İ[Ë˜™\İ]X[]HÏÈ	Ù˜Z[Y	×WJH
ÈÙXİ[ÛœÊÂˆÉÔİ]Y\[™ÉËÜ™\™Y
ØË˜ÛÛ›ÛÊWKˆÉÔ\Ù[‰Ë[]ÊØËœ\Ù\ÊWKˆÉÑ^Zİ›ÙÜ˜[[ZY\H™YÙ[‰Ë[]ÊØËœ[\ÊWKˆÉÕÙ\[™ÜÙ›Ü›Y[	ËØËœØÛÜ™K›X\
›Ü›][JKš›Ú[Š	ÉÊWKˆÉÔ]X[]0éÜİY™[‰Ë[]ÊØËœ]X[]JWKˆÉĞ™[Ú[™Ù[ˆ[™›ÛÙ[‰Ë[]ÊØËœ™]Ø\™ÊWKˆÉĞÚ\˜Zİ\š[™[‰ËX›JÉÑ›YÉË	Ô]Y[IË	ĞZİ]‰Ë	ÕÚ\šİ[™É×KØË˜\ÜÚ\İË›X\

Ù›YËÛİ\˜ÙKY™™XİJHOˆÙ›YËÛİ\˜ÙKY\Ê›YÜÖÙ›Y×JKY™™XİJJWKˆÉĞY\]™HØÚÚY\šYÚÙZ]	Ë[]ÊÉÑ\œİ\ˆ™\œİXÚ‰Ë	ÖÙZ]\ˆÚ™HÚYYÈL‰Ë	Ñ[˜XÚK‰Ë	ĞXˆˆÚYYÙ[ˆ
ÌK‰Ë	Ğ™\İ]X[]0é\™™Zİ
Ì‰Ë	Ñ[™\™ÚYHÌ
ÌË‰Ë	ÑÜ™[™[ˆ¸ $ÌKN‰×JWKˆÉĞÛÙ\]Y[IËÛİ\˜Ù\ÊÙØËœÛİ\˜ÙWJWKˆJJNÂŸB‚™[˜İ[ÛˆYİ]\Êİ]Û˜\Úİ
HÂˆÛÛœİİ]\Ù\ÈHXİ]™Tİ]\Ù\ÊÛ˜\Úİ›™YYÊNÂˆÛÛœİ[ÙHİ]\Ó[ÙYšY\œÊÛ˜\Úİ›™YYÊNÂˆ›Üˆ
ÛÛœİÚYX™[\™Xİ[Û‹]Z[×HÙˆ‘QQÊHÂˆ\Ú
İ]™YYW	ÚYW	Üİ]\ÉËX™[	ÓX]œ›İ[™
Û˜\Úİ›™YYÖÚYJ_KÌL	Ù\™Xİ[ÛŸH	Ù]Z[Ëš›Ú[Š	È	Ê_W

HOˆYÙJ	Ğ‘Q0ç‘“’TÉËX™[\™Xİ[Û‹İ]ÊÖÉĞZİY[	Ëİš[™ÊX]œ›İ[™
Û˜\Úİ›™YYÖÚYJJWKÉÔİ]\ÉËİ]\Ñ›Ü“™YY
Yİ]\Ù\ÊWWJH
È[]Ê]Z[ÊH
ÈÛİ\˜Ù\ÊÉÜÜ˜ËÙØ[YKÜİ]\ÔŞ\İ[KÉË	ÜÜ˜ËÙØ[YKÜİ]KÑØ[YTİÜ™KÉ×JJJNÂˆBˆ\Ú
İ]	Üİ]\ËXİ\œ™[	Ë	Üİ]\ÉË	ĞZİY[HÙ\Ø[]Ú\šİ[™ÉËİ]\Ù\Ë›X\

İ]\ÊHOˆİ]\ËœÚÜX™[
Kš›Ú[Š	È0­È	ÊH	ÔÕP’S	Ë	ÒÜ˜YÙ[˜]ZYÚÙZ]™\ZYYİ[™ÈÚ\›YH›\	Ë

HOˆYÙJ	Ö•TÕS‘	Ë	ĞZİY[HÙ\Ø[]Ú\šİ[™ÉË	Ğ[HØÚÙ[[ˆÙ\™[ˆÛÛXš[šY\‰Ëİ]ÊÖÉÒÜ˜Y	Ë	Û[ÙœİÙ\‹Ñš^Y
Š_på×KÉÑÙ[˜]ZYÚÙZ]	ËÚYÛ™Y
[Ù˜XØİ\˜XŞJWKÉÕ™\ZYYİ[™ÉË	Û[Ù™Y™[œÙKÑš^Y
Š_på×KÉĞ™]ÙYİ[™ÉË	Û[Ù›[İ™[Y[Ñš^Y
Š_på×KÉÕ™\°í™Ù\[™ÉË	Û[Ùœ™XXİ[Û‘[^S\ßH\×KÉĞÚ\›YIËÚYÛ™Y
[Ù˜Ú\›JWKÉÑ›\	ËÚYÛ™Y
[Ù™›\
WKÉÑ[™\™ÚY]™\˜œ˜]XÚ	Ë	Û[Ù™[™\™ŞQ˜Z[‹Ñš^Y
Š_på×WJH
È
İ]\Ù\Ë›[™İÈİ]\Ù\Ë›X\

İ]\ÊHOˆ›İJ	Üİ]\ËœÚÜX™[H0­È	ÓX]œ›İ[™
İ]\Ëš[[œÚ]H
ˆL
_H	Wİ]\Ë™\ØÜš\[ÛŠJKš›Ú[Š	ÉÊHˆ›İJ	ÔİXš[	Ë	ÒÙZ[ˆØÚÙ[[œİ]\Ë‰ÊJJJNÂˆ\Ú
İ]	Üİ]\Ë[Y]šXÜÉË	Üİ]\ÉË	ÕÛØÚ[™[™Ù\IËğï™H	ÜÛ˜\Úİ›Y]šXÜË™YÛš]_H0­ÈÚ[ÜÈ	ÜÛ˜\Úİ›Y]šXÜË˜Ú[ÜßW	Õğï™HÚ[ÜÈYˆ[ÛY[[IË

HOˆYÙJ	ÓQUUÑT•IË	Õğï™KÚ[ÜËYˆ[™[ÛY[[IË	ÔÛŞšX[H]X[]0é[™™\ÜÛİ\˜Ù[‹‰Ëİ]ÊÖÉÕğï™IËİš[™ÊÛ˜\Úİ›Y]šXÜË™YÛš]JWKÉĞÚ[ÜÉËİš[™ÊÛ˜\Úİ›Y]šXÜË˜Ú[ÜÊWKÉÔY‰Ëİš[™ÊÛ˜\Úİ›Y]šXÜËœ™\]][ÛŠWKÉÓ[ÛY[[IËİš[™ÊÛ˜\Úİ›Y]šXÜË›[ÛY[[JWWJH
ÈX›JÉÕÙ\	Ë	Ñ[šİ[Û‰×KÖÉÕğï™IË	ÒÛÛ›ÛKÔ™\İ™\ÜZİ‰×KÉĞÚ[ÜÉË	Ñ\ÚØ[][ÛÈØÚY]X[˜Ú[ˆ›ÛX[™[‹‰×KÉÔY‰Ë	ÒÛÛ\][È[›\[™ØÛÜ™K‰×KÉÓ[ÛY[[IË	Ğ™YÛZ]\˜Zİ[Û™[ˆ[™ÚYÛ˜]\˜]XÚÙ[‹‰×WJJJNÂŸB‚™[˜İ[ÛˆY][\Êİ]Û˜\Úİ
HÂˆ›Üˆ
ÛÛœİ][HÙˆØš™Xİ˜[Y\ÊUSTÊJHÂˆÛÛœİÛİ[HÛ˜\Úİš[™[ÜVÚ][KšYHÏÈÂˆ\Ú
İ]][KW	Ú][KšYW	Ú][\ÉË	Ú][KšXÛÛŸH	Ú][K›X™[W	Ú][KœšXÙ_H8 «0­È™\İ[™	ØÛİ[W	Ú][KšYH	Ú][K™\ØÜš\[ÛŸH	ÓØš™XİšÙ^\Ê][K™Y™™XİÈÏÈßJKš›Ú[Š	È	Ê_W

HOˆYÙJ	ÑÑQÑS”ÕS‘	Ë	Ú][KšXÛÛŸH	Ú][K›X™[W][K™\ØÜš\[Û‹İ]ÊÖÉÒQ	Ë][KšYKÉÔ™Z\ÉË	Ú][KœšXÙ_H8 «KÉÓX^[X[	Ëİš[™Ê][K›X^
WKÉĞ™\İ[™	Ëİš[™ÊÛİ[
WWJH
È
][K™Y™™XİÈÈX›JÉÕÙ\	Ë	ğá™\[™É×KØš™Xİ™[šY\Ê][K™Y™™XİÊK›X\

ÚY˜[YWJHOˆÛ™YY˜[YJY
KÚYÛ™Y
˜[YJWJJHˆ›İJ	Ô]Y\İÙYÙ[œİ[™	Ë	ÓšXÚ\™Zİ™[]˜˜\ÈÚ\šİ[™È[ˆ[\˜Zİ[Û‹‰ÊJH
È][S›İJ][KšY
H
ÈÛİ\˜Ù\ÊÉÜÜ˜ËÙØ[YKØÛÛ[ÉË	ÜÜ˜ËÙØ[YKÜİ]KÑØ[YTİÜ™KÉ×JJKÛİ[ˆÈ	ØÛİ[på×ˆ[™Yš[™Y
NÂˆBŸB‚™[˜İ[ÛˆY]Y\İÊİ]Y]JHÂˆ\Ú
İ]	Ü]Y\İYš[˜[IË	Ü]Y\İÉË	Ñš[˜[Hœ™Z\ØÚ[[‰Ë	Ùš[˜[T›ÙÜ™\ÜÊY]J_KÍ™Y[™İ[™Ù[—	Ñš[˜[H™ZHZİ]š]0é[ˆ›Û›IË

HOˆYÙJ	Ñ’SSIË	ÔÛÛ›YÜØX›˜ZYHœ™Z\ØÚ[[‰Ë	Ñ™ZH[\œØÚYYXÚHZİ]š]0é[ˆ\È›Û›K‰Ëİ]ÊÖÉĞZİ]š]0é[‰Ë	ØÛÛ\]YXİ]š]Y\ÊY]J_KÌ×KÉÔ›Û›IËY\ÊY]K™›YÜËœ›Û›QY™X]Y
WKÉÑš[˜[HZİ]‰ËY\ÊY]Kœ]Y\İİYÙHOOH	Üİ[™^KYš[˜[	ÊWKÉÑÙ]ÛÛ›™[‰ËY\ÊY]K™š[˜[˜]UÛÛŠWWJH
È[]ÊÉĞZİ]š]0é[ˆ›\İ\™Y\ˆÛ™Ë›[šŞX˜[ÛÛ[H[œÈØÚ[ˆYHXÚÙK‰Ë	ÓZ[™\İ[œÈ™ZH™\œØÚYY[™K‰Ë	Ô›Û›HÙ\\˜]™\ÚYYÙ[‹‰×JJJNÂˆ›Üˆ
ÛÛœİÚY]KØš™Xİ]™K\™Ù]ÛÛ\][Û—HÙˆUQTÕÔÕQÑTÊHÂˆ\Ú
İ]]Y\İW	ÚYW	Ü]Y\İÉË]KYOOHY]Kœ]Y\İİYÙHÈ	ĞRÕU‰ÈˆY	ÛØš™Xİ]™_H	İ\™Ù]H	ØÛÛ\][ÛŸW

HOˆYÙJ	ÒĞSTQÓ‘S”ÕQ‘IË]KØš™Xİ]™Kİ]ÊÖÉÒQ	ËYKÉÖšY[	Ë\™Ù]KÉÔİ]\ÉËYOOHY]Kœ]Y\İİYÙHÈ	ĞZİ]‰ÈˆİYÙTİ]JYY]Kœ]Y\İİYÙJWWJH
È›İJ	ĞXœØÚ\ÜİÚ\šİ[™ÉËÛÛ\][ÛŠH
ÈÛİ\˜Ù\ÊÉÜÜ˜ËÛË[XZ[‹ØØ[\ZYÛ‹ÛY]TİÜ™KÉ×JJKYOOHY]Kœ]Y\İİYÙHÈ	ĞRÕU‰Èˆ[™Yš[™Y
NÂˆBˆ›Üˆ
ÛÛœİ]Y\İÙˆØš™Xİ˜[Y\ÊUQTÕÊJHÂˆ\Ú
İ]˜\Ù\]Y\İW	Ü]Y\İšYW	Ü]Y\İÉË]Y\İ]K	Ğ˜\Ú\ÜŞ\İ[KT]Y\İ	Ë	Ü]Y\İ›Øš™Xİ]™_H	Ü]Y\İœ™]Ø\™W

HOˆYÙJ	ĞTÒTÔUQTÕ	Ë]Y\İ]K]Y\İ›Øš™Xİ]™KX›JÉÒQ	Ë	Ğ™[Ú[™É×KÖÜ]Y\İšY]Y\İœ™]Ø\™WJH
È›İJ	ÑZ[›Ü™[™ÉË	ÑYHËRØ[\YÛ™HYİZ[™H]Z[Y\\™HİY™[›ÙÚZÈ\°ï™\‹‰ÊJJNÂˆBŸB‚™[˜İ[ÛˆY›ÙÜ™\ÜÚ[ÛŠİ]Y]JHÂˆ\Ú
İ]	Ü›ÙÜ™\ÜË\ØÛÜ™IË	Ü›ÙÜ™\ÜÚ[Û‰Ë	ÕÛØÚ[™[™Ù\	Ë	ÛY]KÙYZÙ[™ØÛÜ™_H[šİW	ÔØÛÜ™H›Ü›Y[˜[™È™^šYZ[™Ù[ˆ›ÛX[™IË

HOˆYÙJ	Ñ“Ô•ĞÒ’U	Ë	ÕÛØÚ[™[™Ù\	Ë	Ğ°ï™[Ø[\YÛ™KÜY[K™^šYZ[™Ù[‹›ÛX[™[‹YZ\İ\œØÚY[™š\ÚZÛË‰Ëİ]ÊÖÉÕÙ\	Ëİš[™ÊY]KÙYZÙ[™ØÛÜ™JWKÉÔ˜[™ÉË˜[šÓ˜[YJY]KÙYZÙ[™˜[šÊWKÉĞ]XÚÙ[œ0é™IËİš[™Êİ\œ™[˜[šÊY]JK˜]XÚÔÛİÊWKÉĞ™YÛZ]\œ0é™IËİš[™Êİ\œ™[˜[šÊY]JK˜ÛÛ\[š[Û”ÛİÊWWJH
È›Ü›][J	ÌHZ[›\ÜÈ
ÈLİ›ÛH
ÈL\œİ\ÈšY\ˆ
Èš[˜[H
ÈÚYYÙpåÌLˆ
È\™™Zİ0åÎ
È[™ZÙİ[°åÍH
ÈYZ\İ\œØÚY
È›ÛX[™[°åÌN
È™^šYZ[™Ù[°åÌLˆ
È\›ZXÚ\[™Ù[°åÌÈ8¢$ˆ™\™XÚ0åÌMIÊH
ÈØÛÜ™Pœ™XZÙİÛŠY]JH
ÈÛİ\˜Ù\ÊÉÜÜ˜ËÛË[XZ[‹ØØ[\ZYÛ‹ÛY]TİÜ™KÈ0­È™XØ[İ[]TØÛÜ™I×JJJNÂˆ\Ú
İ]	Ü›ÙÜ™\ÜË\˜[šÜÉË	Ü›ÙÜ™\ÜÚ[Û‰Ë	ÕÛØÚ[™[™°é™ÙIË˜[šÓ˜[YJY]KÙYZÙ[™˜[šÊK	Ô˜[™ÈÛİÈYÙ[™H^]ÜÉË

HOˆYÙJ	Ô°á‘ÑIË	ÕÛØÚ[™[™°é™ÙIË	Ğ™\İ[[Y[ˆ]XÚÙ[‹H[™™YÛZ]\œ0é™K‰ËX›JÉÔ˜[™ÉË	ÓZ[™\İÙ\	Ë	Ğ]XÚÙ[‰Ë	Ğ™YÛZ]\‰Ë	Ôİ]\É×KÑQRÑS‘ÔS’ÔË›X\

˜[šÊHOˆÜ˜[šË›X™[İš[™Ê˜[šË›Z[”ØÛÜ™JKİš[™Ê˜[šË˜]XÚÔÛİÊKİš[™Ê˜[šË˜ÛÛ\[š[Û”ÛİÊK˜[šËšYOOHY]KÙYZÙ[™˜[šÈÈ	ĞRÕQS	Èˆ	É×JJH
È›İJ	ÑÜ™[™IËX^[X[	ÓPVÑTURTQĞUPÒÔßH]XÚÙ[‹—
JJNÂˆ\Ú
İ]	Ü›ÙÜ™\ÜË[X\İ\IË	Ü›ÙÜ™\ÜÚ[Û‰Ë	Ğ]XÚÙ[›YZ\İ\œØÚY	Ë	ÓØš™XİšÙ^\ÊY]K˜]XÚÓX\İ\JK›[™İH˜Z[šY\	ÓLˆLÈÚ\šİ[™ÈÛÛ›ÛHÚYÛ˜]\‰Ë

HOˆYÙJ	ÓQRTÕT”ĞÒQ•	Ë	Ğ]XÚÙ[ˆ˜Z[šY\™[‰Ë	ÑZ[œğé™H[™™Y™™\ˆÙ\™[ˆ]Y\šYÙ^°é‰ËX›JÉĞ]XÚÙIË	ÑZ[œğé™IË	Õ™Y™™\‰Ë	ÔİY™IË	ÖÙZYÉ×KY]K›X\›™Y]XÚÜË›X\

Y
HOˆÈÛÛœİX\İ\HHY]K˜]XÚÓX\İ\VÚYNÈ™]\›ˆĞÓÓPUÓSÕ‘TÖÚYKœÚÜX™[İš[™ÊX\İ\OË\Ù\ÈÏÈ
Kİš[™ÊX\İ\OËœİXØÙ\ÜÙ\ÈÏÈ
KW	ÛX\İ\OË›]™[ÏÈ_Wœ˜[˜ÚX™[
X\İ\OË˜œ˜[˜Ú
WNÈJJH
È[]ÊÉÓLˆZ[œğé™H[™È™Y™™\‹‰Ë	ÓLÎˆHZ[œğé™H[™È™Y™™\‹‰Ë	ÕÚ\šİ[™Îˆ0åÌKK‰Ë	ÒÛÛ›ÛNˆ
ÍÈÙ[˜]ZYÚÙZ]
ÌHİ]\Ü[™K‰Ë	ÓLËTÚYÛ˜]\ˆˆ[ÛY[[K
ÍˆÙ[˜]ZYÚÙZ]0åÌKÎØÚY[‹‰×JJJNÂˆ\Ú
İ]	Ü›ÙÜ™\ÜËX[™XÙİ\ÉË	Ü›ÙÜ™\ÜÚ[Û‰Ë	Ğ[™ZÙİ[‰Ë	ÛY]K[›ØÚÙY[™XÙİ\Ë›[™İK×	ÓØš™XİšÙ^\ÊS‘PÑÕTÊK›[™İW	Ğ[™ZÙİ[ˆ]\ÙÙ\°ïİ]Ø[\˜›Û\ÉË

HOˆYÙJ	ĞS‘RÑÕS‰Ë	ÕÛØÚ[™[™YÙ[™[‰Ë	Ğ™\ÛÛ™\™H\™›ÛÙH[™™ZØÚ0éÙHÙ\™[ˆ[ÈØ[\˜›ÛšHÙ\ÜZXÚ\‰ËØš™Xİ˜[Y\ÊS‘PÑÕTÊK›X\

[™XÙİJHOˆ[™XÙİPØ\™
[™XÙİKY]JJKš›Ú[Š	ÉÊH
ÈÛİ\˜Ù\ÊÉÜÜ˜ËÛË[XZ[‹ØØ[\ZYÛ‹Ü›ÙÜ™\ÜÚ[Û‹É×JJJNÂˆ\Ú
İ]	Ü›ÙÜ™\ÜË]X[IË	Ü›ÙÜ™\ÜÚ[Û‰Ë	ÕX[^\Ø[[Y[œİ[[™ÉËY]K˜Xİ]™UX[K›X\
˜[YQ›ÜŠKš›Ú[Š	È0­È	ÊH	ÒÙZ[ˆX[IË	Ô™ZÜ]Y\[™ÈØÚÙ[HŞ[™\™ÚYIË

HOˆYÙJ	ÕPSQ“Ô•ĞÒ’U	Ë	ĞZİ]™\ÈX[IË	Ñœ™][™H™[°íYÙ[ˆ™Y™™[ˆ[™™^šYZ[™ÜÜØÚÙ[K‰Ëİ]ÊÖÉĞZİ]‰ËY]K˜Xİ]™UX[K›X\
˜[YQ›ÜŠKš›Ú[Š	È0­È	ÊH	ÓšY[X[™	×KÉÓ[Z]	Ëİš[™Êİ\œ™[˜[šÊY]JK˜ÛÛ\[š[Û”ÛİÊWWJH
ÈX›JÉÑœ™][™	Ë	ÔØÚÙ[IË	ĞZİ]‰Ë	Ôİ0éšÙ[‰×KØš™Xİ˜[Y\Ê”’QS‘Ô“Ñ’STÊK›X\

œšY[™
HOˆÛ˜[YQ›ÜŠœšY[™šY
Kİš[™ÊœšY[™œ™XÜZ]Y[™\ÚÛ
KY\ÊY]K˜Xİ]™UX[Kš[˜ÛY\ÊœšY[™šY
JKœšY[™œİ™[™İËš›Ú[Š	È0­È	ÊWJJH
ÈŞ[™\™ŞUšY]ÊY]K˜Xİ]™UX[JJJNÂŸB‚™[˜İ[ÛˆYÛÜ›
İ]Û˜\Úİ
HÂˆ\Ú
İ]	İÛÜ›\™YÚ[ÛœÉË	İÛÜ›	Ë	Ô™YÚ[Û™[‰Ë	ÔÚYX™[ˆ[šİ[ÛœØ™\™ZXÚIË	Ğ[šİ[™™[˜[™\İÚY\ÙHİ˜[™XÚ	Ë

HOˆYÙJ	ÕÑS	Ë	Ô™YÚ[Û™[‰Ë	ÑYHØ\H\İ‹Œ0åÌKZ[šZ][ˆÜ›ğçË‰Ëİ]ÊÖÉÔÜÚ][Û‰Ë	ÓX]œ›İ[™
Û˜\ÚİÛÜ›ÜÚ][Û‹
_K×	ÓX]œ›İ[™
Û˜\ÚİÛÜ›ÜÚ][Û‹J_WKÉÕÙ[	Ë	Ì‹Œ0åÌK	×KÉÒØ[Y\˜IË	ÌKŒ0åÍÌŒ	×KÉÑÜ[™[\ÉË	ÌNMHZ[šZ][‹ÜÉ×WJH
ÈX›JÉÒQ	Ë	Ó˜[YIË	Ñ[šİ[Û‰×K‘QÒSÓ”ÊH
ÈÛİ\˜Ù\ÊÉÜÜ˜ËÙØ[YKØY\šX[Ø[\Ü›İ[™[‹ÉË	ÜÜ˜ËÛË[XZ[‹ØØ[\ZYÛ‹İÛÜ›ØÙ[™KÉ×JJJNÂˆ›Üˆ
ÛÛœİÚ[™ÙˆÉÜİÜIË	ÜÙ\šXÙIË	ÛZ[šYØ[YIË	Û[™X\šÉ×JHÂˆÛÛœİ\İHSÒS•TPÕSÓ”Ë™š[\Š
[\˜Xİ[ÛŠHOˆ[\˜Xİ[Û‹šÚ[™OOHÚ[™
NÂˆ\Ú
İ]ÛÜ›W	ÚÚ[™W	İÛÜ›	ËÚ[™˜[YJÚ[™
K	Û\İ›[™İHÜW	ÚÚ[™H	Û\İ›X\

][JHOˆ][K›X™[
Kš›Ú[Š	È	Ê_W

HOˆYÙJ	ÒS•TRÕSÓ‘S‰ËÚ[™˜[YJÚ[™
KÚ[™\ØÜš\[ÛŠÚ[™
KX›JÉÓÜ	Ë	ÒQ	Ë	ÔÜÚ][Û‰Ë	Ô˜Y]\ÉË	ÑZ[›\ÜÉ×K\İ›X\

][JHOˆÚ][K›X™[][KšY	Ú][KK×	Ú][K_Wİš[™Ê][Kœ˜Y]\ÊKY\Ê›ÛÛX[Š][Kœ™\]Z\™\ÑØ]JJWJJH
ÈÛİ\˜Ù\ÊÉÜÜ˜ËÛË[XZ[‹ØØ[\ZYÛ‹ØÛÛ[É×JJJNÂˆBˆ\Ú
İ]	İÛÜ›[X\	Ë	İÛÜ›	Ë	ÓZ[šZØ\H[™šY[°ï[™ÉË	ÑÙ[ˆšY[0­ÈÙZpçÈÜY[\‰Ë	ÓZ[š[X\›Úİ\È\İ[‰Ë

HOˆYÙJ	ÓU’QĞUSÓ‰Ë	ÓZ[šZØ\IË	ÕÙ[ÛÛÜ™[˜][ˆÙ\™[ˆ[ˆZ[™HÌÌ0åÌŒÌT^[RØ\H0ï™\œÙ]‰Ë[]ÊÉÔÚØ[Y\[™ÈLÌÌÌŒOLŒÌÌN‰Ë	ÑÙ[ˆ]Y\İšY[‰Ë	ÕÙZpçÎˆÜY[\‹‰Ë	Ñ\İ[ˆ]ZÛY\ØÚÙ\[™]‰Ë	Ñ›Úİ\ÎˆL\ÈØÚÙ[šË˜XÚML\ÈÚYY\ˆÜY[\™›ÛÙK‰×JH
ÈÛİ\˜Ù\ÊÉÜÜ˜ËÛË[XZ[‹ØØ[\ZYÛ‹Ø\È0­È˜]ÓZ[š[X\	Ë	ÜÜ˜ËÛË[XZ[‹ØØ[\ZYÛ‹İÛÜ›ØÙ[™KÈ0­È^\›˜[›Øİ\É×JJJNÂŸB‚™[˜İ[Ûˆ\Ú
İ]YØ]YÛÜK]KİX]KÙ^]ÛÜ™Ë™[™\‹˜YÙJHÈİ]œ\Ú
ÈYØ]YÛÜK]KİX]K˜YÙKÙX\˜Úˆ	İ]_H	ÜİX]_H	ÚÙ^]ÛÜ™ßWÓØØ[SİÙ\Ø\ÙJ	ÙIÊK™[™\ˆJNÈB™[˜İ[ÛˆYÙJÚXÚÙ\‹]K[›ËÛÛ[
HÈ™]\›ˆ\XÛHÛ\ÜÏH˜ÛÙ^\YÙHXY\ˆÛ\ÜÏH˜ÛÙ^\YÙKZXYÜ[—	Ù\ØÊÚXÚÙ\Š_OÜÜ[—	Ù\ØÊ]J_OÚ—	Ù\ØÊ[›Ê_OÜÚXY\—	ØÛÛ[OØ\XÛO—ÈB™[˜İ[ÛˆÙXİ[ÛœÊ›İÜÊHÈ™]\›ˆ›İÜË›X\

İ]KÛÛ[JHOˆÙXİ[ÛˆÛ\ÜÏH˜ÛÙ^\ÙXİ[ÛˆÏ—	Ù\ØÊ]J_OÚÏ—	ØÛÛ[OÜÙXİ[Û—
Kš›Ú[Š	ÉÊNÈB™[˜İ[Ûˆİ]Ê›İÜÊHÈ™]\›ˆ]ˆÛ\ÜÏH˜ÛÙ^\İ]YÜšY—	Ü›İÜË›X\

ÛX™[˜[YWJHOˆ]ÛX[—	Ù\ØÊX™[
_OÜÛX[İ›Û™Ï—	Ù\ØÊ˜[YJ_OÜİ›Û™ÏÙ]—
Kš›Ú[Š	ÉÊ_OÙ]—ÈB™[˜İ[ÛˆX›JXY\œË›İÜÊHÈ™]\›ˆ]ˆÛ\ÜÏH˜ÛÙ^]X›K]Ü˜\X›OXY—	ÚXY\œË›X\

XY\ŠHOˆ—	Ù\ØÊXY\Š_Oİ—
Kš›Ú[Š	ÉÊ_OİİXY›ÙO—	Ü›İÜË›X\

›İÊHOˆ—	Ü›İË›X\

Ù[
HOˆ—	Ù\ØÊÙ[
_Oİ—
Kš›Ú[Š	ÉÊ_Oİ—
Kš›Ú[Š	ÉÊ_Oİ›ÙOİX›OÙ]—ÈB™[˜İ[Ûˆ\˜\Ê[™\ÊHÈ™]\›ˆ[™\Ë›X\

[™JHOˆ—	Ù\ØÊ[™J_OÜ—
Kš›Ú[Š	ÉÊNÈB™[˜İ[Ûˆ[]Ê[™\ÊHÈ™]\›ˆ[—	Û[™\Ë›X\

[™JHOˆO—	Ù\ØÊ[™J_OÛO—
Kš›Ú[Š	ÉÊ_Oİ[—ÈB™[˜İ[ÛˆÜ™\™Y
[™\ÊHÈ™]\›ˆÛ—	Û[™\Ë›X\

[™JHOˆO—	Ù\ØÊ[™J_OÛO—
Kš›Ú[Š	ÉÊ_OÛÛ—ÈB™[˜İ[Ûˆ›Ü›][J^
HÈ™]\›ˆ]ˆÛ\ÜÏH˜ÛÙ^Y›Ü›][H—	Ù\ØÊ^
_OÙ]—ÈB™[˜İ[Ûˆ›İJ]K^
HÈ™]\›ˆ\ÚYHÛ\ÜÏH˜ÛÙ^[›İHİ›Û™Ï—	Ù\ØÊ]J_OÜİ›Û™Ï—	Ù\ØÊ^
_OÜØ\ÚYO—ÈB™[˜İ[ÛˆÛİ\˜Ù\Ê]ÊHÈ™]\›ˆ]ˆÛ\ÜÏH˜ÛÙ^\Ûİ\˜Ù\È—	Ü]Ë›X\

]
HOˆÛÙO—	Ù\ØÊ]
_OØÛÙO—
Kš›Ú[Š	ÉÊ_OÙ]—ÈB™[˜İ[ÛˆÚYÛ™Y
˜[YJHÈÛÛœİ[X™\ˆHX]œ›İ[™
[X™\Š˜[YJH
NÈ™]\›ˆ	Û[X™\ˆHÈ	ÊÉÈˆ	ÉßW	Û[X™\ŸWÈB™[˜İ[ÛˆY\Ê˜[YJHÈ™]\›ˆ˜[YHÈ	Ò˜IÈˆ	Ó™Z[‰ÎÈB™[˜İ[ÛˆRY
Y
HÈÛÛœİ›ÙHHØİ[Y[™Ù][[Y[RY
Y
NÈYˆ
[›ÙJH›İÈ™]È\œ›ÜŠZ\ÜÚ[™ÈÛÙ^[[Y[ˆ	ÚYW
NÈ™]\›ˆ›ÙNÈB™[˜İ[Ûˆ\ØÊ˜[YJHÈ™]\›ˆİš[™Ê˜[YHÏÈ	ÉÊKœ™\XÙJÖÉ‰È—KÙË
Ú\ŠHOˆ
È	É‰Îˆ	É˜[\ÉË	Ï	Îˆ	É›ÉË	Ï‰Îˆ	É™İÉË‰Èˆ	ÉˆÌÎNÉË	È‰Îˆ	Éœ][İÉÈJVØÚ\—JNÈB™[˜İ[Ûˆ˜[YQ›ÜŠY
HÈ™]\›ˆĞSTRQÓ—ĞÒTPÕT—Ğ–WÒQÚYOË›˜[YHÏÈÒTPÕT—Õ“ÒPÑTÖÚYOË›˜[YHÏÈYÈB™[˜İ[Ûˆİ\œ™[˜[šÊY]JHÈ™]\›ˆÑQRÑS‘ÔS’ÔË™š[™

˜[šÊHOˆ˜[šËšYOOHY]KÙYZÙ[™˜[šÊHÏÈÑQRÑS‘ÔS’ÔÖÌNÈB™[˜İ[Ûˆ˜[šÓ˜[YJY
HÈ™]\›ˆÑQRÑS‘ÔS’ÔË™š[™

˜[šÊHOˆ˜[šËšYOOHY
OË›X™[ÏÈYÈB™[˜İ[ÛˆİYÙS˜[YJY
HÈ™]\›ˆUQTÕÔÕQÑTË™š[™

İYÙJHOˆİYÙVÌHOOHY
OË–ÌWHÏÈYÈB™[˜İ[Ûˆ™YY˜[YJY
HÈ™]\›ˆ‘QQË™š[™

™YY
HOˆ™YYÌHOOHY
OË–ÌWHÏÈYÈB™[˜İ[ÛˆÛÛ\]YXİ]š]Y\ÊY]JHÈ™]\›ˆÉÙ›\İ\	Ë	Ø™Y\”Û™ÉË	Ù›[šŞX˜[	Ë	ÛX\ÛÛIË	ÚYÙTYI×K™š[\Š
Y
HOˆ
Y]K›Z[šT™\İ[ÖÚYOË˜][\ÈÏÈ
Hˆ
YOOH	ÚYÙTYIÈ	‰ˆY]K™›YÜËšYÙT™[Y]™Y
JK›[™İÈB™[˜İ[Ûˆš[˜[T›ÙÜ™\ÜÊY]JHÈ™]\›ˆX]›Z[ŠËÛÛ\]YXİ]š]Y\ÊY]JJH
È
Y]K™›YÜËœ›Û›QY™X]YÈHˆ
NÈB™[˜İ[ÛˆY™™Xİ]™[™\ÜÊ˜XİÜŠHÈ™]\›ˆ˜XİÜˆHKMHÈ	Ù^™[YHØÚğéÚIÈˆ˜XİÜˆHKŒHÈ	ÜÙZˆİ\šÉÈˆ˜XİÜˆHÌˆÈ	ÜØÚØXÚ	Èˆ	Û›Ü›X[	ÎÈB™[˜İ[ÛˆİYÙTİ]JYİ\œ™[
HÈÛÛœİÜ™\ˆHUQTÕÔÕQÑTË›X\

İYÙJHOˆİYÙVÌJNÈ™]\›ˆÜ™\‹š[™^ÙŠY
HÜ™\‹š[™^ÙŠİ\œ™[
HÈ	ĞX™Ù\ØÚÜÜÙ[‰Èˆ	Ó›ØÚšXÚZİ]‰ÎÈB™[˜İ[Ûˆ™\ÜÛœÙTÛÛÊÛÛ
HÈ™]\›ˆØš™Xİ™[šY\ÊÛÛ
K›X\

ÚY[™\×JHOˆ]Z[Ïİ[[X\O—	Ù\ØÊT“ĞPÒÚYJ_OÜİ[[X\O—	Ü\˜\Ê[™\Ê_OÙ]Z[Ï—
Kš›Ú[Š	ÉÊNÈB™[˜İ[ÛˆX[Tİ]ÊY[X™\ŠHÈ™]\›ˆX›JÉÑ™[	Ë	ÕÙ\	×KÖÉÓ]™[	Ëİš[™ÊY[X™\‹›]™[
WKÉÑ[ØÚÜÜÙ[šZ]	Ë	ÛY[X™\‹œ™\ÛÛ™_K×	ÛY[X™\‹›X^™\ÛÛ™_WKÉÓŞX[]0é	Ëİš[™ÊY[X™\‹›ŞX[JWKÉÒØ[\‰ËÚYÛ™Y
Y[X™\‹˜›Û\Ù\Ë˜˜]JWKÉÔÛŞšX[	ËÚYÛ™Y
Y[X™\‹˜›Û\Ù\ËœÛØÚX[
WKÉÔÜY[IËÚYÛ™Y
Y[X™\‹˜›Û\Ù\Ë™Ø[Y\ÊWKÉÑ\šÛ[™ÉËÚYÛ™Y
Y[X™\‹˜›Û\Ù\Ëœ™XÛİ™\JWWJNÈB™[˜İ[Ûˆ›ÛX[˜ÙUšY]ÊY›Ùš[KÛ˜\ÚİY]JHÈÛÛœİİ]HHY]Kœ›ÛX[˜ÙVÚYNÈ™]\›ˆ\˜\ÊÜ›Ùš[K™\ØÜš\[Û—JH
Èİ]ÊÖÉÒ[\™\ÜÙIËİš[™Êİ]Kš[\™\İ
WKÉÕ™\œİXÚKÑ\™›ÛÙIË	Üİ]K˜][\ßK×	Üİ]KœİXØÙ\ÜÙ\ßWKÉÑÜ™[™\œİ0í°çÙIËİš[™Êİ]K˜›İ[™\TİšZÙ\ÊWKÉÔ›Ø™IË	Ù›\Ú[˜ÙJYÛ˜\Úİ
_KÌŒWJH
ÈX›JÉĞ™\™ZXÚ	Ë	ÕÙ\	×KÖÉÑİ]HÙ\ØÚ[šÙIË›Ùš[Kœ™Y™\œ™YÚYË›X\

][JHOˆUSTÖÚ][WOË›X™[ÏÈ][JKš›Ú[Š	È0­È	ÊWKÉÔØÚXÚHÙ\ØÚ[šÙIË›Ùš[K™\ÛZÙYÚYË›X\

][JHOˆUSTÖÚ][WOË›X™[ÏÈ][JKš›Ú[Š	È0­È	ÊWKÉĞ™]›ÜYİ	Ë›Ùš[Kœ™Y™\œËš›Ú[Š	È0­È	ÊWKÉÓZX‰Ë›Ùš[Kœ™Z™XİËš›Ú[Š	È0­È	ÊWWJNÈB™[˜İ[Ûˆ]]Üš]Q›YÜÊ›YÜÊHÈÛÛœİ›İÜÈHÖÉØ]]Üš]KYYÛËZÛÚÉË	ÑYÛÈÙZØ\\	Ë	Òİ[\[Ö\İ[[][™È
Ìˆ	I×KÉØ]]Üš]KYÛÜÜÚ\X›Û™	Ë	Ô0í˜™[Zİ	Ë	ÕÚ]‹ÕX[KĞÚ[ÜÈ
ÌŒ	I×KÉØ]]Üš]KYš[šÚ[™ËX›Û™	Ë	ÕÙYØšY\‰Ë	ÑÙ]°éšÈ
Íˆ	KÛÛ\ˆØÚğéÚ\‰×KÉØ]]Üš]K\Û™ËXÚ[[™ÙIË	Ğ™Y\‹TÛ™ËTİÛ‰Ë	ÔÛ™ËQY[
ÍLˆ	I×KÉØ]]Üš]K[˜XÚÙ[‹XØ[Xœ˜]Y	Ë	Ó˜XÚÙ[šÛ]ØÚ\‰Ë	Ó˜XÚÙ[‹Ô0í˜™[
ÌÎ	I×KÉØ]]Üš]KYÛÛÙÚ[	Ë	ÕÛÚÛÛ[‰Ë	ÒÛÛ\ˆ0åÌ™\™XÚ[™ÜØ[Y\‰×KÉİ[K\›İ]KZÛ›İÛYÙIË	Ô›İ][Ú\ÜÙ[‰Ë	Ô]›İZ[[ˆ0åÌÍ‰×WNÈ™]\›ˆX›JÉÑ›YÉË	Ó˜[YIË	ĞZİ]‰Ë	ÕÚ\šİ[™É×K›İÜË›X\

Ù›YË˜[YKY™™XİJHOˆÙ›YË˜[YKY\Ê›YÜÖÙ›Y×JKY™™XİJJNÈB™[˜İ[Ûˆ]XÚÕ^
YX[TÚ^™JHÈ™]\›ˆÈ	ØÛ\ÜÚXËZYÚYš]™IÎˆ	ø '”\ÜİÚY¸ '\Èİ[\[S˜XÚÙ[šÛ]ØÚ\‹‰Ë	Ø[K\Ú\\ÚİÉÎˆ	Ğ[KTÚ\[ÈÛÛ™\›ÛXXÚ‰Ë	ØYÜ™YKX[]Ø^IÎˆ	Ğ™ZYHH[ˆZ[šYÈ™\›°ï™YÙ[ˆ\šÛ0é™[‹‰Ë	ÛÙÚXØ[X\™İ[Y[	Îˆ	Ğ™]ÙZ\Ù°ï[™È]Yˆ™]XÚ[HšY\™XÚÙ[‰Ë	ÙKXÛİ[\‰Îˆ	Ó\ˆ8 '”İ\šËÚY¸ '[ÛÜ[‹‰Ë	ØØ[\[™ËXÚZ\‹X›ØÚÉÎˆ	ĞšY\˜˜[šËTÚ]˜›ØÚØYK‰Ë	Ø™Y\‹[Ù™™\‰Îˆ	Ò[™\ÈšY\ˆ[ÈœšYY[œİ™\˜YË‰Ë	ÜŞ[˜Ú›Ûš\ÙYXÚY\‰Îˆ	İX[TÚ^™_Hİ[[Y[ˆ8 '’UÓÓÒQˆx '	Øİ\Y^YKXÛÛXİ	Îˆ	Ğ™Y\‹TÛ™ËVØ[™ÜÙY[Z]Z[œØ]‹‰Ë	İİ[Y^YÙÙ\˜][Û‰Îˆ	Ô]Ø\SYÙ[™[›0ïÙK‰ÈVÚYHÏÈYÈB™[˜İ[ÛˆX\İ\UšY]ÊYY]JHÈÛÛœİX\İ\HHY]K˜]XÚÓX\İ\VÚYNÈÛÛœİ™^H
X\İ\OË›]™[ÏÈJHOOHHÈ	ÓX]›X^
H
X\İ\OË\Ù\ÈÏÈ
J_HZ[œğé™HÈ	ÓX]›X^
ÈH
X\İ\OËœİXØÙ\ÜÙ\ÈÏÈ
J_H™Y™™\ˆš\ÈL—ˆ
X\İ\OË›]™[ÏÈJHOOHˆÈ	ÓX]›X^
HH
X\İ\OË\Ù\ÈÏÈ
J_HZ[œğé™HÈ	ÓX]›X^
ÈH
X\İ\OËœİXØÙ\ÜÙ\ÈÏÈ
J_H™Y™™\ˆš\ÈL×ˆ	ÓX^[][IÎÈ™]\›ˆX›JÉÑZ[œğé™IË	Õ™Y™™\‰Ë	ÔİY™IË	ÖÙZYÉË	Ó°éÚİ\ÈšY[	×KÖÔİš[™ÊX\İ\OË\Ù\ÈÏÈ
Kİš[™ÊX\İ\OËœİXØÙ\ÜÙ\ÈÏÈ
KW	ÛX\İ\OË›]™[ÏÈ_Wœ˜[˜ÚX™[
X\İ\OË˜œ˜[˜Ú
K™^WJNÈB™[˜İ[Ûˆİ]\Ñ›Ü“™YY
Yİ]\Ù\ÊHÈYˆ
YOOH	Ø[ÛÚÛ	ÊH™]\›ˆİ]\Ù\Ë™š[™

İ]\ÊHOˆÉØ[™Ù][šÙ[‰Ë	Ø™][šÙ[‰Ë	İ›Û	×Kš[˜ÛY\Êİ]\ËšY
JOË›X™[ÏÈ	ÒÙZ[ˆ[ÛÚÛİ]\ÉÎÈYˆ
YOOH	ÚYÚ™\ÜÉÊH™]\›ˆİ]\Ù\Ë™š[™

İ]\ÊHOˆÉØœ™Z]	Ë	ÜÙZ‹Xœ™Z]	×Kš[˜ÛY\Êİ]\ËšY
JOË›X™[ÏÈ	ÒÛ\‰ÎÈYˆ
YOOH	Ú[™Ûİ™\‰ÊH™]\›ˆİ]\Ù\Ë™š[™

İ]\ÊHOˆİ]\ËšYOOH	ÚØ]\‰ÊOË›X™[ÏÈ	ÒÙZ[ˆØ]\‰ÎÈYˆ
YOOH	Ù[™\™ŞIÊH™]\›ˆİ]\Ù\Ë™š[™

İ]\ÊHOˆİ]\ËšYOOH	Ù\œØÚÙ\	ÊOË›X™[ÏÈ	ÓšXÚ\œØÚ0íœ	ÎÈYˆ
YOOH	İ\œİ	ÊH™]\›ˆİ]\Ù\Ë™š[™

İ]\ÊHOˆİ]\ËšYOOH	ÙZYšY\	ÊOË›X™[ÏÈ	ÓšXÚZYšY\	ÎÈ™]\›ˆ	ÒÙZ[ˆZYÙ[™\ˆØÚÙ[[œİ]\ÉÎÈB™[˜İ[Ûˆ][S›İJY
HÈYˆ
YOOH	ÚÛÜ\Y\‰ÊH™]\›ˆ›İJ	Ô]Y\İ[šİ[Û‰Ë	ÒØ[›ˆX[›šH0ï™\™ÙX™[ˆÙ\™[ˆ[™ØÚ[][\œİ0ï[™Èœ™ZK‰ÊNÈYˆ
YOOH	ØšY\‰ÊH™]\›ˆ›İJ	Ö\Ø]‰Ë	Ó][™ÎˆÚ[ÜÈ
ÌK[ÛY[[H
ÌKˆ\œİ\ÈšY\ˆ\İ]Y\İ‰ÊNÈYˆ
YOOH	Ø˜]YIÊH™]\›ˆ›İJ	Ö\Ø]‰Ë	Ó][™ÎˆÚ[ÜÈ
Ì‹[ÛY[[H
ÌKˆİ\ÚHZ\ÈX‹‰ÊNÈ™]\›ˆ	ÉÎÈB™[˜İ[ÛˆŞ[™\™ŞUšY]ÊX[JHÈÛÛœİŞ[™\™ÚY\ÈHXİ]™UX[TŞ[™\™ÚY\ÊX[JNÈ™]\›ˆÙXİ[ÛœÊÖÉĞZİ]™HŞ[™\™ÚY[‰ËŞ[™\™ÚY\Ë›[™İÈX›JÉÓ˜[YIË	Ğ™\ØÚ™ZX[™ÉË	ÒØ[\‰Ë	ÔÛŞšX[	Ë	ÔÜY[IË	Ñ\šÛ[™É×KŞ[™\™ÚY\Ë›X\

Ş[™\™ŞJHOˆÜŞ[™\™ŞK›X™[Ş[™\™ŞK™\ØÜš\[Û‹ÚYÛ™Y
Ş[™\™ŞK˜˜]JKÚYÛ™Y
Ş[™\™ŞKœÛØÚX[
KÚYÛ™Y
Ş[™\™ŞK™Ø[Y\ÊKÚYÛ™Y
Ş[™\™ŞKœ™XÛİ™\JWJJHˆ\˜\ÊÉÒÙZ[™HZİ]™HYš[šY\HŞ[™\™ÚYK‰×JWWJNÈB™[˜İ[ÛˆÜÛ™[Ø\™
YÜÛ™[
HÈ™]\›ˆ\XÛHÛ\ÜÏH˜ÛÙ^[ÜÛ™[XY\]Ü[—	Ù\ØÊY
_OÜÜ[Ï—	Ù\ØÊÜÛ™[›˜[YJ_OÚÏ—	Ù\ØÊÜÛ™[]J_OÜÙ]—	ÛÜÛ™[›X^œ\İ˜][ÛŸH”•TÕØÚXY\—	İX›JÉÔ\˜[Y]\‰Ë	ÕÙ\	×KÖÉÑZYÙ[œØÚY[‰ËÜÛ™[˜Z]Ëš›Ú[Š	È0­È	ÊWKÉÑÜ[™ÛÛ\‰Ëİš[™ÊÜÛ™[˜˜\ÙPÛİ[\‘œ\İ˜][ÛŠWKÉÒÛÛ\^IËİš[™ÊÜÛ™[˜Ûİ[\“[™\Ë›[™İ
WWJ_O]Z[Ïİ[[X\O]XÚÙ[›][\ZØ]Ü™[Üİ[[X\O—	İX›JÉĞ]XÚÙIË	Ñ˜ZİÜ‰×KØš™Xİ™[šY\ÊÜÛ™[›[İ™S][\Y\œÊK›X\

Û[İ™K˜[YWJHOˆĞÓÓPUÓSÕ‘TÖÛ[İ™WOËœÚÜX™[ÏÈ[İ™K[X™\Š˜[YJKÑš^Y
ŠWJJ_OÙ]Z[Ï]Z[Ïİ[[X\O’Ø]YÛÜšY[Üİ[[X\O—	İX›JÉÕYÉË	Ñ˜ZİÜ‰×KØš™Xİ™[šY\ÊÜÛ™[YÓ][\Y\œÊK›X\

İYË˜[YWJHOˆÕQÔÖİY×HÏÈYË[X™\Š˜[YJKÑš^Y
ŠWJJ_OÙ]Z[ÏØ\XÛO—ÈB™[˜İ[Ûˆ[™XÙİPØ\™
[™XÙİKY]JHÈÛÛœİ[›ØÚÙYHY]K[›ØÚÙY[™XÙİ\Ëš[˜ÛY\Ê[™XÙİKšY
NÈÛÛœİ\]Z\YHY]K™\]Z\Y[™XÙİ\Ëš[˜ÛY\Ê[™XÙİKšY
NÈ™]\›ˆ\XÛHÛ\ÜÏH˜ÛÙ^X[™XÙİH	İ[›ØÚÙYÈ	İ[›ØÚÙY	Èˆ	ÛØÚÙY	ßHXY\]Ü[—	Ø[™XÙİKšYOÜÜ[Ï—	Ù\ØÊ[™XÙİK›X™[
_OÚÏÙ]—	Ù\]Z\YÈ	ĞUTÑÑT°çÕU	Èˆ[›ØÚÙYÈ	Ñ”‘RIÈˆ	ÑÑTÔT”•	ßOØÚXY\—	Ù\ØÊ[™XÙİK™]Z[
_OÜÛX[—	Ù\ØÊ[™XÙİK˜ÛÛX˜]^
_OÜÛX[Ø\XÛO—ÈB™[˜İ[ÛˆØÛÜ™Pœ™XZÙİÛŠY]JHÈÛÛœİÚ[œÈHØš™Xİ˜[Y\ÊY]K›Z[šT™\İ[ÊKœ™YXÙJ
İ[K™\İ[
HOˆİ[H
È™\İ[Ú[œË
NÈÛÛœİ\™™XİÈHØš™Xİ˜[Y\ÊY]K›Z[šT™\İ[ÊK™š[\Š
™\İ[
HOˆ™\İ[˜™\İ]X[]HOOH	Ü\™™Xİ	ÊK›[™İÈÛÛœİ›ÛX[˜ÙHHØš™Xİ˜[Y\ÊY]Kœ›ÛX[˜ÙJKœ™YXÙJ
İ[Kİ]JHOˆİ[H
ÈX]›X^
İ]Kš[\™\İ
K
NÈÛÛœİ™[][ÛœÚ\ÈHØš™Xİ˜[Y\ÊY]Kœ™[][ÛœÚ\›Û\ÊKœ™YXÙJ
İ[K˜[YJHOˆİ[H
È˜[YK
NÈÛÛœİX\İ\HHØš™Xİ˜[Y\ÊY]K˜]XÚÓX\İ\JKœ™YXÙJ
İ[Kİ]JHOˆİ[H
È

İ]OË›]™[ÏÈJHHJH
ˆK
NÈ™]\›ˆX›JÉÔ]Y[IË	Ğ™\™XÚ[™ÉË	Ğ™Z]˜YÉ×KÖÉÑZ[›\ÜÉËY\ÊY]K˜]]Üš]P˜]UÛÛŠKY]K˜]]Üš]P˜]UÛÛˆÈ	ÌIÈˆ	Ì	×KÉÔİ›ÛIËY\ÊY]KœİÙ\ÛÛ›™XİY
KY]KœİÙ\ÛÛ›™XİYÈ	ÌL	Èˆ	Ì	×KÉÑ\œİ\ÈšY\‰ËY\ÊY]K™š\œİ™Y\“Ü[™Y
KY]K™š\œİ™Y\“Ü[™YÈ	ÌL	Èˆ	Ì	×KÉÑš[˜[IËY\ÊY]K™š[˜[˜]UÛÛŠKY]K™š[˜[˜]UÛÛˆÈ	Í	Èˆ	Ì	×KÉÔÚYYÙIË	İÚ[œßpåÌL—İš[™ÊÚ[œÈ
ˆLŠWKÉÔ\™™Zİ	Ë	Ü\™™XİßpåÎİš[™Ê\™™XİÈ
ˆ
WKÉĞ[™ZÙİ[‰Ë	ÛY]K[›ØÚÙY[™XÙİ\Ë›[™İpåÍWİš[™ÊY]K[›ØÚÙY[™XÙİ\Ë›[™İ
ˆJWKÉÓYZ\İ\œØÚY	Ë	ÍH™HİY™IËİš[™ÊX\İ\JWKÉÔ›ÛX[™[‰Ë	Ü›ÛX[˜Ù_påÌN
›ÛX[˜ÙH
ˆŒN
KÑš^Y
JWKÉĞ™^šYZ[™Ù[‰Ë	Ü™[][ÛœÚ\ßpåÌL—
™[][ÛœÚ\È
ˆŒLŠKÑš^Y
JWKÉÑ\›ZXÚ\[™ÉË	ÛY]Kœ™[YYÛİ[påÌ×İš[™ÊY]Kœ™[YYÛİ[
ˆÊWKÉÕ™\™XÚ	Ë	ÛY]Kœİ\ÜXÚ[ÛŸpåø¢$ŒMW
[Y]Kœİ\ÜXÚ[Ûˆ
ˆŒMJKÑš^Y
JWWJNÈB™[˜İ[ÛˆÚ[™˜[YJÚ[™
HÈ™]\›ˆÈİÜNˆ	ÔİÜKR[\˜Zİ[Û™[‰ËÙ\šXÙNˆ	Õ™\œÛÜ™İ[™È[™ZIËZ[šYØ[YNˆ	ÓZ[š\ÜY[ÜIË[™X\šÎˆ	ÓÜšY[Y\[™ÜÛÜIÈVÚÚ[™NÈB™[˜İ[ÛˆÚ[™\ØÜš\[ÛŠÚ[™
HÈ™]\›ˆÈİÜNˆ	Ó[™X\™H[šİ[™Ü]Y\İ‰ËÙ\šXÙNˆ	ÔİXš[\ÚY\[™È[™Y[°ïË‰ËZ[šYØ[YNˆ	ÓZ[š\ÜY[Ù\ˆœ\İY[‰Ë[™X\šÎˆ	Õ™Y™œ[šİ[™ÜšY[Y\[™Ë‰ÈVÚÚ[™NÈB™[˜İ[ÛˆÛÙ^Ú[

HÈ™]\›ˆÙXİ[ÛˆYH˜Ø[\ZYÛ‹XÛÙ^ˆÛ\ÜÏH›[Ù[ÛÙ^[[Ù[ˆY[\XÛHÛ\ÜÏH˜ÛÙ^]Ú[™İÈXY\ˆÛ\ÜÏH˜ÛÙ^ZXY\ˆ]Ü[”ÔQSPÓÑV0­ÈU‘HUTÈSˆÖTÕSQUSÜÜ[•[\ÈÙˆH›]YHYšXOÚYH˜ÛÙ^XØ]YÛÜKXÛÜHÜÙ]]ÛˆYH˜ÛÙ^XÛÜÙHˆÛ\ÜÏH›[Ù[^ˆ\OH˜]Ûˆˆ\šXK[X™[HÛÙ^ØÚYpçÙ[ˆ°åÏØ]ÛÚXY\]ˆÛ\ÜÏH˜ÛÙ^]ÛÛÈX™[Ü[[\È\˜ÚİXÚ[ÜÜ[[œ]YH˜ÛÙ^\ÙX\˜Úˆ\OHœÙX\˜ÚˆXÙZÛ\HÚ\˜Zİ\‹]XÚÙKÙ\›YÈÙ\ˆ™YÙ[8 )ˆˆ]]ØÛÛ\]OH›Ù™ˆÛX™[ˆYH˜ÛÙ^XÛİ[ØÙ]˜]ˆYH˜ÛÙ^]XœÈˆÛ\ÜÏH˜ÛÙ^]XœÈÛ˜]]ˆÛ\ÜÏH˜ÛÙ^X›ÙH\ÚYHYH˜ÛÙ^Y[K[\İˆÛ\ÜÏH˜ÛÙ^Y[K[\İØ\ÚYOXZ[ˆYH˜ÛÙ^Y]Z[ˆÛ\ÜÏH˜ÛÙ^Y]Z[ÛXZ[Ù]Ø\XÛOÜÙXİ[Û—ÈB‚›[İ[Ø[\ZYÛÛÙ^

NÂ˜œ™\XÙJ×š[\ÜÊÖ××JÎ×Ê‰ÙÛK
Kœ™\XÙJ×™^ÜÊËÙÛK
Kœ™\XÙJ›İJ	Õ™\™™Z[™\[™ÜÜ[šİ	Ë	ĞÚ\›X[\İYXÚ[š\ØÚØÚğéÚ\ˆ[™ÙX[™[‹‰ÊJNØ›İJ	Õ™\™™Z[™\[™ÜÜ[šİ	Ë	ĞÚ\›X[\İYXÚ[š\ØÚØÚğéÚ\ˆ[™ÙX[™[‹‰ÊJJNØ
Kœ™\XÙJÉİÛÜ›	Ë	ø£%‰Ë	ÕÙ[	ˆÜIË	Ô™YÚ[Û™[‹[\˜Zİ[ÛœÛÜKØ\H[™™]ÙYİ[™ÜÜ™YÙ[‹‰×KÉİÙYZÙ[™	Ë	ø¦ 	Ë	ÕÛØÚ[™[™›ÙÙ[‰Ë	Ñœ™Z]YËSÛ[\XYK˜XÚ0é›K°é[][™ÜÜ]Y\İ˜]\İØ[\‹YY\ˆ[™ÙXÜ™]Z[[Û°é‹‰×KˆÉİÛÜ›	Ë	ø£%‰Ë	ÕÙ[	ˆÜIË	Ô™YÚ[Û™[‹[\˜Zİ[ÛœÛÜKØ\H[™™]ÙYİ[™ÜÜ™YÙ[‹‰×K
Kœ™\XÙJYÛÜ›
™\İ[Û˜\Úİ
NØ™\İ[œ\Ú
‹‹˜Z[ÙYZÙ[™\˜ĞÛÙ^[šY\ÊÛ˜\ÚİY]JJNÂˆYÛÜ›
™\İ[Û˜\Úİ
NØ
KY^ĞÓÓPUÓSÕ‘TÎš™KPVÑTURTQĞUPÒÔÎUSTÎšUQTÕÎ“]”’QS‘Ô“Ñ’STÎœÛ”’QS‘ÕPSWÓQSP‘T”Î˜ÛXİ]™UX[TŞ[™\™ÚY\Î›“ÓPSÑWÔ“Ñ’STÎ™›\Ú[˜ÙN™›Ø[YTİÜ™NšÜ‹ÕÔQÑWÒÑVN‘‹Xİ]™Tİ]\Ù\Î‘YKİ]\Ó[ÙYšY\œÎ‘KSÒS•TPÕSÓ”ÎšÛ‹ĞSTRQÓ—ĞÒTPÕT—Ğ–WÒQ•‹ĞSTRQÓ—ÓÔÓ‘S•Î•ËÒTPÕT—Õ“ÒPÑTÎ’İ]]Üš]SX[š\[][Û”ØÛÜ™N[‹[œİ[]]Üš]Sİ™\š][œÛ‹Ø[\ZYÛ“Y]N•ËS‘PÑÕTÎ‘™KÓÓTS’SÓ—ĞPÕSÓ”Î’YKÑQRÑS‘ÔS’ÔÎ”Kœ˜[˜ÚX™[•™KZ[ÙYZÙ[™\˜ĞÛÙ^[šY\Î˜YŸNÑ[˜İ[ÛŠ\[™[˜ÚY\ØÛÛœİÂˆÓÓPUÓSÕ‘TËˆPVÑTURTQĞUPÒÔËˆUSTËˆUQTÕËˆ”’QS‘Ô“Ñ’STËˆ”’QS‘ÕPSWÓQSP‘T”ËˆXİ]™UX[TŞ[™\™ÚY\Ëˆ“ÓPSÑWÔ“Ñ’STËˆ›\Ú[˜ÙKˆØ[YTİÜ™KˆÕÔQÑWÒÑVKˆXİ]™Tİ]\Ù\Ëˆİ]\Ó[ÙYšY\œËˆSÒS•TPÕSÓ”ËˆĞSTRQÓ—ĞÒTPÕT—Ğ–WÒQˆĞSTRQÓ—ÓÔÓ‘S•ËˆÒTPÕT—Õ“ÒPÑTËˆ]]Üš]SX[š\[][Û”ØÛÜ™Kˆ[œİ[]]Üš]Sİ™\š][ˆØ[\ZYÛ“Y]KˆS‘PÑÕTËˆÓÓTS’SÓ—ĞPÕSÓ”ËˆÑQRÑS‘ÔS’ÔËˆœ˜[˜ÚX™[ˆZ[ÙYZÙ[™\˜ĞÛÙ^[šY\ËˆHH\[™[˜ÚY\Î×‰ÚÙŸX
JYŠNİ˜\ˆ™X[\ËX›]YKXYšXK[Ë[XZ[‹]ŒXYXÛ\ÜŞÙÙ]][J
^Ü™]\›ˆØØ[İÜ˜YÙK™Ù]][J™Š_\Ù]][JK
^ÛØØ[İÜ˜YÙKœÙ]][J™‹
_\™[[İ™R][J
^ÛØØ[İÜ˜YÙKœ™[[İ™R][J™Š__K™‹HLK™HLKY^ØÚ[\İˆLİX™YNˆLÚ\˜Xİ\‘]NˆLK[™]È]]][Û“ØœÙ\™\Š

OO™Š
JNÕËœİXœØÜšX™JOOÚÛÊËœ›ÙÜ™\ÜÚ[ÛÛÛ^

JK™Ÿ™ŠJK™Š
_JKÚ[™İË˜Y]™[\İ[™\ŠËXØ[\ZYÛ‹X]XÚË]\ÙX
OOÕËœ™XÛÜ™]XÚÕ\ÙJK™]Z[šYK™]Z[œİXØÙ\ÜÊ_JJKÚ[™İË˜Y]™[\İ[™\ŠËXØ[\ZYÛ‹X˜]K\İ]X
OOÕYŠK™]Z[
KK™]Z[™š[š\ÚY	‰™K™]Z[ÛÛ‰‰™K™]Z[›ÜÛ™[YOOX›Û›X	‰•Ëœ™XÛÜ™˜]UšXİÜJ›Û›X
_JJK‹›ØœÙ\™JØİ[Y[™Øİ[Y[[[Y[YŠKÚ[™İË˜Y]™[\İ[™\ŠØY

OO™Š
JK™Š
NÙ[˜İ[Ûˆ™ŠJ^Ñ™HLİ^ÙKœ]Y\İİYÙOOOX™][š[Û˜	‰™K™š\œİ™Y\“Ü[™Y	‰™K˜Xİ]™UX[K›[™İLI‰•ËœÙ]İYÙJœ™YK]ÙYZÙ[™YHÜ\H\İÚYY\ˆ›Ûİ0é™YÈÙ[YË[H[ØÚZY[™Ù[ˆÛÛZİ]ˆ˜[ØÚH™Y™™[‹ˆ\Èœ™ZYHÛØÚ[™[™H™YÚ[›˜
NÙ›ÜŠ]İ—[ÙˆØš™Xİ™[šY\ÊÙ›\İ\ÜØÛÜ™NŒLL‹[™XÙİN˜[X][Û˜ÙXK™Y\”Û™ÎÜØÛÜ™NŒL[™XÙİN˜˜[šË\ÚİK›[šŞX˜[ÜØÛÜ™NŒMK[™XÙİN˜İÜ[YX[œË\İÜKX\ÛÛNÜØÛÜ™NŒMK[™XÙİN˜X\Û][›™[_JJJK›Z[šT™\İ[ÖİOË˜™\İÏÌ
O[‹œØÛÜ™I‰•Ë[›ØÚĞ[™XÙİJ‹˜[™XÙİJNÙK™›YÜËšYÙT™[Y]™Y	‰™Kœİ\ÜXÚ[ÛMI‰•Ë[›ØÚĞ[™XÙİJYÙK\Ú[[
KK™›YÜËšYÙPØ]YÚ	‰•Ë[›ØÚĞ[™XÙİJİ[™[K[›İY
KK™›YÜÖØ›ÙÜ™\ÜÚ[Û‹]ŒË[Û›[™X_ËœÙ]›YÊ›ÙÜ™\ÜÚ[Û‹]ŒË[Û›[™XL
_Yš[˜[^Ñ™HL__Y[˜İ[Ûˆ™Š
^ÔŸ
HLÚ[™İËœÙ][Y[İ]


OOÔHLK‹™\ØÛÛ›™Xİ

Nİ^Ğ™Š
K™Š
KŠ
NÛ]OP[Ê
NÙI‰•YŠJ_Yš[˜[^Ó‹›ØœÙ\™JØİ[Y[™Øİ[Y[[[Y[YŠ__KMŠJ_Y[˜İ[Ûˆ™Š
^Û]OYØİ[Y[™Ù][[Y[RY
ÙYZÙ[™\ØÛÜ™X
OË˜ÛÜÙ\İ
Ü\İ]Ø
NÚYŠI‰ˆYKœ]Y\TÙ[XİÜŠœ˜[šËX˜YÙX
J^Û]YØİ[Y[˜Ü™X]Q[[Y[
[X
Nİ˜Û\ÜÓ˜[YOX˜[šËX˜YÙXš[›™\’SXÛX[”•QÜÛX[İ›Û™ÏÜİ›Û™Ï˜K˜\[™

_[]SJËœÛ˜\Úİ

KÙYZÙ[™ØÛÜ™JKYOËœ]Y\TÙ[XİÜŠœ˜[šËX˜YÙHİ›Û™Ø
NÛ‰‰›‹^ÛÛ[OO]›X™[	‰Š‹^ÛÛ[]›X™[
NÛ]UËœÛ˜\Úİ

NÙØİ[Y[œ]Y\TÙ[XİÜ[
Ù]KX]XÚË]ÙÙÛWX
K™›Ü‘XXÚ
OOÛ]YK™]\Ù]˜]XÚÕÙÙÛK\‹˜]XÚÓX\İ\VİKOYKœ]Y\TÙ[XİÜŠÛX[
KOX	Ü‹™\]Z\Y]XÚÜËš[˜ÛY\Ê
OØ]\ÙÙ\°ïİ]˜Ù[\›H0­ÈIÛË›]™[ÏÌ_H0­È	Õ™JË˜œ˜[˜Ú
_XÚI‰šK^ÛÛ[OOXI‰ŠK^ÛÛ[XJ_JNÛ]OYØİ[Y[™Ù][[Y[RY
]XÚË[\İ
NÚYŠJ^Û]OZKœ\™[[[Y[Ëœ]Y\TÙ[XİÜŠ˜[™XÙİKZY
NÙ_
OYØİ[Y[˜Ü™X]Q[[Y[
]˜
KK˜Û\ÜÓ˜[YOX[™XÙİKZYKœ\™[[[Y[Ë˜\[™
JJNÛ]X[™ZÙİ[ˆ	Ü‹™\]Z\Y[™XÙİ\Ë›[™İKÌØ‰Ü‹™\]Z\Y[™XÙİ\Ë›X\
OO˜Ü[‰ÖŠ™VÙWK›X™[
_OÜÜ[˜
Kš›Ú[Š
_ÛX[“›ØÚÙZ[™H]\ÙÙ\°ïİ]ÜÛX[˜XÙKš[›™\’SOO]	‰ŠKš[›™\’S]
__Y[˜İ[Ûˆ™Š
^Û]OYØİ[Y[™Ù][[Y[RY
Ù[™\šXË[[Ù[
KYØİ[Y[™Ù][[Y[RY
[Ù[]]X
KYØİ[Y[™Ù][[Y[RY
[Ù[[Ü[ÛœØ
NÚYŠY_KšY[Ÿ][Ÿ^ÛÛ[OOXX[H[™]XÚÙ[˜
\™]\›Û][‹œ]Y\TÙ[XİÜŠœ›ÙÜ™\ÜÚ[Û‹]ÛÛØ
NÚYŠŠ\™]\›Û]OUËœÛ˜\Úİ

NÜYØİ[Y[˜Ü™X]Q[[Y[
ÙXİ[Û˜
K‹˜Û\ÜÓ˜[YOX›ÙÜ™\ÜÚ[Û‹]ÛÛØÛ]OZK›X\›™Y]XÚÜË›X\
OOÛ]ZK˜]XÚÓX\İ\VÙWNÜ™]\›ˆ]›]™[Ø˜œ˜[˜ÚØ]ˆÛ\ÜÏH›X\İ\K\›İÈİ›Û™Ï‰ÖŠ™VÙWKœÚÜX™[
_H0­ÈYZ\İ\œØÚY	İ›]™[OÜİ›Û™ÏÛX[‰Õ™J˜œ˜[˜Ú
_OÜÛX[Ù]˜˜]ˆÛ\ÜÏH›X\İ\K\›İÈİ›Û™Ï‰ÖŠ™VÙWKœÚÜX™[
_H0­ÈÜ^šX[\ÚY\[™ÏÜİ›Û™Ï]]Ûˆ]KXœ˜[˜ÚHš[\Xİˆ]K[X\İ\OH‰Ù_H•Ú\šİ[™ÏØ]Û]Ûˆ]KXœ˜[˜ÚH˜ÛÛ›Ûˆ]K[X\İ\OH‰Ù_H’ÛÛ›ÛOØ]ÛÙ]Ù]˜JKš›Ú[Š
KÏZK[›ØÚÙY[™XÙİ\Ë›X\
OO˜]ÛˆÛ\ÜÏH˜[™XÙİKXÚÚXÙH	ÚK™\]Z\Y[™XÙİ\Ëš[˜ÛY\ÊJOØ\]Z\Y˜Hˆ]KX[™XÙİOH‰Ù_Hİ›Û™Ï‰ÖŠ™VÙWK›X™[
_OÜİ›Û™ÏÛX[‰ÖŠ™VÙWK™]Z[
_OÜÛX[Ø]Û˜
Kš›Ú[Š
NÜ‹š[›™\’SXXY\Ü[’ĞST”“ÑÔ‘TÔÒSÓÜÜ[İ›Û™Ï‰ÓJKÙYZÙ[™ØÛÜ™JK›X™[OÜİ›Û™ÏÛX[‰ÕË˜]XÚÔÛİ[Z]

_H]XÚÙ[ˆ0­È	ÓJKÙYZÙ[™ØÛÜ™JK˜ÛÛ\[š[Û”ÛİßH™YÛZ]\ˆ0­Èˆ[™ZÙİ[ÜÛX[ÚXY\‰Ø_]XÚÙ[ˆİZYÙ[ˆ\˜Ú\™›ÛÜ™ZXÚHZ[œğé™H]Y‹ˆXˆYZ\İ\œØÚYˆÚ\™Z[™HÜ^šX[\ÚY\[™ÈÙ]ğéÜ˜OÏ[™ZÙİ[ÚÏ]ˆÛ\ÜÏH˜[™XÙİKYÜšY‰Ûß“YÙ[™0é™HÙ\ˆZ[›XÚHZ[š\ÜY[\™ÙX›š\ÜÙHÙ\™[ˆY\ˆ]\Ü°ïİ˜\‹Ü˜OÙ]˜‹˜\[™
ŠK‹œ]Y\TÙ[XİÜ[
Ù]K[X\İ\WX
K™›Ü‘XXÚ
OO™K˜Y]™[\İ[™\ŠÛXÚØ

OOÕË˜ÚÛÜÙP]XÚĞœ˜[˜Ú
K™]\Ù]›X\İ\KK™]\Ù]˜œ˜[˜Ú
KËœ™[[İ™J
K™Š
_JJK‹œ]Y\TÙ[XİÜ[
Ù]KX[™XÙİWX
K™›Ü‘XXÚ
OO™K˜Y]™[\İ[™\ŠÛXÚØ

OOÕËÙÙÛP[™XÙİJK™]\Ù]˜[™XÙİJKËœ™[[İ™J
K™Š
_JJ_Y[˜İ[ÛˆŠ
^Û]OYØİ[Y[™Ù][[Y[RY
Ù[™\šXË[[Ù[
KYØİ[Y[™Ù][[Y[RY
[Ù[[Ü[ÛœØ
KUËœÛ˜\Úİ

NÚYŠY_KšY[Ÿ]‹œ]Y\İİYÙHOOXİ[™^KYš[˜[œ]Y\TÙ[XİÜŠÙ]K\İ\Yš[˜[X
J\™]\›Û]YØİ[Y[˜Ü™X]Q[[Y[
]Û˜
NÜ‹™]\Ù]œİ\š[˜[XX‹˜Û\ÜÓ˜[YOXÛ™KY[™Ù\ˆš[˜[\İ\‹š[›™\’SXİ›Û™Ï”ÛÛ›YÜØX›˜ZYH™YÚ[›™[Üİ›Û™ÏÛX[‘™Z\\ÚYÙ\ˆ[™Ø[\‹ˆX[KYZ\İ\œØÚYYˆ[™[™ZÙİ[ˆÚ\šÙ[ˆ›Ûİ0é™YËÜÛX[˜‹˜Y]™[\İ[™\ŠÛXÚØÙŠKœ™\[™
Š_Y[˜İ[ÛˆYŠJ^Û]YØİ[Y[™Ù][[Y[RY
˜]K[[Ù[
NÚYŠ]šY[Š\™]\›Û]YØİ[Y[™Ù][[Y[RY
˜]K\›İ[™
KX[™H	ÙKœ›İ[™H0­È	ÙKœ\ÙSX™[H0­È[ÛY[[H	Ø8¥ãØœ™\X]
K›[ÛY[[J_IØ8¥âØœ™\X]
ËYK›[ÛY[[J_XÛ‰‰›‹^ÛÛ[OO\‰‰Š‹^ÛÛ[\ŠKÙŠJNÛ]OYØİ[Y[™Ù][[Y[RY
˜]K[[İ™\Ø
NÚYŠZ_K™š[š\ÚY
\™]\›ÚKœ]Y\TÙ[XİÜ[
œ›ÙÜ™\ÜÚ[Û‹\İ\ÜœÚYÛ˜]\™KX]Û˜
K™›Ü‘XXÚ
OO™Kœ™[[İ™J
JNÛ]OUËœÛ˜\Úİ

NÚKœ]Y\TÙ[XİÜ[
Ù]KX˜]K[[İ™WX
K™›Ü‘XXÚ
OÛ]]™]\Ù]˜˜]S[İ™NÚYŠK˜]XÚÓX\İ\VÛ—OË›]™[OOLÊ^Û]YØİ[Y[˜Ü™X]Q[[Y[
]Û˜
NÜ‹˜Û\ÜÓ˜[YOXÚYÛ˜]\™KX]Û˜‹™\ØX›YYK›[ÛY[[O‹‹š[›™\’SXİ›Û™Ï”ÒQÓUTˆ0­È“OÜİ›Û™ÏÛX[‰ÖŠ™VÛ—KœÚÜX™[
_H[ˆYZ\İ\œØÚYÏÜÛX[˜‹˜Y]™[\İ[™\ŠÛXÚØ

OOÚ›ÊŠK˜ÛXÚÊ
_JK˜Y\ŠŠ__JNÛ]ÏYØİ[Y[˜Ü™X]Q[[Y[
ÙXİ[Û˜
NÛË˜Û\ÜÓ˜[YOX›ÙÜ™\ÜÚ[Û‹\İ\ÜËš[›™\’SXXY\İ›Û™Ï™YÛZ]\˜Zİ[Û™[Üİ›Û™ÏÛX[‘Z[›X[›ÈØ[\ˆ0­ÈÛÜİ[ˆ[ÛY[[OÜÛX[ÚXY\˜Ù›ÜŠ]ÙˆK˜Xİ]™UX[J^Û]RYVİNÚYŠ[ŠXÛÛ[YNÛ]YØİ[Y[˜Ü™X]Q[[Y[
]Û˜
NÜ‹™\ØX›YYK\ÙYÛÛ\[š[ÛœËš[˜ÛY\Ê
_K›[ÛY[[O‹›[ÛY[[K‹š[›™\’SXİ›Û™Ï‰ÖŠ‹›X™[
_H0­È	Û‹›[ÛY[[_SOÜİ›Û™ÏÛX[‰ÖŠ‹™]Z[
_OÜÛX[˜‹˜Y]™[\İ[™\ŠÛXÚØ

OOÛ]OS[Ê
NÚYŠJ^ÖYŠK˜[š[X][ÛŠNÛ]P[Ê
NÛ‰‰•YŠŠ__JKË˜\[™
Š_XK˜Xİ]™UX[K›[™İ	‰šK˜\[™
Ê_Y[˜İ[ÛˆÙŠJ^Û]YØİ[Y[™Ù][[Y[RY
˜]K\^Y\‹X˜\˜
KYØİ[Y[™Ù][[Y[RY
˜]KY[™[^KX˜\˜
Nİ	‰Šœİ[KÚYX	ÙKœ^Y\‹™œ\İ˜][Û‹ÙKœ^Y\‹›X^œ\İ˜][ÛŠŒLIX
K‰‰Š‹œİ[KÚYX	ÙK™[™[^K™œ\İ˜][Û‹ÙK™[™[^K›X^œ\İ˜][ÛŠŒLIX
NÛ]YØİ[Y[™Ù][[Y[RY
˜]K\^Y\‹]˜[YX
KOYØİ[Y[™Ù][[Y[RY
˜]KY[™[^K]˜[YX
NÜ‰‰Š‹^ÛÛ[X	ÓX]œ›İ[™
Kœ^Y\‹™œ\İ˜][ÛŠ_HÈ	ÙKœ^Y\‹›X^œ\İ˜][ÛŸX
KI‰ŠK^ÛÛ[X	ÓX]œ›İ[™
K™[™[^K™œ\İ˜][ÛŠ_HÈ	ÙK™[™[^K›X^œ\İ˜][ÛŸX
NÛ]OYØİ[Y[™Ù][[Y[RY
˜]K[ÙØ
KÏYK›ÙËœÛXÙJ
Kœ™]™\œÙJ
K›X\

K
OO˜Û\ÜÏH‰İOOLØ]\İ˜H‰ÖŠJ_OÜ˜
Kš›Ú[Š
NØI‰˜Kš[›™\’SOO[É‰ŠKš[›™\’S[Ê_Y[˜İ[ÛˆÙŠ
^Û]OYØİ[Y[™Ù][[Y[RY
Ù[™\šXË[[Ù[
NÙI‰ŠKšY[HL
NÛ]YØİ[Y[™Ù][[Y[RY
˜]K[[Ù[
Nİ	‰ŠšY[HLKØİ[Y[˜›ÙK˜Û\ÜÓ\İ˜Y
Ø[\ZYÛ‹[[Ù[[Ü[˜
K™S›Êİ[™^KZ[œÜXİ[Û˜Ëœ›ÙÜ™\ÜÚ[ÛÛÛ^

JKÙŠ
KYŠİ[™[XÚ[
KYŠ[XØ\œX
J_Y[˜İ[ÛˆÙŠ
^Û]OS™ÚYŠYJ\™]\›Û]UÖØİ[™^KZ[œÜXİ[Û˜KYØİ[Y[™Ù][[Y[RY
˜]K]]X
NÛ‰‰Š‹^ÛÛ[X	İ›˜[Y_H0­È	İ]_X
KÙŠJKYŠJNÛ]YØİ[Y[™Ù][[Y[RY
˜]KXÛÜÙX
KOYØİ[Y[™Ù][[Y[RY
˜]K[[İ™\Ø
NÚYŠZJ\™]\›ÚYŠK™š[š\ÚY
^ÚKš[›™\’SX]ˆÛ\ÜÏH˜˜]KYš[š\Ú	ÙKÛÛØÛÛ˜˜ÜİHİ›Û™Ï‰ÙKÛÛØÓĞÒS‘S‘H‘TÕS‘S˜˜ĞUUSÓˆÑQ°á‘UOÜİ›Û™Ï‰ÙKÛÛØ\ÈXœØÚ\ÜÜ›İÚÛÛ[™]Ú™H˜XÚ›Ü™\[™Ë˜˜YHX›˜ZYHØ[›ˆ\›™]]›Ü˜™\™Z]][™™\œİXÚÙ\™[‹˜OÜÙ]˜‰‰Š‹šY[HLJKKÛÛ‰‰•ËÚ[‘š[˜[˜]J
NÜ™]\›Ÿ\‰‰Š‹šY[HL
NÛ]OR™Š
KÏUËœÛ˜\Úİ

NÚKš[›™\’S[Ë™\]Z\Y]XÚÜËœÛXÙJË˜]XÚÔÛİ[Z]

JK›X\
O˜]Ûˆ\OH˜]Ûˆˆ]KYš[˜[[[İ™OH‰İHİ›Û™Ï‰ÖŠ™VİK›X™[
_OÜİ›Û™ÏÜ[‰ÖŠ™VİK™\ØÜš\[ÛŠ_OÜÜ[ÛX[‰ÖŠ[ÊKKË˜Xİ]™UX[K›[™İ
ÌKËœ›ÙÜ™\ÜÚ[ÛÛÛ^

JJ_OÜÛX[Ø]Û˜
Kš›Ú[Š
KKœ]Y\TÙ[XİÜ[
Ù]KYš[˜[[[İ™WX
K™›Ü‘XXÚ
OO™K˜Y]™[\İ[™\ŠÛXÚØ

OOœYŠK™]\Ù]™š[˜[[İ™JJJKYŠJ_Y[˜İ[ÛˆYŠJ^ÚYŠS™Ÿ™‹™š[š\ÚY
\™]\›Û]TÊ™‹K™Š
KËœÛ˜\Úİ

K˜Xİ]™UX[K›[™İ
ÌKËœ›ÙÜ™\ÜÚ[ÛÛÛ^

JNÓ™]œİ]KYŠ›ÚY˜[š[X][ÛŠKYŠİ[™[Xš]Ø]˜\™İYX
KÙŠ
_Y[˜İ[Ûˆ™Š
^Ü™]\›ˆË˜]YÛY[Û˜\Úİ
™]ÈÜŠ™]ÈYŠKœÛ˜\Úİ

J_Y[˜İ[ÛˆYŠK
^İÚ[™İË™\Ü]Ú]™[
™]Èİ\İÛQ]™[
ËXØ[\ZYÛ‹X[š[X][Û˜Ù]Z[ÚY™K[š[X][Û_JJ_Y[˜İ[ÛˆŠJ^Ü™]\›ˆKœ™\XÙJÖÉ‰È—KÙËOOŠÈ‰ˆ˜	˜[\Ø˜	›Øˆ˜	™İØ‰È˜	ˆÌÎNØ	È‰Î˜	œ][İØJVÙWOÏÙJ_]˜\ˆ™^ÙXY›Û™N‹ŒLËX^˜Y]\Î\XÜÎˆLKYXÛ\ÜŞŞ›Û™NÛÜ[ÛœÎØXİ]™TÚ[\ÛÜšYÚ[^ŞŒNŒNØXİ]™Q\™Xİ[ÛœÏ[™]ÈÙ]Ø˜\ÙNİ[XÛX™[ØÛÛœİXİÜŠK^ßJ^İ\Ë›Û™OYK\Ë›Ü[ÛœÏ^Ë‹‹–™‹‹‹K\Ë›Û™K˜Û\ÜÓ\İ˜Y
[š\ÚX›KZ›Ş\İXÚË^›Û™X
K\Ë›Û™Kš[›™\’SXˆ]ˆÛ\ÜÏHš›Ş\İXÚËYÚÜİˆ\šXKZY[HYH‚ˆHÛ\ÜÏHš›Ş\İXÚË\š[™ÈÚO‚ˆˆÛ\ÜÏHš›Ş\İXÚË][XˆØ‚ˆÙ]‚ˆÜ[ˆÛ\ÜÏHš›Ş\İXÚËZ[“[šÜÈ™\°ï™[ˆ[™šYZ[ÜÜ[˜\Ë˜˜\ÙO\Ü
\Ë›Û™Kš›Ş\İXÚËYÚÜİ
K\Ë[X\Ü
\Ë›Û™Kš›Ş\İXÚË][X˜
K\Ë›X™[\Ü
\Ë›Û™Kš›Ş\İXÚËZ[
K\Ë˜š[™

_Y\İ›ŞJ
^İ\Ë˜ÛX\‘\™Xİ[ÛœÊ
K\Ë›Û™Kœ™\XÙPÚ[™[Š
_Xš[™

^İ\Ë›Û™K˜Y]™[\İ[™\ŠÚ[\™İÛ˜\Ë›Û”Ú[\‘İÛ‹Ü\ÜÚ]™NˆL_JK\Ë›Û™K˜Y]™[\İ[™\ŠÚ[\›[İ™X\Ë›Û”Ú[\“[İ™KÜ\ÜÚ]™NˆL_JK\Ë›Û™K˜Y]™[\İ[™\ŠÚ[\\\Ë›Û”Ú[\•\Ü\ÜÚ]™NˆL_JK\Ë›Û™K˜Y]™[\İ[™\ŠÚ[\˜Ø[˜Ù[\Ë›Û”Ú[\•\Ü\ÜÚ]™NˆL_JK\Ë›Û™K˜Y]™[\İ[™\ŠÛÛ^Y[XOO™Kœ™]™[Y˜][

J_[Û”Ú[\‘İÛYOOİ\Ë˜Xİ]™TÚ[\ˆOO]›ÚYKœÚ[\•\OOOX[İ\ÙX	‰™K˜]ÛˆOOL
Kœ™]™[Y˜][

K\Ë˜Xİ]™TÚ[\YKœÚ[\’Y\Ë›ÜšYÚ[^Ş™K˜ÛY[N™K˜ÛY[_K\Ë›Û™KœÙ]Ú[\Ø\\™JKœÚ[\’Y
K\Ë˜˜\ÙKœİ[KœÙ]›Ü\JKZ›ŞK^	ÙK›Ù™œÙ]\
K\Ë˜˜\ÙKœİ[KœÙ]›Ü\JKZ›ŞK^X	ÙK›Ù™œÙ]_\
K\Ë˜˜\ÙK˜Û\ÜÓ\İ˜Y
Xİ]™X
K\Ë›X™[˜Û\ÜÓ\İ˜Y
Y[˜
K\Ë\]U™XİÜŠK˜ÛY[K˜ÛY[JKÜ
\Ë›Ü[ÛœËš\XÜÏÎŒ
J_NÛÛ”Ú[\“[İ™OYOOÙKœÚ[\’YOO]\Ë˜Xİ]™TÚ[\‰‰ŠKœ™]™[Y˜][

K\Ë\]U™XİÜŠK˜ÛY[K˜ÛY[JJ_NÛÛ”Ú[\•\YOOÙKœÚ[\’YOO]\Ë˜Xİ]™TÚ[\‰‰ŠKœ™]™[Y˜][

K\Ë˜Xİ]™TÚ[\]›ÚY\Ë˜˜\ÙK˜Û\ÜÓ\İœ™[[İ™JXİ]™X
K\Ë[X‹œİ[K˜[œÙ›Ü›OX˜[œÛ]LÙ

X\Ë˜ÛX\‘\™Xİ[ÛœÊ
K\
ŞŒNŒXYÛš]YNŒ[™ÛNŒJJ_Nİ\]U™XİÜŠK
^Û]YK]\Ë›ÜšYÚ[‹]]\Ë›ÜšYÚ[‹KOSX]š\İ
‹ŠKOSX]›Z[ŠK\Ë›Ü[ÛœË›X^˜Y]\ÊKÏZOŒØKÚNŒÏ[Š›ËÏ\Š›Îİ\Ë[X‹œİ[K˜[œÙ›Ü›OX˜[œÛ]LÙ
	Üß\	Øß\
XÛ]\Ëİ\Ë›Ü[ÛœË›X^˜Y]\ËOXËİ\Ë›Ü[ÛœË›X^˜Y]\ËSX]›Z[ŠKX]š\İ
JJK^Ş™\Ë›Ü[ÛœË™XY›Û™OÌ›N™\Ë›Ü[ÛœË™XY›Û™OÌKXYÛš]YN™\Ë›Ü[ÛœË™XY›Û™OÌ™[™ÛN“X]˜][ŒŠK
_NØ\
ŠK\ËœŞ[˜Ñ\™Xİ[ÛœÊ	ŠŠJ_\Ş[˜Ñ\™Xİ[ÛœÊJ^Ù›ÜŠ]Ùˆ\Ë˜Xİ]™Q\™Xİ[ÛœÊYKš\Ê
_\
LJNÙ›ÜŠ]ÙˆJ]\Ë˜Xİ]™Q\™Xİ[ÛœËš\Ê
_\
L
Nİ\Ë˜Xİ]™Q\™Xİ[ÛœÏY_XÛX\‘\™Xİ[ÛœÊ
^Ù›ÜŠ]HÙˆ\Ë˜Xİ]™Q\™Xİ[ÛœÊZ\
KLJNİ\Ë˜Xİ]™Q\™Xİ[ÛœË˜ÛX\Š
__NÙ[˜İ[Ûˆ	ŠJ^Û][™]ÈÙ]ÚYŠK›XYÛš]YOL
\™]\›ˆÛ]KŒÜ™]\›ˆKKKŒ	‰˜Y
Y
KK[‰‰˜Y
šYÚ
KKOKKŒ	‰˜Y
\
KKO[‰‰˜Y
İÛ˜
KY[˜İ[Ûˆ\
J^Û]YKÓİÙ\Ø\ÙJ
NÜ™]\›‹ÜÜ™XÚ[Ÿ[œÜ™XÚ[Ÿİ[™[_[_›Û›_X[›š_İ\Ú_[_Ú\˜KË\İ

OØ‘QS˜‹ğí™™›™[ŸÛÙ™™\œ˜][_šY\‹Ë\İ

OØ0å‘‘“‘S˜‹Ù›\Û™ß›[šŞ_ØÚXÚÙ_Y[Ø[\‹Ë\İ

OØÔQSS˜‹Üİ›Û_™\˜š[™[Ÿ]\ÛY[Ÿ]šY\™[‹Ë\İ

OØPPÒS˜‹ÜZ[Ÿ™[Ë\İ

OØ•RS˜˜RÕSÓ˜Y[˜İ[Ûˆ
KŠ^Û]J
OOÛ][‹^ÛÛ[Ëš[J
OÏØOH]šY[‰‰ˆH\ÙK˜Û\ÜÓ\İÙÙÛJ]˜Z[X›XJKK˜Û\ÜÓ\İÙÙÛJYXZJKKš[›™\’SX‰ÚOÙ\
ŠN˜RÕSÓ˜OØÛX[‰ÚOØÜ
ŠN˜[ˆ\ˆ°éHZ[™\ÈšY[ØOÜÛX[˜KO[™]È]]][Û“ØœÙ\™\ŠŠNÜ™]\›ˆK›ØœÙ\™JØ]šX]\ÎˆLÚ[\İˆLİX™YNˆLÚ\˜Xİ\‘]NˆLJKK›ØœÙ\™J‹ØÚ[\İˆLİX™YNˆLÚ\˜Xİ\‘]NˆLJKK˜Y]™[\İ[™\ŠÚ[\™İÛ˜œ
KK˜Y]™[\İ[™\ŠÛXÚØœ
KŠ
K

OOÚK™\ØÛÛ›™Xİ

KKœ™[[İ™Q]™[\İ[™\ŠÚ[\™İÛ˜œ
KKœ™[[İ™Q]™[\İ[™\ŠÛXÚØœ
__Y[˜İ[Ûˆœ
J^ÛÜ
LŠKK˜İ\œ™[\™Ù]˜Û\ÜÓ\İ˜Y
™\ÜÙY
KÚ[™İËœÙ][Y[İ]


OO™K˜İ\œ™[\™Ù]Ë˜Û\ÜÓ\İœ™[[İ™J™\ÜÙY
KM
_Y[˜İ[Ûˆœ
J^ÙKœ™]™[Y˜][

KÚ[™İË™\Ü]Ú]™[
™]È]™[
ËXØ[\ZYÛ‹XXİ[Û˜
J_Y[˜İ[Ûˆ\
K
^İÚ[™İË™\Ü]Ú]™[
™]Èİ\İÛQ]™[
ËXØ[\ZYÛ‹Y\™Xİ[Û˜Ù]Z[Ù\™Xİ[Û™KXİ]™N_JJ_Y[˜İ[Ûˆ\
J^İÚ[™İË™\Ü]Ú]™[
™]Èİ\İÛQ]™[
ËXØ[\ZYÛ‹]™XİÜ˜Ù]Z[™_JJ_Y[˜İ[ÛˆÜ
J^ÙOL\[Ùˆ˜]šYØ]Ü‹šXœ˜]HOX[˜İ[Û˜˜]šYØ]Ü‹šXœ˜]JJ_Y[˜İ[ÛˆÜ
K
^Û]YKœ]Y\TÙ[XİÜŠ
NÚYŠ[Š]›İÈ\œ›ÜŠZ\ÜÚ[™È›Ş\İXÚÈ[[Y[ˆ	İX
NÜ™]\›ˆŸY[˜İ[ÛˆÜ
J^Ü™]\›ˆKœ™\XÙJÖÉ‰È—KÙËOOŠÈ‰ˆ˜	˜[\Ø˜	›Øˆ˜	™İØ‰È˜	ˆÌÎNØ	È‰Î˜	œ][İØJVÙWOÏÙJ_]˜\ˆXÛ\ÜŞÙ[[Y[ÎÜİYÙNÜ^Y\‘šYİ\™NÙ[™[^QšYİ\™NÙY™™XİÜ\ÙNÜ™]š[İ\Ô^Y\LÜ™]š[İ\Ñ[™[^OLÛØÚÙYHLNİØ\ÓÜ[HLNÛØœÙ\™\İ[Y\œÏV×NØÛÛœİXİÜŠJ^İ\Ë™[[Y[ÏYK\ËœİYÙOYØİ[Y[˜Ü™X]Q[[Y[
ÙXİ[Û˜
K\ËœİYÙK˜Û\ÜÓ˜[YOXÚ[™[X]XËX˜]K\İYÙX\ËœİYÙKš[›™\’SXˆ]ˆÛ\ÜÏH˜˜]KX˜XÚÙ›ÜOÚOOÚOOÚOÙ]‚ˆ]ˆÛ\ÜÏH˜˜]K\ÚYH˜]K\ÚYK\^Y\ˆ‚ˆÜ[ˆÛ\ÜÏH˜˜]K[˜[YH‘OÜÜ[‚ˆ]ˆÛ\ÜÏH˜˜]K\Üš]H˜]K\Üš]K\^Y\ˆØOÚO[OÙ[OÙ]‚ˆ]ˆÛ\ÜÏH˜˜]K]X[K\ÚYİÜÈOÚOOÚOOÚOÙ]‚ˆÙ]‚ˆ]ˆÛ\ÜÏH˜˜]KXÙ[\‹Yİ›Û™Ï•”ÏÜİ›Û™Ï]ˆÛ\ÜÏH˜˜]KZ[\XİÙ]Ù]‚ˆ]ˆÛ\ÜÏH˜˜]K\ÚYH˜]K\ÚYKY[™[^H‚ˆÜ[ˆÛ\ÜÏH˜˜]K[˜[YH‘ÑQÑS”ÑRUOÜÜ[‚ˆ]ˆÛ\ÜÏH˜˜]K\Üš]H˜]K\Üš]KY[™[^HØOÚO[OÙ[OÙ]‚ˆ]ˆÛ\ÜÏH˜˜]KY[™[^K\\™\ˆÙ]‚ˆÙ]‚ˆ]ˆÛ\ÜÏH˜˜]K\\ÙHˆ\šXK[]™OHœÛ]H•ğáHRS‘HUPÒÑOÙ]˜K›[Ù[œ]Y\TÙ[XİÜŠ˜˜]KX\™[˜X
OË˜™Y›Ü™J\ËœİYÙJK\Ëœ^Y\‘šYİ\™OZ
\ËœİYÙK˜˜]K\Üš]K\^Y\˜
K\Ë™[™[^QšYİ\™OZ
\ËœİYÙK˜˜]K\Üš]KY[™[^X
K\Ë™Y™™XİZ
\ËœİYÙK˜˜]KZ[\Xİ
K\Ëœ\ÙOZ
\ËœİYÙK˜˜]K\\ÙX
K\Ë™[[Y[Ë›[İ™\Ë˜Y]™[\İ[™\ŠÛXÚØ\Ë›Û“[İ™KL
K\Ë›ØœÙ\™\[™]È]]][Û“ØœÙ\™\Š

OO\ËœŞ[˜Ê
JK\Ë›ØœÙ\™\‹›ØœÙ\™JK›[Ù[Ø]šX]\ÎˆL]šX]Qš[\–ØY[˜_JK\Ë›ØœÙ\™\‹›ØœÙ\™JK]KØÚ[\İˆLİX™YNˆLÚ\˜Xİ\‘]NˆLJK\Ë›ØœÙ\™\‹›ØœÙ\™JKœ›İ[™ØÚ[\İˆLİX™YNˆLÚ\˜Xİ\‘]NˆLJK\Ë›ØœÙ\™\‹›ØœÙ\™JKœ^Y\˜\‹Ø]šX]\ÎˆL]šX]Qš[\–Øİ[X_JK\Ë›ØœÙ\™\‹›ØœÙ\™JK™[™[^P˜\‹Ø]šX]\ÎˆL]šX]Qš[\–Øİ[X_JK\Ë›ØœÙ\™\‹›ØœÙ\™JK›ÙËØÚ[\İˆLİX™YNˆLÚ\˜Xİ\‘]NˆLJK\ËœŞ[˜Ê
_Y\İ›ŞJ
^İ\Ë›ØœÙ\™\‹™\ØÛÛ›™Xİ

K\Ë™[[Y[Ë›[İ™\Ëœ™[[İ™Q]™[\İ[™\ŠÛXÚØ\Ë›Û“[İ™KL
K\Ë[Y\œË™›Ü‘XXÚ
OOÚ[™İË˜ÛX\•[Y[İ]
JJK\ËœİYÙKœ™[[İ™J
_[Û“[İ™OYOOÛ]YK\™Ù]Ë˜ÛÜÙ\İ
Ù]KX˜]K[[İ™WX
NÚYŠ]\Ë›ØÚÙY
\™]\›Û]]™]\Ù]˜˜]S[İ™NÛ‰‰Š\Ë›ØÚÙYHL\Ë™[[Y[Ë›[Ù[˜Û\ÜÓ\İ˜Y
˜]K\™\ÛÛš[™Ø
K\Ë™[[Y[Ë›[İ™\ËœÙ]]šX]J\šXKX\ŞXYX
K\Ëœ^S[İ™JŠK\Ë™[^J

OOİ\Ëœ^Y\‘šYİ\™K˜Û\ÜÓ˜[YOX˜]K\Üš]H˜]K\Üš]K\^Y\˜\Ë™[™[^QšYİ\™K˜Û\ÜÓ˜[YOX˜]K\Üš]H˜]K\Üš]KY[™[^H	Ù
\Ë™[[Y[Ë]K^ÛÛ[ÏØ
_X\Ë™Y™™Xİ˜Û\ÜÓ˜[YOX˜]KZ[\Xİ\Ë™[[Y[Ë›[Ù[˜Û\ÜÓ\İœ™[[İ™J˜]K\™\ÛÛš[™Ø˜]KXØ[Y\˜KZ]˜]KXØ[Y\˜KXÜš]XØ[
K\Ë™[[Y[Ë›[İ™\Ëœ™[[İ™P]šX]J\šXKX\ŞX
K\Ëœ\ÙK^ÛÛ[XğáHRS‘HUPÒÑX\Ë›ØÚÙYHLK\ËœŞ[˜Ê
_KLML
J_NÜ^S[İ™JJ^Û]]\
JNİ\Ëœ\ÙK^ÛÛ[]OOX›ØÚØØ‘T•RQQÕS‘ÈUQUQS˜˜UPÒÑH0áQ•\Ëœ^Y\‘šYİ\™K˜Û\ÜÓ\İ˜Y
[İ[Û‹IİX
K\Ë™Y™™Xİ˜Û\ÜÓ\İ˜Y
[\XİIİX
K
JK\Ë™[^J

OOİ\Ë™[™[^QšYİ\™K˜Û\ÜÓ\İ˜Y
[İ[Û‹Z]
K\Ë™[[Y[Ë›[Ù[˜Û\ÜÓ\İ˜Y
˜]KXØ[Y\˜KZ]
K\Ëœ\ÙK^ÛÛ[XÒT’ÕS‘ÈÒT‘‘T‘PÒ‘UKOOX\™İYXOOXYÜ™YXÍŒŒÌL
K\Ë™[^J

OOİ\Ë™[™[^QšYİ\™K˜Û\ÜÓ\İœ™[[İ™J[İ[Û‹Z]
K\Ë™[™[^QšYİ\™K˜Û\ÜÓ\İ˜Y
[İ[Û‹XÛİ[\˜
K\Ëœ\ÙK^ÛÛ[XÑQÓ‘T’TĞÒTˆÓÓ•T˜KÌ
_\Ş[˜Ê
^Û]OH]\Ë™[[Y[Ë›[Ù[šY[ÚYŠ\ËœİYÙKšY[HYKYJ^İ\ËØ\ÓÜ[HLNÜ™]\›Ÿ[]]\Ë™[[Y[Ë]K^ÛÛ[ÏØ]œÜ]
0­Ø
VÌOËš[J
_ÑQÑS”ÑRUXÛ\

\ËœİYÙK˜˜]K\ÚYKY[™[^H˜˜]K[˜[YX
K‹Õ\\Ø\ÙJ
JK\

\ËœİYÙK˜˜]K\ÚYK\^Y\ˆ˜˜]K[˜[YX
KH	ˆPSX
K\Ë›ØÚÙY
\Ë™[™[^QšYİ\™K˜Û\ÜÓ˜[YOX˜]K\Üš]H˜]K\Üš]KY[™[^H	Ù

_X
K\ËœİYÙK˜Û\ÜÓ\İÙÙÛJ]]Üš]KX˜]XÑİ[™[_[_]›Ü™[™ËÚK\İ

JK\ËœİYÙK˜Û\ÜÓ\İÙÙÛJ›Û›KX˜]XÔ›Û›KÚK\İ

JK\ËœİYÙK™]\Ù]œ›İ[™]\Ë™[[Y[Ëœ›İ[™^ÛÛ[Ëœ™\XÙJ×ÙË
_XÛ]Yœ
\Ë™[[Y[Ëœ^Y\˜\ŠKOYœ
\Ë™[[Y[Ë™[™[^P˜\ŠNİ\ËØ\ÓÜ[ÊO\Ëœ™]š[İ\Ñ[™[^I‰\Ë™›Ø][XYÙJK]\Ëœ™]š[İ\Ñ[™[^K[™[^X
K\Ëœ™]š[İ\Ô^Y\‰‰\Ë™›Ø][XYÙJ‹]\Ëœ™]š[İ\Ô^Y\‹^Y\˜
K\Ëœ™]š[İ\Ô^Y\\‹\Ëœ™]š[İ\Ñ[™[^OZJNŠ\Ëœ™]š[İ\Ô^Y\\‹\Ëœ™]š[İ\Ñ[™[^OZK\ËØ\ÓÜ[HL
NÛ]O]\Ë™[[Y[Ë›ÙËœ]Y\TÙ[XİÜŠ›]\İ
OË^ÛÛ[ÏØİ\ËœİYÙK™]\Ù]œ™\İ[KÙÙ]ÛÛ›™[ŸØÚ˜[šÙ_œ\İšY\Ù[YËÚK\İ
JOØÚ[˜‹Ü°ïÚŞYßLšYY\›YÙKÚK\İ
JOØÜÜØ˜Xİ]™XY›Ø][XYÙJK
^ÚYŠOKŒJ\™]\›Û]YØİ[Y[˜Ü™X]Q[[Y[
˜
NÛ‹˜Û\ÜÓ˜[YOX˜]KY›Ø][™Ë[[X™\ˆ	İX‹^ÛÛ[X
ÉÓX]œ›İ[™
J_H”•TÕ\ËœİYÙK˜\[™
ŠK\Ë™[^J

OO›‹œ™[[İ™J
KYLÊKOLŒ	‰\Ë™[[Y[Ë›[Ù[˜Û\ÜÓ\İ˜Y
˜]KXØ[Y\˜KXÜš]XØ[
_Y[^JK
^Û]]Ú[™İËœÙ][Y[İ]


OOİ\Ë[Y\œÏ]\Ë[Y\œË™š[\ŠOO™HOO[ŠKJ
_K
Nİ\Ë[Y\œËœ\Ú
Š__NÙ[˜İ[Ûˆ\
J^Ü™]\›È˜Û\ÜÚXËZYÚYš]™H˜YÚš]™X˜[K\Ú\\ÚİÈ˜™]™X[˜YÜ™YKX[]Ø^H˜YÜ™YX›ÙÚXØ[X\™İ[Y[˜\™İYX™KXÛİ[\ˆ˜Ûİ[\˜˜Ø[\[™ËXÚZ\‹X›ØÚÈ˜›ØÚØ˜™Y\‹[Ù™™\ˆ˜š[šØœŞ[˜Ú›Ûš\ÙYXÚY\ˆ˜X[KXÚY\˜˜İ\Y^YKXÛÛXİ˜›Øİ\Øİ[Y^YÙÙ\˜][Ûˆ˜^YÙÙ\˜]XVÙWOÏØ\™İYXY[˜İ[Ûˆ
J^Ü™]\›‹Ñİ[™[_[_]›Ü™[™ËÚK\İ
JOØ[™[^KX]]Üš]X‹Ô›Û›KÚK\İ
JOØ[™[^K\›Û›X˜[™[^KYÙ[™\šXØY[˜İ[Ûˆœ
J^Û]S[X™\‹œ\œÙQ›Ø]
Kœİ[KÚY
NÜ™]\›ˆ[X™\‹š\Ñš[š]J
OİŒY[˜İ[Ûˆ
J^İ\[Ùˆ˜]šYØ]Ü‹šXœ˜]OOX[˜İ[Û˜	‰ŠOOOXİ[Y^YÙÙ\˜][Û˜OOOXŞ[˜Ú›Ûš\ÙYXÚY\˜Û˜]šYØ]Ü‹šXœ˜]JÌŒÍKÍWJN™OOOXØ[\[™ËXÚZ\‹X›ØÚØÛ˜]šYØ]Ü‹šXœ˜]JÌL‹L—JN›˜]šYØ]Ü‹šXœ˜]JN
J_Y[˜İ[Ûˆ\
K
^ÙK^ÛÛ[OO]	‰ŠK^ÛÛ[]
_Y[˜İ[Ûˆ
K
^Û]YKœ]Y\TÙ[XİÜŠ
NÚYŠ[Š]›İÈ\œ›ÜŠZ\ÜÚ[™È˜]H™\Ù[][Ûˆ[[Y[ˆ	İX
NÜ™]\›ˆŸ]˜\ˆÜS\

N×Ü

NÙ[˜İ[ÛˆÜ

^ÚYŠØİ[Y[™Ù][[Y[RY
Ø[\ZYÛ‹YØ[YX
J^İœ

NÜ™]\›Ÿ[]O[™]È]]][Û“ØœÙ\™\Š

OOÙØİ[Y[™Ù][[Y[RY
Ø[\ZYÛ‹YØ[YX
I‰ŠK™\ØÛÛ›™Xİ

Kœ

J_JNÙK›ØœÙ\™JØİ[Y[™Øİ[Y[[[Y[ØÚ[\İˆLİX™YNˆLJ_Y[˜İ[Ûˆœ

^ÙØİ[Y[™Øİ[Y[[[Y[˜Û\ÜÓ\İ˜Y
Ø[\ZYÛ‹Y[š[˜ÙY
K

K\

Kœ

K

KÜ

KÜ

KÜ

K

K\

KÜ

KÚ[™İË˜Y]™[\İ[™\Š™Y›Ü™][›ØY

OO™Üœ[Š
KÛÛ˜ÙNˆLJ_Y[˜İ[Ûˆ\

^Û]OI
ÛÜ›Yœ˜[YX
NÙKœ]Y\TÙ[XİÜŠ›[Øš[KXÛÛ›ÛØ
OËœÙ]]šX]J\šXKZY[˜YX
NÛ]YØİ[Y[˜Ü™X]Q[[Y[
]˜
Nİ˜Û\ÜÓ˜[YOX[Øš[K]ÛÜ›XÛÛ›ÛØš[›™\’SXˆ]ˆÛ\ÜÏH›[Øš[K[[İ™K^›Û™Hˆ\šXK[X™[H•[œÚXÚ˜\™\ˆ™]ÙYİ[™ÜËR›Ş\İXÚÈÙ]‚ˆ]ÛˆÛ\ÜÏH›[Øš[KXÛÛ^XXİ[ÛˆYHˆ\OH˜]Ûˆˆ\šXK[X™[H’ÛÛ^Zİ[Ûˆ‚ˆRÕSÓØÛX[’[ˆ\ˆ°éHZ[™\ÈšY[ÏÜÛX[‚ˆØ]Û‚ˆ]ˆÛ\ÜÏH›[Øš[KXÛÛ›ÛZ[“[šÜÈšYZ[ˆ0­È™XÚÈ[™[Ù]˜K˜\[™

NÛ][™]ÈYŠ	
›[Øš[K[[İ™K^›Û™X
KÙXY›Û™N‹ŒL‹X^˜Y]\ÎÌ‹\XÜÎˆLJK]
	
›[Øš[KXÛÛ^XXİ[Û˜
K	
Ú[\˜Xİ[Û‹\›Û\
K	
Ú[\˜Xİ[Û‹]^
JNİ˜Y]™[\İ[™\ŠÚ[\™İÛ˜

OO˜Û\ÜÓ\İ˜Y
ÛÛ›ÛË]\ÙY
KÛÛ˜ÙNˆLJKÜ˜Y


OOÛ‹™\İ›ŞJ
KŠ
Kœ™[[İ™J
_J_Y[˜İ[Ûˆœ

^Û]OI
ØØ[\ZYÛ‹YØ[YX
KI
™Ø[YK[^[İ]
KI
›Y\[™[
KI
œšYÚ\[™[
KOI
Ü˜\˜
KOYØİ[Y[˜Ü™X]Q[[Y[
]Û˜
NØK˜Û\ÜÓ˜[YOX[Øš[KZY]ÙÙÛXK\OX]Û˜Kš[›™\’SX’QØÛX[”İ]\È0­È[™[\ˆ0­È™^šYZ[™Ù[ÜÛX[˜KœÙ]]šX]J\šXKY^[™Y˜[ÙX
KK˜\[™
JNÛ]ÏYØİ[Y[˜Ü™X]Q[[Y[
]˜
NÛË˜Û\ÜÓ˜[YOX[Øš[K\[™[\ÚY]Ëš[›™\’SX]ˆÛ\ÜÏH›[Øš[K\ÚY]Z[™HÙ]XY\İ›Û™Ï•ÛØÚ[™[™RQÜİ›Û™Ï]Ûˆ\OH˜]Ûˆ”ØÚYpçÙ[Ø]ÛÚXY\]ˆÛ\ÜÏH›[Øš[K\ÚY]XÛÛ[Ù]˜K˜\[™
ÊNÛ]ÏI
Ë›[Øš[K\ÚY]XÛÛ[
KÏI
ËXY\ˆ]Û˜
KVÙØİ[Y[˜Ü™X]PÛÛ[Y[
Y\[™[ZÛYX
KØİ[Y[˜Ü™X]PÛÛ[Y[
šYÚ\[™[ZÛYX
WNÛ‹˜™Y›Ü™JÌJK‹˜™Y›Ü™JÌWJNÛ]OJ
OOÜË˜\[™
‹ŠKK˜Û\ÜÓ\İ˜Y
[Øš[K\[™[Ë[Ü[˜
KØİ[Y[˜›ÙK˜Û\ÜÓ\İ˜Y
Ø[\ZYÛ‹[[Ù[[Ü[˜
KKœÙ]]šX]J\šXKY^[™YYX
_KJ
OOÛÌK˜Y\ŠŠKÌWK˜Y\ŠŠKK˜Û\ÜÓ\İœ™[[İ™J[Øš[K\[™[Ë[Ü[˜
KØİ[Y[˜›ÙK˜Û\ÜÓ\İœ™[[İ™JØ[\ZYÛ‹[[Ù[[Ü[˜
KKœÙ]]šX]J\šXKY^[™Y˜[ÙX
_NØK˜Y]™[\İ[™\ŠÛXÚØJKË˜Y]™[\İ[™\ŠÛXÚØ
KË˜Y]™[\İ[™\ŠÛXÚØOOÙK\™Ù]OO[É‰™

_JKÚ[™İË˜Y]™[\İ[™\ŠÙ^YİÛ˜OİšÙ^OOOX\ØØ\X	‰™K˜Û\ÜÓ\İ˜ÛÛZ[œÊ[Øš[K\[™[Ë[Ü[˜
I‰™

_JK˜Û\ÜÓ\İ˜Y
[Øš[K]ÛÜ›Yš\œİ
KÜ˜Y


OOÙ

KKœ™[[İ™J
KËœ™[[İ™J
_J_Y[˜İ[Ûˆ

^Û]OI
Ú[›Ë]š\İX[
KI
š[›ËXÛÜX
NÙKš[œÙ\Y˜XÙ[S
™Y›Ü™Y[™ˆ]ˆÛ\ÜÏHš[›ËXÚ[™[X]XË[^Y\ˆ[›ËXÛİYÈÙ]‚ˆ]ˆÛ\ÜÏHš[›ËXÚ[™[X]XË[^Y\ˆ[›Ë]™Y\ÈÙ]‚ˆ]ˆÛ\ÜÏHš[›ËXÚ[™[X]XË[^Y\ˆ[›ËXÜ›İÙ‚ˆHÛ\ÜÏHš[›Ë\\œÛÛˆHÚOHÛ\ÜÏHš[›Ë\\œÛÛˆˆÚOHÛ\ÜÏHš[›Ë\\œÛÛˆÈÚOHÛ\ÜÏHš[›Ë\\œÛÛˆÚO‚ˆÙ]‚ˆ]ˆÛ\ÜÏHš[›ËX]]Üš]KY[ÈHÛ\ÜÏH™İ[™[HÚOHÛ\ÜÏH[HÚOÙ]‚ˆ]ˆÛ\ÜÏHš[›Ë\ÚÜXØ\OÚOŒH8 «ØÙ]‚ˆ]ˆÛ\ÜÏHš[›ËYš[KYÜ˜Z[ˆÙ]‚ˆ]ˆÛ\ÜÏHš[›Ë[]\˜›ŞÜÙ]]ˆÛ\ÜÏHš[›Ë[]\˜›Ş›İÛHÙ]‚ˆİ›Û™ÈÛ\ÜÏHš[›Ë\ØÙ[™K\İ[\”Ö‘S‘HHÈÜİ›Û™Ï˜
Kš[œÙ\Y˜XÙ[S
Y\˜™YÚ[˜]ˆÛ\ÜÏHš[›Ë\[[YKXØ\[Ûˆˆ\šXK[]™OHœÛ]HÙ]˜
NÛ]I
Kš[›Ë\ØÙ[™K\İ[\
KI
š[›Ë\[[YKXØ\[Û˜
KOI
Ú[›Ë\›ÙÜ™\ÜØ
KOJ
OOÛ]YK™]\Ù]š\İX[ÏØ›ØYOVË‹‹šKœ]Y\TÙ[XİÜ[
]Û˜
WK™š[™[™^
OO™K˜Û\ÜÓ\İ˜ÛÛZ[œÊXİ]™X
JNÛ‹^ÛÛ[XÖ‘S‘H	Ôİš[™ÊX]›X^
JJÌJKœYİ\
‹
_HÈ‹^ÛÛ[P\

KK˜Û\ÜÓ\İœ™[[İ™JØÙ[™KY[\˜
KK›Ù™œÙ]ÚYK˜Û\ÜÓ\İ˜Y
ØÙ[™KY[\˜
KØİ[Y[˜›ÙK™]\Ù]š[›ÔØÙ[™O]KÏ[™]È]]][Û“ØœÙ\™\ŠJNÛË›ØœÙ\™JKØ]šX]\ÎˆL]šX]Qš[\–Ø]K]š\İX[_JKË›ØœÙ\™JKØÚ[\İˆLİX™YNˆL]šX]\ÎˆL]šX]Qš[\–ØÛ\ÜØ_JKJ
NÛ]Ï]OÚYŠœÚ[\•\OOOXİXÚ
\™]\›Û]YK™Ù]›İ[™[™ĞÛY[™Xİ

KJ˜ÛY[[‹›Y
KÛ‹ÚYKKOJ˜ÛY[K[‹Ü
KÛ‹šZYÚKNÙKœİ[KœÙ]›Ü\JKZ[›Ë\\˜[^^	ÜŠŒMŸ\
KKœİ[KœÙ]›Ü\JKZ[›Ë\\˜[^^X	ÚJŒL\
_NÙK˜Y]™[\İ[™\ŠÚ[\›[İ™XÊKÜ˜Y


OOÛË™\ØÛÛ›™Xİ

KKœ™[[İ™Q]™[\İ[™\ŠÚ[\›[İ™XÊ_J_Y[˜İ[ÛˆÜ

^Û]O[™]È
Û[Ù[‰
Ø˜]K[[Ù[
K]N‰
Ø˜]K]]X
K›İ[™‰
Ø˜]K\›İ[™
K^Y\˜\‰
Ø˜]K\^Y\‹X˜\˜
K[™[^P˜\‰
Ø˜]KY[™[^KX˜\˜
K[İ™\Î‰
Ø˜]K[[İ™\Ø
KÙÎ‰
Ø˜]K[ÙØ
_JNÙÜ˜Y


OO™K™\İ›ŞJ
J_Y[˜İ[ÛˆÜ

^Û]OI
ÛÜ›Yœ˜[YX
NÙKš[œÙ\Y˜XÙ[S
™Y›Ü™Y[™ˆ]ˆÛ\ÜÏHÛÜ›X][ÜÜ\™Hˆ\šXKZY[HYH‚ˆ]ˆÛ\ÜÏHÛÜ›]šYÛ™]HÙ]‚ˆ]ˆÛ\ÜÏHÛÜ›\İ[Ø\ÚÙ]‚ˆ]ˆÛ\ÜÏHÛÜ›\\XÛ\ÈÙ]‚ˆ]ˆÛ\ÜÏHÛÜ›\İ]\ËY\İÜ[ÛˆÙ]‚ˆÙ]‚ˆ]ˆÛ\ÜÏHÛÜ›[ØØ][Û‹XØ\™Ü[”‘QÒSÓÜÜ[İ›Û™ÏØ[\[™Ü]Üİ›Û™ÏÛX[‘YHÜšY[Y\[™È\İ›ØÚ[Ü™]\ØÚÜÛX[Ù]‚ˆ]ˆÛ\ÜÏH›[Øš[K[Øš™Xİ]™KXÚ\O¸¥áÚO]İ›Û™ÏÜİ›Û™ÏÛX[ÜÛX[Ù]Ù]˜
NÛ]I
KÛÜ›[ØØ][Û‹XØ\™
KI
İ›Û™Ø
KI
ÛX[
KOI
K›[Øš[K[Øš™Xİ]™KXÚ\
KOI
Kİ›Û™Ø
KÏI
KÛX[
KÏI
ÛØš™Xİ]™K]]X
KÏI
ÛØš™Xİ]™KY\İ[˜ÙX
KI
İ[YK[X™[
KOLYOOÛ]OYK™]Z[OZœ
JNÛ‹^ÛÛ[XK]K‹^ÛÛ[XK˜ÛÜK˜Û\ÜÓ\İœ™[[İ™Jš\ÚX›X
K›Ù™œÙ]ÚY˜Û\ÜÓ\İ˜Y
š\ÚX›X
KÚ[™İË˜ÛX\•[Y[İ]
JKO]Ú[™İËœÙ][Y[İ]


OO˜Û\ÜÓ\İœ™[[İ™Jš\ÚX›X
KÌŒ
_NİÚ[™İË˜Y]™[\İ[™\ŠËXØ[\ZYÛ‹\™YÚ[Û˜
NÛ]J
OOØK^ÛÛ[\Ë^ÛÛ[ÏØZİY[\ÈšY[Ë^ÛÛ[XË^ÛÛ[Ø	ØË^ÛÛ[H[™\›˜šY[Ú\™™\İ[[]K˜Û\ÜÓ\İÙÙÛJ™X\˜[X™\‹œ\œÙR[
Ë^ÛÛ[ÏØNNNXL
OM
_K[™]È]]][Û“ØœÙ\™\ŠŠNÜ›ØœÙ\™JËØÚ[\İˆLÚ\˜Xİ\‘]NˆLİX™YNˆLJK›ØœÙ\™JËØÚ[\İˆLÚ\˜Xİ\‘]NˆLİX™YNˆLJKŠ
NÛ]OJ
OOÛ]ZÜ
^ÛÛ[ÏØ
NÙK™]\Ù]™^T\ÙO]Øİ[Y[˜›ÙK™]\Ù]™^T\ÙO]K[™]È]]][Û“ØœÙ\™\ŠJNÚ›ØœÙ\™JØÚ[\İˆLÚ\˜Xİ\‘]NˆLİX™YNˆLJKJ
KÜ˜Y


OOİÚ[™İËœ™[[İ™Q]™[\İ[™\ŠËXØ[\ZYÛ‹\™YÚ[Û˜
K™\ØÛÛ›™Xİ

K™\ØÛÛ›™Xİ

KÚ[™İË˜ÛX\•[Y[İ]
J_J_Y[˜İ[ÛˆÜ

^Û]OI
Ú[\˜Xİ[Û‹\›Û\
KI
ÛÜ›Yœ˜[YX
KYØİ[Y[˜Ü™X]Q[[Y[
]˜
NÛ‹˜Û\ÜÓ˜[YOX[\˜Xİ[Û‹\˜Y\˜‹š[›™\’SXOÚOOÚOˆOØ˜˜\[™
ŠNÛ]HLKOJ
OOÛ]OHYKšY[İ˜Û\ÜÓ\İÙÙÛJ[\˜Xİ[Û‹X]˜Z[X›XJK‹˜Û\ÜÓ\İÙÙÛJš\ÚX›XJKI‰ˆ\‰‰\[Ùˆ˜]šYØ]Ü‹šXœ˜]OOX[˜İ[Û˜	‰›˜]šYØ]Ü‹šXœ˜]JÊKZ_KO[™]È]]][Û“ØœÙ\™\ŠJNØK›ØœÙ\™JKØ]šX]\ÎˆLÚ[\İˆLİX™YNˆLJKJ
KÜ˜Y


OOØK™\ØÛÛ›™Xİ

K‹œ™[[İ™J
_J_Y[˜İ[Ûˆ

^Û]OI
Üİ]\Ë[\İ
KI
ÛÜ›Yœ˜[YX
KJ
OOÛ]YK^ÛÛ[ËÓİÙ\Ø\ÙJ
OÏØ^Ù[šÎ‹Ø™][šÙ[Ÿ[™Ù][šÙ[ŸYÙ[[ÛÚÛË\İ
ŠK\™Y‹Ûpï_\œØÚ0íœ0ï™\›pï]Ë\İ
ŠKYÚ‹Øœ™Z]YÚ™\›™X™[Ë\İ
ŠK[™Ûİ™\‹ÚØ]\Ÿ™\šØ]\Ë\İ
ŠKÜš]XØ[‹ÚÜš]\ØÚZYšY\]\ÙÙZ[™Ù\Ë\İ
Š_NÙ›ÜŠ]ÙK—[ÙˆØš™Xİ™[šY\ÊŠJ]˜Û\ÜÓ\İÙÙÛJİ]\ËIÙ_XŠ_K[™]È]]][Û“ØœÙ\™\ŠŠNÜ‹›ØœÙ\™JKØÚ[\İˆLİX™YNˆLÚ\˜Xİ\‘]NˆLJKŠ
KÜ˜Y


OOœ‹™\ØÛÛ›™Xİ

J_Y[˜İ[Ûˆ\

^Û]O[˜]šYØ]Ü‹™]šXÙSY[[ÜOÏÎ[˜]šYØ]Ü‹š\™Ø\™PÛÛ˜İ\œ™[˜ŞOÏÎ]Ú[™İË›X]ÚYYXJ
™Y™\œË\™YXÙY[[İ[Ûˆ™YXÙJX
K›X]Ú\ËYOMMÙØİ[Y[™Øİ[Y[[[Y[˜Û\ÜÓ\İÙÙÛJØ[\ZYÛ‹[İË\İÙ\˜ŠKØİ[Y[™Øİ[Y[[[Y[˜Û\ÜÓ\İÙÙÛJØ[\ZYÛ‹\™YXÙY[[İ[Û˜ŠNÛ]OJ
OO™Øİ[Y[™Øİ[Y[[[Y[˜Û\ÜÓ\İÙÙÛJØ[\ZYÛ‹X˜XÚÙÜ›İ[™YØİ[Y[šY[ŠNÙØİ[Y[˜Y]™[\İ[™\Šš\ÚXš[]XÚ[™ÙXJKJ
KÜ˜Y


OO™Øİ[Y[œ™[[İ™Q]™[\İ[™\Šš\ÚXš[]XÚ[™ÙXJJ_Y[˜İ[Ûˆ

^Û]O]Ú[™İË›X]ÚYYXJ
Ú[\ˆÛØ\œÙJX
K›X]Ú\Ë[˜]šYØ]Ü‹›X^İXÚÚ[ÏŒÙØİ[Y[™Øİ[Y[[[Y[˜Û\ÜÓ\İÙÙÛJØ[\ZYÛ‹]İXÚ_
KØİ[Y[™Øİ[Y[[[Y[˜Û\ÜÓ\İÙÙÛJØ[\ZYÛ‹Y\ÚİÜYI‰ˆ]
_Y[˜İ[ÛˆÜ

^Û]OYØİ[Y[˜Ü™X]Q[[Y[
]˜
NÙK˜Û\ÜÓ˜[YOX[™ØØ\K\™XÛÛ[Y[™][Û˜Kš[›™\’SX”]Y\™›Ü›X][\›Ú[ØÜ[“YZˆØ\KÙ[šYÙ\ˆ][Y[ˆ[HÙYKÜÜ[˜Øİ[Y[˜›ÙK˜\[™
JNÛ]J
OOÛ]]Ú[™İËš[›™\’ZYÚÚ[™İËš[›™\•ÚYSX]›Z[ŠÚ[™İËš[›™\•ÚYÚ[™İËš[›™\’ZYÚ
OÌÙK˜Û\ÜÓ\İÙÙÛJš\ÚX›X	‰›‰‰ˆYØİ[Y[˜›ÙK˜Û\ÜÓ\İ˜ÛÛZ[œÊØ[\ZYÛ‹[[Ù[[Ü[˜
J_NİÚ[™İË˜Y]™[\İ[™\Š™\Ú^™X
KÚ[™İË˜Y]™[\İ[™\ŠÜšY[][Û˜Ú[™ÙX
K

KÜ˜Y


OOİÚ[™İËœ™[[İ™Q]™[\İ[™\Š™\Ú^™X
KÚ[™İËœ™[[İ™Q]™[\İ[™\ŠÜšY[][Û˜Ú[™ÙX
KKœ™[[İ™J
_J_Y[˜İ[ÛˆÜ
J^Û]YKÓİÙ\Ø\ÙJ
NÜ™]\›‹Û˜XÚ˜XÚËË\İ

OØšYÚ‹ØX™[™0é[Y\‹Ë\İ

OØ]™[š[™Ø‹Û[Ü™Ù[Ÿœ°ïË\İ

OØ[Ü›š[™Ø˜^XY[˜İ[Ûˆ\
J^Û]^Ü›ØY˜›ØÚ\İ\ˆ]ˆZYËˆ\È\İÙZ[™H]Y\šYHZYÙ[œØÚY˜Ø\˜™][ˆœ™][™KZ[ˆ˜Z™]YÈ[™YZ™\™HÚY\œÜ°ïÚXÚHXÚÛ\İ[‹˜ÚÜ˜™\œÛÜ™İ[™È\İYHİ[œİH]\›È[ˆÜ0é\™HÛÛœÙ\]Y[™[ˆ[^]Ø[™[‹˜Ø]N˜YHØÚ˜[šÙH™[›\›]Xˆ›Ûˆ™\Ø[[™Ë˜Û\›Ø\™˜Z[ˆÛ[[Xœ™]Ø[›ˆZ[™HØY™™HÙZ[‹Ú™H[HØY™™[œ™XÚ]Y]]XÚ[‹˜Ø[\˜[\ˆ[HÜˆ™YÚ[›\ÈÛØÚ[™[™KˆYH™]ÙZ\Ù°ï[™È[™]˜šYÚ˜Z]™Y\ˆİ[™HÙ\™[ˆ\İ0é™Hİ0éšÙ\ˆ[™\š[›™\[™Ù[ˆ[]™\›0éÜÚYÙ\‹˜İ[™^N˜ÛÛ›YÈ[ØÚZY]ÚXÚØˆ\ÈZ[™HÙ\ØÚXÚHÙ\ˆZ[ˆZİ[›Ü™Ø[™ÈØ\‹˜NÜ™]\›ˆÙWOÏİœ›ØYY[˜İ[Ûˆœ
J^Û]^Ø\œš]˜[İ]N˜[šİ[™	ˆ™^™\[Û˜ÛÜN˜İ[™[\ÈÚZ]ÙÙXšY]ˆœ™][™XÚÙZ]\ˆ˜XÚ›Ü›][\›YÙK˜K›Üİ]N˜›Ü™0é™XÛÜN˜YšXKRÛ]\ÙK]Y\˜Ø[\\ˆ[™[™ÙYœ˜YİH\™˜Z[™ÜİÙ\K˜KÙ[˜[İ]N˜]XÚ\œ]˜ÛÜN˜™[Ü™Z\ËØ[š]0éˆ[™YHÜ\˜]]™HZ]H\ÈÛÛ›Û™\›\İË˜K™\İ]˜[İ]N˜™\İÚY\ÙXÛÜN˜™XÚ\‹°éH[™ÜÜXÚ[YÙY]]]\ˆ[ÛÚÛÛÛœİ[K˜KÛÛÙ[™İ]N˜Ù\šXÙZÙ˜ÛÜN˜Ù\šÜİ]Ø[Ø][H[™]Y™°éYÈÙYZYÛ™]HXÚÙ[‹˜K™XXÚİ]N˜İ˜[™ÛÜN˜Ø\ÜÙ\‹]\İYÈ[™0í™™™[XÚÚXÚ˜\™H™Z[ØÚZY[™Ù[‹˜KÛİ™Nİ]N˜ZYÙHXÚÛÜN˜\ˆÙ[[™HÜ[ˆ[HZ[ˆÙ\Ü°éÚZ\Ù\ˆÙ\™[ˆ\™‹˜KØ[\Ü›İ[™İ]N˜›]YHYšXXÛÜN˜\ˆÙ\Ø[]H]ˆ\İZ[ˆ\Ø[[Y[š0é™Ù[™\ˆÛŞšX[\ˆ™[\İ[™Üİ\İ˜_NÜ™]\›ˆÙWOÏİ˜Ø[\Ü›İ[™Y[˜İ[Ûˆ\

^Û]OV×NÜ™]\›ØY

^ÙKœ\Ú

_K[Š
^Ù›ÜŠÙK›[™İÊYKœÜ

OËŠ
___Y[˜İ[Ûˆ	
K
^Û]]\[ÙˆOOXİš[™ØÙØİ[Y[œ]Y\TÙ[XİÜŠJN™Kœ]Y\TÙ[XİÜŠÏØ
NÚYŠ[Š]›İÈ\œ›ÜŠZ\ÜÚ[™ÈØ[\ZYÛˆ[š[˜Ù[Y[[[Y[ˆ	İ\[ÙˆOOXİš[™ØÙNX
NÜ™]\›ˆŸ]˜\ˆœX[\ËX›]YKXYšXK]^]Œ˜^ÚYÚÛÛ˜\İˆLK\™ÙU^ˆLK™YXÙY[İ[ÛˆLKÛÛ\XİYˆL_Kœ[›J
K\[[HLKœHLNŞœ

NÙ[˜İ[Ûˆœ

^Û]OJ
OO™Øİ[Y[™Ù][[Y[RY
Ø[\ZYÛ‹YØ[YX
OÊœ

KL
NˆLNÚYŠJ
J\™]\›Û][™]È]]][Û“ØœÙ\™\Š

OOÙJ
I‰™\ØÛÛ›™Xİ

_JNİ›ØœÙ\™JØİ[Y[™Øİ[Y[[[Y[ØÚ[\İˆLİX™YNˆLJ_Y[˜İ[Ûˆœ

^ÙØİ[Y[™Øİ[Y[[[Y[˜Û\ÜÓ\İ˜ÛÛZ[œÊ^\Û\Ú]Œ˜
_
Øİ[Y[™Øİ[Y[[[Y[˜Û\ÜÓ\İ˜Y
^\Û\Ú]Œ˜
KJ
Kœ

K

K\

KÜ

K\

Kœ

K\

K›J
J_Y[˜İ[Ûˆœ

^Û]OYØİ[Y[œ]Y\TÙ[XİÜŠÜ˜\˜
NÚYŠYJ\™]\›Û]YKœ]Y\TÙ[XİÜŠ˜œ˜[™Ü[˜
Nİ	‰Š^ÛÛ[XÈĞSTRQÓˆ0­ÈVÈPSÑÕQHTUX
NÛ]YØİ[Y[˜Ü™X]Q[[Y[
]˜
NÛ‹˜Û\ÜÓ˜[YOX^]Ü˜\‹]ÛÛØ‹š[›™\’SXÜ[ˆÛ\ÜÏHœØ]™KZ[™XØ]Üˆˆ\šXK[]™OHœÛ]HOÚO‘Ù\ÜZXÚ\ØÜÜ[]Ûˆ\OH˜]Ûˆˆ]K]^Z[\šXK[X™[H™YY[[™ÜÚ[™H0í™™›™[ˆÏØ]Û]Ûˆ\OH˜]Ûˆˆ]K]^\Ù][™ÜÈ\šXK[X™[H‘\œİ[[™ÈZ[œİ[[ˆ¸¦¦OØ]Û˜Kœ]Y\TÙ[XİÜŠ˜]˜
OË˜™Y›Ü™JŠK‹œ]Y\TÙ[XİÜŠÙ]K]^\Ù][™Ü×X
OË˜Y]™[\İ[™\ŠÛXÚØ
K‹œ]Y\TÙ[XİÜŠÙ]K]^Z[X
OË˜Y]™[\İ[™\ŠÛXÚØœ
_Y[˜İ[Ûˆ

^ÙØİ[Y[œ]Y\TÙ[XİÜ[
œ[™[ˆÙXİ[Û˜
K™›Ü‘XXÚ

K
OOÚYŠK™]\Ù]™\ØÛÜİ\™T™XYJ\™]\›Û]YKœ]Y\TÙ[XİÜŠ˜
NÚYŠ[Š\™]\›ÙK™]\Ù]™\ØÛÜİ\™T™XYOXXÛ][‹^ÛÛ[Ëš[J
_™\™ZXÚ	İ
Ì_XOYØİ[Y[˜Ü™X]Q[[Y[
]Û˜
NÚK\OX]Û˜K˜Û\ÜÓ˜[YOX[™[Y\ØÛÜİ\™XKš[›™\’SXÜ[‰ØÛJŠ_OÜÜ[O¸£!ÚO˜‹œ™\XÙUÚ]
JKË‹‹™K˜Ú[™[—K™š[\ŠOO™HOOZJK™›Ü‘XXÚ
OO™K˜Û\ÜÓ\İ˜Y
[™[Y\ØÛÜİ\™KXÛÛ[
JNÛ]OX[™[‰Ü‹ÓİÙ\Ø\ÙJ
_XÏ[ØØ[İÜ˜YÙK™Ù]][JJOOOXÛÜÙYÙK˜Û\ÜÓ\İÙÙÛJÛÛ\ÙYÊKKœÙ]]šX]J\šXKY^[™Yİš[™Ê[ÊJKK˜Y]™[\İ[™\ŠÛXÚØ

OOÛ]HYK˜Û\ÜÓ\İ˜ÛÛZ[œÊÛÛ\ÙY
NÙK˜Û\ÜÓ\İÙÙÛJÛÛ\ÙY
KKœÙ]]šX]J\šXKY^[™Yİš[™Ê]
JKØØ[İÜ˜YÙKœÙ]][JKØÛÜÙY˜Ü[˜
_J_J_Y[˜İ[Ûˆ\

^Û]OJ
OOÛ]OYØİ[Y[œ]Y\TÙ[XİÜŠ›[Øš[K\[™[\ÚY]
KYOËœ]Y\TÙ[XİÜŠ›[Øš[K\ÚY]XÛÛ[
NÚYŠY_]K™]\Ù]XœÔ™XYJ\™]\›ˆHYOË™]\Ù]XœÔ™XYNÙK™]\Ù]XœÔ™XYOXXÛ]YØİ[Y[˜Ü™X]Q[[Y[
˜]˜
NÛ‹˜Û\ÜÓ˜[YOX[Øš[KZY]XœØ‹œÙ]]šX]J\šXK[X™[QP™\™ZXÚX
K‹š[›™\’SX]Ûˆ\OH˜]Ûˆˆ]KZY]XHœİ]\ÈˆÛ\ÜÏH˜Xİ]™H”İ]\ÏØ]Û]Ûˆ\OH˜]Ûˆˆ]KZY]XHœÛØÚX[”ÛŞšX[Ø]Û]Ûˆ\OH˜]Ûˆˆ]KZY]XHœ›ÙÜ™\ÜÈ‘›ÜØÚš]Ø]Û˜Kœ]Y\TÙ[XİÜŠXY\˜
OË˜Y\ŠŠNÛ]YOOÛ‹œ]Y\TÙ[XİÜ[
]Û˜
K™›Ü‘XXÚ
O˜Û\ÜÓ\İÙÙÛJXİ]™X™]\Ù]šYXOOYJJKœ]Y\TÙ[XİÜ[
œ[™[ˆÙXİ[Û‹œ[™[ˆœ]ZXÚËXXİ[ÛœØ
K™›Ü‘XXÚ
OİšY[Z[Jœ]Y\TÙ[XİÜŠœ[™[Y\ØÛÜİ\™HÜ[˜
OË^ÛÛ[ËÓİÙ\Ø\ÙJ
OÏØ˜Û\ÜÓ\İ˜ÛÛZ[œÊ]ZXÚËXXİ[ÛœØ
JHOOY_JKœØÜ›ÛÊİÜŒ™Z]š[Ü‘œœ™YXÙY[İ[ÛØ]]Ø˜Û[ÛİJ_NÜ™]\›ˆ‹˜Y]™[\İ[™\ŠÛXÚØOOÛ]YK\™Ù]˜ÛÜÙ\İ
Ù]KZY]X—X
NİË™]\Ù]šYX‰‰œŠ™]\Ù]šYXŠ_JK™]È]]][Û“ØœÙ\™\Š

OOœŠ‹œ]Y\TÙ[XİÜŠ˜Xİ]™X
OË™]\Ù]šYXÏØİ]\Ø
JK›ØœÙ\™JØÚ[\İˆLİX™YNˆL_JKŠİ]\Ø
KLNÚYŠJ
J\™]\›Û][™]È]]][Û“ØœÙ\™\Š

OOÙJ
I‰™\ØÛÛ›™Xİ

_JNİ›ØœÙ\™JØİ[Y[™Øİ[Y[[[Y[ØÚ[\İˆLİX™YNˆLJ_Y[˜İ[ÛˆÜ

^Û]OVØÙ[™\šXË[[Ù[˜]K[[Ù[Z[šYØ[YK[[Ù[K›X\
OO™Øİ[Y[™Ù][[Y[RY
JJK™š[\ŠOOˆHYJNÚYŠYK›[™İ
\™]\›Û]J
OOÚYŠTœ
^Ù›ÜŠ]ÙˆJ^Û]OH]šY[İœÙ]]šX]J\šXKZY[˜İš[™ÊYJJKI‰ˆ]™]\Ù]™›Øİ\ÙYÊ™]\Ù]™›Øİ\ÙYXX\YØİ[Y[˜Xİ]™Q[[Y[[œİ[˜Ù[ÙˆS[[Y[ÙØİ[Y[˜Xİ]™Q[[Y[›[Ú[™İËœÙ][Y[İ]


OO˜[J
JJNˆYI‰™]\Ù]™›Øİ\ÙY	‰Š[]H™]\Ù]™›Øİ\ÙY\Ë™›Øİ\ÊÜ™]™[ØÜ›ÛˆLJJ_\›J
__K[™]È]]][Û“ØœÙ\™\Š
NÙK™›Ü‘XXÚ
OO›‹›ØœÙ\™JKØ]šX]\ÎˆL]šX]Qš[\–ØY[˜KÚ[\İˆLİX™YNˆLÚ\˜Xİ\‘]NˆLJJKØİ[Y[˜Y]™[\İ[™\ŠÙ^YİÛ˜OÛ]VË‹‹™Øİ[Y[œ]Y\TÙ[XİÜ[
^]][]K[[Ù[
WK™š[™
OOˆYKšY[ŠOÏÙK™š[™
OOˆYKšY[ŠNÛ‰‰ŠšÙ^OOOX\ØØ\X	‰›‹œ]Y\TÙ[XİÜŠ›[Ù[^Ù]K[Z[šKXÛÜÙWKØ˜]KXÛÜÙN››İ
ÚY[—JKÙ]K]^XÛÜÙWX
OË˜ÛXÚÊ
KšÙ^OOOXX˜	‰›ÛJŠK×–ÌKNWIË\İ
šÙ^JI‰›‹šYOOXÙ[™\šXË[[Ù[	‰–Ë‹‹›‹œ]Y\TÙ[XİÜ[
Û[Ù[[Ü[ÛœÈˆ]Û››İ
™\ØX›Y
X
WVÓ[X™\ŠšÙ^JKLWOË˜ÛXÚÊ
J_JK

_Y[˜İ[ÛˆÜ

^Û]OYØİ[Y[™Ù][[Y[RY
Ù[™\šXË[[Ù[
KYØİ[Y[™Ù][[Y[RY
[Ù[]]X
KYØİ[Y[™Ù][[Y[RY
[Ù[XÛÜX
NÚYŠY_KšY[Ÿ][Š\™]\›Û]SØš™Xİ˜[Y\Êİ
K™š[™
OO™K›˜[YOOO]^ÛÛ[Ëš[J
JKOYKœ]Y\TÙ[XİÜŠ™X[ÙİYK\\œÛÛ˜X
NÚYŠ\Š^ÚOËœ™[[İ™J
KK˜Û\ÜÓ\İœ™[[İ™JÚ\˜Xİ\‹YX[ÙİYX
NÜ™]\›Ÿ[]OV
‹šY
NÚYŠXJ\™]\›ÙK˜Û\ÜÓ\İ˜Y
Ú\˜Xİ\‹YX[ÙİYX
NÛ]ÏSØJ
OËœÛ˜\Úİ

Kœ™[][ÛœÚ\ÖÜ‹šYOÏÌÏUËœÛ˜\Úİ

Kœ™[][ÛœÚ\›Û\ÖÜ‹šYOÏÌÏSX]›X^
LLX]›Z[ŠLÊÜÊJKXÏLÌØ™\˜]]˜ÏLLØÙ™™[˜˜ÏLØ™]]˜[˜ÏKLŒØÚÙ\\ØÚ˜[™Ù\Ü[›OZOÏÙØİ[Y[˜Ü™X]Q[[Y[
\ÚYX
NİK˜Û\ÜÓ˜[YOXX[ÙİYK\\œÛÛ˜XKš[›™\’SX]ˆÛ\ÜÏH™X[ÙİYK\Ü˜Z]ˆİ[OH‹K\Ü˜Z]‰ÜÛJ‹šY
_H‰ØÛJ‹œÜ˜Z]
_OØÙ]]ˆÛ\ÜÏH™X[ÙİYK\\œÛÛ˜KXÛÜHÛX[‰ØÛJKœ›ÛJ_OÜÛX[İ›Û™Ï‰ØÛJ‹›˜[YJ_OÜİ›Û™Ï‰ØÛJK˜ØY[˜ÙJ_OÜ]ˆÛ\ÜÏH™X[ÙİYK]YÜÈ‰ØK˜[Y\ËœÛXÙJÊK›X\
OO˜Ü[‰ØÛJJ_OÜÜ[˜
Kš›Ú[Š
_OÙ]Ù]]ˆÛ\ÜÏH™X[ÙİYK\™[][ÛˆÜ[™^šYZ[™ÏÜÜ[]Hİ[OHÚY‰ÓX]›X^
X]›Z[ŠLÊÍL
J_IHÚOÙ]‰ØÏLØ
Ø˜IØßOØ[O‰ÛOÙ[OÙ]˜_‹˜™Y›Ü™JJ_Y[˜İ[ÛˆÜ

^Û]OYØİ[Y[™Ù][[Y[RY
[Ù[[Ü[ÛœØ
NÙI‰™Kœ]Y\TÙ[XİÜ[
œØÛÜHˆ]Û˜
K™›Ü‘XXÚ

K
OOÚYŠYKœ]Y\TÙ[XİÜŠ˜ÚÚXÙKZ[™^
J^Û]YØİ[Y[˜Ü™X]Q[[Y[
X
NÛ‹˜Û\ÜÓ˜[YOXÚÚXÙKZ[™^‹^ÛÛ[Tİš[™Ê
ÌJKKœ™\[™
Š_[]YKœ]Y\TÙ[XİÜŠÛX[
OË^ÛÛ[ÏØÙK™]\Ù]œš\ÚÏ[‹š[˜ÛY\Ê’TÒĞS•
OØš\ÚŞX›‹š[˜ÛY\ÊP•ğáÕS‘Ø
OØ˜[[˜ÙY›‹š[˜ÛY\ÊÒPÒT˜
OØØY™X˜K™]\Ù]˜ÚÚXÙUÛ™OVË‹‹™K˜Û\ÜÓ\İK™š[™
OO™Kœİ\ÕÚ]
Û™KX
JOËœ™\XÙJÛ™KX
OÏØ›Ü›X[J_Y[˜İ[Ûˆ\

^Û]OYØİ[Y[œ]Y\TÙ[XİÜŠÛÜ›Yœ˜[YX
NÚYŠYJ\™]\›Û]YØİ[Y[˜Ü™X]Q[[Y[
]Û˜
Nİ\OX]Û˜˜Û\ÜÓ˜[YOXÜš]XØ[\İ]\ËX˜[›™\˜šY[HLK˜\[™

NÛ]J
OOÛ]OSØJ
OËœÛ˜\Úİ

NÚYŠYJ\™]\›Û]V×NÙK›™YYË\œİMÍ‰‰›‹œ\Ú
ÛX™[˜\œİ˜[YN™K›™YYË\œİXİ[Û˜Ø\ÜÙ\ˆ[H[™[\ˆ™\Ù[™[˜JKK›™YYË™[™\™ŞOL	‰›‹œ\Ú
ÛX™[˜[™\™ÚYX˜[YN™K›™YYË™[™\™ŞKXİ[Û˜[H™[Ù\ˆ0ï™\ˆQZ[˜JKK›™YYË˜›Y\N‰‰›‹œ\Ú
ÛX™[˜›\ÙX˜[YN™K›™YYË˜›Y\‹Xİ[Û˜Ø[š]0éˆÙ\ˆXÚÙH]YœİXÚ[˜JKK›™YYËš[™Ûİ™\MŒ‰‰›‹œ\Ú
ÛX™[˜Ø]\˜˜[YN™K›™YYËš[™Ûİ™\‹Xİ[Û˜ØY™™YKØ\ÜÙ\‹ZHÙ\ˆX›]XJNÛ][–ÌNİšY[H\‹‰‰Šš[›™\’SXOˆOÚO]İ›Û™Ï‰ØÛJ‹›X™[
_HÜš]\ØÚ0­È	ÓX]œ›İ[™
‹˜[YJ_OÜİ›Û™ÏÛX[‰ØÛJ‹˜Xİ[ÛŠ_OÜÛX[Ù]˜
_Nİ˜Y]™[\İ[™\ŠÛXÚØ

OO™Øİ[Y[œ]Y\TÙ[XİÜŠ›[Øš[KZY]ÙÙÛX
OË˜ÛXÚÊ
JKÚ[™İËœÙ][\˜[
‹L
KŠ
_Y[˜İ[Ûˆœ

^ÙØİ[Y[˜Y]™[\İ[™\ŠÙ^YİÛ˜OOÙK\™Ù][œİ[˜Ù[ÙˆS[œ][[Y[K\™Ù][œİ[˜Ù[ÙˆSÙ[Xİ[[Y[K\™Ù][œİ[˜Ù[ÙˆS^\™XQ[[Y[
KšÙ^KÓİÙ\Ø\ÙJ
OOOX	‰ˆYØİ[Y[˜›ÙK˜Û\ÜÓ\İ˜ÛÛZ[œÊØ[\ZYÛ‹[[Ù[[Ü[˜
I‰™Øİ[Y[œ]Y\TÙ[XİÜŠ›[Øš[KZY]ÙÙÛX
OË˜ÛXÚÊ
KKšÙ^KÓİÙ\Ø\ÙJ
OOOXX	‰ˆYØİ[Y[˜›ÙK˜Û\ÜÓ\İ˜ÛÛZ[œÊØ[\ZYÛ‹[[Ù[[Ü[˜
I‰–œ

J_J_Y[˜İ[Ûˆ\

^Û]OLÕËœİXœØÜšX™J

OOÛ]YØİ[Y[œ]Y\TÙ[XİÜŠœØ]™KZ[™XØ]Ü˜
K]Ëœ]Y\TÙ[XİÜŠ˜
NÈ][Ÿ
˜Û\ÜÓ\İ˜Y
Ø]š[™Ø
K‹^ÛÛ[XÜZXÚ\8 )˜Ú[™İË˜ÛX\•[Y[İ]
JKO]Ú[™İËœÙ][Y[İ]


OOİ˜Û\ÜÓ\İœ™[[İ™JØ]š[™Ø
K˜Û\ÜÓ\İ˜Y
Ø]™Y
K‹^ÛÛ[XÙ\ÜZXÚ\Ú[™İËœÙ][Y[İ]


OO˜Û\ÜÓ\İœ™[[İ™JØ]™Y
KL
_K
J_J_Y[˜İ[Ûˆ

^Ô\
^\Ù][™ÜË[[Ù[\œİ[[™Ø]ˆÛ\ÜÏH^\Ù][™Ë[\İ‰Ù[JYÚÛÛ˜\İÚ\ˆÛÛ˜\İİ0éšÙ\™HØ[[ˆ[™Û\™\™H\İ[™Ù˜\˜™[˜
_IÙ[J\™ÙU^Ü°í°çÙ\™HØÚšYX[ÙÙK[ÙZ\ÙH[™Y[°ïÈÙ\™[ˆ™\™Ü°í°çÙ\
_IÙ[J™YXÙY[İ[Û˜™Y^šY\H™]ÙYİ[™ØÙ[šYÙ\ˆØ[Y\˜Y°ï[™È[™RKP[š[X][Û™[˜
_IÙ[JÛÛ\XİYÛÛ\Zİ\È\ÚİÜRQÙZ][Z[HØÚX[\‹Ù[™\™ZXÚÜ°í°çÙ\˜
_OÙ]˜
Kœ]Y\TÙ[XİÜ[
Ù]K]^\™Y—X
K™›Ü‘XXÚ
OO™K˜Y]™[\İ[™\ŠÚ[™ÙX

OOÛ]YK™]\Ù]^™YÑœ^Ë‹‹‘œİN™K˜ÚXÚÙYKØØ[İÜ˜YÙKœÙ]][Jœ”ÓÓ‹œİš[™ÚYJœ
JKJ
_JJ_Y[˜İ[Ûˆœ

^Ô\
^Z[[[Ù[™YY[[™È[™ÜšY[Y\[™Ø]ˆÛ\ÜÏH^Z[YÜšYÙXİ[Û•ÑSØØ™•ĞTÑÚØ™ˆÙ\ˆ[œÚXÚ˜\™\ˆ›Ş\İXÚÈ[šÜËˆØ™‘OÚØ™ˆÙ\ˆZİ[ÛœÚÛ›Üˆ™XÚËÜÜÙXİ[ÛÙXİ[Û’QØØ™’ÚØ™ˆ0í™™›™]\È[Øš[HQˆ™\™ZXÚHÚ[™[ˆİ]\ËÛŞšX[[™›ÜØÚš]ÙYÛYY\ÜÜÙXİ[ÛÙXİ[Û‘PSÑÑOØØ™Œx $ÎOÚØ™ˆğéÚXÚ˜\™HÜ[Û™[‹ˆš\ÚZÛËÛˆ[™Ú\šİ[™ÈİZ[ˆ[ˆ\ˆ]\İØZÜÜÙXİ[ÛÙXİ[Û“RS’TÔQSOØ’™Y\ÈÜY[İ\]Z]İ]Y\[™ÜÙ\šÛ0é[™Ëˆ[™K]\ÙH[™ÚYY\šÛ[™È›ZX™[ˆ\œ™ZXÚ˜\‹ÜÜÙXİ[ÛÙXİ[Û‘“Ô•ĞÒ’UØ‘Ù\Ü°éÚKZ[š\ÜY[H[™ğé\™H™\°é™\›ˆ™^šYZ[™Ù[‹Y‹[™[‹YZ\İ\œØÚY[™š[˜[KÜÜÙXİ[ÛÙXİ[Û”ÔRPÒT“Ø”™[]˜[H[ØÚZY[™Ù[ˆÙ\™[ˆ]]ÛX]\ØÚÚØ[Ù\ÜZXÚ\ÜÜÙXİ[ÛÙ]˜
_Y[˜İ[Ûˆ\
KŠ^Û]YØİ[Y[™Ù][[Y[RY
JNÜ™]\›ˆŸ
YØİ[Y[˜Ü™X]Q[[Y[
ÙXİ[Û˜
K‹šYYK‹˜Û\ÜÓ˜[YOX^]][]K[[Ù[‹šY[HL‹š[›™\’SX\XÛO]Ûˆ\OH˜]ÛˆˆÛ\ÜÏH›[Ù[^ˆ]K]^XÛÜÙO°åÏØ]ÛÜ[•VÈPĞÑTÔÒP’SUOÜÜ[Ú]ˆÛ\ÜÏH^]][]KX›ÙHÙ]Ø\XÛO˜Øİ[Y[˜›ÙK˜\[™
ŠK‹œ]Y\TÙ[XİÜŠÙ]K]^XÛÜÙWX
OË˜Y]™[\İ[™\ŠÛXÚØ

OO‰
ŠJK‹˜Y]™[\İ[™\ŠÛXÚØOOÙK\™Ù]OO\‰‰‰
Š_JJK‹œ]Y\TÙ[XİÜŠ˜
K^ÛÛ[]‹œ]Y\TÙ[XİÜŠ^]][]KX›ÙX
Kš[›™\’S[‹‹šY[HLKØİ[Y[˜›ÙK˜Û\ÜÓ\İ˜Y
Ø[\ZYÛ‹[[Ù[[Ü[˜
KÚ[™İËœÙ][Y[İ]


OO˜[JŠJKŸY[˜İ[Ûˆ	
J^ÙKšY[HLØİ[Y[˜›ÙK˜Û\ÜÓ\İÙÙÛJØ[\ZYÛ‹[[Ù[[Ü[˜Ë‹‹™Øİ[Y[œ]Y\TÙ[XİÜ[
›[Ù[^]][]K[[Ù[
WKœÛÛYJOOˆYKšY[ŠJ_Y[˜İ[Ûˆ[JKŠ^Ü™]\›˜X™[[œ]\OH˜ÚXÚØ›Şˆ]K]^\™YH‰Ù_Hˆ	ÑœÙWOØÚXÚÙY˜OÜ[İ›Û™Ï‰ØÛJ
_OÜİ›Û™ÏÛX[‰ØÛJŠ_OÜÛX[ÜÜ[OÚOÛX™[˜Y[˜İ[ÛˆJ
^Û]OYØİ[Y[™Øİ[Y[[[Y[ÙK˜Û\ÜÓ\İÙÙÛJ^ZYÚXÛÛ˜\İœšYÚÛÛ˜\İ
KK˜Û\ÜÓ\İÙÙÛJ^[\™ÙK]^œ›\™ÙU^
KK˜Û\ÜÓ\İÙÙÛJ^\™YXÙY[[İ[Û˜œœ™YXÙY[İ[ÛŠKK˜Û\ÜÓ\İÙÙÛJ^XÛÛ\XİZYœ˜ÛÛ\XİY
_Y[˜İ[Ûˆ›J
^İ^Ü™]\›Ë‹‹”‹‹’”ÓÓ‹œ\œÙJØØ[İÜ˜YÙK™Ù]][Jœ
OÏØßX
__XØ]ÚÜ™]\›Ë‹‹”__Y[˜İ[Ûˆ›J
^Ó
HL™\]Y\İ[š[X][Û‘œ˜[YJ

OOÓHLKœHLİ^ÑÜ

KÜ

K

_Yš[˜[^ÔœHL__JJ_Y[˜İ[Ûˆ[JK
^Ü™]\›ˆŞ\İ0é™_™Y0ï™›š\ÜÙ_[™[\‹Ë\İ
JOØİ]\Ø‹Ø™^šYZ[™Ù[Ÿ›\ßX[KË\İ
JOØÛØÚX[˜›ÙÜ™\ÜØY[˜İ[Ûˆ[JJ^ÙKœ]Y\TÙ[XİÜŠ]Û››İ
™\ØX›Y
KÚ™Y—K[œ]››İ
™\ØX›Y
KÙ[Xİ››İ
™\ØX›Y
KİXš[™^N››İ
İXš[™^H‹LH—JX
OË™›Øİ\ÊÜ™]™[ØÜ›ÛˆLJ_Y[˜İ[ÛˆÛJK
^Û]VË‹‹œ]Y\TÙ[XİÜ[
]Û››İ
™\ØX›Y
KÚ™Y—K[œ]››İ
™\ØX›Y
KÙ[Xİ››İ
™\ØX›Y
KİXš[™^N››İ
İXš[™^H‹LH—JX
WK™š[\ŠOOˆYKšY[‰‰™K›Ù™œÙ]\™[OO[[
NÚYŠ[‹›[™İ
\™]\›Û][–ÌKO[–Û‹›[™İLWNÙKœÚYÙ^I‰™Øİ[Y[˜Xİ]™Q[[Y[OO\ÊKœ™]™[Y˜][

KK™›Øİ\Ê
JNˆYKœÚYÙ^I‰™Øİ[Y[˜Xİ]™Q[[Y[OOZI‰ŠKœ™]™[Y˜][

K‹™›Øİ\Ê
J_Y[˜İ[ÛˆÛJJ^Ü™]\›Ø[™™N˜ÙMXYØ™[™N˜Í˜ØM˜\œÎ˜ÍXX™L[›N˜Ù™MÌØÜ™YÛÜ˜ÙÎLÙX\Û˜Í™˜ØÚX™\˜Í™˜MM™™[^˜Ø™XÙ˜ØÚ[XN˜ÍNM˜Xİ[™[N˜ÙMMØÎY[N˜ÍŒXM™›Û›N˜ÙMYX[›šN˜ÍŒØÎXİ\ÚN˜ØÍYÎX[N˜ÌÙÎ˜Ú\˜N˜ÍM˜VÙWOÏØÙYÍYY[˜İ[ÛˆÛJJ^Ü™]\›ˆKœ™\XÙJÖÉ‰È—KÙËOOŠÈ‰ˆ˜	˜[\Ø˜	›Øˆ˜	™İØ‰È˜	ˆÌÎNØ	È‰Î˜	œ][İØJVÙWOÏÙJ_]˜\ˆOX‹ŒŒ[OX[\ËX›]YKXYšXK[ËXØ[\ZYÛ‹[Y]K]Œ˜OX[\ËX›]YKXYšXK[Ë[XZ[‹]ŒX›OX[\ËX›]YKXYšXKYØ[Y\^KY\]Œ˜OVØ›\İ\™Y\”Û™Ø›[šŞX˜[K[OVØ™[™X\œØ[›XÜ™YÛÜ˜X\ÛØÚX™\™[^ØÚ[XX›Û›XX[›šXİ\ÚX[XKO^Ü™[™N˜™[°êX\œÎ˜\œØ[›N˜[›XÜ™YÛÜ˜Ü™YÛÜ˜X\Û˜X\ÛØÚX™\˜ØÚX™\™[^˜™[^ØÚ[XN˜ØÚ[XX›Û›N˜›Û›XX[›šN˜X[›šXİ\ÚN˜İ\ÚX[N˜[XKÛO^Ü™[™N–Ø[[™ØÜ™[™ØÙÚ\İZØK\œÎ–ØÛŞšX[Ù]˜Y[šÙX[\›İš\Ø][Û˜K[›N–ØÚ[ÜØ™]ÙYİ[™ØÚY\œÜXÚKÜ™YÛÜ–Ø[˜[\ÙXÜÜ™[Ø˜XÚ[™ØKX\Û–ØÚ[ÜØØÚY˜[\›İš\Ø][Û˜KØÚX™\–Ø[[™ØXÚšZØÜ™[™ØK™[^–Ø[˜[\ÙX™Z]Ü™[™ØKØÚ[XN–ØÙ]˜Y[šÙXÛŞšX[ÙÚ\İZØK›Û›N–Ø[˜[\ÙXÚY\œÜXÚYÛØKX[›šN–ØXÚšZØ™]ÙYİ[™ØÙÚ\İZØKİ\ÚN–ØÛŞšX[™[Ø˜XÚ[™ØYÛØK[N–ØÛŞšX[ÚY\œÜXÚ™[Ø˜XÚ[™Ø_NÙ[˜İ[ÛˆÛJKŠ^Û]S[X™\‹š\Ñš[š]J[X™\ŠJJOÓ[X™\ŠJNÜ™]\›ˆX]›X^
X]›Z[Š‹ŠJ_Y[˜İ[Ûˆ›JJ^Û]LŒMŒLÍŒŒNÙ›ÜŠ]ˆÙˆİš[™ÊJJ][‹˜Ú\ÛÙP]

KSX]š[][
MÍÍÍŒNJNÜ™]\›ˆŒY[˜İ[Ûˆ[JÜÙYY™OL›İ[™LK[[Z[˜]Y›V×K™]š[İ\ÎœXO^ßJ^Û]O[™]ÈÙ]
ŠKO[[K™š[\ŠOOˆZKš\ÊJI‰™HOO\ŠNÜ™]\›ˆK›[™İ
O[[K™š[\ŠOOˆZKš\ÊJJJKK›[™İ
OVË‹‹›[WJKVİ›J	Ù_N‰İN‰ÜŸN‰ØKš›Ú[Š
_X
IXK›[™İ_Y[˜İ[Ûˆ›JÛZ[[Û˜Z\™RY™OX™[™X›İ[™LKÙYY›LY™šXİ[NœXİ[™\™O^ßJ^Û]OYÛVÙWOÏÖØ™[Ø˜XÚ[™ØÛŞšX[[[™ØKOZVÊLJIZK›[™İKÏZVİ	ZK›[™İKÏVØXÚšZØÙ]˜Y[šÙX™]ÙYİ[™Ø[˜[\ÙXÜ™[™ØÚ[ÜØÛŞšX[KÏ\Öİ›J	ÛŸN‰İN™XÛŞX
I\Ë›[™İNÚKš[˜ÛY\ÊÊI‰ŠÏ\ÖÊËš[™^ÙŠÊJÌÊI\Ë›[™İJNÛ]^Ü[[™Î˜YHZİ[ÛˆÚ\šİH›Ü˜™\™Z]]X™\ˆšXÚ›Ûİ0é™YÈ\˜ÚXÚ˜Ü™[™Î˜™[X[™Ø[›HX›0éY™KÙYÙH[™™Z]™[œİ\ˆ]Y™°éYÈÙ[˜]K˜ÙÚ\İZÎ˜Z[ˆÙYÙ[œİ[™ÙXÚÙ[H[ˆÜÚ™H\ÜÈ™[X[™[ˆ˜[œÜÜ™[Y\šİX™[ˆÚ[˜ÛŞšX[˜YHZ\ÜÚ[Ûˆ]HÙ\Ü°éÚH[™Ü\[™[˜[ZZÈİ]Ù\ØÚÚ[™YÚÙZ]˜Ù]˜Y[šÙN˜Z[ˆÙ]°éšÈÙ\ˆÜ›ÛšÛÜšÙ[ˆİ\™H[È[˜]Y™°éYÙH\›[™ÈZ[™Ù\Ù]˜[\›İš\Ø][Û˜\ˆX›]Yˆ0é™\HÚXÚÜÛ[‹Ú™H›Ûİ0é™YÈ\Ø[[Y[Xœ™XÚ[‹˜Ú[ÜÎ˜YZ™\™HÛZ[™Hİ0íœ[™Ù[ˆ™\™XÚİ[ˆZ[™HÙ^šY[H[™[™Ë˜™]ÙYİ[™Î˜YHÙ\İXÚH\œÛÛˆØ\ˆİ\ˆ]pçÙ\š[ˆ\È0ï›XÚ[ˆ›XÚÙ™[Ë˜ÚY\œÜXÚ˜ÙZH]\ÜØYÙ[ˆ\ÜÙ[ˆ™Z]XÚÙ\ˆ[š[XÚšXÚØ]X™\ˆ\Ø[[Y[‹˜[˜[\ÙN˜™[X[™İ[H[™Ù]ğíš›XÚ°éš\ÙHœ˜YÙ[‹™]›Üˆ0ï™\š]\™\™XÚ™\İ[™˜ÜÜ˜[Z[™È[™Z[™Hİ\™Hğíœœ\›XÚHZİ[ÛˆØ\™[ˆÚXÚYÙ\ˆ[ÈZ[ˆÙ\Ü°éÚ˜™[Ø˜XÚ[™Î˜YH\œÛÛˆİ\ÜİH]Ø\Ë\È\ˆ]\ÈÙ[˜]Y\ˆ™[Ø˜XÚ[™Èİ[[Y[ˆÛÛ›K˜ØÚY˜YHZ\ÜÚ[Ûˆ]HZ[™[ˆ[ÛY[[ˆ[H[™\™H[˜]Y›Y\šÜØ[HÙ\ˆ\œØÚ0íœØ\™[‹˜XÚšZÎ˜Z[ˆXÚš\ØÚ\ˆÙYÙ[œİ[™Ù\ˆZ[™H]š[œİ[][ÛˆÜY[H™\›]]XÚZ[™H™X™[œ›ÛK˜™Z]˜Z[ˆ[™Ù\È™Z]™[œİ\ˆ\İ]™\›0éÜÚYÙ\ˆ[ÈYHÚY\œÜ°ïÚXÚ[ˆ™]YÙ[˜]\ÜØYÙ[‹˜YÛÎ˜YH[™[™H\œÛÛˆÛÛHšXÚ\ˆ\™›ÛËÛÛ™\›ˆ]XÚ[™\šÙ[›[™È°ïˆYHYYK˜KO[ØWOÏÛ˜™[Ø˜XÚ[™Ë[Û×OÏÛœÛŞšX[X[˜™\İ0éYİ\ÈÙ\°ïÚˆ	ÛØ×OÏÛXÚšZßXÜ™]\›ˆOOXX\ŞXÖİK[ÙZ\ÎˆZ[™\İ[œÈÙZHÙZ]\™H\œÛÛ™[ˆZ[[ˆ™]ÙZ[ÈZ[™\ÈY\Ù\ˆY\šÛX[Kˆ˜[Y[ˆÙ\™[ˆ™]İ\ÜİšXÚÙ[˜[›˜NœOOX^\ÖİK‹YHš]HÜ\ˆİ\™H\˜Ú˜XÚ0é›H[™Ü\[™Ù\°ïÚH[˜œ˜]XÚ˜\‹˜N–İK—_Y[˜İ[ÛˆJO^ßK^ßK^ßJ^Û]YKÙYZÙ[™\˜ÏÏŞßNÜ‹›Û[\XYÛ]O\‹œØ]\™^OÏŞßKOSØš™Xİ˜[Y\ÊKœ™[][ÛœÚ\›Û\ÏÏŞßJK™š[\Š[X™\‹š\Ñš[š]JKÏXK›[™İØKœ™YXÙJ
K
OO™Jİ
KØK›[™İŒÏ]œİ]OÏİœÛ˜\ÚİÏİÏ\Ë›™YYÏÏŞßK\Ë›Y]šXÜÏÏŞßKOSØš™Xİ˜[Y\Ê‹›Û[\XYËœİ˜]YÚY\ÏÏŞßJK]K™š[\ŠOO™OOOXX[X
K›[™İ]K™š[\ŠOO™OOOXš\ÚØ
K›[™İ]K™š[\ŠOO™OOOXØY™X
K›[™İO[‹›Û[\XYË›İ]ÛÛY\ÏÏÖ×K[K™š[\ŠOO™KœİXØÙ\ÜÊK›[™İÏ[K™š[\ŠOO™Kœ]X[]OOOX\™™Xİ
K›[™İÏ[K™š[\ŠOOˆYKœİXØÙ\ÜÊK›[™İWÛJ
ÛÊ‹ŒÍJÊK˜Xİ]™UX[OË›[™İÏÌ
JJÙ

Ú
Œ‹WÊŒËL
KOWÛJ
LS[X™\ŠË™[™\™ŞOÏÍÍJJJ‹MJÓ[X™\ŠË˜[ÛÚÛÏÌ
J‹ŒŒŠÙŠJÛK›[™İ
ŒË\
L
KWÛJ[X™\Š‹›šYÚ›Ú\ÙOÏÌ
J‹Î
Ó[X™\ŠKœİ\ÜXÚ[ÛÏÌ
J‹ŒÊÙŠK\
JK™›YÜÏË–Ø]]Üš]KYÛÛÙÚ[OÎNŒ
KL
KWÛJ
K™[›U\İ[[ÛOÌLŒ
JÊK™™[^[Y[[™OÌNŒ
JÙ
ÊÓ[X™\Šœ™\]][ÛÏÌ
J‹ŒMJÙÊL
KÏWÛJŠÓ[X™\ŠKÙYZÙ[™ØÛÜ™OÏÌ
J‹ŒN
Ó[X™\Š›[ÛY[[OÏÌ
J‹JÚ
KWÊ^J‹Œ‹L
NÜ™]\›ØÛÚ\Ú[Û“X]œ›İ[™
ŠK˜]YİYN“X]œ›İ[™
JK]]Üš]RX]“X]œ›İ[™
ŠK™\\˜][Û“X]œ›İ[™

K[Ü˜[N“X]œ›İ[™
Ê__Y[˜İ[ÛˆÛJK^ßJ^Û]R”ÓÓ‹œ\œÙJ”ÓÓ‹œİš[™ÚYJOÏŞßJJKO\‹ÙYZÙ[™\˜ÏÏÏ^ßKOZKœØ]\™^OÏÏ^ßKÏS[X™\ŠK™X˜]T™\Üİ\™OÏÌ
KÏS[X™\ŠK™X˜]PÜ›İÙÏÌ
NÚYŠOOX]šY[˜ÙX
^Û]OHHJK™[›U\İ[[ÛI‰˜K™™[^[Y[[™JNØK™X˜]T™\Üİ\™OWÛJËJOÌM
KL
KK™X˜]PÜ›İÙWÛJÊÊOÍŒJKLÌŒ
_Y[ÙHOOX˜[XÊK™X˜]T™\Üİ\™OWÛJËML
KK™X˜]PÜ›İÙWÛJÊÊ[X™\Š‹˜ÛÚ\Ú[ÛÏÌ
OMOÌM
KLÌŒ
JNOOX™XÛİ™\˜ÊKØZÙS[ÛÙWÛJ[X™\ŠKØZÙS[ÛÙÏÌ
JÌL‹L
KK™X˜]T™\Üİ\™OWÛJËMKL
JNOOX›Y™˜	‰ŠK™X˜]T™\Üİ\™OWÛJËLLL
KK™X˜]PÜ›İÙWÛJÊÍKLÌŒ
KK›šYÚ›Ú\ÙOWÛJ[X™\ŠK›šYÚ›Ú\ÙOÏÌ
JÍ‹L
JNÜ™]\›ˆ‹›\İ]™[XÜ›ğçÙ\ÈØ[Y\^KU\]NˆØ[\İYÜİ›Ü˜™\™Z][™È8 '‰İx 'İ\™H]YˆYHX˜]H[™Ù]Ø[™˜ŸY[˜İ[ÛˆÛJ
^Ü™]\›İ™\œÚ[ÛŒ‹\]U™\œÚ[Û›KÛ[\XYÜİ˜]YÚY\ÎßKİ]ÛÛY\Î–×K\İİ]ÛÛYN˜\İİ]ÛÛYP]Œ›Ú\ÙP\YYˆLK›Ú\ÙS[ÙYšY\ŒKØ]\™^NÜ™\\˜][ÛÚÚXÙN˜\YYˆL_KÙXÜ™]ÙY™šXİ[N˜İ[™\™›ÛR\İÜNßK\ÚÙYßK[™\İYØ]Ü”ØÛÜ™NŒš]˜[Y\İYˆLK[™[™ĞXØİ\Ø][Û›[K\İÜN–×__Y[˜İ[ÛˆÛJK^ßJ^İ^Û][ØØ[İÜ˜YÙK™Ù]][JJNÜ™]\›ˆÒ”ÓÓ‹œ\œÙJŠNXØ]ÚÜ™]\›ˆ_Y[˜İ[ÛˆJ
^Û]O]ÛJ›KßJKPÛJ
NÜ™]\›Ë‹‹‹‹™K™\œÚ[ÛŒ‹\]U™\œÚ[Û›KÛ[\XYË‹‹›Û[\XY‹‹™K›Û[\XYÏŞßKİ˜]YÚY\ÎË‹‹›Û[\XYœİ˜]YÚY\Ë‹‹™K›Û[\XYËœİ˜]YÚY\ÏÏŞß_Kİ]ÛÛY\Î\œ˜^Kš\Ğ\œ˜^JK›Û[\XYË›İ]ÛÛY\ÊOÙK›Û[\XY›İ]ÛÛY\ËœÛXÙJLLŠN–×_KØ]\™^NË‹‹œØ]\™^K‹‹™KœØ]\™^OÏŞß_KÙXÜ™]Ë‹‹œÙXÜ™]‹‹™KœÙXÜ™]ÏŞßK›ÛR\İÜNË‹‹œÙXÜ™]œ›ÛR\İÜK‹‹™KœÙXÜ™]Ëœ›ÛR\İÜOÏŞß_K\ÚÙYË‹‹œÙXÜ™]˜\ÚÙY‹‹™KœÙXÜ™]Ë˜\ÚÙYÏŞß__K\İÜN\œ˜^Kš\Ğ\œ˜^JKš\İÜJOÙKš\İÜKœÛXÙJM
N–×__Y[˜İ[Ûˆ[JJ^ÛØØ[İÜ˜YÙKœÙ]][J›K”ÓÓ‹œİš[™ÚYJË‹‹™K\İÜNŠKš\İÜOÏÖ×JKœÛXÙJM
_JJ_Y[˜İ[ÛˆJ
^Ü™]\›ˆÛJ[KßJ_Y[˜İ[ÛˆÛJ
^Ü™]\›ˆÛJKßJ_Y[˜İ[ÛˆÛJJ^ÛØØ[İÜ˜YÙKœÙ]][J[K”ÓÓ‹œİš[™ÚYJJJ_Y[˜İ[Ûˆ[JJ^Ü™]\›ˆVÙWOÏÔİš[™ÊJ_Y[˜İ[Ûˆ›JJ^Ü™]\›ˆİš[™ÊJKœ™\XÙJÖÉ‰È—KÙËOOŠÈ‰ˆ˜	˜[\Ø˜	›Øˆ˜	™İØ‰È˜	ˆÌÎNØ	È‰Î˜	œ][İØJVÙWOÏÙJ_Y[˜İ[Ûˆ[JJ^Û]YKÙYZÙ[™\˜ÏË›Û[\XYÜ™]\›ˆ	‰Š˜İ\œ™[K™š[™
OOˆ]™\ØÚ\[™\ÏË–ÙWOË˜][\Y
J_Y[˜İ[Ûˆ›JJ^Ü™]\›ÜØY™N˜ÛÛ›ÛY\X[N˜X[Y›Úİ\Øš\ÚÎ˜›Û\Èš\ÚZÛØVÙWOÏØ]\ÙÙYÛXÚ[˜Y[˜İ[ÛˆJJ^Ü™]\›ÙX\ŞN˜ØÚÙ\˜İ[™\™˜İ[™\™^\˜^\XVÙWOÏØİ[™\™Y[˜İ[Ûˆ›JJ^Ü™]\›ˆKœ]Y\İİYÙOOOXÙXÜ™][Z[[Û˜Z\™XHYKÙYZÙ[™\˜ÏËœÙXÜ™]Z[[Û˜Z\™OËœİ\YY[˜İ[Ûˆ[JK
^ÙKš\İÜOVË‹‹™Kš\İÜOÏÖ×KØ]›™]È]J
KÒTÓÔİš[™Ê
K^WKœÛXÙJM
_Y[˜İ[ÛˆJJ^Û]YOË™]Z[ÚYŠ]\Kš[˜ÛY\ÊšY
J\™]\›Û]UJ
KX	İšYN‰İœİXØÙ\ÜßN‰İœØÛÜ™_N‰İœ]X[]_XOQ]K››İÊ
NÚYŠ‹›Û[\XY›\İİ]ÛÛYOOO\‰‰šK[‹›Û[\XY›\İİ]ÛÛYP]N
\™]\›Û‹›Û[\XY›\İİ]ÛÛYO\‹‹›Û[\XY›\İİ]ÛÛYP]ZNÛ]O[‹›Û[\XYœİ˜]YÚY\ÖİšYOÏØ˜[[˜ÙYÛ‹›Û[\XY›İ]ÛÛY\ÏVË‹‹›‹›Û[\XY›İ]ÛÛY\Ë™š[\ŠOO™KšYOO]šY
KÚYšYİXØÙ\ÜÎˆH]œİXØÙ\ÜËØÛÜ™N“[X™\ŠœØÛÜ™OÏÌ
K]X[]Nœ]X[]OÏÊœİXØÙ\ÜÏØÛÛY˜˜Z[Y
Kİ˜]YŞN˜_WK[J‹	İšYNˆ	İœİXØÙ\ÜÏØ\™›ÛØ˜™ZØÚYØHZ]	Ó›JJ_K˜
K[JŠKÚ
	Ó›JJ_H]\ÙÙ]Ù\]ˆ	İœİXØÙ\ÜÏØ›Ü›H]Y™ÙX˜]]˜›ÛÙZÛÜİ[ˆİZYÙ[˜K˜
_Y[˜İ[Ûˆ›J
^Û]OUJ
KQJ
NÚYŠK›Û[\XY››Ú\ÙP\YY]ÙYZÙ[™\˜ÏË›Û[\XYË˜ÛÛ\]Y
\™]\›Û]SØš™Xİ˜[Y\ÊK›Û[\XYœİ˜]YÚY\ÏÏŞßJKYK›Û[\XY›İ]ÛÛY\ÏÏÖ×KO[‹œ™YXÙJ
K
OO™JÊOOXØY™XËLÎOOXš\ÚØÍOOXX[XËLNŒ
K
JÜ‹™š[\ŠOOˆYKœİXØÙ\ÜÊK›[™İ
ŒË\‹™š[\ŠOO™Kœ]X[]OOOX\™™Xİ
K›[™İ
ŒİÙYZÙ[™\˜Ë›šYÚ›Ú\ÙOWÛJ[X™\ŠÙYZÙ[™\˜Ë›šYÚ›Ú\ÙOÏÌ
JÚKL
K›\İ]™[XÛ[\XY\İ˜]YÚY[ˆ™\°é™\›ˆ[ˆ[™ğïYÙ[ˆ˜XÚ0é›H[H	ÚOLØ
Ø˜IÚ_K˜K›Û[\XY››Ú\ÙP\YYHLK›Û[\XY››Ú\ÙS[ÙYšY\ZK[JK˜XÚ0é›KS[ÙYšZØ]Üˆ	ÚOLØ
Ø˜IÚ_H[™Ù]Ø[™˜
KÛJ
K[JJKÚ

_Y[˜İ[Ûˆ›JJ^Û]UJ
KQJ
NÚYŠœØ]\™^K˜\YY‹œ]Y\İİYÙHOOXØ]\™^KYX˜]X
\™]\›Û]TÛJ‹KJ‹ÛJ
K
JNİœØ]\™^K˜\YYHLœØ]\™^Kœ™\\˜][ÛÚÚXÙOYK[JØ[\İYÜİ›Ü˜™\™Z][™ÈÙ]ğéˆ	Ù_K˜
KÛJŠK[J
KÚ

_Y[˜İ[Ûˆ›JK
^Ü™]\›ˆOOOXX\ŞXÓX]›Z[ŠX]›X^
Ë[X™\ŠÏÌÊJJN™OOOX^\ÓX]›X^
Ë[X™\ŠÏÍÊJN—ÛJ[X™\ŠÏÍJKKŠ_Y[˜İ[Ûˆ›JK
^Û]YKÙYZÙ[™\˜ÏËœÙXÜ™]Z[[Û˜Z\™NÚYŠ[Ëœİ\Y‹˜ÛÛ\]Y
\™]\›ˆLNÛ]SX]›X^
K[X™\Š‹œ›İ[™ÏÌJJKOHLNİœÙXÜ™]œ›ÛR\İÜVÜ—_
œÙXÜ™]œ›ÛR\İÜVÜ—O[‹›Z[[Û˜Z\™RY[JÜÙYY™KÙYZÙ[™ØÛÜ™K›İ[™œ‹[[Z[˜]Y›‹™[[Z[˜]YJKOHL
NÛ]O]œÙXÜ™]œ›ÛR\İÜVÜ—NÜ™]\›ˆI‰›‹›Z[[Û˜Z\™RYOOXI‰Š‹›Z[[Û˜Z\™RYXKOHL
K]œÙXÜ™]œš]˜[Y\İY	‰œOOLI‰Š‹˜XØİ\Ø][ÛœÏË›[™İÏÌ
OOOL	‰Š‹œš]˜[ØÛÜ™OP›JœÙXÜ™]™Y™šXİ[K‹œš]˜[ØÛÜ™JKœÙXÜ™]œš]˜[Y\İYHLOHL
KI‰ŠÛJJK[J
JK_Y[˜İ[ÛˆJJ^Û]UJ
KQJ
K[‹ÙYZÙ[™\˜ÏËœÙXÜ™]Z[[Û˜Z\™NÚYŠ\ŸY_J‹˜XØİ\Ø][ÛœÏÏÖ×JK™š[™
O“[X™\Šœ›İ[™
OOOS[X™\ŠKœ›İ[™
I‰œİ\ÜXİYOOYKœİ\ÜXİY
J\™]\›Û]OYKœİ\ÜXİYOOYKœ›ÛNÚYŠœÙXÜ™]š[™\İYØ]Ü”ØÛÜ™OWÛJ[X™\ŠœÙXÜ™]š[™\İYØ]Ü”ØÛÜ™OÏÌ
JÊOÓ[X™\ŠKœ›İ[™
JŒÎ‹LJKLL
K[JÙXÜ™]Z[[Û°éˆ[™H	ÙKœ›İ[™Nˆ	Ğ[JKœİ\ÜXİY
_H	ÚOØšXÚYØ˜˜[ØÚH™\ØÚ[Yİ˜
KœÙXÜ™]œ[™[™ĞXØİ\Ø][Û[[\‹˜ÛÛ\]Y	‰“[X™\Š‹œ›İ[™
O“[X™\ŠKœ›İ[™
J^Û]OS[X™\Š‹œ›İ[™
KÏ^[JÜÙYY“[X™\Š‹ÙYZÙ[™ØÛÜ™OÏÌ
JÓ[X™\Š‹ÙYZÙ[™\˜ÏË›šYÚ›Ú\ÙOÏÌ
JË›İ[™˜K[[Z[˜]Yœ‹™[[Z[˜]YÏÖ×K™]š[İ\Î™Kœ›Û_JNİœÙXÜ™]œ›ÛR\İÜVØWO[Ë‹›Z[[Û˜Z\™RY[ËZI‰œÙXÜ™]™Y™šXİ[HOOXX\ŞX	‰Š‹œš]˜[ØÛÜ™OWÛJ[X™\Š‹œš]˜[ØÛÜ™OÏÌ
JÌKL
JK‹›\İ]™[XÙXÜ™]Z[[Û°éˆ[™H	Ø_H\š0éZ[ˆ™]Y\ÈÙZZ[Y\ÈX[™]ˆYH›Üš\šYÙH›ÛH›ZXš\È\ˆÙ\Ø[]]\İÙ\[™È™\™XÚİ˜ÛJŠK[J
KÚ

NÜ™]\›ŸQ[J
KZ

_Y[˜İ[Ûˆ[JK‹Š^Û]OYÛVÙWOÏÖØ™[Ø˜XÚ[™ØKOYOOO]Ï^Ü[[™Î˜8 '’XÚ]HZ[™[ˆX›]Yˆ[HÛÜ‹ˆ\È\İ]YˆY\Ù[H]ˆ™\™Z]È™\™0éÚYÈÙ[YË¸ 'Ü™[™Î˜8 '’XÚÙZpçÈ\‹ÛÈ[™ÙHYYÙ[‹ˆšXÚØ\[HÚYHÜ0í›XÚšXÚYZˆYÙ[‹¸ 'ÙÚ\İZÎ˜8 '’XÚX™H]Ø\ÈÙ]˜YÙ[‹ˆ\ÈXXÚZXÚ›ØÚšXÚ[H˜ZšYZ\‹¸ 'ÛŞšX[˜8 '’XÚX™HZ]šY[[ˆÙ\Ü›ØÚ[‹ˆYHYZ\İ[ˆX™[ˆX™ZHYZˆ™\œ˜][ˆ[ÈXÚ¸ 'Ù]˜Y[šÙN˜8 '‘\ˆÜ›ÛšÛÜšÙ[ˆ™]ÙZ\İ\‹\ÜÈY\ˆ™[X[™Z[ˆÙ]°éšÈÙpí™™›™]]¸ '[\›İš\Ø][Û˜8 '‘\ˆ[ˆ]ÚXÚÙpé™\ˆXÚİ\ÜİH\ˆœ°ï\ˆ]›Ûˆ[È[™\™K¸ 'Ú[ÜÎ˜8 '‘\ÜÈ\È[HZXÚ\[HÚ[İ\ØÚØ\‹\İÙZ[ˆ™[\İ˜\™\ˆ™]ÙZ\Ë¸ '™]ÙYİ[™Î˜8 '’XÚØ\ˆİ\ˆÙYËˆ[™\™HØ\™[ˆ\ˆH™\ØÚ0éYİ\ÈH™[Y\šÙ[‹¸ 'ÚY\œÜXÚ˜8 '“YZ[™H]\ÜØYÙHÚY\œÜšXÚ0í˜Úİ[œÈZ[™\ˆ™\œÚ[Û‹YHÚ™Z[ˆšXÚİ[[]¸ '[˜[\ÙN˜8 '’XÚİ[Hœ˜YÙ[‹™]›Üˆ™[X[™Y\šİ\ÜÈ\ˆ[ÛÜ[ˆœ˜]XÚ¸ 'ÜÜ˜8 '•[Z[™ÈØ\ˆÚXÚYËˆYZˆØYÙHXÚ^HšXÚ¸ '™[Ø˜XÚ[™Î˜8 '’XÚX™H]Ø\ÈÙ\ÙZ[‹ˆØˆ\ÈÚXÚYÈØ\‹[ØÚZYHXÚÜ0é\‹¸ 'ØÚY˜8 '’XÚØ\ˆpïKšXÚ™]İ\ÜİÜËˆ\ÈÚ\™İ0é™YÈ™\ÙXÚÙ[¸ 'XÚšZÎ˜8 '‘\ˆÙYÙ[œİ[™[šİ[ÛšY\KˆÙ\ˆZˆ™[]]\İZ[™H[™\™Hœ˜YÙK¸ '™Z]˜8 '‘YHZ™Z]İ[[]ˆYHÙ\ØÚXÚ[ˆ\[HØZœØÚZ[›XÚšXÚ¸ 'YÛÎ˜8 '‘Z[™Hİ]HYYH\šÙ[›X[ˆ]XÚ\˜[‹\ÜÈ[™\™HÚYHÙ\›ˆ°ïˆZ™H[[‹¸ 'VÚVÊŠİ›JJJIZK›[™İWOÏØ8 '’XÚX™HÙ[YÈÙ\ÙZ[‹[H›ÜœÚXÚYÈH[ÛÜ[‹¸ 'Ü™]\›ˆOÜOOXX\ŞXØ	ÛßHYH[ÛÜÛÛ[]˜XÚZ[™\ˆ]Y™°éYÈ[™Ù[ˆ]\ÙK˜œOOX^\ÛÎ˜	ÛßHZ[ˆ]Z[Ú\™\œİ]Yˆ˜XÚœ˜YÙHÛÜœšYÚY\˜›ßY[˜İ[ÛˆÛJK‹Š^Û]OYÛVİOÏÖ×KOJÛVÙWOÏÖ×JK™š[\ŠOOšKš[˜ÛY\ÊJJK›[™İÏJ‹œÙXÜ™]˜\ÚÙYË–Û—OÏÖ×JKš[˜ÛY\ÊJKÏ]›J	Ù_N‰ÛŸN‰İX
IMNÜ™]\›ˆJŒÊÊÏÌŒ
JÜßY[˜İ[ÛˆÛJK
^Û]YKÙYZÙ[™\˜ÏËœÙXÜ™]Z[[Û˜Z\™NÚYŠ[Š\™]\›Û]YØİ[Y[œ]Y\TÙ[XİÜŠİÙYZÙ[™X\˜ËXÛÛ[
NÚYŠ\Š\™]\›ÚYŠ[‹œİ\Y
^ÚYŠ\‹œ]Y\TÙ[XİÜŠ™\\ÙXÜ™]YY™šXİ[X
J^Û]OYØİ[Y[˜Ü™X]Q[[Y[
ÙXİ[Û˜
NÙK˜Û\ÜÓ˜[YOX\\[™[\\ÙXÜ™]YY™šXİ[XKš[›™\’SXÏ‘YZİ[ÛœÛš]™X]OÚÏ™\İ[[][ÙZ\Ü]X[]0é™Yœ˜Yİ[™ÜÛ[Z][™š]˜[[™XÚËˆ\ˆ[Ù\ÈØ[›ˆš\È\ˆ›Û[™\Z[[™ÈÙpé™\Ù\™[‹Ü]ˆÛ\ÜÏH™\XÚÚXÙK\›İÈ‰ÖØX\ŞXİ[™\™^\K›X\
OO˜]Ûˆ]KY\\ÙXÜ™]YY™šXİ[OH‰Ù_HˆÛ\ÜÏH‰İœÙXÜ™]™Y™šXİ[OOOYOØÙ[XİY˜Hİ›Û™Ï‰ÔJJ_OÜİ›Û™ÏÛX[‰ÙOOOXX\ŞXØˆÛ\™HÜ\™[ˆ0­Èš]˜[[Ù\ø $Í™OOOX^\ØH™Yœ˜Yİ[™È0­ÈÙ\°ïÚH0­Èš]˜[[Ù\ÊØ˜ˆ™Yœ˜Yİ[™Ù[ˆ0­ÈÙ[Z\ØÚHÜ\™[˜OÜÛX[Ø]Û˜
Kš›Ú[Š
_OÙ]˜‹œ]Y\TÙ[XİÜŠÙ]KX\˜ËXXİ[ÛHœİ\\ÙXÜ™]—X
OË˜™Y›Ü™JJ_\™]\›ŸZYŠ‹˜ÛÛ\]Y
^ÒÛJ‹ŠNÜ™]\›Ÿ[]OSX]›X^
K[X™\Š‹œ›İ[™ÏÌJJKO]œÙXÜ™]œ›ÛR\İÜVÚWOÏÛ‹›Z[[Û˜Z\™RYÏ\‹œ]Y\TÙ[XİÜŠœÙXÜ™][ØœÙ\˜][ÛœØ
NÛÉ‰ŠËš[›™\’SX›JÛZ[[Û˜Z\™RY˜K›İ[™šKÙYY“[X™\ŠKÙYZÙ[™ØÛÜ™OÏÌ
JÓ[X™\ŠKÙYZÙ[™\˜ÏË›šYÚ›Ú\ÙOÏÌ
KY™šXİ[NœÙXÜ™]™Y™šXİ[_JK›X\

K
OO˜İ›Û™Ï”Ü\ˆ	İ
Ì_OÜİ›Û™Ïˆ	Ú›JJ_OÜ˜
Kš›Ú[Š
KË˜Û\ÜÓ\İ˜Y
\XÛY\Ë\™XYX
JNÛ]ÏVË‹‹œ‹œ]Y\TÙ[XİÜ[
œÙXÜ™]XØ[™Y]X
WK›X\
OOÛ]YKœ]Y\TÙ[XİÜŠÙ]K\ÙXÜ™]XXØİ\ÙWX
OË™Ù]]šX]J]K\ÙXÜ™]XXØİ\ÙX
OÏØÏYKœ]Y\TÙ[XİÜŠ
NÜ™]\›ˆÉ‰œ‰‰ŠË^ÛÛ[J‹œ]Y\İ[Û™YÏÖ×JKš[˜ÛY\Ê	Ú_N‰ÜŸX
OÕ[J‹KKœÙXÜ™]™Y™šXİ[JN˜›ØÚÙZ[™H™[\İ˜\™H]\ÜØYÙH[ˆY\Ù\ˆ[™K˜Ë˜Û\ÜÓ\İ˜Y
\\™\ÜÛœÙK\™XYX
JKœÙXÜ™]™Y™šXİ[OOOX^\ÙK˜Û\ÜÓ\İ˜Y
\Y^\XØ\™
N™K˜Û\ÜÓ\İœ™[[İ™J\Y^\XØ\™
KÚYœ‹ØÛÜ™N•ÛJ‹KK
__JK™š[\ŠOO™KšY
NİœÙXÜ™]™Y™šXİ[OOOX^\	‰Š‹œ]Y\İ[Û™YÏÖ×JK™š[\ŠOO™Kœİ\ÕÚ]
	Ú_N˜
JK›[™İLI‰œ‹œ]Y\TÙ[XİÜ[
Ù]K\ÙXÜ™]\]Y\İ[Û—X
K™›Ü‘XXÚ
OOÙK™\ØX›YHLJNÛ]Ï\‹œ]Y\TÙ[XİÜŠ™\XØ\ÙKYš[X
NÚYŠß
ÏYØİ[Y[˜Ü™X]Q[[Y[
ÙXİ[Û˜
KË˜Û\ÜÓ˜[YOX\\[™[\XØ\ÙKYš[X‹œ]Y\TÙ[XİÜŠœÙXÜ™]\›Üİ\˜
OË˜™Y›Ü™JÊJKÊ^Û]O\ËœÛÜ

K
OOœØÛÜ™KYKœØÛÜ™JKœÛXÙJœÙXÜ™]™Y™šXİ[OOOX^\ÍŠNØËš[›™\’SXÏ‘\›Z][™ÜØZİH0­È[™H	Ú_KÍÚÏ’™YH[™H™\Ú]Z[ˆ™]Y\ÈÙZZ[Y\ÈX[™]ˆ™\ØÚ[YİHØÚZY[ˆ]\È[HÙ]Ú[›œÛÛ]\ÎÈ[šİH[™›Û[ˆÙ\™[ˆ\œİ[H[™H›Ûİ0é™YÈÙ™™[™Ù[YİÜ‰İœÙXÜ™]™Y™šXİ[OOOX^\Ø]ˆÛ\ÜÏH™\\™YXİY”˜[™Ù›ÛÙHZ[ÙZ\ÙHÙ\ØÚğéˆ]™H]\ÜØYÙ[ˆ[™]\ÜØÚ\ÜÛÙÚZËÙ]˜˜]ˆÛ\ÜÏH™\\İ\ÜXÚ[Û‹[\İ‰ÙK›X\

K
OO˜Ü[‰İ
Ì_Kˆ	Ú›J[JKšY
J_OØO‰ÙKœØÛÜ™ONØ]Y™°éYØ™KœØÛÜ™OMOØ[šÛ\˜˜ØÚØXÚ™[\İ]OÚOÜÜ[˜
Kš›Ú[Š
_OÙ]˜X_Y[˜İ[ÛˆÛJKŠ^ÚYŠKœ]Y\TÙ[XİÜŠ™\\›ÛKZ\İÜX
J\™]\›Û]SØš™Xİ™[šY\ÊœÙXÜ™]œ›ÛR\İÜOÏŞßJKœÛÜ

K
OO“[X™\ŠVÌJKS[X™\ŠÌJJKOYØİ[Y[˜Ü™X]Q[[Y[
ÙXİ[Û˜
NÚK˜Û\ÜÓ˜[YOX\\[™[\\›ÛKZ\İÜXKš[›™\’SXÏ•šY\ˆÙZZ[YHX[™]OÚÏ’™YH[™H]HZ[™H™]YH›ÛKˆY\˜Ú›ZX™[ˆ[HšY\ˆ™\ØÚ[Yİ[™Ù[ˆ[šİ™[]˜[[™YH]\ÜØÚZY[™ÜÜ™YÙ[[šİ[ÛšY\Ú™HÙÚ\ØÚ[ˆİ[İ[™Ü]ˆÛ\ÜÏH™\\›ÛKYÜšY‰Ü‹›X\

ÙKJOO˜Ü[ÛX[”[™H	Ù_OÜÛX[İ›Û™Ï‰Ú›J[J
J_OÜİ›Û™ÏÜÜ[˜
Kš›Ú[Š
_OÙ]İ›Û™Ï‘\›Z][™ÜİÙ\[™ÎÜİ›Û™Ïˆ	Ó[X™\ŠœÙXÜ™]š[™\İYØ]Ü”ØÛÜ™OÏÌ
_H0­Èš]˜[[Ù\ˆ	Ó[X™\Š‹œš]˜[ØÛÜ™OÏÌ
_OÜ˜Kœ]Y\TÙ[XİÜŠœÙXÜ™]\™\İ[[\İ
OË˜™Y›Ü™JJ_Y[˜İ[Ûˆ[JK
^ÚYŠKœ]Y\İİYÙHOOXœšY^K[Û[\XY
\™]\›Û]YØİ[Y[œ]Y\TÙ[XİÜŠİÙYZÙ[™X\˜ËXÛÛ[
NÚYŠ[Ÿ‹œ]Y\TÙ[XİÜŠ™\[Û[\XY\İ˜]YŞX
J\™]\›Û]S[JJNÚYŠ\Š\™]\›Û]O]›Û[\XYœİ˜]YÚY\ÖÜ—OÏØ˜[[˜ÙYOYØİ[Y[˜Ü™X]Q[[Y[
ÙXİ[Û˜
NØK˜Û\ÜÓ˜[YOX\\[™[\[Û[\XY\İ˜]YŞXKš[›™\’SXÏ•ZİZÈ°ïˆ	Ú›JÙ›\İ\˜›\İ\™Y\”Û™Î˜™Y\ˆÛ™Ø›[šŞX˜[˜›[šŞX˜[VÜ—OÏÜŠ_OÚÏ‘YHZ[š\ÜY[™YÙ[ˆ›ZX™[ˆ[™\°é™\ˆZ[™HZİZÈ™\°é™\™YØÚ\›pï[™ËÜ\[\Ø[[Y[š[[™[ˆÜ0é\™[ˆ˜XÚ0é›KÜ]ˆÛ\ÜÏH™\XÚÚXÙK\›İÈ‰ÖÖØØY™XÛÛ›ÛY\Ù[šYÙ\ˆ0é›H[™\›pï[™ØKØX[XX[Y›Úİ\ØYZˆ\Ø[[Y[š[[™›Ü˜™\™Z][™ØKØš\ÚØ›Û\Èš\ÚZÛØYZˆ›Ü›KX™\ˆ0íš\™H›ÛÙZÛÜİ[˜WK›X\

ÙK—JOO˜]Ûˆ]KY\\İ˜]YŞOH‰Ù_Hˆ]KY\Y\ØÚ\[™OH‰ÜŸHˆÛ\ÜÏH‰ÚOOOYOØÙ[XİY˜Hİ›Û™Ï‰İOÜİ›Û™ÏÛX[‰ÛŸOÜÛX[Ø]Û˜
Kš›Ú[Š
_OÙ]˜‹œ]Y\TÙ[XİÜŠÙ]KX\˜ËXXİ[ÛHœİ\[™^[Û[\XY—X
OË˜™Y›Ü™JJ_Y[˜İ[Ûˆ›JKŠ^ÚYŠKœ]Y\İİYÙHOOXØ]\™^KYX˜]XœØ]\™^K˜\YY
\™]\›Û]YØİ[Y[œ]Y\TÙ[XİÜŠİÙYZÙ[™X\˜ËXÛÛ[
NÚYŠ\Ÿ‹œ]Y\TÙ[XİÜŠ™\\Ø]\™^K\™\
J\™]\›Û]OYØİ[Y[˜Ü™X]Q[[Y[
ÙXİ[Û˜
NÚK˜Û\ÜÓ˜[YOX\\[™[\\Ø]\™^K\™\Kš[›™\’SXÏ‘Z[™H›Ü˜™\™Z][™È›Üˆ\ˆ\Úİ\ÜÚ[ÛÚÏ‘HØ[›œİÙ[˜]HZ[™[ˆŞ\İ[Z\ØÚ[ˆ›ÜZ[]™[‹ˆ\ˆ™\°é™\XÚHX˜][Ù\H[™[Z][ˆ[œØÚYpçÙ[™[ˆ˜]\İØ[\‹Ü]ˆÛ\ÜÏH™\XÚÚXÙK\›İÈ\\™\YÜšY‚ˆ]Ûˆ]KY\\Ø]\™^OH™]šY[˜ÙHİ›Û™Ï™]ÙZ\ÚÙ]HÜ™™[Üİ›Û™ÏÛX[¸¢$ŒMXÚÈZ][›H[™™[^ÛÛœİ8¢$ÜÛX[Ø]Û‚ˆ]Ûˆ]KY\\Ø]\™^OHœ˜[Hİ›Û™Ï‘Ü\HZ[Z[[Üİ›Û™ÏÛX[›YZˆX›Zİ[H\˜Ú\Ø[[Y[š[	Û‹˜ÛÚ\Ú[ÛŸKÌLÜÛX[Ø]Û‚ˆ]Ûˆ]KY\\Ø]\™^OHœ™XÛİ™\ˆİ›Û™Ï’Ø]\›X[˜YÙ[Y[Üİ›Û™ÏÛX[ŠÌLˆX\ÛTİ[[][™È[™8¢$HXÚÏÜÛX[Ø]Û‚ˆ]Ûˆ]KY\\Ø]\™^OH˜›Y™ˆİ›Û™Ï“Ù™™[œÚ]™\ˆ›Y™Üİ›Û™ÏÛX[œİ\šËX™\ˆ
Íˆ˜XÚ0é›H[ÈÙYÙ[˜™]ÙZ\ÏÜÛX[Ø]Û‚ˆÙ]˜‹œ]Y\TÙ[XİÜŠ™X˜]K\İYÙX
OË˜™Y›Ü™JJ_Y[˜İ[Ûˆ[JKŠ^Û]YØİ[Y[œ]Y\TÙ[XİÜŠØØ[\ZYÛ‹XÛÙ^
NÚYŠ\Ÿ‹šY[Š\™]\›Û]O\‹œ]Y\TÙ[XİÜŠ˜ÛÙ^Y[K[\İ
NÚYŠZ_Kœ]Y\TÙ[XİÜŠÙ]KY\XÛÙ^Y[WX
J\™]\›Û]OYØİ[Y[˜Ü™X]Q[[Y[
]Û˜
NØK\OX]Û˜KœÙ]]šX]J]KY\XÛÙ^Y[XŞ\İ[\Ø
KK˜Û\ÜÓ˜[YOX\XÛÙ^Y[XKš[›™\’SXÜ[“PR“ÔˆTUOÜÜ[İ›Û™Ï”ÜY[YY™H	ˆÙXÚÙ[Ú\šİ[™Ù[Üİ›Û™ÏÛX[‘›Ü›K\œØÚ0íœ[™Ë›Ü˜™\™Z][™È[™YZİ[ÛÜÛX[˜K˜Y]™[\İ[™\ŠÛXÚØ

OO–JKŠJKKœ™\[™
J_Y[˜İ[ÛˆJKŠ^Û]YØİ[Y[œ]Y\TÙ[XİÜŠØÛÙ^Y]Z[
NÚYŠ\Š\™]\›Û]O\K›X\
OO˜‰Ú›JÙ›\İ\˜›\İ\™Y\”Û™Î˜™Y\ˆÛ™Ø›[šŞX˜[˜›[šŞX˜[VÙWJ_Oİ‰Ú›J›J›Û[\XYœİ˜]YÚY\ÖÙWJJ_Oİİ˜
Kš›Ú[Š
NÜ‹š[›™\’SX\XÛHÛ\ÜÏH˜ÛÙ^\YÙH\XÛÙ^\YÙHXY\ˆÛ\ÜÏH˜ÛÙ^\YÙKZXYÜ[‘ĞSQTVHTTUHŒÜÜ[”Ş\İ[Z\ØÚHÛØÚ[™[™[˜[ZZÏÚ‘\È\]H™\˜š[™]›Üš[™[™HYXÚ[šZÙ[ˆİ0éšÙ\ˆZ]Z[˜[™\‹Ú™HZ[š\ÜY[KÜY[İ0é™HÙ\ˆ]Y\İX™›ÛÙHH\œÙ]™[‹ÜÚXY\‚ˆ]ˆÛ\ÜÏH˜ÛÙ^\İ]YÜšY]ÛX[–\Ø[[Y[š[ÜÛX[İ›Û™Ï‰Û‹˜ÛÚ\Ú[ÛŸOÜİ›Û™ÏÙ]]ÛX[‘\œØÚ0íœ[™ÏÜÛX[İ›Û™Ï‰Û‹™˜]YİY_OÜİ›Û™ÏÙ]]ÛX[]]Üš]0éÙXÚÏÜÛX[İ›Û™Ï‰Û‹˜]]Üš]RX]OÜİ›Û™ÏÙ]]ÛX[•›Ü˜™\™Z][™ÏÜÛX[İ›Û™Ï‰Û‹œ™\\˜][ÛŸOÜİ›Û™ÏÙ]Ù]‚ˆÙXİ[ÛˆÛ\ÜÏH˜ÛÙ^\ÙXİ[ÛˆÏ“Û[\XY\İ˜]YÚY[ÚÏ]ˆÛ\ÜÏH˜ÛÙ^]X›K]Ü˜\X›OXY‘\Şš\[İ•ZİZÏİİİXY›ÙO‰Ú_Oİ›ÙOİX›OÙ]’ÛÛ›ÛY\Ù[šİ›ÛÙZÛÜİ[‹X[Y›Úİ\Èİ0éšİ\Ø[[Y[š[[™›Ü˜™\™Z][™Ë›Û\Èš\ÚZÛÈ\š0íš›Ü›H[™˜XÚ0é›KˆYH\œÜ°ï™ÛXÚHZ[š\ÜY[Ù\[™È›ZXXpçÙÙX›XÚÜÜÙXİ[Û‚ˆÙXİ[ÛˆÛ\ÜÏH˜ÛÙ^\ÙXİ[ÛˆÏ”Ø[\İYÜİ›Ü˜™\™Z][™ÏÚÏ‰İœØ]\™^K˜\YYØÙ]ğéˆ	Ú›JœØ]\™^Kœ™\\˜][ÛÚÚXÙJ_KˆYHÙ\Hİ\™[ˆ]Y\šY[ˆ[ˆØ[\YÛ™[œİ[™0ï™\››Û[Y[‹˜˜›Üˆ\ˆ][ˆ\Úİ\ÜÚ[ÛˆİZÙ[˜]HZ[™H›Ü˜™\™Z][™È\ˆ™\™°ïİ[™ËˆÚYH™\°é™\X˜][™XÚËX›Zİ[HÙ\ˆX\ÛÈØ[\™›Ü›K˜OÜÜÙXİ[Û‚ˆÙXİ[ÛˆÛ\ÜÏH˜ÛÙ^\ÙXİ[ÛˆÏ”ÙXÜ™]Z[[Û°éÚÏ•šY\ˆÙZZ[YHX[™]H0íœÙ[ˆ[ˆš\Ú\šYÙ[ˆÙÚ\ØÚ[ˆİ[İ[™ˆ˜XÚ™Y\ˆ™\ØÚ[Yİ[™ÈÚ\™Z[™H™]YH›ÛH[\ˆ[ˆ™\˜›ZX™[™[ˆ\œÛÛ™[ˆ™\Z[ˆ[ÙZ\ÙHÚ[™Y\šÛX[Ø˜\ÚY\[[[ˆÙ\°ïÚH[™™[›™[ˆYH0íœİ[™ÈšXÚ\™ZİÜ”ØÚÚY\šYÚÙZ]ˆİ›Û™Ï‰Ú›JJœÙXÜ™]™Y™šXİ[JJ_OÜİ›Û™Ïˆ0­È\›Z][™ÜİÙ\[™Îˆİ›Û™Ï‰Ó[X™\ŠœÙXÜ™]š[™\İYØ]Ü”ØÛÜ™OÏÌ
_OÜİ›Û™ÏÜÜÙXİ[Û‚ˆÙXİ[ÛˆÛ\ÜÏH˜ÛÙ^\ÙXİ[ÛˆÏ’ÛÛ\]Xš[]0éÚÏ[H\Ø]™][ˆYYÙ[ˆ[ˆZ[™[HÙ]™[›[‹™\œÚ[ÛšY\[ˆÜZXÚ\‹ˆÙ\›œÜY[İ0é™HÙ\™[ˆ\ˆ[ˆÙZHÛ\™[ˆ0ç™\™ğé™Ù[ˆ\ÙZ]\ˆ\ˆÛ[\XYKS˜XÚ0é›H[™YHZ[›X[YÙHØ[\İYÜİ›Ü˜™\™Z][™ËÜÜÙXİ[ÛØ\XÛO˜Y[˜İ[Ûˆ›J
^Û]OYØİ[Y[œ]Y\TÙ[XİÜŠØØ[\ZYÛ‹YØ[YHÜ˜\ˆ˜]˜
NÚYŠY_Kœ]Y\TÙ[XİÜŠÛÜ[‹Y\Y\™XİÜ˜
J\™]\›Û]YØİ[Y[˜Ü™X]Q[[Y[
]Û˜
NİšYXÜ[‹Y\Y\™XİÜ˜\OX]Û˜š[›™\’SXÜ[”İ˜]YÚYOÜÜ[•ŒØ˜˜Y]™[\İ[™\ŠÛXÚØ	JKK˜\[™

_Y[˜İ[Ûˆ[J
^ÚYŠØİ[Y[œ]Y\TÙ[XİÜŠÙ\Y\™XİÜ‹[[Ù[
J\™]\›Û]OYØİ[Y[˜Ü™X]Q[[Y[
ÙXİ[Û˜
NÙKšYX\Y\™XİÜ‹[[Ù[K˜Û\ÜÓ˜[YOX[Ù[\Y\™XİÜ‹[[Ù[KšY[HLKš[›™\’SX\XÛHÛ\ÜÏH™\Y\™XİÜ‹]Ú[™İÈ]ÛˆYH™\Y\™XİÜ‹XÛÜÙHˆÛ\ÜÏH›[Ù[^ˆ\OH˜]Ûˆˆ\šXK[X™[H”ØÚYpçÙ[ˆ°åÏØ]Û]ˆYH™\Y\™XİÜ‹XÛÛ[Ù]Ø\XÛO˜Øİ[Y[œ]Y\TÙ[XİÜŠØ\
OË˜\[™
JKKœ]Y\TÙ[XİÜŠÙ\Y\™XİÜ‹XÛÜÙX
OË˜Y]™[\İ[™\ŠÛXÚØZ
KK˜Y]™[\İ[™\ŠÛXÚØOİ\™Ù]OOYI‰™Z

_J_Y[˜İ[Ûˆ	J
^Û]OYØİ[Y[œ]Y\TÙ[XİÜŠÙ\Y\™XİÜ‹[[Ù[
NÙI‰ŠKšY[HLKØİ[Y[˜›ÙK˜Û\ÜÓ\İ˜Y
Ø[\ZYÛ‹[[Ù[[Ü[˜\Y\™XİÜ‹[Ü[˜
K

J_Y[˜İ[ÛˆZ

^Û]OYØİ[Y[œ]Y\TÙ[XİÜŠÙ\Y\™XİÜ‹[[Ù[
NÙI‰ŠKšY[HL
KØİ[Y[˜›ÙK˜Û\ÜÓ\İœ™[[İ™J\Y\™XİÜ‹[Ü[˜
KØİ[Y[œ]Y\TÙ[XİÜŠ›[Ù[››İ
ÚY[—JX
_Øİ[Y[˜›ÙK˜Û\ÜÓ\İœ™[[İ™JØ[\ZYÛ‹[[Ù[[Ü[˜
_Y[˜İ[Ûˆ

^Û]OQJ
KUJ
K^JKÛJ
K
KYØİ[Y[œ]Y\TÙ[XİÜŠÙ\Y\™XİÜ‹XÛÛ[
NÜ‰‰Š‹š[›™\’SXXY\Ü[‘ĞSQTVHTTUHŒÜÜ[•ÛØÚ[™[™Q\™ZİÜÚ‘Y\ÙHÙ\H[İZ[ˆ]\È™^šYZ[™Ù[‹X[Kğíœœ\\İ0é™[‹Û[\XY\İ˜]YÚY[‹˜XÚ0é›H[™™]ÙZ\Ù[‹ÜÚXY\]ˆÛ\ÜÏH™\Y\™XİÜ‹YÜšY‰ÖÖØ\Ø[[Y[š[‹˜ÛÚ\Ú[Û‹İ0éšİÜ\[˜Zİ[Û™[ˆ[™X›Zİ[XKØ\œØÚ0íœ[™Ø‹™˜]YİYKÚHÙ\H™\œØÚXÚ\›ˆÚXÚ\™HÜ[Û™[˜KØ]]Üš]0éÙXÚØ‹˜]]Üš]RX]0é›K™\™XÚ[™š\ÚØ[H[ØÚZY[™Ù[˜KØ›Ü˜™\™Z][™Ø‹œ™\\˜][Û‹™]YÙ[‹X[Y›Úİ\È[™™\]][Û˜KØ[Ü˜[‹›[Ü˜[K›ÜØÚš]ÚYYÙH[™[ÛY[[XWK›X\

ÙK—JOO˜\XÛO]ÛX[‰Ù_OÜÛX[İ›Û™Ï‰İKÌLÜİ›Û™ÏÙ]Oˆİ[OHÚY‰İIHØÚO‰ÛŸOÜØ\XÛO˜
Kš›Ú[Š
_OÙ]ÙXİ[ÛˆÛ\ÜÏH™\Z\İÜHÏ“]HÙXÚÙ[Ú\šİ[™Ù[ÚÏ‰Êš\İÜOÏÖ×JKœÛXÙJMŠKœ™]™\œÙJ
K›X\
OO˜‰Ú›JK^
_OÜ˜
Kš›Ú[Š
_“›ØÚÙZ[™H\]KQ[ØÚZY[™È›İÚÛÛY\Ü˜OÜÙXİ[Û˜
_Y[˜İ[Ûˆš

^Û]OQJ
NÚYŠY_SØš™XİšÙ^\ÊJK›[™İ
\™]\›Û]UJ
K^JKÛJ
K
NÚYŠ›J
K[J
K[JK
K›JKŠK›JJJ^ÚYŠ›JK
I‰ˆYKÙYZÙ[™\˜ÏËœÙXÜ™]Z[[Û˜Z\™OË˜ÛÛ\]Y
^ÚZ

NÜ™]\›ŸQÛJJ
KJ
J_V[JKŠKØİ[Y[œ]Y\TÙ[XİÜŠÙ\Y\™XİÜ‹[[Ù[
OËšY[Ÿ

_]˜\ˆšHLNÙ[˜İ[ÛˆZ

^Üš
šHL™\]Y\İ[š[X][Û‘œ˜[YJ

OOÜšHLKš

_JJ_]˜\ˆZHLNÙ[˜İ[ÛˆÚ

^ØZ
ZHLÚ[™İËœÙ][Y[İ]


OO›ØØ][Û‹œ™[ØY

KŒ
J_Y[˜İ[ÛˆÚ
J^Û]YØİ[Y[œ]Y\TÙ[XİÜŠÙ\]Œ‹]Ø\İ
Nİ
YØİ[Y[˜Ü™X]Q[[Y[
]˜
KšYX\]Œ‹]Ø\İØİ[Y[˜›ÙK˜\[™

JK^ÛÛ[YK˜Û\ÜÓ\İ˜Y
ÚİØ
KÚ[™İËœÙ][Y[İ]


OOË˜Û\ÜÓ\İœ™[[İ™JÚİØ
KŒŒ
_Y[˜İ[ÛˆÚ

^İÚ[™İË˜Y]™[\İ[™\ŠËXØ[\ZYÛ‹[Z[šYØ[YK[İ]ÛÛYXJKØİ[Y[˜Y]™[\İ[™\ŠÛXÚØOOÛ]YK\™Ù][œİ[˜Ù[Ùˆ[[Y[ÙK\™Ù]˜ÛÜÙ\İ
]Û˜
N›[ÚYŠ]
\™]\›Û]]™Ù]]šX]J]KY\\İ˜]YŞX
NÚYŠŠ^Û]OUJ
K]™Ù]]šX]J]KY\Y\ØÚ\[™X
NÜ‰‰ŠK›Û[\XYœİ˜]YÚY\ÖÜ—O[ŠK[JK	ÜŸNˆZİZÈ	Ó›JŠ_HÙ]ğé˜
K[JJKœ\™[[[Y[Ëœ]Y\TÙ[XİÜ[
]Û˜
K™›Ü‘XXÚ
OO™K˜Û\ÜÓ\İÙÙÛJÙ[XİYOOO]
JKZ

NÜ™]\›Ÿ[]]™Ù]]šX]J]KY\\ÙXÜ™]YY™šXİ[X
NÚYŠŠ^Û]OUJ
NÙKœÙXÜ™]™Y™šXİ[O\‹KœÙXÜ™]œš]˜[Y\İYHLK[JJKœ\™[[[Y[Ëœ]Y\TÙ[XİÜ[
]Û˜
K™›Ü‘XXÚ
OO™K˜Û\ÜÓ\İÙÙÛJÙ[XİYOOO]
JKZ

NÜ™]\›Ÿ[]O]™Ù]]šX]J]KY\\Ø]\™^X
NÚYŠJ^Ş›JJNÜ™]\›Ÿ]™Ù]]šX]J]KX\˜ËXXİ[Û˜
OËœİ\ÕÚ]
Y\œ\KX
I‰Ú[™İËœÙ][Y[İ]
›KMŒ
NÛ]O]™Ù]]šX]J]K\ÙXÜ™]\]Y\İ[Û˜
NÚYŠJ^Û]OQJ
KSX]›X^
K[X™\ŠKÙYZÙ[™\˜ÏËœÙXÜ™]Z[[Û˜Z\™OËœ›İ[™ÏÌJJKUJ
K[™]ÈÙ]
‹œÙXÜ™]˜\ÚÙYİOÏÖ×JNÜ‹˜Y
JK‹œÙXÜ™]˜\ÚÙYİOVË‹‹œ—K[JŠKÚ[™İËœÙ][Y[İ]
Z
_[]Ï]™Ù]]šX]J]K\ÙXÜ™]XXØİ\ÙX
NÚYŠÊ^Û]OQJ
KÙYZÙ[™\˜ÏËœÙXÜ™]Z[[Û˜Z\™NÚYŠY_K˜ÛÛ\]Y
\™]\›Û]UJ
K^Ü›İ[™“[X™\ŠKœ›İ[™
Kİ\ÜXİY›Ë›ÛNœÙXÜ™]œ›ÛR\İÜVÙKœ›İ[™OÏÙK›Z[[Û˜Z\™RYNİœÙXÜ™]œ[™[™ĞXØİ\Ø][Û[‹[J
KÚ[™İËœÙ][Y[İ]


OO’JŠKM
__KL
_Y[˜İ[Ûˆ

^ÚYŠØİ[Y[œ]Y\TÙ[XİÜŠÙ\]\]K]Œ‹\İ[X
J\™]\›Û]OYØİ[Y[˜Ü™X]Q[[Y[
İ[X
NÙKšYX\]\]K]Œ‹\İ[XK^ÛÛ[Xˆ™\\[™[ÛX\™Ú[ŒMœÜY[™ÎŒMœØ›Ü™\Œ\ÛÛY™Ø˜JŒÍËNM‹LËŒÌŠNØ›Ü™\‹\˜Y]\ÎŒMØ˜XÚÙÜ›İ[™›[™X\‹YÜ˜YY[
MYYË™Ø˜JNKÎKMŠK™Ø˜JNKMŠJNØ›Ş\ÚYİÎŒMÌœ™Ø˜JŒ
_Bˆ™\\[™[ŞÛX\™Ú[ŒœØÛÛÜˆÙYÍYÙ›Û\Ú^™NŒMÛ]\‹\ÜXÚ[™Î‹ŒY[Nİ^]˜[œÙ›Ü›N\\˜Ø\Ù_K™\\[™[œÛX\™Ú[ŒLœØÛÛÜˆØÎYÛ[™KZZYÚŒK_Bˆ™\XÚÚXÙK\›İŞÙ\Ü^N™ÜšYÙÜšY][\]KXÛÛ[[œÎœ™\X]
ËZ[›X^
YœŠJNÙØ\K™\XÚÚXÙK\›İÈ]ÛÛZ[‹ZZYÚÌœÜY[™ÎŒL\Ø›Ü™\Œ\ÛÛY™Ø˜JMKMKMKŒLÊNØ›Ü™\‹\˜Y]\ÎŒLØ˜XÚÙÜ›İ[™ˆÌL˜ŒŒÎØÛÛÜˆÙ™™ŒXØNİ^X[YÛ›YK™\XÚÚXÙK\›İÈ]Ûšİ™\‹™\XÚÚXÙK\›İÈ]Û‹œÙ[XİYØ›Ü™\‹XÛÛÜˆÙYÍYØ˜XÚÙÜ›İ[™ˆÌXÍLÍİ˜[œÙ›Ü›N˜[œÛ]VJL\
_K™\XÚÚXÙK\›İÈİ›Û™Ë™\XÚÚXÙK\›İÈÛX[Ù\Ü^N˜›ØÚßK™\XÚÚXÙK\›İÈÛX[ÛX\™Ú[‹]Ü\ØÛÛÜˆØYÍÙ›Û\Ú^™NŒLÛ[™KZZYÚŒKŒÍ_Bˆ™\\™\YÜšYÙÜšY][\]KXÛÛ[[œÎœ™\X]
‹Z[›X^
YœŠJ_K™\XØ\ÙKYš[^ÜÜÚ][Ûœ™[]]™_K™\\İ\ÜXÚ[Û‹[\İÙ\Ü^N™ÜšYÙÜšY][\]KXÛÛ[[œÎœ™\X]
‹Z[›X^
YœŠJNÙØ\œK™\\İ\ÜXÚ[Û‹[\İÜ[Ù\Ü^N™›^Ú\İYKXÛÛ[œÜXÙKX™]ÙY[ÙØ\ÜY[™ÎLØ›Ü™\‹\˜Y]\ÎØ˜XÚÙÜ›İ[™œ™Ø˜JMKMKMKŒJ_K™\\İ\ÜXÚ[Û‹[\İ^ØÛÛÜˆØYÍÙ›Û\Ú^™NŒLÙ›Û\İ[N››Ü›X[K™\\™YXİYÜY[™ÎŒLœØ˜XÚÙÜ›İ[™œ™\X][™Ë[[™X\‹YÜ˜YY[
LÍYYËÌLNLM‹ÌLNLMˆÌMÌŒÌYˆÌMÌŒÌYˆMœ
NØÛÛÜˆØYÍØ›Ü™\‹\˜Y]\ÎBˆ™\]Œ‹XXİ]™HœÙXÜ™][ØœÙ\˜][ÛœÎ››İ
™\XÛY\Ë\™XYJ^İš\ÚXš[]NšY[ŸK™\]Œ‹XXİ]™HœÙXÜ™]XØ[™Y]H››İ
™\\™\ÜÛœÙK\™XYJ^İš\ÚXš[]NšY[ŸK™\Y^\XØ\™XY\ˆÜ[Ùš[\˜›\Š
NÛÜXÚ]N‹Nİ\Ù\‹\Ù[Xİ››Û™_K™\\›ÛKYÜšYÙ\Ü^N™ÜšYÙÜšY][\]KXÛÛ[[œÎœ™\X]
YœŠNÙØ\K™\\›ÛKYÜšYÜ[ÜY[™ÎŒLØ›Ü™\‹\˜Y]\ÎØ˜XÚÙÜ›İ[™œ™Ø˜JMKMKMKŒŠ_K™\\›ÛKYÜšYÛX[™\\›ÛKYÜšYİ›Û™ŞÙ\Ü^N˜›ØÚßK™\\›ÛKYÜšYÛX[ØÛÛÜˆØYÍBˆÛÜ[‹Y\Y\™XİÜÙ\Ü^N™›^Ø[YÛ‹Z][\Î˜Ù[\ÙØ\\HÛÜ[‹Y\Y\™XİÜˆÜY[™ÎŒœ\Ø›Ü™\‹\˜Y]\Î\Ø˜XÚÙÜ›İ[™ˆÙYÍYØÛÛÜˆÌLŒYÙ›Û\Ú^™NK™\Y\™XİÜ‹[[Ù[Ş‹Z[™^ŒLÌK™\Y\™XİÜ‹]Ú[™İŞİÚY›Z[ŠÎØ[ÊLÈH
JNÛX^ZZYÚšÛİ™\™›İÎ˜]]ÎÛX\™Ú[š]]ÎÜY[™ÎŒØ›Ü™\Œ\ÛÛY™Ø˜JŒÍËNM‹LËŒ
NØ›Ü™\‹\˜Y]\ÎŒNØ˜XÚÙÜ›İ[™ˆÌŒŒXNØÛÛÜˆÙ™™ŒXØNÜÜÚ][Ûœ™[]]™_K™\Y\™XİÜ‹]Ú[™İÈXY\ˆÜ[ØÛÛÜˆÙYÍYÙ›Û\Ú^™NŒLÙ›Û]ÙZYÚLÛ]\‹\ÜXÚ[™Î‹ŒMY[_K™\Y\™XİÜ‹]Ú[™İÈÛX\™Ú[K™\Y\™XİÜ‹]Ú[™İÈXY\ˆØÛÛÜˆØYÍK™\Y\™XİÜ‹YÜšYÙ\Ü^N™ÜšYÙÜšY][\]KXÛÛ[[œÎœ™\X]
‹Z[›X^
YœŠJNÙØ\ŒLK™\Y\™XİÜ‹YÜšY\XÛ^ÜY[™ÎŒLÜØ›Ü™\‹\˜Y]\ÎŒLœØ˜XÚÙÜ›İ[™ˆÌLŒ™_K™\Y\™XİÜ‹YÜšY\XÛH]Ù\Ü^N™›^Ú\İYKXÛÛ[œÜXÙKX™]ÙY[ŸK™\Y\™XİÜ‹YÜšY\XÛH^Ù\Ü^N˜›ØÚÎÚZYÚÛX\™Ú[Ø›Ü™\‹\˜Y]\ÎN\Ø˜XÚÙÜ›İ[™ˆÌÌLÌÛİ™\™›İÎšY[ŸK™\Y\™XİÜ‹YÜšY\XÛHHÙ\Ü^N˜›ØÚÎÚZYÚŒL	NØ˜XÚÙÜ›İ[™›[™X\‹YÜ˜YY[
LYËÍÍXÍËÙYÍY
_K™\Y\™XİÜ‹YÜšY\XÛHÛX\™Ú[ŒØÛÛÜˆØYÍÙ›Û\Ú^™NŒL\K™\Z\İÜ^ÛX\™Ú[‹]ÜŒMœK™\Z\İÜHÛX\™Ú[\ÜY[™ÎLØ›Ü™\‹\˜Y]\ÎÜØ˜XÚÙÜ›İ[™œ™Ø˜JMKMKMKŒ
NØÛÛÜˆØÎYBˆ™\XÛÙ^Y[^Ù\Ü^N˜›ØÚÎİÚYŒL	NÜY[™ÎŒLœZ[\Ü[Ø›Ü™\Œ\ÛÛY™Ø˜JŒÍËNM‹LËŒÎ
HZ[\Ü[Ø˜XÚÙÜ›İ[™œ™Ø˜JŒÍËNM‹LËŒ
HZ[\Ü[İ^X[YÛ›YK™\XÛÙ^Y[HÜ[‹™\XÛÙ^Y[Hİ›Û™Ë™\XÛÙ^Y[HÛX[Ù\Ü^N˜›ØÚßK™\XÛÙ^Y[HÜ[ØÛÛÜˆÙYÍYÙ›Û\Ú^™NÙ›Û]ÙZYÚLÛ]\‹\ÜXÚ[™Î‹ŒL™[_K™\XÛÙ^Y[HÛX[ØÛÛÜˆØYÍÛX\™Ú[‹]ÜK™\XÛÙ^\YÙH˜ÛÙ^\ÙXİ[ÛÛX\™Ú[‹]ÜŒNBˆÙ\]Œ‹]Ø\İÜÜÚ][Û™š^YŞ‹Z[™^ŒŒÛYL	NØ›İÛNŒİ˜[œÙ›Ü›N˜[œÛ]JML	KŒ
NÛÜXÚ]NŒÜÚ[\‹Y]™[Î››Û™NÜY[™ÎŒLMØ›Ü™\Œ\ÛÛY™Ø˜JŒÍËNM‹LË
NØ›Ü™\‹\˜Y]\Î\Ø˜XÚÙÜ›İ[™ˆÌMŒLNØÛÛÜˆÙ™™ŒXØNİ˜[œÚ][Û‹ŒœßHÙ\]Œ‹]Ø\İœÚİŞÛÜXÚ]NŒNİ˜[œÙ›Ü›N˜[œÛ]JML	K
_BˆYYXJX^]ÚYÌŒ
^Ë™\XÚÚXÙK\›İË™\\™\YÜšY™\Y\™XİÜ‹YÜšYÙÜšY][\]KXÛÛ[[œÎŒYœŸK™\\İ\ÜXÚ[Û‹[\İÙÜšY][\]KXÛÛ[[œÎŒYœŸK™\\›ÛKYÜšYÙÜšY][\]KXÛÛ[[œÎœ™\X]
‹YœŠ_K™\Y\™XİÜ‹]Ú[™İŞÜY[™ÎŒNK™\\[™[ÜY[™ÎŒLÜK™\XÚÚXÙK\›İÈ]ÛÛZ[‹ZZYÚŒœ_BˆØİ[Y[šXY˜\[™
J_Y[˜İ[ÛˆZ

^ÙØİ[Y[™Øİ[Y[[[Y[˜Û\ÜÓ\İ˜Y
\]Œ‹XXİ]™X
K

KÚ

K™]È]]][Û“ØœÙ\™\ŠZ
K›ØœÙ\™JØİ[Y[™Øİ[Y[[[Y[ØÚ[\İˆLİX™YNˆL]šX]\ÎˆL]šX]Qš[\–ØY[˜Û\ÜØ_JKZ

KÚ[™İËœÙ][\˜[
ZLŒ
KÚ[™İË—×İ[\Ñ\\]UŒ^İ™\œÚ[Û›KÛÛ\]Q\™XİÜ”İ]NKZ[ÙXÜ™]ÛY\Î˜›KÚÛÜÙS™^Z[[Û˜Z\™N[KÛ˜\ÚİŠ
OOŠØÛÜ™N‘J
K\•J
K\™XİÜJJ
KÛJ
KJ
J_J__]\[ÙˆÚ[™İÏX	‰\[ÙˆØİ[Y[X	‰Z

Nİ˜\ˆX[\ËX›]YKXYšXK[ËXØ[\ZYÛ‹[Y]K]Œ˜šX[\ËX›]YKXYšXKYØ[Y\^KY\]Œ˜X[\ËX›]YKXYšXKY\]Œ‹\ÙXÜ™]\Ş[˜ØÙ[˜İ[ÛˆZ
J^İ^Û][ØØ[İÜ˜YÙK™Ù]][JJNÜ™]\›ˆÒ”ÓÓ‹œ\œÙJ
N›[XØ]ÚÜ™]\›ˆ[_Y[˜İ[Ûˆ
J^ÛØØ[İÜ˜YÙKœÙ]][Jš”ÓÓ‹œİš[™ÚYJJJ_Y[˜İ[ÛˆÚ
J^Ü™]\›İ™\œÚ[ÛŒ‹\]U™\œÚ[Û˜‹ŒŒÛ[\XYÜİ˜]YÚY\ÎßKİ]ÛÛY\Î–×K\İİ]ÛÛYN˜\İİ]ÛÛYP]Œ›Ú\ÙP\YYˆLK›Ú\ÙS[ÙYšY\ŒKØ]\™^NÜ™\\˜][ÛÚÚXÙN˜\YYˆL_KÙXÜ™]ÙY™šXİ[N™OËœÙXÜ™]Ë™Y™šXİ[OÏØİ[™\™›ÛR\İÜNßK\ÚÙYßK[™\İYØ]Ü”ØÛÜ™NŒš]˜[Y\İYˆLK[™[™ĞXØİ\Ø][Û›[K\İÜN–×__Y[˜İ[ÛˆÚ

^Û]O[Z

K[Z
š
NÚYŠY_]
\™]\›Û]YKÙYZÙ[™\˜ÏÏŞßK[‹›Û[\XYÏŞßKO[‹œØ]\™^OÏŞßKO[‹œÙXÜ™]Z[[Û˜Z\™OÏŞßKÏYKœ]Y\İİYÙOOOX\œš]˜[	‰ˆ\‹œİ\Y	‰ˆZKšYÙÙ\™Y	‰ˆXKœİ\YÏHHJ›Û[\XYË›İ]ÛÛY\ÏË›[™İ›Û[\XYË››Ú\ÙP\YYœØ]\™^OË˜\YYØš™XİšÙ^\ÊœÙXÜ™]Ëœ›ÛR\İÜOÏŞßJK›[™İš\İÜOË›[™İ
NÚYŠÉ‰œÊ^Ú
Ú

JKÙ\ÜÚ[Û”İÜ˜YÙKœ™[[İ™R][J
NÜ™]\›ŸZYŠKœ]Y\İİYÙOOOXØ]\™^KXÛÛ\Z[	‰ˆZK˜œ˜]ÛÛÛ‰‰ˆZK™X\›Q[™[™É‰œØ]\™^OË˜\YY	‰ŠœØ]\™^O^Ü™\\˜][ÛÚÚXÙN˜\YYˆL_Kš\İÜOVË‹‹š\İÜOÏÖ×KØ]›™]È]J
KÒTÓÔİš[™Ê
K^˜Ø[\İYÛ[Ü™Ù[‹PÚXÚÜÚ[\šØ[›ˆYHZ[›X[YÙH›Ü˜™\™Z][™È\İÚYY\ˆ™\™°ïØ˜\‹˜WKœÛXÙJM
K

JKJKœİ\Y	‰ˆXK˜ÛÛ\]Y	‰“[X™\ŠKœ›İ[™ÏÌ
OOOLI‰ŠK˜XØİ\Ø][ÛœÏË›[™İÏÌ
OOOL	‰œÙXÜ™]Ëœš]˜[Y\İY
J\™]\›Û]ÏX	ØK›Z[[Û˜Z\™RYN‰ØKœš]˜[ØÛÜ™_N‰İœÙXÜ™]Ë™Y™šXİ[OÏØİ[™\™XÜÙ\ÜÚ[Û”İÜ˜YÙK™Ù]][J
HOOXÉ‰ŠÙ\ÜÚ[Û”İÜ˜YÙKœÙ]][JÊK™]ÈT“ÙX\˜Ú\˜[\ÊØØ][Û‹œÙX\˜Ú
K™Ù]
›Ñ\™[ØY
HOOXX	‰Ú[™İËœÙ][Y[İ]


OO›ØØ][Û‹œ™[ØY

K
J_]\[ÙˆÚ[™İÏX	‰ŠÚ[™İËœÙ][Y[İ]
ÚŒ
KÚ[™İËœÙ][\˜[
ÚL
JNİ˜\ˆšXËŒŒZ[™]ÈÙ]
Ø[™™X^Y\˜X\Ûİ[™[X[XJKš^Ù›\İ\–Ø™[™X\œØ[›X™[^İ\ÚX[XK™Y\”Û™Î–Øİ\ÚX[XÜ™YÛÜ˜ØÚ[XX›Û›X™[^K›[šŞX˜[–Ø\œØ[›XÜ™YÛÜ˜X[›šX[XØÚX™\KYÙTYN–Øİ[™[X[X[›X™[^KX\ÛÛN–ØX\Û[™™X™[™X\œØ[›XÜ™YÛÜ˜_NÙ[˜İ[Ûˆ
OV×J^Û]V×K[™]ÈÙ]Ù›ÜŠ]ˆÙˆ\œ˜^Kš\Ğ\œ˜^JJOÙN–×J^Û]OTİš[™ÊÏØ
Kš[J
KÓØØ[SİÙ\Ø\ÙJX
NÈY_‹š\ÊJ_
‹˜Y
JKœ\Ú
JJ_\™]\›ˆY[˜İ[ÛˆÚ
OV×KN
^Ü™]\›ˆ
JK™š[\ŠOOˆ^Zš\ÊJJKœÛXÙJX]›X^
[X™\Š
_
J_Y[˜İ[ÛˆÚ
KV×KN
^Û]XšÙWOÏØš™›\İ\Ü™]\›ˆ
Ë‹‹‹‹œ—JK™š[\ŠOO™HOOXİ[™[X	‰™HOOX[X
KœÛXÙJX]›X^
‹[X™\ŠŠ_
J_Y[˜İ[ÛˆÚ
OX
^Û]Tİš[™ÊJKÓØØ[U\\Ø\ÙJX
NÜ™]\›‹ÓPTÓUS“‘ST‘‘RÕÑUÒS“Ÿ’Q‘•‘RQ_ÕS‹Ë\İ

OØÚY\˜‹Ğ“ĞÒßPÒÕS‘ßUTÑÑUÒPÒS‹Ë\İ

OØİX\™‹Õ’Q‘•PÒ’Q‘•PTÓ‘T“QT•’QQT“QÑKË\İ

OØ[šXØ‹ÔĞÒQßRÑSŸÓUĞÒTŸSSQ_ĞÒS_UË\İ

OØ]˜YXY[˜İ[Ûˆ
OLL
^Û]SX]œ›İ[™
ÊÓ[X™\Š
J‹ÊÓX]›X^
LLX]›Z[ŠŒ[X™\Š_
JJKÎ
NÜ™]\›ˆX]›X^
ËX]›Z[ŠMŠJ_Y[˜İ[ÛˆZ

^Ü™]\›–ŞÚY˜İ[™[X[™N˜\\˜\˜][ÛË[^N‹LKŒ‹\™Xİ[ÛŒKÛÛ™NŒNLKÚY˜[X[™N˜İÙ\˜\˜][ÛKŒK[^N‹M‹\™Xİ[Û‹LKÛÛ™NŒŒ_W_Y[˜İ[Ûˆ
J^Ü™]\›Ù›\İ\˜™[Ü™Z\ËP\™[˜X™Y\”Û™Î˜™\İÚY\Ù[‹U\ØÚ›[šŞX˜[˜İ˜[™S]Y˜˜Z˜YÙTYN˜]›İZ[Hİ[™[H	ˆ[XX\ÛÛN˜X\ÛÈØÚÛÛ[X[™ØVÙWOÏØØ[\[™ËSZ[š\ÜY[]˜\ˆÚX[\ËX›]YKXYšXK[ËXØ[\ZYÛ‹[Y]K]Œ˜Ú[™]ÈÙ]
Ø[™™X^Y\˜XJKZHLKšLÙ[˜İ[ÛˆZ

^İ^Û]O[ØØ[İÜ˜YÙK™Ù]][JÚ
NÜ™]\›ˆOÒ”ÓÓ‹œ\œÙJJNß_XØ]ÚÜ™]\›ß__Y[˜İ[Ûˆš
J^ÛØØ[İÜ˜YÙKœÙ]][JÚ”ÓÓ‹œİš[™ÚYJJJ_Y[˜İ[Ûˆ
J^Ü™]\›ˆÚš\ÊJOĞÛ•–ÙW_Y[˜İ[Ûˆš
J^Ü™]\›ˆÚš\ÊJOØ[™°êX”
JOË›˜[YOÏÔİš[™ÊJKœ™\XÙJ×‹‹ËOO™KÓØØ[U\\Ø\ÙJX
J_Y[˜İ[ÛˆZ
J^Ü™]\›ˆÚš\ÊJOØÔQSRUT˜”
JOËœ›ÛOÏØPSXY[˜İ[Ûˆ
K
^Û]S[X™\ŠJNÜ™]\›ˆ[X™\‹š\Ñš[š]JŠOØÉÓX]›X^
X]›Z[ŠMÍÍÌŒMKŠJKÔİš[™ÊMŠKœYİ\
‹
_XY[˜İ[Ûˆš
KXİ\ÜXYX
^Û]T
JOÏŞßKOYØİ[Y[˜Ü™X]Q[[Y[
]˜
NÜ™]\›ˆK˜Û\ÜÓ˜[YOXÜ˜\XÜË]ŒËXÚ\˜Xİ\ˆÜ˜\XÜË]ŒËIİHÜ˜\XÜË]ŒË\™XXİ[Û‹IÛŸXK™]\Ù]˜Ú\˜Xİ\YKK™]\Ù]œ™XXİ[Û[‹K™]\Ù]˜\šX[]KœÙ]]šX]J›ÛX[YØ
KKœÙ]]šX]J\šXK[X™[	Ñš
J_H8 $È	ÒZ
J_X
KKœİ[KœÙ]›Ü\JK]ŒË\Ú\
‹œÚ\Úš\ÊJOØÌ™™XX˜ÍÍ˜ÍX˜
JKKœİ[KœÙ]›Ü\JK]ŒË\Ú\\ÚYX
‹œÚ\ÚYKÌØØ
JKKœİ[KœÙ]›Ü\JK]ŒË]›İ\Ù\œØ
‹›İ\Ù\œËÌÌÍ˜
JKKœİ[KœÙ]›Ü\JK]ŒËXXØÙ[
‹˜XØÙ[ÙNX™L˜
JKKœİ[KœÙ]›Ü\JK]ŒËZZ\˜
‹šZ\‹ÌØL˜LŒ˜
JKKš[›™\’SXˆÜ[ˆÛ\ÜÏH™Ü˜\XÜË]ŒË\ÚYİÈÜÜ[‚ˆÜ[ˆÛ\ÜÏH™Ü˜\XÜË]ŒË[YÜÈOÚOOÚOÜÜ[‚ˆÜ[ˆÛ\ÜÏH™Ü˜\XÜË]ŒËX›ÙHHÛ\ÜÏH™Ü˜\XÜË]ŒËX\›HYÚOHÛ\ÜÏH™Ü˜\XÜË]ŒËX\›HšYÚÚOØÜÜ[‚ˆÜ[ˆÛ\ÜÏH™Ü˜\XÜË]ŒËZXYHÛ\ÜÏH™Ü˜\XÜË]ŒËZZ\ˆÚOˆÛ\ÜÏH™Ü˜\XÜË]ŒËY^YHYØˆÛ\ÜÏH™Ü˜\XÜË]ŒËY^YHšYÚØ[OÙ[OÜÜ[‚ˆÜ[ˆÛ\ÜÏH™Ü˜\XÜË]ŒËXXØÙ\ÜÛÜHÜÜ[˜_Y[˜İ[Ûˆš

^Û]OYØİ[Y[œ]Y\TÙ[XİÜŠ˜œ˜]ÛX\™[˜X
NÚYŠJH[œİ[˜Ù[ÙˆS[[Y[
J\™]\›ÙK˜Û\ÜÓ\İ˜Y
Ü˜\XÜË]ŒËXœ˜]Û
KK™]\Ù]™Ü˜\XÜÔ™[X\ÙO]šÛ]]Ú
Øİ[Y[œ]Y\TÙ[XİÜŠ˜\˜Ë[ÙÈ
OË^ÛÛ[ÏØ
NÙ›ÜŠ]Û‹—[Ù–ÖØ˜œ˜]ÛYšYÚ\‹œ^Y\˜[™™XKØ˜œ˜]ÛYšYÚ\‹›X\ÛX\ÛKØ˜œ˜]ÛYšYÚ\‹™İ[™[Xİ[™[XKØ˜œ˜]ÛYšYÚ\‹[X[XWJ^Û]OYKœ]Y\TÙ[XİÜŠŠKOZOËœ]Y\TÙ[XİÜŠšYİ\™X
NÚYŠJH[œİ[˜Ù[ÙˆS[[Y[
JXÛÛ[YNÛ]ÏZOË˜Û\ÜÓ\İ˜ÛÛZ[œÊİÛ˜
OØİÛ˜ÏXKœ]Y\TÙ[XİÜŠœØÛÜHˆ™Ü˜\XÜË]ŒËXÚ\˜Xİ\˜
NÊJÈ[œİ[˜Ù[ÙˆS[[Y[
_Ë™]\Ù]˜Ú\˜Xİ\ˆOO\ŸË™]\Ù]œ™XXİ[ÛˆOO[ÊI‰ŠK^ÛÛ[XK˜\[™
š
‹šYÚ\˜ÊJJKK™]\Ù]˜Ú\˜Xİ\\Ÿ[]SZ

KP\œ˜^Kš\Ğ\œ˜^J‹˜Xİ]™UX[JOÛ‹˜Xİ]™UX[N–×KOTÚ
ŠKOU
‹ÙYZÙ[™\˜ÏËœØ]\™^OË™X˜]PÜ›İÙ‹›[™İ
KÏX	ÚKš›Ú[Š
_N‰Ø_XÏYKœ]Y\TÙ[XİÜŠœØÛÜHˆ™Ü˜\XÜË]ŒËXœ˜]ÛX][ÜÜ\™X
NÜÈ[œİ[˜Ù[ÙˆS[[Y[
ÏYØİ[Y[˜Ü™X]Q[[Y[
]˜
KË˜Û\ÜÓ˜[YOXÜ˜\XÜË]ŒËXœ˜]ÛX][ÜÜ\™XKœ™\[™
ÊJKË™]\Ù]œÚYÛ˜]\™HOO[É‰ŠË™]\Ù]œÚYÛ˜]\™O[ËËš[›™\’SX]ˆÛ\ÜÏH™Ü˜\XÜË]ŒËYØ]HOÚOOÚO”ĞÒS’ÑOØÙ]]ˆÛ\ÜÏH™Ü˜\XÜË]ŒËXÜ›İÙ‰Ğ\œ˜^K™œ›ÛJÛ[™İ˜_K
K
OO˜Ü[ˆİ[OH‹KXÜ›İÙZ[™^‰İHÜÜ[˜
Kš›Ú[Š
_OÙ]]ˆÛ\ÜÏH™Ü˜\XÜË]ŒËYÜ›İ[™Y\İÙ]˜
NÛ]ÏYK›™^[[Y[ÚX›[™ÎÊJÈ[œİ[˜Ù[ÙˆS[[Y[
_XË˜Û\ÜÓ\İ˜ÛÛZ[œÊÜ˜\XÜË]ŒË\İ\Ü\›İØ
JI‰ŠÏYØİ[Y[˜Ü™X]Q[[Y[
ÙXİ[Û˜
KË˜Û\ÜÓ˜[YOXÜ˜\XÜË]ŒË\İ\Ü\›İØK˜Y\ŠÊJNÛ]X	ÚKš›Ú[Š
_N‰İXØË™]\Ù]œÚYÛ˜]\™HOO[	‰ŠË™]\Ù]œÚYÛ˜]\™O[ËšY[ZK›[™İOOLËš[›™\’SZK›[™İØXY\Ü[RÕU‘TÈPSHSH’S‘ÏÜÜ[İ›Û™Ï‰ÚK›[™İH\ğé›XÚH[\œİ0ï™\Üİ›Û™ÏÚXY\]‰ÚK›X\

KŠOOÛ]OS[X™\Š‹œ™[][ÛœÚ\›Û\ÏË–ÙWOÏÌ
KOYØİ[Y[˜Ü™X]Q[[Y[
]˜
NØK˜Û\ÜÓ˜[YOXÜ˜\XÜË]ŒË\İ\Ü[Y[X™\˜Kœİ[KœÙ]›Ü\JK\İ\ÜZ[™^İš[™ÊŠJKK˜\[™
š
Kİ\Ü
JNÛ]ÏYØİ[Y[˜Ü™X]Q[[Y[

NÜ™]\›ˆËš[›™\’SXİ›Û™Ï‰Ö
š
JJ_OÜİ›Û™ÏÛX[‰Ö
Z
JJ_H0­È™^šYZ[™È	ÚOLØ
Ø˜IÚ_OÜÛX[˜K˜\[™
ÊKK›İ]\’SJKš›Ú[Š
_OÙ]˜˜
_Y[˜İ[Ûˆš

^Û]OYØİ[Y[œ]Y\TÙ[XİÜŠÛZ[šYØ[YK[[Ù[
KYOËœ]Y\TÙ[XİÜŠ›Z[šYØ[YK\İYÙX
NÚYŠJH[œİ[˜Ù[ÙˆS[[Y[
_J[œİ[˜Ù[ÙˆS[[Y[
_KšY[Š\™]\›Û]YK™]\Ù]›Z[šQØ[Y_›\İ\İ™]\Ù]™Ü˜\XÜÑØ[YO[‹™]\Ù]™Ü˜\XÜÔ™[X\ÙO]š˜Û\ÜÓ\İ˜Y
Ü˜\XÜË]ŒË[Z[šYØ[YK\İYÙX
NÛ]SZ

KOP\œ˜^Kš\Ğ\œ˜^J‹˜Xİ]™UX[JOÜ‹˜Xİ]™UX[N–×KOYKœ]Y\TÙ[XİÜŠÙ]K[Z[šK\\ÙWX
OË^ÛÛ[Ëš[J
OÏØÏPÚ
‹K
KÏX	ÛŸN‰ÛËš›Ú[Š
_N‰Ø_XÏ]œ]Y\TÙ[XİÜŠœØÛÜHˆ™Ü˜\XÜË]ŒË[Z[šYØ[YK[^Y\˜
NØÈ[œİ[˜Ù[ÙˆS[[Y[
ÏYØİ[Y[˜Ü™X]Q[[Y[
]˜
KË˜Û\ÜÓ˜[YOXÜ˜\XÜË]ŒË[Z[šYØ[YK[^Y\˜˜\[™
ÊJKË™]\Ù]œÚYÛ˜]\™HOO\É‰ŠË™]\Ù]œÚYÛ˜]\™O\ËËš[›™\’SXË˜\[™
š
‹ËJJJ_Y[˜İ[Ûˆš
KŠ^Û]YØİ[Y[˜Ü™X]Q[[Y[
ÙXİ[Û˜
NÜ‹˜Û\ÜÓ˜[YOXÜ˜\XÜË]ŒË\ØÙ[™HÜ˜\XÜË]ŒË\ØÙ[™KIÙ_X‹™]\Ù]œ\ÙO[Û]OYØİ[Y[˜Ü™X]Q[[Y[
]˜
NÚYŠK˜Û\ÜÓ˜[YOXÜ˜\XÜË]ŒË\ØÙ[™KX˜YÙXKš[›™\’SXÜ[‘ÔQ’RËUTUHŒÏÜÜ[İ›Û™Ï‰Ö

JJ_OÜİ›Û™Ï˜‹˜\[™
JKOOOXYÙTYX
\™]\›ˆ‹˜\[™
Z

JKÛ]O]œÛXÙJX]˜ÙZ[
›[™İÌŠJKÏ]œÛXÙJX]˜ÙZ[
›[™İÌŠJKÏYØİ[Y[˜Ü™X]Q[[Y[
]˜
NÜË˜Û\ÜÓ˜[YOXÜ˜\XÜË]ŒËYšY[Ëš[›™\’SUÚ
JNÛ]ÏR
KYOOOXX\ÛÛXØ[šXØ˜ÚY\˜
KR
ËšYÚOOOX›[šŞX˜[Ø[˜˜YX
NÜ™]\›ˆ‹˜\[™
ËË
KŸY[˜İ[Ûˆ
KŠ^Û]YØİ[Y[˜Ü™X]Q[[Y[
]˜
NÜ™]\›ˆ‹˜Û\ÜÓ˜[YOXÜ˜\XÜË]ŒË[Z[šYØ[YKXØ\İ	İXK™›Ü‘XXÚ

K
OOÛ]OYØİ[Y[˜Ü™X]Q[[Y[
]˜
NÚK˜Û\ÜÓ˜[YOXÜ˜\XÜË]ŒËXØ\İ[Y[X™\˜Kœİ[KœÙ]›Ü\JKXØ\İZ[™^İš[™Ê
JKK˜\[™
š
KZ[šXŠJNÛ]OYØİ[Y[˜Ü™X]Q[[Y[
Ü[˜
NØK^ÛÛ[Qš
JKK˜\[™
JK‹˜\[™
J_JKŸY[˜İ[ÛˆZ
J^Û]YØİ[Y[˜Ü™X]Q[[Y[
]˜
Nİ˜Û\ÜÓ˜[YOXÜ˜\XÜË]ŒË\]›Û^›Û™Xš[›™\’SX]ˆÛ\ÜÏH™Ü˜\XÜË]ŒËZYÙK]Ø[OÚOOÚOOÚOOÚOÙ]]ˆÛ\ÜÏH™Ü˜\XÜË]ŒËZYK]X[HÙ]˜Û]]œ]Y\TÙ[XİÜŠ™Ü˜\XÜË]ŒËZYK]X[X
NÙK™š[\ŠOO™HOOXİ[™[X	‰™HOOX[X
KœÛXÙJ
K™›Ü‘XXÚ

K
OOÛ]YØİ[Y[˜Ü™X]Q[[Y[
]˜
NÜ‹˜Û\ÜÓ˜[YOXÜ˜\XÜË]ŒËZY\˜‹œİ[KœÙ]›Ü\JKZYKZ[™^İš[™Ê
JK‹˜\[™
š
KZ[šX[šXØ
JKË˜\[™
Š_JNÙ›ÜŠ]HÙˆZ

J^Û]YØİ[Y[˜Ü™X]Q[[Y[
]˜
NÛ‹˜Û\ÜÓ˜[YOXÜ˜\XÜË]ŒË\]›ÛÜ˜\XÜË]ŒË\]›ÛIÙKšYH[™KIÙK›[™_X‹œİ[KœÙ]›Ü\JK\]›ÛY\˜][Û˜	ÙK™\˜][ÛŸ\Ø
K‹œİ[KœÙ]›Ü\JK\]›ÛY[^X	ÙK™[^_\Ø
K‹œİ[KœÙ]›Ü\JK\]›ÛY\™Xİ[Û˜İš[™ÊK™\™Xİ[ÛŠJK‹œİ[KœÙ]›Ü\JKXÛÛ™K[[™İ	ÙK˜ÛÛ™_\
K‹˜\[™
š
KšYİX\™[œÜXİ
JNÛ]YØİ[Y[˜Ü™X]Q[[Y[
˜
NÜ‹^ÛÛ[YKšYOOXİ[™[XØÕS‘SH0­ÈÓSSP”‘UTU“ÕRSX˜SH0­ÈĞÒ0çÔÑS•S‘TU“ÕRSXÛ]OYØİ[Y[˜Ü™X]Q[[Y[
Ü[˜
NÚK˜Û\ÜÓ˜[YOXÜ˜\XÜË]ŒË]š\Ú[Û‹XÛÛ™X‹˜\[™
‹JK˜\[™
Š_\™]\›ˆY[˜İ[ÛˆÚ
J^Ü™]\›ˆOOOX›\İ\Ø]ˆÛ\ÜÏH™Ü˜\XÜË]ŒË]X›H›\OÚOOÚOOÚOOÚOØÙ]˜™OOOX™Y\”Û™ØØ]ˆÛ\ÜÏH™Ü˜\XÜË]ŒË]X›HÛ™È]ˆÛ\ÜÏHœ˜XÚÈY¸¥ãÈ8¥ãÈ8¥ãÏœˆ8¥ãÈ8¥ãÏœˆ8¥ãÏÙ]HÛ\ÜÏH˜˜[ÚO]ˆÛ\ÜÏHœ˜XÚÈšYÚ¸¥ãÈ8¥ãÈ8¥ãÏœˆ8¥ãÈ8¥ãÏœˆ8¥ãÏÙ]Ù]˜™OOOX›[šŞX˜[Ø]ˆÛ\ÜÏH™Ü˜\XÜË]ŒËY›[šŞK[[™HHÛ\ÜÏH›[™HÚOˆÛ\ÜÏH˜›İHØÜ[ˆÛ\ÜÏH›İË]˜Z[ÜÜ[Ù]˜˜]ˆÛ\ÜÏH™Ü˜\XÜË]ŒËZÛHOÚO“PTÓÏœ“ĞÒØÜ[ÜÜ[Ù]˜Y[˜İ[ÛˆÚ
J^Û]YOË™]Z[ÏŞßNÙØİ[Y[™Øİ[Y[[[Y[™]\Ù]™Ü˜\XÜÕŒÓİ]ÛÛYO]œİXØÙ\ÜÏØİXØÙ\ÜØ˜˜Z[Ú[™İË˜ÛX\•[Y[İ]
š
Kš]Ú[™İËœÙ][Y[İ]


OO™[]HØİ[Y[™Øİ[Y[[[Y[™]\Ù]™Ü˜\XÜÕŒÓİ]ÛÛYKMŒ
KZ

_Y[˜İ[ÛˆÚ

^Şš

Kš

_Y[˜İ[ÛˆZ

^ĞZ
ZHL™\]Y\İ[š[X][Û‘œ˜[YJ

OOĞZHLKÚ

_JJ_Y[˜İ[Ûˆš
J^Û]SZ

Nİ˜Xİ]™UX[OP\œ˜^Kš\Ğ\œ˜^JJOÙN–×Kš

KZ

_Y[˜İ[ÛˆZ

^Û]OSZ

NÜ™]\›İ™\œÚ[ÛšXİ]™UX[N™K˜Xİ]™UX[OÏÖ×Kİ\ÜX[N”Ú
K˜Xİ]™UX[OÏÖ×JKœ˜]Û[š[˜ÙYˆHYØİ[Y[œ]Y\TÙ[XİÜŠ™Ü˜\XÜË]ŒËXœ˜]Û
KZ[šYØ[YN™Øİ[Y[œ]Y\TÙ[XİÜŠÛZ[šYØ[YK[[Ù[
OË™]\Ù]›Z[šQØ[YOÏØ]›ÛÎ™Øİ[Y[œ]Y\TÙ[XİÜ[
™Ü˜\XÜË]ŒË\]›Û^›Û™Hˆ™Ü˜\XÜË]ŒË\]›Û
K›[™İ_Y[˜İ[Ûˆ
J^Ü™]\›ˆİš[™ÊJKœ™\XÙJÖÉ‰È—KÙËOOŠÈ‰ˆ˜	˜[\Ø˜	›Øˆ˜	™İØ‰È˜	ˆÌÎNØ	È‰Î˜	œ][İØJVÙWOÏÙJ_Y[˜İ[Ûˆš

^ÙØİ[Y[™Øİ[Y[[[Y[˜Û\ÜÓ\İ˜Y
Ü˜\XÜË]\]K]ŒËXXİ]™X
K™]È]]][Û“ØœÙ\™\ŠZ
K›ØœÙ\™JØİ[Y[™Øİ[Y[[[Y[ØÚ[\İˆLİX™YNˆL]šX]\ÎˆL]šX]Qš[\–ØY[˜Û\ÜØ]K[Z[šKYØ[YX_JKÚ[™İË˜Y]™[\İ[™\ŠËXØ[\ZYÛ‹[Z[šYØ[YK[İ]ÛÛYXÚ
KÚ[™İËœÙ][\˜[
ZYLÊKZ

KÚ[™İË—×İ[\ÑÜ˜\XÜÕ\]UŒÏ^İ™\œÚ[Ûš›Ü˜ÙNœZÛ˜\Úİ–ZÙ]Xİ]™UX[N’šÚİĞœ˜]Û
OVØX\Û™[^[›X™[™Xİ\ÚXJ^İÚ[™İË—×ÛÕÙYZÙ[™\˜ÑXYÏËœÚİĞœ˜]ÛËŠ
Kš
JKZ

_Kİ\Z[šYØ[YJOXYÙTYXVØ[›X™[^™[™X\œØJ^Òš

KÚ[™İË—×ÛÓZ[šYØ[YQXYÏËœİ\ËŠJKÚ[™İË—×ÛÓZ[šYØ[YQXYÏË˜™YÚ[ËŠ
KÚ[™İË—×ÛÓZ[šYØ[YQXYÏËœÚÚ\Ûİ[İÛËŠ
KZ

___]\[ÙˆÚ[™İÏX	‰\[ÙˆØİ[Y[X	‰–š

NÙ^ÜĞİ\ÈK\ÈK]\È‹È\ÈË]\È‹İ\ÈN