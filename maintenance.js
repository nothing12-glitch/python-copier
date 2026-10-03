/* maintenance.js — вікно «Технічні роботи» на 10–15 днів.
   Сам вставляє стилі, показує модалку 1 раз на день, вішає бейдж.
   Після дати END — повністю сам вимикається. */
(function (global) {
  const START = new Date("2026-10-03T00:00:00");
  const DAYS = 15; // період 10–15 днів: показуємо до кінця
  const END = new Date(START.getTime() + DAYS * 86400000);
  const KEY = "app.maintenanceSeen";

  const L = {
    uk: { title: "Технічні роботи", text: "Сайт оновлюється: ми чинимо, покращуємо та додаємо нове. У цей час можливі перебої в роботі окремих функцій. Роботи триватимуть 10–15 днів.", period: "Період:", left: "Залишилось днів:", ok: "Зрозуміло", badge: "🛠 Технічні роботи", sorry: "Дякуємо за терпіння! 💙💛" },
    en: { title: "Maintenance in progress", text: "The site is being upgraded: fixing, improving and adding new things. Some features may be unstable meanwhile. Works will last 10–15 days.", period: "Period:", left: "Days left:", ok: "Got it", badge: "🛠 Maintenance", sorry: "Thanks for your patience! 💙💛" },
    tr: { title: "Teknik bakım sürüyor", text: "Site güncelleniyor: onarıyor, iyileştiriyor ve yenilikler ekliyoruz. Bu sırada bazı özellikler kararsız çalışabilir. Çalışmalar 10–15 gün sürecek.", period: "Dönem:", left: "Kalan gün:", ok: "Anladım", badge: "🛠 Bakım", sorry: "Sabrınız için teşekkürler! 💙💛" }
  };
  const lang = () => (global.I18n ? global.I18n.lang : "uk");
  const t = () => L[lang()] || L.uk;
  const fmt = (d) => d.toLocaleDateString(lang() === "uk" ? "uk-UA" : lang() === "tr" ? "tr-TR" : "en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });
  const daysLeft = () => Math.max(0, Math.ceil((END - Date.now()) / 86400000));
  const progress = () => Math.min(100, Math.max(0, Math.round(((Date.now() - START) / (END - START)) * 100)));

  const css = `
.mnt-backdrop{position:fixed;inset:0;z-index:300;background:rgba(0,0,0,.55);display:grid;place-items:center;padding:16px;animation:mntin .25s ease}
@keyframes mntin{from{opacity:0}to{opacity:1}}
.mnt-card{max-width:460px;width:100%;background:var(--md-surface,#fff);color:var(--md-on-surface,#111);border-radius:24px;padding:28px 24px;text-align:center;box-shadow:0 24px 64px rgba(0,0,0,.4)}
.mnt-ico{font-size:56px;line-height:1;margin-bottom:10px}
.mnt-card h3{margin:0 0 10px;font-size:22px;font-weight:600}
.mnt-card p{margin:0 0 14px;color:var(--md-on-surface-var,#555);font-size:14px;line-height:1.6}
.mnt-dates{font-size:13px;background:var(--md-surface-dim,#eee);border-radius:12px;padding:10px 12px;margin:0 0 12px;display:flex;flex-direction:column;gap:4px;color:var(--md-on-surface-var,#555)}
.mnt-bar{height:8px;border-radius:4px;background:var(--md-surface-dim,#eee);overflow:hidden;margin:0 0 8px}
.mnt-bar i{display:block;height:100%;background:var(--md-primary,#6750A4);border-radius:4px;transition:width .6s ease}
.mnt-left{font-size:12px;color:var(--md-on-surface-var,#555);margin:0 0 16px}
.mnt-badge{position:fixed;top:72px;right:12px;z-index:290;border:0;cursor:pointer;font-family:inherit;font-size:12px;font-weight:600;padding:8px 12px;border-radius:999px;background:var(--md-primary,#6750A4);color:var(--md-on-primary,#fff);box-shadow:0 6px 18px rgba(0,0,0,.3)}
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
    badge.onclick = () => openModal();
    document.body.appendChild(badge);
    return badge;
  }

  function openModal() {
    if (document.querySelector(".mnt-backdrop")) return;
    const T = t();
    const bd = document.createElement("div");
    bd.className = "mnt-backdrop";
    const card = document.createElement("div");
    card.className = "mnt-card";
    card.innerHTML =
      '<div class="mnt-ico">🛠️</div>' +
      "<h3>" + T.title + "</h3>" +
      "<p>" + T.text + "</p>" +
      '<div class="mnt-dates"><span>' + T.period + " <b>" + fmt(START) + " — " + fmt(END) + '</b></span></div>' +
      '<div class="mnt-bar"><i style="width:' + progress() + '%"></i></div>' +
      '<p class="mnt-left">' + T.left + " <b>" + daysLeft() + "</b> · " + T.sorry + "</p>";
    const ok = document.createElement("button");
    ok.className = "btn contained";
    ok.textContent = T.ok;
    ok.onclick = () => bd.remove();
    card.appendChild(ok);
    bd.appendChild(card);
    bd.onclick = (e) => { if (e.target === bd) bd.remove(); };
    document.body.appendChild(bd);
  }

  function init() {
    if (Date.now() > END.getTime()) return; // строк минув — нічого не показуємо
    injectStyle();
    makeBadge();
    const today = new Date().toDateString();
    let seen = "";
    try { seen = localStorage.getItem(KEY) || ""; } catch (e) {}
    if (seen !== today) {
      try { localStorage.setItem(KEY, today); } catch (e) {}
      setTimeout(openModal, 400);
    }
    document.addEventListener("langchange", () => { if (badge) badge.textContent = t().badge; });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})(window);
