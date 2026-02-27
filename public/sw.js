/**
 * Minimal service worker: stale-while-revalidate for static app shell and assets.
 * Does not cache API calls or auth; dynamic pages use network-first.
 */
const CACHE_NAME = 'lingotheory-v1';

const STATIC_ASSETS = [
  '/',
  '/manifest.webmanifest',
  '/favicon-check.svg',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/apple-touch-icon.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Never cache API, auth, or non-GET
  if (request.method !== 'GET') return;
  if (url.pathname.startsWith('/api/')) return;
  if (url.pathname.startsWith('/auth')) return;

  // Static assets: stale-while-revalidate
  const isStatic =
    url.origin === location.origin &&
    (url.pathname === '/' ||
      url.pathname === '/manifest.webmanifest' ||
      /^\/(favicon|icons|pwa)\//.test(url.pathname) ||
      url.pathname.endsWith('.svg') ||
      url.pathname.endsWith('.png') ||
      url.pathname.endsWith('.css') ||
      url.pathname.endsWith('.js'));

  if (isStatic) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) =>
        cache.match(request).then((cached) => {
          const fetchPromise = fetch(request).then((res) => {
            if (res.ok) cache.put(request, res.clone());
            return res;
          });
          return cached ?? fetchPromise;
        })
      )
    );
    return;
  }

  // Everything else: network only (no cache)
  event.respondWith(fetch(request));
});
