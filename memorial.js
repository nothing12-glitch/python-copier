/* memorial.js — свічка пам'яті в шапці.
   Клік по ній відкриває повноекранну заставку: свічка, напис і музика
   music/memorial.mp3 у нескінченному циклу. При виході (кнопка, Esc, клік по фону)
   музика заставки вимикається і відновлюється попередній стан сайту. */
(function (global) {
  const STR = {
    uk: {
      btn: "Пам'ятаємо",
      title: "Пам'ятаємо",
      text: "Сьогодні ворог знову бив по українських містах і людях. Ця свічка — за кожним, кого забрала ця війна. Ми схиляємо голови, ми не пробачимо і не забудемо. Тримаємось разом. Слава Україні.",
      close: "Повернутися"
    },
    en: {
      btn: "We remember",
      title: "We remember",
      text: "Today the enemy struck Ukrainian cities and people again. This candle is for everyone this war has taken. We bow our heads; we will not forgive and we will not forget. We stand together. Slava Ukraini.",
      close: "Return"
    },
    tr: {
      btn: "Hatırlıyoruz",
      title: "Hatırlıyoruz",
      text: "Bugün düşman yine Ukrayna şehirlerini ve insanlarını vurdu. Bu mum, bu savaşın aldığı herkes için. Başımızı eğiyoruz; affetmeyeceğiz ve unutmayacağız. Birlikteyiz. Slava Ukraini.",
      close: "Dön"
    }
  };
  const L = () => STR[global.I18n ? global.I18n.lang : "uk"] || STR.uk;

  let audio = null, wasMusicOn = false, isOpen = false;

  function build() {
    const el = document.createElement("div");
    el.id = "memorial";
    el.className = "memorial";
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-modal", "true");

    const candle = document.createElement("div");
    candle.className = "mem-candle";
    candle.setAttribute("aria-hidden", "true");
    candle.innerHTML = '<span class="mem-glow"></span><span class="mem-flame"></span><span class="mem-wick"></span><span class="mem-wax"></span>';

    const h = document.createElement("h2");
    h.className = "mem-title";
    const p = document.createElement("p");
    p.className = "mem-text";

    const btn = document.createElement("button");
    btn.className = "btn outlined mem-close";
    btn.addEventListener("click", hide);

    el.append(candle, h, p, btn);
    el.addEventListener("click", (e) => { if (e.target === el) hide(); });
    document.body.appendChild(el);
    return el;
  }

  function applyTexts() {
    const s = L();
    const btn = document.getElementById("memorialBtn");
    if (btn) { btn.title = s.btn; btn.setAttribute("aria-label", s.btn); }
    const el = document.getElementById("memorial");
    if (!el) return;
    el.querySelector(".mem-title").textContent = s.title;
    el.querySelector(".mem-text").textContent = s.text;
    el.querySelector(".mem-close").textContent = s.close;
  }

  function playLoop() {
    if (!audio) {
      audio = new Audio("music/memorial.mp3");
      audio.loop = true;
      audio.volume = 0.75;
    }
    audio.currentTime = 0;
    const pr = audio.play();
    if (pr && pr.catch) pr.catch(() => {});
  }

  function show() {
    if (isOpen) return;
    isOpen = true;
    let el = document.getElementById("memorial");
    if (!el) el = build();
    wasMusicOn = !!(global.Audio2 && global.Audio2.musicOn);
    if (global.Audio2 && wasMusicOn) global.Audio2.setMusic(false);
    applyTexts();
    el.classList.add("show");
    playLoop();
  }

  function hide() {
    if (!isOpen) return;
    isOpen = false;
    const el = document.getElementById("memorial");
    if (el) el.classList.remove("show");
    if (audio) { audio.pause(); audio.currentTime = 0; }
    if (global.Audio2 && wasMusicOn) global.Audio2.setMusic(true);
    wasMusicOn = false;
  }

  function init() {
    const btn = document.getElementById("memorialBtn");
    if (btn) btn.addEventListener("click", show);
    applyTexts();
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") hide(); });
    document.addEventListener("langchange", applyTexts);
  }

  global.Memorial = { show: show, hide: hide };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})(window);
