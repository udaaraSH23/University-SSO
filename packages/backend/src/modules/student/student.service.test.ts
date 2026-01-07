import { describe, it, expect, vi, beforeEach } from "vitest";
import { studentService } from "./student.service";
import { StudentRepository } from "./student.repository";
import { identityService } from "../identity/identity.service";
import { DomainError, ERROR_CODES } from "../../errors";

// Mock dependencies
vi.mock("./student.repository");

// Mock the identity module fully so we don't need to mock the individual export separately if we mock the module returning a default or named export properly.
// However, the service imports `identityService` (an instance).
// The previous mock worked:
vi.mock("../identity/identity.service", () => ({
  identityService: {
    createUser: vi.fn(),
    addUserToGroup: vi.fn(),
    generateInviteLink: vi.fn(),
    updateUser: vi.fn(),
    deleteUser: vi.fn(),
  },
}));

describe("StudentService", () => {
  let mockRepo: any;

  beforeEach(() => {
    vi.clearAllMocks();
    // Access the mocked instance within the service
    // Since we mocked the module, the instance inside the service is already using the mock class
    // We need to get the instance that was created.
    // However, since we mock the class implementation in `vi.mock`, we can grab the prototype methods or instances.
    // A simpler way with the current DI (hardcoded new) is to grab the mock from the class mock.

    // For now, let's assume simple mocking works.
    // Just handling the return values on the class prototype should affect all instances.
    mockRepo = StudentRepository.prototype;
  });

  // getProfile tests (omitted for brevity in replacement, but logically here)

  describe("createStudent", () => {
    const mockCreateData = {
      username: "jane.doe",
      email: "jane@example.com",
      fullName: "Jane Doe",
      studentId: "ST456",
      degreeProgramId: 101,
      currentAcademicYear: "2024",
      level: 4,
    };

    it("should successfully create a student and return profile", async () => {
      // Mock Identity Service responses
      (identityService.createUser as any).mockResolvedValue("wso2-id-123");
      (identityService.addUserToGroup as any).mockResolvedValue(undefined);
      (identityService.generateInviteLink as any).mockResolvedValue(
        "http://invite.link"
      );

      // Mock Repo response
      mockRepo.create.mockResolvedValue({
        id: 2,
        student_id: "ST456",
        full_name: "Jane Doe",
        user: { email: "jane@example.com" },
        gpa: 0,
        degreeProgram: { name: "Computer Science" },
        degreeProgramId: 101,
        currentAcademicYear: "2024",
        level: 4,
        isLibraryRegistered: false,
      });

      const result = await studentService.createStudent(mockCreateData);

      expect(identityService.createUser).toHaveBeenCalledWith({
        userName: "jane.doe",
        emails: ["jane@example.com"],
        name: { givenName: "Jane", familyName: "Doe" },
      });
      expect(identityService.addUserToGroup).toHaveBeenCalledWith(
        "wso2-id-123",
        "Students",
        "jane.doe"
      );
      expect(mockRepo.create).toHaveBeenCalled();
      expect(result.student_id).toBe("ST456");
    });

    it("should propagate errors if identity creation fails", async () => {
      (identityService.createUser as any).mockRejectedValue(
        new DomainError(
          "Identity Error",
          ERROR_CODES.IDENTITY_CREATION_FAILED,
          400
        )
      );

      await expect(
        studentService.createStudent(mockCreateData)
      ).rejects.toThrow(DomainError);
    });
  });

  describe("getProfile", () => {
    it("should return a formatted profile when found", async () => {
      const mockProfile = {
        id: 1,
        student_id: "ST123",
        full_name: "John Doe",
        email: "john@example.com",
        gpa: 3.5,
        degreeProgram: { name: "Computer Science" },
        degreeProgramId: 101,
        currentAcademicYear: "2024",
        level: 4,
        isLibraryRegistered: true,
      };

      mockRepo.findProfileByEmail.mockResolvedValue(mockProfile);

      const result = await studentService.getProfile("john@example.com");

      expect(mockRepo.findProfileByEmail).toHaveBeenCalledWith(
        "john@example.com"
      );
      expect(result).toEqual({
        id: 1,
        student_id: "ST123",
        fullName: "John Doe",
        email: "john@example.com",
        gpa: 3.5,
        degreeProgram: "Computer Science",
        degreeProgramId: 101,
        currentAcademicYear: "2024",
        level: 4,
        isLibraryRegistered: true,
      });
    });

    it("should throw STUDENT_NOT_FOUND error when profile does not exist", async () => {
      mockRepo.findProfileByEmail.mockResolvedValue(null);

      await expect(
        studentService.getProfile("unknown@example.com")
      ).rejects.toThrow(DomainError);

      try {
        await studentService.getProfile("unknown@example.com");
      } catch (error: any) {
        expect(error).toBeInstanceOf(DomainError);
        expect(error.code).toBe(ERROR_CODES.STUDENT_NOT_FOUND);
        expect(error.statusCode).toBe(404);
      }
    });

    it("should propagate internal errors as DomainError", async () => {
      mockRepo.findProfileByEmail.mockRejectedValue(
        new Error("Database connection failed")
      );

      await expect(
        studentService.getProfile("john@example.com")
      ).rejects.toThrow(DomainError);

      try {
        await studentService.getProfile("john@example.com");
      } catch (error: any) {
        expect(error).toBeInstanceOf(DomainError);
        expect(error.code).toBe(ERROR_CODES.INTERNAL_ERROR);
        expect(error.statusCode).toBe(500);
      }
    });
  });
});
