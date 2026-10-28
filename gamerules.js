/* gamerules.js — правила для кожної гри.
   Кнопка «?» на картці в хабі та кнопка «Правила» у панелі гри відкривають
   модальне вікно з правилами. Тексти — локальні словники uk/en/tr, i18n.js не чіпаємо.
   Підключати ПІСЛЯ games.js і ДО app.js (обгортає Games.renderHub/init/open/close). */
(function (global) {
  const UI = {
    uk: { rules: "Правила", close: "Закрити" },
    en: { rules: "Rules", close: "Close" },
    tr: { rules: "Kurallar", close: "Kapat" }
  };

  const R = {
    ttt: {
      uk: [
        "Ти граєш X, комп'ютер — O. Перший хід твій.",
        "Натисни порожню клітинку, щоб поставити свій символ.",
        "Перемагає той, хто першим збере три символи в ряд: горизонтально, вертикально або по діагоналі.",
        "Суперник грає алгоритмом мінімакс і не помиляється, тому найкращий результат — нічия. Рахунок зростає лише за перемоги."
      ],
      en: [
        "You play X, the computer plays O. You move first.",
        "Tap an empty cell to place your mark.",
        "First to get three marks in a row — horizontally, vertically or diagonally — wins.",
        "The AI uses minimax and never makes a mistake, so a draw is the best possible result. The score grows only when you win."
      ],
      tr: [
        "Sen X, bilgisayar O oynar. İlk hamle sende.",
        "İşaretini koymak için boş bir kareye dokun.",
        "Yatay, dikey veya çapraz olarak üç işareti önce dizen kazanır.",
        "Yapay zekâ minimax kullanır ve hata yapmaz, yani en iyi sonuç beraberliktir. Puan yalnızca kazanınca artar."
      ]
    },
    snake: {
      uk: [
        "Керуй стрілками або W/A/S/D; на телефоні — кнопками під полем.",
        "Їж світлу крапку: +1 очко, а тіло стає довшим.",
        "Вріжешся в стіну або у власний хвіст — гра почнеться спочатку.",
        "Швидкість змінюється в Налаштуваннях: повільна, звичайна, швидка. Рекорд — найбільше очок."
      ],
      en: [
        "Steer with the arrow keys or W/A/S/D; on a phone use the buttons under the field.",
        "Eat the glowing dot: +1 point and the body grows longer.",
        "Hitting a wall or your own tail restarts the game.",
        "Change the speed in Settings: slow, normal or fast. The record is your highest score."
      ],
      tr: [
        "Ok tuşları ya da W/A/S/D ile yönet; telefonda alanın altındaki düğmeleri kullan.",
        "Parlayan noktayı ye: +1 puan ve gövde uzar.",
        "Duvara ya da kendi kuyruğuna çarparsan oyun yeniden başlar.",
        "Hızı Ayarlar'dan değiştir: yavaş, normal, hızlı. Rekor en yüksek puandır."
      ]
    },
    memory: {
      uk: [
        "Відкривай по дві картки й шукай однакові.",
        "Не збіглися — за мить картки перевернуться назад, тож запам'ятовуй, де що лежить.",
        "Зібери всі пари. Рахунок — це кількість ходів, тому чим менше, тим краще.",
        "Кількість пар (6, 8 або 10) змінюється в Налаштуваннях. Рекорд — найменша кількість ходів."
      ],
      en: [
        "Flip two cards at a time and look for matching pairs.",
        "If they don't match they flip back after a moment — remember where things are.",
        "Collect all pairs. The score is the number of moves, so fewer is better.",
        "The number of pairs (6, 8 or 10) is set in Settings. The record is your lowest move count."
      ],
      tr: [
        "Her seferinde iki kart aç ve eşleşenleri bul.",
        "Eşleşmezlerse kısa süre sonra geri kapanırlar — neyin nerede olduğunu aklında tut.",
        "Tüm çiftleri topla. Puan, hamle sayısıdır; yani az olan daha iyidir.",
        "Çift sayısı (6, 8 veya 10) Ayarlar'dan değiştirilir. Rekor en düşük hamle sayısıdır."
      ]
    },
    g2048: {
      uk: [
        "Стрілки зсувають усі плитки в один бік (на телефоні — свайп).",
        "Однакові плитки зливаються, а число подвоюється: 2+2=4, 4+4=8 і так далі.",
        "Ціль — дійти до плитки 2048.",
        "Гра закінчується, коли ходів не лишилось. Рекорд — найбільше очок, тобто сума всіх злиттів."
      ],
      en: [
        "Arrow keys slide every tile in one direction (swipe on a phone).",
        "Equal tiles merge and the number doubles: 2+2=4, 4+4=8 and so on.",
        "The goal is to reach the 2048 tile.",
        "The game ends when no moves are left. The record is your highest score, the sum of all merges."
      ],
      tr: [
        "Ok tuşları tüm kareleri tek yöne kaydırır (telefonda kaydırma hareketi).",
        "Aynı sayılar birleşir ve sayı iki katına çıkar: 2+2=4, 4+4=8 ve böyle devam eder.",
        "Amaç 2048 karesine ulaşmak.",
        "Hamle kalmayınca oyun biter. Rekor en yüksek puandır, yani tüm birleşmelerin toplamı."
      ]
    },
    rps: {
      uk: [
        "Обери камінь, ножиці або папір.",
        "Камінь б'є ножиці, ножиці ріжуть папір, папір накриває камінь.",
        "Рахунок зростає тільки за перемоги; нічия й поразка його не змінюють.",
        "Комп'ютер вибирає випадково, тож це чиста удача. Рекорд — найбільше перемог."
      ],
      en: [
        "Pick rock, paper or scissors.",
        "Rock beats scissors, scissors beat paper, paper beats rock.",
        "The score grows only on wins; draws and losses leave it unchanged.",
        "The computer picks at random, so it is pure luck. The record is your most wins."
      ],
      tr: [
        "Taş, kâğıt veya makas seç.",
        "Taş makası yener, makas kâğıdı keser, kâğıt taşı örter.",
        "Puan yalnızca galibiyette artar; beraberlik ve yenilgi değiştirmez.",
        "Bilgisayar rastgele seçer, yani tamamen şans. Rekor en çok galibiyettir."
      ]
    },
    react: {
      uk: [
        "Натисни поле, щоб почати спробу.",
        "Чекай, поки воно стане зеленим, — і натискай якнайшвидше.",
        "Натиснеш до зеленого — спроба не зарахується.",
        "Результат — час у мілісекундах. Рекорд — найменший час."
      ],
      en: [
        "Tap the box to start a try.",
        "Wait until it turns green, then tap as fast as you can.",
        "Tap too early and the try does not count.",
        "The result is your time in milliseconds. The record is the lowest time."
      ],
      tr: [
        "Denemeyi başlatmak için kutuya dokun.",
        "Yeşile dönmesini bekle, sonra olabildiğince hızlı dokun.",
        "Erken dokunursan deneme sayılmaz.",
        "Sonuç milisaniye cinsindendir. Rekor en kısa süredir."
      ]
    },
    simon: {
      uk: [
        "Гра підсвічує кольори в певному порядку — дивись і запам'ятовуй.",
        "Повтори той самий порядок, натискаючи кнопки.",
        "Кожен рівень додає до послідовності один новий колір.",
        "Одна помилка — і все з початку. Рекорд — найбільший рівень."
      ],
      en: [
        "The game lights the colours in a certain order — watch and remember.",
        "Repeat the same order by pressing the pads.",
        "Every level adds one new colour to the sequence.",
        "One mistake and you start over. The record is your highest level."
      ],
      tr: [
        "Oyun renkleri belli bir sırayla yakar — izle ve aklında tut.",
        "Düğmelere basarak aynı sırayı tekrarla.",
        "Her seviye dizilişe bir renk daha ekler.",
        "Bir hata yaparsan baştan başlarsın. Rekor en yüksek seviyedir."
      ]
    },
    mines: {
      uk: [
        "Поле 9×9, на ньому сховано 10 мін.",
        "Лівий клік відкриває клітинку, правий — ставить прапорець там, де, на твою думку, міна.",
        "Число показує, скільки мін у восьми сусідніх клітинках; порожня клітинка відкриває сусідів сама.",
        "Перший клік завжди безпечний. Перемагаєш, коли відкрито всі клітинки без мін; рекорд — найменший час."
      ],
      en: [
        "The field is 9×9 with 10 mines hidden on it.",
        "Left-click opens a cell, right-click puts a flag where you think a mine is.",
        "A number tells how many mines are in the eight neighbouring cells; an empty cell opens its neighbours for you.",
        "The first click is always safe. You win by opening every mine-free cell; the record is the lowest time."
      ],
      tr: [
        "Alan 9×9 ve içinde 10 mayın gizli.",
        "Sol tık bir kareyi açar, sağ tık mayın olduğunu düşündüğün yere bayrak koyar.",
        "Sayı, komşu sekiz karede kaç mayın olduğunu gösterir; boş kare komşularını kendisi açar.",
        "İlk tıklama her zaman güvenlidir. Mayınsız tüm kareleri açınca kazanırsın; rekor en kısa süredir."
      ]
    },
    guess: {
      uk: [
        "Програма загадала число від 1 до 100.",
        "Введи свою здогадку й натисни кнопку або Enter.",
        "Гра підкаже, чи загадане число більше або менше за твоє.",
        "Щойно вгадаєш — вона загадає нове. Рекорд — найменша кількість спроб."
      ],
      en: [
        "The program picks a number from 1 to 100.",
        "Type your guess and press the button or Enter.",
        "It tells you whether the secret number is higher or lower than your guess.",
        "Once you guess it, a new number is picked. The record is your fewest tries."
      ],
      tr: [
        "Program 1 ile 100 arasında bir sayı tutar.",
        "Tahminini yaz ve düğmeye ya da Enter'a bas.",
        "Tutulan sayının senin tahmininden büyük mü küçük mü olduğunu söyler.",
        "Bilince yeni bir sayı tutulur. Rekor en az deneme sayısıdır."
      ]
    }
  };
  const NAMES = {
    ttt: "game.ttt", snake: "game.snake", memory: "game.memory", g2048: "game.g2048",
    rps: "game.rps", react: "game.react", simon: "game.simon", mines: "game.mines", guess: "game.guess"
  };

  const lang = () => (global.I18n ? global.I18n.lang : "uk");
  const L = () => UI[lang()] || UI.uk;
  const sfx = () => (global.Audio2 && global.Audio2.SFX) || null;
  const nameOf = (id) => (global.I18n && NAMES[id] ? global.I18n.t(NAMES[id]) : id);
  const lines = (id) => R[id][lang()] || R[id].uk;

  /* ---------- модальне вікно ---------- */
  let modal = null, titleEl = null, listEl = null, openId = null;

  function build() {
    modal = document.createElement("div");
    modal.id = "gameRules";
    modal.className = "grules";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");

    const card = document.createElement("div");
    card.className = "grules-card";

    const head = document.createElement("div");
    head.className = "grules-head";
    titleEl = document.createElement("h3");
    titleEl.className = "grules-title";
    const x = document.createElement("button");
    x.className = "icon-btn grules-x";
    x.dataset.rulesClose = "1";
    x.innerHTML = '<span class="material-icons">close</span>';
    x.addEventListener("click", close);
    head.append(titleEl, x);

    const sub = document.createElement("p");
    sub.className = "grules-sub";
    sub.dataset.rulesCap = "1";

    listEl = document.createElement("ul");
    listEl.className = "grules-list";

    const foot = document.createElement("div");
    foot.className = "grules-foot";
    const done = document.createElement("button");
    done.className = "btn contained";
    done.dataset.rulesClose = "1";
    done.addEventListener("click", close);
    foot.appendChild(done);

    card.append(head, sub, listEl, foot);
    modal.appendChild(card);
    modal.addEventListener("click", (e) => { if (e.target === modal) close(); });
    document.body.appendChild(modal);
  }

  function applyTexts() {
    const u = L();
    document.querySelectorAll(".grules-btn, .grules-stage").forEach((b) => {
      if (b.classList.contains("grules-stage")) b.textContent = u.rules;
      b.title = u.rules;
      b.setAttribute("aria-label", u.rules);
    });
    if (!modal) return;
    const cap = modal.querySelector("[data-rules-cap]");
    if (cap) cap.textContent = u.rules;
    modal.querySelectorAll("[data-rules-close]").forEach((b) => {
      b.setAttribute("aria-label", u.close);
      if (b.classList.contains("btn")) b.textContent = u.close;
    });
    if (!openId) return;
    titleEl.textContent = nameOf(openId);
    listEl.textContent = "";
    lines(openId).forEach((line) => {
      const li = document.createElement("li");
      li.textContent = line;
      listEl.appendChild(li);
    });
  }

  function open(id) {
    if (!R[id]) return;
    if (!modal) build();
    openId = id;
    applyTexts();
    modal.classList.add("show");
    const s = sfx(); if (s) s.pop();
  }

  function close() {
    if (!modal || !modal.classList.contains("show")) return;
    modal.classList.remove("show");
    const s = sfx(); if (s) s.click();
  }

  /* ---------- кнопки ---------- */
  function idByTitle(txt) {
    if (!txt || !global.I18n) return null;
    for (const id in NAMES) { if (global.I18n.t(NAMES[id]) === txt) return id; }
    return null;
  }

  function injectHub() {
    const hub = document.getElementById("gamesHub");
    if (!hub) return;
    hub.querySelectorAll(".game-card").forEach((card) => {
      if (card.querySelector(".grules-btn")) return;
      if (card.querySelector(".game-info-btn")) return; // «Як грати» уже є на картці — не дублюємо кнопку
      const h3 = card.querySelector("h3");
      const id = idByTitle(h3 ? h3.textContent.trim() : "");
      if (!id) return;
      const b = document.createElement("button");
      b.className = "grules-btn";
      b.innerHTML = '<span class="material-icons">help_outline</span>';
      b.addEventListener("click", (e) => { e.preventDefault(); e.stopPropagation(); open(id); });
      card.appendChild(b);
    });
    applyTexts();
  }

  function injectStage(id) {
    if (!R[id]) return;
    const top = document.querySelector("#gameStage .game-top");
    if (!top || top.querySelector(".grules-stage")) return;
    const b = document.createElement("button");
    b.className = "btn text grules-stage";
    b.addEventListener("click", (e) => { e.preventDefault(); e.stopPropagation(); open(id); });
    top.appendChild(b);
    applyTexts();
  }

  /* ---------- обгортки Games: хаб перемальовується часто, тож кнопки додаємо після кожного рендеру ---------- */
  function wrapGames() {
    const G = global.Games;
    if (!G) return;
    const r0 = G.renderHub, i0 = G.init, c0 = G.close, o0 = G.open;
    G.renderHub = function () { const r = r0.apply(this, arguments); injectHub(); return r; };
    G.init = function () { const r = i0.apply(this, arguments); injectHub(); return r; };
    G.close = function () { const r = c0.apply(this, arguments); injectHub(); return r; };
    G.open = function () { const r = o0.apply(this, arguments); injectStage(arguments[0]); return r; };
  }

  function init() {
    wrapGames();
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
    document.addEventListener("langchange", () => { applyTexts(); injectHub(); });
    injectHub();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();

  global.GameRules = { open: open, close: close };
})(window);
