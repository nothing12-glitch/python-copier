/* pygui.js — власні реалізації turtle і tkinter для Python-майданчика.
   Pyodide не дає жодного з них: обидва модулі вимагають системного вікна.
   Тому черепашка малює на canvas, а віджети tkinter — це справжні елементи
   сторінки, намальовані під класичний Tk. Обидва модулі реєструються у
   sys.modules під час завантаження Pyodide, тож `import turtle` і
   `from tkinter import *` працюють одразу і без встановлення. */
(function (global) {
  "use strict";

  /* ---------- Дрібні помічники ---------- */
  function el(tag, cls, text) {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text != null) node.textContent = String(text);
    return node;
  }

  const hostNode = () => document.getElementById("out") || document.body;

  const tr = (key, dflt) => {
    try {
      if (!global.I18n || !global.I18n.t) return dflt;
      const v = global.I18n.t(key);
      // I18n.t повертає сам ключ, коли перекладу немає
      return v && v !== key ? v : dflt;
    } catch (e) {
      return dflt;
    }
  };

  const sfx = (name) => {
    const s = global.Audio2 && global.Audio2.SFX;
    if (s && s[name]) s[name]();
  };

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const rad = (d) => (d * Math.PI) / 180;
  const num = (v, dflt) => {
    if (v == null || v === "") return dflt;
    const n = Number(v);
    return Number.isFinite(n) ? n : dflt;
  };
  const norm360 = (a) => ((a % 360) + 360) % 360;

  // Python надсилає коллбеки та змінні як маркировані об'єкти
  const isCb = (v) => !!v && typeof v === "object" && typeof v.cb === "number";
  const isVar = (v) => !!v && typeof v === "object" && typeof v.vid === "number";
  const cbId = (v) => (isCb(v) ? v.cb : null);
  const varId = (v) => (isVar(v) ? v.vid : null);

  function rgbFrom(list, scale) {
    const n = list.map((x) => clamp(Math.round(num(x, 0) * scale), 0, 255));
    if (n.length === 4) return "rgba(" + n[0] + "," + n[1] + "," + n[2] + "," + clamp(n[3] / 255, 0, 1) + ")";
    return "rgb(" + n[0] + "," + n[1] + "," + n[2] + ")";
  }

  let colormode = 1.0;

  // turtle: кортеж означає значення у colormode; tkinter: завжди 0..255
  function toColor(v, fixed255) {
    if (v == null) return null;
    if (typeof v === "string") return v;
    if (Array.isArray(v) && v.length >= 3 && v.every((x) => Number.isFinite(Number(x)))) {
      const mx = fixed255 ? 255 : colormode;
      return rgbFrom(v, mx > 1 ? 1 : 255);
    }
    if (typeof v === "object") {
      if (Number.isFinite(Number(v.r))) {
        const mx = fixed255 ? 255 : colormode;
        const k = mx > 1 ? 1 : 255;
        return "rgb(" + Math.round(num(v.r, 0) * k) + "," + Math.round(num(v.g, 0) * k) +
          "," + Math.round(num(v.b, 0) * k) + ")";
      }
      return null;
    }
    return String(v);
  }

  /* ---------- Реєстр коллбеків із Python ---------- */
  const CBA = new Map();
  let cbSeq = 0;

  function runCb(id, args) {
    const p = CBA.get(Number(id));
    if (!p) return;
    try {
      if (typeof p.apply === "function") p.apply(null, args || []);
      else if (typeof p.call === "function") p.call(...(args || []));
      else p();
    } catch (e) {
      console.warn("[PyGui] колбек не спрацював:", e && e.message);
    }
  }

  /* ==================== turtle ==================== */
  const Turt = {
    scr: null,
    turtles: new Map(),
    seq: 0,
    def: null,
    keyHandler: null,
    frame: 0
  };

  // назви клавіш DOM -> назви, які вживає turtle
  const KEY_ALIAS = {
    ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right",
    Enter: "return", Escape: "esc", PageUp: "prior", PageDown: "next",
    " ": "space", Backspace: "backspace", Tab: "tab"
  };

  function keyNames(k) {
    const s = String(k == null ? "" : k);
    const out = [s.toLowerCase()];
    const al = KEY_ALIAS[s];
    if (al) out.push(al);
    return out;
  }

  function bindKeys() {
    if (Turt.keyHandler) return;
    Turt.keyHandler = (ev) => {
      const s = Turt.scr;
      if (!s || !s.listening) return;
      const want = keyNames(ev.key);
      let used = false;
      s.onkey.forEach((r) => {
        if (r.key && want.indexOf(r.key) >= 0) { used = true; runCb(r.cb); }
      });
      if (used && ev.cancelable) ev.preventDefault();
    };
    window.addEventListener("keydown", Turt.keyHandler);
  }

  function setSize(s, w, h) {
    const nw = num(w, s.w), nh = num(h, s.h);
    s.w = clamp(Math.round(nw), 160, 1600);
    s.h = clamp(Math.round(nh), 120, 1200);
    s.cv.width = Math.round(s.w * s.dpr);
    s.cv.height = Math.round(s.h * s.dpr);
    s.cv.style.aspectRatio = s.w + " / " + s.h;
    draw();
  }

  function makeScreen() {
    const wrap = el("div", "pg-block pg-turtle");
    const bar = el("div", "pg-bar");
    bar.appendChild(el("span", "pg-ico", "🐢"));
    const title = el("span", "pg-title", "Python Turtle Graphics");
    bar.appendChild(title);

    const bClear = el("button", "pg-mini");
    bClear.type = "button";
    bClear.appendChild(el("span", "material-icons", "delete"));
    bClear.appendChild(el("span", null, tr("gui.clear", "Очистити")));
    bClear.onclick = () => {
      Turt.turtles.forEach((t) => { t.items = []; t.queue = []; t.act = null; });
      sfx("click");
      draw();
    };
    const bFull = el("button", "pg-mini");
    bFull.type = "button";
    bFull.appendChild(el("span", "material-icons", "fullscreen"));
    bFull.title = tr("python.full", "На весь екран");
    bFull.onclick = () => {
      wrap.classList.toggle("pg-big");
      const ic = bFull.querySelector(".material-icons");
      if (ic) ic.textContent = wrap.classList.contains("pg-big") ? "fullscreen_exit" : "fullscreen";
      sfx("click");
    };
    bar.append(bClear, bFull);

    const cv = document.createElement("canvas");
    cv.className = "pg-canvas";
    wrap.append(bar, cv);
    hostNode().appendChild(wrap);

    const s = {
      wrap, cv, ctx: cv.getContext("2d"), titleEl: title,
      dpr: clamp(Math.round(global.devicePixelRatio || 1), 1, 2),
      w: 640, h: 400, bg: "#f0f0f0", raf: 0,
      listening: false, onkey: [], timers: [], clickCb: null
    };
    setSize(s, s.w, s.h);
    cv.addEventListener("click", (ev) => {
      if (s.clickCb == null) return;
      const r = cv.getBoundingClientRect();
      const x = ((ev.clientX - r.left) / r.width) * s.w - s.w / 2;
      const y = s.h / 2 - ((ev.clientY - r.top) / r.height) * s.h;
      runCb(s.clickCb, [x, y]);
    });
    return s;
  }

  function screen(create) {
    if (!Turt.scr && create !== false) Turt.scr = makeScreen();
    return Turt.scr;
  }

  function newTurtle(kw) {
    screen(true);
    const t = {
      id: ++Turt.seq, x: 0, y: 0, ang: 0, ax: 0, ay: 0, aang: 0,
      down: true, pen: "#000000", fillc: "#000000", size: 1, speed: 3,
      visible: true, shape: "arrow", items: [], queue: [], act: null,
      filling: false, fillPts: []
    };
    if (kw && kw.shape != null) t.shape = String(kw.shape);
    const c = kw ? toColor(kw.color) : null;
    if (c) { t.pen = c; t.fillc = c; }
    if (!c && kw && kw.outline != null) t.pen = toColor(kw.outline) || t.pen;
    Turt.turtles.set(t.id, t);
    if (!Turt.def) Turt.def = t;
    draw();
    return t.id;
  }

  function kick() {
    const s = Turt.scr;
    if (s && !s.raf) s.raf = requestAnimationFrame(tick);
  }

  function tick() {
    const s = Turt.scr;
    if (!s) { Turt.frame = 0; return; }
    s.raf = 0;
    let busy = false;
    Turt.turtles.forEach((t) => { if (stepTurtle(t)) busy = true; });
    draw();
    if (busy) s.raf = requestAnimationFrame(tick);
  }

  function frames(t) {
    const sp = clamp(Math.round(num(t.speed, 3)), 1, 10);
    if (num(t.speed, 3) <= 0) return 1;
    return Math.max(2, (11 - sp) * 2);
  }

  function addFillPt(t) {
    if (t.filling) t.fillPts.push([t.ax, t.ay]);
  }

  /* Python викликає begin_fill/end_fill синхронно, а рух черепашки ще в черзі.
     Тому заповнення теж стає позначкою в черзі — інакше многокутник вийшов би
     «до того, як черепашка щось намалювала». */
  function applyFillMark(t, m) {
    if (m.on) {
      t.filling = true;
      t.fillPts = [[t.ax, t.ay]];
      return;
    }
    t.filling = false;
    const pts = t.fillPts.concat([[t.ax, t.ay]]);
    if (pts.length > 2) t.items.push({ k: "poly", pts, c: t.fillc, edge: t.pen, w: t.size });
    t.fillPts = [];
  }

  function fillMark(t, on) {
    if (!t.act && !t.queue.length) applyFillMark(t, { on });
    else t.queue.push({ k: "fill", on });
    kick();
    draw();
  }

  function stepTurtle(t) {
    while (!t.act) {
      const nx = t.queue.shift();
      if (!nx) return false;
      if (nx.k === "fill") { applyFillMark(t, nx); continue; }
      t.act = nx;
    }
    const a = t.act;
    const fr = frames(t);

    if (a.k === "move") {
      a.p = Math.min(1, (a.p || 0) + 1 / fr);
      const nx = a.x0 + (a.x1 - a.x0) * a.p;
      const ny = a.y0 + (a.y1 - a.y0) * a.p;
      if (t.down && (nx !== t.ax || ny !== t.ay)) {
        t.items.push({ k: "line", x1: t.ax, y1: t.ay, x2: nx, y2: ny, c: t.pen, w: t.size });
      }
      addFillPt(t);
      t.ax = nx; t.ay = ny;
      if (a.p >= 1) t.act = null;
      return true;
    }

    if (a.k === "turn") {
      a.p = Math.min(1, (a.p || 0) + 1 / fr);
      t.aang = a.a0 + (a.a1 - a.a0) * a.p;
      if (a.p >= 1) { t.aang = a.a1; t.act = null; }
      return true;
    }

    if (a.k === "arc") {
      const per = Math.abs(a.extent) / fr;
      const to = a.dir > 0 ? Math.min(a.cur + per, a.end) : Math.max(a.cur - per, a.end);
      const cuts = Math.max(1, Math.round(Math.abs(to - a.cur) / 5));
      for (let i = 1; i <= cuts; i++) {
        const ang = a.cur + ((to - a.cur) * i) / cuts;
        const px = a.cx + a.r * Math.cos(rad(ang));
        const py = a.cy + a.r * Math.sin(rad(ang));
        if (t.down) t.items.push({ k: "line", x1: t.ax, y1: t.ay, x2: px, y2: py, c: t.pen, w: t.size });
        addFillPt(t);
        t.ax = px; t.ay = py;
        t.aang = ang + a.dir * 90;
      }
      a.cur = to;
      if (Math.abs(a.cur - a.end) < 1e-6) { t.act = null; t.aang = a.end + a.dir * 90; }
      return true;
    }

    t.act = null;
    return t.queue.length > 0;
  }

  function enqMove(t, x, y) {
    t.queue.push({ k: "move", x0: t.x, y0: t.y, x1: x, y1: y, p: 0 });
    t.x = x; t.y = y;
    kick();
  }

  function moveBy(t, dist) {
    enqMove(t, t.x + dist * Math.cos(rad(t.ang)), t.y + dist * Math.sin(rad(t.ang)));
  }

  function turnBy(t, deg) {
    t.queue.push({ k: "turn", a0: t.ang, a1: t.ang + deg, p: 0 });
    t.ang += deg;
    kick();
  }

  function circleEnq(t, r, extent) {
    if (!r || !extent) return;
    const dir = extent > 0 ? 1 : -1;
    const cang = t.ang + dir * 90;
    const cx = t.x + r * Math.cos(rad(cang));
    const cy = t.y + r * Math.sin(rad(cang));
    const a0 = t.ang - dir * 90;
    const a1 = a0 + extent;
    t.queue.push({ k: "arc", cx, cy, r, cur: a0, end: a1, dir, extent });
    t.x = cx + r * Math.cos(rad(a1));
    t.y = cy + r * Math.sin(rad(a1));
    t.ang = a1 + dir * 90;
    kick();
  }

  function xyArg(a) {
    if (Array.isArray(a[0])) return [num(a[0][0], 0), num(a[0][1], 0)];
    if (a[0] && typeof a[0] === "object" && !Array.isArray(a[0])) {
      return [num(a[0].x, 0), num(a[0].y, 0)];
    }
    return [a[0], a[1]];
  }

  /* ---------- малювання ---------- */
  const X = (s, x) => s.w / 2 + x;
  const Y = (s, y) => s.h / 2 - y;

  function drawItem(s, it) {
    const c = s.ctx;
    if (it.k === "line") {
      c.strokeStyle = it.c; c.lineWidth = Math.max(0.6, it.w || 1); c.lineCap = "round";
      c.beginPath(); c.moveTo(X(s, it.x1), Y(s, it.y1)); c.lineTo(X(s, it.x2), Y(s, it.y2)); c.stroke();
    } else if (it.k === "poly") {
      if (it.pts.length < 3) return;
      c.beginPath();
      c.moveTo(X(s, it.pts[0][0]), Y(s, it.pts[0][1]));
      for (let i = 1; i < it.pts.length; i++) c.lineTo(X(s, it.pts[i][0]), Y(s, it.pts[i][1]));
      c.closePath();
      c.fillStyle = it.c; c.fill();
      c.strokeStyle = it.edge; c.lineWidth = Math.max(1, it.w || 1); c.stroke();
    } else if (it.k === "dot") {
      c.beginPath(); c.arc(X(s, it.x), Y(s, it.y), it.r, 0, Math.PI * 2);
      c.fillStyle = it.c; c.fill();
    } else if (it.k === "text") {
      c.font = it.font; c.textAlign = it.align; c.textBaseline = "alphabetic";
      c.fillStyle = it.c;
      const lines = String(it.s).split("\n");
      lines.forEach((ln, i) => c.fillText(ln, X(s, it.x), Y(s, it.y) + i * it.lh));
    } else if (it.k === "stamp") {
      shapeAt(s, it.x, it.y, it.ang, it.shape, it.c, 1);
    }
  }

  function shapeAt(s, x, y, ang, shape, color, k) {
    const c = s.ctx;
    c.save();
    c.translate(X(s, x), Y(s, y));
    c.rotate(-rad(ang));
    c.scale(k, k);
    c.lineJoin = "round";
    const col = color || "#000";
    if (shape === "turtle") {
      c.fillStyle = "#3f9d4f"; c.strokeStyle = "#186027"; c.lineWidth = 1.4;
      c.beginPath(); c.ellipse(-10, 0, 5, 3.4, 0, 0, 6.283); c.fill();
      [[5, -8], [5, 8], [-7, -8], [-7, 8]].forEach((p) => {
        c.beginPath(); c.ellipse(p[0], p[1], 4, 2.6, 0, 0, 6.283); c.fill();
      });
      c.beginPath(); c.arc(14, 0, 4.4, 0, 6.283); c.fill(); c.stroke();
      c.beginPath(); c.ellipse(0, 0, 12, 9.5, 0, 0, 6.283); c.fill(); c.stroke();
      c.fillStyle = "#2b7a3b";
      c.beginPath(); c.arc(0, 0, 6.2, 0, 6.283); c.fill();
      c.strokeStyle = "rgba(255,255,255,.5)"; c.lineWidth = 1;
      for (let i = 0; i < 6; i++) {
        const a1 = rad(i * 60), a2 = rad(i * 60 + 60);
        c.beginPath();
        c.moveTo(Math.cos(a1) * 6.2, Math.sin(a1) * 6.2);
        c.lineTo(Math.cos(a2) * 6.2, Math.sin(a2) * 6.2);
        c.stroke();
      }
      c.fillStyle = "#0c2a12";
      c.beginPath(); c.arc(15.6, -1.8, 1.1, 0, 6.283); c.fill();
    } else if (shape === "circle") {
      c.beginPath(); c.arc(0, 0, 12, 0, 6.283); c.fillStyle = col; c.fill();
    } else if (shape === "square") {
      c.fillStyle = col; c.fillRect(-11, -11, 22, 22);
    } else if (shape === "triangle") {
      c.beginPath(); c.moveTo(14, 0); c.lineTo(-9, 11); c.lineTo(-9, -11); c.closePath(); c.fillStyle = col; c.fill();
    } else {
      c.beginPath(); c.moveTo(16, 0); c.lineTo(-12, 9); c.lineTo(-6, 0); c.lineTo(-12, -9); c.closePath();
      c.fillStyle = col; c.globalAlpha = 0.9; c.fill(); c.globalAlpha = 1;
      c.strokeStyle = col; c.lineWidth = 1.6; c.stroke();
    }
    c.restore();
  }

  function draw() {
    const s = Turt.scr;
    if (!s) return;
    const c = s.ctx;
    c.setTransform(s.dpr, 0, 0, s.dpr, 0, 0);
    c.fillStyle = s.bg;
    c.fillRect(0, 0, s.w, s.h);
    Turt.turtles.forEach((t) => t.items.forEach((it) => drawItem(s, it)));
    Turt.turtles.forEach((t) => {
      if (!t.filling || t.fillPts.length < 3) return;
      const pts = t.fillPts.concat([[t.ax, t.ay]]);
      drawItem(s, { k: "poly", pts, c: t.fillc, edge: t.pen, w: t.size });
    });
    Turt.turtles.forEach((t) => {
      if (t.visible) shapeAt(s, t.ax, t.ay, t.aang, t.shape, t.pen, 1);
    });
  }

  /* ---------- операції turtle ---------- */

  /* Python-шим надсилає довгі назви (forward, penup), а рушій внутрішньо
     користується короткими. Без цього мапу черепашка просто не слухалась би. */
  const TURT_ALIAS = {
    forward: "fd", backward: "bk", back: "bk", backwards: "bk",
    left: "lt", right: "rt",
    penup: "pu", pendown: "pd", up: "pu", down: "pd",
    hideturtle: "ht", showturtle: "st",
    setheading: "seth", setposition: "goto", setpos: "goto",
    width: "pensize"
  };

  function turtOp(op0, h, a, kw) {
    const op = TURT_ALIAS[op0] || op0;
    if (op === "new") return { v: newTurtle(kw) };

    const s = screen(true);
    const t = h == null ? Turt.def : Turt.turtles.get(Number(h));

    switch (op) {
      case "bgcolor": {
        const c = toColor(a.length > 1 ? [a[0], a[1], a[2]] : a[0]);
        s.bg = c || "#f0f0f0";
        draw(); return;
      }
      case "setup":
        setSize(s, a[0], a[1]); return;
      case "screensize":
        setSize(s, a[0], a[1]);
        if (a[2] != null) { s.bg = toColor(a[2]) || s.bg; }
        draw(); return;
      case "title":
        s.titleEl.textContent = String(a[0] == null ? "Python Turtle Graphics" : a[0]); return;
      case "clearscreen":
        Turt.turtles.forEach((tt) => { tt.items = []; }); draw(); return;
      case "resetscreen":
        Turt.turtles.forEach((tt) => {
          tt.items = []; tt.queue = []; tt.act = null;
          tt.filling = false; tt.fillPts = [];
          tt.x = tt.y = tt.ax = tt.ay = 0; tt.ang = tt.aang = 0;
        });
        draw(); return;
      case "listen":
        s.listening = true; bindKeys(); return;
      case "onkey":
        s.onkey.push({ key: String(a[1] == null ? "" : a[1]).toLowerCase(), cb: cbId(a[0]) }); return;
      case "onclick": case "onscreenclick":
        s.clickCb = cbId(a[0]); return;
      case "ontimer": {
        const ms = clamp(num(a[1], 0), 0, 600000);
        const id = setTimeout(() => runCb(cbId(a[0])), ms);
        s.timers.push(id);
        return { v: id };
      }
      case "colormode":
        if (a.length) colormode = num(a[0], 1) || 1;
        return { v: colormode };
      case "update": draw(); return;
      case "done": case "mainloop": case "bye": case "tracer": case "delay":
        return;
      default: break;
    }

    if (!t) return;

    switch (op) {
      case "fd": moveBy(t, num(a[0], 0)); return;
      case "bk": moveBy(t, -num(a[0], 0)); return;
      case "lt": turnBy(t, num(a[0], 0)); return;
      case "rt": turnBy(t, -num(a[0], 0)); return;
      case "goto": {
        const p = xyArg(a);
        enqMove(t, num(p[0], t.x), num(p[1], t.y));
        return;
      }
      case "setx": enqMove(t, num(a[0], t.x), t.y); return;
      case "sety": enqMove(t, t.x, num(a[0], t.y)); return;
      case "seth": {
        const target = num(a[0], 0);
        t.queue.push({ k: "turn", a0: t.ang, a1: target, p: 0 });
        t.ang = target;
        kick(); return;
      }
      case "home": {
        t.queue.push({ k: "turn", a0: t.ang, a1: 0, p: 0 });
        t.queue.push({ k: "move", x0: t.x, y0: t.y, x1: 0, y1: 0, p: 0 });
        t.ang = 0; t.x = 0; t.y = 0;
        kick(); return;
      }
      case "circle": circleEnq(t, num(a[0], 0), a.length > 1 ? num(a[1], 360) : 360); return;
      case "pu": t.down = false; draw(); return;
      case "pd": t.down = true; draw(); return;
      case "pencolor": {
        if (!a.length) return { v: t.pen };
        const c = toColor(a.length > 1 ? a : a[0]);
        if (c) t.pen = c;
        draw(); return;
      }
      case "fillcolor": {
        if (!a.length) return { v: t.fillc };
        const c = toColor(a.length > 1 ? a : a[0]);
        if (c) t.fillc = c;
        draw(); return;
      }
      case "color": {
        if (!a.length) return { v: [t.pen, t.fillc] };
        const nums = a.filter((v) => typeof v === "number");
        let pen = null;
        let fill = null;
        if (nums.length >= 3 && nums.length === a.length) {
          pen = toColor(a);
          fill = pen;
        } else {
          pen = toColor(a[0]);
          fill = a.length > 1 ? (toColor(a[1]) || pen) : pen;
        }
        if (pen) t.pen = pen;
        if (fill) t.fillc = fill;
        draw(); return;
      }
      case "pensize":
        if (!a.length) return { v: t.size };
        t.size = clamp(num(a[0], 1), 0, 120); draw(); return;
      case "speed":
        if (!a.length) return { v: t.speed };
        t.speed = num(a[0], 3);
        kick(); return;
      case "ht": t.visible = false; draw(); return;
      case "st": t.visible = true; draw(); return;
      case "shape":
        if (!a.length) return { v: t.shape };
        t.shape = String(a[0]); draw(); return;
      case "begin_fill": fillMark(t, true); return;
      case "end_fill": fillMark(t, false); return;
      case "write": {
        const kw2 = kw || {};
        const align = String(kw2.align || (typeof a[1] === "string" ? a[1] : "left"));
        let font = kw2.font;
        if (!Array.isArray(font)) font = a.find((x) => Array.isArray(x));
        const size = font && font.length > 1 ? Math.abs(num(font[1], 10)) : 10;
        const weight = font && /bold|black|heavy/i.test(String(font[2] || "")) ? "700" : "400";
        t.items.push({
          k: "text", x: t.x, y: t.y, s: String(a[0] == null ? "" : a[0]),
          c: t.pen, font: weight + " " + size + "px 'Space Mono', monospace",
          lh: size * 1.25, align: align === "center" ? "center" : align === "right" ? "end" : "start"
        });
        draw(); return;
      }
      case "stamp":
        t.items.push({ k: "stamp", x: t.x, y: t.y, ang: t.ang, shape: t.shape, c: t.pen });
        draw(); return { v: t.items.length };
      case "dot": {
        let size = null, col = null;
        a.forEach((v) => {
          if (typeof v === "number") { if (size == null) size = v; return; }
          const c = toColor(v);
          if (c) col = c;
        });
        if (kw.size != null) size = num(kw.size, size);
        if (kw.color != null) col = toColor(kw.color) || col;
        t.items.push({ k: "dot", x: t.x, y: t.y, r: Math.max(1, num(size, t.size + 4) / 2), c: col || t.fillc });
        draw(); return;
      }
      case "clear": t.items = []; t.fillPts = []; draw(); return;
      case "reset":
        t.items = []; t.queue = []; t.act = null; t.fillPts = []; t.filling = false;
        t.x = t.y = t.ax = t.ay = 0; t.ang = t.aang = 0; t.down = true;
        draw(); return;
      case "position": return { v: [t.x, t.y] };
      case "heading": return { v: norm360(t.ang) };
      case "xcor": return { v: t.x };
      case "ycor": return { v: t.y };
      case "isdown": return { v: !!t.down };
      case "isvisible": return { v: !!t.visible };
      case "distance": {
        const p = xyArg(a);
        return { v: Math.hypot(num(p[0], 0) - t.x, num(p[1], 0) - t.y) };
      }
      case "towards": {
        const p = xyArg(a);
        return { v: norm360(Math.atan2(num(p[1], 0) - t.y, num(p[0], 0) - t.x) * 180 / Math.PI) };
      }
      case "degrees": case "radians": return;
      default: return;
    }
  }

  /* ==================== tkinter ==================== */
  const Tk = {
    nodes: new Map(),
    vars: new Map(),
    roots: [],
    dialogs: [],
    timers: [],
    seq: 0,
    def: null
  };

  const MBT = {
    info: [["OK", "ok"]],
    warn: [["OK", "ok"]],
    error: [["OK", "ok"]],
    question: [["Yes", "yes"], ["No", "no"]],
    yesno: [["Yes", "yes"], ["No", "no"]],
    yesnocancel: [["Yes", "yes"], ["No", "no"], ["Cancel", "cancel"]],
    okcancel: [["OK", "ok"], ["Cancel", "cancel"]],
    retrycancel: [["Retry", "retry"], ["Cancel", "cancel"]],
    integer: [["OK", "ok"], ["Cancel", "cancel"]],
    string: [["OK", "ok"], ["Cancel", "cancel"]]
  };
  const MBICO = { info: "ℹ️", warn: "⚠️", error: "⛔", question: "❓", yesno: "❓", yesnocancel: "❓", okcancel: "❓", retrycancel: "❓", integer: "❓", string: "❓" };

  function nodeOf(h) {
    if (h == null) return Tk.nodes.get(Tk.def);
    return Tk.nodes.get(Number(h)) || Tk.nodes.get(Tk.def);
  }

  function bodyOf(s) {
    return s ? (s.body || s.el) : null;
  }

  function cssFont(f) {
    if (!f) return null;
    if (typeof f === "string") return f.indexOf("Tk") === 0 ? null : f;
    if (Array.isArray(f)) {
      const name = String(f[0] || "Segoe UI");
      let size = num(f[1], 12);
      if (size < 0) size = clamp(Math.round(-size * 96 / 72), 9, 64);
      const style = String(f[2] || "").toLowerCase();
      const weight = /bold|black|heavy|roman/.test(style) && style.indexOf("normal") < 0 ? "700" : "400";
      return weight + " " + clamp(size, 8, 72) + 'px "' + name + '", "Segoe UI", system-ui, sans-serif';
    }
    return null;
  }

  function tkNew(kind, parentId, kw) {
    const s = { id: ++Tk.seq, kind, opts: {}, kids: [], parent: null, layout: null };
    if (kind === "tk" || kind === "toplevel") {
      const win = el("div", "pgtk-win");
      const bar = el("div", "pgtk-bar");
      s.titleEl = el("span", "pgtk-title", "tk");
      const x = el("button", "pgtk-x", "✕");
      x.type = "button";
      x.setAttribute("aria-label", tr("gui.closeWin", "Закрити вікно"));
      x.onclick = () => { sfx("click"); tkDestroy(s.id); };
      bar.append(el("span", "pgtk-dots"), s.titleEl, x);
      s.body = el("div", "pgtk-body");
      win.append(bar, s.body);
      hostNode().appendChild(win);
      s.el = win;
      Tk.roots.push(s.id);
      if (Tk.def == null) Tk.def = s.id;
    } else {
      let p = parentId == null ? Tk.nodes.get(Tk.def) : Tk.nodes.get(Number(parentId));
      if (!p) {
        const rid = tkNew("tk", null, {});
        p = Tk.nodes.get(rid);
      }
      s.parent = p.id;
      buildWidget(s);
    }
    Tk.nodes.set(s.id, s);
    s.cmd = cbId((kw || {}).command);
    s.vid = varId((kw || {}).variable);
    s.tvar = varId((kw || {}).textvariable);
    s.opts = Object.assign({}, kw || {});
    applyOpts(s);
    if (s.tvar != null) refreshVar(s.tvar, s.id);
    syncVarWidget(s);
    return s.id;
  }

  function buildWidget(s) {
    const kind = s.kind;
    if (kind === "frame") {
      s.el = el("div", "pgtk-frame"); s.body = s.el;
    } else if (kind === "labelframe") {
      s.el = el("div", "pgtk-labelframe");
      s.text = el("span", "pgtk-cap");
      s.body = el("div", "pgtk-lfbody");
      s.el.append(s.text, s.body);
    } else if (kind === "label" || kind === "message") {
      s.el = el("div", "pgtk-label"); s.text = s.el;
    } else if (kind === "button") {
      s.el = el("button", "pgtk-button"); s.el.type = "button";
      s.text = el("span", "pgtk-btxt");
      s.el.appendChild(s.text);
      s.el.addEventListener("click", () => { sfx("click"); runCb(s.cmd); });
    } else if (kind === "entry") {
      s.el = el("input", "pgtk-entry"); s.el.type = "text";
      s.el.addEventListener("input", () => {
        if (s.tvar != null) { Tk.vars.set(s.tvar, s.el.value); refreshVar(s.tvar, s.id); }
        fireBind(s, { keysym: "", char: "", type: "Modify" });
      });
    } else if (kind === "text") {
      s.el = el("textarea", "pgtk-text"); s.el.spellcheck = false;
    } else if (kind === "checkbutton" || kind === "radiobutton") {
      s.el = el("label", "pgtk-check");
      s.input = el("input");
      s.input.type = kind === "checkbutton" ? "checkbox" : "radio";
      s.text = el("span", "pgtk-ctxt");
      s.el.append(s.input, s.text);
      s.input.addEventListener("change", () => {
        if (kind === "checkbutton") setState(s, s.input.checked ? onVal(s) : offVal(s));
        else setState(s, s.value != null ? s.value : onVal(s));
        runCb(s.cmd);
      });
    } else if (kind === "scale") {
      s.el = el("div", "pgtk-scale");
      s.head = el("div", "pgtk-scalehead");
      s.cap = el("span", "pgtk-slabel");
      s.out = el("span", "pgtk-svalue");
      s.head.append(s.cap, s.out);
      s.input = el("input"); s.input.type = "range";
      s.el.append(s.head, s.input);
      s.input.addEventListener("input", () => {
        setState(s, num(s.input.value, 0));
        showScale(s);
      });
      s.input.addEventListener("change", () => runCb(s.cmd));
    } else if (kind === "separator") {
      s.el = el("div", "pgtk-sep");
    } else {
      s.el = el("div", "pgtk-frame"); s.body = s.el;
    }
    if (s.input) {
      s.input.value = s.value != null ? s.value : "";
    }
  }

  function onVal(s) { return s.opts.onvalue != null ? s.opts.onvalue : 1; }
  function offVal(s) { return s.opts.offvalue != null ? s.opts.offvalue : 0; }

  function setState(s, v) {
    if (s.vid != null) Tk.vars.set(s.vid, v);
    else s.value = v;
    if (s.kind === "scale") s.value = num(v, 0);
    if (s.vid != null) refreshVar(s.vid, s.id);
    syncVarWidget(s);
  }

  function getState(s) {
    if (s.vid != null) { const v = Tk.vars.get(s.vid); return v === undefined ? null : v; }
    // Entry bindиться через textvariable, а не variable
    if (s.tvar != null) { const v = Tk.vars.get(s.tvar); return v === undefined ? null : v; }
    return s.value == null ? 0 : s.value;
  }

  function showScale(s) {
    const o = s.opts;
    const from = num(o.from_, num(o.from, num(s.from, 0)));
    const to = num(o.to, num(s.to, 100));
    const val = num(getState(s), from);
    if (s.out) s.out.textContent = String(Number(val.toFixed(3)));
    if (s.input) { s.input.value = String(val); }
  }

  function refreshVar(vid, skip) {
    const val = Tk.vars.get(vid);
    Tk.nodes.forEach((n) => {
      if (n.tvar === vid && n.text) n.text.textContent = val == null ? "" : String(val);
      if ((n.vid === vid || n.tvar === vid) && n.id !== skip) syncVarWidget(n);
      if (n.vid === vid && n.id === skip && n.kind === "scale") showScale(n);
    });
  }

  function syncVarWidget(s) {
    const v = getState(s);
    if (s.kind === "entry" && s.tvar != null) {
      const txt = v == null ? "" : String(v);
      if (s.el.value !== txt) s.el.value = txt;
    } else if (s.kind === "checkbutton" && s.input) {
      s.input.checked = String(v) === String(onVal(s));
    } else if (s.kind === "radiobutton" && s.input) {
      s.input.checked = String(v) === String(s.value);
    } else if (s.kind === "scale") {
      showScale(s);
    }
  }

  function applyOpts(s) {
    const o = s.opts;
    const st = s.el.style;
    const bg = toColor(o.bg != null ? o.bg : o.background, true);
    const fg = toColor(o.fg != null ? o.fg : o.foreground, true);
    const fnt = cssFont(o.font);
    if (s.kind === "tk" || s.kind === "toplevel") {
      if (bg) st.setProperty("--pk-bg", bg);
      if (fg) st.setProperty("--pk-fg", fg);
    } else {
      if (bg) st.background = bg;
      if (fg) st.color = fg;
    }
    if (fnt) st.font = fnt;

    if (o.textvariable != null) s.tvar = varId(o.textvariable);
    if (o.variable != null) s.vid = varId(o.variable);
    if (o.command !== undefined) s.cmd = cbId(o.command);

    const label = o.label != null && (s.kind === "button" || s.kind === "scale");
    const txt = s.tvar != null ? Tk.vars.get(s.tvar)
      : (label ? o.label : (o.text !== undefined ? o.text : (o.name !== undefined ? o.name : undefined)));
    if (s.text && txt !== undefined && !(s.tvar != null && txt == null)) s.text.textContent = String(txt);
    if (s.cap && o.label != null) s.cap.textContent = String(o.label);

    if (o.width != null) {
      const w = num(o.width, 0);
      if (s.kind === "frame" || s.kind === "labelframe" || s.kind === "text" || s.kind === "tk" || s.kind === "toplevel") st.width = Math.max(0, w) + "px";
      else if (s.kind === "entry") st.width = Math.max(3, w) + "ch";
      else if (s.kind === "scale") st.width = Math.max(60, w) + "px";
      else st.minWidth = Math.max(0, w) + "ch";
    }
    if (o.height != null) {
      const hh = num(o.height, 0);
      if (s.kind === "text") st.height = Math.max(1, hh) * 1.35 + "em";
      else if (s.kind === "frame" || s.kind === "labelframe" || s.kind === "tk" || s.kind === "toplevel") st.height = Math.max(0, hh) + "px";
    }
    if (o.wraplength != null) st.maxWidth = Math.max(20, num(o.wraplength, 200)) + "px";
    if (o.justify) st.textAlign = o.justify === "center" ? "center" : o.justify === "right" ? "right" : "left";
    if (o.anchor) {
      const anc = String(o.anchor);
      st.textAlign = anc.indexOf("w") >= 0 ? "left" : anc.indexOf("e") >= 0 ? "right" : "center";
    }
    if (o.padx != null || o.pady != null) {
      const boxy = s.kind === "label" || s.kind === "button";
      st.padding = padPair(
        o.padx != null ? o.padx : (boxy ? 0 : 1),
        o.pady != null ? o.pady : 1
      );
    }

    const rel = o.relief != null ? String(o.relief) : null;
    if (rel) {
      const bw = Math.max(1, num(o.bd != null ? o.bd : o.borderwidth, 2));
      st.borderWidth = bw + "px";
      st.borderStyle = rel === "flat" ? "solid" : rel === "sunken" ? "inset" : rel === "raised" ? "outset"
        : rel === "groove" ? "groove" : rel === "ridge" ? "ridge" : "solid";
    } else if (o.bd != null || o.borderwidth != null) {
      st.borderWidth = Math.max(0, num(o.bd != null ? o.bd : o.borderwidth, 0)) + "px";
    }
    if (o.cursor) st.cursor = String(o.cursor);
    if (o.highlightbackground != null && bg) st.background = bg;

    if (o.state != null) {
      const off = String(o.state) === "disabled" || String(o.state) === "readonly";
      if ("disabled" in s.el) s.el.disabled = off;
      if (s.input) s.input.disabled = off;
      s.el.classList.toggle("pgtk-off", off);
      if (s.kind === "entry") s.el.readOnly = String(o.state) === "readonly" || off;
    }
    if (s.kind === "entry" && o.show != null && String(o.show) !== "") s.el.type = "password";

    if (s.kind === "scale") {
      s.from = o.from_ != null ? num(o.from_, 0) : (o.from != null ? num(o.from, 0) : 0);
      s.to = o.to != null ? num(o.to, 100) : 100;
      if (s.input) {
        s.input.min = String(s.from); s.input.max = String(s.to);
        s.input.step = String(num(o.resolution, 1));
        if (o.orient === "vertical") s.el.classList.add("pgtk-vert");
      }
      if (s.showvalue === false || o.showvalue === 0 || o.showvalue === false) {
        if (s.out) s.out.style.display = "none";
      }
      showScale(s);
    }
    if (s.kind === "checkbutton" || s.kind === "radiobutton") {
      if (o.value != null) s.value = o.value;
      if (s.input && s.kind === "radiobutton") {
        s.input.value = String(s.value != null ? s.value : "");
        // без імені браузер зліпив би всі радіокнопки сторінки в одну групу
        s.input.name = "pgtk-r" + (s.parent || 0) + "-" + (s.vid != null ? "v" + s.vid : "w" + s.id);
      }
      syncVarWidget(s);
    }
    if (s.titleEl && o.title != null) s.titleEl.textContent = String(o.title);
  }

  function padPair(x, y) {
    const a = Array.isArray(x) ? x : [x, x];
    const b = Array.isArray(y) ? y : [y, y];
    const px = (v) => (v == null ? 0 : num(v, 0)) + "px";
    return px(b[0]) + " " + px(a[1]) + " " + px(b[1]) + " " + px(a[0]);
  }

  /* ---------- компонування ---------- */
  function detach(s) {
    if (s.el && s.el.parentElement && s.layout !== "place") s.el.remove();
  }

  function tkPack(s, kw) {
    const p = Tk.nodes.get(s.parent);
    const body = bodyOf(p) || hostNode();
    const horiz = kw.side === "left" || kw.side === "right";
    if (s.layout !== "pack") { detach(s); s.layout = "pack"; s.el.style.display = ""; }
    if (s.el.parentElement && s.el.parentElement._pgHoriz !== horiz) s.el.remove();
    let row = body.lastElementChild;
    if (!row || !row._pgRow || row._pgHoriz !== horiz || row === s.el) {
      row = el("div", horiz ? "pgtk-packrow" : "pgtk-packcol");
      row._pgRow = true; row._pgHoriz = horiz;
      body.appendChild(row);
    }
    if (kw.side === "right") row.insertBefore(s.el, row.firstChild);
    else if (s.el.parentElement !== row) row.appendChild(s.el);

    const st = s.el.style;
    const m = margin(kw.padx, kw.pady);
    st.margin = m;
    st.flex = kw.expand ? "1 1 auto" : "0 0 auto";
    const fill = String(kw.fill || "none");
    if (!horiz) {
      st.alignSelf = fill === "x" || fill === "both" ? "stretch" : (kw.anchor ? alignSelf(kw.anchor) : "flex-start");
      if (fill === "y" || fill === "both") st.flexGrow = "1";
    } else {
      st.alignSelf = fill === "y" || fill === "both" ? "stretch" : (kw.anchor ? alignSelf(kw.anchor) : "center");
      if (fill === "x" || fill === "both") st.flexGrow = "1";
    }
    if (kw.ipadx != null) st.padding = "0";
  }

  function alignSelf(anchor) {
    const a = String(anchor || "");
    if (a.indexOf("n") >= 0) return "flex-start";
    if (a.indexOf("s") >= 0) return "flex-end";
    return "center";
  }

  function margin(x, y) {
    const px = (v) => (v == null ? 0 : num(v, 0)) + "px";
    const a = Array.isArray(x) ? [x[0], x[1]] : [x, x];
    const b = Array.isArray(y) ? [y[0], y[1]] : [y, y];
    return px(b[0]) + " " + px(a[1]) + " " + px(b[1]) + " " + px(a[0]);
  }

  function tkGrid(s, kw) {
    const p = Tk.nodes.get(s.parent);
    const body = bodyOf(p) || hostNode();
    let g = null;
    for (let i = 0; i < body.children.length; i++) {
      if (body.children[i]._pgGrid) { g = body.children[i]; break; }
    }
    if (!g) { g = el("div", "pgtk-grid"); g._pgGrid = true; body.appendChild(g); }
    if (s.el.parentElement !== g) g.appendChild(s.el);
    s.layout = "grid";
    s.el.style.display = "";

    s.gr = null; s.gc = null;
    if (p) {
      if (kw.row != null) { p._gcol = -1; }
      s.gr = kw.row != null ? Number(kw.row) : (p._grow == null ? 0 : p._grow);
      s.gc = kw.column != null ? Number(kw.column) : ((p._gcol = (p._gcol == null ? -1 : p._gcol) + 1));
      if (kw.row != null) p._grow = s.gr;
      if (kw.column != null) p._gcol = s.gc;
      if (p._grow == null) p._grow = s.gr;
      if (p._gcol == null) p._gcol = s.gc;
    } else {
      s.gr = num(kw.row, 0); s.gc = num(kw.column, 0);
    }
    s.gcs = Math.max(1, num(kw.columnspan, 1));
    s.el.style.gridRow = (s.gr + 1) + " / span " + Math.max(1, num(kw.rowspan, 1));
    s.el.style.gridColumn = (s.gc + 1) + " / span " + s.gcs;
    const m = margin(kw.padx, kw.pady);
    s.el.style.margin = m;
    const sticky = String(kw.sticky || "");
    s.el.style.justifySelf = /e/.test(sticky) && /w/.test(sticky) ? "stretch" : /w/.test(sticky) ? "start"
      : /e/.test(sticky) ? "end" : /center/.test(sticky) ? "center" : "";
    s.el.style.alignSelf = /n/.test(sticky) && /s/.test(sticky) ? "stretch" : /n/.test(sticky) ? "start"
      : /s/.test(sticky) ? "end" : "center";
    let maxc = 0;
    Array.prototype.forEach.call(g.children, (c) => {
      const n = Tk.nodes.get(Number(c.dataset.pg));
      if (n && n.gc != null && n.gc + (n.gcs || 1) > maxc) maxc = n.gc + (n.gcs || 1);
    });
    g.style.gridTemplateColumns = "repeat(" + Math.max(1, maxc) + ", auto)";
  }

  function tkPlace(s, kw) {
    const p = Tk.nodes.get(s.parent);
    const body = bodyOf(p) || hostNode();
    body.style.position = "relative";
    if (s.el.parentElement !== body) body.appendChild(s.el);
    s.layout = "place";
    s.el.style.display = "";
    const st = s.el.style;
    st.position = "absolute";
    st.left = kw.x != null ? num(kw.x, 0) + "px" : kw.relx != null ? num(kw.relx, 0) * 100 + "%" : "";
    st.top = kw.y != null ? num(kw.y, 0) + "px" : kw.rely != null ? num(kw.rely, 0) * 100 + "%" : "";
    if (kw.width != null) st.width = num(kw.width, 0) + "px";
    else if (kw.relwidth != null) st.width = num(kw.relwidth, 0) * 100 + "%";
    if (kw.height != null) st.height = num(kw.height, 0) + "px";
    else if (kw.relheight != null) st.height = num(kw.relheight, 0) * 100 + "%";
  }

  function tkDestroy(id) {
    id = Number(id);
    const s = Tk.nodes.get(id);
    if (!s) return;
    const doomed = [id];
    let added = true;
    while (added) {
      added = false;
      Tk.nodes.forEach((n) => {
        if (doomed.indexOf(n.parent) >= 0 && doomed.indexOf(n.id) < 0) { doomed.push(n.id); added = true; }
      });
    }
    doomed.forEach((k) => {
      const n = Tk.nodes.get(k);
      if (n && n.el) n.el.remove();
      Tk.nodes.delete(k);
    });
    const i = Tk.roots.indexOf(id);
    if (i >= 0) Tk.roots.splice(i, 1);
    if (Tk.def === id) Tk.def = Tk.roots.length ? Tk.roots[Tk.roots.length - 1] : null;
    Turt.turtles.forEach((t) => { void t; });
  }

  function fireBind(s, ev) {
    const k = String(ev.keysym || "").toLowerCase();
    const c = String(ev.char || "").toLowerCase();
    (s.binds || []).slice().forEach((b) => {
      if (b.type !== ev.type) return;
      if (!b.key || b.key === k || b.key === c) runCb(b.cb, [JSON.stringify(ev)]);
    });
  }

  // назви Tcl -> назви клавіш DOM
  const TK_KEY = {
    return: "enter", kp_enter: "enter", enter: "enter", escape: "escape", esc: "escape",
    space: " ", key: "", keypress: "",
    up: "arrowup", down: "arrowdown", left: "arrowleft", right: "arrowright",
    tab: "tab", backspace: "backspace", delete: "delete",
    home: "home", end: "end", prior: "pageup", next: "pagedown",
    control: "control", control_l: "control", shift: "shift", shift_l: "shift",
    alt: "alt", alt_l: "alt", f1: "f1", f2: "f2", f3: "f3", f4: "f4", f5: "f5",
    f6: "f6", f7: "f7", f8: "f8", f9: "f9", f10: "f10", f11: "f11", f12: "f12"
  };

  function evObj(type, keysym, char, x, y, num2) {
    return { type, keysym: keysym || "", char: char || "", x: x || 0, y: y || 0, num: num2 || 1 };
  }

  function tkBind(s, seq, cb) {
    if (!s) return;
    const raw = String(seq || "").trim();
    const m = /^<([^>]+)>$/.exec(raw);
    const low = (m ? m[1] : raw).toLowerCase();
    const isBtn = /^button-?\d+$/.test(low);
    const key = isBtn ? "" : (TK_KEY[low] !== undefined ? TK_KEY[low] : low);
    s.binds = s.binds || [];
    s.binds.push({ type: isBtn ? "Button" : "Key", key, cb: cbId(cb), raw });

    if (s.kind === "tk" || s.kind === "toplevel") {
      if (!s.winKey) {
        s.winKey = (ev) => {
          fireBind(s, evObj("Key", ev.key, ev.key.length === 1 ? ev.key : "", 0, 0));
        };
        window.addEventListener("keydown", s.winKey);
      }
      return;
    }
    const target = s.input || s.el;
    if (!s.keyBound) {
      s.keyBound = true;
      target.addEventListener("keydown", (ev) => {
        const e = evObj("Key", ev.key, ev.key.length === 1 ? ev.key : "", 0, 0);
        fireBind(s, e);
        const root = Tk.nodes.get(Tk.def);
        if (root && root !== s) fireBind(root, e);
      });
    }
    if (isBtn && !s.btnBound) {
      s.btnBound = true;
      target.addEventListener("click", (ev) => {
        const r = (s.el || target).getBoundingClientRect ? (s.el || target).getBoundingClientRect() : null;
        const x = r ? ev.clientX - r.left : 0;
        const y = r ? ev.clientY - r.top : 0;
        fireBind(s, evObj("Button", "", "", Math.round(x), Math.round(y), 1));
      });
    }
  }

  function textIndex(s, idx, len) {
    const str = String(idx == null ? "end" : idx);
    if (/^end/i.test(str)) return len;
    const m = /^(\d+)\.(\d+)/.exec(str);
    if (m) {
      const lines = s.el.value.split("\n");
      let pos = 0;
      const line = clamp(Number(m[1]) - 1, 0, lines.length);
      for (let i = 0; i < line; i++) pos += lines[i].length + 1;
      return clamp(pos + Number(m[2] || 0), 0, len);
    }
    if (/^insert/i.test(str)) return s.el.selectionStart == null ? 0 : s.el.selectionStart;
    return clamp(num(str, len), 0, len);
  }

  function syncEntryVar(s) {
    if (s.tvar != null) { Tk.vars.set(s.tvar, s.el.value); refreshVar(s.tvar, s.id); }
  }

  function msgBox(a) {
    const kind = String(a[0] || "info");
    const title = String(a[1] == null ? "" : a[1]);
    const message = String(a[2] == null ? "" : a[2]);
    const cb = cbId(a[3]);
    const bd = el("div", "pgtk-dlgback");
    const card = el("div", "pgtk-dlg");
    const head = el("div", "pgtk-dlghead");
    head.append(el("span", "pgtk-dlgico", MBICO[kind] || "💬"), el("span", "pgtk-dlgtitle", title || "tkinter"));
    const body = el("div", "pgtk-dlgbody", message);
    const acts = el("div", "pgtk-dlgacts");
    let input = null;
    if (kind === "integer" || kind === "string") {
      input = el("input", "pgtk-dlginput");
      input.type = kind === "integer" ? "number" : "text";
      body.appendChild(input);
    }
    const close = () => {
      bd.classList.add("pgtk-out");
      setTimeout(() => {
        const i = Tk.dialogs.indexOf(bd);
        if (i >= 0) Tk.dialogs.splice(i, 1);
        if (bd.parentNode) bd.remove();
      }, 140);
    };
    (MBT[kind] || [["OK", "ok"]]).forEach((b) => {
      const btn = el("button", "pgtk-dlgbtn" + (b[1] === "ok" || b[1] === "yes" || b[1] === "retry" ? " pgtk-dlggo" : ""), b[0]);
      btn.type = "button";
      btn.onclick = () => {
        let ans = b[1];
        if (input) ans = b[1] === "cancel" ? "cancel" : input.value;
        sfx(b[1] === "no" || b[1] === "cancel" ? "error" : "success");
        close();
        runCb(cb, [ans]);
      };
      acts.appendChild(btn);
    });
    card.append(head, body, acts);
    bd.appendChild(card);
    document.body.appendChild(bd);
    Tk.dialogs.push(bd);
    setTimeout(() => { const f = acts.querySelector("button") || input; f && f.focus(); }, 40);
  }

  /* ---------- операції tkinter ---------- */
  function tkOp(op, h, a, kw) {
    if (op === "new") return { v: tkNew(String(a[0] || "frame"), a[1] == null ? null : Number(a[1]), kw) };
    if (op === "newvar") {
      const id = ++Tk.seq;
      Tk.vars.set(id, a[0] ? String(a[0]) : null);
      return { v: id };
    }
    if (op === "setvar") { Tk.vars.set(Number(h), a[0]); refreshVar(Number(h)); return; }
    if (op === "getvar") { const v = Tk.vars.get(Number(h)); return { v: v === undefined ? null : v }; }
    if (op === "msgbox") { msgBox(a); return; }

    const s = nodeOf(h);
    switch (op) {
      case "cfg":
        if (s) { s.opts = Object.assign(s.opts || {}, kw || {}); applyOpts(s); if (s.tvar != null) refreshVar(s.tvar, s.id); if (s.vid != null) syncVarWidget(s); }
        return;
      case "pack": if (s) { s.el.dataset.pg = String(s.id); tkPack(s, kw || {}); } return;
      case "grid": if (s) { s.el.dataset.pg = String(s.id); tkGrid(s, kw || {}); } return;
      case "place": if (s) { s.el.dataset.pg = String(s.id); tkPlace(s, kw || {}); } return;
      case "forget":
        if (s) s.el.style.display = "none";
        return;
      case "destroy": tkDestroy(Number(h)); return;
      case "title":
        if (s && s.titleEl) s.titleEl.textContent = String(a[0] == null ? "tk" : a[0]);
        return;
      case "geometry": {
        if (!s) return;
        const m = /^(\d+)x(\d+)/.exec(String(a[0] || ""));
        if (m) { s.el.style.width = Number(m[1]) + "px"; s.el.style.height = Number(m[2]) + "px"; }
        const off = /([+-]\d+)([+-]\d+)$/.exec(String(a[0] || ""));
        if (off) { s.el.style.marginLeft = off[1] + "px"; }
        return;
      }
      case "hide": if (s) s.el.style.display = "none"; return;
      case "show": if (s) s.el.style.display = ""; return;
      case "mainloop": case "update": case "resizable": case "minsize": case "maxsize":
        return;
      case "focus": if (s) { const t = s.input || s.el; t.focus && t.focus(); } return;
      case "after": {
        if (!s) return;
        const ms = clamp(num(a[0], 0), 0, 600000);
        const id = setTimeout(() => runCb(cbId(a[1])), ms);
        Tk.timers.push(id);
        return { v: id };
      }
      case "cancel": {
        const id = Number(a[0]);
        const i = Tk.timers.indexOf(id);
        if (i >= 0) { clearTimeout(id); Tk.timers.splice(i, 1); }
        return;
      }
      case "bind": if (s) tkBind(s, a[0], a[1]); return;
      case "invoke": if (s) runCb(s.cmd); return;
      case "select": if (s) setState(s, num(a[0], 1) === 2 ? (s.value != null ? s.value : onVal(s)) : onVal(s)); return;
      case "deselect": if (s) setState(s, offVal(s)); return;
      case "toggle": if (s) setState(s, String(getState(s)) === String(onVal(s)) ? offVal(s) : onVal(s)); return;
      case "get":
        if (!s) return { v: "" };
        if (s.kind === "scale") return { v: num(getState(s), s.from || 0) };
        if (s.kind === "checkbutton" || s.kind === "radiobutton") {
          const v = getState(s);
          return { v: v == null ? offVal(s) : v };
        }
        if (s.el.value != null) return { v: String(s.el.value) };
        return { v: s.text ? String(s.text.textContent) : "" };
      case "setvalue": if (s) { setState(s, a[0]); showScale(s); } return;
      case "insert": {
        if (!s) return;
        const txt = String(a[1] == null ? "" : a[1]);
        if (s.kind === "text") {
          const at = textIndex(s, a[0], s.el.value.length);
          s.el.value = s.el.value.slice(0, at) + txt + s.el.value.slice(at);
        } else {
          const at = s.kind === "entry" && s.el.selectionStart != null ? s.el.selectionStart : s.el.value.length;
          s.el.value = s.el.value.slice(0, at) + txt + s.el.value.slice(at);
          try { s.el.setSelectionRange(at + txt.length, at + txt.length); } catch (e) { /* password */ }
        }
        syncEntryVar(s);
        return;
      }
      case "delete": {
        if (!s) return;
        const v = s.el.value;
        const from = textIndex(s, a[0], v.length);
        const to = a[1] == null ? (s.kind === "text" ? from + 1 : v.length) : textIndex(s, a[1], v.length);
        const end = clamp(Math.max(from, to), 0, v.length);
        s.el.value = v.slice(0, from) + v.slice(end);
        syncEntryVar(s);
        return;
      }
      default: return;
    }
  }

  /* ---------- магістраль Python -> JS ---------- */
  function dispatch(req) {
    const mod = req[0], op = req[1], h = req[2], a = req[3] || [], kw = req[4] || {};
    if (mod === "turtle") return turtOp(op, h, a, kw);
    if (mod === "tk") return tkOp(op, h, a, kw);
    return { e: "PyGui: невідома операція " + mod };
  }

  const api = {
    pygui_call(txt) {
      let req;
      try {
        req = JSON.parse(String(txt));
      } catch (e) {
        return JSON.stringify({ e: "PyGui: пошкоджений запит" });
      }
      try {
        return JSON.stringify(dispatch(req) || {});
      } catch (e) {
        console.warn("[PyGui]", e);
        return JSON.stringify({ e: "PyGui: " + (e && e.message ? e.message : String(e)) });
      }
    },
    pygui_cb(fn) {
      const id = ++cbSeq;
      // Pyodide руйнує поз позиченого проксі після повернення з виклику,
      // тому копіюємо: без цього кнопка «Натисни» не мала б що викликати.
      let keep = fn;
      try {
        if (fn && typeof fn.copy === "function") keep = fn.copy();
      } catch (e) { keep = fn; }
      CBA.set(id, keep);
      return id;
    }
  };

  /* ==================== Python-шими ==================== */

  const SRC_TURTLE = [
    "# turtle — черепашача графіка у браузері (власний рушій, без Tk)",
    "",
    "_DEF = []",
    "",
    "_TURTLE_OPS = {",
    "    'forward': ('forward', 'fd'),",
    "    'backward': ('backward', 'bk', 'back'),",
    "    'left': ('left', 'lt'),",
    "    'right': ('right', 'rt'),",
    "    'penup': ('penup', 'pu', 'up'),",
    "    'pendown': ('pendown', 'pd', 'down'),",
    "    'hideturtle': ('hideturtle', 'ht'),",
    "    'showturtle': ('showturtle', 'st'),",
    "    'setheading': ('setheading', 'seth'),",
    "    'goto': ('goto', 'setpos', 'setposition'),",
    "    'setx': ('setx',),",
    "    'sety': ('sety',),",
    "    'circle': ('circle',),",
    "    'pensize': ('pensize', 'width'),",
    "    'pencolor': ('pencolor',),",
    "    'fillcolor': ('fillcolor',),",
    "    'color': ('color',),",
    "    'speed': ('speed',),",
    "    'shape': ('shape',),",
    "    'begin_fill': ('begin_fill',),",
    "    'end_fill': ('end_fill',),",
    "    'write': ('write',),",
    "    'stamp': ('stamp',),",
    "    'dot': ('dot',),",
    "    'clear': ('clear',),",
    "    'reset': ('reset',),",
    "    'home': ('home',),",
    "    'position': ('position', 'pos'),",
    "    'heading': ('heading',),",
    "    'xcor': ('xcor',),",
    "    'ycor': ('ycor',),",
    "    'distance': ('distance',),",
    "    'towards': ('towards',),",
    "    'isdown': ('isdown',),",
    "    'isvisible': ('isvisible',),",
    "}",
    "",
    "_SCREEN_OPS = {",
    "    'bgcolor': ('bgcolor',),",
    "    'setup': ('setup',),",
    "    'screensize': ('screensize',),",
    "    'title': ('title',),",
    "    'clearscreen': ('clearscreen', 'cs'),",
    "    'resetscreen': ('resetscreen', 'rs'),",
    "    'colormode': ('colormode',),",
    "    'listen': ('listen',),",
    "    'onkey': ('onkey',),",
    "    'onscreenclick': ('onscreenclick',),",
    "    'ontimer': ('ontimer',),",
    "    'done': ('done', 'exitonclick'),",
    "    'mainloop': ('mainloop',),",
    "    'bye': ('bye',),",
    "    'tracer': ('tracer',),",
    "    'delay': ('delay',),",
    "    'update': ('update',),",
    "}",
    "",
    "",
    "def _m(op):",
    "    def _f(self, *args, **kw):",
    "        return _call('turtle', op, self._h, list(args), dict(kw))",
    "    _f.__name__ = op",
    "    return _f",
    "",
    "",
    "def _d(op):",
    "    def _f(*args, **kw):",
    "        return _call('turtle', op, _default()._h, list(args), dict(kw))",
    "    _f.__name__ = op",
    "    return _f",
    "",
    "",
    "def _s(op):",
    "    def _f(*args, **kw):",
    "        return _call('turtle', op, None, list(args), dict(kw))",
    "    _f.__name__ = op",
    "    return _f",
    "",
    "",
    "def _pair(x, y):",
    "    if y is None and isinstance(x, (list, tuple)) and len(x) >= 2:",
    "        return x[0], x[1]",
    "    return x, y",
    "",
    "",
    "class Turtle(object):",
    "    def __init__(self, shape=None, colors=None, screen=None, mode=None):",
    "        kw = {}",
    "        if shape is not None:",
    "            kw['shape'] = shape",
    "        if colors is not None:",
    "            kw['color'] = colors",
    "        self._h = int(_call('turtle', 'new', None, [], kw))",
    "        if not _DEF:",
    "            _DEF.append(self)",
    "",
    "    def goto(self, x, y=None):",
    "        x, y = _pair(x, y)",
    "        return _call('turtle', 'goto', self._h, [x, y], {})",
    "",
    "    def pensize(self, width=None):",
    "        if width is None:",
    "            return _call('turtle', 'pensize', self._h, [], {})",
    "        return _call('turtle', 'pensize', self._h, [width], {})",
    "",
    "    def speed(self, s=None):",
    "        if s is None:",
    "            return _call('turtle', 'speed', self._h, [], {})",
    "        return _call('turtle', 'speed', self._h, [s], {})",
    "",
    "    def shape(self, s=None):",
    "        if s is None:",
    "            return _call('turtle', 'shape', self._h, [], {})",
    "        return _call('turtle', 'shape', self._h, [s], {})",
    "",
    "    def pencolor(self, *args):",
    "        if not args:",
    "            return _call('turtle', 'pencolor', self._h, [], {})",
    "        return _call('turtle', 'pencolor', self._h, list(args), {})",
    "",
    "    def fillcolor(self, *args):",
    "        if not args:",
    "            return _call('turtle', 'fillcolor', self._h, [], {})",
    "        return _call('turtle', 'fillcolor', self._h, list(args), {})",
    "",
    "    def write(self, s, font=None, align=None, mode=None):",
    "        kw = {}",
    "        if font is not None:",
    "            kw['font'] = list(font) if isinstance(font, (list, tuple)) else font",
    "        if align is not None:",
    "            kw['align'] = align",
    "        return _call('turtle', 'write', self._h, [s], kw)",
    "",
    "    def circle(self, radius, extent=360, steps=None):",
    "        return _call('turtle', 'circle', self._h, [radius, extent], {})",
    "",
    "    def dot(self, size=None, color=None):",
    "        args = []",
    "        if size is not None:",
    "            args.append(size)",
    "        if color is not None:",
    "            args.append(color)",
    "        return _call('turtle', 'dot', self._h, args, {})",
    "",
    "    def position(self):",
    "        p = _call('turtle', 'position', self._h, [], {})",
    "        return tuple(p) if isinstance(p, list) else p",
    "",
    "    def distance(self, x, y=None):",
    "        x, y = _pair(x, y)",
    "        return _call('turtle', 'distance', self._h, [x, y], {})",
    "",
    "    def towards(self, x, y=None):",
    "        x, y = _pair(x, y)",
    "        return _call('turtle', 'towards', self._h, [x, y], {})",
    "",
    "    def __repr__(self):",
    "        return '<turtle.Turtle object ' + str(self.position()) + '>'",
    "",
    "",
    "# решту методів генеруємо, але власні реалізації вище не перезаписуємо",
    "for _op, _names in _TURTLE_OPS.items():",
    "    if _op not in Turtle.__dict__:",
    "        setattr(Turtle, _op, _m(_op))",
    "    for _n in _names:",
    "        if _n not in Turtle.__dict__:",
    "            setattr(Turtle, _n, getattr(Turtle, _op))",
    "",
    "RawTurtle = Turtle",
    "",
    "",
    "def _default():",
    "    if not _DEF:",
    "        _DEF.append(Turtle())",
    "    return _DEF[0]",
    "",
    "",
    "for _op, _names in _TURTLE_OPS.items():",
    "    for _n in _names:",
    "        globals()[_n] = _d(_op)",
    "",
    "",
    "class TurtleScreen(object):",
    "    _h = None",
    "",
    "    def __init__(self, *args, **kw):",
    "        _call('turtle', 'screen', None, [], {})",
    "",
    "    def __repr__(self):",
    "        return '<turtle.Screen>'",
    "",
    "",
    "for _op, _names in _SCREEN_OPS.items():",
    "    if _op not in TurtleScreen.__dict__:",
    "        setattr(TurtleScreen, _op, _m(_op))",
    "    for _n in _names:",
    "        if _n not in TurtleScreen.__dict__:",
    "            setattr(TurtleScreen, _n, getattr(TurtleScreen, _op))",
    "    globals()[_op] = _s(_op)",
    "    for _n in _names:",
    "        globals().setdefault(_n, _s(_op))",
    "",
    "TurtleScreenBase = TurtleScreen",
    "",
    "_SCREEN = []",
    "",
    "",
    "def Screen():",
    "    if not _SCREEN:",
    "        _SCREEN.append(TurtleScreen())",
    "    return _SCREEN[0]",
    "",
    "",
    "def getscreen():",
    "    return Screen()",
    "",
    "",
    "def getturtle():",
    "    return _default()",
    "",
    "",
    "def Pen():",
    "    return Turtle()",
    "",
    "",
    "def TurtleScreenClass():",
    "    return Screen()"
  ].join("\n");

  const SRC_TK = [
    "# tkinter — вікна та віджети у браузері (власний рушій, без Tcl/Tk)",
    "import sys",
    "",
    "TOP = 'top'; BOTTOM = 'bottom'; LEFT = 'left'; RIGHT = 'right'",
    "BOTH = 'both'; X = 'x'; Y = 'y'; NONE = 'none'",
    "N = 'n'; S = 's'; E = 'e'; W = 'w'",
    "NW = 'nw'; NE = 'ne'; SW = 'sw'; SE = 'se'",
    "CENTER = 'center'; ANCHOR = 'anchor'; BASELINE = 'baseline'",
    "END = 'end'; INSERT = 'insert'; FIRST = '1.0'; LAST = 'end'",
    "HORIZONTAL = 'horizontal'; VERTICAL = 'vertical'",
    "SUNKEN = 'sunken'; RAISED = 'raised'; FLAT = 'flat'",
    "GROOVE = 'groove'; RIDGE = 'ridge'; SOLID = 'solid'",
    "NORMAL = 'normal'; DISABLED = 'disabled'; ACTIVE = 'active'",
    "READONLY = 'readonly'; WORD = 'word'; CHAR = 'char'",
    "ALL = 'all'; EXTENDED = 'extended'",
    "TkVersion = '8.6 (PyGui browser)'",
    "_ = None",
    "",
    "_default_root = []",
    "",
    "",
    "class TclError(Exception):",
    "    pass",
    "",
    "",
    "def _merge(cnf, kw):",
    "    out = {}",
    "    if isinstance(cnf, dict):",
    "        for k in cnf:",
    "            out[str(k)] = cnf[k]",
    "    elif isinstance(cnf, (list, tuple)):",
    "        for item in cnf:",
    "            if isinstance(item, (list, tuple)) and len(item) == 2:",
    "                out[str(item[0])] = item[1]",
    "    if kw:",
    "        for k in kw:",
    "            out[str(k)] = kw[k]",
    "    return out",
    "",
    "",
    "class Event(object):",
    "    def __init__(self, data=None):",
    "        if isinstance(data, str):",
    "            try:",
    "                data = _json.loads(data)",
    "            except Exception:",
    "                data = {}",
    "        d = data or {}",
    "        self.keysym = d.get('keysym', '')",
    "        self.char = d.get('char', '')",
    "        self.keycode = d.get('keycode', 0)",
    "        self.x = d.get('x', 0)",
    "        self.y = d.get('y', 0)",
    "        self.num = d.get('num', 1)",
    "        self.type = d.get('type', 'Key')",
    "        self.widget = None",
    "        self.width = 0",
    "        self.height = 0",
    "        self.send_event = None",
    "        self.time = 0",
    "",
    "",
    "class Misc(object):",
    "    _kind = 'frame'",
    "",
    "    def _make(self, master, cnf, kw):",
    "        pid = getattr(master, '_h', None)",
    "        opts = _merge(cnf, kw)",
    "        if self._kind not in ('tk', 'toplevel') and pid is None:",
    "            if not _default_root or _default_root[0] is None:",
    "                _default_root[:] = [Tk()]",
    "            pid = _default_root[0]._h",
    "        self._opts = {}",
    "        self._kids = []",
    "        self._h = int(_call('tk', 'new', None, [self._kind, pid], opts))",
    "        self._opts.update(opts)",
    "",
    "    def config(self, cnf=None, **kw):",
    "        opts = _merge(cnf, kw)",
    "        for k in opts:",
    "            self._opts[k] = opts[k]",
    "        _call('tk', 'cfg', self._h, [], opts)",
    "        return opts",
    "",
    "    def configure(self, cnf=None, **kw):",
    "        return self.config(cnf, **kw)",
    "",
    "    def cget(self, key):",
    "        if key in self._opts:",
    "            return self._opts[key]",
    "        if key == 'width':",
    "            return 0",
    "        if key == 'height':",
    "            return 0",
    "        return ''",
    "",
    "    def __getitem__(self, key):",
    "        return self.cget(key)",
    "",
    "    def __setitem__(self, key, value):",
    "        self.config(**{str(key): value})",
    "",
    "    def keys(self):",
    "        return list(self._opts.keys())",
    "",
    "    def pack(self, cnf=None, **kw):",
    "        _call('tk', 'pack', self._h, [], _merge(cnf, kw))",
    "",
    "    def grid(self, cnf=None, **kw):",
    "        _call('tk', 'grid', self._h, [], _merge(cnf, kw))",
    "",
    "    def place(self, cnf=None, **kw):",
    "        _call('tk', 'place', self._h, [], _merge(cnf, kw))",
    "",
    "    def _forget(self, how):",
    "        _call('tk', 'forget', self._h, [how], {})",
    "",
    "    def pack_forget(self):",
    "        self._forget('pack')",
    "",
    "    def grid_forget(self):",
    "        self._forget('grid')",
    "",
    "    def grid_remove(self):",
    "        self._forget('grid')",
    "",
    "    def place_forget(self):",
    "        self._forget('place')",
    "",
    "    def forget(self):",
    "        self._forget('')",
    "",
    "    def destroy(self):",
    "        _call('tk', 'destroy', self._h, [], {})",
    "",
    "    def update(self):",
    "        _call('tk', 'update', self._h, [], {})",
    "",
    "    def update_idletasks(self):",
    "        _call('tk', 'update', self._h, [], {})",
    "",
    "    def after(self, ms, func=None, *args):",
    "        if func is None:",
    "            return 0",
    "        if args:",
    "            def _fire():",
    "                func(*args)",
    "            return _call('tk', 'after', self._h, [ms, _fire], {})",
    "        return _call('tk', 'after', self._h, [ms, func], {})",
    "",
    "    def after_idle(self, func=None, *args):",
    "        return self.after(1, func, *args)",
    "",
    "    def after_cancel(self, fid):",
    "        _call('tk', 'cancel', self._h, [fid], {})",
    "",
    "    def bind(self, sequence=None, func=None, add=None):",
    "        if func is None:",
    "            return ''",
    "        def _fire(ev=None):",
    "            func(Event(ev))",
    "        _call('tk', 'bind', self._h, [sequence or '', _fire], {})",
    "        return repr(self)",
    "",
    "    def unbind(self, sequence, funcid=None):",
    "        pass",
    "",
    "    def bind_all(self, sequence=None, func=None, add=None):",
    "        top = _default_root[0] if _default_root else None",
    "        if top is not None:",
    "            return top.bind(sequence, func, add)",
    "        return self.bind(sequence, func, add)",
    "",
    "    def focus_force(self):",
    "        _call('tk', 'focus', self._h, [], {})",
    "",
    "    def focus_set(self):",
    "        _call('tk', 'focus', self._h, [], {})",
    "",
    "    def winfo_children(self):",
    "        return list(self._kids)",
    "",
    "    def winfo_exists(self):",
    "        return 1",
    "",
    "    def winfo_toplevel(self):",
    "        top = _default_root[0] if _default_root else None",
    "        return top if top is not None else self",
    "",
    "    def winfo_width(self):",
    "        return 0",
    "",
    "    def winfo_height(self):",
    "        return 0",
    "",
    "    def grid_propagate(self, flag=0):",
    "        pass",
    "",
    "    def pack_propagate(self, flag=0):",
    "        pass",
    "",
    "    def place_propagate(self, flag=0):",
    "        pass",
    "",
    "    def columnconfigure(self, index, cnf={}, **kw):",
    "        pass",
    "",
    "    def rowconfigure(self, index, cnf={}, **kw):",
    "        pass",
    "",
    "    def grid_columnconfigure(self, index, cnf={}, **kw):",
    "        pass",
    "",
    "    def grid_rowconfigure(self, index, cnf={}, **kw):",
    "        pass",
    "",
    "    def lift(self, inwindow=None):",
    "        pass",
    "",
    "    def lower(self, inwindow=None):",
    "        pass",
    "",
    "    def grab_set(self):",
    "        pass",
    "",
    "    def grab_release(self):",
    "        pass",
    "",
    "    def __repr__(self):",
    "        return self._kind + ' object'",
    "",
    "",
    "class Tk(Misc):",
    "    _kind = 'tk'",
    "",
    "    def __init__(self, screenName=None, baseName=None, className='Tk',",
    "                 useTk=1, sync=None, name=None, cnf=None, **kw):",
    "        Misc._make(self, None, cnf, kw)",
    "        _default_root[:] = [self]",
    "",
    "    def title(self, string=None):",
    "        if string is None:",
    "            return ''",
    "        _call('tk', 'title', self._h, [string], {})",
    "        return string",
    "",
    "    def wm_title(self, string=None):",
    "        return self.title(string)",
    "",
    "    def geometry(self, newGeometry=None):",
    "        if newGeometry is None:",
    "            return ''",
    "        _call('tk', 'geometry', self._h, [newGeometry], {})",
    "        return newGeometry",
    "",
    "    def resizable(self, width=None, height=None):",
    "        _call('tk', 'resizable', self._h, [width, height], {})",
    "",
    "    def minsize(self, width=None, height=None):",
    "        pass",
    "",
    "    def maxsize(self, width=None, height=None):",
    "        pass",
    "",
    "    def withdraw(self):",
    "        _call('tk', 'hide', self._h, [], {})",
    "",
    "    def iconify(self):",
    "        self.withdraw()",
    "",
    "    def deiconify(self):",
    "        _call('tk', 'show', self._h, [], {})",
    "",
    "    def attributes(self, *args):",
    "        pass",
    "",
    "    def overrideredirect(self, boolean=None):",
    "        pass",
    "",
    "    def protocol(self, name=None, func=None):",
    "        pass",
    "",
    "    def iconbitmap(self, defaultNone=None, *args):",
    "        pass",
    "",
    "    def iconphoto(self, defaultNone=None, *args):",
    "        pass",
    "",
    "    def iconname(self, name=None):",
    "        pass",
    "",
    "    def client(self, name):",
    "        return ''",
    "",
    "    def call(self, *args):",
    "        return ''",
    "",
    "    def eval(self, *args):",
    "        return ''",
    "",
    "    def quit(self):",
    "        pass",
    "",
    "    def mainloop(self, n=0):",
    "        _call('tk', 'mainloop', self._h, [n], {})",
    "",
    "    def destroy(self):",
    "        if _default_root and _default_root[0] is self:",
    "            _default_root[:] = [None]",
    "        Misc.destroy(self)",
    "",
    "",
    "class Toplevel(Tk):",
    "    _kind = 'toplevel'",
    "",
    "    def __init__(self, master=None, cnf=None, **kw):",
    "        Misc._make(self, master, cnf, kw)",
    "",
    "",
    "class Frame(Misc):",
    "    _kind = 'frame'",
    "",
    "    def __init__(self, master=None, cnf=None, **kw):",
    "        Misc._make(self, master, cnf, kw)",
    "",
    "",
    "class LabelFrame(Frame):",
    "    _kind = 'labelframe'",
    "",
    "",
    "class Label(Misc):",
    "    _kind = 'label'",
    "",
    "    def __init__(self, master=None, cnf=None, **kw):",
    "        Misc._make(self, master, cnf, kw)",
    "",
    "    def flash(self):",
    "        pass",
    "",
    "",
    "class Message(Label):",
    "    _kind = 'message'",
    "",
    "",
    "class Button(Misc):",
    "    _kind = 'button'",
    "",
    "    def __init__(self, master=None, cnf=None, **kw):",
    "        Misc._make(self, master, cnf, kw)",
    "",
    "    def invoke(self):",
    "        _call('tk', 'invoke', self._h, [], {})",
    "",
    "    def flash(self):",
    "        pass",
    "",
    "",
    "class Entry(Misc):",
    "    _kind = 'entry'",
    "",
    "    def __init__(self, master=None, cnf=None, **kw):",
    "        Misc._make(self, master, cnf, kw)",
    "",
    "    def insert(self, index, string):",
    "        _call('tk', 'insert', self._h, [index, string], {})",
    "",
    "    def delete(self, first, last=None):",
    "        _call('tk', 'delete', self._h, [first, last], {})",
    "",
    "    def get(self):",
    "        return _call('tk', 'get', self._h, [], {})",
    "",
    "    def icursor(self, index=None):",
    "        pass",
    "",
    "    def xview(self, *args):",
    "        pass",
    "",
    "    def selection_range(self, a, b):",
    "        pass",
    "",
    "    def select(self, start=None, end=None):",
    "        pass",
    "",
    "",
    "class Text(Misc):",
    "    _kind = 'text'",
    "",
    "    def __init__(self, master=None, cnf=None, **kw):",
    "        Misc._make(self, master, cnf, kw)",
    "",
    "    def insert(self, index, chars, *args):",
    "        _call('tk', 'insert', self._h, [index, chars], {})",
    "",
    "    def delete(self, start, end=None):",
    "        _call('tk', 'delete', self._h, [start, end], {})",
    "",
    "    def get(self, start, end=None):",
    "        return _call('tk', 'get', self._h, [start, end], {})",
    "",
    "    def see(self, index=None):",
    "        pass",
    "",
    "    def yview(self, *args):",
    "        pass",
    "",
    "    def index(self, index):",
    "        return str(index)",
    "",
    "    def tag_config(self, *args, **kw):",
    "        pass",
    "",
    "    def tag_configure(self, *args, **kw):",
    "        pass",
    "",
    "    def mark_set(self, *args):",
    "        pass",
    "",
    "",
    "class Checkbutton(Misc):",
    "    _kind = 'checkbutton'",
    "",
    "    def __init__(self, master=None, cnf=None, **kw):",
    "        Misc._make(self, master, cnf, kw)",
    "",
    "    def select(self):",
    "        _call('tk', 'select', self._h, [1], {})",
    "",
    "    def deselect(self):",
    "        _call('tk', 'select', self._h, [0], {})",
    "",
    "    def toggle(self):",
    "        _call('tk', 'toggle', self._h, [], {})",
    "",
    "    def invoke(self):",
    "        _call('tk', 'toggle', self._h, [], {})",
    "",
    "    def get(self):",
    "        var = self._opts.get('variable')",
    "        if var is None:",
    "            ans = _call('tk', 'get', self._h, [], {})",
    "            return 0 if ans in ('', 0, None, False) else 1",
    "        return var.get()",
    "",
    "",
    "class Radiobutton(Misc):",
    "    _kind = 'radiobutton'",
    "",
    "    def __init__(self, master=None, cnf=None, **kw):",
    "        Misc._make(self, master, cnf, kw)",
    "",
    "    def select(self):",
    "        _call('tk', 'select', self._h, [2], {})",
    "",
    "    def deselect(self):",
    "        pass",
    "",
    "    def invoke(self):",
    "        _call('tk', 'select', self._h, [2], {})",
    "",
    "    def flash(self):",
    "        pass",
    "",
    "    def get(self):",
    "        var = self._opts.get('variable')",
    "        if var is None:",
    "            return ''",
    "        return var.get()",
    "",
    "",
    "class Scale(Misc):",
    "    _kind = 'scale'",
    "",
    "    def __init__(self, master=None, cnf=None, resolution=None,",
    "                 borderwidth=None, **kw):",
    "        if resolution is not None:",
    "            kw['resolution'] = resolution",
    "        if borderwidth is not None:",
    "            kw['bd'] = borderwidth",
    "        Misc._make(self, master, cnf, kw)",
    "",
    "    def get(self):",
    "        var = self._opts.get('variable')",
    "        if var is not None:",
    "            return var.get()",
    "        v = _call('tk', 'get', self._h, [], {})",
    "        try:",
    "            return float(v)",
    "        except (TypeError, ValueError):",
    "            return 0.0",
    "",
    "    def set(self, value):",
    "        _call('tk', 'setvalue', self._h, [value], {})",
    "",
    "    def coordinate(self, index=None):",
    "        return 0",
    "",
    "    def identify(self, x=None, y=None):",
    "        return ''",
    "",
    "",
    "class Separator(Misc):",
    "    _kind = 'separator'",
    "",
    "    def __init__(self, master=None, cnf=None, **kw):",
    "        Misc._make(self, master, cnf, kw)",
    "",
    "",
    "class Variable(object):",
    "    _type = 'auto'",
    "",
    "    def __init__(self, master=None, value=None, name=None, **kw):",
    "        self._vid = int(_call('tk', 'newvar', None, [name or ''], {}))",
    "        if value is not None:",
    "            self.set(value)",
    "",
    "    def get(self):",
    "        v = _call('tk', 'getvar', self._vid, [], {})",
    "        if v is None:",
    "            return ''",
    "        return v",
    "",
    "    def set(self, value):",
    "        _call('tk', 'setvar', self._vid, [value], {})",
    "",
    "    def initialize(self):",
    "        pass",
    "",
    "    def info(self):",
    "        return 'set'",
    "",
    "    def trace_vwait(self, *args):",
    "        pass",
    "",
    "    def trace_variable(self, *args):",
    "        return ''",
    "",
    "    def trace_add(self, *args):",
    "        return ''",
    "",
    "    def __repr__(self):",
    "        return 'PyGuiVariable(%s)' % (self.get(),)",
    "",
    "",
    "class StringVar(Variable):",
    "    _type = 'str'",
    "",
    "    def get(self):",
    "        v = Variable.get(self)",
    "        return str(v)",
    "",
    "    def set(self, value):",
    "        Variable.set(self, '' if value is None else str(value))",
    "",
    "",
    "class IntVar(Variable):",
    "    _type = 'int'",
    "",
    "    def get(self):",
    "        v = Variable.get(self)",
    "        try:",
    "            return int(round(float(v)))",
    "        except (TypeError, ValueError):",
    "            return 0",
    "",
    "",
    "class DoubleVar(Variable):",
    "    _type = 'double'",
    "",
    "    def get(self):",
    "        v = Variable.get(self)",
    "        try:",
    "            return float(v)",
    "        except (TypeError, ValueError):",
    "            return 0.0",
    "",
    "",
    "class BooleanVar(Variable):",
    "    _type = 'bool'",
    "",
    "    def get(self):",
    "        v = Variable.get(self)",
    "        if isinstance(v, str):",
    "            return v.lower() in ('1', 'true', 'yes', 'on')",
    "        return bool(v)",
    "",
    "",
    "class PhotoImage(object):",
    "    def __init__(self, master=None, cnf=None, **kw):",
    "        self._w = num_get(kw.get('width'), 16)",
    "        self._h = num_get(kw.get('height'), 16)",
    "",
    "    def width(self):",
    "        return self._w",
    "",
    "    def height(self):",
    "        return self._h",
    "",
    "    def subsample(self, *args):",
    "        return self",
    "",
    "    def zoom(self, *args):",
    "        return self",
    "",
    "",
    "def num_get(v, d):",
    "    try:",
    "        return int(v)",
    "    except (TypeError, ValueError):",
    "        return d",
    "",
    "",
    "def _nameof(widget):",
    "    return str(getattr(widget, '_h', ''))",
    "",
    "",
    "# константи tkinter.constants: їх часто імпортують через `from tkinter import *`",
    "ACTIVE = 'active'",
    "NORMAL = 'normal'",
    "DISABLED = 'disabled'",
    "READONLY = 'readonly'",
    "NW = 'nw'",
    "N = 'n'",
    "NE = 'ne'",
    "W = 'w'",
    "E = 'e'",
    "SW = 'sw'",
    "S = 's'",
    "SE = 'se'",
    "CENTER = 'center'",
    "TRUE = 'true'",
    "FALSE = 'false'",
    "YES = 'yes'",
    "NO = 'no'",
    "ON = 1",
    "OFF = 0",
    "LEFT = 'left'",
    "RIGHT = 'right'",
    "TOP = 'top'",
    "BOTTOM = 'bottom'",
    "BOTH = 'both'",
    "NONE = 'none'",
    "VERTICAL = 'vertical'",
    "HORIZONTAL = 'horizontal'",
    "FIRST = 'first'",
    "LAST = 'last'",
    "END = 'end'",
    "ALL = 'all'",
    "X = 'x'",
    "Y = 'y'",
    "SOLID = 'solid'",
    "RAISED = 'raised'",
    "SUNKEN = 'sunken'",
    "FLAT = 'flat'",
    "RIDGE = 'ridge'",
    "GROOVE = 'groove'",
    "POINT = 'point'",
    "PIXEL = 'pixel'",
    "CHAR = 'char'",
    "WINDOW = 'window'",
    "CANVAS = 'canvas'",
    "IMAGES = 'images'",
    "DOTTED = 'dotted'",
    "DIAMOND = 'diamond'",
    "MULTIPLE = 'multiple'",
    "EXTENDED = 'extended'",
    "BROWSE = 'browse'",
    "ANSI = 'ansi'",
    "JIS0208 = 'jis0208'",
    "PUNICODE = 'punicode'",
    "SHIFT = 'shift'",
    "CONTROL = 'control'",
    "ALT = 'alt'",
    "",
    "",
    "def mainloop(n=0):",
    "    top = _default_root[0] if _default_root else None",
    "    if top is not None:",
    "        top.mainloop(n)"
  ].join("\n");

  const SRC_MB = [
    "# tkinter.messagebox — спливні вікна повідомлень",
    "import sys",
    "",
    "_HINT = 'messagebox: у браузері вікно не зупиняє програму — тисни кнопку, і справжня відповідь з\\'явиться виводом нижче'",
    "",
    "",
    "def _show(kind, title, message):",
    "    _call('tk', 'msgbox', None, [kind, str(title or ''), str(message or ''), None], {})",
    "",
    "",
    "def _ask(kind, title, message, dflt):",
    "    state = {}",
    "",
    "    def _got(ans=None):",
    "        state['a'] = str(ans)",
    "        print('messagebox: ' + str(ans))",
    "",
    "    _call('tk', 'msgbox', None, [kind, str(title or ''), str(message or ''), _got], {})",
    "    print(_HINT)",
    "    return dflt",
    "",
    "",
    "def showinfo(title=None, message=None, **kw):",
    "    _show('info', title, message)",
    "",
    "",
    "def showwarning(title=None, message=None, **kw):",
    "    _show('warn', title, message)",
    "",
    "",
    "def showerror(title=None, message=None, **kw):",
    "    _show('error', title, message)",
    "",
    "",
    "def show(title=None, message=None, **kw):",
    "    _show('info', title, message)",
    "",
    "",
    "def askquestion(title=None, message=None, **kw):",
    "    return _ask('question', title, message, 'yes')",
    "",
    "",
    "def askokcancel(title=None, message=None, **kw):",
    "    return _ask('okcancel', title, message, True)",
    "",
    "",
    "def askretrycancel(title=None, message=None, **kw):",
    "    return _ask('retrycancel', title, message, False)",
    "",
    "",
    "def askyesno(title=None, message=None, **kw):",
    "    return _ask('yesno', title, message, True)",
    "",
    "",
    "def askyesnocancel(title=None, message=None, **kw):",
    "    return _ask('yesnocancel', title, message, True)",
    "",
    "",
    "def askstring(title=None, message=None, **kw):",
    "    return _ask('string', title, message, '')",
    "",
    "",
    "def askinteger(title=None, message=None, **kw):",
    "    return _ask('integer', title, message, 0)"
  ].join("\n");

  const SRC_BOOT = [
    "# вбудованi модулі PyGui: turtle i tkinter без Tcl/Tk i без встановлення",
    "import sys",
    "import types",
    "import json",
    "import _pygui_js as _G",
    "",
    "def _san(v):",
    "    if v is None or isinstance(v, (bool, int, float, str)):",
    "        return v",
    "    if callable(v):",
    "        return {'cb': int(_G.pygui_cb(v))}",
    "    if isinstance(v, dict):",
    "        return dict((str(k), _san(x)) for k, x in v.items())",
    "    if isinstance(v, (list, tuple)):",
    "        return [_san(x) for x in v]",
    "    if isinstance(v, (bytes, bytearray)):",
    "        return v.decode('utf-8', 'replace')",
    "    if hasattr(v, '_vid'):",
    "        return {'vid': int(getattr(v, '_vid'))}",
    "    if hasattr(v, '_h'):",
    "        try:",
    "            return {'wid': int(getattr(v, '_h'))}",
    "        except (TypeError, ValueError):",
    "            return None",
    "    return str(v)",
    "",
    "",
    "def _call(mod, op, h, a=None, k=None):",
    "    args = [_san(x) for x in (a or [])]",
    "    kw = {}",
    "    for key in (k or {}):",
    "        kw[str(key)] = _san(k[key])",
    "    r = json.loads(_G.pygui_call(json.dumps([mod, op, h, args, kw])))",
    "    if r.get('e'):",
    "        raise RuntimeError(r['e'])",
    "    return r.get('v')",
    "",
    "",
    "def _install(name, src, pkg=''):",
    "    m = types.ModuleType(name)",
    "    m.__dict__['_call'] = _call",
    "    m.__dict__['_json'] = json",
    "    if pkg:",
    "        m.__package__ = pkg",
    "    exec(compile(src, '<' + name + '>', 'exec'), m.__dict__)",
    "    sys.modules[name] = m",
    "    return m",
    "",
    "",
    "_tk_pkg = _install('tkinter', __pg_tk)",
    "_mb = _install('tkinter.messagebox', __pg_mb, 'tkinter')",
    "_tk_pkg.messagebox = _mb",
    "_install('turtle', __pg_turtle)",
    "del _tk_pkg",
    "del _mb",
    "__pygui_ok = 1"
  ].join("\n");

  /* ==================== встановлення в Pyodide ==================== */
  let installedFor = null;

  async function install(py, force) {
    if (!py || typeof py.registerJsModule !== "function") return false;
    if (installedFor === py && !force) return true;
    py.registerJsModule("_pygui_js", api);
    py.globals.set("__pg_turtle", SRC_TURTLE);
    py.globals.set("__pg_tk", SRC_TK);
    py.globals.set("__pg_mb", SRC_MB);
    await py.runPythonAsync(SRC_BOOT);
    installedFor = py;
    return true;
  }

  function reset() {
    if (Turt.scr) cancelAnimationFrame(Turt.scr.raf);
    (Turt.scr ? Turt.scr.timers : []).forEach(clearTimeout);
    Turt.scr = null;
    Turt.turtles.clear();
    Turt.def = null;
    if (Turt.keyHandler) {
      window.removeEventListener("keydown", Turt.keyHandler);
      Turt.keyHandler = null;
    }
    Tk.timers.forEach(clearTimeout);
    Tk.timers = [];
    Tk.dialogs.forEach((d) => d.remove());
    Tk.dialogs = [];
    Tk.nodes.forEach((n) => { if (n.winKey) window.removeEventListener("keydown", n.winKey); });
    Tk.nodes.clear();
    Tk.vars.clear();
    Tk.roots = [];
    Tk.def = null;
    Tk.seq = 0;
    CBA.forEach((p) => {
      if (p && typeof p.destroy === "function") {
        try { p.destroy(); } catch (e) { /* уже знищено */ }
      }
    });
    CBA.clear();
    cbSeq = 0;
  }

  global.PyGui = {
    install,
    reset,
    native: () => ["tkinter", "turtle"],
    get ready() { return installedFor != null; }
  };
})(window);
