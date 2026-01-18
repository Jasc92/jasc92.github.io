import { useNetwork } from '../../context';

/**
 * Props for ConnectionStatus component
 */
interface ConnectionStatusProps {
    /** Whether to show the component when online (default: true) */
    showWhenOnline?: boolean;
    /** Custom class name for styling */
    className?: string;
}

/**
 * ConnectionStatus Component
 * 
 * A visual indicator showing the current network connection status.
 * Displays a banner with appropriate styling for online/offline states.
 * 
 * Accessibility Features:
 * - Uses role="status" for screen reader announcements
 * - Uses aria-live="polite" for status updates
 * - High contrast colors for visibility
 * 
 * @example
 * ```tsx
 * // Always visible
 * <ConnectionStatus />
 * 
 * // Only show when offline
 * <ConnectionStatus showWhenOnline={false} />
 * ```
 * 
 * Follows Single Responsibility Principle - only displays connection status
 */
export function ConnectionStatus({
    showWhenOnline = true,
    className = ''
}: ConnectionStatusProps) {
    const { isOnline, lastChanged } = useNetwork();

    // Don't render if online and showWhenOnline is false
    if (isOnline && !showWhenOnline) {
        return null;
    }

    // Format last changed time
    const timeString = lastChanged
        ? lastChanged.toLocaleTimeString()
        : '';

    return (
        <div
            role="status"
            aria-live="polite"
            aria-label={isOnline ? 'Connected to the internet' : 'No internet connection'}
            className={`
        connection-status
        ${isOnline ? 'connection-status--online' : 'connection-status--offline'}
        ${className}
      `.trim()}
        >
            {/* Status indicator dot */}
            <span
                className="connection-status__indicator"
                aria-hidden="true"
            />

            {/* Status text */}
            <span className="connection-status__text">
                {isOnline ? 'Online' : 'Offline'}
            </span>

            {/* Last changed timestamp (if available) */}
            {lastChanged && (
                <span className="connection-status__time">
                    {isOnline ? 'Reconnected' : 'Since'} {timeString}
                </span>
            )}
        </div>
    );
}

export default ConnectionStatus;
