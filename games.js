/* Ігровий хаб: Tic-Tac-Toe, Snake, Memory, 2048, RPS, Reaction, Simon, Mines, Guess */
(function (global) {
  const $ = (s) => document.querySelector(s);
  const t = (k, v) => global.I18n.t(k, v);
  const SFX = () => global.Audio2 && global.Audio2.SFX;
  let cleanupFn = null;
  let currentId = null;

  const GAMES = [
    { id: "ttt", ico: "\u{2B55}", name: "game.ttt", desc: "game.tttDesc", best: "high", unit: "rec.wins" },
    { id: "snake", ico: "\u{1F40D}", name: "game.snake", desc: "game.snakeDesc", best: "high", unit: "rec.points" },
    { id: "memory", ico: "\u{1F9E0}", name: "game.memory", desc: "game.memoryDesc", best: "low", unit: "rec.moves" },
    { id: "g2048", ico: "\u{1F522}", name: "game.g2048", desc: "game.g2048Desc", best: "high", unit: "rec.points" },
    { id: "rps", ico: "\u{270A}", name: "game.rps", desc: "game.rpsDesc", best: "high", unit: "rec.wins" },
    { id: "react", ico: "\u{26A1}", name: "game.react", desc: "game.reactDesc", best: "low", unit: "rec.ms" },
    { id: "simon", ico: "\u{1F3A8}", name: "game.simon", desc: "game.simonDesc", best: "high", unit: "rec.level" },
    { id: "mines", ico: "\u{1F4A3}", name: "game.mines", desc: "game.minesDesc", best: "low", unit: "rec.sec" },
    { id: "guess", ico: "\u{1F3AF}", name: "game.guess", desc: "game.guessDesc", best: "low", unit: "rec.tries" },
    { id: "hanoi", ico: "\u{1F5FC}", name: "game.hanoi", desc: "game.hanoiDesc", best: "low", unit: "rec.moves" },
    { id: "slide", ico: "\u{1F9E9}", name: "game.slide", desc: "game.slideDesc", best: "low", unit: "rec.moves" },
    { id: "maze", ico: "\u{1F300}", name: "game.maze", desc: "game.mazeDesc", best: "low", unit: "rec.sec" }
  ];

  const HOW_TO_PLAY = {
    uk: {
      ttt: "Ставиш хрестики, ШІ — нулики. Збери 3 в ряд, щоб виграти.",
      snake: "Керуй змією стрілками або WASD. Їж їжу, не врізайся в стіни та себе.",
      memory: "Перевертай картки по дві. Знайди всі пари за мінімум ходів.",
      g2048: "Зсувай плитки стрілками. Однакові числа зливаються. Збери 2048!",
      rps: "Обери камінь, ножиці або папір. Переможи комп'ютер.",
      react: "Чекай зеленого сигналу, потім клікни якнайшвидше.",
      simon: "Запам'ятай послідовність кольорів і повтори її.",
      mines: "Відкривай клітинки, уникай мін. Права кнопка — прапорець.",
      guess: "Вгадай число від 1 до 100 за мінімум спроб.",
      hanoi: "Перекладай диски один на одного, більший ніколи не клади на менший. Збери всю вежу на правому стрижні.",
      slide: "Клікни плитку поруч із пусткою — вона переставиться. Поверни всі числа по порядку.",
      maze: "Веди кульку до зеленого виходу стрілками, WASD або свайпом. Стіни рухати не можна."
    },
    en: {
      ttt: "Place X marks, AI plays O. Get 3 in a row to win.",
      snake: "Control the snake with arrows or WASD. Eat food, avoid walls and yourself.",
      memory: "Flip cards two at a time. Find all pairs in as few moves as possible.",
      g2048: "Slide tiles with arrows. Matching numbers merge. Reach 2048!",
      rps: "Choose rock, paper, or scissors. Beat the computer.",
      react: "Wait for the green signal, then click as fast as you can.",
      simon: "Memorize the color sequence and repeat it.",
      mines: "Open cells, avoid mines. Right-click to flag.",
      guess: "Guess the number from 1 to 100 in as few tries as possible.",
      hanoi: "Move disks one at a time and never place a bigger disk on a smaller one. Build the whole tower on the right peg.",
      slide: "Tap a tile next to the gap and it slides. Put every number back in order.",
      maze: "Guide the ball to the green exit with arrows, WASD or a swipe. Walls cannot be moved."
    },
    tr: {
      ttt: "X koy, AI O oynar. Kazanmak için 3 taneyi yan yana getir.",
      snake: "Yılanı oklar veya WASD ile kontrol et. Yem ye, duvarlara ve kendine çarpma.",
      memory: "Kartları ikişer ikişer çevir. Tüm çiftleri en az hamlede bul.",
      g2048: "Karoları oklarla kaydır. Aynı sayılar birleşir. 2048'e ulaş!",
      rps: "Taş, kağıt veya makas seç. Bilgisayarı yen.",
      react: "Yeşil sinyali bekle, sonra olabildiğince hızlı tıkla.",
      simon: "Renk sırasını ezberle ve tekrarla.",
      mines: "Hücreleri aç, mayınlardan kaçın. Sağ tık bayrak için.",
      guess: "1'den 100'e kadar sayıyı en az denemede tahmin et.",
      hanoi: "Diskleri tek tek taşı ve büyük diski küçüğün üstüne koyma. Tüm kuleyi sağ çubuğa kur.",
      slide: "Boşluğun yanındaki karoya dokun, karo kayar. Tüm sayıları sıraya diz.",
      maze: "Topu oklar, WASD veya kaydırma ile yeşil çıkışa götür. Duvarlar hareket etmez."
    }
  };

  function toast(msg) {
    const el = $("#toast");
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove("show"), 2200);
  }

  function saveRecord(id, value, better) {
    const r = global.Profile.setRecord(id, value, better);
    if (r.isNew && r.prev != null) toast(t("games.newRecord"));
    return r;
  }

  function stageShell(game) {
    const stage = $("#gameStage");
    stage.innerHTML = "";
    stage.classList.remove("hidden");
    $("#gamesHub").classList.add("hidden");

    const top = document.createElement("div");
    top.className = "game-top";
    const back = document.createElement("button");
    back.className = "btn text";
    back.textContent = t("games.back");
    back.onclick = () => { SFX() && SFX().click(); Games.close(); };
    const title = document.createElement("h3");
    title.className = "game-title";
    title.textContent = t(game.name);
    const score = document.createElement("span");
    score.className = "game-score";
    
    // Кнопка налаштувань
    const settingsBtn = document.createElement("button");
    settingsBtn.className = "icon-btn";
    settingsBtn.innerHTML = '<span class="material-icons">tune</span>';
    settingsBtn.title = t("game.settings") || "Settings";
    settingsBtn.onclick = () => showGameSettings(game.id);
    
    top.append(back, title, score, settingsBtn);

    const area = document.createElement("div");
    area.className = "game-area";
    stage.append(top, area);
    return { area, score };
  }

  /* Схема налаштувань кожної гри: ключ Settings, підпис і варіанти. */
  const GAME_OPTS = {
    ttt: [
      { key: "tttMode", label: "game.optMode", vals: [["ai", "game.optAi"], ["duo", "game.optDuo"]] },
      { key: "tttAi", label: "game.optAiLevel", vals: [["easy", "game.optEasy"], ["normal", "game.optNormal"], ["hard", "game.optHard"]] }
    ],
    snake: [
      { key: "snakeSpeed", label: "game.optSpeed", vals: [["slow", "game.optSlow"], ["normal", "game.optNormalF"], ["fast", "game.optFast"]] },
      { key: "snakeField", label: "game.optField", vals: [["14", "game.optSmall"], ["18", "game.optMedium"], ["24", "game.optBig"]] },
      { key: "snakeWrap", label: "game.optWalls", vals: [["off", "game.optWallsSolid"], ["on", "game.optWallsPortal"]] }
    ],
    memory: [
      { key: "memorySize", label: "game.optPairs", vals: [["4", "4"], ["6", "6"], ["8", "8"], ["10", "10"]] },
      { key: "memoryPeek", label: "game.optPeek", vals: [["0", "game.optOff"], ["2", "game.optPeek2"], ["4", "game.optPeek4"]] }
    ],
    g2048: [
      { key: "g2048Size", label: "game.optField", vals: [["4", "4 × 4"], ["5", "5 × 5"]] },
      { key: "g2048Start", label: "game.optStartTile", vals: [["2", "2"], ["4", "4"]] }
    ],
    rps: [
      { key: "rpsTarget", label: "game.optRpsTarget", vals: [["1", "1"], ["3", "3"], ["5", "5"], ["10", "10"]] }
    ],
    react: [
      { key: "reactRounds", label: "game.optRounds", vals: [["1", "1"], ["3", "3"], ["5", "5"]] }
    ],
    simon: [
      { key: "simonSpeed", label: "game.optSpeed", vals: [["slow", "game.optSlow"], ["normal", "game.optNormalF"], ["fast", "game.optFast"]] },
      { key: "simonStart", label: "game.optStartLen", vals: [["1", "1"], ["3", "3"], ["5", "5"]] }
    ],
    mines: [
      { key: "minesField", label: "game.optField", vals: [["9", "9 × 9"], ["12", "12 × 12"], ["16", "16 × 16"]] },
      { key: "minesCount", label: "game.optMines", vals: [["10", "10"], ["20", "20"], ["40", "40"]] }
    ],
    guess: [
      { key: "guessMax", label: "game.optMax", vals: [["50", "50"], ["100", "100"], ["200", "200"]] }
    ],
    hanoi: [
      { key: "hanoiDisks", label: "game.optDisks", vals: [["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"]] }
    ],
    slide: [
      { key: "slideSize", label: "game.optField", vals: [["3", "3 × 3"], ["4", "4 × 4"], ["5", "5 × 5"]] },
      { key: "slideShuffle", label: "game.optMix", vals: [["easy", "game.optLight"], ["normal", "game.optMedium"], ["hard", "game.optHeavy"]] }
    ],
    maze: [
      { key: "mazeSize", label: "game.optField", vals: [["9", "9 × 9"], ["13", "13 × 13"], ["17", "17 × 17"], ["21", "21 × 21"]] },
      { key: "mazeTrail", label: "game.optTrail", vals: [["on", "game.optOn"], ["off", "game.optOff"]] }
    ]
  };

  function opt(id, fallback) {
    const v = global.Settings ? global.Settings.get(id) : null;
    return v === null || v === undefined || v === "" ? fallback : v;
  }

  function showGameSettings(gameId) {
    const old = document.getElementById("gameSettingsModal");
    if (old) old.remove();
    if (SFX() && SFX().pop) SFX().pop();

    const bd = document.createElement("div");
    bd.id = "gameSettingsModal";
    bd.className = "gs-backdrop";

    const card = document.createElement("div");
    card.className = "gs-card";
    card.setAttribute("role", "dialog");
    card.setAttribute("aria-modal", "true");

    const h = document.createElement("h3");
    h.textContent = t("game.settings") || "Game Settings";
    card.appendChild(h);

    const body = document.createElement("div");
    body.className = "gs-body";

    const game = GAMES.find((g) => g.id === gameId);
    if (game) {
      const sub = document.createElement("div");
      sub.className = "gs-sub";
      sub.textContent = t(game.name) + " — " + t(game.desc);
      body.appendChild(sub);
    }

    (GAME_OPTS[gameId] || []).forEach((o) => {
      const label = document.createElement("label");
      label.className = "gs-label";
      label.textContent = t(o.label);
      body.appendChild(label);

      const select = document.createElement("select");
      select.className = "md-select";
      const current = String(opt(o.key, o.vals[0][0]));
      o.vals.forEach(([v, key]) => {
        const el = document.createElement("option");
        el.value = v;
        el.textContent = /^[a-z]+\./.test(key) ? t(key) : key;
        if (v === current) el.selected = true;
        select.appendChild(el);
      });
      select.onchange = () => {
        global.Settings.set(o.key, select.value);
        toast(t("set.saved"));
        if (global.Games.restartIfOpen) global.Games.restartIfOpen(gameId);
      };
      body.appendChild(select);
    });

    if (!(GAME_OPTS[gameId] || []).length) {
      const p = document.createElement("div");
      p.className = "gs-sub";
      p.textContent = t("game.noOpts");
      body.appendChild(p);
    }

    card.appendChild(body);

    const closeBtn = document.createElement("button");
    closeBtn.className = "btn contained";
    closeBtn.textContent = t("games.back") || "Close";
    closeBtn.onclick = () => { bd.classList.add("gs-out"); setTimeout(() => bd.remove(), 180); };
    card.appendChild(closeBtn);

    bd.appendChild(card);
    bd.onclick = (e) => { if (e.target === bd) { bd.classList.add("gs-out"); setTimeout(() => bd.remove(), 180); } };
    document.body.appendChild(bd);
    if (global.UI) global.UI.enhance(card);
  }


  function setScore(el, label, value) {
    el.textContent = label + ": " + value;
  }

  /* ---------------- Tic-Tac-Toe (з ШІ середньої складності) ---------------- */
  function mountTTT(area, score) {
    let board = Array(9).fill(null), over = false, wins = 0, turn = "X";
    const duo = opt("tttMode", "ai") === "duo";
    const smart = { easy: 0, normal: 0.5, hard: 1 }[opt("tttAi", "normal")] ?? 0.5;
    setScore(score, t("games.score"), wins);
    const grid = document.createElement("div");
    grid.className = "ttt";
    area.appendChild(grid);
    const cells = [];
    for (let i = 0; i < 9; i++) {
      const b = document.createElement("button");
      b.onclick = () => play(i);
      grid.appendChild(b); cells.push(b);
    }
    const status = document.createElement("div");
    status.className = "game-score";
    area.appendChild(status);

    const LINES = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    function winner(b){ for(const [x,y,z] of LINES){ if(b[x]&&b[x]===b[y]&&b[x]===b[z]) return b[x]; } return b.includes(null)?null:"draw"; }
    function render(){ cells.forEach((c,i)=>{ c.textContent = board[i]==="X"?"X":board[i]==="O"?"O":""; c.style.color = board[i]==="X"?"var(--accent)":"var(--primary)"; }); }
    function play(i){
      if(over||board[i]) return;
      board[i]=turn; render(); SFX()&&SFX().pop();
      let w=winner(board);
      if(w) return finish(w);
      if (duo) { turn = turn === "X" ? "O" : "X"; status.textContent = t("games.turn", { n: turn }); return; }
      turn = "X";
      const mv=aiMove(); if(mv!=null){ board[mv]="O"; render(); }
      w=winner(board); if(w) finish(w);
    }
    // ШІ: частка «розумних» ходів залежить від складності
    function aiMove(){
      if(Math.random() < smart) return bestMove();
      return randomMove();
    }
    function randomMove(){
      const empty=[]; for(let i=0;i<9;i++) if(!board[i]) empty.push(i);
      return empty.length ? empty[(Math.random()*empty.length)|0] : null;
    }
    function bestMove(){
      let best=-Infinity,move=null;
      for(let i=0;i<9;i++){ if(!board[i]){ board[i]="O"; const s=minimax(board,false); board[i]=null; if(s>best){best=s;move=i;} } }
      return move;
    }
    function minimax(b,max){
      const w=winner(b);
      if(w==="O")return 1; if(w==="X")return -1; if(w==="draw")return 0;
      let best=max?-Infinity:Infinity;
      for(let i=0;i<9;i++){ if(!b[i]){ b[i]=max?"O":"X"; const s=minimax(b,!max); b[i]=null; best=max?Math.max(best,s):Math.min(best,s);} }
      return best;
    }
    function finish(w){
      over=true;
      if(w==="X"){ wins++; setScore(score,t("games.score"),wins); status.textContent= duo ? t("games.p1Win") : t("games.youWin"); SFX()&&SFX().win(); saveRecord("ttt",wins,"high"); }
      else if(w==="O"){ status.textContent= duo ? t("games.p2Win") : t("games.youLose"); SFX()&&SFX().lose(); }
      else { status.textContent=t("games.draw"); SFX()&&SFX().pop(); }
      setTimeout(reset,1400);
    }
    function reset(){ board=Array(9).fill(null); over=false; turn="X"; status.textContent=""; render(); }
    render();
    return null;
  }

  /* ---------------- Snake ---------------- */
  function mountSnake(area, score) {
    const N=Math.max(10, Number(opt("snakeField", 18)) || 18), size=N>20?16:20;
    const wrap=opt("snakeWrap", "off") === "on";
    const home=()=>({x:(N/2)|0,y:(N/2)|0});
    const cv=document.createElement("canvas");
    cv.id="snakeCanvas"; cv.width=N*size; cv.height=N*size;
    area.appendChild(cv);
    const ctx=cv.getContext("2d");
    let snake=[home()], dir={x:1,y:0}, next=dir, food=place(), pts=0, dead=false, timer=null, closed=false;
    setScore(score,t("games.score"),0);
    function place(){ let p; do{ p={x:(Math.random()*N)|0,y:(Math.random()*N)|0}; }while(snake.some(s=>s.x===p.x&&s.y===p.y)); return p; }
    function draw(){
      ctx.fillStyle="#070b18"; ctx.fillRect(0,0,cv.width,cv.height);
      ctx.fillStyle="#ff5b7a"; ctx.beginPath(); ctx.arc(food.x*size+size/2,food.y*size+size/2,size/2-2,0,7); ctx.fill();
      snake.forEach((s,i)=>{ ctx.fillStyle=i===0?"#22d3ee":"#5b8cff"; ctx.fillRect(s.x*size+1,s.y*size+1,size-2,size-2); });
    }
    function step(){
      if(closed) return;
      dir=next; let h={x:snake[0].x+dir.x,y:snake[0].y+dir.y};
      if(wrap){ h.x=(h.x+N)%N; h.y=(h.y+N)%N; }
      else if(h.x<0||h.y<0||h.x>=N||h.y>=N){ return gameOver(); }
      if(snake.some(s=>s.x===h.x&&s.y===h.y)) return gameOver();
      snake.unshift(h);
      if(h.x===food.x&&h.y===food.y){ pts++; setScore(score,t("games.score"),pts); SFX()&&SFX().coin(); food=place(); }
      else snake.pop();
      draw();
    }
    function gameOver(){ dead=true; clearInterval(timer); timer=null; SFX()&&SFX().lose(); saveRecord("snake",pts,"high"); draw(); ctx.fillStyle="#000a"; ctx.fillRect(0,0,cv.width,cv.height); ctx.fillStyle="#fff"; ctx.font="20px sans-serif"; ctx.textAlign="center"; ctx.fillText(t("games.over"),cv.width/2,cv.height/2); if(!closed) setTimeout(start,1600); }
    function start(){ if(closed) return; snake=[home()]; dir={x:1,y:0}; next=dir; food=place(); pts=0; dead=false; setScore(score,t("games.score"),0); clearInterval(timer); const sp={slow:160,normal:110,fast:70}[opt("snakeSpeed","normal")]||110; timer=setInterval(step,sp); draw(); }
    function setDir(x,y){ if(snake.length>1&&(x===-dir.x&&y===-dir.y))return; next={x,y}; }
    const key=(e)=>{ const k=e.key; if(k==="ArrowUp"||k==="w"){setDir(0,-1);e.preventDefault();} else if(k==="ArrowDown"||k==="s"){setDir(0,1);e.preventDefault();} else if(k==="ArrowLeft"||k==="a"){setDir(-1,0);e.preventDefault();} else if(k==="ArrowRight"||k==="d"){setDir(1,0);e.preventDefault();} };
    window.addEventListener("keydown",key);
    // touch dpad
    const dp=document.createElement("div"); dp.className="dpad";
    dp.innerHTML='<span></span><button data-d="up">\u{25B2}</button><span></span><button data-d="left">\u{25C0}</button><span></span><button data-d="right">\u{25B6}</button><span></span><button data-d="down">\u{25BC}</button><span></span>';
    area.appendChild(dp);
    dp.querySelectorAll("button").forEach(b=>b.onclick=()=>{const d=b.dataset.d; if(d==="up")setDir(0,-1); if(d==="down")setDir(0,1); if(d==="left")setDir(-1,0); if(d==="right")setDir(1,0);});
    start();
    return ()=>{ closed=true; clearInterval(timer); timer=null; window.removeEventListener("keydown",key); };
  }

  /* ---------------- Memory ---------------- */
  function mountMemory(area, score) {
    const pairs=Math.min(10,Math.max(4,Number(opt("memorySize", 8))||8));
    const emojis=["\u{1F34E}","\u{1F680}","\u{1F431}","\u{1F31F}","\u{1F3B5}","\u{1F355}","\u{26BD}","\u{1F388}","\u{1F353}","\u{1F3AA}"];
    const set=emojis.slice(0,pairs);
    let deck=[...set,...set].sort(()=>Math.random()-0.5);
    const grid=document.createElement("div"); grid.className="mem"; area.appendChild(grid);
    let first=null,lock=false,moves=0,done=0;
    setScore(score,t("games.score"),0);
    deck.forEach((emo,i)=>{
      const c=document.createElement("div"); c.className="mcard"; c.dataset.emo=emo; c.dataset.i=i;
      c.onclick=()=>flip(c); grid.appendChild(c);
    });
    const peek=Math.max(0, Number(opt("memoryPeek", 0)) || 0);
    if (peek) {
      lock = true;
      const all=[...grid.children];
      all.forEach(c=>{ c.textContent=c.dataset.emo; c.classList.add("flip"); });
      setTimeout(()=>{ all.forEach(c=>{ c.classList.remove("flip"); c.textContent=""; }); lock=false; }, peek*1000);
      return ()=>{};
    }
    function flip(c){
      if(lock||c.classList.contains("flip")||c.classList.contains("done"))return;
      c.textContent=c.dataset.emo; c.classList.add("flip"); SFX()&&SFX().pop();
      if(!first){ first=c; return; }
      moves++; setScore(score,t("games.score"),moves);
      if(first.dataset.emo===c.dataset.emo){ first.classList.add("done"); c.classList.add("done"); first=null; done++; SFX()&&SFX().coin(); if(done===set.length) win(); }
      else { lock=true; const a=first,b=c; first=null; setTimeout(()=>{a.classList.remove("flip");b.classList.remove("flip");a.textContent="";b.textContent="";lock=false;},700); }
    }
    function win(){ SFX()&&SFX().win(); saveRecord("memory",moves,"low"); toast(t("games.youWin")); setTimeout(()=>Games.open("memory"),1600); }
    return null;
  }

  /* ---------------- 2048 ---------------- */
  function mount2048(area, score) {
    const SZ=Math.min(6,Math.max(4,Number(opt("g2048Size", 4))||4));
    const START=opt("g2048Start","2")==="4"?4:2;
    area.style.setProperty("--g2048-n", SZ);
    area.style.setProperty("--g2048-cell", (SZ > 4 ? 60 : 74) + "px");
    let g=Array.from({length:SZ},()=>Array(SZ).fill(0)), pts=0;
    const grid=document.createElement("div"); grid.className="g2048"; area.appendChild(grid);
    const cells=[];
    for(let i=0;i<SZ*SZ;i++){ const c=document.createElement("div"); c.className="cell"; grid.appendChild(c); cells.push(c); }
    setScore(score,t("games.score"),0);
    const info=document.createElement("div"); info.className="game-score"; area.appendChild(info);
    function add(){ const e=[]; g.forEach((r,y)=>r.forEach((v,x)=>{if(!v)e.push([x,y]);})); if(e.length){const[x,y]=e[(Math.random()*e.length)|0]; g[y][x]=Math.random()<0.9?START:START*2;} }
    const COLORS={0:"#1b2547",2:"#2a3660",4:"#33417a",8:"#3f56a0",16:"#4b67c0",32:"#5b8cff",64:"#7c5bff",128:"#22d3ee",256:"#3ddc97",512:"#f0b429",1024:"#ff8c42",2048:"#ff5b7a"};
    function draw(){ g.forEach((r,y)=>r.forEach((v,x)=>{ const c=cells[y*SZ+x]; c.textContent=v||""; c.style.background=COLORS[v]||"#ff5b7a"; })); setScore(score,t("games.score"),pts); }
    function slide(row){ let a=row.filter(v=>v); for(let i=0;i<a.length-1;i++){ if(a[i]===a[i+1]){a[i]*=2;pts+=a[i];a.splice(i+1,1);} } while(a.length<SZ)a.push(0); return a; }
    function move(dir){
      const before=JSON.stringify(g);
      if(dir==="left") g=g.map(slide);
      else if(dir==="right") g=g.map(r=>slide(r.slice().reverse()).reverse());
      else if(dir==="up"){ for(let x=0;x<SZ;x++){ let col=slide(g.map((_,y)=>g[y][x])); for(let y=0;y<SZ;y++)g[y][x]=col[y]; } }
      else if(dir==="down"){ for(let x=0;x<SZ;x++){ let col=slide(g.map((_,y)=>g[y][x]).reverse()); for(let y=0;y<SZ;y++)g[SZ-1-y][x]=col[y]; } }
      if(JSON.stringify(g)!==before){ add(); SFX()&&SFX().pop(); draw(); if(!canMove()) end(); }
    }
    function canMove(){ for(let y=0;y<SZ;y++)for(let x=0;x<SZ;x++){ if(!g[y][x])return true; if(x<SZ-1&&g[y][x]===g[y][x+1])return true; if(y<SZ-1&&g[y][x]===g[y+1][x])return true; } return false; }
    function end(){ SFX()&&SFX().lose(); saveRecord("g2048",pts,"high"); info.textContent=t("games.over"); setTimeout(()=>{info.textContent="";init();},1600); }
    function init(){ g=Array.from({length:SZ},()=>Array(SZ).fill(0)); pts=0; add(); add(); draw(); }
    const key=(e)=>{ const m={ArrowLeft:"left",ArrowRight:"right",ArrowUp:"up",ArrowDown:"down"}[e.key]; if(m){e.preventDefault();move(m);} };
    window.addEventListener("keydown",key);
    // swipe
    let sx=0,sy=0;
    area.addEventListener("touchstart",e=>{sx=e.touches[0].clientX;sy=e.touches[0].clientY;},{passive:true});
    area.addEventListener("touchend",e=>{const dx=e.changedTouches[0].clientX-sx,dy=e.changedTouches[0].clientY-sy; if(Math.abs(dx)>Math.abs(dy))move(dx>0?"right":"left"); else move(dy>0?"down":"up");},{passive:true});
    init();
    return ()=>window.removeEventListener("keydown",key);
  }

  /* ---------------- Rock Paper Scissors ---------------- */
  function mountRPS(area, score) {
    const target = Math.max(1, Number(opt("rpsTarget", 1)) || 1);
    let wins = 0, losses = 0, match = false;
    setScore(score, t("games.score"), 0);
    const row=document.createElement("div"); row.className="rps"; area.appendChild(row);
    const res=document.createElement("div"); res.className="game-score"; res.style.fontSize="18px"; area.appendChild(res);
    const map={rock:"\u{270A}",paper:"\u{270B}",scissors:"\u{270C}\u{FE0F}"};
    ["rock","paper","scissors"].forEach(k=>{ const b=document.createElement("button"); b.textContent=map[k]; b.onclick=()=>play(k); row.appendChild(b); });
    function beats(a,b){ return (a==="rock"&&b==="scissors")||(a==="paper"&&b==="rock")||(a==="scissors"&&b==="paper"); }
    function play(u){
      if (match) return;
      const keys=Object.keys(map); const c=keys[(Math.random()*3)|0];
      let msg;
      if(u===c){ msg=t("games.draw"); SFX()&&SFX().pop(); }
      else if(beats(u,c)){ wins++; setScore(score,t("games.score"),wins); msg=t("games.youWin"); SFX()&&SFX().win(); saveRecord("rps",wins,"high"); }
      else { losses++; msg=t("games.youLose"); SFX()&&SFX().lose(); }
      if (target > 1 && (wins >= target || losses >= target)) {
        match = true;
        msg = wins >= target ? t("games.matchWin") : t("games.matchLose");
        setTimeout(() => { wins = 0; losses = 0; match = false; setScore(score, t("games.score"), 0); res.textContent = ""; }, 1800);
      }
      res.textContent = `${map[u]} vs ${map[c]} — ${msg}` + (target > 1 && !match ? ` (${wins}:${losses})` : "");
    }
    return null;
  }

  /* ---------------- Reaction ---------------- */
  function mountReact(area, score) {
    const rounds = Math.max(1, Number(opt("reactRounds", 1)) || 1);
    const box=document.createElement("div"); box.className="react-box"; box.textContent=t("react.tapStart"); area.appendChild(box);
    setScore(score,t("games.best"), (global.Profile.getRecord("react")||"—")+" ms");
    let state="idle", t0=0, to=null, hits=[], sum=0;
    box.onclick=()=>{
      if(state==="idle"){ state="wait"; box.className="react-box wait"; box.textContent=t("react.wait"); to=setTimeout(()=>{ state="go"; box.className="react-box go"; box.textContent=t("react.go"); t0=performance.now(); }, 800+Math.random()*2200); }
      else if(state==="wait"){ clearTimeout(to); state="idle"; box.className="react-box"; box.textContent=t("react.tooSoon"); SFX()&&SFX().error(); }
      else if(state==="go"){
        const ms=Math.round(performance.now()-t0); state="idle"; box.className="react-box";
        SFX()&&SFX().success();
        const r=saveRecord("react",ms,"low");
        hits.push(ms); sum+=ms;
        if (hits.length >= rounds) {
          const avg = Math.round(sum / hits.length);
          box.textContent = t("react.avg", { n: hits.length, ms: avg }) + (r.isNew ? " \u{2B50}" : "");
          hits = []; sum = 0;
        } else {
          box.textContent = t("react.result", { ms }) + (r.isNew ? " \u{2B50}" : "") + ` (${hits.length}/${rounds})`;
        }
        setScore(score,t("games.best"),Math.min(ms, global.Profile.getRecord("react")||ms)+" ms");
      }
    };
    return ()=>clearTimeout(to);
  }

  /* ---------------- Simon Says ---------------- */
  function mountSimon(area, score) {
    const COLORS = ["#ff5b7a", "#22d3ee", "#3ddc97", "#f0b429"];
    const TEMPO = { slow: 1.6, normal: 1, fast: 0.6 }[opt("simonSpeed", "normal")] || 1;
    const GAP = Math.round(450 * TEMPO), FLASH = Math.round(300 * TEMPO), START = Math.max(1, Number(opt("simonStart", 1)) || 1);
    let seq = [], idx = 0, accepting = false, level = 0;
    const wrap = document.createElement("div");
    wrap.className = "simon";
    const pads = COLORS.map((c, i) => {
      const b = document.createElement("button");
      b.style.background = c;
      b.onclick = () => press(i);
      wrap.appendChild(b);
      return b;
    });
    area.appendChild(wrap);
    const status = document.createElement("div");
    status.className = "game-score";
    area.appendChild(status);
    setScore(score, t("games.score"), 0);
    function flash(i, ms) { pads[i].classList.add("lit"); setTimeout(() => pads[i].classList.remove("lit"), ms || FLASH); SFX() && SFX().pop(); }
    function playSeq() {
      accepting = false; status.textContent = t("simon.watch");
      seq.forEach((v, n) => setTimeout(() => flash(v), 500 + n * 450));
      setTimeout(() => { accepting = true; idx = 0; status.textContent = t("simon.your"); }, 500 + seq.length * 450);
    }
    function next() { level++; setScore(score, t("games.score"), level); seq.push((Math.random() * 4) | 0); while (seq.length < START) seq.push((Math.random() * 4) | 0); playSeq(); }
    function press(i) {
      if (!accepting) return;
      flash(i, 180);
      if (i === seq[idx]) {
        idx++;
        if (idx === seq.length) { accepting = false; saveRecord("simon", level, "high"); setTimeout(next, 700); }
      } else {
        accepting = false; status.textContent = t("games.over"); SFX() && SFX().lose();
        saveRecord("simon", level, "high");
        setTimeout(() => { seq = []; level = 0; setScore(score, t("games.score"), 0); next(); }, 1600);
      }
    }
    next();
    return null;
  }

  /* ---------------- Minesweeper ---------------- */
  function mountMines(area, score) {
    const N = Math.min(16, Math.max(9, Number(opt("minesField", 9)) || 9));
    const M = Math.min(N * N - 9, Math.max(5, Number(opt("minesCount", 10)) || 10));
    area.style.setProperty("--mines-n", N);
    area.style.setProperty("--mines-cell", (N > 12 ? 26 : N > 9 ? 30 : 34) + "px");
    let grid, revealed, flags, over, started, t0, timerInt, left;
    const wrap = document.createElement("div"); wrap.className = "mines";
    area.appendChild(wrap);
    const info = document.createElement("div"); info.className = "game-score"; area.appendChild(info);
    const cells = [];
    function init() {
      grid = Array.from({ length: N }, () => Array(N).fill(0));
      revealed = Array.from({ length: N }, () => Array(N).fill(false));
      flags = Array.from({ length: N }, () => Array(N).fill(false));
      over = false; started = false; left = N * N - M; t0 = 0;
      clearInterval(timerInt);
      setScore(score, t("games.score"), 0);
      info.textContent = t("mines.flags") + ": " + M;
      wrap.innerHTML = ""; cells.length = 0;
      for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
        const b = document.createElement("button");
        b.onclick = () => open(x, y);
        b.oncontextmenu = (e) => { e.preventDefault(); flag(x, y); };
        wrap.appendChild(b); cells.push(b);
      }
    }
    function place(sx, sy) {
      let placed = 0;
      while (placed < M) {
        const x = (Math.random() * N) | 0, y = (Math.random() * N) | 0;
        if (grid[y][x] === -1 || (Math.abs(x - sx) <= 1 && Math.abs(y - sy) <= 1)) continue;
        grid[y][x] = -1; placed++;
      }
      for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
        if (grid[y][x] === -1) continue;
        let c = 0;
        for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
          const ny = y + dy, nx = x + dx;
          if (ny >= 0 && nx >= 0 && ny < N && nx < N && grid[ny][nx] === -1) c++;
        }
        grid[y][x] = c;
      }
    }
    function draw(x, y) {
      const b = cells[y * N + x];
      if (flags[y][x]) { b.textContent = "\u{1F6A9}"; b.className = "fl"; return; }
      if (!revealed[y][x]) { b.textContent = ""; b.className = ""; return; }
      const v = grid[y][x];
      b.textContent = v === -1 ? "\u{1F4A3}" : (v || "");
      b.className = "op" + (v > 0 ? " n" + Math.min(v, 3) : "");
    }
    function open(x, y) {
      if (over || flags[y][x] || revealed[y][x]) return;
      if (!started) { started = true; place(x, y); t0 = Date.now(); timerInt = setInterval(() => setScore(score, t("games.score"), Math.floor((Date.now() - t0) / 1000)), 500); }
      if (grid[y][x] === -1) return lose();
      const stack = [[x, y]];
      while (stack.length) {
        const c = stack.pop(); const cx = c[0], cy = c[1];
        if (cx < 0 || cy < 0 || cx >= N || cy >= N || revealed[cy][cx] || flags[cy][cx]) continue;
        revealed[cy][cx] = true; left--; draw(cx, cy);
        if (grid[cy][cx] === 0) for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) stack.push([cx + dx, cy + dy]);
      }
      SFX() && SFX().pop();
      if (left === 0) win();
    }
    function flag(x, y) {
      if (over || revealed[y][x]) return;
      flags[y][x] = !flags[y][x];
      let f = 0; flags.forEach((r) => r.forEach((v) => { if (v) f++; }));
      info.textContent = t("mines.flags") + ": " + (M - f);
      draw(x, y); SFX() && SFX().click();
    }
    function lose() {
      over = true; clearInterval(timerInt); SFX() && SFX().lose();
      for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) if (grid[y][x] === -1) { revealed[y][x] = true; draw(x, y); }
      setTimeout(init, 1800);
    }
    function win() {
      over = true; clearInterval(timerInt);
      const sec = Math.floor((Date.now() - t0) / 1000);
      SFX() && SFX().win(); saveRecord("mines", sec, "low"); toast(t("games.youWin"));
      setTimeout(init, 1800);
    }
    init();
    return () => clearInterval(timerInt);
  }

  /* ---------------- Guess the number ---------------- */
  function mountGuess(area, score) {
    const MAX = Math.min(500, Math.max(10, Number(opt("guessMax", 100)) || 100));
    let target = 1 + ((Math.random() * MAX) | 0), tries = 0;
    const row = document.createElement("div"); row.className = "guess";
    const inp = document.createElement("input"); inp.type = "number"; inp.min = "1"; inp.max = String(MAX); inp.placeholder = "1-" + MAX;
    const btn = document.createElement("button"); btn.className = "btn contained"; btn.textContent = t("games.play");
    row.append(inp, btn); area.appendChild(row);
    const res = document.createElement("div"); res.className = "game-score"; res.style.fontSize = "18px"; area.appendChild(res);
    setScore(score, t("games.score"), 0);
    function check() {
      const v = Number(inp.value);
      if (!v || v < 1 || v > MAX) return;
      tries++; setScore(score, t("games.score"), tries);
      if (v === target) {
        res.textContent = t("games.youWin") + " " + target;
        SFX() && SFX().win(); saveRecord("guess", tries, "low");
        target = 1 + ((Math.random() * MAX) | 0); tries = 0; inp.value = "";
        setTimeout(() => { res.textContent = ""; setScore(score, t("games.score"), 0); }, 1800);
      } else {
        res.textContent = v < target ? t("guess.higher") : t("guess.lower");
        SFX() && SFX().pop();
      }
      inp.focus();
    }
    btn.onclick = check;
    inp.onkeydown = (e) => { if (e.key === "Enter") check(); };
    return null;
  }

  /* ---------------- Ханойська вежа ---------------- */
  function mountHanoi(area, score) {
    const N = Math.min(8, Math.max(3, Number(opt("hanoiDisks", 4)) || 4));
    const OPT = Math.pow(2, N) - 1;
    let pegs = [[], [], []], picked = -1, moves = 0, over = false;
    const wrap = document.createElement("div"); wrap.className = "hanoi"; area.appendChild(wrap);
    const info = document.createElement("div"); info.className = "game-score"; area.appendChild(info);
    const stacks = [];
    for (let i = 0; i < 3; i++) {
      const col = document.createElement("div"); col.className = "hpeg";
      const rod = document.createElement("span"); rod.className = "hrod";
      const stack = document.createElement("div"); stack.className = "hstack";
      col.appendChild(rod); col.appendChild(stack);
      col.onclick = () => tap(i);
      wrap.appendChild(col); stacks.push(col);
    }
    function draw() {
      stacks.forEach((col, i) => {
        const top = pegs[i].length ? pegs[i][pegs[i].length - 1] : null;
        col.classList.toggle("hsel", picked === i);
        const stack = col.lastChild; stack.innerHTML = "";
        pegs[i].forEach((d) => {
          const b = document.createElement("div");
          b.className = "hdisk" + (picked === i && d === top ? " hpick" : "");
          b.style.width = (28 + d * (150 / N)) + "px";
          b.textContent = d;
          stack.appendChild(b);
        });
      });
    }
    function reset() {
      pegs = [Array.from({ length: N }, (_, k) => N - k), [], []];
      picked = -1; moves = 0; over = false;
      setScore(score, t("games.score"), 0);
      info.textContent = t("hanoi.goal", { n: OPT });
      draw();
    }
    function tap(i) {
      if (over) return;
      if (picked === -1) { if (!pegs[i].length) return; picked = i; }
      else if (picked === i) { picked = -1; }
      else {
        const d = pegs[picked][pegs[picked].length - 1];
        if (pegs[i].length && pegs[i][pegs[i].length - 1] < d) { SFX() && SFX().lose(); picked = -1; }
        else {
          pegs[i].push(pegs[picked].pop()); picked = -1; moves++;
          setScore(score, t("games.score"), moves); SFX() && SFX().pop();
          if (pegs[2].length === N) return finish();
        }
      }
      SFX() && SFX().click(); draw();
    }
    function finish() {
      over = true; SFX() && SFX().win(); draw();
      info.textContent = t("hanoi.done", { n: moves, best: OPT });
      saveRecord("hanoi", moves, "low");
      setTimeout(reset, 2800);
    }
    reset();
    return null;
  }

  /* ---------------- П'ятнашки ---------------- */
  function mountSlide(area, score) {
    const SZ = Math.min(5, Math.max(3, Number(opt("slideSize", 4)) || 4));
    const MIX = { easy: 20, normal: 120, hard: 400 }[opt("slideShuffle", "normal")] || 120;
    const TOTAL = SZ * SZ;
    area.style.setProperty("--slide-n", SZ);
    area.style.setProperty("--slide-cell", (SZ > 4 ? 58 : SZ > 3 ? 74 : 92) + "px");
    let tiles = [], blank = 0, moves = 0, over = false;
    const grid = document.createElement("div"); grid.className = "slide"; area.appendChild(grid);
    const status = document.createElement("div"); status.className = "game-score"; area.appendChild(status);
    function near(i) {
      const y = (i / SZ) | 0, x = i % SZ, out = [];
      if (y > 0) out.push(i - SZ);
      if (y < SZ - 1) out.push(i + SZ);
      if (x > 0) out.push(i - 1);
      if (x < SZ - 1) out.push(i + 1);
      return out;
    }
    function render() {
      grid.innerHTML = "";
      tiles.forEach((v, i) => {
        const b = document.createElement("button");
        if (!v) b.className = "empty"; else b.textContent = v;
        b.onclick = () => tap(i);
        grid.appendChild(b);
      });
    }
    function reset() {
      tiles = Array.from({ length: TOTAL }, (_, i) => (i + 1) % TOTAL);
      blank = TOTAL - 1; moves = 0; over = false;
      let prev = -1;
      for (let k = 0; k < MIX; k++) {
        const opts = near(blank).filter((p) => p !== prev);
        const p = opts[(Math.random() * opts.length) | 0];
        prev = blank; tiles[blank] = tiles[p]; tiles[p] = 0; blank = p;
      }
      setScore(score, t("games.score"), 0);
      status.textContent = t("slide.goal");
      render();
    }
    function solved() { for (let i = 0; i < TOTAL - 1; i++) if (tiles[i] !== i + 1) return false; return true; }
    function finish() {
      over = true; SFX() && SFX().win();
      status.textContent = t("slide.done", { n: moves });
      saveRecord("slide", moves, "low");
      setTimeout(reset, 2800);
    }
    function tap(i) {
      if (over || i === blank || near(blank).indexOf(i) < 0) return;
      tiles[blank] = tiles[i]; tiles[i] = 0; blank = i; moves++;
      setScore(score, t("games.score"), moves); SFX() && SFX().pop();
      render();
      if (solved()) finish();
    }
    function slideFrom(dx, dy) {
      const y = (blank / SZ) | 0, x = blank % SZ;
      const sy = y + dy, sx = x + dx;
      if (sy < 0 || sx < 0 || sy >= SZ || sx >= SZ) return;
      tap(sy * SZ + sx);
    }
    const key = (e) => {
      const k = e.key;
      if (k === "ArrowUp") slideFrom(0, 1);
      else if (k === "ArrowDown") slideFrom(0, -1);
      else if (k === "ArrowLeft") slideFrom(1, 0);
      else if (k === "ArrowRight") slideFrom(-1, 0);
      else return;
      e.preventDefault();
    };
    window.addEventListener("keydown", key);
    const dp = document.createElement("div"); dp.className = "dpad";
    dp.innerHTML = '<span></span><button data-d="up">\u{25B2}</button><span></span><button data-d="left">\u{25C0}</button><span></span><button data-d="right">\u{25B6}</button><span></span><button data-d="down">\u{25BC}</button><span></span>';
    area.appendChild(dp);
    dp.querySelectorAll("button").forEach((b) => {
      b.onclick = () => {
        const d = b.dataset.d;
        if (d === "up") slideFrom(0, 1);
        if (d === "down") slideFrom(0, -1);
        if (d === "left") slideFrom(1, 0);
        if (d === "right") slideFrom(-1, 0);
      };
    });
    reset();
    return () => window.removeEventListener("keydown", key);
  }

  /* ---------------- Лабіринт ---------------- */
  function mountMaze(area, score) {
    const C = Math.min(21, Math.max(7, (Number(opt("mazeSize", 13)) || 13) | 1));
    const showTrail = opt("mazeTrail", "on") !== "off";
    const W = C * 2 + 1;
    const cell = C > 15 ? 16 : C > 11 ? 22 : 30;
    const cv = document.createElement("canvas");
    cv.width = W * cell; cv.height = W * cell;
    cv.className = "maze";
    area.appendChild(cv);
    const ctx = cv.getContext("2d");
    const status = document.createElement("div"); status.className = "game-score"; area.appendChild(status);
    let g, seen, px, py, t0, timer, over, moves;

    function gen() {
      const m = Array.from({ length: W }, () => Array(W).fill(1));
      const DIRS = [[2, 0], [-2, 0], [0, 2], [0, -2]];
      const stack = [[1, 1]]; m[1][1] = 0;
      while (stack.length) {
        const cur = stack[stack.length - 1], x = cur[0], y = cur[1];
        const opts = [];
        for (const d of DIRS) {
          const nx = x + d[0], ny = y + d[1];
          if (nx > 0 && ny > 0 && nx < W - 1 && ny < W - 1 && m[ny][nx] === 1) opts.push([nx, ny, d]);
        }
        if (!opts.length) { stack.pop(); continue; }
        const p = opts[(Math.random() * opts.length) | 0];
        m[y + p[2][1] / 2][x + p[2][0] / 2] = 0;
        m[p[1]][p[0]] = 0;
        stack.push([p[0], p[1]]);
      }
      return m;
    }
    function mixWith(hex, target, k) {
      const p = (s) => parseInt(s, 16);
      const a = /^#?[0-9a-f]{6}$/i.test(hex) ? hex.replace("#", "") : "7c5cff";
      const out = [];
      for (let i = 0; i < 3; i++) {
        const v = Math.round(p(a.substr(i * 2, 2)) * k + p(target.substr(i * 2, 2)) * (1 - k));
        out.push(("0" + v.toString(16)).slice(-2));
      }
      return "#" + out.join("");
    }
    function draw() {
      const css = getComputedStyle(area);
      const accent = (css.getPropertyValue("--md-primary") || "#7c5cff").trim() || "#7c5cff";
      ctx.fillStyle = "#070b18"; ctx.fillRect(0, 0, cv.width, cv.height);
      ctx.fillStyle = mixWith(accent, "10152a", .42);
      for (let y = 0; y < W; y++) for (let x = 0; x < W; x++) {
        if (g[y][x]) ctx.fillRect(x * cell, y * cell, cell, cell);
      }
      if (showTrail) {
        ctx.fillStyle = "rgba(255,255,255,.13)";
        for (let y = 0; y < W; y++) for (let x = 0; x < W; x++) {
          if (seen[y][x]) ctx.fillRect(x * cell + cell / 2 - 2, y * cell + cell / 2 - 2, 4, 4);
        }
      }
      ctx.save();
      ctx.shadowColor = "#3ddc97"; ctx.shadowBlur = cell;
      ctx.fillStyle = "#3ddc97";
      ctx.beginPath(); ctx.arc((W - 1.5) * cell, (W - 1.5) * cell, cell / 3.2, 0, 7); ctx.fill();
      ctx.restore();
      ctx.save();
      ctx.shadowColor = "#22d3ee"; ctx.shadowBlur = cell;
      ctx.fillStyle = "#eafcff";
      ctx.beginPath(); ctx.arc((px + .5) * cell, (py + .5) * cell, cell / 2.6, 0, 7); ctx.fill();
      ctx.fillStyle = "#22d3ee";
      ctx.beginPath(); ctx.arc((px + .5) * cell, (py + .5) * cell, cell / 3.6, 0, 7); ctx.fill();
      ctx.restore();
    }
    function reset() {
      g = gen();
      seen = Array.from({ length: W }, () => Array(W).fill(false));
      px = 1; py = 1; seen[1][1] = true;
      moves = 0; over = false; t0 = Date.now();
      clearInterval(timer);
      timer = setInterval(() => { if (!over) setScore(score, t("games.score"), Math.floor((Date.now() - t0) / 1000)); }, 500);
      setScore(score, t("games.score"), 0);
      status.textContent = t("maze.goal");
      draw();
    }
    function go(dx, dy) {
      if (over) return;
      const nx = px + dx, ny = py + dy;
      if (nx < 0 || ny < 0 || nx >= W || ny >= W || g[ny][nx]) { SFX() && SFX().lose(); return; }
      px = nx; py = ny; moves++; seen[ny][nx] = true;
      SFX() && SFX().click(); draw();
      if (px === W - 2 && py === W - 2) finish();
    }
    function finish() {
      over = true; clearInterval(timer); SFX() && SFX().win();
      const sec = Math.max(1, Math.round((Date.now() - t0) / 1000));
      status.textContent = t("maze.done", { n: sec, m: moves });
      saveRecord("maze", sec, "low");
      setTimeout(reset, 2800);
    }
    const key = (e) => {
      const k = e.key;
      if (k === "ArrowUp" || k === "w") go(0, -1);
      else if (k === "ArrowDown" || k === "s") go(0, 1);
      else if (k === "ArrowLeft" || k === "a") go(-1, 0);
      else if (k === "ArrowRight" || k === "d") go(1, 0);
      else return;
      e.preventDefault();
    };
    window.addEventListener("keydown", key);
    let sx = 0, sy = 0, touch = false;
    cv.addEventListener("touchstart", (e) => { touch = true; sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
    cv.addEventListener("touchend", (e) => {
      if (!touch) return;
      touch = false;
      const d = e.changedTouches[0];
      const dx = d.clientX - sx, dy = d.clientY - sy;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;
      if (Math.abs(dx) > Math.abs(dy)) go(dx > 0 ? 1 : -1, 0); else go(0, dy > 0 ? 1 : -1);
    });
    const dp = document.createElement("div"); dp.className = "dpad";
    dp.innerHTML = '<span></span><button data-d="up">\u{25B2}</button><span></span><button data-d="left">\u{25C0}</button><span></span><button data-d="right">\u{25B6}</button><span></span><button data-d="down">\u{25BC}</button><span></span>';
    area.appendChild(dp);
    dp.querySelectorAll("button").forEach((b) => {
      b.onclick = () => {
        const d = b.dataset.d;
        if (d === "up") go(0, -1);
        if (d === "down") go(0, 1);
        if (d === "left") go(-1, 0);
        if (d === "right") go(1, 0);
      };
    });
    reset();
    return () => { clearInterval(timer); window.removeEventListener("keydown", key); };
  }

  const MOUNTS = { ttt:mountTTT, snake:mountSnake, memory:mountMemory, g2048:mount2048, rps:mountRPS, react:mountReact, simon:mountSimon, mines:mountMines, guess:mountGuess, hanoi:mountHanoi, slide:mountSlide, maze:mountMaze };

  function renderHub() {
    const hub=$("#gamesHub"); if(!hub) return;
    hub.innerHTML="";
    const lang = global.I18n ? global.I18n.lang : "uk";
    GAMES.forEach(g=>{
      const best=global.Profile.getRecord(g.id);
      const card=document.createElement("div"); card.className="game-card";
      card.innerHTML=`<div class="ico">${g.ico}</div><h3>${t(g.name)}</h3><p>${t(g.desc)}</p>`+
        (best!=null?`<div class="best">${t("games.best")}: ${best}</div>`:"");
      
      // Кнопка "i" для інструкції
      const infoBtn = document.createElement("button");
      infoBtn.className = "game-info-btn";
      infoBtn.innerHTML = '<span class="material-icons">info</span>';
      infoBtn.title = t("game.howToPlay") || "How to play";
      infoBtn.onclick = (e) => {
        e.stopPropagation();
        SFX() && SFX().click();
        showHowToPlay(g.id);
      };
      card.appendChild(infoBtn);
      
      card.onclick=()=>{ SFX()&&SFX().click(); Games.open(g.id); };
      hub.appendChild(card);
    });
  }

  function showHowToPlay(gameId) {
    const lang = global.I18n ? global.I18n.lang : "uk";
    const howTo = HOW_TO_PLAY[lang]?.[gameId] || HOW_TO_PLAY.uk[gameId];
    if (!howTo) return;

    const old = document.getElementById("howToModal");
    if (old) old.remove();
    if (SFX() && SFX().pop) SFX().pop();

    const bd = document.createElement("div");
    bd.id = "howToModal";
    bd.className = "ht-backdrop";

    const card = document.createElement("div");
    card.className = "ht-card";
    card.setAttribute("role", "dialog");
    card.setAttribute("aria-modal", "true");

    const h = document.createElement("h3");
    h.textContent = t("game.howToPlay") || "How to Play";
    card.appendChild(h);

    const p = document.createElement("p");
    p.className = "ht-text";
    p.textContent = howTo;
    card.appendChild(p);

    const closeBtn = document.createElement("button");
    closeBtn.className = "btn contained";
    closeBtn.textContent = t("games.back") || "Close";
    closeBtn.onclick = () => { bd.classList.add("ht-out"); setTimeout(() => bd.remove(), 180); };
    card.appendChild(closeBtn);

    bd.appendChild(card);
    bd.onclick = (e) => { if (e.target === bd) { bd.classList.add("ht-out"); setTimeout(() => bd.remove(), 180); } };
    document.body.appendChild(bd);
  }

  const Games = {
    init(){ renderHub(); document.addEventListener("langchange",()=>{ if(!$("#gamesHub").classList.contains("hidden")) renderHub(); }); },
    open(id){ const g=GAMES.find(x=>x.id===id); if(!g)return; currentId=id; const {area,score}=stageShell(g); if(cleanupFn){cleanupFn();cleanupFn=null;} cleanupFn=MOUNTS[id](area,score)||null; document.dispatchEvent(new CustomEvent("gameplayed", { detail: { id } })); },
    close(){ currentId=null; if(cleanupFn){cleanupFn();cleanupFn=null;} const st=$("#gameStage"); st.innerHTML=""; st.classList.add("hidden"); $("#gamesHub").classList.remove("hidden"); renderHub(); },
    restartIfOpen(id){ if (currentId === id) Games.open(id); },
    list: () => GAMES.slice(),
    renderHub
  };
  global.Games = Games;
})(window);
