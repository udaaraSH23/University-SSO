// Author: System
// Project: University-Portal
// FP-ID: FP-20260105-APP-ERR
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2026-01-05T10:55:00Z
const __FP_SIG = "FP-20260105-APP-ERR|HASH-PLACEHOLDER";
import { ERROR_CODES } from "./errorCodes";
/**
 * Base Application Error
 *
 * The root error class for the application. All custom errors should extend this.
 * Captures the error code, status code, and marks the error as operational (trusted).
 */
export class AppError extends Error {
    constructor(message, code = ERROR_CODES.INTERNAL_ERROR, statusCode = 500) {
        super(message);
        this.isOperational = true;
        this.code = code;
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
