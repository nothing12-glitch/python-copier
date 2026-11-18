/* Відгуки: власна форма надсилає на свій сервер (без Google Forms),
   власнику летить лист у Telegram, а під власним акаунтом тут же
   available панель усіх відгуків. */
(function (global) {
  const $ = (s) => document.querySelector(s);
  const t = (k, v) => (global.I18n ? global.I18n.t(k, v) : k);
  const say = (m) => { if (global.App && global.App.toast) global.App.toast(m); };

  /* Транспорт свой: net.js зайнятий інчою фічею, а кук сесії все одно
     доокупує браузер — credentials:"include" несе pc_session сам. */
  const API = (global.Net && global.Net.API) || "https://python-copier-api.homakarsenij68.workers.dev";
  async function raw(path, opts, ms) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), ms || 20000);
    try {
      const res = await fetch(API + path, Object.assign({ credentials: "include", signal: ctrl.signal }, opts || {}));
      const text = await res.text();
      return { net: true, status: res.status, text };
    } catch (e) {
      return { net: false, status: 0, text: "" };
    } finally { clearTimeout(timer); }
  }
  async function call(path, opts, ms) {
    const r = await raw(path, opts, ms);
    if (!r.net) return { net: false };
    let data = null;
    try { data = JSON.parse(r.text); } catch (e) { data = null; }
    return { net: true, status: r.status, data };
  }
  const post = (path, obj) => call(path, {
    method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(obj)
  });
  const get = (path) => call(path, undefined, 15000);

  const FB_MAX = 2000;
  const QKEY = "app.feedbackQueue";
  const CATKEY = "app.feedbackCat";
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const CATS = [["bug", "feedback.catBug"], ["idea", "feedback.catIdea"], ["thanks", "feedback.catThanks"]];
  const CAT_ICON = { bug: "bug_report", idea: "lightbulb", thanks: "near_me" };

  let cat = localStorage.getItem(CATKEY);
  if (!CAT_ICON[cat]) cat = "bug";
  let busy = false;
  let admin = null;      // null = ще не перевірено, false = не власник
  let panel = { rows: [], n: 0, unread: 0, offset: 0 };

  function qRead() {
    try { return JSON.parse(localStorage.getItem(QKEY) || "[]"); } catch (e) { return []; }
  }
  function qWrite(list) {
    try { localStorage.setItem(QKEY, JSON.stringify(list.slice(-20))); } catch (e) { /* сховище повне */ }
  }
  function qPush(item) {
    const list = qRead().filter((x) => Date.now() - (x.at || 0) < 30 * 864e5);
    list.push(item);
    qWrite(list);
  }

  async function flush() {
    const list = qRead();
    if (!list.length) return;
    const left = [];
    for (const item of list) {
      const r = await post("/api/feedback", item);
      const ok = r.net && r.status < 500;
      if (!ok) left.push(item);
      if (!r.net) break;
    }
    qWrite(left);
    if (!left.length) say(t("feedback.sent"));
  }

  /* ---------- форма ---------- */

  function el(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  function iconBtn(icon, label, onClick) {
    const b = el("button", "btn outlined fb-mini");
    b.type = "button";
    const i = el("span", "material-icons", icon);
    b.append(i, el("span", null, label));
    b.onclick = onClick;
    return b;
  }

  function buildForm(host) {
    host.innerHTML = "";
    const form = el("form", "fb-form");
    form.noValidate = true;

    const cats = el("div", "fb-cats");
    cats.setAttribute("role", "group");
    const catBtns = {};
    CATS.forEach(([code, key]) => {
      const b = el("button", "chip fb-cat");
      b.type = "button";
      b.append(el("span", "material-icons", CAT_ICON[code]), el("span", "fb-cat-label", t(key)));
      b.dataset.cat = code;
      b.onclick = () => { cat = code; localStorage.setItem(CATKEY, code); paintCats(); };
      catBtns[code] = b;
      cats.appendChild(b);
    });
    form.appendChild(cats);

    const areaWrap = el("div", "fb-areawrap");
    const area = el("textarea", "fb-area");
    area.maxLength = FB_MAX;
    area.rows = 6;
    const count = el("div", "fb-count");
    const updateCount = () => { count.textContent = t("feedback.chars", { n: FB_MAX - area.value.length }); };
    area.oninput = updateCount;
    areaWrap.append(area, count);
    form.appendChild(areaWrap);

    const emailField = el("div", "field");
    const email = el("input", "");
    email.type = "email";
    email.id = "fbEmail";
    email.placeholder = " ";
    email.maxLength = 254;
    const emailLab = el("label", null, t("feedback.emailPh"));
    emailLab.htmlFor = "fbEmail";
    emailField.append(email, emailLab);
    form.appendChild(emailField);

    const err = el("div", "fb-err");
    err.setAttribute("aria-live", "polite");
    form.appendChild(err);

    const send = el("button", "btn contained fb-send");
    send.type = "submit";
    send.append(el("span", "material-icons", "send"), el("span", "fb-send-label", t("feedback.send")));
    form.appendChild(send);

    form.onsubmit = async (e) => {
      e.preventDefault();
      if (busy) return;
      const text = area.value.trim();
      const mail = email.value.trim();
      err.textContent = "";
      if (text.length < 5) { err.textContent = t("feedback.short"); area.focus(); return; }
      if (mail && !EMAIL_RE.test(mail)) { err.textContent = t("feedback.badEmail"); email.focus(); return; }
      busy = true;
      send.disabled = true;
      const item = { cat, text: text.slice(0, FB_MAX), email: mail, lang: (global.I18n && global.I18n.lang) || "uk", at: Date.now() };
      const r = await post("/api/feedback", item);
      busy = false;
      send.disabled = false;
      let clear = false;
      if (!r.net || r.status >= 500) {
        qPush(item);
        say(t("feedback.queued"));
        clear = true;
        if (r.net && admin === null) probeAdmin();
      } else if (r.data && r.data.ok) {
        say(t("feedback.sent"));
        if (r.data.admin && !admin) { admin = true; probeAdmin(); }
        clear = true;
      } else {
        const code = (r.data && r.data.code) || "";
        err.textContent = code === "slow" ? t("feedback.slow")
          : code === "bademail" ? t("feedback.badEmail") : t("feedback.failed");
      }
      if (clear) {
        area.value = "";
        email.value = "";
        updateCount();
      }
    };

    host.appendChild(form);
    ui = { area, count, updateCount, cats: catBtns, sendLabel: send.querySelector(".fb-send-label"), emailLab, err };
    paintCats();
    updateCount();
  }

  let ui = null;

  function paintCats() {
    if (!ui) return;
    CATS.forEach(([code]) => {
      const b = ui.cats[code];
      b.classList.toggle("active", code === cat);
      b.setAttribute("aria-pressed", code === cat ? "true" : "false");
    });
  }

  /* ---------- панель автора ---------- */

  function fmtDate(sec) {
    try { return new Date(sec * 1000).toLocaleString(); } catch (e) { return String(sec); }
  }

  function markRead(id, all) {
    post("/api/feedback/read", all ? { all: true } : { id }).then((r) => {
      if (r.net && r.data && r.data.ok) {
        panel.rows.forEach((row) => { if (all || row.id === id) row.is_read = 1; });
        panel.unread = all ? 0 : panel.rows.filter((row) => !row.is_read).length;
        renderAdmin();
      }
    });
  }

  async function loadMore() {
    const r = await get("/api/feedback?limit=50&offset=" + panel.offset);
    if (r.net && r.data && r.data.ok) {
      panel.rows = panel.rows.concat(r.data.rows || []);
      panel.offset += (r.data.rows || []).length;
      renderAdmin();
    }
  }

  async function probeAdmin() {
    const r = await get("/api/feedback?limit=50");
    const host = $("#feedbackAdmin");
    if (!host) return;
    if (r.net && r.status === 200 && r.data && r.data.ok) {
      admin = true;
      panel = { rows: r.data.rows || [], n: r.data.n || 0, unread: r.data.unread || 0, offset: (r.data.rows || []).length };
      renderAdmin();
    } else {
      if (r.net && r.status === 401) admin = false;
      panel = { rows: [], n: 0, unread: 0, offset: 0 };
      host.innerHTML = "";
    }
  }

  function renderAdmin() {
    const host = $("#feedbackAdmin");
    if (!host || !admin) return;
    host.innerHTML = "";
    const card = el("div", "card elev1 feedback-card fb-admin");

    const head = el("div", "fb-admin-head");
    const title = el("h3", "fb-admin-title", t("feedback.adminTitle"));
    if (panel.unread > 0) title.appendChild(el("span", "fb-badge", String(panel.unread)));
    const tools = el("div", "fb-admin-tools");
    tools.append(
      iconBtn("refresh", t("feedback.adminRefresh"), () => probeAdmin()),
      iconBtn("done_all", t("feedback.adminMarkAll"), () => markRead(0, true))
    );
    head.append(title, tools);
    card.appendChild(head);

    if (!panel.rows.length) {
      card.appendChild(el("div", "feedback-empty", t("feedback.adminEmpty")));
      host.appendChild(card);
      return;
    }

    panel.rows.forEach((row) => {
      const r = el("div", "fb-row" + (row.is_read ? "" : " unread"));
      const meta = el("div", "fb-meta");
      const who = row.handle ? "@" + row.handle : t("feedback.anon");
      const label = (CATS.find(([code]) => code === row.cat) || [, row.cat])[1];
      meta.append(
        el("span", "material-icons fb-cat-ico", CAT_ICON[row.cat] || "chat"),
        el("span", "fb-cat-name", t(label)),
        el("span", null, who),
        el("span", null, row.lang || "uk"),
        el("span", null, fmtDate(row.created))
      );
      if (row.email) meta.append(el("span", "material-icons fb-cat-ico", "mail"), el("span", null, row.email));
      r.appendChild(meta);
      r.appendChild(el("p", "fb-body", row.body));
      if (!row.is_read) {
        r.appendChild(iconBtn("check", t("feedback.markRead"), () => markRead(row.id, false)));
      }
      card.appendChild(r);
    });

    if (panel.rows.length < panel.n) {
      card.appendChild(iconBtn("expand_more", t("feedback.adminMore"), () => loadMore()));
    }
    host.appendChild(card);
  }

  /* ---------- загальний рендер ---------- */

  function render() {
    const nav = $("#feedbackNavLabel"); if (nav) nav.textContent = t("feedback.title");
    const title = $("#feedbackTitle"); if (title) title.textContent = t("feedback.title");
    const barTitle = $("#feedbackBarTitle"); if (barTitle) barTitle.textContent = t("feedback.title");
    const intro = $("#feedbackIntro"); if (intro) intro.textContent = t("feedback.intro");
    const priv = $("#feedbackPrivacy"); if (priv) priv.textContent = t("feedback.privacy");
    const host = $("#feedbackBody");
    if (!host) return;
    if (!ui || !host.childElementCount) { buildForm(host); }
    else {
      CATS.forEach(([code, key]) => {
        const b = ui.cats[code];
        if (b) b.querySelector(".fb-cat-label").textContent = t(key);
      });
      ui.sendLabel.textContent = t("feedback.send");
      ui.emailLab.textContent = t("feedback.emailPh");
      ui.updateCount();
      paintCats();
    }
    if (admin) renderAdmin();
  }

  function onEnter() {
    if (qRead().length) flush();
    if (admin === null || admin === true) probeAdmin();
  }

  function init() {
    if (!$("#feedbackBody")) return;
    render();
    document.addEventListener("langchange", render);
    window.addEventListener("online", () => flush());
    document.addEventListener("click", (e) => {
      if (e.target.closest('[data-route="feedback"], [data-goto="feedback"]')) setTimeout(onEnter, 60);
    });
    window.addEventListener("hashchange", () => {
      if (location.hash === "#feedback") onEnter();
    });
    if (location.hash === "#feedback") onEnter();
    setInterval(() => { if (qRead().length) flush(); }, 60000);
  }

  document.addEventListener("DOMContentLoaded", init);
  global.Feedback = { init, render };
})(window);
