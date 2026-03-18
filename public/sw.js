const CACHE = 'koenig-ms-v1';
const STATIC = ['/'];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(STATIC)));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const { request } = e;
  const url = new URL(request.url);

  // Skip non-GET and cross-origin requests
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;

  // HTML: network-first (always fresh)
  if (request.headers.get('accept')?.includes('text/html')) {
    e.respondWith(
      fetch(request)
        .then(r => { const c = r.clone(); caches.open(CACHE).then(cache => cache.put(request, c)); return r; })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Static assets (JS/CSS/fonts/images): cache-first
  e.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(r => {
        if (r.ok) {
          const c = r.clone();
          caches.open(CACHE).then(cache => cache.put(request, c));
        }
        return r;
      });
    })
  );
});
