import { StorageService } from './storage.service';
import type { HabitLog, HabitAppState, DayStatus, Habit } from '../types';

/**
 * Storage key
 */
const STORAGE_KEY = 'habit-tracker-state';

/**
 * Habit Log Service
 * 
 * Handles all operations for habit completion logs.
 * Manages tracking of daily habit completions.
 * 
 * Follows Single Responsibility Principle - only handles habit log operations.
 */
export class HabitLogService {
    /**
     * Get the current app state from storage
     */
    private static getState(): HabitAppState {
        const stored = StorageService.get<HabitAppState>(STORAGE_KEY);
        return stored || { habits: [], logs: [], settings: { notificationsEnabled: false, currentYear: new Date().getFullYear() } };
    }

    /**
     * Save the app state to storage
     */
    private static saveState(state: HabitAppState): void {
        StorageService.set(STORAGE_KEY, state);
    }

    /**
     * Get all logs
     */
    static getLogs(): HabitLog[] {
        return this.getState().logs;
    }

    /**
     * Get logs for a specific habit
     */
    static getLogsForHabit(habitId: string): HabitLog[] {
        return this.getLogs().filter(log => log.habitId === habitId);
    }

    /**
     * Get all logs for a specific year
     */
    static getLogsForYear(year: number): HabitLog[] {
        const yearPrefix = `${year}-`;
        return this.getLogs().filter(log => log.date.startsWith(yearPrefix));
    }

    /**
     * Get all logs for a specific month
     */
    static getLogsForMonth(year: number, month: number): HabitLog[] {
        const monthPrefix = `${year}-${String(month).padStart(2, '0')}`;
        return this.getLogs().filter(log => log.date.startsWith(monthPrefix));
    }

    /**
     * Check if a habit was completed on a specific date
     */
    static isCompleted(habitId: string, date: string): boolean {
        const log = this.getLogs().find(
            l => l.habitId === habitId && l.date === date
        );
        return log?.completed ?? false;
    }

    /**
     * Toggle habit completion for a specific date
     * 
     * @param habitId - ID of the habit
     * @param date - Date string in "YYYY-MM-DD" format
     * @returns The new completion status
     */
    static toggleCompletion(habitId: string, date: string): boolean {
        const state = this.getState();
        const existingIndex = state.logs.findIndex(
            log => log.habitId === habitId && log.date === date
        );

        let newStatus: boolean;

        if (existingIndex === -1) {
            // Create new log entry
            state.logs.push({
                habitId,
                date,
                completed: true,
            });
            newStatus = true;
        } else {
            // Toggle existing entry
            state.logs[existingIndex].completed = !state.logs[existingIndex].completed;
            newStatus = state.logs[existingIndex].completed;
        }

        this.saveState(state);
        return newStatus;
    }

    /**
     * Set completion status for a specific date (used for adding past days)
     * 
     * @param habitId - ID of the habit
     * @param date - Date string in "YYYY-MM-DD" format
     * @param completed - Completion status
     */
    static setCompletion(habitId: string, date: string, completed: boolean): void {
        const state = this.getState();
        const existingIndex = state.logs.findIndex(
            log => log.habitId === habitId && log.date === date
        );

        if (existingIndex === -1) {
            state.logs.push({ habitId, date, completed });
        } else {
            state.logs[existingIndex].completed = completed;
        }

        this.saveState(state);
    }

    /**
     * Get aggregated day status for calendar display
     * Returns completion data for all days in a year
     * 
     * @param year - Year to get data for
     * @param habits - List of habits to check against
     * @returns Map of date strings to DayStatus
     */
    static getDayStatusMap(year: number, habits: Habit[]): Map<string, DayStatus> {
        const logs = this.getLogsForYear(year);
        const statusMap = new Map<string, DayStatus>();

        // Group logs by date
        const logsByDate = new Map<string, HabitLog[]>();
        for (const log of logs) {
            if (!logsByDate.has(log.date)) {
                logsByDate.set(log.date, []);
            }
            logsByDate.get(log.date)!.push(log);
        }

        // Calculate status for each date that has logs
        for (const [date, dateLogs] of logsByDate) {
            const mandatoryHabits = habits.filter(h => h.mandatory);
            const optionalHabits = habits.filter(h => !h.mandatory);

            let mandatoryCompleted = 0;
            let optionalCompleted = 0;
            const completedColors: string[] = [];

            for (const log of dateLogs) {
                if (log.completed) {
                    const habit = habits.find(h => h.id === log.habitId);
                    if (habit) {
                        completedColors.push(habit.color);
                        if (habit.mandatory) {
                            mandatoryCompleted++;
                        } else {
                            optionalCompleted++;
                        }
                    }
                }
            }

            statusMap.set(date, {
                date,
                mandatoryCompleted,
                mandatoryTotal: mandatoryHabits.length,
                optionalCompleted,
                optionalTotal: optionalHabits.length,
                completedColors,
            });
        }

        return statusMap;
    }

    /**
     * Format a Date object to "YYYY-MM-DD" string
     */
    static formatDate(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
}

export default HabitLogService;
