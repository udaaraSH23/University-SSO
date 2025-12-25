// Author: Udara Shanuka
// Project: University-Portal
// FP-ID: FP-20251222-US-T6U7V8
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-25T11:05:00Z

"use client";

const __FP_SIG = "FP-20251222-US-T6U7V8|HASH-PLACEHOLDER";

import { Suspense } from "react";
import { RoleRedirectCard } from "@repo/ui";

/**
 * Redirect Page
 *
 * Handles role-based redirection after login.
 * Displays a loading state while processing.
 */
export default function RedirectPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <RoleRedirectCard />
    </Suspense>
  );
}
