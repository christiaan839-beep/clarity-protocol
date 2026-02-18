/**
 * ═══════════════════════════════════════════════════════════════
 * KNOWLEDGE ARSENAL: THE TRUTH LAYER
 * "We verify, then we trust."
 * ═══════════════════════════════════════════════════════════════
 */

export const KnowledgeArsenal = {
    ARTIFACTS: [
        {
            id: "norepi_surge",
            title: "The 530% Surge",
            tag: "THERMAL",
            citation: "Šrámek et al. (2000)",
            summary: "Cold water immersion (14°C/57°F) for 1 hour increased metabolic rate by 350% and plasma norepinephrine by 530%.",
            mechanism: "Cold Shock > Locus Coeruleus Activation > Focus/Vigilance.",
            action: "Protocol: 11 mins/week total. 3 min sessions."
        },
        {
            id: "hsp_dividend",
            title: "The HSP Dividend",
            tag: "RECOVERY",
            citation: "Laukkanen et al. (2015)",
            summary: "Regular sauna use (4-7x week) associated with 40% reduction in all-cause mortality.",
            mechanism: "Heat Shock Proteins (HSP70) refold misfolded proteins and clear cellular debris.",
            action: "Protocol: 57 mins/week total. 175°F+."
        },
        {
            id: "via_negativa",
            title: "Via Negativa Logic",
            tag: "MINDSET",
            citation: "Taleb / Biological Plausibility",
            summary: "The addition of a supplement has lower ROI than the removal of a toxin. Biology is subtractive.",
            mechanism: "Elimination of Endocrine Disruptors (Phthalates, Seed Oils) restores baseline.",
            action: "Protocol: The Black Bag Audit."
        },
        {
            id: "glycan_clock",
            title: "The Glycan Clock",
            tag: "LONGEVITY",
            citation: "GlycanAge / IgG Glycosylation",
            summary: "Biological age is best measured by the state of your immune system (IgG glycans), not just methylation.",
            mechanism: "Inflammatory markers change glycan structures on antibodies.",
            action: "Protocol: Annual Benchmark."
        }
    ],

    getDailyTruth() {
        // Rotates based on day of year or random for now
        const index = new Date().getDate() % this.ARTIFACTS.length;
        return this.ARTIFACTS[index];
    }
};
