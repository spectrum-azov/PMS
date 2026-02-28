import { useState, useCallback } from 'react';
import { subscribeToPush, unsubscribeFromPush, urlBase64ToUint8Array } from '../api/pushApi';

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY ?? '';

export type PushPermission = 'default' | 'granted' | 'denied' | 'unsupported';

interface UseVapidPushReturn {
    permission: PushPermission;
    isSubscribed: boolean;
    requestPermission: () => Promise<void>;
    subscribe: () => Promise<void>;
    unsubscribe: () => Promise<void>;
    /** Show a notification via the Service Worker (works when tab is hidden) */
    showNotification: (title: string, options?: NotificationOptions) => Promise<void>;
}

function getInitialPermission(): PushPermission {
    if (!('Notification' in window)) return 'unsupported';
    return Notification.permission as PushPermission;
}

export function useVapidPush(): UseVapidPushReturn {
    const [permission, setPermission] = useState<PushPermission>(getInitialPermission);
    const [isSubscribed, setIsSubscribed] = useState(false);

    const requestPermission = useCallback(async () => {
        if (!('Notification' in window)) return;
        const result = await Notification.requestPermission();
        setPermission(result as PushPermission);
    }, []);

    const subscribe = useCallback(async () => {
        if (!('serviceWorker' in navigator) || !VAPID_PUBLIC_KEY) return;
        try {
            const reg = await navigator.serviceWorker.ready;
            const sub = await reg.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY) as BufferSource,
            });
            await subscribeToPush(sub);
            setIsSubscribed(true);
        } catch (err) {
            console.warn('[VAPID] Subscribe failed:', err);
        }
    }, []);

    const unsubscribe = useCallback(async () => {
        if (!('serviceWorker' in navigator)) return;
        try {
            const reg = await navigator.serviceWorker.ready;
            const sub = await reg.pushManager.getSubscription();
            if (sub) {
                await unsubscribeFromPush(sub.endpoint);
                await sub.unsubscribe();
                setIsSubscribed(false);
            }
        } catch (err) {
            console.warn('[VAPID] Unsubscribe failed:', err);
        }
    }, []);

    const showNotification = useCallback(
        async (title: string, options?: NotificationOptions) => {
            if (permission !== 'granted') return;
            if ('serviceWorker' in navigator) {
                const reg = await navigator.serviceWorker.ready;
                reg.showNotification(title, options);
            } else if ('Notification' in window) {
                new Notification(title, options);
            }
        },
        [permission]
    );

    return { permission, isSubscribed, requestPermission, subscribe, unsubscribe, showNotification };
}
