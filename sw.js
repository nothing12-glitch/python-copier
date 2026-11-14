/* sw.js — Service Worker для офлайн-доступу.
   При зміні версії сайту піднімай CACHE_VERSION, щоб очистити старий кеш. */
const CACHE_VERSION = "pc-v91";

const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/style.css",
  "/newui.css",
  "/extra.css",
  "/mobile.css",
  "/rtl.css",
  "/pythonchik.css",
  "/pychik-ai.js",
  "/i18n.js",
  "/lang/tr.js",
  "/lang/de.js",
  "/lang/pl.js",
  "/lang/es.js",
  "/lang/fr.js",
  "/lang/it.js",
  "/lang/pt.js",
  "/lang/nl.js",
  "/lang/sv.js",
  "/lang/cs.js",
  "/lang/hu.js",
  "/lang/ro.js",
  "/lang/el.js",
  "/lang/id.js",
  "/lang/hi.js",
  "/lang/zh.js",
  "/lang/ja.js",
  "/lang/ko.js",
  "/lang/ar.js",
  "/lang/he.js",
  "/lang/vi.js",
  "/lang/th.js",
  "/lang/content-en.json",
  "/lang/content-tr.json",
  "/splash.js",
  "/audio.js",
  "/profile.js",
  "/avatar.js",
  "/achievements.js",
  "/settings.js",
  "/installer.js",
  "/pygui.js",
  "/python.js",
  "/tasks.js",
  "/contest.js",
  "/daily.js",
  "/projects.js",
  "/glossary.js",
  "/exam.js",
  "/turtle.js",
  "/constructor.js",
  "/season.js",
  "/dashboard.js",
  "/backup.js",
  "/modules.js",
  "/course.js",
  "/games.js",
  "/tools.js",
  "/feedback.js",
  "/shield.js",
  "/app.js",
  "/onboarding.js",
  "/secret.js",
  "/teacher.js",
  "/fix.js",
  "/ui.js",
  "/device.js",
  "/update.js",
  "/pwa.js",
  "/gamerules.js",
  "/vault.js",
  "/pythonchik.js",
  "/maintenance.js",
  "/favicon.svg",
  "/icon-512.png",
  "/manifest.json",
  "/img/secret-logo.png",
  "/img/secret-nyam.jpg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn("[SW] install: some assets failed to cache", err);
        return cache.add("/index.html");
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  if (url.origin !== location.origin) return;

  if (event.request.method !== "GET") return;

  if (url.pathname.startsWith("/music/")) return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response;
        }

        const responseClone = response.clone();
        caches.open(CACHE_VERSION).then((cache) => {
          cache.put(event.request, responseClone);
        });

        return response;
      }).catch(() => {
        if (event.request.destination === "document") {
          return caches.match("/index.html");
        }
        return new Response("Offline", { status: 503, statusText: "Service Unavailable" });
      });
    })
  );
});
