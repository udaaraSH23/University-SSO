// Author: Udara Shanuka
// Project: University-Portal
// FP-ID: FP-20251222-US-G1H2I3
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-22T17:40:00Z

"use client";

const __FP_SIG = "FP-20251222-US-G1H2I3|HASH-PLACEHOLDER";

import { Suspense } from "react";
import { AuthErrorCard } from "@repo/ui";

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthErrorCard />
    </Suspense>
  );
}
