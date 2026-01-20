import { useState, type ReactNode } from 'react';
import { HabitMenu } from '../features/HabitMenu';
import { usePWAInstall } from '../../hooks';

/**
 * Props for Header component
 */
interface HeaderProps {
    /** Application title (default: 'Habit Tracker') */
    title?: string;
    /** Menu toggle handler */
    onMenuToggle: () => void;
}

/**
 * Header Component
 * 
 * Responsive header with menu button, app title, connection status, and install button.
 */
export function Header({ title = 'Habit Tracker', onMenuToggle }: HeaderProps) {
    const { canInstall, promptInstall } = usePWAInstall();

    return (
        <header className="header">
            <div className="header__container">
                {/* Menu button */}
                <button
                    type="button"
                    className="header__menu-btn"
                    onClick={onMenuToggle}
                    aria-label="Abrir menú"
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <line x1="3" y1="12" x2="21" y2="12" />
                        <line x1="3" y1="18" x2="21" y2="18" />
                    </svg>
                </button>

                {/* App Logo/Title */}
                <div className="header__brand">
                    <h1 className="header__title">{title}</h1>
                </div>

                {/* Right side actions */}
                <div className="header__actions">

                    {/* Install PWA Button */}
                    {canInstall && (
                        <button
                            onClick={promptInstall}
                            className="header__install-btn"
                            aria-label="Instalar aplicación"
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
                            <span className="header__install-text">Instalar</span>
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
 * Main application layout with header, habit menu, main content, and footer.
 */
export function AppLayout({ children, headerTitle }: AppLayoutProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleMenuToggle = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleMenuClose = () => {
        setIsMenuOpen(false);
    };

    return (
        <div className="app-layout">
            <Header
                title={headerTitle}
                onMenuToggle={handleMenuToggle}
            />

            <HabitMenu
                isOpen={isMenuOpen}
                onClose={handleMenuClose}
            />

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
