// =====================================================
// REGOS PLATFORM - UTILITY FUNCTIONS
// =====================================================

/**
 * Generate a unique ID
 */
export function generateId(prefix = '') {
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substring(2, 10);
    return prefix ? `${prefix}_${timestamp}${randomPart}` : `${timestamp}${randomPart}`;
}

/**
 * Format currency (INR)
 */
export function formatCurrency(amount, currency = 'INR') {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

/**
 * Format date
 */
export function formatDate(date, options = {}) {
    const d = new Date(date);
    const defaultOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        ...options,
    };
    return d.toLocaleDateString('en-IN', defaultOptions);
}

/**
 * Format date with time
 */
export function formatDateTime(date) {
    const d = new Date(date);
    return d.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

/**
 * Get relative time (e.g., "2 hours ago")
 */
export function getRelativeTime(date) {
    const now = new Date();
    const d = new Date(date);
    const diffMs = now - d;
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 60) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatDate(date);
}

/**
 * Calculate days remaining
 */
export function getDaysRemaining(endDate) {
    const now = new Date();
    const end = new Date(endDate);
    const diffMs = end - now;
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
}

/**
 * Check if registration is expired
 */
export function isExpired(endDate) {
    return new Date(endDate) < new Date();
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
}

/**
 * Slugify a string
 */
export function slugify(text) {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

/**
 * Debounce function
 */
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function
 */
export function throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}

/**
 * Deep clone object
 */
export function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj);
    if (Array.isArray(obj)) return obj.map(item => deepClone(item));

    const cloned = {};
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            cloned[key] = deepClone(obj[key]);
        }
    }
    return cloned;
}

/**
 * Validate email format
 */
export function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate phone number (Indian format)
 */
export function isValidPhone(phone) {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone.replace(/\D/g, ''));
}

/**
 * Format phone number
 */
export function formatPhone(phone) {
    const digits = phone.replace(/\D/g, '');
    if (digits.length === 10) {
        return `+91 ${digits.substring(0, 5)} ${digits.substring(5)}`;
    }
    return phone;
}

/**
 * Get initials from name
 */
export function getInitials(name) {
    if (!name) return '?';
    const parts = name.trim().split(' ').filter(Boolean);
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Get random color for avatar
 */
export function getAvatarColor(name) {
    const colors = [
        'hsl(250, 84%, 54%)', // Primary purple
        'hsl(190, 95%, 39%)', // Teal
        'hsl(330, 81%, 60%)', // Pink
        'hsl(152, 69%, 45%)', // Green
        'hsl(38, 92%, 50%)',  // Orange
        'hsl(0, 84%, 60%)',   // Red
    ];

    if (!name) return colors[0];
    const charSum = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[charSum % colors.length];
}

/**
 * Format file size
 */
export function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Get file extension
 */
export function getFileExtension(filename) {
    return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2).toLowerCase();
}

/**
 * Check if file is an image
 */
export function isImageFile(file) {
    const imageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    return imageTypes.includes(file.type);
}

/**
 * Convert file to base64
 */
export function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

/**
 * Download data as file
 */
export function downloadFile(data, filename, type = 'application/octet-stream') {
    const blob = new Blob([data], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        console.error('Failed to copy:', err);
        return false;
    }
}

/**
 * Get status color
 */
export function getStatusColor(status) {
    const colors = {
        draft: 'var(--neutral-500)',
        active: 'var(--success-500)',
        paused: 'var(--warning-500)',
        expired: 'var(--error-500)',
        pending: 'var(--warning-500)',
        approved: 'var(--success-500)',
        rejected: 'var(--error-500)',
        scheduled: 'var(--primary-500)',
    };
    return colors[status] || 'var(--neutral-500)';
}

/**
 * Get status label
 */
export function getStatusLabel(status) {
    const labels = {
        draft: 'Draft',
        active: 'Active',
        paused: 'Paused',
        expired: 'Expired',
        pending: 'Pending',
        approved: 'Approved',
        rejected: 'Rejected',
        scheduled: 'Scheduled',
    };
    return labels[status] || status;
}

/**
 * Sort array by date
 */
export function sortByDate(array, key, ascending = false) {
    return [...array].sort((a, b) => {
        const dateA = new Date(a[key]);
        const dateB = new Date(b[key]);
        return ascending ? dateA - dateB : dateB - dateA;
    });
}

/**
 * Group array by key
 */
export function groupBy(array, key) {
    return array.reduce((groups, item) => {
        const value = item[key];
        if (!groups[value]) {
            groups[value] = [];
        }
        groups[value].push(item);
        return groups;
    }, {});
}

/**
 * Filter array by search query
 */
export function filterBySearch(array, query, keys) {
    if (!query || query.trim() === '') return array;

    const searchTerms = query.toLowerCase().trim().split(/\s+/);

    return array.filter(item => {
        return searchTerms.every(term => {
            return keys.some(key => {
                const value = item[key];
                if (!value) return false;
                return String(value).toLowerCase().includes(term);
            });
        });
    });
}

/**
 * Calculate conversion rate
 */
export function calculateConversionRate(submissions, views) {
    if (!views || views === 0) return 0;
    return ((submissions / views) * 100).toFixed(1);
}

/**
 * Generate random gradient
 */
export function generateGradient(id) {
    const gradients = [
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
        'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    ];

    if (!id) return gradients[0];
    const charSum = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return gradients[charSum % gradients.length];
}
