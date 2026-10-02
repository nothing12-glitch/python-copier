/* teacher.js — пасхалки + привітання вчителя + фікси UI.
   1) Пасхалка: 10 кліків по НАЗВІ в шапці (.appbar-title) -> привітання.
      (Бонус: Ctrl+Shift+T)
   2) Кнопка музики: повторний клік НЕ вимикає музику, а лише відкриває панель.
   3) Анімована «бульбка» в дизайні «пігулка».
   4) Помідоро-таймер у #pomoBox (щоб tools.js не треба було чіпати).
*/
(function (global) {
  const t = (k, v) => (global.I18n ? global.I18n.t(k, v) : k);
  const toast = (m) => { if (global.App && global.App.toast) global.App.toast(m); };

  const SL = {
    uk: { soon: "Ще {n} кліків…", hint: "Секретний подарунок розблоковано! 🌹" },
    en: { soon: "{n} clicks to go…", hint: "Secret gift unlocked! 🌹" },
    tr: { soon: "{n} tıklama kaldı…", hint: "Gizli hediye açıldı! 🌹" },
    de: { soon: "Noch {n} Klicks…", hint: "Geheimes Geschenk! 🌹" },
    pl: { soon: "Jeszcze {n} kliknięć…", hint: "Sekretny prezent! 🌹" },
    es: { soon: "Faltan {n} clics…", hint: "¡Regalo secreto! 🌹" },
    fr: { soon: "Encore {n} clics…", hint: "Cadeau secret ! 🌹" },
    ja: { soon: "あと{n}回…", hint: "秘密のプレゼント！ 🌹" }
  };
  const T = () => SL[global.I18n ? global.I18n.lang : "uk"] || SL.uk;

  /* ---------- 1) Пасхалка: 10 кліків по назві ---------- */
  let clicks = 0, lastClick = 0;
  function bindTitleEgg() {
    const title = document.querySelector(".appbar-title");
    if (!title) return;
    title.addEventListener("click", () => {
      const now = Date.now();
      if (now - lastClick > 2000) clicks = 0;   // скидається, якщо пауза >2с
      lastClick = now;
      clicks++;
      if (clicks === 7) toast(T().soon.replace("{n}", "3"));
      if (clicks >= 10) { clicks = 0; openGreet(); }
    });
    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "t") { e.preventDefault(); openGreet(); }
    });
  }

  /* ---------- Привітання вчителя ---------- */
  function openGreet() {
    const el = document.getElementById("teacherGreet");
    if (!el || el.classList.contains("show")) return;
    el.style.display = "grid";
    requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add("show")));
    const colors = ["#6750A4", "#22d3ee", "#f0b429", "#FFD700", "#C2185B", "#2E7D32"];
    for (let i = 0; i < 60; i++) {
      const c = document.createElement("div");
      c.className = "confetti";
      c.style.left = Math.random() * 100 + "%";
      c.style.background = colors[Math.floor(Math.random() * colors.length)];
      c.style.animationDelay = (Math.random() * 2) + "s";
      el.appendChild(c);
      setTimeout(() => c.remove(), 5200);
    }
    if (global.Audio2 && global.Audio2.SFX) global.Audio2.SFX.win();
    toast(T().hint);
  }
  function closeGreet() {
    const el = document.getElementById("teacherGreet");
    if (!el) return;
    el.classList.remove("show");
    setTimeout(() => { el.style.display = "none"; }, 450);
  }
  function bindGreet() {
    const el = document.getElementById("teacherGreet");
    if (!el) return;
    el.style.display = "none";           // надійно ховаємо навіть без CSS
    const btn = document.getElementById("teacherClose");
    if (btn) btn.addEventListener("click", closeGreet);
    el.addEventListener("click", (e) => { if (e.target === el) closeGreet(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeGreet(); });
  }

  /* ---------- 2) Фікс кнопки музики (не вимикати при повторному кліку) ---------- */
  function bindMusicFix() {
    // capture на document спрацьовує РАНІШЕ за onclick у app.js і блокує його
    document.addEventListener("click", (e) => {
      const btn = e.target && e.target.closest ? e.target.closest("#musicToggle") : null;
      if (!btn) return;
      e.stopPropagation();
      e.preventDefault();
      const A = global.Audio2;
      if (!A) return;
      if (A.musicOn) {
        if (A.openPanelOnly) A.openPanelOnly();   // просто відкриваємо панель
        else { /* fallback */ }
      } else {
        A.setMusic(true);
        toast(t("audio.musicOn"));
      }
    }, true);
  }

  /* ---------- 3) Анімована бульбка в пігулці ---------- */
  function initDrop() {
    const nav = document.getElementById("mainnav");
    if (!nav) return;
    const drop = document.createElement("div");
    drop.className = "pill-drop";
    nav.appendChild(drop);
    const SIZES = { small: 40, medium: 48, large: 56 };

    function offsetTo(el, root) {
      let x = 0, y = 0;
      while (el && el !== root) { x += el.offsetLeft; y += el.offsetTop; el = el.offsetParent; }
      return { x, y };
    }
    function place(animate) {
      if (document.body.dataset.nav !== "pill") { drop.classList.remove("on"); return; }
      const active = nav.querySelector(".rail-btn.active");
      if (!active) { drop.classList.remove("on"); return; }
      const ico = active.querySelector(".rail-ico") || active;
      const s = SIZES[document.body.dataset.navSize] || 48;
      const p = offsetTo(ico, nav);
      const x = p.x + ico.offsetWidth / 2 - s / 2;
      const y = p.y + ico.offsetHeight / 2 - s / 2;
      drop.style.width = s + "px";
      drop.style.height = s + "px";
      if (!animate) drop.style.transition = "none";
      drop.style.transform = "translate(" + x + "px," + y + "px)";
      drop.classList.add("on");
      if (!animate) { void drop.offsetWidth; drop.style.transition = ""; }
    }
    new MutationObserver(() => place(true)).observe(nav, { subtree: true, attributes: true, attributeFilter: ["class"] });
    new MutationObserver(() => place(false)).observe(document.body, { attributes: true, attributeFilter: ["data-nav", "data-nav-size", "data-nav-pos"] });
    window.addEventListener("resize", () => place(false));
    document.addEventListener("settingschange", () => setTimeout(() => place(false), 0));
    setTimeout(() => place(false), 60);
  }

  /* ---------- 4) Помідоро ---------- */
  function renderPomo() {
    const box = document.getElementById("pomoBox");
    if (!box) return;
    box.innerHTML = "";
    const MODES = [
      ["work", t("pomo.work"), 25 * 60],
      ["short", t("pomo.short"), 5 * 60],
      ["long", t("pomo.long"), 15 * 60]
    ];
    let current = MODES[0], left = current[2], timer = null;

    const wrap = document.createElement("div"); wrap.className = "pomo";
    const ring = document.createElement("div"); ring.className = "pomo-ring";
    ring.innerHTML = '<svg viewBox="0 0 170 170" width="170" height="170"><circle class="bg" cx="85" cy="85" r="75"/><circle class="fg" cx="85" cy="85" r="75" stroke-dasharray="471.24" stroke-dashoffset="0"/></svg>';
    const fg = ring.querySelector(".fg");
    const time = document.createElement("div"); time.className = "pomo-time";
    ring.appendChild(time);
    wrap.appendChild(ring);

    const modes = document.createElement("div"); modes.className = "pomo-mode";
    MODES.forEach((m, i) => {
      const b = document.createElement("button");
      b.textContent = m[1];
      if (i === 0) b.classList.add("active");
      b.onclick = () => {
        current = m; stop(); left = m[2]; draw();
        modes.querySelectorAll("button").forEach((x, j) => x.classList.toggle("active", j === i));
      };
      modes.appendChild(b);
    });
    wrap.appendChild(modes);

    const btns = document.createElement("div"); btns.className = "pomo-btns";
    const startBtn = document.createElement("button"); startBtn.className = "btn contained";
    const resetBtn = document.createElement("button"); resetBtn.className = "btn outlined";
    resetBtn.textContent = t("pomo.reset");
    btns.append(startBtn, resetBtn);
    wrap.appendChild(btns);
    box.appendChild(wrap);

    function draw() {
      const m = Math.floor(left / 60), s = left % 60;
      time.textContent = (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s;
      fg.setAttribute("stroke-dashoffset", String(471.24 * (1 - left / current[2])));
    }
    function tick() {
      left--;
      if (left <= 0) {
        stop();
        if (global.Audio2 && global.Audio2.SFX) global.Audio2.SFX.win();
        toast(t("pomo.done"));
        left = current[2];
      }
      draw();
    }
    function start() { if (timer) return; timer = setInterval(tick, 1000); startBtn.textContent = t("pomo.pause"); }
    function stop() { clearInterval(timer); timer = null; startBtn.textContent = t("pomo.start"); }
    startBtn.onclick = () => { if (timer) stop(); else start(); };
    resetBtn.onclick = () => { stop(); left = current[2]; draw(); };
    stop(); draw();
  }

  function init() {
    bindGreet();
    bindTitleEgg();
    bindMusicFix();
    initDrop();
    renderPomo();
    document.addEventListener("langchange", renderPomo);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();

  global.TeacherSecret = { open: openGreet, close: closeGreet };
})(window);
