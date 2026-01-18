import { useState, useEffect, useCallback } from 'react';
import type { InstallState, BeforeInstallPromptEvent } from '../types';

/**
 * Custom hook for handling PWA installation (Add to Home Screen)
 * 
 * This hook captures the beforeinstallprompt event and provides
 * methods to trigger the installation prompt programmatically.
 * 
 * @returns Object containing installation state and prompt function
 * 
 * @example
 * ```tsx
 * const { canInstall, promptInstall, isInstalled } = usePWAInstall();
 * 
 * if (canInstall) {
 *   return <Button onClick={promptInstall}>Install App</Button>;
 * }
 * ```
 * 
 * Follows Single Responsibility Principle - only handles PWA installation
 */
export function usePWAInstall() {
    const [installState, setInstallState] = useState<InstallState>('idle');
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

    /**
     * Handle the beforeinstallprompt event
     * Stores the event for later use when user wants to install
     */
    const handleBeforeInstallPrompt = useCallback((event: BeforeInstallPromptEvent) => {
        // Prevent the mini-infobar from appearing on mobile
        event.preventDefault();
        // Store the event for triggering later
        setDeferredPrompt(event);
        setInstallState('prompt-available');
    }, []);

    /**
     * Handle successful app installation
     */
    const handleAppInstalled = useCallback(() => {
        setDeferredPrompt(null);
        setInstallState('installed');
    }, []);

    useEffect(() => {
        // Check if app is already installed (standalone mode)
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setInstallState('installed');
            return;
        }

        // Listen for the beforeinstallprompt event
        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, [handleBeforeInstallPrompt, handleAppInstalled]);

    /**
     * Trigger the install prompt
     * Should only be called when canInstall is true
     */
    const promptInstall = useCallback(async () => {
        if (!deferredPrompt) {
            console.warn('Install prompt not available');
            return;
        }

        setInstallState('installing');

        // Show the install prompt
        await deferredPrompt.prompt();

        // Wait for user choice
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            setInstallState('installed');
        } else {
            setInstallState('prompt-available');
        }

        // Clear the deferred prompt
        setDeferredPrompt(null);
    }, [deferredPrompt]);

    return {
        /** Current installation state */
        installState,
        /** Whether the install prompt is available */
        canInstall: installState === 'prompt-available',
        /** Whether the app is already installed */
        isInstalled: installState === 'installed',
        /** Function to trigger the install prompt */
        promptInstall
    };
}

export default usePWAInstall;
