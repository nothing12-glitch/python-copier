/* constructor.js — розділ «Конструктор»: людина сама складає задачу (умова, тести, підказка),
   зберігає її в «Мої задачі» й перевіряє власним тестом. Код задачі можна перетворити на
   «код запрошення» і передати другу — той вклічає його в «Загальний двір».
   Свої задачі: app.constructor.<user> . Вхідні з коду: app.constructor.yard.<user> */
(function (global) {
  const $ = (s) => document.querySelector(s);
  const KEY = "app.constructor.";
  const YARD_KEY = "app.constructor.yard.";
  const CODE_KEY = "app.constructor.code.";
  const POINTS = { 1: 10, 2: 15, 3: 25 };
  const MAX_TESTS = 6;
  const PREFIX = "PC1:";

  /* ---------- Помічники ---------- */
  function user() { return (global.Profile && global.Profile.handle()) || "guest"; }
  function t(k, v) { return global.I18n ? global.I18n.t(k, v) : k; }
  function pick(o) { return global.I18n ? global.I18n.localize(o) : (o && o.uk) || ""; }
  function toast(msg) { if (global.App && global.App.toast) global.App.toast(msg); }
  function sfx(name) { global.Audio2 && global.Audio2.SFX && global.Audio2.SFX[name] && global.Audio2.SFX[name](); }

  function el(tag, cls, text) {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text != null) node.textContent = text;
    return node;
  }

  function getState() {
    try {
      const raw = JSON.parse(localStorage.getItem(KEY + user()));
      if (raw && Array.isArray(raw.tasks)) return raw;
    } catch (e) { /* пошкоджений запис — починаємо заново */ }
    return { tasks: [] };
  }
  function saveState(s) { localStorage.setItem(KEY + user(), JSON.stringify(s)); }

  function getYard() {
    try {
      const raw = JSON.parse(localStorage.getItem(YARD_KEY + user()));
      if (raw && Array.isArray(raw.items)) return raw;
    } catch (e) { /* порожній двір — це нормально */ }
    return { items: [] };
  }
  function saveYard(y) { localStorage.setItem(YARD_KEY + user(), JSON.stringify(y)); }

  function readCode(id) { return localStorage.getItem(CODE_KEY + user() + "." + id) || ""; }
  function writeCode(id, code) { localStorage.setItem(CODE_KEY + user() + "." + id, code); }

  /* ---------- Код запрошення ----------
     Задачу стискаємо в JSON, загортаємо в base64 і чіпляємо префікс, щоб людина
     впізнала код із Конструктора, а не випадковий набір літер. */
  function pack(task) {
    let b64 = "";
    try {
      const body = JSON.stringify({
        t: task.title, d: task.text, h: task.hint || "", s: task.starter || "",
        l: task.level, x: task.tests.map((tt) => [tt.in, tt.out]), a: task.author || user()
      });
      b64 = btoa(String.fromCharCode.apply(null, Array.from(new TextEncoder().encode(body))));
    } catch (e) {
      return "";
    }
    return PREFIX + b64.replace(/=+$/, "");
  }

  function unpack(code) {
    const text = String(code || "").trim().replace(/\s+/g, "");
    if (!text) return { error: t("mk.emptyCode") };
    const b64 = text.indexOf(PREFIX) === 0 ? text.slice(PREFIX.length) : text;
    let json = "";
    try {
      const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
      const bytes = Uint8Array.from(atob(padded), (c) => c.charCodeAt(0));
      json = new TextDecoder().decode(bytes);
    } catch (e) {
      return { error: t("mk.badCode") };
    }
    let raw = null;
    try { raw = JSON.parse(json); } catch (e) { return { error: t("mk.badCode") }; }
    if (!raw || !raw.t || !raw.d || !Array.isArray(raw.x)) return { error: t("mk.badCode") };
    const task = {
      id: "y" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      title: String(raw.t).slice(0, 90),
      text: String(raw.d).slice(0, 1200),
      hint: String(raw.h || "").slice(0, 600),
      starter: String(raw.s || "").slice(0, 2000),
      level: POINTS[raw.l] ? raw.l : 1,
      tests: raw.x.slice(0, MAX_TESTS).map((pair) => ({
        in: String(!pair || pair[0] == null ? "" : pair[0]).slice(0, 800),
        out: String(!pair || pair[1] == null ? "" : pair[1]).slice(0, 800)
      })),
      author: String(raw.a || "guest").slice(0, 40),
      created: Date.now()
    };
    if (!task.tests.length) return { error: t("mk.needTest") };
    return { task: task };
  }

  /* ---------- Шаблоони: з чого почати ---------- */
  const TEMPLATES = [
    {
      id: "sum",
      title: { uk: "Сума двох чисел", en: "Sum of two numbers", tr: "İki sayının toplamı" },
      text: {
        uk: "Два цілих числа, кожне в окремому рядку. Виведи їхню суму.",
        en: "Two integers, one per line. Print their sum.",
        tr: "Satır satır iki tam sayı. Toplamlarını yazdır."
      },
      hint: {
        uk: "Прочитай обидва числа через int(input()) і надрукуй a + b.",
        en: "Read both numbers with int(input()) and print a + b.",
        tr: "İki sayıyı int(input()) ile oku ve a + b yazdır."
      },
      starter: "a = int(input())\nb = int(input())\n",
      tests: [{ in: "3\n5\n", out: "8" }, { in: "-2\n9\n", out: "7" }]
    },
    {
      id: "even",
      title: { uk: "Парне чи ні", en: "Even or odd", tr: "Çift mi tek mi" },
      text: {
        uk: "Одне ціле число. Виведи 'yes', якщо воно парне, інакше 'no'.",
        en: "One integer. Print 'yes' if it is even, otherwise 'no'.",
        tr: "Bir tam sayı. Çiftse 'yes', değilse 'no' yazdır."
      },
      hint: {
        uk: "Перевір остачу: if n % 2 == 0.",
        en: "Check the remainder: if n % 2 == 0.",
        tr: "Kalanına bak: if n % 2 == 0."
      },
      starter: "n = int(input())\n",
      tests: [{ in: "4\n", out: "yes" }, { in: "7\n", out: "no" }, { in: "0\n", out: "yes" }]
    },
    {
      id: "rev",
      title: { uk: "Слово навпаки", en: "Word backwards", tr: "Tersine kelime" },
      text: {
        uk: "Одне слово без пробілів. Виведи його, прочитане праворуч ліворуч.",
        en: "A single word without spaces. Print it read from right to left.",
        tr: "Boşluksuz tek kelime. Sağdan sola okunmuş hâlini yazdır."
      },
      hint: {
        uk: "Зріз кроком назад: s[::-1].",
        en: "Slice with a negative step: s[::-1].",
        tr: "Ters adımlı dilimle: s[::-1]."
      },
      starter: "s = input()\n",
      tests: [{ in: "python\n", out: "nohtyp" }, { in: "кіт\n", out: "тік" }]
    },
    {
      id: "max",
      title: { uk: "Найбільше з трьох", en: "Biggest of three", tr: "Üçünün en büyüğü" },
      text: {
        uk: "Три цілих числа в окремих рядках. Виведи найбільше з них.",
        en: "Three integers on separate lines. Print the largest one.",
        tr: "Ayrı satırlarda üç tam sayı. En büyüğünü yazdır."
      },
      hint: {
        uk: "Власні if не потрібні: достатньо print(max(a, b, c)).",
        en: "You do not need your own ifs: print(max(a, b, c)) is enough.",
        tr: "Kendi if'lerine gerek yok: print(max(a, b, c)) yeter."
      },
      starter: "a = int(input())\nb = int(input())\nc = int(input())\n",
      tests: [{ in: "1\n9\n4\n", out: "9" }, { in: "-5\n-2\n-8\n", out: "-2" }]
    }
  ];

  /* ---------- DOM ---------- */
  let ready = false;
  let listEl, stageEl, introEl, ownEl, yardEl, emptyEl;
  let formEl, formTitle, formText, formHint, formStarter, formTests, formLevel;
  let saveBtn, testBtn, previewOut, previewStatus, formStatus, shareOut, copyBtn, shareRow;
  let importBox, importBtn, importStatus;
  let stageTitle, stageText, stageMeta, stageHintBtn, stageHintBox, codeEl;
  let editBtn, delBtn, newBtn, backBtn, tplBox;
  let editingId = null;
  let draftTests = [];
  let viewKind = null, viewIdx = null, viewTask = null;
  let busy = false;

  /* ---------- Список ---------- */
  function card(kind, item, idx) {
    const row = el("button", "mk-item" + (item.solvedAt ? " done" : "") + (kind === "yard" ? " foreign" : ""));
    row.type = "button";
    const ic = el("span", "material-icons", kind === "yard" ? "hub" : "build");
    const box = el("div", "mk-itemtext");
    box.appendChild(el("span", "mk-itemtitle", item.title));
    const bits = [t("tasks.level" + (POINTS[item.level] ? item.level : 1)), t("mk.testsN", { n: item.tests.length })];
    if (kind === "yard") bits.push(t("mk.by", { who: item.author || "guest" }));
    box.appendChild(el("span", "mk-itemmeta", bits.join(" · ")));
    row.append(ic, box);
    if (item.solvedAt) row.appendChild(el("span", "material-icons mk-tick", "check_circle"));
    row.onclick = () => { openStage(kind, idx); sfx("click"); };
    return row;
  }

  function renderList() {
    if (!listEl) return;
    const own = ownTasks();
    const yard = yardTasks();
    listEl.innerHTML = "";
    if (own.length) {
      listEl.appendChild(el("h3", "mk-group", t("mk.mine")));
      own.forEach((item, i) => listEl.appendChild(card("own", item, i)));
    }
    if (yard.length) {
      listEl.appendChild(el("h3", "mk-group", t("mk.yard")));
      yard.forEach((item, i) => listEl.appendChild(card("yard", item, i)));
    }
    if (emptyEl) emptyEl.hidden = own.length + yard.length > 0;
    if (ownEl) ownEl.textContent = String(own.length);
    if (yardEl) yardEl.textContent = String(yard.length);
  }

  /* ---------- Форма створення ---------- */
  function blankDraft() {
    return { title: "", text: "", hint: "", starter: "", level: 1, tests: [{ in: "", out: "" }] };
  }

  function renderTests() {
    if (!formTests) return;
    formTests.innerHTML = "";
    draftTests.forEach((tt, i) => {
      const row = el("div", "mk-testrow");
      row.appendChild(el("span", "mk-testno", t("mk.testHead", { n: i + 1 })));
      const gi = el("textarea", "mk-testin");
      gi.rows = 2;
      gi.value = tt.in;
      gi.placeholder = t("mk.inputPlaceholder");
      gi.oninput = () => { draftTests[i].in = gi.value; };
      const go = el("textarea", "mk-testout");
      go.rows = 2;
      go.value = tt.out;
      go.placeholder = t("mk.outputPlaceholder");
      go.oninput = () => { draftTests[i].out = go.value; };
      const rm = el("button", "mk-testdel");
      rm.type = "button";
      rm.title = t("mk.removeTest");
      rm.appendChild(el("span", "material-icons", "close"));
      rm.onclick = () => {
        draftTests.splice(i, 1);
        if (!draftTests.length) draftTests.push({ in: "", out: "" });
        renderTests();
        sfx("click");
      };
      row.append(gi, go, rm);
      formTests.appendChild(row);
    });
    if (draftTests.length < MAX_TESTS) {
      const add = el("button", "mk-testadd");
      add.type = "button";
      add.appendChild(el("span", "material-icons", "add"));
      add.appendChild(el("span", null, t("mk.addTest")));
      add.onclick = () => { draftTests.push({ in: "", out: "" }); renderTests(); sfx("click"); };
      formTests.appendChild(add);
    }
  }

  function openForm(template) {
    const tpl = template || blankDraft();
    formTitle.value = tpl.title || "";
    formText.value = tpl.text || "";
    formHint.value = tpl.hint || "";
    formStarter.value = tpl.starter || "";
    formLevel.value = String(POINTS[tpl.level] ? tpl.level : 1);
    draftTests = (tpl.tests && tpl.tests.length ? tpl.tests : [{ in: "", out: "" }])
      .map((x) => ({ in: x.in || "", out: x.out || "" }));
    renderTests();
    shareOut.value = "";
    previewOut.textContent = "";
    previewOut.hidden = true;
    setStatus("", null, previewStatus);
    setStatus("", null, formStatus);
    formEl.hidden = false;
    stageEl.hidden = true;
    formTitle.focus();
  }

  function collect() {
    const tests = draftTests
      .map((x) => ({ in: x.in, out: String(x.out || "").replace(/\s+$/, "") }))
      .filter((x) => x.in !== "" || x.out !== "");
    return {
      id: "o" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      title: formTitle.value.trim().slice(0, 90),
      text: formText.value.trim().slice(0, 1200),
      hint: formHint.value.trim().slice(0, 600),
      starter: formStarter.value.slice(0, 2000),
      level: Number(formLevel.value) || 1,
      tests: tests,
      author: user(),
      created: Date.now()
    };
  }

  function validate(task) {
    if (!task.title) return t("mk.needTitle");
    if (!task.text) return t("mk.needText");
    if (!task.tests.length) return t("mk.needTest");
    return null;
  }

  function setStatus(msg, cls, box) {
    const node = box || previewStatus;
    if (!node) return;
    node.textContent = msg || "";
    node.className = "mk-status" + (cls ? " " + cls : "");
  }

  function save() {
    const task = collect();
    const bad = validate(task);
    if (bad) { setStatus(bad, "bad", formStatus); sfx("error"); return; }
    const s = getState();
    const prev = editingId === null ? null : s.tasks[editingId];
    if (prev) {
      task.id = prev.id;
      task.created = prev.created;
      task.solvedAt = prev.solvedAt;
      s.tasks[editingId] = task;
    } else {
      s.tasks.unshift(task);
    }
    saveState(s);
    formEl.hidden = true;
    editingId = null;
    renderList();
    announce();
    toast(t("mk.savedToast", { title: task.title, p: POINTS[task.level] }));
    sfx("success");
  }

  function useTemplate(i) {
    const tpl = TEMPLATES[i];
    if (!tpl) return;
    editingId = null;
    openForm({
      title: pick(tpl.title), text: pick(tpl.text), hint: pick(tpl.hint),
      starter: tpl.starter, level: tpl.level, tests: tpl.tests
    });
  }

  /* ---------- Сцена перегляду ---------- */
  function ownTasks() { return getState().tasks; }
  function yardTasks() { return getYard().items; }
  function itemsOf(kind) { return kind === "yard" ? yardTasks() : ownTasks(); }
  function codeId(kind, item, idx) { return kind + "." + (item.id || idx); }

  function currentTask() { return viewTask; }

  function openStage(kind, idx) {
    const item = itemsOf(kind)[idx];
    if (!item) return;
    viewKind = kind; viewIdx = idx; viewTask = item;
    formEl.hidden = true;
    stageEl.hidden = false;
    stageTitle.textContent = item.title;
    stageText.textContent = item.text;
    stageMeta.textContent = t("tasks.level" + (POINTS[item.level] ? item.level : 1)) + " · " +
      t("mk.testsN", { n: item.tests.length }) +
      (kind === "yard" ? " · " + t("mk.by", { who: item.author || "guest" }) : "");
    stageHintBtn.hidden = !item.hint;
    stageHintBox.hidden = true;
    stageHintBox.textContent = item.hint || "";
    previewOut.textContent = "";
    previewOut.hidden = true;
    setStatus("");
    codeEl.value = readCode(codeId(kind, item, idx)) || item.starter || "";
    copyBtn.hidden = kind !== "own";
    editBtn.hidden = kind !== "own";
    delBtn.hidden = kind !== "own";
    shareOut.value = kind === "own" ? pack(item) : "";
    shareRow.hidden = kind !== "own";
  }

  function closeStage() {
    stageEl.hidden = true;
    viewTask = null;
    renderList();
  }

  /* Розв'язок рахуємо один раз на задачу: позначка «вирішено» залишається в пам'яті. */
  function markSolved(kind, idx) {
    const store = kind === "yard" ? getYard() : getState();
    const list = kind === "yard" ? store.items : store.tasks;
    const item = list[idx];
    if (!item || item.solvedAt) return false;
    item.solvedAt = Date.now();
    if (kind === "yard") saveYard(store); else saveState(store);
    if (viewTask) viewTask.solvedAt = item.solvedAt;
    return true;
  }

  async function runCurrent() {
    const item = currentTask();
    if (busy || !item || !codeEl) return;
    const code = codeEl.value;
    if (!code.trim()) { toast(t("tasks.emptyCode")); sfx("error"); return; }
    if (!global.PythonPad || typeof global.PythonPad.execute !== "function") {
      setStatus(t("tasks.unavailable"), "error");
      return;
    }
    busy = true;
    testBtn.disabled = true;
    const kind = viewKind, idx = viewIdx;
    writeCode(codeId(kind, item, idx), code);
    setStatus(t("tasks.checking"), "loading");
    try {
      const res = await runTests(code, item);
      previewOut.textContent = res.text;
      previewOut.hidden = !res.text;
      if (res.crash) {
        setStatus(global.UI && global.UI.errStatus
          ? global.UI.errStatus(t("tasks.runtimeError"), res.crash.err && res.crash.err.type)
          : t("tasks.runtimeError"), "error");
        sfx("error");
      } else if (res.allOk) {
        setStatus(t("mk.allPassed", { n: item.tests.length }), "good");
        if (markSolved(kind, idx)) {
          toast(t("mk.solvedToast", { title: item.title, p: POINTS[item.level] }));
          document.dispatchEvent(new CustomEvent("makertaskdone", {
            detail: { id: item.id, level: item.level, kind: kind, points: POINTS[item.level] }
          }));
        }
        sfx("success");
      } else {
        setStatus(t("mk.someFailed", { ok: res.okCount, total: item.tests.length }), "bad");
        sfx("error");
      }
      renderList();
      announce();
    } finally {
      busy = false;
      testBtn.disabled = false;
    }
  }

  async function runTests(code, task) {
    let text = "";
    let okCount = 0;
    let crash = null;
    for (let i = 0; i < task.tests.length; i++) {
      const tt = task.tests[i];
      const r = await global.PythonPad.execute(code, tt.in);
      text += t("mk.testHead", { n: i + 1 }) + "\n";
      if (r.error) {
        text += (r.output || "") + "\n" + r.error + "\n\n";
        crash = r;
        break;
      }
      const got = String(r.output || "").replace(/\s+$/, "");
      const want = String(tt.out || "").replace(/\s+$/, "");
      const ok = got === want;
      if (ok) okCount++;
      text += (ok ? "= " : "! ") + got + "\n";
      if (!ok) text += "? " + want + "\n";
      text += "\n";
    }
    return {
      text: text.replace(/\s+$/, ""),
      okCount: okCount,
      allOk: !crash && okCount === task.tests.length,
      crash: crash
    };
  }

  /* ---------- Імпорт за кодом ---------- */
  function doImport() {
    const res = unpack(importBox.value);
    if (res.error) {
      importStatus.textContent = res.error;
      importStatus.className = "mk-status bad";
      sfx("error");
      return;
    }
    const y = getYard();
    const dup = y.items.some((x) => x.title === res.task.title && x.text === res.task.text);
    if (dup) {
      importStatus.textContent = t("mk.dupCode");
      importStatus.className = "mk-status bad";
      return;
    }
    y.items.unshift(res.task);
    saveYard(y);
    importBox.value = "";
    importStatus.textContent = t("mk.imported", { title: res.task.title });
    importStatus.className = "mk-status good";
    renderList();
    announce();
    toast(t("mk.importedToast", { title: res.task.title }));
    sfx("success");
  }

  function copyShare() {
    if (!viewTask || viewKind !== "own") return;
    const code = pack(viewTask);
    if (!code) { toast(t("mk.codeFailed")); sfx("error"); return; }
    shareOut.value = code;
    shareRow.hidden = false;
    if (!navigator.clipboard || !navigator.clipboard.writeText) {
      shareOut.select();
      toast(t("mk.selectHint"));
      return;
    }
    navigator.clipboard.writeText(code).then(() => {
      toast(t("mk.copied"));
      sfx("success");
    }, () => {
      shareOut.select();
      toast(t("mk.selectHint"));
    });
  }

  function removeCurrent() {
    if (viewKind !== "own" || viewIdx === null) return;
    const s = getState();
    const gone = s.tasks.splice(viewIdx, 1)[0];
    saveState(s);
    stageEl.hidden = true;
    viewTask = null;
    renderList();
    announce();
    if (gone) toast(t("mk.removed", { title: gone.title }));
    sfx("click");
  }

  function editCurrent() {
    const item = currentTask();
    if (!item || viewKind !== "own") return;
    editingId = viewIdx;
    openForm(item);
  }

  function announce() {
    document.dispatchEvent(new CustomEvent("makerchange", {
      detail: { own: ownTasks().length, yard: yardTasks().length }
    }));
  }

  function stats() {
    const own = ownTasks();
    const yard = yardTasks();
    const all = own.concat(yard);
    return {
      own: own.length,
      yard: yard.length,
      solved: all.filter((x) => x.solvedAt).length,
      published: own.filter((x) => x.solvedAt).length,
      points: all.reduce((sum, x) => sum + (x.solvedAt ? (POINTS[x.level] || 0) : 0), 0)
    };
  }

  /* ---------- Кнопки-шаблоони: підписи мусять оновлюватись разом із мовою ---------- */
  function buildTemplates() {
    if (!tplBox) return;
    tplBox.innerHTML = "";
    TEMPLATES.forEach((tpl, i) => {
      const b = el("button", "mk-tpl");
      b.type = "button";
      b.dataset.tpl = String(i);
      b.appendChild(el("span", "material-icons", "description"));
      b.appendChild(el("span", null, pick(tpl.title)));
      tplBox.appendChild(b);
    });
  }

  /* ---------- Події ---------- */
  function bind() {
    newBtn.onclick = () => { editingId = null; openForm(null); sfx("click"); };
    $("#mkFormCancel").onclick = () => { formEl.hidden = true; editingId = null; sfx("click"); };
    saveBtn.onclick = () => save();
    tplBox.onclick = (e) => {
      const b = e.target.closest ? e.target.closest("[data-tpl]") : null;
      if (b) useTemplate(Number(b.dataset.tpl));
    };
    backBtn.onclick = () => { closeStage(); sfx("click"); };
    testBtn.onclick = () => { sfx("click"); runCurrent(); };
    copyBtn.onclick = () => copyShare();
    delBtn.onclick = () => removeCurrent();
    editBtn.onclick = () => editCurrent();
    importBtn.onclick = () => doImport();
    stageHintBtn.onclick = () => { stageHintBox.hidden = false; sfx("click"); };
    codeEl.addEventListener("input", () => {
      if (viewTask) writeCode(codeId(viewKind, viewTask, viewIdx), codeEl.value);
    });
    document.addEventListener("langchange", () => { if (ready) render(); });
  }

  /* ---------- Рендер ---------- */
  function render() {
    if (!ready) { init(); return; }
    const s = stats();
    if (introEl) introEl.textContent = t("mk.intro", { own: s.own, yard: s.yard, tests: MAX_TESTS });
    buildTemplates();
    renderList();
    console.info("[constructor.js] render", s.own + "+" + s.yard);
  }

  function init() {
    if (ready) { render(); return; }
    listEl = $("#mkList");
    stageEl = $("#mkStage");
    introEl = $("#mkIntro");
    ownEl = $("#mkOwnCount");
    yardEl = $("#mkYardCount");
    emptyEl = $("#mkEmpty");
    formEl = $("#mkForm");
    formTitle = $("#mkTitle");
    formText = $("#mkText");
    formHint = $("#mkHintInput");
    formStarter = $("#mkStarter");
    formTests = $("#mkTests");
    formLevel = $("#mkLevel");
    saveBtn = $("#mkFormSave");
    testBtn = $("#mkTest");
    previewOut = $("#mkPreviewOut");
    previewStatus = $("#mkPreviewStatus");
    formStatus = $("#mkFormStatus");
    shareOut = $("#mkShareCode");
    copyBtn = $("#mkCopy");
    shareRow = $("#mkShareRow");
    importBox = $("#mkImportBox");
    importBtn = $("#mkImport");
    importStatus = $("#mkImportStatus");
    stageTitle = $("#mkStageTitle");
    stageText = $("#mkStageText");
    stageMeta = $("#mkStageMeta");
    stageHintBtn = $("#mkStageHint");
    stageHintBox = $("#mkStageHintBox");
    codeEl = $("#mkCode");
    editBtn = $("#mkEdit");
    delBtn = $("#mkDel");
    newBtn = $("#mkNew");
    backBtn = $("#mkBack");
    tplBox = $("#mkTemplates");
    if (!listEl || !formEl || !stageEl || !codeEl || !tplBox) return;
    ready = true;
    stageEl.classList.add("hidden");
    formEl.classList.add("hidden");
    emptyEl.hidden = true;
    previewOut.hidden = true;
    shareRow.hidden = true;
    bind();
    render();
  }

  global.Constructor = { init, render, stats, pack, unpack, TEMPLATES };
})(window);
