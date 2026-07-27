const CACHE_NAME = 'tales-adria-next-s87';
const APP_SHELL = ['./', './index.html', './manifest.webmanifest', './icon.svg'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key.startsWith('tales-adria-next-') && key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin) return;

  if (event.request.mode === 'navigate') {
    event.respondWith(networkFirst(event.request, './index.html'));
    return;
  }

  const destination = event.request.destination;
  if (destination === 'script' || destination === 'style' || event.request.url.includes('/assets/')) {
    event.respondWith(networkFirst(event.request));
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const network = fetch(event.request).then((response) => {
        if (response.ok) void putInCache(event.request, response.clone());
        return response;
      });
      return cached || network;
    }),
  );
});

async function networkFirst(request, fallbackPath) {
  try {
    const response = await fetch(request, { cache: 'no-store' });
    if (response.ok) await putInCache(request, response.clone());
    return response;
  } catch {
    return (await caches.match(request)) || (fallbackPath ? caches.match(fallbackPath) : Response.error());
  }
}

async function putInCache(request, response) {
  const cache = await caches.open(CACHE_NAME);
  await cache.put(request, response);
}
