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
import { DomainError, ERROR_CODES } from "../../errors";

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
        // We might want to throw 404 here, relying on BaseService or standard error
        // Since handleError throws, we can construct the error first.
        // Actually handleError wraps it.
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
        isAvailable: book.available_copies > 0,
        coverImage:
          "https://images.unsplash.com/photo-1609866138210-84bb60719e37?auto=format&fit=crop&q=80&w=1000",
      };
    } catch (err: unknown) {
      this.handleError(err, "Failed to get book details");
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
        publisher: "Unknown Publisher",
        year: book.year,
        description: "Click to view description",
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
      this.handleError(err, "Failed to search books");
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
    // Override logger service name?
    // Typescript might complain if we try to reassign readonly logger.
    // However, since it is protected, we can access it but not assign if readonly.
    // We can just use the inherited logger.
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
      const result = await prisma.book.create({
        data: {
          ...data,
          available_copies: data.available_copies ?? data.total_copies,
        },
      });
      return result;
    } catch (err) {
      this.handleError(err, "Failed to create book");
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
      this.handleError(err, "Failed to update book");
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
      this.handleError(err, "Failed to delete book");
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
      this.handleError(err, "Failed to get book by id");
    }
  }
}

export const bookReader = new BookReader();
export const bookManager = new BookManager();
