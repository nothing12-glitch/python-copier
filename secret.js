/* Секретна кімната: кліки по логотипу -> фрази; з 200-го кліку пароль; після пароля кімната з фото.
   Пароль сховано частинами у title заголовків трьох розділів (Python, Ігри, Інструменти). */
(function (global) {
  const KEY_CLICKS = "app.secretClicks";
  const KEY_FOUND = "app.secretFound";
  const PASSWORD = "nyamnyam200";
  const GOAL = 200;
  const TEASE_FROM = GOAL - 20;

  const SL = {
    uk: {
      phrases: [
        "Тут нічого немає.",
        "Серйозно. Нічого.",
        "Це просто логотип.",
        "Тут лише терминал і трохи магії.",
        "Порожньо, як у консолі без print.",
        "Тук-тук. Ніхто не відчиняє.",
        "Нічого… або?",
        "Не клацай сюди 200 разів. Просто не треба."
      ],
      tease: "Залишилось кліків: {n}…",
      pwdTitle: "Секретний вхід",
      pwdText: "Стукіт прийнято. Пароль складається з трьох частин, схованих у трьох вкладках: наведи курсор на заголовок розділу.",
      pwdPh: "Пароль",
      pwdOk: "Увійти",
      cancel: "Скасувати",
      wrong: "Не той пароль. Спробуй ще.",
      roomTitle: "Секретну кімнату знайдено!",
      roomText: "Витя передає: ням-ням надійно захищено.",
      cap1: "Тут усе почалося",
      cap2: "Витя где ням ням",
      close: "Закрити"
    },
    en: {
      phrases: [
        "There is nothing here.",
        "Seriously. Nothing.",
        "This is just a logo.",
        "Only a terminal and a bit of magic here.",
        "Empty, like a console without print.",
        "Knock knock. Nobody answers.",
        "Nothing… or is there?",
        "Do not click this 200 times. Just don't."
      ],
      tease: "{n} more clicks — and something will happen…",
      pwdTitle: "Secret entrance",
      pwdText: "The knock is accepted. The password has three parts hidden in three tabs: hover the cursor over a section title.",
      pwdPh: "Password",
      pwdOk: "Enter",
      cancel: "Cancel",
      wrong: "Wrong password. Try again.",
      roomTitle: "Secret room found!",
      roomText: "Vitya says: the nyam-nyam is safely protected.",
      cap1: "This is where it all began",
      cap2: "Vitya, where is the nyam-nyam",
      close: "Close"
    },
    tr: {
      phrases: [
        "Burada hiçbir şey yok.",
        "Cidden. Hiçbir şey.",
        "Bu sadece bir logo.",
        "Burada yalnızca bir terminal ve biraz sihir var.",
        "Print olmayan bir konsol gibi boş.",
        "Tak tak. Kimse açmıyor.",
        "Hiçbir şey… ya da var mı?",
        "Buraya 200 kez tıklama. Sakın."
      ],
      tease: "{n} tıklama daha — ve bir şey olacak…",
      pwdTitle: "Gizli giriş",
      pwdText: "Vuruş kabul edildi. Şifre üç sekmede gizlenmiş üç parçadan oluşur: bölüm başlığının üzerine imleci getir.",
      pwdPh: "Şifre",
      pwdOk: "Gir",
      cancel: "İptal",
      wrong: "Yanlış şifre. Tekrar dene.",
      roomTitle: "Gizli oda bulundu!",
      roomText: "Vitya diyor ki: nyam-nyam güvenle korunuyor.",
      cap1: "Her şey burada başladı",
      cap2: "Vitya, nyam-nyam nerede",
      close: "Kapat"
    }
  };
  const T = () => SL[global.I18n ? global.I18n.lang : "uk"] || SL.uk;
  const clicks = () => Number(localStorage.getItem(KEY_CLICKS) || 0);
  const found = () => localStorage.getItem(KEY_FOUND) === "1";
  const toast = (m) => { if (global.App) global.App.toast(m); };
  const sfx = () => global.Audio2 && global.Audio2.SFX;

  function closeModals() {
    document.querySelectorAll(".ob-backdrop[data-secret]").forEach((m) => m.remove());
  }

  function shell() {
    closeModals();
    const bd = document.createElement("div");
    bd.className = "ob-backdrop";
    bd.dataset.secret = "1";
    const card = document.createElement("div");
    card.className = "ob-card";
    bd.appendChild(card);
    bd.onclick = (e) => { if (e.target === bd) closeModals(); };
    document.body.appendChild(bd);
    return card;
  }

  function hit() {
    if (found()) { openRoom(); return; }
    const n = clicks() + 1;
    localStorage.setItem(KEY_CLICKS, String(n));
    if (n >= GOAL) { sfx() && sfx().pop(); openPwd(); return; }
    if (n >= TEASE_FROM) { toast(T().tease.replace("{n}", String(GOAL - n))); return; }
    const p = T().phrases;
    toast(p[Math.floor(Math.random() * p.length)]);
  }

  function openPwd() {
    const card = shell();
    const h = document.createElement("h3");
    h.textContent = T().pwdTitle;
    const p = document.createElement("p");
    p.textContent = T().pwdText;
    const inp = document.createElement("input");
    inp.className = "ob-input";
    inp.type = "password";
    inp.placeholder = T().pwdPh;
    card.append(h, p, inp);
    const row = document.createElement("div");
    row.className = "ob-actions";
    const cancel = document.createElement("button");
    cancel.className = "btn text";
    cancel.textContent = T().cancel;
    cancel.onclick = closeModals;
    const ok = document.createElement("button");
    ok.className = "btn contained";
    ok.textContent = T().pwdOk;
    const check = () => {
      if (inp.value.trim().toLowerCase() === PASSWORD) {
        localStorage.setItem(KEY_FOUND, "1");
        sfx() && sfx().win();
        closeModals();
        openRoom();
      } else {
        sfx() && sfx().error();
        toast(T().wrong);
        inp.value = "";
        inp.focus();
      }
    };
    ok.onclick = check;
    inp.addEventListener("keydown", (e) => { if (e.key === "Enter") check(); });
    row.append(cancel, ok);
    card.appendChild(row);
    setTimeout(() => inp.focus(), 60);
  }

  function openRoom() {
    const card = shell();
    const h = document.createElement("h3");
    h.textContent = T().roomTitle;
    const p = document.createElement("p");
    p.textContent = T().roomText;
    const wrap = document.createElement("div");
    wrap.className = "secret-imgs";
    [["img/secret-logo.png", T().cap1], ["img/secret-nyam.jpg", T().cap2]].forEach(([src, cap]) => {
      const img = document.createElement("img");
      img.src = src;
      img.alt = cap;
      img.className = "secret-img";
      const c = document.createElement("div");
      c.className = "secret-cap";
      c.textContent = cap;
      wrap.append(img, c);
    });
    card.append(h, p, wrap);
    const row = document.createElement("div");
    row.className = "ob-actions";
    const close = document.createElement("button");
    close.className = "btn contained";
    close.textContent = T().close;
    close.onclick = closeModals;
    row.appendChild(close);
    card.appendChild(row);
  }

  function init() {
    const logo = document.querySelector(".appbar-logo");
    if (logo) logo.addEventListener("click", hit);
  }

  document.addEventListener("DOMContentLoaded", init);
})(window);
