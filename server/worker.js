/* Cloudflare Worker для python-copier: акаунти, рейтинг сезону, спільні задачі.
   Секрет сесій підписується окремим значенням: npx wrangler secret put SESSION_SECRET */

const PBKDF2_ITER = 200000;
const SESSION_TTL = 60 * 60 * 24 * 30;
const COOKIE = "pc_session";
const MONTH_RE = /^\d{4}-\d{2}$/;
const HANDLE_RE = /^[a-z0-9][a-z0-9._-]{2,23}$/;
/* код задачі — як його видає constructor.js: префікс "PC1:" + base64 без "=" */
const CODE_RE = /^(?:PC1:)?[A-Za-z0-9+/_-]{8,4096}$/;
const PREFIX = "PC1:";

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

function cookieSet(token) {
  return `${COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${SESSION_TTL}`;
}
const cookieClear = () => `${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;

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

function cleanHandle(raw) {
  const h = String(raw || "").trim().toLowerCase();
  return HANDLE_RE.test(h) ? h : null;
}

function cleanName(raw, fallback) {
  const n = String(raw || "").replace(/[\u0000-\u001f<>]/g, "").trim().slice(0, 32);
  return n || fallback;
}

/* ---------- обробка ---------- */

async function handle2(request, env) {
  const url = new URL(request.url);
  const ip = request.headers.get("cf-connecting-ip") || "unknown";
  const path = url.pathname.replace(/\/+$/, "") || "/";
  const origin = request.headers.get("origin");
  const cors = {};
  if (origin && origin === env.ALLOWED_ORIGIN) {
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

  return withCors(json({ ok: false, code: "notfound" }, 404));
}

export default {
  async fetch(request, env, ctx) {
    try {
      return await handle2(request, env);
    } catch (err) {
      if (err instanceof TooBig) return json({ ok: false, code: "big" }, 413);
      console.error("worker error:", err && err.message);
      return json({ ok: false, code: "server" }, 500);
    }
  }
};
