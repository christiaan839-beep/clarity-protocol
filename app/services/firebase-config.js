/**
 * ═══════════════════════════════════════════════════════════
 * FIREBASE CONFIG — Clarity Protocol
 * ═══════════════════════════════════════════════════════════
 * Firebase API keys are safe to expose client-side.
 * Rules are enforced server-side via firestore.rules.
 */

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getAuth, GoogleAuthProvider } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

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
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
