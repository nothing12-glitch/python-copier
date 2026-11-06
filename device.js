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
      pc: "ПК / планшет",
      phone: "Телефон",
      proj: "Проєктор / дошка",
      projHint: "Проєктор або інтерактивна дошка в класі — інтерфейс стане великим, щоб було видно з останньої парти.",
      rec: "рекомендовано",
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

  /* Авто-визначення: «projector», «phone» або «pc» (планшет рахуємо як ПК) */
  function detect() {
    const nav = global.navigator || {};
    const ua = nav.userAgent || "";
    const maxTP = nav.maxTouchPoints || 0;
    const coarse = mq("(pointer: coarse)");
    const fine = mq("(pointer: fine)");

    if (isBoard()) return "projector";

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

  function opt(icon, label, kind, detected, ctx) {
    // варіант дошки доступний завжди; решта — тільки якщо збігся з визначеним
    const free = kind === "projector" || kind === detected || detected === "projector";
    const b = document.createElement("button");
    b.type = "button";
    b.className = "device-opt" + (kind === detected ? " is-rec" : (free ? "" : " is-locked"));
    const i = document.createElement("span");
    i.className = "material-icons";
    i.textContent = free ? icon : "lock";
    const t = document.createElement("span");
    t.textContent = label;
    b.append(i, t);
    if (kind === detected) {
      const badge = document.createElement("span");
      badge.className = "device-rec";
      badge.textContent = L().rec;
      b.appendChild(badge);
    }
    if (kind === "projector" && kind !== detected && isProjecting()) {
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

    card.append(h, p, opts, ph, note);
    wrap.appendChild(card);
    document.body.appendChild(wrap);
  }

  function init() {
    // режим дошки тримаємо до наступної відповіді: він не визначається на 100%
    const saved = global.Settings && global.Settings.get ? global.Settings.get("deviceKind") : null;
    applyDesign(saved === "projector" ? "projector" : detect());
    // саме питання показуємо вже після екрана завантаження
    if (global.Splash) global.Splash.after(ask);
    else ask();
  }

  global.Device = { detect: detect, ask: ask, apply: applyDesign, answered };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})(window);
