// Author: Udara Shanuka
// Project: University-Portal
// FP-ID: FP-20251230-US-SERVICE-PROGRAM
// Generated: 2025-12-30

import prisma from "../../../lib/db";
import { AppError } from "../../../common/utils/errors/app-error";
import { BaseService } from "../../../common/services/base.service";
import { DegreeProgramDTO } from "../academics.dto";

export class ProgramService extends BaseService {
  constructor() {
    super("backend-program-service");
  }

  // ===========================================================================
  // Degree Programs
  // ===========================================================================

  async getDegreePrograms(
    departmentId?: number,
    page: number = 1,
    limit: number = 10,
    intakeYear?: string,
    search?: string,
    facultyId?: number
  ): Promise<{ data: DegreeProgramDTO[]; total: number }> {
    this.logger.debug(
      { departmentId, page, limit, intakeYear, search, facultyId },
      "Fetching degree programs"
    );
    const where: any = {};
    if (departmentId) where.departmentId = departmentId;
    if (intakeYear) where.intakeAcademicYear = { contains: intakeYear };

    if (facultyId) {
      where.department = {
        facultyId: facultyId,
      };
    }

    if (search) {
      where.name = { contains: search };
    }

    const [total, degrees] = await Promise.all([
      prisma.degreeProgram.count({ where }),
      prisma.degreeProgram.findMany({
        where,
        include: { department: true },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    const data = degrees.map((d) => ({
      id: d.id,
      departmentId: d.departmentId,
      name: d.name,
      intakeAcademicYear: d.intakeAcademicYear,
      departmentName: d.department.name,
    }));

    return { data, total };
  }

  async createDegreeProgram(data: {
    departmentId: number;
    name: string;
    intakeAcademicYear: string;
  }): Promise<DegreeProgramDTO> {
    this.logger.info({ data }, "Creating degree program");
    const dept = await prisma.department.findUnique({
      where: { id: data.departmentId },
    });
    if (!dept) throw new AppError("Department not found", 404);

    const degree = await prisma.degreeProgram.create({
      data,
      include: { department: true },
    });
    return {
      id: degree.id,
      departmentId: degree.departmentId,
      name: degree.name,
      intakeAcademicYear: degree.intakeAcademicYear,
      departmentName: degree.department.name,
    };
  }

  async getDegreeProgram(id: number): Promise<DegreeProgramDTO> {
    const degree = await prisma.degreeProgram.findUnique({
      where: { id },
      include: { department: true },
    });
    if (!degree) throw new AppError("Degree Program not found", 404);
    return {
      id: degree.id,
      departmentId: degree.departmentId,
      name: degree.name,
      intakeAcademicYear: degree.intakeAcademicYear,
      departmentName: degree.department.name,
    };
  }

  async updateDegreeProgram(
    id: number,
    data: {
      name?: string;
      departmentId?: number;
      intakeAcademicYear?: string;
    }
  ): Promise<DegreeProgramDTO> {
    this.logger.info({ id, data }, "Updating degree program");
    const degree = await prisma.degreeProgram.update({
      where: { id },
      data,
      include: { department: true },
    });
    return {
      id: degree.id,
      departmentId: degree.departmentId,
      name: degree.name,
      intakeAcademicYear: degree.intakeAcademicYear,
      departmentName: degree.department.name,
    };
  }

  async deleteDegreeProgram(id: number): Promise<void> {
    this.logger.info({ id }, "Deleting degree program");
    await prisma.degreeProgram.delete({ where: { id } });
  }

  async getDistinctIntakeYears(): Promise<string[]> {
    const years = await prisma.degreeProgram.findMany({
      select: {
        intakeAcademicYear: true,
      },
      distinct: ["intakeAcademicYear"],
      orderBy: {
        intakeAcademicYear: "desc",
      },
    });
    return years.map((y) => y.intakeAcademicYear);
  }

  async getAllDegreePrograms(): Promise<
    { id: number; name: string; departmentId: number }[]
  > {
    return await prisma.degreeProgram.findMany({
      select: {
        id: true,
        name: true,
        departmentId: true,
      },
      orderBy: {
        name: "asc",
      },
    });
  }
}

export const programService = new ProgramService();
