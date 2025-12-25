// Author: Udara Shanuka
// Project: University-Portal
// FP-ID: FP-20251220-US-a9d8f7
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-22T16:55:00Z

"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { ArrowRight, Loader2 } from "lucide-react";

const __FP_SIG = "FP-20251220-US-a9d8f7|HASH-PLACEHOLDER";

/**
 * LoginButton Component.
 *
 * Renders a primary call-to-action button that initiates the WSO2 OIDC login flow.
 * Uses Lucide icons for visual enhancement.
 *
 * @returns {JSX.Element} The rendered button component.
 */
export function LoginButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    const forceFreshAuth =
      typeof window !== "undefined" &&
      localStorage.getItem("forceFreshAuth") === "true";

    // Clear before use to ensure it's removed even if signIn redirects immediately
    if (forceFreshAuth) {
      localStorage.removeItem("forceFreshAuth");
    }

    await signIn(
      "wso2",
      { callbackUrl: "/" },
      forceFreshAuth ? { prompt: "login" } : undefined
    );
  };

  return (
    <button
      onClick={handleLogin}
      disabled={isLoading}
      className="
        w-full flex items-center justify-center gap-2
        bg-gradient-to-r from-blue-600 to-purple-600 
        hover:from-blue-700 hover:to-purple-700
        dark:from-blue-500 dark:to-purple-500
        dark:hover:from-blue-600 dark:hover:to-purple-600
        text-white font-semibold 
        py-4 px-8 rounded-xl
        shadow-lg shadow-blue-500/30 dark:shadow-blue-900/40
        hover:shadow-xl hover:shadow-blue-500/40 dark:hover:shadow-blue-900/50
        transition-all duration-300 
        transform hover:scale-[1.02] active:scale-95
        disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none
        group
      "
    >
      <span>{isLoading ? "Connecting..." : "Get Started"}</span>
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
      )}
    </button>
  );
}
