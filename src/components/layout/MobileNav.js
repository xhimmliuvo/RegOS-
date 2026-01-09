'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Home,
    Search,
    PlusCircle,
    LayoutDashboard,
    User
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import styles from './MobileNav.module.css';

const navItems = [
    { id: 'home', label: 'Home', href: '/', icon: Home },
    { id: 'search', label: 'Search', href: '/search', icon: Search },
    { id: 'create', label: 'Create', href: '/dashboard/create', icon: PlusCircle, requiresHost: true },
    { id: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, requiresAuth: true },
    { id: 'profile', label: 'Profile', href: '/dashboard/profile', icon: User },
];

export default function MobileNav() {
    const pathname = usePathname();
    const { isAuthenticated, canCreateRegistration } = useAuth();

    const visibleItems = navItems.filter(item => {
        // If item requires host privileges, check if user can create registrations
        if (item.requiresHost && !canCreateRegistration()) {
            return false;
        }
        return true;
    });

    return (
        <nav className={styles.nav}>
            <div className={styles.container}>
                {visibleItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href ||
                        (item.href !== '/' && pathname.startsWith(item.href));

                    return (
                        <Link
                            key={item.id}
                            href={item.requiresAuth && !isAuthenticated ? '/auth/login' : item.href}
                            className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                        >
                            <div className={styles.iconWrapper}>
                                <Icon className={styles.icon} size={24} strokeWidth={isActive ? 2.5 : 2} />
                                {isActive && <div className={styles.activeIndicator} />}
                            </div>
                            <span className={styles.label}>{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
