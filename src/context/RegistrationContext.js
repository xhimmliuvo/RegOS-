'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_REGISTRATIONS } from '@/lib/mockData';
import { generateId } from '@/lib/utils';

const RegistrationContext = createContext(null);

const STORAGE_KEY = 'regos_registrations';

export function RegistrationProvider({ children }) {
    const [registrations, setRegistrations] = useState([]);
    const [loaded, setLoaded] = useState(false);

    // Load registrations from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setRegistrations(parsed);
            } catch (e) {
                // If parse fails, use mock data
                setRegistrations(MOCK_REGISTRATIONS);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_REGISTRATIONS));
            }
        } else {
            // First time - seed with mock data
            setRegistrations(MOCK_REGISTRATIONS);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_REGISTRATIONS));
        }
        setLoaded(true);
    }, []);

    // Save to localStorage whenever registrations change
    useEffect(() => {
        if (loaded) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(registrations));
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
            status: 'active',
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
            getFeaturedRegistrations,
            searchRegistrations,
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
