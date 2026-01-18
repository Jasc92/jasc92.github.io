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
 * MonthGrid Component
 * 
 * Displays a single month with all its days as dots.
 * Days are shown in a compact grid layout.
 */
export function MonthGrid({ year, month, dayStatusMap, onDayClick }: MonthGridProps) {
    const today = useMemo(() => new Date(), []);
    const todayString = useMemo(() => {
        const y = today.getFullYear();
        const m = String(today.getMonth() + 1).padStart(2, '0');
        const d = String(today.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }, [today]);

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

    return (
        <div className="month-grid">
            <h3 className="month-grid__title">{MONTH_NAMES[month]}</h3>
            <div className="month-grid__days">
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
