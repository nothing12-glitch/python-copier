/* Відгуки: вбудовані Google-форми (окрема на кожну мову) + вибір мови */
(function (global) {
  const $ = (s) => document.querySelector(s);

  const FORM_URLS = {
    uk: "https://docs.google.com/forms/d/e/1FAIpQLSdbOSp4mHrvAdMfoRsOPDHYna10YyuvFpXW0YBFUfxgBeoTrg/viewform",
    en: "https://docs.google.com/forms/d/e/1FAIpQLSdbyODW2BLOuYZNElhh4yklqOLx3R1gcIlpgkisxMvDORy8hg/viewform",
    tr: "https://docs.google.com/forms/d/e/1FAIpQLSegWFJOVYdvtnEKRCm-lm1Db-IWMb5udNcMt5voME_gFQT0gQ/viewform"
  };

  const KEY_LANG = "app.formLang";
  let formLang = localStorage.getItem(KEY_LANG) || "";
  let modal = null;

  const LANGS = [["uk", "Українська"], ["en", "English"], ["tr", "Türkçe"]];

  const FL = {
    uk: {
      nav: "Відгуки", title: "Відгуки",
      intro: "Маєш ідею, знайшов(ла) помилку чи хочеш подякувати? Заповни форму — відповіді приходять автору сайту.",
      privacy: "Відповіді зберігаються у Google-таблиці автора. Входити нікуди не треба — можна залишитися анонімом.",
      open: "Відкрити в новій вкладці",
      noFormTitle: "Форму ще не підключено",
      noFormText: "Автор ще не додав посилання на Google-форму. Зазирни пізніше!",
      langTitle: "Якою мовою показати форму?",
      langHint: "Обери мову — форма відкриється нею. Вибір запам'ятається.",
      langBtn: "Мова форми"
    },
    en: {
      nav: "Feedback", title: "Feedback",
      intro: "Have an idea, found a bug, or want to say thanks? Fill in the form — answers go straight to the site author.",
      privacy: "Answers are stored in the author's Google Sheet. No login needed — you can stay anonymous.",
      open: "Open in a new tab",
      noFormTitle: "Form not connected yet",
      noFormText: "The author has not added a Google Form link yet. Check back later!",
      langTitle: "Which language for the form?",
      langHint: "Pick a language — the form will open in it. We'll remember your choice.",
      langBtn: "Form language"
    },
    tr: {
      nav: "Geri Bildirim", title: "Geri Bildirim",
      intro: "Bir fikrin mi var, bir hata mı buldun ya da teşekkür mü etmek istiyorsun? Formu doldur — yanıtlar doğrudan site sahibine gider.",
      privacy: "Yanıtlar site sahibinin Google Tablosunda saklanır. Giriş gerekmez — anonim kalabilirsin.",
      open: "Yeni sekmede aç",
      noFormTitle: "Form henüz bağlanmadı",
      noFormText: "Site sahibi henüz bir Google Form bağlantısı eklemedi. Daha sonra tekrar bak!",
      langTitle: "Form hangi dilde görünsün?",
      langHint: "Bir dil seç — form o dilde açılır. Seçimin hatırlanır.",
      langBtn: "Form dili"
    }
  };
  const S = () => FL[global.I18n ? global.I18n.lang : "uk"] || FL.uk;

  const available = () => LANGS.filter(([c]) => (FORM_URLS[c] || "").trim());
  const availCodes = () => available().map(([c]) => c);

  function currentCode() {
    const codes = availCodes();
    if (!codes.length) return "";
    return codes.includes(formLang) ? formLang : codes[0];
  }

  function formUrl(code, embed) {
    const raw = (FORM_URLS[code] || "").trim();
    if (!raw) return "";
    const base = raw.split("?")[0];
    return base + "?hl=" + code + (embed ? "&embedded=true" : "");
  }

  function closeModal() {
    if (modal) { modal.remove(); modal = null; }
  }

  function langButtons(host, onPick) {
    const row = document.createElement("div");
    row.className = "ob-langs";
    available().forEach(([code, name]) => {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = name;
      b.onclick = () => onPick(code);
      row.appendChild(b);
    });
    host.appendChild(row);
  }

  function pickLang(code) {
    formLang = code;
    localStorage.setItem(KEY_LANG, code);
    closeModal();
    render();
  }

  function askLang() {
    if (modal || available().length < 2) return;
    modal = document.createElement("div");
    modal.className = "ob-backdrop";
    const card = document.createElement("div");
    card.className = "ob-card";
    const ico = document.createElement("div");
    ico.className = "ob-emoji";
    ico.textContent = "\u{1F30D}";
    const h = document.createElement("h3");
    h.textContent = S().langTitle;
    const p = document.createElement("p");
    p.textContent = S().langHint;
    card.append(ico, h, p);
    langButtons(card, pickLang);
    modal.appendChild(card);
    modal.onclick = (e) => { if (e.target === modal) closeModal(); };
    document.body.appendChild(modal);
  }

  function ensureLangBtn() {
    let b = $("#feedbackLangBtn");
    if (!b) {
      const open = $("#feedbackOpen");
      if (!open || !open.parentNode) return null;
      b = document.createElement("button");
      b.id = "feedbackLangBtn";
      b.className = "icon-btn";
      b.innerHTML = '<span class="material-icons">translate</span>';
      open.parentNode.insertBefore(b, open);
      b.onclick = () => askLang();
    }
    b.title = S().langBtn;
    return b;
  }

  function render() {
    const s = S();
    const nav = $("#feedbackNavLabel"); if (nav) nav.textContent = s.nav;
    const title = $("#feedbackTitle"); if (title) title.textContent = s.title;
    const barTitle = $("#feedbackBarTitle"); if (barTitle) barTitle.textContent = s.title;
    const intro = $("#feedbackIntro"); if (intro) intro.textContent = s.intro;
    const priv = $("#feedbackPrivacy"); if (priv) priv.textContent = s.privacy;
    const open = $("#feedbackOpen");
    if (open) open.querySelectorAll("span")[1].textContent = s.open;
    const langBtn = ensureLangBtn();
    const host = $("#feedbackBody");
    if (!host) return;
    host.innerHTML = "";
    const avail = available();
    const needPick = avail.length > 1 && !availCodes().includes(formLang);
    if (!avail.length || needPick) {
      if (open) open.classList.add("hidden");
      if (langBtn) langBtn.classList.add("hidden");
      const d = document.createElement("div");
      d.className = "feedback-empty";
      const i = document.createElement("span");
      i.className = "material-icons";
      i.textContent = avail.length ? "translate" : "hourglass_bottom";
      const h = document.createElement("h3");
      h.textContent = avail.length ? s.langTitle : s.noFormTitle;
      const p = document.createElement("p");
      p.textContent = avail.length ? s.langHint : s.noFormText;
      d.append(i, h, p);
      if (avail.length) langButtons(d, pickLang);
      host.appendChild(d);
      return;
    }
    const code = currentCode();
    if (open) {
      open.classList.remove("hidden");
      open.onclick = () => window.open(formUrl(code, false), "_blank", "noopener");
    }
    if (langBtn) langBtn.classList.toggle("hidden", avail.length < 2);
    const f = document.createElement("iframe");
    f.src = formUrl(code, true);
    f.className = "feedback-frame";
    f.title = "Google Forms";
    f.loading = "lazy";
    host.appendChild(f);
  }

  function init() {
    if (!$("#feedbackBody")) return;
    render();
    document.addEventListener("langchange", render);
    document.addEventListener("click", (e) => {
      const b = e.target.closest('[data-route="feedback"], [data-goto="feedback"]');
      if (b && available().length > 1 && !availCodes().includes(formLang)) setTimeout(askLang, 60);
    });
  }

  document.addEventListener("DOMContentLoaded", init);
  global.Feedback = {
    init,
    setFormUrl: (u, lang) => { FORM_URLS[lang || "uk"] = (u || "").trim(); render(); }
  };
})(window);
