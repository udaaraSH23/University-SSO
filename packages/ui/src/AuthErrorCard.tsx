// Author: Udara Shanuka
// Project: University-Portal
// FP-ID: FP-20251222-US-A1B2C3
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-22T16:55:00Z

"use client";

const __FP_SIG = "FP-20251222-US-A1B2C3|HASH-PLACEHOLDER";

import { AlertCircle, ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

// Error mapping based on NextAuth error codes
const ERROR_MESSAGES: Record<string, { title: string; message: string }> = {
  Configuration: {
    title: "Server Configuration Error",
    message: "There is a problem with the server configuration. Check logs.",
  },
  AccessDenied: {
    title: "Access Denied",
    message: "You do not have permission to sign in.",
  },
  Verification: {
    title: "Verification Failed",
    message:
      "The sign in link is no longer valid. It may have been used already or it may have expired.",
  },
  Default: {
    title: "Authentication Error",
    message: "An unexpected error occurred during authentication.",
  },
};

/**
 * AuthErrorCard Component
 * Displays authentication errors with structured logging.
 *
 * @see error_handling_template.md
 */
export function AuthErrorCard() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error") || "Default";
  const { title, message } = ERROR_MESSAGES[error] || ERROR_MESSAGES.Default;

  useEffect(() => {
    // Structured logging as per template
    if (error) {
      console.error(
        JSON.stringify(
          {
            timestamp: new Date().toISOString(),
            level: "ERROR",
            module: "Auth",
            message: `Authentication failed: ${error}`,
            context: {
              errorCode: error,
              url: window.location.href,
            },
          },
          null,
          2
        )
      );
    }
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-red-100 p-3">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
        </div>

        <h1 className="mb-2 text-center text-xl font-bold text-gray-900">
          {title}
        </h1>

        <p className="mb-8 text-center text-sm text-gray-500">{message}</p>

        <a
          href="/login"
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Login
        </a>
      </div>
    </div>
  );
}
