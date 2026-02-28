import { ApiResult } from './types';

const API_BASE = '/api';

/** Convert a VAPID public key from base64url to Uint8Array */
export function urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = atob(base64);
    return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

/** Send a PushSubscription to the backend for storage */
export async function subscribeToPush(
    subscription: PushSubscription
): Promise<ApiResult<{ subscribed: boolean }>> {
    try {
        const response = await fetch(`${API_BASE}/push/subscribe`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(subscription.toJSON()),
        });
        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            return { success: false, message: (err as any).message ?? 'Помилка підписки на push' };
        }
        return await response.json();
    } catch {
        return { success: false, message: 'Помилка мережі при підписці на push' };
    }
}

/** Unsubscribe endpoint (optional backend call) */
export async function unsubscribeFromPush(
    endpoint: string
): Promise<ApiResult<{ unsubscribed: boolean }>> {
    try {
        const response = await fetch(`${API_BASE}/push/unsubscribe`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ endpoint }),
        });
        if (!response.ok) return { success: false, message: 'Помилка відписки' };
        return await response.json();
    } catch {
        return { success: false, message: 'Помилка мережі при відписці' };
    }
}
