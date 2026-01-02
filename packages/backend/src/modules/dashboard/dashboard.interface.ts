// Author: Udara Shanuka
// Project: University-Portal
// FP-ID: FP-20251224-US-INTERFACE-DASHBOARD
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-26T22:35:00Z

import { DashboardDataDTO } from "../student/student.dto";

/**
 * Interface: Dashboard Service
 * Defines the contract for dashboard data aggregation.
 */
export interface IDashboardService {
  /**
   * Retrieves aggregated dashboard data (profile, courses, grades, books).
   * Optimized to reduce database calls.
   *
   * @param email - Student's email address
   * @returns Promise resolving to DashboardDataDTO
   */
  getDashboardData(email: string): Promise<DashboardDataDTO>;
}
