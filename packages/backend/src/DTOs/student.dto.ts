// Author: Udara Shanuka
// Project: University-Portal
// FP-ID: FP-20251223-US-DTO-STUDENT
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-23T09:10:00Z

const __FP_SIG = "FP-20251223-US-DTO-STUDENT|HASH-PLACEHOLDER";

export interface StudentProfileDTO {
  id: string;
  fullName: string;
  email: string;
  gpa: number;
  degreeProgram: string;
  academicYear: string;
  currentStudyYear: number;
  enrollmentYear: string;
}

export interface CourseDTO {
  courseId: number;
  code: string;
  name: string;
  description: string;
  credits: number;
  status: string;
  semester: number;
  offeringYear: string;
  year: string;
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
