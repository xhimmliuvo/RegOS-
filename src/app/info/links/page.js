'use client';

import Link from 'next/link';
import { ArrowLeft, ExternalLink, HelpCircle, Mail, Code, AlertTriangle, Twitter } from 'lucide-react';
import { MOCK_OFFICIAL_LINKS } from '@/lib/mockData';
import styles from '../info.module.css';

// Icon mapping
const iconMap = {
    HelpCircle,
    Mail,
    Code,
    AlertTriangle,
    Twitter,
};

export default function LinksPage() {
    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <Link href="/" className={styles.backButton}>
                    <ArrowLeft size={20} />
                </Link>
                <h1 className={styles.title}>Official Links</h1>
            </div>

            <div className={styles.content}>
                <p className={styles.description}>
                    Access official resources, support channels, and external links curated by the platform administrators.
                </p>

                <div className={styles.linksGrid}>
                    {MOCK_OFFICIAL_LINKS.map((link) => {
                        const IconComponent = iconMap[link.icon] || HelpCircle;
                        const isExternal = link.url.startsWith('http') || link.url.startsWith('mailto:');

                        return (
                            <a
                                key={link.id}
                                href={link.url}
                                target={isExternal ? '_blank' : undefined}
                                rel={isExternal ? 'noopener noreferrer' : undefined}
                                className={styles.linkCard}
                            >
                                <div className={styles.linkIcon}>
                                    <IconComponent size={24} />
                                </div>
                                <div className={styles.linkContent}>
                                    <h3>{link.title}</h3>
                                    <p>{link.description}</p>
                                </div>
                                {isExternal && <ExternalLink size={16} className={styles.externalIcon} />}
                            </a>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
