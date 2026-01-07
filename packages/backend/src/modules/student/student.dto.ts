// Author: Udara Shanuka
// Project: University-Portal
// FP-ID: FP-20251223-US-DTO-STUDENT
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-26T22:35:00Z

const __FP_SIG = "FP-20251223-US-DTO-STUDENT|HASH-PLACEHOLDER";

export interface StudentProfileDTO {
  id: number;
  student_id: string; // "ST123"
  fullName: string;
  email: string;
  gpa: number;
  degreeProgram: string;
  degreeProgramId: number;
  currentAcademicYear: string;
  level: number;
  isLibraryRegistered: boolean;
}

export interface StudentFiltersDTO {
  page?: number;
  limit?: number;
  query?: string;
  search?: string; // Alias for query
  level?: number;
  facultyId?: number;
  departmentId?: number;
  degreeProgramId?: number;
  academicYear?: string;
}

export interface PaginatedStudentsDTO {
  students: StudentProfileDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CourseDTO {
  enrollmentId: number; // Unique ID for the student's enrollment
  courseId: number;
  code: string;
  name: string;
  description: string;
  credits: number;
  status: string;
  semester: number;
  academicYear: string; // Offering Year (e.g. 2024-2025)
  level: number;
}

export interface GradeDTO {
  courseCode: string;
  courseName: string;
  grade: string;
  semester: number;
  yearLevelTaken: number;
  academicYearTaken: string;
  credits: number;
  type: string;
}

export interface BorrowedBookDTO {
  recordId: number; // Unique ID of the borrow record
  bookId: number;
  title: string;
  author: string;
  dueDate: Date;
  borrowDate: Date;
  returnDate?: Date;
  status: string;
  // Extended fields
  coverImage?: string;
  isbn?: string;
  publisher?: string;
  year?: number;
  description?: string;
}

export interface BookDTO {
  id: number;
  title: string;
  author: string;
  isbn: string;
  publisher: string;
  year: number;
  description: string;
  coverImage?: string;
  isAvailable: boolean;
}

export interface DashboardDataDTO {
  profile: StudentProfileDTO;
  courses: CourseDTO[];
  grades: GradeDTO[];
  books: BorrowedBookDTO[];
}

export interface StudentDetailDTO {
  profile: StudentProfileDTO;
  enrollments: (CourseDTO & { grade: string | null })[];
}

export interface StudentCreateDTO {
  username: string;
  email: string;
  fullName: string;
  studentId: string;
  degreeProgramId: number;
  currentAcademicYear: string;
  level: number;
}

export interface StudentUpdateDTO {
  fullName?: string;
  degreeProgramId?: number;
  currentAcademicYear?: string;
  level?: number;
}
