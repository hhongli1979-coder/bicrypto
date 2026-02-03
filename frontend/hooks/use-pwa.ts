'use client';

import { useState, useEffect } from 'react';

interface PWAStatus {
  isInstalled: boolean;
  isStandalone: boolean;
  canInstall: boolean;
  isOnline: boolean;
  hasServiceWorker: boolean;
  notificationPermission: NotificationPermission | 'unsupported';
}

export function usePWA() {
  const [status, setStatus] = useState<PWAStatus>({
    isInstalled: false,
    isStandalone: false,
    canInstall: false,
    isOnline: true,
    hasServiceWorker: false,
    notificationPermission: 'default',
  });

  useEffect(() => {
    // 检查是否以独立模式运行
    const isStandalone = 
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;

    // 检查是否已安装
    const isInstalled = isStandalone || 
      document.referrer.includes('android-app://');

    // 检查 Service Worker
    const hasServiceWorker = 'serviceWorker' in navigator;

    // 检查通知权限
    const notificationPermission = 
      'Notification' in window ? Notification.permission : 'unsupported';

    setStatus({
      isInstalled,
      isStandalone,
      canInstall: !isInstalled,
      isOnline: navigator.onLine,
      hasServiceWorker,
      notificationPermission,
    });

    // 监听在线/离线状态
    const handleOnline = () => setStatus(prev => ({ ...prev, isOnline: true }));
    const handleOffline = () => setStatus(prev => ({ ...prev, isOnline: false }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return status;
}
