// Author: Udara Shanuka
// Project: University-Portal
// FP-ID: FP-20251226-US-SVC-LENDING
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-26T22:35:00Z

import prisma from "../../lib/db";

const __FP_SIG = "FP-20251226-US-SVC-LENDING|HASH-PLACEHOLDER";
import { BorrowRecord, Prisma } from "@repo/database";
import { ILendingService, BookAvailabilityResult } from "./lending.interface";
import { BaseService } from "../../common/services/base.service";

/**
 * Service: Lending Management
 *
 * Core service for handling book loans, returns, and library statistics.
 * Manages the lifecycle of a BorrowRecord and Book availability updates.
 */
export class LendingService extends BaseService implements ILendingService {
  constructor() {
    super("backend-lending-service");
  }

  /**
   * Issues a book to a student.
   * Performs validation on student eligibility and book availability.
   * Transactionally updates book copies and creates a borrow record.
   *
   * @param {string} studentId - The unique student ID
   * @param {number} bookId - The ID of the book to issue
   * @returns {Promise<BorrowRecord>} The created borrow record
   * @throws {Error} If book unavailable, student not found, or not registered
   */
  async issueBook(studentId: string, bookId: number): Promise<BorrowRecord> {
    this.logger.debug({ studentId, bookId }, "Issuing book to student");
    try {
      const book = await prisma.book.findUnique({ where: { id: bookId } });
      if (!book || book.available_copies < 1) {
        throw new Error("Book not available");
      }

      const studentProfile = await prisma.studentProfile.findUnique({
        where: { student_id: studentId },
      });

      if (!studentProfile) {
        throw new Error("Student not found");
      }

      if (!studentProfile.isLibraryRegistered) {
        throw new Error("Student is not registered for library facilities");
      }

      const result = await prisma.$transaction(
        async (tx: Prisma.TransactionClient) => {
          await tx.book.update({
            where: { id: bookId },
            data: { available_copies: { decrement: 1 } },
          });

          const borrowDate = new Date();
          const dueDate = new Date();
          dueDate.setDate(borrowDate.getDate() + 14);

          return tx.borrowRecord.create({
            data: {
              studentProfileId: studentProfile.id,
              bookId,
              borrow_date: borrowDate,
              due_date: dueDate,
              status: "BORROWED",
            },
          });
        }
      );
      return result;
    } catch (err) {
      this.handleError(err, "Failed to issue book");
    }
  }

  async returnBookByDetails(
    studentId: string,
    isbn: string
  ): Promise<BorrowRecord> {
    this.logger.debug({ studentId, isbn }, "returnBookByDetails called");
    try {
      const book = await prisma.book.findUnique({
        where: { isbn },
      });

      if (!book) {
        throw new Error("Book not found with this ISBN");
      }

      const student = await prisma.studentProfile.findUnique({
        where: { student_id: studentId },
      });

      if (!student) {
        throw new Error("Student not found");
      }

      const record = await prisma.borrowRecord.findFirst({
        where: {
          studentProfileId: student.id,
          bookId: book.id,
          status: "BORROWED",
        },
      });

      if (!record) {
        throw new Error(
          "No active borrow record found for this student and book"
        );
      }

      return this.returnBook(record.id);
    } catch (err) {
      this.handleError(err, "Failed to return book by details");
    }
  }

  /**
   * Returns a book using the borrow record ID.
   * Transactionally updates book availability and marks record as RETURNED.
   *
   * @param {number} recordId - The ID of the borrow record
   * @returns {Promise<BorrowRecord>} The updated borrow record
   */
  async returnBook(recordId: number): Promise<BorrowRecord> {
    this.logger.debug({ recordId }, "Returning book");
    try {
      const record = await prisma.borrowRecord.findUnique({
        where: { id: recordId },
        include: { book: true },
      });

      if (!record) throw new Error("Record not found");
      if (record.status === "RETURNED")
        throw new Error("Book already returned");

      const result = await prisma.$transaction(
        async (tx: Prisma.TransactionClient) => {
          await tx.book.update({
            where: { id: record.bookId },
            data: { available_copies: { increment: 1 } },
          });

          return tx.borrowRecord.update({
            where: { id: recordId },
            data: {
              return_date: new Date(),
              status: "RETURNED",
            },
          });
        }
      );
      return result;
    } catch (err) {
      this.handleError(err, "Failed to return book");
    }
  }

  async getPendingBooks(): Promise<Partial<BorrowRecord>[]> {
    this.logger.debug({}, "getPendingBooks called");
    try {
      const result = await prisma.borrowRecord.findMany({
        where: { status: "BORROWED" },
        select: {
          id: true,
          borrow_date: true,
          due_date: true,
          status: true,
          book: {
            select: {
              id: true,
              title: true,
              author: true,
              isbn: true,
            },
          },
          studentProfile: {
            select: {
              id: true,
              full_name: true,
              student_id: true,
            },
          },
        },
      });
      return result;
    } catch (err) {
      this.handleError(err, "Failed to get pending books");
    }
  }

  async getLibraryDashboardStats(): Promise<
    import("./lending.interface").LibraryDashboardStats
  > {
    this.logger.debug({}, "getLibraryDashboardStats called");
    try {
      const [
        availableBooksAgg,
        totalBooksAgg,
        borrowedBooksCount,
        overdueBooksCount,
        uniqueBooksCount,
        totalStudentsCount,
      ] = await Promise.all([
        prisma.book.aggregate({
          _sum: {
            available_copies: true,
          },
        }),
        prisma.book.aggregate({
          _sum: {
            total_copies: true,
          },
        }),
        prisma.borrowRecord.count({
          where: {
            status: "BORROWED",
          },
        }),
        prisma.borrowRecord.count({
          where: {
            status: "BORROWED",
            due_date: {
              lt: new Date(),
            },
          },
        }),
        prisma.book.count(),
        prisma.user.count({
          where: {
            role: "STUDENT",
          },
        }),
      ]);

      const stats = {
        availableBooks: availableBooksAgg._sum.available_copies || 0,
        totalBooks: totalBooksAgg._sum.total_copies || 0,
        borrowedBooks: borrowedBooksCount,
        overdueBooks: overdueBooksCount,
        totalStudents: totalStudentsCount,
        uniqueBooks: uniqueBooksCount || 0,
      };
      return stats;
    } catch (err) {
      this.handleError(err, "Failed to get library stats");
    }
  }

  async checkBookAvailability(
    query: string
  ): Promise<BookAvailabilityResult[]> {
    this.logger.debug({ query }, "checkBookAvailability called");
    try {
      const books = await prisma.book.findMany({
        where: {
          OR: [{ title: { contains: query } }, { isbn: { contains: query } }],
        },
        select: {
          id: true,
          title: true,
          author: true,
          isbn: true,
          total_copies: true,
          available_copies: true,
        },
      });

      const results = await Promise.all(
        books.map(async (book) => {
          let nextReturnDate: Date | null | undefined = null;
          let borrowedBy: string | null | undefined = null;

          if (book.available_copies === 0) {
            const borrowRecord = await prisma.borrowRecord.findFirst({
              where: {
                bookId: book.id,
                status: "BORROWED",
              },
              orderBy: {
                due_date: "asc",
              },
              include: {
                studentProfile: true,
              },
            });

            if (borrowRecord) {
              nextReturnDate = borrowRecord.due_date;
              borrowedBy = borrowRecord.studentProfile.full_name;
            }
          }

          return {
            id: book.id,
            title: book.title,
            author: book.author,
            isbn: book.isbn,
            totalCopies: book.total_copies,
            availableCopies: book.available_copies,
            nextReturnDate,
            borrowedBy,
          };
        })
      );
      return results;
    } catch (err) {
      this.handleError(err, "Failed to check book availability");
    }
  }

  async getStudentLibraryStats(): Promise<{
    totalStudents: number;
    registeredStudents: number;
  }> {
    this.logger.debug({}, "getStudentLibraryStats called");
    try {
      const [total, registered] = await Promise.all([
        prisma.user.count({ where: { role: "STUDENT" } }),
        prisma.studentProfile.count({ where: { isLibraryRegistered: true } }),
      ]);
      return { totalStudents: total, registeredStudents: registered };
    } catch (err) {
      this.handleError(err, "Failed to get student library stats");
    }
  }

  async searchStudentsForLibrary(
    query: string
  ): Promise<import("./lending.interface").StudentLibraryProfile[]> {
    this.logger.debug({ query }, "searchStudentsForLibrary called");
    if (!query) return [];
    try {
      const students = await prisma.studentProfile.findMany({
        where: {
          OR: [
            { full_name: { contains: query } },
            { student_id: { contains: query } },
            { user: { email: { contains: query } } },
          ],
        },
        include: {
          user: true,
          degreeProgram: true,
          borrowRecords: {
            where: { status: "BORROWED" },
            include: { book: true },
          },
        },
        take: 20,
      });

      return students.map((s) => ({
        id: s.id,
        studentId: s.student_id,
        fullName: s.full_name,
        email: s.user.email,
        degreeProgram: s.degreeProgram.name,
        currentAcademicYear: s.currentAcademicYear,
        isRegistered: s.isLibraryRegistered,
        currentLoans: s.borrowRecords,
      }));
    } catch (err) {
      this.handleError(err, "Failed to search students");
    }
  }

  async getStudentBorrowHistory(
    studentId: string,
    page: number,
    limit: number
  ): Promise<{ history: BorrowRecord[]; total: number }> {
    this.logger.debug(
      { studentId, page, limit },
      "getStudentBorrowHistory called"
    );
    try {
      const student = await prisma.studentProfile.findUnique({
        where: { student_id: studentId },
      });

      if (!student) throw new Error("Student not found");

      const skip = (page - 1) * limit;

      const [history, total] = await Promise.all([
        prisma.borrowRecord.findMany({
          where: {
            studentProfileId: student.id,
            // status: { in: ["RETURNED", "BORROWED"] },
          },
          include: { book: true },
          orderBy: { borrow_date: "desc" },
          take: limit,
          skip,
        }),
        prisma.borrowRecord.count({
          where: { studentProfileId: student.id },
        }),
      ]);

      return { history, total };
    } catch (err) {
      this.handleError(err, "Failed to get student borrow history");
    }
  }

  async toggleStudentRegistration(studentId: string): Promise<boolean> {
    this.logger.debug({ studentId }, "toggleStudentRegistration called");
    try {
      const student = await prisma.studentProfile.findUnique({
        where: { student_id: studentId },
      });

      if (!student) throw new Error("Student not found");

      const newStatus = !student.isLibraryRegistered;

      await prisma.studentProfile.update({
        where: { id: student.id },
        data: { isLibraryRegistered: newStatus },
      });

      return newStatus;
    } catch (err) {
      this.handleError(err, "Failed to toggle registration");
    }
  }

  async getBookBorrowHistory(bookId: number): Promise<{
    active: BorrowRecord[];
    history: BorrowRecord[];
  }> {
    this.logger.debug({ bookId }, "getBookBorrowHistory called");
    try {
      const [active, history] = await Promise.all([
        prisma.borrowRecord.findMany({
          where: {
            bookId,
            status: "BORROWED",
          },
          include: {
            studentProfile: true,
          },
          orderBy: { borrow_date: "desc" },
        }),
        prisma.borrowRecord.findMany({
          where: {
            bookId,
            status: "RETURNED",
          },
          include: {
            studentProfile: true,
          },
          orderBy: { return_date: "desc" },
          take: 20,
        }),
      ]);

      return { active, history };
    } catch (err) {
      this.handleError(err, "Failed to get book borrow history");
    }
  }
}

export const lendingService = new LendingService();
