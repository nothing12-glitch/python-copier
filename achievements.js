/* achievements.js — система досягнень з відстеженням прогресу.
   Досягнення зберігаються в localStorage: app.achievements.<user> */
(function (global) {
  const ACH_KEY_PREFIX = "app.achievements.";
  const STATS_KEY = "app.achStats";

  const ALL_GAMES = ["ttt", "snake", "memory", "g2048", "rps", "react", "simon", "mines", "guess"];
  const ALL_ROUTES = ["home", "python", "games", "tools", "feedback", "profile", "settings", "achievements"];

  /* ---------- Визначення досягнень ---------- */
  const ACHIEVEMENTS = [
    { id: "py_first",     ico: "code",          cat: "python",   tier: "bronze",   check: (s) => s.pyRuns >= 1 },
    { id: "py_10",        ico: "terminal",      cat: "python",   tier: "silver",   check: (s) => s.pyRuns >= 10 },
    { id: "py_50",        ico: "rocket_launch", cat: "python",   tier: "gold",     check: (s) => s.pyRuns >= 50 },
    { id: "py_snippet",   ico: "save",          cat: "python",   tier: "bronze",   check: (s) => s.snippets >= 1 },

    { id: "game_first",   ico: "sports_esports",cat: "games",    tier: "bronze",   check: (s) => s.gamesPlayed.length >= 1 },
    { id: "game_5",       ico: "stadia_controller", cat: "games", tier: "silver",  check: (s) => s.gamesPlayed.length >= 5 },
    { id: "game_all",     ico: "emoji_events",  cat: "games",    tier: "gold",     check: (s) => s.gamesPlayed.length >= 9 },
    { id: "game_record",  ico: "track_changes", cat: "games",    tier: "bronze",   check: (s) => s.recordGames.length >= 1 },
    { id: "game_5rec",    ico: "military_tech", cat: "games",    tier: "silver",   check: (s) => s.recordGames.length >= 5 },

    { id: "snake_20",     ico: "🐍",            cat: "specific", tier: "silver",   check: (s) => (s.records.snake || 0) >= 20 },
    { id: "g2048_500",    ico: "🔢",            cat: "specific", tier: "silver",   check: (s) => (s.records.g2048 || 0) >= 500 },
    { id: "react_300",    ico: "⚡",             cat: "specific", tier: "gold",     check: (s) => s.records.react && s.records.react <= 300 },
    { id: "simon_5",      ico: "🎨",            cat: "specific", tier: "silver",   check: (s) => (s.records.simon || 0) >= 5 },
    { id: "memory_win",   ico: "🧠",            cat: "specific", tier: "bronze",   check: (s) => s.records.memory != null },

    { id: "profile_create", ico: "person_add",  cat: "profile",  tier: "bronze",   check: () => !!(global.Profile && global.Profile.current()) },
    { id: "avatar_custom",  ico: "face",        cat: "profile",  tier: "silver",   check: () => { const a = localStorage.getItem("app.avatar") || ""; return a.startsWith("data:"); } },
    { id: "bg_custom",      ico: "palette",     cat: "profile",  tier: "silver",   check: () => { const d = localStorage.getItem("app.avatarBg.dark") || ""; const l = localStorage.getItem("app.avatarBg.light") || ""; return (d && d.startsWith("data:")) || (l && l.startsWith("data:")); } },

    { id: "secret_found", ico: "lock_open",     cat: "explore",  tier: "gold",     check: () => localStorage.getItem("app.secretFound") === "1" },
    { id: "all_routes",   ico: "explore",       cat: "explore",  tier: "silver",   check: (s) => ALL_ROUTES.every((r) => s.routesVisited.includes(r)) },
    { id: "night_owl",    ico: "nightlight",    cat: "explore",  tier: "bronze",   check: () => { const h = new Date().getHours(); return h >= 0 && h < 5; } },

    { id: "visit_3",      ico: "calendar_today",cat: "streak",   tier: "silver",   check: (s) => s.visitDays >= 3 },
    { id: "visit_7",      ico: "date_range",    cat: "streak",   tier: "gold",     check: (s) => s.visitDays >= 7 }
  ];

  const TIER_COLORS = { bronze: "#CD7F32", silver: "#C0C0C0", gold: "#FFD700" };
  const TIER_NAMES = {
    bronze: { uk: "Бронза", en: "Bronze", tr: "Bronz" },
    silver: { uk: "Срібло", en: "Silver", tr: "Gümüş" },
    gold:   { uk: "Золото", en: "Gold",   tr: "Altın" }
  };

  const CAT_NAMES = {
    python:   { uk: "Python",   en: "Python",   tr: "Python" },
    games:    { uk: "Ігри",     en: "Games",     tr: "Oyunlar" },
    specific: { uk: "Рекорди",  en: "Records",   tr: "Rekorlar" },
    profile:  { uk: "Профіль",  en: "Profile",   tr: "Profil" },
    explore:  { uk: "Дослідник",en: "Explorer",  tr: "Kaşif" },
    streak:   { uk: "Серії",    en: "Streaks",   tr: "Seriler" }
  };

  const ACH_NAMES = {
    py_first:       { uk: "Перший код",         en: "First Code",         tr: "İlk Kod" },
    py_10:          { uk: "Десяточка",           en: "Double Digits",      tr: "Çift Hane" },
    py_50:          { uk: "Майстер коду",        en: "Code Master",        tr: "Kod Ustası" },
    py_snippet:     { uk: "Бібліотекар",         en: "Librarian",          tr: "Kütüphaneci" },
    game_first:     { uk: "Перша гра",           en: "First Game",         tr: "İlk Oyun" },
    game_5:         { uk: "Гравець",             en: "Gamer",              tr: "Oyuncu" },
    game_all:       { uk: "Всеосяжний",          en: "Completionist",      tr: "Tamamlayıcı" },
    game_record:    { uk: "Рекордсмен",          en: "Record Holder",      tr: "Rekorcu" },
    game_5rec:      { uk: "Чемпіон",             en: "Champion",           tr: "Şampiyon" },
    snake_20:       { uk: "Змієлов",             en: "Snake Charmer",      tr: "Yılan Terbiyecisi" },
    g2048_500:      { uk: "П'ятисотник",         en: "Five Hundred",       tr: "Beş Yüz" },
    react_300:      { uk: "Блискавка",           en: "Lightning",          tr: "Yıldırım" },
    simon_5:        { uk: "Пам'ять",             en: "Memory King",        tr: "Hafıza Kralı" },
    memory_win:     { uk: "Знахідка",            en: "Finder",             tr: "Bulucu" },
    profile_create: { uk: "Ласкаво просимо",     en: "Welcome",            tr: "Hoş Geldin" },
    avatar_custom:  { uk: "Стиляга",             en: "Trendsetter",        tr: "Modacı" },
    bg_custom:      { uk: "Естет",               en: "Aesthete",           tr: "Estet" },
    secret_found:   { uk: "Дослідник",           en: "Explorer",           tr: "Kaşif" },
    all_routes:     { uk: "Допитливий",          en: "Curious Mind",       tr: "Meraklı" },
    night_owl:      { uk: "Нічна сова",          en: "Night Owl",          tr: "Gece Kuşu" },
    visit_3:        { uk: "Стабільний",          en: "Consistent",         tr: "Tutarlı" },
    visit_7:        { uk: "Тижневик",            en: "Week Warrior",       tr: "Hafta Savaşçısı" }
  };

  const ACH_DESC = {
    py_first:       { uk: "Запусти першу програму на Python",     en: "Run your first Python program",       tr: "İlk Python programını çalıştır" },
    py_10:          { uk: "Запусти 10 програм",                    en: "Run 10 programs",                     tr: "10 program çalıştır" },
    py_50:          { uk: "Запусти 50 програм",                    en: "Run 50 programs",                     tr: "50 program çalıştır" },
    py_snippet:     { uk: "Збережи перший фрагмент коду",          en: "Save your first code snippet",        tr: "İlk kod parçanı kaydet" },
    game_first:     { uk: "Зіграй у першу гру",                    en: "Play your first game",                tr: "İlk oyununu oyna" },
    game_5:         { uk: "Спробуй 5 різних ігор",                 en: "Try 5 different games",               tr: "5 farklı oyun dene" },
    game_all:       { uk: "Спробуй усі 9 ігор",                    en: "Try all 9 games",                     tr: "Tüm 9 oyunu dene" },
    game_record:    { uk: "Встанови перший рекорд",                en: "Set your first record",               tr: "İlk rekorunu kır" },
    game_5rec:      { uk: "Встанови рекорди у 5 іграх",            en: "Set records in 5 games",              tr: "5 oyunda rekor kır" },
    snake_20:       { uk: "Набери 20+ очок у Змійці",              en: "Score 20+ in Snake",                  tr: "Yılan'da 20+ puan al" },
    g2048_500:      { uk: "Набери 500+ очок у 2048",               en: "Score 500+ in 2048",                  tr: "2048'de 500+ puan al" },
    react_300:      { uk: "Реакція швидше 300мс",                  en: "Reaction under 300ms",                tr: "300ms altı refleks" },
    simon_5:        { uk: "Досягни рівня 5 у Simon",               en: "Reach level 5 in Simon",              tr: "Simon'da 5. seviyeye ulaş" },
    memory_win:     { uk: "Пройди Memory гру",                     en: "Complete Memory game",                tr: "Memory oyununu tamamla" },
    profile_create: { uk: "Створи акаунт",                         en: "Create an account",                   tr: "Hesap oluştur" },
    avatar_custom:  { uk: "Завантаж власний аватар",               en: "Upload a custom avatar",              tr: "Özel avatar yükle" },
    bg_custom:      { uk: "Завантаж власний фон профілю",          en: "Upload a custom profile background",  tr: "Özel profil arka planı yükle" },
    secret_found:   { uk: "Знайди секретну кімнату",               en: "Find the secret room",                tr: "Gizli odayı bul" },
    all_routes:     { uk: "Відвідай усі розділи сайту",            en: "Visit all site sections",             tr: "Tüm site bölümlerini ziyaret et" },
    night_owl:      { uk: "Зайди на сайт після опівночі",          en: "Visit the site after midnight",       tr: "Gece yarısından sonra siteyi ziyaret et" },
    visit_3:        { uk: "Заходь 3 дні поспіль",                  en: "Visit 3 days in a row",               tr: "3 gün üst üste ziyaret et" },
    visit_7:        { uk: "Заходь 7 днів поспіль",                 en: "Visit 7 days in a row",               tr: "7 gün üst üste ziyaret et" }
  };

  const lang = () => (global.I18n ? global.I18n.lang : "uk");
  const pick = (o) => o[lang()] || o.uk || o.en;

  /* ---------- Статистика ---------- */
  function getStats() {
    try { return JSON.parse(localStorage.getItem(STATS_KEY)) || defaultStats(); }
    catch { return defaultStats(); }
  }

  function defaultStats() {
    return { pyRuns: 0, snippets: 0, gamesPlayed: [], records: {}, recordGames: [], routesVisited: [], visitDates: [] };
  }

  function saveStats(s) { localStorage.setItem(STATS_KEY, JSON.stringify(s)); }

  function bumpStat(key, value) {
    const s = getStats();
    if (key === "pyRuns") s.pyRuns = (s.pyRuns || 0) + 1;
    else if (key === "snippets") s.snippets = (s.snippets || 0) + 1;
    else if (key === "game" && value && !s.gamesPlayed.includes(value)) s.gamesPlayed.push(value);
    else if (key === "record" && value) {
      s.records[value.game] = value.val;
      if (!s.recordGames.includes(value.game)) s.recordGames.push(value.game);
    }
    else if (key === "route" && value && !s.routesVisited.includes(value)) s.routesVisited.push(value);
    else if (key === "visit") {
      const today = new Date().toISOString().slice(0, 10);
      if (!s.visitDates.includes(today)) {
        s.visitDates.push(today);
        if (s.visitDates.length > 30) s.visitDates = s.visitDates.slice(-30);
      }
    }
    saveStats(s);
    return s;
  }

  function getVisitDays() {
    const s = getStats();
    const dates = (s.visitDates || []).sort().reverse();
    if (dates.length === 0) return 0;
    let streak = 1;
    for (let i = 1; i < dates.length; i++) {
      const prev = new Date(dates[i - 1]);
      const curr = new Date(dates[i]);
      const diff = (prev - curr) / (1000 * 60 * 60 * 24);
      if (Math.round(diff) === 1) streak++;
      else break;
    }
    return streak;
  }

  /* ---------- Розблокування ---------- */
  function achKey() {
    const user = (global.Profile && global.Profile.handle()) || "guest";
    return ACH_KEY_PREFIX + user;
  }

  function getUnlocked() {
    try { return JSON.parse(localStorage.getItem(achKey())) || []; }
    catch { return []; }
  }

  function saveUnlocked(list) { localStorage.setItem(achKey(), JSON.stringify(list)); }

  function unlock(id) {
    const list = getUnlocked();
    if (list.includes(id)) return false;
    list.push(id);
    saveUnlocked(list);
    showUnlockToast(id);
    return true;
  }

  function isUnlocked(id) { return getUnlocked().includes(id); }

  /* ---------- Перевірка всіх досягнень ---------- */
  function checkAll() {
    const s = getStats();
    s.visitDays = getVisitDays();
    const newlyUnlocked = [];
    ACHIEVEMENTS.forEach((ach) => {
      if (isUnlocked(ach.id)) return;
      try {
        if (ach.check(s)) {
          unlock(ach.id);
          newlyUnlocked.push(ach.id);
        }
      } catch (e) { /* skip broken check */ }
    });
    return newlyUnlocked;
  }

  /* ---------- Тост при розблокуванні ---------- */
  function showUnlockToast(id) {
    const ach = ACHIEVEMENTS.find((a) => a.id === id);
    if (!ach) return;
    const name = ACH_NAMES[id] ? pick(ACH_NAMES[id]) : id;
    const tierName = pick(TIER_NAMES[ach.tier]);
    const msg = "🏆 " + name + " — " + tierName;
    if (global.App && global.App.toast) global.App.toast(msg);
  }

  /* ---------- Рендер сітки досягнень ---------- */
  function render(container) {
    if (!container) return;
    container.innerHTML = "";

    const unlocked = getUnlocked();
    const total = ACHIEVEMENTS.length;
    const count = unlocked.length;

    const header = document.createElement("div");
    header.className = "ach-header";
    header.innerHTML = '<h3>' + (global.I18n ? global.I18n.t("ach.title") || "Досягнення" : "Досягнення") +
      '</h3><span class="ach-counter">' + count + ' / ' + total + '</span>';
    container.appendChild(header);

    const cats = ["python", "games", "specific", "profile", "explore", "streak"];
    cats.forEach((cat) => {
      const catAchs = ACHIEVEMENTS.filter((a) => a.cat === cat);
      if (catAchs.length === 0) return;

      const section = document.createElement("div");
      section.className = "ach-section";

      const sectionTitle = document.createElement("h4");
      sectionTitle.className = "ach-section-title";
      sectionTitle.textContent = pick(CAT_NAMES[cat]);
      section.appendChild(sectionTitle);

      const grid = document.createElement("div");
      grid.className = "ach-grid";

      catAchs.forEach((ach) => {
        const isDone = unlocked.includes(ach.id);
        const card = document.createElement("div");
        card.className = "ach-card" + (isDone ? " unlocked" : " locked");

        const tierColor = TIER_COLORS[ach.tier];
        const icoIsEmoji = ach.ico.length <= 4 && /\p{Emoji}/u.test(ach.ico);

        const iconWrap = document.createElement("div");
        iconWrap.className = "ach-icon";
        iconWrap.style.borderColor = isDone ? tierColor : "var(--md-outline)";
        if (isDone) iconWrap.style.background = tierColor + "22";
        if (icoIsEmoji) {
          iconWrap.textContent = ach.ico;
          iconWrap.style.fontSize = "24px";
        } else {
          const sp = document.createElement("span");
          sp.className = "material-icons";
          sp.textContent = ach.ico;
          sp.style.color = isDone ? tierColor : "var(--md-outline)";
          iconWrap.appendChild(sp);
        }

        const info = document.createElement("div");
        info.className = "ach-info";

        const nameEl = document.createElement("div");
        nameEl.className = "ach-name";
        nameEl.textContent = ACH_NAMES[ach.id] ? pick(ACH_NAMES[ach.id]) : ach.id;
        if (isDone) nameEl.style.color = tierColor;

        const descEl = document.createElement("div");
        descEl.className = "ach-desc";
        descEl.textContent = ACH_DESC[ach.id] ? pick(ACH_DESC[ach.id]) : "";

        const tierEl = document.createElement("div");
        tierEl.className = "ach-tier";
        tierEl.textContent = pick(TIER_NAMES[ach.tier]);
        tierEl.style.color = tierColor;

        info.append(nameEl, descEl, tierEl);
        card.append(iconWrap, info);

        if (!isDone) {
          const lock = document.createElement("div");
          lock.className = "ach-lock";
          lock.innerHTML = '<span class="material-icons">lock</span>';
          card.appendChild(lock);
        } else {
          const check = document.createElement("div");
          check.className = "ach-check";
          check.innerHTML = '<span class="material-icons">check_circle</span>';
          check.style.color = tierColor;
          card.appendChild(check);
        }

        grid.appendChild(card);
      });

      section.appendChild(grid);
      container.appendChild(section);
    });
  }

  /* ---------- Слухачі подій ---------- */
  function init() {
    bumpStat("visit");

    document.addEventListener("pythonrun", () => {
      bumpStat("pyRuns");
      checkAll();
    });

    document.addEventListener("gameplayed", (e) => {
      if (e.detail && e.detail.id) {
        bumpStat("game", e.detail.id);
        checkAll();
      }
    });

    document.addEventListener("recordchange", (e) => {
      if (e.detail) {
        bumpStat("record", { game: e.detail.game, val: e.detail.value });
        checkAll();
      }
    });

    document.addEventListener("routechange", (e) => {
      if (e.detail) {
        bumpStat("route", e.detail);
        checkAll();
      }
    });

    document.addEventListener("langchange", () => {
      const el = document.getElementById("achGrid");
      if (el) render(el);
    });

    document.addEventListener("settingschange", () => {
      checkAll();
    });

    setTimeout(checkAll, 1000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  global.Achievements = { init, render, checkAll, unlock, isUnlocked, getUnlocked, ACHIEVEMENTS, ACH_NAMES, ACH_DESC, TIER_COLORS };
})(window);
