/* dashboard.js — панель «Твоя статистика»: бали, ранг, графік активності за 14 днів
   і підсумок по всіх розділах. Панель малюється в будь-який контейнер з data-dash.
   Журнал активності: app.activity.<user> */
(function (global) {
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => Array.prototype.slice.call(document.querySelectorAll(s));
  const KEY = "app.activity.";
  const WINDOW_DAYS = 14;
  const FEED_DAYS = 6;

  /* Скільки балів приносить одна подія. Там, де модуль сам знає ціну, беремо з detail.points. */
  const AW = { task: 10, lesson: 8, daily: 20, project: 15, glossary: 2, exam: 30, contest: 12, game: 4 };

  const RANKS = [
    { at: 0, name: { uk: "Новачок", en: "Rookie", tr: "Acemi" } },
    { at: 60, name: { uk: "Учень", en: "Learner", tr: "Öğrenci" } },
    { at: 150, name: { uk: "Практик", en: "Practitioner", tr: "Uygulamacı" } },
    { at: 300, name: { uk: "Кодер", en: "Coder", tr: "Kodlayıcı" } },
    { at: 500, name: { uk: "Інженер", en: "Engineer", tr: "Mühendis" } },
    { at: 760, name: { uk: "Мастер", en: "Master", tr: "Usta" } },
    { at: 1080, name: { uk: "Наставник", en: "Mentor", tr: "Rehber" } },
    { at: 1500, name: { uk: "Легенда Python", en: "Python Legend", tr: "Python Efsanesi" } }
  ];

  const SECTIONS = [
    { id: "tasks", ico: "assignment", route: "tasks", key: "t", name: { uk: "Задачі", en: "Tasks", tr: "Görevler" } },
    { id: "course", ico: "school", route: "course", key: "l", name: { uk: "Курс", en: "Course", tr: "Kurs" } },
    { id: "projects", ico: "rocket_launch", route: "projects", key: "j", name: { uk: "Проєкти", en: "Projects", tr: "Projeler" } },
    { id: "daily", ico: "local_fire_department", route: "daily", key: "d", name: { uk: "Щоденний виклик", en: "Daily challenge", tr: "Günlük meydan okuma" } },
    { id: "glossary", ico: "menu_book", route: "glossary", key: "g", name: { uk: "Словник", en: "Glossary", tr: "Sözlük" } },
    { id: "exam", ico: "workspace_premium", route: "exam", key: "x", name: { uk: "Іспит", en: "Exam", tr: "Sınav" } },
    { id: "games", ico: "sports_esports", route: "games", key: "m", name: { uk: "Ігри", en: "Games", tr: "Oyunlar" } },
    { id: "contest", ico: "timer", route: "tools", key: "c", name: { uk: "Змаг", en: "Contest", tr: "Yarışma" } }
  ];

  const I = () => global.I18n;
  const L = (o) => (I() ? I().localize(o) : (o && (o.uk || o.en)) || "");
  const t = (k, v) => (I() ? I().t(k, v) : k);

  function user() { return (global.Profile && global.Profile.handle()) || "guest"; }

  function readJson(key) {
    try { return JSON.parse(localStorage.getItem(key)) || null; } catch (e) { return null; }
  }

  function dayKey(d) {
    const x = new Date(d);
    return x.getFullYear() + "-" + String(x.getMonth() + 1).padStart(2, "0") + "-" + String(x.getDate()).padStart(2, "0");
  }

  function shiftKey(key, delta) {
    const p = key.split("-");
    const d = new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]) + delta);
    return dayKey(d);
  }

  /* Ключ "РРРР-ММ-ДД" читаємо як локальну дату, інакше UTC-зсув сусіднього дня спотворює підпис. */
  function parseKey(key) {
    const p = key.split("-");
    return new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
  }

  /* ---------- Журнал ---------- */
  function getState() {
    let s = readJson(KEY + user());
    if (!s || typeof s !== "object") s = {};
    if (!s.days || typeof s.days !== "object") s.days = {};
    if (!s.ids || typeof s.ids !== "object") s.ids = {};
    return s;
  }

  function saveState(s) {
    try { localStorage.setItem(KEY + user(), JSON.stringify(s)); } catch (e) { /* сховище переповнене */ }
  }

  function dayOf(s, key) {
    let d = s.days[key];
    if (!d) { d = { p: 0, t: 0, l: 0, d: 0, j: 0, g: 0, x: 0, c: 0, m: 0 }; s.days[key] = d; }
    return d;
  }

  /* Нараховує бали один раз на унікальну подію (унікальність — у ключі uid). */
  function award(kind, uid, points, when) {
    const s = getState();
    if (uid) {
      if (s.ids[uid]) return s;
      s.ids[uid] = 1;
    }
    const key = dayKey(when || new Date());
    const d = dayOf(s, key);
    d.p += points;
    d[kind] = (d[kind] || 0) + 1;
    saveState(s);
    render();
    return s;
  }

  /* ---------- Зворотне заповнення з вже існуючого прогресу ---------- */
  function backfill() {
    const s = getState();
    if (s.bf) return;
    const stamp = {};
    const bump = (kind, uid, when, points) => {
      if (!when || s.ids[uid]) return;
      const key = dayKey(when);
      stamp[key] = stamp[key] || [];
      stamp[key].push([kind, uid, points]);
    };

    const tp = readJson("app.tasks." + user()) || {};
    Object.keys(tp).forEach((id) => {
      if (tp[id] && tp[id].solved && tp[id].solvedAt) bump("t", "t:" + id, tp[id].solvedAt, AW.task);
    });

    const cp = readJson("app.course." + user()) || {};
    Object.keys(cp).forEach((id) => {
      if (cp[id] && cp[id].solved && cp[id].solvedAt) bump("l", "l:" + id, cp[id].solvedAt, AW.lesson);
    });

    const pj = readJson("app.projects." + user()) || {};
    Object.keys(pj.steps || {}).forEach((id) => {
      const step = global.Projects && global.Projects.step ? global.Projects.step(id) : null;
      bump("j", "j:" + id, pj.steps[id], step && global.Projects.POINTS ? global.Projects.POINTS[step.level] : AW.project);
    });

    const gl = readJson("app.glossary." + user()) || {};
    Object.keys(gl.seen || {}).forEach((id) => bump("g", "g:" + id, gl.seen[id], AW.glossary));

    const dl = readJson("app.daily." + user()) || {};
    Object.keys(dl.days || {}).forEach((k) => bump("d", "d:" + k, k, AW.daily));

    const ex = readJson("app.exam." + user()) || {};
    (ex.history || []).forEach((h, i) => { if (h.passed) bump("x", "x:" + h.at, h.at, AW.exam); });

    Object.keys(stamp).forEach((key) => {
      const d = dayOf(s, key);
      stamp[key].forEach((row) => {
        d[row[0]] = (d[row[0]] || 0) + 1;
        d.p += row[2] || 0;
        s.ids[row[1]] = 1;
      });
    });

    s.bf = 1;
    saveState(s);
  }

  /* ---------- Підсумки по розділах ---------- */
  function totals() {
    const T = global.Tasks, C = global.Course, P = global.Projects, D = global.Daily, G = global.Glossary, X = global.Exam;
    const stats = readJson("app.achStats") || {};
    const dj = P && P.stats ? P.stats() : { steps: {} };
    const dl = D && D.stats ? D.stats() : { days: {} };
    const gl = G && G.stats ? G.stats() : { read: 0, total: 0 };
    const ex = X && X.stats ? X.stats() : { attempts: 0, best: 0, passed: 0 };
    let projPoints = 0;
    if (P && P.step) Object.keys(dj.steps || {}).forEach((id) => {
      const st = P.step(id);
      projPoints += st && P.POINTS ? (P.POINTS[st.level] || 0) : 0;
    });
    return {
      tasks: { done: T && T.list ? T.list().filter((x) => T.isSolved(x.id)).length : (stats.tasksSolved || []).length, total: T ? T.count : 0 },
      course: { done: C && C.done ? C.done() : (stats.lessonsDone || 0), total: C ? C.count : 0 },
      projects: { done: Object.keys(dj.steps || {}).length, total: P ? P.count : 0, points: projPoints, max: P ? P.maxPoints : 0 },
      daily: { done: Object.keys(dl.days || {}).length, streak: D && D.streak ? D.streak() : 0, best: dl.best || 0 },
      glossary: { done: gl.read, total: gl.total },
      exam: { attempts: ex.attempts, best: ex.best, passed: ex.passed, size: X ? X.draw : 12 },
      games: { done: (stats.gamesPlayed || []).length, total: 9 },
      contest: { runs: stats.contestsRun || 0, best: stats.contestBest || 0, perfect: stats.contestPerfect || 0 },
      runs: stats.pyRuns || 0
    };
  }

  function rankOf(points) {
    let i = 0;
    for (let k = 0; k < RANKS.length; k++) if (points >= RANKS[k].at) i = k;
    const next = RANKS[i + 1] || null;
    const floorAt = RANKS[i].at;
    const span = next ? next.at - floorAt : 1;
    const into = points - floorAt;
    return {
      level: i + 1,
      max: RANKS.length,
      name: L(RANKS[i].name),
      next: next ? L(next.name) : null,
      nextAt: next ? next.at : points,
      percent: next ? Math.min(100, Math.round((into / span) * 100)) : 100,
      toNext: next ? next.at - points : 0
    };
  }

  function streakOf(days) {
    const set = {};
    days.forEach((d) => { if (d.p > 0) set[d.key] = true; });
    let cur = 0, best = 0, run = 0, prev = null;
    const keys = Object.keys(set).sort();
    keys.forEach((k) => {
      if (prev && shiftKey(prev, 1) === k) run += 1; else run = 1;
      prev = k;
      if (run > best) best = run;
    });
    let probe = set[dayKey(new Date())] ? dayKey(new Date()) : shiftKey(dayKey(new Date()), -1);
    while (set[probe]) { cur += 1; probe = shiftKey(probe, -1); }
    return { current: cur, best: best };
  }

  /* ---------- Рендер ---------- */
  function escapeHtml(s) {
    return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  }

  function chartSvg(rows, max) {
    const w = 100 / rows.length;
    const bars = rows.map((r, i) => {
      const h = max ? Math.max(r.p ? 6 : 2, Math.round((r.p / max) * 44)) : 2;
      const x = (i * w).toFixed(2);
      return '<g class="dash-bar' + (r.today ? " today" : "") + '">' +
        '<rect x="' + (Number(x) + w * 0.22).toFixed(2) + '" y="' + (48 - h) + '" width="' + (w * 0.56).toFixed(2) + '" height="' + h + '" rx="1">' +
        "<title>" + escapeHtml(r.human + " · " + r.p + " " + t("dash.pts")) + "</title></rect>" +
        "</g>";
    }).join("");
    const labels = rows.map((r) => '<span class="' + (r.today ? "today" : "") + '">' + escapeHtml(r.short) + "</span>").join("");
    return '<svg class="dash-chart" viewBox="0 0 100 50" preserveAspectRatio="none" role="img" aria-label="' +
      escapeHtml(t("dash.chartTitle")) + '">' +
      '<line x1="0" y1="48" x2="100" y2="48" class="dash-axis"></line>' + bars + "</svg>" +
      '<div class="dash-chart-x">' + labels + "</div>";
  }

  function sectionCard(sec, data) {
    const pct = data.total ? Math.round((data.done / data.total) * 100) : (data.percent || 0);
    let note = "";
    if (sec.id === "projects" && data.max) note = t("dash.projPoints", { p: data.points, max: data.max });
    else if (sec.id === "daily") note = t("dash.streakNow", { n: data.streak, best: data.best });
    else if (sec.id === "exam") note = t("dash.examNote", { a: data.attempts, best: data.best, total: data.size });
    else if (sec.id === "contest") note = t("dash.contestNote", { r: data.runs, best: data.best });
    else if (data.total) note = t("dash.of", { done: data.done, total: data.total });
    return '<button class="dash-cell" type="button" data-route="' + sec.route + '">' +
      '<span class="material-icons">' + sec.ico + "</span>" +
      '<span class="dash-cell-name">' + escapeHtml(L(sec.name)) + "</span>" +
      '<span class="dash-cell-num">' + data.done + (data.total ? '<small>/' + data.total + "</small>" : "") + "</span>" +
      '<span class="dash-cell-bar"><i style="width:' + Math.min(100, pct) + '%"></i></span>' +
      '<span class="dash-cell-note muted">' + escapeHtml(note) + "</span>" +
      "</button>";
  }

  function panel(compact) {
    backfill();
    const s = getState();
    const today = dayKey(new Date());
    const rows = [];
    for (let i = WINDOW_DAYS - 1; i >= 0; i--) {
      const key = shiftKey(today, -i);
      const d = s.days[key] || { p: 0 };
      rows.push({
        key: key, p: d.p || 0, today: key === today,
        short: String(parseKey(key).getDate()),
        human: parseKey(key).toLocaleDateString()
      });
    }
    const max = Math.max.apply(null, rows.map((r) => r.p).concat([1]));
    const weekPoints = rows.slice(-7).reduce((a, r) => a + r.p, 0);
    const allDays = Object.keys(s.days).map((k) => ({ key: k, p: (s.days[k] && s.days[k].p) || 0 }));
    const points = allDays.reduce((a, d) => a + d.p, 0);
    const rank = rankOf(points);
    const streak = streakOf(allDays);
    const data = totals();

    const hero =
      '<div class="dash-hero">' +
        '<div class="dash-score"><b>' + points + "</b><span>" + escapeHtml(t("dash.pts")) + "</span></div>" +
        '<div class="dash-rank">' +
          '<strong>' + escapeHtml(rank.name) + "</strong>" +
          '<span>' + escapeHtml(rank.next
            ? t("dash.toNext", { n: rank.toNext, rank: rank.next })
            : t("dash.topRank", { n: rank.level, of: rank.max })) + "</span>" +
          '<span class="dash-rank-bar"><i style="width:' + rank.percent + '%"></i></span>' +
        "</div>" +
        '<div class="dash-sparks">' +
          '<span><span class="material-icons">local_fire_department</span>' + escapeHtml(t("dash.streak", { n: streak.current })) + "</span>" +
          '<span><span class="material-icons">trophy</span>' + escapeHtml(t("dash.bestStreak", { n: streak.best })) + "</span>" +
          '<span><span class="material-icons">calendar_month</span>' + escapeHtml(t("dash.activeDays", { n: allDays.filter((d) => d.p > 0).length })) + "</span>" +
          '<span><span class="material-icons">trending_up</span>' + escapeHtml(t("dash.week", { p: weekPoints })) + "</span>" +
          '<span><span class="material-icons">play_circle</span>' + escapeHtml(t("dash.runs", { n: data.runs })) + "</span>" +
        "</div>" +
      "</div>";

    const chart =
      '<div class="dash-chart-wrap">' +
        '<div class="dash-chart-head"><span>' + escapeHtml(t("dash.chartTitle")) + "</span><b>" + max + "</b></div>" +
        chartSvg(rows, max) +
      "</div>";

    if (compact) return hero + chart;

    const cells = SECTIONS.map((sec) => sectionCard(sec, data[sec.id])).join("");
    const feed = allDays.filter((d) => d.p > 0).sort((a, b) => (a.key < b.key ? 1 : -1)).slice(0, FEED_DAYS).map((d) => {
      const rec = s.days[d.key];
      const bits = [];
      if (rec.t) bits.push(t("dash.fTask", { n: rec.t }));
      if (rec.l) bits.push(t("dash.fLesson", { n: rec.l }));
      if (rec.j) bits.push(t("dash.fProject", { n: rec.j }));
      if (rec.d) bits.push(t("dash.fDaily", { n: rec.d }));
      if (rec.g) bits.push(t("dash.fGlossary", { n: rec.g }));
      if (rec.x) bits.push(t("dash.fExam", { n: rec.x }));
      if (rec.c) bits.push(t("dash.fContest", { n: rec.c }));
      if (rec.m) bits.push(t("dash.fGame", { n: rec.m }));
      return '<li><b>' + d.p + "</b><span>" + escapeHtml(parseKey(d.key).toLocaleDateString()) + "</span>" +
        "<em>" + escapeHtml(bits.join(" · ")) + "</em></li>";
    }).join("");

    const rules = '<p class="dash-rules muted">' + escapeHtml(t("dash.rules", {
      task: AW.task, lesson: AW.lesson, daily: AW.daily, project: AW.project, glossary: AW.glossary
    })) + "</p>";

    return hero + chart +
      '<div class="dash-grid">' + cells + "</div>" +
      (feed ? '<h4 class="dash-feed-title">' + escapeHtml(t("dash.feedTitle")) + '</h4><ul class="dash-feed">' + feed + "</ul>" : "") +
      rules;
  }

  function render() {
    const hosts = $$("[data-dash]");
    if (!hosts.length) return;
    hosts.forEach((host) => {
      host.innerHTML = panel(host.getAttribute("data-dash") === "compact");
    });
  }

  /* ---------- Події ---------- */
  function bind() {
    document.addEventListener("tasksolved", (e) => {
      const d = e.detail || {};
      if (!d.id) return;
      award("t", "t:" + d.id, d.points || AW.task);
    });
    document.addEventListener("lessondone", (e) => {
      const d = e.detail || {};
      if (!d.id) return;
      award("l", "l:" + d.id, AW.lesson);
    });
    document.addEventListener("projectdone", (e) => {
      const d = e.detail || {};
      if (!d.step) return;
      award("j", "j:" + d.step, d.points || AW.project);
    });
    document.addEventListener("dailydone", (e) => {
      award("d", "d:" + dayKey(new Date()), AW.daily);
    });
    document.addEventListener("glossaryread", (e) => {
      const d = e.detail || {};
      if (!d.term) return;
      award("g", "g:" + d.term, AW.glossary);
    });
    document.addEventListener("examdone", (e) => {
      const d = e.detail || {};
      if (!d.passed) return;
      award("x", null, AW.exam);
    });
    document.addEventListener("contestdone", (e) => {
      const d = e.detail || {};
      if (!d.newRecord) return;
      award("c", null, AW.contest);
    });
    document.addEventListener("gameplayed", (e) => {
      const d = e.detail || {};
      if (!d.id) return;
      award("m", "m:" + d.id, AW.game);
    });
    document.addEventListener("langchange", () => { try { render(); } catch (e) { console.warn("dashboard langchange", e); } });
    document.addEventListener("routechange", () => { try { render(); } catch (e) { /* не критично */ } });
  }

  let ready = false;
  function init() {
    if (ready) { render(); return; }
    ready = true;
    bind();
    document.addEventListener("click", (ev) => {
      const cell = ev.target.closest(".dash-cell[data-route]");
      if (!cell || !global.App || !global.App.route) return;
      global.App.route(cell.getAttribute("data-route"));
    });
    render();
    console.info("[dashboard.js] ready");
  }

  global.Dashboard = {
    init, render,
    points: () => { backfill(); const s = getState(); let n = 0; Object.keys(s.days).forEach((k) => { n += (s.days[k].p || 0); }); return n; },
    rank: () => rankOf(global.Dashboard.points()),
    streak: () => { backfill(); const s = getState(); return streakOf(Object.keys(s.days).map((k) => ({ key: k, p: (s.days[k] && s.days[k].p) || 0 }))); },
    totals,
    award
  };
})(window);
