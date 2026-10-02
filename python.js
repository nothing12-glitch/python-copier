/* python.js — Python-майданчик: Pyodide + УСІ стандартні модулі + turtle (міст на canvas).
   Полотно turtle створюється автоматично (index.html чіпати не треба).
   Важкі пакети (numpy/pandas/sympy/scipy/matplotlib) довантажуються самі, якщо їх імпортувати. */
(function (global) {
  const $ = (s) => document.querySelector(s);
  const t = (k) => (global.I18n ? global.I18n.t(k) : k);
  const S = () => global.Settings;

  let py = null, ready = false, running = false, initDone = false;
  let canvas = null, ctx = null;

  /* ---------- Полотно turtle (створюється само) ---------- */
  function ensureCanvas() {
    if (canvas) return canvas;
    const layout = document.querySelector(".py-layout");
    if (!layout) return null;
    const card = document.createElement("div");
    card.className = "card elev1";
    card.style.minWidth = "0";
    const bar = document.createElement("div");
    bar.className = "card-bar";
    const title = document.createElement("span");
    title.className = "bar-title";
    title.innerHTML = '<span class="material-icons">brush</span><span>turtle</span>';
    const clearBtn = document.createElement("button");
    clearBtn.className = "btn text";
    clearBtn.textContent = t("python.clearOut");
    clearBtn.onclick = () => resetCanvas();
    bar.append(title, clearBtn);
    canvas = document.createElement("canvas");
    canvas.width = 640; canvas.height = 420;
    canvas.style.width = "100%";
    canvas.style.display = "block";
    card.append(bar, canvas);
    const outCard = document.querySelector(".py-output");
    if (outCard && outCard.parentElement === layout) layout.insertBefore(card, outCard);
    else layout.appendChild(card);
    ctx = canvas.getContext("2d");
    resetCanvas();
    return canvas;
  }
  function resetCanvas() {
    if (!ctx) return;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = "#0b1020";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }

  /* ---------- JS-міст для turtle ---------- */
  const bridge = {
    line(x1, y1, x2, y2, color, width) {
      if (!ctx) return;
      ctx.strokeStyle = color; ctx.lineWidth = width;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    },
    fill(pts, color) {
      if (!ctx || !pts || !pts.length) return;
      ctx.fillStyle = color; ctx.beginPath();
      ctx.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
      ctx.closePath(); ctx.fill();
    },
    dot(x, y, r, color) {
      if (!ctx) return;
      ctx.fillStyle = color; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    },
    text(x, y, s, color, size) {
      if (!ctx) return;
      ctx.fillStyle = color; ctx.font = size + "px monospace"; ctx.fillText(s, x, y);
    },
    bg(color) { if (!ctx) return; ctx.fillStyle = color; ctx.fillRect(0, 0, canvas.width, canvas.height); },
    clear() { resetCanvas(); },
    w: 640, h: 420
  };

  /* ---------- Python-код модуля turtle ---------- */
  const TURTLE_PY = `
import math as _math
import turtlebridge as _tb

_W = _tb.w; _H = _tb.h
def _tx(x): return _W / 2 + x
def _ty(y): return _H / 2 - y

def _col(c):
    if isinstance(c, (tuple, list)):
        p = [int(round(x * 255)) if x <= 1 else int(x) for x in c[:3]]
        return "#%02x%02x%02x" % (p[0], p[1], p[2])
    return str(c)

class Turtle:
    def __init__(self):
        self._x = 0.0; self._y = 0.0; self._a = 0.0
        self._down = True; self._color = "#e2e8f0"; self._fill = "#38bdf8"
        self._width = 2; self._path = None
    def forward(self, d):
        nx = self._x + d * _math.cos(self._a); ny = self._y + d * _math.sin(self._a)
        if self._down:
            _tb.line(_tx(self._x), _ty(self._y), _tx(nx), _ty(ny), self._color, self._width)
        if self._path is not None: self._path.append((_tx(nx), _ty(ny)))
        self._x, self._y = nx, ny
    def backward(self, d): self.forward(-d)
    def left(self, a): self._a += _math.radians(a)
    def right(self, a): self._a -= _math.radians(a)
    def goto(self, x, y):
        if self._down:
            _tb.line(_tx(self._x), _ty(self._y), _tx(x), _ty(y), self._color, self._width)
        if self._path is not None: self._path.append((_tx(x), _ty(y)))
        self._x, self._y = float(x), float(y)
    def setheading(self, a): self._a = _math.radians(a)
    def heading(self): return _math.degrees(self._a) % 360
    def position(self): return (round(self._x, 2), round(self._y, 2))
    def xcor(self): return self._x
    def ycor(self): return self._y
    def penup(self): self._down = False
    def pendown(self): self._down = True
    def isdown(self): return self._down
    def pencolor(self, c=None):
        if c is None: return self._color
        self._color = _col(c)
    def fillcolor(self, c=None):
        if c is None: return self._fill
        self._fill = _col(c)
    def color(self, c=None, f=None):
        if c is not None: self.pencolor(c)
        if f is not None: self.fillcolor(f)
        if c is None and f is None: return (self._color, self._fill)
    def width(self, w=None):
        if w is None: return self._width
        self._width = float(w)
    def pensize(self, w=None): return self.width(w)
    def begin_fill(self): self._path = [(_tx(self._x), _ty(self._y))]
    def end_fill(self):
        if self._path: _tb.fill(self._path, self._fill)
        self._path = None
    def circle(self, radius, extent=None, steps=None):
        extent = 360 if extent is None else extent
        steps = steps or max(12, int(abs(extent) / 5))
        sa = _math.radians(extent) / steps
        if radius < 0: sa = -sa
        chord = 2 * abs(radius) * _math.sin(abs(sa) / 2)
        half = _math.degrees(sa) / 2
        self.left(half)
        for _ in range(steps):
            self.forward(chord)
            self.left(_math.degrees(sa))
        self.right(half)
    def dot(self, size=None, color=None):
        _tb.dot(_tx(self._x), _ty(self._y), (size or 8) / 2, _col(color or self._color))
    def write(self, s, align=None, font=None):
        sz = 14
        if font and len(font) >= 2: sz = int(font[1])
        _tb.text(_tx(self._x) + 4, _ty(self._y) - 4, str(s), self._color, sz)
    def home(self): self.goto(0, 0); self.setheading(0)
    def reset(self): _tb.clear(); self.__init__()
    def clear(self): _tb.clear()
    def hideturtle(self): pass
    def showturtle(self): pass
    def speed(self, v=None): return 0
    def delay(self, v=None): return 0
    fd = forward; bk = backward; lt = left; rt = right; pu = penup; pd = pendown

class Screen:
    def bgcolor(self, c=None):
        if c is None: return "#0b1020"
        _tb.bg(_col(c))
    def title(self, s=None): pass
    def setup(self, *a, **k): pass
    def tracer(self, *a, **k): pass
    def update(self): pass
    def delay(self, v=None): return 0
    def exitonclick(self): pass
    def bye(self): pass

_t = Turtle()
_mod_funcs = ["forward","backward","left","right","goto","setheading","heading","position",
  "xcor","ycor","penup","pendown","pencolor","fillcolor","color","width","pensize",
  "begin_fill","end_fill","circle","dot","write","home","reset","clear","hideturtle",
  "showturtle","speed","fd","bk","lt","rt","pu","pd"]

import sys, types
_mod = types.ModuleType("turtle")
_mod.Turtle = Turtle
_mod.Screen = Screen
def _screen(): return Screen()
_mod.Screen = Screen
for _n in _mod_funcs:
    setattr(_mod, _n, getattr(_t, _n))
_mod.done = lambda: None
_mod.mainloop = lambda: None
_mod.exitonclick = lambda: None
_mod.tracer = lambda *a, **k: None
_mod.update = lambda: None
_mod.setup = lambda *a, **k: None
_mod.title = lambda s=None: None
_mod.bye = lambda: None
_mod.bgcolor = Screen().bgcolor
sys.modules["turtle"] = _mod
`;

  /* ---------- Вивід у консоль ---------- */
  function out(text, cls) {
    const o = $("#out");
    if (!o) return;
    const line = document.createElement("span");
    if (cls) line.className = cls;
    let prefix = "";
    if (S() && S().get && S().get("timestamps")) {
      prefix = "[" + new Date().toLocaleTimeString() + "] ";
    }
    line.textContent = prefix + text;
    o.appendChild(line);
    o.appendChild(document.createTextNode("\n"));
    o.scrollTop = o.scrollHeight;
  }

  /* ---------- Авто-завантаження важких пакетів ---------- */
  const LOADABLE = ["numpy", "pandas", "sympy", "scipy", "matplotlib"];
  async function ensureImports(code) {
    const names = new Set();
    const re = /^\s*(?:import|from)\s+([a-zA-Z_][a-zA-Z0-9_]*)/gm;
    let m;
    while ((m = re.exec(code))) names.add(m[1]);
    for (const n of names) {
      if (!LOADABLE.includes(n)) continue;
      try {
        await py.loadPackage(n);
        if (n === "matplotlib") {
          try { py.runPython("import matplotlib; matplotlib.use('AGG')"); } catch (e) {}
        }
      } catch (e) {
        out("⚠ не вдалося довантажити пакет: " + n, "err");
      }
    }
  }

  /* ---------- Приклади та підказки ---------- */
  const EXAMPLES = [
    ["Hello World", 'print("Hello, World!")'],
    ["Greeting", 'name = "світе"\nprint(f"Привіт, {name}!")'],
    ["FizzBuzz", 'for i in range(1, 16):\n    s = ""\n    if i % 3 == 0: s += "Fizz"\n    if i % 5 == 0: s += "Buzz"\n    print(s or i)'],
    ["Fibonacci", 'a, b = 0, 1\nfor _ in range(15):\n    print(a, end=" ")\n    a, b = b, a + b'],
    ["List ops", 'nums = [3, 1, 4, 1, 5, 9, 2, 6]\nprint(sorted(nums))\nprint(sum(nums), max(nums), min(nums))\nprint([x * 2 for x in nums if x % 2])'],
    ["Dictionary", 'd = {"apple": 3, "banana": 5, "cherry": 1}\nfor k, v in d.items():\n    print(k, "->", v)\nprint("sum:", sum(d.values()))'],
    ["Turtle: спіраль", 'import turtle\nturtle.reset()\nturtle.speed(6)\ncolors = ["#38bdf8", "#4ade80", "#fbbf24", "#f87171"]\nfor i in range(36):\n    turtle.pencolor(colors[i % 4])\n    turtle.forward(8 + i * 3)\n    turtle.right(100)\nprint("готово")'],
    ["Turtle: зірка з заливкою", 'import turtle\nturtle.reset()\nturtle.pencolor("#fbbf24")\nturtle.fillcolor("#f59e0b")\nturtle.begin_fill()\nfor _ in range(5):\n    turtle.forward(120)\n    turtle.right(144)\nturtle.end_fill()\nturtle.penup()\nturtle.goto(-40, -80)\nturtle.write("Python!")'],
    ["Turtle: коло та крапки", 'import turtle\nturtle.reset()\nturtle.pencolor("#4ade80")\nturtle.circle(60)\nfor a in range(0, 360, 45):\n    turtle.setheading(a)\n    turtle.penup()\n    turtle.home()\n    turtle.pendown()\n    turtle.forward(60)\n    turtle.dot(10, "#f87171")'],
    ["Modules: random + statistics", 'import random, statistics\nxs = [random.randint(1, 100) for _ in range(10)]\nprint(xs)\nprint("mean:", statistics.mean(xs))\nprint("median:", statistics.median(xs))'],
    ["Modules: datetime + json", 'import datetime, json\nnow = datetime.datetime.now()\nprint(now.strftime("%Y-%m-%d %H:%M"))\nprint(json.dumps({"ok": True, "lang": "uk"}, ensure_ascii=False))'],
    ["Modules: re + collections", 'import re\nfrom collections import Counter\ntext = "python python java go python go"\nprint(Counter(text.split()))\nprint(re.findall(r"p\\w+", text))']
  ];
  const HINTS = ["print()", "for", "while", "def", "if/else", "list", "dict", "import math", "import turtle", "class", "try/except"];

  function fillExamples() {
    const sel = $("#examples");
    if (!sel) return;
    sel.innerHTML = "";
    EXAMPLES.forEach(([name, code], i) => {
      const o = document.createElement("option");
      o.value = String(i);
      o.textContent = name;
      sel.appendChild(o);
    });
    sel.onchange = () => {
      const codeEl = $("#code");
      if (!codeEl) return;
      codeEl.value = EXAMPLES[Number(sel.value)][1];
      syncLines();
      saveCode();
    };
  }
  function fillHints() {
    const list = $("#hintList");
    if (!list) return;
    list.innerHTML = "";
    HINTS.forEach((h) => {
      const b = document.createElement("button");
      b.className = "chip";
      b.textContent = h;
      b.onclick = () => {
        const codeEl = $("#code");
        if (!codeEl) return;
        codeEl.value += (codeEl.value && !codeEl.value.endsWith("\n") ? "\n" : "") + h + "\n";
        syncLines();
        codeEl.focus();
      };
      list.appendChild(b);
    });
  }

  /* ---------- Редактор: рядки, autosave, Tab ---------- */
  function syncLines() {
    const codeEl = $("#code"), ln = $("#lineNumbers");
    if (!codeEl || !ln) return;
    const n = codeEl.value.split("\n").length;
    ln.textContent = Array.from({ length: n }, (_, i) => i + 1).join("\n");
  }
  let saveTimer = null;
  function saveCode() {
    if (!(S() && S().get && S().get("autosaveCode"))) return;
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      try { localStorage.setItem("app.python.code", $("#code") ? $("#code").value : ""); } catch (e) {}
    }, 300);
  }
  function bindEditor() {
    const codeEl = $("#code");
    if (codeEl) {
      codeEl.addEventListener("input", () => { syncLines(); saveCode(); });
      codeEl.addEventListener("scroll", () => {
        const ln = $("#lineNumbers");
        if (ln) ln.scrollTop = codeEl.scrollTop;
      });
      codeEl.addEventListener("keydown", (e) => {
        if (e.key === "Tab") {
          e.preventDefault();
          const s = codeEl.selectionStart, pos = codeEl.selectionEnd;
          codeEl.value = codeEl.value.slice(0, s) + "    " + codeEl.value.slice(pos);
          codeEl.selectionStart = codeEl.selectionEnd = s + 4;
          syncLines(); saveCode();
        }
      });
      // autosave: відновити код
      if (S() && S().get && S().get("autosaveCode")) {
        try {
          const saved = localStorage.getItem("app.python.code");
          if (saved) codeEl.value = saved;
        } catch (e) {}
      }
      if (!codeEl.value) codeEl.value = EXAMPLES[0][1];
      syncLines();
    }
    const clearCode = $("#clearCode");
    if (clearCode) clearCode.onclick = () => { if (codeEl) { codeEl.value = ""; syncLines(); saveCode(); codeEl.focus(); } };
    const clearOutBtn = $("#clearOut");
    if (clearOutBtn) clearOutBtn.onclick = () => { const o = $("#out"); if (o) o.innerHTML = ""; };
    const runBtn = $("#run");
    if (runBtn) runBtn.onclick = runCode;
  }

  /* ---------- Запуск ---------- */
  async function runCode() {
    const runBtn = $("#run"), codeEl = $("#code");
    if (!ready || running || !codeEl) return;
    running = true;
    if (runBtn) runBtn.disabled = true;
    const o = $("#out");
    if (o) o.innerHTML = "";
    try {
      await ensureImports(codeEl.value);
      await py.runPythonAsync(codeEl.value);
      if (global.Audio2 && global.Audio2.SFX) global.Audio2.SFX.success();
    } catch (e) {
      out(String(e && e.message ? e.message : e), "err");
      if (global.Audio2 && global.Audio2.SFX) global.Audio2.SFX.error();
    } finally {
      running = false;
      if (runBtn) runBtn.disabled = !ready;
    }
  }

  /* ---------- Статус + завантаження Pyodide ---------- */
  function setStatus(state) {
    const chip = $("#pyStatus");
    if (!chip) return;
    chip.className = "md-chip " + state;
    chip.textContent = state === "loading" ? t("python.loading")
      : state === "ready" ? t("python.ready")
      : t("python.error");
  }
  async function loadPyodideLib() {
    setStatus("loading");
    try {
      py = await global.loadPyodide();
      py.setStdout({ batched: (s) => out(s) });
      py.setStderr({ batched: (s) => out(s, "err") });
      py.registerJsModule("turtlebridge", bridge);
      py.runPython(TURTLE_PY);
      ready = true;
      setStatus("ready");
      const runBtn = $("#run");
      if (runBtn) runBtn.disabled = false;
    } catch (e) {
      setStatus("error");
      out(String(e), "err");
    }
  }

  function init() {
    if (initDone) return;
    initDone = true;
    ensureCanvas();
    bridge.w = canvas ? canvas.width : 640;
    bridge.h = canvas ? canvas.height : 420;
    bindEditor();
    fillExamples();
    fillHints();
    loadPyodideLib();
    document.addEventListener("langchange", () => { setStatus(ready ? "ready" : "loading"); });
  }

  global.PythonPad = { init, run: runCode, get ready() { return ready; } };
})(window);
