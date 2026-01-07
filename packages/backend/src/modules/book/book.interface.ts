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
 * This interface separates read operations to follow the Interface Segregation Principle (ISP).
 */
export interface IBookReader {
  /**
   * Retrieves detailed information about a specific book.
   * @param bookId - The unique identifier of the book (string format).
   * @returns A Promise resolving to the BookDTO containing book details.
   */
  getBookDetails(bookId: string): Promise<BookDTO>;

  /**
   * Searches for books based on a query string with pagination support.
   * @param query - The search query string (e.g., title, author, or ISBN).
   * @param page - The page number to retrieve (1-based index). Defaults to 1 if not provided.
   * @param limit - The number of results per page. Defaults to 10 if not provided.
   * @returns A Promise resolving to an object containing the list of books (data) and pagination metadata (meta).
   */
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
 * Extends IBookReader to include administrative capabilities like creating, updating, and deleting books.
 */
export interface IBookManager extends IBookReader {
  /**
   * Creates a new book record in the system.
   * @param data - The data required to create a book (validated by CreateBookSchema).
   * @returns A Promise resolving to the created Book entity.
   */
  createBook(data: CreateBookInput): Promise<Book>;

  /**
   * Updates an existing book record.
   * @param id - The unique identifier (numeric ID) of the book to update.
   * @param data - The data to update (validated by UpdateBookSchema). Partial updates are supported.
   * @returns A Promise resolving to the updated Book entity.
   */
  updateBook(id: number, data: UpdateBookInput): Promise<Book>;

  /**
   * Deletes a book record from the system.
   * @param id - The unique identifier (numeric ID) of the book to delete.
   * @returns A Promise resolving to the deleted Book entity.
   */
  deleteBook(id: number): Promise<Book>;

  /**
   * Retrieves a book by its numeric ID.
   * Unlike getBookDetails which returns a DTO, this returns the raw Book entity.
   * @param id - The unique identifier (numeric ID) of the book.
   * @returns A Promise resolving to the Book entity if found, or null if not found.
   */
  getBookById(id: number): Promise<Book | null>;
}
