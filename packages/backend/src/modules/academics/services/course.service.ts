// Author: Udara Shanuka
// Project: University-Portal
// FP-ID: FP-20251230-US-SERVICE-COURSE
// Generated: 2025-12-30

import prisma from "../../../lib/db";
import { AppError } from "../../../common/utils/errors/app-error";
import { BaseService } from "../../../common/services/base.service";
import { AcademicCourseDTO } from "../academics.dto";

export class CourseService extends BaseService {
  constructor() {
    super("backend-course-service");
  }

  // ===========================================================================
  // Courses
  // ===========================================================================

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

    const data = courses.map((c) => ({
      id: c.id,
      departmentId: c.departmentId,
      code: c.code,
      name: c.name,
      credits: c.credits,
      description: c.description,
      departmentName: c.department.name,
    }));

    return { data, total };
  }

  async searchCourses(query: string): Promise<AcademicCourseDTO[]> {
    this.logger.debug({ query }, "Searching courses");
    const courses = await prisma.course.findMany({
      where: {
        OR: [{ name: { contains: query } }, { code: { contains: query } }],
      },
      include: { department: true },
      take: 10,
    });
    return courses.map((c) => ({
      id: c.id,
      departmentId: c.departmentId,
      code: c.code,
      name: c.name,
      credits: c.credits,
      description: c.description,
      departmentName: c.department.name,
    }));
  }

  async createCourse(data: {
    departmentId: number;
    code: string;
    name: string;
    credits: number;
    description?: string;
  }): Promise<AcademicCourseDTO> {
    this.logger.info({ data }, "Creating course");
    const dept = await prisma.department.findUnique({
      where: { id: data.departmentId },
    });
    if (!dept) throw new AppError("Department not found", 404);

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
  }

  async getCourse(id: number): Promise<AcademicCourseDTO> {
    const course = await prisma.course.findUnique({
      where: { id },
      include: { department: true },
    });
    if (!course) throw new AppError("Course not found", 404);
    return {
      id: course.id,
      departmentId: course.departmentId,
      code: course.code,
      name: course.name,
      credits: course.credits,
      description: course.description,
      departmentName: course.department.name,
    };
  }

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
  }

  async deleteCourse(id: number): Promise<void> {
    this.logger.info({ id }, "Deleting course");
    await prisma.course.delete({ where: { id } });
  }
}

export const courseService = new CourseService();
