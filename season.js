/* season.js — розділ «Сезон»: досвід (XP) за всі дії, 8 ліг, щомісячний сезон із таблицею
   суперників, бонуси за дні поспіль. Сезон змінюється першого числа місяця, а місце в лізі
   йде в архів, щоб історію можна було переглянути.
   Стан: app.season.<user> */
(function (global) {
  const $ = (s) => document.querySelector(s);
  const KEY = "app.season.";
  const XP = {
    task: 12, lesson: 8, daily: 25, project: 20, glossary: 3,
    exam: 40, contest: 15, game: 5, turtle: 15, maker: 18
  };
  const LEAGUES = [
    { id: 0, ico: "ecg_heart", name: { uk: "Дерево", en: "Wood", tr: "Tahta" } },
    { id: 1, ico: "stone", name: { uk: "Камінь", en: "Stone", tr: "Taş" } },
    { id: 2, ico: "bolt", name: { uk: "Блискавка", en: "Spark", tr: "Kıvılcım" } },
    { id: 3, ico: "water_drop", name: { uk: "Хвиля", en: "Wave", tr: "Dalga" } },
    { id: 4, ico: "local_fire_department", name: { uk: "Полум'я", en: "Flame", tr: "Alev" } },
    { id: 5, ico: "star", name: { uk: "Зоря", en: "Star", tr: "Yıldız" } },
    { id: 6, ico: "diamond", name: { uk: "Алмаз", en: "Diamond", tr: "Elmas" } },
    { id: 7, ico: "crown", name: { uk: "Корона", en: "Crown", tr: "Taç" } }
  ];
  const LEAGUE_STEP = 250;
  const RIVALS = 30;
  const PROMOTE = 8;

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

  function pad2(n) { return (n < 10 ? "0" : "") + n; }
  function seasonOf(d) { return d.getFullYear() + "-" + pad2(d.getMonth() + 1); }
  function todayKey(d) {
    const x = d || new Date();
    return x.getFullYear() + "-" + pad2(x.getMonth() + 1) + "-" + pad2(x.getDate());
  }
  function daysInSeason(now) {
    return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  }
  function fractionOfSeason(now) {
    return Math.min(1, Math.max(0, (now.getDate() - 1 + now.getHours() / 24) / daysInSeason(now)));
  }
  function leagueOf(xp) { return Math.min(LEAGUES.length - 1, Math.floor(xp / LEAGUE_STEP)); }

  /* ---------- Стан ---------- */
  function blank() {
    return { season: seasonOf(new Date()), xp: 0, bySource: {}, byDay: {}, days: 0, lastDay: "", archive: [], promotions: 0 };
  }

  function getState() {
    let s = blank();
    try {
      const raw = JSON.parse(localStorage.getItem(KEY + user()));
      if (raw && typeof raw === "object") s = Object.assign(blank(), raw);
    } catch (e) { /* пошкоджений запис — починаємо заново */ }
    if (!s.bySource) s.bySource = {};
    if (!s.byDay) s.byDay = {};
    if (!Array.isArray(s.archive)) s.archive = [];
    return rollSeason(s);
  }

  /* Першого числа місяця старий сезон закриваємо, а новий починаємо з нуля XP. */
  function rollSeason(s) {
    const now = seasonOf(new Date());
    if (s.season === now) return s;
    if (s.xp > 0) {
      s.archive.unshift({ season: s.season, xp: s.xp, league: leagueOf(s.xp), days: s.days || 0 });
      s.archive = s.archive.slice(0, 12);
    }
    s.season = now;
    s.xp = 0;
    s.bySource = {};
    s.byDay = {};
    s.days = 0;
    s.lastDay = "";
    s.promotions = 0;
    saveState(s);
    return s;
  }

  function saveState(s) {
    try { localStorage.setItem(KEY + user(), JSON.stringify(s)); }
    catch (e) { /* сховище переповнене — прогрес сезону не вартий зламаної сторінки */ }
  }

  /* ---------- Нарахування XP ---------- */
  function streakMultiplier(s) {
    if (s.days >= 21) return 2;
    if (s.days >= 7) return 1.5;
    if (s.days >= 3) return 1.25;
    return 1;
  }

  function addXp(source, uid, bonus) {
    const s = getState();
    const base = XP[source];
    if (!base) return 0;
    if (uid && s.bySource["#" + uid]) return 0;
    const gain = Math.round(base * streakMultiplier(s) * (bonus || 1));
    s.xp += gain;
    s.bySource[source] = (s.bySource[source] || 0) + gain;
    if (uid) s.bySource["#" + uid] = gain;
    const day = todayKey();
    s.byDay[day] = (s.byDay[day] || 0) + gain;
    touchStreak(s, day);
    const before = leagueOf(s.xp - gain);
    saveState(s);
    const after = leagueOf(s.xp);
    if (after > before) celebrateLeague(s, after);
    renderIfActive();
    announce(s);
    return gain;
  }

  /* Один XP за першу дію дня — це «щоденний бонус», який тримає серію живим. */
  function touchStreak(s, day) {
    if (s.lastDay === day) return;
    const y = new Date();
    y.setDate(y.getDate() - 1);
    s.days = s.lastDay === todayKey(y) ? (s.days || 0) + 1 : 1;
    s.lastDay = day;
    if (s.days > (s.best || 0)) s.best = s.days;
  }

  function celebrateLeague(s, id) {
    s.promotions = (s.promotions || 0) + 1;
    saveState(s);
    const lg = LEAGUES[id];
    toast(t("season.promoted", { name: pick(lg.name) }));
    document.dispatchEvent(new CustomEvent("leaguechange", { detail: { league: id } }));
    try { global.Dashboard && global.Dashboard.award && global.Dashboard.award("season", "league:" + s.season + ":" + id, 0); } catch (e) { /* панель не критична */ }
  }

  /* ---------- Суперники ----------
     Насправді ніхто не змагається онлайн, тому таблицю робимо детермінованою:
     з назви сезону й ліги випливає один і той самий набір імен і той самий темп росту. */
  const NAMES = [
    "Аліса", "Максим", "Соломія", "Данило", "Ярина", "Тарас", "Оля", "Єгор",
    "Ніка", "Ромко", "Христина", "Святослав", "Леся", "Марко", "Уляна", "Ілля",
    "Софія", "Дем'ян", "Мирослава", "Назар", "Віра", "Остап", "Злата", "Северин",
    "Богдана", "Лаврін", "Галина", "Юрко", "Оксана", "Павло", "Мирослав", "Арсеній",
    "Каріна", "Добрин", "Станіслав", "Ярослава", "Лук'ян", "Богдан", "Зоряна", "Ростислав",
    "Емілія", "Тимофій", "Анастасія", "Володимир", "Дарина", "Макар", "Сніжана", "Артем",
    "Катерина", "Михайло"
  ];

  function hash(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function rivals(season, leagueId) {
    const out = [];
    for (let i = 0; i < RIVALS; i++) {
      const seed = hash(season + "|" + leagueId + "|" + i);
      const name = NAMES[(seed >>> 3) % NAMES.length];
      const floor = leagueId * LEAGUE_STEP;
      const pace = 0.35 + ((seed >>> 7) % 100) / 100 * 1.5;
      const cap = floor + LEAGUE_STEP * pace;
      out.push({ name: name + " " + ((seed >>> 11) % 90 + 10), xp: Math.round(cap * fractionOfSeason(new Date())) });
    }
    return out;
  }

  function standings(s) {
    const leagueId = leagueOf(s.xp);
    const rows = rivals(s.season, leagueId).map((r) => ({ name: r.name, xp: r.xp, me: false }));
    rows.push({ name: me(), xp: s.xp, me: true });
    rows.sort((a, b) => b.xp - a.xp);
    const rank = rows.findIndex((r) => r.me) + 1;
    return { league: leagueId, rows: rows, rank: rank, size: rows.length, promoted: rank <= PROMOTE };
  }

  function me() {
    const p = global.Profile;
    if (!p) return "guest";
    try { return p.getNickname && p.getNickname() ? p.getNickname() : p.handle(); } catch (e) { return "guest"; }
  }

  /* ---------- Панель ---------- */
  let ready = false;
  let stageEl, listEl, xpEl, leagueEl, rankEl, daysEl, multEl, introEl, barEl, barLabelEl, seasonEl;

  function renderPanel() {
    const s = getState();
    const st = standings(s);
    const lg = LEAGUES[st.league];
    const nextAt = (st.league + 1) * LEAGUE_STEP;
    if (xpEl) xpEl.textContent = String(s.xp);
    if (leagueEl) {
      leagueEl.innerHTML = "";
      leagueEl.appendChild(el("span", "material-icons", lg.ico));
      leagueEl.appendChild(el("span", null, pick(lg.name)));
    }
    if (rankEl) rankEl.textContent = t("season.rank", { n: st.rank, total: st.size });
    if (daysEl) daysEl.textContent = t("season.days", { n: s.days || 0 });
    if (multEl) multEl.textContent = "x" + streakMultiplier(s);
    if (seasonEl) seasonEl.textContent = s.season;
    if (introEl) {
      introEl.textContent = st.league >= LEAGUES.length - 1
        ? t("season.introTop", { xp: s.xp })
        : t("season.intro", { left: Math.max(0, nextAt - s.xp), name: pick(LEAGUES[st.league + 1].name) });
    }
    if (barEl) {
      const from = st.league * LEAGUE_STEP;
      const pct = Math.round(((s.xp - from) / LEAGUE_STEP) * 100);
      barEl.style.width = Math.max(2, Math.min(100, pct)) + "%";
      if (barLabelEl) barLabelEl.textContent = (s.xp - from) + " / " + LEAGUE_STEP;
    }
    if (listEl) {
      listEl.innerHTML = "";
      st.rows.slice(0, 10).forEach((row, i) => {
        const li = el("li", "season-row" + (row.me ? " me" : ""));
        li.appendChild(el("span", "season-pos", String(i + 1)));
        li.appendChild(el("span", "season-name", row.name));
        li.appendChild(el("span", "season-xp", String(row.xp)));
        listEl.appendChild(li);
      });
      if (st.rows.length > 10) {
        const rest = st.rows.slice(10);
        const mine = st.rows.findIndex((r) => r.me);
        if (mine >= 10) {
          const gap = el("li", "season-row gap");
          gap.appendChild(el("span", "season-pos", "…"));
          gap.appendChild(el("span", "season-name", t("season.others", { n: rest.length })));
          gap.appendChild(el("span", "season-xp", ""));
          listEl.appendChild(gap);
          const li = el("li", "season-row me");
          li.appendChild(el("span", "season-pos", String(mine + 1)));
          li.appendChild(el("span", "season-name", me()));
          li.appendChild(el("span", "season-xp", String(s.xp)));
          listEl.appendChild(li);
        }
      }
    }
    renderSources(s);
    renderArchive(s);
  }

  function renderSources(s) {
    const box = $("#seasonSources");
    if (!box) return;
    box.innerHTML = "";
    Object.keys(XP).forEach((k) => box.appendChild(sourceRowOf(s, k)));
  }

  function sourceRowOf(s, source) {
    const icons = {
      task: "assignment", lesson: "school", daily: "local_fire_department", project: "architecture",
      glossary: "menu_book", exam: "workspace_premium", contest: "military_tech", game: "sports_esports",
      turtle: "turtle", maker: "build"
    };
    const pts = s.bySource[source] || 0;
    const row = el("div", "season-src" + (pts ? "" : " zero"));
    row.appendChild(el("span", "material-icons", icons[source] || "bubble_chart"));
    row.appendChild(el("span", "season-srcname", t("season.src." + source)));
    row.appendChild(el("span", "season-srcnum", "+" + pts));
    return row;
  }

  function renderArchive(s) {
    const box = $("#seasonArchive");
    if (!box) return;
    box.innerHTML = "";
    if (!s.archive.length) {
      box.appendChild(el("p", "season-empty", t("season.noArchive")));
      return;
    }
    s.archive.forEach((row) => {
      const li = el("div", "season-old");
      li.appendChild(el("span", "material-icons", LEAGUES[row.league] ? LEAGUES[row.league].ico : "emoji_events"));
      const txt = el("div", "season-oldtext");
      txt.appendChild(el("span", "season-oldseason", row.season));
      txt.appendChild(el("span", "season-oldmeta",
        t("season.oldLine", { xp: row.xp, name: LEAGUES[row.league] ? pick(LEAGUES[row.league].name) : "—", days: row.days || 0 })));
      li.appendChild(txt);
      box.appendChild(li);
    });
  }

  function stats() {
    const s = getState();
    const st = standings(s);
    return {
      xp: s.xp, season: s.season, league: st.league, leagueName: pick(LEAGUES[st.league].name),
      days: s.days || 0, best: s.best || 0, rank: st.rank, promoted: st.promoted,
      sources: Object.keys(XP).reduce((sum, k) => sum + (s.bySource[k] ? 1 : 0), 0),
      seasons: s.archive.length + 1, promotions: s.promotions || 0
    };
  }

  function announce(s) {
    document.dispatchEvent(new CustomEvent("seasonchange", {
      detail: { xp: s.xp, league: leagueOf(s.xp), days: s.days || 0 }
    }));
  }

  function renderIfActive() {
    if (!ready) return;
    const view = $("#view-season");
    if (view && view.classList.contains("active")) renderPanel();
  }

  /* ---------- Події інших розділів ---------- */
  function bindEvents() {
    const map = [
      ["tasksolved", (e) => addXp("task", "task:" + (e.detail && e.detail.id), 1)],
      ["lessondone", (e) => addXp("lesson", "lesson:" + (e.detail && (e.detail.id || e.detail.module)), 1)],
      ["dailydone", () => addXp("daily", "daily:" + todayKey(), 1)],
      ["projectdone", (e) => addXp("project", "project:" + (e.detail && e.detail.step), 1)],
      ["glossaryread", (e) => addXp("glossary", "gloss:" + (e.detail && e.detail.term), 1)],
      ["examdone", (e) => addXp("exam", "exam:" + (e.detail && e.detail.attempt), 1)],
      ["contestdone", (e) => addXp("contest", "contest:" + (e.detail && e.detail.id), 1)],
      ["gameplayed", (e) => addXp("game", "game:" + (e.detail && e.detail.id) + ":" + todayKey(), 1)],
      ["turtledone", (e) => addXp("turtle", "turtle:" + (e.detail && e.detail.id), 1)],
      ["makertaskdone", (e) => addXp("maker", "maker:" + (e.detail && e.detail.id), 1)]
    ];
    map.forEach((pair) => document.addEventListener(pair[0], (e) => {
      try { pair[1](e || window.event); } catch (err) { console.warn("[season.js]", pair[0], err); }
    }));
    document.addEventListener("langchange", () => { if (ready) render(); });
    document.addEventListener("routechange", (e) => { if (e.detail === "season") render(); });
  }

  /* ---------- Рендер ---------- */
  function render() {
    if (!ready) { init(); return; }
    renderPanel();
    console.info("[season.js] render", stats().xp + " XP");
  }

  function init() {
    if (ready) { render(); return; }
    stageEl = $("#seasonStage");
    listEl = $("#seasonBoard");
    xpEl = $("#seasonXp");
    leagueEl = $("#seasonLeague");
    rankEl = $("#seasonRank");
    daysEl = $("#seasonDays");
    multEl = $("#seasonMult");
    introEl = $("#seasonIntro");
    barEl = $("#seasonBarFill");
    barLabelEl = $("#seasonBarLabel");
    seasonEl = $("#seasonName");
    if (!listEl || !xpEl || !leagueEl) return;
    ready = true;
    install();
    render();
  }

  /* Перший запуск: віддаємо XP за те, що людина вже встигла зробити до появи сезонів,
     щоб ніхто не почав місяць із порожньої таблиці. */
  function bootstrap() {
    const s = getState();
    if (s.seeded) return;
    const D = global.Dashboard && global.Dashboard.totals ? global.Dashboard.totals() : null;
    if (D) {
      const seed =
        Math.min(60, (D.tasks && D.tasks.done) || 0) * XP.task +
        Math.min(120, (D.projects && D.projects.done) || 0) * XP.project +
        Math.min(40, (D.glossary && D.glossary.done) || 0) * XP.glossary;
      if (seed > 0) {
        s.xp += Math.round(seed * 0.3);
        s.bySource.seed = Math.round(seed * 0.3);
      }
    }
    s.seeded = true;
    saveState(s);
  }

  /* Сезон живе й тоді, коли людина не відкриває розділ: ініціалізуємо слухачів одразу. */
  function install() {
    if (installed) return;
    installed = true;
    bindEvents();
    bootstrap();
  }
  let installed = false;

  global.Season = {
    init, install, render, stats, addXp,
    LEAGUES, XP, LEAGUE_STEP, standings
  };
})(window);
