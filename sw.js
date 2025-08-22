// ===== SERVICE WORKER - THRIFT COUNTRY =====
const CACHE_NAME = 'thrift-country-v1.0.0';
const STATIC_CACHE = 'thrift-country-static-v1.0.0';
const DYNAMIC_CACHE = 'thrift-country-dynamic-v1.0.0';

// Assets à mettre en cache immédiatement
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/styles/main.css',
  '/scripts/main.js',
  '/scripts/three-planet.js',
  '/scripts/animations.js',
  '/data/products.json',
  '/manifest.json',
  '/assets/logo-jupiter-bw.png',
  'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js'
];

// Images et assets dynamiques
const DYNAMIC_ASSETS = [
  '/assets/products/',
  '/assets/collections/',
  '/assets/lookbook/',
  '/assets/icons/'
];

// ===== INSTALLATION =====
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installation');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Service Worker: Mise en cache des assets statiques');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('Service Worker: Installation terminée');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Erreur lors de l\'installation', error);
      })
  );
});

// ===== ACTIVATION =====
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activation');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Service Worker: Suppression de l\'ancien cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activation terminée');
        return self.clients.claim();
      })
  );
});

// ===== INTERCEPTION DES REQUÊTES =====
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Stratégie de cache selon le type de ressource
  if (request.method === 'GET') {
    event.respondWith(handleFetch(request));
  }
});

async function handleFetch(request) {
  const url = new URL(request.url);
  
  // Stratégie Cache First pour les assets statiques
  if (isStaticAsset(url.pathname)) {
    return cacheFirst(request, STATIC_CACHE);
  }
  
  // Stratégie Network First pour les données dynamiques
  if (isDynamicAsset(url.pathname)) {
    return networkFirst(request, DYNAMIC_CACHE);
  }
  
  // Stratégie Network First pour les requêtes API
  if (url.pathname.startsWith('/api/')) {
    return networkFirst(request, DYNAMIC_CACHE);
  }
  
  // Stratégie Stale While Revalidate pour les autres ressources
  return staleWhileRevalidate(request);
}

// ===== STRATÉGIES DE CACHE =====

// Cache First - Pour les assets statiques
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('Cache First: Erreur réseau', error);
    return new Response('Erreur réseau', { status: 503 });
  }
}

// Network First - Pour les données dynamiques
async function networkFirst(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('Network First: Utilisation du cache', error);
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    return new Response('Contenu non disponible hors ligne', { status: 503 });
  }
}

// Stale While Revalidate - Pour les autres ressources
async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cachedResponse = await cache.match(request);
  
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => {
    return cachedResponse || new Response('Erreur réseau', { status: 503 });
  });
  
  return cachedResponse || fetchPromise;
}

// ===== UTILITAIRES =====

function isStaticAsset(pathname) {
  return STATIC_ASSETS.some(asset => {
    if (asset.startsWith('http')) {
      return pathname.includes(asset.split('/').pop());
    }
    return pathname === asset || pathname.startsWith(asset);
  });
}

function isDynamicAsset(pathname) {
  return DYNAMIC_ASSETS.some(asset => pathname.startsWith(asset));
}

// ===== NOTIFICATIONS PUSH =====
self.addEventListener('push', (event) => {
  console.log('Service Worker: Notification push reçue');
  
  const options = {
    body: event.data ? event.data.text() : 'Nouveau drop disponible !',
    icon: '/assets/icons/icon-192x192.png',
    badge: '/assets/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Voir le drop',
        icon: '/assets/icons/action-explore.png'
      },
      {
        action: 'close',
        title: 'Fermer',
        icon: '/assets/icons/action-close.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('Thrift Country', options)
  );
});

// ===== CLIC SUR NOTIFICATION =====
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Clic sur notification');
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/#new-arrivals')
    );
  } else if (event.action === 'close') {
    // Notification fermée
  } else {
    // Clic sur le corps de la notification
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// ===== MESSAGE DU CLIENT =====
self.addEventListener('message', (event) => {
  console.log('Service Worker: Message reçu', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

// ===== GESTION DES ERREURS =====
self.addEventListener('error', (event) => {
  console.error('Service Worker: Erreur', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('Service Worker: Promise rejetée', event.reason);
});

// ===== FONCTIONS UTILITAIRES =====

// Vérifier la connectivité
async function checkConnectivity() {
  try {
    const response = await fetch('/api/health', { 
      method: 'HEAD',
      cache: 'no-cache'
    });
    return response.ok;
  } catch (error) {
    return false;
  }
}

// Mettre à jour le cache
async function updateCache() {
  const cache = await caches.open(STATIC_CACHE);
  const requests = await cache.keys();
  
  for (const request of requests) {
    try {
      const response = await fetch(request);
      if (response.ok) {
        await cache.put(request, response);
      }
    } catch (error) {
      console.log('Erreur lors de la mise à jour du cache:', error);
    }
  }
}

// Nettoyer le cache
async function cleanCache() {
  const cacheNames = await caches.keys();
  const oldCaches = cacheNames.filter(name => 
    name !== STATIC_CACHE && name !== DYNAMIC_CACHE
  );
  
  await Promise.all(
    oldCaches.map(name => caches.delete(name))
  );
}

// ===== ÉVÉNEMENTS DE SYNCHRONISATION =====
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Synchronisation', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(updateCache());
  }
});

// ===== ÉVÉNEMENTS DE CONNECTIVITÉ =====
self.addEventListener('online', () => {
  console.log('Service Worker: En ligne');
  // Synchroniser les données en arrière-plan
  self.registration.sync.register('background-sync');
});

self.addEventListener('offline', () => {
  console.log('Service Worker: Hors ligne');
});

// ===== EXPORT POUR TESTS =====
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    CACHE_NAME,
    STATIC_CACHE,
    DYNAMIC_CACHE,
    STATIC_ASSETS,
    DYNAMIC_ASSETS
  };
}
