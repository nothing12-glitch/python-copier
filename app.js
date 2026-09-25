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

  // Рядки для редагування профілю (окремий словник, щоб не чіпати i18n.js)
  const PL = {
    uk: { pickAvatar: "Обери аватар", rename: "Змінити ім'я", save: "Зберегти", cancel: "Скасувати", renamed: "Ім'я оновлено", avatarSet: "Аватар оновлено", upload: "Фото з ПК" },
    en: { pickAvatar: "Pick an avatar", rename: "Change name", save: "Save", cancel: "Cancel", renamed: "Name updated", avatarSet: "Avatar updated", upload: "Photo from PC" },
    tr: { pickAvatar: "Bir avatar seç", rename: "İsim değiştir", save: "Kaydet", cancel: "İptal", renamed: "İsim güncellendi", avatarSet: "Avatar güncellendi", upload: "PC'den fotoğraf" }
  };
  const pt = (k) => (PL[global.I18n.lang] || PL.uk)[k];

  const AVATARS = [
    "\u{1F600}", "\u{1F60E}", "\u{1F973}", "\u{1F913}", "\u{1F60A}", "\u{1F63A}",
    "\u{1F436}", "\u{1F98A}", "\u{1F43C}", "\u{1F425}", "\u{1F984}", "\u{1F432}",
    "\u{1F680}", "\u{2B50}", "\u{1F308}", "\u{1F525}", "\u{1F3AE}", "\u{1F4BB}",
    "\u{1F3A7}", "\u{26BD}", "\u{1F355}", "\u{1F369}", "\u{2764}", "\u{1F47B}",
    "\u{1F916}", "\u{1F47D}", "\u{1F389}", "\u{1F31F}", "\u{1F3A8}", "\u{1F3B8}"
  ];

  function displayName() {
    const info = global.Profile.info();
    return info ? info.name : global.Profile.getNickname();
  }
  function isSafeDataUrl(s) {
    return /^data:image\/(png|jpeg|webp|gif);base64,[A-Za-z0-9+/=]+$/.test(s);
  }
  function applyAvatar(el) {
    const av = global.Profile.getAvatar();
    if (av && isSafeDataUrl(av)) {
      el.textContent = "";
      el.style.backgroundImage = `url("${av}")`;
      el.style.backgroundSize = "cover";
      el.style.backgroundPosition = "center";
    } else {
      el.style.backgroundImage = "";
      const n = displayName();
      const useEmoji = av && !av.startsWith("data:");
      el.textContent = useEmoji ? av : (n ? n[0].toUpperCase() : "\u{1F464}");
    }
  }

  function closeModals() {
    document.querySelectorAll(".ob-backdrop[data-modal]").forEach((m) => m.remove());
  }

  function modalShell(title) {
    closeModals();
    const bd = document.createElement("div");
    bd.className = "ob-backdrop";
    bd.dataset.modal = "1";
    const card = document.createElement("div");
    card.className = "ob-card";
    const h = document.createElement("h3");
    h.textContent = title;
    card.appendChild(h);
    bd.appendChild(card);
    document.body.appendChild(bd);
    bd.onclick = (ev) => { if (ev.target === bd) closeModals(); };
    document.body.appendChild(bd);
    return card;
  }

  function refreshProfileUI() {
    updateHeaderProfile();
    if ($("#view-profile").classList.contains("active")) renderProfile();
  }

  function openAvatarPicker() {
    const card = modalShell(pt("pickAvatar"));
    const grid = document.createElement("div");
    grid.className = "emoji-grid";
    AVATARS.forEach((e) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "emoji-btn";
      b.textContent = e;
      b.onclick = () => {
        global.Profile.setAvatar(e);
        SFX() && SFX().pop();
        closeModals();
        toast(pt("avatarSet"));
        refreshProfileUI();
      };
      grid.appendChild(b);
    });
    card.appendChild(grid);
    const row = document.createElement("div");
    row.className = "ob-actions";
    const file = document.createElement("input");
    file.type = "file";
    file.accept = "image/*";
    file.className = "hidden";
    file.onchange = () => {
      const f = file.files && file.files[0];
      if (!f) return;
      const url = URL.createObjectURL(f);
      const img = new Image();
      img.onload = () => {
        const size = 128;
        const c = document.createElement("canvas");
        c.width = c.height = size;
        const ctx = c.getContext("2d");
        const min = Math.min(img.width, img.height);
        ctx.drawImage(img, (img.width - min) / 2, (img.height - min) / 2, min, min, 0, 0, size, size);
        global.Profile.setAvatar(c.toDataURL("image/jpeg", 0.85));
        URL.revokeObjectURL(url);
        closeModals();
        toast(pt("avatarSet"));
        refreshProfileUI();
      };
      img.onerror = () => URL.revokeObjectURL(url);
      img.src = url;
    };
    const upload = document.createElement("button");
    upload.className = "btn outlined";
    upload.innerHTML = `<span class="material-icons">upload</span><span>${pt("upload")}</span>`;
    upload.onclick = () => file.click();
    const cancel = document.createElement("button");
    cancel.className = "btn text";
    cancel.textContent = pt("cancel");
    cancel.onclick = closeModals;
    row.append(upload, cancel);
    card.append(file, row);
  }

  function openRenameDialog() {
    const card = modalShell(pt("rename"));
    const inp = document.createElement("input");
    inp.className = "ob-input";
    inp.type = "text";
    inp.maxLength = 24;
    inp.value = displayName();
    const save = () => {
      const v = inp.value.trim();
      if (!v) return;
      global.Profile.rename(v);
      SFX() && SFX().success();
      closeModals();
      toast(pt("renamed"));
      refreshProfileUI();
    };
    inp.addEventListener("keydown", (e) => { if (e.key === "Enter") save(); });
    card.appendChild(inp);
    const row = document.createElement("div");
    row.className = "ob-actions";
    const cancel = document.createElement("button");
    cancel.className = "btn text";
    cancel.textContent = pt("cancel");
    cancel.onclick = closeModals;
    const ok = document.createElement("button");
    ok.className = "btn contained";
    ok.textContent = pt("save");
    ok.onclick = save;
    row.append(cancel, ok);
    card.appendChild(row);
    setTimeout(() => inp.focus(), 60);
  }

  function bindProfileEdit() {
    $("#avatarBig").onclick = () => { SFX() && SFX().click(); openAvatarPicker(); };
    $("#renameBtn").onclick = () => { SFX() && SFX().click(); openRenameDialog(); };
    $("#profileDisplayName").onclick = () => { SFX() && SFX().click(); openRenameDialog(); };
    $("#avatarTop").onclick = (e) => { e.stopPropagation(); SFX() && SFX().click(); openAvatarPicker(); };
    document.addEventListener("profilechange", refreshProfileUI);
  }

  function renderProfile() {
    const info = global.Profile.info();
    const authPanel = $("#authPanel"), profPanel = $("#profilePanel");
    updateHeaderProfile();
    authPanel.classList.toggle("hidden", !!info);
    profPanel.classList.toggle("hidden", !info);
    if (!info) return;
    $("#profileDisplayName").textContent = displayName();
    applyAvatar($("#avatarBig"));
    $("#logoutBtn").classList.remove("hidden");
    $("#profileMeta").textContent = t("profile.memberSince") + " " + new Date(info.created).toLocaleDateString();
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
    $("#profileName").textContent = displayName();
    applyAvatar($("#avatarTop"));
  }

  /* ---------- Learn section (home) ---------- */
  const LEARN = {
    uk: [
      ["\u{1F40D}", "Що таке Python?", "Python — одна з найпопулярніших мов програмування у світі: проста й читабельна, але водночас потужна. Нею створюють сайти, ігри, аналіз даних, штучний інтелект та автоматизацію. На цьому сайті ти можеш писати й запускати Python-код прямо у браузері — нічого не встановлюючи."],
      ["\u{1F3AF}", "Для чого цей проєкт?", "Це навчальний майданчик: знайомся з Python на готових прикладах, тренуйся з підказками, відпочивай у міні-іграх та інструментах, зберігай рекорди у профілі. Акаунт і дані — локальні (демо, без сервера), тож усе залишається у твоєму браузері."]
    ],
    en: [
      ["\u{1F40D}", "What is Python?", "Python is one of the most popular programming languages in the world: simple and readable, yet powerful. It is used for websites, games, data analysis, artificial intelligence and automation. On this site you can write and run Python code right in your browser — nothing to install."],
      ["\u{1F3AF}", "Why this project?", "It is a learning playground: get to know Python with ready examples, practice with hints, relax with mini-games and tools, and keep records in your profile. The account and data are local (demo, no server), so everything stays in your browser."]
    ],
    tr: [
      ["\u{1F40D}", "Python nedir?", "Python, dünyadaki en popüler programlama dillerinden biridir: basit ve okunabilir, ama aynı zamanda güçlüdür. Web siteleri, oyunlar, veri analizi, yapay zeka ve otomasyon için kullanılır. Bu sitede Python kodunu doğrudan tarayıcında yazıp çalıştırabilirsin — hiçbir şey kurmadan."],
      ["\u{1F3AF}", "Bu proje neden var?", "Burası bir öğrenme alanı: hazır örneklerle Python'u tanı, ipuçlarıyla pratik yap, mini oyunlar ve araçlarla eğlen, rekorlarını profilinde sakla. Hesap ve veriler yereldir (demo, sunucu yok), yani her şey tarayıcında kalır."]
    ]
  };

  function renderLearn() {
    const box = $("#learnSection");
    if (!box) return;
    box.innerHTML = "";
    (LEARN[global.I18n.lang] || LEARN.uk).forEach(([ico, title, text]) => {
      const c = document.createElement("article");
      c.className = "card elev1 learn-card";
      const i = document.createElement("span");
      i.className = "card-ico learn-ico";
      i.textContent = ico;
      const h = document.createElement("h3");
      h.textContent = title;
      const p = document.createElement("p");
      p.textContent = text;
      c.append(i, h, p);
      box.appendChild(c);
    });
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
        await global.Profile.socialLogin(id, global.Profile.getNickname());
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
      b.onclick = () => {
        if (b.dataset.lang === global.I18n.lang) return;
        document.body.classList.add("lang-fade");
        setTimeout(() => {
          global.I18n.setLang(b.dataset.lang);
          setTimeout(() => document.body.classList.remove("lang-fade"), 40);
        }, 180);
      };
    });
    document.documentElement.lang = global.I18n.lang;

    // nav
    document.querySelectorAll("[data-route]").forEach((b) => (b.onclick = () => route(b.dataset.route)));
    document.querySelectorAll("[data-goto]").forEach((b) => (b.onclick = () => route(b.dataset.goto)));
    $("#profileBtn").onclick = () => route("profile");

    bindRipple();

    bindAuth();
    bindAudio();
    bindProfileEdit();
    updateHeaderProfile();
    if (global.Settings) { global.Settings.init(); global.Settings.render($("#settingsBody")); }
    bindSettingsActions();
    if (global.PythonPad) global.PythonPad.init();
    if (global.Games) global.Games.init();
    if (global.Tools) global.Tools.init();
    renderLearn();

    // audio needs a user gesture to start; enable on first interaction if music requested
    const kick = () => { global.Audio2.ensure(); if (global.Audio2.musicOn) global.Audio2.setMusic(true); window.removeEventListener("pointerdown", kick); };
    window.addEventListener("pointerdown", kick);

    // re-render profile-dependent labels on lang change
    document.addEventListener("langchange", () => { updateHeaderProfile(); renderLearn(); if ($("#view-profile").classList.contains("active")) renderProfile(); });

    // initial route
    const hash = (location.hash || "#home").slice(1);
    route(["home", "python", "games", "tools", "feedback", "profile", "settings"].includes(hash) ? hash : "home");
  }

  document.addEventListener("DOMContentLoaded", init);
  global.App = { route, toast };
})(window);
