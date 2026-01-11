// Author: Udara Shanuka (Modified by System)
// Project: University-Portal
// FP-ID: FP-20260105-US-SERVICE-COURSE-V2
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2026-01-05T11:15:00Z

const __FP_SIG = "FP-20260105-US-SERVICE-COURSE-V2|HASH-PLACEHOLDER";

import prisma from "../../../lib/db";
import { BaseService } from "../../../common/services/base.service";
import { AcademicCourseDTO } from "../academics.dto";
import { DomainError, ERROR_CODES, RepositoryError } from "../../../errors";

/**
 * Service: Course Management
 *
 * Handles operations related to academic courses including creation,
 * retrieval, updating, and deletion.
 */
export class CourseService extends BaseService {
  constructor() {
    super("backend-course-service");
  }

  // ===========================================================================
  // Courses
  // ===========================================================================

  /**
   * Retrieves a paginated list of courses with optional filters.
   *
   * @param departmentId - Filter by department ID
   * @param page - Page number (default: 1)
   * @param limit - Items per page (default: 10)
   * @param search - Search query for name or code
   * @param facultyId - Filter by faculty ID
   * @returns Promise<{ data: AcademicCourseDTO[]; total: number }>
   */
  async getCourses(
    departmentId?: number,
    page: number = 1,
    limit: number = 10,
    search?: string,
    facultyId?: number
  ): Promise<{ data: AcademicCourseDTO[]; total: number }> {
    this.logger.debug(
      { departmentId, page, limit, search, facultyId },
      "Fetching courses"
    );
    try {
      const where: any = {};
      if (departmentId) where.departmentId = departmentId;
      if (facultyId)
        where.department = {
          facultyId: facultyId,
        };

      if (search) {
        where.OR = [
          { name: { contains: search } },
          { code: { contains: search } },
        ];
      }

      const [total, courses] = await Promise.all([
        prisma.course.count({ where }),
        prisma.course.findMany({
          where,
          include: { department: true },
          skip: (page - 1) * limit,
          take: limit,
        }),
      ]);

      const data = courses.map((c: any) => ({
        id: c.id,
        departmentId: c.departmentId,
        code: c.code,
        name: c.name,
        credits: c.credits,
        description: c.description,
        departmentName: c.department.name,
      }));

      return { data, total };
    } catch (err) {
      if (err instanceof DomainError) throw err;
      throw new RepositoryError(
        "Failed to fetch courses",
        ERROR_CODES.DB_FAILURE
      );
    }
  }

  /**
   * Searches for courses matching the query string.
   *
   * @param query - Search string for course name or code
   * @returns Promise<AcademicCourseDTO[]>
   */
  async searchCourses(query: string): Promise<AcademicCourseDTO[]> {
    this.logger.debug({ query }, "Searching courses");
    try {
      const courses = await prisma.course.findMany({
        where: {
          OR: [{ name: { contains: query } }, { code: { contains: query } }],
        },
        include: { department: true },
        take: 10,
      });
      return courses.map((c: any) => ({
        id: c.id,
        departmentId: c.departmentId,
        code: c.code,
        name: c.name,
        credits: c.credits,
        description: c.description,
        departmentName: c.department.name,
      }));
    } catch (err) {
      throw new RepositoryError(
        "Failed to search courses",
        ERROR_CODES.DB_FAILURE
      );
    }
  }

  /**
   * Creates a new academic course.
   *
   * @param data - Course creation data
   * @returns Promise<AcademicCourseDTO>
   * @throws DomainError if department is not found
   */
  async createCourse(data: {
    departmentId: number;
    code: string;
    name: string;
    credits: number;
    description?: string;
  }): Promise<AcademicCourseDTO> {
    this.logger.info({ data }, "Creating course");
    try {
      const dept = await prisma.department.findUnique({
        where: { id: data.departmentId },
      });
      if (!dept)
        throw new DomainError(
          "Department not found",
          ERROR_CODES.DEPARTMENT_NOT_FOUND,
          404
        );

      const course = await prisma.course.create({
        data,
        include: { department: true },
      });
      return {
        id: course.id,
        departmentId: course.departmentId,
        code: course.code,
        name: course.name,
        credits: course.credits,
        description: course.description,
        departmentName: course.department.name,
      };
    } catch (err) {
      if (err instanceof DomainError) throw err;
      // Handle unique constraint violation for course code if needed, assuming P2002
      if ((err as any).code === "P2002") {
        throw new DomainError(
          "Course code already exists",
          ERROR_CODES.COURSE_ALREADY_EXISTS,
          400
        );
      }
      throw new RepositoryError(
        "Failed to create course",
        ERROR_CODES.DB_FAILURE
      );
    }
  }

  /**
   * Retrieves a specific course by ID.
   *
   * @param id - Course ID
   * @returns Promise<AcademicCourseDTO>
   * @throws DomainError if course is not found
   */
  async getCourse(id: number): Promise<AcademicCourseDTO> {
    try {
      const course = await prisma.course.findUnique({
        where: { id },
        include: { department: true },
      });
      if (!course)
        throw new DomainError(
          "Course not found",
          ERROR_CODES.COURSE_NOT_FOUND,
          404
        );
      return {
        id: course.id,
        departmentId: course.departmentId,
        code: course.code,
        name: course.name,
        credits: course.credits,
        description: course.description,
        departmentName: course.department.name,
      };
    } catch (err) {
      if (err instanceof DomainError) throw err;
      throw new RepositoryError("Failed to get course", ERROR_CODES.DB_FAILURE);
    }
  }

  /**
   * Updates an existing course.
   *
   * @param id - Course ID
   * @param data - Data to update
   * @returns Promise<AcademicCourseDTO>
   */
  async updateCourse(
    id: number,
    data: {
      departmentId?: number;
      code?: string;
      name?: string;
      credits?: number;
      description?: string;
    }
  ): Promise<AcademicCourseDTO> {
    this.logger.info({ id, data }, "Updating course");
    try {
      const course = await prisma.course.update({
        where: { id },
        data,
        include: { department: true },
      });
      return {
        id: course.id,
        departmentId: course.departmentId,
        code: course.code,
        name: course.name,
        credits: course.credits,
        description: course.description,
        departmentName: course.department.name,
      };
    } catch (err) {
      if ((err as any).code === "P2025") {
        throw new DomainError(
          "Course not found",
          ERROR_CODES.COURSE_NOT_FOUND,
          404
        );
      }
      throw new RepositoryError(
        "Failed to update course",
        ERROR_CODES.DB_FAILURE
      );
    }
  }

  /**
   * Deletes a course by ID.
   *
   * @param id - Course ID
   */
  async deleteCourse(id: number): Promise<void> {
    this.logger.info({ id }, "Deleting course");
    try {
      await prisma.course.delete({ where: { id } });
    } catch (err) {
      if ((err as any).code === "P2025") {
        throw new DomainError(
          "Course not found",
          ERROR_CODES.COURSE_NOT_FOUND,
          404
        );
      }
      throw new RepositoryError(
        "Failed to delete course",
        ERROR_CODES.DB_FAILURE
      );
    }
  }
}

export const courseService = new CourseService();
