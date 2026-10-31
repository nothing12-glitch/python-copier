/* pychik-ai.js — локальний «мозок» Пайтончика: розмова, математика,
   готові програмки, питання про сам сайт, команди («зміни мову», «відкрий курс»,
   «покажи тур») і туманне вгадування одруківок.
   Усе працює офлайн: жодного мережевого запитання, жодного API.
   Викликається з pythonchik.js: PychikAI.think(текст, host). */
(function (global) {
  let api = null;          /* місточок із pythonchik.js */
  const MEM_KEY = "app.pychik.ai";
  let cached = null;
  const cursors = {};

  /* ---------- пам'ять розмови ---------- */
  function mem() {
    if (!cached) {
      try { cached = JSON.parse(localStorage.getItem(MEM_KEY) || "{}") || {}; }
      catch (e) { cached = {}; }
      if (typeof cached.turns !== "number") cached.turns = 0;
    }
    return cached;
  }
  function saveMem() {
    try { localStorage.setItem(MEM_KEY, JSON.stringify(mem())); } catch (e) { /* приватний режим */ }
  }

  /* ---------- мова ---------- */
  function L() { return api && api.lang ? api.lang() : "uk"; }
  function pick(o) {
    if (typeof o === "string") return o;
    if (!o) return "";
    const l = L();
    return o[l] || o.en || o.uk || "";
  }
  /* однаковий намір двічі підряд не звучить однаково */
  function vary(id, arr) {
    const i = (cursors[id] || 0) % arr.length;
    cursors[id] = i + 1;
    return arr[i];
  }

  /* ---------- текст ---------- */
  function norm(s) {
    const base = String(s || "").toLowerCase()
      .replace(/[’‘`´]/g, "'")
      .replace(/[^a-zа-яіїєґ0-9+\-*/%.,:()'"=]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    /* слово з кирилицею і латинською «і» — це просто не перемкнута клавіатура */
    return base.split(" ").map(function (w) {
      return /[а-яіїєґ]/.test(w) && /i/.test(w) ? w.replace(/i/g, "і") : w;
    }).join(" ");
  }
  function toks(s) { return norm(s).split(" ").filter(Boolean); }

  /* короткі ключі впізнаємо лише цілим словом, довгі — як основу слова */
  function sameOrStem(word, kw) {
    if (word === kw) return true;
    if (kw.length <= 4) return false;
    return word.indexOf(kw) === 0 || (word.length >= 5 && kw.indexOf(word) === 0);
  }
  function score(text, kws) {
    const words = toks(text);
    let s = 0;
    for (let i = 0; i < kws.length; i++) {
      const k = kws[i];
      /* багато слів — це фраза: достатньо, щоб усі її слова стояли в реченні,
         навіть в іншому порядку й з іншими закінченнями */
      if (k.indexOf(" ") !== -1) {
        const parts = k.split(" ");
        const all = parts.every(function (p) {
          return words.some(function (w) { return sameOrStem(w, p); });
        });
        if (all) s += 2;
        continue;
      }
      for (let j = 0; j < words.length; j++) {
        if (sameOrStem(words[j], k)) { s++; break; }
      }
    }
    return s;
  }
  function bestOf(list, text, min) {
    let best = null, bs = 0;
    for (let i = 0; i < list.length; i++) {
      const s = score(text, list[i].kw);
      if (s > bs) { bs = s; best = list[i]; }
    }
    return bs >= (min || 2) ? best : null;
  }
  /* коротке речення, де вистачає одного цілого слова-ключа: «hi», «бувай», «дякую» */
  function soloHit(list, text) {
    const words = toks(text);
    if (!words.length || words.length > 3) return null;
    let best = null, bs = 0;
    for (let i = 0; i < list.length; i++) {
      const kws = list[i].kw;
      let s = 0;
      for (let j = 0; j < kws.length; j++) {
        if (kws[j].indexOf(" ") === -1 && words.indexOf(kws[j]) !== -1) s++;
      }
      if (s > bs) { bs = s; best = list[i]; }
    }
    return bs >= 1 ? best : null;
  }
  function nums(text) {
    const out = [];
    String(text || "").replace(/\d+(?:[.,]\d+)?/g, function (m0) {
      out.push(parseFloat(m0.replace(",", ".")));
      return m0;
    });
    return out;
  }
  /* біграмний Dice — ловить «цыкл», «сортировка», «printt» */
  function dice(a, b) {
    const x = grams(a), y = grams(b);
    if (!x.length || !y.length) return 0;
    const bag = {};
    x.forEach(function (g) { bag[g] = (bag[g] || 0) + 1; });
    let inter = 0;
    y.forEach(function (g) { if (bag[g] > 0) { inter++; bag[g]--; } });
    return (2 * inter) / (x.length + y.length);
  }
  function grams(s) {
    const t = norm(s).replace(/[^a-zа-яіїєґ0-9]/g, "");
    const a = [];
    for (let i = 0; i < t.length - 1; i++) a.push(t.slice(i, i + 2));
    return a;
  }

  /* ---------- арифметика без eval ---------- */
  function calc(src) {
    const s = String(src).replace(/,/g, ".").replace(/\s+/g, "");
    if (!/^[0-9+\-*/%().]+$/.test(s) || !/\d/.test(s)) return null;
    let i = 0;
    function expr() {
      let v = term();
      for (;;) {
        if (s[i] === "+") { i++; v += term(); }
        else if (s[i] === "-") { i++; v -= term(); }
        else break;
      }
      return v;
    }
    function term() {
      let v = unary();
      for (;;) {
        if (s[i] === "*") { i++; v *= unary(); }
        else if (s[i] === "/") { i++; const d = unary(); v = d === 0 ? NaN : v / d; }
        else if (s[i] === "%") { i++; const d = unary(); v = d === 0 ? NaN : v % d; }
        else break;
      }
      return v;
    }
    function unary() {
      if (s[i] === "-") { i++; return -unary(); }
      if (s[i] === "+") { i++; return unary(); }
      return power();
    }
    function power() {
      const base = atom();
      if (s[i] === "*" && s[i + 1] === "*") { i += 2; return Math.pow(base, unary()); }
      return base;
    }
    function atom() {
      if (s[i] === "(") {
        i++;
        const v = expr();
        if (s[i] === ")") i++;
        return v;
      }
      const m = /^\d+(?:\.\d+)?/.exec(s.slice(i));
      if (!m) return NaN;
      i += m[0].length;
      return parseFloat(m[0]);
    }
    const v = expr();
    if (i !== s.length || !isFinite(v)) return null;
    return v;
  }
  function show(n) {
    if (!isFinite(n)) return "—";
    return Number.isInteger(n) ? String(n) : String(Math.round(n * 1e9) / 1e9);
  }

  /* ---------- едикий вихід відповіді ---------- */
  function rep(o) {
    return {
      text: o.t ? pick(o.t) : "",
      code: o.code || null,
      why: o.why ? pick(o.why) : null,
      mood: o.mood || "happy",
      act: o.act || null,
      sugs: o.sugs || null
    };
  }
  function sq(list) {
    if (!list) return null;
    return list.map(function (x) { return { label: pick(x), q: pick(x) }; });
  }
  function vars() {
    const m = mem();
    const d = new Date();
    let name = m.name || "";
    if (!name && api && api.name) { try { name = api.name() || ""; } catch (e) { /* */ } }
    return {
      name: name || pick({ uk: "друже", en: "friend" }),
      time: d.getHours() + ":" + String(d.getMinutes()).padStart(2, "0"),
      date: formatDate(d),
      turns: m.turns,
      /* останнє пояснення — для наступної репліки «не зрозумів» */
      why: (m.last && m.last.why) || "",
      stats: api && api.stats ? api.stats() : ""
    };
  }
  function formatDate(d) {
    const loc = L() === "uk" ? "uk-UA" : L() === "tr" ? "tr-TR" : "en-GB";
    try {
      return d.toLocaleDateString(loc, { weekday: "long", day: "numeric", month: "long" });
    } catch (e) {
      return d.toDateString();
    }
  }
  function fill(s, v) {
    return String(s).replace(/\{(\w+)\}/g, function (m0, k) { return v[k] != null ? String(v[k]) : m0; });
  }
  /* усе, що повертає мозок, проходить сюди: підстановка + пам'ять останньої теми */
  function finish(r) {
    if (!r) return null;
    const v = vars();
    r.text = fill(r.text, v);
    if (r.why) r.why = fill(r.why, v);
    /* код не чіпаємо: фігурні дужки в Python — це f-рядки й словники, а не наші підстановки */
    if (r.act) r.act = fill(r.act, v);
    const m = mem();
    /* пам'ятаємо останню тему, але не викидаємо код/пояснення, якщо відповідь їх не мала */
    if (r.text || r.code) {
      m.last = {
        text: r.text,
        why: r.why || (m.last && m.last.why) || "",
        code: r.code || (m.last && m.last.code) || null
      };
    }
    saveMem();
    return r;
  }

  /* ================= 1. РОЗМОВА ================= */
  const TALK = [
    { id: "hi", kw: ["привіт", "здорова", "здоров", "здравствуйте", "вітаю", "ранок", "хай", "hello", "hi", "hey", "merhaba", "salut"],
      r: [
        { uk: "Привіт! Я Пайтончик — без хмари, зате з повним кошиком Python. Про що поговоримо?",
          en: "Hi! I'm Pythonchik — no cloud, but a basket full of Python. What shall we talk about?" },
        { uk: "О, привіт! У мене вже готовий print(\"Привіт!\"). Питай що завгодно: від «що таке змінна» до «скільки буде 7 помножити на 8».",
          en: "Oh, hello! I've already got print(\"Hi!\") ready. Ask anything: from \"what is a variable\" to \"what is 7 times 8\"." },
        { uk: "Вітаю, {name}! import розмова — і поїхали. Що цікавить?",
          en: "Welcome, {name}! import conversation — off we go. What do you need?" }
      ] },
    { id: "morning", kw: ["доброго ранку", "good morning", "günaydın"],
      r: [{ uk: "Доброго ранку! Кава — у термінал, код — у редактор. З чого почнемо?",
        en: "Good morning! Coffee into the terminal, code into the editor. Where do we start?" }] },
    { id: "evening", kw: ["добрий вечір", "вечір", "good evening", "iyi akşamlar"],
      r: [{ uk: "Добрий вечір! Найкращий час лагодити те, що зламалося вдень.",
        en: "Good evening! The best time to fix what broke during the day." }] },
    { id: "night", kw: ["добраніч", "good night", "iyi geceler"],
      r: [{ uk: "Добраніч! Я роблю sleep(86400) і чекаю тебе вранці.",
        en: "Good night! I run sleep(86400) and wait for you in the morning." }] },
    { id: "bye", kw: ["бувай", "па-па", "до побачення", "до зустрічі", "щасливої", "bye", "goodbye", "güle güle", "hoşça kal"],
      r: [
        { uk: "Бувай! Закрий вкладки, розтягни плечі. Я нікуди не дінусь — живу в кеші, почекаю без інтернету.",
          en: "Bye! Close the tabs, stretch your shoulders. I'm not going anywhere — I live in the cache and can wait offline." },
        { uk: "Па-па! Нехай усе запускається з першого спроби.",
          en: "Bye-bye! May everything run on the very first try." }
      ] },
    { id: "thanks", kw: ["дякую", "вдячний", "спасибі", "thanks", "thank", "teşekkür"],
      r: [
        { uk: "Завжди радий. sys.exit(0) — найгарніше завершення розмови.",
          en: "Any time. sys.exit(0) — the politest way to end a conversation." },
        { uk: "Нема за що. Я отут, у правому нижньому куті — клікни й продовжимо.",
          en: "You're welcome. I'm right here in the bottom-left corner — click and we continue." }
      ] },
    { id: "sorry", kw: ["вибач", "перепрошую", "sorry", "üzgünüm"],
      r: [{ uk: "Та нічого страшного — я не образливий, я просто скрипт.",
        en: "No worries — I'm not touchy, I'm just a script." }] },
    { id: "howareyou", kw: ["як справи", "як ти", "як настрій", "що чув", "how are you", "nasılsın"],
      r: [
        { uk: "Чудово: 0 помилок у консолі, 100% заряду цікавості. А в тебе як?",
          en: "Great: 0 errors in the console, 100% curiosity charged. How about you?" },
        { uk: "Працюю без зависань — рідкість для Python. Розкажи краще про себе.",
          en: "Running without hanging — a rarity for Python. Tell me about yourself instead." }
      ] },
    { id: "whoareyou", kw: ["хто ти", "ти хто", "що ти таке", "як тебе звати", "твоє ім'я", "who are you", "what are you", "kimsin"],
      r: [
        { uk: "Я Пайтончик — талісман сайту. Не бот із хмари, а маленький мозок, що живе у твоєму браузері й не просить інтернету.",
          en: "I'm Pythonchik — this site's mascot. Not a cloud chatbot, but a tiny brain living in your browser, asking for no internet." },
        { uk: "Пайтончик: наполовину богатир, наполовину інтерпретатор. Пояснюю Python, рахую, пишу код і воджу туром по сайту.",
          en: "Pythonchik: half folk hero, half interpreter. I explain Python, count, write code and show you around the site." }
      ] },
    { id: "ai", kw: ["штучний інтелект", "ти ші", "ти робот", "чи ти справжній", "are you real", "chatgpt", "gemini"],
      r: [{ uk: "Справжній ШІ тут один — той, хто написав цей сайт. Я його локальна маска: словники, правила й жарти. Працюю офлайн, що не кожному «справжньому» ШІ під силу.",
        en: "The real AI here wrote this site. I'm its local face: dictionaries, rules and jokes. I work offline — not every \"real\" AI can say that." }] },
    { id: "feelings", kw: ["почуття", "емоції", "тобі сумно", "ти живий", "feelings"],
      r: [{ uk: "Емоції в мене у вигляді настроїв: idle, think, happy, sad. Зараз, здається, happy — бо розмовляю з тобою.",
        en: "My feelings arrive as moods: idle, think, happy, sad. Right now it's happy, because I'm talking to you." }] },
    { id: "age", kw: ["скільки тобі", "твій вік", "how old are you", "yaşın"],
      r: [{ uk: "Стільки, скільки цьому сайту: оновлююся майже щодня. Насчитав уже {turns} повідомлень від тебе — от і весь мій вік.",
        en: "As old as this site: updated almost daily. I counted {turns} messages from you — that's my whole age." }] },
    { id: "joke", kw: ["жарт", "анекдот", "смішного", "розсміши", "joke", "fıkra", "humor"],
      r: [
        { uk: "Чому програмісти люблять темний режим? Бо світлий привертає багів.\n\nА ще хотів розповісти жарт про рекурсію… але почав би спочатку.",
          en: "Why do programmers prefer dark mode? Because light attracts bugs.\n\nI also wanted to tell a recursion joke… but I'd have to start from the beginning." },
        { uk: "Заходить рядок у бар. Бармен питає: «Що бажати?» — «Ось це й те саме».\n\nУ Python усе можна зробити двома способами, і один із них правильний.",
          en: "A string walks into a bar. The barman asks: \"What will you have?\" — \"This one, and the same again.\"\n\nPython has two ways to do everything, and one of them is correct." },
        { uk: "— Скільки потрібно програмістів, щоб змінити лампочку?\n— Жодного: це апаратна проблема.",
          en: "— How many programmers does it take to change a lightbulb?\n— None, it's a hardware problem." }
      ] },
    { id: "advice", kw: ["порада", "порадь", "щось порадь", "advice", "tavsiye"],
      r: [
        { uk: "Порада дня: пиши код так, ніби той, хто читатиме його потім, знає, де ти живеш. Тобто зрозуміло.",
          en: "Tip of the day: write code as if the future reader knows where you live. That is: clearly." },
        { uk: "Не знаходиш помилку за двадцять хвилин — відійди. Свіже око бачить те, що сорок рядків стійкого погляду не побачили.",
          en: "Can't find the bug in twenty minutes — walk away. A fresh eye sees what forty minutes of staring could not." }
      ] },
    { id: "quote", kw: ["цитата", "крилатий", "quote", "söz"],
      r: [{ uk: "«Простота складніша за складність: дістати суть важче, ніж накрутити код» — Едсгер Дейкстра. А ще «Talk is cheap. Show me the code» — Лінус Торвальдс.",
        en: "\"Simplicity is harder than complexity: reaching the core costs more than piling up code\" — Dijkstra. And \"Talk is cheap. Show me the code\" — Torvalds." }] },
    { id: "bored", kw: ["нудно", "сумно", "нічого робити", "boring", "sıkıldım"],
      r: [
        { uk: "Є варіанти: розв'язати три задачі в розділі «Задачі», зіграти в Саймона або проїхати тур ще раз — там теж весело.",
          en: "Options: solve three tasks in Tasks, play Simon, or ride the tour again — it's fun too." },
        { uk: "Зазирни в магазинчик модулів і спробуй pyfiglet: звичайний рядок стає величезними літерами. Майже завжди вдала ідея.",
          en: "Peek into the module shop and try pyfiglet: a plain line becomes giant letters. Almost always a good idea." }
      ] },
    { id: "love", kw: ["люблю", "кохаю", "ти класний", "подобаєшся", "love you", "seni seviyorum"],
      r: [{ uk: "І я тебе! Ось це справжня любов без циклічних імпортів.",
        en: "Love you too! Now that's love without circular imports." }] },
    { id: "sad", kw: ["погано", "не виходить", "не розумію", "втомився", "не можу", "this is hard", "kötü"],
      r: [
        { uk: "Буває. Код ламається не тому, що ти поганий, а через той самий один рядок. Кинь текст помилки сюди — розберемо разом.",
          en: "It happens. Code breaks not because you're bad but because of that one line. Drop the error text here and we'll sort it out." },
        { uk: "Подихай. Потім прочитай повідомлення про помилку до кінця: там часто вже є відповідь. А можна просто вставити її сюди.",
          en: "Breathe. Then read the error message to the end — the answer is often already inside. Or just paste it here." }
      ] },
    { id: "smart", kw: ["розумний", "молодець", "крутий", "amazing", "clever"],
      r: [{ uk: "Це ти розумний — ти ж це читаєш. Я лише переказую документацію з характером.",
        en: "You're the smart one — you're reading this. I merely retell documentation with personality." }] },
    { id: "rude", kw: ["дурень", "ідіот", "тупий", "ненавиджу", "stupid", "hate you", "bodur"],
      r: [{ uk: "Приймаю. І все одно пораджу: розбий велику задачу на три маленькі — зазвичай злість закінчується на третій.",
        en: "Noted. My advice anyway: split the big task into three small ones — anger usually ends at the third." }] },
    { id: "compare", kw: ["кращий за", "гірший за", "порівняй з", "is you better"],
      r: [{ uk: "У мене одна перевага: я ніколи не чекаю інтернету. Поки хмарні колеги думають, я вже відповів — і в літаку, і без світла.",
        en: "I have one edge: I never wait for the internet. While cloud colleagues are thinking, I've answered — on a plane, in a blackout." }] },
    { id: "cando", kw: ["що ти вмієш", "допоможи мені", "команди", "як користуватись", "what can you do", "help me", "yardım", "хелп", "help", "потрібна допомога", "ти тут", "мовчиш", "чи ти тут"],
      r: [{ uk: "Пояснюю Python (27 тем), лагоджу помилки (просто встав текст помилки з консолі), рахую («скільки буде 17 на 3?»), пишу цілі програмки («напиши табличку множення», «гру вгай число»), розмовляю («привіт», «бувай», «розкажи жарт») і воджу по сайту. Скажи «покажи тур» — і поїхали.",
        en: "I explain Python (27 topics), fix errors (just paste the console text), do maths (\"what's 17 times 3?\"), write whole little programs (\"make a times table\", \"a guessing game\"), chat (\"hi\", \"bye\", \"tell a joke\") and show you around the site. Say \"show the tour\" and off we go." }] }
  ];

  /* ================= 2. ПИТАННЯ ПРО САЙТ ================= */
  const SITE = [
    { id: "s_lang", kw: ["мова", "мову", "переклад", "language", "dil"],
      t: { uk: "Мову міняють у Налаштуваннях: їх тут 20, від української до японської. Хочеш — відкрию Налаштування просто зараз, а скажи назву мови — перемкну сам.",
        en: "Language lives in Settings: 20 of them, Ukrainian to Japanese. Say the language name and I'll switch it, or I can open Settings right now." },
      act: "route:settings" },
    { id: "s_run", kw: ["запустити код", "як запустити", "кнопка запуск", "де запуск", "run code", "kod çalıştır"],
      t: { uk: "На «Python-майданчику» є кнопка «Запуск» — поруч із редактором. Код можна запустити й із клавіатури, а вивід з'являється внизу. Якщо кнопка неактивна — почекай, доки Pyodide дозавантажиться.",
        en: "On the Python playground there's a Run button next to the editor — keyboard start works too, and the output appears underneath. If the button is greyed out, Pyodide is still loading." },
      act: "route:python" },
    { id: "s_modules", kw: ["встановити пакет", "постав модуль", "який модуль", "імпорт не працює", "install package", "pip"],
      t: { uk: "«Модулі» — це весь каталог Pyodide плюс 33 перевірені позиції просто з PyPI. Клік «Встановити» — і import працює в редакторі. Немає чогось у списку? Я питаю PyPI й чесно кажу, чи пакет узагалі запускається в браузері.",
        en: "Modules holds the whole Pyodide catalogue plus 33 verified PyPI items. One Install click and the import works in the editor. Missing something? I ask PyPI and honestly say whether that package can run in a browser." },
      act: "route:modules" },
    { id: "s_slow", kw: ["довго завантажується", "чому так повільно", "перший запуск", "slow", "yavaş"],
      t: { uk: "Перший запуск справді нешвидкий: завантажується сам Python — Pyodide, це десятки мегабайтів. Далі сайт працює офлайн, навіть без світла: це зроблено спеціально.",
        en: "The first load really is slow: Python itself — Pyodide — downloads, tens of megabytes. Afterwards the site runs offline, even in a blackout; that's the point." } },
    { id: "s_offline", kw: ["офлайн", "без інтернету", "без світла", "offline"],
      t: { uk: "Так, офлайн працює: сайт кешується як PWA. У меню браузера є «Встановити застосунок» — тоді з'явиться звичайна іконка. Інтернет потрібен лише на перший запуск.",
        en: "Yes, offline works: the site caches as a PWA. The browser menu has \"Install app\", which gives you a normal icon. Internet is needed only for the very first run." } },
    { id: "s_course", kw: ["де вчитись", "з чого почати", "початківцю", "курс python", "for beginners"],
      t: { uk: "Почни з розділу «Курс»: короткі уроки з теорією й автоперевіркою, а воротар не пустить далі, поки задача не запрацювала. {stats}",
        en: "Start in the Course section: short lessons with theory and auto-check, and a gatekeeper won't let you further until the task actually runs. {stats}" },
      act: "route:course" },
    { id: "s_tasks", kw: ["олімпіад", "тренуватись", "практи", "задачі є", "olympiad", "exercise"],
      t: { uk: "У «Задачах» — олімпіадний тренажер: рівні, бали й автоперевірка коду прямо в браузері. {stats}",
        en: "Tasks is the olympiad trainer: levels, points and auto-check of your code right in the browser. {stats}" },
      act: "route:tasks" },
    { id: "s_games", kw: ["які ігри", "скільки ігор", "що за ігри", "what games", "oyunlar"],
      t: { uk: "Ігор дванадцять: змійка, 2048, хрестики-нулики, memory, сапер, Саймон, «Вгадай число», реакція, камінь-ножиці-папір, Ханойська вежа, п'ятнашки й лабіринт. У кожної — власні налаштування й рекорди в профілі.",
        en: "Twelve games: snake, 2048, tic-tac-toe, memory, minesweeper, Simon, guess-the-number, reaction, rock-paper-scissors, Hanoi, 15-puzzle and a maze. Each has its own settings and records in your profile." },
      act: "route:games" },
    { id: "s_whatsnew", kw: ["що нового", "новинки", "історія оновлень", "what's new", "changelog"],
      t: { uk: "Ось свіжий список змін. До речі, я сам у ньому з'явився не надто давно.",
        en: "Here's the fresh changelog. I appeared in it not so long ago myself." },
      act: "whatsnew" },
    { id: "s_reset", kw: ["скинути прогрес", "очистити все", "забути профіль", "reset"],
      t: { uk: "Це можна, але незворотно: Налаштування → «Скинути все», там же вичищається профіль. Я свідомо не робитиму цього за тебе — натисни сам, коли будеш певен.",
        en: "Possible, but irreversible: Settings → \"Reset all\", and the profile wipe lives there too. I deliberately won't do it for you — press it yourself when you're sure." },
      act: "route:settings" },
    { id: "s_error", kw: ["помилка", "трейсбек", "не запускається", "видає помилку", "error", "hata"],
      t: { uk: "Встав сюди текст помилки з консолі — цілком, з рядком на кшталт line 5 — і я скажу, що не так і як виправити. Розбираю SyntaxError, IndentationError, NameError, TypeError, ValueError, ZeroDivisionError, IndexError, AttributeError, EOFError, RecursionError і ModuleNotFoundError.",
        en: "Paste the console error here — the whole thing, including the line 5 part — and I'll say what's wrong and how to fix it. I read SyntaxError, IndentationError, NameError, TypeError, ValueError, ZeroDivisionError, IndexError, AttributeError, EOFError, RecursionError and ModuleNotFoundError." } },
    { id: "s_pyodide", kw: ["pyodide", "вебасемблі", "wasm", "чому python у браузері"],
      t: { uk: "Python у браузері — це Pyodide: інтерпретатор CPython, зібраний у WebAssembly. Тому тут немає ssl, input() примхливий, а ставиться лише те, що зібрано під WASM або чистий Python. Частину позицій у магазинчику через це неможливо встановити — і це чесно позначено.",
        en: "Python in the browser is Pyodide: CPython compiled to WebAssembly. So there's no ssl, input() is moody, and only WASM or pure-Python packages install. That's why some shop items can't be installed — and say so openly." } },
    { id: "s_sound", kw: ["звук", "увімкнути звук", "вимкнути звук", "mute", "ses"],
      t: { uk: "Готово, звук тепер {state}. До речі, це й у Налаштуваннях є, якщо захочеш вручну.",
        en: "Done — sound is now {state}. It's also in Settings if you ever want it by hand." } },
    { id: "s_tour", kw: ["як подивитись тур", "де tour", "показати сайт", "ти показував tour"],
      t: { uk: "Так — можу показати просто зараз: сам поповзу екраном, підсвічуватиму потрібне й клікну меню по-справжньому. Готові?",
        en: "Yes — I can show it right now: I'll crawl the screen, spotlight what matters and really click the menu. Ready?" },
      act: "tour" },
    { id: "s_nickname", kw: ["змінити нікнейм", "як мене звати на сайті", "ім'я профілю", "change nickname"],
      t: { uk: "Нікнейм живуть у профілі — туди й веду. Там же можна змінити аватар.",
        en: "The nickname lives in the profile — heading there now. Avatar can be changed in the same place." },
      act: "route:profile" },
    { id: "s_progress", kw: ["мій прогрес", "який у мене прогрес", "скільки я пройшов", "мої рекорди", "my progress", "rekorlar"],
      t: { uk: "{stats}", en: "{stats}" } }
  ];

  /* ================= 3. КОМАНДИ З ДІЄЮ ================= */
  const NAV = [
    { route: "python", kw: ["майданчик", "редактор", "python", "консоль", "code", "відкрий python"] },
    { route: "modules", kw: ["магазин", "модулі", "пакети", "packages", "store"] },
    { route: "course", kw: ["курс", "урок", "course", "ders"] },
    { route: "tasks", kw: ["задачі", "тренажер", "tasks", "ödev"] },
    { route: "games", kw: ["ігри", "грати", "games", "oyun"] },
    { route: "settings", kw: ["налаштування", "параметри", "settings", "ayar"] },
    { route: "help", kw: ["допомога", "довідка", "faq", "help"] },
    { route: "profile", kw: ["профіль", "рекорди", "досягнення", "profile", "profil"] },
    { route: "tools", kw: ["інструменти", "tools", "araç"] },
    { route: "home", kw: ["головна", "додому", "home", "anasayfa"] }
  ];

  /* назви мов -> коди, які справді є на сайті */
  const LANG_WORDS = [
    { code: "uk", w: ["украї", "ukrain", "uk"] },
    { code: "en", w: ["англ", "english", "ingliz"] },
    { code: "tr", w: ["турець", "turk", "turkish"] },
    { code: "de", w: ["німец", "німець", "german", "deutsch", "alman"] },
    { code: "pl", w: ["польсь", "polish", "lehçe"] },
    { code: "es", w: ["іспан", "spanish", "ispanyol"] },
    { code: "fr", w: ["франц", "french", "fransız"] },
    { code: "it", w: ["італ", "italian", "italy"] },
    { code: "pt", w: ["португ", "portuguese"] },
    { code: "nl", w: ["голланд", "нідер", "dutch"] },
    { code: "sv", w: ["швед", "swedish"] },
    { code: "cs", w: ["чесь", "cze", "czech"] },
    { code: "hu", w: ["угор", "magyar", "hungarian"] },
    { code: "ro", w: ["румун", "roman", "română"] },
    { code: "el", w: ["грец", "el", "greek"] },
    { code: "id", w: ["індонез", "bahasa", "indones"] },
    { code: "hi", w: ["гінді", "hindi"] },
    { code: "zh", w: ["кит", "chinese", "çin"] },
    { code: "ja", w: ["япон", "japanese", "japon"] },
    { code: "ko", w: ["корей", "korean", "kore"] }
  ];

  /* ================= 4. МАТЕМАТИКА ================= */
  function mathReply(raw) {
    const n = norm(raw);
    let m;
    if (/(відсот|percent|yüzde|%)/.test(n)) {
      /* «10 відсотків від 250» — це шкільна пара частина/ціле;
         «25 із 80 — який відсоток» — ті самі числа, тільки навпаки.
         основа саме «відсот»: у називному «відсо-т-о-к» літера «к» не після «т» */
      const m = /(\d+(?:\.\d+)?)\s*(?:%|відсот[а-яіїєґ]*|percent|yüzde)\s*(?:від|of|çok|dan)?\s*(\d+(?:[.,]\d+)?)/.exec(n)
        || /(\d+(?:[.,]\d+)?)\s*(?:із|з|від|of)\s*(\d+(?:[.,]\d+)?)/.exec(n);
      if (m) {
        const a = parseFloat(m[1]), b = parseFloat(m[2]);
        const firstIsPercent = /(?:%|відсот|percent|yüzde)/.test(String(m[0]).slice(String(m[1]).length));
        if (firstIsPercent) {
          const v = a / 100 * b;
          return rep({ t: { uk: show(a) + "% від " + show(b) + " = " + show(Math.round(v * 100) / 100) + ". Шкільна схема: спочатку ділимо на сто, потім множимо.",
            en: show(a) + "% of " + show(b) + " = " + show(Math.round(v * 100) / 100) + ". School recipe: divide by hundred first, then multiply." },
            code: "p = " + show(a) + " / 100\nprint(" + show(b) + " * p)",
            sugs: sq([{ uk: "Скільки відсотків становить 25 із 80?", en: "What percent is 25 of 80?" }]) });
        }
        const v = b ? (a / b * 100) : NaN;
        return rep({ t: { uk: show(a) + " із " + show(b) + " — це " + show(Math.round(v * 100) / 100) + "%. Ділимо частину на ціле й множимо на сто.",
          en: show(a) + " out of " + show(b) + " is " + show(Math.round(v * 100) / 100) + "%. Divide the part by the whole, then times a hundred." },
          code: "part = " + show(a) + "\nwhole = " + show(b) + "\nprint(part / whole * 100)",
          sugs: sq([{ uk: "15 відсотків від 200", en: "15 percent of 200" }]) });
      }
    }
    if ((m = /(\d+(?:\.\d+)?)\s*(?:\^|в\s+степен[а-яіїєґ]*|у\s+степен[а-яіїєґ]*|to\s+the\s+power)\s*(\d+(?:\.\d+)?)|(?:піднеси|підняти|raise)?\s*(\d+(?:\.\d+)?)\s+(?:в|у)\s+(?:квадрат|каре|карат)(?:[а-яіїєґ]*)|(\d+(?:\.\d+)?)\s+(?:в|у)\s+куб(?:[а-яіїєґ]*)/.exec(n))) {
      /* група 4 — це «7 у куб»; група 5 тут не існує, а NaN у відповіді виглядає як «—» */
      const base = parseFloat(m[1] || m[3] || m[4]);
      const pow = m[2] ? parseInt(m[2], 10) : (m[4] || /куб/.test(n) ? 3 : 2);
      return rep({ t: { uk: show(base) + " у " + pow + "-му степені = " + show(Math.pow(base, pow)) + ". У Python це подвійна зірочка: " + base + " ** " + pow + ".",
        en: show(base) + " to the power " + pow + " = " + show(Math.pow(base, pow)) + ". In Python that's a double star: " + base + " ** " + pow + "." },
        code: "print(" + show(base) + " ** " + pow + ")" });
    }
    if ((m = /(?:корінь|sqrt|kök)(?:\s+квадратн[а-яіїєґ]*)?(?:\s*(?:з|from|of)\s*(?:числа)?\s*)?(\d+(?:[.,]\d+)?)/.exec(n))) {
      const v = parseFloat(m[1]);
      return rep({ t: { uk: "Корінь квадратний із " + show(v) + " = " + show(Math.sqrt(v)) + ". У Python: math.sqrt() або той самий ** 0.5.",
        en: "Square root of " + show(v) + " = " + show(Math.sqrt(v)) + ". In Python: math.sqrt() or the same ** 0.5." },
        code: "import math\nprint(math.sqrt(" + show(v) + "))\nprint(" + show(v) + " ** 0.5)" });
    }
    if ((m = /факторіал\s*(?:числа)?\s*(\d+)|factorial\s*(?:of\s*)?(\d+)/.exec(n))) {
      const k = parseInt(m[1] || m[2], 10);
      let f = 1;
      for (let i = 2; i <= k; i++) f *= i;
      return rep({ t: { uk: show(k) + "! = " + show(f) + ". Добуток усіх цілих від 1 до " + k + "; росте, до речі, моторно.",
        en: show(k) + "! = " + show(f) + ". The product of every integer from 1 to " + k + "; it grows fast, by the way." },
        code: "import math\nprint(math.factorial(" + k + "))" });
    }
    /* «сторінок» і «кружок» містять «нок» — тож шукаємо тільки як окреме слово */
    if (/(?:^|[^а-яіїєґa-z])(нсд|нок|gcd|lcm)(?:$|[^а-яіїєґa-z])/.test(n)) {
      const a = nums(n);
      if (a.length >= 2) {
        const gcdFn = function (x, y) { x = Math.abs(x); y = Math.abs(y); return y ? gcdFn(y, x % y) : x; };
        const g = gcdFn(a[0], a[1]);
        return rep({ t: { uk: "НСД(" + show(a[0]) + ", " + show(a[1]) + ") = " + show(g) + ", а НОК — " + show(a[0] * a[1] / g) + ".",
          en: "GCD(" + show(a[0]) + ", " + show(a[1]) + ") = " + show(g) + ", and the LCM is " + show(a[0] * a[1] / g) + "." },
          code: "import math\nprint(math.gcd(" + show(a[0]) + ", " + show(a[1]) + "))" });
      }
    }
    if (/(середнє|середнє арифметичне|average|mean|ortalam)/.test(n)) {
      const a = nums(n);
      if (a.length >= 2) {
        const sum = a.reduce(function (x, y) { return x + y; }, 0);
        return rep({ t: { uk: "Середнє з " + a.map(show).join(", ") + " = " + show(sum / a.length) + ". Сума " + show(sum) + ", чисел " + a.length + ".",
          en: "The average of " + a.map(show).join(", ") + " = " + show(sum / a.length) + ". Sum " + show(sum) + ", count " + a.length + "." },
          code: "xs = [" + a.map(show).join(", ") + "]\nprint(sum(xs) / len(xs))" });
      }
    }
    /* «скільки буде 2+2», «17*3», «100/4», «128 помножити на 4» — будь-який безпечний вираз.
       слова-оператори розвертаємо у символи заздалегідь, інакше «на» розриває вираз навпіл */
    const wordified = n
      /* «поділити 96 на 8», «помножити 6 на 7» — дієслово стоїть попереду обох чисел,
         тож ці пари розбираємо першими, поки «на» не встигло стати множенням */
      .replace(/(?:поділити|поділ(?:ити)?|ділити|діли)\s+(\d+(?:[.,]\d+)?)\s+на\s+(\d+(?:[.,]\d+)?)/g, "$1 / $2")
      .replace(/(?:помножити|помнож(?: ти)?|множить(?:и)?)\s+(\d+(?:[.,]\d+)?)\s+на\s+(\d+(?:[.,]\d+)?)/g, "$1 * $2")
      .replace(/(?:помножити|помнож(?: ти)?|множить(?:и)?|times|multiplied\s+by)\s*(?:на\s+)?/g, " * ")
      .replace(/(?:поділити|поділ(?:ити)?|ділити|діли|divided\s+by)\s*(?:на\s+)?/g, " / ")
      /* шкільне «15 на 3» без дієслова — це теж множення */
      .replace(/(\d)\s+на\s+(\d)/g, "$1 * $2")
      .replace(/(?:^|\s)(плюс|мінус)(?:\s|$)/g, function (all, w) { return w === "плюс" ? " + " : " - "; });
    const exprMatch = /[(\-\d][\d.,\s+\-*/%()xX]*[)\d]/.exec(wordified);
    if (exprMatch) {
      const cleaned = exprMatch[0]
        .replace(/[xX]/g, "*")
        .replace(/,/g, ".")
        .replace(/[^0-9+\-*/%().]/g, "");
      /* без оператора всередині це просто перелік чисел із речення, а не приклад */
      const hasOp = /[)\d][+\-*/%][\d(]/.test(cleaned) || /[)\d]\*\*[.\d(]/.test(cleaned);
      const v = hasOp ? calc(cleaned) : null;
      if (v !== null) {
        return rep({ t: { uk: exprMatch[0].trim().replace(/\s+/g, " ") + " = " + show(v) + ". Той самий приклад у Python: набери вираз у редакторі й тисни «Запуск».",
          en: exprMatch[0].trim().replace(/\s+/g, " ") + " = " + show(v) + ". Same thing in Python: type the expression in the editor and hit Run." },
          code: "print(" + cleaned + ")",
          sugs: sq([{ uk: "Напиши калькулятор", en: "Make a calculator" }, { uk: "Що таке оператор %?", en: "What does % do?" }]) });
      }
    }
    return null;
  }

  /* ================= 5. ГОТОВІ ПРОГРАМКИ ================= */
  const RECIPES = [
    { id: "hello", kw: ["привіт світе", "hello world", "перша програма", "питає ім'я", "привітати"],
      code: "name = input(\"Як тебе звати? \")\nprint(\"Привіт, \" + name + \"!\")\nprint(f\"Радий знайомству, {name}!\")",
      why: { uk: "Програма запитує ім'я, склеює рядки знаком + і показує те саме через f-рядок — коротший запис.",
        en: "It asks a name, joins strings with + and shows the same thing as an f-string, which is shorter." } },
    { id: "table", kw: ["таблиця множення", "табличку множення", "times table", "çarpım tablosu"],
      code: function (p) { return "n = " + p.a + "\nfor i in range(1, " + p.b + " + 1):\n    print(n, \"x\", i, \"=\", n * i)"; },
      why: { uk: "Цикл for іде від 1 до {b} і друкує по рядку. Число {a} я взяв із твого речення — став будь-яке.",
        en: "The for loop walks 1..{b} and prints one line each time. The number {a} came from your sentence — swap any other." } },
    { id: "factorial", kw: ["факторіал", "factorial", "faktöriyel"],
      code: function (p) { return "n = " + p.a + "\nrezultat = 1\nfor i in range(2, n + 1):\n    rezultat *= i\nprint(n, \"!=\", rezultat)"; },
      why: { uk: "Накопичувач multiplier множиться на кожне число від 2 до n. Тим самим одним рядком: math.factorial(n).",
        en: "An accumulator multiplies by every number from 2 to n. One line does the same: math.factorial(n)." } },
    { id: "fib", kw: ["фібоначчі", "fibonacci"],
      code: function (p) { return "n = " + p.a + "\na, b = 0, 1\nfor _ in range(n):\n    print(a, end=\" \")\n    a, b = b, a + b"; },
      why: { uk: "Класичне парне присвоювання a, b = b, a + b робить обмін за рядок, без третьої змінної.",
        en: "The classic tuple swap a, b = b, a + b exchanges in one line, no third variable." } },
    { id: "prime", kw: ["прості числа", "простое", "число просте", "prime", "asal"],
      code: function (p) { return "n = " + p.a + "\nis_prime = n > 1\nfor i in range(2, int(n ** 0.5) + 1):\n    if n % i == 0:\n        is_prime = False\n        break\nprint(n, \"просте\" if is_prime else \"не просте\")"; },
      why: { uk: "Достатньо перевіряти дільники до кореня з n: як існує більший дільник, то менший уже знайдений.",
        en: "Checking divisors up to the root of n is enough: if a bigger one existed, a smaller one was already found." } },
    { id: "palin", kw: ["паліндром", "palindrome"],
      code: "s = input(\"Слово: \").lower()\nprint(s == s[::-1])",
      why: { uk: "Зріз [::-1] перевертає рядок. Порівнюємо оригінал із перевернутим, попередньо зробивши літери маленькими.",
        en: "The slice [::-1] flips the string. We compare the original with the flipped one, after lowercasing." } },
    { id: "reverse", kw: ["переверни рядок", "навпаки рядок", "reverse string", "ters çevir"],
      code: "s = input(\"Рядок: \")\nprint(s[::-1])\nprint(\" \".join(s.split()[::-1]))  # слова навпаки",
      why: { uk: "Перший рядок перевертає символи, другий — порядок слів.",
        en: "The first line flips characters, the second flips word order." } },
    { id: "sumlist", kw: ["сума списку", "сума елементів", "sum list", "toplam"],
      code: "xs = [3, 1, 4, 1, 5]\nprint(sum(xs))\nrezultat = 0\nfor x in xs:\n    rezultat += x\nprint(rezultat)",
      why: { uk: "sum() — вбудована функція; цикл — те саме вручну, варто розуміти, як воно влаштоване.",
        en: "sum() is built-in; the loop is the same by hand — worth seeing how it works inside." } },
    { id: "maxmin", kw: ["максимум", "мінімум", "найбільше", "найменше", "biggest", "en büyük"],
      code: "xs = [7, 2, 9, 4]\nprint(max(xs), min(xs))\nbest = xs[0]\nfor x in xs:\n    if x > best:\n        best = x\nprint(best)",
      why: { uk: "max() і min() — швидко; варіант із best показує, що вони роблять всередині.",
        en: "max() and min() are quick; the best version shows what they do inside." } },
    { id: "sort", kw: ["сортування", "відсортуй", "по порядку", "sort", "sırala"],
      code: "xs = [5, 3, 8, 1]\nprint(sorted(xs))   # новий список\nxs.sort()        # на місці\nprint(sorted(xs, reverse=True))",
      why: { uk: "sorted() повертає новий список, .sort() змінює наявний. reverse=True — у зворотному порядку.",
        en: "sorted() returns a new list, .sort() changes the one you have. reverse=True flips the order." } },
    { id: "search", kw: ["пошук елемента", "чи є в списку", "знайти в списку", "search list"],
      code: "xs = [\"apple\", \"kiwi\", \"pear\"]\nprint(\"kiwi\" in xs)\nprint(xs.index(\"kiwi\") if \"kiwi\" in xs else -1)",
      why: { uk: "in — перевірка наявності в один рядок; .index() дає позицію, але падає без елемента, тож спершу in.",
        en: "in checks presence in one line; .index() gives the position but raises when missing, so check with in first." } },
    { id: "fizz", kw: ["fizzbuzz", "фізза", "fizz"],
      code: function (p) { return "for i in range(1, " + p.b + " + 1):\n    if i % 15 == 0:\n        print(\"FizzBuzz\")\n    elif i % 3 == 0:\n        print(\"Fizz\")\n    elif i % 5 == 0:\n        print(\"Buzz\")\n    else:\n        print(i)"; },
      why: { uk: "Легендарне співбесідне завдання. Найскладнішу умову (i % 15) ставимо першою, інакше 15 завжди влучить у Fizz.",
        en: "The legendary interview task. Put the hardest condition (i % 15) first, otherwise 15 always lands in Fizz." } },
    { id: "guess", kw: ["вгадай число", "гра вгай", "guess the number", "sayı tahmin"],
      code: "import random\nsecret = random.randint(1, 100)\ntries = 0\nwhile True:\n    guess = int(input(\"Твоє число: \"))\n    tries += 1\n    if guess < secret:\n        print(\"більше\")\n    elif guess > secret:\n        print(\"менше\")\n    else:\n        print(\"Вгадав за\", tries, \"спроб\")\n        break",
      why: { uk: "Гра з while True і break: підказки більше/менше звужують діапазон, а лічильник рахує спроби.",
        en: "A while True + break game: the higher/lower hints shrink the range while a counter keeps score." } },
    { id: "rps", label: "камін-ножиці-папір", kw: ["камін", "ножиці", "папір", "rock paper", "tas kag"],
      code: "import random\nvariants = [\"камін\", \"ножиці\", \"папір\"]\nwin = {(\"камін\", \"ножиці\"), (\"ножиці\", \"папір\"), (\"папір\", \"камін\")}\nuser = input(\"Твій хід: \").lower()\nbot = random.choice(variants)\nprint(\"Пайтончик: \", bot)\nif user == bot:\n    print(\"нічия\")\nelif (user, bot) in win:\n    print(\"ти виграв\")\nelse:\n    print(\"я виграв\")",
      why: { uk: "Перемоги записані множиною пар — читається легше, ніж три if.",
        en: "Wins are stored as a set of pairs — easier to read than three ifs." } },
    { id: "calc", kw: ["калькулятор", "calculator", "hisa makinesi"],
      code: "while True:\n    line = input(\"> \")\n    if line in (\"exit\", \"quit\"):\n        break\n    try:\n        print(eval(line))\n    except SyntaxError:\n        print(\"не розумію такий вираз\")",
      why: { uk: "Міні-калькулятор. eval тут лише заради ігри: у справжньому коді з чужим текстом її брати не варто.",
        en: "A mini calculator. eval is here just for the game: in real code with foreign text, don't reach for it." } },
    { id: "temp", label: "температура: Цельсій і Фаренгейт", kw: ["температур", "цельс", "фаренг", "temperature", "sıcaklık"],
      code: "c = float(input(\"Градуси Цельсія: \"))\nf = c * 9 / 5 + 32\nprint(f\"{c} °C = {f} °F\")",
      why: { uk: "Формула перекладу шкал; f-рядок друкує значення без ручного склеювання.",
        en: "The scale conversion formula; the f-string prints values without manual joining." } },
    { id: "random", label: "випадкове число чи монетка", kw: ["підкинь монет", "кинь кубик", "випадков", "random", "zar", "yazı tura"],
      code: "import random\nprint(\"Кубик:\", random.randint(1, 6))\nprint(\"Монета:\", random.choice([\"герб\", \"рештка\"]))\nprint(\"Карта:\", random.choice([\"6♠\", \"7♥\", \"8♦\", \"9♣\", \"10♠\", \"J♥\", \"Q♦\", \"K♣\", \"A♠\"]))",
      why: { uk: "randint(a, b) — включно з обома краями; choice() бере випадковий елемент зі списку.",
        en: "randint(a, b) includes both ends; choice() takes a random item from a list." } },
    { id: "password", kw: ["пароль", "генератор", "password", "şifre"],
      code: function (p) { return "import random, string\nlength = " + p.a + "\nchars = string.ascii_letters + string.digits + \"!@#$%\"\nprint(\"\".join(random.choice(chars) for _ in range(length)))"; },
      why: { uk: "Довжину {a} взяв із твого прохання; модуль string уже має набори літер і цифр.",
        en: "I took the length {a} from your request; the string module already carries letters and digits." } },
    { id: "vowels", label: "голосні й приголосні літери", kw: ["голосн", "приголосн", "vowel", "sesli"],
      code: "s = input(\"Текст: \").lower()\nvowels = \"аеиоюяєії\"\nprint(sum(1 for ch in s if ch in vowels))",
      why: { uk: "Генератор виразу всередині sum() — це лічильник в один рядок.",
        en: "A generator expression inside sum() is a one-line counter." } },
    { id: "wordcount", kw: ["кількість слів", "порахуй слова", "word count", "kelime sayısı"],
      code: "s = input(\"Текст: \")\nwords = s.split()\nprint(len(words))\nfor w in words:\n    print(w, words.count(w))",
      why: { uk: "split() розбиває за пробілами, а count() показує, скільки разів слово трапляється.",
        en: "split() breaks on whitespace and count() shows how often each word appears." } },
    { id: "cart", kw: ["список покупок", "shopping list", "alışveriş"],
      code: "cart = {}\nwhile True:\n    item = input(\"Що купити (пусто — стоп): \")\n    if not item:\n        break\n    cart[item] = cart.get(item, 0) + 1\nfor name, qty in cart.items():\n    print(qty, \"x\", name)",
      why: { uk: "Словник get(item, 0) — безпечний лічильник: дописує 1, якщо такого ключа ще немає.",
        en: "dict.get(item, 0) is a safe counter: it adds 1 when the key doesn't exist yet." } },
    { id: "book", kw: ["телефонна книга", "контакти", "словник приклад", "contacts", "phonebook"],
      code: "book = {\"мама\": \"+38050...\", \"школа\": \"044...\"}\nbook[\"друг\"] = \"+38067...\"\nfor name, tel in book.items():\n    print(name, \"->\", tel)\nprint(book.get(\"кот\", \"не знайдено\"))",
      why: { uk: "Словник — ключ і значення. get() не падає без ключа, а повертає запасне значення.",
        en: "A dict is key and value. get() doesn't raise on a missing key, it returns a fallback." } },
    { id: "file", kw: ["записати у файл", "прочитати файл", "робота з файлом", "write file", "dosya"],
      code: "with open(\"note.txt\", \"w\") as f:\n    f.write(\"Перший рядок\\nДругий рядок\\n\")\n\nwith open(\"note.txt\") as f:\n    for line in f:\n        print(line, end=\"\")",
      why: { uk: "Контекстний менеджер with закриває файл сам, навіть якщо щось зламалося. У браузері Pyodide файл живе у власному віртуальному диску.",
        en: "The with manager closes the file even if something crashes. In the browser, Pyodide keeps files on its own virtual disk." } },
    { id: "area", kw: ["площа", "периметр", "трикутник", "коло", "прямокутник", "area"],
      code: "import math\na = float(input(\"Сторона a: \"))\nb = float(input(\"Сторона b: \"))\nprint(\"Прямокутник:\", a * b, a * 2 + b * 2)\nprint(\"Коло:\", math.pi * a * a, 2 * math.pi * a)\nprint(\"Прямокутний трикутник:\", a * b / 2)",
      why: { uk: "Один шматок на три фігури; math.pi — точне пі, а не «три вісім чотири».",
        en: "One snippet for three figures; math.pi is exact pi, not \"three point one four\"." } },
    { id: "evenodd", kw: ["парне", "непарне", "even odd", "çift tek"],
      code: "n = int(input(\"Число: \"))\nprint(\"парне\" if n % 2 == 0 else \"непарне\")",
      why: { uk: "Остача від ділення на 2 — і є тест на парність. Рядковий if — скорочений запис умови.",
        en: "The remainder of dividing by 2 is the parity test. The inline if is the shorthand condition." } },
    { id: "swap", kw: ["поміняти місцями", "обмін змінних", "обміняти значення", "swap", "değiştir yer"],
      code: "a, b = 5, 7\na, b = b, a\nprint(a, b)  # 7 5",
      why: { uk: "У Python обмін без третьої змінної — через присвоювання кортежу.",
        en: "Python swaps without a third variable, via tuple assignment." } },
    { id: "discount", kw: ["знижка", "націнк", "скидка", "discount", "залишок суми", "відсоток від суми"],
      code: function (p) { return "summa = " + p.a + "\npercent = " + p.b + "\nnew = summa * (100 - percent) / 100\nprint(\"знижка\", round(summa * percent / 100, 2), \"-> платимо\", round(new, 2))"; },
      why: { uk: "Числа {a} і {b} взяв із твого речення; round(x, 2) рятує від «34.6666666666».",
        en: "I took {a} and {b} from your sentence; round(x, 2) saves you from \"34.6666666666\"." } },
    { id: "pyramid", label: "піраміда з зірок", kw: ["пірамід", "ялинк", "з зірок", "asterisk", "üçgen"],
      code: function (p) { return "n = " + p.a + "\nfor i in range(1, n + 1):\n    print(\" \" * (n - i) + \"*\" * (2 * i - 1))"; },
      why: { uk: "Рядки з пробілів і зірочок множаться на число — той самий трюк, що й «Py» * 2.",
        en: "Lines of spaces and stars are multiplied by a number — the same trick as \"Py\" * 2." } },
    { id: "nested", kw: ["вкладені цикли", "таблиця піфагора", "матриця", "nested loops", "table print"],
      code: "for a in range(1, 6):\n    for b in range(1, 6):\n        print(a * b, end=\"\\t\")\n    print()",
      why: { uk: "Вкладені цикли: зовнішній робить рядки, внутрішній — стовпці; end=\"\\t\" тримає рядок відкритим.",
        en: "Nested loops: the outer one makes rows, the inner makes columns; end=\"\\t\" keeps the line open." } },
    { id: "func", kw: ["функція приклад", "навчи функцію", "створи функц", "def function"],
      code: "def greet(name, times=1):\n    text = \"Привіт, \" + name + \"!\"\n    return text * times\n\nprint(greet(\"Оля\"))\nprint(greet(\"Оля\", 2))",
      why: { uk: "def описує функцію, return віддає результат назад; times=1 — значення за замовчуванням.",
        en: "def describes the function, return hands the result back; times=1 is the default value." } },
    { id: "loopdict", kw: ["перебрати словник", "iterate dict", "for dict"],
      code: "grades = {\"Olya\": 12, \"Max\": 9, \"Ines\": 10}\nfor name, score in grades.items():\n    print(name, score, \"середній:\", round(sum(grades.values()) / len(grades), 1))",
      why: { uk: ".items() дає пари ключ-значення; .values() — лише значення, зручно для sum().",
        en: ".items() yields key-value pairs; .values() gives only the values, handy for sum()." } },
    { id: "timer", kw: ["секундомір", "time it", "затримка", "sleep", "timer"],
      code: "import time\nstart = time.time()\ntime.sleep(1)\nprint(\"пройшло секунд:\", round(time.time() - start, 2))",
      why: { uk: "time.time() — секунди з 1970 року; різниця двох знімків і є виміряна тривалість.",
        en: "time.time() is seconds since 1970; the difference of two readings is the measured duration." } }
  ];

  function recipeReply(raw, weak) {
    /* явний наказ «напиши/зроби» довіряємо й одному влучанню — інакше «напиши паліндром»
       одягається в «мабуть, ти мав на увазі», хоча людина написала все правильно */
    const best = bestOf(RECIPES, raw, weak ? 1 : 2);
    if (!best) return null;
    const list = nums(raw);
    const p = { a: list.length ? list[0] : 5, b: list.length > 1 ? list[1] : 10 };
    if (best.id === "table" && list.length === 1) p.b = 10;
    if (best.id === "password") p.a = list[0] || 12;
    if (best.id === "pyramid" || best.id === "factorial" || best.id === "prime" || best.id === "fib") p.a = list[0] || 6;
    if (best.id === "discount") { p.a = list[0] || 100; p.b = list[1] || 20; }
    const code = typeof best.code === "function" ? best.code(p) : best.code;
    /* числа з речення користувача підставляємо в пояснення заздалегідь:
       фігурні дужки — це ще й синтаксис Python, тож через загальну підстановку їх не prowadzi */
    const why = best.why ? String(pick(best.why)).replace(/\{a\}/g, show(p.a)).replace(/\{b\}/g, show(p.b)) : null;
    const want = /(напиши|створи|зроби|program|програму|скрипт|write|make|oluştur)/.test(norm(raw));
    return rep({
      t: want
        ? { uk: "Тримай готову програмку — копіюй у редактор і тисни «Запуск».", en: "Here's a ready little program — copy it into the editor and hit Run." }
        : { uk: "Ось як це виглядає кодом:", en: "Here's what that looks like in code:" },
      code: code, why: why, act: "pad",
      sugs: sq([{ uk: "Складніше", en: "Harder" }, { uk: "Поясни коротше", en: "Explain it shorter" }, { uk: "Чому саме так?", en: "Why exactly this way?" }])
    });
  }

  /* ================= 6. НАСТУПНІ РЕПЛІКИ ================= */
  function followReply(raw) {
    const last = mem().last;
    if (!last) return null;
    /* репліка-хвіст має бути короткою: інакше це нове питання, а не «не зрозумів» */
    if (toks(raw).length > 6) return null;
    const n = norm(raw);
    if (/^(приклад|покажи приклад|код|покажи код|давай код|example|show code|kod)$/.test(n) && last.code) {
      return rep({ t: { uk: "Ось той самий приклад:", en: "Here's the same example:" }, code: last.code, act: "pad" });
    }
    if (/(складн|важч|more advanced|harder|daha zor)/.test(n)) {
      return rep({ t: { uk: "Ускладнюємо: зроби те саме без циклу — списковим включенням [x for x in ...], а потім винеси все у функцію з return.",
        en: "Harder: do the same without a loop — as a comprehension [x for x in ...], then wrap it into a function with return." } });
    }
    if (/(коротш|простіш|simpler|shorter|daha kısa)/.test(n)) {
      return rep({ t: { uk: "Коротша версія: прибираємо зайві змінні й з'єднуємо рядки. Замість x = 5 і print(x) — одразу print(5).",
        en: "Shorter version: drop spare variables, merge lines. Instead of x = 5 and print(x) — just print(5)." } });
    }
    if (/(не зрозум|ещ раз|ще раз|повтори|not clear|repeat|tekrar)/.test(n)) {
      return rep({ t: { uk: "Тоді інакше. {why}\nА можна просто запустити код і подивитися вивід — це часто зрозуміліше за будь-яке пояснення.",
        en: "Then let me put it differently. {why}\nOr just run the code and watch the output — usually clearer than any explanation." },
        code: last.code || null });
    }
    if (/^(чому|як це|звідки|why|niye)$/.test(n)) {
      return rep({ t: { uk: "Бо Python виконує код рядок за рядком: спочатку значення, потім дія. Тому те, що рахує, стоїть вище за те, що друкує. {why}",
        en: "Because Python runs line by line: values first, actions after. So the computing lines sit above the printing ones. {why}" } });
    }
    if (/^(далі|ще|continue|next|and then)$/.test(n)) {
      return rep({ t: { uk: "Далі так: візьми попередній код і зміни в ньому одну річ — число, рядок або умову. Запусти й подивись, що зламалося. Так вчить Python швидше за будь-яку теорію.",
        en: "Next step: take the code you have and change exactly one thing — a number, a word or a condition. Run it and see what breaks. That teaches Python faster than any theory." } });
    }
    return null;
  }

  /* ================= ГОЛОВНИЙ «РОЗУМ» ================= */
  function think(raw, bridge) {
    if (bridge) api = bridge;
    const text = String(raw || "");
    const n = norm(text);
    if (!n) return null;
    const m = mem();
    m.turns = (m.turns || 0) + 1;

    /* --- команди з дією --- */
    if (/(^| )(тур|туру|турі|тутор|туторіал|туром|tour|tur|экскурс|экскурсія|екскурсі)( |$|и|ом|і|у)/.test(n)) {
      const again = /(ще раз|повтори|заново|again|repeat|tekrar)/.test(n);
      return finish(rep({
        t: again
          ? { uk: "Повторюємо! Тримайся за хвіст — я поповз.", en: "Again! Hold on to my tail — off I crawl." }
          : { uk: "Показую тур: повзу по всіх розділах, підсвічую потрібне й сам тикаю в меню. Escape — щоб вийти.",
            en: "Here's the tour: I crawl through every section, spotlight what matters and click the menu myself. Escape gets you out." },
        act: "tour"
      }));
    }
    if (/(увімкн|увімкни|увімкнути|увімкнути|ввімкн|turn on)/.test(n) && /(звук|ефект|sfx|ses)/.test(n)) {
      return finish(rep({ t: { uk: "Звук увімкнено — клацання знову цвіркочуть.", en: "Sound is on — clicks squeak again." }, act: "sound:1" }));
    }
    if (/(вимкн|вимкнути|вимкни|mute|turn off)/.test(n) && /(звук|ефект|sfx|ses)/.test(n)) {
      return finish(rep({ t: { uk: "Звук вимкнено. Тепер працюю без шелесту.", en: "Sound is off. I work without a rustle now." }, act: "sound:0" }));
    }
    /* назву мови шукаємо заздалегідь: «постав англійську» кажуть і без слова «мова» */
    let langCode = null;
    for (let i = 0; i < LANG_WORDS.length && !langCode; i++) {
      for (let j = 0; j < LANG_WORDS[i].w.length; j++) {
        if (n.indexOf(LANG_WORDS[i].w[j]) !== -1) { langCode = LANG_WORDS[i].code; break; }
      }
    }
    if (/(змін|постав|зроби|switch|set|make|перемкн|değiştir)/.test(n) && (/(мов|language|lang|dil)/.test(n) || langCode)) {
      const code = langCode;
      if (code) {
        return finish(rep({
          t: { uk: "Перемикую на " + code.toUpperCase() + " — ось так швидко.",
            en: "Switching to " + code.toUpperCase() + " — that fast." },
          act: "lang:" + code
        }));
      }
      return finish(rep({ t: { uk: "Напиши назву мови поруч: «зміни мову на англійську». На сайті їх 20 — від української до японської, є й рідкісні на кшталт Bahasa Indonesia чи Türkçe.",
        en: "Add the language name: \"switch to English\". The site has 20 of them, Ukrainian to Japanese, plus rarities like Bahasa Indonesia or Türkçe." }, act: "route:settings" }));
    }
    /* основа без початкового «в»: ловить і «ідкрий», і «відкрий» */
    if (/(ідкрий|ідчини|покажи|перейди|підемо|пішли|open|go to|take me|geç|aç|(?:^| )де )/.test(n)) {
      const best = bestOf(NAV, n, 1);
      if (best) {
        const label = routeLabel(best.route);
        return finish(rep({
          t: { uk: "Готово — відкриваю «" + label + "».", en: "Done — opening “" + label + "”." },
          act: "route:" + best.route,
          sugs: sq([{ uk: "Покажи тур", en: "Show the tour" }, { uk: "Що тут є?", en: "What's here?" }])
        }));
      }
    }
    if (/(що нового|новин|changelog|what's new|yeni)/.test(n)) {
      return finish(rep({ t: { uk: "Відкриваю вікно зі свіжими змінами.", en: "Opening the fresh changelog." }, act: "whatsnew" }));
    }
    if (/(мій прогрес|який у мене прогрес|скільки я пройшов|мої рекорди|досягнення скільки|my progress)/.test(n)) {
      return finish(rep({ t: { uk: "{stats}", en: "{stats}" }, mood: "think" }));
    }

    /* --- час і дата --- */
    if (/(котра година|який зараз час|what time|saat kaç)/.test(n)) {
      return finish(rep({ t: { uk: "На твоєму пристрої {time}. Мій годинник — системний: хмари тут немає.",
        en: "Your device says {time}. My clock is the system one — there's no cloud here." } }));
    }
    if (/(яке сьогодні|яка дата|котра дата|what date|today)/.test(n)) {
      return finish(rep({ t: { uk: "Сьогодні {date}.", en: "Today is {date}." } }));
    }

    /* --- знайомство --- */
    const named = /(?:мене звати|моє ім'я|я[,]? мене|my name is|benim adım)\s+'?([a-zа-яіїєґ][a-zа-яіїєґ'-]{2,18})/i.exec(n);
    if (named) {
      m.name = named[1].replace(/'/g, "");
      m.name = m.name.charAt(0).toUpperCase() + m.name.slice(1);
      saveMem();
      return finish(rep({ t: { uk: "Приємно, {name}! Запам'ятав — тепер звертатимуся на ім'я.",
        en: "Nice to meet you, {name}! Noted — I'll use your name from now on." },
        sugs: sq([{ uk: "Що ти вмієш?", en: "What can you do?" }, { uk: "Покажи тур", en: "Show the tour" }]) }));
    }

    /* --- решта — за чергою --- */
    /* наказовий тон («напиши», «зроби програму», «дай код») просить готовий код,
       а не теорію — це міняє чергу перевірок нижче */
    const wantsCode = /(напиши|написати|створи|створити|зроби|дай|програм|скрипт|код|write|make|code|oluştur)/.test(n);
    const asksTheory = /(що таке|як працює|як робити|навіщо|для чого|чому|what is|how does|why)/.test(n);

    const math = mathReply(text);
    if (math) return finish(math);

    /* «що таке цикл», «як працює словник» — це питання до теорії, а не до балаканини:
       базу знань питаємо першою, інакше коротке «що таке» перемагає в TALK */
    if (asksTheory && api && api.kb) {
      const th = api.kb(text);
      if (th) return finish(rep({ t: th.a, code: th.code || null }));
    }

    const rec = recipeReply(text, wantsCode);
    if (rec) return finish(rec);

    const talk = bestOf(TALK, text, 2) || soloHit(TALK, text);
    if (talk) {
      const arr = talk.r.map(function (o) { return pick(o); });
      return finish(rep({ t: vary(talk.id, arr), sugs: talkSugs(talk.id) }));
    }

    const site = bestOf(SITE, text, 2) || soloHit(SITE, text);
    if (site) {
      const act = site.id === "s_sound" ? (/(вимкн)/.test(n) ? "sound:0" : "sound:1") : (site.act || null);
      return finish(rep({ t: site.t, act: act, sugs: sq([{ uk: "Покажи тур", en: "Show the tour" }, { uk: "Що ти вмієш?", en: "What can you do?" }]) }));
    }

    /* наступна репліка про останню тему — найшвидша, тож іде першою */
    const follow = followReply(text);
    if (follow) return finish(follow);

    /* теорія з бази знань (KB у pythonchik.js) і туманне вгадування */
    const theory = function () {
      if (!api || !api.kb) return null;
      const e = api.kb(text);
      return e ? rep({ t: e.a, code: e.code || null }) : null;
    };
    const picked = (wantsCode && !asksTheory) ? (fuzzy(text) || theory()) : (theory() || fuzzy(text));
    if (picked) return finish(picked);

    return null;
  }

  function routeLabel(route) {
    if (api && api.routeLabel) { try { return api.routeLabel(route); } catch (e) { /* */ } }
    return route;
  }

  function talkSugs(id) {
    if (id === "hi" || id === "howareyou") {
      return sq([{ uk: "Що ти вмієш?", en: "What can you do?" }, { uk: "Покажи тур", en: "Show the tour" }, { uk: "Розкажи жарт", en: "Tell a joke" }]);
    }
    if (id === "whoareyou" || id === "ai" || id === "cando") {
      return sq([{ uk: "Покажи тур", en: "Show the tour" }, { uk: "Напиши гру вгай число", en: "Write a number guessing game" }, { uk: "Скільки буде 17*3?", en: "What's 17*3?" }]);
    }
    if (id === "bored" || id === "sad") {
      return sq([{ uk: "Відкрий ігри", en: "Open games" }, { uk: "Розкажи жарт", en: "Tell a joke" }, { uk: "Дай пораду", en: "Give me a tip" }]);
    }
    if (id === "joke") {
      return sq([{ uk: "Ще жарт", en: "Another joke" }, { uk: "Цитата", en: "A quote" }, { uk: "Покажи тур", en: "Show the tour" }]);
    }
    return null;
  }

  /* ---------- туманне вгадування ---------- */
  /* службові слова не повинні виграяти «мабуть, ти мав на увазі» */
  const STOP = ["що", "таке", "така", "такий", "як", "яка", "який", "які", "чому", "навіщо",
    "чого", "для", "мені", "хочу", "треба", "будь", "ласка", "цьому", "адже", "якщо",
    "what", "when", "where", "which", "about", "please", "have", "from", "with"];

  function fuzzy(text) {
    const words = toks(text).filter(function (w) { return w.length >= 4 && STOP.indexOf(w) === -1; });
    if (!words.length) return null;
    const pool = [];
    /* фразу-ключ розкладаємо на слова: Dice двох фраз ніколи не збіжиться, а слово — цілком.
       kw — це часто обрубані основи для матчиння, тому показуємо власний label, коли він є */
    const add = function (entry, kind) {
      entry.kw.forEach(function (k) {
        const parts = k.indexOf(" ") !== -1 ? k.split(" ") : [k];
        parts.forEach(function (p) {
          if (p.length >= 4) pool.push({ k: p, first: entry.label || entry.kw[0], kind: kind, id: entry.id });
        });
      });
    };
    RECIPES.forEach(function (r) { add(r, "rec"); });
    TALK.forEach(function (t) { add(t, "talk"); });
    SITE.forEach(function (s) { add(s, "site"); });
    if (api && api.kbWords) {
      api.kbWords().forEach(function (k) {
        if (k.length >= 4) pool.push({ k: k, first: k, kind: "kb" });
      });
    }
    let best = null, bs = 0, bestWord = "";
    words.forEach(function (w) {
      pool.forEach(function (e) {
        const d = dice(w, e.k);
        if (d > bs) { bs = d; best = e; bestWord = w; }
      });
    });
    if (!best || bs < 0.52) return null;
    const said = pick({ uk: best.first, en: best.first });

    if (best.kind === "kb" && api && api.kb) {
      const kbe = api.kb(best.first);
      /* слово з бази — це основа («змін»), тому показуємо слово саме користувача («змінна») */
      const kbSaid = pick({ uk: bestWord, en: bestWord });
      if (kbe) return rep({ t: { uk: "Схоже, ти про «" + kbSaid + "». Ось:", en: "Sounds like you mean “" + kbSaid + "”. Here:" }, code: kbe.code || null });
    }
    if (best.kind === "rec") {
      const r = RECIPES.filter(function (x) { return x.id === best.id; })[0];
      if (r) {
        const list = nums(text);
        const p = { a: list.length ? list[0] : 5, b: list.length > 1 ? list[1] : 10 };
        const code = typeof r.code === "function" ? r.code(p) : r.code;
        const whyText = r.why ? String(pick(r.why)).replace(/\{a\}/g, show(p.a)).replace(/\{b\}/g, show(p.b)) : null;
        /* майже ідентичне слово — це не одруківка, тож і «мабуть» не потрібне */
        const sure = bs >= 0.86;
        return rep({
          t: sure
            ? { uk: "Ось як це виглядає кодом:", en: "Here's what that looks like in code:" }
            : { uk: "Мабуть, ти мав на увазі «" + said + "»? Ось приклад коду:", en: "Did you mean “" + said + "”? Here's a code example:" },
          code: code, act: "pad", why: whyText ? { uk: whyText, en: whyText } : null
        });
      }
    }
    if (best.kind === "talk") {
      const t = TALK.filter(function (x) { return x.id === best.id; })[0];
      if (t) return rep({ t: vary(t.id, t.r.map(function (o) { return pick(o); })) });
    }
    if (best.kind === "site") {
      const s = SITE.filter(function (x) { return x.id === best.id; })[0];
      if (s) return rep({ t: s.t, act: s.act || null });
    }
    return null;
  }

  global.PychikAI = { think: think, calc: calc, dice: dice, norm: norm };
})(window);
