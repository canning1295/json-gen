const filesToCache = [

  "/firebaseDB.js",
  "/index.html",
   "/options.js",
  "/landing.js",
//   "/libraries/bootstrap.min.css",
//   "/libraries/bootstrap-icons.css",
//   "/libraries/bootstrap.bundle.min.js",
//   "/libraries/jquery.js",
//   "/index.js",
//   "/icons/apple-touch-icon.png",
//   "/icons/favicon.ico",

];

const CACHE_NAME = 'Anki-Generator-v1'; // Increment this version when files are updated

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            // console.log('Opened cache');
            return cache.addAll(filesToCache);
        })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.filter(cacheName => {
                    return cacheName !== CACHE_NAME;
                }).map(cacheName => {
                    return caches.delete(cacheName);
                })
            );
        })
    );
});

self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') return fetch(event.request);

    event.respondWith(
        fetch(event.request).catch(() => {
            return caches.match(event.request).then(cachedResponse => {
                if (cachedResponse) {
                    return cachedResponse;
                }
            });
        })
    );
});