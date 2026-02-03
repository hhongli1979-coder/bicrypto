/**
 * PWA 推送通知工具库
 */

// 请求通知权限
export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.warn('该浏览器不支持通知');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}

// 订阅推送通知
export async function subscribeToPushNotifications(): Promise<PushSubscription | null> {
  try {
    const registration = await navigator.serviceWorker.ready;
    
    // 检查是否已有订阅
    let subscription = await registration.pushManager.getSubscription();
    
    if (!subscription) {
      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!vapidPublicKey) {
        console.error('VAPID public key 未配置');
        return null;
      }

      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      });
    }

    // 发送订阅信息到后端
    await fetch('/api/notifications/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subscription),
    });

    return subscription;
  } catch (error) {
    console.error('订阅推送通知失败:', error);
    return null;
  }
}

// 取消订阅
export async function unsubscribeFromPushNotifications(): Promise<boolean> {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    
    if (subscription) {
      await subscription.unsubscribe();
      
      // 通知后端取消订阅
      await fetch('/api/notifications/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endpoint: subscription.endpoint }),
      });
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('取消订阅失败:', error);
    return false;
  }
}

// 发送本地通知
export function sendLocalNotification(
  title: string, 
  options?: NotificationOptions
): Notification | null {
  if (Notification.permission === 'granted') {
    return new Notification(title, {
      icon: '/img/logo/android-icon-192x192.webp',
      badge: '/img/logo/android-icon-96x96.webp',
      vibrate: [200, 100, 200],
      ...options,
    });
  }
  return null;
}

// 检查通知权限状态
export function getNotificationPermissionStatus(): NotificationPermission {
  if (!('Notification' in window)) {
    return 'denied';
  }
  return Notification.permission;
}

// 辅助函数：将 Base64 转换为 Uint8Array
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
