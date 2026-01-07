// Author: UDARA SHANUKA
// Project: University-Portal
// FP-ID: FP-20251231-US-DASHBOARD-PAGE
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2026-01-01T14:55:00+05:30

const __FP_SIG = "FP-20251231-US-DASHBOARD-PAGE|HASH-PLACEHOLDER";

import { AdminStatsGrid } from "../../components/dashboard/AdminStatsGrid";
import { QuickAccessGrid } from "../../components/dashboard/QuickAccessGrid";
import { adminDashboardService } from "@repo/backend";
import { api } from "@/lib/api";

export default async function DashboardPage() {
  let stats = {
    totalStudents: 0,
    totalCourses: 0,
    totalDepartments: 0,
    totalFaculties: 0,
  };
  let errorMsg = "";

  try {
    stats = await api.execute(() => adminDashboardService.getStats());
  } catch (error: any) {
    console.error("Failed to fetch admin stats:", error);
    errorMsg = "Failed to load dashboard statistics.";
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
        <p className="text-muted-foreground">
          Welcome back to UniAdmin. Here&apos;s what&apos;s happening today.
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-lg bg-red-50 text-red-600 border border-red-200">
          {errorMsg}
        </div>
      )}

      <AdminStatsGrid stats={stats} />
      <QuickAccessGrid />
    </div>
  );
}
