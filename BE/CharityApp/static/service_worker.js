const cacheName = "v2";

const cacheAssets = [
    'offline.html'
]

self.addEventListener('install', (e) => {
    console.log("installed");

    e.waitUntil(
        caches
            .open(cacheName)
            .then(cache => {
                console.log('caching')
                 return cache.addAll(cacheAssets)
            })
            .then(() => self.skipWaiting())
    )
    self.skipWaiting();
});

self.addEventListener('activate', (e) => {
    console.log("activated");

    e.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((thisCacheName) => {
                    console.log(cacheNames)
                    if (thisCacheName !== cacheName) {
                        console.log("Deleting old cache:", thisCacheName);
                        return caches.delete(thisCacheName);
                    }
                })
            );
        })
    );

    // Đảm bảo các client hiện tại sử dụng SW mới nhất
    return self.clients.claim();
});

self.addEventListener('fetch', e => {
    console.log('fetching');
    console.log(e)
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)))
});