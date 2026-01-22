// Author: Udara Shanuka
// Project: University-Portal
// FP-ID: FP-20251226-US-UI-TOPBAR
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-26T22:50:00Z

"use client";

const __FP_SIG = "FP-20251226-US-UI-TOPBAR|HASH-PLACEHOLDER";

import { LogoutButton } from "../auth/LogoutButton";
import { ReactNode } from "react";
import { motion } from "framer-motion";

/**
 * Interface: DashboardTopBarProps
 * Props for the generic top bar component.
 */
export interface DashboardTopBarProps {
  /** Title of the portal (e.g., "Student Portal") */
  title: string;
  /** Subtitle or welcome text */
  subtitle?: string;
  /** Optional custom right-side content (default: LogoutButton) */
  rightContent?: ReactNode;
  logoutBaseUrl?: string;
}

/**
 * Component: DashboardTopBar
 *
 * Generic Top Bar for dashboard layouts.
 * Displays a welcome message/subtitle, the portal title, and a right-side action (usually logout).
 * Hidden on mobile (md:flex).
 *
 * @param {DashboardTopBarProps} props - Component props
 */
export function DashboardTopBar({
  title,
  subtitle = "Welcome",
  rightContent,
  logoutBaseUrl,
}: DashboardTopBarProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="hidden md:flex justify-between items-center py-6 px-10 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800"
    >
      <div>
        <span className="text-gray-500 dark:text-gray-400">{subtitle}</span>
        <h1 className="text-3xl font-display font-bold text-gray-800 dark:text-gray-100">
          {title}
        </h1>
      </div>
      {rightContent || <LogoutButton logoutBaseUrl={logoutBaseUrl} />}
    </motion.header>
  );
}
