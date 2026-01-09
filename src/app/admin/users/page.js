'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft,
    Search,
    Download,
    UserCheck,
    UserX,
    ChevronLeft,
    ChevronRight,
    Filter,
    MoreVertical,
    Mail,
    Phone,
    Calendar,
    Shield
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Modal, { ModalFooter } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { getAllUsers, updateUserRole } from '@/lib/supabase';
import { getInitials, getAvatarColor, formatDate } from '@/lib/utils';
import { exportDataToExcel } from '@/lib/exportExcel';
import styles from './page.module.css';

const ITEMS_PER_PAGE = 10;

export default function AdminUsersPage() {
    const router = useRouter();
    const { isAuthenticated, isLoading, isAdmin } = useAuth();
    const toast = useToast();

    const [users, setUsers] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showUserModal, setShowUserModal] = useState(false);

    useEffect(() => {
        if (!isLoading && (!isAuthenticated || !isAdmin())) {
            router.push('/dashboard');
        }
    }, [isLoading, isAuthenticated, isAdmin, router]);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        setLoading(true);
        const { data, count } = await getAllUsers();
        if (data) {
            setUsers(data);
            setTotalCount(count || data.length);
        }
        setLoading(false);
    };

    // Filter users
    const filteredUsers = users.filter(user => {
        const matchesSearch = !searchQuery ||
            user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = !roleFilter || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    // Pagination
    const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handleRoleChange = async (userId, newRole) => {
        const { error } = await updateUserRole(userId, newRole);
        if (error) {
            toast.error('Failed to update role');
            return;
        }
        setUsers(prev => prev.map(u =>
            u.id === userId ? { ...u, role: newRole } : u
        ));
        toast.success(`User role updated to ${newRole}`);
        setShowUserModal(false);
    };

    const handleExport = async () => {
        try {
            const exportData = filteredUsers.map(user => ({
                Name: user.name || '',
                Email: user.email || '',
                Phone: user.phone || '',
                Role: user.role || 'agent',
                'Joined Date': formatDate(user.createdAt || user.created_at),
            }));
            await exportDataToExcel(exportData, 'Users', `users_export_${Date.now()}.xlsx`);
            toast.success('Users exported successfully');
        } catch (error) {
            toast.error('Failed to export users');
        }
    };

    const viewUserDetails = (user) => {
        setSelectedUser(user);
        setShowUserModal(true);
    };

    if (isLoading || !isAdmin()) {
        return <div className={styles.page}><div className={styles.loading}>Loading...</div></div>;
    }

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <button className={styles.backButton} onClick={() => router.back()}>
                    <ArrowLeft size={20} />
                </button>
                <div className={styles.headerContent}>
                    <h1 className={styles.title}>User Management</h1>
                    <span className={styles.userCount}>{totalCount} total users</span>
                </div>
            </div>

            {/* Toolbar */}
            <div className={styles.toolbar}>
                <div className={styles.searchBar}>
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                </div>
                <div className={styles.filters}>
                    <Select
                        value={roleFilter}
                        onChange={(e) => {
                            setRoleFilter(e.target.value);
                            setCurrentPage(1);
                        }}
                        options={[
                            { value: 'admin', label: 'Admin' },
                            { value: 'host', label: 'Host' },
                            { value: 'agent', label: 'Agent' },
                        ]}
                        placeholder="All Roles"
                    />
                    <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<Download size={16} />}
                        onClick={handleExport}
                    >
                        Export
                    </Button>
                </div>
            </div>

            {/* Stats Row */}
            <div className={styles.statsRow}>
                <div className={styles.statBadge}>
                    <span className={styles.statValue}>{users.filter(u => u.role === 'admin').length}</span>
                    <span className={styles.statLabel}>Admins</span>
                </div>
                <div className={styles.statBadge}>
                    <span className={styles.statValue}>{users.filter(u => u.role === 'host').length}</span>
                    <span className={styles.statLabel}>Hosts</span>
                </div>
                <div className={styles.statBadge}>
                    <span className={styles.statValue}>{users.filter(u => u.role === 'agent').length}</span>
                    <span className={styles.statLabel}>Agents</span>
                </div>
            </div>

            {/* User List */}
            {loading ? (
                <div className={styles.loading}>Loading users...</div>
            ) : paginatedUsers.length === 0 ? (
                <div className={styles.empty}>No users found</div>
            ) : (
                <div className={styles.userList}>
                    {paginatedUsers.map(user => (
                        <div
                            key={user.id}
                            className={styles.userCard}
                            onClick={() => viewUserDetails(user)}
                        >
                            <div
                                className={styles.avatar}
                                style={{ backgroundColor: getAvatarColor(user.name || user.email) }}
                            >
                                {getInitials(user.name || user.email)}
                            </div>
                            <div className={styles.userInfo}>
                                <h3>{user.name || 'Unnamed User'}</h3>
                                <p>{user.email}</p>
                            </div>
                            <span className={`${styles.roleBadge} ${styles[user.role]}`}>
                                {user.role}
                            </span>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className={styles.pagination}>
                    <button
                        className={styles.pageButton}
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <span className={styles.pageInfo}>
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        className={styles.pageButton}
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            )}

            {/* User Detail Modal */}
            <Modal
                isOpen={showUserModal}
                onClose={() => setShowUserModal(false)}
                title="User Details"
                size="sm"
            >
                {selectedUser && (
                    <div className={styles.userDetail}>
                        <div className={styles.userDetailHeader}>
                            <div
                                className={styles.avatarLarge}
                                style={{ backgroundColor: getAvatarColor(selectedUser.name || selectedUser.email) }}
                            >
                                {getInitials(selectedUser.name || selectedUser.email)}
                            </div>
                            <h3>{selectedUser.name || 'Unnamed User'}</h3>
                            <span className={`${styles.roleBadge} ${styles[selectedUser.role]}`}>
                                {selectedUser.role}
                            </span>
                        </div>

                        <div className={styles.userDetailInfo}>
                            <div className={styles.infoRow}>
                                <Mail size={16} />
                                <span>{selectedUser.email}</span>
                            </div>
                            {selectedUser.phone && (
                                <div className={styles.infoRow}>
                                    <Phone size={16} />
                                    <span>{selectedUser.phone}</span>
                                </div>
                            )}
                            <div className={styles.infoRow}>
                                <Calendar size={16} />
                                <span>Joined {formatDate(selectedUser.createdAt || selectedUser.created_at)}</span>
                            </div>
                        </div>

                        <div className={styles.roleActions}>
                            <p>Change Role:</p>
                            <div className={styles.roleButtons}>
                                {selectedUser.role !== 'agent' && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleRoleChange(selectedUser.id, 'agent')}
                                    >
                                        Set as Agent
                                    </Button>
                                )}
                                {selectedUser.role !== 'host' && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleRoleChange(selectedUser.id, 'host')}
                                    >
                                        Set as Host
                                    </Button>
                                )}
                                {selectedUser.role !== 'admin' && (
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        leftIcon={<Shield size={14} />}
                                        onClick={() => handleRoleChange(selectedUser.id, 'admin')}
                                    >
                                        Make Admin
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
                <ModalFooter>
                    <Button variant="outline" onClick={() => setShowUserModal(false)}>Close</Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}
