/* Профіль/акаунт. Є сервер і мережа — вхід справжній, і прогрес приходить з хмари.
   Немає — усе лишається локально, як було: жодної втраченої гри. */
(function (global) {
  const USERS_KEY = "app.users";
  const SESSION_KEY = "app.session";
  const CLOUD_KEY = "app.cloudSession";
  const NICK_KEY = "app.nickname";
  const AVATAR_KEY = "app.avatar";
  const recKey = (u) => "app.records." + u;

  function getNickname() { return localStorage.getItem(NICK_KEY) || "Github user"; }
  function setNickname(n) {
    n = (n || "").trim() || "Github user";
    localStorage.setItem(NICK_KEY, n);
    return n;
  }
  function getAvatar() { return localStorage.getItem(AVATAR_KEY) || ""; }
  function setAvatar(e) {
    if (e) localStorage.setItem(AVATAR_KEY, e);
    else localStorage.removeItem(AVATAR_KEY);
  }
  function rename(n) {
    n = setNickname(n);
    const c = current();
    if (c) {
      const users = loadUsers();
      if (users[c]) { users[c].name = n; saveUsers(users); }
    }
    return n;
  }

  function loadUsers() { try { return JSON.parse(localStorage.getItem(USERS_KEY)) || {}; } catch { return {}; } }
  function saveUsers(u) { localStorage.setItem(USERS_KEY, JSON.stringify(u)); }

  async function sha256(text) {
    const data = new TextEncoder().encode(text);
    const buf = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
  }
  function salt() {
    const a = new Uint8Array(8);
    crypto.getRandomValues(a);
    return Array.from(a).map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  function current() { return localStorage.getItem(SESSION_KEY) || null; }
  function handle() { return current() || "guest"; }
  function isCloud() { return localStorage.getItem(CLOUD_KEY) === "1"; }

  /* Хмарний акаунт теж записуємо сюди: ім'я, дата, рекорди мають жити й тоді,
     коли мережі немає. Пароль зберігається локальний — на сервері свій хеш. */
  async function rememberLocal(key, name) {
    const users = loadUsers();
    if (!users[key]) {
      const s = salt();
      users[key] = {
        name: name || key, salt: s, hash: await sha256(s + crypto.randomUUID()),
        created: Date.now(), cloud: true
      };
      saveUsers(users);
      return;
    }
    if (name && users[key].name !== name) { users[key].name = name; users[key].cloud = true; saveUsers(users); }
  }

  function openSession(key, name, cloud) {
    localStorage.setItem(SESSION_KEY, key);
    setNickname(name || key);
    if (cloud) localStorage.setItem(CLOUD_KEY, "1");
    else localStorage.removeItem(CLOUD_KEY);
  }

  async function register(username, password) {
    username = (username || "").trim();
    const key = username.toLowerCase();
    if (global.Net) {
      const r = await global.Net.signup(key, username, password);
      /* Неті відповіді немає — реєструємось будинку, як і раніше. */
      if (r.net) {
        if (!r.ok) return { ok: false, code: r.code };
        await rememberLocal(r.handle, r.name);
        openSession(r.handle, r.name, true);
        global.Net.push(true);
        return { ok: true, name: r.name, cloud: true };
      }
    }
    const users = loadUsers();
    if (users[key]) return { ok: false, code: "exists" };
    const s = salt();
    users[key] = { name: username, salt: s, hash: await sha256(s + password), created: Date.now() };
    saveUsers(users);
    openSession(key, username, false);
    return { ok: true, name: username };
  }

  async function login(username, password) {
    username = (username || "").trim();
    const key = username.toLowerCase();
    if (global.Net) {
      const r = await global.Net.login(key, password);
      if (r.net) {
        if (!r.ok) return { ok: false, code: r.code };
        await rememberLocal(r.handle, r.name);
        openSession(r.handle, r.name, true);
        /* Головний крок «іншого пристрою»: зайшли — і тяжемо свій прогрес із хмари. */
        global.Net.pull(false);
        return { ok: true, name: r.name, cloud: true };
      }
    }
    const users = loadUsers();
    const u = users[key];
    if (!u) return { ok: false, code: "bad" };
    const h = await sha256(u.salt + password);
    if (h !== u.hash) return { ok: false, code: "bad" };
    openSession(key, u.name, false);
    return { ok: true, name: u.name };
  }

  function logout() {
    const wasCloud = isCloud();
    localStorage.removeItem(SESSION_KEY);
    if (wasCloud && global.Net) global.Net.logout();
    else localStorage.removeItem(CLOUD_KEY);
  }

  function info() {
    const c = current();
    if (!c) return null;
    const u = loadUsers()[c];
    return u ? { name: u.name, created: u.created } : null;
  }

  // Records
  function getRecords() { try { return JSON.parse(localStorage.getItem(recKey(handle()))) || {}; } catch { return {}; } }
  function getRecord(game) { return getRecords()[game]; }
  function setRecord(game, value, better) {
    if (global.Settings && global.Settings.get("trackRecords") === false) return { isNew: false, value, prev: value };
    const recs = getRecords();
    const prev = recs[game];
    // better: "high" (більше = краще) | "low" (менше = краще)
    const isNew = prev == null || (better === "low" ? value < prev : value > prev);
    if (isNew) { recs[game] = value; localStorage.setItem(recKey(handle()), JSON.stringify(recs)); document.dispatchEvent(new CustomEvent("recordchange", { detail: { game, value, prev } })); }
    return { isNew, value, prev };
  }

  function clearRecords() { localStorage.removeItem(recKey(handle())); }

  /* ---------- Особисті показники (не ігрові рекорди) ----------
     Лежать у тому ж блоці app.records.<user>, тому їдуть за акаунтом:
       "own_programs" : number  — скільки власних програм збережено (видано в профілі)
       "_ownIds"      : string[] — id вже врахованих записів (службовий ключ, не показується)
     Старі записи (лише ігрові цифри) читаються як раніше: показник просто 0. */
  const OWN_STAT = "own_programs";
  const OWN_IDS = "_ownIds";

  function ownIdsOf(recs) {
    return Array.isArray(recs[OWN_IDS]) ? recs[OWN_IDS].map(String) : [];
  }
  function getOwnPrograms() {
    const recs = getRecords();
    const ids = ownIdsOf(recs);
    return ids.length || Number(recs[OWN_STAT]) || 0;
  }
  // Рахуємо лише нові id — повторний запис того самого програма не додає одиниць.
  function addOwnProgram(id) {
    id = id == null ? "" : String(id);
    if (!id) return { added: false, count: getOwnPrograms() };
    const recs = getRecords();
    const ids = ownIdsOf(recs);
    const prev = Number(recs[OWN_STAT]) || ids.length || 0;
    if (ids.includes(id)) return { added: false, count: prev };
    ids.push(id);
    recs[OWN_IDS] = ids;
    recs[OWN_STAT] = ids.length;
    localStorage.setItem(recKey(handle()), JSON.stringify(recs));
    document.dispatchEvent(new CustomEvent("recordchange", {
      detail: { game: OWN_STAT, value: ids.length, prev, stat: true }
    }));
    return { added: true, count: ids.length };
  }
  function isOwnRecordKey(k) { return k === OWN_STAT || k === OWN_IDS || String(k).charAt(0) === "_"; }

  function clearAll() {
    localStorage.removeItem(USERS_KEY);
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(CLOUD_KEY);
    localStorage.removeItem("app.cloudSyncAt");
    localStorage.removeItem("app.cloudSaveAt");
    localStorage.removeItem("app.cloudEdited");
    localStorage.removeItem("app.cloudConflict");
    localStorage.removeItem("app.cloudPending");
    localStorage.removeItem(NICK_KEY);
    localStorage.removeItem(AVATAR_KEY);
    Object.keys(localStorage).filter((k) => k.startsWith("app.records.")).forEach((k) => localStorage.removeItem(k));
  }

  // Соц-вхід (демо на статичному сайті: створює локальний акаунт, прив'язаний до провайдера)
  async function socialLogin(provider, displayName) {
    const users = loadUsers();
    const key = provider + ".user";
    if (!users[key]) {
      const s = salt();
      users[key] = { name: displayName || getNickname(), salt: s, hash: await sha256(s + crypto.randomUUID()), created: Date.now(), provider };
      saveUsers(users);
    }
    localStorage.setItem(SESSION_KEY, key);
    localStorage.removeItem(CLOUD_KEY);
    return { ok: true, name: users[key].name, provider };
  }

  global.Profile = {
    register, login, logout, current, handle, info, isCloud,
    getRecords, getRecord, setRecord, clearRecords, clearAll, socialLogin,
    getOwnPrograms, addOwnProgram, isOwnRecordKey,
    getNickname, setNickname, getAvatar, setAvatar, rename
  };
})(window);
