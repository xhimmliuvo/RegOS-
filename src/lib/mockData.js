// =====================================================
// REGOS PLATFORM - MOCK DATA
// Demo data for development and testing
// =====================================================

import { generateId } from './utils';

// Mock Users
export const MOCK_USERS = [
    {
        id: 'usr_admin001',
        email: 'admin@regos.app',
        phone: '9876543210',
        name: 'Platform Admin',
        avatar: null,
        role: 'admin',
        verified: true,
        createdAt: '2024-01-01T00:00:00.000Z',
        paymentHistory: [],
    },
    {
        id: 'usr_host001',
        email: 'host@example.com',
        phone: '9876543211',
        name: 'Event Organizer Pro',
        avatar: null,
        role: 'host',
        verified: true,
        createdAt: '2024-06-15T10:30:00.000Z',
        paymentHistory: [
            { id: 'pay_001', amount: 599, type: 'publish', status: 'success', createdAt: '2024-12-01T09:00:00.000Z' },
        ],
    },
    {
        id: 'usr_agent001',
        email: 'agent@example.com',
        phone: '9876543212',
        name: 'John Agent',
        avatar: null,
        role: 'agent',
        verified: true,
        createdAt: '2024-09-20T14:45:00.000Z',
        paymentHistory: [],
    },
];

// Mock Categories
export const MOCK_CATEGORIES = [
    { id: 'events', name: 'Events', icon: 'Calendar', description: 'Conferences, workshops, and gatherings', count: 24 },
    { id: 'appointments', name: 'Appointments', icon: 'Clock', description: 'Scheduled meetings and bookings', count: 18 },
    { id: 'registrations', name: 'Registrations', icon: 'FileText', description: 'General form registrations', count: 45 },
    { id: 'vehicles', name: 'Vehicle Registry', icon: 'Car', description: 'VIN and vehicle registrations', count: 12 },
    { id: 'education', name: 'Education', icon: 'GraduationCap', description: 'Courses, exams, and admissions', count: 32 },
    { id: 'government', name: 'Government', icon: 'Building2', description: 'Official government services', count: 8 },
    { id: 'healthcare', name: 'Healthcare', icon: 'HeartPulse', description: 'Medical and health services', count: 15 },
    { id: 'business', name: 'Business', icon: 'Briefcase', description: 'Business and corporate registrations', count: 21 },
    { id: 'platform', name: 'Platform Information', icon: 'Info', description: 'Official platform content', adminOnly: true, count: 5 },
];

// Mock Registrations
export const MOCK_REGISTRATIONS = [
    {
        id: 'reg_001',
        hostId: 'usr_host001',
        hostName: 'Event Organizer Pro',
        title: 'Tech Innovation Summit 2026',
        description: 'Join the biggest tech conference of the year! Network with industry leaders, attend workshops, and discover the latest innovations in AI, blockchain, and cloud computing.',
        category: 'events',
        visibility: 'public',
        status: 'active',
        startDate: '2026-01-15T09:00:00.000Z',
        endDate: '2026-02-15T18:00:00.000Z',
        bannerImage: null,
        gallery: [],
        viewCount: 1250,
        submissionCount: 342,
        formSchema: [
            { id: 'f1', type: 'text', label: 'Full Name', required: true, placeholder: 'Enter your full name' },
            { id: 'f2', type: 'email', label: 'Email Address', required: true, placeholder: 'your@email.com' },
            { id: 'f3', type: 'phone', label: 'Phone Number', required: true, placeholder: '9876543210' },
            { id: 'f4', type: 'select', label: 'Session Preference', required: true, options: ['AI Workshop', 'Blockchain 101', 'Cloud Architecture', 'All Sessions'] },
            { id: 'f5', type: 'textarea', label: 'Why do you want to attend?', required: false, placeholder: 'Tell us about yourself...' },
        ],
        createdAt: '2024-12-20T10:00:00.000Z',
        featured: true,
    },
    {
        id: 'reg_002',
        hostId: 'usr_host001',
        hostName: 'Event Organizer Pro',
        title: 'Photography Masterclass',
        description: 'Learn professional photography techniques from award-winning photographers. This hands-on workshop covers composition, lighting, and post-processing.',
        category: 'education',
        visibility: 'public',
        status: 'active',
        startDate: '2026-01-10T10:00:00.000Z',
        endDate: '2026-01-25T16:00:00.000Z',
        bannerImage: null,
        gallery: [],
        viewCount: 567,
        submissionCount: 89,
        formSchema: [
            { id: 'f1', type: 'text', label: 'Full Name', required: true },
            { id: 'f2', type: 'email', label: 'Email', required: true },
            { id: 'f3', type: 'select', label: 'Experience Level', required: true, options: ['Beginner', 'Intermediate', 'Advanced'] },
            { id: 'f4', type: 'checkbox', label: 'I have my own camera', required: false },
        ],
        createdAt: '2024-12-18T14:30:00.000Z',
        featured: true,
    },
    {
        id: 'reg_003',
        hostId: 'usr_admin001',
        hostName: 'Platform Admin',
        title: 'Vehicle Registration Drive',
        description: 'Annual vehicle registration verification. All vehicle owners must submit their documents for yearly compliance check.',
        category: 'vehicles',
        visibility: 'public',
        status: 'active',
        startDate: '2026-01-01T00:00:00.000Z',
        endDate: '2026-03-31T23:59:00.000Z',
        bannerImage: null,
        gallery: [],
        viewCount: 2340,
        submissionCount: 1023,
        formSchema: [
            { id: 'f1', type: 'text', label: 'Owner Name', required: true },
            { id: 'f2', type: 'vin', label: 'Vehicle Identification Number (VIN)', required: true, placeholder: 'Enter 17-character VIN' },
            { id: 'f3', type: 'text', label: 'Registration Number', required: true, placeholder: 'e.g., MH12AB1234' },
            { id: 'f4', type: 'select', label: 'Vehicle Type', required: true, options: ['Two-Wheeler', 'Car', 'Commercial', 'Other'] },
            { id: 'f5', type: 'file', label: 'Upload RC Copy', required: true, accept: 'application/pdf,image/*' },
        ],
        createdAt: '2024-12-01T09:00:00.000Z',
        featured: false,
    },
    {
        id: 'reg_004',
        hostId: 'usr_host001',
        hostName: 'Event Organizer Pro',
        title: 'Startup Pitch Competition',
        description: 'Pitch your startup idea to top investors and win funding! Open to all entrepreneurs with innovative business ideas.',
        category: 'business',
        visibility: 'public',
        status: 'active',
        startDate: '2026-01-20T09:00:00.000Z',
        endDate: '2026-02-10T18:00:00.000Z',
        bannerImage: null,
        gallery: [],
        viewCount: 890,
        submissionCount: 156,
        formSchema: [
            { id: 'f1', type: 'text', label: 'Startup Name', required: true },
            { id: 'f2', type: 'text', label: 'Founder Name', required: true },
            { id: 'f3', type: 'email', label: 'Email', required: true },
            { id: 'f4', type: 'url', label: 'Website/LinkedIn', required: false },
            { id: 'f5', type: 'select', label: 'Industry', required: true, options: ['Tech', 'Healthcare', 'Fintech', 'EdTech', 'E-commerce', 'Other'] },
            { id: 'f6', type: 'select', label: 'Funding Stage', required: true, options: ['Idea Stage', 'MVP', 'Seed', 'Series A+'] },
            { id: 'f7', type: 'textarea', label: 'Pitch Summary (100 words)', required: true },
            { id: 'f8', type: 'file', label: 'Pitch Deck (PDF)', required: true, accept: 'application/pdf' },
        ],
        createdAt: '2024-12-22T11:00:00.000Z',
        featured: true,
    },
    {
        id: 'reg_005',
        hostId: 'usr_host001',
        hostName: 'Event Organizer Pro',
        title: 'Health Checkup Camp',
        description: 'Free comprehensive health checkup camp. Includes blood tests, BMI, blood pressure, and doctor consultation.',
        category: 'healthcare',
        visibility: 'public',
        status: 'paused',
        startDate: '2026-01-25T08:00:00.000Z',
        endDate: '2026-01-27T17:00:00.000Z',
        bannerImage: null,
        gallery: [],
        viewCount: 432,
        submissionCount: 198,
        formSchema: [
            { id: 'f1', type: 'text', label: 'Full Name', required: true },
            { id: 'f2', type: 'number', label: 'Age', required: true },
            { id: 'f3', type: 'select', label: 'Gender', required: true, options: ['Male', 'Female', 'Other'] },
            { id: 'f4', type: 'phone', label: 'Contact Number', required: true },
            { id: 'f5', type: 'select', label: 'Preferred Date', required: true, options: ['Jan 25', 'Jan 26', 'Jan 27'] },
            { id: 'f6', type: 'checkbox', label: 'I have existing medical conditions', required: false },
        ],
        createdAt: '2024-12-15T08:00:00.000Z',
        featured: false,
    },
    {
        id: 'reg_006',
        hostId: 'usr_host001',
        hostName: 'Event Organizer Pro',
        title: 'Music Festival 2025',
        description: 'The ultimate music experience with top artists from around the world. Three days of non-stop entertainment!',
        category: 'events',
        visibility: 'public',
        status: 'expired',
        startDate: '2025-11-01T16:00:00.000Z',
        endDate: '2025-11-03T23:00:00.000Z',
        bannerImage: null,
        gallery: [],
        viewCount: 5600,
        submissionCount: 2340,
        formSchema: [
            { id: 'f1', type: 'text', label: 'Name', required: true },
            { id: 'f2', type: 'email', label: 'Email', required: true },
            { id: 'f3', type: 'select', label: 'Pass Type', required: true, options: ['Day Pass', 'Full Festival', 'VIP'] },
        ],
        createdAt: '2025-09-01T10:00:00.000Z',
        featured: false,
    },
];

// Mock Submissions
export const MOCK_SUBMISSIONS = [
    {
        id: 'sub_001',
        registrationId: 'reg_001',
        userId: 'usr_agent001',
        formData: {
            f1: 'John Agent',
            f2: 'agent@example.com',
            f3: '9876543212',
            f4: 'AI Workshop',
            f5: 'I am passionate about AI and want to learn more about the latest developments.',
        },
        files: [],
        status: 'approved',
        notes: 'Welcome to Tech Innovation Summit! Your pass has been confirmed.',
        submittedAt: '2024-12-25T14:30:00.000Z',
    },
    {
        id: 'sub_002',
        registrationId: 'reg_001',
        userId: null,
        formData: {
            f1: 'Sarah Wilson',
            f2: 'sarah@example.com',
            f3: '9123456789',
            f4: 'All Sessions',
            f5: 'Looking forward to networking opportunities.',
        },
        files: [],
        status: 'pending',
        notes: null,
        submittedAt: '2024-12-26T09:15:00.000Z',
    },
    {
        id: 'sub_003',
        registrationId: 'reg_003',
        userId: null,
        formData: {
            f1: 'Rajesh Kumar',
            f2: 'WDB123456789012345',
            f3: 'MH12AB1234',
            f4: 'Car',
        },
        files: [{ name: 'rc_copy.pdf', size: 245000, type: 'application/pdf' }],
        status: 'approved',
        notes: 'Documents verified. Registration valid until March 2026.',
        submittedAt: '2024-12-20T11:00:00.000Z',
    },
    {
        id: 'sub_004',
        registrationId: 'reg_004',
        userId: null,
        formData: {
            f1: 'InnovateTech',
            f2: 'Priya Sharma',
            f3: 'priya@innovatetech.com',
            f4: 'https://innovatetech.com',
            f5: 'Tech',
            f6: 'MVP',
            f7: 'AI-powered customer service platform that reduces response time by 80%.',
        },
        files: [{ name: 'pitch_deck.pdf', size: 3200000, type: 'application/pdf' }],
        status: 'scheduled',
        notes: 'Pitch scheduled for Feb 5, 2026 at 2:00 PM. Slot #12.',
        submittedAt: '2024-12-28T16:45:00.000Z',
    },
];

// Mock Official Links
export const MOCK_OFFICIAL_LINKS = [
    {
        id: 'link_001',
        title: 'Help Center',
        icon: 'HelpCircle',
        description: 'Get answers to frequently asked questions',
        url: '/info/help',
        order: 1,
    },
    {
        id: 'link_002',
        title: 'Contact Support',
        icon: 'Mail',
        description: 'Reach out to our support team',
        url: 'mailto:support@regos.app',
        order: 2,
    },
    {
        id: 'link_003',
        title: 'Developer Portal',
        icon: 'Code',
        description: 'API documentation and developer resources',
        url: '/info/developers',
        order: 3,
    },
    {
        id: 'link_004',
        title: 'Report an Issue',
        icon: 'AlertTriangle',
        description: 'Report bugs or suspicious activity',
        url: '/report',
        order: 4,
    },
    {
        id: 'link_005',
        title: 'Follow us on X',
        icon: 'Twitter',
        description: 'Stay updated with latest news',
        url: 'https://twitter.com/regosapp',
        order: 5,
    },
];

// Mock Platform Content
export const MOCK_PLATFORM_CONTENT = {
    about: {
        title: 'About RegOS',
        content: `
RegOS is a mobile-first, installable registration and information platform that functions as an operating system for registrations, events, appointments, and official communications.

**Our Mission**

To create a unified platform where individuals and organizations can create, manage, monetize, and communicate registrations while acting as a central, trusted information hub.

**What We Do**

- Enable seamless event and registration management
- Provide secure, verified information channels
- Connect organizers with participants efficiently
- Offer transparent, fair monetization

**Why RegOS?**

Traditional registration systems are fragmented. WhatsApp groups, scattered Google Forms, and manual follow-ups create chaos. RegOS brings everything under one roof, controlled and verified.
    `,
        lastUpdated: '2024-12-01T00:00:00.000Z',
    },
    terms: {
        title: 'Terms & Conditions',
        content: `
**Terms of Service**

Last updated: December 1, 2024

By using RegOS, you agree to these terms. Please read them carefully.

**1. Account Registration**
- You must provide accurate information
- You are responsible for your account security
- Accounts are personal and non-transferable

**2. Host Responsibilities**
- Hosts must provide accurate event information
- Fraudulent registrations will result in account termination
- Hosts are responsible for their attendee data

**3. Payments**
- All fees are clearly displayed before payment
- Refunds are subject to our refund policy
- Pricing may change with notice

**4. Content Guidelines**
- No illegal or harmful content
- Respect intellectual property rights
- No spam or misleading information

**5. Platform Usage**
- Use the platform responsibly
- Do not attempt to hack or exploit the system
- Report any security vulnerabilities
    `,
        lastUpdated: '2024-12-01T00:00:00.000Z',
    },
    privacy: {
        title: 'Privacy Policy',
        content: `
**Privacy Policy**

Last updated: December 1, 2024

Your privacy is important to us. This policy explains how we handle your data.

**1. Data We Collect**
- Account information (email, phone, name)
- Registration submissions
- Usage analytics

**2. How We Use Data**
- To provide our services
- To improve user experience
- To send notifications (with consent)

**3. Data Sharing**
- We do not sell your data
- Hosts can see their submission data
- We may share data if legally required

**4. Data Security**
- We use encryption for sensitive data
- Regular security audits
- Limited access to user data

**5. Your Rights**
- Request your data
- Delete your account
- Opt out of marketing
    `,
        lastUpdated: '2024-12-01T00:00:00.000Z',
    },
    howItWorks: {
        title: 'How It Works',
        content: `
**Getting Started with RegOS**

**For Participants**

1. **Browse** - Search for events, registrations, or forms
2. **Register** - Fill out the form and submit
3. **Track** - Check your submission status anytime
4. **Receive** - Get updates, results, and next steps

**For Hosts**

1. **Sign Up** - Create an account (free)
2. **Upgrade** - Become a host to create registrations
3. **Create** - Build your registration form
4. **Publish** - Pay to make it live
5. **Manage** - View submissions, update statuses
6. **Export** - Download data in PDF or Excel

**Pricing**

- 1 Day: ₹49
- 3 Days: ₹99
- 5 Days: ₹149
- 7 Days: ₹199
- 15 Days: ₹349
- 30 Days: ₹599

**Tips for Success**

- Use clear, descriptive titles
- Add a compelling banner image
- Keep forms concise
- Respond to submissions promptly
    `,
        lastUpdated: '2024-12-01T00:00:00.000Z',
    },
};

// Helper functions to work with mock data
export function getRegistrationById(id) {
    return MOCK_REGISTRATIONS.find(r => r.id === id) || null;
}

export function getSubmissionsByRegistration(registrationId) {
    return MOCK_SUBMISSIONS.filter(s => s.registrationId === registrationId);
}

export function getRegistrationsByHost(hostId) {
    return MOCK_REGISTRATIONS.filter(r => r.hostId === hostId);
}

export function getFeaturedRegistrations() {
    return MOCK_REGISTRATIONS.filter(r => r.featured && r.status === 'active');
}

export function getActiveRegistrations() {
    return MOCK_REGISTRATIONS.filter(r => r.status === 'active');
}

export function searchRegistrations(query) {
    if (!query || query.trim() === '') return MOCK_REGISTRATIONS;

    const searchTerms = query.toLowerCase().trim().split(/\s+/);

    return MOCK_REGISTRATIONS.filter(reg => {
        const searchableText = `${reg.title} ${reg.description} ${reg.category} ${reg.hostName}`.toLowerCase();
        return searchTerms.every(term => searchableText.includes(term));
    });
}

export function getCategoryById(id) {
    return MOCK_CATEGORIES.find(c => c.id === id) || null;
}

// Generate demo data for testing
export function generateDemoRegistration() {
    return {
        id: generateId('reg'),
        hostId: null,
        hostName: 'Demo Host',
        title: 'New Registration',
        description: '',
        category: 'registrations',
        visibility: 'public',
        status: 'draft',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        bannerImage: null,
        gallery: [],
        viewCount: 0,
        submissionCount: 0,
        formSchema: [],
        createdAt: new Date().toISOString(),
        featured: false,
    };
}
