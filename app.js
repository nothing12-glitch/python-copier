/* app.js — головний ініціалізатор. Усі кліки безпечні до відсутніх елементів.
   shield.js гарантує що всі $()-селектори знаходять елементи (хоча б заглушки). */
(function (global) {
  const $ = (s) => document.querySelector(s);
  const t = (k) => (global.I18n ? global.I18n.t(k) : k);

  function toast(msg) {
    const el = $("#toast");
    if (!el) return;
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove("show"), 2200);
  }
  global.App = { toast };

  /* ---------- Маршрутизатор ---------- */
  function route(name) {
    document.querySelectorAll(".view").forEach((v) => v.classList.remove("active"));
    const view = $("#view-" + name);
    if (view) view.classList.add("active");
    document.querySelectorAll("[data-route]").forEach((b) => b.classList.toggle("active", b.dataset.route === name));
    if (name === "games" && global.Games && global.Games.renderHub) {
      try { global.Games.renderHub(); } catch (e) { console.warn(e); }
    }
    if (name === "profile") {
      try { renderProfile(); } catch (e) { console.warn(e); }
    }
    if (name === "settings" && global.Settings) {
      try { global.Settings.render($("#settingsBody")); } catch (e) { console.warn(e); }
    }
    location.hash = name;
    document.dispatchEvent(new CustomEvent("routechange", { detail: name }));
  }
  global.route = route;

  /* ---------- Ріппл ефект ---------- */
  function bindRipple() {
    document.addEventListener("click", (e) => {
      const btn = e.target.closest(".btn, .chip-btn, .icon-btn, .chip, .lang-switch button");
      if (!btn) return;
      const r = document.createElement("span");
      r.className = "ripple";
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      r.style.width = r.style.height = size + "px";
      r.style.left = (e.clientX - rect.left - size / 2) + "px";
      r.style.top = (e.clientY - rect.top - size / 2) + "px";
      btn.appendChild(r);
      setTimeout(() => r.remove(), 550);
    });
  }

  /* ---------- Мова ---------- */
  function bindLang() {
    document.querySelectorAll("[data-lang]").forEach((b) => {
      b.onclick = () => {
        if (!global.I18n) return;
        document.body.classList.add("lang-fade");
        setTimeout(() => {
          global.I18n.setLang(b.dataset.lang);
          document.body.classList.remove("lang-fade");
        }, 180);
      };
    });
    document.addEventListener("langchange", () => {
      document.querySelectorAll("[data-i18n]").forEach((el) => {
        el.textContent = t(el.getAttribute("data-i18n"));
      });
      if (global.Settings) {
        try { global.Settings.render($("#settingsBody")); } catch (e) {}
      }
    });
  }

  /* ---------- Аудіо (null-safe) ---------- */
  function bindAudio() {
    const sfxBtn = $("#sfxToggle");
    const musicBtn = $("#musicToggle");
    const focusBtn = $("#focusToggle");

    function sync() {
      const A = global.Audio2;
      if (!A) return;
      const sOn = A.sfxOn, mOn = A.musicOn;
      if (sfxBtn && !sfxBtn.dataset.shield) {
        const ico = sfxBtn.querySelector(".material-icons");
        if (ico) ico.textContent = sOn ? "volume_up" : "volume_off";
        sfxBtn.setAttribute("aria-pressed", String(sOn));
      }
      if (musicBtn && !musicBtn.dataset.shield) {
        const ico = musicBtn.querySelector(".material-icons");
        if (ico) ico.textContent = mOn ? "music_note" : "music_off";
        musicBtn.setAttribute("aria-pressed", String(mOn));
      }
    }

    if (sfxBtn && !sfxBtn.dataset.shield) {
      sfxBtn.onclick = () => {
        if (!global.Audio2) return;
        global.Audio2.setSfx(!global.Audio2.sfxOn);
        toast(global.Audio2.sfxOn ? t("audio.sfxOn") : t("audio.sfxOff"));
        sync();
      };
    }

    // musicBtn — НЕ призначаємо onclick: перехоплює teacher.js у capture
    // щоб не вимикати музику при повторному кліку

    if (focusBtn && !focusBtn.dataset.shield) {
      focusBtn.onclick = () => {
        const on = document.body.classList.toggle("focus-mode");
        focusBtn.setAttribute("aria-pressed", String(on));
        toast(t(on ? "focus.on" : "focus.off"));
        if (on) {
          const esc = (e) => {
            if (e.key === "Escape") {
              document.body.classList.remove("focus-mode");
              focusBtn.setAttribute("aria-pressed", "false");
              toast(t("focus.off"));
              document.removeEventListener("keydown", esc);
            }
          };
          document.addEventListener("keydown", esc);
        }
      };
    }

    document.addEventListener("settingschange", sync);
    sync();
  }

  /* ---------- Профіль ---------- */
  function bindAuth() {
    const loginForm = $("#loginForm");
    const registerForm = $("#registerForm");
    const tabs = document.querySelectorAll("[data-authtab]");

    tabs.forEach((tab) => {
      tab.onclick = () => {
        tabs.forEach((t) => t.classList.toggle("active", t === tab));
        const mode = tab.dataset.authtab;
        if (loginForm) loginForm.classList.toggle("hidden", mode !== "login");
        if (registerForm) registerForm.classList.toggle("hidden", mode !== "register");
      };
    });

    if (loginForm) {
      loginForm.onsubmit = (e) => {
        e.preventDefault();
        if (!global.Profile) return;
        const u = $("#loginUser").value.trim();
        const p = $("#loginPass").value;
        const msg = $("#loginMsg");
        const res = global.Profile.login(u, p);
        if (res.ok) {
          if (msg) { msg.className = "auth-msg ok"; msg.textContent = t("profile.okLogin"); }
          toast(t("profile.okLogin"));
          renderProfile();
        } else {
          if (msg) { msg.className = "auth-msg err"; msg.textContent = t("profile.errLogin"); }
        }
      };
    }

    if (registerForm) {
      registerForm.onsubmit = (e) => {
        e.preventDefault();
        if (!global.Profile) return;
        const u = $("#regUser").value.trim();
        const p = $("#regPass").value;
        const msg = $("#regMsg");
        const res = global.Profile.register(u, p);
        if (res.ok) {
          if (msg) { msg.className = "auth-msg ok"; msg.textContent = t("profile.okRegister"); }
          toast(t("profile.okRegister"));
          renderProfile();
        } else {
          if (msg) { msg.className = "auth-msg err"; msg.textContent = t("profile.errExists"); }
        }
      };
    }

    const logoutBtn = $("#logoutBtn");
    if (logoutBtn) {
      logoutBtn.onclick = () => {
        if (global.Profile) global.Profile.logout();
        toast(t("profile.loggedOut"));
        renderProfile();
      };
    }
  }

  function renderProfile() {
    const auth = $("#authPanel");
    const prof = $("#profilePanel");
    if (!auth || !prof) return;
    if (!global.Profile || !global.Profile.current()) {
      auth.classList.remove("hidden");
      prof.classList.add("hidden");
      updateHeaderProfile(null);
      return;
    }
    auth.classList.add("hidden");
    prof.classList.remove("hidden");
    const u = global.Profile.current();
    const nameEl = $("#profileDisplayName");
    const meta = $("#profileMeta");
    const avatar = $("#avatarBig");
    if (nameEl) nameEl.textContent = u.name || "—";
    if (meta) meta.textContent = (t("profile.memberSince") || "member since") + " " + (u.created ? new Date(u.created).toLocaleDateString() : "");
    if (avatar) avatar.textContent = u.avatar || "\u{1F9D1}";
    const grid = $("#recordsGrid");
    if (grid) {
      grid.innerHTML = "";
      const recs = global.Profile.records ? global.Profile.records() : {};
      const keys = Object.keys(recs);
      if (!keys.length) {
        const p = document.createElement("p");
        p.className = "muted";
        p.textContent = t("profile.noRecords");
        grid.appendChild(p);
      } else {
        keys.forEach((k) => {
          const d = document.createElement("div");
          d.className = "record";
          d.innerHTML = '<div class="g">' + k + '</div><div class="v">' + recs[k] + '</div>';
          grid.appendChild(d);
        });
      }
    }
    updateHeaderProfile(u);
  }

  function updateHeaderProfile(u) {
    const nameEl = $("#profileName");
    const avatar = $("#avatarTop");
    if (nameEl) nameEl.textContent = u ? (u.name || t("profile.guest")) : t("profile.guest");
    if (avatar) avatar.textContent = u ? (u.avatar || "\u{1F9D1}") : "\u{1F9D1}";
  }

  function bindProfileEdit() {
    const rename = $("#renameBtn");
    const big = $("#avatarBig");
    const name = $("#profileDisplayName");

    if (rename) {
      rename.onclick = () => {
        if (!global.Profile || !global.Profile.current()) return;
        const n = prompt("Нік:", global.Profile.current().name || "");
        if (n !== null && n.trim()) {
          global.Profile.rename(n.trim());
          renderProfile();
        }
      };
    }
    if (big) {
      big.onclick = () => {
        if (!global.Profile || !global.Profile.current()) return;
        const emojis = ["\u{1F9D1}", "\u{1F469}", "\u{1F468}", "\u{1F9D2}", "\u{1F47B}", "\u{1F916}", "\u{1F431}", "\u{1F436}", "\u{1F981}", "\u{1F43C}", "\u{1F984}", "\u{1F430}"];
        const cur = global.Profile.current().avatar || "\u{1F9D1}";
        const choice = prompt("Аватар (emoji): " + emojis.join(" "), cur);
        if (choice !== null && choice.trim()) {
          global.Profile.setAvatar(choice.trim());
          renderProfile();
        }
      };
    }
    if (name) {
      name.onclick = () => {
        if (rename) rename.click();
      };
    }
  }

  /* ---------- Дії налаштувань ---------- */
  function bindSettingsActions() {
    document.addEventListener("settings-action", (e) => {
      const id = e.detail && e.detail.id;
      if (!id) return;
      if (id === "export") {
        if (!global.Profile) return;
        const data = JSON.stringify({ profile: global.Profile.current(), records: global.Profile.records(), settings: global.Settings ? global.Settings.DEFAULTS : {} }, null, 2);
        const blob = new Blob([data], { type: "application/json" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "python-copier-data.json";
        a.click();
        toast(t("set.exportDone"));
      } else if (id === "resetRecords") {
        if (global.Profile && global.Profile.resetRecords) global.Profile.resetRecords();
        toast(t("settings.recordsCleared"));
        renderProfile();
      } else if (id === "clearAll") {
        if (confirm(t("settings.clearAll") + "?")) {
          localStorage.clear();
          location.reload();
        }
      } else if (id === "resetSettings") {
        if (global.Settings) global.Settings.resetAll();
        toast(t("set.settingsReset"));
      } else if (id === "google" || id === "github") {
        toast(t("set.socialDemo"));
      }
    });
  }

  /* ---------- Learn cards ---------- */
  function renderLearn() {
    const host = $("#learnSection");
    if (!host) return;
    const items = [
      { ico: "description", k: "🐍", h: "python.title", p: "python.code" },
      { ico: "school", k: "🎯", h: "home.cardPython", p: "python.output" }
    ];
    host.innerHTML = "";
    items.forEach((it) => {
      const c = document.createElement("article");
      c.className = "card elev1 learn-card";
      c.innerHTML = '<span class="material-icons learn-ico">' + it.ico + '</span><h3>' + it.k + " " + t(it.h) + '</h3><p>' + t(it.p) + '</p>';
      host.appendChild(c);
    });
  }

  /* ---------- Init ---------- */
  function init() {
    try { bindRipple(); } catch (e) { console.warn("bindRipple", e); }
    try { bindLang(); } catch (e) { console.warn("bindLang", e); }
    try { bindAudio(); } catch (e) { console.warn("bindAudio", e); }
    try { bindAuth(); } catch (e) { console.warn("bindAuth", e); }
    try { bindProfileEdit(); } catch (e) { console.warn("bindProfileEdit", e); }
    try { updateHeaderProfile(null); } catch (e) {}
    try {
      if (global.Settings) {
        global.Settings.init();
        global.Settings.render($("#settingsBody"));
      }
    } catch (e) { console.warn("Settings", e); }
    try { bindSettingsActions(); } catch (e) { console.warn("bindSettingsActions", e); }
    try { if (global.PythonPad) global.PythonPad.init(); } catch (e) { console.warn("PythonPad", e); }
    try { if (global.Games) global.Games.init(); } catch (e) { console.warn("Games", e); }
    try { if (global.Tools) global.Tools.init(); } catch (e) { console.warn("Tools", e); }
    try { renderLearn(); } catch (e) { console.warn("renderLearn", e); }

    // nav
    document.querySelectorAll("[data-route]").forEach((b) => (b.onclick = () => route(b.dataset.route)));
    document.querySelectorAll("[data-goto]").forEach((b) => (b.onclick = () => route(b.dataset.goto)));
    const pb = $("#profileBtn");
    if (pb && !pb.dataset.shield) pb.onclick = () => route("profile");

    // початковий маршрут
    const hash = (location.hash || "#home").slice(1);
    route(["home", "python", "games", "tools", "feedback", "profile", "settings"].includes(hash) ? hash : "home");

    // apply i18n
    if (global.I18n && global.I18n.apply) global.I18n.apply();

    console.info("[app.js] init done");
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})(window);
