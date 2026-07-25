(() => {
  'use strict';

  const STORAGE = 'tales-blaue-adria-preview-v1';
  const Phaser = window.Phaser;
  const directions = new Set();
  let actionRequested = false;
  let game = null;

  const initial = {
    profile: null,
    mode: 'creator',
    day: 1,
    minutes: 420,
    money: 25,
    needs: { energy: 100, hunger: 8, thirst: 10, bladder: 4, alcohol: 0, highness: 0 },
    inventory: { wasser: 2, wuerste: 1, bier: 2, batida: 1 },
    team: [],
    flags: {},
    position: { x: 165, y: 360 },
  };

  const state = load();
  const creator = document.querySelector('#creator');
  const shell = document.querySelector('#game-shell');
  const traitTexts = {
    charmant: 'Bessere Chancen in freundlichen Dialogen.',
    direkt: 'Klare Antworten wirken überzeugender.',
    chaotisch: 'Zusätzliche absurde Lösungswege.',
    hilfsbereit: 'Mehr Vorteile aus Nebenquests.',
    beobachtend: 'Findet leichter versteckte Hinweise.',
  };
  const labels = {
    energy: 'Energie', hunger: 'Hunger', thirst: 'Durst', bladder: 'Pinkeln', alcohol: 'Alkohol', highness: 'Breitheit',
  };
  const itemLabels = { wasser: 'Wasser', wuerste: 'Würste', bier: 'Bier', batida: 'Batida de Coco' };
  const colors = { energy: '#69cf9a', hunger: '#e7a95e', thirst: '#66b8db', bladder: '#dbc755', alcohol: '#e66b65', highness: '#ad82dc' };

  const nameInput = document.querySelector('#name');
  const skinInput = document.querySelector('#skin');
  const hairInput = document.querySelector('#hair');
  const shirtInput = document.querySelector('#shirt');
  const traitInput = document.querySelector('#trait');
  const avatar = document.querySelector('#avatar');

  [nameInput, skinInput, hairInput, shirtInput, traitInput].forEach((input) => input.addEventListener('input', updatePreview));
  document.querySelector('#start').addEventListener('click', () => {
    const name = nameInput.value.trim();
    if (!name) return;
    state.profile = { name, skin: skinInput.value, hair: hairInput.value, shirt: shirtInput.value, trait: traitInput.value };
    state.mode = 'world';
    persist();
    launch();
  });
  document.querySelector('#reset').addEventListener('click', () => {
    localStorage.removeItem(STORAGE);
    location.reload();
  });
  document.querySelector('#action').addEventListener('pointerdown', () => { actionRequested = true; });

  document.querySelectorAll('[data-dir]').forEach((button) => {
    const direction = button.dataset.dir;
    const stop = () => directions.delete(direction);
    button.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      button.setPointerCapture?.(event.pointerId);
      directions.add(direction);
    });
    button.addEventListener('pointerup', stop);
    button.addEventListener('pointercancel', stop);
    button.addEventListener('pointerleave', stop);
  });

  updatePreview();
  if (state.profile) launch();

  function updatePreview() {
    avatar.style.setProperty('--skin', skinInput.value);
    avatar.style.setProperty('--hair', hairInput.value);
    avatar.style.setProperty('--shirt', shirtInput.value);
    document.querySelector('#preview-name').textContent = nameInput.value || 'Deine Figur';
    document.querySelector('#preview-trait').textContent = traitTexts[traitInput.value];
  }

  function launch() {
    creator.classList.add('hidden');
    shell.classList.remove('hidden');
    renderHud();
    if (!game) game = createGame();
  }

  function load() {
    try {
      return Object.assign(structuredClone(initial), JSON.parse(localStorage.getItem(STORAGE) || 'null') || {});
    } catch {
      return structuredClone(initial);
    }
  }

  function persist() {
    localStorage.setItem(STORAGE, JSON.stringify(state));
    renderHud();
  }

  function clamp(value) { return Math.max(0, Math.min(100, Math.round(value * 10) / 10)); }

  function advance(minutes) {
    state.minutes += minutes;
    while (state.minutes >= 1440) { state.minutes -= 1440; state.day += 1; }
    const hours = minutes / 60;
    state.needs.energy = clamp(state.needs.energy - hours * 5);
    state.needs.hunger = clamp(state.needs.hunger + hours * 7);
    state.needs.thirst = clamp(state.needs.thirst + hours * 9);
    state.needs.bladder = clamp(state.needs.bladder + hours * 5 + state.needs.alcohol * .02);
    state.needs.alcohol = clamp(state.needs.alcohol - hours * 4);
    state.needs.highness = clamp(state.needs.highness - hours * 3);
    persist();
  }

  function useItem(item) {
    if (!state.inventory[item]) return;
    state.inventory[item] -= 1;
    if (item === 'wasser') { state.needs.thirst = clamp(state.needs.thirst - 30); state.needs.bladder = clamp(state.needs.bladder + 12); }
    if (item === 'wuerste') state.needs.hunger = clamp(state.needs.hunger - 35);
    if (item === 'bier') { state.needs.thirst = clamp(state.needs.thirst - 8); state.needs.bladder = clamp(state.needs.bladder + 20); state.needs.alcohol = clamp(state.needs.alcohol + 18); }
    if (item === 'batida') { state.needs.alcohol = clamp(state.needs.alcohol + 24); state.needs.bladder = clamp(state.needs.bladder + 10); }
    persist();
  }

  function renderHud() {
    if (!state.profile) return;
    const hour = Math.floor(state.minutes / 60) % 24;
    const minute = state.minutes % 60;
    const phase = hour < 6 ? 'Nacht' : hour < 12 ? 'Morgen' : hour < 18 ? 'Tag' : 'Abend';
    document.querySelector('#day-phase').textContent = `Tag ${state.day} · ${phase}`;
    document.querySelector('#clock').textContent = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    document.querySelector('#mode').textContent = state.mode === 'world' ? 'Top-down' : state.mode === 'battle' ? 'Rundenkampf' : 'Minispiel';
    document.querySelector('#world-controls').classList.toggle('hidden', state.mode !== 'world');
    document.querySelector('#needs').innerHTML = Object.entries(state.needs).map(([key, value]) => `<div class="need"><div class="need-head"><span>${labels[key]}</span><span>${Math.round(value)}</span></div><div class="track"><div class="fill" style="width:${value}%;background:${colors[key]}"></div></div></div>`).join('');
    const inventory = document.querySelector('#inventory');
    inventory.innerHTML = '';
    Object.entries(state.inventory).forEach(([item, count]) => {
      const button = document.createElement('button');
      button.className = 'chip';
      button.disabled = count <= 0;
      button.textContent = `${itemLabels[item] || item} × ${count}`;
      button.addEventListener('click', () => useItem(item));
      inventory.appendChild(button);
    });
    document.querySelector('#team-name').textContent = state.profile.name;
    document.querySelector('#team-list').textContent = state.team.length ? ` + ${state.team.map((member) => member.name).join(', ')}` : '· noch keine Begleiter';
  }

  function setMode(mode) { state.mode = mode; persist(); }

  function createGame() {
    class BootScene extends Phaser.Scene {
      constructor() { super('Boot'); }
      create() {
        makeCharacter(this, 'player', 0xf3c969, 0x24444a);
        makeCharacter(this, 'gundula', 0xe47d99, 0x5d294f);
        makeCharacter(this, 'uli', 0x7ab9d8, 0x263f67);
        makeCharacter(this, 'rival', 0xe4694f, 0x5c2018);
        const marker = this.make.graphics({ x: 0, y: 0, add: false });
        marker.fillStyle(0xffd75a, .95); marker.fillCircle(18, 18, 16); marker.lineStyle(3, 0xffffff, .8); marker.strokeCircle(18, 18, 16); marker.generateTexture('marker', 36, 36); marker.destroy();
        this.scene.start('World');
      }
    }

    class WorldScene extends Phaser.Scene {
      constructor() { super('World'); this.points = []; this.lastTick = 0; this.lastSave = 0; }
      create() {
        setMode('world');
        this.physics.world.setBounds(0, 0, 960, 640);
        this.cameras.main.setBounds(0, 0, 960, 640);
        drawMap(this);
        this.player = this.physics.add.sprite(state.position.x, state.position.y, 'player').setCollideWorldBounds(true).setDepth(20);
        this.cameras.main.startFollow(this.player, true, .12, .12); this.cameras.main.setZoom(1.08);
        this.cursors = this.input.keyboard?.createCursorKeys();
        this.keys = this.input.keyboard?.addKeys('W,A,S,D,E,SPACE');
        this.keys?.E.on('down', () => this.interact()); this.keys?.SPACE.on('down', () => this.interact());
        this.message = this.add.text(480, 595, 'Erkunde den Platz. Personen und gelbe Marker sind interaktiv.', { fontFamily: 'system-ui', fontSize: '17px', color: '#fff8dc', backgroundColor: '#14241fe6', padding: { x: 16, y: 10 }, align: 'center', wordWrap: { width: 700 } }).setOrigin(.5).setScrollFactor(0).setDepth(100);
        this.overlay = this.add.rectangle(480, 320, 960, 640, 0x10254a, 0).setScrollFactor(0).setDepth(80).setBlendMode(Phaser.BlendModes.MULTIPLY);
        this.time.addEvent({ delay: 1000, loop: true, callback: () => this.light() }); this.light();
      }
      update(time) {
        let x = 0, y = 0;
        if (this.cursors?.left.isDown || this.keys?.A.isDown || directions.has('left')) x--;
        if (this.cursors?.right.isDown || this.keys?.D.isDown || directions.has('right')) x++;
        if (this.cursors?.up.isDown || this.keys?.W.isDown || directions.has('up')) y--;
        if (this.cursors?.down.isDown || this.keys?.S.isDown || directions.has('down')) y++;
        const vector = new Phaser.Math.Vector2(x, y).normalize().scale(155);
        this.player.setVelocity(vector.x, vector.y); if (x) this.player.setFlipX(x < 0);
        if ((x || y) && time - this.lastSave > 500) { this.lastSave = time; state.position = { x: this.player.x, y: this.player.y }; persist(); }
        if (actionRequested) { actionRequested = false; this.interact(); }
        if (time - this.lastTick > 12000) { this.lastTick = time; advance(5); }
      }
      interact() {
        const nearest = this.points.map((point) => ({ point, distance: Phaser.Math.Distance.Between(this.player.x, this.player.y, point.x, point.y) })).filter((entry) => entry.distance <= entry.point.radius).sort((a, b) => a.distance - b.distance)[0];
        if (!nearest) return this.say('Hier gibt es gerade nichts zu tun.');
        nearest.point.action();
      }
      say(text) { this.message.setText(text); this.message.setAlpha(1); this.tweens.add({ targets: this.message, alpha: .82, duration: 2200, yoyo: true }); }
      light() {
        const hour = state.minutes / 60; let alpha = 0;
        if (hour >= 19) alpha = Math.min(.62, (hour - 19) * .12); if (hour < 6) alpha = .62; if (hour >= 6 && hour < 8) alpha = Math.max(0, .45 - (hour - 6) * .22);
        this.overlay.setAlpha(alpha);
      }
    }

    class BattleScene extends Phaser.Scene {
      constructor() { super('Battle'); }
      create() {
        setMode('battle'); this.enemy = 72; this.hero = 85; this.locked = false;
        const g = this.add.graphics(); g.fillGradientStyle(0x173044, 0x173044, 0x684a36, 0x684a36, 1); g.fillRect(0, 0, 960, 640);
        this.add.text(480, 48, 'CAMPING-DUELL', titleStyle()).setOrigin(.5);
        this.add.image(225, 250, 'player').setScale(3.2); this.add.image(735, 250, 'rival').setScale(3.2);
        this.add.text(225, 145, state.profile.name, nameStyle('#78cfa4')).setOrigin(.5); this.add.text(735, 145, 'Rivalen-Ronny', nameStyle('#ef8b72')).setOrigin(.5);
        this.heroBar = bar(this, 145, 365, 0x67d69a); this.enemyBar = bar(this, 655, 365, 0xef765f); this.bars();
        this.log = this.add.text(480, 430, 'Ronny blockiert den Weg zum Strand.', boxStyle()).setOrigin(.5);
        button(this, 220, 540, 'Trockener Konter', () => this.turn(false)); button(this, 480, 540, 'Stuhl-Blockade', () => this.turn(true)); button(this, 740, 540, 'Zurückziehen', () => this.back());
      }
      turn(guard) {
        if (this.locked) return; this.locked = true;
        const damage = Phaser.Math.Between(guard ? 8 : 15, guard ? 14 : 25); this.enemy = Math.max(0, this.enemy - damage); this.bars(); this.log.setText(`${guard ? 'Campingstuhl-Blockade' : 'Trockener Konter'}: ${damage} Fassungsschaden.`);
        if (!this.enemy) return this.time.delayedCall(700, () => this.win());
        this.time.delayedCall(850, () => { const hit = Phaser.Math.Between(guard ? 5 : 10, guard ? 10 : 18); this.hero = Math.max(0, this.hero - hit); this.bars(); this.log.setText(`Ronnys ungefragter Vortrag kostet dich ${hit} Fassung.`); this.locked = false; if (!this.hero) this.time.delayedCall(900, () => this.back()); });
      }
      bars() { this.heroBar.setScale(this.hero / 85, 1); this.enemyBar.setScale(this.enemy / 72, 1); }
      win() { if (!state.team.some((m) => m.id === 'ronny')) state.team.push({ id: 'ronny', name: 'Ronny' }); state.flags.firstBattleWon = true; advance(25); this.log.setText('Sieg. Ronny schließt sich deinem Team an.'); this.time.delayedCall(1600, () => this.back()); }
      back() { setMode('world'); this.scene.start('World'); }
    }

    class FlipCupScene extends Phaser.Scene {
      constructor() { super('FlipCup'); }
      create() {
        setMode('flip-cup'); this.phase = 'drink'; this.power = 0; this.direction = 1; this.attempts = 0;
        const g = this.add.graphics(); g.fillGradientStyle(0x173d36, 0x173d36, 0x6a412c, 0x6a412c, 1); g.fillRect(0, 0, 960, 640); g.fillStyle(0x8c5c35, 1); g.fillRoundedRect(90, 380, 780, 110, 18);
        this.add.text(480, 56, 'FLIP CUP', titleStyle()).setOrigin(.5); this.message = this.add.text(480, 120, 'Tippe, wenn der Marker im goldenen Bereich ist.', nameStyle('#fff1c1')).setOrigin(.5);
        this.add.rectangle(480, 205, 520, 32, 0x0e1715); this.add.rectangle(480, 205, 120, 28, 0xe4bd55); this.add.rectangle(480, 205, 54, 28, 0x79d59d); this.marker = this.add.rectangle(230, 205, 8, 44, 0xffffff);
        const cup = this.add.graphics(); cup.fillStyle(0xd94d45, 1); cup.fillRoundedRect(-30, -48, 60, 82, 8); cup.fillStyle(0xffffff, .9); cup.fillRect(-29, -35, 58, 8); this.cup = this.add.container(480, 340, [cup]);
        this.input.on('pointerdown', () => this.tap()); this.input.keyboard?.on('keydown-SPACE', () => this.tap());
      }
      update(_, delta) { if (this.phase === 'done') return; this.power += delta * (this.phase === 'drink' ? .22 : .17) * this.direction; if (this.power >= 100) { this.power = 100; this.direction = -1; } if (this.power <= 0) { this.power = 0; this.direction = 1; } this.marker.x = 230 + this.power * 5; }
      tap() {
        if (this.phase === 'done') return; const distance = Math.abs(this.power - 50);
        if (this.phase === 'drink') { if (distance <= 18) { this.phase = 'flip'; this.power = 0; this.message.setText('Gut geleert. Jetzt den Becher flippen.'); } else { this.attempts++; this.message.setText('Nicht sauber geleert. Noch einmal.'); this.check(); } return; }
        this.attempts++; if (distance <= 12) { this.phase = 'done'; this.tweens.add({ targets: this.cup, angle: 360, y: 300, duration: 550, onComplete: () => this.finish(true) }); } else { this.message.setText('Der Becher landet auf der Seite.'); this.check(); }
      }
      check() { if (this.attempts >= 3) { this.phase = 'done'; this.finish(false); } }
      finish(won) { state.flags[won ? 'flipCupWon' : 'flipCupTried'] = true; advance(15); this.message.setText(won ? 'Sauberer Flip. Du gewinnst die Runde.' : 'Drei Versuche vorbei. Respekt für den Einsatz.'); button(this, 480, 520, 'Zurück zum Platz', () => { setMode('world'); this.scene.start('World'); }); }
    }

    function makeCharacter(scene, key, shirt, trousers) { const g = scene.make.graphics({ x: 0, y: 0, add: false }); g.fillStyle(0xf3c8a8, 1); g.fillCircle(16, 9, 7); g.fillStyle(shirt, 1); g.fillRoundedRect(7, 15, 18, 17, 5); g.fillStyle(trousers, 1); g.fillRect(8, 29, 7, 12); g.fillRect(18, 29, 7, 12); g.generateTexture(key, 32, 42); g.destroy(); }
    function drawMap(scene) {
      const g = scene.add.graphics(); g.fillStyle(0x88b56b, 1); g.fillRect(0, 0, 960, 640); g.fillStyle(0xd5bd87, 1); g.fillRoundedRect(32, 270, 330, 180, 24); g.fillStyle(0x8f9692, 1); for (let i = 0; i < 5; i++) g.fillRoundedRect(58 + i * 58, 300, 46, 92, 8); text(scene, 54, 278, 'PARKPLATZ'); g.fillStyle(0xe4dfcf, 1); g.fillRoundedRect(396, 220, 170, 146, 18); text(scene, 424, 228, 'TOILETTEN'); g.fillStyle(0xc7835d, 1); g.fillRoundedRect(626, 236, 210, 150, 22); text(scene, 645, 245, 'GUNDULA & ULI'); g.fillStyle(0x779b62, 1); g.fillRoundedRect(300, 34, 380, 142, 24); text(scene, 410, 48, 'NÖRDLICHES LAGER'); g.fillStyle(0x6d9259, 1); g.fillRoundedRect(270, 420, 420, 136, 24); text(scene, 396, 432, 'SÜDLICHES LAGER'); g.fillStyle(0xe6d7a4, 1); g.fillRect(700, 440, 260, 58); g.fillStyle(0x4e94b4, 1); g.fillRect(700, 498, 260, 142); text(scene, 776, 454, 'STRAND & SEE');
      const gu = scene.add.image(682, 404, 'gundula').setDepth(15), uli = scene.add.image(742, 404, 'uli').setDepth(15); npcText(scene, 682, 368, 'Gundula'); npcText(scene, 742, 368, 'Uli');
      scene.points.push({ x: gu.x, y: gu.y, radius: 72, action: () => { if (state.flags.gundulaConvinced) return scene.say('Gundula: „Ich behalte dich trotzdem im Auge.“'); if (state.inventory.batida > 0) { state.flags.gundulaConvinced = true; persist(); scene.say('Batida de Coco erwähnt: Gundulas Einlasschance steigt deutlich.'); } else scene.say('Gundula verlangt eine glaubwürdige Erklärung.'); } });
      scene.points.push({ x: uli.x, y: uli.y, radius: 72, action: () => { state.flags.uliConvinced = true; persist(); scene.say('Uli gibt dir eine Parkplatzaufgabe. Einlasschance erhöht.'); } });
      activity(scene, 220, 238, 'KAMPF', () => { state.position = { x: scene.player.x, y: scene.player.y }; persist(); scene.scene.start('Battle'); }); activity(scene, 568, 492, 'FLIP CUP', () => { state.position = { x: scene.player.x, y: scene.player.y }; persist(); scene.scene.start('FlipCup'); });
    }
    function text(scene, x, y, value) { scene.add.text(x, y, value, { fontFamily: 'system-ui', fontSize: '18px', fontStyle: 'bold', color: '#173027' }).setDepth(2); }
    function npcText(scene, x, y, value) { scene.add.text(x, y, value, { fontFamily: 'system-ui', fontSize: '14px', fontStyle: 'bold', color: '#fff8dc', backgroundColor: '#173027cc', padding: { x: 6, y: 3 } }).setOrigin(.5).setDepth(16); }
    function activity(scene, x, y, value, action) { scene.add.image(x, y, 'marker').setDepth(12); npcText(scene, x, y + 27, value); scene.points.push({ x, y, radius: 60, action }); }
    function titleStyle() { return { fontFamily: 'system-ui', fontSize: '36px', fontStyle: 'bold', color: '#fff2c4' }; }
    function nameStyle(color) { return { fontFamily: 'system-ui', fontSize: '20px', fontStyle: 'bold', color }; }
    function boxStyle() { return { fontFamily: 'system-ui', fontSize: '18px', color: '#f8f2df', align: 'center', wordWrap: { width: 700 }, backgroundColor: '#101923dd', padding: { x: 18, y: 14 } }; }
    function bar(scene, x, y, color) { scene.add.rectangle(x + 80, y, 168, 26, 0x10161c); return scene.add.rectangle(x, y, 160, 18, color).setOrigin(0, .5); }
    function button(scene, x, y, label, action) { const b = scene.add.text(x, y, label, { fontFamily: 'system-ui', fontSize: '17px', fontStyle: 'bold', color: '#173027', backgroundColor: '#f4d47b', padding: { x: 18, y: 12 } }).setOrigin(.5).setInteractive({ useHandCursor: true }); b.on('pointerdown', action); return b; }

    return new Phaser.Game({ type: Phaser.AUTO, parent: 'game', width: 960, height: 640, backgroundColor: '#10241f', antialias: true, physics: { default: 'arcade', arcade: { gravity: { x: 0, y: 0 }, debug: false } }, scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH, width: 960, height: 640 }, scene: [BootScene, WorldScene, BattleScene, FlipCupScene] });
  }
})();
