/* turtle.js — розділ «Черепашка»: малювання кодом на власному полотні.
   Рушій уже є в pygui.js (модуль turtle для Pyodide), тому тут лише уроки,
   задачі з прихованою геометричною перевіркою та галерея зразків.
   Прогрес: app.turtle.<user>, код задачі: app.turtle.code.<user>.<id> */
(function (global) {
  const $ = (s) => document.querySelector(s);
  const KEY = "app.turtle.";
  const CODE_KEY = "app.turtle.code.";
  const POINTS = { 1: 10, 2: 15, 3: 25 };

  const t = (k, v) => global.I18n.t(k, v);
  const pick = (o) => global.I18n.langMap(o);
  const el = (tag, cls, text) => {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text != null) node.textContent = String(text);
    return node;
  };
  const toast = (m) => { if (global.App && global.App.toast) global.App.toast(m); };
  const sfx = (n) => { const s = global.Audio2 && global.Audio2.SFX; if (s && s[n]) s[n](); };
  const user = () => (global.Profile && global.Profile.handle()) || "guest";

  /* ---------- Дані: уроки ---------- */
  const LESSONS = [
    {
      id: "first", ico: "touch_app",
      title: { uk: "Перший крок", en: "First step", tr: "İlk adım" },
      text: {
        uk: "Черепашка живе на полотні і стає тим, що ти напишеш. Рядок «import turtle» відкриває модуль, а «turtle.forward(100)» рухає черепашку на 100 пікселів уперед із опущеним олівцем — лишається рівна лінія.",
        en: "The turtle lives on a canvas and becomes whatever you type. \"import turtle\" opens the module, and \"turtle.forward(100)\" slides it 100 pixels forward with the pen down, so a straight line stays behind.",
        tr: "Kaplumbağa bir tuvalde yaşar ve yazdığın her şeye dönüşür. \"import turtle\" modülü açar; \"turtle.forward(100)\" kalemi aşağıda olacak şekilde onu 100 piksel ileri kaydırır ve geride düz bir çizgi kalır."
      },
      tip: {
        uk: "Зміни 100 на 200 або додай другий рядок із «turtle.forward(50)」 — полотно оновиться після запуску.",
        en: "Change 100 to 200, or add a second \"turtle.forward(50)\" line — the canvas redraws after the run.",
        tr: "100 yerine 200 yaz ya da ikinci bir \"turtle.forward(50)\" satırı ekle; çalıştırınca tuval yeniden çizilir."
      },
      code: `import turtle

turtle.forward(100)
`
    },
    {
      id: "turn", ico: "rotate_right",
      title: { uk: "Повороти", en: "Turning", tr: "Dönüşler" },
      text: {
        uk: "Черепашка завжди «дивиться» в бік свого курсу. turtle.left(90) розвертає її ліворуч на 90 градусів, turtle.right(45) — праворуч на 45. Сам курс при цьому не змінюється: повертається лише напрямок.",
        en: "The turtle always faces along its course. turtle.left(90) swings it 90 degrees to the left, turtle.right(45) 45 degrees to the right; the course itself stays put, only the heading turns.",
        tr: "Kaplumbağa hep yönüne bakır. turtle.left(90) onu 90 derece sola, turtle.right(45) 45 derece sağa çevirir; yönün kendisi yerinde kalır, sadece başlık döner."
      },
      tip: {
        uk: "Спробуй чотири рази по turtle.left(90) — вийде квадрат, якщо рухати між поворотами.",
        en: "Try four turtle.left(90) calls with a move between them — a square appears.",
        tr: "Dört kez turtle.left(90) dene, aralarda hareket ederse bir kare oluşur."
      },
      code: `import turtle

for _ in range(4):
    turtle.forward(80)
    turtle.left(90)
`
    },
    {
      id: "color", ico: "palette",
      title: { uk: "Колір і товщина", en: "Colour and width", tr: "Ren ve kalınlık" },
      text: {
        uk: "turtle.color(\"crimson\") фарбує олівець, turtle.pensize(6) робить лінію жирнішою, а turtle.bgcolor(\"lightyellow\") забарвлює все полотно. Кольори можна писати назвами або трійкою чисел від 0 до 255.",
        en: "turtle.color(\"crimson\") dyes the pen, turtle.pensize(6) makes the line thicker, turtle.bgcolor(\"lightyellow\") tints the whole canvas. Colours go either as names or as three numbers from 0 to 255.",
        tr: "turtle.color(\"crimson\") kalemi boyar, turtle.pensize(6) çizgiyi kalınlaştırır, turtle.bgcolor(\"lightyellow\") tüm tuvali renklendirir. Renkler isim olarak ya da 0-255 arası üç sayıyla verilir."
      },
      tip: {
        uk: "Додай turtle.circle(60) після кольору — коло буде того самого відтінку.",
        en: "Add turtle.circle(60) after the colour call — the circle takes the same shade.",
        tr: "Renk satırından sonra turtle.circle(60) ekle; daire aynı tonda çıkar."
      },
      code: `import turtle

turtle.bgcolor("lightyellow")
turtle.color("crimson")
turtle.pensize(5)
turtle.circle(60)
`
    },
    {
      id: "circle", ico: "lens",
      title: { uk: "Кола та дуги", en: "Circles and arcs", tr: "Daireler ve yaylar" },
      text: {
        uk: "turtle.circle(50) малює коло з радіусом 50, а другий параметр задає дугу в градусах: turtle.circle(80, 90) — чверть кола. Негативний радіус штовхає черепашку в протобік.",
        en: "turtle.circle(50) draws a circle of radius 50; a second number is the arc in degrees, so turtle.circle(80, 90) is a quarter circle. A negative radius sends the turtle the other way.",
        tr: "turtle.circle(50) yarıçapı 50 olan daire çizer; ikinci sayı derecede yay demektir, yani turtle.circle(80, 90) çeyrek dairedir. Eksi yarıçap kaplumbağayı ters yöne iter."
      },
      tip: {
        uk: "П'ять дуг по 72 градуси з поворотом дають квітку.",
        en: "Five arcs of 72 degrees with a turn between them make a flower.",
        tr: "Beş kez 72 derecelik yay ve arada dönüş, bir çiçek oluşturur."
      },
      code: `import turtle

for i in range(5):
    turtle.color("deeppink" if i % 2 else "gold")
    turtle.circle(70, 144)
    turtle.left(72)
`
    },
    {
      id: "pen", ico: "line_style",
      title: { uk: "Олівець вгору", en: "Pen up", tr: "Kalem yukarı" },
      text: {
        uk: "turtle.penup() піднімає олівець: далі черепашка пересувається без сліду. turtle.pendown() опускає назад, а turtle.goto(60, 60) миттєво переносить у точку полотна з центром у (0, 0).",
        en: "turtle.penup() lifts the pen, so the turtle travels without a trace; turtle.pendown() drops it again, and turtle.goto(60, 60) jumps straight to a point while the centre of the canvas is (0, 0).",
        tr: "turtle.penup() kalemi kaldırır, kaplumbağa iz bırakmadan gider; turtle.pendown() geri indirir, turtle.goto(60, 60) ise doğrudan bir noktaya atlar — tuvalin merkezi (0, 0)'dır."
      },
      tip: {
        uk: "Намалюй три квадрати в різних місцях: penup → goto → pendown.",
        en: "Draw three squares in different spots: penup, goto, pendown.",
        tr: "Üç kareyi ayrı yerlerde çiz: penup, goto, pendown."
      },
      code: `import turtle

for x in (-120, 0, 120):
    turtle.penup()
    turtle.goto(x, -40)
    turtle.pendown()
    for _ in range(4):
        turtle.forward(80)
        turtle.left(90)
`
    },
    {
      id: "fill", ico: "format_color_fill",
      title: { uk: "Заливка", en: "Filling", tr: "Doldurma" },
      text: {
        uk: "Між turtle.begin_fill() та turtle.end_fill() будь-яка замкнена фігула zalивається кольором заповнення. Окремо його ставлять через turtle.fillcolor(\"mediumseagreen\").",
        en: "Anything closed between turtle.begin_fill() and turtle.end_fill() is filled with the fill colour, which you set on its own with turtle.fillcolor(\"mediumseagreen\").",
        tr: "turtle.begin_fill() ile turtle.end_fill() arasında kapatılan her şekil dolgu rengiyle boyanır; dolgu rengini ayrı olarak turtle.fillcolor(\"mediumseagreen\") ile belirlersin."
      },
      tip: {
        uk: "Спробуй зірку з fillcolor — вийде справжній прапорець.",
        en: "Try a star with fillcolor and it turns into a real flag.",
        tr: "Doldurma rengiyle bir yıldız dene; gerçek bir bayrağa döner."
      },
      code: `import turtle

turtle.fillcolor("gold")
turtle.begin_fill()
for _ in range(5):
    turtle.forward(120)
    turtle.right(144)
turtle.end_fill()
`
    },
    {
      id: "speed", ico: "speed",
      title: { uk: "Швидкість і анімація", en: "Speed and animation", tr: "Hız ve animasyon" },
      text: {
        uk: "turtle.speed(0) — максимальна швидкість, turtle.speed(3) — спокійна, видно кожний рух. turtle.tracer(0, 0) вимикає анімацію зовсім, а turtle.update() показує результат одним махом: так малюються складні картини миттєво.",
        en: "turtle.speed(0) is the fastest, turtle.speed(3) is calm enough to watch every move. turtle.tracer(0, 0) switches animation off entirely and turtle.update() reveals the result at once — that is how busy pictures appear instantly.",
        tr: "turtle.speed(0) en hızlısı, turtle.speed(3) her hareketi izlemeye yetecek kadar sakin. turtle.tracer(0, 0) animasyonu tümüyle kapatır, turtle.update() sonucu tek seferde gösterir; karışık resimler böylece anında belirir."
      },
      tip: {
        uk: "Без update() після tracer(0, 0) нічого не з'явиться — не забувай фінальний виклик.",
        en: "Without update() after tracer(0, 0) nothing shows up — never forget the final call.",
        tr: "tracer(0, 0) sonrası update() olmazsa hiçbir şey görünmez; sonda onu çağırmayı unutma."
      },
      code: `import turtle

turtle.tracer(0, 0)
turtle.speed(0)
for i in range(120):
    turtle.forward(i * 2)
    turtle.right(59)
turtle.update()
`
    },
    {
      id: "many", ico: "groups",
      title: { uk: "Кілька черепашок", en: "Several turtles", tr: "Birçok kaplumbağa" },
      text: {
        uk: "«a = turtle.Turtle()» створює другу черепашку зі своїм олівцем і кольором. Далі a.forward(50) керує саме її, а короткі команди без імені лишаються у головної черепашки.",
        en: "\"a = turtle.Turtle()\" makes a second turtle with its own pen and colour; a.forward(50) steers that one, while the short calls without a name still belong to the main turtle.",
        tr: "\"a = turtle.Turtle()\" kendi kalemi ve rengiyle ikinci kaplumbağayı yaratır; a.forward(50) onu sürer, isimsiz kısa komutlar ise ana kaplumbağada kalır."
      },
      tip: {
        uk: "Дай кожній черепашці свій колір — одразу видно, хто що малює.",
        en: "Give each turtle its own colour and it is obvious at once who draws what.",
        tr: "Her kaplumbağaya kendi rengini ver; kimin ne çizdiği hemen anlaşılır."
      },
      code: `import turtle

a = turtle.Turtle()
b = turtle.Turtle()
a.color("dodgerblue")
b.color("tomato")
for _ in range(4):
    a.forward(90)
    a.left(90)
    b.forward(50)
    b.right(90)
`
    },
    {
      id: "tree", ico: "forest",
      title: { uk: "Рекурсивне дерево", en: "A recursive tree", tr: "İç içe geçmiş ağaç" },
      text: {
        uk: "Функція, яка викликає сама себе, малює гілки: гілка коротшає на 10 пікселів, а на 10 пікселів уже зупиняється. Це перша зустріч із рекурсією — і відразу з картинкою.",
        en: "A function that calls itself draws the branches: each branch shrinks by 10 pixels and at 10 pixels it stops. That is the first meeting with recursion — and it comes with a picture.",
        tr: "Kendini çağıran bir fonksiyon dalları çizer: her dal 10 piksel kısalır ve 10 pikselde durur. Bu, özyinelemeyle ilk karşılaşma — hem de bir resimle birlikte."
      },
      tip: {
        uk: "Зміни кут 25 на 40 — крона стане значно ширшою.",
        en: "Change the angle 25 into 40 and the crown spreads a lot wider.",
        tr: "25 açısını 40 yap; tepesinin dalları epeyce genişler."
      },
      code: `import turtle

def branch(n):
    if n < 10:
        return
    turtle.forward(n)
    turtle.left(25)
    branch(n - 12)
    turtle.right(50)
    branch(n - 12)
    turtle.left(25)
    turtle.backward(n)

turtle.color("saddlebrown")
turtle.left(90)
branch(90)
`
    },
    {
      id: "keys", ico: "keyboard",
      title: { uk: "Керування з клавіатури", en: "Keyboard control", tr: "Klavye ile yönetim" },
      text: {
        uk: "Черепашка слухає клавіші: turtle.listen() вмикає слухання, turtle.onkey(функція, \"Up\") вішає реакцію. Натисни стрілку після запуску — малюнок продовжиться з місця, де ти зупинився.",
        en: "The turtle can listen: turtle.listen() starts the listening, turtle.onkey(function, \"Up\") hangs a reaction on the key. Press an arrow after the run and the drawing continues where you stopped.",
        tr: "Kaplumbağa dinleyebilir: turtle.listen() dinlemeyi açar, turtle.onkey(fonksiyon, \"Up\") tuşa bir tepki asar. Çalıştırdıktan sonra bir ok tuşuna bas; çizim kaldığın yerden sürer."
      },
      tip: {
        uk: "Після onkey обов'язково виклич turtle.listen(), інакше клавіші ігноруються.",
        en: "After onkey always call turtle.listen(), otherwise the keys are ignored.",
        tr: "onkey'den sonra mutlaka turtle.listen() çağır; yoksa tuşlar yok sayılır."
      },
      code: `import turtle

def up():
    turtle.left(45)
    turtle.forward(40)

def down():
    turtle.right(45)
    turtle.forward(40)

turtle.onkey(up, "Left")
turtle.onkey(down, "Right")
turtle.listen()
`
    }
  ];

  /* ---------- Дані: задачі (перевіряються прихованим зчитуванням позиції) ---------- */
  const VERIFY = "import turtle\nprint(round(turtle.xcor()), round(turtle.ycor()), round(turtle.heading()))\n";

  const TASKS = [
    {
      id: "t_east", level: 1,
      title: { uk: "До краю полотна", en: "To the edge of the canvas", tr: "Tuvalin kenarına" },
      text: {
        uk: "Доведи черепашку рівно на 100 пікселів праворуч і не повертай. Перевірка подивиться, де вона зупинилась.",
        en: "Walk the turtle exactly 100 pixels to the right without turning. The check only looks at where it stopped.",
        tr: "Kaplumbağayı tam 100 piksel sağa götür, hiç dönmeden. Kontrol yalnızca nerede durduğuna bakar."
      },
      hint: {
        uk: "Один рядок: turtle.forward(100).",
        en: "A single line: turtle.forward(100).",
        tr: "Tek satır: turtle.forward(100)."
      },
      starter: `import turtle

`,
      expect: "100 0 0"
    },
    {
      id: "t_north", level: 1,
      title: { uk: "Спершу поверни", en: "Turn first", tr: "Önce dön" },
      text: {
        uk: "Розверни черепашку вгору та зроби 60 пікселів. Вона має опинитися в точці (0; 60) з курсом 90 градусів.",
        en: "Swing the turtle upward and go 60 pixels. It has to end at (0, 60) with a heading of 90 degrees.",
        tr: "Kaplumbağayı yukarı çevir ve 60 piksel git. (0, 60) noktasında, yönü 90 derece olarak bitirmeli."
      },
      hint: {
        uk: "Спочатку turtle.left(90), потім turtle.forward(60).",
        en: "First turtle.left(90), then turtle.forward(60).",
        tr: "Önce turtle.left(90), sonra turtle.forward(60)."
      },
      starter: `import turtle

`,
      expect: "0 60 90"
    },
    {
      id: "t_square", level: 1,
      title: { uk: "Квадрат і додому", en: "A square and home", tr: "Kare ve eve dönüş" },
      text: {
        uk: "Намалюй квадрат зі стороною 50 так, щоб черепашка повернулася в початок і дивилася туди ж, куди на старті.",
        en: "Draw a square with a side of 50 so that the turtle returns to the start and faces the same way as at the beginning.",
        tr: "Kenarı 50 olan bir kare çiz; kaplumbağa başlangıca dönsün ve başta nereye bakıyorsa oraya baksın."
      },
      hint: {
        uk: "Цикл чотири рази: forward(50) і left(90) — чотири прямі кути дають 360 градусів.",
        en: "Loop four times: forward(50) and left(90) — four right angles add up to 360 degrees.",
        tr: "Dört tur döngü: forward(50) ve left(90) — dört dik açı 360 derece eder."
      },
      starter: `import turtle

for _ in range(4):
`,
      expect: "0 0 0"
    },
    {
      id: "t_back", level: 1,
      title: { uk: "Назад і праворуч", en: "Backwards, then right", tr: "Geriye, sonra sağa" },
      text: {
        uk: "Відступив 50 пікселів назад, потім розвернувся праворуч. Курс має стати 270 градусів.",
        en: "Step back 50 pixels, then turn to the right. The heading must end at 270 degrees.",
        tr: "50 piksel geri adım at, sonra sağa dön. Yön 270 derecede bitmeli."
      },
      hint: {
        uk: "turtle.backward(50) і turtle.right(90).",
        en: "turtle.backward(50) and turtle.right(90).",
        tr: "turtle.backward(50) ve turtle.right(90)."
      },
      starter: `import turtle

`,
      expect: "-50 0 270"
    },
    {
      id: "t_diag", level: 2,
      title: { uk: "Діагональ", en: "A diagonal", tr: "Çapraz" },
      text: {
        uk: "Поверни на 60 градусів ліворуч і йди 100 пікселів. Фінал: точка (50; 87), курс 60.",
        en: "Turn 60 degrees left and walk 100 pixels. The finish: the point (50, 87), heading 60.",
        tr: "60 derece sola dön ve 100 piksel yürü. Bitiş: (50, 87) noktası, yön 60."
      },
      hint: {
        uk: "Черепашка рахує градуси сама — тобі лишилось лише два виклики.",
        en: "The turtle does the trigonometry itself; you only need two calls.",
        tr: "Trigonometriyi kaplumbağa halleder; sana iki çağrı düşüyor."
      },
      starter: `import turtle

`,
      expect: "50 87 60"
    },
    {
      id: "t_two_steps", level: 2,
      title: { uk: "Два кроки й поворот", en: "Two steps and a turn", tr: "İki adım bir dönüş" },
      text: {
        uk: "Сто пікселів уперед, поворот ліворуч, знову сто — і ще один поворот ліворуч. Черепашка стане обличчям на захід у точці (100; 100).",
        en: "A hundred forward, a left turn, another hundred, and one more left. The turtle ends facing west at (100, 100).",
        tr: "Yüz ileri, sola dönüş, yine yüz, bir kez daha sola. Kaplumbağa (100, 100)'de batıya bakarak biter."
      },
      hint: {
        uk: "Двічі повтори пару forward(100) + left(90).",
        en: "Repeat the pair forward(100) + left(90) twice.",
        tr: "forward(100) + left(90) ikilisini iki kez tekrarla."
      },
      starter: `import turtle

for _ in range(2):
`,
      expect: "100 100 180"
    },
    {
      id: "t_star", level: 2,
      title: { uk: "Зірка і ще крок", en: "A star, then one more step", tr: "Yıldız, bir adım daha" },
      text: {
        uk: "Намалюй п'ятикутну зірку (п'ять разів: уперед 120 і праворуч 144), а після неї зроби ще 20 пікселів просто так. Зірка замкнена, тож фінал — (20; 0), курс 0.",
        en: "Draw a five-pointed star (five times: forward 120, right 144) and after it take 20 more plain steps. The star closes on itself, so the finish is (20, 0), heading 0.",
        tr: "Beş köşeli bir yıldız çiz (beş kez: 120 ileri, 144 sağa) ve ardından 20 piksel düz yürü. Yıldız kendini kapattığı için bitiş (20, 0), yön 0."
      },
      hint: {
        uk: "144 — це зовнішній кут зірки; не плутай з 72.",
        en: "144 is the outer angle of a star — do not mix it up with 72.",
        tr: "144 yıldızın dış açısı; 72 ile karıştırma."
      },
      starter: `import turtle

for _ in range(5):
`,
      expect: "20 0 0"
    },
    {
      id: "t_spikes", level: 2,
      title: { uk: "П'ять поворотів по 30", en: "Five turns of thirty", tr: "Beş kez otuz" },
      text: {
        uk: "Не рухайся зовсім — лише п'ять разів поверни праворуч на 30 градусів. Курс опиниться на 330, позиція лишиться (0; 0).",
        en: "Do not move at all — just turn right by 30 degrees five times. The heading lands on 330 while the position stays (0, 0).",
        tr: "Hiç hareket etme — sadece beş kez 30 derece sağa dön. Yön 330'e iner, konum (0, 0) kalır."
      },
      hint: {
        uk: "5 × 30 = 150 градусів праворуч, а праворуч — це мінус.",
        en: "5 × 30 = 150 degrees to the right, and right counts as minus.",
        tr: "5 × 30 = 150 derece sağa; sağa eksi sayılır."
      },
      starter: `import turtle

for _ in range(5):
`,
      expect: "0 0 330"
    },
    {
      id: "t_spiral", level: 3,
      title: { uk: "Спіраль квадратів", en: "A spiral of squares", tr: "Kare spirali" },
      text: {
        uk: "Для i від 1 до 5: i*20 пікселів уперед і поворот ліворуч на 90. Фінал — (60; -40) з курсом 90.",
        en: "For i from 1 to 5: i*20 pixels forward and a left turn of 90. The finish is (60, -40) with heading 90.",
        tr: "i 1'den 5'e kadar: i*20 piksel ileri ve 90 sola dönüş. Bitiş (60, -40), yön 90."
      },
      hint: {
        uk: "range(1, 6) дає 1, 2, 3, 4, 5 — не забудь, що 6 не входить.",
        en: "range(1, 6) yields 1, 2, 3, 4, 5 — remember that 6 is not included.",
        tr: "range(1, 6) 1, 2, 3, 4, 5 verir; 6'nın dahil olmadığını unutma."
      },
      starter: `import turtle

for i in range(1, 6):
`,
      expect: "60 -40 90"
    },
    {
      id: "t_triangle", level: 3,
      title: { uk: "Трикутник без закриття", en: "An open triangle", tr: "Açık üçgen" },
      text: {
        uk: "Три боки по 120 пікселів із поворотом праворуч на 120 після перших двох. Черепашка повертається в (0; 0), але дивиться під кутом 120.",
        en: "Three sides of 120 pixels, turning right by 120 after the first two. The turtle comes back to (0, 0) yet looks along 120 degrees.",
        tr: "120 piksellik üç kenar, ilk ikisinden sonra 120 sağa dönüş. Kaplumbağa (0, 0)'a döner ama 120 derecelik bakışta kalır."
      },
      hint: {
        uk: "Три forward(120) і лише два right(120) — останній поворот не потрібен.",
        en: "Three forward(120) and only two right(120) — the last turn is not needed.",
        tr: "Üç forward(120), sadece iki right(120) — son dönüş gerekmez."
      },
      starter: `import turtle

turtle.forward(120)
turtle.right(120)
`,
      expect: "0 0 120"
    }
  ];

  /* ---------- Дані: галерея ---------- */
  const GALLERY = [
    {
      id: "g_rainbow", ico: "laptop",
      title: { uk: "Веселка у колах", en: "Rainbow of rings", tr: "Halkalardan gökkuşağı" },
      code: `import turtle

colors = ["red", "orange", "gold", "green", "dodgerblue", "purple"]
turtle.tracer(0, 0)
turtle.speed(0)
for i in range(60):
    turtle.color(colors[i % 6])
    turtle.circle(10 + i * 3)
    turtle.left(6)
turtle.update()
`
    },
    {
      id: "g_spiral", ico: "blur_on",
      title: { uk: "Спіраль", en: "Spiral", tr: "Spiral" },
      code: `import turtle

turtle.pensize(3)
turtle.color("deepskyblue")
for i in range(180):
    turtle.forward(i * 1.2)
    turtle.right(61)
`
    },
    {
      id: "g_sieve", ico: "grid_on",
      title: { uk: "Решето Ератосфена", en: "Sieve dots", tr: "Elek noktaları" },
      code: `import turtle

import math
turtle.hideturtle()
turtle.speed(0)
turtle.dot(6, "gray")
n = 60
primes = []
for x in range(2, n + 1):
    if all(x % p for p in primes if p * p <= x):
        primes.append(x)
for i, p in enumerate(primes):
    a = i * 0.5
    r = 6 + i * 2.2
    turtle.penup()
    turtle.goto(r * math.cos(a), r * math.sin(a))
    turtle.pendown()
    turtle.dot(9, "crimson")
`
    },
    {
      id: "g_tree", ico: "forest",
      title: { uk: "Дерево", en: "Tree", tr: "Ağaç" },
      code: `import turtle

def branch(n):
    if n < 8:
        return
    turtle.forward(n)
    turtle.left(20)
    branch(n - 10)
    turtle.right(40)
    branch(n - 10)
    turtle.left(20)
    turtle.backward(n)

turtle.tracer(0, 0)
turtle.color("seagreen")
turtle.left(90)
branch(80)
turtle.update()
`
    },
    {
      id: "g_flower", ico: "local_florist",
      title: { uk: "Квітка", en: "Flower", tr: "Çiçek" },
      code: `import turtle

turtle.speed(3)
for i in range(12):
    turtle.color("hotpink" if i % 2 else "gold")
    turtle.circle(60, 180)
    turtle.left(180 - 15)
`
    },
    {
      id: "g_grid", ico: "grid_4x4",
      title: { uk: "Шахівниця", en: "Chessboard", tr: "Satranç tahtası" },
      code: `import turtle

s = 40
turtle.speed(0)
for row in range(8):
    for col in range(8):
        dark = (row + col) % 2 == 0
        turtle.penup()
        turtle.goto(-160 + col * s, 160 - row * s)
        turtle.pendown()
        turtle.fillcolor("dimgray" if dark else "white")
        turtle.begin_fill()
        for _ in range(4):
            turtle.forward(s)
            turtle.right(90)
        turtle.end_fill()
`
    }
  ];

  /* ---------- Стан ---------- */
  const LIDS = {}; LESSONS.forEach((l) => { LIDS[l.id] = l; });
  const TIDS = {}; TASKS.forEach((x) => { TIDS[x.id] = x; });
  const GIDS = {}; GALLERY.forEach((g) => { GIDS[g.id] = g; });

  function getState() {
    try {
      const raw = JSON.parse(localStorage.getItem(KEY + user()));
      if (raw && raw.lessons && raw.tasks) return raw;
    } catch (e) { /* пошкоджений запис — починаємо заново */ }
    return { lessons: {}, tasks: {}, runs: 0 };
  }

  function saveState(s) { localStorage.setItem(KEY + user(), JSON.stringify(s)); }

  function codeKey(id) { return CODE_KEY + user() + "." + id; }
  function readCode(id) { return localStorage.getItem(codeKey(id)) || ""; }
  function writeCode(id, code) { localStorage.setItem(codeKey(id), code); }

  function doneLessons(s) { return Object.keys(s.lessons).filter((id) => LIDS[id]).length; }
  function doneTasks(s) { return Object.keys(s.tasks).filter((id) => TIDS[id]).length; }

  function stats() {
    const s = getState();
    return {
      lessonsRun: doneLessons(s),
      lessonsTotal: LESSONS.length,
      solved: doneTasks(s),
      total: TASKS.length,
      runs: s.runs || 0,
      points: Object.keys(s.tasks).reduce((sum, id) => sum + (TIDS[id] ? POINTS[TIDS[id].level] : 0), 0)
    };
  }

  /* ---------- Рушій ---------- */
  const PyGui = () => global.PyGui || {};

  function cleanupPrelude() {
    /* Полотно живе між запусками, тому спершу витираємо все, що лишилось
       після попереднього уроку, і ставимо черепашку на старт. */
    return "import turtle\nturtle.clearscreen()\nturtle.reset()\n";
  }

  async function runPython(code) {
    const pad = global.PythonPad;
    if (!pad || typeof pad.execute !== "function") return { unavailable: true };
    const gui = PyGui();
    if (hostEl && gui.adopt) {
      gui.adopt(hostEl);
      hostEl.classList.add("turtle-live");
    }
    return await pad.execute(cleanupPrelude() + code, "");
  }

  /* ---------- Таби ---------- */
  let tab = "lessons";

  function setTab(name) {
    tab = name;
    document.querySelectorAll("#turtleTabs .turtle-tab").forEach((b) => {
      b.classList.toggle("active", b.dataset.tab === name);
    });
    renderList();
    showStage(null);
  }

  /* ---------- Список ---------- */
  function renderList() {
    if (!listEl) return;
    const s = getState();
    listEl.innerHTML = "";
    const items = tab === "lessons" ? LESSONS : (tab === "tasks" ? TASKS : GALLERY);
    items.forEach((item) => {
      const row = el("button", "turtle-item");
      row.type = "button";
      const done = tab === "lessons" ? !!s.lessons[item.id] : (tab === "tasks" ? !!s.tasks[item.id] : false);
      row.classList.toggle("done", done);
      if (tab === "tasks") row.classList.toggle("lvl" + item.level, true);
      const ic = el("span", "material-icons");
      ic.textContent = item.ico || (tab === "tasks" ? "check_circle" : "pan_tool");
      const box = el("div", "turtle-itemtext");
      box.appendChild(el("span", "turtle-itemtitle", pick(item.title)));
      if (tab === "tasks") {
        box.appendChild(el("span", "turtle-itemmeta", t("tasks.level" + item.level) + " · +" + POINTS[item.level]));
      } else if (tab === "lessons") {
        box.appendChild(el("span", "turtle-itemmeta", done ? t("turtle.seen") : t("turtle.notSeen")));
      }
      row.append(ic, box);
      if (done) {
        const tick = el("span", "material-icons turtle-tick", "check_circle");
        row.appendChild(tick);
      }
      row.onclick = () => { openItem(item.id); sfx("click"); };
      listEl.appendChild(row);
    });
    if (!items.length) listEl.appendChild(el("p", "turtle-empty", t("turtle.nothing")));

    if (lessonsEl) lessonsEl.textContent = t("turtle.lessonsDone", { n: doneLessons(s), total: LESSONS.length });
    if (tasksEl) tasksEl.textContent = t("turtle.tasksDone", { n: doneTasks(s), total: TASKS.length });
  }

  function currentItem() {
    if (!currentId) return null;
    return (tab === "lessons" ? LIDS : (tab === "tasks" ? TIDS : GIDS))[currentId] || null;
  }

  function openItem(id) {
    currentId = id;
    const item = currentItem();
    if (!item) return;
    const stored = tab === "tasks" ? readCode(id) : "";
    codeEl.value = stored || (item.code || item.starter || "");
    titleEl.textContent = pick(item.title);
    textEl.textContent = item.text ? pick(item.text) : t("turtle.galleryHint");
    tipEl.textContent = item.tip ? pick(item.tip) : "";
    tipEl.hidden = !item.tip;
    hintBox.hidden = true;
    statusEl.textContent = "";
    statusEl.className = "turtle-status";
    checkBtn.textContent = tab === "tasks" ? t("turtle.check") : t("turtle.run");
    outEl.textContent = "";
    renderList();
    showStage(item);
  }

  function showStage(item) {
    if (!stageEl) return;
    stageEl.classList.toggle("hidden", !item);
    backBtn.hidden = !item;
  }

  /* ---------- Запуск і перевірка ---------- */
  let busy = false;

  async function run() {
    if (busy) return;
    const item = currentItem();
    if (!item) return;
    const code = codeEl.value;
    if (!code.trim()) { toast(t("tasks.emptyCode")); sfx("error"); return; }
    busy = true;
    statusEl.textContent = t("tasks.checking");
    statusEl.className = "turtle-status loading";
    try {
      const r = await runPython(code);
      if (r.unavailable) {
        statusEl.textContent = t("tasks.unavailable");
        statusEl.className = "turtle-status error";
        sfx("error");
        return;
      }
      outEl.textContent = (r.output || "").trim();
      if (r.error) {
        statusEl.textContent = global.UI && global.UI.errStatus
          ? global.UI.errStatus(t("tasks.runtimeError"), r.err && r.err.type)
          : t("tasks.runtimeError");
        statusEl.className = "turtle-status error";
        sfx("error");
        return;
      }
      statusEl.textContent = t("turtle.drew");
      statusEl.className = "turtle-status good";
      sfx("success");
      markRun(item);
    } finally {
      busy = false;
    }
  }

  async function check() {
    if (busy) return;
    const item = currentItem();
    if (!item || tab !== "tasks") return;
    const code = codeEl.value;
    if (!code.trim()) { toast(t("tasks.emptyCode")); sfx("error"); return; }
    busy = true;
    writeCode(item.id, code);
    statusEl.textContent = t("tasks.checking");
    statusEl.className = "turtle-status loading";
    try {
      const r = await runPython(code);
      if (r.unavailable) {
        statusEl.textContent = t("tasks.unavailable");
        statusEl.className = "turtle-status error";
        sfx("error");
        return;
      }
      if (r.error) {
        statusEl.textContent = global.UI && global.UI.errStatus
          ? global.UI.errStatus(t("tasks.runtimeError"), r.err && r.err.type)
          : t("tasks.runtimeError");
        statusEl.className = "turtle-status error";
        sfx("error");
        return;
      }
      /* Те саме полотно, той самий Pyodide: питаємо, де стала черепашка. */
      const v = await global.PythonPad.execute(VERIFY, "");
      const got = String(v.output || "").trim().replace(/\s+/g, " ");
      outEl.textContent = t("turtle.where", { at: got || "—" });
      if (got === item.expect) {
        registerSolved(item);
      } else {
        statusEl.textContent = t("turtle.notThere");
        statusEl.className = "turtle-status bad";
        sfx("error");
      }
    } finally {
      busy = false;
    }
  }

  async function runGallery(item) {
    const r = await runPython(item.code);
    if (r.unavailable) { toast(t("tasks.unavailable")); return; }
    if (r.error) { toast(t("tasks.runtimeError")); return; }
    sfx("success");
    if (hostEl) hostEl.classList.add("turtle-live");
  }

  function markRun(item) {
    const s = getState();
    s.runs = (s.runs || 0) + 1;
    if (tab === "lessons" && !s.lessons[item.id]) {
      s.lessons[item.id] = Date.now();
      toast(t("turtle.lessonToast", { title: pick(item.title) }));
    }
    saveState(s);
    renderList();
    announce();
  }

  function registerSolved(item) {
    const s = getState();
    const fresh = !s.tasks[item.id];
    if (fresh) {
      s.tasks[item.id] = Date.now();
      toast(t("turtle.solvedToast", { title: pick(item.title), p: POINTS[item.level] }));
    } else {
      toast(t("turtle.againToast"));
    }
    saveState(s);
    statusEl.textContent = t("turtle.passed");
    statusEl.className = "turtle-status good";
    sfx("success");
    renderList();
    announce();
    if (fresh) document.dispatchEvent(new CustomEvent("turtledone", { detail: { id: item.id, level: item.level } }));
    if (fresh && doneTasks(getState()) === TASKS.length) {
      setTimeout(() => toast(t("turtle.allToast")), 800);
    }
  }

  function announce() {
    const s = getState();
    document.dispatchEvent(new CustomEvent("turtlechange", {
      detail: { lessons: doneLessons(s), tasks: doneTasks(s), runs: s.runs || 0 }
    }));
  }

  /* ---------- Події ---------- */
  function bind() {
    if (runBtn) runBtn.onclick = () => run();
    if (checkBtn) checkBtn.onclick = () => (tab === "tasks" ? check() : run());
    if (resetBtn) resetBtn.onclick = () => {
      const item = currentItem();
      if (!item) return;
      codeEl.value = item.code || item.starter || "";
      if (tab === "tasks") writeCode(item.id, codeEl.value);
      statusEl.textContent = "";
      outEl.textContent = "";
      sfx("click");
    };
    if (hintBtn) hintBtn.onclick = () => {
      const item = currentItem();
      if (!item || !item.hint) return;
      hintBox.textContent = pick(item.hint);
      hintBox.hidden = false;
      sfx("click");
    };
    if (backBtn) backBtn.onclick = () => { currentId = null; showStage(null); renderList(); sfx("click"); };
    document.querySelectorAll("#turtleTabs .turtle-tab").forEach((b) => {
      b.onclick = () => setTab(b.dataset.tab);
    });
    if (codeEl) {
      codeEl.addEventListener("input", () => {
        const item = currentItem();
        if (item && tab === "tasks") writeCode(item.id, codeEl.value);
      });
    }
    /* Коли людина іде з розділа, полотно повертається у майданчик. */
    document.addEventListener("routechange", (e) => {
      if (e.detail !== "turtle" && PyGui().adopt) {
        const out = document.getElementById("out");
        if (out) PyGui().adopt(out);
      }
    });
  }

  /* ---------- Рендер ---------- */
  function render() {
    if (!listEl) { if (!ready) init(); return; }
    const s = getState();
    introEl.textContent = t("turtle.intro", { lessons: LESSONS.length, tasks: TASKS.length, pictures: GALLERY.length });
    lessonsEl.textContent = t("turtle.lessonsDone", { n: doneLessons(s), total: LESSONS.length });
    tasksEl.textContent = t("turtle.tasksDone", { n: doneTasks(s), total: TASKS.length });
    renderList();
    console.info("[turtle.js] render", doneTasks(s) + "/" + TASKS.length);
  }

  function init() {
    if (ready) { render(); return; }
    ready = true;
    listEl = $("#turtleList");
    stageEl = $("#turtleStage");
    introEl = $("#turtleIntro");
    lessonsEl = $("#turtleLessonsDone");
    tasksEl = $("#turtleTasksDone");
    hostEl = $("#turtleCanvas");
    codeEl = $("#turtleCode");
    outEl = $("#turtleOut");
    statusEl = $("#turtleStatus");
    titleEl = $("#turtleTitle");
    textEl = $("#turtleText");
    tipEl = $("#turtleTip");
    hintBtn = $("#turtleHint");
    hintBox = $("#turtleHintBox");
    runBtn = $("#turtleRun");
    checkBtn = $("#turtleCheck");
    resetBtn = $("#turtleReset");
    backBtn = $("#turtleBack");
    if (!listEl || !codeEl || !stageEl) return;
    stageEl.classList.add("hidden");
    bind();
    render();
  }

  let ready = false, currentId = null;
  let listEl, stageEl, introEl, lessonsEl, tasksEl, hostEl, codeEl, outEl, statusEl,
    titleEl, textEl, tipEl, hintBtn, hintBox, runBtn, checkBtn, resetBtn, backBtn;

  global.TurtleLab = {
    init,
    render,
    stats,
    LESSONS,
    TASKS,
    GALLERY,
    runGallery
  };
})(window);
