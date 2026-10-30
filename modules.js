/* modules.js — каталог модулів Python: усі пакети Pyodide + розширення просто з PyPI.
   Реєстр Pyodide береться з pyodide-lock.json і кешується локально: app.modules.lock
   Решту чистих Python-пакетів ставимо через micropip (PythonPad.installPypi). */
(function (global) {
  const $ = (s) => document.querySelector(s);

  const LOCK_URL = "https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide-lock.json";
  const PYPI_URL = "https://pypi.org/pypi/";
  const CACHE_KEY = "app.modules.lock";
  const CACHE_TTL = 7 * 24 * 60 * 60 * 1000;
  const PAGE_SIZE = 36;

  /* Пакети, для яких є опис і готовий приклад коду */
  const FEATURED = {
    "numpy": {
      desc: {
        uk: "Числові масиви та швидкі обчислення: матриці, статистика, лінійна алгебра.",
        en: "Numeric arrays and fast computing: matrices, statistics, linear algebra.",
        tr: "Sayısal diziler ve hızlı hesaplar: matrisler, istatistik, doğrusal cebir."
      },
      example: "import numpy as np\na = np.array([[1, 2], [3, 4]])\nprint(a.sum(), a.mean())\nprint(np.linalg.det(a))\n"
    },
    "pandas": {
      desc: {
        uk: "Таблиці й дані: DataFrame, фільтри, групування, зведення.",
        en: "Tables and data: DataFrames, filters, grouping, summaries.",
        tr: "Tablolar ve veriler: DataFrame, filtreler, gruplama, özetler."
      },
      example: "import pandas as pd\ndf = pd.DataFrame({\"name\": [\"Ana\", \"Bo\", \"Cy\"], \"score\": [12, 9, 15]})\nprint(df.sort_values(\"score\", ascending=False).to_string(index=False))\n"
    },
    "matplotlib": {
      desc: {
        uk: "Графіки й діаграми, які малюються прямо на сторінці.",
        en: "Plots and charts drawn right on the page.",
        tr: "Doğrudan sayfada çizilen grafikler."
      },
      example: "import matplotlib.pyplot as plt\nx = [1, 2, 3, 4]\nplt.plot(x, [i * i for i in x])\nplt.title(\"y = x^2\")\nplt.show()\n"
    },
    "sympy": {
      desc: {
        uk: "Символьна математика: рівняння, похідні, інтеграли, спрощення.",
        en: "Symbolic math: equations, derivatives, integrals, simplification.",
        tr: "Sembolik matematik: denklemler, türevler, integraller, sadeleştirme."
      },
      example: "import sympy as sp\nx = sp.Symbol(\"x\")\nprint(sp.factor(x**2 - 5*x + 6))\nprint(sp.integrate(sp.sin(x), x))\n"
    },
    "scipy": {
      desc: {
        uk: "Наукові обчислення: статистика, оптимізація, інтегрування.",
        en: "Scientific computing: statistics, optimization, integration.",
        tr: "Bilimsel hesaplamalar: istatistik, optimizasyon, integrasyon."
      },
      example: "from scipy import stats\nres = stats.linregress([1, 2, 3, 4], [2, 4, 5, 4])\nprint(round(res.slope, 3), round(res.rvalue, 3))\n"
    },
    "scikit-learn": {
      desc: {
        uk: "Машинне навчання: регресія, класифікація, кластери.",
        en: "Machine learning: regression, classification, clustering.",
        tr: "Makine öğrenmesi: regresyon, sınıflandırma, kümeleme."
      },
      example: "from sklearn.linear_model import LinearRegression\nmodel = LinearRegression().fit([[1], [2], [3]], [2, 4, 6])\nprint(round(model.predict([[5]])[0], 3))\n"
    },
    "requests": {
      desc: {
        uk: "HTTP-запити до сайтів і API (потрібен інтернет і дозвіл CORS).",
        en: "HTTP requests to sites and APIs (needs internet and CORS permission).",
        tr: "Siteler ve API'ler için HTTP istekleri (internet ve CORS izni gerekir)."
      },
      example: "import requests\nr = requests.get(\"https://httpbin.org/get\", timeout=10)\nprint(r.status_code)\nprint(r.json()[\"url\"])\n"
    },
    "pillow": {
      desc: {
        uk: "Робота із зображеннями: створення, обрізання, фільтри, збереження.",
        en: "Working with images: creating, cropping, filters, saving.",
        tr: "Görsellerle çalışma: oluşturma, kırpma, filtreler, kaydetme."
      },
      example: "from PIL import Image\nimg = Image.new(\"RGB\", (64, 32), (30, 144, 255))\nprint(img.size, img.mode, img.getpixel((0, 0)))\n"
    },
    "networkx": {
      desc: {
        uk: "Графи та мережі: вершини, ребра, шляхи, зв'язність.",
        en: "Graphs and networks: nodes, edges, paths, connectivity.",
        tr: "Graflar ve ağlar: düğümler, kenarlar, yollar, bağlılık."
      },
      example: "import networkx as nx\ng = nx.cycle_graph(5)\nprint(g.number_of_nodes(), g.number_of_edges(), nx.is_connected(g))\n"
    },
    "opencv-python": {
      desc: {
        uk: "Комп'ютерний зір: імпорт як cv2, обробка зображень і відео.",
        en: "Computer vision: imported as cv2, image and video processing.",
        tr: "Bilgisayarla görme: cv2 olarak içe aktarılır, görsel ve video işleme."
      },
      example: "import cv2\nimport numpy as np\nimg = np.zeros((8, 8), dtype=np.uint8)\ncv2.rectangle(img, (1, 1), (6, 6), 255, -1)\nprint(cv2.countNonZero(img))\n"
    },
    "pygame-ce": {
      desc: {
        uk: "Ігровий рушій (імпортується як pygame): спрайти, події, таймери.",
        en: "Game engine (imported as pygame): sprites, events, timers.",
        tr: "Oyun motoru (pygame olarak içe aktarılır): sprite'lar, olaylar, zamanlayıcılar."
      },
      example: "import pygame\nprint(pygame.version.ver)\n"
    },
    "statsmodels": {
      desc: {
        uk: "Статистичні моделі: регресії, тести, оцінки параметрів.",
        en: "Statistical models: regressions, tests, parameter estimates.",
        tr: "İstatistiksel modeller: regresyonlar, testler, parametre tahminleri."
      },
      example: "import numpy as np\nimport statsmodels.api as sm\nprint(sm.add_constant(np.array([1.0, 2.0, 3.0])))\n"
    }
  };

  /* Пакети, яких немає у Pyodide, але які ставляться просто з PyPI (чистий Python).
      imp — що писати після import; deps — що тягне за собою; ex — перевірений приклад. */
  const EXT = {
    "art": {
      imp: "art",
      desc: {
        uk: "ASCII-арт із тексту: великі літери з символів.",
        en: "ASCII art from text: big letters built out of characters.",
        tr: "Metinden ASCII sanat: karakterlerden oluşan büyük harfler."
      },
      ex: "from art import text2art\nprint(text2art(\"Python\"))\n"
    },
    "pyfiglet": {
      imp: "pyfiglet",
      desc: {
        uk: "Банери з літер, складених із символів, і десятки шрифтів.",
        en: "Banners built from characters, with dozens of fonts.",
        tr: "Karakterlerden oluşan afişler ve onlarca yazı tipi."
      },
      ex: "import pyfiglet\nprint(pyfiglet.figlet_format(\"Python\", font=\"slant\"))\n"
    },
    "emoji": {
      imp: "emoji",
      desc: {
        uk: "Перетворює :слова: на справжні емодзі та навпаки.",
        en: "Turns :words: into real emoji and back.",
        tr: ":sözcükleri: gerçek emojilere ve tersine çevirir."
      },
      ex: "import emoji\nprint(emoji.emojize(\"Python :snake: :sparkles:\"))\nprint(emoji.emoji_count(\"🐍 \"))\n"
    },
    "tabulate": {
      imp: "tabulate",
      desc: {
        uk: "Гарні таблиці з рядками та рамкою просто в консолі.",
        en: "Neat tables with rows and borders right in the console.",
        tr: "Konsolda satırlı ve kenarlıklı düzenli tablolar."
      },
      ex: "from tabulate import tabulate\nrows = [[\"Ana\", 12], [\"Bo\", 9], [\"Cy\", 15]]\nprint(tabulate(rows, headers=[\"name\", \"score\"], tablefmt=\"grid\"))\n"
    },
    "prettytable": {
      imp: "prettytable",
      desc: {
        uk: "Таблиця, якій можна додавати рядки й стовпці по ходу програми.",
        en: "A table you can add rows and columns to as the program runs.",
        tr: "Program çalışırken satır ve sütun ekleyebileceğin bir tablo."
      },
      ex: "from prettytable import PrettyTable\nt = PrettyTable([\"city\", \"pop\"])\nt.add_row([\"Львів\", 700000])\nt.add_row([\"Київ\", 2900000])\nprint(t)\n"
    },
    "terminaltables": {
      imp: "terminaltables",
      desc: {
        uk: "Ще один оформлювач таблиць — з рамкою з крапок і рисок.",
        en: "Another table formatter — borders made of dots and dashes.",
        tr: "Başka bir tablo biçimlendirici — nokta ve çizgilerden kenarlık."
      },
      ex: "from terminaltables import AsciiTable\ndata = [[\"мова\", \"років\"], [\"Python\", 30], [\"C\", 50]]\nprint(AsciiTable(data).table)\n"
    },
    "humanize": {
      imp: "humanize",
      desc: {
        uk: "По-людськи: «2 дні тому», «3,5 МБ», «1-й» замість сухих чисел.",
        en: "Human-friendly output: \"2 days ago\", \"3.5 MB\", \"1st\" instead of raw numbers.",
        tr: "İnsanca çıktı: \"2 gün önce\", \"3,5 MB\", \"1.\"."
      },
      ex: "import humanize, datetime\nprint(humanize.naturalsize(3_500_000))\nprint(humanize.naturaltime(datetime.datetime(2026, 10, 1)))\nprint(humanize.ordinal(3))\n"
    },
    "Faker": {
      imp: "faker",
      deps: [],
      desc: {
        uk: "Генерує фальшиві, але правдоподібні дані: імена, адреси, телефони.",
        en: "Generator of believable fake data: names, addresses, phone numbers.",
        tr: "İnanılır sahte veriler üretir: isimler, adresler, telefonlar."
      },
      ex: "from faker import Faker\nfk = Faker(\"uk_UA\")\nfor _ in range(3):\n    print(fk.name(), \"|\", fk.city(), \"|\", fk.phone_number())\n"
    },
    "xmltodict": {
      imp: "xmltodict",
      desc: {
        uk: "XML і словник перетворюються однією функцією в обидва боки.",
        en: "XML and dicts convert to each other with a single function.",
        tr: "XML ve sözlükler tek fonksiyonla birbirine dönüşür."
      },
      ex: "import xmltodict\nxml = \"<shop><item price='7'>сир</item><item price='3'>хліб</item></shop>\"\nd = xmltodict.parse(xml)\nfor it in d[\"shop\"][\"item\"]:\n    print(it[\"@price\"], it[\"#text\"])\nprint(xmltodict.unparse(d, pretty=True)[:60])\n"
    },
    "toml": {
      imp: "toml",
      desc: {
        uk: "Формат TOML — конфіги, які люблять у сучасному Python.",
        en: "TOML format — the config files modern Python loves.",
        tr: "TOML biçimi — modern Python'ın sevdiği yapılandırma dosyaları."
      },
      ex: "import toml\ncfg = toml.loads('[server]\\nhost = \"localhost\"\\nport = 8080\\n')\nprint(cfg[\"server\"][\"port\"])\nprint(toml.dumps({\"a\": {\"b\": 1}}))\n"
    },
    "feedparser": {
      imp: "feedparser",
      desc: {
        uk: "Читає RSS і Atom: стрічки новин, подкасти, блоги.",
        en: "Reads RSS and Atom: news feeds, podcasts, blogs.",
        tr: "RSS ve Atom okur: haber akışları, podcast'ler, bloglar."
      },
      ex: "import feedparser\nxml = b\"<?xml version='1.0'?><rss><channel><item><title>Привіт</title></item></channel></rss>\"\nf = feedparser.parse(xml)\nprint(f.feed.get(\"title\"), len(f.entries), f.entries[0].title)\n"
    },
    "tinydb": {
      imp: "tinydb",
      desc: {
        uk: "Легка база даних, яка живе у простому JSON-файлі.",
        en: "A lightweight but handy database stored in a plain JSON file.",
        tr: "Düz bir JSON dosyasında tutulan hafif ama kullanışlı veritabanı."
      },
      ex: "from tinydb import TinyDB, Query\ndb = TinyDB(\"/tmp/grades.json\")\nStudent = Query()\ndb.insert({\"name\": \"Ana\", \"score\": 12})\ndb.insert({\"name\": \"Bo\", \"score\": 9})\nprint(db.search(Student.score > 10))\n"
    },
    "hashids": {
      imp: "hashids",
      desc: {
        uk: "Ховає номери за короткими незрозумілими кодами й розкодує їх назад.",
        en: "Hides numbers behind short opaque codes and decodes them back.",
        tr: "Numaraları kısa kodların ardına gizler ve geri çözer."
      },
      ex: "from hashids import Hashids\nh = Hashids(salt=\"taem-salt\", min_length=6)\ncode = h.encode(42)\nprint(code, h.decode(code))\n"
    },
    "shortuuid": {
      imp: "shortuuid",
      desc: {
        uk: "Короткі й надійні унікальні ідентифікатори замість довгих UUID.",
        en: "Short, safe unique IDs instead of long UUIDs.",
        tr: "Uzun UUID yerine kısa ve güvenli benzersiz kimlikler."
      },
      ex: "import shortuuid\nprint([shortuuid.uuid() for _ in range(3)])\n"
    },
    "nanoid": {
      imp: "nanoid",
      desc: {
        uk: "Надкороткі унікальні коди — як у посиланнях на файли.",
        en: "Very short unique codes — like in file share links.",
        tr: "Çok kısa benzersiz kodlar — dosya bağlantılarındaki gibi."
      },
      ex: "from nanoid import generate\nprint(generate(), generate(size=10))\n"
    },
    "uuid6": {
      imp: "uuid6",
      desc: {
        uk: "UUID, впорядковані за часом: нові коди завжди більші за старі.",
        en: "Time-ordered UUIDs: newer ones always sort after older.",
        tr: "Zamana göre sıralanan UUID'ler: yeniler hep eskilerin ardından gelir."
      },
      ex: "import uuid6\nprint(uuid6.uuid7())\n"
    },
    "Unidecode": {
      imp: "unidecode",
      deps: [],
      desc: {
        uk: "Перетворює будь-який текст на безпечну латинку: кирилиця й акценти стають звичайними літерами.",
        en: "Turns any text into safe ASCII: Cyrillic letters and accents become plain ones.",
        tr: "Her metni güvenli ASCII'ye çevirir: Kiril harfleri ve aksanlar düz harfe döner."
      },
      ex: "from unidecode import unidecode\nprint(unidecode(\"Приклад ґедзь 123\"))\n"
    },
    "qrcode": {
      imp: "qrcode",
      desc: {
        uk: "Генерує QR-коди з будь-якого тексту (потрібен Pillow).",
        en: "Generates QR codes from any text (needs Pillow).",
        tr: "Her metinden QR kod üretir (Pillow gerekir)."
      },
      ex: "import qrcode\nimg = qrcode.make(\"https://nothing12-glitch.github.io/python-copier/\")\nprint(type(img).__name__, img.size)\n"
    },
    "python-barcode": {
      imp: "barcode",
      deps: [],
      desc: {
        uk: "Штрих-коди EAN/Code128 у векторному SVG.",
        en: "EAN/Code128 barcodes as vector SVG.",
        tr: "EAN/Code128 barkodları vektörel SVG olarak."
      },
      ex: "from barcode import EAN13\nfrom barcode.writer import SVGWriter\nbc = EAN13(\"4820000000002\", writer=SVGWriter())\nprint(bc.get_fullcode(), len(bc.render()) > 0)\n"
    },
    "Markdown": {
      imp: "markdown",
      deps: [],
      desc: {
        uk: "Markdown → HTML: той самий синтаксис, що в README.",
        en: "Markdown → HTML: the same syntax as in a README.",
        tr: "Markdown → HTML: README'deki aynı söz dizimi."
      },
      ex: "import markdown\nsrc = \"# Привіт\\n\\nце **жирний** і `код`\\n\\n- пункт\\n- ще\"\nprint(markdown.markdown(src))\n"
    },
    "Jinja2": {
      imp: "jinja2",
      deps: [],
      desc: {
        uk: "Рушій шаблонів: підставляєш змінні в текст і отримуєш готову сторінку.",
        en: "Template engine: drop variables into text and get a page.",
        tr: "Şablon motoru: metne değişkenler koy ve sayfayı al."
      },
      ex: "from jinja2 import Template\nt = Template(\"Привіт, {{ name }}! Твій бал: {{ score }}/12\")\nprint(t.render(name=\"Ана\", score=11))\n"
    },
    "Pygments": {
      imp: "pygments",
      deps: [],
      desc: {
        uk: "Підсвічує синтаксис коду в HTML, ANSI та RTF.",
        en: "Syntax highlighting for code into HTML, ANSI and RTF.",
        tr: "Kod için HTML, ANSI ve RTF sözdizimi renklendirmesi."
      },
      ex: "from pygments import highlight\nfrom pygments.lexers import PythonLexer\nfrom pygments.formatters import HtmlFormatter\nprint(highlight(\"print('hi')\", PythonLexer(), HtmlFormatter())[:160])\n"
    },
    "httpx": {
      imp: "httpx",
      desc: {
        uk: "Сучасна HTTP-бібліотека: у браузері імпортується, але самі запити краще робити через requests.",
        en: "Modern HTTP library: it imports in the browser, but send the actual calls with requests.",
        tr: "Modern HTTP kütüphanesi: tarayıcıda içe aktarılır ama istekleri requests ile at."
      },
      ex: "import httpx\nprint(httpx.__version__)\nreq = httpx.Request(\"GET\", \"https://httpbin.org/json\")\nprint(req.method, req.url)\n"
    },
    "passlib": {
      imp: "passlib",
      desc: {
        uk: "Хешування паролів: збережений хеш ніколи не показує оригінал.",
        en: "Safe password hashing: the hash never reveals the original.",
        tr: "Güvenli parola karma: özet orijinali asla göstermez."
      },
      ex: "from passlib.hash import pbkdf2_sha256\nh = pbkdf2_sha256.hash(\"secret123\")\nprint(h[:40], \"...\")\nprint(pbkdf2_sha256.verify(\"secret123\", h), pbkdf2_sha256.verify(\"nope\", h))\n"
    },
    "python-dotenv": {
      imp: "dotenv",
      deps: [],
      desc: {
        uk: "Зберігає налаштування у файлі .env і читає їх звідти.",
        en: "Keeps settings in a .env file and reads them back.",
        tr: "Ayarları .env dosyasında tutar ve oradan okur."
      },
      ex: "import os\nfrom dotenv import dotenv_values, load_dotenv\nopen(\"/tmp/app.env\", \"w\").write(\"API_KEY=abc123\\nMODE=dev\\n\")\nprint(dotenv_values(\"/tmp/app.env\"))\nload_dotenv(\"/tmp/app.env\")\nprint(os.getenv(\"MODE\"))\n"
    },
    "Flask": {
      imp: "flask",
      deps: [],
      desc: {
        uk: "Міні-вебфреймворк: у браузері можна перевірити маршрути через test_client.",
        en: "Mini web framework: in the browser you can exercise routes via test_client.",
        tr: "Mini web çerçevesi: tarayıcıda rotaları test_client ile deneyebilirsin."
      },
      ex: "from flask import Flask\napp = Flask(__name__)\n\n@app.route(\"/hello/<name>\")\ndef hello(name):\n    return f\"Привіт, {name}!\"\n\nprint(app.test_client().get(\"/hello/Ana\").text)\n"
    },
    "seaborn": {
      imp: "seaborn",
      deps: [],
      desc: {
        uk: "Статистичні графіки поверх matplotlib — у кілька рядків.",
        en: "Statistical plots on top of matplotlib — in a few lines.",
        tr: "matplotlib üstüne istatistiksel grafikler — birkaç satırda."
      },
      ex: "import seaborn as sns\nimport matplotlib.pyplot as plt\nx = [1, 2, 3, 4, 5]\nsns.scatterplot(x=x, y=[i * 2 for i in x])\nplt.title(\"seaborn works\")\nplt.show()\n"
    },
    "pysnooper": {
      imp: "pysnooper",
      desc: {
        uk: "Декоратор @snoop: сам показує, що відбувається всередині функції.",
        en: "The @snoop decorator: shows by itself what happens inside a function.",
        tr: "@snoop dekoratörü: fonksiyonun içinde ne olduğunu kendisi gösterir."
      },
      ex: "import pysnooper\n\n@pysnooper.snoop(output=\"<stdout>\")\ndef total(nums):\n    s = 0\n    for n in nums:\n        s += n\n    return s\n\nprint(total([1, 2, 3]))\n"
    },
    "black": {
      imp: "black",
      deps: [],
      desc: {
        uk: "Автоформаттер коду: приводить стиль до єдиного вигляду.",
        en: "Code autoformatter: brings the style to one consistent look.",
        tr: "Kod otomatik biçimlendirici: stili tek görünüme getirir."
      },
      ex: "import black\nmessy = \"def f( a,b ):\\n    return a*b\\n\"\nout = black.format_str(messy, mode=black.Mode())\nprint(out)\n"
    },
    "schedule": {
      imp: "schedule",
      desc: {
        uk: "Зручний розклад задач: «кожні 5 секунд — свою функцію», без cron.",
        en: "Comfortable task scheduling: every 5 seconds, run this function — no cron.",
        tr: "Kolay görev zamanlama: her 5 saniyede bir fonksiyon — cron yok."
      },
      ex: "import schedule\ndef greet():\n    print(\"hello\")\nschedule.every(5).seconds.do(greet)\nprint(schedule.jobs[0].next_run)\n"
    },
    "tenacity": {
      imp: "tenacity",
      desc: {
        uk: "Повтори запит, якщо він упав, з розумною паузою.",
        en: "Retry a call that failed, with a sensible backoff.",
        tr: "Düşen çağrıyı akıllı beklemeyle yeniden dene."
      },
      ex: "from tenacity import retry, stop_after_attempt, wait_fixed\ntries = {\"n\": 0}\n\n@retry(stop=stop_after_attempt(3), wait=wait_fixed(0.01))\ndef flaky():\n    tries[\"n\"] += 1\n    if tries[\"n\"] < 3:\n        raise ValueError(\"ще не вдалось\")\n    return \"ок\"\n\nprint(flaky(), tries[\"n\"])\n"
    },
    "funcy": {
      imp: "funcy",
      desc: {
        uk: "Функціональний набір: compose, memoize, curry без класів.",
        en: "Functional toolkit: compose, memoize, curry without classes.",
        tr: "Fonksiyonel takım: compose, memoize, curry — sınıf yok."
      },
      ex: "from funcy import compose, memoize, count, take\nfib = memoize(lambda n: n if n < 2 else fib(n - 1) + fib(n - 2))\nprint(list(take(10, map(fib, count()))))\n"
    },
    "boltons": {
      imp: "boltons",
      desc: {
        uk: "30 корисних дрібниць: поділ на блоки, ковзне вікно, статистика.",
        en: "30 handy extras: chunking, sliding windows, statistics.",
        tr: "30 kullanışlı eklenti: bloklara ayırma, kayan pencere, istatistik."
      },
      ex: "from boltons.iterutils import chunked, windowed\nfrom boltons.statsutils import mean, median\nnums = list(range(1, 10))\nprint(list(chunked(nums, 3)))\nprint(list(windowed(nums, 2)))\nprint(mean(nums), median(nums))\n"
    }
  };

  /* Готові набори пакетів */
  const PRESETS = {
    analytics: ["numpy", "pandas", "matplotlib"],
    science: ["scipy", "sympy"],
    images: ["pillow", "opencv-python"],
    ml: ["scikit-learn", "numpy", "scipy"],
    text: ["art", "emoji", "tabulate", "Markdown"],
    data: ["xmltodict", "toml", "tinydb", "humanize"],
    ids: ["shortuuid", "nanoid", "hashids", "uuid6"],
    marks: ["qrcode", "python-barcode", "Pygments"]
  };

  let searchEl, chipsEl, countEl, gridEl, presetsEl, infoEl, errorEl, moreBtn, pypiEl;
  let packages = [];
  let byImport = {};
  let loadedNames = [];
  let installedNow = [];
  let filter = "all";
  let query = "";
  let shown = PAGE_SIZE;
  let lockInfo = null;
  let busy = false;
  let pypiBusy = false;
  let pypiLast = null;

  function t(k, v) { return global.I18n ? global.I18n.t(k, v) : k; }

  function toast(msg) { if (global.App && global.App.toast) global.App.toast(msg); }

  function sfx(name) { global.Audio2 && global.Audio2.SFX && global.Audio2.SFX[name] && global.Audio2.SFX[name](); }

  function el(tag, cls, text) {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text != null) node.textContent = text;
    return node;
  }

  function pick(obj) {
    if (!obj) return "";
    const l = global.I18n ? global.I18n.lang : "uk";
    return obj[l] || obj.uk || "";
  }

  function isLoaded(name) {
    if (loadedNames.indexOf(name) >= 0) return true;
    return installedNow.indexOf(name) >= 0;
  }

  /* ---------- Реєстр пакетів ---------- */
  function readCache() {
    try {
      const raw = JSON.parse(localStorage.getItem(CACHE_KEY));
      if (raw && raw.data && Date.now() - (raw.fetchedAt || 0) < CACHE_TTL) return raw;
    } catch { /* кеш пошкоджений — просто перечитаємо */ }
    return null;
  }

  function writeCache(data) {
    try { localStorage.setItem(CACHE_KEY, JSON.stringify({ fetchedAt: Date.now(), data: data })); }
    catch (e) { /* реєстр великий, якщо сховище переповнене — працюємо без кешу */ }
  }

  async function fetchLock(force) {
    if (!force) {
      const cached = readCache();
      if (cached) { applyLock(cached.data); return true; }
    }
    const res = await fetch(LOCK_URL, { cache: "no-store" });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    if (!data || !data.packages) throw new Error("bad lock file");
    writeCache(data);
    applyLock(data);
    return true;
  }

  // Реєстр тягнуть лише коли користувач відкриває «Модулі», а авто-довантаження
  // з коду може статися раніше — тож за потреби підганяємо його самі.
  let lockPromise = null;
  function ensureCatalog() {
    if (packages.length) return Promise.resolve(true);
    if (!lockPromise) {
      lockPromise = fetchLock(false)
        .catch(() => false)
        .then((ok) => { lockPromise = null; return ok; });
    }
    return lockPromise;
  }

  /* Власні модулі сайту: їх робить pygui.js, тож встановлення не потрібне */
  const OWN = {
    "turtle": {
      imports: ["turtle"],
      desc: {
        uk: "Черепашка, що малює прямо на сторінці: лінії, кола, зірки та візерунки. Це власний рушій сайту — ставити нічого не треба.",
        en: "A turtle that draws right on the page: lines, circles, stars and patterns. Built into the site — no install needed.",
        tr: "Sayfada doğrudan çizilen kaplumbağa: çizgiler, daireler, yıldızlar ve desenler. Siteye gömülü — kurulum gerekmez."
      },
      example: "import turtle as t\n\nt.speed(6)\nt.pencolor(\"darkorange\")\nfor i in range(36):\n    t.forward(120)\n    t.left(170)\n\nt.pencolor(\"steelblue\")\nt.circle(60)\nt.hideturtle()\n"
    },
    "tkinter": {
      imports: ["tkinter", "messagebox"],
      desc: {
        uk: "Вікна з кнопками, полями вводу та повзунками — справжній інтерфейс прямо у браузері. Теж власний рушій, без встановлення.",
        en: "Windows with buttons, entry fields and sliders — a real GUI right in the browser. Also our own engine, no install.",
        tr: "Düğmeler, giriş alanları ve kaydırıcılarla pencereler — tarayıcıda gerçek arayüz. Bizim motor — kurulum gerekmez."
      },
      example: "import tkinter as tk\nfrom tkinter.messagebox import showinfo\n\nroot = tk.Tk()\nroot.title(\"Привіт\")\nroot.geometry(\"320x200\")\n\nname = tk.Entry(root, width=24)\nname.pack(pady=12)\n\ndef greet():\n    showinfo(\"Вітаю\", \"Привіт, \" + name.get() + \"!\")\n\ntk.Button(root, text=\"Натисни\", command=greet).pack(pady=6)\ntk.mainloop()\n"
    }
  };

  function seedOwn() {
    Object.keys(OWN).forEach((name) => {
      if (packages.some((p) => p.name === name)) return;
      const o = OWN[name];
      packages.push({ name: name, version: "", src: "own", imports: o.imports.slice(), depends: [] });
      o.imports.forEach((imp) => { if (!byImport[imp]) byImport[imp] = name; });
    });
  }

  function applyLock(data) {
    lockInfo = data.info || {};
    packages = [];
    byImport = {};
    const known = {};
    Object.keys(data.packages || {}).forEach((key) => {
      const pkg = data.packages[key];
      if (!pkg || pkg.package_type !== "package") return;
      if (/-tests$/.test(pkg.name)) return;
      known[pkg.name.toLowerCase()] = true;
      packages.push({
        name: pkg.name, version: pkg.version || "", src: "pyodide",
        imports: pkg.imports || [], depends: pkg.depends || []
      });
      (pkg.imports || []).forEach((imp) => {
        if (!byImport[imp]) byImport[imp] = pkg.name;
      });
    });
    // Пакети PyPI, яких у Pyodide немає: ставимо їх через micropip
    Object.keys(EXT).forEach((name) => {
      if (known[name.toLowerCase()]) return;
      const e = EXT[name];
      packages.push({ name: name, version: e.v || "", src: "pypi", imports: [e.imp], depends: e.deps || [] });
      if (!byImport[e.imp]) byImport[e.imp] = name;
    });
    seedOwn();
    packages.sort((a, b) => a.name.localeCompare(b.name));
  }

  function syncLoaded() {
    if (global.PythonPad && typeof global.PythonPad.loadedPackages === "function") {
      try { loadedNames = global.PythonPad.loadedPackages() || []; } catch (e) { loadedNames = []; }
    }
    // Те, що поставило вікно встановлення (і рекомендовані модулі, і магазинчик), теж «встановлено»
    if (global.Installer && typeof global.Installer.history === "function") {
      (global.Installer.history() || []).forEach((name) => {
        if (installedNow.indexOf(name) < 0) installedNow.push(name);
      });
    }
  }

  /* ---------- Фільтрація ---------- */
  function visible() {
    const q = query.trim().toLowerCase();
    return packages.filter((pkg) => {
      if (q && pkg.name.toLowerCase().indexOf(q) < 0 &&
          !pkg.imports.some((i) => i.toLowerCase().indexOf(q) >= 0)) return false;
      if (filter === "featured") return !!(FEATURED[pkg.name] || EXT[pkg.name] || OWN[pkg.name]);
      if (filter === "pypi") return pkg.src === "pypi";
      if (filter === "installed") return isLoaded(pkg.name);
      if (filter === "missing") return !isLoaded(pkg.name);
      return true;
    });
  }

  // Чи є в каталозі пакет із точно тако ж назвою — якщо ні, пропонуємо PyPI
  function exactHit(name) {
    const n = name.trim().toLowerCase();
    if (!n) return false;
    return packages.some((p) => p.name.toLowerCase() === n || p.imports.indexOf(n) >= 0);
  }

  /* ---------- Рендер ---------- */
  function loadedCount() {
    const set = {};
    loadedNames.forEach((n) => { set[n] = true; });
    installedNow.forEach((n) => { set[n] = true; });
    return Object.keys(set).length;
  }

  function renderInfo() {
    if (!infoEl) return;
    infoEl.innerHTML = "";
    const items = [
      { value: String(packages.length), label: t("modules.statPackages") },
      { value: String(Object.keys(byImport).length), label: t("modules.statImports") },
      { value: String(loadedCount()), label: t("modules.statLoaded") },
      { value: (lockInfo && lockInfo.python) || "3.12", label: t("modules.statPython") }
    ];
    items.forEach((item) => {
      const box = el("div", "mod-stat");
      box.appendChild(el("div", "mod-stat-value", item.value));
      box.appendChild(el("div", "mod-stat-label", item.label));
      infoEl.appendChild(box);
    });
  }

  function renderChips() {
    if (!chipsEl) return;
    chipsEl.innerHTML = "";
    [["all", "modules.filterAll"], ["featured", "modules.filterFeatured"],
     ["pypi", "modules.filterPypi"], ["installed", "modules.filterInstalled"],
     ["missing", "modules.filterMissing"]].forEach(([id, key]) => {
      const chip = el("button", "contest-chip" + (filter === id ? " active" : ""), t(key));
      chip.type = "button";
      chip.onclick = () => { filter = id; shown = PAGE_SIZE; renderChips(); renderGrid(); sfx("pop"); };
      chipsEl.appendChild(chip);
    });
  }

  function renderPresets() {
    if (!presetsEl) return;
    presetsEl.innerHTML = "";
    presetsEl.appendChild(el("span", "contest-field-label", t("modules.presets")));
    const row = el("div", "contest-chips");
    Object.keys(PRESETS).forEach((id) => {
      const chip = el("button", "contest-chip mod-preset", t("modules.preset." + id));
      chip.type = "button";
      chip.title = PRESETS[id].join(" · ");
      chip.onclick = () => installMany(PRESETS[id], chip);
      row.appendChild(chip);
    });
    presetsEl.appendChild(row);
  }

  function renderCount(list) {
    if (countEl) countEl.textContent = t("modules.shown", { n: Math.min(shown, list.length), total: list.length });
  }

  function renderGrid() {
    if (!gridEl) return;
    syncLoaded();
    const list = visible();
    renderCount(list);
    renderInfo();
    renderPypi();
    gridEl.innerHTML = "";
    if (!packages.length) {
      gridEl.appendChild(el("p", "muted", t("modules.loading")));
      return;
    }
    if (!list.length) {
      gridEl.appendChild(el("p", "muted", t("modules.empty")));
      if (moreBtn) moreBtn.classList.add("hidden");
      return;
    }
    list.slice(0, shown).forEach((pkg) => gridEl.appendChild(card(pkg)));
    if (moreBtn) moreBtn.classList.toggle("hidden", shown >= list.length);
  }

  function card(pkg) {
    const done = isLoaded(pkg.name);
    const own = pkg.src === "own";
    const box = el("div", "mod-card" + (done ? " installed" : "") + (pkg.src === "pypi" ? " ext" : "") + (own ? " own" : ""));
    box.dataset.name = pkg.name;

    const head = el("div", "mod-card-head");
    head.appendChild(el("span", "mod-name", pkg.name));
    if (pkg.src === "pypi") head.appendChild(el("span", "mod-src", t("modules.srcPypi")));
    if (own) head.appendChild(el("span", "mod-src mod-src-own", t("modules.srcOwn")));
    if (pkg.version) head.appendChild(el("span", "mod-version", pkg.version));
    // для вбудованих чіп «Вбудовано» уже все сказав — стан не дублюємо
    if (!own) {
      head.appendChild(el("span", "mod-state" + (done ? " done" : ""), done ? t("modules.stateLoaded") : t("modules.stateIdle")));
    }
    box.appendChild(head);

    const info = FEATURED[pkg.name] || EXT[pkg.name] || OWN[pkg.name];
    if (info) box.appendChild(el("p", "mod-desc", pick(info.desc)));

    if (pkg.imports.length) {
      const imports = el("div", "mod-imports");
      pkg.imports.slice(0, 6).forEach((imp) => imports.appendChild(el("code", "mod-import", imp)));
      box.appendChild(imports);
    }
    if (pkg.depends.length) {
      box.appendChild(el("div", "mod-deps", t("modules.depends", { list: pkg.depends.slice(0, 5).join(", ") })));
    }

    const actions = el("div", "mod-actions");
    const install = el("button", "btn contained mod-install");
    install.type = "button";
    install.appendChild(el("span", "material-icons", own ? "bolt" : (pkg.src === "pypi" ? "cloud_download" : "download")));
    install.appendChild(el("span", null, own ? t("modules.noInstall")
      : (done ? t("modules.reinstall") : t(pkg.src === "pypi" ? "modules.installPypi" : "modules.install"))));
    install.disabled = done || own;
    install.onclick = () => installOne(pkg);
    actions.appendChild(install);

    if (info && (info.example || info.ex)) {
      const ex = el("button", "btn text mod-example");
      ex.type = "button";
      ex.appendChild(el("span", "material-icons", "science"));
      ex.appendChild(el("span", null, t("modules.example")));
      ex.onclick = () => useExample(pkg.name);
      actions.appendChild(ex);
    }

    const imp = el("button", "btn text mod-copy");
    imp.type = "button";
    imp.appendChild(el("span", "material-icons", "content_copy"));
    imp.appendChild(el("span", null, t("modules.copyImport")));
    imp.onclick = () => copyImport(pkg);
    actions.appendChild(imp);

    box.appendChild(actions);

    // Клік по картці — вікно з вагою, описом і датою оновлення
    box.classList.add("mod-infoable");
    box.tabIndex = 0;
    box.setAttribute("role", "button");
    box.setAttribute("aria-label", t("installer.info") + ": " + pkg.name);
    box.onclick = (ev) => { if (ev.target.closest("button")) return; details(pkg); };
    box.onkeydown = (ev) => {
      if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); details(pkg); }
    };
    return box;
  }

  /* ---------- Дії ---------- */
  // Встановлення іде через спільне вікно з прогрес-баром (installer.js)
  async function installOne(pkg) {
    const name = pkg.name || pkg;
    if (pkg && pkg.src === "own") { toast(t("modules.noInstall")); return; }
    if (busy) { toast(t("modules.busy")); return; }
    if (!global.Installer || !global.PythonPad) {
      toast(t("modules.unavailable"));
      sfx("error");
      return;
    }
    busy = true;
    sfx("click");
    const res = await global.Installer.install([name], {
      title: t("installer.title.one", { name: name })
    });
    busy = false;
    if (!res || res.skipped) return;
    if (res.ok && res.ok.indexOf(name) >= 0) {
      if (installedNow.indexOf(name) < 0) installedNow.push(name);
      syncLoaded();
      toast("📦 " + t(pkg.src === "pypi" ? "modules.installedPypiToast" : "modules.installedToast", { name: name }));
      sfx("success");
      document.dispatchEvent(new CustomEvent("packageinstalled", {
        detail: { name: name, imports: (packages.find((p) => p.name === name) || {}).imports || [], count: installedNow.length }
      }));
    } else {
      toast(t("modules.installFailed", { name: name }));
      sfx("error");
    }
    renderGrid();
  }

  function shortErr(e) {
    const msg = (e && e.message ? String(e.message) : String(e)).split("\n").filter(Boolean).pop() || "";
    return msg.slice(0, 160);
  }

  // Набір ставиться через те саме вікно з прогресом, що й одиночний пакет
  async function installMany(names, chip) {
    if (busy) { toast(t("modules.busy")); return; }
    if (!global.Installer || !global.PythonPad) { toast(t("modules.unavailable")); return; }
    busy = true;
    const res = await global.Installer.install(names, {
      title: t("installer.title.set", { name: chip.textContent.trim() })
    });
    busy = false;
    if (!res || res.skipped) return;
    const ok = (res.ok || []).length;
    (res.ok || []).forEach((name) => { if (installedNow.indexOf(name) < 0) installedNow.push(name); });
    syncLoaded();
    renderGrid();
    toast("📦 " + t("modules.presetDone", { ok: ok, total: names.length }));
    sfx(ok === names.length ? "success" : "error");
  }

  function useExample(name) {
    const info = FEATURED[name] || EXT[name] || OWN[name];
    const code = info && (info.example || info.ex);
    if (!code) return;
    const editor = $("#code");
    if (editor) {
      editor.value = code;
      editor.dispatchEvent(new Event("input", { bubbles: true }));
    }
    if (global.App && global.App.route) global.App.route("python");
    else location.hash = "#python";
    toast(t("modules.exampleToast", { name: name }));
    sfx("pop");
  }

  function copyImport(pkg) {
    const name = pkg.imports[0] || pkg.name.replace(/-/g, "_");
    const text = "import " + name + "\n";
    const done = () => { toast(t("modules.copied", { name: name })); sfx("pop"); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(done);
    } else {
      const ta = document.createElement("textarea");
      ta.value = text; document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); } catch (e) {}
      document.body.removeChild(ta);
      done();
    }
  }

  /* ---------- Вікно деталей модуля ---------- */
  const META_KEY = "app.pypiMeta.v1";
  const META_TTL = 24 * 60 * 60 * 1000;

  function readMeta() {
    try {
      const raw = JSON.parse(localStorage.getItem(META_KEY));
      if (raw && Date.now() - (raw.at || 0) < META_TTL) return raw.data || {};
    } catch (e) { /* пошкоджений кеш — перечитаємо з PyPI */ }
    return {};
  }

  function writeMeta(obj) {
    try { localStorage.setItem(META_KEY, JSON.stringify({ at: Date.now(), data: obj })); }
    catch (e) { /* сховище повне — просто не кешуємо */ }
  }

  // Дані релізу з PyPI: вага, дата, короткий опис. Кеш на добу.
  async function pypiMeta(name, version) {
    const all = readMeta();
    const key = String(name).toLowerCase() + "@" + (version || "");
    if (all[key]) return all[key];
    const tries = version
      ? [PYPI_URL + encodeURIComponent(name) + "/" + encodeURIComponent(version) + "/json",
         PYPI_URL + encodeURIComponent(name) + "/json"]
      : [PYPI_URL + encodeURIComponent(name) + "/json"];
    for (const url of tries) {
      try {
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) continue;
        const data = await res.json();
        const files = data.urls || [];
        const whl = files.find((f) => /\.whl$/i.test(f.filename)) || files[0] || {};
        const meta = {
          size: whl.size || 0,
          updated: whl.upload_time || "",
          summary: (data.info && data.info.summary) || "",
          version: (data.info && data.info.version) || ""
        };
        if (meta.size || meta.updated) { all[key] = meta; writeMeta(all); }
        return meta;
      } catch (e) { /* пробуємо наступну адресу */ }
    }
    return null;
  }

  // Справжня вага: для Pyodide — колеса з усіма залежностями, для PyPI — сума релізів
  async function weightOf(pkg) {
    if (!global.Installer) return null;
    if (pkg.src === "pypi") {
      const seen = {};
      let sum = 0;
      const stack = [pkg].concat((pkg.depends || []).map((d) => ({ name: d, src: "pypi" })));
      while (stack.length) {
        const cur = stack.pop();
        const key = String(cur.name).toLowerCase();
        if (seen[key]) continue;
        seen[key] = true;
        const meta = await pypiMeta(cur.name, cur.version);
        if (meta && meta.size) sum += meta.size;
        const dep = EXT[cur.name];
        if (dep && dep.deps) dep.deps.forEach((d) => { if (!seen[d]) stack.push({ name: d, src: "pypi" }); });
      }
      return sum || null;
    }
    const wheels = await global.Installer.resolveWheelNames([pkg.name]);
    let sum = 0;
    for (const w of wheels) {
      const size = await global.Installer.wheelSize(global.Installer.PY_BASE + w.file);
      if (size) sum += size;
    }
    return sum || null;
  }

  function fmtDate(iso) {
    if (!iso) return "";
    const d = new Date(/Z|[+-]\d\d:\d\d$/.test(iso) ? iso : iso + "Z");
    if (isNaN(d.getTime())) return "";
    const loc = global.I18n && global.I18n.lang === "tr" ? "tr-TR"
      : global.I18n && global.I18n.lang === "en" ? "en-GB" : "uk-UA";
    return d.toLocaleDateString(loc, { day: "2-digit", month: "long", year: "numeric" });
  }

  function mdRow(label) {
    const row = el("div", "md-row");
    row.appendChild(el("span", "md-label", label));
    const value = el("span", "md-value", "—");
    row.appendChild(value);
    return { row: row, value: value };
  }

  function closeDetails() {
    const bd = document.getElementById("modDetails");
    if (!bd) return;
    if (bd._onKey) document.removeEventListener("keydown", bd._onKey, true);
    bd.classList.add("wn-out");
    setTimeout(() => { if (bd.parentNode) bd.remove(); }, 180);
  }

  function details(pkg) {
    closeDetails();
    const done = isLoaded(pkg.name);
    const own = pkg.src === "own";
    const info = FEATURED[pkg.name] || EXT[pkg.name] || OWN[pkg.name];
    const bd = el("div", "wn-backdrop md-backdrop");
    bd.id = "modDetails";
    const card = el("div", "wn-card md-card");
    card.setAttribute("role", "dialog");
    card.setAttribute("aria-modal", "true");
    card.setAttribute("aria-label", pkg.name);

    const head = el("div", "wn-head");
    const emoji = el("div", "wn-emoji");
    emoji.setAttribute("aria-hidden", "true");
    emoji.textContent = "📦";
    const headText = el("div", "wn-headtext");
    headText.appendChild(el("h3", "wn-title", pkg.name));
    const sub = el("p", "wn-sub", (pkg.version ? "v" + pkg.version + " · " : "") +
      t(pkg.src === "pypi" ? "modules.srcPypi" : pkg.src === "own" ? "modules.srcOwn" : "modules.srcPyodide"));
    headText.appendChild(sub);
    head.append(emoji, headText);
    if (!own) head.appendChild(el("span", "wn-chip", done ? t("modules.stateLoaded") : t("modules.stateIdle")));

    const panel = el("div", "wn-panel md-panel");
    const weight = mdRow(t("installer.weight"));
    const updated = mdRow(t("installer.updated"));
    panel.appendChild(weight.row);
    panel.appendChild(updated.row);

    const desc = info ? pick(info.desc) : "";
    if (desc) panel.appendChild(el("p", "md-desc", desc));

    const imports = pkg.imports && pkg.imports.length ? pkg.imports : [];
    if (imports.length) {
      const box = el("div", "md-imports");
      box.appendChild(el("div", "md-sub", t("installer.imports")));
      const row = el("div", "mod-imports");
      imports.forEach((imp) => row.appendChild(el("code", "mod-import", "import " + imp)));
      box.appendChild(row);
      panel.appendChild(box);
    }
    if (pkg.depends && pkg.depends.length) {
      panel.appendChild(el("div", "md-sub", t("installer.deps") + ": " + pkg.depends.join(", ")));
    }

    const actions = el("div", "wn-actions md-actions");
    const close = el("button", "btn text");
    close.type = "button";
    close.appendChild(el("span", "material-icons", "close"));
    close.appendChild(el("span", null, t("installer.close")));
    close.onclick = closeDetails;

    const install = el("button", "btn contained wn-ok");
    install.type = "button";
    install.appendChild(el("span", "material-icons", own ? "bolt" : (pkg.src === "pypi" ? "cloud_download" : "download")));
    install.appendChild(el("span", null, own ? t("modules.noInstall")
      : (done ? t("modules.reinstall") : t(pkg.src === "pypi" ? "modules.installPypi" : "modules.install"))));
    install.disabled = own;
    install.onclick = () => { closeDetails(); installOne(pkg); };
    actions.append(close, install);

    card.append(head, panel, actions);
    bd.appendChild(card);
    document.body.appendChild(bd);
    sfx("pop");

    // Це вікно — на відміну від вікна встановлення — можна закрити кліком по тлу чи Escape
    bd.onclick = (ev) => { if (ev.target === bd) closeDetails(); };
    bd._onKey = (ev) => { if (ev.key === "Escape") closeDetails(); };
    document.addEventListener("keydown", bd._onKey, true);

    // Вагу й дату рахуємо окремо: вікно з'являється миттєво, цифри дописуються, коли прийдуть
    if (own) {
      weight.value.textContent = t("modules.noInstall");
      updated.value.textContent = "pygui.js";
    } else {
      weight.value.textContent = t("installer.sizeLoading");
      weightOf(pkg).then((size) => {
        weight.value.textContent = size ? global.Installer.bytes(size) : t("installer.updatedUnknown");
      }).catch(() => { weight.value.textContent = "—"; });
      updated.value.textContent = t("installer.checking");
      pypiMeta(pkg.name, pkg.version).then((meta) => {
        const date = meta && fmtDate(meta.updated);
        updated.value.textContent = date || t("installer.updatedUnknown");
        if (meta && meta.summary && !desc) {
          const p = el("p", "md-desc", meta.summary);
          panel.insertBefore(p, actions);
        }
      }).catch(() => { updated.value.textContent = "—"; });
    }
  }

  function showError(msg) {
    if (!errorEl) return;
    errorEl.innerHTML = "";
    errorEl.classList.remove("hidden");
    const line = el("div", "mod-error");
    line.appendChild(el("span", "material-icons", "wifi_off"));
    line.appendChild(el("span", null, msg));
    const retry = el("button", "btn outlined", t("modules.retry"));
    retry.type = "button";
    retry.onclick = load;
    errorEl.appendChild(line);
    errorEl.appendChild(retry);
  }

  /* ---------- Живий пошук на PyPI: будь-який пакет поза каталогом ---------- */
  // Чистий Python-wheel можна поставити в браузер; колесо під конкретну
  // платформу (C/Rust) або sdist із збіркою — ні, і це чесно кажемо вголос.
  function pypiVerdict(files) {
    if (files.some((f) => /-py2\.py3-none-any\.whl$|-py3-none-any\.whl$/.test(f))) return "pure";
    if (files.some((f) => f.endsWith(".whl"))) return "native";
    return "sdist";
  }

  function pypiPromptRow(q) {
    const row = el("div", "mod-pypi-prompt");
    row.appendChild(el("span", "material-icons", "cloud_download"));
    row.appendChild(el("span", "mod-pypi-text", t("modules.pypiPrompt", { name: q })));
    const b = el("button", "btn outlined mod-pypi-find");
    b.type = "button";
    b.appendChild(el("span", "material-icons", "search"));
    b.appendChild(el("span", null, t("modules.pypiFind", { name: q })));
    b.onclick = () => lookupPypi(q);
    row.appendChild(b);
    return row;
  }

  function pypiCard(info) {
    const box = el("div", "mod-card mod-pypi-card ext");
    const head = el("div", "mod-card-head");
    head.appendChild(el("span", "mod-name", info.name));
    head.appendChild(el("span", "mod-src", t("modules.srcPypi")));
    if (info.version) head.appendChild(el("span", "mod-version", info.version));
    const state = el("span", "mod-state", t("modules.stateIdle"));
    head.appendChild(state);
    box.appendChild(head);

    if (info.missing) {
      box.appendChild(el("p", "mod-desc", t("modules.pypiMissing", { name: info.name })));
      return box;
    }
    if (info.error) {
      box.appendChild(el("p", "mod-desc", t("modules.pypiError", { msg: info.error })));
      const retry = el("button", "btn text");
      retry.type = "button";
      retry.appendChild(el("span", "material-icons", "refresh"));
      retry.appendChild(el("span", null, t("modules.retry")));
      retry.onclick = () => lookupPypi(info.name);
      box.appendChild(retry);
      return box;
    }

    if (info.summary) box.appendChild(el("p", "mod-desc", info.summary));
    if (info.imports && info.imports.length) {
      const imports = el("div", "mod-imports");
      imports.appendChild(el("code", "mod-import", "import " + info.imports[0]));
      box.appendChild(imports);
    }
    if (info.requires && info.requires.length) {
      box.appendChild(el("div", "mod-deps", t("modules.depends", { list: info.requires.join(", ") })));
    }

    const note = el("div", "mod-pypi-note " + (info.verdict === "pure" ? "ok" : "warn"));
    note.appendChild(el("span", "material-icons", info.verdict === "pure" ? "check_circle" : "error"));
    note.appendChild(el("span", null, t("modules.pypi." + info.verdict)));
    box.appendChild(note);

    const actions = el("div", "mod-actions");
    const install = el("button", "btn contained mod-install");
    install.type = "button";
    install.appendChild(el("span", "material-icons", "cloud_download"));
    install.appendChild(el("span", null, t("modules.installPypi")));
    install.disabled = info.verdict !== "pure" || isLoaded(info.name);
    install.onclick = () => installOne({ name: info.name, src: "pypi" });
    actions.appendChild(install);
    box.appendChild(actions);
    return box;
  }

  function renderPypi() {
    if (!pypiEl) return;
    pypiEl.innerHTML = "";
    const q = query.trim();
    if (pypiLast && pypiLast.name.toLowerCase() === q.toLowerCase()) {
      pypiEl.appendChild(pypiCard(pypiLast));
      pypiEl.classList.remove("hidden");
      return;
    }
    if (!q || exactHit(q)) { pypiEl.classList.add("hidden"); return; }
    pypiEl.appendChild(pypiPromptRow(q));
    pypiEl.classList.remove("hidden");
  }

  async function lookupPypi(name) {
    if (pypiBusy) return;
    pypiBusy = true;
    pypiLast = null;
    if (pypiEl) {
      pypiEl.innerHTML = "";
      pypiEl.appendChild(el("p", "muted", t("modules.pypiLooking", { name: name })));
      pypiEl.classList.remove("hidden");
    }
    sfx("click");
    try {
      const res = await fetch(PYPI_URL + encodeURIComponent(name) + "/json", { cache: "no-store" });
      if (res.status === 404) {
        pypiLast = { name: name, missing: true };
      } else {
        if (!res.ok) throw new Error("HTTP " + res.status);
        const j = await res.json();
        const info = j.info || {};
        const v = info.version || "";
        const files = ((j.releases || {})[v] || []).map((f) => f.filename);
        pypiLast = {
          name: info.name || name, version: v,
          summary: String(info.summary || "").slice(0, 220),
          verdict: pypiVerdict(files),
          imports: [(info.name || name).replace(/-/g, "_").toLowerCase()],
          requires: (info.requires_dist || [])
            .map((s) => String(s).split(/[\s;<>=!~\[(,]/)[0]).filter(Boolean).slice(0, 6)
        };
      }
      sfx("pop");
    } catch (e) {
      pypiLast = { name: name, error: shortErr(e) };
      sfx("error");
    }
    pypiBusy = false;
    renderPypi();
  }

  async function load() {
    if (!gridEl) return;
    if (packages.length) { renderGrid(); return; }
    errorEl && errorEl.classList.add("hidden");
    gridEl.innerHTML = "";
    gridEl.appendChild(el("p", "muted", t("modules.loading")));
    try {
      await fetchLock(false);
      renderChips();
      renderPresets();
      renderGrid();
    } catch (e) {
      gridEl.innerHTML = "";
      showError(t("modules.loadError", { msg: (e && e.message) || String(e) }));
      sfx("error");
    }
  }

  /* ---------- Ініціалізація ---------- */
  function init() {
    searchEl = $("#modulesSearch");
    chipsEl = $("#modulesFilters");
    countEl = $("#modulesCount");
    gridEl = $("#modulesGrid");
    presetsEl = $("#modulesPresets");
    infoEl = $("#modulesInfo");
    errorEl = $("#modulesError");
    moreBtn = $("#modulesMore");
    pypiEl = $("#modulesPypi");
    if (!gridEl) return;

    if (searchEl) {
      searchEl.addEventListener("input", () => { query = searchEl.value; shown = PAGE_SIZE; renderGrid(); });
    }
    if (moreBtn) moreBtn.onclick = () => { shown += PAGE_SIZE; renderGrid(); sfx("click"); };
    document.addEventListener("langchange", () => { renderChips(); renderPresets(); renderGrid(); });
    document.addEventListener("pythonrun", syncLoaded);
    load();
  }

  function render() {
    if (!gridEl) { init(); return; }
    syncLoaded();
    renderGrid();
  }

  /* Який пакет надає модуль: python.js використовує це для підказок про ModuleNotFoundError */
  function providerFor(importName) {
    if (!importName) return null;
    if (byImport[importName]) return byImport[importName];
    const direct = packages.find((p) => p.name === importName || p.name === importName.replace(/_/g, "-"));
    return direct ? direct.name : null;
  }

  /* Той самий модуль, але лише якщо пакет живе на PyPI: саме такі не знає
     `loadPackagesFromImports`, і їх тягне micropip. */
  function pypiFor(importName) {
    const name = providerFor(importName);
    if (!name) return null;
    const pkg = packages.find((p) => p.name === name);
    return pkg && pkg.src === "pypi" ? name : null;
  }

  global.Modules = {
    init, render, load, providerFor, pypiFor, ensureCatalog, lookup: lookupPypi,
    installed: () => installedNow.slice(),
    all: () => packages.slice(),
    ext: () => Object.keys(EXT),
    count: () => packages.length
  };
})(window);
