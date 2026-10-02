/* Секретка: привітання з днем учителя Олексію Олександровичу.
   Тригер 1: Ctrl+Shift+T
   Тригер 2: утримати логотип у appbar 5 секунд */
(function (global) {
  const KEY = "app.teacherShown";
  let holdTimer = null;

  const SL = {
    uk: { title: "З Днем учителя!", to: "Шановному Олексію Олександровичу",
      text: "Дякуємо за знання, терпіння та віру в кожного з нас. Ваші уроки — не лише про код, а про те, як мислити. Ви надихнули нас творити — і ця сторінка є доказом того, що з вашого зерна виростає справжня справа.",
      wish: "Нехай кожен ваш день буде сповнений радості, вдячних учнів і нових ідей. Здоров'я, миру і натхнення! 💙💛",
      sig: "— з повагою і вдячністю", close: "Дякую, закрити", hint: "Секретний подарунок розблоковано! 🌹" },
    en: { title: "Happy Teacher's Day!", to: "To dear Oleksii Oleksandrovych",
      text: "Thank you for your knowledge, patience, and belief in each of us. Your lessons are not only about code — they are about how to think.",
      wish: "May every one of your days be filled with joy, grateful students, and new ideas. Health, peace, and inspiration! 💙💛",
      sig: "— with respect and gratitude", close: "Thank you, close", hint: "Secret gift unlocked! 🌹" },
    tr: { title: "Öğretmenler Günü Kutlu Olsun!", to: "Saygıdeğer Oleksii Oleksandrovych'e",
      text: "Bilginiz, sabrınız ve inancınız için teşekkürler. Dersleriniz yalnızca kodu değil, nasıl düşünmemiz gerektiğini öğretti.",
      wish: "Her gününüz neşe, minnettar öğrenciler ve yeni fikirlerle dolsun. Sağlık, barış ve ilham! 💙💛",
      sig: "— saygı ve minnettarlıkla", close: "Teşekkürler, kapat", hint: "Gizli hediye açıldı! 🌹" },
    de: { title: "Alles Gute zum Lehrertag!", to: "An den verehrten Oleksij Oleksandrowytsch", text: "Danke für Ihr Wissen und Ihre Geduld.", wish: "Gesundheit, Frieden und Inspiration! 💙💛", sig: "— mit Respekt", close: "Schließen", hint: "Geheimnis freigeschaltet! 🌹" },
    pl: { title: "Z okazji Dnia Nauczyciela!", to: "Szanownemu Ołeksijowi Ołeksandrowyczowi", text: "Dziękujemy za wiedzę i cierpliwość.", wish: "Zdrowia, pokoju i inspiracji! 💙💛", sig: "— z szacunkiem", close: "Zamknij", hint: "Sekretny prezent! 🌹" },
    es: { title: "¡Feliz Día del Maestro!", to: "Al estimado Oleksii Oleksandrovych", text: "Gracias por su conocimiento y paciencia.", wish: "Salud, paz e inspiración. 💙💛", sig: "— con respeto", close: "Cerrar", hint: "¡Regalo secreto! 🌹" },
    fr: { title: "Bonne Fête des Enseignants !", to: "Au cher Oleksii Oleksandrovitch", text: "Merci pour votre savoir et votre patience.", wish: "Santé, paix et inspiration. 💙💛", sig: "— avec respect", close: "Fermer", hint: "Cadeau secret ! 🌹" },
    ja: { title: "教師の日おめでとう！", to: "オレクシー・オレクサンドロヴィチ先生へ", text: "知識と忍耐をありがとうございます。", wish: "健康と平和とインスピレーションを！ 💙💛", sig: "— 感謝を込めて", close: "閉じる", hint: "秘密のプレゼント！ 🌹" }
  };
  const T = () => SL[global.I18n ? global.I18n.lang : "uk"] || SL.uk;

  function open() {
    const el = document.getElementById("teacherGreet");
    if (!el) return;
    if (el.classList.contains("show")) return;
    localStorage.setItem(KEY, "1");
    el.classList.add("show");
    const colors = ["#6750A4","#22d3ee","#f0b429","#FFD700","#C2185B","#2E7D32"];
    for (let i = 0; i < 60; i++) {
      const c = document.createElement("div");
      c.className = "confetti";
      c.style.left = Math.random() * 100 + "%";
      c.style.background = colors[Math.floor(Math.random()*colors.length)];
      c.style.animationDelay = (Math.random() * 2) + "s";
      c.style.transform = `rotate(${Math.random()*360}deg)`;
      el.appendChild(c);
      setTimeout(() => c.remove(), 5000);
    }
    global.Audio2 && global.Audio2.SFX && global.Audio2.SFX.win();
    global.App && global.App.toast && global.App.toast(T().hint);
  }
  function close() {
    const el = document.getElementById("teacherGreet");
    if (el) el.classList.remove("show");
  }

  function init() {
    document.getElementById("teacherClose")?.addEventListener("click", close);
    document.getElementById("teacherGreet")?.addEventListener("click", (e) => {
      if (e.target.id === "teacherGreet") close();
    });
    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "t") { e.preventDefault(); open(); }
      if (e.key === "Escape") close();
    });

    const logo = document.querySelector(".appbar-logo");
    if (logo) {
      const start = () => { holdTimer = setTimeout(open, 5000); };
      const cancel = () => { if (holdTimer) { clearTimeout(holdTimer); holdTimer = null; } };
      logo.addEventListener("mousedown", start);
      logo.addEventListener("touchstart", start, { passive: true });
      logo.addEventListener("mouseup", cancel);
      logo.addEventListener("mouseleave", cancel);
      logo.addEventListener("touchend", cancel);
      logo.addEventListener("touchcancel", cancel);
    }
  }

  document.addEventListener("DOMContentLoaded", init);
  global.TeacherSecret = { open, close };
})(window);
