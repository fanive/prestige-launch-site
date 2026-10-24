// PRESTIGE service worker: keeps the application shell usable offline.
// Market data (PrestigeAPI, Supabase) is never cached here: offline, a
// figure shows as unavailable instead of an old value presented as current.
const VERSION = "prestige-shell-v2";
const SHELL = ["/", "/en/", "/marches/", "/en/markets/", "/titre/", "/en/security/", "/compte/", "/en/account/", "/manifest.webmanifest", "/assets/brand/icon-192.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(VERSION).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== VERSION).map((key) => caches.delete(key)))).then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // data stays live, never from this cache

  // Pages: the network first, the cached shell when offline.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(VERSION).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request).then((hit) => hit || caches.match(url.pathname.startsWith("/en/") ? "/en/" : "/"))),
    );
    return;
  }

  // Built files are fingerprinted: once fetched, they never change.
  if (url.pathname.startsWith("/_next/static/") || url.pathname.startsWith("/assets/") || url.pathname.endsWith(".woff2") || url.pathname.endsWith(".ttf")) {
    event.respondWith(
      caches.match(request).then(
        (hit) =>
          hit ||
          fetch(request).then((response) => {
            const copy = response.clone();
            caches.open(VERSION).then((cache) => cache.put(request, copy));
            return response;
          }),
      ),
    );
  }
});
