// Minimal service worker: exists only so the site is installable (Chrome/Android require one to
// be registered). No caching - the app can't do anything useful without the API anyway, so every
// request just passes straight through to the network as if there were no service worker at all.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));
self.addEventListener('fetch', () => {});
