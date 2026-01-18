import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    type ReactNode
} from 'react';
import { HabitService, HabitLogService, NotificationService } from '../services';
import type {
    Habit,
    CreateHabitData,
    UpdateHabitData,
    DayStatus,
    HabitSettings
} from '../types';

/**
 * Habit Context Value interface
 */
interface HabitContextValue {
    /** List of all habits */
    habits: Habit[];
    /** Day status map for calendar display */
    dayStatusMap: Map<string, DayStatus>;
    /** Current year being viewed */
    currentYear: number;
    /** App settings */
    settings: HabitSettings;
    /** Loading state */
    isLoading: boolean;

    // Habit CRUD operations
    createHabit: (data: CreateHabitData) => Habit;
    updateHabit: (id: string, updates: UpdateHabitData) => Habit | null;
    deleteHabit: (id: string) => boolean;

    // Log operations
    toggleCompletion: (habitId: string, date: string) => boolean;
    setCompletion: (habitId: string, date: string, completed: boolean) => void;
    isCompleted: (habitId: string, date: string) => boolean;

    // Navigation
    setYear: (year: number) => void;

    // Refresh data
    refreshData: () => void;
}

const HabitContext = createContext<HabitContextValue | undefined>(undefined);

interface HabitProviderProps {
    children: ReactNode;
}

/**
 * Habit Provider Component
 * 
 * Provides global state management for habits and their logs.
 * Wraps the application to give access to habit data and operations.
 */
export function HabitProvider({ children }: HabitProviderProps) {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [dayStatusMap, setDayStatusMap] = useState<Map<string, DayStatus>>(new Map());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [settings, setSettings] = useState<HabitSettings>({
        notificationsEnabled: false,
        currentYear: new Date().getFullYear(),
    });
    const [isLoading, setIsLoading] = useState(true);

    /**
     * Load data from storage
     */
    const loadData = useCallback(() => {
        setIsLoading(true);

        const loadedHabits = HabitService.getHabits();
        const loadedSettings = HabitService.getSettings();
        const statusMap = HabitLogService.getDayStatusMap(currentYear, loadedHabits);

        setHabits(loadedHabits);
        setSettings(loadedSettings);
        setDayStatusMap(statusMap);

        // Initialize notifications for habits with reminders
        NotificationService.initializeReminders(loadedHabits);

        setIsLoading(false);
    }, [currentYear]);

    // Load data on mount and when year changes
    useEffect(() => {
        loadData();
    }, [loadData]);

    /**
     * Create a new habit
     */
    const createHabit = useCallback((data: CreateHabitData): Habit => {
        const newHabit = HabitService.createHabit(data);

        // Schedule notification if reminder is enabled
        if (newHabit.reminder?.enabled) {
            NotificationService.scheduleReminder(newHabit);
        }

        // Refresh local state
        setHabits(HabitService.getHabits());

        return newHabit;
    }, []);

    /**
     * Update an existing habit
     */
    const updateHabit = useCallback((id: string, updates: UpdateHabitData): Habit | null => {
        const updatedHabit = HabitService.updateHabit(id, updates);

        if (updatedHabit) {
            // Update notification schedule
            NotificationService.cancelReminder(id);
            if (updatedHabit.reminder?.enabled) {
                NotificationService.scheduleReminder(updatedHabit);
            }

            // Refresh local state
            setHabits(HabitService.getHabits());
        }

        return updatedHabit;
    }, []);

    /**
     * Delete a habit
     */
    const deleteHabit = useCallback((id: string): boolean => {
        // Cancel any scheduled notifications
        NotificationService.cancelReminder(id);

        const success = HabitService.deleteHabit(id);

        if (success) {
            // Refresh local state
            const updatedHabits = HabitService.getHabits();
            setHabits(updatedHabits);
            setDayStatusMap(HabitLogService.getDayStatusMap(currentYear, updatedHabits));
        }

        return success;
    }, [currentYear]);

    /**
     * Toggle habit completion for a date
     */
    const toggleCompletion = useCallback((habitId: string, date: string): boolean => {
        const newStatus = HabitLogService.toggleCompletion(habitId, date);

        // Refresh day status map
        setDayStatusMap(HabitLogService.getDayStatusMap(currentYear, habits));

        return newStatus;
    }, [currentYear, habits]);

    /**
     * Set completion status for a specific date
     */
    const setCompletion = useCallback((habitId: string, date: string, completed: boolean): void => {
        HabitLogService.setCompletion(habitId, date, completed);

        // Refresh day status map
        setDayStatusMap(HabitLogService.getDayStatusMap(currentYear, habits));
    }, [currentYear, habits]);

    /**
     * Check if habit is completed for a date
     */
    const isCompleted = useCallback((habitId: string, date: string): boolean => {
        return HabitLogService.isCompleted(habitId, date);
    }, []);

    /**
     * Change the current year
     */
    const setYear = useCallback((year: number): void => {
        setCurrentYear(year);
        HabitService.updateSettings({ currentYear: year });
    }, []);

    /**
     * Refresh all data from storage
     */
    const refreshData = useCallback((): void => {
        loadData();
    }, [loadData]);

    const value: HabitContextValue = {
        habits,
        dayStatusMap,
        currentYear,
        settings,
        isLoading,
        createHabit,
        updateHabit,
        deleteHabit,
        toggleCompletion,
        setCompletion,
        isCompleted,
        setYear,
        refreshData,
    };

    return (
        <HabitContext.Provider value={value}>
            {children}
        </HabitContext.Provider>
    );
}

/**
 * Hook to access habit context
 * 
 * @throws Error if used outside HabitProvider
 */
export function useHabits(): HabitContextValue {
    const context = useContext(HabitContext);

    if (!context) {
        throw new Error('useHabits must be used within a HabitProvider');
    }

    return context;
}

export default HabitProvider;
