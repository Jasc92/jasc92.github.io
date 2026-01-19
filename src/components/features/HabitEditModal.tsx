import { useState } from 'react';
import { useHabits } from '../../context';
import { Modal, ColorPicker } from '../common';
import type { Habit } from '../../types';

interface HabitEditModalProps {
    /** Habit to edit */
    habit: Habit;
    /** Close handler */
    onClose: () => void;
}

/**
 * HabitEditModal Component
 * 
 * Modal for editing an existing habit:
 * - Change name
 * - Change color
 * - Toggle mandatory
 * - Set start date
 */
export function HabitEditModal({ habit, onClose }: HabitEditModalProps) {
    const { updateHabit } = useHabits();

    const [name, setName] = useState(habit.name);
    const [color, setColor] = useState<string>(habit.color);
    const [mandatory, setMandatory] = useState(habit.mandatory);
    const [startDate, setStartDate] = useState(habit.startDate || habit.createdAt.split('T')[0]);
    const [error, setError] = useState<string | null>(null);

    const handleSave = () => {
        if (!name.trim()) {
            setError('El nombre es obligatorio');
            return;
        }

        updateHabit(habit.id, {
            name: name.trim(),
            color,
            mandatory,
            startDate,
        });

        onClose();
    };

    // Get max date (today)
    const today = new Date().toISOString().split('T')[0];

    return (
        <Modal onClose={onClose} title="Editar hábito" wide>
            <div className="habit-edit">
                {/* Name input */}
                <div className="habit-form__field">
                    <label className="habit-form__label" htmlFor="edit-habit-name">
                        Nombre
                    </label>
                    <input
                        id="edit-habit-name"
                        type="text"
                        className="habit-form__input"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                {/* Color picker */}
                <ColorPicker value={color} onChange={setColor} />

                {/* Mandatory toggle */}
                <div className="habit-form__field habit-form__field--row">
                    <label className="habit-form__label" htmlFor="edit-mandatory">
                        Obligatorio
                    </label>
                    <button
                        id="edit-mandatory"
                        type="button"
                        className={`habit-form__toggle ${mandatory ? 'habit-form__toggle--active' : ''}`}
                        onClick={() => setMandatory(!mandatory)}
                        role="switch"
                        aria-checked={mandatory}
                    >
                        <span className="habit-form__toggle-thumb" />
                    </button>
                </div>

                {/* Start date */}
                <div className="habit-form__field">
                    <label className="habit-form__label" htmlFor="edit-start-date">
                        Fecha de inicio
                    </label>
                    <p className="habit-form__hint">
                        Los días anteriores no contarán como incompletos
                    </p>
                    <input
                        id="edit-start-date"
                        type="date"
                        className="habit-form__input"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        max={today}
                    />
                </div>

                {/* Error message */}
                {error && (
                    <p className="habit-form__error" role="alert">
                        {error}
                    </p>
                )}

                {/* Actions */}
                <div className="habit-form__actions">
                    <button
                        type="button"
                        className="habit-form__btn habit-form__btn--secondary"
                        onClick={onClose}
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        className="habit-form__btn habit-form__btn--primary"
                        onClick={handleSave}
                    >
                        Guardar cambios
                    </button>
                </div>
            </div>
        </Modal>
    );
}

export default HabitEditModal;
