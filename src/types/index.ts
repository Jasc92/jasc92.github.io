/**
 * Global Type Definitions
 * 
 * This file exports all shared types and interfaces used throughout the application.
 * Following Interface Segregation Principle - types are organized by domain.
 */

// Re-export domain-specific types
export * from './pwa.types';

/**
 * Generic API Response wrapper
 * Used for consistent API response handling
 */
export interface ApiResponse<T> {
    data: T;
    success: boolean;
    message?: string;
    timestamp: number;
}

/**
 * Generic Error type for application-wide error handling
 */
export interface AppError {
    code: string;
    message: string;
    details?: unknown;
}

/**
 * Base entity interface
 * All data entities should extend this
 */
export interface BaseEntity {
    id: string;
    createdAt: Date;
    updatedAt: Date;
}
