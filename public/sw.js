// Lokey service worker.
//
// Deliberately tiny. Its whole job is to make the app installable and to keep
// the two pages openable when the network drops — not to be an offline music
// player, which it cannot be: the audio comes from YouTube's iframe and the
// backdrops are hotlinked from Pixabay.
//
// It therefore refuses to touch anything cross-origin. Caching a pool of
// multi-megabyte background videos would fill a user's storage quota to
// deliver a page that still has no sound.

const CACHE = "lokey-v1";
const SHELL = ["/", "/forecast"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(SHELL))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") return;
  // Pixabay video and YouTube's player go straight to the network, always.
  if (new URL(request.url).origin !== self.location.origin) return;
  // Pages only. Next's hashed assets are immutable and already cached by the
  // browser; putting them in here would just be a second, staler copy.
  if (request.mode !== "navigate") return;

  event.respondWith(
    fetch(request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE).then((cache) => cache.put(request, copy));
        return response;
      })
      .catch(() => caches.match(request).then((cached) => cached || caches.match("/"))),
  );
});
