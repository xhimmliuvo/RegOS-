'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft,
    Download,
    FileText,
    Table,
    Filter,
    ChevronDown,
    Eye,
    Check,
    X,
    Clock,
    Calendar
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { Select } from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import {
    MOCK_REGISTRATIONS,
    MOCK_SUBMISSIONS,
    getRegistrationsByHost,
    getSubmissionsByRegistration
} from '@/lib/mockData';
import { formatDate, getStatusColor, getStatusLabel } from '@/lib/utils';
import { exportToPdf } from '@/lib/exportPdf';
import { exportToExcel } from '@/lib/exportExcel';
import styles from './page.module.css';

export default function SubmissionsPage() {
    const router = useRouter();
    const { user, isAuthenticated, isLoading, canCreateRegistration, isAdmin } = useAuth();
    const toast = useToast();

    const [selectedRegistration, setSelectedRegistration] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [exporting, setExporting] = useState(false);

    useEffect(() => {
        if (!isLoading && (!isAuthenticated || !canCreateRegistration())) {
            router.push('/dashboard');
        }
    }, [isLoading, isAuthenticated, canCreateRegistration, router]);

    if (isLoading || !canCreateRegistration()) {
        return <div className={styles.page}><div className={styles.loading}>Loading...</div></div>;
    }

    // Get user's registrations
    const userRegistrations = isAdmin()
        ? MOCK_REGISTRATIONS
        : getRegistrationsByHost(user?.id);

    // Get submissions for selected registration or all
    let submissions = [];
    if (selectedRegistration) {
        submissions = getSubmissionsByRegistration(selectedRegistration);
    } else {
        userRegistrations.forEach(reg => {
            submissions.push(...getSubmissionsByRegistration(reg.id));
        });
    }

    // Apply status filter
    if (statusFilter) {
        submissions = submissions.filter(s => s.status === statusFilter);
    }

    // Get registration for a submission
    const getRegistrationForSubmission = (registrationId) => {
        return userRegistrations.find(r => r.id === registrationId);
    };

    // Export functions
    const handleExportPdf = async () => {
        if (submissions.length === 0) {
            toast.error('No submissions to export');
            return;
        }

        setExporting(true);
        try {
            const reg = selectedRegistration
                ? getRegistrationForSubmission(selectedRegistration)
                : { title: 'All Registrations', formSchema: [] };

            await exportToPdf(reg, submissions);
            toast.success('PDF exported successfully');
        } catch (error) {
            toast.error('Failed to export PDF');
            console.error(error);
        }
        setExporting(false);
    };

    const handleExportExcel = async () => {
        if (submissions.length === 0) {
            toast.error('No submissions to export');
            return;
        }

        setExporting(true);
        try {
            const reg = selectedRegistration
                ? getRegistrationForSubmission(selectedRegistration)
                : { title: 'All Registrations', formSchema: [] };

            await exportToExcel(reg, submissions);
            toast.success('Excel exported successfully');
        } catch (error) {
            toast.error('Failed to export Excel');
            console.error(error);
        }
        setExporting(false);
    };

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <button className={styles.backButton} onClick={() => router.back()}>
                    <ArrowLeft size={20} />
                </button>
                <h1 className={styles.title}>Submissions</h1>
            </div>

            {/* Filters */}
            <div className={styles.filters}>
                <Select
                    value={selectedRegistration}
                    onChange={(e) => setSelectedRegistration(e.target.value)}
                    options={userRegistrations.map(r => ({ value: r.id, label: r.title }))}
                    placeholder="All Registrations"
                />
                <Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    options={[
                        { value: 'pending', label: 'Pending' },
                        { value: 'approved', label: 'Approved' },
                        { value: 'rejected', label: 'Rejected' },
                        { value: 'scheduled', label: 'Scheduled' },
                    ]}
                    placeholder="All Statuses"
                />
            </div>

            {/* Export Actions */}
            <div className={styles.exportBar}>
                <span className={styles.count}>{submissions.length} submission{submissions.length !== 1 ? 's' : ''}</span>
                <div className={styles.exportActions}>
                    <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<FileText size={16} />}
                        onClick={handleExportPdf}
                        loading={exporting}
                    >
                        PDF
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<Table size={16} />}
                        onClick={handleExportExcel}
                        loading={exporting}
                    >
                        Excel
                    </Button>
                </div>
            </div>

            {/* Submissions List */}
            {submissions.length > 0 ? (
                <div className={styles.submissionsList}>
                    {submissions.map(submission => {
                        const reg = getRegistrationForSubmission(submission.registrationId);
                        return (
                            <div key={submission.id} className={styles.submissionCard}>
                                <div
                                    className={styles.statusIndicator}
                                    style={{ background: getStatusColor(submission.status) }}
                                />
                                <div className={styles.submissionContent}>
                                    <div className={styles.submissionHeader}>
                                        <h3>{reg?.title || 'Unknown Registration'}</h3>
                                        <span
                                            className={styles.statusBadge}
                                            style={{ '--status-color': getStatusColor(submission.status) }}
                                        >
                                            {getStatusLabel(submission.status)}
                                        </span>
                                    </div>
                                    <div className={styles.submissionMeta}>
                                        <span>
                                            <Calendar size={12} />
                                            {formatDate(submission.submittedAt)}
                                        </span>
                                        {submission.notes && (
                                            <span className={styles.hasNotes}>Has notes</span>
                                        )}
                                    </div>
                                    <div className={styles.formDataPreview}>
                                        {Object.entries(submission.formData || {}).slice(0, 3).map(([key, value]) => (
                                            <span key={key}>{String(value).slice(0, 30)}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className={styles.emptyState}>
                    <p>No submissions found</p>
                </div>
            )}
        </div>
    );
}
