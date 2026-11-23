const CACHE = "lemonsqueezy-static-v2.3.45-structured";
const CORE = [
  "./",
  "./index.html",
  "./recipes.html",
  "./recipe.html",
  "./css/style.css",
  "./js/app/app.js",
  "./js/config/firebase.js",
  "./assets/images/lemonade-logo.png",
  "./assets/images/hero-breakfast.jpg",
];
self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);
      await Promise.allSettled(
        CORE.map(async (url) => {
          const response = await fetch(url, { cache: "reload" });
          if (response.ok) await cache.put(url, response);
        }),
      );
      await self.skipWaiting();
    })(),
  );
});
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((k) => k.startsWith("lemonsqueezy-static-") && k !== CACHE)
          .map((k) => caches.delete(k)),
      );
      await self.clients.claim();
    })(),
  );
});
self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (
    request.method !== "GET" ||
    new URL(request.url).origin !== self.location.origin
  )
    return;
  const url = new URL(request.url);
  if (url.pathname.endsWith("/sw.js")) return;
  // Never intercept Firebase, auth, remote images, or API requests.
  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const response = await fetch(request);
          if (response.ok) {
            const cache = await caches.open(CACHE);
            await cache.put(request, response.clone());
          }
          return response;
        } catch (_) {
          return (await caches.match(request)) || Response.error();
        }
      })(),
    );
    return;
  }
  if (!/\.(?:css|js|png|jpg|jpeg|webp|svg|ico|woff2?)$/i.test(url.pathname))
    return;
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE);
      const cached = await cache.match(request);
      const refresh = fetch(request)
        .then(async (response) => {
          if (response.ok) await cache.put(request, response.clone());
          return response;
        })
        .catch(() => null);
      if (cached) {
        event.waitUntil(refresh);
        return cached;
      }
      return (await refresh) || Response.error();
    })(),
  );
});
