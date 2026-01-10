'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
    Bell, 
    Check, 
    Clock, 
    ArrowLeft,
    Info,
    AlertTriangle,
    Shield
} from 'lucide-react';
import Button from '@/components/ui/Button';
import styles from './page.module.css';

// Mock notifications (replace with real data/context later)
const MOCK_NOTIFICATIONS = [
    {
        id: '1',
        title: 'Welcome to RegOS!',
        message: 'Complete your profile to get started with hosting events.',
        type: 'info',
        time: 'Just now',
        read: false
    },
    {
        id: '2',
        title: 'Security Update',
        message: 'We have updated our terms and privacy policy.',
        type: 'security',
        time: '2 hours ago',
        read: true
    }
];

export default function NotificationsPage() {
    const router = useRouter();
    const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

    const markAllRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const getIcon = (type) => {
        switch (type) {
            case 'success': return <Check size={20} />;
            case 'security': return <Shield size={20} />;
            case 'warning': return <AlertTriangle size={20} />;
            default: return <Info size={20} />;
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <button className={styles.backButton} onClick={() => router.back()}>
                    <ArrowLeft size={20} />
                </button>
                <div className={styles.headerContent}>
                    <h1 className={styles.title}>Notifications</h1>
                    {notifications.some(n => !n.read) && (
                        <button className={styles.markRead} onClick={markAllRead}>
                            Mark all as read
                        </button>
                    )}
                </div>
            </div>

            <div className={styles.list}>
                {notifications.length > 0 ? (
                    notifications.map(notification => (
                        <div 
                            key={notification.id} 
                            className={`${styles.item} ${!notification.read ? styles.unread : ''}`}
                        >
                            <div className={`${styles.icon} ${styles[notification.type]}`}>
                                {getIcon(notification.type)}
                            </div>
                            <div className={styles.content}>
                                <div className={styles.itemHeader}>
                                    <h3 className={styles.itemTitle}>{notification.title}</h3>
                                    <span className={styles.time}>{notification.time}</span>
                                </div>
                                <p className={styles.message}>{notification.message}</p>
                            </div>
                            {!notification.read && <div className={styles.dot} />}
                        </div>
                    ))
                ) : (
                    <div className={styles.empty}>
                        <Bell size={48} />
                        <h3>No notifications</h3>
                        <p>You're all caught up!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
