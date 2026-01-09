'use client';

import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((toast) => {
        const id = 'toast_' + Date.now() + Math.random().toString(36).substring(2, 9);
        const newToast = {
            id,
            type: toast.type || 'info', // success, error, warning, info
            message: toast.message,
            title: toast.title || null,
            duration: toast.duration ?? 4000,
            action: toast.action || null, // { label, onClick }
        };

        setToasts(prev => [...prev, newToast]);

        // Auto-remove toast after duration
        if (newToast.duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, newToast.duration);
        }

        return id;
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const clearToasts = useCallback(() => {
        setToasts([]);
    }, []);

    // Convenience methods
    const success = useCallback((message, options = {}) => {
        return addToast({ type: 'success', message, ...options });
    }, [addToast]);

    const error = useCallback((message, options = {}) => {
        return addToast({ type: 'error', message, ...options });
    }, [addToast]);

    const warning = useCallback((message, options = {}) => {
        return addToast({ type: 'warning', message, ...options });
    }, [addToast]);

    const info = useCallback((message, options = {}) => {
        return addToast({ type: 'info', message, ...options });
    }, [addToast]);

    const value = {
        toasts,
        addToast,
        removeToast,
        clearToasts,
        success,
        error,
        warning,
        info,
    };

    return (
        <ToastContext.Provider value={value}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    );
}

// Toast Container Component
function ToastContainer({ toasts, removeToast }) {
    if (toasts.length === 0) return null;

    return (
        <div className="toast-container">
            {toasts.map((toast) => (
                <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
            ))}
            <style jsx>{`
        .toast-container {
          position: fixed;
          top: calc(var(--header-height) + var(--space-4));
          right: var(--space-4);
          z-index: var(--z-toast);
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
          max-width: 400px;
          width: calc(100% - var(--space-8));
        }
        
        @media (max-width: 640px) {
          .toast-container {
            left: var(--space-4);
            right: var(--space-4);
            max-width: none;
          }
        }
      `}</style>
        </div>
    );
}

// Individual Toast Item
function ToastItem({ toast, onClose }) {
    const typeStyles = {
        success: {
            bg: 'var(--success-50)',
            border: 'var(--success-500)',
            icon: '✓',
            iconBg: 'var(--success-500)',
        },
        error: {
            bg: 'var(--error-50)',
            border: 'var(--error-500)',
            icon: '✕',
            iconBg: 'var(--error-500)',
        },
        warning: {
            bg: 'var(--warning-50)',
            border: 'var(--warning-500)',
            icon: '!',
            iconBg: 'var(--warning-500)',
        },
        info: {
            bg: 'var(--primary-50)',
            border: 'var(--primary-500)',
            icon: 'i',
            iconBg: 'var(--primary-500)',
        },
    };

    const style = typeStyles[toast.type] || typeStyles.info;

    return (
        <div className="toast animate-slideInRight">
            <div className="toast-icon" style={{ background: style.iconBg }}>
                {style.icon}
            </div>
            <div className="toast-content">
                {toast.title && <div className="toast-title">{toast.title}</div>}
                <div className="toast-message">{toast.message}</div>
                {toast.action && (
                    <button className="toast-action" onClick={toast.action.onClick}>
                        {toast.action.label}
                    </button>
                )}
            </div>
            <button className="toast-close" onClick={onClose}>
                ✕
            </button>
            <style jsx>{`
        .toast {
          display: flex;
          align-items: flex-start;
          gap: var(--space-3);
          padding: var(--space-3) var(--space-4);
          background: var(--surface);
          border: 1px solid ${style.border};
          border-left: 4px solid ${style.border};
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-lg);
        }
        
        .toast-icon {
          width: 24px;
          height: 24px;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: var(--text-sm);
          font-weight: var(--font-bold);
          flex-shrink: 0;
        }
        
        .toast-content {
          flex: 1;
          min-width: 0;
        }
        
        .toast-title {
          font-weight: var(--font-semibold);
          font-size: var(--text-sm);
          margin-bottom: var(--space-1);
        }
        
        .toast-message {
          font-size: var(--text-sm);
          color: var(--text-secondary);
        }
        
        .toast-action {
          margin-top: var(--space-2);
          color: var(--primary-500);
          font-size: var(--text-sm);
          font-weight: var(--font-medium);
          cursor: pointer;
        }
        
        .toast-action:hover {
          text-decoration: underline;
        }
        
        .toast-close {
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          font-size: var(--text-xs);
          cursor: pointer;
          flex-shrink: 0;
          border-radius: var(--radius-sm);
          transition: all var(--transition-fast);
        }
        
        .toast-close:hover {
          background: var(--bg-secondary);
          color: var(--text-primary);
        }
      `}</style>
        </div>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}

export default ToastContext;
