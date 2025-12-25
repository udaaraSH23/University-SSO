// Author: Udara Shanuka
// Project: University-Portal
// FP-ID: FP-20251224-US-INTERFACE-BOOK
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-24T00:00:00Z

import { BookDTO } from "../DTOs/student.dto";

/**
 * Interface: Book Service
 * Defines the contract for book-related business logic.
 * Decouples the service implementation from consumers.
 */
export interface IBookService {
  /**
   * Retrieves full details for a specific book by its ID.
   *
   * @param bookId - The unique identifier of the book
   * @returns Promise resolving to the BookDTO
   * @throws AppError if book is not found
   */
  getBookDetails(bookId: string): Promise<BookDTO>;

  /**
   * Searches for books based on a query string.
   * Checks against title, author, and ISBN.
   *
   * @param query - The search term
   * @returns Promise resolving to an array of BookDTOs
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
