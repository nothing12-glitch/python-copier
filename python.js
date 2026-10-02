/* python.js — SAFE-STUB v26.10.02f.
   Pyodide НЕ завантажується ВЗАГАЛІ (щоб прибрати будь-яке заморожування сторінки).
   Редактор, приклади, підказки, полотно turtle — працюють; запуск коду показує
   повідомлення, що Python тимчасово вимкнено для стабільності. */
(function (global) {
  const $ = (s) => document.querySelector(s);
  const t = (k) => (global.I18n ? global.I18n.t(k) : k);
  const S = () => global.Settings;
  let initDone = false, canvas = null, ctx = null;

  function ensureCanvas() {
    if (canvas) return canvas;
    const layout = document.querySelector(".py-layout");
    if (!layout) return null;
    const card = document.createElement("div");
    card.className = "card elev1"; card.style.minWidth = "0";
    const bar = document.createElement("div"); bar.className = "card-bar";
    bar.innerHTML = '<span class="bar-title"><span class="material-icons">brush</span><span>turtle</span></span>';
    canvas = document.createElement("canvas");
    canvas.width = 640; canvas.height = 420;
    canvas.style.width = "100%"; canvas.style.display = "block";
    card.append(bar, canvas);
    const outCard = document.querySelector(".py-output");
    if (outCard && outCard.parentElement === layout) layout.insertBefore(card, outCard);
    else layout.appendChild(card);
    ctx = canvas.getContext("2d");
    ctx.fillStyle = "#0b1020"; ctx.fillRect(0, 0, 640, 420);
    return canvas;
  }

  function out(text, cls) {
    const o = $("#out"); if (!o) return;
    const line = document.createElement("span");
    if (cls) line.className = cls;
    line.textContent = text;
    o.appendChild(line); o.appendChild(document.createTextNode("\n"));
    o.scrollTop = o.scrollHeight;
  }

  const EXAMPLES = [
    ["Hello World", 'print("Hello, World!")'],
    ["FizzBuzz", 'for i in range(1, 16):\n    s = ""\n    if i % 3 == 0: s += "Fizz"\n    if i % 5 == 0: s += "Buzz"\n    print(s or i)'],
    ["Turtle: спіраль", 'import turtle\nfor i in range(36):\n    turtle.forward(8 + i * 3)\n    turtle.right(100)']
  ];
  const HINTS = ["print()", "for", "while", "def", "if/else", "list", "dict", "import math", "import turtle"];

  function syncLines() {
    const c = $("#code"), ln = $("#lineNumbers");
    if (!c || !ln) return;
    ln.textContent = Array.from({ length: c.value.split("\n").length }, (_, i) => i + 1).join("\n");
  }

  function init() {
    if (initDone) return; initDone = true;
    ensureCanvas();
    const sel = $("#examples");
    if (sel) {
      sel.innerHTML = "";
      EXAMPLES.forEach(([n, c], i) => { const o = document.createElement("option"); o.value = i; o.textContent = n; sel.appendChild(o); });
      sel.onchange = () => { const c = $("#code"); if (c) { c.value = EXAMPLES[+sel.value][1]; syncLines(); } };
    }
    const list = $("#hintList");
    if (list) {
      list.innerHTML = "";
      HINTS.forEach((h) => { const b = document.createElement("button"); b.className = "chip"; b.textContent = h; list.appendChild(b); });
    }
    const c = $("#code");
    if (c) { c.value = EXAMPLES[0][1]; c.addEventListener("input", syncLines); syncLines(); }
    const run = $("#run");
    if (run) {
      run.disabled = false;
      run.onclick = () => out("⚠ Python тимчасово вимкнено для стабільності сайту (safe-mode). Скажи розробнику — і він увімкне його назад окремою кнопкою.", "err");
    }
    const co = $("#clearOut"); if (co) co.onclick = () => { const o = $("#out"); if (o) o.innerHTML = ""; };
    const cc = $("#clearCode"); if (cc) cc.onclick = () => { if (c) { c.value = ""; syncLines(); } };
    const chip = $("#pyStatus");
    if (chip) { chip.className = "md-chip error"; chip.textContent = "Python: safe-mode"; }
    console.info("[python.js] safe-stub active, Pyodide NOT loaded");
  }

  global.PythonPad = { init, run: () => {}, get ready() { return false; } };
})(window);
