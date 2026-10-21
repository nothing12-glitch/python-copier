/* pwa.js — кнопка «Встановити застосунок» через beforeinstallprompt. */
(function (global) {
  let deferredPrompt = null;
  let installAttempted = false;

  const T = {
    install: { uk: "Встановити як застосунок", en: "Install as app", tr: "Uygulama olarak kur" },
    installed: { uk: "Застосунок встановлено!", en: "App installed!", tr: "Uygulama kuruldu!" },
    manualInstall: {
      uk: "Натисни «⋮» або «Поділитися» → «Встановити застосунок»",
      en: "Click «» or «Share» → «Install app»",
      tr: "«⋮» veya «Paylaş» → «Uygulamayı yükle»"
    }
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
    btn.className = "btn contained";
    btn.style.marginTop = "10px";
    btn.innerHTML = '<span class="material-icons">download</span><span>' + pick(T.install) + "</span>";

    btn.onclick = async () => {
      if (deferredPrompt && !installAttempted) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === "accepted") {
          toast(pick(T.installed));
        }
        installAttempted = true;
      } else {
        toast(pick(T.manualInstall));
      }
    };

    return btn;
  }

  function addInstallButtonToSettings() {
    const aboutCard = document.querySelector(".about-card");
    if (!aboutCard || document.getElementById("pwaInstallBtn")) return;

    const btn = createInstallButton();
    aboutCard.appendChild(btn);
  }

  function init() {
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      deferredPrompt = e;
      addInstallButtonToSettings();
    });

    window.addEventListener("appinstalled", () => {
      deferredPrompt = null;
      const btn = document.getElementById("pwaInstallBtn");
      if (btn) btn.remove();
      toast(pick(T.installed));
    });

    document.addEventListener("langchange", () => {
      const btn = document.getElementById("pwaInstallBtn");
      if (btn) {
        const span = btn.querySelector("span:last-child");
        if (span) span.textContent = pick(T.install);
      }
    });

    addInstallButtonToSettings();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  global.PWA = { init, addInstallButtonToSettings };
})(window);
