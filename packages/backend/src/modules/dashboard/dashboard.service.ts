// Author: Udara Shanuka (Modified by System)
// Project: University-Portal
// FP-ID: FP-20260105-US-SERVICE-DASHBOARD-V2
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2026-01-05T13:05:00Z

const __FP_SIG = "FP-20260105-US-SERVICE-DASHBOARD-V2|HASH-PLACEHOLDER";

import { StudentRepository } from "../student/student.repository";
import {
  StudentProfileDTO,
  CourseDTO,
  GradeDTO,
  BorrowedBookDTO,
  DashboardDataDTO,
} from "../student/student.dto";
import { DomainError, ERROR_CODES, RepositoryError } from "../../errors";
import { IDashboardService } from "./dashboard.interface";
import { BaseService } from "../../common/services/base.service";

/**
 * Service: Dashboard Data Aggregation
 *
 * Responsible for fetching and aggregating data for the student dashboard.
 * Optimizes performance by using repositories directly for read-heavy operations.
 */
export class DashboardService extends BaseService implements IDashboardService {
  private studentRepository = new StudentRepository();

  constructor() {
    super("backend-dashboard-service");
  }
  /**
   * Retrieves aggregated dashboard data w/ single DB lookup.
   */
  async getDashboardData(email: string): Promise<DashboardDataDTO> {
    this.logger.debug({ email }, "Fetching dashboard data");
    try {
      const profile = await this.studentRepository.findProfileByEmail(email);
      if (!profile) {
        this.logger.warn({ email }, "Student profile not found for dashboard");
        throw new DomainError(
          "Student profile not found",
          ERROR_CODES.STUDENT_NOT_FOUND,
          404
        );
      }

      const [enrollments, borrowRecords] = await Promise.all([
        this.studentRepository.findEnrollments(profile.id),
        this.studentRepository.findBorrowRecords(profile.id),
      ]);

      this.logger.debug(
        {
          enrollments: enrollments.length,
          borrowRecords: borrowRecords.length,
        },
        "Dashboard data fetched successfully"
      );

      // Map to DTOs
      const profileDTO: StudentProfileDTO = {
        id: profile.id,
        student_id: profile.student_id,
        fullName: profile.full_name,
        email: profile.email,
        gpa: profile.gpa || 0,
        degreeProgram: profile.degreeProgram?.name || "N/A",
        degreeProgramId: profile.degreeProgramId,
        currentAcademicYear: profile.currentAcademicYear || "N/A",
        level: profile.level || 0,
        isLibraryRegistered: profile.isLibraryRegistered ?? false,
      };

      const coursesDTO: CourseDTO[] = enrollments.map((e: any) => ({
        courseId: e.courseOffering.course.id,
        code: e.courseOffering.course.code,
        name: e.courseOffering.course.name,
        description:
          e.courseOffering.course.description || "No description available",
        credits: e.courseOffering.course.credits,
        status: "ENROLLED",
        semester: e.courseOffering.semester,
        academicYear: e.courseOffering.academicYear,
        level: e.courseOffering.level,
      }));

      const gradesDTO: GradeDTO[] = enrollments.map((e: any) => ({
        courseCode: e.courseOffering.course.code,
        courseName: e.courseOffering.course.name,
        grade: e.grade || "N/A",
        semester: e.courseOffering.semester,
        yearLevelTaken: e.courseOffering.level,
        academicYearTaken: e.courseOffering.academicYear,
        credits: e.courseOffering.course.credits,
        type: "Core",
      }));

      const booksDTO: BorrowedBookDTO[] = borrowRecords.map((r: any) => ({
        recordId: r.id,
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

      const result = {
        profile: profileDTO,
        courses: coursesDTO,
        grades: gradesDTO,
        books: booksDTO,
      };
      this.logger.debug(
        { result, layer: "Service" },
        "[DashboardService] getDashboardData returning"
      );
      return result;
    } catch (err) {
      if (err instanceof DomainError) throw err;
      if (err instanceof RepositoryError) throw err;
      throw new RepositoryError(
        "Failed to fetch dashboard data",
        ERROR_CODES.DB_FAILURE
      );
    }
  }
}

export const dashboardService = new DashboardService();
