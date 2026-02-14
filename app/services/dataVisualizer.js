/* ═══════════════════════════════════════════════════════════════
   DATA VISUALIZER SERVICE
   Real-time charts, progress rings, and data visualization
   ═══════════════════════════════════════════════════════════════ */

export class DataVisualizer {
    /**
     * Create an animated HRV trend line chart
     * @param {string} containerId - DOM element ID
     * @param {Array} data - Array of {date, value} objects
     */
    static createHRVChart(containerId, data) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const width = container.clientWidth || 400;
        const height = 200;
        const padding = { top: 20, right: 20, bottom: 30, left: 40 };

        // Create SVG
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', width);
        svg.setAttribute('height', height);
        svg.setAttribute('class', 'hrv-chart');

        // Calculate scales
        const maxValue = Math.max(...data.map(d => d.value));
        const minValue = Math.min(...data.map(d => d.value));
        const xScale = (index) => padding.left + (index / (data.length - 1)) * (width - padding.left - padding.right);
        const yScale = (value) => height - padding.bottom - ((value - minValue) / (maxValue - minValue)) * (height - padding.top - padding.bottom);

        // Create gradient for line
        const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        gradient.setAttribute('id', 'hrvGradient');
        gradient.setAttribute('x1', '0%');
        gradient.setAttribute('y1', '0%');
        gradient.setAttribute('x2', '0%');
        gradient.setAttribute('y2', '100%');
        gradient.innerHTML = `
            <stop offset="0%" style="stop-color:#4CAF50;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#FFC107;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#F44336;stop-opacity:1" />
        `;
        svg.appendChild(gradient);

        // Create path
        let pathD = data.map((d, i) => {
            const x = xScale(i);
            const y = yScale(d.value);
            return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
        }).join(' ');

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', pathD);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', 'url(#hrvGradient)');
        path.setAttribute('stroke-width', '3');
        path.setAttribute('stroke-linecap', 'round');

        // Animate path drawing
        const pathLength = path.getTotalLength();
        path.style.strokeDasharray = pathLength;
        path.style.strokeDashoffset = pathLength;
        path.style.animation = 'drawLine 2s ease-out forwards';

        svg.appendChild(path);

        // Add data points
        data.forEach((d, i) => {
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', xScale(i));
            circle.setAttribute('cy', yScale(d.value));
            circle.setAttribute('r', '4');
            circle.setAttribute('fill', 'var(--gold)');
            circle.setAttribute('class', 'data-point');
            circle.style.opacity = '0';
            circle.style.animation = `fadeInPoint 0.3s ease-out ${0.5 + i * 0.1}s forwards`;

            // Tooltip on hover
            circle.addEventListener('mouseenter', (e) => {
                this.showTooltip(e, d);
            });
            circle.addEventListener('mouseleave', () => {
                this.hideTooltip();
            });

            svg.appendChild(circle);
        });

        container.innerHTML = '';
        container.appendChild(svg);

        // Add CSS animations
        if (!document.getElementById('chart-animations')) {
            const style = document.createElement('style');
            style.id = 'chart-animations';
            style.textContent = `
                @keyframes drawLine {
                    to { stroke-dashoffset: 0; }
                }
                @keyframes fadeInPoint {
                    to { opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    /**
     * Create an animated progress ring
     * @param {string} containerId - DOM element ID
     * @param {number} percent - Progress percentage (0-100)
     * @param {string} label - Label text
     * @param {string} color - Ring color
     */
    static createProgressRing(containerId, percent, label, color = 'var(--gold)') {
        const container = document.getElementById(containerId);
        if (!container) return;

        const size = 120;
        const strokeWidth = 8;
        const radius = (size - strokeWidth) / 2;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (percent / 100) * circumference;

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', size);
        svg.setAttribute('height', size);
        svg.setAttribute('class', 'progress-ring');

        // Background circle
        const bgCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        bgCircle.setAttribute('cx', size / 2);
        bgCircle.setAttribute('cy', size / 2);
        bgCircle.setAttribute('r', radius);
        bgCircle.setAttribute('fill', 'none');
        bgCircle.setAttribute('stroke', 'rgba(255,255,255,0.05)');
        bgCircle.setAttribute('stroke-width', strokeWidth);

        // Progress circle
        const progressCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        progressCircle.setAttribute('cx', size / 2);
        progressCircle.setAttribute('cy', size / 2);
        progressCircle.setAttribute('r', radius);
        progressCircle.setAttribute('fill', 'none');
        progressCircle.setAttribute('stroke', color);
        progressCircle.setAttribute('stroke-width', strokeWidth);
        progressCircle.setAttribute('stroke-linecap', 'round');
        progressCircle.setAttribute('stroke-dasharray', circumference);
        progressCircle.setAttribute('stroke-dashoffset', circumference);
        progressCircle.setAttribute('transform', `rotate(-90 ${size / 2} ${size / 2})`);
        progressCircle.style.filter = `drop-shadow(0 0 8px ${color})`;

        // Animate
        setTimeout(() => {
            progressCircle.style.transition = 'stroke-dashoffset 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
            progressCircle.setAttribute('stroke-dashoffset', offset);
        }, 100);

        // Text
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', size / 2);
        text.setAttribute('y', size / 2);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('dominant-baseline', 'central');
        text.setAttribute('fill', 'var(--signal)');
        text.setAttribute('font-size', '28');
        text.setAttribute('font-weight', '700');
        text.setAttribute('font-family', 'var(--font-display)');

        // Animate number
        let currentPercent = 0;
        const duration = 1500;
        const startTime = Date.now();

        const animateNumber = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // Ease out cubic
            currentPercent = Math.round(eased * percent);
            text.textContent = currentPercent;

            if (progress < 1) {
                requestAnimationFrame(animateNumber);
            }
        };
        animateNumber();

        svg.appendChild(bgCircle);
        svg.appendChild(progressCircle);
        svg.appendChild(text);

        container.innerHTML = '';
        container.appendChild(svg);

        if (label) {
            const labelEl = document.createElement('div');
            labelEl.textContent = label;
            labelEl.style.textAlign = 'center';
            labelEl.style.marginTop = '8px';
            labelEl.style.fontSize = '0.75rem';
            labelEl.style.color = 'var(--signal-dim)';
            container.appendChild(labelEl);
        }
    }

    /**
     * Create a heatmap calendar (GitHub-style contributions)
     * @param {string} containerId - DOM element ID
     * @param {Array} data - Array of {date: 'YYYY-MM-DD', value: 0-100}
     */
    static createHeatmap(containerId, data) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const cellSize = 12;
        const cellGap = 3;
        const weeks = 13;

        const heatmap = document.createElement('div');
        heatmap.className = 'heatmap-grid';
        heatmap.style.display = 'grid';
        heatmap.style.gridTemplateColumns = `repeat(${weeks}, ${cellSize}px)`;
        heatmap.style.gap = `${cellGap}px`;

        // Generate last 90 days
        const today = new Date();
        for (let i = 90; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];

            const dataPoint = data.find(d => d.date === dateStr);
            const value = dataPoint ? dataPoint.value : 0;

            const cell = document.createElement('div');
            cell.className = 'heatmap-cell';
            cell.style.width = `${cellSize}px`;
            cell.style.height = `${cellSize}px`;
            cell.style.borderRadius = '2px';
            cell.style.backgroundColor = this.getHeatmapColor(value);
            cell.style.opacity = '0';
            cell.style.animation = `fadeIn 0.3s ease-out ${i * 0.01}s forwards`;
            cell.dataset.date = dateStr;
            cell.dataset.value = value;

            // Tooltip
            cell.addEventListener('mouseenter', (e) => {
                this.showTooltip(e, { date: dateStr, value });
            });
            cell.addEventListener('mouseleave', () => {
                this.hideTooltip();
            });

            heatmap.appendChild(cell);
        }

        container.innerHTML = '';
        container.appendChild(heatmap);
    }

    /**
     * Get heatmap color based on value
     */
    static getHeatmapColor(value) {
        if (value === 0) return 'rgba(255,255,255,0.03)';
        if (value < 25) return 'rgba(212, 175, 55, 0.2)';
        if (value < 50) return 'rgba(212, 175, 55, 0.4)';
        if (value < 75) return 'rgba(212, 175, 55, 0.6)';
        return 'rgba(212, 175, 55, 0.9)';
    }

    /**
     * Show tooltip
     */
    static showTooltip(event, data) {
        let tooltip = document.getElementById('chart-tooltip');
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.id = 'chart-tooltip';
            tooltip.style.position = 'fixed';
            tooltip.style.background = 'rgba(0,0,0,0.95)';
            tooltip.style.color = 'var(--gold)';
            tooltip.style.padding = '8px 12px';
            tooltip.style.borderRadius = '6px';
            tooltip.style.fontSize = '0.75rem';
            tooltip.style.pointerEvents = 'none';
            tooltip.style.zIndex = '10000';
            tooltip.style.border = '1px solid var(--gold-dim)';
            tooltip.style.backdropFilter = 'blur(10px)';
            document.body.appendChild(tooltip);
        }

        tooltip.innerHTML = data.date
            ? `<div><strong>${data.date}</strong></div><div>Score: ${data.value}%</div>`
            : `<div><strong>HRV:</strong> ${data.value} ms</div>`;

        tooltip.style.left = event.clientX + 10 + 'px';
        tooltip.style.top = event.clientY + 10 + 'px';
        tooltip.style.opacity = '1';
    }

    /**
     * Hide tooltip
     */
    static hideTooltip() {
        const tooltip = document.getElementById('chart-tooltip');
        if (tooltip) {
            tooltip.style.opacity = '0';
        }
    }
}

// Add fadeIn animation if not exists
if (!document.getElementById('viz-animations')) {
    const style = document.createElement('style');
    style.id = 'viz-animations';
    style.textContent = `
        @keyframes fadeIn {
            to { opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}
