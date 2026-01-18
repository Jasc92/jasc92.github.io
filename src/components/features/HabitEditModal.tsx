import { useState } from 'react';
import { useHabits } from '../../context';
import { NotificationService } from '../../services';
import { Modal, ColorPicker, TimePicker } from '../common';
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
 * - Configure reminder
 * - Add completions for past days
 */
export function HabitEditModal({ habit, onClose }: HabitEditModalProps) {
    const { updateHabit, setCompletion } = useHabits();

    const [name, setName] = useState(habit.name);
    const [color, setColor] = useState<string>(habit.color);
    const [mandatory, setMandatory] = useState(habit.mandatory);
    const [reminderEnabled, setReminderEnabled] = useState(habit.reminder?.enabled ?? false);
    const [reminderTime, setReminderTime] = useState(habit.reminder?.time ?? '08:00');
    const [pastDate, setPastDate] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleReminderToggle = async (enabled: boolean) => {
        if (enabled) {
            const permission = await NotificationService.requestPermission();
            if (permission !== 'granted') {
                setError('Necesitas permitir las notificaciones para usar recordatorios');
                return;
            }
        }
        setReminderEnabled(enabled);
    };

    const handleAddPastDay = () => {
        if (!pastDate) {
            setError('Selecciona una fecha');
            return;
        }

        // Check date is not in the future
        const selectedDate = new Date(pastDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate > today) {
            setError('No puedes marcar días futuros');
            return;
        }

        setCompletion(habit.id, pastDate, true);
        setSuccess(`Día ${pastDate} marcado como completado`);
        setPastDate('');
        setError(null);

        // Clear success after 3 seconds
        setTimeout(() => setSuccess(null), 3000);
    };

    const handleSave = () => {
        if (!name.trim()) {
            setError('El nombre es obligatorio');
            return;
        }

        updateHabit(habit.id, {
            name: name.trim(),
            color,
            mandatory,
            reminder: reminderEnabled
                ? { enabled: true, time: reminderTime }
                : { enabled: false, time: reminderTime },
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

                {/* Reminder toggle */}
                <div className="habit-form__field habit-form__field--row">
                    <label className="habit-form__label" htmlFor="edit-reminder">
                        Recordatorio
                    </label>
                    <button
                        id="edit-reminder"
                        type="button"
                        className={`habit-form__toggle ${reminderEnabled ? 'habit-form__toggle--active' : ''}`}
                        onClick={() => handleReminderToggle(!reminderEnabled)}
                        role="switch"
                        aria-checked={reminderEnabled}
                    >
                        <span className="habit-form__toggle-thumb" />
                    </button>
                </div>

                {reminderEnabled && (
                    <TimePicker
                        value={reminderTime}
                        onChange={setReminderTime}
                        label="Hora"
                    />
                )}

                {/* Add past day section */}
                <div className="habit-edit__past-section">
                    <h4 className="habit-edit__section-title">Añadir día pasado</h4>
                    <p className="habit-edit__section-desc">
                        ¿Olvidaste marcar un día? Añádelo aquí.
                    </p>
                    <div className="habit-edit__past-row">
                        <input
                            type="date"
                            className="habit-form__input"
                            value={pastDate}
                            onChange={(e) => setPastDate(e.target.value)}
                            max={today}
                        />
                        <button
                            type="button"
                            className="habit-form__btn habit-form__btn--secondary"
                            onClick={handleAddPastDay}
                        >
                            Añadir
                        </button>
                    </div>
                </div>

                {/* Messages */}
                {error && (
                    <p className="habit-form__error" role="alert">
                        {error}
                    </p>
                )}
                {success && (
                    <p className="habit-form__success" role="status">
                        {success}
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
