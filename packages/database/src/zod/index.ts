import { z } from "zod";

// Enums (Matching Prisma Schema Logic)
export enum Role {
  STUDENT = "STUDENT",
  LIBRARIAN = "LIBRARIAN",
  ADMIN = "ADMIN",
}

export enum StaffType {
  LIBRARIAN = "LIBRARIAN",
  ADMIN = "ADMIN",
}

export enum BorrowStatus {
  BORROWED = "BORROWED",
  RETURNED = "RETURNED",
  OVERDUE = "OVERDUE",
}

export enum Grade {
  A_PLUS = "A_PLUS",
  A = "A",
  A_MINUS = "A_MINUS",
  B_PLUS = "B_PLUS",
  B = "B",
  B_MINUS = "B_MINUS",
  C_PLUS = "C_PLUS",
  C = "C",
  C_MINUS = "C_MINUS",
  D = "D",
  E = "E",
}

// Validation Regex
export const AcademicYearRegex = /^\d{4}-\d{4}$/;

// Base Schemas

export const RoleSchema = z.nativeEnum(Role);
export const StaffTypeSchema = z.nativeEnum(StaffType);
export const BorrowStatusSchema = z.nativeEnum(BorrowStatus);
export const GradeSchema = z.nativeEnum(Grade);

export const FacultySchema = z.object({
  id: z.number().int().optional(),
  name: z.string().min(1),
  description: z.string().nullable().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const DepartmentSchema = z.object({
  id: z.number().int().optional(),
  facultyId: z.number().int(),
  name: z.string().min(1),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const DegreeProgramSchema = z.object({
  id: z.number().int().optional(),
  departmentId: z.number().int(),
  name: z.string().min(1),
  intakeAcademicYear: z
    .string()
    .regex(AcademicYearRegex, "Invalid Academic Year format (YYYY-YYYY)"),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const UserSchema = z.object({
  id: z.number().int().optional(),
  username: z.string().min(1),
  email: z.string().email(),
  role: RoleSchema,
  wso2_id: z.string().min(1),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const StaffProfileSchema = z.object({
  id: z.number().int().optional(),
  userId: z.number().int(),
  staffType: StaffTypeSchema,
  fullName: z.string().min(1),
  active: z.boolean().default(true),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const StudentProfileSchema = z.object({
  id: z.number().int().optional(),
  userId: z.number().int(),
  degreeProgramId: z.number().int(),
  student_id: z.string().min(1),
  full_name: z.string().min(1),
  description: z.string().nullable().optional(),
  gpa: z.number().min(0).max(4.0).nullable().optional(),
  currentAcademicYear: z
    .string()
    .regex(AcademicYearRegex, "Invalid Academic Year format (YYYY-YYYY)"),
  level: z.number().int().min(1).max(4),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const CourseSchema = z.object({
  id: z.number().int().optional(),
  departmentId: z.number().int(),
  code: z.string().min(1),
  name: z.string().min(1),
  credits: z.number().int().min(0),
  description: z.string().nullable().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const CourseOfferingSchema = z.object({
  id: z.number().int().optional(),
  courseId: z.number().int(),
  academicYear: z
    .string()
    .regex(AcademicYearRegex, "Invalid Academic Year format (YYYY-YYYY)"),
  semester: z.number().int().min(1).max(2),
  level: z.number().int().min(1).max(4),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const EnrollmentSchema = z.object({
  id: z.number().int().optional(),
  studentProfileId: z.number().int(),
  courseOfferingId: z.number().int(),
  grade: GradeSchema.nullable().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const BookSchema = z.object({
  id: z.number().int().optional(),
  title: z.string().min(1),
  author: z.string().min(1),
  isbn: z.string().min(10), // Basic ISBN length check
  total_copies: z.number().int().min(0),
  available_copies: z.number().int().min(0),
  description: z.string().nullable().optional(),
  coverUrl: z.string().url().nullable().optional(),
  genre: z.string().nullable().optional(),
  publisher: z.string().nullable().optional(),
  language: z.string().default("English").nullable().optional(),
  year: z
    .number()
    .int()
    .min(1000)
    .max(new Date().getFullYear() + 5),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// Custom validation for Borrow Book
export const BorrowBookSchema = z
  .object({
    studentProfileId: z.number().int(),
    bookId: z.number().int(),
    borrow_date: z.date().default(() => new Date()),
    due_date: z.date(),
    return_date: z.date().nullable().optional(),
    status: BorrowStatusSchema,
  })
  .refine((data) => data.due_date > data.borrow_date, {
    message: "Due date must be after borrow date",
    path: ["due_date"],
  })
  .refine(
    (data) => {
      if (data.return_date) {
        return data.return_date >= data.borrow_date;
      }
      return true;
    },
    {
      message: "Return date must be equal to or after borrow date",
      path: ["return_date"],
    }
  );

export const SearchBooksSchema = z.object({
  query: z.string().optional(),
  genre: z.string().optional(),
  available: z.boolean().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(50).default(10),
});
