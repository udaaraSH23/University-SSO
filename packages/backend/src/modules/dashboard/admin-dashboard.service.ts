// Author: Udara Shanuka
// Project: University-Portal
// FP-ID: FP-20251230-US-SERVICE-ADMINDASHBOARD
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-30T18:49:00+05:30

import prisma from "../../lib/db";
import { BaseService } from "../../common/services/base.service";
import { AdminDashboardStatsDTO } from "./admin-dashboard.dto";
import { DomainError, ERROR_CODES, RepositoryError } from "../../errors";

const __FP_SIG = "FP-20251230-US-SERVICE-ADMINDASHBOARD|HASH-PLACEHOLDER";

export class AdminDashboardService extends BaseService {
  constructor() {
    super("backend-admin-dashboard-service");
  }

  /**
   * Retrieves statistics for the admin dashboard.
   *
   * @returns Promise<AdminDashboardStatsDTO>
   */
  async getStats(): Promise<AdminDashboardStatsDTO> {
    this.logger.debug("Fetching admin dashboard stats");

    try {
      const [totalStudents, totalCourses, totalDepartments, totalFaculties] =
        await Promise.all([
          prisma.studentProfile.count(),
          prisma.course.count(),
          prisma.department.count(),
          prisma.faculty.count(), // "Active Faculties" in UI, assuming all are active or filtered if needed. Schema has logic? No active field in Faculty.
        ]);

      // Note: Faculty schema does not have 'active' field, assuming all are active.
      // Departments schema does not have 'active' field.
      // Students schema has 'isLibraryRegistered' but not generic 'active' boolean on profile, maybe rely on User.
      // However, for counts, simple count is usually sufficient.

      const stats: AdminDashboardStatsDTO = {
        totalStudents,
        totalCourses,
        totalDepartments,
        totalFaculties,
      };

      this.logger.debug({ stats }, "Admin dashboard stats fetched");
      return stats;
    } catch (err) {
      throw new RepositoryError(
        "Failed to fetch admin dashboard stats",
        ERROR_CODES.DB_FAILURE
      );
    }
  }
}

export const adminDashboardService = new AdminDashboardService();
