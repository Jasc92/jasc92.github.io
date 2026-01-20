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
        // Default: no completions or future day
        if (isFuture) {
            return {
                background: 'transparent',
                border: '1px solid var(--color-border)',
            };
        }

        if (!status) {
            return { background: 'var(--color-bg-tertiary)' };
        }

        // In filtered mode: show individual habit colors
        if (status.isFiltered && status.completedColors.length > 0) {
            const colors = status.completedColors;
            if (colors.length === 1) {
                return { background: colors[0] };
            }
            // Multiple filtered habits: use conic gradient
            const total = colors.length;
            const gradientStops = colors.map((color, i) => {
                const startPercent = (i / total) * 100;
                const endPercent = ((i + 1) / total) * 100;
                return `${color} ${startPercent}% ${endPercent}%`;
            }).join(', ');
            return { background: `conic-gradient(${gradientStops})` };
        }

        // Normal mode color logic:
        const totalHabits = status.mandatoryTotal + status.optionalTotal;
        const completedHabits = status.mandatoryCompleted + status.optionalCompleted;
        const allMandatoryDone = status.mandatoryTotal > 0 &&
            status.mandatoryCompleted === status.mandatoryTotal;
        const allOptionalDone = status.optionalTotal > 0 &&
            status.optionalCompleted === status.optionalTotal;
        const someOptionalDone = status.optionalCompleted > 0;

        // 🟢 Green: ALL habits completed (mandatory + optional)
        if (totalHabits > 0 && completedHabits === totalHabits) {
            return { background: 'var(--color-success)' }; // Green
        }

        // 🟡 Yellow: Mix of mandatory and optional completed (but not all)
        if (allMandatoryDone && someOptionalDone && !allOptionalDone) {
            return { background: 'var(--color-warning)' }; // Yellow
        }

        // 🔵 Blue: Only mandatory habits completed (no optional or all optional missing)
        if (allMandatoryDone) {
            return { background: 'var(--color-primary)' }; // Blue
        }

        // 🔴 Red: No activity (nothing completed but habits exist)
        if (totalHabits > 0 && completedHabits === 0) {
            return { background: 'var(--color-error)' }; // Red
        }

        // Partial progress (some but not all mandatory)
        if (completedHabits > 0) {
            return { background: 'var(--color-warning)' }; // Yellow for partial
        }

        return { background: 'var(--color-bg-tertiary)' };
    }, [status, isFuture]);

    // Check if mandatory habits are incomplete (for red indicator)
    const hasMissingMandatory = status &&
        status.mandatoryTotal > 0 &&
        status.mandatoryCompleted < status.mandatoryTotal &&
        !isFuture;

    // Check if ALL mandatory habits are complete (for celebration effect)
    // Only show celebration when NOT in filtered mode
    const allMandatoryComplete = status &&
        status.mandatoryTotal > 0 &&
        status.mandatoryCompleted === status.mandatoryTotal &&
        !status.isFiltered &&
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
        ${allMandatoryComplete ? 'day-cell--all-mandatory' : ''}
        ${status && status.completedColors.length > 0 ? 'day-cell--has-completions' : ''}
      `.trim()}
            style={dotStyle}
            onClick={handleClick}
            disabled={isFuture}
            aria-label={`Día ${day}${status ? `, ${status.completedColors.length} hábitos completados` : ''}${allMandatoryComplete ? ' ✓ Todos los obligatorios!' : ''}`}
            title={`Día ${day}${allMandatoryComplete ? ' ⭐' : ''}`}
        >
            {/* Day number in center */}
            <span className="day-cell__number" aria-hidden="true">{day}</span>
            {/* Today indicator ring */}
            {isToday && <span className="day-cell__today-ring" aria-hidden="true" />}
            {/* Star for all mandatory complete */}
            {allMandatoryComplete && <span className="day-cell__star" aria-hidden="true">★</span>}
        </button>
    );
}

export default DayCell;
