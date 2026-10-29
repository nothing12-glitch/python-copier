/* Пасхалка «Замок»: 20 кліків по сірій плитці в меню ігор запускає відео,
   у якому сховаємо шість цифрів (по два в три кадри). Відео -> код -> друге
   відео -> анонс наступних ігор. На 3 помилки замок зачиняється знову. */
(function (global) {
  const GOAL = 20;
  const TEASE_FROM = GOAL - 6;
  const ATTEMPTS = 3;
  const CODE = "314159";
  const HINTS = ["31", "41", "59"];
  const FLASH_AT = [2.1, 4.3, 6.5];
  const KEY_CLICKS = "app.vaultClicks";
  const KEY_OPEN = "app.vaultOpen";

  const SL = {
    uk: {
      title: "Скоро тут буде багато нових ігор",
      locked: "Зачинено",
      tease: "Залишилось кліків: {n}…",
      knock: [
        "Тук. Замок не відгукується.",
        "Ще трохи. Він слухає.",
        "Щось скрипе всередині…",
        "Не втомився?",
        "Майже. Ще трішки.",
        "Ще кілька — і він здасться.",
        "Відчув, що ти тут.",
        "Майже чутно, як він відчиняється…",
        "Тримайся, зараз щось буде.",
        "Тук-тук. Уже близько.",
        "Ще трохи-трохи.",
        "Він уже вагається.",
        "Майже-майже.",
        "Три-чотири кліки.",
        "Терпіння — і замок відчиниться.",
        "Уже чутно механізм.",
        "Ще зовсім трішки.",
        "Майже! Тримай темп.",
        "Останній ривок.",
        "Ще один — і побачиш."
      ],
      introTitle: "Замок піддався",
      introText: "Але просто так він нічого не розкаже. Подивись відео до кінця — у ньому сховано шість цифр, по дві в трьох кадрах. Запамʼятай їх і назви код.",
      watch: "Подивитись відео",
      skipNote: "Пропустити не вийде — цифри зʼявляються лише раз.",
      codeTitle: "Введи шестизначний код",
      codeText: "Три кадри по дві цифри. Уважність зараз важливіша за швидкість.",
      codePh: "______",
      check: "Перевірити",
      wrong: "Не той код. Залишилось спроб: {n}",
      rewatch: "Дивитись відео ще раз",
      out: "Замок знову зачинено. Спробуй пізніше.",
      winTitle: "Код підійшов",
      winText: "Тепер останній кадр. Подивись друге відео — і дізнаєшся, скільки ігор насправді попереду.",
      watch2: "Подивитись друге відео",
      revealTitle: "Наступний великий реліз",
      revealText: "Наступного разу замок відчинить двері для {n} нових ігор. Усі вони вже малюються, пишуться й тестуються.",
      revealNote: "Ти ввійшов у таємницю першим. Нікому не кажи.",
      again: "Подивитись ще раз",
      close: "Закрити",
      of: "спроба {n} з {total}"
    },
    en: {
      title: "A lot of new games are coming here",
      locked: "Locked",
      tease: "{n} clicks left…",
      knock: [
        "Knock. The lock ignores you.",
        "A little more. It is listening.",
        "Something creaks inside…",
        "Tired yet?",
        "Almost. A bit further.",
        "A few more and it gives in.",
        "It noticed you are here.",
        "You can almost hear it open…",
        "Hold on, something is happening.",
        "Knock knock. Close now.",
        "Just a little more.",
        "It is hesitating.",
        "Nearly there.",
        "Three or four clicks.",
        "Patience, and it opens.",
        "The mechanism is audible.",
        "A tiny bit more.",
        "Almost! Keep the pace.",
        "Last push.",
        "One more and you will see."
      ],
      introTitle: "The lock gave in",
      introText: "But it will not talk for free. Watch the video to the end — six digits are hidden in it, two in each of three frames. Remember them and say the code.",
      watch: "Watch the video",
      skipNote: "No skipping — the digits appear only once.",
      codeTitle: "Enter the six-digit code",
      codeText: "Three frames, two digits each. Attention beats speed here.",
      codePh: "______",
      check: "Check",
      wrong: "Wrong code. {n} attempts left",
      rewatch: "Watch the video again",
      out: "The lock is shut again. Try later.",
      winTitle: "The code worked",
      winText: "One last frame left. Watch the second video and learn how many games are really coming.",
      watch2: "Watch the second video",
      revealTitle: "The next big release",
      revealText: "Next time this lock opens the door for {n} new games. All of them are being drawn, written and tested right now.",
      revealNote: "You got in on the secret first. Do not tell anyone.",
      again: "Watch it again",
      close: "Close",
      of: "attempt {n} of {total}"
    },
    tr: {
      title: "Buraya çok sayıda yeni oyun geliyor",
      locked: "Kilitli",
      tease: "{n} tıklama kaldı…",
      knock: [
        "Tak. Kilit cevap vermiyor.",
        "Biraz daha. Dinliyor.",
        "İçerde bir şey gıcırdadı…",
        "Yorulduk mu?",
        "Neredeyse. Biraz daha.",
        "Birkaç tıklama ve pes edecek.",
        "Burada olduğunu fark etti.",
        "Açılmasını neredeyse duyuyorsun…",
        "Bekle, bir şey oluyor.",
        "Tak tak. Yakınlaştı.",
        "Azıcık daha.",
        "Kararsızlanıyor.",
        "Neredeyse.",
        "Üç-dört tıklama.",
        "Sabret, kilit açılacak.",
        "Mekanizma duyuluyor.",
        "Çok az kaldı.",
        "Neredeyse! Temponu koru.",
        "Son hamle.",
        "Bir tıklama daha ve göreceksin."
      ],
      introTitle: "Kilit pes etti",
      introText: "Ama öylece konuşmaz. Videoyu sonuna kadar izle — içinde üç karede ikişer olmak üzere altı rakım gizli. Aklında tut ve kodu söyle.",
      watch: "Videoyu izle",
      skipNote: "Geçmek yok — rakamlar yalnızca bir kez görünüyor.",
      codeTitle: "Altı haneli kodu gir",
      codeText: "Üç kare, her birinde iki rakam. Hızdan çok dikkat gerekiyor.",
      codePh: "______",
      check: "Kontrol et",
      wrong: "Yanlış kod. {n} deneme kaldı",
      rewatch: "Videoyu tekrar izle",
      out: "Kilit yeniden kapandı. Daha sonra dene.",
      winTitle: "Kod tuttu",
      winText: "Son kare kaldı. İkinci videoyu izle ve gerçekte kaç oyun geldiğini öğren.",
      watch2: "İkinci videoyu izle",
      revealTitle: "Sıradaki büyük sürüm",
      revealText: "Bu kilit bir dahakine {n} yeni oyun için açılacak. Hepsinin çizimi, kodu ve testi sürüyor.",
      revealNote: "Sırra ilk sen girdin. Kimseye söyleme.",
      again: "Tekrar izle",
      close: "Kapat",
      of: "deneme {n} / {total}"
    }
  };

  const lang = () => (global.I18n ? global.I18n.lang : "uk");
  const L = () => SL[lang()] || SL.uk;
  const sfx = () => (global.Audio2 && global.Audio2.SFX) || null;
  const fmt = (s, vars) => { for (const k in vars) s = s.replace(new RegExp("{" + k + "}", "g"), vars[k]); return s; };
  const store = global.localStorage;
  const clicks = () => Number(store.getItem(KEY_CLICKS) || 0);
  const setClicks = (n) => store.setItem(KEY_CLICKS, String(n));
  const isOpen = () => store.getItem(KEY_OPEN) === "1";

  function overlay(inner, opts) {
    const bd = document.createElement("div");
    bd.className = "vlt-backdrop" + (opts && opts.blind ? " vlt-blind" : "");
    bd.innerHTML = inner;
    document.body.appendChild(bd);
    document.body.classList.add("vlt-noscroll");
    requestAnimationFrame(() => bd.classList.add("vlt-in"));
    return bd;
  }
  function closeOverlay(bd) {
    if (!bd) return;
    bd.classList.remove("vlt-in");
    bd.classList.add("vlt-out");
    setTimeout(() => {
      bd.remove();
      if (!document.querySelector(".vlt-backdrop")) document.body.classList.remove("vlt-noscroll");
    }, 200);
  }

  /* ---------- плитка в меню ігор ---------- */
  function lockTile() {
    const card = document.createElement("div");
    card.className = "game-card vlt-card" + (isOpen() ? " vlt-opened" : "");
    const n = clicks();
    const left = Math.max(0, GOAL - n);
    card.innerHTML =
      '<div class="vlt-lock"><span class="material-icons">' + (isOpen() ? "lock_open" : "lock") + "</span></div>" +
      "<h3>" + (isOpen() ? L().revealTitle : L().title) + "</h3>" +
      "<p>" + (isOpen() ? L().revealNote : (left && left < GOAL ? fmt(L().tease, { n: left }) : L().locked)) + "</p>";
    card.onclick = () => {
      const s = sfx();
      if (isOpen()) { reveal(); return; }
      if (s) s.click();
      const v = clicks() + 1;
      setClicks(v);
      card.classList.remove("shake");
      void card.offsetWidth;
      card.classList.add("shake");
      const leftNow = GOAL - v;
      const p = card.querySelector("p");
      if (leftNow <= 0) { setClicks(0); intro(); return; }
      const k = L().knock;
      p.textContent = leftNow <= GOAL - TEASE_FROM + 1 ? k[Math.min(k.length - 1, v - 1)] : fmt(L().tease, { n: leftNow });
    };
    return card;
  }

  function inject(force) {
    const hub = document.querySelector("#gamesHub");
    if (!hub || !hub.querySelector(".game-card")) return;
    const cur = hub.querySelector(".vlt-card");
    if (cur && !force && cur === hub.lastElementChild) return;
    const tile = lockTile();
    if (cur) cur.replaceWith(tile);
    else hub.appendChild(tile);
  }

  /* ---------- процедурна «відео»-сцена на canvas ---------- */
  const accent = () => {
    const v = getComputedStyle(document.documentElement).getPropertyValue("--md-primary").trim();
    return /^#([0-9a-f]{6})$/i.test(v) ? v : "#7c5cff";
  };
  const hex = (h, i) => parseInt(h.replace("#", "").substr(i * 2, 2), 16);
  const rgb = (h, a) => "rgba(" + hex(h, 0) + "," + hex(h, 1) + "," + hex(h, 2) + "," + a + ")";
  const rm = () => window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const rnd = (() => { let s = 20261029; return () => ((s = (s * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff); })();
  const STARS = Array.from({ length: 90 }, () => [rnd(), rnd(), rnd()]);
  const ICONS = ["🐍", "🧠", "🕹️", "❎", "🐣", "💣", "🔢", "🧩", "🎯", "🃏", "🏁", "⚡",
    "🌙", "🍀", "🎲", "🧱", "🚀", "🐸", "🔺", "🎵", "🕹️", "🧮", "🥎", "🏹",
    "🐙", "🦖", "🧊", "🎃", "🛸", "🪐", "🔮", "🦉", "🐝", "🌋", "🧲", "🎈",
    "🐬", "🦊", "🍄", "🪁", "🧤", "🥁", "🎸", "🐲", "🦄", "🧙", "👾", "🐧"];

  function scene(cv, mode, t, dur) {
    const ctx = cv.getContext("2d");
    const W = cv.width, H = cv.height;
    const ac = accent();
    const k = Math.max(0, Math.min(1, t / dur));
    ctx.fillStyle = "#05070f";
    ctx.fillRect(0, 0, W, H);
    /* м'яке світло в глибині */
    const glow = ctx.createRadialGradient(W / 2, H * 0.52, 10, W / 2, H * 0.52, W * 0.55);
    glow.addColorStop(0, rgb(ac, 0.42));
    glow.addColorStop(1, "rgba(5,7,15,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);
    /* зірки / пилин */
    for (let i = 0; i < STARS.length; i++) {
      const s = STARS[i];
      const drift = rm() ? 0 : (t * (0.02 + s[2] * 0.05)) % 1;
      const x = ((s[0] + drift) % 1) * W;
      const y = s[1] * H;
      ctx.fillStyle = rgb(ac, 0.1 + s[2] * 0.35);
      ctx.fillRect(x, y, 2, 2);
    }
    if (mode === "digits") corridor(ctx, W, H, ac, k, t);
    else frames(ctx, W, H, ac, k, t);
    /* кінематографічні смуги зверху/знизу */
    ctx.fillStyle = "rgba(0,0,0,.55)";
    ctx.fillRect(0, 0, W, H * 0.055);
    ctx.fillRect(0, H * 0.945, W, H * 0.055);
  }

  function corridor(ctx, W, H, ac, k, t) {
    const cx = W / 2, cy = H * 0.52;
    /* підлога з перспективою */
    ctx.strokeStyle = rgb(ac, 0.3);
    ctx.lineWidth = 2;
    for (let i = -6; i <= 6; i++) {
      ctx.beginPath();
      ctx.moveTo(cx + i * 46, H);
      ctx.lineTo(cx + i * 8, cy);
      ctx.stroke();
    }
    const speed = rm() ? 0 : 1;
    for (let i = 0; i < 9; i++) {
      const z = ((i / 9) + (t * 0.16 * speed) % (1 / 9)) % 1;
      const y = cy + Math.pow(z, 2.4) * (H - cy);
      ctx.strokeStyle = rgb(ac, 0.06 + z * 0.3);
      ctx.beginPath();
      ctx.moveTo(cx - (W * 0.55) * z, y);
      ctx.lineTo(cx + (W * 0.55) * z, y);
      ctx.stroke();
    }
    /* неонова смуга по боках */
    [-1, 1].forEach((sgn) => {
      ctx.fillStyle = rgb(ac, 0.5);
      ctx.beginPath();
      ctx.moveTo(cx + sgn * W * 0.06, cy);
      ctx.lineTo(cx + sgn * W * 0.5, H * (0.16 + Math.sin(t * 0.9) * 0.01));
      ctx.lineTo(cx + sgn * W * 0.5, H * (0.2 + Math.sin(t * 0.9) * 0.01));
      ctx.lineTo(cx + sgn * W * 0.06, cy + 6);
      ctx.fill();
    });
    /* силует замка, що наближається */
    const s = 0.5 + k * 1.15;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(s, s);
    ctx.shadowColor = rgb(ac, 0.9);
    ctx.shadowBlur = 46;
    ctx.strokeStyle = "rgba(233,238,255,.92)";
    ctx.lineWidth = 16;
    ctx.beginPath();
    ctx.arc(0, -44, 46, Math.PI * 1.03, Math.PI * 1.97);
    ctx.stroke();
    ctx.shadowBlur = 26;
    ctx.fillStyle = "rgba(233,238,255,.16)";
    ctx.strokeStyle = "rgba(233,238,255,.92)";
    ctx.lineWidth = 10;
    roundRect(ctx, -74, -12, 148, 108, 20);
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.fillStyle = "rgba(233,238,255,.9)";
    ctx.beginPath();
    ctx.arc(0, 34, 13, 0, 7);
    ctx.fill();
    ctx.fillRect(-4, 40, 8, 26);
    ctx.restore();
    /* легкий шум у момент появи цифр */
    const near = FLASH_AT.some((at) => Math.abs(t - at) < 0.55);
    if (near) {
      ctx.fillStyle = "rgba(255,255,255,.05)";
      for (let i = 0; i < 40; i++) ctx.fillRect(Math.random() * W, Math.random() * H, 40, 2);
    }
  }

  function frames(ctx, W, H, ac, k, t) {
    const cols = 8, rows = 4, pad = 26;
    const cw = (W - pad * (cols + 1)) / cols, ch = (H * 0.78 - pad * (rows + 1)) / rows;
    const total = cols * rows;
    for (let i = 0; i < total; i++) {
      const c = i % cols, r = (i / cols) | 0;
      const x = pad + c * (cw + pad), y = H * 0.12 + pad + r * (ch + pad);
      const lit = k * total * 1.12 > i;
      ctx.fillStyle = lit ? rgb(ac, 0.22) : "rgba(255,255,255,.045)";
      ctx.strokeStyle = lit ? rgb(ac, 0.85) : "rgba(255,255,255,.12)";
      ctx.lineWidth = 3;
      roundRect(ctx, x, y, cw, ch, 12);
      ctx.fill();
      ctx.stroke();
      if (lit) {
        ctx.font = Math.floor(ch * 0.5) + "px serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(ICONS[i % ICONS.length], x + cw / 2, y + ch / 2 + 2);
      }
    }
    /* фінальний лічильник */
    const left = Math.max(0, Math.min(1, (k - 0.78) / 0.2));
    if (left > 0) {
      ctx.save();
      ctx.globalAlpha = left;
      ctx.fillStyle = "rgba(5,7,15,.72)";
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#eef2ff";
      ctx.shadowColor = rgb(ac, 0.95);
      ctx.shadowBlur = 40;
      ctx.font = "700 " + Math.floor(H * 0.34) + "px 'Space Grotesk', system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("20", W / 2, H / 2);
      ctx.restore();
    }
    void t;
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }


  function playClip(withDigits, onEnd) {
    const bd = overlay(
      '<div class="vlt-player">' +
        '<canvas class="vlt-scene" width="1280" height="720"></canvas>' +
        '<div class="vlt-digit"></div>' +
        '<div class="vlt-note"></div>' +
      "</div>", { blind: true });
    const cv = bd.querySelector(".vlt-scene");
    const digit = bd.querySelector(".vlt-digit");
    const note = bd.querySelector(".vlt-note");
    const MODE = withDigits ? "digits" : "frames";
    const DUR = withDigits ? 8.6 : 6.4;
    note.textContent = withDigits ? L().skipNote : "";
    let timers = [], done = false, raf = 0;

    function finish() {
      if (done) return;
      done = true;
      timers.forEach(clearTimeout);
      if (raf) cancelAnimationFrame(raf);
      closeOverlay(bd);
      setTimeout(onEnd, 220);
    }
    function flash() {
      FLASH_AT.forEach((at, i) => {
        timers.push(setTimeout(() => {
          digit.textContent = HINTS[i];
          digit.className = "vlt-digit show d" + i;
          const s = sfx(); if (s) s.pop();
          timers.push(setTimeout(() => digit.classList.remove("show"), 1150));
        }, at * 1000));
      });
    }
    const t0 = performance.now();
    const draw = () => {
      const t = (performance.now() - t0) / 1000;
      scene(cv, MODE, t, DUR);
      if (t < DUR + 0.2 && !done) raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    timers.push(setTimeout(finish, DUR * 1000));
    if (withDigits) flash();
    return bd;
  }

  function intro() {
    const bd = overlay(
      '<div class="vlt-card-modal">' +
        '<div class="vlt-badge"><span class="material-icons">lock_open</span></div>' +
        "<h3>" + L().introTitle + "</h3>" +
        "<p>" + L().introText + "</p>" +
        '<div class="vlt-actions"><button class="btn contained vlt-go">' + L().watch + "</button></div>" +
      "</div>", { blind: true });
    bd.querySelector(".vlt-go").onclick = () => {
      const s = sfx(); if (s) s.win();
      closeOverlay(bd);
      setTimeout(() => playClip(true, askCode), 220);
    };
  }

  /* ---------- крок 2: код ---------- */
  function askCode(attempt) {
    const left = ATTEMPTS - (attempt || 0);
    const bd = overlay(
      '<div class="vlt-card-modal">' +
        "<h3>" + L().codeTitle + "</h3>" +
        "<p>" + L().codeText + "</p>" +
        '<input class="vlt-input" inputmode="numeric" autocomplete="off" maxlength="6" placeholder="' + L().codePh + '">' +
        '<div class="vlt-of">' + fmt(L().of, { n: (attempt || 0) + 1, total: ATTEMPTS }) + "</div>" +
        '<div class="vlt-msg"></div>' +
        '<div class="vlt-actions"><button class="btn contained vlt-check">' + L().check + "</button>" +
        '<button class="btn text vlt-x">' + L().close + "</button></div>" +
      "</div>", { blind: true });
    const inp = bd.querySelector(".vlt-input");
    const msg = bd.querySelector(".vlt-msg");
    inp.focus();
    inp.oninput = () => { inp.value = inp.value.replace(/\D/g, "").slice(0, 6); };
    function submit() {
      if (inp.value === CODE) {
        const s = sfx(); if (s) s.win();
        closeOverlay(bd);
        setTimeout(win, 220);
        return;
      }
      const s = sfx(); if (s) s.lose();
      if (left <= 1) {
        msg.textContent = L().out;
        msg.classList.add("bad");
        setClicks(0);
        bd.querySelector(".vlt-check").remove();
        bd.querySelector(".vlt-of").remove();
        inject(true);
        return;
      }
      msg.textContent = fmt(L().wrong, { n: left - 1 });
      msg.classList.add("bad");
      setTimeout(() => { closeOverlay(bd); setTimeout(() => playClip(true, () => askCode((attempt || 0) + 1)), 220); }, 900);
    }
    bd.querySelector(".vlt-check").onclick = submit;
    inp.onkeydown = (e) => { if (e.key === "Enter") submit(); };
    bd.querySelector(".vlt-x").onclick = () => { closeOverlay(bd); inject(true); };
  }

  /* ---------- крок 3: друге відео і розкриття ---------- */
  function win() {
    const bd = overlay(
      '<div class="vlt-card-modal">' +
        '<div class="vlt-badge"><span class="material-icons">emoji_events</span></div>' +
        "<h3>" + L().winTitle + "</h3>" +
        "<p>" + L().winText + "</p>" +
        '<div class="vlt-actions"><button class="btn contained vlt-go">' + L().watch2 + "</button></div>" +
      "</div>", { blind: true });
    bd.querySelector(".vlt-go").onclick = () => {
      closeOverlay(bd);
      setTimeout(() => playClip(false, reveal), 220);
    };
  }

  function reveal() {
    store.setItem(KEY_OPEN, "1");
    const bd = overlay(
      '<div class="vlt-card-modal vlt-final">' +
        '<div class="vlt-count">20</div>' +
        "<h3>" + L().revealTitle + "</h3>" +
        "<p>" + fmt(L().revealText, { n: 20 }) + "</p>" +
        '<div class="vlt-whisper">' + L().revealNote + "</div>" +
        '<div class="vlt-actions"><button class="btn contained vlt-x">' + L().close + "</button>" +
        '<button class="btn text vlt-again">' + L().again + "</button></div>" +
      "</div>", { blind: true });
    bd.querySelector(".vlt-x").onclick = () => { closeOverlay(bd); setTimeout(() => inject(true), 220); };
    bd.querySelector(".vlt-again").onclick = () => { closeOverlay(bd); setTimeout(() => playClip(false, reveal), 220); };
    const s = sfx(); if (s) s.win();
  }

  function watchHub() {
    const hub = document.querySelector("#gamesHub");
    if (!hub || hub.dataset.vltWatched) return;
    hub.dataset.vltWatched = "1";
    let raf = 0;
    new MutationObserver(() => {
      if (raf) return;
      raf = requestAnimationFrame(() => { raf = 0; inject(); });
    }).observe(hub, { childList: true });
  }

  function init() {
    watchHub();
    inject(true);
    document.addEventListener("langchange", () => { watchHub(); setTimeout(() => inject(true), 60); });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();

  global.Vault = { open: intro, reveal: reveal, reset: () => { setClicks(0); store.removeItem(KEY_OPEN); inject(true); } };
})(window);
