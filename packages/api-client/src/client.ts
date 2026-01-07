// Author: System
// Project: University-Portal
// FP-ID: FP-20260105-API-CLIENT
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2026-01-05T11:05:00Z

const __FP_SIG = "FP-20260105-API-CLIENT|HASH-PLACEHOLDER";

import { ApiClientError, ERROR_CODES } from "./errors";

/**
 * Executes a server function (Service method or Server Action) safely.
 * Catches backend errors and translates them to the Client Error contract.
 *
 * Usage:
 * const data = await apiClient.execute(() => studentService.getProfile(email));
 */
const SAFE_ERROR_MESSAGES: Partial<Record<string, string>> = {
  [ERROR_CODES.VALIDATION_ERROR]: "Please check your input and try again.",
  [ERROR_CODES.UNAUTHORIZED]: "You must be logged in to perform this action.",
  [ERROR_CODES.FORBIDDEN]:
    "You do not have permission to access this resource.",
  [ERROR_CODES.INTERNAL_ERROR]:
    "An unexpected error occurred. Please try again later.",
  [ERROR_CODES.DB_FAILURE]:
    "Service temporarily unavailable. Please try again later.",
  [ERROR_CODES.RESOURCE_NOT_FOUND]:
    "The requested resource could not be found.",
  [ERROR_CODES.STUDENT_NOT_FOUND]: "Student profile not found.",
  [ERROR_CODES.USER_NOT_FOUND]: "User account not found.",
};

export class ApiClient {
  /**
   * Executes the provided async function and handles errors.
   * @param fn - The async function to execute (e.g. service call)
   */
  public async execute<T>(fn: () => Promise<T>): Promise<T> {
    try {
      return await fn();
    } catch (error: any) {
      // If validation error or domain error with a 'code'
      if (error && error.code) {
        // Use mapped safe message if available, otherwise default to a generic one
        const safeMessage =
          SAFE_ERROR_MESSAGES[error.code] || "An operation error occurred.";

        throw new ApiClientError(
          safeMessage,
          error.code,
          error.details,
          error // Original error preserved for debugging
        );
      }

      // If it's already an ApiClientError (nested calls), rethrow
      if (error instanceof ApiClientError) {
        throw error;
      }

      // Default to Internal Error for unmapped exceptions
      throw new ApiClientError(
        "An unexpected error occurred. Please try again later.",
        ERROR_CODES.INTERNAL_ERROR,
        undefined,
        error
      );
    }
  }
}

export const apiClient = new ApiClient();
