// Author: Udara Shanuka
// Project: University-Portal
// FP-ID: FP-20251224-US-INTERFACE-STUDENT
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-24T00:00:00Z

import {
  StudentProfileDTO,
  CourseDTO,
  GradeDTO,
  BorrowedBookDTO,
  DashboardDataDTO,
} from "../DTOs/student.dto";

/**
 * Interface: Student Service
 * Defines the contract for student-related business logic.
 * Handles profiles, enrollments, grades, and dashboard aggregation.
 */
export interface IStudentService {
  /**
   * Retrieves the full profile for a student.
   *
   * @param email - Student's email address
   * @returns Promise resolving to StudentProfileDTO
   */
  getProfile(email: string): Promise<StudentProfileDTO>;

  /**
   * Retrieves a list of courses the student is enrolled in.
   * Can be filtered by semester and year.
   *
   * @param email - Student's email address
   * @param filters - Optional filters for semester/year
   * @returns Promise resolving to an array of CourseDTOs
   */
  getCourses(
    email: string,
    filters?: { semester?: number; year?: string }
  ): Promise<CourseDTO[]>;

  /**
   * Retrieves the student's grade history.
   *
   * @param email - Student's email address
   * @returns Promise resolving to an array of GradeDTOs
   */
  getGrades(email: string): Promise<GradeDTO[]>;

  /**
   * Retrieves books currently borrowed by the student.
   *
   * @param email - Student's email address
   * @returns Promise resolving to an array of BorrowedBookDTOs
   */
  getBorrowedBooks(email: string): Promise<BorrowedBookDTO[]>;
}
