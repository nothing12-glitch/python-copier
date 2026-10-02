/* updates.js — версія застосунку + вікно "Що нового" після оновлень.
   Правило деплою: підніми VERSION, додай запис у LOG і поміняй ?v= у index.html. */
(function (global) {
  const VERSION = "26.10.02";
  const KEY_SEEN = "app.versionSeen";

  const LOG = {
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
    title: { uk: "Що нового у версії {v}", en: "What's new in {v}", tr: "{v} sürümünde yenilikler" },
    ok:    { uk: "Класно!", en: "Nice!", tr: "Harika!" },
    ver:   { uk: "Версія", en: "Version", tr: "Sürüm" }
  };
  const lang = () => (global.I18n ? global.I18n.lang : "uk");
  const pick = (o) => o[lang()] || o.uk || o.en;

  function showWhatsNew(v) {
    const entry = LOG[v];
    if (!entry) return;
    const bd = document.createElement("div");
    bd.className = "ob-backdrop";
    const card = document.createElement("div");
    card.className = "ob-card";
    card.style.textAlign = "left";

    const emoji = document.createElement("div");
    emoji.className = "ob-emoji";
    emoji.textContent = "🎉";
    const h = document.createElement("h3");
    h.textContent = pick(T.title).replace("{v}", v);
    const ul = document.createElement("ul");
    ul.style.margin = "0 0 18px";
    ul.style.paddingLeft = "20px";
    ul.style.color = "var(--md-on-surface-var)";
    ul.style.lineHeight = "1.7";
    ul.style.fontSize = "14px";
    (entry[lang()] || entry.uk || entry.en).forEach((line) => {
      const li = document.createElement("li");
      li.textContent = line;
      ul.appendChild(li);
    });
    const row = document.createElement("div");
    row.className = "ob-actions";
    const ok = document.createElement("button");
    ok.className = "btn contained";
    ok.textContent = pick(T.ok);
    ok.onclick = () => bd.remove();
    row.appendChild(ok);

    card.append(emoji, h, ul, row);
    bd.appendChild(card);
    bd.onclick = (e) => { if (e.target === bd) bd.remove(); };
    document.body.appendChild(bd);
  }

  function addVersionToSettings() {
    const about = document.querySelector(".about-card .about-text");
    if (!about || document.getElementById("appVersionRow")) return;
    const p = document.createElement("p");
    p.id = "appVersionRow";
    p.className = "about-text";
    p.style.marginTop = "4px";
    p.innerHTML = '<span class="material-icons">new_releases</span><span>' + pick(T.ver) + ": " + VERSION + "</span>";
    about.parentElement.appendChild(p);
  }

  function init() {
    const seen = localStorage.getItem(KEY_SEEN);
    if (seen && seen !== VERSION) {
      // показуємо "що нового", тільки якщо користувач уже був раніше (не перший візит)
      setTimeout(() => showWhatsNew(VERSION), 600);
    }
    localStorage.setItem(KEY_SEEN, VERSION);
    addVersionToSettings();
    document.addEventListener("langchange", addVersionToSettings);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();

  global.AppUpdates = { VERSION, showWhatsNew };
})(window);
