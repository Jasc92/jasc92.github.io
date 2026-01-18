import { useState } from 'react';
import { useHabits } from '../../context';
import { HabitForm } from './HabitForm';
import { HabitEditModal } from './HabitEditModal';
import type { Habit } from '../../types';

interface HabitMenuProps {
    /** Whether the menu is open */
    isOpen: boolean;
    /** Close handler */
    onClose: () => void;
}

/**
 * HabitMenu Component
 * 
 * Slide-out menu for managing habits:
 * - List of existing habits
 * - Add new habit
 * - Edit/Delete habits
 */
export function HabitMenu({ isOpen, onClose }: HabitMenuProps) {
    const { habits, deleteHabit } = useHabits();
    const [showForm, setShowForm] = useState(false);
    const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleDelete = (id: string) => {
        if (deletingId === id) {
            // Confirm delete
            deleteHabit(id);
            setDeletingId(null);
        } else {
            // First click - show confirm
            setDeletingId(id);
            // Auto-cancel after 3 seconds
            setTimeout(() => setDeletingId(null), 3000);
        }
    };

    const handleEdit = (habit: Habit) => {
        setEditingHabit(habit);
    };

    // Separate mandatory and optional habits
    const mandatoryHabits = habits.filter(h => h.mandatory);
    const optionalHabits = habits.filter(h => !h.mandatory);

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="habit-menu__backdrop"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Menu panel */}
            <aside className="habit-menu" role="dialog" aria-label="Menú de hábitos">
                <div className="habit-menu__header">
                    <h2 className="habit-menu__title">Mis Hábitos</h2>
                    <button
                        type="button"
                        className="habit-menu__close-btn"
                        onClick={onClose}
                        aria-label="Cerrar menú"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                <div className="habit-menu__content">
                    {showForm ? (
                        <HabitForm
                            onClose={() => setShowForm(false)}
                            onSuccess={() => setShowForm(false)}
                        />
                    ) : (
                        <>
                            {/* Mandatory Habits */}
                            {mandatoryHabits.length > 0 && (
                                <section className="habit-menu__section">
                                    <h3 className="habit-menu__section-title">
                                        <span className="habit-menu__mandatory-badge">!</span>
                                        Obligatorios
                                    </h3>
                                    <ul className="habit-menu__list">
                                        {mandatoryHabits.map(habit => (
                                            <li key={habit.id} className="habit-menu__item">
                                                <div className="habit-menu__habit-info">
                                                    <span
                                                        className="habit-menu__habit-dot"
                                                        style={{ backgroundColor: habit.color }}
                                                    />
                                                    <span className="habit-menu__habit-name">{habit.name}</span>
                                                    {habit.reminder?.enabled && (
                                                        <span className="habit-menu__reminder">
                                                            🔔 {habit.reminder.time}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="habit-menu__actions">
                                                    <button
                                                        type="button"
                                                        className="habit-menu__action-btn"
                                                        onClick={() => handleEdit(habit)}
                                                        aria-label={`Editar ${habit.name}`}
                                                    >
                                                        ⚙️
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className={`habit-menu__action-btn habit-menu__action-btn--delete ${deletingId === habit.id ? 'habit-menu__action-btn--confirm' : ''}`}
                                                        onClick={() => handleDelete(habit.id)}
                                                        aria-label={deletingId === habit.id ? 'Confirmar eliminar' : `Eliminar ${habit.name}`}
                                                    >
                                                        {deletingId === habit.id ? '✓' : '🗑️'}
                                                    </button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </section>
                            )}

                            {/* Optional Habits */}
                            {optionalHabits.length > 0 && (
                                <section className="habit-menu__section">
                                    <h3 className="habit-menu__section-title">Opcionales</h3>
                                    <ul className="habit-menu__list">
                                        {optionalHabits.map(habit => (
                                            <li key={habit.id} className="habit-menu__item">
                                                <div className="habit-menu__habit-info">
                                                    <span
                                                        className="habit-menu__habit-dot"
                                                        style={{ backgroundColor: habit.color }}
                                                    />
                                                    <span className="habit-menu__habit-name">{habit.name}</span>
                                                    {habit.reminder?.enabled && (
                                                        <span className="habit-menu__reminder">
                                                            🔔 {habit.reminder.time}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="habit-menu__actions">
                                                    <button
                                                        type="button"
                                                        className="habit-menu__action-btn"
                                                        onClick={() => handleEdit(habit)}
                                                        aria-label={`Editar ${habit.name}`}
                                                    >
                                                        ⚙️
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className={`habit-menu__action-btn habit-menu__action-btn--delete ${deletingId === habit.id ? 'habit-menu__action-btn--confirm' : ''}`}
                                                        onClick={() => handleDelete(habit.id)}
                                                        aria-label={deletingId === habit.id ? 'Confirmar eliminar' : `Eliminar ${habit.name}`}
                                                    >
                                                        {deletingId === habit.id ? '✓' : '🗑️'}
                                                    </button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </section>
                            )}

                            {/* Empty state */}
                            {habits.length === 0 && (
                                <div className="habit-menu__empty">
                                    <p>No tienes hábitos todavía.</p>
                                    <p>¡Crea tu primer hábito!</p>
                                </div>
                            )}

                            {/* Add button */}
                            <button
                                type="button"
                                className="habit-menu__add-btn"
                                onClick={() => setShowForm(true)}
                            >
                                + Añadir Hábito
                            </button>
                        </>
                    )}
                </div>
            </aside>

            {/* Edit modal */}
            {editingHabit && (
                <HabitEditModal
                    habit={editingHabit}
                    onClose={() => setEditingHabit(null)}
                />
            )}
        </>
    );
}

export default HabitMenu;
