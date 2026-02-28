// Custom Service Worker code for handling notification clicks and server-sent push events
// This file is imported by the generated Workbox service worker

// ─── Notification click ───────────────────────────────────────────────────────
self.addEventListener('notificationclick', function (event) {
    event.notification.close();

    const urlToOpen = (event.notification.data && event.notification.data.url) || '/';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (windowClients) {
            for (let i = 0; i < windowClients.length; i++) {
                const client = windowClients[i];
                if ('focus' in client) {
                    client.navigate(urlToOpen);
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(urlToOpen);
            }
        })
    );
});

// ─── VAPID / server-sent push ─────────────────────────────────────────────────
self.addEventListener('push', function (event) {
    if (!event.data) return;

    let payload;
    try {
        payload = event.data.json();
    } catch {
        payload = { title: 'PMS', body: event.data.text() };
    }

    const title = payload.title || 'PMS Notification';
    const options = {
        body: payload.body || '',
        icon: '/icons/icon-192.png',
        badge: '/icons/badge-72-2.png',
        data: { url: payload.link || '/' },
    };

    event.waitUntil(self.registration.showNotification(title, options));
});
