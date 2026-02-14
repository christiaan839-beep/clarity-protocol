/* ═══════════════════════════════════════════════════════════════
   PWA MANAGER & PUSH NOTIFICATIONS
   Progressive Web App features and notification system
   ═══════════════════════════════════════════════════════════════ */

// ═══ PWA INSTALLATION ═══
class PWAManager {
    constructor() {
        this.deferredPrompt = null;
        this.init();
    }

    init() {
        // Register service worker
        this.registerServiceWorker();

        // Listen for install prompt
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            this.showInstallPromotion();
        });

        // Listen for app installed
        window.addEventListener('appinstalled', () => {
            console.log('✅ PWA installed successfully');
            this.deferredPrompt = null;
            this.hideInstallPromotion();

            // Track installation
            if (typeof gtag !== 'undefined') {
                gtag('event', 'pwa_install', {
                    event_category: 'engagement',
                    event_label: 'PWA Installed'
                });
            }
        });
    }

    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/service-worker.js');
                console.log('✅ Service Worker registered:', registration.scope);

                // Check for updates every hour
                setInterval(() => {
                    registration.update();
                }, 60 * 60 * 1000);

                // Listen for service worker updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            this.showUpdateAvailable();
                        }
                    });
                });

                return registration;
            } catch (error) {
                console.error('❌ Service Worker registration failed:', error);
            }
        }
    }

    showInstallPromotion() {
        const banner = document.createElement('div');
        banner.id = 'install-banner';
        banner.className = 'pwa-install-banner';
        banner.innerHTML = `
            <div class="install-content">
                <div class="install-icon">📱</div>
                <div class="install-text">
                    <strong>Install Clarity Protocol</strong>
                    <p>Get quick access from your home screen</p>
                </div>
                <button class="btn-install">Install</button>
                <button class="btn-dismiss">✕</button>
            </div>
        `;

        document.body.appendChild(banner);

        // Fade in
        setTimeout(() => banner.classList.add('visible'), 100);

        // Install button
        banner.querySelector('.btn-install').addEventListener('click', () => {
            this.promptInstall();
        });

        // Dismiss button
        banner.querySelector('.btn-dismiss').addEventListener('click', () => {
            this.hideInstallPromotion();
        });
    }

    hideInstallPromotion() {
        const banner = document.getElementById('install-banner');
        if (banner) {
            banner.classList.remove('visible');
            setTimeout(() => banner.remove(), 300);
        }
    }

    async promptInstall() {
        if (!this.deferredPrompt) return;

        this.deferredPrompt.prompt();
        const { outcome } = await this.deferredPrompt.userChoice;

        console.log(`User response to install prompt: ${outcome}`);

        if (outcome === 'accepted') {
            console.log('✅ User accepted the install prompt');
        } else {
            console.log('❌ User dismissed the install prompt');
        }

        this.deferredPrompt = null;
    }

    showUpdateAvailable() {
        const notification = document.createElement('div');
        notification.className = 'update-notification';
        notification.innerHTML = `
            <div class="update-content">
                <span>🎉 New version available!</span>
                <button class="btn-update">Update Now</button>
            </div>
        `;

        document.body.appendChild(notification);
        setTimeout(() => notification.classList.add('visible'), 100);

        notification.querySelector('.btn-update').addEventListener('click', () => {
            window.location.reload();
        });
    }
}

// ═══ PUSH NOTIFICATIONS ═══
class PushNotificationManager {
    constructor() {
        this.permission = Notification.permission;
        this.subscription = null;
    }

    async requestPermission() {
        if (!('Notification' in window)) {
            console.warn('❌ Notifications not supported');
            return false;
        }

        if (this.permission === 'granted') {
            return true;
        }

        const permission = await Notification.requestPermission();
        this.permission = permission;

        if (permission === 'granted') {
            console.log('✅ Notification permission granted');
            await this.subscribe();
            return true;
        } else {
            console.log('❌ Notification permission denied');
            return false;
        }
    }

    async subscribe() {
        const registration = await navigator.serviceWorker.ready;

        // Check if already subscribed
        const existingSubscription = await registration.pushManager.getSubscription();
        if (existingSubscription) {
            this.subscription = existingSubscription;
            return existingSubscription;
        }

        // Subscribe to push notifications
        // Note: In production, you'd use your VAPID public key here
        const vapidPublicKey = 'YOUR_VAPID_PUBLIC_KEY_HERE';

        try {
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: this.urlBase64ToUint8Array(vapidPublicKey)
            });

            this.subscription = subscription;

            // Send subscription to server
            await this.sendSubscriptionToServer(subscription);

            return subscription;
        } catch (error) {
            console.error('❌ Push subscription failed:', error);
            return null;
        }
    }

    async sendSubscriptionToServer(subscription) {
        // Placeholder - replace with actual server endpoint
        console.log('📤 Sending subscription to server:', subscription);

        // In production, you'd POST to your backend:
        // await fetch('/api/subscribe', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(subscription)
        // });
    }

    urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/\\-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    // Schedule daily reminders
    scheduleDailyReminder(hour, minute, message) {
        const now = new Date();
        const scheduledTime = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            hour,
            minute,
            0
        );

        // If time has passed today, schedule for tomorrow
        if (scheduledTime <= now) {
            scheduledTime.setDate(scheduledTime.getDate() + 1);
        }

        const delay = scheduledTime.getTime() - now.getTime();

        setTimeout(() => {
            this.sendNotification('Protocol Reminder', {
                body: message,
                icon: '/icons/icon-192x192.png',
                badge: '/icons/badge-72x72.png',
                vibrate: [200, 100, 200],
                tag: 'daily-reminder',
                requireInteraction: false
            });

            // Reschedule for next day
            this.scheduleDailyReminder(hour, minute, message);
        }, delay);
    }

    async sendNotification(title, options) {
        if (this.permission !== 'granted') {
            console.warn('❌ Notification permission not granted');
            return;
        }

        const registration = await navigator.serviceWorker.ready;
        await registration.showNotification(title, options);
    }

    // Pre-defined protocol reminders
    setupProtocolReminders() {
        this.scheduleDailyReminder(6, 0, '☀️ Time for morning solar load!');
        this.scheduleDailyReminder(13, 0, '💪 Antigravity training session');
        this.scheduleDailyReminder(20, 0, '🌙 Enable Digital Twilight mode');
        this.scheduleDailyReminder(22, 0, '😴 Wind down for optimal sleep');
    }
}

// ═══ OFFLINE STATUS ═══
class OfflineManager {
    constructor() {
        this.isOnline = navigator.onLine;
        this.init();
    }

    init() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.showOnlineNotification();
            this.syncPendingData();
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.showOfflineNotification();
        });
    }

    showOnlineNotification() {
        this.showBanner('✅ Back online! Syncing data...', 'success');
    }

    showOfflineNotification() {
        this.showBanner('⚠️ You\'re offline. Some features may be limited.', 'warning');
    }

    showBanner(message, type) {
        const banner = document.createElement('div');
        banner.className = `offline-banner ${type}`;
        banner.textContent = message;
        document.body.appendChild(banner);

        setTimeout(() => banner.classList.add('visible'), 100);
        setTimeout(() => {
            banner.classList.remove('visible');
            setTimeout(() => banner.remove(), 300);
        }, 3000);
    }

    async syncPendingData() {
        if ('serviceWorker' in navigator && 'sync' in registration) {
            const registration = await navigator.serviceWorker.ready;
            await registration.sync.register('sync-biometrics');
            await registration.sync.register('sync-achievements');
        }
    }
}

// ═══ EXPORT ═══
export {
    PWAManager,
    PushNotificationManager,
    OfflineManager
};
