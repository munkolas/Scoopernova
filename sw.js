/* Scoopernova – Service Worker: App zuerst aus dem Netz (Updates sofort), offline aus dem Speicher. Supabase immer direkt. */
var V = 'scoopernova-1.6', C = 'scoopernova-app';
self.addEventListener('install', function (e) { self.skipWaiting(); e.waitUntil(caches.open(C).then(function (c) { return c.addAll(['./', 'icon-180.png', 'manifest.webmanifest']).catch(function () {}); })); });
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', function (e) {
  var req = e.request; if (req.method !== 'GET') return;
  var u = new URL(req.url);
  if (u.origin === self.location.origin) {
    if (/\/sw\.js$/.test(u.pathname)) return;
    e.respondWith(fetch(req).then(function (r) { if (r && r.ok) { var cl = r.clone(); caches.open(C).then(function (c) { c.put(req, cl); }); } return r; })
      .catch(function () { return caches.match(req, {ignoreSearch: true}).then(function (h) { return h || caches.match('./'); }); }));
    return;
  }
  if (u.hostname === 'fonts.googleapis.com' || u.hostname === 'fonts.gstatic.com') {
    e.respondWith(caches.match(req).then(function (h) { return h || fetch(req).then(function (r) { var cl = r.clone(); caches.open(C).then(function (c) { c.put(req, cl); }); return r; }); }));
  }
});
