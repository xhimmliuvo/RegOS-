'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Key, Smartphone, ArrowRight, Lock } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import styles from './page.module.css';

export default function SecurityPage() {
    const router = useRouter();
    const { user } = useAuth();
    const toast = useToast();
    const [loading, setLoading] = useState(false);

    const handlePasswordChange = (e) => {
        e.preventDefault();
        setLoading(true);
        // Mock API call
        setTimeout(() => {
            setLoading(false);
            toast.success('Password updated successfully');
        }, 1500);
    };

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1 className={styles.title}>Security</h1>
                <p className={styles.subtitle}>Manage your account security</p>
            </div>

            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <div className={styles.iconWrapper}>
                        <Key size={20} />
                    </div>
                    <div>
                        <h2 className={styles.sectionTitle}>Change Password</h2>
                        <p className={styles.sectionDesc}>Update your password to keep your account safe</p>
                    </div>
                </div>

                <form onSubmit={handlePasswordChange} className={styles.form}>
                    <Input
                        type="password"
                        label="Current Password"
                        placeholder="••••••••"
                    />
                    <Input
                        type="password"
                        label="New Password"
                        placeholder="••••••••"
                    />
                    <Input
                        type="password"
                        label="Confirm New Password"
                        placeholder="••••••••"
                    />
                    <div className={styles.formActions}>
                        <Button type="submit" loading={loading}>
                            Update Password
                        </Button>
                    </div>
                </form>
            </div>

            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <div className={styles.iconWrapper}>
                        <Smartphone size={20} />
                    </div>
                    <div>
                        <h2 className={styles.sectionTitle}>Two-Factor Authentication</h2>
                        <p className={styles.sectionDesc}>Add an extra layer of security</p>
                    </div>
                    <div className={styles.badge}>Coming Soon</div>
                </div>

                <div className={styles.tfaCard}>
                    <div className={styles.tfaContent}>
                        <h3>Protect your account with 2FA</h3>
                        <p>We're working on adding support for authenticator apps and SMS verification.</p>
                    </div>
                    <Lock size={48} className={styles.tfaIcon} />
                </div>
            </div>
        </div>
    );
}
