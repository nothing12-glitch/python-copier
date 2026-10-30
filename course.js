/* course.js — розділ «Курс Python»: керований навчальний шлях із розділів і уроків.
   Кожен урок: теорія, готовий приклад і практика з автоматичною перевіркою (через Tasks.judge).
   Прогрес зберігається локально для кожного користувача: app.course.<user>
   Чернетка коду уроку: app.course.code.<user>.<lessonId> */
(function (global) {
  const $ = (s) => document.querySelector(s);

  const KEY_PREFIX = "app.course.";
  const CODE_PREFIX = "app.course.code.";

  const COURSE = [
    {
      chapter: { uk: "Основи", en: "Basics", tr: "Temeller" },
      lessons: [
        {
          id: "hello",
          title: { uk: "Привіт, Python!", en: "Hello, Python!", tr: "Merhaba, Python!" },
          theory: {
            uk: "Python — проста й потужна мова. Команда print() виводить текст на екран. Текст у лапках називають рядком.",
            en: "Python is a simple yet powerful language. The print() command shows text on screen. Text in quotes is called a string.",
            tr: "Python basit ama güçlü bir dildir. print() komutu ekrana metin yazar. Tırnak içindeki metne dize (string) denir."
          },
          example: "print(\"Привіт, Python!\")\nprint(2026)\n",
          task: {
            text: {
              uk: "Виведи точно один рядок: Hello, Python!",
              en: "Print exactly one line: Hello, Python!",
              tr: "Tam olarak bir satır yazdır: Hello, Python!"
            },
            hint: {
              uk: "Використай print() і передай рядок у подвійних лапках.",
              en: "Use print() and pass the text in double quotes.",
              tr: "print() kullan ve metni çift tırnak içinde ver."
            },
            starter: "",
            tests: [
              { in: "", out: "Hello, Python!" }
            ]
          }
        },
        {
          id: "vars",
          title: { uk: "Змінні та числа", en: "Variables and numbers", tr: "Değişkenler ve sayılar" },
          theory: {
            uk: "Змінна — це ім'я для значення: name = value. Числа можна додавати (+), віднімати (-), множити (*) і ділити (/).",
            en: "A variable is a name for a value: name = value. Numbers can be added (+), subtracted (-), multiplied (*) and divided (/).",
            tr: "Değişken bir değerin adıdır: name = value. Sayılar toplanır (+), çıkarılır (-), çarpılır (*) ve bölünür (/)."
          },
          example: "x = 7\ny = 3\nprint(x + y)\nprint(x * y)\n",
          task: {
            text: {
              uk: "Дано ціле число n. Виведи його подвоєне значення (n * 2).",
              en: "An integer n is given. Print its doubled value (n * 2).",
              tr: "Bir n tam sayısı veriliyor. İki katını (n * 2) yazdır."
            },
            hint: {
              uk: "Зчитай число через int(input()), помнож на 2 і виведи.",
              en: "Read the number with int(input()), multiply by 2 and print it.",
              tr: "Sayıyı int(input()) ile oku, 2 ile çarp ve yazdır."
            },
            starter: "n = int(input())\n",
            tests: [
              { in: "4\n", out: "8" },
              { in: "0\n", out: "0" },
              { in: "-3\n", out: "-6" }
            ]
          }
        },
        {
          id: "strings",
          title: { uk: "Рядки", en: "Strings", tr: "Dizeler" },
          theory: {
            uk: "Рядок — це текст у лапках. Рядки можна склеювати (+) і множити на число (*). Функція len() дає довжину рядка.",
            en: "A string is text in quotes. Strings can be joined (+) and multiplied by a number (*). The len() function gives the length.",
            tr: "Dize, tırnak içindeki metindir. Dizeler birleştirilebilir (+) ve bir sayıyla çarpılabilir (*). len() fonksiyonu uzunluğu verir."
          },
          example: "s = \"Py\"\nprint(s + \"thon\")\nprint(s * 2)\nprint(len(s))\n",
          task: {
            text: {
              uk: "Дано два слова, кожне в окремому рядку. Виведи їх, з'єднавши через дефіс (наприклад, red-blue).",
              en: "Two words are given, one per line. Print them joined with a hyphen (for example, red-blue).",
              tr: "Her biri ayrı satırda iki sözcük veriliyor. Tire ile birleştirip yazdır (örneğin red-blue)."
            },
            hint: {
              uk: "Зчитай обидва рядки через input() і склей: a + \"-\" + b.",
              en: "Read both lines with input() and join them: a + \"-\" + b.",
              tr: "İki satırı input() ile oku ve birleştir: a + \"-\" + b."
            },
            starter: "",
            tests: [
              { in: "red\nblue\n", out: "red-blue" },
              { in: "a\nb\n", out: "a-b" },
              { in: "hello\nworld\n", out: "hello-world" }
            ]
          }
        }
      ]
    },
    {
      chapter: { uk: "Логіка", en: "Logic", tr: "Mantık" },
      lessons: [
        {
          id: "if",
          title: { uk: "Умови (if / else)", en: "Conditions (if / else)", tr: "Koşullar (if / else)" },
          theory: {
            uk: "if перевіряє умову: якщо вона істинна, виконується блок із відступом. else задає інший блок. Порівняння: ==, !=, >, <, >=, <=.",
            en: "if checks a condition: when it is true, the indented block runs. else provides another block. Comparisons: ==, !=, >, <, >=, <=.",
            tr: "if bir koşulu denetler: doğruysa girintili blok çalışır. else başka bir blok verir. Karşılaştırmalar: ==, !=, >, <, >=, <=."
          },
          example: "n = 5\nif n > 0:\n    print(\"додатне\")\nelse:\n    print(\"не додатне\")\n",
          task: {
            text: {
              uk: "Дано ціле число n. Виведи positive, якщо воно більше за нуль, і nonpositive інакше.",
              en: "An integer n is given. Print positive if it is greater than zero, otherwise print nonpositive.",
              tr: "Bir n tam sayısı veriliyor. Sıfırdan büyükse positive, değilse nonpositive yazdır."
            },
            hint: {
              uk: "Перевір умову n > 0 у if, а в else виведи інше слово.",
              en: "Check the condition n > 0 in if, and print the other word in else.",
              tr: "if içinde n > 0 koşulunu denetle, diğer sözcüğü else içinde yazdır."
            },
            starter: "n = int(input())\n",
            tests: [
              { in: "5\n", out: "positive" },
              { in: "0\n", out: "nonpositive" },
              { in: "-2\n", out: "nonpositive" }
            ]
          }
        },
        {
          id: "logic",
          title: { uk: "Логічні оператори", en: "Logical operators", tr: "Mantıksal operatörler" },
          theory: {
            uk: "Умови можна поєднувати: and (і), or (або), not (не). Вираз після and істинний лише тоді, коли істинні обидві частини.",
            en: "Conditions can be combined: and, or, not. An and expression is true only when both parts are true.",
            tr: "Koşullar birleştirilebilir: and (ve), or (veya), not (değil). Bir and ifadesi yalnızca iki kısım da doğruysa doğrudur."
          },
          example: "age = 20\nticket = True\nif age >= 18 and ticket:\n    print(\"вхід дозволено\")\n",
          task: {
            text: {
              uk: "Дано два цілих числа, кожне в окремому рядку. Виведи both, якщо обидва більші за 10, інакше виведи no.",
              en: "Two integers are given, one per line. Print both if each is greater than 10, otherwise print no.",
              tr: "Her biri ayrı satırda iki tam sayı veriliyor. İkisi de 10'dan büyükse both, değilse no yazdır."
            },
            hint: {
              uk: "Поєднай дві перевірки: a > 10 and b > 10. Пам'ятай: 10 не більше за 10.",
              en: "Combine two checks: a > 10 and b > 10. Remember: 10 is not greater than 10.",
              tr: "İki denetimi birleştir: a > 10 and b > 10. Unutma: 10, 10'dan büyük değildir."
            },
            starter: "a = int(input())\nb = int(input())\n",
            tests: [
              { in: "11\n12\n", out: "both" },
              { in: "5\n20\n", out: "no" },
              { in: "10\n10\n", out: "no" }
            ]
          }
        }
      ]
    },
    {
      chapter: { uk: "Цикли", en: "Loops", tr: "Döngüler" },
      lessons: [
        {
          id: "for",
          title: { uk: "Цикл for", en: "The for loop", tr: "for döngüsü" },
          theory: {
            uk: "for повторює дію для кожного елемента. range(a, b) дає числа від a до b-1; верхня межа не включається.",
            en: "for repeats an action for each element. range(a, b) gives numbers from a to b-1; the upper bound is excluded.",
            tr: "for bir eylemi her öğe için yineler. range(a, b) a'dan b-1'e kadar sayılar verir; üst sınır dahil değildir."
          },
          example: "for i in range(3):\n    print(i)\n",
          task: {
            text: {
              uk: "Дано ціле число n (n >= 1). Виведи в одному рядку через пробіл квадрати чисел від 1 до n.",
              en: "An integer n is given (n >= 1). Print on one line, separated by spaces, the squares of numbers from 1 to n.",
              tr: "Bir n tam sayısı veriliyor (n >= 1). 1'den n'ye kadar sayıların karelerini tek satırda boşlukla ayırıp yazdır."
            },
            hint: {
              uk: "Збирай квадрати у список рядків, а потім виведи \" \".join(list).",
              en: "Collect the squares in a list of strings, then print \" \".join(list).",
              tr: "Kareleri bir dize listesinde topla, sonra \" \".join(list) ile yazdır."
            },
            starter: "n = int(input())\nres = []\n",
            tests: [
              { in: "3\n", out: "1 4 9" },
              { in: "1\n", out: "1" },
              { in: "5\n", out: "1 4 9 16 25" }
            ]
          }
        },
        {
          id: "while",
          title: { uk: "Цикл while", en: "The while loop", tr: "while döngüsü" },
          theory: {
            uk: "while повторює блок, доки умова істинна. Усередині обов'язково змінюй змінну, інакше цикл стане нескінченним.",
            en: "while repeats a block as long as the condition is true. Change the variable inside, or the loop becomes infinite.",
            tr: "while koşul doğru olduğu sürece bir bloğu yineler. İçeride değişkeni değiştir, yoksa döngü sonsuz olur."
          },
          example: "i = 0\nwhile i < 3:\n    print(i)\n    i += 1\n",
          task: {
            text: {
              uk: "Дано ціле число n (n >= 1). Виведи зворотний відлік від n до 1, кожне число в окремому рядку.",
              en: "An integer n is given (n >= 1). Print a countdown from n to 1, each number on its own line.",
              tr: "Bir n tam sayısı veriliyor (n >= 1). n'den 1'e geri sayımı yazdır, her sayı ayrı satırda."
            },
            hint: {
              uk: "Почни з n і в циклі while зменшуй лічильник на 1, поки він >= 1.",
              en: "Start at n and in a while loop decrease the counter by 1 while it is >= 1.",
              tr: "n'den başla ve bir while döngüsünde sayaç >= 1 olduğu sürece 1 azalt."
            },
            starter: "n = int(input())\n",
            tests: [
              { in: "3\n", out: "3\n2\n1" },
              { in: "1\n", out: "1" },
              { in: "5\n", out: "5\n4\n3\n2\n1" }
            ]
          }
        }
      ]
    },
    {
      chapter: { uk: "Колекції", en: "Collections", tr: "Koleksiyonlar" },
      lessons: [
        {
          id: "lists",
          title: { uk: "Списки", en: "Lists", tr: "Listeler" },
          theory: {
            uk: "Список — це набір елементів: [1, 2, 3]. Звернення за індексом list[0], довжина — len(list), додавання — append().",
            en: "A list is a collection of items: [1, 2, 3]. Access by index list[0], length via len(list), add with append().",
            tr: "Liste bir öğe kümesidir: [1, 2, 3]. list[0] ile indekse eriş, len(list) ile uzunluk, append() ile ekle."
          },
          example: "a = [5, 3, 9]\nprint(a[0], len(a))\na.append(1)\nprint(a)\n",
          task: {
            text: {
              uk: "В одному рядку через пробіл дано цілі числа. Виведи їхню суму.",
              en: "One line contains integers separated by spaces. Print their sum.",
              tr: "Bir satırda boşlukla ayrılmış tam sayılar veriliyor. Toplamlarını yazdır."
            },
            hint: {
              uk: "Розбий рядок через input().split(), перетвори кожен на int і підсумуй.",
              en: "Split the line with input().split(), convert each to int and sum them.",
              tr: "Satırı input().split() ile böl, her birini int'e çevir ve topla."
            },
            starter: "",
            tests: [
              { in: "1 2 3\n", out: "6" },
              { in: "10\n", out: "10" },
              { in: "-1 1\n", out: "0" }
            ]
          }
        },
        {
          id: "dicts",
          title: { uk: "Словники", en: "Dictionaries", tr: "Sözlükler" },
          theory: {
            uk: "Словник зберігає пари ключ-значення: {'a': 1}. Доступ — d['a'], безпечне читання — d.get(key, 0).",
            en: "A dictionary stores key-value pairs: {'a': 1}. Access with d['a'], safe read with d.get(key, 0).",
            tr: "Sözlük anahtar-değer çiftleri tutar: {'a': 1}. d['a'] ile eriş, d.get(key, 0) ile güvenli oku."
          },
          example: "d = {\"one\": 1, \"two\": 2}\nprint(d[\"one\"])\nprint(len(d))\n",
          task: {
            text: {
              uk: "Дано слово (перший рядок) і одну літеру (другий рядок). Порахуй, скільки разів літера зустрічається у слові, і виведи це число.",
              en: "A word (first line) and one letter (second line) are given. Count how many times the letter appears in the word and print that number.",
              tr: "Bir sözcük (ilk satır) ve bir harf (ikinci satır) veriliyor. Harfin sözcükte kaç kez geçtiğini say ve bu sayıyı yazdır."
            },
            hint: {
              uk: "Пройди по символах слова й для кожного збільшуй лічильник у словнику: counts[ch] = counts.get(ch, 0) + 1.",
              en: "Loop over the word's characters and increase a counter in a dict: counts[ch] = counts.get(ch, 0) + 1.",
              tr: "Sözcüğün karakterlerini dolaş ve bir sözlükte sayacı artır: counts[ch] = counts.get(ch, 0) + 1."
            },
            starter: "s = input().strip()\nc = input().strip()\ncounts = {}\n",
            tests: [
              { in: "banana\na\n", out: "3" },
              { in: "hello\nl\n", out: "2" },
              { in: "xyz\nq\n", out: "0" }
            ]
          }
        }
      ]
    },
    {
      chapter: { uk: "Функції та інше", en: "Functions and beyond", tr: "Fonksiyonlar ve ötesi" },
      lessons: [
        {
          id: "functions",
          title: { uk: "Функції", en: "Functions", tr: "Fonksiyonlar" },
          theory: {
            uk: "Функція — це іменований блок коду: def name(params): ... return result. Виклик — name(args). Функції допомагають не повторювати код.",
            en: "A function is a named block of code: def name(params): ... return result. Call it with name(args). Functions avoid repetition.",
            tr: "Fonksiyon adlandırılmış bir kod bloğudur: def name(params): ... return result. name(args) ile çağır. Fonksiyonlar tekrarı önler."
          },
          example: "def square(x):\n    return x * x\nprint(square(5))\n",
          task: {
            text: {
              uk: "Дано ціле число n. Напиши функцію digit_sum(n), що повертає суму його цифр, і виведи результат.",
              en: "An integer n is given. Write a function digit_sum(n) that returns the sum of its digits and print the result.",
              tr: "Bir n tam sayısı veriliyor. Rakamları toplamını döndüren digit_sum(n) fonksiyonunu yaz ve sonucu yazdır."
            },
            hint: {
              uk: "У функції перетвори число на рядок str(n) і підсумуй int(символ) для кожного символа.",
              en: "Inside the function convert the number to str(n) and sum int(character) for each character.",
              tr: "Fonksiyon içinde sayıyı str(n) ile metne çevir ve her karakter için int(karakter) değerlerini topla."
            },
            starter: "def digit_sum(n):\n    pass\n\nn = int(input())\nprint(digit_sum(n))\n",
            tests: [
              { in: "123\n", out: "6" },
              { in: "9\n", out: "9" },
              { in: "1000\n", out: "1" }
            ]
          }
        },
        {
          id: "imports",
          title: { uk: "Модулі й import", en: "Modules and import", tr: "Modüller ve import" },
          theory: {
            uk: "Модуль — це файл із готовим кодом. import module відкриває доступ до нього. Стандартні: math, random. Більше — у розділі «Модулі».",
            en: "A module is a file with ready code. import module gives access to it. Standard ones: math, random. More in the “Modules” section.",
            tr: "Modül hazır kod içeren bir dosyadır. import module ona erişim verir. Standart olanlar: math, random. Daha fazlası “Modüller” bölümünde."
          },
          example: "import math\nprint(math.sqrt(16))\nprint(round(math.pi, 2))\n",
          task: {
            text: {
              uk: "Дано радіус кола r (ціле число). Виведи площу кола, округлену до 2 знаків, використовуючи math.pi.",
              en: "A circle radius r (an integer) is given. Print the circle area rounded to 2 decimals, using math.pi.",
              tr: "Bir dairenin yarıçapı r (tam sayı) veriliyor. math.pi kullanarak alanı 2 ondalığa yuvarlanmış yazdır."
            },
            hint: {
              uk: "Площа кола — math.pi * r * r. Округли через round(value, 2).",
              en: "The circle area is math.pi * r * r. Round it with round(value, 2).",
              tr: "Daire alanı math.pi * r * r. round(value, 2) ile yuvarla."
            },
            starter: "import math\nr = float(input())\n",
            tests: [
              { in: "5\n", out: "78.54" },
              { in: "1\n", out: "3.14" },
              { in: "0\n", out: "0.0" }
            ]
          }
        },
        {
          id: "classes",
          title: { uk: "Класи (вступ до OOP)", en: "Classes (intro to OOP)", tr: "Sınıflar (OOP'ye giriş)" },
          theory: {
            uk: "Клас — це шаблон для об'єктів. У class Name метод __init__(self, ...) задає поля, а self — це сам об'єкт. Об'єкт створюють так: Name(args).",
            en: "A class is a template for objects. In class Name, the __init__(self, ...) method sets fields and self is the object itself. Create one with Name(args).",
            tr: "Sınıf nesneler için bir şablondur. class Name içinde __init__(self, ...) metodu alanları kurar, self nesnenin kendisidir. Name(args) ile oluştur."
          },
          example: "class Dog:\n    def __init__(self, name):\n        self.name = name\n    def speak(self):\n        return self.name + \" says woof\"\n\nd = Dog(\"Rex\")\nprint(d.speak())\n",
          task: {
            text: {
              uk: "Напиши клас Rect із полями w і h та методом area(), що повертає площу (w * h). Прочитай два числа й виведи площу.",
              en: "Write a class Rect with fields w and h and an area() method that returns the area (w * h). Read two numbers and print the area.",
              tr: "w ve h alanları ile area() metodu (w * h döndüren) olan bir Rect sınıfı yaz. İki sayı oku ve alanı yazdır."
            },
            hint: {
              uk: "У методі area() поверни self.w * self.h. Об'єкт створи як Rect(w, h).",
              en: "In the area() method return self.w * self.h. Create the object as Rect(w, h).",
              tr: "area() metodunda self.w * self.h döndür. Nesneyi Rect(w, h) olarak oluştur."
            },
            starter: "class Rect:\n    def __init__(self, w, h):\n        self.w = w\n        self.h = h\n    def area(self):\n        pass\n\nw = int(input())\nh = int(input())\nprint(Rect(w, h).area())\n",
            tests: [
              { in: "3\n4\n", out: "12" },
              { in: "5\n5\n", out: "25" },
              { in: "0\n7\n", out: "0" }
            ]
          }
        }
      ]
    }
  ];

  /* Плоский список уроків зі зворотним посиланням на розділ */
  const LESSONS = [];
  COURSE.forEach((ch) => {
    ch.lessons.forEach((lesson) => {
      LESSONS.push({ lesson: lesson, chapter: ch.chapter });
    });
  });
  const TOTAL = LESSONS.length;

  let progressEl, listEl, detailEl, chapterEl, titleEl, theoryEl, exampleEl;
  let exampleRunBtn, exampleCopyBtn, taskTextEl, codeEl, hintBtn, hintBoxEl;
  let checkBtn, resetBtn, statusEl, resultsEl, doneEl, prevBtn, nextBtn, backBtn;
  let current = null;
  let busy = false;

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

  function getProgress() {
    try { return JSON.parse(localStorage.getItem(KEY_PREFIX + user())) || {}; }
    catch { return {}; }
  }
  function saveProgress(p) { localStorage.setItem(KEY_PREFIX + user(), JSON.stringify(p)); }
  function isDone(id) { const p = getProgress(); return !!(p[id] && p[id].solved); }
  function doneCount() { const p = getProgress(); return LESSONS.filter((e) => p[e.lesson.id] && p[e.lesson.id].solved).length; }

  /* Воротар: урок відкритий лише після того, як розв'язано практику попереднього.
     Вже пройдені уроки лишаються відкритими, щоб до них можна було повернутися. */
  function indexOf(id) { return LESSONS.findIndex((e) => e.lesson.id === id); }
  function prevLesson(id) {
    const i = indexOf(id);
    return i > 0 ? LESSONS[i - 1].lesson : null;
  }
  function isUnlocked(id) {
    const i = indexOf(id);
    if (i <= 0 || isDone(id)) return true;
    return isDone(LESSONS[i - 1].lesson.id);
  }
  function gateText(id) {
    const prev = prevLesson(id);
    return t("course.lockedToast", { title: prev ? pick(prev.title) : "" });
  }
  function draftKey(id) { return CODE_PREFIX + user() + "." + id; }
  function loadDraft(id, fallback) {
    const saved = localStorage.getItem(draftKey(id));
    return saved == null ? fallback : saved;
  }
  function saveDraft(id, code) { localStorage.setItem(draftKey(id), code); }

  function index() { return LESSONS.findIndex((e) => e.lesson.id === (current && current.id)); }

  /* ---------- Список: прогрес + розділи ---------- */
  function renderList() {
    if (!listEl) return;
    listEl.innerHTML = "";
    const done = doneCount();

    const head = el("div", "course-progress");
    head.appendChild(el("div", "course-progress-label",
      t("course.progress", { n: done, total: TOTAL, percent: TOTAL ? Math.round(done / TOTAL * 100) : 0 })));
    const bar = el("div", "tasks-bar");
    const fill = el("div", "tasks-bar-fill");
    fill.style.width = (TOTAL ? Math.round(done / TOTAL * 100) : 0) + "%";
    bar.appendChild(fill);
    head.appendChild(bar);
    listEl.appendChild(head);

    COURSE.forEach((ch, ci) => {
      const section = el("div", "course-chapter");
      const chDone = ch.lessons.filter((l) => isDone(l.id)).length;
      const hEl = el("div", "course-chapter-head");
      hEl.appendChild(el("span", "course-chapter-num", String(ci + 1)));
      const nameWrap = el("div", "course-chapter-name");
      nameWrap.appendChild(el("span", "course-chapter-title", pick(ch.chapter)));
      nameWrap.appendChild(el("span", "course-chapter-meta", t("course.chapterMeta", { done: chDone, total: ch.lessons.length })));
      hEl.appendChild(nameWrap);
      section.appendChild(hEl);

      const grid = el("div", "course-lessons");
      ch.lessons.forEach((lesson) => {
        const doneLesson = isDone(lesson.id);
        const unlocked = isUnlocked(lesson.id);
        const card = el("button", "course-lesson" + (doneLesson ? " done" : "") + (unlocked ? "" : " locked"));
        card.type = "button";
        card.appendChild(el("span", "material-icons course-lesson-ico",
          doneLesson ? "check_circle" : (unlocked ? "play_circle_outline" : "lock")));
        const body = el("span", "course-lesson-body");
        body.appendChild(el("span", "course-lesson-title", pick(lesson.title)));
        body.appendChild(el("span", "course-lesson-sub",
          doneLesson ? t("course.doneBadge") : (unlocked ? t("course.startBadge") : t("course.lockedBadge"))));
        card.appendChild(body);
        card.onclick = () => {
          if (!unlocked) { toast(gateText(lesson.id)); sfx("error"); return; }
          openLesson(lesson.id);
        };
        grid.appendChild(card);
      });
      section.appendChild(grid);
      listEl.appendChild(section);
    });

    if (detailEl) detailEl.classList.add("hidden");
    listEl.classList.remove("hidden");
  }

  /* ---------- Екран уроку ---------- */
  function openLesson(id) {
    const entry = LESSONS.find((e) => e.lesson.id === id);
    if (!entry) return;
    if (!isUnlocked(id)) { toast(gateText(id)); sfx("error"); return; }
    current = entry.lesson;
    if (hintBoxEl) { hintBoxEl.innerHTML = ""; hintBoxEl.classList.add("hidden"); }
    if (resultsEl) resultsEl.innerHTML = "";
    setStatus("");
    renderDetail();
    sfx("pop");
  }

  function renderDetail() {
    if (!current || !detailEl) return;
    const entry = LESSONS[index()];
    chapterEl.textContent = pick(entry.chapter);
    titleEl.textContent = pick(current.title);
    theoryEl.textContent = pick(current.theory);

    exampleEl.textContent = current.example;
    taskTextEl.textContent = pick(current.task.text);
    codeEl.value = loadDraft(current.id, current.task.starter);

    doneEl.classList.toggle("hidden", !isDone(current.id));

    const i = index();
    prevBtn.classList.toggle("hidden", i <= 0);
    nextBtn.classList.toggle("hidden", i >= TOTAL - 1);
    nextBtn.classList.toggle("locked", i < TOTAL - 1 && !isDone(current.id));
    nextBtn.dataset.next = i < TOTAL - 1 ? LESSONS[i + 1].lesson.id : "";

    detailEl.classList.remove("hidden");
    if (listEl) listEl.classList.add("hidden");
  }

  function setStatus(msg, cls) {
    if (!statusEl) return;
    statusEl.textContent = msg || "";
    statusEl.className = "task-status-line" + (cls ? " " + cls : "");
  }

  /* ---------- Перевірка практики ---------- */
  async function check() {
    if (busy || !current) return;
    const code = codeEl.value;
    if (!code.trim()) { toast(t("course.emptyCode")); sfx("error"); return; }
    if (!global.Tasks || typeof global.Tasks.judge !== "function") {
      setStatus(t("course.unavailable"), "error");
      return;
    }
    saveDraft(current.id, code);
    busy = true;
    checkBtn.disabled = true;
    resultsEl.innerHTML = "";
    setStatus(t("course.checking"), "loading");
    sfx("click");

    const lesson = current;
    let verdict;
    try {
      verdict = await global.Tasks.judge(code, lesson.task);
    } catch (e) {
      verdict = { passed: false, results: [], error: (e && e.message) || String(e), line: null, okCount: 0, ms: 0 };
    }

    renderResults(lesson.task, verdict);
    busy = false;
    checkBtn.disabled = false;

    if (verdict.passed) {
      registerComplete(lesson);
      setStatus(t("course.accepted"), "ok");
      sfx("success");
    } else if (verdict.error) {
      setStatus(t("course.runtimeError"), "error");
      sfx("error");
    } else {
      setStatus(t("course.failed", { n: verdict.okCount, total: lesson.task.tests.length }), "bad");
      sfx("error");
    }
  }

  function registerComplete(lesson) {
    const p = getProgress();
    const rec = p[lesson.id] || { solved: false };
    const first = !rec.solved;
    rec.solved = true;
    rec.solvedAt = rec.solvedAt || new Date().toISOString().slice(0, 10);
    p[lesson.id] = rec;
    saveProgress(p);
    doneEl.classList.remove("hidden");
    if (first) {
      const done = doneCount();
      document.dispatchEvent(new CustomEvent("lessondone", {
        detail: { id: lesson.id, done: done, total: TOTAL, complete: done >= TOTAL }
      }));
      toast("🎓 " + t("course.lessonToast", { title: pick(lesson.title) }));
      if (done >= TOTAL) toast("🏆 " + t("course.completeToast"));
      renderDetail();
    }
  }

  function renderResults(task, verdict) {
    resultsEl.innerHTML = "";
    const head = el("div", "task-results-head");
    head.appendChild(el("span", "material-icons", verdict.passed ? "verified" : "rule"));
    head.appendChild(el("span", null, t("course.resultsTitle", { ms: verdict.ms })));
    resultsEl.appendChild(head);

    verdict.results.forEach((r, i) => {
      const row = el("div", "test-row " + (r.ok ? "pass" : "fail"));
      row.appendChild(el("span", "material-icons test-ico", r.ok ? "check_circle" : "cancel"));
      const body = el("div", "test-body");
      body.appendChild(el("div", "test-name", t("course.test", { n: i + 1 })));
      body.appendChild(el("div", "test-line", t("course.inputData") + ": " + clip(r.test.in)));
      body.appendChild(el("div", "test-line", t("course.expected") + ": " + clip(r.test.out)));
      if (!r.ok) {
        body.appendChild(el("div", "test-line got", t("course.got") + ": " + (r.error ? clip(verdict.error || "") : clip(r.got))));
      }
      row.appendChild(body);
      resultsEl.appendChild(row);
    });
  }

  function clip(text) {
    const s = global.Tasks && global.Tasks.normalize ? global.Tasks.normalize(text) : String(text == null ? "" : text);
    return s.length > 120 ? s.slice(0, 120) + "…" : s;
  }

  function showHint() {
    if (!current || !hintBoxEl) return;
    hintBoxEl.innerHTML = "";
    const box = el("div", "task-hint-inner");
    box.appendChild(el("span", "material-icons", "lightbulb"));
    box.appendChild(el("span", null, pick(current.task.hint)));
    hintBoxEl.appendChild(box);
    hintBoxEl.classList.remove("hidden");
    sfx("pop");
  }

  function runExample() {
    if (!current) return;
    const editor = $("#code");
    if (editor) {
      editor.value = current.example;
      editor.dispatchEvent(new Event("input", { bubbles: true }));
    }
    if (global.App && global.App.route) global.App.route("python");
    else location.hash = "#python";
    toast(t("course.exampleToast"));
    sfx("pop");
  }

  function copyExample() {
    if (!current) return;
    const text = current.example;
    const done = () => { toast(t("course.copied")); sfx("pop"); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done).catch(done);
    else done();
  }

  function goto(dir) {
    const i = index();
    const next = LESSONS[i + dir];
    if (!next) return;
    if (!isUnlocked(next.lesson.id)) { toast(gateText(next.lesson.id)); sfx("error"); return; }
    if (codeEl && current) saveDraft(current.id, codeEl.value);
    openLesson(next.lesson.id);
  }

  /* ---------- Ініціалізація ---------- */
  function init() {
    progressEl = $("#courseProgress");
    listEl = $("#courseList");
    detailEl = $("#courseDetail");
    if (!listEl) return;

    chapterEl = $("#courseChapter");
    titleEl = $("#courseTitle");
    theoryEl = $("#courseTheory");
    exampleEl = $("#courseExample");
    exampleRunBtn = $("#courseExampleRun");
    exampleCopyBtn = $("#courseExampleCopy");
    taskTextEl = $("#courseTaskText");
    codeEl = $("#courseCode");
    hintBtn = $("#courseHint");
    hintBoxEl = $("#courseHintBox");
    checkBtn = $("#courseCheck");
    resetBtn = $("#courseReset");
    statusEl = $("#courseStatus");
    resultsEl = $("#courseResults");
    doneEl = $("#courseDone");
    prevBtn = $("#coursePrev");
    nextBtn = $("#courseNext");
    backBtn = $("#courseBack");

    if (exampleRunBtn) exampleRunBtn.onclick = runExample;
    if (exampleCopyBtn) exampleCopyBtn.onclick = copyExample;
    if (checkBtn) checkBtn.onclick = check;
    if (hintBtn) hintBtn.onclick = showHint;
    if (resetBtn) resetBtn.onclick = () => {
      if (!current) return;
      codeEl.value = current.task.starter;
      saveDraft(current.id, codeEl.value);
      resultsEl.innerHTML = ""; setStatus(""); sfx("click");
    };
    if (backBtn) backBtn.onclick = () => {
      if (codeEl && current) saveDraft(current.id, codeEl.value);
      renderList(); sfx("click");
    };
    if (prevBtn) prevBtn.onclick = () => goto(-1);
    if (nextBtn) nextBtn.onclick = () => goto(1);
    if (codeEl) codeEl.addEventListener("input", () => { if (current) saveDraft(current.id, codeEl.value); });

    document.addEventListener("langchange", () => {
      if (detailEl && !detailEl.classList.contains("hidden") && current) renderDetail();
      else renderList();
    });
  }

  function render() {
    if (!listEl) { init(); }
    if (!listEl) return;
    if (detailEl && !detailEl.classList.contains("hidden") && current) renderDetail();
    else renderList();
  }

  global.Course = {
    init, render,
    open: openLesson,
    lessons: () => LESSONS.map((e) => e.lesson),
    count: TOTAL,
    done: doneCount
  };
})(window);
