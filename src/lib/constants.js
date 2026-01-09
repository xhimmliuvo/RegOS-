// =====================================================
// REGOS PLATFORM - CONSTANTS
// =====================================================

// Role Types
export const ROLES = {
    PUBLIC: 'public',
    AGENT: 'agent',
    HOST: 'host',
    ADMIN: 'admin',
};

// Registration Status
export const REGISTRATION_STATUS = {
    DRAFT: 'draft',
    ACTIVE: 'active',
    PAUSED: 'paused',
    EXPIRED: 'expired',
};

// Submission Status
export const SUBMISSION_STATUS = {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',
    SCHEDULED: 'scheduled',
};

// Visibility Options
export const VISIBILITY = {
    PUBLIC: 'public',
    PRIVATE: 'private',
};

// Payment Types
export const PAYMENT_TYPES = {
    PUBLISH: 'publish',
    EXTEND: 'extend',
    PAUSE: 'pause',
    RESUME: 'resume',
};

// Pricing Configuration (in INR ₹)
export const PRICING = {
    publish: {
        '1day': 49,
        '3days': 99,
        '5days': 149,
        '7days': 199,
        '15days': 349,
        '30days': 599,
    },
    extend: {
        '1day': 39,
        '3days': 79,
        '5days': 119,
        '7days': 159,
    },
    pause: 29,
    resume: 29,
};

// Duration Labels
export const DURATION_LABELS = {
    '1day': '1 Day',
    '3days': '3 Days',
    '5days': '5 Days',
    '7days': '1 Week',
    '15days': '15 Days',
    '30days': '30 Days',
};

// Form Field Types
export const FIELD_TYPES = {
    TEXT: 'text',
    TEXTAREA: 'textarea',
    NUMBER: 'number',
    EMAIL: 'email',
    PHONE: 'phone',
    VIN: 'vin',
    ID: 'id',
    DATE: 'date',
    TIME: 'time',
    DATETIME: 'datetime',
    SELECT: 'select',
    RADIO: 'radio',
    CHECKBOX: 'checkbox',
    FILE: 'file',
    IMAGE: 'image',
    URL: 'url',
};

// Default Categories
export const DEFAULT_CATEGORIES = [
    { id: 'events', name: 'Events', icon: 'Calendar', description: 'Conferences, workshops, and gatherings' },
    { id: 'appointments', name: 'Appointments', icon: 'Clock', description: 'Scheduled meetings and bookings' },
    { id: 'registrations', name: 'Registrations', icon: 'FileText', description: 'General form registrations' },
    { id: 'vehicles', name: 'Vehicle Registry', icon: 'Car', description: 'VIN and vehicle registrations' },
    { id: 'education', name: 'Education', icon: 'GraduationCap', description: 'Courses, exams, and admissions' },
    { id: 'government', name: 'Government', icon: 'Building2', description: 'Official government services' },
    { id: 'healthcare', name: 'Healthcare', icon: 'HeartPulse', description: 'Medical and health services' },
    { id: 'business', name: 'Business', icon: 'Briefcase', description: 'Business and corporate registrations' },
    { id: 'platform', name: 'Platform Information', icon: 'Info', description: 'Official platform content', adminOnly: true },
];

// Navigation Items
export const NAV_ITEMS = [
    { id: 'home', label: 'Home', href: '/', icon: 'Home' },
    { id: 'search', label: 'Search', href: '/search', icon: 'Search' },
    { id: 'create', label: 'Create', href: '/dashboard/create', icon: 'PlusCircle', requiresHost: true },
    { id: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard', requiresAuth: true },
    { id: 'profile', label: 'Profile', href: '/dashboard/profile', icon: 'User', requiresAuth: true },
];

// File Upload Limits
export const FILE_LIMITS = {
    maxImageSize: 5 * 1024 * 1024, // 5MB
    maxDocumentSize: 10 * 1024 * 1024, // 10MB
    allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    allowedDocumentTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
};

// Date Formats
export const DATE_FORMATS = {
    display: 'MMM dd, yyyy',
    displayWithTime: 'MMM dd, yyyy HH:mm',
    input: 'yyyy-MM-dd',
    inputWithTime: 'yyyy-MM-ddTHH:mm',
};

// API Routes (placeholder for future backend integration)
export const API_ROUTES = {
    auth: {
        login: '/api/auth/login',
        logout: '/api/auth/logout',
        register: '/api/auth/register',
        verify: '/api/auth/verify',
    },
    registrations: {
        list: '/api/registrations',
        create: '/api/registrations',
        get: (id) => `/api/registrations/${id}`,
        update: (id) => `/api/registrations/${id}`,
        delete: (id) => `/api/registrations/${id}`,
    },
    submissions: {
        list: '/api/submissions',
        create: '/api/submissions',
        get: (id) => `/api/submissions/${id}`,
        update: (id) => `/api/submissions/${id}`,
    },
    payments: {
        create: '/api/payments',
        verify: '/api/payments/verify',
        history: '/api/payments/history',
    },
};

// Local Storage Keys
export const STORAGE_KEYS = {
    user: 'regos_user',
    theme: 'regos_theme',
    registrations: 'regos_registrations',
    submissions: 'regos_submissions',
    categories: 'regos_categories',
    officialLinks: 'regos_official_links',
};

// Analytics Events (for future tracking)
export const ANALYTICS_EVENTS = {
    PAGE_VIEW: 'page_view',
    REGISTRATION_VIEW: 'registration_view',
    REGISTRATION_SUBMIT: 'registration_submit',
    REGISTRATION_CREATE: 'registration_create',
    USER_SIGNUP: 'user_signup',
    USER_LOGIN: 'user_login',
    PAYMENT_INITIATED: 'payment_initiated',
    PAYMENT_COMPLETED: 'payment_completed',
};
