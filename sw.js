/* Clean My Area — service worker
   Caches the app shell so it opens with no signal.
   Bump CACHE when you change any file, or phones keep the old version. */

const CACHE = 'cma-v1';
const SHELL = [
  './',
  './index.html',
  './css/style.css',
  './config.js',
  './js/data.js',
  './js/schedule.js',
  './js/store.js',
  './js/app.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET') return;                  // never cache a save
  if (url.hostname.includes('script.google.com')) return;  // never cache the backend

  // Network first, fall back to cache — a phone with signal gets the newest build.
  e.respondWith(
    fetch(e.request)
      .then(res => {
        if (res.ok && url.origin === location.origin) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy));
        }
        return res;
      })
      .catch(() => caches.match(e.request).then(r => r || caches.match('./index.html')))
  );
});
