/**
 * ═══════════════════════════════════════════════════════════
 * AUTH SERVICE — Clarity Protocol
 * Hardened: IndexedDB persistence, toast notifications,
 * loading states, smooth transitions, graceful error UI
 * ═══════════════════════════════════════════════════════════
 */

import { auth, googleProvider } from './firebase-config.js';
import {
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    browserLocalPersistence,
    setPersistence
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';

// ─── Toast Notification System ──────────────────────────────────────────────
function showToast(message, type = 'info', duration = 3500) {
    // Remove any existing toast
    document.querySelector('.clarity-toast')?.remove();

    const icons = {
        success: '✦',
        error: '⚠',
        info: '◆',
        warning: '◇'
    };

    const toast = document.createElement('div');
    toast.className = `clarity-toast clarity-toast--${type}`;
    toast.innerHTML = `
        <span class="toast-icon">${icons[type] || icons.info}</span>
        <span class="toast-msg">${message}</span>
    `;

    // Inject toast styles if not already present
    if (!document.getElementById('toast-styles')) {
        const style = document.createElement('style');
        style.id = 'toast-styles';
        style.textContent = `
            .clarity-toast {
                position: fixed;
                bottom: 2rem;
                left: 50%;
                transform: translateX(-50%) translateY(20px);
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 12px 20px;
                background: rgba(15, 15, 15, 0.95);
                border: 1px solid rgba(255,255,255,0.08);
                border-radius: 50px;
                font-family: 'Inter', sans-serif;
                font-size: 0.8rem;
                font-weight: 500;
                color: #eaeaea;
                z-index: 9999;
                opacity: 0;
                backdrop-filter: blur(12px);
                -webkit-backdrop-filter: blur(12px);
                transition: opacity 0.3s ease, transform 0.3s ease;
                pointer-events: none;
                letter-spacing: 0.3px;
            }
            .clarity-toast--success { border-color: rgba(76,175,80,0.4); }
            .clarity-toast--success .toast-icon { color: #4CAF50; }
            .clarity-toast--error { border-color: rgba(255,68,68,0.4); }
            .clarity-toast--error .toast-icon { color: #FF4444; }
            .clarity-toast--info { border-color: rgba(212,175,55,0.3); }
            .clarity-toast--info .toast-icon { color: #D4AF37; }
            .clarity-toast.show {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(toast);
    // Trigger animation
    requestAnimationFrame(() => {
        requestAnimationFrame(() => toast.classList.add('show'));
    });

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 350);
    }, duration);
}

// ─── Friendly Error Messages ──────────────────────────────────────────────
function getAuthErrorMessage(code) {
    const messages = {
        'auth/popup-closed-by-user': 'Sign-in cancelled.',
        'auth/popup-blocked': 'Popup blocked — please allow popups for this site.',
        'auth/cancelled-popup-request': 'Sign-in cancelled.',
        'auth/network-request-failed': 'Network error — check your connection.',
        'auth/too-many-requests': 'Too many attempts — please wait a moment.',
        'auth/user-not-found': 'No account found with that email.',
        'auth/wrong-password': 'Incorrect password.',
        'auth/email-already-in-use': 'An account with this email already exists.',
        'auth/invalid-email': 'Please enter a valid email address.',
        'auth/weak-password': 'Password must be at least 6 characters.',
        'auth/requires-recent-login': 'Please sign in again to continue.',
    };
    return messages[code] || 'Something went wrong — please try again.';
}

// ─── AuthService ─────────────────────────────────────────────────────────────
export const AuthService = {
    currentUser: null,
    _isLoading: false,

    /**
     * Initialize auth — call ONCE on app load.
     * Sets IndexedDB persistence so users stay signed in across tabs & reloads.
     */
    async init() {
        // Persist session in IndexedDB (survives tab close)
        try {
            await setPersistence(auth, browserLocalPersistence);
        } catch (e) {
            console.warn('[Auth] Could not set persistence:', e.message);
        }

        onAuthStateChanged(auth, (user) => {
            this.currentUser = user;
            this._updateNavUI(user);
            window.dispatchEvent(new CustomEvent('auth-state-changed', { detail: { user } }));
        });
    },

    /**
     * Google Sign-In with popup
     */
    async signInWithGoogle() {
        if (this._isLoading) return;
        this._setLoading(true);
        try {
            const result = await signInWithPopup(auth, googleProvider);
            showToast(`Welcome back, ${result.user.displayName?.split(' ')[0] || 'Sovereign'} ✦`, 'success');
            return result.user;
        } catch (err) {
            if (!['auth/popup-closed-by-user', 'auth/cancelled-popup-request'].includes(err.code)) {
                showToast(getAuthErrorMessage(err.code), 'error');
            }
            console.error('[Auth] Google sign-in:', err.code);
        } finally {
            this._setLoading(false);
        }
    },

    /**
     * Email/Password Sign-In
     */
    async signInWithEmail(email, password) {
        if (this._isLoading) return;
        this._setLoading(true);
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            showToast(`Welcome back ✦`, 'success');
            return result.user;
        } catch (err) {
            showToast(getAuthErrorMessage(err.code), 'error');
            console.error('[Auth] Email sign-in:', err.code);
            throw err;
        } finally {
            this._setLoading(false);
        }
    },

    /**
     * Create account with email + password
     */
    async createAccount(email, password) {
        if (this._isLoading) return;
        this._setLoading(true);
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);
            showToast('Account created — welcome to the Protocol ✦', 'success');
            return result.user;
        } catch (err) {
            showToast(getAuthErrorMessage(err.code), 'error');
            console.error('[Auth] Account creation:', err.code);
            throw err;
        } finally {
            this._setLoading(false);
        }
    },

    /**
     * Sign out
     */
    async signOut() {
        try {
            await firebaseSignOut(auth);
            showToast('Signed out', 'info', 2000);
        } catch (err) {
            showToast('Sign-out failed — try again.', 'error');
            console.error('[Auth] Sign-out:', err.message);
        }
    },

    getUID() {
        return auth.currentUser?.uid || null;
    },

    /**
     * Set the sign-in button to a loading/disabled state during async calls
     */
    _setLoading(state) {
        this._isLoading = state;
        const btn = document.getElementById('signin-google-btn');
        if (!btn) return;
        if (state) {
            btn.disabled = true;
            btn.style.opacity = '0.6';
            btn.style.cursor = 'not-allowed';
            btn.querySelector('span')?.replaceWith((() => { const s = document.createElement('span'); s.textContent = 'Signing in…'; return s; })());
        } else {
            btn.disabled = false;
            btn.style.opacity = '';
            btn.style.cursor = '';
        }
    },

    /**
     * Update nav bar UI with smooth fade transition
     */
    _updateNavUI(user) {
        const container = document.getElementById('auth-nav-btn');
        if (!container) return;

        // Fade out → swap → fade in
        container.style.transition = 'opacity 0.2s ease';
        container.style.opacity = '0';

        setTimeout(() => {
            if (user) {
                const photoURL = user.photoURL || '';
                const displayName = user.displayName || user.email?.split('@')[0] || 'Sovereign';
                const initial = displayName[0].toUpperCase();
                container.innerHTML = `
                    <div class="auth-user-chip">
                        ${photoURL
                        ? `<img src="${photoURL}" alt="${displayName}" class="auth-avatar" referrerpolicy="no-referrer">`
                        : `<div class="auth-avatar-placeholder">${initial}</div>`
                    }
                        <span class="auth-name" title="${displayName}">${displayName}</span>
                        <button class="auth-signout-btn" id="signout-btn" title="Sign Out" aria-label="Sign Out">✕</button>
                    </div>`;
                document.getElementById('signout-btn')?.addEventListener('click', () => this.signOut());
            } else {
                container.innerHTML = `
                    <button class="auth-signin-btn" id="signin-google-btn" aria-label="Sign in with Google">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                        <span>Sign In</span>
                    </button>`;
                document.getElementById('signin-google-btn')?.addEventListener('click', () => this.signInWithGoogle());
            }

            // Fade in
            container.style.opacity = '1';
        }, 200);
    }
};
