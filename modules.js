/* modules.js — каталог модулів Python: усі пакети Pyodide з пошуком і встановленням у один клік.
   Реєстр пакетів береться з pyodide-lock.json і кешується локально: app.modules.lock */
(function (global) {
  const $ = (s) => document.querySelector(s);

  const LOCK_URL = "https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide-lock.json";
  const CACHE_KEY = "app.modules.lock";
  const CACHE_TTL = 7 * 24 * 60 * 60 * 1000;
  const PAGE_SIZE = 36;

  /* Пакети, для яких є опис і готовий приклад коду */
  const FEATURED = {
    "numpy": {
      desc: {
        uk: "Числові масиви та швидкі обчислення: матриці, статистика, лінійна алгебра.",
        en: "Numeric arrays and fast computing: matrices, statistics, linear algebra.",
        tr: "Sayısal diziler ve hızlı hesaplar: matrisler, istatistik, doğrusal cebir."
      },
      example: "import numpy as np\na = np.array([[1, 2], [3, 4]])\nprint(a.sum(), a.mean())\nprint(np.linalg.det(a))\n"
    },
    "pandas": {
      desc: {
        uk: "Таблиці й дані: DataFrame, фільтри, групування, зведення.",
        en: "Tables and data: DataFrames, filters, grouping, summaries.",
        tr: "Tablolar ve veriler: DataFrame, filtreler, gruplama, özetler."
      },
      example: "import pandas as pd\ndf = pd.DataFrame({\"name\": [\"Ana\", \"Bo\", \"Cy\"], \"score\": [12, 9, 15]})\nprint(df.sort_values(\"score\", ascending=False).to_string(index=False))\n"
    },
    "matplotlib": {
      desc: {
        uk: "Графіки й діаграми, які малюються прямо на сторінці.",
        en: "Plots and charts drawn right on the page.",
        tr: "Doğrudan sayfada çizilen grafikler."
      },
      example: "import matplotlib.pyplot as plt\nx = [1, 2, 3, 4]\nplt.plot(x, [i * i for i in x])\nplt.title(\"y = x^2\")\nplt.show()\n"
    },
    "sympy": {
      desc: {
        uk: "Символьна математика: рівняння, похідні, інтеграли, спрощення.",
        en: "Symbolic math: equations, derivatives, integrals, simplification.",
        tr: "Sembolik matematik: denklemler, türevler, integraller, sadeleştirme."
      },
      example: "import sympy as sp\nx = sp.Symbol(\"x\")\nprint(sp.factor(x**2 - 5*x + 6))\nprint(sp.integrate(sp.sin(x), x))\n"
    },
    "scipy": {
      desc: {
        uk: "Наукові обчислення: статистика, оптимізація, інтегрування.",
        en: "Scientific computing: statistics, optimization, integration.",
        tr: "Bilimsel hesaplamalar: istatistik, optimizasyon, integrasyon."
      },
      example: "from scipy import stats\nres = stats.linregress([1, 2, 3, 4], [2, 4, 5, 4])\nprint(round(res.slope, 3), round(res.rvalue, 3))\n"
    },
    "scikit-learn": {
      desc: {
        uk: "Машинне навчання: регресія, класифікація, кластери.",
        en: "Machine learning: regression, classification, clustering.",
        tr: "Makine öğrenmesi: regresyon, sınıflandırma, kümeleme."
      },
      example: "from sklearn.linear_model import LinearRegression\nmodel = LinearRegression().fit([[1], [2], [3]], [2, 4, 6])\nprint(round(model.predict([[5]])[0], 3))\n"
    },
    "requests": {
      desc: {
        uk: "HTTP-запити до сайтів і API (потрібен інтернет і дозвіл CORS).",
        en: "HTTP requests to sites and APIs (needs internet and CORS permission).",
        tr: "Siteler ve API'ler için HTTP istekleri (internet ve CORS izni gerekir)."
      },
      example: "import requests\nr = requests.get(\"https://httpbin.org/get\", timeout=10)\nprint(r.status_code)\nprint(r.json()[\"url\"])\n"
    },
    "pillow": {
      desc: {
        uk: "Робота із зображеннями: створення, обрізання, фільтри, збереження.",
        en: "Working with images: creating, cropping, filters, saving.",
        tr: "Görsellerle çalışma: oluşturma, kırpma, filtreler, kaydetme."
      },
      example: "from PIL import Image\nimg = Image.new(\"RGB\", (64, 32), (30, 144, 255))\nprint(img.size, img.mode, img.getpixel((0, 0)))\n"
    },
    "networkx": {
      desc: {
        uk: "Графи та мережі: вершини, ребра, шляхи, зв'язність.",
        en: "Graphs and networks: nodes, edges, paths, connectivity.",
        tr: "Graflar ve ağlar: düğümler, kenarlar, yollar, bağlılık."
      },
      example: "import networkx as nx\ng = nx.cycle_graph(5)\nprint(g.number_of_nodes(), g.number_of_edges(), nx.is_connected(g))\n"
    },
    "opencv-python": {
      desc: {
        uk: "Комп'ютерний зір: імпорт як cv2, обробка зображень і відео.",
        en: "Computer vision: imported as cv2, image and video processing.",
        tr: "Bilgisayarla görme: cv2 olarak içe aktarılır, görsel ve video işleme."
      },
      example: "import cv2\nimport numpy as np\nimg = np.zeros((8, 8), dtype=np.uint8)\ncv2.rectangle(img, (1, 1), (6, 6), 255, -1)\nprint(cv2.countNonZero(img))\n"
    },
    "pygame-ce": {
      desc: {
        uk: "Ігровий рушій (імпортується як pygame): спрайти, події, таймери.",
        en: "Game engine (imported as pygame): sprites, events, timers.",
        tr: "Oyun motoru (pygame olarak içe aktarılır): sprite'lar, olaylar, zamanlayıcılar."
      },
      example: "import pygame\nprint(pygame.version.ver)\n"
    },
    "statsmodels": {
      desc: {
        uk: "Статистичні моделі: регресії, тести, оцінки параметрів.",
        en: "Statistical models: regressions, tests, parameter estimates.",
        tr: "İstatistiksel modeller: regresyonlar, testler, parametre tahminleri."
      },
      example: "import numpy as np\nimport statsmodels.api as sm\nprint(sm.add_constant(np.array([1.0, 2.0, 3.0])))\n"
    }
  };

  /* Готові набори пакетів */
  const PRESETS = {
    analytics: ["numpy", "pandas", "matplotlib"],
    science: ["scipy", "sympy"],
    images: ["pillow", "opencv-python"],
    ml: ["scikit-learn", "numpy", "scipy"]
  };

  let searchEl, chipsEl, countEl, gridEl, presetsEl, infoEl, errorEl, moreBtn;
  let packages = [];
  let byImport = {};
  let loadedNames = [];
  let installedNow = [];
  let filter = "all";
  let query = "";
  let shown = PAGE_SIZE;
  let lockInfo = null;
  let busy = false;

  function t(k, v) { return global.I18n ? global.I18n.t(k, v) : k; }

  function toast(msg) { if (global.App && global.App.toast) global.App.toast(msg); }

  function sfx(name) { global.Audio2 && global.Audio2.SFX && global.Audio2.SFX[name] && global.Audio2.SFX[name](); }

  function el(tag, cls, text) {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text != null) node.textContent = text;
    return node;
  }

  function pick(obj) {
    if (!obj) return "";
    const l = global.I18n ? global.I18n.lang : "uk";
    return obj[l] || obj.uk || "";
  }

  function isLoaded(name) {
    if (loadedNames.indexOf(name) >= 0) return true;
    return installedNow.indexOf(name) >= 0;
  }

  /* ---------- Реєстр пакетів ---------- */
  function readCache() {
    try {
      const raw = JSON.parse(localStorage.getItem(CACHE_KEY));
      if (raw && raw.data && Date.now() - (raw.fetchedAt || 0) < CACHE_TTL) return raw;
    } catch { /* кеш пошкоджений — просто перечитаємо */ }
    return null;
  }

  function writeCache(data) {
    try { localStorage.setItem(CACHE_KEY, JSON.stringify({ fetchedAt: Date.now(), data: data })); }
    catch (e) { /* реєстр великий, якщо сховище переповнене — працюємо без кешу */ }
  }

  async function fetchLock(force) {
    if (!force) {
      const cached = readCache();
      if (cached) { applyLock(cached.data); return true; }
    }
    const res = await fetch(LOCK_URL, { cache: "no-store" });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    if (!data || !data.packages) throw new Error("bad lock file");
    writeCache(data);
    applyLock(data);
    return true;
  }

  function applyLock(data) {
    lockInfo = data.info || {};
    packages = [];
    byImport = {};
    Object.keys(data.packages || {}).forEach((key) => {
      const pkg = data.packages[key];
      if (!pkg || pkg.package_type !== "package") return;
      if (/-tests$/.test(pkg.name)) return;
      packages.push({
        name: pkg.name, version: pkg.version || "",
        imports: pkg.imports || [], depends: pkg.depends || []
      });
      (pkg.imports || []).forEach((imp) => {
        if (!byImport[imp]) byImport[imp] = pkg.name;
      });
    });
    packages.sort((a, b) => a.name.localeCompare(b.name));
  }

  function syncLoaded() {
    if (global.PythonPad && typeof global.PythonPad.loadedPackages === "function") {
      try { loadedNames = global.PythonPad.loadedPackages() || []; } catch (e) { loadedNames = []; }
    }
  }

  /* ---------- Фільтрація ---------- */
  function visible() {
    const q = query.trim().toLowerCase();
    return packages.filter((pkg) => {
      if (q && pkg.name.toLowerCase().indexOf(q) < 0 &&
          !pkg.imports.some((i) => i.toLowerCase().indexOf(q) >= 0)) return false;
      if (filter === "featured") return !!FEATURED[pkg.name];
      if (filter === "installed") return isLoaded(pkg.name);
      if (filter === "missing") return !isLoaded(pkg.name);
      return true;
    });
  }

  /* ---------- Рендер ---------- */
  function loadedCount() {
    const set = {};
    loadedNames.forEach((n) => { set[n] = true; });
    installedNow.forEach((n) => { set[n] = true; });
    return Object.keys(set).length;
  }

  function renderInfo() {
    if (!infoEl) return;
    infoEl.innerHTML = "";
    const items = [
      { value: String(packages.length), label: t("modules.statPackages") },
      { value: String(Object.keys(byImport).length), label: t("modules.statImports") },
      { value: String(loadedCount()), label: t("modules.statLoaded") },
      { value: (lockInfo && lockInfo.python) || "3.12", label: t("modules.statPython") }
    ];
    items.forEach((item) => {
      const box = el("div", "mod-stat");
      box.appendChild(el("div", "mod-stat-value", item.value));
      box.appendChild(el("div", "mod-stat-label", item.label));
      infoEl.appendChild(box);
    });
  }

  function renderChips() {
    if (!chipsEl) return;
    chipsEl.innerHTML = "";
    [["all", "modules.filterAll"], ["featured", "modules.filterFeatured"],
     ["installed", "modules.filterInstalled"], ["missing", "modules.filterMissing"]].forEach(([id, key]) => {
      const chip = el("button", "contest-chip" + (filter === id ? " active" : ""), t(key));
      chip.type = "button";
      chip.onclick = () => { filter = id; shown = PAGE_SIZE; renderChips(); renderGrid(); sfx("pop"); };
      chipsEl.appendChild(chip);
    });
  }

  function renderPresets() {
    if (!presetsEl) return;
    presetsEl.innerHTML = "";
    presetsEl.appendChild(el("span", "contest-field-label", t("modules.presets")));
    const row = el("div", "contest-chips");
    Object.keys(PRESETS).forEach((id) => {
      const chip = el("button", "contest-chip mod-preset", t("modules.preset." + id));
      chip.type = "button";
      chip.title = PRESETS[id].join(" · ");
      chip.onclick = () => installMany(PRESETS[id], chip);
      row.appendChild(chip);
    });
    presetsEl.appendChild(row);
  }

  function renderCount(list) {
    if (countEl) countEl.textContent = t("modules.shown", { n: Math.min(shown, list.length), total: list.length });
  }

  function renderGrid() {
    if (!gridEl) return;
    syncLoaded();
    const list = visible();
    renderCount(list);
    renderInfo();
    gridEl.innerHTML = "";
    if (!packages.length) {
      gridEl.appendChild(el("p", "muted", t("modules.loading")));
      return;
    }
    if (!list.length) {
      gridEl.appendChild(el("p", "muted", t("modules.empty")));
      if (moreBtn) moreBtn.classList.add("hidden");
      return;
    }
    list.slice(0, shown).forEach((pkg) => gridEl.appendChild(card(pkg)));
    if (moreBtn) moreBtn.classList.toggle("hidden", shown >= list.length);
  }

  function card(pkg) {
    const done = isLoaded(pkg.name);
    const box = el("div", "mod-card" + (done ? " installed" : ""));
    box.dataset.name = pkg.name;

    const head = el("div", "mod-card-head");
    head.appendChild(el("span", "mod-name", pkg.name));
    if (pkg.version) head.appendChild(el("span", "mod-version", pkg.version));
    const state = el("span", "mod-state" + (done ? " done" : ""), done ? t("modules.stateLoaded") : t("modules.stateIdle"));
    head.appendChild(state);
    box.appendChild(head);

    if (FEATURED[pkg.name]) box.appendChild(el("p", "mod-desc", pick(FEATURED[pkg.name].desc)));

    if (pkg.imports.length) {
      const imports = el("div", "mod-imports");
      pkg.imports.slice(0, 6).forEach((imp) => imports.appendChild(el("code", "mod-import", imp)));
      box.appendChild(imports);
    }
    if (pkg.depends.length) {
      box.appendChild(el("div", "mod-deps", t("modules.depends", { list: pkg.depends.slice(0, 5).join(", ") })));
    }

    const actions = el("div", "mod-actions");
    const install = el("button", "btn contained mod-install");
    install.type = "button";
    install.appendChild(el("span", "material-icons", "download"));
    install.appendChild(el("span", null, done ? t("modules.reinstall") : t("modules.install")));
    install.disabled = done;
    install.onclick = () => installOne(pkg.name, box, install, state);
    actions.appendChild(install);

    if (FEATURED[pkg.name] && FEATURED[pkg.name].example) {
      const ex = el("button", "btn text mod-example");
      ex.type = "button";
      ex.appendChild(el("span", "material-icons", "science"));
      ex.appendChild(el("span", null, t("modules.example")));
      ex.onclick = () => useExample(pkg.name);
      actions.appendChild(ex);
    }

    const imp = el("button", "btn text mod-copy");
    imp.type = "button";
    imp.appendChild(el("span", "material-icons", "content_copy"));
    imp.appendChild(el("span", null, t("modules.copyImport")));
    imp.onclick = () => copyImport(pkg);
    actions.appendChild(imp);

    box.appendChild(actions);
    return box;
  }

  /* ---------- Дії ---------- */
  async function installOne(name, box, btn, stateEl) {
    if (busy) { toast(t("modules.busy")); return; }
    if (!global.PythonPad || typeof global.PythonPad.loadPackage !== "function") {
      toast(t("modules.unavailable"));
      sfx("error");
      return;
    }
    busy = true;
    btn.disabled = true;
    btn.querySelector("span:last-child").textContent = t("modules.installing");
    if (stateEl) { stateEl.textContent = t("modules.stateLoading"); stateEl.classList.add("loading"); }
    sfx("click");
    try {
      await global.PythonPad.loadPackage(name);
      if (installedNow.indexOf(name) < 0) installedNow.push(name);
      syncLoaded();
      if (box) {
        box.classList.add("installed");
        if (stateEl) { stateEl.textContent = t("modules.stateLoaded"); stateEl.classList.remove("loading"); stateEl.classList.add("done"); }
        btn.querySelector("span:last-child").textContent = t("modules.reinstall");
      }
      toast("📦 " + t("modules.installedToast", { name: name }));
      sfx("success");
      document.dispatchEvent(new CustomEvent("packageinstalled", {
        detail: { name: name, imports: (packages.find((p) => p.name === name) || {}).imports || [], count: installedNow.length }
      }));
      renderInfo();
      if (filter === "missing") renderGrid();
    } catch (e) {
      if (stateEl) { stateEl.textContent = t("modules.stateError"); stateEl.classList.remove("loading"); stateEl.classList.add("error"); }
      btn.querySelector("span:last-child").textContent = t("modules.install");
      btn.disabled = false;
      toast(t("modules.installFailed", { name: name }));
      sfx("error");
    }
    busy = false;
  }

  async function installMany(names, chip) {
    if (busy) { toast(t("modules.busy")); return; }
    if (!global.PythonPad || typeof global.PythonPad.loadPackage !== "function") { toast(t("modules.unavailable")); return; }
    busy = true;
    const oldText = chip.textContent;
    let ok = 0;
    for (const name of names) {
      chip.textContent = t("modules.installingSet", { name: name });
      try {
        await global.PythonPad.loadPackage(name);
        if (installedNow.indexOf(name) < 0) installedNow.push(name);
        ok++;
      } catch (e) { /* один пакет не заблокує решту набору */ }
    }
    busy = false;
    chip.textContent = oldText;
    syncLoaded();
    renderGrid();
    toast("📦 " + t("modules.presetDone", { ok: ok, total: names.length }));
    sfx(ok === names.length ? "success" : "error");
  }

  function useExample(name) {
    const code = FEATURED[name] && FEATURED[name].example;
    if (!code) return;
    const editor = $("#code");
    if (editor) {
      editor.value = code;
      editor.dispatchEvent(new Event("input", { bubbles: true }));
    }
    if (global.App && global.App.route) global.App.route("python");
    else location.hash = "#python";
    toast(t("modules.exampleToast", { name: name }));
    sfx("pop");
  }

  function copyImport(pkg) {
    const name = pkg.imports[0] || pkg.name.replace(/-/g, "_");
    const text = "import " + name + "\n";
    const done = () => { toast(t("modules.copied", { name: name })); sfx("pop"); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(done);
    } else {
      const ta = document.createElement("textarea");
      ta.value = text; document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); } catch (e) {}
      document.body.removeChild(ta);
      done();
    }
  }

  function showError(msg) {
    if (!errorEl) return;
    errorEl.innerHTML = "";
    errorEl.classList.remove("hidden");
    const line = el("div", "mod-error");
    line.appendChild(el("span", "material-icons", "wifi_off"));
    line.appendChild(el("span", null, msg));
    const retry = el("button", "btn outlined", t("modules.retry"));
    retry.type = "button";
    retry.onclick = load;
    errorEl.appendChild(line);
    errorEl.appendChild(retry);
  }

  async function load() {
    if (!gridEl) return;
    if (packages.length) { renderGrid(); return; }
    errorEl && errorEl.classList.add("hidden");
    gridEl.innerHTML = "";
    gridEl.appendChild(el("p", "muted", t("modules.loading")));
    try {
      await fetchLock(false);
      renderChips();
      renderPresets();
      renderGrid();
    } catch (e) {
      gridEl.innerHTML = "";
      showError(t("modules.loadError", { msg: (e && e.message) || String(e) }));
      sfx("error");
    }
  }

  /* ---------- Ініціалізація ---------- */
  function init() {
    searchEl = $("#modulesSearch");
    chipsEl = $("#modulesFilters");
    countEl = $("#modulesCount");
    gridEl = $("#modulesGrid");
    presetsEl = $("#modulesPresets");
    infoEl = $("#modulesInfo");
    errorEl = $("#modulesError");
    moreBtn = $("#modulesMore");
    if (!gridEl) return;

    if (searchEl) {
      searchEl.addEventListener("input", () => { query = searchEl.value; shown = PAGE_SIZE; renderGrid(); });
    }
    if (moreBtn) moreBtn.onclick = () => { shown += PAGE_SIZE; renderGrid(); sfx("click"); };
    document.addEventListener("langchange", () => { renderChips(); renderPresets(); renderGrid(); });
    document.addEventListener("pythonrun", syncLoaded);
    load();
  }

  function render() {
    if (!gridEl) { init(); return; }
    syncLoaded();
    renderGrid();
  }

  /* Який пакет надає модуль: python.js використовує це для підказок про ModuleNotFoundError */
  function providerFor(importName) {
    if (!importName) return null;
    if (byImport[importName]) return byImport[importName];
    const direct = packages.find((p) => p.name === importName || p.name === importName.replace(/_/g, "-"));
    return direct ? direct.name : null;
  }

  global.Modules = {
    init, render, load, providerFor,
    installed: () => installedNow.slice(),
    all: () => packages.slice(),
    count: () => packages.length
  };
})(window);
