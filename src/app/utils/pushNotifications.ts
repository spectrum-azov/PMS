import logo from '../../assets/logo.png';

export const testPushNotification = async (t: (key: any) => string) => {
    if (!('Notification' in window)) {
        alert(t('push_not_supported'));
        return;
    }

    const sendNotification = async () => {
        // Try to send via service worker first for mobile/PWA
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.ready;
                if (registration && registration.showNotification) {
                    await registration.showNotification(t('push_test_title'), {
                        body: t('push_test_body'),
                        icon: logo,
                        tag: 'test-notification'
                    });
                    return;
                }
            } catch (e) {
                console.error('Service Worker showNotification failed, falling back to Notification API', e);
            }
        }

        // Fallback to standard Notification API
        new Notification(t('push_test_title'), {
            body: t('push_test_body'),
            icon: logo
        });
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
