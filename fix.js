/* fix.js — "реаніматор". Запускається останнім і лагодить те, що не ініціалізувалось
   через помилку посередині init або через суміш старих/нових файлів на сервері. */
(function (global) {
  const $ = (s) => document.querySelector(s);
  const log = (m) => console.info("[fix.js]", m);

  function reviveNav() {
    if (typeof global.route !== "function") return;
    document.querySelectorAll("[data-route]").forEach((b) => { b.onclick = () => global.route(b.dataset.route); });
    document.querySelectorAll("[data-goto]").forEach((b) => { b.onclick = () => global.route(b.dataset.goto); });
    const pb = $("#profileBtn");
    if (pb && !pb.dataset.shield) pb.onclick = () => global.route("profile");
    log("nav re-bound");
  }

  function reviveSettings() {
    const body = $("#settingsBody");
    if (global.Settings && body && !body.children.length && !body.dataset.shield) {
      try { global.Settings.render(body); log("settings re-rendered"); } catch (e) {}
    }
  }

  function reviveSections() {
    const hub = $("#gamesHub");
    if (hub && !hub.children.length && !hub.dataset.shield && global.Games && global.Games.init) {
      try { global.Games.init(); log("games re-init"); } catch (e) {}
    }
    const calc = $("#calcBox");
    if (calc && !calc.children.length && !calc.dataset.shield && global.Tools && global.Tools.init) {
      try { global.Tools.init(); log("tools re-init"); } catch (e) {}
    }
    const ex = $("#examples");
    if (ex && !ex.options.length && !ex.dataset.shield && global.PythonPad && global.PythonPad.init) {
      try { global.PythonPad.init(); log("python re-init"); } catch (e) {}
    }
  }

  function reviveMusicFallback() {
    // якщо teacher.js з якоїсь причини не підключився — беремо кнопку музики під контроль тут
    if (global.TeacherSecret) return;
    const btn = $("#musicToggle");
    if (!btn || !global.Audio2) return;
    document.addEventListener("click", (e) => {
      const b = e.target && e.target.closest ? e.target.closest("#musicToggle") : null;
      if (!b) return;
      e.stopPropagation(); e.preventDefault();
      const A = global.Audio2;
      if (A.musicOn) { if (A.openPanelOnly) A.openPanelOnly(); else A.setMusic(true); }
      else A.setMusic(true);
    }, true);
    log("music fallback on");
  }

  function hideStrayGreet() {
    const g = $("#teacherGreet");
    if (g && !g.classList.contains("show")) g.style.display = "none";
  }

  function reviveAll() {
    hideStrayGreet();
    reviveNav();
    reviveSettings();
    reviveSections();
    reviveMusicFallback();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => setTimeout(reviveAll, 50));
  else setTimeout(reviveAll, 50);
})(window);
