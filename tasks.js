/* tasks.js — розділ «Задачі»: банк задач з автоматичною перевіркою коду через Pyodide.
   Прогрес зберігається локально для кожного користувача: app.tasks.<user>
   Код розв'язку окремої задачі — у app.tasks.code.<user>.<taskId> */
(function (global) {
  const $ = (s) => document.querySelector(s);

  const POINTS = { 1: 10, 2: 15, 3: 20 };
  const LEVEL_KEYS = { 1: "tasks.level1", 2: "tasks.level2", 3: "tasks.level3" };
  const KEY_PREFIX = "app.tasks.";
  const CODE_PREFIX = "app.tasks.code.";
  const MAX_SHOWN = 120;

  const TASKS = [
    {
      id: "sum2", level: 1,
      title: { uk: "Сума двох чисел", en: "Sum of two numbers", tr: "İki sayının toplamı" },
      text: {
        uk: "На вхід надходять два цілих числа, кожне в окремому рядку. Виведи їхню суму.",
        en: "Two integers are given, one per line. Print their sum.",
        tr: "Her biri ayrı satırda iki tam sayı veriliyor. Toplamlarını yazdır."
      },
      hint: {
        uk: "Зчитай числа через int(input()), а результат виведи одним print().",
        en: "Read the numbers with int(input()) and print the result with a single print().",
        tr: "Sayıları int(input()) ile oku ve sonucu tek bir print() ile yazdır."
      },
      starter: "a = int(input())\nb = int(input())\n",
      tests: [
        { in: "3\n5\n", out: "8" },
        { in: "-2\n7\n", out: "5" },
        { in: "0\n0\n", out: "0" }
      ]
    },
    {
      id: "nextprev", level: 1,
      title: { uk: "Наступне й попереднє", en: "Next and previous", tr: "Sonraki ve önceki" },
      text: {
        uk: "Дано ціле число n. Виведи два числа: n + 1 та n − 1, кожне в окремому рядку.",
        en: "An integer n is given. Print two numbers: n + 1 and n − 1, one per line.",
        tr: "Bir n tam sayısı veriliyor. İki sayı yazdır: n + 1 ve n − 1, her biri ayrı satırda."
      },
      hint: {
        uk: "Два виклики print() дадуть два рядки виводу — саме те, що потрібно.",
        en: "Two print() calls produce two output lines — exactly what is needed.",
        tr: "İki print() çağrısı iki çıktı satırı üretir — tam da gereken bu."
      },
      starter: "n = int(input())\n",
      tests: [
        { in: "7\n", out: "8\n6" },
        { in: "-3\n", out: "-2\n-4" },
        { in: "0\n", out: "1\n-1" }
      ]
    },
    {
      id: "digitsum", level: 1,
      title: { uk: "Сума цифр числа", en: "Sum of digits", tr: "Rakamlar toplamı" },
      text: {
        uk: "Дано трицифрове число. Виведи суму його цифр.",
        en: "A three-digit number is given. Print the sum of its digits.",
        tr: "Üç basamaklı bir sayı veriliyor. Rakamları toplamını yazdır."
      },
      hint: {
        uk: "Перетвори число на рядок через str(n) і пройди по символах циклом, додаючи int(символ).",
        en: "Convert the number to a string with str(n) and loop over its characters, adding int(character).",
        tr: "Sayıyı str(n) ile metne çevir ve karakterleri döngüyle dolaşarak int(karakter) değerlerini topla."
      },
      starter: "n = int(input())\n",
      tests: [
        { in: "123\n", out: "6" },
        { in: "999\n", out: "27" },
        { in: "100\n", out: "1" }
      ]
    },
    {
      id: "rect", level: 1,
      title: { uk: "Площа й периметр", en: "Area and perimeter", tr: "Alan ve çevre" },
      text: {
        uk: "Дано довжини двох сторін прямокутника: a та b (по одному числу в рядку). Виведи площу й периметр — два числа в окремих рядках.",
        en: "Two sides of a rectangle, a and b, are given (one per line). Print the area and the perimeter, one per line.",
        tr: "Bir dikdörtgenin iki kenarı a ve b veriliyor (her biri ayrı satırda). Alanı ve çevreyi yazdır, her biri ayrı satırda."
      },
      hint: {
        uk: "Площа — це a * b, периметр — 2 * (a + b).",
        en: "The area is a * b, the perimeter is 2 * (a + b).",
        tr: "Alan a * b, çevre 2 * (a + b)."
      },
      starter: "a = int(input())\nb = int(input())\n",
      tests: [
        { in: "3\n4\n", out: "12\n14" },
        { in: "5\n5\n", out: "25\n20" },
        { in: "1\n10\n", out: "10\n22" }
      ]
    },
    {
      id: "max3", level: 2,
      title: { uk: "Найбільше з трьох", en: "Largest of three", tr: "Üçünün en büyüğü" },
      text: {
        uk: "Дано три цілих числа, кожне в окремому рядку. Виведи найбільше з них.",
        en: "Three integers are given, one per line. Print the largest of them.",
        tr: "Her biri ayrı satırda üç tam sayı veriliyor. En büyüğünü yazdır."
      },
      hint: {
        uk: "Порівнюй через if/elif або скористайся вбудованою функцією max().",
        en: "Compare with if/elif or use the built-in max() function.",
        tr: "if/elif ile karşılaştır ya da yerleşik max() fonksiyonunu kullan."
      },
      starter: "a = int(input())\nb = int(input())\nc = int(input())\n",
      tests: [
        { in: "1\n2\n3\n", out: "3" },
        { in: "9\n4\n7\n", out: "9" },
        { in: "-5\n-5\n-2\n", out: "-2" }
      ]
    },
    {
      id: "evenodd", level: 2,
      title: { uk: "Парне чи непарне", en: "Even or odd", tr: "Çift mi tek mi" },
      text: {
        uk: "Дано ціле число n. Виведи even, якщо число парне, і odd, якщо непарне.",
        en: "An integer n is given. Print even if the number is divisible by two, otherwise print odd.",
        tr: "Bir n tam sayısı veriliyor. Sayı ikiye bölünüyorsa even, bölünmüyorsa odd yazdır."
      },
      hint: {
        uk: "Остачу від ділення дає оператор %: для парних чисел n % 2 дорівнює 0.",
        en: "The % operator gives the remainder: for even numbers n % 2 equals 0.",
        tr: "% operatörü kalanı verir: çift sayılarda n % 2 değeri 0 olur."
      },
      starter: "n = int(input())\n",
      tests: [
        { in: "4\n", out: "even" },
        { in: "7\n", out: "odd" },
        { in: "0\n", out: "even" }
      ]
    },
    {
      id: "sumn", level: 2,
      title: { uk: "Сума від 1 до n", en: "Sum from 1 to n", tr: "1'den n'ye toplam" },
      text: {
        uk: "Дано ціле число n (n ≥ 1). Виведи суму всіх цілих чисел від 1 до n.",
        en: "An integer n is given (n ≥ 1). Print the sum of all integers from 1 to n.",
        tr: "Bir n tam sayısı veriliyor (n ≥ 1). 1'den n'ye kadar tüm tam sayıların toplamını yazdır."
      },
      hint: {
        uk: "Цикл for i in range(1, n + 1) перебере всі числа; range не включає верхню межу, тому пишемо n + 1.",
        en: "The loop for i in range(1, n + 1) walks through all numbers; range excludes its upper bound, hence n + 1.",
        tr: "for i in range(1, n + 1) döngüsü tüm sayıları dolaşır; range üst sınırı dahil etmez, bu yüzden n + 1."
      },
      starter: "n = int(input())\ntotal = 0\n",
      tests: [
        { in: "5\n", out: "15" },
        { in: "100\n", out: "5050" },
        { in: "1\n", out: "1" }
      ]
    },
    {
      id: "factorial", level: 2,
      title: { uk: "Факторіал", en: "Factorial", tr: "Faktöriyel" },
      text: {
        uk: "Дано ціле число n (0 ≤ n ≤ 20). Виведи n! — добуток усіх цілих чисел від 1 до n. Факторіал нуля дорівнює одиниці.",
        en: "An integer n is given (0 ≤ n ≤ 20). Print n! — the product of all integers from 1 to n. The factorial of zero equals one.",
        tr: "Bir n tam sayısı veriliyor (0 ≤ n ≤ 20). n! değerini yazdır — 1'den n'ye kadar tüm tam sayıların çarpımı. Sıfırın faktöriyeli birdir."
      },
      hint: {
        uk: "Починай добуток з одиниці (result = 1), а в циклі множи: result *= i.",
        en: "Start the product at one (result = 1) and multiply inside the loop: result *= i.",
        tr: "Çarpımı birle başlat (result = 1) ve döngü içinde çarp: result *= i."
      },
      starter: "n = int(input())\nresult = 1\n",
      tests: [
        { in: "5\n", out: "120" },
        { in: "0\n", out: "1" },
        { in: "10\n", out: "3628800" }
      ]
    },
    {
      id: "fib", level: 3,
      title: { uk: "Число Фібоначчі", en: "Fibonacci number", tr: "Fibonacci sayısı" },
      text: {
        uk: "Дано ціле число n (1 ≤ n ≤ 30). Виведи n-те число Фібоначчі: послідовність починається з одиниць, а кожне наступне число дорівнює сумі двох попередніх.",
        en: "An integer n is given (1 ≤ n ≤ 30). Print the n-th Fibonacci number: the sequence starts with ones and each next number is the sum of the two previous ones.",
        tr: "Bir n tam sayısı veriliyor (1 ≤ n ≤ 30). n'inci Fibonacci sayısını yazdır: dizi birlerle başlar ve sonraki her sayı önceki ikisinin toplamıdır."
      },
      hint: {
        uk: "Тримай два попередні значення й оновлюй їх одним рядком: a, b = b, a + b.",
        en: "Keep the two previous values and update them in one line: a, b = b, a + b.",
        tr: "Önceki iki değeri tut ve tek satırda güncelle: a, b = b, a + b."
      },
      starter: "n = int(input())\n",
      tests: [
        { in: "1\n", out: "1" },
        { in: "10\n", out: "55" },
        { in: "20\n", out: "6765" }
      ]
    },
    {
      id: "primes", level: 3,
      title: { uk: "Прості числа до n", en: "Primes up to n", tr: "n'e kadar asal sayılar" },
      text: {
        uk: "Дано ціле число n (2 ≤ n ≤ 200). Виведи через пробіл усі прості числа, які не перевищують n.",
        en: "An integer n is given (2 ≤ n ≤ 200). Print all prime numbers not greater than n, separated by spaces.",
        tr: "Bir n tam sayısı veriliyor (2 ≤ n ≤ 200). n'den büyük olmayan tüm asal sayıları boşlukla ayırarak yazdır."
      },
      hint: {
        uk: "Число просте, якщо воно більше за одиницю й не ділиться без остачі ні на що, крім одиниці та себе. Достатньо перевірити дільники від 2 до x // 2 + 1.",
        en: "A number is prime if it is greater than one and has no divisors other than one and itself. Checking divisors from 2 up to x // 2 + 1 is enough.",
        tr: "Bir sayı birden büyükse ve biri ile kendisi dışında böleni yoksa asaldır. Bölenleri 2'den x // 2 + 1'e kadar denetlemek yeterlidir."
      },
      starter: "n = int(input())\nprimes = []\n",
      tests: [
        { in: "20\n", out: "2 3 5 7 11 13 17 19" },
        { in: "2\n", out: "2" },
        { in: "10\n", out: "2 3 5 7" }
      ]
    },
    {
      id: "palindrome", level: 3,
      title: { uk: "Паліндром", en: "Palindrome", tr: "Palindrom" },
      text: {
        uk: "Дано одне слово без пробілів. Виведи yes, якщо слово читається однаково зліва направо і справа наліво, інакше виведи no.",
        en: "One word without spaces is given. Print yes if the word reads the same forwards and backwards, otherwise print no.",
        tr: "Boşluksuz bir sözcük veriliyor. Sözcük ileri ve geri aynı okunuyorsa yes, aksi halde no yazdır."
      },
      hint: {
        uk: "Рядок можна перевернути зрізом s[::-1] і порівняти з початковим.",
        en: "A string can be reversed with the slice s[::-1] and compared to the original.",
        tr: "Bir metin s[::-1] dilimiyle tersine çevrilip özgün hâliyle karşılaştırılabilir."
      },
      starter: "s = input().strip()\n",
      tests: [
        { in: "level\n", out: "yes" },
        { in: "python\n", out: "no" },
        { in: "a\n", out: "yes" }
      ]
    },
    {
      id: "words", level: 3,
      title: { uk: "Кількість слів", en: "Word count", tr: "Sözcük sayısı" },
      text: {
        uk: "Дано один рядок тексту. Виведи кількість слів у ньому (слова розділені пробілами).",
        en: "One line of text is given. Print the number of words in it (words are separated by spaces).",
        tr: "Bir satır metin veriliyor. İçindeki sözcük sayısını yazdır (sözcükler boşlukla ayrılır)."
      },
      hint: {
        uk: "Метод split() розбиває рядок на список слів, а len() показує довжину списку.",
        en: "The split() method breaks a line into a list of words and len() returns the list length.",
        tr: "split() metodu satırı sözcük listesine böler, len() ise listenin uzunluğunu verir."
      },
      starter: "s = input()\n",
      tests: [
        { in: "hello world\n", out: "2" },
        { in: "one two three four\n", out: "4" },
        { in: "python\n", out: "1" }
      ]
    }
  ];

  let listEl, detailEl, codeEl, titleEl, textEl, exampleEl, resultsEl, statusEl;
  let levelEl, solvedEl, checkBtn, hintBtn, resetBtn, nextBtn, backBtn, hintBoxEl;
  let current = null;
  let busy = false;
  let hintShown = false;

  function t(k, v) { return global.I18n ? global.I18n.t(k, v) : k; }

  function pick(obj) {
    if (!obj) return "";
    const l = global.I18n ? global.I18n.lang : "uk";
    return obj[l] || obj.uk || "";
  }

  function toast(msg) { if (global.App && global.App.toast) global.App.toast(msg); }

  function sfx(name) { global.Audio2 && global.Audio2.SFX && global.Audio2.SFX[name] && global.Audio2.SFX[name](); }

  function el(tag, cls, text) {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text != null) node.textContent = text;
    return node;
  }

  function user() { return (global.Profile && global.Profile.handle()) || "guest"; }

  function points(task) { return POINTS[task.level] || 10; }

  function getProgress() {
    try { return JSON.parse(localStorage.getItem(KEY_PREFIX + user())) || {}; }
    catch { return {}; }
  }

  function saveProgress(p) { localStorage.setItem(KEY_PREFIX + user(), JSON.stringify(p)); }

  function solvedCount() {
    const p = getProgress();
    return TASKS.filter((task) => p[task.id] && p[task.id].solved).length;
  }

  function isSolved(id) {
    const p = getProgress();
    return !!(p[id] && p[id].solved);
  }

  function draftKey(id) { return CODE_PREFIX + user() + "." + id; }

  function loadDraft(id, fallback) {
    const saved = localStorage.getItem(draftKey(id));
    return saved == null ? fallback : saved;
  }

  function saveDraft(id, code) { localStorage.setItem(draftKey(id), code); }

  /* ---------- Порівняння виводу: пробіли й порожні рядки в кінці не важливі ---------- */
  function normalize(text) {
    return String(text == null ? "" : text)
      .replace(/\r\n?/g, "\n")
      .split("\n")
      .map((l) => l.replace(/[ \t]+/g, " ").trim())
      .join("\n")
      .replace(/\n+$/g, "")
      .trim();
  }

  function clip(text) {
    const s = normalize(text);
    return s.length > MAX_SHOWN ? s.slice(0, MAX_SHOWN) + "…" : s;
  }

  /* ---------- Список задач ---------- */
  function renderList() {
    if (!listEl) return;
    listEl.innerHTML = "";
    const progress = getProgress();
    const solved = solvedCount();
    const earned = TASKS.reduce((sum, task) => sum + (progress[task.id] && progress[task.id].solved ? points(task) : 0), 0);
    const total = TASKS.reduce((sum, task) => sum + points(task), 0);

    const head = el("div", "tasks-progress");
    const label = el("div", "tasks-progress-label", t("tasks.progress", { n: solved, total: TASKS.length, points: earned, max: total }));
    const bar = el("div", "tasks-bar");
    const fill = el("div", "tasks-bar-fill");
    fill.style.width = (TASKS.length ? Math.round((solved / TASKS.length) * 100) : 0) + "%";
    bar.appendChild(fill);
    head.appendChild(label);
    head.appendChild(bar);
    listEl.appendChild(head);

    [1, 2, 3].forEach((level) => {
      const group = TASKS.filter((task) => task.level === level);
      if (!group.length) return;
      const section = el("div", "tasks-level");
      const h = el("h3", "tasks-level-title");
      h.appendChild(el("span", "tasks-level-name", t(LEVEL_KEYS[level])));
      h.appendChild(el("span", "tasks-level-points", t("tasks.levelPoints", { p: POINTS[level] })));
      section.appendChild(h);

      const grid = el("div", "tasks-grid");
      group.forEach((task) => {
        const done = !!(progress[task.id] && progress[task.id].solved);
        const card = el("button", "task-card" + (done ? " done" : ""));
        card.type = "button";
        card.dataset.id = task.id;
        const ico = el("span", "material-icons task-card-ico", done ? "task_alt" : "radio_button_unchecked");
        const body = el("span", "task-card-body");
        body.appendChild(el("span", "task-card-title", pick(task.title)));
        const meta = el("span", "task-card-meta");
        meta.appendChild(el("span", "task-card-points", t("tasks.points", { p: points(task) })));
        const attempts = progress[task.id] ? progress[task.id].attempts || 0 : 0;
        if (attempts) meta.appendChild(el("span", "task-card-attempts", t("tasks.attempts", { n: attempts })));
        if (done) meta.appendChild(el("span", "task-card-solved", t("tasks.solvedBadge")));
        body.appendChild(meta);
        card.appendChild(ico);
        card.appendChild(body);
        card.onclick = () => openTask(task.id);
        grid.appendChild(card);
      });
      section.appendChild(grid);
      listEl.appendChild(section);
    });

    if (detailEl) detailEl.classList.add("hidden");
    listEl.classList.remove("hidden");
  }

  /* ---------- Екран задачі ---------- */
  function openTask(id) {
    const task = TASKS.find((x) => x.id === id);
    if (!task) return;
    current = task;
    hintShown = false;
    if (hintBoxEl) { hintBoxEl.innerHTML = ""; hintBoxEl.classList.add("hidden"); }
    if (resultsEl) resultsEl.innerHTML = "";
    setStatus("");
    renderDetail();
    sfx("pop");
  }

  function renderDetail() {
    if (!current || !detailEl) return;
    titleEl.textContent = pick(current.title);
    textEl.textContent = pick(current.text);
    levelEl.textContent = t(LEVEL_KEYS[current.level]) + " · " + t("tasks.points", { p: points(current) });
    solvedEl.classList.toggle("hidden", !isSolved(current.id));
    codeEl.value = loadDraft(current.id, current.starter);

    exampleEl.innerHTML = "";
    const first = current.tests[0];
    if (first) {
      const wrap = el("div", "task-example-inner");
      const colIn = el("div", "task-example-col");
      colIn.appendChild(el("span", "task-example-label", t("tasks.inputData")));
      colIn.appendChild(el("pre", "task-example-pre", first.in.replace(/\n+$/g, "")));
      const colOut = el("div", "task-example-col");
      colOut.appendChild(el("span", "task-example-label", t("tasks.outputData")));
      colOut.appendChild(el("pre", "task-example-pre", first.out));
      wrap.appendChild(colIn);
      wrap.appendChild(colOut);
      exampleEl.appendChild(el("div", "task-example-title", t("tasks.example")));
      exampleEl.appendChild(wrap);
    }

    const idx = TASKS.indexOf(current);
    const nextTask = TASKS[idx + 1];
    nextBtn.classList.toggle("hidden", !nextTask);
    nextBtn.dataset.id = nextTask ? nextTask.id : "";

    detailEl.classList.remove("hidden");
    if (listEl) listEl.classList.add("hidden");
  }

  function setStatus(msg, cls) {
    if (!statusEl) return;
    statusEl.textContent = msg || "";
    statusEl.className = "task-status-line" + (cls ? " " + cls : "");
  }

  /* ---------- Перевірка розв'язку ---------- */
  async function check() {
    if (busy || !current) return;
    const code = codeEl.value;
    if (!code.trim()) { toast(t("tasks.emptyCode")); sfx("error"); return; }
    if (!global.PythonPad || typeof global.PythonPad.execute !== "function") {
      setStatus(t("tasks.unavailable"), "error");
      return;
    }

    saveDraft(current.id, code);
    busy = true;
    checkBtn.disabled = true;
    resultsEl.innerHTML = "";
    setStatus(t("tasks.checking"), "loading");
    sfx("click");

    const task = current;
    const results = [];
    let runtimeError = null;
    let errorLine = null;
    const started = performance.now();

    try {
      for (const test of task.tests) {
        const r = await global.PythonPad.execute(code, test.in);
        if (r.error) {
          runtimeError = r.error;
          errorLine = r.line || null;
          results.push({ ok: false, test: test, got: r.output, error: r.error, line: errorLine });
          break;
        }
        results.push({ ok: normalize(r.output) === normalize(test.out), test: test, got: r.output });
      }
    } catch (e) {
      runtimeError = e && e.message ? e.message : String(e);
    }

    const ms = Math.round(performance.now() - started);
    const passed = !runtimeError && results.length === task.tests.length && results.every((r) => r.ok);
    registerAttempt(task, passed);
    renderResults(task, results, runtimeError, ms, passed);
    busy = false;
    checkBtn.disabled = false;

    if (passed) {
      setStatus(t("tasks.accepted"), "ok");
      sfx("success");
    } else if (runtimeError) {
      setStatus(t("tasks.runtimeError"), "error");
      sfx("error");
    } else {
      const okCount = results.filter((r) => r.ok).length;
      setStatus(t("tasks.failed", { n: okCount, total: task.tests.length }), "bad");
      sfx("error");
    }
  }

  function registerAttempt(task, passed) {
    const p = getProgress();
    const rec = p[task.id] || { attempts: 0, solved: false };
    rec.attempts = (rec.attempts || 0) + 1;
    const firstSolve = passed && !rec.solved;
    if (passed) {
      rec.solved = true;
      rec.solvedAt = rec.solvedAt || new Date().toISOString().slice(0, 10);
    }
    p[task.id] = rec;
    saveProgress(p);
    if (firstSolve) {
      document.dispatchEvent(new CustomEvent("tasksolved", {
        detail: { id: task.id, points: points(task), solved: solvedCount(), total: TASKS.length }
      }));
      toast("🏆 " + t("tasks.solvedToast", { title: pick(task.title) }));
    }
    solvedEl.classList.toggle("hidden", !isSolved(task.id));
  }

  function renderResults(task, results, runtimeError, ms, passed) {
    resultsEl.innerHTML = "";
    const head = el("div", "task-results-head");
    head.appendChild(el("span", "material-icons", passed ? "verified" : "rule"));
    head.appendChild(el("span", null, t("tasks.resultsTitle", { ms: ms })));
    resultsEl.appendChild(head);

    results.forEach((r, i) => {
      const row = el("div", "test-row " + (r.ok ? "pass" : "fail"));
      row.appendChild(el("span", "material-icons test-ico", r.ok ? "check_circle" : "cancel"));
      const body = el("div", "test-body");
      body.appendChild(el("div", "test-name", t("tasks.test", { n: i + 1 })));
      body.appendChild(el("div", "test-line", t("tasks.inputData") + ": " + clip(r.test.in)));
      body.appendChild(el("div", "test-line", t("tasks.expected") + ": " + clip(r.test.out)));
      if (!r.ok) {
        body.appendChild(el("div", "test-line got", t("tasks.got") + ": " + (r.error ? clip(runtimeError || "") : clip(r.got))));
        if (r.line && r.error) {
          const jump = el("button", "goto-line");
          jump.type = "button";
          jump.textContent = "→ " + r.line;
          jump.title = t("python.gotoLine", { n: r.line });
          jump.onclick = () => gotoCodeLine(r.line);
          body.appendChild(jump);
        }
      }
      row.appendChild(body);
      resultsEl.appendChild(row);
    });
  }

  function gotoCodeLine(n) {
    const lines = codeEl.value.split("\n");
    const idx = Math.min(Math.max(n, 1), lines.length);
    let start = 0;
    for (let i = 0; i < idx - 1; i++) start += lines[i].length + 1;
    codeEl.focus();
    codeEl.setSelectionRange(start, start + lines[idx - 1].length);
    const lh = parseFloat(getComputedStyle(codeEl).lineHeight) || 22;
    codeEl.scrollTop = Math.max(0, (idx - 1) * lh - codeEl.clientHeight / 2);
  }

  function showHint() {
    if (!current) return;
    hintShown = true;
    if (!hintBoxEl) return;
    hintBoxEl.innerHTML = "";
    hintBoxEl.classList.remove("hidden");
    const box = el("div", "task-hint-inner");
    box.appendChild(el("span", "material-icons", "lightbulb"));
    box.appendChild(el("span", null, pick(current.hint)));
    hintBoxEl.appendChild(box);
    sfx("pop");
  }

  function resetCode() {
    if (!current) return;
    codeEl.value = current.starter;
    saveDraft(current.id, current.starter);
    resultsEl.innerHTML = "";
    setStatus("");
    sfx("click");
  }

  function showList() {
    current = null;
    renderList();
    sfx("click");
  }

  /* ---------- Ініціалізація ---------- */
  function init() {
    listEl = $("#tasksList");
    detailEl = $("#taskDetail");
    if (!listEl || !detailEl) return;
    codeEl = $("#taskCode");
    titleEl = $("#taskTitle");
    textEl = $("#taskText");
    exampleEl = $("#taskExample");
    resultsEl = $("#taskResults");
    statusEl = $("#taskStatus");
    levelEl = $("#taskLevel");
    solvedEl = $("#taskSolved");
    checkBtn = $("#taskCheck");
    hintBtn = $("#taskHint");
    resetBtn = $("#taskReset");
    nextBtn = $("#taskNext");
    backBtn = $("#taskBack");
    hintBoxEl = $("#taskHintBox");

    checkBtn.onclick = check;
    hintBtn.onclick = showHint;
    resetBtn.onclick = resetCode;
    backBtn.onclick = showList;
    nextBtn.onclick = () => { if (nextBtn.dataset.id) openTask(nextBtn.dataset.id); };

    codeEl.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); check(); return; }
      if (e.key === "Tab") {
        e.preventDefault();
        const start = codeEl.selectionStart;
        const end = codeEl.selectionEnd;
        const spaces = " ".repeat(Number(global.Settings && global.Settings.get("tabSize")) || 4);
        codeEl.value = codeEl.value.slice(0, start) + spaces + codeEl.value.slice(end);
        codeEl.selectionStart = codeEl.selectionEnd = start + spaces.length;
      }
    });
    codeEl.addEventListener("input", () => { if (current) saveDraft(current.id, codeEl.value); });

    document.addEventListener("langchange", () => {
      if (current) renderDetail(); else renderList();
    });

    renderList();
  }

  function render() {
    if (!listEl) { init(); return; }
    if (current) renderDetail(); else renderList();
  }

  global.Tasks = { init, render, open: openTask, list: () => TASKS.slice(), count: TASKS.length };
})(window);
