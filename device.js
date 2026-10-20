/* device.js — автоматичне визначення пристрою БЕЗ діалогу.
   Застосовує дизайн навігації мовчки при кожному вході:
   телефон -> «пігулка», ПК/планшет -> класична панель. */
(function (global) {
  function mq(q) {
    try { return !!(global.matchMedia && global.matchMedia(q).matches); }
    catch (e) { return false; }
  }

  /* Авто-визначення: «phone» або «pc» (планшет рахуємо як ПК) */
  function detect() {
    const nav = global.navigator || {};
    const ua = nav.userAgent || "";
    const maxTP = nav.maxTouchPoints || 0;
    const coarse = mq("(pointer: coarse)");
    const fine = mq("(pointer: fine)");

    const tabletUA = /iPad|Tablet|PlayBook|Silk/i.test(ua) ||
                     (/Android/i.test(ua) && !/Mobile/i.test(ua));
    const ipadOS = /Macintosh/i.test(ua) && maxTP > 1;   // iPadOS 13+ прикидається Маком
    if (tabletUA || ipadOS) return "pc";

    const phoneUA = /iPhone|iPod|Windows Phone|IEMobile|BlackBerry|webOS|Opera Mini/i.test(ua) ||
                    (/Android/i.test(ua) && /Mobile/i.test(ua));
    if (phoneUA) return "phone";

    if (coarse && !fine) return "phone";   // лише дотик, без миші -> телефон
    return "pc";
  }

  function applyDesign(kind) {
    if (!global.Settings) return;
    global.Settings.set("navDesign", kind === "phone" ? "pill" : "classic");
  }

  function init() {
    applyDesign(detect());
  }

  global.Device = { detect: detect, apply: applyDesign };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})(window);
