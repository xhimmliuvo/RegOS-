// =====================================================
// RAZORPAY PAYMENT INTEGRATION
// =====================================================

const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

/**
 * Check if Razorpay is configured
 */
export const isRazorpayConfigured = () => {
    return RAZORPAY_KEY_ID && !RAZORPAY_KEY_ID.includes('your_');
};

/**
 * Load Razorpay script
 */
export function loadRazorpayScript() {
    return new Promise((resolve) => {
        if (typeof window !== 'undefined' && window.Razorpay) {
            resolve(true);
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
}

/**
 * Create a payment order (calls backend API)
 */
export async function createOrder(amount, currency = 'INR', metadata = {}) {
    if (!isRazorpayConfigured()) {
        console.warn('Razorpay not configured, using mock payment');
        return {
            orderId: 'order_mock_' + Date.now(),
            amount,
            currency,
            mock: true,
        };
    }

    const response = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, currency, ...metadata }),
    });

    if (!response.ok) {
        throw new Error('Failed to create order');
    }

    return await response.json();
}

/**
 * Initiate Razorpay payment
 */
export async function initiatePayment({
    amount,
    currency = 'INR',
    name = 'RegOS',
    description = 'Registration Payment',
    orderId,
    prefill = {},
    onSuccess,
    onFailure,
}) {
    // Load Razorpay if not already loaded
    const loaded = await loadRazorpayScript();

    if (!loaded) {
        throw new Error('Failed to load Razorpay');
    }

    // If not configured, simulate success
    if (!isRazorpayConfigured()) {
        console.warn('Razorpay not configured - simulating payment success');
        setTimeout(() => {
            onSuccess?.({
                razorpay_order_id: orderId || 'order_mock_' + Date.now(),
                razorpay_payment_id: 'pay_mock_' + Date.now(),
                razorpay_signature: 'mock_signature',
                mock: true,
            });
        }, 1500);
        return;
    }

    const options = {
        key: RAZORPAY_KEY_ID,
        amount: amount * 100, // Razorpay expects paise
        currency,
        name,
        description,
        order_id: orderId,
        prefill: {
            name: prefill.name || '',
            email: prefill.email || '',
            contact: prefill.phone || '',
        },
        theme: {
            color: '#6366f1',
        },
        handler: function (response) {
            // Verify payment on server
            verifyPayment(response)
                .then(() => onSuccess?.(response))
                .catch((error) => onFailure?.(error));
        },
        modal: {
            ondismiss: function () {
                onFailure?.(new Error('Payment cancelled'));
            },
        },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
}

/**
 * Verify payment signature (calls backend API)
 */
export async function verifyPayment(paymentResponse) {
    if (paymentResponse.mock) {
        return { verified: true };
    }

    const response = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentResponse),
    });

    if (!response.ok) {
        throw new Error('Payment verification failed');
    }

    return await response.json();
}

/**
 * Format amount for display
 */
export function formatPaymentAmount(amount, currency = 'INR') {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
    }).format(amount);
}

// Payment status constants
export const PAYMENT_STATUS = {
    PENDING: 'pending',
    PROCESSING: 'processing',
    SUCCESS: 'success',
    FAILED: 'failed',
    REFUNDED: 'refunded',
};
