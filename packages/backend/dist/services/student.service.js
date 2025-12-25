"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.studentService = exports.StudentService = void 0;
const student_repository_1 = require("../repositories/student.repository");
const app_error_1 = require("../utils/errors/app-error");
const studentRepository = new student_repository_1.StudentRepository();
class StudentService {
    async getProfile(email) {
        var _a;
        const profile = await studentRepository.findProfileByEmail(email);
        if (!profile) {
            throw new app_error_1.AppError("Student profile not found", 404);
        }
        return {
            id: profile.student_id || profile.id.toString(),
            fullName: profile.full_name,
            email: profile.email,
            gpa: profile.gpa || 0,
            degreeProgram: ((_a = profile.degreeProgram) === null || _a === void 0 ? void 0 : _a.name) || "N/A",
            academicYear: profile.academic_year || "N/A",
        };
    }
    async getCourses(email, filters) {
        const profile = await studentRepository.findProfileByEmail(email);
        if (!profile) {
            throw new app_error_1.AppError("Student profile not found", 404);
        }
        const enrollments = await studentRepository.findEnrollments(profile.id, filters);
        return enrollments.map((enrollment) => ({
            courseId: enrollment.course.id,
            code: enrollment.course.code,
            name: enrollment.course.name,
            description: enrollment.course.description || "No description available",
            credits: enrollment.course.credits,
            status: "ENROLLED",
        }));
    }
    async getGrades(email) {
        const profile = await studentRepository.findProfileByEmail(email);
        if (!profile) {
            throw new app_error_1.AppError("Student profile not found", 404);
        }
        const enrollments = await studentRepository.findEnrollments(profile.id);
        return enrollments.map((enrollment) => ({
            courseCode: enrollment.course.code,
            courseName: enrollment.course.name,
            grade: enrollment.grade || "N/A",
            semester: enrollment.semester,
            year: enrollment.academic_year,
        }));
    }
    async getBorrowedBooks(email) {
        const profile = await studentRepository.findProfileByEmail(email);
        if (!profile) {
            throw new app_error_1.AppError("Student profile not found", 404);
        }
        const records = await studentRepository.findBorrowRecords(profile.id);
        return records.map((record) => ({
            bookId: record.book.id,
            title: record.book.title,
            author: record.book.author,
            dueDate: record.due_date,
            status: record.status,
        }));
    }
}
exports.StudentService = StudentService;
exports.studentService = new StudentService();
