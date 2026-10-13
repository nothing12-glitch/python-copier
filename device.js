/* device.js — при КОЖНОМУ вході питає, з якого пристрою зайшли,
   і вмикає відповідний дизайн панелі: ПК/планшет -> класика, телефон -> пігулка.
   Відповідь навмисно не зберігається: питання знову з'явиться наступного разу. */
(function (global) {
  const STR = {
    uk: { q: "З якого пристрою ви заходите?", hint: "Обери, щоб інтерфейс підлаштувався під тебе.", pc: "ПК / планшет", phone: "Телефон" },
    en: { q: "Which device are you using?", hint: "Pick one so the interface fits you.", pc: "PC / tablet", phone: "Phone" },
    tr: { q: "Hangi cihazdan giriyorsunuz?", hint: "Arayüzün sana uyması için birini seç.", pc: "PC / tablet", phone: "Telefon" }
  };
  const L = () => STR[global.I18n ? global.I18n.lang : "uk"] || STR.uk;

  function opt(icon, label, design, close) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "device-opt";
    const i = document.createElement("span");
    i.className = "material-icons";
    i.textContent = icon;
    const t = document.createElement("span");
    t.textContent = label;
    b.append(i, t);
    b.onclick = () => {
      if (global.Settings) global.Settings.set("navDesign", design);
      if (global.Audio2 && global.Audio2.SFX) global.Audio2.SFX.pop();
      close();
    };
    return b;
  }

  function ask() {
    if (document.getElementById("deviceAsk")) return;
    const s = L();
    const wrap = document.createElement("div");
    wrap.id = "deviceAsk";
    wrap.className = "device-ask";
    wrap.setAttribute("role", "dialog");
    wrap.setAttribute("aria-modal", "true");

    const card = document.createElement("div");
    card.className = "device-card";
    const h = document.createElement("h3");
    h.textContent = s.q;
    const p = document.createElement("p");
    p.textContent = s.hint;
    const opts = document.createElement("div");
    opts.className = "device-opts";
    opts.append(
      opt("desktop_windows", s.pc, "classic", () => wrap.remove()),
      opt("smartphone", s.phone, "pill", () => wrap.remove())
    );
    card.append(h, p, opts);
    wrap.appendChild(card);
    document.body.appendChild(wrap);
  }

  function init() { ask(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})(window);
