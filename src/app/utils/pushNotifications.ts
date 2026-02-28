export const testPushNotification = async (t: (key: any) => string) => {
    if (!('Notification' in window)) {
        alert(t('push_not_supported'));
        return;
    }

    // Use static paths from public/ so the Service Worker can resolve them
    const basePath = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
    const iconPath = `${basePath}/icons/icon-192.png`;
    const badgePath = `${basePath}/icons/badge-72.png`;

    const sendNotification = async () => {
        // Try to send via service worker first for mobile/PWA
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.ready;
                if (registration && registration.showNotification) {
                    await registration.showNotification(t('push_test_title'), {
                        body: t('push_test_body'),
                        icon: iconPath,
                        badge: badgePath,
                        tag: 'test-notification',
                        data: {
                            url: window.location.origin + basePath + '/'
                        }
                    });
                    return;
                }
            } catch (e) {
                console.error('Service Worker showNotification failed, falling back to Notification API', e);
            }
        }

        // Fallback to standard Notification API (desktop browsers)
        const notification = new Notification(t('push_test_title'), {
            body: t('push_test_body'),
            icon: iconPath,
            badge: badgePath
        });

        notification.onclick = () => {
            window.focus();
            notification.close();
        };
    };

    if (Notification.permission === 'granted') {
        sendNotification();
    } else if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            sendNotification();
        } else {
            alert(t('push_not_granted'));
        }
    } else {
        alert(t('push_denied'));
    }
};
