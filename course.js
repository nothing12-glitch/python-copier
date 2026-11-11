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
            uk: "Ти вже знаєш функції print() і len(). Метод — це теж функція, але пов'язана з певним об'єктом; у цьому уроці об'єкт — наш рядок тексту. Порівняй: len(word) — виклик функції, якій передаємо word у дужках; word.upper() — виклик методу самого рядка. У записі word.upper() слово word позначає рядок, крапка звертається до його методу, upper — назва методу, а () запускає його. Дужки порожні, бо upper() не потребує додаткових даних: рядок уже вказано перед крапкою. Можна навіть без змінної: \"Привіт\".upper().\n\nword.upper() повертає текст великими літерами, word.lower() — малими; цифри, пробіли й знаки лишаються як були. «Повертає» означає, що результат можна зберегти: loud = word.upper(). Сам цей виклик нічого не друкує — для показу потрібен print(loud) або print(word.upper()). Ці методи рядків не змінюють початковий текст: word лишається попереднім. Щоб зберігати в цій самій змінній новий текст, напиши word = word.upper().\n\nБез дужок word.upper — це посилання на метод, а не результат його роботи: print(word.upper) покаже опис методу, а не текст великими літерами. Є ще word.title() — велика літера на початку кожного слова. lower() корисний для порівняння без уваги на регістр: «Привіт» і «привіт» — різні рядки, але після lower() вони стають однакові.",
            en: "You already know the functions print() and len(). A method is also a function, but one associated with a particular object; in this lesson the object is our text string. Compare len(word), a function call that receives word inside its parentheses, with word.upper(), a call to the string's own method. In word.upper(), word identifies the string, the dot accesses its method, upper is the method name, and () calls it. The parentheses are empty because upper() needs no additional data: the string is already specified before the dot. You can even skip the variable: \"Привіт\".upper().\n\nword.upper() returns uppercase text and word.lower() returns lowercase text; digits, spaces and signs stay unchanged. “Returns” means you can save the result: loud = word.upper(). This call does not print anything by itself — use print(loud) or print(word.upper()) to display it. These string methods do not change the original text: word stays as it was. To store the new text in that same variable, write word = word.upper().\n\nWithout parentheses, word.upper is a reference to the method, not its result: print(word.upper) displays a description of the method rather than uppercase text. There is also word.title(), which capitalises the start of each word. lower() is useful for case-insensitive comparisons: \"Привіт\" and \"привіт\" are different strings, but after lower() they become the same.",
            tr: "print() ve len() fonksiyonlarını zaten biliyorsun. Metot da bir fonksiyondur, ancak belirli bir nesneyle ilişkilidir; bu derste nesnemiz bir metin dizesidir. Karşılaştır: len(word), word'ü parantez içinde alan bir fonksiyon çağrısıdır; word.upper() ise dizenin kendi metodunu çağırır. word.upper() yazımında word dizeyi belirtir, nokta onun metoduna erişir, upper metodun adıdır ve () onu çağırır. Parantezler boştur çünkü upper() ek veri istemez: dize zaten noktadan önce belirtilmiştir. Değişken olmadan da yazabilirsin: \"Привіт\".upper().\n\nword.upper() metni büyük harflerle, word.lower() küçük harflerle döndürür; rakamlar, boşluklar ve işaretler değişmez. «Döndürür» demek, sonucu saklayabilirsin demektir: loud = word.upper(). Bu çağrı tek başına hiçbir şey yazdırmaz — göstermek için print(loud) veya print(word.upper()) gerekir. Bu dize metotları özgün metni değiştirmez: word eskisi gibi kalır. Yeni metni aynı değişkende saklamak için word = word.upper() yaz.\n\nParantezsiz word.upper, metodun sonucunu değil kendisine başvuruyu ifade eder: print(word.upper) büyük harfli metin yerine metodun açıklamasını gösterir. Bir de word.title() var: her kelimenin başını büyük harf yapar. lower(), büyük-küçük harfe bakmadan karşılaştırmak için yararlıdır: \"Привіт\" ile \"привіт\" farklı dizelerdir, ama lower() sonrasında aynı olurlar."
          },
          example: "word = \"Привіт\"\nprint(len(word))\nloud = word.upper()\nprint(loud)\nprint(word.lower())\nprint(word)\n",
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
            uk: "Текст, який вводить людина, майже завжди має зайве по краях: «   оля   » на екрані виглядає як «оля», але для Python це інший, довший рядок. w.strip() повертає той самий текст, почистивши його на початку та наприкінці від пробілів, табуляцій і розривів рядка; усередині нічого не зникає — «a b» так і лишається «a b». Якщо треба прибрати лише з одного боку, є w.lstrip() — зліва, і w.rstrip() — справа. Як і upper() та lower(), метод strip() не змінює початковий рядок w, тому чистий рядок беруть одразу в print() або зберігають у змінну. А найшвидше побачити, скільки сміття зникло, порівнявши довжини: len(w) і len(w.strip()) — різні числа.",
            en: "Text typed by a person almost always carries something at its edges: \"   оля   \" looks like «оля» on screen, but for Python it is a different, longer string. w.strip() returns the same text with spaces, tabs and line breaks cleaned off the beginning and the end; nothing inside disappears — \"a b\" stays \"a b\". When only one side is needed there is w.lstrip() (left) and w.rstrip() (right). Like upper() and lower(), the strip() method leaves the original string w unchanged, so you take the clean string right in print() or save it in a variable. And the quickest way to see how much junk went away is to compare the lengths: len(w) and len(w.strip()) are different numbers.",
            tr: "İnsanın yazdığı metnin kenarlarında neredeyse hep fazlalık vardır: \"   оля   \" ekranda «оля» gibi görünür ama Python için bu ayrı ve daha uzun bir dizedir. w.strip() aynı metni döndürür, yalnızca başındaki ve sonundaki boşlukları, sekmeleri ve satır sonlarını temizler; içeride hiçbir şey yok olmaz — \"a b\" yine \"a b\" olarak kalır. Sadece bir taraf gerekirse w.lstrip() (sol) ve w.rstrip() (sağ) var. upper() ve lower() gibi strip() metodu da özgün w dizesini değiştirmez; bu yüzden temiz diziyi ya doğrudan print() içinde kullanırsın ya da değişkene saklarsın. Ne kadar fazlalık gittiğini görmenin en hızlı yolu uzunlukları karşılaştırmak: len(w) ile len(w.strip()) farklı sayılardır."
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
          id: "cmp_equal",
          title: { uk: "Чи однакові? Порівняння ==", en: "Are they equal? Comparing with ==", tr: "Eşit mi? == ile karşılaştırma" },
          theory: {
            uk: "Уяви дві коробки з олівцями. Чи порівну в них олівців? Python теж уміє відповідати на такі запитання. Оператор == порівнює два значення й повертає True (істина, «так») або False (хиба, «ні»). print(3 == 3) виведе True, а print(3 == 5) — False.\n\nНе плутай = і ==! pencils = 5 — присвоєння: зберегти число 5 у змінній pencils. pencils == 5 — запитання: чи дорівнює її значення 5? Порівняння не змінює pencils. Відповідь можна зберегти: same = pencils == 5, а потім показати print(same). Тут один знак = зберігає результат перевірки, два знаки == виконують перевірку.\n\nРядки теж можна порівнювати: \"кіт\" == \"кіт\" дає True, а \"Кіт\" == \"кіт\" — False, бо регістр важливий. Число 5 і рядок \"5\" не рівні. input() повертає рядок, тому для порівняння цілих чисел читаємо їх через int(input()). Поки лише друкуємо відповіді True/False — умовний оператор вивчимо після порівнянь і логіки.",
            en: "Imagine two boxes of pencils. Do they contain the same number? Python can answer questions like this. The == operator compares two values and returns True (yes) or False (no). print(3 == 3) prints True, while print(3 == 5) prints False.\n\nDo not confuse = and ==! pencils = 5 is assignment: store the number 5 in pencils. pencils == 5 asks whether its value equals 5. Comparing does not change pencils. You can save the answer: same = pencils == 5, then display it with print(same). Here one = stores the result of the check; two signs == perform the check.\n\nStrings can be compared too: \"кіт\" == \"кіт\" gives True, but \"Кіт\" == \"кіт\" gives False because case matters. The number 5 and the string \"5\" are not equal. input() returns a string, so use int(input()) to read whole numbers for numeric comparisons. For now we only print True/False answers; choosing which commands to run comes after comparisons and logic.",
            tr: "İki kutu kalem düşün. İçlerinde eşit sayıda kalem var mı? Python da böyle soruları yanıtlayabilir. == operatörü iki değeri karşılaştırır ve True (doğru, evet) veya False (yanlış, hayır) döndürür. print(3 == 3) True, print(3 == 5) ise False yazdırır.\n\n= ile == işaretlerini karıştırma! pencils = 5 bir atamadır: pencils değişkeninde 5 sayısını saklar. pencils == 5 ise değerinin 5'e eşit olup olmadığını sorar. Karşılaştırma pencils değerini değiştirmez. Yanıtı same = pencils == 5 ile saklayıp print(same) ile gösterebilirsin. Burada tek = denetimin sonucunu saklar; çift == denetimi yapar.\n\nDizeler de karşılaştırılabilir: \"кіт\" == \"кіт\" True, \"Кіт\" == \"кіт\" ise False verir; büyük ve küçük harfler farklıdır. 5 sayısı ile \"5\" dizesi eşit değildir. input() dize döndürür, bu yüzden sayısal karşılaştırma için tam sayıları int(input()) ile okuruz. Şimdilik yalnızca True/False yanıtlarını yazdırıyoruz; hangi komutun çalışacağını seçmeyi karşılaştırmalar ve mantıktan sonra öğreneceğiz."
          },
          example: "pencils = 5\nprint(pencils == 5)\nprint(pencils == 3)\nprint(pencils)\nsame = pencils == 5\nprint(same)\nprint(\"кіт\" == \"Кіт\")\nprint(5 == \"5\")\n",
          task: {
            text: {
              uk: "У двох коробках a і b олівців. Прочитай два цілі невід'ємні числа, кожне з нового рядка. За допомогою == виведи True, якщо олівців порівну, або False, якщо ні. Друкуй результат порівняння, а не заготовлене слово.",
              en: "Two boxes contain a and b pencils. Read two nonnegative integers, one per line. Use == to print True when the counts are equal, or False otherwise. Print the comparison result, not a fixed word.",
              tr: "İki kutuda a ve b kalem var. Her satırdan bir tane olmak üzere negatif olmayan iki tam sayı oku. Sayılar eşitse True, değilse False yazdırmak için == kullan. Hazır bir sözcük değil, karşılaştırmanın sonucunu yazdır."
            },
            hint: {
              uk: "Після двох int(input()) напиши print(a == b). Один знак = у рядках вводу зберігає числа, а == усередині print() порівнює їх.",
              en: "After the two int(input()) calls, write print(a == b). A single = stores each input number; == inside print() compares them.",
              tr: "İki int(input()) çağrısından sonra print(a == b) yaz. Girdi satırlarındaki tek = sayıları saklar; print() içindeki == onları karşılaştırır."
            },
            starter: "a = int(input())\nb = int(input())\n",
            tests: [
              { in: "5\n5\n", out: "True" },
              { in: "3\n5\n", out: "False" },
              { in: "0\n0\n", out: "True" },
              { in: "12\n2\n", out: "False" }
            ]
          }
        },
        {
          id: "bool_values",
          title: { uk: "True, False і тип bool", en: "True, False and the bool type", tr: "True, False ve bool türü" },
          theory: {
            uk: "У попередньому уроці == відповідав на запитання: чи однакові два значення? Відповідь True означає «істина, так», а False — «хиба, ні». Це не повідомлення про помилку: False лише каже, що перевірене твердження хибне. Наприклад, 3 == 5 дає False, і програма працює правильно. Такі відповіді мають логічний тип bool. У нього лише два значення: True і False. bool — назва типу, а True та False — його значення.\n\nУяви запитання «Книжка в рюкзаку?». Можна записати відповідь прямо: has_book = True, а для «Книжка загубилася?» — is_lost = False. Пиши True і False з великої першої літери та без лапок. true і false — не ці логічні значення. Як числа й текст, логічне значення можна зберегти у змінній та показати через print(). Або отримати його зі знайомого порівняння: same = \"Казки\" == \"Казки\". Тут == обчислює відповідь True, а = зберігає її в same.\n\nФункція type() показує тип значення: print(type(same)) виведе <class 'bool'>. Поки читай це як «тип — bool»; слово class у такому записі розберемо пізніше. І True, і False мають однаковий тип bool, хоча відповіді різні.\n\nЛапки змінюють тип: False — логічне значення, а \"False\" — рядок типу str. print() показує їх однаково, проте type() допомагає відрізнити: type(False) — <class 'bool'>, type(\"False\") — <class 'str'>. input() завжди повертає рядок, навіть якщо ввести True або False. У практиці назвами книжок будуть рядки, а результатом їх порівняння — bool. Поки лише зберігаємо й друкуємо відповіді, без умовного оператора.",
            en: "In the previous lesson, == answered a question: are two values equal? True means 'yes, the statement is true', and False means 'no, it is false'. False is not an error message: it only says the statement you checked is false. For example, 3 == 5 gives False, and the program is working correctly. These answers have the Boolean type bool. It has only two values: True and False. bool is the type name; True and False are its values.\n\nImagine asking 'Is the book in my backpack?' You can write the answer directly: has_book = True, and for 'Is the book lost?' write is_lost = False. Write True and False with capital initials and no quotes. true and false are not these Boolean values. Like numbers and text, a Boolean value can be stored in a variable and displayed with print(). You can also get one from a familiar comparison: same = \"Казки\" == \"Казки\". Here == computes the answer True, and = stores it in same.\n\nThe type() function shows a value's type: print(type(same)) prints <class 'bool'>. For now, read this as 'the type is bool'; we will explore the word class later. Both True and False have the same bool type, even though their answers differ.\n\nQuotes change the type: False is a Boolean value, while \"False\" is a string of type str. print() displays them the same way, but type() tells them apart: type(False) is <class 'bool'>, and type(\"False\") is <class 'str'>. input() always returns a string, even if you enter True or False. In this practice, book titles are strings, while the result of comparing them is bool. For now, we only store and print answers, without an if statement.",
            tr: "Önceki derste == bir soruyu yanıtladı: iki değer eşit mi? True 'doğru, evet', False ise 'yanlış, hayır' anlamına gelir. False bir hata mesajı değildir; yalnızca denetlenen ifadenin yanlış olduğunu söyler. Örneğin 3 == 5, False verir ve program doğru çalışır. Bu yanıtların mantıksal türü bool'dur. Bu türün yalnızca iki değeri vardır: True ve False. bool türün adı, True ve False ise değerleridir.\n\n'Kitap çantamda mı?' sorusunu düşün. Yanıtı doğrudan has_book = True olarak, 'Kitap kayıp mı?' sorusunun yanıtını ise is_lost = False olarak yazabilirsin. True ve False büyük harfle başlar ve tırnaksız yazılır. true ve false bu mantıksal değerler değildir. Sayılar ve metinler gibi mantıksal bir değer de değişkende saklanıp print() ile gösterilebilir. Bildiğin karşılaştırmadan da elde edebilirsin: same = \"Казки\" == \"Казки\". Burada ==, True yanıtını hesaplar; = ise onu same değişkeninde saklar.\n\ntype() fonksiyonu bir değerin türünü gösterir: print(type(same)), <class 'bool'> yazdırır. Şimdilik bunu 'türü bool' diye oku; bu yazımdaki class sözcüğünü daha sonra inceleyeceğiz. True ve False farklı yanıtlar olsa da ikisinin türü bool'dur.\n\nTırnaklar türü değiştirir: False mantıksal bir değer, \"False\" ise str türünde bir dizedir. print() bunları aynı şekilde gösterir, ama type() ayırt etmeyi sağlar: type(False), <class 'bool'>; type(\"False\"), <class 'str'> verir. True veya False yazsan bile input() her zaman dize döndürür. Bu alıştırmada kitap adları dize, karşılaştırmanın sonucu ise bool olacak. Şimdilik if kullanmadan yanıtları saklayıp yazdırıyoruz."
          },
          example: "has_book = True\nis_lost = False\nprint(has_book)\nprint(is_lost)\nprint(type(has_book))\nprint(type(is_lost))\nsame = \"Казки\" == \"Казки\"\nprint(same)\nprint(type(same))\nword = \"False\"\nprint(word)\nprint(type(word))\nprint(False == word)\n",
          task: {
            text: {
              uk: "Прочитай два рядки: назву потрібної книжки expected та назву знайденої found. Збережи результат expected == found у змінній same. Виведи три рядки: значення same, його тип через type(same), тип введеної назви через type(found). Порівнюй назви точно, з урахуванням регістру й пробілів. Для однакових назв очікуємо True, <class 'bool'>, <class 'str'>; для різних зміниться лише перший рядок — на False. Не перетворюй результат порівняння на текст.",
              en: "Read two lines: the title of the book you need, expected, and the title of the book you found, found. Store expected == found in same. Print three lines: the value of same, its type using type(same), and the input title's type using type(found). Compare titles exactly, including case and spaces. Matching titles should produce True, <class 'bool'>, <class 'str'>; for different titles, only the first line changes to False. Do not convert the comparison result to text.",
              tr: "İki satır oku: aradığın kitabın adı expected ve bulduğun kitabın adı found. expected == found sonucunu same değişkeninde sakla. Üç satır yazdır: same değeri, type(same) ile türü ve type(found) ile girilen adın türü. Büyük-küçük harflere ve boşluklara dikkat ederek adları tam olarak karşılaştır. Aynı adlar için True, <class 'bool'>, <class 'str'> beklenir; farklı adlarda yalnızca ilk satır False olur. Karşılaştırmanın sonucunu metne dönüştürme."
            },
            hint: {
              uk: "Після вводу напиши same = expected == found, а далі print(same), print(type(same)) та print(type(found)) — кожну команду з нового рядка. same має тип bool, а found залишається рядком str, навіть якщо введено слово False.",
              en: "After reading the input, write same = expected == found, followed by print(same), print(type(same)) and print(type(found)), each on its own line. same has type bool, while found remains a string of type str, even if the entered word is False.",
              tr: "Girdiyi okuduktan sonra same = expected == found yaz. Ardından ayrı satırlarda print(same), print(type(same)) ve print(type(found)) yaz. same, bool türündedir; False sözcüğü girilse bile found, str türünde bir dize olarak kalır."
            },
            starter: "expected = input()\nfound = input()\n",
            tests: [
              { in: "Казки\nКазки\n", out: "True\n<class 'bool'>\n<class 'str'>" },
              { in: "Казки\nВірші\n", out: "False\n<class 'bool'>\n<class 'str'>" },
              { in: "Python\npython\n", out: "False\n<class 'bool'>\n<class 'str'>" },
              { in: "False\nFalse\n", out: "True\n<class 'bool'>\n<class 'str'>" },
              { in: "Казки\nКазки \n", out: "False\n<class 'bool'>\n<class 'str'>" }
            ]
          }
        },
        {
          id: "cmp_not_equal",
          title: { uk: "Чи відрізняються? Порівняння !=", en: "Are they different? Comparing with !=", tr: "Farklı mı? != ile karşılaştırma" },
          theory: {
            uk: "Двоє друзів обирають кольори для малюнка. Чи різні кольори вони взяли? Оператор != читається «не дорівнює»: він повертає True, коли значення різні, і False, коли однакові. print(4 != 7) дає True, а print(4 != 4) — False. Для тих самих двох значень != дає відповідь, протилежну ==. Знаки ! і = пишуться разом, без пробілу між ними.\n\nДля тексту важливі всі символи, зокрема регістр і пробіли: \"синій\" != \"Синій\" дає True. Якщо за правилами задачі регістр не важливий, можна спершу застосувати знайомий lower(). У цій практиці порівнюємо текст точно так, як його ввели, без перетворень. Порівняння лише відповідає на запитання, а не змінює кольори.",
            en: "Two friends choose colors for a drawing. Did they pick different colors? The != operator means 'not equal': it returns True for different values and False for equal ones. print(4 != 7) gives True; print(4 != 4) gives False. For the same two values, != gives the opposite answer to ==. Write ! and = together with no space between them.\n\nEvery character matters in text, including case and spaces: \"синій\" != \"Синій\" gives True. If a task says to ignore case, you can first use the familiar lower() method. In this practice, compare the text exactly as entered, without changes. Comparing only answers a question; it does not change the colors.",
            tr: "İki arkadaş resim için renk seçiyor. Farklı renkler mi seçtiler? != operatörü 'eşit değil' demektir: farklı değerler için True, eşit değerler için False döndürür. print(4 != 7) True, print(4 != 4) False verir. Aynı iki değer için !=, == ile zıt yanıt verir. ! ve = aralarında boşluk olmadan birlikte yazılır.\n\nMetindeki her karakter önemlidir; büyük-küçük harfler ve boşluklar da buna dahildir: \"синій\" != \"Синій\" True verir. Soruda harf büyüklüğünün önemsiz olduğu belirtilirse önce bildiğin lower() metodunu kullanabilirsin. Bu alıştırmada metni hiçbir değişiklik yapmadan, girildiği gibi karşılaştır. Karşılaştırma yalnızca soruyu yanıtlar, renkleri değiştirmez."
          },
          example: "first = \"синій\"\nsecond = \"жовтий\"\nprint(first != second)\nprint(first == second)\nprint(first != \"синій\")\nprint(\"синій\" != \"Синій\")\n",
          task: {
            text: {
              uk: "Прочитай два рядки з назвами кольорів. За допомогою != виведи True, якщо рядки відрізняються, і False, якщо однакові. Великі й малі літери вважаються різними; lower() і strip() тут не застосовуй.",
              en: "Read two lines containing color names. Use != to print True if the strings differ and False if they match. Uppercase and lowercase letters are different; do not use lower() or strip() here.",
              tr: "Renk adları içeren iki satır oku. Dizeler farklıysa True, aynıysa False yazdırmak için != kullan. Büyük ve küçük harfler farklı sayılır; burada lower() veya strip() kullanma."
            },
            hint: {
              uk: "Назви — це рядки, тому int() не потрібен. Після вводу напиши print(first != second).",
              en: "The names are strings, so no int() is needed. After reading them, write print(first != second).",
              tr: "Adlar dizedir, int() gerekmez. Girdiyi okuduktan sonra print(first != second) yaz."
            },
            starter: "first = input()\nsecond = input()\n",
            tests: [
              { in: "синій\nжовтий\n", out: "True" },
              { in: "red\nred\n", out: "False" },
              { in: "Blue\nblue\n", out: "True" },
              { in: "зелений\nзелений\n", out: "False" },
              { in: "red\nred \n", out: "True" }
            ]
          }
        },
        {
          id: "cmp_order",
          title: { uk: "Більше чи менше? Нерівності", en: "Greater or less? Inequalities", tr: "Büyük mü küçük mü? Eşitsizlikler" },
          theory: {
            uk: "Порівняй кількість наліпок у двох альбомах: < означає «менше», > — «більше», <= — «менше або дорівнює», >= — «більше або дорівнює». Гострий кінчик < чи > вказує на менше число: 3 < 5 і 5 > 3 дають True. Кожне порівняння знову повертає True або False.\n\nЗнак = біля нерівності дозволяє рівність. Якщо для атракціону потрібен зріст щонайменше 120 см, то height >= 120: рівно 120 підходить. height > 120 не пропустить значення 120. Саме на межі легко помилитися: 5 < 5 — False, а 5 <= 5 — True. Пиши <= і >=, а не =< чи =>, без пробілу між знаками.\n\nПорівнюємо числа, тому ввід перетворюємо через int(). Без цього Python порівнював би рядки: \"10\" < \"2\" дає True через порядок символів, хоча 10 < 2 дає False. Від'ємні числа теж порівнюються як на числовій прямій: -3 < -1 дає True.",
            en: "Compare sticker counts in two albums: < means 'less than', > means 'greater than', <= means 'less than or equal to', and >= means 'greater than or equal to'. The pointed end of < or > faces the smaller number: 3 < 5 and 5 > 3 give True. Each comparison again returns True or False.\n\nAdding = allows equality. If a ride requires a height of at least 120 cm, use height >= 120: exactly 120 qualifies. height > 120 would reject 120. Boundaries are easy to get wrong: 5 < 5 is False, but 5 <= 5 is True. Write <= and >=, not =< or =>, with no space between the signs.\n\nWe compare numbers, so convert input with int(). Otherwise Python would compare strings: \"10\" < \"2\" gives True because of character order, whereas 10 < 2 gives False. Negative numbers follow the number line too: -3 < -1 gives True.",
            tr: "İki albümdeki çıkartma sayılarını karşılaştır: < 'küçüktür', > 'büyüktür', <= 'küçük veya eşittir', >= 'büyük veya eşittir' demektir. < veya > işaretinin sivri ucu küçük sayıya bakar: 3 < 5 ve 5 > 3 True verir. Her karşılaştırma yine True veya False döndürür.\n\nEşitsizliğe = eklemek eşitliğe izin verir. Bir oyuncak için en az 120 cm boy gerekiyorsa height >= 120 kullanılır: tam 120 de uygundur. height > 120 ise 120'yi kabul etmez. Sınırda hata yapmak kolaydır: 5 < 5 False, 5 <= 5 True olur. =< veya => değil, <= ve >= yaz; işaretlerin arasında boşluk bırakma.\n\nSayıları karşılaştırıyoruz, bu yüzden girdiyi int() ile dönüştürürüz. Yoksa Python dizeleri karşılaştırır: karakter sırası nedeniyle \"10\" < \"2\" True verir, ama 10 < 2 False verir. Negatif sayılar da sayı doğrusuna göre karşılaştırılır: -3 < -1 True verir."
          },
          example: "height = 120\nprint(height > 120)\nprint(height >= 120)\nprint(3 < 5)\nprint(5 <= 5)\nprint(-3 < -1)\nprint(10 < 2)\nprint(\"10\" < \"2\")\n",
          task: {
            text: {
              uk: "Прочитай два цілі числа a і b. Виведи чотири результати, кожен з нового рядка, саме в такому порядку: a < b, a > b, a <= b, a >= b. Числа можуть бути рівними або від'ємними.",
              en: "Read two integers a and b. Print four results, one per line, in this exact order: a < b, a > b, a <= b, a >= b. The numbers may be equal or negative.",
              tr: "a ve b adlı iki tam sayı oku. Sonuçları tam bu sırayla, ayrı satırlarda yazdır: a < b, a > b, a <= b, a >= b. Sayılar eşit veya negatif olabilir."
            },
            hint: {
              uk: "Використай чотири print(): print(a < b), потім >, <= і >=. Для рівних чисел перші дві відповіді False, а останні дві True.",
              en: "Use four print() calls: print(a < b), then >, <= and >=. For equal numbers the first two answers are False and the last two are True.",
              tr: "Dört print() çağrısı kullan: print(a < b), ardından >, <= ve >=. Eşit sayılarda ilk iki yanıt False, son ikisi True olur."
            },
            starter: "a = int(input())\nb = int(input())\n",
            tests: [
              { in: "3\n5\n", out: "True\nFalse\nTrue\nFalse" },
              { in: "5\n5\n", out: "False\nFalse\nTrue\nTrue" },
              { in: "10\n2\n", out: "False\nTrue\nFalse\nTrue" },
              { in: "-3\n-1\n", out: "True\nFalse\nTrue\nFalse" },
              { in: "0\n0\n", out: "False\nFalse\nTrue\nTrue" }
            ]
          }
        },
        {
          id: "logic_and",
          title: { uk: "and: потрібні обидві умови", en: "and: both conditions are needed", tr: "and: iki koşul da gerekli" },
          theory: {
            uk: "На вигаданий атракціон пускають дітей від 8 років із квитком. Самого віку замало, самого квитка теж: потрібні і відповідний вік, і квиток. Оператор and означає «і». Для двох логічних значень результат True лише тоді, коли обидва True: True and True → True; True and False → False; False and True → False; False and False → False.\n\nЗапишемо правило: age >= 8 and ticket == 1. Перша перевірка запитує про вік, друга — про квиток. У нашому вводі 1 означає «є квиток», 0 — «немає». Порівняння ticket == 1 перетворює цю позначку на True/False. Кожну перевірку записуй повністю: age >= 8 and ticket == 1, а не age >= 8 and 1.\n\nРезультат можна зберегти в can_ride і надрукувати. Це поки лише відповідь «так/ні», без вибору команд. and пишеться маленькими англійськими літерами; слово «і» в Python його не замінює.",
            en: "An imaginary ride admits children aged 8 or older who have a ticket. Age alone is not enough, and neither is a ticket: both are required. The and operator means both conditions must hold. For two Boolean values the result is True only when both are True: True and True → True; True and False → False; False and True → False; False and False → False.\n\nWrite the rule as age >= 8 and ticket == 1. The first check asks about age, the second about the ticket. Our input uses 1 for 'has a ticket' and 0 for 'no ticket'. Comparing ticket == 1 turns that marker into True/False. Write each check in full: age >= 8 and ticket == 1, not age >= 8 and 1.\n\nYou can save the result in can_ride and print it. For now this is only a yes/no answer, not a choice of commands. Write and in lowercase English letters.",
            tr: "Hayalî bir oyuncağa 8 yaş ve üzerindeki biletli çocuklar binebilir. Yalnızca yaş yeterli değildir, yalnızca bilet de yetmez: ikisi de gerekir. and operatörü 've' demektir. İki mantıksal değer için sonuç yalnızca ikisi de True olduğunda True olur: True and True → True; True and False → False; False and True → False; False and False → False.\n\nKuralı age >= 8 and ticket == 1 olarak yazalım. İlk denetim yaşı, ikincisi bileti sorar. Girdimizde 1 'bilet var', 0 'bilet yok' demektir. ticket == 1 karşılaştırması bu işareti True/False değerine dönüştürür. Her denetimi tam yaz: age >= 8 and ticket == 1; age >= 8 and 1 değil.\n\nSonucu can_ride değişkeninde saklayıp yazdırabilirsin. Şimdilik bu yalnızca evet/hayır yanıtıdır, çalışacak komutları seçmez. and küçük İngilizce harflerle yazılır; Türkçe 've' onun yerine geçmez."
          },
          example: "age = 8\nticket = 1\ncan_ride = age >= 8 and ticket == 1\nprint(can_ride)\nprint(True and False)\nprint(False and True)\nprint(False and False)\n",
          task: {
            text: {
              uk: "Прочитай вік age і позначку ticket (1 — є квиток, 0 — немає), кожне число з нового рядка. Виведи результат перевірки через and: True, якщо дитині щонайменше 8 років і є квиток; інакше False. Рівно 8 років підходить.",
              en: "Read age and ticket (1 means a ticket is present, 0 means absent), one number per line. Use and to print True if the child is at least 8 and has a ticket, or False otherwise. Exactly 8 qualifies.",
              tr: "age ve ticket değerlerini ayrı satırlardan oku (1: bilet var, 0: yok). Çocuk en az 8 yaşındaysa ve bileti varsa and kullanarak True, aksi halde False yazdır. Tam 8 yaş da uygundur."
            },
            hint: {
              uk: "print(age >= 8 and ticket == 1). Перевірки мають бути істинними одночасно.",
              en: "print(age >= 8 and ticket == 1). Both checks must be true together.",
              tr: "print(age >= 8 and ticket == 1). İki denetim de aynı anda doğru olmalı."
            },
            starter: "age = int(input())\nticket = int(input())\n",
            tests: [
              { in: "8\n1\n", out: "True" },
              { in: "8\n0\n", out: "False" },
              { in: "7\n1\n", out: "False" },
              { in: "7\n0\n", out: "False" },
              { in: "12\n1\n", out: "True" },
              { in: "12\n0\n", out: "False" }
            ]
          }
        },
        {
          id: "logic_or",
          title: { uk: "or: достатньо хоча б однієї умови", en: "or: at least one condition is enough", tr: "or: en az bir koşul yeterli" },
          theory: {
            uk: "Щоб намалювати листівку, достатньо мати олівці або фломастери. Є тільки олівці — можна малювати. Тільки фломастери — теж можна. Є і те, й інше — чудово, теж можна! Оператор or означає «або»: для двох логічних значень він дає True, коли хоча б одне True. Це НЕ правило «тільки щось одне».\n\nУсі варіанти: True or True → True; True or False → True; False or True → True; False or False → False. Отже, or дає False лише тоді, коли обидві перевірки хибні. На відміну від and, не вимагає виконання обох умов.\n\nЯкщо 1 означає «є», а 0 — «немає», правило має вигляд pencils == 1 or markers == 1. Записуй порівняння по обидва боки or повністю. Наприклад, для перевірки двох можливих чисел треба n == 1 or n == 2, а не n == 1 or 2.",
            en: "To draw a card, having pencils or markers is enough. Only pencils? You can draw. Only markers? You can draw too. Both? Great, that also works! For two Boolean values, or gives True when at least one is True. It does NOT mean 'exactly one'.\n\nAll possibilities: True or True → True; True or False → True; False or True → True; False or False → False. So or gives False only when both checks are false. Unlike and, it does not require both conditions.\n\nIf 1 means 'present' and 0 means 'absent', the rule is pencils == 1 or markers == 1. Write the full comparison on each side of or. For example, checking two possible numbers needs n == 1 or n == 2, not n == 1 or 2.",
            tr: "Bir kart çizmek için kalem veya keçeli kalem olması yeterlidir. Yalnızca kalem var mı? Çizebilirsin. Yalnızca keçeli kalem mi? Yine çizebilirsin. İkisi de mi var? Harika, bu da olur! or operatörü 'veya' demektir: iki mantıksal değerden en az biri True ise True verir. 'Yalnızca biri' anlamına GELMEZ.\n\nTüm olasılıklar: True or True → True; True or False → True; False or True → True; False or False → False. Yani or yalnızca iki denetim de yanlış olduğunda False verir. and operatörünün aksine ikisini birden gerektirmez.\n\n1 'var', 0 'yok' anlamındaysa kural pencils == 1 or markers == 1 olur. or işaretinin iki tarafındaki karşılaştırmaları tam yaz. Örneğin iki olası sayıyı denetlemek için n == 1 or n == 2 gerekir; n == 1 or 2 değil."
          },
          example: "pencils = 1\nmarkers = 0\ncan_draw = pencils == 1 or markers == 1\nprint(can_draw)\nprint(True or True)\nprint(False or True)\nprint(False or False)\n",
          task: {
            text: {
              uk: "Прочитай дві позначки: pencils і markers, кожну з нового рядка (1 — є, 0 — немає). За допомогою or виведи True, якщо є хоча б олівці або фломастери. Якщо є обидва набори, відповідь теж True; якщо немає жодного — False.",
              en: "Read pencils and markers, one per line (1 means present, 0 means absent). Use or to print True if at least one set is available. Both sets also give True; neither gives False.",
              tr: "pencils ve markers değerlerini ayrı satırlardan oku (1: var, 0: yok). En az bir takım varsa or ile True yazdır. İkisi de varsa yine True; hiçbiri yoksa False olmalı."
            },
            hint: {
              uk: "print(pencils == 1 or markers == 1). Випадок 1 і 1 також має дати True.",
              en: "print(pencils == 1 or markers == 1). The 1 and 1 case must also give True.",
              tr: "print(pencils == 1 or markers == 1). 1 ve 1 durumu da True vermeli."
            },
            starter: "pencils = int(input())\nmarkers = int(input())\n",
            tests: [
              { in: "1\n0\n", out: "True" },
              { in: "0\n1\n", out: "True" },
              { in: "1\n1\n", out: "True" },
              { in: "0\n0\n", out: "False" }
            ]
          }
        },
        {
          id: "logic_not",
          title: { uk: "not: навпаки", en: "not: the opposite", tr: "not: tam tersi" },
          theory: {
            uk: "Запитання «Іде дощ?» і «Дощу немає?» мають протилежні відповіді. Оператор not означає «не» й перевертає логічне значення: not True → False, not False → True. На відміну від and та or, йому потрібне лише одне значення праворуч.\n\nНехай rain дорівнює 1, коли йде дощ, і 0, коли його немає. raining = rain == 1 зберігає відповідь на запитання «Іде дощ?». Тоді dry = not raining відповідає «Дощу немає?». Можна й одним виразом: not (rain == 1). Дужки чітко показують, яку перевірку заперечуємо.\n\nСам not не змінює змінну raining: результат треба надрукувати або зберегти. not raining заперечує готове логічне значення, а rain != 1 порівнює два значення на нерівність; у нашому прикладі відповіді збігаються. У Python пишемо not, а не окремий знак !.",
            en: "'Is it raining?' and 'Is it not raining?' have opposite answers. The not operator flips a Boolean value: not True → False, not False → True. Unlike and and or, it needs only one value on its right.\n\nLet rain be 1 when it is raining and 0 otherwise. raining = rain == 1 saves the answer to 'Is it raining?'. Then dry = not raining answers 'Is it not raining?'. You can also write not (rain == 1). The parentheses clearly show which check is being negated.\n\nnot alone does not change raining: print or save its result. not raining negates a Boolean value, while rain != 1 compares two values for inequality; their answers match in this example. In Python write not, not a standalone !.",
            tr: "'Yağmur yağıyor mu?' ve 'Yağmur yağmıyor mu?' sorularının yanıtları birbirinin tersidir. not operatörü 'değil' demektir ve mantıksal değeri tersine çevirir: not True → False, not False → True. and ve or operatörlerinden farklı olarak sağında yalnızca bir değer gerekir.\n\nYağmur yağarken rain 1, yağmıyorken 0 olsun. raining = rain == 1, 'Yağmur yağıyor mu?' yanıtını saklar. dry = not raining ise 'Yağmur yağmıyor mu?' sorusunu yanıtlar. Tek ifadeyle not (rain == 1) de yazabilirsin. Parantezler hangi denetimin tersinin alındığını açıkça gösterir.\n\nnot tek başına raining değişkenini değiştirmez: sonucu yazdırmak veya saklamak gerekir. not raining hazır bir mantıksal değeri tersine çevirir; rain != 1 ise iki değerin eşit olmadığını denetler. Bu örnekte yanıtları aynıdır. Python'da tek başına ! değil, not yazılır."
          },
          example: "rain = 0\nraining = rain == 1\ndry = not raining\nprint(raining)\nprint(dry)\nprint(not True)\nprint(not False)\n",
          task: {
            text: {
              uk: "Прочитай rain: 1 означає, що дощ іде, 0 — що дощу немає. Використай not і виведи True, якщо дощу немає, або False, якщо він іде. Ввід завжди 0 або 1.",
              en: "Read rain: 1 means it is raining, 0 means it is not. Use not to print True when it is not raining, or False when it is. Input is always 0 or 1.",
              tr: "rain değerini oku: 1 yağmur yağıyor, 0 yağmıyor demektir. not kullanarak yağmur yoksa True, varsa False yazdır. Girdi her zaman 0 veya 1 olur."
            },
            hint: {
              uk: "Спершу raining = rain == 1, потім print(not raining). Або одразу print(not (rain == 1)).",
              en: "First write raining = rain == 1, then print(not raining). Or use print(not (rain == 1)) directly.",
              tr: "Önce raining = rain == 1, sonra print(not raining) yaz. Ya da doğrudan print(not (rain == 1)) kullan."
            },
            starter: "rain = int(input())\n",
            tests: [
              { in: "0\n", out: "True" },
              { in: "1\n", out: "False" }
            ]
          }
        },
        {
          id: "logic_combo",
          title: { uk: "Разом: and, or, not і дужки", en: "Together: and, or, not and parentheses", tr: "Birlikte: and, or, not ve parantezler" },
          theory: {
            uk: "Домовмося про гру надворі: граємо, коли сьогодні вихідний або канікули, і при цьому немає дощу. Тут одразу три знайомі оператори. Нехай weekend, holiday та rain — позначки 0 або 1. Вираз (weekend == 1 or holiday == 1) and not (rain == 1) спершу об'єднує два приводи для відпочинку, а потім вимагає відсутності дощу.\n\nДужки — як коробочки для окремих думок. Можна розкласти правило на кроки: free_day = weekend == 1 or holiday == 1; dry = not (rain == 1); can_play = free_day and dry. Напиши кожне присвоєння з нового рядка. На вихідних без дощу можна грати. Під час канікул без дощу теж можна. Якщо є дощ, наше правило не дозволяє гру навіть у вихідний.\n\nБез дужок пріоритет такий: порівняння, потім not, потім and, потім or. Тому True or False and False дає True, а (True or False) and False — False. Забуті дужки у правилі weekend == 1 or holiday == 1 and not (rain == 1) дозволили б гру в будь-який вихідний, навіть дощовий! Явно групуй умови. Тепер уміємо отримувати відповідь True/False; наступний урок покаже, як за нею обрати дію за допомогою if.",
            en: "Let's agree on a rule for playing outside: it must be a weekend or a school holiday, and it must not be raining. This uses all three operators. Let weekend, holiday and rain be 0/1 markers. The expression (weekend == 1 or holiday == 1) and not (rain == 1) groups the two reasons for a free day, then requires no rain.\n\nParentheses are like boxes for separate thoughts. Split the rule into steps: free_day = weekend == 1 or holiday == 1; dry = not (rain == 1); can_play = free_day and dry. Write each assignment on a new line. A dry weekend allows play. A dry school holiday does too. When it rains, our rule rejects playing even on a weekend.\n\nWithout parentheses, precedence is: comparisons, then not, then and, then or. So True or False and False gives True, but (True or False) and False gives False. Missing parentheses in weekend == 1 or holiday == 1 and not (rain == 1) would allow any weekend, even a rainy one! Group conditions explicitly. Now we can produce a True/False answer; the next lesson shows how to choose an action with if.",
            tr: "Dışarıda oynamak için bir kural koyalım: hafta sonu veya okul tatili olmalı ve yağmur yağmamalı. Burada üç operatörü de kullanıyoruz. weekend, holiday ve rain, 0/1 işaretleri olsun. (weekend == 1 or holiday == 1) and not (rain == 1) ifadesi önce boş günün iki nedenini gruplar, ardından yağmur olmamasını gerektirir.\n\nParantezler ayrı düşünceler için kutular gibidir. Kuralı adımlara ayırabilirsin: free_day = weekend == 1 or holiday == 1; dry = not (rain == 1); can_play = free_day and dry. Her atamayı yeni satıra yaz. Yağmursuz hafta sonunda oynanabilir. Yağmursuz okul tatilinde de oynanabilir. Yağmur varsa kuralımız hafta sonunda bile oynamaya izin vermez.\n\nParantez yoksa öncelik sırası şöyledir: karşılaştırmalar, sonra not, sonra and, sonra or. Bu yüzden True or False and False True verir, ama (True or False) and False False verir. weekend == 1 or holiday == 1 and not (rain == 1) kuralındaki eksik parantezler yağmurlu hafta sonunda bile oynamaya izin verirdi! Koşulları açıkça grupla. Artık True/False yanıtı üretebiliyoruz; sonraki ders if ile bu yanıta göre eylem seçmeyi gösterecek."
          },
          example: "weekend = 1\nholiday = 0\nrain = 1\nfree_day = weekend == 1 or holiday == 1\ndry = not (rain == 1)\ncan_play = free_day and dry\nprint(can_play)\nprint((weekend == 1 or holiday == 1) and not (rain == 1))\nprint(True or False and False)\nprint((True or False) and False)\n",
          task: {
            text: {
              uk: "Прочитай weekend, holiday і rain — три числа, кожне з нового рядка: 1 означає «так», 0 — «ні». Виведи True, якщо сьогодні вихідний або канікули і водночас немає дощу; інакше False. Поєднай or, and та not. Дощ має забороняти гру в усіх випадках.",
              en: "Read weekend, holiday and rain: three numbers, one per line, where 1 means yes and 0 means no. Print True if it is a weekend or a school holiday and there is no rain; otherwise False. Combine or, and and not. Rain must prevent playing in every case.",
              tr: "weekend, holiday ve rain değerlerini ayrı satırlardan oku: 1 evet, 0 hayır demektir. Hafta sonu veya okul tatiliyse ve aynı zamanda yağmur yoksa True, aksi halde False yazdır. or, and ve not kullan. Yağmur her durumda oynamayı engellemeli."
            },
            hint: {
              uk: "print((weekend == 1 or holiday == 1) and not (rain == 1)). Дужки навколо or потрібні, щоб вимога «немає дощу» стосувалася обох видів вільного дня.",
              en: "print((weekend == 1 or holiday == 1) and not (rain == 1)). Parentheses around or make the no-rain requirement apply to both kinds of free day.",
              tr: "print((weekend == 1 or holiday == 1) and not (rain == 1)). or çevresindeki parantezler yağmursuzluk şartının iki tür boş güne de uygulanmasını sağlar."
            },
            starter: "weekend = int(input())\nholiday = int(input())\nrain = int(input())\n",
            tests: [
              { in: "1\n0\n0\n", out: "True" },
              { in: "0\n1\n0\n", out: "True" },
              { in: "1\n1\n0\n", out: "True" },
              { in: "0\n0\n0\n", out: "False" },
              { in: "1\n0\n1\n", out: "False" },
              { in: "0\n1\n1\n", out: "False" },
              { in: "1\n1\n1\n", out: "False" },
              { in: "0\n0\n1\n", out: "False" }
            ]
          }
        }
      ]
    },
    {
      chapter: { uk: "Умовний оператор", en: "Conditional statements", tr: "Koşullu komutlar" },
      lessons: [
        {
          id: "if_basic",
          title: { uk: "Якщо: перший if", en: "If: choosing an action", tr: "Eğer: ilk if" },
          theory: {
            uk: "Першу частину завершено: ти вже знаєш основи Python, порівняння та логічні оператори. Тепер навчимо програму обирати дію. У грі бонус дають, якщо набрано щонайменше 10 очок. Раніше print(score >= 10) лише показував True або False. Умовний оператор if використовує цю відповідь, щоб вирішити, чи виконувати команду.\n\nЗапис if score >= 10: читаємо «якщо score не менше 10». Наприкінці ставимо двокрапку. Наступний рядок print(\"bonus\") зсуваємо вправо на 4 пробіли — так він належить до if. Якщо умова True, Python виконає цей рядок; якщо False — пропустить. if сам не друкує True або False: він керує виконанням команд.\n\nКоманда print(\"finish\") без відступу вже не належить до if. У цьому прикладі вона виконається за будь-якої відповіді на перевірку. Для score = 10 побачимо bonus, а потім finish; для score = 9 — лише finish. else поки не потрібен: одного if достатньо, коли дію треба або виконати, або пропустити. Далі докладніше розберемо групи команд — блоки.",
            en: "The first part is complete: you know Python basics, comparisons and logical operators. Now we will teach a program to choose an action. In a game, a bonus requires at least 10 points. Previously, print(score >= 10) only displayed True or False. The if statement uses that answer to decide whether to run a command.\n\nRead if score >= 10: as 'if score is at least 10'. Put a colon at the end. Indent the next line, print(\"bonus\"), by 4 spaces so it belongs to if. When the condition is True, Python runs that line; when it is False, Python skips it. if does not print True or False itself: it controls which commands run.\n\nThe unindented print(\"finish\") is no longer part of if. In this example, it runs regardless of the answer to the check. With score = 10 we see bonus, then finish; with score = 9 we see only finish. We do not need else yet: a single if is enough when an action should either run or be skipped. Next we will explore groups of commands called blocks.",
            tr: "İlk bölüm tamamlandı: Python temellerini, karşılaştırmaları ve mantıksal operatörleri biliyorsun. Şimdi programa eylem seçmeyi öğreteceğiz. Bir oyunda bonus için en az 10 puan gerekiyor. Önceden print(score >= 10) yalnızca True veya False gösteriyordu. if komutu bu yanıtı kullanarak bir komutun çalışıp çalışmayacağına karar verir.\n\nif score >= 10: satırını 'score en az 10 ise' diye oku. Sonuna iki nokta koy. Sonraki print(\"bonus\") satırını 4 boşluk girintile; böylece if'e ait olur. Koşul True ise Python bu satırı çalıştırır, False ise atlar. if kendi başına True veya False yazdırmaz; komutların çalışmasını yönetir.\n\nGirintisiz print(\"finish\") artık if'e ait değildir. Bu örnekte denetimin yanıtından bağımsız olarak çalışır. score = 10 için önce bonus, sonra finish; score = 9 için yalnızca finish görürüz. Henüz else gerekmez: bir eylem ya yapılacak ya atlanacaksa tek if yeterlidir. Sonraki derste blok denen komut gruplarını inceleyeceğiz."
          },
          example: "score = 10\nif score >= 10:\n    print(\"bonus\")\nprint(\"finish\")\n",
          task: {
            text: {
              uk: "Прочитай цілу невід'ємну кількість очок score. Якщо score >= 10, виведи bonus. Після перевірки за будь-якої кількості очок виведи finish. Кожне слово — з нового рядка. Використай if без else: для 9 очок має бути лише finish, а для 10 — bonus і finish.",
              en: "Read a nonnegative integer score. If score >= 10, print bonus. After the check, print finish for every score. Put each word on its own line. Use if without else: 9 points should produce only finish; 10 points should produce bonus and finish.",
              tr: "Negatif olmayan bir tam sayı olan score değerini oku. score >= 10 ise bonus yazdır. Denetimden sonra her puan için finish yazdır. Her sözcük ayrı satırda olsun. else olmadan if kullan: 9 puanda yalnızca finish, 10 puanda bonus ve finish çıkmalı."
            },
            hint: {
              uk: "Після if score >= 10: постав print(\"bonus\") з відступом 4 пробіли. Наступний print(\"finish\") напиши без відступу, на одному рівні з if.",
              en: "After if score >= 10:, indent print(\"bonus\") by 4 spaces. Write the following print(\"finish\") without indentation, aligned with if.",
              tr: "if score >= 10: satırından sonra print(\"bonus\") komutunu 4 boşluk girintile. Sonraki print(\"finish\") komutunu girintisiz, if ile aynı hizada yaz."
            },
            starter: "score = int(input())\n",
            tests: [
              { in: "0\n", out: "finish" },
              { in: "9\n", out: "finish" },
              { in: "10\n", out: "bonus\nfinish" },
              { in: "11\n", out: "bonus\nfinish" },
              { in: "25\n", out: "bonus\nfinish" }
            ]
          }
        },
        {
          id: "if_blocks",
          title: { uk: "Блоки: відступи мають значення", en: "Blocks: indentation matters", tr: "Bloklar: girintiler önemlidir" },
          theory: {
            uk: "Блок — це група команд, що належать до однієї конструкції. Під if можна записати не одну, а кілька команд: коли умова True, увесь його блок виконується згори вниз; коли False — увесь пропускається. Наприклад, якщо температура не вища за 0, беремо і шапку, і шарф. Обидві команди мають належати до тієї самої перевірки.\n\nPython бачить межі блоку за відступами, а не за фігурними дужками. У цьому курсі додаємо 4 пробіли на кожний рівень вкладеності — це звичний стиль Python. Важлива узгодженість: команди одного рівня вирівнюємо однаково. Не змішуй табуляцію та пробіли; використовуй пробіли. Двокрапка після if починає блок, а повернення до попереднього рівня відступу завершує його.\n\nУ прикладі print(\"hat\") та print(\"scarf\") стоять з однаковим відступом. print(\"ready\") повертається на рівень if, тому виконується незалежно від температури. Якщо випадково прибрати відступ перед scarf, Python може не показати помилки, але шарф друкуватиметься навіть у теплу погоду — зміниться зміст програми.\n\nЯкщо після двокрапки зовсім немає команди з відступом, отримаємо IndentationError. Зайвий відступ без початку нового блоку теж може бути помилкою. Відступ — це не просто краса: він показує, які команди об'єднані та коли їх виконувати.",
            en: "A block is a group of commands belonging to one construct. An if can contain several commands: when its condition is True, the entire block runs from top to bottom; when it is False, the entire block is skipped. For example, when the temperature is at most 0, we take both a hat and a scarf. Both commands must belong to the same check.\n\nPython identifies block boundaries using indentation, not curly braces. In this course we add 4 spaces per nesting level, the usual Python style. Consistency matters: align commands at the same level equally. Do not mix tabs and spaces; use spaces. The colon after if starts a block, and returning to the previous indentation level ends it.\n\nIn the example, print(\"hat\") and print(\"scarf\") have the same indentation. print(\"ready\") returns to the level of if, so it runs regardless of temperature. If you accidentally remove the indentation before scarf, Python may report no error, but scarf will print even in warm weather: the program's meaning has changed.\n\nIf no indented command follows the colon, you get IndentationError. Extra indentation without a new block can also be an error. Indentation is not just decoration: it shows which commands form a group and when they should run.",
            tr: "Blok, aynı yapıya ait komutlar grubudur. Bir if altında birden fazla komut olabilir: koşul True ise bütün blok yukarıdan aşağıya çalışır; False ise tamamı atlanır. Örneğin sıcaklık en fazla 0 ise hem şapka hem atkı alırız. İki komut da aynı denetime ait olmalı.\n\nPython blok sınırlarını süslü parantezlerle değil, girintilerle belirler. Bu kursta her iç içe geçme düzeyi için 4 boşluk ekliyoruz; bu Python'da yaygın bir yazım biçimidir. Tutarlılık önemlidir: aynı düzeydeki komutları aynı hizada yaz. Sekmeleri ve boşlukları karıştırma; boşluk kullan. if sonundaki iki nokta bloğu başlatır, önceki girinti düzeyine dönmek bloğu bitirir.\n\nÖrnekte print(\"hat\") ile print(\"scarf\") aynı girintidedir. print(\"ready\") if ile aynı düzeye döner, bu yüzden sıcaklıktan bağımsız çalışır. scarf önündeki girintiyi yanlışlıkla kaldırırsan Python hata vermeyebilir; ama sıcak havada bile scarf yazdırılır, yani programın anlamı değişir.\n\nİki noktadan sonra girintili bir komut yoksa IndentationError oluşur. Yeni bir blok başlamadan fazladan girinti yapmak da hata olabilir. Girinti yalnızca görüntü için değildir; hangi komutların bir grup olduğunu ve ne zaman çalışacağını gösterir."
          },
          example: "temperature = 0\nif temperature <= 0:\n    print(\"hat\")\n    print(\"scarf\")\nprint(\"ready\")\n",
          task: {
            text: {
              uk: "Прочитай цілу температуру temperature. Якщо вона не вища за 0, в одному блоці if виведи спочатку hat, потім scarf, кожне з нового рядка. Після блоку завжди виводь ready. За додатної температури потрібен лише рядок ready. Перевір відступи обох команд усередині блоку.",
              en: "Read an integer temperature. If it is at most 0, use one if block to print hat, then scarf, each on its own line. Always print ready after the block. A positive temperature should produce only ready. Check the indentation of both commands inside the block.",
              tr: "Bir tam sayı olan temperature değerini oku. En fazla 0 ise tek bir if bloğunda önce hat, sonra scarf yazdır; her biri ayrı satırda olsun. Bloktan sonra her zaman ready yazdır. Pozitif sıcaklıkta yalnızca ready çıkmalı. Blok içindeki iki komutun da girintisini kontrol et."
            },
            hint: {
              uk: "Умова — if temperature <= 0:. Обидва print() для hat і scarf зсунь на 4 пробіли. print(\"ready\") постав без відступу: він уже поза блоком.",
              en: "Use if temperature <= 0:. Indent both print() calls for hat and scarf by 4 spaces. Leave print(\"ready\") unindented: it is outside the block.",
              tr: "Koşul if temperature <= 0: olmalı. hat ve scarf için iki print() çağrısını da 4 boşluk girintile. print(\"ready\") girintisiz olsun; bloğun dışındadır."
            },
            starter: "temperature = int(input())\n",
            tests: [
              { in: "-5\n", out: "hat\nscarf\nready" },
              { in: "0\n", out: "hat\nscarf\nready" },
              { in: "1\n", out: "ready" },
              { in: "20\n", out: "ready" }
            ]
          }
        },
        {
          id: "if",
          title: { uk: "Інакше: else", en: "Otherwise: else", tr: "Aksi halde: else" },
          theory: {
            uk: "Один if або виконує блок, або пропускає його. А якщо потрібна інша дія, коли умова хибна? Для цього є else — «інакше». Уяви: якщо надворі дощ — беремо парасолю, інакше — виходимо без неї. У парі if/else виконується рівно одна гілка: блок if за True або блок else за False.\n\nПиши if та else на одному рівні відступу. Після обох потрібна двокрапка, а команди кожної гілки мають відступ 4 пробіли. Після else не пишемо умову: else: уже означає всі випадки, що не підійшли до if. Код після обох блоків на початковому рівні знову є спільним продовженням.\n\nУ прикладі if n > 0: відокремлює додатні числа. Решта — це нуль і від'ємні числа, тому else не означає лише «від'ємне». Для n = 0 порівняння 0 > 0 дає False, тож виконається else. Перевіряй обидві гілки й значення на межі. Знайома практика тепер закріплює саме вибір між двома діями.",
            en: "A single if either runs its block or skips it. What if a false condition needs a different action? Use else, meaning 'otherwise'. Imagine: if it is raining, take an umbrella; otherwise, go without it. An if/else pair runs exactly one branch: the if block for True or the else block for False.\n\nAlign if and else at the same indentation level. Both need a colon, and each branch's commands are indented by 4 spaces. Do not put a condition after else: else: already covers every case that did not match if. Code after both blocks, back at the original level, is the shared continuation.\n\nIn the example, if n > 0: selects positive numbers. The remaining numbers include zero and negatives, so else does not mean only 'negative'. With n = 0, the comparison 0 > 0 is False, so else runs. Test both branches and the boundary value. This familiar practice now reinforces choosing between two actions.",
            tr: "Tek if ya bloğunu çalıştırır ya da atlar. Peki koşul yanlış olduğunda başka bir eylem gerekiyorsa? Bunun için 'aksi halde' anlamına gelen else vardır. Yağmur varsa şemsiye almayı, yoksa şemsiyesiz çıkmayı düşün. if/else çiftinde tam bir dal çalışır: True için if bloğu, False için else bloğu.\n\nif ve else aynı girinti düzeyinde olmalı. İkisinin sonunda da iki nokta bulunmalı; her dalın komutları 4 boşluk girintili olmalı. else sonrasına koşul yazma: else: zaten if'e uymayan bütün durumları kapsar. İki bloktan sonra başlangıç düzeyine dönen kod, ortak devam bölümüdür.\n\nÖrnekte if n > 0: pozitif sayıları seçer. Geriye sıfır ve negatif sayılar kalır; else yalnızca 'negatif' demek değildir. n = 0 için 0 > 0 karşılaştırması False olur ve else çalışır. İki dalı da sınır değeriyle birlikte dene. Bildiğin bu alıştırma artık iki eylem arasında seçim yapmayı pekiştiriyor."
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
          id: "if_elif",
          title: { uk: "Кілька варіантів: elif", en: "Several choices: elif", tr: "Birden çok seçenek: elif" },
          theory: {
            uk: "Не кожен вибір має лише два варіанти. У грі за 90 або більше очок дають золоту медаль, за 60–89 — срібну, а за меншу кількість — бронзову. Тут допоможе elif: це скорочення від else if, тобто «інакше, якщо». Після if можна додати одну або кілька перевірок elif, а наприкінці — else для решти випадків.\n\nPython перевіряє умови згори вниз. Щойно знайде першу істинну, виконає її блок і пропустить решту цього ланцюжка. Тому спершу перевіряємо score >= 90, потім score >= 60. До другої перевірки дійдуть лише числа, менші за 90, тож ще раз писати score < 90 не потрібно. Для 95 очок буде тільки gold, а для 85 — тільки silver.\n\nif, elif та else вирівнюємо на одному рівні; після кожного ставимо двокрапку. Команди їхніх блоків зсуваємо на 4 пробіли. У if та elif є умови, а в else її немає. Фінальний else необов'язковий: без нього, якщо всі перевірки хибні, жоден блок ланцюжка не виконається. У нашій задачі else потрібен для бронзової медалі.\n\nПорядок важливий: якщо спершу поставити score >= 60, то 95 одразу потрапить у silver і до золота справа не дійде. Два окремі if — теж інша програма: вони перевіряються незалежно, тому для 95 можуть надрукувати і gold, і silver. Ланцюжок if/elif/else обирає одну гілку, а не всі відповідні.",
            en: "Not every choice has only two options. In a game, 90 or more points earn gold, 60–89 earn silver, and fewer points earn bronze. Use elif, short for else if: 'otherwise, if'. After if you can add one or more elif checks, then else for the remaining cases.\n\nPython checks conditions from top to bottom. As soon as it finds the first true condition, it runs that block and skips the rest of this chain. So check score >= 90 first, then score >= 60. Only numbers below 90 reach the second check; there is no need to repeat score < 90. A score of 95 prints only gold; 85 prints only silver.\n\nAlign if, elif and else at the same level, each ending with a colon. Indent their block commands by 4 spaces. if and elif have conditions; else has none. The final else is optional: without it, if every check is false, no block in the chain runs. Our task needs else for the bronze medal.\n\nOrder matters: checking score >= 60 first would send 95 straight to silver, never reaching gold. Two separate if statements are different too: they check independently, so 95 could print both gold and silver. An if/elif/else chain chooses one branch, not every matching branch.",
            tr: "Her seçimin yalnızca iki olasılığı yoktur. Bir oyunda 90 veya daha fazla puan altın, 60–89 puan gümüş, daha azı bronz madalya kazandırır. Bunun için else if kısaltması olan elif kullanılır: 'aksi halde, eğer'. if sonrasına bir veya birkaç elif denetimi, en sona da kalan durumlar için else ekleyebilirsin.\n\nPython koşulları yukarıdan aşağıya denetler. İlk doğru koşulu bulunca onun bloğunu çalıştırır ve bu zincirin geri kalanını atlar. Bu yüzden önce score >= 90, sonra score >= 60 denetlenir. İkinci denetime yalnızca 90'dan küçük sayılar ulaşır; score < 90 koşulunu yeniden yazmak gerekmez. 95 puanda yalnızca gold, 85 puanda yalnızca silver çıkar.\n\nif, elif ve else aynı hizada olmalı; her biri iki noktayla bitmeli. Blok komutlarını 4 boşluk girintile. if ve elif koşul içerir, else içermez. Sondaki else zorunlu değildir: yoksa ve bütün koşullar yanlışsa zincirin hiçbir bloğu çalışmaz. Bizim görevimizde bronz madalya için else gerekir.\n\nSıra önemlidir: önce score >= 60 denetlenirse 95 hemen silver dalına gider, altına hiç ulaşamaz. İki ayrı if de farklıdır: bağımsız denetlendikleri için 95 puanda hem gold hem silver yazdırabilirler. if/elif/else zinciri uyan bütün dalları değil, tek bir dalı seçer."
          },
          example: "score = 85\nif score >= 90:\n    print(\"gold\")\nelif score >= 60:\n    print(\"silver\")\nelse:\n    print(\"bronze\")\n",
          task: {
            text: {
              uk: "Прочитай цілу кількість очок score від 0 до 100. Виведи рівно одну медаль: gold за 90–100 очок, silver за 60–89, bronze за 0–59. Побудуй ланцюжок if/elif/else, починаючи з найбільшого порога. Перевір, куди належать рівно 60 та рівно 90 очок.",
              en: "Read an integer score from 0 to 100. Print exactly one medal: gold for 90–100 points, silver for 60–89, bronze for 0–59. Build an if/elif/else chain, starting with the highest threshold. Check where exactly 60 and exactly 90 belong.",
              tr: "0 ile 100 arasında bir tam sayı olan score değerini oku. Tam bir madalya yazdır: 90–100 puan için gold, 60–89 için silver, 0–59 için bronze. En yüksek eşikten başlayarak if/elif/else zinciri kur. Tam 60 ve tam 90 puanın hangi dala girdiğini kontrol et."
            },
            hint: {
              uk: "Почни з if score >= 90:, потім elif score >= 60:, наприкінці else:. У кожному блоці — один print() з назвою медалі. Не замінюй elif другим незалежним if.",
              en: "Start with if score >= 90:, then elif score >= 60:, and finally else:. Each block has one print() with the medal name. Do not replace elif with a second independent if.",
              tr: "Önce if score >= 90:, sonra elif score >= 60:, en sonda else: yaz. Her blokta madalya adını yazdıran bir print() olsun. elif yerine ikinci bağımsız if kullanma."
            },
            starter: "score = int(input())\n",
            tests: [
              { in: "0\n", out: "bronze" },
              { in: "59\n", out: "bronze" },
              { in: "60\n", out: "silver" },
              { in: "89\n", out: "silver" },
              { in: "90\n", out: "gold" },
              { in: "100\n", out: "gold" }
            ]
          }
        },
        {
          id: "if_nested",
          title: { uk: "Умова всередині умови", en: "A condition inside a condition", tr: "Koşul içinde koşul" },
          theory: {
            uk: "Іноді другу перевірку варто робити лише після першої. На атракціон пускають з 8 років. Якщо вік підходить, перевіряємо квиток: є квиток — можна кататися, немає — спочатку купити. Якщо дитині менше 8, квиток нічого не змінює. Це вкладена умова: один if стоїть усередині блоку іншого if.\n\nЗовнішній if age >= 8: починається без відступу. Внутрішній if ticket == 1: уже належить до його блоку, тому має 4 пробіли. Команда print(\"ride\") належить до внутрішнього if — додаємо ще 4, разом 8 пробілів. Кожен новий рівень вкладеності має свій відступ. Python дійде до перевірки квитка тільки тоді, коли перевірка віку дасть True.\n\nКожен else належить до if на тому самому рівні відступу. Внутрішній else із 4 пробілами означає «вік підходить, але квитка немає» — buy_ticket. Зовнішній else без відступу означає «вік не підходить» — too_young. Пересунути else — це змінити, до якої перевірки він належить.\n\nДля age = 9 і ticket = 0 отримаємо buy_ticket, для age = 9 і ticket = 1 — ride, а для age = 7 з будь-яким квитком — too_young. and міг би об'єднати дві вимоги для катання, але вкладені умови тут допомагають ще й пояснити різні причини відмови. Не ускладнюй вкладення без потреби; читай програму рівень за рівнем.",
            en: "Sometimes a second check is useful only after the first. A ride admits children aged 8 or older. If the age fits, check the ticket: with a ticket, ride; without one, buy it first. Below age 8, a ticket changes nothing. This is a nested condition: one if sits inside another if's block.\n\nThe outer if age >= 8: starts without indentation. The inner if ticket == 1: belongs to its block, so it has 4 spaces. print(\"ride\") belongs to the inner if: add 4 more, making 8 spaces. Each nesting level has its own indentation. Python reaches the ticket check only when the age check is True.\n\nEach else belongs to the if at the same indentation level. The inner else with 4 spaces means 'old enough, but no ticket': buy_ticket. The outer unindented else means 'too young': too_young. Moving an else changes which check it belongs to.\n\nFor age = 9 and ticket = 0, the result is buy_ticket; with age = 9 and ticket = 1, it is ride; with age = 7, any ticket gives too_young. and could combine both requirements for riding, but nesting also helps explain different reasons for refusal. Avoid unnecessary nesting; read the program one level at a time.",
            tr: "Bazen ikinci denetim yalnızca ilkinden sonra anlamlıdır. Bir oyuncağa 8 yaş ve üzeri binebilir. Yaş uygunsa bileti denetleriz: bilet varsa bin, yoksa önce satın al. 8 yaşından küçük biri için bilet sonucu değiştirmez. Bu, iç içe koşuldur: bir if başka bir if bloğunun içindedir.\n\nDıştaki if age >= 8: girintisiz başlar. İçteki if ticket == 1: onun bloğuna aittir, bu yüzden 4 boşluk girintilidir. print(\"ride\") içteki if'e aittir: 4 boşluk daha ekleriz, toplam 8 olur. Her iç içe geçme düzeyinin kendi girintisi vardır. Python bilet denetimine yalnızca yaş denetimi True olduğunda ulaşır.\n\nHer else aynı girinti düzeyindeki if'e aittir. 4 boşluklu iç else, 'yaş uygun ama bilet yok' demektir: buy_ticket. Girintisiz dış else, 'yaş uygun değil' demektir: too_young. else satırını kaydırmak, hangi denetime ait olduğunu değiştirir.\n\nage = 9 ve ticket = 0 için buy_ticket; age = 9 ve ticket = 1 için ride; age = 7 için bilet ne olursa olsun too_young çıkar. and iki binme şartını birleştirebilirdi, ancak iç içe koşullar farklı ret nedenlerini de açıklamamızı sağlar. Gereksiz iç içe yapı kurma; programı düzey düzey oku."
          },
          example: "age = 9\nticket = 0\nif age >= 8:\n    if ticket == 1:\n        print(\"ride\")\n    else:\n        print(\"buy_ticket\")\nelse:\n    print(\"too_young\")\n",
          task: {
            text: {
              uk: "Прочитай цілий невід'ємний вік age і позначку ticket з окремих рядків: 1 — квиток є, 0 — немає. Якщо age < 8, виведи too_young незалежно від квитка. Інакше вкладеною умовою обери ride за наявності квитка або buy_ticket без нього. Виведи рівно один рядок.",
              en: "Read a nonnegative integer age and a ticket marker on separate lines: 1 means a ticket is present, 0 means absent. If age < 8, print too_young regardless of the ticket. Otherwise use a nested condition to choose ride with a ticket or buy_ticket without one. Print exactly one line.",
              tr: "Negatif olmayan bir tam sayı age ve ticket işaretini ayrı satırlardan oku: 1 bilet var, 0 yok demektir. age < 8 ise biletten bağımsız olarak too_young yazdır. Aksi halde içteki koşulla bilet varsa ride, yoksa buy_ticket seç. Tam bir satır yazdır."
            },
            hint: {
              uk: "Зовні перевір if age >= 8:. Усередині з відступом 4 пробіли напиши if ticket == 1: та його else:. Їхні print() мають 8 пробілів. Зовнішній else: вирівняй із першим if.",
              en: "Check if age >= 8: on the outside. Inside, write if ticket == 1: and its else: with 4 spaces. Their print() calls have 8 spaces. Align the outer else: with the first if.",
              tr: "Dışta if age >= 8: denetle. İçte if ticket == 1: ve onun else: satırını 4 boşlukla yaz. Bunların print() çağrıları 8 boşluklu olur. Dış else: ilk if ile aynı hizada olmalı."
            },
            starter: "age = int(input())\nticket = int(input())\n",
            tests: [
              { in: "7\n0\n", out: "too_young" },
              { in: "7\n1\n", out: "too_young" },
              { in: "8\n0\n", out: "buy_ticket" },
              { in: "8\n1\n", out: "ride" },
              { in: "12\n0\n", out: "buy_ticket" },
              { in: "12\n1\n", out: "ride" }
            ]
          }
        },
        {
          id: "if_logic",
          title: { uk: "and, or та not в умові if", en: "and, or and not in an if condition", tr: "if koşulunda and, or ve not" },
          theory: {
            uk: "Повернімося до знайомого правила гри надворі: сьогодні вихідний або канікули, і при цьому немає дощу. Раніше ми лише виводили результат такого правила як True або False. Тепер поставимо весь логічний вираз після if, щоб обрати дію: outside — грати надворі, inside — залишитися в приміщенні.\n\nУмова має вигляд (weekend == 1 or holiday == 1) and not (rain == 1). or поєднує два приводи для вільного дня; and вимагає ще й сухої погоди; not заперечує перевірку на дощ. Кожен оператор працює зі знайомими порівняннями. У if не потрібні окремі вкладені блоки для кожного оператора: увесь вираз — це одна умова, а двокрапка стоїть після неї.\n\nДужки навколо or важливі: без них and має вищий пріоритет, і вихідний дозволив би гру навіть у дощ. Явно згрупуй альтернативи, а потім додай спільну вимогу. Не скорочуй дві перевірки до weekend or holiday == 1: для навчання пиши обидва порівняння повністю — weekend == 1 or holiday == 1.\n\nЩоб умову було легше читати, її результат можна зберегти: can_play = (weekend == 1 or holiday == 1) and not (rain == 1), а наступним рядком написати if can_play:. Тут can_play уже має тип bool, тому порівняння == True зайве. Для дощу завжди обираємо inside; без дощу обираємо outside лише у вихідний або на канікулах.",
            en: "Return to our familiar outdoor-play rule: it is a weekend or a school holiday, and it is not raining. Previously we only printed the rule's result as True or False. Now put the whole logical expression after if to choose an action: outside for outdoor play, inside for staying indoors.\n\nThe condition is (weekend == 1 or holiday == 1) and not (rain == 1). or combines two reasons for a free day; and also requires dry weather; not negates the rain check. Each operator works with familiar comparisons. if needs no separate nested blocks for each operator: the whole expression is one condition, followed by a colon.\n\nThe parentheses around or matter: without them, and has higher precedence and a weekend would allow play even in the rain. Group the alternatives explicitly, then add the shared requirement. Do not shorten the two checks to weekend or holiday == 1: for learning, write both comparisons in full, weekend == 1 or holiday == 1.\n\nFor readability, save the result: can_play = (weekend == 1 or holiday == 1) and not (rain == 1), then write if can_play: on the next line. can_play already has type bool, so == True is unnecessary. Rain always selects inside; without rain, select outside only on weekends or school holidays.",
            tr: "Bildiğimiz dışarıda oynama kuralına dönelim: hafta sonu veya okul tatili olmalı ve yağmur yağmamalı. Önceden bu kuralın sonucunu yalnızca True veya False olarak yazdırıyorduk. Şimdi bütün mantıksal ifadeyi if sonrasına koyarak eylem seçeceğiz: dışarıda oynamak için outside, içeride kalmak için inside.\n\nKoşul (weekend == 1 or holiday == 1) and not (rain == 1) biçimindedir. or boş günün iki nedenini birleştirir; and ayrıca yağmursuz hava ister; not yağmur denetimini tersine çevirir. Her operatör bildiğimiz karşılaştırmalarla çalışır. if içinde her operatör için ayrı iç içe blok gerekmez: bütün ifade tek koşuldur ve ardından iki nokta gelir.\n\nor çevresindeki parantezler önemlidir: onlar olmadan and daha önceliklidir ve hafta sonu yağmurda bile oyuna izin verirdi. Seçenekleri açıkça grupla, sonra ortak şartı ekle. İki denetimi weekend or holiday == 1 şeklinde kısaltma: öğrenirken iki karşılaştırmayı da tam yaz, weekend == 1 or holiday == 1.\n\nOkumayı kolaylaştırmak için sonucu saklayabilirsin: can_play = (weekend == 1 or holiday == 1) and not (rain == 1), sonra yeni satıra if can_play: yaz. can_play zaten bool türündedir, bu yüzden == True gereksizdir. Yağmurda her zaman inside seçilir; yağmur yoksa yalnızca hafta sonu veya okul tatilinde outside seçilir."
          },
          example: "weekend = 1\nholiday = 0\nrain = 1\nif (weekend == 1 or holiday == 1) and not (rain == 1):\n    print(\"outside\")\nelse:\n    print(\"inside\")\n",
          task: {
            text: {
              uk: "Прочитай weekend, holiday та rain — три позначки 0 або 1, кожну з нового рядка. Виведи outside, якщо сьогодні вихідний або канікули й водночас немає дощу; інакше inside. Поєднай and, or та not в умові if. Дощ має залишати нас у приміщенні навіть у вихідний і на канікулах.",
              en: "Read weekend, holiday and rain: three 0/1 markers, one per line. Print outside if it is a weekend or a school holiday and there is no rain; otherwise inside. Combine and, or and not in the if condition. Rain must keep us indoors even on weekends and school holidays.",
              tr: "weekend, holiday ve rain değerlerini ayrı satırlardan oku; her biri 0 veya 1 işaretidir. Hafta sonu veya okul tatiliyse ve yağmur yoksa outside, aksi halde inside yazdır. if koşulunda and, or ve not birleştir. Yağmur, hafta sonu ve okul tatilinde bile bizi içeride tutmalı."
            },
            hint: {
              uk: "Після if напиши (weekend == 1 or holiday == 1) and not (rain == 1):. У його блоці виведи outside, у блоці else — inside. Або спочатку збережи цей вираз у can_play та використай if can_play:.",
              en: "After if write (weekend == 1 or holiday == 1) and not (rain == 1):. Print outside in its block and inside in else. Or first save that expression in can_play and use if can_play:.",
              tr: "if sonrasına (weekend == 1 or holiday == 1) and not (rain == 1): yaz. Bloğunda outside, else bloğunda inside yazdır. Ya da önce ifadeyi can_play içinde saklayıp if can_play: kullan."
            },
            starter: "weekend = int(input())\nholiday = int(input())\nrain = int(input())\n",
            tests: [
              { in: "1\n0\n0\n", out: "outside" },
              { in: "0\n1\n0\n", out: "outside" },
              { in: "1\n1\n0\n", out: "outside" },
              { in: "0\n0\n0\n", out: "inside" },
              { in: "1\n0\n1\n", out: "inside" },
              { in: "0\n1\n1\n", out: "inside" },
              { in: "1\n1\n1\n", out: "inside" },
              { in: "0\n0\n1\n", out: "inside" }
            ]
          }
        },
        {
          id: "if_ternary",
          title: { uk: "Короткий вибір: тернарний вираз", en: "A short choice: the ternary expression", tr: "Kısa seçim: üçlü koşullu ifade" },
          theory: {
            uk: "Іноді дві гілки потрібні лише для вибору одного значення. Наприклад, напис на кнопці залежить від наявності квитка: ride, якщо квиток є, або buy_ticket, якщо його немає. Такий вибір можна записати коротко: label = \"ride\" if ticket == 1 else \"buy_ticket\". Це умовний вираз, який часто називають тернарним оператором: він складається з умови та двох значень на вибір.\n\nПорядок відрізняється від звичайного if: спочатку значення для True, потім if і умова, потім else і значення для False. Шаблон: значення_так if умова else значення_ні. Python спершу перевіряє умову, а потім обчислює тільки обрану частину. Результат виразу можна присвоїти змінній або передати у print(). Саме присвоєння нічого не друкує.\n\nУ прикладі за ticket = 1 змінна label отримає рядок ride; за ticket = 0 — buy_ticket. print(label) окремо покаже обране слово. Тут немає двокрапки й блоку з відступом, а else обов'язковий: вираз повинен мати значення для обох випадків. Не плутай цей запис із багаторядковим if/else, який обирає команди для виконання.\n\nВикористовуй короткий вираз для простого вибору одного значення. Якщо в гілках кілька дій або умова складна, звичайний if/else читатиметься краще. Не стискай вкладені умови в довгий рядок заради стислості. У практиці оберемо напис про парність числа: остача n % 2 дорівнює 0 саме для парних чисел.",
            en: "Sometimes two branches only choose one value. For example, a button label depends on a ticket: ride if it is present, buy_ticket otherwise. Write that choice briefly: label = \"ride\" if ticket == 1 else \"buy_ticket\". This is a conditional expression, often called the ternary operator: it consists of a condition and two alternative values.\n\nIts order differs from a regular if: first the value for True, then if and the condition, then else and the value for False. The pattern is value_if_true if condition else value_if_false. Python checks the condition first, then evaluates only the chosen part. Assign the expression's result to a variable or pass it to print(). Assignment itself prints nothing.\n\nIn the example, ticket = 1 gives label the string ride; ticket = 0 gives buy_ticket. A separate print(label) displays the chosen word. There is no colon or indented block here, and else is required: the expression needs a value for both cases. Do not confuse this with a multiline if/else, which chooses commands to execute.\n\nUse the short expression for a simple choice of one value. If branches contain several actions or the condition is complicated, a regular if/else is easier to read. Do not squeeze nested conditions into a long line just to be brief. In practice, choose a label for an integer's parity: the remainder n % 2 is 0 exactly for even integers.",
            tr: "Bazen iki dal yalnızca tek bir değer seçmek içindir. Örneğin düğme yazısı bilete bağlıdır: bilet varsa ride, yoksa buy_ticket. Bu seçimi kısaca yazabiliriz: label = \"ride\" if ticket == 1 else \"buy_ticket\". Bu, genellikle üçlü operatör denen koşullu ifadedir: bir koşuldan ve seçilebilecek iki değerden oluşur.\n\nSıralaması normal if'ten farklıdır: önce True için değer, sonra if ve koşul, ardından else ve False için değer gelir. Kalıp: doğru_değer if koşul else yanlış_değer. Python önce koşulu denetler, sonra yalnızca seçilen kısmı hesaplar. İfadenin sonucunu değişkene atayabilir veya print() içine verebilirsin. Atama tek başına hiçbir şey yazdırmaz.\n\nÖrnekte ticket = 1 ise label, ride dizesini; ticket = 0 ise buy_ticket dizesini alır. Ayrı bir print(label) seçilen sözcüğü gösterir. Burada iki nokta ve girintili blok yoktur; else zorunludur, çünkü ifade iki durum için de bir değer vermelidir. Bunu çalışacak komutları seçen çok satırlı if/else ile karıştırma.\n\nKısa ifadeyi tek bir değerin basit seçimi için kullan. Dallarda birkaç eylem varsa veya koşul karmaşıksa normal if/else daha okunaklıdır. Yalnızca kısa olsun diye iç içe koşulları uzun bir satıra sıkıştırma. Alıştırmada sayının tek veya çift oluşuna göre yazı seçeceğiz: n % 2 kalanı tam olarak çift sayılarda 0 olur."
          },
          example: "ticket = 1\nlabel = \"ride\" if ticket == 1 else \"buy_ticket\"\nprint(label)\n",
          task: {
            text: {
              uk: "Прочитай ціле число n. За допомогою тернарного виразу збережи в label рядок even, якщо n парне, або odd, якщо непарне. Потім виведи label. Перевірка парності — n % 2 == 0; нуль теж парний, а від'ємні числа також бувають парними й непарними.",
              en: "Read an integer n. Use a ternary expression to store even in label if n is even, or odd if it is odd. Then print label. The evenness check is n % 2 == 0; zero is even, and negative integers can also be even or odd.",
              tr: "Bir n tam sayısı oku. Üçlü koşullu ifadeyle n çiftse even, tekse odd dizesini label içinde sakla. Sonra label yazdır. Çiftlik denetimi n % 2 == 0 biçimindedir; sıfır da çifttir, negatif tam sayılar da tek veya çift olabilir."
            },
            hint: {
              uk: "label = \"even\" if n % 2 == 0 else \"odd\". На наступному рядку — print(label). Двокрапка тут не потрібна; слова even та odd — рядки, тому мають бути в лапках.",
              en: "label = \"even\" if n % 2 == 0 else \"odd\". On the next line, print(label). No colon is needed here; even and odd are strings, so they need quotes.",
              tr: "label = \"even\" if n % 2 == 0 else \"odd\". Sonraki satıra print(label) yaz. Burada iki nokta gerekmez; even ve odd dizedir, bu yüzden tırnak içinde olmalı."
            },
            starter: "n = int(input())\n",
            tests: [
              { in: "0\n", out: "even" },
              { in: "1\n", out: "odd" },
              { in: "2\n", out: "even" },
              { in: "7\n", out: "odd" },
              { in: "-4\n", out: "even" },
              { in: "-3\n", out: "odd" }
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
  let checkBtn, resetBtn, runPracticeBtn, statusEl, resultsEl, doneEl, prevBtn, nextBtn, backBtn;
  let current = null;
  let busy = false;
  let gutter = null;

  function t(k, v) { return global.I18n ? global.I18n.t(k, v) : k; }
  function pick(obj) {
    if (!obj) return "";
    if (global.I18n) return global.I18n.localize(obj);
    return obj.uk || "";
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

  function runPractice() {
    const editor = $("#code");
    if (!editor || !codeEl) return;
    editor.value = codeEl.value;
    editor.dispatchEvent(new Event("input", { bubbles: true }));
    if (global.App && global.App.route) global.App.route("python");
    else location.hash = "#python";
    toast(t("course.tryRunToast"));
    sfx("pop");
    setTimeout(() => { if (global.PythonPad && global.PythonPad.run) global.PythonPad.run(); }, 150);
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
    runPracticeBtn = $("#courseRun");
    statusEl = $("#courseStatus");
    resultsEl = $("#courseResults");
    doneEl = $("#courseDone");
    prevBtn = $("#coursePrev");
    nextBtn = $("#courseNext");
    backBtn = $("#courseBack");

    if (exampleRunBtn) exampleRunBtn.onclick = runExample;
    if (runPracticeBtn) runPracticeBtn.onclick = runPractice;
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
