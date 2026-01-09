'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { MOCK_PLATFORM_CONTENT } from '@/lib/mockData';
import styles from '../info.module.css';

export default function HowItWorksPage() {
    const content = MOCK_PLATFORM_CONTENT.howItWorks;

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <Link href="/" className={styles.backButton}>
                    <ArrowLeft size={20} />
                </Link>
                <h1 className={styles.title}>{content.title}</h1>
            </div>

            <div className={styles.content}>
                <div className={styles.prose} dangerouslySetInnerHTML={{ __html: formatContent(content.content) }} />
            </div>
        </div>
    );
}

function formatContent(text) {
    return text
        .split('\n')
        .map(line => {
            if (line.startsWith('**') && line.endsWith('**')) {
                return `<h2>${line.slice(2, -2)}</h2>`;
            }
            if (line.startsWith('- ')) {
                return `<li>${line.slice(2)}</li>`;
            }
            if (line.trim() === '') {
                return '<br/>';
            }
            return `<p>${line}</p>`;
        })
        .join('');
}
