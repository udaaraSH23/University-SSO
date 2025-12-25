// Author: Udara Shanuka
// Project: University-Portal
// FP-ID: FP-20251222-US-Q3R4S5
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-25T11:05:00Z

"use client";

const __FP_SIG = "FP-20251222-US-Q3R4S5|HASH-PLACEHOLDER";

import { Suspense } from "react";
import { AuthErrorCard } from "@repo/ui";

/**
 * Auth Error Page
 *
 * Displays authentication errors using the shared AuthErrorCard component.
 * Wrapped in Suspense to handle client-side rendering requirements.
 */
export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthErrorCard />
    </Suspense>
  );
}
