/* review.js — розділ «Повторення»: інтервальні картки (система Лайтнера) на базі
   термінів зі Словника. Картка з'являється знову рівно тоді, коли пора її пригадати.
   Прогрес: app.review.<user> = { c: { id: {b, d} }, done, lastDay, streak } */
(function (global) {
  const $ = (s) => document.querySelector(s);
  const KEY = "app.review.";
  const I = () => global.I18n;
  const L = (o) => (I() ? I().localize(o) : (o && (o.uk || o.en)) || "");
  const t = (k, v) => (I() ? I().t(k, v) : k);

  const BOXES = 5;               // максимальна скринька
  const INTERVALS = [0, 1, 2, 4, 9, 21]; // дні до наступного повторення за скринькою 0..5
  const MASTER_BOX = 4;          // скринька, з якої термін вважається опанованим

  function user() { return (global.Profile && global.Profile.handle()) || "guest"; }
  function today() { return Math.floor(Date.now() / 86400000); }

  function terms() {
    return (global.Glossary && global.Glossary.terms) || [];
  }
  function catOf(id) {
    const cats = (global.Glossary && global.Glossary.cats) || [];
    return cats.find((c) => c.id === id) || { ico: "label", name: { uk: "", en: "", tr: "" } };
  }

  /* ---------- Стан ---------- */
  function getState() {
    try {
      const raw = localStorage.getItem(KEY + user());
      if (raw) {
        const o = JSON.parse(raw);
        return { c: o.c || {}, done: o.done || 0, lastDay: o.lastDay || 0, streak: o.streak || 0 };
      }
    } catch (e) { /* пошкоджений запис — почнемо з чистого */ }
    return { c: {}, done: 0, lastDay: 0, streak: 0 };
  }

  function saveState(s) {
    try { localStorage.setItem(KEY + user(), JSON.stringify(s)); }
    catch (e) { console.warn("[review] save", e); }
  }

  function boxOf(s, id) { const e = s.c[id]; return e ? (e.b || 0) : 0; }

  function masteredCount(s) { return terms().filter((x) => boxOf(s, x.id) >= MASTER_BOX).length; }

  function dueList(s) {
    const td = today();
    return terms()
      .filter((x) => { const e = s.c[x.id]; return !e || (e.d || 0) <= td; })
      .map((x) => x.id);
  }

  /* ---------- Сесія ---------- */
  let session = null;   // { queue: [id], idx, revealed }
  let lastRun = null;   // { seen, mastered }

  function touchStreak(s) {
    const td = today();
    if (s.lastDay === td) return;
    if (s.lastDay === td - 1) s.streak = (s.streak || 0) + 1;
    else s.streak = 1;
    s.lastDay = td;
  }

  function start() {
    const s = getState();
    const due = dueList(s);
    if (!due.length) return;
    session = { queue: due.slice(), idx: 0, revealed: false };
    lastRun = { seen: 0, total: due.length };
    render();
  }

  function current() {
    if (!session || session.idx >= session.queue.length) return null;
    const id = session.queue[session.idx];
    return terms().find((x) => x.id === id) || null;
  }

  function grade(kind) {
    const card = current();
    if (!card) return;
    const s = getState();
    const e = s.c[card.id] ? { b: s.c[card.id].b || 0, d: s.c[card.id].d || 0 } : { b: 0, d: 0 };
    const td = today();
    if (kind === "again") {
      e.b = 1; e.d = td + INTERVALS[1];
      session.queue.push(card.id);        // повертаємо в цю ж сесію
    } else if (kind === "easy") {
      e.b = Math.min(BOXES, (e.b || 0) + 2); e.d = td + INTERVALS[e.b];
    } else { // good
      e.b = Math.min(BOXES, (e.b || 0) + 1); e.d = td + INTERVALS[e.b];
    }
    s.c[card.id] = e;
    s.done = (s.done || 0) + 1;
    touchStreak(s);
    saveState(s);
    if (lastRun) lastRun.seen += 1;
    session.revealed = false;
    session.idx += 1;

    const after = getState();
    document.dispatchEvent(new CustomEvent("reviewdone", {
      detail: {
        seen: after.done,
        mastered: masteredCount(after),
        total: terms().length,
        streak: after.streak || 0
      }
    }));
    sfx(kind === "again" ? "click" : "success");
    render();
  }

  /* ---------- Рендер ---------- */
  let ready = false;
  let stageEl;
  let byId = {};

  function esc(x) { return String(x).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c])); }
  function sfx(name) { if (global.Audio && global.Audio.sfx) { try { global.Audio.sfx(name); } catch (e) {} } }

  function dots(b) {
    let out = '<span class="review-dots" aria-hidden="true">';
    for (let i = 1; i <= BOXES; i++) out += '<i class="' + (i <= b ? "on" : "") + '"></i>';
    return out + "</span>";
  }

  function renderSummary() {
    const s = getState();
    const total = terms().length;
    const due = dueList(s).length;
    const mastered = masteredCount(s);
    const pct = total ? Math.round((mastered / total) * 100) : 0;
    const nothing = total === 0;
    const clear = due === 0 && !nothing;

    let head;
    if (nothing) head = '<p class="review-note muted">' + esc(t("review.empty")) + "</p>";
    else if (clear) head = '<p class="review-note muted">' + esc(t("review.noDue")) + "</p>";
    else head = '<p class="review-note muted">' + esc(t("review.intro")) + "</p>";

    const startBtn = (!nothing && due > 0)
      ? '<button class="btn contained" type="button" data-act="start">' +
        '<span class="material-icons">play_arrow</span><span>' + esc(t("review.start")) +
        " (" + due + ")</span></button>"
      : "";

    stageEl.innerHTML =
      '<div class="review-stats">' +
        stat("event_repeat", due, t("review.statDue")) +
        stat("workspace_premium", pct + "%", t("review.statMastered")) +
        stat("local_fire_department", (s.streak || 0), t("review.statStreak")) +
        stat("check_circle", mastered + " / " + total, t("review.statDone")) +
      "</div>" +
      '<div class="review-pctbar"><i style="width:' + pct + '%"></i></div>' +
      head +
      '<div class="task-actions">' + startBtn + "</div>";
  }

  function stat(ico, value, label) {
    return '<div class="review-stat card elev2">' +
      '<span class="material-icons review-stat-ico">' + ico + "</span>" +
      '<b class="review-stat-val">' + esc(String(value)) + "</b>" +
      '<span class="review-stat-label">' + esc(label) + "</span></div>";
  }

  function renderDone() {
    const s = getState();
    const seen = lastRun ? lastRun.seen : 0;
    const total = terms().length;
    const mastered = masteredCount(s);
    const pct = total ? Math.round((mastered / total) * 100) : 0;
    stageEl.innerHTML =
      '<div class="review-done card elev2">' +
        '<span class="material-icons review-done-ico">task_alt</span>' +
        '<h3>' + esc(t("review.doneTitle")) + "</h3>" +
        '<p class="muted">' + esc(t("review.doneText", { n: seen })) + "</p>" +
        '<p class="review-done-sub muted">' +
          esc(t("review.progress")) + ": " + pct + "% · " + mastered + "/" + total +
          " · 🔥 " + (s.streak || 0) +
        "</p>" +
        '<div class="task-actions">' +
          '<button class="btn contained" type="button" data-act="home">' +
            '<span class="material-icons">dashboard</span><span>' + esc(t("review.summaryBtn")) + "</span></button>" +
        "</div>" +
      "</div>";
  }

  function renderCard() {
    const card = current();
    if (!card) { renderDone(); return; }
    const s = getState();
    const b = boxOf(s, card.id);
    const cat = catOf(card.cat);
    const left = session.queue.length - session.idx;
    const pos = Math.round((session.idx / session.queue.length) * 100);

    let io = "";
    if (card.inp) io += '<div class="gloss-io"><span class="gloss-io-tag">' + esc(t("tasks.inputData")) + "</span><pre>" + esc(card.inp) + "</pre></div>";
    if (card.out) io += '<div class="gloss-io"><span class="gloss-io-tag">' + esc(t("tasks.outputData")) + "</span><pre>" + esc(card.out) + "</pre></div>";

    const back = session.revealed
      ? '<p class="gloss-def">' + esc(L(card.def)) + "</p>" +
        '<div class="gloss-body">' +
          '<pre class="gloss-code code-block">' + esc(card.code) + "</pre>" + io +
        "</div>" +
        '<div class="task-actions review-grade">' +
          '<button class="btn text" type="button" data-grade="again"><span class="material-icons">restart_alt</span><span>' + esc(t("review.again")) + "</span></button>" +
          '<button class="btn outlined" type="button" data-grade="good"><span class="material-icons">thumb_up</span><span>' + esc(t("review.good")) + "</span></button>" +
          '<button class="btn contained" type="button" data-grade="easy"><span class="material-icons">bolt</span><span>' + esc(t("review.easy")) + "</span></button>" +
        "</div>"
      : '<div class="task-actions review-grade">' +
          '<button class="btn contained" type="button" data-act="reveal"><span class="material-icons">visibility</span><span>' + esc(t("review.reveal")) + "</span></button>" +
        "</div>";

    stageEl.innerHTML =
      '<div class="review-top">' +
        '<span class="review-count muted">' + esc(t("review.left", { n: left })) + "</span>" +
        dots(b) +
      "</div>" +
      '<div class="review-pctbar review-progress"><i style="width:' + pos + '%"></i></div>' +
      '<article class="card elev2 gloss-card open">' +
        '<div class="gloss-card-head">' +
          '<code class="gloss-term">' + esc(card.term) + "</code>" +
          '<span class="gloss-cat"><span class="material-icons">' + cat.ico + "</span>" + esc(L(cat.name)) + "</span>" +
        "</div>" +
        back +
      "</article>";
  }

  function render() {
    if (!stageEl) return;
    if (!terms().length) { stageEl.innerHTML = '<p class="review-note muted">' + esc(t("review.empty")) + "</p>"; return; }
    if (session) {
      if (session.idx >= session.queue.length) renderDone();
      else renderCard();
    } else {
      renderSummary();
    }
  }

  function onClick(ev) {
    const gradeBtn = ev.target.closest("[data-grade]");
    if (gradeBtn) { grade(gradeBtn.getAttribute("data-grade")); return; }
    const actBtn = ev.target.closest("[data-act]");
    if (!actBtn) return;
    const act = actBtn.getAttribute("data-act");
    if (act === "start") { sfx("click"); start(); }
    else if (act === "reveal") { session.revealed = true; sfx("pop"); render(); }
    else if (act === "home") { session = null; lastRun = null; render(); }
  }

  function init() {
    byId = {};
    terms().forEach((x) => { byId[x.id] = x; });

    if (ready) { render(); return; }
    stageEl = $("#reviewStage");
    if (!stageEl) return;
    ready = true;
    stageEl.addEventListener("click", onClick);
    const resetBtn = $("#reviewReset");
    if (resetBtn) resetBtn.addEventListener("click", () => {
      if (window.confirm(t("review.reset") + "?")) global.Review.reset();
    });
    document.addEventListener("langchange", () => { try { render(); } catch (e) { console.warn("review langchange", e); } });
    render();
    console.info("[review.js] ready", terms().length);
  }

  global.Review = {
    init,
    render,
    stats: () => {
      const s = getState();
      return {
        done: s.done || 0,
        due: dueList(s).length,
        mastered: masteredCount(s),
        total: terms().length,
        streak: s.streak || 0,
        seenIds: Object.keys(s.c)
      };
    },
    start,
    reset: () => {
      try { localStorage.removeItem(KEY + user()); } catch (e) {}
      session = null; lastRun = null;
      render();
    }
  };
})(window);
