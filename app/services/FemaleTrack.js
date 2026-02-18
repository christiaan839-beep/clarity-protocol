/**
 * ═══════════════════════════════════════════════════════════════
 * FEMALE TRACK: PHASIC FLOW (28D LOGIC)
 * ═══════════════════════════════════════════════════════════════
 */

import { SovereignData } from './SovereignData.js';

// Sourced from data/female_phasic.json
const FEMALE_ENGINE = {
    "seasons": {
        "winter": {
            "name": "WINTER (Menstrual)",
            "days": [1, 5],
            "bio_state": "All Hormones Low",
            "protocols": { "allowed": "Yoga, Walking", "forbidden": "HIIT, Heavy Lifting", "focus": "Restoration" }
        },
        "spring": {
            "name": "SPRING (Follicular)",
            "days": [6, 12],
            "bio_state": "Estrogen Rising",
            "protocols": { "allowed": "Skill Work, Handstands", "forbidden": "", "focus": "Neuroplasticity" }
        },
        "summer": {
            "name": "SUMMER (Ovulatory)",
            "days": [13, 17],
            "bio_state": "Estrogen & Test Peak",
            "protocols": { "allowed": "PR Attempts, HIIT", "forbidden": "", "focus": "Max Force" }
        },
        "autumn": {
            "name": "AUTUMN (Luteal)",
            "days": [18, 28],
            "bio_state": "Progesterone Rising",
            "protocols": { "allowed": "Pilates, Zone 2", "forbidden": "HIIT, Fasting", "focus": "Metabolic Stability" }
        }
    }
};

export const FemaleTrack = {
    getCycleDay() {
        const startStr = SovereignData.get('cycle_start_date');
        if (!startStr) return 1; // Default to Day 1
        const start = new Date(startStr);
        const now = new Date();
        const diff = Math.floor((now - start) / (1000 * 60 * 60 * 24));
        return (diff % 28) + 1;
    },

    getCurrentPhase() {
        const day = this.getCycleDay();
        if (day <= 5) return FEMALE_ENGINE.seasons.winter;
        if (day <= 12) return FEMALE_ENGINE.seasons.spring;
        if (day <= 17) return FEMALE_ENGINE.seasons.summer;
        return FEMALE_ENGINE.seasons.autumn;
    },

    getBioState() {
        const phase = this.getCurrentPhase();
        return `${phase.name} (Day ${this.getCycleDay()})`;
    },

    getDailyProtocol() {
        const phase = this.getCurrentPhase();
        const day = this.getCycleDay();

        let moveItem = { id: "f_2", type: "move", text: `Movement: ${phase.protocols.allowed}`, completed: false };
        let foodItem = { id: "f_3", type: "digest", text: `Nutrition: ${phase.protocols.focus} Diet`, completed: false };

        if (phase.protocols.forbidden) {
            moveItem.text += ` (NO ${phase.protocols.forbidden})`;
        }

        return [
            {
                phase: "MORNING",
                items: [
                    { id: "f_1", type: "bio", text: `Sync: Date ${day}/28 (${phase.bio_state})`, completed: false },
                    moveItem,
                    foodItem
                ]
            },
            {
                phase: "EVENING",
                items: [
                    { id: "f_4", type: "recovery", text: "Hormone Support: Magnesium", completed: false }
                ]
            }
        ];
    },

    setCycleStart(date) {
        SovereignData.set('cycle_start_date', date);
        // Trigger generic update if needed
    },

    getTruthArtifact() {
        return {
            title: "The Infradian Truth",
            text: "You are not a small man. HIIT in Luteal phase steals from Progesterone, causing burnout. Match intensity to biology."
        };
    }
};
