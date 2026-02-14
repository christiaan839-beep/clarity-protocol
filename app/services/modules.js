/* ═══════════════════════════════════════════════════════════════
   MODULE MANAGEMENT SYSTEM
   Course modules, progress tracking, completion badges
   ═══════════════════════════════════════════════════════════════ */

// ═══ MODULE DATA STRUCTURE ═══
const COURSE_MODULES = [
    // PHASE 1: BIOLOGICAL DEFENSE
    {
        id: 'mod-1-1',
        phase: 1,
        number: 1,
        title: 'Understanding Your Biology',
        category: 'Foundation',
        difficulty: 'Beginner',
        duration: 15,
        description: 'Learn the fundamental principles of biology that govern your performance and health.',
        objectives: [
            'Understand circadian biology',
            'Learn about hormonal cascades',
            'Identify biological optimization levers'
        ],
        pdfUrl: '/pdfs/bio-audit.pdf',
        prerequisite: null
    },
    {
        id: 'mod-1-2',
        phase: 1,
        number: 2,
        title: 'The Sun Protocol',
        category: 'Light',
        difficulty: 'Beginner',
        duration: 20,
        description: 'Master morning sun exposure and its profound impact on hormones, mood, and energy.',
        objectives: [
            'Optimal timing for sun exposure',
            'Understanding UV benefits',
            'Implementing the sunrise ritual'
        ],
        pdfUrl: '/pdfs/sun-protocol.pdf',
        prerequisite: 'mod-1-1'
    },
    {
        id: 'mod-1-3',
        phase: 1,
        number: 3,
        title: 'Sleep Architecture',
        category: 'Recovery',
        difficulty: 'Intermediate',
        duration: 25,
        description: 'Build the foundation for elite recovery through optimized sleep cycles.',
        objectives: [
            'Sleep cycle optimization',
            'REM and deep sleep maximization',
            'Temperature regulation'
        ],
        pdfUrl: '/pdfs/sleep-guide.pdf',
        prerequisite: 'mod-1-2'
    },

    // PHASE 2: ENVIRONMENTAL CONTROL
    {
        id: 'mod-2-1',
        phase: 2,
        number: 1,
        title: 'Light Exposure Mastery',
        category: 'Light',
        difficulty: 'Intermediate',
        duration: 20,
        description: 'Advanced strategies for using light as the most powerful biological lever.',
        objectives: [
            'Blue light blocking protocols',
            'Red light therapy applications',
            'Creating circadian-aligned environments'
        ],
        pdfUrl: '/pdfs/light-mastery.pdf',
        prerequisite: 'mod-1-3'
    },
    {
        id: 'mod-2-2',
        phase: 2,
        number: 2,
        title: 'Temperature Regulation',
        category: 'Environment',
        difficulty: 'Intermediate',
        duration: 18,
        description: 'Harness thermal stress for metabolic optimization and resilience building.',
        objectives: [
            'Cold exposure protocols',
            'Heat therapy benefits',
            'Temperature variation strategies'
        ],
        pdfUrl: '/pdfs/thermal-protocol.pdf',
        prerequisite: 'mod-2-1'
    },
    {
        id: 'mod-2-3',
        phase: 2,
        number: 3,
        title: 'Air Quality Optimization',
        category: 'Environment',
        difficulty: 'Beginner',
        duration: 12,
        description: 'Create an environment that supports cellular respiration and mitochondrial function.',
        objectives: [
            'Indoor air quality assessment',
            'Ventilation strategies',
            'Toxin elimination'
        ],
        pdfUrl: '/pdfs/air-quality.pdf',
        prerequisite: 'mod-2-1'
    },

    // PHASE 3: NUTRITIONAL SOVEREIGNTY
    {
        id: 'mod-3-1',
        phase: 3,
        number: 1,
        title: 'Seed Oil Elimination',
        category: 'Nutrition',
        difficulty: 'Beginner',
        duration: 15,
        description: 'Remove inflammatory seed oils and replace with ancestral fats.',
        objectives: [
            'Identify hidden seed oils',
            'Optimal fat sources',
            'Oil swap strategies'
        ],
        pdfUrl: '/pdfs/seed-oil-guide.pdf',
        prerequisite: 'mod-1-1'
    },
    {
        id: 'mod-3-2',
        phase: 3,
        number: 2,
        title: 'Protein Optimization',
        category: 'Nutrition',
        difficulty: 'Intermediate',
        duration: 22,
        description: 'Calculate and optimize protein intake for your performance goals.',
        objectives: [
            'Protein timing strategies',
            'Source quality assessment',
            'Leucine threshold understanding'
        ],
        pdfUrl: '/pdfs/protein-guide.pdf',
        prerequisite: 'mod-3-1'
    },
    {
        id: 'mod-3-3',
        phase: 3,
        number: 3,
        title: 'Meal Timing Strategies',
        category: 'Nutrition',
        difficulty: 'Advanced',
        duration: 25,
        description: 'Master circadian-aligned eating for metabolic efficiency.',
        objectives: [
            'Time-restricted eating protocols',
            'Pre/post-exercise nutrition',
            'Fasting strategies'
        ],
        pdfUrl: '/pdfs/meal-timing.pdf',
        prerequisite: 'mod-3-2'
    },

    // PHASE 4: RECOVERY & RESILIENCE
    {
        id: 'mod-4-1',
        phase: 4,
        number: 1,
        title: 'Cold Exposure Basics',
        category: 'Recovery',
        difficulty: 'Beginner',
        duration: 18,
        description: 'Introduction to cold plunges, ice baths, and cold showers.',
        objectives: [
            'Safe cold exposure protocols',
            'Progressive adaptation',
            'Metabolic benefits'
        ],
        pdfUrl: '/pdfs/cold-exposure.pdf',
        prerequisite: 'mod-2-2'
    },
    {
        id: 'mod-4-2',
        phase: 4,
        number: 2,
        title: 'Heat Therapy',
        category: 'Recovery',
        difficulty: 'Intermediate',
        duration: 20,
        description: 'Sauna protocols for longevity, detoxification, and cardiovascular health.',
        objectives: [
            'Optimal sauna duration/temperature',
            'Heat shock proteins',
            'Recovery timing'
        ],
        pdfUrl: '/pdfs/heat-therapy.pdf',
        prerequisite: 'mod-4-1'
    },
    {
        id: 'mod-4-3',
        phase: 4,
        number: 3,
        title: 'Active Recovery',
        category: 'Movement',
        difficulty: 'Intermediate',
        duration: 15,
        description: 'Movement strategies that enhance recovery rather than hinder it.',
        objectives: [
            'Low-intensity movement protocols',
            'Walking optimization',
            'Recovery day strategies'
        ],
        pdfUrl: '/pdfs/active-recovery.pdf',
        prerequisite: 'mod-4-2'
    }
];

// ═══ MODULE MANAGER CLASS ═══
class ModuleManager {
    constructor() {
        this.modules = COURSE_MODULES;
        this.progress = this.loadProgress();
    }

    loadProgress() {
        const saved = localStorage.getItem('clarity_module_progress');
        return saved ? JSON.parse(saved) : {};
    }

    saveProgress() {
        localStorage.setItem('clarity_module_progress', JSON.stringify(this.progress));
    }

    getModule(moduleId) {
        return this.modules.find(m => m.id === moduleId);
    }

    getAllModules() {
        return this.modules;
    }

    getModulesByPhase(phase) {
        return this.modules.filter(m => m.phase === phase);
    }

    getModulesByCategory(category) {
        return this.modules.filter(m => m.category === category);
    }

    isUnlocked(moduleId) {
        const module = this.getModule(moduleId);
        if (!module) return false;
        if (!module.prerequisite) return true;

        return this.isCompleted(module.prerequisite);
    }

    getProgress(moduleId) {
        return this.progress[moduleId] || { completed: false, progress: 0, startedAt: null, completedAt: null };
    }

    isCompleted(moduleId) {
        return this.progress[moduleId]?.completed || false;
    }

    startModule(moduleId) {
        if (!this.progress[moduleId]) {
            this.progress[moduleId] = {
                completed: false,
                progress: 0,
                startedAt: Date.now(),
                completedAt: null
            };
            this.saveProgress();
        }
    }

    updateProgress(moduleId, progress) {
        if (!this.progress[moduleId]) {
            this.startModule(moduleId);
        }

        this.progress[moduleId].progress = Math.min(100, Math.max(0, progress));
        this.saveProgress();
    }

    completeModule(moduleId) {
        if (!this.progress[moduleId]) {
            this.startModule(moduleId);
        }

        this.progress[moduleId].completed = true;
        this.progress[moduleId].progress = 100;
        this.progress[moduleId].completedAt = Date.now();
        this.saveProgress();

        // Show completion celebration
        this.showCompletionModal(moduleId);

        // Track with analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'module_complete', {
                event_category: 'learning',
                event_label: moduleId
            });
        }
    }

    showCompletionModal(moduleId) {
        const module = this.getModule(moduleId);
        if (!module) return;

        const modal = document.createElement('div');
        modal.className = 'completion-modal';
        modal.innerHTML = `
            <div class="completion-content glass-card-premium">
                <div class="completion-icon">🎉</div>
                <h2>Module Complete!</h2>
                <h3>${module.title}</h3>
                <p>You've successfully completed this module.</p>
                <div class="completion-stats">
                    <div class="stat">
                        <span class="stat-value">${module.duration} min</span>
                        <span class="stat-label">Invested</span>
                    </div>
                    <div class="stat">
                        <span class="stat-value">${this.getCompletedCount()}</span>
                        <span class="stat-label">Total Completed</span>
                    </div>
                </div>
                <button class="btn-continue-learning">Continue Learning</button>
            </div>
        `;

        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('visible'), 100);

        modal.querySelector('.btn-continue-learning').addEventListener('click', () => {
            modal.classList.remove('visible');
            setTimeout(() => modal.remove(), 300);
        });
    }

    getCompletedCount() {
        return Object.values(this.progress).filter(p => p.completed).length;
    }

    getTotalProgress() {
        const completed = this.getCompletedCount();
        const total = this.modules.length;
        return Math.round((completed / total) * 100);
    }

    searchModules(query) {
        const lowerQuery = query.toLowerCase();
        return this.modules.filter(module =>
            module.title.toLowerCase().includes(lowerQuery) ||
            module.description.toLowerCase().includes(lowerQuery) ||
            module.category.toLowerCase().includes(lowerQuery) ||
            module.objectives.some(obj => obj.toLowerCase().includes(lowerQuery))
        );
    }

    filterModules(filters) {
        let filtered = this.modules;

        if (filters.category && filters.category !== 'All') {
            filtered = filtered.filter(m => m.category === filters.category);
        }

        if (filters.difficulty) {
            filtered = filtered.filter(m => m.difficulty === filters.difficulty);
        }

        if (filters.status === 'completed') {
            filtered = filtered.filter(m => this.isCompleted(m.id));
        } else if (filters.status === 'in-progress') {
            filtered = filtered.filter(m =>
                this.progress[m.id] && !this.isCompleted(m.id)
            );
        } else if (filters.status === 'not-started') {
            filtered = filtered.filter(m => !this.progress[m.id]);
        }

        return filtered;
    }

    getNextModule() {
        // Find the first uncompleted module
        for (const module of this.modules) {
            if (!this.isCompleted(module.id) && this.isUnlocked(module.id)) {
                return module;
            }
        }
        return null;
    }
}

// ═══ EXPORT ═══
export { ModuleManager, COURSE_MODULES };
