"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentRepository = void 0;
const db_1 = __importDefault(require("../lib/db"));
class StudentRepository {
    async findProfileByEmail(email) {
        return await db_1.default.userProfile.findFirst({
            where: {
                user: {
                    email: email,
                },
            },
            include: {
                degreeProgram: true,
            },
        });
    }
    async findEnrollments(userProfileId, filters) {
        const whereClause = {
            userProfileId: userProfileId,
        };
        if (filters === null || filters === void 0 ? void 0 : filters.semester)
            whereClause.semester = filters.semester;
        if (filters === null || filters === void 0 ? void 0 : filters.year)
            whereClause.academic_year = filters.year;
        return await db_1.default.enrollment.findMany({
            where: whereClause,
            include: {
                course: true,
            },
        });
    }
    async findBorrowRecords(userProfileId, status = "BORROWED") {
        return await db_1.default.borrowRecord.findMany({
            where: {
                userProfileId: userProfileId,
                status: status,
            },
            include: {
                book: true,
            },
        });
    }
}
exports.StudentRepository = StudentRepository;
