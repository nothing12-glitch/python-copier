/* updates.js — версія застосунку + вікно "Що нового" при кожному вході.
   Правило деплою: підніми VERSION, додай запис у LOG і поміняй ?v= у index.html.
   Запис у LOG — це і є опис змін: він сам потрапляє у вікно «Що нового»
   й у повну історію оновлень у розділі «Допомога». */
(function (global) {
  const VERSION = "26.10.106";
  const KEY_SEEN = "app.versionSeen";

  const LOG = {
    "26.10.106": {
      uk: [
        "Сайт тепер повністю перекладений 24 мовами: інтерфейс, уроки, задачі, підказки, правила ігор, профіль і вікно «Що нового»",
        "Додано чотири нові мови: Arabic, Hebrew, Tiếng Việt і ไทย. Для арабської та івриту інтерфейс дзеркалиться справа наліво, код і консоль лишаються ліворуч",
        "Переклад вмикається миттєво: тексти підвантажуються окремим файлом лише для вибраної мови, тому сайт лишається легким",
        "Виправлено дрібниці: одиниці ваги пакетів, назви фонів аватара, підказки про непідтримувані модулі та вікно технічних робіт тепер теж говорять твоєю мовою"
      ],
      en: [
        "The whole site now speaks 24 languages: interface, lessons, tasks, hints, game rules, your profile and the What's new window",
        "Four languages added: Arabic, Hebrew, Tiếng Việt and Thai. Arabic and Hebrew mirror the layout right-to-left while code and the console stay left-to-right",
        "Switching is instant: texts load as one small file for the language you picked, so the site stays light",
        "Small fixes: package size units, avatar background names, hints about unsupported modules and the maintenance screen now use your language too"
      ],
      tr: [
        "Site artık tamamıyla 24 dilde: arayüz, dersler, görevler, ipuçları, oyun kuralları, profil ve Yenilikler penceresi",
        "Dört yeni dil eklendi: Arapça, İbranice, Tiếng Việt ve Thai. Arapça ve İbranice'de arayüz sağdan sola aynalanır, kod ve konsol soldan sağa kalır",
        "Dil değişimi anında: metinler yalnızca seçtiğin dil için küçük bir dosyayla yüklenir, site hafif kalır",
        "Küçük düzeltmeler: paket boyutu birimleri, arka plan adları, desteklenmeyen modül ipuçları ve bakım ekranı da artık senin dilinde"
      ]
    },
    "26.10.104": {
      uk: [
        "Вікно вибору пристрою стало майстром із кількох кроків: спочатку «ПК / ноутбук» або «Телефон / планшет», а далі сайт питає одну деталь. Планшет тепер у групі телефона — раніше він числився комп'ютером",
        "Для комп'ютера наступне питання — «З чого саме заходиш?»: стаціонарний ПК чи ноутбук. Ноутбук сповільнюється від батареї, тому його швидкодію сайт міряє щоразу, а стаціонарний — лише один раз",
        "Потім — «Який у тебе комп'ютер?» Під кожним варіантом написано про комплектуючі: у слабкого 2 ядра, 2–4 ГБ пам'яті, вбудована графіка GMA чи HD 4000 та HDD; у потужного — 4 і більше ядер, 8 ГБ пам'яті й більше, SSD і окрема відеокарта. Є й «Не знаю» — тоді сайт виміряє швидкість сам",
        "Телефон тепер має додаткове питання про систему: Android чи iOS. Кожна система отримує власну оптимізацію",
        "iOS: фокус у полі більше не змушує Safari збільшувати всю сторінку — редактор не дрібніє за 16 px, а підкладка підсвітки коду лишається на своєму місці. «Гумовий» відкат і сині рамки подвійного тапу вимкнено. Додано viewport-fit=cover: відступи під «чубик» і смугу жестів нарешті працюють, а висота панелей рахується від видимої частини екрана",
        "Android: вимкнено збільшення шрифту, яке Chromium навмання застосовує до тексту, прибрано смугу прокрутки в нижній панелі та «потягни — освіжи» над шапкою",
        "Ручний вибір швидкодії більше не перезаписує торішній автоматичний вимір: повернеш «Авто» — і сайт міряє ще раз"
      ],
      en: [
        "The device window is now a short wizard: first 'PC / laptop' or 'Phone / tablet', then the site asks one more detail. A tablet belongs to the phone group now — it used to count as a computer",
        "For a computer the next question is which one you are on right now: a desktop or a laptop. A laptop slows down on battery, so its speed is measured on every visit; a desktop only once",
        "Then 'How strong is your computer?' Under each answer the parts are spelled out: a weak machine has 2 cores, 2-4GB of memory, integrated GMA or HD 4000 graphics and a spinning HDD, a powerful one has 4+ cores, 8GB or more, an SSD and a separate graphics card. 'No idea' lets the site measure instead",
        "A phone now gets a question about the system: Android or iOS, so each system gets its own optimization",
        "iOS: focusing a field no longer makes Safari zoom the whole page — the editor never drops below 16px and the syntax layer stays aligned. The rubber-band scroll and the blue tap boxes are off. viewport-fit=cover finally makes the notch and home-bar padding work, and panel heights now count from the visible part of the screen",
        "Android: the random font inflation that Chromium applies to text is switched off, together with the scrollbar in the bottom bar and the pull-to-refresh glow",
        "Setting the performance by hand no longer overwrites the previous automatic measurement: go back to 'Auto' and the site measures again"
      ],
      tr: [
        "Cihaz penceresi artık kısa bir sihirbaz: önce 'PC / dizüstü' ya da 'Telefon / tablet', sonra site bir ayrıntı daha soruyor. Tablet artık bilgisayar grubunda değil, telefon grubunda",
        "Bilgisayarda sonraki soru şu an hangisini kullandığınız: masaüstü mü dizüstü mü. Dizüstü pilde yavaşladığı için hızı her girişte ölçülür, masaüstünde ise yalnızca bir kez",
        "Ardından 'Bilgisayarın ne kadar güçlü?' Her cevabın altında parçaların dökümü var: zayıf makinede iki çekirdek, 2-4GB bellek, tümleşik GMA veya HD 4000 grafik ve sabit disk; güçlüde 4+ çekirdek, 8GB ve üzeri, SSD ve ayrı ekran kartı. 'Bilmiyorum' seçerseniz site kendisi ölçer",
        "Telefonlara sistem sorusu eklendi: Android ya da iOS. Böylece her sistem kendi optimizasyonunu alıyor",
        "iOS: bir alana dokununca Safari artık tüm sayfayı yakınlaştırmıyor; editör 16px'nin altına inmiyor, kod vurgusu kaymıyor. Kauçuk kaydırma ve mavi dokunma kutuları kapalı. viewport-fit=cover ile çentik ve alt boşluklar sonunda çalışıyor, panel yükseklikleri görünen alana göre hesaplanıyor",
        "Android: Chromium'un metne rastgele uyguladığı yazı büyütmeyi kapattık; alt bardaki kaydırma çubuğu ve 'aşağı çek, yenile' parlaması kaldırıldı",
        "Performansı elle seçmek önceki otomatik ölçümü artık ezmiyor: 'Otomatik'e dönerseniz site yeniden ölçer.'"
      ]
    },
    "26.10.103": {
      uk: [
        "Проєктор тепер визначається сам, за кількома ознаками одразу: інший екран, вікно на другому моніторі, роздільна здатність 1024×768 чи 800×600, квадратні 4:3 і 5:4, дотик на великому екрані без миші, марка дошки в назві браузера. однієї ознаки мало — ноутбук, що дублює картинку, виглядає так само, як без проєктора, тому рішення ухвалює сума",
        "У вікні вибору пристрою з'явилась кнопка «Перевірити, чи підʼєднано проєктор». Вона просить у браузера дозвіл на список екранів і, якщо знайде другий, сама вмикає великий інтерфейс",
        "Якщо проєктор під'єднали вже посеред уроку, сайт помітить це за кілька секунд і запропонує переключитися — з кнопкою «Не зараз», якщо ти не вчитель",
        "Старі ПК тепер не ламаються: прибрано можливості CSS, яких у Chrome 80–110 ще не було, тому кольори, скління та відступи малюються правильно і там. А зовсім старий движок, що не розуміє навіть мови програму, бачить тепер не чорну порожню сторінку, а підказку трьома мовами",
        "Через Firefox на шкільних комп'ютерах зум мовчки не працював (там він з'явився лише у версії 126). Тепер такий інтерфейс масштабується іншим способом, і на екрані результат виглядає так само",
        "Легкий режим для слабких машин: два ядра, 2 ГБ пам'яті чи вбудована графіка GMA/HD 4000 — і світлові плями, промені, розмиття скла та анімації вимикаються самі. Можна й вручну: Налаштування → Швидкодія"
      ],
      en: [
        "The projector is now detected on its own, from several signs at once: a second screen, the window sitting on another monitor, a 1024x768 or 800x600 resolution, square 4:3 and 5:4 ratios, touch on a big screen without a mouse, a board brand in the browser name. One sign alone is not enough — a laptop mirroring its picture looks exactly like one with no projector — so the sum of them decides",
        "The device dialog gained a 'Check whether a projector is connected' button. It asks the browser for permission to list screens and, if it finds a second one, turns the large interface on by itself",
        "If the projector gets plugged in during a lesson, the site notices within seconds and offers to switch — with a 'Not now' button for anyone who is not the teacher",
        "Old PCs no longer break: CSS features that Chrome 80-110 did not have were removed, so colours, glass and spacing render correctly there too. And an engine that cannot even parse the app now shows a hint in three languages instead of a blank black page",
        "On school computers running Firefox the zoom used to fail silently (it only arrived in version 126). That interface is now scaled another way, and the screen looks the same",
        "A light mode for weak machines: two cores, 2GB of memory or GMA/HD 4000 graphics and the glow blobs, beams, glass blur and animations turn themselves off. You can also set it by hand: Settings → Performance"
      ],
      tr: [
        "Projeksiyon artık kendi kendine, birkaç belirtiden birden anlaşılıyor: ikinci ekran, pencerenin başka monitörde durması, 1024x768 ya da 800x600 çözünürlük, kare 4:3 ve 5:4 oranları, fare olmadan büyük ekranda dokunuş, tarayıcı adındaki tahta markası. Tek belirti yetmez — görüntüyü yansıtan dizüstü, projeksiyonsuzla birebir aynı görünür — karar toplamınki",
        "Cihaz penceresine 'Projeksiyon bağlı mı, kontrol et' düğmesi eklendi. Tarayıcıdan ekran listesi iznini ister ve ikinci ekran bulursa büyük arayüzü kendisi açar",
        "Ders ortasında projeksiyon bağlanırsa site bunu birkaç saniye içinde fark edip geçmeyi önerir — öğretmen olmayanlar için 'Şimdi değil' düğmesiyle",
        "Eski bilgisayarlar artık bozulmuyor: Chrome 80-110'da bulunmayan CSS özellikleri kaldırıldı, renkleri, cam efekti ve boşlukları orada da doğru çiziliyor. Uygulamanın dilini hiç yorumlayamayacak kadar eski bir motor da artık boş siyah sayfa değil, üç dilde bir uyarı görüyor",
        "Okul bilgisayarlarında Firefox'ta yakınlaştırma sessizce çalışmıyordu (yalnızca 126 sürümünde geldi). Arayüz artık başka bir yöntemle ölçekleniyor ve ekran aynı görünüyor",
        "Zayıf makineler için hafif kip: iki çekirdek, 2GB bellek veya GMA/HD 4000 grafikse ışık lekeleri, huzmeler, cam bulanıklığı ve hareketler kendiliğinden kapanır. Elle de olur: Ayarlar → Performans"
      ]
    },
    "26.10.102": {
      uk: [
        "Режим проєктора тепер масштабує шапку, панель і вміст однаково. Раніше шапка лишалась звичайної висоти, тому під нею виднілась порожня смуга, а зумлена панель наїжджала на текст — обидва прибрали",
        "Збільшення більше не стало 1.2 навмання: воно рахується від ширини екрана. На Full HD інтерфейс росте приблизно в 1.4 раза, на дошці 1024×768 лишається 1.0 — там усе велике й так, а зайвий зум лише змусив би гортати посеред уроку",
        "Читати з останньої парти стало легше: сірий дрібний текст освітлено, а світлові плями, промені й підсвітка курсора — вимкнено. Шрифт у редакторі коду росте разом з інтерфейсом (14 px → 20 px на Full HD), тож код на дошці не дрібніє за підписи",
        "Панель ліворуч перестала обрізати підписи груп: через зум флекс-колонка стискала те, що не мало власної висоти. Тепер панель просто гортається",
        "Дошка зазвичай сенсорна, тому кнопки виросли до 48–52 px, а палець має влучати в ціль без прицілювання"
      ],
      en: [
        "Projector mode now scales the header, the side panel and the page together. The header used to stay at its normal height, which left an empty band under it and made the zoomed panel overlap the text — both are gone",
        "The zoom is no longer a fixed 1.2: it is computed from screen width. Full HD grows the interface about 1.4x, a 1024x768 board stays at 1.0 — there everything is already large and extra zoom would only force scrolling mid-lesson",
        "Reading from the back row got easier: dim grey text is brightened, and glow blobs, beams and the cursor light are switched off. The code editor font grows with the interface (14px to 20px on Full HD), so code stops being smaller than the labels",
        "The left panel no longer slices group labels in half. Zoomed, the flex column used to crush whatever had no height of its own; now the panel simply scrolls",
        "Boards are usually touch screens, so buttons grew to 48-52px and a finger hits the target without aiming"
      ],
      tr: [
        "Projeksiyon kipi artık başlığı, yan paneli ve içeriği birlikte büyütüyor. Başlık eski yüksekliğinde kalınca altında boş şerit oluşuyor, yakınlaşmış panel de metnin üstüne biniyordu — ikisi de gitti",
        "Yakınlaştırma sabit 1.2 değil, artık ekran genişliğinden hesaplanıyor. Full HD arayüzü ~1,4 kat büyütüyor; 1024x768 tahtada 1,0 kalıyor — orada her şey zaten büyük, gereksiz yakınlaştırma ders ortasında kaydırmaya zorlardı",
        "Son sıradan okumak kolaylaştı: soluk gri metin aydınlatıldı, ışık lekeleri, huzmeler ve imleç ışığı kapatıldı. Kod editörü yazısı arayüzle birlikte büyüyor (Full HD'de 14px → 20px), böylece kod etiketlerden küçük kalmıyor",
        "Sol panel grup etiketlerini artık ortadan kesmiyor. Yakınlaştırılmışta yüksekliği olmayan öğeyi flex sütun ezeryordu; artık panel basitçe kayıyor",
        "Tahtalar çoğunlukla dokunmatik olduğundan düğmeler 48-52px'e büyüdü; parmak nişan almadan hedefi buluyor"
      ]
    },
    "26.10.101": {
      uk: [
        "Гайд на телефоні нарешті світить туди, куди треба. Кільце, лапки й хмарка з підказкою самі рахують, де вільно, і не сідають на ціль ні при якому розмірі екрана. Якщо сторінка зростає під час показу (веб-шрифт довантажився) — усе переставляється заново",
        "Якщо поверх сторінки відкрилося будь-яке вікно — вибір пристрою, привітання, мова, «Що нового» — гайд стає на паузу, ховає кільце й не показує крізь нього. Вікно закрився — гайд продовжує з того ж кроку",
        "На кожному кроці видно «Пропустити». Натиснув — гайд вимкнено й більше не чіпає тебе, одразу можна працювати",
        "У вікні вибору пристрою з'явився третій варіант — «Проєктор / дошка». Для інтерактивної дошки в класі сайт визначає її сам; з ноутбука, під'єднаного до проєктора, кнопка теж стає рекомендованою. Режим робить інтерфейс удвічі більшим, щоб було видно з останньої парти, і запам'ятається наступного входу. Переклади uk/en/tr"
      ],
      en: [
        "The phone tour finally points where it should. The ring, the paw and the hint bubble work out on their own where there is free room, so at no screen size do they land on the target. If the page grows while a step is showing (a web font just finished loading) everything is re-placed",
        "When any window opens over the page — device choice, welcome, language, What's new — the tour pauses, hides its ring and never shines through it. Close the window and the tour continues from the same step",
        "'Skip' is visible on every step. Tap it and the tour is off for good, so you can get straight to work",
        "The device dialog gained a third option — 'Projector / board'. An interactive classroom board is detected automatically, and a laptop hooked up to a projector gets the option marked recommended too. The mode doubles the interface so the back row can read it, and is remembered for the next visit. uk/en/tr translations"
      ],
      tr: [
        "Rehber artık telefonda doğru yeri gösteriyor. Halka, pati ve ipucu balonu boş alanı kendisi hesaplıyor; ekran boyutu ne olursa olsun hedefin üstüne binmiyor. Gösterim sırasında sayfa uzarsa (web yazı tipi geç yüklendi) her şey yeniden yerleşiyor",
        "Sayfanın üstünde bir pencere açıldığında — cihaz seçimi, karşılama, dil, 'Yenilikler' — rehber duraklıyor, halkasını gizliyor ve pencerenin içinden ışık saçmıyor. Pencere kapanınca rehber aynı adımdan sürüyor",
        "Her adımda 'Atla' görünür. Dokunursan rehber kalıcı olarak kapanır ve hemen işine başlayabilirsin",
        "Cihaz penceresine üçüncü seçenek eklendi: 'Projeksiyon / tahta'. Sınıftaki etkileşimli tahta otomatik tanınır; projeksiyona bağlı dizüstünde de seçenek 'önerilen' olarak işaretlenir. Bu kiplik arayüzü iki kat büyütür ki en arka sıra görsün, ve bir sonraki girişte hatırlanır. uk/en/tr çevirileri"
      ]
    },
    "26.10.100": {
      uk: [
        "Програма нарешті справді запитує. Коли код доходить до input(), він зупиняється просто в консолі: з'являється інлайн-поле, вводь відповідь і тисни Enter — код іде далі. Статус у цей момент каже «Програма чекає на твій ввід»",
        "Кнопка «Стоп» працює як Ctrl+D у терміналі: наступний input() отримує EOFError, програма завершується чесно, а в консолі з'являється короткий напис замість довжелезного трейсбека. Enter на порожньому рядку — це порожня відповідь",
        "Поле «Ввід для input()» лишилося резервом і має пріоритет: є там рядки — програма бере значення звідти пакетно, без зупинок. Поле порожнє — питатиме прямо в консолі; підказка під полем про це нагадує",
        "У курсі з'явилася кнопка «Спробувати»: відкриває твій розв'язок у майданчику й одразу його запускає. Автоперевірка задач лишилася неінтерактивною, тож input() у перевірках працює рівно як раніше. Переклади uk/en/tr"
      ],
      en: [
        "The program finally really asks. When your code reaches input() it stops right in the console: an inline field appears, type the answer and press Enter, and the code continues. The status bar reads 'The program is waiting for your input'",
        "The Stop button works like Ctrl+D in a terminal: the next input() gets an EOFError, the program ends honestly and the console shows a short notice instead of a long traceback. Enter on an empty line is an empty answer",
        "The 'Input for input()' field stays as a fallback and has priority: put lines there and the program consumes them in batch without pausing. Leave it empty and the program asks right in the console — the hint under the field reminds you",
        "The course gained a 'Try it' button: it opens your solution in the playground and runs it straight away. Automatic task checking stays non-interactive, so input() in checks behaves exactly as before. uk/en/tr translations"
      ],
      tr: [
        "Program artık gerçekten soruyor. Kod input() satırına geldiğinde konsolun içinde duruyor: satır içi bir alan açılıyor, yanıtı yazıp Enter'a basıyorsun ve kod devam ediyor. Durum çubuğu 'Program senin girişini bekliyor' diyor",
        "Durdur düğmesi terminaldeki Ctrl+D gibi çalışıyor: sonraki input() bir EOFError alır, program düzgünce biter ve konsolda uzun bir izleme yerine kısa bir not görünür. Boş satırda Enter boş yanıt demektir",
        "'input() için girdi' alanı yedek olarak kalıyor ve önceliğe sahip: içine satır yazarsan program onları durmadan toplu kullanır. Alan boşsa program doğrudan konsolda sorar — altındaki ipucu bunu hatırlatır",
        "Kursa 'Dene' düğmesi eklendi: çözümünü alanda açıp hemen çalıştırıyor. Ödevlerin otomatik denetimi etkileşimsiz kaldığı için input() denetimlerde eskisiyle birebir aynı çalışıyor. uk/en/tr çevirileri"
      ]
    },
    "26.10.99": {
      uk: [
        "Основи й логіка завершують першу частину курсу. Далі — окремий розділ «Умовний оператор» із сімома уроками: if без else, блоки та відступи, else, elif, вкладені умови, and/or/not в умові та тернарний вираз",
        "Бонуси у грі, шапка й шарф, медалі та квитки допомагають зрозуміти гілки й блоки. Пояснюємо 4 пробіли на рівень, спільне продовження після блоку, першу істинну гілку elif та відповідність else рівню вкладеності",
        "Практика з input() перевіряє межі, різні гілки, усі вісім комбінацій погоди та парність нуля й від'ємних чисел. Тернарний вираз обирає значення, а не замінює складні блоки",
        "Усі уроки перекладено uk/en/tr. Попередня практика if/else зберегла свій прогрес; нові вправи мають окремі записи. У курсі 54 уроки й 6 розділів: «Логіка» — 8, «Умовний оператор» — 7"
      ],
      en: [
        "Basics and Logic finish the first part of the course. A separate Conditional statements chapter follows with seven lessons: if without else, blocks and indentation, else, elif, nested conditions, and/or/not in conditions and the ternary expression",
        "Game bonuses, hats and scarves, medals and tickets explain branches and blocks. Covers 4 spaces per level, shared continuation after a block, the first matching elif branch and matching else to its nesting level",
        "Input-based practice tests boundaries, different branches, all eight weather combinations and the parity of zero and negative integers. The ternary expression chooses a value rather than replacing complicated blocks",
        "All lessons include uk/en/tr translations. The existing if/else practice retains its progress; new exercises have separate records. The course now has 54 lessons in 6 chapters: 8 in Logic and 7 in Conditional statements"
      ],
      tr: [
        "Temeller ve Mantık, kursun ilk kısmını tamamlıyor. Ardından yedi derslik ayrı Koşullu komutlar bölümü geliyor: else olmadan if, bloklar ve girintiler, else, elif, iç içe koşullar, koşullarda and/or/not ve üçlü koşullu ifade",
        "Oyun bonusları, şapka ve atkı, madalyalar ve biletlerle dallar ve bloklar açıklanıyor. Her düzeyde 4 boşluk, bloktan sonraki ortak devam, ilk doğru elif dalı ve else ile girinti düzeyinin eşleşmesi ele alınıyor",
        "input() alıştırmaları sınırları, farklı dalları, sekiz hava birleşiminin tamamını, sıfırın ve negatif sayıların tek veya çift oluşunu denetliyor. Üçlü koşullu ifade karmaşık blokların yerine geçmek yerine bir değer seçiyor",
        "Bütün derslerde uk/en/tr çevirileri var. Önceki if/else alıştırmasının ilerlemesi korunuyor; yeni alıştırmaların kayıtları ayrı. Kursta 6 bölüm ve 54 ders var: Mantık bölümünde 8, Koşullu komutlar bölümünde 7"
      ]
    },
    "26.10.98": {
      uk: [
        "Одразу після == з'явився окремий урок «True, False і тип bool»: спочатку учні бачать результат порівняння, а потім дізнаються про два логічні значення. False — це відповідь «ні», а не помилка програми",
        "Приклад про книжку в рюкзаку пояснює великі літери, запис без лапок, збереження відповіді у змінній і type(). Розрізняємо False та рядок \"False\": навіть такий ввід через input() залишається текстом",
        "Практика порівнює назви книжок і перевіряє типи результату та введеного тексту; п'ять наборів вводу охоплюють різні відповіді, регістр і пробіли. Переклади uk/en/tr; тепер 48 уроків, із них 9 у «Логіці»"
      ],
      en: [
        "A separate 'True, False and the bool type' lesson now follows == immediately: learners first see a comparison result, then discover the two Boolean values. False means 'no', not a program error",
        "A book-in-a-backpack example explains capital initials, unquoted values, storing answers in variables and type(). False differs from the string \"False\": even this input() value remains text",
        "Practice compares book titles and checks the types of the result and input text; five input sets cover different answers, case and spaces. Includes uk/en/tr translations; now 48 lessons, including 9 in Logic"
      ],
      tr: [
        "== dersinin hemen ardından ayrı bir 'True, False ve bool türü' dersi geliyor: öğrenciler önce karşılaştırma sonucunu görüyor, sonra iki mantıksal değeri öğreniyor. False, program hatası değil, 'hayır' yanıtıdır",
        "Çantadaki kitap örneği büyük harfleri, tırnaksız değerleri, yanıtı değişkende saklamayı ve type() kullanımını açıklıyor. False ile \"False\" dizesi farklıdır: input() ile böyle bir değer girilse bile metin olarak kalır",
        "Alıştırmada kitap adları karşılaştırılıp sonucun ve girilen metnin türleri denetleniyor; beş girdi kümesi farklı yanıtları, harf büyüklüğünü ve boşlukları kapsıyor. uk/en/tr çevirileriyle artık 48 ders, Mantık bölümünde 9 ders var"
      ]
    },
    "26.10.97": {
      uk: [
        "Місток від основ до if: окремі уроки ==, != та нерівностей <, >, <=, >=. Пояснюємо різницю між присвоєнням = і порівнянням ==, логічний тип bool, відповіді True/False та рівність на межі",
        "and, or і not тепер мають власні уроки зі зрозумілими прикладами про квиток на атракціон, олівці й фломастери та дощ. Усі приклади працюють без ще не вивченого if",
        "Урок поєднання операторів перенесено перед if: гра надворі на вихідних або канікулах без дощу пояснює дужки та пріоритет not → and → or. Практика перевіряє всі вісім комбінацій вводу",
        "Усі сім кроків містять практику з input() і переклади uk/en/tr. Урок if спирається на вже знайомі порівняння; у курсі тепер 47 уроків, із них 8 у розділі «Логіка»"
      ],
      en: [
        "A bridge from basics to if: separate lessons for ==, != and inequalities <, >, <=, >=. Introduces assignment = versus comparison ==, the bool type, True/False answers and inclusive boundaries",
        "and, or and not now have their own lessons with child-friendly examples about ride tickets, pencils and markers, and rain. All examples work without the not-yet-taught if statement",
        "The combined-operators lesson now comes before if: playing outside on weekends or school holidays without rain explains parentheses and not → and → or precedence. Practice checks all eight input combinations",
        "All seven steps include input()-based practice and uk/en/tr translations. The if lesson builds on familiar comparisons; the course now has 47 lessons, including 8 in Logic"
      ],
      tr: [
        "Temellerden if'e köprü: ==, != ve <, >, <=, >= eşitsizlikleri için ayrı dersler. Atama = ile karşılaştırma == farkı, bool türü, True/False yanıtları ve sınırdaki eşitlik açıklanıyor",
        "and, or ve not artık oyuncak bileti, kalemler ve keçeli kalemler ile yağmur üzerine çocuklara uygun örneklerle ayrı derslerde. Örnekler henüz öğretilmemiş if olmadan çalışıyor",
        "Operatörleri birleştirme dersi if'ten önceye alındı: yağmursuz hafta sonu veya okul tatilinde dışarıda oynamak, parantezleri ve not → and → or önceliğini açıklıyor. Alıştırma sekiz girdi birleşiminin tamamını denetliyor",
        "Yedi adımın tümünde input() alıştırmaları ve uk/en/tr çevirileri var. if dersi artık bilinen karşılaştırmalara dayanıyor; kursta 47 ders, Mantık bölümünde 8 ders var"
      ]
    },
    "26.10.96": {
      uk: [
        "Перед upper()/lower() тепер є пояснення поняття методу: це функція, пов'язана з об'єктом. Порівнюємо len(word) із word.upper() та розбираємо рядок, крапку, назву методу й дужки виклику",
        "Приклад показує, як зберегти результат у loud і вивести через print(): виклик upper() сам нічого не друкує та не змінює початковий word. Окремо пояснено різницю між word.upper і word.upper()",
        "Уточнено, що незмінність початкового тексту стосується розглянутих методів рядків, а не всіх методів узагалі. Пояснення оновлено українською, англійською та турецькою"
      ],
      en: [
        "The upper()/lower() lesson now introduces a method as a function associated with an object. It compares len(word) with word.upper() and explains the string, dot, method name and calling parentheses",
        "The example saves the result in loud and displays it with print(): upper() alone neither prints anything nor changes the original word. The difference between word.upper and word.upper() is also explained",
        "Clarified that leaving the original text unchanged is a property of the string methods covered here, not all methods in general. Updated the explanations in Ukrainian, English and Turkish"
      ],
      tr: [
        "upper()/lower() dersinde artık metot kavramı açıklanıyor: bir nesneyle ilişkili fonksiyon. len(word) ile word.upper() karşılaştırılıyor; dize, nokta, metot adı ve çağrı parantezleri tek tek anlatılıyor",
        "Örnek, sonucu loud değişkeninde saklayıp print() ile gösteriyor: upper() tek başına hiçbir şey yazdırmaz ve özgün word değerini değiştirmez. word.upper ile word.upper() arasındaki fark da açıklanıyor",
        "Özgün metnin değişmemesinin tüm metotların değil, burada ele alınan dize metotlarının özelliği olduğu netleştirildi. Açıklamalar Ukraynaca, İngilizce ve Türkçe güncellendi"
      ]
    },
    "26.10.95": {
      uk: [
      "У «Основах» почався блок про роботу з текстом. Перший урок — «Регістр літер: upper() і lower()»: метод пишеться через крапку після рядка, круглі дужки наприкінці обов'язкові навіть порожні, а сам рядок метод не переписує — w.upper() лише повертає новий",
      "Другий — «Пробіли по краях: strip()»: w.strip() прибирає пробіли, табуляції та розриви рядка на початку й наприкінці, не чіпаючи середину («a b» лишається «a b»); для одного боку є lstrip() і rstrip()",
      "Третій — «Методи ланцюжком: strip() і lower() разом»: name = input().strip().lower() читається зліва праворуч, кожен метод бере результат попереднього, і в такій парі порядок не змінює відповіді",
      "Усі три практики зчитують слово через input() і мають по три тести, тому переписати відповідь від руки не вийде. У уроці про strip() слово обгортають у квадратні дужки — так зайві пробіли одразу кидаються в очі, а ланцюжковий урок перевіряє ще й довжину очищеного слова",
      "Розділ «Основи» тепер має 32 уроки, увесь курс — 41"
      ],
      en: [
      "A new block about working with text has started in Basics. The first lesson — \"Letter case: upper() and lower()\": a method is written after a dot following the string, its round brackets are required even when empty, and the method does not rewrite the string itself — w.upper() only returns a new one",
      "The second — \"Spaces at the edges: strip()\": w.strip() removes spaces, tabs and line breaks from the beginning and the end without touching the middle (\"a b\" stays \"a b\"); for a single side there are lstrip() and rstrip()",
      "The third — \"Chaining methods: strip() and lower() together\": name = input().strip().lower() is read left to right, each method taking the result of the previous one, and in this pair the order does not change the answer",
      "All three practices read the word with input() and have three tests each, so retyping an answer by hand will not work. In the strip() lesson the word is wrapped in square brackets so that the leftover spaces stand out, and the chaining lesson also checks the length of the cleaned word",
      "The Basics chapter now has 32 lessons, the whole course 41"
      ],
      tr: [
      "Temeller'de metinle çalışma bloğu başladı. İlk ders \"Harf durumu: upper() ve lower()\": metot dizeden sonra nokta ile yazılır, sonda parantezler boş olsa bile şarttır ve metot dizeyi yerinde değiştirmez — w.upper() yalnızca yeni bir dize verir",
      "İkincisi \"Kenarlardaki boşluklar: strip()\": w.strip(), baştaki ve sondaki boşlukları, sekmeleri ve satır sonlarını siler, içerisine dokunmaz (\"a b\" yine \"a b\"); tek taraf için lstrip() ve rstrip() var",
      "Üçüncüsü \"Metotları zincirleme: strip() ve lower() birlikte\": name = input().strip().lower() soldan sağa okunur, her metot bir öncekinin sonucunu alır, ve bu ikilide sıra cevabı değiştirmez",
      "Üç alıştırma da sözcüğü input() ile okur ve üçer test taşır, yani yanıtı elle yazmak işe yaramaz. strip() dersinde sözcük köşeli parantez içine alınır ki kalan boşluklar göze batsın; zincir dersinde temizlenmiş sözcüğün uzunluğu da denetlenir",
      "Temeller bölümü artık 32 ders, tüm kurs 41 ders"
      ]
    },
    "26.10.94": {
      uk: [
      "У «Параметрі sep» приклад тепер збирає з чисел дату й час: print(5, 11, 2026, sep=\".\") дає 5.11.2026, а print(9, 30, 15, sep=\":\") — 9:30:15. Той самий трюк, що й зі словами",
      "«Параметр end» показує підписаний рядок: print(\"Дата:\", end=\" \"), а далі print(5, 11, 2026, sep=\".\") — разом це «Дата: 5.11.2026», бо значення лишається на тому самому рядку",
      "У «Разом: sep і end» приклад виводить три рядки: 10+20=30, «Дата: 5.11.2026» та «9:30:15 — зараз»",
      "В теорії пояснено, чому підпис виноситься в окремий виклик: sep діє між усіма значеннями, тому в одному виклику «Дата:» склеїлося б з числами так само, як і крапки",
      "Кнопка «Запустити в майданчику» переносить нові приклади у редактор Python, тож дату й час можна запустити й побачити справжній вивід"
      ],
      en: [
      "In \"The sep parameter\" the example now builds a date and a time out of numbers: print(5, 11, 2026, sep=\".\") gives 5.11.2026 and print(9, 30, 15, sep=\":\") gives 9:30:15 — the same trick as with words",
      "\"The end parameter\" shows a labelled line: print(\"Дата:\", end=\" \") followed by print(5, 11, 2026, sep=\".\") together give \"Дата: 5.11.2026\", because the value stays on the same line",
      "In \"Together: sep and end\" the example prints three lines: 10+20=30, \"Дата: 5.11.2026\" and \"9:30:15 — зараз\"",
      "The theory explains why the label is a separate call: sep acts between every value, so in one call \"Дата:\" would be glued to the numbers exactly like the dots",
      "The \"Run in the playground\" button moves the new examples into the Python editor, so the date and time can actually be run and their output seen"
      ],
      tr: [
      "\"sep parametresi\" dersinde örnek artık sayılardan tarih ve saat kuruyor: print(5, 11, 2026, sep=\".\") → 5.11.2026, print(9, 30, 15, sep=\":\") → 9:30:15; kelimelerle yapılanın aynı yolu",
      "\"end parametresi\" etiketli satırı gösteriyor: print(\"Дата:\", end=\" \") ve ardından print(5, 11, 2026, sep=\".\") birleşince «Дата: 5.11.2026» oluyor, çünkü değer aynı satırda kalıyor",
      "\"Birlikte: sep ve end\" dersi üç satır yazdırıyor: 10+20=30, «Дата: 5.11.2026» ve «9:30:15 — зараз»",
      "Teoride etiketin neden ayrı çağrıldığı açıklanıyor: sep tüm değerlerin arasında çalışır, tek çağrıda «Дата:» sayılarla aynı şekilde yapışırdı",
      "«Playground'da çalıştır» düğmesi yeni örnekleri Python editörüne taşır; tarihi ve saati gerçekten çalıştırıp çıktıyı görmek mümkün"
      ]
    },
    "26.10.93": {
      uk: [
        "Тему параметрів print() розбито на три уроки. Перший — «Параметр sep: що ставити між значеннями»: без sep це один пробіл, sep=\"-\" дає 1-2, sep=\", \" — «1, 2», а порожній sep=\"\" зліпить значення без жодного символу; діє sep лише між значеннями, тому на початку й наприкінці рядка його не видно",
        "Новий урок «Параметр end: чим закінчити рядок»: кожен print сам додає \\n, а end= замінює цей кінець — print(\"a\", end=\"\") і print(\"b\") дають ab в одному рядку, end=\" \" лишає пробіл, end=\"!\" ставить знак оклику замість розриву; за проміжки всередині виклику й далі відповідає sep",
        "Третій урок — «Разом: sep і end в одному print()»: print(10, 20, sep=\"+\", end=\"=\") друкує 10+20=, а наступний print(30) продовжує той самий рядок, тож стара рівність 10+20=30 повернулася, але тепер із числами з вводу",
        "Усі три практики беруть дані з input() і мають по три тести, тому переписати відповідь від руки не вийде: жорстко кодований рядок проходить лише перший тест",
        "Розділ «Основи» виріс до 29 уроків, увесь курс — 38"
      ],
      en: [
        "The print() parameters topic is split into three lessons. The first — \"The sep parameter: what goes between the values\": without sep it is a single space, sep=\"-\" gives 1-2, sep=\", \" gives «1, 2», and an empty sep=\"\" glues the values with nothing at all; sep only acts between values, so it is invisible at the start and at the end of the line",
        "New lesson \"The end parameter: how to close the line\": every print appends \\n by itself, and end= replaces that tail — print(\"a\", end=\"\") followed by print(\"b\") gives ab on one line, end=\" \" leaves a space, end=\"!\" puts an exclamation mark instead of the break; the gaps inside the call remain sep's job",
        "The third lesson — \"Together: sep and end in one print()\": print(10, 20, sep=\"+\", end=\"=\") prints 10+20= and the next print(30) continues the same line, so the old 10+20=30 equality is back, now with numbers taken from input",
        "All three practices read their data from input() and carry three tests each, so retyping an answer by hand will not work: a hard-coded line passes only the first test",
        "The Basics chapter grew to 29 lessons, the whole course now has 38"
      ],
      tr: [
        "print() parametreleri konusu üç derse bölündü. Birincisi \"sep parametresi: değerlerin arasına ne konur\": sep yoksa tek boşluktur, sep=\"-\" → 1-2, sep=\", \" → «1, 2», boş sep=\"\" ise değerleri hiçbir karakter koymadan yapıştırır; sep yalnızca değerlerin arasında çalışır, bu yüzden satırın başında ve sonunda görünmez",
        "Yeni ders \"end parametresi: satırı nasıl bitirmek\": her print sonuna kendiliğinden \\n ekler, end= bu sonu değiştirir — print(\"a\", end=\"\") ve ardından print(\"b\") tek satırda ab verir, end=\" \" boşluk bırakır, end=\"!\" kırılma yerine ünlem koyar; çağrının içindeki boşluklar yine sep'in işi",
        "Üçüncü ders — \"Birlikte: tek print() içinde sep ve end\": print(10, 20, sep=\"+\", end=\"=\") 10+20= yazdırır, sonraki print(30) aynı satırı sürdürür; eski 10+20=30 eşitliği geri döndü, ama artık sayılar girdiden geliyor",
        "Üç alıştırma da verileri input() ile okur ve her biri üç test taşır; bu yüzden yanıtı elle yazmak işe yaramaz: baştan yazılmış satır yalnızca ilk testi geçer",
        "Temeller bölümü 29 derse büyüdü, tüm kurs artık 38 ders"
      ]
    },
    "26.10.92": {
      uk: [
        "Урок про інтерполяцію розбито на два. Перший — «Інтерполяція: лише змінні»: у фігурні дужки f-рядка ставлять саму назву змінної — f\"Привіт, {name}!\" — а префікс f пишуть перед першою лапкою всього рядка",
        "Там само названо дві типові помилки: забутий f, коли рядок друкується буквально, з назвою замість значення, та незакрита дужка, коли Python не бачить кінця вставки. Практика бере ім'я з input(), тому переписати відповідь від руки не вийде",
        "Новий урок «Інтерполяція: вирази та len() у дужках»: у дужках рахується весь вираз — f\"{a + b}\" дає суму, а для txt = \"це текст\" рядок print(f\"довжина тексту - {len(txt)}\") дає 8; лапки всередині дужок не повинні збігатися з лапками рядка, тож складний виклик краще винести в змінну вище",
        "Задача другого уроку читає три рядки вводу — слово та два числа — і перевіряє і довжину, і суму, тому жорстко кодована відповідь проходить лише перший із трьох тестів",
        "Розділ «Основи» виріс до 27 уроків, увесь курс — 36"
      ],
      en: [
        "The interpolation lesson is split into two. The first — \"Interpolation: variables only\": the braces of an f-string hold just the name of a variable — f\"Привіт, {name}!\" — and the f prefix stands before the very first quote of the whole line",
        "The same lesson names two typical mistakes: a forgotten f, which prints the line literally with the name instead of the value, and an unclosed brace, where Python cannot see where the insertion ends. The practice takes the name from input(), so retyping the answer by hand will not work",
        "New lesson \"Interpolation: expressions and len() in braces\": the whole expression inside the braces is computed — f\"{a + b}\" gives the sum, and for txt = \"це текст\" the line print(f\"довжина тексту - {len(txt)}\") gives 8; the quotes inside the braces must not match the quotes wrapping the string, so a long call is better lifted into a variable above",
        "The task of the second lesson reads three input lines — a word and two numbers — and checks both the length and the sum, so a hard-coded answer passes only the first of three tests",
        "The Basics chapter grew to 27 lessons, the whole course now has 36"
      ],
      tr: [
        "Satıra gömme dersi ikiye bölündü. Birincisi \"Satıra gömme: yalnızca değişkenler\": f-dizesinin küme parantezinin içine yalnızca değişkenin adı yazılır — f\"Merhaba, {name}!\" — f ön eki de tüm satırın en ilk tırnağından önce durur",
        "Aynı ders iki tipik hatayı da sayıyor: unutulan f, o zaman satır aynen, değer yerine adla yazdırılır; kapanmayan parantez, o zaman Python eklemenin nerede bittiğini göremez. Alıştırma adı input() ile okur, bu yüzden yanıtı elle yazmak işe yaramaz",
        "Yeni ders \"Satıra gömme: parantezde ifade ve len()\": parantez içinde tüm ifade hesaplanır — f\"{a + b}\" toplamı verir, txt = \"це текст\" ise print(f\"довжина тексту - {len(txt)}\") satırı 8 verir; parantez içindeki tırnaklar dizgeyi saran tırnaklarla aynı olmamalı, bu yüzden uzun çağrıyı yukarıda bir değişkene almak daha iyi",
        "İkinci dersin görevi üç giriş satırı okur — bir sözcük ve iki sayı — hem uzunluğu hem toplamı denetler; bu yüzden baştan yazılmış yanıt üç testin yalnızca birincisini geçer",
        "Temeller bölümü 27 derse büyüdü, tüm kurs artık 36 ders"
      ]
    },
    "26.10.91": {
      uk: [
        "Тему екранування розбито на три уроки. Перший — «Екранування лапок»: лапка для Python не звичайний символ, а межа рядка, тому «Він каже: \"Привіт\"» у подвійних лапках без слеша зупиняє програму на SyntaxError; справжню лапку в тексті пишуть зворотним слешем попереду",
        "Там само пояснюють альтернативи: текст із подвійними лапками можна взяти в одинарні й навпаки, можна порізати на шматки та склеїти через +. Є й рядок, де є і лапки, і апострофи, — там одну пару доведеться екранувати, і саме тому екранування коротше й надійніше за дроблення",
        "Новий урок «Новий рядок і табуляція»: комбінації `\\n` і `\\t` — у коді два знаки, а в рядку один символ; текст звичайними лапками не перенести (SyntaxError: unterminated string literal), для цього є потрійні лапки, а порожній `print()` — той самий розрив без тексту",
        "Новий урок «Зворотний слеш у шляхах»: слеш сам потребує екранування, тому `\"C:\\new\"` розпадається на два рядки — комбінація `\\n` уже означає розрив. Коротша дорога — `r\"...\"`, «сирий» рядок із префіксом r; у ньому, щоправда, не можна закінчити шлях одним слешем",
        "Розділ «Основи» виріс до 26 уроків, увесь курс — 35"
      ],
      en: [
        "The escaping topic is split into three lessons. The first — \"Escaping quotes\": for Python a quote is not an ordinary character but the border of a string, so `He says: \"Hello\"` inside double quotes without a backslash stops the program with SyntaxError; a real quote in the text is written with a backslash in front",
        "The same lesson covers the alternatives: text with double quotes can be wrapped in single ones and the other way round, or cut into pieces and joined with +. There is also a line holding both quotes and apostrophes — one pair still has to be escaped, which is exactly why escaping is shorter and safer than splitting",
        "New lesson \"New line and tab\": the `\\n` and `\\t` pairs — two signs in the code, one character in the string; text cannot be wrapped across ordinary quotes (SyntaxError: unterminated string literal), triple quotes do that, and an empty `print()` is the same break without text",
        "New lesson \"Backslashes in paths\": the backslash itself needs escaping, so `\"C:\\new\"` falls apart into two lines — the `\\n` pair already means a break. The shorter road is `r\"...\"`, a raw string with the r prefix, though it cannot end with a single backslash",
        "The Basics chapter grew to 26 lessons, the whole course now has 35"
      ],
      tr: [
        "Kaçış konusu üç derse bölündü. Birincisi \"Tırnak kaçışı\": Python için tırnak sıradan bir işaret değil, satırın sınırıdır; bu yüzden çift tırnak içindeki `O der ki: \"Merhaba\"`, başında ters bölü olmadan programı SyntaxError ile durdurur — metindeki gerçek tırnağın önüne ters bölü konur",
        "Aynı ders başka yolları da anlatıyor: çift tırnaklı metni tek tırnağa (veya tersine) almak, ya da parçalara bölüp + ile birleştirmek mümkün. Hem tırnak hem kesme işareti bulunan bir satırda ise bir çifti yine kaçırman gerekir — işte bu yüzden kaçış, parçalamadan daha kısa ve daha güvenlidir",
        "Yeni ders \"Yeni satır ve sekme\": `\\n` ve `\\t` çiftleri — kodda iki işaret, dizgede tek karakter; metni sıradan tırnakla satırlara bölemezsin (SyntaxError: unterminated string literal), onun için üçlü tırnak var, boş `print()` ise metinsiz aynı satır kırımı",
        "Yeni ders \"Yollarda ters bölü\": ters bölünün kendisi de kaçış ister, bu yüzden `\"C:\\new\"` iki satıra dağılır — `\\n` çifti zaten satır kırımı demek. Kısa yol `r\"...\"`, yani r ön ekli ham dizge; yalnız onun tek ters bölüyle bitmesine izin verilmiyor",
        "Temeller bölümü 26 derse büyüdü, tüm kurs artık 35 ders"
      ]
    },
    "26.10.90": {
      uk: [
        "Урок «Коди символів» позбувся двозначності: замість «код символу B», який можна прочитати двома алфавітами, тепер «код першої літери англійського слова BALL» — це 66, а схожа на вигляд українська «В» дає 1042 і перевірку не проходить",
        "Теорія того самого уроку тепер прямо каже: без назви алфавіту в умові один і той самий на вигляд символ має дві різні відповіді, бо літери з різних письм живуть у таблиці за окремими номерами",
        "Новий урок «Велика й мала: різниця 32»: `ord(\"A\")` — 65, а `ord(\"a\")` — 97, тож регістр перемикають арифметикою (`chr(ord(\"p\") - 32)`); у кирилиці крок той самий, хіба що є винятки на кшталт «Є» (1028) проти «є» (1108)",
        "Новий урок «Літери-двійники: якою мовою?»: англійська та українська пари — A (65) проти А (1040), C (67) проти С (1057), E (69) проти Е (1045), P (80) проти Р (1056) — вигляд той самий, коди різні; у задачі алфавіт задано словом (АБЕТКА проти APPLE), тому символ можна просто скопіювати",
        "Новий урок «Емодзі теж мають коди»: `ord(\"😀\")` — 128512, `chr(128512)` повертає усмішку, а номери емодзі раптом у сотнях тисяч; той, що більший за 65535, у деяких форматах записують двома половинками, тому стара консоль показує замість усмішки порожній квадратик",
        "Розділ «Основи» виріс до 24 уроків, увесь курс — 33"
      ],
      en: [
        "The \"Character codes\" lesson lost its ambiguity: instead of \"the code of the character B\", which two alphabets can answer, it now asks for \"the code of the first letter of the English word BALL\" — that is 66, while the look-alike Ukrainian «В» gives 1042 and fails the check",
        "The same lesson's theory now says it outright: without a named alphabet in the task, one and the same sign has two different answers, because letters from different scripts live on separate numbers in the table",
        "New lesson \"Upper and lower: 32 apart\": `ord(\"A\")` is 65 and `ord(\"a\")` is 97, so case is switched by arithmetic (`chr(ord(\"p\") - 32)`); Cyrillic takes the same step, except for exceptions such as «Є» (1028) against «є» (1108)",
        "New lesson \"Look-alike letters: which language?\": English-Ukrainian pairs — A (65) vs А (1040), C (67) vs С (1057), E (69) vs Е (1045), P (80) vs Р (1056) — identical look, different codes; the task pins the alphabet with a word (АБЕТКА vs APPLE), so the sign can simply be copied",
        "New lesson \"Emoji have codes too\": `ord(\"😀\")` is 128512, `chr(128512)` returns the smiley, and emoji numbers sit in the hundred thousands; anything above 65535 is written as two halves in some formats, so an old console shows an empty box instead of the smile",
        "The Basics chapter grew to 24 lessons, the whole course now has 33"
      ],
      tr: [
        "\"Karakter kodları\" dersi belirsizlikten kurtuldu: iki alfabenin ayrı yanıt verebildiği \"B karakterinin kodu\" yerine artık \"İngilizce BALL kelimesinin ilk harfinin kodu\" soruluyor — bu 66'dır, aynı görünen Ukraynaca «В» ise 1042 verir ve denetimi geçmez",
        "Aynı dersin teorisi artık açıkça söylüyor: soruda alfabe adıyla verilmeyince tek işaretin iki farklı cevabı olur, çünkü farklı yazıların harfleri tabloda ayrı numaralarda durur",
        "Yeni ders \"Büyük ve küçük: 32 fark\": `ord(\"A\")` 65, `ord(\"a\")` 97 — yani büyük/küçük aritmetikle değişir (`chr(ord(\"p\") - 32)`); Kirilcede adım aynı, «Є» (1028) ve «є» (1108) gibi istisnalar hariç",
        "Yeni ders \"İkiz harfler: hangi dille?\": İngilizce-Ukraynaca çiftler — A (65) ile А (1040), C (67) ile С (1057), E (69) ile Е (1045), P (80) ile Р (1056) — görünüm aynı, kodlar farklı; soruda alfabe bir kelimeyle sabit (АБЕТКА ile APPLE), o yüzden işareti doğrudan kopyalayabilirsin",
        "Yeni ders \"Emoji'nin de kodu var\": `ord(\"😀\")` 128512, `chr(128512)` gülümsemeyi geri verir ve emoji numaraları yüz binlerdedir; 65535'ten büyüğü bazı biçimlerde iki parçayla yazılır, bu yüzden eski bir konsol gülümseme yerine boş kutu gösterir",
        "Temeller bölümü 24 derse büyüdü, tüm kurs artık 33 ders"
      ]
    },
    "26.10.89": {
      uk: [
        "Новий урок «Незакрита дужка та лапка» — одразу після читання помилок: незакрита `(` дає `SyntaxError: '(' was never closed`, незакрита лапка — `SyntaxError: unterminated string literal`, і в обох випадках програма зупиняється ще до першої команди",
        "Приклад в уроці навмисно зламаний: один дотик «Запуск» показує справжнє повідомлення Python із номером рядка, а не умовний опис",
        "У задачі два злами поспіль — у першому рядку не закрито дужку, у другому лапку; виправляти треба послідовно, бо поки обидва не закриті, код далі не йде",
        "Фінал вишуканіший за просте «зроби, щоб працювало»: учень дописує рядок із назвою типу помилки, тож правильний вивід — привіт, світ і SyntaxError",
        "Хитрощів тут немає: зламаний код не друкує нічого, три рядки виводу з'являються лише тоді, коли обидва рядки виправлені й жоден не викинутий",
        "Картка `SyntaxError` у Пайтончика тепер називає обидва повідомлення й нагадує, що програма стає ще до першої команди"
      ],
      en: [
        "New lesson \"Unclosed bracket and quote\" right after reading error messages: an unclosed `(` gives `SyntaxError: '(' was never closed`, an unclosed quote gives `SyntaxError: unterminated string literal`, and in both cases the program stops before the very first command",
        "The example in the lesson is broken on purpose: one tap on Run shows the real Python message with its line number instead of an invented description",
        "The task has two breakages in a row — the first line misses its bracket, the second its quote — and they must be repaired in order, because the code goes nowhere until both are closed",
        "The finish is subtler than a plain \"make it work\": the student adds a line naming the error type, so the correct output is привіт, світ and SyntaxError",
        "There is no way to fake it: broken code prints nothing, so the three output lines only appear when both lines are fixed and neither has been deleted",
        "Pychik's `SyntaxError` card now names both messages and reminds you that the program halts before the first command"
      ],
      tr: [
        "Yeni ders \"Kapatılmamış parantez ve tırnak\", hata mesajı okumanın hemen ardından: kapatılmamış `(` → `SyntaxError: '(' was never closed`, kapatılmamış tırnak → `SyntaxError: unterminated string literal`; her iki durumda program daha ilk komuttan önce durur",
        "Dersin örneği bilerek bozuk: bir kez Çalıştır'a dokununca uydurma açıklama değil, Python'ın gerçek mesajı satır numarasıyla görünür",
        "Soruda arka arkaya iki kırık var — birinci satırın parantezi, ikincinin tırnağı kapanmamış; ikisi de kapatılana kadar kod ilerlemez, bu yüzden sırayla düzeltmek gerekir",
        "Bitiş sıradan \"çalışır hâle getir\" isteminden daha kıvrak: öğrenci hata türünün adını yazan bir satır ekliyor, doğru çıktı привіт, світ ve SyntaxError",
        "Hile yolu yok: bozuk kod hiçbir şey yazdırmaz, üç çıktı satırı ancak iki satır da düzeltilip hiçbiri silinirse görünür",
        "Pychik'in `SyntaxError` kartı artık her iki mesajı da adıyla söylüyor ve programın ilk komuttan önce durduğunu hatırlatıyor"
      ]
    },
    "26.10.88": {
      uk: [
        "Урок про відступи переписано без циклів: учні їх ще не проходили, тож приклад і задача — без `for`, і пояснюється лише одне: зайвий пробіл на початку рядка зупиняє програму з `IndentationError: unexpected indent`",
        "Задача стала зворотньою до попередньої: три рядки вже зайво зсунуті вправо, і їх треба повернути до лівого краю. Провернути можна й частковий ремонт — позначено рядок, де відступ лишився",
        "Друга половина уроку показує, що всередині рядка пробіли нічого не міняють: `print( 2 + 3 )` і `print(2+3)` дають те саме 5, — там відступ потрібен лише для читабельності",
        "Поняття блоку відкладено до кращих часів: урок прямо каже, що рядки після двокрапки, де відступ обов'язковий, чекають на уроки про умову та цикл",
        "Урок «Умови (if / else)» нарешті називає блок своїм ім'ям і вказує на той самий відступ із попереднього уроку, а підказка задачі підказує зсунути рядок на 4 пробіли",
        "Підказка Пайтончика про `IndentationError` тепер розрізняє обидві причини: зайвий відступ у звичайному рядку (прибрати пробіли) і різні відступи в блоці (вирівняти)"
      ],
      en: [
        "The indentation lesson was rewritten without loops: students have not had them yet, so the example and the task work without `for` — only one idea is taught: a stray space at the start of a line stops the program with `IndentationError: unexpected indent`",
        "The task became the reverse of the old one: three lines are already shifted right and you have to bring them back to the left edge. A half-fix is caught too — the checker names the line where an indent is still left",
        "The second half of the lesson shows that spaces inside a line change nothing: `print( 2 + 3 )` and `print(2+3)` both give 5 — there indentation only serves readability",
        "The notion of a block is postponed until better times: the lesson says outright that the lines after a colon, where an indent is required, wait for the lessons on conditions and loops",
        "The \"Conditions (if / else)\" lesson finally names the block and points back to the same indentation from the earlier lesson, and the task hint now tells you to shift the line by 4 spaces",
        "Pychik's `IndentationError` advice now tells the two causes apart: an extra indent on a plain line (delete the spaces) and mismatched indents inside a block (align them)"
      ],
      tr: [
        "Girinti dersi döngüler olmadan yeniden yazıldı: öğrenciler daha görmediği için örnek ve soru `for` içermiyor — tek bir şey anlatılıyor: satır başındaki fazladan boşluk programı `IndentationError: unexpected indent` ile durdurur",
        "Soru eskisinin tersine döndü: üç satır zaten sağa kaydırılmış, onları en sola geri getirmek gerekiyor. Yarım düzeltme de yakalanıyor — denetleyici girintisi kalmış satırı numarasıyla söylüyor",
        "Dersin ikinci yarısı satır içi boşlukların hiçbir şeyi değiştirmediğini gösterir: `print( 2 + 3 )` ile `print(2+3)` aynı 5'i verir — orada girinti yalnızca okunabilirlik içindir",
        "Blok kavramı daha iyi zamana bırakıldı: ders açıkça söylüyor — iki noktadan sonraki satırlarda girinti zorunludur ve onu koşul ile döngü derslerinde göreceksin",
        "\"Koşullar (if / else)\" dersi bloğu sonunda adıyla anıyor ve önceki dersteki aynı girintiye atıf yapıyor; sorunun ipucu artık satırı 4 boşluk kaydırmayı hatırlatıyor",
        "Pychik'in `IndentationError` önerisi artık iki nedeni ayırıyor: düz satırdaki fazladan girinti (boşlukları sil) ve blok içindeki eşitsiz girintiler (eşitle)"
      ]
    },
    "26.10.87": {
      uk: [
        "Новий урок «Спочатку оголоси, потім використовуй»: Python читає код зверху вниз і не знає назв, яких ще не було, тому x = y + 1 без попередньої y дає NameError: name 'y' is not defined",
        "У прикладі уроку програма друкує перший рядок і падає на другому — так видно, що помилка чіпляється не до всього коду, а до конкретного рядка з конкретним ім'ям",
        "У задачі серед шести рядків треба знайти той, що бере значення неоголошеної y, і закоментувати його разом із рядком, який друкував результат — решта коду має запрацювати",
        "Перевірка не пропустить обхідний шлях: якщо замість коментаря домалювати y = 0 чи спростити формулу, вивід стане іншим і задача не зарахується",
        "Урок «Коментарі» тепер закінчується містком: коментар не лише пояснює код, а й призупиняє зайвий рядок, щоб повернутися до нього, коли змінна з'явиться"
      ],
      en: [
        "New lesson \"Declare it first, then use it\": Python reads code top to bottom and does not know names that have not appeared yet, so x = y + 1 without a previous y gives NameError: name 'y' is not defined",
        "In the lesson example the program prints the first line and then stops on the second — this shows that an error clings to one specific line and one specific name, not to the whole file",
        "The task asks you to find, among six lines, the one that reads the undeclared y and comment it out together with the line that printed its result, so the rest of the code runs",
        "The check blocks the way around it: adding y = 0 or simplifying the formula instead of commenting changes the output, and the task will not be accepted",
        "The \"Comments\" lesson now ends with a bridge: a comment not only explains code, it also pauses a line you do not need yet, so you can return to it when the variable appears"
      ],
      tr: [
        "Yeni ders \"Önce tanımla, sonra kullan\": Python kodu yukarıdan aşağı okur ve henüz ortaya çıkmamış adları bilmez; bu yüzden önceden tanımlanmamış y ile yazılan x = y + 1, NameError: name 'y' is not defined verir",
        "Dersin örneğinde program ilk satırı yazdırıp ikincide duruyor — böylece hatanın tüm dosyaya değil, belirli bir satıra ve belirli bir ada yapıştığı görülüyor",
        "Soru altı satır arasında tanımsız y'yi okuyan satırı bulmayı ve onun sonucunu yazdıran satırla birlikte yoruma almayı istiyor; kodun kalanı çalışmalı",
        "Denetim dolambaçlı yolu geçirmiyor: yorum yerine y = 0 eklersen ya da formülü kısaltırsan çıktı değişir ve soru kabul edilmez",
        "\"Yorumlar\" dersi artık bir köprüyle bitiyor: yorum yalnız kodu açıklamaz, henüz gerekmeyen satırı askıya da alır; değişken ortaya çıkınca geri dönersin"
      ]
    },
    "26.10.86": {
      uk: [
        "З уроку «Правила назв змінних» прибрано незрозуміле для початківця «перекривання» — тепер це окремий урок «Перекриті назви: print, len, int»",
        "У новому уроці видно, до чого це призводить: приклад показує, що після len = 5 це вже просто число, а задача ламається на TypeError: 'int' object is not callable, поки учень не перейменує свою змінну",
        "Додано ще один урок — «Регістр літер у назвах»: age, Age і AGE — три різні змінні, а латинська a і кирилична а — теж різні назви; задача вчить лагодити NameError саме через регістр",
        "У «Правилах назв» тепер прямо сказано, що список службових слів невичерпний і з рештою ти познайомишся ближче з новими уроками",
        "Суддя після кожної перевірки повертає перекриті вбудовані імена назад, тож зламані вправи більше не псують наступні запуски в тій самій сесії"
      ],
      en: [
        "The confusing beginner term \"shadowing\" is gone from \"Rules for variable names\" — it now has its own lesson, \"Shadowed names: print, len, int\"",
        "The new lesson shows what it leads to: the example reveals that after len = 5 it is just a number, and the task fails with TypeError: 'int' object is not callable until the student renames the variable",
        "Another lesson added — \"Letter case in names\": age, Age and AGE are three different variables, and the Latin a and Cyrillic a are different names too; the task teaches fixing NameError caused by case",
        "\"Rules for variable names\" now says outright that the list of reserved words is not exhaustive and the rest will come in later lessons",
        "The judge gives shadowed built-in names back after every check, so a broken exercise no longer spoils the next runs in the same session"
      ],
      tr: [
        "Yeni başlayanlar için kafa karıştıran \"gölgeleme\" terimi \"Değişken adı kuralları\" dersinden çıkarıldı — artık \"Gölgede kalan adlar: print, len, int\" adıyla ayrı bir ders",
        "Yeni ders neye yol açtığını gösteriyor: örnekte len = 5 yazıldıktan sonra bunun yalnızca bir sayı olduğu görülüyor, soru ise öğrenci değişkeni yeniden adlandırana kadar TypeError: 'int' object is not callable ile düşüyor",
        "Bir ders daha eklendi — \"Adlarda büyük-küçük harf\": age, Age ve AGE üç ayrı değişkendir, üstelik Latin a ile Kiril a da farklı adlardır; soru harf büyüklüğünden doğan NameError düzeltmeyi öğretiyor",
        "\"Değişken adı kuralları\" artık ayrılmış söz listesinin tükenmez olduğunu ve kalanıyla sonraki derslerde tanışacağını açıkça söylüyor",
        "Denetleyici her denemeden sonra gölgelenen yerleşik adları geri veriyor; bozuk bir alıştırma artık aynı oturumdaki sonraki çalıştırmaları bozmuyor"
      ]
    },
    "26.10.85": {
      uk: [
        "Урок «Рядки» розбито на три окремі: «Рядки: тип str і склеювання», «Довжина рядка: len()» та «Множення рядка на число» — кожен зі своєю теорією, прикладом і задачею",
        "У нових уроках перші рядки коду вже написані за тебе (a = input(), b = input()), тож не треба одразу вигадувати зчитування — одразу йдеться про склейку, довжину чи множення",
        "Пояснено, що текст у Python має тип str, що лапки існують лише в коді та не рахуються, а len() рахує кожен символ, навіть пробіл; результат len() — звичайне число",
        "Пояснено множення рядка на число: \"ab\" * 3 — три копії підряд без пробілів, на 0 виходить порожній рядок, а \"5\" * 2 — це \"55\", а не 10",
        "Приклад уроку показує два рядки з текстом і результат, який із них виходить: redblue, red-blue та <class 'str'>",
        "У кожному з трьох уроків задачу перевіряють три різні тести — зі словом, знаками та пробілом, тому випадковий збіг не пройде"
      ],
      en: [
        "The \"Strings\" lesson is split into three: \"Strings: the str type and joining\", \"String length: len()\" and \"Multiplying a string by a number\" — each with its own theory, example and task",
        "In the new lessons the first lines of code are already written for you (a = input(), b = input()), so you are not asked to invent keyboard input first — you go straight to joining, length or multiplication",
        "It is now explained that text in Python has the type str, that quotes exist only in the code and are not counted, and that len() counts every character, even a space; the result of len() is an ordinary number",
        "Multiplying a string by a number is explained: \"ab\" * 3 is three copies in a row with no spaces, times 0 gives an empty string, and \"5\" * 2 is \"55\", not 10",
        "The lesson example shows two strings holding text and the result you get from them: redblue, red-blue and <class 'str'>",
        "Each of the three tasks is checked by three different tests — a word, symbols and a phrase with a space — so a lucky coincidence won't pass"
      ],
      tr: [
        "\"Dizeler\" dersi üç ayrı derse bölündü: \"Dizeler: str türü ve birleştirme\", \"Dize uzunluğu: len()\" ve \"Dizeyi sayıyla çarpma\" — her biri kendi teorisi, örneği ve sorusuyla",
        "Yeni derslerde ilk satırlar senin için zaten yazılmış (a = input(), b = input()); önce klavye okumasını uydurman istenmiyor — doğrudan birleştirme, uzunluk veya çarmaya geçiyorsun",
        "Artık açıklanıyor: Python'da metin str türündedir, tırnaklar yalnızca kodda durur ve sayılmaz, len() ise boşluk dahil her karakteri sayar; len() sonucu sıradan bir sayıdır",
        "Dizeyi sayıyla çarpma açıklanıyor: \"ab\" * 3 aralarında boşluk olmadan üç kopya, 0 ile çarpınca boş dize çıkar, \"5\" * 2 ise 10 değil \"55\"tir",
        "Dersin örneği metin içeren iki dizeyi ve onlardan çıkan sonucu gösteriyor: redblue, red-blue ve <class 'str'>",
        "Üç sorunun her biri üç farklı testle denetleniyor — bir sözcük, işaretler ve boşluklu bir ifade — yani şansa eşleşme geçmez"
      ]
    },
    "26.10.84": {
      uk: [
        "У курсі «Перетворення типів» переставлено після уроку `input()`: тепер учень уже вміє зчитувати з клавіатури, тож перевірка стає справжньою",
        "Задача на перетворення типів більше не чітиться: значення зчитується через `input()`, а перевірка проганяє три різні вводи (12, 7 і 30), тому написати заздалегідь `print(24)` і `print(\"1212\")` уже не вийде",
        "В уроці про `input()` прибрано незрозуміле «повертає рядок»: пояснено, що навіть набрані 25 — це для програми два символи, \"2\" і \"5\", як у print(\"25\"), і тому текст спершу треба перетворити на число"
      ],
      en: [
        "In the course, \"Type conversion\" now comes after the `input()` lesson: the student already knows how to read from the keyboard, so the check becomes a real one",
        "The type-conversion task can no longer be cheated: the value is read with `input()` and the checker runs three different inputs (12, 7 and 30), so hardcoding `print(24)` and `print(\"1212\")` stops working",
        "The `input()` lesson drops the confusing \"returns a string\": it now explains that even typing 25 gives the program two characters, \"2\" and \"5\", just like print(\"25\"), so the text has to become a number first"
      ],
      tr: [
        "Kursta \"Tür dönüştürme\" artık `input()` dersinden sonra geliyor: öğrenci klavyeden okumayı çoktan bildiği için denetim gerçek oluyor",
        "Tür dönüştürme sorusu artık kopyayla geçilemiyor: değer `input()` ile okunuyor ve denetleyici üç farklı girdi (12, 7 ve 30) çalıştırıyor, yani baştan `print(24)` ile `print(\"1212\")` yazmak işe yaramıyor",
        "`input()` dersindeki muğlak \"bir dize döndürür\" ifadesi kaldırıldı: artık 25 yazsan bile programın iki karakter, \"2\" ve \"5\" aldığı — tıpkı print(\"25\") gibi — ve bu yüzden metnin önce sayıya dönüştüğü anlatılıyor"
      ]
    },
    "26.10.83": {
      uk: [
        "Музична панель більше не приклеєна до нижнього краю: за замовчуванням вона стоїть помітно вище, щоб не закривати кнопку Пайтончика й нижню частину сторінки",
        "Плеєр тепер можна перетягнути будь-куди — схопивши за шапку з назвою треку. Курсор підказує «ховай», а підказка в шапці пояснює жест",
        "Обрана позиція запам'ятовується: після перезавантаження сайту та після закриття й нового відкриття панель стає туди, куди ти її поставив",
        "Подвійний клік по шапці повертає панель на типове місце, а зміна розміру вікна не випускає її за межі екрана",
        "На телефоні панелі залишено звичну нижню позицію на всю ширину — там переміщення вимкнено, щоб не заважати гортанню"
      ],
      en: [
        "The music panel is no longer glued to the bottom edge: by default it sits noticeably higher, so it stops covering the Pychik button and the lower part of the page",
        "The player can now be dragged anywhere — grab it by the header with the track title. The cursor hints \"hold\", and the header tooltip explains the gesture",
        "The chosen position is remembered: after reloading the site and after closing and reopening, the panel returns to where you put it",
        "A double-click on the header returns the panel to its default place, and resizing the window never lets it escape off screen",
        "On phones the panel keeps its familiar full-width bottom spot — dragging is disabled there so it never fights your scrolling"
      ],
      tr: [
        "Müzik paneli artık alt kenara yapışık değil: varsayılan olarak belirgin biçimde yukarıda duruyor, böylece Pychik düğmesini ve sayfanın alt kısmını kapatmıyor",
        "Oynatıcı artık istediğin yere sürüklenebiliyor — şarkı adının bulunduğu başlıktan tut. İmleç \"tut\" ipucu veriyor, başlıktaki açıklama hareketi anlatıyor",
        "Seçtiğin konum hatırlanıyor: siteyi yeniden yükleyince ya da paneli kapatıp açınca onu bıraktığın yere geri geliyor",
        "Başlığa çift tıklayınca panel yerine dönüyor; pencereyi yeniden boyutlandırınca panel ekranın dışına kaçmıyor",
        "Telefonda panel alıştığı alt ve tam geniş konumunda kalıyor — orada sürükleme kapalı, kaydırmaya engel olmasın"
      ]
    },
    "26.10.82": {
      uk: [
        "Картка уроку в курсі нарешті дихає: текст більше не лежить упритул до рамки — картка дістала внутрішній відступ, зліва найбільший",
        "Рядки теорії та умови задачі стали коротшими: замість ~140 символів у рядок тепер близько 70, і текст став помітно легшим для ока",
        "Приклад коду й поле практики отримали свою межу ширини, а між собою вони вирівняні в один стовпчик"
      ],
      en: [
        "The lesson card in the course finally breathes: text no longer lies flush against the frame — the card gained inner padding, largest on the left",
        "Theory and task lines got shorter: instead of ~140 characters per line there are now about 70, which is noticeably easier on the eye",
        "The code example and the practice field each got their own width limit, and the two line up in a single column"
      ],
      tr: [
        "Kursdaki ders kartı sonunda nefes alıyor: metin artık çerçeveye yapışık değil — kartın iç boşluğu arttı, solda en geniş haliyle",
        "Kuram ve soru satırları kısaldı: satır başına ~140 yerine artık ~70 karakter var, bu da gözü belirgin biçimde yormuyor",
        "Kod örneği ve alıştırma alanı kendi genişlik sınırını aldı; ikisi tek bir sütunda hizalanıyor"
      ]
    },
    "26.10.81": {
      uk: [
        "Урок «Літерали» в курсі тепер реально вчить виводити текст: приклад починається з `print(\"hello\")`, а в теорії пояснено, чому на екрані з'являється `hello` без лапок",
        "Завдання до уроку стало повнішим: чотири літерали замість трьох — текст `hello`, ціле `42`, дійсне `3.14` і логічне `True`, тож рядок у лапках теж треба перевірити на практики"
      ],
      en: [
        "The \"Literals\" lesson now really teaches printing text: the example opens with `print(\"hello\")`, and the theory explains why the screen shows `hello` without the quotes",
        "The exercise got fuller: four literals instead of three — the text `hello`, the integer `42`, the float `3.14` and the boolean `True` — so a quoted string has to pass the checker too"
      ],
      tr: [
        "Kursdaki \"Literal\" dersi artık metin yazdırmayı gerçekten öğretiyor: örnek `print(\"hello\")` ile açılıyor ve kuramsal bölüm ekrana tırnaksız `hello` gelmesini açıklıyor",
        "Alıştırmaya bir literal daha eklendi: dört literal — `hello` metni, tam sayı `42`, ondalık `3.14` ve mantıksal `True` — böylece tırnaklı dize de denetleyiciden geçiyor"
      ]
    },
    "26.10.80": {
      uk: [
        "Музична панель отримала новий інтерфейс: обкладинка, назва треку й автор тепер в одному рядку зверху, а не великим банером, і весь плеєр став помітно компактнішим",
        "Керування злилось в один ряд — перемішування, попередній, пуск/пауза, наступний і повтор; дві рознесені смуги кнопок більше немає",
        "Плейлист дістав номери треків, заголовок і лічильник. На рядку, що грає, номер перетворюється на живі смужки еквалайзера; наведення мишею показує те саме",
        "Гучність нарешті всередині плеєра: повзунок із відсотками, тож більше не треба лізти в Налаштування",
        "Прогрес і гучність малюють заповнення градієнтом, час став моноширинним, а смужки завмирають на паузі й поважають уподобання «менше руху»",
        "Плеєр можна згорнути стрілкою вгорі: лишаються обкладинка, прогрес і кнопки, щоб панель не закривала тобі код"
      ],
      en: [
        "The music panel has a new interface: the cover, track title and artist now sit in one row at the top instead of a big banner, and the whole player got noticeably more compact",
        "Controls merged into a single row — shuffle, previous, play/pause, next and repeat — the two separate strips of buttons are gone",
        "The playlist gained track numbers, a heading and a counter. On the row that is playing, the number turns into live equalizer bars, and hovering shows the same",
        "Volume finally lives inside the player: a slider with a percentage, so no more digging through Settings",
        "Progress and volume draw their fill as a gradient, the times use a monospace font, and the bars freeze on pause and respect the \"reduce motion\" preference",
        "The player collapses with the arrow on top: cover, progress and buttons stay, so the panel no longer covers your code"
      ],
      tr: [
        "Müzik paneli yeni bir arayüz kazandı: kapak, şarkı adı ve sanatçı artık tepede tek bir satırda duruyor, dev afiş yerine; oynatıcının tamamı belirgin biçimde derleşti",
        "Denetimeler tek satırda birleşti — karıştır, önceki, oynat/duraklat, sonraki ve yinele; iki ayrı düğme şeridi artık yok",
        "Çalma listesi şarkı numaraları, bir başlık ve sayaç kazandı. Çalan satırda numara canlı ekolayzer çubuklarına dönüşüyor; üzerine gelince de aynı şey görünüyor",
        "Ses sonunda oynatıcının içinde: yüzdeli bir kaydırıcı, böylece Ayarlar'a girmeye gerek kalmıyor",
        "İlerleme ve ses dolgusu gradyanla çiziliyor, süreler eşit aralıklı yazı tipiyle; çubuklar duraklatınca donuyor ve \"hareketi azalt\" tercihine saygı duyuyor",
        "Oynatıcı üstteki okla kısalıyor: kapak, ilerleme ve düğmeler kalıyor, böylece panel kodunu kapatmıyor"
      ]
    },
    "26.10.79": {
      uk: [
        "Розділ «Основи» в курсі переписаний з 3 уроків на 15: `print()`, літерали, змінна та її тип, усі дії з числами (+ - * / // % **), перетворення типів, `input()`, рядки, правила назв змінних, коментарі, відступи, читання повідомлень про помилку, `chr()` і `ord()`, екранування символів, f-рядки та параметри `sep`/`end`",
        "Для пунктів, які важко перевірити виводом, задачі побудовані так, що перевірка все одно працює: зламні назви змінних виправляються й код видає 12, зайвий `print` ховається за `#`, тіло циклу отримує відступ і вивід стає 1 2 3 готово, а одруківка в імені лікується NameError-ом у 8",
        "`input()` нарешті працює не лише в перевірці задач: під редактором майданчика з'явилося поле «Ввід для input()». Воно показується, щойно в коді є `input(`, а кожен рядок поля — це один такий виклик. Коли рядки закінчуються, Python дає `EOFError`, як у справжньому терміналі",
        "Той самий крайній випадок більше не вішає вкладку: і в майданчику, і в судді задач `input()` після останнього рядка вичерпується `EOFError`, а не нескінченним порожнім вводом",
        "Уся теорія й усі підказки нових уроків перекладені українською, англійською і турецькою, а приклики «Приклад» носять цілий урок у майданчик одним дотиком",
        "Прогрес не зник: уроки, які ти вже проходив, лишаються пройденими, а нові просто вставили у свій розділ"
      ],
      en: [
        "The \"Basics\" chapter of the course was rewritten from 3 lessons into 15: `print()`, literals, a variable and its type, every numeric operator (+ - * / // % **), type conversion, `input()`, strings, naming rules, comments, indentation, reading error messages, `chr()` and `ord()`, character escaping, f-strings and the `sep`/`end` parameters",
        "Topics that are hard to grade by output were designed so the automatic check still works: broken variable names get fixed and the code prints 12, the extra `print` hides behind `#`, the loop body takes its indent so the output becomes 1 2 3 готово, and a typo in a name is cured into 8",
        "`input()` finally works outside task checking as well: the playground gained an \"Input for input()\" field under the editor. It appears as soon as your code contains `input(`, and each line of it answers one such call. When the lines run out Python raises `EOFError`, exactly like a real terminal",
        "The same edge case no longer freezes the tab: both in the playground and in the task judge, an `input()` after the last provided line ends in `EOFError` instead of an endless stream of empty input",
        "All theory text and hints of the new lessons are translated into Ukrainian, English and Turkish, and the \"Example\" button carries a whole lesson into the playground with one click",
        "Your progress is safe: lessons you already solved stay solved, the new ones just moved into their chapter"
      ],
      tr: [
        "Kursun \"Temeller\" bölümü 3 dersten 15 ders yeniden yazıldı: `print()`, literaller, değişken ve türü, tüm sayı işlemleri (+ - * / // % **), tür dönüştürme, `input()`, dizeler, değişken adı kuralları, yorumlar, girintiler, hata mesajı okuma, `chr()` ve `ord()`, karakter kaçışı, f-dizeleri ve `sep`/`end` parametreleri",
        "Çıktıyla zor değerlendirilen konular denetim yine de çalışacak biçimde tasarlandı: bozuk değişken adları düzeltilip kod 12 basıyor, fazladan `print` bir `#` arkasına saklanıyor, döngü gövdesi girintisini alınca çıktı 1 2 3 готово oluyor ve bir isimdeki yazım yanlışı NameError'dan 8'e dönüştürülüyor",
        "`input()` artık yalnızca görev denetiminde çalışmıyor: oyun alanındaki editörün altına \"input() için girdi\" alanı geldi. Kodda `input(` görür görmez belirir ve onun her satırı bir böyle çağrıyı yanıtlar. Satırlar bitince Python gerçek terminaller gibi `EOFError` verir",
        "Aynı sınır durumu artık sekmeyi dondurmuyor: hem oyun alanında hem görev denetçisinde son satırdan sonraki `input()` bitmez bir boş girdi yerine `EOFError` ile bitiyor",
        "Yeni derslerin tüm kuramı ve ipuçları Ukraynaca, İngilizce ve Türkçe çevrildi; \"Örnek\" düğmesi bir dersi tek dokunuşla oyun alanına taşır",
        "İlerlemen güvende: çözdüğün dersler çözülmüş kalır, yeni dersler yalnızca kendi bölümüne yerleşti"
      ]
    },
    "26.10.78": {
      uk: [
        "Нумерація рядків тепер є і в курсі, і в задачах, і в олімпіадному тренажері — як у майданчику. Довгі рядки, які перенеслися, не збивають номери: висоту кожного рядка міряє невидиме дзеркало",
        "Помилка показує свій ТИП: «IndentationError», «NameError», «SyntaxError» — це мітка в результатах і в рядку статусу, а не обрізаний хвіст трейсбека, де імені помилки як раз і не було",
        "Зайвий відступ на початку рядка нарешті не проковтується мовчки: браузерний Python його виконує, а справжній — ні. Тепер одразу бачиш «IndentationError: несподіваний відступ на початку рядка» і чіп із номером рядка",
        "Чіп «→ 7» біля помилки працює і в курсі, і в задачах: клацаєш — поле прокручується й сам рядок підсвічується",
        "Перевірка відступів іде перед прогоном тестів, тому на помилку у відступі відповіда миттєво, а не через чотири секунди на кожен тест",
        "Дрібниці: відступ у полі редактора рахується після того, як розділ справді став видимим (раніше номери іноді липли до тексту), а статус «Помилка виконання» тепер не ліпить двокрапку після крапки"
      ],
      en: [
        "Line numbers now live in the course, the task bank and the olympiad trainer too, just like in the playground. Long wrapped lines no longer throw the numbers off — an invisible mirror measures every row",
        "Errors finally show their TYPE: \"IndentationError\", \"NameError\", \"SyntaxError\" appear as a badge in the results and in the status line, instead of a truncated traceback tail where the name was exactly the part that got cut",
        "An unexpected indent at the start of a line is no longer swallowed silently: the in-browser Python runs such code, real Python does not. You now get \"IndentationError: unexpected indent at the start of the line\" plus a chip with the line number",
        "The \"→ 7\" chip works in the course and in the tasks as well: one click scrolls the editor and highlights the offending line",
        "Checking indentation before running the tests means an indent mistake answers instantly instead of burning four seconds on every test case",
        "Small stuff: the editor padding is measured once the section is really visible (the numbers used to stick onto the text), and the \"Runtime error\" status no longer jams a colon after a full stop"
      ],
      tr: [
        "Kursta, görevlerde ve olimpiyat eğitimcisinde artık satır numaraları var — oyun alanındaki gibi. Satır alt alta bölünse bile numaralar kaymıyor: her satırın yüksekliği görünmez bir ayna ile ölçülüyor",
        "Hata artık TÜRÜNÜ gösteriyor: \"IndentationError\", \"NameError\", \"SyntaxError\" sonuçlarda ve durum satırında etiket olarak çıkıyor; eskiden tam da adın kesildiği iz yığını kuyruğu kalıyordu",
        "Satır başındaki fazladan girinti artık sessizce yutulmuyor: tarayıcıdaki Python onu çalıştırır, gerçek Python çalıştırmaz. Artık \"IndentationError: satır başında beklenmeyen girinti\" ve satır numaralı düğme görüyorsun",
        "\"→ 7\" düğmesi kursta ve görevlerde de çalışıyor: tek dokunuş editörü kaydırıp ilgili satırı vurguluyor",
        "Girinti testlerden önce denetlendiği için girinti hatası dört saniye beklemeden anında yanıt veriyor",
        "Küçük şeyler: editör boşluğu bölüm gerçekten görünür olduğunda ölçülüyor (numaralar metne yapışıyordu) ve \"Çalışma zamanı hatası\" durumu artık noktadan sonra iki nokta sıkıştırmıyor"
      ]
    },
    "26.10.77": {
      uk: [
        "Під час туру Пайтончика сторінка заблокована: нічого випадково не натиснеш, а сам тур тисне «Запуск», дочекується, доки завантажаться модулі, і лише тоді іде далі",
        "Магазинчик модулів навчився багатовибору: прапорці на картках, «Вибрати видимі» й «Встановити вибране» в одному вікні з прогресом; «раніше встановлював» більше не видається за «готово»",
        "Плитки з цифрами й ряди фільтрів отримали відступи — в магазинчику, у змаганнях і взагалі скрізь, де цифри липли до краю",
        "Ігри: зміна налаштувань під час партії тепер морозить гру з плашкою «Пауза», а кнопка налаштувань є й на картці гри — можна скерувати до старту. Там же «Застосувати й перезапустити»",
        "Пайтончик став розумнішим: він знає про сайт удвічі більше (досягнення, гарячі клавіші, мови, експорт, редактор, музику, акаунт), а в Налаштуваннях → «Пайтончик» з'явився перемикач «Не давати готовий код» і поле для API-ключа хмарного мозку",
        "Профіль рахує «Власні програми» — лише те, що ти сам написав і зберіг, без готових прикладів. У майданчику додалась група «Особисті»: свій код можна відкрити, відредагувати й зберегти ще раз, не плодячи дублів",
        "Дрібниці: вузькі картки (Налаштування, Профіль) нарешті по центру, гортання всередині меню більше не закриває саме меню, а чат Пайтончика не смикає сторінку під собою"
      ],
      en: [
        "While Pythonchik gives the tour the page is locked: nothing gets clicked by accident, and the tour now presses Run itself, waits for the modules to download and only then moves on",
        "The module shop learned multi-selection: checkboxes on cards, \"Select visible\" and \"Install selected\" in one progress window; \"installed before\" no longer pretends to be \"ready\"",
        "Number tiles and filter rows got real padding — in the shop, in contests and everywhere else where digits touched the edge",
        "Games: changing settings mid-round now freezes the game under a \"Paused\" plate, and every game card has a tune button so you can set it up before starting. There's also \"Apply and restart\"",
        "Pythonchik got smarter: he knows twice as much about the site (achievements, hotkeys, languages, export, editor, music, account), and Settings → \"Pythonchik\" now holds a \"Never hand out ready-made code\" switch plus a field for a cloud-brain API key",
        "The profile counts \"Own programs\" — only what you wrote and saved yourself, ready-made examples excluded. The playground gained an \"Personal\" group: open your code, edit it, save it again without spawning duplicates",
        "Small stuff: narrow cards (Settings, Profile) are finally centred, scrolling inside a menu no longer closes the menu, and Pythonchik's chat stopped dragging the page under itself"
      ],
      tr: [
        "Pythonchik turu gösterirken sayfa kilitli: yanlışlıkla hiçbir şeye basılmaz; tur artık Çalıştır'a kendisi basıyor, modüllerin inmesini bekliyor ve ondan sonra devam ediyor",
        "Modül dükkanı çoklu seçimi öğrendi: kartlarda işaret kutuları, \"Görünürleri seç\" ve tek ilerleme penceresinde \"Seçilenleri kur\"; \"daha önce kurulmuştu\" artık \"hazır\" gibi görünmüyor",
        "Rakam kutuları ve filtre satırları nefes aldı — dükkanlarda, yarışmalarda ve rakamın kenara yapıştığı her yerde",
        "Oyunlar: parti sırasında ayar değiştirmek oyunu \"Duraklatıldı\" levhasıyla donduruyor; oyun kartlarında da bir ayar düğmesi var, böylece başlamadan önce ayarlayabilirsin. Ayrıca \"Uygula ve yeniden başlat\"",
        "Pythonchik akıllandı: site hakkında iki kat fazla şey biliyor (başarımlar, kısayol tuşları, diller, dışa aktarma, editör, müzik, hesap) ve Ayarlar → \"Pythonchik\" içinde \"Hazır kod verme\" anahtarı ile bulut beyni API anahtarı alanı var",
        "Profil artık \"Kendi programlarım\" sayıyor — yalnızca kendinin yazıp kaydettiğin programlar, hazır örnekler hariç. Oyun alanında \"Kişisel\" grubu açıldı: kodu açıp düzenleyebilir, çoğaltmadan tekrar kaydedebilirsin",
        "Küçük şeyler: dar kartlar (Ayarlar, Profil) sonunda ortalanıyor, menü içinde kaydırmak menüyü kapatmıyor, Pythonchik sohbeti alttaki sayfayı artık sürüklemiyor"
      ]
    },
    "26.10.76": {
      uk: [
        "У Пайтончика з'явився власний мозок: він розмовляє («привіт», «бувай», «дякую», «як справи», «розкажи жарт»), рахує («скільки буде 17*3», «10 відсотків від 250», «корінь з 144», «НСД 12 і 18») і пише цілі програмки на попит — усе офлайн, без жодного API та хмари",
        "Він слухає команди й сам їх виконує: «відкрий курс», «перейди в ігри», «зміни мову на англійську», «вимкни звук», «що нового», «який мій прогрес»",
        "Команда «покажи тур» запускає автопілот просто з чату; у шапці панелі — кнопка-компас, а першим чіпом лізе «Показати тур»",
        "Одруківки та криві формулювання більше не глухий кут: «паліндроом», «цикл фоз» чи «вiтаю» навіть з латинською «і» — Пайтончик сам здогадується, що ти мав на увазі",
        "Довідні відповіді тепер із поясненням «Чому так», а згенерований код одразу потрапляє у редактор — залишається натиснути «Запуск»",
        "Розмова має пам'ять: «не зрозумів», «чому», «складніше», «покажи код», «далі» стосуються саме останньої теми, а «мене звати Оксана» — запам'ятається",
        "Турецькі репліки мозку поки що англійською — власні тексти у наступному оновленні"
      ],
      en: [
        "Pythonchik grew his own brain: he chats (\"hi\", \"bye\", \"thanks\", \"how are you\", \"tell a joke\"), calculates (\"what's 17*3\", \"10% of 250\", \"sqrt of 144\", \"GCD of 12 and 18\") and writes whole little programs on request — all offline, no API, no cloud",
        "He follows commands and acts on them: \"open the course\", \"go to games\", \"switch to English\", \"mute sound\", \"what's new\", \"how is my progress\"",
        "\"Show the tour\" starts the autopilot straight from the chat; the panel header gained a compass button and the first chip is \"Show the tour\"",
        "Typos and clumsy phrasing are no longer a dead end: \"palindrom\", \"cicl foz\" or \"вiтаю\" typed with a Latin \"i\" — he guesses what you meant",
        "Explanations now come with a \"Why this way\" note, and the generated code lands in the editor — all that's left is to hit Run",
        "The conversation has memory: \"not clear\", \"why\", \"harder\", \"show code\", \"next\" refer to the last topic, and \"my name is Oksana\" is remembered",
        "Turkish replies from the brain are in English for now — their own texts come next"
      ],
      tr: [
        "Pythonchik kendi beynine kavuştu: sohbet ediyor (\"merhaba\", \"hoşça kal\", \"teşekkürler\", \"nasılsın\", \"fıkra anlat\"), hesaplıyor (\"17*3 kaç\", \"250'nin %10'u\", \"144'ün karekökü\", \"12 ve 18'in EBOB'u\") ve istenince tam programcıklar yazıyor — hepsi çevrim dışı, bulut yok",
        "Komutları dinleyip kendisi yapıyor: \"kursu aç\", \"oyunlara git\", \"dili İngilizce yap\", \"sesi kapat\", \"yenilikler ne\", \"benim ilerlemem nasıl\"",
        "\"Tur göster\" otomatik turu doğrudan sohbetten başlatıyor; panel başlığına pusula düğmesi eklendi, ilk öneri de \"Tur göster\"",
        "Yazım hataları artık çıkmaz değil: \"palindrom\", \"cicl foz\" ve Latince \"i\" ile yazılan \"вiтаю\" — ne demek istediğini kendisi buluyor",
        "Açıklamalar artık \"Neden böyle\" notuyla geliyor, üretilen kod doğrudan düzenleyiciye düşüyor — yalnızca Çalış'a basmak kalıyor",
        "Sohbetin belleği var: \"anlamadım\", \"neden\", \"daha zor\", \"kodu göster\", \"devam\" son konuya döner; \"benim adım Oksana\" da hatırlanıyor",
        "Beynin Türkçe yanıtları şimdilik İngilizce — kendi metinleri sırada"
      ]
    },
    "26.10.75": {
      uk: [
        "Після справжнього переходу сторінка тепер підкручується до підсвіченого елемента — на телефоні спотлайт більше не залишається за краєм екрана",
        "Підсвітка супроводжує елемент усі 12 кроків: лапка завжди цілиться туди, що справді видно, а не в порожнечу"
      ],
      en: [
        "After a genuine page switch the page now scrolls to the highlighted element, so on a phone the spotlight no longer ends up off-screen",
        "The spotlight ran the full 12 steps: the paw always aims at something you can actually see, never at empty space"
      ],
      tr: [
        "Gerçek sayfa geçişinden sonra sahne ışıklı öğeye kaydırılıyor — artık telefonda spot ekranın kenarında dışarıda kalmıyor",
        "Işık 12 adımın tamamında izlendi: pati her zaman gerçekten gördüğün bir şeye nişan alıyor, boşluğa değil"
      ]
    },
    "26.10.74": {
      uk: [
        "Кнопка «Почати тур» в онбордингу тепер передає естафету Пайтончику: він сам веде тебе всіма розділами з підсвіткою й справжніми кліками",
        "На телефоні Пайтончик сам розкриває шторку «Ще» й показує лапкою на кожен пунктик меню, який сховався за нижньою панеллю",
        "Після кожного переходу підсвітка їде за новим елементом, тому лапка не цілиться в порожнечу",
        "«Пропустити» в онбордингу тепер чесно пропускає і тур Пайтончика — без двох навчань одразу"
      ],
      en: [
        "The \"Start the tour\" button in onboarding now hands the wheel to Pythonchik: he leads you through every section himself, with the spotlight and genuine clicks",
        "On a phone Pythonchik opens the \"More\" sheet on his own and points his paw at each menu item hidden behind the bottom bar",
        "After every page switch the spotlight follows the new element, so the paw never aims at empty space",
        "\"Skip\" in onboarding now honestly skips Pythonchik's tour too — no two lessons in a row"
      ],
      tr: [
        "Karşılamadaki \"Turu başlat\" düğmesi artık direksiyonu Pythonchik'e devrediyor: her bölümü kendisi, ışıklı çerçeveyle ve gerçek tıklayışlarla gezdiriyor",
        "Telefonda Pythonchik \"Daha\" perdesini kendisi açıyor ve alt çubuğun ardına saklanan her menü ögesine patisiyle işaret ediyor",
        "Her sayfa değişiminde ışık yeni öğenin peşine düşüyor, böylece pati boşluğa hedef almıyor",
        "Karşılamadaki \"Geç\" artık Pythonchik'in turunu da atlıyor — üst üste iki eğitim yok"
      ]
    },
    "26.10.73": {
      uk: [
        "Тур сайту став автопілотом: Пайтончик сам повзе екраном від елемента до елемента й справді натискає пункти меню — перехід відбувається по-справжньому",
        "Активний елемент обводиться підсвіткою, а решта екрана легенько затемнюється, тому очі не блукають",
        "Пайтончик цілиться власною лапкою просто в ціль, а імітацію кліку позначає кільцем, що розростається",
        "Репліки тепер у форматі коміксової бульбашки з гумором про Python; поряд кнопки «назад», «Далі» й пауза автопілота, а критися можна будь-коли клавішею Escape",
        "У Налаштуваннях з'явилася кнопка «Повторити туторіал» — якщо хочеш ще раз"
      ],
      en: [
        "The site tour is now an autopilot: Pythonchik crawls the screen from element to element and really clicks the menu items — the page switch is genuine",
        "The active element gets a spotlight outline while the rest of the screen dims slightly, so your eyes don't wander",
        "Pythonchik aims its own paw straight at the target and marks the simulated click with an expanding ring",
        "Lines are delivered in a comic speech bubble with Python humour, next to Back, Next and an autopilot pause button; Escape quits at any moment",
        "Settings gained a \"Replay the tutorial\" button, in case you want another ride"
      ],
      tr: [
        "Site turu artık bir otomatik pilotta: Pythonchik ekranda öğeden öğeye süzülüyor ve menü ögelerine gerçekten tıklıyor — geçiş gerçekten oluyor",
        "Etkin öğenin çevresi ışıkla çevreleniyor, ekranın kalanı hafifçe kararıyor ki gözün başka yere kaymasın",
        "Pythonchik kendi patisini hedefe doğrultuyor ve taklit edilen tıklamayı büyüyen bir halkayla işaretliyor",
        "Sözler Python şakalarıyla bir çizgi roman balonunda geliyor; yanında Geri, İleri ve otomatik pilotu duraklat düğmesi var, istediğin an Escape ile çıkabilirsin",
        "Ayarlar'a \"Tur'u tekrar izle\" düğmesi eklendi — bir daha istersen"
      ]
    },
    "26.10.72": {
      uk: [
        "На сайті оселився Пайтончик — власний помічник із анімованим обличчям у правому нижньому куті",
        "Він відповідає на питання про print, змінні, умови, цикли, списки, словники й функції — без інтернету, усе працює офлайн",
        "Скопіюй текст помилки з консолі в чат: Пайтончик пояснить, що сталося, і підкаже, як виправити",
        "Є тур по сайту: він проводить усіма розділами й показує, де що шукати"
      ],
      en: [
        "Pythonchik has moved in — the site's own helper with an animated face in the bottom-right corner",
        "It answers questions about print, variables, conditions, loops, lists, dicts and functions — with no internet, everything works offline",
        "Paste an error message from the console into the chat: Pythonchik explains what happened and how to fix it",
        "There is a site tour: it walks you through every section and shows where to find what"
      ],
      tr: [
        "Siteye Pythonchik taşındı — sağ alt köşede animasyonlu yüze sahip kendi yardımcısı",
        "print, değişkenler, koşullar, döngüler, listeler, sözlükler ve fonksiyonlar hakkındaki soruları yanıtlıyor — internetsiz, her şey çevrimdışı çalışıyor",
        "Konsoldaki hata metnini sohbete yapıştır: Pythonchik ne olduğunu açıklar ve nasıl düzeltileceğini söyler",
        "Bir de site turu var: tüm bölümleri gezdirir ve neyin nerede olduğunu gösterir"
      ]
    },
    "26.10.71": {
      uk: [
        "У курсі з'явився воротар: наступний урок відкривається лише після розв'язаної практики",
        "Закриті уроки показують замок, а клік по них каже, який саме урок треба пройти спершу",
        "Банк задач потрійнився: по 14 задач у кожному з трьох рівнів замість шести, разом 42",
        "Усі нові задачі прогнано через автоперевірку — кожна проходить власні тести"
      ],
      en: [
        "The course got a gatekeeper: the next lesson opens only after you solve its practice task",
        "Locked lessons show a padlock, and tapping one tells you which lesson to finish first",
        "The task bank has tripled: 14 tasks per level instead of six, 42 in total",
        "Every new task was run through the automatic checker — all of them pass their own tests"
      ],
      tr: [
        "Derse bir kapı bekçisi geldi: sonraki ders yalnızca alıştırması çözülünce açılıyor",
        "Kilitli derslerde asma kilit görünüyor; dokununca önce hangi dersi bitirmen gerektiğini söylüyor",
        "Soru bankası üç katına çıktı: her seviyede altı yerine 14 soru, toplam 42",
        "Yeni soruların hepsi otomatik denetimden geçti — her biri kendi testlerini geçiyor"
      ]
    },
    "26.10.70": {
      uk: [
        "Прибрали зелену бульбку під іконкою активного розділу на телефоні — вона залишалася від старого дизайну «пігулки»",
        "Тепер на вузькому екрані світиться лише сам пункт меню, як і задумано в новому інтерфейсі",
        "У старому дизайні бульбка лишилася: там панель справді плаває, і їй є куди ховатися"
      ],
      en: [
        "Removed the green bubble under the active section icon on the phone — it was left over from the old \"pill\" design",
        "On a narrow screen only the menu item itself now lights up, just as the new interface intends",
        "The old design keeps its bubble: there the panel really does float, so it has room to hide"
      ],
      tr: [
        "Telefonda aktif bölüm simgesinin altındaki yeşil kabarcık kaldırıldı — eski \"hap\" tasarımından kalmıştı",
        "Artık dar ekranda yalnızca menü öğesinin kendisi yanıyor, yeni arayüzün istediği gibi",
        "Eski tasarımda kabarcık kalıyor: orada panel gerçekten yüzen bir yapıda, gizlenecek yeri var"
      ]
    },
    "26.10.69": {
      uk: [
        "Перевірили сайт на справжньому телефоні: автозавантаження модулів працює так само, як на комп'ютері",
        "Нижня навігація більше не повзає за екран: «Додому» й «Python» повернулися на свої місця",
        "Раніше на вузькому екрані перші кнопки зникали ліворуч — дизайн «пігулка» зсував усю панель на півширини",
        "Панель «Ще» з усіма розділами відкривається й на телефоні, і на планшеті однаково"
      ],
      en: [
        "Checked the site on a real phone: modules auto-load there exactly as they do on a computer",
        "The bottom navigation no longer crawls off screen: \"Home\" and \"Python\" are back in their places",
        "On a narrow screen the first buttons used to vanish to the left — the \"pill\" design slid the whole bar by half its width",
        "The \"More\" panel with every section opens the same way on a phone and on a tablet"
      ],
      tr: [
        "Site gerçek telefonda denendi: modüller orada bilgisayardaki gibi kendiliğinden yükleniyor",
        "Alt gezinme çubuğu artık ekran dışına kaçmıyor: \"Ana\" ve \"Python\" yerlerine döndü",
        "Dar ekranda ilk düğmeler solda kayboluyordu — \"hap\" tasarımı tüm çubuğu yarım genişlik kaydırıyordu",
        "Tüm bölümleri içeren \"Daha\" paneli telefonda da tablette de aynı açılıyor"
      ]
    },
    "26.10.68": {
      uk: [
        "Прогнали через автозавантаження всі 33 пакети з розширень: кожен імпортується, і приклад із магазинчика справді виконується",
        "«black» більше не падає: у Pyodide немає os.geteuid, через що ламався його залежний «platformdirs» — сайт тепер підставляє відсутні функції",
        "«qrcode» сам тягне Pillow: без нього код QR рахує, але малювати нічим",
        "Кнопка «Встановити» в магазинчику тепер ставить і прописані залежності пакета",
        "Виправлено приклад «feedparser»: байтовий рядок з кирилицею всередині був SyntaxError",
        "Вага пакета в вікні деталей більше не рахує Pyodide-залежності через PyPI"
      ],
      en: [
        "All 33 extension packages went through auto-load: every one of them imports, and the example shipped in the shop actually runs",
        "\"black\" no longer crashes: Pyodide has no os.geteuid, which broke its \"platformdirs\" dependency — the site now supplies the missing functions",
        "\"qrcode\" pulls Pillow in by itself: without it the QR is computed but there is nothing to draw it with",
        "The \"Install\" button in the shop now installs the dependencies a package declares",
        "Fixed the \"feedparser\" example: a byte literal holding Cyrillic text was a SyntaxError",
        "The package weight in the details dialog no longer counts Pyodide deps off PyPI"
      ],
      tr: [
        "Genişletme paketlerinin 33'ü birden otomatik yüklemeye girdi: her biri içe aktarılıyor ve mağazadaki örnek gerçekten çalışıyor",
        "\"black\" artık çökmüyor: Pyodide'da os.geteuid yok, bu yüzden bağımlı olduğu \"platformdirs\" kırılıyordu — site artık eksik fonksiyonları kendisi veriyor",
        "\"qrcode\" Pillow'u kendisi indiriyor: onsuz QR kodu hesaplıyor ama çizecek aracı olmuyor",
        "Mağazadaki \"Kur\" düğmesi artık paketin yazdığı bağımlılıkları da kuruyor",
        "\"feedparser\" örneği düzeltildi: içinde kiril harfleri olan bayt satırı SyntaxError veriyordu",
        "Ayrıntı penceresindeki paket ağırlığı artık Pyodide bağımlılıklarını PyPI üzerinden saymıyor"
      ]
    },
    "26.10.67": {
      uk: [
        "Підказка «запусти код ще раз — довантажиться сам» нарешті не бреше: пакети просто з PyPI («art», «pyfiglet», «emoji»…) сайт ставить сам через «micropip»",
        "Достатньо одного запуску: код з «import art» одразу друкує банер, нікуди натискати не треба",
        "Перед встановленням сайт перевіряє, чи модуль уже є на диску, тому не тягне його повторно й не витрачає трафік даремно",
        "Авто-встановлене записується в історію, тож картка модуля в магазинчику одразу стає «Встановлено»",
        "Не вийшло довантажити — окремий рядок із пропозицією поставити вручну, а не сам трейсбек",
        "Слова «Pyodide довантажить його сам» замінено на «сайт довантажить його сам» — бо тепер це робить не лише Pyodide"
      ],
      en: [
        "The hint \"run the code again and it will load itself\" no longer lies: packages straight off PyPI (\"art\", \"pyfiglet\", \"emoji\"…) are now installed by the site itself through micropip",
        "One run is enough: code with \"import art\" prints the banner right away, no button to press anywhere",
        "Before installing, the site checks whether the module already sits on disk, so it never re-fetches it or wastes bandwidth",
        "Auto-installs are written to history, so the module card in the shop turns to \"Installed\" at once",
        "If a package cannot be loaded, you get a separate line offering a manual install instead of a bare traceback",
        "\"Pyodide will load it for you\" became \"the site will load it for you\" — since it is no longer Pyodide alone"
      ],
      tr: [
        "\"Kodu yeniden çalıştır, kendisi yüklenir\" ipucu artık yalan söylemiyor: PyPIʼden gelen paketler (\"art\", \"pyfiglet\", \"emoji\"…) site tarafından micropip ile kuruluyor",
        "Tek çalıştırma yeterlidir: \"import art\" içeren kod afişi hemen basıyor, hiçbir düğmeye dokunman gerekmiyor",
        "Kurmadan önce site modülün diskte olup olmadığına bakıyor, böylece onu tekrar indirmiyor ve bant genişliğini boşa harcamıyor",
        "Otomatik kurulumlar geçmişe yazılıyor, bu yüzden mağazadaki modül kartı hemen \"Kurulu\" oluyor",
        "Yüklenemezse ham izleme hatası yerine elle kurmayı öneren ayrı bir satır görünüyor",
        "\"Pyodide senin için yükler\" sözü \"site senin için yükler\" oldu — çünkü artık bunu yalnızca Pyodide yapmıyor"
      ]
    },
    "26.10.66": {
      uk: [
        "Написали власні рушії tkinter і turtle — Pyodide у браузері їх не постачає, тож тепер обидва працюють справді",
        "turtle: рух з анімацією, заповнені многокутники й кола, stamp, dot, write, клавіші onkey і онлайновий ontimer — усе на звичайній canvas",
        "tkinter: Frame, Label, Entry, Button, Scale, Checkbutton, Radiobutton і Text з pack, grid, place — вікно збирається прямо на сторінці",
        "StringVar і родинні змінні живі в обидва боки: зміна в коді одразу видно в полі, а набране в полі повертається у Python",
        "messagebox показує справжнє вікно, а askyesno, askstring та решта чесно пояснюють, що відповідь зʼявиться виводом нижче",
        "Обидва модулі виросли в магазинчикі з чіпом «Вбудовано»: ставити нічого не треба, вага — нуль, зате є кнопка «Приклад»",
        "Клік по «Приклад» переносить готовий код одразу в редактор Python-майданчика — можна запускати, не друкуючи нічого самостійно"
      ],
      en: [
        "Built our own tkinter and turtle engines — Pyodide ships neither in the browser, so now both genuinely work",
        "turtle: animated motion, filled polygons and circles, stamp, dot, write, onkey bindings and a live ontimer — all on a plain canvas",
        "tkinter: Frame, Label, Entry, Button, Scale, Checkbutton, Radiobutton and Text with pack, grid and place — the window is assembled right on the page",
        "StringVar and friends are live in both directions: a change in code shows up in the field at once, and what you type comes back to Python",
        "messagebox opens a real dialog, while askyesno, askstring and the rest honestly explain that the answer lands in the output below",
        "Both modules grew cards in the shop with a “Built in” chip: nothing to install, zero weight, but there is a “Example” button",
        "Clicking “Example” drops the ready code straight into the Python playground editor — run it without typing a line yourself"
      ],
      tr: [
        "Kendi tkinter ve turtle motorlarımızı yazdık — Pyodide bunları tarayıcıda sunmuyor, artık ikisi de gerçekten çalışıyor",
        "turtle: hareketli çizim, dolgulu çokgenler ve daireler, stamp, dot, write, onkey tuşları ve canlı ontimer — hepsi düz tuval üzerinde",
        "tkinter: Frame, Label, Entry, Button, Scale, Checkbutton, Radiobutton ve Text; pack, grid, place ile pencere sayfanın üstünde kuruluyor",
        "StringVar ve akrabaları iki yönlü canlı: kodda yapılan değişiklik hemen alana yansır, alana yazılan da Pythonʼa döner",
        "messagebox gerçek bir pencere açar; askyesno, askstring ve diğerleri dürüstçe cevabın aşağıdaki çıktıda görüneceğini anlatır",
        "İki modül de mağazada “Yerleşik” etiketiyle büyüyor: kurulacak bir şey yok, ağırlık sıfır, ama bir “Örnek” düğmesi var",
        "“Örnek”e tıklamak hazır kodu doğrudan Python sahnesi editörüne taşır — kendi başına tek satır yazmadan çalıştırabilirsin"
      ]
    },
    "26.10.65": {
      uk: [
        "Новий розділ «Допомога» в меню: короткі відповіді на часті питання й повна історія оновлень",
        "Історія відсортована від свіжого релізу до найстарішого; кожен запис розгортається у повний список змін",
        "Достатньо дописати запис у LOG під час деплою — розділ поповнюється сам, вручну список вести не треба",
        "У вікні «Що нового» з'явилася кнопка «Уся історія оновлень» — перечитати старі релізи тепер можна без перезавантаження сторінки",
        "Кнопка «Розгорнути все» показує одразу всі версії, а переклад розділу міняється разом з мовою інтерфейсу"
      ],
      en: [
        "New “Help” section in the menu: quick answers to common questions plus the full update history",
        "The history is sorted newest release first; every entry expands into its complete list of changes",
        "Adding one LOG entry at deploy time is enough — the section refills itself, no manual list to maintain",
        "The \"What's new\" window gained a \"Full update history\" button, so old releases can be re-read without reloading the page",
        "“Expand all” reveals every version at once, and the section follows the interface language"
      ],
      tr: [
        "Menüde yeni “Yardım” bölümü: sık sorulanlara hızlı cevaplar ve eksiksiz güncelleme geçmişi",
        "Geçmiş en yeni sürümden başlayarak sıralandı; her kayıt tam değişim listesine açılıyor",
        "Dağıtım sırasında LOG'a tek kayıt eklemek yeterli — bölüm kendisi doluyor, listeyi elle tutmak gerekmiyor",
        "“Yenilikler” penceresine “Tüm güncelleme geçmişi” düğmesi eklendi; eski sürümler sayfayı yenilemeden yeniden okunabiliyor",
        "“Tümünü aç” bütün sürümleri birden gösteriyor ve bölüm arayüz dilini takip ediyor"
      ]
    },
    "26.10.64": {
      uk: [
        "Пасхалка із замком отримала справжні згенеровані відео: неонова потаємна галерея з силуетом замка та стіна рамок, що засвічуються одна за одною",
        "Цифри більше не намальовані поверх — вони спливають у трьох кадрах самого відео, кожна пара у своєму кутку і лише на мить",
        "Поки відео довантажується, гравець бачить той самий сюжет, намальований на canvas, тож жодної чорної паузи",
        "Обидва кліпи стиснуті до 1,6 МБ на двох і кешуються браузерам після першого перегляду — далі працюють офлайн"
      ],
      en: [
        "The padlock easter egg now plays real generated videos: a neon hidden gallery with a looming padlock silhouette and a wall of frames lighting up one by one",
        "The digits are no longer painted on top — they surface inside three frames of the footage itself, each pair in its own corner for a moment only",
        "While a clip buffers, the player shows the same scene drawn on canvas, so there is no black pause",
        "Both clips are squeezed to 1.6 MB together and cached by the browser after the first watch, so they work offline afterwards"
      ],
      tr: [
        "Kilit gizli sürprizi artık gerçek üretilmiş videolarla oynuyor: neonlu gizli galeri, yaklaşan kilit silüeti ve birer birer yanan çerçeve duvarı",
        "Rakamlar artık üstten boyanmıyor — üç karede bizzat görüntünün içinde, her çift kendi köşesinde bir anlığına beliriyor",
        "Klip yüklenirken oynatıcı aynı sahneyi tuval üzerinde çiziyor, böylece siyah bekleme anı yok",
        "İki klip birlikte 1,6 MBʼa sıkıştırıldı ve ilk izlemeden sonra tarayıcıda önbelleğe alınıyor, sonrasında çevrimdışı çalışıyor"
      ]
    },
    "26.10.63": {
      uk: [
        "У меню ігор зʼявилася сіра плитка з великим замком — це пасхалка. Стукни по ній двадцять разів",
        "Замок відмикає відео: у трьох його кадрах сховано по дві цифри. Подивись уважно — пропустити не вийде",
        "Після відео замок просить шестизначний код. Помилишся — є три шанси переглянути відео; використали всі — замок знову зачинено",
        "Код підійшов? Тоді друге відео, і після нього станеться головне: скільки нових ігор насправді попереду",
        "Обидва відео малюються прямо в браузері: неонова потаємна галерея, силует замка, що наближається, і стіна рамок, які засвічуються одна за одною",
        "Плитка памʼятає прогрес кліків і відчинений замок; усі підказки та вікна говорять твоєю мовою"
      ],
      en: [
        "A grey tile with a big padlock has appeared in the game menu — it is an easter egg. Knock on it twenty times",
        "The lock opens onto a video: three of its frames hide two digits each. Watch closely — skipping is not an option",
        "After the video the lock asks for a six-digit code. Wrong, and you get three chances to rewatch; use them all and it shuts again",
        "Code correct? Then a second video rolls, and after it comes the payoff: how many new games really await you",
        "Both clips are drawn live in the browser: a neon hidden gallery, a padlock silhouette closing in, and a wall of frames lighting up one by one",
        "The tile remembers your click progress and the unlocked state; every hint and window follows your language"
      ],
      tr: [
        "Oyun menüsünde büyük asma kilitli gri bir karo belirdi — bu bir gizli sürpriz. Yirmi kez tıkla",
        "Kilit bir videoda açılıyor: üç karesinde ikişer rakam gizli. Dikkatli izle — atlamak mümkün değil",
        "Videodan sonra kilit altı haneli kodu ister. Yanılırsan videoyu tekrar izlemek için üç şansın var; hepsini harcarsan yeniden kapanır",
        "Kod tuttuysa ikinci video gelir ve ardından ödül: gerçekte kaç yeni oyun seni bekliyor",
        "İki klip de tarayıcıda çiziliyor: neonlu gizli bir galeri, yaklaşan bir kilit silüeti ve birer birer aydınlanan çerçeve duvarı",
        "Karo tıklama ilerlemesini ve açık kilidi hatırlar; tüm ipuçları ve pencerler dilini takip eder"
      ]
    },
    "26.10.62": {
      uk: [
        "Три нові ігри — «Ханойська вежа», «Пʼятнашки» і «Лабіринт». У меню їх уже дванадцять",
        "Ханойська вежа: від 3 до 8 дисків, лічильник ходів і чесний оптимум 2ⁿ−1, з чим порівняти результат",
        "Пʼятнашки: поля 3×3, 4×4 і 5×5 та три сили перемішування. Головна комбінація завжди розвʼязна — плитку мішають лише законними ходами",
        "Лабіринт: щоразу новий, згенерований з нуля (від 9×9 до 21×21). Вихід світиться зеленим, а позначку пройденого шляху можна вимкнути",
        "У нових іграх теж є власні налаштування з фірмовими менюшками, а рекорди йдуть у профіль: ходи для вежі й пʼятнашок, секунди для лабіринту",
        "Керування — стрілки, WASD, екранний джойстик і свайп на телефоні"
      ],
      en: [
        "Three new games — Tower of Hanoi, 15 Puzzle and Maze. The menu now holds twelve",
        "Tower of Hanoi: 3 to 8 disks, a move counter and the honest 2ⁿ−1 optimum to measure yourself against",
        "15 Puzzle: 3×3, 4×4 and 5×5 boards with three shuffle strengths. Every layout stays solvable because it is mixed with legal moves only",
        "Maze: freshly generated every round, from 9×9 to 21×21. The exit glows green and the trail marker can be switched off",
        "The new games carry their own settings with custom dropdowns, and their records land in your profile: moves for the tower and puzzle, seconds for the maze",
        "Controls: arrow keys, WASD, an on-screen d-pad and swipe on phones"
      ],
      tr: [
        "Üç yeni oyun — Hanoi Kulesi, 15 Bulmaca ve Labirent. Menüde artık on iki oyun var",
        "Hanoi Kulesi: 3-8 disk, hamle sayacı ve sonuçla kıyaslayacağın dürüst 2ⁿ−1 optimumu",
        "15 Bulmaca: 3×3, 4×4 ve 5×5 tahtalar ile üç karıştırma şiddeti. Yalnızca yasal hamlelerle karıştırıldığı için her düzen çözülebilir",
        "Labirent: her turda 9×9 ile 21×21 arası sıfırdan üretilir. Çıkış yeşil parlar, yürünen yol işareti kapatılabilir",
        "Yeni oyunların da kendi ayarları ve özel açılır menüleri var; rekorlar profiline işlenir: kule ve bulmacada hamle, labirentte saniye",
        "Kontroller: ok tuşları, WASD, ekrandaki yön tuşları ve telefonda kaydırma"
      ]
    },
    "26.10.61": {
      uk: [
        "У кожної гри нарешті є справжні налаштування: натисни «⚙» над дошкою — і гра перебудується під тебе просто посеред партії",
        "Хрестики-нулики: грати проти компʼютера або вдвох на одному екрані, плюс три рівні розуму суперника",
        "Змійка: швидкість, три розміри поля та стіни на вибір — тверді або портал, що викидає тебе з протилечного боку",
        "Memory: від 4 до 10 пар і показ усіх карток на старті на 2 чи 4 секунди; 2048: поле 4×4 або 5×5 і перша плитка 2 чи 4",
        "Сапер: поле аж до 16×16 і до 40 мін; «Вгадай число»: верхня межа 50, 100 або 200",
        "Саймон: темп і довжина старту; Реакція: середній час за 1, 3 або 5 спроб; Камінь-ножиці-папір: матч до 1, 3, 5 чи 10 перемог",
        "Вікно налаштувань гри зроблене в фірмовому стилі — із власними менюшками замість системних списків"
      ],
      en: [
        "Every game finally has real settings: tap the «⚙» above the board and the game rebuilds itself mid-round",
        "Tic-Tac-Toe: play the computer or two players on one screen, plus three opponent skill levels",
        "Snake: speed, three board sizes and walls your way — solid, or a portal that spits you out the other side",
        "Memory: 4 to 10 pairs and an optional 2 or 4 second peek at the start; 2048: 4×4 or 5×5 board and a starting 2 or 4 tile",
        "Minesweeper: boards up to 16×16 with up to 40 mines; Guess the Number: a ceiling of 50, 100 or 200",
        "Simon: tempo and starting length; Reaction: average over 1, 3 or 5 taps; Rock-Paper-Scissors: first to 1, 3, 5 or 10 wins",
        "The game settings dialog is built in the app's own style, with custom dropdowns instead of native lists"
      ],
      tr: [
        "Sonunda her oyunun gerçek ayarları var: tahtanın üstündeki «⚙» simgesine dokun, oyun turun ortasında kendini yeniden kursun",
        "Xox: yapay zekâya karşı veya tek ekranda iki oyuncu, artı üç rakip ustalık seviyesi",
        "Yılan: hız, üç tahta boyutu ve seçebileceğin duvarlar — sağlam ya da seni diğer taraftan çıkaran portal",
        "Memory: 4-10 çift ve başta 2 veya 4 saniyelik kart göz atma; 2048: 4×4 veya 5×5 tahta ve ilk kutu 2 ya da 4",
        "Mayın Tarlası: 16×16ʼya kadar tahta ve 40ʼa kadar mayın; Sayıyı Tahmin Et: üst sınır 50, 100 veya 200",
        "Simon: tempo ve başlangıç uzunluğu; Refleks: 1, 3 veya 5 deneme ortalaması; Taş-Kağıt-Makas: 1, 3, 5 veya 10 galibiyete kadar",
        "Oyun ayarları penceresi uygulamanın kendi stilinde — sistem listeleri yerine özel açılır menülerle"
      ]
    },
    "26.10.60": {
      uk: [
        "Кожна іконка бічного меню ожила: дім підстрибує, код хитається, полиця гойдається, шапочка випускника гортається, галочка збільшується, геймпад стрибає, ключ обертається, бульбашка відгуку хитається, аватарка виділяється, а кубок нахиляється",
        "Liquid Glass тепер працює і для нового інтерфейсу: панель навігації, шапка, картки, менюшки, вікна та панель «Ще» стають скляними з розмиттям 22px",
        "Пункт меню й картка на головній тепер називаються «Магазинчик модулів» і мають іконку магазину замість коробки",
        "Новий задній фон: мʼяка aurora-стрічка в кольорі акценту, точкова сітка, що повільно дрейфує, і два світлові промені",
        "Сяйво за курсором у новому інтерфейсі тепер у кольорі обраного акценту й з бірюзовим ореолом",
        "Інструменти перевтілені під новий дизайн: картки з радіусом 24px, іконки в фірмових чипах і мʼяке світло при наведенні"
      ],
      en: [
        "Every sidebar icon now moves on hover: home bounces, code tilts, the shelf sways, the grad cap flips, the tick pops, the gamepad jumps, the wrench turns, the review bubble swings, the avatar swells and the trophy tips",
        "Liquid Glass now covers the new interface too: nav rail, app bar, cards, menus, dialogs and the More sheet go frosted with a 22px blur",
        "The menu entry and the home card are now Module shop and carry a storefront icon instead of a box",
        "A fresh background: an accent-tinted aurora ribbon, a slowly drifting dot grid and two light beams",
        "The cursor glow in the new interface now follows your accent colour with a cyan halo",
        "Tools rebuilt for the new design: 24px-radius cards, icons in brand chips and a soft hover light"
      ],
      tr: [
        "Yan menüdeki her simge artık üzerine gelince hareket ediyor: ev zıplar, kod sallanır, raf salınır, mezuniyet şapkası çevrilir, onay işareti büyür, gamepad sıçrar, anahtar döner, yorum balonu sallanır, avatar şişer, kupa eğilir",
        "Liquid Glass artık yeni arayüzü de kapsıyor: gezinme rafı, üst çubuk, kartlar, menüler, pencereler ve Diğer sayfası 22px bulanıklıkla buğulanıyor",
        "Menü öğesi ve ana kart artık Modül mağazası adında ve kutu yerine vitrin simgesi taşıyor",
        "Yeni arka plan: vurgu renginde aurora şeridi, yavaşça kayan nokta ızgarası ve iki ışık huzmesi",
        "Yeni arayüzde imleç parıltısı artık vurgu rengini ve camgöbeği bir haleyi taşıyor",
        "Araçlar yeni tasarıma göre yenilendi: 24px yarıçaplı kartlar, simge çipleri ve üzerine gelince yumuşak ışık"
      ]
    },
    "26.10.59": {
      uk: [
        "Перемикача мови в шапці більше немає — мова тепер живе лише в Налаштуваннях",
        "Мов стало 20: додано італійську, португальську, нідерландську, шведську, чеську, угорську, румунську, грецьку, індонезійську, хінді, китайську та корейську",
        "Поряд із назвою рядка тепер пише «Мова (Українська)» — у дужках показується рідна назва вибраної мови",
        "Вибір мови — у власній менюшці з галочками й прокруткою; інтерфейс перекладається цілком, з м'яким згасанням",
        "У профілі рекорди більше не хизуються «ttt» — показується повна назва гри та одиниця виміру (перемоги, очки, мс, ходів…)",
        "Якщо рядка ще немає в перекладі — він стає англійським, а не українським, тож у інтерфейсі більше немає мовної суміші"
      ],
      en: [
        "The language switcher is gone from the top bar — language now lives only in Settings",
        "There are 20 languages now: Italian, Portuguese, Dutch, Swedish, Czech, Hungarian, Romanian, Greek, Indonesian, Hindi, Chinese and Korean were added",
        "The row is labelled «Language (Українська)» — the native name of the chosen language sits in brackets",
        "Picking a language uses our own popup menu with checkmarks and scrolling; the whole interface retranslates with a soft fade",
        "Records in Profile no longer brag «ttt» — you get the full game name plus its unit (wins, points, ms, moves…)",
        "A string with no translation yet falls back to English instead of Ukrainian, so the interface never mixes languages"
      ],
      tr: [
        "Üst bardaki dil değiştirici kaldırıldı — dil artık yalnızca Ayarlar'da",
        "Diller 20'ye çıktı: İtalyanca, Portekizce, Felemenkçe, İsveççe, Çekçe, Macarca, Rumence, Yunanca, Endonezce, Hintçe, Çince ve Korece eklendi",
        "Satır artık «Dil (Українська)» biçiminde — seçilen dilin kendi adı parantez içinde gösteriliyor",
        "Dil seçimi, onay işaretli ve kaydırılabilen kendi açılır menümüzle yapılıyor; tüm arayüz yumuşak bir soluşla yeniden çevriliyor",
        "Profildeki rekorlar artık «ttt» diye övünmüyor — oyunun tam adı ve birimi (galibiyet, puan, ms, hamle…) yazıyor",
        "Çevirisi henüz olmayan satır Ukraynaca yerine İngilizceye düşüyor, böylece arayüzde dil karışıklığı olmuyor"
      ]
    },
    "26.10.58": {
      uk: [
        "Нові шрифти: сайт тепер говорить Space Grotesk, а код у Python-майданчику набрано Space Mono",
        "Редактор ожив: кожен символ, розділовий знак, пробіл і Enter мають власну анімацію просто біля каретки",
        "На телефоні нарешті видно кнопку «Запуск» — панель редактора переноситься в кілька рядків, а «Запуск» займає весь рядок",
        "Вивід заповнює свій блок цілком, а кнопка на весь екран розгортає консоль на всю сторінку (Escape — повернутися)",
        "Системні нудні списки замінено на власні меню-випадашки з іконками, галочками та клавіатурною навігацією — усюди, де був вибір",
        "Режим фокусу переїхав в Інструменти: обери в менюшці вкладку (Python-майданчик, ігри, курс, задачі) — і решта інтерфейсу сховається",
        "Додано маленькі відступи між усіма блоками, щоб сторінка перестала бути склеєною"
      ],
      en: [
        "New fonts: the site now speaks Space Grotesk, while the Python playground code is set in Space Mono",
        "The editor came alive: every character, punctuation mark, space and Enter gets its own animation right at the caret",
        "On phones the Run button is finally visible — the editor toolbar wraps onto several rows and Run takes the full width",
        "The output now fills its whole block, and the fullscreen button expands the console over the entire page (Escape returns)",
        "Boring system dropdowns are replaced by custom popup menus with icons, checkmarks and keyboard navigation — everywhere a picker exists",
        "Focus mode moved into Tools: pick a tab in the new menu (playground, games, course, tasks) and the rest of the interface hides",
        "Small gaps were added between every block so the page no longer looks glued together"
      ],
      tr: [
        "Yeni yazı tipleri: site artık Space Grotesk konuşuyor, Python sahnesindeki kod ise Space Mono ile diziliyor",
        "Editör canlandı: her harf, noktalama işareti, boşluk ve Enter imlecin hemen kendi animasyonunu çıkarıyor",
        "Telefonda Çalıştır düğmesi sonunda görünür — editör araç çubuğu birkaç satıra sarıyor, Çalıştır tüm satırı kaplıyor",
        "Çıktı artık bloğun tamamını dolduruyor; tam ekran düğmesi konsolu tüm sayfaya yayıyor (geri dönmek için Escape)",
        "Sıkıcı sistem listeleri yerini simgeli, onay işaretli ve klavyeyle gezilebilir özel açılır menülere bıraktı — seçim olan her yerde",
        "Odak modu Araçlar'a taşındı: menüden bir sekme seç (Python sahnesi, oyunlar, kurs, görevler) — arayüzün gerisi gizlenir",
        "Sayfa yapışık görünmesin diye tüm blokların arasına küçük boşluklar eklendi"
      ]
    },
    "26.10.57": {
      uk: [
        "Перший запуск коду тепер відкриває вікно встановлення рекомендованих модулів. Прогрес рахується по-справжньому: вага кожного пакета в байтах, відсотки, швидкість і час, що залишився. З цього вікна не вийти, доки завантаження не скінчиться",
        "По завершенні — два варіанти: «Вийти й запустити» або «Тільки вийти». Код не стартує, доки ти сам не обереш",
        "Те саме вікно з прогрес-баром тепер ставить модулі й у магазинчику — і одиночний пакет, і готовий набір цілком",
        "Клік по картці модуля відкриває вікно деталей: скільки важить модуль разом з залежностями, коли він востаннє оновлювався на PyPI й що саме імпортує",
        "Фільтр «Встановлені» показує все, що поставило вікно встановлення, а не лише те, що ти тикнув у каталозі"
      ],
      en: [
        "The first code run now opens an install window for the recommended modules. The progress is measured for real: each package's weight in bytes, per cent, speed and time left. You cannot leave this window until the download finishes",
        "When it is done there are two choices: “Close and run” or “Just close”. The code does not start until you pick one",
        "The very same progress window now installs modules in the shop too — a single package or a whole ready-made set",
        "Clicking a module card opens a details window: how much the module weighs together with its dependencies, when it was last updated on PyPI and what exactly it imports",
        "The “Installed” filter now shows everything the install window put in, not only what you tapped in the catalog"
      ],
      tr: [
        "Kod ilk kez çalıştırıldığında önerilen modüllerin kurulum penceresi açılıyor. İlerleme gerçekten ölçülüyor: her paketin bayt cinsinden ağırlığı, yüzdede, hız ve kalan süre. İndirme bitmeden bu pencereden çıkılamaz",
        "Bitince iki seçenek var: “Çık ve çalıştır” ya da “Sadece çık”. Seçim yapmadan kod çalışmaz",
        "Aynı ilerleme penceresi artık mağazada da modül kuruyor — tek paket de hazır takımların tamamı da",
        "Bir modül kartına dokunmak ayrıntı penceresini açar: modülün bağımlılıklarıyla birlikte ağırlığı, PyPI'de en son ne zaman güncellendiği ve tam olarak neleri içe aktardığı",
        "“Kurulu” filtresi artık yalnızca katalogda dokunduklarını değil, kurulum penceresinin kurduğu her şeyi gösteriyor"
      ]
    },
    "26.10.56": {
      uk: [
        "Розділ «Модулі» більше не обмежений Pyodide: 33 перевірені розширення, а все, чого немає в самому Pyodide, ставиться просто з PyPI прямо в браузері — art, pyfiglet, emoji, tabulate, Faker, tinydb, httpx, Flask, black, seaborn та інші",
        "Живий пошук за PyPI: введи будь-яку назву пакета, якої немає в каталозі, і сайт спитає PyPI — покаже версію, опис і чесний вирок: чистий Python поставиться, а зібраний під C або Rust — ні",
        "Новий фільтр «Розширення PyPI» і позначка PyPI на картках, щоб одразу бачити, звідки пакет",
        "Додано готові набори: Текст і консоль, Дані й конфіг, Коди й ID, QR і штрих-коди — ставляться одним кліком",
        "Помилка «No module named» тепер підказує, що модуль можна спробувати поставити з PyPI в розділі «Модулі»"
      ],
      en: [
        "The “Modules” section is no longer limited to Pyodide: 33 verified extras, and anything Pyodide itself does not ship installs straight from PyPI inside the browser — art, pyfiglet, emoji, tabulate, Faker, tinydb, httpx, Flask, black, seaborn and more",
        "Live PyPI lookup: type any package name that is not in the catalog and the site asks PyPI — it shows the version, the description and an honest verdict: pure Python installs, C or Rust builds do not",
        "A new “PyPI extras” filter and a PyPI badge on the cards, so you can see where each package comes from",
        "New ready-made sets: Text & console, Data & config, Codes & IDs, QR & barcodes — one click installs the whole group",
        "The “No module named” error now suggests trying to install the module from PyPI in the “Modules” section"
      ],
      tr: [
        "“Modüller” bölümü artık Pyodide ile sınırlı değil: 33 doğrulanmış ek — ve Pyodide'in hiç yayımlamadığı her şey tarayıcıda doğrudan PyPI'den kuruluyor: art, pyfiglet, emoji, tabulate, Faker, tinydb, httpx, Flask, black, seaborn ve diğerleri",
        "Canlı PyPI araması: katalogda olmayan bir paket adı yaz, site PyPI'ye sorsun — sürümü, açıklamayı ve dürüst hükmü gösterir: salt Python kurulur, C veya Rust ile derlenen kurulmaz",
        "Yeni “PyPI ekleri” filtresi ve kartlarda PyPI etiketi — paketin nereden geldiği hemen görülür",
        "Yeni hazır takımlar: Metin ve konsol, Veri ve yapılandırma, Kodlar ve kimlikler, QR ve barkodlar — tek dokunuşla tüm grup kurulur",
        "“No module named” hatası artık modülü “Modüller” bölümünde PyPI'den kurmayı öneriyor"
      ]
    },
    "26.10.55": {
      uk: [
        "Екран завантаження нарешті став непрозорим: темний фон малюється поверх сторінки, тож старе оформлення знову не проглядає крізь нього",
        "Причина була у записі фону — браузер відкидав її цілком, тому на сплеші видно лише емблему й смужку поступу"
      ],
      en: [
        "The loading screen is finally opaque: the dark backdrop now paints over the page, so the old skin no longer shows through it",
        "The culprit was the background declaration itself — the browser dropped it whole, leaving only the emblem and the progress bar on screen"
      ],
      tr: [
        "Yükleme ekranı sonunda opak: koyu arka plan sayfanın üstünü boyuyor, eski görünüm artık içinden görünmüyor",
        "Sebep arka plan tanımının kendisiydi — tarayıcı onu tümüyle atıyordu, ekranda sadece amblem ve ilerleme çubuğu kalıyordu"
      ]
    },
    "26.10.54": {
      uk: [
        "Екран завантаження на 5 секунд: інтерфейс більше не миготить старим оформленням на частину секунди",
        "Після нього вікна вишикувались у чергу: спершу питання «з якого пристрою», і лише потім «Що нового»",
        "На сплеші — емблема, назва, твій рядок-підзаголовок і смужка поступу, що заповнюється рівно за 5 секунд"
      ],
      en: [
        "A 5-second loading screen: no more split second when the old skin flashes before the new one kicks in",
        "Dialogs now queue up behind it: the 'which device' question first, 'What's new' only after it",
        "The splash carries the emblem, the name, your tagline and a progress bar that fills in exactly 5 seconds"
      ],
      tr: [
        "5 saniyelik yükleme ekranı: eski görünümün bir anlığına göründüğü an artık yok",
        "Pencereler sıraya dizildi: önce 'hangi cihaz' sorusu, sonra 'Yenilikler'",
        "Ekranda amblem, ad, sloganın ve tam 5 saniyede dolan bir ilerleme çubuğu var"
      ]
    },
    "26.10.53": {
      uk: [
        "Нижня панель на телефоні — як у макеті: 80px, активний пункт у фіолетовій капсулі навколо іконки й підпису",
        "Мобільна шапка тепер з логотипом 40px, назвою, перемикачем мов UA/EN/TR й аватаром; пошук відкривається окремим піктограмним кнопкою на всю ширину",
        "Пасхалки повернулися: 200 кліків по логотипу та 10 кліків по назві працюють і через бренд у бічній панелі, бо в новому стилі шапка без них",
        "Всі вікна оформлені в новому стилі: затемнення з розмиттям, темні картки з м'якою тінню, ті ж поля й кнопки; у грі з'явилася кнопка «Правила», і це вікно вперше отримало власний дизайн",
        "Модалки більше не ховаються під нижньою панеллю на телефоні"
      ],
      en: [
        "Phone bottom bar matches the mockup: 80px tall, active item wrapped in a violet capsule around icon and label",
        "Mobile header now carries the 40px logo, title, UA/EN/TR switch and avatar; search opens full width from its own icon button",
        "Easter eggs are back: 200 clicks on the logo and 10 on the title also work on the sidebar brand, which the new header no longer has",
        "Every dialog wears the new skin: blurred scrim, dark cards with a soft shadow, matching fields and buttons; games gained a 'Rules' button and that sheet finally has its own design",
        "Modals no longer hide behind the bottom bar on phones"
      ],
      tr: [
        "Telefondaki alt çubuk maketle aynı: 80px, etkin öğe simge ile etiketi saran mor kapsül içinde",
        "Mobil başlık artık 40px logo, ad, UA/EN/TR seçici ve avatar taşıyor; arama kendi simge düğmesiyle tam genişlik açılıyor",
        "Yumurta oyunlar geri döndü: logoya 200, ada 10 tıklama yan panel markasında da çalışıyor",
        "Tüm pencereler yeni görünüme büründü: bulanık karartma, yumuşak gölgeli koyu kartlar, uyumlu alanlar ve düğmeler; oyunlarda 'Kurallar' düğmesi belirdi ve bu pencere ilk kez kendi tasarımına kavuştu",
        "Pencereler telefonda alt çubuğun arkasında gizlenmiyor"
      ]
    },
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
    show:  { uk: "Показати що нового", en: "Show what's new", tr: "Yenilikleri göster" },
    allLog: { uk: "Уся історія оновлень", en: "Full update history", tr: "Tüm güncelleme geçmişi" },
    latest: { uk: "поточна", en: "latest", tr: "güncel" },
    expandAll: { uk: "Розгорнути все", en: "Expand all", tr: "Tümünü aç" },
    collapseAll: { uk: "Згорнути все", en: "Collapse all", tr: "Tümünü kapat" }
  };
  const lang = () => (global.I18n ? global.I18n.lang : "uk");
  const pick = (o) => (global.I18n ? global.I18n.langMap(o) : (o.uk || o.en));

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
    linesOf(v).forEach((line) => {
      const li = document.createElement("li");
      li.textContent = line;
      ul.appendChild(li);
    });
    panel.appendChild(ul);

    /* Кнопка внизу */
    const row = document.createElement("div");
    row.className = "wn-actions";
    const hist = document.createElement("button");
    hist.className = "btn text wn-history";
    hist.innerHTML = '<span class="material-icons" aria-hidden="true">history</span><span>' + pick(T.allLog) + "</span>";
    hist.onclick = () => {
      close();
      setTimeout(() => { if (global.App && global.App.route) global.App.route("help"); }, 200);
    };
    row.appendChild(hist);
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

  /* ---------- Повна історія оновлень у розділі «Допомога» ----------
     Джерело те саме, що й для вікна «Що нового», тому кожен новий запис у LOG
     потрапляє сюди сам — вести список двічі не треба. */
  function cmpVerDesc(a, b) {
    const A = String(a).split("."), B = String(b).split(".");
    const n = Math.max(A.length, B.length);
    for (let i = 0; i < n; i++) {
      const d = (Number(B[i]) || 0) - (Number(A[i]) || 0);
      if (d) return d;
    }
    return 0;
  }

  function releases() {
    return Object.keys(LOG).sort(cmpVerDesc);
  }

  function linesOf(v) {
    const e = LOG[v];
    if (!e) return [];
    return global.I18n ? global.I18n.langMap(e) : (e.uk || e.en || []);
  }

  let helpOpenAll = false;

  function setHelpLabel() {
    const btn = document.getElementById("helpToggleAll");
    if (!btn) return;
    const label = btn.querySelector("span:not(.material-icons)");
    const icon = btn.querySelector(".material-icons");
    if (label) label.textContent = pick(helpOpenAll ? T.collapseAll : T.expandAll);
    if (icon) icon.textContent = helpOpenAll ? "unfold_less" : "unfold_more";
  }

  function applyHelpOpen(item, open) {
    item.classList.toggle("open", open);
    const head = item.querySelector(".help-ver-head");
    if (head) head.setAttribute("aria-expanded", open ? "true" : "false");
    const icon = item.querySelector(".help-ver-arrow");
    if (icon) icon.textContent = open ? "expand_less" : "expand_more";
  }

  function renderHelp() {
    const host = document.getElementById("helpChangelog");
    if (!host) return;
    host.innerHTML = "";

    releases().forEach((v, i) => {
      const lines = linesOf(v);
      const item = document.createElement("div");
      item.className = "help-ver";

      const head = document.createElement("button");
      head.type = "button";
      head.className = "help-ver-head";

      const chip = document.createElement("span");
      chip.className = "help-chip";
      chip.textContent = "v" + v;

      const title = document.createElement("span");
      title.className = "help-ver-title";
      title.textContent = lines.length ? lines[0] : pick(T.title);

      head.append(chip, title);

      if (v === VERSION) {
        const tag = document.createElement("span");
        tag.className = "help-tag";
        tag.textContent = pick(T.latest);
        head.appendChild(tag);
      }

      const arrow = document.createElement("span");
      arrow.className = "material-icons help-ver-arrow";
      arrow.setAttribute("aria-hidden", "true");
      head.appendChild(arrow);

      const ul = document.createElement("ul");
      ul.className = "help-ver-list";
      lines.slice(1).forEach((line) => {
        const li = document.createElement("li");
        li.textContent = line;
        ul.appendChild(li);
      });

      head.onclick = () => applyHelpOpen(item, !item.classList.contains("open"));

      item.append(head, ul);
      applyHelpOpen(item, helpOpenAll || i === 0);
      host.appendChild(item);
    });

    setHelpLabel();

    const btn = document.getElementById("helpToggleAll");
    if (btn && !btn._wired) {
      btn._wired = true;
      btn.onclick = () => {
        helpOpenAll = !helpOpenAll;
        document.querySelectorAll("#helpChangelog .help-ver")
          .forEach((item) => applyHelpOpen(item, helpOpenAll));
        setHelpLabel();
        if (global.Audio2 && global.Audio2.SFX) global.Audio2.SFX.click();
      };
    }
  }

  function init() {
    localStorage.setItem(KEY_SEEN, VERSION);    addVersionToSettings();
    document.addEventListener("langchange", addVersionToSettings);
    renderHelp();
    document.addEventListener("langchange", renderHelp);
    // «Що нового» показуємо при КОЖНОМУ вході, але вже після того,
    // як людина відповіла на питання про пристрій (а обидва — після сплешу)
    const tourOpen = () => {
      const e = document.querySelector(".ob-backdrop");
      return !!e && getComputedStyle(e).display !== "none";
    };
    const show = () => setTimeout(() => {
      if (tourOpen()) { show(); return; }   // не стриємо поверх онбордингу
      showWhatsNew(VERSION);
    }, 260);
    const afterDevice = () => {
      if (global.Device && global.Device.answered) global.Device.answered.then(show);
      else show();
    };
    if (global.Splash) global.Splash.done.then(afterDevice);
    else afterDevice();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();

  global.AppUpdates = { VERSION, showWhatsNew, renderHelp, releases };
})(window);
