import { describe, it, expect, vi, beforeEach } from "vitest";
import { courseService } from "./course.service";
import { DomainError, ERROR_CODES } from "../../../errors";
import prisma from "../../../lib/db";

vi.mock("../../../lib/db", () => ({
  default: {
    department: { findUnique: vi.fn() },
    course: {
      count: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

describe("CourseService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createCourse", () => {
    const mockData = {
      departmentId: 1,
      code: "CS202",
      name: "Data Structures",
      credits: 4,
      description: "Advanced BS",
    };

    it("should create course if department exists", async () => {
      (prisma.department.findUnique as any).mockResolvedValue({ id: 1 });
      (prisma.course.create as any).mockResolvedValue({
        id: 10,
        ...mockData,
        department: { name: "CS" },
      });

      const result = await courseService.createCourse(mockData);

      expect(result.id).toBe(10);
      expect(result.code).toBe("CS202");
    });

    it("should throw DEPARTMENT_NOT_FOUND if dept missing", async () => {
      (prisma.department.findUnique as any).mockResolvedValue(null);

      await expect(courseService.createCourse(mockData)).rejects.toThrow(
        DomainError
      );
      try {
        await courseService.createCourse(mockData);
      } catch (error: any) {
        expect(error.code).toBe(ERROR_CODES.DEPARTMENT_NOT_FOUND);
      }
    });

    it("should throw COURSE_ALREADY_EXISTS if duplicate code", async () => {
      (prisma.department.findUnique as any).mockResolvedValue({ id: 1 });
      (prisma.course.create as any).mockRejectedValue({ code: "P2002" });

      await expect(courseService.createCourse(mockData)).rejects.toThrow(
        DomainError
      );

      try {
        await courseService.createCourse(mockData);
      } catch (error: any) {
        expect(error.code).toBe(ERROR_CODES.COURSE_ALREADY_EXISTS);
      }
    });
  });

  describe("deleteCourse", () => {
    it("should delete course if found", async () => {
      (prisma.course.delete as any).mockResolvedValue({});
      await courseService.deleteCourse(1);
      expect(prisma.course.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it("should throw COURSE_NOT_FOUND if not exists (P2025)", async () => {
      (prisma.course.delete as any).mockRejectedValue({ code: "P2025" });
      await expect(courseService.deleteCourse(999)).rejects.toThrow(
        DomainError
      );
    });
  });
});
