import { useMemo } from 'react';
import type { DayStatus } from '../../types';

interface DayCellProps {
    /** Day of month (1-31) */
    day: number;
    /** Full date string "YYYY-MM-DD" */
    date: string;
    /** Status data for this day */
    status?: DayStatus;
    /** Whether this day is today */
    isToday: boolean;
    /** Whether this day is in the future */
    isFuture: boolean;
    /** Click handler */
    onClick?: (date: string) => void;
}

/**
 * DayCell Component
 * 
 * Renders a single day as a colored dot in the calendar.
 * Color indicates habit completion status:
 * - Gray: No habits logged
 * - Multi-color gradient: Shows colors of completed habits
 * - Red outline: Mandatory habits not completed
 */
export function DayCell({
    day,
    date,
    status,
    isToday,
    isFuture,
    onClick
}: DayCellProps) {

    const dotStyle = useMemo(() => {
        if (!status || status.completedColors.length === 0) {
            // No completions
            return {
                background: isFuture ? 'transparent' : 'var(--color-bg-tertiary)',
                border: isFuture ? '1px solid var(--color-border)' : 'none',
            };
        }

        const colors = status.completedColors;

        if (colors.length === 1) {
            return { background: colors[0] };
        }

        // Create gradient for multiple colors
        const gradientStops = colors.map((color, i) => {
            const percent = (i / (colors.length - 1)) * 100;
            return `${color} ${percent}%`;
        }).join(', ');

        return {
            background: `linear-gradient(135deg, ${gradientStops})`,
        };
    }, [status, isFuture]);

    // Check if mandatory habits are incomplete (for red indicator)
    const hasMissingMandatory = status &&
        status.mandatoryTotal > 0 &&
        status.mandatoryCompleted < status.mandatoryTotal &&
        !isFuture;

    const handleClick = () => {
        if (!isFuture && onClick) {
            onClick(date);
        }
    };

    return (
        <button
            type="button"
            className={`
        day-cell
        ${isToday ? 'day-cell--today' : ''}
        ${isFuture ? 'day-cell--future' : ''}
        ${hasMissingMandatory ? 'day-cell--missing-mandatory' : ''}
        ${status && status.completedColors.length > 0 ? 'day-cell--has-completions' : ''}
      `.trim()}
            style={dotStyle}
            onClick={handleClick}
            disabled={isFuture}
            aria-label={`Día ${day}${status ? `, ${status.completedColors.length} hábitos completados` : ''}`}
            title={`Día ${day}`}
        >
            {/* Today indicator ring */}
            {isToday && <span className="day-cell__today-ring" aria-hidden="true" />}
        </button>
    );
}

export default DayCell;
