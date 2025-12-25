// Author: Udara Shanuka
// Project: University-Portal
// FP-ID: FP-20251223-US-REPO-STUDENT
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-23T09:00:00Z

import prisma from "../lib/db";
import { createLogger } from "@repo/logger";

const logger = createLogger({ service: "backend-student-repo" });

const __FP_SIG = "FP-20251223-US-REPO-STUDENT|HASH-PLACEHOLDER";

/**
 * Repository: Student Data Access
 * Handles direct database interactions for student-related data using Prisma.
 * Strictly focuses on data retrieval without business logic.
 */
export class StudentRepository {
  /**
   * Finds a student profile by their email address.
   * Includes the associated degree program.
   *
   * @param email - The email of the user
   * @returns UserProfile with DegreeProgram or null
   */
  async findProfileByEmail(email: string) {
    try {
      return await prisma.userProfile.findFirst({
        where: {
          user: {
            email: email,
          },
        },
        include: {
          degreeProgram: true,
        },
      });
    } catch (error) {
      logger.error({ error, email }, "Failed to find profile by email");
      throw error;
    }
  }

  /**
   * Finds course enrollments for a specific student profile.
   * Supports filtering by semester and academic year.
   *
   * @param userProfileId - The ID of the student's profile
   * @param filters - Optional filters object
   * @returns Array of Enrollment records with Course details
   */
  async findEnrollments(
    userProfileId: number,
    filters?: { semester?: number; year?: string }
  ) {
    try {
      const whereClause: any = {
        userProfileId: userProfileId,
      };

      // If semester is provided, ensure it's a number
      if (filters?.semester) {
        whereClause.semester = Number(filters.semester);
      }

      // If year is a numeric string (1, 2, 3, 4), filter by year_level_taken
      // Otherwise, filter by academic_year_taken (if it's a string like "2023/2024")
      if (filters?.year) {
        const yearLevel = parseInt(filters.year);
        if (!isNaN(yearLevel) && yearLevel >= 1 && yearLevel <= 4) {
          whereClause.year_level_taken = yearLevel;
        } else {
          whereClause.academic_year_taken = filters.year;
        }
      }

      return await prisma.enrollment.findMany({
        where: whereClause,
        include: {
          course: true,
        },
      });
    } catch (error) {
      logger.error(
        { error, userProfileId, filters },
        "Failed to find enrollments"
      );
      throw error;
    }
  }

  /**
   * Finds active borrow records for a student.
   * Defaults to fetching currently 'BORROWED' books.
   *
   * @param userProfileId - The ID of the student's profile
   * @param status - Status of the borrow record (optional)
   * @returns Array of BorrowRecord with Book details
   */
  async findBorrowRecords(userProfileId: number, status?: string) {
    try {
      const where: any = {
        userProfileId: userProfileId,
      };

      if (status) {
        where.status = status;
      }

      return await prisma.borrowRecord.findMany({
        where: where,
        include: {
          book: true,
        },
      });
    } catch (error) {
      logger.error(
        { error, userProfileId, status },
        "Failed to find borrow records"
      );
      throw error;
    }
  }
}
