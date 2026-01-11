// Author: Udara Shanuka
// Project: University-Portal
// FP-ID: FP-20251230-US-SERVICE-ORGANIZATION
// Generated: 2025-12-30

import prisma from "../../../lib/db";
import { AppError } from "../../../common/utils/errors/app-error";
import { BaseService } from "../../../common/services/base.service";
import { FacultyDTO, DepartmentDTO } from "../academics.dto";

export class OrganizationService extends BaseService {
  constructor() {
    super("backend-organization-service");
  }

  // ===========================================================================
  // Faculties
  // ===========================================================================

  async getFaculties(): Promise<FacultyDTO[]> {
    this.logger.debug("Fetching all faculties");
    const faculties = await prisma.faculty.findMany({
      include: {
        _count: {
          select: { departments: true },
        },
      },
      orderBy: { name: "asc" },
    });
    return faculties.map((f: any) => ({
      id: f.id,
      name: f.name,
      description: f.description,
      createdAt: f.createdAt,
      updatedAt: f.updatedAt,
      departmentCount: f._count.departments,
    }));
  }

  async getFaculty(id: number): Promise<FacultyDTO> {
    const faculty = await prisma.faculty.findUnique({ where: { id } });
    if (!faculty) throw new AppError(`Faculty not found`, 404);
    return faculty;
  }

  async createFaculty(data: {
    name: string;
    description?: string;
  }): Promise<FacultyDTO> {
    this.logger.info({ data }, "Creating faculty");
    return prisma.faculty.create({ data });
  }

  async updateFaculty(
    id: number,
    data: { name?: string; description?: string }
  ): Promise<FacultyDTO> {
    this.logger.info({ id, data }, "Updating faculty");
    return prisma.faculty.update({ where: { id }, data });
  }

  async deleteFaculty(id: number): Promise<void> {
    this.logger.info({ id }, "Deleting faculty");
    await prisma.faculty.delete({ where: { id } });
  }

  // ===========================================================================
  // Departments
  // ===========================================================================

  async getDepartments(facultyId?: number): Promise<DepartmentDTO[]> {
    this.logger.debug({ facultyId }, "Fetching departments");
    const where = facultyId ? { facultyId } : {};
    const departments = await prisma.department.findMany({
      where,
      include: { faculty: true },
    });
    return departments.map((d: any) => ({
      id: d.id,
      facultyId: d.facultyId,
      name: d.name,
      facultyName: d.faculty.name,
    }));
  }

  async createDepartment(data: {
    facultyId: number;
    name: string;
  }): Promise<DepartmentDTO> {
    this.logger.info({ data }, "Creating department");
    // Verify faculty exists
    const faculty = await prisma.faculty.findUnique({
      where: { id: data.facultyId },
    });
    if (!faculty) throw new AppError("Faculty not found", 404);

    const dept = await prisma.department.create({
      data,
      include: { faculty: true },
    });
    return {
      id: dept.id,
      facultyId: dept.facultyId,
      name: dept.name,
      facultyName: dept.faculty.name,
    };
  }

  async getDepartment(id: number): Promise<DepartmentDTO> {
    const dept = await prisma.department.findUnique({
      where: { id },
      include: { faculty: true },
    });
    if (!dept) throw new AppError("Department not found", 404);
    return {
      id: dept.id,
      facultyId: dept.facultyId,
      name: dept.name,
      facultyName: dept.faculty.name,
    };
  }

  async updateDepartment(
    id: number,
    data: { name?: string; facultyId?: number }
  ): Promise<DepartmentDTO> {
    this.logger.info({ id, data }, "Updating department");
    const dept = await prisma.department.update({
      where: { id },
      data,
      include: { faculty: true },
    });
    return {
      id: dept.id,
      facultyId: dept.facultyId,
      name: dept.name,
      facultyName: dept.faculty.name,
    };
  }

  async deleteDepartment(id: number): Promise<void> {
    this.logger.info({ id }, "Deleting department");
    await prisma.department.delete({ where: { id } });
  }
}

export const organizationService = new OrganizationService();
