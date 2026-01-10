'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { generateId } from '@/lib/utils';

const RegistrationContext = createContext(null);

const STORAGE_KEY = 'regos_registrations';

// Default mock data - only used if no stored data exists
const getDefaultRegistrations = () => [
    {
        id: 'reg_demo_1',
        title: 'Tech Conference 2026',
        description: 'Annual technology conference featuring the latest innovations.',
        category: 'events',
        visibility: 'public',
        duration: '30days',
        hostId: 'demo_host',
        hostName: 'Tech Events Co',
        createdAt: new Date().toISOString(),
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
        viewCount: 156,
        submissionCount: 42,
        featured: true,
        verified: true,
        formSchema: [
            { id: 'f1', type: 'text', label: 'Full Name', required: true },
            { id: 'f2', type: 'email', label: 'Email', required: true },
            { id: 'f3', type: 'phone', label: 'Phone', required: false },
        ],
    },
    {
        id: 'reg_demo_2',
        title: 'Startup Registration',
        description: 'Register your startup for incubation program.',
        category: 'business',
        visibility: 'public',
        duration: '14days',
        hostId: 'demo_host_2',
        hostName: 'Startup Hub',
        createdAt: new Date().toISOString(),
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
        viewCount: 89,
        submissionCount: 23,
        featured: false,
        verified: true,
        formSchema: [
            { id: 'f1', type: 'text', label: 'Startup Name', required: true },
            { id: 'f2', type: 'email', label: 'Contact Email', required: true },
        ],
    },
];

export function RegistrationProvider({ children }) {
    const [registrations, setRegistrations] = useState([]);
    const [loaded, setLoaded] = useState(false);

    // Load registrations from localStorage on mount (client-side only)
    useEffect(() => {
        if (typeof window === 'undefined') return;

        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setRegistrations(parsed);
                } else {
                    const defaults = getDefaultRegistrations();
                    setRegistrations(defaults);
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
                }
            } else {
                const defaults = getDefaultRegistrations();
                setRegistrations(defaults);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
            }
        } catch (e) {
            console.error('Error loading registrations:', e);
            setRegistrations(getDefaultRegistrations());
        }
        setLoaded(true);
    }, []);

    // Save to localStorage whenever registrations change
    useEffect(() => {
        if (loaded && typeof window !== 'undefined') {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(registrations));
            } catch (e) {
                console.error('Error saving registrations:', e);
            }
        }
    }, [registrations, loaded]);

    const createRegistration = (data) => {
        const now = new Date();
        const durationDays = {
            '7days': 7,
            '14days': 14,
            '30days': 30,
            '90days': 90,
        };
        const days = durationDays[data.duration] || 30;
        const endDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

        const newReg = {
            id: generateId('reg'),
            ...data,
            hostId: data.hostId || 'user_1',
            hostName: data.hostName || 'You',
            createdAt: now.toISOString(),
            startDate: now.toISOString(),
            endDate: endDate.toISOString(),
            status: 'pending', // Pending until admin confirms payment
            viewCount: 0,
            submissionCount: 0,
            featured: false,
            verified: false,
        };

        setRegistrations(prev => [newReg, ...prev]);
        return newReg;
    };

    const updateRegistration = (id, updates) => {
        setRegistrations(prev =>
            prev.map(reg => reg.id === id ? { ...reg, ...updates } : reg)
        );
    };

    const deleteRegistration = (id) => {
        setRegistrations(prev => prev.filter(reg => reg.id !== id));
    };

    const getRegistrationById = (id) => {
        return registrations.find(reg => reg.id === id);
    };

    const getRegistrationsByHost = (hostId) => {
        return registrations.filter(reg => reg.hostId === hostId);
    };

    const getActiveRegistrations = () => {
        return registrations.filter(reg => reg.status === 'active');
    };

    const getPendingRegistrations = () => {
        return registrations.filter(reg => reg.status === 'pending');
    };

    const getFeaturedRegistrations = () => {
        return registrations.filter(reg => reg.featured && reg.status === 'active');
    };

    const searchRegistrations = (query, category = null) => {
        let results = registrations.filter(reg => reg.status === 'active');

        if (query) {
            const q = query.toLowerCase();
            results = results.filter(reg =>
                reg.title?.toLowerCase().includes(q) ||
                reg.description?.toLowerCase().includes(q) ||
                reg.category?.toLowerCase().includes(q)
            );
        }

        if (category && category !== 'all') {
            results = results.filter(reg => reg.category === category);
        }

        return results;
    };

    const approveRegistration = (id) => {
        updateRegistration(id, { status: 'active', verified: true });
    };

    const rejectRegistration = (id) => {
        updateRegistration(id, { status: 'rejected' });
    };

    const addSubmission = (registrationId, submissionData) => {
        setRegistrations(prev =>
            prev.map(reg => {
                if (reg.id === registrationId) {
                    return {
                        ...reg,
                        submissionCount: (reg.submissionCount || 0) + 1,
                        submissions: [...(reg.submissions || []), {
                            id: generateId('sub'),
                            ...submissionData,
                            createdAt: new Date().toISOString(),
                        }],
                    };
                }
                return reg;
            })
        );
    };

    const incrementView = (registrationId) => {
        setRegistrations(prev =>
            prev.map(reg => {
                if (reg.id === registrationId) {
                    return { ...reg, viewCount: (reg.viewCount || 0) + 1 };
                }
                return reg;
            })
        );
    };

    // Don't render children until loaded to prevent hydration mismatch
    if (!loaded) {
        return null;
    }

    return (
        <RegistrationContext.Provider value={{
            registrations,
            loaded,
            createRegistration,
            updateRegistration,
            deleteRegistration,
            getRegistrationById,
            getRegistrationsByHost,
            getActiveRegistrations,
            getPendingRegistrations,
            getFeaturedRegistrations,
            searchRegistrations,
            approveRegistration,
            rejectRegistration,
            addSubmission,
            incrementView,
        }}>
            {children}
        </RegistrationContext.Provider>
    );
}

export function useRegistrations() {
    const context = useContext(RegistrationContext);
    if (!context) {
        throw new Error('useRegistrations must be used within RegistrationProvider');
    }
    return context;
}
