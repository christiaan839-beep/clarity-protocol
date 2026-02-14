/* ═══════════════════════════════════════════════════════════════
   ACHIEVEMENT SYSTEM
   Gamification, badges, and progress milestones
   ═══════════════════════════════════════════════════════════════ */

export class AchievementSystem {
    static badges = {
        thermal_warrior: {
            id: 'thermal_warrior',
            name: 'Thermal Warrior',
            description: 'Complete 60 minutes of thermal protocol in a week',
            icon: '❄️🔥',
            requirement: { type: 'thermal_minutes', value: 60 },
            rarity: 'rare'
        },
        sunrise_sentinel: {
            id: 'sunrise_sentinel',
            name: 'Sunrise Sentinel',
            description: '30-day morning sunlight streak',
            icon: '☀️',
            requirement: { type: 'sunlight_streak', value: 30 },
            rarity: 'epic'
        },
        planche_master: {
            id: 'planche_master',
            name: 'Planche Master',
            description: 'Unlock Level 10 in Push pillar',
            icon: '💪',
            requirement: { type: 'skill_level', pillar: 'push_planche', value: 10 },
            rarity: 'legendary'
        },
        perfect_week: {
            id: 'perfect_week',
            name: 'Perfect Week',
            description: '100% protocol adherence for 7 days',
            icon: '✨',
            requirement: { type: 'adherence_streak', value: 7 },
            rarity: 'rare'
        },
        sovereignty_elite: {
            id: 'sovereignty_elite',
            name: 'Sovereignty Elite',
            description: 'Maintain 90+ Clarity Index for 30 days',
            icon: '👑',
            requirement: { type: 'score_threshold', value: 90, days: 30 },
            rarity: 'legendary'
        },
        cold_crusader: {
            id: 'cold_crusader',
            name: 'Cold Crusader',
            description: 'Complete 100 cold plunge sessions',
            icon: '🧊',
            requirement: { type: 'cold_sessions', value: 100 },
            rarity: 'epic'
        },
        biohacker_initiate: {
            id: 'biohacker_initiate',
            name: 'Biohacker Initiate',
            description: 'Connect first biometric device',
            icon: '🔬',
            requirement: { type: 'bio_connected', value: 1 },
            rarity: 'common'
        },
        protocol_scholar: {
            id: 'protocol_scholar',
            name: 'Protocol Scholar',
            description: 'Read all 7 protocol guides',
            icon: '📚',
            requirement: { type: 'guides_read', value: 7 },
            rarity: 'rare'
        }
    };

    /**
     * Check all achievements and unlock if requirements met
     * @param {Object} userStats - User statistics object
     * @returns {Array} - Newly unlocked achievements
     */
    static checkAndUnlock(userStats) {
        const unlockedBadges = this.getUnlocked();
        const newlyUnlocked = [];

        Object.values(this.badges).forEach(badge => {
            if (unlockedBadges.includes(badge.id)) return;

            if (this.meetsRequirement(badge.requirement, userStats)) {
                this.unlock(badge.id);
                newlyUnlocked.push(badge);
                this.celebrate(badge);
            }
        });

        return newlyUnlocked;
    }

    /**
     * Check if requirement is met
     */
    static meetsRequirement(req, stats) {
        switch (req.type) {
            case 'thermal_minutes':
                return (stats.thermal_minutes_week || 0) >= req.value;
            case 'sunlight_streak':
                return (stats.sunlight_streak || 0) >= req.value;
            case 'skill_level':
                const pillarLevels = stats.skill_tree?.[req.pillar] || [];
                return pillarLevels.includes(req.value);
            case 'adherence_streak':
                return (stats.adherence_streak || 0) >= req.value;
            case 'score_threshold':
                return (stats.high_score_days || 0) >= req.days;
            case 'cold_sessions':
                return (stats.cold_sessions_total || 0) >= req.value;
            case 'bio_connected':
                return !!stats.bio_device_connected;
            case 'guides_read':
                return (stats.guides_read || []).length >= req.value;
            default:
                return false;
        }
    }

    /**
     * Unlock a badge
     */
    static unlock(badgeId) {
        const unlocked = this.getUnlocked();
        if (!unlocked.includes(badgeId)) {
            unlocked.push(badgeId);
            localStorage.setItem('clarity_achievements', JSON.stringify(unlocked));
        }
    }

    /**
     * Get all unlocked badges
     */
    static getUnlocked() {
        try {
            return JSON.parse(localStorage.getItem('clarity_achievements')) || [];
        } catch {
            return [];
        }
    }

    /**
     * Celebrate achievement unlock with animation
     */
    static celebrate(badge) {
        // Create celebration modal
        const modal = document.createElement('div');
        modal.className = 'achievement-modal';
        modal.innerHTML = `
            <div class="achievement-card achievement-${badge.rarity}">
                <div class="achievement-icon">${badge.icon}</div>
                <div class="achievement-name">${badge.name}</div>
                <div class="achievement-desc">${badge.description}</div>
                <div class="achievement-rarity">${badge.rarity.toUpperCase()}</div>
            </div>
        `;

        // Add styles if not exists
        if (!document.getElementById('achievement-styles')) {
            const style = document.createElement('style');
            style.id = 'achievement-styles';
            style.textContent = `
                .achievement-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.9);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10000;
                    animation: fadeIn 0.3s ease-out;
                }
                .achievement-card {
                    background: linear-gradient(135deg, rgba(212,175,55,0.1), rgba(20,20,20,0.9));
                    border: 2px solid var(--gold);
                    border-radius: 16px;
                    padding: 48px;
                    text-align: center;
                    animation: achievementCelebrate 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
                    box-shadow: 0 0 60px var(--gold-dim), 0 20px 80px rgba(0,0,0,0.5);
                    max-width: 400px;
                }
                .achievement-legendary {
                    border-color: #FFD700;
                    box-shadow: 0 0 80px rgba(255,215,0,0.5), 0 20px 80px rgba(0,0,0,0.5);
                }
                .achievement-epic {
                    border-color: #9C27B0;
                    box-shadow: 0 0 60px rgba(156,39,176,0.4), 0 20px 80px rgba(0,0,0,0.5);
                }
                .achievement-rare {
                    border-color: #2196F3;
                }
                .achievement-icon {
                    font-size: 80px;
                    margin-bottom: 24px;
                    animation: float 2s ease-in-out infinite;
                }
                .achievement-name {
                    font-family: var(--font-display);
                    font-size: 28px;
                    font-weight: 700;
                    color: var(--gold);
                    margin-bottom: 12px;
                }
                .achievement-desc {
                    font-size: 16px;
                    color: var(--signal-dim);
                    margin-bottom: 24px;
                }
                .achievement-rarity {
                    font-size: 12px;
                    font-weight: 700;
                    letter-spacing: 3px;
                    color: var(--gold);
                }
                @keyframes achievementCelebrate {
                    0% {
                        transform: scale(0.5) rotate(-10deg);
                        opacity: 0;
                    }
                    60% {
                        transform: scale(1.1) rotate(2deg);
                    }
                    100% {
                        transform: scale(1) rotate(0);
                        opacity: 1;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(modal);

        // Haptic feedback
        if ('vibrate' in navigator) {
            navigator.vibrate([100, 50, 100, 50, 200]);
        }

        // Sound effect (optional - can add audio element)
        // const audio = new Audio('achievement.mp3');
        // audio.play();

        // Confetti effect (simple version)
        this.spawnConfetti();

        // Auto-close after 4 seconds
        setTimeout(() => {
            modal.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => modal.remove(), 300);
        }, 4000);

        // Click to close
        modal.addEventListener('click', () => {
            modal.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => modal.remove(), 300);
        });
    }

    /**
     * Spawn confetti particles
     */
    static spawnConfetti() {
        const colors = ['#D4AF37', '#FFFFFF', '#FFD700', '#FFC107'];
        const particleCount = 50;

        for (let i = 0; i < particleCount; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.className = 'confetti-particle';
                particle.style.cssText = `
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    width: 10px;
                    height: 10px;
                    background: ${colors[Math.floor(Math.random() * colors.length)]};
                    pointer-events: none;
                    z-index: 10001;
                    border-radius: 50%;
                `;

                const angle = (Math.random() * 360) * (Math.PI / 180);
                const velocity = 200 + Math.random() * 300;
                const vx = Math.cos(angle) * velocity;
                const vy = Math.sin(angle) * velocity - 200;

                document.body.appendChild(particle);

                let x = 0, y = 0, vy_current = vy;
                const gravity = 800;
                const startTime = Date.now();

                const animate = () => {
                    const elapsed = (Date.now() - startTime) / 1000;
                    x = vx * elapsed;
                    y = vy * elapsed + 0.5 * gravity * elapsed * elapsed;

                    particle.style.transform = `translate(${x}px, ${y}px) rotate(${elapsed * 360}deg)`;
                    particle.style.opacity = Math.max(0, 1 - elapsed / 2);

                    if (elapsed < 2) {
                        requestAnimationFrame(animate);
                    } else {
                        particle.remove();
                    }
                };

                animate();
            }, i * 20);
        }
    }

    /**
     * Get achievement progress
     */
    static getProgress() {
        const unlocked = this.getUnlocked();
        const total = Object.keys(this.badges).length;
        return {
            unlocked: unlocked.length,
            total,
            percent: Math.round((unlocked.length / total) * 100)
        };
    }

    /**
     * Render achievement showcase
     */
    static renderShowcase(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const unlocked = this.getUnlocked();
        const progress = this.getProgress();

        const html = `
            <div class="achievement-showcase">
                <div class="achievement-header">
                    <h3>Achievements</h3>
                    <div class="achievement-progress">${progress.unlocked}/${progress.total} (${progress.percent}%)</div>
                </div>
                <div class="achievement-grid">
                    ${Object.values(this.badges).map(badge => `
                        <div class="achievement-badge ${unlocked.includes(badge.id) ? 'unlocked' : 'locked'}" 
                             data-tooltip="${badge.description}">
                            <div class="badge-icon">${badge.icon}</div>
                            <div class="badge-name">${badge.name}</div>
                            <div class="badge-rarity rarity-${badge.rarity}">${badge.rarity}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        container.innerHTML = html;
    }
}

// Add fadeOut animation
if (!document.getElementById('achievement-fadeout')) {
    const style = document.createElement('style');
    style.id = 'achievement-fadeout';
    style.textContent = `
        @keyframes fadeOut {
            to { opacity: 0; transform: scale(0.9); }
        }
    `;
    document.head.appendChild(style);
}
