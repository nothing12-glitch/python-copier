/* debug.js — розділ «Розбирай помилки»: маленькі програми з умисною прогалиною.
   Треба знайти, що не так, і дописати код так, щоб вивід збігся з очікуваним.
   Перевірка суто текстовa — не потребує запуску Python, тож працює офлайн.
   Прогрес: app.debug.<user> = { solved: { id: 1 } } */
(function (global) {
  const $ = (s) => document.querySelector(s);
  const KEY = "app.debug.";
  const I = () => global.I18n;
  const t = (k, v) => (I() ? I().t(k, v) : k);

  function user() { return (global.Profile && global.Profile.handle()) || "guest"; }

  /* ---------- Завдання (одна прогалина «___» у коді) ---------- */
  const TASKS = [
    { id: "d01", lvl: 1, code: "for i in range(1, ___):\n    print(i)", out: "1\n2\n3\n4", hint: "Друкуються 1, 2, 3, 4. range зупиняється ДО верхньої межі.", ans: ["5"] },
    { id: "d02", lvl: 1, code: "print(7 ___ 2)", out: "3.5", hint: "Потрібна звичайна дробова ділення, не цілочисельна.", ans: ["/"] },
    { id: "d03", lvl: 1, code: 'print("2" ___ "3")', out: "23", hint: "Два рядки з'єднуються в один.", ans: ["+"] },
    { id: "d04", lvl: 1, code: "x = 10\nprint(___ + 5)", out: "15", hint: "Візьми значення зі змінної, яку щойно створено.", ans: ["x"] },
    { id: "d05", lvl: 1, code: "print(5 ___ 5)", out: "True", hint: "Порівняння, а не присвоювання.", ans: ["=="] },
    { id: "d06", lvl: 1, code: "nums = [10, 20, 30]\nprint(nums[___])", out: "30", hint: "Нумерація списку починається з 0.", ans: ["2"] },
    { id: "d07", lvl: 1, code: "word = \"Python\"\nprint(len(___))", out: "6", hint: "Потрібна змінна, а не літерал.", ans: ["word"] },
    { id: "d08", lvl: 1, code: "for i in range(0, 10, ___):\n    print(i)", out: "0\n2\n4\n6\n8", hint: "Крок циклу — парні числа.", ans: ["2"] },
    { id: "d09", lvl: 1, code: 'print(___)', out: "Hi", hint: "Виведи текст Hi у лапках.", ans: ['"Hi"', "'Hi'"] },
    { id: "d10", lvl: 1, code: "for i in range(___, 3):\n    print(i)", out: "1\n2", hint: "Цикл починається з 1 і йде до 3.", ans: ["1"] },

    { id: "d11", lvl: 2, code: "age = input()\nprint(___ + 1)", inp: "17", out: "18", hint: "input() повертає текст. Щоб додати число, спочатку перетвори.", ans: ["int(age)", "int( age )"] },
    { id: "d12", lvl: 2, code: 'name = "Ann"\nprint("Hi " + ___)', out: "Hi Ann", hint: "Додай змінну з ім'ям.", ans: ["name"] },
    { id: "d13", lvl: 2, code: "nums = [1, 2, 3, 4]\nprint(sum(___))", out: "10", hint: "sum приймає весь список.", ans: ["nums"] },
    { id: "d14", lvl: 2, code: "lst = [1, 2]\nlst.___(3)\nprint(lst)", out: "[1, 2, 3]", hint: "Метод, що додає один елемент в кінець.", ans: ["append"] },
    { id: "d15", lvl: 2, code: 'd = {"a": 1}\nprint(d["___"])', out: "1", hint: "Ключ словника, під яким лежить 1.", ans: ["a"] },
    { id: "d16", lvl: 2, code: "i = 1\nwhile i ___ 5:\n    print(i)\n    i += 1", out: "1\n2\n3\n4\n5", hint: "П'ятірка теж має надрукуватися.", ans: ["<=", "=<"] },
    { id: "d17", lvl: 2, code: "nums = [3, 9, 2]\nprint(max(___))", out: "9", hint: "max приймає список.", ans: ["nums"] },
    { id: "d18", lvl: 2, code: "print(10 ___ 3)", out: "3", hint: "Цілочисельне ділення (без остачі).", ans: ["//"] },
    { id: "d19", lvl: 2, code: 's = "hello"\nprint(s.___())', out: "HELLO", hint: "Метод рядка, що робить літери великими.", ans: ["upper"] },
    { id: "d20", lvl: 2, code: "print(abs(___))", out: "5", hint: "Модуль від'ємного числа.", ans: ["-5", "(-5)", "0 - 5"] },

    { id: "d21", lvl: 3, code: "def double(n):\n    ___ n * 2\nprint(double(5))", out: "10", hint: "Функція має ПОВЕРНУТИ результат, а не надрукувати.", ans: ["return"] },
    { id: "d22", lvl: 3, code: "def add(x, y=___):\n    return x + y\nprint(add(5))", out: "6", hint: "add(5) = 6, отже значення за замовчуванням для y.", ans: ["1"] },
    { id: "d23", lvl: 3, code: "squares = [___ for x in range(4)]\nprint(squares)", out: "[0, 1, 4, 9]", hint: "Квадрат числа x.", ans: ["x**2", "x*x", "x ** 2", "x * x"] },
    { id: "d24", lvl: 3, code: 'parts = "a,b,c".split("___")\nprint(len(parts))', out: "3", hint: "Розділювач — кома.", ans: [","] },
    { id: "d25", lvl: 3, code: "nums = [3, 1, 2]\nprint(sorted(nums, ___=True))", out: "[3, 2, 1]", hint: "Сортування у зворотному порядку.", ans: ["reverse"] },
    { id: "d26", lvl: 3, code: "print(10 ___ 3)", out: "1", hint: "Остача від ділення.", ans: ["%"] },
    { id: "d27", lvl: 3, code: 'for i, v in ___(["a", "b"]):\n    print(i, v)', out: "0 a\n1 b", hint: "Дає і індекс, і значення одразу.", ans: ["enumerate"] },
    { id: "d28", lvl: 3, code: 'd = {"x": 1, "y": 2}\nprint(len(d.___()))', out: "2", hint: "Будь-який метод словника, що перелічує його вміст.", ans: ["keys", "values", "items"] },
    { id: "d29", lvl: 3, code: "nums = [0, 1, 2, 3, 4]\nprint(nums[1:___])", out: "[1, 2, 3]", hint: "Зріз закінчується ДО індексу.", ans: ["4"] },
    { id: "d30", lvl: 3, code: "print(type(5) == ___)", out: "True", hint: "Тип цілого числа.", ans: ["int"] },
    { id: "d31", lvl: 3, code: 'print(___.join(["a", "b"]))', out: "a-b", hint: "Рядок-розділювач, яким з'єднуємо.", ans: ['"-"', "'-'"] },
    { id: "d32", lvl: 3, code: "print(True ___ False)", out: "False", hint: "Логічне «І» дає False, коли хоча б одне хибне.", ans: ["and"] }
  ];

  const BY_ID = {};
  TASKS.forEach((x) => { BY_ID[x.id] = x; });

  /* ---------- Стан ---------- */
  function getState() {
    try {
      const raw = localStorage.getItem(KEY + user());
      if (raw) { const o = JSON.parse(raw); return { solved: o.solved || {} }; }
    } catch (e) { /* чисто */ }
    return { solved: {} };
  }
  function saveState(s) {
    try { localStorage.setItem(KEY + user(), JSON.stringify(s)); }
    catch (e) { console.warn("[debug] save", e); }
  }

  let activeCat = 0;          // 0 = усі, інакше рівень 1..3
  let idx = 0;                // позиція в відфільтрованому списку
  let revealed = false;       // підказка
  let checked = false;        // чи вже перевірено поточну
  let correct = false;

  function visible() {
    return activeCat ? TASKS.filter((x) => x.lvl === activeCat) : TASKS;
  }
  function solvedCount() {
    const s = getState().solved;
    return TASKS.filter((x) => s[x.id]).length;
  }
  function current() {
    const list = visible();
    if (!list.length) return null;
    if (idx >= list.length) idx = list.length - 1;
    if (idx < 0) idx = 0;
    return list[idx];
  }

  function norm(s) { return String(s).replace(/\s+/g, "").toLowerCase(); }
  function isCorrect(task, val) {
    const v = norm(val);
    return v !== "" && task.ans.some((a) => norm(a) === v);
  }

  /* ---------- Рендер ---------- */
  let ready = false;
  let stageEl;

  function esc(x) { return String(x).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c])); }
  function sfx(name) { if (global.Audio && global.Audio.sfx) { try { global.Audio.sfx(name); } catch (e) {} } }

  function codeWithInput(task) {
    const lines = task.code.split("\n");
    return lines.map((line) => {
      const parts = line.split("___");
      if (parts.length === 1) return '<span class="dbg-line">' + esc(line) + "</span>";
      const fill = '<input class="dbg-fill" type="text" spellcheck="false" autocomplete="off" autocapitalize="off" aria-label="' + esc(t("debug.blank")) + '">';
      return '<span class="dbg-line">' + esc(parts[0]) + fill + esc(parts.slice(1).join("___")) + "</span>";
    }).join("");
  }

  function render() {
    if (!stageEl) return;
    const total = TASKS.length;
    const solved = solvedCount();

    // чіпи рівнів
    const chips = [
      chip(0, t("debug.all"), total),
      chip(1, t("tasks.level1"), TASKS.filter((x) => x.lvl === 1).length),
      chip(2, t("tasks.level2"), TASKS.filter((x) => x.lvl === 2).length),
      chip(3, t("tasks.level3"), TASKS.filter((x) => x.lvl === 3).length)
    ].join("");

    const task = current();
    let body;
    if (!task) {
      body = '<p class="dbg-empty muted">' + esc(t("debug.empty")) + "</p>";
    } else {
      const list = visible();
      const isDone = !!getState().solved[task.id];
      const ioBox = task.inp
        ? '<div class="dbg-io"><span class="dbg-io-tag">' + esc(t("tasks.inputData")) + '</span><pre>' + esc(task.inp) + "</pre></div>"
        : "";
      const feedback = checked
        ? (correct
          ? '<div class="dbg-fb ok"><span class="material-icons">check_circle</span><span>' + esc(t("debug.correct")) + "</span></div>"
          : '<div class="dbg-fb bad"><span class="material-icons">error</span><span>' + esc(t("debug.wrong")) + "</span></div>")
        : "";
      const hintBox = revealed ? '<p class="dbg-hint"><span class="material-icons">lightbulb</span>' + esc(task.hint) + "</p>" : "";

      body =
        '<div class="dbg-bar"><i style="width:' + (total ? (solved / total) * 100 : 0).toFixed(1) + '%"></i></div>' +
        '<div class="dbg-meta">' +
          '<span class="dbg-pos">' + esc(t("debug.position", { i: list.indexOf(task) + 1, n: list.length })) + "</span>" +
          '<span class="dbg-lvl">' + esc(t("tasks.level" + task.lvl)) + "</span>" +
          (isDone ? '<span class="dbg-solved-tag"><span class="material-icons">task_alt</span>' + esc(t("debug.solvedTag")) + "</span>" : "") +
        "</div>" +
        '<pre class="dbg-code code-block">' + codeWithInput(task) + "</pre>" +
        '<div class="dbg-io"><span class="dbg-io-tag">' + esc(t("debug.expect")) + "</span><pre>" + esc(task.out) + "</pre></div>" +
        ioBox +
        hintBox +
        feedback +
        '<div class="task-actions dbg-actions">' +
          '<button class="btn text" type="button" data-act="prev" ' + (list.indexOf(task) <= 0 ? "disabled" : "") + '><span class="material-icons">chevron_left</span></button>' +
          '<button class="btn outlined" type="button" data-act="hint"><span class="material-icons">lightbulb</span><span>' + esc(t("debug.hint")) + "</span></button>" +
          '<button class="btn contained" type="button" data-act="check"><span class="material-icons">play_arrow</span><span>' + esc(t("debug.check")) + "</span></button>" +
          '<button class="btn text" type="button" data-act="next" ' + (list.indexOf(task) >= list.length - 1 ? "disabled" : "") + '><span class="material-icons">chevron_right</span></button>' +
        "</div>";
    }

    stageEl.innerHTML =
      '<div class="dbg-head">' +
        '<div class="dbg-stats"><b>' + solved + "</b> / " + total + " · " + esc(t("debug.solved")) + "</div>" +
        '<div class="dbg-chips">' + chips + "</div>" +
      "</div>" +
      body;
  }

  function chip(lvl, label, n) {
    return '<button class="dbg-chip' + (activeCat === lvl ? " on" : "") + '" type="button" data-cat="' + lvl + '">' +
      esc(label) + "<b>" + n + "</b></button>";
  }

  function doCheck() {
    const task = current();
    if (!task) return;
    const input = stageEl.querySelector(".dbg-fill");
    const val = input ? input.value : "";
    checked = true;
    correct = isCorrect(task, val);
    if (correct) {
      const s = getState();
      const wasNew = !s.solved[task.id];
      s.solved[task.id] = 1;
      saveState(s);
      sfx("success");
      if (wasNew) {
        document.dispatchEvent(new CustomEvent("debugdone", {
          detail: { solved: solvedCount(), total: TASKS.length, all: solvedCount() === TASKS.length }
        }));
      }
    } else {
      sfx("click");
    }
    render();
    const again = stageEl.querySelector(".dbg-fill");
    if (again && !correct) again.focus();
  }

  function onClick(ev) {
    const chipEl = ev.target.closest(".dbg-chip");
    if (chipEl) { activeCat = parseInt(chipEl.getAttribute("data-cat"), 10) || 0; idx = 0; checked = false; revealed = false; render(); return; }
    const btn = ev.target.closest("[data-act]");
    if (!btn || btn.disabled) return;
    const act = btn.getAttribute("data-act");
    const list = visible();
    const task = current();
    if (!task) return;
    const pos = list.indexOf(task);
    if (act === "check") { doCheck(); }
    else if (act === "hint") { revealed = !revealed; sfx("pop"); render(); }
    else if (act === "prev") { if (pos > 0) { idx = pos - 1; checked = false; revealed = false; render(); } }
    else if (act === "next") { if (pos < list.length - 1) { idx = pos + 1; checked = false; revealed = false; render(); } }
  }

  function onKey(ev) {
    if (ev.key === "Enter" && ev.target.classList && ev.target.classList.contains("dbg-fill")) {
      ev.preventDefault();
      doCheck();
    }
  }

  function init() {
    if (ready) { render(); return; }
    stageEl = $("#debugStage");
    if (!stageEl) return;
    ready = true;
    stageEl.addEventListener("click", onClick);
    stageEl.addEventListener("keydown", onKey);
    const resetBtn = $("#debugReset");
    if (resetBtn) resetBtn.addEventListener("click", () => {
      if (window.confirm(t("debug.reset") + "?")) global.DebugLab.reset();
    });
    document.addEventListener("langchange", () => { try { render(); } catch (e) { console.warn("debug langchange", e); } });
    render();
    console.info("[debug.js] ready", TASKS.length);
  }

  global.DebugLab = {
    init,
    render,
    tasks: TASKS,
    count: TASKS.length,
    stats: () => ({ solved: solvedCount(), total: TASKS.length }),
    reset: () => {
      try { localStorage.removeItem(KEY + user()); } catch (e) {}
      idx = 0; activeCat = 0; checked = false; revealed = false;
      render();
    }
  };
})(window);
