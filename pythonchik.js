/* pythonchik.js — маскот і помічник сайту «Пайтончик».
   Плаваючий асистент: база знань з основ Python, переклад traceback'ів
   людською мовою та тур по розділах сайту. Повністю локальний, без мережі. */
(function (global) {
  "use strict";

  const $ = (s) => document.querySelector(s);
  const TOUR_KEY = "app.pychik.tourSeen";

  function toast(msg) { if (global.App && global.App.toast) global.App.toast(msg); }
  function sfx(name) {
    try {
      const A = global.Audio2;
      if (A && A.SFX && typeof A.SFX[name] === "function") A.SFX[name]();
    } catch (e) { /* звук не критичний */ }
  }

  /* ---------- Тексти інтерфейсу (власний словник: i18n.js редагувати не можна) ---------- */
  const TXT = {
    uk: {
      name: "Пайтончик",
      fabLabel: "Відкрити помічника Пайтончика",
      close: "Закрити",
      send: "Надіслати",
      placeholder: "Запитай про Python або встав текст помилки...",
      copy: "Копіювати",
      copied: "Код скопійовано",
      copyFail: "Не вдалося скопіювати, виділи код вручну",
      tourNext: "Далі",
      tourSkip: "Пропустити",
      tourFinish: "Гаразд",
      tourCounter: "{n} з {m}",
      tourDone: "Ось і весь сайт. Щасти у вивченні Python!",
      tourChip: "Показати тур",
      tourBtnL: "Показати тур сайтом",
      padToast: "Код уже в редакторі — тисни «Запуск»",
      whyLabel: "Чому так",
      tutPrevL: "Крок назад",
      tutPauseL: "Призупинити автопілот",
      tutPlayL: "Увімкнути автопілот",
      fallback: "Про це я поки не знаю. Обери підказку нижче або встав текст помилки — я поясню, що сталося, і підкажу розв'язок.",
      errIntro: "Дивлюся твій текст помилки.",
      errLine: "Проблема в рядку {n}.",
      errLineFile: "Проблема в рядку {n} у файлі {f}.",
      errUnknownWhat: "Бачу текст помилки, але такий тип мені незнайомий.",
      errUnknownCause: "Прочитай останній рядок: там назва помилки й короткий опис.",
      errUnknownFix: "Надішли мені лише останній рядок помилки — я поясню його простими словами.",
      errNameWhat: "NameError — Python не знає ім'я «{name}».",
      errModuleWhat: "ModuleNotFoundError — Python не знайшов модуль «{name}».",
      greetDefault: "Привіт! Я Пайтончик, твій помічник. Запитай мене про Python або встав текст помилки — поясню простими словами.",
      greetPython: "Привіт! Ти в Python-майданчику. Пиши код сміливо, а якщо трапиться помилка — встав її текст мені.",
      greetCourse: "Привіт! Ти в курсі Python. Не зрозумів тему уроку? Запитай мене — поясню коротко і просто.",
      greetModules: "Привіт! Це розділ модулів. Хочеш дізнатися, що таке модуль у Python? Запитай мене.",
      greetTasks: "Привіт! Це задачі. Якщо застряг — запитай мене про потрібну тему, наприклад про цикли чи умови.",
      suggest: "Спробуй запитати:"
    },
    en: {
      name: "Pythonchik",
      fabLabel: "Open the Pythonchik assistant",
      close: "Close",
      send: "Send",
      placeholder: "Ask about Python or paste an error text...",
      copy: "Copy",
      copied: "Code copied",
      copyFail: "Could not copy, please select the code manually",
      tourNext: "Next",
      tourSkip: "Skip",
      tourFinish: "Got it",
      tourCounter: "{n} of {m}",
      tourDone: "That is the whole site. Good luck learning Python!",
      tourChip: "Show the tour",
      tourBtnL: "Take the site tour",
      padToast: "The code is in the editor — hit Run",
      whyLabel: "Why this way",
      tutPrevL: "Previous step",
      tutPauseL: "Pause autopilot",
      tutPlayL: "Resume autopilot",
      fallback: "I do not know about this yet. Pick a suggestion below or paste the error text — I will explain what happened and suggest a fix.",
      errIntro: "Looking at your error text.",
      errLine: "The problem is on line {n}.",
      errLineFile: "The problem is on line {n} in {f}.",
      errUnknownWhat: "I see an error text, but this type is new to me.",
      errUnknownCause: "Read the last line: it has the error name and a short description.",
      errUnknownFix: "Send me just the last line of the error and I will explain it in simple words.",
      errNameWhat: "NameError — Python does not know the name \u00AB{name}\u00BB.",
      errModuleWhat: "ModuleNotFoundError — Python could not find the module \u00AB{name}\u00BB.",
      greetDefault: "Hi! I am Pythonchik, your helper. Ask me about Python or paste an error text — I will explain it in simple words.",
      greetPython: "Hi! You are in the Python playground. Write code freely, and if an error happens — paste its text to me.",
      greetCourse: "Hi! You are in the Python course. Did a lesson topic feel unclear? Ask me and I will explain it briefly.",
      greetModules: "Hi! This is the modules section. Want to know what a Python module is? Ask me.",
      greetTasks: "Hi! These are the tasks. If you are stuck — ask me about a topic, for example loops or conditions.",
      suggest: "Try asking:"
    },
    tr: {
      name: "Pythonchik",
      fabLabel: "Pythonchik yardımcısını aç",
      close: "Kapat",
      send: "Gönder",
      placeholder: "Python hakkında sor ya da hata metnini yapıştır...",
      copy: "Kopyala",
      copied: "Kod kopyalandı",
      copyFail: "Kopyalanamadı, kodu elle seç",
      tourNext: "İleri",
      tourSkip: "Atla",
      tourFinish: "Tamam",
      tourCounter: "{n} / {m}",
      tourDone: "Tüm site bu kadar. Python öğrenirken bol şans!",
      tourChip: "Tur göster",
      tourBtnL: "Site turunu başlat",
      padToast: "Kod düzenleyicide — Çalış'a bas",
      whyLabel: "Neden böyle",
      tutPrevL: "Önceki adım",
      tutPauseL: "Otomatik turu duraklat",
      tutPlayL: "Otomatik tura devam",
      fallback: "Bunu henüz bilmiyorum. Aşağıdaki önerilerden birini seç ya da hata metnini yapıştır; ne olduğunu anlatıp bir çözüm önereyim.",
      errIntro: "Hata metnine bakıyorum.",
      errLine: "Sorun {n}. satırda.",
      errLineFile: "Sorun {f} dosyasının {n}. satırında.",
      errUnknownWhat: "Bir hata metni görüyorum ama bu türü tanımıyorum.",
      errUnknownCause: "Son satırı oku: orada hatanın adı ve kısa bir açıklama vardır.",
      errUnknownFix: "Bana yalnızca hatanın son satırını gönder, sade bir dille açıklayayım.",
      errNameWhat: "NameError — Python «{name}» adını bilmiyor.",
      errModuleWhat: "ModuleNotFoundError — Python «{name}» modülünü bulamadı.",
      greetDefault: "Merhaba! Ben Pythonchik, yardımcınım. Python hakkında sor ya da bir hata metni yapıştır; sade bir dille açıklayayım.",
      greetPython: "Merhaba! Python alanındasın. Kodu özgürce yaz, bir hata olursa metnini bana yapıştır.",
      greetCourse: "Merhaba! Python kursundasın. Bir ders konusu anlaşılmaz mı geldi? Sor, kısaca açıklayayım.",
      greetModules: "Merhaba! Bu, modüller bölümü. Python'da modül nedir, öğrenmek ister misin? Sor.",
      greetTasks: "Merhaba! Burası görevler bölümü. Takıldıysan bir konuyu sor, örneğin döngüleri ya da koşulları.",
      suggest: "Şunu sorabilirsin:"
    }
  };

  function lang() {
    const L = global.I18n ? global.I18n.lang : "uk";
    return TXT[L] ? L : "uk";
  }
  function tx(key, vars) {
    const L = lang();
    let s = TXT[L][key] || TXT.en[key] || TXT.uk[key] || key;
    if (vars) {
      Object.keys(vars).forEach((k) => {
        s = s.split("{" + k + "}").join(String(vars[k]));
      });
    }
    return s;
  }
  /* Багатомовне поле запису: pick(obj) обирає рядок поточною мовою. */
  function pick(obj) {
    const L = lang();
    return obj[L] || obj.en || obj.uk || "";
  }

  /* ---------- База знань ---------- */
  const KB = [
    {
      kw: "print виве вивод вивести друк надруку yazdır ekrana çıkar",
      a: {
        uk: "print() виводить текст або число на екран. Текст пиши в лапках — це рядок.",
        en: "print() shows text or a number on screen. Put text in quotes — that is a string.",
        tr: "print() ekrana metin ya da sayı yazar. Metni tırnak içine al; bu bir dizedir."
      },
      code: "print(\"Привіт, Python!\")\nprint(2026)"
    },
    {
      kw: "змін перемен variable değişken atama",
      a: {
        uk: "Змінна — це ім'я для значення. Ліворуч ім'я, праворуч після = значення.",
        en: "A variable is a name for a value. The name goes on the left, the value after = on the right.",
        tr: "Değişken, bir değerin adıdır. Ad solda, değer = işaretinden sonra sağdadır."
      },
      code: "age = 13\nname = \"Olya\"\nprint(name, age)"
    },
    {
      kw: "input int float зчита зчитув введен клавіатур число ціле дробов oku giriş girdi",
      a: {
        uk: "input() зчитує рядок з клавіатури. Щоб отримати число, обгорни його: int() для цілого, float() для дробового.",
        en: "input() reads a line from the keyboard. To get a number, wrap it: int() for a whole number, float() for a decimal.",
        tr: "input() klavyeden bir satır okur. Sayı almak için sar: tam sayı için int(), ondalık için float()."
      },
      code: "n = int(input())\nx = float(input())\nprint(n + x)"
    },
    {
      kw: "string строк рядк текст dize",
      a: {
        uk: "Рядок — це текст у лапках. Рядки можна склеювати (+) і множити на число (*).",
        en: "A string is text in quotes. Strings can be joined with + and multiplied by a number with *.",
        tr: "Dize, tırnak içindeki metindir. Dizeler + ile birleştirilir ve * ile bir sayıyla çarpılabilir."
      },
      code: "s = \"Py\"\nprint(s + \"thon\")\nprint(s * 2)"
    },
    {
      kw: "len довж длин length uzunluk",
      a: {
        uk: "len() повертає довжину рядка або списку — кількість символів чи елементів.",
        en: "len() returns the length of a string or list — the number of characters or items.",
        tr: "len() bir dizenin ya da listenin uzunluğunu, yani karakter veya öğe sayısını verir."
      },
      code: "print(len(\"Python\"))  # 6\nprint(len([1, 2, 3]))  # 3"
    },
    {
      kw: "if elif else умо умов ветв розгалуж koşul şart eğer",
      a: {
        uk: "if перевіряє умову, elif — наступну умову, else виконується, коли жодна умова не справдилася. Після умови став двокрапку, а тіло пиши з відступом.",
        en: "if checks a condition, elif checks the next one, and else runs when no condition was true. Put a colon after the condition and write the body indented.",
        tr: "if bir koşulu denetler, elif sıradaki koşulu denetler, else hiçbir koşul sağlanmazsa çalışır. Koşuldan sonra iki nokta koy, gövdeyi girintili yaz."
      },
      code: "n = int(input())\nif n > 0:\n    print(\"додатне\")\nelif n < 0:\n    print(\"від'ємне\")\nelse:\n    print(\"нуль\")"
    },
    {
      kw: "порівн сравн сравнен comparison == != більше менше дорівню buyuk",
      a: {
        uk: "Оператори порівняння: == дорівнює, != не дорівнює, >, <, >=, <=. Результат порівняння — True або False.",
        en: "Comparison operators: == equals, != not equals, >, <, >=, <=. A comparison gives True or False.",
        tr: "Karşılaştırma operatörleri: == eşit, != eşit değil, >, <, >=, <=. Karşılaştırma True ya da False verir."
      },
      code: "print(5 > 3)   # True\nprint(5 == 6)  # False"
    },
    {
      kw: "for range цикл фор рендж діапазона диапазон döngü aralık",
      a: {
        uk: "for проходить по кожному елементу послідовності. range(a, b) дає числа від a до b мінус один.",
        en: "for visits every item of a sequence. range(a, b) gives numbers from a up to b minus one.",
        tr: "for bir dizideki her öğeyi dolaşır. range(a, b) a'dan b-1'e kadar sayılar verir."
      },
      code: "for i in range(1, 6):\n    print(i)  # 1 2 3 4 5"
    },
    {
      kw: "while поки доки whilst während пока цикл shart",
      a: {
        uk: "while повторює блок, поки умова істинна. Усередині циклу обов'язково змінюй умову, інакше цикл ніколи не завершиться.",
        en: "while repeats a block as long as the condition is true. Change the condition inside the loop, or it will never end.",
        tr: "while, koşul doğru olduğu sürece bloğu tekrarlar. Döngünün içinde koşulu değiştir, yoksa döngü hiç bitmez."
      },
      code: "n = 5\nwhile n > 0:\n    print(n)\n    n -= 1"
    },
    {
      kw: "list список списки liste array масив",
      a: {
        uk: "Список — це багато значень під одним ім'ям, у квадратних дужках через кому. Новий елемент додає .append().",
        en: "A list holds many values under one name, in square brackets separated by commas. Use .append() to add an item.",
        tr: "Liste, tek ad altında birçok değeri köşeli parantez içinde virgülle tutar. Yeni öğeyi .append() ekler."
      },
      code: "a = [3, 1, 4]\na.append(5)\nprint(a)  # [3, 1, 4, 5]"
    },
    {
      kw: "індекс индекс index елемент numbering нумерац öğe indis",
      a: {
        uk: "Елементи списку нумеруються з нуля: a[0] — перший, a[-1] — останній.",
        en: "List items are numbered from zero: a[0] is the first, a[-1] is the last.",
        tr: "Liste öğeleri sıfırdan numaralanır: a[0] birinci, a[-1] sonuncudur."
      },
      code: "a = [10, 20, 30]\nprint(a[0])   # 10\nprint(a[-1])  # 30"
    },
    {
      kw: "dict словник словарь dictionary ключ key sözlük anahtar",
      a: {
        uk: "Словник зберігає пари «ключ — значення». Значення дістають за ключем у квадратних дужках.",
        en: "A dictionary stores key-value pairs. Get a value by its key in square brackets.",
        tr: "Sözlük, anahtar-değer çiftleri tutar. Bir değeri köşeli parantez içinde anahtarıyla alırsın."
      },
      code: "d = {\"name\": \"Olya\", \"age\": 13}\nprint(d[\"name\"])  # Olya"
    },
    {
      kw: "def функц function функція fonksiyon tanımla",
      a: {
        uk: "def створює функцію: ім'я і параметри в дужках, а тіло — нижче з відступом.",
        en: "def creates a function: a name and parameters in brackets, and the body below, indented.",
        tr: "def bir fonksiyon oluşturur: parantez içinde ad ve parametreler, altında girintili gövde."
      },
      code: "def greet(name):\n    print(\"Привіт,\", name)\n\ngreet(\"Olya\")"
    },
    {
      kw: "return поверн верни поверта результат döndür geri",
      a: {
        uk: "return повертає результат з функції назад у місце виклику. Після return функція одразу завершується.",
        en: "return sends a result from the function back to the caller. After return the function ends immediately.",
        tr: "return fonksiyondan sonucu çağıran yere geri gönderir. return'den sonra fonksiyon hemen biter."
      },
      code: "def add(a, b):\n    return a + b\n\nprint(add(2, 3))  # 5"
    },
    {
      kw: "f-string fstring f-ряд fстрока форматув format f-dize",
      a: {
        uk: "f-рядок підставляє значення змінних просто в текст: перед лапками напиши f, а змінну візьми у фігурні дужки.",
        en: "An f-string puts variable values right into the text: write f before the quotes and take the variable in curly braces.",
        tr: "f-dize, değişken değerlerini doğrudan metne koyar: tırnaktan önce f yaz, değişkeni süslü paranteze al."
      },
      code: "name = \"Olya\"\nprint(f\"Привіт, {name}!\")"
    },
    {
      kw: "modulo остач залиш остаток остаток остатча %  парн непарн",
      a: {
        uk: "Оператор % дає остачу від ділення. Так перевіряють парність: n % 2 == 0 означає, що число парне.",
        en: "The % operator gives the remainder of division. It checks parity: n % 2 == 0 means the number is even.",
        tr: "% operatörü bölmeden kalanı verir. Çiftlik böyle denetlenir: n % 2 == 0 ise sayı çifttir."
      },
      code: "print(7 % 3)  # 1\nprint(8 % 2)  # 0 — число парне"
    },
    {
      kw: "цілочис целочисл integer division ділення націло націло ціла tam bölme //",
      a: {
        uk: "Оператор // ділить націло і відкидає дробову частину. Звичайний / завжди дає float.",
        en: "The // operator divides and drops the fractional part. Plain / always gives a float.",
        tr: "// operatörü tam böler ve ondalık kısmı atar. Düz / her zaman float verir."
      },
      code: "print(7 // 2)  # 3\nprint(7 / 2)   # 3.5"
    },
    {
      kw: "sorted sort reverse сортув упоряд развер спадання зростання sırala tersine",
      a: {
        uk: "sorted() повертає новий відсортований список, а .sort() сортує наявний. Параметр reverse=True сортує за спаданням.",
        en: "sorted() returns a new sorted list, while .sort() sorts the existing one. reverse=True sorts in descending order.",
        tr: "sorted() yeni sıralı bir liste verir, .sort() ise mevcut listeyi sıralar. reverse=True büyükten küçüğe sıralar."
      },
      code: "a = [3, 1, 2]\nprint(sorted(a))                # [1, 2, 3]\nprint(sorted(a, reverse=True))  # [3, 2, 1]"
    },
    {
      kw: "break continue перерв продов пропуск вихід з циклу durdur devam",
      a: {
        uk: "break негайно перериває цикл, а continue пропускає решту поточної ітерації та переходить до наступної.",
        en: "break stops the loop immediately; continue skips the rest of the current iteration and moves to the next one.",
        tr: "break döngüyü hemen durdurur; continue o turun geri kalanını atlayıp sıradakine geçer."
      },
      code: "for i in range(10):\n    if i == 3:\n        continue\n    if i == 6:\n        break\n    print(i)  # 0 1 2 4 5"
    },
    {
      kw: "bool boolean true false буле логічн логич истина dogru mantıksal",
      a: {
        uk: "True і False — булеві значення. Пиши їх з великої літери і без лапок: у лапках це вже рядок.",
        en: "True and False are boolean values. Write them capitalised and without quotes: in quotes it is already a string.",
        tr: "True ve False mantıksal değerlerdir. Büyük harfle ve tırnaksız yaz: tırnak içinde bu artık bir dizedir."
      },
      code: "print(True and False)  # False\nprint(True or False)   # True"
    },
    {
      kw: "upper lower split join метод рядка метод строки метод dize büyük küçük",
      a: {
        uk: "У рядків є корисні методи: .upper() і .lower() змінюють регістр, .split() ріже рядок на список, а .join() склеює список у рядок.",
        en: "Strings have handy methods: .upper() and .lower() change case, .split() cuts a string into a list, and .join() glues a list into a string.",
        tr: "Dizelerin kullanışlı metotları vardır: .upper() ve .lower() büyük/küçük harfi değiştirir, .split() dizeyi listeye böler, .join() listeyi dizede birleştirir."
      },
      code: "s = \"python\"\nprint(s.upper())          # PYTHON\nprint(\"a,b\".split(\",\"))  # ['a', 'b']"
    },
    {
      kw: "import module модуль пакет package math modül імпорт",
      a: {
        uk: "Модуль — це файл із готовим кодом. import підключає його, і функції модуля стають доступні через крапку. Модуль math є в самому Python, його встановлювати не треба.",
        en: "A module is a file with ready code. import connects it, and its functions become available via a dot. The math module ships with Python; nothing to install.",
        tr: "Modül, hazır kod içeren bir dosyadır. import onu bağlar, fonksiyonları noktayla kullanılabilir. math modülü Python ile gelir; kurman gerekmez."
      },
      code: "import math\nprint(math.sqrt(16))  # 4.0"
    },
    {
      kw: "indentation відступ отступ indentationerror табуляц tab пропуск girinti",
      a: {
        uk: "Python розуміє структуру коду за відступами. Усі рядки одного блоку починай однаково — зазвичай це 4 пропуски. Не мішай пропуски й таби.",
        en: "Python reads code structure from indentation. Start all lines of one block the same way — usually 4 spaces. Do not mix spaces and tabs.",
        tr: "Python kod yapısını girintiden okur. Bir bloğun tüm satırlarını aynı başlat — genelde 4 boşluk. Boşlukla sekmeyi karıştırma."
      },
      code: "if True:\n    print(\"так\")  # рівно 4 пропуски"
    },
    {
      kw: "nameerror ім'я имя name error не визнач не найден не знає ad hatası",
      a: {
        uk: "NameError — Python не знає такого імені. Зазвичай змінну ще не створено або в імені є одруківка.",
        en: "NameError — Python does not know that name. Usually the variable was not created yet or the name has a typo.",
        tr: "NameError — Python bu adı bilmiyor. Genelde değişken henüz oluşturulmamıştır ya da adda yazım yanlışı vardır."
      },
      code: "x = 5\nprint(x)  # спочатку створи, потім використовуй"
    },
    {
      kw: "typeerror тип type error операнд concatenate несуміс тип hatası",
      a: {
        uk: "TypeError — операція з'єднала несумісні типи. Найчастіше це спроба додати рядок і число: input() завжди повертає рядок.",
        en: "TypeError — an operation mixed incompatible types. Most often it is adding a string and a number: input() always returns a string.",
        tr: "TypeError — bir işlem uyuşmayan türleri karıştırdı. En sık neden dizeyle sayıyı toplamaktır: input() her zaman dize verir."
      },
      code: "n = int(input())\nprint(\"Вік: \" + str(n))"
    },
    {
      kw: "zerodivision ділення ділити нуль на ноль деление division zero sıfıra bölme",
      a: {
        uk: "ZeroDivisionError — ділення на нуль. На нуль ділити не можна, тому перевіряй дільник перед діленням.",
        en: "ZeroDivisionError — division by zero. Dividing by zero is not allowed, so check the divisor first.",
        tr: "ZeroDivisionError — sıfıra bölme. Sıfıra bölme yapılamaz, önce böleni denetle."
      },
      code: "if b != 0:\n    print(a / b)\nelse:\n    print(\"На нуль ділити не можна\")"
    },
    {
      kw: "indexerror index індекс error вихід виход за меж межа граница index hatası",
      a: {
        uk: "IndexError — індекс виходить за межі списку. Останній елемент має індекс len(a) - 1.",
        en: "IndexError — the index is outside the list. The last item has the index len(a) - 1.",
        tr: "IndexError — indeks listenin dışında. Son öğenin indeksi len(a) - 1'dir."
      },
      code: "a = [1, 2, 3]\nprint(a[len(a) - 1])  # 3"
    }
  ];

  const SUGGEST = [
    { uk: "Як вивести текст?", en: "How do I print text?", tr: "Metin nasıl yazdırılır?", q: "print" },
    { uk: "Що таке змінна?", en: "What is a variable?", tr: "Değişken nedir?", q: "variable" },
    { uk: "Як працює if?", en: "How does if work?", tr: "if nasıl çalışır?", q: "if else" },
    { uk: "Що таке цикл for?", en: "What is a for loop?", tr: "for döngüsü nedir?", q: "for range" }
  ];

  function norm(s) {
    return String(s || "").toLowerCase().replace(/ё/g, "е").replace(/[^a-zа-яіїєґ0-9+%\/\-]+/gi, " ");
  }

  function matchKB(question) {
    const q = norm(question);
    if (!q.trim()) return null;
    const words = q.split(" ").filter(Boolean);
    let best = null, bestScore = 0;
    KB.forEach((e) => {
      let score = 0;
      e.kw.toLowerCase().split(" ").forEach((k) => {
        if (k.length <= 1) return;
        /* короткі ключі («на», «if», «int») ловимо лише цілим словом:
           інакше «напиши програму» потрапляє в ZeroDivisionError через «на» */
        if (k.length < 5) { if (words.indexOf(k) !== -1) score++; }
        else if (q.indexOf(k) !== -1) score++;
      });
      if (score > bestScore) { bestScore = score; best = e; }
    });
    return bestScore >= 1 ? best : null;
  }

  /* ---------- Пояснення помилок ---------- */
  const ERR_TYPES = [
    "IndentationError", "ModuleNotFoundError", "SyntaxError", "NameError",
    "TypeError", "ZeroDivisionError", "IndexError", "ValueError",
    "EOFError", "AttributeError", "RecursionError"
  ];

  const ERR = {
    SyntaxError: {
      what: {
        uk: "SyntaxError — Python не зрозумів сам запис команди.",
        en: "SyntaxError — Python could not parse the command itself.",
        tr: "SyntaxError — Python komutun yazılışını anlayamadı."
      },
      cause: {
        uk: "Найчастіше це незакрита лапка чи дужка або символ не за правилами Python.",
        en: "Usually an unclosed quote or bracket, or a symbol against Python rules.",
        tr: "Genelde kapanmamış bir tırnak ya da parantez, veya Python kurallarına uymayan bir sembol."
      },
      fix: {
        uk: "Перевір вказаний рядок: закрий усі лапки й дужки, прибери зайві символи.",
        en: "Check the reported line: close all quotes and brackets, remove stray symbols.",
        tr: "Bildirilen satırı denetle: tüm tırnak ve parantezleri kapat, fazladan sembolleri kaldır."
      },
      code: "print(\"Привіт\")  # лапки закрито"
    },
    IndentationError: {
      what: {
        uk: "IndentationError — неправильний відступ.",
        en: "IndentationError — the indentation is wrong.",
        tr: "IndentationError — girinti hatalı."
      },
      cause: {
        uk: "Рядки одного блоку мають починатися з однакової кількості пропусків, зазвичай чотирьох.",
        en: "Lines of one block must start with the same number of spaces, usually four.",
        tr: "Bir bloğun satırları aynı sayıda boşlukla başlamalı, genelde dört."
      },
      fix: {
        uk: "Вирівняй відступи: після двокрапки починай наступний рядок з 4 пропусків і не мішай пропуски з табами.",
        en: "Align the indentation: after a colon start the next line with 4 spaces and do not mix spaces with tabs.",
        tr: "Girintileri eşitle: iki noktadan sonra yeni satırı 4 boşlukla başlat, boşlukla sekmeyi karıştırma."
      },
      code: "if x > 0:\n    print(\"додатне\")"
    },
    NameError: {
      what: { uk: "", en: "", tr: "" },
      cause: {
        uk: "Змінну чи функцію ще не створено, або в імені є одруківка.",
        en: "The variable or function was not created yet, or the name has a typo.",
        tr: "Değişken ya da fonksiyon henüz oluşturulmamış veya adda yazım yanlışı var."
      },
      fix: {
        uk: "Створи змінну до того, як використовувати її, і перевір написання імені літера за літерою.",
        en: "Create the variable before using it, and check the spelling of the name letter by letter.",
        tr: "Değişkeni kullanmadan önce oluştur ve adı harf harf denetle."
      },
      code: "x = 5\nprint(x)"
    },
    TypeError: {
      what: {
        uk: "TypeError — операція з'єднала несумісні типи даних.",
        en: "TypeError — an operation mixed incompatible data types.",
        tr: "TypeError — bir işlem uyuşmayan veri türlerini karıştırdı."
      },
      cause: {
        uk: "Найчастіше це спроба додати рядок і число: input() завжди повертає рядок.",
        en: "Most often it is adding a string and a number: input() always returns a string.",
        tr: "En sık neden dizeyle sayıyı toplamaktır: input() her zaman dize verir."
      },
      fix: {
        uk: "Перетвори тип: int(input()) для числа або str(x), щоб підставити число в рядок.",
        en: "Convert the type: int(input()) for a number, or str(x) to put a number into a string.",
        tr: "Türü dönüştür: sayı için int(input()), sayıyı dizeye koymak için str(x)."
      },
      code: "n = int(input())\nprint(\"Вік: \" + str(n))"
    },
    ZeroDivisionError: {
      what: {
        uk: "ZeroDivisionError — ділення на нуль.",
        en: "ZeroDivisionError — division by zero.",
        tr: "ZeroDivisionError — sıfıra bölme."
      },
      cause: {
        uk: "Дільник виявився нулем, а на нуль ділити не можна.",
        en: "The divisor turned out to be zero, and dividing by zero is not allowed.",
        tr: "Bölen sıfır çıktı; sıfıra bölme yapılamaz."
      },
      fix: {
        uk: "Перед діленням перевір, чи дільник не дорівнює нулю.",
        en: "Before dividing, check that the divisor is not zero.",
        tr: "Bölmeden önce bölenin sıfır olmadığını denetle."
      },
      code: "if b != 0:\n    print(a / b)\nelse:\n    print(\"На нуль ділити не можна\")"
    },
    IndexError: {
      what: {
        uk: "IndexError — звернення до елемента, якого немає у списку.",
        en: "IndexError — access to an item that the list does not have.",
        tr: "IndexError — listede olmayan bir öğeye erişim."
      },
      cause: {
        uk: "Індекс більший за довжину списку. Останній елемент має індекс len(a) - 1.",
        en: "The index is larger than the list length. The last item has the index len(a) - 1.",
        tr: "İndeks liste uzunluğundan büyük. Son öğenin indeksi len(a) - 1'dir."
      },
      fix: {
        uk: "Перевір довжину списку і не виходь за її межі.",
        en: "Check the list length and stay inside its bounds.",
        tr: "Liste uzunluğunu denetle ve sınırlarının dışına çıkma."
      },
      code: "a = [1, 2, 3]\nif i < len(a):\n    print(a[i])"
    },
    ValueError: {
      what: {
        uk: "ValueError — тип правильний, а саме значення не підходить.",
        en: "ValueError — the type is right but the value itself does not fit.",
        tr: "ValueError — tür doğru ama değerin kendisi uymuyor."
      },
      cause: {
        uk: "Часто це спроба зробити int() з тексту, який не є числом, наприклад int(\"abc\") або порожній input.",
        en: "Often it is int() applied to text that is not a number, like int(\"abc\") or an empty input.",
        tr: "Genelde sayı olmayan bir metne int() uygulamaktır; örneğin int(\"abc\") ya da boş girdi."
      },
      fix: {
        uk: "Переконайся, що у значенні справді число — без літер і зайвих символів.",
        en: "Make sure the value really is a number — no letters or stray symbols.",
        tr: "Değerin gerçekten sayı olduğundan emin ol — harf ya da fazladan sembol olmadan."
      },
      code: "s = input().strip()\nif s.isdigit():\n    print(int(s))"
    },
    EOFError: {
      what: {
        uk: "EOFError — програма чекала введення з клавіатури, а його не було.",
        en: "EOFError — the program waited for keyboard input but none came.",
        tr: "EOFError — program klavye girdisi bekledi ama gelmedi."
      },
      cause: {
        uk: "Код викликано там, де ввести текст неможливо, або введення обірвалося.",
        en: "The code ran where typing input is impossible, or the input ended early.",
        tr: "Kod, girdi yazmanın mümkün olmadığı bir yerde çalıştı ya da girdi erken bitti."
      },
      fix: {
        uk: "Якщо задачу перевіряють автоматично, прибери зайві input(): дані мають надходити самі.",
        en: "If the task is judged automatically, remove extra input() calls: the data arrives on its own.",
        tr: "Görev otomatik değerlendiriliyorsa gereksiz input() çağrılarını kaldır: veri kendi gelir."
      },
      code: "n = int(input())  # лише там, де є що зчитати"
    },
    ModuleNotFoundError: {
      what: { uk: "", en: "", tr: "" },
      cause: {
        uk: "Модуль не встановлено або в його назві є одруківка.",
        en: "The module is not installed or its name has a typo.",
        tr: "Modül kurulu değil ya da adında yazım yanlışı var."
      },
      fix: {
        uk: "Перевір назву модуля. Стандартні модулі, як-от math, працюють одразу; сторонні треба встановити через pip install.",
        en: "Check the module name. Standard modules like math work out of the box; third-party ones need pip install.",
        tr: "Modül adını denetle. math gibi standart modüller hemen çalışır; üçüncü parti modüller pip install ister."
      },
      code: "import math\nprint(math.pi)"
    },
    AttributeError: {
      what: {
        uk: "AttributeError — у цього об'єкта немає такого атрибута чи методу.",
        en: "AttributeError — this object has no such attribute or method.",
        tr: "AttributeError — bu nesnede böyle bir öznitelik ya da metot yok."
      },
      cause: {
        uk: "Метод викликано в об'єкта неправильного типу або в назві методу є одруківка.",
        en: "The method was called on an object of the wrong type, or the method name has a typo.",
        tr: "Metot yanlış türde bir nesne üzerinde çağrıldı ya da metot adında yazım yanlışı var."
      },
      fix: {
        uk: "Перевір, до чого застосовуєш метод: .upper() є у рядків, але не у чисел.",
        en: "Check what you apply the method to: .upper() exists for strings, not for numbers.",
        tr: "Metodu neye uyguladığını denetle: .upper() dizelerde vardır, sayılarda yoktur."
      },
      code: "s = \"python\"\nprint(s.upper())"
    },
    RecursionError: {
      what: {
        uk: "RecursionError — функція викликає сама себе без кінця.",
        en: "RecursionError — the function calls itself endlessly.",
        tr: "RecursionError — fonksiyon kendini sonu olmadan çağırıyor."
      },
      cause: {
        uk: "У рекурсії немає базового випадку або він не спрацьовує, тому виклики ніколи не завершуються.",
        en: "The recursion has no base case, or the base case never triggers, so the calls never finish.",
        tr: "Özyinelemede temel durum yok ya da hiç tetiklenmiyor, bu yüzden çağrılar bitmiyor."
      },
      fix: {
        uk: "Додай умову виходу, за якої функція повертає значення без нового виклику себе.",
        en: "Add an exit condition where the function returns a value without calling itself again.",
        tr: "Fonksiyonun kendini çağırmadan değer döndürdüğü bir çıkış koşulu ekle."
      },
      code: "def f(n):\n    if n <= 0:\n        return 0\n    return f(n - 1)"
    }
  };

  function explainError(rawText) {
    const s = String(rawText || "");
    let type = null;
    for (let i = 0; i < ERR_TYPES.length; i++) {
      if (s.indexOf(ERR_TYPES[i]) !== -1) { type = ERR_TYPES[i]; break; }
    }
    const parts = [];
    const vars = {};

    const mName = s.match(/name ['\u0022\u2018\u2019\u201C\u201D]([^'\u0022\u2018\u2019\u201C\u201D]+)['\u0022\u2018\u2019\u201C\u201D] is not defined/);
    const mMod = s.match(/No module named ['\u0022]([^'\u0022]+)['\u0022]/);

    let code = null;
    if (type === "NameError") {
      vars.name = mName ? mName[1] : "?";
      parts.push(tx("errNameWhat", vars));
    } else if (type === "ModuleNotFoundError") {
      vars.name = mMod ? mMod[1] : "?";
      parts.push(tx("errModuleWhat", vars));
    }

    if (type && ERR[type]) {
      const e = ERR[type];
      const w = pick(e.what);
      if (w) parts.push(w);
      parts.push(pick(e.cause));
      parts.push(pick(e.fix));
      code = e.code || null;
    } else {
      parts.push(tx("errUnknownWhat"));
      parts.push(tx("errUnknownCause"));
      parts.push(tx("errUnknownFix"));
    }

    const mFile = s.match(/File ['\u0022]([^'\u0022]+)['\u0022],\s*line\s+(\d+)/i);
    const mLine = s.match(/\bline\s+(\d+)/i);
    if (mFile) {
      parts.push(tx("errLineFile", { n: mFile[2], f: mFile[1].split(/[\/\\]/).pop() }));
    } else if (mLine) {
      parts.push(tx("errLine", { n: mLine[1] }));
    }

    return { text: parts.join(" "), code: code };
  }

  function looksLikeError(text) {
    return /traceback/i.test(text) || /[A-Za-z]Error\b/.test(text);
  }

  /* ---------- Маскот: статична SVG-розмітка (без користувацьких даних) ---------- */
  const SVG_NS = "http://www.w3.org/2000/svg";
  function mascotSVG(cls) {
    const svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("viewBox", "0 0 96 96");
    svg.setAttribute("class", cls || "pychik-svg");
    svg.setAttribute("aria-hidden", "true");
    svg.innerHTML =
      '<g class="pychik-body">' +
        '<path class="pychik-tail" d="M26 74 C10 78 8 62 18 60 C26 58 28 66 22 67" fill="none" stroke-width="6" stroke-linecap="round"/>' +
        '<ellipse class="pychik-head" cx="50" cy="46" rx="30" ry="27"/>' +
        '<path class="pychik-tuft" d="M50 19 C48 12 54 10 56 14 C60 9 66 13 62 19 Z"/>' +
        '<g class="pychik-eye pychik-eye-l">' +
          '<circle class="pychik-sclera" cx="40" cy="43" r="7.5"/>' +
          '<circle class="pychik-pupil" cx="40" cy="44" r="3.2"/>' +
          '<rect class="pychik-lid" x="31" y="33" width="18" height="20" rx="6"/>' +
        '</g>' +
        '<g class="pychik-eye pychik-eye-r">' +
          '<circle class="pychik-sclera" cx="62" cy="43" r="7.5"/>' +
          '<circle class="pychik-pupil" cx="62" cy="44" r="3.2"/>' +
          '<rect class="pychik-lid" x="53" y="33" width="18" height="20" rx="6"/>' +
        '</g>' +
        '<path class="pychik-cheek" d="M31 54 q3 3 6 1" fill="none" stroke-width="2" stroke-linecap="round" opacity=".5"/>' +
        '<path class="pychik-mouth pychik-mouth-smile" d="M44 59 q6 5 12 0" fill="none" stroke-width="3" stroke-linecap="round"/>' +
        '<path class="pychik-mouth pychik-mouth-open" d="M44 57 q6 9 12 0 q-6 3 -12 0 Z" stroke-width="2"/>' +
        '<path class="pychik-mouth pychik-mouth-sad" d="M44 62 q6 -5 12 0" fill="none" stroke-width="3" stroke-linecap="round"/>' +
      '</g>' +
      '<g class="pychik-dots" opacity="0">' +
        '<circle cx="76" cy="22" r="3"/><circle cx="84" cy="14" r="2.4"/><circle cx="90" cy="8" r="2"/>' +
      '</g>';
    return svg;
  }

  /* «Лапка» туторіалу: витягнута вбік +X, тому повертається під кутом до цілі. */
  function pawSVG(cls) {
    const svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("viewBox", "0 0 44 44");
    svg.setAttribute("class", cls || "pychik-paw-svg");
    svg.setAttribute("aria-hidden", "true");
    svg.innerHTML =
      '<path d="M2 30 q10 -2 18 -8" fill="none" stroke-width="7" stroke-linecap="round" class="pychik-paw-arm"/>' +
      '<circle cx="25" cy="19" r="8" class="pychik-paw-hand"/>' +
      '<path d="M31 17 l9 -1" fill="none" stroke-width="5.5" stroke-linecap="round" class="pychik-paw-arm"/>';
    return svg;
  }

  /* ---------- Стан ---------- */
  let inited = false;
  let root = null, fab = null, panel = null, msgsEl = null, chipsEl = null,
      inputEl = null, mascotEl = null,
      spotEl = null, petEl = null, pawEl = null, sayEl = null,
      sayTextEl = null, sayCountEl = null,
      sayPrevBtn = null, sayAutoBtn = null, sayNextBtn = null;
  let ctx = { section: "home" };
  let thinkTimer = null;

  function el(tag, cls, text) {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text != null) node.textContent = text;
    return node;
  }

  function mood(name) {
    if (!root) return;
    ["idle", "think", "happy", "sad"].forEach((m) => root.classList.remove("mood-" + m));
    root.classList.add("mood-" + (["think", "happy", "sad"].indexOf(name) !== -1 ? name : "idle"));
  }

  /* ---------- Чіпи підказок ---------- */
  const CHIPS = {
    python: ["Як вивести текст?", "Як зчитати input?", "Що таке f-рядок?", "Що таке TypeError?"],
    pythonEn: ["How do I print text?", "How do I read input?", "What is an f-string?", "What is TypeError?"],
    course: ["Що таке змінна?", "Як працює if?", "Що таке цикл for?", "Навіщо потрібен return?"],
    courseEn: ["What is a variable?", "How does if work?", "What is a for loop?", "Why do I need return?"],
    modules: ["Що таке модуль і import?", "Що таке словник dict?", "Що таке список?", "Як відсортувати список?"],
    modulesEn: ["What is a module and import?", "What is a dict?", "What is a list?", "How do I sort a list?"],
    tasks: ["Що таке цикл for?", "Як працює while?", "Що дає оператор %?", "Що роблять break і continue?"],
    tasksEn: ["What is a for loop?", "How does while work?", "What does % do?", "What do break and continue do?"],
    home: ["Як вивести текст?", "Що таке змінна?", "Як працює if?", "Що таке цикл for?"],
    homeEn: ["How do I print text?", "What is a variable?", "How does if work?", "What is a for loop?"]
  };

  function chipSet() {
    const L = lang();
    const key = (CHIPS[ctx.section] ? ctx.section : "home");
    const ukSet = CHIPS[key];
    const enSet = CHIPS[key + "En"];
    return L === "uk" ? ukSet : L === "tr" ? enSet : enSet;
  }

  function renderChips() {
    if (!chipsEl) return;
    while (chipsEl.firstChild) chipsEl.removeChild(chipsEl.firstChild);
    const tourChip = el("button", "pychik-chip pychik-chip-tour", tx("tourChip"));
    tourChip.type = "button";
    tourChip.addEventListener("click", () => { sfx("click"); tour(); });
    chipsEl.appendChild(tourChip);
    chipSet().forEach((q) => {
      const b = el("button", "pychik-chip", q);
      b.type = "button";
      b.addEventListener("click", () => { sfx("click"); ask(q); });
      chipsEl.appendChild(b);
    });
  }

  /* ---------- Повідомлення ---------- */
  function addCodeBlock(container, code) {
    const wrap = el("div", "pychik-code");
    const pre = el("pre", "pychik-pre");
    pre.textContent = code;
    const btn = el("button", "pychik-copy", tx("copy"));
    btn.type = "button";
    btn.addEventListener("click", () => {
      const done = (ok) => {
        toast(ok ? tx("copied") : tx("copyFail"));
        if (ok) sfx("pop");
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code).then(() => done(true)).catch(() => done(false));
      } else {
        try {
          const ta = document.createElement("textarea");
          ta.value = code;
          ta.style.position = "fixed";
          ta.style.opacity = "0";
          document.body.appendChild(ta);
          ta.select();
          const ok = document.execCommand("copy");
          ta.remove();
          done(ok);
        } catch (e) { done(false); }
      }
    });
    wrap.appendChild(pre);
    wrap.appendChild(btn);
    container.appendChild(wrap);
  }

  function addMsg(who, text, code, suggestions, note) {
    if (!msgsEl) return null;
    const m = el("div", "pychik-msg pychik-msg-" + who);
    const bubble = el("div", who === "bot" ? "pychik-bubble pychik-bubble-bot" : "pychik-bubble pychik-bubble-user");
    bubble.textContent = text;
    m.appendChild(bubble);
    if (code) addCodeBlock(bubble, code);
    if (note) {
      const n = el("div", "pychik-note");
      n.appendChild(el("span", "pychik-note-label", tx("whyLabel") + ":"));
      n.appendChild(document.createTextNode(" " + note));
      bubble.appendChild(n);
    }
    if (suggestions && suggestions.length) {
      const srow = el("div", "pychik-suggest");
      srow.appendChild(el("span", "pychik-suggest-label", tx("suggest")));
      suggestions.forEach((s) => {
        const b = el("button", "pychik-chip", s.label);
        b.type = "button";
        b.addEventListener("click", () => { sfx("click"); ask(s.q); });
        srow.appendChild(b);
      });
      bubble.appendChild(srow);
    }
    msgsEl.appendChild(m);
    msgsEl.scrollTop = msgsEl.scrollHeight;
    return m;
  }

  function greet() {
    const g = {
      python: "greetPython", course: "greetCourse", modules: "greetModules",
      tasks: "greetTasks", default: "greetDefault"
    };
    addMsg("bot", tx(g[ctx.section] || g.default));
  }

  /* ---------- Локальний «мозок» розмови (pychik-ai.js) ---------- */
  const STATS_TXT = {
    uk: { course: "Курс", tasks: "Задачі", modules: "Модулі", ach: "Досягнення", of: "із" },
    en: { course: "Course", tasks: "Tasks", modules: "Modules", ach: "Achievements", of: "of" },
    tr: { course: "Kurs", tasks: "Görevler", modules: "Modüller", ach: "Başarımlar", of: "/" }
  };

  function kbWords() {
    const seen = {};
    KB.forEach((e) => {
      e.kw.toLowerCase().split(" ").forEach((k) => { if (k.length >= 4) seen[k] = 1; });
    });
    return Object.keys(seen);
  }

  /* назву розділу бере з живої навігації — тож вона завжди поточною мовою */
  function routeLabel(route) {
    const node = document.querySelector('.rail-btn[data-route="' + route + '"] .rail-label');
    return node ? node.textContent.trim() : String(route);
  }

  function statsLine() {
    const S = STATS_TXT[lang()] || STATS_TXT.en;
    const parts = [];
    try {
      const C = global.Course;
      if (C && C.count) {
        const done = typeof C.done === "function" ? C.done() : C.done;
        parts.push(S.course + ": " + done + " " + S.of + " " + C.count);
      }
    } catch (e) { /* модуль ще не ініціалізований */ }
    try {
      const T = global.Tasks;
      if (T && T.count && T.list) {
        const solved = T.list().filter((x) => T.isSolved(x.id)).length;
        parts.push(S.tasks + ": " + solved + " " + S.of + " " + T.count);
      }
    } catch (e) { /* */ }
    try {
      if (global.Modules && global.Modules.installed) parts.push(S.modules + ": " + global.Modules.installed().length);
    } catch (e) { /* */ }
    try {
      if (global.Achievements && global.Achievements.getUnlocked) parts.push(S.ach + ": " + global.Achievements.getUnlocked().length);
    } catch (e) { /* */ }
    return parts.join(" · ");
  }

  /* Кладемо код у редактор — той самий шлях, що кнопка «приклад» у «Модулях». */
  function toPad(code) {
    const editor = $("#code");
    if (editor && editor.tagName === "TEXTAREA") {
      editor.value = code;
      editor.dispatchEvent(new Event("input", { bubbles: true }));
    }
    if (global.App && global.App.route) global.App.route("python");
    toast(tx("padToast"));
  }

  function applyAct(act, code) {
    if (!act) return;
    const run = () => {
      if (act === "tour") { tour(); return; }
      if (act === "pad") { if (code) toPad(code); return; }
      if (act === "whatsnew") {
        if (global.AppUpdates && global.AppUpdates.showWhatsNew) global.AppUpdates.showWhatsNew();
        return;
      }
      if (act.indexOf("route:") === 0) {
        if (global.App && global.App.route) global.App.route(act.slice(6));
        return;
      }
      if (act.indexOf("lang:") === 0) {
        if (global.I18n && global.I18n.setLang) global.I18n.setLang(act.slice(5));
        return;
      }
      if (act.indexOf("sound:") === 0) {
        const on = act.slice(6) !== "0";
        try { if (global.Settings) global.Settings.set("sfx", on); } catch (e) { /* */ }
        try { if (global.Audio2 && global.Audio2.setSfx) global.Audio2.setSfx(on); } catch (e) { /* */ }
        try { if (global.Settings && global.Settings.syncUI) global.Settings.syncUI(); } catch (e) { /* */ }
      }
    };
    /* дає користувачеві прочитати репліку, перш ніж екран почне рухатися */
    setTimeout(run, 700);
  }

  /* Місточок: мозок не знає про App, I18n чи Editor — усе це приходить звідси. */
  function aiBridge() {
    return {
      lang: lang,
      section: () => ctx.section,
      kb: (q) => {
        const e = matchKB(q);
        return e ? { a: e.a, code: e.code || null } : null;
      },
      kbWords: kbWords,
      routeLabel: routeLabel,
      goto: (r) => { if (global.App && global.App.route) global.App.route(r); },
      setLang: (c) => { if (global.I18n && global.I18n.setLang) global.I18n.setLang(c); },
      sound: (on) => { try { if (global.Settings) global.Settings.set("sfx", on); } catch (e) { /* */ } },
      whatsNew: () => { if (global.AppUpdates && global.AppUpdates.showWhatsNew) global.AppUpdates.showWhatsNew(); },
      tour: () => tour(),
      name: () => {
        try {
          if (global.Profile && global.Profile.getNickname) return global.Profile.getNickname() || "";
          return localStorage.getItem("app.nickname") || "";
        } catch (e) { return ""; }
      },
      stats: statsLine
    };
  }

  function aiAsk(question) {
    const AI = global.PychikAI;
    if (!AI || !AI.think) return false;
    let r = null;
    try { r = AI.think(question, aiBridge()); } catch (e) { r = null; }
    if (!r || !r.text) return false;
    mood(r.mood || "happy");
    addMsg("bot", r.text, r.code || null, r.sugs || null, r.why || null);
    applyAct(r.act, r.code);
    return true;
  }

  /* ---------- Мозок ---------- */
  function answer(question) {
    if (looksLikeError(question)) {
      const r = explainError(question);
      mood("sad");
      addMsg("bot", r.text, r.code);
      return;
    }
    /* спершу розмовний мозок: він сам звертається до бази знань, коли треба */
    if (aiAsk(question)) return;
    const entry = matchKB(question);
    if (entry) {
      mood("happy");
      addMsg("bot", pick(entry.a), entry.code || null);
    } else {
      mood("sad");
      addMsg("bot", tx("fallback"), null, SUGGEST.map((s) => ({ label: pick(s), q: s.q })));
    }
  }

  function ask(question) {
    const q = String(question || "").trim();
    if (!q) return;
    if (panel && !panel.classList.contains("pychik-open")) open();
    addMsg("user", q);
    mood("think");
    clearTimeout(thinkTimer);
    thinkTimer = setTimeout(() => {
      try { answer(q); } catch (e) { mood("sad"); addMsg("bot", tx("fallback")); }
    }, 320);
  }

  /* ---------- Тур ---------- */
  /* ---------- Туторіал: кроки автопілота ----------
     Кожен крок або «натискає» пункт навігації справжнім кліком (nav+click),
     або підсвічує живий елемент розділу (sel+show). Репліка маскота — у say. */
  const TUTOR_STEPS = [
    { route: "home", sel: "#view-home .hero", act: "show",
      say: {
        uk: "Привіт! Я Пайтончик — твій провідник цим сайтом. Тримайся міцніше за клавіатуру: зараз я покажу тут усе. І ні, я не вкушу, я ж на Python.",
        en: "Hi! I am Pythonchik, your guide around this site. Hold on to your keyboard: I am about to show you everything. And no, I won't bite — I'm written in Python.",
        tr: "Merhaba! Ben Pythonchik, bu sitenin rehberiyim. Klavyeye sıkı tutun: şimdi her yeri göstereceğim. Ve hayır, ısırmam — ben Python'ım."
      } },
    { route: "python", nav: "python", act: "click",
      say: {
        uk: "Оце — Python-майданчик. Натискаю сам, бо мишки в мене немає, є лише лапки. Дивись: справжній клік, справжній перехід!",
        en: "This is the Python playground. I click it myself — I have no mouse, only paws. Look: a real click and a real page switch!",
        tr: "Burası Python alanı. Kendim tıklıyorum — farem yok, sadece patilerim var. Bak: gerçek tıklama, gerçek geçiş!"
      } },
    { route: "python", sel: "#run", act: "show",
      say: {
        uk: "Ця кнопка запускає твій код у браузері. Я сидітиму поруч — як талісман і як служба підтримки водночас.",
        en: "This button runs your code right in the browser. I'll sit nearby — as a mascot and as a support desk at the same time.",
        tr: "Bu düğme kodunu tarayıcıda çalıştırır. Ben yanında oturacağım — hem maskot hem destek masası olarak."
      } },
    { route: "modules", nav: "modules", act: "click",
      say: {
        uk: "Магазинчик модулів: тут живуть бібліотеки. numpy, pandas, навіть qrcode — ставлю їх собі сам і тобі допоможу.",
        en: "The module shop: libraries live here. numpy, pandas, even qrcode — I install them myself and I'll help you too.",
        tr: "Modül dükkânı: kütüphaneler burada yaşar. numpy, pandas, hatta qrcode — kendim kurarım, sana da yardım ederim."
      } },
    { route: "course", nav: "course", act: "click",
      say: {
        uk: "Курс — це сходинки: теорія, приклад і практика. Наступний урок відкривається після розв'язаної практики. Як у житті, тільки добріше.",
        en: "The course is a ladder: theory, example, practice. The next lesson opens once you solve the practice. Like life, but kinder.",
        tr: "Kurs bir merdiven: teori, örnek, alıştırma. Sonraki ders, alıştırmayı çözünce açılır. Hayat gibi ama daha nazik."
      } },
    { route: "course", sel: "#courseList .course-lesson", act: "show",
      say: {
        uk: "Ось урок. Усередині — приклад, який запускається одним дотиком, і задача з автоперевіркою. Перший урок уже чекає на тебе.",
        en: "Here is a lesson. Inside there is an example that runs with one tap and a task with automatic checking. The first lesson is already waiting for you.",
        tr: "İşte bir ders. İçinde tek dokunuşla çalışan bir örnek ve otomatik denetimli bir görev var. İlk ders seni bekliyor."
      } },
    { route: "tasks", nav: "tasks", act: "click",
      say: {
        uk: "Задачі! Тут тренуються перед олімпіадами. Я вірю в тебе більше, ніж у рекурсію без базового випадку.",
        en: "Tasks! This is where people train for olympiads. I believe in you more than in recursion without a base case.",
        tr: "Görevler! Burada olimpiyatlara hazırlanılır. Sana, taban durumu olmayan özyinelemeden daha çok inanıyorum."
      } },
    { route: "tasks", sel: "#tasksList .task-card", act: "show",
      say: {
        uk: "Кожна задача має тести, підказку і чернетку коду. Бали за розв'язок капають у профіль — приємно, як і має бути.",
        en: "Every task has tests, a hint and a code draft. Points for solving it drip into your profile — nice, as it should be.",
        tr: "Her görevde testler, ipucu ve kod taslağı var. Çözünce puanlar profiline işler — olması gerektiği gibi hoş."
      } },
    { route: "games", nav: "games", act: "click",
      say: {
        uk: "Ігри — це законна перерва між задачами. Змійка, сапер, 2048… Обережно: затягує гірше за while True.",
        en: "Games are a legal break between tasks. Snake, minesweeper, 2048… Careful: more addictive than while True.",
        tr: "Oyunlar görevler arasında yasal moladır. Yılan, mayın tarlası, 2048… Dikkat: while True'dan daha bağımlılık yapar."
      } },
    { route: "settings", nav: "settings", act: "click",
      say: {
        uk: "Налаштування: мова, тема, звуки і вся магія зовнішнього вигляду. Там є навіть кнопка «Повторити туторіал» — це ж я!",
        en: "Settings: language, theme, sounds and all the look-and-feel magic. There is even a \"Replay the tutorial\" button — that's me!",
        tr: "Ayarlar: dil, tema, sesler ve tüm görünüm sihri. Orada bir de \"Tur'u tekrar izle\" düğmesi var — yani ben!"
      } },
    { route: "help", nav: "help", act: "click",
      say: {
        uk: "Допомога: відповіді на часті питання та історія оновлень. Я там теж є в списку змін — приємно, знаєте чи.",
        en: "Help: answers to frequent questions and the update history. I am in that changelog too — feels good, you know.",
        tr: "Yardım: sık sorulan sorular ve güncelleme geçmişi. O değişiklik listesinde ben de varım — hoş bir duygu."
      } },
    { fab: true, act: "show",
      say: {
        uk: "А це — я. Натисни на мою мордочку будь-коли: поясню тему, розберу твою помилку чи просто побалакаємо про Python. Бувай, друже!",
        en: "And this is me. Tap my face any time: I'll explain a topic, unpack your error, or we'll just chat about Python. Bye, friend!",
        tr: "Ve bu benim. Yüzüme istediğin an dokun: bir konuyu açıklarım, hatanı çözerim ya da Python hakkında sohbet ederiz. Görüşürüz, dostum!"
      } }
  ];

  let tutor = null; /* { i, auto, steps, timer, tapTimer } */

  function goto(routeName) {
    try {
      if (global.App && typeof global.App.route === "function") { global.App.route(routeName); return; }
      if (typeof global.route === "function") { global.route(routeName); return; }
    } catch (e) { /* резервний шлях нижче */ }
    location.hash = routeName;
  }

  function tutorVisible(node) {
    if (!node) return false;
    const r = node.getBoundingClientRect();
    return r.width > 4 && r.height > 4;
  }
  function tutorNavBtn(route) {
    return document.querySelector('.rail-btn[data-route="' + route + '"]');
  }
  /* На телефоні більшість пунктів схова за нижньою панеллю, тому Пайтончик
     сам розкриває шторку «Ще» й показує вже на пункт у ній. */
  function tutorMoreBtn() {
    return document.querySelector("#navMore");
  }
  function tutorSheetBtn(route) {
    const sheet = document.querySelector("#moreSheet");
    if (!sheet || sheet.hidden) return null;
    return sheet.querySelector('#moreSheetGrid [data-route="' + route + '"]');
  }
  function tutorCanClick(step) {
    if (!step.nav) return false;
    if (tutorVisible(tutorNavBtn(step.nav))) return true;
    /* сітку шторки будується лише при відкритті, тому перевіряємо саму оболонку */
    return tutorVisible(tutorMoreBtn()) && !!document.querySelector("#moreSheet #moreSheetGrid");
  }
  function tutorTarget(step) {
    if (step.fab) return fab;
    if (step.nav) {
      if (tutor.done) return null;
      const rail = tutorNavBtn(step.nav);
      if (tutorVisible(rail)) return rail;
      const inSheet = tutorSheetBtn(step.nav);
      if (tutorVisible(inSheet)) return inSheet;
      const more = tutorMoreBtn();
      return tutorVisible(more) ? more : null;
    }
    if (step.sel) {
      const list = document.querySelectorAll(step.sel);
      for (let i = 0; i < list.length; i++) if (tutorVisible(list[i])) return list[i];
    }
    return null;
  }
  function tutorSpotTarget(step) {
    const direct = tutorTarget(step);
    if (direct) return direct;
    return document.querySelector("#view-" + step.route + " .section-head") ||
      document.querySelector("#view-" + step.route);
  }
  function clearTutorTimers() {
    if (!tutor) return;
    if (tutor.timer) { clearTimeout(tutor.timer); tutor.timer = null; }
    if (tutor.tapTimer) { clearTimeout(tutor.tapTimer); tutor.tapTimer = null; }
  }
  function slowMotion() {
    return !document.body.classList.contains("reduce-motion");
  }

  function moveSpot(r) {
    const pad = 8;
    spotEl.style.left = (r.left - pad) + "px";
    spotEl.style.top = (r.top - pad) + "px";
    spotEl.style.width = (r.width + pad * 2) + "px";
    spotEl.style.height = (r.height + pad * 2) + "px";
    spotEl.classList.add("pychik-spot-on");
  }
  /* Маскот стає поруч із підсвіченим елементом там, де є вільне місце. */
  function movePet(r) {
    const pw = petEl.offsetWidth || 104, ph = petEl.offsetHeight || 104, gap = 16;
    const vw = window.innerWidth, vh = window.innerHeight;
    let x, y;
    if (r.right + gap + pw < vw - 6) { x = r.right + gap; y = r.top + r.height / 2 - ph / 2; }
    else if (r.left - gap - pw > 6) { x = r.left - gap - pw; y = r.top + r.height / 2 - ph / 2; }
    else if (r.bottom + gap + ph < vh - 6) { x = r.left + r.width / 2 - pw / 2; y = r.bottom + gap; }
    else { x = r.left + r.width / 2 - pw / 2; y = Math.max(6, r.top - gap - ph); }
    x = Math.min(Math.max(6, x), vw - pw - 6);
    y = Math.min(Math.max(6, y), vh - ph - 6);
    petEl.style.transform = "translate(" + Math.round(x) + "px," + Math.round(y) + "px)";
    petEl.classList.add("pychik-pet-on");
    placeSay(x, y, pw, ph);
    return { x: x + pw / 2, y: y + ph / 2 };
  }
  /* Лапка тягнеться від маскота до центра елемента й повертається в його бік. */
  function aimPaw(from, r) {
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const dx = cx - from.x, dy = cy - from.y;
    const len = Math.max(1, Math.sqrt(dx * dx + dy * dy));
    const reach = Math.max(46, len - Math.max(r.width, r.height) / 2 - 8);
    const d = Math.min(reach, len - 8);
    const px = from.x + (dx / len) * d;
    const py = from.y + (dy / len) * d;
    pawEl.style.transform = "translate(" + Math.round(px - 22) + "px," + Math.round(py - 22) +
      "px) rotate(" + Math.atan2(dy, dx).toFixed(3) + "rad)";
    pawEl.classList.add("pychik-paw-on");
  }
  function placeSay(px, py, pw, ph) {
    const w = Math.min(340, window.innerWidth - 20);
    const h = sayEl.offsetHeight || 150;
    let top = py - h - 14;
    if (top < 8) top = py + ph + 14;
    top = Math.min(Math.max(8, top), window.innerHeight - h - 8);
    const left = Math.min(Math.max(10, px + pw / 2 - w / 2), window.innerWidth - w - 10);
    sayEl.style.width = w + "px";
    sayEl.style.left = left + "px";
    sayEl.style.top = top + "px";
  }
  function tapAt(r) {
    const tap = el("div", "pychik-tap");
    tap.style.left = (r.left + r.width / 2 - 24) + "px";
    tap.style.top = (r.top + r.height / 2 - 24) + "px";
    /* саме всередині .pychik: звідти успадковується --pychik-z */
    (root || document.body).appendChild(tap);
    setTimeout(() => { if (tap.parentNode) tap.parentNode.removeChild(tap); }, 750);
  }

  function tutorSayTexts() {
    if (!tutor) return;
    const step = tutor.steps[tutor.i];
    sayTextEl.textContent = pick(step.say);
    sayCountEl.textContent = tx("tourCounter", { n: tutor.i + 1, m: tutor.steps.length });
    sayNextBtn.textContent = tutor.i === tutor.steps.length - 1 ? tx("tourFinish") : tx("tourNext");
    sayPrevBtn.disabled = tutor.i === 0;
    const ico = sayAutoBtn.querySelector(".material-icons");
    if (ico) ico.textContent = tutor.auto ? "pause" : "play_arrow";
    sayAutoBtn.setAttribute("aria-label", tx(tutor.auto ? "tutPauseL" : "tutPlayL"));
  }
  /* scroll=true — одразу після справжнього переходу: нова сторінка може зберегти
     старий зсув, і інакше підсвітка лізе за край екрана.
     При прокрутці самим користувачем чіпати зсув не можна — це брало б сторінку замість нього. */
  function tutorReposition(scroll) {
    if (!tutor) return;
    const target = tutorSpotTarget(tutor.steps[tutor.i]);
    if (!target) return;
    if (scroll) {
      try { target.scrollIntoView({ block: "center", behavior: "auto" }); } catch (e) { /* старі браузери */ }
    }
    const r = target.getBoundingClientRect();
    moveSpot(r);
    aimPaw(movePet(r), r);
  }
  /* «Натискання» елемента: кільце, звук і справжній клік. */
  function tutorPoke(node) {
    tapAt(node.getBoundingClientRect());
    sfx("pop");
    node.click();
  }
  function tutorPlace(step) {
    const target = tutorSpotTarget(step);
    if (!target) { spotEl.classList.remove("pychik-spot-on"); return; }
    try { target.scrollIntoView({ block: "center", behavior: slowMotion() ? "smooth" : "auto" }); } catch (e) { /* старі браузери */ }
    setTimeout(() => {
      if (!tutor) return;
      const r = target.getBoundingClientRect();
      moveSpot(r);
      aimPaw(movePet(r), r);
      if (step.act !== "click" || !step.nav) return;
      const rail = tutorNavBtn(step.nav);
      const more = tutorMoreBtn();
      tutor.tapTimer = setTimeout(() => {
        if (!tutor) return;
        if (tutorVisible(rail)) { tutor.done = true; tutorPoke(rail); return; }
        if (!tutorVisible(more)) { goto(step.route); return; }
        /* телефон: спершу «натискаємо» «Ще», дочекуємось шторки — і тоді сам пункт */
        tutorPoke(more);
        tutor.tapTimer = setTimeout(() => {
          if (!tutor) return;
          tutorReposition();
          const inSheet = tutorSheetBtn(step.nav);
          if (!tutorVisible(inSheet)) { goto(step.route); return; }
          tutor.tapTimer = setTimeout(() => {
            if (!tutor) return;
            tutor.done = true;
            tutorPoke(inSheet);
          }, slowMotion() ? 760 : 60);
        }, slowMotion() ? 320 : 30);
      }, slowMotion() ? 980 : 80);
    }, slowMotion() ? 430 : 40);
  }
  function tutorGo(i) {
    if (!tutor) return;
    clearTutorTimers();
    tutor.i = Math.min(Math.max(0, i), tutor.steps.length - 1);
    tutor.done = false;
    const step = tutor.steps[tutor.i];
    if (step.route && !tutorCanClick(step)) goto(step.route);
    tutorSayTexts();
    tutorPlace(step);
    tutor.timer = setTimeout(() => { if (tutor && tutor.auto) tutorNext(); },
      step.act === "click" ? 6400 : 4600);
  }
  function tutorNext() {
    if (!tutor) return;
    if (tutor.i >= tutor.steps.length - 1) { endTour(true); return; }
    tutorGo(tutor.i + 1);
  }
  function tutorPrev() { if (tutor) tutorGo(tutor.i - 1); }
  function tutorToggleAuto() {
    if (!tutor) return;
    tutor.auto = !tutor.auto;
    clearTutorTimers();
    tutorSayTexts();
    sfx("click");
    if (tutor.auto) tutor.timer = setTimeout(tutorNext, 2400);
  }
  function endTour(finished) {
    clearTutorTimers();
    tutor = null;
    spotEl.classList.remove("pychik-spot-on");
    petEl.classList.remove("pychik-pet-on");
    pawEl.classList.remove("pychik-paw-on");
    sayEl.classList.remove("pychik-say-open");
    try { localStorage.setItem(TOUR_KEY, "1"); } catch (e) {}
    if (finished) {
      toast(tx("tourDone"));
      mood("happy");
      sfx("success");
    }
  }
  function tour(routeName) {
    if (!inited) init();
    if (!root) return;
    let steps = TUTOR_STEPS;
    if (routeName) {
      const one = TUTOR_STEPS.filter((s) => s.route === routeName || s.nav === routeName);
      if (one.length) steps = one;
    }
    if (panel && panel.classList.contains("pychik-open")) close();
    tutor = { i: -1, auto: true, done: false, steps: steps, timer: null, tapTimer: null };
    sayEl.classList.add("pychik-say-open");
    mood("happy");
    sfx("pop");
    tutorGo(0);
  }

  /* ---------- Відкриття / закриття ---------- */
  function open() {
    if (!inited) init();
    if (!panel) return;
    panel.classList.add("pychik-open");
    root.classList.add("pychik-open");
    fab.setAttribute("aria-expanded", "true");
    sfx("pop");
    if (!msgsEl.childNodes.length) greet();
    renderChips();
    setTimeout(() => { if (inputEl) inputEl.focus(); }, 220);
  }

  function close() {
    if (!panel) return;
    panel.classList.remove("pychik-open");
    root.classList.remove("pychik-open");
    fab.setAttribute("aria-expanded", "false");
  }

  function toggle() {
    if (panel && panel.classList.contains("pychik-open")) close();
    else open();
  }

  /* ---------- Побудова DOM ---------- */
  function buildDOM() {
    root = el("div", "pychik mood-idle");

    spotEl = el("div", "pychik-spot");
    petEl = el("div", "pychik-pet");
    petEl.appendChild(mascotSVG("pychik-svg pychik-svg-pet"));
    pawEl = el("div", "pychik-paw");
    pawEl.appendChild(pawSVG("pychik-svg-paw"));

    sayEl = el("div", "pychik-say");
    sayEl.setAttribute("role", "dialog");
    sayEl.setAttribute("aria-label", tx("name"));
    sayTextEl = el("div", "pychik-say-text");
    sayEl.appendChild(sayTextEl);
    const sfoot = el("div", "pychik-say-foot");
    sayPrevBtn = el("button", "pychik-say-ico");
    sayPrevBtn.type = "button";
    sayPrevBtn.innerHTML = '<span class="material-icons">chevron_left</span>';
    sayPrevBtn.setAttribute("aria-label", tx("tutPrevL"));
    sayPrevBtn.addEventListener("click", () => { sfx("click"); tutorPrev(); });
    sayAutoBtn = el("button", "pychik-say-ico");
    sayAutoBtn.type = "button";
    sayAutoBtn.innerHTML = '<span class="material-icons">pause</span>';
    sayAutoBtn.setAttribute("aria-label", tx("tutPauseL"));
    sayAutoBtn.addEventListener("click", tutorToggleAuto);
    sayCountEl = el("span", "pychik-say-count");
    sayNextBtn = el("button", "pychik-say-next", tx("tourNext"));
    sayNextBtn.type = "button";
    sayNextBtn.addEventListener("click", () => { sfx("click"); tutorNext(); });
    const sayClose = el("button", "pychik-say-ico pychik-say-close", "\u00D7");
    sayClose.type = "button";
    sayClose.setAttribute("aria-label", tx("tourSkip"));
    sayClose.addEventListener("click", () => { sfx("click"); endTour(false); });
    sfoot.appendChild(sayPrevBtn);
    sfoot.appendChild(sayAutoBtn);
    sfoot.appendChild(sayCountEl);
    sfoot.appendChild(sayNextBtn);
    sfoot.appendChild(sayClose);
    sayEl.appendChild(sfoot);

    fab = el("button", "pychik-fab");
    fab.type = "button";
    fab.setAttribute("aria-label", tx("fabLabel"));
    fab.setAttribute("aria-expanded", "false");
    fab.appendChild(mascotSVG("pychik-svg pychik-svg-fab"));
    fab.addEventListener("click", () => { sfx("click"); toggle(); });

    panel = el("div", "pychik-panel");
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-label", tx("name"));

    const head = el("div", "pychik-head");
    mascotEl = mascotSVG("pychik-svg pychik-svg-head");
    head.appendChild(mascotEl);
    head.appendChild(el("span", "pychik-title", tx("name")));
    const tourBtn = el("button", "pychik-head-btn");
    tourBtn.type = "button";
    tourBtn.innerHTML = '<span class="material-icons">explore</span>';
    tourBtn.setAttribute("aria-label", tx("tourBtnL"));
    tourBtn.addEventListener("click", () => { sfx("click"); tour(); });
    head.appendChild(tourBtn);
    const closeBtn = el("button", "pychik-close", "\u00D7");
    closeBtn.type = "button";
    closeBtn.setAttribute("aria-label", tx("close"));
    closeBtn.addEventListener("click", () => { sfx("click"); close(); });
    head.appendChild(closeBtn);
    panel.appendChild(head);

    msgsEl = el("div", "pychik-msgs");
    panel.appendChild(msgsEl);

    chipsEl = el("div", "pychik-chips");
    panel.appendChild(chipsEl);

    const row = el("div", "pychik-row");
    inputEl = el("input", "pychik-input");
    inputEl.type = "text";
    inputEl.placeholder = tx("placeholder");
    inputEl.maxLength = 2000;
    inputEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter") sendInput();
    });
    const sendBtn = el("button", "pychik-send", tx("send"));
    sendBtn.type = "button";
    sendBtn.addEventListener("click", sendInput);
    row.appendChild(inputEl);
    row.appendChild(sendBtn);
    panel.appendChild(row);

    root.appendChild(panel);
    root.appendChild(fab);
    root.appendChild(spotEl);
    root.appendChild(petEl);
    root.appendChild(pawEl);
    root.appendChild(sayEl);
    document.body.appendChild(root);

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        if (tutor) endTour(false);
        else close();
      }
    });
    window.addEventListener("resize", () => { if (tutor) tutorReposition(); });
    let repositionQueued = false;
    window.addEventListener("scroll", () => {
      if (!tutor || repositionQueued) return;
      repositionQueued = true;
      requestAnimationFrame(() => {
        repositionQueued = false;
        if (tutor) tutorReposition();
      });
    }, true);
    document.addEventListener("langchange", () => {
      if (!root) return;
      inputEl.placeholder = tx("placeholder");
      fab.setAttribute("aria-label", tx("fabLabel"));
      panel.querySelector(".pychik-title").textContent = tx("name");
      panel.querySelector(".pychik-close").setAttribute("aria-label", tx("close"));
      panel.querySelector(".pychik-send").textContent = tx("send");
      sayPrevBtn.setAttribute("aria-label", tx("tutPrevL"));
      sayClose.setAttribute("aria-label", tx("tourSkip"));
      renderChips();
      if (tutor) tutorSayTexts();
    });
    document.addEventListener("routechange", (e) => {
      setContext({ section: e.detail });
      /* після справжнього переходу секція змінюється — підсвітка має поїхати за нею */
      if (tutor) setTimeout(() => tutorReposition(true), slowMotion() ? 360 : 20);
    });
  }

  function sendInput() {
    const q = inputEl.value.trim();
    if (!q) return;
    inputEl.value = "";
    ask(q);
  }

  function setContext(obj) {
    if (!obj || typeof obj !== "object") return;
    Object.keys(obj).forEach((k) => { ctx[k] = obj[k]; });
    if (chipsEl) renderChips();
    if (obj.error) {
      if (!inited) init();
      ask(String(obj.error));
    }
  }

  /* Авто-тур чекає, поки зникне стартовий екран і черга вступних вікон:
     інакше він починається під заставкою і користувач його просто не бачить. */
  function stageBusy() {
    return !!document.querySelector("#splash, .wn-backdrop, .ob-backdrop, .av-modal-backdrop, .modal-backdrop");
  }

  function scheduleTour() {
    let waited = 2500;
    const tick = () => {
      if (stageBusy() || waited < 6000) {
        waited += 500;
        if (waited <= 90000) setTimeout(tick, 500);
        return;
      }
      try { localStorage.setItem(TOUR_KEY, "1"); } catch (e) {}
      if (!tutor) tour();
    };
    setTimeout(tick, 2500);
  }

  function init() {
    if (inited || document.querySelector(".pychik")) return;
    if (!document.body) {
      document.addEventListener("DOMContentLoaded", init);
      return;
    }
    try {
      buildDOM();
      inited = true;
      let seen = false;
      try { seen = localStorage.getItem(TOUR_KEY) === "1"; } catch (e) {}
      if (!seen) scheduleTour();
    } catch (e) {
      if (global.console) console.warn("[pythonchik] init failed", e);
    }
  }

  global.Pythonchik = {
    init: init,
    open: open,
    close: close,
    toggle: toggle,
    ask: ask,
    explainError: explainError,
    tour: tour,
    setContext: setContext,
    mood: mood
  };
})(window);
