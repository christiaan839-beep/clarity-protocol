/**
 * ═══════════════════════════════════════════════════════════
 * PAYMENTS SERVICE — Clarity Protocol
 * Stripe Checkout Integration
 * ═══════════════════════════════════════════════════════════
 * HOW TO CONFIGURE:
 * 1. Go to https://dashboard.stripe.com/products
 * 2. Create two products: "Sovereign Dividend" ($297/mo) and "Sovereign Build" ($1997 one-time)
 * 3. Copy the Payment Link URLs for each product
 * 4. Replace the PAYMENT_LINKS below with your actual URLs
 *
 * OR use Stripe Payment Links (no code needed):
 * dashboard.stripe.com/payment-links → Create link → copy URL
 */

const STRIPE_CONFIG = {
    // Replace with your actual Stripe Payment Link URLs from dashboard.stripe.com/payment-links
    PAYMENT_LINKS: {
        dividend: 'https://buy.stripe.com/REPLACE_WITH_DIVIDEND_PAYMENT_LINK',
        build: 'https://buy.stripe.com/REPLACE_WITH_BUILD_PAYMENT_LINK'
    },
    PRODUCTS: {
        dividend: { name: 'Sovereign Dividend', price: '$297/mo' },
        build: { name: 'Sovereign Build', price: '$1,997 one-time' }
    }
};

export const PaymentService = {
    /**
     * Redirect to Stripe hosted checkout
     * @param {string} tier - 'dividend' or 'build'
     */
    checkout(tier) {
        const link = STRIPE_CONFIG.PAYMENT_LINKS[tier];
        const product = STRIPE_CONFIG.PRODUCTS[tier];

        if (!product) {
            console.error('[Payments] Unknown tier:', tier);
            return;
        }

        // Track analytics event if GA is available
        if (typeof gtag !== 'undefined') {
            gtag('event', 'begin_checkout', {
                currency: 'USD',
                value: tier === 'build' ? 1997 : 297,
                items: [{ item_name: product.name }]
            });
        }

        // Check if payment link is configured
        if (link.includes('REPLACE_WITH')) {
            // Show a friendly message instead of broken redirect
            this._showConfigModal(product);
            return;
        }

        // Redirect to Stripe hosted checkout
        window.location.href = link;
    },

    /**
     * Show "Stripe not configured" modal (dev placeholder)
     */
    _showConfigModal(product) {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed; inset: 0; background: rgba(0,0,0,0.85);
            display: flex; align-items: center; justify-content: center;
            z-index: 9999; backdrop-filter: blur(8px);
        `;
        overlay.innerHTML = `
            <div style="background: #111; border: 1px solid #D4AF37; border-radius: 12px;
                        padding: 2.5rem; max-width: 420px; text-align: center; color: #fff;">
                <div style="color: #D4AF37; font-size: 2rem; margin-bottom: 1rem;">◈</div>
                <h2 style="font-family: 'Cinzel', serif; margin-bottom: 0.5rem;">STRIPE NOT CONFIGURED</h2>
                <p style="color: #aaa; margin-bottom: 1.5rem; line-height: 1.6;">
                    To accept real payments for <strong style="color:#fff">${product.name}</strong>,
                    add your Stripe Payment Link to <code style="color:#D4AF37">services/payments.js</code>.
                </p>
                <a href="https://dashboard.stripe.com/payment-links" target="_blank"
                   style="display: inline-block; padding: 0.75rem 2rem; background: #D4AF37;
                          color: #000; border-radius: 6px; text-decoration: none;
                          font-weight: 700; font-size: 0.85rem; letter-spacing: 1px;">
                    OPEN STRIPE DASHBOARD →
                </a>
                <br><br>
                <button onclick="this.closest('[style*=fixed]').remove()"
                        style="background: none; border: none; color: #666; cursor: pointer; font-size: 0.8rem;">
                    Close
                </button>
            </div>
        `;
        document.body.appendChild(overlay);
        overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
    }
};
