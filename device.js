/* device.js — при КОЖНОМУ вході питає, з якого пристрою зайшли.
   Сайт сам визначає пристрій, позначає правильний варіант як «рекомендовано»
   і НЕ дає вибрати чужий: показує «Доступ закрито».
   ПК/планшет -> класична панель, телефон -> пігулка,
   проєктор/дошка -> класична панель + збільшений вміст (клас projector-mode).
   Кнопка «Проєктор» завжди клікабельна: підключену дошку браузер не впізнає.
   Сам вибір проєктора зберігається, решта відповідей — ні. */
(function (global) {
  let markAnswered;
  const answered = new Promise((r) => { markAnswered = r; });

  const STR = {
    uk: {
      q: "З якого пристрою ви заходите?",
      hint: "Сайт уже визначив твій пристрій — обери позначений варіант.",
      pc: "ПК / ноутбук",
      phone: "Телефон / планшет",
      proj: "Проєктор / дошка",
      projHint: "Проєктор або інтерактивна дошка в класі — інтерфейс стане великим, щоб було видно з останньої парти.",
      rec: "рекомендовано",
      back: "Назад",
      formQ: "З чого саме заходиш?",
      formHint: "Ноутбук і стаціонарний ПК працюють по-різному: ноутбук сповільнюється від батареї й частіше дублює екран на дошку.",
      desktop: "Стаціонарний ПК",
      desktopHint: "Монітор, клавіатура, живлення від розетки. Швидкодію перевіримо один раз.",
      laptop: "Ноутбук",
      laptopHint: "Може працювати від батареї — стежимо за швидкістю уважніше. Саме до нього під'єднують проєктор.",
      powerQ: "Який у тебе комп'ютер?",
      powerHint: "Орієнтуйся на комплектуючі — далі сайт сам вирішить, що вимкнути, щоб не гальмувало.",
      strong: "Потужний",
      strongHint: "Сучасні комплектуючі: 4 і більше ядер, 8 ГБ пам'яті й більше, SSD, окрема відеокарта.",
      weak: "Слабкий",
      weakHint: "Старі комплектуючі: 2 ядра, 2–4 ГБ пам'яті, вбудована графіка GMA чи HD 4000, HDD-диск.",
      unknown: "Не знаю",
      unknownHint: "Сайт виміряє швидкість сам і спростить інтерфейс, якщо залізо не тягне.",
      osQ: "Яка на ньому система?",
      osHint: "Відповідь підлаштує відступи під «чубик», панель адреси та масштаб тексту.",
      android: "Android",
      androidHint: "Samsung, Xiaomi, Redmi, Nokia… — Chrome чи Samsung Internet.",
      ios: "iOS",
      iosHint: "iPhone, iPad — Safari: своя панель адреси, свій чубик і своє зумлення полів.",
      probe: "Перевірити, чи підʼєднано проєктор",
      probeBusy: "Перевіряю…",
      probeFound: "Знайшов другий екран — увімкнув великий інтерфейс",
      probeNone: "Інших екранів браузер не бачить",
      probeDenied: "Дозволу на список екранів немає — обери вручну",
      probeNoapi: "Цей браузер не вміє шукати екрани — обери вручну",
      offer: "Схоже, підʼєднали проєктор або дошку",
      offerOn: "Увімкнути великий інтерфейс",
      offerNo: "Не зараз",
      denied: "Доступ закрито",
      deniedPc: "Ти зайшов з ПК або планшета — мобільна версія тут недоступна.",
      deniedPhone: "Ти зайшов з телефона — версія для ПК тут недоступна."
    },
    en: {
      q: "Which device are you using?",
      hint: "The site already detected your device — pick the marked option.",
      pc: "PC / laptop",
      phone: "Phone / tablet",
      proj: "Projector / board",
      projHint: "A projector or interactive whiteboard in class — the interface grows so the last desk can read it.",
      rec: "recommended",
      back: "Back",
      formQ: "Which one are you on right now?",
      formHint: "A laptop and a desktop behave differently: a laptop slows down on battery and more often mirrors its screen to a board.",
      desktop: "Desktop PC",
      desktopHint: "Monitor, keyboard, plugged into the wall. We check the speed once.",
      laptop: "Laptop",
      laptopHint: "May run on battery, so we watch the speed more closely. This is what gets connected to a projector.",
      powerQ: "How strong is your computer?",
      powerHint: "Go by the parts — the site decides on its own what to switch off so nothing lags.",
      strong: "Powerful",
      strongHint: "Modern parts: 4+ cores, 8GB of memory or more, SSD, separate graphics card.",
      weak: "Weak",
      weakHint: "Old parts: 2 cores, 2-4GB of memory, integrated GMA or HD 4000 graphics, spinning HDD.",
      unknown: "No idea",
      unknownHint: "The site measures its own speed and simplifies the interface if the machine can't cope.",
      osQ: "Which system does it run?",
      osHint: "The answer adjusts the notch padding, the address bar and the text scaling.",
      android: "Android",
      androidHint: "Samsung, Xiaomi, Redmi, Nokia... — Chrome or Samsung Internet.",
      ios: "iOS",
      iosHint: "iPhone, iPad — Safari: its own address bar, its own notch and its own field zooming.",
      probe: "Check whether a projector is connected",
      probeBusy: "Checking…",
      probeFound: "Found a second screen — switched to the large interface",
      probeNone: "The browser sees no other screen",
      probeDenied: "No permission for the screen list — choose manually",
      probeNoapi: "This browser cannot look up screens — choose manually",
      offer: "Looks like a projector or board is now connected",
      offerOn: "Turn on the large interface",
      offerNo: "Not now",
      denied: "Access denied",
      deniedPc: "You are on a PC or tablet — the mobile version is not available here.",
      deniedPhone: "You are on a phone — the PC version is not available here."
    },
    tr: {
      q: "Hangi cihazdan giriyorsunuz?",
      hint: "Site cihazını zaten algıladı — işaretli seçeneği seç.",
      pc: "PC / dizüstü",
      phone: "Telefon / tablet",
      proj: "Projeksiyon / tahta",
      projHint: "Sınıfta projeksiyon veya akıllı tahta varsa seç — arayüz büyür, son sıradan da okunur.",
      rec: "önerilen",
      back: "Geri",
      formQ: "Şu anda hangisini kullanıyorsun?",
      formHint: "Dizüstü ile masaüstü farklı çalışır: dizüstü pilde yavaşlar ve ekranını tahtaya yansıtma ihtimali daha yüksek.",
      desktop: "Masaüstü PC",
      desktopHint: "Monitör, klavye, prizden güç alıyor. Hızı bir kez ölçeriz.",
      laptop: "Dizüstü",
      laptopHint: "Pilden çalışabilir, o yüzden hizi daha yakından izleriz. Projeksiyonu da buna bağlarlar.",
      powerQ: "Bilgisayarın ne kadar güçlü?",
      powerHint: "Parçalarına göre seç — gerisini site kendisi kararlaştırır, ne kapanacak.",
      strong: "Güçlü",
      strongHint: "Yeni parçalar: 4+ çekirdek, 8GB ve üzeri bellek, SSD, ayrı ekran kartı.",
      weak: "Zayıf",
      weakHint: "Eski parçalar: 2 çekirdek, 2-4GB bellek, tümleşik GMA veya HD 4000 grafik, sabit disk.",
      unknown: "Bilmiyorum",
      unknownHint: "Site kendi hızını ölçer; bilgisayar yetişemiyorsa arayüzü sadeleştirir.",
      osQ: "Üzerinde hangi sistem var?",
      osHint: "Cevap çentik boşluğunu, adres çubuğunu ve yazı ölçeğini ayarlar.",
      android: "Android",
      androidHint: "Samsung, Xiaomi, Redmi, Nokia... — Chrome veya Samsung Internet.",
      ios: "iOS",
      iosHint: "iPhone, iPad — Safari: kendi adres çubuğu, kendi çentiği, kendi alan yakınlaştırması.",
      probe: "Projeksiyon bağlı mı, kontrol et",
      probeBusy: "Kontrol ediliyor…",
      probeFound: "İkinci ekran bulundu — arayüz büyütüldü",
      probeNone: "Tarayıcı başka ekran görmüyor",
      probeDenied: "Ekran listesi izni yok — elle seç",
      probeNoapi: "Bu tarayıcı ekranları sayamıyor — elle seç",
      offer: "Projeksiyon veya tahta yeni bağlanmış gibi",
      offerOn: "Büyük arayüzü aç",
      offerNo: "Şimdi değil",
      denied: "Erişim kapalı",
      deniedPc: "PC veya tabletten giriyorsun — mobil sürüm burada kullanılamaz.",
      deniedPhone: "Telefondan giriyorsun — PC sürümü burada kullanılamaz."
    }
  };
  const L = () => STR[global.I18n ? global.I18n.lang : "uk"] || STR.uk;

  function mq(q) {
    try { return !!(global.matchMedia && global.matchMedia(q).matches); }
    catch (e) { return false; }
  }

  /* Інтерактивна дошка/проєкторна панель: лише дотик, без миші, і дуже великий
     екран у звичайних пікселях (1920×1080 при dpr 1). Планшети стільки не мають. */
  function isBoard() {
    const nav = global.navigator || {};
    const ua = nav.userAgent || "";
    if (/SmartBoard|Newline|Promethean|Elanders|ViewBoard|IFP|TouchPanel/i.test(ua)) return true;
    const coarse = mq("(pointer: coarse)");
    const fine = mq("(pointer: fine)");
    const sc = global.screen || {};
    const big = (sc.width || 0) >= 1920 || (sc.height || 0) >= 1080 && (sc.width || 0) >= 1600;
    return !!(coarse && !fine && big && (global.devicePixelRatio || 1) <= 1.6);
  }
  /* Butta «Проєктор» можна натиснути завжди: ноутбук з підключеною дошкою
     браузер від ноутбука не відрізнить — лише вчитель знає, як він екранує. */
  function isProjecting() {
    try { return !!(global.screen && global.screen.isExtended); } catch (e) { return false; }
  }

  /* ---------- Чи йде картинка на проєктор / дошку ----------
     Окремий сигнал нічого не вартий: ноутбук, що ДУБЛЮЄ екран на проєктор,
     виглядає рівно як ноутбук без нього. Тому збираємо незалежні ознаки й
     вішаємо «рекомендовано», лише коли їх набралось кілька. */
  const PROJ_RES = [
    [1024, 768], [800, 600], [640, 480], [1152, 864],
    [1400, 1050], [1280, 1024], [1024, 600], [1280, 800]
  ];

  function desktopUA() {
    const ua = (global.navigator && global.navigator.userAgent) || "";
    return !/Android|iPhone|iPad|iPod|Mobile|Silk|Opera Mini/i.test(ua);
  }

  function signals() {
    const sc = global.screen || {};
    const nav = global.navigator || {};
    const keys = [];
    let score = 0;
    const add = (k, w) => { score += w; keys.push(k); };

    if (isBoard()) add("board", 3);
    if (/SmartBoard|Newline|Promethean|Elanders|ViewBoard|IFP|TouchPanel/i.test(nav.userAgent || "")) add("brand", 3);
    /* Chrome 131+ чесно каже про другий екран. Його «ні» важливе лише коли
       більше нічого не підказує: проєктор, що ЗАМІНИВ екран ноутбука, —
       це одна роздільна здатність 1024×768, і тоді isExtended хибно каже «ні». */
    if (sc.isExtended === true) add("second", 3);
    const afterSecond = keys.length;
    /* Вікно на вторинному екрані — працює навіть на дуже старих движках */
    try {
      if ((sc.availLeft || 0) !== 0 || (sc.availTop || 0) > 0) add("offset", 2);
    } catch (e) {}
    const W = sc.width || 0, H = sc.height || 0;
    if (desktopUA() && W && H) {
      for (let i = 0; i < PROJ_RES.length; i++) {
        if (PROJ_RES[i][0] === W && PROJ_RES[i][1] === H) { add("res", 2); break; }
      }
      const r = W / H;
      /* 4:3 і 5:4 ноутбук із панеллю не вміє — це або проєктор, або стара дошка */
      if ((Math.abs(r - 4 / 3) < .02 || Math.abs(r - 5 / 4) < .02) && W <= 1600) add("ratio", 1);
    }
    if (desktopUA() && (nav.maxTouchPoints || 0) > 0 && W >= 1920) add("touchbig", 1);
    if (sc.colorDepth && sc.colorDepth < 24) add("depth", 1);
    if (sc.isExtended === false && keys.length === afterSecond) score -= 3;
    return { score: score, keys: keys };
  }

  function projLikely() { return signals().score >= 3; }
  function projSure() { return signals().score >= 5; }

  /* Другий екран через getScreenDetails: браузер сам не питає дозволу, тому
     робимо це кнопкою — інакше проєктор у режимі дублювання не видно ніяк. */
  function probeScreens(done) {
    const nav = global.navigator || {};
    if (typeof nav.getScreenDetails !== "function") { done("noapi"); return; }
    try {
      nav.getScreenDetails().then((d) => {
        const extra = (d && d.screens ? [].slice.call(d.screens) : []).filter((s) => !s.isPrimary);
        done(extra.length ? "found" : "none");
      }).catch(() => done("denied"));
    } catch (e) { done("denied"); }
  }

  /* Авто-визначення: «projector», «phone» або «pc» (планшет рахуємо як ПК) */
  function detect() {
    const nav = global.navigator || {};
    const ua = nav.userAgent || "";
    const maxTP = nav.maxTouchPoints || 0;
    const coarse = mq("(pointer: coarse)");
    const fine = mq("(pointer: fine)");

    if (isBoard() || projSure()) return "projector";

    const tabletUA = /iPad|Tablet|PlayBook|Silk/i.test(ua) ||
                     (/Android/i.test(ua) && !/Mobile/i.test(ua));
    const ipadOS = /Macintosh/i.test(ua) && maxTP > 1;   // iPadOS 13+ прикидається Маком
    if (tabletUA || ipadOS) return "pc";

    const phoneUA = /iPhone|iPod|Windows Phone|IEMobile|BlackBerry|webOS|Opera Mini/i.test(ua) ||
                    (/Android/i.test(ua) && /Mobile/i.test(ua));
    if (phoneUA) return "phone";

    if (coarse && !fine) return "phone";   // лише дотик, без миші -> телефон
    return "pc";
  }

  function applyDesign(kind) {
    if (!global.Settings) return;
    global.Settings.set("deviceKind", kind);
    global.Settings.set("navDesign", kind === "phone" ? "pill" : "classic");
  }

  /* Масштаб проєктора рахуємо від ширини вікна, а не ставимо навмання:
     1920 на дошці дає дрібний текст, а 1024×768 — і так великий, і там
     зайвий зум лише забирає місце та змушує гортати посеред уроку. */
  const PROJ_WORK_W = 1350;          // скільки CSS-пікселів лишаємо «в роботі»
  const PROJ_MIN = 1, PROJ_MAX = 1.45;

  function projScale() {
    const z = (global.innerWidth || 1280) / PROJ_WORK_W;
    return Math.round(Math.min(PROJ_MAX, Math.max(PROJ_MIN, z)) * 100) / 100;
  }

  /* CSS zoom є в Chrome/Safari від завжди, але у Firefox лише від 126 (2024).
     Шкільний ПК на Windows 7 з Firefox ESR 102/115 — саме той випадок, коли
     «збільшити інтерфейс» мовчки провалюється. Тоді масштабуємо transform. */
  function hasZoom() {
    try {
      if (global.CSS && global.CSS.supports) return global.CSS.supports("zoom", "1.2");
    } catch (e) {}
    const d = document.createElement("div");
    d.style.zoom = "1.2";
    return !!d.style.zoom;
  }

  /* Android чи iOS: відповідь з діалогу має пріоритет, бо на iPhone Safari
     прикидається Macintosh і сам по собі не впізнається надійно. */
  function resolveOs(choice) {
    if (choice === "android" || choice === "ios") return choice;
    const nav = global.navigator || {};
    const ua = nav.userAgent || "";
    if (/iPhone|iPad|iPod|iPadOS/i.test(ua)) return "ios";
    if (/Macintosh/i.test(ua) && (nav.maxTouchPoints || 0) > 1) return "ios";
    if (/Android/i.test(ua)) return "android";
    return "auto";
  }

  function applyOs() {
    if (!document.body) return "auto";
    const chosen = global.Settings && global.Settings.get ? global.Settings.get("mobileOs") : "auto";
    const os = resolveOs(chosen);
    document.body.dataset.mos = os;
    return os;
  }

  function applyScale() {
    const isProj = !!(global.Settings && global.Settings.get &&
                      global.Settings.get("deviceKind") === "projector");
    const z = isProj ? projScale() : 1;
    document.documentElement.style.setProperty("--proj-scale", String(z));
    if (document.body) document.body.classList.toggle("no-zoom", !hasZoom());
    const want = (global.Settings && global.Settings.get("fontSize")) || 14;
    /* На iOS Safari при фокусі в поле з шрифтом меншим за 16 px зумлює всю
       сторінку і людина втрачає екран. Тому редактор на iOS не дрібніший. */
    const floor = resolveOs(global.Settings.get("mobileOs")) === "ios" ? 16 : 0;
    if (!isProj) {
      if (floor > want) document.body.style.setProperty("--editor-font", floor + "px");
      else document.body.style.removeProperty("--editor-font");
      return z;
    }
    /* код на дошці має рости разом з інтерфейсом, інакше рядки лишаються дрібними */
    document.body.style.setProperty("--editor-font", Math.round(Math.max(want, floor) * z) + "px");
    return z;
  }

  /* ---------- Чи тягне ця машина розмиття й анімації ----------
     Для старих ПК у класі (Celeron, 2 ГБ, Intel GMA, Windows 7 + Firefox ESR)
     beauty-ефекти — це 10-15 кадрів на секунду. Рахуємо не по UA, а по факту:
     залізо + реальний час кадра. Вирок запам'ятовується один раз, щоб не
     міряти щовходу; перемикач у Налаштуваннях перекриває його. */
  const PERF_KEY = "app.perfAuto";

  function gpuName() {
    try {
      const c = document.createElement("canvas");
      const gl = c.getContext("webgl") || c.getContext("experimental-webgl");
      if (!gl) return "";
      const ex = gl.getExtension("WEBGL_debug_renderer_info");
      const r = ex ? gl.getParameter(ex.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER);
      return String(r || "");
    } catch (e) { return ""; }
  }

  function weakHints() {
    const nav = global.navigator || {};
    const cores = nav.hardwareConcurrency || 0;
    const mem = nav.deviceMemory || 0;
    const gpu = gpuName().toLowerCase();
    const soft = /swiftshader|llvmpipe|basic render|software|mesa offscreen|gma|intel(r)? (hd|uhd) graphics (4000|3000|2500)/.test(gpu);
    const why = [];
    if (cores && cores <= 2) why.push("ядер:" + cores);
    if (mem && mem <= 2) why.push("пам'ять:" + mem);
    if (soft) why.push("відео:" + gpu.slice(0, 28));
    return { weak: why.length > 0, why: why };
  }

  /* Медіана часу кадра: 40 кадрів на 60 Гц — це півсекунди, на слабкій машині
     секунди. Якщо rAF не запускається (фон-вкладка) — не втручаємось. */
  function frameTime(done) {
    if (!global.requestAnimationFrame) { done(0); return; }
    const gaps = [];
    let last = 0, n = 0, guard = 0;
    function step(ts) {
      if (last) gaps.push(ts - last);
      last = ts; n++;
      if (n < 40 && ++guard < 400) { global.requestAnimationFrame(step); return; }
      gaps.sort((a, b) => a - b);
      done(gaps.length ? gaps[Math.floor(gaps.length / 2)] : 0);
    }
    global.requestAnimationFrame(step);
  }

  function setLowPower(on, why, keep) {
    if (!document.body) return;
    document.body.classList.toggle("low-power", !!on);
    /* Ручний вибір не має залишати слід в пам'яті: повернеш «авто» —
       програма виміряє ще раз, а не повторить торішню відповідь. */
    if (keep !== false) {
      try { global.localStorage.setItem(PERF_KEY, on ? "light" : "full"); } catch (e) {}
    }
    if (on && global.console) console.info("[device] легкий режим:", (why || []).join(", "));
  }

  let perfPending = false;
  function applyPerf() {
    const mode = global.Settings && global.Settings.get ? global.Settings.get("perf") : "auto";
    if (mode === "full") { setLowPower(false, [], false); return; }
    if (mode === "light") { setLowPower(true, ["вручну"], false); return; }
    /* Ноутбук на батареї сповільнюється, тому його торішній вердикт не вічний:
       при кожному вході міряємо ще раз. Стаціонарний ПК — раз і назавжди. */
    const form = global.Settings && global.Settings.get ? global.Settings.get("deviceForm") : "auto";
    let saved = null;
    if (form !== "laptop") { try { saved = global.localStorage.getItem(PERF_KEY); } catch (e) {} }
    if (saved === "light") { setLowPower(true, ["раніше виміряно"]); return; }
    if (saved === "full") { setLowPower(false); return; }
    const h = weakHints();
    if (h.weak) { setLowPower(true, h.why); return; }
    if (perfPending) return;                 // міряємо кадр лише один раз за хід
    perfPending = true;
    frameTime((ms) => { perfPending = false; setLowPower(ms >= 34, ["кадр " + Math.round(ms) + "ms"]); });
  }

  /* Кнопка відповіді: іконка, назва і маленький рядок пояснення всередині. */
  function optBtn(o) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "device-opt" + (o.rec ? " is-rec" : (o.locked ? " is-locked" : ""));
    const i = document.createElement("span");
    i.className = "material-icons";
    i.textContent = o.locked ? "lock" : o.icon;
    const t = document.createElement("span");
    t.textContent = o.label;
    b.append(i, t);
    if (o.hint) {
      const h = document.createElement("span");
      h.className = "device-opt-hint";
      h.textContent = o.hint;
      b.appendChild(h);
    }
    if (o.rec) {
      const badge = document.createElement("span");
      badge.className = "device-rec";
      badge.textContent = L().rec;
      b.appendChild(badge);
    }
    b.onclick = o.onclick;
    return b;
  }

  function set(key, val) {
    if (global.Settings && global.Settings.set) global.Settings.set(key, val);
  }

  /* Майстер з 4 кроків: пристрій → (форма ПК → потужність) або (ОС телефона).
     Кожна відповідь одразу застосовується, щоб напівпройдений майстер не
     лишив інтерфейс у стані «ні наше, ні ваше». */
  function ask() {
    if (document.getElementById("deviceAsk")) { markAnswered(); return; }
    const s = L();
    const detected = detect();

    const wrap = document.createElement("div");
    wrap.id = "deviceAsk";
    wrap.className = "device-ask";
    wrap.setAttribute("role", "dialog");
    wrap.setAttribute("aria-modal", "true");

    const card = document.createElement("div");
    card.className = "device-card";

    const note = document.createElement("div");
    note.className = "device-denied hidden";
    wrap.appendChild(card);

    let step = "kind";
    const trail = [];

    function sfx(name) {
      if (global.Audio2 && global.Audio2.SFX) global.Audio2.SFX[name]();
    }
    function close() { wrap.remove(); markAnswered(); }
    function deny() {
      note.textContent = "";
      const b = document.createElement("b");
      b.textContent = s.denied;
      const txt = document.createElement("span");
      txt.textContent = detected === "pc" ? s.deniedPc : s.deniedPhone;
      note.append(b, txt);
      note.classList.remove("hidden");
      card.classList.remove("shake");
      void card.offsetWidth;
      card.classList.add("shake");
    }
    function go(name) { trail.push(step); step = name; render(); }
    function back() { step = trail.pop() || "kind"; render(); }

    function kindStep(opts) {
      /* Ознаки кажуть «проєктор»? Тоді позначку «рекомендовано» переносимо на
         дошку: з неї так само можна лічити, але саме там шукатиме вчитель.
         У телефона позначку не забираємо — там проєктор позначають інші ознаки. */
      const rec = detected !== "phone" && detected !== "projector" && projLikely() ? "projector" : detected;
      const pick = (kind) => {
        const free = kind === "projector" || kind === detected || detected === "projector";
        if (!free) { sfx("error"); deny(); return; }
        sfx("pop");
        applyDesign(kind);
        if (kind === "pc") go("form");
        else if (kind === "phone") go("os");
        else close();
      };
      const mk = (kind, icon, label) => optBtn({
        icon, label, rec: kind === rec,
        locked: !(kind === "projector" || kind === detected || detected === "projector"),
        onclick: () => pick(kind)
      });
      opts.append(
        mk("pc", "desktop_windows", s.pc),
        mk("phone", "smartphone", s.phone),
        mk("projector", "slideshow", s.proj)
      );
    }

    function formStep(opts) {
      const pick = (v) => { sfx("pop"); set("deviceForm", v); go("power"); };
      opts.append(
        optBtn({ icon: "desktop_windows", label: s.desktop, hint: s.desktopHint, onclick: () => pick("desktop") }),
        optBtn({ icon: "laptop", label: s.laptop, hint: s.laptopHint, onclick: () => pick("laptop") }),
        optBtn({ icon: "help", label: s.unknown, hint: s.unknownHint, onclick: () => pick("auto") })
      );
    }

    function powerStep(opts) {
      const pick = (v) => { sfx("pop"); set("perf", v); close(); };
      opts.append(
        optBtn({ icon: "bolt", label: s.strong, hint: s.strongHint, onclick: () => pick("full") }),
        optBtn({ icon: "speed", label: s.weak, hint: s.weakHint, onclick: () => pick("light") }),
        optBtn({ icon: "help", label: s.unknown, hint: s.unknownHint, onclick: () => pick("auto") })
      );
    }

    function osStep(opts) {
      const pick = (v) => { sfx("pop"); set("mobileOs", v); close(); };
      opts.append(
        optBtn({ icon: "android", label: s.android, hint: s.androidHint, onclick: () => pick("android") }),
        optBtn({ icon: "phone_iphone", label: s.ios, hint: s.iosHint, onclick: () => pick("ios") }),
        optBtn({ icon: "help", label: s.unknown, hint: s.unknownHint, onclick: () => pick("auto") })
      );
    }

    /* Рядок перевірки екранів: у режимі дублювання браузер нічого не бачить,
       тож єдиний спосіб упевнитись — запитати дозвіл на список екранів. */
    function probeRow() {
      const row = document.createElement("div");
      row.className = "device-probe-row";
      const pb = document.createElement("button");
      pb.type = "button";
      pb.className = "device-probe";
      pb.textContent = s.probe;
      const pr = document.createElement("span");
      pr.className = "device-probe-res";
      pb.onclick = () => {
        pb.disabled = true;
        pb.textContent = s.probeBusy;
        probeScreens((res) => {
          pb.disabled = false;
          pb.textContent = s.probe;
          if (res === "found") {
            pr.textContent = s.probeFound;
            applyDesign("projector");
            setTimeout(close, 900);
            return;
          }
          pr.textContent = res === "none" ? s.probeNone : res === "denied" ? s.probeDenied : s.probeNoapi;
        });
      };
      row.append(pb, pr);
      return row;
    }

    function render() {
      const titles = {
        kind: [s.q, s.hint],
        form: [s.formQ, s.formHint],
        power: [s.powerQ, s.powerHint],
        os: [s.osQ, s.osHint]
      }[step];
      card.textContent = "";
      const h = document.createElement("h3");
      h.textContent = titles[0];
      const p = document.createElement("p");
      p.textContent = titles[1];
      const opts = document.createElement("div");
      opts.className = "device-opts";
      card.append(h, p, opts);

      if (step === "kind") {
        kindStep(opts);
        const ph = document.createElement("p");
        ph.className = "device-proj-hint";
        ph.textContent = s.projHint;
        card.append(ph, probeRow(), note);
        return;
      }
      if (step === "form") formStep(opts);
      else if (step === "power") powerStep(opts);
      else osStep(opts);

      const nav = document.createElement("div");
      nav.className = "device-nav";
      const bb = document.createElement("button");
      bb.type = "button";
      bb.className = "device-back";
      const bi = document.createElement("span");
      bi.className = "material-icons";
      bi.textContent = "arrow_back";
      const bt = document.createElement("span");
      bt.textContent = s.back;
      bb.append(bi, bt);
      bb.onclick = back;
      nav.appendChild(bb);
      card.appendChild(nav);
    }

    render();
    document.body.appendChild(wrap);
  }

  /* Пропозиція ввімкнути великий інтерфейс, коли проєктор під'єднали вже
     після відповіді в діалозі — на уроку це трається постійно. */
  function showOffer() {
    if (document.getElementById("projOffer")) return;
    const s = L();
    const bar = document.createElement("div");
    bar.id = "projOffer";
    bar.className = "proj-offer";
    bar.setAttribute("role", "status");
    const txt = document.createElement("span");
    txt.textContent = s.offer;
    const on = document.createElement("button");
    on.type = "button";
    on.className = "btn btn-primary";
    on.textContent = s.offerOn;
    const off = document.createElement("button");
    off.type = "button";
    off.className = "btn";
    off.textContent = s.offerNo;
    on.onclick = () => {
      applyDesign("projector");
      if (global.Audio2 && global.Audio2.SFX) global.Audio2.SFX.pop();
      bar.remove();
    };
    off.onclick = () => { bar.remove(); };
    bar.append(txt, on, off);
    document.body.appendChild(bar);
    setTimeout(() => { if (bar.parentNode) bar.remove(); }, 24000);
  }

  let lastLikely = null;
  function watchScreens() {
    let likely;
    try { likely = projLikely(); } catch (e) { return; }
    if (likely === lastLikely) return;
    const first = lastLikely === null;
    lastLikely = likely;
    if (!likely) {
      const bar = document.getElementById("projOffer");
      if (bar) bar.remove();
      return;
    }
    if (first) return;                       // перший зчит — не сповіщення, а стан
    const dlg = document.getElementById("deviceAsk");
    if (dlg) { dlg.remove(); ask(); return; }  // діалог відкритий — оновити бейдж
    const kind = global.Settings && global.Settings.get ? global.Settings.get("deviceKind") : "pc";
    if (kind !== "projector") showOffer();
  }

  function init() {
    // режим дошки тримаємо до наступної відповіді: він не визначається на 100%
    const saved = global.Settings && global.Settings.get ? global.Settings.get("deviceKind") : null;
    applyDesign(saved === "projector" ? "projector" : detect());
    applyOs();
    applyScale();
    applyPerf();
    global.addEventListener("resize", applyScale);
    lastLikely = projLikely();
    if (!global._projWatch) {
      global._projWatch = setInterval(watchScreens, 3000);
      global.addEventListener("resize", watchScreens);
    }
    // саме питання показуємо вже після екрана завантаження
    if (global.Splash) global.Splash.after(ask);
    else ask();
  }

  global.Device = {
    detect: detect, ask: ask, apply: applyDesign, scale: applyScale,
    projScale: projScale, signals: signals, projLikely: projLikely, projSure: projSure,
    hasZoom: hasZoom, perf: applyPerf, weakHints: weakHints, os: applyOs, resolveOs: resolveOs,
    answered
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})(window);
