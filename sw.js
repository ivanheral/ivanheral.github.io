// This is the "Offline page" service worker
var ver = 'v2';
var name = 'cache';
var CACHENAME = `${name}-${ver}`;
var expectedCaches = [`${name}-${ver}`];

var FILES = [
    '/offline.html',
    '/files/images/blog/404.png',
    '/css/app.css',
    '/js/app.js',
    '/index.html',
    '/json/search.json',
];

// Install stage sets up the offline page in the cache and opens a new cache
self.addEventListener('install', event => {
    const offlinePage = new Request('offline.html', {
        headers: {
            'Content-Type': 'text/html',
        },
    });
    event.waitUntil(
        fetch(offlinePage).then(response => {
            return caches.open(CACHENAME).then(cache => {
                console.log('[PWA Builder] Cached offline page during install: ' + response.url);
                return cache.addAll(FILES);
            });
        }),
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches
            .keys()
            .then(keys =>
                Promise.all(
                    keys.map(key => {
                        if (!expectedCaches.includes(key)) {
                            return caches.delete(key);
                        }
                    }),
                ),
            )
            .then(() => {
                console.log(`${ver} now ready to handle fetches!`);
            }),
    );
});

// If any fetch for an html file fails, it will show the offline page.
self.addEventListener('fetch', event => {
    if (event.request.destination === 'document') {
        event.respondWith(
            fetch(event.request).catch(error => {
                console.error('[PWA Builder] Network request Failed. Serving offline page. ' + error);
                return caches.open(CACHENAME).then(cache => {
                    return cache.match('offline.html');
                });
            }),
        );
    }

    if (event.request.destination === 'image') {
        event.respondWith(
            fetch(event.request).catch(error => {
                console.error('[PWA Builder] Network request Failed. Serving offline page. ' + error);
                return caches.open(CACHENAME).then(cache => {
                    return cache.match('files/images/blog/404.png');
                });
            }),
        );
    }
});

// This is an event that can be fired from your page to tell the SW to update the offline page
self.addEventListener('refreshOffline', response => {
    return caches.open(CACHENAME).then(cache => {
        console.log('[PWA Builder] Offline page updated from refreshOffline event: ' + response.url);
        return cache.put(offlinePage, response);
    });
});
