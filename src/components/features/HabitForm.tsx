import { useState } from 'react';
import { useHabits } from '../../context';
import { NotificationService } from '../../services';
import { ColorPicker, TimePicker } from '../common';
import { HABIT_COLORS } from '../../types';

interface HabitFormProps {
    /** Close handler */
    onClose: () => void;
    /** Success handler */
    onSuccess?: () => void;
}

/**
 * HabitForm Component
 * 
 * Form for creating a new habit with:
 * - Name input
 * - Color selection
 * - Mandatory toggle
 * - Reminder configuration
 */
export function HabitForm({ onClose, onSuccess }: HabitFormProps) {
    const { createHabit } = useHabits();

    const [name, setName] = useState('');
    const [color, setColor] = useState<string>(HABIT_COLORS[0]);
    const [mandatory, setMandatory] = useState(false);
    const [reminderEnabled, setReminderEnabled] = useState(false);
    const [reminderTime, setReminderTime] = useState('08:00');
    const [error, setError] = useState<string | null>(null);

    const handleReminderToggle = async (enabled: boolean) => {
        if (enabled) {
            // Request notification permission
            const permission = await NotificationService.requestPermission();
            if (permission !== 'granted') {
                setError('Necesitas permitir las notificaciones para usar recordatorios');
                return;
            }
        }
        setReminderEnabled(enabled);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!name.trim()) {
            setError('El nombre es obligatorio');
            return;
        }

        createHabit({
            name: name.trim(),
            color,
            mandatory,
            reminder: reminderEnabled ? { enabled: true, time: reminderTime } : undefined,
        });

        onSuccess?.();
        onClose();
    };

    return (
        <form className="habit-form" onSubmit={handleSubmit}>
            {/* Name input */}
            <div className="habit-form__field">
                <label className="habit-form__label" htmlFor="habit-name">
                    Nombre del hábito
                </label>
                <input
                    id="habit-name"
                    type="text"
                    className="habit-form__input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej: Hacer ejercicio"
                    autoFocus
                />
            </div>

            {/* Color picker */}
            <ColorPicker value={color} onChange={setColor} />

            {/* Mandatory toggle */}
            <div className="habit-form__field habit-form__field--row">
                <label className="habit-form__label" htmlFor="habit-mandatory">
                    Obligatorio
                </label>
                <button
                    id="habit-mandatory"
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
                <label className="habit-form__label" htmlFor="habit-reminder">
                    Recordatorio diario
                </label>
                <button
                    id="habit-reminder"
                    type="button"
                    className={`habit-form__toggle ${reminderEnabled ? 'habit-form__toggle--active' : ''}`}
                    onClick={() => handleReminderToggle(!reminderEnabled)}
                    role="switch"
                    aria-checked={reminderEnabled}
                >
                    <span className="habit-form__toggle-thumb" />
                </button>
            </div>

            {/* Reminder time picker */}
            {reminderEnabled && (
                <TimePicker
                    value={reminderTime}
                    onChange={setReminderTime}
                    label="Hora del recordatorio"
                />
            )}

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
                    type="submit"
                    className="habit-form__btn habit-form__btn--primary"
                >
                    Crear hábito
                </button>
            </div>
        </form>
    );
}

export default HabitForm;
