// Global Service Worker - Régua Máxima
const CACHE_NAME = 'regua-maxima-global-v1'

const ESSENTIAL_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/images/logos/logo.png'
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ESSENTIAL_ASSETS)).then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) => Promise.all(names.map((n) => (n === CACHE_NAME ? undefined : caches.delete(n))))).then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET' || !request.url.startsWith('http')) return

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy))
          return response
        })
        .catch(() => caches.match(request).then((r) => r || caches.match('/index.html')))
    )
    return
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) {
        fetch(request)
          .then((response) => caches.open(CACHE_NAME).then((cache) => cache.put(request, response)))
          .catch(() => {})
        return cached
      }
      return fetch(request).then((response) => {
        if (response.status === 200) {
          const copy = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy))
        }
        return response
      })
    })
  )
})
