// Author: Udara Shanuka
// Project: University-Portal
// FP-ID: FP-20251224-US-INTERFACE-STUDENT
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-26T22:35:00Z

import {
  StudentProfileDTO,
  CourseDTO,
  GradeDTO,
  BorrowedBookDTO,
  DashboardDataDTO,
  PaginatedStudentsDTO,
  StudentFiltersDTO,
  StudentDetailDTO,
  StudentCreateDTO,
  StudentUpdateDTO,
} from "./student.dto";

/**
 * Interface: Student Service
 *
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

  /**
   * Retrieves a paginated list of students based on filters.
   * Primarily used by the Admin portal.
   *
   * @param filters - Pagination and search filters
   * @returns Promise resolving to PaginatedStudentsDTO
   */
  getPaginatedStudents(
    filters: StudentFiltersDTO
  ): Promise<PaginatedStudentsDTO>;

  /**
   * Retrieves full details for a student by ID.
   *
   * @param id - Student Profile ID
   * @returns Promise resolving to StudentDetailDTO
   */
  getStudentDetailById(id: number): Promise<StudentDetailDTO>;

  /**
   * Creates a new student and registers them in Identity Server.
   *
   * @param data - Student creation data
   * @returns Promise resolving to the created StudentProfileDTO
   */
  createStudent(data: StudentCreateDTO): Promise<StudentProfileDTO>;

  /**
   * Updates an existing student profile and syncs with Identity Server.
   *
   * @param id - Student Profile ID
   * @param data - Student update data
   * @returns Promise resolving to the updated StudentProfileDTO
   */
  updateStudent(id: number, data: StudentUpdateDTO): Promise<StudentProfileDTO>;
}
