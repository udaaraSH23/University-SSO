/// <reference path="../../../auth/src/next-auth.d.ts" />

// Author: Udara Shanuka
// Project: University-Portal
// FP-ID: FP-20251221-US-77a8b9
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-22T16:55:00Z

"use client";

const __FP_SIG = "FP-20251221-US-77a8b9|HASH-PLACEHOLDER";

import { signOut, useSession } from "next-auth/react";
import { LogOut } from "lucide-react";

/**
 * LogoutButton Component.
 *
 * Renders a button that initiates a federated logout flow.
 * 1. Redirects to WSO2 IdP to terminate global session.
 * 2. WSO2 redirects back to /auth/logout-callback (server route).
 * 3. Server route clears NextAuth session and redirects to login.
 */
export function LogoutButton() {
  const { data: session } = useSession();

  const handleLogout = () => {
    // Construct WSO2 logout URL
    const logoutBaseUrl =
      process.env.NEXT_PUBLIC_WSO2_LOGOUT_URL ||
      "https://wso2is.com/t/universityportal.com/oidc/logout";

    // The callback endpoint that handles the server-side session clearing
    const appCallbackUrl = `${window.location.origin}/auth/logout-callback`;

    const logoutUrl = new URL(logoutBaseUrl);
    logoutUrl.searchParams.set("post_logout_redirect_uri", appCallbackUrl);

    // Include id_token_hint if available (recommended by OIDC spec)
    if (session?.idToken) {
      logoutUrl.searchParams.set("id_token_hint", session.idToken);
    }

    // Redirect to IdP logout
    window.location.href = logoutUrl.toString();
  };

  return (
    <button
      onClick={handleLogout}
      className="
        flex items-center justify-center gap-2 
        px-6 py-3 rounded-xl
        text-sm font-semibold
        bg-white dark:bg-gray-800
        text-red-600 dark:text-red-400
        border-2 border-red-200 dark:border-red-800
        hover:bg-red-50 dark:hover:bg-red-950/30
        hover:border-red-300 dark:hover:border-red-700
        hover:text-red-700 dark:hover:text-red-300
        shadow-sm hover:shadow-md
        transition-all duration-300
        transform hover:scale-[1.02] active:scale-95
        focus:outline-none focus:ring-2 focus:ring-offset-2 
        focus:ring-red-500 dark:focus:ring-red-400
        dark:focus:ring-offset-gray-900
      "
      aria-label="Sign out"
    >
      <LogOut className="w-4 h-4" />
      <span>Sign Out</span>
    </button>
  );
}
