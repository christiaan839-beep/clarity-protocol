/**
 * ═══════════════════════════════════════════════════════════════
 * MALE TRACK: LINEAR DRIVE (24H LOGIC)
 * ═══════════════════════════════════════════════════════════════
 */

// Sourced from data/male_linear.json
const MALE_ENGINE = {
    "schedule": {
        "0600_neural_prime": {
            "title": "THE NEURAL PRIME",
            "trigger": "Sunlight (Cortisol Pulse)",
            "protocol": {
                "name": "Greasing the Groove (GtG)",
                "volume": "50% Max Reps",
                "focus": "Myelination / Skill Acquisition",
                "exercises": ["Planche Lean", "Front Lever", "One-Arm Pushup"]
            },
            "why": "High Testosterone + Low Fatigue = Pure Neural Adaptation."
        },
        "1600_power_burst": {
            "title": "THE POWER BURST",
            "trigger": "Core Temp Peak (HGH Catalyst)",
            "protocol": {
                "name": "Mechanical Tension",
                "volume": "High Intensity / Hypertrophy",
                "focus": "Power / Structure",
                "exercises": ["Weighted Dips", "Muscle-Ups", "Pseudo-Planche Pushups"]
            },
            "why": "Joints lubricated. Core temp max. Window for structural growth."
        },
        "1700_thermal_shock": {
            "title": "THE THERMAL SHOCK",
            "trigger": "Post-Workout Recovery",
            "protocol": {
                "name": "11/60 Contrast",
                "details": "20m Sauna (80°C) -> 3m Cold Plunge (10°C)",
                "mechanism": "Norepinephrine Surge (530%) + HSP Refolding"
            },
            "why": "Clear brain fog. Repair muscle damage."
        }
    }
};

export const MaleTrack = {
    getBioState() {
        const hour = new Date().getHours();
        if (hour >= 6 && hour < 10) return "TESTOSTERONE PEAK (Neural Drive)";
        if (hour >= 16 && hour < 19) return "CORE TEMP PEAK (Power)";
        if (hour >= 21) return "MELATONIN ONSET (Deep Sleep)";
        return "BASELINE (Linear)";
    },

    getDailyProtocol() {
        const s = MALE_ENGINE.schedule;

        return [
            {
                phase: "MORNING (06:00)",
                items: [
                    { id: "m_1", type: "bio", text: `Sunlight: ${s["0600_neural_prime"].trigger}`, completed: false },
                    { id: "m_2", type: "move", text: `GtG: ${s["0600_neural_prime"].protocol.exercises[0]} (50% Max)`, completed: false },
                    { id: "m_3", type: "digest", text: "Hydration: 1L Water + Electrolytes", completed: false }
                ]
            },
            {
                phase: "AFTERNOON (16:00)",
                items: [
                    { id: "m_4", type: "move", text: `Power: ${s["1600_power_burst"].protocol.exercises[0]} (Heavy)`, completed: false },
                    { id: "m_5", type: "recovery", text: `Thermal: ${s["1700_thermal_shock"].protocol.details}`, completed: false }
                ]
            }
        ];
    },

    getTruthArtifact() {
        return {
            title: "The GtG Truth",
            text: "Strength is a skill. GtG thickens the myelin sheath, upgrading your body's fiber optics."
        };
    }
};
