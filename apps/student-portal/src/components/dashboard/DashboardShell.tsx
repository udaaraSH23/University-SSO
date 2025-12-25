// Author: Udara Shanuka
// Project: University-Portal
// FP-ID: FP-20251223-US-S9T0U1
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-25T11:15:00Z

"use client";

/**
 * DashboardShell
 * A wrapper component that provides the layout structure for the authenticated student dashboard.
 * It manages the responsive sidebar toggle state and coordinates the sidebar, mobile header,
 * and main content area.
 *
 * Usage:
 *     <DashboardShell>
 *         <YourDashboardContent />
 *     </DashboardShell>
 */

import { useState } from "react";
import DashboardSidebar from "./DashboardSidebar";
import DashboardHeader from "./DashboardHeader";
import MobileHeader from "./MobileHeader";
import DashboardFooter from "./DashboardFooter";

const __FP_SIG = "FP-20251223-US-S9T0U1|HASH-PLACEHOLDER";

interface DashboardShellProps {
  /** The content to be rendered within the dashboard layout */
  children: React.ReactNode;
  /** User profile for the sidebar */
  user: {
    name: string;
    course: string;
  };
  pendingBooksCount?: number;
}

/**
 * Main layout shell for the Student Portal dashboard.
 * Manages responsive sidebar state and layout structure.
 *
 * @param {DashboardShellProps} props - Component properties
 */
export default function DashboardShell({
  children,
  user,
  pendingBooksCount,
}: DashboardShellProps) {
  // State to track whether the mobile sidebar is currently visible
  // We use local state here as this UI toggle doesn't need global persistence
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex overflow-hidden bg-gray-100 dark:bg-gray-900 font-body">
      {/* Mobile header handles the hamburger menu click to open sidebar */}
      <MobileHeader onMenuClick={() => setSidebarOpen(true)} />

      <DashboardSidebar
        isOpen={isSidebarOpen}
        user={user}
        pendingBooksCount={pendingBooksCount}
      />

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden glass"
          onClick={() => setSidebarOpen(false)}
          id="sidebar-overlay"
        ></div>
      )}

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative md:ml-64">
        <DashboardHeader />
        <div className="flex-1 overflow-y-auto px-4 md:px-10 pb-10 pt-20 md:pt-0 flex flex-col">
          <div className="flex-1">{children}</div>
          <DashboardFooter />
        </div>
      </main>
    </div>
  );
}
