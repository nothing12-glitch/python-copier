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
          id: "input",
          title: { uk: "Ввід: функція input()", en: "Input: the input() function", tr: "Girdi: input() işlevi" },
          theory: {
            uk: "input() зупиняє програму й чекає, поки ти щось надрукуєш і натиснеш Enter. Все, що ти ввів, Python зберігає як текст — рядок. Навіть якщо набрати 25, програма отримає не число, а два символи: \"2\" і \"5\" — рівно як у print(\"25\"). Через такий текст одразу не множиться й не складається: спочатку його треба перетворити на число — int(input()) дає ціле, float(input()) — дійсне (як саме це працює, буде в наступному уроці). У майданчику для введення є поле «Ввід для input()»: впиши туди значення, по одному на рядок.",
            en: "input() stops the program and waits until you type something and press Enter. Whatever you type, Python keeps it as text — a string. Even if you type 25, the program does not get the number 25 but two characters, \"2\" and \"5\" — exactly like in print(\"25\"). That is why this text cannot be multiplied or added right away: first it has to become a number — int(input()) for a whole number, float(input()) for a decimal (the next lesson shows how). The playground has an “Input for input()” field for this: put the values there, one per line.",
            tr: "input() programı durdurur ve bir şey yazıp Enter'a basmanı bekler. Ne yazarsan yaz, Python onu metin — bir dize — olarak saklar. 25 yazsan bile program sayı 25'i değil, tıpkı print(\"25\") içindeki gibi \"2\" ve \"5\" karakterlerini alır. Bu yüzden o metin hemen çarpılıp toplanamaz: önce sayıya dönüşmesi gerekir — tam sayı için int(input()), ondalık için float(input()) (nasıl olduğu bir sonraki derste). Oyun alanında bunun için “input() için girdi” alanı var: değerleri satır satır oraya gir."
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
          id: "casting",
          title: { uk: "Перетворення типів", en: "Type conversion", tr: "Tür dönüştürme" },
          theory: {
            uk: "Тип можна змінити свідомо: int(\"10\") перетворює рядок на ціле число, str(10) — число на рядок, float(\"2.5\") — рядок на дійсне, а int(3.9) обрізає дробову частину (не округлює!). Саме int() рятує після input(): int(input()) бере те, що ти набрав, і робить з цього справжнє число. Рядок і число напряму не складаються: \"a\" + 1 — це TypeError, зате рядки склеюються: \"a\" + \"b\".",
            en: "You can change a type on purpose: int(\"10\") turns a string into an integer, str(10) turns a number into a string, float(\"2.5\") makes a float, and int(3.9) cuts off the fractional part (it does not round!). This is exactly what saves you after input(): int(input()) takes what you typed and makes a real number out of it. A string and a number do not add directly — \"a\" + 1 is a TypeError — but strings concatenate: \"a\" + \"b\".",
            tr: "Türü bilinçli olarak değiştirebilirsin: int(\"10\") dizeyi tam sayıya, str(10) sayıyı dizeye, float(\"2.5\") ondalık sayıya çevirir; int(3.9) ise kesirli kısmı atar (yuvarlamaz!). input() sonrası seni tam da bu kurtarır: int(input()) yazdığını alıp gerçek bir sayıya çevirir. Dize ile sayı doğrudan toplanmaz: \"a\" + 1 bir TypeError'dır; ama dizeler birleşir: \"a\" + \"b\"."
          },
          example: "s = \"10\"\nprint(int(s) + 5)\nn = 7\nprint(str(n) + \"!\")\nprint(int(3.9))\n",
          task: {
            text: {
              uk: "Програма зчитує значення з клавіатури — це текст. Виведи два рядки: спочатку суму двох таких чисел, а потім з'єднання двох таких рядків.",
              en: "The program reads a value from the keyboard — it is text. Print two lines: first the sum of two such numbers, then the concatenation of two such strings.",
              tr: "Program klavyeden bir değer okuyor — bu bir metindir. İki satır yazdır: önce iki böyle sayının toplamını, sonra iki böyle dizenin birleşimini."
            },
            hint: {
              uk: "Зчитане — текст, тому число беруть як int(s): print(int(s) + int(s)) дає суму, а print(s + s) — склеєні рядки.",
              en: "What you read is text, so take the number as int(s): print(int(s) + int(s)) gives the sum, print(s + s) gives the joined strings.",
              tr: "Okuduğun metindir, bu yüzden sayı int(s) ile alınır: print(int(s) + int(s)) toplamı, print(s + s) birleşmiş dizeleri verir."
            },
            starter: "s = input()\n",
            tests: [
              { in: "12\n", out: "24\n1212" },
              { in: "7\n", out: "14\n77" },
              { in: "30\n", out: "60\n3030" }
            ]
          }
        },
        {
          id: "strings",
          title: { uk: "Рядки: тип str і склеювання", en: "Strings: the str type and joining", tr: "Dizeler: str türü ve birleştirme" },
          theory: {
            uk: "Текст у Python має тип str — такий текст називають рядком і пишуть у лапках: a = \"red\". Два рядки можна склеїти знаком +, і вийде один новий рядок: \"red\" + \"blue\" дає redblue. Склеювання нічого не додає від себе, тож дефіс, пробіл чи крапка теж мають бути окремим рядком: \"red\" + \"-\" + \"blue\" дає red-blue. Перевірити, що перед тобою саме текст, допомагає type(a) — він повертає <class 'str'>.",
            en: "Text in Python has the type str — such text is called a string and is written in quotes: a = \"red\". Two strings can be glued together with + and you get one new string: \"red\" + \"blue\" gives redblue. Joining adds nothing on its own, so a hyphen, a space or a dot must also be a string of its own: \"red\" + \"-\" + \"blue\" gives red-blue. type(a) helps you check that you really have text — it returns <class 'str'>.",
            tr: "Python'da metin str türündedir; bu metne dize denir ve tırnak içinde yazılır: a = \"red\". İki dize + ile birleştirilebilir ve tek yeni bir dize çıkar: \"red\" + \"blue\" → redblue. Birleştirme kendiliğinden hiçbir şey eklemez, bu yüzden tire, boşluk ya da nokta da ayrı bir dize olmalıdır: \"red\" + \"-\" + \"blue\" → red-blue. Elindeki şeyin gerçekten metin olup olmadığını type(a) gösterir — <class 'str'> döndürür."
          },
          example: "a = \"red\"\nb = \"blue\"\nprint(a + b)\nprint(a + \"-\" + b)\nprint(type(a))\n",
          task: {
            text: {
              uk: "Дано два слова, кожне в окремому рядку — обидва рядки вже написані в стартері. Виведи їх з'єднаними через дефіс (наприклад, red-blue).",
              en: "Two words are given, one per line — both lines are already written in the starter. Print them joined with a hyphen (for example, red-blue).",
              tr: "Her biri ayrı satırda iki sözcük veriliyor — bu iki satır başlangıçta zaten yazılı. Tire ile birleştirip tek satır yazdır (örneğin red-blue)."
            },
            hint: {
              uk: "Склей три рядки в одному print: a + \"-\" + b.",
              en: "Join three strings inside one print: a + \"-\" + b.",
              tr: "Tek bir print içinde üç dizeyi birleştir: a + \"-\" + b."
            },
            starter: "a = input()\nb = input()\n",
            tests: [
              { in: "red\nblue\n", out: "red-blue" },
              { in: "a\nb\n", out: "a-b" },
              { in: "hello\nworld\n", out: "hello-world" }
            ]
          }
        },
        {
          id: "str_len",
          title: { uk: "Довжина рядка: len()", en: "String length: len()", tr: "Dize uzunluğu: len()" },
          theory: {
            uk: "len(рядок) показує, скільки символів у рядку — це і є його довжина. Рахується все: літери, цифри, знаки та пробіли, бо пробіл — теж символ. Лапки в рахунок не потрапляють: вони існують лише в коді, щоб показати, де рядок починається й закінчується. Тому len(\"abr\") = 3, len(\"ab cd\") = 5, а len(\"\") = 0 — порожній рядок має довжину нуль. Результат len() — звичайне число (int), тому з ним можна рахувати: len(a) + len(b).",
            en: "len(string) tells you how many characters the string holds — that is its length. Everything counts: letters, digits, signs and spaces, because a space is a character too. The quotes are not counted: they only exist in the code to show where the string starts and ends. So len(\"abr\") = 3, len(\"ab cd\") = 5 and len(\"\") = 0 — an empty string has length zero. The result of len() is an ordinary number (int), so you can compute with it: len(a) + len(b).",
            tr: "len(dize) o dizede kaç karakter olduğunu söyler — işte uzunluk budur. Her şey sayılır: harfler, rakamlar, işaretler ve boşluklar; çünkü boşluk da bir karakterdir. Tırnaklar sayılmaz: onlar yalnızca dizenin nerede başlayıp bittiğini göstermek için kodda durur. Bu yüzden len(\"abr\") = 3, len(\"ab cd\") = 5 ve len(\"\") = 0 — boş dizenin uzunluğu sıfırdır. len() sonucu sıradan bir sayıdır (int), yani onunla işlem yapabilirsin: len(a) + len(b)."
          },
          example: "word = \"abrakadabra\"\nprint(len(word))\nprint(len(\"abr\"))\nprint(len(\"ab cd\"))\nprint(len(\"\"))\n",
          task: {
            text: {
              uk: "Дано слово — рядки стартера вже зчитують його через input(). Виведи його довжину: скільки символів у слові.",
              en: "A word is given — the starter lines already read it with input(). Print its length: how many characters the word has.",
              tr: "Bir sözcük veriliyor — başlangıç satırları onu zaten input() ile okuyor. Uzunluğunu yazdır: sözcükte kaç karakter var."
            },
            hint: {
              uk: "Довжина — це len(word): print(len(word)).",
              en: "The length is len(word): print(len(word)).",
              tr: "Uzunluk len(word) ile bulunur: print(len(word))."
            },
            starter: "word = input()\n",
            tests: [
              { in: "python\n", out: "6" },
              { in: "2+2\n", out: "3" },
              { in: "hi there\n", out: "8" }
            ]
          }
        },
        {
          id: "str_mul",
          title: { uk: "Множення рядка на число", en: "Multiplying a string by a number", tr: "Dizeyi sayıyla çarpma" },
          theory: {
            uk: "Рядок можна помножити на ціле число — Python просто повторить його стільки разів, скільки вказано: \"ab\" * 3 дає ababab. Множення не змінює сам текст, воно лише дописує копії підряд — без пробілів і розділових знаків між ними. Порядок не важливий: 3 * \"ab\" — той самий результат. Якщо помножити на 0, вийде порожній рядок. Не плутай це з математикою: \"5\" * 2 — це \"55\", а не 10, бо тут 5 — текст.",
            en: "A string can be multiplied by a whole number — Python simply repeats it as many times as you say: \"ab\" * 3 gives ababab. Multiplying does not change the text itself, it only appends copies one after another, with no spaces or punctuation between them. The order does not matter: 3 * \"ab\" gives the same result. Multiply by 0 and you get an empty string. Do not confuse this with arithmetic: \"5\" * 2 is \"55\", not 10, because the 5 here is text.",
            tr: "Bir dizeyi tam sayıyla çarpabilirsin — Python onu söylediğin sayıda yineler: \"ab\" * 3 → ababab. Çarpma metnin kendisini değiştirmez, yalnızca kopyalarını aralarına boşluk veya nokta koymadan alt alta ekler. Sıra önemli değil: 3 * \"ab\" aynı sonucu verir. 0 ile çarparsan boş dize çıkar. Bunu aritmetikle karıştırma: \"5\" * 2 bu \"55\"tir, 10 değil; çünkü buradaki 5 bir metindir."
          },
          example: "print(\"ab\" * 3)\nprint(\"Ha\" * 2 + \"!\")\nprint(4 * \">> \")\nprint(\"5\" * 2)\n",
          task: {
            text: {
              uk: "Дано слово — стартер уже зчитує його через input(). Виведи це слово тричі поспіль в одному рядку, без пробілів.",
              en: "A word is given — the starter already reads it with input(). Print the word three times in a row on one line, without spaces.",
              tr: "Bir sözcük veriliyor — başlangıç onu zaten input() ile okuyor. Sözcüğü tek satırda arka arkaya üç kez, boşluksuz yazdır."
            },
            hint: {
              uk: "Достатньо одного print: word * 3.",
              en: "One print is enough: word * 3.",
              tr: "Tek bir print yeter: word * 3."
            },
            starter: "word = input()\n",
            tests: [
              { in: "ab\n", out: "ababab" },
              { in: "Hi\n", out: "HiHiHi" },
              { in: "-\n", out: "---" }
            ]
          }
        },
        {
          id: "str_case",
          title: { uk: "Регістр літер: upper() і lower()", en: "Letter case: upper() and lower()", tr: "Harf durumu: upper() ve lower()" },
          theory: {
            uk: "У текста є вбудовані дії — методи: вони прив'язані до конкретного рядка, пишуться через крапку після нього, і круглі дужки наприкінці обов'язкові, навіть коли порожні. w.upper() дає весь текст великими літерами, w.lower() — малими, а цифрам, пробілам і знакам байдуже: вони лишаються як були. Метод не переписує рядок усередині себе — w.upper() лише повертає новий рядок, а сам w лишається попередній, тому результат використовують одразу або зберігають (w = w.upper()). Пастка — написати w.upper без дужок: тоді виведеться сам метод, а не великий текст. Є ще w.title() — великою стає перша літера кожного слова. Найчастіше lower() ставлять, щоб порівняти текст без уваги на регістр: «Привіт» і «привіт» для Python — різні рядки, а після lower() вони стають однакові.",
            en: "Text comes with built-in actions — methods: they belong to one specific string, are written after a dot, and the round brackets at the end are required even when empty. w.upper() returns the whole text in capital letters and w.lower() in small ones; digits, spaces and signs do not care — they stay as they were. A method does not rewrite the string in place: w.upper() only hands back a new string while w itself stays unchanged, so you use the result right away or save it (w = w.upper()). A common trap is writing w.upper without brackets — that prints the method itself, not the capitalised text. There is also w.title(), which capitalises the first letter of every word. lower() is mostly used to compare text regardless of case: for Python \"Привіт\" and \"привіт\" are different strings, but after lower() they become the same.",
            tr: "Metnin kendi içinde gelen eylemleri — metotları — vardır: bunlar belirli bir dizeye bağlıdır, noktadan sonra yazılır ve sonda parantezler boş olsa bile şarttır. w.upper() tüm metni büyük harfle, w.lower() küçük harfle döndürür; rakamlar, boşluklar ve işaretler etkilenmez, öylece kalır. Metot dizeyi yerinde değiştirmez — w.upper() yeni bir dize verir, w ise eski hâlinde kalır; bu yüzden sonucu ya hemen kullanırsın ya da saklarsın (w = w.upper()). Tuzak: parantezi unutup w.upper diye yazmak — o zaman büyük metin değil, metodun kendisi yazdırılır. Bir de w.title() var: her kelimenin ilk harfini büyütür. lower() çoğu kez yazıyı büyük-küçük harfe bakmadan karşılaştırmak için kullanılır: Python için \"Привіт\" ile \"привіт\" ayrı dizelerdir, ama lower()'den sonra aynı olurlar."
          },
          example: "w = \"привіт, WORLD 123\"\nprint(w.upper())\nprint(w.lower())\nprint(w)\nprint(w.title())\n",
          task: {
            text: {
              uk: "Дано слово — стартер уже зчитує його через input() у змінну word. Виведи два рядки: першим — слово ВЕЛИКИМИ літерами, другим — те саме слово малими.",
              en: "A word is given — the starter already reads it with input() into the variable word. Print two lines: first the word in CAPITAL letters, then the same word in small letters.",
              tr: "Bir sözcük veriliyor — başlangıç onu zaten input() ile word değişkenine okuyor. İki satır yazdır: önce sözcüğü BÜYÜK harflerle, sonra aynı sözcüğü küçük harflerle."
            },
            hint: {
              uk: "Друкуй не сам word, а word.upper() і word.lower(): спершу print(word.upper()), потім print(word.lower()).",
              en: "Print word.upper() and word.lower() rather than word itself: first print(word.upper()), then print(word.lower()).",
              tr: "word'ün kendisini değil word.upper() ve word.lower() yazdır: önce print(word.upper()), ardından print(word.lower())."
            },
            starter: "word = input()\n",
            tests: [
              { in: "Привіт\n", out: "ПРИВІТ\nпривіт" },
              { in: "MixEd 42\n", out: "MIXED 42\nmixed 42" },
              { in: "абВГ\n", out: "АБВГ\nабвг" }
            ]
          }
        },
        {
          id: "str_strip",
          title: { uk: "Пробіли по краях: strip()", en: "Spaces at the edges: strip()", tr: "Kenarlardaki boşluklar: strip()" },
          theory: {
            uk: "Текст, який вводить людина, майже завжди має зайве по краях: «   оля   » на екрані виглядає як «оля», але для Python це інший, довший рядок. w.strip() повертає той самий текст, почистивши його на початку та наприкінці від пробілів, табуляцій і розривів рядка; усередині нічого не зникає — «a b» так і лишається «a b». Якщо треба прибрати лише з одного боку, є w.lstrip() — зліва, і w.rstrip() — справа. Як і решта методів, strip() не чіпає сам w, тому чистий рядок беруть одразу в print() або зберігають у змінну. А найшвидше побачити, скільки сміття зникло, порівнявши довжини: len(w) і len(w.strip()) — різні числа.",
            en: "Text typed by a person almost always carries something at its edges: \"   оля   \" looks like «оля» on screen, but for Python it is a different, longer string. w.strip() returns the same text with spaces, tabs and line breaks cleaned off the beginning and the end; nothing inside disappears — \"a b\" stays \"a b\". When only one side is needed there is w.lstrip() (left) and w.rstrip() (right). Like the other methods, strip() leaves w itself untouched, so you take the clean string right in print() or save it in a variable. And the quickest way to see how much junk went away is to compare the lengths: len(w) and len(w.strip()) are different numbers.",
            tr: "İnsanın yazdığı metnin kenarlarında neredeyse hep fazlalık vardır: \"   оля   \" ekranda «оля» gibi görünür ama Python için bu ayrı ve daha uzun bir dizedir. w.strip() aynı metni döndürür, yalnızca başındaki ve sonundaki boşlukları, sekmeleri ve satır sonlarını temizler; içeride hiçbir şey yok olmaz — \"a b\" yine \"a b\" olarak kalır. Sadece bir taraf gerekirse w.lstrip() (sol) ve w.rstrip() (sağ) var. Diğer metotlar gibi strip() de w'ye dokunmaz; bu yüzden temiz diziyi ya doğrudan print() içinde kullanırsın ya da değişkene saklarsın. Ne kadar fazlalık gittiğini görmenin en hızlı yolu uzunlukları karşılaştırmak: len(w) ile len(w.strip()) farklı sayılardır."
          },
          example: "w = \"   оля   \"\nprint(len(w))\nprint(len(w.strip()))\nprint(w.strip())\nprint(\"a b\".strip())\n",
          task: {
            text: {
              uk: "Стартер уже зчитує рядок у word — по його краях можуть стояти зайві пробіли. Виведи одним рядком це слово у квадратних дужках, але без пробілів по краях, щоб дужки показали межі слова: для «   оля   » має вивестися [оля].",
              en: "The starter already reads a line into word — there may be extra spaces at its edges. Print one line: the word wrapped in square brackets but with the edge spaces removed, so the brackets show where the word starts and ends; for \"   оля   \" it must print [оля].",
              tr: "Başlangıç satırı zaten word değişkenine okuyor — kenarlarında fazladan boşluklar olabilir. Tek satır yazdır: sözcüğü köşeli parantez içinde ama kenar boşlukları atılmış halde göster, böylece parantezler sınırın nerede olduğunu göstersin; \"   оля   \" için [оля] çıkmalı."
            },
            hint: {
              uk: "Спершу прибери краї методом, а потім склей три рядки: print(\"[\" + word.strip() + \"]\") — якщо друкувати сам word у дужках, пробіли залишаться всередині.",
              en: "First clean the edges with the method, then join three strings: print(\"[\" + word.strip() + \"]\") — printing word itself inside the brackets would keep the spaces.",
              tr: "Önce metotla kenarları temizle, sonra üç dizeyi birleştir: print(\"[\" + word.strip() + \"]\") — word'ün kendisini paranteze alırsan boşluklar içeride kalır."
            },
            starter: "word = input()\n",
            tests: [
              { in: "   оля   \n", out: "[оля]" },
              { in: "  a b  \n", out: "[a b]" },
              { in: "    12 34 \n", out: "[12 34]" }
            ]
          }
        },
        {
          id: "str_chain",
          title: { uk: "Методи ланцюжком: strip() і lower() разом", en: "Chaining methods: strip() and lower() together", tr: "Metotları zincirleme: strip() ve lower() birlikte" },
          theory: {
            uk: "Очищення вводу зазвичай роблять одним рядком: name = input().strip().lower(). Це ланцюжок методів, і Python читає його зліва праворуч: щойно зчитаний рядок спершу чистять по краях, а те, що лишилося, переводять у нижній регістр — кожен метод бере результат попереднього. У такій парі порядок не важливий: lower() ні не створює пробілів, ні не знищує їх, тому .strip().lower() і .lower().strip() дадуть те саме. Інша справа, коли метод сам додає чи забирає пробіли — тоді варто подумати, що іде першим. Такий рядок віддає значення, готове до дальшої роботи: його зручніше порівнювати, шукати в ньому та рахувати його довжину, і len(name) уже показує чистий результат без пробілів по краях.",
            en: "Cleaning typed input is usually done on a single line: name = input().strip().lower(). That is a method chain, and Python reads it left to right — the freshly read string is first trimmed at its edges, then what remains is switched to lowercase, so each method works on the result of the previous one. In this pair the order does not matter: lower() neither creates nor destroys spaces, so .strip().lower() and .lower().strip() give the same thing. It is a different story when a method adds or removes spaces itself — then you should think about which one comes first. Such a line hands you a value ready for further work: it is easier to compare, to search inside and to measure, and len(name) already reports the clean text without the edge spaces.",
            tr: "Girdiyi temizlemek genellikle tek satırda yapılır: name = input().strip().lower(). Bu bir metot zinciridir ve Python onu soldan sağa okur — önce yeni okunan dizenin kenarları temizlenir, sonra kalanı küçük harfe çevrilir; yani her metot bir öncekinin sonucuyla çalışır. Bu ikilide sıra önemli değil: lower() boşluk ne üretir ne yok eder, bu yüzden .strip().lower() ile .lower().strip() aynı şeyi verir. Bir metot kendi boşluk ekleyip çıkarıyorsa durum farklı — o zaman hangisinin önce geldiği üzerine düşünmek gerekir. Böyle bir satır sonrası için hazır değer teslim eder: onu karşılaştırmak, içinde arama yapmak ve uzunluğunu ölçmek daha kolaydır, len(name) de artık kenar boşluksuz temiz metni gösterir."
          },
          example: "w = \"   Python  \"\nclean = w.strip().lower()\nprint(\"[\" + clean + \"]\")\nprint(len(clean))\nprint(w.strip().upper())\n",
          task: {
            text: {
              uk: "Стартер зчитує рядок у word: по краях можливі зайві пробіли, а літери — будь-які. Виведи два рядки: першим — очищене слово у квадратних дужках (без пробілів по краях і все малими літерами), другим — його довжину. Для «   Python  » має вивестися [python] і 6.",
              en: "The starter reads a line into word: there may be extra spaces at the edges and the letters may be of any case. Print two lines: first the cleaned word in square brackets (no edge spaces, all lowercase), then its length. For \"   Python  \" it must print [python] and 6.",
              tr: "Başlangıç satırı word değişkenine okuyor: kenarlarda fazladan boşluk olabilir ve harfler herhangi bir durumda olabilir. İki satır yazdır: önce temizlenmiş sözcüğü köşeli parantez içinde (kenar boşlukları yok, hepsi küçük harf), sonra onun uzunluğunu. \"   Python  \" için [python] ve 6 çıkmalı."
            },
            hint: {
              uk: "Збери обидві дії в одну змінну: clean = word.strip().lower(), а тоді print(\"[\" + clean + \"]\") і print(len(clean)).",
              en: "Combine both actions into one variable: clean = word.strip().lower(), then print(\"[\" + clean + \"]\") and print(len(clean)).",
              tr: "İki işlemi tek değişkende topla: clean = word.strip().lower(), ardından print(\"[\" + clean + \"]\") ve print(len(clean))."
            },
            starter: "word = input()\n",
            tests: [
              { in: "   Привіт \n", out: "[привіт]\n6" },
              { in: "  MIX 42  \n", out: "[mix 42]\n6" },
              { in: "абВГ\n", out: "[абвг]\n4" }
            ]
          }
        },
        {
          id: "names",
          title: { uk: "Правила назв змінних", en: "Rules for variable names", tr: "Değişken adı kuralları" },
          theory: {
            uk: "Назва змінної складається з літер, цифр та знака _; перший символ — не цифра; пробіли й символи - , . заборонені. Службові слова — for, if, class, None — Python бере собі для синтаксису, тому як назви вони не підходять; цей список невичерпний, і з рештою службових слів ти познайомишся ближче з новими уроками. Прийнятний стиль — нижній регістр із підкресленням і зрозуміла назва: total_price краще, ніж x2. Як великі й малі літери міняють назву — в наступному уроці.",
            en: "A variable name uses letters, digits and the _ sign; the first character is not a digit; spaces and the characters - , . are not allowed. Reserved words — for, if, class, None — belong to Python's syntax, so they cannot be used as names; the list is not exhaustive, and you will meet the rest of these words in later lessons. The accepted style is lower_case with underscores and a meaningful name: total_price beats x2. How capital and small letters change a name comes in the next lesson.",
            tr: "Değişken adı harfler, rakamlar ve _ işaretinden oluşur; ilk karakter rakam olamaz; boşluk ile - , . karakterleri yasaktır. Ayrılmış sözler — for, if, class, None — Python'ın sözdizimine aittir, bu yüzden ad olarak kullanılamazlar; bu liste tükenmez, diğerleriyle sonraki derslerde tanışacaksın. Kabul gören biçim, alt çizgili küçük harf ve anlamlı isimdir: x2 yerine total_price. Büyük-küçük harfin adı nasıl değiştirdiği bir sonraki derste."
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
          id: "case_sens",
          title: { uk: "Регістр літер у назвах", en: "Letter case in names", tr: "Adlarda büyük-küçük harf" },
          theory: {
            uk: "Python вважає велику й малу літери різними символами, тому age, Age і AGE — це три різні змінні, а не одна й та сама. Написав назву в одному рядку з великої літери, а в іншому з малої — програма зупиниться з NameError, бо саме такої назви вона не знає. Тому назву пишуть в одному регісті всюди й не переписують її на око, а копіюють. Окремий підступ: латинська a і кирилична а — теж різні назви, хоча на вигляд однакові, тож клавіатура в межах одного рядка має бути в одній розкладці.",
            en: "Python treats a capital and a small letter as different characters, so age, Age and AGE are three different variables, not one and the same. Write a name with a capital in one line and with a small letter in another, and the program stops with NameError because it does not know that name. So a name keeps the same case everywhere, and it is better to copy it than to retype it by eye. One more trap: the Latin a and the Cyrillic a are different names too, although they look identical, so the keyboard layout must stay the same inside one line.",
            tr: "Python büyük ve küçük harfi farklı karakterler sayar; bu yüzden age, Age ve AGE tek değişken değil, üç ayrı değişkendir. Adı bir satırda büyük harfle, başka satırda küçük harfle yazarsan program NameError ile durur, çünkü o adı tanımaz. Bu yüzden ad her satırda aynı büyülükle kalır ve onu ezberden yazmak yerine kopyalamak iyidir. Bir tuzak daha: Latin a ile Kiril a da ayrı adlardır, görünüşleri aynı olsa bile; yani tek satırda aynı klavye düzeni kalmalıdır."
          },
          example: "score = 5\nScore = 50\nprint(score)\nprint(Score)\n",
          task: {
            text: {
              uk: "Змінні в коді оголошені з малої літери, а в останньому рядку ті самі назви написані з великої — програма їх не знаходить. Виправ регістр так, щоб вивелася сума a і B.",
              en: "The variables are declared with a small letter, but in the last line the same names appear with a capital — the program cannot find them. Fix the case so that the sum of a and B is printed.",
              tr: "Değişkenler küçük harfle tanımlandı, ama son satırda aynı adlar büyük harfle yazılı — program onları bulamıyor. Harf büyüklüğünü öyle düzelt ki a ile B toplamı yazdırılsın."
            },
            hint: {
              uk: "Порівняй назви рядок за рядком: оголошені a і B, тож і в print мають бути саме a та B — з малої літери, як на початку.",
              en: "Compare the names line by line: a and B are declared, so print must use exactly a and B — starting with a small letter, as at the top.",
              tr: "Adları satır satır karşılaştır: a ve B tanımlı, o hâlde print'te de tam olarak a ve B olmalı — baştan aşağı küçük harfle."
            },
            starter: "a = int(input())\nB = a * 3\nprint(A + b)\n",
            tests: [
              { in: "2\n", out: "8" },
              { in: "0\n", out: "0" },
              { in: "5\n", out: "20" }
            ]
          }
        },
        {
          id: "shadowing",
          title: { uk: "Перекриті назви: print, len, int", en: "Shadowed names: print, len, int", tr: "Gölgede kalan adlar: print, len, int" },
          theory: {
            uk: "Кілька назв у Python уже зайняті: print, len, int, str — це вбудовані функції, які доступні без жодного імпорту. Щойно ти пишеш len = 5, своя назва перекриває вбудовану: від того рядка й до кінця програми len — це просто число 5, а не функція, тому len(word) уже не вийде викликати, і Python каже TypeError: 'int' object is not callable. Те саме стається з print = ... та int = ...: рядки, які мали друкувати, ламаються. Повернути вбудоване можна через del len, але ліпше не позичати зайняті імена — бери вільні: size, count, total.",
            en: "A few names in Python are already taken: print, len, int, str are built-in functions you can call without importing anything. As soon as you write len = 5, your name shadows the built-in one: from that line to the end of the program len is just the number 5, not a function, so len(word) can no longer be called and Python says TypeError: 'int' object is not callable. The same happens with print = ... and int = ...: the lines that were supposed to print break. You can give the built-in back with del len, but it is better not to borrow taken names — use free ones like size, count, total.",
            tr: "Bazı adlar Python'da zaten dolu: print, len, int, str — import etmeden çağırabildiğin yerleşik işlevlerdir. len = 5 yazdığın anda kendi adın yerleşik adı gölgeler: o satırdan programın sonuna kadar len bir fonksiyon değil, yalnızca 5 sayısıdır; bu yüzden len(word) çağrılamaz ve Python TypeError: 'int' object is not callable der. Aynı şey print = ... ve int = ... için de geçerlidir: yazdırması gereken satırlar bozulur. del len ile yerleşik adı geri verebilirsin, ama dolu adları ödünç almamak daha iyi — boş adlar kullan: size, count, total."
          },
          example: "word = \"abr\"\nprint(len(word))\nlen = 5\nprint(len)\ndel len\nprint(len(word))\n",
          task: {
            text: {
              uk: "У стартері змінна названа print, тому друкувати стало нічим і перевірка падає з TypeError. Перейменуй змінну (наприклад, size), щоб програма виводила довжину слова, збільшену на одиницю.",
              en: "In the starter the variable is named print, so there is nothing left to print with and the check fails with TypeError. Rename the variable (for example, size) so the program prints the length of the word plus one.",
              tr: "Başlangıçta değişkenin adı print, bu yüzden yazdırılacak bir şey kalmıyor ve deneme TypeError ile düşüyor. Değişkeni yeniden adlandır (örn. size) ki program sözcüğün uzunluğunun bir fazlasını yazdırsın."
            },
            hint: {
              uk: "print має лишатися функцією. Заміни назву змінної: size = len(text), а далі print(size + 1).",
              en: "print has to stay a function. Rename the variable: size = len(text), then print(size + 1).",
              tr: "print fonksiyon olarak kalmalı. Değişkeni yeniden adlandır: size = len(text), sonra print(size + 1)."
            },
            starter: "text = input()\nprint = len(text)\nprint(print + 1)\n",
            tests: [
              { in: "abr\n", out: "4" },
              { in: "hi\n", out: "3" },
              { in: "hello world\n", out: "12" }
            ]
          }
        },
        {
          id: "comments",
          title: { uk: "Коментарі", en: "Comments", tr: "Yorumlar" },
          theory: {
            uk: "Усе, що стоїть після # до кінця рядка, Python не читає — це коментар. Він пояснює задум коду, а не повторює його: «# початкова температура» корисніше, ніж «# start = 20». Якщо треба вимкнути кілька рядків, # ставлять на початку кожного з них; такий закоментований print уже нічого не виводить. Ще коментар рятує, коли рядок поки що зайвий і його ліпше не видаляти, а призупинити — наприклад, рядок із змінною, якої в програмі ще немає; про це йтиметься в наступному уроці.",
            en: "Everything after # up to the end of the line is a comment — Python never reads it. A comment explains the intent instead of repeating the code: “# starting temperature” is more useful than “# start = 20”. To disable several lines, put # at the start of each one; a commented-out print then outputs nothing. A comment also saves you when a line is not needed yet and you would rather pause it than delete it — for instance, a line that uses a variable the program does not have yet; that is the next lesson.",
            tr: "# işaretinden satır sonuna kadar yazılan her şey yorumdur, Python onu okumaz. Yorum kodun tekrarını değil amacını açıklar: “# başlangıç sıcaklığı”, “# start = 20” satırından daha faydalıdır. Birkaç satırı devre dışı bırakmak için her satırın başına # koy; yorum yapılmış bir print hiçbir şey yazdırmaz. Yorum ayrıca, bir satır henüz gerekmediğinde onu silmek yerine askıya almak için işe yarar — sözgelimi programda henüz olmayan bir değişkeni kullanan satır; bu bir sonraki dersin konusu."
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
          id: "undeclared",
          title: { uk: "Спочатку оголоси, потім використовуй", en: "Declare it first, then use it", tr: "Önce tanımla, sonra kullan" },
          theory: {
            uk: "Python читає код зверху вниз і знає лише ті назви, які вже з'явилися в програмі, тому змінну спочатку створюють (y = 5), а тільки потім пишуть у формулі. Рядок x = y + 1, де y ніде не оголошена, зупинить програму з NameError: name 'y' is not defined — Python назве змінну, якої не знайшов, і вкаже номер рядка, тож помилку легко знайти. Якщо такий рядок потрібен буде потім, його не видаляють, а закоментовують: # на початку робить рядок невидимим, решта коду працює далі, а рядок лишається в файлі. Якщо цей результат далі лише друкували, то рядок print закоментовують теж: без нього друкувати нічого.",
            en: "Python reads the code top to bottom and knows only the names that already appeared in the program, so a variable is created first (y = 5) and only then written into a formula. The line x = y + 1, where y was never declared, stops the program with NameError: name 'y' is not defined — Python names the variable it could not find and points at the line number, so the mistake is easy to locate. If you need that line later, do not delete it, comment it out: # at the start makes the line invisible, the rest of the code keeps running and the line stays in the file. If that result was only ever printed, comment out the print line as well: with the value gone there is nothing to print.",
            tr: "Python kodu yukarıdan aşağı okur ve yalnız programda daha önce ortaya çıkmış adları bilir; bu yüzden değişken önce oluşturulur (y = 5), sonra formüle yazılır. y'nin hiç tanımlanmadığı x = y + 1 satırı programı NameError: name 'y' is not defined ile durdurur — Python bulamadığı değişkenin adını ve satır numarasını söyler, hata kolayca bulunur. Bu satırı sonra kullanacaksan silme, yoruma al: başındaki # satırı görünmez kılar, kodun kalanı çalışmaya devam eder ve satır dosyada kalır. Bu sonuç yalnızca yazdırılmak için kullanıldıysa print satırını da yoruma al: değer olmayınca yazdırılacak bir şey kalmaz."
          },
          example: "print(\"програма стартувала\")\nx = y + 1\nprint(x)\n",
          task: {
            text: {
              uk: "Програма падає на рядку c = b + y: змінної y в ній немає, і створювати її теж не треба. Вимкнути зайве — робота для # : закоментуй цей рядок і той, що друкує c, щоб вивелося лише початок і кінець.",
              en: "The program stops at the line c = b + y: there is no variable y in it, and you should not create one either. Turning things off is the job of # : comment out that line and the line that prints c, so that only початок and кінець are printed.",
              tr: "Program c = b + y satırında düşüyor: böyle bir y değişkeni yok ve onu oluşturmak da gerekmez. Fazlalığı kapatmak # işaretinin işi: o satırı ve c'yi yazdıran satırı yoruma al, böylece yalnızca початок і кінець yazdırılsın."
            },
            hint: {
              uk: "Почни кожен вимкнений рядок з #: # c = b + y та # print(c). Інші рядки не чіпай — вони працюють правильно.",
              en: "Start each disabled line with #: # c = b + y and # print(c). Leave the other lines alone — they are already correct.",
              tr: "Kapattığın her satıra # ile başla: # c = b + y ve # print(c). Diğer satırlara dokunma — onlar zaten doğru."
            },
            starter: "print(\"початок\")\na = 4\nb = a * 2\nc = b + y\nprint(c)\nprint(\"кінець\")\n",
            tests: [
              { in: "", out: "початок\nкінець" }
            ]
          }
        },
        {
          id: "indent",
          title: { uk: "Відступ на початку рядка", en: "Indentation at the start of a line", tr: "Satır başındaki girinti" },
          theory: {
            uk: "Python бачить, чи стоїть пробіл на початку рядка. Звичайні команди пишуть від самого лівого краю, а рядок, зайво зсунутий управо, зупиняє програму: з'являється IndentationError: unexpected indent із номером рядка, тож помилку легко знайти. Таби з пробілами не мішають. А от пробели всередині рядка на результат не впливають: print( 2 + 3 ) і print(2+3) дадуть те саме 5 — там відступ потрібен лише для читабельності. Про блоки, тобто рядки після двокрапки, де відступ обов'язковий, поговоримо пізніше — в уроках про умову та цикл.",
            en: "Python notices whether a line starts with a space. Ordinary commands are written from the very left edge, and a line shifted right for no reason stops the program: you get IndentationError: unexpected indent with the line number, so the mistake is easy to find. Don't mix tabs and spaces. Spaces inside a line, however, change nothing: print( 2 + 3 ) and print(2+3) both give 5 — there the indent only serves readability. Blocks, i.e. the lines after a colon where an indent is required, come later, in the lessons on conditions and loops.",
            tr: "Python, satırın boşlukla başlayıp başlamadığına bakar. Normal komutlar en soldan yazılır; gereksiz yere sağa kaydırılan satır programı durdurur: satır numarasıyla birlikte IndentationError: unexpected indent hatası çıkar, yani hatayı bulmak kolaydır. Sekmeleri boşluklarla karıştırma. Satır içindeki boşluklar ise sonucu değiştirmez: print( 2 + 3 ) ile print(2+3) aynı 5'i verir — oradaki girinti yalnızca okunabilirlik içindir. İki noktadan sonra gelen, girintinin zorunlu olduğu blokları ise sonra, koşul ve döngü derslerinde göreceğiz."
          },
          example: "price = 4\nqty = 3\nprint( price * qty )\nprint(price*qty)\n",
          task: {
            text: {
              uk: "Програма рахує вартість покупки, але падає, ще не встигши почати: три рядки зайво зсунуті вправо. Прибери відступи на початку кожного рядка, а пробіли всередині лиши як були — вони ні на що не впливають. Для 4 і 3 має вивестися 12.",
              en: "The program computes the cost of a purchase but crashes before it even starts: three lines are shifted right for no reason. Remove the indentation at the start of each line and leave the spaces inside them as they are — they change nothing. With 4 and 3 it must print 12.",
              tr: "Program alışveriş tutarını hesaplıyor ama başlamadan çöküyor: üç satır gereksiz yere sağa kaydırılmış. Satır başlarındaki girintileri sil, satır içi boşluklara dokunma — bir şey değiştirmezler. 4 ve 3 girilirse 12 yazdırmalı."
            },
            hint: {
              uk: "Почни всі три рядки від лівого краю, прибравши пробіли перед price, qty та print. Пробіли всередині print( price * qty ) можна лишити — на результат вони не впливають.",
              en: "Start all three lines at the left edge by removing the spaces before price, qty and print. You may keep the spaces inside print( price * qty ) — they do not change the result.",
              tr: "Üç satırın tamamını en soldan başlat; price, qty ve print önündeki boşlukları sil. print( price * qty ) içindeki boşlukları bırakabilirsin — sonucu değiştirmezler."
            },
            starter: "  price = int(input())\n    qty = int(input())\n        print( price * qty )\n",
            tests: [
              { in: "4\n3", out: "12" },
              { in: "7\n2", out: "14" },
              { in: "0\n5", out: "0" }
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
          id: "syntax",
          title: { uk: "Незакрита дужка та лапка", en: "Unclosed bracket and quote", tr: "Kapatılmamış parantez ve tırnak" },
          theory: {
            uk: "Дужку й лапки закривають у тому ж рядку. Команда print(\"привіт\" без дужки та print(\"світ) без другої лапки не запускаються взагалі: Python зупиняється ще до першої команди. Незакриті дужки пояснює як '(' was never closed, а незакриті лапки — як unterminated string literal. Тип для обох випадків один — SyntaxError, змінюється лише пояснення й номер рядка. Лапки мають збігатися: відкрив двойною — подвійною й закривай, а текст усередині лапок не перенось на новий рядок.",
            en: "You close the bracket and the quotes on the same line. print(\"привіт\" without its bracket and print(\"світ) without its closing quote never start: Python stops before the very first command. Unclosed brackets are explained as '(' was never closed, unclosed quotes as unterminated string literal. Both cases give the same type — SyntaxError — only the wording and the line number change. Quotes must match: open with a double quote, close with a double quote, and never wrap text inside the quotes onto a new line.",
            tr: "Parantez ve tırnak aynı satırda kapatılır. Parantezi olmayan print(\"привіт\" ile ikinci tırnağı olmayan print(\"світ) hiç başlamaz: Python daha ilk komuttan önce durur. Kapatılmamış parantezi '(' was never closed, kapatılmamış tırnağı unterminated string literal diye açıklar. Her iki durumda da tür aynıdır — SyntaxError — yalnızca açıklama ve satır numarası değişir. Tırnaklar aynı olmalı: çift tırnakla açtığını çift tırnakla kapat ve tırnakların içindeki metni yeni satıra bölme."
          },
          example: "print(\"привіт\"\nprint(\"світ\")\n",
          task: {
            text: {
              uk: "Тут два зламаних рядки: у першому не закрито дужку, у другому — лапку. Виправ обидва по порядку, не прибираючи жодного з них, і допиши рядок із назвою типу помилки, через який код не запускався. Має вивестися привіт, світ і SyntaxError.",
              en: "Two lines here are broken: the first has an unclosed bracket, the second an unclosed quote. Fix both in order without removing either, then add a line with the name of the error type that stopped the code. It must print привіт, світ and SyntaxError.",
              tr: "Burada iki bozuk satır var: birincisinde parantez, ikincisinde tırnak kapatılmamış. İkisini de sırayla düzelt, hiçbirini silme, ardından kodu durduran hata türünün adını yazan bir satır ekle. Çıktıda привіт, світ ve SyntaxError görünmeli."
            },
            hint: {
              uk: "Спершу закрий дужку в першому рядку: print(\"привіт\"). Потім закрий лапку в другому: print(\"світ\"). Далі допиши print(\"SyntaxError\") — саме так називається тип помилки, яку видавав зламаний код.",
              en: "First close the bracket on the first line: print(\"привіт\"). Then close the quote on the second: print(\"світ\"). Finally add print(\"SyntaxError\") — that is the name of the error type the broken code raised.",
              tr: "Önce birinci satırda parantezi kapat: print(\"привіт\"). Sonra ikinci satırda tırnağı kapat: print(\"світ\"). Ardından print(\"SyntaxError\") ekle — bozuk kodun verdiği hata türünün adı budur."
            },
            starter: "print(\"привіт\"\nprint(\"світ)\n",
            tests: [
              { in: "", out: "привіт\nсвіт\nSyntaxError" }
            ]
          }
        },
        {
          id: "chrord",
          title: { uk: "Коди символів: ord() та chr()", en: "Character codes: ord() and chr()", tr: "Karakter kodları: ord() ve chr()" },
          theory: {
            uk: "Кожен символ має номер у таблиці кодування: \"A\" — 65, \"a\" — 97, \"0\" — 48. ord(\"A\") повертає номер символа, а chr(65) — символ за номером. Це обернені дії: chr(ord(\"a\")) знову дає \"a\", а ord(chr(97)) знову дає 97. Коди українських літер набагато більші: \"я\" — 1103, тому текст тримають у рядках, а не в числах. І ще одна пастка: літери з різних алфавітів, однакові на вигляд, мають різні номери — англійська \"B\" це 66, а українська \"В\" це 1042. Тому в умові завжди називають алфавіт: без нього один і той самий на вигляд символ має дві різні відповіді.",
            en: "Every character has a number in the encoding table: \"A\" is 65, \"a\" is 97, \"0\" is 48. ord(\"A\") returns the number of a character and chr(65) returns the character for a number. They are inverse operations: chr(ord(\"a\")) gives \"a\" again, and ord(chr(97)) gives 97 again. Ukrainian letters have much bigger numbers: \"я\" is 1103, so text always stays in strings rather than numbers. One more trap: letters from different alphabets that look identical have different numbers — English \"B\" is 66, while Ukrainian \"В\" is 1042. So a task always names the alphabet, because without it one and the same sign has two different answers.",
            tr: "Her karakterin kodlama tablosunda bir numarası vardır: \"A\" 65, \"a\" 97, \"0\" 48. ord(\"A\") karakterin numarasını, chr(65) ise numaradan karakteri döndürür. Bunlar ters işlemlerdir: chr(ord(\"a\")) yine \"a\" verir, ord(chr(97)) yine 97 verir. Ukraynaca harflerin numaraları çok daha büyüktür: \"я\" 1103, bu yüzden metin sayılarda değil dizelerde tutulur. Bir tuzak daha: farklı alfabelerden, aynı görünen harflerin numaraları farklıdır — İngilizce \"B\" 66, Ukraynaca \"В\" 1042. Bu yüzden soruda alfabe mutlaka adıyla anılır; aksi hâlde aynı görünen işaretin iki farklı cevabı olur."
          },
          example: "print(ord(\"A\"))\nprint(chr(97))\nprint(chr(ord(\"a\") + 1))\n",
          task: {
            text: {
              uk: "Виведи два рядки: символ, чий код дорівнює 97, і код першої літери англійського слова BALL. Має вивестися a та 66; схожа на вигляд українська «В» із слова ВІКНО дає 1042, і така відповідь не пройде.",
              en: "Print two lines: the character whose code is 97, and the code of the first letter of the English word BALL. It must print a and 66; the look-alike Ukrainian «В» from ВІКНО gives 1042 and will not pass.",
              tr: "İki satır yazdır: kodu 97 olan karakter ve İngilizce BALL kelimesinin ilk harfinin kodu. Çıktıda a ve 66 olmalı; aynı görünen Ukraynaca «В» (ВІКНО) 1042 verir ve bu cevap geçmez."
            },
            hint: {
              uk: "chr(97) дає символ a. Перша літера BALL — англійська \"B\", тобто ord(\"B\") = 66. Найпростіше не помилишитися: скопіювати цю літеру прямо з умови, а не набирати схожу з клавіатури. Кожне виведи окремим print().",
              en: "chr(97) gives the character a, and the first letter of BALL is the English \"B\": ord(\"B\") = 66. The easy way to avoid a mistake is to copy that letter straight from the task instead of typing a look-alike. Print each with its own print().",
              tr: "chr(97) karakteri a'yı verir; BALL'ın ilk harfi İngilizce \"B\"dir, yani ord(\"B\") = 66. Yanılmamanın en kolay yolu o harfi doğrudan sorudan kopyalamak, benzerini klavyede aramamak. Her birini ayrı bir print() ile yazdır."
            },
            starter: "",
            tests: [
              { in: "", out: "a\n66" }
            ]
          }
        },
        {
          id: "case_codes",
          title: { uk: "Велика й мала: різниця 32", en: "Upper and lower: 32 apart", tr: "Büyük ve küçük: 32 fark" },
          theory: {
            uk: "Велика й мала літери — різні символи, а різниця між їхніми номерами — 32: ord(\"A\") = 65, ord(\"a\") = 97, ord(\"F\") = 70, ord(\"f\") = 102. Тож регістр можна змінити арифметикою, без списків на пам'ять: chr(ord(\"f\") - 32) дає \"F\", а chr(ord(\"F\") + 32) — знову \"f\". Літери в таблиці йдуть алфавітом, спочатку великі, потім малі, тому пара «велика — мала» всюди лежить на 32 одиниці. У кирилиці трюк той самий: \"А\" — 1040, \"а\" — 1072. Алфавіт при цьому не міняй: між англійською \"A\" і українською \"а\" різниця вже не 32, а 1007. І є винятки: \"Є\" — 1028, а \"є\" — 1108, там 32 не працює, тож надійно перевіряти через ord.",
            en: "An uppercase and a lowercase letter are different characters, and their numbers are 32 apart: ord(\"A\") is 65, ord(\"a\") is 97, ord(\"F\") is 70, ord(\"f\") is 102. So you can switch case with arithmetic instead of memorising lists: chr(ord(\"f\") - 32) gives \"F\" and chr(ord(\"F\") + 32) gives \"f\" back. The table runs letters in alphabet order, uppercase first and lowercase after, so every upper-lower pair sits exactly 32 apart. Cyrillic behaves the same way: \"А\" is 1040, \"а\" is 1072. Just do not mix alphabets: English \"A\" and Ukrainian \"а\" are 1007 apart, not 32. There are exceptions too: \"Є\" is 1028 while \"є\" is 1108, so when in doubt check with ord.",
            tr: "Büyük ve küçük harf farklı karakterlerdir ve numaraları 32 fark eder: ord(\"A\") 65, ord(\"a\") 97, ord(\"F\") 70, ord(\"f\") 102. Yani bellekten liste saymadan aritmetikle değiştirebilirsin: chr(ord(\"f\") - 32) \"F\" verir, chr(ord(\"F\") + 32) yeniden \"f\" verir. Tablo harfleri alfabe sırasıyla dizer, önce büyükler sonra küçükler; her büyük-küçük çifti tam 32 adım ötededir. Kirilcede de aynı şey geçerli: \"А\" 1040, \"а\" 1072. Yalnız alfabeyi karıştırma: İngilizce \"A\" ile Ukraynaca \"а\" arasında 32 değil 1007 fark var. İstisna da var: \"Є\" 1028 iken \"є\" 1108; şüphe edince ord ile bak."
          },
          example: "print(ord(\"A\"))\nprint(ord(\"a\"))\nprint(ord(\"a\") - ord(\"A\"))\nprint(chr(ord(\"f\") - 32))\n",
          task: {
            text: {
              uk: "Мала \"p\" і велика \"P\" — різні символи, але пов'язані. Виведи три рядки: на скільки код \"p\" більший за код \"P\", велику літеру, діставши її з \"p\" через ord і chr, і код цієї великої літери. Має вивестися 32, P і 80.",
              en: "The lowercase \"p\" and the uppercase \"P\" are different characters that are related. Print three lines: by how much the code of \"p\" is bigger than the code of \"P\", the uppercase letter you get from \"p\" through ord and chr, and the code of that uppercase letter. It must print 32, P and 80.",
              tr: "Küçük \"p\" ile büyük \"P\" farklı ama bağlantılı karakterlerdir. Üç satır yazdır: \"p\" kodu ile \"P\" kodu arasındaki fark, ord ve chr ile \"p\"'den elde edilen büyük harf ve o büyük harfin kodu. Çıktıda 32, P ve 80 olmalı."
            },
            hint: {
              uk: "Різницю порахуй як ord(\"p\") - ord(\"P\") — вийде 32. Велику літеру дістань із малої арифметикою: chr(ord(\"p\") - 32), це P. Її код знову через ord: ord(chr(ord(\"p\") - 32)) = 80.",
              en: "Count the difference as ord(\"p\") - ord(\"P\") — you get 32. Get the uppercase from the lowercase by arithmetic: chr(ord(\"p\") - 32), which is P. Read its code again with ord: ord(chr(ord(\"p\") - 32)) = 80.",
              tr: "Farkı ord(\"p\") - ord(\"P\") olarak hesapla — 32 çıkar. Büyük harfi küçükten aritmetikle elde et: chr(ord(\"p\") - 32), yani P. Kodunu yine ord ile oku: ord(chr(ord(\"p\") - 32)) = 80."
            },
            starter: "",
            tests: [
              { in: "", out: "32\nP\n80" }
            ]
          }
        },
        {
          id: "homoglyph",
          title: { uk: "Літери-двійники: якою мовою?", en: "Look-alike letters: which language?", tr: "İkiz harfler: hangi dille?" },
          theory: {
            uk: "«Виведи код символу В» — не задача, а пастка: в ній не сказано, який алфавіт. Англійська \"B\" — це 66, а українська \"В\", яку на екрані не відрізнити, — 1042. Двійників у таблиці багато: \"A\" (65) і \"А\" (1040), \"C\" (67) і \"С\" (1057), \"E\" (69) і \"Е\" (1045), \"P\" (80) і \"Р\" (1056). Тому в умові називають слово з потрібного алфавіту: перша літера BALL — англійська, а перша літера АБЕТКА — українська. Python бачить тут теж різні символи: змінна, названа латинською \"a\", і змінна, названа українською \"а\", — дві різні змінні, хоча на рядку не відрізниш. Найбезпечніший шлях — скопіювати символ прямо з умови або перевірити його номер через ord.",
            en: "\"Print the code of B\" is not a task, it is a trap: it never says which alphabet. English \"B\" is 66, while the Ukrainian \"В\", impossible to tell apart on screen, is 1042. The table is full of twins: \"A\" (65) and \"А\" (1040), \"C\" (67) and \"С\" (1057), \"E\" (69) and \"Е\" (1045), \"P\" (80) and \"Р\" (1056). That is why a task names a word from the alphabet you need: the first letter of BALL is English, the first letter of АБЕТКА is Ukrainian. Python sees different characters here too: a variable named with Latin \"a\" and one named with Ukrainian \"а\" are two different variables, although the line looks identical. The safest move is to copy the character straight from the task or to check its number with ord.",
            tr: "\"B'nin kodunu yazdır\" bir soru değil tuzaktır: hangi alfabe olduğu söylenmez. İngilizce \"B\" 66'dır, ekranda ayrımı imkânsız Ukraynaca \"В\" ise 1042. Tablo ikizlerle dolu: \"A\" (65) ile \"А\" (1040), \"C\" (67) ile \"С\" (1057), \"E\" (69) ile \"Е\" (1045), \"P\" (80) ile \"Р\" (1056). Bu yüzden soru gerektiği alfabeden bir kelime adıyla konuşur: BALL'ın ilk harfi İngilizce, АБЕТКА'nın ilk harfi Ukraynacadır. Python burada da farklı karakterler görür: Latince \"a\" ile adlandırılmış değişken ile Ukraynaca \"а\" ile adlandırılmışı iki ayrı değişkendir, satır aynı görünse de. En güvenli hamle: işareti doğrudan sorudan kopyala ya da ord ile numarasına bak."
          },
          example: "print(ord(\"B\"))\nprint(ord(\"В\"))\nprint(ord(\"A\"))\nprint(ord(\"А\"))\n",
          task: {
            text: {
              uk: "Виведи три рядки: код першої літери українського слова АБЕТКА, код першої літери англійського слова APPLE і різницю між цими кодами в тому ж порядку. Має вивестися 1040, 65 і 975.",
              en: "Print three lines: the code of the first letter of the Ukrainian word АБЕТКА, the code of the first letter of the English word APPLE, and the difference between these codes in the same order. It must print 1040, 65 and 975.",
              tr: "Üç satır yazdır: Ukraynaca АБЕТКА kelimesinin ilk harfinin kodu, İngilizce APPLE kelimesinin ilk harfinin kodu ve bu iki kod arasındaki fark, yine aynı sırada. Çıktıda 1040, 65 ve 975 olmalı."
            },
            hint: {
              uk: "Перша літера АБЕТКА — українська «А», її код 1040. Перша літера APPLE — англійська «A», код 65. Обидві літери краще скопіювати прямо зі слів в умові: з клавіатури легко потрапити не в той ряд. Різниця: 1040 - 65 = 975.",
              en: "The first letter of АБЕТКА is the Ukrainian «А», code 1040. The first letter of APPLE is the English «A», code 65. Copy both letters straight from the words in the task — a keyboard easily gives you the other row. The difference: 1040 - 65 = 975.",
              tr: "АБЕТКА'nın ilk harfi Ukraynaca «А», kodu 1040. APPLE'nin ilk harfi İngilizce «A», kodu 65. İkisini de sorudaki kelimelerden kopyala; klavye kolayca diğer alfabeten karakter verebilir. Fark: 1040 - 65 = 975."
            },
            starter: "",
            tests: [
              { in: "", out: "1040\n65\n975" }
            ]
          }
        },
        {
          id: "emoji",
          title: { uk: "Емодзі теж мають коди", en: "Emoji have codes too", tr: "Emoji'nin de kodu var" },
          theory: {
            uk: "Емодзі — звичайні символи з тієї самої таблиці, тільки з величезними номерами: ord(\"😀\") = 128512, ord(\"🙂\") = 128578, а chr(128512) знову дає \"😀\". Літери й цифри займають перші сотні номерів, емодзі — сотні тисяч, тому їх не тримають у голові, а дістають через ord і chr. Номер, більший за 65535, у деяких форматах записують двома половинками, тому в файлі емодзі важчий за літеру, а стара консоль або шрифт показують замість усмішки порожній квадратик. У назвах змінних емодзі краще не вживати: Python дозволить, але без копіювання таке ім'я не набереш, а на іншому комп'ютері його ще й не видно. Справа не в емодзі, а в головному: для Python будь-який символ — це число, де б у таблиці воно не стояло.",
            en: "Emoji are ordinary characters from the same table, only with enormous numbers: ord(\"😀\") is 128512, ord(\"🙂\") is 128578, and chr(128512) gives \"😀\" back. Letters and digits take the first few hundred numbers, emoji live in the hundred thousands, so nobody keeps them in memory — you get them through ord and chr. A number above 65535 is written as two halves in some formats, so in a file an emoji weighs more than a letter, and an old console or font shows an empty box instead of the smile. Keep emoji out of variable names: Python allows them, but you cannot type such a name without copying it, and another machine may not even show it. The point is not the emoji but the main idea: for Python every character is a number, wherever it sits in the table.",
            tr: "Emoji de aynı tablodan sıradan karakterlerdir, yalnızca numaraları devcadır: ord(\"😀\") 128512, ord(\"🙂\") 128578 ve chr(128512) yeniden \"😀\" verir. Harf ve rakamlar ilk birkaç yüz numarayı kaplar, emojiler yüz binlerdedir; kimse onları bellekte tutmaz, ord ve chr ile bulunur. 65535'ten büyük numara bazı biçimlerde iki parçayla yazılır, bu yüzden dosyada emoji bir harften ağır gelir ve eski bir konsol ya da yazı tipi gülümseme yerine boş kutu gösterir. Değişken adlarında emoji kullanma: Python izin verir ama kopyalamadan o adı yazamazsın, başka bir makine göstermeyebilir. Mesele emoji değil, ana fikir: Python için her karakter bir sayıdır, tabloda nerede durursa dursun."
          },
          example: "print(ord(\"😀\"))\nprint(chr(128512))\nprint(ord(\"😀\") - ord(\"A\"))\n",
          task: {
            text: {
              uk: "Виведи два рядки: код жовтої усмішки «😀» і сам емодзі, який ховається під номером 128512. Має вивестися 128512 і усмішка. Скопіюй «😀» прямо з умови: схожих усмішок у таблиці десятки, і код у кожної свій.",
              en: "Print two lines: the code of the yellow smiley «😀» and the emoji hiding behind the number 128512. It must print 128512 and the smiley. Copy «😀» straight from the task: the table has dozens of similar smiles and each has its own code.",
              tr: "İki satır yazdır: sarı gülümseme «😀» kodu ve 128512 numarasının ardına saklanmış emoji. Çıktıda 128512 ve gülümseme olmalı. «😀»'yi doğrudan sorudan kopyala: tabloda buna benzeyen onlarca ifade var ve her birinin kodu ayrı."
            },
            hint: {
              uk: "ord(\"😀\") дає 128512 — код дістають саме так, а не напам'ять. Другий рядок — chr(128512), і вийде знову та сама усмішка.",
              en: "ord(\"😀\") gives 128512 — that is how you get a code, not from memory. The second line is chr(128512), and the same smiley comes back.",
              tr: "ord(\"😀\") 128512 verir — kod böyle bulunur, bellekten değil. İkinci satır chr(128512); yeniden aynı gülümseme çıkar."
            },
            starter: "",
            tests: [
              { in: "", out: "128512\n😀" }
            ]
          }
        },
        {
          id: "escapes_quotes",
          title: { uk: "Екранування лапок", en: "Escaping quotes", tr: "Tırnak kaçışı" },
          theory: {
            uk: "Лапка для Python — не звичайний символ, а межа рядка: перша лапка рядок відчиняє, така сама закриває. Тому в print(\"Він каже: \"Привіт\"\") Python закриє рядок ще перед словом Привіт і зупинить програму з SyntaxError. Щоб лапка стала частиною тексту, перед нею ставлять зворотний слеш: \\\" — це й називають екрануванням. Є викрутка й без слеша: взяти текст у лапки іншого виду — подвійні лапки всередині одинарних межею не вважаються, як і апостроф всередині подвійних. Але коли в тексті є і лапки, і апострофи, одну пару доведеться екранувати все одно. Інша викрутка — дробити текст на шматки й склеювати через +, проте рядок стає довгим і в ньому легко загубити лапку. Екранування лишає текст одним цілим, який читається саме так, як пишеться, тому воно коротше й надійніше.",
            en: "For Python a quote is not an ordinary character but the edge of the string: the first quote opens the string, the same kind of quote closes it. So in print(\"Він каже: \"Привіт\"\") Python closes the string before the word and stops the program with SyntaxError. To make a quote part of the text you put a backslash in front of it: \\\" — that is escaping. There is a way round a backslash too: wrap the text in the other kind of quote, because double quotes inside single quotes are not edges, and an apostrophe inside double quotes is not either. But when the text holds both quotes and apostrophes, one pair still has to be escaped. The other way out is chopping the text into pieces and gluing them with +, yet the line grows long and a quote is easy to lose. Escaping keeps the text one whole line that reads exactly as it is written, so it is shorter and safer.",
            tr: "Tırnak Python için sıradan bir karakter değil, dizenin sınırıdır: ilk tırnak dizeyi açar, aynı tırnak kapatır. Bu yüzden print(\"O: \"Merhaba\"\") içinde Python sözcükten önce dizeyi kapatır ve programı SyntaxError ile durdurur. Tırnağı metnin parçası yapmak için önüne ters bölü koyarsın: \\\" — buna kaçış denir. Ters bölüsüz de yol var: metni öteki tırnak türünün içine almak; çift tırnak tek tırnağın içinde sınır sayılmaz, tek tırnak da çiftin içinde sayılmaz. Ama metinde hem tırnak hem kesme işareti varsa, bir ikiliyi yine de kaçırman gerekir. Öteki yol metni parçalara bölüp + ile yapıştırmak, fakat satır uzar ve tırnağı kaybetmek kolaydır. Kaçış metni tek satır olarak bırakır ve yazıldığı gibi okunur; bu yüzden hem kısa hem güvenli."
          },
          example: "print(\"Він каже: \\\"Привіт\\\"\")\nprint('Вона каже: \"Добре\"')\nprint(\"Кажуть: \\\"не мій 'дім'\\\"\")\n",
          task: {
            text: {
              uk: "Виведи три рядки, кожен своїм способом. Перший — Він каже: \"Привіт\"; текст у подвійних лапках, тому кожну внутрішню лапку екрануй. Другий — Вона каже: \"Добре\"; тут текст візьми в одинарні лапки, тоді внутрішні подвійні напишеш без слеша. Третій — Кажуть: \"не мій 'дім'\"; у цьому рядку є і лапки, і апострофи, тому одну пару все одно доведеться екранувати.",
              en: "Print three lines, each one a different way. First — Він каже: \"Привіт\"; the text sits in double quotes, so escape every inner quote. Second — Вона каже: \"Добре\"; wrap this one in single quotes and the inner double quotes need no backslash. Third — Кажуть: \"не мій 'дім'\"; this line has both quotes and apostrophes, so one pair still must be escaped.",
              tr: "Üç satır yazdır, her birini ayrı yolla. Birinci — Він каже: \"Привіт\"; metin çift tırnak içinde, bu yüzden her iç tırnağı kaçır. İkinci — Вона каже: \"Добре\"; bunu tek tırnağın içine al, içerideki çift tırnaklar ters bölü istemez. Üçüncü — Кажуть: \"не мій 'дім'\"; bu satırda hem tırnak hem kesme işareti var, o yüzden bir ikiliyi yine de kaçırman gerekecek."
            },
            hint: {
              uk: "print(\"Він каже: \\\"Привіт\\\"\") — два зворотні слеші, по одному на лапку. print('Вона каже: \"Добре\"') — рядок в одинарних лапках, а всередині звичайні подвійні. print(\"Кажуть: \\\"не мій 'дім'\\\"\") — лапки екрануй, апострофи всередині подвійних лапок лишаються як є. Обереш зовнішні одинарні лапки — доведеться екранувати апострофи: print('Кажуть: \"не мій \\'дім\\'\"').",
              en: "print(\"Він каже: \\\"Привіт\\\"\") — two backslashes, one per quote. print('Вона каже: \"Добре\"') — the line is in single quotes, so plain double quotes inside. print(\"Кажуть: \\\"не мій 'дім'\\\"\") — escape the quotes, leave the apostrophes alone inside double quotes. Choose outer single quotes instead and you escape the apostrophes: print('Кажуть: \"не мій \\'дім\\'\"').",
              tr: "print(\"Він каже: \\\"Привіт\\\"\") — iki ters bölü, tırnak başına bir. print('Вона каже: \"Добре\"') — satır tek tırnak içinde, içeride sıradan çift tırnaklar var. print(\"Кажуть: \\\"не мій 'дім'\\\"\") — tırnakları kaçır, kesme işaretlerini çift tırnağın içinde dokunmadan bırak. Dışarıda tek tırnak seçersen bu kez kesme işaretlerini kaçırırsın: print('Кажуть: \"не мій \\'дім\\'\"')."
            },
            starter: "",
            tests: [
              { in: "", out: "Він каже: \"Привіт\"\nВона каже: \"Добре\"\nКажуть: \"не мій 'дім'\"" }
            ]
          }
        },
        {
          id: "escapes_newline",
          title: { uk: "Новий рядок і табуляція", en: "New line and tab", tr: "Yeni satır ve sekme" },
          theory: {
            uk: "Зворотний слеш діє не лише з лапками: комбінація \\n означає «тут почни новий рядок», а \\t — табуляцію, стрибок до наступної колонки. У коді це два знаки, а в рядку — один символ, тому рядок лишається одним, хоч на екрані й розпадається на кілька. Перенести текст звичайними лапками по-справжньому не вийде: Python обрве рядок і видасть SyntaxError: unterminated string literal. Для тексту, де кожен рядок важливий, є потрійні лапки — у них текст можна перенести самою клавішею Enter, але \\n і \\t придатні усюди. Табуляція розсуває стовпчики, однак вирівнювання не гарантує: різні консолі дають їй різний крок. І ще: порожній print() — той самий новий рядок, тільки без тексту.",
            en: "A backslash does more than quotes: \\n means «start a new line here» and \\t is a tab, a jump to the next column. In the code they look like two characters, in the string they become one, so the string stays a single one even though the screen shows several lines. A real line break inside ordinary quotes will not work: Python cuts the string and answers SyntaxError: unterminated string literal. For text where every line matters there are triple quotes, and there a real Enter works, but \\n and \\t are useful everywhere. A tab pushes columns apart yet does not guarantee alignment: different consoles give it a different width. And one more thing: an empty print() is the same new line, only without text.",
            tr: "Ters bölü yalnız tırnak için değil: \\n «burada yeni satıra geç» demek, \\t ise sekme, bir sonraki sütuna sıçramadır. Kodda iki işaret gibi görünürler, dizede tek karakter olurlar; bu yüzden dize tek kalır ama ekranda birkaç satıra dağılır. Sıradan tırnakların içinde gerçek satır sonu işlemez: Python dizeyi keser ve SyntaxError: unterminated string literal verir. Her satırın önemli olduğu metin için üçlü tırnaklar vardır, orada gerçek Enter çalışır, ama \\n ve \\t her yerde işe yarar. Sekme sütunları ayırır ama hizayı garanti etmez: farklı konsoller farklı genişlik verir. Bir de şu var: boş print() aynı yeni satırdır, yalnız metinsiz."
          },
          example: "print(\"Раз\\nдва\\nтри\")\nprint(\"ім'я\\tвік\")\nprint(\"Оля\\t12\")\nprint()\nprint(\"це після порожнього print()\")\n",
          task: {
            text: {
              uk: "Одним print() виведи три рядки: Один, Два, Три — розділи їх комбінацією \\n. Другим print() виведи два рядки по два стовпчики, де стовпчики розділені \\t: у першому ім'я та вік, у другому Оля та 12. Усього має вивестися п'ять рядків.",
              en: "With one print() output three lines — Один, Два, Три — separated by the \\n combination. With a second print() output two lines of two columns separated by \\t: name and age in the first, Оля and 12 in the second. Five lines in all.",
              tr: "Tek print() ile üç satır yazdır: Один, Два, Три — aralarında \\n kombinasyonu. İkinci print() ile iki satır, iki sütun yazdır, sütunları \\t ayırsın: ilk satırda ad ve yaş, ikincisinde Оля ve 12. Toplamda beş satır çıkmalı."
            },
            hint: {
              uk: "print(\"Один\\nДва\\nТри\") — три рядки виводу з одного рядка коду. Другий виклик теж можна одним рядком: print(\"ім'я\\tвік\\nОля\\t12\") — \\t між стовпчиками, \\n між рядками.",
              en: "print(\"Один\\nДва\\nТри\") — three output lines from one line of code. The second call fits one line too: print(\"ім'я\\tвік\\nОля\\t12\") — \\t between the columns, \\n between the rows.",
              tr: "print(\"Один\\nДва\\nТри\") — kodda tek satır, çıktıda üç satır. İkinci çağrı da tek satıra sığar: print(\"ім'я\\tвік\\nОля\\t12\") — sütunlar arasında \\t, satırlar arasında \\n."
            },
            starter: "",
            tests: [
              { in: "", out: "Один\nДва\nТри\nім'я\tвік\nОля\t12" }
            ]
          }
        },
        {
          id: "escapes_path",
          title: { uk: "Зворотний слеш у шляхах", en: "Backslashes in paths", tr: "Yollarda ters bölü" },
          theory: {
            uk: "Зворотний слеш — це початок комбінації, тому сам він теж потребує екранування: один справжній слеш пишеться як \\\\. Через це шляхи Windows ламаються: у \"C:\\new\" комбінація \\n перетворюється на розрив рядка, і вивід стає двома рядками замість одного, а \\t у \"C:\\test\" стрибає до колонки замість назви теки. Коротша дорога — префікс r перед першою лапкою: r\"C:\\new\" лишає всі слеші звичайними символами, такий рядок називають «сирим»; є в нього й межа — не можна закінчити рядок одним слешем. Тож для шляхів або \\\\ у звичайних лапках, або r\"...\". І ще: слеш перед звичайною літерою її не «захистить» — комбінацій, які Python знає, небагато, решту він лишає як є, тільки попереджає про підозрілий запис.",
            en: "A backslash is the start of a combination, so it needs escaping itself: one real backslash is written \\\\. That is what breaks Windows paths: in \"C:\\new\" the \\n turns into a line break, so the output becomes two lines instead of one, and the \\t in \"C:\\test\" jumps to a column instead of naming a folder. The shorter road is the r prefix before the first quote: r\"C:\\new\" keeps every backslash an ordinary character — such a string is called raw; it has one limit though, a string cannot end with a single backslash. So for paths either \\\\ in normal quotes or r\"...\". And one more thing: a backslash in front of a plain letter does not «protect» it — Python knows only a handful of combinations, leaves the rest as written, and just warns about the suspicious code.",
            tr: "Ters bölü bir kombinasyonun başlangıcıdır, bu yüzden kendisi de kaçış ister: gerçek bir ters bölü \\\\ olarak yazılır. Windows yolları bu yüzden bozulur: \"C:\\new\" içindeki \\n satır sonuna dönüşür ve çıktı tek satır yerine iki satır olur, \"C:\\test\" içindeki \\t ise klasör adı yerine sütuna sıçrar. Daha kısa yol ilk tırnaktan önceki r ön eki: r\"C:\\new\" her ters bölüyü sıradan karakter bırakır — buna ham dize denir; tek sınırı var, dize tek ters bölüyle bitemez. Yani yollar için ya normal tırnak içinde \\\\ ya da r\"...\". Bir de şu: sıradan bir harften önceki ters bölü onu «korumaz» — Python birkaç kombinasyonu bilir, gerisini yazıldığı gibi bırakır, yalnız şüpheli yazımı uyararak geçer."
          },
          example: "print(\"C:\\new\")\nprint(\"C:\\\\new\")\nprint(r\"C:\\py\\file.py\")\nprint(\"і так теж: C:\\\\py\\\\file.py\")\n",
          task: {
            text: {
              uk: "Виведи два рядки: C:\\new\\test і C:\\py\\file.py. Перший збери у звичайних лапках, екрануючи кожен зворотний слеш, а другий дістав одним «сирим» рядком із префіксом r. Має вийти саме два рядки — без розривів посередині.",
              en: "Print two lines: C:\\new\\test and C:\\py\\file.py. Build the first in ordinary quotes, escaping every backslash, and get the second as one raw string with the r prefix. It must be exactly two lines — no breaks in the middle.",
              tr: "İki satır yazdır: C:\\new\\test ve C:\\py\\file.py. Birincisini normal tırnak içinde her ters bölüyü kaçırarak kur, ikincisini r ön ekiyle tek ham dize olarak yaz. Çıktı tam iki satır olmalı — ortada satır sonu olmayacak."
            },
            hint: {
              uk: "print(\"C:\\\\\\\\new\\\\\\\\test\") — два слеші в коді на один у виводі. Другий рядок коротший: print(r\"C:\\py\\file.py\") — літера r стоїть перед самою першою лапкою, а слеші всередині писатимеш по одному.",
              en: "print(\"C:\\\\\\\\new\\\\\\\\test\") — two backslashes in the code for one in the output. The second line is shorter: print(r\"C:\\py\\file.py\") — the letter r sits right before the very first quote, and inside you write single backslashes.",
              tr: "print(\"C:\\\\\\\\new\\\\\\\\test\") — kodda iki ters bölü, çıktıda bir. İkinci satır daha kısa: print(r\"C:\\py\\file.py\") — harf r en ilk tırnağın hemen önünde durur, içeride ters bölüleri tek tek yazarsın."
            },
            starter: "",
            tests: [
              { in: "", out: "C:\\new\\test\nC:\\py\\file.py" }
            ]
          }
        },
        {
          id: "fstring_vars",
          title: { uk: "Інтерполяція: лише змінні", en: "Interpolation: variables only", tr: "Satıra gömme: yalnızca değişkenler" },
          theory: {
            uk: "f-рядок — це звичайний рядок із префіксом f, а у фігурні дужки ставлять назву змінної: f\"Привіт, {name}!\". Python підставляє туди значення цієї змінної, тому перетворювати значення через str() вже не треба. Префікс f діє на весь рядок, тому його пишуть перед самою першою лапкою, а не перед дужками. Найчастіша помилка — забути f: тоді рядок друкується буквально, з назвою замість значення. Інша — не закрита дужка, і тоді Python не бачить, де кінець вставки. У цьому уроці в дужках лише назва змінної; вирази та виклики функцій — у наступному.",
            en: "An f-string is an ordinary string with the f prefix, and the curly braces hold the name of a variable: f\"Привіт, {name}!\". Python pastes in that variable's value, so wrapping things in str() is no longer needed. The f prefix applies to the whole string, so it stands before the very first quote, not before the braces. The usual mistake is forgetting the f: then the line prints literally, with the name instead of the value. Another one is an unclosed brace, where Python cannot see where the insertion ends. In this lesson the braces hold only a variable name; expressions and function calls come in the next one.",
            tr: "f-dizesi başında f ön eki olan sıradan bir dizgedir; küme parantezinin içine değişkenin adı yazılır: f\"Merhaba, {name}!\". Python oraya o değişkenin değerini koyar, bu yüzden değerleri str() ile sarmaya gerek kalmaz. f ön eki tüm dizgeye etki eder, bu yüzden parantezden önce değil, en ilk tırnaktan önce yazılır. En sık hata f'yi unutmaktır: o satır aynen, değer yerine adla yazdırılır. Bir diğeri kapanmayan parantezdir; Python o zaman eklemenin nerede bittiğini göremez. Bu derste parantezin içinde yalnızca değişken adı var; ifadeler ve fonksiyon çağrıları sonraki derste."
          },
          example: "name = \"Оля\"\nage = 12\nprint(f\"Мене звати {name}, мені {age}\")\nprint(\"{name} — це без префікса f\")\n",
          task: {
            text: {
              uk: "Прочитай ім'я з першого рядка вводу (input()) і виведи його у реченні через f-рядок: Привіт, Оля! — тільки замість Оля має стояти те, що введе перевірка. Один рядок коду з print, у дужках лише назва змінної.",
              en: "Read a name from the first input line with input() and print it in a sentence using an f-string: Привіт, Оля! — but where Оля stands, the checker's own input must appear. One print line, and the braces hold only the variable name.",
              tr: "İlk giriş satırından input() ile bir ad oku ve bunu bir f-dizesiyle cümle içinde yazdır: Привіт, Оля! — Оля yerine denetleyicinin girdisi gelmeli. Tek bir print satırı, parantezin içinde yalnızca değişken adı."
            },
            hint: {
              uk: "name = input()\nprint(f\"Привіт, {name}!\") — спочатку зберігаєш введений текст у змінну, потім ставиш її назву у дужки та не забуваєш f перед першою лапкою.",
              en: "name = input()\nprint(f\"Привіт, {name}!\") — first you keep the typed text in a variable, then you put its name into the braces and do not forget f before the first quote.",
              tr: "name = input()\nprint(f\"Привіт, {name}!\") — önce yazılan metni bir değişkende saklarsın, sonra adını paranteze koyarsın ve ilk tırnaktan önce f'yi unutmazsın."
            },
            starter: "",
            tests: [
              { in: "Оля\n", out: "Привіт, Оля!" },
              { in: "Максим\n", out: "Привіт, Максим!" },
              { in: "Галина\n", out: "Привіт, Галина!" }
            ]
          }
        },
        {
          id: "fstring_expr",
          title: { uk: "Інтерполяція: вирази та len() у дужках", en: "Interpolation: expressions and len() in braces", tr: "Satıra gömme: parantezde ifade ve len()" },
          theory: {
            uk: "У фігурних дужках f-рядка можна писати не лише назву змінної, а цілий вираз: f\"{2 + 3}\" дає 5, а f\"{a + b}\" — суму двох змінних. Працюють і виклики функцій: txt = \"це текст\"; print(f\"довжина тексту - {len(txt)}\") дає 8. Python спершу обчислює те, що всередині дужок, і лише результат уставляє в рядок. Одна межа: лапки всередині дужок не повинні збігатися з лапками самого рядка, інакше рядок обірветься — складний виклик краще винести в змінну вище. Вираз у дужках обчислюється один раз, тому речення й обчислення живуть в одному рядку, без зайвих склеювань через +.",
            en: "Inside the curly braces of an f-string you can write not only a variable name but a whole expression: f\"{2 + 3}\" gives 5 and f\"{a + b}\" gives the sum of two variables. Function calls work too: with txt = \"це текст\", the line print(f\"довжина тексту - {len(txt)}\") gives 8. Python first evaluates what sits inside the braces and only then pastes the result into the string. One border: the quotes inside the braces must not match the quotes wrapping the string itself, otherwise the string breaks off — a long call is better lifted into a variable above. An expression in the braces is evaluated once, so the sentence and the calculation live on one line with no extra gluing by +.",
            tr: "f-dizesinin küme parantezinin içinde yalnızca değişken adı değil, tam bir ifade de yazılabilir: f\"{2 + 3}\" 5 verir, f\"{a + b}\" iki değişkenin toplamını verir. Fonksiyon çağrıları da çalışır: txt = \"це текст\" ise print(f\"довжина тексту - {len(txt)}\") satırı 8 verir. Python önce parantez içindekini hesaplar, sonra sonucu dizgeye yerleştirir. Bir sınır: parantezin içindeki tırnaklar dizgeyi saran tırnaklarla aynı olmamalı, yoksa dizge kopar — uzun çağrıyı yukarıda bir değişkene almak daha iyi. Parantezdeki ifade bir kez hesaplanır; böylece cümleyle hesaplama tek satırda, ek yapıştırmaksızın durur."
          },
          example: "txt = \"це текст\"\nprint(f\"довжина тексту - {len(txt)}\")\na = 5\nb = 7\nprint(f\"сума: {a + b}\")\n",
          task: {
            text: {
              uk: "Три рядки вводу: перший — слово, другий і третій — по числу. Прочитай їх через input() (числа перетвори на int) і виведи два рядки: перший — довжина тексту - 8 для слова «це текст», другий — сума: 12 для чисел 5 і 7. В обох рядках значення має обчислювати сам вираз усередині дужок.",
              en: "Three input lines: the first is a word, the second and third are numbers. Read them with input() (turn the numbers into int) and print two lines: the first — довжина тексту - 8 for the word «це текст», the second — сума: 12 for the numbers 5 and 7. In both lines the value inside the braces must do the computing itself.",
              tr: "Üç giriş satırı: ilki bir sözcük, ikincisi ve üçüncüsü birer sayı. Bunları input() ile oku (sayıları int'e çevir) ve iki satır yazdır: birincisi — «це текст» sözcüğü için довжина тексту - 8, ikincisi — 5 ve 7 sayıları için сума: 12. Her iki satırda da parantez içindeki değer kendisi hesaplanmalı."
            },
            hint: {
              uk: "txt = input()\na = int(input())\nb = int(input())\nprint(f\"довжина тексту - {len(txt)}\")\nprint(f\"сума: {a + b}\") — і len(txt), і a + b стоять просто у фігурних дужках, без лапок навколо.",
              en: "txt = input()\na = int(input())\nb = int(input())\nprint(f\"довжина тексту - {len(txt)}\")\nprint(f\"сума: {a + b}\") — both len(txt) and a + b sit right inside the curly braces, with no quotes around them.",
              tr: "txt = input()\na = int(input())\nb = int(input())\nprint(f\"довжина тексту - {len(txt)}\")\nprint(f\"сума: {a + b}\") — hem len(txt) hem a + b doğrudan küme parantezinin içinde, etraflarında tırnak yok."
            },
            starter: "",
            tests: [
              { in: "це текст\n5\n7\n", out: "довжина тексту - 8\nсума: 12" },
              { in: "код\n3\n4\n", out: "довжина тексту - 3\nсума: 7" },
              { in: "привіт світ\n0\n9\n", out: "довжина тексту - 11\nсума: 9" }
            ]
          }
        },
        {
          id: "print_sep",
          title: { uk: "Параметр sep: що ставити між значеннями", en: "The sep parameter: what goes between the values", tr: "sep parametresi: değerlerin arasına ne konur" },
          theory: {
            uk: "print() вміє друкувати кілька значень одночасно, а sep= вирішує, що поставити між ними. Без sep це один пробіл: print(1, 2) дає «1 2». sep=\"-\" дає 1-2, sep=\", \" — «1, 2», а порожній sep=\"\" зліпить значення без жодного символу. sep діє лише між значеннями, тому на початку й наприкінці рядка роздільника не зʼявляється. Тим самим способом із чисел збирають дату й час: print(5, 11, 2026, sep=\".\") дає 5.11.2026, а print(9, 30, 15, sep=\":\") — 9:30:15. Чим закінчується рядок — параметр end — розберемо в наступному уроці.",
            en: "print() can print several values at once, and sep= decides what goes between them. Without sep it is a single space: print(1, 2) gives «1 2». sep=\"-\" gives 1-2, sep=\", \" gives «1, 2», and an empty sep=\"\" glues the values with nothing in between. sep only acts between values, so no separator appears at the start or at the end of the line. The same trick builds a date and a clock time: print(5, 11, 2026, sep=\".\") gives 5.11.2026 and print(9, 30, 15, sep=\":\") gives 9:30:15. What closes the line — the end parameter — comes in the next lesson.",
            tr: "print() birkaç değeri aynı anda yazdırabilir; sep= ise aralarına ne konacağını belirler. sep yoksa tek boşluktur: print(1, 2) → «1 2». sep=\"-\" → 1-2, sep=\", \" → «1, 2», boş sep=\"\" ise değerleri hiçbir karakter koymadan yapıştırır. sep yalnızca değerlerin arasında çalışır; bu yüzden satırın başında ve sonunda ayraç belirmesin. Aynı yolla tarih ve saat de kurulur: print(5, 11, 2026, sep=\".\") → 5.11.2026, print(9, 30, 15, sep=\":\") → 9:30:15. Satırın nasıl bittiği — end parametresi — bir sonraki derste."
          },
          example: "print(1, 2, 3, sep=\", \")\nprint(10, 20, sep=\"-\")\nprint(5, 11, 2026, sep=\".\")\nprint(9, 30, 15, sep=\":\")\nprint(\"а\", \"б\", sep=\"\")\n",
          task: {
            text: {
              uk: "Прочитай три рядки вводу — це три імена — і виведи їх одним рядком через кому з пробілом: Оля, Максим, Галина. Один виклик print із трьома значеннями та sep=\", \"; назви не переписуй від руки, бо перевірка дасть інші.",
              en: "Read three input lines — three names — and print them on one line separated by a comma and a space: Оля, Максим, Галина. One print call with three values and sep=\", \"; do not retype the names, because the checker will feed different ones.",
              tr: "Üç giriş satırı oku — üç ad — ve tek satırda virgülle, ardından boşlukla yazdır: Оля, Максим, Галина. sep=\", \" ile tek bir print çağrısı, üç değerle; adları elle yazma, denetleyici başkalarını verecek."
            },
            hint: {
              uk: "a = input()\nb = input()\nc = input()\nprint(a, b, c, sep=\", \") — sep пишеться після всіх значень і не чіпає ані початку, ані кінця рядка.",
              en: "a = input()\nb = input()\nc = input()\nprint(a, b, c, sep=\", \") — sep is written after all the values and touches neither the start nor the end of the line.",
              tr: "a = input()\nb = input()\nc = input()\nprint(a, b, c, sep=\", \") — sep tüm değerlerden sonra yazılır; satırın başına ve sonuna dokunmaz."
            },
            starter: "",
            tests: [
              { in: "Оля\nМаксим\nГалина\n", out: "Оля, Максим, Галина" },
              { in: "ананас\nбанан\nвишня\n", out: "ананас, банан, вишня" },
              { in: "1\n2\n3\n", out: "1, 2, 3" }
            ]
          }
        },
        {
          id: "print_end",
          title: { uk: "Параметр end: чим закінчити рядок", en: "The end parameter: how to close the line", tr: "end parametresi: satırı nasıl bitirmek" },
          theory: {
            uk: "Кожен print автоматично додає наприкінці \\n — тому наступний виклик починає новий рядок. end= замінює цей кінець: print(\"a\", end=\"\") нічого не додає, тож print(\"b\") друкується одразу після — виходить ab в одному рядку. end=\" \" лишає пробіл, end=\"!\" ставить знак оклику замість розриву. end= доречний, коли підпис і значення мають стояти в один рядок: print(\"Дата:\", end=\" \") і далі print(5, 11, 2026, sep=\".\") дають «Дата: 5.11.2026». Зверни увагу: end не чіпає того, що всередині виклику, — за проміжки між значеннями й далі відповідає sep.",
            en: "Every print appends \\n at the end, so the next call starts a fresh line. end= replaces that tail: print(\"a\", end=\"\") adds nothing, so print(\"b\") prints right after it — you get ab on one line. end=\" \" leaves a space, end=\"!\" puts an exclamation mark instead of the break. end= is handy when a label and its value must sit on one line: print(\"Дата:\", end=\" \") followed by print(5, 11, 2026, sep=\".\") gives «Дата: 5.11.2026». Note that end never touches what is inside the call — the gaps between values are still sep's job.",
            tr: "Her print sonuna kendiliğinden \\n ekler, bu yüzden sonraki çağrı yeni satırda başlar. end= bu sonu değiştirir: print(\"a\", end=\"\") hiçbir şey eklemez, print(\"b\") hemen ardına yazılır ve tek satırda ab olur. end=\" \" boşluk bırakır, end=\"!\" kırılma yerine ünlem koyar. end= etiketle değer aynı satırda duracaksa işe yarar: print(\"Дата:\", end=\" \") ardından print(5, 11, 2026, sep=\".\") → «Дата: 5.11.2026». Dikkat: end çağrının içindekilere dokunmaz — değerlerin arası hâlâ sep'in işi."
          },
          example: "print(\"Пай\", end=\"\")\nprint(\"тон\", end=\"!\")\nprint(\"Готово\")\nprint(\"Дата:\", end=\" \")\nprint(5, 11, 2026, sep=\".\")\n",
          task: {
            text: {
              uk: "Прочитай два рядки вводу — слово та число — і виведи їх в один рядок, поставивши між ними « — » (пробіл, тире, пробіл): перший виклик print з end=\" — \", другий — звичайний. Для слова код і числа 42 має вийти код — 42.",
              en: "Read two input lines — a word and a number — and print them on one line with « — » between them (space, dash, space): the first print call uses end=\" — \", the second is ordinary. For the word код and the number 42 the output must be код — 42.",
              tr: "İki giriş satırı oku — bir sözcük ve bir sayı — ve aralarında « — » (boşluk, tire, boşluk) olacak şekilde tek satırda yazdır: ilk print end=\" — \" ile, ikincisi bildiğin gibi. код sözcüğü ve 42 sayısı için çıktı код — 42 olmalı."
            },
            hint: {
              uk: "a = input()\nb = input()\nprint(a, end=\" — \")\nprint(b) — перший виклик лишає курсор у тому ж рядку, тому другий print друкується одразу після тире.",
              en: "a = input()\nb = input()\nprint(a, end=\" — \")\nprint(b) — the first call keeps the cursor on the same line, so the second print comes right after the dash.",
              tr: "a = input()\nb = input()\nprint(a, end=\" — \")\nprint(b) — ilk çağrı imleci aynı satırda bırakır, ikinci print tireden hemen sonra yazılır."
            },
            starter: "",
            tests: [
              { in: "Привіт\n5\n", out: "Привіт — 5" },
              { in: "код\n42\n", out: "код — 42" },
              { in: "їжа\n0\n", out: "їжа — 0" }
            ]
          }
        },
        {
          id: "print_sep_end",
          title: { uk: "Разом: sep і end в одному print()", en: "Together: sep and end in one print()", tr: "Birlikte: tek print() içinde sep ve end" },
          theory: {
            uk: "sep і end не заважають одне одному й працюють в самому виклику: sep розставляє роздільник між значеннями, end закриває рядок. Тому print(10, 20, sep=\"+\", end=\"=\") друкує 10+20=, а наступний print(30) продовжує той самий рядок — разом виходить 10+20=30. Якщо забути end, друге число стрибне на новий рядок; якщо забути sep, між числами стане пробіл. Разом вони оформлюють підписані рядки: print(\"Дата:\", end=\" \") і print(5, 11, 2026, sep=\".\") дають «Дата: 5.11.2026», а print(9, 30, 15, sep=\":\", end=\"\") і print(\" — зараз\") — «9:30:15 — зараз». Підпис винесено в окремий виклик навмисно: sep діє між усіма значеннями, тому в одному виклику «Дата:» склеївся б з числами так само, як і крапки. Ці два параметри завершують розділ «Основи».",
            en: "sep and end do not interfere and both work inside the very same call: sep places the separator between the values, end closes the line. So print(10, 20, sep=\"+\", end=\"=\") prints 10+20=, and the next print(30) continues the same line — together it becomes 10+20=30. Forget end and the second number jumps to a new line; forget sep and a space sits between the numbers. Together they build labelled lines: print(\"Дата:\", end=\" \") followed by print(5, 11, 2026, sep=\".\") gives «Дата: 5.11.2026», and print(9, 30, 15, sep=\":\", end=\"\") followed by print(\" — зараз\") gives «9:30:15 — зараз». The label sits in its own call on purpose: sep acts between every value, so inside a single call «Дата:» would be glued to the numbers just like the dots. These two parameters close the Basics chapter.",
            tr: "sep ve end birbirine engel olmaz, ikisi de aynı çağrıda çalışır: sep değerlerin arasına ayraç koyar, end satırı kapatır. Bu yüzden print(10, 20, sep=\"+\", end=\"=\") 10+20= yazdırır, sonraki print(30) aynı satırı sürdürür — birlikte 10+20=30 olur. end'i unutursan ikinci sayı yeni satıra sıçrar; sep'i unutursan sayıların arasına boşluk girer. Birlikte etiketli satırlar kurulur: print(\"Дата:\", end=\" \") ardından print(5, 11, 2026, sep=\".\") → «Дата: 5.11.2026»; print(9, 30, 15, sep=\":\", end=\"\") ardından print(\" — зараз\") → «9:30:15 — зараз». Etiket bilerek ayrı çağrıya alındı: sep tüm değerlerin arasına girdiği için tek çağrıda «Дата:» da sayılara aynı şekilde yapışırdı. Bu iki parametre Temeller bölümünü tamamlar."
          },
          example: "print(10, 20, sep=\"+\", end=\"=\")\nprint(30)\nprint(\"Дата:\", end=\" \")\nprint(5, 11, 2026, sep=\".\")\nprint(9, 30, 15, sep=\":\", end=\"\")\nprint(\" — зараз\")\n",
          task: {
            text: {
              uk: "Прочитай два числа з вводу (int) і виведи рівність одним рядком: для 10 і 20 має вийти 10+20=30. Першим виклич print(a, b, sep=\"+\", end=\"=\"), другим — print(a + b). Суму рахує Python, тому значення від руки не переписуй.",
              en: "Read two numbers from input (int) and print an equality on one line: for 10 and 20 the output must be 10+20=30. First call print(a, b, sep=\"+\", end=\"=\"), then call print(a + b). Python computes the sum, so do not retype the values.",
              tr: "Girdiden iki sayı oku (int) ve eşitliği tek satırda yazdır: 10 ve 20 için çıktı 10+20=30 olmalı. Önce print(a, b, sep=\"+\", end=\"=\"), sonra print(a + b). Toplamı Python hesaplar, değerleri elle yazma."
            },
            hint: {
              uk: "a = int(input())\nb = int(input())\nprint(a, b, sep=\"+\", end=\"=\")\nprint(a + b) — sep дає + між числами, end=\"=\" прибирає розрив і друкує =, тому сума прилипає до того ж рядка.",
              en: "a = int(input())\nb = int(input())\nprint(a, b, sep=\"+\", end=\"=\")\nprint(a + b) — sep gives the + between the numbers, end=\"=\" drops the break and prints =, so the sum sticks to the same line.",
              tr: "a = int(input())\nb = int(input())\nprint(a, b, sep=\"+\", end=\"=\")\nprint(a + b) — sep sayıların arasına + koyar, end=\"=\" satır kırılmasını kaldırıp yerine = yazar; toplam aynı satıra yapışır."
            },
            starter: "",
            tests: [
              { in: "10\n20\n", out: "10+20=30" },
              { in: "3\n4\n", out: "3+4=7" },
              { in: "0\n9\n", out: "0+9=9" }
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
            uk: "if перевіряє умову: якщо вона істинна, виконується блок — рядки після двокрапки, зсунуті вправо. Це той самий відступ з уроку про відступи, але тут він обов'язковий: без нього Python не зрозуміє, що рядок належить умові. else задає інший блок. Порівняння: ==, !=, >, <, >=, <=.",
            en: "if checks a condition: when it is true, the block runs — the lines after the colon, shifted to the right. This is the same indentation as in the indentation lesson, but here it is required: without it Python cannot tell that the line belongs to the condition. else provides another block. Comparisons: ==, !=, >, <, >=, <=.",
            tr: "if bir koşulu denetler: koşul doğruysa blok çalışır — iki noktadan sonra sağa kaydırılmış satırlar. Bu, girinti dersindeki aynı girintidir, ama burada zorunludur: olmadan Python satırın koşula ait olduğunu anlayamaz. else başka bir blok verir. Karşılaştırmalar: ==, !=, >, <, >=, <=."
          },
          example: "n = 5\nif n > 0:\n    print(\"додатне\")\nelse:\n    print(\"не додатне\")\n",
          task: {
            text: {
              uk: "Дано ціле число n. Виведи positive, якщо воно більше за нуль, і nonpositive інакше.",
              en: "An integer n is given. Print positive if it is greater than zero, otherwise print nonpositive.",
              tr: "Bir n tam sayısı veriliyor. Sıfırdan büyükse positive, değilse nonpositive yazdır."
            },
            hint: {
              uk: "Напиши if n > 0: , а наступний рядок зсунь вправо на 4 пробіли — це блок. Потім так само: else: і своя команда під нею.",
              en: "Write if n > 0: and shift the next line 4 spaces to the right — that is the block. Then do the same: else: and its own command below it.",
              tr: "if n > 0: yaz, sonraki satırı 4 boşluk sağa kaydır — bu blok. Sonra aynısını yap: else: ve altında kendi komutu."
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
