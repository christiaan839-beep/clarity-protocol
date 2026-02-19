/**
 * ═══════════════════════════════════════════════════════════
 * PAYMENTS SERVICE — Clarity Protocol
 * Stripe Checkout via Payment Links
 * ═══════════════════════════════════════════════════════════
 *
 * ── SETUP (2 minutes) ────────────────────────────────────
 * 1. Go to: https://dashboard.stripe.com/payment-links
 * 2. Click "+ New" → create "Sovereign Dividend" ($297 recurring monthly)
 * 3. Click "+ New" → create "Sovereign Build" ($1,997 one-time)
 * 4. Copy both URLs (they look like: https://buy.stripe.com/xxxx)
 * 5. Replace the placeholder URLs below with your actual links
 * 6. Push — deploys in ~44 seconds ✅
 * ─────────────────────────────────────────────────────────
 */

// ── 👇 PASTE YOUR STRIPE PAYMENT LINKS HERE ──────────────────────────────────
const PAYMENT_LINKS = {
    dividend: 'https://buy.stripe.com/REPLACE_SOVEREIGN_DIVIDEND',  // $297/mo
    build: 'https://buy.stripe.com/REPLACE_SOVEREIGN_BUILD'      // $1,997 one-time
};
// ─────────────────────────────────────────────────────────────────────────────

const PRODUCTS = {
    dividend: { name: 'Sovereign Dividend', price: '$297/month', value: 297 },
    build: { name: 'Sovereign Build', price: '$1,997', value: 1997 }
};

// ─── Checkout Button Loading State ───────────────────────────────────────────
function setButtonLoading(btn, isLoading) {
    if (!btn) return;
    btn.disabled = isLoading;
    btn.style.opacity = isLoading ? '0.7' : '';
    btn.style.cursor = isLoading ? 'not-allowed' : '';
    if (isLoading) {
        btn.dataset.originalText = btn.textContent;
        btn.textContent = 'PREPARING CHECKOUT…';
    } else if (btn.dataset.originalText) {
        btn.textContent = btn.dataset.originalText;
    }
}

// ─── Config Setup Modal ───────────────────────────────────────────────────────
function showConfigModal(product) {
    document.querySelector('.cp-payment-modal')?.remove();

    const overlay = document.createElement('div');
    overlay.className = 'cp-payment-modal';
    overlay.innerHTML = `
        <div class="cp-modal-inner">
            <div class="cp-modal-icon">◈</div>
            <h2 class="cp-modal-title">STRIPE SETUP REQUIRED</h2>
            <p class="cp-modal-desc">
                To accept payments for <strong>${product.name}</strong>
                (${product.price}), you need to connect a Stripe account.
            </p>
            <div class="cp-modal-steps">
                <div class="cp-step"><span class="cp-step-num">1</span>Go to Stripe → Payment Links</div>
                <div class="cp-step"><span class="cp-step-num">2</span>Create "${product.name}" product</div>
                <div class="cp-step"><span class="cp-step-num">3</span>Copy the link URL</div>
                <div class="cp-step"><span class="cp-step-num">4</span>Paste into <code>services/payments.js</code></div>
            </div>
            <a href="https://dashboard.stripe.com/payment-links"
               target="_blank" rel="noopener noreferrer"
               class="cp-modal-cta">
                OPEN STRIPE DASHBOARD →
            </a>
            <button class="cp-modal-close" onclick="this.closest('.cp-payment-modal').remove()">
                Close
            </button>
        </div>
    `;

    // Inject modal styles if needed
    if (!document.getElementById('cp-modal-styles')) {
        const style = document.createElement('style');
        style.id = 'cp-modal-styles';
        style.textContent = `
            .cp-payment-modal {
                position: fixed; inset: 0;
                background: rgba(0,0,0,0.88);
                display: flex; align-items: center; justify-content: center;
                z-index: 9998; backdrop-filter: blur(10px);
                animation: fadeInModal 0.3s ease;
            }
            @keyframes fadeInModal {
                from { opacity: 0; transform: scale(0.97); }
                to   { opacity: 1; transform: scale(1); }
            }
            .cp-modal-inner {
                background: #111; border: 1px solid rgba(212,175,55,0.5);
                border-radius: 16px; padding: 2.5rem; max-width: 440px;
                width: 90%; text-align: center; color: #eaeaea;
                box-shadow: 0 40px 80px rgba(0,0,0,0.6), 0 0 40px rgba(212,175,55,0.05);
            }
            .cp-modal-icon { color: #D4AF37; font-size: 2.5rem; margin-bottom: 1rem; }
            .cp-modal-title {
                font-family: 'JetBrains Mono', monospace;
                font-size: 1.1rem; letter-spacing: 2px;
                color: #fff; margin-bottom: 0.75rem;
            }
            .cp-modal-desc {
                color: #888; font-size: 0.9rem; line-height: 1.6;
                margin-bottom: 1.5rem;
            }
            .cp-modal-desc strong { color: #eaeaea; }
            .cp-modal-steps {
                text-align: left; margin-bottom: 1.75rem;
                border: 1px solid rgba(255,255,255,0.07);
                border-radius: 8px; padding: 1rem;
            }
            .cp-step {
                display: flex; align-items: center; gap: 10px;
                font-size: 0.82rem; color: #aaa; padding: 6px 0;
            }
            .cp-step-num {
                min-width: 22px; height: 22px; border-radius: 50%;
                background: rgba(212,175,55,0.15); color: #D4AF37;
                display: flex; align-items: center; justify-content: center;
                font-size: 0.72rem; font-weight: 700;
            }
            .cp-step code { color: #D4AF37; font-size: 0.78rem; }
            .cp-modal-cta {
                display: inline-block; padding: 0.8rem 2rem;
                background: #D4AF37; color: #000; border-radius: 8px;
                text-decoration: none; font-weight: 700;
                font-size: 0.82rem; letter-spacing: 1.5px;
                transition: background 0.2s;
                margin-bottom: 1rem;
            }
            .cp-modal-cta:hover { background: #E8C547; }
            .cp-modal-close {
                display: block; width: 100%; background: none; border: none;
                color: #555; cursor: pointer; font-size: 0.8rem; padding: 6px;
                transition: color 0.2s;
            }
            .cp-modal-close:hover { color: #888; }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(overlay);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
}

// ─── PaymentService ────────────────────────────────────────────────────────────
export const PaymentService = {
    /**
     * Redirect to Stripe hosted checkout for the given tier.
     * @param {string} tier - 'dividend' | 'build'
     * @param {HTMLElement} [btnEl] - The button element (optional, for loading state)
     */
    checkout(tier, btnEl = null) {
        const link = PAYMENT_LINKS[tier];
        const product = PRODUCTS[tier];

        if (!product) {
            console.error('[Payments] Unknown tier:', tier);
            return;
        }

        // GA4 analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'begin_checkout', {
                currency: 'USD',
                value: product.value,
                items: [{ item_name: product.name, price: product.value }]
            });
        }

        // Not yet configured → show setup modal
        if (!link || link.includes('REPLACE_')) {
            showConfigModal(product);
            return;
        }

        // Show loading state then redirect
        setButtonLoading(btnEl, true);
        setTimeout(() => {
            window.location.href = link;
        }, 300); // slight delay so user sees feedback
    }
};
