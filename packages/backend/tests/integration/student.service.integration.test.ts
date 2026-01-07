import { describe, it, expect, beforeAll, vi, afterAll } from "vitest";
import { studentService } from "../../src/modules/student/student.service";
import prisma from "@repo/database";

// Mock IdentityService to avoid external calls
vi.mock("../../src/modules/identity/identity.service", () => ({
  identityService: {
    createUser: vi.fn().mockResolvedValue("mock-wso2-id"),
    addUserToGroup: vi.fn(),
    generateInviteLink: vi.fn(),
    updateUser: vi.fn(),
    deleteUser: vi.fn(),
  },
}));

describe("StudentService Integration", () => {
  // Pre-requisites
  let degreeProgramId: number;

  beforeAll(async () => {
    // specific data setup if needed, basic setup handles cleaning
    // We need a Faculty, Department, and DegreeProgram to link the student to
    const faculty = await prisma.faculty.create({
      data: { name: "Science", description: "Faculty of Science" },
    });
    const department = await prisma.department.create({
      data: { name: "Computer Science", facultyId: faculty.id },
    });
    const degree = await prisma.degreeProgram.create({
      data: {
        name: "BSc Computer Science",
        departmentId: department.id,
        intakeAcademicYear: "2024-2025",
      },
    });
    degreeProgramId = degree.id;
  });

  it("should create a new student", async () => {
    const newStudent = {
      username: "jdoe",
      email: "jdoe@example.com",
      fullName: "John Doe",
      studentId: "STU-001",
      degreeProgramId,
      currentAcademicYear: "2024-2025",
      level: 1,
    };

    const created = await studentService.createStudent(newStudent);

    expect(created).toBeDefined();
    expect(created.email).toBe("jdoe@example.com");
    expect(created.student_id).toBe("STU-001");
    // Verify DB persistence
    const dbUser = await prisma.user.findUnique({
      where: { email: "jdoe@example.com" },
    });
    expect(dbUser).toBeDefined();
    expect(dbUser?.username).toBe("jdoe");
  });

  it("should retrieve a student profile", async () => {
    // Assuming previous test ran, or we create a new one
    // Ideally tests should be isolated, but for integration flow it's often sequential or we create fresh data
    const email = "jdoe@example.com";
    const profile = await studentService.getProfile(email);

    expect(profile).toBeDefined();
    expect(profile.fullName).toBe("John Doe");
    expect(profile.degreeProgram).toBe("BSc Computer Science");
  });

  it("should update student details", async () => {
    // First get the student ID
    const email = "jdoe@example.com";
    const profile = await studentService.getProfile(email);

    const updateData = {
      fullName: "Johnathan Doe",
      degreeProgramId,
      currentAcademicYear: "2024-2025",
      level: 2,
    };

    const updated = await studentService.updateStudent(profile.id, updateData);

    expect(updated.fullName).toBe("Johnathan Doe");
    expect(updated.level).toBe(2);

    // Verify persistence
    const dbProfile = await prisma.studentProfile.findUnique({
      where: { id: profile.id },
    });
    expect(dbProfile?.full_name).toBe("Johnathan Doe");
    expect(dbProfile?.level).toBe(2);
  });

  //   it("should delete a student", async () => {
  //     const email = "jdoe@example.com";
  //     const profile = await studentService.getProfile(email);

  //     await studentService.deleteStudent(profile.id);

  //     // Verify deletion
  //     const dbUser = await prisma.user.findUnique({ where: { email } });
  //     expect(dbUser).toBeNull();

  //     const dbProfile = await prisma.studentProfile.findUnique({ where: { id: profile.id } });
  //     expect(dbProfile).toBeNull();
  //   });
});
