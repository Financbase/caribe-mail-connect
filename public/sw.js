// PRMCMS Service Worker
const CACHE_NAME = 'prmcms-v1.0.0';
const STATIC_CACHE = 'prmcms-static-v1.0.0';
const DYNAMIC_CACHE = 'prmcms-dynamic-v1.0.0';

// Files to cache for offline functionality
const STATIC_FILES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/offline.html'
];

// API endpoints to cache
const API_CACHE = [
  '/api/partners',
  '/api/sustainability',
  '/api/analytics'
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('PRMCMS Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('PRMCMS Service Worker: Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('PRMCMS Service Worker: Static files cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('PRMCMS Service Worker: Error caching static files:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('PRMCMS Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('PRMCMS Service Worker: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('PRMCMS Service Worker: Activated successfully');
        return self.clients.claim();
      })
  );
});

// Fetch event - handle network requests
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle different types of requests
  if (request.method === 'GET') {
    // Static files (HTML, CSS, JS, images)
    if (isStaticFile(url.pathname)) {
      event.respondWith(handleStaticFile(request));
    }
    // API requests
    else if (isApiRequest(url.pathname)) {
      event.respondWith(handleApiRequest(request));
    }
    // Other requests
    else {
      event.respondWith(handleOtherRequest(request));
    }
  }
});

// Check if request is for a static file
function isStaticFile(pathname) {
  const staticExtensions = ['.html', '.css', '.js', '.json', '.ico', '.png', '.jpg', '.jpeg', '.svg', '.woff', '.woff2'];
  return staticExtensions.some(ext => pathname.endsWith(ext)) || pathname === '/';
}

// Check if request is for API
function isApiRequest(pathname) {
  return pathname.startsWith('/api/') || pathname.includes('supabase.co');
}

// Handle static file requests
async function handleStaticFile(request) {
  try {
    // Try network first, fallback to cache
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache the response for future offline use
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
  } catch (error) {
    console.log('PRMCMS Service Worker: Network failed for static file, trying cache');
  }

  // Fallback to cache
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  // If not in cache and offline, show offline page
  if (request.destination === 'document') {
    return caches.match('/offline.html');
  }

  return new Response('Not found', { status: 404 });
}

// Handle API requests
async function handleApiRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful API responses for offline use
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
  } catch (error) {
    console.log('PRMCMS Service Worker: Network failed for API request, trying cache');
  }

  // Fallback to cache for API requests
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  // Return offline data for specific endpoints
  return getOfflineData(request.url);
}

// Handle other requests
async function handleOtherRequest(request) {
  try {
    return await fetch(request);
  } catch (error) {
    console.log('PRMCMS Service Worker: Network failed for other request');
    return new Response('Network error', { status: 503 });
  }
}

// Get offline data for specific endpoints
function getOfflineData(url) {
  const urlObj = new URL(url);
  
  // Return mock data for offline mode
  if (urlObj.pathname.includes('partners')) {
    return new Response(JSON.stringify({
      data: [
        { id: 1, name: 'Partner Offline', status: 'active' }
      ]
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  if (urlObj.pathname.includes('sustainability')) {
    return new Response(JSON.stringify({
      data: [
        { id: 1, metric: 'Carbon Reduction', value: 'Offline Data' }
      ]
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response('Offline', { status: 503 });
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('PRMCMS Service Worker: Background sync triggered:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(performBackgroundSync());
  }
});

// Perform background sync
async function performBackgroundSync() {
  try {
    // Sync any pending offline actions
    const pendingActions = await getPendingActions();
    
    for (const action of pendingActions) {
      await syncAction(action);
    }
    
    console.log('PRMCMS Service Worker: Background sync completed');
  } catch (error) {
    console.error('PRMCMS Service Worker: Background sync failed:', error);
  }
}

// Get pending actions from IndexedDB
async function getPendingActions() {
  // This would typically read from IndexedDB
  // For now, return empty array
  return [];
}

// Sync a single action
async function syncAction(action) {
  try {
    const response = await fetch(action.url, {
      method: action.method,
      headers: action.headers,
      body: action.body
    });
    
    if (response.ok) {
      // Remove from pending actions
      await removePendingAction(action.id);
    }
  } catch (error) {
    console.error('PRMCMS Service Worker: Failed to sync action:', error);
  }
}

// Remove pending action
async function removePendingAction(id) {
  // This would typically remove from IndexedDB
  console.log('PRMCMS Service Worker: Removed pending action:', id);
}

// Push notification handling
self.addEventListener('push', (event) => {
  console.log('PRMCMS Service Worker: Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'Nueva notificación de PRMCMS',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Ver',
        icon: '/favicon.ico'
      },
      {
        action: 'close',
        title: 'Cerrar',
        icon: '/favicon.ico'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('PRMCMS', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('PRMCMS Service Worker: Notification clicked');
  
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Message handling for communication with main thread
self.addEventListener('message', (event) => {
  console.log('PRMCMS Service Worker: Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_DATA') {
    cacheData(event.data.url, event.data.data);
  }
});

// Cache data for offline use
async function cacheData(url, data) {
  try {
    const cache = await caches.open(DYNAMIC_CACHE);
    const response = new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' }
    });
    await cache.put(url, response);
    console.log('PRMCMS Service Worker: Data cached for offline use:', url);
  } catch (error) {
    console.error('PRMCMS Service Worker: Failed to cache data:', error);
  }
}

console.log('PRMCMS Service Worker: Loaded successfully');
