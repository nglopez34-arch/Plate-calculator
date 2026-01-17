const CACHE_NAME = 'plate-calculator-v1';
const urlsToCache = [
  '/Plate-calculator/',
  '/Plate-calculator/index.html',
  '/Plate-calculator/styles.css',
  '/Plate-calculator/app.js',
  '/Plate-calculator/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
