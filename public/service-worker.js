// FitMaster Pro - Service Worker
// Версия: 1.0.0
// Кэширование ресурсов для оффлайн работы

const CACHE_NAME = 'fitmaster-pro-v1.0.0';
const OFFLINE_URL = '/offline.html';

// Ресурсы для кэширования при установке
const PRECACHE_RESOURCES = [
  '/',
  '/index.html',
  '/src/main.jsx',
  '/src/App.jsx',
  '/src/index.css',
  '/manifest.json',
  '/icons/icon-72.png',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

// Установка Service Worker
self.addEventListener('install', event => {
  console.log('🛠️ Service Worker: Установка...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('📦 Кэширую основные ресурсы:', PRECACHE_RESOURCES);
        return cache.addAll(PRECACHE_RESOURCES)
          .then(() => {
            console.log('✅ Все ресурсы закэшированы');
            return self.skipWaiting();
          });
      })
      .catch(error => {
        console.error('❌ Ошибка кэширования:', error);
      })
  );
});

// Активация Service Worker
self.addEventListener('activate', event => {
  console.log('🚀 Service Worker: Активация...');
  
  // Очистка старых кэшей
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Удаляю старый кэш:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('✅ Service Worker активирован');
      return self.clients.claim();
    })
  );
});

// Перехват сетевых запросов
self.addEventListener('fetch', event => {
  // Пропускаем неподходящие запросы
  if (event.request.method !== 'GET') return;
  if (event.request.url.includes('/api/')) return;
  
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // 1. Возвращаем из кэша если есть
        if (cachedResponse) {
          console.log('📦 Из кэша:', event.request.url);
          return cachedResponse;
        }
        
        // 2. Иначе загружаем из сети
        return fetch(event.request)
          .then(networkResponse => {
            // Если ответ успешный - кэшируем для будущего использования
            if (networkResponse && networkResponse.status === 200) {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME)
                .then(cache => {
                  console.log('💾 Кэширую новый ресурс:', event.request.url);
                  cache.put(event.request, responseToCache);
                });
            }
            return networkResponse;
          })
          .catch(async error => {
            console.log('🌐 Ошибка сети, показываю оффлайн страницу:', error);
            
            // Для HTML запросов показываем оффлайн страницу
            if (event.request.headers.get('accept').includes('text/html')) {
              return caches.match(OFFLINE_URL);
            }
            
            // Для других типов возвращаем заглушку
            return new Response('Оффлайн режим', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain; charset=utf-8'
              })
            });
          });
      })
  );
});

// Фоновая синхронизация (для отложенных запросов)
self.addEventListener('sync', event => {
  if (event.tag === 'sync-data') {
    console.log('🔄 Фоновая синхронизация данных...');
    event.waitUntil(syncData());
  }
});

// Push-уведомления
self.addEventListener('push', event => {
  console.log('📨 Push-уведомление получено');
  
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'FitMaster Pro';
  const options = {
    body: data.body || 'Новое уведомление',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-72.png',
    vibrate: [200, 100, 200],
    data: {
      url: data.url || '/'
    }
  };
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Клик по уведомлению
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(windowClients => {
        for (const client of windowClients) {
          if (client.url === event.notification.data.url && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(event.notification.data.url);
        }
      })
  );
});

// Функция синхронизации данных
async function syncData() {
  try {
    // Здесь будет синхронизация с сервером
    console.log('✅ Данные синхронизированы');
    return Promise.resolve();
  } catch (error) {
    console.error('❌ Ошибка синхронизации:', error);
    return Promise.reject(error);
  }
}