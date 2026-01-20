import { useHabits } from '../../context';
import { Modal } from '../common/Modal';

interface DayModalProps {
    /** Date string "YYYY-MM-DD" */
    date: string;
    /** Close handler */
    onClose: () => void;
}

/**
 * DayModal Component
 * 
 * Shows habit completion status for a specific day.
 * Allows toggling completion for each habit.
 */
export function DayModal({ date, onClose }: DayModalProps) {
    const { habits, isCompleted, toggleCompletion } = useHabits();

    // Parse date for display
    const dateObj = new Date(date + 'T00:00:00');
    const formattedDate = dateObj.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const handleToggle = (habitId: string) => {
        toggleCompletion(habitId, date);
    };

    // Filter habits that were active on this date (startDate <= date)
    // and separate mandatory from optional
    const activeHabits = habits.filter(h => !h.startDate || h.startDate <= date);
    const mandatoryHabits = activeHabits.filter(h => h.mandatory);
    const optionalHabits = activeHabits.filter(h => !h.mandatory);

    return (
        <Modal onClose={onClose} title={formattedDate}>
            <div className="day-modal">
                {/* Mandatory Habits */}
                {mandatoryHabits.length > 0 && (
                    <section className="day-modal__section">
                        <h4 className="day-modal__section-title">
                            <span className="day-modal__mandatory-icon">!</span>
                            Obligatorios
                        </h4>
                        <ul className="day-modal__list">
                            {mandatoryHabits.map(habit => {
                                const completed = isCompleted(habit.id, date);
                                return (
                                    <li key={habit.id} className="day-modal__item">
                                        <button
                                            type="button"
                                            className={`day-modal__habit-btn ${completed ? 'day-modal__habit-btn--completed' : ''}`}
                                            onClick={() => handleToggle(habit.id)}
                                        >
                                            <span
                                                className="day-modal__habit-dot"
                                                style={{ backgroundColor: habit.color }}
                                            />
                                            <span className="day-modal__habit-name">{habit.name}</span>
                                            <span className="day-modal__habit-check">
                                                {completed ? '✓' : '○'}
                                            </span>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </section>
                )}

                {/* Optional Habits */}
                {optionalHabits.length > 0 && (
                    <section className="day-modal__section">
                        <h4 className="day-modal__section-title">Opcionales</h4>
                        <ul className="day-modal__list">
                            {optionalHabits.map(habit => {
                                const completed = isCompleted(habit.id, date);
                                return (
                                    <li key={habit.id} className="day-modal__item">
                                        <button
                                            type="button"
                                            className={`day-modal__habit-btn ${completed ? 'day-modal__habit-btn--completed' : ''}`}
                                            onClick={() => handleToggle(habit.id)}
                                        >
                                            <span
                                                className="day-modal__habit-dot"
                                                style={{ backgroundColor: habit.color }}
                                            />
                                            <span className="day-modal__habit-name">{habit.name}</span>
                                            <span className="day-modal__habit-check">
                                                {completed ? '✓' : '○'}
                                            </span>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </section>
                )}
            </div>
        </Modal>
    );
}

export default DayModal;
