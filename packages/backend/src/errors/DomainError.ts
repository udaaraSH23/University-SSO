// Author: System
// Project: University-Portal
// FP-ID: FP-20260105-DOM-ERR
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2026-01-05T10:55:00Z

const __FP_SIG = "FP-20260105-DOM-ERR|HASH-PLACEHOLDER";

import { AppError } from "./AppError";
import { ErrorCode } from "./errorCodes";

/**
 * Domain Error
 *
 * Represents an error that occurs within the business logic (Service Layer).
 * These errors correspond to known business rules violations (e.g., Student Not Found).
 */
export class DomainError extends AppError {
  constructor(message: string, code: ErrorCode, statusCode: number = 400) {
    super(message, code, statusCode);
  }
}
