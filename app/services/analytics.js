/* ═══════════════════════════════════════════════════════════════
   ANALYTICS & EVENT TRACKING
   Google Analytics 4 integration and custom event tracking
   ═══════════════════════════════════════════════════════════════ */

// ═══ GOOGLE ANALYTICS 4 ═══
class AnalyticsManager {
    constructor(measurementId = 'G-XXXXXXXXXX') {
        this.measurementId = measurementId;
        this.initialized = false;
        this.init();
    }

    init() {
        // Load GA4 script
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${this.measurementId}`;
        document.head.appendChild(script);

        // Initialize gtag
        window.dataLayer = window.dataLayer || [];
        window.gtag = function () { dataLayer.push(arguments); };

        gtag('js', new Date());
        gtag('config', this.measurementId, {
            page_path: window.location.pathname,
            send_page_view: true
        });

        this.initialized = true;
        console.log('✅ Google Analytics 4 initialized');
    }

    // Track page views
    trackPageView(pagePath, pageTitle) {
        if (!this.initialized) return;

        gtag('event', 'page_view', {
            page_path: pagePath,
            page_title: pageTitle,
            page_location: window.location.href
        });

        console.log('📊 Page view tracked:', pagePath);
    }

    // Track user engagement
    trackEngagement(action, category, label, value) {
        if (!this.initialized) return;

        gtag('event', action, {
            event_category: category,
            event_label: label,
            value: value
        });

        console.log('📊 Event tracked:', action, category, label);
    }

    // Track protocol adherence
    trackProtocolAdherence(protocolName, completed) {
        this.trackEngagement(
            'protocol_completion',
            'protocol',
            protocolName,
            completed ? 1 : 0
        );
    }

    // Track achievement unlocks
    trackAchievementUnlock(badgeName, rarity) {
        gtag('event', 'achievement_unlock', {
            event_category: 'gamification',
            event_label: badgeName,
            rarity: rarity,
            timestamp: Date.now()
        });

        console.log('🏆 Achievement tracked:', badgeName, rarity);
    }

    // Track biometric syncs
    trackBiometricSync(source, success) {
        gtag('event', 'biometric_sync', {
            event_category: 'health',
            event_label: source,
            success: success,
            timestamp: Date.now()
        });
    }

    // Track user retention
    trackUserRetention(daysSinceFirstVisit) {
        gtag('event', 'user_retention', {
            event_category: 'engagement',
            days_since_first_visit: daysSinceFirstVisit,
            returning_user: daysSinceFirstVisit > 0
        });
    }

    // E-commerce tracking (for future premium features)
    trackPurchase(transactionId, value, items) {
        gtag('event', 'purchase', {
            transaction_id: transactionId,
            value: value,
            currency: 'USD',
            items: items
        });
    }
}

// ═══ CUSTOM EVENT TRACKER ═══
class EventTracker {
    constructor() {
        this.events = [];
        this.sessionStart = Date.now();
        this.setupListeners();
    }

    setupListeners() {
        // Track time on page
        window.addEventListener('beforeunload', () => {
            const sessionDuration = Date.now() - this.sessionStart;
            this.track('session_end', {
                duration: Math.floor(sessionDuration / 1000),
                events_count: this.events.length
            });
        });

        // Track scroll depth
        let maxScrollDepth = 0;
        window.addEventListener('scroll', () => {
            const scrollDepth = Math.round(
                (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
            );

            if (scrollDepth > maxScrollDepth) {
                maxScrollDepth = scrollDepth;

                // Track milestones
                if ([25, 50, 75, 100].includes(scrollDepth)) {
                    this.track('scroll_depth', { depth: scrollDepth });
                }
            }
        });

        // Track form interactions (if any)
        document.addEventListener('submit', (e) => {
            if (e.target.tagName === 'FORM') {
                this.track('form_submit', {
                    form_id: e.target.id || 'unknown',
                    timestamp: Date.now()
                });
            }
        });

        // Track button clicks
        document.addEventListener('click', (e) => {
            if (e.target.closest('button, .btn')) {
                const button = e.target.closest('button, .btn');
                this.track('button_click', {
                    button_text: button.textContent.trim(),
                    button_class: button.className,
                    timestamp: Date.now()
                });
            }
        });
    }

    track(eventName, data = {}) {
        const event = {
            name: eventName,
            data: data,
            timestamp: Date.now(),
            url: window.location.href
        };

        this.events.push(event);

        // Send to GA4 if available
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, data);
        }

        // Store in localStorage for analysis
        this.storeEvent(event);
    }

    storeEvent(event) {
        const storedEvents = JSON.parse(localStorage.getItem('clarity_events') || '[]');
        storedEvents.push(event);

        // Keep last 1000 events
        if (storedEvents.length > 1000) {
            storedEvents.shift();
        }

        localStorage.setItem('clarity_events', JSON.stringify(storedEvents));
    }

    getEvents(filter = null) {
        const events = JSON.parse(localStorage.getItem('clarity_events') || '[]');

        if (filter) {
            return events.filter(e => e.name === filter);
        }

        return events;
    }

    getAnalytics() {
        const events = this.getEvents();

        return {
            total_events: events.length,
            unique_event_types: [...new Set(events.map(e => e.name))].length,
            session_duration: Math.floor((Date.now() - this.sessionStart) / 1000),
            most_common_events: this.getMostCommonEvents(events),
            timeline: this.getEventTimeline(events)
        };
    }

    getMostCommonEvents(events) {
        const counts = {};
        events.forEach(e => {
            counts[e.name] = (counts[e.name] || 0) + 1;
        });

        return Object.entries(counts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 10)
            .map(([name, count]) => ({ name, count }));
    }

    getEventTimeline(events) {
        // Group events by hour
        const timeline = {};
        events.forEach(e => {
            const hour = new Date(e.timestamp).getHours();
            timeline[hour] = (timeline[hour] || 0) + 1;
        });

        return timeline;
    }
}

// ═══ USER BEHAVIOR HEATMAP ═══
class BehaviorHeatmap {
    constructor() {
        this.clicks = [];
        this.hovers = [];
        this.setupTracking();
    }

    setupTracking() {
        // Track clicks
        document.addEventListener('click', (e) => {
            this.clicks.push({
                x: e.clientX,
                y: e.clientY,
                target: e.target.tagName,
                timestamp: Date.now()
            });

            this.saveToStorage();
        });

        // Track mouse movements (sampled)
        let lastHoverSave = 0;
        document.addEventListener('mousemove', (e) => {
            const now = Date.now();

            // Sample every 100ms to avoid performance issues
            if (now - lastHoverSave > 100) {
                this.hovers.push({
                    x: e.clientX,
                    y: e.clientY,
                    timestamp: now
                });

                lastHoverSave = now;
            }
        });

        //Save periodically
        setInterval(() => this.saveToStorage(), 30000); // Every 30 seconds
    }

    saveToStorage() {
        localStorage.setItem('clarity_heatmap_clicks', JSON.stringify(this.clicks.slice(-500)));
        localStorage.setItem('clarity_heatmap_hovers', JSON.stringify(this.hovers.slice(-1000)));
    }

    loadFromStorage() {
        this.clicks = JSON.parse(localStorage.getItem('clarity_heatmap_clicks') || '[]');
        this.hovers = JSON.parse(localStorage.getItem('clarity_heatmap_hovers') || '[]');
    }

    getHeatmapData() {
        return {
            clicks: this.clicks,
            hovers: this.hovers,
            click_count: this.clicks.length,
            hover_count: this.hovers.length
        };
    }

    visualizeHeatmap(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const canvas = document.createElement('canvas');
        canvas.width = window.innerWidth;
        canvas.height = document.documentElement.scrollHeight;
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '9999';
        canvas.style.opacity = '0.6';

        const ctx = canvas.getContext('2d');

        // Draw click heatmap
        this.clicks.forEach(click => {
            const gradient = ctx.createRadialGradient(click.x, click.y, 0, click.x, click.y, 30);
            gradient.addColorStop(0, 'rgba(255, 0, 0, 0.5)');
            gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');

            ctx.fillStyle = gradient;
            ctx.fillRect(click.x - 30, click.y - 30, 60, 60);
        });

        container.appendChild(canvas);
    }
}

// ═══ EXPORT ═══
export {
    AnalyticsManager,
    EventTracker,
    BehaviorHeatmap
};
