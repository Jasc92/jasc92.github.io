import { createContext, useContext, type ReactNode } from 'react';
import { useNetworkStatus } from '../hooks';
import type { NetworkContextValue } from '../types';

/**
 * Network Context
 * 
 * Provides network status information throughout the component tree.
 * Follows Dependency Inversion Principle - components depend on abstraction (context)
 * rather than concrete implementation.
 */
const NetworkContext = createContext<NetworkContextValue | undefined>(undefined);

/**
 * Props for NetworkProvider component
 */
interface NetworkProviderProps {
    children: ReactNode;
}

/**
 * NetworkProvider Component
 * 
 * Wraps the application to provide network status context.
 * Uses the useNetworkStatus hook internally.
 * 
 * @example
 * ```tsx
 * <NetworkProvider>
 *   <App />
 * </NetworkProvider>
 * ```
 */
export function NetworkProvider({ children }: NetworkProviderProps) {
    const networkStatus = useNetworkStatus();

    const value: NetworkContextValue = {
        status: networkStatus.status,
        isOnline: networkStatus.isOnline,
        isOffline: networkStatus.isOffline,
        lastChanged: networkStatus.lastChanged
    };

    return (
        <NetworkContext.Provider value={value}>
            {children}
        </NetworkContext.Provider>
    );
}

/**
 * Custom hook to access network status from context
 * 
 * @throws Error if used outside of NetworkProvider
 * 
 * @example
 * ```tsx
 * const { isOnline } = useNetwork();
 * ```
 */
export function useNetwork(): NetworkContextValue {
    const context = useContext(NetworkContext);

    if (context === undefined) {
        throw new Error('useNetwork must be used within a NetworkProvider');
    }

    return context;
}

export default NetworkProvider;
