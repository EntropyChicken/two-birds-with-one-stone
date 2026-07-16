const CACHE_NAME = "one-stone-cache-v4";
const CACHE_FILES = [
    "./", 
    "./index.html",
    "./style.css",
    "./sketch.js",
    "./libraries/p5.min.js",
    "./libraries/p5.sound.min.js",
    "./assets/site.webmanifest",
    "./assets/apple-touch-icon.png",
    "./assets/favicon.ico",
    "./assets/favicon-16x16.png",
    "./assets/favicon-32x32.png",
    "./assets/android-chrome-192x192.png",
    "./assets/android-chrome-512x512.png"
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(CACHE_FILES))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener("fetch", (event) => {
    if (event.request.method !== 'GET') return;

    event.respondWith(
        caches.match(event.request).then((response) => {
            if (response) {
                return response;
            }
            if (event.request.mode === 'navigate') {
                return caches.match("./index.html");
            }
            return fetch(event.request).catch(() => new Response(null, { status: 404 }));
        })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            ))
            .then(() => self.clients.claim())
            .then(() => self.clients.matchAll({ type: 'window' }))
            .then((clients) => {
                // Tell every open tab a new version just took over
                clients.forEach((client) => client.postMessage({ type: 'NEW_VERSION_ACTIVATED' }));
            })
    );
});