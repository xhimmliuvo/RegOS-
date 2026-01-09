import Link from 'next/link';
import { ArrowRight, Clock, Eye, Users } from 'lucide-react';
import { formatDate, getDaysRemaining, getStatusColor, truncateText } from '@/lib/utils';
import styles from './Card.module.css';

export default function Card({
    id,
    title,
    description,
    category,
    status,
    bannerImage,
    viewCount,
    submissionCount,
    endDate,
    hostName,
    featured = false,
    className = '',
}) {
    const daysRemaining = getDaysRemaining(endDate);
    const isExpired = status === 'expired' || daysRemaining <= 0;

    return (
        <Link
            href={`/registration/${id}`}
            className={`${styles.card} ${featured ? styles.featured : ''} ${className}`}
        >
            {/* Banner */}
            <div className={styles.banner}>
                {bannerImage ? (
                    <img src={bannerImage} alt={title} className={styles.bannerImage} />
                ) : (
                    <div className={styles.bannerPlaceholder}>
                        <div className={styles.bannerPattern} />
                    </div>
                )}

                {/* Status Badge */}
                <div
                    className={styles.statusBadge}
                    style={{ '--status-color': getStatusColor(status) }}
                >
                    <span className={styles.statusDot} />
                    {status}
                </div>

                {/* Featured Badge */}
                {featured && (
                    <div className={styles.featuredBadge}>
                        ⭐ Featured
                    </div>
                )}

                {/* Overlay Gradient */}
                <div className={styles.bannerOverlay} />
            </div>

            {/* Content */}
            <div className={styles.content}>
                {/* Category */}
                <span className={styles.category}>{category}</span>

                {/* Title */}
                <h3 className={styles.title}>{title}</h3>

                {/* Description */}
                <p className={styles.description}>
                    {truncateText(description, 100)}
                </p>

                {/* Meta */}
                <div className={styles.meta}>
                    <div className={styles.metaItem}>
                        <Eye size={14} />
                        <span>{viewCount?.toLocaleString() || 0}</span>
                    </div>
                    <div className={styles.metaItem}>
                        <Users size={14} />
                        <span>{submissionCount?.toLocaleString() || 0}</span>
                    </div>
                    {!isExpired && (
                        <div className={`${styles.metaItem} ${daysRemaining <= 3 ? styles.urgent : ''}`}>
                            <Clock size={14} />
                            <span>{daysRemaining}d left</span>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className={styles.footer}>
                    <span className={styles.host}>by {hostName}</span>
                    <span className={styles.arrow}>
                        <ArrowRight size={16} />
                    </span>
                </div>
            </div>
        </Link>
    );
}

// Compact card variant for lists
export function CardCompact({
    id,
    title,
    category,
    status,
    submissionCount,
    endDate,
    className = '',
}) {
    const daysRemaining = getDaysRemaining(endDate);

    return (
        <Link
            href={`/registration/${id}`}
            className={`${styles.cardCompact} ${className}`}
        >
            <div className={styles.compactLeft}>
                <span
                    className={styles.compactDot}
                    style={{ backgroundColor: getStatusColor(status) }}
                />
                <div className={styles.compactContent}>
                    <h4 className={styles.compactTitle}>{title}</h4>
                    <span className={styles.compactCategory}>{category}</span>
                </div>
            </div>
            <div className={styles.compactRight}>
                <span className={styles.compactCount}>{submissionCount}</span>
                <span className={styles.compactDays}>{daysRemaining}d</span>
            </div>
        </Link>
    );
}

// Skeleton loader for cards
export function CardSkeleton() {
    return (
        <div className={styles.skeleton}>
            <div className={styles.skeletonBanner} />
            <div className={styles.skeletonContent}>
                <div className={styles.skeletonCategory} />
                <div className={styles.skeletonTitle} />
                <div className={styles.skeletonDesc} />
                <div className={styles.skeletonMeta} />
            </div>
        </div>
    );
}
