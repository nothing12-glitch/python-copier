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

  /* Темні фони — глибокі, насичені, темні кольори */
  const BACKGROUND_DARK = [
    { name: "Ніч",      css: "linear-gradient(135deg, #0D1B2A, #1B263B, #415A77)" },
    { name: "Космос",   css: "linear-gradient(135deg, #10002B, #240046, #3C096C)" },
    { name: "Обсидіан", css: "linear-gradient(135deg, #000000, #0D1117, #161B22)" },
    { name: "Граніт",   css: "linear-gradient(135deg, #212529, #343A40, #495057)" },
    { name: "Океан",    css: "linear-gradient(135deg, #012A4A, #013A63, #014977)" },
    { name: "Лазурит",  css: "linear-gradient(135deg, #03045E, #023E8A, #0077B6)" },
    { name: "Ліс",      css: "linear-gradient(135deg, #1B4332, #2D6A4F, #40916C)" },
    { name: "Смарагд",  css: "linear-gradient(135deg, #004B23, #006400, #007200)" },
    { name: "Лаванда",  css: "linear-gradient(135deg, #3C096C, #5A189A, #7B2CBF)" },
    { name: "Аметист",  css: "linear-gradient(135deg, #240046, #3C096C, #5A189A)" },
    { name: "Рубін",    css: "linear-gradient(135deg, #641220, #850017, #A4133C)" },
    { name: "Вогонь",   css: "linear-gradient(135deg, #6A040F, #9D0208, #D00000)" },
    { name: "Полуниця", css: "linear-gradient(135deg, #6A040F, #9D0208, #370617)" },
    { name: "Чорниця",  css: "linear-gradient(135deg, #2B2D42, #3D405B, #544B56)" },
    { name: "Індиго",   css: "linear-gradient(135deg, #1A1A2E, #16213E, #0F3460)" },
    { name: "Огірок",   css: "linear-gradient(135deg, #1A3C28, #2B5E3E, #3A7D52)" },
    { name: "М'ята",    css: "linear-gradient(135deg, #1A3C34, #2D6A5A, #3D8B6E)" },
    { name: "Бірюза",   css: "linear-gradient(135deg, #003B46, #07575B, #006D77)" },
    { name: "Шторм",    css: "linear-gradient(135deg, #14213D, #1B2A4A, #2C3E6B)" },
    { name: "Вугілля",  css: "linear-gradient(135deg, #1A1A1A, #2D2D2D, #3D3D3D)" },
    { name: "Бронза",   css: "linear-gradient(135deg, #3E2723, #5D4037, #6D4C41)" },
    { name: "Мідь",     css: "linear-gradient(135deg, #4E342E, #6D4C41, #795548)" },
    { name: "Золото",   css: "linear-gradient(135deg, #5C4813, #7D6118, #9E7A1E)" },
    { name: "Нефрит",   css: "linear-gradient(135deg, #004D40, #00695C, #00796B)" },
    { name: "Грози",    css: "linear-gradient(135deg, #1A237E, #283593, #303F9F)" },
    { name: "Північ",   css: "linear-gradient(135deg, #004D40, #00695C, #01579B)" },
    { name: "Тіні",     css: "linear-gradient(135deg, #121212, #1E1E1E, #2C2C2C)" },
    { name: "Глибина",  css: "linear-gradient(135deg, #0A1628, #132742, #1B3A5C)" },
    { name: "Баклажан", css: "linear-gradient(135deg, #311B92, #4527A0, #512DA8)" },
    { name: "Півонія",  css: "linear-gradient(135deg, #880E4F, #AD1457, #C2185B)" },
    { name: "Янтар",    css: "linear-gradient(135deg, #7F5F00, #997300, #B38600)" },
    { name: "Мармур",   css: "linear-gradient(135deg, #37474F, #455A64, #546E7A)" },
    { name: "Сапфір",   css: "linear-gradient(135deg, #0D47A1, #1565C0, #0A3A8F)" },
    { name: "Малахіт",  css: "linear-gradient(135deg, #1B5E20, #2E7D32, #33691E)" },
    { name: "Веселка",  css: "linear-gradient(135deg, #B71C1C, #E65100, #F9A825, #1B5E20, #0D47A1, #4A148C)" }
  ];

  /* Світлі фони — м'які, пастельні, світлі кольори */
  const BACKGROUND_LIGHT = [
    { name: "Небо",     css: "linear-gradient(135deg, #E3F2FD, #BBDEFB, #90CAF9)" },
    { name: "Ранок",    css: "linear-gradient(135deg, #FFF3E0, #FFE0B2, #FFCC80)" },
    { name: "Луг",      css: "linear-gradient(135deg, #E8F5E9, #C8E6C9, #A5D6A7)" },
    { name: "Хмара",    css: "linear-gradient(135deg, #FAFAFA, #F5F5F5, #EEEEEE)" },
    { name: "Пісок",    css: "linear-gradient(135deg, #FFFDE7, #FFF9C4, #FFF59D)" },
    { name: "Фіалка",   css: "linear-gradient(135deg, #F3E5F5, #E1BEE7, #CE93D8)" },
    { name: "М'ята",    css: "linear-gradient(135deg, #E0F2F1, #B2DFDB, #80CBC4)" },
    { name: "Троянда",  css: "linear-gradient(135deg, #FCE4EC, #F8BBD0, #F48FB1)" },
    { name: "Лимон",    css: "linear-gradient(135deg, #FFFDE7, #FFF9C4, #FFEE58)" },
    { name: "Лаванда",  css: "linear-gradient(135deg, #EDE7F6, #D1C4E9, #B39DDB)" },
    { name: "Бірюза",   css: "linear-gradient(135deg, #E0F7FA, #B2EBF2, #80DEEA)" },
    { name: "Персик",   css: "linear-gradient(135deg, #FBE9E7, #FFCCBC, #FFAB91)" },
    { name: "Чорниця",  css: "linear-gradient(135deg, #E8EAF6, #C5CAE9, #9FA8DA)" },
    { name: "Абрикос",  css: "linear-gradient(135deg, #FFF8E1, #FFECB3, #FFE082)" },
    { name: "Огірок",   css: "linear-gradient(135deg, #F1F8E9, #DCEDC8, #C5E1A5)" },
    { name: "Сакура",   css: "linear-gradient(135deg, #FCE4EC, #F8BBD0, #E1BEE7)" },
    { name: "Попіл",    css: "linear-gradient(135deg, #ECEFF1, #CFD8DC, #B0BEC5)" },
    { name: "Крем",     css: "linear-gradient(135deg, #FFF8E1, #FFECB3, #FFCC80)" },
    { name: "Карамель", css: "linear-gradient(135deg, #EFEBE9, #D7CCC8, #BCAAA4)" },
    { name: "М'ята",    css: "linear-gradient(135deg, #E8F5E9, #C8E6C9, #81C784)" },
    { name: "Азур",     css: "linear-gradient(135deg, #E1F5FE, #B3E5FC, #81D4FA)" },
    { name: "Бузок",    css: "linear-gradient(135deg, #F3E5F5, #CE93D8, #BA68C8)" },
    { name: "Корал",    css: "linear-gradient(135deg, #FBE9E7, #FFAB91, #FF8A65)" },
    { name: "Сніг",     css: "linear-gradient(135deg, #FFFFFF, #FAFAFA, #F5F5F5)" },
    { name: "Перлина",  css: "linear-gradient(135deg, #F3E5F5, #E8EAF6, #E0F7FA)" },
    { name: "Золото",   css: "linear-gradient(135deg, #FFFDE7, #FFF9C4, #FFE082)" },
    { name: "Фуксія",   css: "linear-gradient(135deg, #FCE4EC, #F48FB1, #EC407A)" },
    { name: "Шавлія",   css: "linear-gradient(135deg, #E8F5E9, #DCEDC8, #AED581)" },
    { name: "Туман",    css: "linear-gradient(135deg, #ECEFF1, #CFD8DC, #90A4AE)" },
    { name: "Літній",   css: "linear-gradient(135deg, #E0F7FA, #B2EBF2, #B2DFDB)" },
    { name: "Мармур",   css: "linear-gradient(135deg, #FAFAFA, #F5F5F5, #E0E0E0)" },
    { name: "Янтар",    css: "linear-gradient(135deg, #FFF8E1, #FFE082, #FFD54F)" },
    { name: "Мигдаль",  css: "linear-gradient(135deg, #EFEBE9, #D7CCC8, #A1887F)" },
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
    return document.body.classList.contains("dark");
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
