/* daily.js — «Щоденний виклик»: одна задача на день, однакова для всіх користувачів,
   та серія (стрик) днів, коли задачі розв'язано поспіль.
   Прогрес зберігається локально для кожного користувача: app.daily.<user>
   Код дня — у app.daily.code.<user>.<date> */
(function (global) {
  const $ = (s) => document.querySelector(s);
  const KEY_PREFIX = "app.daily.";
  const CODE_PREFIX = "app.daily.code.";
  const POINTS = { 1: 10, 2: 15, 3: 20 };
  const LEVEL_KEYS = { 1: "tasks.level1", 2: "tasks.level2", 3: "tasks.level3" };
  const WEEK_DAYS = 7;

  let dateEl, streakEl, bestEl, totalEl, weekEl;
  let doneEl, countdownEl, taskEl, titleEl, textEl, metaEl, exampleEl;
  let codeEl, statusEl, hintBoxEl, checkBtn, hintBtn, resetBtn;
  let current = null;
  let busy = false;
  let ready = false;
  let tick = null;

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

  /* ---------- Календар ---------- */
  function key(d) {
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }

  function shift(d, delta) {
    const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    x.setDate(x.getDate() + delta);
    return x;
  }

  const LOCALES = {
    uk: "uk-UA", en: "en-US", tr: "tr-TR", de: "de-DE", pl: "pl-PL", es: "es-ES", fr: "fr-FR",
    it: "it-IT", pt: "pt-BR", zh: "zh-CN", ko: "ko-KR", hi: "hi-IN", cs: "cs-CZ", sv: "sv-SE",
    nl: "nl-NL", hu: "hu-HU", ro: "ro-RO", id: "id-ID", el: "el-GR", ar: "ar-EG", he: "he-IL",
    vi: "vi-VN", th: "th-TH"
  };

  function pretty(d) {
    try {
      const loc = LOCALES[global.I18n ? global.I18n.lang : "uk"] || "en-US";
      return new Intl.DateTimeFormat(loc, { day: "numeric", month: "long" }).format(d);
    } catch (e) { return key(d); }
  }

  function seedOf(d) {
    return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
  }

  function mulberry32(a) {
    return function () {
      a = (a + 0x6d2b79f5) | 0;
      let x = Math.imul(a ^ (a >>> 15), 1 | a);
      x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x;
      return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
    };
  }

  function ri(r, min, max) { return min + Math.floor(r() * (max - min + 1)); }

  /* ---------- Банк шаблонів ----------
     Числа випадкових прикладів живуть лише у тестах, тому текст задачі
     не містить даних дня і перекладається як звичайний контент. */
  const WORDS = ["python", "logic", "array", "loop", "digit", "river", "cloud", "planet", "cipher", "string", "object", "codec"];

  const TEMPLATES = [
    {
      id: "sum3", level: 1,
      title: { uk: "Сума трьох чисел", en: "Sum of three numbers", tr: "Üç sayının toplamı" },
      text: {
        uk: "На вхід надходять три цілих числа, кожне в окремому рядку. Виведи їхню суму.",
        en: "Three integers are given, one per line. Print their sum.",
        tr: "Her biri ayrı satırda üç tam sayı veriliyor. Toplamlarını yazdır."
      },
      hint: {
        uk: "Зчитай три змінні через int(input()) і виведи a + b + c одним print().",
        en: "Read three variables with int(input()) and print a + b + c with one call.",
        tr: "int(input()) ile üç değişken oku ve a + b + c ifadesini tek print() ile yazdır."
      },
      starter: "a = int(input())\nb = int(input())\nc = int(input())\n",
      make(r) {
        const tests = [];
        for (let i = 0; i < 3; i++) {
          const a = ri(r, -20, 60), b = ri(r, -20, 60), c = ri(r, -20, 60);
          tests.push({ in: a + "\n" + b + "\n" + c + "\n", out: String(a + b + c) });
        }
        return tests;
      }
    },
    {
      id: "parity", level: 1,
      title: { uk: "Парність числа", en: "Parity of a number", tr: "Sayının tekliği" },
      text: {
        uk: "Дано ціле число. Виведи 1, якщо воно парне, і 0, якщо непарне.",
        en: "An integer is given. Print 1 if it is even and 0 if it is odd.",
        tr: "Bir tam sayı veriliyor. Çiftse 1, tekse 0 yazdır."
      },
      hint: {
        uk: "Оператор % дає остачу: n % 2 == 0 означає парне число.",
        en: "The % operator gives the remainder: n % 2 == 0 means the number is even.",
        tr: "% operatörü kalanı verir: n % 2 == 0 ise sayı çifttir."
      },
      starter: "n = int(input())\n",
      make(r) {
        const tests = [];
        for (let i = 0; i < 3; i++) {
          const n = ri(r, -100, 200);
          tests.push({ in: n + "\n", out: n % 2 === 0 ? "1" : "0" });
        }
        return tests;
      }
    },
    {
      id: "maxmin3", level: 1,
      title: { uk: "Найбільше й найменше", en: "Largest and smallest", tr: "En büyük ve en küçük" },
      text: {
        uk: "Дано три цілих числа, кожне в окремому рядку. Виведи спочатку найбільше, а потім найменше — теж у двох рядках.",
        en: "Three integers are given, one per line. Print the largest and then the smallest, each on its own line.",
        tr: "Her biri ayrı satırda üç tam sayı veriliyor. Önce en büyüğü, sonra en küçüğü ayrı satırlarda yazdır."
      },
      hint: {
        uk: "Функції max() та min() приймають кілька аргументів одразу.",
        en: "The max() and min() functions accept several arguments at once.",
        tr: "max() ve min() fonksiyonları aynı anda birkaç argüman alır."
      },
      starter: "a = int(input())\nb = int(input())\nc = int(input())\n",
      make(r) {
        const tests = [];
        for (let i = 0; i < 3; i++) {
          const arr = [ri(r, 1, 99), ri(r, 1, 99), ri(r, 1, 99)];
          tests.push({ in: arr.join("\n") + "\n", out: String(Math.max.apply(null, arr)) + "\n" + String(Math.min.apply(null, arr)) });
        }
        return tests;
      }
    },
    {
      id: "revdigits", level: 1,
      title: { uk: "Цифри навпаки", en: "Digits reversed", tr: "Ters rakamlar" },
      text: {
        uk: "Дано трицифрове число. Виведи число, у якому його цифри стоять у зворотному порядку.",
        en: "A three-digit number is given. Print the number formed by its digits in reverse order.",
        tr: "Üç basamaklı bir sayı veriliyor. Rakamlarını ters sıraya yazarak oluşan sayıyı göster."
      },
      hint: {
        uk: "Візьми рядок str(n), переверни його зрізом [::-1] і перетвори назад на int().",
        en: "Take str(n), reverse it with the slice [::-1] and turn it back into int().",
        tr: "str(n) al, [::-1] dilimiyle ters çevir ve tekrar int() yap."
      },
      starter: "n = int(input())\n",
      make(r) {
        const tests = [];
        for (let i = 0; i < 3; i++) {
          const n = ri(r, 1, 9) * 100 + ri(r, 0, 9) * 10 + ri(r, 1, 9);
          tests.push({ in: n + "\n", out: String(Number(String(n).split("").reverse().join(""))) });
        }
        return tests;
      }
    },
    {
      id: "square", level: 1,
      title: { uk: "Периметр і площа", en: "Perimeter and area", tr: "Çevre ve alan" },
      text: {
        uk: "Дано сторону квадрата. Виведи у двох рядках: спершу периметр, потім площу.",
        en: "The side of a square is given. Print two lines: first the perimeter, then the area.",
        tr: "Karenin kenarı veriliyor. İki satır yazdır: önce çevre, sonra alan."
      },
      hint: {
        uk: "Периметр — 4 · a, площа — a · a (або a ** 2).",
        en: "Perimeter is 4 · a, area is a · a (or a ** 2).",
        tr: "Çevre 4 · a, alan a · a (veya a ** 2)."
      },
      starter: "a = int(input())\n",
      make(r) {
        const tests = [];
        for (let i = 0; i < 3; i++) {
          const a = ri(r, 2, 40);
          tests.push({ in: a + "\n", out: String(4 * a) + "\n" + String(a * a) });
        }
        return tests;
      }
    },
    {
      id: "absdiff", level: 1,
      title: { uk: "Різниця без знака", en: "Difference without sign", tr: "İşaretsiz fark" },
      text: {
        uk: "Дано два цілих числа, кожне в окремому рядку. Виведи відстань між ними на числовій прямій.",
        en: "Two integers are given, one per line. Print the distance between them on the number line.",
        tr: "Her biri ayrı satırda iki tam sayı veriliyor. Sayı doğrusu üzerindeki aralığı yazdır."
      },
      hint: {
        uk: "abs(a - b) дає відстань і завжди невід'ємне число.",
        en: "abs(a - b) gives the distance and is always non-negative.",
        tr: "abs(a - b) mesafeyi verir ve daima negativesizdir."
      },
      starter: "a = int(input())\nb = int(input())\n",
      make(r) {
        const tests = [];
        for (let i = 0; i < 3; i++) {
          const a = ri(r, -50, 50), b = ri(r, -50, 50);
          tests.push({ in: a + "\n" + b + "\n", out: String(Math.abs(a - b)) });
        }
        return tests;
      }
    },
    {
      id: "multable", level: 2,
      title: { uk: "Таблиця множення", en: "Multiplication table", tr: "Çarpım tablosu" },
      text: {
        uk: "Дано число n. Виведи в один рядок п'ять добутків: n · 1, n · 2, …, n · 5, розділені пробілом.",
        en: "A number n is given. Print one line with five products: n · 1, n · 2, …, n · 5, separated by spaces.",
        tr: "Bir n sayısı veriliyor. Tek satırda beş çarpımı yazdır: n · 1, n · 2, …, n · 5, aralarında boşluk."
      },
      hint: {
        uk: "Цикл for i in range(1, 6), а всі п'ять добутків виведе один print із sep=' '.",
        en: "Loop over range(1, 6) and print all five products with one call using sep=' '.",
        tr: "range(1, 6) içinde döngü kur ve beş çarpımı tek print ile sep=' ' kullanıp yazdır."
      },
      starter: "n = int(input())\n",
      make(r) {
        const tests = [];
        for (let i = 0; i < 3; i++) {
          const n = ri(r, 2, 12);
          const out = [1, 2, 3, 4, 5].map((k) => n * k).join(" ");
          tests.push({ in: n + "\n", out: out });
        }
        return tests;
      }
    },
    {
      id: "factorial", level: 2,
      title: { uk: "Факторіал", en: "Factorial", tr: "Faktöriyel" },
      text: {
        uk: "Дано натуральне число n. Виведи добуток усіх цілих чисел від 1 до n включно.",
        en: "A natural number n is given. Print the product of every integer from 1 to n inclusive.",
        tr: "Bir n doğal sayısı veriliyor. 1'den n'e kadar tüm tam sayıların çarpımını yazdır."
      },
      hint: {
        uk: "Почни з result = 1 і множ у циклі for i in range(2, n + 1).",
        en: "Start with result = 1 and multiply inside for i in range(2, n + 1).",
        tr: "result = 1 ile başla ve for i in range(2, n + 1) döngüsünde çarp."
      },
      starter: "n = int(input())\n",
      make(r) {
        const tests = [];
        for (let i = 0; i < 3; i++) {
          const n = ri(r, 2, 9);
          let f = 1;
          for (let k = 2; k <= n; k++) f *= k;
          tests.push({ in: n + "\n", out: String(f) });
        }
        return tests;
      }
    },
    {
      id: "vowels", level: 2,
      title: { uk: "Голосні й приголосні", en: "Vowels and consonants", tr: "Ünlü ve ünsüz" },
      text: {
        uk: "Дано слово з малих латинських літер. Виведи в один рядок через пробіл дві кількості: голосних (a, e, i, o, u) та приголосних.",
        en: "A word of lowercase Latin letters is given. Print one line with two counts separated by a space: vowels (a, e, i, o, u) and consonants.",
        tr: "Küçük Latin harflerinden bir kelime veriliyor. Tek satırda boşlukla iki sayı yazdır: ünlü (a, e, i, o, u) ve ünsüz sayısı."
      },
      hint: {
        uk: "Перебери літери в рядку та перевіряй, чи вони належать рядку 'aeiou'.",
        en: "Iterate over the letters and test membership in the string 'aeiou'.",
        tr: "Harfler üzerinde dolaş ve 'aeiou' dizisinde olup olmadıklarına bak."
      },
      starter: "word = input()\n",
      make(r) {
        const tests = [];
        for (let i = 0; i < 3; i++) {
          const w = WORDS[ri(r, 0, WORDS.length - 1)];
          let v = 0;
          for (const ch of w) if ("aeiou".includes(ch)) v++;
          tests.push({ in: w + "\n", out: v + " " + (w.length - v) });
        }
        return tests;
      }
    },
    {
      id: "palindrome", level: 2,
      title: { uk: "Паліндром чи ні", en: "Palindrome or not", tr: "Palindrom mu" },
      text: {
        uk: "Дано слово з малих латинських літер. Виведи 1, якщо воно читається однаково зліва направо і справа наліво, і 0 інакше.",
        en: "A word of lowercase Latin letters is given. Print 1 if it reads the same forwards and backwards, otherwise 0.",
        tr: "Küçük Latin harflerinden bir kelime veriliyor. Soldan ve sağdan aynı okunuyorsa 1, değilse 0 yazdır."
      },
      hint: {
        uk: "Порівняй слово з його зрізом задом наперед: s == s[::-1].",
        en: "Compare the word with its slice: s == s[::-1].",
        tr: "Kelimeyi ters dilimiyle karşılaştır: s == s[::-1]."
      },
      starter: "s = input()\n",
      make(r) {
        const letters = "abcde";
        const tests = [];
        for (let i = 0; i < 3; i++) {
          const len = ri(r, 3, 6);
          let s = "";
          for (let k = 0; k < len; k++) s += letters[ri(r, 0, letters.length - 1)];
          if (r() < 0.5) s = s.slice(0, Math.floor(len / 2)) + s.slice(0, Math.ceil(len / 2)).split("").reverse().join("");
          tests.push({ in: s + "\n", out: s === s.split("").reverse().join("") ? "1" : "0" });
        }
        return tests;
      }
    },
    {
      id: "fib", level: 2,
      title: { uk: "Число Фібоначчі", en: "Fibonacci number", tr: "Fibonacci sayısı" },
      text: {
        uk: "Дано номер n. Нульовий член послідовності дорівнює 0, перший — 1, кожен наступний — сумі двох попередніх. Виведи n-ний член.",
        en: "An index n is given. The zeroth member of the sequence is 0, the first is 1, every next one is the sum of the two before. Print the n-th member.",
        tr: "Bir n numarası veriliyor. Zincirin sıfırıncı üyesi 0, birincisi 1, sonrakiler önceki ikisinin toplamı. n. üyeyi yazdır."
      },
      hint: {
        uk: "Тримай дві змінні a, b = 0, 1 і роби a, b = b, a + b у циклі.",
        en: "Keep two variables a, b = 0, 1 and step with a, b = b, a + b inside a loop.",
        tr: "a, b = 0, 1 değişkenlerini tut ve döngü içinde a, b = b, a + b yap."
      },
      starter: "n = int(input())\n",
      make(r) {
        const tests = [];
        for (let i = 0; i < 3; i++) {
          const n = ri(r, 6, 30);
          let a = 0, b = 1;
          for (let k = 0; k < n; k++) { const c = a + b; a = b; b = c; }
          tests.push({ in: n + "\n", out: String(a) });
        }
        return tests;
      }
    },
    {
      id: "sumdigits", level: 2,
      title: { uk: "Сума цифр", en: "Sum of digits", tr: "Rakamlar toplamı" },
      text: {
        uk: "Дано додатне ціле число. Виведи суму його цифр.",
        en: "A positive integer is given. Print the sum of its digits.",
        tr: "Pozitif bir tam sayı veriliyor. Rakamlarının toplamını yazdır."
      },
      hint: {
        uk: "Можна пройтись по рядку str(n) і перетворити кожну літеру на int().",
        en: "Walk over the string str(n) and turn every character into int().",
        tr: "str(n) dizesi üzerinde dolaş ve her karakteri int() yap."
      },
      starter: "n = int(input())\n",
      make(r) {
        const tests = [];
        for (let i = 0; i < 3; i++) {
          const n = ri(r, 1000, 999999);
          const out = String(n).split("").reduce((s, ch) => s + Number(ch), 0);
          tests.push({ in: n + "\n", out: String(out) });
        }
        return tests;
      }
    },
    {
      id: "gcd", level: 3,
      title: { uk: "Найбільший спільний дільник", en: "Greatest common divisor", tr: "En büyük ortak bölen" },
      text: {
        uk: "Дано два додатних цілих числа, кожне в окремому рядку. Виведи їхній найбільший спільний дільник.",
        en: "Two positive integers are given, one per line. Print their greatest common divisor.",
        tr: "Her biri ayrı satırda iki pozitif tam sayı veriliyor. En büyük ortak bölenlerini yazdır."
      },
      hint: {
        uk: "Алгоритм Евкліда: поки b ≠ 0, виконуй a, b = b, a % b.",
        en: "Euclid's algorithm: while b ≠ 0 do a, b = b, a % b.",
        tr: "Öklid algoritması: b ≠ 0 olduğu sürece a, b = b, a % b yap."
      },
      starter: "a = int(input())\nb = int(input())\n",
      make(r) {
        const tests = [];
        for (let i = 0; i < 3; i++) {
          const a = ri(r, 2, 500), b = ri(r, 2, 500);
          let x = a, y = b;
          while (y) { const c = x % y; x = y; y = c; }
          tests.push({ in: a + "\n" + b + "\n", out: String(x) });
        }
        return tests;
      }
    },
    {
      id: "primes", level: 3,
      title: { uk: "Прості числа до n", en: "Primes up to n", tr: "n'e kadar asal sayılar" },
      text: {
        uk: "Дано число n. Виведи в один рядок усі прості числа, не більші за n, розділені пробілом — у зростаючому порядку.",
        en: "A number n is given. Print one line with every prime not greater than n, space-separated, in increasing order.",
        tr: "Bir n sayısı veriliyor. Tek satırda n'den küçük-eşit tüm asal sayıları artan sırada ve boşlukla ayırarak yazdır."
      },
      hint: {
        uk: "Перебери k від 2 до n і для кожного перевіряй дільники аж до sqrt(k).",
        en: "Iterate k from 2 to n and test divisors up to sqrt(k) for each of them.",
        tr: "k için 2'den n'e kadar dolaş ve her birinde sqrt(k)'ya kadar bölenleri dene."
      },
      starter: "n = int(input())\n",
      make(r) {
        const tests = [];
        for (let i = 0; i < 3; i++) {
          const n = ri(r, 12, 45);
          const list = [];
          for (let k = 2; k <= n; k++) {
            let prime = true;
            for (let d = 2; d * d <= k; d++) if (k % d === 0) { prime = false; break; }
            if (prime) list.push(k);
          }
          tests.push({ in: n + "\n", out: list.join(" ") });
        }
        return tests;
      }
    },
    {
      id: "sortlist", level: 3,
      title: { uk: "Відсортований ряд", en: "Sorted row", tr: "Sıralı dizi" },
      text: {
        uk: "Перший рядок — кількість чисел n, другий рядок — самі n цілих чисел через пробіл. Виведи ці числа у порядку зростання через пробіл.",
        en: "The first line is the count n, the second line holds the n integers separated by spaces. Print the same numbers in increasing order, space-separated.",
        tr: "İlk satır n sayısını, ikinci satır boşlukla ayrılmış n tam sayıyı veriyor. Aynı sayıları artan sırada, boşlukla ayırarak yazdır."
      },
      hint: {
        uk: "map(int, input().split()) дає список чисел, а sorted() — його копію по порядку.",
        en: "map(int, input().split()) builds the list of numbers and sorted() returns it in order.",
        tr: "map(int, input().split()) sayı listesini kurar, sorted() onu sıralı verir."
      },
      starter: "n = int(input())\nnums = list(map(int, input().split()))\n",
      make(r) {
        const tests = [];
        for (let i = 0; i < 3; i++) {
          const n = ri(r, 4, 9);
          const arr = [];
          for (let k = 0; k < n; k++) arr.push(ri(r, -99, 99));
          const out = arr.slice().sort((a, b) => a - b).join(" ");
          tests.push({ in: n + "\n" + arr.join(" ") + "\n", out: out });
        }
        return tests;
      }
    },
    {
      id: "median3", level: 3,
      title: { uk: "Медіана трьох", en: "Median of three", tr: "Üçünce medyan" },
      text: {
        uk: "Дано три цілих числа, кожне в окремому рядку. Виведи те, яке стоїть посередині, якщо впорядкувати всі три за зростанням.",
        en: "Three integers are given, one per line. Print the one that sits in the middle once all three are sorted increasingly.",
        tr: "Her biri ayrı satırda üç tam sayı veriliyor. Üçünü artan sıraya koyduğunda ortada kalan sayıyı yazdır."
      },
      hint: {
        uk: "sorted([a, b, c])[1] — і відповідь в одному рядку.",
        en: "sorted([a, b, c])[1] gives the answer in a single line.",
        tr: "sorted([a, b, c])[1] tek satırda cevabı verir."
      },
      starter: "a = int(input())\nb = int(input())\nc = int(input())\n",
      make(r) {
        const tests = [];
        for (let i = 0; i < 3; i++) {
          const arr = [ri(r, -80, 80), ri(r, -80, 80), ri(r, -80, 80)];
          const mid = arr.slice().sort((x, y) => x - y)[1];
          tests.push({ in: arr.join("\n") + "\n", out: String(mid) });
        }
        return tests;
      }
    }
  ];

  /* ---------- Задача конкретного дня ---------- */
  // Три тести дня мають різні вхідні дані, тому набір перебирається, доки вводи не стануть унікальними.
  function buildTests(tpl, seed) {
    let last = null;
    for (let attempt = 0; attempt < 12; attempt++) {
      const r = mulberry32((seed ^ (0x5bf03635 + attempt * 0x9e3779b9)) >>> 0);
      last = tpl.make(r);
      if (new Set(last.map((c) => c.in)).size === last.length) return last;
    }
    return last;
  }

  function taskForDate(d) {
    const seed = seedOf(d);
    const pickRnd = mulberry32(seed);
    const tpl = TEMPLATES[Math.floor(pickRnd() * TEMPLATES.length) % TEMPLATES.length];
    const tests = buildTests(tpl, seed);
    return {
      id: "daily-" + key(d),
      tplId: tpl.id,
      level: tpl.level,
      title: tpl.title,
      text: tpl.text,
      hint: tpl.hint,
      starter: tpl.starter,
      tests: tests
    };
  }

  /* ---------- Прогрес ---------- */
  function getState() {
    const fallback = { days: {}, best: 0, total: 0 };
    try {
      const raw = JSON.parse(localStorage.getItem(KEY_PREFIX + user()));
      if (raw && raw.days) return Object.assign(fallback, raw);
    } catch (e) { /* пошкоджений запис — починаємо з чистого */ }
    return fallback;
  }

  function saveState(s) { localStorage.setItem(KEY_PREFIX + user(), JSON.stringify(s)); }

  function isSolvedToday(s, d) { return !!s.days[key(d)]; }

  function currentStreak(s, d) {
    let day = d;
    if (!s.days[key(day)]) day = shift(day, -1);
    let n = 0;
    while (s.days[key(day)]) {
      n++;
      if (n > 3650) break;
      day = shift(day, -1);
    }
    return n;
  }

  function codeKey(d) { return CODE_PREFIX + user() + "." + key(d); }
  function loadDraft(d) { return localStorage.getItem(codeKey(d)) || ""; }
  function saveDraft(d, code) { localStorage.setItem(codeKey(d), code); }

  /* ---------- Рендер шапки ---------- */
  function renderHero() {
    const now = new Date();
    const s = getState();
    const streak = currentStreak(s, now);
    if (dateEl) dateEl.textContent = t("daily.today", { date: pretty(now) });
    if (streakEl) streakEl.textContent = String(streak);
    if (bestEl) bestEl.textContent = t("daily.best", { n: s.best || 0 });
    if (totalEl) totalEl.textContent = t("daily.total", { n: s.total || 0 });

    if (weekEl) {
      weekEl.innerHTML = "";
      for (let i = WEEK_DAYS - 1; i >= 0; i--) {
        const day = shift(now, -i);
        const solved = !!s.days[key(day)];
        const cell = el("div", "daily-cell" + (solved ? " solved" : "") + (i === 0 ? " today" : ""));
        const dot = el("span", "daily-cell-dot");
        dot.appendChild(el("span", "material-icons", solved ? "check" : (i === 0 ? "bolt" : "remove")));
        cell.appendChild(dot);
        cell.appendChild(el("span", "daily-cell-date", pretty(day).replace(/\s.*$/, "")));
        cell.title = pretty(day) + " · " + t(solved ? "daily.cellSolved" : "daily.cellOpen");
        weekEl.appendChild(cell);
      }
    }
  }

  function renderDone() {
    const solved = isSolvedToday(getState(), new Date());
    if (doneEl) doneEl.classList.toggle("hidden", !solved);
    if (solved) startCountdown(); else stopCountdown();
  }

  function msToNextDay() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0) - now;
  }

  function clock(ms) {
    const s = Math.max(0, Math.floor(ms / 1000));
    return String(Math.floor(s / 3600)).padStart(2, "0") + ":" + String(Math.floor(s / 60) % 60).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0");
  }

  function stopCountdown() {
    if (tick) { clearInterval(tick); tick = null; }
  }

  function startCountdown() {
    if (tick || !countdownEl) return;
    const paint = () => {
      const left = msToNextDay();
      countdownEl.textContent = clock(left);
      if (left <= 0) { stopCountdown(); render(); }
    };
    paint();
    tick = setInterval(paint, 1000);
  }

  /* ---------- Рендер задачі ---------- */
  function renderMeta() {
    if (!metaEl || !current) return;
    metaEl.innerHTML = "";
    metaEl.appendChild(el("span", "task-level-badge", t(LEVEL_KEYS[current.level])));
    metaEl.appendChild(el("span", "task-card-points", t("tasks.points", { p: POINTS[current.level] })));
    const solved = isSolvedToday(getState(), new Date());
    if (solved) {
      const badge = el("span", "task-solved-badge");
      badge.appendChild(el("span", "material-icons", "task_alt"));
      badge.appendChild(el("span", null, t("daily.solvedBadge")));
      metaEl.appendChild(badge);
    }
  }

  function renderExample() {
    if (!exampleEl || !current) return;
    exampleEl.innerHTML = "";
    const first = current.tests[0];
    const wrap = el("div", "task-example-inner");
    const colIn = el("div", "task-example-col");
    colIn.appendChild(el("span", "task-example-label", t("tasks.inputData")));
    colIn.appendChild(el("pre", "task-example-pre", first.in.replace(/\n+$/g, "")));
    const colOut = el("div", "task-example-col");
    colOut.appendChild(el("span", "task-example-label", t("tasks.outputData")));
    colOut.appendChild(el("pre", "task-example-pre", first.out));
    wrap.appendChild(colIn);
    wrap.appendChild(colOut);
    exampleEl.appendChild(el("div", "task-example-title", t("daily.exampleTitle")));
    exampleEl.appendChild(wrap);
  }

  function setStatus(msg, cls) {
    if (!statusEl) return;
    statusEl.textContent = msg || "";
    statusEl.className = "task-status-line" + (cls ? " " + cls : "");
  }

  function renderTask() {
    if (!current || !titleEl) return;
    titleEl.textContent = pick(current.title);
    textEl.textContent = pick(current.text);
    const draft = loadDraft(new Date());
    codeEl.value = draft || current.starter;
    if (hintBoxEl) { hintBoxEl.classList.add("hidden"); hintBoxEl.textContent = pick(current.hint); }
    setStatus("");
    renderMeta();
    renderExample();
  }

  function render() {
    if (!taskEl) { if (!ready) init(); return; }
    const now = new Date();
    const fresh = !current || current.id !== "daily-" + key(now);
    if (fresh) current = taskForDate(now);
    renderHero();
    renderDone();
    if (fresh) renderTask();
    else { renderMeta(); }
    console.info("[daily.js] render", current.tplId);
  }

  /* ---------- Перевірка ---------- */
  async function check() {
    if (busy || !current) return;
    const code = codeEl.value;
    if (!code.trim()) { toast(t("tasks.emptyCode")); sfx("error"); return; }
    if (!global.Tasks || typeof global.Tasks.judge !== "function") {
      setStatus(t("tasks.unavailable"), "error");
      return;
    }
    const now = new Date();
    saveDraft(now, code);
    busy = true;
    checkBtn.disabled = true;
    setStatus(t("tasks.checking"), "loading");
    sfx("click");

    let verdict;
    try {
      verdict = await global.Tasks.judge(code, current);
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
      if (!isSolvedToday(getState(), now)) registerSolved(now);
      else toast(t("daily.againToast"));
    } else if (verdict.error) {
      setStatus(global.UI && global.UI.errStatus ? global.UI.errStatus(t("tasks.runtimeError"), verdict.err && verdict.err.type) : t("tasks.runtimeError"), "error");
      sfx("error");
    } else {
      setStatus(t("tasks.failed", { n: verdict.okCount, total: current.tests.length }), "bad");
      sfx("error");
    }
  }

  function registerSolved(now) {
    const s = getState();
    s.days[key(now)] = current.tplId;
    s.total = Object.keys(s.days).length;
    const streak = currentStreak(s, now);
    if (streak > (s.best || 0)) s.best = streak;
    saveState(s);

    renderHero();
    renderDone();
    renderMeta();
    toast(t("daily.solvedToast", { title: pick(current.title), p: POINTS[current.level] }));
    if (streak >= 2) setTimeout(() => toast(t("daily.streakToast", { n: streak })), 700);

    document.dispatchEvent(new CustomEvent("dailydone", {
      detail: { streak: streak, total: s.total, best: s.best, tpl: current.tplId }
    }));
  }

  /* ---------- Ініціалізація ---------- */
  function init() {
    if (ready) { render(); return; }
    ready = true;
    dateEl = $("#dailyDate");
    streakEl = $("#dailyStreak");
    bestEl = $("#dailyBest");
    totalEl = $("#dailyTotal");
    weekEl = $("#dailyWeek");
    doneEl = $("#dailyDone");
    countdownEl = $("#dailyCountdown");
    taskEl = $("#dailyTask");
    titleEl = $("#dailyTaskTitle");
    textEl = $("#dailyTaskText");
    metaEl = $("#dailyTaskMeta");
    exampleEl = $("#dailyExample");
    codeEl = $("#dailyCode");
    statusEl = $("#dailyStatus");
    hintBoxEl = $("#dailyHintBox");
    checkBtn = $("#dailyCheck");
    hintBtn = $("#dailyHint");
    resetBtn = $("#dailyReset");
    if (!taskEl || !codeEl) return;

    checkBtn.onclick = check;
    hintBtn.onclick = () => {
      hintBoxEl.classList.toggle("hidden");
      sfx("pop");
    };
    resetBtn.onclick = () => {
      if (!confirm(t("daily.resetConfirm"))) return;
      codeEl.value = current.starter;
      saveDraft(new Date(), codeEl.value);
      setStatus("");
      sfx("click");
    };

    codeEl.addEventListener("input", () => saveDraft(new Date(), codeEl.value));
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
      if (current) renderTask();
      renderHero();
    });

    document.addEventListener("routechange", (e) => {
      if (e.detail !== "daily") stopCountdown();
    });

    render();
    console.info("[daily.js] ready, template of the day:", current && current.tplId);
  }

  global.Daily = {
    init, render, check,
    task: () => current,
    taskForDate,
    templates: () => TEMPLATES.length,
    streak: () => currentStreak(getState(), new Date()),
    stats: getState,
    POINTS
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})(window);
