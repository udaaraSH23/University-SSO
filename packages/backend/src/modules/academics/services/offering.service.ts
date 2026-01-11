// Author: Udara Shanuka (Modified by System)
// Project: University-Portal
// FP-ID: FP-20260105-US-SERVICE-OFFERING-V2
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2026-01-05T11:20:00Z

const __FP_SIG = "FP-20260105-US-SERVICE-OFFERING-V2|HASH-PLACEHOLDER";

import prisma from "../../../lib/db";
import { BaseService } from "../../../common/services/base.service";
import { CourseOfferingDTO } from "../academics.dto";
import { SearchStudentResult } from "../../student/student.dto";
import { DomainError, ERROR_CODES, RepositoryError } from "../../../errors";

/**
 * Service: Course Offering Management
 *
 * Handles lifecycle of course offerings (sessions), student enrollments,
 * and related academic operations.
 */
export class OfferingService extends BaseService {
  constructor() {
    super("backend-offering-service");
  }

  // ===========================================================================
  // Course Offerings
  // ===========================================================================

  /**
   * Creates a new course offering for a specific academic term.
   *
   * @param data - Offering creation data
   * @returns Promise<CourseOfferingDTO>
   * @throws DomainError if course is not found or offering already exists
   */
  async createCourseOffering(data: {
    courseId: number;
    academicYear: string;
    semester: number;
    level: number;
  }): Promise<CourseOfferingDTO> {
    this.logger.info({ data }, "Creating course offering");
    try {
      const course = await prisma.course.findUnique({
        where: { id: data.courseId },
      });
      if (!course)
        throw new DomainError(
          "Course not found",
          ERROR_CODES.COURSE_NOT_FOUND,
          404
        );

      // Check for duplicate
      const existing = await prisma.courseOffering.findFirst({
        where: {
          courseId: data.courseId,
          academicYear: data.academicYear,
          semester: data.semester,
        },
      });
      if (existing)
        throw new DomainError(
          "Course offering already exists for this term",
          ERROR_CODES.OFFERING_ALREADY_EXISTS,
          400
        );

      const offering = await prisma.courseOffering.create({
        data,
        include: { course: true },
      });

      return {
        id: offering.id,
        courseId: offering.courseId,
        courseCode: offering.course.code,
        courseName: offering.course.name,
        academicYear: offering.academicYear,
        semester: offering.semester,
        level: offering.level,
        enrolledCount: 0,
      };
    } catch (err) {
      if (err instanceof DomainError) throw err;
      throw new RepositoryError(
        "Failed to create course offering",
        ERROR_CODES.DB_FAILURE
      );
    }
  }

  async updateCourseOffering(
    id: number,
    data: {
      semester?: number;
      academicYear?: string;
      level?: number;
    }
  ) {
    this.logger.debug({ id, data }, "Updating course offering");
    try {
      return await prisma.courseOffering.update({
        where: { id },
        data,
      });
    } catch (err) {
      if ((err as any).code === "P2025") {
        throw new DomainError(
          "Course offering not found",
          ERROR_CODES.OFFERING_NOT_FOUND,
          404
        );
      }
      throw new RepositoryError(
        "Failed to update course offering",
        ERROR_CODES.DB_FAILURE
      );
    }
  }

  async deleteCourseOffering(id: number): Promise<void> {
    this.logger.debug({ id }, "Deleting course offering");
    try {
      await prisma.courseOffering.delete({
        where: { id },
      });
    } catch (err) {
      if ((err as any).code === "P2025") {
        throw new DomainError(
          "Course offering not found",
          ERROR_CODES.OFFERING_NOT_FOUND,
          404
        );
      }
      throw new RepositoryError(
        "Failed to delete course offering",
        ERROR_CODES.DB_FAILURE
      );
    }
  }

  async getCourseOfferings(filters?: {
    academicYear?: string;
    semester?: number;
    level?: number;
    search?: string;
    page?: number;
    limit?: number;
    degreeProgramId?: number;
  }): Promise<{
    data: CourseOfferingDTO[];
    metadata: { total: number; page: number; totalPages: number };
  }> {
    this.logger.debug({ filters }, "Fetching course offerings with pagination");
    try {
      // Default pagination
      const page = filters?.page || 1;
      const limit = filters?.limit || 10;
      const skip = (page - 1) * limit;

      const where: any = {};
      if (filters?.academicYear && filters.academicYear !== "All Years")
        where.academicYear = filters.academicYear;
      if (filters?.semester) where.semester = filters.semester;
      if (filters?.level) where.level = filters.level;
      if (filters?.search) {
        where.OR = [
          { course: { name: { contains: filters.search } } },
          { course: { code: { contains: filters.search } } },
        ];
      }

      // Filter by Degree Program (Department)
      if (filters?.degreeProgramId) {
        const degreeProgram = await prisma.degreeProgram.findUnique({
          where: { id: filters.degreeProgramId },
          select: { departmentId: true },
        });

        if (degreeProgram) {
          where.course = {
            ...where.course, // Preserve existing course filters (like search)
            departmentId: degreeProgram.departmentId,
          };
        }
      }

      const [total, offerings] = await Promise.all([
        prisma.courseOffering.count({ where }),
        prisma.courseOffering.findMany({
          where,
          include: {
            course: true,
            _count: {
              select: { enrollments: true },
            },
          },
          orderBy: { createdAt: "desc" },
          skip,
          take: limit,
        }),
      ]);

      const data = offerings.map((o: any) => ({
        id: o.id,
        courseId: o.courseId,
        courseCode: o.course.code,
        courseName: o.course.name,
        academicYear: o.academicYear,
        semester: o.semester,
        level: o.level,
        enrolledCount: o._count.enrollments,
      }));

      return {
        data,
        metadata: {
          total,
          page,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (err) {
      if (err instanceof DomainError) throw err;
      throw new RepositoryError(
        "Failed to fetch course offerings",
        ERROR_CODES.DB_FAILURE
      );
    }
  }

  async getAcademicYears(): Promise<string[]> {
    try {
      const years = await prisma.courseOffering.findMany({
        select: { academicYear: true },
        distinct: ["academicYear"],
        orderBy: { academicYear: "desc" },
      });
      return years.map((y: any) => y.academicYear);
    } catch (err) {
      throw new RepositoryError(
        "Failed to fetch academic years",
        ERROR_CODES.DB_FAILURE
      );
    }
  }

  async getCourseOfferingById(
    id: number
  ): Promise<CourseOfferingDTO & { enrollments: any[] }> {
    this.logger.debug({ id }, "Fetching course offering details");
    try {
      const offering = await prisma.courseOffering.findUnique({
        where: { id },
        include: {
          course: {
            include: { department: true },
          },
          enrollments: {
            include: {
              studentProfile: true,
            },
          },
        },
      });

      if (!offering)
        throw new DomainError(
          "Course offering not found",
          ERROR_CODES.OFFERING_NOT_FOUND,
          404
        );

      return {
        id: offering.id,
        courseId: offering.courseId,
        courseCode: offering.course.code,
        courseName: offering.course.name,
        academicYear: offering.academicYear,
        semester: offering.semester,
        level: offering.level,
        enrolledCount: offering.enrollments.length,
        enrollments: offering.enrollments.map((e: any) => ({
          id: e.id,
          studentId: e.studentProfile.student_id,
          studentName: e.studentProfile.full_name,
          grade: e.grade,
          createdAt: e.createdAt,
        })),
      } as any;
    } catch (err) {
      if (err instanceof DomainError) throw err;
      throw new RepositoryError(
        "Failed to get course offering details",
        ERROR_CODES.DB_FAILURE
      );
    }
  }

  // ===========================================================================
  // Enrollments
  // ===========================================================================

  async enrollStudent(data: {
    offeringId: number;
    studentId: string;
    grade: string;
  }) {
    this.logger.info({ data }, "Enrolling student");

    try {
      // Find Student
      const student = await prisma.studentProfile.findUnique({
        where: { student_id: data.studentId },
      });
      if (!student)
        throw new DomainError(
          `Student with ID ${data.studentId} not found`,
          ERROR_CODES.STUDENT_NOT_FOUND,
          404
        );

      // Verify Offering
      const offering = await prisma.courseOffering.findUnique({
        where: { id: data.offeringId },
      });
      if (!offering)
        throw new DomainError(
          "Course offering not found",
          ERROR_CODES.OFFERING_NOT_FOUND,
          404
        );

      const enrollment = await prisma.enrollment.upsert({
        where: {
          studentProfileId_courseOfferingId: {
            studentProfileId: student.id,
            courseOfferingId: data.offeringId,
          },
        },
        update: {
          grade: data.grade,
        },
        create: {
          studentProfileId: student.id,
          courseOfferingId: data.offeringId,
          grade: data.grade,
        },
        include: { studentProfile: true },
      });

      return enrollment;
    } catch (err) {
      if (err instanceof DomainError) throw err;
      throw new RepositoryError(
        "Failed to enroll student",
        ERROR_CODES.DB_FAILURE
      );
    }
  }

  async searchStudents(query: string): Promise<SearchStudentResult[]> {
    this.logger.debug({ query }, "Searching students");
    try {
      const students = await prisma.studentProfile.findMany({
        where: {
          OR: [
            { full_name: { contains: query } },
            { student_id: { contains: query } },
          ],
        },
        take: 10,
      });
      return students.map((s: any) => ({
        id: s.id,
        studentId: s.student_id,
        name: s.full_name,
        degreeProgramId: s.degreeProgramId,
      }));
    } catch (err) {
      throw new RepositoryError(
        "Failed to search students",
        ERROR_CODES.DB_FAILURE
      );
    }
  }

  async deleteEnrollment(enrollmentId: number) {
    this.logger.info({ enrollmentId }, "Deleting enrollment");
    try {
      return await prisma.enrollment.delete({
        where: { id: enrollmentId },
      });
    } catch (err) {
      throw new RepositoryError(
        "Failed to delete enrollment",
        ERROR_CODES.DB_FAILURE
      );
    }
  }

  async updateStudentEnrollment(
    enrollmentId: number,
    data: { grade?: string }
  ): Promise<void> {
    this.logger.info({ enrollmentId, data }, "Updating student enrollment");
    try {
      await prisma.enrollment.update({
        where: { id: enrollmentId },
        data: {
          grade: data.grade,
        },
      });
    } catch (err) {
      throw new RepositoryError(
        "Failed to update student enrollment",
        ERROR_CODES.DB_FAILURE
      );
    }
  }

  async deleteStudentEnrollment(enrollmentId: number): Promise<void> {
    await this.deleteEnrollment(enrollmentId);
  }
}

export const offeringService = new OfferingService();
