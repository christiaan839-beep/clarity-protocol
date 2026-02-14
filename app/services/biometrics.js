/* ═══════════════════════════════════════════════════════════════
   THE CLARITY PROTOCOL — Biometric Service Layer
   Handles data ingestion, normalization, and API OAuth flows.
   ═══════════════════════════════════════════════════════════════ */

// ═══ TYPES ═══
/**
 * Unified Metric Object
 * @typedef {Object} SovereigntyMetric
 * @property {number} hrv - Heart Rate Variability (ms)
 * @property {number} sleep_score - Sleep Quality (0-100)
 * @property {number} recovery_score - Recovery Index (0-100)
 * @property {string} source - 'Oura', 'Samsung', 'Garmin', or 'Mock'
 * @property {number} timestamp - Unix timestamp
 */

class DataNormalizer {
    static normalizeSamsung(data) {
        // Transform Samsung Health JSON structure
        return {
            hrv: data.heart_rate_variability || 0,
            sleep_score: this.calculateSamsungSleepScore(data.sleep),
            recovery_score: data.stress_score ? 100 - data.stress_score : 50,
            source: 'Samsung',
            timestamp: Date.now()
        };
    }

    static normalizeOura(data) {
        // Transform Oura Ring V2 API structure
        return {
            hrv: data.readiness?.score_hrv_balance || 0,
            sleep_score: data.sleep?.score || 0,
            recovery_score: data.readiness?.score || 0,
            source: 'Oura',
            timestamp: Date.now()
        };
    }

    static calculateSamsungSleepScore(sleepData) {
        if (!sleepData) return 0;
        // Mock simple algorithm
        return Math.min(100, (sleepData.duration / 480) * 100);
    }
}

class SamsungHealthAdapter {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = "https://api.samsung.com/health/v2";
    }

    async connect() {
        console.log("Initiating OAuth 2.0 flow with Samsung Health...");
        // In a real app, this would redirect to Samsung Login
        return new Promise(resolve => setTimeout(() => resolve(true), 1500));
    }

    async fetchDaily() {
        // Mock API Call
        return {
            heart_rate_variability: Math.floor(Math.random() * (120 - 40) + 40),
            sleep: { duration: 460, efficiency: 92 },
            stress_score: Math.floor(Math.random() * 40)
        };
    }
}

class OuraAdapter {
    constructor(token) {
        this.token = token;
        this.baseUrl = "https://api.ouraring.com/v2";
    }

    async connect() {
        console.log("Verifying Oura Personal Access Token...");
        return new Promise(resolve => setTimeout(() => resolve(true), 1200));
    }

    async fetchDaily() {
        // Mock API Call matching Oura V2 response structure
        return {
            readiness: { score: Math.floor(Math.random() * (99 - 60) + 60), score_hrv_balance: Math.floor(Math.random() * 100) },
            sleep: { score: Math.floor(Math.random() * (95 - 70) + 70) }
        };
    }
}

export class BiometricService {
    constructor() {
        this.sources = {
            samsung: new SamsungHealthAdapter('mock_key'),
            oura: new OuraAdapter('mock_token')
        };
        this.activeSource = 'samsung'; // Default
    }

    async sync() {
        try {
            console.log(`Syncing with ${this.activeSource}...`);
            let rawData, normalizedData;

            if (this.activeSource === 'samsung') {
                await this.sources.samsung.connect();
                rawData = await this.sources.samsung.fetchDaily();
                normalizedData = DataNormalizer.normalizeSamsung(rawData);
            } else if (this.activeSource === 'oura') {
                await this.sources.oura.connect();
                rawData = await this.sources.oura.fetchDaily();
                normalizedData = DataNormalizer.normalizeOura(rawData);
            }

            return normalizedData;

        } catch (error) {
            console.error("Biometric Sync Failed:", error);
            return null;
        }
    }

    setSource(sourceName) {
        if (this.sources[sourceName]) {
            this.activeSource = sourceName;
            return true;
        }
        return false;
    }
}
