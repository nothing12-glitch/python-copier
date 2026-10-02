/* app.js — головний ініціалізатор (v26.10.02d).
   - Навігація через делегування подій: кнопки НЕ можуть "не прив'язатись".
   - renderLearn повертає справжні картки "Що таке Python?" / "Для чого цей проєкт?".
   - Усі блоки init у try/catch: одна помилка не вбиває решту. */
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
    console.info("[app.js] route ->", name);
    document.dispatchEvent(new CustomEvent("routechange", { detail: name }));
  }
  global.route = route;

  /* ---------- Навігація: делегування на весь документ (безсмертне) ---------- */
  function bindNavDelegation() {
    document.addEventListener("click", (e) => {
      const el = e.target.closest ? e.target.closest("[data-route],[data-goto]") : null;
      if (!el) return;
      e.preventDefault();
      const name = el.dataset.route || el.dataset.goto;
      if (name) route(name);
    });
  }

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
      if (global.Settings) { try { global.Settings.render($("#settingsBody")); } catch (e) {} }
      renderLearn();
    });
  }

  /* ---------- Аудіо (null-safe) ---------- */
  function bindAudio() {
    const sfxBtn = $("#sfxToggle");
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
      const musicBtn = $("#musicToggle");
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
        tabs.forEach((x) => x.classList.toggle("active", x === tab));
        const mode = tab.dataset.authtab;
        if (loginForm) loginForm.classList.toggle("hidden", mode !== "login");
        if (registerForm) registerForm.classList.toggle("hidden", mode !== "register");
      };
    });
    if (loginForm) {
      loginForm.onsubmit = (e) => {
        e.preventDefault();
        if (!global.Profile) return;
        const u = ($("#loginUser") || {}).value || "";
        const p = ($("#loginPass") || {}).value || "";
        const msg = $("#loginMsg");
        const res = global.Profile.login(u.trim(), p);
        if (res && res.ok) {
          if (msg) { msg.className = "auth-msg ok"; msg.textContent = t("profile.okLogin"); }
          toast(t("profile.okLogin"));
          renderProfile();
        } else if (msg) { msg.className = "auth-msg err"; msg.textContent = t("profile.errLogin"); }
      };
    }
    if (registerForm) {
      registerForm.onsubmit = (e) => {
        e.preventDefault();
        if (!global.Profile) return;
        const u = ($("#regUser") || {}).value || "";
        const p = ($("#regPass") || {}).value || "";
        const msg = $("#regMsg");
        const res = global.Profile.register(u.trim(), p);
        if (res && res.ok) {
          if (msg) { msg.className = "auth-msg ok"; msg.textContent = t("profile.okRegister"); }
          toast(t("profile.okRegister"));
          renderProfile();
        } else if (msg) { msg.className = "auth-msg err"; msg.textContent = t("profile.errExists"); }
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
        if (n !== null && n.trim()) { global.Profile.rename(n.trim()); renderProfile(); }
      };
    }
    if (big) {
      big.onclick = () => {
        if (!global.Profile || !global.Profile.current()) return;
        const emojis = ["\u{1F9D1}", "\u{1F469}", "\u{1F468}", "\u{1F9D2}", "\u{1F47B}", "\u{1F916}", "\u{1F431}", "\u{1F436}", "\u{1F981}", "\u{1F43C}", "\u{1F984}", "\u{1F430}"];
        const cur = global.Profile.current().avatar || "\u{1F9D1}";
        const choice = prompt("Аватар (emoji): " + emojis.join(" "), cur);
        if (choice !== null && choice.trim()) { global.Profile.setAvatar(choice.trim()); renderProfile(); }
      };
    }
    if (name) name.onclick = () => { if (rename) rename.click(); };
  }

  /* ---------- Дії налаштувань ---------- */
  function bindSettingsActions() {
    document.addEventListener("settings-action", (e) => {
      const id = e.detail && e.detail.id;
      if (!id) return;
      if (id === "export") {
        if (!global.Profile) return;
        const data = JSON.stringify({ profile: global.Profile.current(), records: global.Profile.records ? global.Profile.records() : {} }, null, 2);
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
        if (confirm(t("settings.clearAll") + "?")) { localStorage.clear(); location.reload(); }
      } else if (id === "resetSettings") {
        if (global.Settings) global.Settings.resetAll();
        toast(t("set.settingsReset"));
      } else if (id === "google" || id === "github") {
        toast(t("set.socialDemo"));
      }
    });
  }

  /* ---------- Learn cards: СПРАВЖНІ тексти ---------- */
  const LEARN = {
    uk: [
      { ico: "🐍", h: "Що таке Python?", p: "Python — одна з найпопулярніших мов програмування у світі: проста й читабельна, але водночас потужна. Нею створюють сайти, ігри, аналіз даних, штучний інтелект та автоматизацію. На цьому сайті ти можеш писати й запускати Python-код прямо у браузері — нічого не встановлюючи." },
      { ico: "🎯", h: "Для чого цей проєкт?", p: "Це навчальний майданчик: знайомся з Python на готових прикладах, тренуйся з підказками, відпочивай у міні-іграх та інструментах, зберігай рекорди у профілі. Акаунт і дані — локальні (демо, без сервера), тож усе залишається у твоєму браузері." }
    ],
    en: [
      { ico: "🐍", h: "What is Python?", p: "Python is one of the most popular programming languages in the world: simple and readable, yet powerful. It is used for websites, games, data analysis, artificial intelligence and automation. On this site you can write and run Python code right in your browser — nothing to install." },
      { ico: "🎯", h: "Why this project?", p: "It is a learning playground: get to know Python with ready examples, practice with hints, relax with mini-games and tools, and keep records in your profile. The account and data are local (demo, no server), so everything stays in your browser." }
    ],
    tr: [
      { ico: "🐍", h: "Python nedir?", p: "Python, dünyanın en popüler programlama dillerinden biridir: basit ve okunaklı, aynı zamanda güçlü. Web siteleri, oyunlar, veri analizi, yapay zekâ ve otomasyon için kullanılır. Bu sitede Python kodunu doğrudan tarayıcıda yazıp çalıştırabilirsin — kurulum gerekmez." },
      { ico: "🎯", h: "Bu proje neden var?", p: "Burası bir öğrenme alanı: hazır örneklerle Python'u tanı, ipuçlarıyla pratik yap, mini oyunlar ve araçlarla dinlen, rekorlarını profilinde sakla. Hesap ve veriler yereldir (demo, sunucu yok), her şey tarayıcında kalır." }
    ]
  };
  function renderLearn() {
    const host = $("#learnSection");
    if (!host) return;
    const lang = global.I18n ? global.I18n.lang : "uk";
    const items = LEARN[lang] || LEARN.uk;
    host.innerHTML = "";
    items.forEach((it) => {
      const c = document.createElement("article");
      c.className = "card elev1 learn-card";
      const ico = document.createElement("span");
      ico.className = "learn-ico";
      ico.textContent = it.ico;
      const h = document.createElement("h3");
      h.textContent = it.h;
      const p = document.createElement("p");
      p.textContent = it.p;
      c.append(ico, h, p);
      host.appendChild(c);
    });
  }

  /* ---------- Init ---------- */
  function init() {
    try { bindNavDelegation(); } catch (e) { console.warn("bindNavDelegation", e); }
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

    // початковий маршрут
    try {
      const hash = (location.hash || "#home").slice(1);
      route(["home", "python", "games", "tools", "feedback", "profile", "settings"].includes(hash) ? hash : "home");
    } catch (e) { console.warn("initial route", e); }

    if (global.I18n && global.I18n.apply) { try { global.I18n.apply(); } catch (e) {} }
    console.info("[app.js] init done");
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})(window);
