/**
 * ═══════════════════════════════════════════════════════════════
 * NEURAL FATIGUE SWITCH
 * Objective: Real-time adaptation of CNS Load.
 * ═══════════════════════════════════════════════════════════════
 */

export const NeuralFatigue = {
    ZONES: {
        PRIMED: { range: [1, 4], label: "NEURAL PRIMED", action: "HIGH CNS LOAD" },
        ACCUMULATION: { range: [5, 7], label: "ACCUMULATING LOAD", action: "MODERATE CNS" },
        FRIED: { range: [8, 10], label: "CNS FRIED", action: "PARASYMPATHETIC OVERRIDE" }
    },

    getZone(score) {
        if (score <= 4) return this.ZONES.PRIMED;
        if (score <= 7) return this.ZONES.ACCUMULATION;
        return this.ZONES.FRIED;
    },

    /**
     * Modifies the Daily Protocol based on Fatigue Score.
     * @param {Array} originalProtocol - The default protocol from Male/Female Track
     * @param {Number} score - 1-10 User Input
     */
    optimizeProtocol(originalProtocol, score) {
        const zone = this.getZone(score);

        if (zone === this.ZONES.FRIED) {
            // override: Remove intense items, add recovery
            return [
                {
                    phase: "MORNING",
                    time: "07:00",
                    items: [
                        { id: "nf_1", type: "bio", text: "Cortisol Pulse (Solar)", completed: false },
                        { id: "nf_2", type: "recovery", text: "Parasympathetic Reset (Legs Up Wall)", completed: false } // Replacement
                    ]
                },
                {
                    phase: "TRAINING",
                    time: "10:00",
                    items: [
                        { id: "nf_3", type: "move", text: "Walk 30min (Zone 1 Only)", completed: false },
                        { id: "nf_4", type: "recovery", text: "Cold Plunge 3min (Flush Grid)", completed: false }
                    ]
                },
                {
                    phase: "EVENING",
                    time: "20:00",
                    items: [
                        { id: "nf_5", type: "sleep", text: "Digital Twilight (Shields Up)", completed: false },
                        { id: "nf_6", type: "sleep", text: "Magnesium Glycinate Load", completed: false }
                    ]
                }
            ];
        }

        // Return original if not fried (for now, or add subtle mods for accumulation)
        return originalProtocol;
    }
};
