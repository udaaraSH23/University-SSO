// Author: System
// Project: University-Portal
// FP-ID: FP-20260105-API-ERRORS
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2026-01-05T11:05:00Z

const __FP_SIG = "FP-20260105-API-ERRORS|HASH-PLACEHOLDER";

// Replicating the contract from backend
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

export interface ApiErrorResponse {
  code: ErrorCode;
  message: string;
  details?: any;
}

export class ApiClientError extends Error {
  public code: ErrorCode;
  public details?: any;
  public originalError?: any;

  constructor(
    message: string,
    code: ErrorCode,
    details?: any,
    originalError?: any
  ) {
    super(message);
    this.code = code;
    this.details = details;
    this.originalError = originalError;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
