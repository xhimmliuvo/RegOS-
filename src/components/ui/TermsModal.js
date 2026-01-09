'use client';

import { useState, useEffect } from 'react';
import { X, FileText, Shield } from 'lucide-react';
import Button from './Button';
import styles from './TermsModal.module.css';

const TERMS_ACCEPTED_KEY = 'regos_terms_accepted';

export default function TermsModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [isChecked, setIsChecked] = useState(false);

    useEffect(() => {
        // Check if terms were already accepted
        const accepted = localStorage.getItem(TERMS_ACCEPTED_KEY);
        if (!accepted) {
            // Small delay for better UX
            const timer = setTimeout(() => setIsOpen(true), 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        if (isChecked) {
            localStorage.setItem(TERMS_ACCEPTED_KEY, Date.now().toString());
            setIsOpen(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <div className={styles.icon}>
                        <Shield size={28} />
                    </div>
                    <h2 className={styles.title}>Welcome to RegOS</h2>
                    <p className={styles.subtitle}>
                        Please review and accept our terms to continue
                    </p>
                </div>

                <div className={styles.content}>
                    <div className={styles.terms}>
                        <h3>Terms of Service</h3>
                        <p>
                            By using RegOS, you agree to our Terms of Service and Privacy Policy.
                            We collect and process your data to provide our registration services.
                        </p>
                        <ul>
                            <li>Your account information is securely stored</li>
                            <li>We do not sell your personal data to third parties</li>
                            <li>You can delete your account and data at any time</li>
                            <li>Registration hosts are responsible for their event content</li>
                        </ul>
                    </div>

                    <label className={styles.checkbox}>
                        <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => setIsChecked(e.target.checked)}
                        />
                        <span className={styles.checkmark}></span>
                        <span>
                            I agree to the{' '}
                            <a href="/info/terms" target="_blank">Terms of Service</a> and{' '}
                            <a href="/info/privacy" target="_blank">Privacy Policy</a>
                        </span>
                    </label>
                </div>

                <div className={styles.footer}>
                    <Button
                        fullWidth
                        size="lg"
                        onClick={handleAccept}
                        disabled={!isChecked}
                    >
                        Accept & Continue
                    </Button>
                </div>
            </div>
        </div>
    );
}

/**
 * Hook to check if terms are accepted
 */
export function useTermsAccepted() {
    const [accepted, setAccepted] = useState(true); // Default true to avoid flash

    useEffect(() => {
        const stored = localStorage.getItem(TERMS_ACCEPTED_KEY);
        setAccepted(!!stored);
    }, []);

    return accepted;
}
