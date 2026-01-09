'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    Copy,
    Check,
    MessageCircle,
    CreditCard,
    ArrowLeft,
    QrCode,
    IndianRupee,
    Clock,
    Shield
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import styles from './page.module.css';

// Payment configuration
const PAYMENT_CONFIG = {
    upiId: '8787665349@ybl', // Update this with actual UPI ID
    whatsappNumber: '918787665349',
    merchantName: 'RegOS Platform',
};

export default function PaymentPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user, isAuthenticated } = useAuth();
    const toast = useToast();

    const amount = searchParams.get('amount') || '99';
    const purpose = searchParams.get('purpose') || 'Registration Publishing';
    const registrationId = searchParams.get('registration') || '';

    const [copied, setCopied] = useState(false);
    const [paymentSent, setPaymentSent] = useState(false);

    const copyUPI = async () => {
        try {
            await navigator.clipboard.writeText(PAYMENT_CONFIG.upiId);
            setCopied(true);
            toast.success('UPI ID copied!');
            setTimeout(() => setCopied(false), 3000);
        } catch (err) {
            toast.error('Failed to copy. Please copy manually.');
        }
    };

    const openWhatsApp = () => {
        const message = encodeURIComponent(
            `✅ Payment Confirmation - RegOS\n\n` +
            `Amount: ₹${amount}\n` +
            `Purpose: ${purpose}\n` +
            `Email: ${user?.email || 'Guest'}\n` +
            `Registration ID: ${registrationId || 'N/A'}\n\n` +
            `Payment done via UPI to ${PAYMENT_CONFIG.upiId}\n` +
            `Please verify and activate my registration.`
        );
        window.open(`https://wa.me/${PAYMENT_CONFIG.whatsappNumber}?text=${message}`, '_blank');
        setPaymentSent(true);
    };

    const openUPIApp = () => {
        // Deep link to UPI apps
        const upiLink = `upi://pay?pa=${PAYMENT_CONFIG.upiId}&pn=${encodeURIComponent(PAYMENT_CONFIG.merchantName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(purpose)}`;
        window.location.href = upiLink;
    };

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <button className={styles.backButton} onClick={() => router.back()}>
                    <ArrowLeft size={20} />
                </button>
                <h1 className={styles.title}>Complete Payment</h1>
            </div>

            {/* Amount Card */}
            <div className={styles.amountCard}>
                <div className={styles.amountLabel}>Amount to Pay</div>
                <div className={styles.amountValue}>
                    <IndianRupee size={32} />
                    <span>{amount}</span>
                </div>
                <div className={styles.amountPurpose}>{purpose}</div>
            </div>

            {/* Payment Steps */}
            <div className={styles.stepsCard}>
                <h2 className={styles.stepsTitle}>How to Pay</h2>

                <div className={styles.step}>
                    <div className={styles.stepNumber}>1</div>
                    <div className={styles.stepContent}>
                        <h3>Copy UPI ID or Scan QR</h3>
                        <p>Use any UPI app (GPay, PhonePe, Paytm)</p>
                    </div>
                </div>

                <div className={styles.step}>
                    <div className={styles.stepNumber}>2</div>
                    <div className={styles.stepContent}>
                        <h3>Pay ₹{amount}</h3>
                        <p>Complete payment in your UPI app</p>
                    </div>
                </div>

                <div className={styles.step}>
                    <div className={styles.stepNumber}>3</div>
                    <div className={styles.stepContent}>
                        <h3>Confirm via WhatsApp</h3>
                        <p>Click WhatsApp button to confirm payment</p>
                    </div>
                </div>
            </div>

            {/* UPI Section */}
            <div className={styles.upiSection}>
                <div className={styles.upiCard}>
                    <div className={styles.upiLabel}>UPI ID</div>
                    <div className={styles.upiValue}>
                        <span>{PAYMENT_CONFIG.upiId}</span>
                        <button
                            className={`${styles.copyButton} ${copied ? styles.copied : ''}`}
                            onClick={copyUPI}
                        >
                            {copied ? <Check size={18} /> : <Copy size={18} />}
                            {copied ? 'Copied' : 'Copy'}
                        </button>
                    </div>
                </div>

                <Button
                    variant="secondary"
                    size="lg"
                    fullWidth
                    leftIcon={<QrCode size={20} />}
                    onClick={openUPIApp}
                >
                    Open UPI App
                </Button>
            </div>

            {/* WhatsApp Confirmation */}
            <div className={styles.confirmSection}>
                <div className={styles.confirmNote}>
                    <Shield size={18} />
                    <span>After payment, confirm via WhatsApp for instant activation</span>
                </div>

                <Button
                    size="lg"
                    fullWidth
                    leftIcon={<MessageCircle size={20} />}
                    onClick={openWhatsApp}
                    className={styles.whatsappButton}
                >
                    Confirm on WhatsApp
                </Button>

                {paymentSent && (
                    <div className={styles.successMessage}>
                        <Check size={18} />
                        <span>WhatsApp opened! Send the message to confirm.</span>
                    </div>
                )}
            </div>

            {/* Timer Note */}
            <div className={styles.timerNote}>
                <Clock size={16} />
                <span>Activation within 5-30 minutes after confirmation</span>
            </div>
        </div>
    );
}
