// Service Worker 版本控制
const CACHE_VERSION = 'v1.0.0';
const CACHE_NAME = `bicrypto-${CACHE_VERSION}`;

// 需要缓存的静态资源
const STATIC_ASSETS = [
  '/',
  '/offline',
  '/images/logo/logo-1.png',
  '/manifest.json',
];

// 安装事件
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// 激活事件 - 清理旧缓存
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// 请求拦截 - 缓存策略
self.addEventListener('fetch', (event) => {
  // 跳过 WebSocket、API 请求和非 GET 请求
  if (event.request.url.includes('/api/') || 
      event.request.url.includes('ws://') ||
      event.request.url.includes('wss://') ||
      event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      
      return fetch(event.request).then((response) => {
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return response;
      });
    }).catch(() => {
      return caches.match('/offline');
    })
  );
});

// 推送通知
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  
  const options = {
    body: data.body || '您有新的消息',
    icon: '/img/logo/android-icon-192x192.webp',
    badge: '/img/logo/android-icon-96x96.webp',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: data.id,
    },
    actions: [
      {
        action: 'view',
        title: '查看详情',
      },
      {
        action: 'close',
        title: '关闭',
      },
    ],
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title || 'Bicrypto 通知', options)
  );
});

// 通知点击处理
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow('/user/notifications')
    );
  }
});

// 后台同步
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
});

async function syncData() {
  // 后台同步逻辑
  console.log('Background sync triggered');
}
