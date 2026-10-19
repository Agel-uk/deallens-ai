
// DealLens AI — Service Worker
// Cache only successful same-origin GET responses.

const CACHE = 'deallens-v9-20261019';

const ASSETS = [
  './',
  './index.html',
  './amazon.html',
  './us-shopping.html',
  './ownership-cost.html',
  './ownership-cost.js',
  './ownership-core.js',
  './analytics.js',
  './markets.html',
  './about.html',
  './styles.css',
  './app.js',
  './affiliate-config.js',
  './privacy.html',
  './terms.html'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(key => key.startsWith('deallens-') && key !== CACHE)
          .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;

  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Do not intercept external services or other site paths.
  if (url.origin !== self.location.origin) return;
  if (!url.pathname.startsWith('/deallens-ai/')) return;

  // Always request fresh HTML navigation when online.
  // Never cache sitemap.xml or robots.txt.
  if (url.pathname.endsWith('/sitemap.xml') ||
      url.pathname.endsWith('/robots.txt')) return;

  event.respondWith(
    fetch(request)
      .then(response => {
        if (response.ok && response.type === 'basic') {
          const copy = response.clone();

          event.waitUntil(
            caches.open(CACHE)
              .then(cache => cache.put(request, copy))
          );
        }

        return response;
      })
      .catch(async () => {
        const cached = await caches.match(request);

        if (cached) return cached;

        return Response.error();
      })
  );
});
