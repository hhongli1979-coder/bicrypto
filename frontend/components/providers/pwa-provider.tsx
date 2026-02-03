'use client';

import { useEffect } from 'react';

export function PWAProvider() {
  useEffect(() => {
    // 仅在生产环境注册 Service Worker
    if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('✅ Service Worker 注册成功:', registration.scope);
          
          // 检查更新
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            newWorker?.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('🔄 发现新版本');
              }
            });
          });
        })
        .catch((error) => {
          console.error('❌ Service Worker 注册失败:', error);
        });

      // 监听 Service Worker 更新
      let refreshing = false;
      navigator.serviceWorker?.addEventListener('controllerchange', () => {
        if (!refreshing) {
          refreshing = true;
          window.location.reload();
        }
      });
    }
  }, []);

  return null;
}
