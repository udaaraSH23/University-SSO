// Author: Udara Shanuka
// Project: University-Portal
// FP-ID: FP-20251222-US-B8C9D0
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-22T17:15:00Z

"use client";

const __FP_SIG = "FP-20251222-US-B8C9D0|HASH-PLACEHOLDER";

import { Suspense } from "react";
import { RoleRedirectCard } from "@repo/ui";

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
