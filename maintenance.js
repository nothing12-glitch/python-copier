/* maintenance.js v2 — ПОВНОЕКРАННЕ вікно «Технічні роботи» (10–15 днів).
   Показується при кожному відкритті сайту, поки не мине END.
   Кнопка «Зрозуміло» ховає заставку до наступного оновлення сторінки.
   Після дати END — усе вимикається саме. */
(function (global) {
  const START = new Date("2026-10-03T00:00:00");
  const DAYS = 15;
  const END = new Date(START.getTime() + DAYS * 86400000);

  const L = {
    uk: { title: "Технічні роботи", text: "Сайт оновлюється: ми чинимо, покращуємо та додаємо нове. У цей час можливі перебої в роботі окремих функцій. Роботи триватимуть 10–15 днів.", period: "Період робіт:", left: "Залишилось днів:", ok: "Зрозуміло, перейти до сайту", badge: "🛠 Технічні роботи", sorry: "Дякуємо за терпіння! 💙💛" },
    en: { title: "Maintenance in progress", text: "The site is being upgraded: fixing, improving and adding new things. Some features may be unstable meanwhile. Works will last 10–15 days.", period: "Period:", left: "Days left:", ok: "Got it, go to the site", badge: "🛠 Maintenance", sorry: "Thanks for your patience! 💙💛" },
    tr: { title: "Teknik bakım sürüyor", text: "Site güncelleniyor: onarıyor, iyileştiriyor ve yenilikler ekliyoruz. Bu sırada bazı özellikler kararsız çalışabilir. Çalışmalar 10–15 gün sürecek.", period: "Dönem:", left: "Kalan gün:", ok: "Anladım, siteye geç", badge: "🛠 Bakım", sorry: "Sabrınız için teşekkürler! 💙💛" }
  };
  const lang = () => (global.I18n ? global.I18n.lang : "uk");
  const t = () => L[lang()] || L.uk;
  const fmt = (d) => d.toLocaleDateString(lang() === "uk" ? "uk-UA" : lang() === "tr" ? "tr-TR" : "en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });
  const daysLeft = () => Math.max(0, Math.ceil((END - Date.now()) / 86400000));
  const progress = () => Math.min(100, Math.max(0, Math.round(((Date.now() - START) / (END - START)) * 100)));

  const css = `
.mnt-full{position:fixed;inset:0;z-index:400;display:grid;place-items:center;padding:24px;overflow:auto;
  background:radial-gradient(60% 60% at 20% 10%,rgba(103,80,164,.35),transparent 60%),
             radial-gradient(50% 50% at 85% 85%,rgba(34,211,238,.25),transparent 60%),
             linear-gradient(135deg,#0f0c29,#302b63 55%,#24243e);
  animation:mntin .3s ease}
@keyframes mntin{from{opacity:0}to{opacity:1}}
.mnt-wrap{max-width:640px;width:100%;text-align:center;color:#f2f0f7;font-family:var(--md-font,system-ui,sans-serif)}
.mnt-ico{font-size:84px;line-height:1;margin-bottom:14px;animation:mntspin 3s ease-in-out infinite}
@keyframes mntspin{0%,100%{transform:rotate(-8deg) scale(1)}50%{transform:rotate(8deg) scale(1.08)}}
.mnt-wrap h1{margin:0 0 12px;font-size:clamp(26px,5vw,40px);font-weight:700;letter-spacing:.3px}
.mnt-wrap p{margin:0 auto 18px;max-width:520px;font-size:15px;line-height:1.7;color:#cfcbe0}
.mnt-dates{display:inline-flex;flex-direction:column;gap:6px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.15);border-radius:16px;padding:12px 20px;margin:0 0 18px;font-size:14px;color:#e6e2f2;backdrop-filter:blur(6px)}
.mnt-dates b{color:#9ef0c0}
.mnt-bar{height:10px;border-radius:5px;background:rgba(255,255,255,.12);overflow:hidden;margin:0 auto 8px;max-width:420px}
.mnt-bar i{display:block;height:100%;border-radius:5px;background:linear-gradient(90deg,#6750A4,#22d3ee);transition:width .8s ease}
.mnt-left{font-size:13px;color:#b9b4cc;margin:0 0 22px}
.mnt-ok{border:0;cursor:pointer;font-family:inherit;font-size:16px;font-weight:600;padding:14px 32px;border-radius:999px;background:#9ef0c0;color:#0c2b1a;box-shadow:0 10px 30px rgba(158,240,192,.35);transition:transform .15s,box-shadow .15s}
.mnt-ok:hover{transform:translateY(-2px);box-shadow:0 14px 36px rgba(158,240,192,.45)}
.mnt-badge{position:fixed;top:72px;right:12px;z-index:390;border:0;cursor:pointer;font-family:inherit;font-size:12px;font-weight:600;padding:8px 12px;border-radius:999px;background:var(--md-primary,#6750A4);color:var(--md-on-primary,#fff);box-shadow:0 6px 18px rgba(0,0,0,.3)}
`;

  function injectStyle() {
    if (document.getElementById("mntCss")) return;
    const s = document.createElement("style");
    s.id = "mntCss";
    s.textContent = css;
    document.head.appendChild(s);
  }

  let badge = null;
  function makeBadge() {
    if (badge) return badge;
    badge = document.createElement("button");
    badge.className = "mnt-badge";
    badge.textContent = t().badge;
    badge.onclick = openFull;
    document.body.appendChild(badge);
    return badge;
  }

  function openFull() {
    if (document.querySelector(".mnt-full")) return;
    const T = t();
    const wrap = document.createElement("div");
    wrap.className = "mnt-full";
    wrap.innerHTML =
      '<div class="mnt-wrap">' +
      '<div class="mnt-ico">🛠️</div>' +
      "<h1>" + T.title + "</h1>" +
      "<p>" + T.text + "</p>" +
      '<div class="mnt-dates"><span>' + T.period + ' <b>' + fmt(START) + " — " + fmt(END) + "</b></span></div>" +
      '<div class="mnt-bar"><i style="width:' + progress() + '%"></i></div>' +
      '<p class="mnt-left">' + T.left + " <b>" + daysLeft() + "</b> &nbsp;·&nbsp; " + T.sorry + "</p>" +
      '<button class="mnt-ok" type="button">' + T.ok + "</button>" +
      "</div>";
    wrap.querySelector(".mnt-ok").onclick = () => wrap.remove();
    document.body.appendChild(wrap);
  }

  function init() {
    if (Date.now() > END.getTime()) return; // строк минув — нічого не показуємо
    injectStyle();
    makeBadge();
    openFull(); // повноекранна заставка при кожному відкритті
    document.addEventListener("langchange", () => {
      if (badge) badge.textContent = t().badge;
      const open = document.querySelector(".mnt-full");
      if (open) { open.remove(); openFull(); }
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})(window);
