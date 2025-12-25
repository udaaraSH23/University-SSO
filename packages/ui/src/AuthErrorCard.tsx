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
import { signIn } from "next-auth/react";

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
      if (error === "AccessDenied") {
        localStorage.setItem("forceFreshAuth", "true");
      }
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4 transition-colors">
      <div className="w-full max-w-md rounded-xl bg-white dark:bg-gray-800 p-8 shadow-lg border border-gray-100 dark:border-gray-700">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-red-100 dark:bg-red-900/30 p-3">
            <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
        </div>

        <h1 className="mb-2 text-center text-xl font-bold text-gray-900 dark:text-white">
          {title}
        </h1>

        <p className="mb-8 text-center text-sm text-gray-500 dark:text-gray-400">
          {message}
        </p>

        {error === "AccessDenied" ? (
          <div className="flex w-full items-center justify-center">
            <button
              onClick={() => {
                localStorage.setItem("forceFreshAuth", "true");
                signIn("wso2", { callbackUrl: "/" }, { prompt: "login" });
              }}
              className="px-6 py-3 rounded-xl text-sm font-semibold bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border-2 border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-700 dark:hover:text-blue-300 shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-[1.02] active:scale-95 flex items-center gap-2"
            >
              Sign in with a different account
            </button>
          </div>
        ) : (
          <a
            href="/login"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Login
          </a>
        )}
      </div>
    </div>
  );
}
