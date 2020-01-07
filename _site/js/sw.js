(function(){
var _$sw_1 = {};
"use strict";self.addEventListener("install",function(event){var offlinePage=new Request("offline.html",{headers:{"Content-Type":"text/html"}});event.waitUntil(fetch(offlinePage).then(function(response){return caches.open("pwabuilder-offline").then(function(cache){return console.log("[PWA Builder] Cached offline page during install: "+response.url),cache.put(offlinePage,response)})}))}),self.addEventListener("fetch",function(event){"document"===event.request.destination&&event.respondWith(fetch(event.request).catch(function(error){return console.error("[PWA Builder] Network request Failed. Serving offline page. "+error),caches.open("pwabuilder-offline").then(function(cache){return cache.match("offline.html")})}))}),self.addEventListener("refreshOffline",function(response){return caches.open("pwabuilder-offline").then(function(cache){return console.log("[PWA Builder] Offline page updated from refreshOffline event: "+response.url),cache.put(offlinePage,response)})});

}());
