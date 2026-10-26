/* contest.js — олімпіадний тренажер: тур на час із випадковими задачами, живим таймером і підрахунком балів.
   Результати зберігаються локально для кожного користувача: app.contest.<user> */
(function (global) {
  const $ = (s) => document.querySelector(s);

  const KEY_PREFIX = "app.contest.";
  const DURATIONS = [10, 20, 30];
  const COUNTS = [4, 6, 8];
  const HISTORY_LIMIT = 8;

  let bannerEl, setupEl, runEl, resultEl, listEl, detailEl;
  let durationsEl, countsEl, statsEl, historyEl, startBtn, openBtn;
  let timerEl, timerBarEl, scoreEl, dotsEl, positionEl;
  let titleEl, textEl, metaEl, exampleEl, codeEl, statusEl;
  let checkBtn, prevBtn, nextBtn, finishBtn, exitBtn;
  let resultScoreEl, resultMetaEl, resultListEl, resultBadgeEl, againBtn, toListBtn;

  let state = null;
  let mode = "list";
  let timer = null;
  let busy = false;
  let duration = 20;
  let count = 6;

  function t(k, v) { return global.I18n ? global.I18n.t(k, v) : k; }

  function pick(obj) { return global.Tasks ? global.Tasks.localize(obj) : (obj && obj.uk) || ""; }

  function toast(msg) { if (global.App && global.App.toast) global.App.toast(msg); }

  function sfx(name) { global.Audio2 && global.Audio2.SFX && global.Audio2.SFX[name] && global.Audio2.SFX[name](); }

  function el(tag, cls, text) {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text != null) node.textContent = text;
    return node;
  }

  function user() { return (global.Profile && global.Profile.handle()) || "guest"; }

  function clock(sec) {
    const s = Math.max(0, Math.round(sec));
    return String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0");
  }

  /* ---------- Статистика тренажера ---------- */
  function getStats() {
    const fallback = { best: 0, bestPercent: 0, bestDate: "", runs: 0, history: [] };
    try {
      const raw = JSON.parse(localStorage.getItem(KEY_PREFIX + user()));
      return raw ? Object.assign(fallback, raw) : fallback;
    } catch { return fallback; }
  }

  function saveStats(s) { localStorage.setItem(KEY_PREFIX + user(), JSON.stringify(s)); }

  /* ---------- Підбір задач ---------- */
  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
    }
    return arr;
  }

  // Тур мішає рівні: приблизно третина легких, третина середніх, решта складних
  function pickTasks(n) {
    const byLevel = { 1: [], 2: [], 3: [] };
    (global.Tasks ? global.Tasks.list() : []).forEach((task) => {
      if (byLevel[task.level]) byLevel[task.level].push(task);
    });
    [1, 2, 3].forEach((lv) => shuffle(byLevel[lv]));

    const q1 = Math.round(n * 0.34);
    const q2 = Math.round(n * 0.33);
    const quota = { 1: q1, 2: q2, 3: n - q1 - q2 };
    const picked = [];
    [1, 2, 3].forEach((lv) => {
      for (let i = 0; i < quota[lv] && byLevel[lv].length; i++) picked.push(byLevel[lv].pop());
    });
    const rest = byLevel[1].concat(byLevel[2], byLevel[3]);
    while (picked.length < n && rest.length) picked.push(rest.shift());
    return shuffle(picked);
  }

  /* ---------- Екран налаштування ---------- */
  function renderChips(host, values, currentVal, labelFn, onPick) {
    host.innerHTML = "";
    values.forEach((val) => {
      const chip = el("button", "contest-chip" + (val === currentVal ? " active" : ""), labelFn(val));
      chip.type = "button";
      chip.dataset.value = String(val);
      chip.setAttribute("aria-pressed", val === currentVal ? "true" : "false");
      chip.onclick = () => { onPick(val); renderSetup(); sfx("pop"); };
      host.appendChild(chip);
    });
  }

  function renderSetup() {
    if (!setupEl) return;
    const bank = global.Tasks ? global.Tasks.count : 0;
    renderChips(durationsEl, DURATIONS, duration, (m) => t("contest.minutes", { n: m }), (m) => { duration = m; });
    renderChips(countsEl, COUNTS.filter((c) => c <= bank), count, (c) => String(c), (c) => { count = c; });

    const stats = getStats();
    statsEl.innerHTML = "";
    [
      { value: String(stats.runs || 0), label: t("contest.statRuns") },
      { value: stats.best ? String(stats.best) : "—", label: t("contest.statBest") },
      { value: bank + " / " + (global.Tasks ? global.Tasks.maxPoints : 0), label: t("contest.statBank") }
    ].forEach((item) => {
      const box = el("div", "contest-stat");
      box.appendChild(el("div", "contest-stat-value", item.value));
      box.appendChild(el("div", "contest-stat-label", item.label));
      statsEl.appendChild(box);
    });

    historyEl.innerHTML = "";
    const history = stats.history || [];
    if (history.length) {
      historyEl.appendChild(el("div", "contest-history-title", t("contest.historyTitle")));
      history.slice(0, HISTORY_LIMIT).forEach((run) => {
        const row = el("div", "contest-history-row");
        row.appendChild(el("span", "contest-history-date", run.date || ""));
        row.appendChild(el("span", "contest-history-detail", t("contest.historyItem", { solved: run.solved, total: run.total, minutes: run.minutes })));
        row.appendChild(el("span", "contest-history-score", run.score + " / " + run.max));
        historyEl.appendChild(row);
      });
    }
  }

  /* ---------- Старт туру ---------- */
  function start() {
    if (!global.Tasks || !global.PythonPad || typeof global.PythonPad.execute !== "function") {
      toast(t("tasks.unavailable"));
      sfx("error");
      return;
    }
    const tasks = pickTasks(Math.min(count, global.Tasks.count));
    if (!tasks.length) return;
    state = {
      minutes: duration,
      startedAt: Date.now(),
      endsAt: Date.now() + duration * 60000,
      total: duration * 60,
      index: 0,
      score: 0,
      entries: tasks.map((task) => ({ task: task, code: task.starter, solved: false, attempts: 0, ms: 0 }))
    };
    state.max = state.entries.reduce((sum, e) => sum + global.Tasks.points(e.task), 0);
    state.index = 0;
    setMode("run");
    renderTask();
    startTimer();
    sfx("coin");
  }

  function startTimer() {
    stopTimer();
    renderTimer(Math.max(0, Math.round((state.endsAt - Date.now()) / 1000)));
    timer = setInterval(() => {
      if (!state) { stopTimer(); return; }
      const left = Math.max(0, Math.round((state.endsAt - Date.now()) / 1000));
      renderTimer(left);
      if (left <= 0) finish("time");
    }, 1000);
  }

  function stopTimer() {
    if (timer) { clearInterval(timer); timer = null; }
  }

  function renderTimer(left) {
    if (!timerEl) return;
    timerEl.textContent = clock(left);
    timerEl.classList.toggle("urgent", left <= 60);
    const pct = state && state.total ? Math.max(0, Math.min(100, (left / state.total) * 100)) : 0;
    if (timerBarEl) timerBarEl.style.width = pct + "%";
  }

  /* ---------- Екран туру ---------- */
  function renderScore() {
    if (!scoreEl || !state) return;
    scoreEl.innerHTML = "";
    scoreEl.appendChild(el("span", "material-icons contest-score-ico", "stars"));
    scoreEl.appendChild(el("span", null, t("contest.score", { n: state.score, max: state.max })));
  }

  function renderDots() {
    if (!dotsEl || !state) return;
    dotsEl.innerHTML = "";
    state.entries.forEach((entry, i) => {
      const dot = el("button", "contest-dot");
      dot.type = "button";
      if (entry.solved) dot.classList.add("solved");
      if (i === state.index) dot.classList.add("current");
      if (entry.solved) dot.appendChild(el("span", "material-icons", "check"));
      else dot.appendChild(document.createTextNode(String(i + 1)));
      const label = t("contest.gotoTask", { n: i + 1, title: pick(entry.task.title) });
      dot.title = label;
      dot.setAttribute("aria-label", label);
      dot.onclick = () => { goto(i); sfx("click"); };
      dotsEl.appendChild(dot);
    });
  }

  function goto(i) {
    if (!state) return;
    saveCurrentCode();
    state.index = Math.max(0, Math.min(i, state.entries.length - 1));
    renderTask();
    if (codeEl) codeEl.focus();
  }

  function saveCurrentCode() {
    if (!state || !codeEl) return;
    const entry = state.entries[state.index];
    if (entry) entry.code = codeEl.value;
  }

  function renderTask() {
    if (!state) return;
    const entry = state.entries[state.index];
    titleEl.textContent = pick(entry.task.title);
    textEl.textContent = pick(entry.task.text);
    codeEl.value = entry.code;
    setStatus("");
    positionEl.textContent = t("contest.position", { n: state.index + 1, total: state.entries.length });
    prevBtn.disabled = state.index === 0;
    nextBtn.disabled = state.index === state.entries.length - 1;
    renderMeta();
    renderExample(entry.task);
    renderDots();
    renderScore();
  }

  function renderMeta() {
    if (!state || !metaEl) return;
    const entry = state.entries[state.index];
    metaEl.innerHTML = "";
    metaEl.appendChild(el("span", "task-level-badge", t(global.Tasks.LEVEL_KEYS[entry.task.level])));
    metaEl.appendChild(el("span", "task-card-points", t("tasks.points", { p: global.Tasks.points(entry.task) })));
    if (entry.solved) {
      const done = el("span", "task-solved-badge");
      done.appendChild(el("span", "material-icons", "task_alt"));
      done.appendChild(el("span", null, t("tasks.solvedBadge")));
      metaEl.appendChild(done);
    }
  }

  function renderExample(task) {
    exampleEl.innerHTML = "";
    const first = task.tests[0];
    if (!first) return;
    const wrap = el("div", "task-example-inner");
    const colIn = el("div", "task-example-col");
    colIn.appendChild(el("span", "task-example-label", t("tasks.inputData")));
    colIn.appendChild(el("pre", "task-example-pre", first.in.replace(/\n+$/g, "")));
    const colOut = el("div", "task-example-col");
    colOut.appendChild(el("span", "task-example-label", t("tasks.outputData")));
    colOut.appendChild(el("pre", "task-example-pre", first.out));
    wrap.appendChild(colIn);
    wrap.appendChild(colOut);
    exampleEl.appendChild(el("div", "task-example-title", t("tasks.example")));
    exampleEl.appendChild(wrap);
  }

  function setStatus(msg, cls) {
    if (!statusEl) return;
    statusEl.textContent = msg || "";
    statusEl.className = "task-status-line" + (cls ? " " + cls : "");
  }

  function nextUnsolved() {
    if (!state) return -1;
    for (let i = state.index + 1; i < state.entries.length; i++) if (!state.entries[i].solved) return i;
    for (let i = 0; i < state.index; i++) if (!state.entries[i].solved) return i;
    return -1;
  }

  /* ---------- Перевірка ---------- */
  async function check() {
    if (busy || !state) return;
    saveCurrentCode();
    const entry = state.entries[state.index];
    const code = entry.code;
    if (!code.trim()) { toast(t("tasks.emptyCode")); sfx("error"); return; }

    busy = true;
    checkBtn.disabled = true;
    setStatus(t("tasks.checking"), "loading");
    sfx("click");

    let verdict;
    try {
      verdict = await global.Tasks.judge(code, entry.task);
    } catch (e) {
      verdict = { passed: false, results: [], error: (e && e.message) || String(e), line: null, okCount: 0, ms: 0 };
    }
    busy = false;
    if (!state) return;
    checkBtn.disabled = false;

    entry.attempts++;
    entry.ms = verdict.ms;
    const pts = global.Tasks.points(entry.task);

    if (verdict.passed) {
      if (!entry.solved) { entry.solved = true; state.score += pts; }
      setStatus(t("contest.correct", { p: pts }), "ok");
      sfx("success");
      renderMeta();
      renderDots();
      renderScore();
      const next = nextUnsolved();
      if (next >= 0) setTimeout(() => { if (state) goto(next); }, 650);
      else setTimeout(() => { if (state) finish("solved"); }, 900);
    } else if (verdict.error) {
      setStatus(t("contest.runtimeError"), "error");
      sfx("error");
    } else {
      setStatus(t("contest.wrong", { n: verdict.okCount, total: entry.task.tests.length }), "bad");
      sfx("error");
    }
  }

  /* ---------- Завершення ---------- */
  function finish(reason) {
    if (!state) return;
    saveCurrentCode();
    stopTimer();
    const usedSec = Math.max(0, Math.round((Date.now() - state.startedAt) / 1000));
    const entries = state.entries;
    const solved = entries.filter((e) => e.solved).length;
    const total = entries.length;
    const score = entries.reduce((sum, e) => sum + (e.solved ? global.Tasks.points(e.task) : 0), 0);
    const max = entries.reduce((sum, e) => sum + global.Tasks.points(e.task), 0);
    const percent = max ? Math.round((score / max) * 100) : 0;
    const minutes = state.minutes;

    const stats = getStats();
    const newRecord = score > (stats.best || 0);
    stats.runs = (stats.runs || 0) + 1;
    const date = new Date().toISOString().slice(0, 10);
    if (newRecord) { stats.best = score; stats.bestPercent = percent; stats.bestDate = date; }
    stats.history = [{ date: date, score: score, max: max, solved: solved, total: total, minutes: minutes, percent: percent }]
      .concat(stats.history || []).slice(0, HISTORY_LIMIT);
    saveStats(stats);

    state = null;
    renderResult({ score, max, solved, total, percent, usedSec, newRecord, reason, entries });

    document.dispatchEvent(new CustomEvent("contestdone", {
      detail: { score, max, percent, solved, total, minutes, newRecord, runs: stats.runs, perfect: percent === 100 && total > 0 }
    }));

    if (reason === "time") { toast(t("contest.timeUp")); sfx("lose"); }
    else if (percent === 100) { toast(t("contest.perfectToast")); sfx("win"); }
    else { toast(t("contest.doneToast", { n: score, max: max })); sfx("coin"); }
  }

  function renderResult(res) {
    setMode("result");
    resultScoreEl.innerHTML = "";
    resultScoreEl.appendChild(el("div", "contest-result-score", res.score + " / " + res.max));
    resultScoreEl.appendChild(el("div", "contest-result-percent", t("contest.percent", { n: res.percent })));
    resultBadgeEl.classList.toggle("hidden", !res.newRecord);

    resultMetaEl.innerHTML = "";
    [
      t("contest.resultSolved", { n: res.solved, total: res.total }),
      t("contest.resultTime", { time: clock(res.usedSec) }),
      res.reason === "time" ? t("contest.resultTimeout") : t("contest.resultFinished")
    ].forEach((line) => resultMetaEl.appendChild(el("div", "contest-result-line", line)));

    resultListEl.innerHTML = "";
    res.entries.forEach((entry, i) => {
      const row = el("div", "contest-result-row " + (entry.solved ? "pass" : "fail"));
      row.appendChild(el("span", "material-icons contest-result-ico", entry.solved ? "check_circle" : "cancel"));
      const body = el("div", "contest-result-body");
      body.appendChild(el("div", "contest-result-title", (i + 1) + ". " + pick(entry.task.title)));
      body.appendChild(el("div", "contest-result-sub",
        t(global.Tasks.LEVEL_KEYS[entry.task.level]) + " · " +
        (entry.solved ? t("tasks.points", { p: global.Tasks.points(entry.task) }) : t("contest.noPoints")) +
        (entry.attempts ? " · " + t("tasks.attempts", { n: entry.attempts }) : "")));
      row.appendChild(body);
      resultListEl.appendChild(row);
    });
  }

  function abort() {
    if (!state) return;
    if (!confirm(t("contest.abortConfirm"))) return;
    stopTimer();
    state = null;
    renderSetup();
    setMode("setup");
    toast(t("contest.aborted"));
    sfx("click");
  }

  /* ---------- Перемикання екранів ---------- */
  function setMode(next) {
    mode = next;
    const show = (node, on) => { if (node) node.classList.toggle("hidden", !on); };
    show(bannerEl, next === "list");
    show(setupEl, next === "setup");
    show(runEl, next === "run");
    show(resultEl, next === "result");
    if (next !== "list") {
      show(listEl, false);
      show(detailEl, false);
    }
  }

  function toList() {
    if (state && !confirm(t("contest.abortConfirm"))) return;
    stopTimer();
    state = null;
    renderSetup();
    setMode("list");
    if (global.Tasks) global.Tasks.render();
    sfx("click");
  }

  /* ---------- Ініціалізація ---------- */
  function init() {
    bannerEl = $("#contestBanner");
    setupEl = $("#contestSetup");
    runEl = $("#contestRun");
    resultEl = $("#contestResult");
    listEl = $("#tasksList");
    detailEl = $("#taskDetail");
    if (!setupEl || !runEl || !resultEl) return;

    durationsEl = $("#contestDurations");
    countsEl = $("#contestCounts");
    statsEl = $("#contestStats");
    historyEl = $("#contestHistory");
    startBtn = $("#contestStart");
    openBtn = $("#contestOpen");
    timerEl = $("#contestTimer");
    timerBarEl = $("#contestTimerBar");
    scoreEl = $("#contestScore");
    dotsEl = $("#contestDots");
    positionEl = $("#contestPosition");
    titleEl = $("#contestTaskTitle");
    textEl = $("#contestTaskText");
    metaEl = $("#contestTaskMeta");
    exampleEl = $("#contestExample");
    codeEl = $("#contestCode");
    statusEl = $("#contestStatus");
    checkBtn = $("#contestCheck");
    prevBtn = $("#contestPrev");
    nextBtn = $("#contestNext");
    finishBtn = $("#contestFinish");
    exitBtn = $("#contestExit");
    resultScoreEl = $("#contestResultScore");
    resultMetaEl = $("#contestResultMeta");
    resultListEl = $("#contestResultList");
    resultBadgeEl = $("#contestResultNew");
    againBtn = $("#contestAgain");
    toListBtn = $("#contestToList");

    openBtn.onclick = () => { renderSetup(); setMode("setup"); sfx("pop"); };
    startBtn.onclick = start;
    checkBtn.onclick = check;
    prevBtn.onclick = () => { goto(state.index - 1); sfx("click"); };
    nextBtn.onclick = () => { goto(state.index + 1); sfx("click"); };
    finishBtn.onclick = () => { if (state && confirm(t("contest.finishConfirm"))) finish("manual"); };
    exitBtn.onclick = abort;
    againBtn.onclick = () => { renderSetup(); setMode("setup"); sfx("click"); };
    toListBtn.onclick = toList;
    const setupBack = $("#contestSetupBack");
    if (setupBack) setupBack.onclick = toList;

    codeEl.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); check(); return; }
      if (e.key === "Tab") {
        e.preventDefault();
        const from = codeEl.selectionStart;
        const to = codeEl.selectionEnd;
        const spaces = " ".repeat(Number(global.Settings && global.Settings.get("tabSize")) || 4);
        codeEl.value = codeEl.value.slice(0, from) + spaces + codeEl.value.slice(to);
        codeEl.selectionStart = codeEl.selectionEnd = from + spaces.length;
      }
    });
    codeEl.addEventListener("input", saveCurrentCode);

    document.addEventListener("langchange", () => {
      renderSetup();
      if (state) { renderTask(); }
    });

    renderSetup();
    setMode(mode);
  }

  function render() {
    if (!setupEl) { init(); return; }
    renderSetup();
    if (mode === "list") {
      setMode("list");
      return;
    }
    if (mode === "run" && state) { renderTask(); return; }
    setMode(mode);
  }

  global.Contest = {
    init, render, start,
    active: () => !!state,
    stats: getStats
  };
})(window);
