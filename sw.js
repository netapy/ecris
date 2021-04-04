importScripts("https://storage.googleapis.com/workbox-cdn/releases/6.0.2/workbox-sw.js")

workbox.routing.registerRoute(({
    request: e
}) => "navigate" === e.mode, new workbox.strategies.NetworkFirst({
    cacheName: "pages",
    plugins: [new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [200]
    })]
}))

workbox.routing.registerRoute(({
    request: e
}) => "style" === e.destination || "script" === e.destination || "worker" === e.destination, new workbox.strategies.StaleWhileRevalidate({
    cacheName: "assets",
    plugins: [new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [200]
    })]
}))

workbox.routing.registerRoute(({
    request: e
}) => "image" === e.destination, new workbox.strategies.CacheFirst({
    cacheName: "images",
    plugins: [new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [200]
    }), new workbox.expiration.ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 2592e3
    })]
}));