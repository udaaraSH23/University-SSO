"use server";

// Author: Udara Shanuka
// Project: University-Portal
// FP-ID: FP-20251230-US-ACTION-DASHBOARD
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-30T18:52:00+05:30

const __FP_SIG = "FP-20251230-US-ACTION-DASHBOARD|HASH-PLACEHOLDER";

import { adminDashboardService } from "@repo/backend";

/**
 * Server Action: Get Admin Dashboard Stats
 *
 * Fetches aggregated statistics for the admin dashboard.
 */
export async function getAdminMetricsAction() {
  try {
    const stats = await adminDashboardService.getStats();
    return { success: true, data: stats };
  } catch (error) {
    console.error("Failed to fetch admin metrics:", error);
    return { success: false, error: "Failed to fetch dashboard metrics" };
  }
}
