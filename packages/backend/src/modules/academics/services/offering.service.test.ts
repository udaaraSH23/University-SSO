import { describe, it, expect, vi, beforeEach } from "vitest";
import { offeringService } from "./offering.service";
import { DomainError, ERROR_CODES } from "../../../errors";
import prisma from "../../../lib/db";

// Mock Prisma
vi.mock("../../../lib/db", () => ({
  default: {
    course: {
      findUnique: vi.fn(),
    },
    courseOffering: {
      findFirst: vi.fn(),
      create: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

describe("OfferingService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createCourseOffering", () => {
    const mockInput = {
      courseId: 1,
      academicYear: "2024",
      semester: 1,
      level: 4,
    };

    it("should create offering if valid and no duplicate", async () => {
      // Mock Course exists
      (prisma.course.findUnique as any).mockResolvedValue({ id: 1 });
      // Mock No duplicate
      (prisma.courseOffering.findFirst as any).mockResolvedValue(null);
      // Mock Create
      (prisma.courseOffering.create as any).mockResolvedValue({
        id: 10,
        ...mockInput,
        course: { code: "CS101", name: "Intro to CS" },
      });

      const result = await offeringService.createCourseOffering(mockInput);

      expect(result.id).toBe(10);
      expect(prisma.courseOffering.create).toHaveBeenCalled();
    });

    it("should throw ID_NOT_FOUND if course does not exist", async () => {
      (prisma.course.findUnique as any).mockResolvedValue(null);

      await expect(
        offeringService.createCourseOffering(mockInput)
      ).rejects.toThrow(DomainError);

      try {
        await offeringService.createCourseOffering(mockInput);
      } catch (error: any) {
        expect(error.code).toBe(ERROR_CODES.COURSE_NOT_FOUND);
      }
    });

    it("should throw OFFERING_ALREADY_EXISTS if duplicate found", async () => {
      (prisma.course.findUnique as any).mockResolvedValue({ id: 1 });
      (prisma.courseOffering.findFirst as any).mockResolvedValue({ id: 5 });

      await expect(
        offeringService.createCourseOffering(mockInput)
      ).rejects.toThrow(DomainError);

      try {
        await offeringService.createCourseOffering(mockInput);
      } catch (error: any) {
        expect(error.code).toBe(ERROR_CODES.OFFERING_ALREADY_EXISTS);
      }
    });
  });
});
