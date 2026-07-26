window.TBA13_CONTENT={
  version:'1.8.0-sprint28',
  build:'Sprint 28 · v1.8.0 · Build v29',
  traits:{
    charmant:{label:'Charmant',desc:'Kann selbst schlechten Unsinn wie eine halbwegs gute Idee verkaufen.',dialogue:14,flirt:15,battle:0},
    direkt:{label:'Direkt',desc:'Kurze Ansagen, wenig Diplomatie und erstaunlich viele beleidigte Gesichter.',dialogue:6,flirt:-2,battle:6},
    chaotisch:{label:'Chaotisch',desc:'Schaltet Lösungen frei, die objektiv dumm und deshalb oft erfolgreich sind.',dialogue:4,flirt:5,battle:4},
    hilfsbereit:{label:'Hilfsbereit',desc:'Mehr Vertrauen, bessere Questbelohnungen und weniger Leute, die dich aktiv hassen.',dialogue:9,flirt:7,battle:1},
    beobachtend:{label:'Beobachtend',desc:'Erkennt Schwächen, versteckte Vorräte und Menschen kurz vor dem Kontrollverlust.',dialogue:8,flirt:4,battle:3}
  },
  items:{
    water:{label:'Wasser',icon:'💧',price:3,max:10,use:{thirst:-30,bladder:13,hangover:-6}},
    sausages:{label:'Würste',icon:'🌭',price:6,max:5,use:{hunger:-35,thirst:5}},
    beer:{label:'Bier',icon:'🍺',price:4,max:16,use:{thirst:-5,bladder:20,alcohol:17,courage:5,dignity:-1}},
    batida:{label:'Batida de Coco',icon:'🥥',price:10,max:4,use:{alcohol:24,bladder:10,courage:8,dignity:-2}},
    chips:{label:'Chips',icon:'🥨',price:3,max:8,use:{hunger:-18,thirst:9}},
    coffee:{label:'Kaffee',icon:'☕',price:4,max:6,use:{energy:20,thirst:4,bladder:11,hangover:-8}},
    toiletPaper:{label:'Klopapier',icon:'🧻',price:2,max:4,quest:true},
    painkiller:{label:'Kopfschmerztablette',icon:'💊',price:4,max:4,use:{hangover:-42}},
    joint:{label:'Mysteriöse Kräuterzigarette',icon:'🌿',price:0,max:5,use:{highness:28,courage:2,hunger:10,energy:-3}},
    lighter:{label:'Feuerzeug',icon:'🔥',price:2,max:2,tool:true},
    deodorant:{label:'Deo',icon:'🧴',price:3,max:3,use:{flirt:12,dignity:3}},
    condoms:{label:'Optimismus in Folie',icon:'📦',price:5,max:3,flavour:true},
    trashBag:{label:'Müllsack',icon:'🗑️',price:2,max:5,quest:true},
    sunglasses:{label:'Sonnenbrille',icon:'🕶️',price:5,max:1,use:{hangover:-5,flirt:3}},
    kebab:{label:'Camping-Döner',icon:'🥙',price:7,max:3,use:{hunger:-48,energy:8,thirst:7}},
    token:{label:'Spielmarke',icon:'🪙',price:0,max:99,quest:true}
  },
  crew:{
    player:{id:'player',name:'Du',color:'#f4c45f',maxHp:98,speed:10,role:'Improvisiertes Führungsproblem',moves:[
      {id:'dry',name:'Trockener Konter',power:20,accuracy:94,text:'Kurz, präzise und unnötig persönlich.'},
      {id:'chair',name:'Campingstuhl-Blockade',power:7,accuracy:100,guard:.58,text:'Deutsche Aluminiumverteidigung.'},
      {id:'rant',name:'Ungefragter Vortrag',power:14,accuracy:89,status:'genervt',chance:38,text:'Niemand hat gefragt. Das hält dich nicht auf.'},
      {id:'round',name:'Kühle Runde',power:0,accuracy:100,heal:24,costItem:'beer',text:'Eine medizinisch fragwürdige Gruppenmaßnahme.'}
    ]},
    andre:{id:'andre',name:'André',nickname:'Der Organisator',color:'#f0b64f',maxHp:92,speed:10,role:'Plant alles, bis alle es ruinieren',bio:'Hat einen Plan, eine Ersatzplanung und neun Freunde, die beides ignorieren.',moves:[
      {id:'plan',name:'Excel der Verdammnis',power:18,accuracy:96,status:'verwirrt',chance:32},
      {id:'brief',name:'Unnötig gutes Briefing',power:12,accuracy:100,guard:.55},
      {id:'escalate',name:'Geplante Eskalation',power:25,accuracy:80}
    ]},
    rene:{id:'rene',name:'René',nickname:'Der Diplomat',color:'#4fb7a6',maxHp:84,speed:13,role:'Redet sich aus Situationen, die andere hineinsaufen',bio:'Kann sogar Gundula erklären, warum der brennende Klappstuhl ein Missverständnis war.',moves:[
      {id:'smooth',name:'Glatte Ausrede',power:16,accuracy:98,status:'verwirrt',chance:40},
      {id:'smile',name:'Unverschämtes Grinsen',power:11,accuracy:100,guard:.45},
      {id:'redirect',name:'Themenwechsel des Todes',power:20,accuracy:88}
    ]},
    lars:{id:'lars',name:'Lars',nickname:'Der Pegelmanager',color:'#5b9be0',maxHp:101,speed:7,role:'Verwechselt Kondition mit Leberleistung',bio:'Ein Mann wie ein Kühlschrank: robust, laut und meistens voller Bier.',moves:[
      {id:'crate',name:'Kastenargument',power:24,accuracy:86},
      {id:'stamina',name:'Leber aus Granit',power:8,accuracy:100,guard:.68},
      {id:'burp',name:'Akustischer Übergriff',power:17,accuracy:91,status:'benebelt',chance:35}
    ]},
    danny:{id:'danny',name:'Danny',nickname:'Der Frühabreiser',color:'#dd6e73',maxHp:79,speed:15,role:'Ist plötzlich weg, wenn Aufräumen beginnt',bio:'Schnell, charmant und mit einem mysteriösen Termin am Sonntagmorgen.',moves:[
      {id:'exit',name:'Französischer Abgang',power:18,accuracy:100},
      {id:'excuse',name:'Dringender Termin',power:13,accuracy:96,guard:.55},
      {id:'speed',name:'Schon im Auto',power:22,accuracy:86}
    ]},
    gregor:{id:'gregor',name:'Gregor',nickname:'Der Grillphilosoph',color:'#d8793d',maxHp:96,speed:8,role:'Verbrennt Fleisch und erklärt es zur Kruste',bio:'Erkennt an der Farbe einer Wurst, ob sie tot, sehr tot oder juristisch problematisch ist.',moves:[
      {id:'smoke',name:'Rauchwand',power:13,accuracy:94,status:'benebelt',chance:46},
      {id:'tongs',name:'Grillzangen-Klackern',power:18,accuracy:92},
      {id:'charcoal',name:'Kohle nachlegen',power:0,accuracy:100,heal:22}
    ]},
    felix:{id:'felix',name:'Felix',nickname:'Der Flirtbeauftragte',color:'#bd65cf',maxHp:76,speed:14,role:'Selbstvertrauen ohne belastbare Datengrundlage',bio:'Flirtet mit allem, was länger als drei Sekunden Blickkontakt hält. Einschließlich Getränkeautomat.',moves:[
      {id:'wink',name:'Fragwürdiges Zwinkern',power:17,accuracy:90,status:'peinlich',chance:45},
      {id:'line',name:'Anmachspruch von 2009',power:21,accuracy:76},
      {id:'confidence',name:'Grundloses Selbstvertrauen',power:9,accuracy:100,guard:.62}
    ]},
    masl:{id:'masl',name:'Masl',nickname:'Der Spielleiter',color:'#68b86f',maxHp:88,speed:11,role:'Kennt Regeln, die er gerade erfunden hat',bio:'Kann aus zwei Bechern und einer nassen Socke ein Turnier mit Gruppenphase bauen.',moves:[
      {id:'rules',name:'Regelwerk erfinden',power:16,accuracy:96,status:'verwirrt',chance:44},
      {id:'rematch',name:'Best of Seven',power:19,accuracy:88},
      {id:'referee',name:'Schiedsrichterblick',power:8,accuracy:100,guard:.6}
    ]},
    schubert:{id:'schubert',name:'Schubert',nickname:'Der Botaniker',color:'#6fa56d',maxHp:81,speed:9,role:'Findet erstaunlich oft den windgeschützten Platz',bio:'Hat rote Augen wegen der Pollen. Sagt er. Im November.',moves:[
      {id:'cloud',name:'Duftwolke',power:13,accuracy:94,status:'benebelt',chance:55},
      {id:'theory',name:'Kosmische Theorie',power:19,accuracy:84,status:'verwirrt',chance:38},
      {id:'snack',name:'Plötzlicher Heißhunger',power:0,accuracy:100,heal:26}
    ]},
    schima:{id:'schima',name:'Schima',nickname:'Der Nachtmensch',color:'#596ab8',maxHp:90,speed:12,role:'Wird um 02:00 Uhr erst gesprächig',bio:'Tagsüber Energiesparmodus, nachts philosophische Abrissbirne.',moves:[
      {id:'night',name:'Nachtaktive Energie',power:22,accuracy:91},
      {id:'stare',name:'Völlig leerer Blick',power:14,accuracy:100,status:'verwirrt',chance:35},
      {id:'lighter',name:'Feuerzeug weg',power:10,accuracy:100,guard:.5}
    ]},
    ronny:{id:'ronny',name:'Rivalen-Ronny',nickname:'Parkplatz-Philosoph',color:'#e45f4d',maxHp:90,speed:8,role:'Gegner mit Meinung',moves:[
      {id:'lecture',name:'Endloser Vortrag',power:18,accuracy:91,status:'verwirrt',chance:30},
      {id:'cup',name:'Plastikbecher-Wurf',power:15,accuracy:96},
      {id:'ego',name:'Fragiles Ego',power:8,accuracy:100,guard:.58}
    ]},
    gundula:{id:'gundula',name:'Gundula',nickname:'Die Platzordnung',color:'#e57c9d',maxHp:110,speed:9,role:'Endgegnerin der Verwaltung',moves:[
      {id:'look',name:'Gundulas Blick',power:24,accuracy:98,status:'peinlich',chance:55},
      {id:'clipboard',name:'Klemmbrett der Wahrheit',power:20,accuracy:94},
      {id:'hedge',name:'Heckenprotokoll',power:29,accuracy:86}
    ]},
    uli:{id:'uli',name:'Uli',nickname:'Der Parkplatz',color:'#61a6d0',maxHp:104,speed:7,role:'Sieht jeden schiefen Reifen',moves:[
      {id:'parking',name:'Parkplatzansage',power:21,accuracy:96},
      {id:'vest',name:'Warnwesten-Aura',power:10,accuracy:100,guard:.64},
      {id:'reverse',name:'Rückwärts einweisen',power:18,accuracy:90,status:'verwirrt',chance:35}
    ]}
  },
  friendIds:['andre','rene','lars','danny','gregor','felix','masl','schubert','schima'],
  enemies:{
    parkingCrew:{name:'Die Parkplatz-Philosophen',members:['ronny','uli'],reward:14},
    quietPatrol:{name:'Nachtruhe-Sondereinheit',members:['gundula','uli'],reward:0},
    nightHowlers:{name:'Die 03:17-Uhr-Brüllaffen',members:['ronny','lars','felix'],reward:22},
    sundayHangover:{name:'Der Sonntagmorgen',members:['gundula','ronny','uli'],reward:0}
  },
  quests:{
    shop:{id:'shop',title:'Einkaufen ohne Hirnschaden',desc:'Kaufe mit 25 € ein. Danach behaupte, es sei eine Strategie gewesen.',reward:'Vorräte und Restgeld'},
    entry:{id:'entry',title:'Rein in den Wahnsinn',desc:'Komme außerhalb der Mittagspause an Gundula und Uli vorbei.',reward:'Zugang zum Campingplatz'},
    reunion:{id:'reunion',title:'Neun Freunde, null Aufsicht',desc:'Finde die komplette Freundesgruppe auf dem Gelände.',reward:'Gruppenbonus und neue Teamoptionen'},
    hedge:{id:'hedge',title:'Die Hecke vergisst nichts',desc:'Vermeide es, in Gundulas Hecke zu brunsen. Oder beseitige die Folgen.',reward:'Kein Platzverweis'},
    patrol18:{id:'patrol18',title:'Der Rundgang',desc:'Um 18 Uhr kontrollieren Gundula und Uli den gesamten Platz. Verstecke offensichtlichen Blödsinn.',reward:'Ruf und Ruhe vor dem Klemmbrett'},
    quiet22:{id:'quiet22',title:'Nachtruhe für Fortgeschrittene',desc:'Ab 22 Uhr Lautstärke senken, Ablenkung schaffen oder die Kontrolle austricksen.',reward:'Nachtzugang und weniger Ärger'},
    flip:{id:'flip',title:'Becher, Würde, Boden',desc:'Gewinne Flip Cup gegen Masl und Lars.',reward:'Spielmarken und Respekt'},
    pong:{id:'pong',title:'Plastikbecher-Ballistik',desc:'Gewinne Beer Pong gegen Felix und René.',reward:'Flirtbonus und Spielmarken'},
    flunky:{id:'flunky',title:'Flasche um, Resthirn aus',desc:'Gewinne Flunkyball auf der Wiese.',reward:'Ruf, Durst und schlechte Entscheidungen'},
    smoke:{id:'smoke',title:'Botanische Feldforschung',desc:'Finde Schubert und Schima am geheimen Rauchplatz.',reward:'Kräuterzigarette und Nachtquest'},
    flirt:{id:'flirt',title:'Romantik mit Campingstuhl',desc:'Überzeuge einen Partygast, dass du trotz Geruch und Pegel Gesprächswert besitzt.',reward:'Flirtstatus und Würdeverlust'},
    cleanup:{id:'cleanup',title:'Müll, Reue und Restalkohol',desc:'Räume Sonntagmorgen das Lager auf, bevor Gundula Beweismittel katalogisiert.',reward:'Besseres Ende'},
    departure:{id:'departure',title:'Abfahrt ohne Vermisstenanzeige',desc:'Sei Sonntag um 12 Uhr mit Zelt, Freunden und Restwürde am Parkplatz.',reward:'Wochenendwertung'}
  },
  schedules:{
    gateClosed:[{start:780,end:900,label:'Mittagspause 13–15 Uhr'}],
    patrols:[
      {day:'any',start:1080,end:1140,type:'round',label:'18-Uhr-Rundgang'},
      {day:'any',start:1320,end:1380,type:'quiet',label:'Nachtruhekontrolle'}
    ]
  },
  zones:{
    parking:{name:'Parkplatz',x:70,y:560,w:460,h:520},
    gate:{name:'Haupttor',x:520,y:545,w:100,h:185},
    guard:{name:'Gundula & Uli',x:650,y:500,w:300,h:230},
    toilets:{name:'Sanitärkathedrale',x:990,y:520,w:280,h:230},
    north:{name:'Nordlager',x:720,y:100,w:760,h:340},
    south:{name:'Südlager',x:650,y:890,w:800,h:390},
    games:{name:'Spielwiese',x:1480,y:180,w:550,h:470},
    kiosk:{name:'Imbiss',x:1480,y:700,w:300,h:220},
    beach:{name:'Strand',x:1760,y:880,w:640,h:430},
    lake:{name:'Blaue Adria',x:1960,y:1020,w:440,h:580},
    hedge:{name:'Gundulas Hecke',x:610,y:470,w:45,h:400},
    smoke:{name:'Geheimer Rauchplatz',x:1420,y:1120,w:300,h:260},
    exit:{name:'Abreisepunkt',x:160,y:980,w:250,h:160}
  },
  dialogues:{
    gundula:{name:'Gundula',portrait:'G',color:'#e57c9d',intro:['Ach du Scheiße. Noch so ein Wochenendheld mit Schlafsack, Restalkohol und dem Blick eines Menschen, der gleich meine Hecke entweiht.','Zwischen 13 und 15 Uhr ist Mittagspause. Da kommt hier keiner rein. Nicht du, nicht der Papst und erst recht kein Idiot mit Bluetooth-Box.'],hedge:['Hast du gerade in meine Hecke gebrunst? Diese Hecke hat mehr Würde als deine gesamte Blutlinie.','Du holst jetzt Wasser, Müllsack und deine letzte verbliebene Scham. Dann wird gereinigt.'],patrol:['18 Uhr. Rundgang. Ich rieche Bier, Rauch und eine Entscheidung, die gleich teuer wird.'],quiet:['22 Uhr. Nachtruhe. Wer jetzt noch grölt, schläft morgen im Kofferraum.'],goodbye:['Sonntagmittag. Verschwindet. Und nehmt alles mit, was klebt, qualmt oder atmet.']},
    uli:{name:'Uli',portrait:'U',color:'#61a6d0',intro:['Wer hat dir Parken beigebracht? Ein besoffener Maulwurf mit Gleichgewichtsstörung?','Parkplatz vier. Die Zahl zwischen drei und fünf. Ich male sie dir nicht auf die Stirn, obwohl es helfen würde.'],patrol:['Ich zähle neun Leute, elf Stühle und zwölf offene Getränke. Mathematisch ist hier schon alles falsch.'],quiet:['Die Box leiser. Nicht „ein bisschen“. Leiser heißt, ich höre sie nicht mehr und denke wieder, die Menschheit hätte Chancen.']},
    andre:{name:'André',portrait:'A',color:'#f0b64f',lines:['Ich hatte einen Ablaufplan. Dann kam Lars mit einem Kasten und Felix mit Selbstvertrauen.','Wir brauchen bis Sonntagmittag alle am Parkplatz. Das klingt leicht, wenn man die Gruppe nicht kennt.']},
    rene:{name:'René',portrait:'R',color:'#4fb7a6',lines:['Gundula war kurz davor, uns rauszuwerfen. Ich habe ihr erklärt, dass der Rauch vom Grill kam. Der Grill war aus.','Lass mich reden. Du kannst währenddessen so aussehen, als würdest du etwas bereuen.']},
    lars:{name:'Lars',portrait:'L',color:'#5b9be0',lines:['Ich trinke nicht viel. Ich trinke nur konsequent. Das ist ein Unterschied für Leute mit schwacher Bildung.','Wasser? Klar. Ist doch im Bier drin.']},
    danny:{name:'Danny',portrait:'D',color:'#dd6e73',lines:['Ich muss Sonntag früh los. Sehr wichtiger Termin. Nennt sich „nicht beim Aufräumen helfen“.','Falls jemand fragt: Ich war nie hier. Falls es Fotos gibt: schlechte KI.']},
    gregor:{name:'Gregor',portrait:'G',color:'#d8793d',lines:['Die Wurst ist nicht verbrannt. Sie hat Charakter entwickelt. Sehr dunklen Charakter.','Wer Ketchup will, kann gleich den Grill beleidigen und sich selbst ohrfeigen.']},
    felix:{name:'Felix',portrait:'F',color:'#bd65cf',lines:['Ich habe Blickkontakt bekommen. Gut, sie suchte eigentlich die Toilette, aber Details töten Romantik.','Deo ist kein Ersatz für Persönlichkeit. Aber heute nehmen wir, was wir kriegen.']},
    masl:{name:'Masl',portrait:'M',color:'#68b86f',lines:['Regel eins: Ich erkläre die Regeln. Regel zwei: Wenn ich verliere, war Regel eins unklar.','Best of three. Oder five. Oder bis ich gewinne. Sportlich bleiben.']},
    schubert:{name:'Schubert',portrait:'S',color:'#6fa56d',lines:['Das sind keine roten Augen. Das ist botanische Begeisterung.','Hast du auch manchmal das Gefühl, dass Campingstühle uns beobachten? Nein? Warte zehn Minuten.']},
    schima:{name:'Schima',portrait:'S',color:'#596ab8',lines:['Tagsüber bin ich Energiesparmodus. Ab Mitternacht löse ich gesellschaftliche Probleme, die niemand hatte.','Wo ist mein Feuerzeug? Egal. Wahrscheinlich hat es jetzt ein besseres Leben.']},
    nina:{name:'Nina vom Nachbarplatz',portrait:'N',color:'#e68ab4',lines:['Du riechst nach Lagerfeuer, Bier und einer Haftpflichtversicherung kurz vor der Kündigung.','Dein Spruch war schlecht. Aber du hast ihn mit beeindruckender Überzeugung ruiniert.']},
    jule:{name:'Jule vom Kiosk',portrait:'J',color:'#e0a04f',lines:['Sieben Euro für den Döner. Beschwerden kosten zwei Euro extra.','Du flirtst gerade mit jemandem, der ein Brotmesser hält. Denk über deine Wortwahl nach.']}
  },
  oneLiners:[
    'Der See riecht nach Sonnencreme, Bier und Entscheidungen ohne Rückgaberecht.',
    'Ein Klappstuhl öffnet sich. Ein deutsches Raubtier erwacht.',
    'Aus einem Zelt kommt Musik, die selbst der Bluetooth-Lautsprecher bereut.',
    'Der Boden klebt. Niemand weiß warum. Jeder weiß es.',
    'Jemand sagt „nur ein Bier“. Die Uhr lacht leise.',
    'Ein Mückenschwarm bewertet die Gruppe als All-you-can-eat-Buffet.',
    'Am Grill wird eine Wurst in Kohlenstoff und Selbsttäuschung verwandelt.',
    'Felix nennt es Flirten. Die Gegenseite nennt es einen langen Weg zur Toilette.',
    'Schubert untersucht die lokale Flora von innen.',
    'Gundula sieht alles. Besonders Dinge, die sie wirklich nicht sehen wollte.',
    'Uli richtet einen Campingstuhl exakt parallel zum Bordstein aus. Frieden kehrt kurz ein.',
    'Sonntagmorgen: Die Natur ist schön. Die Gruppe nicht.'
  ],
  endings:{
    legendary:{title:'Legenden der Adria',text:'Ihr fahrt geschlossen ab. Der Platz steht noch, Gundulas Hecke lebt und niemand wurde offiziell vermisst.'},
    decent:{title:'Erstaunlich brauchbares Wochenende',text:'Ein paar Flecken, ein paar Erinnerungslücken, aber ihr habt mehr Freunde als offene Rechnungen.'},
    disaster:{title:'Hausverbot mit Gruppenfoto',text:'Gundula laminiert euer Hausverbot. Uli misst noch einmal die Reifenspuren. Ihr wart technisch gesehen ein Naturereignis.'},
    abandoned:{title:'Abreise mit Verlusten',text:'Sonntagmittag fehlen Menschen, Zeltteile und jede plausible Erklärung. Der Parkplatz schweigt beschämt.'}
  }
};
