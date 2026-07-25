window.TBA13_MAP={
  width:2800,height:1840,northUp:true,
  description:'Aerial-inspired elongated campsite: entrance northwest, service core west-center, wooded pitches through the middle, recreation lawns and beach to the east, lake dominating the eastern and southeastern side.',
  palette:{grass:'#6c9b55',grass2:'#7eaa61',dry:'#b9a36b',road:'#7d7d73',path:'#bda979',forest:'#365f3d',forest2:'#294c34',sand:'#d9c889',water:'#3f8fa9',water2:'#2f748f',roof:'#bb7554',roof2:'#7f6a57',tent:'#f1c966',caravan:'#e7e2d2'},
  lake:[
    [1740,40],[2800,40],[2800,1840],[1680,1840],[1640,1680],[1700,1540],[1650,1390],[1720,1260],[1690,1110],[1760,950],[1710,780],[1790,610],[1730,430],[1810,260]
  ],
  beach:[[1660,650],[1840,610],[1910,720],[1880,900],[1780,1010],[1650,940],[1600,800]],
  forests:[
    [[0,0],[720,0],[760,210],[580,330],[0,300]],
    [[0,1180],[580,1110],[760,1260],[730,1840],[0,1840]],
    [[730,0],[1430,0],[1490,150],[1340,270],[910,250]],
    [[1220,1260],[1650,1190],[1710,1390],[1620,1690],[1280,1710]],
    [[2110,0],[2800,0],[2800,330],[2460,280],[2220,190]]
  ],
  roads:[
    {w:92,points:[[0,330],[260,340],[500,390],[700,430],[980,470],[1280,500],[1510,560]]},
    {w:70,points:[[520,390],[520,680],[650,920],[880,1120],[1180,1220],[1450,1190],[1660,1100]]},
    {w:62,points:[[730,430],[860,270],[1160,220],[1440,310],[1570,510]]},
    {w:58,points:[[760,620],[1040,650],[1320,620],[1540,700],[1640,830]]},
    {w:56,points:[[680,930],[960,880],[1240,900],[1510,970],[1650,1070]]}
  ],
  footpaths:[
    {w:28,points:[[920,540],[970,390],[1130,300],[1330,330],[1450,470]]},
    {w:24,points:[[940,720],[1110,760],[1250,700],[1430,760],[1590,820]]},
    {w:24,points:[[1110,1040],[1300,1100],[1490,1080],[1620,1010]]},
    {w:22,points:[[1590,580],[1690,680],[1710,820],[1660,960],[1710,1100]]}
  ],
  zones:{
    entrance:{id:'entrance',name:'Zufahrt',x:0,y:280,w:330,h:180,type:'road'},
    parking:{id:'parking',name:'Besucherparkplatz',x:210,y:350,w:360,h:300,type:'parking'},
    gate:{id:'gate',name:'Haupttor',x:540,y:350,w:110,h:250,type:'gate'},
    toilets:{id:'toilets',name:'Sanitärgebäude',x:660,y:400,w:240,h:190,type:'building'},
    guards:{id:'guards',name:'Gundula & Uli',x:930,y:390,w:240,h:190,type:'building'},
    northCamp:{id:'northCamp',name:'Nördliches Zeltlager',x:820,y:90,w:720,h:300,type:'camp'},
    centralPitches:{id:'centralPitches',name:'Waldparzellen',x:820,y:470,w:720,h:420,type:'camp'},
    southCamp:{id:'southCamp',name:'Südliches Zeltlager',x:690,y:910,w:740,h:300,type:'camp'},
    eventLawn:{id:'eventLawn',name:'Spiel- und Festwiese',x:1260,y:520,w:390,h:410,type:'lawn'},
    kiosk:{id:'kiosk',name:'Kiosk & Imbiss',x:1370,y:960,w:260,h:180,type:'building'},
    hedge:{id:'hedge',name:'Gundulas heilige Hecke',x:895,y:370,w:38,h:390,type:'hedge'},
    beach:{id:'beach',name:'Hauptstrand',x:1590,y:600,w:360,h:430,type:'beach'},
    lake:{id:'lake',name:'Blaue Adria',x:1740,y:0,w:1060,h:1840,type:'water'},
    smokeSpot:{id:'smokeSpot',name:'Geheimer Rauchplatz',x:1280,y:1320,w:330,h:250,type:'forest'},
    quietBay:{id:'quietBay',name:'Kleine Bucht',x:1640,y:1110,w:300,h:260,type:'beach'},
    departure:{id:'departure',name:'Abreisepunkt',x:170,y:720,w:300,h:180,type:'parking'}
  },
  buildings:[
    {id:'toilets',x:680,y:420,w:200,h:150,roof:'#d7d3c5',label:'WC / DUSCHEN'},
    {id:'guards',x:950,y:410,w:190,h:150,roof:'#bc7653',label:'GUNDULA & ULI'},
    {id:'kiosk',x:1390,y:980,w:210,h:140,roof:'#d89b4d',label:'KIOSK'},
    {id:'reception',x:585,y:300,w:150,h:105,roof:'#9e7456',label:'ANMELDUNG'}
  ],
  parkingSlots:Array.from({length:12},(_,i)=>({x:240+(i%4)*76,y:400+Math.floor(i/4)*78,w:58,h:64})),
  caravans:Array.from({length:34},(_,i)=>({
    x:850+(i%7)*102+(i%2)*18,
    y:500+Math.floor(i/7)*78,
    rot:(i%3-1)*0.04,
    type:i%4===0?'tent':'caravan'
  })),
  northTents:Array.from({length:13},(_,i)=>({x:875+(i%7)*92,y:145+Math.floor(i/7)*105,color:['#efc85f','#de765a','#5fa0c8','#a66bc5'][i%4]})),
  southTents:Array.from({length:12},(_,i)=>({x:760+(i%6)*105,y:975+Math.floor(i/6)*110,color:['#e9b957','#60a97c','#d76b6b','#739bd3'][i%4]})),
  trees:Array.from({length:160},(_,i)=>({
    x:(i*173)%1760+20,
    y:(i*257)%1800+20,
    r:16+(i%5)*3,
    dark:i%3===0
  })).filter(t=>!(t.x>190&&t.x<610&&t.y>300&&t.y<760)&&!(t.x>620&&t.x<1660&&t.y>60&&t.y<1250)),
  friendAnchors:{
    andre:[1060,215],rene:[970,620],lars:[1460,1040],danny:[1230,230],gregor:[980,1040],felix:[1680,760],masl:[1420,700],schubert:[1400,1430],schima:[1500,1380]
  },
  patrolRoutes:{
    round:[[1040,500],[760,500],[650,720],[820,1040],[1210,1110],[1510,980],[1610,760],[1430,560],[1040,500]],
    quiet:[[1050,510],[860,650],[920,1000],[1240,1100],[1540,980],[1680,760],[1450,620],[1190,510],[1050,510]]
  }
};