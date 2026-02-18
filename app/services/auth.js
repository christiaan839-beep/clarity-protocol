/**
 * ═══════════════════════════════════════════════════════════
 * AUTH SERVICE — Clarity Protocol
 * Google Sign-In + Email/Password
 * ═══════════════════════════════════════════════════════════
 */

import { auth, googleProvider } from './firebase-config.js';
import {
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut as firebaseSignOut,
    onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';

export const AuthService = {
    currentUser: null,

    /**
     * Initialize auth listener — call once on app load
     */
    init() {
        onAuthStateChanged(auth, (user) => {
            this.currentUser = user;
            this._updateNavUI(user);
            // Notify app that auth state changed
            window.dispatchEvent(new CustomEvent('auth-state-changed', { detail: { user } }));
        });
    },

    /**
     * Sign in with Google popup
     */
    async signInWithGoogle() {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            return result.user;
        } catch (err) {
            console.error('[Auth] Google sign-in failed:', err.message);
            throw err;
        }
    },

    /**
     * Sign in with email and password
     */
    async signInWithEmail(email, password) {
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            return result.user;
        } catch (err) {
            console.error('[Auth] Email sign-in failed:', err.message);
            throw err;
        }
    },

    /**
     * Create account with email and password
     */
    async createAccount(email, password) {
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);
            return result.user;
        } catch (err) {
            console.error('[Auth] Account creation failed:', err.message);
            throw err;
        }
    },

    /**
     * Sign out
     */
    async signOut() {
        try {
            await firebaseSignOut(auth);
        } catch (err) {
            console.error('[Auth] Sign-out failed:', err.message);
        }
    },

    /**
     * Get current user UID (null if not signed in)
     */
    getUID() {
        return auth.currentUser?.uid || null;
    },

    /**
     * Update nav bar UI based on auth state
     */
    _updateNavUI(user) {
        const container = document.getElementById('auth-nav-btn');
        if (!container) return;

        if (user) {
            const photoURL = user.photoURL || '';
            const displayName = user.displayName || user.email?.split('@')[0] || 'Sovereign';
            container.innerHTML = `
                <div class="auth-user-chip">
                    ${photoURL
                    ? `<img src="${photoURL}" alt="${displayName}" class="auth-avatar">`
                    : `<div class="auth-avatar-placeholder">${displayName[0].toUpperCase()}</div>`
                }
                    <span class="auth-name">${displayName}</span>
                    <button class="auth-signout-btn" id="signout-btn" title="Sign Out">✕</button>
                </div>`;
            document.getElementById('signout-btn')?.addEventListener('click', () => this.signOut());
        } else {
            container.innerHTML = `
                <button class="auth-signin-btn" id="signin-google-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Sign In
                </button>`;
            document.getElementById('signin-google-btn')?.addEventListener('click', () => this.signInWithGoogle());
        }
    }
};
