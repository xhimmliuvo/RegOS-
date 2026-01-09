// =====================================================
// REGOS SERVICE WORKER - Enhanced for Slow Networks
// =====================================================

const CACHE_NAME = 'regos-v2';
const STATIC_CACHE = 'regos-static-v2';
const DYNAMIC_CACHE = 'regos-dynamic-v2';
const IMAGE_CACHE = 'regos-images-v2';

// Static assets to cache immediately
const STATIC_ASSETS = [
    '/',
    '/manifest.json',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    console.log('[SW] Installing service worker...');
    event.waitUntil(
        caches.open(STATIC_CACHE).then((cache) => {
            console.log('[SW] Caching static assets');
            return cache.addAll(STATIC_ASSETS);
        })
    );
    self.skipWaiting();
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating service worker...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name.startsWith('regos-') &&
                        ![STATIC_CACHE, DYNAMIC_CACHE, IMAGE_CACHE].includes(name))
                    .map((name) => {
                        console.log('[SW] Deleting old cache:', name);
                        return caches.delete(name);
                    })
            );
        })
    );
    self.clients.claim();
});

// Fetch event - smart caching strategies
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') return;

    // Skip external requests (except images)
    if (!url.origin.includes(self.location.origin) &&
        !request.destination === 'image') return;

    // Skip Supabase API calls (always fetch fresh)
    if (url.hostname.includes('supabase')) return;

    // Strategy based on request type
    if (request.destination === 'image') {
        // Images: Cache first, then network
        event.respondWith(cacheFirst(request, IMAGE_CACHE, 604800000)); // 7 days
    } else if (request.destination === 'script' || request.destination === 'style') {
        // Scripts/Styles: Stale while revalidate
        event.respondWith(staleWhileRevalidate(request, STATIC_CACHE));
    } else if (request.mode === 'navigate') {
        // Navigation: Network first with cache fallback
        event.respondWith(networkFirst(request, DYNAMIC_CACHE, 3000)); // 3 second timeout
    } else {
        // Everything else: Network first
        event.respondWith(networkFirst(request, DYNAMIC_CACHE, 5000));
    }
});

// =====================================================
// CACHING STRATEGIES
// =====================================================

// Cache first - good for images and static assets
async function cacheFirst(request, cacheName, maxAge = 86400000) {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);

    if (cached) {
        // Check if cache is still fresh
        const cachedDate = cached.headers.get('sw-cached-date');
        if (cachedDate && Date.now() - parseInt(cachedDate) < maxAge) {
            return cached;
        }
    }

    try {
        const response = await fetch(request);
        if (response.ok) {
            // Clone and add cache date header
            const responseToCache = response.clone();
            const headers = new Headers(responseToCache.headers);
            headers.set('sw-cached-date', Date.now().toString());

            const modifiedResponse = new Response(await responseToCache.blob(), {
                status: responseToCache.status,
                statusText: responseToCache.statusText,
                headers,
            });
            cache.put(request, modifiedResponse);
        }
        return response;
    } catch (error) {
        if (cached) return cached;
        throw error;
    }
}

// Network first - good for dynamic content
async function networkFirst(request, cacheName, timeout = 3000) {
    const cache = await caches.open(cacheName);

    try {
        // Race between network and timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(request, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (response.ok) {
            cache.put(request, response.clone());
        }
        return response;
    } catch (error) {
        // Network failed, try cache
        const cached = await cache.match(request);
        if (cached) {
            console.log('[SW] Serving from cache:', request.url);
            return cached;
        }

        // Return offline page for navigation requests
        if (request.mode === 'navigate') {
            const offlinePage = await cache.match('/');
            if (offlinePage) return offlinePage;
        }

        throw error;
    }
}

// Stale while revalidate - good for scripts/styles
async function staleWhileRevalidate(request, cacheName) {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);

    // Fetch in background
    const fetchPromise = fetch(request).then((response) => {
        if (response.ok) {
            cache.put(request, response.clone());
        }
        return response;
    }).catch(() => null);

    // Return cached immediately if available, otherwise wait for network
    return cached || fetchPromise;
}

// =====================================================
// BACKGROUND SYNC (for offline submissions)
// =====================================================

self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-submissions') {
        event.waitUntil(syncSubmissions());
    }
});

async function syncSubmissions() {
    // Get pending submissions from IndexedDB and sync when online
    console.log('[SW] Syncing pending submissions...');
    // Implementation would go here
}

// =====================================================
// PUSH NOTIFICATIONS
// =====================================================

self.addEventListener('push', (event) => {
    if (!event.data) return;

    const data = event.data.json();
    const options = {
        body: data.body,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        vibrate: [100, 50, 100],
        data: {
            url: data.url || '/',
        },
        actions: data.actions || [],
    };

    event.waitUntil(
        self.registration.showNotification(data.title || 'RegOS', options)
    );
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    const url = event.notification.data?.url || '/';
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then((windowClients) => {
            // Focus existing window if open
            for (const client of windowClients) {
                if (client.url === url && 'focus' in client) {
                    return client.focus();
                }
            }
            // Open new window
            if (clients.openWindow) {
                return clients.openWindow(url);
            }
        })
    );
});

console.log('[SW] Service worker loaded with enhanced caching for slow networks');
