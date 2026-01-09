'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Crown,
    Check,
    ArrowRight,
    ArrowLeft,
    Sparkles,
    Users,
    BarChart3,
    Download,
    Shield
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import styles from './page.module.css';

const HOST_BENEFITS = [
    { icon: Sparkles, title: 'Create Registrations', description: 'Create unlimited registration forms and events' },
    { icon: Users, title: 'Collect Submissions', description: 'Receive and manage submissions from users' },
    { icon: BarChart3, title: 'Analytics Dashboard', description: 'Track views, submissions, and engagement' },
    { icon: Download, title: 'Export Data', description: 'Download submissions as Excel or PDF' },
    { icon: Shield, title: 'Verified Badge', description: 'Get a verified host badge on your profile' },
];

export default function BecomeHostPage() {
    const router = useRouter();
    const { user, isAuthenticated, upgradeRole } = useAuth();
    const toast = useToast();
    const [loading, setLoading] = useState(false);

    const handleUpgrade = () => {
        // Redirect to payment page with host upgrade fee
        router.push('/payment?amount=299&purpose=Host%20Account%20Upgrade');
    };

    const isAlreadyHost = user?.role === 'host' || user?.role === 'admin';

    if (!isAuthenticated) {
        return (
            <div className={styles.page}>
                <div className={styles.authPrompt}>
                    <Crown size={48} className={styles.authIcon} />
                    <h2>Sign in to become a host</h2>
                    <p>Create an account to unlock host features</p>
                    <Button onClick={() => router.push('/auth/login')}>
                        Sign In
                    </Button>
                </div>
            </div>
        );
    }

    if (isAlreadyHost) {
        return (
            <div className={styles.page}>
                <div className={styles.alreadyHost}>
                    <div className={styles.successIcon}>
                        <Check size={32} />
                    </div>
                    <h2>You're already a Host!</h2>
                    <p>You have access to all host features</p>
                    <Button onClick={() => router.push('/dashboard/create')}>
                        Create Registration
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <button className={styles.backButton} onClick={() => router.back()}>
                    <ArrowLeft size={20} />
                </button>
                <h1 className={styles.title}>Become a Host</h1>
            </div>

            {/* Hero */}
            <div className={styles.hero}>
                <div className={styles.heroIcon}>
                    <Crown size={40} />
                </div>
                <h2 className={styles.heroTitle}>Unlock Host Powers</h2>
                <p className={styles.heroSubtitle}>
                    Create and manage registrations, events, and appointments
                </p>
            </div>

            {/* Benefits */}
            <div className={styles.benefits}>
                <h3 className={styles.benefitsTitle}>What you get</h3>
                {HOST_BENEFITS.map((benefit, index) => (
                    <div key={index} className={styles.benefitItem}>
                        <div className={styles.benefitIcon}>
                            <benefit.icon size={22} />
                        </div>
                        <div className={styles.benefitContent}>
                            <h4>{benefit.title}</h4>
                            <p>{benefit.description}</p>
                        </div>
                        <Check size={18} className={styles.benefitCheck} />
                    </div>
                ))}
            </div>

            {/* Pricing */}
            <div className={styles.pricing}>
                <div className={styles.priceCard}>
                    <div className={styles.priceLabel}>One-time upgrade</div>
                    <div className={styles.priceValue}>
                        <span className={styles.currency}>₹</span>
                        <span className={styles.amount}>299</span>
                    </div>
                    <div className={styles.priceNote}>Lifetime host access</div>
                </div>
            </div>

            {/* CTA */}
            <div className={styles.cta}>
                <Button
                    size="lg"
                    fullWidth
                    rightIcon={<ArrowRight size={20} />}
                    onClick={handleUpgrade}
                    loading={loading}
                >
                    Upgrade to Host
                </Button>
                <p className={styles.ctaNote}>
                    Pay via UPI • Instant activation
                </p>
            </div>
        </div>
    );
}
