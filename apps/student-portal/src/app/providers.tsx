// Author: Udara Shanuka
// Project: University-Portal
// FP-ID: FP-20251222-US-C5D6E7
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-25T11:05:00Z

"use client";

const __FP_SIG = "FP-20251222-US-C5D6E7|HASH-PLACEHOLDER";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@repo/ui";

/**
 * Global Providers Component
 *
 * This component wraps the entire application with necessary context providers.
 * It ensures that authentication sessions and UI themes are available globally
 * to all client-side components.
 *
 * Providers included:
 * 1. SessionProvider - Manages NextAuth.js authentication state
 * 2. ThemeProvider - Manages light/dark mode and color themes via next-themes
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - The child components to be wrapped (usually the app's layout or page content)
 * @returns {JSX.Element} The wrapped application structure
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    // SessionProvider: Propagates the user's authentication session to the client
    <SessionProvider>
      {/* ThemeProvider: Handles dynamic theme switching (light/dark/system) */}
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}
