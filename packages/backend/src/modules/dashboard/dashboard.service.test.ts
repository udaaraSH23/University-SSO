import { describe, it, expect, vi, beforeEach } from "vitest";
import { dashboardService } from "./dashboard.service";
import { StudentRepository } from "../student/student.repository";
import { DomainError, ERROR_CODES } from "../../errors";

// Mock Repositories
vi.mock("../student/student.repository");

describe("DashboardService", () => {
  let mockRepo: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockRepo = StudentRepository.prototype;
  });

  describe("getDashboardData", () => {
    const mockEmail = "test@student.com";

    it("should return aggregated dashboard data", async () => {
      // Mock Profile
      mockRepo.findProfileByEmail.mockResolvedValue({
        id: 1,
        student_id: "ST01",
        full_name: "Test Student",
        email: mockEmail,
        degreeProgram: { name: "SE" },
        degreeProgramId: 10,
        currentAcademicYear: "2024",
        level: 4,
        isLibraryRegistered: true,
      });

      // Mock Enrollments (return value for findEnrollments)
      mockRepo.findEnrollments.mockResolvedValue([
        {
          id: 100,
          courseOffering: {
            id: 200,
            course: {
              id: 300,
              code: "CS101",
              name: "Intro CS",
              description: "Desc",
              credits: 3,
            },
            semester: 1,
            academicYear: "2024",
            level: 4,
          },
          grade: "A",
        },
      ]);

      // Mock Borrow Records
      mockRepo.findBorrowRecords.mockResolvedValue([
        {
          id: 500,
          book: {
            id: 600,
            title: "Clean Code",
            author: "Uncle Bob",
          },
          due_date: new Date(),
          borrow_date: new Date(),
          return_date: null,
          status: "BORROWED",
        },
      ]);

      const result = await dashboardService.getDashboardData(mockEmail);

      expect(mockRepo.findProfileByEmail).toHaveBeenCalledWith(mockEmail);
      expect(mockRepo.findEnrollments).toHaveBeenCalledWith(1); // Profile ID is 1
      expect(mockRepo.findBorrowRecords).toHaveBeenCalledWith(1);

      expect(result.profile.email).toBe(mockEmail);
      expect(result.courses).toHaveLength(1);
      expect(result.courses[0].enrollmentId).toBe(100);
      expect(result.books).toHaveLength(1);
      expect(result.books[0].title).toBe("Clean Code");
    });

    it("should throw STUDENT_NOT_FOUND if profile is missing", async () => {
      mockRepo.findProfileByEmail.mockResolvedValue(null);

      await expect(
        dashboardService.getDashboardData(mockEmail)
      ).rejects.toThrow(DomainError);

      try {
        await dashboardService.getDashboardData(mockEmail);
      } catch (error: any) {
        expect(error.code).toBe(ERROR_CODES.STUDENT_NOT_FOUND);
      }
    });

    it("should handle repo errors gracefully (rethrow or wrap)", async () => {
      mockRepo.findProfileByEmail.mockRejectedValue(new Error("DB Error"));
      await expect(
        dashboardService.getDashboardData(mockEmail)
      ).rejects.toThrow();
    });
  });
});
