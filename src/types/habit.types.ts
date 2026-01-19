/**
 * Habit Types
 * 
 * Type definitions for the habit tracking functionality.
 */

/**
 * Habit entity
 * Represents a trackable habit with optional reminder
 */
export interface Habit {
    /** Unique identifier */
    id: string;
    /** Name of the habit */
    name: string;
    /** Color for visual representation (hex code) */
    color: string;
    /** Whether this habit is mandatory or optional */
    mandatory: boolean;
    /** Creation timestamp */
    createdAt: string;
    /** Optional reminder configuration */
    reminder?: HabitReminder;
}

/**
 * Habit reminder configuration
 */
export interface HabitReminder {
    /** Whether the reminder is active */
    enabled: boolean;
    /** Time in "HH:MM" format (24h) */
    time: string;
}

/**
 * Daily habit log entry
 * Records whether a habit was completed on a specific date
 */
export interface HabitLog {
    /** ID of the associated habit */
    habitId: string;
    /** Date in "YYYY-MM-DD" format */
    date: string;
    /** Whether the habit was completed */
    completed: boolean;
}

/**
 * Data for creating a new habit
 */
export interface CreateHabitData {
    name: string;
    color: string;
    mandatory: boolean;
    reminder?: HabitReminder;
}

/**
 * Data for updating an existing habit
 */
export interface UpdateHabitData {
    name?: string;
    color?: string;
    mandatory?: boolean;
    reminder?: HabitReminder;
}

/**
 * App state stored in localStorage
 */
export interface HabitAppState {
    habits: Habit[];
    logs: HabitLog[];
    settings: HabitSettings;
}

/**
 * App settings
 */
export interface HabitSettings {
    /** Whether notifications are enabled globally */
    notificationsEnabled: boolean;
    /** Current year being viewed */
    currentYear: number;
}

/**
 * Map of dates to their completion status for a single habit
 * Key: date string "YYYY-MM-DD"
 * Value: boolean (completed or not)
 */
export type HabitLogMap = Map<string, boolean>;

/**
 * Aggregated completion data for a single day
 * Used for rendering day cells in the calendar
 */
export interface DayStatus {
    /** Date string "YYYY-MM-DD" */
    date: string;
    /** Number of mandatory habits completed */
    mandatoryCompleted: number;
    /** Total number of mandatory habits */
    mandatoryTotal: number;
    /** Number of optional habits completed */
    optionalCompleted: number;
    /** Total number of optional habits */
    optionalTotal: number;
    /** List of completed habit colors for visual display */
    completedColors: string[];
    /** Whether this status is from a filtered view (celebration effect should be disabled) */
    isFiltered?: boolean;
}

/**
 * Predefined colors for habits
 */
export const HABIT_COLORS = [
    '#ef4444', // Red
    '#f97316', // Orange
    '#f59e0b', // Amber
    '#eab308', // Yellow
    '#84cc16', // Lime
    '#22c55e', // Green
    '#14b8a6', // Teal
    '#06b6d4', // Cyan
    '#0ea5e9', // Sky
    '#3b82f6', // Blue
    '#6366f1', // Indigo
    '#8b5cf6', // Violet
    '#a855f7', // Purple
    '#d946ef', // Fuchsia
    '#ec4899', // Pink
    '#f43f5e', // Rose
] as const;

export type HabitColor = typeof HABIT_COLORS[number];
