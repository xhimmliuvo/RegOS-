// =====================================================
// SUPABASE CLIENT & AUTH HELPERS
// =====================================================

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Check if Supabase is configured
export const isSupabaseConfigured = () => {
    return supabaseUrl &&
        supabaseAnonKey &&
        !supabaseUrl.includes('your_supabase') &&
        !supabaseAnonKey.includes('your_');
};

// Create Supabase client (only if configured)
export const supabase = isSupabaseConfigured()
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

// =====================================================
// AUTH FUNCTIONS
// =====================================================

/**
 * Sign up a new user
 */
export async function signUp(email, password, metadata = {}) {
    if (!supabase) {
        console.warn('Supabase not configured, using mock auth');
        return {
            data: { user: { id: 'mock', email, ...metadata } },
            error: null
        };
    }

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: metadata,
        },
    });

    if (!error && data.user) {
        // Create profile entry
        await supabase.from('profiles').insert({
            id: data.user.id,
            name: metadata.name || '',
            email: email,
            role: 'agent',
        });
    }

    return { data, error };
}

/**
 * Sign in with email/password
 */
export async function signIn(email, password) {
    if (!supabase) {
        console.warn('Supabase not configured, using mock auth');
        // Determine role from email for demo
        let role = 'agent';
        if (email.includes('admin')) role = 'admin';
        else if (email.includes('host')) role = 'host';

        return {
            data: {
                user: {
                    id: 'mock-' + Date.now(),
                    email,
                    user_metadata: { role }
                },
                session: { access_token: 'mock-token' }
            },
            error: null
        };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    return { data, error };
}

/**
 * Sign out current user
 */
export async function signOut() {
    if (!supabase) {
        return { error: null };
    }
    return await supabase.auth.signOut();
}

/**
 * Get current session
 */
export async function getSession() {
    if (!supabase) {
        return { data: { session: null }, error: null };
    }
    return await supabase.auth.getSession();
}

/**
 * Get current user
 */
export async function getCurrentUser() {
    if (!supabase) {
        return null;
    }
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}

/**
 * Get user profile with role
 */
export async function getUserProfile(userId) {
    if (!supabase) {
        return null;
    }

    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    if (error) {
        console.error('Error fetching profile:', error);
        return null;
    }

    return data;
}

/**
 * Update user profile
 */
export async function updateProfile(userId, updates) {
    if (!supabase) {
        return { data: updates, error: null };
    }

    const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

    return { data, error };
}

/**
 * Send password reset email
 */
export async function resetPassword(email) {
    if (!supabase) {
        return { data: {}, error: null };
    }
    return await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
    });
}

// =====================================================
// DATABASE FUNCTIONS
// =====================================================

/**
 * Get all users (admin only)
 */
export async function getAllUsers() {
    if (!supabase) {
        // Return mock data
        const { MOCK_USERS } = await import('./mockData');
        return { data: MOCK_USERS, error: null, count: MOCK_USERS.length };
    }

    const { data, error, count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

    return { data, error, count };
}

/**
 * Get user count for trust indicator
 */
export async function getUserCount() {
    if (!supabase) {
        return { count: 5247, error: null }; // Fake count for demo
    }

    const { count, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

    return { count, error };
}

/**
 * Update user role (admin only)
 */
export async function updateUserRole(userId, newRole) {
    if (!supabase) {
        return { data: { role: newRole }, error: null };
    }

    const { data, error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId)
        .select()
        .single();

    return { data, error };
}

/**
 * Get all partners
 */
export async function getPartners() {
    if (!supabase) {
        return {
            data: [
                { id: '1', name: 'TechCorp', logo: '/partners/tech.png', url: '#', order: 1 },
                { id: '2', name: 'StartupHub', logo: '/partners/startup.png', url: '#', order: 2 },
                { id: '3', name: 'InnovateLabs', logo: '/partners/innovate.png', url: '#', order: 3 },
            ],
            error: null
        };
    }

    const { data, error } = await supabase
        .from('partners')
        .select('*')
        .order('order', { ascending: true });

    return { data, error };
}

/**
 * Add new partner (admin only)
 */
export async function addPartner(partner) {
    if (!supabase) {
        return { data: { id: Date.now(), ...partner }, error: null };
    }

    const { data, error } = await supabase
        .from('partners')
        .insert(partner)
        .select()
        .single();

    return { data, error };
}

/**
 * Update partner (admin only)
 */
export async function updatePartner(id, updates) {
    if (!supabase) {
        return { data: { id, ...updates }, error: null };
    }

    const { data, error } = await supabase
        .from('partners')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    return { data, error };
}

/**
 * Delete partner (admin only)
 */
export async function deletePartner(id) {
    if (!supabase) {
        return { error: null };
    }

    const { error } = await supabase
        .from('partners')
        .delete()
        .eq('id', id);

    return { error };
}

/**
 * Get platform stats
 */
export async function getPlatformStats() {
    if (!supabase) {
        return {
            totalUsers: 5247,
            totalRegistrations: 1832,
            totalSubmissions: 45000,
            totalRevenue: 125000,
        };
    }

    const [users, registrations, submissions] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('registrations').select('*', { count: 'exact', head: true }),
        supabase.from('submissions').select('*', { count: 'exact', head: true }),
    ]);

    return {
        totalUsers: users.count || 0,
        totalRegistrations: registrations.count || 0,
        totalSubmissions: submissions.count || 0,
        totalRevenue: 0, // Would come from payments table
    };
}

// =====================================================
// REGISTRATIONS
// =====================================================

/**
 * Get all registrations
 */
export async function getRegistrations(filters = {}) {
    if (!supabase) {
        const { MOCK_REGISTRATIONS } = await import('./mockData');
        return { data: MOCK_REGISTRATIONS, error: null };
    }

    let query = supabase
        .from('registrations')
        .select('*, profiles(name)')
        .order('created_at', { ascending: false });

    if (filters.status) {
        query = query.eq('status', filters.status);
    }

    if (filters.category) {
        query = query.eq('category', filters.category);
    }

    if (filters.hostId) {
        query = query.eq('host_id', filters.hostId);
    }

    const { data, error } = await query;
    return { data, error };
}

/**
 * Create registration
 */
export async function createRegistration(registration) {
    if (!supabase) {
        return { data: { id: Date.now(), ...registration }, error: null };
    }

    const { data, error } = await supabase
        .from('registrations')
        .insert(registration)
        .select()
        .single();

    return { data, error };
}

// =====================================================
// SUBMISSIONS
// =====================================================

/**
 * Create submission
 */
export async function createSubmission(submission) {
    if (!supabase) {
        return { data: { id: Date.now(), ...submission }, error: null };
    }

    const { data, error } = await supabase
        .from('submissions')
        .insert(submission)
        .select()
        .single();

    return { data, error };
}

/**
 * Get submissions for a registration
 */
export async function getSubmissions(registrationId) {
    if (!supabase) {
        const { MOCK_SUBMISSIONS } = await import('./mockData');
        return {
            data: MOCK_SUBMISSIONS.filter(s => s.registrationId === registrationId),
            error: null
        };
    }

    const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .eq('registration_id', registrationId)
        .order('created_at', { ascending: false });

    return { data, error };
}

export default supabase;
