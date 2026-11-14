/* achievements.js — система досягнень з відстеженням прогресу.
   Досягнення зберігаються в localStorage: app.achievements.<user> */
(function (global) {
  const ACH_KEY_PREFIX = "app.achievements.";
  const STATS_KEY = "app.achStats";

  const ALL_GAMES = ["ttt", "snake", "memory", "g2048", "rps", "react", "simon", "mines", "guess"];
  const ALL_ROUTES = ["home", "python", "modules", "course", "tasks", "daily", "projects", "glossary", "exam", "turtle", "constructor", "season", "games", "tools", "feedback", "profile", "settings", "achievements"];
  const tasksTotal = () => (global.Tasks && global.Tasks.count) || 12;
  const courseTotal = () => (global.Course && global.Course.count) || 12;
  const glossTotal = () => (global.Glossary && global.Glossary.count) || 41;
  const examDraw = () => (global.Exam && global.Exam.draw) || 12;
  const turtleLessonsTotal = () => (global.TurtleLab && global.TurtleLab.LESSONS && global.TurtleLab.LESSONS.length) || 10;
  const turtleTasksTotal = () => (global.TurtleLab && global.TurtleLab.TASKS && global.TurtleLab.TASKS.length) || 10;

  /* Нові розділи зберігають прогрес у себе, тому значки читають його напряму —
     так вони відкриваються і для тих, хто все зробив ще до появи значків. */
  function projSteps() {
    try { return Object.keys(((global.Projects && global.Projects.stats()) || {}).steps || {}).length; }
    catch (e) { return 0; }
  }

  function projFinished() {
    try {
      const steps = ((global.Projects && global.Projects.stats()) || {}).steps || {};
      const list = (global.Projects && global.Projects.list()) || [];
      return list.filter((p) => p.steps.every((_, i) => steps[p.id + "-" + (i + 1)])).length;
    } catch (e) { return 0; }
  }

  function projProjects() {
    try { return ((global.Projects && global.Projects.list()) || []).length || 5; }
    catch (e) { return 5; }
  }

  function glossRead() {
    try { return ((global.Glossary && global.Glossary.stats()) || {}).read || 0; }
    catch (e) { return 0; }
  }

  function examState() {
    try { return (global.Exam && global.Exam.stats()) || {}; }
    catch (e) { return {}; }
  }

  function turtleState() {
    try { return (global.TurtleLab && global.TurtleLab.stats()) || {}; }
    catch (e) { return {}; }
  }

  function makerState() {
    try { return (global.Constructor && global.Constructor.stats()) || {}; }
    catch (e) { return {}; }
  }

  function seasonState() {
    try { return (global.Season && global.Season.stats()) || {}; }
    catch (e) { return {}; }
  }

  /* ---------- Визначення досягнень ---------- */
  const ACHIEVEMENTS = [
    { id: "py_first",     ico: "code",          cat: "python",   tier: "bronze",   check: (s) => s.pyRuns >= 1,                       progress: (s) => Math.min(s.pyRuns / 1, 1) },
    { id: "py_10",        ico: "terminal",      cat: "python",   tier: "silver",   check: (s) => s.pyRuns >= 10,                      progress: (s) => Math.min(s.pyRuns / 10, 1) },
    { id: "py_50",        ico: "rocket_launch", cat: "python",   tier: "gold",     check: (s) => s.pyRuns >= 50,                      progress: (s) => Math.min(s.pyRuns / 50, 1) },
    { id: "py_snippet",   ico: "save",          cat: "python",   tier: "bronze",   check: (s) => s.snippets >= 1,                     progress: (s) => Math.min(s.snippets / 1, 1) },

    { id: "game_first",   ico: "sports_esports",cat: "games",    tier: "bronze",   check: (s) => s.gamesPlayed.length >= 1,           progress: (s) => Math.min(s.gamesPlayed.length / 1, 1) },
    { id: "game_5",       ico: "stadia_controller", cat: "games", tier: "silver",  check: (s) => s.gamesPlayed.length >= 5,           progress: (s) => Math.min(s.gamesPlayed.length / 5, 1) },
    { id: "game_all",     ico: "emoji_events",  cat: "games",    tier: "gold",     check: (s) => s.gamesPlayed.length >= 9,           progress: (s) => Math.min(s.gamesPlayed.length / 9, 1) },
    { id: "game_record",  ico: "track_changes", cat: "games",    tier: "bronze",   check: (s) => s.recordGames.length >= 1,           progress: (s) => Math.min(s.recordGames.length / 1, 1) },
    { id: "game_5rec",    ico: "military_tech", cat: "games",    tier: "silver",   check: (s) => s.recordGames.length >= 5,           progress: (s) => Math.min(s.recordGames.length / 5, 1) },

    { id: "snake_20",     ico: "🐍",            cat: "specific", tier: "silver",   check: (s) => (s.records.snake || 0) >= 20,        progress: (s) => Math.min((s.records.snake || 0) / 20, 1) },
    { id: "g2048_500",    ico: "🔢",            cat: "specific", tier: "silver",   check: (s) => (s.records.g2048 || 0) >= 500,       progress: (s) => Math.min((s.records.g2048 || 0) / 500, 1) },
    { id: "react_300",    ico: "⚡",             cat: "specific", tier: "gold",     check: (s) => s.records.react && s.records.react <= 300, progress: (s) => s.records.react ? Math.min(Math.max((600 - s.records.react) / 300, 0), 1) : 0 },
    { id: "simon_5",      ico: "🎨",            cat: "specific", tier: "silver",   check: (s) => (s.records.simon || 0) >= 5,         progress: (s) => Math.min((s.records.simon || 0) / 5, 1) },
    { id: "memory_win",   ico: "🧠",            cat: "specific", tier: "bronze",   check: (s) => s.records.memory != null,            progress: (s) => s.records.memory != null ? 1 : 0 },

    { id: "tool_first",   ico: "build",         cat: "tools",    tier: "bronze",   check: (s) => s.toolsUsed.length >= 1,             progress: (s) => Math.min(s.toolsUsed.length / 1, 1) },
    { id: "tool_calc",    ico: "calculate",     cat: "tools",    tier: "bronze",   check: (s) => s.toolsUsed.includes("calc"),        progress: (s) => s.toolsUsed.includes("calc") ? 1 : 0 },
    { id: "tool_conv",    ico: "straighten",    cat: "tools",    tier: "bronze",   check: (s) => s.toolsUsed.includes("conv"),        progress: (s) => s.toolsUsed.includes("conv") ? 1 : 0 },
    { id: "tool_rand",    ico: "casino",        cat: "tools",    tier: "bronze",   check: (s) => s.toolsUsed.includes("rand"),        progress: (s) => s.toolsUsed.includes("rand") ? 1 : 0 },
    { id: "tool_pwd",     ico: "password",      cat: "tools",    tier: "bronze",   check: (s) => s.toolsUsed.includes("pwd"),         progress: (s) => s.toolsUsed.includes("pwd") ? 1 : 0 },
    { id: "tool_all",     ico: "handyman",      cat: "tools",    tier: "gold",     check: (s) => ["calc", "conv", "rand", "pwd"].every((t) => s.toolsUsed.includes(t)), progress: (s) => ["calc", "conv", "rand", "pwd"].filter((t) => s.toolsUsed.includes(t)).length / 4 },

    { id: "task_first",   ico: "assignment_turned_in", cat: "tasks", tier: "bronze", check: (s) => (s.tasksSolved || []).length >= 1, progress: (s) => Math.min((s.tasksSolved || []).length, 1) },
    { id: "task_5",       ico: "school",          cat: "tasks",    tier: "silver",   check: (s) => (s.tasksSolved || []).length >= 5, progress: (s) => Math.min((s.tasksSolved || []).length / 5, 1) },
    { id: "task_all",     ico: "workspace_premium", cat: "tasks",  tier: "gold",     check: (s) => (s.tasksSolved || []).length >= tasksTotal(), progress: (s) => Math.min((s.tasksSolved || []).length / tasksTotal(), 1) },

    { id: "contest_first",  ico: "flag",   cat: "contest", tier: "bronze", check: (s) => (s.contestsRun || 0) >= 1, progress: (s) => Math.min(s.contestsRun || 0, 1) },
    { id: "contest_5",      ico: "timer",  cat: "contest", tier: "silver", check: (s) => (s.contestsRun || 0) >= 5, progress: (s) => Math.min((s.contestsRun || 0) / 5, 1) },
    { id: "contest_perfect", ico: "stars", cat: "contest", tier: "gold",   check: (s) => (s.contestPerfect || 0) >= 1, progress: (s) => Math.min(s.contestPerfect || 0, 1) },

    { id: "pkg_first",     ico: "inventory_2", cat: "modules", tier: "bronze", check: (s) => (s.packagesInstalled || 0) >= 1, progress: (s) => Math.min((s.packagesInstalled || 0) / 1, 1) },
    { id: "pkg_10",        ico: "deployed_code", cat: "modules", tier: "silver", check: (s) => (s.packagesInstalled || 0) >= 10, progress: (s) => Math.min((s.packagesInstalled || 0) / 10, 1) },

    { id: "course_first",  ico: "menu_book",    cat: "course", tier: "bronze", check: (s) => (s.lessonsDone || 0) >= 1, progress: (s) => Math.min((s.lessonsDone || 0) / 1, 1) },
    { id: "course_5",      ico: "auto_stories", cat: "course", tier: "silver", check: (s) => (s.lessonsDone || 0) >= 5, progress: (s) => Math.min((s.lessonsDone || 0) / 5, 1) },
    { id: "course_all",    ico: "workspace_premium", cat: "course", tier: "gold", check: (s) => (s.lessonsDone || 0) >= courseTotal(), progress: (s) => Math.min((s.lessonsDone || 0) / courseTotal(), 1) },

    { id: "profile_create", ico: "person_add",  cat: "profile",  tier: "bronze",   check: () => !!(global.Profile && global.Profile.current()), progress: () => (global.Profile && global.Profile.current()) ? 1 : 0 },
    { id: "avatar_custom",  ico: "face",        cat: "profile",  tier: "silver",   check: () => { const a = localStorage.getItem("app.avatar") || ""; return a.startsWith("data:"); }, progress: () => { const a = localStorage.getItem("app.avatar") || ""; return a.startsWith("data:") ? 1 : 0; } },
    { id: "bg_custom",      ico: "palette",     cat: "profile",  tier: "silver",   check: () => { const d = localStorage.getItem("app.avatarBg.dark") || ""; const l = localStorage.getItem("app.avatarBg.light") || ""; return (d && d.startsWith("data:")) || (l && l.startsWith("data:")); }, progress: () => { const d = localStorage.getItem("app.avatarBg.dark") || ""; const l = localStorage.getItem("app.avatarBg.light") || ""; return ((d && d.startsWith("data:")) || (l && l.startsWith("data:"))) ? 1 : 0; } },

    { id: "secret_found", ico: "lock_open",     cat: "explore",  tier: "gold",     check: () => localStorage.getItem("app.secretFound") === "1", progress: () => localStorage.getItem("app.secretFound") === "1" ? 1 : 0 },
    { id: "all_routes",   ico: "explore",       cat: "explore",  tier: "silver",   check: (s) => ALL_ROUTES.every((r) => s.routesVisited.includes(r)), progress: (s) => ALL_ROUTES.filter((r) => s.routesVisited.includes(r)).length / ALL_ROUTES.length },
    { id: "night_owl",    ico: "nightlight",    cat: "explore",  tier: "bronze",   check: () => { const h = new Date().getHours(); return h >= 0 && h < 5; }, progress: () => { const h = new Date().getHours(); return (h >= 0 && h < 5) ? 1 : 0; } },

    { id: "visit_3",      ico: "calendar_today",cat: "streak",   tier: "silver",   check: (s) => s.visitDays >= 3,                    progress: (s) => Math.min(s.visitDays / 3, 1) },
    { id: "visit_7",      ico: "date_range",    cat: "streak",   tier: "gold",     check: (s) => s.visitDays >= 7,                    progress: (s) => Math.min(s.visitDays / 7, 1) },

    { id: "daily_first",  ico: "bolt",                   cat: "daily", tier: "bronze", check: (s) => (s.dailyTotal || 0) >= 1,  progress: (s) => Math.min(s.dailyTotal || 0, 1) },
    { id: "daily_7",      ico: "local_fire_department",  cat: "daily", tier: "silver", check: (s) => (s.dailyBest || 0) >= 7,   progress: (s) => Math.min((s.dailyBest || 0) / 7, 1) },
    { id: "daily_30",     ico: "whatshot",               cat: "daily", tier: "gold",   check: (s) => (s.dailyBest || 0) >= 30,  progress: (s) => Math.min((s.dailyBest || 0) / 30, 1) },

    { id: "proj_first",   ico: "design_services", cat: "projects", tier: "bronze", check: () => projSteps() >= 1,                          progress: () => Math.min(projSteps() / 1, 1) },
    { id: "proj_all",     ico: "architecture",    cat: "projects", tier: "gold",   check: () => projFinished() >= projProjects(),          progress: () => Math.min(projFinished() / projProjects(), 1) },
    { id: "gloss_all",    ico: "book",            cat: "glossary", tier: "silver", check: () => glossRead() >= glossTotal(),               progress: () => Math.min(glossRead() / glossTotal(), 1) },
    { id: "exam_pass",    ico: "fact_check",      cat: "exam",     tier: "silver", check: () => (examState().passed || 0) >= 1,            progress: () => Math.min((examState().passed || 0) / 1, 1) },
    { id: "exam_perfect", ico: "grade",           cat: "exam",     tier: "gold",   check: () => (examState().best || 0) >= examDraw(),     progress: () => Math.min((examState().best || 0) / examDraw(), 1) },
    { id: "backup_first", ico: "cloud_upload",    cat: "profile",  tier: "bronze", check: () => !!localStorage.getItem("app.backupLast"),  progress: () => (localStorage.getItem("app.backupLast") ? 1 : 0) },

    { id: "turtle_first",  ico: "pets",      cat: "turtle", tier: "bronze", check: () => turtleState().lessonsRun >= 1,                       progress: () => Math.min((turtleState().lessonsRun || 0) / 1, 1) },
    { id: "turtle_school", ico: "palette",   cat: "turtle", tier: "silver", check: () => turtleLessonsTotal() > 0 && turtleState().lessonsRun >= turtleLessonsTotal(), progress: () => Math.min((turtleState().lessonsRun || 0) / turtleLessonsTotal(), 1) },
    { id: "turtle_art",    ico: "auto_awesome", cat: "turtle", tier: "gold", check: () => turtleTasksTotal() > 0 && turtleState().solved >= turtleTasksTotal(), progress: () => Math.min((turtleState().solved || 0) / turtleTasksTotal(), 1) },

    { id: "maker_first",   ico: "build",     cat: "maker",  tier: "bronze", check: () => makerState().own >= 1,                               progress: () => Math.min((makerState().own || 0) / 1, 1) },
    { id: "maker_five",    ico: "construction", cat: "maker", tier: "silver", check: () => (makerState().own || 0) >= 5,                     progress: () => Math.min((makerState().own || 0) / 5, 1) },
    { id: "maker_import",  ico: "hub",       cat: "maker",  tier: "bronze", check: () => (makerState().yard || 0) >= 1,                       progress: () => Math.min((makerState().yard || 0) / 1, 1) },

    { id: "season_first",  ico: "trophy",    cat: "season", tier: "bronze", check: () => (seasonState().xp || 0) >= 100,                     progress: () => Math.min((seasonState().xp || 0) / 100, 1) },
    { id: "season_league", ico: "military_tech", cat: "season", tier: "silver", check: () => (seasonState().promotions || 0) >= 1,            progress: () => Math.min((seasonState().promotions || 0) / 1, 1) },
    { id: "season_streak", ico: "local_fire_department", cat: "season", tier: "gold", check: () => (seasonState().days || 0) >= 21,            progress: () => Math.min((seasonState().days || 0) / 21, 1) }
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
    tools:    { uk: "Інструменти", en: "Tools",  tr: "Araçlar" },
    tasks:    { uk: "Задачі",     en: "Tasks",    tr: "Görevler" },
    contest:  { uk: "Тренажер",   en: "Trainer",  tr: "Antrenör" },
    modules:  { uk: "Модулі",     en: "Modules",   tr: "Modüller" },
    course:   { uk: "Курс",       en: "Course",    tr: "Kurs" },
    profile:  { uk: "Профіль",  en: "Profile",   tr: "Profil" },
    explore:  { uk: "Дослідник",en: "Explorer",  tr: "Kaşif" },
    streak:   { uk: "Серії",    en: "Streaks",   tr: "Seriler" },
    daily:    { uk: "Щоденний виклик", en: "Daily challenge", tr: "Günlük görev" },
    projects: { uk: "Проєкти",  en: "Projects",  tr: "Projeler" },
    glossary: { uk: "Словник",  en: "Glossary",  tr: "Sözlük" },
    exam:     { uk: "Іспит",    en: "Exam",      tr: "Sınav" },
    turtle:   { uk: "Черепашка", en: "Turtle",   tr: "Kaplumbağa" },
    maker:    { uk: "Конструктор", en: "Constructor", tr: "Kurucu" },
    season:   { uk: "Сезон",    en: "Season",    tr: "Sezon" }
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
    tool_first:     { uk: "Майстер",             en: "Handyman",           tr: "Tamirci" },
    tool_calc:      { uk: "Рахівник",            en: "Calculator",         tr: "Hesapçı" },
    tool_conv:      { uk: "Конвертер",           en: "Converter",          tr: "Dönüştürücü" },
    tool_rand:      { uk: "Випадковість",        en: "Randomizer",         tr: "Rastgeleci" },
    tool_pwd:       { uk: "Криптограф",          en: "Cryptographer",      tr: "Kriptograf" },
    tool_all:       { uk: "Універсал",           en: "Renaissance",        tr: "Rönesans" },
    task_first:     { uk: "Перша задача",        en: "First Task",         tr: "İlk Görev" },
    task_5:         { uk: "Розв'язувач",         en: "Problem Solver",     tr: "Problem Çözen" },
    task_all:       { uk: "Олімпієць",           en: "Olympiad Star",      tr: "Olimpiyat Yıldızı" },
    contest_first:  { uk: "Перший тур",          en: "First Round",        tr: "İlk Tur" },
    contest_5:      { uk: "Тренування",          en: "In Training",        tr: "Antrenmanda" },
    contest_perfect:{ uk: "Ідеальний тур",       en: "Perfect Round",      tr: "Kusursuz Tur" },
    pkg_first:      { uk: "Перший пакет",        en: "First Package",      tr: "İlk Paket" },
    pkg_10:         { uk: "Колекціонер",         en: "Collector",          tr: "Koleksiyoncu" },
    course_first:   { uk: "Перший урок",         en: "First Lesson",       tr: "İlk Ders" },
    course_5:       { uk: "Учень",               en: "Student",            tr: "Öğrenci" },
    course_all:     { uk: "Випускник",           en: "Graduate",           tr: "Mezun" },
    profile_create: { uk: "Ласкаво просимо",     en: "Welcome",            tr: "Hoş Geldin" },
    avatar_custom:  { uk: "Стиляга",             en: "Trendsetter",        tr: "Modacı" },
    bg_custom:      { uk: "Естет",               en: "Aesthete",           tr: "Estet" },
    secret_found:   { uk: "Дослідник",           en: "Explorer",           tr: "Kaşif" },
    all_routes:     { uk: "Допитливий",          en: "Curious Mind",       tr: "Meraklı" },
    night_owl:      { uk: "Нічна сова",          en: "Night Owl",          tr: "Gece Kuşu" },
    visit_3:        { uk: "Стабільний",          en: "Consistent",         tr: "Tutarlı" },
    visit_7:        { uk: "Тижневик",            en: "Week Warrior",       tr: "Hafta Savaşçısı" },
    daily_first:    { uk: "Перший виклик",       en: "First Challenge",    tr: "İlk Görev" },
    daily_7:        { uk: "Тиждень поспіль",     en: "Week Streak",        tr: "Haftalık Seri" },
    daily_30:       { uk: "Місяць вогню",        en: "Month of Fire",      tr: "Ateş Ayı" },
    proj_first:     { uk: "Перший проєкт",       en: "First Project",      tr: "İlk Proje" },
    proj_all:       { uk: "Архітектор",          en: "Architect",          tr: "Mimar" },
    gloss_all:      { uk: "Лексикограф",         en: "Lexicographer",      tr: "Sözlük Ustası" },
    exam_pass:      { uk: "Іспит складено",      en: "Exam Passed",        tr: "Sınav Geçildi" },
    exam_perfect:   { uk: "Ідеальний іспит",     en: "Perfect Exam",       tr: "Kusursuz Sınav" },
    backup_first:   { uk: "Резервна копія",      en: "Backup Created",     tr: "Yedek Alındı" },
    turtle_first:   { uk: "Перша лінія",         en: "First Line",         tr: "İlk Çizgi" },
    turtle_school:  { uk: "Художник",            en: "Turtle Artist",      tr: "Kaplumbağa Sanatçısı" },
    turtle_art:     { uk: "Мальовник",           en: "Pattern Maker",      tr: "Desen Ustası" },
    maker_first:    { uk: "Перша цеглина",       en: "First Block",        tr: "İlk Tuğla" },
    maker_five:     { uk: "Конструктор",         en: "Task Builder",       tr: "Görev Kurucusu" },
    maker_import:   { uk: "Гість із двору",      en: "Yard Guest",         tr: "Bahçe Misafiri" },
    season_first:   { uk: "Перші очки",          en: "First Points",       tr: "İlk Puanlar" },
    season_league:  { uk: "Виліт у лігу",        en: "League Promotion",   tr: "Lige Yükselme" },
    season_streak:  { uk: "Три тижні в грі",     en: "Three Weeks In",     tr: "Üç Haftadır Oyunda" }
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
    tool_first:     { uk: "Використай перший інструмент",          en: "Use your first tool",                 tr: "İlk aracını kullan" },
    tool_calc:      { uk: "Використай калькулятор",                en: "Use the calculator",                  tr: "Hesap makinesini kullan" },
    tool_conv:      { uk: "Використай конвертер величин",          en: "Use the unit converter",              tr: "Birim dönüştürücüyü kullan" },
    tool_rand:      { uk: "Використай генератор випадкових чисел", en: "Use the random generator",            tr: "Rastgele sayı oluşturucuyu kullan" },
    tool_pwd:       { uk: "Згенеруй пароль",                       en: "Generate a password",                 tr: "Parola oluştur" },
    tool_all:       { uk: "Використай усі 4 інструменти",          en: "Use all 4 tools",                     tr: "Tüm 4 aracı kullan" },
    task_first:     { uk: "Розв'яжи першу задачу",                 en: "Solve your first task",               tr: "İlk görevini çöz" },
    task_5:         { uk: "Розв'яжи 5 задач",                      en: "Solve 5 tasks",                       tr: "5 görev çöz" },
    task_all:       { uk: "Розв'яжи всі задачі з банку",           en: "Solve every task in the bank",        tr: "Bankadaki tüm görevleri çöz" },
    contest_first:  { uk: "Зіграй перший олімпіадний тур",         en: "Complete your first olympiad round",  tr: "İlk olimpiyat turunu tamamla" },
    contest_5:      { uk: "Зіграй 5 олімпіадних турів",            en: "Complete 5 olympiad rounds",          tr: "5 olimpiyat turu tamamla" },
    contest_perfect:{ uk: "Набери 100% балів у турі",              en: "Score 100% of the points in a round", tr: "Bir turda puanların %100'ünü topla" },
    pkg_first:      { uk: "Встанови перший пакет із каталогу",      en: "Install your first package from the catalog", tr: "Katalogdan ilk paketini yükle" },
    pkg_10:         { uk: "Встанови 10 пакетів",                    en: "Install 10 packages",                tr: "10 paket yükle" },
    course_first:   { uk: "Пройди перший урок курсу",               en: "Complete your first course lesson",   tr: "İlk kurs dersini tamamla" },
    course_5:       { uk: "Пройди 5 уроків курсу",                  en: "Complete 5 course lessons",           tr: "5 kurs dersi tamamla" },
    course_all:     { uk: "Пройди весь курс Python",                en: "Complete the entire Python course",   tr: "Tüm Python kursunu tamamla" },
    profile_create: { uk: "Створи акаунт",                         en: "Create an account",                   tr: "Hesap oluştur" },
    avatar_custom:  { uk: "Завантаж власний аватар",               en: "Upload a custom avatar",              tr: "Özel avatar yükle" },
    bg_custom:      { uk: "Завантаж власний фон профілю",          en: "Upload a custom profile background",  tr: "Özel profil arka planı yükle" },
    secret_found:   { uk: "Знайди секретну кімнату",               en: "Find the secret room",                tr: "Gizli odayı bul" },
    all_routes:     { uk: "Відвідай усі розділи сайту",            en: "Visit all site sections",             tr: "Tüm site bölümlerini ziyaret et" },
    night_owl:      { uk: "Зайди на сайт після опівночі",          en: "Visit the site after midnight",       tr: "Gece yarısından sonra siteyi ziyaret et" },
    visit_3:        { uk: "Заходь 3 дні поспіль",                  en: "Visit 3 days in a row",               tr: "3 gün üst üste ziyaret et" },
    visit_7:        { uk: "Заходь 7 днів поспіль",                 en: "Visit 7 days in a row",               tr: "7 gün üst üste ziyaret et" },
    daily_first:    { uk: "Розв'яжи щоденний виклик",              en: "Solve a daily challenge",             tr: "Günlük görevi çöz" },
    daily_7:        { uk: "Серія з 7 щоденних викликів",           en: "Keep a streak of 7 daily challenges", tr: "7 günlük görev serisi yap" },
    daily_30:       { uk: "Серія з 30 щоденних викликів",          en: "Keep a streak of 30 daily challenges",tr: "30 günlük görev serisi yap" },
    proj_first:     { uk: "Виконай перший крок будь-якого проєкту", en: "Complete the first step of any project", tr: "Herhangi bir projenin ilk adımını tamamla" },
    proj_all:       { uk: "Доведи до кінця всі проєкти",           en: "Finish every project to the last step", tr: "Tüm projeleri son adıma kadar bitir" },
    gloss_all:      { uk: "Перечитай увесь словник Python",        en: "Read every card of the Python glossary", tr: "Python sözlüğündeki her kartı oku" },
    exam_pass:      { uk: "Склади іспит на 70% і більше",          en: "Pass the exam with 70% or better", tr: "Sınavı %70 veya üzerinde geç" },
    exam_perfect:   { uk: "Склади іспит без жодної помилки",       en: "Pass the exam without a single mistake", tr: "Sınavı tek hatasız geç" },
    backup_first:   { uk: "Вивантаж резервну копію прогресу",      en: "Export a backup of your progress", tr: "İlerlemeni yedek olarak dışa aktar" },
    turtle_first:   { uk: "Пройди перший урок черепашки",          en: "Finish your first turtle lesson", tr: "İlk kaplumbağa dersini tamamla" },
    turtle_school:  { uk: "Пройди всі уроки черепашки",            en: "Finish every turtle lesson", tr: "Tüm kaplumbağa derslerini bitir" },
    turtle_art:     { uk: "Розв'яжи всі завдання черепашки",       en: "Solve every turtle task", tr: "Tüm kaplumbağa görevlerini çöz" },
    maker_first:    { uk: "Створи першу власну задачу",            en: "Create your first own task", tr: "İlk kendi görevini oluştur" },
    maker_five:     { uk: "Створи п'ять власних задач",            en: "Create five own tasks", tr: "Beş kendi görevi oluştur" },
    maker_import:   { uk: "Додай у двір задачу за кодом друга",    en: "Add a friend's task to the yard by invite code", tr: "Arkadaşının görevini davet koduyla bahçeye ekle" },
    season_first:   { uk: "Набери 100 XP у поточному сезоні",      en: "Earn 100 XP in the current season", tr: "Bu sezonda 100 XP topla" },
    season_league:  { uk: "Підвищся хоча б в одну лігу",           en: "Get promoted to at least one league", tr: "En az bir lige yüksel" },
    season_streak:  { uk: "Май 21 день із сезонним бонусом",       en: "Reach 21 bonus days in a season", tr: "Bir sezonda 21 bonus güne ulaş" }
  };

  const lang = () => (global.I18n ? global.I18n.lang : "uk");
  const pick = (o) => (global.I18n ? global.I18n.localize(o) : (o.uk || o.en));

  /* ---------- Статистика ---------- */
  function getStats() {
    try { return JSON.parse(localStorage.getItem(STATS_KEY)) || defaultStats(); }
    catch { return defaultStats(); }
  }

  function defaultStats() {
    return { pyRuns: 0, snippets: 0, gamesPlayed: [], records: {}, recordGames: [], routesVisited: [], visitDates: [], toolsUsed: [], tasksSolved: [], contestsRun: 0, contestPerfect: 0, contestBest: 0, packagesInstalled: 0, lessonsDone: 0, dailyTotal: 0, dailyBest: 0 };
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
    else if (key === "tool" && value && !s.toolsUsed.includes(value)) s.toolsUsed.push(value);
    else if (key === "task" && value) {
      if (!Array.isArray(s.tasksSolved)) s.tasksSolved = [];
      if (!s.tasksSolved.includes(value)) s.tasksSolved.push(value);
    }
    else if (key === "contest" && value) {
      s.contestsRun = (s.contestsRun || 0) + 1;
      if (value.perfect) s.contestPerfect = (s.contestPerfect || 0) + 1;
      if ((value.score || 0) > (s.contestBest || 0)) s.contestBest = value.score;
    }
    else if (key === "package") s.packagesInstalled = (s.packagesInstalled || 0) + 1;
    else if (key === "lesson" && value) s.lessonsDone = Math.max(s.lessonsDone || 0, value.done || 0);
    else if (key === "daily" && value) {
      s.dailyTotal = Math.max(s.dailyTotal || 0, value.total || 0);
      s.dailyBest = Math.max(s.dailyBest || 0, value.best || 0);
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

    const cats = ["python", "games", "specific", "tools", "tasks", "contest", "modules", "course", "projects", "glossary", "exam", "turtle", "maker", "season", "profile", "explore", "streak", "daily"];
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

        if (!isDone && ach.progress) {
          const s = getStats();
          s.visitDays = getVisitDays();
          let pct = 0;
          try { pct = Math.round(ach.progress(s) * 100); } catch { pct = 0; }
          if (pct > 0 && pct < 100) {
            const progressWrap = document.createElement("div");
            progressWrap.className = "ach-progress";
            const bar = document.createElement("div");
            bar.className = "ach-progress-bar";
            bar.style.width = pct + "%";
            bar.style.background = tierColor;
            const label = document.createElement("span");
            label.className = "ach-progress-label";
            label.textContent = pct + "%";
            progressWrap.append(bar, label);
            info.appendChild(progressWrap);
          }
        }

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
  function rerenderIfActive() {
    const view = document.getElementById("view-achievements");
    if (view && view.classList.contains("active")) {
      const el = document.getElementById("achGrid");
      if (el) render(el);
    }
  }

  function init() {
    bumpStat("visit");

    document.addEventListener("pythonrun", () => {
      bumpStat("pyRuns");
      checkAll();
      rerenderIfActive();
    });

    document.addEventListener("gameplayed", (e) => {
      if (e.detail && e.detail.id) {
        bumpStat("game", e.detail.id);
        checkAll();
        rerenderIfActive();
      }
    });

    document.addEventListener("recordchange", (e) => {
      // stat: true — особистий показник (напр. «Власні програми»), не ігровий рекорд.
      if (e.detail && !e.detail.stat) {
        bumpStat("record", { game: e.detail.game, val: e.detail.value });
        checkAll();
        rerenderIfActive();
      }
    });

    document.addEventListener("snippetsaved", () => {
      bumpStat("snippets");
      checkAll();
      rerenderIfActive();
    });

    document.addEventListener("routechange", (e) => {
      if (e.detail) {
        bumpStat("route", e.detail);
        checkAll();
        rerenderIfActive();
      }
    });

    document.addEventListener("tooluse", (e) => {
      if (e.detail && e.detail.tool) {
        bumpStat("tool", e.detail.tool);
        checkAll();
        rerenderIfActive();
      }
    });

    document.addEventListener("tasksolved", (e) => {
      if (e.detail && e.detail.id) {
        bumpStat("task", e.detail.id);
        checkAll();
        rerenderIfActive();
      }
    });

    document.addEventListener("contestdone", (e) => {
      if (e.detail) {
        bumpStat("contest", e.detail);
        checkAll();
        rerenderIfActive();
      }
    });

    document.addEventListener("dailydone", (e) => {
      if (e.detail) {
        bumpStat("daily", e.detail);
        checkAll();
        rerenderIfActive();
      }
    });

    document.addEventListener("packageinstalled", () => {
      bumpStat("package");
      checkAll();
      rerenderIfActive();
    });

    document.addEventListener("lessondone", (e) => {
      if (e.detail) {
        bumpStat("lesson", e.detail);
        checkAll();
        rerenderIfActive();
      }
    });

    /* Проєкти, словник й іспит тримають свій прогрес у власних ключах —
       тут достатньо лише перерахувати значки. */
    ["projectdone", "glossaryread", "examdone"].forEach((ev) => {
      document.addEventListener(ev, () => {
        checkAll();
        rerenderIfActive();
      });
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
