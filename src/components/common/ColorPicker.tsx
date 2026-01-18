import { HABIT_COLORS } from '../../types';

interface ColorPickerProps {
    /** Currently selected color */
    value: string;
    /** Change handler */
    onChange: (color: string) => void;
}

/**
 * ColorPicker Component
 * 
 * Grid of predefined colors for habit selection.
 */
export function ColorPicker({ value, onChange }: ColorPickerProps) {
    return (
        <div className="color-picker">
            <label className="color-picker__label">Color</label>
            <div className="color-picker__grid">
                {HABIT_COLORS.map(color => (
                    <button
                        key={color}
                        type="button"
                        className={`color-picker__option ${value === color ? 'color-picker__option--selected' : ''}`}
                        style={{ backgroundColor: color }}
                        onClick={() => onChange(color)}
                        aria-label={`Seleccionar color ${color}`}
                        aria-pressed={value === color}
                    />
                ))}
            </div>
        </div>
    );
}

export default ColorPicker;
