'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    CreditCard,
    ArrowUpRight,
    Calendar,
    CheckCircle2,
    Clock,
    XCircle,
    Download
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import styles from './page.module.css';

// Mock payments
const MOCK_PAYMENTS = [
    {
        id: 'pay_123',
        description: 'Host Account Upgrade',
        amount: 299,
        status: 'completed',
        date: '2024-01-08T10:30:00Z',
        method: 'UPI',
        reference: 'UPI1234567890'
    },
    {
        id: 'pay_124',
        description: 'Publish Registration: Tech Meetup',
        amount: 49,
        status: 'pending',
        date: '2024-01-09T14:20:00Z',
        method: 'UPI',
        reference: 'UPI9876543210'
    }
];

export default function PaymentHistoryPage() {
    const router = useRouter();
    const { user } = useAuth();

    // In real app, fetch from Supabase
    const [payments] = useState(MOCK_PAYMENTS);

    const getStatusBadge = (status) => {
        switch (status) {
            case 'completed':
                return (
                    <span className={`${styles.badge} ${styles.completed}`}>
                        <CheckCircle2 size={12} />
                        Paid
                    </span>
                );
            case 'pending':
                return (
                    <span className={`${styles.badge} ${styles.pending}`}>
                        <Clock size={12} />
                        Verifying
                    </span>
                );
            case 'failed':
                return (
                    <span className={`${styles.badge} ${styles.failed}`}>
                        <XCircle size={12} />
                        Failed
                    </span>
                );
            default:
                return null;
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Payments</h1>
                    <p className={styles.subtitle}>Track your transactions</p>
                </div>
                <div className={styles.balanceCard}>
                    <span className={styles.balanceLabel}>Total Spent</span>
                    <div className={styles.balanceValue}>
                        ₹{payments.filter(p => p.status === 'completed').reduce((acc, curr) => acc + curr.amount, 0)}
                    </div>
                </div>
            </div>

            <div className={styles.list}>
                {payments.length > 0 ? (
                    payments.map(payment => (
                        <div key={payment.id} className={styles.item}>
                            <div className={styles.icon}>
                                <ArrowUpRight size={20} />
                            </div>
                            <div className={styles.content}>
                                <div className={styles.mainInfo}>
                                    <h3 className={styles.description}>{payment.description}</h3>
                                    <span className={styles.amount}>₹{payment.amount}</span>
                                </div>
                                <div className={styles.metaInfo}>
                                    <div className={styles.metaGroup}>
                                        <span className={styles.date}>
                                            <Calendar size={12} />
                                            {new Date(payment.date).toLocaleDateString()}
                                        </span>
                                        <span className={styles.method}>{payment.method}</span>
                                    </div>
                                    {getStatusBadge(payment.status)}
                                </div>
                                {payment.status === 'pending' && (
                                    <div className={styles.pendingNote}>
                                        Waiting for admin confirmation via WhatsApp
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className={styles.empty}>
                        <CreditCard size={48} />
                        <h3>No payments yet</h3>
                        <p>Your transactions will appear here</p>
                    </div>
                )}
            </div>
        </div>
    );
}
