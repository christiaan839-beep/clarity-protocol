/**
 * ═══════════════════════════════════════════════════════════════
 * BIO-WEATHER SERVICE (LAB-IN-THE-LOOP)
 * Objective: Sync biology with local environmental data.
 * ═══════════════════════════════════════════════════════════════
 */

export const BioWeather = {
    // Simulated Lat/Long for "Sovereign Data" privacy default
    // In a real n8n integration, this would fetch from an API based on IP
    LOCATION: { lat: 34.05, lng: -118.24 }, // LA Default or User Local

    /**
     * Get Solar Context
     * Returns critical circadian timings.
     */
    getSolarContext() {
        // Mocking calculation for "Today"
        // Real implementation would use a library like 'suncalc'
        const now = new Date();
        const hour = now.getHours();

        return {
            sunrise: "06:12",
            sunset: "19:45",
            uv_index: this.mockUVIndex(hour),
            solar_noon: "13:00",
            is_daylight: hour > 6 && hour < 20
        };
    },

    /**
     * Mocks UV Index based on time of day curve
     */
    mockUVIndex(hour) {
        if (hour < 7 || hour > 19) return 0;
        if (hour === 13) return 11; // Peak
        return Math.max(0, 11 - Math.abs(13 - hour) * 2);
    },

    /**
     * Returns the "Environmental Trigger" for the dashboard
     */
    getEnvironmentTrigger() {
        const { uv_index, is_daylight } = this.getSolarContext();

        if (!is_daylight) return { type: "TWILIGHT", action: "Blue Light Defense", intensity: "HIGH" };
        if (uv_index > 6) return { type: "SOLAR PEAK", action: "Vitamin D Window", intensity: "MAX" };
        if (uv_index > 2) return { type: "SOLAR LOADING", action: "Circadian Anchor", intensity: "MODERATE" };

        return { type: "MORNING", action: "Cortisol Pulse", intensity: "LOW" };
    }
};
