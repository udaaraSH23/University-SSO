// Author: Udara Shanuka
// Project: University-Portal
// FP-ID: FP-20251223-US-UTIL-ERROR
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-23T09:15:00Z

const __FP_SIG = "FP-20251223-US-UTIL-ERROR|HASH-PLACEHOLDER";

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
