// Custom Service Worker code for handling notification clicks
// This file is imported by the generated Workbox service worker

self.addEventListener('notificationclick', function (event) {
    event.notification.close();

    // Get the URL from notification data, or fall back to root
    const urlToOpen = (event.notification.data && event.notification.data.url) || '/';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (windowClients) {
            // Check if the app is already open
            for (let i = 0; i < windowClients.length; i++) {
                const client = windowClients[i];
                if ('focus' in client) {
                    return client.focus();
                }
            }
            // If not open, open a new window
            if (clients.openWindow) {
                return clients.openWindow(urlToOpen);
            }
        })
    );
});
