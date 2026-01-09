'use client';

import { useState, useEffect, createContext, useContext } from 'react';

const NetworkContext = createContext({
    isOnline: true,
    isSlowConnection: false,
    connectionType: 'unknown',
});

export function NetworkProvider({ children }) {
    const [networkState, setNetworkState] = useState({
        isOnline: true,
        isSlowConnection: false,
        connectionType: 'unknown',
    });

    useEffect(() => {
        // Check if we're in the browser
        if (typeof window === 'undefined') return;

        const updateNetworkState = () => {
            const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

            let isSlowConnection = false;
            let connectionType = 'unknown';

            if (connection) {
                connectionType = connection.effectiveType || 'unknown';
                // Slow connection if 2g or slow-2g or saveData is enabled
                isSlowConnection =
                    connection.effectiveType === '2g' ||
                    connection.effectiveType === 'slow-2g' ||
                    connection.saveData === true ||
                    (connection.downlink && connection.downlink < 1);
            }

            setNetworkState({
                isOnline: navigator.onLine,
                isSlowConnection,
                connectionType,
            });
        };

        // Initial check
        updateNetworkState();

        // Listen for changes
        window.addEventListener('online', updateNetworkState);
        window.addEventListener('offline', updateNetworkState);

        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        if (connection) {
            connection.addEventListener('change', updateNetworkState);
        }

        return () => {
            window.removeEventListener('online', updateNetworkState);
            window.removeEventListener('offline', updateNetworkState);
            if (connection) {
                connection.removeEventListener('change', updateNetworkState);
            }
        };
    }, []);

    return (
        <NetworkContext.Provider value={networkState}>
            {children}
        </NetworkContext.Provider>
    );
}

export function useNetwork() {
    return useContext(NetworkContext);
}

// Offline banner component
export function OfflineBanner() {
    const { isOnline, isSlowConnection } = useNetwork();

    if (isOnline && !isSlowConnection) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 9999,
            padding: '8px 16px',
            background: isOnline ? 'var(--warning-500)' : 'var(--error-500)',
            color: 'white',
            textAlign: 'center',
            fontSize: '14px',
            fontWeight: 500,
        }}>
            {isOnline
                ? '⚠️ Slow connection detected - content may load slowly'
                : '📵 You are offline - some features may not work'
            }
        </div>
    );
}
