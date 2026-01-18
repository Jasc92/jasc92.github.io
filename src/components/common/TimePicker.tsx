interface TimePickerProps {
    /** Current time value "HH:MM" */
    value: string;
    /** Change handler */
    onChange: (time: string) => void;
    /** Label text */
    label?: string;
}

/**
 * TimePicker Component
 * 
 * Simple time input for selecting reminder time.
 */
export function TimePicker({ value, onChange, label = 'Hora' }: TimePickerProps) {
    return (
        <div className="time-picker">
            <label className="time-picker__label" htmlFor="time-input">
                {label}
            </label>
            <input
                id="time-input"
                type="time"
                className="time-picker__input"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}

export default TimePicker;
