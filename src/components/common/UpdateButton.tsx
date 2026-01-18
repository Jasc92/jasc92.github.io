import { useSWUpdate } from '../../hooks';

/**
 * UpdateButton Component
 * 
 * Shows update status and allows checking for new versions.
 * Displays a prominent banner when an update is available.
 */
export function UpdateButton() {
    const {
        updateAvailable,
        isChecking,
        checkForUpdates,
        applyUpdate,
        lastChecked
    } = useSWUpdate();

    // If update is available, show prominent update banner
    if (updateAvailable) {
        return (
            <div className="update-banner">
                <div className="update-banner__content">
                    <span className="update-banner__icon">🎉</span>
                    <div className="update-banner__text">
                        <strong>¡Nueva versión disponible!</strong>
                        <p>Actualiza para obtener las últimas mejoras.</p>
                    </div>
                </div>
                <button
                    type="button"
                    className="update-banner__btn"
                    onClick={applyUpdate}
                >
                    Actualizar ahora
                </button>
            </div>
        );
    }

    // Normal state: show check for updates button
    return (
        <div className="update-check">
            <button
                type="button"
                className="update-check__btn"
                onClick={checkForUpdates}
                disabled={isChecking}
            >
                {isChecking ? (
                    <>
                        <span className="update-check__spinner" />
                        Buscando...
                    </>
                ) : (
                    <>
                        🔄 Buscar actualizaciones
                    </>
                )}
            </button>
            {lastChecked && (
                <p className="update-check__last">
                    Última comprobación: {lastChecked.toLocaleTimeString()}
                </p>
            )}
        </div>
    );
}

export default UpdateButton;
