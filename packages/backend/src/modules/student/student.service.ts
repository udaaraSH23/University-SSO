// Author: Udara Shanuka (Modified by System)
// Project: University-Portal
// FP-ID: FP-20260105-US-SERVICE-STUDENT-V2
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2026-01-05T11:00:00Z

const __FP_SIG = "FP-20260105-US-SERVICE-STUDENT-V2|HASH-PLACEHOLDER";

import { StudentRepository } from "./student.repository";
import {
  StudentProfileDTO,
  CourseDTO,
  GradeDTO,
  BorrowedBookDTO,
  BookDTO,
  DashboardDataDTO,
  PaginatedStudentsDTO,
  StudentFiltersDTO,
  StudentDetailDTO,
  StudentCreateDTO,
  StudentUpdateDTO,
} from "./student.dto";
import { DomainError, ERROR_CODES, RepositoryError } from "../../errors";
import { IStudentService } from "./student.interface";
import { BaseService } from "../../common/services/base.service";
import { identityService } from "../identity/identity.service";

/**
 * Service: Student Management
 *
 * Implements business logic for converting DB data to DTOs for the student portal.
 * Handles Profile, Courses, Grades, and Borrowed Books retrieval.
 */
export class StudentService extends BaseService implements IStudentService {
  private studentRepository = new StudentRepository();

  constructor() {
    super("backend-student-service");
  }
  /**
   * Retrieves the full profile for a student.
   * Maps database fields to the StudentProfileDTO.
   *
   * @param email - Student's email address
   * @returns Promise<StudentProfileDTO>
   * @throws DomainError if profile is not found
   */
  async getProfile(email: string): Promise<StudentProfileDTO> {
    this.logger.debug({ email }, "Fetching student profile");
    try {
      const profile = await this.studentRepository.findProfileByEmail(email);
      if (!profile) {
        throw new DomainError(
          "Student profile not found",
          ERROR_CODES.STUDENT_NOT_FOUND,
          404
        );
      }

      const result = {
        id: profile.id,
        student_id: profile.student_id,
        fullName: profile.full_name,
        email: profile.email,
        gpa: profile.gpa || 0,
        degreeProgram: profile.degreeProgram?.name || "N/A",
        degreeProgramId: (profile as any).degreeProgramId || 0,
        currentAcademicYear: profile.currentAcademicYear || "N/A",
        level: profile.level || 0,
        isLibraryRegistered: profile.isLibraryRegistered ?? false,
      };
      return result;
    } catch (err) {
      if (err instanceof DomainError) throw err;
      if (err instanceof RepositoryError) throw err;
      throw new DomainError(
        "Failed to get profile",
        ERROR_CODES.INTERNAL_ERROR,
        500
      );
    }
  }

  async getCourses(
    email: string,
    filters?: { semester?: number; year?: string }
  ): Promise<CourseDTO[]> {
    this.logger.debug({ email, filters }, "Fetching student courses");
    try {
      const profile = await this.studentRepository.findProfileByEmail(email);
      if (!profile) {
        throw new DomainError(
          "Student profile not found",
          ERROR_CODES.STUDENT_NOT_FOUND,
          404
        );
      }

      const enrollments = await this.studentRepository.findEnrollments(
        profile.id,
        filters
      );

      const result = enrollments.map((enrollment: any) => ({
        enrollmentId: enrollment.id,
        courseId: enrollment.courseOffering.course.id,
        code: enrollment.courseOffering.course.code,
        name: enrollment.courseOffering.course.name,
        description:
          enrollment.courseOffering.course.description ||
          "No description available",
        credits: enrollment.courseOffering.course.credits,
        status: "ENROLLED",
        semester: enrollment.courseOffering.semester,
        academicYear: enrollment.courseOffering.academicYear,
        level: enrollment.courseOffering.level,
      }));
      return result;
    } catch (err) {
      if (err instanceof DomainError) throw err;
      if (err instanceof RepositoryError) throw err;
      throw new DomainError(
        "Failed to get courses",
        ERROR_CODES.INTERNAL_ERROR,
        500
      );
    }
  }

  async getGrades(email: string): Promise<GradeDTO[]> {
    this.logger.debug({ email }, "Fetching student grades");
    try {
      const profile = await this.studentRepository.findProfileByEmail(email);
      if (!profile) {
        throw new DomainError(
          "Student profile not found",
          ERROR_CODES.STUDENT_NOT_FOUND,
          404
        );
      }

      const enrollments = await this.studentRepository.findEnrollments(
        profile.id
      );

      const result = enrollments.map((enrollment: any) => ({
        courseCode: enrollment.courseOffering.course.code,
        courseName: enrollment.courseOffering.course.name,
        grade: enrollment.grade || "N/A",
        semester: enrollment.courseOffering.semester,
        yearLevelTaken: enrollment.courseOffering.level,
        academicYearTaken: enrollment.courseOffering.academicYear,
        credits: enrollment.courseOffering.course.credits,
        type: "Core",
      }));
      return result;
    } catch (err) {
      if (err instanceof DomainError) throw err;
      if (err instanceof RepositoryError) throw err;
      throw new DomainError(
        "Failed to get grades",
        ERROR_CODES.INTERNAL_ERROR,
        500
      );
    }
  }

  async getBorrowedBooks(email: string): Promise<BorrowedBookDTO[]> {
    this.logger.debug({ email }, "Fetching borrowed books");
    try {
      const profile = await this.studentRepository.findProfileByEmail(email);
      if (!profile) {
        throw new DomainError(
          "Student profile not found",
          ERROR_CODES.STUDENT_NOT_FOUND,
          404
        );
      }

      const records = await this.studentRepository.findBorrowRecords(
        profile.id
      );

      const result = records.map((record: any) => ({
        recordId: record.id,
        bookId: record.book.id,
        title: record.book.title,
        author: record.book.author,
        dueDate: record.due_date,
        borrowDate: record.borrow_date,
        returnDate: record.return_date,
        status: record.status,
        isbn: "978-0000000000",
        publisher: "Unknown Publisher",
        year: 2020,
        description: "Book description not available.",
      }));
      return result;
    } catch (err) {
      if (err instanceof DomainError) throw err;
      if (err instanceof RepositoryError) throw err;
      throw new DomainError(
        "Failed to get borrowed books",
        ERROR_CODES.INTERNAL_ERROR,
        500
      );
    }
  }

  async getPaginatedStudents(
    filters: StudentFiltersDTO
  ): Promise<PaginatedStudentsDTO> {
    this.logger.debug({ filters }, "Fetching paginated students");
    try {
      const page = filters.page || 1;
      const limit = filters.limit || 10;
      const query = filters.query || filters.search;

      const { total, students } =
        await this.studentRepository.findPaginatedStudents({
          ...filters,
          query,
          page,
          limit,
        });

      const studentDTOs: StudentProfileDTO[] = students.map((student: any) => ({
        id: student.id,
        student_id: student.student_id,
        fullName: student.full_name,
        email: student.user.email,
        gpa: student.gpa || 0,
        degreeProgram: student.degreeProgram?.name || "N/A",
        degreeProgramId: student.degreeProgramId,
        currentAcademicYear: student.currentAcademicYear,
        level: student.level,
        isLibraryRegistered: student.isLibraryRegistered,
      }));

      const result = {
        students: studentDTOs,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };

      return result;
    } catch (err) {
      if (err instanceof DomainError) throw err;
      if (err instanceof RepositoryError) throw err;
      throw new DomainError(
        "Failed to get paginated students",
        ERROR_CODES.INTERNAL_ERROR,
        500
      );
    }
  }

  async getStudentDetailById(id: number): Promise<StudentDetailDTO> {
    this.logger.debug({ id }, "Fetching full student detail");
    try {
      const student = await this.studentRepository.findFullProfileById(id);

      if (!student) {
        throw new DomainError(
          "Student profile not found",
          ERROR_CODES.STUDENT_NOT_FOUND,
          404
        );
      }

      const enrollments = student.enrollments.map((enr: any) => ({
        id: enr.id,
        enrollmentId: enr.id,
        offeringId: enr.courseOfferingId,
        courseId: enr.courseOffering.course.id,
        code: enr.courseOffering.course.code,
        name: enr.courseOffering.course.name,
        description: enr.courseOffering.course.description || "N/A",
        credits: enr.courseOffering.course.credits,
        status: "ENROLLED",
        semester: enr.courseOffering.semester,
        academicYear: enr.courseOffering.academicYear,
        level: enr.courseOffering.level,
        grade: enr.grade,
      }));

      return {
        profile: {
          id: student.id,
          student_id: student.student_id,
          fullName: student.full_name,
          email: student.email,
          gpa: student.gpa || 0,
          degreeProgram: student.degreeProgram,
          degreeProgramId: (student as any).degreeProgramId || 0,
          currentAcademicYear: student.currentAcademicYear,
          level: student.level,
          isLibraryRegistered: student.isLibraryRegistered,
        },
        enrollments,
      };
    } catch (err) {
      if (err instanceof DomainError) throw err;
      if (err instanceof RepositoryError) throw err;
      throw new DomainError(
        "Failed to get student details",
        ERROR_CODES.INTERNAL_ERROR,
        500
      );
    }
  }

  async createStudent(data: StudentCreateDTO): Promise<StudentProfileDTO> {
    this.logger.debug({ username: data.username }, "Creating new student");
    try {
      // 1. Create user in WSO2 SCIM2
      const wso2Id = await identityService.createUser({
        userName: data.username,
        emails: [data.email],
        name: {
          givenName: data.fullName.split(" ")[0] || "",
          familyName: data.fullName.split(" ").slice(1).join(" ") || "Student",
        },
      });

      // 2. Assign to ROLE_STUDENT group in WSO2
      await identityService.addUserToGroup(wso2Id, "Students", data.username);

      // 3. Generate invitation
      try {
        await identityService.generateInviteLink(data.email);
      } catch (err) {
        this.logger.warn(
          { err },
          "Failed to generate invite link, but student created"
        );
      }

      // 4. Save to database
      const profile = await this.studentRepository.create({
        user: {
          username: data.username,
          email: data.email,
          role: "student",
          wso2_id: wso2Id,
        },
        profile: {
          student_id: data.studentId,
          full_name: data.fullName,
          degreeProgramId: data.degreeProgramId,
          currentAcademicYear: data.currentAcademicYear,
          level: data.level,
        },
      });

      return {
        id: profile.id,
        student_id: profile.student_id,
        fullName: profile.full_name,
        email: profile.user.email,
        gpa: profile.gpa || 0,
        degreeProgram: profile.degreeProgram?.name || "N/A",
        degreeProgramId: profile.degreeProgramId,
        currentAcademicYear: profile.currentAcademicYear,
        level: profile.level,
        isLibraryRegistered: profile.isLibraryRegistered,
      };
    } catch (err) {
      if (err instanceof DomainError) throw err;
      if (err instanceof RepositoryError) throw err;
      throw new DomainError(
        "Failed to create student",
        ERROR_CODES.INTERNAL_ERROR,
        500
      );
    }
  }

  async updateStudent(
    id: number,
    data: StudentUpdateDTO
  ): Promise<StudentProfileDTO> {
    this.logger.debug({ id }, "Updating student profile");
    try {
      // 1. Fetch current profile
      const current = await this.studentRepository.findById(id);
      if (!current) {
        throw new DomainError(
          "Student not found",
          ERROR_CODES.STUDENT_NOT_FOUND,
          404
        );
      }

      // 2. Update local DB
      const updated = await this.studentRepository.update(id, {
        full_name: data.fullName,
        degreeProgramId: data.degreeProgramId,
        currentAcademicYear: data.currentAcademicYear,
        level: data.level,
      });

      // 3. Sync name changes to WSO2
      if (data.fullName && data.fullName !== current.full_name) {
        try {
          await identityService.updateUser(current.user.wso2_id, {
            name: {
              givenName: data.fullName.split(" ")[0] || "",
              familyName:
                data.fullName.split(" ").slice(1).join(" ") || "Student",
            },
          });
        } catch (err) {
          this.logger.warn(
            { err },
            "Failed to sync name change to Identity Server"
          );
        }
      }

      return {
        id: updated.id,
        student_id: updated.student_id,
        fullName: updated.full_name,
        email: updated.user.email,
        gpa: updated.gpa || 0,
        degreeProgram: updated.degreeProgram?.name || "N/A",
        degreeProgramId: updated.degreeProgramId,
        currentAcademicYear: updated.currentAcademicYear,
        level: updated.level,
        isLibraryRegistered: updated.isLibraryRegistered,
      };
    } catch (err) {
      if (err instanceof DomainError) throw err;
      if (err instanceof RepositoryError) throw err;
      throw new DomainError(
        "Failed to update student",
        ERROR_CODES.INTERNAL_ERROR,
        500
      );
    }
  }

  async deleteStudent(id: number): Promise<void> {
    this.logger.warn({ id }, "Deleting student");
    try {
      // 1. Fetch student to get WSO2 ID
      const student = await this.studentRepository.findById(id);
      if (!student) {
        throw new DomainError(
          "Student not found",
          ERROR_CODES.STUDENT_NOT_FOUND,
          404
        );
      }

      // 2. Delete from WSO2 Identity Server
      try {
        if (student.user.wso2_id) {
          await identityService.deleteUser(student.user.wso2_id);
        }
      } catch (error) {
        this.logger.error(
          { error, wso2_id: student.user.wso2_id },
          "Failed to delete user from WSO2, proceeding with local delete"
        );
      }

      // 3. Delete from Local Database
      await this.studentRepository.delete(id);
    } catch (err) {
      if (err instanceof DomainError) throw err;
      if (err instanceof RepositoryError) throw err;
      throw new DomainError(
        "Failed to delete student",
        ERROR_CODES.INTERNAL_ERROR,
        500
      );
    }
  }
}

export const studentService = new StudentService();
