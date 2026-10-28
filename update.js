/* updates.js — версія застосунку + вікно "Що нового" при кожному вході.
   Правило деплою: підніми VERSION, додай запис у LOG і поміняй ?v= у index.html. */
(function (global) {
  const VERSION = "26.10.52";
  const KEY_SEEN = "app.versionSeen";

  const LOG = {
    "26.10.52": {
      uk: [
        "Новий інтерфейс тепер 1:1 із дизайном: суцільна бічна панель із групами «Навігація» та «Акаунт» і карткою «Прогрес курсу»",
        "Пошук у верхній панелі: шукає розділи, модулі, задачі, уроки та ігри; швидкий виклик клавішею «/»",
        "На телефоні нижня панель стала як у дизайні: Головна, Python, Задачі, Ігри та «Ще» — решта розділів у висувному листі",
        "Заголовки сторінок отримали підказкові описи, картки розділів — посилання «Відкрити →», а герой-блок — бейдж і приклад коду"
      ],
      en: [
        "The new interface now matches the design 1:1: a solid side panel with “Navigation” and “Account” groups plus a “Course progress” card",
        "Top-bar search covers sections, modules, tasks, lessons and games; press “/” to jump into it",
        "On phones the bottom bar follows the design: Home, Python, Tasks, Games and “More” — the rest live in a slide-up sheet",
        "Page headers gained short descriptions, section cards got an “Open →” link, and the hero now has a badge plus a code sample"
      ],
      tr: [
        "Yeni arayüz artık tasarımın birebir aynısı: “Gezinme” ve “Hesap” grupları ile “Kurs ilerlemesi” kartını içeren tam yükseklikte yan panel",
        "Üst çubuktaki arama bölümleri, modülleri, görevleri, dersleri ve oyunları tarıyor; “/” tuşuyla hızlıca açılıyor",
        "Telefonda alt çubuk tasarıma uyuyor: Ana sayfa, Python, Görevler, Oyunlar ve “Daha fazla” — kalanı alttan açılan listede",
        "Sayfa başlıklarına kısa açıklamalar, bölüm kartlarına “Aç →” bağlantısı, kahraman bloğuna rozet ve kod örneği eklendi"
      ]
    },
    "26.10.51": {
      uk: [
        "Новий інтерфейс: темна скляна панель, градієнтна бічна навігація, оновлені картки, кнопки та заголовок",
        "Повне масштабування під телефон: нижня панель прокручується до активного розділу, картки стають компактнішими, відступи менші",
        "Новий стиль увімкнено попри збережені ваші налаштування; класичний вигляд можна повернути в Налаштуваннях: Стиль → «Класичний»",
        "Підписи під іконками лишаються керованими, а світла тема нового стилю також оформлена"
      ],
      en: [
        "New interface: dark glass panel, gradient side navigation, refreshed cards, buttons and title",
        "Full phone scaling: the bottom bar scrolls to the active section, cards get compact, paddings shrink",
        "Your saved settings are kept; switch back any time in Settings → Style → “Classic”",
        "Labels under icons stay optional, and the new style also has a light theme"
      ],
      tr: [
        "Yeni arayüz: koyu cam panel, gradyanlı yan gezinme, yenilenen kartlar, düğmeler ve başlık",
        "Telefon için tam ölçekleme: alt çubuk etkin bölüme kayar, kartlar derli toplu, boşluklar küçülür",
        "Kayıtlı ayarlarınız korunur; istediğiniz an Ayarlar → Stil → “Klasik” ile dönebilirsiniz",
        "Simge altındaki etiketler yine isteğe bağlı; yeni stilin açık teması da hazır"
      ]
    },
    "26.10.50": {
      uk: [
        "Нове налаштування «Підписи під іконками навігації»: вимкни його — і панель буде лише з іконок, а назви з'являтимуться у підказці при наведенні",
        "Панель без підписів займає менше місця: вужча збоку, нижча зверху/знизу та на мобільних"
      ],
      en: [
        "New setting “Labels under navigation icons”: switch it off for a compact icon-only panel with hover tooltips",
        "The label-free panel takes less room: narrower on the side, shorter on top/bottom and on mobile"
      ],
      tr: [
        "Yeni ayar “Gezinme simgelerinin altında etiketler”: kapatınca panel yalnızca simgelerden oluşur, üzerine gelince ipucu görünür",
        "Etiketsiz panel daha az yer kaplar: yanda daha dar, üstte/altta ve mobilde daha kısa"
      ]
    },
    "26.10.49": {
      uk: [
        "Головна: усі картки тепер течуть однією рівною сіткою — без дірок і незаповнених рядків",
        "Панель навігації стискається на невисоких екранах, щоб усі 11 розділів лишались видимі",
        "Горизонтальна панель (зверху чи знизу) більше не переповнюється, коли розділів багато"
      ],
      en: [
        "Home: all cards now flow in one even grid — no holes or half-empty rows",
        "The navigation rail compacts on short screens so all 11 sections stay visible",
        "The horizontal nav (top or bottom) no longer overflows when there are many sections"
      ],
      tr: [
        "Ana sayfa: tüm kartlar artık tek düzgün ızgarada akıyor — boşluksuz ve yarı boş satırsız",
        "Gezinme çubuğu kısa ekranlarda sıkışır, böylece 11 bölümün tümü görünür kalır",
        "Yatay gezinme (üst veya alt) çok bölüm varken artık taşmıyor"
      ]
    },
    "26.10.48": {
      uk: [
        "Новий розділ «Курс Python»: покроковий навчальний шлях із 5 розділів і 12 уроків",
        "Кожен урок має коротку теорію, готовий приклад (можна запустити в майданчику) і практичну задачу з автоматичною перевіркою",
        "Теми від основ до ООП: змінні, рядки, умови, цикли, списки, словники, функції, модулі та класи",
        "Прогрес зберігається для кожного профілю, а за уроки додано три досягнення — перший урок, 5 уроків і весь курс"
      ],
      en: [
        "New “Python course” section: a step-by-step learning path with 5 chapters and 12 lessons",
        "Every lesson has short theory, a ready example (runnable in the playground) and a practice task with automatic checking",
        "Topics from basics to OOP: variables, strings, conditions, loops, lists, dictionaries, functions, modules and classes",
        "Progress is stored per profile, and lessons add three achievements — first lesson, 5 lessons and the whole course"
      ],
      tr: [
        "Yeni “Python kursu” bölümü: 5 bölüm ve 12 dersle adım adım öğrenme yolu",
        "Her derste kısa teori, hazır örnek (alanda çalıştırılabilir) ve otomatik denetimli bir pratik görev var",
        "Temellerden OOP'ye konular: değişkenler, dizeler, koşullar, döngüler, listeler, sözlükler, fonksiyonlar, modüller ve sınıflar",
        "İlerleme her profil için saklanır ve dersler üç başarı ekler — ilk ders, 5 ders ve tüm kurs"
      ]
    },
    "26.10.47": {
      uk: [
        "Новий розділ «Модулі»: каталог усіх бібліотек Pyodide з пошуком, фільтрами та встановленням у один клік",
        "Для популярних пакетів є короткий опис і готовий приклад коду, який одним дотиком вставляється в редактор",
        "Готові набори (аналітика, наука, зображення, ML) встановлюють кілька пакетів одразу",
        "Розумні підказки: якщо коду бракує модуля, сайт підкаже, з якого пакета його встановити. Додано два досягнення"
      ],
      en: [
        "New “Modules” section: a catalog of every Pyodide library with search, filters and one-click install",
        "Popular packages have a short description and a ready-made example that drops into the editor in one tap",
        "Ready-made sets (analytics, science, images, ML) install several packages at once",
        "Smart hints: if your code is missing a module, the site tells you which package provides it. Two new achievements added"
      ],
      tr: [
        "Yeni “Modüller” bölümü: arama, filtreler ve tek tıkla kurulumla tüm Pyodide kitaplıklarının kataloğu",
        "Popüler paketlerde kısa açıklama ve tek dokunuşla düzenleyiciye eklenen hazır örnek var",
        "Hazır setler (analitik, bilim, görseller, ML) birden çok paketi aynı anda kurar",
        "Akıllı ipuçları: kodunda bir modül eksikse site onun hangi pakette olduğunu söyler. İki yeni başarı eklendi"
      ]
    },
    "26.10.46": {
      uk: [
        "Олімпіадний тренажер: тур на час із випадковими задачами, живим таймером, балами та екраном результатів",
        "Налаштуй тривалість (10, 20 або 30 хвилин) і кількість задач (4, 6 або 8) — тренажер сам набирає тур із різних рівнів складності",
        "Банк задач виріс із 12 до 18: додалися задачі на списки, найбільший спільний дільник, порядок слів і роботу з послідовностями",
        "З'явилася історія турів, особистий рекорд і три нові досягнення — за перший тур, п'ять турів та ідеальні 100% балів"
      ],
      en: [
        "Olympiad trainer: a timed round with random tasks, a live timer, points and a results screen",
        "Choose the duration (10, 20 or 30 minutes) and the number of tasks (4, 6 or 8) — the trainer builds a mixed-difficulty round for you",
        "The task bank grew from 12 to 18: lists, greatest common divisor, word order and sequence problems were added",
        "Round history, a personal best and three new achievements appeared — for the first round, five rounds and a perfect 100% score"
      ],
      tr: [
        "Olimpiyat antrenörü: rastgele görevler, canlı sayaç, puanlar ve sonuç ekranıyla süreli tur",
        "Süreyi (10, 20 veya 30 dakika) ve görev sayısını (4, 6 veya 8) seç — antrenör farklı zorluklarda bir tur hazırlar",
        "Görev havuzu 12'den 18'e çıktı: listeler, en büyük ortak bölen, sözcük sırası ve dizi soruları eklendi",
        "Tur geçmişi, kişisel rekor ve üç yeni başarı geldi — ilk tur, beş tur ve kusursuz %100 puan için"
      ]
    },
    "26.10.45": {
      uk: [
        "Новий розділ «Задачі»: 12 задач трьох рівнів складності з автоматичною перевіркою коду",
        "Кожна задача проходить кілька тестів — видно ввід, очікуваний вивід і власний результат, а помилка виконання показує номер рядка",
        "Прогрес і чернетки розв'язків зберігаються для кожного профілю; є підказки, бали та три нові досягнення"
      ],
      en: [
        "New Tasks section: 12 problems across three difficulty levels with automatic code checking",
        "Every task runs several tests — you see the input, the expected output and your own result, and a runtime error points to its line",
        "Progress and solution drafts are stored per profile, with hints, points and three new achievements"
      ],
      tr: [
        "Yeni Görevler bölümü: üç zorluk seviyesinde 12 görev ve otomatik kod denetimi",
        "Her görev birkaç testten geçer — girdiyi, beklenen çıktıyı ve kendi sonucunu görürsün; çalışma zamanı hatası satır numarasını gösterir",
        "İlerleme ve çözüm taslakları profile göre saklanır; ipuçları, puanlar ve üç yeni başarı eklendi"
      ]
    },
    "26.10.44": {
      uk: [
        "Номери рядків у консолі стали клікабельними: біля помилки або попередження з'явилася кнопка «→ N»",
        "Клік переносить у редактор — потрібний рядок виділяється, а рамка редактора коротко підсвічується",
        "Працює і з трейсбеком Python, і з попередженнями перевірки коду перед запуском"
      ],
      en: [
        "Line numbers in the console are now clickable: a “→ N” button appears next to an error or warning",
        "Clicking jumps into the editor — the line is selected and the editor frame flashes briefly",
        "Works for both Python tracebacks and pre-run code check warnings"
      ],
      tr: [
        "Konsoldaki satır numaraları artık tıklanabilir: bir hata veya uyarının yanında “→ N” düğmesi çıkıyor",
        "Tıklayınca düzenleyiciye geçilir — ilgili satır seçilir ve çerçeve kısa bir süre vurgulanır",
        "Hem Python hata izlerinde hem de çalıştırma öncesi kod denetimi uyarılarında çalışır"
      ]
    },
    "26.10.43": {
      uk: [
        "Підсвітка синтаксису в редакторі Python: ключові слова, вбудовані функції, рядки, коментарі та числа тепер різнокольорові",
        "Підсвітку можна вимкнути в Налаштуваннях → Редактор коду",
        "Колір курсора й виділення тексту залишилися звичними, підсвітка не заважає вводу"
      ],
      en: [
        "Syntax highlighting in the Python editor: keywords, built-in functions, strings, comments and numbers are now colored",
        "Highlighting can be turned off in Settings → Code editor",
        "Caret and selection colors stay familiar; highlighting never gets in the way of typing"
      ],
      tr: [
        "Python düzenleyicide sözdizimi renklendirmesi: anahtar sözcükler, yerleşik fonksiyonlar, metinler, yorumlar ve sayılar artık renkli",
        "Renklendirme Ayarlar → Kod düzenleyici bölümünden kapatılabilir",
        "İmleç ve seçim renkleri alışıldık kalır; renklendirme yazmayı engellemez"
      ]
    },
    "26.10.42": {
      uk: [
        "Перевірка коду перед запуском: незакриті дужки й лапки, відсутня двокрапка після if/for/def, відступи з табуляцією навпіл із пробілами",
        "Попередження показано жовтим у виводі — вони не блокують запуск коду",
        "Перевірку можна вимкнути в Налаштуваннях → Редактор коду"
      ],
      en: [
        "Code check before running: unclosed brackets and quotes, missing colon after if/for/def, indents that mix tabs with spaces",
        "Warnings appear in yellow in the output and never block the run",
        "The check can be turned off in Settings → Code editor"
      ],
      tr: [
        "Çalıştırmadan önce kod denetimi: kapatılmamış parantez ve tırnaklar, if/for/def sonrası eksik iki nokta, sekme ile boşluğu karıştıran girintiler",
        "Uyarılar çıktıda sarı renkte görünür ve çalıştırmayı engellemez",
        "Denetim Ayarlar → Kod düzenleyici bölümünden kapatılabilir"
      ]
    },
    "26.10.41": {
      uk: [
        "«Розумний Enter» у редакторі Python: зберігає відступ, а після «:» додає новий рівень",
        "Ctrl+/ коментує або розкоментовує позначені рядки",
        "Авто-відступ можна вимкнути в Налаштуваннях → Редактор коду"
      ],
      en: [
        "Smart Enter in the Python editor: keeps the indent and adds a new level after “:”",
        "Ctrl+/ comments or uncomments the selected lines",
        "Auto-indent can be turned off in Settings → Code editor"
      ],
      tr: [
        "Python düzenleyicide akıllı Enter: girintiyi korur, “:” sonrası yeni seviye ekler",
        "Ctrl+/ seçili satırları yorumlar veya yorumdan çıkarır",
        "Otomatik girinti Ayarlar → Kod düzenleyici bölümünden kapatılabilir"
      ]
    },
    "26.10.40": {
      uk: [
        "Python-майданчик: кнопки «Копіювати код» і «Зберегти як .py» (Ctrl+S)",
        "Рядок статистики під редактором: кількість рядків і символів",
        "Показуємо час завантаження Python і час виконання коду"
      ],
      en: [
        "Python playground: “Copy code” and “Save as .py” buttons (Ctrl+S)",
        "Stats line under the editor: line and character counts",
        "Now shows Python load time and code execution time"
      ],
      tr: [
        "Python alanı: “Kodu kopyala” ve “.py olarak kaydet” düğmeleri (Ctrl+S)",
        "Düzenleyicinin altında istatistik satırı: satır ve karakter sayısı",
        "Python yükleme süresi ve kodun çalıştırılma süresi artık görünüyor"
      ]
    },
    "26.10.39": {
      uk: [
        "Python-майданчик тепер автоматично довантажує модулі з імпортів коду (numpy, pandas, matplotlib, sympy, requests, Pillow тощо)",
        "Зрозумілі підказки для модулів, які не працюють у браузері (tkinter, pygame, cv2 та інші)"
      ],
      en: [
        "Python playground now auto-loads modules from code imports (numpy, pandas, matplotlib, sympy, requests, Pillow, etc.)",
        "Clear hints for modules that don't work in the browser (tkinter, pygame, cv2, and others)"
      ],
      tr: [
        "Python oyun alanı artık kod içe aktarımlarından modülleri otomatik yüklüyor (numpy, pandas, matplotlib, sympy, requests, Pillow vb.)",
        "Tarayıcıda çalışmayan modüller için anlaşılır ipuçları (tkinter, pygame, cv2 ve diğerleri)"
      ]
    },
    "26.10.38": {
      uk: [
        "Додано мобільну адаптацію (mobile.css) для Capacitor",
        "Нижня навігація, safe area для notch, збільшені touch-targets",
        "Підготовка до створення .apk та .ipa додатків"
      ],
      en: [
        "Added mobile adaptation (mobile.css) for Capacitor",
        "Bottom navigation, safe area for notch, larger touch targets",
        "Preparation for building .apk and .ipa mobile apps"
      ],
      tr: [
        "Capacitor için mobil uyarlama eklendi (mobile.css)",
        "Alt gezinme, notch için güvenli alan, daha büyük dokunma hedefleri",
        ".apk ve .ipa mobil uygulamaları oluşturmaya hazırlık"
      ]
    },
    "26.10.37": {
      uk: [
        "Виправлено оновлення прогрес-барів — тепер змінюються в реальному часі"
      ],
      en: [
        "Fixed progress bar updates — now refresh in real-time"
      ],
      tr: [
        "İlerleme çubukları güncellemesi düzeltildi — artık gerçek zamanlı yenileniyor"
      ]
    },
    "26.10.36": {
      uk: [
        "Прогрес-бари для кожного досягнення — видно скільки відсотків залишилось",
        "Автоматичний розрахунок прогресу на основі статистики"
      ],
      en: [
        "Progress bars for each achievement — see how many percent remaining",
        "Automatic progress calculation based on stats"
      ],
      tr: [
        "Her başarı için ilerleme çubukları — yüzde kaç kaldığı görünür",
        "İstatistiklere göre otomatik ilerleme hesaplama"
      ]
    },
    "26.10.35": {
      uk: [
        "Додано 6 нових досягнень за використання інструментів",
        "Категорія «Інструменти»: калькулятор, конвертер, генератор випадкових чисел, генератор паролів",
        "Досягнення: перший інструмент, кожен інструмент окремо, усі 4 інструменти"
      ],
      en: [
        "Added 6 new achievements for using tools",
        "New 'Tools' category: calculator, converter, random generator, password generator",
        "Achievements: first tool, each tool individually, all 4 tools"
      ],
      tr: [
        "Araç kullanımı için 6 yeni başarı eklendi",
        "Yeni 'Araçlar' kategorisi: hesap makinesi, dönüştürücü, rastgele sayı, parola oluşturucu",
        "Başarımlar: ilk araç, her araç ayrı ayrı, tüm 4 araç"
      ]
    },
    "26.10.34": {
      uk: [
        "Нова секція «Досягнення» з 22 ачівками у 6 категоріях",
        "Категорії: Python, Ігри, Рекорди, Профіль, Дослідник, Серії",
        "Три рівні досягнень: Бронза, Срібло, Золото",
        "Автоматичне відстеження: запуск коду, ігри, рекорди, відвідування",
        "Тост-сповіщення при розблокуванні нового досягнення"
      ],
      en: [
        "New 'Achievements' section with 22 achievements in 6 categories",
        "Categories: Python, Games, Records, Profile, Explorer, Streaks",
        "Three achievement tiers: Bronze, Silver, Gold",
        "Automatic tracking: code runs, games, records, visits",
        "Toast notification when unlocking a new achievement"
      ],
      tr: [
        "6 kategoride 22 başarımla yeni 'Başarımlar' bölümü",
        "Kategoriler: Python, Oyunlar, Rekorlar, Profil, Kaşif, Seriler",
        "Üç başarı seviyesi: Bronz, Gümüş, Altın",
        "Otomatik izleme: kod çalıştırma, oyunlar, rekorlar, ziyaretler",
        "Yeni başarı açıldığında bildirim"
      ]
    },
    "26.10.33": {
      uk: [
        "Темні фони для темної теми — глибокі, насичені кольори (ніч, космос, індиго, граніт...)",
        "Світлі фони для світлої теми — м'які пастельні градієнти (небо, ранок, луг, м'ята...)",
        "Прибрано яскраві/світлі градієнти з темної теми та навпаки"
      ],
      en: [
        "Dark backgrounds for dark theme — deep, saturated colors (night, cosmos, indigo, granite...)",
        "Light backgrounds for light theme — soft pastel gradients (sky, morning, meadow, mint...)",
        "Removed bright/light gradients from dark theme and vice versa"
      ],
      tr: [
        "Koyu tema için koyu arka planlar — derin, doygun renkler (gece, kozmos, indigo, granit...)",
        "Açık tema için açık arka planlar — yumuşak pastel gradyanlar (gökyüzü, sabah, çayır, nane...)",
        "Koyu temadan açık/aydınlık gradyanlar kaldırıldı ve tam tersi"
      ]
    },
    "26.10.32": {
      uk: [
        "Виправлено визначення теми для фону профілю"
      ],
      en: [
        "Fixed theme detection for profile background"
      ],
      tr: [
        "Profil arka planı için tema algılama düzeltildi"
      ]
    },
    "26.10.31": {
      uk: [
        "Окремі фони для світлої та темної теми — перемикаються автоматично",
        "36 темних градієнтів + 36 світлих пастельних градієнтів",
        "Модал для нікнейму замість prompt() — гарніший інтерфейс",
        "Додано переклади для кнопок «Змінити фон» та «Змінити нік»"
      ],
      en: [
        "Separate backgrounds for light and dark themes — switch automatically",
        "36 dark gradients + 36 light pastel gradients",
        "Nickname modal instead of prompt() — nicer interface",
        "Added translations for 'Change background' and 'Change nickname' buttons"
      ],
      tr: [
        "Açık ve koyu temalar için ayrı arka planlar — otomatik geçiş",
        "36 koyu gradyan + 36 açık pastel gradyan",
        "prompt() yerine takma ad modalı — daha güzel arayüz",
        "'Arka planı değiştir' ve 'Takma adı değiştir' düğmeleri için çeviriler eklendi"
      ]
    },
    "26.10.30": {
      uk: [
        "Новий модал вибору аватара — 40 emoji + завантаження фото з ПК",
        "Вибір фону профілю — 36 готових градієнтів з назвами + завантаження з ПК",
        "Кнопка «Змінити фон» в профілі для швидкого доступу",
        "Піднято CACHE_VERSION до pc-v8 для очищення кешу"
      ],
      en: [
        "New avatar picker modal — 40 emojis + upload photo from PC",
        "Profile background selector — 36 named gradients + upload from PC",
        "'Change background' button in profile for quick access",
        "Bumped CACHE_VERSION to pc-v8 to clear cache"
      ],
      tr: [
        "Yeni avatar seçici modal — 40 emoji + PC'den fotoğraf yükleme",
        "Profil arka plan seçici — 36 isimli gradyan + PC'den yükleme",
        "Hızlı erişim için profilde 'Arka planı değiştir' düğmesi",
        "Önbelleği temizlemek için CACHE_VERSION pc-v8'e yükseltildi"
      ]
    },
    "26.10.29": {
      uk: [
        "Оновлено фото в секретній кімнаті (пасхалка 200 кліків) — нова зелена іконка термінала",
        "Піднято CACHE_VERSION до pc-v6 для очищення кешу Service Worker",
        "Виправлено кнопку «Що нового» — тепер працює і відкривається автоматично при вході",
        "Оновлено ?v= параметри до 26.10.29 для пробиття кешу браузера"
      ],
      en: [
        "Updated secret room photo (200-click easter egg) — new green terminal icon",
        "Bumped CACHE_VERSION to pc-v6 to clear Service Worker cache",
        "Fixed 'What's new' button — now works and opens automatically on site entry",
        "Updated ?v= params to 26.10.29 to bust browser cache"
      ],
      tr: [
        "Gizli oda fotoğrafı güncellendi (200 tıklama easter egg) — yeni yeşil terminal simgesi",
        "Service Worker önbelleğini temizlemek için CACHE_VERSION pc-v6'ya yükseltildi",
        "'Yenilikler' düğmesi düzeltildi — artık çalışıyor ve siteye girişte otomatik açılıyor",
        "Tarayıcı önbelleğini aşmak için ?v= parametreleri 26.10.29'a güncellendi"
      ]
    },
    "26.10.26": {
      uk: [
        "Додано PWA-підтримку — сайт можна встановити як застосунок",
        "Офлайн-режим: інтерфейс, ігри та інструменти працюють без інтернету",
        "Service Worker кешує статичні ресурси для швидкого завантаження",
        "Кнопка «Встановити як застосунок» в розділі «Про застосунок»",
        "Виправлено шлях до Service Worker для підпапок",
        "Додано PNG-іконку для PWA",
        "Вирівняно кнопки в hero-секції"
      ],
      en: [
        "Added PWA support — the site can be installed as an app",
        "Offline mode: interface, games and tools work without internet",
        "Service Worker caches static assets for fast loading",
        "Install button in About section",
        "Fixed Service Worker path for subdirectories",
        "Added PNG icon for PWA",
        "Fixed hero button alignment"
      ],
      tr: [
        "PWA desteği eklendi — site uygulama olarak kurulabilir",
        "Çevrimdışı mod: arayüz, oyunlar ve araçlar internetsiz çalışır",
        "Service Worker statik dosyaları hızlı yükleme için önbelleğe alır",
        "Hakkında bölümüne kurulum düğmesi eklendi",
        "Alt dizinler için Service Worker yolu düzeltildi",
        "PWA için PNG simgesi eklendi",
        "Hero düğme hizalaması düzeltildi"
      ]
    },
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
