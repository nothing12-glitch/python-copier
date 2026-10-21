/* updates.js — версія застосунку + вікно "Що нового" при кожному вході.
   Правило деплою: підніми VERSION, додай запис у LOG і поміняй ?v= у index.html. */
(function (global) {
  const VERSION = "26.10.25";
  const KEY_SEEN = "app.versionSeen";

  const LOG = {
    "26.10.25": {
      uk: [
        "Додано пункт «Тема» в Персоналізацію: Авто, Світла, Темна",
        "Тема автоматично визначається за системою, можна змінити вручну"
      ],
      en: [
        "Added 'Theme' item in Personalization: Auto, Light, Dark",
        "Theme auto-detects from system, can be changed manually"
      ],
      tr: [
        "Kişiselleştirme'ye 'Tema' eklendi: Otomatik, Açık, Koyu",
        "Tema sistemden otomatik algılanır, elle değiştirilebilir"
      ]
    },
    "26.10.24": {
      uk: [
        "Секцію «Вигляд» перейменовано на «Персоналізація»",
        "Додано вибір стилю: поки що «Класичний» (нові стилі додамо пізніше)"
      ],
      en: [
        "Renamed 'Appearance' section to 'Personalization'",
        "Added style selector: currently 'Classic' (new styles coming soon)"
      ],
      tr: [
        "'Görünüm' bölümü 'Kişiselleştirme' olarak yeniden adlandırıldı",
        "Stil seçici eklendi: şu anda 'Klasik' (yeni stiller yakında)"
      ]
    },
    "26.10.22": {
      uk: [
        "Назву сайту змінено на python-copier",
        "Додано контакти та посилання на інші проєкти у розділі «Про застосунок»",
        "Прибрано вкладку «Ігри» з Налаштувань — тепер усе налаштовується у самих іграх"
      ],
      en: [
        "Site name changed to python-copier",
        "Added contact info and links to other projects in the About section",
        "Removed Games section from Settings — all game settings are now in-game"
      ],
      tr: [
        "Site adı python-copier olarak değiştirildi",
        "Hakkında bölümüne iletişim bilgileri ve diğer projelere bağlantılar eklendi",
        "Ayarlar'dan Oyunlar bölümü kaldırıldı — tüm oyun ayarları artık oyun içinde"
      ]
    },
    "26.10.21": {
      uk: [
        "Пофікшено баг зі змійкою — тепер гра зупиняється при виході",
        "Додано інструкції «як грати» над кожною грою",
        "Додано панель налаштувань для ігор (швидкість змійки, розмір Memory)",
        "Кнопка налаштувань з'являється у верхній панелі кожної гри"
      ],
      en: [
        "Fixed snake bug — game now stops when you exit",
        "Added 'how to play' instructions above each game",
        "Added game settings panel (snake speed, memory size)",
        "Settings button appears in the top bar of each game"
      ],
      tr: [
        "Yılan hatası düzeltildi — oyundan çıkınca duruyor",
        "Her oyunun üstüne 'nasıl oynanır' talimatları eklendi",
        "Oyun ayarları paneli eklendi (yılan hızı, memory boyutu)",
        "Her oyunun üst çubuğunda ayarlar düğmesi görünüyor"
      ]
    },
    "26.10.20": {
      uk: [
        "Свічку пам'яті прибрано",
        "Виправлено вхід у профіль — тепер логін і реєстрація працюють",
        "Ім'я та аватар знову з'являються у шапці одразу після входу",
        "Версія застосунку відображається в Налаштуваннях (кнопка «Показати що нового»)",
        "Нове гарне вікно «Що нового» з окремим віконцем списку змін"
      ],
      en: [
        "The memorial candle has been removed",
        "Profile sign-in fixed — login and registration now work",
        "Your name and avatar reappear in the top bar right after signing in",
        "App version shown in Settings (with a “Show what's new” button)",
        "New polished “What's new” window with a separate changes panel"
      ],
      tr: [
        "Anma mumu kaldırıldı",
        "Profil girişi düzeltildi — artık giriş ve kayıt çalışıyor",
        "Giriş yaptıktan sonra adın ve avatarın üst çubukta hemen görünüyor",
        "Uygulama sürümü Ayarlar'da gösteriliyor (“Yenilikleri göster” düğmesiyle)",
        "Ayrı değişiklik paneliyle yeni “Yenilikler” penceresi"
      ]
    },
    "26.10.02": {
      uk: [
        "Плаваюча «пігулка» з анімованою бульбкою, що перестрибує між пунктами",
        "Панель навігації: вибір розміру (малий/середній/великий) і позиції (верх/низ/ліво/право)",
        "9 кольорів акценту та 8 мов інтерфейсу",
        "Музична панель: прогрес-бар, лайки, shuffle, loop; повторний клік не вимикає музику",
        "Помідоро-таймер в Інструментах",
        "Пасхалка: 10 кліків по назві сайту → привітання вчителю 🌹",
        "Вікно «Що нового» після оновлень + версія у Налаштуваннях"
      ],
      en: [
        "Floating pill nav with an animated bubble that hops between items",
        "Nav panel: size (small/medium/large) and position (top/bottom/left/right)",
        "9 accent colors and 8 UI languages",
        "Music panel: progress bar, likes, shuffle, loop; re-click no longer stops music",
        "Pomodoro timer in Tools",
        "Easter egg: 10 clicks on the site title → teacher greeting 🌹",
        "“What’s new” window after updates + version in Settings"
      ],
      tr: [
        "Yüzen hap gezinme ve öğeler arasında zıplayan animasyonlu baloncuk",
        "Gezinme çubuğu: boyut ve konum seçimi",
        "9 vurgu rengi ve 8 dil",
        "Müzik paneli: ilerleme çubuğu, beğeniler, shuffle, loop",
        "Araçlarda Pomodoro sayacı",
        "Easter egg: başlığa 10 tık → öğretmen kutlaması 🌹",
        "Güncellemelerden sonra “Yenilikler” penceresi + Ayarlar'da sürüm"
      ]
    }
    // Нові версії додавай сюди, наприклад:
    // "26.10.09": { uk: ["..."], en: ["..."], tr: ["..."] },
  };

  const T = {
    title: { uk: "Що нового", en: "What's new", tr: "Yenilikler" },
    newUp: { uk: "Нове оновлення!", en: "New update!", tr: "Yeni güncelleme!" },
    sub:   { uk: "Сайт щойно оновився до версії", en: "The site just updated to", tr: "Site yeni sürüme güncellendi:" },
    ok:    { uk: "Класно!", en: "Nice!", tr: "Harika!" },
    ver:   { uk: "Версія", en: "Version", tr: "Sürüm" },
    show:  { uk: "Показати що нового", en: "Show what's new", tr: "Yenilikleri göster" }
  };
  const lang = () => (global.I18n ? global.I18n.lang : "uk");
  const pick = (o) => o[lang()] || o.uk || o.en;

  function showWhatsNew(v) {
    const entry = LOG[v];
    if (!entry) return;
    const old = document.getElementById("whatsNewModal");
    if (old) old.remove();
    if (global.Audio2 && global.Audio2.SFX) global.Audio2.SFX.pop();

    const bd = document.createElement("div");
    bd.id = "whatsNewModal";
    bd.className = "wn-backdrop";

    const card = document.createElement("div");
    card.className = "wn-card";
    card.setAttribute("role", "dialog");
    card.setAttribute("aria-modal", "true");
    card.setAttribute("aria-label", pick(T.newUp));

    /* Шапка: емодзі + заголовок + бейдж версії */
    const head = document.createElement("div");
    head.className = "wn-head";

    const emoji = document.createElement("div");
    emoji.className = "wn-emoji";
    emoji.textContent = "🎉";
    emoji.setAttribute("aria-hidden", "true");

    const headText = document.createElement("div");
    headText.className = "wn-headtext";
    const h = document.createElement("h3");
    h.className = "wn-title";
    h.textContent = pick(T.newUp);
    const sub = document.createElement("p");
    sub.className = "wn-sub";
    sub.textContent = pick(T.sub) + " " + v;
    headText.append(h, sub);

    const chip = document.createElement("span");
    chip.className = "wn-chip";
    chip.textContent = "v" + v;

    head.append(emoji, headText, chip);

    /* Окрема віконце-панель зі списком змін */
    const panel = document.createElement("div");
    panel.className = "wn-panel";

    const panelTitle = document.createElement("div");
    panelTitle.className = "wn-panel-title";
    panelTitle.innerHTML = '<span class="material-icons" aria-hidden="true">auto_awesome</span><span>' + pick(T.title) + "</span>";
    panel.appendChild(panelTitle);

    const ul = document.createElement("ul");
    ul.className = "wn-list";
    (entry[lang()] || entry.uk || entry.en).forEach((line) => {
      const li = document.createElement("li");
      li.textContent = line;
      ul.appendChild(li);
    });
    panel.appendChild(ul);

    /* Кнопка внизу */
    const row = document.createElement("div");
    row.className = "wn-actions";
    const ok = document.createElement("button");
    ok.className = "btn contained wn-ok";
    ok.innerHTML = '<span class="material-icons" aria-hidden="true">celebration</span><span>' + pick(T.ok) + "</span>";
    ok.onclick = close;
    row.appendChild(ok);

    card.append(head, panel, row);
    bd.appendChild(card);
    bd.onclick = (e) => { if (e.target === bd) close(); };
    document.body.appendChild(bd);

    const esc = (e) => { if (e.key === "Escape") { close(); document.removeEventListener("keydown", esc); } };
    document.addEventListener("keydown", esc);

    function close() {
      bd.classList.add("wn-out");
      setTimeout(() => bd.remove(), 180);
      document.removeEventListener("keydown", esc);
    }
  }

  function addVersionToSettings() {
    const about = document.querySelector(".about-card .about-text");
    if (!about) return;
    if (!document.getElementById("appVersionRow")) {
      const p = document.createElement("p");
      p.id = "appVersionRow";
      p.className = "about-text";
      p.style.marginTop = "4px";
      p.innerHTML = '<span class="material-icons">new_releases</span><span>' + pick(T.ver) + ": " + VERSION + "</span>";
      about.parentElement.appendChild(p);
    }
    if (!document.getElementById("whatsNewBtn")) {
      const b = document.createElement("button");
      b.id = "whatsNewBtn";
      b.className = "btn outlined";
      b.style.marginTop = "10px";
      b.innerHTML = '<span class="material-icons">celebration</span><span>' + pick(T.show) + "</span>";
      b.onclick = () => showWhatsNew(VERSION);
      about.parentElement.appendChild(b);
    }
  }

  function init() {
    // показуємо "Що нового" при КОЖНОМУ вході на сайт
    setTimeout(() => showWhatsNew(VERSION), 700);
    localStorage.setItem(KEY_SEEN, VERSION);
    addVersionToSettings();
    document.addEventListener("langchange", addVersionToSettings);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();

  global.AppUpdates = { VERSION, showWhatsNew };
})(window);
