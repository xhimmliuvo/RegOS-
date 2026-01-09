'use client';

import { useState, useEffect } from 'react';
import { Download, X, Smartphone, Share } from 'lucide-react';
import Button from './Button';
import styles from './InstallPrompt.module.css';

const INSTALL_DISMISSED_KEY = 'regos_install_dismissed';
const MIN_VISITS_BEFORE_PROMPT = 2;
const VISIT_COUNT_KEY = 'regos_visit_count';

export default function InstallPrompt() {
    const [isOpen, setIsOpen] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsInstalled(true);
            return;
        }

        // Check if dismissed recently
        const dismissed = localStorage.getItem(INSTALL_DISMISSED_KEY);
        if (dismissed) {
            const dismissedTime = parseInt(dismissed, 10);
            // Don't show for 7 days after dismissal
            if (Date.now() - dismissedTime < 7 * 24 * 60 * 60 * 1000) {
                return;
            }
        }

        // Track visits
        let visitCount = parseInt(localStorage.getItem(VISIT_COUNT_KEY) || '0', 10);
        visitCount++;
        localStorage.setItem(VISIT_COUNT_KEY, visitCount.toString());

        // Only show after minimum visits
        if (visitCount < MIN_VISITS_BEFORE_PROMPT) {
            return;
        }

        // Detect iOS
        const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
        setIsIOS(isIOSDevice);

        if (isIOSDevice) {
            // Show custom iOS prompt after delay
            const timer = setTimeout(() => setIsOpen(true), 3000);
            return () => clearTimeout(timer);
        }

        // Listen for beforeinstallprompt event (Chrome/Android)
        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            // Show prompt after delay
            setTimeout(() => setIsOpen(true), 3000);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstall = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;

            if (outcome === 'accepted') {
                setIsInstalled(true);
            }

            setDeferredPrompt(null);
        }
        setIsOpen(false);
    };

    const handleDismiss = () => {
        localStorage.setItem(INSTALL_DISMISSED_KEY, Date.now().toString());
        setIsOpen(false);
    };

    if (!isOpen || isInstalled) return null;

    return (
        <div className={styles.banner}>
            <button className={styles.close} onClick={handleDismiss}>
                <X size={18} />
            </button>

            <div className={styles.icon}>
                <Smartphone size={24} />
            </div>

            <div className={styles.content}>
                <h3 className={styles.title}>Install RegOS App</h3>
                <p className={styles.description}>
                    {isIOS
                        ? 'Tap Share then "Add to Home Screen"'
                        : 'Install for quick access & offline use'
                    }
                </p>
            </div>

            {isIOS ? (
                <div className={styles.iosHint}>
                    <Share size={16} />
                    <span>Tap Share</span>
                </div>
            ) : (
                <Button size="sm" onClick={handleInstall} leftIcon={<Download size={16} />}>
                    Install
                </Button>
            )}
        </div>
    );
}

/**
 * Hook to check if app is installed as PWA
 */
export function useIsInstalled() {
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        setIsInstalled(window.matchMedia('(display-mode: standalone)').matches);
    }, []);

    return isInstalled;
}
