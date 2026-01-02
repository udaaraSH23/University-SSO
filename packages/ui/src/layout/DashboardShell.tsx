// Author: Udara Shanuka
// Project: University-Portal
// FP-ID: FP-20251226-US-UI-SHELL
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-26T22:50:00Z

"use client";

const __FP_SIG = "FP-20251226-US-UI-SHELL|HASH-PLACEHOLDER";

import { useState, ReactNode } from "react";
import { MobileHeader } from "./MobileHeader";
import { DashboardTopBar } from "./DashboardTopBar";
import { DashboardFooter } from "./DashboardFooter";
import { PortalSidebar, SidebarItem } from "./PortalSidebar";
import { LogoutButton } from "../auth/LogoutButton";

/**
 * Interface: DashboardShellProps
 *
 * Props for the main dashboard shell component.
 * Configures the sidebar, user info, and main portal titles.
 */
export interface DashboardShellProps {
  children: ReactNode;
  user: {
    name: string;
    course?: string;
    image?: string;
  };
  sidebarItems: SidebarItem[];
  portalTitle: string;
  subtitle?: string;
}

/**
 * Component: DashboardShell
 *
 * The primary layout wrapper for authenticated portal pages.
 * Orchestrates the responsive sidebar, top bar, mobile header, and content area.
 * Handles mobile sidebar toggle state.
 *
 * @param {DashboardShellProps} props - Configuration props
 */
export function DashboardShell({
  children,
  user,
  sidebarItems,
  portalTitle,
  subtitle,
}: DashboardShellProps) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex overflow-hidden bg-gray-100 dark:bg-gray-900 font-body">
      <MobileHeader onMenuClick={() => setSidebarOpen(true)} />

      <PortalSidebar
        isOpen={isSidebarOpen}
        user={{
          name: user.name,
          subtitle: user.course,
          image: user.image,
        }}
        items={sidebarItems}
        footer={
          // Mobile logout button
          <div className="md:hidden">
            <LogoutButton />
          </div>
        }
      />

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden glass"
          onClick={() => setSidebarOpen(false)}
          id="sidebar-overlay"
        ></div>
      )}

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative md:ml-64">
        <DashboardTopBar title={portalTitle} subtitle={subtitle} />
        <div className="flex-1 overflow-y-auto px-4 md:px-10 pb-10 pt-20 md:pt-0 flex flex-col">
          <div className="flex-1">{children}</div>
          <DashboardFooter />
        </div>
      </main>
    </div>
  );
}
