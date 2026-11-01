/* ui.js — кастомні випадаючі меню замість нудних системних <select>.
   UI.menu(anchor, items)  — разове меню-попап.
   UI.enhance(root)        — перетворює всі <select> в секції на кастомний список. */
(function (global) {
  const open = { panel: null, owner: null, restore: null };

  function t(key, fallback) {
    const v = global.I18n && global.I18n.t ? global.I18n.t(key) : key;
    return v === key ? fallback : v;
  }

  function close() {
    if (!open.panel) return;
    const panel = open.panel;
    panel.classList.remove("qm-in");
    panel.classList.add("qm-out");
    setTimeout(() => panel.remove(), 140);
    if (open.owner) open.owner.classList.remove("qm-open");
    document.removeEventListener("mousedown", onOutside, true);
    document.removeEventListener("keydown", onKey, true);
    window.removeEventListener("resize", close);
    window.removeEventListener("scroll", onScroll, true);
    open.panel = null;
    open.owner = null;
    if (open.restore) { const f = open.restore; open.restore = null; f(); }
  }

  function onOutside(e) {
    if (open.panel && !open.panel.contains(e.target) && open.owner && !open.owner.contains(e.target)) close();
  }

  /* панель меню сама прокручується — закривати лише коли рухається сторінка під нею */
  function onScroll(e) {
    if (open.panel && e && e.target && open.panel.contains(e.target)) return;
    close();
  }

  let items = [];
  let cursor = 0;
  let onPick = null;

  function paintCursor() {
    if (!open.panel) return;
    open.panel.querySelectorAll(".qm-item").forEach((li, i) => {
      li.classList.toggle("qm-cursor", i === cursor);
      if (i === cursor) li.scrollIntoView({ block: "nearest" });
    });
  }

  function onKey(e) {
    if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); close(); return; }
    if (e.key === "ArrowDown") { e.preventDefault(); cursor = (cursor + 1) % items.length; paintCursor(); return; }
    if (e.key === "ArrowUp") { e.preventDefault(); cursor = (cursor - 1 + items.length) % items.length; paintCursor(); return; }
    if (e.key === "Home") { e.preventDefault(); cursor = 0; paintCursor(); return; }
    if (e.key === "End") { e.preventDefault(); cursor = items.length - 1; paintCursor(); return; }
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault(); e.stopPropagation();
      const it = items[cursor];
      close();
      if (it && onPick) onPick(it);
    }
  }

  function place(anchor) {
    const r = anchor.getBoundingClientRect();
    const panel = open.panel;
    panel.style.visibility = "hidden";
    panel.classList.add("show");
    const h = panel.offsetHeight;
    const w = Math.max(panel.offsetWidth, r.width);
    let top = r.bottom + 6;
    if (top + h > innerHeight - 8) top = Math.max(8, r.top - h - 6);
    let left = r.left;
    if (left + w > innerWidth - 8) left = Math.max(8, innerWidth - w - 8);
    panel.style.top = top + "px";
    panel.style.left = left + "px";
    panel.style.minWidth = Math.round(r.width) + "px";
    panel.style.visibility = "";
  }

  // items: [{ label, value, icon, selected, disabled, group }]
  function menu(anchor, list, pick) {
    close();
    if (!list.length) return;
    items = list;
    onPick = pick || null;
    const panel = document.createElement("div");
    panel.className = "qm-panel elev2";
    panel.setAttribute("role", "menu");
    let firstEnabled = 0;
    list.forEach((it, i) => {
      if (it.group && i) {
        const g = document.createElement("div");
        g.className = "qm-group";
        g.textContent = it.group;
        panel.appendChild(g);
      }
      const li = document.createElement("button");
      li.type = "button";
      li.className = "qm-item" + (it.selected ? " qm-sel" : "") + (it.disabled ? " qm-dis" : "");
      li.setAttribute("role", "menuitem");
      li.innerHTML = '<span class="material-icons qm-ico">' + (it.icon || "radio_button_unchecked") + "</span>" +
        '<span class="qm-label"></span>' +
        (it.hint ? '<span class="qm-hint"></span>' : "");
      li.querySelector(".qm-label").textContent = it.label;
      if (it.hint) li.querySelector(".qm-hint").textContent = it.hint;
      if (it.selected && !it.icon) li.querySelector(".qm-ico").textContent = "check";
      if (!it.disabled && !firstEnabled) firstEnabled = i;
      li.onclick = () => { close(); if (onPick) onPick(it); };
      panel.appendChild(li);
    });
    cursor = firstEnabled;
    document.body.appendChild(panel);
    open.panel = panel;
    open.owner = anchor;
    anchor.classList.add("qm-open");
    place(anchor);
    panel.classList.add("qm-in");
    document.addEventListener("mousedown", onOutside, true);
    document.addEventListener("keydown", onKey, true);
    window.addEventListener("resize", close);
    window.addEventListener("scroll", onScroll, true);
    paintCursor();
  }

  /* ---------- апгрейд справжніх <select> ---------- */
  function listFrom(sel) {
    const out = [];
    let lastGroup = null;
    Array.prototype.forEach.call(sel.options, (o) => {
      const og = o.parentNode && o.parentNode.tagName === "OPTGROUP" ? o.parentNode : null;
      const item = { label: o.textContent.trim(), value: o.value, disabled: o.disabled };
      if (og && og.label !== lastGroup) { item.group = og.label; lastGroup = og.label; }
      else if (!og) lastGroup = null;
      out.push(item);
    });
    return out;
  }

  function upgrade(sel) {
    if (sel.dataset.qmDone) return;
    if (sel.multiple || sel.size > 1) return;
    sel.dataset.qmDone = "1";
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "qm-select" + (sel.className ? " " + sel.className : "");
    btn.setAttribute("aria-haspopup", "menu");
    btn.innerHTML = '<span class="qm-value"></span><span class="material-icons qm-caret">expand_more</span>';
    sel.parentNode.insertBefore(btn, sel.nextSibling);
    sel.classList.add("qm-native");
    sel.tabIndex = -1;

    const valueEl = btn.querySelector(".qm-value");
    function sync() {
      const o = sel.options[sel.selectedIndex];
      valueEl.textContent = o ? o.textContent.trim() : "";
      btn.classList.toggle("qm-dis", sel.disabled);
      btn.disabled = !!sel.disabled;
    }
    sync();

    const mo = new MutationObserver(sync);
    mo.observe(sel, { childList: true, attributes: true, subtree: true, characterData: true });
    sel.addEventListener("change", sync);
    sel.addEventListener("qmresync", sync);

    btn.addEventListener("click", () => {
      if (sel.disabled) return;
      const list = listFrom(sel).map((it) => Object.assign(it, {
        selected: it.value === sel.value,
        icon: it.value === sel.value ? "check_circle" : "radio_button_unchecked"
      }));
      menu(btn, list, (it) => {
        if (it.disabled) return;
        sel.value = it.value;
        sel.dispatchEvent(new Event("change", { bubbles: true }));
        sync();
      });
    });
    btn.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
        if (open.panel) return;
        e.preventDefault();
        btn.click();
      }
    });
  }

  function enhance(root) {
    (root || document).querySelectorAll("select:not(.qm-native)").forEach(upgrade);
  }

  const observer = new MutationObserver((muts) => {
    muts.forEach((m) => {
      Array.prototype.forEach.call(m.addedNodes, (n) => {
        if (n.nodeType !== 1) return;
        if (n.tagName === "SELECT") enhance(n.parentNode);
        else if (n.querySelector) enhance(n);
      });
    });
  });

  function init() {
    enhance(document);
    observer.observe(document.body, { childList: true, subtree: true });
    document.addEventListener("langchange", () => {
      document.querySelectorAll("select.qm-native").forEach((s) => {
        const b = s.nextElementSibling;
        if (b && b.classList.contains("qm-select")) {
          const o = s.options[s.selectedIndex];
          b.querySelector(".qm-value").textContent = o ? o.textContent.trim() : "";
        }
      });
    });
  }

  /* ---------- Нумерація рядків для редакторів поза майданчиком ---------- */
  /* Номерів у курсі, задачах і тренажері не було, бо там голий <textarea>. Простої
     колонки теж мало: textarea переносить довгі рядки, і номери поїхали б вгору.
     Тому висота кожного рядка вимірюється дзеркалом — колонка стає точно врівень. */
  function lineGutter(ta) {
    if (!ta) return null;
    if (ta.__gutter) return ta.__gutter;
    const parent = ta.parentElement;
    if (!parent) return null;
    /* Обгортаємо саме поле: без цього колонка липне до верху блоку, де над текстовим
       полем ще лежать підпис і умова задачі. */
    const host = document.createElement("div");
    host.className = "gutter-host";
    parent.insertBefore(host, ta);
    host.appendChild(ta);

    const gut = document.createElement("div");
    gut.className = "line-numbers gutter";
    gut.setAttribute("aria-hidden", "true");
    const rows = document.createElement("div");
    rows.className = "gutter-rows";
    gut.appendChild(rows);
    host.insertBefore(gut, ta);

    const mirror = document.createElement("div");
    mirror.className = "gutter-mirror";
    mirror.setAttribute("aria-hidden", "true");
    host.appendChild(mirror);

    let lineCount = -1;
    let dirty = false;
    let timer = 0;
    let tries = 0;

    function same(src) {
      const cs = getComputedStyle(ta);
      ["fontFamily", "fontSize", "lineHeight", "letterSpacing", "tabSize"].forEach((k) => {
        mirror.style[k] = cs[k];
        gut.style[k] = cs[k];
      });
      gut.style.paddingTop = cs.paddingTop;
      gut.style.paddingRight = "10px";
      // ширина колонки відома з її вмісту — під неї й розсуваємо текстове поле
      host.style.setProperty("--gut-w", (hidden() ? 0 : gut.offsetWidth) + "px");
      const inner = ta.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      mirror.style.width = Math.max(20, inner) + "px";
    }

    function hidden() { return getComputedStyle(gut).display === "none"; }

    function build(list) {
      rows.textContent = "";
      mirror.textContent = "";
      const rf = document.createDocumentFragment();
      const mf = document.createDocumentFragment();
      for (let i = 0; i < list.length; i++) {
        const num = document.createElement("div");
        num.className = "gutter-num";
        num.textContent = String(i + 1);
        rf.appendChild(num);
        const m = document.createElement("div");
        m.className = "gutter-mirror-line";
        m.textContent = list[i] === "" ? "\u00A0" : list[i];
        mf.appendChild(m);
      }
      rows.appendChild(rf);
      mirror.appendChild(mf);
      lineCount = list.length;
    }

    function refresh() {
      const list = String(ta.value).split("\n");
      if (list.length !== lineCount) build(list);
      if (hidden()) { dirty = true; pump(); return; }
      dirty = false;
      measure();
    }

    /* Розділ відкривають у момент, коли панель ще display:none — тоді колонка
       вимірюється в нуль і текст лізе на номери. Ждемо, поки сек стане видимим. */
    function pump() {
      if (timer || !dirty) return;
      timer = setTimeout(() => {
        timer = 0;
        if (!dirty) return;
        if (hidden()) { tries++; if (tries < 40) pump(); return; }
        dirty = false;
        tries = 0;
        measure();
      }, 60);
    }

    function measure() {
      const list = String(ta.value).split("\n");
      if (list.length !== lineCount) build(list);
      same(list);
      const mRows = mirror.children;
      const gRows = rows.children;
      const fallback = parseFloat(getComputedStyle(ta).lineHeight) || 20;
      for (let i = 0; i < mRows.length && i < gRows.length; i++) {
        gRows[i].style.height = (mRows[i].offsetHeight || fallback) + "px";
      }
      sync();
    }

    function sync() {
      rows.style.transform = "translateY(" + (-ta.scrollTop) + "px)";
    }

    function top(idx) {
      const row = rows.children[idx - 1];
      return row ? row.offsetTop : null;
    }

    const api = { refresh, sync, top, element: gut, host };
    ta.__gutter = api;
    ta.addEventListener("input", refresh);
    ta.addEventListener("focus", refresh);
    ta.addEventListener("scroll", sync);
    document.addEventListener("settingschange", refresh);
    if (typeof ResizeObserver === "function") new ResizeObserver(refresh).observe(ta);
    refresh();
    return api;
  }

  /* Курсор на рядок: виділити, прокрутити й блионути рамкою — те саме, що в майданчику. */
  function focusLine(ta, n) {
    if (!ta) return;
    const lines = String(ta.value).split("\n");
    const idx = Math.min(Math.max(Number(n) || 1, 1), lines.length);
    let start = 0;
    for (let i = 0; i < idx - 1; i++) start += lines[i].length + 1;
    ta.focus();
    ta.setSelectionRange(start, start + lines[idx - 1].length);
    const g = ta.__gutter;
    const t = g && g.top(idx);
    const lh = parseFloat(getComputedStyle(ta).lineHeight) || 22;
    ta.scrollTop = Math.max(0, (t == null ? (idx - 1) * lh : t) - ta.clientHeight / 2);
    if (g) g.sync();
    const host = ta.parentElement;
    if (host) {
      host.classList.remove("jump-flash");
      void host.offsetWidth;
      host.classList.add("jump-flash");
      setTimeout(() => host.classList.remove("jump-flash"), 800);
    }
    global.Audio2 && global.Audio2.SFX.pop();
  }

  /* Смужка з типом помилки: саме його не вистачало в курсі й задачах, де видно було
     лише обрізаний трейсбек без «IndentationError» чи «NameError». */
  function errorBox(err, onJump) {
    const box = document.createElement("div");
    box.className = "err-kind";
    const badge = document.createElement("span");
    badge.className = "err-type";
    badge.textContent = (err && err.type) || "Error";
    badge.title = t("python.errType", "Тип помилки");
    box.appendChild(badge);
    if (err && err.detail) {
      const d = document.createElement("span");
      d.className = "err-detail";
      d.textContent = err.detail;
      box.appendChild(d);
    }
    if (onJump && err && err.line) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "goto-line";
      btn.textContent = "→ " + err.line;
      btn.title = global.I18n && global.I18n.t ? global.I18n.t("python.gotoLine", { n: err.line }) : "";
      btn.onclick = () => onJump(err.line);
      box.appendChild(btn);
    }
    return box;
  }

  /* Статус над результатами: фрази «Помилка виконання — …» вже мають своє тире й
     крапку, тому тип додаємо через роздільник, а не через двокрапку. */
  function errStatus(base, type) {
    const head = String(base || "").replace(/[.\s—–-]+$/u, "");
    return type ? head + " · " + type : head;
  }

  global.UI = { menu, enhance, upgrade, close, current: () => open.panel, lineGutter, focusLine, errorBox, errStatus };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})(window);
