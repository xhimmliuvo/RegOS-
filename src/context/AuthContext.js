'use client';

import { createContext, useContext, useReducer, useEffect } from 'react';

// Initial state
const initialState = {
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
};

// Action types
const AUTH_ACTIONS = {
    SET_LOADING: 'SET_LOADING',
    LOGIN_SUCCESS: 'LOGIN_SUCCESS',
    LOGOUT: 'LOGOUT',
    UPDATE_USER: 'UPDATE_USER',
    SET_ERROR: 'SET_ERROR',
    UPGRADE_ROLE: 'UPGRADE_ROLE',
};

// Reducer
function authReducer(state, action) {
    switch (action.type) {
        case AUTH_ACTIONS.SET_LOADING:
            return { ...state, isLoading: action.payload };
        case AUTH_ACTIONS.LOGIN_SUCCESS:
            return {
                ...state,
                user: action.payload,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            };
        case AUTH_ACTIONS.LOGOUT:
            return {
                ...state,
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,
            };
        case AUTH_ACTIONS.UPDATE_USER:
            return {
                ...state,
                user: { ...state.user, ...action.payload },
            };
        case AUTH_ACTIONS.UPGRADE_ROLE:
            return {
                ...state,
                user: { ...state.user, role: action.payload },
            };
        case AUTH_ACTIONS.SET_ERROR:
            return { ...state, error: action.payload, isLoading: false };
        default:
            return state;
    }
}

// Context
const AuthContext = createContext(null);

// Provider
export function AuthProvider({ children }) {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // Load user from localStorage on mount
    useEffect(() => {
        const loadUser = () => {
            try {
                const savedUser = localStorage.getItem('regos_user');
                if (savedUser) {
                    const user = JSON.parse(savedUser);
                    dispatch({ type: AUTH_ACTIONS.LOGIN_SUCCESS, payload: user });
                } else {
                    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
                }
            } catch (error) {
                console.error('Failed to load user:', error);
                dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
            }
        };
        loadUser();
    }, []);

    // Save user to localStorage when it changes
    useEffect(() => {
        if (state.user) {
            localStorage.setItem('regos_user', JSON.stringify(state.user));
        }
    }, [state.user]);

    // Login function
    const login = (userData) => {
        const user = {
            id: userData.id || generateId(),
            email: userData.email,
            phone: userData.phone || null,
            name: userData.name || userData.email.split('@')[0],
            avatar: userData.avatar || null,
            role: userData.role || 'agent', // Default role is agent
            verified: userData.verified || false,
            createdAt: userData.createdAt || new Date().toISOString(),
            paymentHistory: userData.paymentHistory || [],
        };
        dispatch({ type: AUTH_ACTIONS.LOGIN_SUCCESS, payload: user });
        return user;
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem('regos_user');
        dispatch({ type: AUTH_ACTIONS.LOGOUT });
    };

    // Update user profile
    const updateUser = (updates) => {
        dispatch({ type: AUTH_ACTIONS.UPDATE_USER, payload: updates });
    };

    // Upgrade role (agent -> host)
    const upgradeRole = (newRole) => {
        if (['agent', 'host', 'admin'].includes(newRole)) {
            dispatch({ type: AUTH_ACTIONS.UPGRADE_ROLE, payload: newRole });
        }
    };

    // Role checking utilities
    const isAgent = () => state.user?.role === 'agent';
    const isHost = () => state.user?.role === 'host' || state.user?.role === 'admin';
    const isAdmin = () => state.user?.role === 'admin';
    const canCreateRegistration = () => isHost() || isAdmin();
    const canManageUsers = () => isAdmin();
    const canEditOfficialContent = () => isAdmin();

    const value = {
        ...state,
        login,
        logout,
        updateUser,
        upgradeRole,
        isAgent,
        isHost,
        isAdmin,
        canCreateRegistration,
        canManageUsers,
        canEditOfficialContent,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

// Hook
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

// Utility function
function generateId() {
    return 'usr_' + Math.random().toString(36).substring(2, 15);
}

export default AuthContext;
