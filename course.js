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
            uk: "Python — проста й потужна мова. Команда print() виводить значення на екран: текст у лапках — це рядок, а числа пишуть без лапок. Кожен виклик print() дає окремий рядок, а кілька значень у дужках виводяться через пробіл: print(\"мені\", 9). Порожній print() друкує просто порожній рядок.",
            en: "Python is a simple yet powerful language. The print() command shows values on screen: text in quotes is a string, numbers are written without quotes. Each print() call outputs its own line, and several values in the parentheses are shown separated by a space: print(\"мені\", 9). An empty print() just outputs a blank line.",
            tr: "Python basit ama güçlü bir dildir. print() komutu değerleri ekrana yazar: tırnak içindeki metin bir dizedir, sayılar tırnaksız yazılır. Her print() çağrısı kendi satırını verir; parantez içindeki birkaç değer boşlukla ayrılır: print(\"beni\", 9). Boş bir print() yalnızca boş satır yazdırır."
          },
          example: "print(\"Привіт, Python!\")\nprint(2026)\nprint(\"мені\", 9)\nprint()\n",
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
          id: "literals",
          title: { uk: "Літерали: значення прямо в коді", en: "Literals: values right in the code", tr: "Literal: doğrudan kod içindeki değer" },
          theory: {
            uk: "Літерал — це значення, записане прямо в коді: 42 (ціле int), 3.14 (дійсне float), \"текст\" (рядок str), True та False (логічний bool), None (порожнє значення). Рядок можна писати в одинарних або подвійних лапках, але лапки мають бути однакові з обох боків, а числа й True пишуться без лапок. Найпростіший вивід — передати літерал прямо в print(): print(\"hello\") надрукує hello без лапок, бо лапки існують лише в коді, щоб показати межу рядка.",
            en: "A literal is a value written directly in the code: 42 (integer int), 3.14 (float), \"text\" (string str), True and False (bool), None (empty value). A string may use single or double quotes, but they must match on both ends, while numbers and True are written without quotes. The simplest output is passing a literal straight into print(): print(\"hello\") prints hello without the quotes, because quotes only exist in the source to mark where the string begins and ends.",
            tr: "Literal, doğrudan kod içine yazılan değerdir: 42 (tam sayı int), 3.14 (float), \"metin\" (dize str), True ve False (bool), None (boş değer). Dize tek ya da çift tırnakla yazılabilir ama iki taraftaki tırnaklar aynı olmalıdır; sayılar ve True tırnaksız yazılır. En yalın çıktı bir literalı doğrudan print() içine yazmaktır: print(\"hello\") tırnaksız olarak hello yazdırır, çünkü tırnaklar yalnızca kaynak kodda dizenin sınırını gösterir."
          },
          example: "print(\"hello\")\nprint(42)\nprint(3.14)\nprint(True)\nprint(None)\n",
          task: {
            text: {
              uk: "Виведи по одному на рядок чотири літерали: текст hello, ціле число 42, дійсне 3.14 і логічне True.",
              en: "Print four literals, one per line: the text hello, the integer 42, the float 3.14 and the boolean True.",
              tr: "Satır satır dört literal yazdır: hello metni, tam sayı 42, ondalık 3.14 ve mantıksal True."
            },
            hint: {
              uk: "Чотири окремі виклики: print(\"hello\") — текст обов'язково в лапках, а print(42), print(3.14) і print(True) — без лапок.",
              en: "Four separate calls: print(\"hello\") needs quotes around the text, while print(42), print(3.14) and print(True) need none.",
              tr: "Dört ayrı çağrı: print(\"hello\") içinde metni tırnağa al, print(42), print(3.14) ve print(True) ise tırnaksız."
            },
            starter: "",
            tests: [
              { in: "", out: "hello\n42\n3.14\nTrue" }
            ]
          }
        },
        {
          id: "vars",
          title: { uk: "Змінна та її тип", en: "Variable and its type", tr: "Değişken ve türü" },
          theory: {
            uk: "Змінна — це ім'я для значення: вік = 12. Праворуч від = стоїть число, рядок або результат обчислення. type(x) показує тип значення: int, float, str чи bool. Змінну можна переприсвоїти — тоді в неї буде нове значення, а зовсім нова змінна з'являється в момент першого присвоєння.",
            en: "A variable is a name for a value: age = 12. To the right of = there is a number, a string or a computed result. type(x) shows the type of the value: int, float, str or bool. You can reassign a variable to a new value, and a brand-new variable appears the moment you first assign it.",
            tr: "Değişken bir değerin adıdır: yas = 12. = işaretinin sağında bir sayı, dize ya da hesaplanmış sonuç bulunur. type(x) değerin türünü gösterir: int, float, str veya bool. Bir değişkene yeniden atama yapabilirsin; yeni bir değişken ise ilk atandığı anda oluşur."
          },
          example: "x = 7\nprint(x)\nprint(type(x))\nx = \"привіт\"\nprint(type(x))\n",
          task: {
            text: {
              uk: "Створи змінну num зі значенням 10 і виведи лише її тип — рівно один рядок.",
              en: "Create a variable num with the value 10 and print only its type — exactly one line.",
              tr: "Değeri 10 olan bir num değişkeni oluştur ve yalnızca türünü yazdır — tam olarak bir satır."
            },
            hint: {
              uk: "num = 10, а потім print(type(num)). Саме значення друкувати не треба.",
              en: "Write num = 10, then print(type(num)). Do not print the value itself.",
              tr: "num = 10 yaz, sonra print(type(num)) yaz. Değerin kendisini yazdırma."
            },
            starter: "",
            tests: [
              { in: "", out: "<class 'int'>" }
            ]
          }
        },
        {
          id: "math",
          title: { uk: "Дії з числами", en: "Working with numbers", tr: "Sayılarla işlemler" },
          theory: {
            uk: "Основні дії: + додавання, - віднімання, * множення, / ділення (воно завжди дає float), // ціле ділення, % остача від ділення, ** піднесення до степеня. Порядок такий: спочатку дужки, потім **, далі * / // %, наприкінці + -. Приклад: 17 // 2 = 8, бо 17 / 2 = 8.5, а 17 % 2 = 1.",
            en: "The main operators: + add, - subtract, * multiply, / divide (it always gives a float), // floor division, % remainder, ** power. The order is: brackets first, then **, then * / // %, and finally + -. For example 17 // 2 = 8 because 17 / 2 = 8.5, and 17 % 2 = 1.",
            tr: "Temel işlemler: + toplama, - çıkarma, * çarpma, / bölme (her zaman float verir), // tam bölme, % kalan, ** üs alma. Sıra şöyledir: önce parantez, sonra **, ardından * / // %, en son + -. Örnek: 17 / 2 = 8.5 olduğu için 17 // 2 = 8 ve 17 % 2 = 1."
          },
          example: "print(7 / 2)\nprint(7 // 2)\nprint(7 % 2)\nprint(2 ** 5)\n",
          task: {
            text: {
              uk: "У стартері дано a = 17 і b = 5. Виведи три рядки: ціле ділення a // b, остачу a % b та квадрат a ** 2.",
              en: "The starter gives a = 17 and b = 5. Print three lines: floor division a // b, remainder a % b and square a ** 2.",
              tr: "Başlangıçta a = 17 ve b = 5 verilidir. Üç satır yazdır: tam bölme a // b, kalan a % b ve kare a ** 2."
            },
            hint: {
              uk: "print(a // b), print(a % b), print(a ** 2) — три окремі рядки, значення брати зі стартера.",
              en: "print(a // b), print(a % b), print(a ** 2) — three separate lines using the values from the starter.",
              tr: "print(a // b), print(a % b), print(a ** 2) — başlangıçtaki değerlerle üç ayrı satır."
            },
            starter: "a = 17\nb = 5\n",
            tests: [
              { in: "", out: "3\n2\n289" }
            ]
          }
        },
        {
          id: "casting",
          title: { uk: "Перетворення типів", en: "Type conversion", tr: "Tür dönüştürme" },
          theory: {
            uk: "Тип можна змінити свідомо: int(\"10\") перетворює рядок на ціле число, str(10) — число на рядок, float(\"2.5\") — рядок на дійсне, а int(3.9) обрізає дробову частину (не округлює!). Рядок і число напряму не складаються: \"a\" + 1 — це TypeError, зате рядки склеюються: \"a\" + \"b\".",
            en: "You can change a type on purpose: int(\"10\") turns a string into an integer, str(10) turns a number into a string, float(\"2.5\") makes a float, and int(3.9) cuts off the fractional part (it does not round!). A string and a number do not add directly — \"a\" + 1 is a TypeError — but strings concatenate: \"a\" + \"b\".",
            tr: "Türü bilinçli olarak değiştirebilirsin: int(\"10\") dizeyi tam sayıya, str(10) sayıyı dizeye, float(\"2.5\") ondalık sayıya çevirir; int(3.9) ise kesirli kısmı atar (yuvarlamaz!). Dize ile sayı doğrudan toplanmaz: \"a\" + 1 bir TypeError'dır; ama dizeler birleşir: \"a\" + \"b\"."
          },
          example: "s = \"10\"\nprint(int(s) + 5)\nn = 7\nprint(str(n) + \"!\")\nprint(int(3.9))\n",
          task: {
            text: {
              uk: "Дано рядок s = \"12\". Виведи два рядки: суму як числа (12 + 12) і з'єднання як рядки (1212).",
              en: "Given the string s = \"12\". Print two lines: the sum as numbers (12 + 12) and the concatenation as strings (1212).",
              tr: "Verilen dize s = \"12\". İki satır yazdır: sayı olarak toplam (12 + 12) ve dize olarak birleştirme (1212)."
            },
            hint: {
              uk: "int(s) дає число, тому print(int(s) + int(s)) друкує 24; print(s + s) друкує 1212.",
              en: "int(s) gives a number, so print(int(s) + int(s)) shows 24, while print(s + s) shows 1212.",
              tr: "int(s) sayı verir; bu yüzden print(int(s) + int(s)) 24, print(s + s) ise 1212 yazdırır."
            },
            starter: "s = \"12\"\n",
            tests: [
              { in: "", out: "24\n1212" }
            ]
          }
        },
        {
          id: "input",
          title: { uk: "Ввід: функція input()", en: "Input: the input() function", tr: "Girdi: input() işlevi" },
          theory: {
            uk: "input() читає один рядок, який набрав користувач, і завжди повертає рядок — навіть коли введено числа. Тому для числа пишуть int(input()) або float(input()). У майданчику для цього є поле «Ввід для input()»: впиши туди значення, по одному на рядок.",
            en: "input() reads one line typed by the user and always returns a string — even if you type numbers. That is why a number is read as int(input()) or float(input()). The playground has an “Input for input()” field for this: put the values there, one per line.",
            tr: "input(), kullanıcının yazdığı bir satırı okur ve her zaman bir dize döndürür — sayı girsen bile. Bu yüzden sayı int(input()) ya da float(input()) olarak okunur. Oyun alanında bunun için “input() için girdi” alanı var: değerleri satır satır oraya gir."
          },
          example: "name = input()\nprint(\"Привіт,\", name)\n",
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
        },
        {
          id: "names",
          title: { uk: "Правила назв змінних", en: "Rules for variable names", tr: "Değişken adı kuralları" },
          theory: {
            uk: "Назва змінної складається з літер, цифр та _; перший символ — не цифра; пробіли й символи - , . заборонені; регістр важливий: age і Age — дві різні назви. Службові слова (for, if, class, None) як назви брати не можна, і вбудовані імена (print, len) краще не перекривати. Прийнятний стиль — нижній регістр із підкресленням і зрозуміла назва: total_price краще, ніж x2.",
            en: "A variable name uses letters, digits and _; the first character is not a digit; spaces and the characters - , . are not allowed; case matters — age and Age are two different names. Reserved words (for, if, class, None) cannot be used, and it is better not to shadow built-ins (print, len). The accepted style is lower_case with underscores and a meaningful name: total_price beats x2.",
            tr: "Değişken adı harf, rakam ve _ içerir; ilk karakter rakam olamaz; boşluk ile - , . karakterleri yasaktır; büyük-küçük harf önemlidir: age ile Age iki ayrı addır. Ayrılmış sözler (for, if, class, None) kullanılamaz; yerleşik adları (print, len) da gölgelememek iyi olur. Kabul gören biçim, alt çizgili küçük harf ve anlamlı isimdir: x2 yerine total_price."
          },
          example: "total_price = 12\ndiscount = 2\nprint(total_price - discount)\n",
          task: {
            text: {
              uk: "Три назви в коді порушують правила, тому програма не запускається. Перейменуй змінні так, щоб код запрацював і вивів 12.",
              en: "Three names in the code break the rules, so the program does not run. Rename the variables so the code works and prints 12.",
              tr: "Koddaki üç ad kuralları bozduğu için program çalışmıyor. Değişkenleri, kod çalışıp 12 yazdıracak şekilde yeniden adlandır."
            },
            hint: {
              uk: "Почни кожну назву з літери, дефіс заміни на _ , а назву for перейменуй (наприклад, cnt) — і оновіть усі імена всередині print.",
              en: "Start each name with a letter, replace the hyphen with _ , rename for (for example cnt) and update every name inside print.",
              tr: "Her adı bir harfle başlat, tireyi _ ile değiştir, for adını yeniden adlandır (örn. cnt) ve print içindeki tüm adları güncelle."
            },
            starter: "1score = 5\nmy-score = 2\nfor = 5\nprint(1score + my-score + for)\n",
            tests: [
              { in: "", out: "12" }
            ]
          }
        },
        {
          id: "comments",
          title: { uk: "Коментарі", en: "Comments", tr: "Yorumlar" },
          theory: {
            uk: "Усе, що стоїть після # до кінця рядка, Python не читає — це коментар. Він пояснює задум коду, а не повторює його: «# початкова температура» корисніше, ніж «# start = 20». Якщо треба вимкнути кілька рядків, # ставлять на початку кожного з них; такий закоментований print уже нічого не виводить.",
            en: "Everything after # up to the end of the line is a comment — Python never reads it. A comment explains the intent instead of repeating the code: “# starting temperature” is more useful than “# start = 20”. To disable several lines, put # at the start of each one; a commented-out print then outputs nothing.",
            tr: "# işaretinden satır sonuna kadar yazılan her şey yorumdur, Python onu okumaz. Yorum kodun tekrarını değil amacını açıklar: “# başlangıç sıcaklığı”, “# start = 20” satırından daha faydalıdır. Birkaç satırı devre dışı bırakmak için her satırın başına # koy; yorum yapılmış bir print hiçbir şey yazdırmaz."
          },
          example: "# Рахуємо, на скільки градусів похолодало\nstart = 20\nend = 15\nprint(end - start)\n",
          task: {
            text: {
              uk: "У програмі є зайвий рядок print(\"зайве\"). Зроби його коментарем — постав # на початку. Має вивестися 1, 2 і 3, по одному на рядок.",
              en: "The program has an extra line print(\"зайве\"). Turn it into a comment by putting # at the start. It must print 1, 2 and 3, one per line.",
              tr: "Programda gereksiz bir print(\"зайве\") satırı var. Satırın başına # koyarak onu yoruma çevir. 1, 2 ve 3 satır satır yazdırılmalı."
            },
            hint: {
              uk: "Напиши # перед print(\"зайве\") — весь рядок стане коментарем. Інші три рядки не чіпай.",
              en: "Write # before print(\"зайве\") — the whole line becomes a comment. Leave the other three lines alone.",
              tr: "print(\"зайве\") satırından önce # yaz — tüm satır yorum olur. Diğer üç satıra dokunma."
            },
            starter: "print(\"1\")\nprint(\"зайве\")\nprint(\"2\")\nprint(\"3\")\n",
            tests: [
              { in: "", out: "1\n2\n3" }
            ]
          }
        },
        {
          id: "indent",
          title: { uk: "Відступи — частина синтаксису", en: "Indentation is part of the syntax", tr: "Girinti sözdiziminin parçasıdır" },
          theory: {
            uk: "У Python відступ — не красота, а синтаксис. Блок починається з рядка з двокрапкою, а кожен рядок цього блоку зсувають вправо — типово на 4 пробіли. Таби з пробілами не змішують. Відступ також вирішує, які рядки належать циклу чи умові, а які виконуються вже після нього.",
            en: "In Python indentation is not decoration but syntax. A block starts with a line ending in a colon and every line of that block is shifted right — usually by 4 spaces. Never mix tabs with spaces. Indentation also decides which lines belong to the loop or condition and which run only after it.",
            tr: "Python'da girinti süs değil, sözdizimidir. Blok iki nokta ile biten bir satırla başlar ve o bloğun her satırı sağa — genellikle 4 boşluk — kaydırılır. Sekmeleri boşluklarla karıştırmayın. Girinti ayrıca hangi satırların döngüye/kosule, hangi satırların sonrasına ait olduğunu belirler."
          },
          example: "for i in range(3):\n    print(\"у циклі\", i)\nprint(\"після циклу\")\n",
          task: {
            text: {
              uk: "Програма має вивести 1, 2, 3 усередині циклу, а слово готово — лише один раз після циклу. Зсунь рядок циклу на 4 пробіли, а останній print лиши на початку.",
              en: "The program must print 1, 2, 3 inside the loop and the word готово only once after the loop. Shift the loop body by 4 spaces and keep the last print at the start of the line.",
              tr: "Program döngü içinde 1, 2, 3, hazır sözcüğünü ise döngüden sonra yalnızca bir kez yazdırmalı. Döngü gövdesini 4 boşluk kaydır, son print satırı başta kalsın."
            },
            hint: {
              uk: "Тіло циклу — це print(i): зсунь його на 4 пробіли. print(\"готово\") без відступу виконається один раз після циклу.",
              en: "The loop body is print(i) — shift it 4 spaces. print(\"готово\") with no indent runs once after the loop.",
              tr: "Döngü gövdesi print(i)'dir — onu 4 boşluk kaydır. Başında boşluğu olmayan print(\"готово\") döngüden sonra bir kez çalışır."
            },
            starter: "for i in range(1, 4):\nprint(i)\nprint(\"готово\")\n",
            tests: [
              { in: "", out: "1\n2\n3\nготово" }
            ]
          }
        },
        {
          id: "errors",
          title: { uk: "Читаємо повідомлення про помилку", en: "Reading an error message", tr: "Hata mesajını okumak" },
          theory: {
            uk: "Помилка — це підказка, а не вирок. Читати її починають знизу: останній рядок називає тип і причину, а слово з числом вказує рядок твого коду. Найчастіші: NameError — такої назви ще немає, SyntaxError — зламані дужки чи лапки, ZeroDivisionError — ділення на нуль, TypeError — несумісні типи. Помилки з ім'ям часто означають звичайну одруківку.",
            en: "An error is a hint, not a verdict. Start reading it at the bottom: the last line names the type and the reason, and the number points to the line of your code. The most common ones: NameError — a name does not exist yet, SyntaxError — broken brackets or quotes, ZeroDivisionError — division by zero, TypeError — incompatible types. Errors that mention a name are usually a plain typo.",
            tr: "Hata bir ipucudur, yargı değil. Okumaya alttan başla: son satır türü ve nedeni söyler, sayı ise kodunun ilgili satırını gösterir. En sık görülenler: NameError — böyle bir ad yok, SyntaxError — bozuk parantez ya da tırnak, ZeroDivisionError — sıfıra bölme, TypeError — uyumsuz türler. Ad içeren hatalar genellikle sıradan bir yazım yanlışıdır."
          },
          example: "x = 5\nprint(y)\n",
          task: {
            text: {
              uk: "Одне ім'я в коді написане з одруківкою, тому програма падає з NameError. Виправ його, не прибираючи змінну, — має вивестися 8.",
              en: "One name in the code has a typo, so the program crashes with NameError. Fix it without removing the variable — it must print 8.",
              tr: "Koddaki bir ad yazım yanlışı içeriyor, bu yüzden program NameError ile çöküyor. Değişkeni silmeden düzelt — 8 yazdırılmalı."
            },
            hint: {
              uk: "Подивись, яке ім'я називає NameError, і порівняй його з рядком, де змінна створюється: chislo та chyslo — дві різні назви.",
              en: "Look at which name NameError mentions and compare it with the line that creates the variable: chislo and chyslo are two different names.",
              tr: "NameError'ın belirttiği ada bak ve o değişkeni oluşturan satırla karşılaştır: chislo ile chyslo iki ayrı addır."
            },
            starter: "chislo = 4\nprint(chyslo * 2)\n",
            tests: [
              { in: "", out: "8" }
            ]
          }
        },
        {
          id: "chrord",
          title: { uk: "Коди символів: ord() та chr()", en: "Character codes: ord() and chr()", tr: "Karakter kodları: ord() ve chr()" },
          theory: {
            uk: "Кожен символ має номер у таблиці кодування: \"A\" — 65, \"a\" — 97, \"0\" — 48. ord(\"A\") повертає номер символа, а chr(65) — символ за номером. Це обернені дії: chr(ord(\"a\")) знову дає \"a\", а ord(chr(97)) знову дає 97. Коди українських літер більші за 127, тому текст завжди тримають у рядках, а не в числах.",
            en: "Every character has a number in the encoding table: \"A\" is 65, \"a\" is 97, \"0\" is 48. ord(\"A\") returns the number of a character and chr(65) returns the character for a number. They are inverse operations: chr(ord(\"a\")) gives \"a\" again, and ord(chr(97)) gives 97 again. Ukrainian letters have codes above 127, so text always stays in strings rather than numbers.",
            tr: "Her karakterin kodlama tablosunda bir numarası vardır: \"A\" 65, \"a\" 97, \"0\" 48. ord(\"A\") karakterin numarasını, chr(65) ise numaradan karakteri döndürür. Bunlar ters işlemlerdir: chr(ord(\"a\")) yine \"a\" verir, ord(chr(97)) yine 97 verir. Ukraynaca harflerin kodu 127'den büyüktür, bu yüzden metin sayılarda değil dizelerde tutulur."
          },
          example: "print(ord(\"A\"))\nprint(chr(97))\nprint(chr(ord(\"a\") + 1))\n",
          task: {
            text: {
              uk: "Виведи два рядки: символ, чий код дорівнює 97, і код символу B.",
              en: "Print two lines: the character whose code is 97, and the code of the character B.",
              tr: "İki satır yazdır: kodu 97 olan karakter ve B karakterinin kodu."
            },
            hint: {
              uk: "chr(97) дає символ a, а ord(\"B\") — число 66. Кожне виведи окремим print().",
              en: "chr(97) gives the character a, and ord(\"B\") gives the number 66. Print each with its own print().",
              tr: "chr(97) karakteri a'yı, ord(\"B\") ise 66 sayısını verir. Her birini ayrı bir print() ile yazdır."
            },
            starter: "",
            tests: [
              { in: "", out: "a\n66" }
            ]
          }
        },
        {
          id: "escapes",
          title: { uk: "Екранування символів", en: "Escaping characters", tr: "Karakter kaçışı" },
          theory: {
            uk: "Усередині рядка деякі символи записують через зворотний слеш: \\n — новий рядок, \\t — табуляція, \\\\ — один зворотний слеш, \\\" — лапка всередині рядка в подвійних лапках. Без екранування Python не розуміє, де рядок закінчується, або просто не бачить потрібного символу. Зворотний слеш перед звичайною літерою не «захистить» її, а зламає рядок.",
            en: "Inside a string some characters are written with a backslash: \\n is a new line, \\t is a tab, \\\\ is a single backslash and \\\" is a quote inside a double-quoted string. Without escaping, Python cannot tell where the string ends or simply misses the character you need. A backslash before a plain letter does not “protect” it — it breaks the string.",
            tr: "Dizenin içinde bazı karakterler ters bölü ile yazılır: \\n yeni satır, \\t sekme, \\\\ tek ters bölü, \\\" ise çift tırnaklı dizenin içindeki tırnaktır. Kaçış olmazsa Python dizenin nerede bittiğini anlayamaz ya da istediğin karakteri göremez. Sıradan bir harften önceki ters bölü onu “korumaz”, dizeyi bozar."
          },
          example: "print(\"перший\\nдругий\")\nprint(\"таб\\tуляція\")\nprint(\"Шлях: C:\\\\py\\\\file.py\")\nprint(\"Він сказав: \\\"Привіт\\\"\")\n",
          task: {
            text: {
              uk: "Виведи два рядки, екрануючи потрібні символи: перший — He said \"Hi!\", другий — C:\\py\\file.py",
              en: "Print two lines, escaping the characters you need: first He said \"Hi!\", second C:\\py\\file.py",
              tr: "Gerekli karakterleri kaçırarak iki satır yazdır: birincisi He said \"Hi!\", ikincisi C:\\py\\file.py"
            },
            hint: {
              uk: "Рядок у подвійних лапках: внутрішню лапку напиши як \\\", а кожен зворотний слеш — як \\\\.",
              en: "Put the text in double quotes: write each inner quote as \\\" and each backslash as \\\\.",
              tr: "Metni çift tırnak içine al: her iç tırnağı \\\", her ters bölüyü \\\\ olarak yaz."
            },
            starter: "",
            tests: [
              { in: "", out: "He said \"Hi!\"\nC:\\py\\file.py" }
            ]
          }
        },
        {
          id: "fstring",
          title: { uk: "Інтерполяція: f-рядки", en: "Interpolation: f-strings", tr: "Satıra gömme: f-dizeleri" },
          theory: {
            uk: "f-рядок починається з префікса f, а значення вставляють у фігурні дужки: f\"Привіт, {name}!\". У дужках можна писати цілий вираз: f\"{2 + 3}\" дає 5, а f\"{price * qty}\" — добуток. Це найзручніший спосіб зібрати речення зі слів і змінних — довгих ланцюжків із + зазвичай уже не потрібно.",
            en: "An f-string starts with the f prefix and puts values inside curly braces: f\"Привіт, {name}!\". A full expression works inside the braces: f\"{2 + 3}\" gives 5 and f\"{price * qty}\" gives the product. It is the easiest way to build a sentence out of words and variables, so long chains of + are usually no longer needed.",
            tr: "f-dizesi f ön ekiyle başlar ve değerler küme parantezine yazılır: f\"Merhaba, {name}!\". Parantezin içinde tam bir ifade de çalışabilir: f\"{2 + 3}\" 5 verir, f\"{price * qty}\" çarpımı verir. Sözcüklerle değişkenleri bir cümlede birleştirmenin en kolay yolu budur; uzun + zincirlerine artık gerek kalmaz."
          },
          example: "name = \"Оля\"\nage = 12\nprint(f\"{name}, мені {age} років\")\nprint(f\"через 5 років: {age + 5}\")\n",
          task: {
            text: {
              uk: "У стартері item = \"кава\", price = 4, qty = 3. Виведи одним рядком через f-рядок: кава: 12 — слово, двокрапка, пробіл і добуток ціни на кількість.",
              en: "The starter has item = \"кава\", price = 4, qty = 3. Print one line with an f-string: кава: 12 — the word, a colon, a space and the price times the quantity.",
              tr: "Başlangıçta item = \"кава\", price = 4, qty = 3 var. f-dizesiyle tek satır yazdır: кава: 12 — sözcük, iki nokta, boşluk ve fiyat ile miktarın çarpımı."
            },
            hint: {
              uk: "print(f\"{item}: {price * qty}\") — префікс f стоїть перед самою першою лапкою, а обидва значення — у фігурних дужках.",
              en: "print(f\"{item}: {price * qty}\") — the f prefix goes before the very first quote, and both values sit in curly braces.",
              tr: "print(f\"{item}: {price * qty}\") — f ön eki en ilk tırnaktan önce durur, iki değer de küme parantezine yazılır."
            },
            starter: "item = \"кава\"\nprice = 4\nqty = 3\n",
            tests: [
              { in: "", out: "кава: 12" }
            ]
          }
        },
        {
          id: "print_sep",
          title: { uk: "Параметри sep і end у print()", en: "The sep and end parameters of print()", tr: "print() içindeki sep ve end parametreleri" },
          theory: {
            uk: "print() приймає додаткові параметри. sep= задає, що ставити між кількома значеннями — типово це один пробіл: print(1, 2, sep=\"-\") дає 1-2, а sep=\"\" зліпить їх без роздільника. end= задає, що друкувати наприкінці — типово \\n, тож рядка кінця немає: print(\"a\", end=\"\") і print(\"b\") дадуть ab в одному рядку.",
            en: "print() accepts extra parameters. sep= sets what goes between several values — by default a single space: print(1, 2, sep=\"-\") gives 1-2 and sep=\"\" glues them with no separator. end= sets what is printed at the end — by default \\n, so end=\"\" leaves the line open: print(\"a\", end=\"\") followed by print(\"b\") gives ab on one line.",
            tr: "print() ek parametreler alır. sep=, birkaç değerin arasına ne konacağını belirler — varsayılan tek boşluktur: print(1, 2, sep=\"-\") 1-2 verir, sep=\"\" ise ayraçsız yapıştırır. end= satır sonunda ne yazılacağını belirler — varsayılan \\n'dir; bu yüzden print(\"a\", end=\"\") ve ardından print(\"b\") tek satırda ab verir."
          },
          example: "print(1, 2, 3, sep=\", \")\nprint(\"a\", end=\"\")\nprint(\"b\")\n",
          task: {
            text: {
              uk: "Виведи одним рядком 10+20=30: першим виклич print(10, 20, sep=\"+\", end=\"=\"), другим — print(30).",
              en: "Print 10+20=30 on a single line: first call print(10, 20, sep=\"+\", end=\"=\"), then call print(30).",
              tr: "10+20=30 değerini tek satırda yazdır: önce print(10, 20, sep=\"+\", end=\"=\") çağrısını, sonra print(30) çağrısını kullan."
            },
            hint: {
              uk: "sep=\"+\" ставить + між 10 і 20, а end=\"=\" прибирає перехід на новий рядок і друкує замість нього =.",
              en: "sep=\"+\" puts a + between 10 and 20, and end=\"=\" removes the line break and prints = instead of it.",
              tr: "sep=\"+\", 10 ile 20'nin arasına + koyar; end=\"=\" ise satır sonunu kaldırır ve yerine = yazdırır."
            },
            starter: "",
            tests: [
              { in: "", out: "10+20=30" }
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
  let gutter = null;

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
    if (gutter) gutter.refresh();

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
      const raw = (e && e.message) || String(e);
      verdict = { passed: false, results: [], error: raw, line: null, err: errBrief(raw), okCount: 0, ms: 0 };
    }

    renderResults(lesson.task, verdict);
    busy = false;
    checkBtn.disabled = false;

    if (verdict.passed) {
      registerComplete(lesson);
      setStatus(t("course.accepted"), "ok");
      sfx("success");
    } else if (verdict.error) {
      setStatus(global.UI.errStatus(t("course.runtimeError"), verdict.err && verdict.err.type), "error");
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
        if (r.error) {
          /* Курс мовчки обрізав трейсбек до 120 знаків — і «IndentationError:
             unexpected indent» відрізався разом з іменем. Тепер тип і причина окремо. */
          const kind = r.err || errBrief(r.error);
          body.appendChild(global.UI.errorBox({ type: kind.type, detail: kind.detail, line: r.line }, (n) => gotoCodeLine(n)));
          const plain = plainOut(r.got);
          if (plain) body.appendChild(el("div", "test-line got", t("course.got") + ": " + clip(plain)));
        } else {
          body.appendChild(el("div", "test-line got", t("course.got") + ": " + clip(r.got)));
        }
      }
      row.appendChild(body);
      resultsEl.appendChild(row);
    });
  }

  function clip(text) {
    const s = global.Tasks && global.Tasks.normalize ? global.Tasks.normalize(text) : String(text == null ? "" : text);
    return s.length > 120 ? s.slice(0, 120) + "…" : s;
  }

  function errBrief(raw) {
    if (global.PythonPad && global.PythonPad.errorBrief) return global.PythonPad.errorBrief(raw);
    return { type: null, detail: "" };
  }

  function plainOut(text) {
    return String(text == null ? "" : text)
      .split("\n")
      .filter((l) => !/^\s*(Traceback |File ["']|[\s^]+$|.*\b\w*(Error|Exception)\s*:)/.test(l))
      .join("\n")
      .trim();
  }

  function gotoCodeLine(n) {
    if (global.UI && global.UI.focusLine) global.UI.focusLine(codeEl, n);
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
    gutter = global.UI && global.UI.lineGutter ? global.UI.lineGutter(codeEl) : null;
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
      if (gutter) gutter.refresh();
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
