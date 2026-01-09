'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    PlusCircle,
    FileText,
    Users,
    Eye,
    TrendingUp,
    Clock,
    ArrowUpRight,
    ChevronRight,
    Zap
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { CardCompact } from '@/components/ui/Card';
import { useAuth } from '@/context/AuthContext';
import { getRegistrationsByHost, MOCK_REGISTRATIONS } from '@/lib/mockData';
import styles from './page.module.css';

export default function DashboardPage() {
    const router = useRouter();
    const { user, isAuthenticated, isLoading, canCreateRegistration, isAdmin } = useAuth();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/auth/login');
        }
    }, [isLoading, isAuthenticated, router]);

    if (isLoading || !isAuthenticated) {
        return (
            <div className={styles.page}>
                <div className={styles.loading}>Loading...</div>
            </div>
        );
    }

    // Get user's registrations (for hosts/admins) or all registrations (for admin overview)
    const userRegistrations = isAdmin()
        ? MOCK_REGISTRATIONS
        : canCreateRegistration()
            ? getRegistrationsByHost(user?.id)
            : [];

    const activeRegistrations = userRegistrations.filter(r => r.status === 'active');
    const pausedRegistrations = userRegistrations.filter(r => r.status === 'paused');

    // Calculate stats
    const totalViews = userRegistrations.reduce((acc, r) => acc + (r.viewCount || 0), 0);
    const totalSubmissions = userRegistrations.reduce((acc, r) => acc + (r.submissionCount || 0), 0);

    return (
        <div className={styles.page}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.headerContent}>
                    <h1 className={styles.title}>
                        Welcome back, {user?.name?.split(' ')[0] || 'there'}!
                    </h1>
                    <p className={styles.subtitle}>
                        Here's what's happening with your registrations
                    </p>
                </div>

                {canCreateRegistration() && (
                    <Link href="/dashboard/create">
                        <Button leftIcon={<PlusCircle size={18} />}>
                            Create
                        </Button>
                    </Link>
                )}
            </div>

            {/* Role Badge for non-hosts */}
            {!canCreateRegistration() && (
                <div className={styles.upgradeCard}>
                    <div className={styles.upgradeContent}>
                        <Zap size={24} />
                        <div>
                            <h3>Become a Host</h3>
                            <p>Upgrade your account to create and manage registrations</p>
                        </div>
                    </div>
                    <Button size="sm" rightIcon={<ArrowUpRight size={16} />}>
                        Upgrade Now
                    </Button>
                </div>
            )}

            {/* Stats Cards */}
            {canCreateRegistration() && (
                <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <div className={styles.statIcon}>
                            <FileText size={20} />
                        </div>
                        <div className={styles.statContent}>
                            <span className={styles.statValue}>{userRegistrations.length}</span>
                            <span className={styles.statLabel}>Total Registrations</span>
                        </div>
                    </div>

                    <div className={styles.statCard}>
                        <div className={styles.statIcon}>
                            <Eye size={20} />
                        </div>
                        <div className={styles.statContent}>
                            <span className={styles.statValue}>{totalViews.toLocaleString()}</span>
                            <span className={styles.statLabel}>Total Views</span>
                        </div>
                    </div>

                    <div className={styles.statCard}>
                        <div className={styles.statIcon}>
                            <Users size={20} />
                        </div>
                        <div className={styles.statContent}>
                            <span className={styles.statValue}>{totalSubmissions.toLocaleString()}</span>
                            <span className={styles.statLabel}>Total Submissions</span>
                        </div>
                    </div>

                    <div className={styles.statCard}>
                        <div className={styles.statIcon}>
                            <TrendingUp size={20} />
                        </div>
                        <div className={styles.statContent}>
                            <span className={styles.statValue}>
                                {totalViews > 0 ? ((totalSubmissions / totalViews) * 100).toFixed(1) : 0}%
                            </span>
                            <span className={styles.statLabel}>Conversion Rate</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Quick Actions */}
            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Quick Actions</h2>
                <div className={styles.quickActions}>
                    <Link href="/search" className={styles.quickAction}>
                        <span className={styles.quickActionIcon}>🔍</span>
                        <span>Browse</span>
                    </Link>
                    {canCreateRegistration() && (
                        <>
                            <Link href="/dashboard/manage" className={styles.quickAction}>
                                <span className={styles.quickActionIcon}>📋</span>
                                <span>Manage</span>
                            </Link>
                            <Link href="/dashboard/submissions" className={styles.quickAction}>
                                <span className={styles.quickActionIcon}>📥</span>
                                <span>Submissions</span>
                            </Link>
                        </>
                    )}
                    <Link href="/dashboard/profile" className={styles.quickAction}>
                        <span className={styles.quickActionIcon}>👤</span>
                        <span>Profile</span>
                    </Link>
                    {isAdmin() && (
                        <Link href="/admin" className={styles.quickAction}>
                            <span className={styles.quickActionIcon}>⚙️</span>
                            <span>Admin</span>
                        </Link>
                    )}
                </div>
            </div>

            {/* Active Registrations */}
            {canCreateRegistration() && activeRegistrations.length > 0 && (
                <div className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>
                            <Clock size={18} />
                            Active Registrations
                        </h2>
                        <Link href="/dashboard/manage" className={styles.sectionLink}>
                            View all <ChevronRight size={16} />
                        </Link>
                    </div>
                    <div className={styles.registrationList}>
                        {activeRegistrations.slice(0, 5).map(reg => (
                            <CardCompact
                                key={reg.id}
                                id={reg.id}
                                title={reg.title}
                                category={reg.category}
                                status={reg.status}
                                submissionCount={reg.submissionCount}
                                endDate={reg.endDate}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Empty State for new hosts */}
            {canCreateRegistration() && userRegistrations.length === 0 && (
                <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>📝</div>
                    <h3>No registrations yet</h3>
                    <p>Create your first registration to get started</p>
                    <Link href="/dashboard/create">
                        <Button leftIcon={<PlusCircle size={18} />}>
                            Create Registration
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    );
}
