"use client";

// Author: UDARA SHANUKA
// Project: University-Portal
// FP-ID: FP-20251231-US-DASHBOARD-PAGE
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2026-01-01T14:55:00+05:30

const __FP_SIG = "FP-20251231-US-DASHBOARD-PAGE|HASH-PLACEHOLDER";

import { AdminStatsGrid } from "../../components/dashboard/AdminStatsGrid";
import { QuickAccessGrid } from "../../components/dashboard/QuickAccessGrid";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
        <p className="text-muted-foreground">
          Welcome back to UniAdmin. Here&apos;s what&apos;s happening today.
        </p>
      </div>

      <AdminStatsGrid />
      <QuickAccessGrid />
    </div>
  );
}
