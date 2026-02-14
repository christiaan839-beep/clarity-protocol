/* ═══════════════════════════════════════════════════════════════
   ADVANCED INTERACTIVITY
   Touch gestures, heatmap calendar, export features
   ═══════════════════════════════════════════════════════════════ */

// ═══ TOUCH GESTURES ═══
class TouchGestures {
    constructor(element, options = {}) {
        this.element = element;
        this.options = {
            swipeThreshold: 50,
            pullThreshold: 80,
            ...options
        };

        this.touchStart = { x: 0, y: 0, time: 0 };
        this.touchEnd = { x: 0, y: 0, time: 0 };

        this.init();
    }

    init() {
        this.element.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
        this.element.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
        this.element.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false });
    }

    handleTouchStart(e) {
        this.touchStart = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY,
            time: Date.now()
        };
    }

    handleTouchMove(e) {
        const currentY = e.touches[0].clientY;
        const deltaY = currentY - this.touchStart.y;

        // Pull-to-refresh visual feedback
        if (deltaY > 0 && window.scrollY === 0) {
            const pullIndicator = document.getElementById('pull-indicator');
            if (pullIndicator) {
                const progress = Math.min(deltaY / this.options.pullThreshold, 1);
                pullIndicator.style.opacity = progress;
                pullIndicator.style.transform = `translateY(${deltaY * 0.5}px) rotate(${progress * 360}deg)`;

                if (progress >= 1) {
                    pullIndicator.classList.add('ready');
                }
            }
        }
    }

    handleTouchEnd(e) {
        this.touchEnd = {
            x: e.changedTouches[0].clientX,
            y: e.changedTouches[0].clientY,
            time: Date.now()
        };

        const deltaX = this.touchEnd.x - this.touchStart.x;
        const deltaY = this.touchEnd.y - this.touchStart.y;
        const deltaTime = this.touchEnd.time - this.touchStart.time;

        // Swipe detection
        if (Math.abs(deltaX) > this.options.swipeThreshold && deltaTime < 300) {
            if (deltaX > 0) {
                this.onSwipeRight();
            } else {
                this.onSwipeLeft();
            }
        }

        // Pull-to-refresh
        if (deltaY > this.options.pullThreshold && window.scrollY === 0) {
            this.onPullRefresh();
        } else {
            this.resetPullIndicator();
        }
    }

    onSwipeLeft() {
        const event = new CustomEvent('swipeleft', { detail: this.touchEnd });
        this.element.dispatchEvent(event);
    }

    onSwipeRight() {
        const event = new CustomEvent('swiperight', { detail: this.touchEnd });
        this.element.dispatchEvent(event);
    }

    onPullRefresh() {
        const event = new CustomEvent('pullrefresh');
        this.element.dispatchEvent(event);

        // Show loading state
        const pullIndicator = document.getElementById('pull-indicator');
        if (pullIndicator) {
            pullIndicator.classList.add('loading');
        }

        this.resetPullIndicator();
    }

    resetPullIndicator() {
        const pullIndicator = document.getElementById('pull-indicator');
        if (pullIndicator) {
            pullIndicator.style.opacity = '0';
            pullIndicator.style.transform = 'translateY(0) rotate(0)';
            pullIndicator.classList.remove('ready', 'loading');
        }
    }
}

// ═══ 90-DAY HEATMAP CALENDAR ═══
class HeatmapCalendar {
    constructor(containerId, data = []) {
        this.container = document.getElementById(containerId);
        this.data = data;
        this.render();
    }

    render() {
        if (!this.container) return;

        const today = new Date();
        const days = 90;

        const heatmap = document.createElement('div');
        heatmap.className = 'heatmap-calendar';

        // Create header
        const header = document.createElement('div');
        header.className = 'heatmap-header';
        header.innerHTML = `
            <h4>90-DAY PROTOCOL ADHERENCE</h4>
            <div class="heatmap-legend">
                <span>Less</span>
                <div class="legend-color" data-level="0"></div>
                <div class="legend-color" data-level="1"></div>
                <div class="legend-color" data-level="2"></div>
                <div class="legend-color" data-level="3"></div>
                <div class="legend-color" data-level="4"></div>
                <span>More</span>
            </div>
        `;
        heatmap.appendChild(header);

        // Create grid
        const grid = document.createElement('div');
        grid.className = 'heatmap-grid';

        // Calculate weeks
        const weeks = Math.ceil(days / 7);

        // Create month labels
        const monthLabels = document.createElement('div');
        monthLabels.className = 'month-labels';

        let currentMonth = '';
        for (let week = 0; week < weeks; week++) {
            const weekDate = new Date(today);
            weekDate.setDate(weekDate.getDate() - (days - (week * 7)));
            const month = weekDate.toLocaleDateString('en-US', { month: 'short' });

            if (month !== currentMonth) {
                const label = document.createElement('span');
                label.textContent = month;
                label.style.gridColumn = week + 1;
                monthLabels.appendChild(label);
                currentMonth = month;
            }
        }
        heatmap.appendChild(monthLabels);

        // Create day grid
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];

            const dataPoint = this.data.find(d => d.date === dateStr);
            const value = dataPoint ? dataPoint.value : 0;
            const level = this.getLevel(value);

            const cell = document.createElement('div');
            cell.className = 'heatmap-cell';
            cell.dataset.date = dateStr;
            cell.dataset.value = value;
            cell.dataset.level = level;
            cell.style.animationDelay = `${i * 5}ms`;

            // Tooltip
            cell.addEventListener('mouseenter', (e) => {
                this.showTooltip(e, { date: dateStr, value });
            });
            cell.addEventListener('mouseleave', () => {
                this.hideTooltip();
            });

            grid.appendChild(cell);
        }

        heatmap.appendChild(grid);
        this.container.innerHTML = '';
        this.container.appendChild(heatmap);
    }

    getLevel(value) {
        if (value === 0) return 0;
        if (value < 25) return 1;
        if (value < 50) return 2;
        if (value < 75) return 3;
        return 4;
    }

    showTooltip(event, data) {
        let tooltip = document.getElementById('heatmap-tooltip');
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.id = 'heatmap-tooltip';
            tooltip.className = 'heatmap-tooltip';
            document.body.appendChild(tooltip);
        }

        const date = new Date(data.date);
        const formatted = date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });

        tooltip.innerHTML = `
            <div class="tooltip-date">${formatted}</div>
            <div class="tooltip-value">${data.value}% Adherence</div>
        `;

        tooltip.style.left = event.clientX + 10 + 'px';
        tooltip.style.top = event.clientY + 10 + 'px';
        tooltip.style.opacity = '1';
    }

    hideTooltip() {
        const tooltip = document.getElementById('heatmap-tooltip');
        if (tooltip) {
            tooltip.style.opacity = '0';
        }
    }

    updateData(newData) {
        this.data = newData;
        this.render();
    }
}

// ═══ ACHIEVEMENT EXPORT ═══
class AchievementExport {
    static async exportAsImage(badgeId) {
        const badge = AchievementSystem.badges[badgeId];
        if (!badge) return;

        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.width = 1080;
        canvas.height = 1080;
        const ctx = canvas.getContext('2d');

        // Background gradient
        const gradient = ctx.createLinearGradient(0, 0, 1080, 1080);
        gradient.addColorStop(0, '#000000');
        gradient.addColorStop(1, '#1a1a1a');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 1080, 1080);

        // Add noise texture
        this.addNoiseTexture(ctx, 1080, 1080);

        // Border
        ctx.strokeStyle = this.getRarityColor(badge.rarity);
        ctx.lineWidth = 8;
        ctx.strokeRect(40, 40, 1000, 1000);

        // Logo
        ctx.fillStyle = '#D4AF37';
        ctx.font = 'bold 48px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('CLARITY PROTOCOL', 540, 120);

        // Badge icon
        ctx.font = '200px Arial';
        ctx.fillText(badge.icon, 540, 420);

        // Badge name
        ctx.fillStyle = '#EAEAEA';
        ctx.font = 'bold 64px Inter, sans-serif';
        ctx.fillText(badge.name.toUpperCase(), 540, 580);

        // Description
        ctx.fillStyle = '#888';
        ctx.font = '32px Inter, sans-serif';
        const words = badge.description.split(' ');
        let line = '';
        let y = 680;

        for (let word of words) {
            const testLine = line + word + ' ';
            const metrics = ctx.measureText(testLine);
            if (metrics.width > 800 && line !== '') {
                ctx.fillText(line, 540, y);
                line = word + ' ';
                y += 50;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line, 540, y);

        // Rarity badge
        ctx.fillStyle = this.getRarityColor(badge.rarity);
        ctx.font = 'bold 28px Inter, sans-serif';
        ctx.fillText(badge.rarity.toUpperCase(), 540, 880);

        // Date
        const date = new Date().toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
        ctx.fillStyle = '#666';
        ctx.font = '24px monospace';
        ctx.fillText(`UNLOCKED: ${date}`, 540, 960);

        // Download
        const link = document.createElement('a');
        link.download = `clarity-protocol-${badgeId}.png`;
        link.href = canvas.toDataURL();
        link.click();
    }

    static addNoiseTexture(ctx, width, height) {
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            const noise = Math.random() * 20 - 10;
            data[i] += noise;     // R
            data[i + 1] += noise; // G
            data[i + 2] += noise; // B
        }

        ctx.putImageData(imageData, 0, 0);
    }

    static getRarityColor(rarity) {
        switch (rarity) {
            case 'legendary': return '#FFD700';
            case 'epic': return '#9C27B0';
            case 'rare': return '#2196F3';
            default: return '#AAA';
        }
    }

    static exportAllUnlocked() {
        const unlocked = AchievementSystem.getUnlocked();
        unlocked.forEach((badgeId, index) => {
            setTimeout(() => {
                this.exportAsImage(badgeId);
            }, index * 500);
        });
    }
}

// ═══ SWIPE NAVIGATION ═══
class SwipeNavigation {
    static init() {
        const sections = ['dashboard', 'protocols', 'library', 'logistics'];
        let currentIndex = 0;

        // Add touch gestures to body
        const touchGestures = new TouchGestures(document.body);

        document.body.addEventListener('swipeleft', () => {
            currentIndex = Math.min(currentIndex + 1, sections.length - 1);
            this.navigateToSection(sections[currentIndex]);
        });

        document.body.addEventListener('swiperight', () => {
            currentIndex = Math.max(currentIndex - 1, 0);
            this.navigateToSection(sections[currentIndex]);
        });

        // Pull-to-refresh
        document.body.addEventListener('pullrefresh', () => {
            this.refreshData();
        });
    }

    static navigateToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });

            // Update nav active state
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + sectionId) {
                    link.classList.add('active');
                }
            });
        }
    }

    static async refreshData() {
        // Simulate data refresh
        const pullIndicator = document.getElementById('pull-indicator');
        if (pullIndicator) {
            pullIndicator.classList.add('loading');
        }

        // Refresh biometrics
        if (typeof simulateBiometrics !== 'undefined') {
            await simulateBiometrics();
        }

        setTimeout(() => {
            if (pullIndicator) {
                pullIndicator.classList.remove('loading');
            }
        }, 1500);
    }
}

// ═══ EXPORT ═══
export {
    TouchGestures,
    HeatmapCalendar,
    AchievementExport,
    SwipeNavigation
};
