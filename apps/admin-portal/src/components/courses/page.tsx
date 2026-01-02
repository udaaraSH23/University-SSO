"use client";

// Author: Udara Shanuka
// Project: University-Portal
// FP-ID: FP-20251230-US-ADMIN2
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-30T18:32:11+05:30

const __FP_SIG = "FP-20251230-US-ADMIN2|HASH-PLACEHOLDER";

import { DashboardHeader } from "@repo/ui";
import { AdminStatsGrid } from "@/components/dashboard/AdminStatsGrid";
import { QuickAccessGrid } from "@/components/dashboard/QuickAccessGrid";

/**
 * Admin Dashboard Home Page
 *
 * The main landing page for the admin portal.
 * Displays an overview of key statistics and quick access links to common administrative tasks.
 */
export default function Home() {
  return (
    <div className="flex flex-col gap-6">
      <DashboardHeader
        title="Dashboard Overview"
        description="Welcome back."
        showHomeIcon={false}
      />

      <AdminStatsGrid />
      <QuickAccessGrid />
    </div>
  );
}
