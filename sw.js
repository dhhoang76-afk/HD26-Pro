// === HD26 PATCH (sua loi thuc te 30/6/2026): doi CACHE_NAME tu 'qv26-pro-v8_0' sang ten moi -
// day la buoc QUAN TRONG NHAT de buoc Service Worker XOA cache cu va tai lai toan bo file moi.
// Co che "activate" o duoi da co san logic tu xoa moi cache KHONG khop CACHE_NAME hien tai
// (xem dong filter k !== CACHE_NAME) - chi can doi ten la co che do TU CHAY, khong can sua gi
// them. Neu KHONG doi CACHE_NAME, service worker se tiep tuc phuc vu file CU da cache tu truoc,
// giai thich dung trieu chung "da Ctrl+F5 nhung van hien QV26 PRO V8.0" ===
const CACHE_NAME = 'hd26-pro-v8_6';
const ASSETS = [
  './index.html',
  'https://cdn.tailwindcss.com',
  'https://cdn.jsdelivr.net/npm/chart.js',
  'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Inter:wght@300;400;500;600;700&display=swap'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS).catch(() => {/* ignore CDN failures */});
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        if (!res || res.status !== 200 || res.type === 'opaque') return res;
        const clone = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        return res;
      }).catch(() => cached);
    })
  );
});
