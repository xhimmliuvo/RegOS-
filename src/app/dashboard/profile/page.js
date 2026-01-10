'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, Shield, CreditCard, LogOut, ChevronRight, Edit2, Camera } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal, { ModalFooter } from '@/components/ui/Modal';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { getInitials, getAvatarColor, formatDate } from '@/lib/utils';
import styles from './page.module.css';

export default function ProfilePage() {
    const router = useRouter();
    const { user, isAuthenticated, isLoading, updateUser, logout } = useAuth();
    const toast = useToast();

    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
    });
    const [saving, setSaving] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/auth/login');
        }
    }, [isLoading, isAuthenticated, router]);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
            });
        }
    }, [user]);

    const handleSave = async () => {
        setSaving(true);

        // Simulate API call
        setTimeout(() => {
            updateUser({
                name: formData.name,
                phone: formData.phone,
            });

            setSaving(false);
            setEditing(false);
            toast.success('Profile updated successfully');
        }, 1000);
    };

    const handleLogout = () => {
        logout();
        router.push('/');
        toast.success('You have been logged out');
    };

    if (isLoading || !isAuthenticated) {
        return (
            <div className={styles.page}>
                <div className={styles.loading}>Loading...</div>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            {/* Header with Avatar */}
            <div className={styles.header}>
                <div className={styles.avatarSection}>
                    <div
                        className={styles.avatar}
                        style={{ backgroundColor: getAvatarColor(user?.name) }}
                    >
                        {user?.avatar ? (
                            <img src={user.avatar} alt={user.name} />
                        ) : (
                            <span>{getInitials(user?.name)}</span>
                        )}
                        <button className={styles.avatarEdit}>
                            <Camera size={14} />
                        </button>
                    </div>
                    <div className={styles.userInfo}>
                        <h1 className={styles.userName}>{user?.name}</h1>
                        <span className={styles.userRole}>{user?.role?.toUpperCase()}</span>
                    </div>
                </div>
            </div>

            {/* Profile Form */}
            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Personal Information</h2>
                    {!editing && (
                        <button className={styles.editButton} onClick={() => setEditing(true)}>
                            <Edit2 size={16} />
                            Edit
                        </button>
                    )}
                </div>

                <div className={styles.formGrid}>
                    <div className={styles.formField}>
                        <label>
                            <User size={16} />
                            Full Name
                        </label>
                        {editing ? (
                            <Input
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                placeholder="Your name"
                            />
                        ) : (
                            <span className={styles.fieldValue}>{user?.name || '-'}</span>
                        )}
                    </div>

                    <div className={styles.formField}>
                        <label>
                            <Mail size={16} />
                            Email
                        </label>
                        <span className={styles.fieldValue}>{user?.email}</span>
                        {!editing && <span className={styles.fieldHint}>Email cannot be changed</span>}
                    </div>

                    <div className={styles.formField}>
                        <label>
                            <Phone size={16} />
                            Phone
                        </label>
                        {editing ? (
                            <Input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                placeholder="Your phone number"
                            />
                        ) : (
                            <span className={styles.fieldValue}>{user?.phone || 'Not added'}</span>
                        )}
                    </div>
                </div>

                {editing && (
                    <div className={styles.formActions}>
                        <Button variant="outline" onClick={() => setEditing(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSave} loading={saving}>
                            Save Changes
                        </Button>
                    </div>
                )}
            </div>

            {/* Account Section */}
            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Account</h2>

                <div className={styles.menuList}>
                    <Link href="/dashboard/security" className={styles.menuItem}>
                        <Shield size={20} />
                        <div className={styles.menuContent}>
                            <span>Security</span>
                            <span className={styles.menuHint}>Password, 2FA</span>
                        </div>
                        <ChevronRight size={18} />
                    </Link>

                    <Link href="/dashboard/payments" className={styles.menuItem}>
                        <CreditCard size={20} />
                        <div className={styles.menuContent}>
                            <span>Payment History</span>
                            <span className={styles.menuHint}>View past transactions</span>
                        </div>
                        <ChevronRight size={18} />
                    </Link>

                    <button
                        className={`${styles.menuItem} ${styles.danger}`}
                        onClick={() => setShowLogoutModal(true)}
                    >
                        <LogOut size={20} />
                        <div className={styles.menuContent}>
                            <span>Log Out</span>
                            <span className={styles.menuHint}>Sign out of your account</span>
                        </div>
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>

            {/* Account Info */}
            <div className={styles.accountInfo}>
                <p>Member since {formatDate(user?.createdAt)}</p>
                <p>Account ID: {user?.id}</p>
            </div>

            {/* Logout Modal */}
            <Modal
                isOpen={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                title="Log Out"
                size="sm"
            >
                <p>Are you sure you want to log out of your account?</p>
                <ModalFooter>
                    <Button variant="outline" onClick={() => setShowLogoutModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleLogout}>
                        Log Out
                    </Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}
