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
        throw new ApiClientError(
          error.message || "Operation failed",
          error.code,
          error.details,
          error
        );
      }

      // If it's already an ApiClientError (nested calls), rethrow
      if (error instanceof ApiClientError) {
        throw error;
      }

      // Default to Internal Error for unmapped exceptions
      throw new ApiClientError(
        error.message || "An unexpected error occurred",
        ERROR_CODES.INTERNAL_ERROR,
        undefined,
        error
      );
    }
  }
}

export const apiClient = new ApiClient();
