import { useState, useEffect, useCallback } from 'react';
import type { NetworkStatus } from '../types';

/**
 * Custom hook for monitoring network connection status
 * 
 * This hook provides real-time network status updates using the
 * Navigator.onLine API and online/offline events.
 * 
 * @returns Object containing network status information
 * 
 * @example
 * ```tsx
 * const { isOnline, status, lastChanged } = useNetworkStatus();
 * 
 * if (!isOnline) {
 *   return <OfflineBanner />;
 * }
 * ```
 * 
 * Follows Single Responsibility Principle - only handles network status
 */
export function useNetworkStatus() {
    // Initialize with current browser online status
    const [status, setStatus] = useState<NetworkStatus>(
        typeof navigator !== 'undefined' && navigator.onLine ? 'online' : 'offline'
    );
    const [lastChanged, setLastChanged] = useState<Date | null>(null);

    /**
     * Handler for online event
     * Updates status when connection is restored
     */
    const handleOnline = useCallback(() => {
        setStatus('online');
        setLastChanged(new Date());
    }, []);

    /**
     * Handler for offline event
     * Updates status when connection is lost
     */
    const handleOffline = useCallback(() => {
        setStatus('offline');
        setLastChanged(new Date());
    }, []);

    useEffect(() => {
        // Add event listeners for online/offline events
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Cleanup listeners on unmount
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, [handleOnline, handleOffline]);

    return {
        /** Current network status: 'online' | 'offline' */
        status,
        /** Boolean indicating online state */
        isOnline: status === 'online',
        /** Boolean indicating offline state */
        isOffline: status === 'offline',
        /** Timestamp of last status change */
        lastChanged
    };
}

export default useNetworkStatus;
