/* backup.js — повна резервна копія локального прогресу: експорт у файл,
   перевірений імпорт із попереднім переглядом і лічильник сховища.
   Секретний ключ ІІ (pyAiKey) у копію не потрапляє. */
(function (global) {
  const PREFIX = "app.";
  const KIND = "python-copier-backup";
  const LAST_KEY = "app.backupLast";
  const HIDDEN_KEYS = ["pyAiKey"];

  const I = () => global.I18n;
  const t = (k, v) => (I() ? I().t(k, v) : k);

  function user() { return (global.Profile && global.Profile.handle()) || "guest"; }
  function version() { return (global.AppUpdates && global.AppUpdates.VERSION) || "0"; }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  }

  function kb(n) {
    if (n < 1024) return n + " B";
    if (n < 1024 * 1024) return (n / 1024).toFixed(1) + " KB";
    return (n / 1024 / 1024).toFixed(2) + " MB";
  }

  function keys() {
    const list = [];
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.indexOf(PREFIX) === 0) list.push(k);
      }
    } catch (e) { /* сховище недоступне */ }
    return list.sort();
  }

  /* З налаштувань вирізаємо секрет: файл копії часто пересилають далі. */
  function sanitize(key, value) {
    if (key !== "app.settings" || !value) return value;
    try {
      const o = JSON.parse(value);
      HIDDEN_KEYS.forEach((k) => { delete o[k]; });
      return JSON.stringify(o);
    } catch (e) { return value; }
  }

  function sectionOf(key) {
    const p = key.split(".");
    return p.length > 1 ? p[1] : key;
  }

  function sectionsOf(list) {
    const map = {};
    list.forEach((k) => {
      const s = sectionOf(k);
      map[s] = (map[s] || 0) + 1;
    });
    return map;
  }

  function payload() {
    const data = {};
    let bytes = 0;
    keys().forEach((k) => {
      const v = sanitize(k, localStorage.getItem(k) || "");
      data[k] = v;
      bytes += k.length + v.length;
    });
    return {
      kind: KIND, app: "python-copier", version: version(),
      at: new Date().toISOString(), user: user(),
      count: Object.keys(data).length, bytes: bytes, data: data
    };
  }

  function stamp() {
    const d = new Date();
    return d.getFullYear() + String(d.getMonth() + 1).padStart(2, "0") + String(d.getDate()).padStart(2, "0");
  }

  /* ---------- Експорт ---------- */
  function exportNow() {
    const obj = payload();
    if (!obj.count) { if (global.App && global.App.toast) global.App.toast(t("set.backupEmpty")); return false; }
    const text = JSON.stringify(obj, null, 2);
    const blob = new Blob([text], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "python-copier-backup-" + obj.user + "-" + stamp() + ".json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 4000);
    localStorage.setItem(LAST_KEY, new Date().toISOString());
    if (global.Achievements && global.Achievements.checkAll) global.Achievements.checkAll();
    if (global.App && global.App.toast) global.App.toast(t("set.backupExported", { n: obj.count }));
    if (global.Audio && global.Audio.sfx) global.Audio.sfx("success");
    return true;
  }

  /* ---------- Перевірка файла ---------- */
  function validate(obj) {
    if (!obj || typeof obj !== "object") return { ok: false, error: t("set.backupErrJson") };
    if (obj.kind !== KIND) return { ok: false, error: t("set.backupErrKind") };
    if (!obj.data || typeof obj.data !== "object") return { ok: false, error: t("set.backupErrData") };
    const names = Object.keys(obj.data);
    if (!names.length) return { ok: false, error: t("set.backupErrEmpty") };
    let kept = 0;
    names.forEach((k) => { if (k.indexOf(PREFIX) === 0 && typeof obj.data[k] === "string") kept++; });
    if (!kept) return { ok: false, error: t("set.backupErrKeys") };
    return { ok: true, kept: kept, dropped: names.length - kept, names: names };
  }

  function planOf(obj) {
    const names = Object.keys(obj.data).filter((k) => k.indexOf(PREFIX) === 0 && typeof obj.data[k] === "string");
    let fresh = 0, existing = 0;
    names.forEach((k) => { if (localStorage.getItem(k) === null) fresh++; else existing++; });
    return { names: names, fresh: fresh, existing: existing, sections: sectionsOf(names) };
  }

  /* ---------- Модалка ---------- */
  function closeAll() {
    document.querySelectorAll(".bk-modal-backdrop").forEach((el) => el.remove());
  }

  function openModal(html, onMount) {
    closeAll();
    const bd = document.createElement("div");
    bd.className = "av-modal-backdrop bk-modal-backdrop";
    bd.onclick = (e) => { if (e.target === bd) closeAll(); };
    const card = document.createElement("div");
    card.className = "av-modal-card bk-modal-card";
    card.setAttribute("role", "dialog");
    card.setAttribute("aria-modal", "true");
    card.innerHTML = html;
    bd.appendChild(card);
    document.body.appendChild(bd);
    document.addEventListener("keydown", function esc(ev) {
      if (ev.key === "Escape") { closeAll(); document.removeEventListener("keydown", esc); }
    });
    if (onMount) onMount(card);
    return card;
  }

  function rowHtml(label, value, cls) {
    return '<div class="bk-row ' + (cls || "") + '"><span>' + escapeHtml(label) + "</span><b>" + escapeHtml(value) + "</b></div>";
  }

  function sectionHtml(map) {
    const parts = Object.keys(map).sort().map((k) =>
      '<span class="bk-tag">' + escapeHtml(k) + "<b>" + map[k] + "</b></span>");
    return '<div class="bk-tags">' + parts.join("") + "</div>";
  }

  /* ---------- Імпорт ---------- */
  function preview(obj) {
    const plan = planOf(obj);
    const same = obj.user === user();
    const html =
      '<h3 class="av-modal-title">' + escapeHtml(t("set.backupPreviewTitle")) + "</h3>" +
      '<div class="bk-rows">' +
        rowHtml(t("set.backupRowCreated"), new Date(obj.at || Date.now()).toLocaleString()) +
        rowHtml(t("set.backupRowVersion"), String(obj.version || "?")) +
        rowHtml(t("set.backupRowKeys"), plan.names.length + " / " + kb(JSON.stringify(obj.data).length)) +
        rowHtml(t("set.backupRowProfile"), (obj.user || "?") + (same ? "" : " ≠ " + user()), same ? "" : "warn") +
      "</div>" +
      '<p class="bk-note">' + escapeHtml(t("set.backupSections")) + "</p>" +
      sectionHtml(plan.sections) +
      '<div class="bk-modes">' +
        '<label><input type="radio" name="bkmode" value="merge" checked><span>' +
          escapeHtml(t("set.backupModeMerge", { n: plan.fresh, skip: plan.existing })) + "</span></label>" +
        '<label><input type="radio" name="bkmode" value="overwrite"><span>' +
          escapeHtml(t("set.backupModeOverwrite", { n: plan.existing })) + "</span></label>" +
      "</div>" +
      '<p class="bk-warn">' + escapeHtml(t("set.backupWarn")) + "</p>" +
      '<div class="bk-actions">' +
        '<button class="btn text" type="button" data-bk="cancel">' + escapeHtml(t("set.backupCancel")) + "</button>" +
        '<button class="btn contained" type="button" data-bk="apply">' + escapeHtml(t("set.backupApply")) + "</button>" +
      "</div>";
    openModal(html, (card) => {
      card.querySelector('[data-bk="cancel"]').onclick = () => { closeAll(); };
      card.querySelector('[data-bk="apply"]').onclick = () => {
        const mode = card.querySelector('input[name="bkmode"]:checked');
        apply(obj, mode ? mode.value : "merge", plan);
      };
    });
  }

  function apply(obj, mode, plan) {
    let written = 0, skipped = 0;
    plan.names.forEach((k) => {
      if (k === "app.users") return;
      if (mode === "merge" && localStorage.getItem(k) !== null) { skipped++; return; }
      localStorage.setItem(k, obj.data[k]);
      written++;
    });
    /* Список профілів завжди доповнюємо: інакше відновлені дані не матимуть свого акаунта. */
    const users = unionUsers(obj.data["app.users"]);
    if (users) { localStorage.setItem("app.users", JSON.stringify(users)); written++; }
    localStorage.setItem("app.backupRestored", new Date().toISOString());
    closeAll();
    if (global.App && global.App.toast) global.App.toast(t("set.backupApplied", { n: written, skip: skipped }));
    if (global.Audio && global.Audio.sfx) global.Audio.sfx("success");
    setTimeout(() => location.reload(), 900);
    return { written: written, skipped: skipped };
  }

  function unionUsers(incomingRaw) {
    if (!incomingRaw) return null;
    let cur, inc;
    try { cur = JSON.parse(localStorage.getItem("app.users") || "{}"); } catch (e) { cur = {}; }
    try { inc = JSON.parse(incomingRaw); } catch (e) { return null; }
    if (!inc || typeof inc !== "object") return null;
    if (!cur || typeof cur !== "object") cur = {};
    const out = Object.assign({}, inc);
    Object.keys(cur).forEach((k) => { if (cur[k] != null) out[k] = cur[k]; });
    return out;
  }

  function pickFile() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json,.json";
    input.style.display = "none";
    document.body.appendChild(input);
    input.onchange = () => {
      const file = input.files && input.files[0];
      document.body.removeChild(input);
      if (!file) return;
      const reader = new FileReader();
      reader.onerror = () => fail(t("set.backupErrRead"));
      reader.onload = () => {
        let obj = null;
        try { obj = JSON.parse(String(reader.result)); } catch (e) { fail(t("set.backupErrJson")); return; }
        const v = validate(obj);
        if (!v.ok) { fail(v.error); return; }
        preview(obj);
      };
      reader.readAsText(file, "utf-8");
    };
    input.click();
  }

  function fail(msg) {
    if (global.App && global.App.toast) global.App.toast(msg);
    if (global.Audio && global.Audio.sfx) global.Audio.sfx("error");
  }

  /* ---------- Лічильник сховища ---------- */
  function lastBackup() {
    try { return localStorage.getItem(LAST_KEY) || ""; } catch (e) { return ""; }
  }

  function showStats() {
    const list = keys();
    let bytes = 0;
    list.forEach((k) => { bytes += k.length + (localStorage.getItem(k) || "").length; });
    const last = lastBackup();
    const p = payload();
    const html =
      '<h3 class="av-modal-title">' + escapeHtml(t("set.backupStatsTitle")) + "</h3>" +
      '<div class="bk-rows">' +
        rowHtml(t("set.backupRowProfile"), user()) +
        rowHtml(t("set.backupRowKeys"), list.length + " / " + kb(bytes)) +
        rowHtml(t("set.backupRowVersion"), version()) +
        rowHtml(t("set.backupRowLast"), last ? new Date(last).toLocaleString() : t("set.backupNever")) +
        rowHtml(t("set.backupRowSecrets"), t("set.backupSecretsOff")) +
      "</div>" +
      '<p class="bk-note">' + escapeHtml(t("set.backupSections")) + "</p>" +
      sectionHtml(sectionsOf(list)) +
      '<p class="bk-warn">' + escapeHtml(t("set.backupSizeNote", { p: p.count })) + "</p>" +
      '<div class="bk-actions">' +
        '<button class="btn text" type="button" data-bk="cancel">' + escapeHtml(t("set.backupClose")) + "</button>" +
        '<button class="btn contained" type="button" data-bk="export">' + escapeHtml(t("set.backupExport")) + "</button>" +
      "</div>";
    openModal(html, (card) => {
      card.querySelector('[data-bk="cancel"]').onclick = () => closeAll();
      card.querySelector('[data-bk="export"]').onclick = () => { exportNow(); closeAll(); };
    });
  }

  function onAction(ev) {
    const id = ev.detail && ev.detail.id;
    if (id === "backupExport") exportNow();
    else if (id === "backupImport") pickFile();
    else if (id === "backupStats") showStats();
  }

  let ready = false;
  function init() {
    if (ready) return;
    ready = true;
    document.addEventListener("settings-action", onAction);
    const restored = localStorage.getItem("app.backupRestored");
    if (restored && Date.now() - new Date(restored).getTime() < 30000) {
      if (global.App && global.App.toast) global.App.toast(t("set.backupRestoredToast"));
    }
    console.info("[backup.js] ready", keys().length);
  }

  global.Backup = {
    init, export: exportNow, import: pickFile, stats: showStats,
    payload, validate, plan: planOf, restore: apply, preview,
    bytes: () => {
      let n = 0;
      keys().forEach((k) => { n += k.length + (localStorage.getItem(k) || "").length; });
      return n;
    },
    count: () => keys().length
  };
})(window);
