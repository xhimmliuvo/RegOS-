'use client';

import { useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';
import styles from './Modal.module.css';

export default function Modal({
    isOpen,
    onClose,
    title,
    description,
    children,
    size = 'md', // sm, md, lg, xl, full
    showCloseButton = true,
    closeOnOverlay = true,
    closeOnEscape = true,
}) {
    // Handle escape key
    const handleEscape = useCallback((e) => {
        if (e.key === 'Escape' && closeOnEscape) {
            onClose();
        }
    }, [onClose, closeOnEscape]);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = '';
        };
    }, [isOpen, handleEscape]);

    if (!isOpen) return null;

    const modalContent = (
        <div className={styles.overlay} onClick={closeOnOverlay ? onClose : undefined}>
            <div
                className={`${styles.modal} ${styles[size]}`}
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby={title ? 'modal-title' : undefined}
            >
                {/* Header */}
                {(title || showCloseButton) && (
                    <div className={styles.header}>
                        <div className={styles.headerContent}>
                            {title && <h2 id="modal-title" className={styles.title}>{title}</h2>}
                            {description && <p className={styles.description}>{description}</p>}
                        </div>
                        {showCloseButton && (
                            <button className={styles.closeButton} onClick={onClose} aria-label="Close">
                                <X size={20} />
                            </button>
                        )}
                    </div>
                )}

                {/* Body */}
                <div className={styles.body}>
                    {children}
                </div>
            </div>
        </div>
    );

    // Use portal to render modal at document root
    if (typeof window !== 'undefined') {
        return createPortal(modalContent, document.body);
    }

    return null;
}

// Modal Footer utility component
export function ModalFooter({ children, className = '' }) {
    return (
        <div className={`${styles.footer} ${className}`}>
            {children}
        </div>
    );
}

// Confirmation Modal
export function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title = 'Confirm Action',
    message = 'Are you sure you want to proceed?',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'danger', // danger, warning, info
    loading = false,
}) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} size="sm">
            <div className={styles.confirmContent}>
                <div className={`${styles.confirmIcon} ${styles[variant]}`}>
                    {variant === 'danger' && (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                    )}
                    {variant === 'warning' && (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                            <line x1="12" y1="9" x2="12" y2="13" />
                            <line x1="12" y1="17" x2="12.01" y2="17" />
                        </svg>
                    )}
                    {variant === 'info' && (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="16" x2="12" y2="12" />
                            <line x1="12" y1="8" x2="12.01" y2="8" />
                        </svg>
                    )}
                </div>
                <h3 className={styles.confirmTitle}>{title}</h3>
                <p className={styles.confirmMessage}>{message}</p>
                <div className={styles.confirmActions}>
                    <button
                        className={styles.cancelButton}
                        onClick={onClose}
                        disabled={loading}
                    >
                        {cancelText}
                    </button>
                    <button
                        className={`${styles.confirmButton} ${styles[variant]}`}
                        onClick={onConfirm}
                        disabled={loading}
                    >
                        {loading ? 'Loading...' : confirmText}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
