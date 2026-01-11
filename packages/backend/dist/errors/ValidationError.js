// Author: System
// Project: University-Portal
// FP-ID: FP-20260105-VAL-ERR
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2026-01-05T10:55:00Z
const __FP_SIG = "FP-20260105-VAL-ERR|HASH-PLACEHOLDER";
import { AppError } from "./AppError";
import { ERROR_CODES } from "./errorCodes";
/**
 * Validation Error
 *
 * Thrown when input data fails schema validation or sanity checks.
 * Contains an optional 'details' object to provide field-level validation messages.
 */
export class ValidationError extends AppError {
    constructor(message, details) {
        super(message, ERROR_CODES.VALIDATION_ERROR, 400);
        this.details = details;
    }
}
