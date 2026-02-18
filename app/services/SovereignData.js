/**
 * ═══════════════════════════════════════════════════════════════
 * SOVEREIGN DATA LAYER
 * ═══════════════════════════════════════════════════════════════
 * Primary store: localStorage (instant, offline-first)
 * Cloud sync: Firestore (when signed in, syncs in background)
 * Guests: localStorage only — no cloud.
 */
import { db } from './firebase-config.js';
import { doc, setDoc, getDoc } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import { auth } from './firebase-config.js';

export const SovereignData = {
    // Core Keys
    KEYS: {
        MODE: 'clarity_mode', // 'MASCULINE' | 'FEMININE'
        USER_NAME: 'clarity_user_name',
        ONBOARDING_COMPLETE: 'clarity_onboarding_complete',
        START_DATE: 'clarity_start_date',
        LAST_ACTIVE: 'clarity_last_active',

        // Biological Data
        CYCLE_START_DATE: 'clarity_cycle_start', // For Feminine Track
        WAKE_TIME: 'clarity_wake_time', // For Linear Track

        // Protocol State
        DAILY_OPS: 'clarity_daily_ops_completed',
        TACTICAL_SWEEP: 'clarity_tactical_sweep',
        SOVEREIGNTY_SCORE: 'clarity_sovereignty_score',

        // Audit Data (Black Bag)
        KITCHEN_AUDIT: 'clarity_audit_kitchen',
        ENV_AUDIT: 'clarity_audit_env'
    },

    /**
     * Initialize the Sovereign Data Store
     * Checks for existing data and sets defaults if needed.
     */
    init() {
        if (!localStorage.getItem(this.KEYS.MODE)) {
            console.log("SovereignData: initializing new user vault.");
            // Default to Masculine, can be switched in onboarding
            this.set(this.KEYS.MODE, 'MASCULINE');
        }
        this.set(this.KEYS.LAST_ACTIVE, new Date().toISOString());
    },

    /**
     * GET Data from Local Vault
     * @param {string} key - Storage key
     * @param {*} fallback - Default value if null
     */
    get(key, fallback = null) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : fallback;
        } catch (e) {
            console.error("SovereignData: Read Error", e);
            return fallback;
        }
    },

    /**
     * SET Data to Local Vault
     * @param {string} key - Storage key
     * @param {*} value - Data to store
     */
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            // Trigger a custom event for reactivity across the app
            window.dispatchEvent(new CustomEvent('sovereign-data-update', {
                detail: { key, value }
            }));
            // Background sync to Firestore if signed in
            const uid = auth.currentUser?.uid;
            if (uid) {
                setDoc(doc(db, 'users', uid, 'data', key), { value }, { merge: true })
                    .catch(e => console.warn('[SovereignData] Firestore write:', e.message));
            }
        } catch (e) {
            console.error("SovereignData: Write Error (Quota Exceeded?)", e);
        }
    },

    /**
     * Pull user data from Firestore into localStorage (called on sign-in)
     */
    async syncFromCloud() {
        const uid = auth.currentUser?.uid;
        if (!uid) return;
        try {
            const keys = Object.values(this.KEYS);
            await Promise.all(keys.map(async (key) => {
                const snap = await getDoc(doc(db, 'users', uid, 'data', key));
                if (snap.exists()) {
                    localStorage.setItem(key, JSON.stringify(snap.data().value));
                }
            }));
            console.log('[SovereignData] Synced from cloud.');
            window.dispatchEvent(new CustomEvent('sovereign-cloud-synced'));
        } catch (e) {
            console.warn('[SovereignData] Cloud sync failed (offline?):', e.message);
        }
    },

    /**
     * Toggles a value in an array (for checklists)
     * @param {string} key 
     * @param {string} itemId 
     */
    toggleItem(key, itemId) {
        const list = this.get(key, []);
        let newList;
        if (list.includes(itemId)) {
            newList = list.filter(i => i !== itemId);
        } else {
            newList = [...list, itemId];
        }
        this.set(key, newList);
        return newList;
    },

    /**
     * HARD RESET (Authorized Use Only)
     * Wipes all Clarity data from the device.
     */
    purge() {
        const confirmed = confirm("WARNING: This will wipe all Sovereign Data. This cannot be undone.");
        if (confirmed) {
            Object.values(this.KEYS).forEach(key => localStorage.removeItem(key));
            location.reload();
        }
    }
};
