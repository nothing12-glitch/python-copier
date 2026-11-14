/* glossary.js — розділ «Словник Python»: 41 термін у восьми тематичних групах.
   Кожна картка — коротке пояснення, приклад коду та справжній вивід.
   Прогрес прочитаного: app.glossary.<user> */
(function (global) {
  const $ = (s) => document.querySelector(s);
  const KEY = "app.glossary.";
  const I = () => global.I18n;
  const L = (o) => (I() ? I().localize(o) : (o && (o.uk || o.en)) || "");
  const t = (k, v) => (I() ? I().t(k, v) : k);

  function user() { return (global.Profile && global.Profile.handle()) || "guest"; }

  /* ---------- Дані ---------- */
  const CATS = [
    { id: "basics", ico: "widgets", name: { uk: "Основи", en: "Basics", tr: "Temeller" } },
    { id: "strings", ico: "text_fields", name: { uk: "Рядки", en: "Strings", tr: "Metinler" } },
    { id: "collections", ico: "inventory_2", name: { uk: "Колекції", en: "Collections", tr: "Koleksiyonlar" } },
    { id: "control", ico: "account_tree", name: { uk: "Умови й цикли", en: "Conditions and loops", tr: "Koşullar ve döngüler" } },
    { id: "functions", ico: "functions", name: { uk: "Функції", en: "Functions", tr: "Fonksiyonlar" } },
    { id: "errors", ico: "bug_report", name: { uk: "Помилки", en: "Errors", tr: "Hatalar" } },
    { id: "files", ico: "folder_open", name: { uk: "Файли", en: "Files", tr: "Dosyalar" } },
    { id: "oop", ico: "hub", name: { uk: "Класи", en: "Classes", tr: "Sınıflar" } }
  ];

  const TERMS = [
    /* --- Основи --- */
    {
      id: "print", cat: "basics", term: "print()",
      def: {
        uk: "Виводить значення на екран. Кілька аргументів друкуються через пробіл, а sep і end змінюють роздільник і те, чим закінчується рядок.",
        en: "Writes values to the screen. Several arguments print with a space between them, while sep and end change the separator and how the line ends.",
        tr: "Değerleri ekrana yazar. Birden fazla argüman aralarında boşlukla yazdırılır; sep ve end ayırıcıyı ile satırın bitişini değiştirir."
      },
      code: `print("Python")
print(1, 2, 3)
print("a", "b", sep="-", end="!")
print()`,
      out: `Python
1 2 3
a-b!`
    },
    {
      id: "input", cat: "basics", term: "input()",
      def: {
        uk: "Читає один рядок, уведений з клавіатури, і завжди повертає текст. Щоб порахувати число, обгорни результат у int() або float().",
        en: "Reads one line typed on the keyboard and always returns text. Wrap the result in int() or float() when you need to calculate with it.",
        tr: "Klavyeden girilen bir satırı okur ve her zaman metin döndürür. Hesap için sayı gerekiyorsa sonucu int() veya float() ile sar."
      },
      code: `name = input()
age = int(input())
print(name, age + 1)`,
      inp: `Liza
17`,
      out: `Liza 18`
    },
    {
      id: "int-float", cat: "basics", term: "int()  float()",
      def: {
        uk: "Перетворюють текст чи число на ціле або дробове. int(\"42\") дає 42, а int(9.99) просто відкидає дробову частину — виходить 9.",
        en: "Convert text or numbers into an integer or a float. int(\"42\") gives 42, and int(9.99) drops the fraction — the answer is 9.",
        tr: "Metni veya sayıyı tam sayıya ya da ondalıklı sayıya çevirir. int(\"42\") 42 verir, int(9.99) ondalık kısmı atar: sonuç 9."
      },
      code: `print(int("42"))
print(float("3.5") * 2)
print(int(9.99))`,
      out: `42
7.0
9`
    },
    {
      id: "fstring", cat: "basics", term: 'f"{x}"',
      def: {
        uk: "Рядок з літерою f на початку підставляє значення змінних просто в текст через фігурні дужки. Після двокрапки можна задати формат: .2f — два знаки після коми.",
        en: "A string with a leading f drops values straight into the text using curly braces. After a colon you can set a format: .2f means two digits after the decimal point.",
        tr: "Başında f harfi olan metin, değerleri küme parantezleriyle doğrudan yazıya yerleştirir. İki noktadan sonra biçim verilir: .2f virgülden sonra iki hane demektir."
      },
      code: `price = 19
qty = 3
print(f"{qty} x {price} = {qty * price}")
print(f"{22 / 7:.2f}")`,
      out: `3 x 19 = 57
3.14`
    },
    {
      id: "len", cat: "basics", term: "len()",
      def: {
        uk: "Повертає кількість елементів: символів у рядку, значень у списку, пар у словнику. Порожня колекція дає 0.",
        en: "Returns how many items there are: characters in a string, values in a list, pairs in a dictionary. An empty collection gives 0.",
        tr: "Kaç öğe olduğunu döndürür: metindeki karakter, listedeki değer, sözlükteki çift. Boş koleksiyon 0 verir."
      },
      code: `print(len("Python"))
print(len([1, 2, 3]))
print(len({}))`,
      out: `6
3
0`
    },
    {
      id: "range", cat: "basics", term: "range()",
      def: {
        uk: "Створює послідовність цілих чисел. range(5) дає 0, 1, 2, 3, 4; range(2, 10, 2) — парні числа від 2 до 8. Останнє число завжди не входить.",
        en: "Builds a sequence of integers. range(5) gives 0, 1, 2, 3, 4; range(2, 10, 2) gives the even numbers from 2 to 8. The last number is never included.",
        tr: "Tam sayılardan bir dizi üretir. range(5) 0, 1, 2, 3, 4 verir; range(2, 10, 2) 2 ile 8 arasındaki çift sayıları verir. Son sayıya asla ulaşılmaz."
      },
      code: `print(list(range(5)))
print(list(range(2, 10, 2)))`,
      out: `[0, 1, 2, 3, 4]
[2, 4, 6, 8]`
    },

    /* --- Рядки --- */
    {
      id: "split", cat: "strings", term: "split()",
      def: {
        uk: "Розбиває рядок на список частин. Без аргумента розділяє по будь-яких пробілах, з аргументом — саме по тому роздільнику, що ти вказав.",
        en: "Breaks a string into a list of pieces. With no argument it splits on any whitespace; with one it splits exactly on the separator you give.",
        tr: "Metni parçalardan bir listeye böler. Argümansız her tür boşluktan böler; argümanla tam olarak verdiğin ayırıcıdan böler."
      },
      code: `print("10 20 30".split())
print("a,b,c".split(","))
print("x-y".split("-")[1])`,
      out: `['10', '20', '30']
['a', 'b', 'c']
y`
    },
    {
      id: "join", cat: "strings", term: "join()",
      def: {
        uk: "З'єднує список рядків в один. Викликають його від тексту-роздільника, який стане між елементами.",
        en: "Glues a list of strings into one. You call it on the separator text that will end up between the items.",
        tr: "Bir satır listesini tek metinde birleştirir. Ayırıcı metin üzerinden çağrılır; bu metin öğelerin arasına gelir."
      },
      code: `parts = ["py", "thon"]
print("".join(parts))
print("-".join(["2026", "11", "01"]))`,
      out: `python
2026-11-01`
    },
    {
      id: "strip", cat: "strings", term: "strip()",
      def: {
        uk: "Прибирає пробіли — або вказані символи — з обох кінців рядка. Найчастіше потрібен одразу після input().",
        en: "Removes whitespace — or the characters you name — from both ends of a string. Most often you need it right after input().",
        tr: "Metnin iki ucundaki boşlukları veya belirttiğin karakterleri siler. En sık input() hemen ardından gerekir."
      },
      code: `s = "  hi  "
print(len(s), len(s.strip()))
print("##ok##".strip("#"))`,
      out: `6 2
ok`
    },
    {
      id: "upper-lower", cat: "strings", term: "upper()  lower()",
      def: {
        uk: "upper переводить текст у верхній регістр, lower — у нижній. Рядок не змінюється на місці: повертається новий.",
        en: "upper switches text to capitals, lower to small letters. The string is not changed in place — a new one is returned.",
        tr: "upper metni büyük harfe, lower küçük harfe çevirir. Metin yerinde değişmez; yeni bir metin döner."
      },
      code: `s = "MixEd"
print(s.upper())
print(s.lower())
print(s)`,
      out: `MIXED
mixed
MixEd`
    },
    {
      id: "replace", cat: "strings", term: "replace()",
      def: {
        uk: "Замінює всі входження одного підрядка на інший текст. Повертає новий рядок, оригінал залишається цілим.",
        en: "Replaces every occurrence of one substring with another text. It returns a new string and leaves the original untouched.",
        tr: "Bir alt metnin tüm geçişlerini başka bir metinle değiştirir. Yeni bir satır döndürür, orijinal olduğu gibi kalır."
      },
      code: `print("banana".replace("an", "AN"))
print("2026-11-01".replace("-", "."))`,
      out: `bANANa
2026.11.01`
    },
    {
      id: "in-operator", cat: "strings", term: "in",
      def: {
        uk: "Перевіряє, чи є підрядок у рядку (або елемент у колекції), і повертає True чи False. З запереченням пишуть not in.",
        en: "Checks whether a substring exists inside a string (or an item inside a collection) and gives True or False. The negative form is not in.",
        tr: "Bir alt metnin dizinin içinde olup olmadığını (veya bir koleksiyonda öğe bulunup bulunmadığını) denetler ve True ya da False verir. Olumsuzu not in şeklindedir."
      },
      code: `s = "Python"
print("th" in s)
print("x" in s)
print(5 in [1, 5, 9])`,
      out: `True
False
True`
    },
    {
      id: "slice", cat: "strings", term: "s[a:b]",
      def: {
        uk: "Зріз витягує частину рядка чи списку: від індексу a до b, не включаючи b. Від'ємні індекси рахують з кінця, a крок b перевертає послідовність.",
        en: "A slice takes part of a string or list: from index a up to b without including b. Negative indexes count from the end, and a step of -1 reverses the sequence.",
        tr: "Dilim, metnin veya listenin bir bölümünü alır: a indeksinden b'ye kadar, b dahil değil. Eksi indeksler sondan sayar, -1 adımı diziyi ters çevirir."
      },
      code: `s = "Python"
print(s[0:2])
print(s[-3:])
print(s[::-1])`,
      out: `Py
hon
nohtyP`
    },

    /* --- Колекції --- */
    {
      id: "list", cat: "collections", term: "list  [ ]",
      def: {
        uk: "Список — впорядкований набір елементів у квадратних дужках. Його можна змінювати: додавати, заміняти й видаляти за індексом.",
        en: "A list is an ordered set of items in square brackets. It is mutable: you can add, replace and delete entries by index.",
        tr: "Liste, köşeli parantezlerde sıralı bir öğe kümesidir. Değiştirilebilir: indekse göre ekleme, değiştirme ve silme yapılabilir."
      },
      code: `nums = [4, 8, 15]
nums.append(16)
nums[0] = 1
print(nums, nums[-1], len(nums))`,
      out: `[1, 8, 15, 16] 16 4`
    },
    {
      id: "dict", cat: "collections", term: "dict  {k: v}",
      def: {
        uk: "Словник зберігає пари ключ: значення. До значення звертаються через дужки, а get() безпечний для відсутнього ключа — повертає підставне значення замість помилки.",
        en: "A dictionary stores key: value pairs. You reach a value with brackets, while get() is safe for a missing key — it returns a fallback instead of an error.",
        tr: "Sözlük anahtar: değer çiftlerini saklar. Değere köşeli parantezle ulaşılır; get() olmayan anahtar için güvenlidir — hataya düşmek yerine varsayılan değeri döndürür."
      },
      code: `user = {"name": "Liza", "age": 17}
print(user["name"])
print(user.get("city", "?"))
user["city"] = "Kyiv"
print(len(user))`,
      out: `Liza
?
3`
    },
    {
      id: "set", cat: "collections", term: "set  { }",
      def: {
        uk: "Множина тримає лише унікальні значення й не має порядку. Нею зручно прибирати дублікати та шукати спільні елементи.",
        en: "A set keeps only unique values and has no order. It is handy for removing duplicates and finding shared items.",
        tr: "Küme yalnızca benzersiz değerleri tutar ve sıralı değildir. Tekrarları elemek ve ortak öğeleri bulmak için kullanışlıdır."
      },
      code: `a = {1, 2, 2, 3}
b = {3, 4}
print(sorted(a))
print(a & b)
print(a | b)`,
      out: `[1, 2, 3]
{3}
{1, 2, 3, 4}`
    },
    {
      id: "tuple", cat: "collections", term: "tuple  ( )",
      def: {
        uk: "Кортеж — незмінний список у круглих дужках. Зручний, коли функція повертає кілька значень одразу або коли дані не повинні змінитися випадково.",
        en: "A tuple is an immutable list in round brackets. Useful when a function returns several values at once or when data must not change by accident.",
        tr: "Demet, parantez içinde değiştirilemez bir listedir. Bir işlev aynı anda birkaç değer döndürdüğünde ya da verinin yanlışlıkla değişmemesi gerektiğinde işe yarar."
      },
      code: `point = (3, 4)
x, y = point
print(x + y, len(point))
print(sorted([("b", 2), ("a", 1)]))`,
      out: `7 2
[('a', 1), ('b', 2)]`
    },
    {
      id: "append-extend", cat: "collections", term: "append()  extend()",
      def: {
        uk: "append додає один елемент цілком, extend приєднує всі елементи іншого списку в кінець. Різниця видна саме на вкладених списках.",
        en: "append adds one item as a whole, extend joins every item of another list at the end. The difference shows up with nested lists.",
        tr: "append tek öğeyi bütün olarak ekler, extend başka bir listenin tüm öğelerini sona bağlar. Fark iç içe listelerde görülür."
      },
      code: `a = [1]
a.append([2, 3])
b = [1]
b.extend([2, 3])
print(a)
print(b)`,
      out: `[1, [2, 3]]
[1, 2, 3]`
    },
    {
      id: "sort-sorted", cat: "collections", term: "sort()  sorted()",
      def: {
        uk: "sort змінює сам список і повертає нічого, sorted створює новий відсортований. key вказує, за чим порівнювати, reverse=True — спадання.",
        en: "sort changes the list itself and returns nothing, sorted builds a new ordered list. key says what to compare by and reverse=True sorts downwards.",
        tr: "sort listenin kendisini değiştirip hiçbir şey döndürmez, sorted yeni bir sıralı liste üretir. key neye göre sıralanacağını, reverse=True azalan sırayı belirtir."
      },
      code: `nums = [3, 1, 2]
print(sorted(nums))
print(sorted(nums, reverse=True))
print(sorted(["bb", "a", "ccc"], key=len))
nums.sort()
print(nums)`,
      out: `[1, 2, 3]
[3, 2, 1]
['a', 'bb', 'ccc']
[1, 2, 3]`
    },
    {
      id: "aggregates", cat: "collections", term: "sum()  min()  max()",
      def: {
        uk: "Готові підсумки для чисел: сума, найменше та найбільше значення. Усе разом із len дає швидку статистику без циклу.",
        en: "Ready-made totals for numbers: the sum, the smallest and the largest value. Together with len they give quick statistics without a loop.",
        tr: "Sayılar için hazır toplamlar: toplam, en küçük ve en büyük değer. len ile birlikte döngü kurmadan hızlı istatistik verir."
      },
      code: `nums = [4, 7, 1, 9]
print(sum(nums), min(nums), max(nums), len(nums))
print(sum(nums) / len(nums))`,
      out: `21 1 9 4
5.25`
    },
    {
      id: "comprehension", cat: "collections", term: "[x for x in ...]",
      def: {
        uk: "Генератор списку будує новий список одним рядком: вираз, цикл і за бажанням умова if наприкінці. Замінює три-чотири рядки з append.",
        en: "A comprehension builds a new list in one line: an expression, a loop and optionally a trailing if. It replaces three or four lines of append.",
        tr: "İfadeyle yeni bir liste tek satırda kurulur: bir ifade, bir döngü ve isteğe bağlı sonda bir if. Üç dört satırlık append işini değiştirir."
      },
      code: `print([n * 2 for n in range(4)])
print([n for n in range(10) if n % 3 == 0])
print({c: i for i, c in enumerate("ab")})`,
      out: `[0, 2, 4, 6]
[0, 3, 6, 9]
{'a': 0, 'b': 1}`
    },

    /* --- Умови й цикли --- */
    {
      id: "if", cat: "control", term: "if  elif  else",
      def: {
        uk: "Вибір гілки за умовою. Перевіряється лише перша істинна гілка, решта пропускається; else ловить усі випадки, що не підійшли.",
        en: "Picks a branch by a condition. Only the first true branch runs and the rest are skipped; else catches every case that did not match.",
        tr: "Koşula göre bir dal seçer. Yalnızca ilk doğru dal çalışır, gerisi atlanır; else eşleşmeyen tüm durumları yakalar."
      },
      code: `n = 7
if n % 2 == 0:
    print("even")
elif n > 5:
    print("odd big")
else:
    print("odd")`,
      out: `odd big`
    },
    {
      id: "for", cat: "control", term: "for ... in",
      def: {
        uk: "Цикл по елементах послідовності. range дає числа, enumerate — одразу індекс і значення, items() — пари ключ і значення зі словника.",
        en: "A loop over the items of a sequence. range gives numbers, enumerate gives index and value together, items() gives key-value pairs from a dictionary.",
        tr: "Bir dizinin öğeleri üzerinde döngü. range sayıları, enumerate indeksle değeri birlikte, items() sözlükten anahtar-değer çiftlerini verir."
      },
      code: `for i in range(3):
    print(i, end=" ")
print()
for idx, ch in enumerate("ab"):
    print(idx, ch)
for k, v in {"a": 1}.items():
    print(k, v)`,
      out: `0 1 2 
0 a
1 b
a 1`
    },
    {
      id: "while", cat: "control", term: "while",
      def: {
        uk: "Цикл, що повторюється, доки умова істинна. Обов'язково змінюй усередині те, що перевіряєш, інакше цикл ніколи не зупиниться.",
        en: "A loop that repeats while the condition stays true. Make sure the body changes what the condition tests, otherwise the loop never stops.",
        tr: "Koşul doğru olduğu sürece tekrarlayan döngü. Gövde, koşulun sınadığı şeyi mutlaka değiştirmeli; yoksa döngü hiç bitmez."
      },
      code: `n = 5
steps = 0
while n > 1:
    n = n // 2
    steps += 1
print(steps)`,
      out: `2`
    },
    {
      id: "break-continue", cat: "control", term: "break  continue",
      def: {
        uk: "break повністю зупиняє цикл, continue пропускає решту тіла й переходить до наступної ітерації.",
        en: "break stops the loop completely, continue skips the rest of the body and moves to the next iteration.",
        tr: "break döngüyü tümüyle durdurur, continue gövdenin kalanını atlayıp sonraki yinelemeye geçer."
      },
      code: `for i in range(10):
    if i == 3:
        continue
    if i == 6:
        break
    print(i, end=" ")
print()`,
      out: `0 1 2 4 5`
    },
    {
        id: "ternary", cat: "control", term: "x if cond else y",

      def: {
        uk: "Тернарний вираз — той самий if/else в один рядок: спершу значення, потім умова, потім інакше.",
        en: "A ternary expression is the same if/else on one line: the value first, then the condition, then the alternative.",
        tr: "Üçlü ifade, tek satırda aynı if/else işini görür: önce değer, sonra koşul, en son diğer seçenek."
      },
      code: `age = 20
print("adult" if age >= 18 else "kid")
print("x" if not age else "y")`,
      out: `adult
y`
    },

    /* --- Функції --- */
    {
      id: "def", cat: "functions", term: "def",
      def: {
        uk: "Оголошує функцію: ім'я, параметри в дужках і тіло з відступом. Виклик — це ім'я з аргументами, а текст у першому рядку тіла називають docstring.",
        en: "Declares a function: a name, parameters in brackets and an indented body. Calling means the name with arguments; the first line of text is the docstring.",
        tr: "Bir işlevi tanımlar: ad, parantezde parametreler ve girintili gövde. Çağırmak adın argümanlarla kullanılmasıdır; ilk satırdaki metin docstring adını alır."
      },
      code: `def greet(name):
    print("hi " + name)

greet("Liza")
greet("Tom")`,
      out: `hi Liza
hi Tom`
    },
    {
      id: "return", cat: "functions", term: "return",
      def: {
        uk: "Повертає результат із функції й одразу завершує її роботу. Без return функція все одно повертає None.",
        en: "Hands a result back from the function and ends it at once. Without return the function still gives back None.",
        tr: "İşlevden bir sonucu geri verir ve işlevi hemen bitirir. return yoksa işlev yine de None döndürür."
      },
      code: `def area(w, h):
    return w * h

def sign(n):
    if n > 0:
        return 1
    return -1

print(area(3, 4), sign(-2))`,
      out: `12 -1`
    },
    {
      id: "default-arg", cat: "functions", term: "def f(x=1)",
      def: {
        uk: "Значення за замовчуванням використовується, якщо аргумент не передали. Воно обчислюється один раз під час оголошення — тому не став списком.",
        en: "A default value is used when the argument is not passed. It is computed once when the function is defined, so never make it a list.",
        tr: "Varsayılan değer, argüman gönderilmediğinde kullanılır. İşlev tanımlanırken bir kez hesaplanır; bu yüzden onu liste yapma."
      },
      code: `def power(base, exp=2):
    return base ** exp

print(power(3), power(2, 5))
print(power(base=2, exp=10))`,
      out: `9 32
1024`
    },
    {
      id: "args-kwargs", cat: "functions", term: "*args  **kwargs",
      def: {
        uk: "args збирає всі зайві позиційні аргументи в кортеж, kwargs — іменовані аргументи у словник. Так функція приймає довільну кількість значень.",
        en: "args collects every extra positional argument into a tuple, kwargs puts the named ones into a dictionary. That is how a function accepts any number of values.",
        tr: "args fazla gelen tüm konumsal argümanları bir demette, kwargs adlandırılmış olanları bir sözlükte toplar. Böyle bir işlev istediğiniz kadar değeri kabul eder."
      },
      code: `def show(*args, **kwargs):
    print(len(args), len(kwargs))
    print(args, kwargs)

show(1, 2, a=3, b=4)`,
      out: `2 2
(1, 2) {'a': 3, 'b': 4}`
    },
    {
      id: "lambda", cat: "functions", term: "lambda",
      def: {
        uk: "Анонімна функція в один вираз без return. Зручна як key для sorted або усередині map та filter.",
        en: "An anonymous function written as a single expression, with no return keyword. Handy as the key for sorted or inside map and filter.",
        tr: "Tek ifadede yazılan, return sözcüğü olmayan adsız işlev. sorted için key olarak ya da map ve filter içinde kullanışlıdır."
      },
      code: `pairs = [("b", 2), ("a", 5)]
print(sorted(pairs, key=lambda p: p[1]))
print(list(map(lambda x: x * 2, [1, 2])))
print(list(filter(lambda x: x > 1, [1, 2, 3])))`,
      out: `[('b', 2), ('a', 5)]
[2, 4]
[2, 3]`
    },

    /* --- Помилки --- */
    {
      id: "try-except", cat: "errors", term: "try  except",
      def: {
        uk: "Небезпечний код ставлять у try, а помилку ловлять у except. Блоків except може бути кілька — за типом помилки; as e дає доступ до тексту помилки.",
        en: "Risky code goes inside try and the error is caught by except. There can be several except blocks, one per error type; as e gives access to the message.",
        tr: "Riskli kod try içine yazılır, hata except ile yakalanır. Hata türüne göre birden fazla except bloğu olabilir; as e mesajına erişim verir."
      },
      code: `try:
    n = int("abc")
except ValueError:
    n = 0

try:
    n = n / 0
except ZeroDivisionError as e:
    print("caught:", e)
print(n)`,
      out: `caught: division by zero
0`
    },
    {
      id: "else-finally", cat: "errors", term: "else  finally",
      def: {
        uk: "else виконується, коли в try не було жодної помилки, finally — завжди, навіть якщо виняток летить далі. Туди ставлять прибирання.",
        en: "else runs when try raised no error, finally runs always — even if the exception keeps travelling outward. Put clean-up work in finally.",
        tr: "else, try içinde hiç hata olmadığında çalışır; finally her zaman çalışır — dışarı giden bir istisna olsa bile. Toparlama işi finally'ye konur."
      },
      code: `try:
    x = 10 / 2
except ZeroDivisionError:
    x = -1
else:
    print("ok")
finally:
    print("done")
print(x)`,
      out: `ok
done
5.0`
    },
    {
      id: "raise", cat: "errors", term: "raise",
      def: {
        uk: "Піднімає помилку свідомо: готовий тип із власним текстом. Так функція чесно повідомляє, що їй дали некоректні дані.",
        en: "Deliberately raises an error: a built-in type with your own message. That is how a function honestly reports bad input.",
        tr: "Bir hatayı bilinçli olarak yükseltir: hazır bir tür ve kendi mesajın. İşlev, geçersiz veri aldığını böyle dürüstçe bildirir."
      },
      code: `def set_age(a):
    if a < 0:
        raise ValueError("age < 0")
    return a

try:
    set_age(-5)
except ValueError as e:
    print(e)`,
      out: `age < 0`
    },
    {
      id: "common-errors", cat: "errors", term: "NameError  TypeError  IndexError",
      def: {
        uk: "Читай останній рядок трейсу: NameError — ім'я не існує, TypeError — не той тип (наприклад текст плюс число), IndexError — індекс поза межами, IndentationError — зламаний відступ.",
        en: "Read the last line of the trace: NameError means an unknown name, TypeError the wrong kind of value (text plus a number), IndexError an index outside the range, IndentationError broken indentation.",
        tr: "İzin son satırını oku: NameError bilinmeyen ad, TypeError yanlış tür (metin ile sayı toplamak gibi), IndexError aralık dışı indeks, IndentationError bozuk girinti demektir."
      },
      code: `nums = [1, 2]
print(nums[0] + 1)
try:
    print(nums[5])
except IndexError:
    print("out of range")`,
      out: `2
out of range`
    },

    /* --- Файли --- */
    {
      id: "open", cat: "files", term: "open()",
      def: {
        uk: "Відкриває файл і повертає об'єкт для роботи з ним. Режим \"r\" читає, \"w\" перезаписує з нуля, \"a\" дописує в кінець, \"b\" додає двійковий формат.",
        en: "Opens a file and returns an object to work with. Mode \"r\" reads, \"w\" overwrites from scratch, \"a\" appends at the end, \"b\" switches to binary.",
        tr: "Bir dosyayı açar ve üzerinde çalışılacak bir nesne döndürür. \"r\" modu okur, \"w\" baştan yazar, \"a\" sonuna ekler, \"b\" ikili biçime geçer."
      },
      code: `f = open("demo.txt", "w")
f.write("line 1\\nline 2\\n")
f.close()

f = open("demo.txt")
print(f.read().strip())
f.close()`,
      out: `line 1
line 2`
    },
    {
      id: "with", cat: "files", term: "with",
      def: {
        uk: "Конструкція з відступом, яка сама закриває файл — навіть коли всередині сталася помилка. Із нею ніколи не забуваєш close().",
        en: "An indented construct that closes the file for you — even if something fails inside. With it you never forget close().",
        tr: "Dosyayı senin yerine kapatan girintili yapı — içeride bir hata olsa bile. Bununla close() hiç unutulmaz."
      },
      code: `with open("demo.txt", "w") as f:
    f.write("alpha\\n")

with open("demo.txt") as f:
    print(f.readline().strip())`,
      out: `alpha`
    },
    {
      id: "read-write", cat: "files", term: "read()  readlines()",
      def: {
        uk: "read повертає весь текст одним рядком, readline — один рядок, readlines — список рядків. Для пострічового читання достатньо for line in f.",
        en: "read returns the whole text as one string, readline gives one line, readlines returns a list of lines. To walk a file line by line, for line in f is enough.",
        tr: "read tüm metni tek satır olarak döndürür, readline bir satır verir, readlines satırlar listesi döndürür. Satır satır gezmek için for line in f yeterlidir."
      },
      code: `with open("demo.txt", "w") as f:
    f.write("a\\nb\\nc\\n")

with open("demo.txt") as f:
    print(len(f.readlines()))

with open("demo.txt") as f:
    print(f.read().count("b"))`,
      out: `3
1`
    },
    {
      id: "json", cat: "files", term: "json  dump()  load()",
      def: {
        uk: "Модуль json перетворює словники та списки на текст і назад: dumps і loads працюють із рядком, dump і load — із файлом. Так зберігають налаштування програми.",
        en: "The json module turns dictionaries and lists into text and back: dumps and loads work on a string, dump and load work on a file. That is how settings get saved.",
        tr: "json modülü sözlük ve listeleri metne çevirir, geri de alır: dumps ve loads metinle, dump ve load dosyayla çalışır. Ayarlar böyle saklanır."
      },
      code: `import json

data = {"lvl": 3, "tags": ["a", "b"]}
text = json.dumps(data, sort_keys=True)
print(text)
print(json.loads(text)["lvl"])`,
      out: `{"lvl": 3, "tags": ["a", "b"]}
3`
    },

    /* --- Класи --- */
    {
      id: "class", cat: "oop", term: "class",
      def: {
        uk: "Клас — кресленик об'єктів: у ньому лежать спільні атрибути та методи. Новий об'єкт створюють викликом імені класу з аргументами.",
        en: "A class is the blueprint of objects: it holds shared attributes and methods. A new object is made by calling the class name with arguments.",
        tr: "Sınıf, nesnelerin planıdır: ortak nitelikleri ve yöntemleri barındırır. Yeni nesne, sınıf adının argümanlarla çağrılmasıyla oluşur."
      },
      code: `class Dog:
    kind = "canine"

    def __init__(self, name):
        self.name = name

    def speak(self):
        return self.name + " woofs"

rex = Dog("Rex")
print(rex.kind, rex.speak())`,
      out: `canine Rex woofs`
    },
    {
      id: "init-self", cat: "oop", term: "__init__  self",
      def: {
        uk: "__init__ викликається в момент створення об'єкта й заповнює його поля. self — це сам об'єкт; його пишуть першим параметром у кожному методі.",
        en: "__init__ runs at the moment the object is created and fills in its fields. self is that very object and is written as the first parameter of every method.",
        tr: "__init__, nesne oluşturulduğu anda çalışır ve alanlarını doldurur. self o nesnenin ta kendisidir; her yöntemde ilk parametre olarak yazılır."
      },
      code: `class Counter:
    def __init__(self, start=0):
        self.value = start

    def add(self, n=1):
        self.value += n
        return self.value

c = Counter(10)
print(c.add(), c.add(5), c.value)`,
      out: `11 16 16`
    }
  ];

  const BY_ID = {};
  TERMS.forEach((x) => { BY_ID[x.id] = x; });
  const CAT_NAME = {};
  CATS.forEach((c) => { CAT_NAME[c.id] = c; });

  /* ---------- Стан ---------- */
  function getState() {
    let s = null;
    try { s = JSON.parse(localStorage.getItem(KEY + user())); } catch (e) { s = null; }
    if (!s || typeof s !== "object") s = {};
    if (!s.seen || typeof s.seen !== "object") s.seen = {};
    return s;
  }

  function saveState(s) {
    try { localStorage.setItem(KEY + user(), JSON.stringify(s)); } catch (e) { /* сховище переповнене */ }
  }

  function readCount(s) {
    let n = 0;
    for (const id in (s || getState()).seen) if (BY_ID[id]) n++;
    return n;
  }

  function markRead(id, on) {
    const s = getState();
    if (!BY_ID[id]) return readCount(s);
    if (on) {
      if (!s.seen[id]) {
        s.seen[id] = Date.now();
        saveState(s);
        const done = readCount(s);
        document.dispatchEvent(new CustomEvent("glossaryread", {
          detail: { term: id, count: done, total: TERMS.length, all: done === TERMS.length }
        }));
      }
    } else if (s.seen[id]) {
      delete s.seen[id];
      saveState(s);
    }
    return readCount(s);
  }

  /* ---------- Фільтри ---------- */
  let query = "";
  let activeCat = "all";
  let onlyUnread = false;
  const expanded = {};

  function matches(term, s) {
    if (activeCat !== "all" && term.cat !== activeCat) return false;
    if (onlyUnread && s.seen[term.id]) return false;
    const q = query.trim().toLowerCase();
    if (!q) return true;
    const hay = [
      term.term,
      L(term.def),
      term.def.uk,
      term.def.en,
      L(CAT_NAME[term.cat].name),
      term.code
    ].join(" ").toLowerCase();
    return q.split(/\s+/).every((w) => hay.indexOf(w) >= 0);
  }

  function visible(s) {
    return TERMS.filter((x) => matches(x, s));
  }

  /* ---------- Елементи ---------- */
  let ready = false;
  let listEl, searchEl, chipsEl, statsEl, barEl, emptyEl, resetBtn, filterBtn;

  function escapeHtml(s) {
    return String(s).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
  }

  /* ---------- Рендер ---------- */
  function renderStats(s) {
    const done = readCount(s);
    const total = TERMS.length;
    if (statsEl) statsEl.textContent = t("gloss.stats", { done: done, total: total });
    if (barEl) barEl.style.width = (total ? (done / total) * 100 : 0).toFixed(1) + "%";
  }

  function renderChips() {
    if (!chipsEl) return;
    const parts = ['<button class="gloss-chip' + (activeCat === "all" ? " on" : "") +
      '" type="button" data-cat="all"><span class="material-icons">apps</span>' +
      '<span>' + escapeHtml(t("gloss.catAll")) + "</span></button>"];
    CATS.forEach((c) => {
      const n = TERMS.filter((x) => x.cat === c.id).length;
      parts.push('<button class="gloss-chip' + (activeCat === c.id ? " on" : "") +
        '" type="button" data-cat="' + c.id + '"><span class="material-icons">' + c.ico + "</span>" +
        "<span>" + escapeHtml(L(c.name)) + "</span><b>" + n + "</b></button>");
    });
    chipsEl.innerHTML = parts.join("");
  }

  function card(term, s) {
    const seen = !!s.seen[term.id];
    const open = !!expanded[term.id];
    const cat = CAT_NAME[term.cat];
    const io = [];
    if (term.inp) io.push('<div class="gloss-io"><span class="gloss-io-tag">' + escapeHtml(t("tasks.inputData")) + "</span><pre>" + escapeHtml(term.inp) + "</pre></div>");
    if (term.out) io.push('<div class="gloss-io"><span class="gloss-io-tag">' + escapeHtml(t("tasks.outputData")) + "</span><pre>" + escapeHtml(term.out) + "</pre></div>");
    return '' +
      '<article class="gloss-card elev2' + (seen ? " seen" : "") + (open ? " open" : "") + '" data-id="' + term.id + '">' +
        '<button class="gloss-card-head" type="button" data-act="toggle" aria-expanded="' + (open ? "true" : "false") + '">' +
          '<code class="gloss-term">' + escapeHtml(term.term) + "</code>" +
          '<span class="gloss-cat"><span class="material-icons">' + cat.ico + "</span>" + escapeHtml(L(cat.name)) + "</span>" +
          '<span class="material-icons gloss-state">' + (seen ? "check_circle" : "radio_button_unchecked") + "</span>" +
          '<span class="material-icons gloss-arrow">' + (open ? "expand_less" : "expand_more") + "</span>" +
        "</button>" +
        '<p class="gloss-def">' + escapeHtml(L(term.def)) + "</p>" +
        (open ? '<div class="gloss-body">' +
          '<pre class="gloss-code code-block">' + escapeHtml(term.code) + "</pre>" +
          (io.join("") || "") +
          '<div class="gloss-actions">' +
            '<button class="btn contained" type="button" data-act="editor"><span class="material-icons">edit_note</span><span>' + escapeHtml(t("gloss.openEditor")) + "</span></button>" +
            '<button class="btn outlined" type="button" data-act="copy"><span class="material-icons">content_copy</span><span>' + escapeHtml(t("gloss.copy")) + "</span></button>" +
            '<button class="btn text" type="button" data-act="seen"><span class="material-icons">' + (seen ? "bookmark_remove" : "bookmark_add") + "</span><span>" + escapeHtml(seen ? t("gloss.unmark") : t("gloss.mark")) + "</span></button>" +
          "</div>" +
        "</div>" : "") +
      "</article>";
  }

  function renderList(s) {
    if (!listEl) return;
    const state = s || getState();
    const items = visible(state);
    listEl.innerHTML = items.map((x) => card(x, state)).join("");
    if (emptyEl) emptyEl.classList.toggle("hidden", items.length > 0);
  }

  function renderFilter() {
    if (!filterBtn) return;
    const s = getState();
    const left = TERMS.length - readCount(s);
    filterBtn.classList.toggle("on", onlyUnread);
    const label = filterBtn.querySelector("span:last-child");
    if (label) label.textContent = t("gloss.onlyUnread", { n: left });
    filterBtn.disabled = left === 0 && !onlyUnread;
  }

  function render() {
    if (!listEl) { if (!ready) init(); return; }
    const s = getState();
    renderStats(s);
    renderChips();
    renderList(s);
    renderFilter();
  }

  /* ---------- Дії ---------- */
  function openInEditor(term) {
    const editor = $("#code");
    if (!editor) {
      if (global.App && global.App.toast) global.App.toast(t("tasks.unavailable"));
      return;
    }
    const stdin = $("#pyStdin");
    if (stdin && term.inp) stdin.value = term.inp + "\n";
    editor.value = term.code;
    // input() у прикладі читає поле «Ввід», тому надсилаємо подію вже після обох значень
    editor.dispatchEvent(new Event("input", { bubbles: true }));
    if (global.App && global.App.route) global.App.route("python");
    else location.hash = "#python";
    if (global.App && global.App.toast) global.App.toast(t("gloss.editorToast"));
    if (global.Audio && global.Audio.sfx) global.Audio.sfx("pop");
  }

  async function copyCode(term) {
    const text = term.code;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) await navigator.clipboard.writeText(text);
      else throw new Error("no clipboard");
      if (global.App && global.App.toast) global.App.toast(t("gloss.copied"));
    } catch (e) {
      const editor = $("#code");
      if (editor) { openInEditor(term); return; }
      if (global.App && global.App.toast) global.App.toast(t("gloss.copyFailed"));
    }
  }

  function onClick(ev) {
    const btn = ev.target.closest("[data-act]");
    if (!btn) return;
    const cardEl = btn.closest(".gloss-card");
    if (!cardEl) return;
    const term = BY_ID[cardEl.getAttribute("data-id")];
    if (!term) return;
    const act = btn.getAttribute("data-act");
    const sfx = (n) => { if (global.Audio && global.Audio.sfx) global.Audio.sfx(n); };
    if (act === "toggle") {
      expanded[term.id] = !expanded[term.id];
      if (expanded[term.id]) markRead(term.id, true);
      const s = getState();
      renderStats(s);
      renderList(s);
      renderFilter();
      sfx("pop");
    } else if (act === "editor") {
      openInEditor(term);
    } else if (act === "copy") {
      copyCode(term);
    } else if (act === "seen") {
      const s = getState();
      const next = !s.seen[term.id];
      markRead(term.id, next);
      const after = getState();
      renderStats(after);
      renderList(after);
      renderFilter();
      sfx(next ? "success" : "click");
    }
  }

  /* ---------- Ініціалізація ---------- */
  function init() {
    if (ready) { render(); return; }
    listEl = $("#glossList");
    if (!listEl) return;
    ready = true;
    searchEl = $("#glossSearch");
    chipsEl = $("#glossCats");
    statsEl = $("#glossStats");
    barEl = $("#glossBarFill");
    emptyEl = $("#glossEmpty");
    resetBtn = $("#glossReset");
    filterBtn = $("#glossUnread");

    listEl.addEventListener("click", onClick);

    if (searchEl) searchEl.addEventListener("input", () => {
      query = searchEl.value || "";
      renderList();
    });

    if (chipsEl) chipsEl.addEventListener("click", (ev) => {
      const chip = ev.target.closest(".gloss-chip");
      if (!chip) return;
      activeCat = chip.getAttribute("data-cat");
      render();
      if (global.Audio && global.Audio.sfx) global.Audio.sfx("click");
    });

    if (resetBtn) resetBtn.addEventListener("click", () => {
      if (!confirm(t("gloss.resetConfirm"))) return;
      const s = getState();
      s.seen = {};
      saveState(s);
      Object.keys(expanded).forEach((k) => { delete expanded[k]; });
      render();
      if (global.App && global.App.toast) global.App.toast(t("gloss.resetDone"));
    });

    if (filterBtn) filterBtn.addEventListener("click", () => {
      onlyUnread = !onlyUnread;
      render();
      if (global.Audio && global.Audio.sfx) global.Audio.sfx("click");
    });

    document.addEventListener("langchange", () => {
      try { render(); } catch (e) { console.warn("glossary langchange", e); }
    });

    render();
    console.info("[glossary.js] ready", TERMS.length);
  }

  global.Glossary = {
    init,
    render,
    terms: TERMS,
    cats: CATS,
    count: TERMS.length,
    stats: () => {
      const s = getState();
      return { read: readCount(s), total: TERMS.length, seen: s.seen };
    },
    mark: markRead,
    filter: (cat) => { activeCat = cat || "all"; render(); },
    search: (q) => { query = q || ""; render(); }
  };
})(window);
