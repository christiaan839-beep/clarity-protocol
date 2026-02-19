/**
 * ═══════════════════════════════════════════════════════════
 * FIREBASE CONFIG — Clarity Protocol
 * ═══════════════════════════════════════════════════════════
 * Firebase client-side API keys are safe to expose publicly.
 * Server-side enforcement is handled by firestore.rules.
 */

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getAuth, GoogleAuthProvider } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import {
    getFirestore,
    enableIndexedDbPersistence
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

const firebaseConfig = {
    apiKey: "AIzaSyB5gIi8um0vXzbwdaizGQeUjU4a9JrnB5I",
    authDomain: "clarity-protocol-app.firebaseapp.com",
    projectId: "clarity-protocol-app",
    storageBucket: "clarity-protocol-app.firebasestorage.app",
    messagingSenderId: "916883435917",
    appId: "1:916883435917:web:ec08b94161568bca31cdc4",
    measurementId: "G-1CXESV59P0"
};

const app = initializeApp(firebaseConfig);

// Auth
export const auth = getAuth(app);

// Google Auth Provider — request email + profile
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('email');
googleProvider.addScope('profile');
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Firestore — enable offline persistence (IndexedDB)
// Users on slow/offline connections will still see their latest data
export const db = getFirestore(app);
enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
        // Multiple tabs open — persistence only available in one tab at a time
        console.warn('[Firestore] Offline persistence unavailable (multiple tabs)');
    } else if (err.code === 'unimplemented') {
        // Browser doesn't support IndexedDB
        console.warn('[Firestore] Browser does not support offline persistence');
    }
});

