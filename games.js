/* Ігровий хаб: Tic-Tac-Toe, Snake, Memory, 2048, RPS, Reaction, Simon, Mines, Guess */
(function (global) {
  const $ = (s) => document.querySelector(s);
  const t = (k, v) => global.I18n.t(k, v);
  const SFX = () => global.Audio2 && global.Audio2.SFX;
  let cleanupFn = null;

  const GAMES = [
    { id: "ttt", ico: "\u{2B55}", name: "game.ttt", desc: "game.tttDesc", best: "high" },
    { id: "snake", ico: "\u{1F40D}", name: "game.snake", desc: "game.snakeDesc", best: "high" },
    { id: "memory", ico: "\u{1F9E0}", name: "game.memory", desc: "game.memoryDesc", best: "low" },
    { id: "g2048", ico: "\u{1F522}", name: "game.g2048", desc: "game.g2048Desc", best: "high" },
    { id: "rps", ico: "\u{270A}", name: "game.rps", desc: "game.rpsDesc", best: "high" },
    { id: "react", ico: "\u{26A1}", name: "game.react", desc: "game.reactDesc", best: "low" },
    { id: "simon", ico: "\u{1F3A8}", name: "game.simon", desc: "game.simonDesc", best: "high" },
    { id: "mines", ico: "\u{1F4A3}", name: "game.mines", desc: "game.minesDesc", best: "low" },
    { id: "guess", ico: "\u{1F3AF}", name: "game.guess", desc: "game.guessDesc", best: "low" }
  ];

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
    top.append(back, title, score);

    const area = document.createElement("div");
    area.className = "game-area";
    stage.append(top, area);
    return { area, score };
  }

  function setScore(el, label, value) {
    el.textContent = label + ": " + value;
  }

  /* ---------------- Tic-Tac-Toe (з мінімакс ШІ) ---------------- */
  function mountTTT(area, score) {
    let board = Array(9).fill(null), over = false, wins = 0;
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
      board[i]="X"; render(); SFX()&&SFX().pop();
      let w=winner(board);
      if(w) return finish(w);
      const mv=bestMove(); if(mv!=null){ board[mv]="O"; render(); }
      w=winner(board); if(w) finish(w);
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
      if(w==="X"){ wins++; setScore(score,t("games.score"),wins); status.textContent=t("games.youWin"); SFX()&&SFX().win(); saveRecord("ttt",wins,"high"); }
      else if(w==="O"){ status.textContent=t("games.youLose"); SFX()&&SFX().lose(); }
      else { status.textContent=t("games.draw"); SFX()&&SFX().pop(); }
      setTimeout(reset,1400);
    }
    function reset(){ board=Array(9).fill(null); over=false; status.textContent=""; render(); }
    render();
    return null;
  }

  /* ---------------- Snake ---------------- */
  function mountSnake(area, score) {
    const N=18, size=20;
    const cv=document.createElement("canvas");
    cv.id="snakeCanvas"; cv.width=N*size; cv.height=N*size;
    area.appendChild(cv);
    const ctx=cv.getContext("2d");
    let snake=[{x:8,y:9}], dir={x:1,y:0}, next=dir, food=place(), pts=0, dead=false, timer=null;
    setScore(score,t("games.score"),0);
    function place(){ let p; do{ p={x:(Math.random()*N)|0,y:(Math.random()*N)|0}; }while(snake.some(s=>s.x===p.x&&s.y===p.y)); return p; }
    function draw(){
      ctx.fillStyle="#070b18"; ctx.fillRect(0,0,cv.width,cv.height);
      ctx.fillStyle="#ff5b7a"; ctx.beginPath(); ctx.arc(food.x*size+size/2,food.y*size+size/2,size/2-2,0,7); ctx.fill();
      snake.forEach((s,i)=>{ ctx.fillStyle=i===0?"#22d3ee":"#5b8cff"; ctx.fillRect(s.x*size+1,s.y*size+1,size-2,size-2); });
    }
    function step(){
      dir=next; const h={x:snake[0].x+dir.x,y:snake[0].y+dir.y};
      if(h.x<0||h.y<0||h.x>=N||h.y>=N||snake.some(s=>s.x===h.x&&s.y===h.y)){ return gameOver(); }
      snake.unshift(h);
      if(h.x===food.x&&h.y===food.y){ pts++; setScore(score,t("games.score"),pts); SFX()&&SFX().coin(); food=place(); }
      else snake.pop();
      draw();
    }
    function gameOver(){ dead=true; clearInterval(timer); SFX()&&SFX().lose(); saveRecord("snake",pts,"high"); draw(); ctx.fillStyle="#000a"; ctx.fillRect(0,0,cv.width,cv.height); ctx.fillStyle="#fff"; ctx.font="20px sans-serif"; ctx.textAlign="center"; ctx.fillText(t("games.over"),cv.width/2,cv.height/2); setTimeout(start,1600); }
    function start(){ snake=[{x:8,y:9}]; dir={x:1,y:0}; next=dir; food=place(); pts=0; dead=false; setScore(score,t("games.score"),0); clearInterval(timer); const sp={slow:160,normal:110,fast:70}[global.Settings.get("snakeSpeed")]||110; timer=setInterval(step,sp); draw(); }
    function setDir(x,y){ if(snake.length>1&&(x===-dir.x&&y===-dir.y))return; next={x,y}; }
    const key=(e)=>{ const k=e.key; if(k==="ArrowUp"||k==="w"){setDir(0,-1);e.preventDefault();} else if(k==="ArrowDown"||k==="s"){setDir(0,1);e.preventDefault();} else if(k==="ArrowLeft"||k==="a"){setDir(-1,0);e.preventDefault();} else if(k==="ArrowRight"||k==="d"){setDir(1,0);e.preventDefault();} };
    window.addEventListener("keydown",key);
    // touch dpad
    const dp=document.createElement("div"); dp.className="dpad";
    dp.innerHTML='<span></span><button data-d="up">\u{25B2}</button><span></span><button data-d="left">\u{25C0}</button><span></span><button data-d="right">\u{25B6}</button><span></span><button data-d="down">\u{25BC}</button><span></span>';
    area.appendChild(dp);
    dp.querySelectorAll("button").forEach(b=>b.onclick=()=>{const d=b.dataset.d; if(d==="up")setDir(0,-1); if(d==="down")setDir(0,1); if(d==="left")setDir(-1,0); if(d==="right")setDir(1,0);});
    start();
    return ()=>{ clearInterval(timer); window.removeEventListener("keydown",key); };
  }

  /* ---------------- Memory ---------------- */
  function mountMemory(area, score) {
    const emojis=["\u{1F34E}","\u{1F680}","\u{1F431}","\u{1F31F}","\u{1F3B5}","\u{1F355}","\u{26BD}","\u{1F388}"];
    const pairs=Math.min(10,Math.max(4,Number(global.Settings.get("memorySize"))||8));
    const set=emojis.slice(0,pairs);
    let deck=[...set,...set].sort(()=>Math.random()-0.5);
    const grid=document.createElement("div"); grid.className="mem"; area.appendChild(grid);
    let first=null,lock=false,moves=0,done=0;
    setScore(score,t("games.score"),0);
    deck.forEach((emo,i)=>{
      const c=document.createElement("div"); c.className="mcard"; c.dataset.emo=emo; c.dataset.i=i;
      c.onclick=()=>flip(c); grid.appendChild(c);
    });
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
    let g=Array.from({length:4},()=>Array(4).fill(0)), pts=0;
    const grid=document.createElement("div"); grid.className="g2048"; area.appendChild(grid);
    const cells=[];
    for(let i=0;i<16;i++){ const c=document.createElement("div"); c.className="cell"; grid.appendChild(c); cells.push(c); }
    setScore(score,t("games.score"),0);
    const info=document.createElement("div"); info.className="game-score"; area.appendChild(info);
    function add(){ const e=[]; g.forEach((r,y)=>r.forEach((v,x)=>{if(!v)e.push([x,y]);})); if(e.length){const[x,y]=e[(Math.random()*e.length)|0]; g[y][x]=Math.random()<0.9?2:4;} }
    const COLORS={0:"#1b2547",2:"#2a3660",4:"#33417a",8:"#3f56a0",16:"#4b67c0",32:"#5b8cff",64:"#7c5bff",128:"#22d3ee",256:"#3ddc97",512:"#f0b429",1024:"#ff8c42",2048:"#ff5b7a"};
    function draw(){ g.forEach((r,y)=>r.forEach((v,x)=>{ const c=cells[y*4+x]; c.textContent=v||""; c.style.background=COLORS[v]||"#ff5b7a"; })); setScore(score,t("games.score"),pts); }
    function slide(row){ let a=row.filter(v=>v); for(let i=0;i<a.length-1;i++){ if(a[i]===a[i+1]){a[i]*=2;pts+=a[i];a.splice(i+1,1);} } while(a.length<4)a.push(0); return a; }
    function move(dir){
      const before=JSON.stringify(g);
      if(dir==="left") g=g.map(slide);
      else if(dir==="right") g=g.map(r=>slide(r.slice().reverse()).reverse());
      else if(dir==="up"){ for(let x=0;x<4;x++){ let col=slide([g[0][x],g[1][x],g[2][x],g[3][x]]); for(let y=0;y<4;y++)g[y][x]=col[y]; } }
      else if(dir==="down"){ for(let x=0;x<4;x++){ let col=slide([g[3][x],g[2][x],g[1][x],g[0][x]]); for(let y=0;y<4;y++)g[3-y][x]=col[y]; } }
      if(JSON.stringify(g)!==before){ add(); SFX()&&SFX().pop(); draw(); if(!canMove()) end(); }
    }
    function canMove(){ for(let y=0;y<4;y++)for(let x=0;x<4;x++){ if(!g[y][x])return true; if(x<3&&g[y][x]===g[y][x+1])return true; if(y<3&&g[y][x]===g[y+1][x])return true; } return false; }
    function end(){ SFX()&&SFX().lose(); saveRecord("g2048",pts,"high"); info.textContent=t("games.over"); setTimeout(()=>{info.textContent="";init();},1600); }
    function init(){ g=Array.from({length:4},()=>Array(4).fill(0)); pts=0; add(); add(); draw(); }
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
    let wins=0; setScore(score,t("games.score"),0);
    const row=document.createElement("div"); row.className="rps"; area.appendChild(row);
    const res=document.createElement("div"); res.className="game-score"; res.style.fontSize="18px"; area.appendChild(res);
    const map={rock:"\u{270A}",paper:"\u{270B}",scissors:"\u{270C}\u{FE0F}"};
    ["rock","paper","scissors"].forEach(k=>{ const b=document.createElement("button"); b.textContent=map[k]; b.onclick=()=>play(k); row.appendChild(b); });
    function beats(a,b){ return (a==="rock"&&b==="scissors")||(a==="paper"&&b==="rock")||(a==="scissors"&&b==="paper"); }
    function play(u){
      const keys=Object.keys(map); const c=keys[(Math.random()*3)|0];
      let msg;
      if(u===c){ msg=t("games.draw"); SFX()&&SFX().pop(); }
      else if(beats(u,c)){ wins++; setScore(score,t("games.score"),wins); msg=t("games.youWin"); SFX()&&SFX().win(); saveRecord("rps",wins,"high"); }
      else { msg=t("games.youLose"); SFX()&&SFX().lose(); }
      res.textContent=`${map[u]} vs ${map[c]} — ${msg}`;
    }
    return null;
  }

  /* ---------------- Reaction ---------------- */
  function mountReact(area, score) {
    const box=document.createElement("div"); box.className="react-box"; box.textContent=t("react.tapStart"); area.appendChild(box);
    setScore(score,t("games.best"), (global.Profile.getRecord("react")||"—")+" ms");
    let state="idle", t0=0, to=null;
    box.onclick=()=>{
      if(state==="idle"){ state="wait"; box.className="react-box wait"; box.textContent=t("react.wait"); to=setTimeout(()=>{ state="go"; box.className="react-box go"; box.textContent=t("react.go"); t0=performance.now(); }, 800+Math.random()*2200); }
      else if(state==="wait"){ clearTimeout(to); state="idle"; box.className="react-box"; box.textContent=t("react.tooSoon"); SFX()&&SFX().error(); }
      else if(state==="go"){ const ms=Math.round(performance.now()-t0); state="idle"; box.className="react-box"; SFX()&&SFX().success(); const r=saveRecord("react",ms,"low"); box.textContent=t("react.result",{ms})+(r.isNew?" \u{2B50}":""); setScore(score,t("games.best"),Math.min(ms, global.Profile.getRecord("react")||ms)+" ms"); }
    };
    return ()=>clearTimeout(to);
  }

  /* ---------------- Simon Says ---------------- */
  function mountSimon(area, score) {
    const COLORS = ["#ff5b7a", "#22d3ee", "#3ddc97", "#f0b429"];
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
    function flash(i, ms) { pads[i].classList.add("lit"); setTimeout(() => pads[i].classList.remove("lit"), ms || 300); SFX() && SFX().pop(); }
    function playSeq() {
      accepting = false; status.textContent = t("simon.watch");
      seq.forEach((v, n) => setTimeout(() => flash(v), 500 + n * 450));
      setTimeout(() => { accepting = true; idx = 0; status.textContent = t("simon.your"); }, 500 + seq.length * 450);
    }
    function next() { level++; setScore(score, t("games.score"), level); seq.push((Math.random() * 4) | 0); playSeq(); }
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
    const N = 9, M = 10;
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
    let target = 1 + ((Math.random() * 100) | 0), tries = 0;
    const row = document.createElement("div"); row.className = "guess";
    const inp = document.createElement("input"); inp.type = "number"; inp.min = "1"; inp.max = "100"; inp.placeholder = "1-100";
    const btn = document.createElement("button"); btn.className = "btn contained"; btn.textContent = t("games.play");
    row.append(inp, btn); area.appendChild(row);
    const res = document.createElement("div"); res.className = "game-score"; res.style.fontSize = "18px"; area.appendChild(res);
    setScore(score, t("games.score"), 0);
    function check() {
      const v = Number(inp.value);
      if (!v || v < 1 || v > 100) return;
      tries++; setScore(score, t("games.score"), tries);
      if (v === target) {
        res.textContent = t("games.youWin") + " " + target;
        SFX() && SFX().win(); saveRecord("guess", tries, "low");
        target = 1 + ((Math.random() * 100) | 0); tries = 0; inp.value = "";
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

  const MOUNTS = { ttt:mountTTT, snake:mountSnake, memory:mountMemory, g2048:mount2048, rps:mountRPS, react:mountReact, simon:mountSimon, mines:mountMines, guess:mountGuess };

  function renderHub() {
    const hub=$("#gamesHub"); if(!hub) return;
    hub.innerHTML="";
    GAMES.forEach(g=>{
      const best=global.Profile.getRecord(g.id);
      const card=document.createElement("div"); card.className="game-card";
      card.innerHTML=`<div class="ico">${g.ico}</div><h3>${t(g.name)}</h3><p>${t(g.desc)}</p>`+
        (best!=null?`<div class="best">${t("games.best")}: ${best}</div>`:"");
      card.onclick=()=>{ SFX()&&SFX().click(); Games.open(g.id); };
      hub.appendChild(card);
    });
  }

  const Games = {
    init(){ renderHub(); document.addEventListener("langchange",()=>{ if(!$("#gamesHub").classList.contains("hidden")) renderHub(); }); },
    open(id){ const g=GAMES.find(x=>x.id===id); if(!g)return; const {area,score}=stageShell(g); if(cleanupFn){cleanupFn();cleanupFn=null;} cleanupFn=MOUNTS[id](area,score)||null; },
    close(){ if(cleanupFn){cleanupFn();cleanupFn=null;} const st=$("#gameStage"); st.innerHTML=""; st.classList.add("hidden"); $("#gamesHub").classList.remove("hidden"); renderHub(); },
    renderHub
  };
  global.Games = Games;
})(window);
