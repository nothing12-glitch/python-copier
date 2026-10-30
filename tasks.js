/* tasks.js — розділ «Задачі»: банк задач з автоматичною перевіркою коду через Pyodide.
   Прогрес зберігається локально для кожного користувача: app.tasks.<user>
   Код розв'язку окремої задачі — у app.tasks.code.<user>.<taskId> */
(function (global) {
  const $ = (s) => document.querySelector(s);

  const POINTS = { 1: 10, 2: 15, 3: 20 };
  const LEVEL_KEYS = { 1: "tasks.level1", 2: "tasks.level2", 3: "tasks.level3" };
  const KEY_PREFIX = "app.tasks.";
  const CODE_PREFIX = "app.tasks.code.";
  const MAX_SHOWN = 120;

  const TASKS = [
    {
      id: "sum2", level: 1,
      title: { uk: "Сума двох чисел", en: "Sum of two numbers", tr: "İki sayının toplamı" },
      text: {
        uk: "На вхід надходять два цілих числа, кожне в окремому рядку. Виведи їхню суму.",
        en: "Two integers are given, one per line. Print their sum.",
        tr: "Her biri ayrı satırda iki tam sayı veriliyor. Toplamlarını yazdır."
      },
      hint: {
        uk: "Зчитай числа через int(input()), а результат виведи одним print().",
        en: "Read the numbers with int(input()) and print the result with a single print().",
        tr: "Sayıları int(input()) ile oku ve sonucu tek bir print() ile yazdır."
      },
      starter: "a = int(input())\nb = int(input())\n",
      tests: [
        { in: "3\n5\n", out: "8" },
        { in: "-2\n7\n", out: "5" },
        { in: "0\n0\n", out: "0" }
      ]
    },
    {
      id: "nextprev", level: 1,
      title: { uk: "Наступне й попереднє", en: "Next and previous", tr: "Sonraki ve önceki" },
      text: {
        uk: "Дано ціле число n. Виведи два числа: n + 1 та n − 1, кожне в окремому рядку.",
        en: "An integer n is given. Print two numbers: n + 1 and n − 1, one per line.",
        tr: "Bir n tam sayısı veriliyor. İki sayı yazdır: n + 1 ve n − 1, her biri ayrı satırda."
      },
      hint: {
        uk: "Два виклики print() дадуть два рядки виводу — саме те, що потрібно.",
        en: "Two print() calls produce two output lines — exactly what is needed.",
        tr: "İki print() çağrısı iki çıktı satırı üretir — tam da gereken bu."
      },
      starter: "n = int(input())\n",
      tests: [
        { in: "7\n", out: "8\n6" },
        { in: "-3\n", out: "-2\n-4" },
        { in: "0\n", out: "1\n-1" }
      ]
    },
    {
      id: "swap", level: 1,
      title: { uk: "Поміняти місцями", en: "Swap the values", tr: "Değerleri değiştir" },
      text: {
        uk: "На вхід надходять два цілих числа, кожне в окремому рядку. Виведи їх у зворотному порядку: спочатку друге, потім перше.",
        en: "Two integers are given, one per line. Print them in reverse order: the second one first, then the first.",
        tr: "Her biri ayrı satırda iki tam sayı veriliyor. Ters sırada yazdır: önce ikinciyi, sonra birinciyi."
      },
      hint: {
        uk: "Достатньо двох print() у потрібному порядку — змінні місцями міняти не обов'язково.",
        en: "Two print() calls in the right order are enough — you do not have to swap the variables.",
        tr: "Doğru sırada iki print() çağrısı yeterlidir — değişkenleri takas etmen gerekmez."
      },
      starter: "a = int(input())\nb = int(input())\n",
      tests: [
        { in: "3\n5\n", out: "5\n3" },
        { in: "-1\n4\n", out: "4\n-1" },
        { in: "7\n7\n", out: "7\n7" }
      ]
    },
    {
      id: "min2", level: 1,
      title: { uk: "Менше з двох", en: "Smaller of two", tr: "İkisinin küçüğü" },
      text: {
        uk: "Дано два цілих числа, кожне в окремому рядку. Виведи менше з них.",
        en: "Two integers are given, one per line. Print the smaller of them.",
        tr: "Her biri ayrı satırda iki tam sayı veriliyor. Küçük olanı yazdır."
      },
      hint: {
        uk: "Порівняй числа через if a < b або скористайся функцією min().",
        en: "Compare the numbers with if a < b or use the min() function.",
        tr: "Sayıları if a < b ile karşılaştır ya da min() fonksiyonunu kullan."
      },
      starter: "a = int(input())\nb = int(input())\n",
      tests: [
        { in: "4\n9\n", out: "4" },
        { in: "12\n3\n", out: "3" },
        { in: "-5\n-8\n", out: "-8" }
      ]
    },
    {
      id: "digitsum", level: 1,
      title: { uk: "Сума цифр числа", en: "Sum of digits", tr: "Rakamlar toplamı" },
      text: {
        uk: "Дано трицифрове число. Виведи суму його цифр.",
        en: "A three-digit number is given. Print the sum of its digits.",
        tr: "Üç basamaklı bir sayı veriliyor. Rakamları toplamını yazdır."
      },
      hint: {
        uk: "Перетвори число на рядок через str(n) і пройди по символах циклом, додаючи int(символ).",
        en: "Convert the number to a string with str(n) and loop over its characters, adding int(character).",
        tr: "Sayıyı str(n) ile metne çevir ve karakterleri döngüyle dolaşarak int(karakter) değerlerini topla."
      },
      starter: "n = int(input())\n",
      tests: [
        { in: "123\n", out: "6" },
        { in: "999\n", out: "27" },
        { in: "100\n", out: "1" }
      ]
    },
    {
      id: "rect", level: 1,
      title: { uk: "Площа й периметр", en: "Area and perimeter", tr: "Alan ve çevre" },
      text: {
        uk: "Дано довжини двох сторін прямокутника: a та b (по одному числу в рядку). Виведи площу й периметр — два числа в окремих рядках.",
        en: "Two sides of a rectangle, a and b, are given (one per line). Print the area and the perimeter, one per line.",
        tr: "Bir dikdörtgenin iki kenarı a ve b veriliyor (her biri ayrı satırda). Alanı ve çevreyi yazdır, her biri ayrı satırda."
      },
      hint: {
        uk: "Площа — це a * b, периметр — 2 * (a + b).",
        en: "The area is a * b, the perimeter is 2 * (a + b).",
        tr: "Alan a * b, çevre 2 * (a + b)."
      },
      starter: "a = int(input())\nb = int(input())\n",
      tests: [
        { in: "3\n4\n", out: "12\n14" },
        { in: "5\n5\n", out: "25\n20" },
        { in: "1\n10\n", out: "10\n22" }
      ]
    },
    {
      id: "prod2", level: 1,
      title: { uk: "Добуток двох чисел", en: "Product of two numbers", tr: "İki sayının çarpımı" },
      text: {
        uk: "На вхід надходять два цілих числа, кожне в окремому рядку. Виведи їхній добуток.",
        en: "Two integers are given, one per line. Print their product.",
        tr: "Her biri ayrı satırda iki tam sayı veriliyor. Çarpımlarını yazdır."
      },
      hint: {
        uk: "Добуток — це результат множення, за нього відповідає оператор *.",
        en: "The product is the result of multiplication: use the * operator.",
        tr: "Çarpım, çarpma işleminin sonucudur: * operatörünü kullan."
      },
      starter: "a = int(input())\nb = int(input())\n",
      tests: [
        { in: "6\n7\n", out: "42" },
        { in: "0\n15\n", out: "0" },
        { in: "-3\n9\n", out: "-27" }
      ]
    },
    {
      id: "sqcube", level: 1,
      title: { uk: "Квадрат і куб", en: "Square and cube", tr: "Kare ve küp" },
      text: {
        uk: "Дано ціле число n. Виведи його квадрат і куб: у першому рядку n * n, у другому — n * n * n.",
        en: "An integer n is given. Print its square and its cube, one per line.",
        tr: "Bir n tam sayısı veriliyor. Karesini ve küpünü yazdır, her biri ayrı satırda."
      },
      hint: {
        uk: "Квадрат — це n * n, куб — n * n * n. Можна також скористатися оператором степеня **.",
        en: "The square is n * n, the cube is n * n * n; you can also use the ** operator.",
        tr: "Kare n * n, küp n * n * n'dir; ** operatörünü de kullanabilirsin."
      },
      starter: "n = int(input())\n",
      tests: [
        { in: "5\n", out: "25\n125" },
        { in: "0\n", out: "0\n0" },
        { in: "-4\n", out: "16\n-64" }
      ]
    },
    {
      id: "distance", level: 1,
      title: { uk: "Відстань між двома точками", en: "Distance between two points", tr: "İki nokta arasındaki uzaklık" },
      text: {
        uk: "На координатній прямій задано дві точки a і b, кожна в окремому рядку. Виведи відстань між цими точками.",
        en: "Two points a and b on a number line are given, one per line. Print the distance between them.",
        tr: "Sayı doğrusunda iki nokta a ve b veriliyor, her biri ayrı satırda. Aralarındaki uzaklığı yazdır."
      },
      hint: {
        uk: "Відстань дорівнює модулю різниці координат: скористайся функцією abs(a - b).",
        en: "The distance is the absolute difference of the coordinates: use abs(a - b).",
        tr: "Uzaklık, koordinatlar farkının mutlak değeridir: abs(a - b) kullan."
      },
      starter: "a = int(input())\nb = int(input())\n",
      tests: [
        { in: "3\n8\n", out: "5" },
        { in: "10\n10\n", out: "0" },
        { in: "-4\n5\n", out: "9" }
      ]
    },
    {
      id: "signnum", level: 1,
      title: { uk: "Знак числа", en: "Sign of a number", tr: "Sayının işareti" },
      text: {
        uk: "Дано ціле число n. Виведи один символ: «+», якщо n додатне, «-», якщо n від'ємне, і «0», якщо n дорівнює нулю.",
        en: "An integer n is given. Print a single character: + if n is positive, - if n is negative and 0 if n equals zero.",
        tr: "Bir n tam sayısı veriliyor. Tek bir karakter yazdır: n pozitifse +, negatifse -, sıfırsa 0."
      },
      hint: {
        uk: "Порівняй n з нулем у трьох гілках: if, elif та else.",
        en: "Compare n with zero using three branches: if, elif and else.",
        tr: "n sayısını sıfırla üç durumda karşılaştır: if, elif ve else."
      },
      starter: "n = int(input())\n",
      tests: [
        { in: "7\n", out: "+" },
        { in: "-3\n", out: "-" },
        { in: "0\n", out: "0" }
      ]
    },
    {
      id: "cmpwords", level: 1,
      title: { uk: "Порівняй два числа", en: "Compare two numbers", tr: "İki sayıyı karşılaştır" },
      text: {
        uk: "На вхід надходять два цілих числа, кожне в окремому рядку. Порівняй перше з другим і виведи одне слово великими літерами: GREATER, якщо перше більше, LESS, якщо перше менше, і EQUAL, якщо числа рівні.",
        en: "Two integers are given, one per line. Compare the first with the second and print one word in capital letters: GREATER if the first is larger, LESS if it is smaller and EQUAL if they are the same.",
        tr: "Her biri ayrı satırda iki tam sayı veriliyor. İlk sayıyı ikinciyle karşılaştır ve büyük harfle tek kelime yazdır: ilki büyükse GREATER, küçükse LESS, eşitlerse EQUAL."
      },
      hint: {
        uk: "Три випадки — три гілки умови: if, elif та else.",
        en: "Three cases need three branches: if, elif and else.",
        tr: "Üç durum için üç dal kullan: if, elif ve else."
      },
      starter: "a = int(input())\nb = int(input())\n",
      tests: [
        { in: "9\n4\n", out: "GREATER" },
        { in: "2\n7\n", out: "LESS" },
        { in: "5\n5\n", out: "EQUAL" }
      ]
    },
    {
      id: "clock", level: 1,
      title: { uk: "Години й хвилини", en: "Hours and minutes", tr: "Saat ve dakika" },
      text: {
        uk: "На вхід надходить кількість хвилин m (від 0 до 1439). Виведи у першому рядку повну кількість годин, а у другому — решту хвилин.",
        en: "A number of minutes m (from 0 to 1439) is given. Print the whole number of hours on the first line and the remaining minutes on the second.",
        tr: "Dakika cinsinden bir süre m veriliyor (0 ile 1439 arası). İlk satıra tam saat sayısını, ikinci satıra kalan dakikayı yazdır."
      },
      hint: {
        uk: "Години — ціла частина ділення m // 60, а решта хвилин — остача m % 60.",
        en: "Hours are the integer quotient m // 60; the remaining minutes are the remainder m % 60.",
        tr: "Saat sayısı tam bölüm m // 60, kalan dakika ise kalan m % 60 olur."
      },
      starter: "m = int(input())\n",
      tests: [
        { in: "125\n", out: "2\n5" },
        { in: "0\n", out: "0\n0" },
        { in: "200\n", out: "3\n20" }
      ]
    },
    {
      id: "strlength", level: 1,
      title: { uk: "Довжина слова", en: "Length of a word", tr: "Kelimenin uzunluğu" },
      text: {
        uk: "На вхід надходить одне слово — рядок без пробілів. Виведи кількість літер у ньому.",
        en: "A single word (a line without spaces) is given. Print the number of letters in it.",
        tr: "Boşluksuz tek bir kelime veriliyor. İçindeki harf sayısını yazdır."
      },
      hint: {
        uk: "Зчитай рядок через input() без int() і скористайся функцією len().",
        en: "Read the line with input() without int(), then use the len() function.",
        tr: "Satırı int() olmadan input() ile oku, sonra len() işlevini kullan."
      },
      starter: "s = input()\n",
      tests: [
        { in: "hello\n", out: "5" },
        { in: "a\n", out: "1" },
        { in: "programming\n", out: "11" }
      ]
    },
    {
      id: "discount", level: 1,
      title: { uk: "Ціна зі знижкою", en: "Price with a discount", tr: "İndirimli fiyat" },
      text: {
        uk: "Товар коштує p грн, а знижка становить d відсотків. Розмір знижки в цілих гривнях обчислюється як p * d // 100. Виведи у першому рядку розмір знижки, а у другому — нову ціну товару.",
        en: "An item costs p hryvnia and the discount is d percent. The discount amount in whole hryvnia is p * d // 100. Print the discount amount on the first line and the new price on the second.",
        tr: "Bir ürünün fiyatı p, indirim oranı d yüzde olarak veriliyor. Tam birim cinsinden indirim tutarı p * d // 100 biçiminde hesaplanır. İlk satıra indirim tutarını, ikinci satıra yeni fiyatı yazdır."
      },
      hint: {
        uk: "Спочатку обчисли розмір знижки й збережи його в змінну, а потім відніми цю змінну від початкової ціни.",
        en: "First compute the discount amount and store it in a variable, then subtract it from the original price.",
        tr: "Önce indirim tutarını hesapla ve bir değişkende sakla, sonra bunu başlangıç fiyatından çıkar."
      },
      starter: "p = int(input())\nd = int(input())\n",
      tests: [
        { in: "200\n10\n", out: "20\n180" },
        { in: "100\n0\n", out: "0\n100" },
        { in: "990\n15\n", out: "148\n842" }
      ]
    },    {
      id: "max3", level: 2,
      title: { uk: "Найбільше з трьох", en: "Largest of three", tr: "Üçünün en büyüğü" },
      text: {
        uk: "Дано три цілих числа, кожне в окремому рядку. Виведи найбільше з них.",
        en: "Three integers are given, one per line. Print the largest of them.",
        tr: "Her biri ayrı satırda üç tam sayı veriliyor. En büyüğünü yazdır."
      },
      hint: {
        uk: "Порівнюй через if/elif або скористайся вбудованою функцією max().",
        en: "Compare with if/elif or use the built-in max() function.",
        tr: "if/elif ile karşılaştır ya da yerleşik max() fonksiyonunu kullan."
      },
      starter: "a = int(input())\nb = int(input())\nc = int(input())\n",
      tests: [
        { in: "1\n2\n3\n", out: "3" },
        { in: "9\n4\n7\n", out: "9" },
        { in: "-5\n-5\n-2\n", out: "-2" }
      ]
    },
    {
      id: "evenodd", level: 2,
      title: { uk: "Парне чи непарне", en: "Even or odd", tr: "Çift mi tek mi" },
      text: {
        uk: "Дано ціле число n. Виведи even, якщо число парне, і odd, якщо непарне.",
        en: "An integer n is given. Print even if the number is divisible by two, otherwise print odd.",
        tr: "Bir n tam sayısı veriliyor. Sayı ikiye bölünüyorsa even, bölünmüyorsa odd yazdır."
      },
      hint: {
        uk: "Остачу від ділення дає оператор %: для парних чисел n % 2 дорівнює 0.",
        en: "The % operator gives the remainder: for even numbers n % 2 equals 0.",
        tr: "% operatörü kalanı verir: çift sayılarda n % 2 değeri 0 olur."
      },
      starter: "n = int(input())\n",
      tests: [
        { in: "4\n", out: "even" },
        { in: "7\n", out: "odd" },
        { in: "0\n", out: "even" }
      ]
    },
    {
      id: "sumn", level: 2,
      title: { uk: "Сума від 1 до n", en: "Sum from 1 to n", tr: "1'den n'ye toplam" },
      text: {
        uk: "Дано ціле число n (n ≥ 1). Виведи суму всіх цілих чисел від 1 до n.",
        en: "An integer n is given (n ≥ 1). Print the sum of all integers from 1 to n.",
        tr: "Bir n tam sayısı veriliyor (n ≥ 1). 1'den n'ye kadar tüm tam sayıların toplamını yazdır."
      },
      hint: {
        uk: "Цикл for i in range(1, n + 1) перебере всі числа; range не включає верхню межу, тому пишемо n + 1.",
        en: "The loop for i in range(1, n + 1) walks through all numbers; range excludes its upper bound, hence n + 1.",
        tr: "for i in range(1, n + 1) döngüsü tüm sayıları dolaşır; range üst sınırı dahil etmez, bu yüzden n + 1."
      },
      starter: "n = int(input())\ntotal = 0\n",
      tests: [
        { in: "5\n", out: "15" },
        { in: "100\n", out: "5050" },
        { in: "1\n", out: "1" }
      ]
    },
    {
      id: "factorial", level: 2,
      title: { uk: "Факторіал", en: "Factorial", tr: "Faktöriyel" },
      text: {
        uk: "Дано ціле число n (0 ≤ n ≤ 20). Виведи n! — добуток усіх цілих чисел від 1 до n. Факторіал нуля дорівнює одиниці.",
        en: "An integer n is given (0 ≤ n ≤ 20). Print n! — the product of all integers from 1 to n. The factorial of zero equals one.",
        tr: "Bir n tam sayısı veriliyor (0 ≤ n ≤ 20). n! değerini yazdır — 1'den n'ye kadar tüm tam sayıların çarpımı. Sıfırın faktöriyeli birdir."
      },
      hint: {
        uk: "Починай добуток з одиниці (result = 1), а в циклі множи: result *= i.",
        en: "Start the product at one (result = 1) and multiply inside the loop: result *= i.",
        tr: "Çarpımı birle başlat (result = 1) ve döngü içinde çarp: result *= i."
      },
      starter: "n = int(input())\nresult = 1\n",
      tests: [
        { in: "5\n", out: "120" },
        { in: "0\n", out: "1" },
        { in: "10\n", out: "3628800" }
      ]
    },
    {
      id: "counteven", level: 2,
      title: { uk: "Скільки парних", en: "How many are even", tr: "Kaç tanesi çift" },
      text: {
        uk: "У першому рядку дано кількість чисел n, у другому — n цілих чисел через пробіл. Виведи, скільки серед них парних.",
        en: "The first line contains the amount of numbers n, the second line contains n integers separated by spaces. Print how many of them are even.",
        tr: "İlk satırda sayı adedi n, ikinci satırda boşlukla ayrılmış n tam sayı veriliyor. Kaç tanesinin çift olduğunu yazdır."
      },
      hint: {
        uk: "Рядок чисел перетворить на список: numbers = list(map(int, input().split())). Далі — цикл і лічильник.",
        en: "Turn the line of numbers into a list: numbers = list(map(int, input().split())). Then use a loop and a counter.",
        tr: "Sayı satırını listeye çevir: numbers = list(map(int, input().split())). Sonra bir döngü ve sayaç kullan."
      },
      starter: "n = int(input())\nnumbers = list(map(int, input().split()))\ncount = 0\n",
      tests: [
        { in: "5\n1 2 3 4 6\n", out: "3" },
        { in: "3\n1 3 5\n", out: "0" },
        { in: "4\n2 4 6 8\n", out: "4" }
      ]
    },
    {
      id: "gcd", level: 2,
      title: { uk: "Найбільший спільний дільник", en: "Greatest common divisor", tr: "En büyük ortak bölen" },
      text: {
        uk: "Дано два натуральні числа, кожне в окремому рядку. Виведи їхній найбільший спільний дільник.",
        en: "Two natural numbers are given, one per line. Print their greatest common divisor.",
        tr: "Her biri ayrı satırda iki doğal sayı veriliyor. En büyük ortak bölenlerini yazdır."
      },
      hint: {
        uk: "Перебирай усі числа від меншого до 1 і шукай те, на яке обидва діляться без остачі. Або скористайся math.gcd().",
        en: "Walk through the numbers from the smaller one down to 1 and look for the one that divides both. Or use math.gcd().",
        tr: "Küçük olandan 1'e kadar sayıları dolaş ve ikisini de kalansız böleni bul. Ya da math.gcd() kullan."
      },
      starter: "a = int(input())\nb = int(input())\n",
      tests: [
        { in: "12\n18\n", out: "6" },
        { in: "7\n13\n", out: "1" },
        { in: "100\n75\n", out: "25" }
      ]
    },
    {
      id: "sumeven", level: 2,
      title: { uk: "Сума парних від 1 до n", en: "Sum of even numbers", tr: "1'den n'ye kadar çift sayıların toplamı" },
      text: {
        uk: "На вхід надходить ціле число n (n ≥ 1). Виведи суму всіх парних чисел від 1 до n. Якщо парних чисел у цьому проміжку немає, виведи 0.",
        en: "An integer n is given (n ≥ 1). Print the sum of all even numbers from 1 to n. If the range holds no even number, print 0.",
        tr: "Bir n tam sayısı veriliyor (n ≥ 1). 1'den n'ye kadar tüm çift sayıların toplamını yazdır. Aralıkta çift sayı yoksa 0 yazdır."
      },
      hint: {
        uk: "Цикл for i in range(2, n + 1, 2) перебере лише парні числа, бо крок 2 означає рух через одне число. Додавай кожне з них до змінної-накопичувача.",
        en: "The loop for i in range(2, n + 1, 2) visits only even numbers, since step 2 moves one number at a time. Add each of them to an accumulator.",
        tr: "for i in range(2, n + 1, 2) döngüsü yalnız çift sayıları dolaşır, çünkü 2 adımı bir sayı atlayarak ilerletir. Her sayıyı toplayan değişkene ekle."
      },
      starter: "n = int(input())\ntotal = 0\n",
      tests: [
        { in: "10\n", out: "30" },
        { in: "1\n", out: "0" },
        { in: "100\n", out: "2550" }
      ]
    },
    {
      id: "sumsq", level: 2,
      title: { uk: "Сума квадратів", en: "Sum of squares", tr: "Karelerin toplamı" },
      text: {
        uk: "Ціле число n (n ≥ 1) надходить у першому рядку. Виведи значення суми 1² + 2² + … + n².",
        en: "An integer n is given (n ≥ 1) on the first line. Print the value of the sum 1² + 2² + ... + n².",
        tr: "İlk satırda bir n tam sayısı veriliyor (n ≥ 1). 1² + 2² + ... + n² toplamının değerini yazdır."
      },
      hint: {
        uk: "У тілі циклу for i in range(1, n + 1) додавай до накопичувача не саме i, а квадрат числа i, тобто i * i.",
        en: "Inside the loop for i in range(1, n + 1) add the square i * i to the accumulator instead of i itself.",
        tr: "for i in range(1, n + 1) döngüsünün gövdesinde toplayana i yerine karesi olan i * i değerini ekle."
      },
      starter: "n = int(input())\ntotal = 0\n",
      tests: [
        { in: "3\n", out: "14" },
        { in: "1\n", out: "1" },
        { in: "10\n", out: "385" }
      ]
    },
    {
      id: "digitcount", level: 2,
      title: { uk: "Скільки цифр у числі", en: "How many digits", tr: "Kaç basamak var" },
      text: {
        uk: "На вхід надходить ціле невід'ємне число n (0 ≤ n ≤ 1000000000). Виведи, скільки цифр містить його запис у десятковій системі. Число 0 складається з однієї цифри.",
        en: "A non-negative integer n is given (0 ≤ n ≤ 1000000000). Print how many digits its decimal representation has. Zero counts as a single digit.",
        tr: "Negatif olmayan bir n tam sayısı veriliyor (0 ≤ n ≤ 1000000000). Onluk gösteriminde kaç basamak olduğunu yazdır. Sıfır tek basamak sayılır."
      },
      hint: {
        uk: "У циклі while відділяй по одній цифрі з кінця за допомогою n //= 10 і збільшуй лічильник. Має вийти так, щоб і для нуля відповідь дорівнювала 1.",
        en: "In a while loop cut off one digit at a time from the right with n //= 10 and increase a counter. Make sure zero still yields the answer 1.",
        tr: "while döngüsünde n //= 10 ile sağdan birer basamak at ve sayacı artır. Sıfır için de yanıtın 1 çıkmasını sağla."
      },
      starter: "n = int(input())\ncount = 0\n",
      tests: [
        { in: "512\n", out: "3" },
        { in: "0\n", out: "1" },
        { in: "1000000000\n", out: "10" }
      ]
    },
    {
      id: "multtable", level: 2,
      title: { uk: "Рядок таблиці множення", en: "Multiplication table row", tr: "Çarpım tablosu satırı" },
      text: {
        uk: "Ціле число n (1 ≤ n ≤ 12) надходить у першому рядку. Виведи добутки n * 1, n * 2, …, n * 10 — по одному значенню в рядку, разом 10 рядків.",
        en: "An integer n is given (1 ≤ n ≤ 12) on the first line. Print the products n * 1, n * 2, ..., n * 10, one value per line, 10 lines in total.",
        tr: "İlk satırda bir n tam sayısı veriliyor (1 ≤ n ≤ 12). n * 1, n * 2, ..., n * 10 çarpımlarını satır başına bir değer olacak şekilde yazdır, toplam 10 satır."
      },
      hint: {
        uk: "for i in range(1, 11) перебере множники від 1 до 10, а виклик print(n * i) виведе кожен добуток в окремому рядку.",
        en: "for i in range(1, 11) walks the multipliers from 1 to 10, and the call print(n * i) outputs each product on its own line.",
        tr: "for i in range(1, 11) döngüsü 1'den 10'a kadar çarpanları dolaşır, print(n * i) çağrısı her çarpımı ayrı satıra yazar."
      },
      starter: "n = int(input())\n",
      tests: [
        { in: "2\n", out: "2\n4\n6\n8\n10\n12\n14\n16\n18\n20" },
        { in: "1\n", out: "1\n2\n3\n4\n5\n6\n7\n8\n9\n10" },
        { in: "12\n", out: "12\n24\n36\n48\n60\n72\n84\n96\n108\n120" }
      ]
    },
    {
      id: "countpos", level: 2,
      title: { uk: "Скільки додатних чисел", en: "Count the positive numbers", tr: "Kaç pozitif sayı" },
      text: {
        uk: "У першому рядку надходить кількість чисел n (0 ≤ n ≤ 100). У наступних n рядках записано по одному цілому числу. Виведи, скільки з них строго більші за нуль.",
        en: "The first line gives the amount of numbers n (0 ≤ n ≤ 100). Each of the next n lines holds one integer. Print how many of them are strictly greater than zero.",
        tr: "İlk satırda sayı adedi n (0 ≤ n ≤ 100) veriliyor. Sonraki n satırın her birinde bir tam sayı var. Kaçının sıfırdan kesin büyük olduğunu yazdır."
      },
      hint: {
        uk: "Напиши цикл for _ in range(n), у тілі зчитуй чергове число x = int(input()) і збільшуй лічильник щоразу, коли x > 0.",
        en: "Loop with for _ in range(n), read the next value inside the body as x = int(input()), and increase the counter whenever x > 0.",
        tr: "for _ in range(n) döngüsü kur, gövdede sıradaki sayıyı x = int(input()) ile oku ve x > 0 oldukça sayacı bir artır."
      },
      starter: "n = int(input())\ncount = 0\n",
      tests: [
        { in: "5\n-2\n3\n0\n7\n-1\n", out: "2" },
        { in: "1\n0\n", out: "0" },
        { in: "8\n-5\n2\n-1\n2\n0\n9\n-3\n7\n", out: "4" }
      ]
    },
    {
      id: "mindiv", level: 2,
      title: { uk: "Найменший дільник", en: "Smallest divisor", tr: "En küçük bölen" },
      text: {
        uk: "Дано ціле число n (2 ≤ n ≤ 1000000). Виведи його найменший дільник, більший за одиницю. Для простого числа таким дільником є воно саме.",
        en: "An integer n is given (2 ≤ n ≤ 1000000). Print its smallest divisor greater than one. For a prime number that divisor is the number itself.",
        tr: "Bir n tam sayısı veriliyor (2 ≤ n ≤ 1000000). Birden büyük en küçük bölenini yazdır. Asal sayıda bu bölen sayının kendisidir."
      },
      hint: {
        uk: "Почни з d = 2 і в циклі while збільшуй d на одиницю, доки остача n % d не стане нулем: тоді d — шуканий дільник.",
        en: "Start with d = 2 and increase it by one in a while loop until the remainder n % d becomes zero; that d is the answer.",
        tr: "d = 2 ile başla ve n % d kalanı sıfır olana dek while döngüsünde d değerini bir artır; bulunan d yanıttır."
      },
      starter: "n = int(input())\nd = 2\n",
      tests: [
        { in: "15\n", out: "3" },
        { in: "17\n", out: "17" },
        { in: "91\n", out: "7" }
      ]
    },
    {
      id: "powloop", level: 2,
      title: { uk: "Ступінь числа", en: "Power by loop", tr: "Döngüyle üs alma" },
      text: {
        uk: "У двох рядках надходять цілі числа: основа a (1 ≤ a ≤ 9) та показник b (0 ≤ b ≤ 12). Виведи a в степені b, не користуючись оператором **.",
        en: "Two integers arrive, one per line: the base a (1 ≤ a ≤ 9) and the exponent b (0 ≤ b ≤ 12). Print a raised to the power b without using the ** operator.",
        tr: "Ayrı satırlarda iki tam sayı veriliyor: taban a (1 ≤ a ≤ 9) ve üs b (0 ≤ b ≤ 12). ** operatörünü kullanmadan a sayısının b üssünü yazdır."
      },
      hint: {
        uk: "Ініціалізуй result = 1 і помнож його на a рівно b разів. Коли b дорівнює 0, цикл не виконає жодного кроку, тому відповіддю буде 1.",
        en: "Set result = 1 and multiply it by a exactly b times. When b is 0 the loop makes no iteration at all, so the answer stays 1.",
        tr: "result = 1 değerini ver ve a ile tam b kez çarp. b sıfır ise döngü hiç çalışmaz, bu yüzden yanıt 1 kalır."
      },
      starter: "a = int(input())\nb = int(input())\nresult = 1\n",
      tests: [
        { in: "2\n10\n", out: "1024" },
        { in: "5\n0\n", out: "1" },
        { in: "9\n9\n", out: "387420489" }
      ]
    },
    {
      id: "div35", level: 2,
      title: { uk: "Діляться і на 3, і на 5", en: "Divisible by 3 and 5", tr: "3 ve 5'e bölünenler" },
      text: {
        uk: "Ціле число n (15 ≤ n ≤ 1000) надходить у першому рядку. Виведи в окремих рядках усі цілі числа від 1 до n, які діляться без остачі одночасно на 3 і на 5, у порядку зростання.",
        en: "An integer n is given (15 ≤ n ≤ 1000) on the first line. Print every integer from 1 to n that is divisible by both 3 and 5, one per line, in increasing order.",
        tr: "İlk satırda bir n tam sayısı veriliyor (15 ≤ n ≤ 1000). Hem 3'e hem 5'e kalansız bölünen tüm sayıları artan sırada, satır başına bir tane yazdır."
      },
      hint: {
        uk: "Перебери числа циклом for i in range(1, n + 1) і всередині перевір подвійну умову i % 3 == 0 і i % 5 == 0; їй відповідають саме числа, кратні 15.",
        en: "Iterate with for i in range(1, n + 1) and test the double condition i % 3 == 0 and i % 5 == 0 inside the loop; exactly the multiples of 15 satisfy it.",
        tr: "for i in range(1, n + 1) döngüsüyle sayıları dolaş ve gövdede i % 3 == 0 and i % 5 == 0 koşulunu denetle; bu koşula uyanlar 15'in katlarıdır."
      },
      starter: "n = int(input())\n",
      tests: [
        { in: "50\n", out: "15\n30\n45" },
        { in: "15\n", out: "15" },
        { in: "100\n", out: "15\n30\n45\n60\n75\n90" }
      ]
    },    {
      id: "fib", level: 3,
      title: { uk: "Число Фібоначчі", en: "Fibonacci number", tr: "Fibonacci sayısı" },
      text: {
        uk: "Дано ціле число n (1 ≤ n ≤ 30). Виведи n-те число Фібоначчі: послідовність починається з одиниць, а кожне наступне число дорівнює сумі двох попередніх.",
        en: "An integer n is given (1 ≤ n ≤ 30). Print the n-th Fibonacci number: the sequence starts with ones and each next number is the sum of the two previous ones.",
        tr: "Bir n tam sayısı veriliyor (1 ≤ n ≤ 30). n'inci Fibonacci sayısını yazdır: dizi birlerle başlar ve sonraki her sayı önceki ikisinin toplamıdır."
      },
      hint: {
        uk: "Тримай два попередні значення й оновлюй їх одним рядком: a, b = b, a + b.",
        en: "Keep the two previous values and update them in one line: a, b = b, a + b.",
        tr: "Önceki iki değeri tut ve tek satırda güncelle: a, b = b, a + b."
      },
      starter: "n = int(input())\n",
      tests: [
        { in: "1\n", out: "1" },
        { in: "10\n", out: "55" },
        { in: "20\n", out: "6765" }
      ]
    },
    {
      id: "primes", level: 3,
      title: { uk: "Прості числа до n", en: "Primes up to n", tr: "n'e kadar asal sayılar" },
      text: {
        uk: "Дано ціле число n (2 ≤ n ≤ 200). Виведи через пробіл усі прості числа, які не перевищують n.",
        en: "An integer n is given (2 ≤ n ≤ 200). Print all prime numbers not greater than n, separated by spaces.",
        tr: "Bir n tam sayısı veriliyor (2 ≤ n ≤ 200). n'den büyük olmayan tüm asal sayıları boşlukla ayırarak yazdır."
      },
      hint: {
        uk: "Число просте, якщо воно більше за одиницю й не ділиться без остачі ні на що, крім одиниці та себе. Достатньо перевірити дільники від 2 до x // 2 + 1.",
        en: "A number is prime if it is greater than one and has no divisors other than one and itself. Checking divisors from 2 up to x // 2 + 1 is enough.",
        tr: "Bir sayı birden büyükse ve biri ile kendisi dışında böleni yoksa asaldır. Bölenleri 2'den x // 2 + 1'e kadar denetlemek yeterlidir."
      },
      starter: "n = int(input())\nprimes = []\n",
      tests: [
        { in: "20\n", out: "2 3 5 7 11 13 17 19" },
        { in: "2\n", out: "2" },
        { in: "10\n", out: "2 3 5 7" }
      ]
    },
    {
      id: "palindrome", level: 3,
      title: { uk: "Паліндром", en: "Palindrome", tr: "Palindrom" },
      text: {
        uk: "Дано одне слово без пробілів. Виведи yes, якщо слово читається однаково зліва направо і справа наліво, інакше виведи no.",
        en: "One word without spaces is given. Print yes if the word reads the same forwards and backwards, otherwise print no.",
        tr: "Boşluksuz bir sözcük veriliyor. Sözcük ileri ve geri aynı okunuyorsa yes, aksi halde no yazdır."
      },
      hint: {
        uk: "Рядок можна перевернути зрізом s[::-1] і порівняти з початковим.",
        en: "A string can be reversed with the slice s[::-1] and compared to the original.",
        tr: "Bir metin s[::-1] dilimiyle tersine çevrilip özgün hâliyle karşılaştırılabilir."
      },
      starter: "s = input().strip()\n",
      tests: [
        { in: "level\n", out: "yes" },
        { in: "python\n", out: "no" },
        { in: "a\n", out: "yes" }
      ]
    },
    {
      id: "words", level: 3,
      title: { uk: "Кількість слів", en: "Word count", tr: "Sözcük sayısı" },
      text: {
        uk: "Дано один рядок тексту. Виведи кількість слів у ньому (слова розділені пробілами).",
        en: "One line of text is given. Print the number of words in it (words are separated by spaces).",
        tr: "Bir satır metin veriliyor. İçindeki sözcük sayısını yazdır (sözcükler boşlukla ayrılır)."
      },
      hint: {
        uk: "Метод split() розбиває рядок на список слів, а len() показує довжину списку.",
        en: "The split() method breaks a line into a list of words and len() returns the list length.",
        tr: "split() metodu satırı sözcük listesine böler, len() ise listenin uzunluğunu verir."
      },
      starter: "s = input()\n",
      tests: [
        { in: "hello world\n", out: "2" },
        { in: "one two three four\n", out: "4" },
        { in: "python\n", out: "1" }
      ]
    },
    {
      id: "reversewords", level: 3,
      title: { uk: "Слова у зворотному порядку", en: "Words in reverse order", tr: "Sözcükler ters sırada" },
      text: {
        uk: "Дано один рядок тексту. Виведи ті самі слова у зворотному порядку, розділяючи їх одним пробілом.",
        en: "One line of text is given. Print the same words in reverse order, separated by a single space.",
        tr: "Bir satır metin veriliyor. Aynı sözcükleri tek boşlukla ayrılmış olarak ters sırada yazdır."
      },
      hint: {
        uk: "Список можна перевернути зрізом words[::-1], а з'єднати назад — методом \" \".join(...).",
        en: "A list can be reversed with the slice words[::-1] and joined back with \" \".join(...).",
        tr: "Bir liste words[::-1] dilimiyle tersine çevrilir ve \" \".join(...) ile yeniden birleştirilir."
      },
      starter: "s = input()\nwords = s.split()\n",
      tests: [
        { in: "one two three\n", out: "three two one" },
        { in: "hello world\n", out: "world hello" },
        { in: "python\n", out: "python" }
      ]
    },
    {
      id: "listmax", level: 3,
      title: { uk: "Найбільше у списку", en: "Largest in the list", tr: "Listedeki en büyük" },
      text: {
        uk: "У першому рядку дано кількість чисел n, у другому — n цілих чисел через пробіл (можуть бути від'ємними). Виведи найбільше з них.",
        en: "The first line contains the amount of numbers n, the second line contains n integers separated by spaces (they may be negative). Print the largest of them.",
        tr: "İlk satırda sayı adedi n, ikinci satırda boşlukla ayrılmış n tam sayı veriliyor (negatif olabilirler). En büyüğünü yazdır."
      },
      hint: {
        uk: "Якщо брати власний цикл, початкове значення максимуму — перший елемент списку, а не нуль: інакше від'ємні числа дадуть хибну відповідь.",
        en: "If you write your own loop, start the maximum from the first list element rather than zero: otherwise negative numbers give a wrong answer.",
        tr: "Kendi döngünü yazıyorsan maksimumu listenin ilk elemanıyla başlat, sıfırla değil: aksi halde negatif sayılar yanlış sonuç verir."
      },
      starter: "n = int(input())\nnumbers = list(map(int, input().split()))\n",
      tests: [
        { in: "4\n3 9 2 7\n", out: "9" },
        { in: "1\n5\n", out: "5" },
        { in: "3\n-1 -5 -2\n", out: "-1" }
      ]
    },
    {
      id: "reversestr", level: 3,
      title: { uk: "Перевернутий рядок", en: "Reversed string", tr: "Tersine çevrilmiş satır" },
      text: {
        uk: "Дано непорожній рядок, що складається з малих латинських літер та цифр без пробілів. Виведи той самий рядок у зворотному порядку.",
        en: "A non-empty string made of lowercase Latin letters and digits, with no spaces, is given. Print the same string in reverse order.",
        tr: "Boşluksuz, küçük Latin harfleri ve rakamlardan oluşan boş olmayan bir satır veriliyor. Aynı satırı ters sırada yazdır."
      },
      hint: {
        uk: "Зріз s[::-1] повертає рядок, перевернутий навпаки: перший символ стає останнім.",
        en: "The slice s[::-1] returns the string flipped: the first character becomes the last one.",
        tr: "s[::-1] dilimi satırı tersine çevirir: ilk karakter son karakter olur."
      },
      starter: "s = input().strip()\n",
      tests: [
        { in: "python\n", out: "nohtyp" },
        { in: "a\n", out: "a" },
        { in: "abc123\n", out: "321cba" }
      ]
    },
    {
      id: "charcount", level: 3,
      title: { uk: "Скільки разів трапляється символ", en: "Counting a character", tr: "Harf sayısı" },
      text: {
        uk: "У першому рядку дано текст із малих латинських літер та пробілів. У другому рядку — одна мала латинська літера. Виведи, скільки разів ця літера трапляється в тексті.",
        en: "The first line holds a text made of lowercase Latin letters and spaces. The second line holds one lowercase Latin letter. Print how many times this letter occurs in the text.",
        tr: "İlk satır küçük Latin harfleri ve boşluklarından oluşan bir metin, ikinci satır tek bir küçük Latin harfi içeriyor. Bu harfin metinde kaç kez geçtiğini yazdır."
      },
      hint: {
        uk: "Метод s.count(x) повертає кількість входжень підрядка x у рядок s; якщо літери немає, він дасть 0.",
        en: "The method s.count(x) returns how many times the substring x appears in s; if the letter is absent it gives 0.",
        tr: "s.count(x) metodu, x alt dizisinin s içinde kaç kez geçtiğini döndürür; harf yoksa 0 verir."
      },
      starter: "s = input()\nc = input().strip()\n",
      tests: [
        { in: "hello world\nl\n", out: "3" },
        { in: "python\nz\n", out: "0" },
        { in: "mississippi\ns\n", out: "4" }
      ]
    },
    {
      id: "sortnums", level: 3,
      title: { uk: "Числа за зростанням", en: "Sort the numbers", tr: "Sayıları sırala" },
      text: {
        uk: "У першому рядку дано кількість чисел n (1 ≤ n ≤ 100), у другому — n цілих чисел через пробіл (вони можуть бути від'ємними). Виведи ці самі числа, впорядковані за зростанням, через пробіл.",
        en: "The first line contains the amount of numbers n (1 ≤ n ≤ 100), the second line contains n integers separated by spaces (they may be negative). Print the same numbers sorted in ascending order, separated by a single space.",
        tr: "İlk satırda sayı adedi n (1 ≤ n ≤ 100), ikinci satırda boşlukla ayrılmış n tam sayı veriliyor (negatif olabilirler). Aynı sayıları artan sırada, tek boşlukla ayırarak yazdır."
      },
      hint: {
        uk: "Метод nums.sort() впорядковує список на місці, а sorted(nums) повертає новий впорядкований список. Щоб надрукувати числа через пробіл, скористайся ' '.join(map(str, nums)).",
        en: "The method nums.sort() orders the list in place, while sorted(nums) returns a new ordered list. To print the numbers separated by spaces use ' '.join(map(str, nums)).",
        tr: "nums.sort() metodü listeyi yerinde sıralar, sorted(nums) ise yeni sıralı bir liste döndürür. Sayıları boşlukla yazmak için ' '.join(map(str, nums)) kullan."
      },
      starter: "n = int(input())\nnums = list(map(int, input().split()))\n",
      tests: [
        { in: "5\n3 1 4 1 5\n", out: "1 1 3 4 5" },
        { in: "1\n7\n", out: "7" },
        { in: "6\n-2 0 -7 5 3 -1\n", out: "-7 -2 -1 0 3 5" }
      ]
    },
    {
      id: "dedupe", level: 3,
      title: { uk: "Слова без повторень", en: "Words without duplicates", tr: "Yinelenmeyen sözcükler" },
      text: {
        uk: "Дано один рядок, що складається зі слів із малих латинських літер, розділених одинарними пробілами. Виведи ці слова без повторень, зберігаючи порядок їхньої першої появи, через пробіл.",
        en: "One line of words made of lowercase Latin letters and separated by single spaces is given. Print the words with duplicates removed, keeping the order of their first occurrence, separated by a single space.",
        tr: "Küçük Latin harflerinden oluşan ve tek boşlukla ayrılmış sözcükleri içeren bir satır veriliyor. Yinelenenleri silip her sözcüğü ilk geçtiği sırayla, tek boşlukla ayrılmış olarak yazdır."
      },
      hint: {
        uk: "Проходь по словах і додавай до нового списку лише ті, яких у ньому ще немає: if w not in seen.",
        en: "Walk through the words and append to a new list only those that are not in it yet: if w not in seen.",
        tr: "Sözcükleri dolaş ve yeni listeye yalnızca içinde henüz olmayanları ekle: if w not in seen."
      },
      starter: "s = input()\nwords = s.split()\n",
      tests: [
        { in: "to be or not to be\n", out: "to be or not" },
        { in: "a a a a\n", out: "a" },
        { in: "x y z y x w\n", out: "x y z w" }
      ]
    },
    {
      id: "longestword", level: 3,
      title: { uk: "Найдовше слово", en: "The longest word", tr: "En uzun sözcük" },
      text: {
        uk: "Дано один рядок, що складається зі слів із малих латинських літер, розділених одинарними пробілами. Виведи найдовше слово. Якщо таких слів кілька, виведи те, що зустрічається найраніше.",
        en: "One line of words made of lowercase Latin letters and separated by single spaces is given. Print the longest word. If several words share the maximum length, print the one that appears first.",
        tr: "Küçük Latin harflerinden oluşan ve tek boşlukla ayrılmış sözcükleri içeren bir satır veriliyor. En uzun sözcüğü yazdır. Birkaç sözcük aynı en uzunlukta ise en erken geçenini yazdır."
      },
      hint: {
        uk: "Тримай у змінній best слово-кандидата й заміняй його, лише коли довжина нового слова більша за довжину best — тоді перше з рівних слів і залишиться.",
        en: "Keep a candidate word in best and replace it only when the new word is strictly longer, so the first word of equal length stays.",
        tr: "Bir aday sözcüğü best değişkeninde tut ve yalnızca yeni sözcük katı biçimde daha uzunsa değiştir; böylece eşit uzunlukta ilki kalır."
      },
      starter: "s = input()\nwords = s.split()\n",
      tests: [
        { in: "write a long program\n", out: "program" },
        { in: "hello\n", out: "hello" },
        { in: "cat dog cow\n", out: "cat" }
      ]
    },
    {
      id: "secondmax", level: 3,
      title: { uk: "Друге за величиною число", en: "Second largest number", tr: "En büyük ikinci sayı" },
      text: {
        uk: "У першому рядку дано кількість чисел n (2 ≤ n ≤ 50), у другому — n цілих чисел через пробіл; серед них є принаймні два різні. Виведи друге за величиною різне число, тобто найбільше значення, яке строго менше за максимум. Однакові числа вважай одним значенням.",
        en: "The first line contains n (2 ≤ n ≤ 50), the second line contains n integers separated by spaces; at least two of them are distinct. Print the second largest distinct value, that is, the greatest number strictly smaller than the maximum. Equal numbers count as a single value.",
        tr: "İlk satırda n (2 ≤ n ≤ 50), ikinci satırda boşlukla ayrılmış n tam sayı veriliyor; en az ikisi birbirinden farklıdır. Maksimumdan katı biçimde küçük olan en büyük değeri, yani farklı değerler arasındaki ikinci en büyüğünü yazdır. Eşit sayıları tek değer say."
      },
      hint: {
        uk: "Спочатку знайди максимум першого елемента й оновлюй його в циклі, а потім одним проходом знайди найбільше значення, яке строго менше за цей максимум.",
        en: "Find the maximum first, then make one more pass and keep the largest value that is strictly smaller than that maximum.",
        tr: "Önce maksimumu bul, sonra bir kez daha dolaşarak bu maksimumdan katı biçimde küçük olan en büyük değeri tut."
      },
      starter: "n = int(input())\nnums = list(map(int, input().split()))\n",
      tests: [
        { in: "5\n1 5 2 5 3\n", out: "3" },
        { in: "4\n7 7 3 3\n", out: "3" },
        { in: "3\n-1 -1 -5\n", out: "-5" }
      ]
    },
    {
      id: "mostfreq", level: 3,
      title: { uk: "Найчастіше число", en: "Most frequent number", tr: "En sık geçen sayı" },
      text: {
        uk: "У першому рядку дано кількість чисел n (1 ≤ n ≤ 100), у другому — n цілих чисел через пробіл. Виведи число, яке трапляється найчастіше. Якщо таких чисел кілька, виведи найменше з них.",
        en: "The first line contains n (1 ≤ n ≤ 100), the second line contains n integers separated by spaces. Print the number that occurs most often. If several numbers share the highest frequency, print the smallest of them.",
        tr: "İlk satırda n (1 ≤ n ≤ 100), ikinci satırda boşlukla ayrılmış n tam sayı veriliyor. En sık geçen sayıyı yazdır. Birkaç sayı en yüksek sıklığı paylaşırsa en küçüğünü yazdır."
      },
      hint: {
        uk: "Збери частоти в словнику: counts[x] = counts.get(x, 0) + 1. Порівнюючи частоти, при рівних значеннях обери менше число.",
        en: "Collect the frequencies in a dictionary: counts[x] = counts.get(x, 0) + 1. When two frequencies are equal, prefer the smaller value.",
        tr: "Sıklıkları sözlükte topla: counts[x] = counts.get(x, 0) + 1. Sıklıklar eşitse daha küçük değeri seç."
      },
      starter: "n = int(input())\nnums = list(map(int, input().split()))\ncounts = {}\n",
      tests: [
        { in: "6\n1 2 2 3 3 3\n", out: "3" },
        { in: "1\n42\n", out: "42" },
        { in: "7\n-2 -2 -3 -3 4 4 -1\n", out: "-3" }
      ]
    },
    {
      id: "altsum", level: 3,
      title: { uk: "Сума з чергуванням знаків", en: "Alternating sum", tr: "İşareti değişen toplam" },
      text: {
        uk: "У першому рядку дано кількість чисел n (1 ≤ n ≤ 100), у другому — n цілих чисел через пробіл. Додавай числа на непарних позиціях (перше, третє, ...) і віднімай числа на парних позиціях: a1 - a2 + a3 - a4 і так далі. Виведи отриманий результат.",
        en: "The first line contains n (1 ≤ n ≤ 100), the second line contains n integers separated by spaces. Add the numbers at odd positions (first, third, ...) and subtract the numbers at even positions: a1 - a2 + a3 - a4 and so on. Print the result.",
        tr: "İlk satırda n (1 ≤ n ≤ 100), ikinci satırda boşlukla ayrılmış n tam sayı veriliyor. Tek konumlardaki sayıları (birinci, üçüncü, ...) topla, çift konumlardakileri çıkar: a1 - a2 + a3 - a4 biçiminde devam et ve sonucu yazdır."
      },
      hint: {
        uk: "Індекси починаються з 0, тому i % 2 == 0 відповідає додаванню. Можна й зрізами: nums[0::2] додати, nums[1::2] відняти.",
        en: "Indices start at 0, so i % 2 == 0 means the number is added. Slices work too: add nums[0::2] and subtract nums[1::2].",
        tr: "Dizinler 0'dan başladığı için i % 2 == 0 toplama demektir. Dilimle de olur: nums[0::2] topla, nums[1::2] çıkar."
      },
      starter: "n = int(input())\nnums = list(map(int, input().split()))\n",
      tests: [
        { in: "3\n1 2 3\n", out: "2" },
        { in: "1\n9\n", out: "9" },
        { in: "5\n-2 3 -4 1 5\n", out: "-5" }
      ]
    },
  ];

  let listEl, detailEl, codeEl, titleEl, textEl, exampleEl, resultsEl, statusEl;
  let levelEl, solvedEl, checkBtn, hintBtn, resetBtn, nextBtn, backBtn, hintBoxEl;
  let current = null;
  let busy = false;
  let hintShown = false;

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

  function points(task) { return POINTS[task.level] || 10; }

  function getProgress() {
    try { return JSON.parse(localStorage.getItem(KEY_PREFIX + user())) || {}; }
    catch { return {}; }
  }

  function saveProgress(p) { localStorage.setItem(KEY_PREFIX + user(), JSON.stringify(p)); }

  function solvedCount() {
    const p = getProgress();
    return TASKS.filter((task) => p[task.id] && p[task.id].solved).length;
  }

  function isSolved(id) {
    const p = getProgress();
    return !!(p[id] && p[id].solved);
  }

  function draftKey(id) { return CODE_PREFIX + user() + "." + id; }

  function loadDraft(id, fallback) {
    const saved = localStorage.getItem(draftKey(id));
    return saved == null ? fallback : saved;
  }

  function saveDraft(id, code) { localStorage.setItem(draftKey(id), code); }

  /* ---------- Порівняння виводу: пробіли й порожні рядки в кінці не важливі ---------- */
  function normalize(text) {
    return String(text == null ? "" : text)
      .replace(/\r\n?/g, "\n")
      .split("\n")
      .map((l) => l.replace(/[ \t]+/g, " ").trim())
      .join("\n")
      .replace(/\n+$/g, "")
      .trim();
  }

  function clip(text) {
    const s = normalize(text);
    return s.length > MAX_SHOWN ? s.slice(0, MAX_SHOWN) + "…" : s;
  }

  /* ---------- Список задач ---------- */
  function renderList() {
    if (!listEl) return;
    listEl.innerHTML = "";
    const progress = getProgress();
    const solved = solvedCount();
    const earned = TASKS.reduce((sum, task) => sum + (progress[task.id] && progress[task.id].solved ? points(task) : 0), 0);
    const total = TASKS.reduce((sum, task) => sum + points(task), 0);

    const head = el("div", "tasks-progress");
    const label = el("div", "tasks-progress-label", t("tasks.progress", { n: solved, total: TASKS.length, points: earned, max: total }));
    const bar = el("div", "tasks-bar");
    const fill = el("div", "tasks-bar-fill");
    fill.style.width = (TASKS.length ? Math.round((solved / TASKS.length) * 100) : 0) + "%";
    bar.appendChild(fill);
    head.appendChild(label);
    head.appendChild(bar);
    listEl.appendChild(head);

    [1, 2, 3].forEach((level) => {
      const group = TASKS.filter((task) => task.level === level);
      if (!group.length) return;
      const section = el("div", "tasks-level");
      const h = el("h3", "tasks-level-title");
      h.appendChild(el("span", "tasks-level-name", t(LEVEL_KEYS[level])));
      h.appendChild(el("span", "tasks-level-points", t("tasks.levelPoints", { p: POINTS[level] })));
      section.appendChild(h);

      const grid = el("div", "tasks-grid");
      group.forEach((task) => {
        const done = !!(progress[task.id] && progress[task.id].solved);
        const card = el("button", "task-card" + (done ? " done" : ""));
        card.type = "button";
        card.dataset.id = task.id;
        const ico = el("span", "material-icons task-card-ico", done ? "task_alt" : "radio_button_unchecked");
        const body = el("span", "task-card-body");
        body.appendChild(el("span", "task-card-title", pick(task.title)));
        const meta = el("span", "task-card-meta");
        meta.appendChild(el("span", "task-card-points", t("tasks.points", { p: points(task) })));
        const attempts = progress[task.id] ? progress[task.id].attempts || 0 : 0;
        if (attempts) meta.appendChild(el("span", "task-card-attempts", t("tasks.attempts", { n: attempts })));
        if (done) meta.appendChild(el("span", "task-card-solved", t("tasks.solvedBadge")));
        body.appendChild(meta);
        card.appendChild(ico);
        card.appendChild(body);
        card.onclick = () => openTask(task.id);
        grid.appendChild(card);
      });
      section.appendChild(grid);
      listEl.appendChild(section);
    });

    if (detailEl) detailEl.classList.add("hidden");
    listEl.classList.remove("hidden");
  }

  /* ---------- Екран задачі ---------- */
  function openTask(id) {
    const task = TASKS.find((x) => x.id === id);
    if (!task) return;
    current = task;
    hintShown = false;
    if (hintBoxEl) { hintBoxEl.innerHTML = ""; hintBoxEl.classList.add("hidden"); }
    if (resultsEl) resultsEl.innerHTML = "";
    setStatus("");
    renderDetail();
    sfx("pop");
  }

  function renderDetail() {
    if (!current || !detailEl) return;
    titleEl.textContent = pick(current.title);
    textEl.textContent = pick(current.text);
    levelEl.textContent = t(LEVEL_KEYS[current.level]) + " · " + t("tasks.points", { p: points(current) });
    solvedEl.classList.toggle("hidden", !isSolved(current.id));
    codeEl.value = loadDraft(current.id, current.starter);

    exampleEl.innerHTML = "";
    const first = current.tests[0];
    if (first) {
      const wrap = el("div", "task-example-inner");
      const colIn = el("div", "task-example-col");
      colIn.appendChild(el("span", "task-example-label", t("tasks.inputData")));
      colIn.appendChild(el("pre", "task-example-pre", first.in.replace(/\n+$/g, "")));
      const colOut = el("div", "task-example-col");
      colOut.appendChild(el("span", "task-example-label", t("tasks.outputData")));
      colOut.appendChild(el("pre", "task-example-pre", first.out));
      wrap.appendChild(colIn);
      wrap.appendChild(colOut);
      exampleEl.appendChild(el("div", "task-example-title", t("tasks.example")));
      exampleEl.appendChild(wrap);
    }

    const idx = TASKS.indexOf(current);
    const nextTask = TASKS[idx + 1];
    nextBtn.classList.toggle("hidden", !nextTask);
    nextBtn.dataset.id = nextTask ? nextTask.id : "";

    detailEl.classList.remove("hidden");
    if (listEl) listEl.classList.add("hidden");
  }

  function setStatus(msg, cls) {
    if (!statusEl) return;
    statusEl.textContent = msg || "";
    statusEl.className = "task-status-line" + (cls ? " " + cls : "");
  }

  /* ---------- Перевірка розв'язку ---------- */
  // Спільна для розділу «Задачі» й олімпіадного тренажера: проганяє всі тести й повертає вердикт
  async function judge(code, task) {
    const results = [];
    let error = null;
    let errorLine = null;
    const started = performance.now();
    for (const test of task.tests) {
      const r = await global.PythonPad.execute(code, test.in);
      if (r.error) {
        error = r.error;
        errorLine = r.line || null;
        results.push({ ok: false, test: test, got: r.output, error: r.error, line: errorLine });
        break;
      }
      results.push({ ok: normalize(r.output) === normalize(test.out), test: test, got: r.output });
    }
    const passed = !error && results.length === task.tests.length && results.every((r) => r.ok);
    return {
      passed: passed, results: results, error: error, line: errorLine,
      okCount: results.filter((r) => r.ok).length,
      ms: Math.round(performance.now() - started)
    };
  }

  async function check() {
    if (busy || !current) return;
    const code = codeEl.value;
    if (!code.trim()) { toast(t("tasks.emptyCode")); sfx("error"); return; }
    if (!global.PythonPad || typeof global.PythonPad.execute !== "function") {
      setStatus(t("tasks.unavailable"), "error");
      return;
    }

    saveDraft(current.id, code);
    busy = true;
    checkBtn.disabled = true;
    resultsEl.innerHTML = "";
    setStatus(t("tasks.checking"), "loading");
    sfx("click");

    const task = current;
    let verdict;
    try {
      verdict = await judge(code, task);
    } catch (e) {
      verdict = { passed: false, results: [], error: (e && e.message) || String(e), line: null, okCount: 0, ms: 0 };
    }

    registerAttempt(task, verdict.passed);
    renderResults(task, verdict.results, verdict.error, verdict.ms, verdict.passed);
    busy = false;
    checkBtn.disabled = false;

    if (verdict.passed) {
      setStatus(t("tasks.accepted"), "ok");
      sfx("success");
    } else if (verdict.error) {
      setStatus(t("tasks.runtimeError"), "error");
      sfx("error");
    } else {
      setStatus(t("tasks.failed", { n: verdict.okCount, total: task.tests.length }), "bad");
      sfx("error");
    }
  }

  function registerAttempt(task, passed) {
    const p = getProgress();
    const rec = p[task.id] || { attempts: 0, solved: false };
    rec.attempts = (rec.attempts || 0) + 1;
    const firstSolve = passed && !rec.solved;
    if (passed) {
      rec.solved = true;
      rec.solvedAt = rec.solvedAt || new Date().toISOString().slice(0, 10);
    }
    p[task.id] = rec;
    saveProgress(p);
    if (firstSolve) {
      document.dispatchEvent(new CustomEvent("tasksolved", {
        detail: { id: task.id, points: points(task), solved: solvedCount(), total: TASKS.length }
      }));
      toast("🏆 " + t("tasks.solvedToast", { title: pick(task.title) }));
    }
    solvedEl.classList.toggle("hidden", !isSolved(task.id));
  }

  function renderResults(task, results, runtimeError, ms, passed) {
    resultsEl.innerHTML = "";
    const head = el("div", "task-results-head");
    head.appendChild(el("span", "material-icons", passed ? "verified" : "rule"));
    head.appendChild(el("span", null, t("tasks.resultsTitle", { ms: ms })));
    resultsEl.appendChild(head);

    results.forEach((r, i) => {
      const row = el("div", "test-row " + (r.ok ? "pass" : "fail"));
      row.appendChild(el("span", "material-icons test-ico", r.ok ? "check_circle" : "cancel"));
      const body = el("div", "test-body");
      body.appendChild(el("div", "test-name", t("tasks.test", { n: i + 1 })));
      body.appendChild(el("div", "test-line", t("tasks.inputData") + ": " + clip(r.test.in)));
      body.appendChild(el("div", "test-line", t("tasks.expected") + ": " + clip(r.test.out)));
      if (!r.ok) {
        body.appendChild(el("div", "test-line got", t("tasks.got") + ": " + (r.error ? clip(runtimeError || "") : clip(r.got))));
        if (r.line && r.error) {
          const jump = el("button", "goto-line");
          jump.type = "button";
          jump.textContent = "→ " + r.line;
          jump.title = t("python.gotoLine", { n: r.line });
          jump.onclick = () => gotoCodeLine(r.line);
          body.appendChild(jump);
        }
      }
      row.appendChild(body);
      resultsEl.appendChild(row);
    });
  }

  function gotoCodeLine(n) {
    const lines = codeEl.value.split("\n");
    const idx = Math.min(Math.max(n, 1), lines.length);
    let start = 0;
    for (let i = 0; i < idx - 1; i++) start += lines[i].length + 1;
    codeEl.focus();
    codeEl.setSelectionRange(start, start + lines[idx - 1].length);
    const lh = parseFloat(getComputedStyle(codeEl).lineHeight) || 22;
    codeEl.scrollTop = Math.max(0, (idx - 1) * lh - codeEl.clientHeight / 2);
  }

  function showHint() {
    if (!current) return;
    hintShown = true;
    if (!hintBoxEl) return;
    hintBoxEl.innerHTML = "";
    hintBoxEl.classList.remove("hidden");
    const box = el("div", "task-hint-inner");
    box.appendChild(el("span", "material-icons", "lightbulb"));
    box.appendChild(el("span", null, pick(current.hint)));
    hintBoxEl.appendChild(box);
    sfx("pop");
  }

  function resetCode() {
    if (!current) return;
    codeEl.value = current.starter;
    saveDraft(current.id, current.starter);
    resultsEl.innerHTML = "";
    setStatus("");
    sfx("click");
  }

  function showList() {
    current = null;
    renderList();
    sfx("click");
  }

  /* ---------- Ініціалізація ---------- */
  function init() {
    listEl = $("#tasksList");
    detailEl = $("#taskDetail");
    if (!listEl || !detailEl) return;
    codeEl = $("#taskCode");
    titleEl = $("#taskTitle");
    textEl = $("#taskText");
    exampleEl = $("#taskExample");
    resultsEl = $("#taskResults");
    statusEl = $("#taskStatus");
    levelEl = $("#taskLevel");
    solvedEl = $("#taskSolved");
    checkBtn = $("#taskCheck");
    hintBtn = $("#taskHint");
    resetBtn = $("#taskReset");
    nextBtn = $("#taskNext");
    backBtn = $("#taskBack");
    hintBoxEl = $("#taskHintBox");

    checkBtn.onclick = check;
    hintBtn.onclick = showHint;
    resetBtn.onclick = resetCode;
    backBtn.onclick = showList;
    nextBtn.onclick = () => { if (nextBtn.dataset.id) openTask(nextBtn.dataset.id); };

    codeEl.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); check(); return; }
      if (e.key === "Tab") {
        e.preventDefault();
        const start = codeEl.selectionStart;
        const end = codeEl.selectionEnd;
        const spaces = " ".repeat(Number(global.Settings && global.Settings.get("tabSize")) || 4);
        codeEl.value = codeEl.value.slice(0, start) + spaces + codeEl.value.slice(end);
        codeEl.selectionStart = codeEl.selectionEnd = start + spaces.length;
      }
    });
    codeEl.addEventListener("input", () => { if (current) saveDraft(current.id, codeEl.value); });

    document.addEventListener("langchange", () => {
      if (current) renderDetail(); else renderList();
    });

    renderList();
  }

  function render() {
    if (!listEl) { init(); return; }
    if (current) renderDetail(); else renderList();
  }

  global.Tasks = {
    init, render, open: openTask,
    list: () => TASKS.slice(),
    count: TASKS.length,
    maxPoints: TASKS.reduce((sum, task) => sum + points(task), 0),
    judge, points, normalize, isSolved,
    localize: pick, POINTS, LEVEL_KEYS
  };
})(window);
