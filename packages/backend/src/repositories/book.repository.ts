// Author: Udara Shanuka
// Project: University-Portal
// FP-ID: FP-20251224-US-REPO-BOOK
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-24T00:00:00Z

import prisma from "../lib/db";
import { createLogger } from "@repo/logger";

const logger = createLogger({ service: "backend-book-repo" });

const __FP_SIG = "FP-20251224-US-REPO-BOOK|HASH-PLACEHOLDER";

/**
 * Repository: Book Data Access
 * Handles direct database interactions for book-related data using Prisma.
 * Strictly focuses on data retrieval without business logic.
 */
export class BookRepository {
  /**
   * Searches for books by query string (checks title, author, or ISBN).
   *
   * @param query - The search query
   * @returns Array of Book records
   */
  async searchBooks(query: string, page: number = 1, limit: number = 10) {
    try {
      const skip = (page - 1) * limit;
      const where: any = {};

      if (query) {
        where.OR = [
          { title: { contains: query } },
          { author: { contains: query } },
          { isbn: { contains: query } },
        ];
      }

      const [books, total] = await Promise.all([
        prisma.book.findMany({
          where,
          skip,
          take: limit,
        }),
        prisma.book.count({ where }),
      ]);

      return { books, total };
    } catch (error) {
      logger.error({ error, query, page, limit }, "Failed to search books");
      throw error;
    }
  }

  /**
   * Finds a book by its ID.
   *
   * @param bookId - The ID of the book
   * @returns Book record or null
   */
  async findBookById(bookId: number) {
    try {
      return await prisma.book.findUnique({
        where: {
          id: bookId,
        },
      });
    } catch (error) {
      logger.error({ error, bookId }, "Failed to find book by ID");
      throw error;
    }
  }
}
