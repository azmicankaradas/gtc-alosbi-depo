const CACHE_NAME = 'gtc-depo-v2';

const PRECACHE_ASSETS = [
    '/',
    '/manifest.json',
    '/icon-192.png',
    '/icon-512.png',
    '/logo.png',
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_ASSETS))
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((names) =>
            Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
        )
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    const { request } = event;
    if (request.method !== 'GET') return;
    if (request.url.includes('supabase.co')) return;
    if (request.url.startsWith('chrome-extension://')) return;

    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request)
                .then((r) => { const c = r.clone(); caches.open(CACHE_NAME).then((cache) => cache.put(request, c)); return r; })
                .catch(() => caches.match(request).then((c) => c || caches.match('/')))
        );
        return;
    }

    if (request.url.match(/\.(js|css|png|jpg|jpeg|svg|gif|ico|woff2?|ttf|eot)$/)) {
        event.respondWith(
            caches.match(request).then((c) => c || fetch(request).then((r) => { const cl = r.clone(); caches.open(CACHE_NAME).then((cache) => cache.put(request, cl)); return r; }))
        );
        return;
    }

    event.respondWith(
        fetch(request)
            .then((r) => { const c = r.clone(); caches.open(CACHE_NAME).then((cache) => cache.put(request, c)); return r; })
            .catch(() => caches.match(request))
    );
});
