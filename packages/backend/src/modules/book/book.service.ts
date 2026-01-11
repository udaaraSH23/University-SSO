// Author: Udara Shanuka (Modified by System)
// Project: University-Portal
// FP-ID: FP-20260105-US-SVC-BOOK-V2
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2026-01-05T13:00:00Z

const __FP_SIG = "FP-20260105-US-SVC-BOOK-V2|HASH-PLACEHOLDER";

import { BaseService } from "../../common/services/base.service";
import { IBookManager, IBookReader } from "./book.interface";
import { BookRepository } from "./book.repository";
import { BookDTO } from "../student/student.dto";
import prisma from "../../lib/db";
import { CreateBookInput, UpdateBookInput } from "./book.schema";
import { Book } from "@repo/database";
import { DomainError, ERROR_CODES, RepositoryError } from "../../errors";

const bookRepository = new BookRepository();

/**
 * Book Reader Service
 *
 * Handles read-only operations for book management.
 * Provides functionality for fetching book details and searching the catalog.
 */
export class BookReader extends BaseService implements IBookReader {
  constructor() {
    super("book-reader-service");
  }

  /**
   * Retrieves detailed information for a specific book.
   *
   * @param {string} bookId - The unique identifier of the book (string format)
   * @returns {Promise<BookDTO>} Data transfer object containing book details
   * @throws {AppError} If book ID is invalid or book is not found
   */
  async getBookDetails(bookId: string): Promise<BookDTO> {
    this.logger.debug({ bookId }, "Fetching book details");
    const id = parseInt(bookId);
    if (isNaN(id)) {
      throw new DomainError(
        "Invalid book ID format",
        ERROR_CODES.VALIDATION_ERROR,
        400
      );
    }
    try {
      const book = await bookRepository.findBookById(id);
      if (!book) {
        throw new DomainError(
          "Book not found",
          ERROR_CODES.BOOK_NOT_FOUND,
          404
        );
      }

      return {
        id: book.id,
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        publisher: book.publisher || "Unknown Publisher",
        year: book.year,
        description: book.description || "No description available",
        available_copies: book.available_copies,
        total_copies: book.total_copies,
        isAvailable: book.available_copies > 0,
        coverImage:
          "https://images.unsplash.com/photo-1609866138210-84bb60719e37?auto=format&fit=crop&q=80&w=1000",
      };
    } catch (err: unknown) {
      if (err instanceof DomainError) throw err;
      if (err instanceof RepositoryError) throw err;
      throw new DomainError(
        "Failed to get book details",
        ERROR_CODES.INTERNAL_ERROR,
        500
      );
    }
  }

  /**
   * Searches for books based on a query string.
   *
   * @param {string} query - The search term (title, author, or ISBN)
   * @param {number} [page=1] - Pagination page number
   * @param {number} [limit=10] - Number of results per page
   * @returns {Promise<{data: any[], meta: any}>} Paginated search results
   */
  async searchBooks(query: string, page: number = 1, limit: number = 10) {
    this.logger.debug({ query, page, limit }, "Searching books");
    try {
      const { books, total } = await bookRepository.searchBooks(
        query,
        page,
        limit
      );

      const data = books.map((book) => ({
        id: book.id,
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        publisher: book.publisher || "Unknown Publisher",
        year: book.year,
        description: book.description || "Click to view description",
        available_copies: book.available_copies,
        total_copies: book.total_copies,
        isAvailable: book.available_copies > 0,
        coverImage:
          "https://images.unsplash.com/photo-1609866138210-84bb60719e37?auto=format&fit=crop&q=80&w=1000",
      }));

      return {
        data,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      throw new DomainError(
        "Failed to search books",
        ERROR_CODES.INTERNAL_ERROR,
        500
      );
    }
  }
}

/**
 * Book Manager Service
 *
 * Handles write operations (CRUD) for book management.
 * Extends BookReader to include administrative capabilities.
 */
export class BookManager extends BookReader implements IBookManager {
  constructor() {
    super();
  }

  /**
   * Creates a new book record.
   *
   * @param {CreateBookInput} data - Validated input data for the new book
   * @returns {Promise<Book>} The created book model
   */
  async createBook(data: CreateBookInput): Promise<Book> {
    this.logger.debug({ data }, "createBook called");
    try {
      // In a real scenario, check for duplicates here or handle DB unique constraint error
      const result = await prisma.book.create({
        data: {
          ...data,
          available_copies: data.available_copies ?? data.total_copies,
        },
      });
      return result;
    } catch (err) {
      // Assume prisma error code for unique constraint is P2002
      if ((err as any).code === "P2002") {
        throw new DomainError(
          "Book with this ISBN already exists",
          ERROR_CODES.VALIDATION_ERROR,
          409
        );
      }
      throw new RepositoryError(
        "Failed to create book",
        ERROR_CODES.DB_FAILURE
      );
    }
  }

  /**
   * Updates an existing book record.
   *
   * @param {number} id - The ID of the book to update
   * @param {UpdateBookInput} data - Partial data to update
   * @returns {Promise<Book>} The updated book model
   */
  async updateBook(id: number, data: UpdateBookInput): Promise<Book> {
    this.logger.debug({ id, data }, "updateBook called");
    try {
      const result = await prisma.book.update({
        where: { id },
        data,
      });
      return result;
    } catch (err) {
      if ((err as any).code === "P2025") {
        // Record not found
        throw new DomainError(
          "Book not found for update",
          ERROR_CODES.BOOK_NOT_FOUND,
          404
        );
      }
      throw new RepositoryError(
        "Failed to update book",
        ERROR_CODES.DB_FAILURE
      );
    }
  }

  /**
   * Deletes a book record.
   *
   * @param {number} id - The ID of the book to delete
   * @returns {Promise<Book>} The deleted book model
   */
  async deleteBook(id: number): Promise<Book> {
    this.logger.debug({ id }, "deleteBook called");
    try {
      const result = await prisma.book.delete({
        where: { id },
      });
      return result;
    } catch (err) {
      if ((err as any).code === "P2025") {
        throw new DomainError(
          "Book not found for deletion",
          ERROR_CODES.BOOK_NOT_FOUND,
          404
        );
      }
      throw new RepositoryError(
        "Failed to delete book",
        ERROR_CODES.DB_FAILURE
      );
    }
  }

  /**
   * Retrieves a raw book model by ID (for administrative purposes).
   *
   * @param {number} id - The integer ID of the book
   * @returns {Promise<Book | null>} The raw book model or null if not found
   */
  async getBookById(id: number): Promise<Book | null> {
    this.logger.debug({ id }, "getBookById called (Admin)");
    try {
      const book = await bookRepository.findBookById(id);
      return book;
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      throw new DomainError(
        "Failed to get book by id",
        ERROR_CODES.INTERNAL_ERROR,
        500
      );
    }
  }
}
export const bookReader = new BookReader();
export const bookManager = new BookManager();
