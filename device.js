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
  let detectedHere = false;      // getScreenDetails показав другий екран

  const STR = {
    uk: {
      q: "З якого пристрою ви заходите?",
      hint: "Сайт уже визначив твій пристрій — обери позначений варіант.",
      pc: "ПК / планшет",
      phone: "Телефон",
      proj: "Проєктор / дошка",
      projHint: "Проєктор або інтерактивна дошка в класі — інтерфейс стане великим, щоб було видно з останньої парти.",
      rec: "рекомендовано",
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
      pc: "PC / tablet",
      phone: "Phone",
      proj: "Projector / board",
      projHint: "A projector or interactive whiteboard in class — the interface grows so the last desk can read it.",
      rec: "recommended",
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
      pc: "PC / tablet",
      phone: "Telefon",
      proj: "Projeksiyon / tahta",
      projHint: "Sınıfta projeksiyon veya akıllı tahta varsa seç — arayüz büyür, son sıradan da okunur.",
      rec: "önerilen",
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

  function applyScale() {
    const isProj = !!(global.Settings && global.Settings.get &&
                      global.Settings.get("deviceKind") === "projector");
    const z = isProj ? projScale() : 1;
    document.documentElement.style.setProperty("--proj-scale", String(z));
    if (document.body) document.body.classList.toggle("no-zoom", !hasZoom());
    if (!isProj) {
      document.body.style.removeProperty("--editor-font");
      return z;
    }
    /* код на дошці має рости разом з інтерфейсом, інакше рядки лишаються дрібними */
    const base = (global.Settings.get("fontSize") || 14) * z;
    document.body.style.setProperty("--editor-font", Math.round(base) + "px");
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

  function setLowPower(on, why) {
    if (!document.body) return;
    document.body.classList.toggle("low-power", !!on);
    try { global.localStorage.setItem(PERF_KEY, on ? "light" : "full"); } catch (e) {}
    if (on && global.console) console.info("[device] легкий режим:", (why || []).join(", "));
  }

  let perfPending = false;
  function applyPerf() {
    const mode = global.Settings && global.Settings.get ? global.Settings.get("perf") : "auto";
    if (mode === "full" || mode === "light") {
      /* ручний вибір скасовує попередній авто-вердикт: повернеш «авто» —
         програма виміряє ще раз, а не повторить стару відповідь */
      try { global.localStorage.removeItem(PERF_KEY); } catch (e) {}
    }
    if (mode === "full") { setLowPower(false); return; }
    if (mode === "light") { setLowPower(true, ["вручну"]); return; }
    let saved = null;
    try { saved = global.localStorage.getItem(PERF_KEY); } catch (e) {}
    if (saved === "light") { setLowPower(true, ["раніше виміряно"]); return; }
    if (saved === "full") { setLowPower(false); return; }
    const h = weakHints();
    if (h.weak) { setLowPower(true, h.why); return; }
    if (perfPending) return;                 // міряємо кадр лише один раз за хід
    perfPending = true;
    frameTime((ms) => { perfPending = false; setLowPower(ms >= 34, ["кадр " + Math.round(ms) + "ms"]); });
  }

  function opt(icon, label, kind, detected, ctx) {
    // варіант дошки доступний завжди; решта — тільки якщо збігся з визначеним
    const free = kind === "projector" || kind === detected || detected === "projector";
    /* Ознаки кажуть «проєктор»? Тоді позначку «рекомендовано» переносимо на
       дошку: з неї так само можна лічити, але саме там шукатиме вчитель.
       У телефона позначку не забираємо — там проєктор позначають інші ознаки. */
    const rec = detected !== "phone" && detected !== "projector" && projLikely() ? "projector" : detected;
    const b = document.createElement("button");
    b.type = "button";
    b.className = "device-opt" + (kind === rec ? " is-rec" : (free ? "" : " is-locked"));
    const i = document.createElement("span");
    i.className = "material-icons";
    i.textContent = free ? icon : "lock";
    const t = document.createElement("span");
    t.textContent = label;
    b.append(i, t);
    if (kind === rec) {
      const badge = document.createElement("span");
      badge.className = "device-rec";
      badge.textContent = L().rec;
      b.appendChild(badge);
    }
    b.onclick = () => {
      if (free) {
        applyDesign(kind);
        if (global.Audio2 && global.Audio2.SFX) global.Audio2.SFX.pop();
        ctx.close();
        return;
      }
      if (global.Audio2 && global.Audio2.SFX) global.Audio2.SFX.error();
      ctx.deny();
    };
    return b;
  }

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

    const h = document.createElement("h3");
    h.textContent = s.q;
    const p = document.createElement("p");
    p.textContent = s.hint;

    const opts = document.createElement("div");
    opts.className = "device-opts";

    const note = document.createElement("div");
    note.className = "device-denied hidden";

    const ctx = {
      close: () => { wrap.remove(); markAnswered(); },
      deny: () => {
        note.innerHTML = "";
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
    };

    opts.append(
      opt("desktop_windows", s.pc, "pc", detected, ctx),
      opt("smartphone", s.phone, "phone", detected, ctx),
      opt("slideshow", s.proj, "projector", detected, ctx)
    );

    const ph = document.createElement("p");
    ph.className = "device-proj-hint";
    ph.textContent = s.projHint;

    /* Кнопка перевірки екранів: у режимі дублювання браузер нічого не бачить,
       тож єдиний спосіб упевнитись — запитати дозвіл на список екранів. */
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
          detectedHere = true;
          refresh();
          return;
        }
        pr.textContent = res === "none" ? s.probeNone : res === "denied" ? s.probeDenied : s.probeNoapi;
      });
    };
    row.append(pb, pr);

    card.append(h, p, opts, ph, row, note);
    wrap.appendChild(card);
    document.body.appendChild(wrap);

    function refresh() {
      wrap.remove();
      if (detectedHere) { applyDesign("projector"); markAnswered(); return; }
      ask();
    }
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
    hasZoom: hasZoom, perf: applyPerf, weakHints: weakHints, answered
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})(window);
