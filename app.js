/* app.js — головний ініціалізатор (v26.10.02d).
   - Навігація через делегування подій: кнопки НЕ можуть "не прив'язатись".
   - renderLearn повертає справжні картки "Що таке Python?" / "Для чого цей проєкт?".
   - Усі блоки init у try/catch: одна помилка не вбиває решту. */
(function (global) {
  const $ = (s) => document.querySelector(s);
  const t = (k, vars) => (global.I18n ? global.I18n.t(k, vars) : k);

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
    const activeRail = $("#mainnav .rail-btn.active");
    if (activeRail && activeRail.scrollIntoView) {
      try { activeRail.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" }); } catch (e) {}
    }
    if (name === "games" && global.Games && global.Games.renderHub) {
      try { global.Games.renderHub(); } catch (e) { console.warn(e); }
    }
    if (name === "tasks" && global.Tasks) {
      try { global.Tasks.render(); } catch (e) { console.warn(e); }
      try { if (global.Contest) global.Contest.render(); } catch (e) { console.warn(e); }
    }
    if (name === "modules" && global.Modules) {
      try { global.Modules.render(); } catch (e) { console.warn(e); }
    }
    if (name === "course" && global.Course) {
      try { global.Course.render(); } catch (e) { console.warn(e); }
    }
    if (name === "profile") {
      try { renderProfile(); } catch (e) { console.warn(e); }
    }
    if (name === "settings" && global.Settings) {
      try { global.Settings.render($("#settingsBody")); } catch (e) { console.warn(e); }
    }
    if (name === "achievements" && global.Achievements) {
      try { global.Achievements.render($("#achGrid")); } catch (e) { console.warn(e); }
    }
    if (name === "help" && global.AppUpdates) {
      try { global.AppUpdates.renderHelp(); } catch (e) { console.warn(e); }
    }
    location.hash = name;
    try { updateNavProgress(); } catch (e) { console.warn("updateNavProgress", e); }
    try { decorateCards(); } catch (e) { console.warn("decorateCards", e); }
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
      const btn = e.target.closest(".btn, .chip-btn, .icon-btn, .chip");
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
      focusBtn.onclick = () => setFocusMode(!document.body.classList.contains("focus-mode"), true);
    }
    document.addEventListener("settingschange", sync);
    sync();
  }

  /* ---------- Режим фокусу ---------- */
  const FOCUS_TARGETS = [
    { route: "python", key: "nav.python", icon: "code" },
    { route: "games", key: "nav.games", icon: "sports_esports" },
    { route: "course", key: "nav.course", icon: "school" },
    { route: "tasks", key: "nav.tasks", icon: "assignment" }
  ];

  function setFocusMode(on, announce) {
    document.body.classList.toggle("focus-mode", on);
    const fb = $("#focusToggle");
    if (fb && !fb.dataset.shield) fb.setAttribute("aria-pressed", String(on));
    if (announce) toast(t(on ? "focus.on" : "focus.off"));
    if (on) {
      const esc = (e) => {
        if (e.key === "Escape" && document.body.classList.contains("focus-mode")) {
          setFocusMode(false, true);
          document.removeEventListener("keydown", esc);
        }
      };
      document.addEventListener("keydown", esc);
    }
    document.dispatchEvent(new CustomEvent("focusmode", { detail: { on } }));
  }

  function bindFocusPicker() {
    const btn = $("#focusPick");
    const exitBtn = $("#focusExit");
    if (exitBtn) exitBtn.onclick = () => { setFocusMode(false, true); paint(); };
    if (!btn || !global.UI) return;
    const label = btn.querySelector(".qm-value");
    const nameOf = (routeName) => {
      const f = FOCUS_TARGETS.find((x) => x.route === routeName);
      return f ? t(f.key) : t("focus.pickNone");
    };
    function paint() {
      const on = document.body.classList.contains("focus-mode");
      label.textContent = on && btn.dataset.route ? nameOf(btn.dataset.route) : t("focus.pickNone");
      btn.classList.toggle("qm-sel", on);
    }
    btn.onclick = () => {
      const on = document.body.classList.contains("focus-mode");
      const items = FOCUS_TARGETS.map((f) => ({
        label: t(f.key), value: f.route, icon: f.icon,
        selected: on && btn.dataset.route === f.route
      }));
      if (on) items.push({ label: t("focus.exit"), value: "", icon: "center_focus_weak" });
      global.UI.menu(btn, items, (it) => {
        if (!it.value) { setFocusMode(false, true); paint(); return; }
        btn.dataset.route = it.value;
        route(it.value);
        setFocusMode(true, true);
        paint();
      });
    };
    document.addEventListener("keyup", paint);
    paint();
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
      loginForm.onsubmit = async (e) => {
        e.preventDefault();
        if (!global.Profile) return;
        const u = ($("#loginUser") || {}).value || "";
        const p = ($("#loginPass") || {}).value || "";
        const msg = $("#loginMsg");
        try {
          const res = await global.Profile.login(u.trim(), p);
          if (res && res.ok) {
            if (msg) { msg.className = "auth-msg ok"; msg.textContent = t("profile.okLogin"); }
            toast(t("profile.okLogin"));
            renderProfile();
          } else if (msg) { msg.className = "auth-msg err"; msg.textContent = t("profile.errLogin"); }
        } catch (err) {
          console.warn("login", err);
          if (msg) { msg.className = "auth-msg err"; msg.textContent = t("profile.errLogin"); }
        }
      };
    }
    if (registerForm) {
      registerForm.onsubmit = async (e) => {
        e.preventDefault();
        if (!global.Profile) return;
        const u = ($("#regUser") || {}).value || "";
        const p = ($("#regPass") || {}).value || "";
        const msg = $("#regMsg");
        try {
          const res = await global.Profile.register(u.trim(), p);
          if (res && res.ok) {
            if (msg) { msg.className = "auth-msg ok"; msg.textContent = t("profile.okRegister"); }
            toast(t("profile.okRegister"));
            renderProfile();
          } else if (msg) {
            msg.className = "auth-msg err";
            msg.textContent = t(res && res.code === "exists" ? "profile.errExists" : "profile.errLogin");
          }
        } catch (err) {
          console.warn("register", err);
          if (msg) { msg.className = "auth-msg err"; msg.textContent = t("profile.errLogin"); }
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
      updateHeaderProfile();
      return;
    }
    auth.classList.add("hidden");
    prof.classList.remove("hidden");
    const info = global.Profile.info() || {};
    const avatarChar = global.Profile.getAvatar() || "\u{1F9D1}";
    const nameEl = $("#profileDisplayName");
    const meta = $("#profileMeta");
    const avatar = $("#avatarBig");
    const panel = $("#profilePanel");
    if (nameEl) nameEl.textContent = info.name || global.Profile.getNickname() || "—";
    if (meta) meta.textContent = (t("profile.memberSince") || "member since") + " " + (info.created ? new Date(info.created).toLocaleDateString() : "");
    if (global.Avatar) {
      global.Avatar.renderAvatar(avatar, avatarChar);
      global.Avatar.renderBackground(panel, global.Avatar.getBg());
    } else {
      if (avatar) avatar.textContent = avatarChar;
    }
    const grid = $("#recordsGrid");
    if (grid) {
      grid.innerHTML = "";
      const recs = global.Profile.getRecords() || {};
      const keys = Object.keys(recs);
      if (!keys.length) {
        const p = document.createElement("p");
        p.className = "muted";
        p.textContent = t("profile.noRecords");
        grid.appendChild(p);
      } else {
        const meta = (global.Games && global.Games.list ? global.Games.list() : []).reduce((acc, g) => {
          acc[g.id] = g; return acc;
        }, {});
        keys.forEach((k) => {
          const g = meta[k];
          const d = document.createElement("div");
          d.className = "record";
          const name = g ? t(g.name) : (k === "contest" ? t("contest.title") : k);
          const unit = g && g.unit ? " " + t(g.unit) : "";
          d.innerHTML = '<div class="g"></div><div class="v"></div>';
          d.querySelector(".g").textContent = name;
          d.querySelector(".v").textContent = recs[k] + unit;
          grid.appendChild(d);
        });
      }
    }
    updateHeaderProfile();
  }

  function updateHeaderProfile() {
    const nameEl = $("#profileName");
    const avatar = $("#avatarTop");
    const loggedIn = !!(global.Profile && global.Profile.current());
    const info = loggedIn ? (global.Profile.info() || {}) : {};
    if (nameEl) nameEl.textContent = loggedIn ? (info.name || global.Profile.getNickname()) : t("profile.guest");
    const avatarVal = (loggedIn && global.Profile.getAvatar()) || "\u{1F9D1}";
    if (global.Avatar) {
      global.Avatar.renderAvatar(avatar, avatarVal);
    } else if (avatar) {
      avatar.textContent = avatarVal;
    }
  }

  function bindProfileEdit() {
    const rename = $("#renameBtn");
    const big = $("#avatarBig");
    const name = $("#profileDisplayName");
    const bgBtn = $("#bgEditBtn");
    if (rename) {
      rename.onclick = () => {
        if (!global.Profile || !global.Profile.current()) return;
        if (global.Avatar) {
          global.Avatar.openNicknameModal((val) => {
            global.Profile.rename(val);
            renderProfile();
          });
        } else {
          const n = prompt("Нік:", global.Profile.getNickname() || "");
          if (n !== null && n.trim()) { global.Profile.rename(n.trim()); renderProfile(); }
        }
      };
    }
    if (big) {
      big.onclick = () => {
        if (!global.Profile || !global.Profile.current()) return;
        if (global.Avatar) {
          global.Avatar.openAvatarModal((val) => {
            global.Profile.setAvatar(val);
            renderProfile();
          });
        } else {
          const emojis = ["\u{1F9D1}", "\u{1F469}", "\u{1F468}", "\u{1F9D2}", "\u{1F47B}", "\u{1F916}", "\u{1F431}", "\u{1F436}", "\u{1F981}", "\u{1F43C}", "\u{1F984}", "\u{1F430}"];
          const cur = global.Profile.getAvatar() || "\u{1F9D1}";
          const choice = prompt("Аватар (emoji): " + emojis.join(" "), cur);
          if (choice !== null && choice.trim()) { global.Profile.setAvatar(choice.trim()); renderProfile(); }
        }
      };
    }
    if (bgBtn) {
      bgBtn.onclick = () => {
        if (!global.Profile || !global.Profile.current()) return;
        if (global.Avatar) {
          global.Avatar.openBackgroundModal((val) => {
            global.Avatar.setBg(val);
            renderProfile();
          });
        }
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
        const data = JSON.stringify({ profile: global.Profile.info(), nickname: global.Profile.getNickname(), records: global.Profile.getRecords() || {} }, null, 2);
        const blob = new Blob([data], { type: "application/json" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "python-copier-data.json";
        a.click();
        toast(t("set.exportDone"));
      } else if (id === "resetRecords") {
        if (global.Profile && global.Profile.clearRecords) global.Profile.clearRecords();
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

  /* ---------- Новий інтерфейс: підзаголовки, CTA карток, пошук, лист «Ще», прогрес ---------- */
  const SUB_KEYS = {
    python: "home.cardPythonText", modules: "home.cardModulesText", course: "home.cardCourseText",
    tasks: "home.cardTasksText", games: "home.cardGamesText", profile: "home.cardProfileText",
    tools: "tools.sub", feedback: "feedback.sub", achievements: "ach.sub", settings: "settings.sub"
  };

  function loc(obj) {
    if (!obj) return "";
    const l = global.I18n ? global.I18n.lang : "uk";
    return obj[l] || obj.uk || "";
  }

  function decorateSections() {
    Object.keys(SUB_KEYS).forEach((name) => {
      const head = $("#view-" + name + " .section-head");
      if (!head || head.querySelector(".section-sub")) return;
      const p = document.createElement("p");
      p.className = "section-sub";
      p.setAttribute("data-i18n", SUB_KEYS[name]);
      p.textContent = t(SUB_KEYS[name]);
      head.appendChild(p);
    });
  }

  function decorateCards() {
    document.querySelectorAll("#view-home .cards .card[data-goto]").forEach((card) => {
      if (card.querySelector(".card-cta")) return;
      const s = document.createElement("span");
      s.className = "card-cta";
      s.setAttribute("data-i18n", "home.open");
      s.textContent = t("home.open");
      card.appendChild(s);
    });
  }

  function searchIndex() {
    const out = [];
    document.querySelectorAll("#mainnav .rail-btn[data-route]").forEach((b) => {
      const lab = b.querySelector(".rail-label");
      const ico = b.querySelector(".material-icons");
      const name = b.dataset.route;
      out.push({
        kind: "section", label: t("search.kindSection"), name: lab ? lab.textContent.trim() : name,
        icon: ico ? ico.textContent : "arrow_forward", run: () => route(name)
      });
    });
    try {
      if (global.Modules) global.Modules.all().forEach((p) => out.push({
        kind: "module", label: t("search.kindModule"), name: p.name, icon: "storefront",
        run: () => {
          route("modules");
          const input = $("#modulesSearch");
          if (input) { input.value = p.name; input.dispatchEvent(new Event("input", { bubbles: true })); }
        }
      }));
    } catch (e) { console.warn("search modules", e); }
    try {
      if (global.Tasks) global.Tasks.list().forEach((x) => out.push({
        kind: "task", label: t("search.kindTask"), name: loc(x.title), icon: "assignment",
        run: () => { route("tasks"); global.Tasks.open(x.id); }
      }));
    } catch (e) { console.warn("search tasks", e); }
    try {
      if (global.Course) global.Course.lessons().forEach((x) => out.push({
        kind: "lesson", label: t("search.kindLesson"), name: loc(x.title), icon: "school",
        run: () => { route("course"); global.Course.open(x.id); }
      }));
    } catch (e) { console.warn("search course", e); }
    try {
      if (global.Games) global.Games.list().forEach((g) => out.push({
        kind: "game", label: t("search.kindGame"), name: t(g.name), icon: "sports_esports",
        run: () => { route("games"); global.Games.open(g.id); }
      }));
    } catch (e) { console.warn("search games", e); }
    return out;
  }

  function bindGlobalSearch() {
    const box = $("#appbarSearch");
    const input = $("#globalSearch");
    const pop = $("#searchPop");
    if (!box || !input || !pop) return;
    let hot = -1;

    const close = () => { pop.hidden = true; hot = -1; };
    const norm = (s) => String(s).toLowerCase().replace(/['’`]/g, "").replace(/i̇/g, "i");

    function fill(query) {
      const q = norm(query.trim());
      if (!q) return [];
      const items = searchIndex();
      const hits = [];
      for (const it of items) {
        const n = norm(it.name);
        if (n.startsWith(q)) hits.push({ it, rank: 0 });
        else if (n.includes(q)) hits.push({ it, rank: 1 });
      }
      hits.sort((a, b) => a.rank - b.rank || a.it.name.length - b.it.name.length);
      return hits.slice(0, 12).map((h) => h.it);
    }

    function render(hits) {
      pop.innerHTML = "";
      if (!hits.length) {
        const empty = document.createElement("div");
        empty.className = "search-empty";
        empty.textContent = t("search.empty");
        pop.appendChild(empty);
        return;
      }
      hits.forEach((it, i) => {
        const row = document.createElement("button");
        row.type = "button";
        row.className = "search-row" + (i === hot ? " is-hot" : "");
        const ico = document.createElement("span");
        ico.className = "material-icons";
        ico.textContent = it.icon;
        const name = document.createElement("span");
        name.className = "search-row-name";
        name.textContent = it.name;
        const kind = document.createElement("span");
        kind.className = "search-row-kind";
        kind.textContent = it.label;
        row.append(ico, name, kind);
        row.addEventListener("mousedown", (e) => { e.preventDefault(); });
        row.addEventListener("click", () => pick(it));
        pop.appendChild(row);
      });
    }

    function pick(it) {
      if (!it) return;
      try { it.run(); } catch (e) { console.warn("search pick", e); }
      input.value = "";
      close();
      input.blur();
      document.body.classList.remove("search-open");
    }

    input.addEventListener("input", () => {
      const q = input.value.trim();
      if (!q) { close(); return; }
      hot = 0;
      render(fill(q));
      pop.hidden = false;
    });
    input.addEventListener("focus", () => {
      if (input.value.trim()) { render(fill(input.value)); pop.hidden = false; }
    });
    input.addEventListener("keydown", (e) => {
      const rows = pop.querySelectorAll(".search-row");
      if (e.key === "Escape") { close(); input.blur(); return; }
      if (!rows.length) return;
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        hot = (hot + (e.key === "ArrowDown" ? 1 : -1) + rows.length) % rows.length;
        rows.forEach((r, i) => r.classList.toggle("is-hot", i === hot));
        rows[hot].scrollIntoView({ block: "nearest" });
      } else if (e.key === "Enter") {
        e.preventDefault();
        pick(fill(input.value)[Math.max(hot, 0)]);
      }
    });
    document.addEventListener("click", (e) => { if (!box.contains(e.target)) close(); });
    document.addEventListener("keydown", (e) => {
      if (e.key === "/" && !/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName)) {
        e.preventDefault(); input.focus();
      }
    });
    document.addEventListener("langchange", () => { if (!pop.hidden && input.value.trim()) render(fill(input.value)); });

    const mBtn = $("#mobileSearchBtn");
    if (mBtn) {
      mBtn.addEventListener("click", () => {
        document.body.classList.add("search-open");
        input.focus();
      });
      input.addEventListener("blur", () => {
        setTimeout(() => {
          if (!input.value.trim()) { document.body.classList.remove("search-open"); close(); }
        }, 160);
      });
    }
  }

  function bindMoreSheet() {
    const sheet = $("#moreSheet");
    const grid = $("#moreSheetGrid");
    const btn = $("#navMore");
    if (!sheet || !grid || !btn) return;

    function build() {
      grid.innerHTML = "";
      document.querySelectorAll("#mainnav .rail-btn[data-route]").forEach((src) => {
        const b = document.createElement("button");
        b.type = "button";
        b.classList.toggle("active", src.classList.contains("active"));
        const ico = document.createElement("span");
        ico.className = "material-icons";
        ico.textContent = (src.querySelector(".material-icons") || {}).textContent || "";
        const lab = document.createElement("span");
        lab.textContent = (src.querySelector(".rail-label") || {}).textContent || "";
        b.append(ico, lab);
        b.addEventListener("click", () => { route(src.dataset.route); close(); });
        grid.appendChild(b);
      });
    }
    const open = () => { build(); sheet.hidden = false; document.body.classList.add("sheet-open"); };
    const close = () => { sheet.hidden = true; document.body.classList.remove("sheet-open"); };
    btn.addEventListener("click", () => { sheet.hidden ? open() : close(); });
    sheet.querySelectorAll("[data-more-close]").forEach((el) => el.addEventListener("click", close));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !sheet.hidden) close(); });
    document.addEventListener("routechange", close);
  }

  function updateNavProgress() {
    const fill = $("#navProgressFill");
    const text = $("#navProgressText");
    if (!fill || !text) return;
    let done = 0, total = 0;
    try {
      if (global.Course) { total = global.Course.count || 0; done = global.Course.done(); }
    } catch (e) { return; }
    if (!total) return;
    const pct = Math.round((done / total) * 100);
    fill.style.width = pct + "%";
    text.textContent = t("course.progress", { n: done, total: total, percent: pct });
  }

  /* ---------- Init ---------- */
  function init() {
    try { bindNavDelegation(); } catch (e) { console.warn("bindNavDelegation", e); }
    try { bindRipple(); } catch (e) { console.warn("bindRipple", e); }
    try { bindLang(); } catch (e) { console.warn("bindLang", e); }
    try { bindAudio(); } catch (e) { console.warn("bindAudio", e); }
    try { bindAuth(); } catch (e) { console.warn("bindAuth", e); }
    try { bindProfileEdit(); } catch (e) { console.warn("bindProfileEdit", e); }
    try { renderProfile(); } catch (e) { console.warn("renderProfile", e); }
    try {
      if (global.Settings) {
        global.Settings.init();
        global.Settings.render($("#settingsBody"));
      }
    } catch (e) { console.warn("Settings", e); }
    try { bindSettingsActions(); } catch (e) { console.warn("bindSettingsActions", e); }
    try { if (global.PythonPad) global.PythonPad.init(); } catch (e) { console.warn("PythonPad", e); }
    try { if (global.Tasks) global.Tasks.init(); } catch (e) { console.warn("Tasks", e); }
    try { if (global.Contest) global.Contest.init(); } catch (e) { console.warn("Contest", e); }
    try { if (global.Course) global.Course.init(); } catch (e) { console.warn("Course", e); }
    try { if (global.Games) global.Games.init(); } catch (e) { console.warn("Games", e); }
    try { if (global.Tools) global.Tools.init(); } catch (e) { console.warn("Tools", e); }
    try { renderLearn(); } catch (e) { console.warn("renderLearn", e); }
    try { decorateSections(); } catch (e) { console.warn("decorateSections", e); }
    try { decorateCards(); } catch (e) { console.warn("decorateCards", e); }
    try { bindGlobalSearch(); } catch (e) { console.warn("bindGlobalSearch", e); }
    try { bindMoreSheet(); } catch (e) { console.warn("bindMoreSheet", e); }
    try { bindFocusPicker(); } catch (e) { console.warn("bindFocusPicker", e); }
    try { updateNavProgress(); } catch (e) { console.warn("updateNavProgress", e); }

    // початковий маршрут
    try {
      const hash = (location.hash || "#home").slice(1);
      route(["home", "python", "modules", "course", "tasks", "games", "tools", "feedback", "profile", "achievements", "settings", "help"].includes(hash) ? hash : "home");
    } catch (e) { console.warn("initial route", e); }

    if (global.I18n && global.I18n.apply) { try { global.I18n.apply(); } catch (e) {} }
    try { syncNavTitles(); } catch (e) { console.warn("syncNavTitles", e); }
    document.addEventListener("langchange", () => { try { syncNavTitles(); } catch (e) {} });
    console.info("[app.js] init done");
  }

  function syncNavTitles() {
    document.querySelectorAll("#mainnav .rail-btn").forEach((btn) => {
      const lab = btn.querySelector(".rail-label");
      if (lab) btn.title = lab.textContent.trim();
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})(window);
