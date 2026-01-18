import { useMemo } from 'react';
import { DayCell } from './DayCell';
import type { DayStatus } from '../../types';

interface MonthGridProps {
    /** Year */
    year: number;
    /** Month (0-11) */
    month: number;
    /** Day status map for the year */
    dayStatusMap: Map<string, DayStatus>;
    /** Click handler for days */
    onDayClick?: (date: string) => void;
}

/**
 * Month names in Spanish
 */
const MONTH_NAMES = [
    'Enero', 'Febrero', 'Marzo', 'Abril',
    'Mayo', 'Junio', 'Julio', 'Agosto',
    'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

/**
 * Weekday abbreviations in Spanish (starting Monday)
 */
const WEEKDAY_ABBR = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

/**
 * MonthGrid Component
 * 
 * Displays a single month with all its days as dots.
 * Days are aligned with their actual weekday positions.
 */
export function MonthGrid({ year, month, dayStatusMap, onDayClick }: MonthGridProps) {
    const today = useMemo(() => new Date(), []);
    const todayString = useMemo(() => {
        const y = today.getFullYear();
        const m = String(today.getMonth() + 1).padStart(2, '0');
        const d = String(today.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }, [today]);

    // Calculate the starting day of week (0 = Monday, 6 = Sunday)
    const startDayOfWeek = useMemo(() => {
        const firstDay = new Date(year, month, 1).getDay();
        // Convert from Sunday=0 to Monday=0 format
        return firstDay === 0 ? 6 : firstDay - 1;
    }, [year, month]);

    const days = useMemo(() => {
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const result: Array<{
            day: number;
            date: string;
            isToday: boolean;
            isFuture: boolean;
        }> = [];

        for (let day = 1; day <= daysInMonth; day++) {
            const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayDate = new Date(year, month, day);

            result.push({
                day,
                date: dateString,
                isToday: dateString === todayString,
                isFuture: dayDate > today,
            });
        }

        return result;
    }, [year, month, today, todayString]);

    // Create empty placeholder cells for alignment
    const emptySlots = useMemo(() => {
        return Array.from({ length: startDayOfWeek }, (_, i) => i);
    }, [startDayOfWeek]);

    return (
        <div className="month-grid">
            <h3 className="month-grid__title">{MONTH_NAMES[month]}</h3>

            {/* Weekday headers */}
            <div className="month-grid__weekdays">
                {WEEKDAY_ABBR.map((day, i) => (
                    <span key={i} className="month-grid__weekday">{day}</span>
                ))}
            </div>

            <div className="month-grid__days">
                {/* Empty placeholder cells for alignment */}
                {emptySlots.map((i) => (
                    <div key={`empty-${i}`} className="month-grid__empty" />
                ))}

                {/* Actual day cells */}
                {days.map(({ day, date, isToday, isFuture }) => (
                    <DayCell
                        key={date}
                        day={day}
                        date={date}
                        status={dayStatusMap.get(date)}
                        isToday={isToday}
                        isFuture={isFuture}
                        onClick={onDayClick}
                    />
                ))}
            </div>
        </div>
    );
}

export default MonthGrid;
