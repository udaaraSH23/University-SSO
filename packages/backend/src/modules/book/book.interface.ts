// Author: Udara Shanuka
// Project: University-Portal
// FP-ID: FP-20251226-US-INT-BOOK
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-26T22:35:00Z

import { BookDTO } from "../student/student.dto";

const __FP_SIG = "FP-20251226-US-INT-BOOK|HASH-PLACEHOLDER";
import { CreateBookInput, UpdateBookInput } from "./book.schema";
import { Book } from "@repo/database";

/**
 * Interface: Book Reader
 * Defines the contract for read-only book operations.
 */
export interface IBookReader {
  getBookDetails(bookId: string): Promise<BookDTO>;
  searchBooks(
    query: string,
    page?: number,
    limit?: number
  ): Promise<{
    data: BookDTO[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }>;
}

/**
 * Interface: Book Manager
 * Defines the contract for book management operations (CRUD).
 * Extends IBookReader to include administrative capabilities.
 */
export interface IBookManager extends IBookReader {
  createBook(data: CreateBookInput): Promise<Book>;
  updateBook(id: number, data: UpdateBookInput): Promise<Book>;
  deleteBook(id: number): Promise<Book>;
  getBookById(id: number): Promise<Book | null>;
}
