/* projects.js — розділ «Проєкти»: п'ять напрямків по три кроки. Кожен крок — маленька
   програма з власними тестами, які перевіряються через Pyodide (той самий рушій, що й у «Задачах»).
   Прогрес зберігається локально: app.projects.<user>, код кроку: app.projects.code.<user>.<stepId> */
(function (global) {
  const $ = (s) => document.querySelector(s);
  const KEY = "app.projects.";
  const CODE_KEY = "app.projects.code.";
  const POINTS = { 1: 10, 2: 15, 3: 20 };
  const LEVEL_KEYS = { 1: "tasks.level1", 2: "tasks.level2", 3: "tasks.level3" };

  /* ---------- Дані ---------- */
  const PROJECTS = [
    {
      id: "calc", level: 1, ico: "calculate",
      title: { uk: "Калькулятор", en: "Calculator", tr: "Hesap makinesi" },
      desc: {
        uk: "Кілька рядків, які перетворюють два числа на справжній калькулятор: від суми до циклу, що обробляє вираз за виразом.",
        en: "A few lines that turn two numbers into a real calculator: from a simple sum to a loop handling one expression after another.",
        tr: "İki sayıyı gerçek bir hesap makinesine dönüştüren birkaç satır: basit toplamdan, ard arda ifade işleyen döngüye."
      },
      steps: [
        {
          title: { uk: "Сума й різниця", en: "Sum and difference", tr: "Toplam ve fark" },
          text: {
            uk: "На вхід надходять два цілих числа, кожне в окремому рядку. Виведи два рядки: спершу їхню суму, потім різницю (перше число мінус друге).",
            en: "Two integers arrive, one per line. Print two lines: first their sum, then the difference (the first number minus the second).",
            tr: "Her biri ayrı satırda iki tam sayı giriliyor. İki satır yazdır: önce toplamları, sonra farkları (birinci sayı eksi ikinci)."
          },
          hint: {
            uk: "Прочитай обидва числа через int(input()) і зроби два окремих print: один для a + b, другий для a - b.",
            en: "Read both numbers with int(input()) and use two separate print calls: one for a + b, one for a - b.",
            tr: "İki sayıyı int(input()) ile oku ve iki ayrı print kullan: biri a + b için, diğeri a - b için."
          },
          starter: `a = int(input())
b = int(input())
`,
          tests: [
            { in: "3\n5\n", out: "8\n-2" },
            { in: "10\n4\n", out: "14\n6" },
            { in: "0\n7\n", out: "7\n-7" }
          ]
        },
        {
          title: { uk: "Чотири дії", en: "Four operations", tr: "Dört işlem" },
          text: {
            uk: "Вхід складається з трьох рядків: перше число, оператор (один із +, -, *, /) і друге число. Виведи результат однієї дії; для ділення беріть звичайний /, без цілої частини.",
            en: "The input is three lines: the first number, an operator (one of +, -, *, /) and the second number. Print the result of that single operation; for division use plain /, not integer division.",
            tr: "Girdi üç satırdan oluşur: birinci sayı, bir işlem (+, -, *, / işaretlerinden biri) ve ikinci sayı. Tek işlemin sonucunu yazdır; bölmede tam bölmeyi değil normal / kullan."
          },
          hint: {
            uk: "Оператор прочитай рядком і прибери пробіли, далі вибери гілку через if/elif: для ділення print(a / b) — Python сам покаже дрібове число.",
            en: "Read the operator as a line, strip the spaces, then choose the branch with if/elif: for division print(a / b) and Python shows the fractional result itself.",
            tr: "İşareti satır olarak oku, boşlukları temizle ve if/elif ile dalı seç: bölme için print(a / b) yaz, Python kesirli sonucu kendisi gösterir."
          },
          starter: `a = int(input())
op = input().strip()
b = int(input())
`,
          tests: [
            { in: "12\n+\n8\n", out: "20" },
            { in: "7\n/\n2\n", out: "3.5" },
            { in: "5\n*\n-4\n", out: "-20" }
          ]
        },
        {
          title: { uk: "Цикл обчислень", en: "A loop of calculations", tr: "Döngüyle hesaplama" },
          text: {
            uk: "Програма читає рядки вигляду «число оператор число» і зупиняється, коли зустріне рядок 'end'. На кожен рядок із прикладом виведи окремий рядок із результатом.",
            en: "The program reads lines shaped like number operator number and stops when it meets the line 'end'. For every example line, print one line with the result.",
            tr: "Program sayı işlem sayı biçimindeki satırları okur ve 'end' satırını görünce durur. Her örnek satırı için bir satır sonuç yazdır."
          },
          hint: {
            uk: "Зроби нескінченний цикл із input(), у ньому вийди через break на рядку 'end', а решту розбий методом split() на три частини.",
            en: "Run an endless loop with input(), break out of it on the 'end' line and split the rest into three parts with split().",
            tr: "input() ile sonsuz bir döngü kur, 'end' satırında break ile çık ve kalanını split() ile üç parcaya ayır."
          },
          starter: ``,
          tests: [
            { in: "12 + 8\n7 * 3\nend\n", out: "20\n21" },
            { in: "10 / 4\nend\n", out: "2.5" },
            { in: "1 - 1\n5 + 0\nend\n", out: "0\n5" }
          ]
        }
      ]
    },
    {
      id: "grades", level: 2, ico: "school",
      title: { uk: "Журнал оцінок", en: "Grade book", tr: "Not defteri" },
      desc: {
        uk: "Клас як дані: середній бал усіх учнів, літерна оцінка за шкалою й пошук найкращого результата у словнику.",
        en: "A class as data: the average score of everyone, a letter grade from a scale and finding the best result in a dictionary.",
        tr: "Sınıf olarak veri: herkesin ortalaması, ölçeğe göre harf notu ve bir sözlükte en iyi sonucu bulma."
      },
      steps: [
        {
          title: { uk: "Середній бал", en: "Average score", tr: "Ortalama not" },
          text: {
            uk: "У першому рядку стоїть кількість оцінок n, далі йдуть n цілих чисел — по одному в рядку. Виведи середнє арифметичне з одним знаком після коми.",
            en: "The first line holds the number of scores n, followed by n integers, one per line. Print the arithmetic mean with one digit after the decimal point.",
            tr: "İlk satırda not sayısı n, ardından satır başına bir tane olmak üzere n tam sayı gelir. Aritmetik ortalamayı virgülden sonra bir haneyle yazdır."
          },
          hint: {
            uk: "Збери всі числа в список через цикл, порахуй sum(scores) / len(scores) і виведи рядок у форматі f-strings із '.1f'.",
            en: "Collect every number into a list inside a loop, compute sum(scores) / len(scores) and print it with an f-string using '.1f'.",
            tr: "Tüm sayıları bir döngüyle listeye topla, sum(scores) / len(scores) hesapla ve '.1f' ile bir f-string üzerinden yazdır."
          },
          starter: `n = int(input())
`,
          tests: [
            { in: "3\n4\n5\n3\n", out: "4.0" },
            { in: "2\n5\n5\n", out: "5.0" },
            { in: "4\n2\n3\n4\n5\n", out: "3.5" }
          ]
        },
        {
          title: { uk: "Оцінка літерою", en: "Grade as a letter", tr: "Harflerle not" },
          text: {
            uk: "Дано одне ціле число — кількість балів від 0 до 100. Виведи літеру: 90 і більше — A, від 70 до 89 — B, від 50 до 69 — C, менше 50 — D.",
            en: "A single integer is given — points from 0 to 100. Print the letter: 90 and above is A, 70 to 89 is B, 50 to 69 is C, below 50 is D.",
            tr: "Tek bir tam sayı veriliyor — 0 ile 100 arası puan. Harfi yazdır: 90 ve üstü A, 70-89 B, 50-69 C, 50'den az D."
          },
          hint: {
            uk: "Перевіряй умови зверху вниз: if score >= 90, потім elif score >= 70, потім elif score >= 50, і нарешті else — D.",
            en: "Test the conditions from the top down: if score >= 90, then elif score >= 70, then elif score >= 50 and finally else — D.",
            tr: "Koşulları üstten alta doğru sına: if score >= 90, sonra elif score >= 70, ardından elif score >= 50 ve en son else — D."
          },
          starter: `score = int(input())
`,
          tests: [
            { in: "95\n", out: "A" },
            { in: "74\n", out: "B" },
            { in: "55\n", out: "C" },
            { in: "45\n", out: "D" }
          ]
        },
        {
          title: { uk: "Найкращий учень", en: "The best student", tr: "En iyi öğrenci" },
          text: {
            uk: "У першому рядку кількість учнів n, далі n рядків «ім'я бали». Виведи лише ім'я учня з найбільшою кількістю балів. Якщо лідерів кілька, виводь того, чиє ім'я йде раніше.",
            en: "The first line gives the number of students n, then n lines shaped name points. Print only the name of the student with the highest score. If several tie, print the one appearing first.",
            tr: "İlk satırda öğrenci sayısı n, ardından ad puan biçiminde n satır geliyor. Yalnızca en yüksek puana sahip öğrencinin adını yazdır. Eşitlik olursa önce geleni yazdır."
          },
          hint: {
            uk: "Зберігай пари у список кортежів і візьми max(students, key=lambda s: s[1]) — max лишає перший серед рівних.",
            en: "Store the pairs in a list of tuples and take max(students, key=lambda s: s[1]) — max keeps the first of equal winners.",
            tr: "Çiftleri tuple listesi olarak tut ve max(students, key=lambda s: s[1]) kullan — max eşitlerde ilkini korur."
          },
          starter: `n = int(input())
`,
          tests: [
            { in: "3\nOksana 92\nIvan 88\nMykola 95\n", out: "Mykola" },
            { in: "2\nAnna 60\nBohdan 60\n", out: "Anna" },
            { in: "1\nSlavik 100\n", out: "Slavik" }
          ]
        }
      ]
    },
    {
      id: "cipher", level: 3, ico: "lock",
      title: { uk: "Шифр Цезаря", en: "Caesar cipher", tr: "Sezar şifresi" },
      desc: {
        uk: "Заміщення по алфавіту: закодувати слово, розкодувати назад і поставити це на потік із багатьох слів.",
        en: "Alphabet substitution: encode a word, decode it back and then put the whole thing on a stream of many words.",
        tr: "Alfabe kaydırması: bir kelimeyi kodla, geri çöz ve ardından tümünü birçok kelimenin aktığı akışa çevir."
      },
      steps: [
        {
          title: { uk: "Зсув за алфавітом", en: "Shift through the alphabet", tr: "Alfabede kaydırma" },
          text: {
            uk: "Дано слово з малих латинських літер і число k. Виведи слово, де кожна літера зсунута праворуч на k позицій; після z знову починається з a.",
            en: "A word of lowercase Latin letters and a number k are given. Print the word where every letter moves k positions to the right; after z the alphabet wraps back to a.",
            tr: "Küçük Latin harflerinden bir kelime ve bir k sayısı veriliyor. Her harfi k konum sağa kayan kelimeyi yazdır; z'den sonra alfabe tekrar a'ya döner."
          },
          hint: {
            uk: "Для літери c порахуй нову позицію як (ord(c) - 97 + k) % 26 і перетвори назад на літеру через chr(... + 97).",
            en: "For a letter c compute the new position as (ord(c) - 97 + k) % 26 and turn it back into a letter with chr(... + 97).",
            tr: "Bir c harfi için yeni konumu (ord(c) - 97 + k) % 26 olarak hesapla ve chr(... + 97) ile tekrar harfe çevir."
          },
          starter: `word = input().strip()
k = int(input())
`,
          tests: [
            { in: "abc\n3\n", out: "def" },
            { in: "xyz\n3\n", out: "abc" },
            { in: "hello\n13\n", out: "uryyb" }
          ]
        },
        {
          title: { uk: "Розкодування", en: "Decoding", tr: "Şifreyi çözme" },
          text: {
            uk: "Той самий шифр, але навпаки: вхід — закодоване слово та зсув k. Вивди оригінальне слово.",
            en: "The same cipher but backwards: the input is the encoded word and the shift k. Print the original word.",
            tr: "Aynı şifre ama tersine: girdi kodlanmış kelime ve k kaydırması. Orijinal kelimeyi yazdır."
          },
          hint: {
            uk: "Зсувай літери вліво формулою (ord(c) - 97 - k) % 26 — Python рахує від'ємний залишок правильно, окрема перевірка не потрібна.",
            en: "Shift the letters left with (ord(c) - 97 - k) % 26 — Python computes a negative remainder correctly, so no extra check is needed.",
            tr: "Harfleri (ord(c) - 97 - k) % 26 ile sola kaydır — Python negatif kalanı doğru hesaplar, ek kontrol gerekmez."
          },
          starter: `word = input().strip()
k = int(input())
`,
          tests: [
            { in: "def\n3\n", out: "abc" },
            { in: "uryyb\n13\n", out: "hello" },
            { in: "abc\n1\n", out: "zab" }
          ]
        },
        {
          title: { uk: "Пакетне кодування", en: "Batch encoding", tr: "Toplu kodlama" },
          text: {
            uk: "У першому рядку кількість слів n, далі n рядків «слово k». Для кожного рядка виведи закодоване слово — теж по одному в рядку, у тому ж порядку.",
            en: "The first line is the number of words n, then n lines shaped word k. For every line print the encoded word, one per line, in the same order.",
            tr: "İlk satır kelime sayısı n, ardından kelime k biçiminde n satır geliyor. Her satır için kodlanmış kelimeyi aynı sırayla satır satır yazdır."
          },
          hint: {
            uk: "Винеси зсув у власну функцію encode(word, k) і викликай її в циклі, розбиваючи рядок через split().",
            en: "Move the shift into your own function encode(word, k) and call it inside a loop, splitting each line with split().",
            tr: "Kaydırmayı kendi encode(word, k) fonksiyonuna taşı ve döngü içinde çağır; her satırı split() ile böl."
          },
          starter: `n = int(input())
`,
          tests: [
            { in: "2\nabc 1\nxyz 2\n", out: "bcd\nzab" },
            { in: "1\npython 5\n", out: "udymts" },
            { in: "3\na 0\nb 25\nzzz 1\n", out: "a\na\naaa" }
          ]
        }
      ]
    },
    {
      id: "todo", level: 2, ico: "checklist",
      title: { uk: "Список справ", en: "To-do list", tr: "Yapılacaklar listesi" },
      desc: {
        uk: "Побутова програма з трьох екранів: нумерація справ, видалення виконаної та звіт про те, що ще лишилось.",
        en: "An everyday program built from three screens: numbering the tasks, removing a finished one and reporting what is still left.",
        tr: "Üç ekrandan oluşan gündelik program: işleri numaralandırma, biteni silme ve kalanları raporlama."
      },
      steps: [
        {
          title: { uk: "Нумерований список", en: "Numbered list", tr: "Numaralı liste" },
          text: {
            uk: "У першому рядку кількість справ n, далі n рядків із назвами (назва може містити пробіли). Виведи список у форматі «1. назва», «2. назва» — нумерація починається з одиниці.",
            en: "The first line is the number of tasks n, then n lines with names (a name may contain spaces). Print the list shaped 1. name, 2. name — numbering starts at one.",
            tr: "İlk satır iş sayısı n, ardından adları içeren n satır geliyor (ad boşluk içerebilir). Listeyi 1. ad, 2. ad biçiminde yazdır — numaralandırma birden başlar."
          },
          hint: {
            uk: "Цикл for i, name in enumerate(names, 1) дає номер одразу; вивід зручний через print(f'{i}. {name}').",
            en: "The loop for i, name in enumerate(names, 1) hands you the number directly; print it with print(f'{i}. {name}').",
            tr: "for i, name in enumerate(names, 1) döngüsü numarayı doğrudan verir; print(f'{i}. {name}') ile yazdır."
          },
          starter: `n = int(input())
`,
          tests: [
            { in: "2\nBuy milk\nCode\n", out: "1. Buy milk\n2. Code" },
            { in: "1\na\n", out: "1. a" },
            { in: "3\nx\ny\nz\n", out: "1. x\n2. y\n3. z" }
          ]
        },
        {
          title: { uk: "Видалення за номером", en: "Removing by number", tr: "Numaraya göre silme" },
          text: {
            uk: "Знову перший рядок — кількість справ n, далі назви, а в останньому рядку стоїть номер виконаної справи. Виведи решту справ, пронумеровані заново по порядку.",
            en: "Again the first line is the number of tasks n, then the names, and the last line holds the number of the finished task. Print the remaining tasks renumbered in order.",
            tr: "Yine ilk satır iş sayısı n, ardından adlar, son satırda ise biten işin numarası var. Kalan işleri sırayla yeniden numaralandırıp yazdır."
          },
          hint: {
            uk: "Номер на один більший за індекс у списку, тому візьми зріз names[:k - 1] + names[k:] і знову enumerate з одиниці.",
            en: "The number is one greater than the list index, so take the slice names[:k - 1] + names[k:] and run enumerate from one again.",
            tr: "Numara liste indeksinden bir büyük olduğundan names[:k - 1] + names[k:] dilimini al ve enumerate'ı yeniden birden başlat."
          },
          starter: `n = int(input())
names = [input() for _ in range(n)]
k = int(input())
`,
          tests: [
            { in: "3\na\nb\nc\n2\n", out: "1. a\n2. c" },
            { in: "2\na\nb\n1\n", out: "1. b" },
            { in: "4\na\nb\nc\nd\n4\n", out: "1. a\n2. b\n3. c" }
          ]
        },
        {
          title: { uk: "Звіт про виконане", en: "A report on progress", tr: "Durum raporu" },
          text: {
            uk: "У першому рядку n, далі n рядків «справа статус», де статус — done або todo. Виведи два рядки: «done: k» і «todo: m», а після них назви справ у статусі todo, відсортовані за алфавітом, по одній на рядок.",
            en: "The first line is n, then n lines shaped task status, where the status is done or todo. Print two lines: done: k and todo: m, followed by the todo task names sorted alphabetically, one per line.",
            tr: "İlk satır n, ardından iş durum biçiminde n satır geliyor; durum done ya da todo olur. Önce done: k ve todo: m satırlarını, sonra todo işlerin adlarını alfabeye göre sıralayıp satır satır yazdır."
          },
          hint: {
            uk: "Розкладай рядок через split() на назву й статус, збирай два списки, а сортування робить звичний sorted(names).",
            en: "Split each line into a name and a status, keep two lists and let the usual sorted(names) do the ordering.",
            tr: "Her satırı ad ve durum olarak böl, iki liste tut ve sıralamayı alıştığın sorted(names) ile yap."
          },
          starter: `n = int(input())
`,
          tests: [
            { in: "3\nmilk done\ncode todo\nfish done\n", out: "done: 2\ntodo: 1\ncode" },
            { in: "2\na todo\nb todo\n", out: "done: 0\ntodo: 2\na\nb" },
            { in: "3\nz done\ny done\nx done\n", out: "done: 3\ntodo: 0" }
          ]
        }
      ]
    },
    {
      id: "textstats", level: 3, ico: "text_analysis",
      title: { uk: "Аналіз тексту", en: "Text analysis", tr: "Metin analizi" },
      desc: {
        uk: "Один рядок тексту — і три задачі на множини, рядки та словники лічильників: скільки слів, яке найдовше й як часто повторюється кожне.",
        en: "A single line of text and three exercises on sets, strings and counter dictionaries: how many words, which one is longest and how often each repeats.",
        tr: "Tek satır metin ve kümeler, diziler ile sayaç sözlükleri üzerine üç alıştırma: kaç kelime, en uzunu hangisi ve her biri ne sıklıkta tekrar ediyor."
      },
      steps: [
        {
          title: { uk: "Рахунок слів", en: "Counting words", tr: "Kelime sayımı" },
          text: {
            uk: "Дано один рядок тексту. Виведи два числа в окремих рядках: спочатку скільки слів узагалі, потім скільки з них різні.",
            en: "One line of text is given. Print two numbers on separate lines: first how many words there are in total, then how many of them are different.",
            tr: "Tek satır metin veriliyor. Ayrı satırlarda iki sayı yazdır: önce toplam kelime sayısı, sonra farklı olanların sayısı."
          },
          hint: {
            uk: "words = line.split() дає всі слова, а len(set(words)) — кількість різних; порядок двох print рішає все.",
            en: "words = line.split() gives every word and len(set(words)) the number of distinct ones; the order of the two print calls decides it all.",
            tr: "words = line.split() tüm kelimeleri, len(set(words)) ise farklı olanların sayısını verir; iki print çağrısının sırası her şeyi belirler."
          },
          starter: `line = input()
`,
          tests: [
            { in: "a b a\n", out: "3\n2" },
            { in: "python is fun\n", out: "3\n3" },
            { in: "to be or not to be\n", out: "6\n4" }
          ]
        },
        {
          title: { uk: "Найдовше слово", en: "The longest word", tr: "En uzun kelime" },
          text: {
            uk: "Виведи найдовше слово та його довжину — два рядки саме в цьому порядку. Якщо найдовших слів кілька, береться те, що зустрічається раніше.",
            en: "Print the longest word and its length — two lines in exactly that order. If several words tie for the longest, take the one appearing first.",
            tr: "En uzun kelimeyi ve uzunluğunu — tam bu sırayla iki satır olarak yazdır. Birden çok kelime eşitse önce geleni al."
          },
          hint: {
            uk: "max(words, key=len) повертає перше серед найдовших, а довжину рахує звичний len(word).",
            en: "max(words, key=len) returns the first of the longest words, and the usual len(word) counts its length.",
            tr: "max(words, key=len) en uzuların ilkini döndürür, uzunluğu da alıştığın len(word) sayar."
          },
          starter: `words = input().split()
`,
          tests: [
            { in: "hello world\n", out: "hello\n5" },
            { in: "a bb ccc\n", out: "ccc\n3" },
            { in: "python python2 x\n", out: "python2\n7" }
          ]
        },
        {
          title: { uk: "Частоти слів", en: "Word frequencies", tr: "Kelime sıklıkları" },
          text: {
            uk: "Для кожного різного слова виведи рядок «слово кількість». Рядки мають бути відсортовані за алфавітом.",
            en: "For every distinct word print a line shaped word count. The lines must be sorted alphabetically.",
            tr: "Her farklı kelime için kelime adet biçiminde bir satır yazdır. Satırlar alfabeye göre sıralı olmalı."
          },
          hint: {
            uk: "Лічильник зроби словником: counts[w] = counts.get(w, 0) + 1, а далі for w in sorted(counts) друкуй пари.",
            en: "Build the counter as a dictionary: counts[w] = counts.get(w, 0) + 1, then loop for w in sorted(counts) and print the pairs.",
            tr: "Sayacı sözlük olarak kur: counts[w] = counts.get(w, 0) + 1; ardından for w in sorted(counts) döngüsüyle çiftleri yazdır."
          },
          starter: `words = input().split()
`,
          tests: [
            { in: "a b a\n", out: "a 2\nb 1" },
            { in: "to be or not to be\n", out: "be 2\nnot 1\nor 1\nto 2" },
            { in: "x x x\n", out: "x 3" }
          ]
        }
      ]
    }
  ];

  /* ---------- Індекси ---------- */
  const STEPS = {};
  const ORDER = [];
  PROJECTS.forEach((proj) => {
    proj.steps.forEach((step, i) => {
      const id = proj.id + "-" + (i + 1);
      step.id = id;
      step.project = proj;
      step.number = i + 1;
      step.level = proj.level;
      STEPS[id] = step;
      ORDER.push(id);
    });
  });
  const TOTAL_STEPS = ORDER.length;
  const TOTAL_POINTS = ORDER.reduce((sum, id) => sum + POINTS[STEPS[id].level], 0);

  /* ---------- Побічники ---------- */
  let listEl, stageEl, introEl, stepsEl, pointsEl, projectsEl, progressEl;
  let stageHead, stageTitle, stageText, stageExample, codeEl, statusEl, hintBoxEl;
  let checkBtn, hintBtn, resetBtn, backBtn;
  let currentStep = null;
  let currentProject = null;
  let busy = false;
  let ready = false;

  function t(k, v) { return global.I18n ? global.I18n.t(k, v) : k; }
  function pick(o) { return global.I18n ? global.I18n.localize(o) : (o && o.uk) || ""; }
  function toast(msg) { if (global.App && global.App.toast) global.App.toast(msg); }
  function sfx(name) { global.Audio2 && global.Audio2.SFX && global.Audio2.SFX[name] && global.Audio2.SFX[name](); }

  function el(tag, cls, text) {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text != null) node.textContent = text;
    return node;
  }

  function user() { return (global.Profile && global.Profile.handle()) || "guest"; }

  function getState() {
    const fallback = { steps: {} };
    try {
      const raw = JSON.parse(localStorage.getItem(KEY + user()));
      if (raw && raw.steps) return Object.assign(fallback, raw);
    } catch (e) { /* пошкоджений запис — починаємо заново */ }
    return fallback;
  }

  function saveState(s) { localStorage.setItem(KEY + user(), JSON.stringify(s)); }

  function doneCount(s) { return Object.keys(s.steps).filter((id) => STEPS[id]).length; }

  function pointsOf(s) {
    return Object.keys(s.steps).reduce((sum, id) => (STEPS[id] ? sum + POINTS[STEPS[id].level] : sum), 0);
  }

  function projectDone(s, proj) { return proj.steps.every((_, i) => s.steps[proj.id + "-" + (i + 1)]); }

  function finishedCount(s) { return PROJECTS.filter((p) => projectDone(s, p)).length; }

  function codeKey(id) { return CODE_KEY + user() + "." + id; }

  /* ---------- Список проєктів ---------- */
  function renderSummary(s) {
    if (stepsEl) stepsEl.textContent = t("proj.stepsTotal", { n: doneCount(s), total: TOTAL_STEPS });
    if (pointsEl) pointsEl.textContent = t("proj.pointsTotal", { p: pointsOf(s), max: TOTAL_POINTS });
    if (projectsEl) projectsEl.textContent = t("proj.finishedTotal", { n: finishedCount(s), total: PROJECTS.length });
    if (progressEl) {
      progressEl.innerHTML = "";
      const bar = el("div", "proj-bar");
      const fill = el("div", "proj-bar-fill");
      fill.style.width = Math.round((doneCount(s) / TOTAL_STEPS) * 100) + "%";
      bar.appendChild(fill);
      progressEl.appendChild(bar);
      progressEl.appendChild(el("span", "proj-bar-label", Math.round((doneCount(s) / TOTAL_STEPS) * 100) + "%"));
    }
  }

  function renderList() {
    if (!listEl) return;
    const s = getState();
    listEl.innerHTML = "";
    PROJECTS.forEach((proj) => {
      const card = el("div", "card elev2 proj-card" + (currentProject === proj.id ? " open" : ""));
      card.setAttribute("role", "button");
      card.setAttribute("tabindex", "0");

      const head = el("div", "proj-card-head");
      const ico = el("span", "proj-ico material-icons", proj.ico);
      const titles = el("div", "proj-card-titles");
      titles.appendChild(el("h3", "proj-card-title", pick(proj.title)));
      titles.appendChild(el("p", "proj-card-desc muted", pick(proj.desc)));
      const badge = el("span", "proj-card-badge" + (projectDone(s, proj) ? " done" : ""),
        projectDone(s, proj) ? t("proj.allDone") : t("proj.progress", { done: proj.steps.filter((_, i) => s.steps[proj.id + "-" + (i + 1)]).length, total: proj.steps.length }));
      head.append(ico, titles, badge);
      card.appendChild(head);

      const meta = el("div", "proj-card-meta");
      meta.appendChild(el("span", "task-level-badge", t(LEVEL_KEYS[proj.level])));
      meta.appendChild(el("span", "task-card-points", t("proj.stepPoints", { p: POINTS[proj.level], n: proj.steps.length })));
      card.appendChild(meta);

      const steps = el("div", "proj-steps");
      proj.steps.forEach((step, i) => {
        const id = proj.id + "-" + (i + 1);
        const solved = !!s.steps[id];
        const chip = el("button", "proj-step-chip" + (solved ? " solved" : "") + (currentStep && currentStep.id === id ? " active" : ""), null);
        chip.type = "button";
        chip.appendChild(el("span", "material-icons", solved ? "check_circle" : "radio_button_unchecked"));
        chip.appendChild(el("span", null, t("proj.stepBadge", { n: i + 1 }) + " · " + pick(step.title)));
        chip.onclick = (ev) => { ev.stopPropagation(); openStep(id); };
        steps.appendChild(chip);
      });
      card.appendChild(steps);

      card.onclick = () => toggleProject(proj.id);
      card.onkeydown = (ev) => { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); toggleProject(proj.id); } };
      listEl.appendChild(card);
    });
  }

  function toggleProject(id) {
    currentProject = currentProject === id ? null : id;
    sfx("click");
    renderList();
  }

  /* ---------- Екран кроку ---------- */
  function renderStageMeta(s) {
    if (!stageHead || !currentStep) return;
    stageHead.innerHTML = "";
    const proj = currentStep.project;
    stageHead.appendChild(el("span", "task-level-badge", t(LEVEL_KEYS[proj.level])));
    stageHead.appendChild(el("span", "task-card-points", t("tasks.points", { p: POINTS[proj.level] })));
    stageHead.appendChild(el("span", "proj-card-badge", t("proj.stepBadge", { n: currentStep.number }) + " · " + pick(proj.title)));
    if (s.steps[currentStep.id]) {
      const badge = el("span", "task-solved-badge");
      badge.appendChild(el("span", "material-icons", "task_alt"));
      badge.appendChild(el("span", null, t("proj.stepDone")));
      stageHead.appendChild(badge);
    }
  }

  function renderExample() {
    if (!stageExample || !currentStep) return;
    stageExample.innerHTML = "";
    const first = currentStep.tests[0];
    const wrap = el("div", "task-example-inner");
    const colIn = el("div", "task-example-col");
    colIn.appendChild(el("span", "task-example-label", t("tasks.inputData")));
    colIn.appendChild(el("pre", "task-example-pre", first.in.replace(/\n+$/g, "")));
    const colOut = el("div", "task-example-col");
    colOut.appendChild(el("span", "task-example-label", t("tasks.outputData")));
    colOut.appendChild(el("pre", "task-example-pre", first.out));
    wrap.append(colIn, colOut);
    stageExample.appendChild(el("div", "task-example-title", t("tasks.example")));
    stageExample.appendChild(wrap);
  }

  function setStatus(msg, cls) {
    if (!statusEl) return;
    statusEl.textContent = msg || "";
    statusEl.className = "task-status-line" + (cls ? " " + cls : "");
  }

  function openStep(id) {
    const step = STEPS[id];
    if (!step || !stageEl) return;
    currentStep = step;
    currentProject = step.project.id;
    const s = getState();
    stageTitle.textContent = pick(step.title);
    stageText.textContent = pick(step.text);
    codeEl.value = localStorage.getItem(codeKey(id)) || step.starter;
    if (hintBoxEl) { hintBoxEl.classList.add("hidden"); hintBoxEl.textContent = pick(step.hint); }
    setStatus("");
    renderStageMeta(s);
    renderExample();
    stageEl.classList.remove("hidden");
    renderSummary(s);
    renderList();
    try { stageEl.scrollIntoView({ behavior: "smooth", block: "start" }); } catch (e) { /* старі браузери */ }
    sfx("pop");
  }

  function closeStage() {
    currentStep = null;
    if (stageEl) stageEl.classList.add("hidden");
    renderList();
  }

  /* ---------- Перевірка ---------- */
  async function check() {
    if (busy || !currentStep) return;
    const code = codeEl.value;
    if (!code.trim()) { toast(t("tasks.emptyCode")); sfx("error"); return; }
    if (!global.Tasks || typeof global.Tasks.judge !== "function") {
      setStatus(t("tasks.unavailable"), "error");
      return;
    }
    const step = currentStep;
    localStorage.setItem(codeKey(step.id), code);
    busy = true;
    checkBtn.disabled = true;
    setStatus(t("tasks.checking"), "loading");
    sfx("click");

    let verdict;
    try {
      verdict = await global.Tasks.judge(code, step);
    } catch (e) {
      const raw = (e && e.message) || String(e);
      const brief = global.PythonPad && global.PythonPad.errorBrief ? global.PythonPad.errorBrief(raw) : null;
      verdict = { passed: false, results: [], error: raw, line: null, err: brief, okCount: 0, ms: 0 };
    }
    busy = false;
    checkBtn.disabled = false;

    if (verdict.passed) {
      setStatus(t("tasks.accepted"), "ok");
      sfx("success");
      registerSolved(step);
    } else if (verdict.error) {
      setStatus(global.UI && global.UI.errStatus ? global.UI.errStatus(t("tasks.runtimeError"), verdict.err && verdict.err.type) : t("tasks.runtimeError"), "error");
      sfx("error");
    } else {
      setStatus(t("tasks.failed", { n: verdict.okCount, total: step.tests.length }), "bad");
      sfx("error");
    }
  }

  function registerSolved(step) {
    const s = getState();
    const fresh = !s.steps[step.id];
    if (fresh) {
      s.steps[step.id] = Date.now();
      saveState(s);
      toast(t("proj.doneToast", { title: pick(step.title), p: POINTS[step.level] }));
    } else {
      toast(t("proj.againToast"));
    }
    const projectFinished = projectDone(s, step.project);
    renderStageMeta(s);
    renderSummary(s);
    renderList();

    if (fresh) {
      const next = nextOpenStep(step.id);
      if (next) setTimeout(() => toast(t("proj.nextHint", { title: pick(STEPS[next].title) })), 700);
      document.dispatchEvent(new CustomEvent("projectdone", {
        detail: {
          step: step.id, project: step.project.id, points: POINTS[step.level],
          steps: doneCount(s), projects: finishedCount(s), total: pointsOf(s)
        }
      }));
    }
    if (fresh && projectFinished) setTimeout(() => toast(t("proj.projectDoneToast", { title: pick(step.project.title) })), 900);
  }

  function nextOpenStep(fromId) {
    const s = getState();
    const from = ORDER.indexOf(fromId);
    for (let i = from + 1; i < ORDER.length; i++) if (!s.steps[ORDER[i]]) return ORDER[i];
    return null;
  }

  /* ---------- Рендер усього ---------- */
  function render() {
    if (!listEl) { if (!ready) init(); return; }
    const s = getState();
    if (introEl) introEl.textContent = t("proj.intro", { projects: PROJECTS.length, steps: TOTAL_STEPS, points: TOTAL_POINTS });
    renderSummary(s);
    renderList();
    if (currentStep) { renderStageMeta(s); renderExample(); }
    console.info("[projects.js] render", doneCount(s) + "/" + TOTAL_STEPS);
  }

  /* ---------- Ініціалізація ---------- */
  function init() {
    if (ready) { render(); return; }
    ready = true;
    listEl = $("#projList");
    stageEl = $("#projStage");
    introEl = $("#projIntro");
    stepsEl = $("#projStepsDone");
    pointsEl = $("#projPoints");
    projectsEl = $("#projFinished");
    progressEl = $("#projProgress");
    stageHead = $("#projStageHead");
    stageTitle = $("#projStageTitle");
    stageText = $("#projStageText");
    stageExample = $("#projStageExample");
    codeEl = $("#projCode");
    statusEl = $("#projStatus");
    hintBoxEl = $("#projHintBox");
    checkBtn = $("#projCheck");
    hintBtn = $("#projHint");
    resetBtn = $("#projReset");
    backBtn = $("#projBack");
    if (!listEl || !codeEl || !stageEl) return;

    stageEl.classList.add("hidden");
    checkBtn.onclick = check;
    hintBtn.onclick = () => { hintBoxEl.classList.toggle("hidden"); sfx("pop"); };
    resetBtn.onclick = () => {
      if (!confirm(t("proj.resetConfirm"))) return;
      codeEl.value = currentStep.starter;
      localStorage.setItem(codeKey(currentStep.id), codeEl.value);
      setStatus("");
      sfx("click");
    };
    backBtn.onclick = closeStage;

    codeEl.addEventListener("input", () => { if (currentStep) localStorage.setItem(codeKey(currentStep.id), codeEl.value); });
    codeEl.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); check(); return; }
      if (e.key === "Tab") {
        e.preventDefault();
        const from = codeEl.selectionStart;
        const to = codeEl.selectionEnd;
        const spaces = " ".repeat(Number(global.Settings && global.Settings.get("tabSize")) || 4);
        codeEl.value = codeEl.value.slice(0, from) + spaces + codeEl.value.slice(to);
        codeEl.selectionStart = codeEl.selectionEnd = from + spaces.length;
      }
    });

    document.addEventListener("langchange", () => {
      try { render(); } catch (e) { console.warn("projects langchange", e); }
    });

    render();
  }

  global.Projects = {
    init, render, open: openStep, check,
    list: () => PROJECTS.slice(),
    step: (id) => STEPS[id] || null,
    stepIds: () => ORDER.slice(),
    count: TOTAL_STEPS,
    maxPoints: TOTAL_POINTS,
    stats: getState,
    POINTS
  };
})(typeof window !== "undefined" ? window : globalThis);
