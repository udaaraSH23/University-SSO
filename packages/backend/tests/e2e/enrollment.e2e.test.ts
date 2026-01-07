import { describe, it, expect, beforeAll, vi } from "vitest";
import { studentService } from "../../src/modules/student/student.service";
import prisma from "@repo/database";

// Mock IdentityService
vi.mock("../../src/modules/identity/identity.service", () => ({
  identityService: {
    createUser: vi.fn().mockResolvedValue("mock-wso2-id-e2e"),
    addUserToGroup: vi.fn(),
    generateInviteLink: vi.fn(),
    updateUser: vi.fn(),
    deleteUser: vi.fn(),
  },
}));

describe("Enrollment E2E Flow", () => {
  let degreeProgramId: number;
  let departmentId: number;
  let courseOfferingId: number;

  beforeAll(async () => {
    // 1. Setup Infrastructure
    const faculty = await prisma.faculty.create({
      data: { name: "Engineering", description: "Faculty of Engineering" },
    });

    const department = await prisma.department.create({
      data: { name: "Software Engineering", facultyId: faculty.id },
    });
    departmentId = department.id;

    const degree = await prisma.degreeProgram.create({
      data: {
        name: "BSc Software Engineering",
        departmentId: department.id,
        intakeAcademicYear: "2024-2025",
      },
    });
    degreeProgramId = degree.id;

    // 2. Create Course & Offering
    const course = await prisma.course.create({
      data: {
        code: "SE101",
        name: "Intro to SE",
        credits: 3,
        departmentId: department.id,
        description: "Foundation of SE",
      },
    });

    const offering = await prisma.courseOffering.create({
      data: {
        courseId: course.id,
        academicYear: "2024-2025",
        semester: 1,
        level: 1,
      },
    });
    courseOfferingId = offering.id;
  });

  it("should complete a full enrollment cycle", async () => {
    // 1. Create Student
    const studentData = {
      username: "e2e_student",
      email: "e2e@example.com",
      fullName: "E2E Student",
      studentId: "STU-E2E",
      degreeProgramId,
      currentAcademicYear: "2024-2025",
      level: 1,
    };
    const student = await studentService.createStudent(studentData);
    expect(student).toBeDefined();

    // 2. Enroll Student directly via Prisma (mimicking an admin action or separate service)
    // We don't have an enrollment service exposed here, so we simulate the DB state change
    await prisma.enrollment.create({
      data: {
        studentProfileId: student.id,
        courseOfferingId: courseOfferingId,
      },
    });

    // 3. Verify Student sees course
    const courses = await studentService.getCourses("e2e@example.com");

    expect(courses).toHaveLength(1);
    expect(courses[0].code).toBe("SE101");
    expect(courses[0].name).toBe("Intro to SE");
    expect(courses[0].status).toBe("ENROLLED");
  });
});
