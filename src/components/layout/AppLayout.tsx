import type { ReactNode } from 'react';
import { ConnectionStatus } from '../common';
import { usePWAInstall } from '../../hooks';

/**
 * Props for Header component
 */
interface HeaderProps {
    /** Application title (default: 'Habit Tracker') */
    title?: string;
}

/**
 * Header Component
 * 
 * Responsive header with app title, connection status, and install button.
 * Implements Mobile-First design with breakpoints for larger screens.
 * 
 * Accessibility Features:
 * - Semantic <header> element
 * - Proper heading hierarchy
 * - Focusable install button with descriptive label
 * 
 * @example
 * ```tsx
 * <Header title="My App" />
 * ```
 */
export function Header({ title = 'Habit Tracker' }: HeaderProps) {
    const { canInstall, promptInstall } = usePWAInstall();

    return (
        <header className="header">
            <div className="header__container">
                {/* App Logo/Title */}
                <div className="header__brand">
                    <h1 className="header__title">{title}</h1>
                </div>

                {/* Right side actions */}
                <div className="header__actions">
                    {/* Connection Status */}
                    <ConnectionStatus className="header__status" />

                    {/* Install PWA Button */}
                    {canInstall && (
                        <button
                            onClick={promptInstall}
                            className="header__install-btn"
                            aria-label="Install application"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="header__install-icon"
                                aria-hidden="true"
                            >
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="7,10 12,15 17,10" />
                                <line x1="12" y1="15" x2="12" y2="3" />
                            </svg>
                            <span className="header__install-text">Install</span>
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
}

/**
 * Props for AppLayout component
 */
interface AppLayoutProps {
    /** Child content to render in main area */
    children: ReactNode;
    /** Custom header title */
    headerTitle?: string;
}

/**
 * AppLayout Component
 * 
 * Main application layout implementing Mobile-First design.
 * Provides consistent structure across all pages with header,
 * main content area, and footer.
 * 
 * Layout Structure:
 * - Sticky header with navigation
 * - Flexible main content area
 * - Optional sticky footer
 * 
 * @example
 * ```tsx
 * <AppLayout headerTitle="Dashboard">
 *   <DashboardContent />
 * </AppLayout>
 * ```
 * 
 * Follows Open/Closed Principle - layout structure is fixed but
 * content is extensible through children prop
 */
export function AppLayout({ children, headerTitle }: AppLayoutProps) {
    return (
        <div className="app-layout">
            <Header title={headerTitle} />

            <main className="app-layout__main" role="main">
                {children}
            </main>

            <footer className="app-layout__footer">
                <p className="app-layout__copyright">
                    © {new Date().getFullYear()} Habit Tracker PWA
                </p>
            </footer>
        </div>
    );
}

export default AppLayout;
