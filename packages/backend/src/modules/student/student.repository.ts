// Author: Udara Shanuka (Modified by System)
// Project: University-Portal
// FP-ID: FP-20260105-REPO-STUDENT-V2
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2026-01-05T11:00:00Z

import prisma from "../../lib/db";
import { createLogger } from "@repo/logger";
import { RepositoryError, ERROR_CODES } from "../../errors";

const logger = createLogger({ service: "backend-student-repo" });

const __FP_SIG = "FP-20260105-REPO-STUDENT-V2|HASH-PLACEHOLDER";

/**
 * Repository: Student Data Access
 *
 * Handles direct database interactions for student-related data using Prisma.
 * Strictly focuses on data retrieval without business logic.
 */
export class StudentRepository {
  /**
   * Finds a student profile by their email address.
   * Includes the associated degree program.
   *
   * @param email - The email of the user
   * @returns StudentProfile with DegreeProgram or null
   * @throws RepositoryError on database failure
   */
  async findProfileByEmail(email: string) {
    logger.debug({ email }, "findProfileByEmail called");
    try {
      const user = await prisma.user.findUnique({
        where: { email },
        select: {
          email: true,
          studentProfile: {
            select: {
              id: true,
              student_id: true,
              full_name: true,
              gpa: true,
              currentAcademicYear: true,
              level: true,
              degreeProgramId: true,
              isLibraryRegistered: true,
              degreeProgram: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });

      if (!user || !user.studentProfile) return null;

      // Merge User email into the profile result for consistency with previous usage
      const result = {
        ...user.studentProfile,
        email: user.email,
        degreeProgram: user.studentProfile.degreeProgram,
      };
      logger.debug(
        { result, layer: "Repository" },
        "[StudentRepository] findProfileByEmail returning"
      );
      return result;
    } catch (error) {
      logger.error({ error, email }, "Failed to find profile by email");
      throw new RepositoryError(
        "Failed to find profile by email",
        ERROR_CODES.DB_FAILURE
      );
    }
  }

  /**
   * Finds course enrollments for a specific student profile.
   * Supports filtering by semester and academic year.
   *
   * @param studentProfileId - The ID of the student's profile
   * @param filters - Optional filters object
   * @returns Array of Enrollment records with Course details
   * @throws RepositoryError on database failure
   */
  async findEnrollments(
    studentProfileId: number,
    filters?: { semester?: number; year?: string }
  ) {
    logger.debug({ studentProfileId, filters }, "findEnrollments called");
    try {
      const whereClause: any = {
        studentProfileId: studentProfileId,
      };

      const courseOfferingWhere: any = {};

      if (filters?.semester) {
        courseOfferingWhere.semester = Number(filters.semester);
      }

      if (filters?.year) {
        const yearInt = parseInt(filters.year);
        if (!isNaN(yearInt)) {
          // If 1, 2, 3, 4 -> Filter by Level
          courseOfferingWhere.level = yearInt;
        } else {
          // If "2024-2025" -> Filter by Academic Year
          courseOfferingWhere.academicYear = filters.year;
        }
      }

      // Only add courseOffering filter if it's not empty
      if (Object.keys(courseOfferingWhere).length > 0) {
        whereClause.courseOffering = courseOfferingWhere;
      }

      const result = await prisma.enrollment.findMany({
        where: whereClause,
        select: {
          grade: true,
          courseOffering: {
            select: {
              semester: true,
              academicYear: true,
              level: true,
              course: {
                select: {
                  id: true,
                  code: true,
                  name: true,
                  credits: true,
                  description: true,
                },
              },
            },
          },
        },
      });
      logger.debug(
        { count: result.length, result, layer: "Repository" },
        "[StudentRepository] findEnrollments returning"
      );
      return result;
    } catch (error) {
      logger.error(
        { error, studentProfileId, filters },
        "Failed to find enrollments"
      );
      throw new RepositoryError(
        "Failed to find enrollments",
        ERROR_CODES.DB_FAILURE
      );
    }
  }

  /**
   * Finds active borrow records for a student.
   * Defaults to fetching currently 'BORROWED' books.
   *
   * @param studentProfileId - The ID of the student's profile
   * @param status - Status of the borrow record (optional)
   * @returns Array of BorrowRecord with Book details
   * @throws RepositoryError on database failure
   */
  async findBorrowRecords(studentProfileId: number, status?: string) {
    logger.debug({ studentProfileId, status }, "findBorrowRecords called");
    try {
      const where: any = {
        studentProfileId: studentProfileId,
      };

      if (status) {
        where.status = status;
      }

      const result = await prisma.borrowRecord.findMany({
        where: where,
        select: {
          id: true,
          borrow_date: true,
          due_date: true,
          return_date: true,
          status: true,
          book: {
            select: {
              id: true,
              title: true,
              author: true,
            },
          },
        },
      });
      logger.debug(
        { count: result.length, result, layer: "Repository" },
        "[StudentRepository] findBorrowRecords returning"
      );
      return result;
    } catch (error) {
      logger.error(
        { error, studentProfileId, status },
        "Failed to find borrow records"
      );
      throw new RepositoryError(
        "Failed to find borrow records",
        ERROR_CODES.DB_FAILURE
      );
    }
  }

  /**
   * Retrieves a paginated list of students with filtering.
   *
   * @param filters - Pagination and search filters
   * @returns Array of StudentProfile with total count
   */
  async findPaginatedStudents(filters: {
    page: number;
    limit: number;
    query?: string;
    level?: number;
    facultyId?: number;
    departmentId?: number;
    degreeProgramId?: number;
    academicYear?: string;
  }) {
    const {
      page,
      limit,
      query,
      level,
      facultyId,
      departmentId,
      degreeProgramId,
      academicYear,
    } = filters;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query) {
      where.OR = [
        { full_name: { contains: query } },
        { student_id: { contains: query } },
        { user: { email: { contains: query } } },
      ];
    }

    if (level) {
      where.level = level;
    }

    if (academicYear) {
      where.currentAcademicYear = academicYear;
    }

    if (degreeProgramId) {
      where.degreeProgramId = degreeProgramId;
    }

    if (facultyId || departmentId) {
      where.degreeProgram = {
        ...(where.degreeProgram || {}), // Preserve existing filter if any
        department: {
          ...(departmentId && { id: departmentId }),
          ...(facultyId && { facultyId: facultyId }),
        },
      };
    }

    try {
      const [total, students] = await Promise.all([
        prisma.studentProfile.count({ where }),
        prisma.studentProfile.findMany({
          where,
          skip,
          take: limit,
          include: {
            user: {
              select: {
                email: true,
              },
            },
            degreeProgram: {
              select: {
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        }),
      ]);

      return { total, students };
    } catch (error) {
      logger.error({ error, filters }, "Failed to find paginated students");
      throw new RepositoryError(
        "Failed to find paginated students",
        ERROR_CODES.DB_FAILURE
      );
    }
  }

  /**
   * Finds a student profile by their ID with full relational data.
   *
   * @param id - The ID of the student profile
   * @returns StudentProfile with full relations or null
   */
  async findFullProfileById(id: number) {
    logger.debug({ id }, "findFullProfileById called");
    try {
      const student = await prisma.studentProfile.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              email: true,
            },
          },
          degreeProgram: {
            select: {
              name: true,
            },
          },
          enrollments: {
            include: {
              courseOffering: {
                include: {
                  course: true,
                },
              },
            },
          },
        },
      });

      if (!student) return null;

      // Map to a consistent format
      return {
        ...student,
        email: student.user.email,
        degreeProgram: student.degreeProgram.name,
      };
    } catch (error) {
      logger.error({ error, id }, "Failed to find full profile by ID");
      throw new RepositoryError(
        "Failed to find full profile by ID",
        ERROR_CODES.DB_FAILURE
      );
    }
  }

  /**
   * Finds a student profile by its ID.
   *
   * @param id - The ID of the student profile
   * @returns StudentProfile with User relation or null
   */
  async findById(id: number) {
    try {
      return await prisma.studentProfile.findUnique({
        where: { id },
        include: {
          user: true,
        },
      });
    } catch (error) {
      logger.error({ error, id }, "Failed to find student by ID");
      throw new RepositoryError(
        "Failed to find student by ID",
        ERROR_CODES.DB_FAILURE
      );
    }
  }

  /**
   * Creates a new student profile and associated user record.
   *
   * @param data - User and Student data
   * @returns The created student profile
   */
  async create(data: {
    user: {
      username: string;
      email: string;
      role: string;
      wso2_id: string;
    };
    profile: {
      student_id: string;
      full_name: string;
      degreeProgramId: number;
      currentAcademicYear: string;
      level: number;
    };
  }) {
    logger.debug(
      { username: data.user.username },
      "Creating student in database"
    );
    try {
      return await prisma.studentProfile.create({
        data: {
          student_id: data.profile.student_id,
          full_name: data.profile.full_name,
          currentAcademicYear: data.profile.currentAcademicYear,
          level: data.profile.level,
          degreeProgram: {
            connect: { id: data.profile.degreeProgramId },
          },
          user: {
            create: {
              username: data.user.username,
              email: data.user.email,
              role: data.user.role,
              wso2_id: data.user.wso2_id,
            },
          },
        },
        include: {
          user: true,
          degreeProgram: true,
        },
      });
    } catch (error) {
      logger.error({ error, data }, "Failed to create student in database");
      throw new RepositoryError(
        "Failed to create student in database",
        ERROR_CODES.DB_FAILURE
      );
    }
  }

  /**
   * Updates an existing student profile.
   *
   * @param id - Student Profile ID
   * @param data - Profile data to update
   * @returns The updated student profile
   */
  async update(
    id: number,
    data: {
      full_name?: string;
      degreeProgramId?: number;
      currentAcademicYear?: string;
      level?: number;
    }
  ) {
    logger.debug({ id }, "Updating student in database");
    try {
      return await prisma.studentProfile.update({
        where: { id },
        data: {
          full_name: data.full_name,
          currentAcademicYear: data.currentAcademicYear,
          level: data.level,
          ...(data.degreeProgramId && {
            degreeProgram: {
              connect: { id: data.degreeProgramId },
            },
          }),
        },
        include: {
          user: true,
          degreeProgram: true,
        },
      });
    } catch (error) {
      logger.error({ error, id }, "Failed to update student in database");
      throw new RepositoryError(
        "Failed to update student in database",
        ERROR_CODES.DB_FAILURE
      );
    }
  }
  /**
   * Deletes a student profile and the associated user.
   *
   * @param id - The ID of the student profile
   */
  async delete(id: number) {
    logger.debug({ id }, "Deleting student from database");
    try {
      // First find the associated user ID to delete it as well
      const student = await prisma.studentProfile.findUnique({
        where: { id },
        select: { userId: true },
      });

      if (!student) {
        throw new Error("Student not found");
      }

      // Transaction to ensure both profile and user are deleted
      await prisma.$transaction(async (tx: any) => {
        // Delete enrollments and borrow records (assuming cascade isn't set or to be safe)
        // Note: Check if schema supports cascade. If not, delete manually.
        await tx.enrollment.deleteMany({ where: { studentProfileId: id } });
        await tx.borrowRecord.deleteMany({ where: { studentProfileId: id } });

        // Delete profile
        await tx.studentProfile.delete({ where: { id } });

        // Delete user
        await tx.user.delete({ where: { id: student.userId } });
      });
    } catch (error) {
      logger.error({ error, id }, "Failed to delete student from database");
      throw new RepositoryError(
        "Failed to delete student from database",
        ERROR_CODES.DB_FAILURE
      );
    }
  }
}
