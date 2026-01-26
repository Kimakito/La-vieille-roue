// Service Worker pour La Vieille Roue
// Améliore la performance avec le cache intelligent

const CACHE_VERSION = 'v1.0.0';
const CACHE_NAME = `la-vieille-roue-${CACHE_VERSION}`;

// Fichiers critiques à mettre en cache lors de l'installation
const STATIC_CACHE = [
  '/',
  '/assets/css/output.css',
  '/assets/logo/logo.png',
  '/assets/favicon/favicon.svg',
  '/offline.html' // Page hors ligne optionnelle
];

// Stratégies de cache
const CACHE_STRATEGIES = {
  // Cache First: pour les assets statiques (images, CSS, JS, fonts)
  cacheFirst: [
    /\/assets\/images\//,
    /\/assets\/css\//,
    /\/assets\/js\//,
    /\/assets\/fonts\//,
    /\/assets\/icomoon\//,
    /\.(?:png|jpg|jpeg|svg|gif|webp|avif|woff|woff2|ttf|eot)$/
  ],
  
  // Network First: pour le HTML et les données dynamiques
  networkFirst: [
    /\.html$/,
    /\/$/
  ],
  
  // Stale While Revalidate: pour les APIs et ressources externes
  staleWhileRevalidate: [
    /^https:\/\/fonts\.googleapis\.com/,
    /^https:\/\/fonts\.gstatic\.com/
  ]
};

// Installation du Service Worker
self.addEventListener('install', (event) => {
  console.log('[SW] Installation en cours...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Mise en cache des fichiers statiques');
        return cache.addAll(STATIC_CACHE.filter(url => url !== '/offline.html'));
      })
      .then(() => self.skipWaiting())
      .catch((err) => console.error('[SW] Erreur lors de l\'installation:', err))
  );
});

// Activation et nettoyage des anciens caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activation...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name.startsWith('la-vieille-roue-') && name !== CACHE_NAME)
            .map((name) => {
              console.log('[SW] Suppression ancien cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Interception des requêtes
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Ignorer les requêtes non-GET et les requêtes chrome-extension
  if (request.method !== 'GET' || url.protocol === 'chrome-extension:') {
    return;
  }
  
  // Déterminer la stratégie à utiliser
  let strategy = getStrategy(request.url);
  
  event.respondWith(
    strategy(request)
      .catch(() => {
        // En cas d'erreur, essayer de servir une page hors ligne
        if (request.destination === 'document') {
          return caches.match('/offline.html') || Response.error();
        }
        return Response.error();
      })
  );
});

// Fonction pour déterminer la stratégie de cache
function getStrategy(url) {
  // Cache First pour les assets statiques
  for (let pattern of CACHE_STRATEGIES.cacheFirst) {
    if (pattern.test(url)) {
      return cacheFirst;
    }
  }
  
  // Stale While Revalidate pour les ressources externes
  for (let pattern of CACHE_STRATEGIES.staleWhileRevalidate) {
    if (pattern.test(url)) {
      return staleWhileRevalidate;
    }
  }
  
  // Network First par défaut pour le HTML
  return networkFirst;
}

// Stratégie Cache First
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) {
    return cached;
  }
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.error('[SW] Erreur Cache First:', error);
    throw error;
  }
}

// Stratégie Network First
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }
    throw error;
  }
}

// Stratégie Stale While Revalidate
async function staleWhileRevalidate(request) {
  const cached = await caches.match(request);
  
  const fetchPromise = fetch(request)
    .then((response) => {
      if (response.ok) {
        const cache = caches.open(CACHE_NAME);
        cache.then(c => c.put(request, response.clone()));
      }
      return response;
    })
    .catch(() => cached);
  
  return cached || fetchPromise;
}

// Message handling pour update du cache
self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
  
  if (event.data === 'clearCache') {
    event.waitUntil(
      caches.keys().then((names) => {
        return Promise.all(names.map(name => caches.delete(name)));
      })
    );
  }
});
