// This is the "Offline page" service worker
var ver = 'v2020';
var name = 'cache';
var time = '1234';
var CACHENAME = `${name}-${ver}-${time}`;
var expectedCaches = [`${name}-${ver}-${time}`];

var FILES = [
    '/manifest.json',
    '/files/images/blog/404.png',
    '/css/app.css',
    '/js/app.js',
    // modules
    '/js/modules/chart.js',
    '/js/modules/conf_chart.js',
    '/js/modules/jquery.js',
    '/js/modules/load.js',
    '/js/modules/modal.js',
    '/js/modules/prism.js',
    '/js/modules/script.js',
    '/js/modules/scroll.js',
    '/js/modules/section.js',
    '/index.html',
    '/json/search.json',
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHENAME).then(cache => {
            fetch('./json/search.json')
                .then(response => {
                    return response.json();
                })
                .then(json => {
                    FILES = FILES.concat(
                        json.map(item => {
                            return item.url;
                        }),
                    );
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
                        if (!expectedCaches.includes(key)) return caches.delete(key);
                    }),
                ),
            )
            .then(_ => {
                console.log(`${CACHENAME} now ready to handle fetches!`);
            }),
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.open(CACHENAME).then(cache => {
            return cache.match(event.request).then(response => {
                return (
                    response ||
                    fetch(event.request)
                        .then(response => {
                            cache.put(event.request, response.clone());
                            return response;
                        })
                        .catch(_ => {
                            var file = event.request;
                            if (event.request.destination === 'image') file = 'files/images/blog/404.png';
                            if (event.request.destination === 'document') file = 'index.html';
                            return caches.match(file);
                        })
                );
            });
        }),
    );
});
