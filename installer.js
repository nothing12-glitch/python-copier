/* installer.js — вікно встановлення пакетів із справжнім прогресом.
   Рахує байти, а не «на око»: спочатку дізнається вагу кожного колеса через HEAD,
   потім підглядає за всіма завантаженнями сторінки (fetch і XMLHttpRequest). */
(function (global) {
  const PY_BASE = "https://cdn.jsdelivr.net/pyodide/v0.26.2/full/";
  const LOCK_URL = PY_BASE + "pyodide-lock.json";
  const PYPI_URL = "https://pypi.org/pypi/";
  const LOCK_KEY = "app.modules.lock";
  const SIZE_KEY = "app.wheelSizes.v1";
  const HISTORY_KEY = "modules.installedHistory";
  const SIZE_TTL = 60 * 24 * 60 * 60 * 1000;

  /* Пакети, без яких урок з Python майже не обходиться */
  const RECOMMENDED = ["numpy", "pandas", "matplotlib", "sympy", "requests"];

  let lock = null;
  let wheelSizes = null;
  let sessionReady = false;
  let current = null;

  function t(key, vars) { return global.I18n ? global.I18n.t(key, vars) : key; }

  function el(tag, cls, text) {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text != null) node.textContent = text;
    return node;
  }

  function store(key, value) {
    try { localStorage.setItem(key, JSON.stringify({ at: Date.now(), data: value })); } catch (e) { /* сховище повне — працюємо без кешу */ }
  }

  function recall(key, ttl) {
    try {
      const raw = JSON.parse(localStorage.getItem(key));
      if (raw && Date.now() - (raw.at || 0) < ttl) return raw.data;
    } catch (e) { /* пошкоджений кеш — перечитаємо */ }
    return null;
  }

  // Реєстр пише modules.js у своєму форматі { fetchedAt, data } — маємо читати обидва
  function recallLock() {
    try {
      const raw = JSON.parse(localStorage.getItem(LOCK_KEY));
      if (!raw) return null;
      const at = raw.fetchedAt != null ? raw.fetchedAt : raw.at;
      const data = raw.data || raw;
      if (data && data.packages && Date.now() - (at || 0) < 7 * 24 * 60 * 60 * 1000) return data;
    } catch (e) { /* пошкоджений кеш — перечитаємо з CDN */ }
    return null;
  }

  function bytes(n) {
    if (!n || n < 0) return "0 Б";
    if (n < 1024) return n + " Б";
    if (n < 1048576) return (n / 1024).toFixed(0) + " КБ";
    return (n / 1048576).toFixed(1) + " МБ";
  }

  function seconds(s) {
    if (s < 1) return t("installer.now");
    if (s < 60) return Math.round(s) + " " + t("installer.sec");
    const m = Math.floor(s / 60), rest = Math.round(s % 60);
    return m + " " + t("installer.min") + (rest ? " " + rest + " " + t("installer.sec") : "");
  }

  /* ---------- Реєстр Pyodide ---------- */
  async function getLock() {
    if (lock) return lock;
    const cached = recall(LOCK_KEY, 7 * 24 * 60 * 60 * 1000) || recallLock();
    if (cached && cached.packages) { lock = cached; return lock; }
    const res = await fetch(LOCK_URL, { cache: "no-store" });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    lock = data;
    store(LOCK_KEY, data);
    return data;
  }

  // Назва пакета → список коліс разом із залежностями
  async function resolveWheelNames(names) {
    const data = await getLock();
    const pkgs = data.packages || {};
    const out = [];
    const seen = {};
    const stack = names.slice();
    while (stack.length) {
      const name = stack.pop();
      const pkg = pkgs[name];
      if (!pkg || seen[name]) continue;
      seen[name] = true;
      out.push({ name: pkg.name || name, file: pkg.file_name || pkg.file, depends: pkg.depends || [] });
      (pkg.depends || []).forEach((d) => stack.push(d));
    }
    return out;
  }

  // Вага колеса: HEAD до CDN (jsdelivr віддає доступний звідти Content-Length)
  async function wheelSize(url) {
    if (!wheelSizes) wheelSizes = recall(SIZE_KEY, SIZE_TTL) || {};
    if (wheelSizes[url]) return wheelSizes[url];
    try {
      const res = await fetch(url, { method: "HEAD" });
      const size = Number(res.headers.get("content-length") || 0);
      if (size > 0) { wheelSizes[url] = size; store(SIZE_KEY, wheelSizes); }
      return size;
    } catch (e) {
      return 0;
    }
  }

  /* ---------- Підглядання за завантаженнями сторінки ---------- */
  const WATCH = [PY_BASE, "https://files.pythonhosted.org/", "https://pypi.org/"];
  const watching = [];

  function isWatched(url) {
    return WATCH.some((host) => String(url).indexOf(host) === 0);
  }

  function onChunk(url, loaded, totalHint) {
    if (!current || !isWatched(url)) return;
    current.fileDone(url, loaded, totalHint);
  }

  function startWatching() {
    if (watching.length) return;
    const realFetch = global.fetch;
    global.fetch = function (input, init) {
      const promise = realFetch.call(this, input, init);
      return promise.then((res) => {
        try {
          const url = typeof input === "string" ? input : (input && input.url) || String(input);
          if (!isWatched(url)) return res;
          const total = Number(res.headers.get("content-length") || 0);
          onChunk(url, 0, total);
          if (!res.body || typeof res.body.pipeThrough !== "function") { onChunk(url, total, total); return res; }
          let loaded = 0;
          const stream = res.body.pipeThrough(new TransformStream({
            transform(chunk, controller) {
              loaded += chunk.byteLength || chunk.length || 0;
              onChunk(url, loaded, total);
              controller.enqueue(chunk);
            },
            flush() { if (total) onChunk(url, total, total); }
          }));
          return new Response(stream, { status: res.status, statusText: res.statusText, headers: res.headers });
        } catch (e) {
          return res;
        }
      });
    };
    watching.push(() => { global.fetch = realFetch; });

    const RealXHR = global.XMLHttpRequest;
    if (RealXHR) {
      const realOpen = RealXHR.prototype.open;
      const realSend = RealXHR.prototype.send;
      RealXHR.prototype.open = function (method, url) {
        this.__ipUrl = String(url || "");
        return realOpen.apply(this, arguments);
      };
      RealXHR.prototype.send = function () {
        const url = this.__ipUrl;
        if (isWatched(url)) {
          this.addEventListener("progress", (ev) => { onChunk(url, ev.loaded, ev.total || 0); });
          this.addEventListener("load", () => {
            const len = (this.response && this.response.byteLength) || (this.responseText && this.responseText.length) || 0;
            onChunk(url, len, len);
          });
        }
        return realSend.apply(this, arguments);
      };
      watching.push(() => {
        RealXHR.prototype.open = realOpen;
        RealXHR.prototype.send = realSend;
      });
    }
  }

  function stopWatching() {
    while (watching.length) watching.pop()();
  }

  /* ---------- Вікно ---------- */
  function buildModal(opts) {
    const old = document.getElementById("installerModal");
    if (old) old.remove();

    const bd = el("div", "wn-backdrop ip-backdrop");
    bd.id = "installerModal";
    const card = el("div", "wn-card ip-card");
    card.setAttribute("role", "dialog");
    card.setAttribute("aria-modal", "true");
    card.setAttribute("aria-label", opts.title);

    const head = el("div", "wn-head ip-head");
    const emoji = el("div", "wn-emoji ip-emoji");
    emoji.setAttribute("aria-hidden", "true");
    emoji.appendChild(el("span", "material-icons ip-spin", "cloud_sync"));
    const headText = el("div", "wn-headtext");
    const h3 = el("h3", "wn-title ip-title", opts.title);
    const sub = el("p", "wn-sub ip-sub", opts.subtitle);
    headText.append(h3, sub);
    const pct = el("span", "wn-chip ip-pct", "—");
    head.append(emoji, headText, pct);

    const bar = el("div", "ip-bar");
    const fill = el("span", "ip-fill");
    bar.appendChild(fill);

    const meta = el("div", "ip-meta");
    const weight = el("span", "ip-weight", t("installer.preparing"));
    const eta = el("span", "ip-eta", "");
    const speed = el("span", "ip-speed", "");
    meta.append(weight, eta, speed);

    const list = el("ul", "ip-list");
    (opts.items || []).forEach((item) => {
      const li = el("li", "ip-item");
      li.dataset.name = item.name;
      const ic = el("span", "material-icons ip-item-icon", "radio_button_unchecked");
      const nm = el("span", "ip-item-name", item.label || item.name);
      const sz = el("span", "ip-item-size", item.bytes ? bytes(item.bytes) : "");
      li.append(ic, nm, sz);
      list.appendChild(li);
    });

    const actions = el("div", "wn-actions ip-actions");

    card.append(head, bar, meta, list, actions);
    bd.appendChild(card);
    document.body.appendChild(bd);
    return { bd, card, pct, fill, weight, eta, speed, list, actions, title: h3, sub, emoji };
  }

  /* ---------- Збір байтів ---------- */
  function makeMeter() {
    const predict = new Map();   // url → попередньо відома вага (HEAD)
    const read = new Map();      // url → скільки прочитано з передбачених
    const extras = new Map();    // url → {done, total} для того, чого не передбачили
    let extraDone = 0, extraTotal = 0;
    let rate = 0, lastTime = performance.now(), lastDone = 0;

    return {
      predict(url, size) { if (size) predict.set(url, size); },
      note(url, loaded, totalHint) {
        const planned = predict.get(url);
        if (planned) {
          const prev = read.get(url) || 0;
          if (loaded > prev) read.set(url, Math.min(loaded, planned));
          return;
        }
        const cur = extras.get(url) || { done: 0, total: 0 };
        if (totalHint > cur.total) { extraTotal += totalHint - cur.total; cur.total = totalHint; }
        if (loaded > cur.done) {
          extraDone += loaded - cur.done;
          cur.done = loaded;
          if (cur.total && cur.done > cur.total) { extraTotal += cur.done - cur.total; cur.total = cur.done; }
        }
        extras.set(url, cur);
      },
      totals() {
        let done = 0, total = 0;
        predict.forEach((size, url) => {
          total += size;
          done += Math.min(size, read.get(url) || 0);
        });
        return { done: done + extraDone, total: total + extraTotal };
      },
      /* Згладжена швидкість за останні ~0.5 с */
      speed(doneNow) {
        const now = performance.now();
        const dt = (now - lastTime) / 1000;
        if (dt > 0.4) {
          const inst = (doneNow - lastDone) / dt;
          rate = rate ? rate * 0.65 + inst * 0.35 : inst;
          lastTime = now; lastDone = doneNow;
        }
        return rate;
      }
    };
  }

  /* ---------- Головна функція ---------- */
  // Вага колеса просто з PyPI: мікропіп тя саме цей файл, тому знаємо заздалегідь
  async function pypiWheelInfo(name) {
    try {
      const res = await fetch(PYPI_URL + encodeURIComponent(name) + "/json", { cache: "no-store" });
      if (!res.ok) return null;
      const data = await res.json();
      const files = data.urls || [];
      const chosen = files.find((f) => /py3-none-any\.whl$/.test(f.filename)) ||
        files.find((f) => /\.whl$/i.test(f.filename)) || files[0];
      if (!chosen) return null;
      return { url: chosen.url, bytes: chosen.size || 0 };
    } catch (e) {
      return null;
    }
  }

  async function install(names, opts) {
    if (current) return { skipped: true };
    const o = opts || {};

    let wheels = [], inLock = {};
    try {
      const data = await getLock();
      wheels = await resolveWheelNames(names);
      Object.keys(data.packages || {}).forEach((k) => { inLock[k] = true; inLock[k.toLowerCase()] = true; });
    } catch (e) {
      wheels = [];
    }

    const modal = buildModal({
      title: o.title || t("installer.title"),
      subtitle: o.subtitle || t("installer.wait"),
      items: names.map((n) => ({ name: n, label: n }))
    });

    const meter = makeMeter();

    // Предиктивна вага: колеса з реєстру разом із їхнім реальним розміром
    if (wheels.length) {
      await Promise.all(wheels.map(async (w) => {
        const url = PY_BASE + w.file;
        w.bytes = await wheelSize(url);
        meter.predict(url, w.bytes);
      }));
      const byName = {};
      wheels.forEach((w) => { byName[w.name.toLowerCase()] = w; });
      modal.list.querySelectorAll(".ip-item").forEach((li) => {
        const w = byName[li.dataset.name.toLowerCase()];
        if (w && w.bytes) li.querySelector(".ip-item-size").textContent = bytes(w.bytes);
      });
    }

    // Пакети просто з PyPI: їхню вагу дає сам PyPI, тож прогрес теж передбачуваний
    const outside = names.filter((n) => !inLock[n] && !inLock[String(n).toLowerCase()]);
    await Promise.all(outside.map(async (n) => {
      const info = await pypiWheelInfo(n);
      if (!info) return;
      meter.predict(info.url, info.bytes);
      const li = modal.list.querySelector('.ip-item[data-name="' + n + '"]');
      if (li && info.bytes) li.querySelector(".ip-item-size").textContent = bytes(info.bytes);
    }));

    let lastPaint = 0;
    function paint(force) {
      const now = performance.now();
      if (!force && now - lastPaint < 120) return;
      lastPaint = now;
      const { done, total } = meter.totals();
      const rate = meter.speed(done);
      modal.fill.style.width = (total > 0 ? Math.max(2, (done / total) * 100) : 6) + "%";
      modal.bd.classList.toggle("ip-indeterminate", !total);
      modal.pct.textContent = total > 0 ? Math.min(100, Math.round((done / total) * 100)) + "%" : "…";
      modal.weight.textContent = bytes(done) + " / " + bytes(total);
      const left = total > 0 && rate > 0 ? (total - done) / rate : 0;
      modal.eta.textContent = total > 0 ? (left > 0.5 ? t("installer.left", { time: seconds(left) }) : t("installer.almost")) : "";
      modal.speed.textContent = rate > 0 ? bytes(rate) + "/с" : "";
    }

    const timer = setInterval(() => paint(false), 140);
    startWatching();
    const keep = current;
    current = { fileDone: (url, loaded, totalHint) => meter.note(url, loaded, totalHint) };

    const markItem = (name, cls, icon) => {
      const li = modal.list.querySelector('.ip-item[data-name="' + name + '"]');
      if (!li) return;
      li.className = "ip-item " + cls;
      li.querySelector(".ip-item-icon").textContent = icon;
    };

    const ok = [], fail = [];
    try {
      for (const name of names) {
        markItem(name, "ip-active", "cloud_download");
        try {
          // Те, що є в реєстрі,бере Pyodide; решту — micropip просто з PyPI
          if (inLock[name] || inLock[name.toLowerCase()]) await global.PythonPad.loadPackage(name);
          else await global.PythonPad.installPypi(name);
          ok.push(name);
          markItem(name, "ip-ok", "check_circle");
        } catch (e) {
          // один пакет не заблокує решту — позначимо й підемо далі
          fail.push(name);
          markItem(name, "ip-bad", "error");
        }
      }
      await new Promise((r) => setTimeout(r, 160));
      paint(true);
      sfx("success");
    } catch (e) {
      sfx("error");
    } finally {
      clearInterval(timer);
      stopWatching();
      current = keep;
    }

    return finish(modal, names, ok, fail, o);
  }

  function sfx(name) { global.Audio2 && global.Audio2.SFX && global.Audio2.SFX[name] && global.Audio2.SFX[name](); }

  function finish(modal, names, ok, fail, o) {
    modal.emoji.innerHTML = "";
    modal.emoji.classList.add(ok.length ? "is-done" : "is-bad");
    modal.emoji.appendChild(el("span", "material-icons", ok.length ? "verified" : "sentiment_dissatisfied"));
    modal.title.textContent = ok.length ? t("installer.doneTitle") : t("installer.failedTitle");
    modal.sub.textContent = t("installer.doneSub", { n: ok.length, total: names.length });
    modal.bd.classList.remove("ip-indeterminate");
    modal.fill.style.width = "100%";
    modal.pct.textContent = "100%";
    modal.eta.textContent = fail.length ? t("installer.failed", { list: fail.join(", ") }) : "";

    remember(ok);

    return new Promise((resolve) => {
      const actions = (o.actions || [{ key: "close", label: t("installer.close"), primary: true }]);
      actions.forEach((a) => {
        const b = el("button", "btn " + (a.primary ? "contained" : "outlined"));
        b.type = "button";
        b.appendChild(el("span", "material-icons", a.icon || (a.primary ? "check" : "close")));
        b.appendChild(el("span", null, a.label));
        b.onclick = () => { sfx("click"); closeModal(modal); resolve({ ok, fail, chosen: a.key }); };
        modal.actions.appendChild(b);
      });
    });
  }

  function closeModal(modal) {
    modal.bd.classList.add("wn-out");
    setTimeout(() => modal.bd.remove(), 180);
  }

  /* Історія встановленого — щоб «Встановлені» в каталозі пам'ятали, що ти ставив */
  function remember(list) {
    const hist = recall(HISTORY_KEY, 3650 * 24 * 60 * 60 * 1000) || [];
    let changed = false;
    list.forEach((n) => {
      if (hist.indexOf(n) < 0) { hist.push(n); changed = true; }
    });
    if (changed) store(HISTORY_KEY, hist);
  }

  async function ensureRecommended() {
    if (sessionReady) return { ok: [], fail: [], chosen: "run" };
    const res = await install(RECOMMENDED, {
      title: t("installer.title.rec"),
      subtitle: t("installer.wait"),
      actions: [
        { key: "run", label: t("installer.run"), primary: true, icon: "play_arrow" },
        { key: "stay", label: t("installer.stay"), icon: "close" }
      ]
    });
    sessionReady = true;
    return res;
  }

  global.Installer = {
    RECOMMENDED,
    install,
    ensureRecommended,
    recommendedDone: () => sessionReady,
    busy: () => !!current,
    history: () => recall(HISTORY_KEY, 3650 * 24 * 60 * 60 * 1000) || [],
    remember,
    wheelSize,
    resolveWheelNames,
    bytes,
    seconds,
    PY_BASE
  };
})(window);
