/**
 * n8n Function Node: Neural Fatigue Logic
 * Input: { "score": 5, "userId": "123" }
 */
const score = items[0].json.score;

let dispatchAction = {};

if (score <= 4) {
    dispatchAction = {
        status: "PRIMED",
        message: "Neural Prime Active. 50% GtG skill set starts now. Go heavy.",
        protocol_mod: "HIGH_CNS"
    };
} else if (score <= 7) {
    dispatchAction = {
        status: "ACCUMULATION",
        message: "Load Accumulating. Stick to the plan but zero ego lifting.",
        protocol_mod: "MODERATE"
    };
} else {
    dispatchAction = {
        status: "FRIED",
        message: "Override Active: Neural Fatigue Critical. Switching to Parasympathetic Reset.",
        protocol_mod: "RECOVERY_OVERRIDE"
    };
}

return [{
    json: dispatchAction
}];
