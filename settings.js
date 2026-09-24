/* Централізовані налаштування: схема, збереження, застосування ефектів, рендер UI */
(function (global) {
  const KEY = "app.settings";

  const DEFAULTS = {
    // Вигляд
    theme: "auto", accent: "purple", bgGlow: true, cursorGlow: true, bgAnimate: true,
    reduceMotion: false, compact: false, fontSize: 14,
    // Редактор
    lineNumbers: true, wordWrap: true, autocomplete: true, tabSize: 4, autosaveCode: true, timestamps: false,
    // Звук
    sfx: true, music: false, sfxVolume: 0.25, musicVolume: 0.12,
    // Ігри
    snakeSpeed: "normal", memorySize: 8, trackRecords: true, showHints: true, shortcuts: true,
    // Мова
    language: null // null = використовувати поточну з i18n
  };

  let state = load();

  function load() {
    try { return Object.assign({}, DEFAULTS, JSON.parse(localStorage.getItem(KEY)) || {}); }
    catch { return Object.assign({}, DEFAULTS); }
  }
  function save() { localStorage.setItem(KEY, JSON.stringify(state)); }

  function get(k) { return state[k]; }
  function set(k, v) {
    state[k] = v; save(); apply();
    document.dispatchEvent(new CustomEvent("settingschange", { detail: { key: k, value: v } }));
  }
  function resetAll() { state = Object.assign({}, DEFAULTS); save(); apply(); document.dispatchEvent(new CustomEvent("settingschange", { detail: { key: "*", value: null } })); }

  /* ---------- Застосування глобальних ефектів ---------- */
  const darkMQ = global.matchMedia ? global.matchMedia("(prefers-color-scheme: dark)") : null;
  function isDark() { return state.theme === "dark" || (state.theme === "auto" && !!darkMQ && darkMQ.matches); }

  function apply() {
    const b = document.body;
    b.classList.toggle("dark", isDark());
    b.dataset.accent = state.accent;
    b.classList.toggle("bg-glow-on", !!state.bgGlow);
    b.classList.toggle("bg-animate-on", !!state.bgAnimate);
    b.classList.toggle("cursor-glow-on", !!state.cursorGlow);
    b.classList.toggle("reduce-motion", !!state.reduceMotion);
    b.classList.toggle("compact", !!state.compact);
    b.classList.toggle("no-linenumbers", !state.lineNumbers);
    b.classList.toggle("no-wrap", !state.wordWrap);
    b.classList.toggle("no-hints", !state.showHints);
    document.documentElement.style.setProperty("--editor-font", state.fontSize + "px");
    document.documentElement.style.setProperty("--tab-size", state.tabSize);
    // синхронізувати аудіо
    if (global.Audio2) {
      global.Audio2.setSfxVolume(state.sfxVolume);
      global.Audio2.setMusicVolume(state.musicVolume);
    }
  }

  // Сяйво за курсором
  function initCursorGlow() {
    const g = document.getElementById("cursorGlow");
    if (!g) return;
    let raf = null, x = 0, y = 0;
    window.addEventListener("pointermove", (e) => {
      x = e.clientX; y = e.clientY;
      if (!raf) raf = requestAnimationFrame(() => { g.style.transform = `translate(${x - 250}px, ${y - 250}px)`; raf = null; });
    }, { passive: true });
  }

  /* ---------- Схема UI ---------- */
  // type: switch | select | range | button
  const SCHEMA = [
    { group: "settings.appearance", items: [
      { id: "theme", type: "select", label: "settings.theme", options: [
        ["auto", "set.themeAuto"], ["light", "set.themeLight"], ["dark", "set.themeDark"] ] },
      { id: "accent", type: "select", label: "set.accent", options: [
        ["purple", "set.acc.purple"], ["blue", "set.acc.blue"], ["green", "set.acc.green"], ["orange", "set.acc.orange"], ["pink", "set.acc.pink"] ] },
      { id: "bgGlow", type: "switch", label: "set.bgGlow" },
      { id: "cursorGlow", type: "switch", label: "set.cursorGlow" },
      { id: "bgAnimate", type: "switch", label: "set.bgAnimate" },
      { id: "reduceMotion", type: "switch", label: "set.reduceMotion" },
      { id: "compact", type: "switch", label: "set.compact" },
      { id: "fontSize", type: "range", label: "set.fontSize", min: 12, max: 20, step: 1 }
    ]},
    { group: "set.editor", items: [
      { id: "lineNumbers", type: "switch", label: "set.lineNumbers" },
      { id: "wordWrap", type: "switch", label: "set.wordWrap" },
      { id: "autocomplete", type: "switch", label: "set.autocomplete" },
      { id: "tabSize", type: "select", label: "set.tabSize", options: [["2", "2"], ["4", "4"]] , cast: Number },
      { id: "autosaveCode", type: "switch", label: "set.autosaveCode" },
      { id: "timestamps", type: "switch", label: "set.timestamps" }
    ]},
    { group: "settings.audio", items: [
      { id: "sfx", type: "switch", label: "settings.sound" },
      { id: "music", type: "switch", label: "settings.music" },
      { id: "sfxVolume", type: "range", label: "set.sfxVolume", min: 0, max: 1, step: 0.05 },
      { id: "musicVolume", type: "range", label: "set.musicVolume", min: 0, max: 1, step: 0.05 }
    ]},
    { group: "set.games", items: [
      { id: "snakeSpeed", type: "select", label: "set.snakeSpeed", options: [["slow", "set.slow"], ["normal", "set.normal"], ["fast", "set.fast"]] },
      { id: "memorySize", type: "select", label: "set.memorySize", options: [["6", "6"], ["8", "8"], ["10", "10"]], cast: Number },
      { id: "trackRecords", type: "switch", label: "set.trackRecords" },
      { id: "showHints", type: "switch", label: "set.showHints" },
      { id: "shortcuts", type: "switch", label: "set.shortcuts" }
    ]},
    { group: "settings.language", items: [
      { id: "language", type: "select", label: "settings.language", options: [["uk", "Українська"], ["en", "English"], ["tr", "Türkçe"]] }
    ]},
    { group: "set.account", items: [
      { id: "google", type: "button", label: "set.google", icon: "login", variant: "contained" },
      { id: "github", type: "button", label: "set.github", icon: "login", variant: "outlined" }
    ]},
    { group: "settings.data", items: [
      { id: "export", type: "button", label: "set.export", icon: "download", variant: "outlined" },
      { id: "resetRecords", type: "button", label: "settings.resetRecords", icon: "restart_alt", variant: "outlined danger" },
      { id: "clearAll", type: "button", label: "settings.clearAll", icon: "delete_forever", variant: "outlined danger" },
      { id: "resetSettings", type: "button", label: "set.resetSettings", icon: "settings_backup_restore", variant: "text" }
    ]}
  ];

  const t = (k) => (global.I18n ? global.I18n.t(k) : k);

  function row(item) {
    const wrap = document.createElement("div");
    wrap.className = "setting-row";
    const name = document.createElement("span");
    name.className = "setting-name";
    name.textContent = t(item.label);
    wrap.appendChild(name);

    if (item.type === "switch") {
      const lab = document.createElement("label"); lab.className = "switch";
      const inp = document.createElement("input"); inp.type = "checkbox"; inp.dataset.set = item.id;
      const isToggleVal = item.on !== undefined;
      inp.checked = isToggleVal ? state[item.id] === item.on : !!state[item.id];
      inp.onchange = () => set(item.id, isToggleVal ? (inp.checked ? item.on : inp.checked) : inp.checked);
      const tr = document.createElement("span"); tr.className = "track";
      lab.append(inp, tr); wrap.appendChild(lab);
    }
    else if (item.type === "select") {
      const sel = document.createElement("select"); sel.className = "md-select"; sel.dataset.set = item.id;
      item.options.forEach(([v, lk]) => {
        const o = document.createElement("option"); o.value = v;
        o.textContent = lk.startsWith("set.") || lk.startsWith("settings.") ? t(lk) : lk;
        sel.appendChild(o);
      });
      sel.value = String(item.id === "language" ? (state.language || global.I18n.lang) : (state[item.id] == null ? "" : state[item.id]));
      sel.onchange = () => {
        let v = sel.value; if (item.cast) v = item.cast(v);
        if (item.id === "language") { global.I18n.setLang(v); state.language = v; save(); }
        else set(item.id, v);
      };
      wrap.appendChild(sel);
    }
    else if (item.type === "range") {
      const box = document.createElement("div"); box.className = "range-box";
      const inp = document.createElement("input"); inp.type = "range"; inp.dataset.set = item.id;
      inp.min = item.min; inp.max = item.max; inp.step = item.step; inp.value = state[item.id];
      const val = document.createElement("span"); val.className = "range-val"; val.dataset.setVal = item.id; val.textContent = fmt(state[item.id]);
      inp.oninput = () => { val.textContent = fmt(parseFloat(inp.value)); set(item.id, parseFloat(inp.value)); };
      box.append(inp, val); wrap.appendChild(box);
    }
    else if (item.type === "button") {
      const btn = document.createElement("button");
      btn.className = "btn " + (item.variant || "outlined");
      btn.innerHTML = `<span class="material-icons">${item.icon}</span><span>${t(item.label)}</span>`;
      btn.onclick = () => document.dispatchEvent(new CustomEvent("settings-action", { detail: { id: item.id } }));
      wrap.appendChild(btn);
    }
    return wrap;
  }
  function fmt(v) { return (typeof v === "number" && v < 1 && v > 0) ? v.toFixed(2) : String(v); }

  function render(container) {
    if (!container) return;
    container.innerHTML = "";
    SCHEMA.forEach((g) => {
      const h = document.createElement("h4"); h.className = "settings-group"; h.textContent = t(g.group);
      container.appendChild(h);
      g.items.forEach((it) => container.appendChild(row(it)));
    });
  }

  function syncUI(container) {
    const root = container || document.getElementById("settingsBody");
    if (!root) return;
    root.querySelectorAll("[data-set]").forEach((el) => {
      const id = el.dataset.set;
      if (el.type === "checkbox") {
        const item = findItem(id);
        el.checked = item && item.on !== undefined ? state[id] === item.on : !!state[id];
      } else if (el.type === "range") {
        el.value = state[id];
      } else {
        el.value = String(id === "language" ? (state[id] || global.I18n.lang) : (state[id] == null ? "" : state[id]));
      }
    });
    root.querySelectorAll("[data-set-val]").forEach((el) => { el.textContent = fmt(state[el.dataset.setVal]); });
  }
  function findItem(id) {
    for (const g of SCHEMA) for (const it of g.items) if (it.id === id) return it;
    return null;
  }

  function init() {
    apply();
    initCursorGlow();
    if (darkMQ) {
      const onScheme = () => { if (state.theme === "auto") apply(); };
      if (darkMQ.addEventListener) darkMQ.addEventListener("change", onScheme);
      else darkMQ.addListener(onScheme);
    }
    document.addEventListener("langchange", () => {
      const c = document.getElementById("settingsBody");
      if (c) render(c);
    });
  }

  global.Settings = { get, set, resetAll, apply, render, syncUI, init, DEFAULTS };
})(window);
