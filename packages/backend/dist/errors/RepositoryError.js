// Author: System
// Project: University-Portal
// FP-ID: FP-20260105-REPO-ERR
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2026-01-05T10:55:00Z
const __FP_SIG = "FP-20260105-REPO-ERR|HASH-PLACEHOLDER";
import { AppError } from "./AppError";
import { ERROR_CODES } from "./errorCodes";
/**
 * Repository Error
 *
 * Represents a technical error occurring in the Data Access Layer (Repository).
 * These are usually database failures, connection issues, or unexpected constraints.
 *
 * @defaultValue code = DB_FAILURE
 * @defaultValue statusCode = 500
 */
export class RepositoryError extends AppError {
    constructor(message, code = ERROR_CODES.DB_FAILURE) {
        super(message, code, 500);
    }
}
