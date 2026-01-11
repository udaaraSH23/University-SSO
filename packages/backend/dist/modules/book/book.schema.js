// Author: Udara Shanuka
// Project: University-Portal
// FP-ID: FP-20251226-US-SCHEMA-BOOK
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-26T22:35:00Z
import { z } from "zod";
const __FP_SIG = "FP-20251226-US-SCHEMA-BOOK|HASH-PLACEHOLDER";
/**
 * Zod Schema: Create Book
 * Validates input for creating a new book record.
 */
export const CreateBookSchema = z.object({
    title: z.string().min(1, "Title is required"),
    author: z.string().min(1, "Author is required"),
    isbn: z.string().min(10, "ISBN must be at least 10 characters"),
    total_copies: z.number().int().min(1, "At least one copy is required"),
    available_copies: z.number().int().min(0).optional(),
    description: z.string().optional(),
    year: z
        .number()
        .int()
        .min(1000)
        .max(new Date().getFullYear() + 1),
    coverUrl: z.string().url().optional(),
    genre: z.string().optional(),
    publisher: z.string().optional(),
    language: z.string().min(1, "Language is required"),
});
/**
 * Zod Schema: Update Book
 * Validates input for updating an existing book record (partial updates allowed).
 */
export const UpdateBookSchema = CreateBookSchema.partial();
/**
 * Zod Schema: Borrow Book
 * Validates input for borrowing a book.
 */
export const BorrowBookSchema = z.object({
    studentId: z.string().min(1, "Student ID is required"),
    bookId: z.number().int().positive("Book ID must be valid"),
});
