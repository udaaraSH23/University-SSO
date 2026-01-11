// Author: Udara Shanuka
// Project: University-Portal
// FP-ID: FP-20251226-US-INT-LENDING
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-26T22:35:00Z

import { BorrowRecord, StudentProfile, Book } from "@prisma/client";

export type EnrichedBorrowRecord = BorrowRecord & {
  studentProfile: StudentProfile;
};

export type BorrowRecordWithBook = BorrowRecord & {
  book: Book;
};

const __FP_SIG = "FP-20251226-US-INT-LENDING|HASH-PLACEHOLDER";

/**
 * Interface: Lending Service
 * Defines the contract for all lending-related operations including
 * issuing, returning, and tracking books.
 */
export interface ILendingService {
  issueBook(studentId: string, bookId: number): Promise<BorrowRecord>;
  returnBook(recordId: number): Promise<BorrowRecord>;
  returnBookByDetails(studentId: string, isbn: string): Promise<BorrowRecord>;
  getPendingBooks(): Promise<Partial<BorrowRecord>[]>;
  getLibraryDashboardStats(): Promise<LibraryDashboardStats>;
  checkBookAvailability(query: string): Promise<BookAvailabilityResult[]>;
  getStudentLibraryStats(): Promise<{
    totalStudents: number;
    registeredStudents: number;
  }>;
  searchStudentsForLibrary(query: string): Promise<StudentLibraryProfile[]>;
  getStudentBorrowHistory(
    studentId: string,
    page: number,
    limit: number
  ): Promise<{ history: BorrowRecordWithBook[]; total: number }>;
  toggleStudentRegistration(studentId: string): Promise<boolean>;
  getBookBorrowHistory(bookId: number): Promise<{
    active: EnrichedBorrowRecord[];
    history: EnrichedBorrowRecord[];
  }>;
}

/**
 * DTO: Student Library Profile
 * specific to library management view.
 */
export interface StudentLibraryProfile {
  id: number;
  studentId: string;
  fullName: string;
  email: string;
  degreeProgram: string;
  currentAcademicYear: string;
  isRegistered: boolean;
  currentLoans: BorrowRecordWithBook[];
}

export interface LibraryDashboardStats {
  availableBooks: number;
  borrowedBooks: number;
  totalBooks: number;
  totalStudents: number;
  overdueBooks: number;
  uniqueBooks: number;
}

export interface BookAvailabilityResult {
  id: number;
  title: string;
  author: string;
  isbn: string;
  totalCopies: number;
  availableCopies: number;
  nextReturnDate?: Date | null;
  borrowedBy?: string | null;
}
