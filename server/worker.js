/* Cloudflare Worker для python-copier: акаунти, рейтинг сезону, спільні задачі.
   Розгортається у воркер python-copier-api; змінні DB (D1), ALLOWED_ORIGIN і секрет
   SESSION_SECRET задаються зв'язками (bindings) воркера, а не в цьому файлі. */

const PBKDF2_ITER = 100000;
const SESSION_TTL = 60 * 60 * 24 * 30;
const COOKIE = "pc_session";
const MONTH_RE = /^\d{4}-\d{2}$/;
const HANDLE_RE = /^[a-z0-9][a-z0-9._-]{2,23}$/;
/* код задачі — як його видає constructor.js: префікс "PC1:" + base64 без "=" */
const CODE_RE = /^(?:PC1:)?[A-Za-z0-9+/_-]{8,4096}$/;
const PREFIX = "PC1:";
/* Цілий сейв прогресу: D1 бере одне значення до 2 МБ, тому чанкувати не треба. */
const SAVE_MAX = 1500000;
/* Відгуки: три категорії, текст до 2000 символів, email — необов'язковий. */
const FB_CATS = { bug: "🐞", idea: "💡", thanks: "🙏" };
const FB_MAX = 2000;
const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,24}$/;
const LANG_RE = /^[a-z][a-z-]{1,4}$/;

/* ---------- допоміжне ---------- */

const b64url = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf)))
  .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

const stripPrefix = (code) => code.startsWith(PREFIX) ? code.slice(PREFIX.length) : code;

const fromB64url = (text) =>
  Uint8Array.from(atob(text.replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0));

const json = (data, status = 200, headers = {}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", ...headers }
  });

const now = () => Math.floor(Date.now() / 1000);

/* ---------- паролі ---------- */

async function derive(password, saltBytes, iterations = PBKDF2_ITER) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: saltBytes, iterations, hash: "SHA-256" }, key, 256
  );
  return b64url(bits);
}

async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await derive(password, salt);
  return `pbkdf2$${PBKDF2_ITER}$${b64url(salt)}$${hash}`;
}

async function verifyPassword(password, stored) {
  const parts = String(stored || "").split("$");
  if (parts.length !== 4 || parts[0] !== "pbkdf2") return false;
  const iterations = Number(parts[1]);
  if (!Number.isInteger(iterations) || iterations < 1000) return false;
  const hash = await derive(password, fromB64url(parts[2]), iterations);
  return timingSafeEqual(hash, parts[3]);
}

function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/* ---------- сесійна cookie (підпис HMAC, без таблиці сесій) ---------- */

async function key(env) {
  if (!env.SESSION_SECRET) throw new Error("SESSION_SECRET is not set");
  return crypto.subtle.importKey("raw", new TextEncoder().encode(env.SESSION_SECRET),
    { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}

async function makeToken(env, handle) {
  const exp = now() + SESSION_TTL;
  const body = `${handle}.${exp}`;
  const sig = b64url(await crypto.subtle.sign("HMAC", await key(env), new TextEncoder().encode(body)));
  return `${body}.${sig}`;
}

async function readToken(env, token) {
  const parts = String(token || "").split(".");
  if (parts.length !== 3) return null;
  const [handle, exp, sig] = parts;
  if (!HANDLE_RE.test(handle)) return null;
  if (!/^\d+$/.test(exp) || Number(exp) < now()) return null;
  const good = await crypto.subtle.verify("HMAC", await key(env), fromB64url(sig),
    new TextEncoder().encode(`${handle}.${exp}`));
  return good ? handle : null;
}

/* SameSite=None: сайт живе на pages.dev, а цей API — на workers.dev, тобто інший сайт.
   З Lax браузер не доносив би cookie на запити, і вхід не працював би взагалі. */
function cookieSet(token) {
  return `${COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=None; Max-Age=${SESSION_TTL}`;
}
const cookieClear = () => `${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=None; Max-Age=0`;

/* ---------- ліміт спроб (в межах ізоляту) ---------- */

const attempts = new Map();
function tooMany(ip, limit, windowSec) {
  const t = now();
  const rec = attempts.get(ip);
  if (!rec || rec.reset < t) { attempts.set(ip, { n: 1, reset: t + windowSec }); return false; }
  rec.n += 1;
  if (attempts.size > 50000) attempts.clear();
  return rec.n > limit;
}

/* ---------- запити ---------- */

class TooBig extends Error {}

async function readBody(request, maxBytes) {
  const len = Number(request.headers.get("content-length") || 0);
  if (len > maxBytes) throw new TooBig();
  const text = await request.text();
  if (text.length > maxBytes) throw new TooBig();
  try { return JSON.parse(text); } catch { return null; }
}

/* Текст запиту без JSON-розбору: сейв приходить як уже готовий JSON-рядок і
   зберігається дослівно, щоб браузер віддав Exactly те саме, що поклав. */
async function readText(request, maxBytes) {
  const len = Number(request.headers.get("content-length") || 0);
  if (len > maxBytes) throw new TooBig();
  const buf = await request.arrayBuffer();
  if (buf.byteLength > maxBytes) throw new TooBig();
  return new TextDecoder().decode(buf);
}

/* Схема правиться тут, а не в консолі дашборда: у безкоштовному плані D1
   пишеться лише через зв'язку воркера. Міграції ідемпотентні й стартують
   один раз на ізолят. */
const MIGRATIONS = [
  `CREATE TABLE IF NOT EXISTS save (
     handle TEXT PRIMARY KEY, blob TEXT NOT NULL, at INTEGER NOT NULL, updated INTEGER NOT NULL
   )`,
  "DROP TABLE IF EXISTS save_probe",
  `CREATE TABLE IF NOT EXISTS feedback (
     id INTEGER PRIMARY KEY AUTOINCREMENT, cat TEXT NOT NULL, body TEXT NOT NULL,
     email TEXT NOT NULL DEFAULT '', handle TEXT, lang TEXT NOT NULL DEFAULT 'uk',
     created INTEGER NOT NULL, is_read INTEGER NOT NULL DEFAULT 0
   )`,
  "CREATE INDEX IF NOT EXISTS idx_feedback_new ON feedback (created DESC)",
  "ALTER TABLE feedback ADD COLUMN rating INTEGER"
];
let schema = null;
/* batch() у цьому рантаймі не приймає масив рядків, тому міграції йдуть
   по одній через prepare().run() — той самий шлях, що й у решти воркера.
   ALTER на вже наявну колонку — не помилка, а очікуваний повтор. */
function ensureSchema(env) {
  if (!schema) {
    schema = MIGRATIONS.reduce((p, sql) => p.then(async () => {
      try { await env.DB.prepare(sql).run(); }
      catch (e) { if (!/duplicate column/i.test(String((e && e.message) || ""))) throw e; }
    }), Promise.resolve())
      .catch((err) => { schema = null; throw err; });
  }
  return schema;
}

function cleanHandle(raw) {
  const h = String(raw || "").trim().toLowerCase();
  return HANDLE_RE.test(h) ? h : null;
}

function cleanName(raw, fallback) {
  const n = String(raw || "").replace(/[\u0000-\u001f<>]/g, "").trim().slice(0, 32);
  return n || fallback;
}

/* ---------- відгуки: адмін і Telegram ---------- */

function isAdmin(env, who) {
  if (!who || !env.ADMIN_HANDLES) return false;
  return env.ADMIN_HANDLES.split(",").map((s) => s.trim()).includes(who);
}

/* Telegram-HTML: без екранування чужий текст зміг би підробити повідомлення
   в чаті власника і зламати розмітку — тому & < > правимо завжди. */
function escHtml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

async function tgCall(env, method, payload) {
  try {
    const res = await fetch(`https://api.telegram.org/bot${env.TG_BOT_TOKEN}/${method}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload)
    });
    return await res.json();
  } catch (e) {
    console.error(`telegram ${method} failed:`, e && e.message);
    return { ok: false };
  }
}

/* Кнопки під листом: п'ять зірочок оцінки + «прочитано». Після вибору
   рядок зірочок замінюється на підсумок — повторна оцінка неможлива. */
function fbKeyboard(id, rating, read) {
  const rows = [];
  if (!rating) {
    rows.push([1, 2, 3, 4, 5].map((n) => ({ text: "⭐" + n, callback_data: `r:${id}:${n}` })));
  } else {
    rows.push([{ text: "Оцінка: " + "⭐".repeat(rating), callback_data: "noop" }]);
  }
  rows.push([{ text: read ? "✅ Прочитано" : "✅ Прочитано", callback_data: read ? "noop" : `rd:${id}` }]);
  return { inline_keyboard: rows };
}

async function tgSend(env, html, markup) {
  return tgCall(env, "sendMessage", {
    chat_id: env.TG_CHAT_ID,
    text: html.slice(0, 4000),
    parse_mode: "HTML",
    disable_web_page_preview: true,
    reply_markup: markup
  });
}

/* ---------- вхід через GitHub ---------- */

const GH_PROVIDER = "github";
const GH_SCOPE = "read:user user:email";

const ghCallbackUrl = (url) => `${url.origin}/api/oauth/${GH_PROVIDER}/callback`;

/* Ст тримається підписом, а не в пам'яті: людина починає вхід в одному
   ізоляті, а повертається з GitHub у інший, таблиці сесій у нас немає. */
async function makeState(env, base, nonce) {
  const body = `${base}.${nonce}`;
  const sig = b64url(await crypto.subtle.sign("HMAC", await key(env), new TextEncoder().encode(body)));
  return `${b64url(new TextEncoder().encode(body))}.${sig}`;
}

/* Повертаємо рядок, з якого почався вхід, але лише якщо його хост у списку. */
async function readState(env, state) {
  const parts = String(state || "").split(".");
  if (parts.length !== 2) return null;
  let body = "";
  try { body = new TextDecoder().decode(fromB64url(parts[0])); } catch (e) { return null; }
  const i = body.lastIndexOf(".");
  if (i < 0) return null;
  const base = body.slice(0, i);
  const good = await crypto.subtle.verify("HMAC", await key(env), fromB64url(parts[1]),
    new TextEncoder().encode(body));
  if (!good) return null;
  let origin = "";
  try { origin = new URL(base).origin; } catch (e) { return null; }
  return allowsOrigin(env, origin) ? base : null;
}

/* Ім'я акаунта з GitHub: префікс gh- і лише те, що проходить HANDLE_RE.
   Довгий логін або самі незвичні символи — тоді вже номер, він завжди короткий. */
function ghHandle(login, id) {
  const raw = ("gh-" + String(login || "").toLowerCase()).replace(/[^a-z0-9._-]/g, "-").slice(0, 24).replace(/[-._]+$/, "");
  return cleanHandle(raw) || cleanHandle("gh-" + String(id));
}

/* Адресь папки + наш рядок статусу. Ламаємо тут, а не в браузері: подвійний
   слеш («8787//?gh=ok») статичний сервер уже читає як інший шлях і дає 404. */
function ghTarget(base, flag) {
  const dir = base.endsWith("/") ? base : `${base}/`;
  return `${dir}?gh=${flag}#profile`;
}

const ghBack = (base, flag) => new Response(null, { status: 302, headers: { location: ghTarget(base, flag) } });

/* Обмін коду на токен і токена на людину. Помилка будь-якого кроку — чесний
   «failed» назад на сайт: без цього браузер лишався б на порожній сторінці. */
async function ghExchange(env, code, callbackUrl) {
  const tokRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      client_id: env.GH_CLIENT_ID, client_secret: env.GH_CLIENT_SECRET,
      code, redirect_uri: callbackUrl
    })
  });
  const tok = await tokRes.json().catch(() => ({}));
  if (!tok || !tok.access_token) return null;
  const userRes = await fetch("https://api.github.com/user", {
    headers: { authorization: "Bearer " + tok.access_token, accept: "application/vnd.github+json", "user-agent": "python-copier" }
  });
  const gh = await userRes.json().catch(() => ({}));
  return gh && gh.id ? gh : null;
}

async function ghUser(env, gh) {
  const found = await env.DB.prepare("SELECT handle FROM users WHERE provider = ? AND pid = ?")
    .bind(GH_PROVIDER, String(gh.id)).first();
  if (found) return found.handle;
  let handle = ghHandle(gh.login, gh.id);
  if (!handle) return null;
  const clash = await env.DB.prepare("SELECT handle FROM users WHERE handle = ?").bind(handle).first();
  if (clash) handle = cleanHandle("gh-" + String(gh.id));
  if (!handle) return null;
  /* Пароль — випадковий: людина з GitHub не може мати «свій» пароль тут,
     а отже ніколи не зайде під цим ім'ям через форму з паролем. */
  const pass = await hashPassword(crypto.randomUUID());
  await env.DB.prepare(
    "INSERT INTO users (handle, name, pass, created, last_seen, provider, pid) VALUES (?, ?, ?, ?, ?, ?, ?)"
  ).bind(handle, cleanName(gh.name || gh.login, handle), pass, now(), now(), GH_PROVIDER, String(gh.id)).run();
  return handle;
}

/* ---------- обробка ---------- */

function allowsOrigin(env, origin) {
  if (!origin || !env.ALLOWED_ORIGIN) return false;
  return env.ALLOWED_ORIGIN.split(",").some((o) => o.trim() === origin);
}

async function handle2(request, env, ctx) {
  const url = new URL(request.url);
  const ip = request.headers.get("cf-connecting-ip") || "unknown";
  const path = url.pathname.replace(/\/+$/, "") || "/";
  const origin = request.headers.get("origin");
  const cors = {};
  if (allowsOrigin(env, origin)) {
    cors["access-control-allow-origin"] = origin;
    cors["access-control-allow-credentials"] = "true";
    cors["vary"] = "Origin";
  }
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: { ...cors, "access-control-allow-methods": "GET,POST,OPTIONS", "access-control-allow-headers": "content-type", "access-control-max-age": "600" } });
  }
  const withCors = (res) => { Object.entries(cors).forEach(([k, v]) => res.headers.set(k, v)); return res; };

  if (path === "/api/health") return withCors(json({ ok: true }));

  /* --- акаунти --- */

  if (path === "/api/signup" && request.method === "POST") {
    if (tooMany(ip, 10, 3600)) return withCors(json({ ok: false, code: "slow" }, 429));
    const body = await readBody(request, 4096);
    const handle = body && cleanHandle(body.handle);
    const name = body && cleanName(body.name, handle || "");
    const password = String((body && body.password) || "");
    if (!handle) return withCors(json({ ok: false, code: "badhandle" }, 400));
    if (password.length < 6 || password.length > 128) return withCors(json({ ok: false, code: "badpass" }, 400));
    const pass = await hashPassword(password);
    const exists = await env.DB.prepare("SELECT handle FROM users WHERE handle = ?").bind(handle).first();
    if (exists) return withCors(json({ ok: false, code: "exists" }, 409));
    await env.DB.prepare("INSERT INTO users (handle, name, pass, created, last_seen) VALUES (?, ?, ?, ?, ?)")
      .bind(handle, name, pass, now(), now()).run();
    return withCors(json({ ok: true, handle, name }, 200, { "set-cookie": cookieSet(await makeToken(env, handle)) }));
  }

  if (path === "/api/login" && request.method === "POST") {
    if (tooMany(ip, 15, 900)) return withCors(json({ ok: false, code: "slow" }, 429));
    const body = await readBody(request, 4096);
    const handle = body && cleanHandle(body.handle);
    const password = String((body && body.password) || "");
    if (!handle) return withCors(json({ ok: false, code: "badhandle" }, 400));
    const user = await env.DB.prepare("SELECT name, pass FROM users WHERE handle = ?").bind(handle).first();
    const ok = user ? await verifyPassword(password, user.pass) : false;
    if (!ok) return withCors(json({ ok: false, code: "bad" }, 401));
    await env.DB.prepare("UPDATE users SET last_seen = ? WHERE handle = ?").bind(now(), handle).run();
    return withCors(json({ ok: true, handle, name: user.name }, 200,
      { "set-cookie": cookieSet(await makeToken(env, handle)) }));
  }

  if (path === "/api/logout" && request.method === "POST") {
    return withCors(json({ ok: true }, 200, { "set-cookie": cookieClear() }));
  }

  /* --- вхід через GitHub: обидва кроки — звичайні переходи браузера, не fetch --- */

  if (path === `/api/oauth/${GH_PROVIDER}/start`) {
    /* Повертатися завжди в папку сайта: «index.html?gh=ok» браузер порахував
       би папкою з ім'ям index.html, і сторінка залишилась би без своїх файлів. */
    const base = (url.searchParams.get("return") || "").replace(/index\.html?$/i, "");
    let origin = "";
    try { origin = new URL(base).origin; } catch (e) { origin = ""; }
    /* Спершу куди повертати: чужу адресу не повинен обробляти навіть код,
       який далі міг би втекти з браузером на сторонній сайт. */
    if (!allowsOrigin(env, origin)) return json({ ok: false, code: "badorigin" }, 400);
    if (!env.GH_CLIENT_ID || !env.GH_CLIENT_SECRET) return json({ ok: false, code: "notconfigured" }, 501);
    if (tooMany(ip, 30, 3600)) return json({ ok: false, code: "slow" }, 429);
    const state = await makeState(env, base, b64url(crypto.getRandomValues(new Uint8Array(8))));
    const q = new URLSearchParams({
      client_id: env.GH_CLIENT_ID,
      redirect_uri: ghCallbackUrl(url),
      scope: GH_SCOPE,
      state
    });
    return Response.redirect(`https://github.com/login/oauth/authorize?${q.toString()}`, 302);
  }

  if (path === `/api/oauth/${GH_PROVIDER}/callback`) {
    const base = await readState(env, url.searchParams.get("state"));
    if (!base) return json({ ok: false, code: "badstate" }, 400);
    const code = url.searchParams.get("code");
    if (!code || url.searchParams.get("error")) return ghBack(base, "cancel");
    const gh = await ghExchange(env, code, ghCallbackUrl(url));
    if (!gh) return ghBack(base, "failed");
    await ensureSchema(env);
    const handle = await ghUser(env, gh);
    if (!handle) return ghBack(base, "failed");
    await env.DB.prepare("UPDATE users SET last_seen = ? WHERE handle = ?").bind(now(), handle).run();
    const who = await env.DB.prepare("SELECT name FROM users WHERE handle = ?").bind(handle).first();
    /* Кука та сама, що й після входу з паролем: далі акаунт бачить /api/me,
       тож прогрес і хмара працюють без жодної окремої логіки. */
    return new Response(null, {
      status: 302,
      headers: { location: ghTarget(base, "ok"), "set-cookie": cookieSet(await makeToken(env, handle)) }
    });
  }

  const cookie = request.headers.get("cookie") || "";
  const token = (cookie.match(/(?:^|;\s*)pc_session=([^;]+)/) || [])[1];
  const handle = await readToken(env, token);

  if (path === "/api/me") {
    if (!handle) return withCors(json({ ok: false }, 401));
    const u = await env.DB.prepare("SELECT name, created FROM users WHERE handle = ?").bind(handle).first();
    return withCors(json({ ok: true, handle, name: u ? u.name : handle, created: u ? u.created : 0 }));
  }

  if (path === "/api/rename" && request.method === "POST") {
    if (!handle) return withCors(json({ ok: false }, 401));
    const body = await readBody(request, 4096);
    const name = body && cleanName(body.name, handle);
    await env.DB.prepare("UPDATE users SET name = ? WHERE handle = ?").bind(name, handle).run();
    return withCors(json({ ok: true, name }));
  }

  /* --- сейв прогресу (щоб акаунт відкрився з будь-якого пристрою) --- */

  if (path === "/api/save" && request.method === "POST") {
    if (!handle) return withCors(json({ ok: false, code: "auth" }, 401));
    await ensureSchema(env);
    const text = await readText(request, SAVE_MAX);
    let obj = null;
    try { obj = JSON.parse(text); } catch { obj = null; }
    if (!obj || typeof obj !== "object" || typeof obj.data !== "object" || !obj.data) {
      return withCors(json({ ok: false, code: "badsave" }, 400));
    }
    /* at — мітка часу самого сейва на пристрої. Виграні за нею: пристрій,
       де пізніше грали, переписує хмару; старіший сейв відбивається. */
    const at = Math.max(0, Number(Date.parse(obj.at || "")) || Date.now());
    const cur = await env.DB.prepare("SELECT at FROM save WHERE handle = ?").bind(handle).first();
    if (cur && Number(cur.at) > at) {
      return withCors(json({ ok: false, code: "newer", at: Number(cur.at) }, 409));
    }
    await env.DB.prepare(
      `INSERT INTO save (handle, blob, at, updated) VALUES (?, ?, ?, ?)
       ON CONFLICT(handle) DO UPDATE SET blob = excluded.blob, at = excluded.at, updated = excluded.updated`
    ).bind(handle, text, at, now()).run();
    return withCors(json({ ok: true, at, bytes: text.length }));
  }

  if (path === "/api/save" && request.method === "GET") {
    if (!handle) return withCors(json({ ok: false, code: "auth" }, 401));
    await ensureSchema(env);
    const row = await env.DB.prepare("SELECT blob, at, updated FROM save WHERE handle = ?").bind(handle).first();
    if (!row) return withCors(json({ ok: false, code: "empty" }, 404));
    return withCors(new Response(row.blob, {
      headers: {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "no-store",
        "x-save-at": String(row.at)
      }
    }));
  }

  /* --- сезон --- */

  if (path === "/api/sync" && request.method === "POST") {
    if (!handle) return withCors(json({ ok: false, code: "auth" }, 401));
    const body = await readBody(request, 65536);
    const month = body && String(body.month || "");
    const xp = body ? Math.max(0, Math.min(1e9, Number(body.xp) || 0)) : 0;
    if (!MONTH_RE.test(month)) return withCors(json({ ok: false, code: "month" }, 400));
    const league = Math.max(0, Math.min(7, Number(body.league) || 0));
    const days = Math.max(0, Math.min(31, Number(body.days) || 0));
    const src = JSON.stringify((body.src && typeof body.src === "object") ? body.src : {}).slice(0, 8000);
    const row = await env.DB.prepare(
      `INSERT INTO season (handle, month, xp, league, days, src, updated) VALUES (?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(handle, month) DO UPDATE SET
         xp = MAX(excluded.xp, season.xp), league = excluded.league,
         days = MAX(excluded.days, season.days), src = excluded.src, updated = excluded.updated
       RETURNING xp`
    ).bind(handle, month, xp, league, days, src, now()).first();
    return withCors(json({ ok: true, xp: row && typeof row.xp === "number" ? row.xp : xp }));
  }

  if (path === "/api/leaderboard") {
    const month = url.searchParams.get("month") || "";
    if (!MONTH_RE.test(month)) return withCors(json({ ok: false, code: "month" }, 400));
    const leagueParam = url.searchParams.get("league");
    const league = leagueParam === null || leagueParam === "" ? null : Number(leagueParam);
    const rows = await env.DB.prepare(
      `SELECT s.handle, u.name, s.xp, s.league, s.days FROM season s JOIN users u ON u.handle = s.handle
       WHERE s.month = ? ${league === null ? "" : "AND s.league = ?"} ORDER BY s.xp DESC, s.updated ASC LIMIT 101`
    ).bind(...(league === null ? [month] : [month, league])).all();
    let myRank = null;
    if (handle) {
      const mine = rows.results.find((r) => r.handle === handle);
      if (mine) {
        const better = await env.DB.prepare(
          `SELECT COUNT(*) AS n FROM season s WHERE s.month = ? AND s.xp > ? ${league === null ? "" : "AND s.league = ?"}`
        ).bind(...(league === null ? [month, mine.xp] : [month, mine.xp, league])).first();
        myRank = (better && better.n) + 1;
      }
    }
    return withCors(json({
      ok: true, month, league, myHandle: handle || null, myRank,
      rows: rows.results.map((r, i) => ({ rank: i + 1, handle: r.handle, name: r.name, xp: r.xp, league: r.league, days: r.days }))
    }, 200, { "cache-control": "public, max-age=15" }));
  }

  /* --- загальний двір задач --- */

  if (path === "/api/tasks" && request.method === "POST") {
    if (!handle) return withCors(json({ ok: false, code: "auth" }, 401));
    const body = await readBody(request, 65536);
    const raw = body ? String(body.code || "") : "";
    if (!CODE_RE.test(raw)) return withCors(json({ ok: false, code: "badcode" }, 400));
    const code = stripPrefix(raw);
    const title = cleanName(body.title, "task").slice(0, 120);
    const taskBody = JSON.stringify(body.body || {});
    if (taskBody.length > 40000) return withCors(json({ ok: false, code: "big" }, 413));
    const u = await env.DB.prepare("SELECT name FROM users WHERE handle = ?").bind(handle).first();
    await env.DB.prepare(
      `INSERT INTO task (code, handle, name, title, body, hits, created) VALUES (?, ?, ?, ?, ?, 0, ?)
       ON CONFLICT(code) DO UPDATE SET title = excluded.title, body = excluded.body`
    ).bind(code, handle, u ? u.name : handle, title, taskBody, now()).run();
    return withCors(json({ ok: true, code: PREFIX + code }));
  }

  if (path === "/api/tasks" && request.method === "GET") {
    const q = (url.searchParams.get("q") || "").slice(0, 60);
    const author = cleanHandle(url.searchParams.get("author"));
    const where = [];
    const args = [];
    if (q) { where.push("title LIKE ?"); args.push(`%${q.replace(/[%_]/g, "")}%`); }
    if (author) { where.push("handle = ?"); args.push(author); }
    const limit = Math.max(1, Math.min(50, Number(url.searchParams.get("limit")) || 24));
    const rows = await env.DB.prepare(
      `SELECT code, name, title, created, hits FROM task ${where.length ? "WHERE " + where.join(" AND ") : ""}
       ORDER BY created DESC LIMIT ${limit}`
    ).bind(...args).all();
    const out = (rows.results || []).map((t) => ({ ...t, code: PREFIX + t.code }));
    return withCors(json({ ok: true, rows: out }, 200, { "cache-control": "public, max-age=10" }));
  }

  if (path.startsWith("/api/task/")) {
    const code = stripPrefix(decodeURIComponent(path.slice("/api/task/".length)));
    if (!CODE_RE.test(code)) return withCors(json({ ok: false, code: "badcode" }, 400));
    const row = await env.DB.prepare("SELECT body, name, title FROM task WHERE code = ?").bind(code).first();
    if (!row) return withCors(json({ ok: false, code: "notfound" }, 404));
    await env.DB.prepare("UPDATE task SET hits = hits + 1 WHERE code = ?").bind(code).run();
    return withCors(json({ ok: true, title: row.title, name: row.name, body: JSON.parse(row.body) }));
  }

  /* --- відгуки --- */

  if (path === "/api/feedback" && request.method === "POST") {
    if (tooMany(ip, 8, 3600)) return withCors(json({ ok: false, code: "slow" }, 429));
    await ensureSchema(env);
    const body = await readBody(request, 8192);
    const cat = body ? String(body.cat || "") : "";
    if (!FB_CATS[cat]) return withCors(json({ ok: false, code: "badcat" }, 400));
    const text = String((body && body.text) || "")
      .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, "").trim().slice(0, FB_MAX);
    if (text.length < 5) return withCors(json({ ok: false, code: "short" }, 400));
    const email = String((body && body.email) || "").trim().slice(0, 254);
    if (email && !EMAIL_RE.test(email)) return withCors(json({ ok: false, code: "bademail" }, 400));
    const langRaw = body ? String(body.lang || "") : "";
    const lang = LANG_RE.test(langRaw) ? langRaw : "uk";
    const ins = await env.DB.prepare(
      "INSERT INTO feedback (cat, body, email, handle, lang, created) VALUES (?, ?, ?, ?, ?, ?)"
    ).bind(cat, text, email, handle || null, lang, now()).run();
    const fid = (ins && ins.meta && ins.meta.last_row_id) || 0;
    /* Лист власнику — ідеальним не буває: Telegram лежить чи токен протерто,
       відгук уже в базі, і запит не маємо право на це ламати. */
    if (env.TG_BOT_TOKEN && env.TG_CHAT_ID && ctx) {
      const who = handle ? "@" + escHtml(handle) : "анонімно";
      const when = new Date().toISOString().slice(0, 16).replace("T", " ");
      const mailLine = email ? `✉️ ${escHtml(email)}\n` : "";
      ctx.waitUntil(tgSend(env,
        `🐍 <b>Відгук python-copier</b>\n${FB_CATS[cat]} ${escHtml(cat)} · ${who} · 🌐 ${escHtml(lang)} · 🕒 ${when} UTC\n${mailLine}${escHtml(text)}`,
        fbKeyboard(fid, 0, 0)));
    }
    return withCors(json({ ok: true, admin: isAdmin(env, handle) }));
  }

  if (path === "/api/feedback" && request.method === "GET") {
    if (!isAdmin(env, handle)) return withCors(json({ ok: false, code: "auth" }, 401));
    if (tooMany(ip, 120, 60)) return withCors(json({ ok: false, code: "slow" }, 429));
    await ensureSchema(env);
    const limit = Math.max(1, Math.min(100, Number(url.searchParams.get("limit")) || 50));
    const offset = Math.max(0, Math.floor(Number(url.searchParams.get("offset")) || 0));
    const where = url.searchParams.get("unread") === "1" ? " WHERE is_read = 0" : "";
    const rows = await env.DB.prepare(
      `SELECT id, cat, body, email, handle, lang, created, is_read, rating FROM feedback${where}
       ORDER BY created DESC LIMIT ${limit} OFFSET ${offset}`
    ).all();
    const stats = await env.DB.prepare(
      "SELECT COUNT(*) AS n, COALESCE(SUM(is_read = 0), 0) AS unread FROM feedback"
    ).first();
    return withCors(json({
      ok: true, rows: rows.results || [],
      n: stats ? stats.n : 0, unread: stats ? stats.unread : 0
    }, 200, { "cache-control": "no-store" }));
  }

  if (path === "/api/feedback/read" && request.method === "POST") {
    if (!isAdmin(env, handle)) return withCors(json({ ok: false, code: "auth" }, 401));
    const body = await readBody(request, 1024);
    if (body && body.all) {
      await env.DB.prepare("UPDATE feedback SET is_read = 1 WHERE is_read = 0").run();
    } else {
      const id = Math.floor(Number(body && body.id));
      if (!Number.isInteger(id) || id <= 0) return withCors(json({ ok: false, code: "badid" }, 400));
      await env.DB.prepare("UPDATE feedback SET is_read = 1 WHERE id = ?").bind(id).run();
    }
    return withCors(json({ ok: true }));
  }

  /* --- Telegram-вебхук: оцінка зірочками й «прочитано» кнопками --- */

  if (path === "/tg" && request.method === "POST") {
    const secret = request.headers.get("x-tg-webhook-secret") || "";
    if (!env.TG_WEBHOOK_SECRET || secret !== env.TG_WEBHOOK_SECRET) {
      return new Response("forbidden", { status: 403 });
    }
    const upd = await readBody(request, 65536);
    const cq = upd && upd.callback_query;
    const chatId = cq && cq.message && cq.message.chat && cq.message.chat.id;
    if (cq && String(chatId) === String(env.TG_CHAT_ID)) {
      await ensureSchema(env);
      const mid = cq.message.message_id;
      const rate = String(cq.data || "").match(/^r:(\d+):([1-5])$/);
      const read = String(cq.data || "").match(/^rd:(\d+)$/);
      if (rate) {
        const id = Number(rate[1]);
        const n = Number(rate[2]);
        const res = await env.DB.prepare(
          "UPDATE feedback SET rating = ? WHERE id = ? AND rating IS NULL"
        ).bind(n, id).run();
        const row = await env.DB.prepare("SELECT is_read FROM feedback WHERE id = ?").bind(id).first();
        if (res && res.meta && res.meta.changes > 0) {
          await tgCall(env, "editMessageReplyMarkup",
            { chat_id: chatId, message_id: mid, reply_markup: fbKeyboard(id, n, row ? row.is_read : 0) });
          await tgCall(env, "answerCallbackQuery", { callback_query_id: cq.id, text: "Дякую за оцінку!" });
        } else {
          await tgCall(env, "answerCallbackQuery",
            { callback_query_id: cq.id, text: "Цей відгук уже оцінено", show_alert: true });
        }
      } else if (read) {
        const id = Number(read[1]);
        await env.DB.prepare("UPDATE feedback SET is_read = 1 WHERE id = ?").bind(id).run();
        const row = await env.DB.prepare("SELECT rating FROM feedback WHERE id = ?").bind(id).first();
        await tgCall(env, "editMessageReplyMarkup",
          { chat_id: chatId, message_id: mid, reply_markup: fbKeyboard(id, (row && row.rating) || 0, 1) });
        await tgCall(env, "answerCallbackQuery", { callback_query_id: cq.id, text: "Позначено прочитаним" });
      }
    }
    return new Response("{}", { status: 200, headers: { "content-type": "application/json" } });
  }

  return withCors(json({ ok: false, code: "notfound" }, 404));
}

export default {
  async fetch(request, env, ctx) {
    try {
      return await handle2(request, env, ctx);
    } catch (err) {
      if (err instanceof TooBig) return json({ ok: false, code: "big" }, 413);
      console.error("worker error:", err && err.message);
      return json({ ok: false, code: "server" }, 500);
    }
  }
};
