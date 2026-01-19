import { generateId } from '../utils';
import { StorageService } from './storage.service';
import type {
    Habit,
    HabitAppState,
    CreateHabitData,
    UpdateHabitData,
    HabitSettings
} from '../types';

/**
 * Storage keys for habit data
 */
const STORAGE_KEYS = {
    APP_STATE: 'habit-tracker-state',
} as const;

/**
 * Default app settings
 */
const DEFAULT_SETTINGS: HabitSettings = {
    currentYear: new Date().getFullYear(),
};

/**
 * Habit Service
 * 
 * Handles all CRUD operations for habits.
 * Data is persisted to localStorage for offline-first functionality.
 * 
 * Follows Single Responsibility Principle - only handles habit data management.
 */
export class HabitService {
    /**
     * Get the current app state from storage
     */
    static getState(): HabitAppState {
        const stored = StorageService.get<HabitAppState>(STORAGE_KEYS.APP_STATE);

        if (!stored) {
            return {
                habits: [],
                logs: [],
                settings: DEFAULT_SETTINGS,
            };
        }

        return stored;
    }

    /**
     * Save the app state to storage
     */
    private static saveState(state: HabitAppState): void {
        StorageService.set(STORAGE_KEYS.APP_STATE, state);
    }

    /**
     * Get all habits
     */
    static getHabits(): Habit[] {
        return this.getState().habits;
    }

    /**
     * Get a single habit by ID
     */
    static getHabitById(id: string): Habit | undefined {
        return this.getHabits().find(h => h.id === id);
    }

    /**
     * Create a new habit
     * 
     * @param data - Habit creation data
     * @returns The created habit
     */
    static createHabit(data: CreateHabitData): Habit {
        const state = this.getState();

        const newHabit: Habit = {
            id: generateId(),
            name: data.name,
            color: data.color,
            mandatory: data.mandatory,
            createdAt: new Date().toISOString(),
        };

        state.habits.push(newHabit);
        this.saveState(state);

        return newHabit;
    }

    /**
     * Update an existing habit
     * 
     * @param id - Habit ID
     * @param updates - Fields to update
     * @returns The updated habit or null if not found
     */
    static updateHabit(id: string, updates: UpdateHabitData): Habit | null {
        const state = this.getState();
        const habitIndex = state.habits.findIndex(h => h.id === id);

        if (habitIndex === -1) {
            return null;
        }

        state.habits[habitIndex] = {
            ...state.habits[habitIndex],
            ...updates,
        };

        this.saveState(state);
        return state.habits[habitIndex];
    }

    /**
     * Delete a habit and all its logs
     * 
     * @param id - Habit ID to delete
     * @returns True if deleted, false if not found
     */
    static deleteHabit(id: string): boolean {
        const state = this.getState();
        const initialLength = state.habits.length;

        // Remove the habit
        state.habits = state.habits.filter(h => h.id !== id);

        // Also remove all logs for this habit
        state.logs = state.logs.filter(log => log.habitId !== id);

        if (state.habits.length === initialLength) {
            return false;
        }

        this.saveState(state);
        return true;
    }

    /**
     * Get app settings
     */
    static getSettings(): HabitSettings {
        return this.getState().settings;
    }

    /**
     * Update app settings
     */
    static updateSettings(updates: Partial<HabitSettings>): HabitSettings {
        const state = this.getState();
        state.settings = { ...state.settings, ...updates };
        this.saveState(state);
        return state.settings;
    }
}

export default HabitService;
