'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    Plus,
    MoreVertical,
    Eye,
    Users,
    Calendar,
    Pause,
    Play,
    Trash2,
    Edit,
    ExternalLink
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { CardCompact } from '@/components/ui/Card';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { getRegistrationsByHost, MOCK_REGISTRATIONS } from '@/lib/mockData';
import { formatDate, getDaysRemaining } from '@/lib/utils';
import styles from './page.module.css';

export default function ManageRegistrationsPage() {
    const router = useRouter();
    const { user, isAuthenticated, isLoading, canCreateRegistration, isAdmin } = useAuth();
    const toast = useToast();
    const [activeMenu, setActiveMenu] = useState(null);

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

    // Get user's registrations
    const registrations = isAdmin()
        ? MOCK_REGISTRATIONS
        : getRegistrationsByHost(user?.id);

    const handleAction = (action, regId) => {
        setActiveMenu(null);
        switch (action) {
            case 'pause':
                toast.success('Registration paused');
                break;
            case 'resume':
                toast.success('Registration resumed');
                break;
            case 'delete':
                toast.success('Registration deleted');
                break;
            case 'edit':
                router.push(`/dashboard/edit/${regId}`);
                break;
            default:
                break;
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Manage Registrations</h1>
                    <p className={styles.subtitle}>{registrations.length} total registrations</p>
                </div>
                <Link href="/dashboard/create">
                    <Button leftIcon={<Plus size={18} />}>Create New</Button>
                </Link>
            </div>

            {registrations.length > 0 ? (
                <div className={styles.list}>
                    {registrations.map((reg) => {
                        const daysLeft = getDaysRemaining(reg.endDate);
                        return (
                            <div key={reg.id} className={styles.card}>
                                <Link href={`/registration/${reg.id}`} className={styles.cardMain}>
                                    <div className={styles.cardHeader}>
                                        <span className={`${styles.status} ${styles[reg.status]}`}>
                                            {reg.status}
                                        </span>
                                        <span className={styles.category}>{reg.category}</span>
                                    </div>
                                    <h3 className={styles.cardTitle}>{reg.title}</h3>
                                    <div className={styles.cardMeta}>
                                        <span><Eye size={14} /> {reg.viewCount}</span>
                                        <span><Users size={14} /> {reg.submissionCount}</span>
                                        <span><Calendar size={14} /> {daysLeft > 0 ? `${daysLeft}d left` : 'Expired'}</span>
                                    </div>
                                </Link>
                                <div className={styles.cardActions}>
                                    <button
                                        className={styles.menuButton}
                                        onClick={() => setActiveMenu(activeMenu === reg.id ? null : reg.id)}
                                    >
                                        <MoreVertical size={18} />
                                    </button>
                                    {activeMenu === reg.id && (
                                        <div className={styles.menu}>
                                            <Link href={`/registration/${reg.id}`} className={styles.menuItem}>
                                                <ExternalLink size={16} /> View
                                            </Link>
                                            <button
                                                className={styles.menuItem}
                                                onClick={() => handleAction('edit', reg.id)}
                                            >
                                                <Edit size={16} /> Edit
                                            </button>
                                            {reg.status === 'active' ? (
                                                <button
                                                    className={styles.menuItem}
                                                    onClick={() => handleAction('pause', reg.id)}
                                                >
                                                    <Pause size={16} /> Pause
                                                </button>
                                            ) : (
                                                <button
                                                    className={styles.menuItem}
                                                    onClick={() => handleAction('resume', reg.id)}
                                                >
                                                    <Play size={16} /> Resume
                                                </button>
                                            )}
                                            <button
                                                className={`${styles.menuItem} ${styles.danger}`}
                                                onClick={() => handleAction('delete', reg.id)}
                                            >
                                                <Trash2 size={16} /> Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className={styles.empty}>
                    <div className={styles.emptyIcon}>📋</div>
                    <h3>No registrations yet</h3>
                    <p>Create your first registration to get started</p>
                    <Link href="/dashboard/create">
                        <Button leftIcon={<Plus size={18} />}>Create Registration</Button>
                    </Link>
                </div>
            )}
        </div>
    );
}
