/* pwa.js — кнопка «Встановити застосунок» через beforeinstallprompt. */
(function (global) {
  let deferredPrompt = null;

  const T = {
    install: { uk: "Встановити як застосунок", en: "Install as app", tr: "Uygulama olarak kur" },
    installed: { uk: "Застосунок встановлено!", en: "App installed!", tr: "Uygulama kuruldu!" },
    notSupported: { uk: "Встановлення не підтримується в цьому браузері", en: "Installation not supported in this browser", tr: "Bu tarayıcıda kurulum desteklenmiyor" }
  };

  const lang = () => (global.I18n ? global.I18n.lang : "uk");
  const pick = (o) => o[lang()] || o.uk || o.en;

  function toast(msg) {
    if (global.App && global.App.toast) {
      global.App.toast(msg);
    }
  }

  function createInstallButton() {
    const btn = document.createElement("button");
    btn.id = "pwaInstallBtn";
    btn.className = "btn contained pwa-install-btn";
    btn.innerHTML = '<span class="material-icons">download</span><span>' + pick(T.install) + "</span>";
    btn.style.display = "none";

    btn.onclick = async () => {
      if (!deferredPrompt) {
        toast(pick(T.notSupported));
        return;
      }
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        toast(pick(T.installed));
      }
      deferredPrompt = null;
      btn.style.display = "none";
    };

    return btn;
  }

  function showInstallButton() {
    const hero = document.querySelector(".hero-cta");
    if (!hero || document.getElementById("pwaInstallBtn")) return;

    const btn = createInstallButton();
    hero.appendChild(btn);
    btn.style.display = "";
  }

  function hideInstallButton() {
    const btn = document.getElementById("pwaInstallBtn");
    if (btn) btn.style.display = "none";
  }

  function init() {
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      deferredPrompt = e;
      showInstallButton();
    });

    window.addEventListener("appinstalled", () => {
      deferredPrompt = null;
      hideInstallButton();
      toast(pick(T.installed));
    });

    document.addEventListener("langchange", () => {
      const btn = document.getElementById("pwaInstallBtn");
      if (btn) {
        const span = btn.querySelector("span:last-child");
        if (span) span.textContent = pick(T.install);
      }
    });

    if (deferredPrompt) {
      showInstallButton();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  global.PWA = { init, showInstallButton, hideInstallButton };
})(window);
