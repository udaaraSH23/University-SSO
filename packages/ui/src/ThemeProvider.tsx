// Author: Udara Shanuka
// Project: University-Portal
// FP-ID: FP-20251222-US-G7H8I9
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-22T16:58:00Z

"use client";

const __FP_SIG = "FP-20251222-US-G7H8I9|HASH-PLACEHOLDER";

/**
 * ThemeProvider Component.
 *
 * Wraps the application with NextThemesProvider to enable dark/light mode switching.
 */

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes"; // Use type import directly from next-themes

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
