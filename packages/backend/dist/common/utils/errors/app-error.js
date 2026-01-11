// Author: Udara Shanuka
// Project: University-Portal
// FP-ID: FP-20251223-US-UTIL-ERROR
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-26T22:35:00Z
const __FP_SIG = "FP-20251223-US-UTIL-ERROR|HASH-PLACEHOLDER";
/**
 * Custom Application Error Class
 *
 * Extends the native Error class to include HTTP status codes and operational flags.
 * Used for consistent error handling across the application.
 */
export class AppError extends Error {
    /**
     * @param {string} message - Error description
     * @param {number} statusCode - HTTP status code (e.g., 404, 500)
     */
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
