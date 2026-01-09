'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft,
    Calendar,
    Clock,
    Users,
    Eye,
    Share2,
    MapPin,
    ExternalLink,
    ChevronRight,
    AlertCircle
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { getRegistrationById } from '@/lib/mockData';
import { formatDate, getDaysRemaining, getStatusColor, getStatusLabel, copyToClipboard } from '@/lib/utils';
import { useToast } from '@/context/ToastContext';
import styles from './page.module.css';

export default function RegistrationDetailPage() {
    const params = useParams();
    const router = useRouter();
    const toast = useToast();
    const [registration, setRegistration] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const reg = getRegistrationById(params.id);
        if (reg) {
            setRegistration(reg);
        }
        setLoading(false);
    }, [params.id]);

    const handleShare = async () => {
        const url = window.location.href;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: registration.title,
                    text: registration.description,
                    url: url,
                });
            } catch (err) {
                // User cancelled or error
            }
        } else {
            await copyToClipboard(url);
            toast.success('Link copied to clipboard!');
        }
    };

    if (loading) {
        return (
            <div className={styles.page}>
                <div className={styles.skeleton}>
                    <div className={styles.skeletonBanner} />
                    <div className={styles.skeletonContent}>
                        <div className={styles.skeletonTitle} />
                        <div className={styles.skeletonText} />
                        <div className={styles.skeletonText} />
                    </div>
                </div>
            </div>
        );
    }

    if (!registration) {
        return (
            <div className={styles.page}>
                <div className={styles.notFound}>
                    <AlertCircle size={48} />
                    <h2>Registration Not Found</h2>
                    <p>The registration you're looking for doesn't exist or has been removed.</p>
                    <Link href="/search">
                        <Button>Browse Registrations</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const daysRemaining = getDaysRemaining(registration.endDate);
    const isExpired = registration.status === 'expired' || daysRemaining <= 0;
    const isPaused = registration.status === 'paused';
    const canSubmit = registration.status === 'active' && !isExpired;

    return (
        <div className={styles.page}>
            {/* Back Button */}
            <button className={styles.backButton} onClick={() => router.back()}>
                <ArrowLeft size={20} />
                <span>Back</span>
            </button>

            {/* Banner */}
            <div className={styles.banner}>
                {registration.bannerImage ? (
                    <img src={registration.bannerImage} alt={registration.title} className={styles.bannerImage} />
                ) : (
                    <div className={styles.bannerPlaceholder}>
                        <div className={styles.bannerPattern} />
                    </div>
                )}
                <div className={styles.bannerOverlay} />

                {/* Status Badge */}
                <div
                    className={styles.statusBadge}
                    style={{ '--status-color': getStatusColor(registration.status) }}
                >
                    <span className={styles.statusDot} />
                    {getStatusLabel(registration.status)}
                </div>
            </div>

            {/* Content */}
            <div className={styles.content}>
                {/* Header */}
                <div className={styles.header}>
                    <span className={styles.category}>{registration.category}</span>
                    <h1 className={styles.title}>{registration.title}</h1>
                    <p className={styles.host}>by {registration.hostName}</p>
                </div>

                {/* Stats */}
                <div className={styles.stats}>
                    <div className={styles.statItem}>
                        <Eye size={18} />
                        <span>{registration.viewCount?.toLocaleString() || 0} views</span>
                    </div>
                    <div className={styles.statItem}>
                        <Users size={18} />
                        <span>{registration.submissionCount?.toLocaleString() || 0} registered</span>
                    </div>
                    {!isExpired && (
                        <div className={`${styles.statItem} ${daysRemaining <= 3 ? styles.urgent : ''}`}>
                            <Clock size={18} />
                            <span>{daysRemaining} days left</span>
                        </div>
                    )}
                </div>

                {/* Description */}
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>About</h2>
                    <p className={styles.description}>{registration.description}</p>
                </div>

                {/* Dates */}
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Schedule</h2>
                    <div className={styles.dateGrid}>
                        <div className={styles.dateItem}>
                            <Calendar size={18} />
                            <div>
                                <span className={styles.dateLabel}>Start Date</span>
                                <span className={styles.dateValue}>{formatDate(registration.startDate)}</span>
                            </div>
                        </div>
                        <div className={styles.dateItem}>
                            <Calendar size={18} />
                            <div>
                                <span className={styles.dateLabel}>End Date</span>
                                <span className={styles.dateValue}>{formatDate(registration.endDate)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Fields Preview */}
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Registration Form</h2>
                    <div className={styles.formPreview}>
                        {registration.formSchema?.map((field, index) => (
                            <div key={field.id} className={styles.fieldPreview}>
                                <span className={styles.fieldName}>
                                    {field.label}
                                    {field.required && <span className={styles.required}>*</span>}
                                </span>
                                <span className={styles.fieldType}>{field.type}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className={styles.actions}>
                    {canSubmit ? (
                        <Link href={`/registration/submit/${registration.id}`} className={styles.primaryAction}>
                            <Button size="lg" fullWidth rightIcon={<ChevronRight size={20} />}>
                                Register Now
                            </Button>
                        </Link>
                    ) : (
                        <div className={styles.closedNotice}>
                            <AlertCircle size={20} />
                            <span>
                                {isExpired
                                    ? 'This registration has expired'
                                    : isPaused
                                        ? 'This registration is currently paused'
                                        : 'Registration is not available'}
                            </span>
                        </div>
                    )}

                    <Button
                        variant="outline"
                        size="lg"
                        fullWidth
                        leftIcon={<Share2 size={18} />}
                        onClick={handleShare}
                    >
                        Share
                    </Button>
                </div>
            </div>
        </div>
    );
}
