/* exam.js — розділ «Іспит»: перевірка знань у форматі тесту.
   Банк із 32 питань, іспит випадково бере 12 з них, рахує бал, час і зберігає рекорд.
   Прогрес: app.exam.<user> */
(function (global) {
  const $ = (s) => document.querySelector(s);
  const KEY = "app.exam.";
  const DRAW = 12;
  const PASS = 0.7;
  const I = () => global.I18n;
  const L = (o) => (I() ? I().localize(o) : (o && (o.uk || o.en)) || "");
  const t = (k, v) => (I() ? I().t(k, v) : k);

  function user() { return (global.Profile && global.Profile.handle()) || "guest"; }

  /* ---------- Банк питань ---------- */
  /* code і opts — сирові рядки: їх не перекладають.
     q, why та рядкові варіанти-текст — об'єкти {uk,en,tr}. */
  const BANK = [
    /* Основи */
    {
      id: "q-priority", cat: "basics", code: `print(2 + 3 * 4)`, answer: 0,
      opts: ["14", "20", "24", "9"],
      q: { uk: "Що виведе цей код?", en: "What does this code print?", tr: "Bu kod ne yazdırır?" },
      why: {
        uk: "Спочатку множать: 3 * 4 = 12, далі додають 2 — виходить 14.",
        en: "Multiplication goes first: 3 * 4 = 12, then 2 is added, so the result is 14.",
        tr: "Önce çarpma yapılır: 3 * 4 = 12, sonra 2 eklenir; sonuç 14."
      }
    },
    {
      id: "q-true-div", cat: "basics", code: `print(type(7 / 2))`, answer: 1,
      opts: ["int", "float", "double", "number"],
      q: { uk: "Який тип у результату цього виразу?", en: "What type is the result of this expression?", tr: "Bu ifadenin sonucu hangi türde?" },
      why: {
        uk: "Звичайне ділення / завжди дає float, навіть коли число ділиться без остачі: 4 / 2 це 2.0.",
        en: "Plain division / always gives a float, even when it divides evenly: 4 / 2 is 2.0.",
        tr: "Normal bölme her zaman float verir; tam bölünse bile: 4 / 2 sonucu 2.0."
      }
    },
    {
      id: "q-floor-div", cat: "basics", code: `print(7 // 2)`, answer: 1,
      opts: ["3.5", "3", "4", "1"],
      q: { uk: "Що виведе цей рядок?", en: "What does this line print?", tr: "Bu satır ne yazdırır?" },
      why: {
        uk: "// — цілочисельне ділення: дробову частину просто відкидають, лишається 3. Остачу дає %.",
        en: "// is integer division: the fraction is thrown away and 3 remains. The remainder comes from %.",
        tr: "// tam sayı bölmesidir: ondalık kısım atılır ve 3 kalır. Kalanı % verir."
      }
    },
    {
      id: "q-str-plus", cat: "basics", code: `print("5" + "5")`, answer: 1,
      opts: ["10", "55", "5", "TypeError"],
      q: { uk: "Який буде результат?", en: "What is the result?", tr: "Sonuç ne olur?" },
      why: {
        uk: "Обидва значення — рядки, тому + їх з'єднує, а не додає. Щоб отримати 10, треба int(\"5\") + int(\"5\").",
        en: "Both values are strings, so + glues them together instead of adding. For 10 you need int(\"5\") + int(\"5\").",
        tr: "İki değer de metin olduğundan + bunları toplamaz, birleştirir. 10 için int(\"5\") + int(\"5\") gerekir."
      }
    },
    {
      id: "q-empty-bool", cat: "basics", code: `print(bool(""))`, answer: 1,
      opts: ["True", "False", "0", "None"],
      q: { uk: "Що виведе цей рядок?", en: "What does this line print?", tr: "Bu satır ne yazdırır?" },
      why: {
        uk: "Порожній рядок — хибне значення, як і порожній список, 0 або None. Усі решта — істина.",
        en: "An empty string is falsy, just like an empty list, 0 or None. Everything else counts as true.",
        tr: "Boş metin, boş liste, 0 veya None gibi yanlış değeri taşır. Geri kalan her şey doğrudur."
      }
    },
    {
      id: "q-int-cast", cat: "basics", code: `print(int(2.9))`, answer: 1,
      opts: ["3", "2", "2.9", "ValueError"],
      q: { uk: "Яке число надрукує цей код?", en: "Which number does this code print?", tr: "Bu kod hangi sayıyı yazdırır?" },
      why: {
        uk: "int() для float не округлює, а відрізає дробову частину. Округлення — це round(2.9).",
        en: "int() on a float does not round, it cuts the fraction off. Rounding is round(2.9).",
        tr: "int() ondalık sayıyı yuvarlamaz, kesirli kısmı kesip atar. Yuvarlama round(2.9) işidir."
      }
    },

    /* Рядки */
    {
      id: "q-str-times", cat: "strings", code: `print("abc" * 2)`, answer: 0,
      opts: ["abcabc", "abccba", "abc2", "TypeError"],
      q: { uk: "Що виведе цей рядок?", en: "What does this line print?", tr: "Bu satır ne yazdırır?" },
      why: {
        uk: "Рядок, помножений на число, повторюється стільки разів. На нуль або від'ємне вийде порожній рядок.",
        en: "A string multiplied by a number repeats that many times. Times zero or a negative value gives an empty string.",
        tr: "Bir sayıyla çarpılan metin o kadar kez tekrarlanır. Sıfır ya da eksiyle çarparsan boş metin çıkar."
      }
    },
    {
      id: "q-slice", cat: "strings", code: `print("Python"[1:3])`, answer: 1,
      opts: ["Pyt", "yt", "yth", "on"],
      q: { uk: "Який шматок рядка виведеться?", en: "Which piece of the string is printed?", tr: "Metnin hangi parçası yazdırılır?" },
      why: {
        uk: "Зріз бере індекси 1 і 2, а 3 не включає. Індексація в Python починається з нуля.",
        en: "The slice takes indexes 1 and 2 and leaves 3 out. Python starts counting at zero.",
        tr: "Dilim 1 ve 2 indekslerini alır, 3'ü içermez. Python'da sayım sıfırdan başlar."
      }
    },
    {
      id: "q-split-empty", cat: "strings", code: `print(len("a,b,,c".split(",")))`, answer: 0,
      opts: ["4", "3", "5", "2"],
      q: { uk: "Скільки елементів у списку після split?", en: "How many items does the list have after split?", tr: "split sonrası listede kaç öğe var?" },
      why: {
        uk: "Між двома комами стоїть порожній шматок — split зберігає і його: ['a', 'b', '', 'c'].",
        en: "Between two commas sits an empty piece, and split keeps it: ['a', 'b', '', 'c'].",
        tr: "İki virgül arasında boş bir parça durur; split onu da korur: ['a', 'b', '', 'c']."
      }
    },
    {
      id: "q-replace", cat: "strings", code: `print("hello".replace("l", "L"))`, answer: 0,
      opts: ["heLLo", "heLlo", "HellO", "hello"],
      q: { uk: "Який рядок виведе цей код?", en: "Which string does this code print?", tr: "Bu kod hangi metni yazdırır?" },
      why: {
        uk: "replace без третього аргумента змінює всі входження. Повертається новий рядок, старий лишається як був.",
        en: "Without a third argument replace changes every occurrence. It returns a new string and the old one stays as it was.",
        tr: "Üçüncü argüman olmadan replace tüm geçişleri değiştirir. Yeni bir metin döner, eskisi olduğu gibi kalır."
      }
    },
    {
      id: "q-join", cat: "strings", code: `print("-".join(["a", "b", "c"]))`, answer: 2,
      opts: ["abc", "['a-b-c']", "a-b-c", "-abc-"],
      q: { uk: "Що надрукує цей рядок?", en: "What does this line print?", tr: "Bu satır ne yazdırır?" },
      why: {
        uk: "join викликають від роздільника, і він стає між елементами списку. На виході — звичайний рядок.",
        en: "join is called on the separator, and that separator lands between the list items. The result is a plain string.",
        tr: "join ayırıcı üzerinde çağrılır ve ayırıcı liste öğelerinin arasına yerleşir. Ortaya düz bir metin çıkar."
      }
    },

    /* Колекції */
    {
      id: "q-neg-index", cat: "collections", code: `print([1, 2, 3][-1])`, answer: 2,
      opts: ["1", "IndexError", "3", "None"],
      q: { uk: "Яке значення виведеться?", en: "Which value is printed?", tr: "Hangi değer yazdırılır?" },
      why: {
        uk: "Від'ємний індекс рахує з кінця: -1 — останній елемент, -2 — передостанній.",
        en: "A negative index counts from the end: -1 is the last item, -2 the one before it.",
        tr: "Eksi indeks sondan sayar: -1 son öğe, -2 ondan öncekidir."
      }
    },
    {
      id: "q-set-union", cat: "collections", code: `print(sorted({1, 2} | {2, 3}))`, answer: 0,
      opts: ["[1, 2, 3]", "{1, 2, 2, 3}", "[1, 2]", "[2]"],
      q: { uk: "Що виведе цей код?", en: "What does this code print?", tr: "Bu kod ne yazdırır?" },
      why: {
        uk: "| — об'єднання множин, дублікатів у множині не буває. sorted(...) повертає список, а не множину.",
        en: "| is the union of sets, and a set never keeps duplicates. sorted(...) returns a list, not a set.",
        tr: "| kümelerin birleşimidir; kümede yineleme olmaz. sorted(...) küme değil liste döndürür."
      }
    },
    {
      id: "q-dict-len", cat: "collections", code: `d = {"a": 1}\nd["b"] = 2\nprint(len(d))`, answer: 1,
      opts: ["1", "2", "3", "KeyError"],
      q: { uk: "Скільки пар буде у словнику наприкінці?", en: "How many pairs does the dictionary hold at the end?", tr: "Sözlük sonunda kaç çift içerir?" },
      why: {
        uk: "Запис за новим ключем додає пару. Якби ключ уже існував, значення просто переписалося б.",
        en: "Assigning under a new key adds a pair. If the key had existed, its value would simply be overwritten.",
        tr: "Yeni bir anahtara atama yapmak bir çift ekler. Anahtar zaten varsa değeri yalnızca üzerine yazılır."
      }
    },
    {
      id: "q-range-list", cat: "collections", code: `print(list(range(3)))`, answer: 0,
      opts: ["[0, 1, 2]", "[1, 2, 3]", "[0, 1, 2, 3]", "[3]"],
      q: { uk: "Який список виведе цей рядок?", en: "Which list does this line print?", tr: "Bu satır hangi listeyi yazdırır?" },
      why: {
        uk: "range(3) дає 0, 1, 2 — останнє число не входить. Початок за замовчуванням теж нуль.",
        en: "range(3) gives 0, 1, 2 — the last number is excluded, and the default start is zero.",
        tr: "range(3) 0, 1, 2 verir: son sayı aralığa girmez, başlangıç da varsayılan olarak sıfırdır."
      }
    },
    {
      id: "q-append-list", cat: "collections", code: `nums = [1, 2, 3]\nnums.append([4, 5])\nprint(len(nums))`, answer: 0,
      opts: ["4", "5", "3", "TypeError"],
      q: { uk: "Якою буде довжина списку?", en: "What will the length of the list be?", tr: "Listenin uzunluğu ne olur?" },
      why: {
        uk: "append додає один елемент — тут ним стає весь вкладений список. extend() додав би два окремих числа.",
        en: "append adds a single item — here that item is the whole nested list. extend() would have added two separate numbers.",
        tr: "append tek öğe ekler; burada o öğe iç içe geçmiş listenin ta kendisidir. extend() iki ayrı sayı eklerdi."
      }
    },
    {
      id: "q-list-times", cat: "collections", code: `print([1, 2] * 2)`, answer: 1,
      opts: ["[2, 4]", "[1, 2, 1, 2]", "[1, 2, 2]", "TypeError"],
      q: { uk: "Що виведе цей рядок?", en: "What does this line print?", tr: "Bu satır ne yazdırır?" },
      why: {
        uk: "Список, помножений на число, повторюється цілими блоками, а не по елементах.",
        en: "A list multiplied by a number repeats in whole blocks, element by element is not what happens.",
        tr: "Bir sayıyla çarpılan liste baştan sona bloklar hâlinde tekrarlanır; her öğe ayrı ayrı çarpılmaz."
      }
    },

    /* Умови й цикли */
    {
      id: "q-loop-sum", cat: "control", code: `total = 0\nfor i in range(1, 4):\n    total += i\nprint(total)`, answer: 2,
      opts: ["10", "4", "6", "3"],
      q: { uk: "Яке число виведеться?", en: "Which number is printed?", tr: "Hangi sayı yazdırılır?" },
      why: {
        uk: "range(1, 4) дає 1, 2, 3 — четвірки немає. Їхня сума дорівнює 6.",
        en: "range(1, 4) gives 1, 2 and 3 — there is no four. Their sum is 6.",
        tr: "range(1, 4) 1, 2 ve 3 verir; dörd yoktur. Topamları 6 eder."
      }
    },
    {
      id: "q-ternary", cat: "control", code: `print("yes" if 0 else "no")`, answer: 1,
      opts: ["yes", "no", "0", "None"],
      q: { uk: "Що надрукує цей рядок?", en: "What does this line print?", tr: "Bu satır ne yazdırır?" },
      why: {
        uk: "Нуль — хибне значення, тому спрацьовує гілка else і виводиться no.",
        en: "Zero is falsy, so the else branch runs and prints no.",
        tr: "Sıfır yanlış bir değerdir; bu yüzden else dalı çalışır ve no yazdırılır."
      }
    },
    {
      id: "q-while", cat: "control", code: `n = 0\nwhile n < 5:\n    n += 2\nprint(n)`, answer: 0,
      opts: ["6", "5", "4", "нескінченний цикл"],
      q: { uk: "Яке значення виведеться в кінці?", en: "Which value is printed at the end?", tr: "Sonda hangi değer yazdırılır?" },
      why: {
        uk: "n росте на 2: 0, 2, 4, 6. Умова перевіряється до тіла, тому цикл зупиняється вже на 6.",
        en: "n grows by two: 0, 2, 4, 6. The condition is tested before the body, so the loop stops at 6.",
        tr: "n ikişer artar: 0, 2, 4, 6. Koşul gövdeden önce sınandığı için döngü 6'da durur."
      }
    },
    {
      id: "q-continue", cat: "control", code: `for i in range(3):\n    if i == 1:\n        continue\n    print(i, end="")\nprint()`, answer: 1,
      opts: ["012", "02", "1", "0"],
      q: { uk: "Що виведе цей код?", en: "What does this code print?", tr: "Bu kod ne yazdırır?" },
      why: {
        uk: "continue пропускає решту тіла лише для i == 1, тому одиниця не друкується, а цикл триває.",
        en: "continue skips the rest of the body only for i == 1, so the one is never printed but the loop goes on.",
        tr: "continue gövdenin kalanını yalnızca i == 1 için atlar; bu yüzden bir yazılmaz ama döngü sürer."
      }
    },

    /* Функції */
    {
      id: "q-default", cat: "functions", code: `def f(a, b=2):\n    return a * b\n\nprint(f(3))`, answer: 1,
      opts: ["3", "6", "5", "TypeError"],
      q: { uk: "Який результат поверне функція?", en: "What result does the function return?", tr: "İşlev hangi sonucu döndürür?" },
      why: {
        uk: "Другий аргумент не передали, тому бере значення за замовчуванням 2: 3 * 2 = 6.",
        en: "The second argument was not passed, so the default 2 is used: 3 * 2 = 6.",
        tr: "İkinci argüman gönderilmediği için varsayılan 2 kullanılır: 3 * 2 = 6."
      }
    },
    {
      id: "q-no-return", cat: "functions", code: `def f(x):\n    x = x + 1\n\nn = 5\nf(n)\nprint(n)`, answer: 2,
      opts: ["6", "1", "5", "None"],
      q: { uk: "Що виведе останній рядок?", en: "What does the last line print?", tr: "Son satır ne yazdırır?" },
      why: {
        uk: "x усередині функції — окрема змінна, а result нікуди не повертається. Зовнішнє n лишається 5.",
        en: "x inside the function is a separate variable and nothing is returned, so the outer n stays 5.",
        tr: "İşlev içindeki x ayrı bir değişkendir ve geri hiçbir şey döndürülmez; dışarıdaki n 5 olarak kalır."
      }
    },
    {
      id: "q-args", cat: "functions", code: `def add(*a):\n    return sum(a)\n\nprint(add(1, 2, 3))`, answer: 0,
      opts: ["6", "(1, 2, 3)", "123", "TypeError"],
      q: { uk: "Що виведе цей виклик?", en: "What does this call print?", tr: "Bu çağrı ne yazdırır?" },
      why: {
        uk: "*a збирає всі позиційні аргументи в кортеж (1, 2, 3), а sum(...) додає його елементи.",
        en: "*a collects every positional argument into the tuple (1, 2, 3) and sum(...) adds its items up.",
        tr: "*a tüm konumsal argümanları (1, 2, 3) demetinde toplar, sum(...) da öğelerini toplayır."
      }
    },
    {
      id: "q-lambda", cat: "functions", code: `print((lambda x: x ** 2)(4))`, answer: 1,
      opts: ["8", "16", "44", "TypeError"],
      q: { uk: "Яке значення виведеться?", en: "Which value is printed?", tr: "Hangi değer yazdırılır?" },
      why: {
        uk: "lambda — функція з одного виразу; якщо викликати її одразу з 4, виходить 4 ** 2 = 16.",
        en: "lambda is a one-expression function; calling it right away with 4 gives 4 ** 2 = 16.",
        tr: "lambda tek ifadeli bir işlevdir; hemen 4 ile çağrılınca 4 ** 2 = 16 çıkar."
      }
    },
    {
      id: "q-sort-inplace", cat: "functions", code: `nums = [3, 1, 2]\nnums.sort()\nprint(nums[0])`, answer: 2,
      opts: ["3", "2", "1", "None"],
      q: { uk: "Що виведе останній рядок?", en: "What does the last line print?", tr: "Son satır ne yazdırır?" },
      why: {
        uk: "sort() впорядковує сам список на місці, тому першим стає найменше число — 1.",
        en: "sort() orders the list in place, so the smallest number — 1 — comes first.",
        tr: "sort() listeyi yerinde sıralar; bu yüzden en küçük sayı, yani 1, başa gelir."
      }
    },

    /* Помилки */
    {
      id: "q-zero-div", cat: "errors", code: `print(1 / 0)`, answer: 0,
      opts: ["ZeroDivisionError", "ValueError", "TypeError", "SyntaxError"],
      q: { uk: "Яка помилка станеться?", en: "Which error happens?", tr: "Hangi hata oluşur?" },
      why: {
        uk: "Ділення на нуль дає ZeroDivisionError. Вона виникає під час запуску, тож try/except її спокійно ловить.",
        en: "Dividing by zero raises ZeroDivisionError. It appears at run time, so try/except can catch it.",
        tr: "Sıfıra bölme ZeroDivisionError yükseltir. Çalışma anında ortaya çıkar, bu yüzden try/except ile yakalanabilir."
      }
    },
    {
      id: "q-try-else", cat: "errors", code: `try:\n    int("x")\nexcept ValueError:\n    print("bad")\nelse:\n    print("ok")`, answer: 1,
      opts: ["ok", "bad", "ok bad", "нічого"],
      q: { uk: "Що виведе цей блок?", en: "What does this block print?", tr: "Bu blok ne yazdırır?" },
      why: {
        uk: "int(\"x\") піднімає ValueError, тому працює except, а else пропускається: воно лише для успішного try.",
        en: "int(\"x\") raises ValueError, so except runs and else is skipped — else only fires when try succeeded.",
        tr: "int(\"x\") ValueError yükseltir; bu yüzden except çalışır, else atlanır — else yalnız try başarılıysa çalışır."
      }
    },
    {
      id: "q-name-error", cat: "errors", code: `print(missing_name)`, answer: 2,
      opts: ["None", "KeyError", "NameError", "TypeError"],
      q: { uk: "Яку помилку покаже Python?", en: "Which error does Python show?", tr: "Python hangi hatayı gösterir?" },
      why: {
        uk: "Ім'я не знайдене серед змінних і функцій — це NameError. Зазвичай причина проста: одруківка або змінна, якій нічого не присвоїли.",
        en: "The name is not among the variables and functions, which is NameError. Usually it is a typo or a variable that was never assigned.",
        tr: "Ad, değişkenler ve işlevler arasında bulunamaz; bu NameError'dır. Genelde bir yazım hatası ya da hiç atanmamış bir değişkendir."
      }
    },

    /* Файли */
    {
      id: "q-with", cat: "files", answer: 1,
      q: {
        uk: "Навіщо брати відкриття файла в блок with?",
        en: "Why wrap opening a file in a with block?",
        tr: "Bir dosyayı açmak neden with bloğunun içine alınır?"
      },
      opts: [
        { uk: "Щоб читати швидше", en: "To read faster", tr: "Daha hızlı okumak için" },
        { uk: "Файл закриється сам, навіть якщо всередині станеться помилка", en: "The file closes on its own even if an error happens inside", tr: "İçeride bir hata olsa bile dosya kendiliğinden kapanır" },
        { uk: "Інакше Python не дозволить писати у файл", en: "Otherwise Python refuses to write to the file", tr: "Aksi halde Python dosyaya yazmaya izin vermez" },
        { uk: "Щоб файл створився, якщо його немає", en: "So that the file is created if it does not exist", tr: "Olmayan dosya bu şekilde oluşturulur" }
      ],
      why: {
        uk: "with гарантує close() у будь-якому випадку. open(..., \"w\") теж сам створює файл, але суть питання не в цьому.",
        en: "with guarantees close() no matter what. open(..., \"w\") does create a file too, but that is not what this is about.",
        tr: "with her hâlükârda close() çalıştırır. open(..., \"w\") dosyayı oluşturur ama meselenin özü burada değil."
      }
    },
    {
      id: "q-append-mode", cat: "files", answer: 2,
      q: {
        uk: "Який режим open() додає текст у кінець файла, не стираючи його?",
        en: "Which open() mode adds text at the end of a file without wiping it?",
        tr: "open() modlarından hangisi dosyanın sonuna, onu silmeden metin ekler?"
      },
      opts: ["r", "w", "a", "x"],
      why: {
        uk: "\"a\" — appends, \"w\" перезаписує файл з нуля, \"r\" лише читає, \"x\" створює новий і відмовляє, якщо файл уже є.",
        en: "\"a\" appends, \"w\" rewrites the file from scratch, \"r\" only reads, and \"x\" creates a new file but refuses if it already exists.",
        tr: "\"a\" sonuna ekler, \"w\" dosyayı baştan yazar, \"r\" yalnızca okur, \"x\" yeni dosya oluşturur ama varsa itiraz eder."
      }
    },

    /* Класи */
    {
      id: "q-init", cat: "oop", answer: 0,
      q: {
        uk: "Коли виконується __init__?",
        en: "When does __init__ run?",
        tr: "__init__ ne zaman çalışır?"
      },
      opts: [
        { uk: "Під час створення нового об'єкта класу", en: "When a new object of the class is created", tr: "Sınıfın yeni bir nesnesi oluşturulurken" },
        { uk: "Кожного виклику будь-якого методу", en: "On every call of any method", tr: "Her yöntemin her çağrısında" },
        { uk: "Під час імпорту модуля з класом", en: "When the module holding the class is imported", tr: "Sınıfı içeren modül içe aktarılırken" },
        { uk: "Лише при видаленні об'єкта", en: "Only when the object is deleted", tr: "Yalnızca nesne silinirken" }
      ],
      why: {
        uk: "__init__ заповнює поля нового об'єкта в момент його створення. При видаленні натомість працює __del__.",
        en: "__init__ fills the fields of a new object at the moment it is created. __del__ is the one that runs on deletion.",
        tr: "__init__, yeni nesnenin oluşturulduğu anda alanlarını doldurur. Silinirken çalışan ise __del__'dir."
      }
    },
    {
      id: "q-self", cat: "oop", answer: 1,
      q: {
        uk: "Що таке self у методах класу?",
        en: "What is self inside a class method?",
        tr: "Bir sınıf yönteminde self nedir?"
      },
      opts: [
        { uk: "Ім'я самого класу", en: "The name of the class", tr: "Sınıfın kendi adı" },
        { uk: "Конкретний об'єкт, який викликає метод", en: "The very object that calls the method", tr: "Yöntemi çağıran nesnenin ta kendisi" },
        { uk: "Список усіх об'єктів класу", en: "A list of every object of the class", tr: "Sınıfın tüm nesnelerinin listesi" },
        { uk: "Ключове слово, яке можна не писати", en: "A keyword you may leave out", tr: "Yazılmayabilen bir anahtar sözcük" }
      ],
      why: {
        uk: "self — це поточний екземпляр: через self.method(...) Python знає, до якого саме об'єкта звертатися. Його пишуть першим параметром.",
        en: "self is the current instance: through it Python knows which exact object a call belongs to. It is written as the first parameter.",
        tr: "self, içinde bulunulan örnektir; Python bunun hangi nesneye ait olduğunu bilir. İlk parametre olarak yazılır."
      }
    }
  ];

  const BY_ID = {};
  BANK.forEach((q) => { BY_ID[q.id] = q; });

  /* ---------- Стан ---------- */
  function getState() {
    let s = null;
    try { s = JSON.parse(localStorage.getItem(KEY + user())); } catch (e) { s = null; }
    if (!s || typeof s !== "object") s = {};
    if (typeof s.attempts !== "number") s.attempts = 0;
    if (typeof s.best !== "number") s.best = 0;
    if (typeof s.bestTime !== "number") s.bestTime = 0;
    if (typeof s.passed !== "number") s.passed = 0;
    if (!Array.isArray(s.history)) s.history = [];
    return s;
  }

  function saveState(s) {
    try { localStorage.setItem(KEY + user(), JSON.stringify(s)); } catch (e) { /* сховище переповнене */ }
  }

  /* ---------- Раунд ---------- */
  let round = null;       // { ids:[..], picks:[..], startedAt, finishedAt }
  let cursor = 0;

  function shuffle(list, rnd) {
    const a = list.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1));
      const tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  function start() {
    const ids = shuffle(BANK.map((q) => q.id), Math.random).slice(0, Math.min(DRAW, BANK.length));
    round = { ids: ids, picks: ids.map(() => null), startedAt: Date.now(), finishedAt: 0 };
    cursor = 0;
    render();
    if (global.Audio && global.Audio.sfx) global.Audio.sfx("click");
  }

  function size() { return round ? round.ids.length : 0; }

  function scoreOf(r) {
    let n = 0;
    r.ids.forEach((id, i) => { if (r.picks[i] === BY_ID[id].answer) n++; });
    return n;
  }

  function elapsed(r) {
    const end = r.finishedAt || Date.now();
    return Math.max(0, Math.round((end - r.startedAt) / 1000));
  }

  function fmtTime(sec) {
    const m = Math.floor(sec / 60), s = sec % 60;
    return (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s;
  }

  function prettyTime(sec) {
    const m = Math.floor(sec / 60), s = sec % 60;
    if (!m) return t("exam.seconds", { n: s });
    return t("exam.minutes", { m: m, s: s });
  }

  function finish() {
    if (!round) return;
    round.finishedAt = Date.now();
    const score = scoreOf(round);
    const total = round.ids.length;
    const percent = Math.round((score / total) * 100);
    const passed = percent >= PASS * 100;
    const seconds = elapsed(round);
    const s = getState();
    s.attempts += 1;
    if (score > s.best) s.best = score;
    if (passed) s.passed += 1;
    if (passed && (!s.bestTime || seconds < s.bestTime)) s.bestTime = seconds;
    s.history.unshift({ at: round.finishedAt, score: score, total: total, percent: percent, passed: passed, seconds: seconds });
    s.history = s.history.slice(0, 20);
    saveState(s);
    document.dispatchEvent(new CustomEvent("examdone", {
      detail: { score: score, total: total, percent: percent, passed: passed, seconds: seconds, attempts: s.attempts, best: s.best }
    }));
    render();
    if (global.Audio && global.Audio.sfx) global.Audio.sfx(passed ? "success" : "error");
  }

  /* ---------- Елементи ---------- */
  let ready = false;
  let stageEl, introEl, barEl, titleEl, metaEl, bodyEl, footEl, historyEl;

  function escapeHtml(s) {
    return String(s).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
  }

  /* ---------- Рендер ---------- */
  function renderHead(s) {
    if (!metaEl) return;
    const parts = [];
    parts.push('<span class="exam-pill"><span class="material-icons">fact_check</span>' +
      escapeHtml(t("exam.bankSize", { n: BANK.length })) + "</span>");
    parts.push('<span class="exam-pill"><span class="material-icons">replay</span>' +
      escapeHtml(t("exam.attempts", { n: s.attempts })) + "</span>");
    parts.push('<span class="exam-pill"><span class="material-icons">emoji_events</span>' +
      escapeHtml(t("exam.best", { n: s.best, total: DRAW })) + "</span>");
    if (s.bestTime) parts.push('<span class="exam-pill"><span class="material-icons">timer</span>' +
      escapeHtml(fmtTime(s.bestTime)) + "</span>");
    metaEl.innerHTML = parts.join("");
  }

  function optionRow(q, idx, picked, showResult) {
    const correct = idx === q.answer;
    const chosen = picked === idx;
    let cls = "exam-opt";
    if (showResult) {
      if (correct) cls += " right";
      else if (chosen) cls += " wrong";
      if (!chosen) cls += " dim";
    } else if (chosen) cls += " on";
    return '<button class="' + cls + '" type="button" data-opt="' + idx + '"' +
      (showResult ? " disabled" : "") + ">" +
      '<span class="exam-opt-mark">' + (showResult ? (correct ? "check" : (chosen ? "close" : "")) : String.fromCharCode(65 + idx)) + "</span>" +
      "<span>" + escapeHtml(L(q.opts[idx])) + "</span></button>";
  }

  function renderQuestion() {
    const q = BY_ID[round.ids[cursor]];
    const picked = round.picks[cursor];
    const isLast = cursor === round.ids.length - 1;
    if (titleEl) titleEl.textContent = t("exam.question", { n: cursor + 1, total: round.ids.length });
    if (barEl) barEl.style.width = ((cursor + 1) / round.ids.length * 100).toFixed(1) + "%";
    const head = [];
    head.push('<div class="exam-q-meta"><span class="exam-cat">' + escapeHtml(L(catName(q.cat))) + "</span></div>");
    if (q.code) head.push('<pre class="exam-code">' + escapeHtml(q.code) + "</pre>");
    head.push('<p class="exam-q">' + escapeHtml(L(q.q)) + "</p>");
    const opts = q.opts.map((o, i) => optionRow(q, i, picked, false)).join("");
    if (bodyEl) bodyEl.innerHTML = head.join("") + '<div class="exam-opts">' + opts + "</div>";
    if (footEl) footEl.innerHTML =
      '<button class="btn text" type="button" data-act="quit"><span class="material-icons">close</span><span>' + escapeHtml(t("exam.quit")) + "</span></button>" +
      '<div class="exam-foot-right">' +
      (cursor > 0 ? '<button class="btn outlined" type="button" data-act="prev"><span class="material-icons">arrow_back</span><span>' + escapeHtml(t("exam.prev")) + "</span></button>" : "") +
      (picked === null
        ? '<button class="btn contained" type="button" data-act="skip"><span>' + escapeHtml(isLast ? t("exam.skipLast") : t("exam.skipNext")) + '</span><span class="material-icons">arrow_forward</span></button>'
        : '<button class="btn contained" type="button" data-act="next"><span>' + escapeHtml(isLast ? t("exam.finish") : t("exam.next")) + '</span><span class="material-icons">' + (isLast ? "done_all" : "arrow_forward") + "</span></button>") +
      "</div>";
  }

  const CAT_INFO = {
    basics: { uk: "Основи", en: "Basics", tr: "Temeller" },
    strings: { uk: "Рядки", en: "Strings", tr: "Metinler" },
    collections: { uk: "Колекції", en: "Collections", tr: "Koleksiyonlar" },
    control: { uk: "Умови й цикли", en: "Conditions and loops", tr: "Koşullar ve döngüler" },
    functions: { uk: "Функції", en: "Functions", tr: "Fonksiyonlar" },
    errors: { uk: "Помилки", en: "Errors", tr: "Hatalar" },
    files: { uk: "Файли", en: "Files", tr: "Dosyalar" },
    oop: { uk: "Класи", en: "Classes", tr: "Sınıflar" }
  };
  function catName(c) { return CAT_INFO[c] || { uk: c, en: c, tr: c }; }

  function renderResult(s) {
    const score = scoreOf(round);
    const total = round.ids.length;
    const percent = Math.round((score / total) * 100);
    const passed = percent >= PASS * 100;
    if (titleEl) titleEl.textContent = t("exam.resultTitle");
    if (barEl) barEl.style.width = "100%";
    const blocks = [];
    blocks.push('<div class="exam-score ' + (passed ? "ok" : "bad") + '">' +
      '<div class="exam-score-num">' + score + "<small>/" + total + "</small></div>" +
      '<div class="exam-score-text"><strong>' + escapeHtml(passed ? t("exam.passed") : t("exam.failed")) + "</strong>" +
      "<span>" + escapeHtml(t("exam.scoreLine", { p: percent, need: Math.round(PASS * 100) })) + "</span>" +
      "<span>" + escapeHtml(t("exam.timeLine", { time: prettyTime(elapsed(round)) })) + "</span></div></div>");
    const review = round.ids.map((id, i) => {
      const q = BY_ID[id];
      const picked = round.picks[i];
      const ok = picked === q.answer;
      const opts = q.opts.map((o, k) => optionRow(q, k, picked, true)).join("");
      return '<article class="exam-review-card' + (ok ? " ok" : " bad") + '">' +
        '<header class="exam-review-head">' +
          '<span class="material-icons">' + (ok ? "check_circle" : "cancel") + "</span>" +
          "<b>" + (i + 1) + ". " + escapeHtml(L(q.q)) + "</b>" +
        "</header>" +
        (q.code ? '<pre class="exam-code">' + escapeHtml(q.code) + "</pre>" : "") +
        '<div class="exam-opts review">' + opts + "</div>" +
        (picked === null ? '<p class="exam-nopick">' + escapeHtml(t("exam.noPick")) + "</p>" : "") +
        '<p class="exam-why"><span class="material-icons">lightbulb</span>' + escapeHtml(L(q.why)) + "</p>" +
        "</article>";
    });
    blocks.push('<h3 class="exam-review-title">' + escapeHtml(t("exam.reviewTitle")) + "</h3>");
    blocks.push('<div class="exam-review">' + review.join("") + "</div>");
    if (bodyEl) bodyEl.innerHTML = blocks.join("");
    if (footEl) footEl.innerHTML =
      '<button class="btn text" type="button" data-act="home"><span class="material-icons">home</span><span>' + escapeHtml(t("exam.backToIntro")) + "</span></button>" +
      '<button class="btn contained" type="button" data-act="again"><span class="material-icons">refresh</span><span>' + escapeHtml(t("exam.again")) + "</span></button>";
  }

  function renderHistory(s) {
    if (!historyEl) return;
    if (!s.history.length) {
      historyEl.innerHTML = '<span class="muted">' + escapeHtml(t("exam.noHistory")) + "</span>";
      return;
    }
    const rows = s.history.slice(0, 5).map((h) =>
      '<li><b class="' + (h.passed ? "ok" : "bad") + '">' + h.score + "/" + h.total + "</b>" +
      '<span>' + h.percent + "%</span>" +
      '<span>' + escapeHtml(fmtTime(h.seconds)) + "</span>" +
      '<span class="muted">' + escapeHtml(new Date(h.at).toLocaleDateString()) + "</span></li>");
    historyEl.innerHTML = '<ul class="exam-history">' + rows.join("") + "</ul>";
  }

  function render() {
    if (!stageEl) { if (!ready) init(); return; }
    const s = getState();
    renderHead(s);
    renderHistory(s);
    if (introEl) introEl.classList.toggle("hidden", !!round);
    if (stageEl) stageEl.classList.toggle("hidden", !round);
    if (!round) {
      if (barEl) barEl.style.width = "0%";
      return;
    }
    if (round.finishedAt) renderResult(s);
    else renderQuestion();
  }

  /* ---------- Дії ---------- */
  function pick(idx) {
    if (!round || round.finishedAt) return;
    round.picks[cursor] = idx;
    if (global.Audio && global.Audio.sfx) global.Audio.sfx("pop");
    renderQuestion();
  }

  function next() {
    if (!round) return;
    if (cursor < round.ids.length - 1) { cursor += 1; renderQuestion(); }
    else finish();
  }

  function onClick(ev) {
    const opt = ev.target.closest("[data-opt]");
    if (opt && !opt.disabled) { pick(Number(opt.getAttribute("data-opt"))); return; }
    const btn = ev.target.closest("[data-act]");
    if (!btn) return;
    const act = btn.getAttribute("data-act");
    const sfx = (n) => { if (global.Audio && global.Audio.sfx) global.Audio.sfx(n); };
    if (act === "next" || act === "skip") { next(); sfx("click"); }
    else if (act === "prev") { if (cursor > 0) { cursor -= 1; renderQuestion(); } sfx("click"); }
    else if (act === "quit") {
      if (!confirm(t("exam.quitConfirm"))) return;
      round = null; cursor = 0; render(); sfx("click");
    } else if (act === "again") {
      start();
    } else if (act === "home") {
      round = null; cursor = 0; render(); sfx("click");
    }
  }

  /* ---------- Ініціалізація ---------- */
  function init() {
    if (ready) { render(); return; }
    stageEl = $("#examStage");
    if (!stageEl) return;
    ready = true;
    introEl = $("#examIntro");
    barEl = $("#examBarFill");
    titleEl = $("#examStageTitle");
    metaEl = $("#examMeta");
    bodyEl = $("#examBody");
    footEl = $("#examFoot");
    historyEl = $("#examHistory");

    stageEl.addEventListener("click", onClick);

    const startBtn = $("#examStart");
    if (startBtn) startBtn.addEventListener("click", start);

    const resetBtn = $("#examReset");
    if (resetBtn) resetBtn.addEventListener("click", () => {
      if (!confirm(t("exam.resetConfirm"))) return;
      const s = getState();
      s.attempts = 0; s.best = 0; s.bestTime = 0; s.passed = 0; s.history = [];
      saveState(s);
      round = null; cursor = 0;
      render();
      if (global.App && global.App.toast) global.App.toast(t("exam.resetDone"));
    });

    document.addEventListener("langchange", () => {
      try { render(); } catch (e) { console.warn("exam langchange", e); }
    });

    render();
    console.info("[exam.js] ready", BANK.length);
  }

  global.Exam = {
    init,
    render,
    start,
    bank: BANK,
    size: BANK.length,
    draw: DRAW,
    pass: PASS,
    stats: () => {
      const s = getState();
      return { attempts: s.attempts, best: s.best, passed: s.passed, bestTime: s.bestTime, history: s.history };
    }
  };
})(window);
