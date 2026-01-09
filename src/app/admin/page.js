'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    Users,
    FileText,
    CreditCard,
    LayoutGrid,
    Settings,
    TrendingUp,
    Eye,
    DollarSign,
    ArrowUpRight,
    ChevronRight,
    Handshake
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { MOCK_REGISTRATIONS, MOCK_USERS } from '@/lib/mockData';
import { formatCurrency } from '@/lib/utils';
import styles from './page.module.css';

export default function AdminPage() {
    const router = useRouter();
    const { isAuthenticated, isLoading, isAdmin } = useAuth();

    useEffect(() => {
        if (!isLoading && (!isAuthenticated || !isAdmin())) {
            router.push('/dashboard');
        }
    }, [isLoading, isAuthenticated, isAdmin, router]);

    if (isLoading || !isAdmin()) {
        return (
            <div className={styles.page}>
                <div className={styles.loading}>Loading...</div>
            </div>
        );
    }

    // Calculate platform stats
    const totalUsers = MOCK_USERS.length;
    const totalRegistrations = MOCK_REGISTRATIONS.length;
    const totalViews = MOCK_REGISTRATIONS.reduce((acc, r) => acc + (r.viewCount || 0), 0);
    const totalSubmissions = MOCK_REGISTRATIONS.reduce((acc, r) => acc + (r.submissionCount || 0), 0);

    // Mock revenue
    const totalRevenue = 45890;

    return (
        <div className={styles.page}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.headerContent}>
                    <h1 className={styles.title}>Admin Dashboard</h1>
                    <p className={styles.subtitle}>Platform overview and management</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={`${styles.statIcon} ${styles.blue}`}>
                        <Users size={24} />
                    </div>
                    <div className={styles.statContent}>
                        <span className={styles.statValue}>{totalUsers}</span>
                        <span className={styles.statLabel}>Total Users</span>
                    </div>
                    <span className={styles.statTrend}>
                        <ArrowUpRight size={14} />
                        +12%
                    </span>
                </div>

                <div className={styles.statCard}>
                    <div className={`${styles.statIcon} ${styles.purple}`}>
                        <FileText size={24} />
                    </div>
                    <div className={styles.statContent}>
                        <span className={styles.statValue}>{totalRegistrations}</span>
                        <span className={styles.statLabel}>Registrations</span>
                    </div>
                    <span className={styles.statTrend}>
                        <ArrowUpRight size={14} />
                        +8%
                    </span>
                </div>

                <div className={styles.statCard}>
                    <div className={`${styles.statIcon} ${styles.green}`}>
                        <Eye size={24} />
                    </div>
                    <div className={styles.statContent}>
                        <span className={styles.statValue}>{totalViews.toLocaleString()}</span>
                        <span className={styles.statLabel}>Total Views</span>
                    </div>
                    <span className={styles.statTrend}>
                        <ArrowUpRight size={14} />
                        +24%
                    </span>
                </div>

                <div className={styles.statCard}>
                    <div className={`${styles.statIcon} ${styles.orange}`}>
                        <DollarSign size={24} />
                    </div>
                    <div className={styles.statContent}>
                        <span className={styles.statValue}>{formatCurrency(totalRevenue)}</span>
                        <span className={styles.statLabel}>Revenue</span>
                    </div>
                    <span className={styles.statTrend}>
                        <ArrowUpRight size={14} />
                        +18%
                    </span>
                </div>
            </div>

            {/* Quick Actions */}
            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Management</h2>
                <div className={styles.menuGrid}>
                    <Link href="/admin/users" className={styles.menuCard}>
                        <div className={styles.menuIcon}>
                            <Users size={24} />
                        </div>
                        <div className={styles.menuContent}>
                            <h3>Users</h3>
                            <p>Manage users and roles</p>
                        </div>
                        <ChevronRight size={18} />
                    </Link>

                    <Link href="/admin/categories" className={styles.menuCard}>
                        <div className={styles.menuIcon}>
                            <LayoutGrid size={24} />
                        </div>
                        <div className={styles.menuContent}>
                            <h3>Categories</h3>
                            <p>Manage registration categories</p>
                        </div>
                        <ChevronRight size={18} />
                    </Link>

                    <Link href="/admin/payments" className={styles.menuCard}>
                        <div className={styles.menuIcon}>
                            <CreditCard size={24} />
                        </div>
                        <div className={styles.menuContent}>
                            <h3>Payments</h3>
                            <p>View transactions and revenue</p>
                        </div>
                        <ChevronRight size={18} />
                    </Link>

                    <Link href="/admin/content" className={styles.menuCard}>
                        <div className={styles.menuIcon}>
                            <Settings size={24} />
                        </div>
                        <div className={styles.menuContent}>
                            <h3>Content</h3>
                            <p>Edit official pages and links</p>
                        </div>
                        <ChevronRight size={18} />
                    </Link>

                    <Link href="/admin/partners" className={styles.menuCard}>
                        <div className={styles.menuIcon}>
                            <Handshake size={24} />
                        </div>
                        <div className={styles.menuContent}>
                            <h3>Partners</h3>
                            <p>Manage partner logos</p>
                        </div>
                        <ChevronRight size={18} />
                    </Link>
                </div>
            </div>

            {/* Recent Activity */}
            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Recent Activity</h2>
                <div className={styles.activityList}>
                    <div className={styles.activityItem}>
                        <div className={styles.activityDot} style={{ background: 'var(--success-500)' }} />
                        <div className={styles.activityContent}>
                            <span>New user registered: john@example.com</span>
                            <span className={styles.activityTime}>2 minutes ago</span>
                        </div>
                    </div>
                    <div className={styles.activityItem}>
                        <div className={styles.activityDot} style={{ background: 'var(--primary-500)' }} />
                        <div className={styles.activityContent}>
                            <span>New registration published: Tech Summit 2026</span>
                            <span className={styles.activityTime}>15 minutes ago</span>
                        </div>
                    </div>
                    <div className={styles.activityItem}>
                        <div className={styles.activityDot} style={{ background: 'var(--warning-500)' }} />
                        <div className={styles.activityContent}>
                            <span>Payment received: ₹599 from Event Organizer Pro</span>
                            <span className={styles.activityTime}>1 hour ago</span>
                        </div>
                    </div>
                    <div className={styles.activityItem}>
                        <div className={styles.activityDot} style={{ background: 'var(--secondary-500)' }} />
                        <div className={styles.activityContent}>
                            <span>User upgraded to Host: sarah@example.com</span>
                            <span className={styles.activityTime}>3 hours ago</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
