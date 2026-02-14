/* ═══════════════════════════════════════════════════════════════
   SOCIAL SHARING & COMMUNITY FEATURES
   Achievement sharing, leaderboards, and community challenges
   ═══════════════════════════════════════════════════════════════ */

// ═══ SOCIAL SHARING ═══
class SocialSharing {
    static shareAchievement(badge) {
        const shareData = {
            title: `🏆 ${badge.name} Unlocked!`,
            text: `I just unlocked "${badge.name}" in the Clarity Protocol! ${badge.description}`,
            url: window.location.href
        };

        // Check if Web Share API is supported
        if (navigator.share) {
            navigator.share(shareData)
                .then(() => {
                    console.log('✅ Shared successfully');
                    this.trackShare('achievement', badge.name, 'native');
                })
                .catch((error) => {
                    console.log('❌ Share failed:', error);
                    this.fallbackShare(shareData);
                });
        } else {
            this.fallbackShare(shareData);
        }
    }

    static fallbackShare(data) {
        // Show custom share modal with platform options
        const modal = document.createElement('div');
        modal.className = 'share-modal';
        modal.innerHTML = `
            <div class="share-modal-content glass-card-premium">
                <h3>Share Your Achievement</h3>
                <div class="share-buttons">
                    <button class="share-btn twitter" data-platform="twitter">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                        </svg>
                        Twitter
                    </button>
                    <button class="share-btn linkedin" data-platform="linkedin">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"></path>
                            <circle cx="4" cy="4" r="2"></circle>
                        </svg>
                        LinkedIn
                    </button>
                    <button class="share-btn facebook" data-platform="facebook">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                        </svg>
                        Facebook
                    </button>
                    <button class="share-btn copy" data-platform="copy">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                        Copy Link
                    </button>
                </div>
                <button class="close-share">✕</button>
            </div>
        `;

        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('visible'), 100);

        // Platform handlers
        modal.querySelectorAll('.share-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const platform = btn.dataset.platform;
                this.shareToPlatform(platform, data);
                modal.classList.remove('visible');
                setTimeout(() => modal.remove(), 300);
            });
        });

        modal.querySelector('.close-share').addEventListener('click', () => {
            modal.classList.remove('visible');
            setTimeout(() => modal.remove(), 300);
        });
    }

    static shareToPlatform(platform, data) {
        const url = encodeURIComponent(data.url || window.location.href);
        const text = encodeURIComponent(data.text);
        const title = encodeURIComponent(data.title);

        let shareUrl;

        switch (platform) {
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
                break;
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
                break;
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`;
                break;
            case 'copy':
                navigator.clipboard.writeText(data.url || window.location.href);
                this.showToast('✅ Link copied to clipboard!');
                this.trackShare('achievement', title, 'copy');
                return;
        }

        if (shareUrl) {
            window.open(shareUrl, '_blank', 'width=600,height=400');
            this.trackShare('achievement', title, platform);
        }
    }

    static showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => toast.classList.add('visible'), 100);
        setTimeout(() => {
            toast.classList.remove('visible');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    static trackShare(type, label, platform) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'share', {
                event_category: type,
                event_label: label,
                method: platform
            });
        }
    }
}

// ═══ LEADERBOARD ═══
class Leaderboard {
    constructor(apiEndpoint = '/api/leaderboard') {
        this.apiEndpoint = apiEndpoint;
        this.cache = null;
        this.cacheExpiry = 5 * 60 * 1000; // 5 minutes
    }

    async fetch() {
        // Check cache first
        if (this.cache && Date.now() < this.cache.expiry) {
            return this.cache.data;
        }

        try {
            // In production, replace with actual API call
            const response = await this.mockFetch();

            this.cache = {
                data: response,
                expiry: Date.now() + this.cacheExpiry
            };

            return response;
        } catch (error) {
            console.error('Failed to fetch leaderboard:', error);
            return [];
        }
    }

    async mockFetch() {
        // Mock leaderboard data
        return [
            { rank: 1, username: 'EliteWarrior', score: 2850, streak: 45, avatar: '💪' },
            { rank: 2, username: 'BioHacker99', score: 2720, streak: 38, avatar: '🧬' },
            { rank: 3, username: 'ProtocolKing', score: 2680, streak: 42, avatar: '👑' },
            { rank: 4, username: 'ClarityMaster', score: 2540, streak: 35, avatar: '⚡' },
            { rank: 5, username: 'ThermalGod', score: 2490, streak: 30, avatar: '❄️' }
        ];
    }

    async render(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const data = await this.fetch();

        container.innerHTML = `
            <div class="leaderboard-container glass-card-premium">
                <div class="leaderboard-header">
                    <h3>🏆 GLOBAL LEADERBOARD</h3>
                    <span class="leaderboard-subtitle">Top Protocol Adherents</span>
                </div>
                <div class="leaderboard-list">
                    ${data.map(user => `
                        <div class="leaderboard-item rank-${user.rank}">
                            <span class="rank">${user.rank}</span>
                            <span class="avatar">${user.avatar}</span>
                            <div class="user-info">
                                <span class="username">${user.username}</span>
                                <span class="streak">${user.streak} day streak</span>
                            </div>
                            <span class="score">${user.score.toLocaleString()}</span>
                        </div>
                    `).join('')}
                </div>
                <button class="btn-view-full-leaderboard">View Full Leaderboard</button>
            </div>
        `;
    }

    async submitScore(username, score, streak) {
        // In production, POST to actual API
        console.log('📊 Submitting score:', { username, score, streak });

        // Mock submission
        return { success: true, rank: Math.floor(Math.random() * 100) + 1 };
    }
}

// ═══ COMMUNITY CHALLENGES ═══
class CommunityChallenges {
    constructor() {
        this.activeChallenges = [];
        this.loadChallenges();
    }

    loadChallenges() {
        // Mock challenges - replace with API call in production
        this.activeChallenges = [
            {
                id: 'cold-plunge-week',
                name: '7-Day Cold Plunge Challenge',
                description: 'Complete a cold plunge every day for 7 days',
                startDate: new Date('2026-02-10'),
                endDate: new Date('2026-02-16'),
                participants: 1247,
                reward: 'Cold Crusader Badge',
                icon: '❄️'
            },
            {
                id: 'sunrise-streak',
                name: 'Sunrise Warrior',
                description: 'Get morning sun exposure for 30 days straight',
                startDate: new Date('2026-02-01'),
                endDate: new Date('2026-03-02'),
                participants: 3521,
                reward: 'Sunrise Sentinel Badge',
                icon: '☀️'
            },
            {
                id: 'perfect-protocol',
                name: 'Perfect Protocol Month',
                description: '100% adherence for 30 days',
                startDate: new Date('2026-02-01'),
                endDate: new Date('2026-02-28'),
                participants: 892,
                reward: 'Sovereignty Elite Badge',
                icon: '⚡'
            }
        ];
    }

    render(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = `
            <div class="challenges-container">
                <h3>🎯 COMMUNITY CHALLENGES</h3>
                <div class="challenges-grid">
                    ${this.activeChallenges.map(challenge => {
            const daysLeft = Math.ceil((challenge.endDate - new Date()) / (1000 * 60 * 60 * 24));
            const progress = this.getUserProgress(challenge.id);

            return `
                            <div class="challenge-card glass-card-premium">
                                <div class="challenge-icon">${challenge.icon}</div>
                                <h4>${challenge.name}</h4>
                                <p>${challenge.description}</p>
                                <div class="challenge-stats">
                                    <span>${challenge.participants.toLocaleString()} participating</span>
                                    <span>${daysLeft} days left</span>
                                </div>
                                <div class="challenge-progress">
                                    <div class="progress-bar">
                                        <div class="progress-fill" style="width: ${progress}%"></div>
                                    </div>
                                    <span>${progress}% complete</span>
                                </div>
                                <button class="btn-join-challenge" data-id="${challenge.id}">
                                    ${progress > 0 ? 'Continue' : 'Join'} Challenge
                                </button>
                            </div>
                        `;
        }).join('')}
                </div>
            </div>
        `;

        // Add event listeners
        container.querySelectorAll('.btn-join-challenge').forEach(btn => {
            btn.addEventListener('click', () => {
                this.joinChallenge(btn.dataset.id);
            });
        });
    }

    getUserProgress(challengeId) {
        // Get user's progress from localStorage
        const progress = localStorage.getItem(`challenge_${challengeId}`);
        return progress ? parseInt(progress) : 0;
    }

    joinChallenge(challengeId) {
        const challenge = this.activeChallenges.find(c => c.id === challengeId);
        if (!challenge) return;

        // Track join event
        if (typeof gtag !== 'undefined') {
            gtag('event', 'join_challenge', {
                event_category: 'community',
                event_label: challenge.name
            });
        }

        SocialSharing.showToast(`✅ Joined ${challenge.name}!`);

        // Initialize progress
        localStorage.setItem(`challenge_${challengeId}`, '0');
    }

    updateProgress(challengeId, progress) {
        localStorage.setItem(`challenge_${challengeId}`, progress.toString());

        // Check if completed
        if (progress >= 100) {
            this.completeChallenge(challengeId);
        }
    }

    completeChallenge(challengeId) {
        const challenge = this.activeChallenges.find(c => c.id === challengeId);
        if (!challenge) return;

        // Show completion modal
        const modal = document.createElement('div');
        modal.className = 'challenge-complete-modal';
        modal.innerHTML = `
            <div class="modal-content glass-card-premium">
                <div class="confetti-container"></div>
                <h2>🎉 Challenge Complete!</h2>
                <h3>${challenge.name}</h3>
                <p>You've earned: ${challenge.reward}</p>
                <button class="btn-share-achievement">Share Achievement</button>
                <button class="btn-close-modal">Continue</button>
            </div>
        `;

        document.body.appendChild(modal);

        // Trigger confetti
        this.triggerConfetti(modal.querySelector('.confetti-container'));

        // Share button
        modal.querySelector('.btn-share-achievement').addEventListener('click', () => {
            SocialSharing.shareAchievement({
                name: challenge.name,
                description: `Completed the ${challenge.name} community challenge!`
            });
        });

        // Close button
        modal.querySelector('.btn-close-modal').addEventListener('click', () => {
            modal.remove();
        });
    }

    triggerConfetti(container) {
        // Simple confetti animation
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.animationDelay = Math.random() * 2 + 's';
            confetti.style.backgroundColor = ['#D4AF37', '#F4D03F', '#FFD700'][Math.floor(Math.random() * 3)];
            container.appendChild(confetti);
        }
    }
}

// ═══ EXPORT ═══
export {
    SocialSharing,
    Leaderboard,
    CommunityChallenges
};
