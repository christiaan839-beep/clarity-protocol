/**
 * ═══════════════════════════════════════════════════════════════
 * THE SOVEREIGN BUILD MAP (12-WEEKS)
 * Objective: Transition from "Managed Illness" to "Biological Autonomy"
 * ═══════════════════════════════════════════════════════════════
 */

import { SovereignData } from './SovereignData.js';

export const SovereignBuild = {
    PHASES: {
        I: {
            id: 1,
            title: "PHASE I: HARDWARE CLEANUP",
            weeks: [1, 4],
            focus: "ENVIRONMENTAL DETOX",
            gate: "Kitchen Audit (Black Bag)",
            protocols: ["Seed Oil Purge", "Phthalate Elimination", "Water Filtration"],
            status: "active"
        },
        II: {
            id: 2,
            title: "PHASE II: THE OS UPDATE",
            weeks: [5, 8],
            focus: "CIRCADIAN CALIBRATION",
            gate: "Solar Consistency (14 Days)",
            protocols: ["Solar Loading", "Digital Twilight", "Thermal Layer (11/60)"],
            status: "locked"
        },
        III: {
            id: 3,
            title: "PHASE III: ANTIGRAVITY SOVEREIGNTY",
            weeks: [9, 12],
            focus: "MECHANICAL MASTERY",
            gate: "GlycanAge Benchmark",
            protocols: ["High-CNS Skills", "Greasing the Groove", "Sovereign Dividend"],
            status: "locked"
        }
    },

    /**
     * Calculates the current build week based on start date.
     */
    getCurrentWeek() {
        const startStr = SovereignData.get(SovereignData.KEYS.START_DATE);
        if (!startStr) {
            // If no start date, we are in Pre-Launch or Week 1
            return 1;
        }
        const start = new Date(startStr);
        const now = new Date();
        const diffTime = Math.abs(now - start);
        const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
        return Math.min(diffWeeks, 12); // Cap at 12
    },

    getCurrentPhase() {
        const week = this.getCurrentWeek();
        if (week <= 4) return this.PHASES.I;
        if (week <= 8) return this.PHASES.II;
        return this.PHASES.III;
    },

    /**
     * Checks if the user is compliant with the Phase Gate
     * (e.g., Have they finished the Kitchen Audit to really 'unlock' Phase II?)
     */
    checkPhaseCompliance() {
        const phase = this.getCurrentPhase();
        if (phase.id === 1) {
            // Check SovereignData for Kitchen Audit
            const audit = SovereignData.get(SovereignData.KEYS.TACTICAL_SWEEP + '_' + SovereignData.get(SovereignData.KEYS.MODE), []);
            // Simple gate: Just need to have started/done some audit items
            return audit.length > 0;
        }
        return true; // Auto-pass for demo purposes for now
    },

    /**
     * Returns the Visualizer Logic based on Mode
     * Male -> Streak, Female -> Seasonal Wheel
     */
    getVisualizerMode(gender) {
        if (gender === 'FEMININE') return 'SEASONAL_WHEEL';
        return 'LINEAR_STREAK';
    }
};
