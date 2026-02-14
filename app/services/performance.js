/* ═══════════════════════════════════════════════════════════════
   PERFORMANCE ENHANCEMENTS
   Lazy loading, smooth scroll, haptic feedback, optimizations
   ═══════════════════════════════════════════════════════════════ */

// ═══ INTERSECTION OBSERVER FOR LAZY LOADING ═══
class LazyLoader {
    constructor() {
        this.observer = null;
        this.init();
    }

    init() {
        // Check for browser support
        if (!('IntersectionObserver' in window)) {
            console.warn('IntersectionObserver not supported, loading all content immediately');
            this.loadAllContent();
            return;
        }

        const options = {
            root: null,
            rootMargin: '100px',
            threshold: 0.01
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadElement(entry.target);
                    this.observer.unobserve(entry.target);
                }
            });
        }, options);

        // Observe all lazy elements
        document.querySelectorAll('[data-lazy]').forEach(el => {
            this.observer.observe(el);
        });
    }

    loadElement(element) {
        const type = element.dataset.lazy;

        switch (type) {
            case 'section':
                element.classList.add('lazy-loaded');
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
                break;

            case 'image':
                const src = element.dataset.src;
                if (src) {
                    element.src = src;
                    element.removeAttribute('data-src');
                }
                break;

            case 'module':
                this.loadModule(element);
                break;
        }
    }

    async loadModule(element) {
        const moduleName = element.dataset.module;

        try {
            switch (moduleName) {
                case 'skill-tree':
                    if (typeof initSkillTree !== 'undefined') {
                        initSkillTree();
                    }
                    break;

                case 'decision-engine':
                    if (typeof initDecisionEngine !== 'undefined') {
                        initDecisionEngine();
                    }
                    break;

                case 'library':
                    if (typeof initLibrary !== 'undefined') {
                        initLibrary();
                    }
                    break;
            }

            element.classList.add('module-loaded');
        } catch (error) {
            console.error(`Failed to load module: ${moduleName}`, error);
        }
    }

    loadAllContent() {
        document.querySelectorAll('[data-lazy]').forEach(el => {
            this.loadElement(el);
        });
    }
}

// ═══ HAPTIC FEEDBACK ═══
class HapticFeedback {
    static get isSupported() {
        return 'vibrate' in navigator;
    }

    static light() {
        if (this.isSupported) {
            navigator.vibrate(10);
        }
    }

    static medium() {
        if (this.isSupported) {
            navigator.vibrate(20);
        }
    }

    static heavy() {
        if (this.isSupported) {
            navigator.vibrate(50);
        }
    }

    static success() {
        if (this.isSupported) {
            navigator.vibrate([50, 30, 50]);
        }
    }

    static error() {
        if (this.isSupported) {
            navigator.vibrate([100, 50, 100]);
        }
    }

    static unlock() {
        if (this.isSupported) {
            navigator.vibrate([30, 20, 30, 20, 50]);
        }
    }

    static notification() {
        if (this.isSupported) {
            navigator.vibrate([100, 50, 100, 50, 200]);
        }
    }

    static addToButton(button, type = 'light') {
        button.addEventListener('click', () => {
            this[type]();
        });
    }

    static addToElements(selector, type = 'light') {
        document.querySelectorAll(selector).forEach(el => {
            this.addToButton(el, type);
        });
    }
}

// ═══ SMOOTH SCROLL BEHAVIOR ═══
class SmoothScroll {
    static init() {
        // Override all anchor clicks
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');

                // Skip if it's just "#"
                if (href === '#') return;

                e.preventDefault();
                const target = document.querySelector(href);

                if (target) {
                    SmoothScroll.scrollTo(target);
                }
            });
        });
    }

    static scrollTo(element, offset = 80) {
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });

        // Add highlight effect
        element.classList.add('scroll-highlight');
        setTimeout(() => {
            element.classList.remove('scroll-highlight');
        }, 1500);
    }

    static scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

// ═══ LOADING OPTIMIZATION ═══
class LoadingOptimizer {
    static preloadCriticalImages() {
        const criticalImages = document.querySelectorAll('[data-critical-image]');

        criticalImages.forEach(img => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = img.dataset.criticalImage;
            document.head.appendChild(link);
        });
    }

    static deferNonCriticalCSS() {
        const nonCriticalCSS = document.querySelectorAll('link[data-defer]');

        nonCriticalCSS.forEach(link => {
            link.media = 'print';
            link.onload = function () {
                this.media = 'all';
            };
        });
    }

    static lazyLoadIframes() {
        const iframes = document.querySelectorAll('iframe[data-src]');

        iframes.forEach(iframe => {
            iframe.src = iframe.dataset.src;
            iframe.removeAttribute('data-src');
        });
    }
}

//══ PERFORMANCE MONITOR ═══
class PerformanceMonitor {
    static measureFPS(callback) {
        let lastTime = performance.now();
        let frames = 0;

        function measureFrame() {
            const currentTime = performance.now();
            frames++;

            if (currentTime >= lastTime + 1000) {
                const fps = Math.round((frames * 1000) / (currentTime - lastTime));
                callback(fps);
                frames = 0;
                lastTime = currentTime;
            }

            requestAnimationFrame(measureFrame);
        }

        measureFrame();
    }

    static logPerformanceMetrics() {
        if ('performance' in window && performance.timing) {
            const timing = performance.timing;
            const metrics = {
                'DNS Lookup': timing.domainLookupEnd - timing.domainLookupStart,
                'TCP Connection': timing.connectEnd - timing.connectStart,
                'Request': timing.responseStart - timing.requestStart,
                'Response': timing.responseEnd - timing.responseStart,
                'DOM Processing': timing.domComplete - timing.domLoading,
                'Total Load Time': timing.loadEventEnd - timing.navigationStart
            };

            console.group('📊 Performance Metrics');
            Object.entries(metrics).forEach(([key, value]) => {
                console.log(`${key}: ${value}ms`);
            });
            console.groupEnd();
        }
    }

    static initFPSCounter() {
        if (window.location.search.includes('fps=true')) {
            const counter = document.createElement('div');
            counter.id = 'fps-counter';
            counter.style.cssText = `
                position: fixed;
                top: 10px;
                right: 10px;
                background: rgba(0,0,0,0.8);
                color: #0f0;
                padding: 8px 12px;
                font-family: monospace;
                font-size: 14px;
                border-radius: 4px;
                z-index: 99999;
            `;
            document.body.appendChild(counter);

            this.measureFPS(fps => {
                counter.textContent = `${fps} FPS`;
                counter.style.color = fps >= 55 ? '#0f0' : fps >= 30 ? '#ff0' : '#f00';
            });
        }
    }
}

// ═══ SCROLL PROGRESS INDICATOR ═══
class ScrollProgress {
    static init() {
        const progressBar = document.createElement('div');
        progressBar.id = 'scroll-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            height: 3px;
            background: linear-gradient(90deg, var(--gold), var(--gold-light));
            width: 0%;
            z-index: 9999;
            transition: width 0.1s ease-out;
            box-shadow: 0 0 10px var(--gold-dim);
        `;
        document.body.appendChild(progressBar);

        window.addEventListener('scroll', () => {
            const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrolled = (window.scrollY / windowHeight) * 100;
            progressBar.style.width = Math.min(scrolled, 100) + '%';
        });
    }
}

// ═══ EXPORT ═══
export {
    LazyLoader,
    HapticFeedback,
    SmoothScroll,
    LoadingOptimizer,
    PerformanceMonitor,
    ScrollProgress
};
