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
