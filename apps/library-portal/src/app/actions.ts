"use server";

import { lendingService } from "@repo/backend";
import { revalidatePath } from "next/cache";

/**
 * Searches for books and their availability status.
 *
 * @param {string} query - The search term (Title, Author, or ISBN)
 * @returns {Promise<BookAvailabilityResult[]>} List of books with availability info
 */
export async function searchBooksAction(query: string) {
  return lendingService.checkBookAvailability(query);
}

/**
 * Processes a book loan request.
 * Resolves ISBN to Book ID and creates a borrow record.
 *
 * @param {FormData} formData - Contains studentId and isbn
 * @returns {Promise<{success: boolean}>} Result of operation
 * @throws {Error} If validation fails or book not found
 */
export async function loanBookAction(formData: FormData) {
  const studentId = formData.get("studentId") as string;
  const isbn = formData.get("isbn") as string;

  if (!studentId || !isbn) {
    throw new Error("Missing Student ID or ISBN");
  }

  // We need to resolve ISBN to Book ID for issuing
  // Or we can update LibraryService.issueBook to take ISBN, but the interface says bookId (number).
  // So we interpret ISBN -> Book ID here.
  const books = await lendingService.checkBookAvailability(isbn);
  // checkBookAvailability returns BookAvailabilityResult which has id.
  const book = books.find((b) => b.isbn === isbn);

  if (!book || !book.id) {
    throw new Error("Book not found with this ISBN");
  }

  // Issue the book
  await lendingService.issueBook(studentId, book.id);

  return { success: true };
}

/**
 * Processes a book return request.
 * Finds active loan by student and ISBN and completes it.
 *
 * @param {FormData} formData - Contains studentId and isbn
 * @returns {Promise<{success: boolean}>} Result of operation
 */
export async function returnBookAction(formData: FormData) {
  const studentId = formData.get("studentId") as string;
  const isbn = formData.get("isbn") as string;

  if (!studentId || !isbn) {
    throw new Error("Missing Student ID or ISBN");
  }

  await lendingService.returnBookByDetails(studentId, isbn);

  return { success: true };
}

/**
 * Toggles a student's library registration status.
 *
 * @param {string} studentId - The student's unique identifier
 * @returns {Promise<{success: boolean}>} Result of operation
 */
export async function toggleStudentRegistrationAction(studentId: string) {
  await lendingService.toggleStudentRegistration(studentId);
  revalidatePath("/students");
  return { success: true };
}
