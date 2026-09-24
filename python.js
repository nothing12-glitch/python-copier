/* Python-майданчик на Pyodide: запуск, приклади, підказки та автодоповнення */
(function (global) {
  const $ = (s) => document.querySelector(s);

  const EXAMPLES = {
    hello: {
      label: { uk: "Hello World", en: "Hello World", tr: "Hello World" },
      code: `print("Hello World!")`
    },
    greet: {
      label: { uk: "Привітання", en: "Greeting", tr: "Selamlama" },
      code: `def greet(name):\n    return f"Привіт, {name}!"\n\nprint(greet("your name"))`
    },
    fizzbuzz: {
      label: { uk: "FizzBuzz", en: "FizzBuzz", tr: "FizzBuzz" },
      code: `for i in range(1, 21):\n    if i % 15 == 0:\n        print("FizzBuzz")\n    elif i % 3 == 0:\n        print("Fizz")\n    elif i % 5 == 0:\n        print("Buzz")\n    else:\n        print(i)`
    },
    fib: {
      label: { uk: "Фібоначчі", en: "Fibonacci", tr: "Fibonacci" },
      code: `def fib(n):\n    a, b = 0, 1\n    for _ in range(n):\n        yield a\n        a, b = b, a + b\n\nprint(list(fib(10)))`
    },
    list: {
      label: { uk: "Робота зі списком", en: "List ops", tr: "Liste işlemleri" },
      code: `nums = [5, 3, 9, 1, 7]\nprint("sum:", sum(nums))\nprint("max:", max(nums))\nprint("sorted:", sorted(nums))\nprint("squares:", [n*n for n in nums])`
    },
    dict: {
      label: { uk: "Словник", en: "Dictionary", tr: "Sözlük" },
      code: `student = {"name": "Ana", "age": 17, "grades": [9, 10, 8]}\nfor k, v in student.items():\n    print(k, "=", v)\nprint("average:", sum(student["grades"]) / len(student["grades"]))`
    }
  };

  // Підказки-чіпи (вставляють шаблон коду)
  const HINTS = [
    { label: "print()", code: 'print("Hello")' },
    { label: "for", code: "for i in range(5):\n    print(i)" },
    { label: "while", code: "n = 0\nwhile n < 5:\n    print(n)\n    n += 1" },
    { label: "def", code: 'def my_func(x):\n    return x * 2\n\nprint(my_func(3))' },
    { label: "if/else", code: 'x = 10\nif x > 5:\n    print("big")\nelse:\n    print("small")' },
    { label: "list", code: 'a = [1, 2, 3]\nprint(a)' },
    { label: "dict", code: 'd = {"key": "value"}\nprint(d)' },
    { label: "import math", code: "import math\nprint(math.sqrt(16))" },
    { label: "class", code: "class Cat:\n    def __init__(self, name):\n        self.name = name\n    def speak(self):\n        print(f\"{self.name}: meow\")\n\nCat(\"Tom\").speak()" },
    { label: "try/except", code: 'try:\n    print(1/0)\nexcept ZeroDivisionError as e:\n    print("error:", e)' }
  ];

  // Ключові слова / вбудовані функції для автодоповнення
  const KEYWORDS = [
    "False","None","True","and","as","assert","async","await","break","class","continue","def","del","elif","else","except","finally","for","from","global","if","import","in","is","lambda","nonlocal","not","or","pass","raise","return","try","while","with","yield",
    "abs","all","any","bool","dict","dir","enumerate","filter","float","format","help","input","int","isinstance","len","list","map","max","min","print","range","reversed","round","set","sorted","str","sum","tuple","type","zip",
    "math","random","string","json","datetime"
  ];

  let py = null;
  let pyState = "loading";
  let out, codeEl, runBtn, statusEl, lineNums, hintList, exSel, acBox;

  function setStatus(state) {
    pyState = state;
    const map = { loading: "python.loading", ready: "python.ready", error: "python.error", running: "python.running" };
    statusEl.className = "md-chip " + state;
    statusEl.textContent = global.I18n.t(map[state] || "python.loading");
  }

  function setOutput(text, isErr) {
    const line = document.createElement("div");
    if (isErr) line.className = "err";
    const ts = global.Settings && global.Settings.get("timestamps")
      ? "[" + new Date().toLocaleTimeString() + "] " : "";
    line.textContent = ts + text;
    out.appendChild(line);
    out.scrollTop = out.scrollHeight;
  }

  function updateLineNumbers() {
    const lines = codeEl.value.split("\n").length;
    lineNums.textContent = Array.from({ length: lines }, (_, i) => i + 1).join("\n");
  }

  function insertAtCursor(text) {
    const s = codeEl.selectionStart, e = codeEl.selectionEnd;
    codeEl.value = codeEl.value.slice(0, s) + text + codeEl.value.slice(e);
    codeEl.selectionStart = codeEl.selectionEnd = s + text.length;
    codeEl.focus();
    updateLineNumbers();
  }

  function buildHints() {
    hintList.innerHTML = "";
    HINTS.forEach((h) => {
      const c = document.createElement("button");
      c.className = "chip";
      c.type = "button";
      c.textContent = h.label;
      c.title = h.code;
      c.onclick = () => { global.Audio2 && global.Audio2.SFX.pop(); insertAtCursor(h.code); };
      hintList.appendChild(c);
    });
  }

  function buildExamples(loadDefaultCode) {
    const prev = exSel.value;
    exSel.innerHTML = "";
    const lang = global.I18n.lang;
    Object.keys(EXAMPLES).forEach((k) => {
      const o = document.createElement("option");
      o.value = k;
      o.textContent = EXAMPLES[k].label[lang] || EXAMPLES[k].label.uk;
      exSel.appendChild(o);
    });
    if (prev && EXAMPLES[prev]) exSel.value = prev;
    if (loadDefaultCode) {
      codeEl.value = EXAMPLES.hello.code;
      updateLineNumbers();
    }
  }

  // --- Autocomplete ---
  let acItems = [], acIdx = -1;
  function currentWord() {
    const pos = codeEl.selectionStart;
    const before = codeEl.value.slice(0, pos);
    const m = before.match(/[A-Za-z_][A-Za-z0-9_]*$/);
    return m ? m[0] : "";
  }
  function showAutocomplete() {
    if (!(global.Settings && global.Settings.get("autocomplete"))) { hideAutocomplete(); return; }
    const w = currentWord();
    if (w.length < 2) { hideAutocomplete(); return; }
    const matches = KEYWORDS.filter((k) => k.startsWith(w) && k !== w).slice(0, 8);
    if (!matches.length) { hideAutocomplete(); return; }
    acItems = matches; acIdx = 0;
    acBox.innerHTML = "";
    matches.forEach((m, i) => {
      const d = document.createElement("div");
      d.textContent = m;
      if (i === 0) d.classList.add("sel");
      d.onmousedown = (ev) => { ev.preventDefault(); accept(i); };
      acBox.appendChild(d);
    });
    positionAutocomplete();
    acBox.style.display = "block";
  }
  function positionAutocomplete() {
    const rect = codeEl.getBoundingClientRect();
    // absolute позиціювання від документа — додаємо scroll-зсув
    acBox.style.left = rect.left + window.scrollX + 20 + "px";
    acBox.style.top = rect.top + window.scrollY + 60 + "px";
  }
  function hideAutocomplete() { acBox.style.display = "none"; acItems = []; acIdx = -1; }
  function accept(i) {
    const word = acItems[i]; if (!word) return;
    const cur = currentWord();
    const pos = codeEl.selectionStart;
    codeEl.value = codeEl.value.slice(0, pos - cur.length) + word + codeEl.value.slice(pos);
    codeEl.selectionStart = codeEl.selectionEnd = pos - cur.length + word.length;
    hideAutocomplete();
    global.Audio2 && global.Audio2.SFX.pop();
  }
  function moveAc(delta) {
    if (!acItems.length) return false;
    acIdx = (acIdx + delta + acItems.length) % acItems.length;
    [...acBox.children].forEach((c, i) => c.classList.toggle("sel", i === acIdx));
    return true;
  }

  async function run() {
    if (!py) return;
    out.innerHTML = "";
    runBtn.disabled = true;
    setStatus("running");
    global.Audio2 && global.Audio2.SFX.click();
    py.setStdout({ batched: (s) => setOutput(s) });
    py.setStderr({ batched: (s) => setOutput(s, true) });
    try {
      await py.runPythonAsync(codeEl.value);
      global.Audio2 && global.Audio2.SFX.success();
    } catch (e) {
      setOutput(e.message, true);
      global.Audio2 && global.Audio2.SFX.error();
    } finally {
      runBtn.disabled = false;
      setStatus("ready");
    }
  }

  async function initPyodide() {
    try {
      py = await global.loadPyodide({ indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.2/full/" });
      setStatus("ready");
      runBtn.disabled = false;
    } catch (e) {
      setStatus("error");
      setOutput("Pyodide: " + e.message, true);
    }
  }

  function init() {
    out = $("#out"); codeEl = $("#code"); runBtn = $("#run"); statusEl = $("#pyStatus");
    lineNums = $("#lineNumbers"); hintList = $("#hintList"); exSel = $("#examples");
    if (!codeEl) return;

    acBox = document.createElement("div");
    acBox.className = "autocomplete";
    document.body.appendChild(acBox);

    buildHints();
    buildExamples(true);
    const saved = localStorage.getItem("app.code");
    if (saved && global.Settings && global.Settings.get("autosaveCode")) {
      codeEl.value = saved; updateLineNumbers();
    }
    const applyWrap = () => { codeEl.wrap = global.Settings.get("wordWrap") ? "soft" : "off"; };
    applyWrap();
    document.addEventListener("settingschange", (e) => { if (e.detail.key === "wordWrap") applyWrap(); });

    codeEl.addEventListener("input", () => { updateLineNumbers(); showAutocomplete(); });
    codeEl.addEventListener("scroll", () => { lineNums.scrollTop = codeEl.scrollTop; });
    codeEl.addEventListener("blur", () => setTimeout(hideAutocomplete, 120));
    codeEl.addEventListener("keydown", (e) => {
      if (acBox.style.display === "block") {
        if (e.key === "ArrowDown") { e.preventDefault(); moveAc(1); return; }
        if (e.key === "ArrowUp") { e.preventDefault(); moveAc(-1); return; }
        if (e.key === "Tab" || e.key === "Enter") { e.preventDefault(); accept(acIdx < 0 ? 0 : acIdx); return; }
        if (e.key === "Escape") { hideAutocomplete(); return; }
      }
      // Гарячі клавіші (якщо увімкнені в налаштуваннях)
      const sc = global.Settings && global.Settings.get("shortcuts");
      if (sc && (e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); run(); return; }
      if (sc && e.key === "Tab") {
        e.preventDefault();
        insertAtCursor(" ".repeat(Number(global.Settings.get("tabSize")) || 4));
      }
    });

    // Автозбереження коду
    codeEl.addEventListener("input", () => {
      if (global.Settings && global.Settings.get("autosaveCode")) localStorage.setItem("app.code", codeEl.value);
    });

    runBtn.onclick = run;
    $("#clearCode").onclick = () => { codeEl.value = ""; updateLineNumbers(); global.Audio2 && global.Audio2.SFX.click(); };
    $("#clearOut").onclick = () => { out.innerHTML = ""; };
    exSel.onchange = () => {
      const k = exSel.value;
      if (EXAMPLES[k]) { codeEl.value = EXAMPLES[k].code; updateLineNumbers(); global.Audio2 && global.Audio2.SFX.pop(); }
    };

    document.addEventListener("langchange", () => {
      buildExamples(false); // лише оновити назви прикладів, код не чіпати
      setStatus(pyState);
    });

    initPyodide();
  }

  global.PythonPad = { init };
})(window);
