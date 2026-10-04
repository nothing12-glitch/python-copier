/* fix.js — "реаніматор": дозапускає секції, які не стартанули через збій у init.
   Підключається ОСТАННІМ. */
(function (global) {
  const $ = (s) => document.querySelector(s);
  const log = (m) => console.info("[fix.js]", m);

  function reviveAppRoute() {
    if (global.App && typeof global.App.route !== "function" && typeof global.route === "function") {
      global.App.route = global.route;
      log("App.route restored");
    }
  }
  reviveAppRoute();

  function reviveNav() {
    if (typeof global.route !== "function") return;
    document.querySelectorAll("[data-route]").forEach((b) => {
      if (!b.onclick) b.onclick = () => global.route(b.dataset.route);
    });
    document.querySelectorAll("[data-goto]").forEach((b) => {
      if (!b.onclick) b.onclick = () => global.route(b.dataset.goto);
    });
    const pb = $("#profileBtn");
    if (pb && !pb.dataset.shield && !pb.onclick) pb.onclick = () => global.route("profile");
    log("nav re-bound");
  }

  function reviveSettings() {
    const body = $("#settingsBody");
    if (global.Settings && body && !body.children.length && !body.dataset.shield) {
      try { global.Settings.render(body); log("settings re-rendered"); } catch (e) { console.warn(e); }
    }
  }

  function reviveSections() {
    const hub = $("#gamesHub");
    if (hub && !hub.children.length && !hub.dataset.shield && global.Games && global.Games.init) {
      try { global.Games.init(); log("games re-init"); } catch (e) { console.warn(e); }
    }
    const calc = $("#calcBox");
    if (calc && !calc.children.length && !calc.dataset.shield && global.Tools && global.Tools.init) {
      try { global.Tools.init(); log("tools re-init"); } catch (e) { console.warn(e); }
    }
    const ex = $("#examples");
    if (ex && !ex.options.length && !ex.dataset.shield && global.PythonPad && global.PythonPad.init) {
      try { global.PythonPad.init(); log("python re-init"); } catch (e) { console.warn(e); }
    }
  }

  function reviveMusicFallback() {
    if (global.TeacherSecret) return;
    const btn = $("#musicToggle");
    if (!btn || !global.Audio2) return;
    document.addEventListener("click", (e) => {
      const b = e.target && e.target.closest ? e.target.closest("#musicToggle") : null;
      if (!b) return;
      e.stopPropagation();
      e.preventDefault();
      const A = global.Audio2;
      if (A.musicOn) {
        if (A.openPanelOnly) A.openPanelOnly();
        else A.setMusic(true);
      } else A.setMusic(true);
    }, true);
    log("music fallback on");
  }

  function hideStrayGreet() {
    const g = $("#teacherGreet");
    if (g && !g.classList.contains("show")) g.style.display = "none";
  }

  function reviveAll() {
    reviveAppRoute();
    hideStrayGreet();
    reviveNav();
    reviveSettings();
    reviveSections();
    reviveMusicFallback();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => setTimeout(reviveAll, 100));
  else setTimeout(reviveAll, 100);
})(window);
