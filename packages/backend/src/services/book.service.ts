// Author: Udara Shanuka
// Project: University-Portal
// FP-ID: FP-20251224-US-SERVICE-BOOK
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-24T00:00:00Z

import { BookRepository } from "../repositories/book.repository";
import { BookDTO } from "../DTOs/student.dto";
import { AppError } from "../utils/errors/app-error";

import { IBookService } from "../interfaces/book-service.interface";

import { createLogger } from "@repo/logger";

const logger = createLogger({ service: "backend-book-service" });

const __FP_SIG = "FP-20251224-US-SERVICE-BOOK|HASH-PLACEHOLDER";

const bookRepository = new BookRepository();

/**
 * Service: Book Business Logic
 * Orchestrates data fetching from Repositories and transforms raw data into DTOs.
 * Enforces business rules and handles errors.
 */
export class BookService implements IBookService {
  /**
   * Retrieves full details for a specific book.
   */
  async getBookDetails(bookId: string): Promise<BookDTO> {
    logger.debug({ bookId }, "Fetching book details");
    const id = parseInt(bookId);
    if (isNaN(id)) {
      logger.warn({ bookId }, "Invalid book ID format");
      throw new AppError("Invalid book ID", 400);
    }

    const book = await bookRepository.findBookById(id);

    if (!book) {
      logger.warn({ bookId }, "Book not found");
      throw new AppError("Book not found", 404);
    }

    return {
      id: book.id,
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      publisher: "Unknown Publisher", // Not in schema, keeping mock/default
      year: book.year,
      description: book.description || "No description available",
      isAvailable: book.available_copies > 0,
      coverImage:
        "https://images.unsplash.com/photo-1609866138210-84bb60719e37?auto=format&fit=crop&q=80&w=1000", // Not in schema, keeping default
    };
  }

  /**
   * Searches for books in the library.
   */
  async searchBooks(query: string, page: number = 1, limit: number = 10) {
    logger.debug({ query, page, limit }, "Searching books");
    const { books, total } = await bookRepository.searchBooks(
      query,
      page,
      limit
    );
    logger.debug({ count: books.length, total }, "Books found");

    const data = books.map((book) => ({
      id: book.id,
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      publisher: "Unknown Publisher", // Not in schema
      year: book.year,
      description: book.description || "No description available",
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
  }
}

export const bookService = new BookService();
