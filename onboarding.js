/* Онбординг: вибір мови -> вітання -> тур по розділах -> подяка */
(function (global) {
  const KEY = "app.onboarded";

  const L = {
    uk: {
      langTitle: "Обери мову",
      langText: "Мову можна будь-коли змінити у налаштуваннях.",
      nickTitle: "Як тебе звати?",
      nickText: "Введи свій нікнейм — це буде твоє ім'я за замовчуванням. Його можна будь-коли змінити у профілі.",
      nickPlaceholder: "Github user",
      nickOk: "Продовжити",
      welcomeTitle: "Вітаємо на сайті!",
      welcomeText: "Тут ти можеш запускати Python прямо в браузері, грати в міні-ігри, зберігати рекорди у профілі та налаштовувати все під себе. Зараз покажемо кожен розділ!",
      steps: [
        ["home", "Головна", "Стартова сторінка з коротким описом усього, що вміє сайт."],
        ["python", "Python", "Пиши код у редакторі та натискай «Запуск» — результат з'явиться у виводі поруч. Є приклади та підказки."],
        ["games", "Ігри", "Дев'ять міні-ігор: змійка, 2048, сапер та інші. Рекорди зберігаються у профілі."],
        ["tools", "Інструменти", "Калькулятор, конвертер величин та випадкові числа — усе в одному місці."],
        ["profile", "Профіль", "Створи локальний акаунт (демо, без сервера) і бач свої рекорди."],
        ["settings", "Налаштування", "Тема (світла / темна / авто), кольори, звук, мова, фон і багато іншого."]
      ],
      next: "Далі",
      skip: "Пропустити",
      start: "Почати тур",
      finish: "Завершити",
      done: "Готово",
      thanksTitle: "Дякуємо, що відвідали наш сайт!",
      thanksText: "Приємного користування!"
    },
    en: {
      langTitle: "Choose your language",
      langText: "You can change it anytime in Settings.",
      nickTitle: "What's your nickname?",
      nickText: "Enter your nickname — it will be your default name. You can change it anytime in your profile.",
      nickPlaceholder: "Github user",
      nickOk: "Continue",
      welcomeTitle: "Welcome to the site!",
      welcomeText: "Here you can run Python right in the browser, play mini-games, keep records in your profile and customize everything. Let us show you around!",
      steps: [
        ["home", "Home", "A short overview of everything the site can do."],
        ["python", "Python", "Write code in the editor and press Run — the result appears in the output panel. Examples and hints included."],
        ["games", "Games", "Nine mini-games: Snake, 2048, Minesweeper and more. Records are saved in your profile."],
        ["tools", "Tools", "A calculator, unit converter and random tools — all in one place."],
        ["profile", "Profile", "Create a local account (demo, no server) and see your records."],
        ["settings", "Settings", "Theme (light / dark / auto), colors, sound, language, background and much more."]
      ],
      next: "Next",
      skip: "Skip",
      start: "Start tour",
      finish: "Finish",
      done: "Done",
      thanksTitle: "Thanks for visiting our site!",
      thanksText: "Enjoy using it!"
    },
    tr: {
      langTitle: "Dilini seç",
      langText: "Bunu istediğin zaman Ayarlar'dan değiştirebilirsin.",
      nickTitle: "Takma adın ne?",
      nickText: "Takma adını gir — varsayılan ismin olacak. İstediğin zaman profilden değiştirebilirsin.",
      nickPlaceholder: "Github user",
      nickOk: "Devam",
      welcomeTitle: "Sitemize hoş geldin!",
      welcomeText: "Burada Python'u doğrudan tarayıcıda çalıştırabilir, mini oyunlar oynayabilir, rekorlarını profilinde saklayabilir ve her şeyi kendine göre ayarlayabilirsin. Şimdi sana her bölümü göstereceğiz!",
      steps: [
        ["home", "Ana Sayfa", "Sitenin neler yapabildiğine dair kısa bir özet."],
        ["python", "Python", "Düzenleyiciye kod yaz ve Çalıştır'a bas — sonuç yandaki çıktıda görünür. Örnekler ve ipuçları var."],
        ["games", "Oyunlar", "Dokuz mini oyun: Yılan, 2048, Mayın Tarlası ve daha fazlası. Rekorlar profilde saklanır."],
        ["tools", "Araçlar", "Hesap makinesi, birim dönüştürücü ve rastgele sayı araçları — hepsi bir arada."],
        ["profile", "Profil", "Yerel bir hesap oluştur (demo, sunucu yok) ve rekorlarını gör."],
        ["settings", "Ayarlar", "Tema (açık / koyu / otomatik), renkler, ses, dil, arka plan ve daha fazlası."]
      ],
      next: "İleri",
      skip: "Atla",
      start: "Tura başla",
      finish: "Bitir",
      done: "Tamam",
      thanksTitle: "Sitemizi ziyaret ettiğiniz için teşekkürler!",
      thanksText: "İyi kullanımlar!"
    }
  };

  let phase = null; // "lang" | "nick" | "welcome" | number | "thanks"
  let backdrop = null;

  const S = () => L[global.I18n ? global.I18n.lang : "uk"] || L.uk;

  function close() {
    if (backdrop) { backdrop.remove(); backdrop = null; }
    phase = null;
  }

  function finishTour(routeHome) {
    localStorage.setItem(KEY, "1");
    close();
    if (routeHome && global.App) global.App.route("home");
  }

  function shell() {
    close();
    backdrop = document.createElement("div");
    backdrop.className = "ob-backdrop";
    const card = document.createElement("div");
    card.className = "ob-card";
    backdrop.appendChild(card);
    document.body.appendChild(backdrop);
    return card;
  }

  function actions(card, list) {
    const row = document.createElement("div");
    row.className = "ob-actions";
    list.forEach(([label, variant, fn]) => {
      const b = document.createElement("button");
      b.className = "btn " + variant;
      b.textContent = label;
      b.onclick = fn;
      row.appendChild(b);
    });
    card.appendChild(row);
  }

  function renderLang() {
    phase = "lang";
    const card = shell();
    const emo = document.createElement("div");
    emo.className = "ob-emoji";
    emo.textContent = "\u{1F30D}";
    const h = document.createElement("h3");
    h.textContent = S().langTitle;
    const p = document.createElement("p");
    p.textContent = S().langText;
    const row = document.createElement("div");
    row.className = "ob-langs";
    [["uk", "Українська"], ["en", "English"], ["tr", "Türkçe"]].forEach(([code, name]) => {
      const b = document.createElement("button");
      b.textContent = name;
      b.onclick = () => {
        if (global.I18n) global.I18n.setLang(code);
        renderNickname();
      };
      row.appendChild(b);
    });
    card.append(emo, h, p, row);
  }

  function saveNickname(v) {
    const name = (v || "").trim() || "Github user";
    if (global.Profile && global.Profile.setNickname) global.Profile.setNickname(name);
    else localStorage.setItem("app.nickname", name);
    document.dispatchEvent(new CustomEvent("profilechange"));
  }

  function renderNickname() {
    phase = "nick";
    const card = shell();
    const emo = document.createElement("div");
    emo.className = "ob-emoji";
    emo.textContent = "\u{1F600}";
    const h = document.createElement("h3");
    h.textContent = S().nickTitle;
    const p = document.createElement("p");
    p.textContent = S().nickText;
    const inp = document.createElement("input");
    inp.className = "ob-input";
    inp.type = "text";
    inp.maxLength = 24;
    inp.placeholder = S().nickPlaceholder;
    inp.value = localStorage.getItem("app.nickname") || "";
    const save = () => { saveNickname(inp.value); renderWelcome(); };
    inp.addEventListener("keydown", (e) => { if (e.key === "Enter") save(); });
    card.append(emo, h, p, inp);
    actions(card, [
      [S().skip, "text", () => { saveNickname(""); renderWelcome(); }],
      [S().nickOk, "contained", save]
    ]);
    setTimeout(() => inp.focus(), 60);
  }

  function renderWelcome() {
    phase = "welcome";
    const card = shell();
    const emo = document.createElement("div");
    emo.className = "ob-emoji";
    emo.textContent = "\u{1F44B}";
    const h = document.createElement("h3");
    h.textContent = S().welcomeTitle;
    const p = document.createElement("p");
    p.textContent = S().welcomeText;
    card.append(emo, h, p);
    actions(card, [
      [S().skip, "text", () => finishTour(true)],
      [S().start, "contained", () => renderStep(0)]
    ]);
  }

  function renderStep(i) {
    phase = i;
    const st = S().steps[i];
    if (global.App) global.App.route(st[0]);
    const card = shell();
    const dots = document.createElement("div");
    dots.className = "ob-dots";
    S().steps.forEach((_, n) => {
      const d = document.createElement("span");
      if (n === i) d.className = "on";
      dots.appendChild(d);
    });
    const h = document.createElement("h3");
    h.textContent = st[1];
    const p = document.createElement("p");
    p.textContent = st[2];
    card.append(dots, h, p);
    const last = i === S().steps.length - 1;
    actions(card, [
      [S().skip, "text", () => finishTour(true)],
      [last ? S().finish : S().next, "contained", () => (last ? renderThanks() : renderStep(i + 1))]
    ]);
  }

  function renderThanks() {
    phase = "thanks";
    const card = shell();
    const emo = document.createElement("div");
    emo.className = "ob-emoji";
    emo.textContent = "\u{1F60A}";
    const h = document.createElement("h3");
    h.textContent = S().thanksTitle;
    const p = document.createElement("p");
    p.textContent = S().thanksText;
    card.append(emo, h, p);
    actions(card, [[S().done, "contained", () => finishTour(true)]]);
  }

  function start() { renderLang(); }

  function init() {
    if (localStorage.getItem(KEY)) return;
    start();
    document.addEventListener("langchange", () => {
      if (phase === null) return;
      if (phase === "lang") renderLang();
      else if (phase === "nick") renderNickname();
      else if (phase === "welcome") renderWelcome();
      else if (phase === "thanks") renderThanks();
      else renderStep(phase);
    });
  }

  document.addEventListener("DOMContentLoaded", init);
  global.Onboarding = { start };
})(window);
