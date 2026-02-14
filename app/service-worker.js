/* ═══════════════════════════════════════════════════════════════
   SERVICE WORKER — Offline Support & Caching
   PWA functionality for offline access and performance
   ═══════════════════════════════════════════════════════════════ */

const CACHE_NAME = 'clarity-protocol-v1.0.0';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/style.css',
    '/premium-enhancements.css',
    '/achievement-styles.css',
    '/interactivity-styles.css',
    '/app.js',
    '/services/biometrics.js',
    '/services/dataVisualizer.js',
    '/services/achievements.js',
    '/services/performance.js',
    '/services/interactivity.js',
    '/manifest.json'
];

// Install Event - Cache Assets
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing...');

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] Caching assets');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .then(() => {
                console.log('[Service Worker] Installed successfully');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('[Service Worker] Installation failed:', error);
            })
    );
});

// Activate Event - Clean Old Caches
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activating...');

    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_NAME) {
                            console.log('[Service Worker] Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('[Service Worker] Activated successfully');
                return self.clients.claim();
            })
    );
});

// Fetch Event - Network First, Cache Fallback
self.addEventListener('fetch', (event) => {
    // Skip cross-origin requests
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // Clone response before caching
                const responseClone = response.clone();

                // Update cache with fresh content
                caches.open(CACHE_NAME)
                    .then((cache) => {
                        cache.put(event.request, responseClone);
                    });

                return response;
            })
            .catch(() => {
                // Network failed, try cache
                return caches.match(event.request)
                    .then((cachedResponse) => {
                        if (cachedResponse) {
                            console.log('[Service Worker] Serving from cache:', event.request.url);
                            return cachedResponse;
                        }

                        // No cache, return offline page
                        if (event.request.destination === 'document') {
                            return caches.match('/index.html');
                        }
                    });
            })
    );
});

// Background Sync - Queue Failed Requests
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-biometrics') {
        console.log('[Service Worker] Background sync: biometrics');
        event.waitUntil(syncBiometrics());
    }

    if (event.tag === 'sync-achievements') {
        console.log('[Service Worker] Background sync: achievements');
        event.waitUntil(syncAchievements());
    }
});

async function syncBiometrics() {
    // Placeholder for actual sync logic
    console.log('[Service Worker] Syncing biometric data...');
    return Promise.resolve();
}

async function syncAchievements() {
    // Placeholder for actual sync logic
    console.log('[Service Worker] Syncing achievements...');
    return Promise.resolve();
}

// Push Notifications
self.addEventListener('push', (event) => {
    const options = {
        body: event.data ? event.data.text() : 'Protocol reminder',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        vibrate: [200, 100, 200],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'view',
                title: 'View Protocol',
                icon: '/icons/checkmark.png'
            },
            {
                action: 'dismiss',
                title: 'Dismiss',
                icon: '/icons/cross.png'
            }
        ]
    };

    event.waitUntil(
        self.registration.showNotification('Clarity Protocol', options)
    );
});

// Notification Click
self.addEventListener('notificationclick', (event) => {
    console.log('[Service Worker] Notification clicked:', event.action);

    event.notification.close();

    if (event.action === 'view') {
        event.waitUntil(
            clients.openWindow('/#dashboard')
        );
    }
});

// Message from client
self.addEventListener('message', (event) => {
    console.log('[Service Worker] Message received:', event.data);

    if (event.data.action === 'skipWaiting') {
        self.skipWaiting();
    }

    if (event.data.action === 'clearCache') {
        event.waitUntil(
            caches.delete(CACHE_NAME)
                .then(() => {
                    event.ports[0].postMessage({ cleared: true });
                })
        );
    }
});
