/* updates.js — версія застосунку + вікно "Що нового" при кожному вході.
   Правило деплою: підніми VERSION, додай запис у LOG і поміняй ?v= у index.html.
   Запис у LOG — це і є опис змін: він сам потрапляє у вікно «Що нового»
   й у повну історію оновлень у розділі «Допомога». */
(function (global) {
  const VERSION = "26.10.75";
  const KEY_SEEN = "app.versionSeen";

  const LOG = {
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
  const pick = (o) => o[lang()] || o.en || o.uk;

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
    return e[lang()] || e.en || e.uk || [];
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
