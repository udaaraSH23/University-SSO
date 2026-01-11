// Author: Udara Shanuka (Modified by System)
// Project: University-Portal
// FP-ID: FP-20260105-US-SERVICE-PROGRAM-V2
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2026-01-05T11:25:00Z
const __FP_SIG = "FP-20260105-US-SERVICE-PROGRAM-V2|HASH-PLACEHOLDER";
import prisma from "../../../lib/db";
import { BaseService } from "../../../common/services/base.service";
import { DomainError, ERROR_CODES, RepositoryError } from "../../../errors";
/**
 * Service: Degree Program Management
 *
 * Handles operations related to degree programs.
 */
export class ProgramService extends BaseService {
    constructor() {
        super("backend-program-service");
    }
    // ===========================================================================
    // Degree Programs
    // ===========================================================================
    /**
     * Retrieves a paginated list of degree programs with filters.
     *
     * @param departmentId - Filter by department
     * @param page - Page number (default: 1)
     * @param limit - Items per page (default: 10)
     * @param intakeYear - Filter by intake year
     * @param search - Search by name
     * @param facultyId - Filter by faculty
     * @returns Promise<{ data: DegreeProgramDTO[]; total: number }>
     */
    async getDegreePrograms(departmentId, page = 1, limit = 10, intakeYear, search, facultyId) {
        this.logger.debug({ departmentId, page, limit, intakeYear, search, facultyId }, "Fetching degree programs");
        try {
            const where = {};
            if (departmentId)
                where.departmentId = departmentId;
            if (intakeYear)
                where.intakeAcademicYear = { contains: intakeYear };
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
        catch (err) {
            if (err instanceof DomainError)
                throw err;
            throw new RepositoryError("Failed to fetch degree programs", ERROR_CODES.DB_FAILURE);
        }
    }
    /**
     * Creates a new degree program.
     *
     * @param data - Program creation data
     * @returns Promise<DegreeProgramDTO>
     * @throws DomainError if department is not found
     */
    async createDegreeProgram(data) {
        this.logger.info({ data }, "Creating degree program");
        try {
            const dept = await prisma.department.findUnique({
                where: { id: data.departmentId },
            });
            if (!dept)
                throw new DomainError("Department not found", ERROR_CODES.DEPARTMENT_NOT_FOUND, 404);
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
        catch (err) {
            if (err instanceof DomainError)
                throw err;
            throw new RepositoryError("Failed to create degree program", ERROR_CODES.DB_FAILURE);
        }
    }
    /**
     * Retrieves a degree program by ID.
     *
     * @param id - Program ID
     * @returns Promise<DegreeProgramDTO>
     * @throws DomainError if program is not found
     */
    async getDegreeProgram(id) {
        try {
            const degree = await prisma.degreeProgram.findUnique({
                where: { id },
                include: { department: true },
            });
            if (!degree)
                throw new DomainError("Degree Program not found", ERROR_CODES.DEGREE_PROGRAM_NOT_FOUND, 404);
            return {
                id: degree.id,
                departmentId: degree.departmentId,
                name: degree.name,
                intakeAcademicYear: degree.intakeAcademicYear,
                departmentName: degree.department.name,
            };
        }
        catch (err) {
            if (err instanceof DomainError)
                throw err;
            throw new RepositoryError("Failed to get degree program", ERROR_CODES.DB_FAILURE);
        }
    }
    /**
     * Updates an existing degree program.
     *
     * @param id - Program ID
     * @param data - Update data
     * @returns Promise<DegreeProgramDTO>
     */
    async updateDegreeProgram(id, data) {
        this.logger.info({ id, data }, "Updating degree program");
        try {
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
        catch (err) {
            if (err.code === "P2025") {
                throw new DomainError("Degree program not found", ERROR_CODES.DEGREE_PROGRAM_NOT_FOUND, 404);
            }
            throw new RepositoryError("Failed to update degree program", ERROR_CODES.DB_FAILURE);
        }
    }
    /**
     * Deletes a degree program by ID.
     *
     * @param id - Program ID
     */
    async deleteDegreeProgram(id) {
        this.logger.info({ id }, "Deleting degree program");
        try {
            await prisma.degreeProgram.delete({ where: { id } });
        }
        catch (err) {
            if (err.code === "P2025") {
                throw new DomainError("Degree program not found", ERROR_CODES.DEGREE_PROGRAM_NOT_FOUND, 404);
            }
            throw new RepositoryError("Failed to delete degree program", ERROR_CODES.DB_FAILURE);
        }
    }
    async getDistinctIntakeYears() {
        try {
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
        catch (err) {
            throw new RepositoryError("Failed to fetch intake years", ERROR_CODES.DB_FAILURE);
        }
    }
    async getAllDegreePrograms() {
        try {
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
        catch (err) {
            throw new RepositoryError("Failed to fetch all degree programs", ERROR_CODES.DB_FAILURE);
        }
    }
}
export const programService = new ProgramService();
