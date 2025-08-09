// Hardened service worker for PRMCMS PWA
const CACHE_NAME = 'prmcms-v2';
const PRECACHE_URLS = [
  '/',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.map((key) => key !== CACHE_NAME && caches.delete(key))
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  // Never handle non-GET or requests with Authorization headers
  if (req.method !== 'GET' || req.headers.has('Authorization')) {
    return; // allow network to handle
  }

  event.respondWith(
    (async () => {
      const cached = await caches.match(req);
      if (cached) return cached;

      try {
        const res = await fetch(req);
        const cache = await caches.open(CACHE_NAME);
        // Only cache same-origin, basic responses
        if (res && res.ok && res.type === 'basic' && new URL(req.url).origin === self.location.origin) {
          cache.put(req, res.clone());
        }
        return res;
      } catch (_) {
        // Offline fallback to cache if available
        const cachedFallback = await caches.match('/');
        return cachedFallback || new Response('Offline', { status: 503 });
      }
    })()
  );
});

self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(syncData());
  }
});

async function syncData() {
  // Implement background sync logic here
  console.log('Background sync triggered');
}