/* net.js — розмова з сервером: справжній вхід і синхронізація прогресу.
   Головне правило: якщо мережі немає, додаток працює ровно так само, як і раніше, —
   акаунт і сейв лишаються на пристрої, нічого не губиться. */
(function (global) {
  const API = "https://python-copier-api.homakarsenij68.workers.dev";
  const SESSION_KEY = "app.session";
  const CLOUD_KEY = "app.cloudSession";   // "1" — цей вхід зроблено через сервер
  const SYNC_KEY = "app.cloudSyncAt";     // коли хмара остання прийняла сейв, мс
  const SAVE_AT_KEY = "app.cloudSaveAt";  // мітка часу сейва на сервері, мс
  const EDITED_KEY = "app.cloudEdited";   // коли на ЦЬОМУ пристрої востаннє щось змінилось, мс
  const CONFLICT_KEY = "app.cloudConflict"; // хмара старша за нас — чекаємо на рішення людини
  const PENDING_KEY = "app.cloudPending";    // сейв ще не доїхав у хмару, мс зміни
  /* Локальні паролі й локальний вхід не їдуть у хмару і не витягуються з неї:
     на сервері є своя таблиця акаунтів, а сейв — це лише прогрес. */
  const HIDE = ["app.users", "app.session", "app.cloudSession", "app.cloudSyncAt",
    "app.cloudSaveAt", "app.cloudEdited", "app.cloudConflict", "app.cloudPending"];
  const WATCH_MS = 45000;   // як часто придивляємось до сховища
  const MIN_PUSH_MS = 40000; // частіше цей інтервал сейв у хмару не летить
  const BEACON_MAX = 60000;  // стільки ще встигає keepalive-запит під час закриття вкладки

  const I = () => global.I18n;
  const t = (k, v) => (I() ? I().t(k, v) : k);
  const say = (m) => { if (global.App && global.App.toast) global.App.toast(m); };

  let lastPush = 0;
  let busy = false;
  let watch = 0;

  const get = (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } };
  const set = (k, v) => { try { localStorage.setItem(k, String(v)); } catch (e) { /* сховище повне */ } };
  const off = (k) => { try { localStorage.removeItem(k); } catch (e) {} };

  /* «Є незаглане» живе в сховищі, а не в змінній: вкладку можуть закрити
     між зміною й вдалим пушем, і з наступного заходу сейв усе одно доїде. */
  const pending = () => !!get(PENDING_KEY);

  function auto() {
    return !global.Settings || global.Settings.get("cloudAuto") !== false;
  }

  /* Вхід через сервер — оті єдині, хто синхронізується: локальний демо-акаунт
     не має хмарного сейва і не повинен перекривати чужий. */
  function isCloud() {
    return !!get(SESSION_KEY) && get(CLOUD_KEY) === "1";
  }

  function online() {
    return navigator.onLine !== false;
  }

  /* ---------- транспорт ---------- */

  async function raw(path, opts, ms) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), ms || 20000);
    try {
      const res = await fetch(API + path, Object.assign({ credentials: "include", signal: ctrl.signal }, opts || {}));
      const text = await res.text();
      return { net: true, status: res.status, text: text };
    } catch (e) {
      return { net: false, status: 0, text: "" };
    } finally {
      clearTimeout(timer);
    }
  }

  async function call(path, opts, ms) {
    const r = await raw(path, opts, ms);
    if (!r.net) return { net: false, status: 0, data: {} };
    let data = {};
    try { data = JSON.parse(r.text) || {}; } catch (e) { data = {}; }
    return { net: true, status: r.status, data: data };
  }

  function post(path, obj) {
    return call(path, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(obj) });
  }

  /* ---------- акаунти ---------- */

  function cleanHandle(raw) {
    return String(raw || "").trim().toLowerCase().replace(/\s+/g, "");
  }

  /* Код помилки входу: «забагато спроб» і «ім'я не те» — окремі, бо людина
     інакше перебирає пароль, коли проблема зовсім в іншому. */
  function authCode(code) {
    if (code === "slow") return "slow";
    if (code === "badhandle") return "badhandle";
    return "bad";
  }

  async function login(handle, password) {
    const r = await post("/api/login", { handle: cleanHandle(handle), password: password });
    if (!r.net) return { net: false };
    if (r.status === 200 && r.data.ok) return { net: true, ok: true, handle: r.data.handle, name: r.data.name };
    return { net: true, ok: false, code: authCode(r.data.code) };
  }

  async function signup(handle, name, password) {
    const r = await post("/api/signup", { handle: cleanHandle(handle), name: name || handle, password: password });
    if (!r.net) return { net: false };
    if (r.status === 200 && r.data.ok) return { net: true, ok: true, handle: r.data.handle, name: r.data.name };
    return { net: true, ok: false, code: r.data.code === "exists" ? "exists" : authCode(r.data.code) };
  }

  async function logout() {
    await post("/api/logout", {});
    off(CLOUD_KEY); off(SYNC_KEY); off(SAVE_AT_KEY); off(CONFLICT_KEY);
  }

  async function me() {
    const r = await call("/api/me", {}, 10000);
    return r.net && r.status === 200 && r.data.ok ? r.data : null;
  }

  /* ---------- сейв ---------- */

  /* Той самий формат, що й у файла резервної копії: його вже вміє перевіряти
     й застосовувати backup.js, тож два шляхи оновлення сховища не роз'їдуться. */
  function collect() {
    const obj = global.Backup.payload();
    HIDE.forEach((k) => { delete obj.data[k]; });
    obj.count = Object.keys(obj.data).length;
    obj.cloud = true;
    /* at = коли востаннє грали тут, а не коли серіалізували. Інакше кожен пуш
       виглядав би «щойно», і старший пристрій ніколи не програв би. */
    obj.at = new Date(Number(get(EDITED_KEY)) || Date.now()).toISOString();
    return obj;
  }

  function send(obj, keepalive) {
    return raw("/api/save", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(obj),
      keepalive: !!keepalive
    }, keepalive ? 8000 : 40000);
  }

  /* Мітку часу сейва носять у самому об'єкті (поле at), тому старшинство
     визначається без годинника сервера: хто пізніше грав, той і переписує хмару. */
  async function push(silent) {
    if (!isCloud() || busy) return { ok: false, code: "local" };
    if (!online()) { if (!silent) say(t("net.offline")); return { ok: false, code: "offline" }; }
    busy = true;
    try {
      const obj = collect();
      const r = await send(obj, false);
      if (!r.net) { if (!silent) say(t("net.offline")); return { ok: false, code: "offline" }; }
      let data = {};
      try { data = JSON.parse(r.text) || {}; } catch (e) { data = {}; }
      if (r.status === 200 && data.ok) {
        off(PENDING_KEY);
        lastPush = Date.now();
        set(SYNC_KEY, lastPush);
        set(SAVE_AT_KEY, data.at);
        off(CONFLICT_KEY);
        if (!silent) say(t("net.synced"));
        paint();
        return { ok: true, at: data.at };
      }
      if (r.status === 409 && data.code === "newer") {
        /* Хмара старша: тут грали менше, ніж на іншому пристрої. Самовільно
           нічого не викидаємо — позначаємо конфлікт і питаємо лише при ручній
           синхронізації; в авто-режимі людина побачить напис у профілі. */
        off(PENDING_KEY);
        set(CONFLICT_KEY, data.at || 1);
        set(SAVE_AT_KEY, data.at || 0);
        if (!silent) await fetchCloud(false);
        paint();
        return { ok: false, code: "newer" };
      }
      if (!silent) say(data.code === "big" ? t("net.tooBig") : t("net.failed"));
      return { ok: false, code: data.code || "failed" };
    } finally {
      busy = false;
    }
  }

  function pristine() {
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i) || "";
        if (k.indexOf("app.records.") === 0 || k.indexOf("app.course.") === 0 || k.indexOf("app.achievements.") === 0) {
          const v = localStorage.getItem(k);
          if (v && v !== "{}" && v !== "[]") return false;
        }
      }
    } catch (e) { return false; }
    return true;
  }

  /* Місцеву мітку «коли грали тут» переводимо на хмарну: інакше щойно
     застосований сейв видався б новішим і повернувся б на сервер у старому вигляді. */
  function writeCloud(obj) {
    const plan = global.Backup.plan(obj);
    const at = Number(Date.parse(obj.at || "")) || Date.now();
    set(EDITED_KEY, at);
    set(SYNC_KEY, at);
    off(PENDING_KEY);
    off(CONFLICT_KEY);
    global.Backup.restore(obj, "overwrite", plan);
  }

  /* Головний крок «з іншого пристрою»: заходимо в акаунт — і тягнемо сейв звідти. */
  async function fetchCloud(quiet) {
    if (!isCloud()) return { ok: false, code: "local" };
    const r = await raw("/api/save", { method: "GET" }, 30000);
    if (!r.net) { if (!quiet) say(t("net.offline")); return { ok: false, code: "offline" }; }
    if (r.status === 404) {
      /* У хмарі ще порожньо: це перший сейв цього акаунта. */
      if (!quiet) await push(true);
      return { ok: true, empty: true };
    }
    if (r.status !== 200) { if (!quiet) say(t("net.failed")); return { ok: false, code: "failed" }; }
    let obj = null;
    try { obj = JSON.parse(r.text); } catch (e) { obj = null; }
    if (!obj || !global.Backup || !global.Backup.validate(obj).ok) { if (!quiet) say(t("net.failed")); return { ok: false, code: "bad" }; }
    HIDE.forEach((k) => { delete obj.data[k]; });
    const at = Number(Date.parse(obj.at || "")) || Date.now();
    set(SAVE_AT_KEY, at);
    if (pristine()) {
      say(t("net.restored"));
      writeCloud(obj);
      return { ok: true, applied: true };
    }
    if (quiet) return { ok: true, asked: true };
    /* На цьому пристрої вже є якийсь прогрес — питаємо, не вирішуючи за людину.
       Мітку «коли грали тут» чіпаємо лише після того, як людина справді візьме
       хмарний сейв (див. init): інакше скасований діалог тихо перевписав би хмару. */
    set(CONFLICT_KEY, at);
    global.Backup.preview(obj);
    return { ok: true, asked: true };
  }

  /* ---------- стеження за сховищем ---------- */

  function fingerprint() {
    let h = 2166136261;
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i) || "";
        if (k.indexOf("app.") !== 0) continue;
        const v = localStorage.getItem(k) || "";
        const s = k + ":" + v;
        for (let c = 0; c < s.length; c += 7) {
          h ^= s.charCodeAt(c);
          h = Math.imul(h, 16777619);
        }
      }
    } catch (e) { return ""; }
    return String(h >>> 0);
  }

  let last = "";
  function tick() {
    const fp = fingerprint();
    if (last && fp !== last) {
      /* Раз сховище змінилось — це «грали щойно», і сейв чекає на хмару. */
      const now = Date.now();
      set(EDITED_KEY, now);
      set(PENDING_KEY, now);
    }
    last = fp;
    paint();
    if (!isCloud() || !auto() || !pending()) return;
    if (Date.now() - lastPush < MIN_PUSH_MS) return;
    push(true);
  }

  function leaveFlush() {
    if (!isCloud() || !pending() || !auto()) return;
    const obj = collect();
    const text = JSON.stringify(obj);
    if (text.length > BEACON_MAX) return;
    /* Результату keepalive-запиту ми не побачимо, тому «незаглане» лишаем:
       не долетів — наступного заходу сейв усе одно спробує ще раз. */
    send(obj, true);
  }

  /* ---------- відображення статусу ---------- */

  function whenText() {
    if (get(CONFLICT_KEY)) return t("net.conflict");
    if (pending()) return t("net.pending");
    const rawv = get(SYNC_KEY);
    if (!rawv) return t("net.never");
    const d = new Date(Number(rawv));
    if (isNaN(d.getTime())) return t("net.never");
    const min = Math.round((Date.now() - d.getTime()) / 60000);
    if (min < 1) return t("net.now");
    if (min < 60) return t("net.minutes", { n: min });
    if (min < 1440) return t("net.hours", { n: Math.round(min / 60) });
    return d.toLocaleDateString();
  }

  function paint() {
    const el = document.getElementById("cloudStatus");
    if (!el) return;
    el.textContent = isCloud() ? whenText() : t("net.local");
  }

  /* ---------- ініціалізація ---------- */

  function onAction(ev) {
    const id = ev.detail && ev.detail.id;
    if (id === "cloudPush") push(false);
    else if (id === "cloudPull") fetchCloud(false);
  }

  /* backup.js після застосування копії перезапускає сторінку — це єдиний
     надійний знак, що людина справді взяла хмарний сейв із діалогу. */
  function adoptRestored() {
    const at = Number(get(SAVE_AT_KEY)) || 0;
    const done = localStorage.getItem("app.backupRestored");
    if (!at || !done) return;
    if (Date.now() - new Date(done).getTime() > 60000) return;
    set(EDITED_KEY, at);
    set(SYNC_KEY, at);
    off(PENDING_KEY);
    off(CONFLICT_KEY);
  }

  function init() {
    adoptRestored();
    document.addEventListener("settings-action", onAction);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") leaveFlush();
      else paint();
    });
    window.addEventListener("pagehide", leaveFlush);
    window.addEventListener("online", () => { paint(); });
    watch = setInterval(tick, WATCH_MS);
    last = fingerprint();
    paint();
    if (isCloud()) me().then((who) => { if (!who) { off(CLOUD_KEY); paint(); } });
    console.info("[net.js] ready", API);
  }

  global.Net = {
    API, init, login, signup, logout, me,
    push, pull: fetchCloud, collect, isCloud, auto,
    status: whenText, paint
  };
})(window);
