'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft,
    Check,
    X,
    Clock,
    IndianRupee,
    Eye,
    Calendar,
    User
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { useRegistrations } from '@/context/RegistrationContext';
import { useToast } from '@/context/ToastContext';
import { formatDate } from '@/lib/utils';
import styles from './page.module.css';

export default function AdminPaymentsPage() {
    const router = useRouter();
    const { isAdmin, isLoading } = useAuth();
    const { registrations, getPendingRegistrations, approveRegistration, rejectRegistration } = useRegistrations();
    const toast = useToast();

    const [pendingRegs, setPendingRegs] = useState([]);

    useEffect(() => {
        if (!isLoading && !isAdmin()) {
            router.push('/dashboard');
        }
    }, [isLoading, isAdmin, router]);

    useEffect(() => {
        setPendingRegs(getPendingRegistrations());
    }, [registrations, getPendingRegistrations]);

    const handleApprove = (regId) => {
        approveRegistration(regId);
        toast.success('Registration approved and activated!');
    };

    const handleReject = (regId) => {
        rejectRegistration(regId);
        toast.error('Registration rejected.');
    };

    if (isLoading || !isAdmin()) {
        return (
            <div className={styles.page}>
                <div className={styles.loading}>Loading...</div>
            </div>
        );
    }

    // Get all registrations for revenue calculation
    const activeRegs = registrations.filter(r => r.status === 'active');
    const totalRevenue = activeRegs.length * 99; // Mock calculation

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <button className={styles.backButton} onClick={() => router.back()}>
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className={styles.title}>Payment Confirmations</h1>
                    <p className={styles.subtitle}>Approve pending registration payments</p>
                </div>
            </div>

            {/* Stats */}
            <div className={styles.stats}>
                <div className={styles.statCard}>
                    <div className={styles.statIcon}><Clock size={20} /></div>
                    <div className={styles.statContent}>
                        <span className={styles.statValue}>{pendingRegs.length}</span>
                        <span className={styles.statLabel}>Pending</span>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={`${styles.statIcon} ${styles.green}`}><Check size={20} /></div>
                    <div className={styles.statContent}>
                        <span className={styles.statValue}>{activeRegs.length}</span>
                        <span className={styles.statLabel}>Approved</span>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={`${styles.statIcon} ${styles.purple}`}><IndianRupee size={20} /></div>
                    <div className={styles.statContent}>
                        <span className={styles.statValue}>₹{totalRevenue}</span>
                        <span className={styles.statLabel}>Revenue</span>
                    </div>
                </div>
            </div>

            {/* Pending Registrations */}
            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>
                    Pending Payments ({pendingRegs.length})
                </h2>

                {pendingRegs.length > 0 ? (
                    <div className={styles.list}>
                        {pendingRegs.map(reg => (
                            <div key={reg.id} className={styles.card}>
                                <div className={styles.cardMain}>
                                    <div className={styles.cardHeader}>
                                        <span className={styles.badge}>Pending Payment</span>
                                        <span className={styles.category}>{reg.category}</span>
                                    </div>
                                    <h3 className={styles.cardTitle}>{reg.title}</h3>
                                    <div className={styles.cardMeta}>
                                        <span><User size={14} /> {reg.hostName}</span>
                                        <span><Calendar size={14} /> {formatDate(reg.createdAt)}</span>
                                    </div>
                                </div>
                                <div className={styles.cardActions}>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleReject(reg.id)}
                                        className={styles.rejectBtn}
                                    >
                                        <X size={16} />
                                    </Button>
                                    <Button
                                        size="sm"
                                        onClick={() => handleApprove(reg.id)}
                                    >
                                        <Check size={16} /> Approve
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={styles.empty}>
                        <Clock size={48} />
                        <h3>No pending payments</h3>
                        <p>All registration payments have been processed.</p>
                    </div>
                )}
            </div>

            {/* Recent Approved */}
            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Recently Approved</h2>
                <div className={styles.list}>
                    {activeRegs.slice(0, 5).map(reg => (
                        <div key={reg.id} className={`${styles.card} ${styles.approved}`}>
                            <div className={styles.cardMain}>
                                <div className={styles.cardHeader}>
                                    <span className={`${styles.badge} ${styles.active}`}>Active</span>
                                    <span className={styles.category}>{reg.category}</span>
                                </div>
                                <h3 className={styles.cardTitle}>{reg.title}</h3>
                                <div className={styles.cardMeta}>
                                    <span><User size={14} /> {reg.hostName}</span>
                                    <span><Eye size={14} /> {reg.viewCount} views</span>
                                </div>
                            </div>
                            <Link href={`/registration/${reg.id}`}>
                                <Button size="sm" variant="ghost">
                                    <Eye size={16} />
                                </Button>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
