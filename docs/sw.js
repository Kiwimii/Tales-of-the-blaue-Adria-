const CACHE_NAME = 'tales-blaue-adria-v29';
const APP_SHELL = [
  './?v=29',
  './index.html?v=29',
  './manifest.webmanifest?v=29',
  './icon.svg',
  './styles.css?v=29',
  './styles-v13.css?v=29',
  './ux-v15.css?v=29',
  './design-v23.css?v=29',
  './design-faces-v23.css?v=29',
  './expansion-v25.css?v=29',
  './expansion-v28.css?v=29',
  './content-v13.js?v=29',
  './map-v13.js?v=29',
  './prelude-v13.js?v=29',
  './engine-v13.js?v=29',
  './bridge-v13.js?v=29',
  './world-v13.js?v=29',
  './activities-v13.js?v=29',
  './hotfix-v13.js?v=29',
  './ux-v15.js?v=29',
  './ux-runtime-v15.js?v=29',
  './design-core-v23.js?v=29',
  './design-world-v23.js?v=29',
  './design-characters-v23.js?v=29',
  './design-battle-v23.js?v=29',
  './design-minigames-v23.js?v=29',
  './design-atmosphere-v23.js?v=29',
  './design-runtime-v23.js?v=29',
  './expansion-v25.js?v=29',
  './expansion-v28.js?v=29',
  './popup-policy-v29.js?v=29',
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin) return;

  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(() => caches.match('./index.html?v=29')),
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const network = fetch(event.request).then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return response;
      });
      return cached ?? network;
    }),
  );
});
