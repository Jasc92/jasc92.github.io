/**
 * Storage Service
 * 
 * Provides abstraction over browser storage APIs (localStorage, sessionStorage).
 * Follows Single Responsibility Principle - only handles data persistence.
 * Follows Dependency Inversion - consumers depend on this abstraction.
 * 
 * @example
 * ```ts
 * import { StorageService } from './services';
 * 
 * // Save data
 * StorageService.set('user', { name: 'John' });
 * 
 * // Retrieve data
 * const user = StorageService.get<User>('user');
 * ```
 */

/**
 * Storage types available
 */
export type StorageType = 'local' | 'session';

/**
 * Storage Service class
 * Provides type-safe operations for browser storage
 */
export class StorageService {
    /**
     * Get the appropriate storage object
     */
    private static getStorage(type: StorageType): Storage {
        return type === 'local' ? localStorage : sessionStorage;
    }

    /**
     * Set a value in storage
     * 
     * @param key - Storage key
     * @param value - Value to store (will be JSON serialized)
     * @param type - Storage type: 'local' or 'session'
     */
    static set<T>(key: string, value: T, type: StorageType = 'local'): void {
        try {
            const serialized = JSON.stringify(value);
            this.getStorage(type).setItem(key, serialized);
        } catch (error) {
            console.error(`Error saving to ${type}Storage:`, error);
        }
    }

    /**
     * Get a value from storage
     * 
     * @param key - Storage key
     * @param type - Storage type: 'local' or 'session'
     * @returns The parsed value or null if not found
     */
    static get<T>(key: string, type: StorageType = 'local'): T | null {
        try {
            const item = this.getStorage(type).getItem(key);
            return item ? (JSON.parse(item) as T) : null;
        } catch (error) {
            console.error(`Error reading from ${type}Storage:`, error);
            return null;
        }
    }

    /**
     * Remove a value from storage
     * 
     * @param key - Storage key to remove
     * @param type - Storage type: 'local' or 'session'
     */
    static remove(key: string, type: StorageType = 'local'): void {
        try {
            this.getStorage(type).removeItem(key);
        } catch (error) {
            console.error(`Error removing from ${type}Storage:`, error);
        }
    }

    /**
     * Clear all items from storage
     * 
     * @param type - Storage type: 'local' or 'session'
     */
    static clear(type: StorageType = 'local'): void {
        try {
            this.getStorage(type).clear();
        } catch (error) {
            console.error(`Error clearing ${type}Storage:`, error);
        }
    }

    /**
     * Check if a key exists in storage
     * 
     * @param key - Storage key to check
     * @param type - Storage type: 'local' or 'session'
     * @returns True if the key exists
     */
    static has(key: string, type: StorageType = 'local'): boolean {
        return this.getStorage(type).getItem(key) !== null;
    }

    /**
     * Get all keys in storage
     * 
     * @param type - Storage type: 'local' or 'session'
     * @returns Array of all storage keys
     */
    static keys(type: StorageType = 'local'): string[] {
        const storage = this.getStorage(type);
        const keys: string[] = [];
        for (let i = 0; i < storage.length; i++) {
            const key = storage.key(i);
            if (key) keys.push(key);
        }
        return keys;
    }
}

export default StorageService;
