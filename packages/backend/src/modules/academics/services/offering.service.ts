// Author: Udara Shanuka
// Project: University-Portal
// FP-ID: FP-20251230-US-SERVICE-OFFERING
// Generated: 2025-12-30

import prisma from "../../../lib/db";
import { AppError } from "../../../common/utils/errors/app-error";
import { BaseService } from "../../../common/services/base.service";
import { CourseOfferingDTO } from "../academics.dto";

export class OfferingService extends BaseService {
  constructor() {
    super("backend-offering-service");
  }

  // ===========================================================================
  // Course Offerings
  // ===========================================================================

  async createCourseOffering(data: {
    courseId: number;
    academicYear: string;
    semester: number;
    level: number;
  }): Promise<CourseOfferingDTO> {
    this.logger.info({ data }, "Creating course offering");
    const course = await prisma.course.findUnique({
      where: { id: data.courseId },
    });
    if (!course) throw new AppError("Course not found", 404);

    // Check for duplicate
    const existing = await prisma.courseOffering.findFirst({
      where: {
        courseId: data.courseId,
        academicYear: data.academicYear,
        semester: data.semester,
      },
    });
    if (existing)
      throw new AppError("Course offering already exists for this term", 400);

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
    return prisma.courseOffering.update({
      where: { id },
      data,
    });
  }

  async deleteCourseOffering(id: number): Promise<void> {
    this.logger.debug({ id }, "Deleting course offering");
    // Optionally check if there are enrollments before deleting?
    // For now assuming hard delete or cascade if configured, or simple delete.
    await prisma.courseOffering.delete({
      where: { id },
    });
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

    const data = offerings.map((o) => ({
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
  }

  async getAcademicYears(): Promise<string[]> {
    const years = await prisma.courseOffering.findMany({
      select: { academicYear: true },
      distinct: ["academicYear"],
      orderBy: { academicYear: "desc" },
    });
    return years.map((y) => y.academicYear);
  }

  async getCourseOfferingById(
    id: number
  ): Promise<CourseOfferingDTO & { enrollments: any[] }> {
    this.logger.debug({ id }, "Fetching course offering details");
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

    if (!offering) throw new AppError("Course offering not found", 404);

    return {
      id: offering.id,
      courseId: offering.courseId,
      courseCode: offering.course.code,
      courseName: offering.course.name,
      academicYear: offering.academicYear,
      semester: offering.semester,
      level: offering.level,
      enrolledCount: offering.enrollments.length,
      enrollments: offering.enrollments.map((e) => ({
        id: e.id,
        studentId: e.studentProfile.student_id,
        studentName: e.studentProfile.full_name,
        grade: e.grade,
        createdAt: e.createdAt,
      })),
    } as any;
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

    // Find Student
    const student = await prisma.studentProfile.findUnique({
      where: { student_id: data.studentId },
    });
    if (!student)
      throw new AppError(`Student with ID ${data.studentId} not found`, 404);

    // Verify Offering
    const offering = await prisma.courseOffering.findUnique({
      where: { id: data.offeringId },
    });
    if (!offering) throw new AppError("Course offering not found", 404);

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
  }

  async searchStudents(query: string): Promise<any[]> {
    this.logger.debug({ query }, "Searching students");
    const students = await prisma.studentProfile.findMany({
      where: {
        OR: [
          { full_name: { contains: query } },
          { student_id: { contains: query } },
        ],
      },
      take: 10,
    });
    return students.map((s) => ({
      id: s.id,
      studentId: s.student_id,
      name: s.full_name,
      degreeProgramId: s.degreeProgramId,
    }));
  }

  async deleteEnrollment(enrollmentId: number) {
    this.logger.info({ enrollmentId }, "Deleting enrollment");
    return prisma.enrollment.delete({
      where: { id: enrollmentId },
    });
  }
}

export const offeringService = new OfferingService();
