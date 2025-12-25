// Author: Udara Shanuka
// Project: University-Portal
// FP-ID: FP-20251223-US-SERVICE-STUDENT
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-23T09:05:00Z

import { StudentRepository } from "../repositories/student.repository";
import {
  StudentProfileDTO,
  CourseDTO,
  GradeDTO,
  BorrowedBookDTO,
  BookDTO,
  DashboardDataDTO,
} from "../DTOs/student.dto";
import { AppError } from "../utils/errors/app-error";
import { IStudentService } from "../interfaces/student-service.interface";
import { createLogger } from "@repo/logger";

const logger = createLogger({ service: "backend-student-service" });

const __FP_SIG = "FP-20251223-US-SERVICE-STUDENT|HASH-PLACEHOLDER";

const studentRepository = new StudentRepository();

/**
 * Service: Student Business Logic
 * Orchestrates data fetching from Repositories and transforms raw data into DTOs.
 * Enforces business rules and handles errors.
 */
export class StudentService implements IStudentService {
  /**
   * Retrieves the full profile for a student.
   * Maps database fields to the StudentProfileDTO.
   *
   * @param email - Student's email address
   * @returns Promise<StudentProfileDTO>
   * @throws AppError if profile is not found
   */
  async getProfile(email: string): Promise<StudentProfileDTO> {
    logger.debug({ email }, "Fetching student profile");
    const profile = await studentRepository.findProfileByEmail(email);
    if (!profile) {
      logger.warn({ email }, "Student profile not found");
      throw new AppError("Student profile not found", 404);
    }

    return {
      id: profile.student_id || profile.id.toString(),
      fullName: profile.full_name,
      email: profile.email,
      gpa: profile.gpa || 0,
      degreeProgram: profile.degreeProgram?.name || "N/A",
      academicYear: profile.academic_year || "N/A",
      currentStudyYear: (profile as any).current_study_year || 0,
      enrollmentYear: (profile as any).enrollment_year || "N/A",
    };
  }

  /**
   * Retrieves a list of courses the student is enrolled in.
   *
   * @param email - Student's email address
   * @param filters - Optional filters for semester/year
   * @returns Promise<CourseDTO[]>
   */
  async getCourses(
    email: string,
    filters?: { semester?: number; year?: string }
  ): Promise<CourseDTO[]> {
    logger.debug({ email, filters }, "Fetching student courses");
    const profile = await studentRepository.findProfileByEmail(email);
    if (!profile) {
      throw new AppError("Student profile not found", 404);
    }

    const enrollments = await studentRepository.findEnrollments(
      profile.id,
      filters
    );

    return enrollments.map((enrollment: any) => ({
      courseId: enrollment.course.id,
      code: enrollment.course.code,
      name: enrollment.course.name,
      description: enrollment.course.description || "No description available",
      credits: enrollment.course.credits,
      status: "ENROLLED",
      semester: enrollment.semester,
      offeringYear: enrollment.course.offering_year,
      year:
        enrollment.year_level_taken?.toString() ||
        enrollment.academic_year_taken,
    }));
  }

  /**
   * Retrieves the student's grade history.
   *
   * @param email - Student's email address
   * @returns Promise<GradeDTO[]>
   */
  async getGrades(email: string): Promise<GradeDTO[]> {
    logger.debug({ email }, "Fetching student grades");
    const profile = await studentRepository.findProfileByEmail(email);
    if (!profile) {
      logger.warn({ email }, "Student profile not found for grades fetch");
      throw new AppError("Student profile not found", 404);
    }

    const enrollments = await studentRepository.findEnrollments(profile.id);

    return enrollments.map((enrollment: any) => ({
      courseCode: enrollment.course.code,
      courseName: enrollment.course.name,
      grade: enrollment.grade || "N/A",
      semester: enrollment.semester,
      yearLevelTaken: enrollment.year_level_taken,
      academicYearTaken: enrollment.academic_year_taken,
      credits: enrollment.course.credits,
      type: "Core", // Mocking type for now as it's not in the schema
    }));
  }

  /**
   * Retrieves books currently borrowed by the student.
   *
   * @param email - Student's email address
   * @returns Promise<BorrowedBookDTO[]>
   */
  async getBorrowedBooks(email: string): Promise<BorrowedBookDTO[]> {
    logger.debug({ email }, "Fetching borrowed books");
    const profile = await studentRepository.findProfileByEmail(email);
    if (!profile) {
      logger.warn(
        { email },
        "Student profile not found for borrowed books fetch"
      );
      throw new AppError("Student profile not found", 404);
    }

    const records = await studentRepository.findBorrowRecords(profile.id);

    return records.map((record: any) => ({
      bookId: record.book.id,
      title: record.book.title,
      author: record.book.author,
      dueDate: record.due_date,
      borrowDate: record.borrow_date,
      returnDate: record.return_date,
      status: record.status,
      // Mocking extended fields as they might not be in the current `record.book` relation
      isbn: "978-0000000000",
      publisher: "Unknown Publisher",
      year: 2020,
      description: "Book description not available.",
    }));
  }
}

export const studentService = new StudentService();
