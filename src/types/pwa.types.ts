/**
 * PWA-specific Type Definitions
 * 
 * Types for Progressive Web App functionality including
 * network status, installation state, and service worker events.
 */

/**
 * Network connection status
 */
export type NetworkStatus = 'online' | 'offline';

/**
 * Network status context value
 */
export interface NetworkContextValue {
    /** Current network status */
    status: NetworkStatus;
    /** Whether the app is online */
    isOnline: boolean;
    /** Whether the app is offline */
    isOffline: boolean;
    /** Timestamp of last status change */
    lastChanged: Date | null;
}

/**
 * PWA Installation state
 */
export type InstallState = 'idle' | 'prompt-available' | 'installing' | 'installed';

/**
 * PWA Install context value
 */
export interface PWAInstallContextValue {
    /** Current installation state */
    installState: InstallState;
    /** Whether the install prompt is available */
    canInstall: boolean;
    /** Whether the app is already installed */
    isInstalled: boolean;
    /** Function to trigger the install prompt */
    promptInstall: () => Promise<void>;
}

/**
 * Service Worker registration status
 */
export interface ServiceWorkerStatus {
    /** Whether service worker is supported */
    isSupported: boolean;
    /** Whether service worker is registered */
    isRegistered: boolean;
    /** Whether an update is available */
    updateAvailable: boolean;
    /** Registration object if available */
    registration: ServiceWorkerRegistration | null;
}

/**
 * BeforeInstallPromptEvent - Custom event for PWA installation
 * This event is fired when the browser determines the app is installable
 */
export interface BeforeInstallPromptEvent extends Event {
    readonly platforms: string[];
    readonly userChoice: Promise<{
        outcome: 'accepted' | 'dismissed';
        platform: string;
    }>;
    prompt(): Promise<void>;
}

/**
 * Declare the beforeinstallprompt event on WindowEventMap
 */
declare global {
    interface WindowEventMap {
        beforeinstallprompt: BeforeInstallPromptEvent;
    }
}
