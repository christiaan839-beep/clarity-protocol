/**
 * COMPLIANCE MONITOR AGENT
 * Checks if user is stuck in Phase I (Hardware Cleanup) for > 7 Days.
 */

// Mock Database of Users
const USERS = [
    { email: "fast_mover@example.com", start_date: "2026-02-10", sweep_complete: true },
    { email: "laggard@example.com", start_date: "2026-02-01", sweep_complete: false } // Started > 7 days ago
];

function checkCompliance() {
    console.log("[AUDIT AGENT] Running Routine Compliance Check...");
    const now = new Date();

    USERS.forEach(user => {
        if (!user.sweep_complete) {
            const start = new Date(user.start_date);
            const diffTime = Math.abs(now - start);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays > 7) {
                console.log(`[ALERT] User ${user.email} is Non-Compliant (Day ${diffDays}).`);
                dispatchTruthStudy(user.email);
            }
        }
    });
}

function dispatchTruthStudy(email) {
    console.log(`[DISPATCH] Sending 'Commercial Determinant' Truth-Study to ${email}. Subject: "Why You Are Self-Sabotaging"`);
    // n8n webhook trigger here
}

// Run Check
checkCompliance();
