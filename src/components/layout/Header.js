'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    Menu,
    Sun,
    Moon,
    Bell,
    User,
    LogOut,
    Settings,
    ChevronDown
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { getInitials, getAvatarColor } from '@/lib/utils';
import styles from './Header.module.css';

export default function Header({ onMenuClick }) {
    const router = useRouter();
    const { theme, toggleTheme, mounted } = useTheme();
    const { user, isAuthenticated, logout } = useAuth();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const menuRef = useRef(null);

    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowUserMenu(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        setShowUserMenu(false);
        router.push('/');
    };

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                {/* Left: Menu (desktop) + Logo */}
                <div className={styles.left}>
                    <button
                        className={`${styles.menuButton} ${styles.desktopOnly}`}
                        onClick={onMenuClick}
                        aria-label="Toggle menu"
                    >
                        <Menu size={24} />
                    </button>

                    <Link href="/" className={styles.logo}>
                        <div className={styles.logoIcon}>
                            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="32" height="32" rx="8" fill="url(#logoGradient)" />
                                <path d="M8 16L16 8L24 16L16 24L8 16Z" fill="white" fillOpacity="0.9" />
                                <path d="M12 16L16 12L20 16L16 20L12 16Z" fill="white" />
                                <defs>
                                    <linearGradient id="logoGradient" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                                        <stop stopColor="#6366f1" />
                                        <stop offset="1" stopColor="#8b5cf6" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                        <span className={styles.logoText}>RegOS</span>
                    </Link>
                </div>

                {/* Right: Actions */}
                <div className={styles.right}>
                    {/* Theme Toggle */}
                    {mounted && (
                        <button
                            className={styles.iconButton}
                            onClick={toggleTheme}
                            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                        >
                            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                        </button>
                    )}

                    {/* Notifications */}
                    {isAuthenticated && (
                        <Link href="/notifications" className={styles.iconButton} aria-label="Notifications">
                            <Bell size={20} />
                            <span className={styles.notificationDot} />
                        </Link>
                    )}

                    {/* User Menu */}
                    {isAuthenticated ? (
                        <div className={styles.userMenuWrapper} ref={menuRef}>
                            <button
                                className={styles.userButton}
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                aria-expanded={showUserMenu}
                            >
                                <div
                                    className={styles.avatar}
                                    style={{ backgroundColor: getAvatarColor(user?.name) }}
                                >
                                    {user?.avatar ? (
                                        <img src={user.avatar} alt={user.name} />
                                    ) : (
                                        <span>{getInitials(user?.name)}</span>
                                    )}
                                </div>
                                <ChevronDown
                                    size={16}
                                    className={`${styles.chevron} ${showUserMenu ? styles.chevronUp : ''}`}
                                />
                            </button>

                            {showUserMenu && (
                                <div className={styles.userMenu}>
                                    <div className={styles.userMenuHeader}>
                                        <div className={styles.userName}>{user?.name}</div>
                                        <div className={styles.userEmail}>{user?.email}</div>
                                        <div className={styles.userRole}>{user?.role?.toUpperCase()}</div>
                                    </div>
                                    <div className={styles.userMenuDivider} />
                                    <Link
                                        href="/dashboard/profile"
                                        className={styles.userMenuItem}
                                        onClick={() => setShowUserMenu(false)}
                                    >
                                        <User size={18} />
                                        <span>Profile</span>
                                    </Link>
                                    <Link
                                        href="/dashboard"
                                        className={styles.userMenuItem}
                                        onClick={() => setShowUserMenu(false)}
                                    >
                                        <Settings size={18} />
                                        <span>Dashboard</span>
                                    </Link>
                                    <div className={styles.userMenuDivider} />
                                    <button
                                        className={`${styles.userMenuItem} ${styles.logoutItem}`}
                                        onClick={handleLogout}
                                    >
                                        <LogOut size={18} />
                                        <span>Log out</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link href="/auth/login" className={styles.loginButton}>
                            Sign in
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}
