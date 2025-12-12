// Service Worker para Régua Máxima - Barber App
const CACHE_NAME = 'regua-maxima-barber-v2';
const OFFLINE_URL = '/admin/offline';

// Assets essenciais para cache
const ESSENTIAL_ASSETS = [
  '/',
  '/admin/dashboard',
  '/admin/login',
  '/admin/offline',
  '/assets/images/logos/logo.png',
  '/manifest.json'
];

// Install event - cacheia assets essenciais
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching essential assets');
      return cache.addAll(ESSENTIAL_ASSETS.map(url => new Request(url, { cache: 'reload' })));
    }).then(() => {
      console.log('[SW] Installation complete');
      return self.skipWaiting();
    }).catch((error) => {
      console.error('[SW] Installation failed:', error);
    })
  );
});

// Activate event - limpa caches antigos
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[SW] Activation complete');
      return self.clients.claim();
    })
  );
});

// Fetch event - estratégia Network First, com fallback para cache
self.addEventListener('fetch', (event) => {
  // Ignora requisições não-HTTP
  if (!event.request.url.startsWith('http')) {
    return;
  }

  // Para navegação, usa Network First com fallback
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Clona a resposta para cachear
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // Se falhar, tenta o cache
          return caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // Se não houver cache, redireciona para página offline (React)
            return caches.match('/').then((indexResponse) => {
              if (indexResponse) {
                // Retorna o index.html e deixa o React Router lidar com a rota /admin/offline
                return indexResponse;
              }
              // Fallback final: retorna resposta básica
              return new Response(
                '<html><body><h1>Offline</h1><p>Você está sem conexão.</p></body></html>',
                { headers: { 'Content-Type': 'text/html' } }
              );
            });
          });
        })
    );
    return;
  }

  // Para outros recursos, usa Cache First
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Retorna do cache, mas atualiza em background
        fetch(event.request).then((response) => {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, response);
          });
        }).catch(() => {
          // Ignora erros de atualização em background
        });
        return cachedResponse;
      }

      // Se não está no cache, busca da rede
      return fetch(event.request).then((response) => {
        // Cacheia apenas respostas OK
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      });
    })
  );
});

// Listener para mensagens do cliente (para forçar update, etc)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.delete(CACHE_NAME).then(() => {
      console.log('[SW] Cache cleared');
    });
  }
});

// Push notifications (para uso futuro)
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received:', event);
  
  const options = {
    body: event.data ? event.data.text() : 'Você tem uma nova notificação',
    icon: '/assets/images/logos/logo.png',
    badge: '/assets/images/logos/logo.png',
    vibrate: [200, 100, 200],
    tag: 'regua-maxima-notification',
    requireInteraction: false,
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };

  event.waitUntil(
    self.registration.showNotification('Régua Máxima', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification click:', event.notification.tag);
  event.notification.close();

  event.waitUntil(
    clients.openWindow('/admin/dashboard')
  );
});
