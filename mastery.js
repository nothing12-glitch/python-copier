/* mastery.js — розділ «Мапа майстерності»: єдина карта навичок.
   Збирає справжні відповіді з усіх модулів (курс, задачі, проєкти, словник,
   повторення, розбір помилок, іспит, черепашка) і показує прогрешки-кільця
   за темами Python та за розділами, а також підказує, що вивчити далі.
   Модуль лише читає чужі дані — власного стану не має, тож усе працює офлайн. */
(function (global) {
  const $ = (s) => document.querySelector(s);
  const I = () => global.I18n;
  const t = (k, v) => (I() ? I().t(k, v) : k);
  const L = (o) => (I() ? I().localize(o) : (o && (o.uk || o.en)) || "");

  const REVIEW_KEY = "app.review.";
  const MASTER_BOX = 4;                 // та сама межа опанування, що й у review.js

  function user() { return (global.Profile && global.Profile.handle()) || "guest"; }
  function readJson(key) { try { return JSON.parse(localStorage.getItem(key)) || null; } catch (e) { return null; } }
  function pct(done, total) { return total > 0 ? Math.round((done / total) * 100) : 0; }

  function safe(fn, fallback) { try { const v = fn(); return v == null ? fallback : v; } catch (e) { return fallback; } }

  function glossCats() { return (global.Glossary && global.Glossary.cats) || []; }
  function glossTerms() { return (global.Glossary && global.Glossary.terms) || []; }
  function reviewBoxes() {
    const raw = readJson(REVIEW_KEY + user());
    return (raw && raw.c) || {};
  }

  /* ---------- Тематичні навички (вісь «теми Python») ----------
     Прогрес теми = 60% за прочитані картки словника + 40% за терміни,
     доведені до автоматизму в «Повторенні» (скринька ≥ MASTER_BOX). */
  function topics() {
    const terms = glossTerms();
    const seen = safe(() => (global.Glossary.stats().seen), {}) || {};
    const boxes = reviewBoxes();
    return glossCats().map((cat) => {
      const inCat = terms.filter((x) => x.cat === cat.id);
      const total = inCat.length;
      let read = 0;
      let mastered = 0;
      inCat.forEach((x) => {
        if (seen[x.id]) read++;
        const b = boxes[x.id];
        if (b && (b.b || 0) >= MASTER_BOX) mastered++;
      });
      const p = total > 0 ? Math.round((read / total) * 60 + (mastered / total) * 40) : 0;
      return { id: cat.id, ico: cat.ico, name: cat.name, read, mastered, total, pct: p };
    });
  }

  /* ---------- Покриття розділів (вісь «розділи») ---------- */
  function sections() {
    const T = safe(() => global.Dashboard.totals(), null) || {};
    const rv = safe(() => global.Review.stats(), null) || {};
    const db = safe(() => global.DebugLab.stats(), null) || {};
    const ex = T.exam || {};
    const tu = T.turtle || {};
    return [
      { route: "course", label: t("nav.course"), ico: "school", done: (T.course || {}).done || 0, total: (T.course || {}).total || 0 },
      { route: "tasks", label: t("nav.tasks"), ico: "assignment_turned_in", done: (T.tasks || {}).done || 0, total: (T.tasks || {}).total || 0 },
      { route: "projects", label: t("nav.projects"), ico: "rocket_launch", done: (T.projects || {}).done || 0, total: (T.projects || {}).total || 0 },
      { route: "glossary", label: t("nav.glossary"), ico: "menu_book", done: (T.glossary || {}).done || 0, total: (T.glossary || {}).total || 0 },
      { route: "review", label: t("nav.review"), ico: "style", done: rv.mastered || 0, total: rv.total || 0 },
      { route: "debug", label: t("nav.debug"), ico: "bug_report", done: db.solved || 0, total: db.total || 0 },
      { route: "exam", label: t("nav.exam"), ico: "workspace_premium", done: ex.best || 0, total: ex.size || 0 },
      { route: "turtle", label: t("nav.turtle"), ico: "pets", done: tu.done || 0, total: tu.total || 0 }
    ].map((s) => { s.pct = pct(s.done, s.total); return s; });
  }

  function rankKey(p) {
    if (p >= 90) return "mastery.rank4";
    if (p >= 70) return "mastery.rank3";
    if (p >= 45) return "mastery.rank2";
    if (p >= 20) return "mastery.rank1";
    return "mastery.rank0";
  }

  function compute() {
    const tp = topics();
    const sec = sections();
    const overall = tp.length ? Math.round(tp.reduce((a, x) => a + x.pct, 0) / tp.length) : 0;
    const recs = tp.filter((x) => x.pct < 100).sort((a, b) => a.pct - b.pct).slice(0, 3);
    const anyData = tp.some((x) => x.read || x.mastered) || sec.some((x) => x.done);
    return { topics: tp, sections: sec, overall, recs, anyData };
  }

  /* ---------- Рендер ---------- */
  let ready = false;
  let stageEl;

  function esc(x) { return String(x).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c])); }
  function sfx(name) { if (global.Audio && global.Audio.sfx) { try { global.Audio.sfx(name); } catch (e) {} } }

  const CIRC = 2 * Math.PI * 15.9155; // радіус кола у viewBox 0 0 36 36

  function ring(value, tone) {
    const off = (CIRC * (1 - Math.max(0, Math.min(100, value)) / 100)).toFixed(2);
    return '<span class="ms-ring' + (tone ? " " + tone : "") + '">' +
      '<svg viewBox="0 0 36 36" aria-hidden="true">' +
        '<circle class="ms-ring-bg" cx="18" cy="18" r="15.9155"></circle>' +
        '<circle class="ms-ring-fg" cx="18" cy="18" r="15.9155" stroke-dasharray="' + CIRC.toFixed(2) + '" stroke-dashoffset="' + off + '"></circle>' +
      "</svg>" +
      '<b class="ms-ring-pct">' + value + "</b></span>";
  }

  function headCard(d) {
    const band = d.anyData ? "has" : "empty";
    return '<div class="ms-head elev2">' +
      ring(d.overall, "big " + band) +
      '<div class="ms-head-txt">' +
        '<span class="ms-overall-label">' + esc(t("mastery.overall")) + "</span>" +
        '<strong class="ms-rank">' + esc(t(rankKey(d.overall))) + "</strong>" +
        '<p class="ms-intro">' + esc(t("mastery.intro")) + "</p>" +
      "</div></div>";
  }

  function topicCard(x) {
    return '<div class="ms-topic">' +
      ring(x.pct) +
      '<span class="ms-topic-name"><span class="material-icons">' + esc(x.ico) + "</span>" + esc(L(x.name)) + "</span>" +
      '<span class="ms-topic-sub">' + esc(t("mastery.topicRead", { d: x.read, t: x.total })) + "</span>" +
      '<span class="ms-topic-sub muted">' + esc(t("mastery.topicMastered", { n: x.mastered })) + "</span>" +
    "</div>";
  }

  function sectionRow(s) {
    return '<button class="ms-sect" type="button" data-goto="' + esc(s.route) + '">' +
      '<span class="ms-sect-ico"><span class="material-icons">' + esc(s.ico) + "</span></span>" +
      '<span class="ms-sect-mid">' +
        '<span class="ms-sect-name">' + esc(s.label) + "</span>" +
        '<span class="ms-bar"><i style="width:' + s.pct + '%"></i></span>' +
      "</span>" +
      '<span class="ms-sect-num">' + esc(s.done) + "/" + esc(s.total) + "</span>" +
    "</button>";
  }

  function recCard(x) {
    const needReview = x.read > 0 && x.mastered < x.total;
    return '<div class="ms-rec">' +
      '<div class="ms-rec-txt">' +
        '<span class="ms-rec-name">' + esc(L(x.name)) + "</span>" +
        '<span class="ms-rec-why">' + esc(t("mastery.recWhy", { p: x.pct })) + "</span>" +
      "</div>" +
      '<button class="btn ' + (needReview ? "outlined" : "contained") + ' ms-rec-btn" type="button" data-act="study" data-cat="' + esc(x.id) + '">' +
        '<span class="material-icons">' + (needReview ? "style" : "menu_book") + "</span>" +
        "<span>" + esc(t(needReview ? "mastery.reviewBtn" : "mastery.study")) + "</span>" +
      "</button>" +
    "</div>";
  }

  function render() {
    if (!stageEl) { stageEl = $("#masteryStage"); if (!stageEl) return; }
    const d = compute();

    if (!d.anyData) {
      stageEl.innerHTML = headCard(d) +
        '<div class="card elev2 ms-empty">' +
          '<span class="material-icons">explore</span>' +
          "<p>" + esc(t("mastery.empty")) + "</p>" +
          '<div class="ms-empty-acts">' +
            '<button class="btn contained" type="button" data-goto="course"><span class="material-icons">school</span><span>' + esc(t("nav.course")) + "</span></button>" +
            '<button class="btn outlined" type="button" data-goto="glossary"><span class="material-icons">menu_book</span><span>' + esc(t("nav.glossary")) + "</span></button>" +
          "</div>" +
        "</div>";
      return;
    }

    stageEl.innerHTML =
      headCard(d) +
      '<div class="ms-block">' +
        '<h3 class="ms-block-title"><span class="material-icons">hub</span>' + esc(t("mastery.topics")) + "</h3>" +
        '<div class="ms-topics">' + d.topics.map(topicCard).join("") + "</div>" +
      "</div>" +
      '<div class="ms-block">' +
        '<h3 class="ms-block-title"><span class="material-icons">dashboard</span>' + esc(t("mastery.sections")) + "</h3>" +
        '<div class="ms-sects">' + d.sections.map(sectionRow).join("") + "</div>" +
      "</div>" +
      (d.recs.length
        ? '<div class="ms-block"><h3 class="ms-block-title"><span class="material-icons">auto_awesome</span>' + esc(t("mastery.recs")) + "</h3>" +
            '<div class="ms-recs">' + d.recs.map(recCard).join("") + "</div></div>"
        : '<div class="ms-block"><div class="ms-recs ms-congrats"><span class="material-icons">emoji_events</span><p>' + esc(t("mastery.recsEmpty")) + "</p></div></div>");
  }

  function onClick(ev) {
    const btn = ev.target.closest("[data-act='study']");
    if (!btn) return;
    sfx("click");
    const cat = btn.getAttribute("data-cat");
    if (global.route) { try { global.route("glossary"); } catch (e) {} }
    if (global.Glossary && global.Glossary.filter) { try { global.Glossary.filter(cat); } catch (e) {} }
  }

  function init() {
    if (ready) { render(); return; }
    stageEl = $("#masteryStage");
    if (!stageEl) return;
    ready = true;
    stageEl.addEventListener("click", onClick);
    document.addEventListener("langchange", () => { try { render(); } catch (e) { console.warn("mastery langchange", e); } });
    render();
    console.info("[mastery.js] ready");
  }

  global.Mastery = { init, render, compute };
})(window);
