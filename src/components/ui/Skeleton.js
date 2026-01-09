'use client';

import styles from './Skeleton.module.css';

// Basic skeleton component
export function Skeleton({ width, height, borderRadius = 'var(--radius-md)', className = '' }) {
    return (
        <div
            className={`${styles.skeleton} ${className}`}
            style={{
                width: width || '100%',
                height: height || '20px',
                borderRadius,
            }}
        />
    );
}

// Card skeleton
export function CardSkeleton() {
    return (
        <div className={styles.cardSkeleton}>
            <Skeleton height="140px" borderRadius="var(--radius-xl) var(--radius-xl) 0 0" />
            <div className={styles.cardContent}>
                <Skeleton width="60%" height="20px" />
                <Skeleton width="100%" height="14px" />
                <Skeleton width="80%" height="14px" />
                <div className={styles.cardMeta}>
                    <Skeleton width="60px" height="24px" borderRadius="var(--radius-full)" />
                    <Skeleton width="40px" height="14px" />
                </div>
            </div>
        </div>
    );
}

// List item skeleton
export function ListItemSkeleton() {
    return (
        <div className={styles.listItem}>
            <Skeleton width="48px" height="48px" borderRadius="var(--radius-full)" />
            <div className={styles.listContent}>
                <Skeleton width="70%" height="16px" />
                <Skeleton width="50%" height="14px" />
            </div>
        </div>
    );
}

// Text skeleton
export function TextSkeleton({ lines = 3 }) {
    return (
        <div className={styles.textSkeleton}>
            {Array.from({ length: lines }).map((_, i) => (
                <Skeleton
                    key={i}
                    width={i === lines - 1 ? '60%' : '100%'}
                    height="14px"
                />
            ))}
        </div>
    );
}

// Stats skeleton
export function StatsSkeleton() {
    return (
        <div className={styles.statsSkeleton}>
            {[1, 2, 3, 4].map(i => (
                <div key={i} className={styles.statCard}>
                    <Skeleton width="48px" height="48px" borderRadius="var(--radius-lg)" />
                    <Skeleton width="60px" height="24px" />
                    <Skeleton width="80px" height="14px" />
                </div>
            ))}
        </div>
    );
}

// Page loading skeleton
export function PageSkeleton() {
    return (
        <div className={styles.pageSkeleton}>
            <Skeleton width="200px" height="32px" />
            <Skeleton width="100%" height="48px" borderRadius="var(--radius-xl)" />
            <div className={styles.grid}>
                {[1, 2, 3, 4, 5, 6].map(i => (
                    <CardSkeleton key={i} />
                ))}
            </div>
        </div>
    );
}
