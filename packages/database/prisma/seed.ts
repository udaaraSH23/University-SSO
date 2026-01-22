import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // 0. Delete existing data (respecting foreign key constraints)
  console.log("Cleaning database...");
  await prisma.borrowRecord.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.courseOffering.deleteMany();
  await prisma.studentProfile.deleteMany();
  await prisma.staffProfile.deleteMany();
  await prisma.book.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();
  await prisma.degreeProgram.deleteMany();
  await prisma.department.deleteMany();
  await prisma.faculty.deleteMany();

  console.log("Database cleaned.");

  // 1. Create Faculties
  console.log("Creating Faculties...");
  const computingFaculty = await prisma.faculty.create({
    data: {
      name: "Faculty of Computing",
      description: "Faculty for Computer Science and Information Systems",
    },
  });

  // 2. Create Departments
  console.log("Creating Departments...");
  const csDepartment = await prisma.department.create({
    data: {
      name: "Computer Science",
      facultyId: computingFaculty.id,
    },
  });

  const isDepartment = await prisma.department.create({
    data: {
      name: "Information Systems",
      facultyId: computingFaculty.id,
    },
  });

  // 3. Create Degree Programs
  console.log("Creating Degree Programs...");
  const csDegree = await prisma.degreeProgram.create({
    data: {
      name: "BSc Computer Science",
      departmentId: csDepartment.id,
      intakeAcademicYear: "2024-2025",
    },
  });

  const isDegree = await prisma.degreeProgram.create({
    data: {
      name: "BSc Information Systems",
      departmentId: isDepartment.id,
      intakeAcademicYear: "2024-2025",
    },
  });

  // 4. Create Users and Profiles
  console.log("Creating Users...");

  // Admin
  await prisma.user.create({
    data: {
      username: "admin",
      email: "admin@university.com",
      role: "ADMIN",
      wso2_id: "admin-oidc-id",
      staffProfile: {
        create: {
          fullName: "System Administrator",
          staffType: "ADMIN",
        },
      },
    },
  });

  // Student 1 (CS)
  const student1 = await prisma.user.create({
    data: {
      username: "jdoe",
      email: "jdoe@student.university.com",
      role: "STUDENT",
      wso2_id: "student1-oidc-id",
      studentProfile: {
        create: {
          student_id: "S1001",
          full_name: "John Doe",
          degreeProgramId: csDegree.id,
          currentAcademicYear: "2025-2026",
          level: 2, // Year 2
        },
      },
    },
    include: {
      studentProfile: true,
    },
  });

  // Student 2 (IS)
  const student2 = await prisma.user.create({
    data: {
      username: "asmith",
      email: "asmith@student.university.com",
      role: "STUDENT",
      wso2_id: "student2-oidc-id",
      studentProfile: {
        create: {
          student_id: "S1002",
          full_name: "Alice Smith",
          degreeProgramId: isDegree.id,
          currentAcademicYear: "2025-2026",
          level: 2, // Year 2
        },
      },
    },
    include: {
      studentProfile: true,
    },
  });

  // Librarian
  await prisma.user.create({
    data: {
      username: "librarian",
      email: "lib@university.com",
      role: "LIBRARIAN",
      wso2_id: "librarian-oidc-id",
      staffProfile: {
        create: {
          fullName: "Librarian User",
          staffType: "LIBRARIAN",
        },
      },
    },
  });

  // Custom User (from user request)
  await prisma.user.create({
    data: {
      username: "student1",
      email: "student1@gmail.com",
      role: "STUDENT",
      wso2_id: "jfjhgfghj2",
      studentProfile: {
        create: {
          student_id: "ST001",
          full_name: "Student Name",
          degreeProgramId: csDegree.id,
          currentAcademicYear: "2025-2026",
          level: 1,
        },
      },
    },
  });

  // 5. Create Courses
  console.log("Creating Courses...");
  const courseData = [
    // Year 1 CS
    {
      code: "CS101",
      name: "Intro to Programming",
      credits: 3,
      dept: csDepartment,
    },
    { code: "CS102", name: "Digital Logic", credits: 3, dept: csDepartment },
    // Year 1 IS
    {
      code: "IS101",
      name: "Intro to Information Systems",
      credits: 3,
      dept: isDepartment,
    },
    {
      code: "IS102",
      name: "Business Processes",
      credits: 3,
      dept: isDepartment,
    },
    // Year 2 CS
    { code: "CS201", name: "Data Structures", credits: 4, dept: csDepartment },
    {
      code: "CS202",
      name: "Operating Systems",
      credits: 3,
      dept: csDepartment,
    },
    {
      code: "CS203",
      name: "Advanced Algorithms",
      credits: 3,
      dept: csDepartment,
    },
    // Year 2 IS
    { code: "IS201", name: "Database Systems", credits: 3, dept: isDepartment },
    { code: "IS202", name: "Systems Analysis", credits: 3, dept: isDepartment },
    {
      code: "IS203",
      name: "Human Computer Interaction",
      credits: 3,
      dept: isDepartment,
    },
    // Year 3 CS
    {
      code: "CS301",
      name: "Software Engineering",
      credits: 3,
      dept: csDepartment,
    },
    {
      code: "CS302",
      name: "Computer Networks",
      credits: 3,
      dept: csDepartment,
    },
    // Year 3 IS
    {
      code: "IS301",
      name: "Enterprise Architecture",
      credits: 3,
      dept: isDepartment,
    },
    {
      code: "IS302",
      name: "IT Project Management",
      credits: 3,
      dept: isDepartment,
    },
    // Year 4 CS
    {
      code: "CS401",
      name: "Artificial Intelligence",
      credits: 4,
      dept: csDepartment,
    },
    {
      code: "CS402",
      name: "Distributed Systems",
      credits: 3,
      dept: csDepartment,
    },
    // Year 4 IS
    { code: "IS401", name: "IS Strategy", credits: 3, dept: isDepartment },
    { code: "IS402", name: "Dissertation", credits: 6, dept: isDepartment },
  ];

  const createdCourses: Record<string, any> = {};

  for (const c of courseData) {
    createdCourses[c.code] = await prisma.course.create({
      data: {
        code: c.code,
        name: c.name,
        credits: c.credits,
        departmentId: c.dept.id,
      },
    });
  }

  // 6. Create Course Offerings
  console.log("Creating Course Offerings...");

  // Helper to create offerings
  const createOfferings = async (academicYear: string) => {
    const offerings: any[] = [];

    // Y1, Sem 1
    offerings.push({ code: "CS101", sem: 1, level: 1 });
    offerings.push({ code: "IS101", sem: 1, level: 1 });
    // Y1, Sem 2
    offerings.push({ code: "CS102", sem: 2, level: 1 });
    offerings.push({ code: "IS102", sem: 2, level: 1 });

    // Y2, Sem 1
    offerings.push({ code: "CS201", sem: 1, level: 2 });
    offerings.push({ code: "IS201", sem: 1, level: 2 });
    // Y2, Sem 2
    offerings.push({ code: "CS202", sem: 2, level: 2 });
    offerings.push({ code: "IS202", sem: 2, level: 2 });
    // Y2, Sem 3 or 4 (Summer/Special) - let's map them to Sem 2 for simplicity or keep as is if model supports > 2
    // The schema says semester Int, but common logic is 1 or 2. Let's stick to 1/2 for main, maybe 3 for summer.
    offerings.push({ code: "CS203", sem: 2, level: 2 });
    offerings.push({ code: "IS203", sem: 2, level: 2 });

    // Y3
    offerings.push({ code: "CS301", sem: 1, level: 3 });
    offerings.push({ code: "IS301", sem: 1, level: 3 });

    for (const off of offerings) {
      await prisma.courseOffering.create({
        data: {
          courseId: createdCourses[off.code].id,
          academicYear: academicYear,
          semester: off.sem,
          level: off.level,
        },
      });
    }
  };

  // Create offerings for previous year and current year
  await createOfferings("2024-2025");
  await createOfferings("2025-2026");

  // 7. Enrollments
  console.log("Creating Enrollments...");

  // Helper to find offering
  const findOffering = async (
    code: string,
    academicYear: string,
    semester: number
  ) => {
    const course = createdCourses[code];
    return prisma.courseOffering.findFirst({
      where: {
        courseId: course.id,
        academicYear,
        semester,
      },
    });
  };

  // Student 1 (CS) History
  if (student1.studentProfile) {
    const s1Id = student1.studentProfile.id;

    // Completed Year 1
    const s1y1sem1 = await findOffering("CS101", "2024-2025", 1);
    const s1y1sem2 = await findOffering("CS102", "2024-2025", 2);

    if (s1y1sem1)
      await prisma.enrollment.create({
        data: {
          studentProfileId: s1Id,
          courseOfferingId: s1y1sem1.id,
          grade: "A",
        },
      });
    if (s1y1sem2)
      await prisma.enrollment.create({
        data: {
          studentProfileId: s1Id,
          courseOfferingId: s1y1sem2.id,
          grade: "B+",
        },
      });

    // Current Year 2 (Enrolled)
    const s1y2sem1 = await findOffering("CS201", "2025-2026", 1);
    if (s1y2sem1)
      await prisma.enrollment.create({
        data: {
          studentProfileId: s1Id,
          courseOfferingId: s1y2sem1.id,
          grade: "A-",
        },
      }); // Completed recently? Or currently doing? If grade exists, likely completed or interim.

    // Ongoing/Future
    const s1y2sem2 = await findOffering("CS202", "2025-2026", 2);
    if (s1y2sem2)
      await prisma.enrollment.create({
        data: { studentProfileId: s1Id, courseOfferingId: s1y2sem2.id },
      }); // No grade = ongoing
  }

  // Student 2 (IS) History
  if (student2.studentProfile) {
    const s2Id = student2.studentProfile.id;

    // Completed Year 1
    const s2y1sem1 = await findOffering("IS101", "2024-2025", 1);
    const s2y1sem2 = await findOffering("IS102", "2024-2025", 2);

    if (s2y1sem1)
      await prisma.enrollment.create({
        data: {
          studentProfileId: s2Id,
          courseOfferingId: s2y1sem1.id,
          grade: "A-",
        },
      });
    if (s2y1sem2)
      await prisma.enrollment.create({
        data: {
          studentProfileId: s2Id,
          courseOfferingId: s2y1sem2.id,
          grade: "A",
        },
      });

    // Current Year 2
    const s2y2sem1 = await findOffering("IS201", "2025-2026", 1);
    if (s2y2sem1)
      await prisma.enrollment.create({
        data: {
          studentProfileId: s2Id,
          courseOfferingId: s2y2sem1.id,
          grade: "B",
        },
      });

    const s2y2sem2 = await findOffering("IS202", "2025-2026", 2);
    if (s2y2sem2)
      await prisma.enrollment.create({
        data: { studentProfileId: s2Id, courseOfferingId: s2y2sem2.id },
      });
  }

  // 8. Books
  console.log("Creating Books...");
  const book1 = await prisma.book.create({
    data: {
      title: "The Pragmatic Programmer",
      author: "Andy Hunt",
      isbn: "978-0201616224",
      total_copies: 5,
      available_copies: 5,
      year: 1999,
    },
  });

  const book2 = await prisma.book.create({
    data: {
      title: "Clean Code",
      author: "Robert C. Martin",
      isbn: "978-0132350884",
      total_copies: 3,
      available_copies: 2, // Simulating one borrowed
      year: 2008,
    },
  });

  // 9. Borrow Records
  console.log("Creating Borrow Records...");
  if (student2.studentProfile) {
    await prisma.borrowRecord.create({
      data: {
        studentProfileId: student2.studentProfile.id,
        bookId: book2.id,
        due_date: new Date(new Date().setDate(new Date().getDate() + 14)), // 14 days from now
        status: "BORROWED",
      },
    });
  }

  console.log("Seeding finished.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
