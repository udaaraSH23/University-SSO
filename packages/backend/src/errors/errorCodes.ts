// Author: System
// Project: University-Portal
// FP-ID: FP-20260105-ERR-CODES
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2026-01-05T10:55:00Z

const __FP_SIG = "FP-20260105-ERR-CODES|HASH-PLACEHOLDER";

/**
 * Global Error Codes
 *
 * Single source of truth for all application error codes.
 * varying from generic HTTP-like errors to specific domain context errors.
 *
 * Used by:
 * - Backend: To throw specific typed errors
 * - Frontend: To handle errors and show localized messages
 */
export const ERROR_CODES = {
  // Generic
  VALIDATION_ERROR: "VALIDATION_ERROR",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  INTERNAL_ERROR: "INTERNAL_ERROR",
  DB_FAILURE: "DB_FAILURE",
  RESOURCE_NOT_FOUND: "RESOURCE_NOT_FOUND",

  // Student Context
  STUDENT_NOT_FOUND: "STUDENT_NOT_FOUND",
  STUDENT_ALREADY_EXISTS: "STUDENT_ALREADY_EXISTS",

  // User Context
  USER_NOT_FOUND: "USER_NOT_FOUND",
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];
