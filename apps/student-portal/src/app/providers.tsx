// Author: Udara Shanuka
// Project: University-Portal
// FP-ID: FP-20251222-US-C5D6E7
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-25T11:05:00Z

"use client";

const __FP_SIG = "FP-20251222-US-C5D6E7|HASH-PLACEHOLDER";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@repo/ui";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}
