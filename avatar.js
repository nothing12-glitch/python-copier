/* avatar.js — модал вибору аватара, нікнейму та фону профілю.
   Фони зберігаються окремо для світлої та темної теми. */
(function (global) {
  const AVATAR_BG_DARK_KEY = "app.avatarBg.dark";
  const AVATAR_BG_LIGHT_KEY = "app.avatarBg.light";
  const AVATAR_KEY = "app.avatar";

  const AVATAR_LIST = [
    "\u{1F9D1}", "\u{1F469}", "\u{1F468}", "\u{1F9D2}", "\u{1F476}",
    "\u{1F47B}", "\u{1F916}", "\u{1F47D}", "\u{1F9D9}", "\u{1F9DA}",
    "\u{1F431}", "\u{1F436}", "\u{1F981}", "\u{1F43C}", "\u{1F984}",
    "\u{1F430}", "\u{1F98A}", "\u{1F43B}", "\u{1F42F}", "\u{1F438}",
    "\u{1F989}", "\u{1F432}", "\u{1F409}", "\u{1F98B}", "\u{1F41D}",
    "\u{1F338}", "\u{1F33A}", "\u{1F33B}", "\u{1F340}", "\u{1F341}",
    "\u{1F31F}", "\u{1F308}", "\u{1F525}", "\u{1F4A7}", "\u{1F30A}",
    "\u{1F680}", "\u{1F3AE}", "\u{1F3B5}", "\u{1F3A8}", "\u{1F4BB}"
  ];

  /* Темні фони — насичені, глибокі кольори */
  const BACKGROUND_DARK = [
    { name: "Океан",    css: "linear-gradient(135deg, #0077B6, #00B4D8, #90E0EF)" },
    { name: "Захід",    css: "linear-gradient(135deg, #FF6B35, #F7C59F, #EFEFD0)" },
    { name: "Ліс",      css: "linear-gradient(135deg, #2D6A4F, #40916C, #74C69D)" },
    { name: "Ніч",      css: "linear-gradient(135deg, #0D1B2A, #1B263B, #415A77)" },
    { name: "Пустеля",  css: "linear-gradient(135deg, #D4A373, #E9C46A, #F4A261)" },
    { name: "Лаванда",  css: "linear-gradient(135deg, #7B2CBF, #9D4EDD, #C77DFF)" },
    { name: "М'ята",    css: "linear-gradient(135deg, #52B788, #74C69D, #B7E4C7)" },
    { name: "Корал",    css: "linear-gradient(135deg, #FF6B6B, #FF8E8E, #FFB4B4)" },
    { name: "Золото",   css: "linear-gradient(135deg, #B8860B, #DAA520, #FFD700)" },
    { name: "Срібло",   css: "linear-gradient(135deg, #6C757D, #ADB5BD, #DEE2E6)" },
    { name: "Вогонь",   css: "linear-gradient(135deg, #D00000, #E85D04, #FAA307)" },
    { name: "Лід",      css: "linear-gradient(135deg, #CAF0F8, #ADE8F4, #90E0EF)" },
    { name: "Космос",   css: "linear-gradient(135deg, #10002B, #240046, #3C096C)" },
    { name: "Сакура",   css: "linear-gradient(135deg, #FFB5A7, #FCD5CE, #F8EDEB)" },
    { name: "Огірок",   css: "linear-gradient(135deg, #386641, #6A994E, #A7C957)" },
    { name: "Полуниця", css: "linear-gradient(135deg, #C1121F, #E63946, #F4A261)" },
    { name: "Чорниця",  css: "linear-gradient(135deg, #3D405B, #5E6472, #81B29A)" },
    { name: "Манго",    css: "linear-gradient(135deg, #F77F00, #FCBF49, #EAE2B7)" },
    { name: "Ківі",     css: "linear-gradient(135deg, #588157, #A3B18A, #DAD7CD)" },
    { name: "Персик",   css: "linear-gradient(135deg, #FFCDB2, #FFB4A2, #E5989B)" },
    { name: "Аметист",  css: "linear-gradient(135deg, #5A189A, #7B2CBF, #9D4EDD)" },
    { name: "Бірюза",   css: "linear-gradient(135deg, #006D77, #83C5BE, #EDF6F9)" },
    { name: "Рубін",    css: "linear-gradient(135deg, #641220, #A4133C, #FF4D6D)" },
    { name: "Смарагд",  css: "linear-gradient(135deg, #004B23, #006400, #38B000)" },
    { name: "Топаз",    css: "linear-gradient(135deg, #FFB703, #FB8500, #FFD166)" },
    { name: "Граніт",   css: "linear-gradient(135deg, #343A40, #495057, #6C757D)" },
    { name: "Мідь",     css: "linear-gradient(135deg, #B87333, #DA8A67, #E8B4A0)" },
    { name: "Бронза",   css: "linear-gradient(135deg, #8B5A2B, #A0724A, #C4956A)" },
    { name: "Нефрит",   css: "linear-gradient(135deg, #00A86B, #2ECC71, #A8E6CF)" },
    { name: "Лазурит",  css: "linear-gradient(135deg, #03045E, #0077B6, #00B4D8)" },
    { name: "Янтар",    css: "linear-gradient(135deg, #FF9F1C, #FFBF69, #CBF3F0)" },
    { name: "Обсидіан", css: "linear-gradient(135deg, #000000, #14213D, #2B2D42)" },
    { name: "Перламутр",css: "linear-gradient(135deg, #E0C3FC, #8EC5FC, #A8EDC6)" },
    { name: "Веселка",  css: "linear-gradient(135deg, #FF0000, #FF7F00, #FFFF00, #00FF00, #0000FF, #4B0082, #9400D3)" }
  ];

  /* Світлі фони — м'які, пастельні кольори */
  const BACKGROUND_LIGHT = [
    { name: "Небо",     css: "linear-gradient(135deg, #E3F2FD, #BBDEFB, #90CAF9)" },
    { name: "Ранок",    css: "linear-gradient(135deg, #FFF3E0, #FFE0B2, #FFCC80)" },
    { name: "Луг",      css: "linear-gradient(135deg, #E8F5E9, #C8E6C9, #A5D6A7)" },
    { name: "Хмара",    css: "linear-gradient(135deg, #F5F5F5, #EEEEEE, #E0E0E0)" },
    { name: "Пісок",    css: "linear-gradient(135deg, #FFF8E1, #FFECB3, #FFE082)" },
    { name: "Фіалка",   css: "linear-gradient(135deg, #F3E5F5, #E1BEE7, #CE93D8)" },
    { name: "М'ята",    css: "linear-gradient(135deg, #E0F2F1, #B2DFDB, #80CBC4)" },
    { name: "Троянда",  css: "linear-gradient(135deg, #FCE4EC, #F8BBD0, #F48FB1)" },
    { name: "Лимон",    css: "linear-gradient(135deg, #FFFDE7, #FFF9C4, #FFF59D)" },
    { name: "Попіл",    css: "linear-gradient(135deg, #ECEFF1, #CFD8DC, #B0BEC5)" },
    { name: "Полум'я",  css: "linear-gradient(135deg, #FBE9E7, #FFCCBC, #FFAB91)" },
    { name: "Сніг",     css: "linear-gradient(135deg, #FAFAFA, #F5F5F5, #EEEEEE)" },
    { name: "Туман",    css: "linear-gradient(135deg, #ECEFF1, #CFD8DC, #B0BEC5)" },
    { name: "Цвіт",     css: "linear-gradient(135deg, #FCE4EC, #F8BBD0, #F48FB1)" },
    { name: "Огірок",   css: "linear-gradient(135deg, #F1F8E9, #DCEDC8, #C5E1A5)" },
    { name: "Ягода",    css: "linear-gradient(135deg, #FCE4EC, #F8BBD0, #F48FB1)" },
    { name: "Чорниця",  css: "linear-gradient(135deg, #E8EAF6, #C5CAE9, #9FA8DA)" },
    { name: "Апельсин", css: "linear-gradient(135deg, #FFF3E0, #FFE0B2, #FFCC80)" },
    { name: "Ківі",     css: "linear-gradient(135deg, #F1F8E9, #DCEDC8, #C5E1A5)" },
    { name: "Персик",   css: "linear-gradient(135deg, #FFF3E0, #FFE0B2, #FFCC80)" },
    { name: "Лаванда",  css: "linear-gradient(135deg, #F3E5F5, #E1BEE7, #CE93D8)" },
    { name: "Бірюза",   css: "linear-gradient(135deg, #E0F7FA, #B2EBF2, #80DEEA)" },
    { name: "Малина",   css: "linear-gradient(135deg, #FCE4EC, #F8BBD0, #F48FB1)" },
    { name: "Смарагд",  css: "linear-gradient(135deg, #E8F5E9, #C8E6C9, #A5D6A7)" },
    { name: "Золото",   css: "linear-gradient(135deg, #FFFDE7, #FFF9C4, #FFF59D)" },
    { name: "Камінь",   css: "linear-gradient(135deg, #F5F5F5, #EEEEEE, #E0E0E0)" },
    { name: "Мармур",   css: "linear-gradient(135deg, #FAFAFA, #F5F5F5, #EEEEEE)" },
    { name: "Мідь",     css: "linear-gradient(135deg, #FBE9E7, #FFCCBC, #FFAB91)" },
    { name: "Бронза",   css: "linear-gradient(135deg, #EFEBE9, #D7CCC8, #BCAAA4)" },
    { name: "Нефрит",   css: "linear-gradient(135deg, #E0F2F1, #B2DFDB, #80CBC4)" },
    { name: "Лазур",    css: "linear-gradient(135deg, #E3F2FD, #BBDEFB, #90CAF9)" },
    { name: "Янтар",    css: "linear-gradient(135deg, #FFF8E1, #FFECB3, #FFE082)" },
    { name: "Кварц",    css: "linear-gradient(135deg, #FCE4EC, #F8BBD0, #F48FB1)" },
    { name: "Крема",    css: "linear-gradient(135deg, #FFF8E1, #FFECB3, #FFE082)" },
    { name: "Перлина",  css: "linear-gradient(135deg, #F5F5F5, #EEEEEE, #E0E0E0)" },
    { name: "Веселка",  css: "linear-gradient(135deg, #FFCDD2, #FFF9C4, #C8E6C9, #BBDEFB, #E1BEE7)" }
  ];

  const T = {
    title: { uk: "Аватар", en: "Avatar", tr: "Avatar" },
    bgTitle: { uk: "Фон профілю", en: "Profile background", tr: "Profil arka planı" },
    nickTitle: { uk: "Нікнейм", en: "Nickname", tr: "Takma ad" },
    emoji: { uk: "Emoji", en: "Emoji", tr: "Emoji" },
    upload: { uk: "Завантажити", en: "Upload", tr: "Yükle" },
    uploadHint: { uk: "Оберіть файл з ПК", en: "Choose a file from PC", tr: "PC'den dosya seçin" },
    cancel: { uk: "Скасувати", en: "Cancel", tr: "İptal" },
    save: { uk: "Зберегти", en: "Save", tr: "Kaydet" },
    noBg: { uk: "Без фону", en: "No background", tr: "Arka plan yok" },
    changeBg: { uk: "Змінити фон", en: "Change background", tr: "Arka planı değiştir" },
    changeNick: { uk: "Змінити нік", en: "Change nickname", tr: "Takma adı değiştir" }
  };

  const lang = () => (global.I18n ? global.I18n.lang : "uk");
  const pick = (o) => o[lang()] || o.uk || o.en;

  function isDarkTheme() {
    if (!global.Settings) return false;
    return global.Settings.isDark();
  }

  function getBgKey() {
    return isDarkTheme() ? AVATAR_BG_DARK_KEY : AVATAR_BG_LIGHT_KEY;
  }

  function getBg() { return localStorage.getItem(getBgKey()) || ""; }
  function getBgForTheme(dark) {
    const key = dark ? AVATAR_BG_DARK_KEY : AVATAR_BG_LIGHT_KEY;
    return localStorage.getItem(key) || "";
  }
  function setBg(v) {
    const key = getBgKey();
    if (v) localStorage.setItem(key, v); else localStorage.removeItem(key);
  }

  function closeAll() {
    document.querySelectorAll(".av-modal-backdrop").forEach((el) => el.remove());
  }

  function createBackdrop() {
    closeAll();
    const bd = document.createElement("div");
    bd.className = "av-modal-backdrop";
    bd.onclick = (e) => { if (e.target === bd) closeAll(); };
    document.body.appendChild(bd);
    return bd;
  }

  function createCard(bd) {
    const card = document.createElement("div");
    card.className = "av-modal-card";
    card.setAttribute("role", "dialog");
    card.setAttribute("aria-modal", "true");
    bd.appendChild(card);
    return card;
  }

  function createTabs(card, labels) {
    const tabs = document.createElement("div");
    tabs.className = "av-tabs";
    labels.forEach((label, i) => {
      const btn = document.createElement("button");
      btn.className = "av-tab" + (i === 0 ? " active" : "");
      btn.textContent = label;
      btn.dataset.idx = i;
      btn.onclick = () => {
        tabs.querySelectorAll(".av-tab").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        card.querySelectorAll(".av-tab-content").forEach((c) => c.classList.add("hidden"));
        card.querySelector(`.av-tab-content[data-tab="${i}"]`).classList.remove("hidden");
      };
      tabs.appendChild(btn);
    });
    card.appendChild(tabs);
  }

  function createTabContent(card, idx) {
    const div = document.createElement("div");
    div.className = "av-tab-content" + (idx === 0 ? "" : " hidden");
    div.dataset.tab = idx;
    card.appendChild(div);
    return div;
  }

  function createActions(card, onSave, onCancel) {
    const row = document.createElement("div");
    row.className = "av-actions";
    const cancelBtn = document.createElement("button");
    cancelBtn.className = "btn outlined";
    cancelBtn.textContent = pick(T.cancel);
    cancelBtn.onclick = () => { closeAll(); if (onCancel) onCancel(); };
    const saveBtn = document.createElement("button");
    saveBtn.className = "btn contained";
    saveBtn.textContent = pick(T.save);
    saveBtn.onclick = () => { closeAll(); if (onSave) onSave(); };
    row.append(cancelBtn, saveBtn);
    card.appendChild(row);
  }

  function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  function createUploadArea(container, onFile) {
    const wrap = document.createElement("div");
    wrap.className = "av-upload-wrap";
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.style.display = "none";
    const label = document.createElement("label");
    label.className = "btn outlined av-upload-label";
    label.innerHTML = '<span class="material-icons">upload</span><span>' + pick(T.uploadHint) + "</span>";
    label.onclick = () => input.click();
    const preview = document.createElement("div");
    preview.className = "av-upload-preview";
    wrap.append(input, label, preview);
    container.appendChild(wrap);

    input.onchange = async () => {
      const file = input.files && input.files[0];
      if (!file) return;
      try {
        const url = await readFileAsDataURL(file);
        preview.innerHTML = "";
        const img = document.createElement("img");
        img.src = url;
        img.className = "av-preview-img";
        preview.appendChild(img);
        if (onFile) onFile(url);
      } catch (e) {
        preview.textContent = "Error reading file";
      }
    };
  }

  /* ---------- Аватар модал ---------- */
  function openAvatarModal(onSave) {
    const bd = createBackdrop();
    const card = createCard(bd);
    card.setAttribute("aria-label", pick(T.title));

    const title = document.createElement("h3");
    title.className = "av-modal-title";
    title.textContent = pick(T.title);
    card.appendChild(title);

    createTabs(card, [pick(T.emoji), pick(T.upload)]);

    /* Tab 0: Emoji grid */
    const emojiTab = createTabContent(card, 0);
    const grid = document.createElement("div");
    grid.className = "emoji-grid";
    let selectedAvatar = global.Profile.getAvatar() || "\u{1F9D1}";

    AVATAR_LIST.forEach((emo) => {
      const btn = document.createElement("button");
      btn.className = "emoji-btn" + (emo === selectedAvatar ? " selected" : "");
      btn.textContent = emo;
      btn.onclick = () => {
        grid.querySelectorAll(".emoji-btn").forEach((b) => b.classList.remove("selected"));
        btn.classList.add("selected");
        selectedAvatar = emo;
      };
      grid.appendChild(btn);
    });
    emojiTab.appendChild(grid);

    /* Tab 1: Upload */
    const uploadTab = createTabContent(card, 1);
    createUploadArea(uploadTab, (url) => { selectedAvatar = url; });

    createActions(card, () => { if (onSave) onSave(selectedAvatar); });

    const esc = (e) => { if (e.key === "Escape") { closeAll(); document.removeEventListener("keydown", esc); } };
    document.addEventListener("keydown", esc);
  }

  /* ---------- Нікнейм модал ---------- */
  function openNicknameModal(onSave) {
    const bd = createBackdrop();
    const card = createCard(bd);
    card.setAttribute("aria-label", pick(T.nickTitle));

    const title = document.createElement("h3");
    title.className = "av-modal-title";
    title.textContent = pick(T.nickTitle);
    card.appendChild(title);

    const input = document.createElement("input");
    input.type = "text";
    input.className = "av-nick-input";
    input.value = global.Profile.getNickname() || "";
    input.maxLength = 30;
    input.placeholder = pick(T.nickTitle);
    card.appendChild(input);

    setTimeout(() => input.focus(), 100);

    createActions(card, () => {
      const val = input.value.trim();
      if (val) { if (onSave) onSave(val); }
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const val = input.value.trim();
        if (val) { closeAll(); if (onSave) onSave(val); }
      }
    });

    const esc = (e) => { if (e.key === "Escape") { closeAll(); document.removeEventListener("keydown", esc); } };
    document.addEventListener("keydown", esc);
  }

  /* ---------- Фон модал ---------- */
  function openBackgroundModal(onSave) {
    const bd = createBackdrop();
    const card = createCard(bd);
    card.setAttribute("aria-label", pick(T.bgTitle));

    const title = document.createElement("h3");
    title.className = "av-modal-title";
    const dark = isDarkTheme();
    title.textContent = pick(T.bgTitle) + (dark ? " (🌙)" : " (☀️)");
    card.appendChild(title);

    createTabs(card, [pick(T.emoji), pick(T.upload)]);

    const bgList = dark ? BACKGROUND_DARK : BACKGROUND_LIGHT;
    let selectedBg = getBg();

    /* Tab 0: Pre-made backgrounds */
    const bgTab = createTabContent(card, 0);
    const grid = document.createElement("div");
    grid.className = "av-bg-grid";

    /* No background option */
    const noBgBtn = document.createElement("button");
    noBgBtn.className = "av-bg-btn" + (!selectedBg ? " selected" : "");
    noBgBtn.innerHTML = '<span class="av-bg-swatch" style="background:var(--md-surface);border:2px dashed var(--md-outline)"></span><span class="av-bg-name">' + pick(T.noBg) + "</span>";
    noBgBtn.onclick = () => {
      grid.querySelectorAll(".av-bg-btn").forEach((b) => b.classList.remove("selected"));
      noBgBtn.classList.add("selected");
      selectedBg = "";
    };
    grid.appendChild(noBgBtn);

    bgList.forEach((bg) => {
      const btn = document.createElement("button");
      btn.className = "av-bg-btn" + (bg.css === selectedBg ? " selected" : "");
      btn.innerHTML = '<span class="av-bg-swatch" style="background:' + bg.css + '"></span><span class="av-bg-name">' + bg.name + "</span>";
      btn.onclick = () => {
        grid.querySelectorAll(".av-bg-btn").forEach((b) => b.classList.remove("selected"));
        btn.classList.add("selected");
        selectedBg = bg.css;
      };
      grid.appendChild(btn);
    });
    bgTab.appendChild(grid);

    /* Tab 1: Upload */
    const uploadTab = createTabContent(card, 1);
    createUploadArea(uploadTab, (url) => { selectedBg = url; });

    createActions(card, () => { if (onSave) onSave(selectedBg); });

    const esc = (e) => { if (e.key === "Escape") { closeAll(); document.removeEventListener("keydown", esc); } };
    document.addEventListener("keydown", esc);
  }

  /* ---------- Рендер аватара (emoji або зображення) ---------- */
  function renderAvatar(el, value) {
    if (!el) return;
    el.innerHTML = "";
    if (!value) { el.textContent = "\u{1F9D1}"; return; }
    if (value.startsWith("data:")) {
      const img = document.createElement("img");
      img.src = value;
      img.className = "av-img";
      img.alt = "avatar";
      el.appendChild(img);
    } else {
      el.textContent = value;
    }
  }

  /* ---------- Рендер фону для поточної теми ---------- */
  function renderBackground(el, value) {
    if (!el) return;
    if (!value) { el.style.background = ""; return; }
    if (value.startsWith("data:") || value.startsWith("http")) {
      el.style.background = "url(" + value + ") center/cover no-repeat";
    } else {
      el.style.background = value;
    }
  }

  /* ---------- Застосувати фон для поточної теми ---------- */
  function applyThemeBackground() {
    const panel = document.getElementById("profilePanel");
    if (!panel) return;
    const bg = getBg();
    renderBackground(panel, bg);
  }

  /* ---------- Ініціалізація: слухати зміну теми ---------- */
  function init() {
    document.addEventListener("settingschange", (e) => {
      if (e.detail && e.detail.key === "theme") {
        setTimeout(applyThemeBackground, 50);
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  global.Avatar = {
    openAvatarModal,
    openNicknameModal,
    openBackgroundModal,
    renderAvatar,
    renderBackground,
    applyThemeBackground,
    getBg,
    getBgForTheme,
    setBg,
    BACKGROUND_DARK,
    BACKGROUND_LIGHT
  };
})(window);
