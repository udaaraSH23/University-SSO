// Author: Udara Shanuka
// Project: University-Portal
// FP-ID: FP-20251224-US-SERVICE-DASHBOARD
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-24T00:00:00Z

import { StudentRepository } from "../repositories/student.repository";
import {
  StudentProfileDTO,
  CourseDTO,
  GradeDTO,
  BorrowedBookDTO,
  DashboardDataDTO,
} from "../DTOs/student.dto";
import { AppError } from "../utils/errors/app-error";
import { IDashboardService } from "../interfaces/dashboard-service.interface";

import { createLogger } from "@repo/logger";

const logger = createLogger({ service: "backend-dashboard-service" });

const __FP_SIG = "FP-20251224-US-SERVICE-DASHBOARD|HASH-PLACEHOLDER";

const studentRepository = new StudentRepository();

/**
 * Service: Dashboard Business Logic
 * Aggregates data from multiple sources for the dashboard.
 */
export class DashboardService implements IDashboardService {
  /**
   * Retrieves aggregated dashboard data w/ single DB lookup.
   */
  async getDashboardData(email: string): Promise<DashboardDataDTO> {
    logger.debug({ email }, "Fetching dashboard data");
    const profile = await studentRepository.findProfileByEmail(email);
    if (!profile) {
      logger.warn({ email }, "Student profile not found for dashboard");
      throw new AppError("Student profile not found", 404);
    }

    const [enrollments, borrowRecords] = await Promise.all([
      studentRepository.findEnrollments(profile.id),
      studentRepository.findBorrowRecords(profile.id),
    ]);

    logger.debug(
      {
        enrollments: enrollments.length,
        borrowRecords: borrowRecords.length,
      },
      "Dashboard data fetched successfully"
    );

    // Map to DTOs
    const profileDTO: StudentProfileDTO = {
      id: profile.student_id || profile.id.toString(),
      fullName: profile.full_name,
      email: profile.email,
      gpa: profile.gpa || 0,
      degreeProgram: profile.degreeProgram?.name || "N/A",
      academicYear: profile.academic_year || "N/A",
      currentStudyYear: (profile as any).current_study_year || 0,
      enrollmentYear: (profile as any).enrollment_year || "N/A",
    };

    const coursesDTO: CourseDTO[] = enrollments.map((e: any) => ({
      courseId: e.course.id,
      code: e.course.code,
      name: e.course.name,
      description: e.course.description || "No description available",
      credits: e.course.credits,
      status: "ENROLLED",
      semester: e.semester,
      offeringYear: e.course.offering_year,
      year: e.year_level_taken?.toString() || e.academic_year_taken,
    }));

    const gradesDTO: GradeDTO[] = enrollments.map((e: any) => ({
      courseCode: e.course.code,
      courseName: e.course.name,
      grade: e.grade || "N/A",
      semester: e.semester,
      yearLevelTaken: e.year_level_taken,
      academicYearTaken: e.academic_year_taken,
      credits: e.course.credits,
      type: "Core",
    }));

    const booksDTO: BorrowedBookDTO[] = borrowRecords.map((r: any) => ({
      bookId: r.book.id,
      title: r.book.title,
      author: r.book.author,
      dueDate: r.due_date,
      borrowDate: r.borrow_date,
      returnDate: r.return_date,
      status: r.status,
      isbn: "978-0000000000",
      publisher: "Unknown Publisher",
      year: 2020,
      description: "Book description not available.",
    }));

    return {
      profile: profileDTO,
      courses: coursesDTO,
      grades: gradesDTO,
      books: booksDTO,
    };
  }
}

export const dashboardService = new DashboardService();
