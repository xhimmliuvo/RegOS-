'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Search,
    ArrowRight,
    Sparkles,
    Calendar,
    Clock,
    FileText,
    Car,
    GraduationCap,
    Building2,
    HeartPulse,
    Briefcase,
    ChevronRight,
    TrendingUp,
    Star,
    Users,
    Shield
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Card, { CardSkeleton } from '@/components/ui/Card';
import { useAuth } from '@/context/AuthContext';
import { useRegistrations } from '@/context/RegistrationContext';
import { MOCK_CATEGORIES } from '@/lib/mockData';
import { getUserCount, getPartners } from '@/lib/supabase';
import styles from './page.module.css';

// Icon mapping for categories
const categoryIcons = {
    Calendar,
    Clock,
    FileText,
    Car,
    GraduationCap,
    Building2,
    HeartPulse,
    Briefcase,
};

export default function HomePage() {
    const { isAuthenticated, canCreateRegistration } = useAuth();
    const { registrations, loaded, getFeaturedRegistrations, getActiveRegistrations } = useRegistrations();
    const [searchQuery, setSearchQuery] = useState('');
    const [userCount, setUserCount] = useState(5000);
    const [partners, setPartners] = useState([]);

    useEffect(() => {
        // Load user count
        getUserCount().then(({ count }) => {
            if (count) setUserCount(count);
        });
        // Load partners
        getPartners().then(({ data }) => {
            if (data) setPartners(data);
        });
    }, []);

    const featuredRegistrations = loaded ? getFeaturedRegistrations() : [];
    const recentRegistrations = loaded ? getActiveRegistrations().slice(0, 6) : [];
    const publicCategories = MOCK_CATEGORIES.filter(c => !c.adminOnly);

    return (
        <div className={styles.page}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroBackground}>
                    <div className={styles.gradientOrb1} />
                    <div className={styles.gradientOrb2} />
                    <div className={styles.gradientOrb3} />
                    <div className={styles.gridPattern} />
                </div>

                <div className={styles.heroContent}>
                    <div className={styles.heroBadge}>
                        <Sparkles size={14} />
                        <span>The Registration Operating System</span>
                    </div>

                    <h1 className={styles.heroTitle}>
                        One Platform for All Your
                        <span className={styles.heroTitleGradient}> Registrations</span>
                    </h1>

                    <p className={styles.heroDescription}>
                        Create, manage, and discover events, appointments, and registrations
                        in one powerful, mobile-first platform.
                    </p>

                    {/* Search Bar */}
                    <div className={styles.searchWrapper}>
                        <div className={styles.searchBar}>
                            <Search className={styles.searchIcon} size={20} />
                            <input
                                type="text"
                                placeholder="Search events, registrations, or hosts..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={styles.searchInput}
                            />
                            <Link href={`/search${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ''}`}>
                                <Button size="md">
                                    Search
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className={styles.heroCtas}>
                        <Link href="/search">
                            <Button variant="secondary" size="lg" rightIcon={<ArrowRight size={18} />}>
                                Explore Registrations
                            </Button>
                        </Link>
                        {canCreateRegistration() ? (
                            <Link href="/dashboard/create">
                                <Button variant="outline" size="lg">
                                    Create Registration
                                </Button>
                            </Link>
                        ) : (
                            <Link href={isAuthenticated ? "/dashboard" : "/auth/login"}>
                                <Button variant="outline" size="lg">
                                    {isAuthenticated ? 'Become a Host' : 'Get Started'}
                                </Button>
                            </Link>
                        )}
                    </div>

                    {/* Stats */}
                    <div className={styles.heroStats}>
                        <div className={styles.statItem}>
                            <span className={styles.statValue}>10K+</span>
                            <span className={styles.statLabel}>Registrations</span>
                        </div>
                        <div className={styles.statDivider} />
                        <div className={styles.statItem}>
                            <span className={styles.statValue}>5K+</span>
                            <span className={styles.statLabel}>Active Hosts</span>
                        </div>
                        <div className={styles.statDivider} />
                        <div className={styles.statItem}>
                            <span className={styles.statValue}>500K+</span>
                            <span className={styles.statLabel}>Submissions</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Registrations */}
            {featuredRegistrations.length > 0 && (
                <section className={styles.section}>
                    <div className={styles.container}>
                        <div className={styles.sectionHeader}>
                            <div className={styles.sectionTitle}>
                                <Star className={styles.sectionIcon} size={20} />
                                <h2>Featured</h2>
                            </div>
                            <Link href="/search?featured=true" className={styles.sectionLink}>
                                View all <ChevronRight size={16} />
                            </Link>
                        </div>

                        <div className={styles.cardsGrid}>
                            {featuredRegistrations.map((reg) => (
                                <Card
                                    key={reg.id}
                                    id={reg.id}
                                    title={reg.title}
                                    description={reg.description}
                                    category={reg.category}
                                    status={reg.status}
                                    bannerImage={reg.bannerImage}
                                    viewCount={reg.viewCount}
                                    submissionCount={reg.submissionCount}
                                    endDate={reg.endDate}
                                    hostName={reg.hostName}
                                    featured={reg.featured}
                                />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Categories */}
            <section className={styles.section}>
                <div className={styles.container}>
                    <div className={styles.sectionHeader}>
                        <div className={styles.sectionTitle}>
                            <h2>Browse Categories</h2>
                        </div>
                    </div>

                    <div className={styles.categoriesGrid}>
                        {publicCategories.map((category) => {
                            const IconComponent = categoryIcons[category.icon] || FileText;
                            return (
                                <Link
                                    key={category.id}
                                    href={`/search?category=${category.id}`}
                                    className={styles.categoryCard}
                                >
                                    <div className={styles.categoryIcon}>
                                        <IconComponent size={24} />
                                    </div>
                                    <div className={styles.categoryContent}>
                                        <h3 className={styles.categoryName}>{category.name}</h3>
                                        <p className={styles.categoryDesc}>{category.description}</p>
                                    </div>
                                    <span className={styles.categoryCount}>{category.count || 0}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Recent Registrations */}
            <section className={styles.section}>
                <div className={styles.container}>
                    <div className={styles.sectionHeader}>
                        <div className={styles.sectionTitle}>
                            <TrendingUp className={styles.sectionIcon} size={20} />
                            <h2>Recently Added</h2>
                        </div>
                        <Link href="/search?sort=newest" className={styles.sectionLink}>
                            View all <ChevronRight size={16} />
                        </Link>
                    </div>

                    <div className={styles.cardsGrid}>
                        {recentRegistrations.map((reg) => (
                            <Card
                                key={reg.id}
                                id={reg.id}
                                title={reg.title}
                                description={reg.description}
                                category={reg.category}
                                status={reg.status}
                                bannerImage={reg.bannerImage}
                                viewCount={reg.viewCount}
                                submissionCount={reg.submissionCount}
                                endDate={reg.endDate}
                                hostName={reg.hostName}
                                featured={reg.featured}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className={styles.ctaSection}>
                <div className={styles.container}>
                    <div className={styles.ctaCard}>
                        <div className={styles.ctaContent}>
                            <h2 className={styles.ctaTitle}>Ready to host your own registration?</h2>
                            <p className={styles.ctaDescription}>
                                Create professional registration forms, manage submissions, and
                                communicate with your audience - all in one place.
                            </p>
                            <Link href={isAuthenticated ? "/dashboard/create" : "/auth/signup"}>
                                <Button size="lg" rightIcon={<ArrowRight size={18} />}>
                                    {isAuthenticated ? 'Create Now' : 'Get Started Free'}
                                </Button>
                            </Link>
                        </div>
                        <div className={styles.ctaDecoration}>
                            <div className={styles.ctaShape1} />
                            <div className={styles.ctaShape2} />
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust Section */}
            <section className={styles.trustSection}>
                <div className={styles.container}>
                    <div className={styles.trustBadge}>
                        <Shield size={20} />
                        <span>Trusted by <strong>{userCount.toLocaleString()}+</strong> users</span>
                    </div>

                    {partners.length > 0 && (
                        <div className={styles.partnersRow}>
                            <span className={styles.partnersLabel}>Our Partners</span>
                            <div className={styles.partnersList}>
                                {partners.map((partner) => (
                                    <a
                                        key={partner.id}
                                        href={partner.url || '#'}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.partnerItem}
                                        title={partner.name}
                                    >
                                        {partner.logo ? (
                                            <img src={partner.logo} alt={partner.name} />
                                        ) : (
                                            <span>{partner.name}</span>
                                        )}
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Footer */}
            <footer className={styles.footer}>
                <div className={styles.container}>
                    <div className={styles.footerContent}>
                        <div className={styles.footerBrand}>
                            <div className={styles.footerLogo}>
                                <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect width="32" height="32" rx="8" fill="url(#footerGradient)" />
                                    <path d="M8 16L16 8L24 16L16 24L8 16Z" fill="white" fillOpacity="0.9" />
                                    <path d="M12 16L16 12L20 16L16 20L12 16Z" fill="white" />
                                    <defs>
                                        <linearGradient id="footerGradient" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                                            <stop stopColor="#6366f1" />
                                            <stop offset="1" stopColor="#8b5cf6" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                                <span>RegOS</span>
                            </div>
                            <p className={styles.footerTagline}>The Registration Operating System</p>
                        </div>

                        <div className={styles.footerLinks}>
                            <div className={styles.footerLinkGroup}>
                                <h4>Platform</h4>
                                <Link href="/search">Browse</Link>
                                <Link href="/info/how-it-works">How it Works</Link>
                                <Link href="/info/links">Official Links</Link>
                            </div>
                            <div className={styles.footerLinkGroup}>
                                <h4>Legal</h4>
                                <Link href="/info/terms">Terms</Link>
                                <Link href="/info/privacy">Privacy</Link>
                                <Link href="/info/about">About</Link>
                            </div>
                        </div>
                    </div>

                    <div className={styles.footerBottom}>
                        <p>© 2026 RegOS. All rights reserved.</p>
                        <p className={styles.developerCredit}>
                            Developed by <strong>Jihal Shimray</strong>
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
