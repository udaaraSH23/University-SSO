import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 1. Create Faculties
  const computingFaculty = await prisma.faculty.create({
    data: {
      name: 'Faculty of Computing',
      description: 'Faculty for Computer Science and Information Systems',
    },
  })

  // 2. Create Departments
  const csDepartment = await prisma.department.create({
    data: {
      name: 'Computer Science',
      facultyId: computingFaculty.id,
    },
  })

  const isDepartment = await prisma.department.create({
    data: {
      name: 'Information Systems',
      facultyId: computingFaculty.id,
    },
  })

  // 3. Create Degree Programs
  const csDegree = await prisma.degreeProgram.create({
    data: {
      name: 'BSc Computer Science',
      departmentId: csDepartment.id,
    },
  })

  const isDegree = await prisma.degreeProgram.create({
    data: {
      name: 'BSc Information Systems',
      departmentId: isDepartment.id,
    },
  })

  // 4. Create Users and UserProfiles
  // Admin
  await prisma.user.create({
    data: {
      username: 'admin',
      email: 'admin@university.com',
      role: 'ADMIN',
      wso2_id: 'admin-oidc-id',
      userProfile: {
        create: {
          full_name: 'System Administrator',
          email: 'admin@university.com',
        },
      },
    },
  })

  // Student 1
  const student1 = await prisma.user.create({
    data: {
      username: 'jdoe',
      email: 'jdoe@student.university.com',
      role: 'STUDENT',
      wso2_id: 'student1-oidc-id',
      userProfile: {
        create: {
          student_id: 'S1001',
          full_name: 'John Doe',
          degreeProgramId: csDegree.id,
          email: 'jdoe@student.university.com',
          gpa: 3.8,
          academic_year: '2025',
        },
      },
    },
    include: {
        userProfile: true
    }
  })

  // Student 2
  const student2 = await prisma.user.create({
    data: {
      username: 'asmith',
      email: 'asmith@student.university.com',
      role: 'STUDENT',
      wso2_id: 'student2-oidc-id',
      userProfile: {
        create: {
          student_id: 'S1002',
          full_name: 'Alice Smith',
          degreeProgramId: isDegree.id,
          email: 'asmith@student.university.com',
          gpa: 3.9,
          academic_year: '2025',
        },
      },
    },
    include: {
        userProfile: true
    }
  })

  // Librarian
  await prisma.user.create({
    data: {
      username: 'librarian',
      email: 'lib@university.com',
      role: 'LIBRARIAN',
      wso2_id: 'librarian-oidc-id',
      userProfile: {
        create: {
          full_name: 'Librarian User',
          email: 'lib@university.com',
        },
      },
    },
  })

  // 5. Create Courses
  const course1 = await prisma.course.create({
    data: {
      code: 'CS101',
      name: 'Intro to Programming',
      credits: 3,
      departmentId: csDepartment.id,
      year_level: 1,
      academic_year: '2025',
    },
  })

  const course2 = await prisma.course.create({
    data: {
      code: 'IS101',
      name: 'Intro to Information Systems',
      credits: 3,
      departmentId: isDepartment.id,
      year_level: 1,
      academic_year: '2025',
    },
  })

  // 6. Enrollments
  if (student1.userProfile) { // Prisma types might require checking relations if not included, but create returns it if included. Wait, create returns what defined.
    // Actually create returns User, userProfile is separate if not included.
    // Let's refetch or just assume IDs?
    // The previous create call returns the User object. We need to fetch the profile ID.
    // Better way in seed: create them nested, or fetch id.
    
    // Simplification: Fetch the profile
    const s1Profile = await prisma.userProfile.findUnique({ where: { userId: student1.id } })
    if (s1Profile) {
        await prisma.enrollment.create({
            data: {
                userProfileId: s1Profile.id,
                courseId: course1.id,
                semester: 1,
                academic_year: '2025',
            }
        })
    }
  }

  // 7. Books
  const book1 = await prisma.book.create({
    data: {
      title: 'The Pragmatic Programmer',
      author: 'Andy Hunt',
      isbn: '978-0201616224',
      total_copies: 5,
      available_copies: 5,
      year: 1999
    }
  })

  const book2 = await prisma.book.create({
    data: {
      title: 'Clean Code',
      author: 'Robert C. Martin',
      isbn: '978-0132350884',
      total_copies: 3,
      available_copies: 2, // Simulating one borrowed
      year: 2008
    }
  })

  // 8. Borrow Records
  // Simplify: fetch profile for student 2
  const s2Profile = await prisma.userProfile.findUnique({ where: { userId: student2.id } })
  if (s2Profile) {
      await prisma.borrowRecord.create({
          data: {
              userProfileId: s2Profile.id,
              bookId: book2.id,
              due_date: new Date(new Date().setDate(new Date().getDate() + 14)), // 14 days from now
              status: 'BORROWED'
          }
      })
  }

  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
