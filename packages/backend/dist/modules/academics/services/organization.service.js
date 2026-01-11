// Author: Udara Shanuka
// Project: University-Portal
// FP-ID: FP-20251230-US-SERVICE-ORGANIZATION
// Generated: 2025-12-30
import prisma from "../../../lib/db";
import { AppError } from "../../../common/utils/errors/app-error";
import { BaseService } from "../../../common/services/base.service";
export class OrganizationService extends BaseService {
    constructor() {
        super("backend-organization-service");
    }
    // ===========================================================================
    // Faculties
    // ===========================================================================
    async getFaculties() {
        this.logger.debug("Fetching all faculties");
        const faculties = await prisma.faculty.findMany({
            include: {
                _count: {
                    select: { departments: true },
                },
            },
            orderBy: { name: "asc" },
        });
        return faculties.map((f) => ({
            id: f.id,
            name: f.name,
            description: f.description,
            createdAt: f.createdAt,
            updatedAt: f.updatedAt,
            departmentCount: f._count.departments,
        }));
    }
    async getFaculty(id) {
        const faculty = await prisma.faculty.findUnique({ where: { id } });
        if (!faculty)
            throw new AppError(`Faculty not found`, 404);
        return faculty;
    }
    async createFaculty(data) {
        this.logger.info({ data }, "Creating faculty");
        return prisma.faculty.create({ data });
    }
    async updateFaculty(id, data) {
        this.logger.info({ id, data }, "Updating faculty");
        return prisma.faculty.update({ where: { id }, data });
    }
    async deleteFaculty(id) {
        this.logger.info({ id }, "Deleting faculty");
        await prisma.faculty.delete({ where: { id } });
    }
    // ===========================================================================
    // Departments
    // ===========================================================================
    async getDepartments(facultyId) {
        this.logger.debug({ facultyId }, "Fetching departments");
        const where = facultyId ? { facultyId } : {};
        const departments = await prisma.department.findMany({
            where,
            include: { faculty: true },
        });
        return departments.map((d) => ({
            id: d.id,
            facultyId: d.facultyId,
            name: d.name,
            facultyName: d.faculty.name,
        }));
    }
    async createDepartment(data) {
        this.logger.info({ data }, "Creating department");
        // Verify faculty exists
        const faculty = await prisma.faculty.findUnique({
            where: { id: data.facultyId },
        });
        if (!faculty)
            throw new AppError("Faculty not found", 404);
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
    async getDepartment(id) {
        const dept = await prisma.department.findUnique({
            where: { id },
            include: { faculty: true },
        });
        if (!dept)
            throw new AppError("Department not found", 404);
        return {
            id: dept.id,
            facultyId: dept.facultyId,
            name: dept.name,
            facultyName: dept.faculty.name,
        };
    }
    async updateDepartment(id, data) {
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
    async deleteDepartment(id) {
        this.logger.info({ id }, "Deleting department");
        await prisma.department.delete({ where: { id } });
    }
}
export const organizationService = new OrganizationService();
