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
  [ERROR_CODES.BOOK_NOT_FOUND]: "Book not found.",
  [ERROR_CODES.BOOK_ALREADY_EXISTS]: "Book already exists.",
  [ERROR_CODES.BOOK_UNAVAILABLE]: "Book is currently unavailable.",
  [ERROR_CODES.COURSE_NOT_FOUND]: "Course not found.",
  [ERROR_CODES.OFFERING_NOT_FOUND]: "Course offering not found.",
  [ERROR_CODES.DEGREE_PROGRAM_NOT_FOUND]: "Degree program not found.",
  [ERROR_CODES.LENDING_STUDENT_NOT_REGISTERED]:
    "You are not registered for library facilities.",
  [ERROR_CODES.LENDING_BOOK_UNAVAILABLE]: "This book is currently unavailable.",
  [ERROR_CODES.LENDING_ALREADY_BORROWED]:
    "You have already borrowed this book.",
  [ERROR_CODES.LENDING_RECORD_NOT_FOUND]: "Borrow record not found.",
  [ERROR_CODES.IDENTITY_SERVER_ERROR]:
    "Identity service is temporarily unavailable.",
};

export class ApiClient {
  /**
   * Validates data against a Zod-like schema.
   * @param schema - Schema with a parse method (e.g., Zod schema)
   * @param data - Data to validate
   * @returns Validated data
   * @throws ApiClientError if validation fails
   */
  public validate<T>(
    schema: { parse: (data: unknown) => T },
    data: unknown
  ): T {
    try {
      return schema.parse(data);
    } catch (error: any) {
      // Extract specific validation messages if possible (Zod specific)
      const details = error.errors || error.message;
      throw new ApiClientError(
        "Validation failed",
        ERROR_CODES.VALIDATION_ERROR,
        details,
        error
      );
    }
  }

  /**
   * Executes the provided async function and handles errors.
   * @param fn - The async function to execute (e.g. service call)
   * @returns The result of the function
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
