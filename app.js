/* Головний модуль: роутинг, профіль UI, аудіо-перемикачі, ініціалізація */
(function (global) {
  const $ = (s) => document.querySelector(s);
  const t = (k, v) => global.I18n.t(k, v);
  const SFX = () => global.Audio2 && global.Audio2.SFX;

  /* ---------- Router ---------- */
  function route(name) {
    document.querySelectorAll(".view").forEach((v) => v.classList.remove("active"));
    const view = document.getElementById("view-" + name);
    if (view) view.classList.add("active");
    document.querySelectorAll("[data-route]").forEach((b) => b.classList.toggle("active", b.dataset.route === name));
    if (name === "games" && global.Games) global.Games.renderHub();
    if (name === "profile") renderProfile();
    location.hash = name;
  }

  /* ---------- Toast ---------- */
  function toast(msg) {
    const el = $("#toast");
    el.textContent = msg; el.classList.add("show");
    clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove("show"), 2400);
  }

  /* ---------- Profile UI ---------- */
  const GAME_LABELS = { ttt: "game.ttt", snake: "game.snake", memory: "game.memory", g2048: "game.g2048", rps: "game.rps", react: "game.react" };

  function renderProfile() {
    const info = global.Profile.info();
    const authPanel = $("#authPanel"), profPanel = $("#profilePanel");
    updateHeaderProfile();
    if (!info) { authPanel.classList.remove("hidden"); profPanel.classList.add("hidden"); return; }
    authPanel.classList.add("hidden"); profPanel.classList.remove("hidden");
    $("#profileDisplayName").textContent = info.name;
    $("#avatarBig").textContent = info.name[0].toUpperCase();
    const d = new Date(info.created);
    $("#profileMeta").textContent = t("profile.memberSince") + " " + d.toLocaleDateString();
    renderRecords();
  }

  function renderRecords() {
    const grid = $("#recordsGrid"); grid.innerHTML = "";
    const recs = global.Profile.getRecords();
    const keys = Object.keys(recs);
    if (!keys.length) { grid.innerHTML = `<p class="muted">${t("profile.noRecords")}</p>`; return; }
    keys.forEach((k) => {
      const div = document.createElement("div"); div.className = "record";
      const label = GAME_LABELS[k] ? t(GAME_LABELS[k]) : k;
      div.innerHTML = `<div class="g">${label}</div><div class="v">${recs[k]}</div>`;
      grid.appendChild(div);
    });
  }

  function updateHeaderProfile() {
    const info = global.Profile.info();
    $("#profileName").textContent = info ? info.name : t("profile.guest");
    $("#avatarTop").textContent = info ? info.name[0].toUpperCase() : "👤";
  }

  function setMsg(el, text, ok) {
    el.textContent = text; el.className = "auth-msg " + (ok ? "ok" : "err");
  }

  function bindAuth() {
    document.querySelectorAll("[data-authtab]").forEach((tab) => {
      tab.onclick = () => {
        SFX() && SFX().click();
        document.querySelectorAll("[data-authtab]").forEach((x) => x.classList.remove("active"));
        tab.classList.add("active");
        const mode = tab.dataset.authtab;
        $("#loginForm").classList.toggle("hidden", mode !== "login");
        $("#registerForm").classList.toggle("hidden", mode !== "register");
      };
    });

    $("#registerForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const r = await global.Profile.register($("#regUser").value, $("#regPass").value);
      if (!r.ok) { setMsg($("#regMsg"), t("profile.errExists"), false); SFX() && SFX().error(); return; }
      setMsg($("#regMsg"), t("profile.okRegister"), true); SFX() && SFX().success();
      toast(t("profile.welcome") + ", " + r.name + "!");
      $("#registerForm").reset(); renderProfile();
    });

    $("#loginForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const r = await global.Profile.login($("#loginUser").value, $("#loginPass").value);
      if (!r.ok) { setMsg($("#loginMsg"), t("profile.errLogin"), false); SFX() && SFX().error(); return; }
      setMsg($("#loginMsg"), t("profile.okLogin"), true); SFX() && SFX().success();
      toast(t("profile.welcome") + ", " + r.name + "!");
      $("#loginForm").reset(); renderProfile();
    });

    $("#logoutBtn").onclick = () => {
      SFX() && SFX().click(); global.Profile.logout(); toast(t("profile.loggedOut")); renderProfile();
    };
  }

  /* ---------- Audio toggles (app bar) ---------- */
  function bindAudio() {
    const sfxBtn = $("#sfxToggle"), musicBtn = $("#musicToggle");
    function sync() {
      const sOn = global.Audio2.sfxOn, mOn = global.Audio2.musicOn;
      sfxBtn.querySelector(".material-icons").textContent = sOn ? "volume_up" : "volume_off";
      sfxBtn.setAttribute("aria-pressed", String(sOn));
      musicBtn.querySelector(".material-icons").textContent = mOn ? "music_note" : "music_off";
      musicBtn.setAttribute("aria-pressed", String(mOn));
    }
    sfxBtn.onclick = () => { global.Audio2.setSfx(!global.Audio2.sfxOn); toast(global.Audio2.sfxOn ? t("audio.sfxOn") : t("audio.sfxOff")); sync(); };
    musicBtn.onclick = () => { global.Audio2.setMusic(!global.Audio2.musicOn); toast(global.Audio2.musicOn ? t("audio.musicOn") : t("audio.musicOff")); sync(); };
    document.addEventListener("settingschange", sync);
    sync();
  }

  /* ---------- Settings actions (соц-вхід, експорт, скидання) ---------- */
  function bindSettingsActions() {
    document.addEventListener("settingschange", () => { if (global.Settings) global.Settings.syncUI(); });

    document.addEventListener("settings-action", async (e) => {
      const id = e.detail.id;
      SFX() && SFX().click();
      if (id === "google" || id === "github") {
        const name = id === "google" ? "Google User" : "GitHub User";
        await global.Profile.socialLogin(id, name);
        toast(t("set.socialDemo"));
        updateHeaderProfile(); renderProfile();
      }
      else if (id === "export") {
        const data = {};
        Object.keys(localStorage).filter((k) => k.startsWith("app.")).forEach((k) => { data[k] = localStorage.getItem(k); });
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob); a.download = "my-projects-data.json"; a.click();
        URL.revokeObjectURL(a.href);
        toast(t("set.exportDone"));
      }
      else if (id === "resetRecords") {
        global.Profile.clearRecords(); toast(t("settings.recordsCleared"));
        if (global.Games) global.Games.renderHub();
        if ($("#view-profile").classList.contains("active")) renderRecords();
      }
      else if (id === "clearAll") {
        SFX() && SFX().error();
        global.Profile.clearAll(); toast(t("settings.cleared"));
        updateHeaderProfile(); renderProfile();
        if (global.Games) global.Games.renderHub();
      }
      else if (id === "resetSettings") {
        global.Settings.resetAll(); toast(t("set.settingsReset"));
        global.Settings.render($("#settingsBody"));
      }
    });
  }

  /* ---------- Material ripple ---------- */
  function bindRipple() {
    document.addEventListener("pointerdown", (e) => {
      const host = e.target.closest(".btn, .chip-btn, .icon-btn, .rail-btn, .lang-switch button, .tab-btn, .chip");
      if (!host) return;
      const r = document.createElement("span");
      r.className = "ripple";
      const rect = host.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      r.style.width = r.style.height = size + "px";
      r.style.left = e.clientX - rect.left -
             r.style.left = e.clientX - rect.left - size / 2 + "px";
      r.style.top = e.clientY - rect.top - size / 2 + "px";
      host.appendChild(r);
      setTimeout(() => r.remove(), 520);
    });
  }

  /* ---------- Init ---------- */
  function init() {
    global.I18n.apply();
    // language switch (усі перемикачі мови)
    document.querySelectorAll("button[data-lang]").forEach((b) => {
      b.classList.toggle("active", b.dataset.lang === global.I18n.lang);
      b.onclick = () => { global.I18n.setLang(b.dataset.lang); SFX() && SFX().click(); };
    });
    document.documentElement.lang = global.I18n.lang;

    // nav
    document.querySelectorAll("[data-route]").forEach((b) => (b.onclick = () => { SFX() && SFX().click(); route(b.dataset.route); }));
    document.querySelectorAll("[data-goto]").forEach((b) => (b.onclick = () => { SFX() && SFX().click(); route(b.dataset.goto); }));
    $("#profileBtn").onclick = () => { SFX() && SFX().click(); route("profile"); };

    bindRipple();

    bindAuth();
    bindAudio();
    if (global.Settings) { global.Settings.init(); global.Settings.render($("#settingsBody")); }
    bindSettingsActions();
    if (global.PythonPad) global.PythonPad.init();
    if (global.Games) global.Games.init();

    // audio needs a user gesture to start; enable on first interaction if music requested
    const kick = () => { global.Audio2.ensure(); if (global.Audio2.musicOn) global.Audio2.setMusic(true); window.removeEventListener("pointerdown", kick); };
    window.addEventListener("pointerdown", kick);

    // re-render profile-dependent labels on lang change
    document.addEventListener("langchange", () => { updateHeaderProfile(); if ($("#view-profile").classList.contains("active")) renderProfile(); });

    // initial route
    const hash = (location.hash || "#home").slice(1);
    route(["home", "python", "games", "profile", "settings"].includes(hash) ? hash : "home");
  }

  document.addEventListener("DOMContentLoaded", init);
  global.App = { route, toast };
})(window);
