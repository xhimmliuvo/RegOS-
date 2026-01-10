'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft,
    Save,
    IndianRupee,
    Clock,
    Zap,
    Crown,
    Check
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import styles from './page.module.css';

// Default pricing (can be stored in localStorage)
const DEFAULT_PRICING = {
    '7days': 49,
    '14days': 79,
    '30days': 99,
    '90days': 199,
    hostUpgrade: 299,
    featured: 149,
};

export default function AdminPricingPage() {
    const router = useRouter();
    const { isAdmin } = useAuth();
    const toast = useToast();

    const [pricing, setPricing] = useState(DEFAULT_PRICING);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        // Load from localStorage
        const saved = localStorage.getItem('regos_pricing');
        if (saved) {
            setPricing(JSON.parse(saved));
        }
    }, []);

    const handleChange = (key, value) => {
        setPricing(prev => ({
            ...prev,
            [key]: parseInt(value) || 0
        }));
    };

    const handleSave = () => {
        setSaving(true);
        // Save to localStorage (in real app, save to database)
        localStorage.setItem('regos_pricing', JSON.stringify(pricing));
        setTimeout(() => {
            setSaving(false);
            toast.success('Pricing updated successfully!');
        }, 500);
    };

    if (!isAdmin()) {
        return (
            <div className={styles.page}>
                <div className={styles.unauthorized}>
                    <h2>Unauthorized</h2>
                    <p>You don't have permission to access this page.</p>
                    <Link href="/dashboard"><Button>Go to Dashboard</Button></Link>
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
                <div>
                    <h1 className={styles.title}>Pricing Settings</h1>
                    <p className={styles.subtitle}>Configure platform pricing</p>
                </div>
            </div>

            {/* Registration Duration Pricing */}
            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <Clock size={20} />
                    <h2>Registration Duration Pricing</h2>
                </div>
                <p className={styles.sectionDesc}>
                    Set prices for different registration durations
                </p>

                <div className={styles.priceGrid}>
                    <div className={styles.priceItem}>
                        <label>7 Days</label>
                        <div className={styles.priceInput}>
                            <IndianRupee size={16} />
                            <input
                                type="number"
                                value={pricing['7days']}
                                onChange={(e) => handleChange('7days', e.target.value)}
                            />
                        </div>
                    </div>
                    <div className={styles.priceItem}>
                        <label>14 Days</label>
                        <div className={styles.priceInput}>
                            <IndianRupee size={16} />
                            <input
                                type="number"
                                value={pricing['14days']}
                                onChange={(e) => handleChange('14days', e.target.value)}
                            />
                        </div>
                    </div>
                    <div className={styles.priceItem}>
                        <label>30 Days</label>
                        <div className={styles.priceInput}>
                            <IndianRupee size={16} />
                            <input
                                type="number"
                                value={pricing['30days']}
                                onChange={(e) => handleChange('30days', e.target.value)}
                            />
                        </div>
                    </div>
                    <div className={styles.priceItem}>
                        <label>90 Days</label>
                        <div className={styles.priceInput}>
                            <IndianRupee size={16} />
                            <input
                                type="number"
                                value={pricing['90days']}
                                onChange={(e) => handleChange('90days', e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Upgrade Pricing */}
            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <Crown size={20} />
                    <h2>Upgrade Pricing</h2>
                </div>
                <p className={styles.sectionDesc}>
                    Set prices for account upgrades and features
                </p>

                <div className={styles.priceGrid}>
                    <div className={styles.priceItem}>
                        <label>Host Upgrade (One-time)</label>
                        <div className={styles.priceInput}>
                            <IndianRupee size={16} />
                            <input
                                type="number"
                                value={pricing.hostUpgrade}
                                onChange={(e) => handleChange('hostUpgrade', e.target.value)}
                            />
                        </div>
                    </div>
                    <div className={styles.priceItem}>
                        <label>Featured Listing</label>
                        <div className={styles.priceInput}>
                            <IndianRupee size={16} />
                            <input
                                type="number"
                                value={pricing.featured}
                                onChange={(e) => handleChange('featured', e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <div className={styles.actions}>
                <Button
                    size="lg"
                    leftIcon={<Save size={18} />}
                    onClick={handleSave}
                    loading={saving}
                >
                    Save Pricing
                </Button>
            </div>
        </div>
    );
}
