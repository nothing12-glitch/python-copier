/* Локальний профіль/акаунт (демо, без сервера). Пароль — SHA-256 з сіллю. */
(function (global) {
  const USERS_KEY = "app.users";
  const SESSION_KEY = "app.session";
  const recKey = (u) => "app.records." + u;

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

  async function register(username, password) {
    username = (username || "").trim();
    const users = loadUsers();
    if (users[username.toLowerCase()]) return { ok: false, code: "exists" };
    const s = salt();
    users[username.toLowerCase()] = {
      name: username, salt: s, hash: await sha256(s + password), created: Date.now()
    };
    saveUsers(users);
    localStorage.setItem(SESSION_KEY, username.toLowerCase());
    return { ok: true, name: username };
  }

  async function login(username, password) {
    username = (username || "").trim();
    const users = loadUsers();
    const u = users[username.toLowerCase()];
    if (!u) return { ok: false, code: "bad" };
    const h = await sha256(u.salt + password);
    if (h !== u.hash) return { ok: false, code: "bad" };
    localStorage.setItem(SESSION_KEY, username.toLowerCase());
    return { ok: true, name: u.name };
  }

  function logout() { localStorage.removeItem(SESSION_KEY); }

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
    if (isNew) { recs[game] = value; localStorage.setItem(recKey(handle()), JSON.stringify(recs)); }
    return { isNew, value, prev };
  }

  function clearRecords() { localStorage.removeItem(recKey(handle())); }
  function clearAll() {
    localStorage.removeItem(USERS_KEY);
    localStorage.removeItem(SESSION_KEY);
    Object.keys(localStorage).filter((k) => k.startsWith("app.records.")).forEach((k) => localStorage.removeItem(k));
  }

  // Соц-вхід (демо на статичному сайті: створює локальний акаунт, прив'язаний до провайдера)
  async function socialLogin(provider, displayName) {
    const users = loadUsers();
    const key = provider + ".user";
    if (!users[key]) {
      const s = salt();
      users[key] = { name: displayName, salt: s, hash: await sha256(s + crypto.randomUUID()), created: Date.now(), provider };
      saveUsers(users);
    }
    localStorage.setItem(SESSION_KEY, key);
    return { ok: true, name: users[key].name, provider };
  }

  global.Profile = {
    register, login, logout, current, handle, info,
    getRecords, getRecord, setRecord, clearRecords, clearAll, socialLogin
  };
})(window);
