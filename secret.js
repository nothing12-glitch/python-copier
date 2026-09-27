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
+20
-0
.feedback-card{max-width:860px;margin:0 auto;padding:0 0 16px}
.feedback-card .card-bar{position:relative}
.bar-center{position:absolute;left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:8px}
@media(max-width:640px){.feedback-card .bar-center{position:static;transform:none;margin-left:auto}}
.feedback-intro{margin:16px 16px 0;color:var(--md-on-surface-var);font-size:14px;line-height:1.6}
.feedback-body{margin:16px}
.feedback-frame{width:100%;height:1400px;border:0;border-radius:12px;background:var(--md-surface-dim);display:block}
.feedback-empty{text-align:center;padding:48px 16px;color:var(--md-on-surface-var)}
.feedback-empty .material-icons{font-size:48px;color:var(--md-primary)}
.feedback-empty h3{margin:12px 0 6px;font-size:18px;font-weight:500;color:var(--md-on-surface)}
.feedback-empty p{margin:0;font-size:14px}
.feedback-note{margin:16px}

/* ===== Secret room ===== */
.appbar-logo{cursor:pointer}
.secret-imgs{display:flex;flex-direction:column;gap:6px;margin:4px 0 16px}
.secret-img{width:100%;border-radius:12px;border:1px solid var(--md-outline-var)}
.secret-cap{font-size:12px;color:var(--md-on-surface-var);margin:0 0 8px}

/* ===== Music playlist ===== */
#musicPanel{position:fixed;top:70px;right:12px;width:320px;max-width:calc(100vw - 24px);z-index:55;background:var(--md-surface);border-radius:16px;box-shadow:var(--md-elev3);padding:12px;display:none}
#musicPanel.show{display:block}
.mp-head{display:flex;align-items:center;justify-content:space-between;padding:2px 4px 8px}
.mp-list{display:flex;flex-direction:column;gap:4px;margin:0 0 8px}
.mp-track{display:flex;flex-direction:column;gap:2px;text-align:left;border:0;background:transparent;border-radius:10px;padding:8px 10px;cursor:pointer;font-family:var(--md-font)}
.mp-track:hover{background:var(--md-surface-dim)}
.mp-track .t{font-size:14px;font-weight:500;color:var(--md-on-surface)}
.mp-track .a{font-size:12px;color:var(--md-on-surface-var)}
.mp-track.playing{background:var(--md-primary-container)}
.mp-track.playing .t,.mp-track.playing .a{color:var(--md-on-primary-container)}
.mp-controls{display:flex;justify-content:center;gap:8px}
@media(max-width:640px){#musicPanel{le
