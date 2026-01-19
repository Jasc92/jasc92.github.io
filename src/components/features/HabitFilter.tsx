import { useMemo } from 'react';
import { useHabits } from '../../context';
import type { Habit } from '../../types';

/**
 * HabitFilter Component
 * 
 * Allows users to filter specific habits to view on the calendar.
 * Shows a list of habit chips that can be toggled on/off.
 */
export function HabitFilter() {
    const { habits, selectedHabitIds, toggleHabitFilter, clearHabitFilters } = useHabits();

    // Sort habits: selected first, then by creation time (default) 
    // This keeps selected items easily accessible or we can just keep them in order
    // Let's keep original order to avoid jumping UI but maybe visual weight changes
    const sortedHabits = useMemo(() => {
        return habits;
    }, [habits]);

    if (habits.length === 0) {
        return null;
    }

    const activeCount = selectedHabitIds.length;
    const hasSelection = activeCount > 0;

    return (
        <div className="habit-filter fade-in">
            {/* Only show header when there's active filtering */}
            {hasSelection && (
                <div className="habit-filter__header">
                    <span className="habit-filter__title">
                        {activeCount}/{habits.length}
                    </span>
                    <button
                        onClick={clearHabitFilters}
                        className="habit-filter__clear-btn"
                        type="button"
                    >
                        ✕
                    </button>
                </div>
            )}

            <div className="habit-filter__list">
                {sortedHabits.map((habit: Habit) => {
                    const isSelected = selectedHabitIds.includes(habit.id);
                    // If selection exists, non-selected items are faded
                    // If no selection exists, all items are normal (but we use a different visual style for "filter mode")
                    // Actually, let's treat "no selection" as "all visible" but for the filter chips,
                    // they start unselected. When one is selected, it becomes active.

                    return (
                        <button
                            key={habit.id}
                            type="button"
                            onClick={() => toggleHabitFilter(habit.id)}
                            className={`habit-chip ${isSelected ? 'habit-chip--active' : ''}`}
                            style={{
                                '--habit-color': habit.color
                            } as React.CSSProperties}
                        >
                            <span
                                className="habit-chip__dot"
                                style={{ backgroundColor: habit.color }}
                            />
                            <span className="habit-chip__label">{habit.name}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
