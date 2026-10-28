/* sw.js — Service Worker для офлайн-доступу.
   При зміні версії сайту піднімай CACHE_VERSION, щоб очистити старий кеш. */
const CACHE_VERSION = "pc-v34";

const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/style.css",
  "/newui.css",
  "/extra.css",
  "/mobile.css",
  "/i18n.js",
  "/splash.js",
  "/audio.js",
  "/profile.js",
  "/avatar.js",
  "/achievements.js",
  "/settings.js",
  "/python.js",
  "/tasks.js",
  "/contest.js",
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
  "/device.js",
  "/update.js",
  "/pwa.js",
  "/gamerules.js",
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
