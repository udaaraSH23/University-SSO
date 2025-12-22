// Author: Udara Shanuka
// Project: University-Portal
// FP-ID: FP-20251222-US-D4E5F6
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-22T16:58:00Z

"use client";

const __FP_SIG = "FP-20251222-US-D4E5F6|HASH-PLACEHOLDER";

/**
 * RoleRedirectCard Component.
 *
 * Displays a full-screen redirection landing page customized based on the user's role/destination.
 * Uses Framer Motion for animations and Tailwind CSS for styling.
 */

import {
  ArrowRight,
  LogOut,
  ShieldCheck,
  GraduationCap,
  Library,
  Building,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { LogoutButton } from "./LogoutButton";

/* ---------------------------------------------
   Portal UI Configuration (Tailwind-safe)
--------------------------------------------- */

const PORTAL_CONFIG = {
  student: {
    name: "Student Portal",
    icon: GraduationCap,
    accentBg: "bg-blue-500/10",
    border: "border-blue-500/20",
    text: "text-blue-600 dark:text-blue-400",
    button: "bg-blue-600 hover:bg-blue-700",
    shadow: "shadow-blue-500/20",
  },
  admin: {
    name: "Admin Portal",
    icon: ShieldCheck,
    accentBg: "bg-red-500/10",
    border: "border-red-500/20",
    text: "text-red-600 dark:text-red-400",
    button: "bg-red-600 hover:bg-red-700",
    shadow: "shadow-red-500/20",
  },
  library: {
    name: "Library Portal",
    icon: Library,
    accentBg: "bg-green-500/10",
    border: "border-green-500/20",
    text: "text-green-600 dark:text-green-400",
    button: "bg-green-600 hover:bg-green-700",
    shadow: "shadow-green-500/20",
  },
  default: {
    name: "the correct portal",
    icon: Building,
    accentBg: "bg-gray-500/10",
    border: "border-gray-500/20",
    text: "text-gray-600 dark:text-gray-400",
    button: "bg-gray-700 hover:bg-gray-800",
    shadow: "shadow-gray-500/20",
  },
} as const;

/* ---------------------------------------------
   Helper
--------------------------------------------- */

function resolvePortal(to: string) {
  if (to.includes("student")) return PORTAL_CONFIG.student;
  if (to.includes("admin")) return PORTAL_CONFIG.admin;
  if (to.includes("library")) return PORTAL_CONFIG.library;
  return PORTAL_CONFIG.default;
}

/* ---------------------------------------------
   Component
--------------------------------------------- */

export function RoleRedirectCard() {
  const searchParams = useSearchParams();
  const to = searchParams.get("to") || "/";
  const portal = resolvePortal(to);
  const Icon = portal.icon;

  const handleSignOut = () => {
    window.location.href = "/auth/logout-callback";
  };

  return (
    /* FULL-SCREEN STATIC LAYOUT (NO ANIMATION HERE) */
    <div
      className="h-screen w-full flex items-center justify-center
        bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))]
        from-gray-50 via-gray-100 to-gray-200
        dark:from-gray-900 dark:via-black dark:to-gray-900
        p-4 font-sans
      "
    >
      {/* Card Container - No root-level motion */}
      <div className="w-full max-w-md">
        <div className="relative overflow-hidden rounded-3xl border border-white/20 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 p-8 shadow-2xl backdrop-blur-xl">
          {/* Accent light */}
          <div
            className={`absolute -right-20 -top-20 h-40 w-40 rounded-full ${portal.accentBg} blur-3xl`}
          />

          <div className="relative flex flex-col items-center">
            {/* Icon with subtle animation */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={`mb-6 flex h-20 w-20 items-center justify-center rounded-2xl ${portal.accentBg} border ${portal.border} shadow-inner`}
            >
              <Icon className="h-8 w-8" />
            </motion.div>

            {/* Text with fade-in */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="text-center"
            >
              <h1 className="mb-3 text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                Authorized Redirect
              </h1>
              <p className="mb-8 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                You've successfully authenticated! You will be redirected to{" "}
                <span className={`font-semibold ${portal.text}`}>
                  {portal.name}
                </span>
                .
              </p>
            </motion.div>

            {/* Actions */}
            <div className="flex w-full flex-col gap-4">
              <a
                href={to}
                className={`
                  flex w-full items-center justify-center gap-2 rounded-xl
                  ${portal.button}
                  px-6 py-4 text-sm font-semibold text-white
                  shadow-lg ${portal.shadow}
                  transition-transform hover:scale-[1.02] border-[1px]
                `}
              >
                <span>Continue to {portal.name}</span>
                <ArrowRight className="h-4 w-4" />
              </a>

              <LogoutButton />
            </div>

            <p className="mt-8 text-[10px] uppercase tracking-widest text-gray-500 opacity-60">
              University Digital Identity System
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
