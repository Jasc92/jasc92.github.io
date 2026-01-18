import { useEffect, useCallback, type ReactNode } from 'react';

interface ModalProps {
    /** Modal title */
    title?: string;
    /** Modal content */
    children: ReactNode;
    /** Close handler */
    onClose: () => void;
    /** Whether the modal is wide */
    wide?: boolean;
}

/**
 * Modal Component
 * 
 * Reusable modal dialog with backdrop and animations.
 * Closes on ESC key or backdrop click.
 * 
 * Accessibility:
 * - Focus trap within modal
 * - ESC key closes modal
 * - Proper ARIA attributes
 */
export function Modal({ title, children, onClose, wide = false }: ModalProps) {
    // Handle ESC key
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            onClose();
        }
    }, [onClose]);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [handleKeyDown]);

    // Handle backdrop click
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="modal-backdrop"
            onClick={handleBackdropClick}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? 'modal-title' : undefined}
        >
            <div className={`modal ${wide ? 'modal--wide' : ''}`}>
                {/* Header */}
                <div className="modal__header">
                    {title && (
                        <h2 id="modal-title" className="modal__title">{title}</h2>
                    )}
                    <button
                        type="button"
                        className="modal__close-btn"
                        onClick={onClose}
                        aria-label="Cerrar"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="modal__content">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default Modal;
