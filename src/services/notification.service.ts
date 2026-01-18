import type { Habit } from '../types';

/**
 * Notification Service
 * 
 * Handles browser notifications for habit reminders.
 * Uses the Notification API with Service Worker for scheduled notifications.
 * 
 * Follows Single Responsibility Principle - only handles notification logic.
 */
export class NotificationService {
    private static timers: Map<string, ReturnType<typeof setTimeout>> = new Map();

    /**
     * Check if notifications are supported
     */
    static isSupported(): boolean {
        return 'Notification' in window;
    }

    /**
     * Get current notification permission status
     */
    static getPermission(): NotificationPermission {
        if (!this.isSupported()) {
            return 'denied';
        }
        return Notification.permission;
    }

    /**
     * Request notification permission from user
     * 
     * @returns Promise resolving to permission status
     */
    static async requestPermission(): Promise<NotificationPermission> {
        if (!this.isSupported()) {
            console.warn('Notifications not supported in this browser');
            return 'denied';
        }

        try {
            const permission = await Notification.requestPermission();
            return permission;
        } catch (error) {
            console.error('Error requesting notification permission:', error);
            return 'denied';
        }
    }

    /**
     * Show a notification immediately
     * 
     * @param title - Notification title
     * @param options - Notification options
     */
    static show(title: string, options?: NotificationOptions): Notification | null {
        if (!this.isSupported() || Notification.permission !== 'granted') {
            console.warn('Cannot show notification: permission not granted');
            return null;
        }

        try {
            return new Notification(title, {
                icon: '/icons/icon-192x192.png',
                badge: '/icons/icon-192x192.png',
                ...options,
            });
        } catch (error) {
            console.error('Error showing notification:', error);
            return null;
        }
    }

    /**
     * Schedule a daily reminder for a habit
     * Uses setTimeout to trigger at the specified time each day
     * 
     * @param habit - Habit with reminder configuration
     */
    static scheduleReminder(habit: Habit): void {
        if (!habit.reminder?.enabled || !habit.reminder.time) {
            return;
        }

        // Cancel any existing timer for this habit
        this.cancelReminder(habit.id);

        const scheduleNext = () => {
            const now = new Date();
            const [hours, minutes] = habit.reminder!.time.split(':').map(Number);

            // Calculate next trigger time
            const nextTrigger = new Date();
            nextTrigger.setHours(hours, minutes, 0, 0);

            // If the time has passed today, schedule for tomorrow
            if (nextTrigger <= now) {
                nextTrigger.setDate(nextTrigger.getDate() + 1);
            }

            const msUntilTrigger = nextTrigger.getTime() - now.getTime();

            const timer = setTimeout(() => {
                // Show the notification
                this.show(`⏰ Recordatorio: ${habit.name}`, {
                    body: habit.mandatory
                        ? '¡Es hora de completar este hábito obligatorio!'
                        : '¡No olvides tu hábito!',
                    tag: `habit-${habit.id}`,
                    requireInteraction: true,
                });

                // Schedule the next day's reminder
                scheduleNext();
            }, msUntilTrigger);

            this.timers.set(habit.id, timer);
        };

        scheduleNext();
    }

    /**
     * Cancel a scheduled reminder
     * 
     * @param habitId - ID of the habit to cancel reminder for
     */
    static cancelReminder(habitId: string): void {
        const timer = this.timers.get(habitId);
        if (timer) {
            clearTimeout(timer);
            this.timers.delete(habitId);
        }
    }

    /**
     * Cancel all scheduled reminders
     */
    static cancelAllReminders(): void {
        for (const timer of this.timers.values()) {
            clearTimeout(timer);
        }
        this.timers.clear();
    }

    /**
     * Initialize reminders for all habits with enabled reminders
     * Call this on app startup
     * 
     * @param habits - List of habits to schedule reminders for
     */
    static initializeReminders(habits: Habit[]): void {
        // Only schedule if permission is granted
        if (this.getPermission() !== 'granted') {
            return;
        }

        for (const habit of habits) {
            if (habit.reminder?.enabled) {
                this.scheduleReminder(habit);
            }
        }
    }
}

export default NotificationService;
