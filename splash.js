/* splash.js — 5-секундний екран завантаження.
   Ховає момент, поки застосунок довантажує шрифти й застосовує збережені
   налаштування (без нього на секунду мелькає класичний інтерфейс).
   Після сплешу влаштовується черга вікон: «з якого пристрою» → «Що нового». */
(function (global) {
  const MS = 5000;
  const el = document.getElementById("splash");
  let markDone;
  const done = new Promise((r) => { markDone = r; });

  function hide() {
    if (!el || el.classList.contains("pc-hide")) return;
    el.classList.add("pc-hide");
    setTimeout(() => el.remove(), 500);
    markDone();
  }

  global.Splash = { done, hide, after: (fn) => done.then(fn) };

  if (!el) { markDone(); return; }

  const tag = document.getElementById("splashTag");
  if (tag && global.I18n) tag.textContent = global.I18n.t("home.heroTitle");
  const fill = document.getElementById("splashBarFill");
  if (fill) fill.style.animationDuration = MS + "ms";

  setTimeout(hide, MS);
})(window);
