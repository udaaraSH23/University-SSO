// Author: Udara Shanuka (Modified by System)
// Project: University-Portal
// FP-ID: FP-20260105-BASE-SVC-V2
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2026-01-05T11:00:00Z

import { createLogger, Logger } from "@repo/logger";
import { AppError, ERROR_CODES } from "../../errors";

export const __FP_SIG = "FP-20260105-BASE-SVC-V2|HASH-PLACEHOLDER";

/**
 * Abstract Base Service
 *
 * Provides a foundation for all backend services, enforcing consistent logging
 * and error handling patterns across the application.
 */
export abstract class BaseService {
  /**
   * Structured logger instance initialized with the service name.
   */
  protected readonly logger: Logger;

  /**
   * Initializes the service with a scoped logger.
   *
   * @param {string} serviceName - Unique identifier for the service (used in logs)
   */
  constructor(serviceName: string) {
    this.logger = createLogger({ service: serviceName });
  }

  /**
   * Standardized error handling method.
   * Logs the error and re-throws it as an AppError.
   *
   * @param {unknown} error - The caught error object
   * @param {string} message - Contextual error message to log
   * @throws {AppError} Throws the original AppError or wraps unknown errors
   * @returns {never} Always throws
   */
  protected handleError(error: unknown, message: string): never {
    this.logger.error({ error }, message);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(message, ERROR_CODES.INTERNAL_ERROR, 500);
  }
}
