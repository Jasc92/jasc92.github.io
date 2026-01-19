import { useState } from 'react';
import { useHabits } from '../../context';
import { MonthGrid } from './MonthGrid';
import { DayModal } from './DayModal';

import { HabitFilter } from './HabitFilter';

/**
 * YearCalendar Component
 * 
 * Main calendar view showing all 12 months of the current year.
 * Each day is represented as a colored dot indicating habit completion.
 */
export function YearCalendar() {
    const { currentYear, dayStatusMap, setYear, habits } = useHabits();
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    const handlePreviousYear = () => {
        setYear(currentYear - 1);
    };

    const handleNextYear = () => {
        setYear(currentYear + 1);
    };

    const handleDayClick = (date: string) => {
        // Only open modal if there are habits
        if (habits.length > 0) {
            setSelectedDate(date);
        }
    };

    const handleCloseModal = () => {
        setSelectedDate(null);
    };

    // Current year check for navigation limits
    const currentRealYear = new Date().getFullYear();
    const canGoForward = currentYear < currentRealYear;

    return (
        <div className="year-calendar">
            {/* Year Navigation */}
            <div className="year-calendar__header">
                <button
                    type="button"
                    className="year-calendar__nav-btn"
                    onClick={handlePreviousYear}
                    aria-label="Año anterior"
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="15,18 9,12 15,6" />
                    </svg>
                </button>

                <h2 className="year-calendar__year">{currentYear}</h2>

                <button
                    type="button"
                    className="year-calendar__nav-btn"
                    onClick={handleNextYear}
                    disabled={!canGoForward}
                    aria-label="Año siguiente"
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="9,6 15,12 9,18" />
                    </svg>
                </button>
            </div>

            {/* Filter */}
            {habits.length > 0 && <HabitFilter />}

            {/* Months Grid */}
            <div className="year-calendar__months">
                {Array.from({ length: 12 }, (_, month) => (
                    <MonthGrid
                        key={month}
                        year={currentYear}
                        month={month}
                        dayStatusMap={dayStatusMap}
                        onDayClick={handleDayClick}
                    />
                ))}
            </div>

            {/* Habit Legend */}
            {habits.length > 0 && (
                <div className="year-calendar__legend">
                    <h4 className="year-calendar__legend-title">Hábitos</h4>
                    <div className="year-calendar__legend-items">
                        {habits.map(habit => (
                            <div key={habit.id} className="year-calendar__legend-item">
                                <span
                                    className="year-calendar__legend-dot"
                                    style={{ backgroundColor: habit.color }}
                                    aria-hidden="true"
                                />
                                <span className="year-calendar__legend-name">
                                    {habit.name}
                                    {habit.mandatory && <span className="year-calendar__mandatory-badge">!</span>}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Empty state */}
            {habits.length === 0 && (
                <div className="year-calendar__empty">
                    <p>No tienes hábitos creados.</p>
                    <p>Abre el menú para añadir tu primer hábito.</p>
                </div>
            )}

            {/* Day detail modal */}
            {selectedDate && (
                <DayModal
                    date={selectedDate}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
}

export default YearCalendar;
