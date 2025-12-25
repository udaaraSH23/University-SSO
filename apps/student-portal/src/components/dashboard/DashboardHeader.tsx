// Author: Udara Shanuka
// Project: University-Portal
// FP-ID: FP-20251223-US-D4E5F6
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-25T11:15:00Z

"use client";

/**
 * DashboardHeader
 * The top header component for the desktop view of the student dashboard.
 * Displays the current semester context and the page title.
 * Includes the logout button for quick access.
 *
 * Usage:
 *     <DashboardHeader />
 */

import { LogoutButton } from "@repo/ui";

const __FP_SIG = "FP-20251223-US-D4E5F6|HASH-PLACEHOLDER";

/**
 * Desktop header component.
 *
 * Renders the top navigation bar for the dashboard layout.
 *
 * Design Decision:
 * - This component is hidden on mobile devices (`hidden md:flex`) because the
 *   MobileHeader takes over that role on smaller screens to optimize vertical space.
 *
 * @returns {JSX.Element} The rendered header
 */
export default function DashboardHeader() {
  return (
    <header className="hidden md:flex justify-between items-center py-6 px-10 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div>
        <span className="text-gray-500 dark:text-gray-400">Welcome</span>
        <h1 className="text-3xl font-display font-bold text-gray-800 dark:text-gray-100">
          Student Portal
        </h1>
      </div>
      <LogoutButton />
    </header>
  );
}
