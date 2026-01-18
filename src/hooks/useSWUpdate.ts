import { useState, useEffect, useCallback } from 'react';

/**
 * Service Worker update state
 */
export interface SWUpdateState {
    /** Whether an update is available */
    updateAvailable: boolean;
    /** Whether we're checking for updates */
    isChecking: boolean;
    /** Whether the SW is registered and ready */
    isReady: boolean;
    /** Function to check for updates manually */
    checkForUpdates: () => Promise<void>;
    /** Function to apply the update (reload the page) */
    applyUpdate: () => void;
    /** Last check timestamp */
    lastChecked: Date | null;
}

/**
 * Custom hook for managing PWA Service Worker updates
 * 
 * This hook provides:
 * - Automatic detection of new versions
 * - Manual update checking
 * - Safe update application (user-triggered reload)
 * 
 * Important: localStorage data is NOT affected by SW updates!
 * 
 * @returns SWUpdateState object with update status and controls
 */
export function useSWUpdate(): SWUpdateState {
    const [updateAvailable, setUpdateAvailable] = useState(false);
    const [isChecking, setIsChecking] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [lastChecked, setLastChecked] = useState<Date | null>(null);
    const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

    useEffect(() => {
        // Only run in browser
        if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
            return;
        }

        // Get the current registration
        navigator.serviceWorker.getRegistration().then((reg) => {
            if (reg) {
                setRegistration(reg);
                setIsReady(true);

                // Listen for updates
                reg.addEventListener('updatefound', () => {
                    const newWorker = reg.installing;
                    if (newWorker) {
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                // New version available
                                setUpdateAvailable(true);
                            }
                        });
                    }
                });
            }
        });

        // Listen for controller changes (update applied)
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            window.location.reload();
        });
    }, []);

    /**
     * Check for updates manually
     */
    const checkForUpdates = useCallback(async () => {
        if (!registration) {
            console.log('No SW registration available');
            return;
        }

        setIsChecking(true);

        try {
            await registration.update();
            setLastChecked(new Date());
        } catch (error) {
            console.error('Error checking for updates:', error);
        } finally {
            setIsChecking(false);
        }
    }, [registration]);

    /**
     * Apply the update by telling the waiting SW to take control
     */
    const applyUpdate = useCallback(() => {
        if (registration?.waiting) {
            // Tell the waiting SW to activate
            registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        } else {
            // Fallback: just reload
            window.location.reload();
        }
    }, [registration]);

    return {
        updateAvailable,
        isChecking,
        isReady,
        checkForUpdates,
        applyUpdate,
        lastChecked,
    };
}

export default useSWUpdate;
