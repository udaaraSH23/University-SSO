import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // 0. Delete existing data (respecting foreign key constraints)
  await prisma.borrowRecord.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.userProfile.deleteMany();
  await prisma.book.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();
  await prisma.degreeProgram.deleteMany();
  await prisma.department.deleteMany();
  await prisma.faculty.deleteMany();

  // 1. Create Faculties
  const computingFaculty = await prisma.faculty.create({
    data: {
      name: "Faculty of Computing",
      description: "Faculty for Computer Science and Information Systems",
    },
  });

  // 2. Create Departments
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
  const csDegree = await prisma.degreeProgram.create({
    data: {
      name: "BSc Computer Science",
      departmentId: csDepartment.id,
    },
  });

  const isDegree = await prisma.degreeProgram.create({
    data: {
      name: "BSc Information Systems",
      departmentId: isDepartment.id,
    },
  });

  // 4. Create Users and UserProfiles
  // Admin
  await prisma.user.create({
    data: {
      username: "admin",
      email: "admin@university.com",
      role: "ADMIN",
      wso2_id: "admin-oidc-id",
      userProfile: {
        create: {
          full_name: "System Administrator",
          email: "admin@university.com",
        },
      },
    },
  });

  // Student 1
  const student1 = await prisma.user.create({
    data: {
      username: "jdoe",
      email: "jdoe@student.university.com",
      role: "STUDENT",
      wso2_id: "student1-oidc-id",
      userProfile: {
        create: {
          student_id: "S1001",
          full_name: "John Doe",
          degreeProgramId: csDegree.id,
          email: "jdoe@student.university.com",
          gpa: 3.8,
          academic_year: "2025",
          current_study_year: 1,
          enrollment_year: "2024",
        },
      },
    },
    include: {
      userProfile: true,
    },
  });

  // Student 2
  const student2 = await prisma.user.create({
    data: {
      username: "asmith",
      email: "asmith@student.university.com",
      role: "STUDENT",
      wso2_id: "student2-oidc-id",
      userProfile: {
        create: {
          student_id: "S1002",
          full_name: "Alice Smith",
          degreeProgramId: isDegree.id,
          email: "asmith@student.university.com",
          gpa: 3.9,
          academic_year: "2025",
          current_study_year: 1,
          enrollment_year: "2024",
        },
      },
    },
    include: {
      userProfile: true,
    },
  });

  // Librarian
  await prisma.user.create({
    data: {
      username: "librarian",
      email: "lib@university.com",
      role: "LIBRARIAN",
      wso2_id: "librarian-oidc-id",
      userProfile: {
        create: {
          full_name: "Librarian User",
          email: "lib@university.com",
        },
      },
    },
  });

  // 5. Create Courses
  const courseData = [
    // Year 1
    {
      code: "CS101",
      name: "Intro to Programming",
      credits: 3,
      dept: csDepartment,
      sem: 1,
    },
    {
      code: "CS102",
      name: "Digital Logic",
      credits: 3,
      dept: csDepartment,
      sem: 2,
    },
    {
      code: "IS101",
      name: "Intro to Information Systems",
      credits: 3,
      dept: isDepartment,
      sem: 1,
    },
    {
      code: "IS102",
      name: "Business Processes",
      credits: 3,
      dept: isDepartment,
      sem: 2,
    },
    // Year 2
    {
      code: "CS201",
      name: "Data Structures",
      credits: 4,
      dept: csDepartment,
      sem: 1,
    },
    {
      code: "CS202",
      name: "Operating Systems",
      credits: 3,
      dept: csDepartment,
      sem: 2,
    },
    {
      code: "IS201",
      name: "Database Systems",
      credits: 3,
      dept: isDepartment,
      sem: 1,
    },
    {
      code: "IS202",
      name: "Systems Analysis",
      credits: 3,
      dept: isDepartment,
      sem: 2,
    },
    // Year 3
    {
      code: "CS301",
      name: "Software Engineering",
      credits: 3,
      dept: csDepartment,
      sem: 1,
    },
    {
      code: "CS302",
      name: "Computer Networks",
      credits: 3,
      dept: csDepartment,
      sem: 2,
    },
    {
      code: "IS301",
      name: "Enterprise Architecture",
      credits: 3,
      dept: isDepartment,
      sem: 1,
    },
    {
      code: "IS302",
      name: "IT Project Management",
      credits: 3,
      dept: isDepartment,
      sem: 2,
    },
    // Year 4
    {
      code: "CS401",
      name: "Artificial Intelligence",
      credits: 4,
      dept: csDepartment,
      sem: 1,
    },
    {
      code: "CS402",
      name: "Distributed Systems",
      credits: 3,
      dept: csDepartment,
      sem: 2,
    },
    {
      code: "IS401",
      name: "IS Strategy",
      credits: 3,
      dept: isDepartment,
      sem: 1,
    },
    {
      code: "IS402",
      name: "Dissertation",
      credits: 6,
      dept: isDepartment,
      sem: 2,
    },
    // Summer/Semester 3 & 4 (Added for completeness)
    {
      code: "CS203",
      name: "Advanced Algorithms",
      credits: 3,
      dept: csDepartment,
      sem: 3,
    },
    {
      code: "IS203",
      name: "Human Computer Interaction",
      credits: 3,
      dept: isDepartment,
      sem: 4,
    },
  ];

  const createdCourses: any = {};

  for (const c of courseData) {
    createdCourses[c.code] = await prisma.course.create({
      data: {
        code: c.code,
        name: c.name,
        credits: c.credits,
        departmentId: c.dept.id,
        semester: c.sem,
        offering_year: "2025",
      },
    });
  }

  // 6. Enrollments
  const enrollments = [
    // Student 1 (CS)
    {
      student: student1,
      items: [
        { code: "CS101", year: 1, sem: 1, grade: "A" },
        { code: "CS102", year: 1, sem: 2, grade: "B+" },
        { code: "CS201", year: 2, sem: 1, grade: "A-" },
        { code: "CS202", year: 2, sem: 2, grade: "B" },
        { code: "CS301", year: 3, sem: 1, grade: "A" },
        { code: "CS203", year: 2, sem: 3, grade: "A" },
      ],
    },
    // Student 2 (IS)
    {
      student: student2,
      items: [
        { code: "IS101", year: 1, sem: 1, grade: "A-" },
        { code: "IS102", year: 1, sem: 2, grade: "A" },
        { code: "IS201", year: 2, sem: 1, grade: "B" },
        { code: "IS202", year: 2, sem: 2, grade: "B+" },
        { code: "IS301", year: 3, sem: 1, grade: "A" },
        { code: "IS203", year: 2, sem: 4, grade: "B" },
      ],
    },
  ];

  for (const e of enrollments) {
    if (e.student.userProfile) {
      for (const item of e.items) {
        const course = createdCourses[item.code];

        await prisma.enrollment.create({
          data: {
            userProfileId: e.student.userProfile.id,
            courseId: course.id,
            year_level_taken: item.year,
            semester: item.sem,
            grade: item.grade,
            academic_year_taken: "2025",
          },
        });
      }
    }
  }

  // 7. Books
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

  // 8. Borrow Records
  // Simplify: fetch profile for student 2
  const s2Profile = await prisma.userProfile.findUnique({
    where: { userId: student2.id },
  });
  if (s2Profile) {
    await prisma.borrowRecord.create({
      data: {
        userProfileId: s2Profile.id,
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
