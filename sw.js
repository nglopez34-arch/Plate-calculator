const CACHE_NAME = 'plate-calculator-v2';
const urlsToCache = [
  '/Plate-calculator/',
  '/Plate-calculator/index.html',
  '/Plate-calculator/styles.css',
  '/Plate-calculator/app.js',
  '/Plate-calculator/manifest.json',
  '/Plate-calculator/icon-192.png',
  '/Plate-calculator/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache).catch(err => {
          console.log('Cache failed for some resources:', err);
        });
      })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
      .catch(() => {
        return caches.match('/Plate-calculator/index.html');
      })
  );
});
