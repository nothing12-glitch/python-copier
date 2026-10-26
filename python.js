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
    },
    strings: {
      label: { uk: "Рядки", en: "Strings", tr: "Metinler" },
      code: `s = "  Hello, Python  "\nprint(s.strip())\nprint(s.strip().upper())\nprint(s.strip().replace("Python", "World"))\nprint("len:", len(s.strip()))\nprint("split:", "a,b,c".split(","))`
    },
    mathmod: {
      label: { uk: "Математика (math)", en: "Math module", tr: "Matematik (math)" },
      code: `import math\nprint("sqrt:", math.sqrt(144))\nprint("pi:", round(math.pi, 4))\nprint("pow:", math.pow(2, 10))\nprint("ceil/floor:", math.ceil(4.2), math.floor(4.8))\nprint("factorial:", math.factorial(5))`
    },
    randommod: {
      label: { uk: "Випадковість (random)", en: "Random module", tr: "Rastgele (random)" },
      code: `import random\nprint("int 1..10:", random.randint(1, 10))\nprint("choice:", random.choice(["apple", "pear", "plum"]))\ncards = list(range(1, 11))\nrandom.shuffle(cards)\nprint("shuffled:", cards)\nprint("sample:", random.sample(cards, 3))`
    },
    datetimemod: {
      label: { uk: "Дата й час", en: "Date & time", tr: "Tarih ve saat" },
      code: `import datetime\nnow = datetime.datetime.now()\nprint("now:", now)\nprint("date:", now.date())\nprint("formatted:", now.strftime("%Y-%m-%d %H:%M"))\nbday = datetime.date(2010, 5, 20)\nprint("days since bday:", (now.date() - bday).days)`
    },
    statsmod: {
      label: { uk: "Статистика", en: "Statistics", tr: "İstatistik" },
      code: `import statistics\ndata = [4, 8, 15, 16, 23, 42]\nprint("mean:", statistics.mean(data))\nprint("median:", statistics.median(data))\nprint("stdev:", round(statistics.stdev(data), 3))\nprint("min/max:", min(data), max(data))`
    },
    itertoolsmod: {
      label: { uk: "itertools", en: "itertools", tr: "itertools" },
      code: `import itertools\nprint("count 3..7:", list(itertools.islice(itertools.count(3), 5)))\nprint("permutations:", list(itertools.permutations("AB", 2)))\nprint("combinations:", list(itertools.combinations([1, 2, 3], 2)))\nprint("chain:", list(itertools.chain([1, 2], [3, 4])))`
    },
    comprehensions: {
      label: { uk: "Генератори списків", en: "Comprehensions", tr: "Liste üreteçleri" },
      code: `squares = [n * n for n in range(1, 11)]\nevens = [n for n in range(20) if n % 2 == 0]\npairs = [(x, y) for x in range(3) for y in range(3) if x != y]\nwords = ["hi", "there", "you"]\nupper = [w.upper() for w in words]\nprint(squares)\nprint(evens)\nprint(pairs)\nprint(upper)`
    },
    classes: {
      label: { uk: "Класи (ООП)", en: "Classes (OOP)", tr: "Sınıflar (OOP)" },
      code: `class Animal:\n    def __init__(self, name):\n        self.name = name\n    def speak(self):\n        return "..."\n\nclass Cat(Animal):\n    def speak(self):\n        return f"{self.name}: meow"\n\nclass Dog(Animal):\n    def speak(self):\n        return f"{self.name}: woof"\n\nfor a in [Cat("Tom"), Dog("Rex")]:\n    print(a.speak())`
    },
    guessgame: {
      label: { uk: "Гра: вгадай число", en: "Game: guess number", tr: "Oyun: sayı bil" },
      code: `import random\nsecret = random.randint(1, 5)\nguesses = [3, 5, 2, secret]\nfor i, g in enumerate(guesses, 1):\n    if g == secret:\n        print(f"attempt {i}: {g} -- win!")\n        break\n    print(f"attempt {i}: {g} -- " + ("higher" if g < secret else "lower"))\nelse:\n    print("no luck")`
    },
    errors: {
      label: { uk: "Помилки (try/except)", en: "Errors (try/except)", tr: "Hatalar (try/except)" },
      code: `def safe_div(a, b):\n    try:\n        return a / b\n    except ZeroDivisionError:\n        return "cannot divide by zero"\n\nprint(safe_div(10, 2))\nprint(safe_div(10, 0))\n\ntry:\n    int("abc")\nexcept ValueError as e:\n    print("ValueError:", e)`
    },
    matrix: {
      label: { uk: "Матриці", en: "Matrices", tr: "Matrisler" },
      code: `a = [[1, 2], [3, 4]]\nb = [[5, 6], [7, 8]]\nrows = len(a); cols = len(b[0]); inner = len(b)\nc = [[sum(a[i][k] * b[k][j] for k in range(inner)) for j in range(cols)] for i in range(rows)]\nfor row in c:\n    print(row)`
    },
    collections: {
      label: { uk: "Колекції (collections)", en: "Collections", tr: "Koleksiyonlar" },
      code: `import collections\nc = collections.Counter("abracadabra")\nprint("counts:", c.most_common(3))\nd = collections.defaultdict(list)\nfor k, v in [("a", 1), ("b", 2), ("a", 3)]:\n    d[k].append(v)\nprint("grouped:", dict(d))\nprint("deque:", collections.deque([1, 2, 3]))`
    },
    stringmod: {
      label: { uk: "Рядки (string)", en: "String module", tr: "String modülü" },
      code: `import string\nprint("lower:", string.ascii_lowercase)\nprint("digits:", string.digits)\nprint("punct:", string.punctuation)\ntmpl = string.Template("Hello, $name!")\nprint(tmpl.substitute(name="World"))`
    },
    jsonmod: {
      label: { uk: "JSON", en: "JSON", tr: "JSON" },
      code: `import json\ndata = {"name": "Ana", "age": 17, "tags": ["py", "js"]}\ntext = json.dumps(data, ensure_ascii=False, indent=2)\nprint(text)\nback = json.loads(text)\nprint("keys:", list(back.keys()))`
    },
    decimalmod: {
      label: { uk: "Точні числа (decimal)", en: "Decimal", tr: "Decimal" },
      code: `from decimal import Decimal\nprint("decimal:", Decimal("0.1") + Decimal("0.2"))\nprint("float trap:", 0.1 + 0.2)\nprint("rounded:", round(Decimal("3.14159"), 2))`
    },
    fractionsmod: {
      label: { uk: "Дроби (fractions)", en: "Fractions", tr: "Kesirler" },
      code: `from fractions import Fraction\nprint(Fraction(1, 3) + Fraction(1, 6))\nprint(Fraction(3, 4) * Fraction(2, 5))\nprint("from string:", Fraction("0.25"))\nprint("limit:", Fraction(355, 113).limit_denominator(100))`
    },
    timemod: {
      label: { uk: "Час і виміри (time)", en: "Time & timing", tr: "Zaman ve ölçüm" },
      code: `import time\nstart = time.perf_counter()\ntotal = sum(i * i for i in range(100000))\nelapsed = time.perf_counter() - start\nprint("sum:", total)\nprint("took ms:", round(elapsed * 1000, 3))\nprint("timestamp:", int(time.time()))`
    },
    functoolsmod: {
      label: { uk: "functools", en: "functools", tr: "functools" },
      code: `import functools\nnums = [1, 2, 3, 4, 5]\nprint("product:", functools.reduce(lambda a, b: a * b, nums))\n\n@functools.lru_cache(maxsize=None)\ndef fib(n):\n    return n if n < 2 else fib(n - 1) + fib(n - 2)\nprint("fib(30):", fib(30))\nprint("cache hits:", fib.cache_info().hits)`
    },
    remod: {
      label: { uk: "Регулярні вирази (re)", en: "Regex (re)", tr: "Düzenli ifadeler (re)" },
      code: `import re\ntext = "Contact: anna@mail.com or +380 67 123 4567"\nemails = re.findall(r"[\\w.]+@[\\w.]+", text)\nphones = re.findall(r"\\+?\\d[\\d\\s]{6,}", text)\nprint("emails:", emails)\nprint("phones:", phones)\nprint("mask:", re.sub(r"\\d", "*", "a1b2c3"))`
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

  // Ключові слова / вбудовані функції для автодоповнення та підсвітки синтаксису
  const PY_KEYWORDS = [
    "False","None","True","and","as","assert","async","await","break","class","continue","def","del","elif","else","except","finally","for","from","global","if","import","in","is","lambda","nonlocal","not","or","pass","raise","return","try","while","with","yield"
  ];
  const PY_BUILTINS = [
    "abs","all","any","bool","dict","dir","enumerate","filter","float","format","help","input","int","isinstance","len","list","map","max","min","print","range","reversed","round","set","sorted","str","sum","tuple","type","zip"
  ];
  const PY_MODULES = [
    "math","random","string","json","datetime","statistics","itertools","collections","decimal","fractions","time","functools","re"
  ];
  const KEYWORDS = PY_KEYWORDS.concat(PY_BUILTINS, PY_MODULES);

  /* ---------- Підсвітка синтаксису ---------- */
  // Порядок альтернатив важливий: коментарі й рядки «з'їдають» текст раніше за ключові слова
  const TOKEN_RE = new RegExp(
    "(#[^\\n]*)"
    + "|(\"\"\"[\\s\\S]*?\"\"\"|'''[\\s\\S]*?'''|\"(?:\\\\.|[^\"\\\\\\n])*\"|'(?:\\\\.|[^'\\\\\\n])*')"
    + "|\\b(" + PY_KEYWORDS.join("|") + ")\\b"
    + "|\\b(" + PY_BUILTINS.join("|") + ")\\b"
    + "|\\b(\\d[\\d_]*(?:\\.\\d+)?(?:[eE][+-]?\\d+)?)\\b",
    "g"
  );

  function escapeHtml(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function highlightCode(code) {
    let html = "";
    let last = 0;
    let m;
    TOKEN_RE.lastIndex = 0;
    while ((m = TOKEN_RE.exec(code)) !== null) {
      const cls = m[1] ? "tk-com" : m[2] ? "tk-str" : m[3] ? "tk-kw" : m[4] ? "tk-bi" : "tk-num";
      html += escapeHtml(code.slice(last, m.index)) + '<span class="' + cls + '">' + escapeHtml(m[0]) + "</span>";
      last = m.index + m[0].length;
      if (m[0].length === 0) TOKEN_RE.lastIndex++;
    }
    return html + escapeHtml(code.slice(last)) + "\n";
  }

  function updateHighlight() {
    if (!hlEl || !codeEl) return;
    hlEl.innerHTML = highlightCode(codeEl.value);
    hlEl.scrollTop = codeEl.scrollTop;
    hlEl.scrollLeft = codeEl.scrollLeft;
  }

  const SNKEY = "app.snippets";
  const SN = {
    uk: { title: "Особистий код", namePh: "Назва програми", save: "Зберегти", open: "Відкрити", del: "Видалити", empty: "Поки немає збережених програм. Напиши код і натисни «Зберегти».", saved: "Збережено!", needName: "Спершу введи назву", loaded: "Код завантажено" },
    en: { title: "Personal code", namePh: "Program name", save: "Save", open: "Open", del: "Delete", empty: "No saved programs yet. Write some code and press Save.", saved: "Saved!", needName: "Enter a name first", loaded: "Code loaded" },
    tr: { title: "Kişisel kod", namePh: "Program adı", save: "Kaydet", open: "Aç", del: "Sil", empty: "Henüz kayıtlı program yok. Kod yaz ve Kaydet'e bas.", saved: "Kaydedildi!", needName: "Önce bir ad gir", loaded: "Kod yüklendi" }
  };
  const IDLE = {
    uk: "Натисни «Запуск», щоб завантажити Python",
    en: "Press Run to load Python",
    tr: "Python'u yüklemek için Çalıştır'a bas"
  };
  const L = (obj) => obj[global.I18n ? global.I18n.lang : "uk"] || obj.uk;
  const toast = (m) => { if (global.App && global.App.toast) global.App.toast(m); };

  let py = null;
  let pyState = "idle";
  let out, codeEl, runBtn, statusEl, lineNums, hintList, exSel, acBox, hlEl;
  let statsText, statsTime, copyBtn, saveBtn;
  let lastLoadMs = null, lastExecMs = null;
  let snList, snName;

  function setStatus(state) {
    pyState = state;
    if (state === "idle") {
      statusEl.className = "md-chip loading";
      statusEl.textContent = L(IDLE);
      return;
    }
    const map = { loading: "python.loading", ready: "python.ready", error: "python.error", running: "python.running" };
    statusEl.className = "md-chip " + state;
    statusEl.textContent = global.I18n.t(map[state] || "python.loading");
  }

  function setOutput(text, isErr, cls, jumpLine) {
    const line = document.createElement("div");
    if (isErr) line.className = "err";
    else if (cls) line.className = cls;
    const ts = global.Settings && global.Settings.get("timestamps")
      ? "[" + new Date().toLocaleTimeString() + "] " : "";
    line.appendChild(document.createTextNode(ts + text));
    const n = Number(jumpLine);
    if (Number.isInteger(n) && n > 0 && codeEl && n <= codeEl.value.split("\n").length) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "goto-line";
      btn.textContent = "→ " + n;
      const label = global.I18n.t("python.gotoLine", { n: n });
      btn.title = label;
      btn.setAttribute("aria-label", label);
      btn.onclick = () => gotoLine(n);
      line.appendChild(document.createTextNode(" "));
      line.appendChild(btn);
    }
    out.appendChild(line);
    out.scrollTop = out.scrollHeight;
  }

  // Номер рядка з трейсбека Python: спершу кадри коду користувача (<exec>),
  // інакше помилка всередині бібліотеки вела б на чужий номер рядка
  function tracebackLine(msg) {
    const text = String(msg || "");
    let n = null;
    let m;
    const userRe = /File "<exec>", line (\d+)/g;
    while ((m = userRe.exec(text)) !== null) n = parseInt(m[1], 10);
    if (n === null) {
      const anyRe = /\bline (\d+)/g;
      while ((m = anyRe.exec(text)) !== null) n = parseInt(m[1], 10);
    }
    return Number.isInteger(n) && n > 0 ? n : null;
  }

  function gotoLine(n) {
    if (!codeEl) return;
    const lines = codeEl.value.split("\n");
    const idx = Math.min(Math.max(n, 1), lines.length);
    let start = 0;
    for (let i = 0; i < idx - 1; i++) start += lines[i].length + 1;
    codeEl.focus();
    codeEl.setSelectionRange(start, start + lines[idx - 1].length);
    const lh = parseFloat(getComputedStyle(codeEl).lineHeight) || 22;
    codeEl.scrollTop = Math.max(0, (idx - 1) * lh - codeEl.clientHeight / 2);
    if (hlEl) { hlEl.scrollTop = codeEl.scrollTop; hlEl.scrollLeft = codeEl.scrollLeft; }
    if (lineNums) lineNums.scrollTop = codeEl.scrollTop;
    global.Audio2 && global.Audio2.SFX.pop();
    const wrap = codeEl.closest(".editor-wrap");
    if (wrap) {
      wrap.classList.remove("jump-flash");
      void wrap.offsetWidth;
      wrap.classList.add("jump-flash");
      setTimeout(() => wrap.classList.remove("jump-flash"), 800);
    }
  }

  function updateLineNumbers() {
    const lines = codeEl.value.split("\n").length;
    lineNums.textContent = Array.from({ length: lines }, (_, i) => i + 1).join("\n");
    updateStats();
    updateHighlight();
  }

  /* ---------- Статистика коду, час виконання, копіювання та експорт ---------- */
  function fmtTime(ms) {
    return ms < 1000
      ? global.I18n.t("python.timeMs", { v: Math.round(ms) })
      : global.I18n.t("python.timeSec", { v: (ms / 1000).toFixed(1) });
  }

  function updateStats() {
    if (!statsText || !codeEl) return;
    const value = codeEl.value;
    statsText.textContent = global.I18n.t("python.stats", {
      lines: value.split("\n").length,
      chars: value.length
    });
  }

  function renderExecInfo() {
    if (!statsTime) return;
    const parts = [];
    if (lastLoadMs != null) parts.push(global.I18n.t("python.loadTime", { time: fmtTime(lastLoadMs) }));
    if (lastExecMs != null) parts.push(global.I18n.t("python.execTime", { time: fmtTime(lastExecMs) }));
    statsTime.textContent = parts.join(" · ");
  }

  function applyBtnTitles() {
    if (copyBtn) { copyBtn.title = global.I18n.t("python.copy"); copyBtn.setAttribute("aria-label", copyBtn.title); }
    if (saveBtn) { saveBtn.title = global.I18n.t("python.savePy"); saveBtn.setAttribute("aria-label", saveBtn.title); }
  }

  async function copyCode() {
    const text = codeEl.value;
    if (!text.trim()) { toast(global.I18n.t("python.emptyCode")); return; }
    let ok = false;
    try {
      if (navigator.clipboard && global.isSecureContext) {
        await navigator.clipboard.writeText(text);
        ok = true;
      }
    } catch (e) { ok = false; }
    if (!ok) {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.cssText = "position:fixed;top:0;left:0;opacity:0";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      ta.setSelectionRange(0, text.length);
      try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
      ta.remove();
    }
    toast(global.I18n.t(ok ? "python.copied" : "python.copyFail"));
    global.Audio2 && global.Audio2.SFX[ok ? "pop" : "error"]();
  }

  function savePyFile() {
    const text = codeEl.value;
    if (!text.trim()) { toast(global.I18n.t("python.emptyCode")); return; }
    const url = URL.createObjectURL(new Blob([text], { type: "text/x-python;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "program.py";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast(global.I18n.t("python.fileSaved"));
    global.Audio2 && global.Audio2.SFX.success();
  }

  function insertAtCursor(text) {
    const s = codeEl.selectionStart, e = codeEl.selectionEnd;
    codeEl.value = codeEl.value.slice(0, s) + text + codeEl.value.slice(e);
    codeEl.selectionStart = codeEl.selectionEnd = s + text.length;
    codeEl.focus();
    updateLineNumbers();
  }

  function indentUnit() {
    return " ".repeat(Number(global.Settings && global.Settings.get("tabSize")) || 4);
  }

  // Enter зберігає відступ поточного рядка, а після «:» додає ще один рівень
  function smartEnter(e) {
    const value = codeEl.value;
    const pos = codeEl.selectionStart;
    const lineStart = value.lastIndexOf("\n", pos - 1) + 1;
    const typed = value.slice(lineStart, pos);
    const indent = (typed.match(/^[ \t]*/) || [""])[0];
    const opensBlock = /:[ \t]*(#.*)?$/.test(typed);
    const insert = "\n" + indent + (opensBlock ? indentUnit() : "");
    e.preventDefault();
    codeEl.value = value.slice(0, pos) + insert + value.slice(codeEl.selectionEnd);
    codeEl.selectionStart = codeEl.selectionEnd = pos + insert.length;
    updateLineNumbers();
  }

  // Ctrl+/ — закоментувати або розкоментувати позначені рядки
  function toggleComment() {
    const value = codeEl.value;
    const from = codeEl.selectionStart, to = codeEl.selectionEnd;
    const start = value.lastIndexOf("\n", from - 1) + 1;
    let end = value.indexOf("\n", to);
    if (end === -1) end = value.length;
    const lines = value.slice(start, end).split("\n");
    const allCommented = lines.every((l) => !l.trim() || /^\s*#/.test(l));
    const next = lines.map((l) => {
      if (!l.trim()) return l;
      const lead = (l.match(/^[ \t]*/) || [""])[0];
      return allCommented
        ? lead + l.slice(lead.length).replace(/^#[ \t]?/, "")
        : lead + "# " + l.slice(lead.length);
    }).join("\n");
    codeEl.value = value.slice(0, start) + next + value.slice(end);
    codeEl.selectionStart = start;
    codeEl.selectionEnd = start + next.length;
    updateLineNumbers();
    global.Audio2 && global.Audio2.SFX.pop();
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

  /* ---------- Особистий код (збережені снипети) ---------- */
  function loadSnippets() {
    try { const a = JSON.parse(localStorage.getItem(SNKEY) || "[]"); return Array.isArray(a) ? a : []; }
    catch (e) { return []; }
  }
  function persistSnippets(list) { localStorage.setItem(SNKEY, JSON.stringify(list)); }

  function renderSnippets() {
    if (!snList) return;
    const items = loadSnippets();
    snList.innerHTML = "";
    if (!items.length) {
      const e = document.createElement("div");
      e.className = "snippet-empty";
      e.textContent = L(SN).empty;
      snList.appendChild(e);
      return;
    }
    items.forEach((it, idx) => {
      const row = document.createElement("div");
      row.className = "snippet-row";
      const title = document.createElement("span");
      title.className = "snippet-title";
      title.textContent = it.name;
      const acts = document.createElement("div");
      acts.className = "snippet-actions";
      const openB = document.createElement("button");
      openB.className = "btn text";
      openB.textContent = L(SN).open;
      openB.onclick = () => {
        codeEl.value = it.code || "";
        updateLineNumbers();
        if (global.Settings && global.Settings.get("autosaveCode")) localStorage.setItem("app.code", codeEl.value);
        codeEl.scrollIntoView({ behavior: "smooth", block: "center" });
        global.Audio2 && global.Audio2.SFX.pop();
        toast(L(SN).loaded);
      };
      const delB = document.createElement("button");
      delB.className = "btn outlined danger";
      delB.textContent = L(SN).del;
      delB.onclick = () => {
        const list = loadSnippets();
        list.splice(idx, 1);
        persistSnippets(list);
        renderSnippets();
        global.Audio2 && global.Audio2.SFX.click();
      };
      acts.append(openB, delB);
      row.append(title, acts);
      snList.appendChild(row);
    });
  }

  function buildSnippets() {
    const view = document.getElementById("view-python");
    if (!view || view.querySelector(".snippets-card")) return;
    const card = document.createElement("div");
    card.className = "card elev1 snippets-card";

    const bar = document.createElement("div");
    bar.className = "card-bar";
    const bt = document.createElement("span");
    bt.className = "bar-title";
    const btIco = document.createElement("span");
    btIco.className = "material-icons";
    btIco.textContent = "save";
    const btText = document.createElement("span");
    btText.className = "snippets-title";
    btText.textContent = L(SN).title;
    bt.append(btIco, btText);
    bar.appendChild(bt);
    card.appendChild(bar);

    const body = document.createElement("div");
    body.className = "snippets-body";
    const saveRow = document.createElement("div");
    saveRow.className = "snippet-save";
    snName = document.createElement("input");
    snName.className = "snippet-name";
    snName.type = "text";
    snName.maxLength = 40;
    snName.placeholder = L(SN).namePh;
    const saveB = document.createElement("button");
    saveB.className = "btn contained snippet-save-btn";
    saveB.textContent = L(SN).save;
    const doSave = () => {
      const name = (snName.value || "").trim();
      if (!name) { toast(L(SN).needName); snName.focus(); return; }
      const list = loadSnippets();
      list.unshift({ name: name, code: codeEl.value, ts: Date.now() });
      persistSnippets(list);
      snName.value = "";
      renderSnippets();
      global.Audio2 && global.Audio2.SFX.success();
      toast(L(SN).saved);
    };
    saveB.onclick = doSave;
    snName.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); doSave(); } });
    saveRow.append(snName, saveB);
    snList = document.createElement("div");
    snList.className = "snippet-list";
    body.append(saveRow, snList);
    card.appendChild(body);

    const layout = view.querySelector(".py-layout");
    if (layout) layout.insertAdjacentElement("afterend", card);
    else view.appendChild(card);
    renderSnippets();
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

  /* ---------- Ліниве завантаження Pyodide (лише при першому запуску) ---------- */
  const PYODIDE_URL = "https://cdn.jsdelivr.net/pyodide/v0.26.2/full/";
  let pyPromise = null;
  function ensurePyodide() {
    if (py) return Promise.resolve(py);
    if (pyPromise) return pyPromise;
    setStatus("loading");
    pyPromise = (async () => {
      if (typeof global.loadPyodide !== "function") {
        await new Promise((res, rej) => {
          const s = document.createElement("script");
          s.src = PYODIDE_URL + "pyodide.js";
          s.onload = res;
          s.onerror = () => rej(new Error("pyodide.js not loaded"));
          document.head.appendChild(s);
        });
      }
      py = await global.loadPyodide({ indexURL: PYODIDE_URL });
      return py;
    })();
    return pyPromise;
  }

  /* ---------- Модулі: авто-довантаження з імпортів коду ---------- */
  // Модулі, яких у Pyodide немає взагалі (браузерні обмеження) — даємо зрозумілу підказку
  const UNSUPPORTED_MODULES = {
    tkinter: "tkinter (графічний інтерфейс) не працює у браузері. Спробуй намалювати інтерфейс через matplotlib, turtle-подібні бібліотеки або просто вивести текст.",
    turtle: "turtle у Pyodide обмежений, але зазвичай доступний як пакет — спробуй ще раз, або намалюй графіку через matplotlib.",
    cv2: "cv2 (OpenCV) недоступний у Pyodide. Спробуй обробку зображень через numpy / Pillow (PIL).",
    pygame: "pygame не працює у браузері (немає доступу до вікна/звуку ОС). Для ігор спробуй простий текстовий цикл або matplotlib для графіки.",
    PyQt5: "PyQt5 не працює у браузері. Графічний інтерфейс у Pyodide обмежений — виводи результат текстом або через matplotlib.",
    PyQt6: "PyQt6 не працює у браузері. Графічний інтерфейс у Pyodide обмежений — виводи результат текстом або через matplotlib.",
    wx: "wxPython не працює у браузері. Виводи результат текстом або через matplotlib.",
    kivy: "Kivy не працює у браузері. Виводи результат текстом або через matplotlib.",
    selenium: "selenium не працює у браузері (немає доступу до драйвера браузера).",
    requests: "requests доступний у Pyodide як пакет — він має довантажитись автоматично. Якщо помилка лишилась, спробуй urllib.request (вбудований модуль)."
  };
  function unsupportedHint(code) {
    const hits = [];
    for (const mod of Object.keys(UNSUPPORTED_MODULES)) {
      const re = new RegExp("(^|[^\\w.])(import|from)\\s+" + mod + "\\b", "m");
      if (re.test(code)) hits.push(mod);
    }
    return hits;
  }

  async function loadModulesFromCode(code) {
    // Pyodide сам визначає імпорти в коді та довантажує доступні пакети
    // (numpy, pandas, matplotlib, sympy, requests, Pillow, scipy тощо)
    try {
      await py.loadPackagesFromImports(code);
    } catch (e) {
      setOutput("Попередження: не вдалось довантажити деякі модулі: " + e.message, true);
    }
  }

  /* ---------- Виконання коду зі stdin (для розділу «Задачі») ---------- */
  // Навмисно не пише в консоль майданчика: повертає результат виклику
  async function execute(code, stdinText) {
    await ensurePyodide();
    await loadModulesFromCode(code);
    const lines = String(stdinText == null ? "" : stdinText).split("\n");
    let idx = 0;
    let output = "";
    let error = null;
    py.setStdin({ stdin: () => (idx < lines.length ? lines[idx++] + "\n" : "") });
    py.setStdout({ batched: (s) => { output += s + "\n"; } });
    py.setStderr({ batched: (s) => { output += s + "\n"; } });
    try {
      await py.runPythonAsync(code);
    } catch (e) {
      error = e && e.message ? e.message : String(e);
    } finally {
      py.setStdin({ stdin: () => "" });
      py.setStdout({ batched: (s) => setOutput(s) });
      py.setStderr({ batched: (s) => setOutput(s, true, null, tracebackLine(s)) });
    }
    return { output: output, error: error, line: tracebackLine(error) };
  }

  /* ---------- Міні-перевірка коду перед запуском ---------- */
  // Правила навмисно консервативні: краще промовчати, ніж показати хибне попередження
  const LINT_MAX = 5;
  function lintCode(code) {
    const t = (k, v) => global.I18n.t(k, v);
    const warns = [];
    const openers = { "(": ")", "[": "]", "{": "}" };
    const closers = { ")": "(", "]": "[", "}": "{" };
    const stack = [];
    const lines = code.split("\n");
    let quote = null;
    let triple = false;

    for (let i = 0; i < lines.length; i++) {
      const raw = lines[i];
      const lineNo = i + 1;
      let codePart = raw;

      for (let j = 0; j < raw.length; j++) {
        const ch = raw[j];
        if (quote) {
          if (triple && raw.startsWith(quote.repeat(3), j)) { quote = null; triple = false; j += 2; }
          else if (!triple && ch === quote && raw[j - 1] !== "\\") { quote = null; }
          continue;
        }
        if (ch === "#") { codePart = raw.slice(0, j); break; }
        if (ch === '"' || ch === "'") {
          triple = raw.startsWith(ch.repeat(3), j);
          quote = ch;
          if (triple) j += 2;
          continue;
        }
        if (openers[ch]) stack.push({ ch: ch, line: lineNo });
        else if (closers[ch]) {
          const top = stack.pop();
          if (top && top.ch !== closers[ch]) warns.push({ text: t("python.lint.bracket", { ch: top.ch, line: top.line }), line: top.line });
        }
      }

      if (quote && !triple) {
        warns.push({ text: t("python.lint.quote", { line: lineNo }), line: lineNo });
        quote = null;
      }

      const lead = (raw.match(/^[ \t]*/) || [""])[0];
      if (lead.includes("\t") && lead.includes(" ")) warns.push({ text: t("python.lint.indentMix", { line: lineNo }), line: lineNo });

      const kw = codePart.match(/^\s*(if|elif|else|for|while|def|class|try|except|finally|with)\b/);
      if (kw && stack.length === 0) {
        const stmt = codePart.trim();
        if (stmt && !stmt.endsWith(":") && !stmt.endsWith("\\")) {
          warns.push({ text: t("python.lint.colon", { kw: kw[1], line: lineNo }), line: lineNo });
        }
      }
    }

    stack.forEach((item) => warns.push({ text: t("python.lint.bracket", { ch: item.ch, line: item.line }), line: item.line }));
    return warns;
  }

  function showLintWarnings(code) {
    if (!(global.Settings && global.Settings.get("codeCheck"))) return;
    const warns = lintCode(code);
    warns.slice(0, LINT_MAX).forEach((w) => setOutput("⚠️ " + w.text, false, "warn", w.line));
    if (warns.length > LINT_MAX) setOutput("⚠️ " + global.I18n.t("python.lint.more", { n: warns.length - LINT_MAX }), false, "warn");
  }

  async function run() {
    out.innerHTML = "";
    runBtn.disabled = true;
    global.Audio2 && global.Audio2.SFX.click();
    showLintWarnings(codeEl.value);
    lastLoadMs = null; lastExecMs = null;
    renderExecInfo();
    const firstLoad = !py;
    const t0 = performance.now();
    try {
      await ensurePyodide();
    } catch (e) {
      pyPromise = null;
      setStatus("error");
      setOutput("Pyodide: " + e.message, true);
      global.Audio2 && global.Audio2.SFX.error();
      runBtn.disabled = false;
      return;
    }
    if (firstLoad) { lastLoadMs = performance.now() - t0; renderExecInfo(); }
    setStatus("loading");
    await loadModulesFromCode(codeEl.value);
    setStatus("running");
    py.setStdout({ batched: (s) => setOutput(s) });
    py.setStderr({ batched: (s) => setOutput(s, true, null, tracebackLine(s)) });
    const t1 = performance.now();
    try {
      await py.runPythonAsync(codeEl.value);
      global.Audio2 && global.Audio2.SFX.success();
      document.dispatchEvent(new CustomEvent("pythonrun"));
    } catch (e) {
      setOutput(e.message, true, null, tracebackLine(e.message));
      const hits = unsupportedHint(codeEl.value);
      if (hits.length) {
        setOutput("", true);
        for (const m of hits) setOutput("💡 " + UNSUPPORTED_MODULES[m], true);
      }
      global.Audio2 && global.Audio2.SFX.error();
    } finally {
      lastExecMs = performance.now() - t1;
      renderExecInfo();
      runBtn.disabled = false;
      setStatus("ready");
    }
  }

  function init() {
    out = $("#out"); codeEl = $("#code"); runBtn = $("#run"); statusEl = $("#pyStatus");
    lineNums = $("#lineNumbers"); hintList = $("#hintList"); exSel = $("#examples");
    statsText = $("#pyStatsText"); statsTime = $("#pyStatsTime");
    copyBtn = $("#copyCode"); saveBtn = $("#savePy");
    hlEl = $("#highlight");
    if (!codeEl) return;

    acBox = document.createElement("div");
    acBox.className = "autocomplete";
    document.body.appendChild(acBox);

    buildHints();
    buildExamples(true);
    buildSnippets();
    setStatus("idle");
    runBtn.disabled = false;
    applyBtnTitles();
    const saved = localStorage.getItem("app.code");
    if (saved && global.Settings && global.Settings.get("autosaveCode")) {
      codeEl.value = saved; updateLineNumbers();
    }
    updateStats();
    if (hlEl) hlEl.innerHTML = highlightCode(codeEl.value);
    const applyWrap = () => { codeEl.wrap = global.Settings.get("wordWrap") ? "soft" : "off"; };
    applyWrap();
    document.addEventListener("settingschange", (e) => { if (e.detail.key === "wordWrap") applyWrap(); });

    codeEl.addEventListener("input", () => { updateLineNumbers(); showAutocomplete(); });
    codeEl.addEventListener("scroll", () => {
      lineNums.scrollTop = codeEl.scrollTop;
      if (hlEl) { hlEl.scrollTop = codeEl.scrollTop; hlEl.scrollLeft = codeEl.scrollLeft; }
    });
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
      if (sc && (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") { e.preventDefault(); savePyFile(); return; }
      if (sc && (e.ctrlKey || e.metaKey) && e.key === "/") { e.preventDefault(); toggleComment(); return; }
      if (e.key === "Enter" && !e.ctrlKey && !e.metaKey && global.Settings && global.Settings.get("autoIndent")) {
        smartEnter(e);
        return;
      }
      if (sc && e.key === "Tab") {
        e.preventDefault();
        insertAtCursor(indentUnit());
      }
    });

    // Автозбереження коду
    codeEl.addEventListener("input", () => {
      if (global.Settings && global.Settings.get("autosaveCode")) localStorage.setItem("app.code", codeEl.value);
    });

    runBtn.onclick = run;
    if (copyBtn) copyBtn.onclick = copyCode;
    if (saveBtn) saveBtn.onclick = savePyFile;
    $("#clearCode").onclick = () => { codeEl.value = ""; updateLineNumbers(); global.Audio2 && global.Audio2.SFX.click(); };
    $("#clearOut").onclick = () => { out.innerHTML = ""; };
    exSel.onchange = () => {
      const k = exSel.value;
      if (EXAMPLES[k]) { codeEl.value = EXAMPLES[k].code; updateLineNumbers(); global.Audio2 && global.Audio2.SFX.pop(); }
    };

    document.addEventListener("langchange", () => {
      buildExamples(false); // лише оновити назви прикладів, код не чіпати
      renderSnippets();
      if (snName) snName.placeholder = L(SN).namePh;
      const titleEl = document.querySelector(".snippets-card .snippets-title");
      if (titleEl) titleEl.textContent = L(SN).title;
      const snippetSave = document.querySelector(".snippets-card .snippet-save-btn");
      if (snippetSave) snippetSave.textContent = L(SN).save;
      applyBtnTitles();
      updateStats();
      renderExecInfo();
      setStatus(pyState);
    });
  }

  global.PythonPad = { init, run, execute };
})(window);
