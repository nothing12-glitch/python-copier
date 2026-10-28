/* device.js — при КОЖНОМУ вході питає, з якого пристрою зайшли.
   Сайт сам визначає пристрій, позначає правильний варіант як «рекомендовано»
   і НЕ дає вибрати чужий: показує «Доступ закрито».
   ПК/планшет -> класична панель, телефон -> пігулка.
   Відповідь навмисно не зберігається: питання з'явиться знову наступного разу. */
(function (global) {
  let markAnswered;
  const answered = new Promise((r) => { markAnswered = r; });

  const STR = {
    uk: {
      q: "З якого пристрою ви заходите?",
      hint: "Сайт уже визначив твій пристрій — обери позначений варіант.",
      pc: "ПК / планшет",
      phone: "Телефон",
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

  /* Авто-визначення: «phone» або «pc» (планшет рахуємо як ПК) */
  function detect() {
    const nav = global.navigator || {};
    const ua = nav.userAgent || "";
    const maxTP = nav.maxTouchPoints || 0;
    const coarse = mq("(pointer: coarse)");
    const fine = mq("(pointer: fine)");

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
    global.Settings.set("navDesign", kind === "phone" ? "pill" : "classic");
  }

  function opt(icon, label, kind, detected, ctx) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "device-opt" + (kind === detected ? " is-rec" : " is-locked");
    const i = document.createElement("span");
    i.className = "material-icons";
    i.textContent = kind === detected ? icon : "lock";
    const t = document.createElement("span");
    t.textContent = label;
    b.append(i, t);
    if (kind === detected) {
      const badge = document.createElement("span");
      badge.className = "device-rec";
      badge.textContent = L().rec;
      b.appendChild(badge);
    }
    b.onclick = () => {
      if (kind === detected) {
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
      opt("smartphone", s.phone, "phone", detected, ctx)
    );

    card.append(h, p, opts, note);
    wrap.appendChild(card);
    document.body.appendChild(wrap);
  }

  function init() {
    applyDesign(detect());   // інтерфейс одразу стає правильним, ще до відповіді
    // саме питання показуємо вже після екрана завантаження
    if (global.Splash) global.Splash.after(ask);
    else ask();
  }

  global.Device = { detect: detect, ask: ask, apply: applyDesign, answered };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})(window);
